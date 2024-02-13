const { conn, q } = require('../db')
const { error, success } = require('../helpers/response')
const models = require('../models')

exports.save = function (req, res) {
  const query = q(
    'insert into turma (nome, professor) values (:nome:, :professor:)',
    req.body
  )
  conn().query(query, function (err) {
    if (err) res.json(error(err))
    else res.json(success())
  })
}

exports.list = function (req, res) {
  const query = q(
    ' select t.* from turma t join pessoa p on t.professor = p.id where p.cpf = :cpf: ',
    req.body
  )
  conn().query(query, function (err, turmas) {
    if (err) res.json(error(err))
    else {
      res.json(success({
        turmas: turmas.map(t => models.MenuItem.new('turma')
          .setTitle(t.nome)
          .setLink('turma')
          .addParam('id', t.id)
        )
      }))
    }
  })
}

function turma (id) {
  return new Promise(function (resolve, reject) {
    const query = q(
      ' select * from turma t where t.id = :id: ',
      { id }
    )
    conn().query(query, function (err, turma) {
      if (err) reject(err)
      else resolve(turma[0])
    })
  })
};

function turmaAlunos (id) {
  return new Promise(function (resolve, reject) {
    const query = q(
      ' select a.* from turma t join turma_aluno ta on ta.id_turma = t.id join pessoa a on ta.id_aluno = a.id where t.id = :id: ',
      { id }
    )
    conn().query(query, function (err, alunos) {
      if (err) reject(err)
      else {
        resolve(
          alunos.map(a => models.MenuItem.new()
            .setTitle(a.nome + ' ' + a.sobrenome)
            .setLink('aluno')
            .addParam('id', a.id)
          )
        )
      }
    })
  })
};

exports.get = function (req, res) {
  Promise.all([
    turmaAlunos(req.body.id),
    turma(req.body.id)
  ])
    .then(function ([alunos, turma]) {
      res.json(success({ alunos, turma }))
    })
    .catch(function (err) {
      res.json(error(err))
    })
}
