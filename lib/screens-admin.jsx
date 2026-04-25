/* global React, useT, useVG, Photo, VGLogo, VGWordmark, StatusDot */
const { useState: uSa, useEffect: uEa } = React;

// Store helpers — mutate window-level stores so the rest of the app sees changes
function getStore() {
  if (!window.VG_GECKOS_STORE) window.VG_GECKOS_STORE = [...window.VG_GECKOS];
  if (!window.VG_MORPHS_STORE) window.VG_MORPHS_STORE = { ...window.VG_MORPH };
  return { geckos: window.VG_GECKOS_STORE, morphs: window.VG_MORPHS_STORE };
}

function AdminScreen({ compact, openDetail }) {
  const t = useT(); const { lang } = useVG();
  const [tab, setTab] = uSa('animals');
  const [tick, setTick] = uSa(0);  // force re-render after store mutation
  const bump = () => setTick(x => x+1);

  const pad = compact ? 16 : 24;
  uEa(() => { getStore(); }, []);

  return (
    <div>
      <section style={{ padding: compact ? '32px 20px 20px' : `52px ${pad}px 28px` }}>
        <div className="vg-eyebrow">ADMIN</div>
        <h1 style={{ margin:'10px 0 0', fontSize: compact ? 32 : 44, fontWeight: 600, lineHeight: 1.1, letterSpacing:'-0.03em' }}>{t.admin.title}</h1>
        <div style={{ marginTop: 8, color:'var(--vg-muted)', fontSize: 14 }}>{lang==='ko' ? '개체 · 유전자 · 상품을 관리합니다.' : 'Manage animals, morphs, and goods.'}</div>
      </section>

      <div style={{ padding: `0 ${pad}px`, borderBottom:'1px solid var(--vg-line)', display:'flex', gap: 4, overflowX:'auto' }}>
        {[['animals', lang==='ko'?'개체':'Animals'], ['morphs', lang==='ko'?'유전자':'Morphs'], ['goods', lang==='ko'?'상품':'Goods'], ['new', lang==='ko'?'새 개체 등록':'+ New animal']].map(([k,v]) => (
          <button key={k} onClick={()=>setTab(k)} style={{ background:'none', border:0, padding:'14px 16px', cursor:'pointer', fontSize: 13, fontWeight: 500, color: tab===k ? 'var(--vg-ink)':'var(--vg-muted)', borderBottom: tab===k ? '2px solid var(--vg-ink)' : '2px solid transparent', marginBottom: -1 }}>{v}</button>
        ))}
      </div>

      <div style={{ padding: compact ? '24px 20px 80px' : `32px ${pad}px 96px` }}>
        {tab === 'animals' && <AnimalList compact={compact} bump={bump} openDetail={openDetail} />}
        {tab === 'morphs' && <MorphManager compact={compact} bump={bump} />}
        {tab === 'goods' && <GoodsManager compact={compact} bump={bump} />}
        {tab === 'new' && <NewAnimal compact={compact} onDone={()=>{ bump(); setTab('animals'); }} />}
      </div>
    </div>
  );
}

