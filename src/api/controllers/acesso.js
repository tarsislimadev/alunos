const { conn } = require('../db')
const messages = require('../config').messages
const { error, success } = require('../helpers/response')
const models = require('../models')
const { TIPO_PESSOA } = require('../enums')
const f = require('../functions')

exports.cpf = function (req, res) {
  const query = 'select nome, sobrenome from pessoa where cpf = "' + req.body.cpf + '"'
  conn().query(query, function (err, pessoas) {
    if (err) res.json(error(err))
    else if (f.emptyLegth(pessoas)) res.json(error(new Error(messages.pessoaNaoEncontrada), messages.pessoaNaoEncontrada))
    else res.json(success({ pessoa: pessoas[0] }))
  })
}

function pessoa (cpf) {
  return new Promise(function (resolve, reject) {
    const query = 'select * from pessoa where cpf = "' + cpf + '"'
    conn().query(query, function (err, pessoas) {
      if (err) reject(error(err))
      else if (f.emptyLegth(pessoas)) reject(error(new Error(messages.pessoaNaoEncontrada), messages.pessoaNaoEncontrada))
      else resolve(success({ pessoa: pessoas[0] }))
    })
  })
};

function config () {
  return new Promise(function (resolve, reject) {
    const query = 'select * from config'
    conn().query(query, function (err, config) {
      if (err) return reject(error(err))
      else resolve(success({ config }))
    })
  })
};

function menuProfessor (cpf) {
  return new Promise(function (resolve) {
    resolve([
      models.MenuItem.new().setTitle('Adicionar aluno').setLink('adicionar_aluno'),
      models.MenuItem.new().setTitle('Ver meus alunos').setLink('meus_alunos'),
      models.MenuItem.new().setTitle('Criar turma').setLink('criar_turma'),
      models.MenuItem.new().setTitle('Ver minhas turmas').setLink('minhas_turmas'),
      models.MenuItem.new().setTitle('Adicionar professor').setLink('adicionar_professor'),
      models.MenuItem.new().setTitle('Ver outros professores').setLink('outros_professores'),
      models.MenuItem.new().setTitle('Adicionar conteudo').setLink('adicionar_conteudo')
    ])
  })
};

function menuAluno (cpf) {
  return new Promise(function (resolve) {
    resolve([
      models.MenuItem.new().setTitle('Ver meus professores').setLink('meus_professores'),
      models.MenuItem.new().setTitle('Ver minhas turmas').setLink('minhas_turmas')
    ])
  })
};

function menuPessoa (cpf) {
  return new Promise(function (resolve, reject) {
    const query = 'select rp.id_tipo_pessoa as id from pessoa p join regra_pessoa rp on p.id = rp.id_pessoa where p.cpf = "' + cpf + '"'

    conn().query(query, function (err, [tipoPessoa] = []) {
      if (err) reject(err)
      else if (tipoPessoa.id === TIPO_PESSOA.PROFESSOR) resolve(menuProfessor)
      else if (tipoPessoa.id === TIPO_PESSOA.ALUNO) resolve(menuAluno)
      else reject(new Error(messages.errorMessage))
    })
  })
};

exports.menu = function (req, res) {
  const cpf = req.body.cpf
  menuPessoa(cpf)
    .then(function (fn) {
      fn(cpf)
        .then(function (menu) { res.json(success({ menu })) })
        .catch(err => { throw err })
    })
    .catch(function (err) {
      res.json(error(err))
    })
}

exports.login = function (req, res) {
  Promise.all([
    pessoa(req.body.cpf),
    config()
  ])
    .then(function ([p, c]) {
      res.json(success({
        pessoa: p.pessoa,
        config: c.config
      }))
    })
    .catch(function () {
      console.error('err login', arguments)
      res.json([...arguments].find(res => res.success === false))
    })
}
