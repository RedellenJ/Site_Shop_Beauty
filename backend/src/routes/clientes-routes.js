const express = require('express')
const router = express.Router()

const {
  cadastrarCliente,
  loginCliente,
  recuperarSenha,
  resetarSenha
} = require('../controllers/clientes-controller')

router.post('/cadastroClientes', cadastrarCliente)
router.post('/loginClientes', loginCliente)
router.post('/recuperarSenha', recuperarSenha)
router.post('/resetarSenha', resetarSenha)

module.exports = router