from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.exceptions import ValidationError


class OwnerManager(UserManager):
    """Custom manager for Owner model (email-based, no username)"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create a regular user with email"""
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create a superuser with email"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Owner(AbstractUser):
    """
    Single owner account per installation.
    Extends Django's AbstractUser with one-time setup enforcement.
    """
    
    # Remove username requirement - use email as primary identifier
    username = None
    
    email = models.EmailField(unique=True)
    is_setup_complete = models.BooleanField(default=False, help_text="True after first successful login")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = OwnerManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = 'Shop Owner'
        verbose_name_plural = 'Shop Owners'
    
    def __str__(self):
        return self.email
    
    @classmethod
    def owner_exists(cls):
        """Check if any owner account exists"""
        return cls.objects.filter(is_active=True).exists()
    
    @classmethod
    def get_owner(cls):
        """Get the single owner account"""
        return cls.objects.filter(is_active=True).first()


class PasswordResetToken(models.Model):
    """
    Track password reset tokens with expiry
    """
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE, related_name='reset_token')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Password Reset Token'
        verbose_name_plural = 'Password Reset Tokens'
    
    def __str__(self):
        return f"Reset token for {self.owner.email}"
    
    def is_valid(self):
        """Check if token is still valid"""
        from django.utils import timezone
        return not self.is_used and timezone.now() < self.expires_at
