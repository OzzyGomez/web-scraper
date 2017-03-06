/*
 * Required
 */ 
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var process = require('process');
var Q       = require('q');

/*
 * Set up fs to read and write, change file as needed to read or write different files
 */
var urls = fs.readFileSync('urls.txt', 'utf8').trim().split('\n');
var jsonStream = fs.createWriteStream("output.json");

/*
 * Global Variables
 */
var counter = 0;
var articles = new Object();

/*
 * Main Page Scraping Function
 */
function scrapePage(url) {
  var deferred = Q.defer();
  request(url, function(error, response, html) {
    if (error) {
      deferred.reject(error);
    } else {
      /*
       * Setup Variables
       */
      var json = { url: "", title : "", date : "", author: "", reference: "",  content : "" , images : "" };
      var title, date, author, reference, content;
      var imgObj = new Object();

      /*
       * Setup Cheerio
       */
      var $ = cheerio.load(html);
      
      /*
       * Add Url To json,
       * If you want the url to be the identifier, change counter to url below
       */
      json.url = url;
      
      /*
       * Get data within title class
       * Change '.title' to the class, id, or tag that contains the articles title
       */
      $('.title').filter(function() {
        var data = $(this);
        title = data.text().trim();
        json.title = title;
      });

      /*
       * Get data within date class
       * Change '.date' to the class, id, or tag that contains the articles date
       */
      $('.date').filter(function() {
        var data = $(this);
        date = data.text().trim();
        json.date = date;
      });

      /*
       * Get data within author class
       * Change '.author' to the class, id, or tag that contains the articles author
       */
      $('.author').filter(function() {
        var data = $(this);
        author = data.text().trim();
        json.author = author;
      });

      /*
       * Get data within reference tag
       * Change '.reference' to the class, id, or tag that contains the articles references
       */
      $('.reference').filter(function() {
        var data = $(this);
        reference = data.text().trim();
        json.reference = reference;
      });

      /*
       * Get data within content class
       * Change '.content' to the class, id, or tag that contains the articles content
       */
      $('.content').filter(function() {
        var data = $(this);
        content = data.text().trim();
        json.content = content;
      });
      
      /*
       * Get data within img tags in the content only
       * Change '.content' to another class, id, or tag to change where the images are grabbed from
       * Or remove the '.content' completely too get all the images on the pages/url
       */
      $('.content img').filter(function() { 
        var data = $(this);
        
        var imgSrcString = data.attr('src'); // the src returnd by output turned into a string
        var imgAltString = data.attr('alt');

        var imgArr = imgSrcString.split("/"); // Array That Splits URL of image using / to later extract image name
        var imgName = imgArr.slice(-1)[0]; // The Object Key

        imgObj[imgName] = {
          'src' : imgSrcString,
          'alt' : imgAltString
        };       

      });

      json.images = imgObj;

      articles[counter] = json;
      counter++;

      process.stdout.write("Resolved: " + counter + "/" + promises.length + "\r");

      deferred.resolve(json);

    }  // End if
  }); // End request

  return deferred.promise;

} // End scrapePage

/*
 * Traverse through urls
 */
console.log("Scraping articles...");
var promises = [];
urls.forEach(url => {
  if (url[0] != "#") {    
    promises.push(scrapePage(url));
  } // End if  
}); // End forEach    

/*
 * Read promises and write to file
 */
Q.allSettled(promises).then(function (results) {
  jsonStream.write(JSON.stringify(articles, null, 4));
  console.log("Extraction complete, check output.json file");
}); // End allSettled