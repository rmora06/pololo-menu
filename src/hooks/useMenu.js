import { useState, useEffect } from 'react';

const SHEET_ID =
  import.meta.env.VITE_SHEET_ID || '1ka9ezOL7_67hGvu6pZRtJq0LGcE5rqTxkkvq-PnGoRE';

export function useMenu() {
  const [menuData, setMenuData] = useState({});
  const [categories, setCategories] = useState([]);
  const [specialOffer, setSpecialOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&_=${Date.now()}`;
        const res = await fetch(url);
        const text = await res.text();

        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('Formato inválido desde Google Sheets');
        }

        const json = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
        const rows = json?.table?.rows || [];

        const groupedMenu = {};
        let offerFound = null;

        rows.forEach((fila, index) => {
          if (!fila.c || !fila.c[0]) return;

          const categoriaRaw = fila.c[0]?.v?.toString().trim() || '';
          const nombre = fila.c[1]?.v?.toString().trim() || '';
          const descripcion = fila.c[2]?.v?.toString().trim() || '';
          const precio = Number(fila.c[3]?.v) || 0;
          const imagen = fila.c[4]?.v?.toString().trim() || '';
          const disponible = fila.c[5]?.v?.toString().toUpperCase().trim() || 'NO';

          if (disponible === 'SI' && categoriaRaw && nombre) {
            // Si la categoría en el Sheet es "OFERTA", la guardamos para el Modal y no como sección del menú
            if (categoriaRaw.toUpperCase() === 'OFERTA') {
              offerFound = {
                id: `oferta-${index}`,
                nombre,
                descripcion,
                precio,
                imagen,
              };
              return;
            }

            const categoriaNombre = categoriaRaw
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

            if (!groupedMenu[categoriaNombre]) {
              groupedMenu[categoriaNombre] = [];
            }

            groupedMenu[categoriaNombre].push({
              id: `${categoriaRaw}-${index}`,
              categoria: categoriaNombre,
              nombre,
              descripcion,
              precio,
              imagen,
            });
          }
        });

        setMenuData(groupedMenu);
        setCategories(Object.keys(groupedMenu));
        setSpecialOffer(offerFound);
      } catch (err) {
        console.error('Error cargando el menú:', err);
        setError('No pudimos cargar el menú en este momento. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menuData, categories, specialOffer, loading, error };
}