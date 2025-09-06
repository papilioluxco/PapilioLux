import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // store as ISO string for safer serialization
  section: string;
}

interface Section {
  slug: string;
  label: string;
  icon: string;
}

const SECTIONS: Section[] = [
  { slug: "finances", label: "Finances", icon: "💳" },
  { slug: "environment", label: "Environment", icon: "🌍" },
  { slug: "relationships", label: "Relationships", icon: "💞" },
  { slug: "romance", label: "Romance", icon: "💘" },
  { slug: "physical-health", label: "Physical Health", icon: "🏋️" },
  { slug: "mental-health", label: "Mental Health", icon: "🧠" },
  { slug: "personal-growth", label: "Personal Growth", icon: "🌱" },
  { slug: "hobbies", label: "Hobbies", icon: "🎨" },
  { slug: "travel", label: "Travel", icon: "✈️" },
  { slug: "career", label: "Career", icon: "💼" },
  { slug: "community", label: "Community", icon: "🤝" },
  { slug: "spiritual", label: "Spiritual", icon: "✨" },
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [beans, setBeans] = useState(0);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [newTodoText, setNewTodoText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("papilio-todos");
      const savedBeans = localStorage.getItem("papilio-beans");

      if (savedTodos) {
        const parsed: Todo[] = JSON.parse(savedTodos);
        // Ensure shape is correct
        setTodos(
          parsed.map((t) => ({
            ...t,
            createdAt: t.createdAt || new Date().toISOString(),
          }))
        );
      }
      if (savedBeans) setBeans(Number(savedBeans) || 0);
    } catch {
      // ignore parse errors, start clean
      setTodos([]);
      setBeans(0);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("papilio-todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("papilio-beans", String(beans));
  }, [beans]);

  // Close modal on ESC and lock scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (selectedSection) {
      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // focus input after modal opens
      setTimeout(() => inputRef.current?.focus(), 0);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [selectedSection]);

  const addTodo = (section: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: crypto?.randomUUID?.() ?? Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      section,
    };
    setTodos((prev) => [newTodo, ...prev]);
    setNewTodoText("");
  };

  const toggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId) return todo;
        const newCompleted = !todo.completed;
        // award/remove bean
        setBeans((b) => (newCompleted ? b + 1 : Math.max(0, b - 1)));
        return { ...todo, completed: newCompleted };
      })
    );
  };

  const deleteTodo = (todoId: string) => {
    const t = todos.find((x) => x.id === todoId);
    if (t?.completed) setBeans((b) => Math.max(0, b - 1));
    setTodos((prev) => prev.filter((x) => x.id !== todoId));
  };

  const getSectionTodos = (section: string) =>
    todos.filter((t) => t.section === section);

  const handleSectionClick = (section: Section) => {
    setSelectedSection(section);
  };

  const closeModal = () => {
    setSelectedSection(null);
    setNewTodoText("");
  };

  return (
    <>
      <Head>
        <title>Papilio Lux — Life, transformed.</title>
        <meta
          name="description"
          content="Papilio Lux helps you align 12 dimensions of life and take the leap into balance."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="page">
        <nav className="nav">
          <div className="brand">
            <span>Papilio Lux</span>
          </div>

          <div className="bean-counter" title="Completed tasks">
            <span className="bean-icon">✦</span>
            <span className="bean-count">{beans} Beans</span>
          </div>

          <div className="nav-actions">
            <Link href="/login" className="btn ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn solid">
              Get Started
            </Link>
          </div>
        </nav>

        <header className="hero">
          <div className="badge">NEW • v0.1 Prototype</div>
          <h1>
            The <span className="accent">Light</span> of Transformation
          </h1>
          <p className="subtitle">
            Organize your life across <strong>12 dimensions</strong>. Build
            balance. Take the leap.
          </p>
          <div className="cta">
            <a href="#wheel" className="btn solid lg">
              Explore the Wheel
            </a>
            <Link href="/about" className="btn ghost lg">
              Learn more
            </Link>
          </div>
          <div className="halo" aria-hidden />
        </header>

        <section id="wheel" className="wheel" aria-label="Wheel of Life">
          {SECTIONS.map((s) => {
            const sectionTodos = getSectionTodos(s.slug);
            const completedCount = sectionTodos.filter((t) => t.completed).length;
            const totalCount = sectionTodos.length;
            const progress =
              totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <button
                key={s.slug}
                className="card interactive"
                onClick={() => handleSectionClick(s)}
                aria-label={`${s.label} — ${completedCount} of ${totalCount} completed`}
              >
                <span className="icon" aria-hidden>
                  {s.icon}
                </span>
                <span className="label">{s.label}</span>

                {/* progress pill */}
                {totalCount > 0 && (
                  <span className="progress" aria-hidden>
                    {completedCount}/{totalCount} · {progress}%
                  </span>
                )}

                {/* subtle ring */}
                <span
                  className="ring"
                  style={
                    {
                      "--ring": `${Math.min(progress, 100)}%`,
                    } as React.CSSProperties
                  }
                  aria-hidden
                />
              </button>
            );
          })}
        </section>

        {/* Modal */}
        {selectedSection && (
          <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedSection.label} tasks`}
            onClick={closeModal}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <span className="modal-icon">{selectedSection.icon}</span>
                  {selectedSection.label}
                </h2>
                <button
                  className="close-btn"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="modal-content">
                <div className="add-todo">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new goal or task..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTodoText.trim()) {
                        addTodo(selectedSection.slug, newTodoText);
                      }
                    }}
                  />
                  <button
                    className="add-btn"
                    onClick={() => {
                      if (newTodoText.trim()) {
                        addTodo(selectedSection.slug, newTodoText);
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                <div className="todos-list">
                  {getSectionTodos(selectedSection.slug).map((todo) => (
                    <div
                      key={todo.id}
                      className={`todo-item ${todo.completed ? "completed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        aria-label={todo.completed ? "Mark as not done" : "Mark as done"}
                      />
                      <span className="todo-text">{todo.text}</span>
                      <div className="todo-actions">
                        <button
                          className="calendar-btn"
                          title="Schedule in Calendar"
                          onClick={() => {
                            alert(
                              "Google Calendar integration is coming soon. (We’ll wire this after Supabase auth.)"
                            );
                          }}
                        >
                          📅
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteTodo(todo.id)}
                          title="Delete task"
                          aria-label="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}

                  {getSectionTodos(selectedSection.slug).length === 0 && (
                    <div className="empty-state">
                      <p>No tasks yet. Add your first goal above!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>
            Made with ❤️ for your next leap • © {new Date().getFullYear()} Papilio
            Lux
          </p>
        </footer>
      </main>

      <style jsx>{`
        /* ===========================
           LOCKED COLOR SCHEME
        ============================ */
        :root {
          --bg: #0c0a18; /* deep indigo */
          --bg-elev: #131125; /* slightly lighter surfaces */
          --fg: #edf0ff; /* soft near-white */
          --muted: #b9bff2; /* muted text */
          --primary: #6b4de6; /* lux violet */
          --primary-2: #9e88ff; /* secondary violet */
          --accent: #f7c86c; /* soft gold accent */
          --card: #151332; /* card surface */
          --card-hover: #1b1942; /* hover surface */
          --border: rgba(255, 255, 255, 0.08);
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
          --glow: 0 0 60px rgba(247, 200, 108, 0.22),
            0 0 120px rgba(107, 77, 230, 0.2);
          --radius: 18px;
        }

        .page {
          min-height: 100svh;
          background:
            radial-gradient(
              80% 60% at 70% 0%,
              rgba(107, 77, 230, 0.25),
              transparent 60%
            ),
            radial-gradient(
              60% 50% at 20% 10%,
              rgba(247, 200, 108, 0.18),
              transparent 70%
            ),
            linear-gradient(180deg, #0c0a18 0%, #0b0a16 100%);
          color: var(--fg);
          display: flex;
          flex-direction: column;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 22px;
          backdrop-filter: blur(10px);
          background: linear-gradient(
            180deg,
            rgba(12, 10, 24, 0.8) 0%,
            rgba(12, 10, 24, 0.35) 100%
          );
          border-bottom: 1px solid var(--border);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.4px;
        }

        .bean-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(90deg, var(--accent), var(--primary-2));
          border-radius: 20px;
          color: var(--bg);
          font-weight: 800;
          font-size: 0.9rem;
          box-shadow: var(--shadow);
          white-space: nowrap;
        }

        .bean-icon {
          font-size: 1.1rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero {
          position: relative;
          max-width: 1100px;
          margin: 80px auto 24px;
          padding: 0 20px;
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.04);
          color: var(--muted);
          font-size: 0.8rem;
          margin-bottom: 14px;
        }

        .hero h1 {
          font-size: clamp(2.2rem, 3.8vw + 1rem, 4rem);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 12px 0;
          text-shadow: 0 6px 30px rgba(0, 0, 0, 0.35);
        }

        .accent {
          background: linear-gradient(90deg, var(--accent), var(--primary-2));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .subtitle {
          color: var(--muted);
          font-size: clamp(1rem, 0.8rem + 0.6vw, 1.25rem);
          margin: 0 auto;
          max-width: 720px;
        }

        .cta {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .halo {
          position: absolute;
          inset: -60px 0 auto 0;
          height: 280px;
          background:
            radial-gradient(
              60% 40% at 50% 40%,
              rgba(247, 200, 108, 0.18),
              transparent 65%
            ),
            radial-gradient(
              40% 30% at 50% 20%,
              rgba(107, 77, 230, 0.28),
              transparent 60%
            );
          filter: blur(18px);
          pointer-events: none;
          z-index: -1;
        }

        .wheel {
          max-width: 1100px;
          margin: 28px auto 80px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        @media (min-width: 640px) {
          .wheel {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .wheel {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          padding: 18px;
          background: linear-gradient(180deg, var(--card), var(--bg-elev));
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          text-decoration: none;
          color: var(--fg);
          transition: transform 160ms ease, background 160ms ease,
            border-color 160ms ease, box-shadow 160ms ease;
        }
        .card:hover,
        .card.interactive:hover {
          transform: translateY(-3px);
          background: linear-gradient(180deg, var(--card-hover), var(--bg-elev));
          border-color: rgba(247, 200, 108, 0.25);
          box-shadow: var(--glow);
        }
        .card.interactive {
          cursor: pointer;
        }

        .ring {
          pointer-events: none;
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background:
            conic-gradient(
              var(--accent) var(--ring),
              rgba(255, 255, 255, 0.08) var(--ring)
            );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px; /* ring thickness */
          opacity: 0.2;
        }

        .progress {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--primary);
          color: white;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .icon {
          font-size: 1.6rem;
        }
        .label {
          font-weight: 600;
          letter-spacing: 0.2px;
          color: #f5f6ff;
        }

        .footer {
          border-top: 1px solid var(--border);
          color: var(--muted);
          text-align: center;
          padding: 26px 16px 46px;
          margin-top: auto;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          text-decoration: none;
          color: var(--fg);
          transition: transform 160ms ease, background 160ms ease,
            border-color 160ms ease;
          font-weight: 600;
          letter-spacing: 0.2px;
          background: rgba(255, 255, 255, 0.03);
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .btn.solid {
          background: linear-gradient(90deg, var(--primary), var(--primary-2));
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .btn.ghost {
          background: transparent;
        }
        .btn.lg {
          padding: 12px 18px;
          border-radius: 14px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .modal {
          background: linear-gradient(180deg, var(--card), var(--bg-elev));
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--glow);
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          margin: auto;
        }
        .modal-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h2 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 800;
        }
        .modal-icon {
          font-size: 1.8rem;
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          transition: background 160ms ease, color 160ms ease;
        }
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--fg);
        }
        .modal-content {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .add-todo {
          display: flex;
          gap: 10px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .add-todo input {
          flex: 1;
          min-width: 220px;
          padding: 12px 16px;
          background: var(--bg-elev);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--fg);
          font-size: 1rem;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }
        .add-todo input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(107, 77, 230, 0.2);
        }
        .add-todo input::placeholder {
          color: var(--muted);
        }
        .add-btn {
          padding: 12px 20px;
          background: linear-gradient(90deg, var(--primary), var(--primary-2));
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: transform 160ms ease, opacity 160ms ease;
        }
        .add-btn:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .todos-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .todo-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: var(--bg-elev);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 160ms ease;
        }
        .todo-item:hover {
          border-color: rgba(247, 200, 108, 0.25);
        }
        .todo-item.completed {
          opacity: 0.7;
        }
        .todo-item.completed .todo-text {
          text-decoration: line-through;
          color: var(--muted);
        }
        .todo-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
          cursor: pointer;
        }
        .todo-text {
          flex: 1;
          color: var(--fg);
          font-weight: 600;
        }
        .todo-actions {
          display: flex;
          gap: 6px;
        }
        .calendar-btn,
        .delete-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 160ms ease;
        }
        .calendar-btn:hover,
        .delete-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
        }

        /* Mobile tweaks */
        @media (max-width: 640px) {
          .bean-counter {
            display: none;
          }
          .nav {
            padding: 14px 16px;
          }
          .nav-actions {
            gap: 6px;
          }
          .nav-actions .btn {
            padding: 8px 12px;
            font-size: 0.85rem;
          }
          .modal {
            max-width: 95vw;
            max-height: 88vh;
          }
          .modal-header {
            padding: 16px;
          }
          .modal-header h2 {
            font-size: 1.25rem;
          }
          .modal-content {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
