import Head from "next/head";
import Link from "next/link";

const SECTIONS = [
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
  return (
    <>
      <Head>
        <title>Papilio Lux — The Light of Transformation</title>
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
          {SECTIONS.map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} className="card">
              <span className="icon" aria-hidden>
                {s.icon}
              </span>
              <span className="label">{s.label}</span>
            </Link>
          ))}
        </section>

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
        }
        .card:hover {
          transform: translateY(-3px);
          background: linear-gradient(180deg, var(--card-hover), var(--bg-elev));
          border-color: rgba(247, 200, 108, 0.25);
          box-shadow: var(--glow);
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
      `}</style>
    </>
  );
}
