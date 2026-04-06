const express = require('express')
const app = express()
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
  const { marca } = req.query

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('marca', marca)

  if (error) return res.status(500).json({erro: error.message })
  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})