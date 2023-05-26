const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.get('/', (_, res) => {
  res.send('Express JS on Vercel');
});

require('./routes/health')(app);
require('./routes/operation')(app);
require('./routes/users')(app);
require('./routes/auth')(app);
require('./routes/records')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
