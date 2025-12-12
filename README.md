# User Dashboard

Angular 20 dashboard application with modern tooling and component library.

## Stack

- **Angular 20** - Framework
- **PrimeNG 20** - UI component library
- **@ngrx/signals** - State management
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
- Standalone components
- Signal-based state management with named actions for better debugging
- DDD (Domain-Driven Design) architecture
- Comprehensive test coverage
