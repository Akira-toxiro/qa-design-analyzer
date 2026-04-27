# QA Design — Score Analyzer

Sistema de avaliação automatizada de artes de design com IA.

## Pré-requisitos

- Node.js 18+ instalado → https://nodejs.org
- Chave da API da Anthropic → https://console.anthropic.com

## Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar a chave da API (escolha uma opção)

# Opção A — definir na hora de rodar (recomendado)
ANTHROPIC_API_KEY=sk-ant-... npm start

# Opção B — criar arquivo .env (instale dotenv: npm install dotenv)
# Adicione ao topo do server.js: require('dotenv').config()
# Crie o arquivo .env com: ANTHROPIC_API_KEY=sk-ant-...
```

## Rodando

```bash
ANTHROPIC_API_KEY=sk-ant-SUA_CHAVE_AQUI npm start
```

Abra o navegador em: **http://localhost:3000**

## Como usar

1. Acesse http://localhost:3000
2. Arraste ou clique para selecionar a arte (PNG, JPG, WEBP)
3. Clique em "Analisar com IA"
4. Aguarde ~10 segundos para o resultado completo

## Critérios avaliados

- **Texto e Tipografia** (12 pts): ortografia, hierarquia, legibilidade, estilos
- **Layout e Espaçamento** (8 pts): alinhamento, grid, margens, proporção  
- **Hierarquia e Leitura** (8 pts): ponto focal, CTA, escaneabilidade
- **Cores e Contraste** (6 pts): contraste 4.5:1, paleta, fundo
- **Imagens e Elementos** (8 pts): resolução, recorte, consistência
- **Consistência de Marca** (6 pts): logo, padrões, unidade visual
- **Técnico** (4 pts): dimensões, nitidez, exportação

**Total: 52 pontos → convertido para 0-100%**

## Escala de aprovação

| Score | Status     | Ação                          |
|-------|------------|-------------------------------|
| 90–100| Excelente  | Pode subir para validação     |
| 75–89 | Bom        | Ajustes finos opcionais       |
| 60–74 | Médio      | Revisar pontos críticos       |
| 0–59  | Crítico    | Refazer com base nos critérios|
