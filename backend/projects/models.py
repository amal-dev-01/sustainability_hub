from django.db import models
from accounts.models import User


class ProjectStatus(models.TextChoices):
    ACTIVE = 'ACTIVE', 'Active'
    COMPLETED = 'COMPLETED', 'Completed'
    ON_HOLD = 'ON_HOLD', 'On Hold'

class Project(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(
        max_length=20,
        choices=ProjectStatus.choices,
        default=ProjectStatus.ACTIVE,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Contributor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="contributor")
    skills = models.JSONField(blank=True, null=True)
    joined_on = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-joined_on']
        
    def __str__(self):
        return f"{self.joined_on}"


class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks', db_index=True)
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True, db_index=True)
    is_completed = models.BooleanField(default=False, db_index=True)
    is_overdue = models.BooleanField(default=False, db_index=True)
    assigned_to = models.ManyToManyField(Contributor, related_name='tasks', blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-due_date', '-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['is_completed']),
            models.Index(fields=['due_date']),
        ]
    def __str__(self):
        return f"{self.title}"
