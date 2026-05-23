import { isArrayWithEachItem } from '@/typeguards/isArrayWithEachItem';
import { isNumber } from '@/typeguards/isNumber';
import { isOneOf } from '@/typeguards/isOneOf';
import { isString } from '@/typeguards/isString';
import { isType, type TypeGuardFn } from '@/typeguards/isType';
import { isUndefinedOr } from '@/typeguards/isUndefinedOr';

export interface UserProfile {
  bio: string;
}

export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  profile?: UserProfile;
}

export interface ApiResponse {
  data: {
    users: User[];
    meta: {
      total: number;
      page: number;
    };
  };
}

export const validApiResponse: ApiResponse = {
  data: {
    users: [
      {
        id: 1,
        name: 'Ada',
        role: 'admin',
        profile: { bio: 'Engineer' },
      },
      {
        id: 2,
        name: 'Grace',
        role: 'user',
      },
    ],
    meta: {
      total: 2,
      page: 1,
    },
  },
};

export const invalidApiResponse = {
  data: {
    users: [
      {
        id: 1,
        name: 'Ada',
        role: 'admin',
        profile: { bio: 'Engineer' },
      },
      {
        id: '2',
        name: 'Grace',
        role: 'superadmin',
      },
    ],
    meta: {
      total: 2,
      page: '1',
    },
  },
};

export function createApiResponseGuard(): TypeGuardFn<ApiResponse> {
  const isUserProfile = isType<UserProfile>({
    bio: isString,
  });

  const isUser = isType<User>({
    id: isNumber,
    name: isString,
    role: isOneOf('admin', 'user'),
    profile: isUndefinedOr(isUserProfile),
  });

  return isType<ApiResponse>({
    data: isType({
      users: isArrayWithEachItem(isUser),
      meta: isType({
        total: isNumber,
        page: isNumber,
      }),
    }),
  });
}

export function parseJsonPayload(raw: string): unknown {
  return JSON.parse(raw) as unknown;
}
