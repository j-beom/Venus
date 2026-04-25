/* global React, useT, useVG, GeckoCard, Chip, Photo, SectionHeader, StatusDot */
const { useState: uSc, useMemo: uMc } = React;

// ───────────────────────── Category / Sale list ─────────────────────────
function SaleScreen({ openDetail, compact, source = 'sale' }) {
  const t = useT(); const { lang } = useVG();
  const items = source === 'parents' ? window.VG_PARENTS : source === 'minor' ? window.VG_MINOR : (window.VG_GECKOS_STORE || window.VG_GECKOS);

  const [selGene, setSelGene] = uSc([]);        // multi
  const [selSex, setSelSex] = uSc([]);          // multi
  const [selSize, setSelSize] = uSc([]);        // multi
  const [selStatus, setSelStatus] = uSc([]);    // multi
  const [sort, setSort] = uSc('newest');
  const [q, setQ] = uSc('');
  const [mobileFilters, setMobileFilters] = uSc(false);

  const allGenes = uMc(() => {
    const source = window.VG_GECKOS_STORE || window.VG_GECKOS;
    const m = new Map();
    source.forEach(g => (g.genetics||[]).forEach(x => m.set(x, (m.get(x)||0)+1)));
    return [...m.entries()].sort((a,b)=>b[1]-a[1]);
  }, []);

  const toggle = (list, setList, v) => setList(list.includes(v) ? list.filter(x=>x!==v) : [...list, v]);

  const filtered = uMc(() => {
    let list = [...items];
    if (source === 'sale') {
      if (selGene.length) list = list.filter(g => selGene.every(x => g.genetics.includes(x)));
      if (selSex.length)  list = list.filter(g => selSex.includes(g.sex));
      if (selSize.length) list = list.filter(g => selSize.includes(g.size));
      if (selStatus.length) list = list.filter(g => selStatus.includes(g.status));
    }
    if (q.trim()) {
      const Q = q.toLowerCase();
      list = list.filter(g => (g.name||'').toLowerCase().includes(Q) || (g.nameKr||'').includes(q) || (g.id||'').toLowerCase().includes(Q));
    }
    if (sort === 'price_desc') list.sort((a,b) => (b.price||0)-(a.price||0));
    else if (sort === 'price_asc') list.sort((a,b) => (a.price||0)-(b.price||0));
    else if (sort === 'name') list.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    else list.sort((a,b) => (b.birth||'').localeCompare(a.birth||''));
    return list;
  }, [items, selGene, selSex, selSize, selStatus, sort, q, source]);

  const pad = compact ? 16 : 24;
  const title = source === 'parents' ? t.cats.parents : source === 'minor' ? t.cats.minor : t.cats.sale;
  const sub = source === 'parents' ? t.cats.parentsSub : source === 'minor' ? t.cats.minorSub : t.cats.saleSub;

  const activeCount = selGene.length + selSex.length + selSize.length + selStatus.length;
  const clearAll = () => { setSelGene([]); setSelSex([]); setSelSize([]); setSelStatus([]); setQ(''); };

  // Filter panel content (reused desktop sidebar + mobile sheet)
  const FilterPanel = ({ inSheet }) => (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <FilterSection label={t.filter.status}>
        {[['available', t.status.available], ['reserved', t.status.reserved], ['sold', t.status.sold]].map(([k,v]) => {
          const n = items.filter(x=>x.status===k).length;
          return <FilterRow key={k} label={v} count={n} on={selStatus.includes(k)} onClick={()=>toggle(selStatus,setSelStatus,k)} />;
        })}
      </FilterSection>
      <FilterSection label={t.filter.sex}>
        {[['M',t.sex.M],['F',t.sex.F],['U',t.sex.U]].map(([k,v]) => {
          const n = items.filter(x=>x.sex===k).length;
          return <FilterRow key={k} label={v} count={n} on={selSex.includes(k)} onClick={()=>toggle(selSex,setSelSex,k)} />;
        })}
      </FilterSection>
      <FilterSection label={t.filter.size}>
        {[['Baby',t.size.Baby],['Subadult',t.size.Subadult],['Adult',t.size.Adult]].map(([k,v]) => {
          const n = items.filter(x=>x.size===k).length;
          return <FilterRow key={k} label={v} count={n} on={selSize.includes(k)} onClick={()=>toggle(selSize,setSelSize,k)} />;
        })}
      </FilterSection>
      <FilterSection label={lang==='ko'?'유전자':'Genetics'} collapsible defaultOpen>
        <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>
          {allGenes.map(([g, n]) => (
            <FilterRow key={g} label={window.VG_MORPH_T(g, lang)} count={n} on={selGene.includes(g)} onClick={()=>toggle(selGene,setSelGene,g)} />
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div>
      {/* Page header — clean, no huge italic */}
      <section style={{ padding: compact ? '32px 20px 24px' : `52px ${pad}px 32px` }}>
        <div className="vg-eyebrow" style={{ marginBottom: 10 }}>{lang==='ko' ? '카테고리' : 'Category'}</div>
        <h1 style={{ margin:0, fontSize: compact ? 32 : 44, fontWeight: 600, lineHeight: 1.1, letterSpacing:'-0.03em', color:'var(--vg-ink)' }}>{title}</h1>
        <div style={{ marginTop: 8, color:'var(--vg-muted)', fontSize: 14 }}>{sub}</div>
      </section>

      {source === 'sale' ? (
        <section style={{ padding: compact ? '0 20px 80px' : `0 ${pad}px 100px`, display: compact ? 'block' : 'grid', gridTemplateColumns: compact ? undefined : '240px 1fr', gap: 36 }}>
          {/* Desktop left sidebar */}
          {!compact && (
            <aside style={{ position:'sticky', top: 72, alignSelf:'start', maxHeight:'calc(100vh - 96px)', overflowY:'auto', paddingRight: 8, paddingBottom: 24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 16, paddingBottom: 12, borderBottom:'1px solid var(--vg-line)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color:'var(--vg-ink)' }}>{lang==='ko' ? '필터' : 'Filters'}{activeCount > 0 && <span style={{ color:'var(--vg-muted)', marginLeft:6, fontWeight:500 }}>· {activeCount}</span>}</div>
                {activeCount > 0 && <button onClick={clearAll} style={{ background:'transparent', border:0, color:'var(--vg-muted)', fontSize:12, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2 }}>{lang==='ko'?'초기화':'Clear'}</button>}
              </div>
              <FilterPanel />
            </aside>
          )}

          <div>
            {/* Top bar: search + sort + mobile filter CTA */}
            <div style={{ display:'flex', gap: 10, alignItems:'center', marginBottom: 20, paddingBottom: 14, borderBottom:'1px solid var(--vg-line)', flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius:10, padding:'8px 12px', flex: compact ? '1 1 auto' : '0 1 320px' }}>
                <span style={{ color:'var(--vg-muted)', fontSize:13 }}>⌕</span>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.filter.search}
                  style={{ background:'transparent', border:0, padding:0, fontFamily:'var(--vg-sans)', fontSize:13, color:'var(--vg-ink)', width:'100%', outline:'none' }} />
              </div>
              {compact && (
                <button onClick={()=>setMobileFilters(true)} className="vg-btn-ghost" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px', border:'1px solid var(--vg-line-2)', borderRadius:10, background:'transparent', fontSize:13, fontWeight:500, cursor:'pointer', color:'var(--vg-ink)' }}>
                  {lang==='ko'?'필터':'Filter'}{activeCount > 0 && <span style={{ background:'var(--vg-ink)', color:'var(--vg-bg)', borderRadius: 100, padding:'1px 7px', fontSize: 10, fontFamily:'var(--vg-mono)' }}>{activeCount}</span>}
                </button>
              )}
              <div style={{ marginLeft:'auto', display:'flex', gap: 10, alignItems:'center', fontSize: 12, color:'var(--vg-muted)' }}>
                <span>{filtered.length} {t.generic.results}</span>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius:8, fontFamily:'var(--vg-sans)', fontSize:12, color:'var(--vg-ink)', outline:'none', padding:'7px 10px', fontWeight:500 }}>
                  <option value="newest">{t.sort.newest}</option>
                  <option value="price_desc">{t.sort.price_desc}</option>
                  <option value="price_asc">{t.sort.price_asc}</option>
                  <option value="name">{t.sort.name}</option>
                </select>
              </div>
            </div>

            {/* Active filter pills */}
            {activeCount > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 20 }}>
                {selStatus.map(k=><ActivePill key={'st'+k} label={t.status[k]} onClear={()=>toggle(selStatus,setSelStatus,k)} />)}
                {selSex.map(k=><ActivePill key={'sx'+k} label={t.sex[k]} onClear={()=>toggle(selSex,setSelSex,k)} />)}
                {selSize.map(k=><ActivePill key={'sz'+k} label={t.size[k]} onClear={()=>toggle(selSize,setSelSize,k)} />)}
                {selGene.map(k=><ActivePill key={'g'+k} label={window.VG_MORPH_T(k, lang)} onClear={()=>toggle(selGene,setSelGene,k)} />)}
                <button onClick={clearAll} style={{ background:'transparent', border:0, color:'var(--vg-muted)', fontSize:12, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2, marginLeft: 4 }}>{lang==='ko'?'전체 해제':'Clear all'}</button>
              </div>
            )}

            {/* Grid */}
            <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(3, 1fr)', gap: compact ? 14 : 22 }}>
              {filtered.map(g => <GeckoCard key={g.id} g={g} onClick={()=>openDetail(g.id, 'sale')} compact={compact} />)}
            </div>
            {filtered.length === 0 && <div style={{ textAlign:'center', color:'var(--vg-muted)', padding:'60px 0' }}>{lang==='ko' ? '조건에 맞는 개체가 없습니다.' : 'No matches.'}</div>}
          </div>
        </section>
      ) : (
        // parents / minor: simpler layout
        <section style={{ padding: compact ? '12px 20px 80px' : `0 ${pad}px 100px` }}>
          <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(3, 1fr)', gap: compact ? 14 : 22 }}>
            {filtered.map(g => <MinorCard key={g.id} g={g} onClick={()=>openDetail(g.id, source)} compact={compact} source={source} />)}
          </div>
        </section>
      )}

      {/* Mobile filter sheet */}
      {compact && mobileFilters && (
        <div onClick={()=>setMobileFilters(false)} style={{ position:'fixed', inset: 0, background:'rgba(0,0,0,.3)', zIndex: 60 }}>
          <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', bottom: 0, left: 0, right: 0, background:'var(--vg-bg)', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight:'85vh', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--vg-line)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{lang==='ko' ? '필터' : 'Filters'}</div>
              <button onClick={()=>setMobileFilters(false)} style={{ background:'transparent', border:0, fontSize:20, cursor:'pointer', color:'var(--vg-muted)' }}>✕</button>
            </div>
            <div style={{ padding: 20, overflowY:'auto', flex: 1 }}>
              <FilterPanel inSheet />
            </div>
            <div style={{ padding:'12px 20px', borderTop:'1px solid var(--vg-line)', display:'flex', gap:10 }}>
              <button onClick={clearAll} className="vg-btn vg-btn-ghost" style={{ flex: 1 }}>{lang==='ko'?'초기화':'Clear'}</button>
              <button onClick={()=>setMobileFilters(false)} className="vg-btn" style={{ flex: 2 }}>{lang==='ko'?`${filtered.length}개 보기`:`Show ${filtered.length}`}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color:'var(--vg-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom: 10 }}>{label}</div>
      <div style={{ display:'flex', flexDirection:'column', gap: 2 }}>{children}</div>
    </div>
  );
}

function FilterRow({ label, count, on, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:'flex', alignItems:'center', gap: 10, padding:'7px 10px', borderRadius: 8,
      background: on ? 'var(--vg-ink)' : 'transparent', color: on ? 'var(--vg-bg)' : 'var(--vg-ink)',
      border: 0, cursor:'pointer', fontFamily:'var(--vg-sans)', fontSize: 13, fontWeight: 500, width:'100%', textAlign:'left'
    }}
      onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--vg-bg-2)'; }}
      onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{
        width: 14, height: 14, borderRadius: 4,
        border: on ? '0' : '1.5px solid var(--vg-line-2)',
        background: on ? 'var(--vg-bg)' : 'transparent',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        color: 'var(--vg-ink)', fontSize: 10, flexShrink: 0
      }}>{on ? '✓' : ''}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count != null && <span style={{ fontSize: 11, color: on ? 'rgba(242,234,223,.6)' : 'var(--vg-muted)', fontFamily:'var(--vg-mono)' }}>{count}</span>}
    </button>
  );
}

