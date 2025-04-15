// Configuração do Supabase
// Valores fixos para desenvolvimento
const SUPABASE_URL = 'https://odhfonzlihednytyqnnh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kaGZvbnpsaWhlZG55dHlxbm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzA2NDMsImV4cCI6MjA2MDI0NjY0M30._-SmFjR_V8_eSnOkihXyv38gL6qfRrWO5CsjX22dgSc'
// Inicializar o cliente Supabase
let supabaseClient = null;

// Função para inicializar o Supabase
function initSupabase() {
  if (!supabaseClient) {
    console.log('Inicializando cliente Supabase com valores fixos');
    // Verificar se a biblioteca do Supabase está disponível
    if (typeof supabase === 'undefined') {
      console.error('Biblioteca do Supabase não encontrada. Verifique se o script foi carregado corretamente.');
      alert('Erro ao carregar a biblioteca do Supabase. O jogo continuará funcionando, mas não será possível salvar dados.');
      return null;
    }

    try {
      // Criar o cliente Supabase
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('Cliente Supabase inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar cliente Supabase:', error);
      return null;
    }
  }
  return supabaseClient;
}

// Função para atualizar o campo is_true no banco de dados
async function updateClueIsTrueStatus(clueId, isTrue) {
  try {
    const client = initSupabase();

    // Verificar se o cliente foi inicializado corretamente
    if (!client) {
      console.error('Cliente Supabase não inicializado. Não será possível atualizar status da dica.');
      return false;
    }

    // Atualizar o campo is_true na tabela clues
    const { error } = await client
      .from('clues')
      .update({ is_true: isTrue })
      .eq('id', clueId);

    if (error) {
      console.error(`Erro ao atualizar status da dica ${clueId}:`, error);
      return false;
    }

    console.log(`Status da dica ${clueId} atualizado com sucesso para ${isTrue ? 'verdadeira' : 'falsa'}`);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar status da dica ${clueId}:`, error);
    return false;
  }
}

// Função para carregar as pistas do banco de dados
async function loadRulesFromDatabase() {
  try {
    console.log('Iniciando carregamento de pistas do banco de dados...');
    const client = initSupabase();

    // Verificar se o cliente foi inicializado corretamente
    if (!client) {
      console.error('Cliente Supabase não inicializado. Não será possível carregar pistas do banco de dados.');
      return null;
    }

    const { data, error } = await client
      .from('clues')
      .select('*')
      .order('clue_number');

    if (error) {
      console.error('Erro ao carregar pistas:', error);
      console.error('Código de erro:', error.code);
      console.error('Mensagem de erro:', error.message);
      console.error('Detalhes:', error.details);

      // Se for erro de autenticação (401), mostrar mensagem mais clara
      if (error.code === '401') {
        console.error('Erro de autenticação: Verifique se a URL e a chave do Supabase estão corretas');
        alert('Erro de conexão com o banco de dados. Usando regras padrão.');
      }

      return null;
    }

    console.log('Dados brutos recebidos do banco:', data);

    // Transformar os dados do banco para o formato esperado pelo jogo
    const transformedRules = data.map(clue => {
      // Extrair a função de verificação da descrição
      // Assumindo que a descrição é algo como "Elimine números pares"
      let checkFunction;
      let ruleType = 'desconhecida';

      // Definir a função de verificação com base na descrição
      if (clue.description.includes('pares')) {
        checkFunction = n => n % 2 === 0;
        ruleType = 'pares';
      } else if (clue.description.includes('resto 3 ao dividir por 7')) {
        checkFunction = n => n % 7 === 3;
        ruleType = 'resto 3 por 7';
      } else if (clue.description.includes('soma dos algarismos')) {
        checkFunction = n => sumDigits(n) < 10;
        ruleType = 'soma algarismos < 10';
      } else if (clue.description.includes('maiores que 500')) {
        checkFunction = n => n > 500;
        ruleType = 'maiores que 500';
      } else if (clue.description.includes('menores que 100')) {
        checkFunction = n => n < 100;
        ruleType = 'menores que 100';
      } else if (clue.description.includes('múltiplos de 5')) {
        checkFunction = n => n % 5 === 0;
        ruleType = 'múltiplos de 5';
      } else if (clue.description.includes('terminados em 9')) {
        checkFunction = n => n % 10 === 9;
        ruleType = 'terminados em 9';
      } else {
        // Função padrão caso não reconheça a descrição
        checkFunction = () => false;
        ruleType = 'não reconhecida';
      }

      // Definir se a dica é verdadeira ou falsa (50% de chance)
      const isTrue = Math.random() < 0.5;

      // Atualizar o campo is_true no banco de dados
      updateClueIsTrueStatus(clue.id, isTrue).catch(error => {
        console.error(`Erro ao atualizar status da dica ${clue.id}:`, error);
      });

      console.log(`Processando dica ${clue.id}: "${clue.description}"`);
      console.log(`  Tipo identificado: ${ruleType}`);
      console.log(`  Verdadeira: ${isTrue}`);

      return {
        id: clue.id,
        texto: clue.description,
        check: checkFunction,
        isTrue: isTrue
      };
    });

    console.log(`Total de ${transformedRules.length} dicas processadas com sucesso.`);
    return transformedRules;
  } catch (error) {
    console.error('Erro ao carregar pistas:', error);
    return null;
  }
}

// Função para registrar erro em uma pista
async function registerRuleError(clueId) {
  try {
    const client = initSupabase();

    // Verificar se o cliente foi inicializado corretamente
    if (!client) {
      console.error('Cliente Supabase não inicializado. Não será possível registrar erro na pista.');
      return;
    }

    // Primeiro verificamos se já existe um registro para esta dica
    const { data, error: selectError } = await client
      .from('clue_stats')
      .select('*')
      .eq('clue_id', clueId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 é o código para 'não encontrado'
      console.error('Erro ao buscar estatísticas da dica:', selectError);
      return;
    }

    if (data) {
      // Se já existe, incrementamos o contador
      const { error: updateError } = await client
        .from('clue_stats')
        .update({ total_errors: data.total_errors + 1 })
        .eq('clue_id', clueId);

      if (updateError) {
        console.error('Erro ao atualizar estatísticas da dica:', updateError);
      } else {
        console.log(`Erro registrado para a dica ${clueId}. Total: ${data.total_errors + 1}`);
      }
    } else {
      // Se não existe, criamos um novo registro
      const { error: insertError } = await client
        .from('clue_stats')
        .insert({ clue_id: clueId, total_errors: 1 });

      if (insertError) {
        console.error('Erro ao inserir estatísticas da dica:', insertError);
      } else {
        console.log(`Primeiro erro registrado para a dica ${clueId}`);
      }
    }
  } catch (error) {
    console.error('Erro ao registrar erro na dica:', error);
  }
}

// Função para registrar o tempo de conclusão do jogo
async function registerGameCompletion(timeInSeconds, playerName) {
  try {
    const client = initSupabase();

    // Verificar se o cliente foi inicializado corretamente
    if (!client) {
      console.error('Cliente Supabase não inicializado. Não será possível registrar tempo de jogo.');
      return;
    }

    // Criar o objeto de dados com o tempo
    const gameData = {
      total_time_seconds: timeInSeconds
    };

    // Armazenar o nome do jogador no localStorage para uso futuro
    if (playerName) {
      localStorage.setItem('playerName', playerName);
      // Tentar adicionar o nome do jogador (se a coluna existir, funcionará)
      try {
        gameData.player_name = playerName || 'Anônimo';
      } catch (e) {
        console.log('Coluna player_name pode não existir ainda:', e);
      }
    }

    const { error } = await client
      .from('game_stats')
      .insert(gameData);

    if (error) {
      console.error('Erro ao registrar tempo de jogo:', error);
    } else {
      console.log(`Tempo de jogo registrado com sucesso: ${timeInSeconds} segundos`);
      if (playerName) {
        console.log(`Jogador: ${playerName}`);
      }
    }
  } catch (error) {
    console.error('Erro ao registrar tempo de jogo:', error);
  }
}
