import Head from "next/head";
import { useMemo, useState } from "react";

type Todo = { id: string; text: string; done: boolean };

const SECTIONS = [
"Health","Career","Finances","Learning",
"Relationships","Family","Home","Spiritual",
"Fun","Community","Creativity","Environment"
];

export default function Home() {
const [active, setActive] = useState(0);

// per-section todo state
const [todosBySection, setTodosBySection] = useState<Record<number, Todo[]>>(
() => Object.fromEntries(SECTIONS.map((_, i) => [i, []]))
);

const addTodo = (i: number, text: string) => {
const t: Todo = { id: crypto.randomUUID(), text, done: false };
setTodosBySection(prev => ({ ...prev, [i]: [t, ...(prev[i] ?? [])] }));
};
const toggleTodo = (i: number, id: string) => {
setTodosBySection(prev => ({
...prev,
[i]: (prev[i] ?? []).map(t => (t.id === id ? { ...t, done: !t.done } : t)),
}));
};
const removeTodo = (i: number, id: string) => {
setTodosBySection(prev => ({
...prev,
[i]: (prev[i] ?? []).filter(t => t.id !== id),
}));
};

// ---------- Wheel (12 equal slices) ----------
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
const aStep = 360 / 12;
return Array.from({ length: 12 }, (_, i) => {
const a0 = i * aStep, a1 = (i + 1) * aStep;
return { d: arc(a0, a1), midAngle: a0 + aStep / 2 };
});
}, []);

// quick add input local state
const [draft, setDraft] = useState("");

