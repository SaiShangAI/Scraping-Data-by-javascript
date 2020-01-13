var allFoldedData = {}
var allData = {}
var featureGroup = {}

var featuresPackage = {}
    //communicate with server
$.ajax({
    url: '/LoadFeature',
    type: 'POST',
    data: {
        'cmd': 'Fetch All Data'
    },
    success: function(data) {
        allFoldedData = data['allFeatures']
        allData = data['allData']
        featureGroup = data['FeatureGroup']


        featuresPackage = {}
        var cont = $("#LeftFeature_Content")
        try {
            cont.empty()
        } catch (e) {
            //     logMyErrors(e); // Fehler-Objekt an die Error-Funktion geben
            console.log(e);
        }

        //build up package for ui element
        for (var groupName in featureGroup) {

            fnames = featureGroup[groupName]
            for (var fn_key in fnames) {
                featureName = fnames[fn_key]
                featuresPackage[featureName] = {}

                featuresPackage[featureName]['Group Name'] = groupName
                featuresPackage[featureName]['Name'] = featureName;
                //preprocess 
                //number
                if (featureName[0] == '#') {
                    featuresPackage[featureName]['Name'] = featureName.slice(1);
                    var [min, max] = CalculateMinMax1(featureName, groupName);
                    featuresPackage[featureName]['Type'] = 'number'
                    featuresPackage[featureName]['range'] = [min, max]
                    featuresPackage[featureName]['value'] = [min, max]
                    featuresPackage[featureName]['unit'] = data['FeatureUnit'][featureName.slice(1)]
                }

                //vector
                if (featureName[0] == '$') {
                    featuresPackage[featureName]['Name'] = featureName.slice(1);
                    unit = data['FeatureUnit'][featureName.slice(1)];
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

        //build up UI 
        for (var name in featureGroup) {
            fnames = featureGroup[name]
            cont.append("<h3>" + name + "</h3>");
            str = '<div>'
            for (var fn_key in fnames) {
                f_name = fnames[fn_key]
                showName = featuresPackage[f_name]['Name']
                str += "<div name='" + showName + "'>";

                str += AddHeader(showName)
                str += AddDetail(showName, f_name)

                str += '</div>'

            }
            str += '</div>'
            cont.append(str)
        }


        $(document).trigger('sai_LoadFinish');
        $(document).trigger('sai_RefreshLayout');

    }
});

function AddHeader(featureName) {
    str= LoadTemplate('#template-AddHeader')
    str= FormatTemplate(str,{'featureName':featureName})
    return str
}

function AddDetail(featureName, fullName) {
    str = "<div class='Feature_Detail_BK_Class ui-widget-content'>"
    type = featuresPackage[fullName]['Type'];
    // number add slide bar
    if (type == "number" ) {
        temp=LoadTemplate('#template-NumberFeature')
        temp=FormatTemplate(temp,{'fullName':fullName})
        str +=temp;
    }
    if(type=='vector'){
        temp=LoadTemplate('#template-VectorFeature')
        temp=FormatTemplate(temp,{'fullName':fullName})
        str +=temp;
    }
    

    if (type == "checkbox") {
        str += "<div class='Feature_Detail_EL'>" 
        dataSet = featuresPackage[fullName]['DataSet']
        for (var keyName in dataSet) {
            var name = dataSet[keyName]['name']

            temp=LoadTemplate('#template-CheckBoxFeature')
            temp=FormatTemplate(temp,{'fullName':fullName,'name':name,"keyName":keyName})
            str +=temp; 
        } 
        str += "</div>" 
    }

    str += "</div>"
    return str;
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

            if (datValue['name'] == value) {
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
            dat['select'] = true
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
    if(typeof str == 'undefined' || str=="Nein"){
        return [[0],['']]
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

