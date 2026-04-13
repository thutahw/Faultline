# GEMINI.md

## Project Overview
Faultline is a real-time issue tracking tool built to explore the full Supabase stack in depth. It focuses on using Supabase as a Postgres platform, implementing database-level security and real-time updates.

## Tech Stack
- **Framework:** Next.js
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime, RLS)
- **Deployment:** Vercel

## Core Principles
- **Database-First Security:** Use Row Level Security (RLS) enforced at the database level.
- **Direct PostgreSQL Usage:** Manage schema and queries directly in SQL alongside the Supabase client.
- **Real-time Updates:** Leverage Supabase Realtime for live dashboard updates.
- **Auth:** Email-based authentication.

## Mandated Workflows
- **Schema Changes:** Always provide raw SQL for schema migrations or modifications.
- **Security:** Ensure RLS policies are considered for every new table or data access pattern.
- **Type Safety:** Use TypeScript throughout the Next.js application.
