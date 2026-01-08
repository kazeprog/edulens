import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be defined in .env.local')
}

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Rate limiter for Free Users (3 requests per 24 hours)
export const ratelimitFree = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, '24 h'),
    analytics: true,
    prefix: '@upstash/ratelimit/free',
})

// Rate limiter for Guest Users (1 request per 24 hours)
export const ratelimitGuest = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, '24 h'),
    analytics: true,
    prefix: '@upstash/ratelimit/guest',
})

