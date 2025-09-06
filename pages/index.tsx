import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('papilio-todos');
    const savedBeans = localStorage.getItem('papilio-beans');
    
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
    
    if (savedBeans) {
      setBeans(parseInt(savedBeans));
    }
  }, []);

  // Save to localStorage whenever todos or beans change
  useEffect(() => {
    localStorage.setItem('papilio-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('papilio-beans', beans.toString());
  }, [beans]);

  const addTodo = (section: string, text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      section
    };
    setTodos(prev => [...prev, newTodo]);
    setNewTodoText("");
  };

  const toggleTodo = (todoId: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        const wasCompleted = todo.completed;
        const newCompleted = !todo.completed;
        
        // Award or remove bean
        if (!wasCompleted && newCompleted) {
          setBeans(prev => prev + 1);
        } else if (wasCompleted && !newCompleted) {
          setBeans(prev => Math.max(0, prev - 1));
        }
        
        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));
  };

  const deleteTodo = (todoId: string) => {
    const todoToDelete = todos.find(t => t.id === todoId);
    if (todoToDelete && todoToDelete.completed) {
      setBeans(prev => Math.max(0, prev - 1));
    }
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  const getSectionTodos = (section: string) => {
    return todos.filter(todo => todo.section === section);
  };

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
          <div className="bean-counter">
            <span className="bean-icon">☆</span>
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
            <span className="accent">Life</span>, transformed.
          </h1>
          <p className="subtitle">
            Organize your life across <strong>12 dimensions</strong>. Build balance. Take the leap.
          </p>
          <div className="cta">
            <Link href="#wheel" className="btn solid lg">
              Explore the Wheel
            </Link>
            <Link href="/about" className="btn ghost lg">
              Learn more
            </Link>
          </div>
          <div className="halo" aria-hidden />
        </header>

        <section id="wheel" className="wheel">
          {SECTIONS.map((s) => {
            const sectionTodos = getSectionTodos(s.slug);
            const completedCount = sectionTodos.filter(t => t.completed).length;
            const totalCount = sectionTodos.length;
            
            return (
              <div 
                key={s.slug} 
                className="card interactive"
                onClick={() => handleSectionClick(s)}
              >
                <span className="icon" aria-hidden>
                  {s.icon}
                </span>
                <span className="label">{s.label}</span>
                {totalCount > 0 && (
                  <span className="progress">
                    {completedCount}/{totalCount}
                  </span>
                )}
              </div>
            );
          })}
        </section>

        {/* Todo Modal */}
        {selectedSection && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <span className="modal-icon">{selectedSection.icon}</span>
                  {selectedSection.label}
                </h2>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="add-todo">
                  <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new goal or task..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newTodoText.trim()) {
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
                    <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span className="todo-text">{todo.text}</span>
                      <div className="todo-actions">
                        <button 
                          className="calendar-btn" 
                          title="Schedule in Calendar"
                          onClick={() => {
                            // Placeholder for Google Calendar integration
                            alert('Google Calendar integration will be available after setup. Click OK to learn how to set it up!');
                          }}
                        >
                          📅
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteTodo(todo.id)}
                          title="Delete task"
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
          <p>Made with ❤️ for your next leap • © {new Date().getFullYear()} Papilio Lux</p>
        </footer>
      </main>

      <style jsx>{`
        /* ===========================
           LOCKED COLOR SCHEME
        ============================ */
        :root {
          --bg: #0c0a18;          /* deep indigo */
          --bg-elev: #131125;     /* slightly lighter surfaces */
          --fg: #edf0ff;          /* soft near-white */
          --muted: #b9bff2;       /* muted text */
          --primary: #6b4de6;     /* lux violet */
          --primary-2: #9e88ff;   /* secondary violet */
          --accent: #f7c86c;      /* soft gold accent */
          --card: #151332;        /* card surface */
          --card-hover: #1b1942;  /* hover surface */
          --border: rgba(255, 255, 255, 0.08);
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
          --glow: 0 0 60px rgba(247, 200, 108, 0.22),
                  0 0 120px rgba(107, 77, 230, 0.2);
          --radius: 18px;
        }

        .page {
          min-height: 100svh;
          background:
            radial-gradient(80% 60% at 70% 0%, rgba(107, 77, 230, 0.25), transparent 60%),
            radial-gradient(60% 50% at 20% 10%, rgba(247, 200, 108, 0.18), transparent 70%),
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

        .bean-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(90deg, var(--accent), var(--primary-2));
          border-radius: 20px;
          color: var(--bg);
          font-weight: 700;
          font-size: 0.9rem;
          box-shadow: var(--shadow);
        }

        .bean-icon {
          font-size: 1.1rem;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.4px;
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
        }

        .halo {
          position: absolute;
          inset: -60px 0 auto 0;
          height: 280px;
          background:
            radial-gradient(60% 40% at 50% 40%, rgba(247, 200, 108, 0.18), transparent 65%),
            radial-gradient(40% 30% at 50% 20%, rgba(107, 77, 230, 0.28), transparent 60%);
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
          .wheel { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .wheel { grid-template-columns: repeat(4, 1fr); }
        }

        .card {
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
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
          position: relative;
        }
        .card:hover, .card.interactive:hover {
          transform: translateY(-3px);
          background: linear-gradient(180deg, var(--card-hover), var(--bg-elev));
          border-color: rgba(247, 200, 108, 0.25);
          box-shadow: var(--glow);
        }
        .card.interactive {
          cursor: pointer;
        }
        .progress {
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--primary);
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .icon { font-size: 1.6rem; }
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
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
          font-weight: 600;
          letter-spacing: 0.2px;
          background: rgba(255, 255, 255, 0.03);
        }
        .btn:hover { transform: translateY(-1px); }

        .btn.solid {
          background: linear-gradient(90deg, var(--primary), var(--primary-2));
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn.ghost { background: transparent; }
        .btn.lg { padding: 12px 18px; border-radius: 14px; }

        /* Modal Styles */
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
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          margin: auto;
        }

        @media (max-width: 640px) {
          .modal {
            max-width: 95vw;
            max-height: 85vh;
            margin: 20px 0;
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
          
          .add-todo {
            flex-direction: column;
            gap: 8px;
          }
          
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
          font-weight: 700;
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
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
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
        }

        .add-todo {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .add-todo input {
          flex: 1;
          padding: 12px 16px;
          background: var(--bg-elev);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--fg);
          font-family: 'Montserrat', sans-serif;
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
          font-weight: 600;
          cursor: pointer;
          transition: transform 160ms ease, opacity 160ms ease;
        }
        .add-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .todos-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
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
          font-weight: 500;
        }

        .todo-actions {
          display: flex;
          gap: 6px;
        }

        .calendar-btn, .delete-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 160ms ease;
        }
        .calendar-btn:hover, .delete-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--muted);
        }
        .empty-state p {
          margin: 0;
          font-style: italic;
        }
      `}</style>
    </>
  );
}
