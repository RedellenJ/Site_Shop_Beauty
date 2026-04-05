const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor rodando!' })
})

app.get('/produtos', async (req, res) => {
  const supabase = require('./supabase')
  const { data, error } = await supabase
    .from('produtos')
    .select('*')

  if (error) return res.status(500).json({ erro: error.message })
  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})