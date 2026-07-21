from django.contrib import admin
from .models import Product, Variant, Ebook, Order, OrderItem


class VariantInline(admin.TabularInline):
    model = Variant
    extra = 1
    fields = ["couleur", "qualite", "prix", "image", "stock"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product", "variant", "ebook", "quantite", "prix_unitaire"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["nom", "categorie", "prix", "stock", "statut_stock"]
    list_filter = ["categorie"]
    search_fields = ["nom"]
    inlines = [VariantInline]

    def statut_stock(self, obj):
        if obj.variants.exists():
            total = sum(v.stock for v in obj.variants.all())
        else:
            total = obj.stock
        if total == 0:
            return "🔴 Rupture de stock"
        elif total <= 5:
            return f"🟠 Stock faible ({total})"
        return f"🟢 En stock ({total})"

    statut_stock.short_description = "Statut"


@admin.register(Ebook)
class EbookAdmin(admin.ModelAdmin):
    list_display = ["nom", "prix"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "nom_client", "telephone", "statut", "total", "date_creation"]
    list_filter = ["statut"]
    inlines = [OrderItemInline]