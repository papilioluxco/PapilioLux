import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";

/** ===== Types ===== */
type Todo = { id: string; text: string; completed: boolean; createdAt: string; section: string };
type Section = { slug: string; label: string; hue: number };

/** ===== Sections (locked order) ===== */
const SECTIONS: Section[] = [
  { slug: "finances",        label: "Finances",        hue: 250 },
  { slug: "environment",     label: "Environment",     hue: 190 },
  { slug: "relationships",   label: "Relationships",   hue: 315 },
  { slug: "romance",         label: "Romance",         hue: 330 },
  { slug: "physical-health", label: "Physical Health", hue: 210 },
  { slug: "mental-health",   label: "Mental Health",   hue: 275 },
  { slug: "personal-growth", label: "Personal Growth", hue: 245 },
  { slug: "hobbies",         label: "Hobbies",         hue: 285 },
  { slug: "travel",          label: "Travel",          hue: 220 },
  { slug: "career",          label: "Career",          hue: 255 },
  { slug: "community",       label: "Community",       hue: 200 },
  { slug: "spiritual",       label: "Spiritual",       hue: 300 },
];

/** ===== Utils ===== */
const uuid = () => (crypto?.randomUUID?.() ?? String(Date.now() + Math.random()));
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx: number, cy: number, rIn: number, rOut: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p1 = polar(cx, cy, rOut, a0), p2 = polar(cx, cy, rOut, a1);
  const p3 = polar(cx, cy, rIn, a1), p4 = polar(cx, cy, rIn, a0);
  return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

