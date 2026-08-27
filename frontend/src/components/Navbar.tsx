import { useState } from 'react';
import { History, Home, LayoutDashboard, LogOut, Menu, PackageOpen, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const items = [
  { to: '/', label: 'In\u00edcio', icon: Home, end: true },
  { to: '/cardapio', label: 'Card\u00e1pio', icon: Menu },
  { to: '/cart', label: 'Meu pedido', icon: ShoppingBag },
  { to: '/admin/sales', label: 'Hist\u00f3rico', icon: History },
];

export const Navbar = () => {
  const { cart, setIsOpen } = useCart();
  const { isAdmin, logout, user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside
      className={`side-menu notranslate ${expanded ? 'side-menu--expanded' : ''}`}
      translate="no"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="side-menu__top">
        <NavLink className="side-menu__brand" to="/" aria-label="Mukies - In\u00edcio">
          <img className="side-menu__brand-logo" src="/mukies-logo.jpeg" alt="Logo Mukies Cookies" />
          <span className="side-menu__label">Mukies <small>cookies feitos para viciar</small></span>
        </NavLink>
        <button className="side-menu__toggle" onClick={() => setExpanded((value) => !value)} aria-label="Abrir ou fechar menu">
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="side-menu__nav" aria-label="Navega\u00e7\u00e3o principal">
        {[...items, ...(isAdmin ? [{ to: '/admin/cookies', label: 'Gerenciar card\u00e1pio', icon: LayoutDashboard }] : [])].map(({ to, label, icon: Icon, end }) => (
          <NavLink key={label} to={to} end={end} className={({ isActive }) => `side-menu__item ${isActive ? 'side-menu__item--active' : ''}`}>
            <Icon size={20} strokeWidth={2.1} />
            <span className="side-menu__label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-menu__bottom">
        <button className="side-menu__item side-menu__cart" onClick={() => setIsOpen(true)}>
          <span className="side-menu__cart-icon"><ShoppingCart size={20} />{totalItems > 0 && <b>{totalItems}</b>}</span>
          <span className="side-menu__label">Carrinho</span>
          {expanded && <span className="side-menu__total">{totalItems} item{totalItems === 1 ? '' : 's'}</span>}
        </button>
        <div className="side-menu__footer"><PackageOpen size={16} /><span className="side-menu__label">fornadas fresquinhas</span></div>
        <button className="side-menu__logout" onClick={logout} title="Sair da conta"><LogOut size={17} /><span className="side-menu__label">Sair{user ? ` (${user.name})` : ''}</span></button>
      </div>
    </aside>
  );
};
