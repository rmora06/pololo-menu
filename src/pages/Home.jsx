import { Link } from 'react-router-dom';
import { UtensilsCrossed, MapPin, Star } from 'lucide-react';

// Centralizamos los datos del negocio para no dejar "TUUSUARIO" escondido en el HTML
const RESTAURANT_CONFIG = {
  name: 'Pololo Foods & Drinks',
  mapsUrl: 'https://maps.app.goo.gl/4z84bugFYB1q24t46',
  reviewUrl: 'https://maps.app.goo.gl/4z84bugFYB1q24t46', // Cámbialo por el link directo a reseñas de Google
  instagram: 'https://instagram.com/TUUSUARIO',
  tiktok: 'https://tiktok.com/@TUUSUARIO',
  whatsapp: 'https://wa.me/18295180484',
};

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col justify-between py-10 px-6"
      style={{ backgroundImage: "url('/images/restaurante.webp')" }}
    >
      {/* Capa oscura verde bosque con desenfoque sutil para dar aspecto más moderno */}
      <div className="absolute inset-0 bg-forest/80 backdrop-blur-[2px] z-0" />

      {/* Encabezado y Logo */}
      <header className="relative z-10 flex flex-col items-center mt-6">
        <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-gold shadow-2xl mb-5 bg-white">
          <img
            src="/images/logo.jpeg"
            alt={`Logo de ${RESTAURANT_CONFIG.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-gold text-3xl md:text-4xl font-extrabold text-center tracking-wide drop-shadow-md">
          {RESTAURANT_CONFIG.name}
        </h1>
        <p className="text-gray-200 text-sm mt-2 text-center">
          Sabor auténtico a un clic de distancia
        </p>
      </header>

      {/* Opciones principales */}
      <section className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4 my-8">
        <Link
          to="/menu"
          className="flex items-center justify-center gap-3 bg-gold text-forest font-bold text-lg py-4 px-6 rounded-xl border-2 border-gold shadow-lg hover:bg-white hover:border-white transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <UtensilsCrossed className="w-5 h-5" />
          Ver Menú Digital
        </Link>

        <a
          href={RESTAURANT_CONFIG.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-forest/90 text-white font-semibold text-lg py-3.5 px-6 rounded-xl border-2 border-gold/80 hover:bg-gold hover:text-forest transition-all duration-300"
        >
          <MapPin className="w-5 h-5 text-gold group-hover:text-forest" />
          Ubicación
        </a>

        <a
          href={RESTAURANT_CONFIG.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-forest/90 text-white font-semibold text-lg py-3.5 px-6 rounded-xl border-2 border-gold/80 hover:bg-gold hover:text-forest transition-all duration-300"
        >
          <Star className="w-5 h-5 text-gold" />
          Valorar Servicio
        </a>
      </section>

      {/* Redes Sociales bien estructuradas */}
      <footer className="relative z-10 flex justify-center gap-6 pb-4">
        <a
          href={RESTAURANT_CONFIG.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="w-12 h-12 rounded-full bg-white text-forest flex items-center justify-center shadow-lg hover:-translate-y-1 hover:bg-gold hover:text-white transition-all duration-300"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        <a
          href={RESTAURANT_CONFIG.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="w-12 h-12 rounded-full bg-white text-forest flex items-center justify-center shadow-lg hover:-translate-y-1 hover:bg-gold hover:text-white transition-all duration-300"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 448 512">
            <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z" />
          </svg>
        </a>

        <a
          href={RESTAURANT_CONFIG.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="w-12 h-12 rounded-full bg-white text-forest flex items-center justify-center shadow-lg hover:-translate-y-1 hover:bg-gold hover:text-white transition-all duration-300"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 448 512">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}