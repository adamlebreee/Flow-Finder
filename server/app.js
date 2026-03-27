const Express = require('express');
const cors = require('cors');

const app = Express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
    cors({
        origin: corsOrigin ? corsOrigin.split(',').map((s) => s.trim()) : true,
    })
);
app.use(Express.json());

module.exports = app;