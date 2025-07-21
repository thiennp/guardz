import { TypeGuardFn, TypeGuardFnConfig } from '../typeguards/isType';

export interface ValidationError {
  path: string;
  expectedType: string;
  actualValue: unknown;
  message: string;
}

export interface ValidationTree {
  valid: boolean;
  path: string;
  expectedType?: string;
  actualValue?: unknown;
  errors?: ValidationError[];
  children?: Record<string, ValidationTree>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  tree?: ValidationTree;
}

export interface ValidationContext {
  path: string;
  config?: TypeGuardFnConfig | null;
  parentTree?: ValidationTree;
} 