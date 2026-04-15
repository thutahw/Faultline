# Faultline

A real-time issue tracking application built with **Next.js 16**, **Supabase**, and **Tailwind CSS 4**.

## Features

- **Real-time updates** — Issues sync instantly across tabs via Supabase Realtime
- **Row Level Security** — All data access enforced at the database level
- **Labels & filtering** — Color-coded labels with client-side filtering by status, priority, and label
- **Issue assignment** — Assign team members, edit issues inline
- **Dashboard analytics** — Project stats with visual status distribution bars
- **Email authentication** — Magic link and password-based sign-in via Supabase Auth

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL + Realtime + Auth) |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/thutahw/Faultline.git
   cd Faultline
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Apply database migrations — run the SQL files in `supabase/migrations/` against your Supabase project (via the SQL Editor in the Dashboard or the Supabase CLI).

5. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Lint with ESLint |

## License

MIT
