const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Calculate cost for each operation
const operationCosts = {
  addition: 1,
  subtraction: 1,
  multiplication: 2,
  division: 2,
  square_root: 3,
  random_string: 1,
};

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
