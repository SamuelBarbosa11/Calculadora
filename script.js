const visor = document.querySelector('#value');
const botoes = document.querySelectorAll('.keybord button');
const last_operation = document.querySelector('.last-operation p');
const small_symbols = document.querySelectorAll('.result .symbol');
const history = document.querySelector('ul.operations');

let operacao = '';
let res = 0;

window.onload = scroll_right();
// mantem o scroll por padrao na extrema direita
function scroll_right() {
    visor.scrollLeft = visor.scrollWidth;
}

let aguardandoSegundoNumero = false;

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const textoBotao = botao.innerText;
        const tipoOperacao = botao.getAttribute('operation');

        // Verificar se o botão clicado é um número ou a vírgula
        if (!isNaN(textoBotao) || textoBotao === ',') {
            // Se clicamos em uma operação antes, o novo número deve limpar o visor
            if (aguardandoSegundoNumero) {
                visor.innerText = "0";
                aguardandoSegundoNumero = false;
            }
            adicionarNumero(textoBotao);
        }

        if (textoBotao === 'C') { apagarDigito(); }
        if (textoBotao === 'CE') { limparVisor(); }

        if (tipoOperacao && tipoOperacao !== 'equal') {
            const valorAtual = visor.innerText.replace(',', '.');
            operacao = valorAtual; // Armazena o primeiro número
            
            // Define o operador matemático real
            const operadores = { 
                mais: '+', 
                menos: '-', 
                multiplicacao: '*', 
                divisao: '/' 
            };
            operacao += ` ${operadores[tipoOperacao]} `;
            
            esconderSimbolos();
            document.querySelector(`.result .symbol.${tipoOperacao}`).classList.remove('hidden');
            
            // Avisamos ao sistema que o próximo número digitado deve começar do zero
            aguardandoSegundoNumero = true;
        }

        if (tipoOperacao === 'equal') {
            exibirResultado();
            add_history();
        }
    });
});

function adicionarNumero(numero) {
    // Evitar duplicidade de sinais
    if (numero === ',' && /,/.test(visor.innerText)) {return ;}

    // Se o visor for "0" e não estivermos clicando na vírgula, substitui
    if (visor.innerText === '0' && numero !== ',') {
        visor.innerText = numero;
    } else {
        // Se já tiver algo, concatena
        visor.innerText += numero;
    }
    scroll_right();
}

function apagarDigito() {
    if (visor.innerText.length <= 1 || visor.innerText === "0") {
        visor.innerText = "0";
    } else {
        visor.innerText = visor.innerText.replace(/.$/, '');
    }
    scroll_right();
}

function limparVisor() {
    visor.innerText = '0';
    last_operation.textContent = '';
    esconderSimbolos();
    scroll_right();
}

function exibirResultado() {
    const valorAtual = visor.innerText.replace(',', '.');
    operacao += valorAtual;
    last_operation.innerText = operacao;
    res = eval(operacao);
    visor.innerText = res;
}

function esconderSimbolos() {
    small_symbols.forEach(s => s.classList.add('hidden'));
}

function add_history() {
    const new_history = document.createElement('li');
    new_history.innerText = last_operation.innerText + ` = ${visor.innerText}`;
    history.prepend(new_history);
}