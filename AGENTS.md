# THOR LOTERIAS — base aprovada V190

Em 11/10/2026, o usuário aprovou a rapidez da V190 e pediu para preservar sua API e seu fluxo de atualização nas próximas alterações.

## API e resultados

- Usar como fonte oficial principal a API do portal da CAIXA: https://servicebus3.caixa.gov.br/portaldeloterias/api/.
- Rotas por modalidade: megasena, lotofacil, quina, diadesorte, lotomania, supersete, timemania e duplasena. Consultas históricas usam /{modalidade}/{concurso}.
- Preservar servicebus2 como contingência e a base resultados-atualizados.json compartilhada entre as abas.
- Preservar a verificação do próximo concurso por número quando a rota de último resultado estiver atrasada.
- Validar concurso, quantidade e intervalo das dezenas antes de aceitar resultados. Nunca substituir um concurso mais novo por um mais antigo.
- Preservar a atualização automática em segundo plano e o fluxo de histórico. Um erro de uma modalidade não deve impedir as outras.
- Registrar a origem real quando houver resultado conferido em fontes complementares; não atribuir esse resultado à API oficial até a confirmação.
- Antes de trocar o endereço principal, conferir a configuração do próprio portal: https://loterias.caixa.gov.br/Style%20Library/json/params.txt.

## Desempenho e interface

- Preservar a abertura rápida da V190: mostrar os dados salvos imediatamente e consultar novos resultados em segundo plano.
- Preservar cache do aplicativo instalado, renovação em segundo plano e deduplicação das consultas. Não voltar a bloquear a abertura aguardando todas as APIs.
- Manter o visual da Home conforme a preferência do usuário.
- Preservar concursos históricos escolhidos manualmente; a atualização do último resultado não deve mudar a navegação do usuário.
- Nas próximas alterações de código, informar a versão ao usuário e atualizar a versão no rodapé.
- A V190 é a base aprovada para API e desempenho; estas instruções complementam mudanças futuras autorizadas pelo usuário.
