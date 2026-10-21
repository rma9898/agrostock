import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    // 2. Buscar o usuário apenas pelo e-mail
    const [rows] = await db.execute(
      'SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      const usuario = rows[0];

      // 3. Comparar a senha digitada com o HASH salvo no banco
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (senhaCorreta) {
        return NextResponse.json({
          success: true,
          usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
        });
      }
    }

    return NextResponse.json(
      { success: false, message: 'E-mail ou senha inválidos' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
