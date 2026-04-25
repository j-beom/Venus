/* global React */
// Shared UI atoms for Venus Gecko — cleaner Toss/Claude-style type

const { useState, useEffect, useMemo, useRef, useContext, createContext } = React;

const VGCtx = createContext({ lang: 'ko', theme: 'light', setLang: () => {}, setTheme: () => {} });

function useVG() { return useContext(VGCtx); }
function useT() {
  const { lang } = useVG();
  return window.VG_I18N[lang];
}

function VGLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Venus Gecko">
      <circle cx="50" cy="50" r="49" fill="var(--vg-green)" />
      <text x="34" y="56" fontSize="46" fontFamily="serif" fontStyle="italic" fontWeight="700" fill="#0E1A14" textAnchor="middle">V</text>
      <text x="64" y="78" fontSize="42" fontFamily="serif" fontStyle="italic" fontWeight="700" fill="#0E1A14" textAnchor="middle">G</text>
    </svg>
  );
}

function VGWordmark({ color }) {
  return (
    <span style={{ fontFamily:'var(--vg-sans)', fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: color || 'inherit' }}>
      Venus Gecko
    </span>
  );
}

function Chip({ on, onClick, children, count }) {
  return (
    <button className={`vg-chip ${on ? 'is-on' : ''}`} onClick={onClick}>
      {children}
      {count != null && <span className="vg-chip-count">{count}</span>}
    </button>
  );
}

function Photo({ tone = 'default', aspect = '4/3', label, children, style, radius = 12 }) {
  const cls = tone === 'default' ? '' : `vg-photo-${tone}`;
  return (
    <div className={`vg-photo ${cls}`} style={{ aspectRatio: aspect, width: '100%', borderRadius: radius, ...style }}>
      {children}
      {label && <span className="vg-photo-label">{label}</span>}
    </div>
  );
}

function StatusDot({ status }) {
  const t = useT();
  return (
    <span className={`vg-status-${status}`} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize: 12, fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {t.status[status]}
    </span>
  );
}

