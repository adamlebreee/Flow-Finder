const path = require('path');
const Express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = Express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
    cors({
        origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : true,
    })
);
app.use(Express.json());

module.exports = app;