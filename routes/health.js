module.exports = (app) => {
  // @route GET /
  // @desc Health check of the API
  // @access Public
  app.get('/', (_, res) => {
    res.json({ message: 'OK' });
  });
};
