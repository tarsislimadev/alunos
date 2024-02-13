const messages = {
  errorMessage: 'Erro no servidor',
  pessoaNaoEncontrada: 'Não temos esse cadastro no sistema.'
}

const periodicidade = {
  UNICO: 1,
  DIARIO: 2,
  SEMANAL: 3,
  QUINZENAL: 4,
  MENSAL: 5
}

const periodicidadeNome = {}
periodicidadeNome[periodicidade.UNICO] = 'Único'
periodicidadeNome[periodicidade.DIARIO] = 'Diário'
periodicidadeNome[periodicidade.SEMANAL] = 'Semanal'
periodicidadeNome[periodicidade.QUINZENAL] = 'Quinzenal'
periodicidadeNome[periodicidade.MENSAL] = 'Mensal'

// exports
exports.messages = messages
exports.periodicidade = periodicidade
exports.periodicidade_nome = periodicidadeNome
