// Configurações do jogo
const NUMEROS_TOTAL = 30;
const COLUNAS = 5;
const ROUNDS = 7; // Alterado para 7 pistas

// Conjunto fixo de 7 regras que serão usadas em todos os tabuleiros
const FIXED_RULES = [
    {
        texto: "O número é múltiplo de 4",
        check: n => n % 4 === 0,
        isTrue: Math.random() < 0.3 // 30% de chance de ser verdadeira e 70% de ser falsa
    },
    {
        texto: "O número é divisível por 5",
        check: n => n % 5 === 0,
        isTrue: Math.random() < 0.3
    },
    {
        texto: "O número é par",
        check: n => n % 2 === 0,
        isTrue: Math.random() < 0.3
    },
    {
        texto: "O número não é múltiplo de 3",
        check: n => n % 3 !== 0,
        isTrue: Math.random() < 0.3
    },
    {
        texto: "O número é divisível por 9",
        check: n => n % 9 === 0,
        isTrue: Math.random() < 0.3
    },
    {
        texto: "O resto da divisão do número por 5 é 2",
        check: n => n % 5 === 2,
        isTrue: Math.random() < 0.3
    },
    {
        texto: "A soma dos algarismos do número é ímpar",
        check: n => sumDigits(n) % 2 === 1,
        isTrue: Math.random() < 0.3
    }
];

let currentTabuleiro = null;
let round = 0;
let time = 0; // Tempo começa em 0 e conta para cima
let timerInterval = null; // Para armazenar o intervalo do timer
let playerName = ''; // Para armazenar o nome do jogador
let errorCount = 0; // Contador de erros por pista (resetado a cada pista)

// Variáveis para controle de spam e tentativas aleatórias
let lastClickTime = 0; // Último momento em que um número foi clicado
let clickCooldown = 800; // Tempo mínimo entre cliques (aumentado para 800ms)
let clickCount = 0; // Contador de cliques em um curto período
let clickCountResetTimeout = null; // Timeout para resetar o contador de cliques
let isClickBlocked = false; // Flag para indicar se os cliques estão bloqueados

// Controle de tentativas incorretas consecutivas
let wrongAttemptsInRow = 0; // Tentativas erradas consecutivas
let totalWrongAttempts = 0; // Total de tentativas erradas na pista atual
let blockDuration = 3000; // Duração inicial do bloqueio (3 segundos)
let maxWrongAttempts = 3; // Máximo de tentativas erradas antes de penalidade maior

// Variável para controle do tutorial
let tutorialShown = false;

