# Ascend — MVP Build Plan

## Current State

Standard Expo Router starter with:
- Two tabs: Home and Explore (both placeholder content)
- Reanimated, Gesture Handler, and Safe Area Context already installed
- Portrait orientation locked, new architecture enabled
- No camera, no scoring logic, no app-specific UI

Everything gets rebuilt on top of this foundation.

---

## 3-Layer Architecture

### Layer 1 — Camera UI + Live Metrics Display
The screen the user actually sees and interacts with.

**Responsibilities:**
- Show live camera feed (front-facing)
- Overlay real-time metric readouts (posture score, face symmetry, lighting quality)
- Display a coaching prompt card at the bottom
- Provide a "Start Session" / "End Session" button

**Key files:**
```
app/
  (tabs)/
    camera.tsx        ← main camera screen (replaces "explore" tab)
    results.tsx       ← post-session summary screen
    index.tsx         ← home / dashboard tab

components/
  camera/
    CameraView.tsx    ← wraps expo-camera, handles permissions
    MetricOverlay.tsx ← floating score badges on top of camera
    CoachCard.tsx     ← bottom card showing current coaching tip
```

---

### Layer 2 — Rules-Based Scoring + Coaching Engine
Pure TypeScript logic — no network calls, no AI. Fast and offline.

**Responsibilities:**
- Accept raw inputs (face detection landmarks, device orientation, ambient light estimate)
- Produce a score (0–100) for each metric
- Select the right coaching tip based on the current scores
- Define the tip library as plain data (no CMS needed for MVP)

**Key files:**
```
engine/
  scoring.ts         ← score(landmarks, orientation, light) → MetricScores
  coaching.ts        ← selectTip(scores) → CoachingTip
  tips.ts            ← static array of CoachingTip objects
  types.ts           ← shared TypeScript types (MetricScores, CoachingTip, etc.)
```

**Types (engine/types.ts):**
```ts
export type MetricScores = {
  posture: number;      // 0-100
  symmetry: number;     // 0-100
  lighting: number;     // 0-100
  overall: number;      // weighted average
};

export type CoachingTip = {
  id: string;
  trigger: 'posture' | 'symmetry' | 'lighting' | 'general';
  threshold: number;    // fire this tip when metric is below threshold
  message: string;
  cue: string;          // one-line physical cue, e.g. "Roll shoulders back"
};
```

---

### Layer 3 — AI Analysis + Backend (NOT in MVP)
Placeholder folder only. Do not implement anything here yet.

**Future responsibilities:**
- Send session snapshots to a vision model for deeper feedback
- Persist session history to a backend
- User accounts and progress tracking

**Folder (empty for now):**
```
services/
  ai.ts              ← placeholder
  api.ts             ← placeholder
```

---

## Recommended MVP Scope

Build only what a user can actually experience in one session.

### Screens (3 total)

| Screen | Route | Purpose |
|--------|-------|---------|
| Home | `app/(tabs)/index.tsx` | Single CTA: "Start Session" button |
| Camera | `app/(tabs)/camera.tsx` | Live camera + metric overlay + coach card |
| Results | `app/results.tsx` | Post-session score summary |

### Tabs (2 total)
Replace the current tabs:
- **Home** (house icon) → `index.tsx`
- **Camera** (camera icon) → `camera.tsx`

Remove the "Explore" tab entirely.

---

## What to Build, Step by Step

### Step 1 — Install expo-camera and expo-face-detector
```bash
npx expo install expo-camera expo-face-detector
```
These give you the camera feed and basic face landmark detection (eye, nose, mouth positions).

### Step 2 — Build CameraView component
- Request camera permissions on mount
- Show a full-screen front-facing camera preview
- Pass face detection results up via a prop callback

### Step 3 — Build the scoring engine (Layer 2)
- `scoring.ts`: take face landmarks + device tilt → return `MetricScores`
- Start with just 2 metrics: **posture** (use device accelerometer) and **lighting** (use brightness estimate from the camera)
- Symmetry can be a v2 feature

### Step 4 — Build MetricOverlay
- Three floating badges: Posture, Lighting, Overall
- Color-coded: green (≥70), yellow (40–69), red (<40)

### Step 5 — Build CoachCard + tips library
- Bottom sheet card pinned above the tab bar
- Shows the highest-priority tip based on current scores
- Start with 10 hardcoded tips in `engine/tips.ts`

### Step 6 — Wire up Results screen
- Store final scores in a simple React state object passed via route params
- Show a score card per metric and an overall grade (A/B/C/D)

### Step 7 — Polish Home screen
- Replace the Expo boilerplate with a clean "Start Session" CTA
- Add a tagline: "Your daily glow-up check-in"

---

## Final Folder Structure (MVP)

```
ascend/
├── app/
│   ├── _layout.tsx              ← root layout (keep as-is)
│   ├── results.tsx              ← NEW: post-session results
│   └── (tabs)/
│       ├── _layout.tsx          ← UPDATE: 2 tabs only
│       ├── index.tsx            ← UPDATE: Home with Start CTA
│       └── camera.tsx           ← NEW: main camera screen
│
├── components/
│   ├── camera/
│   │   ├── CameraView.tsx       ← NEW
│   │   ├── MetricOverlay.tsx    ← NEW
│   │   └── CoachCard.tsx        ← NEW
│   ├── ui/                      ← keep existing icon helpers
│   ├── themed-text.tsx          ← keep
│   └── themed-view.tsx          ← keep
│
├── engine/
│   ├── types.ts                 ← NEW
│   ├── scoring.ts               ← NEW
│   ├── coaching.ts              ← NEW
│   └── tips.ts                  ← NEW
│
├── services/                    ← NEW: empty placeholder folder
│   ├── ai.ts
│   └── api.ts
│
├── hooks/                       ← keep existing
├── constants/                   ← keep existing
└── assets/                      ← keep existing
```

---

## Packages to Add

| Package | Why |
|---------|-----|
| `expo-camera` | Live camera feed + face detection |
| `expo-sensors` | Device accelerometer for posture scoring |

Everything else is already installed.

---

## What Stays Out of MVP

- User accounts / auth
- Session history / persistence
- AI vision analysis
- Backend API calls
- Push notifications
- Progress charts / streaks
- Payments / subscriptions

---

## Definition of Done (MVP)

A user can:
1. Open the app and see a clean Home screen
2. Tap "Start Session" and see the live camera with score overlays
3. Receive a real-time coaching tip during the session
4. End the session and see a results summary screen

That is the entire MVP.
