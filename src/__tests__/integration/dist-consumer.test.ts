import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('integration: dist consumer (e2e)', () => {
  const distIndex = path.join(__dirname, '../../../dist/index.js');

  beforeAll(() => {
    if (!fs.existsSync(distIndex)) {
      execSync('npm run build', {
        cwd: path.join(__dirname, '../../..'),
        stdio: 'inherit',
      });
    }
  });

  it('validates data through the compiled npm entrypoint', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const guardz = require('../../../dist/index.js') as typeof import('../../index');

    const isUser = guardz.isType({
      name: guardz.isString,
      age: guardz.isNumber,
    });

    expect(isUser({ name: 'Ada', age: 36 })).toBe(true);
    expect(isUser({ name: 'Ada', age: '36' })).toBe(false);
  });

  it('exposes composed guards and converters from the compiled bundle', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const guardz = require('../../../dist/index.js') as typeof import('../../index');

    const isRole = guardz.isOneOf('admin', 'user');
    const isPayload = guardz.isType({
      role: isRole,
      total: guardz.isNumeric,
    });

    expect(isPayload({ role: 'admin', total: '10' })).toBe(true);

    const total: unknown = '10';
    if (guardz.isNumeric(total)) {
      expect(guardz.toNumber(total)).toBe(10);
    }
  });

  it('reports nested errors from compiled isSchema exports', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const guardz = require('../../../dist/index.js') as typeof import('../../index');

    const isUser = guardz.isSchema({
      profile: {
        age: guardz.isNumber,
      },
    });

    const errors: string[] = [];
    isUser(
      { profile: { age: '30' } },
      {
        identifier: 'user',
        callbackOnError: (message: string) => errors.push(message),
      }
    );

    expect(errors).toEqual([
      'Expected user.profile.age ("30") to be "number"',
    ]);
  });
});