return (
<>
<Head>
<title>Papilio Lux</title>
<meta name="description" content="Your complete life transformation begins here." />
{/* Professional SaaS fonts */}
<link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:wght@600;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
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
<stop offset="0%" stopColor="var(--brand-blue)" />
<stop offset="50%" stopColor="var(--brand-purple)" />
<stop offset="100%" stopColor="var(--brand-pink)" />
</linearGradient>
</defs>
<path fill="url(#g)" d="M22 30c-6-10-18-10-18-2 0 7 10 11 16 10-1 6-3 12 2 12 5 0 6-8 6-14 0-2 0-4-6-6zm20 0c6-10 18-10 18-2 0 7-10 11-16 10 1 6 3 12-2 12s-6-8-6-14c0-2 0-4 6-6z"/>
</svg>
<span className="brandWord">Papilio Lux</span>
</div>
</header>

<main className="layout">
{/* Sidebar */}
<aside className="sidebar" aria-label="Sections">
<h3>Sections</h3>
<ul>
{SECTIONS.map((s, i) => {
const openCount = (todosBySection[i] ?? []).filter(t => !t.done).length;
return (
<li key={s}>
<button
className={i === active ? "item active" : "item"}
onClick={() => setActive(i)}
aria-pressed={i === active}
>
<span className="dot" aria-hidden />
<span className="sname">{s}</span>
<span className="count" title="Open todos">{openCount}</span>
</button>
</li>
);
})}
</ul>
</aside>

{/* Main content */}
<section className="content">
<h1 className="heroTitle">Papilio Lux</h1>
<h2 className="sub">Life, Transformed.</h2>
<p className="tag">Your complete life transformation begins here.</p>

<div className="grid">
{/* Wheel */}
<div className="wheelCard">
<svg className="wheel" viewBox="0 0 400 400" role="group" aria-label="Interactive wheel of life">
<defs>
<linearGradient id="slice" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stopColor="var(--brand-blue)" />
<stop offset="50%" stopColor="var(--brand-purple)" />
<stop offset="100%" stopColor="var(--brand-pink)" />
</linearGradient>
</defs>

{slices.map((s, i) => (
<path
key={i}
d={s.d}
fill={i === active ? "url(#slice)" : "url(#slice)"}
opacity={i === active ? 1 : 0.25}
stroke="rgba(15,23,42,0.1)"
strokeWidth={1}
className="slice"
onClick={() => setActive(i)}
aria-label={SECTIONS[i]}
/>
))}

{/* center label */}
<circle cx="200" cy="200" r="72" fill="white" />
<text x="200" y="193" textAnchor="middle" className="centerTitle">
{SECTIONS[active]}
</text>
<text x="200" y="214" textAnchor="middle" className="centerHint">
click a slice
</text>
</svg>
</div>

{/* To-Do panel */}
<div className="todoCard">
<h3 className="todoTitle">{SECTIONS[active]} — To-Dos</h3>

<form
className="addRow"
onSubmit={(e) => {
e.preventDefault();
const txt = draft.trim();
if (!txt) return;
addTodo(active, txt);
setDraft("");
}}
>
<input
aria-label="Add a to-do"
className="input"
placeholder={`Add a ${SECTIONS[active]} task…`}
value={draft}
onChange={(e) => setDraft(e.target.value)}
/>
<button className="addBtn" type="submit">Add</button>
</form>

<ul className="list">
{(todosBySection[active] ?? []).map(t => (
<li key={t.id} className={t.done ? "row done" : "row"}>
<label className="check">
<input
type="checkbox"
checked={t.done}
onChange={() => toggleTodo(active, t.id)}
/>
<span />
</label>
<span className="txt">{t.text}</span>
<button className="del" onClick={() => removeTodo(active, t.id)} aria-label="Delete">×</button>
</li>
))}
{(todosBySection[active] ?? []).length === 0 && (
<li className="empty">No to-dos yet. Add your first one above.</li>
)}
</ul>
</div>
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
.top {
display: flex;
justify-content: center;
align-items: center;
padding: 20px;
position: sticky;
top: 0;
z-index: 100;
background: var(--glass);
backdrop-filter: blur(8px);
}

.brandRow {
display: flex;
align-items: center;
gap: 12px;
}

.wordmark {
font-family: "Montagu Slab", serif;
font-weight: 700;
font-size: 26px;
letter-spacing: .06em;
background: linear-gradient(
135deg,
var(--brand-blue),
var(--brand-purple) 50%,
var(--brand-pink)
);
-webkit-background-clip: text;
background-clip: text;
color: transparent;
}
/* Background with brand gradient + subtle butterflies */
.page{
min-height:100vh;
background:
radial-gradient(40% 55% at 16% 8%, rgba(94,161,255,.35), transparent 60%),
radial-gradient(48% 55% at 82% 8%, rgba(139,92,246,.32), transparent 60%),
radial-gradient(45% 45% at 58% 80%, rgba(244,114,182,.22), transparent 60%),
linear-gradient(135deg, #f7fbff, #f8f5ff);
position:relative; overflow:auto;
}
.page::after{
content:"";
position:fixed; inset:0; pointer-events:none; opacity:.12;
background-image: url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%235ea1ff'/><stop offset='50%' stop-color='%238b5cf6'/><stop offset='100%' stop-color='%23f472b6'/></linearGradient></defs><path fill='url(%23g)' d='M22 30c-6-10-18-10-18-2 0 7 10 11 16 10-1 6-3 12 2 12 5 0 6-8 6-14 0-2 0-4-6-6zm20 0c6-10 18-10 18-2 0 7-10 11-16 10 1 6 3 12-2 12s-6-8-6-14c0-2 0-4 6-6z' opacity='.5'/></svg>`)}");
background-size: 180px 180px; background-repeat: repeat;
mix-blend-mode: multiply;
}

.nav{
display:flex; align-items:center; justify-content:center; padding:16px 20px;
}
.logo{ display:flex; align-items:center; gap:10px; }
.brandWord{
font:700 16px Inter, system-ui, sans-serif;
background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple) 50%,var(--brand-pink));
-webkit-background-clip:text; background-clip:text; color:transparent;
letter-spacing:.06em;
}

.layout{
max-width:1200px; margin:0 auto; display:grid;
grid-template-columns: 260px 1fr; gap:24px; padding: 20px 24px 64px;
}

.sidebar{
background:var(--glass); backdrop-filter: blur(6px);
border:1px solid rgba(15,23,42,.08);
border-radius:18px; padding:18px;
box-shadow: 0 10px 25px rgba(17,24,39,.06), inset 0 1px 0 rgba(255,255,255,.5);
}
.sidebar h3{ margin:0 0 10px; font:700 14px Inter, system-ui, sans-serif; letter-spacing:.12em; text-transform:uppercase; color:rgba(15,23,42,.7) }
.sidebar ul{ list-style:none; margin:0; padding:0; display:grid; gap:6px; }
.item{
width:100%; text-align:left; font:600 14px Inter, system-ui, sans-serif;
padding:10px 12px; border-radius:12px; border:1px solid transparent;
background:transparent; color:var(--ink); display:flex; align-items:center; gap:10px; cursor:pointer;
}
.item:hover{ background:rgba(255,255,255,.6) }
.item.active{ background:white; border-color:rgba(15,23,42,.08); box-shadow:0 8px 18px rgba(17,24,39,.06) }
.dot{ width:8px; height:8px; border-radius:50%; background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple),var(--brand-pink)); flex:0 0 auto; }
.sname{ flex:1 }
.count{
min-width:1.75rem; height:1.25rem; padding:0 .4rem; border-radius:999px;
background:rgba(15,23,42,.06); color:var(--ink); font:600 12px Inter, system-ui, sans-serif;
display:grid; place-items:center;
}

