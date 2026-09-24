const express = require('express')
const router = express.Router()

const verificaLogin = require('../middlewares/auth')
const { criarPedido } = require('../controllers/pedidos-controller')

router.post('/pedidos', verificaLogin, criarPedido)

module.exports = router