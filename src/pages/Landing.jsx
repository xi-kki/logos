import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Code, Image, Mic, Video, 
  Zap, Brain, Wand2, ChevronDown, ArrowUpRight,
  Copy, Check, FileText, Globe
} from 'lucide-react';
import AuthButton from '../components/AuthButton';

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
    v.volume = 0;
    const FADE_DURATION = 250;
    const FADE_OUT_TRIGGER = 0.55;

    const handleCanPlay = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      targetOpacity.current = 0.5;
      startTimeRef.current = performance.now();
      v.play().catch(() => {});
      rafRef.current = requestAnimationFrame(fadeLoop);
    };
    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return;
      const remaining = v.duration - v.currentTime;
      if (remaining <= FADE_OUT_TRIGGER && remaining > 0) {
        fadingOutRef.current = true;
        targetOpacity.current = 0;
        startTimeRef.current = performance.now();
      }
    };
    const handleEnded = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      opacityRef.current = 0;
      v.style.opacity = 0;
      setTimeout(() => {
        fadingOutRef.current = false;
        v.currentTime = 0;
        v.play().catch(() => {});
        requestAnimationFrame(() => {
          targetOpacity.current = 0.5;
          startTimeRef.current = performance.now();
          rafRef.current = requestAnimationFrame(fadeLoop);
        });
      }, 100);
    };
    const fadeLoop = (timestamp) => {
      const current = opacityRef.current;
      const target = targetOpacity.current;
      if (startTimeRef.current !== null && Math.abs(target - current) > 0.001) {
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        opacityRef.current = current + (target - current) * eased;
        v.style.opacity = opacityRef.current;
      }
      rafRef.current = requestAnimationFrame(fadeLoop);
    };
    v.addEventListener('canplay', handleCanPlay);
    v.addEventListener('timeupdate', handleTimeUpdate);
    v.addEventListener('ended', handleEnded);
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
      muted loop playsInline autoPlay
      className="absolute object-cover object-top"
      style={{ width: '115%', height: '115%', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0 }}
    />
  );
}

// ─── Feature Card ──────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="group relative rounded-2xl border border-black/5 bg-white p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div 
        className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ background: `${color}15` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-sm text-black/50 leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────
function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-black" style={{ fontFamily: "'Fustat', sans-serif" }}>{number}</p>
      <p className="text-sm text-black/50 mt-1">{label}</p>
    </div>
  );
}

