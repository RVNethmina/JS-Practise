# Web Developer Interview Practice

This repository is a hands-on coding practice system for JavaScript, TypeScript, React, and Next.js.

The goal is not to collect notes or copy solutions. Each folder contains concepts to understand and problems to implement from memory.

## Practice Rules

1. Read the problem before looking at any solution.
2. Try to code from memory first.
3. Test normal cases, edge cases, and invalid inputs where appropriate.
4. Refactor after solving: readability, correctness, and efficiency.
5. For interview problems, explain the approach before coding.
6. Revisit failed problems until the implementation becomes natural.

---

# 01 - JavaScript

## 01-basics

**Concepts you should learn:** Variables, let, const, var, primitive data types, reference types, typeof, type conversion, type coercion, arithmetic operators, comparison operators, logical operators, assignment operators, ternary operator, if / else, else if, switch, for loop, while loop, do while loop, break, continue, functions, parameters, arguments, return values, default parameters

**Problems to practise:** FizzBuzz, factorial, prime number check, even or odd, sum of numbers, largest of three numbers, smallest of three numbers, number reversal, digit counter, digit sum, multiplication table, leap year check, grade calculator, simple calculator, temperature conversion, age calculator, power of a number, count positive and negative numbers

## 02-arrays

**Concepts you should learn:** Array creation, indexing, updating elements, length, push, pop, shift, unshift, concat, slice, splice, indexOf, lastIndexOf, includes, join, reverse, sort, map, filter, reduce, find, findIndex, some, every, flat, flatMap, array destructuring, spread syntax

**Problems to practise:** Find maximum value, find minimum value, calculate array sum, calculate array average, reverse an array, remove duplicates, count duplicates, find second largest number, find second smallest number, find missing number, find duplicate number, merge two arrays, merge two sorted arrays, remove falsy values, move zeros to the end, rotate array left, rotate array right, chunk an array, flatten nested array, find common elements, find array difference, two sum, frequency counter, group values by frequency, sort numbers ascending, sort numbers descending

## 03-strings

**Concepts you should learn:** String indexing, string length, toUpperCase, toLowerCase, trim, trimStart, trimEnd, includes, startsWith, endsWith, indexOf, lastIndexOf, slice, substring, replace, replaceAll, split, join, charAt, template literals, string comparison

**Problems to practise:** Reverse a string, check palindrome, count characters, count vowels, count consonants, count words, capitalize first letter, capitalize every word, remove spaces, remove duplicate characters, find first non-repeating character, find first repeating character, check anagram, count character frequency, longest word, shortest word, reverse words, replace repeated characters, check if one string contains another, count occurrences of a substring

## 04-objects

**Concepts you should learn:** Object creation, properties, methods, property access, bracket notation, dot notation, Object.keys, Object.values, Object.entries, Object.assign, hasOwnProperty, computed property names, object destructuring, nested objects, spread syntax, optional properties, property deletion

**Problems to practise:** Find object by property, update object property, remove object property, count object properties, convert object to array, convert array to object, merge two objects, find object with maximum value, find object with minimum value, sort objects by property, group objects by property, count values by property, remove duplicate objects, compare two objects, clone an object, transform object keys, transform object values, calculate totals from object arrays

## 05-functions

**Concepts you should learn:** Function declarations, function expressions, arrow functions, parameters, arguments, return values, default parameters, rest parameters, callbacks, higher-order functions, pure functions, impure functions, function composition, recursion, IIFE, closures, lexical scope

**Problems to practise:** Create a calculator function, create a reusable validator, create a function that returns another function, create a counter closure, create a greeting generator, create custom map, create custom filter, create custom reduce, create custom find, create once function, create memoize function, create compose function, create pipe function, create recursive factorial, create recursive Fibonacci, create recursive array sum, create recursive string reversal

## 06-oop

**Concepts you should learn:** Classes, constructors, instance properties, instance methods, static properties, static methods, inheritance, extends, super, method overriding, polymorphism, encapsulation, private fields, getters, setters, composition

**Problems to practise:** Bank account class, savings account inheritance, shopping cart class, product class, employee management system, library management system, vehicle hierarchy, shape hierarchy, user management class, e-commerce order class, inventory class, payment class, notification class, booking system, simple game character hierarchy

## 07-modern-javascript

**Concepts you should learn:** let, const, arrow functions, template literals, destructuring, spread syntax, rest parameters, default parameters, optional chaining, nullish coalescing, logical assignment operators, enhanced object literals, computed properties, modules, import, export, named exports, default exports, Map, Set, WeakMap, WeakSet, iterators, generators, Symbols, BigInt

**Problems to practise:** Rewrite normal functions as arrow functions, destructure nested objects, destructure arrays, merge arrays with spread, merge objects with spread, create a rest-parameter utility, build a Map-based frequency counter, remove duplicates with Set, compare Map and object usage, create an iterator, create a generator, build a module with named exports, build a module with default export, safely access nested properties, implement default fallback values

## 08-error-handling

**Concepts you should learn:** try, catch, finally, throw, Error, custom Error classes, error messages, error propagation, defensive programming, input validation, handling synchronous errors, handling asynchronous errors

**Problems to practise:** Validate user input, divide safely, parse JSON safely, build a safe number parser, create custom ValidationError, create custom NotFoundError, catch nested function errors, handle failed API simulation, retry after failure, return fallback value after failure, centralize error handling, build an error-safe calculator

## 09-async-javascript

**Concepts you should learn:** Callback functions, callback hell, Promises, Promise states, resolve, reject, then, catch, finally, promise chaining, async functions, await, try / catch with async, Promise.all, Promise.allSettled, Promise.race, Promise.any, sequential execution, parallel execution, asynchronous error handling

**Problems to practise:** Create a basic Promise, convert callback code to Promise, convert Promise chain to async / await, run tasks sequentially, run tasks in parallel, fetch multiple resources in parallel, implement delay, implement retry, implement timeout, implement Promise.all from scratch, implement Promise.race from scratch, handle partial failures, build a sequential task runner, build a concurrent task runner, simulate API requests with random failures

## 10-advanced-javascript

**Concepts you should learn:** this, global context, function context, call, apply, bind, scope, lexical scope, execution context, hoisting, temporal dead zone, closures, prototypes, prototype chain, constructor functions, event loop, call stack, microtasks, macrotasks, task queue, debouncing, throttling, memoization, currying

**Problems to practise:** Predict this output, fix this binding, implement custom call, implement custom apply, implement custom bind, create object with prototype methods, inspect prototype chain, explain hoisting through output questions, predict closure output, build debounce, build throttle, build memoize, build curry, build once, build a rate limiter, predict event loop output, reorder microtask and macrotask execution

## 11-algorithms-arrays

**Concepts you should learn:** Linear traversal, in-place modification, frequency counting, prefix thinking, two pointers, sliding window, array indexing, time complexity, space complexity

**Problems to practise:** Two sum, three sum, maximum subarray, move zeros, rotate array, merge intervals, merge sorted arrays, product of array except self, best time to buy and sell stock, container with most water, remove duplicates from sorted array, find missing number, find duplicate number, majority element, intersection of arrays

## 11-algorithms-strings

**Concepts you should learn:** Character frequency, string traversal, two pointers, sliding window, normalization, substring search, time complexity, space complexity

**Problems to practise:** Valid palindrome, valid anagram, first unique character, longest substring without repeating characters, longest common prefix, group anagrams, string compression, reverse words, valid parentheses, minimum window substring, character replacement, palindrome permutation

## 11-algorithms-hash-maps

**Concepts you should learn:** Hash maps, objects as lookup tables, Map, frequency counters, constant-time lookup, key-value relationships, set membership

**Problems to practise:** Two sum, first unique character, contains duplicate, valid anagram, group anagrams, intersection of arrays, longest consecutive sequence, top frequent elements, frequency sort, count pairs with target sum

## 11-algorithms-two-pointers

**Concepts you should learn:** Left and right pointers, sorted-array traversal, inward movement, fast and slow pointers, pointer invariants

**Problems to practise:** Pair sum in sorted array, valid palindrome, remove duplicates, move zeros, reverse vowels, container with most water, three sum, two sorted arrays comparison, linked-list cycle detection with fast and slow pointers

## 11-algorithms-sliding-window

**Concepts you should learn:** Fixed-size windows, variable-size windows, window expansion, window contraction, running counts, frequency maps

**Problems to practise:** Maximum sum subarray of size k, longest substring without repeating characters, longest substring with k distinct characters, minimum size subarray sum, fruit basket, character replacement, permutation in string, minimum window substring

## 11-algorithms-stack

**Concepts you should learn:** Stack operations, LIFO, push, pop, peek, matching pairs, monotonic stack

**Problems to practise:** Valid parentheses, reverse string with stack, min stack, evaluate postfix expression, next greater element, daily temperatures, simplify path, remove adjacent duplicates

## 11-algorithms-queue

**Concepts you should learn:** Queue operations, FIFO, enqueue, dequeue, circular queues, breadth-first thinking

**Problems to practise:** Implement queue, implement circular queue, moving average from data stream, task scheduler simulation, ticket queue simulation, first unique character using queue logic

## 11-algorithms-recursion

**Concepts you should learn:** Base case, recursive case, call stack, recursive decomposition, backtracking basics

**Problems to practise:** Factorial, Fibonacci, sum of array, reverse string, binary search, tree traversal, generate subsets, generate permutations, combination generation, maze path search

## 11-algorithms-sorting-searching

**Concepts you should learn:** Linear search, binary search, bubble sort, selection sort, insertion sort, merge sort, quick sort, sorting complexity, stable sorting

**Problems to practise:** Linear search, binary search, first occurrence, last occurrence, search insertion position, bubble sort, selection sort, insertion sort, merge sort, quick sort, sort objects by property, search rotated sorted array

## 12-javascript-interview-easy

**Concepts you should practise:** Basic problem solving, array manipulation, string manipulation, object manipulation, loops, conditionals, functions, simple recursion, basic complexity analysis

**Problems to practise:** FizzBuzz, reverse string, palindrome, maximum array value, minimum array value, sum array, remove duplicates, count vowels, count characters, second largest, missing number, two sum, merge arrays, word count, object property count, simple recursion problems

## 12-javascript-interview-medium

**Concepts you should practise:** Hash maps, two pointers, sliding window, recursion, stack, queue, closures, async patterns, complexity analysis, edge-case handling

**Problems to practise:** Longest substring without repeating characters, group anagrams, product except self, three sum, minimum window substring, daily temperatures, longest consecutive sequence, flatten nested arrays, implement debounce, implement throttle, implement memoization, implement Promise.all, implement retry logic

## 12-tricky-output-questions

**Concepts you should practise:** Hoisting, scope, closures, this, type coercion, equality, prototypes, async execution, event loop, microtasks, macrotasks, Promise scheduling

**Problems to practise:** Predict variable hoisting output, predict function hoisting output, predict closure output, predict this output, predict arrow-function this output, predict coercion output, predict equality output, predict prototype lookup output, predict Promise output, predict setTimeout output, predict mixed Promise and timer output

---

# 02 - TypeScript

## 01-basics

**Concepts you should learn:** Type annotations, type inference, string, number, boolean, null, undefined, bigint, symbol, any, unknown, never, void, arrays, tuples, object types

**Problems to practise:** Type variables, type arrays, type tuples, type function parameters, type function return values, safely handle unknown input, replace any with safer types, create typed configuration object, create typed utility function

## 02-types

**Concepts you should learn:** Union types, intersection types, literal types, nullable types, optional properties, readonly properties, indexed access types, keyof, typeof in type positions

**Problems to practise:** Create user role union, create status union, create readonly configuration, combine object types, create reusable literal types, model nullable API values, derive property types, create type-safe object access

## 03-functions

**Concepts you should learn:** Function parameter types, return types, optional parameters, default parameters, rest parameters, function type aliases, callbacks, overloaded functions, generic functions

**Problems to practise:** Type calculator functions, type callbacks, create generic identity, create typed higher-order function, build typed retry function, type a callback-based API, create overloaded format function

## 04-objects

**Concepts you should learn:** Object type syntax, nested object types, optional properties, readonly properties, index signatures, excess property checks, structural typing

**Problems to practise:** Type user object, type product object, type nested API response, type settings object, type dictionary, type dynamic key object, validate nested object types

## 05-interfaces

**Concepts you should learn:** Interface declaration, optional fields, readonly fields, interface extension, function interfaces, class implementation, interface merging

**Problems to practise:** User interface, admin interface, API response interface, pagination interface, repository interface, service interface, class implementing interface, extended interfaces

## 06-type-aliases

**Concepts you should learn:** Type aliases, unions, intersections, literal types, reusable object types, function aliases, recursive types

**Problems to practise:** User role type, API status type, event type, function type, configuration type, nested tree type, recursive JSON-like type

## 07-unions-intersections

**Concepts you should learn:** Union types, intersection types, discriminated unions, exhaustive checking, never-based exhaustiveness

**Problems to practise:** Model loading / success / error states, payment event union, notification event union, combine permissions with user types, build discriminated API results, exhaustively handle states

## 08-generics

**Concepts you should learn:** Generic functions, generic types, generic interfaces, generic constraints, keyof with generics, default generic parameters

**Problems to practise:** Generic identity function, generic array helper, generic first element, generic API response, generic repository, generic pagination, generic merge utility, generic property getter, constrained generic sort function

## 09-narrowing

**Concepts you should learn:** typeof narrowing, instanceof narrowing, in operator, equality narrowing, truthiness narrowing, type predicates, discriminated unions

**Problems to practise:** Safely process unknown input, create custom type guard, narrow API response union, validate object shape, narrow class instances, safely process arrays and primitives

## 10-utility-types

**Concepts you should learn:** Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters, Awaited

**Problems to practise:** Create update DTO, create readonly configuration, create public user type, create private user type, create role map, extract union members, build function utility types, type async response

## 11-advanced-types

**Concepts you should learn:** Conditional types, mapped types, template literal types, recursive types, infer, indexed access types, key remapping

**Problems to practise:** Build optional property mapper, build readonly mapper, extract function return types, build event name types, transform API object types, create recursive tree types, build type-safe event maps

## 12-classes-oop

**Concepts you should learn:** Typed classes, access modifiers, public, private, protected, readonly fields, abstract classes, inheritance, interfaces, generics with classes, getters and setters

**Problems to practise:** Typed bank account, typed shopping cart, typed repository, abstract payment system, typed employee hierarchy, generic storage class, class implementing interface

## 13-async-types

**Concepts you should learn:** Promise types, async function return types, Promise generic types, API response typing, error-safe async functions, Awaited

**Problems to practise:** Type API fetch function, type Promise response, type async retry function, type pagination response, type async repository, type concurrent request helper

## 14-typescript-interview

**Concepts you should practise:** Type inference, any versus unknown, interface versus type, union versus intersection, generics, narrowing, utility types, structural typing, function typing

**Problems to practise:** Type a real API response, remove any from a code sample, convert JavaScript code to TypeScript, build generic utility, build discriminated union, write custom type guard, refactor poorly typed code, explain and implement utility types

---

# 03 - React

## 01-jsx

**Concepts you should learn:** JSX syntax, expressions in JSX, JSX attributes, fragments, conditional JSX, rendering JavaScript values, component return rules

**Problems to practise:** Build profile card JSX, render dynamic user data, render conditional message, render list from array, render nested data, convert HTML-like markup into JSX

## 02-components

**Concepts you should learn:** Functional components, component composition, reusable components, component boundaries, default props patterns, children

**Problems to practise:** Button component, Card component, Avatar component, Modal component, Alert component, reusable List component, reusable FormField component, nested component layout

## 03-props

**Concepts you should learn:** Passing props, destructuring props, default values, children prop, callback props, typed props with TypeScript

**Problems to practise:** UserCard with props, ProductCard with props, parent-to-child data flow, child callback to parent, reusable Button with variants, reusable Card with children, typed component props

## 04-state

**Concepts you should learn:** State, useState, state updates, functional state updates, derived state, immutable updates, object state, array state

**Problems to practise:** Counter, toggle, form state, shopping cart quantity, add / remove item, edit list item, update nested object, manage array of objects, derived total calculation

## 05-events

**Concepts you should learn:** Event handlers, click events, change events, submit events, keyboard events, event objects, preventing default behavior, passing arguments to handlers

**Problems to practise:** Click counter, form submit, input tracker, keyboard shortcut, delete item handler, submit validation, toggle menu, event-driven modal

## 06-conditional-rendering

**Concepts you should learn:** Ternary rendering, && rendering, early returns, loading states, empty states, error states, permission-based rendering

**Problems to practise:** Login / logout UI, loading spinner, empty list message, error message, admin-only content, authenticated content, status badge renderer, multi-state dashboard

## 07-lists-keys

**Concepts you should learn:** Array rendering, map in JSX, keys, stable keys, list updates, nested lists, filtered lists

**Problems to practise:** User list, product list, todo list, filtered list, nested category list, sortable list, delete list item, edit list item, grouped list

## 08-forms

**Concepts you should learn:** Controlled inputs, form state, form submission, validation, select, checkbox, radio, textarea, form reset, error messages

**Problems to practise:** Login form, registration form, contact form, profile editor, multi-field validation, password confirmation, checkbox preferences, dynamic form fields

## 09-useState

**Concepts you should learn:** useState, lazy initialization, functional updates, batching, state immutability, object state, array state

**Problems to practise:** Counter, multi-counter, shopping cart, todo list, tabs, accordion, form wizard, dynamic list editor

## 10-useEffect

**Concepts you should learn:** useEffect, dependency array, mount, update, cleanup, subscriptions, timers, data fetching, avoiding unnecessary effects

**Problems to practise:** Fetch data on mount, document title updater, interval timer, window event subscription, cleanup timer, search request, dependent effect, avoid derived-state effect

## 11-useRef

**Concepts you should learn:** useRef, persistent mutable values, DOM references, previous values, uncontrolled inputs, avoiding rerenders

**Problems to practise:** Focus input, autofocus field, previous state tracker, stopwatch without rerendering, store timer ID, scroll to element, uncontrolled form input

## 12-useMemo

**Concepts you should learn:** useMemo, memoized calculations, dependency arrays, derived expensive calculations, when memoization is useful

**Problems to practise:** Memoize filtered list, memoize sorted list, expensive calculation component, compare memoized and non-memoized rendering, fix unnecessary recalculation

## 13-useCallback

**Concepts you should learn:** useCallback, function identity, dependency arrays, child rerendering, memoized callbacks, interaction with React.memo

**Problems to practise:** Memoized child button, stable event callback, optimized list item actions, prevent unnecessary child rerenders, refactor callback dependencies

## 14-context

**Concepts you should learn:** createContext, Provider, useContext, global state, avoiding prop drilling, context performance considerations

**Problems to practise:** Theme context, authentication context, language context, cart context, user preferences context, permission context

## 15-custom-hooks

**Concepts you should learn:** Custom hook rules, reusable stateful logic, hook composition, hook inputs, hook outputs

**Problems to practise:** useToggle, useCounter, useFetch, useDebounce, useLocalStorage, usePrevious, useWindowSize, useTimeout, useInterval, usePagination

## 16-api-fetching

**Concepts you should learn:** Fetching in React, loading state, success state, error state, request cancellation, query parameters, pagination, optimistic updates

**Problems to practise:** User list fetcher, product search, paginated API, detail page fetch, create item request, update item request, delete item request, retry failed request, search with debounce

## 17-state-management

**Concepts you should learn:** Local state, lifted state, context state, reducer pattern, server state, client state, Zustand-style global state concepts

**Problems to practise:** Shopping cart store, authentication store, theme store, filter store, multi-step form state, shared dashboard filters, reducer-based todo system

## 18-performance

**Concepts you should learn:** React rendering, rerenders, React.memo, useMemo, useCallback, list rendering performance, lazy loading, code splitting, avoiding unnecessary state

**Problems to practise:** Optimize large list, fix unnecessary rerenders, memoize expensive computation, optimize child callbacks, lazy-load component, optimize search results, reduce unnecessary context updates

## 19-react-patterns

**Concepts you should learn:** Composition, compound components, controlled components, uncontrolled components, custom hooks, render patterns, reusable abstractions, container and presentational separation

**Problems to practise:** Compound Tabs, compound Accordion, reusable Modal, controlled Select, reusable FormField, reusable DataTable, reusable Pagination, reusable Search component

## 20-react-interview

**Concepts you should practise:** Props, state, hooks, component lifecycle, effects, controlled components, rendering, keys, memoization, context, custom hooks, performance

**Problems to practise:** Build counter, build todo, build autocomplete, build tabs, build accordion, build modal, build pagination, build shopping cart, build debounced search, build reusable data table, explain and implement custom hook

---

# 04 - Next.js

## 01-routing

**Concepts you should learn:** App Router, file-system routing, page.tsx, nested routes, route groups, dynamic routes, catch-all routes, optional catch-all routes

**Problems to practise:** Build home route, nested dashboard route, dynamic product route, dynamic user route, catch-all documentation route, route group for authentication pages

## 02-layouts

**Concepts you should learn:** Root layout, nested layouts, shared UI, layout composition, metadata in layouts, route group layouts

**Problems to practise:** Dashboard layout, admin layout, auth layout, nested settings layout, shared navigation, shared sidebar, multiple route groups

## 03-server-components

**Concepts you should learn:** Server Components, server-side data access, component boundaries, async components, server-only logic, passing data to Client Components

**Problems to practise:** Server-rendered user list, server-rendered product page, server-rendered dashboard, server-side data transformation, pass server data into client component

## 04-client-components

**Concepts you should learn:** use client directive, client state, client events, browser APIs, hooks in Client Components, server-to-client boundaries

**Problems to practise:** Interactive counter, client search box, modal, dropdown, form, browser storage component, interactive dashboard filter

## 05-dynamic-routes

**Concepts you should learn:** Dynamic segments, route params, generateStaticParams, nested dynamic segments, catch-all segments

**Problems to practise:** Product detail route, blog post route, user profile route, category route, documentation route, nested product variant route

## 06-data-fetching

**Concepts you should learn:** Server-side fetching, fetch, async Server Components, request caching concepts, route parameters in data fetching, loading states, error handling

**Problems to practise:** Fetch user list, fetch product list, fetch product detail, fetch blog post, fetch paginated results, fetch dependent data, handle failed request

## 07-loading-error

**Concepts you should learn:** loading.tsx, error.tsx, not-found.tsx, loading UI, error boundaries, reset, not found behavior

**Problems to practise:** Add dashboard loading state, add product loading skeleton, add API error UI, add product not-found page, add nested error boundary, add retry button

## 08-api-route-handlers

**Concepts you should learn:** Route Handlers, GET, POST, PUT, PATCH, DELETE, Request, Response, JSON responses, status codes, query parameters, dynamic API routes

**Problems to practise:** GET users API, POST user API, GET product API, update product API, delete product API, search endpoint, paginated endpoint, dynamic resource endpoint

## 09-server-actions

**Concepts you should learn:** Server Actions, form actions, server-side mutations, revalidation after mutation, validation, error handling

**Problems to practise:** Create user action, update profile action, create product action, delete product action, login form action, validated form submission, mutation with revalidation

## 10-authentication

**Concepts you should learn:** Authentication, authorization, sessions, cookies, protected routes, authenticated Server Components, role-based access

**Problems to practise:** Login flow, logout flow, protected dashboard, admin-only page, role-based navigation, session-aware page, unauthorized response handler

## 11-middleware

**Concepts you should learn:** Middleware, request interception, redirects, rewrites, route matching, authentication checks, headers

**Problems to practise:** Protect dashboard route, redirect logged-out user, redirect authenticated user away from login, locale routing, security header example

## 12-caching

**Concepts you should learn:** Request caching concepts, data caching concepts, route caching concepts, revalidation, cache invalidation, dynamic rendering, static rendering

**Problems to practise:** Cache product data, revalidate blog data, invalidate data after mutation, build statically rendered page, build dynamically rendered page, compare cached and uncached fetches

