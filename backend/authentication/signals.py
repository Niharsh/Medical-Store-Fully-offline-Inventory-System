from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from inventory.models import ShopProfile

Owner = get_user_model()


@receiver(post_save, sender=Owner)
def create_shop_profile(sender, instance, created, **kwargs):
    """
    Create default ShopProfile when owner is created
    """
    if created:
        ShopProfile.objects.get_or_create(
            shop_name=f"{instance.first_name}'s Medical Shop" if instance.first_name else "Medical Shop"
        )