// Variável para controle do modo de alto contraste
let highContrastMode = false;

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
        // Resetar todas as variáveis do jogo
        round = 0;
        time = 0;
        errorCount = 0;
        wrongAttemptsInRow = 0;
        totalWrongAttempts = 0;
        clickCount = 0;
        isClickBlocked = false;
        lastClickTime = 0;

        // Atualizar a barra de progresso
        updateLoadingProgress(10, 'Inicializando o jogo...');

        // Garantir que cada regra tenha a propriedade isTrue definida
        FIXED_RULES.forEach(rule => {
            if (typeof rule.isTrue === 'undefined') {
                rule.isTrue = Math.random() < 0.5; // 50% de chance de ser verdadeira ou falsa
            }
        });

        updateLoadingProgress(30, 'Processando protocolos de segurança...');

        updateLoadingProgress(40, 'Gerando matriz de códigos...');

        // Gerar o tabuleiro com tentativas até encontrar um válido
        let tentativas = 0;
        let tabuleiroValido = false;

        updateLoadingProgress(40, 'Validando códigos de segurança...');

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

        updateLoadingProgress(80, 'Carregando interface de segurança...');

        // Gerar o tabuleiro na interface
        generateBoard();

        updateLoadingProgress(90, 'Estabelecendo conexão segura...');

        // Exibir a primeira dica com o detetive indicando se é verdadeira ou falsa
        const regra = currentTabuleiro.regras[round];

        // Definir cores para cada pista com melhor contraste
        const coresPistas = [
            '#8A2BE2',  // Azul violeta (mais escuro que retro-purple)
            '#FF1493',  // Rosa profundo (mais escuro que retro-pink)
            '#00868B',  // Ciano escuro (mais escuro que retro-cyan)
            '#B8860B',  // Dourado escuro (mais escuro que retro-yellow)
            '#D2691E',  // Chocolate (mais escuro que retro-orange)
            '#228B22',  // Verde floresta (mais escuro que accent-color)
            '#B22222'   // Vermelho tijolo (mais escuro que primary-color)
        ];

        const corAtual = coresPistas[round % coresPistas.length];

        // Melhorar o feedback visual para pistas verdadeiras/falsas usando variáveis CSS
        const detetiveIcon = regra.isTrue ?
            `<div style="display: inline-flex; align-items: center; background-color: var(--true-color); padding: 5px 10px; border-radius: 5px; margin-right: 10px; border: 2px solid #FFFFFF;">
                <i class="fas fa-check-circle" style="color: #FFFFFF; margin-right: 5px;"></i>
                <span style="color: #FFFFFF; font-weight: bold; text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);">VERDADEIRA</span>
            </div> ` :
            `<div style="display: inline-flex; align-items: center; background-color: var(--false-color); padding: 5px 10px; border-radius: 5px; margin-right: 10px; border: 2px solid #FFFFFF;">
                <i class="fas fa-times-circle" style="color: #FFFFFF; margin-right: 5px;"></i>
                <span style="color: #FFFFFF; font-weight: bold; text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);">FALSA</span>
            </div> `;

        const regraElement = document.getElementById('rule');
        regraElement.innerHTML = detetiveIcon + regra.texto;

        // Atualizar a cor da regra container para combinar com a pista atual
        const regraContainer = document.querySelector('.rule-container');
        if (regraContainer) {
            regraContainer.style.backgroundColor = corAtual;
            regraContainer.style.borderColor = "#FFFFFF";
            regraContainer.style.color = "#FFFFFF";

            // Garantir que o texto da regra seja branco para melhor contraste
            regraElement.style.color = "#FFFFFF";
            regraElement.style.textShadow = "2px 2px 0 rgba(0, 0, 0, 0.5)";

            // Garantir que o ícone também tenha boa visibilidade
            const iconElement = regraContainer.querySelector("i.fa-lightbulb");
            if (iconElement) {
                iconElement.style.color = "#FFFFFF";
            }
        }

        updateLoadingProgress(100, 'Sistema bancário ativo!');

        // Iniciar o timer
        startTimer();

        // Mostrar o tutorial automaticamente na primeira vez
        if (!tutorialShown) {
            setTimeout(() => {
                showTutorial();
            }, 1000);
        }
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
        rule.isTrue = Math.random() < 0.3; // 30% de chance de ser verdadeira e 70% de ser falsa
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
        // Se a regra é verdadeira, eliminamos números que NÃO se encaixam na descrição
        // Se a regra é falsa, eliminamos números que SE encaixam na descrição
        const numerosEliminados = regra.isTrue ?
            sobreviventes.filter(num => !regra.check(num)) :
            sobreviventes.filter(num => regra.check(num));

        // Verificar se o segredo seria eliminado
        // O segredo é eliminado se NÃO se encaixa na descrição (quando verdadeira) ou se SE encaixa (quando falsa)
        const segredoEliminado = regra.isTrue ?
            !regra.check(segredo) :
            regra.check(segredo);

        // Se o segredo seria eliminado, retornar null
        if (segredoEliminado) {
            return null;
        }

        // Se todos os números seriam eliminados, retornar null
        if (numerosEliminados.length === sobreviventes.length) {
            return null;
        }

        // Aplicar a regra
        // A lógica já está correta: eliminamos os números que foram identificados como "numerosEliminados"
        sobreviventes = sobreviventes.filter(num => !numerosEliminados.includes(num));

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
        // Reduzir ainda mais a chance de números de 3 algarismos
        // 90% de chance de gerar números de 1-2 algarismos (1-99)
        // 10% de chance de gerar números de 3 algarismos (100-999)
        let num;
        if (Math.random() < 0.9) {
            // Gerar número de 1-2 algarismos (1-99)
            num = Math.floor(Math.random() * 99) + 1;
        } else {
            // Gerar número de 3 algarismos (100-999)
            // Limitar a números menores para melhor visualização
            num = Math.floor(Math.random() * 400) + 100;
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
        // Se a regra é verdadeira, eliminamos números que NÃO se encaixam na descrição
        // Se a regra é falsa, eliminamos números que SE encaixam na descrição
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

  // Inicializar o array de dicas
  const dicas = [];

  // Primeira dica - sempre a mesma: resto da divisão por 7
  dicas.push(`O resto da divisão por 7 é ${segredo % 7}`);

  // Segunda dica - sempre aleatória entre as opções que diferenciam os dois números
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
      `O número secreto não é divisível por 3`,

    // Soma dos algarismos
    `A soma dos algarismos é ${sumDigits(segredo)}`,

    // Divisão por 2
    segredo % 2 === 0 ?
      `O número secreto é divisível por 2` :
      `O número secreto não é divisível por 2`,

    // Último dígito
    `O último dígito do número secreto é ${segredo % 10}`
  ];

  // Escolher uma dica aleatória que diferencie os dois números
  const dicaAleatoria = diferencas[Math.floor(Math.random() * diferencas.length)];
  dicas.push(dicaAleatoria);

  return dicas;
}

