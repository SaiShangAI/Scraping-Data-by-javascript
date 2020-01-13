
var fs = require('fs');
var scrap = require("./scraping.js");

// write scraped product information into json2.json file
var result1 = function (pro) {
    s = JSON.stringify(pro);
    fs.writeFile('json2.json', s, 'utf8', function () { });
};

// scrape products data from website
scrap.scraping("https://www.ao.de/l/staubsauger/1/127-57/?pagesize=200", result1);