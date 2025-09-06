import Head from "next/head";
import { useMemo, useState, useEffect } from "react";

type Task = { id: string; text: string; done: boolean };

const SECTIONS = [
  "Health","Career","Finances","Learning",
  "Relationships","Family","Home","Spiritual",
  "Fun","Community","Creativity","Environment"
];

export default function Home() {
  const [active, setActive] = useState(0);

  // tasks per section
  const [tasks, setTasks] = useState<Record<number, Task[]>>(
    () => Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i, []]))
  );

  // persist in localStorage
  useEffect(() => {
    const raw = localStorage.getItem("plx_tasks_v1");
    if (raw) {
      try { setTasks(JSON.parse(raw)); } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("plx_tasks_v1", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (i: number, text: string) => {
    const t: Task = { id: crypto.randomUUID(), text, done: false };
    setTasks((prev) => ({ ...prev, [i]: [t, ...(prev[i] || [])] }));
  };
  const toggleTask = (i: number, id: string) => {
    setTasks((prev) => ({
      ...prev,
      [i]: prev[i].map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  };
  const removeTask = (i: number, id: string) => {
    setTasks((prev) => ({ ...prev, [i]: prev[i].filter((t) => t.id !== id) }));
  };

  // wheel slices
  type Slice = { d: string; midAngle: number };
  const slices: Slice[] = useMemo(() => {
    const cx = 200, cy = 200, r = 180;
    const toXY = (ang: number) => {
      const rad = (ang - 90) * (Math.PI / 180);
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };
    const arc = (start: number, end: number) => {
      const s = toXY(start), e = toXY(end);
      const largeArc = end - start <= 180 ? 0 : 1;
      return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
    };
    const step = 360 / 12;
    return Array.from({ length: 12 }, (_, i) => {
      const a0 = i * step, a1 = (i + 1) * step;
      return { d: arc(a0, a1), midAngle: a0 + step / 2 };
    });
  }, []);

  const [input, setInput] = useState("");

  return (
    <>
      <Head>
        <title>Papilio Lux — Life, Transformed</title>
        <meta name="description" content="Your complete life transformation begins here." />
        <link
          href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@600;700&family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="page">
        {/* HEADER */}
        <header className="top">
          <div className="brandRow">
            <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--brand-blue)" />
                  <stop offset="50%" stopColor="var(--brand-purple)" />
                  <stop offset="100%" stopColor="var(--brand-pink)" />
                </linearGradient>
              </defs>
              <path
                fill="url(#g)"
                d="M22 30c-6-10-18-10-18-2 0 7 10 11 16 10-1 6-3 12 2 12 5 0 6-8 6-14 0-2 0-4-6-6zm20 0c6-10 18-10 18-2 0 7-10 11-16 10 1 6 3 12-2 12s-6-8-6-14c0-2 0-4 6-6z"
              />
            </svg>
            <span className="wordmark">Papilio Lux</span>
          </div>
        </header>

        <main className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h3>Sections</h3>
            <ul className="sectionList">
              {SECTIONS.map((s, i) => (
                <li key={s}>
                  <button
                    className={i === active ? "item active" : "item"}
                    onClick={() => setActive(i)}
                  >
                    <span className="dot" aria-hidden />
                    {s}
                  </button>
                </li>
              ))}
            </ul>

            <div className="todoPanel">
              <div className="todoHeader">
                <span>To-dos — <strong>{SECTIONS[active]}</strong></span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const v = input.trim();
                  if (!v) return;
                  addTask(active, v);
                  setInput("");
                }}
                className="todoForm"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Add a to-do for ${SECTIONS[active]}…`}
                  className="todoInput"
                />
                <button className="addBtn" type="submit">Add</button>
              </form>

              <ul className="todoList">
                {tasks[active].length === 0 && (
                  <li className="empty">No to-dos yet.</li>
                )}
                {tasks[active].map((t) => (
                  <li key={t.id} className="todoItem">
                    <label className="checkboxRow">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(active, t.id)}
                      />
                      <span className={t.done ? "txt done" : "txt"}>{t.text}</span>
                    </label>
                    <button className="delBtn" onClick={() => removeTask(active, t.id)} aria-label="Delete">×</button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section className="content">
            <h1 className="h1">Papilio Lux</h1>
            <h2 className="h2">Life, Transformed.</h2>
            <p className="tag">Your complete life transformation begins here.</p>

            <div className="wheelCard">
              <svg className="wheel" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="slice" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--brand-blue)" />
                    <stop offset="50%" stopColor="var(--brand-purple)" />
                    <stop offset="100%" stopColor="var(--brand-pink)" />
                  </linearGradient>
                </defs>

                <circle cx="200" cy="200" r="182" fill="none" stroke="url(#slice)" strokeOpacity="0.35" strokeWidth="6"/>

                {slices.map((s, i) => (
                  <path
                    key={i}
                    d={s.d}
                    fill="url(#slice)"
                    opacity={i === active ? 1 : 0.25}
                    stroke="rgba(15,23,42,0.10)"
                    strokeWidth={1}
                    className="slice"
                    onClick={() => setActive(i)}
                  />
                ))}

                <circle cx="200" cy="200" r="72" fill="white" />
                <text x="200" y="193" textAnchor="middle" className="centerTitle">
                  {SECTIONS[active]}
                </text>
                <text x="200" y="214" textAnchor="middle" className="centerHint">
                  click a slice
                </text>
              </svg>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        :root{
          --brand-blue:#5ea1ff;
          --brand-purple:#8b5cf6;
          --brand-pink:#f472b6;
          --ink:#0f172a;
          --ink-dim:#334155;
          --glass:rgba(255,255,255,.7);
        }

        .page{
          min-height:100vh;
          background:
            radial-gradient(40% 55% at 16% 8%, rgba(94,161,255,.35), transparent 60%),
            radial-gradient(48% 55% at 82% 8%, rgba(139,92,246,.32), transparent 60%),
            radial-gradient(45% 45% at 58% 80%, rgba(244,114,182,.22), transparent 60%),
            linear-gradient(135deg, #f7fbff, #f8f5ff);
        }

        .top {
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
        }
        .brandRow { display:flex; align-items:center; gap:12px; }
        .wordmark {
          font-family:"Montagu Slab", serif;
          font-weight:700;
          letter-spacing:.06em;
          font-size:26px;
          background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple) 50%,var(--brand-pink));
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .layout{ max-width:1200px; margin:0 auto; display:grid; grid-template-columns: 320px 1fr; gap:24px; padding: 12px 24px 64px; }

        .sidebar{ background:var(--glass); backdrop-filter: blur(6px); border:1px solid rgba(15,23,42,.08); border-radius:18px; padding:18px; }
        .sectionList{ list-style:none; margin:0 0 14px; padding:0; display:grid; gap:6px; }
        .item{ padding:10px 12px; border-radius:12px; border:1px solid transparent; background:transparent; color:var(--ink); display:flex; align-items:center; gap:10px; cursor:pointer; }
        .item.active{ background:white; border-color:rgba(15,23,42,.08); }
        .dot{ width:8px; height:8px; border-radius:50%; background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple),var(--brand-pink)); }

        .todoPanel{ background:white; border-radius:14px; padding:12px; }
        .todoHeader{ font:600 13px Inter, sans-serif; margin-bottom:8px; }
        .todoForm{ display:flex; gap:8px; margin-bottom:10px; }
        .todoInput{ flex:1; padding:10px 12px; border-radius:10px; border:1px solid rgba(15,23,42,.12); }
        .addBtn{ padding:10px 14px; border-radius:10px; border:none; cursor:pointer; font:600 14px Inter, sans-serif; color:white; background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple) 55%,var(--brand-pink)); }
        .todoList{ list-style:none; margin:0; padding:0; display:grid; gap:6px; }
        .todoItem{ display:flex; align-items:center; justify-content:space-between; gap:8px; background:#fafafa; border:1px solid rgba(15,23,42,.08); border-radius:10px; padding:8px 10px; }
        .txt{ font:400 14px Inter, sans-serif; }
        .txt.done{ text-decoration:line-through; color:rgba(15,23,42,.5); }
        .delBtn{ background:transparent; border:none; font-size:18px; cursor:pointer; }

        .content{ background:var(--glass); border-radius:28px; padding: clamp(24px, 4vw, 48px); }
        .h1{ font-family:"Montagu Slab", serif; font-weight:700; font-size: clamp(40px, 6vw, 84px); background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple) 50%,var(--brand-pink)); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .h2{ font:700 clamp(20px, 2.6vw, 28px) Inter, sans-serif; color:var(--ink); }
        .tag{ font:400 clamp(16px, 2vw, 18px) Inter, sans-serif; color: var(--ink-dim); }

        .wheelCard{ border-radius:24px; background:white; padding:18px; }
        .wheel{ width: min(560px, 100%); }
        .slice{ cursor:pointer; transition: filter .15s ease; }
        .slice:hover{ filter: brightness(1.05); }
        .centerTitle{ font:700 14px Inter, sans-serif; fill: var(--ink); }
        .centerHint{ font:400 12px Inter, sans-serif; fill: rgba(15,23,42,.55); }
      `}</style>
    </>
  );
}
