import { guardWithTolerance } from '@/typeguards/guardWithTolerance';
import { isNumeric } from '@/typeguards/isNumeric';
import { toNumber } from '@/converters/toNumber';
import {
  createApiResponseGuard,
  invalidApiResponse,
  parseJsonPayload,
  validApiResponse,
  type ApiResponse,
  type User,
} from './fixtures/api-response';

describe('integration: API validation workflow', () => {
  const isApiResponse = createApiResponseGuard();

  it('validates a realistic JSON API payload end-to-end', () => {
    const raw = JSON.stringify(validApiResponse);
    const payload = parseJsonPayload(raw);

    expect(isApiResponse(payload)).toBe(true);

    if (isApiResponse(payload)) {
      expect(payload.data.users).toHaveLength(2);
      expect(payload.data.users[0]?.role).toBe('admin');
      expect(payload.data.users[1]?.profile).toBeUndefined();
    }
  });

  it('collects leaf-path errors for partially invalid nested payloads', () => {
    const errors: string[] = [];
    const config = {
      identifier: 'response',
      callbackOnError: (message: string) => errors.push(message),
    };

    const result = isApiResponse(invalidApiResponse, config);

    expect(result).toBe(false);
    expect(errors).toEqual([
      'Expected response.data.users[1].id ("2") to be "number"; Expected response.data.users[1].role ("superadmin") to be "unknown"; Expected response.data.meta.page ("1") to be "number"',
    ]);
  });

  it('supports tolerant migration while logging validation issues', () => {
    const migrationLogs: string[] = [];
    const config = {
      identifier: 'response',
      callbackOnError: (message: string) => migrationLogs.push(message),
    };

    const payload = guardWithTolerance(invalidApiResponse, isApiResponse, config);

    expect(payload).toBe(invalidApiResponse);
    expect(migrationLogs.length).toBeGreaterThan(0);
    expect(migrationLogs[0]).toContain('response.data.users[1].id');
    expect(migrationLogs[0]).toContain('response.data.users[1].role');
    expect(migrationLogs[0]).toContain('response.data.meta.page');
  });

  it('narrows typed data after validation for downstream converters', () => {
    const queryTotal: unknown = '42';

    expect(isNumeric(queryTotal)).toBe(true);
    if (isNumeric(queryTotal)) {
      expect(toNumber(queryTotal)).toBe(42);
    }
  });

  it('preserves optional nested fields through the validation pipeline', () => {
    const payload: ApiResponse = {
      data: {
        users: [{ id: 3, name: 'Lin', role: 'user' }],
        meta: { total: 1, page: 1 },
      },
    };

    expect(isApiResponse(payload)).toBe(true);

    const user: User = payload.data.users[0]!;
    expect(user.profile).toBeUndefined();
  });
});