function ActivePill({ label, onClear }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 10px', background:'var(--vg-ink)', color:'var(--vg-bg)', borderRadius: 100, fontSize: 12, fontWeight: 500 }}>
      {label}
      <button onClick={onClear} style={{ background:'transparent', border:0, color:'inherit', cursor:'pointer', padding:0, fontSize: 14, lineHeight: 1 }}>✕</button>
    </span>
  );
}

function MinorCard({ g, onClick, compact, source }) {
  const { lang } = useVG(); const t = useT();
  const tones = ['tobacco','sand','green','cream','ink'];
  const tone = tones[parseInt((g.id||'0').replace(/\D/g,'')) % tones.length];
  return (
    <article onClick={onClick} style={{ cursor:'pointer', background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 14, overflow:'hidden', transition:'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <Photo tone={tone} aspect="4/5" label={`${g.id} · ${lang==='ko' ? g.nameKr : g.name}`} radius={0} style={{ borderRadius: 0 }} />
      <div style={{ padding: compact ? '14px 14px 16px' : '18px 20px 20px' }}>
        <div style={{ fontSize: compact ? 15 : 17, fontWeight: 600, letterSpacing:'-0.015em', color:'var(--vg-ink)' }}>{lang==='ko' ? g.nameKr : g.name}</div>
        <div style={{ fontSize: 12, color:'var(--vg-muted)', marginTop: 4 }}>
          {source === 'parents' ? (g.genetics||[]).map(m=>window.VG_MORPH_T(m,lang)).join(' · ') : g.species}
        </div>
        {g.price ? (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing:'-0.015em' }}>{window.VG_FORMAT_PRICE(g.price, lang)}</div>
            {g.status && <StatusDot status={g.status} />}
          </div>
        ) : (
          source === 'parents' && g.offspring && <div style={{ marginTop: 12, fontSize: 12, color:'var(--vg-muted)' }}>{lang==='ko' ? '자손' : 'Offspring'} · {g.offspring.length}</div>
        )}
      </div>
    </article>
  );
}

