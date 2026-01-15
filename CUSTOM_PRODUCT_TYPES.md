# Custom Product Types Enhancement

## Overview

The Medical Store Inventory System now supports **custom product types** while maintaining default product types. The owner can add new product types beyond the built-in defaults (Tablet, Syrup, Powder, Cream, Diaper, Condom, Sachet).

## Features

✅ **Default Product Types (Immutable)**
- Tablet
- Syrup
- Powder
- Cream
- Diaper
- Condom
- Sachet

✅ **Custom Product Types (Owner Can Add/Delete)**
- Owner can add unlimited custom types
- Custom types are persisted in database
- Custom types are reusable across products
- Owner cannot delete default types

✅ **Smart Type Selection**
- AddProductForm dynamically loads all available types
- Frontend caches types in localStorage for offline support
- Fallback to defaults if API is unavailable

## Architecture

### Components

1. **ProductTypeManager.jsx** - UI for managing product types
   - Display default and custom types
   - Add new custom type form
   - Delete custom type button
   - Read-only for default types

2. **productTypeService.js** - Backend API service
   - Fetch all product types (with defaults merged)
   - Create custom product type
   - Delete custom product type
   - localStorage caching with fallback

3. **ProductContext.jsx** - State management
   - `fetchProductTypes()` - Load all types
   - `addProductType()` - Add custom type
   - `deleteProductType()` - Delete custom type
   - Maintains `productTypes` state

4. **Settings page** - New page for owner
   - Access ProductTypeManager component
   - Future: Additional system settings

5. **AddProductForm.jsx** - Enhanced
   - Loads types from ProductContext
   - Dropdown dynamically populated
   - Loading state while fetching types

## Backend Implementation

### Models

```python
class ProductType(models.Model):
    name = models.CharField(max_length=50, unique=True, primary_key=True)
    label = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Endpoints

**GET /api/product-types/**
```json
[
  {"id": "tablet", "label": "Tablet", "is_default": true},
  {"id": "syrup", "label": "Syrup", "is_default": true},
  {"id": "gel", "label": "Gel", "is_default": false}
]
```

**POST /api/product-types/**
```json
{
  "name": "gel",
  "label": "Gel"
}
```

**DELETE /api/product-types/{id}/**
- 204 No Content on success
- 403 Forbidden if trying to delete default type

## User Flow

### Adding Custom Product Type

1. Navigate to **Settings** page
2. Click **+ Add Custom Type** button
3. Enter Type Name (e.g., "gel") - auto-converts to "gel"
4. Enter Display Label (e.g., "Gel")
5. Click **Add Type**
6. Type is saved and immediately available in AddProductForm

### Using Custom Type

1. Go to **Inventory** page
2. Open **Add New Product** form
3. Select product type from dropdown (includes custom types)
4. Custom type is now available for selection

### Deleting Custom Type

1. Go to **Settings** page
2. Find custom type in "Custom Types" section
3. Click **Delete** button
4. Confirm deletion

**Note**: Default types cannot be deleted

## Data Persistence

- All custom types are stored in database
- Types are fetched from backend on page load
- Frontend caches types in localStorage for offline support
- If API is unavailable, falls back to cached or default types

## Validation

**Backend Validation:**
- `name` must be unique, lowercase, alphanumeric + underscores
- `label` must be non-empty
- Cannot create type with same name as default type
- Cannot delete default types (returns 403 Forbidden)

**Frontend Validation:**
- Both fields required
- Check for existing types (case-insensitive)
- Show error alerts for validation failures

## Files Modified/Created

### New Files
- `frontend/src/services/productTypeService.js` - API service for product types
- `frontend/src/components/Product/ProductTypeManager.jsx` - UI component
- `frontend/src/pages/Settings.jsx` - Settings page

### Modified Files
- `frontend/src/context/ProductContext.jsx` - Added product type management
- `frontend/src/components/Product/AddProductForm.jsx` - Dynamic type loading
- `frontend/src/components/Common/Navigation.jsx` - Added Settings link
- `frontend/src/App.jsx` - Added Settings route
- `frontend/API_CONTRACTS.md` - Added product-types endpoints
- `BACKEND_INTEGRATION_GUIDE.md` - Added ProductType model

## Error Handling

### Frontend
- Network errors: Shows error alert, falls back to cached types
- Validation errors: Shows field-specific error messages
- API errors: Shows friendly error message with backend details

### Backend
- Duplicate type: 400 Bad Request with detail message
- Invalid characters: 400 Bad Request with validation error
- Deleting default: 403 Forbidden
- Type not found: 404 Not Found

## Future Enhancements

- [ ] Edit existing custom types
- [ ] Reorder product types display
- [ ] Product type categories/groups
- [ ] Type-specific fields configuration
- [ ] Bulk import/export types
- [ ] Type usage analytics

## Testing Checklist

- [ ] Create custom product type via Settings page
- [ ] Custom type appears in AddProductForm dropdown
- [ ] Create product with custom type
- [ ] Delete custom product type
- [ ] Cannot delete default types
- [ ] Types persist after page refresh
- [ ] Offline support works (localStorage cache)
- [ ] Error handling for invalid inputs
- [ ] Error handling for API failures

## Database Initialization

When backend is first set up, run:

```python
python manage.py migrate
# In shell or initial data migration:
ProductType.create_defaults()  # Creates default types
```

Or in a Django migration file:

```python
def create_defaults(apps, schema_editor):
    ProductType = apps.get_model('app_name', 'ProductType')
    defaults = [
        ('tablet', 'Tablet'),
        ('syrup', 'Syrup'),
        ('powder', 'Powder'),
        ('cream', 'Cream'),
        ('diaper', 'Diaper'),
        ('condom', 'Condom'),
        ('sachet', 'Sachet'),
    ]
    for name, label in defaults:
        ProductType.objects.get_or_create(
            name=name,
            defaults={'label': label, 'is_default': True}
        )

class Migration(migrations.Migration):
    operations = [
        migrations.RunPython(create_defaults),
    ]
```
