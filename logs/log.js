require("winston-daily-rotate-file");
var winston = require("winston");

var transport = new winston.transports.DailyRotateFile({
	filename: "./logs/Carslogs-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
});
var logs = winston.createLogger({ transports: [transport] });

module.exports = logs;
