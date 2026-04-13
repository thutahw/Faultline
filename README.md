# Faultline
Faultline is a real-time issue tracking tool built to explore the full Supabase stack in depth — not just as a client wrapper, but as a Postgres platform. It implements email-based Auth, per-user Row Level Security enforced at the database level, and live dashboard updates via Supabase Realtime subscriptions. The backend schema is managed directly in PostgreSQL with raw SQL queries alongside the Supabase client, deliberately exercising both layers. Built with Next.js and deployed on Vercel.

Stack: Next.js · Supabase (Auth, Realtime, RLS, PostgreSQL) · Vercel
