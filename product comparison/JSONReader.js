var fs = require("fs");


function Read(file) {
    var contents = fs.readFileSync(file);
    var jsonContent = JSON.parse(contents);
    var count= Object.keys(jsonContent).length;
    console.log(count);
    return [jsonContent,count];
}

function GetProduct(jsonContent, productid) {
    var ret;
    var name = 'product' + productid.toString();
    if (jsonContent.hasOwnProperty(name)) {
        ret = jsonContent[name];
        return ret;
    } else {
        console.log("Product" + productid.toString() + " is not existed!");
        return null;
    }
}


function GetAttributeHead(info){
    var head=[];
    var headLength=[];
    for(var one in info){ //one product
        var value = info[one];
        for(var key in value){   //value : imageSize_l imageSize_s
            var v=value[key];
            var l=v.length;
            var index=head.indexOf(key);
            if(head.includes(key)){ 
                var old=headLength[index];
                l=Math.max(old,l);
                headLength[index]=l;
            }else{
                head.push(key);
                headLength.push(l);
            }
        }
    }
    return [head,headLength];
}




module.exports={
    Read:Read,
    GetProduct:GetProduct, 
    GetAttributeHead:GetAttributeHead
}