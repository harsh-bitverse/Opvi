export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '2.5rem',
          maxWidth: '560px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: 'var(--accent-light)',
          }}
        >
          OPVI Platform
        </h1>
        <p style={{ color: '#a0aec0', lineHeight: 1.6 }}>
          Module 00: Project Scaffold Initialized.
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096' }}>
          Status: Monorepo workspace active & verified.
        </p>
      </div>
    </main>
  );
}
