'use client';

import React, { useState, useEffect } from 'react';

const SEARCH_QUERIES = [
  'YC-backed AI startup founding engineer roles in San Francisco',
  'Quant internships for undergraduate students',
  'Climate tech grants for student founders',
  'Research internships at Google DeepMind',
  'Robotics startups hiring computer vision engineers',
  'AI safety fellowships in Europe',
];

interface StackedSearchDeckProps {
  onSelectQuery: (query: string) => void;
}

export function StackedSearchDeck({ onSelectQuery }: StackedSearchDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Continuously cycle through deck unless hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SEARCH_QUERIES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const total = SEARCH_QUERIES.length;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '740px',
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
      }}
    >
      {/* Section Title */}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          userSelect: 'none',
        }}
      >
        TRY SEARCHING...
      </span>

      {/* Stacked Card Deck Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          height: '110px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {SEARCH_QUERIES.map((query, index) => {
          // Calculate offset position relative to active front card
          let offset = (index - activeIndex + total) % total;
          
          // Render top 3 visible cards in deck
          if (offset > 2) return null;

          const isFront = offset === 0;

          // Card position offsets for deck stack effect
          const translateX = offset * 18; // Shift right
          const translateY = offset * 6;  // Shift down
          const scale = 1 - offset * 0.05;
          const opacity = isFront ? 1 : 1 - offset * 0.35;
          const zIndex = 3 - offset;

          return (
            <div
              key={index}
              onClick={() => isFront && onSelectQuery(query)}
              onMouseEnter={() => isFront && setIsHovered(true)}
              onMouseLeave={() => isFront && setIsHovered(false)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '1.25rem 1.5rem',
                borderRadius: '16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: isFront
                  ? isHovered
                    ? '0 18px 40px -10px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)'
                    : '0 10px 30px -10px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.02)'
                  : '0 4px 14px -4px rgba(0, 0, 0, 0.04)',
                transform: isFront && isHovered
                  ? `translate(${translateX}px, ${translateY - 4}px) scale(1.02)`
                  : `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                cursor: isFront ? 'pointer' : 'default',
                transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: isFront ? 'var(--text-primary)' : 'var(--text-secondary)',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                &ldquo;{query}&rdquo;
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
