var allFoldedData = {}
var allData = {}
var featureGroup = {}

var featuresPackage = {}
var comparePackage = {}
var compareNumberFeature={}
var compareBooleanFeature={}

$(document).bind('saiEvent-Init',function(event){
    $.ajax({
    url: '/LoadFeature',
    type: 'POST',
    data: {
        'cmd': 'Fetch All Data'
    },
    success: function(data) {
        allFoldedData = data['allFoldedData']
        allData = data['allData']
        featureGroup = data['FeatureGroup']
        featuresPackage = data['featuresPackage'] 
        comparePackage = data['ComparePackage'] 
       compareNumberFeature=data['CompareNumberFeature']
       compareBooleanFeature=data['CompareBooleanFeature']
        Event_CommunicationFinish()  
    }
});
    
})
