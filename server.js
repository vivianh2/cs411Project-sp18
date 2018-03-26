const express = require("express");
const { Client } = require("pg");
const app = express();
const client = new Client({
  connectionString: process.env.DATABASE_URL
  // ssl: true,
});
client.connect();

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

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
      "SELECT DISTINCT concat(Subject, ' ', Number) AS col FROM uiuc.Class UNION SELECT DISTINCT unnest(isbn_list) AS col FROM uiuc.Class",
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
        "SELECT TID, Condition, Price, SellerId, ISBN " +
        "FROM uiuc.Transaction " +
        "WHERE ISBN IN (SELECT unnest(isbn_list) FROM uiuc.Class WHERE Subject = $1 AND Number = $2)",
      values: req.query.q.split(" ")
    };
  } else {
    query = {
      text:
        "SELECT TID, Condition, Price, SellerId, ISBN " +
        "FROM uiuc.Transaction " +
        "WHERE ISBN = $1",
      values: [req.query.q]
    };
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
      "SELECT t.tid, b.name, t.buyerid, t.sellerid, t.post_time, t.sell_time " +
      "FROM uiuc.transaction t, uiuc.book b, uiuc.user u " +
      "WHERE (t.buyerid = $1 OR t.sellerid = $1) AND t.isbn = b.isbn AND t.sellerid = u.netid",
    values: [req.query.id]
  };
  client.query(query, (err, r) => {
    if (err) throw err;
    console.log(r.rows[0]);
    res.send({ history: r.rows });
  });
});

app.post("/api/purchase", (req, res) => {
  var tid = req.body.tid;
  if (tid != null) {
    // update database
    // if the item is sold, do res.sendStatus(555);

    console.log("purchase " + tid);
    console.log("purchase " + netid);
    console.log("purchase " + req.body);

    client.query(
      "SELECT buyerid FROM uiuc.transaction WHERE tid = $1",
      [tid],
      (err, r) => {
        if (r != null) {
          res.sendStatus(555);
        } else {
          client.query(
            "UPDATE uiuc.transaction SET buyerid = $1 WHERE tid = $2",
            [netid, tid],
            (err, r) => {
              console.log("purchase done");
            }
          );
        }
      }
    );

    res.sendStatus(200);
  } else {
    // not authorize
    console.log("purchase " + tid);
    res.sendStatus(401);
  }
});

app.post("/api/received", (req, res) => {
  // update selltime in database
  // and return the timestamp
  var tid = req.body.tid;
  var time = new Date().getTime();

  client.query(
    "UPDATE uiuc.transaction SET sell_time = $1 WHERE tid = $2",
    [time, tid],
    (err, r) => {
      if (err) {
        throw err;
      } else {
        console.log("update timestamp done");
        res.send({
          selltime: time
        });
      }
    }
  );
});

app.post("/api/create", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.post("/api/delete", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
})

app.listen(port, () => console.log(`Listening on port ${port}`));
