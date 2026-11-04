const supabase = require('../config/supabase')

async function verificaLogin(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ erro: "Token não informado." })
    }

    const token = authorization.split(' ')[1]

    if (!token) {
        return res.status(401).json({ erro: "Formato de token inválido." })
    }

    try {
        
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({ erro: "Token inválido ou expirado." })
        }

        req.cliente = {
            id: user.id,
            email: user.email,
            ...user.user_metadata
        }
        
        next()
    } catch (verify) {
        return res.status(401).json({ erro: "Erro ao autenticar o token." })
    }
}

module.exports = verificaLogin