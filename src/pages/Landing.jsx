import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code, Image, Mic, Video, Zap, Brain, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Video Background ──────────────────────────────────
function VideoBg() {
  const ref = useRef(null);
  const videoSrc = 'https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8';

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Try HLS.js if available, fallback to native
    import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(videoSrc);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => v.play().catch(() => {}));
        return () => hls.destroy();
      }
    }).catch(() => {
      // hls.js not installed, try native
      if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = videoSrc;
      }
    });
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover opacity-50"
      poster="https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?w=1920&q=80"
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
      className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-[#3054ff]/30 hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#3054ff]/10 text-[#3054ff] group-hover:bg-[#3054ff]/20 transition-colors">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Main Landing ──────────────────────────────────────
export default function Landing() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 px-6 py-4 flex items-center justify-between bg-black/60 backdrop-blur-xl border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles size={22} className="text-[#3054ff]" />
          <span className="text-xl font-bold tracking-tight">Logos</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how" className="hover:text-white transition-colors">How It Works</a>
          <a href="#models" className="hover:text-white transition-colors">Models</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/editor" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            to="/editor"
            className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        <VideoBg />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

        {/* Decorative gradients */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#3054ff]/10 blur-[120px] mix-blend-screen rounded-full" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] mix-blend-screen rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mt-20 space-y-8">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
          >
            <Zap size={14} className="text-[#3054ff]" />
            <span className="text-sm text-white/70">Powered by Groq — Blazing fast inference</span>
          </motion.div>

          {/* Pre-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-white/80"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Write a small thing
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl md:text-8xl lg:text-[120px] font-bold leading-[0.9] tracking-tighter"
          >
            <span className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent">
              Logos Optimizes It.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            The prompt engineering platform that turns rough ideas into production-grade prompts.
            Optimize, reverse engineer, generate — all in one tool.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/editor"
              className="group flex items-center gap-3 bg-white text-black pl-6 pr-2 py-2 rounded-full text-lg font-medium hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
            >
              Start Optimizing Free
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3054ff] group-hover:bg-[#2040e0] transition-colors">
                <ArrowRight size={18} className="text-white" />
              </span>
            </Link>

            <Link
              to="/playground"
              className="flex items-center gap-2 text-white/60 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              Try Playground
              <ArrowRight size={16} />
            </Link>
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
            <p className="text-sm font-medium text-[#3054ff] mb-4 uppercase tracking-wider">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to<br />
              <span className="text-white/40">master prompt engineering</span>
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
      <section id="how" className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-[#3054ff] mb-4 uppercase tracking-wider">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three steps to<br />
              <span className="text-white/40">perfect prompts</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Write your rough prompt', desc: 'Don\'t worry about structure. Just describe what you want — even a sentence works.' },
              { step: '02', title: 'Logos optimizes it', desc: 'AI analyzes intent, injects structure, adds constraints, and scores the result.' },
              { step: '03', title: 'Use it anywhere', desc: 'Copy to clipboard, export as JSON/Markdown, or send directly to any platform.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 p-6 rounded-2xl border border-white/5 bg-white/[0.01]"
              >
                <span className="text-5xl font-bold text-[#3054ff]/20">{item.step}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Models ── */}
      <section id="models" className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-medium text-[#3054ff] mb-4 uppercase tracking-wider">Models</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              Powered by<br />
              <span className="text-white/40">Groq's fastest inference</span>
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
                className="p-5 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: model.color }} />
                <p className="font-semibold text-white">{model.name}</p>
                <p className="text-sm text-white/40">{model.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to optimize?
            </h2>
            <p className="text-white/50 mb-8">
              Start with a rough idea. Leave with a production-grade prompt.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/editor"
                className="group flex items-center gap-3 bg-[#3054ff] text-white pl-6 pr-2 py-2 rounded-full text-lg font-medium hover:bg-[#2040e0] transition-all hover:shadow-[0_0_30px_rgba(48,84,255,0.3)]"
              >
                Get Started Free
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/30">
              No signup required. Free tier includes 30 requests/min.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#3054ff]" />
            <span className="text-sm font-medium">Logos</span>
          </div>
          <p className="text-sm text-white/30">
            Built with Groq AI. Open source.
          </p>
        </div>
      </footer>
    </div>
  );
}
