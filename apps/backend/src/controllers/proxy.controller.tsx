import { ContainerStatus } from "@dockview/core/enums";
import { DockviewServerInstance } from "@dockview/core/models";
import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import httpProxy from "http-proxy";
import { ServerResponse } from "node:http";
import zlib from "node:zlib";
import { Stream } from "node:stream";

// TODO: this is a mess, need to refactor this

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: false,
  selfHandleResponse: true,
  xfwd: true,
});


const staticInstances = new Map<string, boolean>();


proxy.on('error', function (err, req, res) {
  console.error('Proxy error:', err);
  if (res instanceof ServerResponse && !res.headersSent) {
    res.writeHead(502);
    res.end('Proxy Error: ' + err.message);
  }
});

proxy.on('proxyReq', function (proxyReq, req, res, options) {
  const forwardedHost = req.headers['x-forwarded-host'];
  const targetUrl = options.target?.toString()

  const isStaticServer = targetUrl ? staticInstances.has(targetUrl) : false;
  console.log(staticInstances, { targetUrl, isStaticServer });

  if (isStaticServer) {
    console.log("-------------- is static server --------------");
    proxyReq.setHeader('host', new URL(options.target!.toString()).host);
    proxyReq.setHeader('X-Dockview-Proxy', 'true');
  } else if (forwardedHost) {
    console.log("-------------- is not static server --------------");
    proxyReq.setHeader('host', forwardedHost);
  }

  // no cache
  proxyReq.setHeader('Cache-Control', 'no-cache');

  console.log('Proxying request:', {
    originalHost: req.headers.host,
    forwardedHost: req.headers['x-forwarded-host'],
    modifiedHost: forwardedHost || req.headers.host,
    url: req.url
  });
});


const postMessageScript = `
          <script>
            window.addEventListener('load', function() {
              // Send initial path
              window.parent.postMessage({
                type: 'navigation',
                path: window.location.pathname
              }, '*');
              
              // Monitor navigation
              const originalPushState = history.pushState;
              history.pushState = function() {
                originalPushState.apply(this, arguments);
                window.parent.postMessage({
                  type: 'navigation',
                  path: window.location.pathname
                }, '*');
              };
              
              // Also monitor replaceState
              const originalReplaceState = history.replaceState;
              history.replaceState = function() {
                originalReplaceState.apply(this, arguments);
                window.parent.postMessage({
                  type: 'navigation',
                  path: window.location.pathname
                }, '*');
              };
            });
          </script>
          `;

