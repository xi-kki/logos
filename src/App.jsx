import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Sparkles, BookOpen, History, Save, Menu, X, Wand2, Image, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import EditorPage from './pages/Editor';
import TemplatesPage from './pages/Templates';
import HistoryPage from './pages/History';
import SavedPage from './pages/Saved';
import ReverseEngineerPage from './pages/ReverseEngineer';
import PromptToWebsitePage from './pages/PromptToWebsite';
import PlaygroundPage from './pages/Playground';

function Sidebar({ open, onClose }) {
  const links = [
    { to: '/', icon: Sparkles, label: 'Optimizer' },
    { to: '/playground', icon: Play, label: 'Playground' },
    { to: '/reverse', icon: Image, label: 'Reverse Engineer' },
    { to: '/prompt-to-website', icon: Wand2, label: 'Prompt → Website' },
    { to: '/templates', icon: BookOpen, label: 'Templates' },
    { to: '/saved', icon: Save, label: 'Saved' },
    { to: '/history', icon: History, label: 'History' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)]
          z-50 transition-transform duration-200
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <h1 className="text-xl font-bold">
            <span className="text-[var(--color-accent)]">λ</span>
            <span className="ml-1">Logos</span>
          </h1>
          <p className="text-xs text-[var(--color-text-dim)] mt-1">
            Prompt Optimization
          </p>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-dim)] text-center">
            v0.2.0 — Phase 2+3
          </div>
        </div>
      </aside>
    </>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K: Focus search (future)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Future: open search modal
      }
      // Escape: Close sidebar on mobile
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden flex items-center gap-3 p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-text-dim)]"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold">
              <span className="text-[var(--color-accent)]">λ</span> Logos
            </h1>
          </header>

          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/reverse" element={<ReverseEngineerPage />} />
            <Route path="/prompt-to-website" element={<PromptToWebsitePage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
