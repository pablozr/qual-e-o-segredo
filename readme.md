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