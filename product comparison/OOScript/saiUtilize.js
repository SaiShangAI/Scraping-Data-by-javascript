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
function GetMo(nums) {
    sum = 0
    for (var i in nums) {
        num = nums[i]
        sum += num * num;
    }
    m = Math.sqrt(sum)
    return m
}

 $.ajax({
     url: '/template.html',
     success: function(templateContent) {
         templateObj = $($.parseHTML(templateContent))

         //var obj = $($.parseHTML(templateContent)).filter('#template-Item');
     },
     error: function(e) {

     }
 });


 function LoadTemplate(templateName) {
     temp = templateObj.filter(templateName);
     return temp.html();
 }

 function FormatTemplate(template, variables) {

     var m = template.match(/{.[a-z_]+}/gi);
     for (var i = 0; i < m.length; i++) {
         var rp = m[i].replace(/^{|}$/g, '');
         var val
         if (m[i][1] == '~') {
             rp = rp.replace(/~/g, '');
             val = ProcessValue(variables[rp])
         } else {
             val = variables[rp];
         }
         if(typeof val == 'undefined')
         continue
         if (val.indexOf(' ') >= 0) {

         }
         template = template.replace(m[i], val);
     }
     return template
 }

 function ProcessValue(str,rep='_') { 
    str = str.replace(/[!@#$%^&*()+-.,öÖäÄüÜ~ß´\/\s]/g, rep)
     return str
 }