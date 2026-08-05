'use client';

import React, { useState, useEffect, useRef } from 'react';

const PLACEHOLDERS = [
  'What opportunity are you looking for?',
  'Ask about any opportunity...',
  'Search opportunities in natural language...',
  'Looking for your next opportunity?',
  "Find opportunities you didn't know existed.",
  'Search across elite opportunities.',
];

interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotate placeholders while idle (not hovered or focused)
  useEffect(() => {
    if (isPaused || value.length > 0) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused, value]);

  const activePlaceholder = value ? '' : PLACEHOLDERS[placeholderIndex];

  return (
    <div
      className="search-glass-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        // Resume rotation if input is not focused
        if (document.activeElement !== inputRef.current) {
          setIsPaused(false);
        }
      }}
      style={{
        width: '100%',
        maxWidth: '720px',
        height: '64px',
        borderRadius: '20px',
        padding: '0 1.75rem',
        display: 'flex',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        placeholder={activePlaceholder}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '1.125rem',
          fontWeight: 400,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
        aria-label="Search opportunities in natural language"
      />
    </div>
  );
}
