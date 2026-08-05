'use client';

import React, { useState, useEffect } from 'react';

const EXAMPLES = [
  'Find YC-backed AI startup founding engineer roles in San Francisco',
  'Top research fellowships in quantum computing for 2026',
  'Grant programs for climate tech non-profits under $500k',
  'Direct-entry product management associate programs at Tier-1 tech firms',
];

interface ExampleSearchesProps {
  onSelectExample: (example: string) => void;
}

export function ExampleSearches({ onSelectExample }: ExampleSearchesProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % EXAMPLES.length);
        setIsFading(false);
      }, 300); // 300ms fade transition
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const currentExample = EXAMPLES[exampleIndex];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
        }}
      >
        Try asking
      </span>

      <button
        type="button"
        onClick={() => onSelectExample(currentExample)}
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: '9999px',
          padding: '0.5rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'translateY(4px)' : 'translateY(0)',
          outline: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.borderColor = 'var(--gold-glow-border)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)';
        }}
      >
        &ldquo;{currentExample}&rdquo;
      </button>
    </div>
  );
}
