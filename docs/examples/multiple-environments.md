# Multiple Environments Example

This example demonstrates how to use `vite-plugin-dotenvx` with multiple environment configurations.

## Project Structure

```bash
my-vite-project/
├── .env                 # Base environment variables (for all environments)
├── .env.development     # Development-specific variables
├── .env.staging         # Staging-specific variables
├── .env.production      # Production-specific variables
├── .env.local           # Local overrides (not committed to git)
├── .env.keys            # Your encryption keys (never commit this!)
├── vite.config.ts       # Vite configuration
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
API_URL="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
DEBUG="true"
```

```bash
# .env.staging
API_URL="encrypted:CErEBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
DEBUG="false"
```

```bash
# .env.production
API_URL="encrypted:DFtFBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
DEBUG="false"
```

## Vite Configuration

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import dotenvx from 'vite-plugin-dotenvx'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      dotenvx({
        // Load base .env file and environment-specific file
        path: ['.env', `.env.${mode}`, '.env.local'],
        // Variables from later files will override earlier ones
        overload: true,
      }),
    ],
  }
})
```

## Usage in Your Code

```ts
// src/main.ts
console.log('App Name:', process.env.APP_NAME) // From base .env
console.log('API URL:', process.env.API_URL) // From environment-specific .env
console.log('Debug Mode:', process.env.DEBUG) // From environment-specific .env
```

## Running with Different Environments

```bash
# Development mode (default)
npm run dev

# Staging mode
npm run dev -- --mode staging

# Production mode
npm run dev -- --mode production
```

## Build with Different Environments

```bash
# Development build
npm run build

# Staging build
npm run build -- --mode staging

# Production build
npm run build -- --mode production
```

## Using Next.js Convention

If you prefer to use the Next.js convention for environment files, you can use the `convention` option:

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import dotenvx from 'vite-plugin-dotenvx'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      dotenvx({
        convention: 'nextjs',
      }),
    ],
  }
})
```

This will load files in the following order:

1. `.env.${mode}.local`
2. `.env.local`
3. `.env.${mode}`
4. `.env`

For more details on the Next.js convention, see the [Next.js Convention](/examples/nextjs-convention) example.
