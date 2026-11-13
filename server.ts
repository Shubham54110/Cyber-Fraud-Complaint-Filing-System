import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface AnalyzeRequestBody {
  narrative?: string;
  lossAmountUsd?: number;
  institution?: string;
  channel?: string;
}

interface TriageAnalysisResult {
  category:
    | 'Wire & ACH Fraud'
    | 'Crypto & Wallet Drain'
    | 'Phishing & Account Takeover'
    | 'Payment App Scam'
    | 'Identity & Credit Fraud';
  urgency: 'Critical — Freeze Window' | 'Elevated' | 'Standard';
  precinctCode: string;
  recommendedAction: string;
  confidenceLabel: string;
  extractedIndicators: string[];
  source: 'gemini' | 'deterministic';
}

function runDeterministicClassifier(body: AnalyzeRequestBody): TriageAnalysisResult {
  const text = `${body.narrative ?? ''} ${body.institution ?? ''} ${body.channel ?? ''}`.toLowerCase();
  const loss = Number(body.lossAmountUsd) || 0;

  let category: TriageAnalysisResult['category'] = 'Phishing & Account Takeover';
  let precinctCode = 'PREC-04B';

  if (/crypto|wallet|seed|eth|btc|usdt|usdc|solana|coinbase|metamask|ledger|blockchain/.test(text)) {
    category = 'Crypto & Wallet Drain';
    precinctCode = 'PREC-07C';
  } else if (/wire|swift|ach|routing|iban|escrow|closing|treasury|invoice/.test(text)) {
    category = 'Wire & ACH Fraud';
    precinctCode = 'PREC-01A';
  } else if (/zelle|venmo|cashapp|cash app|paypal|apple pay|marketplace|p2p/.test(text)) {
    category = 'Payment App Scam';
    precinctCode = 'PREC-02E';
  } else if (/ssn|social security|credit line|loan|tax|sim swap|identity|passport/.test(text)) {
    category = 'Identity & Credit Fraud';
    precinctCode = 'PREC-03D';
  }

  let urgency: TriageAnalysisResult['urgency'] = 'Standard';
  if (
    loss >= 10000 ||
    /today|hour|minute|just happened|wire|pending|freeze|drain|unauthorized transfer/.test(text)
  ) {
    urgency = 'Critical — Freeze Window';
  } else if (loss >= 1500 || /phishing|takeover|locked out|sim/.test(text)) {
    urgency = 'Elevated';
  }

  const indicators: string[] = [];
  if (loss > 0) indicators.push(`Reported Loss: $${loss.toLocaleString('en-US')}`);
  if (body.institution?.trim()) indicators.push(`Institution: ${body.institution.trim()}`);
  if (/sms|text|link|email|login/.test(text)) indicators.push('Credential / Link Phishing Vector');
  if (/wire|ach|swift/.test(text)) indicators.push('Interbank Clearing Recall Eligible');
  if (/wallet|seed|tx|hash|crypto/.test(text)) indicators.push('On-Chain Traceable Asset Flow');
  if (/phone|impersonat|caller|support/.test(text)) indicators.push('Social Engineering Impersonation');
  if (indicators.length === 0) indicators.push('Initial Citizen Narrative Verified');

  const recommendedAction =
    urgency === 'Critical — Freeze Window'
      ? 'Dispatch immediate bank/clearinghouse recall notice and lock compromised credentials.'
      : urgency === 'Elevated'
        ? 'Preserve transaction logs, rotate authentication factors, and route to regional desk.'
        : 'Log evidentiary receipts and queue for standard investigator verification.';

  return {
    category,
    urgency,
    precinctCode,
    recommendedAction,
    confidenceLabel: 'Rule-Verified Routing',
    extractedIndicators: indicators.slice(0, 4),
    source: 'deterministic',
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/triage/analyze', async (req, res) => {
    const body = (req.body ?? {}) as AnalyzeRequestBody;
    const narrative = String(body.narrative ?? '').trim();
    const lossAmountUsd = Number(body.lossAmountUsd) || 0;
    const institution = String(body.institution ?? '').trim();
    const channel = String(body.channel ?? '').trim();

    if (!narrative && !institution) {
      res.status(400).json({ error: 'Incident narrative or institution name is required.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json(runDeterministicClassifier(body));
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = [
        'Classify this cyber/financial fraud incident and assign the best regional police cybercrime precinct.',
        `Channel: ${channel || 'Unspecified'}`,
        `Institution/Platform: ${institution || 'Unspecified'}`,
        `Monetary Loss (USD): ${lossAmountUsd}`,
        `Narrative: ${narrative}`,
        '',
        'Available precinct codes:',
        '- PREC-01A: Wire & Clearinghouse Rapid Freeze Taskforce (wire transfers, BEC, ACH, escrow)',
        '- PREC-07C: Digital Asset & Blockchain Forensics (crypto wallets, exchanges, seed compromises)',
        '- PREC-04B: Metro Cyber Financial Unit (phishing, credential takeover, banking portal intrusion)',
        '- PREC-02E: Municipal Payment Fraud Bureau (P2P apps like Zelle/Venmo/CashApp, card/marketplace scams)',
        '- PREC-03D: Consumer Identity & Account Takeover Desk (SSN theft, SIM swaps, fraudulent credit lines)',
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a precise law-enforcement cybercrime intake classifier. Return concise, factual JSON strictly matching the schema. Use Critical — Freeze Window when loss >= $5000 or funds moved within 48 hours via wire/ACH/crypto/P2P.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                enum: [
                  'Wire & ACH Fraud',
                  'Crypto & Wallet Drain',
                  'Phishing & Account Takeover',
                  'Payment App Scam',
                  'Identity & Credit Fraud',
                ],
              },
              urgency: {
                type: Type.STRING,
                enum: ['Critical — Freeze Window', 'Elevated', 'Standard'],
              },
              precinctCode: {
                type: Type.STRING,
                enum: ['PREC-01A', 'PREC-07C', 'PREC-04B', 'PREC-02E', 'PREC-03D'],
              },
              recommendedAction: {
                type: Type.STRING,
                description: 'One concise imperative sentence (max 18 words) for immediate containment.',
              },
              extractedIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 short factual risk indicators extracted from the report.',
              },
            },
            required: ['category', 'urgency', 'precinctCode', 'recommendedAction', 'extractedIndicators'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim()) as Partial<TriageAnalysisResult>;
      const fallback = runDeterministicClassifier(body);

      res.json({
        category: parsed.category ?? fallback.category,
        urgency: parsed.urgency ?? fallback.urgency,
        precinctCode: parsed.precinctCode ?? fallback.precinctCode,
        recommendedAction: parsed.recommendedAction ?? fallback.recommendedAction,
        confidenceLabel: 'AI-Assisted Routing',
        extractedIndicators:
          Array.isArray(parsed.extractedIndicators) && parsed.extractedIndicators.length > 0
            ? parsed.extractedIndicators.slice(0, 4)
            : fallback.extractedIndicators,
        source: 'gemini',
      } satisfies TriageAnalysisResult);
    } catch (error) {
      console.error('Triage analysis fallback triggered:', error);
      res.json(runDeterministicClassifier(body));
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sentinel Civic server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer();
