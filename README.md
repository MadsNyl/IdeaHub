# IdeaHub

A CRM for startup ideas with AI-driven tools for sharing and iterating on ideas collaboratively.

## About

IdeaHub is a platform designed to help founders and teams capture, organize, and refine their startup ideas. With integrated AI tools, users can get feedback, iterate on concepts, and collaborate with others in real-time.

## Tech Stack

This project is built on the modern T3 Stack:

- **[Next.js](https://nextjs.org)** — React framework for production
- **[NextAuth.js](https://next-auth.js.org)** — Authentication for Next.js
- **[Prisma](https://prisma.io)** — Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** — Relational database
- **[tRPC](https://trpc.io)** — End-to-end type-safe APIs
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker (for PostgreSQL)

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Create and start the database:
   ```bash
   make db-create
   ```

4. Run Prisma migrations:
   ```bash
   make prisma-migrate
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Commands

### Database Management

- `make db-create` — Create and start PostgreSQL container on port 5450
- `make db-start` — Start the stopped database container
- `make db-stop` — Stop the database container
- `make db-delete` — Stop and remove the database container
- `make db-logs` — View database logs

### Prisma

- `make prisma-migrate` — Run Prisma migrations
- `make prisma-generate` — Generate Prisma Client
- `make prisma-studio` — Open Prisma Studio (visual database browser)

### Development

- `pnpm dev` — Start development server (http://localhost:3000)
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run linter
