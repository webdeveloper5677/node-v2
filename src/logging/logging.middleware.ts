import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const timeTaken = Date.now() - startTime;
      const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${timeTaken.toFixed(2)} ms`;
      console.log(logMessage);
    });

    next();
  }
}
