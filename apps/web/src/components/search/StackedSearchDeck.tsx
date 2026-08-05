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
        maxWidth: '840px',
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Compact Stacked Card Deck Container (Section title removed per specification) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {SEARCH_QUERIES.map((query, index) => {
          let offset = (index - activeIndex + total) % total;
          if (offset > 2) return null;

          const isFront = offset === 0;

          const translateX = offset * 16;
          const translateY = offset * 5;
          const scale = 1 - offset * 0.04;
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
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: isFront
                  ? isHovered
                    ? '0 14px 32px -8px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.03)'
                    : '0 8px 24px -8px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02)'
                  : '0 4px 12px -4px rgba(0, 0, 0, 0.04)',
                transform: isFront && isHovered
                  ? `translate(${translateX}px, ${translateY - 3}px) scale(1.015)`
                  : `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                cursor: isFront ? 'pointer' : 'default',
                transition: 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.8125rem',
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
