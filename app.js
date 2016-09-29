var compression = require('compression');
var express = require('express');
var path = require('path');
var http = require('http');
var minifyHTML = require('express-minify-html');
var favicon = require('serve-favicon');
var minify = require('express-minify');
var serveStatic = require('serve-static');

var app = express();

// gzip compress all requests
app.use(compression());
app.use(minify({
  js_match: /js/,
  css_match: /css/,
}));

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifCondHash', function(v1, v2, v3, guess, options) {
  var v4 = v2 + v3;
  if(v1 == v4 && guess == null) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper("last", function(array) {
  return array[array.length-1];
});

app.set('port', (process.env.PORT || 80));

var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 7*oneDay }));

function setCustomCacheControl(res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

app.use(serveStatic(path.join(__dirname , 'public/css/'), {
  maxAge: '7d',
  setHeaders: setCustomCacheControl
}));

app.use(serveStatic(path.join(__dirname, 'public/js/'), {
  maxAge: '7d',
  setHeaders: setCustomCacheControl
}));

app.use(serveStatic(path.join(__dirname, 'public/img/'), {
  maxAge: '7d',
  setHeaders: setCustomCacheControl
}));


app.use(minifyHTML({
  override:      true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

// sections

var home = require('./app/routes/home');
app.use('/', home);

//handle robots.txt requests
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: Googlebot-Image\nDisallow: /\n\nUser-agent: *\nDisallow: ");
});

// favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
  
    res.locals.page_title = "Not Found";
    res.render('404');
  //next(err);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
