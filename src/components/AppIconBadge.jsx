import React from 'react';

// Consumer-feel rounded App Icon Badge matching WhatsApp, Instagram, YouTube aesthetics
export const AppIconBadge = ({
  icon: Icon,
  variant = 'brand', // 'whatsapp' | 'youtube' | 'instagram' | 'brand' | 'favorite' | 'purple' | 'amber' | 'emerald'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  onClick,
  title,
  ariaLabel
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8 rounded-xl', icon: 'w-4 h-4' },
    md: { container: 'w-10 h-10 rounded-2xl', icon: 'w-5 h-5' },
    lg: { container: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6' },
    xl: { container: 'w-14 h-14 rounded-3xl', icon: 'w-7 h-7' },
  };

  const variantMap = {
    // WhatsApp style vivid green circle
    whatsapp: 'bg-[#25D366] text-white shadow-md shadow-[#25D366]/30 hover:brightness-110',
    // YouTube style vivid red rounded rect
    youtube: 'bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 hover:brightness-110',
    // Instagram style vibrant sunset gradient
    instagram: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-md shadow-pink-500/30 hover:brightness-110',
    // Royal blue primary brand
    brand: 'bg-brand-900 text-white shadow-md shadow-brand-900/25 hover:bg-brand-800',
    // Warm gold favorite star
    favorite: 'bg-amber-500 text-white shadow-md shadow-amber-500/25 hover:bg-amber-400',
    // Notification violet
    purple: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500',
    // Emerald green buy/safe
    emerald: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-500',
    // Soft slate neutral
    slate: 'bg-slate-800 text-white shadow-md shadow-slate-900/20 hover:bg-slate-700',
  };

  const { container, icon: iconSize } = sizeMap[size] || sizeMap.md;
  const colorClass = variantMap[variant] || variantMap.brand;

  const content = (
    <div
      className={`flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 ${container} ${colorClass} ${className}`}
    >
      <Icon className={`${iconSize} stroke-[2.2]`} />
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-900 rounded-2xl touch-target inline-flex items-center justify-center"
        title={title}
        aria-label={ariaLabel || title}
      >
        {content}
      </button>
    );
  }

  return content;
};
