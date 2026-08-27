import { useState } from 'react';
import type { FormEvent } from 'react';
import { Banknote, CheckCircle2, MessageCircle, QrCode } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const adminWhatsApp = (import.meta.env.VITE_ADMIN_WHATSAPP ?? '').replace(/\D/g, '');
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const Cart = () => {
  const { cart, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Dinheiro'>('Pix');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const sendOrder = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!adminWhatsApp) {
      setError('O WhatsApp do administrador ainda não foi configurado.');
      return;
    }
    if (!cart.length) return;
    const items = cart.map(({ cookie, quantity }) => `• ${quantity}x ${cookie.name} — ${money.format(cookie.price * quantity)}`).join('\n');
    const message = `Olá! Novo pedido Mukies 🍪\n\nCliente: ${customerName.trim()}\nPagamento: ${paymentMethod}\n\nItens:\n${items}\n\nTotal: ${money.format(total)}`;
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    clearCart();
    setSent(true);
  };

  if (sent) return <section className="checkout checkout--success"><CheckCircle2 size={50} /><h2>Pedido pronto para enviar!</h2><p>O WhatsApp do atendimento foi aberto com todos os detalhes do seu pedido.</p></section>;

  return <section className="checkout">
    <header><p>SEU MOMENTO MUKIES</p><h1>Revisão do pedido <span>🍪</span></h1></header>
    {!cart.length ? <div className="checkout__empty"><span>🍪</span><h2>Seu carrinho está vazio.</h2><p>Escolha um cookie quentinho na nossa vitrine.</p></div> : <div className="checkout__grid">
      <article className="checkout__card"><h2>Itens escolhidos</h2><div className="checkout__items">{cart.map(({ cookie, quantity }) => <div key={cookie.id}><span><b>{cookie.name}</b><small>{quantity} × {money.format(cookie.price)}</small></span><strong>{money.format(cookie.price * quantity)}</strong></div>)}</div><div className="checkout__total"><span>Total</span><strong>{money.format(total)}</strong></div></article>
      <form className="checkout__card checkout__form" onSubmit={sendOrder}><h2>Finalizar pedido</h2><p>Informe seu nome e como prefere pagar.</p><label>Seu nome<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Como podemos te chamar?" required /></label><fieldset><legend>Forma de pagamento</legend><div className="checkout__payments"><label className={paymentMethod === 'Pix' ? 'selected' : ''}><input type="radio" name="payment" checked={paymentMethod === 'Pix'} onChange={() => setPaymentMethod('Pix')} /><QrCode size={20} /><span>Pix</span></label><label className={paymentMethod === 'Dinheiro' ? 'selected' : ''}><input type="radio" name="payment" checked={paymentMethod === 'Dinheiro'} onChange={() => setPaymentMethod('Dinheiro')} /><Banknote size={20} /><span>Dinheiro</span></label></div></fieldset>{error && <p className="checkout__error">{error}</p>}<button type="submit"><MessageCircle size={20} /> Enviar pedido pelo WhatsApp</button></form>
    </div>}
  </section>;
};
