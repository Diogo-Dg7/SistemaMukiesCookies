import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

interface SaleItem {
  id: string;
  cookieName: string;
  quantity: number;
  unitPrice: number;
}

interface Sale {
  id: string;
  customerName: string;
  address: string;
  createdAt: string;
  total: number;
  items: SaleItem[];
}

export const SalesHistory: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const response = await api.get<Sale[]>('/sales');
        setSales(response.data);
      } catch (err) {
        console.error('Erro ao buscar histórico de vendas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Carregando vendas...</div>;

  return (
    <div style={styles.container}>
      <h1>Histórico de Vendas 📊</h1>

      {sales.length === 0 ? (
        <p style={{ marginTop: '24px' }}>Nenhuma venda registrada ainda.</p>
      ) : (
        <div style={styles.list}>
          {sales.map((sale) => (
            <div key={sale.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <strong>Cliente: {sale.customerName}</strong>
                  <div style={styles.date}>{formatDate(sale.createdAt)}</div>
                </div>
                <strong style={{ color: '#d97706', fontSize: '1.2rem' }}>
                  {formatPrice(sale.total)}
                </strong>
              </div>
              <p style={styles.address}>📍 {sale.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: '0.85rem', color: '#777', marginTop: '4px' },
  address: { fontSize: '0.9rem', color: '#555', marginTop: '12px' },
};