import React from 'react';
import { Gecko, SiteSettings } from '../types';

interface LandingPageProps {
  geckos: Gecko[];
  settings: SiteSettings | null;
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ geckos, settings, onEnter }) => {
  // 1. 관리자 설정 이미지 -> 첫 번째 개체 사진 -> 고정된 기본 도마뱀 이미지 순으로 노출
  const mainPhoto = settings?.landingImageUrl || (geckos.length > 0 ? geckos[0].photos[0] : 'https://images.unsplash.com/photo-1548366086-7f1b76106622?auto=format&fit=crop&q=80&w=800');

  const availableCount = geckos.filter(g => g.status === 'Available').length;
  const uniqueMorphs = new Set(geckos.map(g => g.morphId)).size;

  return (
    <div className="min-h-screen bg-[#f2f4f1] flex flex-col items-center justify-center p-4 sm:p-12 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(167,243,208,0.1)_0%,_transparent_100%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-100/20 to-transparent"></div>
        <div className="absolute -top-20 -right-20 opacity-10 blur-3xl w-96 h-96 bg-emerald-900 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 opacity-10 blur-3xl w-96 h-96 bg-green-800 rounded-full"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 relative group">
          <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full max-w-2xl mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-emerald-950">
            <img 
              src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-[3s] ease-out"
              alt="Forest Background"
            />
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-start z-20">
              <span className="text-emerald-400 font-black text-[10px] tracking-[0.4em] uppercase mb-4 drop-shadow-sm">The Experience</span>
              <h2 className="text-[4rem] sm:text-[6.5rem] font-black text-white leading-[0.8] tracking-tighter drop-shadow-md">
                VENUS<br />
                <span className="text-emerald-400">GECKO</span>
              </h2>
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-16 pointer-events-none z-10">
              <div className="w-[85%] sm:w-[80%] aspect-square rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] bg-black/10 relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none z-10"></div>
                 <img 
                    src={mainPhoto} 
                    className="w-full h-full object-cover opacity-90 scale-100 group-hover:scale-110 transition-transform duration-[5s]" 
                    alt="Main Gecko" 
                 />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 flex items-end gap-6 z-20">
               <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-sm">
                  <span className="text-white text-[10px] font-black tracking-widest uppercase">Est. 2026</span>
               </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 text-emerald-900/10 pointer-events-none rotate-45 scale-150">
             <i className="fas fa-leaf text-[15rem]"></i>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-12">
          <div className="flex flex-col items-center lg:items-start space-y-6">
            <h3 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight leading-[1.2] text-center lg:text-left">
              시간이 지나면<br />
              더 빛나는 선택,
            </h3>
            <p className="text-lg sm:text-xl text-emerald-900/50 font-medium leading-relaxed max-w-md text-center lg:text-left">
              베누스게코가 직접 브리딩한<br /> 
              특별한 크레스티드 게코를 만나보세요.
            </p>
          </div>

          <div className="w-full sm:w-auto pt-4 flex justify-center lg:justify-start">
            <button 
              onClick={onEnter}
              className="group relative px-16 py-8 bg-emerald-950 text-white font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_-15px_rgba(6,78,59,0.3)] flex items-center gap-6"
            >
              <div className="relative z-10 uppercase tracking-[0.3em] text-xs">
                Collection Entry
              </div>
              <div className="relative z-10 w-8 h-px bg-white/30 group-hover:w-12 transition-all"></div>
              <i className="fas fa-chevron-right text-[10px] relative z-10 opacity-50 group-hover:opacity-100 transition-all"></i>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          <div className="flex items-center gap-12 pt-12 border-t border-emerald-900/10 w-full lg:w-auto justify-center lg:justify-start">
             <div className="flex flex-col items-center lg:items-start">
                <p className="text-4xl font-black text-emerald-950 leading-none">{availableCount}</p>
                <p className="text-[10px] text-emerald-800/40 font-black uppercase tracking-[0.2em] mt-2">Available Now</p>
             </div>
             <div className="w-px h-10 bg-emerald-900/10"></div>
             <div className="flex flex-col items-center lg:items-start">
                <p className="text-4xl font-black text-emerald-950 leading-none">{uniqueMorphs}</p>
                <p className="text-[10px] text-emerald-800/40 font-black uppercase tracking-[0.2em] mt-2">Rare Morphs</p>
             </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute bg-emerald-400/20 rounded-full blur-sm animate-float" style={{ width: `${Math.random() * 6 + 3}px`, height: `${Math.random() * 6 + 3}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 12 + 8}s`, animationDelay: `${Math.random() * -10}s`, }} ></div>
        ))}
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translate(0, 0); opacity: 0.1; } 50% { transform: translate(30px, -30px); opacity: 0.4; } }
        .animate-float { animation: float infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default LandingPage;