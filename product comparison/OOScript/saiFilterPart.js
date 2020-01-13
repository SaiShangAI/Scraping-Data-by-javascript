var selectFiltersList = {}

$(document).bind('saiEvent-Init', function(e) {
    filterPart = new FilterPart();
})

$(document).bind('saiEvent-CommunicationFinish', function(e) {

    filterPart.CleanUI()
    filterPart.BuildUPUI()
    filterPart.AddJqueryUI();
    filterPart.AddJqueryFunction();

})

$(document).bind('saiEvent-ResizeWindow', function(e) {
    filterPart.UpdataUI();
})
$(document).bind('saiEvent-RefreshLayout', function(e) {
    //filterPart.UpdataUI();
})

class FilterPart {
    constructor() {
        this.cont = $("#LeftFeature_Content")
    }

    CleanUI() {
        this.cont.empty()
    }

    BuildUPUI() {
        //build up UI 
        for (var name in featureGroup) {
            var fnames = featureGroup[name]
            this.cont.append("<h3>" + name + "</h3>");
            var str = '<div>'
            for (var fn_key in fnames) {
                var f_name = fnames[fn_key]
                var showName = featuresPackage[f_name]['Name']
                str += "<div name='" + f_name + "'>";

                str += this.AddHeader(showName)
                str += this.AddDetail(showName, f_name)

                str += '</div>'

            }
            str += '</div>'
            this.cont.append(str)
        }
    }

    AddJqueryUI() {
        $('.Feature_Small_CheckBox').checkboxradio({
            icon: true
        })
        $(".Feature_Detail_SlideBar").slider({
            range: true,
        })
        $(".accordion").accordion({
            heightStyle: "fill",
            collapsible: true,
        });
        $(".accordion").accordion('refresh');
        //checkbox
        $('.Feature_Head_CB_Class').checkboxradio({
            icon: false,
        });
        //head label
        $('.Feature_Head_LB_Class').removeClass('ui-corner-all').addClass('ui-corner-top')

    }
    UpdataUI() {

        $(".accordion").accordion({
            heightStyle: "fill",
            collapsible: true,
        });
        $(".accordion").accordion('refresh');
    }



    AddJqueryFunction() {
        //checkbox click
        $(".Feature_Head_CB_Class").on("change", function(e) {
            var select = $(this).is(":checked")
            var name=$(this).parent().attr('name');
            if (select) {
                $(this).next().show("blind", 100);
                selectFiltersList[name]  = true
                Event_AddNewColumn(name)
            } else {
                $(this).next().hide("blind", 100);
                if (typeof selectFiltersList[name] != 'undefined') { 
                    delete selectFiltersList[name]
                }
                Event_DeselectColumn(name)
            } 
            Event_FilterChanged()
        })


        //slide bar
        $(".Feature_Detail_SlideBar").each(function() {
            var pack = featuresPackage[$(this).attr('name')]

            var min = Math.floor(pack['range'][0])
            var max = Math.floor(pack['range'][1] - 0.1) + 1
            var unit = pack['unit']
            $(this).slider("option", "min", min)
            $(this).slider("option", "max", max)
            $(this).slider("option", "values", [min, max]);
            //for number
            if (pack['Type'] == 'number') {
                $(this).prev().children('.Feature_Detail_EL_Value').text(min + unit + ' - ' + max + unit)
            }
            //for vector
            if (pack['Type'] == 'vector') {
                $(this).prev().children('.Feature_Detail_EL_Value').each(function(i, e) {
                    if (i == 0) {
                        e.textContent = pack['DataSet'][min].text;
                    } else {
                        e.textContent = pack['DataSet'][max].text
                    }

                })

            }
            $(this).on("slide", function(event, ui) {

                pack = featuresPackage[$(this).attr('name')]

                unit = pack['unit']

                //for number
                if (pack['Type'] == 'number') {
                    $(this).prev().children('.Feature_Detail_EL_Value').text(ui.values[0] + unit + ' - ' + ui.values[1] + unit)
                }
                if (pack['Type'] == 'vector') {
                    $(this).prev().children('.Feature_Detail_EL_Value').each(function(i, e) {
                        if (i == 0) {
                            e.textContent = pack['DataSet'][ui.values[0]].text;
                        } else {
                            e.textContent = pack['DataSet'][ui.values[1]].text
                        }
                    })
                }
            })
            $(this).on("slidestop", function(event, ui) {
                pack = featuresPackage[$(this).attr('name')]
                pack['value'] = ui.values
                    //send refresh event
                Event_FilterChanged()
            })
        });


        //small check box 
        $('.Feature_Small_CheckBox').each(function() {
            var pack = featuresPackage[$(this).attr('featureName')]
            var checkName = $(this).attr('checkName')
            var valueID = $(this).attr('valueID')

            var dat = pack["DataSet"][valueID]
            var select = dat.select;
            if (select) {
                $(this).prop('checked', true);
                $(this).checkboxradio('refresh')
            } else {
                $(this).prop('checked', false);
                $(this).checkboxradio('refresh')
            }

            $(this).on("change", function(event, ui) {
                pack = featuresPackage[$(this).attr('featureName')]
                valueID = $(this).attr('valueID')
                pack["DataSet"][valueID].select = $(this).prop('checked')

                //send refresh event
                Event_FilterChanged()
            })

        });


        //close all 
        //background
        $('.Feature_Detail_BK_Class').addClass('ui-corner-bottom').hide()

    }

    AddHeader(featureName) {
        var str = LoadTemplate('#template-AddHeader')
        str = FormatTemplate(str, { 'featureName': featureName })
        return str
    }

    AddDetail(featureName, fullName) {
        var str = "<div class='Feature_Detail_BK_Class ui-widget-content'>"
        var type = featuresPackage[fullName]['Type'];
        // number add slide bar
        if (type == "number") {
            temp = LoadTemplate('#template-NumberFeature')
            temp = FormatTemplate(temp, { 'fullName': fullName })
            str += temp;
        }
        if (type == 'vector') {
            temp = LoadTemplate('#template-VectorFeature')
            temp = FormatTemplate(temp, { 'fullName': fullName })
            str += temp;
        }


        if (type == "checkbox") {
            str += "<div class='Feature_Detail_EL'>"
            var dataSet = featuresPackage[fullName]['DataSet']
            for (var keyName in dataSet) {
                var name = dataSet[keyName]['name']

                temp = LoadTemplate('#template-CheckBoxFeature')
                temp = FormatTemplate(temp, { 'fullName': fullName, 'name': name, "keyName": keyName })
                str += temp;
            }
            str += "</div>"
        }

        str += "</div>"
        return str;
    }

}