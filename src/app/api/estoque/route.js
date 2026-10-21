import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params; // O ID vem da URL
    const { quantidade, data_validade } = await request.json();

    const [result] = await db.execute(
      'UPDATE estoque_usuario SET quantidade = ?, data_validade = ? WHERE id = ?',
      [Number(quantidade), data_validade, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Item não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Estoque atualizado!' });
  } catch (error) {
    console.error('Erro na API PUT:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuario_id = searchParams.get('usuario_id');

    const [rows] = await db.execute(
      `SELECT 
        e.id, 
        p.nome, 
        e.quantidade, 
        p.unidade, 
        COALESCE(p.preco_base, 0) as preco_base, 
        COALESCE((e.quantidade * p.preco_base), 0) as valor_estimado
      FROM estoque_usuario e 
      INNER JOIN produtos p ON e.produto_id = p.id 
      WHERE e.usuario_id = ?`,
      [usuario_id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Convertendo explicitamente para números para evitar erro de tipo no MySQL
    const usuario_id = parseInt(body.usuario_id);
    const produto_id = parseInt(body.produto_id);
    const quantidade = parseFloat(body.quantidade);
    const data_validade = body.data_validade;

    // Log para você monitorar no terminal do VS Code
    console.log('Processando lançamento:', { usuario_id, produto_id, quantidade });

    const [result] = await db.execute(
      'INSERT INTO estoque_usuario (usuario_id, produto_id, quantidade, data_validade) VALUES (?, ?, ?, ?)',
      [usuario_id, produto_id, quantidade, data_validade]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Erro no MySQL AgroStock:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
