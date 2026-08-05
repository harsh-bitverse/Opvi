import React from 'react';

export function OpviLogo() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        userSelect: 'none',
      }}
    >
      {/* Sleek Minimalist Spark Emblem */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="10" fill="#0F172A" />
        <path
          d="M18 8L20.8 15.2L28 18L20.8 20.8L18 28L15.2 20.8L8 18L15.2 15.2L18 8Z"
          fill="url(#goldGradient)"
        />
        <defs>
          <linearGradient
            id="goldGradient"
            x1="8"
            y1="8"
            x2="28"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Wordmark */}
      <span
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}
      >
        OPVI
      </span>
    </div>
  );
}
