export interface VitePluginDotenvxOptions {
  /**
   * Enable the plugin
   * @default true
   */
  enabled?: boolean

  /**
   * Enable verbose logging
   * @default false
   */
  verbose?: boolean

  /**
   * Path to .env file(s)
   * @default ['.env']
   */
  path?: string | string[]

  /**
   * Path to .env.keys file
   * @default '.env.keys'
   */
  envKeysFile?: string

  /**
   * Override existing env variables
   * @default false
   */
  overload?: boolean

  /**
   * Load a .env convention (e.g., 'nextjs')
   */
  convention?: string

  /**
   * Apply the plugin in build mode as well
   * @default false
   */
  applyInBuild?: boolean

  /**
   * Exit with code 1 if any errors are encountered
   * @default false
   */
  strict?: boolean

  /**
   * Ignore specific errors
   */
  ignore?: string[]

  /**
   * Auto-generate .env.example file
   * @default false
   */
  generateExample?: boolean

  /**
   * Auto-add .env.keys to .gitignore
   * @default false
   */
  updateGitignore?: boolean

  /**
   * Expose specific environment variables to the client
   * Variables matching these patterns will be exposed to the client via import.meta.env
   * @default []
   */
  exposeToClient?: string[]
}
