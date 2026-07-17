from pathlib import Path
from django.core.files import File
from django.core.management.base import BaseCommand
from shop.models import Product, Variant

IMAGES_DIR = Path(r"C:\Users\DELL\Documents\Rouch\Stage_InWallet\schop\sport-schop\public\images")

PRODUCTS_DATA = [
    {
        "nom": "Ballon de football Pro",
        "categorie": "Football",
        "description": "Ballon officiel taille 5, idéal pour l'entraînement et la compétition.",
        "variants": [
            {"couleur": "Blanc/Noir", "qualite": "Standard", "prix": 12000, "image": "ballon1.jpg"},
            {"couleur": "Rose/Blanc", "qualite": "Premium", "prix": 18000, "image": "ballon2.jpg"},
            {"couleur": "Rose/Berge", "qualite": "Pro Match", "prix": 25000, "image": "ballon3.jpg"},
            {"couleur": "Noir/Jaune", "qualite": "Pro Match", "prix": 20000, "image": "ballon4.jpg"},
            {"couleur": "Bleu/Jaune", "qualite": "VIP", "prix": 28000, "image": "ballon5.jpg"},
        ],
    },
    {
        "nom": "Haltères 5kg (paire)",
        "categorie": "Musculation",
        "description": "Paire d'haltères en fonte revêtue, parfaits pour la musculation à domicile.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 12000, "image": "althere1.jpg"},
            {"couleur": "Noir", "qualite": "Premium", "prix": 18000, "image": "althere2.jpg"},
            {"couleur": "Noir", "qualite": "Pro Match", "prix": 25000, "image": "althere3.jpg"},
            {"couleur": "Noir", "qualite": "Pro Match", "prix": 30000, "image": "althere4.jpg"},
            {"couleur": "Noir", "qualite": "VIP", "prix": 28000, "image": "althere5.jpg"},
        ],
    },
    {
        "nom": "Manchon / Manchette",
        "categorie": "Fitness",
        "description": "Cette coudière de basket va permettre de garder les muscles du bras à bonne température et de réduire la fatigue grâce à un bon maintien musculaire et une légère compression.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 12000, "image": "bras1.jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 18000, "image": "bras2.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 25000, "image": "bras3.jpg"},
            {"couleur": "Blanc", "qualite": "Pro Match", "prix": 30000, "image": "bras4.jpg"},
        ],
    },
    {
        "nom": "Chaussures de running",
        "categorie": "Running",
        "description": "Chaussures légères et respirantes pour la course à pied.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 12000, "image": "choose1.png"},
            {"couleur": "violette", "qualite": "Premium", "prix": 18000, "image": "choose2.png"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 25000, "image": "choose3.png"},
            {"couleur": "Blanc", "qualite": "Pro Match", "prix": 30000, "image": "choose4.jpg"},
            {"couleur": "Blanc", "qualite": "Premium", "prix": 40000, "image": "choose5.png"},
        ],
    },
    {
        "nom": "SitUp",
        "categorie": "Fitness",
        "description": "Restez en forme à tout moment et partout – avec le SitUp™ portable.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 8000, "image": "corde2.jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 10000, "image": "cord.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 15000, "image": "Corde (2).jpg"},
            {"couleur": "Blanc", "qualite": "Pro Match", "prix": 150000, "image": "corde3.jpg"},
        ],
    },
    {
        "nom": "Bande Elastique",
        "categorie": "Fitness",
        "description": "La bande élastique LegFlex Pro Endurafit intensifie vos entraînements, améliore l'activation musculaire et augmente l'efficacité de chaque exercice.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 8000, "image": "cuisse (2).jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 10000, "image": "cuisse (3).jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 15000, "image": "cuisse.jpg"},
        ],
    },
    {
        "nom": "Tapis de yoga",
        "categorie": "Fitness",
        "description": "Tapis antidérapant, confortable pour le yoga et les étirements.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 8000, "image": "tapi.jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 10000, "image": "tapi1.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 15000, "image": "tapis.jpg"},
            {"couleur": "Blanc", "qualite": "Pro Match", "prix": 150000, "image": "tapi2.jpg"},
            {"couleur": "Gris", "qualite": "VIP", "prix": 180000, "image": "tapis (2).jpg"},
        ],
    },
    {
        "nom": "Gants de boxe",
        "categorie": "Boxe",
        "description": "Gants rembourrés pour l'entraînement de boxe et de sac de frappe.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 8000, "image": "boxing gloves.jpg"},
            {"couleur": "Noir", "qualite": "Premium", "prix": 9000, "image": "boxing.jpg"},
            {"couleur": "violette", "qualite": "Pro Match", "prix": 10000, "image": "boxing2.jpg"},
        ],
    },
    {
        "nom": "Marchine de marche",
        "categorie": "Musculation",
        "description": "Pour maintenir une musculature forte et un cœur en bonne santé, il est essentiel d'effectuer un minimum d'activité physique et de pas chaque jour, mais aussi de pratiquer des exercices de renforcement musculaire.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 8000, "image": "marche (2).jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 10000, "image": "marche.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 15000, "image": "march1.jpg"},
        ],
    },
    {
        "nom": "Bouteille d'eau sport 1L",
        "categorie": "Accessoires",
        "description": "Bouteille étanche et robuste pour rester hydraté pendant l'effort.",
        "variants": [
            {"couleur": "violette", "qualite": "Premium", "prix": 6000, "image": "good2.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 7000, "image": "good3.jpg"},
            {"couleur": "Vert", "qualite": "Pro Match", "prix": 7500, "image": "good4.jpg"},
            {"couleur": "Noir", "qualite": "Standard", "prix": 5000, "image": "good.jpg"},
            {"couleur": "Rouge", "qualite": "VIP", "prix": 8000, "image": "good5.jpg"},
        ],
    },
    {
        "nom": "Montre",
        "categorie": "Accessoires",
        "description": "Suivez vos performances en temps réel grâce à une montre de sport intelligente qui mesure votre activité, votre fréquence cardiaque et votre sommeil. Conçue pour vous accompagner au quotidien, elle vous aide à atteindre vos objectifs de santé et de remise en forme.",
        "variants": [
            {"couleur": "violette", "qualite": "Premium", "prix": 6000, "image": "watch1.png"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 7000, "image": "watch5.jpg"},
            {"couleur": "Noir", "qualite": "Standard", "prix": 6500, "image": "watch6.jpg"},
            {"couleur": "Gris", "qualite": "VIP", "prix": 8000, "image": "watch3.jpg"},
        ],
    },
    {
        "nom": "Sac de Sport",
        "categorie": "Accessoires",
        "description": "Notre sac de sport est conçu pour celles et ceux qui recherchent à la fois praticité, organisation et une touche d'élégance. Idéal pour transporter facilement tout le nécessaire pour vos entraînements.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 5000, "image": "sac5.jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 6000, "image": "sac2.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 7000, "image": "sac3.jpg"},
            {"couleur": "Gris", "qualite": "VIP", "prix": 8000, "image": "sac4.jpg"},
            {"couleur": "Rouge", "qualite": "Premium", "prix": 6500, "image": "sac1.jpg"},
        ],
    },
    {
        "nom": "Serviette de Sport",
        "categorie": "Accessoires",
        "description": "Notre serviette de sport est conçue pour vous accompagner lors de vos entraînements. Elle est absorbante et rapide à sécher, idéale pour garder votre peau sèche et confortable.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 5000, "image": "serviette 1.jpg"},
            {"couleur": "violette", "qualite": "Premium", "prix": 6000, "image": "serviette 2.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 7000, "image": "serviette 3.jpg"},
        ],
    },
    {
        "nom": "Bandage de sport",
        "categorie": "Fitness",
        "description": "Bandage de compression pour soutenir et protéger vos articulations pendant l'effort.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 5000, "image": "bandage1.jpg"},
            {"couleur": "Bleu", "qualite": "Premium", "prix": 7000, "image": "Bandage2.jpg"},
        ],
    },
    {
        "nom": "Bandeau de sport",
        "categorie": "Accessoires",
        "description": "Bandeau absorbant pour garder le front au sec pendant vos entraînements intenses.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 3000, "image": "bandeau1.jpg"},
        ],
    },
    {
        "nom": "Chaussettes de sport",
        "categorie": "Accessoires",
        "description": "Chaussettes respirantes et confortables, idéales pour toutes vos activités sportives.",
        "variants": [
            {"couleur": "Blanc", "qualite": "Standard", "prix": 3000, "image": "chausette.jpg"},
            {"couleur": "Noir", "qualite": "Premium", "prix": 4000, "image": "chaussette.jpg"},
        ],
    },
    {
        "nom": "Protège-tibias",
        "categorie": "Football",
        "description": "Protège-tibias léger et résistant pour sécuriser vos jambes pendant les matchs.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 5000, "image": "protege1.jpg"},
            {"couleur": "Blanc", "qualite": "Premium", "prix": 7000, "image": "protège2.jpg"},
            {"couleur": "Bleu", "qualite": "Pro Match", "prix": 9000, "image": "protège 3.jpg"},
        ],
    },
    {
        "nom": "Bracelet de sport",
        "categorie": "Accessoires",
        "description": "Lot de bracelets/poignets absorbants pour un meilleur confort pendant l'effort.",
        "variants": [
            {"couleur": "Noir", "qualite": "Standard", "prix": 4000, "image": "Under Armour Men's 3-inch Performance Wristband 2-Pack.jpg"},
        ],
    },
]


