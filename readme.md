# Qual é o Segredo? - Jogo de Lógica

Um jogo de lógica onde você precisa descobrir um número secreto usando pistas.

## Configuração do Banco de Dados

O jogo utiliza o Supabase como banco de dados. As tabelas necessárias já estão criadas:

- `clues`: Armazena as dicas do jogo
- `clue_stats`: Armazena estatísticas de erros por dica
- `game_stats`: Armazena os tempos de conclusão do jogo

## Configuração da Conexão

1. O jogo usa um arquivo `.env` na raiz do projeto para armazenar as credenciais do Supabase de forma segura:

```
SUPABASE_URL=https://odhfonzlihednytyqnnh.supabase.co
SUPABASE_KEY=sua-chave-anon-do-supabase
```

2. O arquivo `.env` está incluído no `.gitignore` para garantir que suas credenciais não sejam enviadas para o repositório.

3. Se o arquivo `.env` não for encontrado ou não contiver as credenciais necessárias, o jogo usará valores padrão para desenvolvimento.

## Funcionalidades

- **Pistas Verdadeiras ou Falsas**: Um detetive indica se a pista é verdadeira ou falsa. Se for verdadeira, elimine números que não se encaixam na descrição. Se for falsa, elimine números que se encaixam na descrição.
- **Estatísticas de Erros**: O jogo registra em quais pistas os jogadores mais erram.
- **Tempo de Conclusão**: O tempo que cada jogador leva para finalizar o jogo é registrado.

## Como Jogar

1. Analise as pistas sobre as características do número secreto.
2. Se a pista for verdadeira, elimine números que não se encaixam na descrição.
3. Se a pista for falsa, elimine números que se encaixam na descrição.
4. Continue até restarem apenas 2 números.
5. Use as dicas finais para descobrir qual é o número secreto.

## Estrutura do Banco de Dados

### Tabela `clues`
- `id`: Identificador único da dica
- `clue_number`: Número da dica
- `description`: Texto da dica

### Tabela `clue_stats`
- `clue_id`: Referência à dica
- `total_errors`: Contador de erros

### Tabela `game_stats`
- `id`: Identificador único da estatística
- `total_time_seconds`: Tempo de conclusão em segundos

**Nota:** Para armazenar o nome do jogador, é necessário adicionar a coluna `player_name` à tabela `game_stats`. Você pode fazer isso executando o seguinte comando SQL no Editor SQL do Supabase:

```sql
ALTER TABLE game_stats
ADD COLUMN player_name TEXT DEFAULT 'Anônimo';
```

## Deploy na Vercel

### Pré-requisitos
- Conta no GitHub
- Conta na Vercel

### Passos para Deploy

1. **Faça push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Preparar para deploy na Vercel"
   git push origin main
   ```

2. **Acesse a Vercel:**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com sua conta GitHub

3. **Importe o projeto:**
   - Clique em "New Project"
   - Selecione seu repositório "qual-e-o-segredo"
   - Clique em "Import"

4. **Configuração automática:**
   - A Vercel detectará automaticamente que é um site estático
   - O arquivo `vercel.json` já está configurado com:
     - `outputDirectory: "public"` - define a pasta public como diretório de saída
     - Rewrite para servir o `index.html` como página inicial
   - Clique em "Deploy"

5. **Configurar variáveis de ambiente (importante para o Supabase):**
   - Na página do projeto na Vercel, vá em "Settings" > "Environment Variables"
   - Adicione as seguintes variáveis:
     - `SUPABASE_URL`: sua URL do Supabase
     - `SUPABASE_KEY`: sua chave anônima do Supabase

6. **Acesso:**
   - Após o deploy, você receberá uma URL como: `https://qual-e-o-segredo.vercel.app`
   - O jogo estará acessível diretamente nesta URL

### Configurações Incluídas

- **vercel.json**: Configurado com `outputDirectory: "public"` e rewrite para servir `index.html` como página inicial
- **package.json**: Metadados do projeto
- **public/**: Diretório de saída contendo todos os arquivos do site (HTML, CSS, JS, imagens)
- **Cache headers**: Otimização de performance para assets estáticos

### Atualizações Futuras

Para atualizar o jogo:
1. Faça suas alterações no código
2. Commit e push para o GitHub
3. A Vercel fará o deploy automático das mudanças

### Tecnologias Utilizadas

- HTML5
- CSS3 (com animações)
- JavaScript (ES6+)
- Font Awesome (ícones)
- Google Fonts
- Animate.css
- Supabase (banco de dados)