function GeckoCard({ g, onClick, compact = false }) {
  const t = useT(); const { lang } = useVG();
  const tones = ['green', 'tobacco', 'cream', 'sand', 'ink'];
  const tone = tones[parseInt(g.id.replace(/\D/g,'')) % tones.length];
  const morphs = (g.genetics||[]).map(m => window.VG_MORPH_T(m, lang)).join(' · ');
  return (
    <article onClick={onClick} style={{ cursor:'pointer', background: 'var(--vg-paper)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--vg-line)', transition: 'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      <Photo tone={tone} aspect={compact ? '1/1' : '4/5'} label={`${g.id} · ${lang==='ko' ? g.nameKr : g.name}`} radius={0} style={{ borderRadius: 0 }}>
        <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:6 }}>
          {g.featured && <span style={{ fontSize:10, fontWeight:600, padding:'4px 8px', background:'var(--vg-paper)', color:'var(--vg-ink)', borderRadius: 6 }}>FEATURED</span>}
        </div>
        <div style={{ position:'absolute', top:12, right:12, padding:'4px 8px', background:'var(--vg-paper)', borderRadius: 6 }}>
          <StatusDot status={g.status} />
        </div>
      </Photo>
      <div style={{ padding: compact ? '14px 14px 16px' : '18px 20px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: compact ? 15 : 17, fontWeight: 600, letterSpacing:'-0.015em', color:'var(--vg-ink)' }}>
              {lang==='ko' ? g.nameKr : g.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--vg-muted)', marginTop: 4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {morphs}
            </div>
          </div>
          <div style={{ textAlign:'right', flexShrink: 0 }}>
            <div style={{ fontSize: compact ? 14 : 16, fontWeight: 600, letterSpacing:'-0.015em' }}>{window.VG_FORMAT_PRICE(g.price, lang)}</div>
            <div style={{ fontSize: 11, color:'var(--vg-muted)', marginTop: 4 }}>
              {t.sex[g.sex]} · {t.size[g.size]}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({ eyebrow, title, right }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:24, padding:'0 0 20px', borderBottom: '1px solid var(--vg-line)' }}>
      <div>
        {eyebrow && <div className="vg-eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>}
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.025em', color:'var(--vg-ink)' }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

// ── PedigreeNode: one card in the multi-gen lineage tree.
// Recursive: if the parent has its own sire/dam, the node is expandable.
function PedigreeNode({ id, role, gen, openDetail, lang, t, defaultOpen }) {
  const all = window.VG_PARENTS || [];
  const p = all.find(x => x.id === id);
  const [open, setOpen] = useState(!!defaultOpen);

  const tones = ['green','tobacco','ink','sand','cream'];
  const tone = tones[gen % tones.length];

  // Unknown / undocumented ancestor
  if (!p) {
    return (
      <div style={{ background:'var(--vg-bg-2)', border:'1px dashed var(--vg-line-2)', borderRadius: 12, padding:'14px 16px' }}>
        <div className="vg-eyebrow" style={{ marginBottom: 4 }}>{role}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color:'var(--vg-muted)' }}>
          {lang==='ko' ? '정보 없음' : 'No record'}
        </div>
      </div>
    );
  }

  const hasParents = !!(p.sire || p.dam);
  const sex = p.sex === 'M' ? '♂' : p.sex === 'F' ? '♀' : '·';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
      <div
        onClick={() => openDetail && openDetail(p.id, 'parents')}
        style={{
          background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 12,
          overflow:'hidden', cursor: openDetail ? 'pointer' : 'default',
          display:'grid', gridTemplateColumns: '64px 1fr auto', alignItems:'center', gap: 14, padding: 10
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 8, overflow:'hidden', flexShrink: 0 }}>
          <Photo tone={tone} aspect="1/1" radius={0} style={{ borderRadius: 0, width: '100%', height: '100%' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="vg-eyebrow" style={{ marginBottom: 4 }}>{role} · {p.id}</div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing:'-0.015em', color:'var(--vg-ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {sex} {lang==='ko' ? p.nameKr : p.name}
          </div>
          <div style={{ fontSize: 11, color:'var(--vg-muted)', marginTop: 3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {(p.genetics||[]).map(m=>window.VG_MORPH_T(m,lang)).join(' · ') || '—'}
          </div>
        </div>
        {hasParents && (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
            style={{ background:'var(--vg-bg-2)', border:'1px solid var(--vg-line-2)', borderRadius: 8, padding:'6px 10px', fontSize: 11, fontWeight: 500, color:'var(--vg-ink-2)', cursor:'pointer', whiteSpace:'nowrap' }}
            title={open ? (lang==='ko'?'접기':'Collapse') : (lang==='ko'?'펼치기':'Expand')}
          >
            {open ? '−' : '+'} {lang==='ko' ? `${gen+1}대` : `Gen ${gen+1}`}
          </button>
        )}
      </div>

      {hasParents && open && (
        <div style={{ marginLeft: 18, paddingLeft: 18, borderLeft: '1px solid var(--vg-line-2)', display:'flex', flexDirection:'column', gap: 10 }}>
          <PedigreeNode id={p.sire} role={t.card.sire} gen={gen+1} openDetail={openDetail} lang={lang} t={t} />
          <PedigreeNode id={p.dam}  role={t.card.dam}  gen={gen+1} openDetail={openDetail} lang={lang} t={t} />
        </div>
      )}
    </div>
  );
}

// PedigreeTree: top-level wrapper used by the lineage tab.
// Expands sire+dam by default, deeper generations collapsed.
function PedigreeTree({ sireId, damId, openDetail, compact }) {
  const t = useT(); const { lang } = useVG();
  return (
    <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: compact ? 14 : 22 }}>
      <PedigreeNode id={sireId} role={t.card.sire} gen={0} openDetail={openDetail} lang={lang} t={t} defaultOpen />
      <PedigreeNode id={damId}  role={t.card.dam}  gen={0} openDetail={openDetail} lang={lang} t={t} defaultOpen />
    </div>
  );
}

Object.assign(window, { VGCtx, useVG, useT, VGLogo, VGWordmark, Chip, Photo, StatusDot, GeckoCard, SectionHeader, PedigreeNode, PedigreeTree });
