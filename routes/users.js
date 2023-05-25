const { PrismaClient } = require('@prisma/client');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  // @route POST /
  // @desc Create a new User
  // @access Public
  app.post(
    '/users',
    [
      check('username', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { username, password, balance } = req.body;

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);

        const user = await prisma.user.create({
          data: {
            username,
            password: await bcrypt.hash(password, salt),
            balance: balance ?? 50,
          },
        });

        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 360000,
          },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (error) {
        console.error('Error while creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
      }
    }
  );
};
