var selectList = {}

//init
$(document).bind('saiEvent-CommunicationFinish', function(event) {
    gird = new SaiGird()

    //get data
    //get filter
    gird.SetData()
    selectList = {}

})

//filter change
$(document).bind('sai_FilterChanged', function(event) {
    gird.FilterData()
    gird.RankData()
    gird.ReSize()
})



//updata size
$(document).bind('sai_RefreshLayout', function(event) {
    width = $(window).width();
    height = $(window).height();
    if (typeof gird == "undefined")
        return
    if (typeof gird.items == "undefined")
        return

    gird.FilterData()
    gird.RankData()
    gird.ReSize()
})

class SaiGird {
    constructor() {
        this.girdElement = $('#RSGird')
        this.prop = ['Preis', 'Maße']
        this.items = []
        this.eleItems = []
        this.minX = 60
        this.minY = 60
        this.girdMatrix = []

        this.temp = LoadTemplate('#template-Item')
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// Recalculate SIZE /////////////////////////////////////////////////////
    ////////////////////////////////////////////c//////////////////////////////////////////////////////////
    ReSize() {
        var width = this.girdElement.width()
        var height = this.girdElement.height()
        var maxNumX = Math.floor(width / this.minX)
        var maxNumY = Math.floor(height / this.minY)
        if (this.items.length < maxNumX) maxNumX = this.items.length
        if (this.items.length < maxNumY) maxNumY = this.items.length
        var collectNx = Math.ceil(this.items.length / maxNumX)
        var collectNy = Math.ceil(this.items.length / maxNumY)

        var maxX = 0
        var maxY = 0
        for (var index = 0; index < this.items.length; index++) {
            var item = this.items[index]
            item.rankCX = Math.floor(item.xRank / collectNx)
            if (item.rankCX > maxX) maxX = item.rankCX
            item.rankCY = Math.floor(item.yRank / collectNy)
            if (item.rankCY > maxY) maxY = item.rankCY
            item.visible = false
        }

        var W = Math.floor(width / (maxX + 1))
        var H = Math.floor(height / (maxY + 1))
        this.eachW = Math.min(W, H)
        this.eachH = Math.min(W, H)
        this.columN = maxX + 1
        this.rowN = maxY + 1

        //console.log('width '+width)
        //console.log('items '+this.items.length)
        //console.log('colum '+this.columN)
        //console.log('row '+this.rowN)

        //Matrix
        this.girdMatrix = []
        for (var i = 0; i < this.rowN; i++) {
            this.girdMatrix[i] = []

            for (var k = 0; k < this.columN; k++) {
                this.girdMatrix[i][k] = "0";
            }
        }
        //Init visible

        for (var k = 0; k < this.eleItems.length; k++) {
            this.eleItems[k].visible = false
        }

        //put 
        var count = 0
        for (var i = 0; i < this.items.length; i++) {
            var gx = this.items[i].rankCX
            var gy = this.items[i].rankCY

            if (this.girdMatrix[gy][gx] == "0") {
                this.girdMatrix[gy][gx] = this.items[i]
                this.items[i].MoveTo = [gx * this.eachW, (this.rowN - gy - 1) * this.eachH]
                this.items[i].visible = true
            } else {
                var [tx, ty] = this.FindClosetPos(gx, gy)
                if (tx != -1) {
                    this.girdMatrix[ty][tx] = this.items[i]
                    this.items[i].MoveTo = [tx * this.eachW, (this.rowN - ty - 1) * this.eachH]
                    this.items[i].visible = true
                    count++
                } else {
                    this.items[i].visible = false
                    break;
                }
            }
        }
        //console.log(count)

        //updata UI 
        var o = {}
        for (var k = 0; k < this.eleItems.length; k++) {
            var item = this.eleItems[k]
            if (!item.visible) {
                //check exist
                var checkEle = $('#' + item.productID + "_Item_LB")
                if (typeof checkEle.html() != "undefined") {
                    checkEle.remove()
                    $('#' + item.productID + "_Item_CB").remove()
                }
                continue;
            }

            o['ID'] = item.productID

            //check exist
            var checkEle = $('#' + item.productID + "_Item_LB")
            if (typeof checkEle.html() == "undefined") {
                //add
                var s = FormatTemplate(this.temp, o)

                var add = $('#RSGird').append(s);

                //function

                var cb = $('#' + item.productID + "_Item_CB")
                var lb = $('#' + item.productID + "_Item_LB")
                cb.checkboxradio({
                    icon: false
                }).on("change", function(e) {
                    var id = $(this).attr('productID')
                    if ($(this).is(":checked")) {
                        if (typeof selectList[id] == 'undefined') {
                            selectList[id] = true
                        } else {
                            selectList[id] = true
                        }
                    } else {
                        if (typeof selectList[id] == 'undefined') {
                            //selectList[id]=false
                        } else {
                            //selectList[id]=false
                            delete selectList[id]
                        }
                    }
                    //console.log(selectList)
                    $(document).trigger('sai_SelectChange');
                })
                if (typeof selectList[item.productID] != 'undefined') {
                    cb.prop('checked', true);
                    cb.checkboxradio('refresh')
                }

                lb.css("background", "rgb(255,255,255) url(\"" + item.img + "\") 50% 50% repeat-x")
                    .animate({ width: this.eachW, height: this.eachH, left: item.MoveTo[0], top: item.MoveTo[1] })

            } else {
                //move 

                $('#' + item.productID + "_Item_LB").css("background", "rgb(255,255,255) url(\"" + item.img + "\") 50% 50% repeat-x")
                    .animate({ width: this.eachW, height: this.eachH, left: item.MoveTo[0], top: item.MoveTo[1] })
            }
        }
    }

    FindClosetPos(gx, gy) {
            var maxDt = 999999
            var tx, ty;
            for (var i = 0; i < this.rowN; i++) {
                for (var k = 0; k < this.columN; k++) {
                    if (this.girdMatrix[i][k] == "0") {
                        var dt = Math.sqrt((i - gy) * (i - gy) + (k - gx) * (k - gx))
                        if (dt < maxDt) {
                            tx = k
                            ty = i
                            maxDt = dt
                        }
                    }
                }
            }
            if (maxDt == 999999) {
                return [-1, -1]
            } else {
                return [tx, ty]
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////GET DATA FROM SOURCE/////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////
    SetData() {
        for (var productID in allData) {
            var value = allData[productID]
            var imgURL = value['image']

            imgURL = imgURL.replace(/[\\]/g, '/')


            var xName = this.prop[0]
            var yName = this.prop[1]

            var x = GetMo(GetNumbers(value[xName])[0])
            var y = GetMo(GetNumbers(value[yName])[0])

            //generate a item
            var newItem = new SaiItem(x, y, xName, yName, imgURL, productID)


            this.eleItems.push(newItem)
        }
    }

    FilterData() {
        this.items = []
        for (var key in this.eleItems) {
            var oneItem = this.eleItems[key]
            var check = this.ApplyFilter(oneItem.productID);

            if (check == true) {
                this.items.push(oneItem)
            }
        }
    }

    RankData() {
        //rank the data
        var rankx = this.items.sort((a, b) => a.x - b.x);
        for (var index = 0; index < rankx.length; index++) {
            var item = rankx[index]
            item.xRank = index
        }
        var ranky = this.items.sort((a, b) => a.y - b.y);
        for (var index = 0; index < rankx.length; index++) {
            var item = ranky[index]
            item.yRank = index
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////Utilize Function////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    ApplyFilter(productID) {
        var productInfo = allData[productID]

        for (var name in featuresPackage) {
            if (name[0] == '#') {
                var compareRange = featuresPackage[name]['value']
                var val = productInfo[name.slice(1)]
                    //console.log(val) 

                var number = GetNumbers(val)[0][0]
                if (number < compareRange[0] || number > compareRange[1])
                    return false
            }
            if (name[0] == '$') {
                var compareRange = featuresPackage[name]['value']
                var dataSet = featuresPackage[name]['DataSet']
                var value = productInfo[name.slice(1)]
                var number = GetMo(GetNumbers(value)[0])
                if (number < dataSet[compareRange[0]].m || number > dataSet[compareRange[1]].m)
                    return false
            }
            if (name[0] == '*') {
                var dataSet = featuresPackage[name]['DataSet']
                var value = productInfo[name.slice(1)]
                for (var id in dataSet) {
                    var ele = dataSet[id]
                    if (ele.name == value) {
                        if (!ele.select)
                            return false
                    }
                }

            }
        }
        return true


    }

    CheckExist(item) {
        for (var i = 0; i < this.items.length; i++) {
            var it = this.items[i]
            if (it.productID == item.productID) {
                return i
            }
        }
        return -1;
    }
    CheckIDExist(productID) {
        for (var i = 0; i < this.items.length; i++) {
            var it = this.items[i]
            if (it.productID == productID) {
                return i
            }
        }
        return -1;
    }

    RemoveItem(productID) {
        var index = this.CheckIDExist(productID)
        this.items = this.items.filter(function(ele) {
            return ele.productID != productID
        })
        var checkEle = $('#' + productID + "_Item_LB")
        if (typeof checkEle.html() != "undefined") {
            checkEle.remove();
        }


        var checkEle = $('#' + productID + "_Item_CB")
        if (typeof checkEle.html() != "undefined") {
            checkEle.remove();
        }
    }
}

class SaiItem {
    constructor(x, y, xName, yName, img, productID) {
        this.x = x
        this.y = y
        this.xName = xName
        this.yName = yName
        this.img = img
        this.productID = productID;
        this.visible = false;
    }
}