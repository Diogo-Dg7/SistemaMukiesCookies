import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CookieCard } from '../../components/CookieCard';
import type { Cookie } from '../../components/CookieCard';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import './Showcase.css';

export const Showcase = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadCookies() {
      try {
        const response = await api.get<Cookie[]>('/Cookie');
        setCookies(response.data.filter((cookie) => cookie.isActive !== false));
      } catch (err) {
        const details = err instanceof Error ? err.message : 'erro desconhecido';
        console.error('Erro ao buscar cookies:', err);
        setError(`N\u00e3o foi poss\u00edvel carregar a vitrine (${details}).`);
      } finally {
        setLoading(false);
      }
    }

    void loadCookies();
  }, []);

  const visibleCookies = useMemo(
    () => cookies.filter((cookie) => `${cookie.name} ${cookie.description}`.toLowerCase().includes(search.toLowerCase())),
    [cookies, search],
  );

  return (
    <section className="showcase">
      <div className="showcase__menu" id="cardapio">
        <div className="showcase__menu-head">
          <div>
            <p className="showcase__eyebrow">{'NOSSO CARD\u00c1PIO'}</p>
            <h2>{'Del\u00edcias feitas para voc\u00ea'}</h2>
          </div>
          <label className="showcase__search">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar um sabor..." />
          </label>
        </div>

        {loading && <div className="showcase__state">{'A cozinha est\u00e1 preparando a vitrine...'}</div>}
        {error && <div className="showcase__state showcase__state--error">{error}</div>}
        {!loading && !error && visibleCookies.length === 0 && (
          <div className="showcase__empty">
            <span>{String.fromCodePoint(0x1f36a)}</span>
            <h3>{cookies.length ? 'N\u00e3o encontramos esse sabor.' : 'A pr\u00f3xima fornada est\u00e1 chegando.'}</h3>
            <p>{cookies.length ? 'Tente buscar por outro nome.' : 'Em breve teremos cookies quentinhos na vitrine.'}</p>
          </div>
        )}
        {!loading && !error && visibleCookies.length > 0 && (
          <div className="showcase__grid">
            {visibleCookies.map((cookie) => <CookieCard key={cookie.id} cookie={cookie} onAddToCart={addToCart} />)}
          </div>
        )}
      </div>
    </section>
  );
};
