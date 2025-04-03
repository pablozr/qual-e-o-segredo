// Configurações do jogo
const NUMEROS_TOTAL = 30;
const COLUNAS = 5;
const ROUNDS = 7; // Alterado para 7 pistas

let currentTabuleiro = null;
let round = 0;
let time = 0; // Tempo começa em 0 e conta para cima
let timerInterval = null; // Para armazenar o intervalo do timer

window.addEventListener('DOMContentLoaded', function() {
    do {
        currentTabuleiro = generateRandomTabuleiro();
    } while (!isSolucionavel(currentTabuleiro));

    generateBoard();
    document.getElementById('rule').textContent = currentTabuleiro.regras[round].texto;
    startTimer();
});

function generateRandomTabuleiro() {
    // Tentamos gerar um tabuleiro válido até encontrar um que funcione com as regras fixas
    let tentativas = 0;
    const MAX_TENTATIVAS = 100;

    while (tentativas < MAX_TENTATIVAS) {
        tentativas++;

        // Gerar números aleatórios
        const numeros = generateRandomNumbers(NUMEROS_TOTAL, 1, 999);

        // Verificar quais números sobrevivem após aplicar todas as regras
        let sobreviventes = [...numeros];
        for (const regra of FIXED_RULES) {
            sobreviventes = sobreviventes.filter(num => !regra.check(num));
        }

        // Se sobrarem exatamente 2 números, escolhemos um deles como segredo
        if (sobreviventes.length === 2) {
            const segredo = sobreviventes[Math.floor(Math.random() * sobreviventes.length)];
            const dicasFinais = generateFinalHints(segredo);

            return {
                numeros: numeros.map(valor => ({ valor })),
                regras: FIXED_RULES,
                dicasFinais,
                segredo
            };
        }
    }

    // Se não conseguimos encontrar um tabuleiro válido após várias tentativas,
    // geramos um tabuleiro com números especiais que garantem o funcionamento
    return generateFallbackTabuleiro();
}

function generateRandomNumbers(count, min, max){
    const numbers = new Set();
    while(numbers.size < count)
        numbers.add(Math.floor(Math.random()*(max-min+1))+min);
    return Array.from(numbers);
}

function generateFallbackTabuleiro() {
    // Esta função gera um tabuleiro com números cuidadosamente selecionados
    // para garantir que exatamente 2 números sobrevivam após aplicar todas as regras

    // Criamos dois números que sobreviverão a todas as regras
    // Estes números são ímpares (não são eliminados pela regra "Elimine números pares"),
    // não têm resto 3 ao dividir por 7 (não são eliminados pela regra "Elimine números com resto 3 ao dividir por 7"),
    // têm soma de algarismos >= 10 (não são eliminados pela regra "Elimine números cuja soma dos algarismos é menor que 10"),
    // são <= 500 (não são eliminados pela regra "Elimine números maiores que 500"),
    // são >= 100 (não são eliminados pela regra "Elimine números menores que 100"),
    // não são múltiplos de 5 (não são eliminados pela regra "Elimine múltiplos de 5"),
    // não terminam em 9 (não são eliminados pela regra "Elimine números terminados em 9")
    const sobrevivente1 = 173; // Ímpar, resto 5 ao dividir por 7, soma = 11, <= 500, >= 100, não é múltiplo de 5, não termina em 9
    const sobrevivente2 = 461; // Ímpar, resto 6 ao dividir por 7, soma = 11, <= 500, >= 100, não é múltiplo de 5, não termina em 9

    // Escolhemos um dos sobreviventes como segredo
    const segredo = Math.random() < 0.5 ? sobrevivente1 : sobrevivente2;

    // Geramos os outros números aleatoriamente
    const outrosNumeros = [];
    while (outrosNumeros.length < NUMEROS_TOTAL - 2) {
        const num = Math.floor(Math.random() * 999) + 1;
        // Garantir que não adicionamos os sobreviventes novamente
        if (num !== sobrevivente1 && num !== sobrevivente2 && !outrosNumeros.includes(num)) {
            outrosNumeros.push(num);
        }
    }

    // Combinamos os sobreviventes com os outros números
    const todosNumeros = [sobrevivente1, sobrevivente2, ...outrosNumeros];

    // Embaralhamos os números
    for (let i = todosNumeros.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [todosNumeros[i], todosNumeros[j]] = [todosNumeros[j], todosNumeros[i]];
    }

    // Geramos as dicas finais
    const dicasFinais = generateFinalHints(segredo);

    return {
        numeros: todosNumeros.slice(0, NUMEROS_TOTAL).map(valor => ({ valor })),
        regras: FIXED_RULES,
        dicasFinais,
        segredo
    };
}

