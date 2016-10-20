var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var poems = {
    'poem-one': {
        title: 'Poem One| JS',
        heading: ' ON THE RED BENCH',
        poets: 'Shradhaa',
        content: `<p>
                        
                    </p>`
    },
    'poem-two': {
        title: 'Poem Two| JS',
        heading: 'READY TO FLY',
        poets: 'Shradhaa',
        content: `<p>

                    </p>`
    },
    'poem-three': {
        title: 'Poem Three| JS',
        heading: 'BEHOLD',
        poets: 'Shradhaa, Taruna, Harini',
        content: `<p>
                        
                    </p>`
    }
};

function createTemplate (data) {
    var title = data.title;
    var heading = data.heading;
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
            <div class="container">
                <div>
                    <h3>
                        ${heading}
                    </h3>
                    ${content}
                    <p class="poet">${poets}</p>
                </div>
                <div class="footer center">
                    <a href="/">HOME</a>
                    <a href="/contents">POETRY</a>
                </div>
            </div>
            
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
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

var names=[];
app.get('/submit-name', function(req, res) { //URL: /submit-name?name=xxxx
    //get the name from the request object
    var name=req.query.name;
    
    names.push(name);
    //JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/:poemName', function(req, res){
    //poemName == poem-one
    //poems[poemName] == {} content object for article-one
    var poemName = req.params.poemName;
    res.send(createTemplate(poems[poemName]));
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
