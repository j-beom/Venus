import React, { useState, useMemo } from 'react';
import { Gecko, Language, Morph } from '../types';
import { translations } from '../i18n';

interface GeckoDetailsModalProps {
  initialGecko: Gecko;
  allGeckos: Gecko[];
  morphs: Morph[];
  lang: Language;
  isAdmin?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onSetLanding?: (url: string) => void;
}

const GeckoDetailsModal: React.FC<GeckoDetailsModalProps> = ({ initialGecko, allGeckos, morphs, lang, isAdmin, onClose, onDelete, onSetLanding }) => {
  const t = translations[lang];
  const [history, setHistory] = useState<Gecko[]>([]);
  const [currentGecko, setCurrentGecko] = useState<Gecko>(initialGecko);
  const [activePhoto, setActivePhoto] = useState(0);

  const getMorphName = (id: string, fallback?: string) => {
    const m = morphs.find(m => m.id === id);
    if (m) return lang === 'ko' ? m.ko : m.en;
    return fallback || 'Unknown';
  };

  const sire = useMemo(() => allGeckos.find(g => g.id === currentGecko.sireId), [allGeckos, currentGecko]);
  const dam = useMemo(() => allGeckos.find(g => g.id === currentGecko.damId), [allGeckos, currentGecko]);

  const handleNavigateToParent = (parent: Gecko) => {
    setHistory(prev => [...prev, currentGecko]);
    setCurrentGecko(parent);
    setActivePhoto(0);
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const prevGecko = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentGecko(prevGecko);
      setActivePhoto(0);
    }
  };

  const formatPrice = (price: number) => {
    return lang === 'ko' ? `₩${price.toLocaleString()}` : `$${(price / 1300).toFixed(0)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white sm:rounded-3xl w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative shadow-2xl">
        <div className="absolute top-4 left-4 z-30 flex gap-2">
            {history.length > 0 && (
                <button onClick={handleGoBack} className="bg-black/20 hover:bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full transition shadow-lg flex items-center gap-2 font-bold text-sm"><i className="fas fa-arrow-left"></i> {t.back}</button>
            )}
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition shadow-lg w-10 h-10 flex items-center justify-center"><i className="fas fa-times"></i></button>

        <div className="md:w-3/5 bg-gray-950 flex flex-col h-[50vh] md:h-full relative group">
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <img key={currentGecko.photos[activePhoto]} src={currentGecko.photos[activePhoto]} className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500" alt={currentGecko.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            {currentGecko.photos.length > 1 && (
                <>
                    <button onClick={() => setActivePhoto(prev => (prev - 1 + currentGecko.photos.length) % currentGecko.photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110 shadow-xl border border-white/10"><i className="fas fa-chevron-left"></i></button>
                    <button onClick={() => setActivePhoto(prev => (prev + 1) % currentGecko.photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110 shadow-xl border border-white/10"><i className="fas fa-chevron-right"></i></button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white/80 tracking-widest uppercase border border-white/10">{activePhoto + 1} / {currentGecko.photos.length}</div>
                </>
            )}
          </div>
          
          {currentGecko.photos.length > 1 && (
            <div className="p-4 flex gap-3 overflow-x-auto bg-gray-900 border-t border-white/5 scrollbar-hide justify-center">
              {currentGecko.photos.map((p, idx) => (
                <button key={idx} onClick={() => setActivePhoto(idx)} className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all transform active:scale-90 ${activePhoto === idx ? 'border-green-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-70'}`}><img src={p} className="w-full h-full object-cover" /></button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-2/5 p-6 sm:p-10 overflow-y-auto bg-white">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Premium Lineage</span>
                {currentGecko.status === 'Sold' && <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Sold Out</span>}
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{currentGecko.name}</h2>
            <p className="text-lg text-gray-400 font-medium tracking-tight">{getMorphName(currentGecko.morphId, currentGecko.morphName)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-black mb-1 tracking-widest">{t.gender}</p>
              <p className="font-black flex items-center gap-2 text-gray-800">{currentGecko.gender === 'Male' && <i className="fas fa-mars text-blue-500"></i>}{currentGecko.gender === 'Female' && <i className="fas fa-venus text-pink-500"></i>}{currentGecko.gender === 'Unknown' && <i className="fas fa-question text-gray-400"></i>}{currentGecko.gender === 'Unknown' ? t.unsexed : (currentGecko.gender === 'Male' ? t.male : t.female)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-black mb-1 tracking-widest">{t.hatchDate}</p>
              <p className="font-black text-gray-800">{currentGecko.hatchDate}</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><div className="w-1 h-4 bg-green-500 rounded-full"></div>Lineage Tree</h4>
            <div className="space-y-3">
              <div onClick={() => sire && handleNavigateToParent(sire)} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all group ${sire ? 'border-blue-50 bg-white cursor-pointer hover:border-blue-200 hover:shadow-xl hover:-translate-y-1' : 'border-dashed border-gray-100 opacity-50'}`}><div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">{sire?.photos[0] ? <img src={sire.photos[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="fas fa-dna text-gray-300"></i></div>}</div><div className="flex-1"><p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{t.sire}</p><p className="font-black text-gray-900 leading-tight">{sire ? sire.name : t.unknown}</p></div>{sire && <i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-500 transition-colors"></i>}</div>
              <div onClick={() => dam && handleNavigateToParent(dam)} className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all group ${dam ? 'border-pink-50 bg-white cursor-pointer hover:border-pink-200 hover:shadow-xl hover:-translate-y-1' : 'border-dashed border-gray-100 opacity-50'}`}><div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">{dam?.photos[0] ? <img src={dam.photos[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><i className="fas fa-dna text-gray-300"></i></div>}</div><div className="flex-1"><p className="text-[9px] font-black text-pink-500 uppercase tracking-widest">{t.dam}</p><p className="font-black text-gray-900 leading-tight">{dam ? dam.name : t.unknown}</p></div>{dam && <i className="fas fa-chevron-right text-gray-300 group-hover:text-pink-500 transition-colors"></i>}</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 text-white mb-8 shadow-2xl shadow-gray-200 border border-white/10">
            <div className="flex justify-between items-center mb-1"><p className="text-gray-400 text-[11px] font-black uppercase tracking-widest">{t.price}</p>{currentGecko.status === 'Sold' && <span className="bg-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded border border-red-500/20">SOLD</span>}</div>
            <p className="text-5xl font-black tracking-tighter">{currentGecko.status === 'Breeder' ? 'NFS' : formatPrice(currentGecko.price)}</p>
          </div>

          <div className="flex flex-col gap-3 mb-10">
            {isAdmin && onSetLanding && (
               <button onClick={() => onSetLanding(currentGecko.photos[activePhoto])} className="w-full py-4 bg-emerald-100 text-emerald-800 font-black rounded-2xl hover:bg-emerald-200 transition-all flex items-center justify-center gap-2 border border-emerald-200"><i className="fas fa-image"></i> {t.setAsMain}</button>
            )}
            {onDelete && history.length === 0 && (
               <button onClick={onDelete} className="w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100"><i className="fas fa-trash-alt text-sm"></i> {t.delete}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeckoDetailsModal;