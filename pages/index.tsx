import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";

/** ========================
 *  DATA & TYPES
 *  ======================== */
type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO
  section: string;   // slug
};

type Section = {
  slug: string;
  label: string;
  icon: string;
  hue: number; // color by hue to keep palette coherent
};

const SECTIONS: Section[] = [
  { slug: "finances",        label: "Finances",        icon: "💳", hue: 250 },
  { slug: "environment",     label: "Environment",     icon: "🌿", hue: 175 },
  { slug: "relationships",   label: "Relationships",   icon: "💞", hue: 330 },
  { slug: "romance",         label: "Romance",         icon: "💘", hue: 340 },
  { slug: "physical-health", label: "Physical Health", icon: "🏃‍♀️", hue: 210 },
  { slug: "mental-health",   label: "Mental Health",   icon: "🧠", hue: 280 },
  { slug: "personal-growth", label: "Personal Growth", icon: "🌱", hue: 200 },
  { slug: "hobbies",         label: "Hobbies",         icon: "🎨", hue: 265 },
  { slug: "travel",          label: "Travel",          icon: "✈️", hue: 220 },
  { slug: "career",          label: "Career",          icon: "💼", hue: 250 },
  { slug: "community",       label: "Community",       icon: "🤝", hue: 190 },
  { slug: "spiritual",       label: "Spiritual",       icon: "✨", hue: 300 },
];

/** ========================
 *  HELPERS
 *  ======================== */
