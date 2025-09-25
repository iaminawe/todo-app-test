# Todo App Test

A modern todo list application built with Next.js, TypeScript, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Hooks + localStorage (MVP)
- **Testing:** Jest + React Testing Library

## Project Structure

```
todo-app-test/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── tests/           # Test files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iaminawe/todo-app-test.git
cd todo-app-test
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests in watch mode
- `npm run test:ci` - Run tests once (for CI)
- `npm run format` - Format code with Prettier

## Development Workflow

This project follows Test-Driven Development (TDD) and GitHub Issue-Driven Development:

1. Each feature starts with a GitHub issue
2. Tests are written before implementation
3. Code includes GitHub issue references
4. Maximum 4-hour task size

## Testing

Tests are written using Jest and React Testing Library. Run tests with:

```bash
npm test
```

For coverage report:
```bash
npm run test:ci -- --coverage
```

## Project Phases

### Phase 1: MVP ✅
- [x] Project setup and configuration
- [ ] Core todo components (TodoList, TodoItem, TodoForm)
- [ ] State management with localStorage
- [ ] Basic CRUD operations

### Phase 2: Enhanced Features
- [ ] Extended properties (priority, due dates, descriptions)
- [ ] Filtering and sorting
- [ ] Inline editing

### Phase 3: Advanced Features
- [ ] Categories and tags
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Performance optimization

## Contributing

1. Check the [GitHub Issues](https://github.com/iaminawe/todo-app-test/issues) for tasks
2. Create a feature branch: `git checkout -b feature/issue-number`
3. Write tests first (TDD)
4. Implement the feature
5. Ensure all tests pass
6. Create a pull request

## License

MIT