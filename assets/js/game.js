// Configurações do jogo
const NUMEROS_TOTAL = 30;
const COLUNAS = 5;
const ROUNDS = 7; // Alterado para 7 pistas

// Conjunto fixo de 7 regras que serão usadas em todos os tabuleiros
const FIXED_RULES = [
    {
        texto: "Elimine números múltiplos de 4",
        check: n => n % 4 === 0,
        isTrue: Math.random() < 0.5 // 50% de chance de ser verdadeira ou falsa
    },
    {
        texto: "Elimine números divisíveis por 5",
        check: n => n % 5 === 0,
        isTrue: Math.random() < 0.5
    },
    {
        texto: "Elimine números pares",
        check: n => n % 2 === 0,
        isTrue: Math.random() < 0.5
    },
    {
        texto: "Elimine números que não são múltiplos de 3",
        check: n => n % 3 !== 0,
        isTrue: Math.random() < 0.5
    },
    {
        texto: "Elimine números divisíveis por 9",
        check: n => n % 9 === 0,
        isTrue: Math.random() < 0.5
    },
    {
        texto: "Elimine números cujo resto da divisão por 5 é 2",
        check: n => n % 5 === 2,
        isTrue: Math.random() < 0.5
    },
    {
        texto: "Elimine números cuja soma dos algarismos é ímpar",
        check: n => sumDigits(n) % 2 === 1,
        isTrue: Math.random() < 0.5
    }
];

let currentTabuleiro = null;
let round = 0;
let time = 0; // Tempo começa em 0 e conta para cima
let timerInterval = null; // Para armazenar o intervalo do timer
let playerName = ''; // Para armazenar o nome do jogador

// Função auxiliar para somar os algarismos de um número
function sumDigits(n){
   return String(n).split('').reduce((a,b)=>a+parseInt(b),0);
}

// Função para atualizar a barra de progresso
function updateLoadingProgress(percent, message) {
    const loadingBar = document.getElementById('loading-bar');
    const loadingMessage = document.getElementById('loading-message');

    if (loadingBar) {
        loadingBar.style.width = `${percent}%`;
    }

    if (loadingMessage && message) {
        loadingMessage.textContent = message;
    }
}

// Função para iniciar o jogo com o nome do jogador
async function startGameWithPlayerName() {
    const nameInput = document.getElementById('player-name-input');
    playerName = nameInput.value.trim();

    if (!playerName) {
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 500);
        return;
    }

    // Esconder o modal de nome
    document.getElementById('player-name-modal').style.display = 'none';

    // Mostrar a tela de carregamento
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('hidden');
    updateLoadingProgress(0, 'Iniciando o jogo...');

    // Pequeno atraso para garantir que a tela de carregamento seja exibida
    setTimeout(async () => {
        try {
            // Inicializar o jogo
            await initializeGame();

            // Esconder a tela de carregamento quando o jogo estiver pronto
            loadingScreen.classList.add('hidden');
        } catch (error) {
            console.error('Erro ao inicializar o jogo:', error);
            alert('Ocorreu um erro ao inicializar o jogo. Por favor, recarregue a página.');
            loadingScreen.classList.add('hidden');
        }
    }, 100);
}

