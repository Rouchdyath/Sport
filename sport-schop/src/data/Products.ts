export type Variant = {
  id: string;
  couleur: string;
  qualite: string;
  prix: number;
  image: string;
};

export type Product = {
  id: string;
  nom: string;
  prix?: number;
  categorie: string;
  image?: string;
  description: string;
  variants?: Variant[];
  fichierPdf?: string;
};

export const products: Product[] = [
  {
    id: "1",
    nom: "Ballon de football Pro",
    categorie: "Football",
    description: "Ballon officiel taille 5, idéal pour l'entraînement et la compétition.",
    variants: [
      { id: "1-a", couleur: "Blanc/Noir", qualite: "Standard", prix: 12000, image: "/images/ballon1.jpg" },
      { id: "1-b", couleur: "Rose/Blanc", qualite: "Premium", prix: 18000, image: "/images/ballon2.jpg" },
      { id: "1-c", couleur: "Rose/Berge", qualite: "Pro Match", prix: 25000, image: "/images/ballon3.jpg" },
      { id: "1-d", couleur: "Noir/Jaune", qualite: "Pro Match", prix: 20000, image: "/images/ballon4.jpg" },
      { id: "1-e", couleur: "Bleu/Jaune", qualite: "VIP", prix: 28000, image: "/images/ballon5.jpg" },
    ],
  },

  {
    id: "2",
    nom : "Haltères 5kg (paire)",
    categorie: "Musculation",
    description: "Paire d'haltères en fonte revêtue, parfaits pour la musculation à domicile.",
    variants: [
      { id: "2-a", couleur: "Noir", qualite: "Standard", prix: 12000, image: "/images/althere1.jpg" },
      { id: "2-b", couleur: "Noir", qualite: "Premium", prix: 18000, image: "/images/althere2.jpg" },
      { id: "2-c", couleur: "Noir", qualite: "Pro Match", prix: 25000, image: "/images/althere3.jpg" },
      { id: "2-d", couleur: "Noir", qualite: "Pro Match", prix: 30000, image: "/images/althere4.jpg" },
      { id: "2-e", couleur: "Noir", qualite: "VIP", prix: 28000, image: "/images/althere5.jpg" },
    ],
  },

  {
    id: "3",
    nom : "Manchon / Manchette",
    prix: 12000,
    categorie: "Fitness",
    description: "Cette coudière de basket va permettre de garder les muscles du bras à bonne température et de réduire la fatigue grâce à un bon maintien musculaire et une légère compression.",
    variants: [
      { id: "3-a", couleur: "Noir", qualite: "Standard", prix: 12000, image: "/images/bras1.jpg" },
      { id: "3-b", couleur: "violette", qualite: "Premium", prix: 18000, image: "/images/bras2.jpg" },
      { id: "3-c", couleur: "Bleu", qualite: "Pro Match", prix: 25000, image: "/images/bras3.jpg" },
      { id: "3-d", couleur: "Blanc", qualite: "Pro Match", prix: 30000, image: "/images/bras4.jpg" },
    ]
  },
    

  {
    id: "4",
    nom : "Chaussures de running",
    prix: 35000,
    categorie: "Running",
    description: "Chaussures légères et respirantes pour la course à pied.",
     variants: [
      { id: "4-a", couleur: "Noir", qualite: "Standard", prix: 12000, image: "/images/choose1.jpg" },
      { id: "4-b", couleur: "violette", qualite: "Premium", prix: 18000, image: "/images/choose2.jpg" },
      { id: "4-c", couleur: "Bleu", qualite: "Pro Match", prix: 25000, image: "/images/choose3.jpg" },
      { id: "4-d", couleur: "Blanc", qualite: "Pro Match", prix: 30000, image: "/images/choose4.jpg" },
      { id: "4-e", couleur: "Blanc", qualite: "Premium", prix: 40000, image: "/images/choose5.jpg" },
    ]
   
  },

   {
    id: "5",
    nom : "SitUp",
    categorie: "Fitness",
    image: "/images/corde.jpg",
    description: "Restez en forme à tout moment et partout – avec le SitUp™ portable..",
     variants: [
      { id: "5-a", couleur: "Noir", qualite: "Standard", prix: 8000, image: "/images/corde2.jpg" },
      { id: "5-b", couleur: "violette", qualite: "Premium", prix: 10000, image: "/images/cord.jpg" },
      { id: "5-c", couleur: "Bleu", qualite: "Pro Match", prix: 15000, image: "/images/Corde(2).jpg" },
      { id: "5-d", couleur: "Blanc", qualite: "Pro Match", prix: 150000, image: "/images/corde3.jpg" },
    ]
  },

   {
    id: "6",
    nom : "Bande Elastique",
    prix: 5000,
    categorie: "Fitness",
     description: "La bande élastique LegFlex Pro Endurafit intensifie vos entraînements, améliore l’activation musculaire et augmente l’efficacité de chaque exercice.",
      variants: [
      { id: "6-a", couleur: "Noir", qualite: "Standard", prix: 8000, image: "/images/cuisse (2).jpg" },
      { id: "6-b", couleur: "violette", qualite: "Premium", prix: 10000, image: "/images/cuisse (3).jpg" },
      { id: "6-c", couleur: "Bleu", qualite: "Pro Match", prix: 15000, image: "/images/cuisse.jpg" },
    ]  
  },

  {
    id: "7",
    nom : "Tapis de yoga",
    prix: 12000,
    categorie: "Fitness",
    description: "Tapis antidérapant, confortable pour le yoga et les étirements.",
     variants: [
      { id: "7-a", couleur: "Noir", qualite: "Standard", prix: 8000, image: "/images/tapi.jpg" },
      { id: "7-b", couleur: "violette", qualite: "Premium", prix: 10000, image: "/images/tapi1.jpg" },
      { id: "7-c", couleur: "Bleu", qualite: "Pro Match", prix: 15000, image: "/images/tapis.jpg" },
      { id: "7-d", couleur: "Blanc", qualite: "Pro Match", prix: 150000, image: "/images/tapi2.jpg" },
      { id: "7-e", couleur: "Blanc", qualite: "Pro Match", prix: 150000, image: "/images/tapi (2).jpg" },
    ]  
    
  },

  
    {
    id: "8",
    nom : "Gants de boxe",
    prix: 18000,
    categorie: "Boxe",
    description: "Gants rembourrés pour l'entraînement de boxe et de sac de frappe.",
     variants: [
      { id: "8-a", couleur: "Noir", qualite: "Standard", prix: 8000, image: "/images/boxing gloves.jpg" },
      { id: "8-b", couleur: "Noir", qualite: "Standard", prix: 8000, image: "/images/boxing.jpg" },
      { id: "8-c", couleur: "violette", qualite: "Premium", prix: 10000, image: "/images/boxing2.jpg" },
      { id: "8-d", couleur: "Bleu", qualite: "Pro Match", prix: 15000, image: "/images/boxin gloves.jpg" },
    ]  
  },

   {
    id: "9",
    nom : "Marchine de marche",
    prix: 18000,
    categorie: "Musculation",
    image: "/images/marche (3).jpg",
    description: "Pour maintenir une musculature forte et un cœur en bonne santé, il est essentiel d’effectuer un minimum d’activité physique et de pas chaque jour, mais aussi de pratiquer des exercices de renforcement musculaire..",
    variants: [
      { id: "9-a", couleur: "Noir", qualite: "Standard", prix: 8000, image: "/images/marche (2).jpg" },
      { id: "9-b", couleur: "violette", qualite: "Premium", prix: 10000, image: "/images/marche.jpg" },
      { id: "9-c", couleur: "Bleu", qualite: "Pro Match", prix: 15000, image: "/images/march1.jpg" },
      { id: "9-d", couleur: "Bleu", qualite: "Pro Match", prix: 15000, image: "/images/marche (3).jpg" },
    ]  
    
  },

  {
    id: "10",
    nom : "Bouteille d'eau sport 1L",
    prix: 5000,
    categorie: "Accessoires",
     description: "Bouteille étanche et robuste pour rester hydraté pendant l'effort.",
     variants: [
      { id: "10-a", couleur: "Noir", qualite: "Standard", prix: 5000, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500" },
      { id: "10-b", couleur: "violette", qualite: "Premium", prix: 6000, image: "/images/good2.jpg" },
      { id: "10-c", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/good3.jpg" },
      { id: "10-d", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/good4.jpg" },
      { id: "10-e", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/good.jpg" },
      { id: "10-f", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/good5.jpg" },
    
    ]  
  },

   {
    id: "11",
    nom : "Montre",
    prix: 5000,
    categorie: "Accessoires",
    description: "Suivez vos performances en temps réel grâce à une montre de sport intelligente qui mesure votre activité, votre fréquence cardiaque et votre sommeil. Conçue pour vous accompagner au quotidien, elle vous aide à atteindre vos objectifs de santé et de remise en forme.",
     variants: [
      { id: "11-a", couleur: "violette", qualite: "Premium", prix: 6000, image: "/images/watch1.jpg" },
      { id: "11-b", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/watch5.jpg" },
      { id: "11-c", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/watch6.jpg" },
      { id: "11-d", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/watch1.jpg" },
    ]
  },
  
    

  {
    id: "12",
    nom : "Sac de Sport",
    prix: 20000,
    categorie: "Accessoires",
     description: "Notre sac de sport est conçu pour celles et ceux qui recherchent à la fois praticité, organisation et une touche d’élégance. Idéal pour transporter facilement tout le nécessaire pour vos entraînements.",
    variants: [
      { id: "12-a", couleur: "Noir", qualite: "Standard", prix: 5000, image: "/images/sac5.jpg" },
      { id: "12-b", couleur: "violette", qualite: "Premium", prix: 6000, image: "/images/sac2.jpg" },
      { id: "12-c", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/sac3.jpg" },
      { id: "12-d", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/sac4.jpg" },
      { id: "12-e", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/sac5.jpg" },
    ]

  },

  {
    id: "13",
    nom : "Serviette de Sport",
    prix: 20000,
    categorie: "Accessoires",
    description: "Notre serviette de sport est conçue pour vous accompagner lors de vos entraînements. Elle est absorbante et rapide à sécher, idéale pour garder votre peau sèche et confortable.",
    variants: [
      { id: "13-a", couleur: "Noir", qualite: "Standard", prix: 5000, image: "/images/serviette1.jpg" },
      { id: "13-b", couleur: "violette", qualite: "Premium", prix: 6000, image: "/images/serviette2.jpg" },
      { id: "13-c", couleur: "Bleu", qualite: "Pro Match", prix: 7000, image: "/images/serviette3.jpg" },
    ],
  },



  

]