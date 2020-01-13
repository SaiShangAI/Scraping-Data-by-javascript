//init
$(document).bind('sai_LoadFinish', function(event) {
    comp = new Comparison()

})

//Filter change
$(document).bind('sai_FilterChanged', function(event) {

})

//Select Change

$(document).bind('sai_SelectChange', function(event) {
    if (typeof comp == 'undefined') return;

    comp.GetItems()
    comp.UpdataUI()

})


//updata size
$(document).bind('sai_RefreshLayout', function(event) {
    if(typeof comp != "undefined"){

        comp.UpdataUI()
    }
})

class Comparison {
    constructor() {
        this.compareItems = {}
       
        this.element = $('#sai-ComparePart')

        this.tabPart = new TabPart(this)
        this.contentPart=new ContentPart(this)
    }

    GetFeatures() {

    }

    GetItems() {
        if (typeof selectList == 'undefined') {
            console.log('err: selelist nonoe')
            return;
        }
        //add
        for (var productID in selectList) {
            if (typeof this.compareItems[productID] == "undefined") {
                this.compareItems[productID] = {}
            }
        }
        //delete
        for (var productID in this.compareItems) {
            if (typeof selectList[productID] == 'undefined') {
                delete this.compareItems[productID]
            }
        }
        //console.log(this.compareItems)

        //Getting Detail
        for (var productID in this.compareItems) {
            var detail = allData[productID]
            this.compareItems[productID] = detail
        }

    }

    UpdataUI() {
        this.tabPart.UpdataUI();
        this.contentPart.UpdataUI();
    }

}

class TabPart {
    constructor(parent) {
        this.parent = parent
        this.template = LoadTemplate('#template-Comparison-Tab')
        this.element = $('#Comparison-Tab')
        this.InitUI()
    }
    InitUI() {
        //ADD user select group
        str = FormatTemplate(this.template, { 'FeatureGroupName': 'Auswählen' })
        this.element.append(str)

        var cb = $('#Auswählen_TabIN')

        cb.checkboxradio({ icon: false }).prop('checked', true).checkboxradio('refresh')

        for (var featureGroupName in featureGroup) {

            str = FormatTemplate(this.template, { 'FeatureGroupName': featureGroupName })
            featureGroupName = ProcessValue(featureGroupName)
            this.element.append(str)

            var cb = $('#' + featureGroupName + "_TabIN")
            var lb = $('#' + featureGroupName + "_TabLB")

            cb.checkboxradio({ icon: false })

        }

        var lb = $('.Comparison_TabLB').removeClass('ui-corner-all').addClass('ui-corner-top');
    }
    UpdataUI() {

    }
}

class ContentPart{
    constructor(parent){
        this.parent=parent
       
        this.element = $('#Comparison-Content')
    }
    UpdataUI(){
         
    }
}

class ItemPart {
    constructor(parent) {
        this.parent = parent

        this.element = $('#Comparison-Items')
    }
    UpdataUI() {}
}

class FeaturePart {
    constructor(parent) {
        this.parent = parent
    }
    UpdataUI() {}
}

class ValuePart {
    constructor(parent) {
        this.parent = parent
    }
    UpdataUI() {}
}

class SaiSlot{
    constructor(dragAble){
        this.slotTemp = LoadTemplate('#template-CompareGirdSlot')
        this.dragAble=dragAble
    }
}