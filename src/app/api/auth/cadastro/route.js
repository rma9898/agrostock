import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { nome, email, senha, perfil } = await request.json();

    // 1. Verificar se o usuário já existe
    const [existente] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existente.length > 0) {
      return NextResponse.json({ message: 'E-mail já cadastrado' }, { status: 400 });
    }

    // 2. Gerar o Hash da senha (Segurança)
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Inserir no banco de dados (Create do CRUD)
    const [result] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, perfil || 'comum']
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: 'Usuário criado com sucesso!',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