proxy.on('proxyRes', function (proxyRes, req, res) {

  const statusCode = proxyRes.statusCode;
  const isRedirect = statusCode && statusCode >= 300 && statusCode < 400 && proxyRes.headers.location;
  const url = req.url || '';
  const contentType = proxyRes.headers['content-type']

  if (isRedirect) {
    // Get the redirect location
    const location = proxyRes.headers.location;

    if (!location) {
      console.error('No location header found in redirect response');
      res.writeHead(500);
      res.end('Proxy Error: No location header found in redirect response');
      return;
    }

    console.log('Handling redirect to:', location);

    // Modify the location header to point to our proxy
    // This ensures the browser stays within our proxy
    try {
      let redirectUrl = location;

      // If it's a relative URL, we need to resolve it
      if (!location?.startsWith('http')) {
        const targetUrl = (req as any).originalUrl || req.url;
        const baseUrl = new URL(targetUrl, `http://${req.headers.host}`);
        redirectUrl = new URL(location, baseUrl).pathname;
      } else {
        // For absolute URLs, extract just the path
        const parsedUrl = new URL(location);
        redirectUrl = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      }

      // Set the modified location header
      res.setHeader('Location', redirectUrl);

      // Copy other headers
      Object.keys(proxyRes.headers).forEach(key => {
        if (key.toLowerCase() !== 'location') {
          res.setHeader(key, proxyRes.headers[key] as string);
        }
      });

      // Send the redirect status and end the response
      res.writeHead(statusCode);
      res.end();
      return;
    } catch (error) {
      console.error('Error handling redirect:', error);
      // Fall through to normal handling if we can't process the redirect
    }
  }


  // Check if this is a JavaScript file that might be a module
  if (url.endsWith('.js') || url.endsWith('.mjs')) {
    // For JavaScript files, ensure proper MIME type
    if (!contentType || contentType === '' || contentType === 'text/plain') {
      proxyRes.headers['content-type'] = 'application/javascript';
    }
  }

  // Handle specific file extensions with appropriate MIME types
  if (url.endsWith('.css') && (!contentType || contentType === '')) {
    proxyRes.headers['content-type'] = 'text/css';
  } else if ((url.endsWith('.jpg') || url.endsWith('.jpeg')) && (!contentType || contentType === '')) {
    proxyRes.headers['content-type'] = 'image/jpeg';
  } else if (url.endsWith('.png') && (!contentType || contentType === '')) {
    proxyRes.headers['content-type'] = 'image/png';
  } else if (url.endsWith('.svg') && (!contentType || contentType === '')) {
    proxyRes.headers['content-type'] = 'image/svg+xml';
  } else if (url.endsWith('.json') && (!contentType || contentType === '')) {
    proxyRes.headers['content-type'] = 'application/json';
  }


  // Continue with normal response handling for non-redirects
  const contentEncoding = proxyRes.headers['content-encoding'];
  const isHtml = contentType && contentType.includes('text/html');

  // Special handling for JavaScript modules
  const isJsModule = req.headers.accept &&
    req.headers.accept.includes('application/javascript') &&
    (url.endsWith('.js') || url.endsWith('.mjs'));

  // If it's a JS module or not HTML, just pipe the response directly with fixed headers
  if (isJsModule || !isHtml) {
    // Copy all headers to the response
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key] as string);
    });

    proxyRes.pipe(res);
    return;
  }

  // If it's not HTML, just pipe the response directly
  if (!isHtml) {
    // For non-HTML content, just pipe directly for better performance
    proxyRes.pipe(res);
    return;
  }

  const contentLength = parseInt(proxyRes.headers['content-length'] || '0', 10);
  const isLargeResponse = contentLength > 1024 * 1024; // 1MB threshold

  if (isLargeResponse) {
    // For large responses, just pipe directly
    proxyRes.pipe(res);
    return;
  }

  // For HTML content, we need to handle compression
  if (contentEncoding) {

    let decompressionStream: Stream;
    let compressionStream: Stream | null = null;

    // Create the appropriate decompression stream
    if (contentEncoding.includes('gzip')) {
      decompressionStream = zlib.createGunzip();
      compressionStream = zlib.createGzip();
    } else if (contentEncoding.includes('deflate')) {
      decompressionStream = zlib.createInflate();
      compressionStream = zlib.createDeflate();
    } else if (contentEncoding.includes('br')) {
      decompressionStream = zlib.createBrotliDecompress();
      compressionStream = zlib.createBrotliCompress();
    } else {
      // Unknown compression, pipe directly
      proxyRes.pipe(res);
      return;
    }

    // OPTIMIZATION: Use transform stream for better performance
    const transformStream = new Stream.Transform({
      transform(chunk: Buffer, encoding: string, callback: () => void) {
        // Convert chunk to string
        const chunkStr = chunk.toString();

        // Only modify if it contains </body>
        if (chunkStr.includes('</body>')) {
          // Inject script before </body>
          const script = postMessageScript;

          const modifiedChunk = chunkStr.replace('</body>', script + '</body>');
          this.push(Buffer.from(modifiedChunk));
        } else {
          // Pass through unchanged
          this.push(chunk);
        }

        callback();
      }
    });

    // Set headers
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'content-length') {
        res.setHeader(key, proxyRes.headers[key] as string);
      }
    });

    // Pipe through the streams
    if (compressionStream) {
      proxyRes
        .pipe(decompressionStream as any)
        .pipe(transformStream)
        .pipe(compressionStream as any)
        .pipe(res);
    } else {
      // If we can't recompress, send uncompressed
      res.removeHeader('content-encoding');
      proxyRes
        .pipe(decompressionStream as any)
        .pipe(transformStream)
        .pipe(res);
    }
  } else {
    // For uncompressed content, proceed with modification
    const bodyChunks: Buffer[] = [];
    proxyRes.on('data', (chunk: Buffer) => {
      bodyChunks.push(chunk);
    });

    proxyRes.on('end', () => {
      try {
        let body = Buffer.concat(bodyChunks).toString();

        // Inject our script
        const script = postMessageScript;

        // Insert script before closing </body> tag
        body = body.replace('</body>', script + '</body>');

        // Set headers (excluding content-length)
        Object.keys(proxyRes.headers).forEach(key => {
          if (key.toLowerCase() !== 'content-length') {
            res.setHeader(key, proxyRes.headers[key] as string);
          }
        });

        // Set the correct content length
        res.setHeader('Content-Length', Buffer.byteLength(body));
        res.end(body);
      } catch (error) {
        console.error('Error processing content:', error);
        res.writeHead(500);
        res.end('Error processing response');
      }
    });
  }
});




@singleton()
export class ProxyController {

  constructor() {
  }

  async proxyRequests(req: Request, res: Response, next: NextFunction) {

    // Check if the containerID is valid
    const instance = req.instance;

    instance.updateLastAccessed();

    if (instance instanceof DockviewServerInstance && instance.container) {

      const container = instance.container;

      if (instance.status !== ContainerStatus.TRANSITION) {
        instance.logs.logWarning("Container is not ready");
        return;
      }

      const { ip, port } = await container.getNetworkInfo();

      if (ip === "0.0.0.0" || port === 0) {
        instance.logs.logError("Failed to get network info");
        return;
      }

      const url = `http://${ip}:${port}`;

      if (instance.project.analysis.environment === "static-server") {
        console.log("Setting static instance", url);
        staticInstances.set(url, true);
      }


      proxy.web(req, res, {
        target: url,
        changeOrigin: true,
        ws: false,
        xfwd: true,
      });
      return;
    }
  }
}
