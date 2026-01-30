import React from 'react';
import { Gecko, Language, SortOption, Morph } from '../types';
import { translations } from '../i18n';

interface FilterBarProps {
  lang: Language;
  geckos: Gecko[];
  morphs: Morph[];
  filterMorph: string;
  setFilterMorph: (m: string) => void;
  filterSire: string;
  setFilterSire: (s: string) => void;
  filterDam: string;
  setFilterDam: (d: string) => void;
  filterGender: string;
  setFilterGender: (g: string) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  groupedMorphs: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  lang, geckos, morphs,
  filterMorph, setFilterMorph,
  filterSire, setFilterSire,
  filterDam, setFilterDam,
  filterGender, setFilterGender,
  sortBy, setSortBy,
  groupedMorphs
}) => {
  const t = translations[lang];

  const sires = geckos.filter(g => g.status === 'Breeder' && g.gender === 'Male');
  const dams = geckos.filter(g => g.status === 'Breeder' && g.gender === 'Female');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`morph-${id}`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"><i className="fas fa-sliders-h text-green-600"></i></div>
          <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">{t.filterBy}</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-tighter">{t.morph}</label>
            <select value={filterMorph} onChange={e => setFilterMorph(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold">
              <option value="All">{t.all}</option>
              {morphs.sort((a,b) => a.ko.localeCompare(b.ko)).map(m => (
                <option key={m.id} value={m.id}>{lang === 'ko' ? m.ko : m.en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-tighter">{t.gender}</label>
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold">
              <option value="All">{t.all}</option>
              <option value="Male">{t.male}</option>
              <option value="Female">{t.female}</option>
              <option value="Unknown">{t.unsexed}</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-tighter">{t.sire}</label>
            <select value={filterSire} onChange={e => setFilterSire(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold">
              <option value="All">{t.all}</option>
              {sires.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-tighter">{t.dam}</label>
            <select value={filterDam} onChange={e => setFilterDam(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-bold">
              <option value="All">{t.all}</option>
              {dams.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-tighter">{t.sortBy}</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="w-full p-3 bg-gray-900 text-white border-transparent rounded-xl outline-none text-sm font-bold">
              <option value="dateDesc">{t.dateDesc}</option>
              <option value="dateAsc">{t.dateAsc}</option>
              <option value="priceDesc">{t.priceDesc}</option>
              <option value="priceAsc">{t.priceAsc}</option>
            </select>
          </div>
        </div>
      </div>

      {groupedMorphs.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">{t.quickJump}:</span>
          {groupedMorphs.map(m => (
            <button key={m} onClick={() => scrollToSection(m)} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:border-green-500 hover:text-green-600 transition shadow-sm">{m}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;