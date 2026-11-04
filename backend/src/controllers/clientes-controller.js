const supabase = require('../config/supabase')

async function cadastrarCliente(req, res) {
  const { nome, email, telefone, senha } = req.body;

  const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome: nome,
          telefone
        }
      }
    })

  if (error) return res.status(500).json({ erro: error.message })

  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" })
}

async function loginCliente(req, res) {
  const { email, senha } = req.body;

  const { data,  error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  })

  if (error) {
    return res.status(401).json({ erro: "Dados incorretos! Tente novamente." })
  }

  const token = data.session.access_token;
  const nome = data.user.user_metadata?.nome || "";

  res.json({
    token,
    nome,
    email: data.user.email,
    mensagem: "Login realizado com sucesso!"
  })
}

async function recuperarSenha(req, res) {
  const { email } = req.body;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://site-shop-beauty.onrender.com/resetar-senha.html'
  })

  if (error) {
    return res.status(400).json({ erro: "Erro ao enviar e-mail de recuperação. Verifique se o e-mail está registrado."})
  }
  
  return res.status(200).json({ mensagem: "E-mail de recuperação enviado com sucesso!" })
}

async function resetarSenha(req, res) {
  const { senha, acessToken } = req.body;

  if (!acessToken) {
    return res.status(401).json({ erro: "Token de acesso não encontrado ou expirado." })
  }
  
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: acessToken,
    refresh_token: ''
  })

  if (sessionError) return res.status(401).json({ erro: "Sessão inválida ou expirda. Solicte uma nova recuperação." })
  
  const { error } = await supabase.auth.updateUser({ password: senha })

  if (error) {
    return res.status(500).json({ erro: "Erro ao atualizar a senha." })
  }

  res.status(200).json({ mensagem: "Senha alterada com sucesso!" })
}

module.exports = { cadastrarCliente, loginCliente, recuperarSenha, resetarSenha }