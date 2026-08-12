# Java Robotics Lesson 3

This repository hosts a production-ready Next.js lesson site for a 2-hour Java robotics lesson on building safer Robot systems with composition, status-returning methods, constructor defaults, arrays, constants, and autonomous loops.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production verification

```bash
npm run build
```

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
