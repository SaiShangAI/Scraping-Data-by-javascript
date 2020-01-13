//init
$(document).bind('saiEvent-CommunicationFinish', function(event) {

    tabPart = new TabPart()
    contentPart = new ContentPart()
})

//Filter change
$(document).bind('saiEvent-FilterChanged', function(event) {
    //contentPart.GetFilters()
    //contentPart.UpdataUI()
})


$(document).bind('saiEvent-SelectChanged', function(event) {
    //contentPart.GetItems()
    //contentPart.UpdataUI()
})

$(document).bind('saiEvent-AddNewItem', function(event, productid) {
    contentPart.AddNewItem(productid);
})

$(document).bind('saiEvent-DeselectItem', function(event, productid) {
    contentPart.DeselectItem(productid);
})

$(document).bind('saiEvent-AddNewColumn', function(event, columnName) {
    contentPart.AddNewColumn(columnName);
})

$(document).bind('saiEvent-DeselectColumn', function(event, columnName) {
    contentPart.DeselectColumn(columnName);
})


//updata size
$(document).bind('saiEvent-RefreshLayout', function(event) {
    contentPart.UpdataUI()
})

$(document).bind('saiEvent-MenuDelete', function(event, list) {
    contentPart.DeleteSelect(list);
})

////////////////////////////////        TabPart     /////////////////////////////////
class TabPart {
    constructor() {
        this.template = LoadTemplate('#template-Comparison-Tab')
        this.element = $('#Comparison-Tab')
        this.InitUI()
    }
    InitUI() {
        //ADD user select group
        this.AddTabFunction(this.AddATab('Auswählen'), function(n) {
            contentPart.AddSelectColumn(selectFiltersList)
        }, function(n) {

        });

        for (var featureGroupName in featureGroup) {
            this.AddTabFunction(this.AddATab(featureGroupName), function(n) {
                var list = {}
                var all = featureGroup[n]
                for (var index in all) {
                    var name = all[index]
                    list[name] = true;
                }
                contentPart.AddSelectColumn(list)
            }, function(n) {

            });
        }
    }
    AddATab(name) {
        var str = FormatTemplate(this.template, { 'FeatureGroupName': name })
        var pstr = ProcessValue(name)
        this.element.append(str)
        var cb = $('#' + pstr + "_TabIN")
        var lb = $('#' + pstr + "_TabLB")

        cb.checkboxradio({ icon: false })
        lb.removeClass('ui-corner-all').addClass('ui-corner-top');

        return cb;
    }
    AddTabFunction(tab, SelectF, DeselectF) {
        tab.on("change", function(e) {
            var select = $(this).is(":checked")
            var name = $(this).attr('GroupName')
            if (select) {
                SelectF(name)
            } else {
                DeselectF(name)
            }
        })
    }

    UpdataUI() {

    }
}

////////////////////////////////        ContentPart     /////////////////////////////////
class ContentPart {
    constructor() {
        this.slotTemp = LoadTemplate('#template-CompareGirdSlot')
        this.barTemp = LoadTemplate('#template-bar')

        this.table = new Tabulator("#Comparison-Content", {
            layout: "fitColumns", //fit columns to width of table (optional) 
            movableColumns: true,
            layout: "fitColumns",
            height: 500,
            selectable: true,
            rowClick: function(e, row) { //trigger an alert message when the row is clicked

            },
            rowMouseEnter: function(e, row) {
                contentPart.currentRow = row;
            },
        })

        this.table.addColumn({
            title: 'Product',
            field: 'image',
            align: "center",
            width: 100,
            formatter: "image",
            formatterParams: {
                height: "60px",
                width: "60px",
            }
        });
        this.UpdataUI()
    }
    DeleteSelect(productIDList) {
        for (var index in productIDList) {
            var productid = productIDList[index]
            var data = this.table.getData();
            var row = this.table.searchRows("productID", "=", productid);
            row[0].delete();
        }
         this.UpdataNumberRange()
    }
    UpdataUI() {

        var con = parseInt($('#sai-ComparePart').css('height'))
        this.table.setHeight(con - 70)
    }

    AddSelectColumn(list) {
        var columns = this.table.getColumns()
        for (var i = 1; i < columns.length; i++) {
            columns[i].delete()
        }
        for (var column in list) {
            this.AddColumn(column)
        }
        this.UpdataNumberRange()
    }

