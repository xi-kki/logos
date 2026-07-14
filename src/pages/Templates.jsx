import { useState } from 'react';
import { Copy, Check, Search, BookOpen } from 'lucide-react';
import { ALL_TEMPLATES, CATEGORIES } from '../data/prompts';
import { copyToClipboard } from '../lib/optimizer';
import Toast from '../components/ui/Toast';

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = ALL_TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (template) => {
    copyToClipboard(template.template);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
    setToast({ message: `Copied "${template.name}" template`, type: 'success', id: Date.now() });
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h2 className="text-2xl font-bold mb-2">Template Library</h2>
        <p className="text-[var(--color-text-dim)]">
          Curated prompts for personas, personalities, research, and domain-specific tasks.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]'
              : 'bg-[var(--color-surface)] text-[var(--color-text-dim)] border border-[var(--color-border)] hover:border-[var(--color-text-dim)]'
          }`}
        >
          All ({ALL_TEMPLATES.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = ALL_TEMPLATES.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-dim)] border border-[var(--color-border)] hover:border-[var(--color-text-dim)]'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 stagger">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all animate-fade-up"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-medium text-[var(--color-text)]">{template.name}</h3>
                <p className="text-xs text-[var(--color-text-dim)] mt-0.5">{template.description}</p>
              </div>
              <button
                onClick={() => handleCopy(template)}
                className="shrink-0 p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
                title="Copy template"
              >
                {copiedId === template.id ? (
                  <Check size={14} className="text-[var(--color-success)]" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-surface-2)] text-[var(--color-text-dim)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-dim)]">
          <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">No templates match your search</p>
          <p className="text-xs text-[var(--color-text-dim)]/50 mt-1">
            Try a different keyword or category
          </p>
        </div>
      )}
    </div>
  );
}
