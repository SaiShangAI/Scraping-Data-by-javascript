var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


//scraping basic information
function scraping(url, callback) {
    var product = {};

    request(url, function (err, response, html) {
        if (!err) {
            var $ = cheerio.load(html);
            var url = [];
            $("#hypTitle").attr("href", function (i, n) {
                url[i] = "https://www.ao.de/" + n;

                if (i > -1) {
                    setTimeout(function () {
                        request(url[i], function (err, response, html) {
                            if (!err) {
                                console.log("Procudt index = " + i);
                                product["product" + i] = {};
                                product["product"+i]["Detailnformation"]={};
                                var $ = cheerio.load(html);


                                // scrape logo
                                var brandlogo = "http:" + $(".brand-logo.--align-left").attr("style").split("(")[1].split(")")[0];
                                product["product" + i]["BrandLogo"] = brandlogo;
                                //scrape description
                                var description = $(".title.--align-left").text();
                                product["product" + i]["Description"] = description;
                                //scrape price
                                var price = $(".price.--align-left").find("span").attr("content");
                                product["product" + i]["Price"] = price;
                                //scrape rating
                                var rating = $(".avgRating").find("span").text();
                                product["product" + i]["Rating"] = rating;
                                //scrape product feature
                                var feature = [];
                                $(".featureBullets").find("li").text(function (index, n) {
                                    feature[index] = n;
                                });
                                product["product" + i]["Feature"] = feature;
                                //scrape image
                                var findImageHtml = $('script[type="application/json"]').html();
                                var images_l = [];
                                var images_s = [];
                                while (true) {
                                    //loop start
                                    var index1 = findImageHtml.indexOf('"large": "');
                                    if (index1 < 0) break;
                                    var findImageHtml = findImageHtml.slice(index1 + 10);
                                    var indexOfComma = findImageHtml.indexOf('",');
                                    var image_l = findImageHtml.substr(0, indexOfComma);
                                    // find thumb picture
                                    index1 = findImageHtml.indexOf('"thumb": "');
                                    findImageHtml = findImageHtml.slice(index1 + 10);
                                    indexOfComma = findImageHtml.indexOf('",');
                                    var image_s = findImageHtml.substr(0, indexOfComma);
                                    //prepare for next loop

                                    findImageHtml = findImageHtml.slice(indexOfComma);

                                    //store result of this loop
                                    images_l.push(image_l)
                                    images_s.push(image_s);

                                    //when is end

                                }
                                product["product" + i]["image_l"] = images_l;
                                product["product" + i]["image_s"] = images_s;
                                // scrape details information
                                var attributeKey = [];
                                var attributeValue = [];
                                key = $(".accordionContentInner").find(".details").text(function (index, n) {
                                    attributeKey[index] = n;
                                });
                                keyValues = $(".accordionContentInner").find(".value").text(function (index, n) {
                                    attributeValue[index] = n;

                                });

                                for (j = 0; j < attributeKey.length; j++) {

                                    product["product"+i]["Detailnformation"][attributeKey[j]] = attributeValue[j];
                                };
                            }
                            else {
                                console.log("url load error!")
                            }
                            callback(product);
                        });
                    }, 100 * i);
                };


            });
        };
    });

};

module.exports = {
    scraping: scraping,

};
