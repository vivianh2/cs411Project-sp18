const express = require("express");
const { Client } = require("pg");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
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
} else {
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

    var groupBy = function (xs, key) {
      return xs.reduce(function (rv, x) {
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
        //send email when there is a new book be posted.
        sendEmail(req, res);
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
});

function getBookName(req, res, callback) {
  let isbn = req.body.isbn;
  let bookName = "";
  const query = {
    text: "SELECT name FROM uiuc.book WHERE uiuc.book.isbn = $1;",
    values: [isbn]
  };

  client.query(query, (err, r) => {
    if (err) throw err;
    //console.log("book name: " + r.rows[0].name);
    bookName = r.rows[0].name;
    callback(bookName);
  });
}

function getMailList(req, res, callback) {
  let isbn = req.body.isbn;
  let mailArray = [];

  const query = {
    text: "SELECT mailing_list FROM uiuc.book WHERE uiuc.book.isbn = $1;",
    values: [isbn]
  };

  client.query(query, (err, r) => {
    if (err) throw err;
    //console.log("mail array: " + r.rows[0].mailing_list);
    mailArray = r.rows[0].mailing_list;
    callback(mailArray);
  });
}

function deleteMailList(req, res, callback) {
  let delete_ = "";
  let isbn = req.body.isbn;

  const query = {
    text: "UPDATE uiuc.book SET mailing_list = NULL WHERE uiuc.book.isbn = $1;",
    values: [isbn]
  };

  client.query(query, (err, r) => {
    if (err) {
      throw err;
    } else {
      console.log("delete mailing_list done");
    }

    callback(delete_);
  });
}

function sendEmail(req, res) {
  //console.log("name:" + req.body.name); // NO, don't need this. send what you get from post!
  let isbn = req.body.isbn;
  let condition = req.body.condition;
  let price = req.body.price;
  let bookName = "";
  let mailArray = "";
  let mailStr = "";
  let delete_ = "";

  getBookName(req, res, function (bookName) {
    getMailList(req, res, function (mailArray) {
      deleteMailList(req, res, function (delete_) {
        if (mailArray.length === 0) {
          return;
        }
        for (let i = 0; i < mailArray.length - 1; i++) {
          mailStr =
            mailStr + mailArray[i].replace(/\s/g, "") + "@illinois.edu, ";
        }

        mailStr =
          mailStr +
          mailArray[mailArray.length - 1].replace(/\s/g, "") +
          "@illinois.edu";
        //console.log("mailStr: " + mailStr);

        const output = `
        <p>One book that you are interested has been posted.</p>
        <h3>Book Details</h3>
        <ul>
          <li>name: ${bookName}</li>
          <li>condition: ${condition}</li>
          <li>price: ${price}</li>
        </ul>
      `;

        var transporter = nodemailer.createTransport(
          smtpTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
              user: "noreplyreadmeagain@gmail.com",
              pass: "whn1234567"
            }
          })
        );

        transporter.set("oauth2_provision_cb", (user, renew, callback) => {
          let accessToken = userTokens[user];
          if (!accessToken) {
            callback(new Error("Unknown user"));
          } else {
            callback(null, accessToken);
          }
        });

        // setup email data with unicode symbols
        let mailOptions = {
          from: '"ReadMeAgain" <noreplyreadmeagain@gmail.com>', // sender address
          to: mailStr, // list of receivers
          subject: "Book available", // Subject line
          text: "Hello world", // plain text body
          html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
      });
    });
  });
}

app.post("/api/email", (req, res) => {
  //console.log("book:" + req.body.isbn);
  //add the netid to transaction, how to write this sql? this is a array!
  let isbn = req.body.isbn;
  if (netid === null) {
    res.send(401)
    return;
  }
  let id = "{" + netid + "}";

  client.query(
    "UPDATE uiuc.book set mailing_list = mailing_list || $1 WHERE isbn = $2  AND $1 NOT IN (mailing_list) OR (mailing_list) IS NULL AND isbn = $2;",
    [id, isbn],
    (err, r) => {
      if (err) {
        throw err;
      } else {
        console.log(netid);
        console.log("add netid to mailing_list, done");
      }
    }
  );
  console.log("tid: " + netid);
});



