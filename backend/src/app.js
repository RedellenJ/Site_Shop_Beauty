const express = require('express')
const cors = require('cors')

const clientesRoutes = require('./routes/clientes-routes')
const produtosRoutes = require('./routes/produtos-routes')
const pedidosRoutes = require('./routes/pedidos-routes')

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://site-shop-beauty.onrender.com"
];

app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Bloqueado pelo CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor rodando!' })
})

app.use(clientesRoutes)
app.use(produtosRoutes)
app.use(pedidosRoutes)

module.exports = app