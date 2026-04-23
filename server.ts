import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Allow cross-origin requests
  app.use(cors({ origin: true, credentials: true }));

  // Proxy Endpoint
  app.use('/proxy', (req, res, next) => {
    const targetUrl = req.query.url as string;
    
    if (!targetUrl) {
      res.status(400).send('Missing "url" query parameter.');
      return;
    }

    try {
      new URL(targetUrl); // Validate URL
    } catch {
      res.status(400).send('Invalid URL provided.');
      return;
    }

    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      ws: true,
      cookieDomainRewrite: "",
      pathRewrite: () => '', // Send the request directly to the target URL
      on: {
        proxyRes: (proxyRes) => {
          // Remove headers that prevent iframe embedding
          delete proxyRes.headers['x-frame-options'];
          delete proxyRes.headers['content-security-policy'];
          // Make sure cookies can be accessed if needed
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        }
      }
    });

    proxy(req, res, next);
  });

  // Vite integration pattern
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
