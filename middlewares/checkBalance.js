const { PrismaClient } = require('@prisma/client');
const operationCosts = require('../utils/constants');

const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Calculate cost for each operation
module.exports = async (req, res, next) => {
  const userId = req.body.user_id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status === 'inactive') {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    const operationType = req.body.type;
    const operationCost = operationCosts[operationType];

    if (!operationCost) {
      return res.status(400).json({ error: 'Invalid operation type' });
    }

    if (user.balance < operationCost) {
      return res.status(403).json({ error: 'Insufficient balance' });
    }

    req.user = user;
    req.operationCost = operationCost;
    next();
  } catch (error) {
    console.error('Error while checking user balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
