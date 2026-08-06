'use client';

import React from 'react';

export function SignInButton() {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{
        fontSize: '1.125rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        textDecoration: 'none',
        padding: '0.5rem 0.875rem',
        borderRadius: '8px',
        transition: 'opacity 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      Sign in
    </a>
  );
}
