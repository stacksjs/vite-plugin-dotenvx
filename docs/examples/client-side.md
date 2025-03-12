# Client-Side Variables Example

This example demonstrates how to expose specific environment variables to your client-side code using `vite-plugin-dotenvx`.

## Project Structure

```bash
my-vite-project/
├── .env                 # Your environment variables
├── .env.keys            # Your encryption keys (never commit this!)
├── vite.config.ts       # Vite configuration
├── src/
│   ├── main.ts
│   └── App.vue
└── package.json
```

## .env File

```bash
# .env

# Server-side only variables (not exposed to client)
DATABASE_URL="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
API_SECRET="encrypted:CErEBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."

# Client-side variables (will be exposed to client)
VITE_API_URL="https://api.example.com"
VITE_APP_VERSION="1.0.0"
PUBLIC_FEATURE_FLAGS="{"darkMode":true,"betaFeatures":false}"
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
      // Expose variables with these prefixes to the client
      exposeToClient: ['VITE_.*', 'PUBLIC_.*'],
    }),
  ],
})
```

## Usage in Client-Side Code

```vue
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'

// Access environment variables via import.meta.env
const appName = 'My App'
const version = import.meta.env.VITE_APP_VERSION
const apiUrl = import.meta.env.VITE_API_URL

// Parse JSON from environment variable
const featureFlags = JSON.parse(import.meta.env.PUBLIC_FEATURE_FLAGS)

const isDarkMode = ref(false)
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
}
</script>

<template>
  <div>
    <h1>{{ appName }}</h1>
    <p>Version: {{ version }}</p>
    <p>API URL: {{ apiUrl }}</p>
    <button v-if="featureFlags.darkMode" @click="toggleDarkMode">
      Toggle Dark Mode
    </button>
  </div>
</template>
```

## Security Considerations

1. **Never expose sensitive information** to the client. Variables exposed to the client will be included in your JavaScript bundle and visible to anyone who views your source code.

2. **Use prefixes consistently** to make it clear which variables are exposed to the client:
   - `VITE_` is the default prefix recognized by Vite
   - `PUBLIC_` is another common convention

3. **Be careful with JSON values** in environment variables. Make sure they are properly formatted and escaped.

## Custom Prefix Example

If you want to use a different prefix for client-side variables:

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import dotenvx from 'vite-plugin-dotenvx'

export default defineConfig({
  // Define custom env prefix for Vite
  envPrefix: 'FRONTEND_',

  plugins: [
    vue(),
    dotenvx({
      // Expose variables with these prefixes to the client
      exposeToClient: ['FRONTEND_.*'],
    }),
  ],
})
```

Then in your `.env` file:

```bash
# .env

# Server-side only variables
DATABASE_URL="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."

# Client-side variables with custom prefix
FRONTEND_API_URL="https://api.example.com"
FRONTEND_APP_VERSION="1.0.0"
```

And in your client code:

```js
// Access with custom prefix
const apiUrl = import.meta.env.FRONTEND_API_URL
const version = import.meta.env.FRONTEND_APP_VERSION
```
