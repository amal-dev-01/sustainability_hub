from django.core.cache import cache
from django.conf import settings

CACHE_TTL = getattr(settings, "CACHE_TTL", 60 * 5)


def generate_cache_key(prefix: str, request):
    """
    Generate a unique cache key based on query parameters.
    Ensures that different filter/search/order combos produce unique cache entries.
    """
    params = request.query_params.urlencode() or "default"
    return f"{prefix}:{params}"




def get_cached_data(cache_key: str):
    """
    Retrieve data from Redis cache.
    Returns None if not found or Redis is unavailable.
    """
    return cache.get(cache_key)


def set_cached_data(cache_key: str, data, timeout=CACHE_TTL):
    """
    Store serialized data in Redis cache.
    """
    cache.set(cache_key, data, timeout)


def delete_cache_by_pattern(pattern: str):
    """
    Delete all cache keys matching a given pattern.
    Example: delete_cache_by_pattern("due_tasks:*")
    """
    keys = cache.keys(pattern)
    if keys:
        cache.delete_many(keys)

def clear_all_cache():
    """
    Completely clear all Redis cache (use carefully!).
    """
    cache.clear()
