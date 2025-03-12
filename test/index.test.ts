/* eslint-disable no-console */
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import * as fs from 'node:fs'
import { VitePluginDotenvx } from '../src/index'

// Define types for mocks
interface DotenvxResult {
  parsed: Record<string, string> | null
  error?: Error
}

// Define type for dotenvx options
interface DotenvxOptions {
  path?: string[]
  envKeysFile?: string
  convention?: string
  ignore?: string[]
  overload?: boolean
  strict?: boolean
}

// Define type for ConfigEnv
interface ConfigEnv {
  command: 'serve' | 'build'
  mode: string
}

// Helper function to call configResolved hook safely
function callConfigResolved(plugin: any, config: any = {}) {
  if (plugin.configResolved && typeof plugin.configResolved === 'object' && 'handler' in plugin.configResolved) {
    plugin.configResolved.handler(config)
  }
  else if (typeof plugin.configResolved === 'function') {
    plugin.configResolved(config)
  }
}

// Helper function to call config hook safely
function callConfig(plugin: any, config: any = {}, env: ConfigEnv = { command: 'serve', mode: 'development' }) {
  if (plugin.config && typeof plugin.config === 'object' && 'handler' in plugin.config) {
    plugin.config.handler(config, env)
  }
  else if (typeof plugin.config === 'function') {
    plugin.config(config, env)
  }
}

// Mock dotenvx
const mockDotenvx = {
  config: mock<(options?: DotenvxOptions) => DotenvxResult>(() => ({
    parsed: { TEST_VAR: 'test_value', ANOTHER_VAR: 'another_value' },
  })),
}

mock.module('@dotenvx/dotenvx', () => ({
  default: mockDotenvx,
}))

// Mock fs module
const mockFs = {
  existsSync: mock(() => true),
  readFileSync: mock(() => ''),
  writeFileSync: mock<(path: string | URL, content: string) => void>(() => {}),
}

mock.module('node:fs', () => ({
  ...fs,
  existsSync: mockFs.existsSync,
  readFileSync: mockFs.readFileSync,
  writeFileSync: mockFs.writeFileSync,
}))

// Mock console
const originalConsole = { ...console }
const mockConsole = {
  log: mock(() => {}),
  error: mock(() => {}),
}

