import React from 'react';
import { OpviTextBrand } from './OpviTextBrand';
import { SignInButton } from './SignInButton';

export function Header() {
  return (
    <header
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <OpviTextBrand />
      <SignInButton />
    </header>
  );
}
