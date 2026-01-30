import React from 'react';
import { Gecko, Language } from '../types.ts';
import { translations } from '../i18n.ts';

interface GeckoCardProps {
  gecko: Gecko;
  lang: Language;
  isAdmin: boolean;
  morphName: string;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
}

const GeckoCard: React.FC<GeckoCardProps> = ({ gecko, lang, isAdmin, morphName, onView, onEdit, onToggleStatus }) => {
  const t = translations[lang];

  const formatPrice = (price: number) => {
    return lang === 'ko' ? `₩${price.toLocaleString()}` : `$${(price / 1300).toFixed(0)}`;
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'Male': return <i className="fas fa-mars text-blue-500"></i>;
      case 'Female': return <i className="fas fa-venus text-pink-500"></i>;
      default: return <i className="fas fa-question text-gray-400"></i>;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100" onClick={onView}>
        <img 
          src={gecko.photos[0] || 'https://picsum.photos/seed/placeholder/800/800'} 
          alt={gecko.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {gecko.status === 'Sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white font-black text-2xl border-4 border-white px-4 py-2 rotate-[-12deg]">SOLD</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 z-20">
            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter shadow-sm flex items-center gap-1">
                {getGenderIcon(gecko.gender)} {gecko.gender === 'Unknown' ? t.unsexed : (gecko.gender === 'Male' ? t.male : t.female)}
            </span>
        </div>
        {gecko.status === 'Available' && (
            <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
                {formatPrice(gecko.price)}
            </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate mr-2">{gecko.name}</h3>
            {isAdmin && (
                <div className="flex gap-2 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-gray-400 hover:text-blue-600 transition">
                        <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onToggleStatus(); }} className={`text-gray-400 hover:text-green-600 transition`}>
                        <i className={`fas ${gecko.status === 'Available' ? 'fa-check-circle' : 'fa-shopping-cart'}`}></i>
                    </button>
                </div>
            )}
        </div>
        <p className="text-sm text-gray-500 font-medium mb-4 truncate">{morphName}</p>
        
        <div className="mt-auto">
          <button 
            onClick={onView}
            className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-lg transition"
          >
            {t.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeckoCard;