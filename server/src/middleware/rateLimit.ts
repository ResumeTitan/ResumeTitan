import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: 'Too many requests from this IP, please try again after a minute',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
