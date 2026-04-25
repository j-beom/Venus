/* global React, ReactDOM, VGCtx, Topbar, HomeScreen, SaleScreen, GoodsScreen, DetailScreen, CartScreen, AdminScreen, Footer */
const { useState: uSm, useEffect: uEm, useMemo: uMm } = React;

function Frame({ width, children }) {
  // Full-bleed scroll region at given width
  return (
    <div style={{ width, height: '100%', overflowY:'auto', overflowX:'hidden', background:'var(--vg-bg)', fontFamily:'var(--vg-sans)' }} className="vg-scroll">
      {children}
    </div>
  );
}

function Prototype({ compact, initialRoute = 'home' }) {
  const [route, setRouteLocal] = uSm(initialRoute);
  const [detailId, setDetailId] = uSm('VG-001');
  const [detailSource, setDetailSource] = uSm('sale');

  uEm(() => {
    const onExt = (r) => setRouteLocal(r);
    routeSubscribers.push(onExt);
    return () => { routeSubscribers = routeSubscribers.filter(fn => fn !== onExt); };
  }, []);

  const setRoute = (r) => { setRouteLocal(r); routeState = r; };

  const openDetail = (id, src = 'sale') => {
    setDetailId(id); setDetailSource(src); setRoute('detail');
  };

  let screen;
  if (route === 'home') screen = <HomeScreen setRoute={setRoute} openDetail={openDetail} compact={compact} />;
  else if (route === 'sale') screen = <SaleScreen openDetail={openDetail} compact={compact} source="sale" />;
  else if (route === 'parents') screen = <SaleScreen openDetail={openDetail} compact={compact} source="parents" />;
  else if (route === 'minor') screen = <SaleScreen openDetail={openDetail} compact={compact} source="minor" />;
  else if (route === 'goods') screen = <GoodsScreen compact={compact} />;
  else if (route === 'detail') screen = <DetailScreen id={detailId} source={detailSource} setRoute={setRoute} openDetail={openDetail} compact={compact} />;
  else if (route === 'cart') screen = <CartScreen setRoute={setRoute} compact={compact} />;
  else if (route === 'admin') screen = <AdminScreen compact={compact} openDetail={openDetail} />;
  else screen = <HomeScreen setRoute={setRoute} openDetail={openDetail} compact={compact} />;

  return (
    <>
      <Topbar route={route} setRoute={setRoute} compact={compact} />
      <main data-screen-label={route}>{screen}</main>
      <Footer compact={compact} />
    </>
  );
}

// ───────────────────────── Tweaks + root ─────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "ko",
  "theme": "light",
  "density": "relaxed",
  "palette": "forest"
}/*EDITMODE-END*/;

