import { test as base, APIRequestContext, expect } from '@playwright/test';

// Define custom fixtures
type MyFixtures = {
  apiHelper: APIRequestContext;
  authHelper: { login: () => Promise<string> };
};

export const test = base.extend<MyFixtures>({
  // Custom API helper
  apiHelper: async ({ request }, use) => {
    // You can set up global headers or tokens here
    await use(request);
  },
  
  // Custom Auth Helper
  authHelper: async ({ request }, use) => {
    const helper = {
      login: async () => {
        // Mock or actual login to get token
        // const res = await request.post('/api/v1/auth/login', { data: { username: 'test', password: 'password' } });
        // const { token } = await res.json();
        // return token;
        return 'mock_token_123';
      }
    };
    await use(helper);
  }
});

export { expect };
