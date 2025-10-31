
import express from 'express';
import { createUser, createSessionCookie } from '../services/authService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await createUser(email, password);
    res.status(201).send({ message: 'User created', userId: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { idToken } = req.body;
  try {
    const sessionCookie = await createSessionCookie(idToken);
    const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' };
    res.cookie('session', sessionCookie, options);
    res.end();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
});

export default router;
