'use client';

import React, { useState, useRef } from 'react';
import { OpviLogo } from '@/components/brand/OpviLogo';
import { AnimatedTagline } from '@/components/brand/AnimatedTagline';
import { SearchBar } from '@/components/search/SearchBar';
import { SupportingNote } from '@/components/search/SupportingNote';
import { ExampleSearches } from '@/components/search/ExampleSearches';

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectExample = (exampleText: string) => {
    setSearchValue(exampleText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <main
      className="entrance-fade"
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Brand Identity */}
        <OpviLogo />

        {/* Typewriter Animated Tagline */}
        <AnimatedTagline />

        {/* Centerpiece Glassmorphic Search Bar */}
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          inputRef={inputRef}
        />

        {/* Secondary Supporting Note */}
        <SupportingNote />

        {/* Interactive Rotating Example Search Query */}
        <ExampleSearches onSelectExample={handleSelectExample} />
      </div>
    </main>
  );
}
