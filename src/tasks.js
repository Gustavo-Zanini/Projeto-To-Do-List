import { salvarTarefas, carregarTarefas } from './storage.js';

let tarefas = carregarTarefas();
let filtroAtual = 'todas';

export function adicionarTarefa(titulo, descricao) {
    const novaTarefa = {
        id: Date.now(),
        titulo: titulo,
        descricao: descricao,
        dataCriacao: new Date(),
        situacao: 'Pendente'
    };
    
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    return novaTarefa;
}

export function concluirTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.situacao = 'Concluída';
        salvarTarefas(tarefas);
    }
}

export function excluirTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas(tarefas);
}

export function getTarefasFiltradas() {
    if (filtroAtual === 'pendentes') {
        return tarefas.filter(t => t.situacao === 'Pendente');
    } else if (filtroAtual === 'concluidas') {
        return tarefas.filter(t => t.situacao === 'Concluída');
    }
    return tarefas;
}

export function setFiltro(filtro) {
    filtroAtual = filtro;
}

export function getTarefas() {
    return tarefas;
}
