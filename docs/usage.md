# Usage

Using this plugin is as simple as defining it in your Vite configuration.

```ts
// vite.config.{ts,js}
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
      applyInBuild: false, // default: false, apply the plugin in build mode as well
      strict: false, // default: false, exit with code 1 if any errors are encountered
      ignore: ['MISSING_ENV_FILE'], // optional, ignore specific errors
      generateExample: false, // default: false, auto-generate .env.example file
      updateGitignore: false, // default: false, auto-add .env.keys to .gitignore
      exposeToClient: ['VITE_.*', 'PUBLIC_.*'], // optional, expose specific environment variables to the client
    })
  ]
})
```

## Configuration Options

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

## Working with Encrypted .env Files

### Encrypting Your .env Files

To encrypt your .env files, you'll need to use the dotenvx CLI:

```bash
# Create a .env file
echo "API_KEY=your_secret_key" > .env

# Encrypt the .env file
dotenvx encrypt
```

This will encrypt your .env file and create a `.env.keys` file with the encryption keys. The encrypted .env file will look something like this:

```bash
#/-------------------[DOTENV_PUBLIC_KEY]--------------------/
#/            public-key encryption for .env files          /
#/       [how it works](https://dotenvx.com/encryption)     /
#/----------------------------------------------------------/
DOTENV_PUBLIC_KEY="03a1..."
# .env
API_KEY="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
```

### Environment-Specific .env Files

You can create environment-specific .env files like `.env.production` or `.env.staging`:

```bash
# Create environment-specific .env files
echo "API_KEY=production_key" > .env.production
echo "API_KEY=staging_key" > .env.staging

# Encrypt them
dotenvx encrypt -f .env.production
dotenvx encrypt -f .env.staging
```

To use these files, specify them in your Vite config:

```ts
Dotenvx({
  path: ['.env', '.env.production'],
  // ...other options
})
```

### Using Multiple .env Files

You can load multiple .env files in order of priority:

```ts
Dotenvx({
  path: ['.env.local', '.env'],
  // ...other options
})
```

By default, variables from the first file take precedence. If you want later files to override earlier ones, set `overload: true`.

### Using Next.js Convention

If you're familiar with Next.js' .env file convention, you can use it with:

```ts
Dotenvx({
  convention: 'nextjs',
  // ...other options
})
```

This will load files in the following order:

1. `.env.development.local`
2. `.env.local`
3. `.env.development`
4. `.env`

### Exposing Environment Variables to the Client

By default, environment variables are only available on the server. To expose specific variables to the client:

```ts
Dotenvx({
  exposeToClient: ['VITE_.*', 'PUBLIC_.*'],
  // ...other options
})
```

This will make any environment variables that match the patterns available in your client-side code via `import.meta.env`.

### Auto-generating .env.example

You can automatically generate a `.env.example` file from your loaded environment variables:

```ts
Dotenvx({
  generateExample: true,
  // ...other options
})
```

This will create a `.env.example` file with all the keys from your .env files but with empty values.

### Auto-updating .gitignore

You can automatically add `.env.keys` to your `.gitignore` file:

```ts
Dotenvx({
  updateGitignore: true,
  // ...other options
})
```

This ensures that your private keys are never committed to your repository.

## Security Best Practices

1. **Add `.env.keys` to your `.gitignore`** - Never commit your private keys to your repository
2. **Commit encrypted .env files** - It's safe to commit encrypted .env files to your repository
3. **Use environment-specific keys** - Use different keys for different environments
4. **Rotate keys periodically** - Use `dotenvx rotate` to rotate your encryption keys
5. **Use strict mode in production** - Enable strict mode to ensure all required variables are available

For more information on dotenvx, visit [dotenvx.com](https://dotenvx.com).
