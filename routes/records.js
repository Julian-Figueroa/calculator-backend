const { PrismaClient } = require('@prisma/client');
const auth = require('../middlewares/auth');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

module.exports = (app) => {
  // Retrieve User Records
  // @route GET /user/:userId/records
  // @desc Retrieve User Records
  // @access Private
  app.get('/user/:userId/records', auth, async (req, res) => {
    const { userId } = req.params;
    const { page = 1, perPage = 10, sort = 'asc' } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is needed' });
    }

    try {
      const records = await prisma.record.findMany({
        where: {
          user_id: parseInt(userId),
        },
        orderBy: { id: sort.toLowerCase() },
        skip: (page - 1) * perPage,
        take: perPage,
      });

      res.json(records);
    } catch (error) {
      console.error('Error while retrieving user records:', error);
      res.status(500).json({ error: 'Failed to retrieve user records' });
    }
  });

  // @route DELETE /user/records?:recordId
  // @desc Delete the record by id
  // @access Private
  app.delete('/user/records', auth, async (req, res) => {
    const { recordId } = req.query;

    if (!recordId) {
      return res.status(400).json({ error: 'recordId is needed' });
    }

    try {
      await prisma.record.delete({
        where: {
          id: parseInt(recordId),
        },
      });

      res.json({ message: 'User records deleted successfully' });
    } catch (error) {
      console.error('Error while deleting user records:', error);
      res.status(500).json({ error: 'Failed to delete user records' });
    }
  });
};
