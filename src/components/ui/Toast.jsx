import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';
import { clsx } from 'clsx';

const ICONS = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'border-[var(--color-success)] bg-[var(--color-success-dim)]',
  error: 'border-[var(--color-error)] bg-[var(--color-error-dim)]',
  info: 'border-[var(--color-info)] bg-[var(--color-info-dim)]',
};

const TEXT_STYLES = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-error)]',
  info: 'text-[var(--color-info)]',
};

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);
  const Icon = ICONS[type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={clsx(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300',
        STYLES[type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      )}
    >
      <Icon size={16} className={TEXT_STYLES[type]} />
      <span className="text-sm text-[var(--color-text)]">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        className="ml-2 p-0.5 rounded hover:bg-white/10 text-[var(--color-text-dim)]"
      >
        <X size={12} />
      </button>
    </div>
  );
}
