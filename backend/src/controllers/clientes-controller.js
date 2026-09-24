const supabase = require('../config/supabase')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

async function cadastrarCliente(req, res) {
  const { nome, email, telefone, senha } = req.body;

  const saltRounds = 10;
  const hash = await bcrypt.hash(senha, saltRounds);

  const { data, error } = await supabase
    .from('clientes')
    .insert({
      nome: nome,
      email: email,
      telefone: telefone,
      senha: hash
    })

  if (error) return res.status(500).json({ erro: "Erro ao realizar cadastro! Tente novamente." })

  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" })
}

async function loginCliente(req, res) {
  const { email, senha } = req.body;

  let query = supabase
    .from('clientes')
    .select('*')
  if (email) query = query.eq('email', email)

  const { data, error } = await query
  if (error) return res.status(500).json({ erro: "Erro ao realizar o login." })

  if (data.length === 0) return res.status(404).json({ erro: "Dados incorretos ou não encontrados! Faça seu cadastro ou tente novamente." })

  const resultado = await bcrypt.compare(senha, data[0].senha)
  if (resultado != true) return res.status(401).json({ erro: "Dados incorretos! Tente novamente." })

  const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '6h' })

  res.json({ token, nome: data[0].nome, email: data[0].email, mensagem: "Login realizado com sucesso!" })
}

async function recuperarSenha(req, res) {
  const { email } = req.body;

  let query = supabase
    .from('clientes')
    .select('*')
  if (email) query = query.eq('email', email)

  const { data, error } = await query

  if (data.length === 0) return res.status(404).json({ erro: "Dados incorretos! Confira e tente novamente." })

  const token = crypto.randomBytes(32).toString('hex')
  const expira = new Date(Date.now() + 60 * 60 * 1000)

  const { data: email_digitado, error: erroEmail } = await supabase
    .from('clientes')
    .update({
      reset_token: token,
      reset_token_expira: expira
    })
    .eq('email', email)

  if (erroEmail) return res.status(500).json({ erro: "Erro ao gerar o token." })

  const link = `https://site-shop-beauty.onrender.com/resetarSenha.html?token=${token}`;

  return res.status(200).json({ mensagem: "Link de recuperação gerado!", link })
}

async function resetarSenha(req, res) {
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

  const { data: senha_digitada, error: erroSenha } = await supabase
    .from('clientes')
    .update({
      senha: hash,
    })
    .eq('reset_token', token)

  if (erroSenha) return res.status(500).json({ erro: "Erro ao atualizar a senha!" })

  const { data: token_zerado, error: erroToken } = await supabase
    .from('clientes')
    .update({
      reset_token: null,
      reset_token_expira: null
    })
    .eq('reset_token', token)

  if (erroToken) return res.status(500).json({ erro: "Erro ao limpar o token!" })

  res.status(201).json({ mensagem: "Senha alterada com sucesso!" })
}

module.exports = { cadastrarCliente, loginCliente, recuperarSenha, resetarSenha }