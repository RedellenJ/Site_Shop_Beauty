const supabase = require('../config/supabase')

async function listarProdutos(req, res) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .not('imagem_url', 'is', null)

  if (error) return res.status(500).json({ erro: "Erro ao buscar produtos! Tente novamente." })
  res.json(data)
}

async function filtrarProduto(req, res) {
  const { marca, preco, categoria } = req.query

  let query = supabase
    .from('produtos')
    .select('id, nome, preco, descricao, imagem_url, categoria, marca')

  if (marca) query = query.eq('marca', marca)
  if (preco) query = query.eq('preco', preco)
  if (categoria) query = query.eq('categoria', categoria)

  const { data, error } = await query

  if (error) return res.status(500).json({ erro: "Erro ao filtrar produtos! Tente novamente." })
  res.json(data)
}

async function filtrarProdutoPorNome(req, res) {
  const { nome } = req.query

  let query = supabase
    .from('produtos')
    .select('id, nome, preco, descricao, imagem_url, categoria, marca')
    .ilike('nome', `%${nome}%`)

  const { data, error } = await query

  if (error) return res.status(500).json({ erro: "Erro ao encontrar o produto! Tente novamente." })
  res.json(data)
}

module.exports = { listarProdutos, filtrarProduto, filtrarProdutoPorNome }