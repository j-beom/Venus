import React, { useState, useMemo } from 'react';
import { Gecko, Language, Status, Gender, Morph } from '../types';
import { translations } from '../i18n';
import { db, storage } from '../firebase.ts';
import { collection, addDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

interface GeckoFormModalProps {
  gecko: Gecko | null;
  allGeckos: Gecko[];
  morphs: Morph[];
  lang: Language;
  onClose: () => void;
}

const GeckoFormModal: React.FC<GeckoFormModalProps> = ({ gecko, allGeckos, morphs, lang, onClose }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Partial<Gecko>>({
    name: gecko?.name || '',
    morphId: gecko?.morphId || '',
    morphName: gecko?.morphName || '', 
    gender: gecko?.gender || 'Unknown',
    hatchDate: gecko?.hatchDate || new Date().toISOString().split('T')[0],
    price: gecko?.price || 0,
    status: gecko?.status || 'Available',
    description: gecko?.description || '',
    photos: gecko?.photos || [],
    sireId: gecko?.sireId || '',
    damId: gecko?.damId || '',
  });

  const [sireSearch, setSireSearch] = useState('');
  const [damSearch, setDamSearch] = useState('');
  const [isSireOpen, setIsSireOpen] = useState(false);
  const [isDamOpen, setIsDamOpen] = useState(false);

  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFile = (files: FileList | null) => {
    if (!files) return;
    const array = Array.from(files).filter(f => f.type.startsWith('image/'));
    setLocalFiles(prev => [...prev, ...array]);
    const urls = array.map(f => URL.createObjectURL(f));
    setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), ...urls] }));
  };

  const removePhoto = (idx: number) => {
    const existingCount = gecko?.photos?.length || 0;
    const isLocal = idx >= existingCount;
    if (isLocal) {
        const localIdx = idx - existingCount;
        setLocalFiles(prev => prev.filter((_, i) => i !== localIdx));
    }
    setFormData(prev => ({ ...prev, photos: (prev.photos || []).filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.morphId) {
      alert('모프를 선택해주세요.');
      return;
    }
    setIsSaving(true);
    setUploadProgress(10);

    try {
      const uploadedUrls = await Promise.all(
        localFiles.map(async (file, i) => {
          const storageRef = ref(storage, `geckos/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          setUploadProgress(10 + ((i + 1) / localFiles.length) * 60);
          return url;
        })
      );

      const keptExistingPhotos = (gecko?.photos || []).filter(url => formData.photos?.includes(url) && !url.startsWith('blob:'));
      const finalPhotos = [...keptExistingPhotos, ...uploadedUrls];
      const finalData = { ...formData, photos: finalPhotos };

      if (gecko?.id) {
        await updateDoc(doc(db, 'geckos', gecko.id), finalData);
      } else {
        await addDoc(collection(db, 'geckos'), finalData);
      }
      onClose();
    } catch (err: any) {
      alert(`저장 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const breeders = allGeckos.filter(g => g.status === 'Breeder');
  
  const filteredSires = useMemo(() => {
    return breeders.filter(b => 
      b.gender === 'Male' && 
      (b.name.toLowerCase().includes(sireSearch.toLowerCase()))
    );
  }, [breeders, sireSearch]);

  const filteredDams = useMemo(() => {
    return breeders.filter(b => 
      b.gender === 'Female' && 
      (b.name.toLowerCase().includes(damSearch.toLowerCase()))
    );
  }, [breeders, damSearch]);

  const currentSireName = useMemo(() => {
    return breeders.find(b => b.id === formData.sireId)?.name || t.unknown;
  }, [breeders, formData.sireId, t.unknown]);

  const currentDamName = useMemo(() => {
    return breeders.find(b => b.id === formData.damId)?.name || t.unknown;
  }, [breeders, formData.damId, t.unknown]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl min-h-[80vh] flex flex-col p-6 sm:p-10 relative my-8 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{gecko ? '개체 수정' : '신규 개체 등록'}</h2>
          <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-black transition-colors"><i className="fas fa-times text-xl"></i></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" placeholder="개체 명칭" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Morph</label>
              <select value={formData.morphId} onChange={e => setFormData({ ...formData, morphId: e.target.value })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold">
                <option value="">모프를 선택하세요</option>
                {morphs.sort((a,b) => (a.order || 0) - (b.order || 0) || a.ko.localeCompare(b.ko)).map(m => (
                  <option key={m.id} value={m.id}>{m.ko} ({m.en})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold">
                  <option value="Unknown">{t.unsexed}</option>
                  <option value="Male">{t.male}</option>
                  <option value="Female">{t.female}</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Status</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Status })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold">
                  <option value="Available">{t.available}</option>
                  <option value="Sold">{t.sold}</option>
                  <option value="Breeder">{t.breeder}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Hatch Date</label>
                <input type="date" value={formData.hatchDate} onChange={e => setFormData({ ...formData, hatchDate: e.target.value })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Price (₩)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Photos ({formData.photos?.length || 0})</label>
              <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 cursor-pointer'}`}>
                <input type="file" disabled={isSaving} multiple accept="image/*" onChange={e => handleFile(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-2"></i>
                <p className="text-xs font-bold text-gray-400">클릭하여 이미지 추가</p>
              </div>
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {formData.photos?.map((p, idx) => (
                  <div key={idx} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-gray-100 group">
                    <img src={p} className="w-full h-full object-cover" />
                    {!isSaving && <button onClick={() => removePhoto(idx)} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><i className="fas fa-trash"></i></button>}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Searchable Parents */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Sire (Father)</label>
                <div 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm cursor-pointer flex justify-between items-center"
                  onClick={() => setIsSireOpen(!isSireOpen)}
                >
                  <span className={formData.sireId ? 'text-gray-900' : 'text-gray-400'}>{currentSireName}</span>
                  <i className={`fas fa-chevron-${isSireOpen ? 'up' : 'down'} text-xs text-gray-300`}></i>
                </div>
                
                {isSireOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b">
                      <input 
                        autoFocus
                        value={sireSearch}
                        onChange={e => setSireSearch(e.target.value)}
                        placeholder="부개체 이름 검색..."
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg outline-none text-xs font-bold"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      <div 
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs font-bold text-gray-400"
                        onClick={() => { setFormData({ ...formData, sireId: '' }); setIsSireOpen(false); setSireSearch(''); }}
                      >
                        {t.unknown} (선택 해제)
                      </div>
                      {filteredSires.map(s => (
                        <div 
                          key={s.id}
                          className="px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                          onClick={() => { setFormData({ ...formData, sireId: s.id }); setIsSireOpen(false); setSireSearch(''); }}
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0"><img src={s.photos[0]} className="w-full h-full object-cover" /></div>
                          <span className="text-xs font-black text-gray-800">{s.name}</span>
                        </div>
                      ))}
                      {filteredSires.length === 0 && <div className="p-4 text-center text-[10px] text-gray-400 font-bold">검색 결과가 없습니다.</div>}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Dam (Mother)</label>
                <div 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm cursor-pointer flex justify-between items-center"
                  onClick={() => setIsDamOpen(!isDamOpen)}
                >
                  <span className={formData.damId ? 'text-gray-900' : 'text-gray-400'}>{currentDamName}</span>
                  <i className={`fas fa-chevron-${isDamOpen ? 'up' : 'down'} text-xs text-gray-300`}></i>
                </div>
                
                {isDamOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b">
                      <input 
                        autoFocus
                        value={damSearch}
                        onChange={e => setDamSearch(e.target.value)}
                        placeholder="모개체 이름 검색..."
                        className="w-full px-3 py-2 bg-gray-50 rounded-lg outline-none text-xs font-bold"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      <div 
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-xs font-bold text-gray-400"
                        onClick={() => { setFormData({ ...formData, damId: '' }); setIsDamOpen(false); setDamSearch(''); }}
                      >
                        {t.unknown} (선택 해제)
                      </div>
                      {filteredDams.map(d => (
                        <div 
                          key={d.id}
                          className="px-4 py-3 hover:bg-pink-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                          onClick={() => { setFormData({ ...formData, damId: d.id }); setIsDamOpen(false); setDamSearch(''); }}
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0"><img src={d.photos[0]} className="w-full h-full object-cover" /></div>
                          <span className="text-xs font-black text-gray-800">{d.name}</span>
                        </div>
                      ))}
                      {filteredDams.length === 0 && <div className="p-4 text-center text-[10px] text-gray-400 font-bold">검색 결과가 없습니다.</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm h-24 resize-none" placeholder="개체 설명을 입력하세요" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {isSaving && <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>}
          <div className="flex gap-4">
            <button disabled={isSaving} onClick={handleSave} className={`flex-1 py-4 font-black rounded-2xl shadow-xl transition-all ${isSaving ? 'bg-gray-400 cursor-wait' : 'bg-gray-900 text-white hover:bg-green-700'}`}>{isSaving ? `UPLOADING (${Math.round(uploadProgress)}%)...` : (gecko ? '변경사항 저장' : '서버에 업로드')}</button>
            <button disabled={isSaving} onClick={onClose} className="px-8 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-colors">취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeckoFormModal;