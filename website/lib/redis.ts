import Redis from "ioredis";

let _client: Redis | null = null;

function getClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!_client) {
    _client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: true,
    });
  }
  return _client;
}

async function ensureConnected(): Promise<Redis | null> {
  const client = getClient();
  if (!client) return null;
  if (client.status !== "ready") {
    try {
      await client.connect();
    } catch {
      return null;
    }
  }
  return client;
}

export async function redisGet<T>(key: string): Promise<T | null> {
  const client = await ensureConnected();
  if (!client) return null;
  try {
    const raw = await client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function redisSet(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<void> {
  const client = await ensureConnected();
  if (!client) return;
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, serialized);
    } else {
      await client.set(key, serialized);
    }
  } catch {
    // silently fail
  }
}

export async function redisDel(key: string): Promise<void> {
  const client = await ensureConnected();
  if (!client) return;
  try {
    await client.del(key);
  } catch {
    // silently fail
  }
}

export async function redisIncr(
  key: string,
  ttlSeconds?: number,
): Promise<number> {
  const client = await ensureConnected();
  if (!client) return 0;
  try {
    const val = await client.incr(key);
    if (ttlSeconds && val === 1) {
      await client.expire(key, ttlSeconds);
    }
    return val;
  } catch {
    return 0;
  }
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
  const client = await ensureConnected();
  if (!client) return false;
  try {
    const res = await client.ping();
    return res === "PONG";
  } catch {
    return false;
  }
}
