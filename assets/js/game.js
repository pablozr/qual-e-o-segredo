// Configurações do jogo
const NUMEROS_TOTAL = 30;
const COLUNAS = 5;
const ROUNDS = 3;
const TEMPO_INICIAL = 15 * 60;

let currentTabuleiro = null;
let round = 0;
let time = TEMPO_INICIAL;

window.addEventListener('DOMContentLoaded', function() {
    do {
        currentTabuleiro = generateRandomTabuleiro();
    } while (!isSolucionavel(currentTabuleiro));

    generateBoard();
    document.getElementById('rule').textContent = currentTabuleiro.regras[round].texto;
    startTimer();
});

function generateRandomTabuleiro() {
    const numeros = generateRandomNumbers(NUMEROS_TOTAL, 1, 999);
    const segredo = numeros[Math.floor(Math.random() * numeros.length)];
    const regras = generateRandomRules(segredo, numeros, ROUNDS);
    const dicasFinais = generateFinalHints(segredo);

    return {
        numeros: numeros.map(valor => ({ valor })),
        regras,
        dicasFinais,
        segredo
    };
}

function generateRandomNumbers(count, min, max){
    const numbers = new Set();
    while(numbers.size < count)
        numbers.add(Math.floor(Math.random()*(max-min+1))+min);
    return Array.from(numbers);
}

function generateRandomRules(segredo, numeros, count) {
    const possibleRules = [
        {
            descricao: "Elimine números pares",
            valida(numeros) { return numeros.some(n => n % 2 === 0) && segredo % 2 !== 0; },
            check: n => n % 2 === 0
        },
        {
            descricao: "Elimine números ímpares",
            valida(numeros) { return numeros.some(n => n % 2 !== 0) && segredo % 2 === 0; },
            check: n => n % 2 !== 0
        },
        {
            descricao: (param) => `Elimine números com resto ${param} ao dividir por 7`,
            valida(numeros, param) { return numeros.some(n => n % 7 === param) && segredo % 7 !== param; },
            parametro: () => Math.floor(Math.random() * 7),
            check: (n, param) => n % 7 === param
        },
        {
            descricao: (param) => `Elimine números cuja soma dos algarismos é menor que ${param}`,
            valida(numeros, param) { return numeros.some(n => sumDigits(n) < param) && sumDigits(segredo) >= param; },
            parametro: () => Math.floor(Math.random() * 15) + 5,
            check: (n, param) => sumDigits(n) < param
        },
        {
            descricao: (param) => `Elimine números maiores que ${param}`,
            valida(numeros, param) { return numeros.some(n => n > param) && segredo <= param; },
            parametro: () => Math.floor(Math.random() * (Math.max(...numeros) - segredo)) + segredo + 5,
            check: (n, param) => n > param
        },
        {
            descricao: (param) => `Elimine números menores que ${param}`,
            valida(numeros, param) { return numeros.some(n => n < param) && segredo >= param; },
            parametro: () => Math.floor(Math.random() * (segredo - Math.min(...numeros))) + Math.min(...numeros),
            check: (n, param) => n < param
        },
        {
            descricao: (param) => `Elimine múltiplos de ${param}`,
            valida(numeros, param) { return numeros.some(n => n % param === 0) && segredo % param !== 0; },
            parametro: () => Math.floor(Math.random() * 8) + 2,
            check: (n, param) => n % param === 0
        },
        {
            descricao: (param) => `Elimine números terminados em ${param}`,
            valida(numeros, param) { return numeros.some(n => n % 10 === param) && segredo % 10 !== param; },
            parametro: () => Math.floor(Math.random() * 10),
            check: (n, param) => n % 10 === param
        }
    ];

    const regrasSelecionadas = [];
    const regrasDisponiveis = [...possibleRules];

    while (regrasSelecionadas.length < count && regrasDisponiveis.length) {
        const idx = Math.floor(Math.random() * regrasDisponiveis.length);
        const regraTemplate = regrasDisponiveis.splice(idx, 1)[0];

        const param = regraTemplate.parametro ? regraTemplate.parametro() : null;
        const descricao = typeof regraTemplate.descricao === 'function' ? 
            regraTemplate.descricao(param) : regraTemplate.descricao;

        if (regraTemplate.valida(numeros, param)) {
            regrasSelecionadas.push({
                texto: descricao, // Garantindo que a regra tem a propriedade 'texto'
                check: n => regraTemplate.check(n, param)
            });
        }
    }

    return regrasSelecionadas;
}
function generateFinalHints(segredo){
  return [
    `O resto da divisão por 7 é ${segredo%7}`,
    `A soma dos algarismos é ${sumDigits(segredo)}`
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
 const t=setInterval(()=>{
   time--;
   let m=Math.floor(time/60), s=time%60;
   document.getElementById('timer').textContent=`Tempo: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
   if(time<=0){
     clearInterval(t);
     alert('Tempo esgotado!');
     window.location.reload();
   }
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
    const regraAtual = currentTabuleiro.regras[round];
    const todosOsBotoes = document.querySelectorAll('#board button');
    
    return !currentTabuleiro.numeros.some((numero, idx) => {
        if (idx >= todosOsBotoes.length) return false;
        const btn = todosOsBotoes[idx];
        return regraAtual.check(numero.valor) && !btn.classList.contains('marked');
    });
}

function nextRound() {
    if (!verificarNumerosCorretos()) {
        alert("Marque corretamente os números antes de avançar!");
        return;
    }
    
    if (round >= ROUNDS - 1) {
        document.getElementById('final-step').classList.remove('hidden');
        document.getElementById('rule').textContent = "Última etapa!";
        return;
    }
    
    round++;
    const regraElement = document.getElementById('rule');
    if (regraElement && currentTabuleiro.regras[round]) {
        regraElement.textContent = currentTabuleiro.regras[round].texto; // Usando a propriedade 'texto' da regra
    }
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
  let nums=tabuleiro.numeros.map(n=>n.valor);
  tabuleiro.regras.forEach(regra=>{
    nums=nums.filter(num=>!regra.check(num));
  });
  return nums.includes(tabuleiro.segredo);
}
