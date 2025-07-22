import { TypeGuardFnConfig } from '../typeguards/isType';
import { ValidationResult, ValidationTree } from './validationTypes';
import { createSimplifiedTree } from './createSimplifiedTree';
import { isDefined } from '../typeguards/isDefined';
import { isNil } from '../typeguards/isNil';

/**
 * Report validation results using functional approach
 * @param result - The validation result to report
 * @param config - Optional configuration for error reporting
 */
export const reportValidationResults = (
  result: ValidationResult, 
  config?: TypeGuardFnConfig | null
): void => {
  if (result.valid === true || isNil(config)) {
    return;
  }
  const errorMode = config.errorMode || 'single';

  const reportJsonMode = (config: TypeGuardFnConfig, resultTree: ValidationTree) => {
    if (isDefined(resultTree)) {
      config.callbackOnError(JSON.stringify(createSimplifiedTree(resultTree), null, 2));
    }
  };

  const reportMultiMode = (config: TypeGuardFnConfig) => {
    if (result.errors && Array.isArray(result.errors)) {
      result.errors.forEach(error => {
        config.callbackOnError(error.message);
      });
    }
  };

  const reportSingleMode = (config: TypeGuardFnConfig) => {
    if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
      const firstError = result.errors[0];
      if (firstError) {
        config.callbackOnError(firstError.message);
      }
    }
  };

  if (errorMode === 'json' && isDefined(result.tree)) {
    reportJsonMode(config, result.tree);
  } else if (errorMode === 'multi') {
    reportMultiMode(config);
  } else {
    reportSingleMode(config);
  }
};
