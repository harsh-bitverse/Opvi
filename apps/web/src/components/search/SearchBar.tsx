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
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Field interaction coordinates & intensity
  const [fieldPos, setFieldPos] = useState({ x: 50, y: 50, intensity: 0 });

  // Rotate placeholders while idle (not focused, not hovered, and no value)
  useEffect(() => {
    if (isFocused || isHovered || value.length > 0) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isFocused, isHovered, value]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setFieldPos({ x, y, intensity: 1 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly relax back to central equilibrium
    setFieldPos((prev) => ({ ...prev, intensity: 0 }));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setFieldPos((prev) => ({ ...prev, intensity: 1 }));
  };

  // When focused or has value, placeholder disappears immediately
  const activePlaceholder = isFocused || value.length > 0 ? '' : PLACEHOLDERS[placeholderIndex];

  return (
    <div
      ref={containerRef}
      className="search-stadium-glass"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '90vw',
        maxWidth: '912px',
        height: '70px',
        padding: '0 3rem',
        display: 'flex',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      {/* Dynamic Cursor-Responsive Internal Energy Field Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '9999px',
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 130px 65px at ${fieldPos.x}% ${fieldPos.y}%, rgba(245, 212, 142, ${0.28 * fieldPos.intensity}) 0%, rgba(224, 159, 62, ${0.18 * fieldPos.intensity}) 50%, transparent 100%)`,
          opacity: fieldPos.intensity > 0 ? 1 : 0,
          transition: fieldPos.intensity === 0 
            ? 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), background 800ms cubic-bezier(0.16, 1, 0.3, 1)' 
            : 'opacity 250ms ease-out',
          zIndex: 1,
        }}
      />

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
          position: 'relative',
          zIndex: 2,
        }}
        aria-label="Search opportunities in natural language"
      />
    </div>
  );
}
