from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    CATEGORIE_CHOICES = [
        ("Football", "Football"),
        ("Musculation", "Musculation"),
        ("Running", "Running"),
        ("Fitness", "Fitness"),
        ("Boxe", "Boxe"),
        ("Accessoires", "Accessoires"),
    ]

    nom = models.CharField(max_length=200)
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to="produits/", blank=True)
    stock = models.PositiveIntegerField(default=0, help_text="Stock uniquement si le produit n'a pas de variantes")

    def __str__(self):
        return self.nom


class Variant(models.Model):
    product = models.ForeignKey(Product, related_name="variants", on_delete=models.CASCADE)
    couleur = models.CharField(max_length=50)
    qualite = models.CharField(max_length=50)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="variants/")
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.nom} - {self.couleur} - {self.qualite} (stock: {self.stock})"
        
class Ebook(models.Model):
    nom = models.CharField(max_length=200)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="ebooks/covers/")
    fichier_pdf = models.FileField(upload_to="ebooks/pdf/")

    def __str__(self):
        return self.nom





class Order(models.Model):
    STATUT_CHOICES = [
        ("en_attente", "En attente"),
        ("confirmee", "Confirmée"),
        ("livree", "Livrée"),
        ("annulee", "Annulée"),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    nom_client = models.CharField(max_length=100)
    telephone = models.CharField(max_length=30)
    adresse = models.CharField(max_length=255)
    ville = models.CharField(max_length=100)
    mode_paiement = models.CharField(max_length=50, default="Paiement à la livraison")
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="en_attente")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commande #{self.id} - {self.nom_client}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    variant = models.ForeignKey(Variant, on_delete=models.SET_NULL, null=True, blank=True)
    ebook = models.ForeignKey(Ebook, on_delete=models.SET_NULL, null=True, blank=True)
    quantite = models.PositiveIntegerField(default=1)
    prix_unitaire = models.PositiveIntegerField()

    def __str__(self):
        nom = self.product.nom if self.product else (self.ebook.nom if self.ebook else "Article")
        return f"{nom} x{self.quantite}"