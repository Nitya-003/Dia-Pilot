interface BadgeProps {
  children: React.ReactNode;
  variant?: 'stable' | 'warning' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({ children, variant = 'neutral', size = 'md' }: BadgeProps) {
  const variants = {
    stable: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
