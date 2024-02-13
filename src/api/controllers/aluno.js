const { conn, q } = require('../db')
const { error, success } = require('../helpers/response')
const models = require('../models')

const TIPO_PESSOA = 2 // aluno

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
        .then(function () {
          res.json(success())
        })
        .catch(err => { throw err })
    })
    .catch(err => res.json(error(err)))
}

exports.list = function (req, res) {
  const query = q(
    'select aluno.* from pessoa prof join turma t on prof.id = t.professor join turma_aluno ta on ta.id_turma = t.id join pessoa aluno on aluno.id = ta.id_aluno where prof.cpf = :cpf:',
    req.body
  )
  conn().query(query, function (err, alunos) {
    if (err) res.json(error(err))
    else {
      res.json(success({
        alunos: alunos.map(a => models.MenuItem.new().setTitle(a.nome + ' ' + a.sobrenome).setLink('aluno').addParam('id', a.id))
      }))
    }
  })
}
