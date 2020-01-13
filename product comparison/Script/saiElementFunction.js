$(document).bind('sai_LoadFinish', function(event) {

    //detail
    //////////////////////////checkbox////////////////////
    $('.Feature_Small_CheckBox').checkboxradio({
        icon: true
    }).each(function() {
        pack = featuresPackage[$(this).attr('featureName')]
        checkName = $(this).attr('checkName')
        valueID = $(this).attr('valueID')

        dat = pack["DataSet"][valueID]
        select = dat.select;
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
            $(document).trigger('sai_FilterChanged');
        })

    });

    ///////////////////////////slide bar///////////////////
    $(".Feature_Detail_SlideBar").slider({
        range: true,
    }).each(function() {
        pack = featuresPackage[$(this).attr('name')]

        min = Math.floor(pack['range'][0])
        max = Math.floor(pack['range'][1] - 0.1) + 1
        unit = pack['unit']
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
            $(document).trigger('sai_FilterChanged');
        })
    });

    //background
    $('.Feature_Detail_BK_Class').addClass('ui-corner-bottom').hide()


})