# Ecdysis Barbershop Website — Project PRD

## Original Problem Statement
> Attached is a zip file of the ecdysis website from github. Please import it so we can modify it with emergent.

User confirmed: keep original tech stack, import as-is, no integrations or modifications at this stage.

## Source
- Zip: `ecdysis-main.zip` (uploaded by user)
- Underlying template: [`JCodesMore/ai-website-cloner-template`](https://github.com/JCodesMore/ai-website-cloner-template)
- Cloned target: Ecdysis Barbershop — Broken Arrow, OK

## Architecture (as imported)
- **Framework**: Next.js 16.2.1 (App Router, React 19, TypeScript strict, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives) + custom oklch tokens
- **Animations**: framer-motion, embla-carousel, yet-another-react-lightbox
- **API Routes (Next.js, internal)**: `/api/booking/*` — Square Bookings + Web Payments SDK integration
- **Static assets**: 100+ images/videos/fonts under `public/`
- **Pages**: `/`, `/about-us`, `/our-team`, `/services`, `/booking`, `/main-gallery`, `/courtneys-work`, `/rafaels-work`, `/korys-work`, `/corneliuss-work`

## Environment Setup Done
- Replaced default CRA scaffold in `/app/frontend` with the Next.js project
- Relaxed `engines.node` from `>=24` to `>=20` (container runs Node 20.20.2; Next 16 supports 20.9+)
- Updated `start` script to `next dev -H 0.0.0.0 -p 3000` so supervisor's `yarn start` boots the dev server with hot reload
- `yarn install` succeeded; supervisor `frontend` is up and serving on port 3000
- Original `.env` (`REACT_APP_BACKEND_URL`, etc.) preserved
- Backend (FastAPI) and MongoDB still running but unused by this app

## Verified Working
- Homepage `/` renders end-to-end (header, hero, services, team, gallery, testimonials, footer)
- Sub-pages reachable externally (e.g. `/about-us` → 200)
- Hot reload active via Turbopack

## Known Limitations (flagged for future iterations)
1. **`/api/booking/*` routes are NOT reachable via the external preview URL.**
   The Kubernetes ingress redirects every `/api/*` request to the FastAPI backend on port 8001, bypassing Next.js. The booking flow (services list, availability, create) returns 404 externally. Locally on `http://localhost:3000` they work. Fix options for a future session:
   - Re-prefix Next.js routes (e.g. `/booking-api/*`) and update fetch calls
   - Or proxy these routes from the FastAPI backend
2. **Square credentials not configured.** `/api/booking/config` returns empty `application_id` / `location_id`. Booking will not execute real reservations until `SQUARE_APPLICATION_ID`, `SQUARE_DEFAULT_LOCATION_ID`, `SQUARE_ACCESS_TOKEN`, `SQUARE_ENVIRONMENT` are set.
3. Workspace-root warning from Next.js about a stray `/app/yarn.lock` (cosmetic, harmless).

## Backlog
- P1: Resolve `/api/*` ingress conflict so the booking flow works through the public URL
- P1: Wire up Square credentials (sandbox first) end-to-end
- P2: Any content edits, design tweaks, or new sections requested by user
- P2: Optional production build path (`yarn build` + `next start`) once features stabilize

## Implementation Log
- **2026-01 (this session)**: Imported zip, configured supervisor-compatible scripts, installed deps, verified homepage live.
