const express = require('express');
const dotenv = require('dotenv');
const createWallet = require('./createWallet'); // adjust if needed
const tokenTransfer = require('./tokenTransfer');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Routes

//testing Route
app.get('/', (req, res) => {
  res.send('Hedera fractional NFT API server is running!');
});


//Create Account Route
app.post('/api/wallet/create', async (req, res) => {
  try {
    const wallet = await createWallet();
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Error in /api/wallet/create:', error);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

//Transfer Route
app.post('/api/token/transfer', async (req, res) => {
    try {
      const { senderAccountId, senderPrivateKey, receiverAccountId, amount } = req.body;
  
      // Ensure required fields are provided
      if (!senderAccountId || !senderPrivateKey || !receiverAccountId || !amount ) {
        return res.status(400).json({ error: 'Missing required fields in request body' });
      }

      await tokenTransfer(senderAccountId, senderPrivateKey, receiverAccountId, amount);

    res.status(200).json({ message: 'Token transfer successful' }); 

  } catch (error) {
    console.error('Error in /api/token/transfer:', error);
    res.status(500).json({ error: 'Failed to process token transfer' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
