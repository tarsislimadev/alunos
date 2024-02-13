const { conn } = require('../db')
const select = require('./horario').select
const { error, success } = require('../helpers/response')
const date = require('../helpers/date')

exports.list = function (req, res) {
  const query = 'select * from sala'
  conn().query(query, function (err, salas) {
    if (err) res.json(error(err))
    else res.json(success({ salas }))
  })
}

exports.find = function (req, res) {
  const query = `SELECT 
          h.data, 
          h.hora_inicial, 
          h.hora_final, 
          h.periodicidade, 
          s.id AS sala, 
          s.nome AS sala_nome, 
          u.id AS usuario, 
          u.nome AS usuario_nome
        FROM horario h
        JOIN sala s 
          ON h.sala = s.id 
        JOIN usuario u 
          ON h.usuario = u.id
        WHERE h.sala = "` + req.body.id + '"'
  conn().query(query, function (err, horarios) {
    if (err) res.json(error(err))
    else res.json(success({ horarios: select(horarios, [date.today()]) }))
  })
}
