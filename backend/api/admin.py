from django.contrib import admin
from .models import Product, Blog, CartItem, Order

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'brand', 'price', 'category', 'stock']
    list_editable = ['price', 'stock']
    search_fields = ['name', 'brand']
    list_filter = ['category', 'brand']

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'date']
    search_fields = ['title']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'quantity', 'session_id']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'phone', 'total', 'created_at']
