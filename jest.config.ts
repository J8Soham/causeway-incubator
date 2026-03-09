import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest'

/**
 * Jest configuration for Angular + TypeScript using ESM mode.
 *
 * Key decisions:
 * - Uses `jest.config.ts` (standard since Jest v29) with ESM support via `ts-jest`.
 * - `jest-preset-angular` handles Angular-specific transforms.
 * - Enables ESM mode with `extensionsToTreatAsEsm` and `transform.useESM`.
 * - Supports `import.meta.env` via `ts-jest-mock-import-meta`.
 * - Transforms `.html` files and avoids ESM parsing issues in node_modules.
 *
 * References:
 * - ts-jest ESM guide: https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
 * - jest-preset-angular (Angular 13+): https://thymikee.github.io/jest-preset-angular/docs/guides/angular-13+
 */
const config: Config = {
  ...createDefaultEsmPreset(),
  // Required to handle ESM properly
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|js|html|mjs)$': [
      'jest-preset-angular',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    NG_APP_FIREBASE_API_KEY: 'mock-api-key',
                    NG_APP_FIREBASE_LOGS_API_KEY: 'mock-logs-api-key',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|@ngrx|rxjs|crypto-es)',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^.*environment$': '<rootDir>/src/environments/environment.test.ts',
    '^.*environment.prod$': '<rootDir>/src/environments/environment.test.ts',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '<rootDir>/src/environments/environment.test.ts',],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.spec.ts',
  ],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;