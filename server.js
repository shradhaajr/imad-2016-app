var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'shradhaajr',
    database: 'shradhaajr',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
    
};

var app = express();
app.use(morgan('combined'));

var poems = {
    'poem-one': {
        title: 'Poem One| JS',
        heading: ' ON THE RED BENCH',
        date: '2016-10-29',
        poets: 'Shradhaa',
        content: `<p>
                        Two friends on a red bench <br>
                        Under the shed <br>
                        Away from the hustle and bustle <br>
                        Of daily school. <br>
                        Listening to silence <br>
                        In all its glorious muteness <br>
                        A ginger cat stalks past <br>
                        Interrupting. <br>
                        Its bottlebrush tail <br>
                        Puffed and straight. <br>
                        A toddler follows <br>
                        Waddling and wide-eyed. <br>
                        He must touch <br>
                        The strange fluffy thing. <br>
                        The friends watch. <br>
                        The cat streaks <br>
                        Up a tree. <br>
                        The toddler tries <br>
                        To follow suit. <br>
                        One friend calls out. <br>
                        She must. <br>
                        The child turns <br>
                        To the next distraction <br>
                        Waddling and wide-eyed. <br>
                         The cat has gone <br>
                        The toddler back to class. <br>
                        And the friends on the red bench <br>
                        Listening to silence. <br>
                    </p>`
    },
    'poem-two': {
        title: 'Poem Two| JS',
        heading: 'READY TO FLY',
        date: '2016-10-29',
        poets: 'Shradhaa',
        content: `<p>
                        Somedays I'd think that I'd grown up<br>
                        Like when I'd have tea not from my cup <br>
                        I'd feel like I could take on the world; <br>
                        My hypothetical wings unfurled; <br>
                        The first time I rode the bus; <br>
                        The last time I cried for naught; <br>
                        I'd felt strangely proud; <br>
                        To have not been cowed; <br>
                        By a world seemingly new. <br>
                        Oh how little I knew! <br>
                        Today when I'm called on stage; <br>
                        To step up and grdaduate; <br>
                        I feel not the erstwhile pride; <br>
                        That my younger self so cherished in blind; <br>
                        Fear and doubt creep slow and slow; <br>
                        I do not wish to grow up anymore. <br>
                        The allure of freedom spent; <br>
                        Has never before been so well rent; <br>
                        Than when we must leave our homes; <br>
                        And forge our way to our own tombs; <br>
                        Despite this ill-felt reluctance; <br>
                        There is a spark of persistnce; <br>
                        Wherein I feel the inexplicable urge; <br>
                        To peep around this closed door; <br>
                        Not minding what may lay ahead; <br>
                        Friend, foe, fortune or debt. <br>
                        And so I lurch forward in style; <br>
                        Still unsure but willing to try; <br>
                        One finger holding on behind; <br>
                        But the rest of me quite ready to fly. <br>
                    </p>`
    },
    'poem-three': {
        title: 'Poem Three| JS',
        heading: 'BEHOLD',
        date: '2016-10-29',
        poets: 'Shradhaa, Taruna, Harini',
        content: `<p>
                        The search for myself keeps me <br>
                        Trekking through the dense foliage. <br>
                        Aching legs and parched throat drain my will; <br>
                        Burning sun crystallizes the sweat on my brow. <br>
                        I remember not the last time I saw the others, <br>
                        Gone are my ties to petty concerns. <br><br>
                        The cool shade beckons to rest my mind and heart; <br>
                        Both awake to the sun lightening the mist. <br>
                        The gentle wind caresses me to life; <br>
                        Reminiscent of the magic I felt as a child. <br>
                        As the forest comes to life, <br>
                        It rekindles the fire to persevere. <br><br>
                        On and on I walk, fierce in my determination <br>
                        To complete the seemingly never ending path. <br>
                        The canopy gives way to a beautiful glen; <br>
                        My heart pounds at the sight of the pristine lake. <br>
                        My legs feel leaden as I venture towards it; <br>
                        Can I dare to behold what I've searched so far for? <br>
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
            <div class="poem">
                <div class="center">
                    <h3>
                        ${heading}
                    </h3>
                    <p>${date.toDateString()}</p>
                    ${content}
                    <p class="poet">${poets}</p>
                </div>
            </div>
            <div class="comment center">
                <textarea id="comment" placeholder="share your opinion!"></textarea>
                 <br/>
                <input type="submit" value="Submit" id="submit_btn">
                <ul id="commentlist" style="list-style-type: none;">
                
                </ul>
            </div>
            <div class="footer center">
                <a href="/">HOME</a>
                <a href="/contents">POETRY</a>
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
    var poemName = req.params.poemName;
    
    pool.query("SELECT * FROM poem WHERE varname = '"+ req.params.poemName + "'", function(err, result) {
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
