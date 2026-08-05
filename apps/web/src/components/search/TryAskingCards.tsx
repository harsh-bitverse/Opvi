'use client';

import React from 'react';

const CARDS_DATA = [
  {
    title: 'San Francisco AI Founding Engineer',
    query: 'Find YC-backed AI startup founding engineer roles in San Francisco',
  },
  {
    title: 'Quantum Computing Fellowships',
    query: 'Top research fellowships in quantum computing for 2026',
  },
  {
    title: 'Climate Tech Non-Profit Grants',
    query: 'Grant programs for climate tech non-profits under $500k',
  },
  {
    title: 'Tier-1 Associate Product Manager',
    query: 'Direct-entry product management associate programs at Tier-1 tech firms',
  },
];

interface TryAskingCardsProps {
  onSelectQuery: (query: string) => void;
}

export function TryAskingCards({ onSelectQuery }: TryAskingCardsProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '840px',
        marginTop: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
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

      {/* Horizontal row of reusable search cards */}
      <div
        className="no-scrollbar"
        style={{
          width: '100%',
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          padding: '0.5rem 0.25rem 1rem 0.25rem',
          justifyContent: 'center',
        }}
      >
        {CARDS_DATA.map((card, index) => (
          <button
            key={index}
            type="button"
            className="search-card"
            onClick={() => onSelectQuery(card.query)}
            style={{
              flex: '0 0 240px',
              padding: '1.25rem',
              borderRadius: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              &ldquo;{card.query}&rdquo;
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
