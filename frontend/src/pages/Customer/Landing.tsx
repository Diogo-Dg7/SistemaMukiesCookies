import { ArrowRight, Cookie, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Landing.css';

const whatsapp = (import.meta.env.VITE_ADMIN_WHATSAPP ?? '').replace(/\D/g, '');

export const Landing = () => (
  <main className="landing">
    <nav className="landing__nav">
      <div className="landing__brand"><img src="/mukies-logo.jpeg" alt="Mukies Cookies" /><span>Mukies Cookies<small>feito com afeto</small></span></div>
      <Link to="/login" className="landing__login">Entrar</Link>
    </nav>

    <section className="landing__hero">
      <div className="landing__copy">
        <p className="landing__eyebrow"><Sparkles size={14} /> FORNADAS ARTESANAIS</p>
        <h1>Um carinho em forma de <em>cookie.</em></h1>
        <p>Cookies artesanais, recheios generosos e aquele cheirinho que deixa qualquer dia mais gostoso.</p>
        <div className="landing__actions"><Link to="/login" className="landing__primary"><Cookie size={19} /> Ver cardápio <ArrowRight size={18} /></Link>{whatsapp && <a className="landing__secondary" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar no WhatsApp</a>}</div>
      </div>
      <div className="landing__cookie-art" aria-hidden="true"><span>{String.fromCodePoint(0x1f36a)}</span><i></i><b></b><strong></strong></div>
    </section>

    <section className="landing__highlights" aria-label="Destaques Mukies">
      <article><Cookie size={21} /><h2>Feitos à mão</h2><p>Receitas preparadas em pequenas fornadas.</p></article>
      <article><Heart size={21} /><h2>Recheio de verdade</h2><p>Sabores que deixam vontade de repetir.</p></article>
      <article><MessageCircle size={21} /><h2>Pedido fácil</h2><p>Escolha, finalize e envie pelo WhatsApp.</p></article>
    </section>
  </main>
);
