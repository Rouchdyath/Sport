export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2 text-center">Contactez-nous</h1>
      <p className="text-gray-500 text-center mb-10">
        Une question ? Écrivez-nous, on vous répond rapidement.
      </p>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
            placeholder="vous@exemple.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            rows={5}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
            placeholder="Votre message..."
          />
        </div>

        <button
          type="button"
          className="w-full bg-primary text-white py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}