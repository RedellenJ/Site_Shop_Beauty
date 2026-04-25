const jwt = require('jsonwebtoken')

function verificaLogin(req, res, next) {
    const authorization = req.headers.authorization

    if (!authorization) return res.status(401).json({ erro: "Token não informado." })

    const token = authorization.split(' ')[1]

    try { const decoded = jwt.verify(token, process.env.JWT_SECRET)    
        req.cliente = decoded
        next()
    } catch (verify) { return res.status(401).json({ erro: "Token não informado ou expirado." }) }
}
module.exports = verificaLogin