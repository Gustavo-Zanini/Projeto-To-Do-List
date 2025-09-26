import { inicializarUI, atualizarTabela } from './ui.js';

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    inicializarUI();
});

// Exportar para uso no console (debug)
window.app = {
    atualizarTabela
};