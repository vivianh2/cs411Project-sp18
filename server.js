const express = require('express');
const { Client } = require('pg')
const app = express();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

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
  console.log("Account " + req.query.id);
  const query = {
    text: 'SELECT Rating FROM uiuc.User WHERE NETID = $1',
    values: [req.query.id],
  }

  client.query(query, (err, r) => {
    if (err) throw err;
    console.log(r.rows[0]);
    res.send({rating: r.rows[0].rating});
  });
});

app.get('/api/suggestions', (req, res) => {
  const query = {
    text: 'SELECT Subject FROM uiuc.Class',
  }

  client.query(query, (err, r) => {
    if (err) throw err;
    console.log(r.rows[0].subject);
    res.send({suggestions: r.rows});
  });
});

app.get('/api/search', (req, res) => {
  console.log("Search " + req.query.q);
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
  console.log("History " + req.query.id);
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
    console.log("purchase " + netid);
    console.log("purchase " + req.body);
    res.sendStatus(200);
  } else{
    // not authorize
    res.sendStatus(401);
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));
