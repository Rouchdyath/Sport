import type { Product } from "./Products";

export type ContenuEbook = {
  titre: string;
  description: string;
};

export type Ebook = Product & {
  contenu?: ContenuEbook[];
};

export const ebooks: Ebook[] = [
  {
    id: "ebook-1",
    nom: "Guide Complet de la Musculation",
    categorie: "E-book",
    prix: 3000,
    image: "/images/ebook-musculation.jpg",
    description: "Un guide PDF complet pour bien démarrer la musculation à la maison.",
    fichierPdf: "/ebooks/guide-musculation.pdf",
    contenu: [
      {
        titre: "Un programme d'entraînement détaillé",
        description:
          "Suivez ce programme pas à pas avec des consignes claires et des exercices variés pour une progression optimale. C'est un programme que vous allez faire évoluer en appliquant les différentes consignes.",
      },
      {
        titre: "Des vidéos d'exercices claires",
        description:
          "L'e-book contient des vidéos claires pour chaque exercice du programme d'entraînement. Ces vidéos vous permettront d'avoir une bonne exécution et de comprendre comment réaliser chaque mouvement de manière efficace et sécurisée.",
      },
      {
        titre: "Plusieurs diètes variées",
        description:
          "Pour optimiser votre prise de masse, plusieurs diètes avec différentes variables par repas sont proposées. Vous pourrez ainsi éviter la monotonie dans vos repas et manger des aliments qui vous plaisent tout en atteignant vos objectifs.",
      },
      {
        titre: "Vidéos de cuisine réalisées par un chef professionnel",
        description:
          "Pour vous aider à bien cuisiner vos repas et rendre la diète plus agréable, l'e-book propose plusieurs vidéos réalisées en collaboration avec un chef professionnel. Vous apprendrez à préparer des repas délicieux et équilibrés pour soutenir votre prise de masse.",
      },
      {
        titre: "Conseils pratiques",
        description:
          "Des conseils pratiques pour vous organiser et éviter les erreurs récurrentes en prise de masse. Vous découvrirez les pièges à éviter, comment gérer votre temps et votre motivation, ainsi que des astuces pour progresser plus rapidement.",
      },
    ],
  },
  {
    id: "ebook-2",
    nom: "Programme Running 30 Jours",
    categorie: "E-book",
    prix: 2500,
    image: "/images/ebook-running.jpg",
    description: "Un programme progressif de 30 jours pour bien débuter la course à pied.",
    fichierPdf: "/ebooks/programme-running.pdf",
    contenu: [
      {
        titre: "Un planning jour par jour",
        description:
          "30 séances progressives, adaptées aux débutants, pour passer de 0 à 5 km en courant sans t'épuiser.",
      },
      {
        titre: "Des conseils de respiration et de posture",
        description:
          "Apprends à bien respirer et à adopter la bonne posture pour courir plus longtemps sans te blesser.",
      },
      {
        titre: "Un guide d'étirements",
        description:
          "Des étirements simples à faire avant et après chaque séance pour éviter les courbatures et les blessures.",
      },
      {
        titre: "Conseils nutrition pour coureurs",
        description:
          "Ce qu'il faut manger avant et après l'effort pour tenir la distance et bien récupérer.",
      },
    ],
  },
];