function App() {
  const [lang, setLang] = uSm(TWEAK_DEFAULTS.lang);
  const [theme, setTheme] = uSm(TWEAK_DEFAULTS.theme);
  const [density, setDensity] = uSm(TWEAK_DEFAULTS.density);
  const [palette, setPalette] = uSm(TWEAK_DEFAULTS.palette);
  const [tweaksOn, setTweaksOn] = uSm(false);
  const [fullscreen, setFullscreen] = uSm(null); // null | 'desktop' | 'mobile'

  uEm(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-palette', palette);
  }, [theme, palette]);

  // Tweaks host protocol
  uEm(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOn(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOn(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const setKey = (k, v) => {
    const setters = { lang: setLang, theme: setTheme, density: setDensity, palette: setPalette };
    setters[k](v);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  const ctx = { lang, theme, density, palette, setLang: (v)=>setKey('lang', v), setTheme: (v)=>setKey('theme', v), setDensity: (v)=>setKey('density', v), setPalette: (v)=>setKey('palette', v) };

  // Apply palette variants
  uEm(() => {
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
  }, [palette]);

  return (
    <VGCtx.Provider value={ctx}>
      {/* Canvas with desktop + mobile frames side-by-side */}
      <div style={{ minHeight:'100vh', padding: 40, background:'#D7CCB3', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <header style={{ width:'100%', maxWidth: 1640, display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 28 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--vg-green)', display:'grid', placeItems:'center' }}>
              <span style={{ fontWeight: 700, color:'#0E1A14', fontSize: 14, letterSpacing:'-0.02em' }}>VG</span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing:'-0.02em', color:'var(--vg-ink)' }}>Venus Gecko</div>
              <div style={{ fontSize: 11, color:'var(--vg-muted)' }}>
                Boutique · KR/EN · responsive · {palette}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap: 10, fontFamily:'var(--vg-mono)', fontSize: 11 }}>
            <RouteChip label="Home" onClick={()=>setRouteEverywhere('home')} />
            <RouteChip label="Sale" onClick={()=>setRouteEverywhere('sale')} />
            <RouteChip label="Detail" onClick={()=>setRouteEverywhere('detail')} />
            <RouteChip label="Parents" onClick={()=>setRouteEverywhere('parents')} />
            <RouteChip label="Goods" onClick={()=>setRouteEverywhere('goods')} />
            <RouteChip label="Cart" onClick={()=>setRouteEverywhere('cart')} />
            <RouteChip label="Admin" onClick={()=>setRouteEverywhere('admin')} />
          </div>
        </header>

        <div style={{ display:'flex', gap: 40, alignItems:'flex-start', flexWrap:'wrap', justifyContent:'center' }}>
          <ArtboardCard label="Desktop · 1440" onFocus={()=>setFullscreen('desktop')}>
            <div style={{ width: 1280, height: 820, background:'var(--vg-bg)', overflow:'hidden', border:'1px solid var(--vg-line-2)' }}>
              <Frame width="100%"><Prototype compact={false} initialRoute={routeState} /></Frame>
            </div>
          </ArtboardCard>

          <ArtboardCard label="Mobile · 390" onFocus={()=>setFullscreen('mobile')}>
            <div style={{ width: 390, height: 820, background:'var(--vg-bg)', overflow:'hidden', border:'1px solid var(--vg-line-2)', borderRadius: 28 }}>
              <Frame width="100%"><Prototype compact={true} initialRoute={routeState} /></Frame>
            </div>
          </ArtboardCard>
        </div>

        <div style={{ marginTop: 40, color:'var(--vg-muted)', fontSize: 12, textAlign:'center', maxWidth: 640, lineHeight: 1.7 }}>
          동일한 단일 소스에서 렌더링된 데스크톱 & 모바일 프레임입니다. 상단 네비를 클릭하면 양쪽이 함께 이동합니다 · 우하단 Tweaks 토글로 다크/라이트 & 언어 & 팔레트 조정 가능.
        </div>
      </div>

      {fullscreen && (
        <div style={{ position:'fixed', inset:0, zIndex: 200, background:'var(--vg-bg)' }}>
          <button onClick={()=>setFullscreen(null)} style={{ position:'fixed', top: 16, right: 16, zIndex: 201, padding:'8px 14px', background:'var(--vg-ink)', color:'var(--vg-bg)', border:0, borderRadius: 8, fontSize:12, fontWeight: 500, cursor:'pointer' }}>✕ Close</button>
          <Frame width="100%"><Prototype compact={fullscreen === 'mobile'} initialRoute={routeState} /></Frame>
        </div>
      )}

      <Tweaks on={tweaksOn} lang={lang} theme={theme} palette={palette} setKey={setKey} />
    </VGCtx.Provider>
  );
}

// tiny global route sync so header buttons move both frames
let routeState = 'home';
let routeSubscribers = [];
function setRouteEverywhere(r) {
  routeState = r;
  routeSubscribers.forEach(fn => fn(r));
}

function RouteChip({ label, onClick }) {
  return <button onClick={onClick} style={{ padding:'6px 12px', border:'1px solid var(--vg-line-2)', borderRadius: 8, background:'transparent', color:'var(--vg-ink)', fontSize:12, fontWeight: 500, cursor:'pointer' }}>{label}</button>;
}

function ArtboardCard({ label, children, onFocus }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12, color:'var(--vg-ink)' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing:'0.02em', textTransform:'uppercase', color:'var(--vg-muted)' }}>{label}</span>
        <button onClick={onFocus} style={{ background:'none', border:0, color:'var(--vg-ink)', fontSize: 11, fontWeight: 500, cursor:'pointer' }}>⤢ Focus</button>
      </div>
      {children}
    </div>
  );
}

function Tweaks({ on, lang, theme, palette, setKey }) {
  return (
    <div className={`vg-tweaks ${on?'is-on':''}`}>
      <h4>Tweaks</h4>
      <div className="row"><span>Theme</span>
        <div className="seg">
          <button className={theme==='light'?'is-on':''} onClick={()=>setKey('theme','light')}>Light</button>
          <button className={theme==='dark'?'is-on':''} onClick={()=>setKey('theme','dark')}>Dark</button>
        </div>
      </div>
      <div className="row"><span>Language</span>
        <div className="seg">
          <button className={lang==='ko'?'is-on':''} onClick={()=>setKey('lang','ko')}>KR</button>
          <button className={lang==='en'?'is-on':''} onClick={()=>setKey('lang','en')}>EN</button>
        </div>
      </div>
      <div className="row"><span>Palette</span>
        <div className="seg">
          <button className={palette==='forest'?'is-on':''} onClick={()=>setKey('palette','forest')}>Forest</button>
          <button className={palette==='olive'?'is-on':''} onClick={()=>setKey('palette','olive')}>Olive</button>
          <button className={palette==='moss'?'is-on':''} onClick={()=>setKey('palette','moss')}>Moss</button>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--vg-line)', fontSize: 11, color: 'var(--vg-muted)', lineHeight: 1.6 }}>
        데스크톱·모바일 프레임 양쪽에 즉시 적용됩니다.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
