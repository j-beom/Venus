import React, { useState, useEffect } from 'react';
import { Morph, Language } from '../types';
import { db, auth } from '../firebase.ts';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

interface MorphManagerModalProps {
  lang: Language;
  onClose: () => void;
}

const MorphManagerModal: React.FC<MorphManagerModalProps> = ({ onClose }) => {
  const [morphs, setMorphs] = useState<Morph[]>([]);
  const [koInput, setKoInput] = useState('');
  const [enInput, setEnInput] = useState('');
  const [orderInput, setOrderInput] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, 'morphs'), (snapshot) => {
      setMorphs(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Morph[]);
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!koInput || !enInput) return;
    
    if (!auth.currentUser) {
      alert('관리자 로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'morphs'), { 
        ko: koInput, 
        en: enInput, 
        order: Number(orderInput) 
      });
      setKoInput('');
      setEnInput('');
      setOrderInput(morphs.length + 1);
    } catch (err: any) {
      console.error("Morph save error:", err);
      alert(`저장 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'morphs', id), { order: newOrder });
    } catch (err: any) {
      alert(`순서 업데이트 실패: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!auth.currentUser) return;
    if (confirm('모프를 삭제하시겠습니까? (이 모프를 사용하는 개체들의 표시가 부정확해질 수 있습니다.)')) {
      try {
        await deleteDoc(doc(db, 'morphs', id));
      } catch (err: any) {
        alert(`삭제 실패: ${err.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-fade-in flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter text-gray-900">
            <i className="fas fa-tags text-emerald-700"></i> 모프 관리
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black"><i className="fas fa-times text-xl"></i></button>
        </div>

        <form onSubmit={handleAdd} className="space-y-4 mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">KOREAN</label>
              <input value={koInput} onChange={e => setKoInput(e.target.value)} placeholder="예: 릴리 화이트" className="w-full px-4 py-3 bg-white border rounded-xl outline-none focus:border-emerald-500 font-bold text-sm text-gray-900" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ENGLISH</label>
              <input value={enInput} onChange={e => setEnInput(e.target.value)} placeholder="ex: Lilly White" className="w-full px-4 py-3 bg-white border rounded-xl outline-none focus:border-emerald-500 font-bold text-sm text-gray-900" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Display Order (숫자가 낮을수록 앞)</label>
            <input type="number" value={orderInput} onChange={e => setOrderInput(Number(e.target.value))} className="w-full px-4 py-3 bg-white border rounded-xl outline-none focus:border-emerald-500 font-bold text-sm text-gray-900" />
          </div>
          <button disabled={isLoading} className="w-full py-3 bg-emerald-950 text-white font-black rounded-xl hover:bg-emerald-800 transition-colors uppercase tracking-widest text-xs disabled:bg-gray-400">
            {isLoading ? 'SAVING...' : 'Add New Morph'}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
          <div className="flex items-center justify-between px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
            <span>Morph Name</span>
            <span className="mr-12">Order</span>
          </div>
          {morphs.sort((a,b) => (a.order || 0) - (b.order || 0) || a.ko.localeCompare(b.ko)).map(m => (
            <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group border border-transparent hover:border-gray-200 transition-all">
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{m.ko}</span>
                <span className="text-[10px] text-gray-400 italic">{m.en}</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={m.order || 0} 
                  onChange={(e) => handleUpdateOrder(m.id, Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center bg-white border rounded-lg font-bold text-sm focus:border-emerald-500 outline-none" 
                />
                <button onClick={() => handleDelete(m.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
          {morphs.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">등록된 모프가 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

export default MorphManagerModal;