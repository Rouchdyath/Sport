import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, BookOpen, ShoppingBag, LogOut, ChevronDown } from "lucide-react";
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
    { path: "/admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin-dashboard/produits", label: "Produits", icon: Package },
    { path: "/admin-dashboard/ebooks", label: "E-books", icon: BookOpen },
    { path: "/admin-dashboard/commandes", label: "Commandes", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-[#F4F6F9]">
      <aside className="w-64 bg-[#123F68] text-white flex flex-col fixed h-screen">
           <div className="px-13 py-5"> 
             <Link to="/" className="flex items-center flex-shrink-0 align-center  ">
               <img src="/images/logos.png" alt="PRODOC Plus" className="h-8 sm:h-10 w-auto" />
             </Link>
              <p className="text-[15px] text-white/50 leading-tight">Espace Admin</p>
            </div>

        <p className="text-[11px] text-white/40 uppercase tracking-wider px-5 mb-2 mt-3">Navigation</p>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? "bg-[#OOFO] text-dark font-medium" : "text-white/60 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {item.label}
                </span>
                <ChevronDown size={13} className="opacity-40" />
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <p className="px-3 text-xs text-white/40 mb-2 truncate">{user?.username}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 w-full transition"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}