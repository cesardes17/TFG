// src/types/ResultService.ts
/**
 * Unified result wrapper for async service calls
 */
export interface ResultService<T> {
  /** The returned data (if any) */
  data?: T;
  /** Flag indicating success or failure */
  success: boolean;
  /** Error message in case of failure */
  errorMessage?: string;
}
