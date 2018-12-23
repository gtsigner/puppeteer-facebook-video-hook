import * as winston from 'winston'

const myFormat = winston.format.printf(info => {
    info.level = info.level.toLocaleUpperCase();
    return `${info.timestamp} [${info.level}]: ${info.message}`;
});
const loggerPath = __dirname + '/../'
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        myFormat,
    ),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: loggerPath + 'logger.log' })
    ]
});

export default logger;