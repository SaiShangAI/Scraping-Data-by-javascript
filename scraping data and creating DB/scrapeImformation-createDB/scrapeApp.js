var fs = require('fs');
var scrap = require("./scraping.js");
var DB = require("./DBmanagement.js");
var downLoadImage = require("./downImage.js");



var result1 = function (pro) {

    s = JSON.stringify(pro);
    fs.writeFile('json2.json', s, 'utf8', function () { });
};

DB.connection(function () { });

//scrape product data from website
scrap.scraping("https://www.ao.de/l/staubsauger/1/127-57/?pagesize=200", result1);


