# 🔍 Mini Gotham

**A feature-complete, behaviorally accurate clone of Palantir Gotham for investigative intelligence analysis**

Mini Gotham is a thinking environment for investigators, enabling complex network analysis across entities, relationships, time, space, communications, and financial flows.

---

## 🎯 Purpose

Mini Gotham demonstrates how investigators work with Gotham-style platforms to:
- Start from a single clue and uncover hidden networks
- Analyze temporal patterns and spatial relationships
- Trace financial flows and communication patterns
- Resolve entity duplicates with human oversight
- Build investigation cases with full audit trails

**This is not an AI system. It's a workspace for human intelligence.**

---

## ✨ Core Features

### 🕸️ Graph Analysis
- Interactive graph visualization with Cytoscape.js
- Multi-hop neighbor expansion
- Shortest path finding
- Relationship type filtering
- Temporal filtering

### ⏰ Temporal Analysis
- Entity timelines
- Event correlation
- Chronological sequence detection
- Date range filtering across all views

### 🗺️ Geospatial Analysis
- Interactive maps with Leaflet/Mapbox
- Entity and event markers
- Movement path tracking
- Area-of-interest queries
- Geohash-based proximity search

### 👥 Entity Resolution
- Duplicate detection (deterministic + fuzzy)
- Human-in-the-loop merge/unmerge
- Full merge history and audit trail
- Side-by-side comparison UI

### 💰 Financial Flow Analysis
- Account and transaction tracking
- Multi-hop money flow tracing
- Transaction timeline correlation
- Pattern detection

### 📞 Communications Analysis
- Call Detail Records (CDR) processing
- Message analysis
- Communication network graphs
- Frequency analysis

### 📄 Document Handling
- Unstructured document storage
- Entity extraction and linking
- Security classification enforcement
- Full-text search

### 📋 Case Management
- Investigation workspaces
- Save entities, graphs, timelines, maps
- Investigator notes and hypotheses
- Case export and sharing

### 🔐 Security & Audit
- Role-based access control (RBAC)
- Data classification (PUBLIC/RESTRICTED/SENSITIVE_PII)
- Comprehensive audit logging
- Full provenance tracking

---

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓ REST API
Backend (FastAPI + Python)
    ↓
Neo4j (Graph) + Supabase (PostgreSQL + Auth + Storage)
```

**Tech Stack:**
- **Backend**: Python 3.10+, FastAPI
- **Frontend**: React 18, TypeScript, Vite
- **Graph DB**: Neo4j Aura (cloud)
- **Relational DB**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Maps**: Leaflet (upgradeable to Mapbox)
- **Graph Viz**: Cytoscape.js

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Neo4j Aura account (free tier)
- Supabase account (free tier)

### Installation

See **[SETUP.md](./SETUP.md)** for detailed setup instructions.

**Quick version:**

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Load Sample Data

```bash
cd backend
python scripts/load_sample_data.py
```

### Access Application

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Default Login**: `analyst@minigotham.local` / `demo123`

---

## 🎮 Demo Scenarios

### 1. Phone Trace Investigation
1. Search for `+252611001001` (PH001)
2. Expand to discover Person P001
3. Continue expanding to reveal network
4. View cafe meeting (E001) on map and timeline
5. Correlate with port arrival and financial transactions

### 2. Entity Resolution
1. Navigate to entity resolution interface
2. Review duplicate suggestion: P002 vs P001
3. Compare side-by-side (same DOB, similar name)
4. Approve merge
5. Verify all queries now return canonical entity (P001)

### 3. Money Flow Analysis
1. Start with account A001
2. Trace flow to A003
3. Observe path: A001 → A005 → A002 → A003
4. Note decreasing amounts ($950 → $900 → $880)
5. Correlate with port shipment event (E002) on timeline

---

## 📊 Sample Dataset

Located in `Data/mini_gotham_sample_dataset/`

**Entities:**
- 8 Persons (including 1 deliberate duplicate)
- 5 Phones
- 3 Devices
- 1 Vehicle
- 5 Locations
- 4 Organisations
- 5 Accounts
- 3 Events
- 3 Documents

**Networks:**
- Phone communications (calls, messages)
- Financial transactions
- Event attendance
- Vehicle sightings
- Document mentions

**Story:** A sophisticated smuggling operation involving coordinated movements, communications, and money flows around a port shipment.

---

## 📁 Project Structure

```
Plantir/
├── backend/              # FastAPI application
│   ├── core/            # Ontology, config
│   ├── services/        # Business logic
│   ├── api/             # API routes
│   ├── models/          # Data models
│   ├── db/              # Database clients
│   └── middleware/      # Auth, logging
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── views/       # Page views
│   │   ├── services/    # API client
│   │   └── store/       # State management
├── Data/                # Sample datasets
└── docs/                # Documentation
```

---

## 🔮 Current Status

**Implementation Progress:**
- ✅ Phase 1: Foundation & Architecture
- ✅ Phase 2: Data Layer (Ontology, Ingestion, Provenance)
- ✅ Phase 3: Backend Services (Graph, Temporal, Geo, Comms, Finance)
- ✅ Phase 4: Advanced Features (Cases, Audit, Alerts)
- ✅ Phase 5: Frontend Core UI (Graph, Map, Timeline, Search)
- ✅ Phase 6: Frontend Investigative Features (Comms/Finance Views, Doc Viewer)
- 🚧 Phase 7: Integration & Polish (Audit Viewer, RBAC, Masking, Animations) - **Active**
- ⏳ Phase 8: Final Verification

See [implementation_plan.md](./brain/implementation_plan.md) for detailed roadmap.

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Installation and configuration
- **[implementation_plan.md](./brain/implementation_plan.md)** - Technical architecture and design
- **[Data/mini_gotham_product_requirements_document_prd.md](./Data/mini_gotham_product_requirements_document_prd.md)** - Product requirements
- **API Docs** - http://localhost:8000/docs (when running)

---

## 🎯 Success Criteria

The project is successful if:
- ✅ An investigator can start from a single clue and uncover a network
- ✅ Time and location reveal non-obvious structure
- ✅ Entity resolution changes the investigation outcome
- ✅ Every insight is traceable and auditable
- ✅ The system *feels* like an investigative workspace, not a dashboard

---

## 🚫 Out of Scope

Intentionally excluded from this phase:
- Production deployment
- Horizontal scaling
- Multi-tenant isolation
- Real personal data
- Advanced ML/AI models
- High availability infrastructure

---

## 🤝 Core Principles

1. **Everything is an object** (people, phones, events, documents, transactions)
2. **Relationships are first-class** and explorable
3. **Time and location matter** for every relevant object
4. **Data is explainable and traceable** (provenance over prediction)
5. **Humans stay in the loop** (merges, hypotheses, cases)
6. **Security and auditability are fundamental**, not optional

---

## 📝 License

This is a demonstration/learning project. Not for production use with real data.

---

## 🙏 Acknowledgments

Inspired by Palantir Gotham - the gold standard in investigative intelligence platforms.

---

**"If the platform helps a human notice something they would otherwise miss—and can explain why—that is success."**
