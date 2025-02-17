import winston from "winston";

const date = new Date();
const fileName = `${date.toISOString().slice(0, 10)}-void.log`;

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `logs/${fileName}` }),
  ],
});
