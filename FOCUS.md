# Focus Plan

A priority filter over `README.md`. **It removes nothing** — every folder in the README stays valid.
This file only answers: *given limited time, what gets the most attention?*

The README's own **Recommended Progression** section is a linear, zero-knowledge order
(JavaScript start to finish, then TypeScript start to finish, and so on).
This file replaces that **order** with one based on where the gaps actually are.

---

## 1. Starting position

| Track | Status | What practice means here |
|---|---|---|
| JavaScript | Years of real use | **Recall drills.** You can write it; you need to *explain* it and predict output under pressure. |
| React | Years of real use | **Recall drills.** Same — the gap is vocabulary and reasoning, not ability. |
| TypeScript | Limited | **Learning.** Write real code, from scratch, repeatedly. |
| Next.js | Limited | **Learning.** Build the mental model first, then the API surface. |

The single biggest mistake available here is spending known-material time on JavaScript arrays
and React props because they are early in the README, and arriving at TypeScript and Next.js tired.

---

## 2. Effort split

Percentages, not hours — so this holds whatever your total time turns out to be.

```
TypeScript   ██████████████████████████████  30%
Next.js      ██████████████████████████████  30%
JavaScript   █████████████████████████       25%
React        ███████████████                 15%
```

JavaScript still gets a quarter despite your experience, because the JS questions that trip up
experienced developers — event loop ordering, `this`, closures over loops, prototype lookup —
are the exact ones this repo files under `10-advanced-javascript` and `12-tricky-output-questions`.
Experience does not automatically produce the *words* for those under interview pressure.

React gets the least because it is your strongest track and the interview surface is narrow:
hooks, rendering behaviour, memoization.

---

## 3. Tiers per track

**Tier 1** — do properly, from memory, until fluent.
**Tier 2** — do if time allows, or once each rather than to fluency.
**Tier 3** — skim, or skip. Not because it is unimportant, but because you already have it.

### JavaScript — 25%

**Tier 1**
- `10-advanced-javascript` — this, call/apply/bind, closures, prototypes, event loop, microtask vs macrotask, debounce, throttle, currying. **The single highest-value folder in the entire JS track for you.**
- `12-tricky-output-questions` — pure recall drilling. Cheap per question, and this is what screening rounds are made of.
- `09-async-javascript` — Promise combinators, sequential vs parallel, implementing `Promise.all` and `retry` from scratch.
- `05-functions` — the closure/HOF/compose/memoize/curry half specifically.

**Tier 2**
- `07-modern-javascript` — skip the syntax you use daily; do Map, Set, WeakMap, iterators, generators, Symbol.
- `06-oop` — prototypes and `super`/overriding matter more than writing another BankAccount class.
- `08-error-handling` — custom Error classes and async error propagation only.
- Algorithms: `11-algorithms-hash-maps`, `11-algorithms-two-pointers`, `11-algorithms-sliding-window`, `11-algorithms-stack`, `11-algorithms-recursion`. These five cover the overwhelming majority of what gets asked.
- `12-javascript-interview-medium`.

**Tier 3 — skim only**
- `01-basics`, `02-arrays`, `03-strings`, `04-objects` — use as 10-minute speed warmups, not study sessions.
- `11-algorithms-arrays`, `11-algorithms-strings` — heavy overlap with the five algorithm folders above.
- `11-algorithms-queue`, `11-algorithms-sorting-searching` — know binary search and the complexity table; do not hand-write merge sort unless you are targeting DSA-heavy companies.
- `12-javascript-interview-easy`.

### TypeScript — 30%

Weak track, so most of it is Tier 1. Priority *within* Tier 1 is top to bottom.

**Tier 1**
- `08-generics` — the most-asked TS interview topic, without exception.
- `07-unions-intersections` — discriminated unions and exhaustive `never` checks. Comes up constantly in real code review questions.
- `10-utility-types` — Partial, Pick, Omit, Record, ReturnType, Awaited. Expect to be asked to *implement* one.
- `09-narrowing` — type guards and custom predicates.
- `02-types` and `05-interfaces` — the base you need before the four above make sense.
- `14-typescript-interview` — do this last, as assessment.
- `13-async-types` — directly feeds the Next.js work.

