const visor = document.querySelector('#value');
const botoes = document.querySelectorAll('.keybord button');
const last_operation = document.querySelector('.last-operation p');
const small_symbols = document.querySelectorAll('.result .symbol');
const history = document.querySelector('ul.operations');

window.onload = scroll_right();
// mantem o scroll por padrao na extrema direita
function scroll_right() {
    visor.scrollLeft = visor.scrollWidth;
}

function scroll_down() {
    visor.scrollTop = visor.scrollHeight;
}

let primeiroNumero = null;
let operadorAtual = null;
let resetarVisor = false;

botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const textoBotao = botao.innerText;
        const tipoOperacao = botao.getAttribute('operation');

        // Verificar se o botão clicado é um número ou a vírgula
        if (!isNaN(textoBotao) || textoBotao === ',') { adicionarNumero(textoBotao); }

        if (textoBotao === 'C') { apagarDigito(); }
        if (textoBotao === 'CE') { limparVisor(); }

        if (tipoOperacao && tipoOperacao !== 'equal') {
            let textoLimpo = visor.innerText.replace(',', '.');
            // Se o visor estiver vazio ou for só uma vírgula, assume 0
            if (textoLimpo === "" || textoLimpo === ".") textoLimpo = "0";
            
            const valorAtual = parseFloat(textoLimpo);

            if (isNaN(valorAtual)) return;

            if (primeiroNumero !== null && operadorAtual !== null && !resetarVisor) {
                const resultadoParcial = calcular(primeiroNumero, valorAtual, operadorAtual);
                
                // Se o cálculo falhar (ex: divisão por zero), resetamos
                if (resultadoParcial === "Erro") {
                    limparVisor();
                    visor.innerText = "Erro";
                    return;
                }
                
                visor.innerText = resultadoParcial.toString().replace('.', ',');
                primeiroNumero = resultadoParcial;
            } else {
                // Se for a primeira vez, apenas guarda o número do visor
                primeiroNumero = valorAtual;
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

        if (tipoOperacao === 'equal') {
            if (primeiroNumero !== null && operadorAtual !== null) {
                const segundoNumero = parseFloat(visor.innerText.replace(',', '.'));
                const resultadoFinal = calcular(primeiroNumero, segundoNumero, operadorAtual);

                last_operation.innerText = `${primeiroNumero} ${operadorAtual} ${segundoNumero}`;
                visor.innerText = resultadoFinal.toString().replace('.', ',');
                
                adicionarHistorico();
                
                // Reseta o estado para uma nova conta
                primeiroNumero = null;
                operadorAtual = null;
                resetarVisor = true;
                esconderSimbolos();
            }
        }
    });
});

function adicionarNumero(numero) {
    if (resetarVisor) {
        visor.innerText = (numero === ',' ? '0,' : numero);
        resetarVisor = false;
        return;
    }

    if (numero === ',' && visor.innerText.includes(',')) return;

    if (visor.innerText === '0' && numero !== ',') {
        visor.innerText = numero;
    } else {
        visor.innerText += numero;
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