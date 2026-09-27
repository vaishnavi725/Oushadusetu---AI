import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleAiApiRequest } from '../../src/server/aiBackend.js';

/** Let handleAiApiRequest read the raw request body (same as Vite dev middleware). */
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  await handleAiApiRequest(req, res);
}
