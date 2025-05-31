import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

// Cache with 1 hour TTL
const cache = new NodeCache({ stdTTL: 3600 });

export const cacheMiddleware = (duration: number = 3600) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache POST requests to /chat
    if (req.method !== 'POST' || !req.path.includes('/chat')) {
      return next();
    }

    const key = `chat_${req.body.message}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json method
    res.json = function(body: any) {
      cache.set(key, body, duration);
      return originalJson.call(this, body);
    };

    next();
  };
}; 