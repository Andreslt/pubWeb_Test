var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var fs = require('fs');
var validUrl = require('valid-url');
var app     = express();
var hbsEngine = exphbs.create();

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
var social_networks =['https://www.facebook.com', 'https://twitter.com', 'https://plus.google.com', 'http://instagram.com', 'https://www.pinterest.com/'  ]

//ROUTES
app.get('/', (req, res)=>{
    res.render('index');
})

app.post('/scrapping', (req, res)=>{
    var url = req.query.url,
    website = new Array();
    if(validUrl.isUri(url)){
        request(url, function(error, response, html){
            if(!error){
                website.push(url);
                var $ = cheerio.load(html);              
                social_networks.forEach(function(link){
                    var ulink = $('a[href^="'+link+'"]').attr('href');
                    if (ulink==null || ulink==="")
                         website.push("N/A");
                    else
                        website.push(ulink);
                });
                res.send(website)
            }else console.log('error: '+error)            
        });
    }
})


var getSocial = (html, network) =>{
    var net = html.indexOf(network);
    if (net!==-1){
        var netfin = html.indexOf('>', net)-1;
        var link = html.substring(net,netfin).substring(6);
        return link;
    }
}

//$('a[href$="https://www.facebook.com"]')

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
