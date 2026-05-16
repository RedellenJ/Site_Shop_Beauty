const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000
require('dotenv').config()
const supabase = require('./supabase')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor rodando!' })
})

app.get('/produtos', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')

  if (error) return res.status(500).json({ erro: error.message })
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

  if (error) return res.status(500).json({erro: error.message })
  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})