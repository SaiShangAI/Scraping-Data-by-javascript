var express = require("express");
var port = 1200;
var app = express();
var bodyParser = require("body-parser");
var url = require('url');
var path = require('path');
var js = require('./JSONReader.js')
var config = require('./Config.js')

//SETTING
app.use(express.static(path.join(__dirname, './')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//start listen port 1200
app.listen(port, function() {
    console.log("server runs on port " + port);

});

app.get('/', function(req, res) {
    res.render('mypage.html')
})

app.post('/LoadFeature', function(req, res) {
    var dat = req.body
    if (dat['cmd'] == 'Fetch All Data') {
        pack = {}
        pack['allFoldedData'] = allFoldedData;
        pack['FeatureGroup'] = config.FeatureGroup;
        pack['FeatureUnit'] = config.FeatureUnit;
        pack['allData'] = allData;
        pack['featuresPackage'] = featuresPackage;
        pack['ComparePackage'] = ComparePackage;
        pack['CompareNumberFeature'] = CompareNumberFeature;
        pack['CompareBooleanFeature'] = CompareBooleanFeature;
        res.send(pack);
    }
    console.log(dat)
})

//load data
var allData = {}
var allFoldedData = {}
var featuresPackage = {}
var ComparePackage = {}
var CompareNumberFeature = {}
var CompareBooleanFeature = {}
var featureGroup = config.FeatureGroup;
var featureUnit = config.FeatureUnit

LoadData();

function LoadData() {
    var [dat, count] = js.Read('json2.json');

    groupNames = config.FeatureGroup
    for (var keyname in dat) {
        product = dat[keyname]

        //brandLogo
        h_brandlogo = product['BrandLogo']
        index = h_brandlogo.lastIndexOf('/')
        brandname = h_brandlogo.slice(index + 1)
        product['BrandLogo'] = path.join(config.Local_Image_Brand_Path, brandname)

        //image_l
        image_l = product['image_l']
        for (var imageIndex in image_l) {
            oneImage = image_l[imageIndex]
            index = oneImage.lastIndexOf('/')
            image = oneImage.slice(index + 1)
            image_l[imageIndex] = path.join(config.Local_Image_M_Path, keyname, image)

        }

        //image_s
        image_s = product['image_s']
        for (var imageIndex in image_l) {
            oneImage = image_s[imageIndex]
            index = oneImage.lastIndexOf('/')
            image = oneImage.slice(index + 1)
            image_s[imageIndex] = path.join(config.Local_Image_S_Path, keyname, image)

        }

        //Create New Data Set
        var detail = product['Detailnformation']
        detail['Preis'] = product['Price']
        detail['Kundenbewertung'] = product['Rating']
        detail['Eigenschaften'] = product['Feature']

        detail['name'] = product['Detailnformation']['Handelszeichen des Lieferanten (Marke)']
        detail['description'] = product['Description']
        detail['image'] = product['image_s'][0]

        allData[keyname] = detail
        allFoldedData[keyname] = {}
            //collect feature product
        c_product = allFoldedData[keyname]

        //collect features data: each group 
        for (var groupName in groupNames) {
            c_product[groupName] = {}
            featureNames = groupNames[groupName]

            //each feature
            for (var index in featureNames) {
                featureName = featureNames[index]
                value = detail[featureName]
                if (config.SpecialSymbolsList.indexOf(featureName[0]) > -1) {
                    value = detail[featureName.slice(1)]
                }
                if (value === undefined) {
                    value = "Nein"
                }
                c_product[groupName][featureName] = value
            }
        }
    }

    BuildUpFeatureData();
    BuildUpCompareData();
}

////////////////////////////////////////////////////////////////////////////////
function BuildUpFeatureData() {

    //build up package for ui element
    for (var groupName in featureGroup) {

        fnames = featureGroup[groupName]
        for (var fn_key in fnames) {
            featureName = fnames[fn_key]
            featuresPackage[featureName] = {}

            featuresPackage[featureName]['Group Name'] = groupName
            featuresPackage[featureName]['Name'] = featureName;
            featuresPackage[featureName]['Select'] = false;

            //preprocess 
            //number
            if (featureName[0] == '#') {
                featuresPackage[featureName]['Name'] = featureName.slice(1);
                var [min, max] = CalculateMinMax1(featureName, groupName);
                featuresPackage[featureName]['Type'] = 'number'
                featuresPackage[featureName]['range'] = [min, max]
                featuresPackage[featureName]['value'] = [min, max]
                featuresPackage[featureName]['unit'] = featureUnit[featureName.slice(1)]
            }

            //vector
            if (featureName[0] == '$') {
                featuresPackage[featureName]['Name'] = featureName.slice(1);
                unit = featureUnit[featureName.slice(1)];
                var [min, max, dataSet, dimension] = CollectVectors(featureName, groupName, unit)
                featuresPackage[featureName]['Type'] = 'vector'
                featuresPackage[featureName]['Dimension'] = dimension
                featuresPackage[featureName]['DataSet'] = dataSet
                    //here the value is index of array
                featuresPackage[featureName]['range'] = [0, dataSet.length - 1]
                featuresPackage[featureName]['value'] = [0, dataSet.length - 1]
                featuresPackage[featureName]['unit'] = unit
            }

            //checkbox
            if (featureName[0] == '*') {
                featuresPackage[featureName]['Name'] = featureName.slice(1);
                dataSet = CollectSame(featureName, groupName);
                featuresPackage[featureName]['DataSet'] = dataSet;
                featuresPackage[featureName]['Type'] = 'checkbox'
            }



        }

    }
}

function BuildUpCompareData() {
    for (var productID in allData) {
        //console.log(productID)
        ComparePackage[productID] = {}
        for (var featureName in allData[productID]) {
            var feature = allData[productID][featureName]
                //process feature
            feature = ProcessFeature(feature, featureName)
                //
            var showName = featureName.replace(/[~!@#$%^&*]/g, '');
            featureName = ProcessValue(featureName)
            if (typeof feature['CompareValue'] != 'undefined') {
                ComparePackage[productID][featureName] = feature['CompareValue']
                ComparePackage[productID][featureName + '_str'] = feature['StringValue']
                if (feature['Type'] == 'Number' || feature['Type'] == 'Vector')
                    CompareNumberFeature[featureName] = { 'showName': showName, 'max': -999999, 'min': 999999 };
                if (feature['Type'] == 'Boolean')
                    CompareBooleanFeature[featureName] = {};
            } else {
                ComparePackage[productID][featureName] = feature['StringValue']


            }
        }
        ComparePackage[productID]['productID'] = productID
    }

    //console.log(ComparePackage)
}

function ProcessFeature(featureValue, featureName) {

    //find featureName in special list
    var find = false
    var type = ''
    for (var groupName in config.FeatureGroup) {
        var featureNames = config.FeatureGroup[groupName];
        for (var index in featureNames) {
            name = featureNames[index].replace(/[~!@#$%^&*]/g, '')

            if (name == featureName) {
                find = true
                type = featureNames[index][0]
                break;
            }
        }
        if (find) break;
    }

    if (!find) {


        return { 'CompareValue': undefined, 'StringValue': featureValue, 'Type': 'String' };
    }
    //first special symbol: 
    //# this is number
    //$ is for vector 
    //* is for checkbox
    //number
    if (type == '#') {
        var number = GetMo(GetNumbers(featureValue)[0])
        return { 'CompareValue': number, 'StringValue': featureValue, 'Type': 'Number' }
    }
    //vector
    if (type == '$') {
        var number = GetMo(GetNumbers(featureValue)[0])
        return { 'CompareValue': number, 'StringValue': featureValue, 'Type': 'Vector' }

    }
    //cb
    if (type == '*') {
        if (featureValue == 'Ja') {
            featureValue = { 'CompareValue': true, 'StringValue': featureValue, 'Type': 'Boolean' }
            return featureValue
        }
        if (featureValue == 'Nein') {
            featureValue = { 'CompareValue': false, 'StringValue': featureValue, 'Type': 'Boolean' }
            return featureValue
        }
    }



    return { 'CompareValue': undefined, 'StringValue': featureValue, 'Type': 'String' };
}


function CalculateMinMax1(featureName, groupName) {
    min = 999999.0
    max = -999999.0
    for (var productID in allFoldedData) {
        value = allFoldedData[productID][groupName][featureName];

        //GetNumbers('Ma: 10.58 cm  *   8,33cm')
        var [nums, units] = GetNumbers(value)
        if (nums[0] < min) {
            min = nums[0]
        }
        if (nums[0] > max) {
            max = nums[0]
        }
    }
    return [min, max]
}

//process vector
function CollectVectors(featureName, groupName, unit) {
    dataSet = []
    min = 999999.0
    max = -999999.0
    dimension = 0

    dat = {}
    for (var productID in allFoldedData) {
        value = allFoldedData[productID][groupName][featureName];
        var [nums, units] = GetNumbers(value)

        di = nums.length;
        if (dimension == 0) {
            dimension = di
        }
        if (di != dimension) {
            console.log('data not much diemension:' + productID)
        }
        dat = {}
        dat['dat'] = nums

        dat['m'] = GetMo(nums)

        if (m < min) {
            min = m
        }
        if (m > max) {
            max = m
        }
        dataSet.push(dat)
    }

    dataSet = dataSet.sort(compare)
    for (var item in dataSet) {
        str = ""
        for (var i = 0; i < dataSet[item]['dat'].length; i++) {
            value = dataSet[item]['dat'][i]
            str += value + ' ' + unit + ' * '
        }
        dataSet[item]['text'] = str.substring(0, str.length - 3)
    }
    return [min, max, dataSet, dimension]
}

function compare(a, b) {
    if (a.m < b.m)
        return -1;
    if (a.m > b.m)
        return 1;
    return 0;
}

//collect all same feature
function CollectSame(featureName, groupName) {

    dataSet = []

    for (var productID in allFoldedData) {
        value = allFoldedData[productID][groupName][featureName];

        dat = {}
            //find exist
        findExists = false;
        var id;
        for (id = 0; id < dataSet.length; id++) {
            var datValue = dataSet[id]

            if (datValue['name'].toLowerCase() == value.toLowerCase()) {
                findExists = true
                break;
            }
        }
        if (findExists) {
            dataSet[id]['count']++;
            continue;
        } else {
            dat['name'] = value
            dat['count'] = 1
            dat['select'] = false
            dataSet.push(dat)
        }

    }

    dataSet = dataSet.sort(comapre2);
    return dataSet;
}

function comapre2(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}


function GetMo(nums) {
    sum = 0
    for (var i in nums) {
        num = nums[i]
        sum += num * num;
    }
    m = Math.sqrt(sum)
    return m
}

function GetNumbers(str) {
    nums = []
    units = []
    if (typeof str == 'undefined' || str == "Nein") {
        return [
            [0],
            ['']
        ]
    }

    numStack = ""
    unitStack = ""
        //finding first number position
    for (var i = 0; i < str.length; i++) {
        c = str[i]
        test = parseInt(c)
        if (isNaN(test)) {
            continue
        }
        str = str.slice(i)
        break;
    }
    currNum = true;
    //reading
    numCount = 0
    unitCount = 0
        //, to .
    str = str.replace(new RegExp(',', 'g'), '.')
    str = str.replace(/\s+/g, '')
    for (var i = 0; i < str.length; i++) {
        c = str[i]
        test = !isNaN(parseInt(c)) || c == '.';
        //is number
        if (currNum) {
            if (test) {
                numStack += c;
            } else {
                currNum = false;
                //to number
                nums[numCount++] = parseFloat(numStack);
                numStack = ""

                //record
                unitStack = c
                continue;
            }
        }
        //is not number
        if (!currNum) {
            if (!test) {
                unitStack += c;
            } else {
                currNum = true;


                unitStack = unitStack.replace('*', '')
                unitStack = unitStack.replace('-', '')
                units[unitCount++] = unitStack;
                unitStack = ""

                //record
                numStack = c
                continue
            }
        }
    }
    if (currNum) {
        if (numStack.length > 0)
            nums[numCount++] = parseFloat(numStack);
    } else {
        if (unitStack.length > 0)
            units[unitCount++] = unitStack;
    }

    return [nums, units]

}

function ProcessValue(str, rep = '_') {
    str = str.replace(/[!@#$%^&*()+-.,öÖäÄüÜ~ß´\/\s]/g, rep)
    return str
}