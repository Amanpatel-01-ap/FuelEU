# ⚡ FuelEU Compliance Dashboard

A full-stack web application simulating the **FuelEU Maritime compliance system**.

---

# Features
- Manage **routes**, **baseline**, and **comparisons**
- Compute **Compliance Balance (CB)** automatically
- Perform **banking and pooling** of CB surplus/deficit
- **Hexagonal Architecture (Ports & Adapters)** ensures separation of core logic from frameworks

---

# Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React (Vite), TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | Prisma ORM + SQLite |
| Testing | Jest + Supertest |

---

# Commands

## Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
npm run test
`
## frontend
cd frontend
npm install
npm run dev