/** ===== Page ===== */
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [active, setActive] = useState<Section | null>(null);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // load/save
  useEffect(() => { try { const t = localStorage.getItem("plx-todos"); if (t) setTodos(JSON.parse(t)); } catch {} }, []);
  useEffect(() => { localStorage.setItem("plx-todos", JSON.stringify(todos)); }, [todos]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 0);
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onEsc);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onEsc); };
  }, [active]);

  const listFor = (slug: string) => todos.filter(t => t.section === slug);
  const doneFor = (slug: string) => listFor(slug).filter(t => t.completed).length;

  const addTodo = () => {
    if (!active) return;
    const text = draft.trim();
    if (!text) return;
    setTodos(prev => [{ id: uuid(), text, completed: false, createdAt: new Date().toISOString(), section: active.slug }, ...prev]);
    setDraft("");
  };
  const toggle = (id: string) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const remove = (id: string) => setTodos(prev => prev.filter(t => t.id !== id));

  /** Wheel geometry */
  const S = 540, cx = S / 2, cy = S / 2, outer = 220, inner = 115, gap = 1, slice = 360 / SECTIONS.length;
  const slices = useMemo(() => SECTIONS.map((s, i) => {
    const a0 = i * slice + gap / 2, a1 = (i + 1) * slice - gap / 2;
    return { s, a0, a1, d: arcPath(cx, cy, inner, outer, a0, a1) };
  }), [cx, cy, inner, outer]);

  return (
    <>
      <Head>
        <title>Papilio Lux — Life, Transformed</title>
        <meta name="description" content="Papilio Lux · a light, elegant map for your life across 12 dimensions." />
        {/* Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <main className="page">
        {/* Header */}
        <header className="mast">
          <h1 className="brand">Papilio Lux</h1>
          <p className="tag">Life, Transformed</p>
        </header>

        {/* Short line */}
        <section className="lede">
          A clear, gentle system to bring balance to your life. Click a segment to capture goals & habits.
        </section>

        {/* Wheel */}
        <section className="wheelWrap">
          <div className="card">
            <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} aria-label="Wheel of Life">
              <defs>
                {/* soft glow */}
                <radialGradient id="glo" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={cx} cy={cy} r={outer + 16} fill="url(#glo)" />

              {slices.map(({ s, d, a0, a1 }) => {
                const total = listFor(s.slug).length;
                const done = doneFor(s.slug);
                const pct = total ? Math.round((done / total) * 100) : 0;

                const base = `hsl(${s.hue} 90% 88%)`; // pastel base
                const edge = `hsl(${s.hue} 85% 74%)`;  // pastel edge

                return (
                  <g key={s.slug} className="seg">
                    <defs>
                      <linearGradient id={`grad-${s.slug}`} x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor={base} />
                        <stop offset="100%" stopColor={edge} />
                      </linearGradient>
                    </defs>

                    <path d={d} fill={`url(#grad-${s.slug})`} stroke={`hsla(${s.hue} 70% 55% / .18)`} strokeWidth={1}
                          onClick={() => setActive(s)} />

                    {/* label dot */}
                    {(() => {
                      const mid = (a0 + a1) / 2;
                      const p = polar(cx, cy, outer + 20, mid);
                      return <circle cx={p.x} cy={p.y} r={4} fill={`hsl(${s.hue} 85% 60%)`} onClick={() => setActive(s)} style={{cursor:'pointer'}} />;
                    })()}

                    {/* progress ring */}
                    {total > 0 && (() => {
                      const end = a0 + ((a1 - a0) * pct) / 100;
                      const R = outer + 8;
                      const p1 = polar(cx, cy, R, a0);
                      const p2 = polar(cx, cy, R, clamp(end, a0 + 0.01, a1));
                      const large = end - a0 > 180 ? 1 : 0;
                      return (
                        <>
                          <path d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 ${large} 1 ${p2.x} ${p2.y}`}
                                stroke={`hsla(${s.hue} 80% 50% / .9)`} strokeWidth={4} strokeLinecap="round" fill="none" />
                          <circle cx={p2.x} cy={p2.y} r={3} fill={`hsl(${s.hue} 80% 50%)`} />
                        </>
                      );
                    })()}
                  </g>
                );
              })}

              {/* center */}
              <g>
                <circle cx={cx} cy={cy} r={inner - 8} className="center" />
                <text x={cx} y={cy - 2} textAnchor="middle" className="cTitle">Wheel of Life</text>
                <text x={cx} y={cy + 18} textAnchor="middle" className="cSub">12 Dimensions</text>
              </g>
            </svg>
          </div>

          {/* legend */}
          <ul className="legend">
            {SECTIONS.map(s => {
              const total = listFor(s.slug).length;
              const done = doneFor(s.slug);
              return (
                <li key={s.slug}>
                  <button className="pill" style={{ ["--h" as any]: s.hue } as any} onClick={() => setActive(s)}>
                    <span className="dot" />
                    <span className="name">{s.label}</span>
                    {total > 0 && <span className="count">{done}/{total}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Slide-over panel */}
        {active && (
          <div className="panelWrap" role="dialog" aria-modal="true">
            <div className="panel">
              <div className="pHead">
                <div className="pTitle">
                  <span className="pDot" style={{ ["--h" as any]: active.hue } as any} />
                  <div>
                    <div className="pLabel">{active.label}</div>
                    <div className="pSub">Add goals, habits, or notes.</div>
                  </div>
                </div>
                <button className="x" onClick={() => setActive(null)} aria-label="Close">✕</button>
              </div>

              <div className="pAdd">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Add a ${active.label} item…`}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <button className="add" onClick={addTodo}>Add</button>
              </div>

              <div className="pList">
                {listFor(active.slug).length === 0 && <div className="empty">No items yet. Your first step goes here ✨</div>}
                {listFor(active.slug).map(t => (
                  <label key={t.id} className={`row ${t.completed ? "done" : ""}`}>
                    <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
                    <span className="txt">{t.text}</span>
                    <button className="del" onClick={() => remove(t.id)} aria-label="Delete">🗑️</button>
                  </label>
                ))}
              </div>
            </div>
            <button className="scrim" aria-label="Close" onClick={() => setActive(null)} />
          </div>
        )}

        <footer className="foot">© {new Date().getFullYear()} Papilio Lux</footer>
      </main>

      <style jsx>{`
        :root{
          /* LIGHT, AIRY BASE */
          --bg:#ffffff;
          --fg:#1a1732;
          --muted:#6b6a80;
          --ring:#ece9ff;
          --card:#ffffff;
          --card2:#f8f6ff;

          --shadow: 0 10px 30px rgba(29, 35, 60, 0.08);
          --r-lg:18px; --r-md:14px; --r-sm:10px;
        }
        *,*::before,*::after{box-sizing:border-box}
        html,body,#__next{height:100%}
        body{margin:0;font-family:"Manrope",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}

        .page{min-height:100%;display:grid;grid-template-rows:auto auto 1fr auto;background:
          radial-gradient(1000px 500px at 20% -10%, rgba(124,200,255,.18), transparent 60%),
          radial-gradient(1000px 540px at 90% -20%, rgba(246,166,255,.22), transparent 60%),
          #fff;}

        .mast{padding:28px 22px 8px;text-align:center;border-bottom:1px solid var(--ring)}
        .brand{margin:0;font-weight:800;letter-spacing:.2px;font-size:clamp(1.6rem,1rem + 1.4vw,2.3rem)}
        .tag{margin:4px 0 0;color:var(--muted);font-weight:700}

        .lede{padding:14px 22px 6px;text-align:center;color:var(--muted)}

        .wheelWrap{display:grid;gap:16px;justify-items:center;padding:10px 22px 28px}
        .card{background:linear-gradient(180deg,var(--card),#fff);border:1px solid var(--ring);border-radius:var(--r-lg);box-shadow:var(--shadow);padding:14px}

        svg{display:block;max-width:92vw;height:auto}
        .seg path{cursor:pointer;transition:filter .12s ease, transform .12s ease}
        .seg path:hover{filter:brightness(1.03) saturate(1.06)}
        .center{fill:#fff;stroke:var(--ring)}
        .cTitle{font-weight:800;font-size:16px;fill:var(--fg)}
        .cSub{font-size:12px;fill:var(--muted)}

        .legend{list-style:none;margin:0;padding:0;max-width:920px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
        .pill{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--card);border:1px solid var(--ring);border-radius:var(--r-md);box-shadow:var(--shadow);cursor:pointer;color:var(--fg);transition:transform .1s ease, border-color .15s ease, box-shadow .15s ease}
        .pill:hover{transform:translateY(-1px);border-color:#ded7ff;box-shadow:0 10px 24px rgba(111,78,230,.12)}
        .dot{width:10px;height:10px;border-radius:999px;background:hsl(var(--h) 85% 60%);box-shadow:0 0 0 3px hsl(var(--h) 92% 92% / .7)}
        .name{flex:1;font-weight:700}
        .count{font-size:12px;color:var(--muted);border:1px solid var(--ring);padding:2px 6px;border-radius:999px;background:#faf8ff}

        .panelWrap{position:fixed;inset:0;display:grid;grid-template-columns:1fr min(520px,92vw);background:rgba(10,8,20,.25);backdrop-filter:blur(4px);z-index:40}
        .panel{margin-left:auto;background:linear-gradient(180deg,var(--card),#fff);border-left:1px solid var(--ring);height:100%;display:grid;grid-template-rows:auto auto 1fr;box-shadow:-20px 0 40px rgba(66,35,160,.08);animation:slide .22s ease both}
        @keyframes slide{from{transform:translateX(14px);opacity:.7}to{transform:translateX(0);opacity:1}}
        .scrim{position:absolute;inset:0;background:transparent;border:0}

        .pHead{display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--ring);background:
          radial-gradient(600px 240px at 10% -20%, rgba(124,200,255,.22), transparent 60%),
          radial-gradient(600px 260px at 90% -20%, rgba(246,166,255,.22), transparent 60%);}
        .pTitle{display:flex;align-items:center;gap:10px}
        .pDot{width:12px;height:12px;border-radius:999px;background:hsl(var(--h) 85% 55%);box-shadow:0 0 0 4px hsl(var(--h) 95% 92% / .7)}
        .pLabel{font-weight:800}
        .pSub{font-size:12px;color:var(--muted)}
        .x{border:0;background:#fff;border:1px solid var(--ring);width:36px;height:36px;border-radius:10px;cursor:pointer}

        .pAdd{display:grid;grid-template-columns:1fr auto;gap:10px;padding:12px 16px;border-bottom:1px solid var(--ring)}
        .pAdd input{padding:12px 14px;border-radius:var(--r-md);border:1px solid var(--ring);background:#fff;outline:none}
        .pAdd input:focus{border-color:#d9d2ff;box-shadow:0 0 0 3px rgba(158,136,255,.25)}
        .add{border:0;padding:12px 16px;border-radius:var(--r-md);background:linear-gradient(90deg,#7cc8ff,#9e88ff);color:#fff;font-weight:800;box-shadow:0 10px 24px rgba(124,200,255,.22);cursor:pointer}

        .pList{padding:12px 16px 20px;overflow:auto}
        .row{display:grid;grid-template-columns:20px 1fr auto;gap:10px;align-items:center;padding:12px;border:1px solid var(--ring);border-radius:var(--r-md);background:#fff;margin-bottom:8px;box-shadow:var(--shadow)}
        .row input[type="checkbox"]{accent-color:#7e6bff;width:18px;height:18px}
        .row.done{opacity:.75}
        .row.done .txt{text-decoration:line-through;color:var(--muted)}
        .del{border:1px solid var(--ring);background:#fff;border-radius:8px;padding:6px 8px;cursor:pointer}
        .empty{text-align:center;color:var(--muted);font-style:italic;padding:22px 0}

        .foot{text-align:center;color:var(--muted);padding:18px;border-top:1px solid var(--ring)}

        @media (max-width:740px){
          .legend{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>
    </>
  );
}
