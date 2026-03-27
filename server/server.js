const app = require('./app.js');
const db = require('./db.js');
const studioRouter = require('./routes/studios.js');
const authRouter = require('./routes/auth.js');


app.use('/studio', studioRouter);
app.use('/auth', authRouter);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});