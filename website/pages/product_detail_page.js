data={};
function start(allData,res,paras){ 
    data={};
    console.log("product_detail_page start");
    LoadData(paras['productid'],allData);
    res.render('product_detail_page.html',{'data':data});
}
 
module.exports.start=start; 

function LoadData(productid,allData){
    
    img=allData['imageSize_l'][productid];
    data['ProductLImgs']=img;
    data['Price']=allData['Detail'][productid]['Price'];   
  
    data['Description']=allData['Detail'][productid]['Description'];
    productStr=parseInt(allData['Detail'][productid]['Rating']);
    if(isNaN(productStr))
    productStr=0;
    data['Star']=productStr;
    data['Brand']=allData['Detail'][productid]['Marke'];
    data['Feature']=JSON.parse(allData['Detail'][productid]['Feature']);
    data['Detail'] = allData['Detail'][productid];
}