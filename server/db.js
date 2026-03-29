const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/Yoga';

function redactMongoUri(uri) {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

console.log('Connecting to MongoDB:', redactMongoUri(mongoUri));

mongoose
    .connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        // Prefer IPv4; avoids some Atlas failures on networks where IPv6 is broken or misrouted.
        family: 4,
    })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error('Error connecting to DB:', err.message);
        console.error(
            'Check MONGODB_URI, Atlas Network Access (IP allowlist), DB user password, cluster not paused.'
        );
        console.error(
            'If you see SSL/TLS errors, use Node 20 LTS (not Node 22+), turn VPN off to test, and try again.'
        );
    });
