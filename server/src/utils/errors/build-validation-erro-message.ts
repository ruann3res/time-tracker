import { type ZodIssue } from 'zod';

export const buildValidationErrorMessage = (issues: ZodIssue[]): string[] => {
  const errors = issues.map(
    (item) => `${item.path.join('.')}: ${item.message}`,
  );

  return errors;
};
