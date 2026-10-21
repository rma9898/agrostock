'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importado para navegação interna

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(loggedUser);
      setUser(JSON.parse(loggedUser));

      if (parsedUser.perfil === 'admin') {
        fetch('/api/admin/usuarios')
          .then((res) => res.json())
          .then((data) => setListaUsuarios(data))
          .catch((err) => console.error('Erro ao carregar usuários', err));
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <p className="p-10 text-center">Verificando acesso...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 AgroStock</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Bem-vindo, <strong>{user.nome}</strong>
            <span className="ml-2 px-2 py-0.5 bg-green-900 rounded-full text-xs uppercase">
              {user.perfil}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition">
            Sair
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        {user.perfil === 'admin' ? (
          <AdminView usuarios={listaUsuarios} />
        ) : (
          <UserView userId={user.id} />
        )}
      </main>
    </div>
  );
}

// --- VISÃO DO USUÁRIO COMUM ---
function UserView({ userId }) {
  const [estoque, setEstoque] = useState([]);
  const [valorTotalGeral, setValorTotalGeral] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function carregarMeuEstoque() {
      try {
        const res = await fetch(`/api/estoque?usuario_id=${userId}`);
        const data = await res.json();
        setEstoque(data);

        const total = data.reduce((acc, item) => {
          const valor = parseFloat(item.valor_estimado) || 0;
          return acc + valor;
        }, 0);

        setValorTotalGeral(total);
      } catch (err) {
        console.error('Erro ao carregar estoque.');
      }
    }
    carregarMeuEstoque();
  }, [userId]);

  const handleExcluir = async (id) => {
    if (confirm('Deseja remover este insumo?')) {
      const res = await fetch(`/api/estoque/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEstoque(estoque.filter((item) => item.id !== id));
        alert('Item removido!');
      }
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="space-y-6">
      {/* Card de Valor de Patrimônio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-green-100 text-xs font-bold uppercase tracking-wider">
            Patrimônio em Insumos
          </h3>
          <p className="text-3xl font-black mt-2">{formatarMoeda(valorTotalGeral)}</p>
          <span className="text-xs text-green-200">Baseado no preço de catálogo global</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Meu Inventário Agrícola</h2>
          <Link href="/dashboard/novo-insumo">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-bold shadow-md">
              + Novo Lançamento
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Insumo</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4">Preço Unit.</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {estoque.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{item.nome}</td>
                  <td className="p-4 text-gray-600">
                    {item.quantidade} {item.unidade}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{formatarMoeda(item.preco_base)}</td>
                  <td className="p-4 font-bold text-green-700">
                    {formatarMoeda(item.valor_estimado)}
                  </td>
                  <td className="p-4 text-center space-x-3">
                    <Link href={`/dashboard/editar-insumo/${item.id}`}>
                      <button className="text-blue-600 hover:underline font-semibold text-sm">
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleExcluir(item.id)}
                      className="text-red-600 hover:underline font-semibold text-sm">
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

// --- VISÃO DO ADMINISTRADOR ---
function AdminView({ usuarios = [] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Painel do Gestor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
          <h3 className="text-gray-500 font-bold uppercase text-xs">Total de Usuários</h3>
          <p className="text-3xl font-black mt-2">{usuarios.length}</p>
          <Link
            href="/admin/usuarios"
            className="mt-4 inline-block text-blue-600 text-sm font-bold hover:underline">
            Ver todos os usuários →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600">
          <h3 className="text-gray-500 font-bold uppercase text-xs">Produtos Ativos</h3>
          <p className="text-3xl font-black mt-2">48</p>
          <Link
            href="/produtos"
            className="mt-4 inline-block text-green-600 text-sm font-bold hover:underline">
            Gerenciar Catálogo →
          </Link>
        </div>
      </div>
    </div>
  );
}
