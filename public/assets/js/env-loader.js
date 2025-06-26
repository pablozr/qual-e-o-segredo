// Função para carregar variáveis de ambiente do arquivo .env
async function loadEnvVariables() {
  try {
    const response = await fetch('/.env');
    if (!response.ok) {
      console.error('Não foi possível carregar o arquivo .env');
      return {};
    }
    
    const text = await response.text();
    const env = {};
    
    // Processar cada linha do arquivo .env
    text.split('\n').forEach(line => {
      // Ignorar linhas vazias ou comentários
      if (!line || line.startsWith('#')) return;
      
      // Dividir a linha em chave e valor
      const [key, ...valueParts] = line.split('=');
      if (!key || !valueParts.length) return;
      
      // Juntar o valor (caso tenha '=' no valor)
      const value = valueParts.join('=').trim();
      
      // Remover aspas se existirem
      const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
      
      // Adicionar ao objeto env
      env[key.trim()] = cleanValue;
    });
    
    return env;
  } catch (error) {
    console.error('Erro ao carregar variáveis de ambiente:', error);
    return {};
  }
}

// Exportar a função
window.loadEnvVariables = loadEnvVariables;
