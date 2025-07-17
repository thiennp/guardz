import { isAsserted, isType, isString, isNumber } from '../src';

console.log('=== Asserted Type Guards Example ===\n');

// Example 1: External Library Types
console.log('1. External Library Types:');
console.log('----------------------------');

// Simulating an external library type
type ExternalApiResponse = {
  readonly id: string;
  readonly createdAt: Date;
  readonly data: unknown;
};

const isExternalResponse = isAsserted<ExternalApiResponse>;

const externalData: unknown = {
  id: 'ext-123',
  createdAt: new Date(),
  data: { some: 'data' }
};

if (isExternalResponse(externalData)) {
  console.log('✅ External API response validated');
  console.log(`   ID: ${externalData.id}`);
  console.log(`   Created: ${externalData.createdAt.toISOString()}`);
  console.log(`   Data: ${JSON.stringify(externalData.data)}`);
}

// Example 2: Complex Nested Types
console.log('\n2. Complex Nested Types:');
console.log('-------------------------');

interface UserProfile {
  id: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  metadata: Record<string, unknown>;
  settings: {
    privacy: {
      shareData: boolean;
      allowTracking: boolean;
    };
    display: {
      fontSize: number;
      compactMode: boolean;
    };
  };
}

const isUserProfile = isAsserted<UserProfile>;

const profile: unknown = {
  id: 'user-123',
  preferences: { 
    theme: 'dark', 
    notifications: true, 
    language: 'en-US' 
  },
  metadata: { 
    lastLogin: new Date(),
    loginCount: 42,
    preferences: ['dark-mode', 'notifications']
  },
  settings: {
    privacy: {
      shareData: false,
      allowTracking: true
    },
    display: {
      fontSize: 14,
      compactMode: true
    }
  }
};

if (isUserProfile(profile)) {
  console.log('✅ User profile validated');
  console.log(`   ID: ${profile.id}`);
  console.log(`   Theme: ${profile.preferences.theme}`);
  console.log(`   Notifications: ${profile.preferences.notifications}`);
  console.log(`   Language: ${profile.preferences.language}`);
  console.log(`   Share Data: ${profile.settings.privacy.shareData}`);
  console.log(`   Font Size: ${profile.settings.display.fontSize}`);
  console.log(`   Compact Mode: ${profile.settings.display.compactMode}`);
}

// Example 3: API Response Types with Generics
console.log('\n3. API Response Types with Generics:');
console.log('-------------------------------------');

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
  metadata?: {
    version: string;
    source: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

const isApiResponse = isAsserted<ApiResponse<User>>;

const apiResponse: unknown = {
  data: { 
    id: 'user-1', 
    name: 'John Doe', 
    email: 'john@example.com',
    role: 'admin'
  },
  status: 200,
  message: 'Success',
  timestamp: new Date(),
  metadata: {
    version: '1.0.0',
    source: 'database'
  }
};

if (isApiResponse(apiResponse)) {
  console.log('✅ API response validated');
  console.log(`   Status: ${apiResponse.status}`);
  console.log(`   Message: ${apiResponse.message}`);
  console.log(`   User ID: ${apiResponse.data.id}`);
  console.log(`   User Name: ${apiResponse.data.name}`);
  console.log(`   User Role: ${apiResponse.data.role}`);
  console.log(`   API Version: ${apiResponse.metadata?.version}`);
}

// Example 4: Union Types
console.log('\n4. Union Types:');
console.log('---------------');

type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  dueDate?: Date;
}

const isTask = isAsserted<Task>;

const task: unknown = {
  id: 'task-456',
  title: 'Implement new feature',
  status: 'pending',
  priority: 'high',
  assignee: 'john.doe',
  dueDate: new Date('2024-12-31')
};

if (isTask(task)) {
  console.log('✅ Task validated');
  console.log(`   ID: ${task.id}`);
  console.log(`   Title: ${task.title}`);
  console.log(`   Status: ${task.status}`);
  console.log(`   Priority: ${task.priority}`);
  console.log(`   Assignee: ${task.assignee || 'Unassigned'}`);
  console.log(`   Due Date: ${task.dueDate?.toISOString() || 'No due date'}`);
}

// Example 5: Integration with Other Type Guards
console.log('\n5. Integration with Other Type Guards:');
console.log('---------------------------------------');

interface ValidatedUser {
  name: string;
  age: number;
}

interface ExternalUser extends ValidatedUser {
  externalId: string;
  metadata: unknown;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

const isValidatedUser = isType<ValidatedUser>({
  name: isString,
  age: isNumber
});

// Use isAsserted for the additional properties
const isExternalUser = isAsserted<Omit<ExternalUser, keyof ValidatedUser>>;

const user: unknown = {
  name: 'John',
  age: 30,
  externalId: 'ext-123',
  metadata: { source: 'api', version: '2.0' },
  preferences: { theme: 'dark', notifications: true }
};

// First validate the base properties
if (isValidatedUser(user)) {
  console.log('✅ Base user properties validated');
  console.log(`   Name: ${user.name}`);
  console.log(`   Age: ${user.age}`);
  
  // Then assert the additional properties
  if (isExternalUser(user)) {
    console.log('✅ External user properties asserted');
    console.log(`   External ID: ${user.externalId}`);
    console.log(`   Theme: ${user.preferences.theme}`);
    console.log(`   Notifications: ${user.preferences.notifications}`);
  }
}

// Example 6: Readonly Properties
console.log('\n6. Readonly Properties:');
console.log('----------------------');

interface Config {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly timeout: number;
  readonly retries: number;
  readonly environment: 'development' | 'staging' | 'production';
}

const isConfig = isAsserted<Config>;

const config: unknown = {
  apiKey: 'secret-key-12345',
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  environment: 'production'
};

if (isConfig(config)) {
  console.log('✅ Configuration validated');
  console.log(`   API Key: ${config.apiKey.substring(0, 8)}...`);
  console.log(`   Base URL: ${config.baseUrl}`);
  console.log(`   Timeout: ${config.timeout}ms`);
  console.log(`   Retries: ${config.retries}`);
  console.log(`   Environment: ${config.environment}`);
}

console.log('\n=== End of Asserted Type Guards Example ==='); 