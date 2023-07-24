
function App() { }

// Local //

App.local = function () { };

App.local.CONFIG = 'config';
App.local.PAGE = 'page';
App.local.PESSOA = 'pessoa';
App.local.DATA = 'data';
App.local.HORA_INICIAL = 'hora_inicial';
App.local.HORA_FINAL = 'hora_final';
App.local.SALA_ID = 'sala_id';
App.local.SALA = 'sala';
App.local.SALAS = 'salas';

App.local.retrieveAll = function () {
    var values = JSON.parse(localStorage.getItem('app'));
    if (values === null) values = {};
    return values;
};

App.local.set = function (key, value) {
    var values = App.local.retrieveAll();
    values[key] = value;
    localStorage.setItem('app', JSON.stringify(values));

    return value;
};

App.local.retrieve = function (key) {
    var values = App.local.retrieveAll();
    var value = values[key];
    if ([undefined, null].indexOf(value) > -1)
        return App.local.set(key);
    return value;
};

// Config //

App.config = function () {};

App.config.TIPO_PESSOA = 'tipo_pessoa';

App.config.get = function (key) {
    var local = App.local.retrieve(App.local.CONFIG);
    var config = local.find(c => c.chave == key);

    if (config === undefined)
        return null;

    return config.valor;
};

// Pages //

App.pages = function () { };

App.pages.goTo = function (page, params) {
    var data = App.local.retrieve(App.local.PAGE);
    if ([null, undefined].indexOf(data) != -1) data = {};

    if (params) data[page] = params;

    App.local.set(App.local.PAGE, data);
    window.location = page + '.html';
};

App.pages.goToMenu = function () {
    // TODO limpar as referencias de páginas
    window.location = 'menu.html';
};

App.pages.getData = function (key) {
    var data = App.local.retrieve(App.local.PAGE);

    if ([null, undefined].indexOf(data) != -1) return null;
    if (Object.keys(data).length === 0) return null;

    var page = window.location.pathname.replace('/views/', '').replace('.html', '');
    var keys = data[page] || {};

    if (key)
        for (var k in keys)
            if (key in keys[k])
                return keys[k][key];
            else 
                return null;

    return keys;
};

// Date //

App.date = function () { };

App.date.br2en = function (date) {
    return date.split('/').reverse().join('-');
};

App.date.en2br = function (date) {
    return date.split('-').reverse().join('/');
};

App.date.to_en = function to_en(date) {
    return date.toJSON().toString().split('T')[0];
};

App.date.today = function now() {
    return App.date.to_en(new Date);
};

App.date.picker = function (options) {
    return new Promise(function (s, f) {
        datePicker.show({
            date: new Date(),
            mode: options.mode || 'date'
        }, s, f);
    });
};

App.date.timeDisplay = function (time) {
    if ([null, undefined, ''].indexOf(time) != -1) return '';
    var parts = time.toString().split(':');
    return [parts[0], parts[1]].join(':');
};

// Server //

App.server = function () { };

App.server.URL = 'http://localhost:8000/';
// App.server.URL = 'https://tarsisdelima-alunos-api.herokuapp.com/';

App.server.__send = function (method, action, request) {
    return new Promise(function (s, f) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, App.server.URL + action, true);

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            try {
                var response = JSON.parse(xhr.responseText);
                if (response.success) s(response);
                else f(response);
            } catch (e) {
                f({ message: 'Erro inesperado' });
            }
        };

        xhr.onerror = function () {
            f({ message: 'Ocorreu um erro' });
        };

        xhr.send(JSON.stringify(request));
    });
}

App.server.cpf = function (cpf) {
    return App.server.__send('POST', 'cpf', {
        cpf: cpf
    });
};

App.server.login = function (cpf) {
    return App.server.__send('POST', 'login', {
        cpf: cpf
    });
};

App.server.menu = function (cpf) {
    return App.server.__send('POST', 'menu', {
        cpf: cpf
    });
};

App.server.pessoa = function (cpf) {
    return App.server.__send('POST', 'pessoa', {
        cpf: cpf
    });
};

App.server.alunos = function (cpf) {
    return App.server.__send('POST', 'alunos', {
        cpf: cpf
    });
};

App.server.turmas = function (cpf) {
    return App.server.__send('POST', 'turmas', {
        cpf: cpf
    });
};

App.server.turma = function (id) {
    return App.server.__send('POST', 'turma', {
        id: id
    });
};

App.server.cadastrar_aluno = function (cpf, nome, sobrenome) {
    return App.server.__send('POST', 'cadastrar_aluno', {
        cpf: cpf,
        nome: nome,
        sobrenome: sobrenome
    });
};

App.server.cadastrar_professor = function (cpf, nome, sobrenome) {
    return App.server.__send('POST', 'cadastrar_professor', {
        cpf: cpf,
        nome: nome,
        sobrenome: sobrenome
    });
};

App.server.outros_professores = function (cpf) {
    return App.server.__send('POST', 'outros_professores', {
        cpf: cpf
    });
};

App.server.cadastrar_turma = function (nome, id) {
    return App.server.__send('POST', 'cadastrar_turma', {
        professor: id,
        nome: nome
    });
};

App.server.salas = function () {
    return App.server.__send('GET', 'salas');
}

App.server.sala = function (id) {
    return App.server.__send('POST', 'sala', { id: id });
}
