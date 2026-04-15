# Faultline — Claude Code Instructions

## Project Overview
Faultline is a real-time issue tracking app built with Next.js 16, Supabase, and Tailwind CSS 4. It demonstrates deep Supabase integration: RLS policies, Realtime subscriptions, database functions, and email auth.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack, `proxy.ts` middleware)
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime, RLS)
- **Styling:** Tailwind CSS 4 with `@tailwindcss/postcss`
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## Key Conventions
- **Database-first security:** Every table has RLS policies. Use `SECURITY DEFINER` functions to bypass RLS only when necessary (e.g., `ensure_profile`, `get_project_stats`).
- **Schema changes:** Always provide raw SQL migrations in `supabase/migrations/`.
- **Server actions:** All mutations use Next.js server actions with `'use server'` directive.
- **Realtime:** Issue lists use Supabase Realtime (`postgres_changes`) for live updates.
- **TypeScript:** Strict mode enabled. No `any` types.
- **Styling:** Plain CSS utility classes in `globals.css` (not `@apply` — incompatible with Tailwind CSS 4 `@layer` blocks).
- **Params:** Next.js 16 uses `params: Promise<{ slug: string }>` — always `await` params.

## Project Structure
```
src/
  app/                    # Next.js App Router pages
    dashboard/            # Authenticated dashboard with project list
    projects/[slug]/      # Project detail, issues, labels
    login/                # Email auth (magic link + password)
  components/             # Shared React components
  proxy.ts                # Next.js 16 middleware (auth token refresh)
  __tests__/              # Vitest tests
supabase/
  migrations/             # SQL migrations (0001–0005)
```

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm test` — Run Vitest tests
- `npm run lint` — ESLint
