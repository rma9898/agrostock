import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Busca todos os usuários, exceto a senha (por segurança)
    const [rows] = await db.execute('SELECT id, nome, email, perfil, created_at FROM usuarios');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
