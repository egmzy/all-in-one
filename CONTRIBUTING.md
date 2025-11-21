# Contributing to All-in-One AI

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Make your changes in the `src/` directory
4. Build: `npm run build`
5. Test the extension by loading `dist/` in Chrome

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add types for all functions and variables
- Keep functions small and focused
- Add comments for complex logic

## Project Structure

- `src/types/` - TypeScript type definitions
- `src/providers/` - AI provider configurations
- `src/utils/` - Utility functions (API, storage, markdown)
- `src/ui/` - UI rendering logic
- `src/config/` - Configuration constants
- `public/` - Static assets (HTML, CSS, manifest)

## Adding a New AI Provider

1. Create a new file in `src/providers/` (e.g., `newprovider.ts`)
2. Implement the `Provider` interface from `src/types/index.ts`
3. Export it in `src/providers/index.ts`
4. Add color configuration in `src/config/colors.ts`
5. Add a new pane in `public/index.html`
6. Update `manifest.json` with host permissions
7. Update the README

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Test thoroughly in Chrome
4. Update documentation if needed
5. Submit a PR with a clear description

## Reporting Issues

- Use GitHub Issues
- Provide clear reproduction steps
- Include Chrome version and error messages
- Attach screenshots if relevant

## Questions?

Open a GitHub Discussion or reach out in Issues.

