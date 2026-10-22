import pino from 'pino';
import { config } from './env.config';

const isDevelopment = config.nodeEnv === 'development';

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',

  //    sensitive info does not show up in logs
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      'password',
      'newPassword',
      'otp',
      'token',
      'email',
    ],
    remove: true,
  },

  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
});
