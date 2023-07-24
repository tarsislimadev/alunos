const { conn } = require('../db')
const config = require('../config')
const messages = config.messages
const periodicidade = config.periodicidade
const { error, success } = require('../helpers/response')
const date = require('../helpers/date')

const moment = require('moment')
moment.locale('pt-br')

exports.new = function (req, res) {
  const q = 'select * from horario where "' + req.body.hora_inicial + '" between hora_inicial and hora_final or "' + req.body.hora_final + '" between hora_inicial and hora_final'
  conn().query(q, function (err, results) {
    if (err) res.json(error(err))

    if (exports.select(results, [req.body.data]).length > 0) {
      res.json(error(new Error(messages.horarioMarcado), messages.horarioMarcado))
      return
    }

    const query = `insert into horario (usuario, sala, data, hora_inicial, hora_final, periodicidade)
    values ('` + req.body.usuario + '\', \'' + req.body.sala + '\', \'' + req.body.data + '\', \'' + req.body.hora_inicial + '\', \'' + req.body.hora_final + '\', \'' + req.body.periodicidade + '\')'
    conn().query(query, function (err1) {
      if (err1) res.json(error(err1))
      else res.json(success())
    })
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
        WHERE h.sala = "` + req.body.sala + '" and data = "' + req.body.data + '" and hora_inicial = "' + req.body.hora_inicial + '"'
  conn().query(query, function (err, results) {
    if (err) res.json(error(err))
    else res.json(success({ horario: results[0] || {} }))
  })
}

exports.select = function (horarios = [], dias = []) {
  if (dias.length === 0) {
    const min = horarios.reduce((old, cur) => old < cur.data ? old : cur.data, date.today())

    const limite = moment(date.today()).add(1, 'year')
    for (let dia = moment(min); dia.isBefore(limite); dia = dia.add(1, 'day')) { dias.push(moment(dia.toJSON()).toDate()) }
  }

  return horarios.reduce(function (hs, horario) {
    dias.forEach(function (dia) {
      const dayString = date.to_en(moment(dia))
      const limit = moment(dia).add(1, 'year')

      switch (horario.periodicidade) {
        case periodicidade.UNICO:{
          const day = moment(horario.data).startOf()
          const dateString = date.to_en(day)

          if (dayString === dateString) {
            horario.dia = dateString
            horario.dia_semana = day.day()
            hs.push(horario)
          }
        } ; break

        case periodicidade.DIARIO:{
          let count = 0
          let day
          do {
            // const
            day = moment(horario.data).startOf()
            day.add(count++, 'days')
            const dateString = date.to_en(day)

            if (dayString === dateString) {
              horario.dia = dateString
              horario.dia_semana = day.day()
              hs.push(horario)
            }
          } while (day.toDate().getTime() <= limit)
        } ;break

        case periodicidade.SEMANAL:{
          let count = 0
          let day
          do {
            // const
            day = moment(horario.data).startOf()
            day.add(count++, 'week')
            const dateString = date.to_en(day)

            if (dayString === dateString) {
              horario.dia = dateString
              horario.dia_semana = day.day()
              hs.push(horario)
            }
          } while (day.toDate().getTime() <= limit)
        } ; break

        case periodicidade.QUINZENAL:{
          let count = 0
          let day
          do {
            // const
            day = moment(horario.data).startOf()
            day.add(count += 14, 'days')
            const dateString = date.to_en(day)

            if (dayString === dateString) {
              horario.dia = dateString
              horario.dia_semana = day.day()
              hs.push(horario)
            }
          } while (day.toDate().getTime() <= limit)
        }; break

        case periodicidade.MENSAL:{
          let count = 0
          let day
          do {
            // const
            day = moment(horario.data).startOf()
            day.add(count++, 'month')
            const dateString = date.to_en(day)

            if (dayString === dateString) {
              horario.dia = dateString
              horario.dia_semana = day.day()
              hs.push(horario)
            }
          } while (day.toDate().getTime() <= limit)
        };break
      }
    })

    return hs
  }, [])
  // .filter(h => h.dia_semana != 0 /* Domingo não */);
}

exports.list = function (req, res) {
  conn().query(`select 
          h.*, 
          u.nome as usuario_nome, 
          s.nome as sala_nome, 
          p.nome as periodicidade_nome
        from horario h 
        join usuario u 
          on h.usuario = u.id 
        join sala s 
          on h.sala = s.id 
        join periodicidade p 
          on h.periodicidade = p.id`, function (err, results) {
    if (err) res.json(error(err))
    else res.json(success({ horarios: exports.select(results, req.body.dias) }))
  })
}

exports.week = function (req, res) {
  const diaSemana = moment(req.body.dia_semana)
  const domingo = diaSemana.subtract(diaSemana.day(), 'days')
  const dias = [...Array(7)].map((_, ix) => date.to_en(moment(domingo).add(ix, 'days')))
  exports.list({ body: { dias } }, res)
}
