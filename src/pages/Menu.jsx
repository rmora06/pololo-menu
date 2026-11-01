import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  ArrowUp,
  Home as HomeIcon,
  Plus,
  Minus,
  X,
} from 'lucide-react';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const { menuData, categories, loading, error } = useMenu();
  const { updateItem, getItemQuantity, totalItems, totalPrice, showToast } = useCart();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Controlar aparición del botón "Volver arriba" al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Controlar el Modal de Oferta una vez por sesión (sin el bug del ID con espacio)
  useEffect(() => {
    if (!sessionStorage.getItem('ofertaVista')) {
      const timer = setTimeout(() => {
        setShowOfferModal(true);
        sessionStorage.setItem('ofertaVista', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Alternar mostrar/ocultar una categoría
  const toggleCategory = (categoria) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  // Filtrar platos según el buscador de forma reactiva
  const filteredMenu = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return menuData;

    const result = {};
    Object.keys(menuData).forEach((categoria) => {
      const matches = menuData[categoria].filter(
        (plato) =>
          plato.nombre.toLowerCase().includes(term) ||
          plato.descripcion.toLowerCase().includes(term)
      );
      if (matches.length > 0) {
        result[categoria] = matches;
      }
    });
    return result;
  }, [menuData, searchTerm]);

  const visibleCategories = Object.keys(filteredMenu);

  const handleGoToCheckout = (e) => {
    e.preventDefault();
    if (totalItems === 0) {
      showToast('Tu carrito está vacío. Agrega algún plato primero.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-soft-gray text-forest pb-28 pt-14">
      {/* Barra de navegación fija superior con categorías dinámicas */}
      <nav className="fixed top-0 left-0 w-full bg-forest text-white z-40 shadow-md">
        <div className="max-w-5xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <Link
            to="/"
            className="flex items-center gap-1 text-gold font-bold text-sm px-2.5 py-1 rounded-lg bg-white/10 shrink-0 hover:bg-gold hover:text-forest transition"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Inicio</span>
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#${cat}`}
                className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap hover:bg-gold hover:text-forest transition"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Cabecera con Logo */}
      <header className="flex flex-col items-center pt-6 pb-2 px-4">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gold shadow-md bg-white">
          <img
            src="/images/logo.jpeg"
            alt="Logo del restaurante"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Buscador */}
      <div className="w-11/12 max-w-xl mx-auto my-5 relative">
        <Search className="w-5 h-5 text-gold absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar platos, ingredientes..."
          className="w-full pl-12 pr-10 py-3.5 rounded-full border-2 border-gold bg-white text-forest placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gold/30 shadow-sm transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-4">
        {/* Estado de Carga (Skeletons) */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 animate-pulse"
              >
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="w-28 h-28 bg-gray-200 rounded-xl shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Estado de Error */}
        {error && (
          <div className="text-center bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl my-8">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Sin resultados en búsqueda */}
        {!loading && !error && visibleCategories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No encontramos platos que coincidan con "{searchTerm}".</p>
          </div>
        )}

        {/* Listado Dinámico de Categorías y Platos */}
        {!loading &&
          !error &&
          visibleCategories.map((categoria) => {
            const isCollapsed = collapsedCategories[categoria];
            return (
              <section key={categoria} id={categoria} className="mb-10 scroll-mt-16">
                <div
                  onClick={() => toggleCategory(categoria)}
                  className="flex items-center justify-center gap-2 cursor-pointer mb-6 select-none group"
                >
                  <h2 className="text-2xl font-bold text-forest border-b-2 border-gold pb-1">
                    {categoria}
                  </h2>
                  <button
                    aria-label="Alternar categoría"
                    className="text-forest group-hover:text-gold transition"
                  >
                    {isCollapsed ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMenu[categoria].map((plato) => {
                      const quantity = getItemQuantity(plato.nombre);
                      return (
                        <article
                          key={plato.id}
                          className="bg-white rounded-xl p-3.5 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 border border-gray-100"
                        >
                          {/* Información del plato */}
                          <div className="flex flex-col flex-1 text-left">
                            <h3 className="font-bold text-base md:text-lg text-forest leading-snug">
                              {plato.nombre}
                            </h3>
                            {plato.descripcion && (
                              <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                {plato.descripcion}
                              </p>
                            )}
                            <span className="text-forest font-extrabold text-sm md:text-base mt-2">
                              RD$ {plato.precio.toLocaleString('es-DO')}
                            </span>

                            {/* Controles del carrito */}
                            <div className="flex items-center gap-3 mt-3">
                              <button
                                onClick={() => updateItem(plato, -1)}
                                disabled={quantity === 0}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition ${
                                  quantity > 0
                                    ? 'bg-forest text-white hover:bg-gold hover:text-forest cursor-pointer'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>

                              <span className="font-bold text-base w-5 text-center">
                                {quantity}
                              </span>

                              <button
                                onClick={() => updateItem(plato, 1)}
                                className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold hover:bg-gold hover:text-forest transition cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Imagen del plato con fallback automático si falla el link */}
                          {plato.imagen && (
                            <img
                              src={plato.imagen}
                              alt={plato.nombre}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl shrink-0 bg-gray-100"
                            />
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
      </main>

      {/* Barra Flotante del Carrito (muestra cantidad y subtotal en RD$) */}
      <button
        onClick={handleGoToCheckout}
        className="fixed bottom-5 left-5 bg-forest text-white px-5 py-3.5 rounded-full font-bold flex items-center gap-3 shadow-2xl border-2 border-gold hover:bg-gold hover:text-forest transition-all z-40 cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Ver Pedido</span>
        <span className="bg-gold text-forest px-2.5 py-0.5 rounded-full text-sm font-extrabold">
          {totalItems}
        </span>
        {totalPrice > 0 && (
          <span className="text-sm font-semibold border-l border-white/30 pl-3">
            RD$ {totalPrice.toLocaleString('es-DO')}
          </span>
        )}
      </button>

      {/* Botón Volver Arriba */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-forest text-gold border-2 border-gold flex items-center justify-center shadow-xl hover:bg-gold hover:text-forest transition z-40 cursor-pointer"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Modal de Oferta Especial */}
      {showOfferModal && (
        <div
          onClick={() => setShowOfferModal(false)}
          className="fixed inset-0 bg-forest/85 flex items-center justify-center p-4 z-50 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-2xl text-center max-w-sm w-full relative shadow-2xl border-4 border-gold"
          >
            <button
              onClick={() => setShowOfferModal(false)}
              className="absolute top-3 right-3 text-forest hover:text-gold transition cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>

            <h2 className="text-2xl font-extrabold text-forest mb-3">
              ¡Oferta Especial!
            </h2>

            <img
              src="/images/postres/brownie.webp"
              alt="Oferta especial"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />

            <p className="text-gray-700 text-sm leading-relaxed">
              En la compra de cualquier plato fuerte, llévate un{' '}
              <strong className="text-forest">Brownie a mitad de precio</strong>.
            </p>

            <button
              onClick={() => setShowOfferModal(false)}
              className="mt-5 w-full bg-forest text-white font-bold py-3 rounded-xl border-2 border-gold hover:bg-gold hover:text-forest transition cursor-pointer"
            >
              ¡PÍDELO AL ORDENAR!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}