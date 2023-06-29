import winston from 'winston';

const { LOGGER_LEVEL } = process.env;

if (!LOGGER_LEVEL) {
    throw new Error('Invalid LOGGER_LEVEL!')
}

export const logger = winston.createLogger({
    level: LOGGER_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'logs/app.log' })
    ],
});