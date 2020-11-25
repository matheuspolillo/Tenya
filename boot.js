require('dotenv').config();
global.__base = __dirname;
global.Loader = require(`${__base}/services/loader.js`);
global.Logger = Loader.export('logger', { configPath: `${__base}/config/logger.config.json` });

Loader.startServer();
Loader.startMongo();
Loader.startSmppServer();
Loader.startSmppClient('all');