// Conjunto fixo de 7 regras que serão usadas em todos os tabuleiros
const FIXED_RULES = [
    {
        texto: "Elimine números pares",
        check: n => n % 2 === 0
    },
    {
        texto: "Elimine números com resto 3 ao dividir por 7",
        check: n => n % 7 === 3
    },
    {
        texto: "Elimine números cuja soma dos algarismos é menor que 10",
        check: n => sumDigits(n) < 10
    },
    {
        texto: "Elimine números maiores que 500",
        check: n => n > 500
    },
    {
        texto: "Elimine números menores que 100",
        check: n => n < 100
    },
    {
        texto: "Elimine múltiplos de 5",
        check: n => n % 5 === 0
    },
    {
        texto: "Elimine números terminados em 9",
        check: n => n % 10 === 9
    }
];

// Função para verificar se uma regra é aplicável ao tabuleiro atual
function isRuleApplicable(rule, numeros, segredo) {
    // Verifica se existem números que atendem à regra
    const numerosQueAtendem = numeros.filter(n => rule.check(n));

    // Verifica se o segredo não é eliminado pela regra
    const segredoSobrevive = !rule.check(segredo);

    // A regra é aplicável se existem números para marcar e o segredo sobrevive
    return numerosQueAtendem.length > 0 && segredoSobrevive;
}
function generateFinalHints(segredo){
  // 2 dicas fixas e 1 variável
  return [
    `O resto da divisão por 7 é ${segredo%7}`,
    `A soma dos algarismos é ${sumDigits(segredo)}`,
    `O número é ${segredo % 2 === 0 ? 'par' : 'ímpar'}`
  ];
}

function sumDigits(n){
   return String(n).split('').reduce((a,b)=>a+parseInt(b),0);
}

function generateBoard(){
    const board=document.getElementById('board');
    board.innerHTML='';
    const numsCol=Math.ceil(NUMEROS_TOTAL/COLUNAS);
    for(let i=0;i<COLUNAS;i++){
        const col=document.createElement('div');
        col.classList.add('column');
        for(let j=i*numsCol;j<(i+1)*numsCol&&j<NUMEROS_TOTAL;j++){
          const btn=document.createElement('button');
          btn.textContent=currentTabuleiro.numeros[j].valor;
          btn.addEventListener('click',markNumber);
          col.appendChild(btn);
        }
        board.appendChild(col);
    }
}

