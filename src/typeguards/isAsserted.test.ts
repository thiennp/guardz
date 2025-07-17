import { isAsserted } from './isAsserted';
import { isType } from './isType';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isExtensionOf } from './isExtensionOf';

describe('isAsserted', () => {
  it('should always return true for any value', () => {
    expect(isAsserted<number>(123)).toBe(true);
    expect(isAsserted<string>('hello')).toBe(true);
    expect(isAsserted<null>(null)).toBe(true);
    expect(isAsserted<undefined>(undefined)).toBe(true);
    expect(isAsserted<object>({})).toBe(true);
  });

  it('should assert the type for TypeScript', () => {
    const value: unknown = { foo: 'bar' };
    if (isAsserted<{ foo: string }>(value)) {
      // TypeScript should allow access to value.foo as string
      const foo: string = value.foo;
      expect(foo).toBe('bar');
    }
  });

  it('should work with complex types', () => {
    interface ComplexType {
      id: number;
      name: string;
      metadata: {
        tags: string[];
        version: string;
      };
    }

    const value: unknown = {
      id: 1,
      name: 'test',
      metadata: {
        tags: ['tag1', 'tag2'],
        version: '1.0.0'
      }
    };

    if (isAsserted<ComplexType>(value)) {
      // TypeScript should allow access to all nested properties
      expect(value.id).toBe(1);
      expect(value.name).toBe('test');
      expect(value.metadata.tags).toEqual(['tag1', 'tag2']);
      expect(value.metadata.version).toBe('1.0.0');
    }
  });

  it('should work with external library types', () => {
    // Simulating an external library type
    type ExternalLibType = {
      readonly id: string;
      readonly createdAt: Date;
      readonly data: unknown;
    };

    const externalData: unknown = {
      id: 'ext-123',
      createdAt: new Date(),
      data: { some: 'data' }
    };

    if (isAsserted<ExternalLibType>(externalData)) {
      // TypeScript should treat this as ExternalLibType
      expect(externalData.id).toBe('ext-123');
      expect(externalData.createdAt).toBeInstanceOf(Date);
      expect(externalData.data).toEqual({ some: 'data' });
    }
  });

  it('should work with API response types', () => {
    // Simulating an API response type
    interface ApiResponse<T> {
      data: T;
      status: number;
      message: string;
    }

    interface User {
      id: string;
      name: string;
      email: string;
    }

    const apiResponse: unknown = {
      data: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
      status: 200,
      message: 'Success'
    };

    if (isAsserted<ApiResponse<User>>(apiResponse)) {
      // TypeScript should provide full type safety
      expect(apiResponse.data.id).toBe('user-1');
      expect(apiResponse.data.name).toBe('John Doe');
      expect(apiResponse.status).toBe(200);
      expect(apiResponse.message).toBe('Success');
    }
  });

  it('should work with union types', () => {
    type Status = 'pending' | 'approved' | 'rejected';
    
    const status: unknown = 'approved';
    if (isAsserted<Status>(status)) {
      // TypeScript should know this is one of the union values
      expect(status).toBe('approved');
    }
  });

  it('should work with generic types', () => {
    interface Container<T> {
      value: T;
      timestamp: Date;
    }

    const container: unknown = {
      value: { id: 123, name: 'test' },
      timestamp: new Date()
    };

    if (isAsserted<Container<{ id: number; name: string }>>(container)) {
      // TypeScript should provide type safety for generic parameters
      expect(container.value.id).toBe(123);
      expect(container.value.name).toBe('test');
      expect(container.timestamp).toBeInstanceOf(Date);
    }
  });

  it('should work in combination with other type guards', () => {
    interface ValidatedUser {
      name: string;
      age: number;
    }

    interface ExternalUser extends ValidatedUser {
      externalId: string;
      metadata: unknown;
    }

    const isValidatedUser = isType<ValidatedUser>({
      name: isString,
      age: isNumber
    });

    const isExternalUser = isExtensionOf(
      isValidatedUser,
      isAsserted<Omit<ExternalUser, keyof ValidatedUser>>
    );

    const user: unknown = {
      name: 'John',
      age: 30,
      externalId: 'ext-123',
      metadata: { source: 'api' }
    };

    if (isExternalUser(user)) {
      // TypeScript knows user is ExternalUser
      expect(user.name).toBe('John');
      expect(user.age).toBe(30);
      expect(user.externalId).toBe('ext-123');
      expect(user.metadata).toEqual({ source: 'api' });
    }
  });

  it('should work with readonly properties', () => {
    interface ReadonlyConfig {
      readonly apiKey: string;
      readonly baseUrl: string;
      readonly timeout: number;
    }

    const config: unknown = {
      apiKey: 'secret-key',
      baseUrl: 'https://api.example.com',
      timeout: 5000
    };

    if (isAsserted<ReadonlyConfig>(config)) {
      // TypeScript should treat properties as readonly
      expect(config.apiKey).toBe('secret-key');
      expect(config.baseUrl).toBe('https://api.example.com');
      expect(config.timeout).toBe(5000);
    }
  });
}); 