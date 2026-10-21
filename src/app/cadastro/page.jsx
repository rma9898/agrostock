'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', perfil: 'comum' });
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      alert('Cadastro realizado! Agora faça login.');
      router.push('/login');
    } else {
      setMensagem(data.message || 'Erro ao cadastrar');
    }
  };

  return (
    <main className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Criar Conta AgroStock</h1>

      {mensagem && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">{mensagem}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-6 rounded-lg bg-white">
        <div>
          <label className="block text-sm font-medium">Nome Completo</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">E-mail</label>
          <input
            type="email"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Perfil de Acesso</label>
          <select
            className="w-full border p-2 rounded"
            onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}>
            <option value="comum">Produtor (Comum)</option>
            <option value="admin">Gestor (Admin)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Cadastrar
        </button>
      </form>
    </main>
  );
}
