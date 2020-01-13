data = {};

function start(allData, res, params) {
    data = {};

    console.log("catagory_page start");

    HandleParams(allData, params, LoadData);
    res.render('category_page.html', { 'allData': data });
}

function HandleParams(allData, params, callback) {
     //traversing each element of params and store parameters on server
     for (var keyName in params) {
        value = params[keyName];
        data[keyName] = value;
    }
    //get 16hex number in URL parameter
    var filterNumber = params['markeFilter'];
    var keyOfFilter = Object.keys(allData['Marke']);
    var filterNumber1 = params['kategorie'];
    var keyOfFilter1 = Object.keys(allData['Kategorie']);

    //decode 16hex number in URl params,return all key name of selected features
    var nameOfFiltedFeature = parseFilterNumber(filterNumber, keyOfFilter);
    var filtedAllData = generateFilteredAllData(allData, nameOfFiltedFeature,'Marke');
   var nameOfFiltedFeature = parseFilterNumber(filterNumber1, keyOfFilter1);
   var filtedAllData = generateFilteredAllData(filtedAllData, nameOfFiltedFeature,'Kategorie');

    productCount = Object.keys(filtedAllData['Detail']).length;
    data['productCount'] = parseInt(productCount);
    // convert some string to int
    currentPage = parseInt(data['page']);
    pageSize = parseInt(data['showSize']);
    MaxPage = Math.floor(productCount / pageSize) + 1;
    // when requested page is not available
    if (currentPage < 1) {
        currentPage = 1;
        data['page'] = currentPage;
    }
    if (currentPage > MaxPage) {
        currentPage = MaxPage;
        data['page'] = currentPage;
    }

    if (callback) {
        callback(filtedAllData, (currentPage - 1) * pageSize, pageSize);
    }


}

// according to user's filtering condition, generate a new filtered allData

function generateFilteredAllData(allData, nameOfFiltedFeature,oneKey) {
    var filtedAllData = {};
    var newDetail = [];
    var newimageSize_l = [];
    var newimageSize_s = [];
    var splitFiltedPreis=data['preis'].split('-');
    var filtedLeftPreis=parseInt(splitFiltedPreis[0]);
    var filtedRightPreis=parseInt(splitFiltedPreis[1]);
    
    filtedAllData = clone(allData);

    for (i = 0; i < Object.keys(allData['Detail']).length; i++) {
        var featureName = allData['Detail'][i][oneKey];
        var price=parseInt(allData['Detail'][i]['Price']) 
        if (nameOfFiltedFeature.indexOf(featureName) !=-1 && filtedLeftPreis<=price && price<=filtedRightPreis) {
            newDetail.push(allData['Detail'][i]);
            newimageSize_l.push(allData['imageSize_l'][i]);
            newimageSize_s.push(allData['imageSize_l'][i]);

        }
    }
    filtedAllData['Detail'] = newDetail;
    filtedAllData['imageSize_l'] = newimageSize_l;
    filtedAllData['imageSize_s'] = newimageSize_s;
    return filtedAllData;

}
// Load filtered data from a new filtered allData
function LoadData(filtedAllData, startPos, showSize, ) {


    //save all (first picture,description,price,rating )into a list, des,prices,stars
    var list = []
    var descriptions = []
    var prices = []
    var stars = []
    var productids = []
    var endPos = Math.min(startPos + showSize, parseInt(data['productCount']));

    //Load the first picture for displayed products
    for (var i = startPos; i < endPos; i++) {
        var firstProductImage = filtedAllData['imageSize_l'][i][0];
        var productDes = filtedAllData['Detail'][i]['Description'];
        var productPri = filtedAllData['Detail'][i]['Price'];
        var productStr = parseInt(filtedAllData['Detail'][i]['Rating']);

        if (isNaN(productStr))
            productStr = 0;
        list.push(firstProductImage);
        descriptions.push(productDes);
        prices.push(productPri);
        stars.push(productStr);
        productids.push(filtedAllData['Detail'][i]['pk_product_id']);
    }

    //add needed data to data{}
    data['ShowImages'] = list;
    data['BrandImage'] = filtedAllData['BrandImage'];
    data['Marke'] = filtedAllData['Marke'];
    data['Kategorie'] = filtedAllData['Kategorie'];
    data['Descriptions'] = descriptions;
    data['Prices'] = prices;
    data['Stars'] = stars;
    data['productid'] = productids;
}

//parse paramteres encoded by hexcimal to get key name of user's selected feature
function parseFilterNumber(filterNumber, keyOfFilter) {  // keyOfFilter represents  key name of all features with checkbox

    var ret = [];
    bitcount = 0;
    //according to each charNumber to decide which features are selected by user, push selected feature name to ret(array) and return; 
    for (i = 0; i < Math.floor(keyOfFilter.length / 4) + 1; i++) {
        // for example: filterNumber=80000; select each number in this hex number( 8,0,0,0)
        var CharNumber = parseInt(filterNumber[i], 16);
        for (var bit = 0; bit < 4; bit++) {
            currentBit = CharNumber & 8;
            if (currentBit) {
                ret.push(keyOfFilter[bitcount]);
            }
            //throw away the highest bit after shifting left
            CharNumber = (CharNumber << 1) & 15;
            bitcount++;
        }

    }


    //when user select nothing, return key name of all features
    if (ret == "") {
        ret = keyOfFilter;
    }
    return ret;
}

// clone a obj
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }


    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
module.exports.start = start;