class Command(BaseCommand):
    help = "Importe les produits de sport (avec variantes) dans la base de données"

    def handle(self, *args, **options):
        total_produits = 0
        total_variants = 0
        images_manquantes = []

        for data in PRODUCTS_DATA:
            product, created = Product.objects.get_or_create(
                nom=data["nom"],
                defaults={
                    "categorie": data["categorie"],
                    "description": data["description"],
                },
            )
            if created:
                total_produits += 1
                self.stdout.write(self.style.SUCCESS(f"✓ Produit créé : {product.nom}"))
            else:
                self.stdout.write(f"— Produit déjà existant : {product.nom}")

            for variant_data in data["variants"]:
                image_path = IMAGES_DIR / variant_data["image"]

                if not image_path.exists():
                    images_manquantes.append(str(image_path))
                    continue

                image_key = variant_data["image"].rsplit(".", 1)[0]
                exists = Variant.objects.filter(
                    product=product,
                    image__icontains=image_key,
                ).exists()

                if exists:
                    continue

                with open(image_path, "rb") as f:
                    variant = Variant(
                        product=product,
                        couleur=variant_data["couleur"],
                        qualite=variant_data["qualite"],
                        prix=variant_data["prix"],
                    )
                    variant.image.save(variant_data["image"], File(f), save=True)
                    total_variants += 1

        self.stdout.write(self.style.SUCCESS(f"\n✅ {total_produits} produits créés, {total_variants} variantes créées."))

        if images_manquantes:
            self.stdout.write(self.style.WARNING(f"\n⚠️ {len(images_manquantes)} images introuvables :"))
            for img in images_manquantes:
                self.stdout.write(f"  - {img}")