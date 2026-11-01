import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Inicializamos el estado leyendo de localStorage una sola vez
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Cada vez que 'cart' cambie, se guarda automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Función global para mostrar alertas sin tocar el DOM manualmente
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Sumar o restar cantidad recibiendo el objeto completo del plato
  const updateItem = (plato, change) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.nombre === plato.nombre);

      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prevCart.filter((item) => item.nombre !== plato.nombre);
        }
        return prevCart.map((item) =>
          item.nombre === plato.nombre ? { ...item, quantity: newQuantity } : item
        );
      } else if (change > 0) {
        return [
          ...prevCart,
          {
            nombre: plato.nombre,
            precio: plato.precio,
            imagen: plato.imagen,
            quantity: 1,
          },
        ];
      }
      return prevCart;
    });
  };

  const getItemQuantity = (nombre) => {
    const item = cart.find((p) => p.nombre === nombre);
    return item ? item.quantity : 0;
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        updateItem,
        getItemQuantity,
        clearCart,
        totalItems,
        totalPrice,
        showToast,
      }}
    >
      {children}

      {/* Componente visual del Toast centralizado */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl text-white text-sm font-medium shadow-xl transition-all duration-300 z-50 pointer-events-none ${
          toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        } ${
          toast.type === 'error'
            ? 'bg-red-700'
            : toast.type === 'success'
            ? 'bg-green-600'
            : 'bg-forest'
        }`}
      >
        {toast.message}
      </div>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);