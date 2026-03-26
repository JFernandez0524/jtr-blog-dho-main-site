const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(key: string): boolean {
  const now = Date.now();

  for (const [k, v] of rateLimitMap.entries()) {
    if (v.resetTime < now) rateLimitMap.delete(k);
  }

  const record = rateLimitMap.get(key);
  if (!record || record.resetTime < now) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}
