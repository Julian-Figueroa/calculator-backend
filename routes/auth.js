const { PrismaClient } = require('@prisma/client');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

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
  // @route GET /auth
  // @desc Get logged in user
  // @access Private
  app.get('/auth', auth, async (req, res) => {
    const id = req.user.id;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      delete user.password;
      res.json(user);
    } catch (error) {
      console.error('Error getting a logged in user:', error);
      res.status(500).json({ error: 'Failed getting a logged in user' });
    }
  });

  // @route POST /auth
  // @desc Auth user and get token
  // @access Public
  app.post(
    '/auth',
    [check('username', 'Please enter a valid email').isEmail(), check('password', 'Please enter a password').exists()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }

      const { username, password } = req.body;

      try {
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (!user) {
          return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({
            message: 'Invalid Credentials',
          });
        }

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
        console.error('Error while fetching user:', error);
        res.status(500).json({
          message: 'Server Error',
        });
      }
    }
  );
};
