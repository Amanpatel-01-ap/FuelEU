
---

##  REFLECTION.md**


# REFLECTION.md

##  What I Built
I developed a full-stack application — **FuelEU Compliance Dashboard** — to simulate maritime emission compliance management.  
The app allows users to manage routes, calculate CB (Compliance Balance), and handle banking and pooling according to EU emission rules.

---

## Technical Summary
- **Backend:** Node.js + TypeScript + Prisma ORM (SQLite)
- **Frontend:** React + TailwindCSS
- **Testing:** Jest & Supertest
- Implemented **Hexagonal Architecture** (Ports & Adapters) for clean separation of concerns.

---

## What I Learned
- Designing modular architecture that separates domain logic from frameworks.
- Handling database seeding and migrations with Prisma.
- Implementing realistic compliance formulas and pooling logic.
- Writing integration tests to validate backend APIs.
- Structuring commits incrementally for evaluation.

---

## Challenges Faced
- Prisma setup and migration conflicts.
- Debugging seeding and CB calculation formulas.
- Maintaining consistent frontend-backend communication via ports & adapters.

---

## Results
- Fully working backend (tested).
- Frontend connected dynamically.
- APIs validated via Jest tests.
- Clean incremental Git history.

---

## Next Improvements
- Add authentication and role-based access.
- Migrate SQLite to PostgreSQL.
- Add export and visualization features for compliance analytics.
