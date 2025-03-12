import type { Plugin } from 'vite'
import type { VitePluginDotenvxOptions } from './types'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'
import dotenvx from '@dotenvx/dotenvx'
import { version } from '../package.json'

/**
 * Vite plugin for dotenvx integration
 * Automatically decrypts .env files and provides additional dotenvx functionality
 *
 * @param options - Configuration options for the plugin
 * @returns A Vite plugin
 */
export function VitePluginDotenvx(options: VitePluginDotenvxOptions): Plugin {
  const {
    enabled = true,
    verbose = false,
    path: envPath = ['.env'],
    envKeysFile,
    overload = false,
    convention,
    applyInBuild = false,
    strict = false,
    ignore,
    generateExample = false,
    updateGitignore = false,
    exposeToClient = [],
  } = options

  let originalConsole: typeof console
  let loadedEnv: Record<string, string> = {}

  const debug = (...args: any[]) => {
    if (verbose)
      originalConsole.log(`[vite-plugin-dotenvx@${version}]`, ...args)
  }

  /**
   * Add .env.keys to .gitignore file
   */
  const addToGitignore = () => {
    try {
      const gitignorePath = path.resolve(process.cwd(), '.gitignore')
      let content = ''

      if (fs.existsSync(gitignorePath)) {
        content = fs.readFileSync(gitignorePath, 'utf8')

        // Check if .env.keys is already in .gitignore
        if (content.includes('.env.keys')) {
          debug('.env.keys already in .gitignore')
          return
        }
      }

      // Append .env.keys to .gitignore
      fs.writeFileSync(gitignorePath, `${content}\n# dotenvx\n.env.keys\n`)
      debug('Added .env.keys to .gitignore')
    }
    catch (error) {
      console.error('[vite-plugin-dotenvx] Error updating .gitignore:', error)
    }
  }

  /**
   * Generate .env.example file from .env files
   */
  const generateEnvExample = () => {
    try {
      // We'll create a .env.example file with empty values for each key in the loaded env
      if (Object.keys(loadedEnv).length > 0) {
        const examplePath = path.resolve(process.cwd(), '.env.example')
        const content = Object.keys(loadedEnv)
          .map(key => `${key}=""`)
          .join('\n')

        fs.writeFileSync(examplePath, content)
        debug('Generated .env.example file')
      }
    }
    catch (error) {
      console.error('[vite-plugin-dotenvx] Error generating .env.example:', error)
    }
  }

  /**
   * Load environment variables from .env files
   */
  const loadEnvFiles = () => {
    try {
      // Configure dotenvx options
      const dotenvxOptions: any = {
        overload,
        strict,
      }

      // Handle path option
      if (envPath) {
        dotenvxOptions.path = Array.isArray(envPath) ? envPath : [envPath]
      }

      // Handle envKeysFile option
      if (envKeysFile) {
        dotenvxOptions.envKeysFile = envKeysFile
      }

      // Handle convention option
      if (convention) {
        dotenvxOptions.convention = convention
      }

      // Handle ignore option
      if (ignore) {
        dotenvxOptions.ignore = ignore
      }

      // Load and decrypt .env files
      const result = dotenvx.config(dotenvxOptions)

      if (result.error) {
        console.error('[vite-plugin-dotenvx] Error loading .env files:', result.error)
        if (strict) {
          throw result.error
        }
      }
      else {
        debug('Loaded environment variables from:', dotenvxOptions.path.join(', '))

        if (verbose && result.parsed) {
          const loadedVars = Object.keys(result.parsed).length
          debug(`Loaded ${loadedVars} environment variables`)
        }

        // Store loaded environment variables
        loadedEnv = result.parsed || {}
      }
    }
    catch (error) {
      console.error('[vite-plugin-dotenvx] Error:', error)
      if (strict) {
        throw error
      }
    }
  }

  return {
    name: 'vite-plugin-dotenvx',
    enforce: 'pre',
    apply: (_, { command }) => {
      // Apply in serve mode, and in build mode if applyInBuild is true
      return command === 'serve' || (command === 'build' && applyInBuild)
    },

    configResolved(_resolvedConfig) {
      // Skip if not enabled
      if (!enabled)
        return

      originalConsole = { ...console }

      // Load environment variables
      loadEnvFiles()

      // Generate .env.example file if requested
      if (generateExample) {
        generateEnvExample()
      }

      // Update .gitignore if requested
      if (updateGitignore) {
        addToGitignore()
      }
    },

    config(config) {
      if (!enabled || Object.keys(loadedEnv).length === 0)
        return

      // Expose specific environment variables to the client
      if (exposeToClient.length > 0) {
        config.define = config.define || {}

        // Filter environment variables based on patterns
        const envToExpose: Record<string, string> = {}

        for (const key of Object.keys(loadedEnv)) {
          for (const pattern of exposeToClient) {
            if (key.match(new RegExp(pattern))) {
              envToExpose[`import.meta.env.${key}`] = JSON.stringify(loadedEnv[key])
              break
            }
          }
        }

        // Merge with existing define
        Object.assign(config.define, envToExpose)

        debug(`Exposed ${Object.keys(envToExpose).length} environment variables to the client`)
      }
    },
  }
}

export default VitePluginDotenvx