describe('vite-plugin-dotenvx', () => {
  beforeEach(() => {
    // Reset mocks
    mockFs.existsSync.mockReset()
    mockFs.readFileSync.mockReset()
    mockFs.writeFileSync.mockReset()
    mockConsole.log.mockReset()
    mockConsole.error.mockReset()
    mockDotenvx.config.mockReset()

    // Default implementation
    mockDotenvx.config.mockImplementation(() => ({
      parsed: { TEST_VAR: 'test_value', ANOTHER_VAR: 'another_value' },
    }))

    // Mock console
    console.log = mockConsole.log as typeof console.log
    console.error = mockConsole.error as typeof console.error
  })

  afterEach(() => {
    // Restore console
    console.log = originalConsole.log as typeof console.log
    console.error = originalConsole.error as typeof console.error
  })

  it('should create a plugin with default options', () => {
    const plugin = VitePluginDotenvx({})

    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('vite-plugin-dotenvx')
    expect(plugin.enforce).toBe('pre')
  })

  it('should apply in serve mode by default', () => {
    const plugin = VitePluginDotenvx({})

    // Test apply function
    // @ts-expect-error - Testing apply function with spread operator
    const applyServe = plugin.apply(...[undefined, { command: 'serve' }])
    expect(applyServe).toBe(true)

    // @ts-expect-error - Testing apply function with spread operator
    const applyBuild = plugin.apply(...[undefined, { command: 'build' }])
    expect(applyBuild).toBe(false)
  })

  it('should apply in build mode when applyInBuild is true', () => {
    const plugin = VitePluginDotenvx({ applyInBuild: true })

    // Test apply function
    // @ts-expect-error - Testing apply function with spread operator
    const applyServe = plugin.apply(...[undefined, { command: 'serve' }])
    expect(applyServe).toBe(true)

    // @ts-expect-error - Testing apply function with spread operator
    const applyBuild = plugin.apply(...[undefined, { command: 'build' }])
    expect(applyBuild).toBe(true)
  })

  it('should load environment variables in configResolved hook', () => {
    const plugin = VitePluginDotenvx({ verbose: true })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Expect console.log to be called with debug message
    expect(mockConsole.log.mock.calls.length).toBeGreaterThan(0)
  })

  it('should not load environment variables when enabled is false', () => {
    const plugin = VitePluginDotenvx({ enabled: false })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Expect console.log not to be called
    expect(mockConsole.log.mock.calls.length).toBe(0)
  })

  it('should expose environment variables to client when exposeToClient is set', () => {
    const plugin = VitePluginDotenvx({
      exposeToClient: ['TEST_.*'],
    })

    // Call configResolved hook to load env vars
    callConfigResolved(plugin)

    // Create a mock config object
    const config: { define?: Record<string, string> } = {}

    // Call config hook
    callConfig(plugin, config)

    // Expect config.define to be set with the exposed env var
    expect(config.define).toBeDefined()
    expect(config.define?.['import.meta.env.TEST_VAR']).toBe('"test_value"')
  })

  it('should generate .env.example file when generateExample is true', () => {
    // Setup mock
    mockFs.writeFileSync.mockImplementation((filePath: string | URL, content: string) => {
      expect(filePath.toString()).toContain('.env.example')
      expect(content).toContain('TEST_VAR=""')
      expect(content).toContain('ANOTHER_VAR=""')
    })

    const plugin = VitePluginDotenvx({
      generateExample: true,
      verbose: true,
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Expect writeFileSync to be called
    expect(mockFs.writeFileSync.mock.calls.length).toBe(1)

    // Expect debug message to be logged
    const logCalls = mockConsole.log.mock.calls
    const generatedLogFound = logCalls.some(call =>
      call.some((arg: unknown) => typeof arg === 'string' && arg.includes('Generated .env.example')),
    )
    expect(generatedLogFound).toBe(true)
  })

  it('should update .gitignore when updateGitignore is true', () => {
    // Setup mocks
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readFileSync.mockReturnValue('# Some existing content')
    mockFs.writeFileSync.mockImplementation((filePath: string | URL, content: string) => {
      expect(filePath.toString()).toContain('.gitignore')
      expect(content).toContain('# dotenvx')
      expect(content).toContain('.env.keys')
    })

    const plugin = VitePluginDotenvx({
      updateGitignore: true,
      verbose: true,
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Expect writeFileSync to be called
    expect(mockFs.writeFileSync.mock.calls.length).toBe(1)

    // Expect debug message to be logged
    const logCalls = mockConsole.log.mock.calls
    const gitignoreLogFound = logCalls.some(call =>
      call.some((arg: unknown) => typeof arg === 'string' && arg.includes('Added .env.keys to .gitignore')),
    )
    expect(gitignoreLogFound).toBe(true)
  })

  it('should not update .gitignore if .env.keys is already included', () => {
    // Setup mocks
    mockFs.existsSync.mockReturnValue(true)
    mockFs.readFileSync.mockReturnValue('# Some existing content\n.env.keys')

    const plugin = VitePluginDotenvx({
      updateGitignore: true,
      verbose: true,
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Expect writeFileSync not to be called
    expect(mockFs.writeFileSync.mock.calls.length).toBe(0)

    // Expect debug message to be logged
    const logCalls = mockConsole.log.mock.calls
    const gitignoreLogFound = logCalls.some(call =>
      call.some((arg: unknown) => typeof arg === 'string' && arg.includes('already in .gitignore')),
    )
    expect(gitignoreLogFound).toBe(true)
  })

  it('should handle dotenvx errors gracefully when strict is false', () => {
    // Setup mock to return an error
    mockDotenvx.config.mockImplementation(() => ({
      error: new Error('Test error'),
      parsed: null,
    }))

    const plugin = VitePluginDotenvx({
      verbose: true,
      strict: false,
    })

    // This should not throw
    expect(() => callConfigResolved(plugin)).not.toThrow()

    // Expect error to be logged
    expect(mockConsole.error.mock.calls.length).toBe(1)

    // Check if any call contains the error message
    const errorCalls = mockConsole.error.mock.calls
    const errorFound = errorCalls.some(call =>
      call.some((arg: unknown) => typeof arg === 'string' && arg.includes('Error loading .env files')),
    )
    expect(errorFound).toBe(true)
  })

  it('should throw dotenvx errors when strict is true', () => {
    // Setup mock to return an error
    mockDotenvx.config.mockImplementation(() => ({
      error: new Error('Test error'),
      parsed: null,
    }))

    const plugin = VitePluginDotenvx({
      verbose: true,
      strict: true,
    })

    // This should throw
    expect(() => callConfigResolved(plugin)).toThrow()
  })

  it('should handle fs errors gracefully when generating .env.example', () => {
    // Setup mock to throw an error
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error('Test error')
    })

    const plugin = VitePluginDotenvx({
      generateExample: true,
    })

    // This should not throw
    expect(() => callConfigResolved(plugin)).not.toThrow()

    // Expect error to be logged
    expect(mockConsole.error.mock.calls.length).toBe(1)

    // Check if any call contains the error message
    const errorCalls = mockConsole.error.mock.calls
    const errorFound = errorCalls.some(call =>
      call.some((arg: unknown) => typeof arg === 'string' && arg.includes('Error generating .env.example')),
    )
    expect(errorFound).toBe(true)
  })

  it('should handle fs errors gracefully when updating .gitignore', () => {
    // Setup mock to throw an error
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error('Test error')
    })

    const plugin = VitePluginDotenvx({
      updateGitignore: true,
    })

    // This should not throw
    expect(() => callConfigResolved(plugin)).not.toThrow()

    // Expect error to be logged
    expect(mockConsole.error.mock.calls.length).toBe(1)

    // Check if any call contains the error message
    const errorCalls = mockConsole.error.mock.calls
    const errorFound = errorCalls.some(call =>
      call.some((arg: unknown) => typeof arg === 'string' && arg.includes('Error updating .gitignore')),
    )
    expect(errorFound).toBe(true)
  })

  it('should handle custom path option correctly', () => {
    const plugin = VitePluginDotenvx({
      path: ['.env.test', '.env.local'],
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Verify dotenvx.config was called with correct options
    expect(mockDotenvx.config.mock.calls.length).toBe(1)

    // Safe access to mock calls
    const mockCall = mockDotenvx.config.mock.calls[0] as unknown[]
    const mockOptions = mockCall?.[0] as DotenvxOptions | undefined
    expect(mockOptions).toBeDefined()
    expect(mockOptions?.path).toEqual(['.env.test', '.env.local'])
  })

  it('should handle string path option correctly', () => {
    const plugin = VitePluginDotenvx({
      path: '.env.test',
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Verify dotenvx.config was called with correct options
    expect(mockDotenvx.config.mock.calls.length).toBe(1)

    // Safe access to mock calls
    const mockCall = mockDotenvx.config.mock.calls[0] as unknown[]
    const mockOptions = mockCall?.[0] as DotenvxOptions | undefined
    expect(mockOptions).toBeDefined()
    expect(mockOptions?.path).toEqual(['.env.test'])
  })

  it('should handle envKeysFile option correctly', () => {
    const plugin = VitePluginDotenvx({
      envKeysFile: 'custom.env.keys',
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Verify dotenvx.config was called with correct options
    expect(mockDotenvx.config.mock.calls.length).toBe(1)

    // Safe access to mock calls
    const mockCall = mockDotenvx.config.mock.calls[0] as unknown[]
    const mockOptions = mockCall?.[0] as DotenvxOptions | undefined
    expect(mockOptions).toBeDefined()
    expect(mockOptions?.envKeysFile).toBe('custom.env.keys')
  })

  it('should handle convention option correctly', () => {
    const plugin = VitePluginDotenvx({
      convention: 'nextjs',
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Verify dotenvx.config was called with correct options
    expect(mockDotenvx.config.mock.calls.length).toBe(1)

    // Safe access to mock calls
    const mockCall = mockDotenvx.config.mock.calls[0] as unknown[]
    const mockOptions = mockCall?.[0] as DotenvxOptions | undefined
    expect(mockOptions).toBeDefined()
    expect(mockOptions?.convention).toBe('nextjs')
  })

  it('should handle ignore option correctly', () => {
    const plugin = VitePluginDotenvx({
      ignore: ['SOME_ERROR'],
    })

    // Call configResolved hook
    callConfigResolved(plugin)

    // Verify dotenvx.config was called with correct options
    expect(mockDotenvx.config.mock.calls.length).toBe(1)

    // Safe access to mock calls
    const mockCall = mockDotenvx.config.mock.calls[0] as unknown[]
    const mockOptions = mockCall?.[0] as DotenvxOptions | undefined
    expect(mockOptions).toBeDefined()
    expect(mockOptions?.ignore).toEqual(['SOME_ERROR'])
  })

  it('should not expose environment variables to client when exposeToClient is empty', () => {
    const plugin = VitePluginDotenvx({
      exposeToClient: [],
    })

    // Call configResolved hook to load env vars
    callConfigResolved(plugin)

    // Create a mock config object
    const config: { define?: Record<string, string> } = {}

    // Call config hook
    callConfig(plugin, config)

    expect(config.define).toBeUndefined()
  })

  it('should not modify config when no env vars are loaded', () => {
    // Setup mock to return empty parsed result
    mockDotenvx.config.mockImplementation(() => ({
      parsed: {},
    }))

    const plugin = VitePluginDotenvx({
      exposeToClient: ['TEST_.*'],
    })

    // Call configResolved hook to load env vars
    callConfigResolved(plugin)

    // Create a mock config object
    const config: { define?: Record<string, string> } = {}

    // Call config hook
    callConfig(plugin, config)

    // Expect config.define to be undefined
    expect(config.define).toBeUndefined()
  })
})
