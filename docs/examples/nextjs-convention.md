# Next.js Convention Example

This example demonstrates how to use the Next.js convention for environment files with `vite-plugin-dotenvx`.

## Project Structure

```bash
my-vite-project/
├── .env                    # Base environment variables (loaded in all environments)
├── .env.local              # Local overrides (loaded in all environments, not committed)
├── .env.development        # Development environment variables
├── .env.development.local  # Local development overrides (not committed)
├── .env.production         # Production environment variables
├── .env.production.local   # Local production overrides (not committed)
├── .env.keys               # Your encryption keys (never commit this!)
├── vite.config.ts          # Vite configuration
├── src/
│   └── ...
└── package.json
```

## Environment Files

```bash
# .env (base variables for all environments)
APP_NAME="My Awesome App"
LOG_LEVEL="info"
```

```bash
# .env.development
API_URL="https://dev-api.example.com"
DEBUG="true"
```

```bash
# .env.production
API_URL="https://api.example.com"
DEBUG="false"
```

```bash
# .env.local (local overrides for all environments)
# This file is not committed to git
CUSTOM_SETTING="my-local-setting"
```

```bash
# .env.development.local (local overrides for development)
# This file is not committed to git
API_URL="http://localhost:3000/api"
```

## Vite Configuration

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import dotenvx from 'vite-plugin-dotenvx'

export default defineConfig({
  plugins: [
    vue(),
    dotenvx({
      // Use the Next.js convention for loading environment files
      convention: 'nextjs',
    }),
  ],
})
```

## How It Works

When you use the `convention: 'nextjs'` option, the plugin will load environment files in the following order:

1. `.env.${mode}.local` - Local overrides for the current environment
2. `.env.local` - Local overrides for all environments
3. `.env.${mode}` - Environment-specific variables
4. `.env` - Base variables for all environments

Variables from files loaded later will override variables from files loaded earlier.

## Running with Different Environments

```bash
# Development mode (default)
# Loads: .env.development.local, .env.local, .env.development, .env
npm run dev

# Production mode
# Loads: .env.production.local, .env.local, .env.production, .env
npm run dev -- --mode production

# Test mode
# Loads: .env.test.local, .env.local, .env.test, .env
npm run dev -- --mode test
```

## Usage in Your Code

```ts
// src/main.ts
console.log('App Name:', process.env.APP_NAME) // From .env
console.log('API URL:', process.env.API_URL) // From environment-specific .env or local override
console.log('Debug Mode:', process.env.DEBUG) // From environment-specific .env
console.log('Custom Setting:', process.env.CUSTOM_SETTING) // From .env.local
```

## Benefits of Using the Next.js Convention

1. **Consistent pattern** - If you're familiar with Next.js, you'll feel right at home
2. **Local overrides** - Easy to have local development settings without committing them
3. **Environment-specific settings** - Different settings for development, production, test, etc.
4. **Base settings** - Common settings shared across all environments

## Gitignore Recommendations

When using the Next.js convention, it's recommended to add the following to your `.gitignore` file:

```bash
# .gitignore
.env*.local
.env.keys
```

This ensures that your local overrides and encryption keys are not committed to your repository.
