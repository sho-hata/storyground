[日本語](./README_ja.md)

# Storyground

A web app to review and organize UI built with [Storybook](https://storybook.js.org) using pinned comments and story-to-story flows.

## Overview

Register a Storybook base URL to a project, sync the story list, and preview each story in an iframe. Create threads at specific coordinates on the screen to leave comments and feedback. Use the React Flow-based **flow editor** to visualize relationships and navigation intent between stories.

## Concept

- **Storybook as the source of truth**: Complement your existing Storybook artifacts with a review layer — no extra deployment needed.
- **Context-aware discussions**: Threads are anchored to relative coordinates on the iframe, keeping feedback in context.
- **From list to diagram**: Synced stories become nodes; edges express UX flow and navigation intent (the Prisma schema also lays groundwork for future hotspot features).

## Usage

1. **Log in**
   Google login in production. Locally, set `AUTH_DEBUG=true` in `.env` to sign in as a debug user without OAuth (a `DEBUG` badge appears in the header).

2. **Create a project**
   Go to "New project" and enter a name and your **Storybook top-level URL** (e.g. `https://.../`). The URL should be publicly accessible or self-hosted.

3. **Sync stories**
   Click **"Sync stories"** on the project page. This fetches `index.json` (Storybook 7+) or `stories.json` (v6) and upserts story rows into the database. Preview URLs are stored in `iframe.html?id=...` format.

4. **Open a story and comment**
   Select a story from the list. Click `+ Add comment` to enter placement mode, then click anywhere on the preview to create a thread. Supports resolved/unresolved toggling and Escape to cancel.

5. **Edit a flow** (optional)
   Create a flow with "+ New flow" on the project page. Place stories as nodes and connect them with edges. Save from the flow editor via the API.

## Requirements & Limitations

- The Storybook **index / stories manifest** must be fetchable from the server (via Next.js API). CORS is handled through the `proxy-storybook` API route rather than direct client-side fetches, but **authentication-protected Storybooks** may not work.
- Previews are rendered in an **iframe**. Embedding may be blocked depending on the Storybook's `X-Frame-Options` or CSP settings.

## Tech Stack

- [Next.js](https://nextjs.org) 14 (App Router) / React 18
- [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/) 7 (`@prisma/adapter-pg`)
- [NextAuth.js](https://next-auth.js.org) v5 (Google) + `@auth/prisma-adapter`
- [React Flow](https://reactflow.dev/) (flow editor)

## Local Development

### 1. Environment variables

Copy `.env.example` to `.env` and set at minimum `DATABASE_URL` and `AUTH_SECRET`. For local testing, `AUTH_DEBUG=true` is recommended.

```bash
cp .env.example .env
```

### 2. Start the database

Start PostgreSQL with Docker Compose.

```bash
docker compose up -d
```

### 3. Run migrations

```bash
pnpm exec prisma migrate deploy
```

### 4. Start the dev server

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The root redirects to `/projects`.

### 5. Try it with storybook-demo

The repository includes a `storybook-demo` you can use as a sample Storybook.

```bash
cd storybook-demo
npm install
npm run storybook
```

Storybook starts at `http://localhost:6006`.

Then create a new project at [http://localhost:3000/projects/new](http://localhost:3000/projects/new) and enter `http://localhost:6006` as the Storybook URL. Click "Sync stories" on the project page to import the story list.

### 6. Google login for production

Remove `AUTH_DEBUG` (or set it to `false`) and configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXTAUTH_URL` with a registered OAuth client.

## Documentation

- [Architecture](docs/architecture.md) — System structure, data model, and key request flows

## References

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Storybook — Publish](https://storybook.js.org/docs/sharing/publish-storybook)
