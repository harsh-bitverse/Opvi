'use client';

import React, { useState, useRef } from 'react';
import { OpviTextLogo } from '@/components/brand/OpviTextLogo';
import { AnimatedTagline } from '@/components/brand/AnimatedTagline';
import { SearchBar } from '@/components/search/SearchBar';
import { TryAskingCards } from '@/components/search/TryAskingCards';
import { SupportingNote } from '@/components/search/SupportingNote';

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectQuery = (query: string) => {
    setSearchValue(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 2.5rem',
      }}
    >
      {/* 1. Upper-Left Brand Header */}
      <header style={{ width: '100%' }}>
        <OpviTextLogo />
      </header>

      {/* 2. Main Search-First Content Section */}
      <main
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
          padding: '2rem 0',
        }}
      >
        {/* Animated Tagline */}
        <AnimatedTagline />

        {/* Dominant Search Bar Centerpiece */}
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          inputRef={inputRef}
        />

        {/* Horizontal Reusable Search Cards */}
        <TryAskingCards onSelectQuery={handleSelectQuery} />
      </main>

      {/* 3. Bottom Viewport Region: Supporting Note */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '1rem',
        }}
      >
        <SupportingNote />
      </footer>
    </div>
  );
}
