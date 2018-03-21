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
          tid: 1,
          condition: "Good",
          price: "$29.99",
          seller: "Ahri"
        },
        {
          tid: 2,
          condition: "Good",
          price: "$28.99",
          seller: "Bard"
        },
        {
          tid: 3,
          condition: "Like New",
          price: "$6.99",
          seller: "Caitlyn"
        }
      ],
      [
        {
          tid: 4,
          condition: "Unacceptable",
          price: "$0.99",
          seller: "Darius"
        },
        {
          tid: 5,
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

app.get('/api/transaction', (req, res) => {
  console.log(req.query.id);
  res.send({
      condition: "Good",
      price: "$29.99",
      seller: "Ahri",
      img: "https://books.google.com/books/content?id=gaEuAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72YDhrQcmNKLbAuYRLmMyfjWL54PKfgzCz9yno2qpuQ3BBnd1RMg_FHVUrTwSKqOfNAUbANY86rhhzzoNPwV5CLzVRfsOO1dxemmA6JvwApRWA-vAYr6ilKpuEf9JKtPfTKnteF",
      contact: "wechat: ahri",
  })
});

app.get('/api/book', (req, res) => {
  console.log(req.query.isbn);
  res.send({
    title: "Database Systems: the Complete Book",
    author: "Hector Garcia-Molina, Jeffrey D. Ullman, Jennifer Widom",
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`));
