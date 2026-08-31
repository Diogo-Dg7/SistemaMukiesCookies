import React from 'react';

export interface Cookie {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive?: boolean;
}

interface CookieCardProps {
  cookie: Cookie;
  onAddToCart?: (cookie: Cookie) => void;
}

export const CookieCard: React.FC<CookieCardProps> = ({ cookie, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div style={styles.card}>
      <img
        src={cookie.imageUrl || 'https://via.placeholder.com/300x200?text=Mukies+Cookie'}
        alt={cookie.name}
        style={styles.image}
      />
      <div style={styles.content}>
        <h3 style={styles.title}>{cookie.name}</h3>
        <p style={styles.description}>{cookie.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{formatPrice(cookie.price)}</span>
          {onAddToCart && (
            <button style={styles.button} onClick={() => onAddToCart(cookie)} aria-label={`Adicionar ${cookie.name} ao carrinho`}>
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1,
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#333',
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#d97706',
  },
  button: {
    backgroundColor: '#d97706',
    color: '#fff',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