// Função para inicializar o jogo
async function initializeGame() {
    try {
        // Atualizar a barra de progresso
        updateLoadingProgress(10, 'Inicializando o jogo...');

        // Garantir que cada regra tenha a propriedade isTrue definida
        FIXED_RULES.forEach(rule => {
            if (typeof rule.isTrue === 'undefined') {
                rule.isTrue = Math.random() < 0.5; // 50% de chance de ser verdadeira ou falsa
            }
        });

        updateLoadingProgress(30, 'Processando regras...');

        updateLoadingProgress(40, 'Gerando tabuleiro...');

        // Gerar o tabuleiro com tentativas até encontrar um válido
        let tentativas = 0;
        let tabuleiroValido = false;

        updateLoadingProgress(40, 'Gerando tabuleiro com todas as pistas válidas...');

        // Continuar tentando até encontrar um tabuleiro válido
        while (!tabuleiroValido) {
            tentativas++;
            updateLoadingProgress(40 + (tentativas % 100) / 100 * 30, `Tentativa ${tentativas}...`);

            // Gerar um novo tabuleiro
            currentTabuleiro = generateRandomTabuleiro();

            // Verificar se o tabuleiro é válido
            if (currentTabuleiro !== null) {
                // Verificar se todas as pistas têm números para marcar
                tabuleiroValido = verificarTodasPistasTemNumerosParaMarcar(currentTabuleiro);

                if (tabuleiroValido) {
                    // Gerar as dicas finais
                    currentTabuleiro.dicasFinais = generateFinalHints(currentTabuleiro.segredo);
                    console.log('Tabuleiro válido gerado após', tentativas, 'tentativas');
                    console.log('Segredo:', currentTabuleiro.segredo);
                    console.log('Sobreviventes:', currentTabuleiro.sobreviventes);

                    // Verificar se restam exatamente 2 números
                    if (currentTabuleiro.sobreviventes.length === 2) {
                        console.log('Restam exatamente 2 números após aplicar todas as regras!');
                    } else {
                        console.log('ERRO: Não restam exatamente 2 números após aplicar todas as regras!');
                        tabuleiroValido = false; // Continuar tentando
                    }
                }
            }

            // A cada 1000 tentativas, mostrar uma mensagem de progresso
            if (tentativas % 1000 === 0) {
                console.log(`Ainda tentando gerar um tabuleiro válido... Tentativa ${tentativas}`);
            }
        }

        updateLoadingProgress(80, 'Gerando interface do jogo...');

        // Gerar o tabuleiro na interface
        generateBoard();

        updateLoadingProgress(90, 'Finalizando...');

        // Exibir a primeira dica com o detetive indicando se é verdadeira ou falsa
        const regra = currentTabuleiro.regras[round];
        const detetiveIcon = regra.isTrue ?
            '<i class="fas fa-user-secret" style="color: green;"></i> VERDADEIRA: ' :
            '<i class="fas fa-user-secret" style="color: red;"></i> FALSA: ';

        document.getElementById('rule').innerHTML = detetiveIcon + regra.texto;

        updateLoadingProgress(100, 'Jogo pronto!');

        // Iniciar o timer
        startTimer();
    } catch (error) {
        console.error('Erro ao inicializar o jogo:', error);
        alert('Ocorreu um erro ao inicializar o jogo. Por favor, recarregue a página.');
    }
}

window.addEventListener('DOMContentLoaded', function() {
    // Mostrar o modal para inserir o nome do jogador
    document.getElementById('player-name-modal').style.display = 'flex';

    // Focar no campo de entrada de nome
    document.getElementById('player-name-input').focus();

    // Permitir pressionar Enter para iniciar o jogo
    document.getElementById('player-name-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGameWithPlayerName();
        }
    });
});

function generateRandomTabuleiro() {
    // Definir valores de isTrue para as regras
    FIXED_RULES.forEach(rule => {
        rule.isTrue = Math.random() < 0.5; // 50% de chance de ser verdadeira ou falsa
    });

    // Gerar números aleatórios
    const numeros = generateRandomNumbers(NUMEROS_TOTAL);

    // Escolher um número aleatório como segredo
    const segredoIndex = Math.floor(Math.random() * numeros.length);
    const segredo = numeros[segredoIndex];

    // Verificar quais números sobrevivem após aplicar todas as regras
    let sobreviventes = [...numeros];

    // Aplicar cada regra para filtrar os números
    for (const regra of FIXED_RULES) {
        // Verificar quantos números seriam eliminados pela regra
        const numerosEliminados = regra.isTrue ?
            sobreviventes.filter(num => regra.check(num)) :
            sobreviventes.filter(num => !regra.check(num));

        // Verificar se o segredo seria eliminado
        const segredoEliminado = regra.isTrue ?
            regra.check(segredo) :
            !regra.check(segredo);

        // Se o segredo seria eliminado, retornar null
        if (segredoEliminado) {
            return null;
        }

        // Se todos os números seriam eliminados, retornar null
        if (numerosEliminados.length === sobreviventes.length) {
            return null;
        }

        // Aplicar a regra
        if (regra.isTrue) {
            // Se a regra é verdadeira, eliminamos os números que atendem à regra
            sobreviventes = sobreviventes.filter(num => !regra.check(num));
        } else {
            // Se a regra é falsa, eliminamos os números que NÃO atendem à regra
            sobreviventes = sobreviventes.filter(num => regra.check(num));
        }

        // Se já temos menos de 2 números, retornar null
        if (sobreviventes.length < 2) {
            return null;
        }
    }

    // Verificar se temos exatamente 2 números no final
    if (sobreviventes.length !== 2) {
        return null;
    }

    // Verificar se o segredo está entre os sobreviventes
    if (!sobreviventes.includes(segredo)) {
        return null;
    }

    // Gerar as dicas finais
    const dicasFinais = [];

    // Retornar o tabuleiro válido
    return {
        numeros: numeros.map(valor => ({ valor })),
        regras: FIXED_RULES,
        dicasFinais,
        segredo,
        sobreviventes // Adicionamos os sobreviventes para uso posterior
    };
}

