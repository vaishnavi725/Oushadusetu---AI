import type { Plugin } from 'vite';
import { handleAiApiRequest } from './aiBackend';

export function viteAiPlugin(): Plugin {
  return {
    name: 'vite-ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/ai/')) {
          try {
            await handleAiApiRequest(req, res);
          } catch (err) {
            console.error('AI API Server error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/ai/')) {
          try {
            await handleAiApiRequest(req, res);
          } catch (err) {
            console.error('AI API Preview Server error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
          return;
        }
        next();
      });
    },
  };
}