.content{
background:var(--glass); backdrop-filter: blur(8px);
border:1px solid rgba(15,23,42,.08);
border-radius:28px; padding: clamp(24px, 4vw, 48px);
box-shadow: 0 12px 30px rgba(17,24,39,.06), inset 0 1px 0 rgba(255,255,255,.55);
}

.heroTitle{
margin:6px 0 4px;
font-family:"Montagu Slab", serif; font-weight:700; letter-spacing:.06em;
font-size: clamp(40px, 6vw, 84px); line-height:1.02;
background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple) 50%,var(--brand-pink));
-webkit-background-clip:text; background-clip:text; color:transparent;
}
.sub{ margin:0; font:700 clamp(20px, 2.6vw, 28px) Inter, system-ui, sans-serif; color:var(--ink); }
.tag{ margin:10px 0 24px; font:400 clamp(16px, 2vw, 18px) Inter, system-ui, sans-serif; color: var(--ink-dim); }

.grid{ display:grid; grid-template-columns: 1.1fr .9fr; gap:20px; }
@media (max-width: 980px){ .grid{ grid-template-columns: 1fr; } }

.wheelCard{
border-radius:24px; background:white; padding:18px;
border:1px solid rgba(15,23,42,.06);
box-shadow: 0 10px 24px rgba(17,24,39,.06);
display:flex; justify-content:center; align-items:center;
}
.wheel{ width: min(540px, 100%); height:auto; display:block; }
.slice{ transition: filter .15s ease; cursor:pointer; }
.slice:hover{ filter: brightness(1.05) drop-shadow(0 2px 6px rgba(17,24,39,.12)); }

.centerTitle{ font: 700 14px Inter, system-ui, sans-serif; fill: var(--ink); }
.centerHint{ font: 400 12px Inter, system-ui, sans-serif; fill: rgba(15,23,42,.55); }

.todoCard{
background:white; border:1px solid rgba(15,23,42,.06); border-radius:24px;
box-shadow: 0 10px 24px rgba(17,24,39,.06); padding:18px;
}
.todoTitle{ margin:0 0 10px; font:700 16px Inter, system-ui, sans-serif; color:var(--ink); }

.addRow{ display:flex; gap:10px; margin-bottom:12px; }
.input{
flex:1; padding:12px 14px; border-radius:12px; border:1px solid rgba(15,23,42,.12);
font:400 14px Inter, system-ui, sans-serif; outline:none;
}
.input:focus{ border-color: var(--brand-purple); box-shadow: 0 0 0 3px rgba(139,92,246,.18); }
.addBtn{
padding:12px 16px; border-radius:12px; border:0; cursor:pointer; font:600 14px Inter, system-ui, sans-serif; color:white;
background: linear-gradient(135deg, var(--brand-blue), var(--brand-purple) 55%, var(--brand-pink));
box-shadow: 0 8px 18px rgba(139,92,246,.18);
}

.list{ list-style:none; margin:0; padding:0; display:grid; gap:8px; }
.row{
display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px solid rgba(15,23,42,.08);
border-radius:12px; background:#fff;
}
.row.done .txt{ text-decoration: line-through; color: rgba(15,23,42,.45); }
.check{ display:inline-flex; align-items:center; gap:10px; cursor:pointer; }
.check input{ display:none; }
.check span{
width:18px; height:18px; border-radius:6px; display:inline-block; border:1.5px solid rgba(15,23,42,.25);
background: #fff;
}
.row.done .check span{ background:linear-gradient(135deg,var(--brand-blue),var(--brand-purple) 55%,var(--brand-pink)); border-color:transparent; }
.txt{ flex:1; font:500 14px Inter, system-ui, sans-serif; color:var(--ink); }
.del{
border:0; background:transparent; font-size:18px; line-height:1; cursor:pointer; color:rgba(15,23,42,.45);
}
.del:hover{ color:rgba(15,23,42,.8) }
.empty{ color: rgba(15,23,42,.55); font:400 13px Inter, system-ui, sans-serif; padding:6px 2px; }
`}</style>
</>
);
}