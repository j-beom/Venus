/* global React, useT, useVG, VGLogo, VGWordmark, Chip, Photo, GeckoCard, SectionHeader */
const { useState: uS, useMemo: uM } = React;

function Topbar({ route, setRoute, compact }) {
  const t = useT(); const { lang, setLang } = useVG();
  const items = [['home', t.nav.home], ['sale', t.nav.sale], ['parents', t.nav.parents], ['minor', t.nav.minor], ['goods', t.nav.goods], ['admin', lang==='ko'?'관리자':'Admin']];
  return (
    <header style={{ position:'sticky', top:0, zIndex: 50, background: 'rgba(242,234,223,0.92)', backdropFilter:'blur(12px)', borderBottom: '1px solid var(--vg-line)' }}>
      <div style={{ display:'flex', alignItems:'center', padding: compact ? '14px 20px' : '14px 32px', gap: compact ? 12 : 32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', flexShrink: 0 }} onClick={() => setRoute('home')}>
          <VGLogo size={compact ? 28 : 32} />
          {!compact && <VGWordmark />}
        </div>
        {!compact && (
          <nav style={{ display:'flex', gap:4, marginLeft: 20 }}>
            {items.map(([k, v]) => (
              <button key={k} onClick={() => setRoute(k)} style={{ background: route===k ? 'var(--vg-bg-2)' : 'transparent', border:0, cursor:'pointer', padding:'8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: route === k ? 'var(--vg-ink)' : 'var(--vg-muted)' }}>{v}</button>
            ))}
          </nav>
        )}
        <div style={{ marginLeft:'auto', display:'flex', gap: 8, alignItems:'center' }}>
          <div style={{ display:'flex', border:'1px solid var(--vg-line-2)', borderRadius: 8, overflow:'hidden' }}>
            {['ko','en'].map(L => (
              <button key={L} onClick={() => setLang(L)} style={{ background: lang===L ? 'var(--vg-ink)' : 'transparent', color: lang===L ? 'var(--vg-bg)' : 'var(--vg-ink)', border:0, padding:'6px 10px', fontSize:11, fontWeight:600, cursor:'pointer' }}>{L.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => setRoute('cart')} style={{ background:'transparent', border:'1px solid var(--vg-line-2)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor:'pointer', color:'var(--vg-ink)' }}>
            {lang==='ko' ? '장바구니' : 'Cart'} · 2
          </button>
        </div>
      </div>
    </header>
  );
}

function HomeScreen({ setRoute, openDetail, compact }) {
  const t = useT(); const { lang } = useVG();
  const featured = window.VG_GECKOS.filter(g => g.featured).slice(0, compact ? 3 : 4);
  const pad = compact ? 16 : 24;
  return (
    <div>
      <section style={{ padding: compact ? '48px 20px 56px' : '64px 24px 80px', display:'grid', gridTemplateColumns: compact ? '1fr' : '1.1fr 1fr', gap: compact ? 32 : 60, alignItems:'center' }}>
        <div>
          <div style={{ display:'inline-block', padding:'4px 10px', background:'var(--vg-bg-2)', borderRadius: 100, fontSize: 11, fontWeight: 500, color:'var(--vg-ink-2)', marginBottom: 22 }}>
            {lang==='ko' ? 'Collection · 2026 Spring' : 'Collection · 2026 Spring'}
          </div>
          <h1 style={{ margin:0, fontSize: compact ? 40 : 60, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.03em', color:'var(--vg-ink)' }}>
            {lang==='ko' ? (<>크레스티드 게코,<br/>한 마리씩 정성껏.</>) : (<>Crested geckos,<br/>raised with care.</>)}
          </h1>
          <p style={{ maxWidth: 440, marginTop: 22, fontSize: 15, lineHeight: 1.65, color:'var(--vg-muted)' }}>
            {lang==='ko' ? '혈통과 건강이 투명하게 기록된 개체만 분양합니다. 사육 용품과 관리 노트도 함께 제공합니다.' : 'Every animal ships with transparent lineage and health records, paired with husbandry goods and care notes.'}
          </p>
          <div style={{ display:'flex', gap:10, marginTop: 32 }}>
            <button className="vg-btn vg-btn-primary" onClick={() => setRoute('sale')}>{t.hero.cta}</button>
            <button className="vg-btn vg-btn-ghost" onClick={() => setRoute('minor')}>{lang==='ko' ? '비주류 보기' : 'Other species'}</button>
          </div>
          <div style={{ display:'flex', gap: 28, marginTop: 42 }}>
            {[[lang==='ko'?'현재 분양':'Available', '24'],[lang==='ko'?'비주류':'Other species','12'],[lang==='ko'?'누적 분양':'Adopted','312']].map(([k,v])=>(
              <div key={k}><div style={{fontSize:22,fontWeight:600,letterSpacing:'-0.02em'}}>{v}</div><div style={{fontSize:11,color:'var(--vg-muted)',marginTop:2}}>{k}</div></div>
            ))}
          </div>
        </div>
        <Photo tone="green" aspect={compact ? '4/5' : '4/5'} label={lang==='ko' ? 'Obsidian · VG-001' : 'Obsidian · VG-001'} radius={16} />
      </section>

      <section style={{ padding: `0 ${pad}px`, marginBottom: compact ? 56 : 88 }}>
        <SectionHeader eyebrow={lang==='ko' ? '카테고리' : 'Categories'} title={lang==='ko' ? '분양 라인업' : 'Lineup'} />
        <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginTop: 24 }}>
          {[['sale','green',t.cats.sale,t.cats.saleSub,'24'],['minor','ink',t.cats.minor,t.cats.minorSub,'12'],['goods','cream',t.cats.goods,t.cats.goodsSub,'46']].map(([k,tone,title,sub,n]) => (
            <button key={k} onClick={()=>setRoute(k)} style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 14, padding: 0, cursor:'pointer', textAlign:'left', overflow:'hidden' }}>
              <Photo tone={tone} aspect="4/3" radius={0} style={{borderRadius:0}} />
              <div style={{ padding: compact ? '14px 14px 16px' : '18px 20px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontSize: compact ? 15 : 17, fontWeight: 600, letterSpacing:'-0.015em' }}>{title}</span>
                  <span style={{ fontSize: 11, color:'var(--vg-muted)', fontFamily:'var(--vg-mono)' }}>{n}</span>
                </div>
                <div style={{ fontSize: 12, color:'var(--vg-muted)', marginTop: 6 }}>{sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: `0 ${pad}px`, marginBottom: compact ? 56 : 88 }}>
        <SectionHeader eyebrow={lang==='ko' ? '주목할 개체' : 'Featured'} title={lang==='ko' ? '이번 시즌' : 'This season'}
          right={<button className="vg-btn-link" onClick={()=>setRoute('sale')}>{t.generic.viewAll} →</button>} />
        <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(4, 1fr)', gap: compact ? 14 : 22, marginTop: 24 }}>
          {featured.map(g => <GeckoCard key={g.id} g={g} onClick={() => openDetail(g.id)} />)}
        </div>
      </section>

      <section style={{ background: 'var(--vg-green)', color: 'var(--vg-cream)', padding: compact ? '56px 20px' : '72px 24px', marginBottom: compact ? 56 : 88, borderRadius: 20, marginLeft: pad, marginRight: pad }}>
        <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: compact ? 32 : 60, alignItems:'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color:'var(--vg-sand)', marginBottom: 16 }}>{lang==='ko' ? '혈통 기록' : 'Lineage'}</div>
            <h3 style={{ margin:0, fontSize: compact ? 30 : 44, fontWeight: 600, lineHeight: 1.1, letterSpacing:'-0.025em' }}>
              {lang==='ko' ? '한 마리마다 한 페이지의 기록.' : 'One page per animal.'}
            </h3>
            <p style={{ marginTop: 22, maxWidth: 420, lineHeight: 1.7, color: 'rgba(232,220,196,0.8)', fontSize: 14 }}>
              {lang==='ko' ? '부모 개체의 유전자, 클러치 번호, 검역 기록, 급여 로그를 한 곳에서 확인합니다. 분양 이후에도 계보는 남습니다.' : 'Parent genetics, clutch numbers, quarantine logs, feeding notes — all in one place, kept forever after adoption.'}
            </p>
            <button className="vg-btn" onClick={()=>setRoute('parents')} style={{ marginTop: 28, background:'var(--vg-cream)', color:'var(--vg-green-dark)', borderColor:'var(--vg-cream)' }}>
              {lang==='ko' ? '부모 개체 보기' : 'Parent lines'}
            </button>
          </div>
          <Photo tone="ink" aspect="4/5" label={lang==='ko' ? 'Zeus × Freya · P-003, P-002' : 'Zeus × Freya'} radius={16} />
        </div>
      </section>
    </div>
  );
}

window.Topbar = Topbar;
window.HomeScreen = HomeScreen;
