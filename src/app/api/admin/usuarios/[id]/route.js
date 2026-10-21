import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Executa a exclusão no banco de dados agrostock
    const [result] = await db.execute('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário removido com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error.message);
    return NextResponse.json({ error: 'Erro interno ao deletar usuário' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { perfil } = await request.json();

    await db.execute('UPDATE usuarios SET perfil = ? WHERE id = ?', [perfil, id]);

    return NextResponse.json({ success: true, message: 'Perfil atualizado!' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
