<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# vite-plugin-dotenvx

> A Vite plugin to seamlessly integrate with dotenvx.

## Features

- 🔐 **Decryption** _Automatically decrypts encrypted .env files using dotenvx_
- 🌍 **Multi Env** _Supports multiple .env files & environment-specific configurations_
- 🔄 **Variables** _Supports variable expansion & command substitution in your .env files_
- 🏗️ **Build-Ready** _Works in both development & build modes with configurable options_
- 📝 **Dev Tools** _Auto-generates .env.example files & updates .gitignore automatically_
- 🔌 **Client Access** _Selectively expose environment variables to client-side code_
- 🛡️ **Security** _Configurable error handling with strict mode & flexible configuration_

## Install

```bash
npm install -D vite-plugin-dotenvx
# or
yarn add -D vite-plugin-dotenvx
# or
pnpm add -D vite-plugin-dotenvx
# or
bun add -D vite-plugin-dotenvx
```

## Get Started

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Dotenvx from 'vite-plugin-dotenvx'

export default defineConfig({
  plugins: [
    Dotenvx({
      enabled: true, // default: true
      verbose: true, // default: false, enables detailed logging
      path: ['.env', '.env.local'], // default: ['.env']
      envKeysFile: '.env.keys', // default: '.env.keys'
      overload: false, // default: false
      convention: 'nextjs', // optional, load envs using a convention like Next.js
    })
  ]
})
```

### Advanced Configuration

Here's an example with all available options:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Dotenvx from 'vite-plugin-dotenvx'

export default defineConfig({
  plugins: [
    Dotenvx({
      // Basic options
      enabled: true,
      verbose: true,
      path: ['.env.local', '.env'],
      envKeysFile: '.env.keys',
      overload: false,
      convention: 'nextjs',

      // Advanced options
      applyInBuild: true, // Apply in build mode as well
      strict: true, // Exit with code 1 if any errors are encountered
      ignore: ['MISSING_ENV_FILE'], // Ignore specific errors
      generateExample: true, // Auto-generate .env.example file
      updateGitignore: true, // Auto-add .env.keys to .gitignore
      exposeToClient: ['VITE_.*', 'PUBLIC_.*'], // Expose specific variables to client
    })
  ]
})
```

## Usage with dotenvx

This plugin integrates with [dotenvx](https://github.com/dotenvx/dotenvx), a better dotenv from the creator of `dotenv`. It automatically decrypts encrypted .env files during development.

### Encrypting your .env files

Given you installed `vite-plugin-dotenvx`, you may run the following command to encrypt your .env files:

```bash
bunx dotenvx encrypt
```

This will encrypt your .env file and create a .env.keys file with the encryption keys.

### Using encrypted .env files

The plugin will automatically decrypt your encrypted .env files during development. No additional configuration is needed.

### VS Code Extension

For the best development experience, we recommend installing the [dotenvx VS Code extension](https://marketplace.visualstudio.com/items?itemName=dotenv.dotenvx-vscode). This extension provides syntax highlighting, encryption/decryption features, and other helpful tools directly in your editor.

```bash
# Install from VS Code marketplace
code --install-extension dotenv.dotenvx-vscode
```

Or search for "dotenvx" in the VS Code extensions marketplace.

For more information on dotenvx, visit [dotenvx.com](https://dotenvx.com).

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable or disable the plugin |
| `verbose` | `boolean` | `false` | Enable verbose logging |
| `path` | `string \| string[]` | `['.env']` | Path to .env file(s) |
| `envKeysFile` | `string` | `'.env.keys'` | Path to .env.keys file |
| `overload` | `boolean` | `false` | Override existing env variables |
| `convention` | `string` | `undefined` | Load a .env convention (e.g., 'nextjs') |
| `applyInBuild` | `boolean` | `false` | Apply the plugin in build mode as well |
| `strict` | `boolean` | `false` | Exit with code 1 if any errors are encountered |
| `ignore` | `string[]` | `undefined` | Ignore specific errors |
| `generateExample` | `boolean` | `false` | Auto-generate .env.example file |
| `updateGitignore` | `boolean` | `false` | Auto-add .env.keys to .gitignore |
| `exposeToClient` | `string[]` | `[]` | Expose specific environment variables to the client |

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stacksjs/vite-plugin-dotenvx/releases) page for more information on what has changed recently.

## Contributing

Please review the [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/stacks/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where `vite-plugin-dotenvx` is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

- [Mot](https://github.com/motdotla) for creating [dotenv](https://github.com/motdotla/dotenv) & [dotenvx](https://github.com/dotenvx/dotenvx)
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/vite-plugin-dotenvx/contributors)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/stacks/tree/main/LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/vite-plugin-dotenvx?style=flat-square
[npm-version-href]: https://npmjs.com/package/vite-plugin-dotenvx
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/vite-plugin-dotenvx/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/vite-plugin-dotenvx/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/vite-plugin-dotenvx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/vite-plugin-dotenvx -->
