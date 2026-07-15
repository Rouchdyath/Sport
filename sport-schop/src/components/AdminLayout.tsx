import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, BookOpen, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const navItems = [
    { path: "/admin-dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
    { path: "/admin-dashboard/produits", label: "Produits", icon: Package },
    { path: "/admin-dashboard/ebooks", label: "E-books", icon: BookOpen },
    { path: "/admin-dashboard/commandes", label: "Commandes", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col">
        <div className="px-6 py-5 border-b border-gray-800">
          <p className="font-bold text-lg">SPORTSHOP</p>
          <p className="text-xs text-gray-400 mt-1">Espace Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition ${
                  active ? "bg-white text-primary font-medium" : "text-gray-300 hover:bg-gray-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <p className="px-3 text-xs text-gray-400 mb-2">{user?.username}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-300 hover:bg-gray-900 w-full transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}