import React, { useState } from 'react';
import { Cookie, LockKeyhole, UserRound } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './Login.css';

const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') await api.post('/Auth/register', { username, password });
      const response = await api.post<{ token: string }>('/Auth/login', { username, password });
      login(response.data.token);
      const payload = JSON.parse(atob(response.data.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>;
      navigate((payload[roleClaim] ?? payload.role) === 'Admin' ? '/admin/cookies' : '/cardapio', { replace: true });
    } catch (requestError) {
      console.error('Erro de autentica\u00e7\u00e3o:', requestError);
      setError(mode === 'register' ? 'N\u00e3o foi poss\u00edvel criar sua conta. O usu\u00e1rio pode j\u00e1 existir.' : 'Usu\u00e1rio ou senha inv\u00e1lidos.');
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to={user.role === 'Admin' ? '/admin/cookies' : '/cardapio'} replace />;

  return (
    <main className="auth-page">
      <section className="auth-card">
        <img className="auth-card__logo" src="/mukies-logo.jpeg" alt="Mukies Cookies" />
        <p className="auth-card__eyebrow">COOKIES FEITOS PARA VICIAR</p>
        <h1>{mode === 'login' ? 'Que bom ter voc\u00ea por aqui.' : 'Crie sua conta Mukies.'}</h1>
        <p className="auth-card__subtitle">{mode === 'login' ? 'Entre para ver o card\u00e1pio e fazer seu pedido.' : 'Seu cadastro \u00e9 r\u00e1pido e libera o card\u00e1pio.'}</p>

        <div className="auth-card__tabs">
          <button type="button" className={mode === 'login' ? 'auth-card__tab auth-card__tab--active' : 'auth-card__tab'} onClick={() => setMode('login')}>Entrar</button>
          <button type="button" className={mode === 'register' ? 'auth-card__tab auth-card__tab--active' : 'auth-card__tab'} onClick={() => setMode('register')}>Criar conta</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-card__form">
          {error && <div className="auth-card__error">{error}</div>}
          <label><span><UserRound size={16} /> {'Usu\u00e1rio'}</span><input value={username} onChange={(event) => setUsername(event.target.value)} minLength={3} autoComplete="username" placeholder="Como quer ser chamado?" required /></label>
          <label><span><LockKeyhole size={16} /> Senha</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === 'register' ? 6 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Sua senha" required /></label>
          <button className="auth-card__submit" disabled={loading} type="submit"><Cookie size={18} />{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar no card\u00e1pio' : 'Criar conta e entrar'}</button>
        </form>
      </section>
    </main>
  );
};
