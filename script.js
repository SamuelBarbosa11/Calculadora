const visor = document.querySelector('#value');
const botoes = document.querySelectorAll('.keybord button');
const last_operation = document.querySelector('.last-operation p');
const small_symbols = document.querySelectorAll('.result .symbol');
const history = document.querySelector('ul.operations');
const clean_history = document.querySelector('#clean-history');

window.onload = scroll_right();

// mantem o scroll na direita
function scroll_right() {
    visor.scrollLeft = visor.scrollWidth;
}
// mantem o scroll no final
function scroll_down() {
    visor.scrollTop = visor.scrollHeight;
}

let primeiroNumero = null;
let operadorAtual = null;
let resetarVisor = false;
let finalizouConta = false;

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const textoBotao = botao.innerText;
        const tipoOperacao = botao.getAttribute('operation');

        // ========================= Escrever e Apagar =================================
        if ((!isNaN(textoBotao) && textoBotao.trim() !== "") || textoBotao === ',') {
            if (finalizouConta) {
                primeiroNumero = null;
                operadorAtual = null;
                finalizouConta = false;
            }
            adicionarNumero(textoBotao);
        }

        if (textoBotao === 'C') { apagarDigito(); }
        if (textoBotao === 'CE') { limparVisor(); }
        // =============================================================================



        // ========================= Operações ( + , -, *, / ) =========================
        if (tipoOperacao && tipoOperacao !== 'equal') {
            let textoVisor = visor.innerText.trim();
            if (textoVisor === "" || textoVisor === ",") textoVisor = "0";

            const valorNoVisor = parseFloat(textoVisor.replace(',', '.')) || 0;

            if (finalizouConta) {
                primeiroNumero = valorNoVisor;
                finalizouConta = false;
            } else if (primeiroNumero !== null && operadorAtual !== null && !resetarVisor) {
                const resultadoParcial = calcular(primeiroNumero, valorNoVisor, operadorAtual);
                visor.innerText = resultadoParcial.toString().replace('.', ',');
                primeiroNumero = resultadoParcial;
            } else {
                primeiroNumero = valorNoVisor;
            }

            // Define qual é o novo operador
            const operadores = {
                mais: '+',
                menos: '-',
                multiplicacao: '*',
                divisao: '/'
            };
            operadorAtual = operadores[tipoOperacao];

            // Interface
            esconderSimbolos();
            document.querySelector(`.result .symbol.${tipoOperacao}`).classList.remove('hidden');
            
            resetarVisor = true; // O próximo número digitado deve limpar o visor
        }
        // ============================================================================



        // =========================== Operação " = " =================================
        if (tipoOperacao === 'equal') {
            if (primeiroNumero !== null && operadorAtual !== null) {
                const segundoNumero = parseFloat(visor.innerText.replace(',', '.'));
                const resultadoFinal = calcular(primeiroNumero, segundoNumero, operadorAtual);

                last_operation.innerText = `${primeiroNumero} ${operadorAtual} ${segundoNumero}`;
                visor.innerText = resultadoFinal.toString().replace('.', ',');
                
                adicionarHistorico();
                
                // Reseta o estado para uma nova conta
                primeiroNumero = resultadoFinal;
                operadorAtual = null;
                resetarVisor = true;
                finalizouConta = true;
                esconderSimbolos();
            }
        }
        // ============================================================================
    });
});

clean_history.onclick = function() {
    limparHistorico();
}

function adicionarNumero(numero) {
    if (finalizouConta) {
        primeiroNumero = null;
        operadorAtual = null;
        resetarVisor = true;

        finalizouConta = false;
    }

    if (resetarVisor) {
        visor.innerText = (numero === ',' ? '0,' : numero);
        resetarVisor = false;
    } else {
        if (numero === ',' && visor.innerText.includes(',')) return;
        if (visor.innerText === '0' && numero !== ',') {
            visor.innerText = numero;
        } else {
            visor.innerText += numero;
        }
    }
    scroll_right();
}

function apagarDigito() {
    if (visor.innerText.length <= 1) {
        visor.innerText = '0';
        esconderSimbolos();
    } else {
        visor.innerText = visor.innerText.slice(0, -1);
        // Se após apagar, sobrar apenas "-", reseta para 0
        if (visor.innerText === "-") visor.innerText = "0";
    }
    scroll_right();
}

function limparVisor() {
    visor.innerText = '0';
    last_operation.textContent = '';
    primeiroNumero = null;
    operadorAtual = null;
    resetarVisor = false;
    finalizouConta = false;
    esconderSimbolos();
    limparHistorico();
    scroll_right();
}

function calcular(n1, n2, operador) {
    switch (operador) {
        case '+': return n1 + n2;
        case '-': return n1 - n2;
        case '*': return n1 * n2;
        case '/': return n2 !== 0 ? n1 / n2 : "Erro";
        default: return n2;
    }
}

function esconderSimbolos() {
    small_symbols.forEach(s => s.classList.add('hidden'));
}

function adicionarHistorico() {
    const new_history = document.createElement('li');
    new_history.innerText = last_operation.innerText + ` = ${visor.innerText}`;
    history.append(new_history);
    scroll_down();
}

function limparHistorico() {
    history.innerHTML = '';
}