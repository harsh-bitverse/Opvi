# OPVI (Opportunity Vision & Discovery Platform)

OPVI is an AI-native opportunity discovery platform. Given a natural language query, OPVI returns a ranked list of verified elite opportunities from trusted publishers.

## Project Structure

This repository is organized as a monorepo containing modular packages and applications:

```
Opvi/
├── apps/
│   └── web/            # Web interface application (Next.js)
├── packages/
│   ├── domain/         # Pure domain contracts and schemas
│   ├── core/           # Core engine interfaces and abstractions
│   └── config/         # Shared TypeScript configurations
├── PRODUCT_SPEC.md     # Incremental product specification
├── README.md           # Project documentation
└── package.json        # Workspace configuration
```

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm

### Installation
```bash
npm install
```

### Development
To run the web development server:
```bash
npm run dev
```

### Build & Typecheck
To compile and typecheck all packages and applications across the workspace:
```bash
npm run build
npm run typecheck
```

## Specification & Roadmap
See [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) for current module statuses and system objectives.
