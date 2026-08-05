# OPVI Product Specification

OPVI is an AI-native opportunity discovery platform.

## 1. Platform MVP Objective

Given a natural language query, return a ranked list of verified elite opportunities from trusted publishers.

---

## 2. Module Specifications & Status

### Module 00: Project Scaffold
- **Status**: Frozen
- **Objective**: Establish the initial project scaffold and monorepo structure to support incremental subsystem development.

### Module 01: Landing Experience & Search Interface
- **Status**: Frozen
- **Objective**: Design and implement the showcase-grade landing experience for OPVI's MVP.
- **Frozen UI Elements**:
  - `OpviLogo`: Brand emblem & wordmark centered at top.
  - `AnimatedTagline`: Typewriter & deleting animated tagline cycling concise product statements.
  - `SearchBar`: Glassmorphic centerpiece input (`backdrop-filter: blur(20px)`), rotating placeholder prompts (paused on hover/focus), warm golden focus border emission (`rgba(217, 119, 6, 0.4)`), zero internal decorative icons.
  - `SupportingNote`: Secondary text explaining instant search without sign-in and personalized benefits.
  - `ExampleSearches`: Interactive rotating natural-language query examples with click-to-populate capability.

---

## 3. Subsystem Roadmap

Future modules will incrementally define and freeze specifications for:
1. **Module 02**: Domain Models & Trusted Publisher Registry
2. **Module 03**: Opportunity Verification Pipeline
3. **Module 04**: Vector Embedding & AI Search Engine

