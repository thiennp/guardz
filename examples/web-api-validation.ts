import {
  isFile,
  isFileList,
  isBlob,
  isFormData,
  isURL,
  isURLSearchParams,
  isType,
  isString,
  isNumber,
  isBoolean,
  guardWithTolerance,
} from '../src';

console.log('🛡️ Web API Type Guards Examples');
console.log('================================\n');

// Example 1: File Upload Validation
console.log('📁 File Upload Validation:');
console.log('----------------------------');

interface FileUploadRequest {
  files: FileList;
  metadata: {
    userId: string;
    uploadType: 'avatar' | 'document' | 'image';
    allowMultiple: boolean;
  };
}

const isFileUploadRequest = isType<FileUploadRequest>({
  files: isFileList,
  metadata: isType({
    userId: isString,
    uploadType: (value: unknown) =>
      ['avatar', 'document', 'image'].includes(value as string),
    allowMultiple: isBoolean,
  }),
});

// Simulate file upload data
const mockFileUploadData = {
  files: {
    length: 2,
    item: (index: number) => ({ name: `file${index}.txt` }),
    0: { name: 'file0.txt' },
    1: { name: 'file1.txt' },
  } as FileList,
  metadata: {
    userId: 'user123',
    uploadType: 'document',
    allowMultiple: true,
  },
};

if (isFileUploadRequest(mockFileUploadData)) {
  console.log('✅ Valid file upload request');
  console.log(`   Files: ${mockFileUploadData.files.length}`);
  console.log(`   User: ${mockFileUploadData.metadata.userId}`);
  console.log(`   Type: ${mockFileUploadData.metadata.uploadType}`);
} else {
  console.log('❌ Invalid file upload request');
}

// Example 2: Form Data Processing
console.log('\n📝 Form Data Processing:');
console.log('-------------------------');

interface UserRegistrationForm {
  formData: FormData;
  validationErrors: string[];
}

const isUserRegistrationForm = isType<UserRegistrationForm>({
  formData: isFormData,
  validationErrors: (value: unknown) =>
    Array.isArray(value) && value.every(isString),
});

// Simulate form data
const mockFormData = {
  formData: new FormData(),
  validationErrors: [],
} as UserRegistrationForm;

if (typeof FormData !== 'undefined') {
  mockFormData.formData.append('username', 'john_doe');
  mockFormData.formData.append('email', 'john@example.com');
  mockFormData.formData.append('password', 'secret123');
}

if (isUserRegistrationForm(mockFormData)) {
  console.log('✅ Valid user registration form');
  console.log(`   Validation errors: ${mockFormData.validationErrors.length}`);
} else {
  console.log('❌ Invalid user registration form');
}

// Example 3: URL and Query Parameter Validation
console.log('\n🌐 URL and Query Parameter Validation:');
console.log('--------------------------------------');

interface APIRequest {
  endpoint: URL;
  queryParams: URLSearchParams;
  headers: Record<string, string>;
}

const isAPIRequest = isType<APIRequest>({
  endpoint: isURL,
  queryParams: isURLSearchParams,
  headers: (value: unknown) =>
    typeof value === 'object' &&
    value !== null &&
    Object.values(value as Record<string, unknown>).every(isString),
});

// Simulate API request data
const mockAPIRequest = {
  endpoint: new URL('https://api.example.com/users'),
  queryParams: new URLSearchParams('page=1&limit=10&sort=name'),
  headers: {
    Authorization: 'Bearer token123',
    'Content-Type': 'application/json',
  },
} as APIRequest;

if (isAPIRequest(mockAPIRequest)) {
  console.log('✅ Valid API request');
  console.log(`   Endpoint: ${mockAPIRequest.endpoint.hostname}`);
  console.log(`   Query params: ${mockAPIRequest.queryParams.toString()}`);
  console.log(`   Headers: ${Object.keys(mockAPIRequest.headers).length}`);
} else {
  console.log('❌ Invalid API request');
}

// Example 4: File and Blob Validation
console.log('\n📄 File and Blob Validation:');
console.log('-----------------------------');

interface MediaUpload {
  file: File;
  thumbnail: Blob;
  metadata: {
    title: string;
    description?: string;
    tags: string[];
  };
}

const isMediaUpload = isType<MediaUpload>({
  file: isFile,
  thumbnail: isBlob,
  metadata: isType({
    title: isString,
    description: (value: unknown) => value === undefined || isString(value),
    tags: (value: unknown) => Array.isArray(value) && value.every(isString),
  }),
});

// Simulate media upload data
const mockMediaUpload = {
  file: new File(['content'], 'video.mp4', { type: 'video/mp4' }),
  thumbnail: new Blob(['thumbnail'], { type: 'image/jpeg' }),
  metadata: {
    title: 'My Video',
    description: 'A great video',
    tags: ['video', 'entertainment', 'fun'],
  },
} as MediaUpload;

if (isMediaUpload(mockMediaUpload)) {
  console.log('✅ Valid media upload');
  console.log(`   File: ${mockMediaUpload.file.name}`);
  console.log(`   Thumbnail type: ${mockMediaUpload.thumbnail.type}`);
  console.log(`   Title: ${mockMediaUpload.metadata.title}`);
} else {
  console.log('❌ Invalid media upload');
}

// Example 5: Error Handling with Web API Guards
console.log('\n🛠️ Error Handling with Web API Guards:');
console.log('--------------------------------------');

const validationErrors: string[] = [];

const validateFileUpload = (data: unknown) => {
  return guardWithTolerance(data, isFileUploadRequest, {
    identifier: 'fileUpload',
    callbackOnError: error => {
      validationErrors.push(error);
      console.warn('Validation warning:', error);
    },
  });
};

// Test with invalid data
const invalidFileUpload = {
  files: 'not a file list', // Invalid
  metadata: {
    userId: 123, // Invalid - should be string
    uploadType: 'invalid', // Invalid - not in allowed values
    allowMultiple: 'true', // Invalid - should be boolean
  },
};

const result = validateFileUpload(invalidFileUpload);
console.log('📊 Validation result:', result);
console.log('📋 Validation errors:', validationErrors);

// Example 6: Environment Detection
console.log('\n🔍 Environment Detection:');
console.log('-------------------------');

const testEnvironmentDetection = () => {
  console.log('FileList available:', typeof FileList !== 'undefined');
  console.log('FormData available:', typeof FormData !== 'undefined');
  console.log('URL available:', typeof URL !== 'undefined');
  console.log(
    'URLSearchParams available:',
    typeof URLSearchParams !== 'undefined'
  );
  console.log('File available:', typeof File !== 'undefined');
  console.log('Blob available:', typeof Blob !== 'undefined');
};

testEnvironmentDetection();

console.log('\n✅ Web API Type Guards Examples Completed!');
console.log('\n💡 Key Benefits:');
console.log('   • Environment-aware validation');
console.log('   • Comprehensive error reporting');
console.log('   • Type-safe file and form handling');
console.log('   • URL and query parameter validation');
console.log('   • Graceful degradation in different environments');
