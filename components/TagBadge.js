import Link from 'next/link';

export default function TagBadge({ tag, clickable = true, size = 'sm' }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const baseClasses = `inline-flex items-center rounded-full font-medium transition ${sizeClasses[size]}`;
  const colorClasses = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
  const hoverClasses = clickable ? 'hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer' : '';

  if (clickable) {
    return (
      <Link
        href={`/explore?tag=${encodeURIComponent(tag)}`}
        className={`${baseClasses} ${colorClasses} ${hoverClasses}`}
      >
        #{tag}
      </Link>
    );
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      #{tag}
    </span>
  );
}
