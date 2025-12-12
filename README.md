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
- Toast notifications for user-friendly error messages
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

## Error Handling

The application implements a two-tier error handling strategy using PrimeNG Toast:

### Global Error Interceptor
HTTP errors with status codes 404 and 500 are handled globally by the `errorInterceptor`:
- Displays generic, user-friendly toast messages
- Centralized in `src/app/core/constants/global-errors.ts` for easy maintenance
- Adding new global error codes only requires updating the `GLOBAL_ERROR_CODES` array

### Local Error Handling
All other HTTP errors are handled locally in their respective stores:
- **UserStore** (@ngrx/signals): Handles user-specific errors with contextual messages
- **PostEffects** (@ngrx/effects): Handles post-specific errors with contextual messages
- Stores check against `GLOBAL_ERROR_CODES` to avoid duplicate toast notifications

### Benefits
- **User-friendly messages**: Generic, non-technical error messages that don't expose implementation details
- **Consistent UX**: All API errors are displayed via toast notifications at the top-right of the screen
- **Security**: Technical error details (error.message) are kept in the application state for debugging but not shown to end users
- **Maintainability**: Global error codes centralized in a single constant for easy updates
