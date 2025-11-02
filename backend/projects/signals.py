from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from projects.models import Task
from projects.utils.cache_utils import delete_cache_by_pattern
import logging


logger = logging.getLogger(__name__)

@receiver([post_save, post_delete], sender=Task)
def clear_due_task_cache(sender, **kwargs):
    """
    Automatically clear cached 'due_tasks' data whenever
    a Task is created, updated, or deleted.
    """
    try:
        delete_cache_by_pattern("due_tasks:*")
        logger.info('[clear_due_task_cache]============== Delete cache ===============')
    except Exception as e:
        logger.info(f"[clear_due_task_cache] Cache invalidation failed: {e}")
