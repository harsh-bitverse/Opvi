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

  // Physics animation state
  const targetPosRef = useRef({ x: 50, y: 50 });
  const fluidPosRef = useRef({ x: 50, y: 50 });
  const lastTargetPosRef = useRef({ x: 50, y: 50 });
  const velocityRef = useRef({ vx: 0, vy: 0, speed: 0 });
  const isHoveredRef = useRef(false);
  const movementTimerRef = useRef<NodeJS.Timeout | null>(null);

  // React state for rendering fluid gradient
  const [fluidState, setFluidState] = useState({
    x: 50,
    y: 50,
    trailX: 50,
    trailY: 50,
    intensity: 0,
    isMoving: false,
    speed: 0,
    angle: 0,
  });

  // Rotate placeholders while idle (not focused, not hovered, and no value)
  useEffect(() => {
    if (isFocused || isHovered || value.length > 0) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isFocused, isHovered, value]);

  // High-performance animation frame physics loop
  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      const target = targetPosRef.current;
      const current = fluidPosRef.current;
      const lastTarget = lastTargetPosRef.current;

      // 1. Calculate instant cursor velocity
      const vx = target.x - lastTarget.x;
      const vy = target.y - lastTarget.y;
      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);

      // Smoothly update velocity ref with momentum decay
      velocityRef.current.vx = velocityRef.current.vx * 0.75 + vx * 0.25;
      velocityRef.current.vy = velocityRef.current.vy * 0.75 + vy * 0.25;
      velocityRef.current.speed = velocityRef.current.speed * 0.85 + currentSpeed * 0.15;

      lastTargetPosRef.current = { ...target };

      // 2. Fluid position spring inertia lag (~80ms lag)
      const springK = 0.11;
      current.x += (target.x - current.x) * springK;
      current.y += (target.y - current.y) * springK;

      // 3. Trailing filament position (stretches behind moving cursor)
      const stretchFactor = Math.min(2.5, velocityRef.current.speed * 0.8);
      const trailX = current.x - (velocityRef.current.vx * stretchFactor);
      const trailY = current.y - (velocityRef.current.vy * stretchFactor);

      // 4. Target intensity calculation
      const targetIntensity = isHoveredRef.current ? 1 : 0;

      setFluidState((prev) => {
        const nextIntensity = prev.intensity + (targetIntensity - prev.intensity) * 0.08;

        return {
          x: current.x,
          y: current.y,
          trailX,
          trailY,
          intensity: nextIntensity,
          isMoving: velocityRef.current.speed > 0.15,
          speed: velocityRef.current.speed,
          angle,
        };
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    targetPosRef.current = { x, y };

    if (movementTimerRef.current) clearTimeout(movementTimerRef.current);
    movementTimerRef.current = setTimeout(() => {
      // Transition smoothly from MOVING to STATIONARY state when cursor halts
      velocityRef.current.speed = 0;
    }, 150);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    isHoveredRef.current = false;
    if (movementTimerRef.current) clearTimeout(movementTimerRef.current);
  };

  // When focused or has value, placeholder disappears immediately
  const activePlaceholder = isFocused || value.length > 0 ? '' : PLACEHOLDERS[placeholderIndex];

  // Dynamic fluid intensity & scale calculations based on state
  const fluidOpacity = Math.max(0, Math.min(1, fluidState.intensity));
  const stretchX = 1 + Math.min(0.5, fluidState.speed * 0.04);

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
        position: 'relative',
      }}
    >
      {/* 
        Living Energy Field Layer:
        - State 1 (Moving): Trailing fluid filaments stretch behind moving cursor
        - State 2 (Stationary): Fluid settles into calm magnetic pool (100px radius) beneath cursor
      */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '9999px',
          pointerEvents: 'none',
          opacity: fluidOpacity,
          transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* State 1: Moving Fluid Filament Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse ${110 * stretchX}px 65px at ${fluidState.trailX}% ${fluidState.trailY}%, rgba(245, 212, 142, 0.38) 0%, rgba(224, 159, 62, 0.22) 55%, transparent 100%)`,
            transform: `rotate(${fluidState.angle * 0.15}deg)`,
            transition: 'background 80ms ease-out',
          }}
        />

        {/* State 2: Localized Magnetic Pool (100px Radius) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle 100px at ${fluidState.x}% ${fluidState.y}%, rgba(245, 212, 142, 0.3) 0%, rgba(217, 119, 6, 0.15) 60%, transparent 100%)`,
          }}
        />
      </div>

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
