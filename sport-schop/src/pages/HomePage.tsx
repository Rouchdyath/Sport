import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const heroImages = [
  "/images/hero.jpg",
  "/images/musl.jpg",
  "/images/muscle.jpg",
];

export default function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[600px] overflow-hidden">
      {heroImages.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="PRODOC Plus"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-center text-white">
        <p className="text-sm font-medium tracking-widest uppercase text-primary-light mb-4">
          By PRODOC PLUS
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-xl leading-tight">
          Des programmes structurés pour une progression réelle
        </h1>
        <p className="text-white/85 max-w-md mb-8 leading-relaxed">
          Que tu vises la prise de masse, la perte de poids ou l'amélioration de tes performances,
          nos programmes par niveau et nos guides t'accompagnent à chaque étape.
        </p>
        <Link
          to="/produits"
          className="border border-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-[#14231F] transition w-fit"
        >
          En savoir plus
        </Link>
      </div>

      {/* Points cliquables */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index ? "bg-primary-light" : "bg-white/40"
            }`}
            aria-label={`Voir l'image ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}