function generateRandomNumbers(count){
    const numbers = new Set();
    while(numbers.size < count) {
        // Reduzir a chance de números de 3 algarismos
        // 70% de chance de gerar números de 1-2 algarismos (1-99)
        // 30% de chance de gerar números de 3 algarismos (100-999)
        let num;
        if (Math.random() < 0.7) {
            // Gerar número de 1-2 algarismos (1-99)
            num = Math.floor(Math.random() * 99) + 1;
        } else {
            // Gerar número de 3 algarismos (100-999)
            num = Math.floor(Math.random() * 900) + 100;
        }
        numbers.add(num);
    }
    return Array.from(numbers);
}



// Função para verificar se uma regra é aplicável ao tabuleiro atual
function isRuleApplicable(rule, numeros, segredo) {
    // Verifica se existem números que atendem à regra, considerando se é verdadeira ou falsa
    const numerosQueAtendem = rule.isTrue ?
        numeros.filter(n => rule.check(n)) :
        numeros.filter(n => !rule.check(n));

    // Verifica se o segredo não é eliminado pela regra, considerando se é verdadeira ou falsa
    const segredoSobrevive = rule.isTrue ?
        !rule.check(segredo) :
        rule.check(segredo);

    // A regra é aplicável se existem números para marcar e o segredo sobrevive
    return numerosQueAtendem.length > 0 && segredoSobrevive;
}
function generateFinalHints(segredo) {
  // Obter os dois números finais
  let nums = [];

  // Se o tabuleiro tem sobreviventes, usamos eles
  if (currentTabuleiro && currentTabuleiro.sobreviventes && currentTabuleiro.sobreviventes.length === 2) {
    nums = [...currentTabuleiro.sobreviventes];
  } else {
    // Caso contrário, aplicamos todas as regras para encontrar os dois números finais
    let todosNumeros = currentTabuleiro ? currentTabuleiro.numeros.map(n => n.valor) : [];

    if (currentTabuleiro && currentTabuleiro.regras) {
      currentTabuleiro.regras.forEach(regra => {
        if (regra.isTrue) {
          todosNumeros = todosNumeros.filter(num => !regra.check(num));
        } else {
          todosNumeros = todosNumeros.filter(num => regra.check(num));
        }
      });
    }

    // Se temos exatamente 2 números, usamos eles
    if (todosNumeros.length === 2) {
      nums = todosNumeros;
    } else {
      // Caso contrário, usamos o segredo e um número aleatório
      nums = [segredo, segredo + (Math.random() < 0.5 ? 1 : -1)];
    }
  }

  // Garantir que o segredo está na lista
  if (!nums.includes(segredo)) {
    nums[1] = segredo;
  }

  // Ordenar os números para facilitar a comparação
  nums.sort((a, b) => a - b);

  // Obter o outro número (não o segredo)
  const outroNumero = nums[0] === segredo ? nums[1] : nums[0];

  // Gerar dicas fixas
  const dicas = [
    `O resto da divisão por 7 é ${segredo % 7}`,
    `A soma dos algarismos é ${sumDigits(segredo)}`
  ];

  // Gerar uma dica aleatória que diferencie os dois números
  const diferencas = [
    // Comparação de tamanho
    segredo > outroNumero ?
      `O número secreto é maior que ${outroNumero}` :
      `O número secreto é menor que ${outroNumero}`,

    // Paridade
    segredo % 2 === 0 ?
      `O número secreto é par` :
      `O número secreto é ímpar`,

    // Comparação de algarismos
    segredo.toString().length === outroNumero.toString().length ?
      `O número secreto tem ${segredo.toString().length} algarismos` :
      `O número secreto tem ${segredo.toString().length} algarismos, diferente do outro número`,

    // Divisão por 3
    segredo % 3 === 0 ?
      `O número secreto é divisível por 3` :
      `O número secreto não é divisível por 3`
  ];

  // Escolher uma dica aleatória que diferencie os dois números
  const dicaAleatoria = diferencas[Math.floor(Math.random() * diferencas.length)];
  dicas.push(dicaAleatoria);

  return dicas;
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

    // Verificar se a regra é verdadeira ou falsa e aplicar a lógica correspondente
    const shouldMark = regra.isTrue ? regra.check(numero) : !regra.check(numero);

    if(shouldMark){
        btn.classList.add('marked');
        btn.classList.add('pulse');
        btn.disabled = true; // Não deixa clicar novamente
        setTimeout(()=>btn.classList.remove('pulse'),300);
    }else{
        btn.classList.add('shake');
        document.getElementById('alert').textContent="Número não atende a regra!";

        // Registrar erro na pista no banco de dados
        if (regra.id) {
            try {
                registerRuleError(regra.id).catch(error => {
                    console.error('Erro ao registrar erro na pista:', error);
                    // Continuar o jogo mesmo se houver erro ao registrar o erro
                });
            } catch (error) {
                console.error('Erro ao tentar registrar erro na pista:', error);
                // Continuar o jogo mesmo se houver erro ao registrar o erro
            }
        }

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
        // Considerar se a regra é verdadeira ou falsa
        const shouldMark = regraAtual.isTrue ? regraAtual.check(numero.valor) : !regraAtual.check(numero.valor);
        if (idx < todosOsBotoes.length && shouldMark) {
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
        // Considerar se a regra é verdadeira ou falsa
        const shouldMark = regraAtual.isTrue ? regraAtual.check(numero.valor) : !regraAtual.check(numero.valor);
        if (shouldMark && !btn.classList.contains('marked')) {
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
        // Considerar se a regra é verdadeira ou falsa
        const shouldMark = regra.isTrue ? regra.check(numero) : !regra.check(numero);
        if (shouldMark) {
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
            // Atualizar o texto da regra com o detetive indicando se é verdadeira ou falsa
            const regra = currentTabuleiro.regras[round];
            const detetiveIcon = regra.isTrue ?
                '<i class="fas fa-user-secret" style="color: green;"></i> VERDADEIRA: ' :
                '<i class="fas fa-user-secret" style="color: red;"></i> FALSA: ';

            regraElement.innerHTML = detetiveIcon + regra.texto;
            console.log(`Avançando para a pista ${round + 1}: ${regra.texto} (${regra.isTrue ? 'Verdadeira' : 'Falsa'})`);
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

        // Ir direto para a tela de adivinhar o segredo
        checkFinalNumbers();
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

        // Ir direto para a tela de adivinhar o segredo
        checkFinalNumbers();
        return true;
    }

    // Avançar para a próxima pista válida
    return avancarParaProximaPistaValida();
}

function checkFinalNumbers(){
  // Obter os números restantes
  const numerosRestantes = document.querySelectorAll('#board button:not(.marked):not(:disabled)');

  // Mostrar a tela de adivinhar o segredo
  document.getElementById('end-game').classList.remove('hidden');

  // Mostrar os números restantes no painel de dicas finais
  const remainingNumbersContainer = document.getElementById('remaining-numbers-end');
  remainingNumbersContainer.innerHTML = '';

  numerosRestantes.forEach(btn => {
    const numero = btn.textContent;
    const numeroElement = document.createElement('div');
    numeroElement.className = 'remaining-number';
    numeroElement.textContent = numero;
    remainingNumbersContainer.appendChild(numeroElement);
  });

  // Mostrar as dicas finais
  const hints=document.getElementById('final-hints');
  hints.innerHTML='';
  currentTabuleiro.dicasFinais.forEach(d=>hints.innerHTML+=`<p>${d}</p>`);

  // Atualizar o texto da regra
  document.getElementById('rule').textContent = "Descubra o segredo!";
}

function finishGame(){
  const sInp=document.getElementById('secret'),s=parseInt(sInp.value);
  if(s===currentTabuleiro.segredo){
    // Parar o timer e armazenar o tempo final
    clearInterval(timerInterval);
    localStorage.setItem('tempoFinal', time);

    // Registrar o tempo de conclusão no banco de dados com o nome do jogador
    try {
      registerGameCompletion(time, playerName).catch(error => {
        console.error('Erro ao registrar tempo de conclusão:', error);
        // Continuar o jogo mesmo se houver erro ao registrar o tempo
      });
    } catch (error) {
      console.error('Erro ao tentar registrar tempo de conclusão:', error);
      // Continuar o jogo mesmo se houver erro ao registrar o tempo
    }

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

// Função para verificar se todas as pistas têm números para marcar
function verificarTodasPistasTemNumerosParaMarcar(tabuleiro) {
  // Primeiro verificamos se o tabuleiro é solucionável
  if (!isSolucionavel(tabuleiro)) {
    return false;
  }

  // Agora verificamos se cada pista tem números para marcar
  let nums = tabuleiro.numeros.map(n => n.valor);

  for (let i = 0; i < tabuleiro.regras.length; i++) {
    const regra = tabuleiro.regras[i];

    // Verificar se a regra tem números para marcar nos números restantes
    let numerosParaMarcar = [];
    if (regra.isTrue) {
      numerosParaMarcar = nums.filter(num => regra.check(num));
    } else {
      numerosParaMarcar = nums.filter(num => !regra.check(num));
    }

    // Se não há números para marcar com esta regra, o tabuleiro não é válido
    if (numerosParaMarcar.length === 0) {
      return false;
    }

    // Aplicar a regra para obter os números restantes para a próxima regra
    if (regra.isTrue) {
      nums = nums.filter(num => !regra.check(num));
    } else {
      nums = nums.filter(num => regra.check(num));
    }
  }

  // Se chegamos até aqui, todas as pistas têm números para marcar
  return true;
}

function isSolucionavel(tabuleiro){
  // Versão otimizada com menos logs e verificação antecipada
  let nums = tabuleiro.numeros.map(n => n.valor);

  // Verificar se o segredo está nos números iniciais
  if (!nums.includes(tabuleiro.segredo)) {
    return false;
  }

  // Verificar se o segredo sobrevive após aplicar todas as regras
  for (let i = 0; i < tabuleiro.regras.length; i++) {
    const regra = tabuleiro.regras[i];

    // Verificar se a regra tem números para marcar
    let numerosParaMarcar = [];
    if (regra.isTrue) {
      numerosParaMarcar = nums.filter(num => regra.check(num));
    } else {
      numerosParaMarcar = nums.filter(num => !regra.check(num));
    }

    // Se não há números para marcar com esta regra, o tabuleiro não é solucionável
    if (numerosParaMarcar.length === 0) {
      return false;
    }

    // Considerar se a regra é verdadeira ou falsa
    if (regra.isTrue) {
      // Se a regra é verdadeira e o segredo seria eliminado, o tabuleiro não é solucionável
      if (regra.check(tabuleiro.segredo)) {
        return false;
      }

      // Filtrar os números que sobrevivem
      nums = nums.filter(num => !regra.check(num));
    } else {
      // Se a regra é falsa e o segredo não seria eliminado pela regra original, o tabuleiro não é solucionável
      if (!regra.check(tabuleiro.segredo)) {
        return false;
      }

      // Filtrar os números que sobrevivem (aplicando a negação da regra)
      nums = nums.filter(num => regra.check(num));
    }

    // Verificação antecipada: se já temos menos de 2 números, o tabuleiro não é solucionável
    if (nums.length < 2) {
      return false;
    }

    // Verificação antecipada: se o segredo não sobreviveu, o tabuleiro não é solucionável
    if (!nums.includes(tabuleiro.segredo)) {
      return false;
    }

    // Atualizar a barra de progresso (se estiver visível)
    updateLoadingProgress((i + 1) / tabuleiro.regras.length * 100, `Verificando regra ${i + 1}...`);
  }

  // Verificar se restam exatamente 2 números (incluindo o segredo)
  return nums.length === 2;
}
