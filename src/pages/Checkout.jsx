import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Store,
  Truck,
  Trash2,
  Plus,
  Minus,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '18295180484';

export default function Checkout() {
  const { cart, updateItem, clearCart, totalPrice, showToast } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('Para Recoger'); // 'Para Recoger' | 'Delivery'
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [gpsStatus, setGpsStatus] = useState({ loading: false, message: '', error: false });

  // Captura de coordenadas GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus({
        loading: false,
        message: 'Tu navegador no soporta geolocalización.',
        error: true,
      });
      return;
    }

    setGpsStatus({ loading: true, message: 'Obteniendo tu ubicación exacta...', error: false });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setMapsLink(link);
        setGpsStatus({
          loading: false,
          message: 'Ubicación GPS adjuntada correctamente. Añade referencias abajo.',
          error: false,
        });
      },
      () => {
        setGpsStatus({
          loading: false,
          message: 'Permiso de GPS denegado. Por favor escribe tu dirección detallada abajo.',
          error: true,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Validación y envío por WhatsApp
  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      showToast('Tu carrito está vacío.');
      return;
    }

    if (!customerName.trim()) {
      showToast('Por favor ingresa tu nombre.');
      return;
    }

    if (orderType === 'Delivery' && !address.trim() && !mapsLink) {
      showToast('Para delivery, comparte tu ubicación GPS o escribe tu dirección.');
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
      message += `*Notas del pedido:* ${notes.trim()}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-soft-gray text-forest py-8 px-4 pb-16">
      <div className="max-w-xl mx-auto">
        {/* Botón para volver al menú sin perder el control */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-forest font-semibold hover:text-gold transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-center text-forest mb-6">
          Resumen del Pedido
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg mb-5">Tu carrito está vacío.</p>
            <Link
              to="/menu"
              className="inline-block bg-forest text-white font-bold px-6 py-3 rounded-xl border-2 border-gold hover:bg-gold hover:text-forest transition"
            >
              Explorar el Menú
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de platos interactiva */}
            <div className="space-y-3 mb-6">
              {cart.map((item) => {
                const subtotal = item.precio * item.quantity;
                return (
                  <div
                    key={item.nombre}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-forest text-base">{item.nombre}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        RD$ {item.precio.toLocaleString('es-DO')} c/u
                      </p>
                      <p className="text-sm font-extrabold text-forest mt-1">
                        Subtotal: RD$ {subtotal.toLocaleString('es-DO')}
                      </p>
                    </div>

                    {/* Controles para editar o borrar directo en el checkout */}
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => updateItem(item, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 text-forest hover:bg-red-100 hover:text-red-700 flex items-center justify-center transition cursor-pointer"
                        title={item.quantity === 1 ? 'Eliminar plato' : 'Restar uno'}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </button>

                      <span className="font-bold text-base w-5 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateItem(item, 1)}
                        className="w-8 h-8 rounded-full bg-forest text-white hover:bg-gold hover:text-forest flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Caja de Total */}
            <div className="bg-forest text-white p-4 rounded-xl text-center text-xl font-extrabold shadow-md border-2 border-gold mb-6">
              Total: RD$ {totalPrice.toLocaleString('es-DO')}
            </div>

            {/* Formulario del Cliente */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <div>
                <label className="block text-sm font-bold text-forest mb-1.5">
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 text-base"
                />
              </div>

              {/* Selector de Tipo de Pedido */}
              <div>
                <label className="block text-sm font-bold text-forest mb-2">
                  ¿Cómo deseas recibir tu pedido?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('Para Recoger')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold border-2 transition cursor-pointer ${
                      orderType === 'Para Recoger'
                        ? 'bg-gold text-white border-gold shadow-sm'
                        : 'bg-white text-forest border-gold/60 hover:bg-gold/10'
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    <span>Para Recoger</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('Delivery')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold border-2 transition cursor-pointer ${
                      orderType === 'Delivery'
                        ? 'bg-gold text-white border-gold shadow-sm'
                        : 'bg-white text-forest border-gold/60 hover:bg-gold/10'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span>Delivery</span>
                  </button>
                </div>
              </div>

              {/* Sección exclusiva para Delivery */}
              {orderType === 'Delivery' && (
                <div className="p-4 rounded-xl bg-soft-gray border border-gray-200 space-y-3 animate-fadeIn">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsStatus.loading}
                    className="w-full flex items-center justify-center gap-2 bg-forest text-white font-bold py-3 px-4 rounded-xl hover:bg-gold hover:text-forest transition cursor-pointer disabled:opacity-60"
                  >
                    {gpsStatus.loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPin className="w-5 h-5 text-gold" />
                    )}
                    <span>
                      {mapsLink ? 'Actualizar ubicación GPS' : 'Compartir mi ubicación actual'}
                    </span>
                  </button>

                  {gpsStatus.message && (
                    <div
                      className={`flex items-center justify-center gap-1.5 text-xs font-medium text-center ${
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

                  <div>
                    <label className="block text-xs font-bold text-forest mb-1">
                      Dirección y referencias de entrega *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      placeholder="Escribe tu sector, calle, número de casa/edificio y puntos de referencia..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-gold text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Campo nuevo: Notas para cocina */}
              <div>
                <label className="block text-sm font-bold text-forest mb-1.5">
                  Notas adicionales (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej. Sin cebolla, salsa aparte, necesito cambio de RD$ 1,000..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gold text-sm resize-none"
                />
              </div>

              {/* Botón Final de Envío */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full flex items-center justify-center gap-2 bg-forest text-white font-extrabold text-lg py-4 rounded-xl border-2 border-gold shadow-lg hover:bg-gold hover:text-forest transition cursor-pointer mt-2"
              >
                <Send className="w-5 h-5" />
                <span>Confirmar y Enviar por WhatsApp</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}