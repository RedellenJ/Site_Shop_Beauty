const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000
require('dotenv').config()
const supabase = require('./supabase')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verificaLogin = require('./middleware')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor rodando!' })
})

app.get('/produtos', async (req, res) => {

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .not('imagem_url', 'is', null)

    if (error) return res.status(500).json({ erro: "Erro ao buscar produtos! Tente novamente." })
  res.json(data)
})

app.get('/filtroProduto', async (req, res) => {
  const { marca, preco, categoria } = req.query

  let query = supabase
    .from('produtos')
    .select('id, nome, preco, descricao, imagem_url, categoria, marca')

    if (marca) query = query.eq('marca', marca)
    if (preco) query = query.eq('preco', preco)
    if (categoria) query = query.eq('categoria', categoria)

  const { data, error } = await query

    if (error) return res.status(500).json({erro: "Erro ao filtrar produtos! Tente novamente." })
  res.json(data)
})

app.get('/filtroProdutoNome', async (req, res) => {
  const { nome } = req.query
  
  let query = supabase
    .from('produtos')
    .select('id, nome, preco, descricao, imagem_url, categoria, marca')
    .ilike('nome', `%${nome}%`)

  const { data, error } = await query

    if (error) return res.status(500).json({erro: "Erro ao encontrar o produto! Tente novamente." })
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
    if (error) return res.status(500).json({erro: "Erro ao realizar o login." })

      if (data.length === 0) return res.status(404).json({ erro: "Usuário não encontrado! Faça seu cadastro ou tente novamente." })

    const resultado = await bcrypt.compare(senha, data[0].senha)
      if (resultado != true) return res.status(401).json({ erro: "Senha incorreta! Tente novamente." })

    const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '6h'})

  res.json({ token, nome: data[0].nome, email: data[0].email, mensagem: "Login realizado com sucesso!" })
})

app.post('/recuperarSenha', async (req, res) => {
    const { email } = req.body;

    let query = supabase
      .from('clientes')
      .select('*')
        if (email) query = query.eq('email', email)

    const { data, error } = await query

      if (data.length === 0) return res.status(404).json({ erro: "E-mail informado incorretamente! Confira e tente novamente." })

    const token = crypto.randomBytes(32).toString('hex')
    const expira = new Date(Date.now() + 60 * 60 * 1000)

    const { data: email_digitado , error: erroEmail } = await supabase
        .from('clientes')
        .update({reset_token: token,
                 reset_token_expira: expira
               })
        .eq('email', email)

        if (erroEmail) return res.status(500).json({ erro: "Erro ao gerar o token." })
        
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const opcoes = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de senha - Shop Beauty',
    html: `
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="http://localhost:5500/resetarSenha.html?token=${token}">
        Redefinir senha
      </a>
      <p>Este link expira em 1 hora.</p>`
}

  try {
    await transporter.sendMail(opcoes)
    res.status(201).json({ mensagem: "O e-mail para a recuperação da senha foi enviado!" })
  } catch (erroEnvio) {
    res.status(500).json({ erro: "Erro ao enviar o e-mail. Tente novamente." })
  }

})

app.post('/resetarSenha', async (req, res) => {
    const { senha, token } = req.body;

    let query = supabase
      .from('clientes')
      .select('*')
        if (token) query = query.eq('reset_token', token)

    const { data, error } = await query
      if (data.length === 0) return res.status(401).json({ erro: "Erro ao redefinir sua senha! Tente novamenmte." })

        if (new Date(data[0].reset_token_expira) < new Date()) return res.status(401).json({ erro: "Seu token está expirado! Tente novamenmte." })

    const saltRounds = 10;
    const hash = await bcrypt.hash(senha, saltRounds);

    const { data: senha_digitada , error: erroSenha } = await supabase
        .from('clientes')
        .update({senha: hash,
               })
        .eq('reset_token', token)
    
        if (erroSenha) return res.status(500).json({ erro: "Erro ao atualizar a senha!" })

    const { data: token_zerado , error: erroToken } = await supabase
        .from('clientes')
        .update({reset_token: null,
                 reset_token_expira: null
               })
        .eq('reset_token', token)

        if (erroToken) return res.status(500).json({ erro: "Erro ao limpar o token!" })

  res.status(201).json({ mensagem: "Senha alterada com sucesso!" })            
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
    let itensFormatados = '';

    for (const item of itens){
      const { data: produto, error: erroProduto } = await supabase
        .from('produtos')
        .select('preco, nome')
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

  res.status(201).json({ mensagem: "Pedido realizado com sucesso!", link})
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
