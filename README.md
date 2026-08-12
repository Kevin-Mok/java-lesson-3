# Java Robotics Lesson 3

This repository solves the gap between Java syntax drills and production-style robot system thinking.
Students now practice safe control flows (state validation before movement, battery-aware behavior,
and composable robot components) instead of passive reading.
Instructors can reuse a lightweight lesson module that deploys quickly, scales across classrooms,
and runs without server-side grading infrastructure.

## Tech Stack and Why Chosen

- **Next.js 14 (App Router)**: Fast static rendering for lesson content plus a lightweight server API for optional Java execution.
- **TypeScript**: Strongly typed lesson content, answer-checking, and UI state for reliability.
- **React + Tailwind CSS**: Rapid interactive lesson experience with accessible, responsive controls.
- **LocalStorage persistence**: Keeps lesson state, attempts, and reveal state client-side for student continuity without backend overhead.
- **Vercel**: Zero-config deployment path with production alias support and GitHub integration.
- **Optional Judge0 API path**: Enables optional server-side Java code execution when environment variables are provided.

## Install and Bootstrap

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to launch the lesson.

## Day-to-Day Usage

- Navigate through timed lesson sections with progress tracking and section completion.
- Work through concept, code, and predict-output prompts.
- Reveal hints and model answers at any time to compare expected reasoning.
- Run the optional Java checker endpoint when enabled (`/api/run-java`).
- Reset lesson progress when reusing the lesson in a classroom or demo flow.

## Core Commands and References

- `npm run dev`
  - Starts local development server.
- `npm run build`
  - Runs production build and type/lint validation.
- `npm run lint`
  - Runs lint checks for the app.
- `npx vercel`
  - Links/inspects deployment tooling.
- `npx vercel --prod`
  - Deploys production build to Vercel.

## Recruiter Proof and Practical Value

- Demonstrates product-minded teaching architecture: structured lesson modules, progress tracking, persistence, and optional runtime code checking.
- Shows practical full-stack alignment in a small surface area: UI state + API-backed optional execution path.
- Shows maintainable React patterns: typed models, reusable question components, and deterministic state transitions.
- Provides evidence of delivery readiness: deploys to Vercel and supports incremental lesson updates through code-only changes.

## Vercel

### Deploy from Git repository

1. Push this repository to GitHub: `java-lesson-3`.
2. In Vercel, click **Add New Project** and import the repository.
3. Keep default Next.js build settings.
4. Optional environment variables for advanced Java execution are below.

### Deploy from CLI

```bash
npx vercel
npx vercel --prod
```

## Optional Java runner

The route `/app/api/run-java/route.ts` supports an optional Judge0-backed execution path.

Optional environment variables:

- `JUDGE0_API_URL`
- `JUDGE0_API_KEY`

If neither is set, the lesson runs without Java execution and still works fully with static concept/code checkers.

## Notes

- Answers, timer, check attempts, hint state, and reveal state are saved in browser `localStorage`.
- No login, database, or analytics are used.
- Timer and lesson progress can be reset independently.
