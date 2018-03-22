const express = require('express');
const Client = require('pg')
const app = express();

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

const port = process.env.PORT || 3001;

var netid = null;
app.post('/api/login', (req, res) => {
  netid = req.body.netid;
  res.sendStatus(200);
});

app.post('/api/logout', (req, res) => {
  netid = null;
  res.sendStatus(200);
});

app.get('/api/account', (req, res) => {
  /*
  Connection info string:
   "dbname=d7ci54n4h4tp1i host=ec2-54-163-246-193.compute-1.amazonaws.com port=5432 user=qajckcslbdizfn password=2c9e98f6f2b14a3399916c7e436ad4563d18b5b764e261a14d85fb340357c4c2 sslmode=require"
   Connection URL:
   postgres://qajckcslbdizfn:2c9e98f6f2b14a3399916c7e436ad4563d18b5b764e261a14d85fb340357c4c2@ec2-54-163-246-193.compute-1.amazonaws.com:5432/d7ci54n4h4tp1i
  */

  console.log(req.query.id)
  const client = new Client({
    //connectionString: 'dbname=d7ci54n4h4tp1i host=ec2-54-163-246-193.compute-1.amazonaws.com port=5432 user=qajckcslbdizfn password=2c9e98f6f2b14a3399916c7e436ad4563d18b5b764e261a14d85fb340357c4c2 sslmode=require',
    connectionString: "dbname=d7ci54n4h4tp1i host=ec2-54-163-246-193.compute-1.amazonaws.com port=5432 user=qajckcslbdizfn password=2c9e98f6f2b14a3399916c7e436ad4563d18b5b764e261a14d85fb340357c4c2 sslmode=require",
    ssl: true
  });

  client.connect();
  var ans = client.query("SELECT rating FROM uiuc.user WHERE netid = ?", req.query.id);
  client.end();
  res.send({ rating: ans });
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
        author: "Hector Garcia-Molina, Jeffrey D. Ullman, Jennifer Widom",
      },
      {
        title: "Angels and Demons",
        isbn: "9780593063743",
        author: "Dan Brown",
      },
      {
        title: "Da Vinci code",
        isbn: "9786028811842",
        author: "Dan Brown",
      }
    ],
    posts: [
      [
        {
          tid: 1,
          condition: "Good",
          price: "$29.99",
          seller: "Ahri",
          img: "https://books.google.com/books/content?id=gaEuAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72YDhrQcmNKLbAuYRLmMyfjWL54PKfgzCz9yno2qpuQ3BBnd1RMg_FHVUrTwSKqOfNAUbANY86rhhzzoNPwV5CLzVRfsOO1dxemmA6JvwApRWA-vAYr6ilKpuEf9JKtPfTKnteF",
          contact: "wechat: ahri",
        },
        {
          tid: 2,
          condition: "Good",
          price: "$28.99",
          seller: "Bard",
          img: "https://books.google.com/books/content?id=gaEuAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72YDhrQcmNKLbAuYRLmMyfjWL54PKfgzCz9yno2qpuQ3BBnd1RMg_FHVUrTwSKqOfNAUbANY86rhhzzoNPwV5CLzVRfsOO1dxemmA6JvwApRWA-vAYr6ilKpuEf9JKtPfTKnteF",
          contact: "wechat: bard",
        },
        {
          tid: 3,
          condition: "Like New",
          price: "$6.99",
          seller: "Caitlyn",
          img: "https://books.google.com/books/content?id=gaEuAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72YDhrQcmNKLbAuYRLmMyfjWL54PKfgzCz9yno2qpuQ3BBnd1RMg_FHVUrTwSKqOfNAUbANY86rhhzzoNPwV5CLzVRfsOO1dxemmA6JvwApRWA-vAYr6ilKpuEf9JKtPfTKnteF",
          contact: "wechat: caitlyn",
        }
      ],
      [
        {
          tid: 4,
          condition: "Unacceptable",
          price: "$0.99",
          seller: "Darius",
          img: "https://books.google.com/books/content?id=gaEuAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72YDhrQcmNKLbAuYRLmMyfjWL54PKfgzCz9yno2qpuQ3BBnd1RMg_FHVUrTwSKqOfNAUbANY86rhhzzoNPwV5CLzVRfsOO1dxemmA6JvwApRWA-vAYr6ilKpuEf9JKtPfTKnteF",
          contact: "wechat: darius",
        },
        {
          tid: 5,
          condition: "Used",
          price: "$9.99",
          seller: "Ekko",
          img: "https://books.google.com/books/content?id=gaEuAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72YDhrQcmNKLbAuYRLmMyfjWL54PKfgzCz9yno2qpuQ3BBnd1RMg_FHVUrTwSKqOfNAUbANY86rhhzzoNPwV5CLzVRfsOO1dxemmA6JvwApRWA-vAYr6ilKpuEf9JKtPfTKnteF",
          contact: "wechat: ekko",
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

app.post('/api/purchase', (req, res) => {
  if (netid != null){
    // update database
    // if the item is sold, do res.sendStatus(555);
    console.log(netid);
    console.log(req.body);
    res.sendStatus(200);
  } else{
    // not authorize
    res.sendStatus(401);
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));
