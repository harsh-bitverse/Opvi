'use client';

import React, { useState, useEffect } from 'react';

const TAGLINES = [
  'Discover elite opportunities with natural language.',
  'Curated from verified, trusted global publishers.',
  'AI-native discovery engine for your next big step.',
  'Find hidden opportunities standard search misses.',
];

export function AnimatedTagline() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = TAGLINES[taglineIndex];

    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentFullText) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2600);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTaglineIndex((prevIndex) => (prevIndex + 1) % TAGLINES.length);
    } else {
      const speed = isDeleting ? 25 : 45;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentFullText.substring(0, displayText.length - 1)
          : currentFullText.substring(0, displayText.length + 1);
        setDisplayText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, taglineIndex]);

  return (
    <div
      style={{
        minHeight: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
      }}
    >
      <p
        style={{
          fontSize: '0.9375rem',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.005em',
          textAlign: 'center',
        }}
        aria-live="polite"
      >
        <span>{displayText}</span>
        <span className="caret-blink" aria-hidden="true" />
      </p>
    </div>
  );
}
