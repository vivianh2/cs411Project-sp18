const express = require('express');
const { Client } = require('pg')
const app = express();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
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
    res.send({rating: r.rows[0].rating});
  });
});

app.get('/api/suggestions', (req, res) => {
  const query = {
    text: 'SELECT DISTINCT concat(Subject, \' \', Number) AS col FROM uiuc.Class UNION SELECT DISTINCT unnest(isbn_list) AS col FROM uiuc.Class',
    rowMode: 'array',
  }

  client.query(query, (err, r) => {
    if (err) throw err;
    res.send({suggestions: [].concat.apply([], r.rows)});
  });
});

app.get('/api/search', (req, res) => {
  console.log("Search " + req.query.q);
  let query;
  if (isNaN(req.query.q)){
    query = {
      text: 'SELECT TID, Condition, Price, SellerId, ISBN '
            + 'FROM uiuc.Transaction '
            + 'WHERE ISBN IN (SELECT unnest(isbn_list) FROM uiuc.Class WHERE Subject = $1 AND Number = $2)',
      values: req.query.q.split(' '),
    }
  } else {
    query = {
      text: 'SELECT TID, Condition, Price, SellerId, ISBN '
            + 'FROM uiuc.Transaction '
            + 'WHERE ISBN = $1',
      values: [req.query.q],
    }
  }

  client.query(query, (err, r) => {
    if (err) throw err;
    let books = [];
    let posts = [];

    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    let isbn_transaction = groupBy(r.rows, 'isbn');

    for (let isbn in isbn_transaction){
      books.push({isbn: isbn});
      posts.push(isbn_transaction[isbn]);
    }

    res.send({
      books: books,
      posts: posts
    });
  });
});

app.get('/api/history', (req, res) => {
  console.log("History " + req.query.id);
  res.send({
    history: [
      {
        tid: 1,
        title: "Database Systems: The Complete Book",
        buyer: "Ahri",
        seller: "Bard",
        posttime: "timestamp",
        selltime: "timestamp",
      },
      {
        tid: 2,
        title: "Angels and Demons",
        buyer: "Bard",
        seller: "Caitlyn",
        posttime: "timestamp",
        selltime: null,
      },
      {
        tid: 3,
        title: "Da Vinci code",
        buyer: "Caitlyn",
        seller: "Darius",
        posttime: "timestamp",
        selltime: "timestamp",
      },
      {
        tid: 4,
        title: "Da Vinci code",
        buyer: "Darius",
        seller: "Ekko",
        posttime: "timestamp",
        selltime: "timestamp2",
      },
      {
        tid: 5,
        title: "Da Vinci code",
        buyer: "Ekko",
        seller: "Fiora",
        posttime: "timestamp",
        selltime: "timestamp3",
      },
      {
        tid: 6,
        title: "Da Vinci code",
        buyer: "Fiora",
        seller: "Galio",
        posttime: "timestamp",
        selltime: null,
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

app.post('/api/received', (req, res) => {
  // update selltime in database
  // and return the timestamp
  res.send({
    selltime: "timestamp",
  })
})

app.post('/api/create', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
