const express = require('express');

const app = express();
app.use(express.json());

require('./routes/health')(app);
require('./routes/operation')(app);
require('./routes/users')(app);
require('./routes/auth')(app);
require('./routes/records')(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
