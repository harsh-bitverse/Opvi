'use client';

import React, { useState, useRef } from 'react';
import { Header } from '@/components/header/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { StackedSearchDeck } from '@/components/search/StackedSearchDeck';
import { SupportingNote } from '@/components/search/SupportingNote';

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectQuery = (queryText: string) => {
    setSearchValue(queryText);
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
        padding: '2.25rem 3rem',
      }}
    >
      {/* 1. Upper Header Zone: Upper-Left OPVI + Tagline, Upper-Right Sign In */}
      <Header />

      {/* 2. Main Search-First Content Centerpiece */}
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
        {/* Dominant Search Bar Centerpiece */}
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          inputRef={inputRef}
        />

        {/* "TRY SEARCHING..." Stacked Card Deck Carousel */}
        <StackedSearchDeck onSelectQuery={handleSelectQuery} />
      </main>

      {/* 3. Bottom Viewport Zone: Supporting Helper Note */}
      <footer
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '1.5rem',
        }}
      >
        <SupportingNote />
      </footer>
    </div>
  );
}