function startTimer(){
 timerInterval = setInterval(()=>{
   time++;
   let m=Math.floor(time/60), s=time%60;
   document.getElementById('timer').textContent=`Tempo: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
 },1000);
}

function markNumber(event){
    const btn = event.target;
    if (btn.classList.contains('marked') || btn.disabled){
        return; // evita clique se já marcado ou desabilitado
    }
    const numero = parseInt(btn.textContent);
    const regra = currentTabuleiro.regras[round];

    if(regra.check(numero)){
        btn.classList.add('marked');
        btn.classList.add('pulse');
        btn.disabled = true; // Não deixa clicar novamente
        setTimeout(()=>btn.classList.remove('pulse'),300);
    }else{
        btn.classList.add('shake');
        document.getElementById('alert').textContent="Número não atende a regra!";
        setTimeout(()=>{
            btn.classList.remove('shake');
            document.getElementById('alert').textContent="";
        },500);
    }
}

function verificarNumerosCorretos() {
    // Verificar se estamos em um round válido
    if (round >= ROUNDS || !currentTabuleiro.regras[round]) {
        return true; // Se não há regra atual, consideramos que está correto
    }

    const regraAtual = currentTabuleiro.regras[round];
    const todosOsBotoes = document.querySelectorAll('#board button');

    // Verificar se existem números para marcar
    let existemNumerosParaMarcar = false;

    // Usar um loop for tradicional para evitar problemas com forEach
    for (let idx = 0; idx < currentTabuleiro.numeros.length; idx++) {
        const numero = currentTabuleiro.numeros[idx];
        if (idx < todosOsBotoes.length && regraAtual.check(numero.valor)) {
            existemNumerosParaMarcar = true;
            break;
        }
    }

    // Se não houver números para marcar, consideramos que está correto
    if (!existemNumerosParaMarcar) {
        return true;
    }

    // Caso contrário, verificamos se todos os números que deveriam ser marcados foram marcados
    for (let idx = 0; idx < currentTabuleiro.numeros.length; idx++) {
        const numero = currentTabuleiro.numeros[idx];
        if (idx >= todosOsBotoes.length) continue;

        const btn = todosOsBotoes[idx];
        if (regraAtual.check(numero.valor) && !btn.classList.contains('marked')) {
            return false; // Encontrou um número que deveria ser marcado mas não foi
        }
    }

    return true; // Todos os números que deveriam ser marcados foram marcados
}

function verificarSeExistemNumerosParaMarcar(roundIndex) {
    // Verifica se existem números para marcar na regra especificada
    if (roundIndex >= ROUNDS || !currentTabuleiro.regras[roundIndex]) {
        return false;
    }

    const regra = currentTabuleiro.regras[roundIndex];
    const numerosNaoMarcados = document.querySelectorAll('#board button:not(.marked):not(:disabled)');

    // Se não houver botões disponíveis, não há números para marcar
    if (numerosNaoMarcados.length === 0) {
        return false;
    }

    // Verificar se algum dos botões não marcados atende à regra
    let encontrouNumeroParaMarcar = false;
    for (let i = 0; i < numerosNaoMarcados.length; i++) {
        const numero = parseInt(numerosNaoMarcados[i].textContent);
        if (regra.check(numero)) {
            encontrouNumeroParaMarcar = true;
            break;
        }
    }

    // Se não encontrou nenhum número para marcar, avance automaticamente
    if (!encontrouNumeroParaMarcar) {
        console.log(`Nenhum número para marcar na pista ${roundIndex + 1}. Avançando automaticamente.`);
    }

    return encontrouNumeroParaMarcar;
}

function avancarParaProximaPistaValida() {
    // Avança para a próxima pista que tenha números para marcar
    let proximoRound = round + 1;

    // Procurar a próxima pista válida
    while (proximoRound < ROUNDS && !verificarSeExistemNumerosParaMarcar(proximoRound)) {
        console.log(`Pulando pista ${proximoRound + 1} porque não há números para marcar.`);
        proximoRound++;
    }

    // Atualizar o round e a interface
    round = proximoRound;

    if (round < ROUNDS) {
        // Ainda temos pistas válidas
        const regraElement = document.getElementById('rule');
        if (regraElement && currentTabuleiro.regras[round]) {
            regraElement.textContent = currentTabuleiro.regras[round].texto;
            console.log(`Avançando para a pista ${round + 1}: ${currentTabuleiro.regras[round].texto}`);
        }
    } else {
        // Chegamos ao final das pistas
        // Verificar se restam apenas 2 números não marcados
        const numerosRestantes = document.querySelectorAll('#board button:not(.marked):not(:disabled)');
        console.log(`Chegamos ao final das pistas. Restam ${numerosRestantes.length} números.`);

        if (numerosRestantes.length > 2) {
            alert("Você precisa eliminar mais números! Devem restar apenas 2 números.");
            // Voltar para a última pista válida
            round = ROUNDS - 1;
            return false;
        } else if (numerosRestantes.length < 2) {
            alert("Erro: Restam menos de 2 números. Isso não deveria acontecer.");
            return false;
        }

        document.getElementById('final-step').classList.remove('hidden');
        document.getElementById('rule').textContent = "Última etapa!";
        console.log("Avançando para a última etapa!");
    }

    return true;
}

function nextRound() {
    // Verificar se há números para marcar na regra atual
    if (round < ROUNDS && currentTabuleiro.regras[round]) {
        const existemNumerosParaMarcar = verificarSeExistemNumerosParaMarcar(round);

        if (!existemNumerosParaMarcar) {
            // Se não houver números para marcar, avançamos automaticamente
            return avancarParaProximaPistaValida();
        }

        if (!verificarNumerosCorretos()) {
            alert("Marque corretamente os números antes de avançar!");
            return false;
        }
    }

    // Verificar se estamos na última pista
    if (round >= ROUNDS - 1) {
        // Verificar se restam apenas 2 números não marcados
        const numerosRestantes = document.querySelectorAll('#board button:not(.marked):not(:disabled)');
        if (numerosRestantes.length > 2) {
            alert("Você precisa eliminar mais números! Devem restar apenas 2 números.");
            return false;
        }

        document.getElementById('final-step').classList.remove('hidden');
        document.getElementById('rule').textContent = "Última etapa!";
        return true;
    }

    // Avançar para a próxima pista válida
    return avancarParaProximaPistaValida();
}

function checkFinalNumbers(){
  document.getElementById('final-step').classList.add('hidden');
  document.getElementById('end-game').classList.remove('hidden');
  const hints=document.getElementById('final-hints');
  hints.innerHTML='';
  currentTabuleiro.dicasFinais.forEach(d=>hints.innerHTML+=`<p>${d}</p>`);
}

function finishGame(){
  const sInp=document.getElementById('secret'),s=parseInt(sInp.value);
  if(s===currentTabuleiro.segredo){
    // Parar o timer e armazenar o tempo final
    clearInterval(timerInterval);
    localStorage.setItem('tempoFinal', time);

    sInp.style.transition='transform 0.5s';
    sInp.style.transform='scale(1.2)';
    setTimeout(()=>window.location.href='end.html',500);
  }else{
    sInp.classList.add('shake');
    document.getElementById('alert').textContent="Errado! Tente novamente.";
    setTimeout(()=>{
      sInp.classList.remove('shake');
      document.getElementById('alert').textContent='';
    },500);
  }
}

function isSolucionavel(tabuleiro){
  let nums = tabuleiro.numeros.map(n => n.valor);

  // Verificar se o segredo sobrevive após aplicar todas as regras
  FIXED_RULES.forEach(regra => {
    nums = nums.filter(num => !regra.check(num));
  });

  // Verificar se o segredo sobrevive e se restam exatamente 2 números (incluindo o segredo)
  return nums.includes(tabuleiro.segredo) && nums.length === 2;
}
