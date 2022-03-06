import { Params } from 'nestjs-pino';

export const pinoLoggerConfig: Params = {
  pinoHttp:
    process.env.NODE_ENV === 'development'
      ? {
          prettyPrint: {
            colorize: true,
            levelFirst: true,
          },
        }
      : {},
};
