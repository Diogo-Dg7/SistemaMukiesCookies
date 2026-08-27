import React, { useEffect, useState } from 'react';
import { Cookie as CookieIcon, PencilLine, Power, PowerOff, Save, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import type { Cookie } from '../../components/CookieCard';

export const ManageCookies: React.FC = () => {
  const [cookies, setCookies] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchCookies = async () => {
    try {
      setLoading(true);
      const response = await api.get<Cookie[]>('/Cookie');
      setCookies(response.data);
    } catch (err) {
      console.error('Erro ao buscar cookies:', err);
      setError('Falha ao carregar a lista de cookies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchCookies(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  };

  const handleEdit = (cookie: Cookie) => {
    setEditingId(cookie.id);
    setName(cookie.name);
    setDescription(cookie.description);
    setPrice(cookie.price);
    setImageUrl(cookie.imageUrl);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { name, description, price: Number(price), imageUrl };

    try {
      if (editingId) await api.put(`/Cookie/${editingId}`, payload);
      else await api.post('/Cookie', payload);
      resetForm();
      await fetchCookies();
    } catch (err) {
      console.error('Erro ao salvar cookie:', err);
      alert('Erro ao salvar cookie. Verifique as credenciais ou os dados digitados.');
    }
  };

  const handleToggleActive = async (cookie: Cookie) => {
    try {
      await api.patch(`/Cookie/${cookie.id}/toggle-status`);
      await fetchCookies();
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      alert('N\u00e3o foi poss\u00edvel alterar o status do cookie.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cookie?')) return;
    try {
      await api.delete(`/Cookie/${id}`);
      await fetchCookies();
    } catch (err) {
      console.error('Erro ao excluir cookie:', err);
      alert('Erro ao excluir cookie.');
    }
  };

  if (loading) return <div style={styles.center}>Carregando painel de cookies...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}><CookieIcon size={26} /> Gerenciamento de Cookies</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{editingId ? 'Editar cookie' : 'Cadastrar novo cookie'}</h3>
        <div style={styles.field}><label>Nome</label><input type="text" value={name} onChange={(event) => setName(event.target.value)} required style={styles.input} /></div>
        <div style={styles.field}><label>{'Descri\u00e7\u00e3o'}</label><textarea value={description} onChange={(event) => setDescription(event.target.value)} required style={styles.textarea} /></div>
        <div style={styles.fieldGroup}>
          <div style={styles.field}><label>{'Pre\u00e7o (R$)'}</label><input type="number" step="0.01" min="0" value={price} onChange={(event) => setPrice(event.target.value)} required style={styles.input} /></div>
          <div style={styles.field}><label>URL da imagem</label><input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} style={styles.input} /></div>
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveButton}><Save size={17} />{editingId ? 'Atualizar' : 'Cadastrar'}</button>
          {editingId && <button type="button" onClick={resetForm} style={styles.cancelButton}><X size={17} />Cancelar</button>}
        </div>
      </form>

      <section style={styles.tableWrapper}>
        <h3>{'Card\u00e1pio cadastrado'}</h3>
        {error && <p style={styles.error}>{error}</p>}
        <table style={styles.table}>
          <thead><tr><th>Foto</th><th>Nome</th><th>{'Pre\u00e7o'}</th><th>Status</th><th>{'A\u00e7\u00f5es'}</th></tr></thead>
          <tbody>
            {cookies.map((cookie) => (
              <tr key={cookie.id}>
                <td><img src={cookie.imageUrl || 'https://via.placeholder.com/40'} alt={cookie.name} style={styles.thumb} /></td>
                <td>{cookie.name}</td>
                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cookie.price)}</td>
                <td><span style={cookie.isActive !== false ? styles.activeBadge : styles.inactiveBadge}>{cookie.isActive !== false ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                  <div style={styles.actions}>
                    <button type="button" onClick={() => handleEdit(cookie)} style={styles.editButton} title="Editar cookie" aria-label={`Editar ${cookie.name}`}><PencilLine size={17} /></button>
                    <button type="button" onClick={() => handleToggleActive(cookie)} style={styles.statusButton} title={cookie.isActive !== false ? 'Desativar cookie' : 'Ativar cookie'} aria-label={`${cookie.isActive !== false ? 'Desativar' : 'Ativar'} ${cookie.name}`}>{cookie.isActive !== false ? <PowerOff size={17} /> : <Power size={17} />}</button>
                    <button type="button" onClick={() => handleDelete(cookie.id)} style={styles.deleteButton} title="Excluir cookie" aria-label={`Excluir ${cookie.name}`}><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '32px 16px', color: '#4a3027' },
  center: { textAlign: 'center', padding: '40px', color: '#754737' },
  pageTitle: { display: 'flex', alignItems: 'center', gap: '10px', color: '#663524' },
  form: { backgroundColor: '#fffaf3', padding: '24px', borderRadius: '18px', border: '1px solid #f0dec9', boxShadow: '0 8px 22px rgba(89, 45, 25, .08)', marginBottom: '28px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', flex: 1, fontWeight: 650 },
  fieldGroup: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  input: { padding: '10px 12px', borderRadius: '9px', border: '1px solid #dec6ac', background: '#fffefd', color: '#4a3027' },
  textarea: { padding: '10px 12px', borderRadius: '9px', border: '1px solid #dec6ac', background: '#fffefd', minHeight: '68px', resize: 'vertical', color: '#4a3027' },
  buttonGroup: { display: 'flex', gap: '10px' },
  saveButton: { display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: '#b96535', color: '#fff9f0', border: 'none', padding: '10px 17px', borderRadius: '9px', fontWeight: 700, cursor: 'pointer' },
  cancelButton: { display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: '#eee1d4', color: '#684132', border: 'none', padding: '10px 17px', borderRadius: '9px', fontWeight: 700, cursor: 'pointer' },
  tableWrapper: { backgroundColor: '#fffaf3', padding: '24px', borderRadius: '18px', border: '1px solid #f0dec9', boxShadow: '0 8px 22px rgba(89, 45, 25, .08)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px' },
  thumb: { width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 3px 8px rgba(70, 35, 20, .16)' },
  activeBadge: { color: '#2e7b49', background: '#e2f3e6', borderRadius: '999px', padding: '5px 10px', fontWeight: 750, fontSize: '0.85rem' },
  inactiveBadge: { color: '#a04b3e', background: '#fbe7e2', borderRadius: '999px', padding: '5px 10px', fontWeight: 750, fontSize: '0.85rem' },
  actions: { display: 'flex', alignItems: 'center', gap: '8px' },
  editButton: { display: 'grid', placeItems: 'center', width: '34px', height: '34px', border: '1px solid #e8c29a', borderRadius: '10px', background: '#fff1dd', color: '#a8542e', cursor: 'pointer' },
  statusButton: { display: 'grid', placeItems: 'center', width: '34px', height: '34px', border: '1px solid #bad9c3', borderRadius: '10px', background: '#e8f6eb', color: '#337a4c', cursor: 'pointer' },
  deleteButton: { display: 'grid', placeItems: 'center', width: '34px', height: '34px', border: '1px solid #edc0b8', borderRadius: '10px', background: '#fff0ed', color: '#b34d43', cursor: 'pointer' },
  error: { color: '#a33f32', background: '#fff0ed', padding: '10px 12px', borderRadius: '9px' },
};
