import { TypeGuardFnConfig } from '../typeguards/isType';
import { ValidationResult } from './validationTypes';
import { createSimplifiedTree } from './createSimplifiedTree';

/**
 * Report validation results using functional approach
 * @param result - The validation result to report
 * @param config - Optional configuration for error reporting
 */
export const reportValidationResults = (
  result: ValidationResult, 
  config?: TypeGuardFnConfig | null
): void => {
  const reportJsonMode = () => {
    result.errors.forEach(error => {
      config!.callbackOnError(error.message);
    });
    const simplifiedTree = createSimplifiedTree(result.tree!);
    config!.callbackOnError(JSON.stringify(simplifiedTree, null, 2));
  };

  const reportMultiMode = () => {
    result.errors.forEach(error => {
      config!.callbackOnError(error.message);
    });
  };

  const reportSingleMode = () => {
    const firstError = result.errors[0];
    if (firstError) {
      config!.callbackOnError(firstError.message);
    }
  };

  // Use functional composition to determine reporting strategy
  const shouldReport = result.valid === false && config !== null;
  
  shouldReport && (() => {
    const errorMode = config!.errorMode || 'single';
    
    return errorMode === 'json' && result.tree
      ? reportJsonMode()
      : errorMode === 'multi'
      ? reportMultiMode()
      : reportSingleMode();
  })();
}; 