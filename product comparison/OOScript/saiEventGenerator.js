//send Init Event 
$(document).trigger('saiEvent-Init');  

function Event_CommunicationFinish(){
     $(document).trigger('saiEvent-CommunicationFinish');
}

//resize event
var width = $(window).width(),
    height = $(window).height();
    
setInterval(function() {
    if ($(window).width() !== width || $(window).height() !== height) {
        width = $(window).width();
        height = $(window).height();
        $(document).trigger('saiEvent-ResizeWindow'); 
        console.log('Refresh Size ' + width)
   
        
    }
}, 50);

//refresh layout
function Event_RefreshLayout(){
      $(document).trigger('saiEvent-RefreshLayout');
      console.log('RefreshLayout')
}

//filter change
function Event_FilterChanged(){
      $(document).trigger('saiEvent-FilterChanged');

}

//select changed
function Event_SelectChanged(){
     $(document).trigger('saiEvent-SelectChanged');
}

function Event_AddNewItem(productID){
     $(document).trigger('saiEvent-AddNewItem',[productID]);
    
}
function Event_DeselectItem(productID){
     $(document).trigger('saiEvent-DeselectItem',[productID]);   
}
function Event_AddNewColumn(ColumnName){
    
     $(document).trigger('saiEvent-AddNewColumn',[ColumnName]); 
}

function Event_DeselectColumn(ColumnName){   
     $(document).trigger('saiEvent-DeselectColumn',[ColumnName]); 
}


function Event_ChangeAxis(axis,value){   
     $(document).trigger('saiEvent-ChangeAxis',[axis,value]); 
}

function Event_MenuDelete(list){
    $(document).trigger('saiEvent-MenuDelete',[list]); 
}