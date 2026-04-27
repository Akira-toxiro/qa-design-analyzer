const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `Você é um especialista em QA de design com anos de experiência avaliando peças visuais para agências e times de design.

Seu trabalho é analisar artes de design e atribuir notas rigorosas baseadas nos critérios abaixo.

ESCALA DE NOTAS:
- 0 = erro claro (não atende ao mínimo exigido)
- 1 = aceitável com ajuste necessário
- 2 = correto e bem executado

PADRÕES TÉCNICOS DO TIME:
- Tamanho mínimo título em redes sociais: 50px bold
- Tamanho mínimo corpo em redes sociais: 28-35px regular
- Contraste mínimo: 4.5:1 (WCAG AA)
- Grid base: 8pt/px
- Preto puro (#000000) deve ser evitado no digital — usar tons escuros (#121212, #2B2B2B, #333333)
- Branco ou off-white (#FAFAFA, #F5F7FA) para fundos claros
- Hierarquia clara entre título, subtítulo e corpo

REGRAS DE CORTE (marcam automaticamente como reprovado):
- Erro de português (ortografia/gramática)
- Problema de legibilidade (tamanho/contraste/entrelinha)
- CTA ausente ou confuso
- Desalinhamento evidente ou quebra de grid
- Imagem com baixa qualidade (pixelização, recorte inadequado)

Responda APENAS com JSON válido, sem markdown ou texto adicional.

Formato exato:
{
  "scores": {
    "tipografia": {
      "ortografia": 0,
      "espacamento_pontuacao": 0,
      "hierarquia_tipografica": 0,
      "legibilidade": 0,
      "quebras_linha": 0,
      "consistencia_estilos": 0
    },
    "grid": {
      "alinhamento": 0,
      "espacamento_consistente": 0,
      "margens": 0,
      "proporcao": 0
    },
    "hierarquia": {
      "ponto_focal": 0,
      "ordem_leitura": 0,
      "cta": 0,
      "escaneabilidade": 0
    },
    "cores": {
      "contraste": 0,
      "uso_cores": 0,
      "fundo": 0
    },
    "imagens": {
      "qualidade_imagem": 0,
      "consistencia_visual": 0,
      "recorte": 0,
      "icones": 0
    },
    "marca": {
      "uso_marca": 0,
      "unidade_visual": 0,
      "padroes": 0
    },
    "tecnico": {
      "dimensoes": 0,
      "nitidez": 0
    }
  },
  "cut_rules_triggered": [],
  "feedback": [
    { "block": "nome do bloco", "level": "critical|warning|ok", "text": "feedback específico e acionável" }
  ],
  "summary": "Resumo executivo em 1-2 frases do estado geral da peça"
}

cut_rules_triggered deve conter apenas os itens detectados. [] se nenhum.
feedback: máximo 6 itens, críticos primeiro.
Seja específico e acionável no feedback.`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64, imageMime } = req.body;
    if (!imageBase64 || !imageMime) {
      return res.status(400).json({ error: 'Imagem obrigatória' });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: imageMime, data: imageBase64 } },
          { type: 'text', text: 'Analise essa arte de design e retorne o JSON de avaliação conforme instruído. Seja criterioso mas justo.' }
        ]
      }]
    });

    const rawText = message.content[0].text.trim();
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    console.error('Erro na análise:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ QA Design rodando em: http://localhost:${PORT}`);
});
