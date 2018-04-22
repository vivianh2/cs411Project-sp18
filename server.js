const express = require("express");
const { Client } = require("pg");
const app = express();
let client;

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
} else{
  client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
}
client.connect();

const port = process.env.PORT || 3001;

var netid = null;
app.post("/api/login", (req, res) => {
  netid = req.body.netid;
  res.sendStatus(200);
});

app.post("/api/logout", (req, res) => {
  netid = null;
  res.sendStatus(200);
});

app.get("/api/account", (req, res) => {
  console.log("Account " + req.query.id);
  const query = {
    text: "SELECT Rating FROM uiuc.User WHERE NETID = $1",
    values: [req.query.id]
  };

  client.query(query, (err, r) => {
    if (err) throw err;
    res.send({ rating: r.rows[0].rating });
  });
});

app.get("/api/suggestions", (req, res) => {
  const query = {
    text:
      "SELECT DISTINCT concat(Subject, ' ', Number) AS col FROM uiuc.Class UNION SELECT DISTINCT isbn AS col FROM uiuc.transaction",
    rowMode: "array"
  };


  client.query(query, (err, r) => {
    if (err) throw err;
    res.send({ suggestions: [].concat.apply([], r.rows) });
  });

});

app.get("/api/search", (req, res) => {
  console.log("Search " + req.query.q);
  let query;
  if (isNaN(req.query.q)) {
    query = {
      text:
        "SELECT TID, Condition, Price, SellerId, ISBN, img_url " +
        "FROM uiuc.Transaction " +
        "WHERE ISBN IN (SELECT unnest(isbn_list) FROM uiuc.Class WHERE Subject = $1 AND Number = $2)",
      values: req.query.q.split(" ")
    };
  } else {
    query = {
      text:
        "SELECT TID, Condition, Price, SellerId, ISBN, img_url " +
        "FROM uiuc.Transaction " +
        "WHERE ISBN = $1",
      values: [req.query.q]
    };
  }


  client.query(query, (err, r) => {
    console.log(err);
    if (err) throw err;

    let books = [];
    let posts = [];

    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    let isbn_transaction = groupBy(r.rows, "isbn");

    for (let isbn in isbn_transaction) {
      books.push({ isbn: isbn });
      posts.push(isbn_transaction[isbn]);
    }

    res.send({
      books: books,
      posts: posts
    });
  });
});

app.get("/api/history", (req, res) => {
  console.log("History " + req.query.id);
  const query = {
    text:
      "SELECT t.tid, b.name, t.buyerid, t.sellerid, t.post_time, t.sell_time, t.price \
       FROM uiuc.transaction t, uiuc.book b, uiuc.user u \
       WHERE (t.buyerid = $1 OR t.sellerid = $1) AND t.isbn = b.isbn AND t.sellerid = u.netid",
    values: [req.query.id]
  };
  client.query(query, (err, r) => {
    if (err) throw err;
    console.log(r.rows);
    res.send({ history: r.rows });
  });
});

app.post("/api/update", (req, res) => {
  console.log("Update " + req.body.tid)
  let price = req.body.price.slice(1)
  console.log(price)
  console.log(req.body.buyer)
  const query = {
    text:
      "UPDATE uiuc.transaction SET price = $1, buyerid = $2 WHERE tid = $3",
    values: [price, req.body.buyer, req.body.tid]
  };
  client.query(query, (err, r) => {
    if (err) throw err;
    res.send({
      price: req.body.price,
      buyer: req.body.buyer
    })
  });
})

app.post("/api/received", (req, res) => {
  // update selltime in database
  // and return the timestamp
  let tid = req.body.tid;
  const time = new Date();

  client.query(
    "UPDATE uiuc.transaction SET sell_time = $1 WHERE tid = $2",
    [time, tid],
    (err, r) => {
      if (err) {
        throw err;
      } else {
        console.log("update timestamp done");
        res.send({
          sell_time: time
        });
      }
    }
  );
});

app.post("/api/create", (req, res) => {
  console.log(req.body);
    let isbn = req.body.isbn;
    let condition = req.body.condition;
    let price = req.body.price;
    let img_url = req.body.img_url;

    console.log("hehe")
    console.log(img_url)

    client.query(
        "INSERT INTO uiuc.Transaction (isbn, condition, price, sellerid, img_url, post_time) VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP);",
        [isbn, condition, price, netid, img_url],
        (err, r) => {
          if (err) {
            throw err;
          } else {
            console.log("Insert post done");
            res.sendStatus(200);
          }
        }
    );
});

app.post("/api/delete", (req, res) => {
  client.query(
    "DELETE FROM uiuc.Transaction WHERE tid=$1",
    [req.body.tid],
    (err, r) => {
      if (err) {
        throw err;
      } else {
        console.log(req.body.tid + " deleted");
        res.sendStatus(200);
      }
    }
  );
})

app.listen(port, () => console.log(`Listening on port ${port}`));
