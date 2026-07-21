import { Link } from "react-router-dom";

export default function Footer() {
  const socials = [
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M13.5 22V12.5h3.2l.5-3.6h-3.7V4.3c0-1 .3-1.8 1.8-1.8h1.9V.1C17 .1 15.7 0 14.2 0c-2.7 0-4.5 1.6-4.5 4.6v2.6H6.5v3.6h3.2V22h3.8z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M18.9 2H22l-6.8 7.8L23.3 22h-5.8l-4.5-5.9L7.5 22H4.4l7.3-8.4L.7 2h5.9l4.1 5.4L18.9 2z" />
        </svg>
      ),
    },
  ];

  const liens = [
    { label: "Accueil", to: "/" },
    { label: "Produits", to: "/produits" },
    { label: "E-books", to: "/ebooks" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-6">
        {/* Logo à gauche */}
        <img src="/images/logos.png" alt="PRODOC Plus" className="h-9 w-auto" />

        {/* Liens au centre */}
        <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-600">
          {liens.map((lien) => (
            <Link key={lien.to} to={lien.to} className="hover:text-primary transition">
              {lien.label}
            </Link>
          ))}
        </nav>

        {/* Réseaux sociaux à droite */}
        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition">
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Bande noire */}
      <div className="bg-[#14231F]">
        <div className="max-w-6xl mx-auto px-6 py-3 text-center text-xs text-white/60">
          © 2026 PRODOC Plus. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}