## 13-rendering

**Concepts you should learn:** Static rendering, dynamic rendering, server rendering, client rendering boundaries, pre-rendering, streaming

**Problems to practise:** Static blog page, dynamic dashboard page, mixed server and client page, streaming dashboard sections, pre-rendered product route, dynamic user route

## 14-performance

**Concepts you should learn:** Image optimization, font optimization, code splitting, lazy loading, Server Components, minimizing Client Components, caching, bundle size

**Problems to practise:** Optimize image-heavy page, lazy-load large component, move logic to Server Component, reduce client bundle, optimize data fetching, optimize dashboard rendering

## 15-typescript-nextjs

**Concepts you should learn:** Typed page props, typed route params, typed Server Components, typed Client Components, typed Route Handlers, typed Server Actions, typed API responses

**Problems to practise:** Type dynamic route params, type API response, type form action, type Server Component props, type Client Component props, type query parameters, type authentication session

## 16-nextjs-interview

**Concepts you should practise:** App Router, Server Components, Client Components, routing, layouts, data fetching, caching, rendering, Route Handlers, Server Actions, middleware, authentication

**Problems to practise:** Explain and implement server component, explain and implement client component, build dynamic route, build Route Handler, build protected page, build server action form, implement loading and error states, implement cached data fetch

---

# 05 - Machine Coding

## javascript

**Concepts you should practise:** Problem decomposition, reusable functions, state management without a framework, event-driven logic, input validation, edge-case handling, clean code, time complexity

**Problems to practise:** Calculator, todo manager, shopping cart engine, expense tracker, task manager, quiz engine, URL parser, debounce utility, throttle utility, autocomplete data engine, pagination logic, notification queue

## typescript

**Concepts you should practise:** Type-safe application design, interfaces, generics, discriminated unions, reusable types, typed state, typed services, validation

**Problems to practise:** Typed shopping cart, typed task manager, typed form validation engine, typed API client, typed pagination utility, typed notification system, typed event emitter, typed cache utility

## react

**Concepts you should practise:** Component design, state management, hooks, controlled forms, reusable components, API integration, loading and error states, performance, accessibility-aware component behavior

**Problems to practise:** Todo app, calculator, shopping cart, autocomplete, tabs, accordion, modal, dropdown, pagination, data table, sortable table, filter panel, multi-step form, stopwatch, countdown, Kanban board

## nextjs

**Concepts you should practise:** App Router architecture, Server and Client Components, data fetching, mutations, Route Handlers, Server Actions, authentication, loading and error states, caching, TypeScript integration

**Problems to practise:** Blog application, product catalog, admin dashboard, task management application, authenticated dashboard, CRUD application, paginated resource list, search application, role-based admin panel, analytics dashboard

---

# Recommended Progression

**JavaScript:** Basics, Arrays, Strings, Objects, Functions, OOP, Modern JavaScript, Error Handling, Async JavaScript, Advanced JavaScript, Algorithms, Interview Problems

**TypeScript:** Basics, Types, Functions, Objects, Interfaces, Type Aliases, Unions and Intersections, Generics, Narrowing, Utility Types, Advanced Types, Classes and OOP, Async Types, Interview Problems

**React:** JSX, Components, Props, State, Events, Conditional Rendering, Lists and Keys, Forms, useState, useEffect, useRef, useMemo, useCallback, Context, Custom Hooks, API Fetching, State Management, Performance, React Patterns, Interview Problems

**Next.js:** Routing, Layouts, Server Components, Client Components, Dynamic Routes, Data Fetching, Loading and Error Handling, Route Handlers, Server Actions, Authentication, Middleware, Caching, Rendering, Performance, TypeScript with Next.js, Interview Problems

**Machine Coding:** JavaScript, TypeScript, React, Next.js

---

# Completion Standard

A folder is considered complete when you can explain the concept, write a small example without documentation, solve the listed problems without copying, test edge cases, and explain why your solution works.

For interview preparation, prioritize writing code from memory over reading solutions. When a problem is difficult, study the solution, close it, and implement it again from memory.
