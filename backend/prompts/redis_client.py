"""Redis client for prompt view counters."""

import os
import redis


def get_redis_connection():
    """Get a Redis connection instance."""
    redis_url = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    try:
        return redis.from_url(redis_url, decode_responses=True)
    except Exception:
        return None


def increment_view_count(prompt_id):
    """
    Increment the view count for a prompt in Redis.
    Returns the new view count, or 0 if Redis is unavailable.
    """
    r = get_redis_connection()
    if r is None:
        return 0
    try:
        key = f"prompt:{prompt_id}:views"
        return r.incr(key)
    except Exception:
        return 0


def get_view_count(prompt_id):
    """
    Get the current view count for a prompt from Redis.
    Returns the view count, or 0 if Redis is unavailable.
    """
    r = get_redis_connection()
    if r is None:
        return 0
    try:
        key = f"prompt:{prompt_id}:views"
        count = r.get(key)
        return int(count) if count else 0
    except Exception:
        return 0
