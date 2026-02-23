# Agent Workflows & Standards

This directory contains the "intelligence" logic for the project's AI Agents. Use this structure to share prompts, workflows, and skills across the team.

## Directory Structure

- **`workflows/`**: Deterministic, step-by-step procedures for common tasks (e.g., "Deploy to Staging", "New Component Feature").
  - **Format**: Markdown files with YAML frontmatter.
  - **Usage**: Agents can read these to execute complex processes reliably.

- **`skills/`**: Specialized capabilities or "tools" the agent can learn.
  - **Format**: Directories containing `SKILL.md` (instructions) and optional `scripts/`.
  - **Example**: `skills/database_migration/` containing SQL patterns and migration safety checks.

- **`rules/`**: Global behavioral rules and project preferences.
  - **Format**: Markdown files.
  - **Example**: `rules/coding_style.md` (Prefer TS types over interfaces, functional components, etc.).

## Best Practices

1. **No Secrets**: Never commit API keys or passwords here. Use environment variables.
2. **Review Changes**: Treat changes to agent behaviors like code changes—review them in PRs.
3. **Keep it Updated**: If the project architecture changes, update `ARCHITECTURE.md` and relevant workflows.

## ⚠️ Security Notice

Scripts in `skills/` may accept file paths as arguments. **Always:**

- Run scripts only on trusted inputs
- Avoid running with elevated privileges
- Review script source before first use
- Report suspicious behavior to the team

## How to Contribute

To add a new workflow:

1. Create `workflows/your-workflow-name.md`.
2. Define the steps clearly using numbered lists.
3. Add a description in the frontmatter.
