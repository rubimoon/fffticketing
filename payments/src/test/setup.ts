import { dbHandler } from './db-handler';
import { setupEnv } from './globalSetup';
import { generateSessionData } from './test-data-generators/ui';

jest.mock('../nats-wrapper.ts');
setupEnv();

beforeAll(async () => {
  await dbHandler.createDb();
  await dbHandler.connectDb();
});

beforeEach(async () => {
  jest.clearAllMocks();
  await dbHandler.cleanupDb();
});

afterAll(async () => {
  await dbHandler.dropDb();
});

declare global {
  function signin(id?: string): string[];
}

global.signin = generateSessionData;
