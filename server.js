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

app.get('/api/search', (req, res) => {
  console.log(req.query.q);
  res.send({
    books: [
      {
        title: "Database Systems: The Complete Book",
        isbn: "9780133002010",
      },
      {
        title: "Angels and Demons",
        isbn: "9780593063743",
      },
      {
        title: "Da Vinci code",
        isbn: "9786028811842",
      }
    ],
    posts: [
      [
        {
          condition: "Good",
          price: "$29.99",
          seller: "Ahri"
        },
        {
          condition: "Good",
          price: "$28.99",
          seller: "Bard"
        },
        {
          condition: "Like New",
          price: "$6.99",
          seller: "Caitlyn"
        }
      ],
      [
        {
          condition: "Unacceptable",
          price: "$0.99",
          seller: "Darius"
        },
        {
          condition: "Used",
          price: "$9.99",
          seller: "Ekko"
        }
      ],
      []
    ]
  });
});

app.get('/api/history', (req, res) => {
  console.log(req.query.id);
  res.send({
    history: [
      {
        title: "Database Systems: The Complete Book",
      },
      {
        title: "Angels and Demons",
      },
      {
        title: "Da Vinci code",
      }
    ]
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));