function generateBoard(){
    const board=document.getElementById('board');
    board.innerHTML='';

    // Calcular quantos números reais temos para distribuir igualmente
    const totalNumeros = currentTabuleiro.numeros.length;

    // Distribuir os números igualmente entre as colunas
    const numerosPerColuna = Math.ceil(totalNumeros / COLUNAS);

    for(let i=0;i<COLUNAS;i++){
        const col=document.createElement('div');
        col.classList.add('column');

        // Calcular quantos números devem ir nesta coluna
        const startIdx = i * numerosPerColuna;
        const endIdx = Math.min(startIdx + numerosPerColuna, totalNumeros);

        for(let j=startIdx; j<endIdx; j++){
            const btn=document.createElement('button');
            btn.textContent=currentTabuleiro.numeros[j].valor;
            btn.addEventListener('click',markNumber);

            // Ajustar o tamanho do botão com base no número de dígitos
            const numDigits = btn.textContent.length;
            if (numDigits > 2) {
                btn.style.fontSize = '1rem'; // Fonte ainda menor para números de 3 dígitos
                btn.style.lineHeight = '0.9'; // Reduzir espaçamento entre linhas
            } else if (numDigits == 2) {
                btn.style.fontSize = '1.1rem'; // Tamanho médio para números de 2 dígitos
            }

            col.appendChild(btn);
        }

        // Se esta coluna tiver menos números que as outras, adicionar espaços vazios
        // para manter o alinhamento
        const numerosFaltantes = numerosPerColuna - (endIdx - startIdx);
        for (let k=0; k<numerosFaltantes; k++) {
            const spacer = document.createElement('div');
            spacer.style.height = '80px'; // Mesma altura dos botões (atualizada para 80px)
            spacer.style.visibility = 'hidden'; // Invisível mas ocupa espaço
            col.appendChild(spacer);
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

    // Verificar se os cliques estão bloqueados
    if (isClickBlocked) {
        // Adicionar efeito visual para indicar que os cliques estão bloqueados
        btn.classList.add('blocked');
        setTimeout(() => btn.classList.remove('blocked'), 300);
        return;
    }

    // Verificar o tempo desde o último clique
    const currentTime = Date.now();
    if (currentTime - lastClickTime < clickCooldown) {
        // Clique muito rápido, incrementar contador
        clickCount++;

        // Se exceder o limite de cliques rápidos, bloquear temporariamente
        if (clickCount >= 3) { // Reduzido de 5 para 3
            isClickBlocked = true;

            // Aumentar duração do bloqueio baseado no número de tentativas erradas
            const currentBlockDuration = blockDuration + (wrongAttemptsInRow * 2000); // +2s por tentativa errada

            // Mostrar mensagem de aviso mais específica
            showModal('🛑 Pare e Pense!',
                `Você está clicando muito rápido! Isso parece tentativa aleatória.
                Analise a pista com cuidado antes de clicar.
                Bloqueio por ${Math.ceil(currentBlockDuration/1000)} segundos.`);

            // Desbloquear após o tempo calculado
            setTimeout(() => {
                isClickBlocked = false;
                clickCount = 0;
                showAlert("🔓 Cliques liberados. Lembre-se: qualidade > velocidade!", 3000);
            }, currentBlockDuration);

            return;
        }

        // Resetar o contador após 5 segundos sem cliques rápidos
        clearTimeout(clickCountResetTimeout);
        clickCountResetTimeout = setTimeout(() => {
            clickCount = 0;
        }, 5000);
    } else {
        // Clique com intervalo adequado, resetar contador
        clickCount = 0;
    }

    // Atualizar o tempo do último clique
    lastClickTime = currentTime;

    const numero = parseInt(btn.textContent);
    const regra = currentTabuleiro.regras[round];

    // Verificar se a regra é verdadeira ou falsa e aplicar a lógica correspondente
    // Se a regra é verdadeira, eliminamos números que NÃO se encaixam na descrição
    // Se a regra é falsa, eliminamos números que SE encaixam na descrição
    const shouldMark = regra.isTrue ? !regra.check(numero) : regra.check(numero);

    if(shouldMark){
        btn.classList.add('marked');
        // Adicionar a classe correspondente à pista atual
        btn.classList.add(`clue-${round}`);
        btn.classList.add('pulse');
        btn.disabled = true; // Não deixa clicar novamente
        setTimeout(()=>btn.classList.remove('pulse'),300);

        // Clique correto - resetar contador de tentativas erradas consecutivas
        wrongAttemptsInRow = 0;
    }else{
        // Incrementar contadores de erro
        errorCount++;
        wrongAttemptsInRow++;
        totalWrongAttempts++;

        btn.classList.add('shake');
        document.getElementById('alert').textContent="Número não atende a regra!";

        // Aplicar penalidades progressivas por tentativas incorretas consecutivas
        if (wrongAttemptsInRow >= maxWrongAttempts) {
            isClickBlocked = true;
            const penaltyDuration = 5000 + (wrongAttemptsInRow - maxWrongAttempts) * 3000; // 5s + 3s por tentativa extra

            showModal('🚫 Muitas Tentativas Incorretas!',
                `Você errou ${wrongAttemptsInRow} vezes seguidas!
                Isso sugere tentativas aleatórias.
                Bloqueio por ${Math.ceil(penaltyDuration/1000)} segundos.
                Use este tempo para analisar a pista com cuidado.`);

            setTimeout(() => {
                isClickBlocked = false;
                showAlert("🎯 Foque na lógica da pista antes de clicar!", 4000);
            }, penaltyDuration);

            return;
        }

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

        // Verificar o número de erros e mostrar mensagens apropriadas
        if (errorCount === 1) {
            // Após o primeiro erro, mostrar modal sobre a veracidade da pista atual
            setTimeout(() => {
                // Criar uma mensagem específica para a pista atual
                let mensagem = 'Preste atenção na veracidade desta pista!';
                if (regra.isTrue) {
                    mensagem += ' Esta pista é VERDADEIRA, então você deve marcar os números que NÃO se encaixam na descrição (pois o segredo se encaixa).';
                } else {
                    mensagem += ' Esta pista é FALSA, então você deve marcar os números que SE encaixam na descrição (pois o segredo não se encaixa).';
                }
                showModal('Atenção!', mensagem);
            }, 600);
        } else if (errorCount === 2) {
            // Após o segundo erro, dar uma dica específica relacionada à pista atual
            setTimeout(() => {
                // Gerar uma dica específica com base no tipo de regra atual
                let mensagemDica = 'Dica: ';

                // Analisar o texto da regra para determinar o tipo de dica a ser dada
                if (regra.texto.includes("múltiplo de 4")) {
                    mensagemDica += "Um número é múltiplo de 4 quando seus dois últimos dígitos formam um número divisível por 4.";
                }
                else if (regra.texto.includes("divisível por 5")) {
                    mensagemDica += "Um número é divisível por 5 quando termina em 0 ou 5.";
                }
                else if (regra.texto.includes("é par")) {
                    mensagemDica += "Números pares são aqueles que terminam em 0, 2, 4, 6 ou 8.";
                }
                else if (regra.texto.includes("múltiplo de 3")) {
                    mensagemDica += "Um número é múltiplo de 3 quando a soma de seus algarismos é divisível por 3.";
                }
                else if (regra.texto.includes("divisível por 9")) {
                    mensagemDica += "Um número é divisível por 9 quando a soma de seus algarismos é divisível por 9.";
                }
                else if (regra.texto.includes("resto da divisão")) {
                    mensagemDica += "Números que terminam em 2 ou 7 têm resto 2 quando divididos por 5.";
                }
                else if (regra.texto.includes("soma dos algarismos")) {
                    mensagemDica += "Para saber se a soma dos algarismos é ímpar, some todos os dígitos e veja se o resultado termina em 1, 3, 5, 7 ou 9.";
                }
                else {
                    // Dica genérica caso não identifique o tipo de regra
                    mensagemDica += "Analise cuidadosamente a regra e lembre-se de considerar se ela é verdadeira ou falsa.";
                }

                showModal('Dica!', mensagemDica);
            }, 600);
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
        // Se a regra é verdadeira, eliminamos números que NÃO se encaixam na descrição
        // Se a regra é falsa, eliminamos números que SE encaixam na descrição
        const shouldMark = regra.isTrue ? !regra.check(numero) : regra.check(numero);
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

    // Resetar os contadores de erros ao avançar para uma nova pista
    errorCount = 0;
    totalWrongAttempts = 0;
    // Não resetar wrongAttemptsInRow para manter penalidade entre pistas

    if (round < ROUNDS) {
        // Ainda temos pistas válidas
        const regraElement = document.getElementById('rule');
        if (regraElement && currentTabuleiro.regras[round]) {
            // Atualizar o texto da regra com o detetive indicando se é verdadeira ou falsa
            const regra = currentTabuleiro.regras[round];

            // Definir cores para cada pista com melhor contraste
            const coresPistas = [
                '#8A2BE2',  // Azul violeta (mais escuro que retro-purple)
                '#FF1493',  // Rosa profundo (mais escuro que retro-pink)
                '#00868B',  // Ciano escuro (mais escuro que retro-cyan)
                '#B8860B',  // Dourado escuro (mais escuro que retro-yellow)
                '#D2691E',  // Chocolate (mais escuro que retro-orange)
                '#228B22',  // Verde floresta (mais escuro que accent-color)
                '#B22222'   // Vermelho tijolo (mais escuro que primary-color)
            ];

            const corAtual = coresPistas[round % coresPistas.length];

            // Sempre usar texto branco para garantir legibilidade
            const detetiveIcon = regra.isTrue ?
                `<i class="fas fa-user-secret" style="color: #00FF00;"></i> <span style="color: #FFFFFF; font-weight: bold; text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);">VERDADEIRA:</span> ` :
                `<i class="fas fa-user-secret" style="color: #FF0000;"></i> <span style="color: #FFFFFF; font-weight: bold; text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);">FALSA:</span> `;

            regraElement.innerHTML = detetiveIcon + regra.texto;

            // Atualizar a cor da regra container para combinar com a pista atual
            const regraContainer = document.querySelector('.rule-container');
            if (regraContainer) {
                regraContainer.style.backgroundColor = corAtual;
                regraContainer.style.borderColor = "#FFFFFF";
                regraContainer.style.color = "#FFFFFF";

                // Garantir que o texto da regra seja branco para melhor contraste
                regraElement.style.color = "#FFFFFF";
                regraElement.style.textShadow = "2px 2px 0 rgba(0, 0, 0, 0.5)";

                // Garantir que o ícone também tenha boa visibilidade
                const iconElement = regraContainer.querySelector("i.fa-lightbulb");
                if (iconElement) {
                    iconElement.style.color = "#FFFFFF";
                }
            }
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

        // Resetar o contador de erros ao chegar na tela final
        errorCount = 0;
    }

    return true;
}

function nextRound() {
    // Verificar se os cliques estão bloqueados
    if (isClickBlocked) {
        document.getElementById('alert').textContent = "Aguarde o desbloqueio para avançar.";
        setTimeout(() => {
            document.getElementById('alert').textContent = "";
        }, 2000);
        return false;
    }

    // Verificar o tempo desde o último clique
    const currentTime = Date.now();
    if (currentTime - lastClickTime < clickCooldown) {
        // Clique muito rápido, incrementar contador
        clickCount++;

        // Se exceder o limite de cliques rápidos, bloquear temporariamente
        if (clickCount >= 5) {
            isClickBlocked = true;

            // Mostrar mensagem de aviso
            showModal('Calma!', 'Você está clicando muito rápido! Pense antes de avançar. Os cliques serão bloqueados por alguns segundos.');

            // Desbloquear após 3 segundos
            setTimeout(() => {
                isClickBlocked = false;
                clickCount = 0;
                document.getElementById('alert').textContent = "Cliques desbloqueados. Pense antes de avançar!";
                setTimeout(() => {
                    document.getElementById('alert').textContent = "";
                }, 2000);
            }, 3000);

            return false;
        }

        // Resetar o contador após 5 segundos sem cliques rápidos
        clearTimeout(clickCountResetTimeout);
        clickCountResetTimeout = setTimeout(() => {
            clickCount = 0;
        }, 5000);
    } else {
        // Clique com intervalo adequado, resetar contador
        clickCount = 0;
    }

    // Atualizar o tempo do último clique
    lastClickTime = currentTime;

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
  document.getElementById('rule').textContent = "Descubra o código de acesso!";
}

function finishGame(){
  // Verificar se os cliques estão bloqueados
  if (isClickBlocked) {
    document.getElementById('alert').textContent = "Aguarde o desbloqueio para tentar novamente.";
    setTimeout(() => {
      document.getElementById('alert').textContent = "";
    }, 2000);
    return;
  }

  // Verificar o tempo desde o último clique
  const currentTime = Date.now();
  if (currentTime - lastClickTime < clickCooldown) {
    // Clique muito rápido, incrementar contador
    clickCount++;

    // Se exceder o limite de cliques rápidos, bloquear temporariamente
    if (clickCount >= 5) {
      isClickBlocked = true;

      // Mostrar mensagem de aviso
      showModal('Calma!', 'Você está clicando muito rápido! Pense antes de tentar. Os cliques serão bloqueados por alguns segundos.');

      // Desbloquear após 3 segundos
      setTimeout(() => {
        isClickBlocked = false;
        clickCount = 0;
        document.getElementById('alert').textContent = "Cliques desbloqueados. Pense antes de tentar!";
        setTimeout(() => {
          document.getElementById('alert').textContent = "";
        }, 2000);
      }, 3000);

      return;
    }

    // Resetar o contador após 5 segundos sem cliques rápidos
    clearTimeout(clickCountResetTimeout);
    clickCountResetTimeout = setTimeout(() => {
      clickCount = 0;
    }, 5000);
  } else {
    // Clique com intervalo adequado, resetar contador
    clickCount = 0;
  }

  // Atualizar o tempo do último clique
  lastClickTime = currentTime;

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
    // Incrementar contadores de erro
    errorCount++;
    wrongAttemptsInRow++;

    sInp.classList.add('shake');
    document.getElementById('alert').textContent="Errado! Tente novamente.";

    // Aplicar penalidades por tentativas incorretas na fase final
    if (wrongAttemptsInRow >= 2) { // Mais rigoroso na fase final
        isClickBlocked = true;
        const penaltyDuration = 4000 + (wrongAttemptsInRow - 2) * 2000; // 4s + 2s por tentativa extra

        showModal('🔒 Tentativas Excessivas!',
            `Você errou ${wrongAttemptsInRow} vezes!
            Pare de chutar e analise as dicas finais com cuidado.
            Bloqueio por ${Math.ceil(penaltyDuration/1000)} segundos.`);

        setTimeout(() => {
            isClickBlocked = false;
            showAlert("💡 Use as dicas finais para deduzir o número!", 4000);
        }, penaltyDuration);

        return;
    }

    // Verificar o número de erros e mostrar mensagens apropriadas
    if (errorCount === 1) {
      // Após o primeiro erro, mostrar modal com dica
      setTimeout(() => {
        showModal('Atenção!', 'Preste atenção nas dicas finais! Elas contêm informações importantes para descobrir o segredo.');
      }, 600);
    } else if (errorCount === 2) {
      // Após o segundo erro, dar uma dica mais específica sobre o número secreto
      setTimeout(() => {
        let mensagemDica = 'Dica: ';

        // Escolher uma dica que não esteja já nas dicas finais
        const dicasExistentes = currentTabuleiro.dicasFinais.map(d => d.toLowerCase());

        // Possíveis dicas adicionais
        const possiveisDicas = [
          currentTabuleiro.segredo % 3 === 0 ?
            'O número secreto é divisível por 3.' :
            'O número secreto não é divisível por 3.',

          currentTabuleiro.segredo % 2 === 0 ?
            'O número secreto é par.' :
            'O número secreto é ímpar.',

          currentTabuleiro.segredo < 50 ?
            'O número secreto é menor que 50.' :
            'O número secreto é maior ou igual a 50.',

          currentTabuleiro.segredo.toString().length === 1 ?
            'O número secreto tem apenas um algarismo.' :
            `O número secreto tem ${currentTabuleiro.segredo.toString().length} algarismos.`,

          sumDigits(currentTabuleiro.segredo) % 2 === 0 ?
            'A soma dos algarismos do número secreto é par.' :
            'A soma dos algarismos do número secreto é ímpar.'
        ];

        // Encontrar uma dica que não esteja nas dicas finais
        let dicaEscolhida = null;
        for (const dica of possiveisDicas) {
          let jaExiste = false;
          for (const dicaExistente of dicasExistentes) {
            if (dicaExistente.includes(dica.toLowerCase())) {
              jaExiste = true;
              break;
            }
          }

          if (!jaExiste) {
            dicaEscolhida = dica;
            break;
          }
        }

        // Se todas as dicas já existirem, escolher uma aleatória
        if (!dicaEscolhida) {
          dicaEscolhida = possiveisDicas[Math.floor(Math.random() * possiveisDicas.length)];
        }

        mensagemDica += dicaEscolhida;
        showModal('Dica!', mensagemDica);
      }, 600);
    }

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
    // Se a regra é verdadeira, marcamos números que NÃO se encaixam na descrição
    // Se a regra é falsa, marcamos números que SE encaixam na descrição
    let numerosParaMarcar = [];
    if (regra.isTrue) {
      numerosParaMarcar = nums.filter(num => !regra.check(num));
    } else {
      numerosParaMarcar = nums.filter(num => regra.check(num));
    }

    // Se não há números para marcar com esta regra, o tabuleiro não é válido
    if (numerosParaMarcar.length === 0) {
      return false;
    }

    // Aplicar a regra para obter os números restantes para a próxima regra
    // Os números que sobrevivem são os que NÃO foram marcados
    nums = nums.filter(num => !numerosParaMarcar.includes(num));
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
    // Se a regra é verdadeira, marcamos números que NÃO se encaixam na descrição
    // Se a regra é falsa, marcamos números que SE encaixam na descrição
    if (regra.isTrue) {
      numerosParaMarcar = nums.filter(num => !regra.check(num));
    } else {
      numerosParaMarcar = nums.filter(num => regra.check(num));
    }

    // Se não há números para marcar com esta regra, o tabuleiro não é solucionável
    if (numerosParaMarcar.length === 0) {
      return false;
    }

    // Verificar se o segredo sobrevive após aplicar esta regra
    // O segredo deve sobreviver (não ser eliminado)
    if (regra.isTrue) {
      // Se a regra é verdadeira, o segredo sobrevive se SE ENCAIXA na descrição
      if (!regra.check(tabuleiro.segredo)) {
        return false;
      }
    } else {
      // Se a regra é falsa, o segredo sobrevive se NÃO SE ENCAIXA na descrição
      if (regra.check(tabuleiro.segredo)) {
        return false;
      }
    }

    // Filtrar os números que sobrevivem (removendo os que foram marcados)
    nums = nums.filter(num => !numerosParaMarcar.includes(num));

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

// Função para mostrar um modal com mensagem personalizada
function showModal(titulo, mensagem) {
  // Verificar se já existe um modal e removê-lo
  const modalExistente = document.getElementById('custom-modal');
  if (modalExistente) {
    modalExistente.remove();
  }

  // Criar o elemento do modal
  const modal = document.createElement('div');
  modal.id = 'custom-modal';
  modal.className = 'modal animate__animated animate__fadeIn';

  // Criar o conteúdo do modal
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Adicionar título
  const tituloElement = document.createElement('h2');
  tituloElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${titulo}`;
  modalContent.appendChild(tituloElement);

  // Adicionar mensagem
  const mensagemElement = document.createElement('p');
  mensagemElement.textContent = mensagem;
  modalContent.appendChild(mensagemElement);

  // Adicionar botão de fechar
  const botaoFechar = document.createElement('button');
  botaoFechar.className = 'btn confirm-btn';
  botaoFechar.innerHTML = '<i class="fas fa-check"></i> Entendi';
  botaoFechar.onclick = function() {
    modal.classList.remove('animate__fadeIn');
    modal.classList.add('animate__fadeOut');
    setTimeout(() => {
      modal.remove();
    }, 500);
  };
  modalContent.appendChild(botaoFechar);

  // Adicionar o conteúdo ao modal
  modal.appendChild(modalContent);

  // Adicionar o modal ao corpo do documento
  document.body.appendChild(modal);

  // Adicionar evento para fechar o modal ao clicar fora dele
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.classList.remove('animate__fadeIn');
      modal.classList.add('animate__fadeOut');
      setTimeout(() => {
        modal.remove();
      }, 500);
    }
  });
}

// Função para mostrar alertas temporários
function showAlert(message, duration = 3000) {
    const alertElement = document.getElementById('alert');
    alertElement.textContent = message;
    alertElement.style.opacity = '1';

    setTimeout(() => {
        alertElement.textContent = "";
        alertElement.style.opacity = '0';
    }, duration);
}

// Função para mostrar o tutorial
function showTutorial() {
  // Conteúdo do tutorial
  const tutorialContent = `
    <h2><i class="fas fa-graduation-cap"></i> Como Jogar</h2>

    <h3>Entendendo as Pistas</h3>
    <p>Cada pista pode ser VERDADEIRA ou FALSA, indicado pelo ícone colorido.</p>

    <div style="display: flex; align-items: center; margin: 15px 0; background-color: var(--true-color); padding: 10px; border-radius: 5px;">
      <i class="fas fa-check-circle" style="color: #FFFFFF; margin-right: 10px;"></i>
      <span style="color: #FFFFFF; font-weight: bold;">VERDADEIRA</span>
    </div>
    <p>Se a pista for VERDADEIRA, você deve eliminar os números que NÃO SE ENCAIXAM na descrição.</p>
    <p>Exemplo: Se a pista for "O número é par" e for VERDADEIRA, você deve marcar todos os números ímpares (1, 3, 5, etc.), pois o segredo é par.</p>

    <div style="display: flex; align-items: center; margin: 15px 0; background-color: var(--false-color); padding: 10px; border-radius: 5px;">
      <i class="fas fa-times-circle" style="color: #FFFFFF; margin-right: 10px;"></i>
      <span style="color: #FFFFFF; font-weight: bold;">FALSA</span>
    </div>
    <p>Se a pista for FALSA, você deve eliminar os números que SE ENCAIXAM na descrição.</p>
    <p>Exemplo: Se a pista for "O número é par" e for FALSA, você deve marcar todos os números pares (2, 4, 6, etc.), pois o segredo é ímpar.</p>

    <h3>Objetivo do Jogo</h3>
    <p>Após aplicar todas as 7 pistas, restarão apenas 2 números. Use as dicas finais para descobrir qual é o número secreto.</p>
  `;

  // Mostrar o modal com o conteúdo do tutorial
  showCustomModal(tutorialContent);

  // Marcar que o tutorial foi mostrado
  tutorialShown = true;

  // Esconder o botão de tutorial
  document.getElementById('show-tutorial-btn').style.display = 'none';
}

// Função para fechar o tutorial
function closeTutorial() {
  document.getElementById('tutorial-container').style.display = 'none';
}

// Função para mostrar um modal personalizado
function showCustomModal(content) {
  // Criar o modal
  const modal = document.createElement('div');
  modal.className = 'modal animate__animated animate__fadeIn';

  // Criar o conteúdo do modal
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.maxWidth = '600px';
  modalContent.style.maxHeight = '80vh';
  modalContent.style.overflow = 'auto';
  modalContent.innerHTML = content;

  // Adicionar botão de fechar
  const botaoFechar = document.createElement('button');
  botaoFechar.className = 'btn confirm-btn';
  botaoFechar.innerHTML = '<i class="fas fa-check"></i> Entendi';
  botaoFechar.onclick = function() {
    modal.classList.remove('animate__fadeIn');
    modal.classList.add('animate__fadeOut');
    setTimeout(() => {
      modal.remove();
    }, 500);
  };
  modalContent.appendChild(botaoFechar);

  // Adicionar o conteúdo ao modal
  modal.appendChild(modalContent);

  // Adicionar o modal ao corpo do documento
  document.body.appendChild(modal);

  // Adicionar evento para fechar o modal ao clicar fora dele
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.classList.remove('animate__fadeIn');
      modal.classList.add('animate__fadeOut');
      setTimeout(() => {
        modal.remove();
      }, 500);
    }
  });
}

// Função para alternar o modo de alto contraste
function toggleHighContrast() {
  highContrastMode = !highContrastMode;

  if (highContrastMode) {
    // Ativar modo de alto contraste
    document.body.classList.add('high-contrast');

    // Atualizar o texto do botão
    const toggleBtn = document.getElementById('toggle-contrast-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-universal-access"></i><span>Contraste Normal</span>';
      toggleBtn.style.backgroundColor = '#FFFFFF';
    }

    // Mostrar mensagem de confirmação
    const alert = document.getElementById('alert');
    if (alert) {
      alert.textContent = "Modo de alto contraste ativado";
      alert.classList.add('animate__fadeIn');
      setTimeout(() => {
        alert.classList.remove('animate__fadeIn');
        alert.textContent = "";
      }, 2000);
    }
  } else {
    // Desativar modo de alto contraste
    document.body.classList.remove('high-contrast');

    // Atualizar o texto do botão
    const toggleBtn = document.getElementById('toggle-contrast-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<i class="fas fa-universal-access"></i><span>Alto Contraste</span>';
      toggleBtn.style.backgroundColor = 'var(--retro-yellow)';
    }

    // Mostrar mensagem de confirmação
    const alert = document.getElementById('alert');
    if (alert) {
      alert.textContent = "Modo de contraste normal ativado";
      alert.classList.add('animate__fadeIn');
      setTimeout(() => {
        alert.classList.remove('animate__fadeIn');
        alert.textContent = "";
      }, 2000);
    }
  }
}