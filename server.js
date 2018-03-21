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

app.get('/api/suggestions', (req, res) => {
  res.send({
    suggestions: [
      { label: 'Afghanistan' },
      { label: 'Aland Islands' },
      { label: 'Albania' },
      { label: 'Algeria' },
      { label: 'American Samoa' },
      { label: 'Andorra' },
      { label: 'Angola' },
      { label: 'Anguilla' },
      { label: 'Antarctica' },
      { label: 'Antigua and Barbuda' },
      { label: 'Argentina' },
      { label: 'Armenia' },
      { label: 'Aruba' },
      { label: 'Australia' },
      { label: 'Austria' },
      { label: 'Azerbaijan' },
      { label: 'Bahamas' },
      { label: 'Bahrain' },
      { label: 'Bangladesh' },
      { label: 'Barbados' },
      { label: 'Belarus' },
      { label: 'Belgium' },
      { label: 'Belize' },
      { label: 'Benin' },
      { label: 'Bermuda' },
      { label: 'Bhutan' },
      { label: 'Bolivia, Plurinational State of' },
      { label: 'Bonaire, Sint Eustatius and Saba' },
      { label: 'Bosnia and Herzegovina' },
      { label: 'Botswana' },
      { label: 'Bouvet Island' },
      { label: 'Brazil' },
      { label: 'British Indian Ocean Territory' },
      { label: 'Brunei Darussalam' },
    ]
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));
