import { Link, useLocation } from "react-router-dom";
import type { Ebook } from "../types";

export default function ConfirmationPage() {
  const location = useLocation();
  const ebooksAchetes: Ebook[] = location.state?.ebooksAchetes ?? [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">✅</div>
      <h1 className="text-2xl font-bold mb-4">Commande confirmée !</h1>
      <p className="text-gray-500 mb-8">
        Merci pour votre commande. Nous vous contacterons bientôt pour la livraison.
      </p>

      {ebooksAchetes.length > 0 && (
        <div className="border border-gray-200 p-6 mb-8 text-left">
          <h2 className="font-semibold mb-4">Vos e-books à télécharger</h2>
          {ebooksAchetes.map((ebook) => (
            <a
              key={ebook.id}
              href={ebook.fichier_pdf}
              download
              className="block text-sm text-black underline mb-2"
            >
              📄 Télécharger « {ebook.nom} »
            </a>
          ))}
        </div>
      )}

      <Link
        to="/"
        className="inline-block bg-primary text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}