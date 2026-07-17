import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code, Image, Mic, Video, Zap, Brain, Wand2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Video Background ──────────────────────────────────
function VideoBg() {
  const ref = useRef(null);
  const opacityRef = useRef(0);
  const targetOpacity = useRef(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Start video muted
    v.volume = 0;

    const FADE_DURATION = 250; // ms
    const FADE_OUT_TRIGGER = 0.55; // seconds before end

    const handleCanPlay = () => {
      targetOpacity.current = 0.5;
      startTimeRef.current = performance.now();
      v.play().catch(() => {});
    };

    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return; // Prevent re-trigger
      const remaining = v.duration - v.currentTime;
      // Start fade out when 0.55s remain
      if (remaining <= FADE_OUT_TRIGGER && remaining > 0) {
        fadingOutRef.current = true;
        targetOpacity.current = 0;
        startTimeRef.current = performance.now();
      }
    };

    const handleEnded = () => {
      // Reset and fade back in on loop
      fadingOutRef.current = false;
      v.currentTime = 0;
      targetOpacity.current = 0.5;
      startTimeRef.current = performance.now();
      v.play().catch(() => {});
    };

    v.addEventListener('canplay', handleCanPlay);
    v.addEventListener('timeupdate', handleTimeUpdate);
    v.addEventListener('ended', handleEnded);

    // RAF fade loop (250ms ease-out cubic)
    const fadeLoop = (timestamp) => {
      const current = opacityRef.current;
      const target = targetOpacity.current;

      if (startTimeRef.current !== null) {
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Fade in or out
        if (target > current) {
          opacityRef.current = target * eased;
        } else {
          opacityRef.current = current * (1 - eased);
        }
        v.style.opacity = opacityRef.current;
      }

      rafRef.current = requestAnimationFrame(fadeLoop);
    };

    rafRef.current = requestAnimationFrame(fadeLoop);

    return () => {
      v.removeEventListener('canplay', handleCanPlay);
      v.removeEventListener('timeupdate', handleTimeUpdate);
      v.removeEventListener('ended', handleEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <video
      ref={ref}
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4"
      muted
      loop
      playsInline
      autoPlay
      className="absolute object-cover object-top"
      style={{ width: '115%', height: '115%', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0 }}
    />
  );
}

// ─── Feature Card ──────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative rounded-2xl border border-black/5 bg-white p-6 hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-black/5">
        <Icon size={20} className="text-black" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-sm text-black/50 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Main Landing ──────────────────────────────────────
export default function Landing() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen" style={{ background: '#f8f8f8' }}>
      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between backdrop-blur-xl border-b border-black/5"
        style={{ padding: '16px 120px', background: 'rgba(248,248,248,0.8)' }}
      >
        <Link to="/" className="flex items-center">
          <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, letterSpacing: '-1.44px', color: '#000000' }}>
            Logos
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '16px', fontWeight: 500, letterSpacing: '-0.2px' }}>
          <a href="#features" className="flex items-center gap-1 transition-colors" style={{ color: '#505050' }}>
            Features <ChevronDown size={14} />
          </a>
          <a href="#how" className="transition-colors" style={{ color: '#505050' }}>How It Works</a>
          <a href="#projects" className="transition-colors" style={{ color: '#505050' }}>Projects</a>
          <a href="#community" className="transition-colors" style={{ color: '#505050' }}>Community</a>
          <a href="#contact" className="transition-colors" style={{ color: '#505050' }}>Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/editor"
            className="hidden sm:flex items-center justify-center rounded-full border text-sm transition-colors hover:bg-black/5"
            style={{ width: '82px', height: '40px', borderColor: '#000000', color: '#000000', fontFamily: "'Schibsted Grotesk', sans-serif" }}
          >
            Sign Up
          </Link>
          <Link
            to="/editor"
            className="flex items-center justify-center rounded-full text-sm font-semibold transition-colors hover:opacity-90"
            style={{ width: '101px', height: '40px', background: '#000000', color: '#ffffff', fontFamily: "'Schibsted Grotesk', sans-serif" }}
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <VideoBg />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" />

        <div
          className="relative z-10 mx-auto text-center"
          style={{ display: 'flex', flexDirection: 'column', gap: '34px', maxWidth: '1200px', paddingLeft: '120px', paddingRight: '120px', marginTop: '10px' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] mx-auto"
            style={{ background: '#0e1311' }}
          >
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: '#ffffff' }}>
              Discover what's possible
            </span>
          </motion.div>

          {/* Pre-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Instrument Serif', serif", fontSize: '48px', color: '#000000' }}
          >
            Write a small thing
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontFamily: "'Fustat', sans-serif", fontSize: '80px', fontWeight: 700, letterSpacing: '-4.8px', lineHeight: 'none', color: '#000000' }}
          >
            Transform Data Quickly
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ fontFamily: "'Fustat', sans-serif", fontSize: '20px', fontWeight: 500, letterSpacing: '-0.4px', color: '#505050', maxWidth: '736px', width: '542px', margin: '0 auto' }}
          >
            Upload your information and get powerful insights right away. Work smarter and achieve goals effortlessly.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mx-auto w-full"
            style={{ maxWidth: '728px' }}
          >
            <div
              className="flex flex-col px-6"
              style={{ background: 'rgba(0,0,0,0.24)', backdropFilter: 'blur(12px)', borderRadius: '18px', height: '200px' }}
            >
              {/* Top row: Credits */}
              <div className="flex items-center justify-between py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '12px', fontWeight: 500, color: '#ffffff' }}>60/450 credits</span>
                  <button
                    className="text-black text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:opacity-90"
                    style={{ background: 'rgba(90,225,76,0.89)', fontFamily: "'Schibsted Grotesk', sans-serif" }}
                  >
                    Upgrade
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3054ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                    <path d="M20 3v4" />
                    <path d="M22 5h-4" />
                  </svg>
                  <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '12px', fontWeight: 500, color: '#ffffff' }}>Powered by GPT-4o</span>
                </div>
              </div>

              {/* Input row */}
              <div
                className="flex items-center gap-3 flex-1 mt-4 px-4"
                style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '12px 16px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="Type question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontFamily: "'Fustat', sans-serif", fontSize: '16px', color: 'rgba(0,0,0,0.6)' }}
                />
                <button
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: '36px', height: '36px', background: '#000000' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </button>
              </div>

              {/* Bottom row: Action buttons */}
              <div className="flex items-center gap-2 py-3">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-white/15"
                  style={{ fontFamily: "'Schibsted Grotesk', sans-serif", background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  Attach
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-white/15"
                  style={{ fontFamily: "'Schibsted Grotesk', sans-serif", background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                  Voice
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors hover:bg-white/15"
                  style={{ fontFamily: "'Schibsted Grotesk', sans-serif", background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Prompts
                </button>
                <span className="ml-auto" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>0/3,000</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: '#000000' }}>
              Everything you need to<br />
              <span style={{ color: '#505050' }}>master prompt engineering</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Wand2}
              title="Prompt Optimizer"
              desc="Input rough prompts, get production-grade outputs. 5 modalities: text, code, image, video, audio."
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Reverse Engineer"
              desc="Upload any media — images, audio, video, URLs, code — and extract the prompt behind it."
              delay={0.1}
            />
            <FeatureCard
              icon={Code}
              title="Prompt → Website"
              desc="Describe what you want, get production-ready HTML, React, or Next.js code. Real AI generation."
              delay={0.2}
            />
            <FeatureCard
              icon={Sparkles}
              title="Playground"
              desc="Test prompts across multiple Groq models. Token counter, cost estimator, variable injection."
              delay={0.3}
            />
            <FeatureCard
              icon={Image}
              title="Image → Prompt"
              desc="Upload screenshots, get detailed recreation prompts. Powered by Groq Vision."
              delay={0.4}
            />
            <FeatureCard
              icon={Mic}
              title="Audio → Prompt"
              desc="Transcribe and analyze audio with Groq Whisper. Extract style, tone, and structure."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="relative py-32 px-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#000000' }}>
              Three steps to<br />
              <span style={{ color: '#505050' }}>perfect prompts</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Write your rough prompt', desc: "Don't worry about structure. Just describe what you want — even a sentence works." },
              { step: '02', title: 'Logos optimizes it', desc: 'AI analyzes intent, injects structure, adds constraints, and scores the result.' },
              { step: '03', title: 'Use it anywhere', desc: 'Copy to clipboard, export as JSON/Markdown, or send directly to any platform.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 p-6 rounded-2xl border border-black/5 bg-white"
              >
                <span className="text-5xl font-bold" style={{ color: 'rgba(0,0,0,0.1)' }}>{item.step}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>{item.title}</h3>
                  <p style={{ color: '#505050' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Models ── */}
      <section id="models" className="relative py-32 px-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>Models</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12" style={{ color: '#000000' }}>
              Powered by<br />
              <span style={{ color: '#505050' }}>Groq's fastest inference</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Llama 3.3', desc: '70B Versatile', color: '#3054ff' },
              { name: 'Llama 3.1', desc: '8B Instant', color: '#22c55e' },
              { name: 'Mixtral', desc: '8x7B', color: '#f59e0b' },
              { name: 'Whisper', desc: 'Large V3', color: '#ec4899' },
            ].map((model, i) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl border border-black/5 bg-white"
              >
                <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: model.color }} />
                <p className="font-semibold" style={{ color: '#000000' }}>{model.name}</p>
                <p className="text-sm" style={{ color: '#505050' }}>{model.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-32 px-6 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ color: '#000000' }}>
              Ready to optimize?
            </h2>
            <p className="mb-8" style={{ color: '#505050' }}>
              Start with a rough idea. Leave with a production-grade prompt.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/editor"
                className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full text-lg font-medium transition-all hover:shadow-lg"
                style={{ background: '#000000', color: '#ffffff' }}
              >
                Get Started Free
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <p className="mt-6 text-sm" style={{ color: '#505050' }}>
              No signup required. Free tier includes 30 requests/min.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-sm font-medium" style={{ color: '#000000' }}>Logos</span>
          </div>
          <p className="text-sm" style={{ color: '#505050' }}>
            Built with Groq AI. Open source.
          </p>
        </div>
      </footer>
    </div>
  );
}
