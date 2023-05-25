const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const checkBalance = require('../middlewares/checkBalance');
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

module.exports = (app) => {
  // @route POST /new-operation
  // @desc Handle calculator operations
  // @access Public
  app.post('/new-operation', checkBalance, async (req, res) => {
    const { type, amount } = req.body;
    const { user } = req;

    // Check if operation type is valid
    const operationCost = operationCosts[type];
    if (operationCost === undefined) {
      return res.status(400).json({ error: 'Invalid operation type' });
    }

    // Check if user has sufficient balance
    if (user.balance < operationCost) {
      return res.status(403).json({ error: 'Insufficient balance' });
    }

    let operationResponse;
    let newBalance;

    switch (type) {
      case 'addition':
        operationResponse = user.balance + amount;
        break;
      case 'subtraction':
        operationResponse = user.balance - amount;
        break;
      case 'multiplication':
        operationResponse = user.balance * amount;
        break;
      case 'division':
        operationResponse = user.balance / amount;
        break;
      case 'square_root':
        operationResponse = Math.sqrt(user.balance);
        break;
      case 'random_string':
        try {
          const response = await axios.get('https://www.random.org/clients/string');
          operationResponse = response.data;
        } catch (error) {
          console.error('Error while generating random string:', error);
          return res.status(500).json({ error: 'Failed to generate random string' });
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid operation type' });
    }

    newBalance = operationCost > user.balance ? user.balance - operationCost : user.balance;

    try {
      const operation = await prisma.operation.create({
        data: {
          type,
          cost: operationCost,
          user_balance: newBalance,
          user: { connect: { id: user.id } },
        },
      });

      await prisma.record.create({
        data: {
          operation_id: operation.id,
          user_id: user.id,
          amount,
          user_balance: newBalance,
          operation_response: operationResponse,
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance },
      });

      res.json({
        result: operationResponse,
        balance: newBalance,
      });
    } catch (error) {
      console.error('Error while saving operation/record:', error);
      res.status(500).json({ error: 'Failed to save operation/record' });
    }
  });
};