    AddNewItem(productid) {
        var item = selectList[productid]
        this.table.addData(item)
        this.UpdataNumberRange()

    }
    DeselectItem(productid) {
        var rows = this.table.searchRows("productID", "=", productid);
        rows[0].delete();
        this.UpdataNumberRange()
    }
    AddNewColumn(column) {
        this.AddColumn(column)
        this.UpdataNumberRange()
    }
    DeselectColumn(column) {
        var name = column.replace(/[~!@#$%^&*]/g, '')
        var filedName = ProcessValue(name)
        this.table.deleteColumn(filedName)
        this.UpdataNumberRange()
    }

    UpdataNumberRange() {
        //CompareNumberFeature compareNumberFeature
        //var t0 = performance.now();

        var data = this.table.getData();
        for (var featureName in compareNumberFeature) {

            var min = 999999
            var max = -999999
            for (var index in data) {
                var oneData = data[index]
                if (typeof oneData[featureName] == 'undefined') continue
                var value = oneData[featureName]
                if (value > max) max = value
                if (value < min) min = value

            }
            compareNumberFeature[featureName]['max'] = max
            compareNumberFeature[featureName]['min'] = min
        }

        //updata percent
        for (var featureName in compareNumberFeature) {
            for (var index in data) {
                var oneData = data[index]
                if (typeof oneData[featureName] == 'undefined') continue
                var value = oneData[featureName]
                var max = compareNumberFeature[featureName]['max']
                var min = compareNumberFeature[featureName]['min']
                var percent = 100
                if (max != min)
                    var percent = (value - 0) / (max - 0) * 90 + 10

                var productid = oneData['productID']
                $('.sai-ProgressBar[featurename="' + featureName + '"][productid="' + productid + '"]').animate({ width: percent + '%' }, 500)
            }
        }


        //var t1 = performance.now();
        //console.log("Call took " + (t1 - t0) + " milliseconds.")
    }

    AddColumn(featureName) {
        var showName = featureName.replace(/[~!@#$%^&*]/g, '')
        var filedName = ProcessValue(showName)
        var form = {
            title: showName,
            field: filedName
        }
        if (featureName[0] == '#') {

            form['formatter'] = this.FormatterNumber
            form['formatterParams'] = {
                'featureName': featureName
            }
        }
        if (featureName == '#Kundenbewertung') {
            form['formatter'] = 'star'
            form['accessor'] = this.ChooseValue
        }
        if (featureName[0] == '$') {
            form['field'] += '_str'
            form['sorter'] = this.VectorSorter;
            form['sorterParams'] = { 'featureName': filedName }
        }
        //bool
        if (typeof compareBooleanFeature[filedName] != 'undefined') {
            form['formatter'] = "tickCross"
        }
        this.table.addColumn(form)
    }
    VectorSorter(a, b, aRow, bRow, column, dir, sorterParams) {
        //a, b - the two values being compared
        //aRow, bRow - the row components for the values being compared (useful if you need to access additional fields in the row data for the sort)
        //column - the column component for the column being sorted
        //dir - the direction of the sort ("asc" or "desc")
        //sorterParams - sorterParams object from column definition array
        var featureName = sorterParams['featureName']
        return aRow.getData()[featureName] - bRow.getData()[featureName];

    }
    FormatterNumber(cell, formatterParams, onRendered) {
        //cell - the cell component
        //formatterParams - parameters set for the column
        //onRendered - function to call when the formatter has been rendered
        //onRendered(function(){
        //$(cell.getElement()).sparkline(cell.getValue(), {width:"100%", type:"bar"});
        //} 
        var value = cell.getValue();
        var item = cell.getRow().getData();
        if (typeof value == 'undefined') return ''
        var temp = contentPart.barTemp;
        var featureName = formatterParams['featureName']

        var dat = featuresPackage[featureName]


        featureName = featureName.replace(/[~!@#$%^&*]/g, '')
        temp = FormatTemplate(temp, {
            'value': value.toString(),
            'unit': dat.unit,
            'featureName': ProcessValue(featureName),
            'productID': item['productID']
        })


        return temp;
    }
}