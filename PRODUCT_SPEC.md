# OPVI Product Specification

OPVI is an AI-native opportunity discovery platform.

## 1. Platform MVP Objective

Given a natural language query, return a ranked list of verified elite opportunities from trusted publishers.

---

## 2. Module Specifications & Status

### Module 00: Project Scaffold
- **Status**: Frozen
- **Objective**: Establish the initial project scaffold and monorepo structure to support incremental subsystem development.
- **Scaffold Architecture**:
  - `apps/web`: Web interface package scaffold.
  - `packages/domain`: Domain types and contracts package scaffold.
  - `packages/core`: Core application engine interfaces package scaffold.
  - `packages/config`: Shared base compiler configurations.
- **Constraints**: Implementation-agnostic foundation. Domain models, schemas, UI features, and engine abstractions remain un-frozen until subsequent modules.

---

## 3. Subsystem Roadmap

Future modules will incrementally define and freeze specifications for:
1. **Module 01**: Product UI & Query Interface
2. **Module 02**: Domain Models & Trusted Publisher Registry
3. **Module 03**: Opportunity Verification Pipeline
4. **Module 04**: Vector Embedding & AI Search Engine
