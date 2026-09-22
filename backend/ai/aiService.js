import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { resolveModels } from './provider.js';

export class AIServiceError extends Error {
  constructor(message, cause) { super(message); this.name = 'AIServiceError'; this.cause = cause; }
}

function getModels(task = 'fast') {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AIServiceError('The AI service is not configured yet.');
  const google = createGoogleGenerativeAI({ apiKey: key });
  return resolveModels(task).map((id) => google(id));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry(work, candidates, label, retries = 2) {
  let lastError;
  for (const model of candidates) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try { return await work(model); }
      catch (error) { lastError = error; if (attempt < retries) await sleep(400 * 2 ** attempt); }
    }
  }
  console.error(`[fresherai] ${label} failed`, lastError);
  throw new AIServiceError('The AI service is temporarily unavailable. Please try again.', lastError);
}

export async function generateStructured({ schema, prompt, system, task = 'fast', temperature = 0.4 }) {
  return withRetry(async (model) => {
    const { object } = await generateObject({ model, schema, ...(system ? { system } : {}), prompt, temperature });
    return object;
  }, getModels(task), 'structured generation');
}

export async function generateResponse({ prompt, system, task = 'fast', temperature = 0.6 }) {
  return withRetry(async (model) => {
    const { text } = await generateText({ model, ...(system ? { system } : {}), prompt, temperature });
    return text;
  }, getModels(task), 'text generation');
}
