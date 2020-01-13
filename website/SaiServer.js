var DB = require('./DB.js');
var express = require("express");
var port = 1200;
var app = express();
var bodyParser = require("body-parser");
var url = require('url');
var path = require('path');
var catagory_page = require('./pages/catagory_page.js')
var product_detail_page = require('./pages/product_detail_page.js')

//SETTING
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//pages
app.get('/*.html', function (req, res) {
    var pathname = url.parse(req.url).pathname;
    pathname = pathname.replace('/', '');
    console.log("Request for " + pathname + " received.");
    var params = url.parse(req.url, true).query;
    productid = params['productid'];
    console.log("Request for prodcut " + productid);

    if (pathname == 'product_detail_page.html') {
        product_detail_page.start(allData, res, params);
    } else if (pathname == 'category_page.html') {
        catagory_page.start(allData, res, params);
    } else {
        res.render(pathname);
    }
});

//mainPage 
app.get('/', function (req, res) {
    catagory_page.start(allData, res, {
        'showSize': '12',
        'page': '1',
        'markeFilter': '00000',
        'kategorie': '0',
        'preis': '0-1000',
    });

})

//start listen port 1200
app.listen(port, function () {
    console.log("server runs on port " + port);
});


//DATABASE Loading  
var allData = {}
DB.Connect(afterConnect);

function afterConnect() {
    DB.getCategoryAndAmount("Marke", function (name, dat) {
        allData[name] = dat;
    });
    DB.getCategoryAndAmount("Kategorie", function (name, dat) {
        allData[name] = dat;
    });
    DB.getDetail(function (data) {
        allData['Detail'] = data;
    });

    DB.getImage("imageSize_l", "productimage", saveImageData);
    DB.getImage("imageSize_s", "productimage", saveImageData);
    DB.getImage("BrandImage", "brand", saveBrandImage);
}

// get needed image from table , then load them into front end 
function saveImageData(data, name) {
    //combine all data into object
    ret = {}
    for (var key in data) {
        //get images for one product
        var imagePath = data[key][name];
        var jdata = JSON.parse(imagePath);

        //put the images into object, key is product id(0,1,2,3,4...)
        ret[key] = jdata;
    }
    allData[name] = ret;
}
// get needed image from  brand
function saveBrandImage(data, name) {
    res = []
    for (var key in data) {
        //each path of brand image
        str = data[key][name];
        //find exist
        if (!res.includes(str)) {
            res.push(str);
        }
    }

    allData[name] = res;
}