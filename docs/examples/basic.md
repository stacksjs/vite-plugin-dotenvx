# Basic Usage Example

This example demonstrates the most basic setup for using `vite-plugin-dotenvx` in a Vite project.

## Project Structure

```bash
my-vite-project/
├── .env                 # Your environment variables
├── .env.keys            # Your encryption keys (never commit this!)
├── vite.config.ts       # Vite configuration
├── src/
│   └── ...
└── package.json
```

## .env File

```bash
# .env
API_KEY="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
DATABASE_URL="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
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
    dotenvx(), // Using default options
  ],
})
```

## Usage in Your Code

```ts
// src/main.ts
console.log('API Key:', import.meta.env.VITE_API_KEY) // Only VITE_* variables are exposed to client by default
```

## How It Works

1. When you start your Vite dev server, the plugin automatically loads and decrypts your `.env` file
2. The decrypted environment variables are available in your server-side code
3. Variables prefixed with `VITE_` are also available in your client-side code via `import.meta.env`

## Next Steps

For more advanced usage, check out the [Multiple Environments](/examples/multiple-environments) example or the [Client-Side Variables](/examples/client-side) example.
