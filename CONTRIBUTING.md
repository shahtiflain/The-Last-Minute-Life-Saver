# Contributing to Last-Minute Life Saver

Thank you for your interest in contributing! This project is maintained by the Antigravity Team.

## 1. Development Workflow
1. **Fork & Clone**: Fork the repository and clone it locally.
2. **Setup**: Follow the `docs/DEPLOYMENT_GUIDE.md` for local setup.
3. **Branch**: Create a new branch for your feature or bugfix.
4. **Develop**: Write your code.
5. **Verify**: Run tests and linters locally before pushing.
6. **Pull Request**: Open a PR against the `main` branch.

## 2. Coding Standards
* **Python (AI Orchestrator)**:
  * Strict typing enforced via `mypy`.
  * Linting enforced via `ruff`.
  * Always use Pydantic for data validation.
* **TypeScript (Frontend / Backend)**:
  * Strict mode must be enabled.
  * Use ESLint and Prettier for formatting.

## 3. Branch Naming Conventions
Please use the following prefixes for your branches:
* `feat/` for new features (e.g., `feat/slack-integration`)
* `fix/` for bug fixes (e.g., `fix/calendar-oauth-token`)
* `docs/` for documentation updates (e.g., `docs/api-reference-update`)
* `refactor/` for code refactoring (e.g., `refactor/orchestrator-loop`)

## 4. Pull Request Process
1. Ensure your PR description clearly states the problem being solved and the approach taken.
2. Link any relevant issue numbers in the PR description.
3. **CI/CD Gates**: All GitHub Actions (Tests, Linter, Build) must pass.
4. **Code Review**: At least one core maintainer must approve the PR before it can be merged.
5. **Explainable AI (XAI)**: If you modify an AI Agent's output schema, you MUST preserve or add the `whyAmISeeingThis` property to maintain our XAI standards.
