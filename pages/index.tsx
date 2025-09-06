import Head from "next/head";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import styles from "../styles/home.module.css"; // <--- make sure this is here

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function Home() {
return (
<>
<Head>
<title>Papilio Lux — The Light of Transformation</title>
<meta
name="description"
content="Papilio Lux helps you organize your life, gamify progress, and move through transformation with clarity."
/>
<meta name="viewport" content="width=device-width, initial-scale=1" />
</Head>

<main className={`${montserrat.className} ${styles.page}`}>
{/* HERO */}
<section className={styles.hero}>
<div className={styles.heroInner}>
<div className={styles.logoWrap}>
<Image
src="/logo.png" // make sure your logo is in /public/logo.png
alt="Papilio Lux logo"
width={140}
height={140}
priority
/>
</div>
<h1 className={styles.title}>Papilio Lux</h1>
<p className={styles.subtitle}>The Light of Transformation</p>
<div className={styles.ctaRow}>
<a href="#waitlist" className={`${styles.cta} ${styles.ctaPrimary}`}>Join the Waitlist</a>
<a href="#learn" className={`${styles.cta} ${styles.ctaGhost}`}>Learn More</a>
</div>
</div>
</section>

{/* FEATURES */}
<section id="learn" className={styles.section}>
<div className={styles.container}>
<h2 className={styles.h2}>Clarity, Organization, Momentum</h2>
<div className={styles.featureGrid}>
<div className={styles.card}>
<h3 className={styles.h3}>12 Life Areas</h3>
<p>Create focus across the full wheel of life—work, health, relationships, finances, and more.</p>
</div>
<div className={styles.card}>
<h3 className={styles.h3}>Calendar Sync</h3>
<p>Send action steps straight to your calendar so intentions become real time slots.</p>
</div>
<div className={styles.card}>
<h3 className={styles.h3}>Gamified Progress</h3>
<p>Earn streaks and milestones as you move from caterpillar to butterfly.</p>
</div>
</div>
</div>
</section>

{/* JOURNEY */}
<section className={`${styles.section} ${styles.sectionAlt}`}>
<div className={styles.container}>
<h2 className={styles.h2}>Your Transformation Journey</h2>
<ol className={styles.journey}>
<li>
<span className={styles.step}>1</span>
<div>
<h4 className={styles.h4}>Caterpillar: Awareness</h4>
<p>Capture everything weighing on your mind and sort it by life area.</p>
</div>
</li>
<li>
<span className={styles.step}>2</span>
<div>
<h4 className={styles.h4}>Chrysalis: Plan</h4>
<p>Turn intentions into calendar-backed micro-commitments.</p>
</div>
</li>
<li>
<span className={styles.step}>3</span>
<div>
<h4 className={styles.h4}>Butterfly: Lift</h4>
<p>Track momentum, earn streaks, and celebrate visible change.</p>
</div>
</li>
</ol>
</div>
</section>

{/* WAITLIST */}
<section id="waitlist" className={styles.section}>
<div className={styles.container}>
<h2 className={styles.h2}>Get Early Access</h2>
<p className={styles.centerText}>Be the first to try Papilio Lux and shape the roadmap.</p>
<form
className={styles.form}
action="https://formspree.io/f/your-form-id" // replace with your endpoint
method="POST"
>
<input
className={styles.input}
type="email"
name="email"
placeholder="you@example.com"
required
/>
<button className={styles.submit} type="submit">Notify Me</button>
</form>
<p className={styles.fine}>No spam. Unsubscribe anytime.</p>
</div>
</section>

{/* FOOTER */}
<footer className={styles.footer}>
<div className={styles.containerFooter}>
<span>© {new Date().getFullYear()} Papilio Lux</span>
<nav className={styles.footerNav}>
<a href="#learn">Features</a>
<a href="#waitlist">Waitlist</a>
<a href="mailto:hello@papiliolux.com">Contact</a>
</nav>
</div>
</footer>
</main>
</>
);
}
