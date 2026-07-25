const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function redisGet<T>(key: string): Promise<T | null> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return null;
  const res = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
  });
  const json = (await res.json()) as { result: string | null };
  return json.result ? (JSON.parse(json.result) as T) : null;
}

export async function redisSet(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return;
  const url = ttlSeconds
    ? `${UPSTASH_REDIS_REST_URL}/set/${key}?ex=${ttlSeconds}`
    : `${UPSTASH_REDIS_REST_URL}/set/${key}`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
}

export async function redisDel(key: string): Promise<void> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return;
  await fetch(`${UPSTASH_REDIS_REST_URL}/del/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
  });
}

export async function redisIncr(key: string, ttlSeconds?: number): Promise<number> {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return 0;
  const url = ttlSeconds
    ? `${UPSTASH_REDIS_REST_URL}/incr/${key}?ex=${ttlSeconds}`
    : `${UPSTASH_REDIS_REST_URL}/incr/${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
  });
  const json = (await res.json()) as { result: number };
  return json.result;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const current = await redisIncr(`ratelimit:${key}`, windowSeconds);
  const allowed = current <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - current),
    resetAt: Date.now() + windowSeconds * 1000,
  };
}