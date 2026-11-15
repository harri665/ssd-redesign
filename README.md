# Solid State Depot Website Redesign

Harrison Martin, ATLS/CSCI 3150 final project. An accessibility and usability redesign of
[Solid State Depot](https://www.ssdmakerspace.org), Boulder's community makerspace.

This is a student project and not the official SSD site. Pages that aren't rebuilt link to the real site.

The project reports (drafts, heuristic evaluation, cognitive walkthrough, persona) are kept in my notes,
not in this repo.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home, with the same layout as the real SSD home page plus the accessibility fixes |
| `/calendar` | Calendar, with the regular events written out and a way to skip past the Google Calendar |
| `/join` | Join SSD, with dues, the steps to join and an accessible "Plan your first visit" form |

## Stack

- `client/`: React 19, TypeScript, Vite 7 and React Router 7. Styles are in `client/src/styles.css`.
- `server/`: a small Express API in TypeScript (`/api/health`).

## Run locally

```bash
npm install
npm run install:all
npm run dev        # site on http://localhost:5173, API on :3001
```

Check and build the client:

```bash
cd client
npm run typecheck
npm run lint
npm run build
```

## Deploy

`docker compose up -d --build` serves the site on port 47214.
