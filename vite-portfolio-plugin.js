import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_JSON = path.join(__dirname, 'src', 'data', 'portfolioData.json');
const DATA_JS = path.join(__dirname, 'src', 'data', 'portfolioData.js');
const UPLOADS_DIR_PUBLIC = path.join(__dirname, 'public', 'assets', 'uploads');
const UPLOADS_DIR_DIST = path.join(__dirname, 'dist', 'assets', 'uploads');

// Ensure upload directories exist
for (const dir of [UPLOADS_DIR_PUBLIC, UPLOADS_DIR_DIST]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // limit payload to 500MB
      if (body.length > 500 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

export function portfolioApiPlugin() {
  const handler = async (req, res, next) => {
    const url = req.url.split('?')[0];

    // Enable CORS preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end();
      return;
    }

    // GET /api/portfolio
    if (url === '/api/portfolio' && req.method === 'GET') {
      try {
        if (fs.existsSync(DATA_JSON)) {
          const content = fs.readFileSync(DATA_JSON, 'utf-8');
          return sendJson(res, 200, JSON.parse(content));
        }
        // Fallback: return 404 so client uses built-in default
        return sendJson(res, 404, { message: 'No custom portfolio JSON found' });
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    }

    // POST /api/portfolio
    if (url === '/api/portfolio' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const categories = Array.isArray(body) ? body : body.categories;

        if (!Array.isArray(categories)) {
          return sendJson(res, 400, { error: 'Invalid payload: expected categories array' });
        }

        // Save JSON
        const jsonContent = JSON.stringify(categories, null, 2);
        fs.writeFileSync(DATA_JSON, jsonContent, 'utf-8');

        // Also sync to dist if dist exists
        const distDataDir = path.join(__dirname, 'dist', 'data');
        if (fs.existsSync(path.join(__dirname, 'dist'))) {
          if (!fs.existsSync(distDataDir)) fs.mkdirSync(distDataDir, { recursive: true });
          fs.writeFileSync(path.join(distDataDir, 'portfolioData.json'), jsonContent, 'utf-8');
        }

        // Update portfolioData.js
        const jsContent = `// Auto-generated from Portfolio Admin Studio
export const portfolioCategories = ${jsonContent};

export default portfolioCategories;
`;
        fs.writeFileSync(DATA_JS, jsContent, 'utf-8');

        return sendJson(res, 200, { success: true, message: 'Portfolio updated successfully' });
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    }

    // POST /api/upload
    if (url === '/api/upload' && req.method === 'POST') {
      try {
        const contentType = req.headers['content-type'] || '';
        const xFilename = req.headers['x-filename'];
        const queryFilename = new URL(req.url, 'http://localhost').searchParams.get('filename');
        const rawFilename = xFilename ? decodeURIComponent(xFilename) : (queryFilename ? decodeURIComponent(queryFilename) : null);

        // Path A: Direct Binary Streaming (high performance, large videos, zero RAM buffering)
        if (rawFilename || !contentType.includes('application/json')) {
          const cleanName = rawFilename || `upload_${Date.now()}.mp4`;
          const cleanExt = path.extname(cleanName) || '.mp4';
          const rawBase = path.basename(cleanName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
          const safeName = `media_${Date.now()}_${rawBase}${cleanExt}`;

          const targetPublic = path.join(UPLOADS_DIR_PUBLIC, safeName);
          const targetDist = path.join(UPLOADS_DIR_DIST, safeName);
          const fileStream = fs.createWriteStream(targetPublic);

          req.pipe(fileStream);

          fileStream.on('finish', () => {
            try {
              if (fs.existsSync(path.join(__dirname, 'dist'))) {
                fs.copyFileSync(targetPublic, targetDist);
              }
              const relativeUrl = `assets/uploads/${safeName}`;
              return sendJson(res, 200, { success: true, url: relativeUrl, filename: safeName });
            } catch (err) {
              return sendJson(res, 500, { error: err.message });
            }
          });

          fileStream.on('error', (err) => {
            return sendJson(res, 500, { error: err.message });
          });

          return;
        }

        // Path B: JSON Base64 payload (for small images and fallback)
        const { filename, data } = await parseBody(req);
        if (!data || !filename) {
          return sendJson(res, 400, { error: 'Missing filename or data' });
        }

        const matches = data.match(/^data:([A-Za-z-+/_]+);base64,(.+)$/);
        const buffer = matches
          ? Buffer.from(matches[2], 'base64')
          : Buffer.from(data, 'base64');

        const cleanExt = path.extname(filename) || '.webp';
        const rawName = path.basename(filename, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeName = `media_${Date.now()}_${rawName}${cleanExt}`;

        fs.writeFileSync(path.join(UPLOADS_DIR_PUBLIC, safeName), buffer);
        if (fs.existsSync(UPLOADS_DIR_DIST)) {
          fs.writeFileSync(path.join(UPLOADS_DIR_DIST, safeName), buffer);
        }

        const relativeUrl = `assets/uploads/${safeName}`;
        return sendJson(res, 200, { success: true, url: relativeUrl, filename: safeName });
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    }

    // Pass through to next middleware
    next();
  };

  return {
    name: 'portfolio-api-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}
