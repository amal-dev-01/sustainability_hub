from django.contrib import admin
from projects.models import Project, Contributor, Task

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ( 'name', 'status', 'location', 'created_at', 'updated_at')
    search_fields = ( 'name', 'location', 'status',)
    list_filter = ( 'status', 'location', 'created_at')
    ordering = ('-created_at', 'name')



@admin.register(Contributor)
class ContributorAdmin(admin.ModelAdmin):
    list_display = ( 'user', 'joined_on', 'created_at', 'updated_at')
    search_fields = ( 'user',)
    list_filter = ( 'user', 'joined_on')
    ordering = ('-joined_on', 'user')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ( 'title', 'project', 'due_date', 'is_completed', 'created_at')
    list_filter = ('is_completed', 'due_date', 'project')
    search_fields = ('title', 'description', 'project__name')
    ordering = ('-due_date', '-created_at')
