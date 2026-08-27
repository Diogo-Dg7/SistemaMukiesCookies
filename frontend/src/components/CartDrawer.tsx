import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, total } = useCart();
  if (!isOpen) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="cart-drawer__overlay" onClick={() => setIsOpen(false)}>
      <aside className="cart-drawer" aria-label="Resumo do pedido" onClick={(event) => event.stopPropagation()}>
        <header className="cart-drawer__header">
          <div><p>SEU MOMENTO MUKIES</p><h2><ShoppingBag size={25} /> Seu pedido</h2></div>
          <button className="cart-drawer__close" onClick={() => setIsOpen(false)} aria-label="Fechar carrinho"><X size={20} /></button>
        </header>

        <div className="cart-drawer__items">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty"><ShoppingBag size={34} /><strong>{'Seu carrinho est\u00e1 vazio.'}</strong><span>{'Escolha um cookie para come\u00e7ar.'}</span></div>
          ) : cart.map(({ cookie, quantity }) => (
            <article key={cookie.id} className="cart-drawer__item">
              <img src={cookie.imageUrl || 'https://via.placeholder.com/60'} alt={cookie.name} />
              <div className="cart-drawer__item-info">
                <strong>{cookie.name}</strong>
                <span>{formatPrice(cookie.price)}</span>
                <div className="cart-drawer__quantity" aria-label={`Quantidade de ${cookie.name}`}>
                  <button onClick={() => updateQuantity(cookie.id, -1)} aria-label={`Remover uma unidade de ${cookie.name}`}><Minus size={14} /></button>
                  <b>{quantity}</b>
                  <button onClick={() => updateQuantity(cookie.id, 1)} aria-label={`Adicionar uma unidade de ${cookie.name}`}><Plus size={14} /></button>
                </div>
              </div>
              <button className="cart-drawer__remove" onClick={() => removeFromCart(cookie.id)} title="Remover item" aria-label={`Remover ${cookie.name}`}><Trash2 size={17} /></button>
            </article>
          ))}
        </div>

        {cart.length > 0 && <footer className="cart-drawer__footer">
          <div className="cart-drawer__total"><span>Total do pedido</span><strong>{formatPrice(total)}</strong></div>
          <Link to="/cart" className="cart-drawer__checkout" onClick={() => setIsOpen(false)}><ShoppingBag size={18} /> Revisar e finalizar</Link>
        </footer>}
      </aside>
    </div>
  );
};
