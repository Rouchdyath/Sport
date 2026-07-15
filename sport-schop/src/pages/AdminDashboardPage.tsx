import { useAuth } from "../context/AuthContext";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">Tableau de bord admin</h1>
      <p className="text-gray-500 mb-8">Connecté en tant que {user?.username}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 p-6">
          <h2 className="font-semibold mb-2">Commandes</h2>
          <p className="text-sm text-gray-500">Gérer les commandes clients</p>
        </div>
        <div className="border border-gray-200 p-6">
          <h2 className="font-semibold mb-2">Produits</h2>
          <p className="text-sm text-gray-500">Ajouter / modifier les produits</p>
        </div>
        <div className="border border-gray-200 p-6">
          <h2 className="font-semibold mb-2">E-books</h2>
          <p className="text-sm text-gray-500">Gérer les e-books</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-10 border border-black px-6 py-2 text-sm font-medium hover:bg-gray-100 transition"
      >
        Se déconnecter
      </button>
    </div>
  );
}