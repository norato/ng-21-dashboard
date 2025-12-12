# User Dashboard

Angular 20 dashboard application with modern tooling and component library.

## Stack

- **Angular 20** - Framework
- **PrimeNG 20** - UI component library
- **@ngrx/signals** - Signal-based state management
- **@ngrx/store + @ngrx/effects** - Classic Redux state management
- **@angular-architects/ngrx-toolkit** - Enhanced NgRx DevTools traceability with named actions
- **Tailwind CSS v4** - Styling
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **ng-mocks** - Testing utilities
- **Storybook** - Component documentation

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4200)
npm run dev

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
npm run test:e2e:ui  # with UI

# Storybook (http://localhost:6006)
npm run storybook
```

## Build

```bash
npm run build
```

## Features

- Dark/Light theme toggle with persistence
- User listing from JSONPlaceholder API
- User search with debounce and request cancellation
- Posts listing with NgRx classic store
- Standalone components
- Signal-based state management with named actions for better debugging
- DDD (Domain-Driven Design) architecture
- Skeleton screens for loading states (better UX than spinners)
- Comprehensive test coverage

## State Management Architecture

This project demonstrates proficiency with both modern and traditional NgRx approaches:

### Users Feature - Signal Store (`@ngrx/signals`)
The Users feature implements the modern signal-based approach using `@ngrx/signals`. This is my preferred approach for new applications due to its:
- Simplified API with less boilerplate
- Better TypeScript inference
- Reactive composition with `rxMethod`
- Seamless integration with Angular signals
- Named actions via `@angular-architects/ngrx-toolkit` for enhanced debugging

### Posts Feature - Classic Store (`@ngrx/store` + `@ngrx/effects`)
To demonstrate comprehensive NgRx knowledge, the Posts feature implements the traditional Redux pattern with:
- Actions created with `createAction`
- Reducers using `createReducer`
- Effects with `createEffect` for side effects
- Selectors using `createSelector`

Both implementations follow the same architectural principles (separation of concerns, testability, and maintainability) while showcasing different state management paradigms within the NgRx ecosystem.
