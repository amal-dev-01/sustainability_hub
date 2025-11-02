from django.contrib import admin
from accounts.models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ( 'name', 'email')
    search_fields = ( 'name', 'email')
    list_filter = ( 'id',)
    ordering = ('-id', 'name')
