import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rootRouter from './api/routes';
import { errorHandler } from './middlewares/error.middleware';
import './config/env.config';
import { startCronJobs } from './api/shared/cron.service';
import { logger } from './config/logger.config';
import { pinoHttp } from 'pino-http';

const app = express();

app.use(pinoHttp({ logger }));

app.use(express.json());

const PORT = process.env.PORT || 3000;

// enabling cross origin resources in helmet
// so the frontend can show files originating from the backend
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: 'http://localhost:5000',
    credentials: true,
  }),
);

app.use('/api', rootRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

app.listen(PORT, (error?: Error) => {
  if (error) {
    logger.fatal({ err: error }, 'Server startup failed');
    process.exitCode = 1;
    return;
  }

  logger.info({ port: PORT }, 'Server started');

  // starting Cron background processes, only after a succesfull server startup
  startCronJobs();
});
