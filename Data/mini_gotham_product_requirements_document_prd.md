# Mini Gotham – Product Requirements Document (PRD)

## 1. Purpose and intent

The goal of **Mini Gotham** is to build a **feature-complete, behaviourally accurate clone of Palantir Gotham**, using **small, synthetic datasets**. The system is not intended for production deployment at this stage. It exists to:

- Demonstrate how investigators actually work with Gotham-style platforms
- Reproduce all *core functional capabilities* of Gotham
- Support wide data (many entity types, few records)
- Act as a credible technical and conceptual artefact for demos, learning, and future commercialisation

Scale, performance optimisation, and deployment automation are explicitly **out of scope** for this phase.

---

## 2. Target users

### Primary users
- Investigators
- Intelligence analysts
- Fraud / compliance analysts
- Security analysts

### Secondary users
- Technical architects (evaluating feasibility)
- Decision-makers (evaluating capability and trustworthiness)

The system is designed around **human sense‑making under uncertainty**, not automated decision-making.

---

## 3. Core product principles

1. **Everything is an object** (people, phones, events, documents, transactions)
2. **Relationships are first‑class** and explorable
3. **Time and location matter** for every relevant object
4. **Data is explainable and traceable** (provenance over prediction)
5. **Humans stay in the loop** (merges, hypotheses, cases)
6. **Security and auditability are fundamental**, not optional

---

## 4. Scope (what is included)

### Included
- Data ingestion from structured files
- Canonical object model (ontology)
- Entity resolution (merge/split)
- Graph-based link analysis
- Temporal analysis (timelines)
- Geospatial analysis (maps)
- Communications analysis (CDR/messages)
- Financial flow analysis
- Unstructured document handling
- Entity extraction and linking
- Case management
- Persistent queries / alerts
- Fine-grained access control (logical, not infrastructure)
- Audit logging and provenance

### Explicitly excluded
- Production deployment
- High availability
- Horizontal scaling
- Multi-tenant isolation
- Real personal data
- Model training pipelines

---

## 5. Data model requirements

### 5.1 Object types

The system must support at minimum:

- Person
- Organisation
- Location (point and area)
- Event
- Phone number
- Device
- Vehicle
- Account
- Transaction
- Document

Each object must have:
- A stable canonical ID
- Properties defined by ontology
- Optional time validity
- Optional location association
- Source provenance

---

### 5.2 Relationships

The system must support typed relationships such as:

- Person ↔ Person (association)
- Person → Phone / Device / Vehicle (ownership or use)
- Phone ↔ Phone (calls, messages)
- Person → Event (attendance)
- Event → Location
- Account → Account (transactions)
- Document → Entity (mentions)
- Entity → Location (sightings)

Relationships must be:
- Directional
- Time-bound where applicable
- Queryable by type, time, and participants

---

## 6. Functional requirements

### 6.1 Data ingestion

- Ingest structured files (CSV/JSON)
- Validate against ontology
- Preserve raw and processed versions
- Record provenance (source, timestamp, hash)

Acceptance criteria:
- Data loads deterministically
- Invalid data is rejected with explanation

---

### 6.2 Ontology management

- Define object types and properties
- Define relationship types
- Version ontology
- Map datasets to ontology

Acceptance criteria:
- Ontology changes do not silently break data
- Old data remains interpretable

---

### 6.3 Entity resolution

- Detect duplicate entities
- Support deterministic and fuzzy rules
- Allow human‑initiated merge and unmerge
- Record merge history and reasoning

Acceptance criteria:
- Duplicate entities can be merged and reversed
- All merges are auditable

---

### 6.4 Graph analysis

- Visualise entities and relationships
- Expand neighbours interactively
- Compute shortest paths
- Filter graph by time and relationship type

Acceptance criteria:
- Graph expansion is interactive and intuitive
- Results are explainable

---

### 6.5 Temporal analysis

- Display timelines for entities and events
- Filter relationships by date range
- Reveal sequences and overlaps

Acceptance criteria:
- Temporal filtering affects graph and map views consistently

---

### 6.6 Geospatial analysis

- Display entities and events on a map
- Support point, line, and area data
- Enable area‑of‑interest filtering

Acceptance criteria:
- Map reflects temporal filters
- Spatial queries return correct entities

---

### 6.7 Communications analysis

- Support call and message records
- Treat communications as first‑class edges
- Filter by time, participants, and frequency

Acceptance criteria:
- Investigators can identify communication patterns

---

### 6.8 Financial analysis

- Represent accounts and transactions
- Trace money flows across entities
- Link transactions to events and time

Acceptance criteria:
- Transaction paths are explorable and auditable

---

### 6.9 Document handling

- Store unstructured documents
- Extract entities (simulated NLP)
- Link documents to entities

Acceptance criteria:
- Document context enriches graph analysis

---

### 6.10 Search and discovery

- Full‑text search across entities and documents
- Return ranked results

Acceptance criteria:
- Search results link directly to investigation context

---

### 6.11 Case management

- Create investigation cases
- Save entities, views, timelines, maps
- Attach notes and hypotheses

Acceptance criteria:
- Cases are persistent and reproducible

---

### 6.12 Persistent queries and alerts

- Allow saved queries
- Detect new matching data
- Surface alerts for analyst review

Acceptance criteria:
- Alerts are deterministic and traceable

---

### 6.13 Security and access control

- Role‑based access
- Attribute‑based restrictions
- Data markings (e.g. sensitive, restricted)

Acceptance criteria:
- Users cannot access unauthorised data

---

### 6.14 Audit and provenance

- Log all sensitive actions
- Track data origin and transformations
- Provide audit views

Acceptance criteria:
- Any conclusion can be traced back to data and user actions

---

## 7. Non‑functional requirements

- Deterministic behaviour
- Explainability over automation
- Clear separation between storage and reasoning
- Replaceable components
- Human‑centric UX

---

## 8. Success criteria

The project is successful if:

- An investigator can start from a single clue and uncover a network
- Time and location reveal non‑obvious structure
- Entity resolution changes the investigation outcome
- Every insight is traceable and auditable
- The system *feels* like an investigative workspace, not a dashboard

---

## 9. Future considerations (out of scope)

- Scale and performance
- Real‑time streaming
- Advanced ML models
- Multi‑tenant deployment
- Regulatory certification

These are intentionally deferred.

---

## 10. Closing principle

Mini Gotham is not an AI system. It is a **thinking environment**.

If the platform helps a human notice something they would otherwise miss—and can explain why—that is success.

