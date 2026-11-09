import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini client on server if key exists
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Results Decoder AI explanation endpoint
app.post('/api/decoder/explain', async (req: Request, res: Response) => {
  try {
    const { productName, category, actives, day, consistency, status, checkInHistory, timeline } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No Gemini API key configured on server. Using clinical template.',
      });
    }

    const prompt = `You are an editorial clinical wellness coach for Be Bodywise results system.
Explain the status of this product for the user in a warm, honest, calm, slightly editorial tone.
Product Name: ${productName}
Category: ${category}
Key Actives: ${Array.isArray(actives) ? actives.join(', ') : actives}
Current Day: Day ${day} of 90
Consistency Rate: ${consistency}%
Current Evaluated Status: ${status}
Product Timeline: Adjustment phase ends Day ${timeline?.adjustmentDays || 7}, First visible changes around Day ${timeline?.firstChangeDay || 21}, Full result benchmark around Day ${timeline?.fullResultDay || 60}.
Recent Check-in History: ${JSON.stringify(checkInHistory || [])}

Rules:
1. Write EXACTLY two short paragraphs (approx 85-95 words total).
2. The first paragraph explains why their current day and status is normal, and specifically how the key active(s) work at the cellular/scalp/skin level.
3. The second paragraph gives practical guidance on what to do this week (e.g. taking a baseline photo, maintaining frequency, checking contact time) and reassurance.
4. Never give a medical diagnosis or promise overnight miracles.
5. Do not use generic AI buzzwords or bullet lists. Plain text paragraphs only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You write warm, honest, editorial wellness guidance for Be Bodywise. Two short paragraphs only.',
      },
    });

    const explanation = response.text?.trim() || '';
    if (!explanation) {
      return res.status(200).json({ fallback: true });
    }

    return res.status(200).json({
      fallback: false,
      explanation,
    });
  } catch (error: any) {
    console.error('Error generating decoder explanation:', error);
    return res.status(200).json({
      fallback: true,
      error: error?.message || 'Gemini generation error',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // In dev mode, use Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In prod, serve static dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Be Bodywise Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
