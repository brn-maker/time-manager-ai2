
import express from 'express';
import paystack from 'paystack';
import crypto from 'crypto';
import { protect } from '../middleware/authMiddleware.js';
import { getUserById } from '../services/authService.js';
import { findOrCreateUser, updateUser } from '../services/dbService.js';

const router = express.Router();
const paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY);

// Route to initiate a payment
router.post('/initiate', protect, async (req, res) => {
  try {
    const user_id = req.user.uid;
    const user = await getUserById(user_id);
    const email = user.email;

    const transaction = await paystackInstance.transaction.initialize({
      email: email,
      amount: 100000, // 1000 NGN in kobo
      metadata: {
        user_id: user_id,
        credits: 10 // Number of credits to add
      }
    });

    res.json({ authorization_url: transaction.data.authorization_url });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'An error occurred while initiating the payment.' });
  }
});

// Route for Paystack webhook
router.post('/webhook', async (req, res) => {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
  //validate event
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (hash == req.headers['x-paystack-signature']) {
    const event = req.body;
    if (event.event === 'charge.success') {
      const user_id = event.data.metadata.user_id;
      const credits = event.data.metadata.credits;

      const user = await findOrCreateUser(user_id);
      await updateUser(user_id, { aiAnalysisCount: user.aiAnalysisCount + credits });
    }
  }

  res.sendStatus(200);
});

export default router;
