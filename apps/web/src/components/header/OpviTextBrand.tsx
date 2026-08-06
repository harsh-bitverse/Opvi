'use client';

import React, { useState, useEffect } from 'react';

const TAGLINES = [
  'Discover elite opportunities with natural language.',
  'Curated from verified, trusted global publishers.',
  'AI-native discovery engine for your next big step.',
  'Find hidden opportunities standard search misses.',
];

export function OpviTextBrand() {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-start' }}>
      {/* Dual-Layer Precision-Machined Industrial Nameplate */}
      <div className="opvi-machined-nameplate">
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Base Cut-Through Canvas Layer */}
          <span className="opvi-cnc-text-base">
            OPVI
          </span>
          {/* Architectural Gold Breathing Light Overlay Layer */}
          <span className="opvi-cnc-text-gold" aria-hidden="true">
            OPVI
          </span>
        </div>
      </div>

      {/* Animated Tagline Directly Beneath (0.875rem / 14px) */}
      <div style={{ minHeight: '1.25rem', display: 'flex', alignItems: 'center' }}>
        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            letterSpacing: '-0.005em',
            margin: 0,
          }}
          aria-live="polite"
        >
          <span>{displayText}</span>
          <span className="caret-blink" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}
