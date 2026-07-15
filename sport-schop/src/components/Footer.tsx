export default function Footer() {
  return (
    <footer className="bg-white text-black mt-16 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <img src="/images/logos.png" alt="PRODOC Plus" className="h-10 w-auto mb-3" />
          <p className="text-gray-600 text-sm">
            Vos accessoires de sport préférés, livrés chez vous.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Liens</h4>
          <ul className="text-gray-600 text-sm space-y-2">
            <li><a href="/" className="hover:text-primary">Accueil</a></li>
            <li><a href="/produits" className="hover:text-primary">Produits</a></li>
            <li><a href="/contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-3 py-2 rounded border border-gray-300 text-black text-sm"
            />
            <button className="bg-primary text-white px-4 py-2 rounded text-sm font-medium">
              OK
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-200">
        © 2026 PRODOC Plus. Tous droits réservés.
      </div>
    </footer>
  );
}