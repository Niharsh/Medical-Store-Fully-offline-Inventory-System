from django.contrib import admin
from .models import Owner, PasswordResetToken


@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_active', 'is_setup_complete', 'created_at']
    list_filter = ['is_active', 'is_setup_complete', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name')
        }),
        ('Status', {
            'fields': ('is_active', 'is_setup_complete')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['owner', 'is_used', 'is_valid', 'created_at', 'expires_at']
    list_filter = ['is_used', 'created_at']
    search_fields = ['owner__email']
    readonly_fields = ['token', 'created_at']
