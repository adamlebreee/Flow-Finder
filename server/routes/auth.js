const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

router.post('/google/verify', async (req, res) => {
  try {
    const { idToken } = req.body ?? {};
    if (!idToken) {
      return res.status(400).json({ error: 'Missing idToken' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return res.status(500).json({ error: 'Server auth misconfigured' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'Server auth misconfigured' });
    }

    const googleClient = new OAuth2Client();
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const providerUserId = payload.sub;

    const user = await User.findOneAndUpdate(
      { provider: 'google', providerUserId },
      {
        $set: {
          email: payload.email,
          emailVerified: payload.email_verified,
          name: payload.name,
          picture: payload.picture,
        },
      },
      { upsert: true, new: true }
    );

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        provider: 'google',
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Auth verify error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
