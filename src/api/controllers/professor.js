const { conn, q } = require('../db')
const { error, success } = require('../helpers/response')
const models = require('../models')

const TIPO_PESSOA = 1 // professor

function insertPessoa (pessoa) {
  return new Promise(function (resolve, reject) {
    const query = q(
      'insert into pessoa (nome, sobrenome, cpf) values (:nome:, :sobrenome:, :cpf:)',
      pessoa
    )
    conn().query(query, function (err, ok) {
      if (err) reject(err)
      else resolve({ id: ok.insertId })
    })
  })
};

function insertRegraPessoa (regraPessoa) {
  return new Promise(function (resolve, reject) {
    const query = q(
      'insert into regra_pessoa (id_pessoa, id_tipo_pessoa) values (:pessoa:, :tipo_pessoa:)',
      regraPessoa
    )
    conn().query(query, function (err, ok) {
      if (err) reject(err)
      else resolve({ id: ok.insertId })
    })
  })
};

exports.save = function (req, res) {
  insertPessoa(req.body)
    .then(function ({ id }) {
      insertRegraPessoa({ pessoa: id, tipo_pessoa: TIPO_PESSOA })
        .then(() => res.json(success()))
        .catch(err => { throw err })
    })
    .catch(err => res.json(error(err)))
}

exports.list = function (req, res) {
  const query = q(
    'select professor.* from pessoa prof join turma t on prof.id = t.professor join turma_professor ta on ta.id_turma = t.id join pessoa professor on professor.id = ta.id_professor where prof.cpf = :cpf:',
    req.body
  )
  conn().query(query, function (err, professores) {
    if (err) res.json(error(err))
    else {
      res.json(success({
        professores: professores.map(a => models.MenuItem.new().setTitle(a.nome + ' ' + a.sobrenome).setLink('professor').addParam('id', a.id))
      }))
    }
  })
}

exports.others = function ({ body: { cpf } }, res) {
  const query = q(
    `select prof.* from pessoa prof 
    join regra_pessoa rp on rp.id_pessoa = prof.id 
    where prof.cpf <> :cpf: 
    and rp.id_tipo_pessoa = :tipo_pessoa:`,
    { cpf, tipo_pessoa: TIPO_PESSOA }
  )
  conn().query(query, function (err, professores) {
    if (err) res.json(error(err))
    else {
      res.json(success({
        professores: professores.map(
          a => models.MenuItem.new()
            .setTitle(a.nome + ' ' + a.sobrenome)
            .setLink('professor')
            .addParam('id', a.id)
        )
      }))
    }
  })
}
