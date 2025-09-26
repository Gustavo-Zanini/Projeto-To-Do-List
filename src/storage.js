// Funções para salvar e carregar do localStorage
export function salvarTarefas(tarefas) {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

export function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
}

export function salvarTema(estaEscuro) {
    localStorage.setItem('temaEscuro', estaEscuro);
}

export function carregarTema() {
    return localStorage.getItem('temaEscuro') === 'true';
}