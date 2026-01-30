import React from 'react';
import { Language, Status } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  isAdmin: boolean;
  onAdminClick: () => void;
  activeTab: Status;
  setActiveTab: (s: any) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, isAdmin, onAdminClick, activeTab, setActiveTab }) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="bg-gray-900 text-white text-[10px] sm:text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 opacity-80 font-medium">
              <i className="fas fa-map-marker-alt text-green-400"></i> Korea
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="hover:text-green-400 transition font-bold uppercase"
            >
              <i className="fas fa-globe mr-1"></i> {lang === 'ko' ? 'English' : '한국어'}
            </button>
            <button 
              onClick={onAdminClick}
              className={`${isAdmin ? 'text-green-400' : 'text-gray-400'} hover:text-white transition font-black uppercase tracking-widest`}
            >
              <i className={`fas ${isAdmin ? 'fa-user-check' : 'fa-lock'} mr-1`}></i> 
              {isAdmin ? 'ADMIN ACTIVE' : 'Admin'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('Available')}>
          <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors shadow-lg">
             <span className="text-white font-black text-xl">V</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900 group-hover:text-green-800 transition-colors">VENUS GECKO</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { id: 'Available', label: t.forSale },
            { id: 'Breeder', label: t.parents },
            { id: 'Sold', label: t.soldOut },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Status)}
              className={`text-sm font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                activeTab === tab.id ? 'text-green-700' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-green-700 rounded-full animate-in slide-in-from-left-2 duration-300"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="md:hidden flex gap-5">
             <button onClick={() => setActiveTab('Available')} className={activeTab === 'Available' ? 'text-green-700' : 'text-gray-400'}><i className="fas fa-shopping-cart text-xl"></i></button>
             <button onClick={() => setActiveTab('Breeder')} className={activeTab === 'Breeder' ? 'text-green-700' : 'text-gray-400'}><i className="fas fa-dna text-xl"></i></button>
             <button onClick={() => setActiveTab('Sold')} className={activeTab === 'Sold' ? 'text-green-700' : 'text-gray-400'}><i className="fas fa-check-circle text-xl"></i></button>
        </div>
      </div>
    </header>
  );
};

export default Header;