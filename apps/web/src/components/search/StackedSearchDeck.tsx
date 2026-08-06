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

  // Continuously cycle through deck
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SEARCH_QUERIES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const total = SEARCH_QUERIES.length;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '912px',
        marginTop: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Rigid dimension-locked Stacked Card Deck Container (304px x 58px) */}
      <div
        style={{
          position: 'relative',
          width: '304px',
          height: '58px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {SEARCH_QUERIES.map((query, index) => {
          let offset = (index - activeIndex + total) % total;
          if (offset > 2) return null;

          const isFront = offset === 0;

          const translateX = offset * 12;
          const translateY = offset * 3.5;
          const scale = 1 - offset * 0.04;
          const opacity = isFront ? 1 : 1 - offset * 0.35;
          const zIndex = 3 - offset;

          return (
            <div
              key={index}
              className="search-card"
              onClick={() => isFront && onSelectQuery(query)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '304px',
                height: '58px',
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                cursor: isFront ? 'pointer' : 'default',
                transition: 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 450ms cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <p
                style={{
                  fontSize: '0.84375rem',
                  fontWeight: 500,
                  color: isFront ? 'var(--text-primary)' : 'var(--text-secondary)',
                  lineHeight: 1.3,
                  margin: 0,
                  textAlign: 'center',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  width: '100%',
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
