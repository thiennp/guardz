// Mock File constructor for Node.js test environment
global.File = class File {
  constructor(bits, name, options = {}) {
    this.name = name;
    // Calculate size based on the content of bits
    this.size = Array.isArray(bits) ? bits.reduce((total, bit) => {
      if (typeof bit === 'string') return total + bit.length;
      if (bit instanceof ArrayBuffer) return total + bit.byteLength;
      if (bit instanceof Uint8Array) return total + bit.length;
      return total + 1; // fallback for other types
    }, 0) : 0;
    this.type = options.type || '';
    this.lastModified = options.lastModified || Date.now();
  }
};

// Mock FileReader if needed
global.FileReader = class FileReader {
  constructor() {
    this.readyState = 0;
    this.result = null;
    this.error = null;
  }
  
  readAsText() {}
  readAsDataURL() {}
  readAsArrayBuffer() {}
}; 