const express = require('express')
const router = express.Router()
const controller = require('./controllers/index')

// Início
router.get('/', (_, res) => res.end('It\'s on in ' + Date.now()))
router.post('/menu', controller.Acesso.menu)

// Acesso
router.post('/login', controller.Acesso.login)
router.post('/cpf', controller.Acesso.cpf)

// Aluno
router.post('/alunos', controller.Aluno.list)
router.post('/cadastrar_aluno', controller.Aluno.save)

// Professor
router.post('/professor', controller.Professor.list)
router.post('/cadastrar_professor', controller.Professor.save)
router.post('/outros_professores', controller.Professor.others)

// Turma
router.post('/cadastrar_turma', controller.Turma.save)
router.post('/turmas', controller.Turma.list)
router.post('/turma', controller.Turma.get)

// Sala
router.get('/salas', controller.Sala.list)
router.post('/sala', controller.Sala.find)

// Psicologo
router.get('/psicologos', controller.Psicologo.list)
router.post('/psicologo', controller.Psicologo.find)

// Horario
router.all('/horarios', controller.Horario.list)
router.all('/horarios-semana', controller.Horario.week)
router.post('/horario', controller.Horario.find)
router.post('/novo-horario', controller.Horario.new)

module.exports = router
