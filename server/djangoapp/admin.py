from django.contrib import admin
from .models import CarMake, CarModel

# CarModelInline class to display CarModels inline in CarMake admin
class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1  # Number of empty forms to display

# CarModelAdmin class
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ('car_make', 'type', 'year')
    search_fields = ['name', 'car_make__name']

# CarMakeAdmin class with CarModelInline
class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ('name', 'description', 'country', 'established')

# Register models here
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)