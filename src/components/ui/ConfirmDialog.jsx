import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 shadow-2xl animate-fade-scale">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-error-dim)]">
            <AlertTriangle size={20} className="text-[var(--color-error)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            {title || 'Are you sure?'}
          </h3>
        </div>
        <p className="text-sm text-[var(--color-text-dim)] mb-6">
          {message || 'This action cannot be undone.'}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-error)] text-white hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
