# Auto-Generation Example

This example demonstrates how to use the auto-generation features of `vite-plugin-dotenvx` to create `.env.example` files and update your `.gitignore`.

## Project Structure

```bash
my-vite-project/
├── .env                 # Your environment variables
├── .env.keys            # Your encryption keys
├── .env.example         # Auto-generated example file
├── .gitignore           # Auto-updated gitignore file
├── vite.config.ts       # Vite configuration
├── src/
│   └── ...
└── package.json
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
      // Auto-generate .env.example file
      generateExample: true,

      // Auto-update .gitignore to include .env.keys
      updateGitignore: true,
    }),
  ],
})
```

## Original .env File

```bash
# .env
API_KEY="encrypted:BDqDBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
DATABASE_URL="encrypted:CErEBibm4wsYqMpCjTQ6BsDHmMadg9K3dAt+Z9HPMfLEIRVz50hmLXPXRuDBXaJi..."
DEBUG="true"
APP_NAME="My Awesome App"
VITE_API_URL="https://api.example.com"
```

## Auto-Generated .env.example File

When you run your Vite dev server with the `generateExample: true` option, the plugin will automatically generate a `.env.example` file with all the keys from your `.env` file but with empty values:

```bash
# .env.example
API_KEY=""
DATABASE_URL=""
DEBUG=""
APP_NAME=""
VITE_API_URL=""
```

This makes it easy for other developers to know which environment variables they need to set up.

## Auto-Updated .gitignore File

When you run your Vite dev server with the `updateGitignore: true` option, the plugin will automatically add `.env.keys` to your `.gitignore` file if it's not already there:

```bash
# .gitignore
node_modules
dist
.DS_Store
.env.keys  # Auto-added by vite-plugin-dotenvx
```

This helps ensure that your encryption keys are never accidentally committed to your repository.

## Customizing the Example File

You can customize the auto-generated example file by providing a template:

```ts
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'
import dotenvx from 'vite-plugin-dotenvx'

export default defineConfig({
  plugins: [
    vue(),
    dotenvx({
      generateExample: {
        // Custom path for the example file
        path: '.env.template',

        // Custom template function
        template: (key, value) => {
          // Add comments or default values based on the key
          if (key === 'API_KEY')
            return `${key}="your-api-key-here" # Get from developer portal`
          if (key === 'DEBUG')
            return `${key}="false" # Set to true for verbose logging`

          // Default template
          return `${key}=""`
        },
      },
    }),
  ],
})
```

This would generate a file like:

```bash
# .env.template
API_KEY="your-api-key-here" # Get from developer portal
DATABASE_URL=""
DEBUG="false" # Set to true for verbose logging
APP_NAME=""
VITE_API_URL=""
```

## Benefits of Auto-Generation

1. **Documentation** - New developers can quickly see which environment variables they need to set
2. **Security** - Helps prevent accidental commits of sensitive information
3. **Consistency** - Ensures that all required environment variables are documented
4. **Automation** - Reduces manual work and potential for human error

## Best Practices

1. **Commit the example file** - Make sure to commit the `.env.example` file to your repository
2. **Don't commit the keys file** - Never commit the `.env.keys` file to your repository
3. **Update the example when adding new variables** - When you add new environment variables, regenerate the example file
4. **Use descriptive comments** - Add comments to your example file to help other developers understand what each variable is for
