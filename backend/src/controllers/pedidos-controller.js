const supabase = require('../config/supabase')

async function criarPedido(req, res) {
  const { email } = req.cliente;

  let query = supabase
    .from('clientes')
    .select('*')
  if (email) query = query.eq('email', email)

  const { data, error } = await query

  if (data.length === 0) return res.status(404).json({ erro: "Faça login para continuar na sua compra." })
  const cliente_id = data[0].id

  const { itens, observacao } = req.body;

  const { data: pedido, error: erroPedido } = await supabase
    .from('pedidos')
    .insert({
      cliente_id: cliente_id,
      valor_total: 0,
      observacao: observacao
    })
    .select('id, cliente_id, valor_total, observacao, criado_em')

  if (erroPedido) return res.status(500).json({ erro: "Erro ao criar pedido." })

  let valorTotalGeral = 0;
  let itensFormatados = '';

  for (const item of itens) {
    const { data: produto, error: erroProduto } = await supabase
      .from('produtos')
      .select('preco, nome')
      .eq('id', item.produto_id)

    if (erroProduto) return res.status(500).json({ erro: "Erro ao buscar produto." })

    const valor_unitario = produto[0].preco;

    const { data: item_inserido, error: erroInserir } = await supabase
      .from('itens_pedido')
      .insert({
        pedido_id: pedido[0].id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        valor_unitario: valor_unitario,
        valor_total: (valor_unitario * item.quantidade)
      })

    if (erroInserir) return res.status(500).json({ erro: "Erro ao inserir o item no pedido." })

    valorTotalGeral += (valor_unitario * item.quantidade);

    itensFormatados += `. ${produto[0].nome.substring(0, 25)} x${item.quantidade} = R$ ${(valor_unitario * item.quantidade).toFixed(2)}\n`
  }

  const { data: pedidoAtualizado, error: erroAtualizar } = await supabase
    .from('pedidos')
    .update({ valor_total: valorTotalGeral })
    .eq('id', pedido[0].id)

  if (erroAtualizar) return res.status(500).json({ erro: "Erro ao atualizar o valor total do pedido." })

  const mensagemFormatada = `Pedido N° ${pedido[0].id}\n
Cliente: ${data[0].nome}\n
${itensFormatados}
Total: R$ ${valorTotalGeral.toFixed(2)}\n
Obs: ${observacao}`

  const link = `https://wa.me/553584693046?text=${encodeURIComponent(mensagemFormatada)}`

  res.status(201).json({ mensagem: "Pedido realizado com sucesso!", link })
}

module.exports = { criarPedido }