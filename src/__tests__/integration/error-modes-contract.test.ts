import {
  createApiResponseGuard,
  invalidApiResponse,
} from './fixtures/api-response';

describe('integration: error mode contract', () => {
  const isApiResponse = createApiResponseGuard();

  it('reports the first leaf error in single mode', () => {
    const errors: string[] = [];

    isApiResponse(invalidApiResponse, {
      identifier: 'response',
      errorMode: 'single',
      callbackOnError: (message) => errors.push(message),
    });

    expect(errors).toEqual([
      'Expected response.data.users[1].id ("2") to be "number"',
    ]);
  });

  it('aggregates all leaf errors in multi mode', () => {
    const errors: string[] = [];

    isApiResponse(invalidApiResponse, {
      identifier: 'response',
      errorMode: 'multi',
      callbackOnError: (message) => errors.push(message),
    });

    expect(errors).toHaveLength(1);
    expect(errors[0]).toBe(
      'Expected response.data.users[1].id ("2") to be "number"; Expected response.data.users[1].role ("superadmin") to be "unknown"; Expected response.data.meta.page ("1") to be "number"'
    );
  });

  it('returns a structured JSON tree in json mode', () => {
    const errors: string[] = [];

    isApiResponse(invalidApiResponse, {
      identifier: 'response',
      errorMode: 'json',
      callbackOnError: (message) => errors.push(message),
    });

    expect(errors).toHaveLength(1);

    const tree = JSON.parse(errors[0]!);
    expect(tree).toMatchObject({
      response: {
        valid: false,
        value: {
          data: {
            valid: false,
            value: {
              users: {
                valid: false,
                value: {
                  '0': { valid: true, value: expect.any(Object) },
                  '1': {
                    valid: false,
                    value: {
                      id: {
                        valid: false,
                        value: '2',
                        expectedType: 'number',
                      },
                      role: {
                        valid: false,
                        value: 'superadmin',
                        expectedType: 'unknown',
                      },
                    },
                  },
                },
              },
              meta: {
                valid: false,
                value: {
                  page: {
                    valid: false,
                    value: '1',
                    expectedType: 'number',
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it('uses root paths when identifier is omitted', () => {
    const errors: string[] = [];

    isApiResponse(invalidApiResponse, {
      errorMode: 'multi',
      callbackOnError: (message) => errors.push(message),
    });

    expect(errors[0]).toContain('root.data.users[1].id');
    expect(errors[0]).toContain('root.data.meta.page');
  });
});
