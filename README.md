<p align="center">
  <a href="" rel="noopener">
 <img width=90px height=90px src="./public/logo.png" alt="logo"></a>
</p>

<h3 align="center">NEXTJS 14.2.24 Boilerplate</h3>

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [📦 Technologies ](#-technologies-)
- [🚀 Getting Started ](#-getting-started-)

## 📦 Technologies <a name="technologies"></a>

- **Main Framework**: Next.js 14.2.24 with App Router
- **Language**: TypeScript 5.7.3
- **Testing**:

  - Vitest 3.0.7 with @testing-library/react 16.2.0
  - Test coverage with @vitest/coverage-istanbul
  - Jest DOM for DOM testing

- **State Management**:

  - Zustand 5.0.3 for global state
  - React Hook Form 7.54.2 for forms
  - Zod 3.24.2 for schema validation

- **Styling**:

  - TailwindCSS 4.0.7
  - Class Variance Authority 0.7.1
  - Tailwind Merge for class composition

- **Code Quality**:

  - ESLint 9.20.1
  - Prettier 3.5.1
  - Lefthook for git hooks
  - Commitlint for commit standardization
  - Lint-staged for code verification

- **Additional Features**:
  - PWA configured with next-pwa
  - Icon support with @iconify/react
  - Utility hooks with usehooks-ts
  - Ky for HTTP requests
  - Faker.js for mock data

## 🚀 Getting Started <a name="getting-started"></a>

To create a new project using this boilerplate:

```bash
npx create-next-app@14.2.24 -e https://github.com/italobarrosme/nezuko
```

To run the project:

```bash
npm install
npm run dev
```

Available scripts:

```bash
npm run dev         # Starts development server with Turbo
npm run build      # Generates production build
npm run start      # Starts production server
npm test          # Runs tests
npm run test:coverage  # Runs tests with coverage
npm run test:deploy    # Runs tests for deployment
npm run test:snapshot  # Updates test snapshots
```
