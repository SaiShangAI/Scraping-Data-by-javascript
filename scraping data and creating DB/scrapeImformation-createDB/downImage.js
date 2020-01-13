
var request = require('request');
var url = require("url");
var fs = require("fs");

// download image according to url into local file
function DownloadImage(uri, filename, counter, callback) {

    if (uri.indexOf('http:') < 0) {
        uri = 'http:' + uri;
    }

    var encoded = encodeURI(uri);

    setTimeout(function () {
        request(encoded).pipe(fs.createWriteStream(filename)).on('close', callback);
    }, 50 * counter);

};

// load Images----->LOGO PRODUCT IMAGES
module.exports.loadImage = function (para) {
    var url = [];
    var count = 0;
    //load productLogo-image's URL 
    for (i = 0; i < Object.keys(para).length; i++) {
        var n = url.includes(para["product" + i]["BrandLogo"]);
        if (!n) {
            url[count++] = para["product" + i]["BrandLogo"];
        }
    }
    // downloadLogo-Images into local file 
    for (i = 0; i < url.length; i++) {
        rest = url[i].split("/");
        DownloadImage(url[i], './Image/BrandLogo/' + rest[rest.length - 1], 1, function () {
        });

    };
    //loading product's images from product->image_l
    var counter = 0;
    var counter2 = 0;
    for (var item in para) {
        var value = para[item];
        var kvp_image = value['image_l']; // get key

        //get each image
        for (var img in kvp_image) {
            var imageUrl = kvp_image[img];

            var spl = imageUrl.split('/');
            var imageName = spl[spl.length - 1];
            var valid = imageUrl.indexOf('groß');
            if (valid >= 0) {
                var subfolder1 = './Image/ImageSizeL/';
                var subfolder = subfolder1 + item + '/';
                if (!fs.existsSync(subfolder1.toString())) {

                    fs.mkdirSync(subfolder1.toString());
                }
                if (!fs.existsSync(subfolder.toString())) {

                    fs.mkdirSync(subfolder.toString());
                }


                counter = counter + 1;
                DownloadImage(imageUrl, subfolder + imageName, counter, function () {
                    console.log('Download image ' + (counter2++).toString());
                });
            }


        }
    }
    //loading product's images from product->image_s
    for (var item in para) {
        var value = para[item];
        var kvp_image = value['image_s']; // get key
        //get each image
        for (var img in kvp_image) {
            var imageUrl = kvp_image[img];

            var spl = imageUrl.split('/');
            var imageName = spl[spl.length - 1];
            var valid = imageUrl.indexOf('mittel');
            if (valid >= 0) {
                var subfolder1 = './Image/ImageSizeS/';
                var subfolder = subfolder1 + item + '/';
                if (!fs.existsSync(subfolder1.toString())) {

                    fs.mkdirSync(subfolder1.toString());
                }
                if (!fs.existsSync(subfolder.toString())) {

                    fs.mkdirSync(subfolder.toString());
                }

                counter = counter + 1;
                DownloadImage(imageUrl, subfolder + imageName, counter, function () {
                    console.log('Download image ' + (counter2++).toString());
                });
            }


        }
    }
}
