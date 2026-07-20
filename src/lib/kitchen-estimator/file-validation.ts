// ─── File Validation Utilities ────────────────────────────────────────────────
// Pure logic for validating uploaded kitchen photos.
// No side effects — fully testable with property-based testing.

/**
 * Accepted MIME types for kitchen photo uploads.
 */
export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];

/**
 * Maximum file size in bytes (10 MB).
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Photo count constraints.
 */
export const MIN_PHOTOS = 2;
export const MAX_PHOTOS = 6;

/**
 * The result of validating a single file.
 */
export interface FileValidationResult {
  valid: boolean;
  errors: FileValidationError[];
}

/**
 * A specific validation error with a code and human-readable message.
 */
export interface FileValidationError {
  code: "invalid_mime_type" | "file_too_large";
  message: string;
}

/**
 * Validates a single file against MIME type and size constraints.
 *
 * A file is valid if and only if:
 * - Its MIME type is one of image/jpeg, image/png, or image/webp
 * - Its size is ≤ 10 MB
 *
 * @param file - The File object to validate
 * @returns A FileValidationResult with valid flag and any error messages
 */
export function validateFile(file: File): FileValidationResult {
  const errors: FileValidationError[] = [];

  if (!ACCEPTED_MIME_TYPES.includes(file.type as AcceptedMimeType)) {
    errors.push({
      code: "invalid_mime_type",
      message: "Only JPEG, PNG, and WebP images are accepted.",
    });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    errors.push({
      code: "file_too_large",
      message: "This image is too large. Maximum file size is 10 MB.",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Determines whether the user can continue to AI analysis.
 *
 * The continue action is enabled if and only if the total number
 * of valid files is between 2 and 6 (inclusive).
 *
 * @param files - The array of File objects currently uploaded
 * @returns true when 2–6 valid files are present
 */
export function canContinue(files: File[]): boolean {
  const validCount = files.filter((file) => validateFile(file).valid).length;
  return validCount >= MIN_PHOTOS && validCount <= MAX_PHOTOS;
}