const uuid = () => (crypto?.randomUUID?.() ?? String(Date.now() + Math.random()));

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** ========================
 *  WHEEL GEOMETRY (SVG)
 *  ======================== */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rInner: number, rOuter: number, start: number, end: number) {
  // large-arc-flag if arc sweep > 180
  const largeArc = end - start <= 180 ? 0 : 1;

  const p1 = polarToCartesian(cx, cy, rOuter, start);
  const p2 = polarToCartesian(cx, cy, rOuter, end);
  const p3 = polarToCartesian(cx, cy, rInner, end);
  const p4 = polarToCartesian(cx, cy, rInner, start);

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

/** ========================
 *  PAGE
 *  ======================== */
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [active, setActive] = useState<Section | null>(null);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load & Save
  useEffect(() => {
    try {
      const t = localStorage.getItem("papilio-todos");
      if (t) setTodos(JSON.parse(t));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("papilio-todos", JSON.stringify(todos));
  }, [todos]);

  // Focus input when panel opens
  useEffect(() => {
    if (active) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 0);
      const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
      document.addEventListener("keydown", onEsc);
      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener("keydown", onEsc);
      };
    }
  }, [active]);

  const addTodo = () => {
    if (!active) return;
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: uuid(), text, completed: false, createdAt: new Date().toISOString(), section: active.slug },
      ...prev,
    ]);
    setDraft("");
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const removeTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const listFor = (slug: string) => todos.filter((t) => t.section === slug);
  const completedFor = (slug: string) => listFor(slug).filter((t) => t.completed).length;

  /** ========== Wheel sizing ========= */
  const size = 520; // overall SVG size
  const cx = size / 2;
  const cy = size / 2;
  const outer = 230;
  const inner = 120;
  const gap = 0.75; // degrees gap between slices
  const slice = 360 / SECTIONS.length;

  const slices = useMemo(
    () =>
      SECTIONS.map((s, i) => {
        const start = i * slice + gap / 2;
        const end = (i + 1) * slice - gap / 2;
        return { section: s, start, end, d: arcPath(cx, cy, inner, outer, start, end) };
      }),
    [cx, cy, inner, outer, gap]
  );

  return (
    <>
      <Head>
        <title>Papilio Lux — Life, Transformed</title>
        <meta name="description" content="Papilio Lux helps you align 12 dimensions of life and take the leap into balance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        {/* Header */}
        <header className="header">
          <div className="title">Papilio Lux</div>
          <div className="subtitle">Life, Transformed</div>
        </header>

        {/* Hero copy */}
        <section className="hero">
          <p>A clear, beautiful map for your whole life. Build balance across 12 dimensions with gentle guidance.</p>
        </section>

        {/* Wheel */}
        <section className="wheel-wrap">
          <div className="wheel-card">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label="Wheel of Life with 12 sections"
            >
              {/* soft background glow */}
              <defs>
                <radialGradient id="bgGlow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              <circle cx={cx} cy={cy} r={outer + 14} fill="url(#bgGlow)" />

              {slices.map(({ section, d, start, end }) => {
                const total = listFor(section.slug).length;
                const done = completedFor(section.slug);
                const pct = total ? Math.round((done / total) * 100) : 0;

                // pastel slice color using section hue
                const base = `hsl(${section.hue} 85% 72%)`;
                const edge = `hsl(${section.hue} 90% 60%)`;

                return (
                  <g key={section.slug} className="slice">
                    <path
                      d={d}
                      fill={`url(#grad-${section.slug})`}
                      stroke={`hsla(${section.hue} 80% 45% / 0.28)`}
                      strokeWidth={1}
                      onClick={() => setActive(section)}
                    />
                    {/* gradient per slice */}
                    <defs>
                      <linearGradient id={`grad-${section.slug}`} x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor={base} />
                        <stop offset="100%" stopColor={edge} />
                      </linearGradient>
                    </defs>

                    {/* Label tick */}
                    {(() => {
                      // label position (middle angle)
                      const mid = (start + end) / 2;
                      const L = polarToCartesian(cx, cy, outer + 22, mid);
                      return (
                        <g onClick={() => setActive(section)} style={{ cursor: "pointer" }}>
                          <circle cx={L.x} cy={L.y} r={18} className="tick" />
                          <text x={L.x} y={L.y + 5} textAnchor="middle" className="tickText">
                            {section.icon}
                          </text>
                        </g>
                      );
                    })()}

                    {/* Progress arc (outer edge) */}
                    {total > 0 && (
                      <>
                        {(() => {
                          const arcEnd = start + ((end - start) * pct) / 100;
                          const ringR = outer + 6;
                          const p1 = polarToCartesian(cx, cy, ringR, start);
                          const p2 = polarToCartesian(cx, cy, ringR, clamp(arcEnd, start + 0.01, end));
                          const largeArc = arcEnd - start > 180 ? 1 : 0;
                          return (
                            <path
                              d={`M ${p1.x} ${p1.y} A ${ringR} ${ringR} 0 ${largeArc} 1 ${p2.x} ${p2.y}`}
                              stroke={`hsla(${section.hue} 95% 45% / 0.9)`}
                              strokeWidth={4}
                              fill="none"
                              strokeLinecap="round"
                              opacity={0.9}
                            />
                          );
                        })()}
                        {/* dot at arc end */}
                        {(() => {
                          const arcEnd = start + ((end - start) * pct) / 100;
                          const ringR = outer + 6;
                          const p2 = polarToCartesian(cx, cy, ringR, clamp(arcEnd, start + 0.01, end));
                          return <circle cx={p2.x} cy={p2.y} r={3} fill={`hsla(${section.hue} 95% 45% / 1)`} />;
                        })()}
                      </>
                    )}
                  </g>
                );
              })}

              {/* center medallion */}
              <g onClick={() => setActive(null)} style={{ cursor: "default" }}>
                <circle cx={cx} cy={cy} r={inner - 10} className="center" />
                <text x={cx} y={cy - 4} textAnchor="middle" className="centerTitle">
                  Wheel of Life
                </text>
                <text x={cx} y={cy + 18} textAnchor="middle" className="centerSub">
                  12 Dimensions
                </text>
              </g>
            </svg>
          </div>

          {/* Legend (clickable as well) */}
          <ul className="legend" aria-label="Sections legend">
            {SECTIONS.map((s) => (
              <li key={s.slug}>
                <button
                  className="pill"
                  style={{ ["--hue" as any]: String(s.hue) }}
                  onClick={() => setActive(s)}
                  aria-label={`Open ${s.label}`}
                >
                  <span className="dot" />
                  <span className="name">{s.label}</span>
                  {(() => {
                    const total = listFor(s.slug).length;
                    const done = completedFor(s.slug);
                    return total > 0 ? <span className="count">{done}/{total}</span> : null;
                  })()}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Slide-over Panel */}
        {active && (
          <div className="panel-wrap" role="dialog" aria-modal="true" aria-label={`${active.label} panel`}>
            <div className="panel">
              <div className="panel-head">
                <div className="panel-title">
                  <span className="panel-icon">{active.icon}</span>
                  <div>
                    <div className="panel-label">{active.label}</div>
                    <div className="panel-sub">Add goals, habits, or notes.</div>
                  </div>
                </div>
                <button className="close" aria-label="Close" onClick={() => setActive(null)}>
                  ✕
                </button>
              </div>

              <div className="panel-add">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Add a ${active.label} task…`}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <button className="add" onClick={addTodo}>
                  Add
                </button>
              </div>

              <div className="panel-list">
                {listFor(active.slug).length === 0 && (
                  <div className="empty">No items yet. Your first step goes here ✨</div>
                )}

                {listFor(active.slug).map((t) => (
                  <label key={t.id} className={`row ${t.completed ? "done" : ""}`}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTodo(t.id)}
                      aria-label={t.completed ? "Mark as not done" : "Mark as done"}
                    />
                    <span className="txt">{t.text}</span>
                    <button className="del" onClick={() => removeTodo(t.id)} aria-label="Delete">
                      🗑️
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* backdrop */}
            <button className="scrim" aria-label="Close" onClick={() => setActive(null)} />
          </div>
        )}

        <footer className="footer">© {new Date().getFullYear()} Papilio Lux</footer>
      </main>

      <style jsx>{`
        /* ============== LIGHT THEME TOKENS (LOCKED) ============== */
        :root{
          --bg: #faf9ff;            /* near-white with lilac tint */
          --fg: #1b1b29;            /* deep neutral for text */
          --muted: #6b6a80;         /* soft gray-lilac text */
          --card: #ffffff;          /* pure white surfaces */
          --card-2: #f4f2ff;        /* faint lilac surface */
          --ring: #e9e6ff;          /* subtle ring */
          --shadow: 0 10px 30px rgba(30, 41, 59, 0.08);

          /* Brand pastels */
          --violet: #6b4de6;        /* core brand */
          --violet-2: #9e88ff;
          --pink: #f6a6ff;
          --blue: #7cc8ff;
          --gold: #f7c86c;

          /* component radii */
          --r-lg: 18px;
          --r-md: 14px;
          --r-sm: 10px;
        }

        * { box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { margin: 0; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"; }

        .page { min-height: 100%; display: grid; grid-template-rows: auto auto 1fr auto; }

        /* Header */
        .header {
          padding: 24px 22px 10px;
          display: grid;
          justify-items: center;
          gap: 4px;
          background:
            radial-gradient(1200px 600px at 80% -20%, rgba(158,136,255,0.18), transparent 60%),
            radial-gradient(1000px 540px at 10% -10%, rgba(124,200,255,0.18), transparent 50%);
          border-bottom: 1px solid #eee8ff;
        }
        .title {
          font-weight: 800;
          font-size: clamp(1.4rem, 1rem + 1.2vw, 2rem);
          letter-spacing: 0.2px;
        }
        .subtitle {
          font-weight: 600;
          letter-spacing: 0.3px;
          color: var(--muted);
        }

        /* Hero */
        .hero {
          text-align: center;
          padding: 18px 22px 8px;
          color: var(--muted);
        }

        /* Wheel section */
        .wheel-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          padding: 10px 22px 30px;
          justify-items: center;
        }

        .wheel-card {
          background: linear-gradient(180deg, var(--card), #fff);
          border: 1px solid var(--ring);
          border-radius: var(--r-lg);
          box-shadow: var(--shadow);
          padding: 18px;
          overflow: hidden;
        }

        svg { display: block; max-width: 92vw; height: auto; }

        .slice path {
          cursor: pointer;
          transition: transform .12s ease, filter .12s ease, opacity .12s ease;
          filter: saturate(0.98) brightness(1);
        }
        .slice path:hover { filter: saturate(1.1) brightness(1.02); }
        .tick { fill: #fff; stroke: #e8e5ff; }
        .tickText { font-size: 14px; }
        .center { fill: #ffffff; stroke: var(--ring); }
        .centerTitle { font-weight: 800; font-size: 16px; fill: var(--fg); }
        .centerSub { font-size: 12px; fill: var(--muted); }

        /* Legend */
        .legend { list-style: none; padding: 0; margin: 0; max-width: 920px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
        .pill {
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          background: var(--card);
          border: 1px solid var(--ring);
          border-radius: var(--r-md);
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: transform .1s ease, box-shadow .15s ease, border-color .15s ease;
          color: var(--fg);
        }
        .pill:hover { transform: translateY(-1px); border-color: #dcd5ff; box-shadow: 0 10px 26px rgba(111, 78, 230, 0.10); }
        .dot {
          width: 10px; height: 10px; border-radius: 999px;
          background: hsl(var(--hue) 85% 60%);
          box-shadow: 0 0 0 3px hsl(var(--hue) 85% 90% / .6);
        }
        .name { flex: 1; font-weight: 600; }
        .count {
          font-size: 12px;
          color: var(--muted);
          background: #faf8ff;
          padding: 2px 6px; border-radius: 999px; border: 1px solid var(--ring);
        }

        /* Slide-over Panel */
        .panel-wrap {
          position: fixed; inset: 0; display: grid; grid-template-columns: 1fr min(520px, 92vw);
          background: rgba(10, 8, 20, 0.25);
          backdrop-filter: blur(4px);
          z-index: 40;
        }
        .scrim { position: absolute; inset: 0; background: transparent; border: 0; }
        .panel {
          margin-left: auto;
          background: linear-gradient(180deg, var(--card), #fff);
          border-left: 1px solid var(--ring);
          box-shadow: -20px 0 40px rgba(66, 35, 160, 0.08);
          height: 100%;
          display: grid;
          grid-template-rows: auto auto 1fr;
          border-radius: 0 0 0 0;
          animation: slideIn .24s ease both;
        }
        @keyframes slideIn {
          from { transform: translateX(16px); opacity: .7; }
          to { transform: translateX(0); opacity: 1; }
        }

        .panel-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 16px;
          border-bottom: 1px solid var(--ring);
          background:
            radial-gradient(600px 240px at 90% -20%, rgba(246,166,255,0.22), transparent 60%),
            radial-gradient(600px 260px at 10% -20%, rgba(124,200,255,0.22), transparent 60%);
        }
        .panel-title { display: flex; align-items: center; gap: 12px; }
        .panel-icon { font-size: 22px; }
        .panel-label { font-weight: 800; }
        .panel-sub { font-size: 12px; color: var(--muted); }
        .close {
          border: 0; background: #fff; width: 36px; height: 36px; border-radius: 10px;
          box-shadow: var(--shadow);
          cursor: pointer;
        }

        .panel-add {
          display: grid; grid-template-columns: 1fr auto; gap: 10px;
          padding: 14px 16px; border-bottom: 1px solid var(--ring);
        }
        .panel-add input {
          padding: 12px 14px; border-radius: var(--r-md);
          border: 1px solid var(--ring); background: #fff; color: var(--fg);
          outline: none; transition: box-shadow .15s ease, border-color .15s ease;
        }
        .panel-add input:focus { border-color: #d7d0ff; box-shadow: 0 0 0 3px rgba(158,136,255,0.25); }
        .add {
          border: 0; padding: 12px 16px; border-radius: var(--r-md);
          background: linear-gradient(90deg, var(--violet), var(--violet-2));
          color: #fff; font-weight: 700; cursor: pointer;
          box-shadow: 0 10px 24px rgba(107, 77, 230, 0.18);
        }

        .panel-list { padding: 12px 16px 20px; overflow: auto; }
        .row {
          display: grid; grid-template-columns: 20px 1fr auto; gap: 10px; align-items: center;
          padding: 12px 12px; border: 1px solid var(--ring); border-radius: var(--r-md);
          background: #fff; margin-bottom: 8px; box-shadow: var(--shadow);
        }
        .row input[type="checkbox"] { accent-color: var(--violet); width: 18px; height: 18px; }
        .row.done { opacity: .75; }
        .row.done .txt { text-decoration: line-through; color: var(--muted); }
        .del { background: #fff; border: 1px solid var(--ring); border-radius: 8px; padding: 6px 8px; cursor: pointer; }
        .empty { text-align: center; color: var(--muted); font-style: italic; padding: 24px 0; }

        /* Footer */
        .footer { text-align: center; color: var(--muted); padding: 20px; border-top: 1px solid #eeeafc; }

        /* Responsiveness */
        @media (max-width: 720px) {
          .wheel-card { padding: 10px; }
          .legend { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
