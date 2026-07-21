from rest_framework import serializers
from .models import Product, Variant, Ebook, Order, OrderItem


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ["id", "couleur", "qualite", "prix", "image", "stock"]


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "nom", "categorie", "description", "prix", "image", "stock", "variants"]


class EbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ebook
        fields = ["id", "nom", "description", "prix", "image", "fichier_pdf"]


class EbookListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ebook
        fields = ["id", "nom", "description", "prix", "image"]


class OrderItemSerializer(serializers.ModelSerializer):
    nom_article = serializers.SerializerMethodField()
    image_article = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["product", "variant", "ebook", "quantite", "prix_unitaire", "nom_article", "image_article"]

    def get_nom_article(self, obj):
        if obj.variant:
            return f"{obj.variant.product.nom} ({obj.variant.couleur} / {obj.variant.qualite})"
        elif obj.product:
            return obj.product.nom
        elif obj.ebook:
            return obj.ebook.nom
        return "Article supprimé"

    def get_image_article(self, obj):
        request = self.context.get("request")
        if obj.variant and obj.variant.image:
            url = obj.variant.image.url
        elif obj.product and obj.product.image:
            url = obj.product.image.url
        elif obj.ebook and obj.ebook.image:
            url = obj.ebook.image.url
        else:
            return None
        return request.build_absolute_uri(url) if request else url


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id", "nom_client", "telephone", "adresse", "ville",
            "mode_paiement", "statut", "total", "date_creation", "items",
        ]

    def validate(self, data):
        if "items" not in data:
            return data

        for item_data in data["items"]:
            variant = item_data.get("variant")
            product = item_data.get("product")
            quantite = item_data["quantite"]

            if variant:
                if variant.stock < quantite:
                    raise serializers.ValidationError(
                        f"Stock insuffisant pour {variant.product.nom} ({variant.couleur}/{variant.qualite}). "
                        f"Disponible : {variant.stock}"
                    )
            elif product:
                if product.stock < quantite:
                    raise serializers.ValidationError(
                        f"Stock insuffisant pour {product.nom}. Disponible : {product.stock}"
                    )
        return data

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

            variant = item_data.get("variant")
            product = item_data.get("product")
            quantite = item_data["quantite"]

            if variant:
                variant.stock -= quantite
                variant.save()
            elif product:
                product.stock -= quantite
                product.save()

        return order


class AdminVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ["id", "product", "couleur", "qualite", "prix", "image", "stock"]


class AdminProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "nom", "categorie", "description", "prix", "image", "stock", "variants"]


class AdminEbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ebook
        fields = ["id", "nom", "description", "prix", "image", "fichier_pdf"]