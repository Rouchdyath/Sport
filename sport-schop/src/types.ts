export type Variant = {
  id: number;
  couleur: string;
  qualite: string;
  prix: number;
  image: string;
  stock: number;
};

export type Product = {
  id: number;
  nom: string;
  categorie: string;
  description: string;
  prix: number | null;
  image: string | null;
  stock: number;
  variants: Variant[];
};

export type ContenuEbook = {
  id: number;
  titre: string;
  description: string;
  ordre: number;
};

export type EbookDocument = {
  id: number;
  fichier_pdf: string;
  titre?: string;
  niveau?: string;
};

export type Ebook = {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image: string;
  fichier_pdf?: string;
  contenu?: ContenuEbook[];
  documents?: EbookDocument[];
};