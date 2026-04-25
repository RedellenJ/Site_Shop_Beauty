const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
require('dotenv').config()
const supabase = require('./supabase')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verificaLogin = require('./middleware')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor rodando!' })
})

app.get('/produtos', async (req, res) => {

  const { data, error } = await supabase
    .from('produtos')
    .select('*')

    if (error) return res.status(500).json({ erro: "Erro ao buscar produtos! Tente novamente." })
  res.json(data)
})

app.get('/filtroProduto', async (req, res) => {
  const { marca, preco, categoria } = req.query

  let query = supabase
    .from('produtos')
    .select('nome, preco, descricao, imagem_url, categoria, marca')

    if (marca) query = query.eq('marca', marca)
    if (preco) query = query.eq('preco', preco)
    if (categoria) query = query.eq('categoria', categoria)

  const { data, error } = await query

    if (error) return res.status(500).json({erro: "Erro ao filtrar produtos! Tente novamente." })
  res.json(data)
})

app.post('/cadastroClientes', async (req, res) => {
    const { nome, email, telefone, senha } = req.body;

    const saltRounds = 10;
    const hash = await bcrypt.hash(senha, saltRounds);
    
    const { data, error } = await supabase
      .from('clientes')
      .insert({nome: nome, 
              email: email,
              telefone: telefone,
              senha: hash
             })

    if (error) return res.status(500).json({ erro: "Erro ao realizar cadastro! Tente novamente." })
  
  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" }) 
})

app.post('/loginClientes', async (req, res) => {
    const { email, senha } = req.body;

    let query = supabase
      .from('clientes')
      .select('*')
        if (email) query = query.eq('email', email)

    const { data, error } = await query

      if (data.length === 0) return res.status(404).json({ erro: "Usuário não encontrado! Faça seu cadastro ou tente novamente." })

    const resultado = await bcrypt.compare(senha, data[0].senha)
      if (resultado != true) return res.status(401).json({ erro: "Senha incorreta! Tente novamente." })
    
    const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '6h'})
    
  res.json({ token, mensagem: "Login realizado com sucesso!" })
})

app.post('/pedidos', verificaLogin, async (req, res) => {
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
      .insert({cliente_id: cliente_id,
               valor_total: 0,
               observacao: observacao
             })
      .select('id, cliente_id, valor_total, observacao, criado_em')

      if (erroPedido) return res.status(500).json({ erro: "Erro ao criar pedido." })

    let valorTotalGeral = 0;
    
    for (const item of itens){
      const { data: produto, error: erroProduto } = await supabase
        .from('produtos')
        .select('preco')
        .eq('id', item.produto_id)

        if (erroProduto) return res.status(500).json({ erro: "Erro ao buscar produto." })

      const valor_unitario = produto[0].preco;  

      const { data: item_inserido, error: erroInserir } = await supabase
        .from('itens_pedido')
        .insert({pedido_id: pedido[0].id, 
                 produto_id: item.produto_id,
                 quantidade: item.quantidade,
                 valor_unitario: valor_unitario,
                 valor_total: (valor_unitario * item.quantidade)
               })

        if (erroInserir) return res.status(500).json({ erro: "Erro ao inserir o item no pedido." })

        valorTotalGeral += (valor_unitario * item.quantidade);
    }

    const { data: pedidoAtualizado, error: erroAtualizar } = await supabase
      .from('pedidos')
      .update({ valor_total: valorTotalGeral })
      .eq('id', pedido[0].id)

      if (erroAtualizar) return res.status(500).json({ erro: "Erro ao atualizar o valor total do pedido." })

  res.status(201).json({ mensagem: "Pedido realizado com sucesso!" }) 
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})