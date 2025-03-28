# ESLint Integration with i18next

A CLI tool to run ESLint with i18next and React configurations for internationalization linting.

## Installation

```bash
# Install dependencies
bun install

# Link CLI globally (optional)
bun link
```

## Usage

Run the CLI directly:

```bash
bun run lint <directory>
```

Or if globally linked:

```bash
i18n-lint <directory>
```

### Options

- `-f, --format <format>`: Output format (json, text). Default: text.

## Examples

```bash
# Lint a directory with default text output
bun run lint ./my-project

# Lint and get JSON output
bun run lint ./my-project --format json

# Lint using the globally linked command
i18n-lint ./my-project
```

## Build

To build a standalone executable:

```bash
bun run build
```

This will create a build in the `dist` directory.
