
use educacao;

drop table if exists pessoa;
create table pessoa (
  id int auto_increment primary key,
  nome varchar(255),
  sobrenome varchar(255),
  cpf varchar(11) unique
);

insert into pessoa (nome, sobrenome, cpf)
values ('Professor', 'de História', '12345678901'),
  ('Aluno', 'da Escola', '10987654321'),
  ('Professor', 'de Matemática', '32165498701'),
  ('Aluno', '2', '10887654321'),
  ('Aluno', '3', '10787654321'),
  ('Aluno', '4', '10687654321');



drop table if exists tipo_pessoa;
create table tipo_pessoa (
  id int auto_increment primary key,
  nome varchar(255)
);

insert into tipo_pessoa (nome)
values ('Professor'), ('Aluno');



drop table if exists regra_pessoa;
create table regra_pessoa (
  id_pessoa int references pessoa(id),
  id_tipo_pessoa int references tipo_pessoa(id)
);

insert into regra_pessoa (id_pessoa, id_tipo_pessoa)
values (1, 1),
  (2, 2),
  (3, 1),
  (4, 2),
  (5, 2),
  (6, 2);



drop table if exists turma;
create table turma (
  id int auto_increment primary key,
  nome varchar(255),
  professor int references pessoa(id),
  criacao datetime DEFAULT CURRENT_TIMESTAMP
);

insert into turma (nome, professor, criacao)
values ('Turma de história - 1 ano', 1, current_timestamp),
  ('Turma de matemática - 1 ano', 3, current_timestamp);



drop table if exists turma_aluno;
create table turma_aluno (
  id_aluno int references pessoa(id),
  id_turma int references turma(id)
);

insert into turma_aluno (id_aluno, id_turma)
values (2, 1),
  (2, 2),
  (4, 2),
  (5, 2),
  (6, 1);





drop table if exists tipo_conteudo;
create table tipo_conteudo (
  id int auto_increment primary key,
  nome varchar(255)
);

insert into tipo_conteudo (nome)
values ('Link'), ('Questionário');



drop table if exists conteudo;
create table conteudo (
  id int auto_increment primary key,
  nome varchar(255),
  tipo int references tipo_conteudo(id), 
  link varchar(255),
  dono int references pessoa(id), 
  criacao datetime DEFAULT CURRENT_TIMESTAMP
);

insert into conteudo (nome, tipo, link, criacao)
values
 ('Adição para crianças', 1, 'http://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/encceja_matematica_ens_medio.pdf', current_timestamp),
 ('Mineração no Brasil colonial', 1, 'https://www.conteudoseducar.com.br/conteudos/arquivos/3174.pdf', current_timestamp),
 ('Questões de história', 2, null, current_timestamp),
 ('Questões de matemática', 2, null, current_timestamp);



drop table if exists conteudo_turma;
create table conteudo_turma (
  id int auto_increment primary key,
  id_conteudo int references conteudo(id),
  id_turma int references turma(id)
);

insert into conteudo_turma (id_conteudo, id_turma)
values (1, 1),
  (2, 2);



drop table if exists questionario;
create table questionario (
  id int auto_increment primary key,
  nome varchar(255), 
  id_conteudo_turma int references conteudo_turma(id)
);

insert into questionario (nome, id_conteudo_turma) 
values ('Questoes de história', 1),
  ('Questoes de matemática', 2);




drop table if exists tipo_questao;
create table tipo_questao (
  id int auto_increment primary key,
  nome varchar(255)
);

insert into tipo_questao (nome)
values ('Texto'), ('Número');



drop table if exists questao;
create table questao (
  id int auto_increment primary key,
  titulo varchar(255), 
  tipo int references tipo_questao(id), 
  id_questionario int references questionario(id)
);

insert into questao (titulo, tipo, id_questionario)
values ('Quem descobriu o Brasil?', 1, 1), 
  ('Quem descobriu a América?', 1, 1), 
  ('Quanto é 1 + 3?', 2, 2),
  ('Qual é o nome do professor de matemática?', 1, 2),
  ('Quanto é 1 + 2?', 2, 2);



drop table if exists resposta;
create table resposta (
  id int auto_increment primary key,
  texto varchar(255), 
  id_questao int references questao(id), 
  id_pessoa int references pessoa(id),
  criacao datetime DEFAULT CURRENT_TIMESTAMP
);


-- insert into table resposta (texto, id)


drop table if exists config;
create table config (
  chave varchar(255) not null, 
  valor varchar(255) not null
);

-- insert into config (chave, valor) values ('hora_comercial', '8');
