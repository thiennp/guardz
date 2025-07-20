// Web API type declarations for environments where they might not be available

// BufferSource type
type BufferSource = ArrayBufferView | ArrayBuffer;

// Blob API types
declare global {
  interface Blob {
    readonly size: number;
    readonly type: string;
    slice(start?: number, end?: number, contentType?: string): Blob;
    arrayBuffer(): Promise<ArrayBuffer>;
    stream(): ReadableStream;
    text(): Promise<string>;
  }

  type BlobPart = BufferSource | Blob | string;

  interface BlobConstructor {
    new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
    prototype: Blob;
  }

  interface BlobPropertyBag {
    type?: string;
    endings?: 'transparent' | 'native';
  }

  // File API types
  interface File extends Blob {
    readonly name: string;
    readonly lastModified: number;
  }

  interface FilePropertyBag extends BlobPropertyBag {
    lastModified?: number;
  }

  interface FileList {
    readonly length: number;
    item(index: number): File | null;
    [index: number]: File;
    [Symbol.iterator](): IterableIterator<File>;
  }

  interface FileConstructor {
    new (bits: BlobPart[], filename: string, options?: FilePropertyBag): File;
    prototype: File;
  }

  interface FileListConstructor {
    new (): FileList;
    prototype: FileList;
  }

  // FormData API
  interface FormData {
    append(name: string, value: string | Blob, filename?: string): void;
    delete(name: string): void;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: string | Blob, filename?: string): void;
    [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
    entries(): IterableIterator<[string, FormDataEntryValue]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<FormDataEntryValue>;
  }

  type FormDataEntryValue = string | File;

  interface FormDataConstructor {
    new (form?: HTMLFormElement): FormData;
    prototype: FormData;
  }

  // URL API
  interface URL {
    hash: string;
    host: string;
    hostname: string;
    href: string;
    origin: string;
    password: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    searchParams: URLSearchParams;
    username: string;
    toJSON(): string;
  }

  interface URLConstructor {
    new (url: string, base?: string | URL): URL;
    createObjectURL(object: Blob | MediaSource): string;
    revokeObjectURL(url: string): void;
    prototype: URL;
  }

  // URLSearchParams API
  interface URLSearchParams {
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    sort(): void;
    toString(): string;
    [Symbol.iterator](): IterableIterator<[string, string]>;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
  }

  interface URLSearchParamsConstructor {
    new (
      init?: string | Record<string, string> | string[][] | URLSearchParams
    ): URLSearchParams;
    prototype: URLSearchParams;
  }
}

export {};
