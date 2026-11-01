import { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Store,
  Truck,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '18295180484';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, updateItem, clearCart, totalItems, totalPrice, showToast } = useCart();

  // Controla si estamos viendo la lista de platos ('cart') o los datos de envío ('checkout')
  const [step, setStep] = useState('cart');

  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('Para Recoger');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [gpsStatus, setGpsStatus] = useState({ loading: false, message: '', error: false });

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus({
        loading: false,
        message: 'Tu navegador no soporta geolocalización.',
        error: true,
      });
      return;
    }

    setGpsStatus({ loading: true, message: 'Obteniendo ubicación exacta...', error: false });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapsLink(`https://www.google.com/maps?q=${latitude},${longitude}`);
        setGpsStatus({
          loading: false,
          message: 'Ubicación GPS adjuntada. Añade referencias abajo.',
          error: false,
        });
      },
      () => {
        setGpsStatus({
          loading: false,
          message: 'Permiso denegado. Escribe tu dirección manualmente abajo.',
          error: true,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirmOrder = () => {
    if (!customerName.trim()) {
      showToast('Por favor ingresa tu nombre.');
      return;
    }

    if (orderType === 'Delivery' && !address.trim() && !mapsLink) {
      showToast('Comparte tu ubicación GPS o escribe tu dirección para el delivery.');
      return;
    }

    let message = `Hola, soy *${customerName.trim()}*.\n\nQuiero realizar el siguiente pedido:\n\n`;

    cart.forEach((item) => {
      const subtotal = item.precio * item.quantity;
      message += `▪️ *${item.quantity}x ${item.nombre}*\n`;
      message += `   Precio unitario: RD$ ${item.precio.toLocaleString('es-DO')}\n`;
      message += `   Subtotal: RD$ ${subtotal.toLocaleString('es-DO')}\n\n`;
    });

    message += `*TOTAL A PAGAR: RD$ ${totalPrice.toLocaleString('es-DO')}*\n\n`;
    message += `*Modalidad:* ${orderType}\n`;

    if (orderType === 'Delivery') {
      if (address.trim()) message += `*Dirección / Referencia:* ${address.trim()}\n`;
      if (mapsLink) message += `*Ubicación GPS:* ${mapsLink}\n`;
    }

    if (notes.trim()) {
      message += `*Notas:* ${notes.trim()}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro con desenfoque */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Panel lateral */}
      <aside className="relative w-full max-w-md bg-soft-gray h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-slideLeft">
        {/* Cabecera del Drawer */}
        <div className="bg-forest text-white px-5 py-4 flex items-center justify-between border-b-2 border-gold shrink-0">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' ? (
              <button
                onClick={() => setStep('cart')}
                className="p-1 rounded-lg hover:bg-white/10 text-gold transition cursor-pointer"
                title="Volver a los platos"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <ShoppingBag className="w-5 h-5 text-gold" />
            )}
            <h2 className="font-extrabold text-lg">
              {step === 'cart' ? `Tu Pedido (${totalItems})` : 'Datos de Entrega'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-300 hover:text-gold transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo desplazable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-gray-500">
              <ShoppingBag className="w-14 h-14 text-gray-300 mb-3" />
              <p className="font-semibold text-base text-forest">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 mt-1">
                Agrega platos del menú para comenzar tu orden.
              </p>
            </div>
          ) : step === 'cart' ? (
            /* PASO 1: Lista de Platos */
            <>
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar carrito
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.nombre}
                    className="bg-white p-3.5 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between gap-3"
                  >
                    {item.imagen && (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-forest truncate">{item.nombre}</h4>
                      <p className="text-xs text-gray-500">
                        RD$ {item.precio.toLocaleString('es-DO')} c/u
                      </p>
                      <p className="text-sm font-extrabold text-forest mt-1">
                        RD$ {(item.precio * item.quantity).toLocaleString('es-DO')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItem(item, -1)}
                        className="w-7 h-7 rounded-full bg-gray-100 text-forest hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition cursor-pointer"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>

                      <button
                        onClick={() => updateItem(item, 1)}
                        className="w-7 h-7 rounded-full bg-forest text-white hover:bg-gold hover:text-forest flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* PASO 2: Formulario de Entrega y GPS */
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">Tu Nombre *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1.5">
                  Tipo de Pedido
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOrderType('Para Recoger')}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs border-2 transition cursor-pointer ${
                      orderType === 'Para Recoger'
                        ? 'bg-gold text-white border-gold'
                        : 'bg-white text-forest border-gold/50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Para Recoger</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('Delivery')}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs border-2 transition cursor-pointer ${
                      orderType === 'Delivery'
                        ? 'bg-gold text-white border-gold'
                        : 'bg-white text-forest border-gold/50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Delivery</span>
                  </button>
                </div>
              </div>

              {orderType === 'Delivery' && (
                <div className="p-3.5 rounded-xl bg-soft-gray border border-gray-200 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsStatus.loading}
                    className="w-full flex items-center justify-center gap-2 bg-forest text-white font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-gold hover:text-forest transition cursor-pointer"
                  >
                    {gpsStatus.loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gold" />
                    )}
                    <span>
                      {mapsLink ? 'Actualizar ubicación GPS' : 'Usar mi ubicación GPS actual'}
                    </span>
                  </button>

                  {gpsStatus.message && (
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        gpsStatus.error ? 'text-red-600' : 'text-green-700'
                      }`}
                    >
                      {gpsStatus.error ? (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      )}
                      <span>{gpsStatus.message}</span>
                    </div>
                  )}

                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="Sector, calle, # de casa y referencia..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-gold text-xs resize-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Notas de cocina (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej. Sin cebolla, salsa aparte..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-gold text-xs resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pie fijo del Drawer con Subtotal y Botón de Acción */}
        {cart.length > 0 && (
          <div className="bg-white p-4 border-t border-gray-200 shadow-lg shrink-0 space-y-3">
            <div className="flex items-center justify-between text-forest">
              <span className="text-sm font-semibold text-gray-600">Total a pagar:</span>
              <span className="text-xl font-extrabold">
                RD$ {totalPrice.toLocaleString('es-DO')}
              </span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 bg-forest text-white font-bold py-3.5 rounded-xl border-2 border-gold hover:bg-gold hover:text-forest transition cursor-pointer"
              >
                <span>Continuar con el pedido</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmOrder}
                className="w-full flex items-center justify-center gap-2 bg-green-700 text-white font-extrabold py-3.5 rounded-xl hover:bg-green-800 transition cursor-pointer shadow-md"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Pedido por WhatsApp</span>
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}