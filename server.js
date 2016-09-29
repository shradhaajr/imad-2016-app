var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one': {
        title: 'Article One| JS',
        heading: 'Article One',
        date: 'Sep 5 2016',
        content: `<p>
                        This the content for my first article. This the content for my first article. This the content for my first article.
                    </p>
                    <p>
                        This the content for my first article. This the content for my first article. This the content for my first article.
                    </p>`
    },
    'article-two': {
        title: 'Article Two| JS',
        heading: 'Article Two',
        date: 'Sep 10 2016',
        content: `<p>
                        This the content for my second article.
                    </p>`
    },
    'article-three': {
        title: 'Article Three| JS',
        heading: 'Article Three',
        date: 'Sep 15 2016',
        content: `<p>
                        This the content for my third article.
                    </p>`
    }
};

function createTemplate (data) {
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate= `
    <html>
        <head>
            <title>${title}</title>
            <link href="/ui/style.css" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, intial-scale=1"/>
        </head>
        <body>
            <div class="container">
                <div>
                    <a ref="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
                </div>
                <div>
                    ${content}
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

app.get('/about', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/:articleName', function(req, res){
    //articleName == article-one
    //articles[articleName] == {} content object for article-one
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
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
