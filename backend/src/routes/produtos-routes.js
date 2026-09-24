const express = require('express')
const router = express.Router()

const {
  listarProdutos,
  filtrarProduto,
  filtrarProdutoPorNome
} = require('../controllers/produtos-controller')

router.get('/produtos', listarProdutos)
router.get('/filtroProduto', filtrarProduto)
router.get('/filtroProdutoNome', filtrarProdutoPorNome)

module.exports = router