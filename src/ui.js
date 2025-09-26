import { 
    adicionarTarefa, 
    concluirTarefa, 
    excluirTarefa, 
    getTarefasFiltradas, 
    setFiltro,
    getTarefas 
} from './tasks.js';
import { salvarTema, carregarTema } from './storage.js';

// Variáveis para controle
let tarefaParaAcao = null;
let tipoAcao = '';

// Elementos da interface
const elementos = {};

// Inicializar a interface
export function inicializarUI() {
    carregarElementos();
    configurarEventos();
    atualizarRelogio();
    configurarTema();
    atualizarTabela();
    atualizarFiltros();
    
    // Atualizar relógio a cada segundo
    setInterval(atualizarRelogio, 1000);
}

function carregarElementos() {
    elementos.relogio = document.getElementById('relogio');
    elementos.toggleTema = document.getElementById('toggleTema');
    elementos.btnNovaTarefa = document.getElementById('btnNovaTarefa');
    elementos.modalNovaTarefa = document.getElementById('modalNovaTarefa');
    elementos.formNovaTarefa = document.getElementById('formNovaTarefa');
    elementos.cancelarNovaTarefa = document.getElementById('cancelarNovaTarefa');
    elementos.modalConfirmacao = document.getElementById('modalConfirmacao');
    elementos.mensagemConfirmacao = document.getElementById('mensagemConfirmacao');
    elementos.cancelarAcao = document.getElementById('cancelarAcao');
    elementos.confirmarAcao = document.getElementById('confirmarAcao');
    elementos.tabelaTarefas = document.getElementById('tabelaTarefas');
    elementos.filtroTodas = document.getElementById('filtroTodas');
    elementos.filtroPendentes = document.getElementById('filtroPendentes');
    elementos.filtroConcluidas = document.getElementById('filtroConcluidas');
}

function configurarEventos() {
    // Tema
    elementos.toggleTema.addEventListener('click', alternarTema);
    
    // Nova tarefa
    elementos.btnNovaTarefa.addEventListener('click', mostrarModalNovaTarefa);
    elementos.cancelarNovaTarefa.addEventListener('click', esconderModalNovaTarefa);
    elementos.formNovaTarefa.addEventListener('submit', handleNovaTarefa);
    
    // Confirmação
    elementos.cancelarAcao.addEventListener('click', esconderModalConfirmacao);
    elementos.confirmarAcao.addEventListener('click', handleConfirmacao);
    
    // Filtros
    elementos.filtroTodas.addEventListener('click', () => aplicarFiltro('todas'));
    elementos.filtroPendentes.addEventListener('click', () => aplicarFiltro('pendentes'));
    elementos.filtroConcluidas.addEventListener('click', () => aplicarFiltro('concluidas'));
    
    // Fechar modais clicando fora
    window.addEventListener('click', (e) => {
        if (e.target === elementos.modalNovaTarefa) {
            esconderModalNovaTarefa();
        }
        if (e.target === elementos.modalConfirmacao) {
            esconderModalConfirmacao();
        }
    });
}

function atualizarRelogio() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const segundos = String(agora.getSeconds()).padStart(2, '0');
    elementos.relogio.textContent = `${horas}:${minutos}:${segundos}`;
}

function configurarTema() {
    if (carregarTema()) {
        document.documentElement.classList.add('dark');
    }
}

function alternarTema() {
    document.documentElement.classList.toggle('dark');
    const estaEscuro = document.documentElement.classList.contains('dark');
    salvarTema(estaEscuro);
}

function mostrarModalNovaTarefa() {
    elementos.modalNovaTarefa.classList.remove('hidden');
}

function esconderModalNovaTarefa() {
    elementos.modalNovaTarefa.classList.add('hidden');
    elementos.formNovaTarefa.reset();
}

function handleNovaTarefa(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    
    if (titulo.trim() === '') return;
    
    adicionarTarefa(titulo, descricao);
    atualizarTabela();
    esconderModalNovaTarefa();
}

function mostrarModalConfirmacao(tarefa, acao) {
    tarefaParaAcao = tarefa;
    tipoAcao = acao;
    
    if (acao === 'excluir') {
        elementos.mensagemConfirmacao.textContent = 'Deseja realmente excluir esta tarefa?';
    } else if (acao === 'concluir') {
        elementos.mensagemConfirmacao.textContent = 'Deseja realmente marcar esta tarefa como concluída?';
    }
    
    elementos.modalConfirmacao.classList.remove('hidden');
}

function esconderModalConfirmacao() {
    elementos.modalConfirmacao.classList.add('hidden');
    tarefaParaAcao = null;
    tipoAcao = '';
}

function handleConfirmacao() {
    if (tipoAcao === 'excluir') {
        excluirTarefa(tarefaParaAcao.id);
    } else if (tipoAcao === 'concluir') {
        concluirTarefa(tarefaParaAcao.id);
    }
    
    atualizarTabela();
    esconderModalConfirmacao();
}

function aplicarFiltro(filtro) {
    setFiltro(filtro);
    atualizarTabela();
    atualizarFiltros();
}

function atualizarFiltros() {
    // Remove classe ativa de todos os botões
    elementos.filtroTodas.classList.remove('filtro-ativo');
    elementos.filtroPendentes.classList.remove('filtro-ativo');
    elementos.filtroConcluidas.classList.remove('filtro-ativo');
    
    // Adiciona classe ativa ao botão correto
    const filtroAtual = document.querySelector(`[data-filtro="${getTarefasFiltradas().length === getTarefas().length ? 'todas' : 
        getTarefasFiltradas().every(t => t.situacao === 'Pendente') ? 'pendentes' : 'concluidas'}"]`);
    
    if (filtroAtual) {
        filtroAtual.classList.add('filtro-ativo');
    }
}

export function atualizarTabela() {
    const tarefas = getTarefasFiltradas();
    const tbody = elementos.tabelaTarefas;
    
    tbody.innerHTML = '';
    
    if (tarefas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma tarefa encontrada
                </td>
            </tr>
        `;
        return;
    }
    
    tarefas.forEach(tarefa => {
        const dataFormatada = new Date(tarefa.dataCriacao).toLocaleString('pt-BR');
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
        
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${tarefa.titulo}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">${tarefa.descricao}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${dataFormatada}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${tarefa.situacao === 'Pendente' ? 'situacao-pendente' : 'situacao-concluida'}">${tarefa.situacao}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                ${tarefa.situacao === 'Pendente' ? 
                    `<button class="acao-btn btn-concluir mr-3" data-id="${tarefa.id}">Concluir</button>` : ''}
                <button class="acao-btn btn-excluir" data-id="${tarefa.id}">Excluir</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Adicionar eventos aos botões de ação
    document.querySelectorAll('.btn-concluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const tarefa = getTarefas().find(t => t.id === id);
            mostrarModalConfirmacao(tarefa, 'concluir');
        });
    });
    
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const tarefa = getTarefas().find(t => t.id === id);
            mostrarModalConfirmacao(tarefa, 'excluir');
        });
    });
}