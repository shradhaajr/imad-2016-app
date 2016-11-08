var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'shradhaajr',
    database: 'shradhaajr',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
    
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge:  1000 * 60 * 60 * 24* 30 }
}));

function createTemplate (data) {
    var title = data.title;
    var heading = data.heading;
    var date= data.date;
    var poets = data.poets;
    var content = data.content;
    
    var htmlTemplate= `
    <html>
        <head>
            <title>
                ${title}
            </title>
            
            <link href="/ui/style.css" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, intial-scale=1"/>
        </head>
        <body>
            <div class="container center">
                <h3>
                        ${heading}
                </h3>
                <p>${date.toDateString()}</p>
                ${content}
                <p class="poet">BY ${poets}</p>
                <textarea id="comment" placeholder="share your opinion!"></textarea>
                <br/>
                <input type="submit" value="Submit" id="submit_btn">
                <ul id="commentlist" style="list-style-type: none;">
                
                </ul>
                <div class="footer">
                    <a href="/">HOME</a>
                    <a href="/contents">POETRY</a>
                </div>
            </div>
            <script type="text/javascript" src="/ui/main.js">
            </script>
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
               req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username+'! You are now logged in!');    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send(`Successfully logged out<br/><a href='/' style="text-decoration:none;">Return to Home</a> `);
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    //make a select request
    //return a response with the results
    pool.query('SELECT * FROM test', function(err, result) {
        if(err){
            res.status(500).send(err.toString());
        } 
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
  
});

var counter = 0;
app.get('/counter', function(req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/about', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/contents', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contents.html'));
});

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

var comments=[];
app.get('/submit-comment', function(req, res) { //URL: /submit-name?name=xxxx
    //get the name from the request object
    var comment=req.query.comment;
    
    comments.push(comment);
    //JSON: Javascript Object Notation
    res.send(JSON.stringify(comments));
});

app.get('/poetry/:poemName', function(req, res){
    //poemName == poem-one
    //poems[poemName] == {} content object for article-one
    //var poemName = req.params.poemName;
    
    pool.query("SELECT * FROM poem WHERE varname = $1", [req.params.poemName], function(err, result) {
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            if(result.rows.length === 0){
                res.status(404).send('Poem not found');
            }
            else{
                var poemData = result.rows[0];
                res.send(createTemplate(poemData));
            }
        }
    });
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

