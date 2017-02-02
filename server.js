var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var fs = require('fs');
var validUrl = require('valid-url');
var app = express();
var hbsEngine = exphbs.create();
var csv = require('fast-csv');

// View Engine
var viewsPath = path.join(__dirname, 'public');
app.set('views', viewsPath);
app.engine('handlebars', hbsEngine.engine);
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//SOCIAL NETWORKS
var www = ['www.', ''];
var social_networks = ['facebook.com', 'twitter.com', 'plus.google.com', 'instagram.com', 'pinterest.com']
var protocols = ['http', 'https'];
//ROUTES
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/scrapping', (req, res) => {
    var url = req.query.url,
        website = new Array();
        url = urlformat(url);
    if (validUrl.isUri(url)) {
        request(url, function (error, response, html) {
            // console.log('error: ' + error);
            // console.log('response: ' + response);
            if (!error) {
                website.push(url);
                var $ = cheerio.load(html);
                social_networks.forEach(function (link) {
                    var w = 0, sw2 = true;
                    // console.log('<<<----------------------------------------------------------------->>>');
                    // console.log('>>>link:' + link);
                    // console.log('w:' + w);
                    // console.log('sw2:' + sw2);
                    while (sw2) {
                        if (w > 1) sw2 = false;
                        var proto = 0, sw1 = true;
                        // console.log('<<<link:' + link);
                        // console.log('proto:' + proto);
                        // console.log('sw1:' + sw1);
                        while (sw1) {
                            if (proto > 1) sw1 = false;
                            // console.log('*** ULIMK_search:' + 'a[href^="' + protocols[proto] + '://' + www[w] + link + '"]');
                            var ulink = $('a[href^="' + protocols[proto] + '://' + www[w] + link + '"]').attr('href');
                            // console.log('ULIMK_result:' + ulink);
                            if (ulink == null || ulink === "") {
                                if (proto == 1) {
                                    if (w == 0) {
                                        sw1 = false;
                                        w = +1;
                                    }
                                    else {
                                        website.push("N/A");
                                        sw2 = false
                                    }

                                }
                            } else {
                                website.push(ulink);
                                //console.log('||| website: |||' + website);
                                sw1 = false, sw2 = false;
                            }
                            proto += 1;
                        }
                    }
                });
                res.send(website);
            } else console.log('error: ' + error)
        });
    }
    else {
        console.log('is not a validUrl')
    }
});

app.get('/downloadcsv', (req,res)=>{
    res.download(__dirname + '/social-finders.csv');
});

app.post('/download', (req,res)=>{
    var links = req.body;
    getcsv(links);
    res.download(__dirname + '/social-finders.csv');
});

var getSocial = (html, network) => {
    var net = html.indexOf(network);
    if (net !== -1) {
        var netfin = html.indexOf('>', net) - 1;
        var link = html.substring(net, netfin).substring(6);
        return link;
    }
}

function urlformat(url) {
    if (url.indexOf('http') == -1 ){
        url = 'http://'+url
    }
    return url;
}

function getcsv(elem){  
 var ws = fs.createWriteStream('social-finders.csv');
    csv.write([elem], {headers: true}).pipe(ws);
}

app.listen(process.env.PORT || 8081)
console.log('Magic happens on port 8081');
exports = module.exports = app;