// ─── Main Landing ──────────────────────────────────────
export default function Landing() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g logos');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8f8f8' }}>
      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between backdrop-blur-xl border-b border-black/5"
        style={{ padding: '16px 120px', background: 'rgba(248,248,248,0.8)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, letterSpacing: '-1.44px', color: '#000000' }}>
            Logos
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontSize: '16px', fontWeight: 500, letterSpacing: '-0.2px' }}>
          <a href="#features" className="flex items-center gap-1 transition-colors" style={{ color: '#505050' }}>
            Features <ChevronDown size={14} />
          </a>
          <a href="#how" className="transition-colors" style={{ color: '#505050' }}>How It Works</a>
          <Link to="/editor" className="transition-colors" style={{ color: '#505050' }}>Editor</Link>
          <Link to="/playground" className="transition-colors" style={{ color: '#505050' }}>Playground</Link>
          <Link to="/reverse" className="transition-colors" style={{ color: '#505050' }}>Reverse</Link>
        </div>

        <div className="flex items-center gap-4">
          <AuthButton />
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
          <div
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] mx-auto"
            style={{ background: '#0e1311' }}
          >
            <Zap size={14} color="#5ae14c" />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: '#ffffff' }}>
              Powered by Groq — inference in &lt;100ms
            </span>
          </div>

          {/* Pre-headline */}
          <p
            style={{ fontFamily: "'Instrument Serif', serif", fontSize: '48px', color: '#000000' }}
          >
            Your prompts are holding you back.
          </p>

          {/* Headline */}
          <h1
            style={{ fontFamily: "'Fustat', sans-serif", fontSize: '80px', fontWeight: 700, letterSpacing: '-4.8px', lineHeight: 'none', color: '#000000' }}
          >
            Turn Weak Prompts Into<br />Production-Grade Output
          </h1>

          {/* Subtitle */}
          <p
            style={{ fontFamily: "'Fustat', sans-serif", fontSize: '20px', fontWeight: 500, letterSpacing: '-0.4px', color: '#505050', maxWidth: '736px', width: '600px', margin: '0 auto' }}
          >
            Logos analyzes your intent, injects structure, adds constraints, and scores the result. 
            One click from "meh" to "damn, that works."
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full text-lg font-medium transition-all hover:shadow-lg"
              style={{ background: '#000000', color: '#ffffff' }}
            >
              Optimize Your First Prompt
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <ArrowRight size={18} />
              </span>
            </Link>
            <a
              href="#how"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium border border-black/10 hover:bg-black/5 transition-all"
              style={{ color: '#505050' }}
            >
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white" />
                ))}
              </div>
              <span className="text-sm text-black/50">2,400+ prompts optimized</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#000" stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="text-sm text-black/50 ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="relative py-24 px-6 border-t border-black/5" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>See the Difference</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#000000' }}>
              Before vs. After Logos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="rounded-2xl border border-red-200 bg-white p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-sm font-medium text-red-600">Before — Your Prompt</span>
              </div>
              <div className="bg-red-50 rounded-xl p-6 font-mono text-sm text-red-900/70 leading-relaxed">
                "write me a blog post about ai"
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-red-500">
                <span>Score: 12/100</span>
                <span>•</span>
                <span>Vague, no structure, no audience</span>
              </div>
            </div>

            {/* After */}
            <div className="rounded-2xl border border-green-200 bg-white p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-sm font-medium text-green-600">After — Logos Optimized</span>
              </div>
              <div className="bg-green-50 rounded-xl p-6 font-mono text-sm text-green-900/70 leading-relaxed">
                "Write a 1,200-word blog post for mid-level developers explaining how AI code assistants (Copilot, Cursor) improve productivity. Include: 3 real-world case studies, comparison table, and a practical 'getting started' section. Tone: authoritative but approachable."
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-green-600">
                <span>Score: 94/100</span>
                <span>•</span>
                <span>Specific, structured, actionable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: '#000000' }}>
              Six tools. One mission.<br />
              <span style={{ color: '#505050' }}>Better prompts, better output.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Sparkles}
              title="Prompt Optimizer"
              desc="Paste a rough prompt. Get a production-grade version with structure, constraints, and a quality score. 5 modalities: text, code, image, video, audio."
              color="#8b5cf6"
            />
            <FeatureCard
              icon={Globe}
              title="Reverse Engineer"
              desc="See a website you love? Paste the URL. Logos extracts the design patterns and generates a prompt to recreate it."
              color="#3b82f6"
            />
            <FeatureCard
              icon={Image}
              title="Image → Prompt"
              desc="Upload a screenshot, get a detailed recreation prompt. Powered by Groq Vision. Works for UI, illustrations, anything visual."
              color="#ec4899"
            />
            <FeatureCard
              icon={Mic}
              title="Audio → Prompt"
              desc="Upload audio, get a transcription plus style analysis. Extract tone, structure, and speaking patterns."
              color="#f59e0b"
            />
            <FeatureCard
              icon={Code}
              title="Prompt → Website"
              desc="Describe what you want. Get production-ready HTML, React, or Next.js code. Live preview. Download as .html."
              color="#10b981"
            />
            <FeatureCard
              icon={Play}
              title="Playground"
              desc="Test prompts across Llama 3.3, Mixtral, and more. Real-time token counter, cost estimator, variable injection."
              color="#ef4444"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="relative py-32 px-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#000000' }}>
              Three steps to<br />
              <span style={{ color: '#505050' }}>prompts that actually work</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { 
                step: '01', 
                title: 'Write your rough idea', 
                desc: "Don't overthink it. One sentence is fine. 'Write a landing page for a SaaS app' works. 'Make it good' doesn't.",
                icon: FileText
              },
              { 
                step: '02', 
                title: 'Logos transforms it', 
                desc: 'AI analyzes your intent, adds structure, injects constraints, and scores the result. You see exactly what changed and why.',
                icon: Zap
              },
              { 
                step: '03', 
                title: 'Use it anywhere', 
                desc: 'Copy to clipboard. Export as JSON or Markdown. Send it to ChatGPT, Claude, Midjourney, or any platform. The prompt works everywhere.',
                icon: Copy
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="flex items-start gap-6 p-6 rounded-2xl border border-black/5 bg-white hover:shadow-md transition-all"
              >
                <span className="text-5xl font-bold" style={{ color: 'rgba(0,0,0,0.08)', fontFamily: "'Fustat', sans-serif" }}>{item.step}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>{item.title}</h3>
                  <p style={{ color: '#505050' }}>{item.desc}</p>
                </div>
                <item.icon size={24} className="text-black/20 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 px-6 border-t border-black/5" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="2,400+" label="Prompts Optimized" />
            <StatCard number="<100ms" label="Inference Speed" />
            <StatCard number="5" label="Modalities" />
            <StatCard number="4" label="Groq Models" />
          </div>
        </div>
      </section>

      {/* ── Models ── */}
      <section className="relative py-32 px-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <p className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: '#505050' }}>Models</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12" style={{ color: '#000000' }}>
              Powered by<br />
              <span style={{ color: '#505050' }}>Groq's fastest inference</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Llama 3.3', desc: '70B Versatile', color: '#3054ff', badge: 'Best Quality' },
              { name: 'Llama 3.1', desc: '8B Instant', color: '#22c55e', badge: 'Fastest' },
              { name: 'Mixtral', desc: '8x7B', color: '#f59e0b', badge: 'Best for Code' },
              { name: 'Whisper', desc: 'Large V3', color: '#ec4899', badge: 'Audio' },
            ].map((model) => (
              <div
                key={model.name}
                className="p-5 rounded-xl border border-black/5 bg-white hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${model.color}15`, color: model.color }}>
                    {model.badge}
                  </span>
                </div>
                <p className="font-semibold" style={{ color: '#000000' }}>{model.name}</p>
                <p className="text-sm" style={{ color: '#505050' }}>{model.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-32 px-6 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{ color: '#000000' }}>
              Stop writing bad prompts.<br />Start getting good output.
            </h2>
            <p className="mb-8 text-lg" style={{ color: '#505050' }}>
              Free tier. No signup. 30 requests/min on Groq's free API.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/editor"
                className="group flex items-center gap-3 pl-6 pr-2 py-2 rounded-full text-lg font-medium transition-all hover:shadow-lg"
                style={{ background: '#000000', color: '#ffffff' }}
              >
                Optimize Your First Prompt
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>

            <p className="mt-6 text-sm" style={{ color: '#505050' }}>
              Or try the <Link to="/playground" className="underline hover:text-black">Playground</Link> to test across models.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-sm font-medium" style={{ color: '#000000' }}>Logos</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: '#505050' }}>
            <Link to="/editor" className="hover:text-black transition-colors">Optimizer</Link>
            <Link to="/playground" className="hover:text-black transition-colors">Playground</Link>
            <Link to="/reverse" className="hover:text-black transition-colors">Reverse</Link>
            <Link to="/prompt-to-website" className="hover:text-black transition-colors">Prompt → Website</Link>
          </div>
          <p className="text-sm" style={{ color: '#505050' }}>
            Built with Groq AI. Open source.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Missing import - Play is used in FeatureCard
function Play(props) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}
