const express = require('express');

const app = express();
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/account', (req, res) => {
  console.log(req.query.id);
  res.send({ rating: 4 });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
