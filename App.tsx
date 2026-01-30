import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Gecko, Language, Status, Gender, SortOption, Morph, SiteSettings } from './types.ts';
import { translations } from './i18n.ts';
import { db, auth, isFirebaseSetup } from './firebase.ts';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import Header from './components/Header.tsx';
import GeckoCard from './components/GeckoCard.tsx';
import GeckoCardSkeleton from './components/GeckoCardSkeleton.tsx';
import GeckoDetailsModal from './components/GeckoDetailsModal.tsx';
import GeckoFormModal from './components/GeckoFormModal.tsx';
import FilterBar from './components/FilterBar.tsx';
import LandingPage from './components/LandingPage.tsx';
import AdminLoginModal from './components/AdminLoginModal.tsx';
import MorphManagerModal from './components/MorphManagerModal.tsx';

const App: React.FC = () => {
  const [showMain, setShowMain] = useState(false);
  const [geckos, setGeckos] = useState<Gecko[]>([]);
  const [morphs, setMorphs] = useState<Morph[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [lang, setLang] = useState<Language>('ko');
  const [activeTab, setActiveTab] = useState<Status>('Available');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMorphManagerOpen, setIsMorphManagerOpen] = useState(false);
  const [selectedGecko, setSelectedGecko] = useState<Gecko | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGecko, setEditingGecko] = useState<Gecko | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filterMorph, setFilterMorph] = useState<string>('All');
  const [filterSire, setFilterSire] = useState<string>('All');
  const [filterDam, setFilterDam] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('dateDesc');

  const t = translations[lang];

  useEffect(() => {
    if (!isFirebaseSetup) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirebaseSetup) {
      setIsLoading(false);
      return;
    }
    
    const unsubGeckos = onSnapshot(collection(db, 'geckos'), (snapshot) => {
      setGeckos(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Gecko[]);
      setIsLoading(false);
    });

    const unsubMorphs = onSnapshot(collection(db, 'morphs'), (snapshot) => {
      setMorphs(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Morph[]);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SiteSettings);
      }
    });

    return () => {
      unsubGeckos();
      unsubMorphs();
      unsubSettings();
    };
  }, []);

  if (!isFirebaseSetup) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl animate-fade-in">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
            <i className="fas fa-plug text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Firebase 연결 대기 중</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            현재 <strong>미리보기 모드</strong>입니다.<br/>
            실제 데이터를 확인하려면 GitHub Secrets에 Firebase 설정값을 입력하고 배포가 완료되어야 합니다.
          </p>
          <div className="space-y-3">
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">배포 확인</div>
             <a 
              href="https://github.com/j-beom/Venus/actions" 
              target="_blank" 
              className="block w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs"
            >
              GitHub Actions 진행상황 보기
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleTabChange = (status: Status) => {
    setIsLoading(true);
    setActiveTab(status);
    setTimeout(() => setIsLoading(false), 400);
  };

  const getMorphName = (id: string, nameFallback?: string) => {
    const m = morphs.find(m => m.id === id);
    if (m) return lang === 'ko' ? m.ko : m.en;
    return nameFallback || 'Unknown Morph';
  };

  const filteredGeckos = useMemo(() => {
    let result = geckos.filter(g => {
      const matchTab = g.status === activeTab;
      const matchMorph = filterMorph === 'All' || g.morphId === filterMorph;
      const matchSire = filterSire === 'All' || g.sireId === filterSire;
      const matchDam = filterDam === 'All' || g.damId === filterDam;
      const matchGender = filterGender === 'All' || g.gender === filterGender;
      return matchTab && matchMorph && matchSire && matchDam && matchGender;
    });

    return result.sort((a, b) => {
      if (sortBy === 'dateDesc') return b.hatchDate.localeCompare(a.hatchDate);
      if (sortBy === 'dateAsc') return a.hatchDate.localeCompare(b.hatchDate);
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'priceAsc') return a.price - b.price;
      return 0;
    });
  }, [geckos, activeTab, filterMorph, filterSire, filterDam, filterGender, sortBy]);

  const groupedGeckos = useMemo(() => {
    const groups: Record<string, { list: Gecko[], order: number, name: string }> = {};
    
    filteredGeckos.forEach(g => {
      const morph = morphs.find(m => m.id === g.morphId);
      const morphName = morph ? (lang === 'ko' ? morph.ko : morph.en) : (g.morphName || 'Unknown');
      const order = morph?.order ?? 999;
      
      if (!groups[g.morphId || 'unknown']) {
        groups[g.morphId || 'unknown'] = { list: [], order, name: morphName };
      }
      groups[g.morphId || 'unknown'].list.push(g);
    });

    return Object.entries(groups)
      .sort((a, b) => {
        if (a[1].order !== b[1].order) return a[1].order - b[1].order;
        return a[1].name.localeCompare(b[1].name);
      })
      .map(([id, group]) => [group.name, group.list] as [string, Gecko[]]);
  }, [filteredGeckos, morphs, lang]);

  const morphListForJump = useMemo(() => groupedGeckos.map(g => g[0]), [groupedGeckos]);

  const handleDeleteGecko = useCallback(async (id: string) => {
    if (confirm('Delete this gecko?')) {
      try {
        await deleteDoc(doc(db, 'geckos', id));
        setSelectedGecko(null);
      } catch (err: any) {
        alert(`삭제 실패: ${err.message}`);
      }
    }
  }, []);

  const handleSetLandingImage = async (url: string) => {
    try {
      if (!auth.currentUser) {
        alert('관리자 로그인이 필요합니다.');
        return;
      }
      await setDoc(doc(db, 'settings', 'site'), { landingImageUrl: url }, { merge: true });
      alert('메인 이미지가 변경되었습니다.');
    } catch (err: any) {
      console.error("Landing image set error:", err);
      alert(`설정 실패: ${err.message || '권한이 없습니다. Firebase Rules를 확인하세요.'}`);
    }
  };

  const toggleStatus = useCallback(async (id: string) => {
    const gecko = geckos.find(g => g.id === id);
    if (!gecko) return;
    const nextStatus: Status = gecko.status === 'Available' ? 'Sold' : 'Available';
    try {
      await updateDoc(doc(db, 'geckos', id), { status: nextStatus });
    } catch (err: any) {
      alert(`상태 변경 실패: ${err.message}`);
    }
  }, [geckos]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!showMain) {
    return <LandingPage geckos={geckos} settings={settings} onEnter={() => setShowMain(true)} />;
  }

  return (
    <div className="min-h-screen pb-0 flex flex-col antialiased animate-fade-in">
      <Header 
        lang={lang} 
        setLang={setLang} 
        isAdmin={isAdmin} 
        onAdminClick={() => isAdmin ? handleLogout() : setIsLoginModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-grow w-full overflow-x-hidden">
        <FilterBar 
          lang={lang}
          geckos={geckos}
          morphs={morphs}
          filterMorph={filterMorph}
          setFilterMorph={setFilterMorph}
          filterSire={filterSire}
          setFilterSire={setFilterSire}
          filterDam={filterDam}
          setFilterDam={setFilterDam}
          filterGender={filterGender}
          setFilterGender={setFilterGender}
          sortBy={sortBy}
          setSortBy={setSortBy}
          groupedMorphs={morphListForJump}
        />

        {isAdmin && (
          <div className="mb-6 flex justify-end gap-3">
            <button 
              onClick={() => setIsMorphManagerOpen(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition shadow-md flex items-center gap-2"
            >
              <i className="fas fa-tags text-sm"></i> {t.manageMorphs}
            </button>
            <button 
              onClick={() => { setEditingGecko(null); setIsFormOpen(true); }}
              className="bg-green-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 transition shadow-md active:scale-95"
            >
              <i className="fas fa-plus mr-2"></i> {t.addGecko}
            </button>
          </div>
        )}

        <div className="space-y-12 mb-20">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <GeckoCardSkeleton key={i} />)}
            </div>
          ) : groupedGeckos.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <i className="fas fa-search fa-3x mb-4 opacity-20"></i>
              <p className="text-xl font-medium">No results found.</p>
            </div>
          ) : (
            groupedGeckos.map(([morphName, list]) => (
              <section key={morphName} id={`morph-${morphName}`} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{morphName}</h2>
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {list.length} Items
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {list.map(gecko => (
                    <GeckoCard 
                      key={gecko.id} 
                      gecko={gecko} 
                      lang={lang} 
                      isAdmin={isAdmin}
                      morphName={getMorphName(gecko.morphId, gecko.morphName)}
                      onView={() => setSelectedGecko(gecko)}
                      onEdit={() => { setEditingGecko(gecko); setIsFormOpen(true); }}
                      onToggleStatus={() => toggleStatus(gecko.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      {isLoginModalOpen && <AdminLoginModal onClose={() => setIsLoginModalOpen(false)} />}
      {isMorphManagerOpen && <MorphManagerModal lang={lang} onClose={() => setIsMorphManagerOpen(false)} />}

      {selectedGecko && (
        <GeckoDetailsModal 
          initialGecko={selectedGecko} 
          allGeckos={geckos}
          morphs={morphs}
          lang={lang} 
          isAdmin={isAdmin}
          onClose={() => setSelectedGecko(null)}
          onDelete={isAdmin ? () => handleDeleteGecko(selectedGecko.id) : undefined}
          onSetLanding={handleSetLandingImage}
        />
      )}

      {isFormOpen && (
        <GeckoFormModal 
          gecko={editingGecko}
          allGeckos={geckos}
          morphs={morphs}
          lang={lang}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      <footer className="bg-emerald-950 text-white pt-20 pb-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <i className="fas fa-leaf text-[20rem]"></i>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-emerald-950 font-black text-sm">V</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">VENUS GECKO</h3>
              </div>
              <div className="space-y-3">
                <p className="text-emerald-200/60 text-sm font-medium leading-relaxed max-w-xs">{t.address}</p>
                <a 
                  href="https://naver.me/x9BNqGfz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors group"
                >
                  <i className="fas fa-map-marked-alt text-xs"></i>
                  {t.getDirections}
                  <i className="fas fa-arrow-right text-[8px] transform group-hover:translate-x-1 transition-transform"></i>
                </a>
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Social</h4>
                <a 
                  href="https://www.instagram.com/venus_gecko/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-emerald-100/70 hover:text-white transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors"><i className="fab fa-instagram"></i></div>
                  <span className="text-xs font-black uppercase tracking-widest">{t.instagram}</span>
                </a>
              </div>
              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Auction</h4>
                <div className="flex flex-col gap-4">
                  <a 
                    href="https://www.band.us/@venusgecko" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 text-emerald-100/70 hover:text-white transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors"><i className="fas fa-gavel"></i></div>
                    <span className="text-xs font-black uppercase tracking-widest">밴드 경매</span>
                  </a>
                  <a 
                    href="https://www.band.us/@premiumvenus" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 text-emerald-100/70 hover:text-emerald-400 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-400 transition-colors"><i className="fas fa-crown text-emerald-500 group-hover:text-emerald-950"></i></div>
                    <span className="text-xs font-black uppercase tracking-widest">프리미엄 밴드</span>
                  </a>
                </div>
              </div>
              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Chat</h4>
                <a 
                  href="https://open.kakao.com/o/gZhaGrwg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-emerald-100/70 hover:text-white transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 transition-colors"><i className="fas fa-comment"></i></div>
                  <span className="text-xs font-black uppercase tracking-widest">{t.kakaoChat}</span>
                </a>
              </div>
              <div className="flex items-end justify-end">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500 hover:text-emerald-950 transition-all active:scale-90"><i className="fas fa-arrow-up"></i></button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.3em]">&copy; 2026 VENUS GECKO. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;