app.get("/api/prices", (req, res) => {
  let normp = [];
  //let posts = [];
  let option = {};

  console.log("Checking Price");
  const query = {
    text:
      "SELECT ((price-minPrice) / itv)::NUMERIC normp, post_time FROM \
      uiuc.transaction \
      CROSS JOIN \
      (select MIN(groupStat.pri) minPrice, ((MAX(groupStat.pri) - MIN(groupStat.pri))::NUMERIC + 0.001) itv, groupStat.isbn from \
      (SELECT ta.price pri, ta.isbn isbn, ta.post_time from uiuc.transaction AS ta) AS groupStat \
      GROUP BY groupStat.isbn) AS h WHERE h.isbn=uiuc.transaction.isbn ORDER BY post_time",
    values: []
  }
  client.query(query, (err, r) => {


    var groupBy = function (xs, key) {

      if (err) throw err;
      //console.log(r.rows);

      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(parseFloat(x));
        return rv;
      }, {});
    };

    let normp_array = groupBy(r.rows, "normp");
    console.log(Object.keys(normp_array));

    res.send({
      option: {
        title: {
          show: true,
          text: "Book Index",
          left: '40%'
        },
        xAxis: {
          type: 'category',
          data: [],
          name: "Relative Time",
          left: '40%'
        },
        yAxis: {
          type: 'value',
          name: "Relative Price"
        },
        series: [{
          data: Object.keys(normp_array),
          type: 'line'
        }]
      }
    });
  }
  )
})


app.get("/api/sold", (req, res) => {
  const query = {
    text: "SELECT count(*)::NUMERIC AS value, uiuc.book.name AS name FROM uiuc.transaction, uiuc.book WHERE sellerid = $1 AND buyerid IS NOT NULL AND uiuc.transaction.isbn = uiuc.book.isbn GROUP BY uiuc.book.name;",
    
    values: [netid]//values: [req.query.id]
  };

  client.query(query, (err, r) => {
    console.log(Object.keys(r.rows))
    res.send({
      option: {
        backgroundColor: '#FAFAFA',

        title: {
          text: 'Sold Book',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#000000'
          }
        },

        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 0,
          max: 6,
          inRange: {
            colorLightness: [0.1, 1]
          }
        },
        series: [
          {
            name: 'Book',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: r.rows
            .sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(10, 10, 10, 0.5)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(10, 10, 10, 0.5)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#2196F3',
                shadowBlur: 150,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      }
     });
  }
)
})


app.get("/api/bought", (req, res) => {
  const query = {
    text: "SELECT count(*)::NUMERIC AS value, uiuc.book.name AS name FROM uiuc.transaction, uiuc.book WHERE buyerid = $1 AND sellerid IS NOT NULL AND uiuc.transaction.isbn = uiuc.book.isbn GROUP BY uiuc.book.name;",
    values: [netid]//values: [req.query.id]
  };

  client.query(query, (err, r) => {
    console.log(Object.keys(r.rows))
    res.send({
      option: {
        backgroundColor: '#FAFAFA',

        title: {
          text: 'Bought Book',
          left: 'center',
          top: 0,
          textStyle: {
            color: '#000000'
          }
        },

        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
          show: false,
          min: 0,
          max: 6,
          inRange: {
            colorLightness: [0.1, 1]
          }
        },
        series: [
          {
            name: 'book',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: r.rows
            .sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(10, 10, 10, 0.5)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(10, 10, 10, 0.5)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#2196F3',
                shadowBlur: 150,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      }
     });
  }
)
})

app.listen(port, () => console.log(`Listening on port ${port}`));