function AnimalList({ compact, bump, openDetail }) {
  const { lang } = useVG(); const t = useT();
  const list = window.VG_GECKOS_STORE || window.VG_GECKOS;
  const removeAnimal = (id) => {
    if (!confirm(lang==='ko'?`${id}를 삭제하시겠습니까?`:`Delete ${id}?`)) return;
    window.VG_GECKOS_STORE = list.filter(x => x.id !== id);
    bump();
  };
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color:'var(--vg-muted)' }}>{list.length} {lang==='ko'?'개체':'animals'}</div>
      </div>
      <div style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 12, overflow:'hidden' }}>
        {list.map((g, i) => (
          <div key={g.id} style={{ display:'grid', gridTemplateColumns: compact ? '50px 1fr auto' : '60px 1fr 1fr 1fr auto', gap: 14, padding: compact ? '12px 14px' : '14px 18px', borderBottom: i < list.length-1 ? '1px solid var(--vg-line)' : 'none', alignItems:'center' }}>
            <Photo tone={['green','tobacco','cream','sand','ink'][i%5]} aspect="1/1" radius={8} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing:'-0.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lang==='ko' ? g.nameKr : g.name}</div>
              <div style={{ fontSize: 11, color:'var(--vg-muted)', fontFamily:'var(--vg-mono)' }}>{g.id}</div>
            </div>
            {!compact && <div style={{ fontSize: 12, color:'var(--vg-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(g.genetics||[]).map(m=>window.VG_MORPH_T(m,lang)).join(' · ')}</div>}
            {!compact && <div style={{ fontSize: 13, fontWeight: 500 }}>{window.VG_FORMAT_PRICE(g.price, lang)}</div>}
            <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
              {!compact && <StatusDot status={g.status} />}
              <button onClick={()=>openDetail && openDetail(g.id, 'sale')} style={{ background:'transparent', border:'1px solid var(--vg-line-2)', borderRadius: 6, padding:'5px 10px', fontSize: 11, cursor:'pointer', color:'var(--vg-ink)' }}>{lang==='ko'?'보기':'View'}</button>
              <button onClick={()=>removeAnimal(g.id)} style={{ background:'transparent', border:'1px solid var(--vg-line-2)', borderRadius: 6, padding:'5px 10px', fontSize: 11, cursor:'pointer', color:'var(--vg-danger)' }}>{lang==='ko'?'삭제':'Delete'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MorphManager({ compact, bump }) {
  const { lang } = useVG();
  const morphs = window.VG_MORPH;
  const [newKo, setNewKo] = uSa('');
  const [newEn, setNewEn] = uSa('');
  const add = () => {
    if (!newKo.trim() || !newEn.trim()) return;
    window.VG_MORPH[newEn] = { ko: newKo, en: newEn };
    setNewKo(''); setNewEn(''); bump();
  };
  const remove = (key) => {
    if (!confirm(lang==='ko'?`${key} 유전자를 삭제하시겠습니까?`:`Delete morph "${key}"?`)) return;
    delete window.VG_MORPH[key]; bump();
  };
  const entries = Object.entries(morphs);
  return (
    <div>
      <div style={{ display:'flex', gap: 10, marginBottom: 20, padding: 16, background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 12, flexWrap:'wrap' }}>
        <div style={{ flex: compact ? '1 1 100%' : '1 1 160px' }}>
          <div className="vg-eyebrow" style={{ marginBottom: 6 }}>{lang==='ko'?'한글명':'Name (KR)'}</div>
          <input value={newKo} onChange={e=>setNewKo(e.target.value)} placeholder={lang==='ko'?'예: 아잔틱':'e.g. 아잔틱'} style={adminInput} />
        </div>
        <div style={{ flex: compact ? '1 1 100%' : '1 1 160px' }}>
          <div className="vg-eyebrow" style={{ marginBottom: 6 }}>{lang==='ko'?'영문명 (키)':'Name (EN, key)'}</div>
          <input value={newEn} onChange={e=>setNewEn(e.target.value)} placeholder="e.g. Azantic" style={adminInput} />
        </div>
        <button className="vg-btn" onClick={add} style={{ alignSelf:'flex-end' }}>+ {lang==='ko'?'추가':'Add'}</button>
      </div>
      <div style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 12, overflow:'hidden' }}>
        {entries.map(([k, v], i) => (
          <div key={k} style={{ display:'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, padding:'12px 16px', borderBottom: i < entries.length-1 ? '1px solid var(--vg-line)' : 'none', alignItems:'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{v.ko}</div>
            <div style={{ fontSize: 13, color:'var(--vg-muted)', fontFamily:'var(--vg-mono)' }}>{v.en}</div>
            <button onClick={()=>remove(k)} style={{ background:'transparent', border:'1px solid var(--vg-line-2)', borderRadius: 6, padding:'5px 10px', fontSize: 11, cursor:'pointer', color:'var(--vg-danger)' }}>{lang==='ko'?'삭제':'Delete'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoodsManager({ compact, bump }) {
  const { lang } = useVG();
  if (!window.VG_GOODS_STORE) window.VG_GOODS_STORE = [...window.VG_GOODS];
  const goods = window.VG_GOODS_STORE;
  const [form, setForm] = uSa({ nameKr:'', name:'', category:'food', price:'', stock:'' });
  const add = () => {
    if (!form.nameKr || !form.name || !form.price) return;
    const id = 'G-' + String(goods.length + 10).padStart(3, '0');
    window.VG_GOODS_STORE = [...goods, { id, nameKr: form.nameKr, name: form.name, category: form.category, price: parseInt(form.price)||0, stock: parseInt(form.stock)||0, desc: { ko: '', en: '' } }];
    setForm({ nameKr:'', name:'', category:'food', price:'', stock:'' });
    bump();
  };
  const remove = (id) => {
    if (!confirm(lang==='ko'?`${id} 상품을 삭제하시겠습니까?`:`Delete ${id}?`)) return;
    window.VG_GOODS_STORE = goods.filter(x => x.id !== id);
    bump();
  };
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(5, 1fr) auto', gap: 10, marginBottom: 20, padding: 16, background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 12 }}>
        <Field label={lang==='ko'?'한글명':'Name (KR)'}><input value={form.nameKr} onChange={e=>setForm({...form, nameKr:e.target.value})} style={adminInput} /></Field>
        <Field label={lang==='ko'?'영문명':'Name (EN)'}><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={adminInput} /></Field>
        <Field label={lang==='ko'?'카테고리':'Category'}>
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} style={adminInput}>
            {['enclosure','food','decor','tool','bedding'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={lang==='ko'?'가격':'Price'}><input type="number" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} style={adminInput} /></Field>
        <Field label={lang==='ko'?'재고':'Stock'}><input type="number" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} style={adminInput} /></Field>
        <button className="vg-btn" onClick={add} style={{ alignSelf:'flex-end', gridColumn: compact ? '1 / -1' : 'auto' }}>+ {lang==='ko'?'추가':'Add'}</button>
      </div>
      <div style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 12, overflow:'hidden' }}>
        {goods.map((g, i) => (
          <div key={g.id} style={{ display:'grid', gridTemplateColumns: compact ? '1fr auto' : '80px 1fr 1fr 100px 80px auto', gap: 14, padding:'12px 16px', borderBottom: i < goods.length-1 ? '1px solid var(--vg-line)' : 'none', alignItems:'center' }}>
            {!compact && <div style={{ fontSize: 11, color:'var(--vg-muted)', fontFamily:'var(--vg-mono)' }}>{g.id}</div>}
            <div style={{ fontSize: 13, fontWeight: 500, minWidth: 0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lang==='ko' ? g.nameKr : g.name}</div>
            {!compact && <div style={{ fontSize: 12, color:'var(--vg-muted)' }}>{g.category}</div>}
            {!compact && <div style={{ fontSize: 13, fontWeight: 500 }}>{window.VG_FORMAT_PRICE(g.price, lang)}</div>}
            {!compact && <div style={{ fontSize: 12, color:'var(--vg-muted)' }}>{g.stock}</div>}
            <button onClick={()=>remove(g.id)} style={{ background:'transparent', border:'1px solid var(--vg-line-2)', borderRadius: 6, padding:'5px 10px', fontSize: 11, cursor:'pointer', color:'var(--vg-danger)' }}>{lang==='ko'?'삭제':'Delete'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewAnimal({ compact, onDone }) {
  const t = useT(); const { lang } = useVG();
  const [step, setStep] = uSa(1);
  const [photos, setPhotos] = uSa([1, 2, 3]);
  const list = window.VG_GECKOS_STORE || window.VG_GECKOS;
  const nextId = 'VG-' + String(list.length + 1).padStart(3, '0');
  const [form, setForm] = uSa({ id: nextId, nameKr: '', name: '', genetics: [], sex: 'M', size: 'Baby', price: '', weight: '', birth: '', sire: 'P-001', dam: 'P-002' });

  const morphKeys = Object.keys(window.VG_MORPH);
  const toggleGene = (g) => setForm(f => ({ ...f, genetics: f.genetics.includes(g) ? f.genetics.filter(x=>x!==g) : [...f.genetics, g] }));

  const publish = () => {
    const animal = {
      id: form.id, name: form.name || form.nameKr, nameKr: form.nameKr || form.name,
      genetics: form.genetics, sex: form.sex, size: form.size,
      birth: form.birth || '2026-01-01', weight: parseInt(form.weight) || 10,
      price: parseInt(form.price) || 0,
      sire: form.sire, dam: form.dam,
      status: 'available', featured: false, tags: ['new'],
      desc: { ko: '새로 등록된 개체.', en: 'Newly registered animal.' }
    };
    window.VG_GECKOS_STORE = [...list, animal];
    onDone && onDone();
  };

  return (
    <div>
      <div style={{ display:'flex', gap: 8, marginBottom: 24 }}>
        {[1,2,3].map(n => (
          <div key={n} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, background: n <= step ? 'var(--vg-ink)' : 'var(--vg-line)' }} />
            <div style={{ marginTop: 8, fontSize: 11, color: n === step ? 'var(--vg-ink)' : 'var(--vg-muted)', fontWeight: n === step ? 600 : 400 }}>
              Step {n} · {n===1 ? (lang==='ko'?'사진':'Photos') : n===2 ? (lang==='ko'?'정보':'Details') : (lang==='ko'?'미리보기':'Preview')}
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 6px' }}>{t.admin.photos}</h3>
          <p style={{ color:'var(--vg-muted)', fontSize: 13, margin:'0 0 20px' }}>{lang==='ko' ? '첫 번째 이미지가 대표 이미지입니다.' : 'First image is the hero shot.'}</p>
          <div style={{ border:'1.5px dashed var(--vg-line-2)', background:'var(--vg-bg-2)', padding: 22, textAlign:'center', marginBottom: 20, borderRadius: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t.admin.quickCapture}</div>
            <div style={{ color:'var(--vg-muted)', fontSize: 12, marginTop: 4 }}>{t.admin.quickCaptureSub}</div>
            <div style={{ display:'flex', gap: 8, justifyContent:'center', marginTop: 14 }}>
              <button className="vg-btn">📷 {lang==='ko' ? '카메라' : 'Camera'}</button>
              <button className="vg-btn vg-btn-ghost">{lang==='ko' ? '파일에서' : 'From files'}</button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 10 }}>
            {photos.map((p, i) => (
              <div key={p} style={{ position:'relative' }}>
                <Photo tone={['green','tobacco','cream','sand'][i%4]} aspect="1/1" label={i===0 ? (lang==='ko'?'대표':'Hero') : `0${i+1}`} radius={10} />
                <button onClick={()=>setPhotos(photos.filter(x=>x!==p))} style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,.9)', border:0, width:24, height:24, borderRadius: 6, fontSize:14, cursor:'pointer' }}>×</button>
              </div>
            ))}
            <button onClick={()=>setPhotos([...photos, Date.now()])} style={{ border:'1.5px dashed var(--vg-line-2)', background:'transparent', aspectRatio:'1/1', borderRadius: 10, fontSize: 24, color:'var(--vg-muted)', cursor:'pointer' }}>+</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: compact ? 16 : 24 }}>
          <Field label={t.card.id}><input value={form.id} onChange={e=>setForm({...form, id: e.target.value})} style={adminInput} /></Field>
          <Field label={lang==='ko' ? '한글명' : 'Name (KR)'}><input value={form.nameKr} onChange={e=>setForm({...form, nameKr: e.target.value})} placeholder={lang==='ko'?'예: 옵시디언':'e.g. 옵시디언'} style={adminInput} /></Field>
          <Field label={lang==='ko' ? '영문명' : 'Name (EN)'}><input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="e.g. Obsidian" style={adminInput} /></Field>
          <Field label={t.card.birth}><input type="date" value={form.birth} onChange={e=>setForm({...form, birth:e.target.value})} style={adminInput} /></Field>
          <Field label={lang==='ko' ? '성별' : 'Sex'}>
            <div style={{ display:'flex', gap: 6 }}>
              {['M','F','U'].map(s => (
                <button key={s} onClick={()=>setForm({...form, sex:s})} style={{ flex:1, padding:'10px', border:'1px solid var(--vg-line-2)', borderRadius: 8, background: form.sex===s?'var(--vg-ink)':'transparent', color: form.sex===s?'var(--vg-bg)':'var(--vg-ink)', cursor:'pointer', fontSize:12, fontWeight:500 }}>{t.sex[s]}</button>
              ))}
            </div>
          </Field>
          <Field label={lang==='ko' ? '크기' : 'Size'}>
            <div style={{ display:'flex', gap: 6 }}>
              {['Baby','Subadult','Adult'].map(s => (
                <button key={s} onClick={()=>setForm({...form, size:s})} style={{ flex:1, padding:'10px', border:'1px solid var(--vg-line-2)', borderRadius: 8, background: form.size===s?'var(--vg-ink)':'transparent', color: form.size===s?'var(--vg-bg)':'var(--vg-ink)', cursor:'pointer', fontSize:12, fontWeight:500 }}>{t.size[s]}</button>
              ))}
            </div>
          </Field>
          <Field label={lang==='ko' ? '체중 (g)' : 'Weight (g)'}><input type="number" value={form.weight} onChange={e=>setForm({...form, weight:e.target.value})} placeholder="8" style={adminInput} /></Field>
          <Field label={lang==='ko' ? '가격 (₩)' : 'Price (₩)'}><input type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} placeholder="350000" style={adminInput} /></Field>
          <div style={{ gridColumn: compact ? '1' : '1 / -1' }}>
            <Field label={t.detail.genetics}>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {morphKeys.map(g => (
                  <button key={g} onClick={()=>toggleGene(g)} className={`vg-chip ${form.genetics.includes(g)?'is-on':''}`}>{window.VG_MORPH_T(g, lang)}</button>
                ))}
              </div>
            </Field>
          </div>
          <div style={{ gridColumn: compact ? '1' : '1 / -1' }}>
            <Field label={lang==='ko' ? '부모 개체' : 'Parents'}>
              <div style={{ display:'flex', gap:10 }}>
                <select value={form.sire} onChange={e=>setForm({...form, sire:e.target.value})} style={{...adminInput, flex:1}}>
                  {window.VG_PARENTS.filter(p=>p.sex==='M').map(p => <option key={p.id} value={p.id}>♂ {p.id} · {lang==='ko'?p.nameKr:p.name}</option>)}
                </select>
                <select value={form.dam} onChange={e=>setForm({...form, dam:e.target.value})} style={{...adminInput, flex:1}}>
                  {window.VG_PARENTS.filter(p=>p.sex==='F').map(p => <option key={p.id} value={p.id}>♀ {p.id} · {lang==='ko'?p.nameKr:p.name}</option>)}
                </select>
              </div>
            </Field>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 14px' }}>{lang==='ko' ? '미리보기' : 'Preview'}</h3>
          <div style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 14, padding: compact ? 16 : 24, display:'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1.2fr', gap: 24 }}>
            <Photo tone="green" aspect="4/5" label={form.id} radius={12} />
            <div>
              <div className="vg-eyebrow">{form.id}</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing:'-0.025em', marginTop: 8 }}>{form.nameKr || form.name || '—'}</div>
              <div style={{ fontSize: 13, color:'var(--vg-muted)', marginTop: 4 }}>{form.genetics.map(m=>window.VG_MORPH_T(m,lang)).join(' · ') || '—'}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em', marginTop: 18 }}>{form.price ? window.VG_FORMAT_PRICE(parseInt(form.price)||0, lang) : '—'}</div>
              <div style={{ marginTop: 14, fontSize: 13, color:'var(--vg-ink-2)' }}>{t.sex[form.sex]} · {t.size[form.size]}{form.weight ? ` · ${form.weight}g` : ''}</div>
            </div>
          </div>
          <div style={{ marginTop: 18, background:'var(--vg-bg-2)', padding: 14, borderRadius: 10, fontSize: 12, color:'var(--vg-ink-2)' }}>
            {lang==='ko' ? '✓ 등록 시 분양 개체 목록과 Featured 영역에 추가됩니다.' : '✓ Will be added to the sale list on publish.'}
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap: 10, marginTop: 32, borderTop:'1px solid var(--vg-line)', paddingTop: 20 }}>
        {step > 1 && <button className="vg-btn vg-btn-ghost" onClick={()=>setStep(step-1)}>← {t.generic.prev}</button>}
        <div style={{ marginLeft:'auto', display:'flex', gap: 10 }}>
          {step < 3 ? <button className="vg-btn" onClick={()=>setStep(step+1)}>{t.generic.next} →</button> : <button className="vg-btn vg-btn-primary" onClick={publish}>{t.admin.publish}</button>}
        </div>
      </div>
    </div>
  );
}

const adminInput = { width:'100%', background:'var(--vg-bg)', border:'1px solid var(--vg-line-2)', borderRadius: 8, padding:'9px 12px', fontFamily:'var(--vg-sans)', fontSize:13, color:'var(--vg-ink)', outline:'none' };

function Field({ label, children }) {
  return (
    <label style={{ display:'block' }}>
      <div className="vg-eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

function Footer({ compact }) {
  const t = useT(); const { lang } = useVG();
  const pad = compact ? 16 : 24;
  return (
    <footer style={{ background: 'var(--vg-green-deep)', color: 'var(--vg-cream)', padding: compact ? `48px ${pad}px 28px` : `72px ${pad}px 36px` }}>
      <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(5, 1fr)', gap: compact ? 28 : 40 }}>
        <div style={{ gridColumn: compact ? '1 / -1' : 'auto' }}>
          <VGLogo size={36} />
          <div style={{ marginTop: 14 }}><VGWordmark color="var(--vg-cream)" /></div>
          <div style={{ marginTop: 8, fontSize: 12, color:'rgba(232,220,196,0.6)', maxWidth: 220 }}>{t.tagline}</div>
        </div>
        <Col title={t.footer.visit} items={[t.footer.address, t.footer.hours]} />
        <Col title={t.footer.contact} items={[t.footer.email, '+82 10-0000-0000']} />
        <Col title={t.footer.social} items={['Instagram', 'YouTube', 'KakaoTalk']} />
        <Col title={t.footer.legal} items={[lang==='ko'?'사업자등록번호':'Biz Reg No.', '000-00-00000']} />
      </div>
      <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(232,220,196,0.12)', fontSize: 11, color: 'rgba(232,220,196,0.5)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap: 10 }}>
        <span>{t.footer.copyright}</span>
        <span>Designed in Seoul</span>
      </div>
    </footer>
  );
}

function Col({ title, items }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color:'var(--vg-sand)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom: 12 }}>{title}</div>
      <ul style={{ margin:0, padding:0, listStyle:'none', fontSize: 12, lineHeight: 1.9, color:'rgba(232,220,196,0.75)' }}>
        {items.map(i => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

window.AdminScreen = AdminScreen;
window.Footer = Footer;
