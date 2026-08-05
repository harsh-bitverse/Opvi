'use client';

import React, { useState, useEffect } from 'react';

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
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate placeholders while idle (not focused, not hovered, and no value)
  useEffect(() => {
    if (isFocused || isHovered || value.length > 0) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isFocused, isHovered, value]);

  // When focused or has value, placeholder disappears immediately
  const activePlaceholder = isFocused || value.length > 0 ? '' : PLACEHOLDERS[placeholderIndex];

  return (
    <div
      className="search-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        maxWidth: '740px',
        height: '60px',
        borderRadius: '16px',
        padding: '0 1.5rem',
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
