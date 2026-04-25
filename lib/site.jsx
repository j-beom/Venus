/* global React, ReactDOM, VGCtx, Topbar, HomeScreen, SaleScreen, GoodsScreen, DetailScreen, CartScreen, AdminScreen, Footer */
// Production site entry — single responsive app, no design-canvas chrome.
// Uses the same components as Venus Gecko.html. compact prop is derived from
// viewport width so the layout adapts naturally on phones / tablets / desktops.

const { useState: uSs, useEffect: uEs } = React;

function useIsCompact(breakpoint = 720) {
  const [compact, setCompact] = uSs(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  uEs(() => {
    const onResize = () => setCompact(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return compact;
}

function Site() {
  const compact = useIsCompact();

  const [route, setRoute] = uSs('home');
  const [detailId, setDetailId] = uSs('VG-001');
  const [detailSource, setDetailSource] = uSs('sale');

  const [lang, setLang] = uSs('ko');
  const [theme, setTheme] = uSs('light');
  const [palette, setPalette] = uSs('forest');

  uEs(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-palette', palette);
    const r = document.documentElement.style;
    if (palette === 'forest') {
      r.setProperty('--vg-green', '#1F3A2E');
      r.setProperty('--vg-green-dark', '#132520');
      r.setProperty('--vg-tobacco', '#6B4423');
      r.setProperty('--vg-cream', '#E8DCC4');
    } else if (palette === 'olive') {
      r.setProperty('--vg-green', '#3C4A2A');
      r.setProperty('--vg-green-dark', '#28331A');
      r.setProperty('--vg-tobacco', '#7A5A2E');
      r.setProperty('--vg-cream', '#EFE5CA');
    } else if (palette === 'moss') {
      r.setProperty('--vg-green', '#2D5A3A');
      r.setProperty('--vg-green-dark', '#1E3D28');
      r.setProperty('--vg-tobacco', '#5E3A1C');
      r.setProperty('--vg-cream', '#E2D4B6');
    }
  }, [theme, palette]);

  const ctx = { lang, theme, density: 'relaxed', palette,
    setLang, setTheme, setDensity: () => {}, setPalette };

  const openDetail = (id, src = 'sale') => {
    setDetailId(id); setDetailSource(src); setRoute('detail');
    window.scrollTo(0, 0);
  };
  const goRoute = (r) => { setRoute(r); window.scrollTo(0, 0); };

  let screen;
  if (route === 'home') screen = <HomeScreen setRoute={goRoute} openDetail={openDetail} compact={compact} />;
  else if (route === 'sale') screen = <SaleScreen openDetail={openDetail} compact={compact} source="sale" />;
  else if (route === 'parents') screen = <SaleScreen openDetail={openDetail} compact={compact} source="parents" />;
  else if (route === 'minor') screen = <SaleScreen openDetail={openDetail} compact={compact} source="minor" />;
  else if (route === 'goods') screen = <GoodsScreen compact={compact} />;
  else if (route === 'detail') screen = <DetailScreen id={detailId} source={detailSource} setRoute={goRoute} openDetail={openDetail} compact={compact} />;
  else if (route === 'cart') screen = <CartScreen setRoute={goRoute} compact={compact} />;
  else if (route === 'admin') screen = <AdminScreen compact={compact} openDetail={openDetail} />;
  else screen = <HomeScreen setRoute={goRoute} openDetail={openDetail} compact={compact} />;

  return (
    <VGCtx.Provider value={ctx}>
      <div style={{ minHeight: '100vh', background: 'var(--vg-bg)', fontFamily: 'var(--vg-sans)', color: 'var(--vg-ink)' }}>
        <Topbar route={route} setRoute={goRoute} compact={compact} />
        <main data-screen-label={route}>{screen}</main>
        <Footer compact={compact} />
      </div>
    </VGCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Site />);
