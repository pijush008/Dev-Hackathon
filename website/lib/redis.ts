const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function upstash(command: string, ...args: (string | number)[]): Promise<any> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command: [command, ...args] }),
    });
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}

export async function redisGet<T>(key: string): Promise<T | null> {
  const raw = await upstash("GET", key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function redisSet(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<void> {
  const serialized = JSON.stringify(value);
  if (ttlSeconds) {
    await upstash("SETEX", key, ttlSeconds, serialized);
  } else {
    await upstash("SET", key, serialized);
  }
}

export async function redisDel(key: string): Promise<void> {
  await upstash("DEL", key);
}

export async function redisIncr(
  key: string,
  ttlSeconds?: number,
): Promise<number> {
  const val = await upstash("INCR", key);
  if (typeof val !== "number") return 0;
  if (ttlSeconds && val === 1) {
    await upstash("EXPIRE", key, ttlSeconds);
  }
  return val;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const current = await redisIncr(`ratelimit:${key}`, windowSeconds);
  const allowed = current <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - current),
    resetAt: Date.now() + windowSeconds * 1000,
  };
}

export async function redisPing(): Promise<boolean> {
  const res = await upstash("PING");
  return res === "PONG";
}
