/**
 * Idempotency Key generator
 */
export function generateIdempotencyKey(prefix: string = 'idem'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}