**Tier 2**
- `01-basics` — `any` vs `unknown` vs `never` is the one part worth real attention.
- `03-functions`, `04-objects`, `06-type-aliases` — mostly absorbed while doing Tier 1.
- `12-classes-oop`.
- `11-advanced-types` — conditional types, mapped types, `infer`. Understand them well enough to read and explain; do not grind them. They appear in senior interviews, rarely in mid.

**Tier 3**
- Nothing. TypeScript is a gap; do not thin it further.

### React — 15%

**Tier 1**
- `10-useEffect` — including *when not to use it*. Unnecessary effects and derived-state-in-effect are a favourite interview trap.
- `18-performance` + `12-useMemo` + `13-useCallback` — treat as one unit. The question is always "when does this actually help", not the syntax.
- `15-custom-hooks` — high hit rate, and easy to demonstrate depth.
- `20-react-interview` — assessment.

**Tier 2**
- `14-context` — especially the performance caveats.
- `17-state-management` — the reducer pattern and the server-state vs client-state distinction.
- `19-react-patterns` — compound components, controlled vs uncontrolled.
- `11-useRef`, `16-api-fetching`.

**Tier 3 — skim only**
- `01-jsx`, `02-components`, `03-props`, `04-state`, `05-events`, `06-conditional-rendering`, `07-lists-keys`, `08-forms`, `09-useState`. You have shipped all of this. Read the concept lists to confirm nothing is unfamiliar, then move on. One exception: be able to explain **why keys matter and what breaks with index keys** — that gets asked at every level.

### Next.js — 30%

Weak track and the one where the mental model matters more than the API.
Do the model first; the API surface is small once the model is right.

**Tier 1 — in this order**
1. `03-server-components` + `04-client-components` — the server/client boundary is *the* Next.js interview topic. What runs where, what can cross the boundary, why.
2. `13-rendering` — static vs dynamic vs streaming.
3. `12-caching` — request/data/route caching, revalidation, invalidation after mutation. The most commonly misunderstood part of the framework, and interviewers know it.
4. `06-data-fetching`.
5. `09-server-actions` — mutations plus revalidation.
6. `01-routing`, `02-layouts`, `05-dynamic-routes` — quick wins, largely mechanical. Get them done early for momentum.
7. `15-typescript-nextjs` — kills two birds, since TypeScript is also a gap.
8. `16-nextjs-interview` — assessment.

**Tier 2**
- `07-loading-error`, `08-api-route-handlers`, `10-authentication`, `11-middleware`.

**Tier 3**
- `14-performance` — concepts only (Image, font optimization, reducing client bundle). Understand the levers, do not build the exercises.

---

## 4. Order of work

Three tracks run **in parallel**, not one after another. Every folder named below exists on disk.
Work each track top to bottom. Do not skip ahead in Track B — the order is dependency-driven.

### Track A — daily drill, ~20 minutes

A 10-slot rotation. One slot per day, 5–8 questions per slot, then loop back to A1.
On the second pass and after, do only the questions you got wrong last time.

| Slot | Folder | Focus |
|---|---|---|
| A1 | `01-JavaScript/10-advanced-javascript` | `this`, `call`, `apply`, `bind` |
| A2 | `01-JavaScript/12-tricky-output-questions` | hoisting, TDZ, scope |
| A3 | `01-JavaScript/10-advanced-javascript` | closures, closures in loops |
| A4 | `01-JavaScript/12-tricky-output-questions` | `this` and arrow-function `this` |
| A5 | `01-JavaScript/09-async-javascript` | `Promise.all` / `allSettled` / `race` / `any` |
| A6 | `01-JavaScript/12-tricky-output-questions` | coercion, `==` vs `===` |
| A7 | `01-JavaScript/10-advanced-javascript` | prototypes, prototype chain |
| A8 | `01-JavaScript/12-tricky-output-questions` | Promise vs `setTimeout` ordering |
| A9 | `01-JavaScript/05-functions` | closures, HOF, compose, memoize, curry |
| A10 | `01-JavaScript/10-advanced-javascript` | event loop, microtask vs macrotask, debounce, throttle |

