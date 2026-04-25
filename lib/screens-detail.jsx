/* global React, useT, useVG, Photo, StatusDot, SectionHeader, GeckoCard */
const { useState: uSd, useMemo: uMd } = React;

function DetailScreen({ id, source = 'sale', setRoute, openDetail, compact }) {
  const t = useT(); const { lang } = useVG();
  const data = source === 'parents' ? window.VG_PARENTS : source === 'minor' ? window.VG_MINOR : (window.VG_GECKOS_STORE || window.VG_GECKOS);
  const g = data.find(x => x.id === id) || data[0];
  const sire = window.VG_PARENTS.find(p => p.id === g.sire);
  const dam = window.VG_PARENTS.find(p => p.id === g.dam);
  const [tab, setTab] = uSd('overview');
  const store = (window.VG_GECKOS_STORE || window.VG_GECKOS);
  const siblings = source === 'sale' ? store.filter(x => x.id !== g.id && x.sire === g.sire && x.dam === g.dam) : [];
  const pad = compact ? 16 : 24;
  const tones = ['green','tobacco','ink','cream','sand'];
  const tone = tones[parseInt(g.id.replace(/\D/g,'')) % tones.length];
  const isParents = source === 'parents';

  return (
    <div>
      <div style={{ padding: compact ? '14px 20px' : `16px ${pad}px`, borderBottom:'1px solid var(--vg-line)' }}>
        <button onClick={()=>setRoute(source === 'parents' ? 'parents' : source === 'minor' ? 'minor' : 'sale')} className="vg-btn-link">← {t.generic.back}</button>
      </div>

      <section style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : '1.2fr 1fr', gap: compact ? 0 : 40, padding: compact ? '20px 20px 0' : `32px ${pad}px 0` }}>
        <div>
          <Photo tone={tone} aspect="4/5" label={`${g.id} · ${lang==='ko' ? g.nameKr : g.name}`} radius={compact ? 12 : 16} />
          {!compact && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
              <Photo tone="cream" aspect="1/1" label="02" radius={10} />
              <Photo tone="sand" aspect="1/1" label="03" radius={10} />
              <Photo tone="tobacco" aspect="1/1" label="04" radius={10} />
            </div>
          )}
        </div>
        <div style={{ padding: compact ? '24px 0 0' : '8px 0' }}>
          <div className="vg-eyebrow">{g.id}{g.featured ? ' · FEATURED' : ''}</div>
          <h1 style={{ margin:'10px 0 6px', fontSize: compact ? 32 : 44, fontWeight: 600, lineHeight: 1.1, letterSpacing:'-0.025em', color:'var(--vg-ink)' }}>
            {lang==='ko' ? g.nameKr : g.name}
          </h1>
          <div style={{ fontSize: 13, color:'var(--vg-muted)' }}>{(g.genetics||[]).map(m=>window.VG_MORPH_T(m,lang)).join(' · ') || g.species}</div>

          {g.price && <div style={{ fontSize: 28, fontWeight: 600, letterSpacing:'-0.02em', marginTop: 22 }}>{window.VG_FORMAT_PRICE(g.price, lang)}</div>}
          {g.status && <div style={{ marginTop: 8 }}><StatusDot status={g.status} /></div>}

          <div style={{ marginTop: 24, display:'grid', gridTemplateColumns:'1fr 1fr', gap: '14px 20px', fontSize: 13 }}>
            {g.sex && <Row label={lang==='ko'?'성별':'Sex'} v={t.sex[g.sex]} />}
            {g.size && <Row label={lang==='ko'?'크기':'Size'} v={t.size[g.size]} />}
            {g.birth && <Row label={t.card.birth} v={window.VG_FORMAT_DATE(g.birth, lang)} />}
            {g.weight && <Row label={t.card.weight} v={`${g.weight} g`} />}
            {g.origin && <Row label={t.detail.origin} v={g.origin} />}
          </div>

          <p style={{ marginTop: 22, fontSize: 14, lineHeight: 1.7, color:'var(--vg-ink-2)' }}>{g.desc && g.desc[lang]}</p>

          {!isParents && (
            <div style={{ display:'flex', gap: 10, marginTop: 26, flexWrap:'wrap' }}>
              {g.status !== 'sold' && (
                <button
                  className="vg-btn vg-btn-primary"
                  onClick={() => {
                    // TODO: 카카오톡 채널 연결 — 추후 실제 채널 ID로 교체
                    const msg = (lang === 'ko'
                      ? `${g.id} ${g.nameKr || g.name} 개체 문의하고 싶어요`
                      : `Inquiry about ${g.id} ${g.name}`);
                    console.log('[KakaoTalk inquiry stub]', msg);
                    alert((lang === 'ko' ? '카카오톡 채널 연결은 추후 적용됩니다.\n\n' : 'KakaoTalk channel link coming soon.\n\n') + msg);
                  }}
                >
                  {t.detail.inquiry}
                </button>
              )}
              <button className="vg-btn vg-btn-ghost">{t.detail.share}</button>
            </div>
          )}

          {!isParents && (
            <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--vg-bg-2)', borderRadius: 10, fontSize: 12, color:'var(--vg-ink-2)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <span>✓ {t.detail.quarantined}</span>
              <span>✓ {t.detail.insured}</span>
            </div>
          )}
        </div>
      </section>

      {/* Tabs — only for sale items */}
      {!isParents && source !== 'minor' && (
        <section style={{ marginTop: 48 }}>
          <div style={{ display:'flex', gap: 4, padding: `0 ${pad}px`, borderBottom: '1px solid var(--vg-line)', overflowX:'auto' }}>
            {[['overview',t.detail.overview],['lineage',t.detail.lineage],['health',t.detail.health],['pricing',t.detail.pricing],['shipping',t.detail.shipping]].map(([k,v]) => (
              <button key={k} onClick={()=>setTab(k)} style={{ background:'none', border:0, padding:'14px 16px', cursor:'pointer', fontFamily:'var(--vg-sans)', fontSize: 13, fontWeight: 500, color: tab===k?'var(--vg-ink)':'var(--vg-muted)', borderBottom: tab===k ? '2px solid var(--vg-ink)' : '2px solid transparent', marginBottom: -1 }}>{v}</button>
            ))}
          </div>

          <div style={{ padding: compact ? '28px 20px 72px' : `40px ${pad}px 96px` }}>
            {tab === 'overview' && (
              <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : '2fr 1fr', gap: compact ? 28 : 48 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 14px' }}>{lang==='ko' ? '개체 노트' : 'Notes'}</h3>
                  <p style={{ fontSize:14, lineHeight: 1.8, color:'var(--vg-ink-2)' }}>{g.desc && g.desc[lang]}</p>
                  <div style={{ marginTop: 20, display:'flex', gap:6, flexWrap:'wrap' }}>
                    {(g.tags||[]).map(x => <span key={x} style={{ fontSize:11, padding:'5px 10px', background:'var(--vg-bg-2)', borderRadius: 100, color:'var(--vg-ink-2)' }}>{x}</span>)}
                  </div>
                </div>
                <div>
                  <div className="vg-eyebrow" style={{ marginBottom: 12 }}>{t.detail.genetics}</div>
                  <ul style={{ margin:0, padding:0, listStyle:'none' }}>
                    {(g.genetics||[]).map(x => <li key={x} style={{ borderBottom:'1px solid var(--vg-line)', padding:'10px 0', fontSize: 13, fontWeight: 500 }}>{window.VG_MORPH_T(x, lang)}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {tab === 'lineage' && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 8px' }}>{t.lineage.title}</h3>
                <p style={{ fontSize: 12, color:'var(--vg-muted)', margin:'0 0 24px' }}>
                  {lang==='ko' ? '+ 버튼을 눌러 윗 세대를 펼쳐볼 수 있습니다.' : 'Tap + to expand each generation upward.'}
                </p>
                <PedigreeTree sireId={g.sire} damId={g.dam} openDetail={openDetail} compact={compact} />

                {siblings.length > 0 && (
                  <div style={{ marginTop: 44 }}>
                    <div className="vg-eyebrow" style={{ marginBottom: 16 }}>{t.lineage.siblings}</div>
                    <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(3, 1fr)', gap: compact ? 14 : 22 }}>
                      {siblings.map(s => <GeckoCard key={s.id} g={s} onClick={()=>openDetail(s.id,'sale')} compact />)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'health' && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 18px' }}>{t.detail.health}</h3>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 13 }}>
                  <thead><tr style={{ textAlign:'left', color:'var(--vg-muted)' }}>
                    {[lang==='ko'?'일자':'Date', lang==='ko'?'항목':'Entry', lang==='ko'?'체중':'Weight', lang==='ko'?'비고':'Note'].map(h =>
                      <th key={h} style={{ padding:'12px 0', borderBottom:'1px solid var(--vg-line-2)', fontWeight:500, fontSize: 11 }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[
                      ['2026-04-18', lang==='ko'?'체중 측정':'Weigh-in', `${g.weight||50} g`, lang==='ko'?'컨디션 양호':'Good condition'],
                      ['2026-04-05', lang==='ko'?'검역 통과':'QT cleared', `${(g.weight||50)-1} g`, lang==='ko'?'2주 검역 완료':'2-week QT'],
                      ['2026-03-22', lang==='ko'?'탈피':'Shed', `${(g.weight||50)-2} g`, lang==='ko'?'완전 탈피':'Complete shed'],
                      ['2026-03-10', lang==='ko'?'구충':'Deworm', `${(g.weight||50)-3} g`, 'Panacur']
                    ].map((row, i) => (
                      <tr key={i}>{row.map((c,j) => <td key={j} style={{ padding:'12px 0', borderBottom:'1px solid var(--vg-line)', color: j===3?'var(--vg-muted)':'var(--vg-ink)' }}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'pricing' && (
              <div style={{ maxWidth: 560 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 18px' }}>{t.detail.pricing}</h3>
                <dl style={{ margin: 0 }}>
                  <PriceRow k={lang==='ko'?'개체 가격':'Animal'} v={window.VG_FORMAT_PRICE(g.price||0, lang)} />
                  <PriceRow k={lang==='ko'?'검역 · 건강 진단':'QT & health check'} v={lang==='ko'?'포함':'Included'} />
                  <PriceRow k={lang==='ko'?'포장 (단열 박스)':'Shipping box'} v={window.VG_FORMAT_PRICE(25000, lang)} />
                  <PriceRow k={lang==='ko'?'당일 배송 (서울)':'Same-day (Seoul)'} v={window.VG_FORMAT_PRICE(18000, lang)} />
                  <PriceRow k={lang==='ko'?'합계':'Total'} v={window.VG_FORMAT_PRICE((g.price||0)+43000, lang)} strong />
                </dl>
              </div>
            )}

            {tab === 'shipping' && (
              <div style={{ maxWidth: 680, fontSize: 14, lineHeight: 1.8, color:'var(--vg-ink-2)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing:'-0.02em', margin:'0 0 14px', color:'var(--vg-ink)' }}>{t.detail.shipping}</h3>
                <p>{lang==='ko' ? '모든 개체는 2주 간의 검역 후 분양됩니다. 배송은 단열 박스와 열팩을 사용하며, 기온이 10°C 미만일 경우 일정이 조정될 수 있습니다.' : 'Every animal ships after a 2-week quarantine. We use insulated boxes with heat packs; shipments may be rescheduled if temperatures drop below 10°C.'}</p>
                <p style={{ marginTop: 12 }}>{lang==='ko' ? '서울권은 직접 전달이 가능하며, 그 외 지역은 파충류 전문 택배를 사용합니다. 도착 후 30일 이내 건강 이상이 발생할 경우 전액 환불 또는 교환을 보증합니다.' : 'Seoul-area hand delivery available; elsewhere we use reptile-specialist couriers. Full refund or exchange guaranteed for any health issue within 30 days of arrival.'}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Parents detail: ancestry tree (if known) + offspring list */}
      {isParents && (
        <section style={{ padding: compact ? '40px 20px 72px' : `52px ${pad}px 96px` }}>
          {(g.sire || g.dam) && (
            <div style={{ marginBottom: 56 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 8 }}>
                <div className="vg-eyebrow">{lang==='ko' ? '계보' : 'Ancestry'}</div>
                <div style={{ fontSize: 11, color:'var(--vg-muted)' }}>
                  {lang==='ko' ? '+ 버튼으로 윗 세대 펼침' : 'Tap + to expand upward'}
                </div>
              </div>
              <PedigreeTree sireId={g.sire} damId={g.dam} openDetail={openDetail} compact={compact} />
            </div>
          )}

          {g.offspring && g.offspring.length > 0 && (
            <div>
              <div className="vg-eyebrow" style={{ marginBottom: 16 }}>{lang==='ko' ? '자손' : 'Offspring'} · {g.offspring.length}</div>
              <div style={{ display:'grid', gridTemplateColumns: compact ? '1fr 1fr' : 'repeat(3, 1fr)', gap: compact ? 14 : 22 }}>
                {g.offspring.map(oid => {
                  const o = store.find(x => x.id === oid) || (window.VG_PARENTS||[]).find(x => x.id === oid);
                  if (!o) return null;
                  // 자손이 부모개체일 수도, 분양개체일 수도 있음
                  const isP = (window.VG_PARENTS||[]).some(x => x.id === oid);
                  return <GeckoCard key={oid} g={o} onClick={()=>openDetail(oid, isP ? 'parents' : 'sale')} compact />;
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Row({ label, v }) {
  return (
    <div>
      <div className="vg-eyebrow" style={{ marginBottom: 3 }}>{label}</div>
      <div style={{ fontWeight: 500, color:'var(--vg-ink)' }}>{v}</div>
    </div>
  );
}
function PriceRow({ k, v, strong }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid var(--vg-line)', fontSize: strong ? 16 : 14, fontWeight: strong ? 600 : 400 }}>
      <span>{k}</span><span style={{ letterSpacing:'-0.015em' }}>{v}</span>
    </div>
  );
}

function CartScreen({ setRoute, compact }) {
  const { lang } = useVG(); const t = useT();
  const lines = [
    { ...(window.VG_GECKOS_STORE || window.VG_GECKOS)[0], qty: 1 },
    { ...(window.VG_GOODS_STORE || window.VG_GOODS)[1], qty: 2 }
  ];
  const subtotal = lines.reduce((s, i) => s + i.price * i.qty, 0);
  const pad = compact ? 16 : 24;
  return (
    <div>
      <section style={{ padding: compact ? '32px 20px 24px' : `52px ${pad}px 32px` }}>
        <div className="vg-eyebrow" style={{ marginBottom: 10 }}>{lang==='ko' ? '결제' : 'Checkout'}</div>
        <h1 style={{ margin:0, fontSize: compact ? 32 : 44, fontWeight: 600, lineHeight: 1.1, letterSpacing:'-0.03em' }}>{t.cart.title}</h1>
      </section>
      <section style={{ display:'grid', gridTemplateColumns: compact ? '1fr' : '1.6fr 1fr', gap: compact ? 20 : 48, padding: `0 ${pad}px 100px` }}>
        <div>
          {lines.map(i => (
            <div key={i.id} style={{ display:'grid', gridTemplateColumns: '90px 1fr auto', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--vg-line)', alignItems:'center' }}>
              <Photo tone={i.genetics ? 'green' : 'cream'} aspect="1/1" radius={10} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing:'-0.015em' }}>{lang==='ko' ? i.nameKr : i.name}</div>
                <div style={{ fontSize: 12, color:'var(--vg-muted)', marginTop: 4 }}>{i.id} · {lang==='ko'?'수량':'Qty'} {i.qty}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing:'-0.015em' }}>{window.VG_FORMAT_PRICE(i.price * i.qty, lang)}</div>
            </div>
          ))}
        </div>
        <aside style={{ background:'var(--vg-paper)', border:'1px solid var(--vg-line)', borderRadius: 14, padding: 24, alignSelf:'start' }}>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontSize: 13 }}>
            <span style={{ color:'var(--vg-muted)' }}>{t.cart.subtotal}</span>
            <span style={{ fontWeight: 500 }}>{window.VG_FORMAT_PRICE(subtotal, lang)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontSize: 13 }}>
            <span style={{ color:'var(--vg-muted)' }}>{lang==='ko' ? '배송 · 검역' : 'Ship & QT'}</span>
            <span style={{ fontWeight: 500 }}>{window.VG_FORMAT_PRICE(43000, lang)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderTop:'1px solid var(--vg-line)', marginTop: 8, fontSize: 17, fontWeight: 600, letterSpacing:'-0.02em' }}>
            <span>{lang==='ko' ? '결제 금액' : 'Total'}</span>
            <span>{window.VG_FORMAT_PRICE(subtotal + 43000, lang)}</span>
          </div>
          <button className="vg-btn vg-btn-primary" style={{ width:'100%', marginTop: 14 }}>{t.cart.checkout} →</button>
          <button className="vg-btn vg-btn-ghost" onClick={()=>setRoute('sale')} style={{ width:'100%', marginTop: 8 }}>{t.cart.continue}</button>
        </aside>
      </section>
    </div>
  );
}

window.DetailScreen = DetailScreen;
window.CartScreen = CartScreen;
