![Social Card of this repo](https://github.com/stacksjs/vite-plugin-dotenvx/blob/main/.github/art/cover.jpg?raw=true)

# Introduction

`vite-plugin-dotenvx` is a Vite plugin that seamlessly integrates with dotenvx to automatically decrypt your .env files during development.

## Features

- Automatic .env Decryption
- Multiple Environment Support
- Variable Expansion and Command Substitution
- Support for Build Mode
- Auto-generation of .env.example Files
- Auto-updating of .gitignore
- Client-side Environment Variable Exposure
- Strict Mode and Error Handling
- Lightweight and Configurable

> A Vite plugin to seamlessly integrate with dotenvx for automatic decryption of .env files.

## What is dotenvx

[dotenvx](https://dotenvx.com) is a better dotenv from the creator of the original `dotenv` package. It provides:

- Cross-platform compatibility (run anywhere)
- Multi-environment support
- Encrypted environment variables

This plugin integrates with dotenvx to provide a seamless experience for Vite users, automatically decrypting your encrypted .env files during development.

## How It Works

1. **Encrypt your .env files** - Use the dotenvx CLI to encrypt your .env files
2. **Add the plugin to your Vite config** - Configure the plugin with your desired options
3. **Start your Vite dev server** - The plugin automatically decrypts your .env files at runtime

The plugin handles all the complexity of decryption, making it easy to use encrypted .env files in your Vite projects.

## Advanced Features

### Build Mode Support

By default, the plugin only runs in development mode. You can enable it for build mode as well:

```ts
Dotenvx({
  applyInBuild: true,
  // ...other options
})
```

### Auto-generate .env.example

The plugin can automatically generate a `.env.example` file from your loaded environment variables:

```ts
Dotenvx({
  generateExample: true,
  // ...other options
})
```

### Auto-update .gitignore

The plugin can automatically add `.env.keys` to your `.gitignore` file:

```ts
Dotenvx({
  updateGitignore: true,
  // ...other options
})
```

### Expose Environment Variables to the Client

You can expose specific environment variables to the client-side code:

```ts
Dotenvx({
  exposeToClient: ['VITE_._', 'PUBLIC_._'],
  // ...other options
})
```

### Strict Mode

Enable strict mode to throw errors when environment variables can't be loaded:

```ts
Dotenvx({
  strict: true,
  // ...other options
})
```

## Community & Support

- [GitHub Discussions](https://github.com/stacksjs/vite-plugin-dotenvx/discussions) for questions & help
- [Discord Community](https://discord.gg/stacksjs) for real-time chat
- [GitHub Issues](https://github.com/stacksjs/vite-plugin-dotenvx/issues) for bugs & feature requests

## Stargazers

[![Stargazers](https://starchart.cc/stacksjs/vite-plugin-dotenvx.svg?variant=adaptive)](https://starchart.cc/stacksjs/vite-plugin-dotenvx)

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/stacksjs/stacks/blob/main/.github/CONTRIBUTING.md) for details.

## Postcardware

Two things are true: Stacks OSS will always stay open-source, and we do love to receive postcards from wherever Stacks is used! _We also publish them on our website._

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

- [Mot](https://github.com/motdotla) for creating [dotenv](https://github.com/motdotla/dotenv) & [dotenvx](https://github.com/dotenvx/dotenvx)
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/vite-plugin-dotenvx/contributors)

## License

The MIT License (MIT). Please see [LICENSE](/license) for more information.

Made with 💙