### Track B — main block, the bulk of your time

29 folders, in this exact order. TypeScript and Next.js interleave because they compound.
Steps 3–4 and 8 are deliberately easy — mechanical wins placed early for momentum.

| # | Folder | Done when |
|---|---|---|
| 1 | `02-TypeScript/01-basics` | you can state `any` vs `unknown` vs `never` without hedging |
| 2 | `02-TypeScript/02-types` | unions, literals, `keyof`, `readonly` written from memory |
| 3 | `04-NextJs/01-routing` | nested, dynamic, catch-all and route groups all built once |
| 4 | `04-NextJs/02-layouts` | nested layouts and a route-group layout working |
| 5 | `02-TypeScript/03-functions` | generic function signatures written unaided |
| 6 | `02-TypeScript/04-objects` | index signatures and nested object types |
| 7 | `02-TypeScript/05-interfaces` | interface vs type explained out loud |
| 8 | `04-NextJs/05-dynamic-routes` | params typed, `generateStaticParams` used |
| 9 | `02-TypeScript/06-type-aliases` | a recursive JSON-like type written from scratch |
| 10 | `02-TypeScript/07-unions-intersections` | discriminated union + `never` exhaustiveness check |
| 11 | `02-TypeScript/08-generics` | generic repository and constrained generic written unaided |
| 12 | `02-TypeScript/09-narrowing` | custom type predicate written from memory |
| 13 | `02-TypeScript/10-utility-types` | `Pick`, `Omit` and `ReturnType` **implemented**, not just used |
| 14 | `04-NextJs/03-server-components` | you can say exactly what may cross the boundary, and why |
| 15 | `04-NextJs/04-client-components` | same, from the client side |
| 16 | `04-NextJs/13-rendering` | static vs dynamic vs streaming explained in 90 seconds |
| 17 | `04-NextJs/06-data-fetching` | fetching, dependent data, and failure handled |
| 18 | `02-TypeScript/13-async-types` | typed fetch + `Awaited` used correctly |
| 19 | `04-NextJs/12-caching` | you can name what invalidates what. **Slowest step — expect it.** |
| 20 | `04-NextJs/07-loading-error` | `loading` / `error` / `not-found` with a working reset |
| 21 | `04-NextJs/08-api-route-handlers` | full CRUD plus a paginated endpoint |
| 22 | `04-NextJs/09-server-actions` | mutation with revalidation, from memory |
| 23 | `04-NextJs/10-authentication` | protected route + role check |
| 24 | `04-NextJs/11-middleware` | redirect logged-out user, redirect logged-in away from login |
| 25 | `02-TypeScript/12-classes-oop` | abstract class + generic class |
| 26 | `02-TypeScript/11-advanced-types` | read-level only: explain mapped types and `infer` |
| 27 | `04-NextJs/15-typescript-nextjs` | both gap tracks at once — do not rush this one |
| 28 | `02-TypeScript/14-typescript-interview` | **assessment.** Closed docs. |
| 29 | `04-NextJs/16-nextjs-interview` | **assessment.** Closed docs. |

### Track C — one longer session per week

Alternates React and JavaScript Tier 2, so neither goes cold. 18 sessions.

| # | Folder | # | Folder |
|---|---|---|---|
| C1 | `03-React/10-useEffect` | C10 | `01-JavaScript/11-algorithms-stack` |
| C2 | `01-JavaScript/07-modern-javascript` | C11 | `03-React/16-api-fetching` |
| C3 | `03-React/12-useMemo` + `13-useCallback` + `18-performance` *(one unit)* | C12 | `01-JavaScript/11-algorithms-recursion` |
| C4 | `01-JavaScript/11-algorithms-hash-maps` | C13 | `03-React/17-state-management` |
| C5 | `03-React/15-custom-hooks` | C14 | `01-JavaScript/06-oop` |
| C6 | `01-JavaScript/11-algorithms-two-pointers` | C15 | `03-React/19-react-patterns` |
| C7 | `03-React/11-useRef` | C16 | `01-JavaScript/08-error-handling` |
| C8 | `01-JavaScript/11-algorithms-sliding-window` | C17 | `03-React/20-react-interview` *(assessment)* |
| C9 | `03-React/14-context` | C18 | `01-JavaScript/12-javascript-interview-medium` *(assessment)* |

