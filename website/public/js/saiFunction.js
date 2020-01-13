urlParameters = {};

//this is a test

// get freshed URL
function getRefreshUrl(refreshKey, refreshSize) {
    // get current URl
    var url = new URL(window.location.href);
    var host = url.host;
    var protocal = window.location.protocol;

    //set new refreshURL
    newUrl = protocal + '//' + host + '/category_page.html?';

    for (var key in urlParameters) {
        value = urlParameters[key];
        if (key !== refreshKey) {
            newUrl = newUrl + key + '=' + value + '&';
        }
        else {
            newUrl = newUrl + refreshKey + '=' + refreshSize + '&';


        }

    }
    return newUrl;

}
//  HTML(selection-option)----->when use select pageSize,front end will excute this function
function selectPageSize(refreshKey, refreshSize) {

    urlParameters[refreshKey] = parseInt(refreshSize);
    newUrl = getRefreshUrl(refreshKey, refreshSize);
    window.location.href = newUrl;

}

// HTMl(checkbox)---->when use  select checkbox to filter feature, front end  will excute this fucntion

function ClickCheckBox(name) {
    var arr = [];
    var oneGroupNumber = 0;
    var count = 0;

    // get all checkbox which Name='name';
    checkboxs = document.getElementsByName(name);
    //  set selected features is 1 ,undelected feature is 0; a then store into matrix( use 16 Hexadecimal to encode ,so four bits is a group)
    for (i = 0; i < checkboxs.length; i++) {
        oneGroupNumber = oneGroupNumber << 1;
        oneGroupNumber = oneGroupNumber | checkboxs[i].checked;
        count++;
        if (count >= 4) {
            count = 0;
            arr.push(oneGroupNumber); // push 4 bits to oneGroupNumbeer
            oneGroupNumber = 0;

        }
    }

    // if all feature is less four 
    if (count != 0) {
        for (count; count < 4; count++) {
            oneGroupNumber = oneGroupNumber << 1;
        }
        arr.push(oneGroupNumber);

    }
    // turn binary to Hexadecimal
    var result = ''
    for (var i = 0; i < arr.length; i++) {
        result += parseInt(arr[i], 10).toString(16).toUpperCase();

    }
    console.log(result);
    urlParameters[name] = result;
    var newUrl = getRefreshUrl(name, result);
    window.location.href = newUrl;

};

//set selected checkbox to be checked according new slection
function checkedCB(name) {
    checkboxs = document.getElementsByName(name);
    var bitcount = 0;
    var data = urlParameters[name];


    for (var k = 0; k < Math.floor(checkboxs.length / 4 - 0.001) + 1; k++) {
        var charNumber = parseInt(data[k], 16);
        for (i = 0; i < 4; i++) {
            var currentNumber = charNumber & 8;
            if (currentNumber) {
                checkboxs[bitcount].checked = true;
            } else {
                checkboxs[bitcount].checked = false;
            }
            bitcount++;
            charNumber = (charNumber << 1) & 15;
            if (bitcount >= checkboxs.length) {
                break;

            }
        }
    }

}

// when users slide slider bar, the function will be excuted
function slideSliderBar(a, b) {
    $(function () {
        $(a).slider({
            range: true,
            min: 0,
            max: 1000,
            values: [75, 300],
            slide: function (event, ui) {
                $(b).val("€" + ui.values[0] + " - €" + ui.values[1]);

                console.log(ui.values);
            },
            stop: function (event, ui) {
                var newPreisRange = ui.values[0] + '-' + ui.values[1];
                urlParameters['preis'] = newPreisRange;
                var newUrl = getRefreshUrl('preis', newPreisRange);
                window.location.href = newUrl;

            }

        });
        $(b).val("€" + $("#slider-range").slider("values", 0) +
            " - €" + $("#slider-range").slider("values", 1));


    })
}
//when refreh webpage,price slide bar should be refreshed according to 'preis' parameters in url 

function refreshSlideBar(a, b) {
    var preisRange = urlParameters['preis'].split('-');
    var leftPreis = parseInt(preisRange[0]);
    var rightPreis = parseInt(preisRange[1]);
    $(function () {
        $(a).slider('values' ,[leftPreis, rightPreis]);

        $(b).val("€" + $(a).slider("values", 0) +
            " - €" + $(a).slider("values", 1));

    })
}




