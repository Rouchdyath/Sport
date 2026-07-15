import { useState, useEffect } from "react";
import api from "../api/axios";
import type { Ebook } from "../types";
import EbookCard from "../components/EbookCard";

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ebooks/").then((res) => {
      setEbooks(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2 text-center">Nos E-books</h1>
      <p className="text-gray-500 text-center text-sm mb-10">
        Des guides PDF pour progresser plus vite, à télécharger après achat.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {ebooks.map((ebook) => (
          <EbookCard key={ebook.id} ebook={ebook} />
        ))}
      </div>
    </div>
  );
}