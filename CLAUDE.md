# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IdeaHub is a full-stack TypeScript application using the T3 Stack - a CRM for startup ideas with AI-driven tools. It's a single Next.js 15 application with tRPC API, PostgreSQL database, and Better Auth authentication.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm check            # Lint/format check with Biome
pnpm check:write      # Auto-fix linting issues
pnpm typecheck        # TypeScript type checking

# Database (via Makefile)
make db-create        # Create PostgreSQL Docker container (port 5450)
make db-start         # Start existing container
make db-stop          # Stop container
make prisma-migrate   # Run Prisma migrations
make prisma-generate  # Generate Prisma Client
make prisma-studio    # Open Prisma Studio GUI

# Alternative Prisma commands
pnpm db:generate      # prisma migrate dev
pnpm db:push          # prisma db push
pnpm db:studio        # prisma studio
```

## Architecture

**Tech Stack:**
- Next.js 15 with App Router and React 19 Server Components
- tRPC v11 for type-safe API (HTTP batch streaming, SuperJSON serialization)
- PostgreSQL with Prisma ORM v6 (client generated to `/generated/prisma`)
- Better Auth v1.3 (GitHub OAuth + email/password)
- Tailwind CSS v4 with Biome for linting/formatting

**Key Directories:**
- `src/app/` - Next.js App Router pages and API routes
- `src/server/api/` - tRPC routers and procedures (`root.ts` combines all routers)
- `src/server/better-auth/` - Auth configuration and session helpers
- `src/services/` - Server-side data fetching functions for RSC
- `src/trpc/` - Client-side tRPC setup (`server.ts` for RSC, `react.tsx` for client)
- `src/schemas/` - Zod validation schemas organized by domain
- `prisma/schema.prisma` - Database schema

**Schemas:**
- All Zod schemas are placed in `src/schemas/` directory
- Each domain has its own file matching the resource name (e.g., `user.ts`, `post.ts`, `idea.ts`)
- Schemas define input validation for tRPC procedures
- Export named schemas (e.g., `createUserSchema`, `updatePostSchema`)
- Keep schemas colocated by domain, not by operation type

**Forms:**
- Use `react-hook-form` for all form handling
- Integrate with Zod schemas using `@hookform/resolvers/zod`
- Reuse the same Zod schemas from `src/schemas/` for both client-side validation and tRPC procedures
- Form components should be client components (`"use client"`)
- Example pattern:
  ```tsx
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { ... }
  })
  ```

**Data Tables:**
- Use `@tanstack/react-table` for all table implementations
- Base component at `src/components/data-table.tsx` wraps the table setup
- Each table needs two files:
  - `[name]-table.tsx` - Wrapper component that uses `<DataTable>` with data prop
  - `columns.tsx` - Column definitions using `ColumnDef<Type>[]`
- Column structure:
  ```tsx
  export const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      id: "actions",
      cell: ({ row }) => <ActionsComponent data={row.original} />
    }
  ]
  ```
- Actions component should use tRPC mutations with `router.refresh()` after success
- Table components must be client components (`"use client"`)
- Use custom cell renderers for badges, formatted dates, and complex displays

**Services (Server-Side Data Fetching):**
- Place server-side data fetching functions in `src/services/`
- Each domain has its own file (e.g., `user.ts`, `idea.ts`)
- Use services for read operations (select, count) in React Server Components
- Services are called directly in page components, not via tRPC
- After mutations, use `router.refresh()` to refetch server data
- Example:
  ```tsx
  // src/services/user.ts
  export async function listUsers({ search, page, limit }) {
    return db.user.findMany({ where: { ... }, skip, take: limit });
  }

  // src/app/admin/users/page.tsx
  const data = await listUsers({ search, page });
  return <UsersTable data={data} />;
  ```

**tRPC Structure:**
- Use tRPC for mutations (create, update, delete) and client-side operations
- Each router has its own folder under `src/server/api/routers/`
- Router folder structure:
  ```
  src/server/api/routers/
    user/
      index.ts          # Router definition
      controller/
        create.ts       # Handler for create procedure
        update.ts       # Handler for update procedure
        delete.ts       # Handler for delete procedure
  ```
- Router `index.ts` imports and combines all handlers from the controller folder
- Each controller file exports a single procedure handler
- Input schemas come from `src/schemas/` directory
- All routers are combined in `src/server/api/root.ts`
- Context includes Better Auth session from headers
- Protected procedures use `.protectedProcedure` middleware

**Path Alias:** `~/*` maps to `./src/*`

## Environment Variables

Required in `.env` (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Session encryption key
- `BETTER_AUTH_GITHUB_CLIENT_ID` / `BETTER_AUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth

## Code Conventions

- Biome enforces sorted Tailwind classes in `cn()`, `clsx()`, `cva()` functions
- Use `cn()` from `~/lib/utils` for conditional class merging
- React Server Components by default; add `"use client"` only when needed
- Zod for procedure input validation
- Prisma Client singleton at `src/server/db.ts`

## Design

- The app uses dark mode exclusively - design all UI with dark mode in mind
- Use [shadcn/ui](https://ui.shadcn.com/) components for UI building blocks
- A shadcn MCP server is available - use it to fetch and install components as needed
