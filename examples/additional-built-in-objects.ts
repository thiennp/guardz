import { 
  isWeakMap, 
  isWeakSet, 
  isTypedArray, 
  isArrayBuffer, 
  isDataView, 
  isError,
  isNonNullObject,
  isNumber,
  isString,
  isType
} from '../src/index';

console.log('=== Additional Built-in Object Type Guards Examples ===\n');

// 1. WeakMap Type Guards
console.log('1. WeakMap Type Guards:');
const obj1 = {};
const obj2 = {};

const isAnyWeakMap = isWeakMap();
const isObjectNumberWeakMap = isWeakMap(isNonNullObject, isNumber);

console.log('isAnyWeakMap(new WeakMap()):', isAnyWeakMap(new WeakMap())); // true
console.log('isAnyWeakMap(new WeakMap([[obj1, 1]])):', isAnyWeakMap(new WeakMap([[obj1, 1]]))); // true
console.log('isObjectNumberWeakMap(new WeakMap([[obj1, 1], [obj2, 2]])):', isObjectNumberWeakMap(new WeakMap([[obj1, 1], [obj2, 2]]))); // true

// Type narrowing example
const weakMapData: unknown = new WeakMap([[obj1, 100], [obj2, 200]]);
if (isWeakMap(isNonNullObject, isNumber)(weakMapData)) {
  // weakMapData is now typed as WeakMap<object, number>
  console.log('WeakMap has obj1:', weakMapData.has(obj1)); // true
  console.log('WeakMap get obj1:', weakMapData.get(obj1)); // 100
}

// 2. WeakSet Type Guards
console.log('\n2. WeakSet Type Guards:');
const isAnyWeakSet = isWeakSet();
const isObjectWeakSet = isWeakSet(isNonNullObject);

console.log('isAnyWeakSet(new WeakSet()):', isAnyWeakSet(new WeakSet())); // true
console.log('isAnyWeakSet(new WeakSet([obj1])):', isAnyWeakSet(new WeakSet([obj1]))); // true
console.log('isObjectWeakSet(new WeakSet([obj1, obj2])):', isObjectWeakSet(new WeakSet([obj1, obj2]))); // true

// Type narrowing example
const weakSetData: unknown = new WeakSet([obj1, obj2]);
if (isWeakSet(isNonNullObject)(weakSetData)) {
  // weakSetData is now typed as WeakSet<object>
  console.log('WeakSet has obj1:', weakSetData.has(obj1)); // true
  console.log('WeakSet has obj2:', weakSetData.has(obj2)); // true
}

// 3. TypedArray Type Guards
console.log('\n3. TypedArray Type Guards:');
const isAnyTypedArray = isTypedArray();
const isNumberTypedArray = isTypedArray(isNumber);

console.log('isAnyTypedArray(new Int8Array([1, 2, 3])):', isAnyTypedArray(new Int8Array([1, 2, 3]))); // true
console.log('isAnyTypedArray(new Uint8Array([1, 2, 3])):', isAnyTypedArray(new Uint8Array([1, 2, 3]))); // true
console.log('isAnyTypedArray(new Float32Array([1.1, 2.2])):', isAnyTypedArray(new Float32Array([1.1, 2.2]))); // true
console.log('isNumberTypedArray(new Int16Array([1, 2, 3])):', isNumberTypedArray(new Int16Array([1, 2, 3]))); // true

// Type narrowing example
const typedArrayData: unknown = new Uint8Array([1, 2, 3, 4, 5]);
if (isTypedArray(isNumber)(typedArrayData)) {
  // typedArrayData is now typed as TypedArray<number>
  console.log('TypedArray length:', typedArrayData.length); // 5
  console.log('TypedArray first element:', typedArrayData[0]); // 1
  console.log('TypedArray last element:', typedArrayData[4]); // 5
}

// 4. ArrayBuffer Type Guards
console.log('\n4. ArrayBuffer Type Guards:');

console.log('isArrayBuffer(new ArrayBuffer(8)):', isArrayBuffer(new ArrayBuffer(8))); // true
console.log('isArrayBuffer(new ArrayBuffer(16)):', isArrayBuffer(new ArrayBuffer(16))); // true
console.log('isArrayBuffer(new Uint8Array(8).buffer):', isArrayBuffer(new Uint8Array(8).buffer)); // true