### If the timeline is tight

Track A never gets cut — it is 20 minutes and the highest return per minute here.
Cut in this order, and only in this order:

1. Track C sessions C14–C16 (`06-oop`, `19-react-patterns`, `08-error-handling`).
2. Track C algorithm folders down to two: keep `11-algorithms-hash-maps` and `11-algorithms-sliding-window`.
3. Track B steps 25 and 26 (`12-classes-oop`, `11-advanced-types`).
4. Track B steps 23 and 24 (`10-authentication`, `11-middleware`).

Never cut: Track B steps 10–19, or the four assessment folders (B28, B29, C17, C18).
Compress rather than cut by doubling Track C to two sessions per week.

---

## 5. Practise differently for known vs unknown material

**Known (JavaScript, React) — the goal is retrieval, not construction.**
- Say the answer out loud before writing anything. If you cannot narrate it, you cannot answer it in an interview, regardless of whether you could code it.
- Predict output first, then run it. A wrong prediction is the useful signal; a right one costs 30 seconds.
- Skip typing out solutions you have written a hundred times at work. Explain them instead.

**Unknown (TypeScript, Next.js) — the goal is construction.**
- Type it out. Every time. No copy-paste, no autocomplete-driven guessing.
- Deliberately break it: remove a type, cross the server/client boundary wrongly, read the error, then explain the error. Error messages are the fastest teacher in both of these.
- After each folder, write 3–4 sentences of explanation with the docs closed. If you cannot, the folder is not done.

### Asking for help — three modes

Name the mode when asking, to avoid getting the wrong kind of answer.

| Mode | What happens | Use it for |
|---|---|---|
| **Show** | Full worked solution, commented, with the reasoning behind each decision. | The **first problem only** of a concept you have no model of yet. |
| **Hint** | The approach in words, plus the function signature or file skeleton. You write the body. | Everything after the first problem in a new concept. **This should be the default.** |
| **Check** | You write it cold and unaided. Review only — correctness, edge cases, what an interviewer would push on. | All of Track A and Track C. Everything in the late stage. |

**The rule that makes Show safe:** after a Show, close it and rewrite the *same* problem from
scratch before moving to the next one. Reading a solution produces a strong feeling of
understanding that does not survive contact with an interviewer. The rewrite is what converts it.

Never two Shows in a row on the same concept. If the second problem still needs a Show,
the first one did not land — go back and rewrite it rather than pushing forward.

**Do not use Show on Track A or Track C.** Those are JavaScript and React, where you already
have the ability and the goal is retrieval. Attempt cold, get it wrong, then ask.
The failed attempt is the thing that makes the answer stick.

---

## 6. Completion signal

The README's Completion Standard applies as written. Add one check on top of it,
since the goal here is answering questions rather than shipping:

> Can you explain the concept out loud, in under 90 seconds, with nothing on screen?

If not, the folder is not done, no matter how many of its problems you solved.

---

## 7. Gaps worth adding later

Not in the README, commonly asked, listed here so they are not forgotten.
Add them only after the Tier 1 lists above are genuinely done:

- **DOM fundamentals** — event delegation, bubbling vs capturing, `addEventListener`, `localStorage`/`sessionStorage`/cookies. Absent from the README entirely, and standard JS interview material.
- **Testing** — Vitest/Jest plus React Testing Library. Frequently asked for React and Next.js roles.
- **HTTP basics** — status codes, REST semantics, CORS, JWT vs session cookies. Feeds directly into Next.js `10-authentication`.
- **Current React/Next APIs** — `use`, `useActionState`, `useOptimistic`, Suspense and streaming; and in Next 15+, `params`/`searchParams` are async. Worth confirming against the docs before you drill `15-typescript-nextjs`.
