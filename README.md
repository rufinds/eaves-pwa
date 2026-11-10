<div align="center">
  <img src="assets/icon.png" alt="Eaves logo" width="120" />
  <h1>Eaves PWA</h1>
  <p><strong>What happens in Leuven?</strong> An installable web version of Eaves, the nightlife and event discovery app for Leuven.</p>
</div>

| | |
|---|---|
| **Public link** | https://eaves-pwa.pages.dev |
| **Repository** | https://github.com/rufinds/eaves-pwa |
| **Demo login** | email: `demo.jules@eaves-preview.local` · password: `EavesDemo2026!` |
| **Course** | Mobile Applications — PWA assignment |

> The demo account is a basic user on the *preview* Supabase project.

---

## Table of contents

1. [About the project](#about-the-project)
2. [Screens](#screens)
3. [Tech stack](#tech-stack)
4. [Getting started](#getting-started)
5. [PWA details](#pwa-details)
6. [Database](#database)
7. [Project structure](#project-structure)
8. [Deploying](#deploying)
9. [App idea](#app-idea) — target audience, roadmap, competitors

---

## About the project

Eaves helps students and young people in Leuven find out what is happening tonight and this weekend, and see what their friends are going to. The native iOS/Android app is live in the stores; this repository is a **Progressive Web App** companion built on the course boilerplate (Expo Router + React Native Web, static export).

You can open it in any browser, log in, browse upcoming events, open an event, RSVP, and install it to your home screen. The look and feel (colors, cards, chips, typography) follows the native Eaves app.

## Screens

| Screen | Route | What it shows |
|---|---|---|
| **Home** | `/` | Greeting, a live *database online* badge and these sections: **Tonight** (live events are marked), **For you** (ranked on friends, follows and genres), **Coming Up**, **Friends**, **From following** and **Artists to watch** |
| **Event detail** | `/details/[id]` | Cover, type and genre chips, start and end, location, price, age limit, ticket button, going/interested counts, friends attending, **RSVP** (going / interested) and a **Lineup** tab |
| Login (extra) | `/login` | Email/password login through Supabase Auth |

The personalised sections need an account with friends and follows. The demo account has them, so every section is filled.

## Tech stack

- Expo SDK 52, Expo Router 4 (static web export), React Native Web
- TypeScript in strict mode, no type assertions (`as`) and no `any`
- Zustand for state (`auth`, `items`, `feed`, `event social`, `health`)
- Supabase (hosted PostgreSQL + Auth) through `@supabase/supabase-js`
- Design tokens and styling live in `src/theme` and in the components; screens only compose components

## Getting started

```bash
npm install
cp .env.example .env     # fill in the Supabase URL and anon key
npm run icons            # regenerate PWA icons from assets/icon-source.png (optional)
npm run web              # dev server
npm run typecheck        # tsc --noEmit
npm run build:web        # static export to ./dist
npm run serve:web        # serve ./dist locally
```

The environment variables are public by design (`EXPO_PUBLIC_*`). They are inlined at build time, so set them in your hosting provider before building. Never put a service-role key in this project.

## PWA details

| Requirement | Where |
|---|---|
| Web app manifest (name, standalone display, theme color, icons incl. maskable) | `public/manifest.json` |
| Service worker (cached app shell, offline fallback for pages) | `public/sw.js` |
| Manifest link, theme color, iOS standalone tags, service worker registration | `app/+html.tsx` |
| Icons 192 / 512 / maskable / Apple touch icon | `public/icons/` |
| Single-page routing for event ids on static hosting | `public/_redirects` |

The service worker only registers over HTTPS, so local development is never cached. Cross-origin requests (Supabase API, event images) are never intercepted.

To check it: open the deployed URL in Chrome → DevTools → *Application* → *Manifest* / *Service Workers*, or run a Lighthouse PWA audit. The browser shows an *Install* option once the manifest and service worker are valid.

## Database

The app reads from a hosted Supabase (PostgreSQL) project, the Eaves **preview** database.

- **Is it up?** The home screen runs a minimal `HEAD` query against `events` on load and shows a green *Database online* or red *Database offline* badge (`src/services/healthService.ts`).
- **Security:** access is controlled by Row Level Security. The browser only uses the public anon key. Without an account only public events are readable; with an account RLS also decides which friends, follows and RSVPs are visible, and a user can only create, change or delete their own RSVP.
- **For you ranking:** `src/services/feedService.ts` scores events like the Eaves API does (friends' RSVPs, followed venues and organizers, genre overlap, popularity).
- **Typing without casts:** rows are validated at runtime with small type guards (`src/utils/guards.ts`) and mapped to the `Item` type in `src/services/itemMapper.ts`.

## Project structure

```
app/                      Expo Router routes
  _layout.tsx             root layout, starts the auth listener
  +html.tsx               HTML shell (PWA tags, service worker registration)
  login.tsx               login screen
  (app)/                  authenticated area
    _layout.tsx           auth guard + navigation options
    index.tsx             HomeScreen
    details/[id].tsx      EventDetailScreen
public/                   manifest, service worker, icons, _redirects
src/
  components/             ItemCard, CompactItemCard, TonightCard, EventRow, ArtistCard, ...
    home/                 HomeHeader, TonightSection, ForYouSection, ComingUpSection, FriendsSection, FollowingSection, ArtistsSection
    detail/               EventInfoBlock, EventTabs, SocialProof, RsvpActions, LineupTab, LineupSlotCard
    primitives/           Text, Stack, Row, Card, Screen, Tag, CoverImage, ...
  services/               supabase client, auth, items, feed, social, rsvp, lineup, artists, health
  state/                  zustand stores (auth, items, feed, event social, health)
  theme/                  design tokens + shared spacing styles
  types/                  Item, Social, User
  utils/                  type guards, date / price formatting, tonight / live logic, lineup grouping
```

## Deploying

Any static host works. For Cloudflare Pages or Netlify:

- Build command: `npx expo export -p web`
- Output directory: `dist`
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Use a subdomain (for example `pwa.eaves.be`) so the main website and its app-link files stay untouched.

---

## App idea

### Target audience

- **Primary:** students in Leuven (KU Leuven, UCLL) who go out regularly and mostly find events through Instagram stories, Facebook events and word of mouth.
- **Secondary:** young professionals and locals who want a quick overview of what is on.
- **Supply side:** organizers, venues and artists who want their events found by exactly this audience.

### What are we building? Roadmap

1. **Live today:** iOS and Android app with event discovery, friends' RSVPs, follows, lineups and profiles for attendees, artists, organizers and venue owners.
2. **This assignment:** an installable PWA with login, a personalised home (for you, friends, following, artists), event detail with RSVP, friends attending and lineup, so Eaves works from any browser without installing from a store.
3. **Next for the web version:** search and filters (date, genre, price), following venues and artists, shareable event links with previews.
4. **Later:** push notifications on the web, more cities beyond Leuven, a self-service tool for organizers to publish events.

### Competitors

| Competitor | What it does well | Where Eaves differs |
|---|---|---|
| Facebook Events | Huge reach, organizers already post there | Weak discovery and algorithm, declining student use |
| Instagram | Where events are announced visually | Not built for events: no agenda, no filters, posts disappear |
| UiTinVlaanderen | Official, broad Flemish event database | Not social and not focused on nightlife |
| Dice / Resident Advisor | Strong for ticketed club and concert events | Ticketing focus, little local student scene, no friends layer |

**Differentiator:** a social layer for a single city. You see which of your friends are going, and the content is curated for Leuven nightlife.