# Install

Installing `vite-plugin-dotenvx` is easy. Simply pull it in via your package manager of choice.

::: code-group

```bash [npm]
npm install --save-dev vite-plugin-dotenvx

# or, install via
# npm i -d vite-plugin-dotenvx
```

```bash [bun]
bun install --dev vite-plugin-dotenvx

# or, install via
# bun add --dev vite-plugin-dotenvx
# bun i -d vite-plugin-dotenvx
```

```bash [pnpm]
pnpm add --save-dev vite-plugin-dotenvx

# or, install via
# pnpm i -d vite-plugin-dotenvx
```

```bash [yarn]
yarn add --dev vite-plugin-dotenvx

# or, install via
# yarn i -d vite-plugin-dotenvx
```

:::

## Basic Usage

This minimal usage example shows how to use `vite-plugin-dotenvx` in your Vite configuration, using the plugin's default settings.

```javascript
// vite.config.{js,ts}
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dotenvx from 'vite-plugin-dotenvx'

export default defineConfig({
  plugins: [
    vue(), // svelte(), react(), ...
    dotenvx(),
  ],
})
```

With this minimal configuration, the plugin will automatically:

1. Look for a `.env` file in your project root
2. Decrypt any encrypted variables using keys from `.env.keys`
3. Load the environment variables into your Vite development server

To read about the more elaborate usage API, check out the [usage](/usage) page in our documentation.
