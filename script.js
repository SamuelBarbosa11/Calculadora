const visor = document.querySelector('#value');
const botoes = document.querySelectorAll('.keybord button');
const last_operation = document.querySelector('.last-operation p');

// mantem o scroll por padrao na extrema direita
function scroll_right() {
    visor.scrollLeft = visor.scrollWidth;
}
window.onload = scroll_right();

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const textoBotao = botao.innerText;

        // Verificar se o botão clicado é um número ou a vírgula
        if (!isNaN(textoBotao) || textoBotao === ',') {
            adicionarNumero(textoBotao);
        }

        if (textoBotao === 'C') { removerDigito(); }

        if (textoBotao === 'CE') { limparVisor(); }
    });
});

function adicionarNumero(numero) {
    // Se o visor for "0" e não estivermos clicando na vírgula, substitui
    if (visor.innerText === '0' && numero !== ',') {
        visor.innerText = numero;
    } else {
        // Se já tiver algo, concatena
        visor.innerText += numero;
    }
    scroll_right();
}

function removerDigito() {
    visor.innerText = visor.innerText.replace(/.$/, '');
    if(visor.textContent === '') {
        visor.innerText = "0";
    }

    scroll_right();
}

function limparVisor() {
    visor.innerText = '0';
    last_operation.textContent = ' ';
    scroll_right();
}