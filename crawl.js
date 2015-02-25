var request = require('request')
  , cheerio = require('cheerio')
  , colors = require('colors');

  function Crawler() {
    this.visitedURLs = {};
  }

  Crawler.prototype.crawl = function(url,depth) {
    if (url.indexOf('http://www.somesite.com') === -1) {
      url = 'http://www.somesite.com' + url;
    }

    if (0 == depth || this.visitedURLs[url]) {
      return;
    }

    var self = this;

    request(url, function (err, resp, body) {
      if (err) {
        console.error(err);
      }
      else {

        var $ = cheerio.load(body);
        var cover_bullets = $('.cover').find('.list-plain').length;
        if (cover_bullets > 0) {
          console.log(colors.green(url + ' found ' + cover_bullets));
        }

        self.visitedURLs[url] = true;
        self.crawlURLs(self.getAllURLs(body), depth -1);
      }
    })
  };

  Crawler.prototype.getAllURLs = function(body) {
    var $ = cheerio.load(body);
    var urls = [],href;
    var self = this;
    
    $('a').each(function(i,elem){
      href = $(elem).attr('href');
      if (typeof(href) != 'undefined' && href.indexOf('#')==-1 && href.indexOf('http')==-1 && href != '/' && !self.visitedURLs['http://www.somesite.com/'+url]) {
        urls.push(href);
      }
    });
    return urls;

    //return Array.prototype.slice.call($('a'), 0)
    //  .map(function (link) {
    //    return link.attr("href");
    //  });
  };

  Crawler.prototype.crawlURLs = function(urls, depth) {
    var self = this;
    urls.forEach(function(url){
        if (!self.visitedURLs[url]) {
          self.crawl(url, depth);
        }
    })

  };

  new Crawler().crawl('http://www.somesite.com',4);