// ───────────────────────── Goods catalog ─────────────────────────
function GoodsScreen({ compact }) {
  const { lang } = useVG(); const t = useT();
  const [cat, setCat] = uSc('all');
  const cats = [['all', t.filter.all], ['enclosure', lang==='ko'?'사육장':'Enclosure'], ['food', lang==='ko'?'사료':'Food'], ['decor', lang==='ko'?'인테리어':'Decor'], ['tool', lang==='ko'?'계측':'Tools'], ['bedding', lang==='ko'?'바닥재':'Bedding']];
  const items = (window.VG_GOODS_STORE || window.VG_GOODS).filter(i => cat==='all' || i.category===cat);
  const pad = compact ? 16 : 24;
  return (
    <div>
      <section style={{ padding: compact ? '32px 20px 24px' : `52px ${pad}px 32px` }}>
        <div className="vg-eyebrow" style={{ marginBottom: 10 }}>{lang==='ko' ? '카테고리' : 'Category'}</div>
        <h1 style={{ margin:0, fontSize: compact ? 32 : 44, fontWeight: 600, lineHeight: 1.1, letterSpacing:'-0.03em', color:'var(--vg-ink)' }}>{t.cats.goods}</h1>
        <div style={{ marginTop: 8, color:'var(--vg-muted)', fontSize: 14 }}>{t.cats.goodsSub}</div>
      </section>
      <section style={{ padding: `0 ${pad}px 20px` }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {cats.map(([k, v]) => <Chip key={k} on={cat===k} onClick={()=>setCat(k)} count={k==='all' ? (window.VG_GOODS_STORE||window.VG_GOODS).length : (window.VG_GOODS_STORE||window.VG_GOODS).filter(i=>i.category===k).length}>{v}</Chip>)}
        </div>
      </section>
      <section style={{ padding: compact ? '20px 20px 80px' : `24px ${pad}px 100px` }}>
        <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(3, 1fr)', gap: compact ? 14 : 22 }}>
          {items.map(i => {
            const tones = ['cream','sand','tobacco','green','ink'];
            const tone = tones[parseInt(i.id.replace(/\D/g,'')) % tones.length];
            return (
              <article key={i.id} style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius:14, overflow:'hidden' }}>
                <Photo tone={tone} aspect="1/1" label={`${i.id} · ${lang==='ko' ? i.nameKr : i.name}`} radius={0} style={{ borderRadius: 0 }} />
                <div style={{ padding: compact ? '14px 14px 16px' : '18px 20px 20px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap: 12 }}>
                    <div style={{ fontSize: compact ? 14 : 16, fontWeight: 600, letterSpacing:'-0.015em', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lang==='ko' ? i.nameKr : i.name}</div>
                    <div style={{ fontSize: compact ? 14 : 15, fontWeight: 600, letterSpacing:'-0.015em', flexShrink: 0 }}>{window.VG_FORMAT_PRICE(i.price, lang)}</div>
                  </div>
                  <div style={{ fontSize: 11, color:'var(--vg-muted)', marginTop: 6 }}>{lang==='ko' ? '재고' : 'Stock'} {i.stock}</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

window.SaleScreen = SaleScreen;
window.GoodsScreen = GoodsScreen;
