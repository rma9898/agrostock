'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Proteção: Verifica se quem está acessando é realmente ADMIN
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser || loggedUser.perfil !== 'admin') {
      alert('Acesso negado!');
      router.push('/dashboard');
      return;
    }

    async function buscarUsuarios() {
      const res = await fetch('/api/admin/usuarios');
      const data = await res.json();
      setUsuarios(data);
    }
    buscarUsuarios();
  }, [router]);

  const excluirUsuario = async (id) => {
    if (
      confirm('Deseja realmente excluir este usuário? Todos os dados vinculados serão apagados.')
    ) {
      const res = await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link href="/dashboard" className="text-green-700 hover:underline text-sm">
              ← Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Gestão de Usuários</h1>
          </div>
        </header>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Perfil</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.nome}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${u.perfil === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.perfil}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => excluirUsuario(u.id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
