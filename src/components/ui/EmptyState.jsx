import { clsx } from 'clsx';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      {Icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-surface-2)] mb-4">
          <Icon size={24} className="text-[var(--color-text-dim)] opacity-40" />
        </div>
      )}
      <p className="text-sm text-[var(--color-text-dim)] mb-1">{title}</p>
      {description && (
        <p className="text-xs text-[var(--color-text-dim)]/60 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
