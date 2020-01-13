var DB = require("./DBmanagement.js");
var fs = require('fs');
var DB = require("./DBmanagement.js");
var downLoadImage = require("./downImage.js");

// download Image into local file
var contents = fs.readFileSync("json2.json");
var jsonContent = JSON.parse(contents);
downLoadImage.loadImage(jsonContent);

// connect DB
DB.connection(function () { });

//  get product information expect image and generate a json file (infor) to store information
function GetProductDetailInfor(product, i) {
    var infor = {};
    var detail = product['Detailnformation'];
    for (var item in detail) {
        infor[item] = detail[item];
    }

    infor['Price'] = product['Price'];
    infor['Rating'] = product['Rating'];
    infor['Feature'] = JSON.stringify(product['Feature']);
    infor['Description'] = product['Description'];

    return infor;
}
// create product table in MYSQL
DB.OperateTable("product", GetProductDetailInfor);

function GetProductBrandImage(product, i) {
    var infor = {};
    var brandUrl = product['BrandLogo'];
    rest = brandUrl.split("/");
    var localUrl = 'Image/BrandLogo/' + rest[rest.length - 1];


    infor['BrandImage'] = localUrl;

    return infor;

}
// create brand table in MYSQL and store brand's local url 
DB.OperateTable("Brand", GetProductBrandImage);

function GetProductImage(product, i) {
    var infor = {};
    var Image_l = product["image_l"];
    var localImage_L_url = [];
    for (var key in Image_l) {
        var spl = Image_l[key].split('/');
        var ImageName = spl[spl.length - 1];
        var url = 'Image/ImageSizeL/product' + i.toString() + '/' + ImageName;
        localImage_L_url.push(url);
    }
    infor["imageSize_l"] = JSON.stringify(localImage_L_url);

    var Image_s = product["image_s"];
    var localImage_S_url = [];
    for (var key in Image_s) {
        var spl = Image_s[key].split('/');
        var ImageName_s = spl[spl.length - 1];
        var url = 'Image/ImageSizeS/product' + i.toString() + '/' + ImageName_s;
        localImage_S_url.push(url);
    }
    infor["imageSize_s"] = JSON.stringify(localImage_S_url);


    return infor;
}
// create ProductImage table in MYSQL and store ProductImage's local url 
DB.OperateTable("ProductImage", GetProductImage);