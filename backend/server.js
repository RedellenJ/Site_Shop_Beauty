const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
require('dotenv').config()
const supabase = require('./supabase')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
  res.json(data)
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

  res.json({token})
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})