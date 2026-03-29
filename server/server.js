const app = require('./app.js');
const db = require('./db.js');
const studioRouter = require('./routes/studios.js');
const authRouter = require('./routes/auth.js');


app.use('/studio', studioRouter);
app.use('/auth', authRouter);

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(
            `Port ${port} is already in use. Stop the other process (e.g. lsof -i :${port}) or set PORT=3001 in server/.env`
        );
    } else {
        console.error(err);
    }
    process.exit(1);
});