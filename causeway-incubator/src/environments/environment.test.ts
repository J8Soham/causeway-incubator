// This file is used when running tests with Jest.

export const environment = {
  production: false,
  mockDB: true,
  firebase: {
    apiKey: 'mock-api-key',
  },
  firebaseLogs: {
    apiKey: 'mock-logs-api-key',
  },
};