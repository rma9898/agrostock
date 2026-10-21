'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (data.success) {
        // Armazena os dados do usuário para persistência simples na sessão
        localStorage.setItem('user', JSON.stringify(data.usuario));

        // Redirecionamento baseado no Perfil (Requisito do Projeto)
        if (data.usuario.perfil === 'admin') {
          router.push('/dashboard'); // Você pode filtrar a visão dentro do dashboard
        } else {
          router.push('/dashboard');
        }
      } else {
        setErro(data.message || 'Falha na autenticação');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">AgroStock</h1>
          <p className="text-gray-500 mt-2">Entre com suas credenciais</p>
        </div>

        {erro && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transform active:scale-95 transition duration-200 shadow-md">
            Entrar no Sistema
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <a href="/cadastro" className="text-green-600 font-bold hover:underline">
            Cadastre-se aqui
          </a>
        </div>
      </div>
    </div>
  );
}