// Type narrowing example
const arrayBufferData: unknown = new ArrayBuffer(16);
if (isArrayBuffer(arrayBufferData)) {
  // arrayBufferData is now typed as ArrayBuffer
  console.log('ArrayBuffer byteLength:', arrayBufferData.byteLength); // 16
  const sliced = arrayBufferData.slice(0, 8);
  console.log('Sliced ArrayBuffer byteLength:', sliced.byteLength); // 8
}

// 5. DataView Type Guards
console.log('\n5. DataView Type Guards:');

const buffer = new ArrayBuffer(16);
console.log('isDataView(new DataView(buffer)):', isDataView(new DataView(buffer))); // true
console.log('isDataView(new DataView(buffer, 0, 8)):', isDataView(new DataView(buffer, 0, 8))); // true

// Type narrowing example
const dataViewData: unknown = new DataView(buffer);
if (isDataView(dataViewData)) {
  // dataViewData is now typed as DataView
  console.log('DataView byteLength:', dataViewData.byteLength); // 16
  console.log('DataView byteOffset:', dataViewData.byteOffset); // 0
  dataViewData.setUint16(0, 12345);
  console.log('DataView getUint16(0):', dataViewData.getUint16(0)); // 12345
}

// 6. Error Type Guards
console.log('\n6. Error Type Guards:');

console.log('isError(new Error()):', isError(new Error())); // true
console.log('isError(new Error("Something went wrong")):', isError(new Error("Something went wrong"))); // true
console.log('isError(new TypeError("Type error")):', isError(new TypeError("Type error"))); // true
console.log('isError(new ReferenceError("Reference error")):', isError(new ReferenceError("Reference error"))); // true

// Type narrowing example
const errorData: unknown = new Error("Database connection failed");
if (isError(errorData)) {
  // errorData is now typed as Error
  console.log('Error message:', errorData.message); // "Database connection failed"
  console.log('Error name:', errorData.name); // "Error"
  console.log('Error stack type:', typeof errorData.stack); // "string"
}

// 7. Complex Example: Binary Data Processing
console.log('\n7. Complex Example: Binary Data Processing:');

interface BinaryData {
  buffer: ArrayBuffer;
  view: DataView;
  metadata: {
    size: number;
    type: string;
  };
}

const isBinaryData = isType<BinaryData>({
  buffer: isArrayBuffer,
  view: isDataView,
  metadata: isType({
    size: isNumber,
    type: isString
  })
});

// Create sample binary data
const sampleBuffer = new ArrayBuffer(16);
const sampleView = new DataView(sampleBuffer);
sampleView.setUint32(0, 0x12345678);
sampleView.setUint32(4, 0x9ABCDEF0);

const binaryData: unknown = {
  buffer: sampleBuffer,
  view: sampleView,
  metadata: {
    size: 16,
    type: "uint32"
  }
};

if (isBinaryData(binaryData)) {
  // binaryData is now typed as BinaryData
  console.log('Binary data size:', binaryData.metadata.size); // 16
  console.log('Binary data type:', binaryData.metadata.type); // "uint32"
  console.log('First uint32:', binaryData.view.getUint32(0)); // 0x12345678
  console.log('Second uint32:', binaryData.view.getUint32(4)); // 0x9ABCDEF0
}

// 8. Error Handling with Custom Error Types
console.log('\n8. Error Handling with Custom Error Types:');

class ValidationError extends Error {
  public field: string;
  public value: unknown;
  
  constructor(message: string, field: string, value: unknown) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
  }
}

class NetworkError extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

const validationError = new ValidationError("Invalid input", "email", "not-an-email");
const networkError = new NetworkError("Connection failed", 500);

if (isError(validationError)) {
  console.log('ValidationError name:', validationError.name); // "ValidationError"
  console.log('ValidationError field:', validationError.field); // "email"
}

if (isError(networkError)) {
  console.log('NetworkError name:', networkError.name); // "NetworkError"
  console.log('NetworkError statusCode:', networkError.statusCode); // 500
}

console.log('\n=== All Additional Built-in Object Type Guards Examples Completed ==='); 