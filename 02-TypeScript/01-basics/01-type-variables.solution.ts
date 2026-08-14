/**
 * 01-basics — Problem 1: Type variables
 *
 * Goal: declare variables covering every primitive type, and know when to write
 * the type yourself versus when to let TypeScript work it out.
 *
 * This is the SHOW example. Read it, understand the reasoning, then close it and
 * write `01-type-variables.ts` from scratch without looking.
 */

// ---------------------------------------------------------------------------
// PART 1 — Explicit annotation
// ---------------------------------------------------------------------------
// Syntax is `let name: Type = value`. The annotation is a constraint: from here on,
// the compiler rejects any assignment that is not a string.

let username: string = "ravindu";
let age: number = 28;
let isActive: boolean = true;

username = "nethmina"; // fine
// username = 42;      // Error: Type 'number' is not assignable to type 'string'.

// Note: the types are lowercase — `string`, not `String`. `String` is the wrapper
// object and is almost never what you want. This is a real interview question.

// ---------------------------------------------------------------------------
// PART 2 — Inference, and why you should usually NOT annotate
// ---------------------------------------------------------------------------
// TypeScript already knows the type from the initializer. These two lines are
// identical in every way that matters:

let cityAnnotated: string = "Colombo";
let cityInferred = "Colombo"; // inferred as string

// Hover `cityInferred` in your editor — it says `string`.
//
// The idiomatic rule: **annotate only what inference cannot get right.**
// Writing `: string` next to a string literal is noise, and it is the number one
// tell of someone who has just started with TypeScript. Annotate function
// parameters and return types; let variable initializers infer.

// The exception — declaring without initializing. There is nothing to infer from,
// so annotate, or you get an implicit `any`:

let scoreLater: number; // annotated, good
scoreLater = 10;

// let mysteryLater;    // implicitly `any` — you have opted out of type checking

// ---------------------------------------------------------------------------
// PART 3 — `const` narrows further than `let` (the one that surprises JS devs)
// ---------------------------------------------------------------------------
// A `let` can be reassigned, so TypeScript widens the literal to its general type.
// A `const` can never be reassigned, so the literal type itself is kept.

let mutableRole = "admin"; // inferred: string
const fixedRole = "admin"; // inferred: "admin"  <- a LITERAL type, not string

mutableRole = "editor"; // fine — any string is allowed
// fixedRole is not reassignable at all, and its type is the single value "admin".

// Why this matters: literal types are what make union types work.
// `"admin" | "editor" | "viewer"` is built out of literal types, and that pattern
// is most of TypeScript's real value. It starts here.

let statusCode = 404; // number
const okCode = 200; // 200

// ---------------------------------------------------------------------------
// PART 4 — null and undefined under `strict`
// ---------------------------------------------------------------------------
// With "strict": true (which enables strictNullChecks), null and undefined are NOT
// members of every type. This is the setting that eliminates most "cannot read
// property of undefined" bugs, and it is the single biggest reason to use TS.

// let brokenEmail: string = null;  // Error: Type 'null' is not assignable to type 'string'.

// If a variable genuinely may be absent, say so in the type with a union:
let email: string | null = null;
email = "ravindu@example.com";

let middleName: string | undefined = undefined;
middleName = "kumara";

// TypeScript now forces you to check before using it:
// email.toUpperCase();          // Error: 'email' is possibly 'null'.
if (email !== null) {
  email.toUpperCase(); // fine — narrowed to string inside the guard
}

// That narrowing behaviour is folder 09. It exists because of the union above.

// ---------------------------------------------------------------------------
// PART 5 — any vs unknown
// ---------------------------------------------------------------------------
// `any` switches the type checker OFF for that value. Everything is permitted,
// nothing is caught, and it spreads: anything derived from an `any` is also `any`.

let loose: any = "hello";
loose = 42;
loose = true;
loose.definitelyNotAMethod(); // compiles fine, crashes at runtime — no help from TS

// `unknown` is the safe counterpart. It also accepts any value, but permits nothing
// until you prove what it is.

let safe: unknown = "hello";
safe = 42;
safe = true;

// safe.toFixed(2);                    // Error: 'safe' is of type 'unknown'.
if (typeof safe === "number") {
  safe.toFixed(2); // fine — proven to be a number
}

// Rule of thumb: when you do not know a type, reach for `unknown`, never `any`.
// "What is the difference between any and unknown" is asked in almost every
// TypeScript interview. The answer is one sentence: both accept anything, but
// `unknown` refuses to let you USE it until you narrow it.

// ---------------------------------------------------------------------------
// PART 6 — void and never
// ---------------------------------------------------------------------------
// `void` means "no useful value". You will meet it as a function return type far
// more often than as a variable type.
let nothing: void = undefined;

// `never` means "this can never happen". A variable of type `never` can never hold
// a value at all, so you can declare it but not assign to it.
let impossible: never;
// impossible = 0;          // Error: Type 'number' is not assignable to type 'never'.
// impossible = undefined;  // Error — not even undefined qualifies.

// `never` looks pointless now. It becomes important in folder 07, where it is how
// you force the compiler to prove you have handled every case of a union.

// ---------------------------------------------------------------------------
// PART 7 — the two primitives people forget
// ---------------------------------------------------------------------------
const bigNumber: bigint = 9007199254740993n; // note the `n` suffix
const uniqueKey: symbol = Symbol("user-id");

// Full primitive list, worth being able to recite:
// string, number, boolean, bigint, symbol, null, undefined
// Plus the special types: any, unknown, void, never

// ---------------------------------------------------------------------------
// Why this line is here
// ---------------------------------------------------------------------------
// Without a top-level import or export, TypeScript treats a file as a SCRIPT, and
// every variable in it lives in the global scope shared with every other file in
// this folder. Your next practice file declaring `username` would collide with this
// one. `export {}` makes the file a module, giving it its own scope.
// Put this line at the bottom of every standalone practice file.
export {};
