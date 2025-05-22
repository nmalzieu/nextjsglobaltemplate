import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logLevel = process.env["LOG_LEVEL"] || "info";

const textLogFormat = winston.format.printf((data) => {
  const { level, message, timestamp, ...meta } = data;
  let i = 0;
  const metaArray: unknown[] = [];
  while (meta[`${i}`]) {
    metaArray.push(meta[`${i}`]);
    i += 1;
  }
  const metaStr = metaArray.length
    ? ` ${metaArray.map((a) => JSON.stringify(a)).join(", ")}`
    : "";

  return `${timestamp} ${level}: ${message}${metaStr}`;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      textLogFormat,
    ),
  }),
];

const logtailToken = process.env["LOGTAIL_TOKEN"];
const logtailEndpoint = process.env["LOGTAIL_ENDPOINT"];

const logtail = logtailToken
  ? new Logtail(logtailToken, {
      endpoint: logtailEndpoint,
    })
  : undefined;
if (logtail) {
  transports.push(new LogtailTransport(logtail, { level: "debug" }));
}

const logger = winston.createLogger({
  transports,
});

export const debug = (message: string, ...meta: any[]): void => {
  logger.debug(message, meta);
  if (logtail) logtail.flush();
};

export const info = (message: string, ...meta: any[]): void => {
  logger.info(message, meta);
  if (logtail) logtail.flush();
};

export const warn = (message: string, ...meta: any[]): void => {
  logger.warn(message, meta);
  if (logtail) logtail.flush();
};

export const error = (message: string, err?: Error, ...meta: any[]): void => {
  if (err) {
    logger.error(`${message}: ${err.message}`, {
      stack: err.stack,
      ...((err as any).isAxiosError
        ? {
            url: (err as any).config?.url,
            status: (err as any).response?.status,
          }
        : {}),
      ...meta,
    });
  } else {
    logger.error(message, meta);
  }
  if (logtail) logtail.flush();
};
