$(document).bind('saiEvent-Init', function(e) {
    layoutPart = new LayoutPart();
})

$(document).bind('saiEvent-CommunicationFinish', function(e) {
    layoutPart.BuildUPUI();
    layoutPart.AddJqueryFunction();
    layoutPart.UpdataUI(); 
})
 
$(document).bind('saiEvent-RefreshLayout', function(e) {
    layoutPart.UpdataUI();
})

$(document).bind('saiEvent-ResizeWindow', function(e) {
    layoutPart.UpdataUI();
})


class LayoutPart {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.midleft = 350;
        this.midtb = 400;
    }

    BuildUPUI() {

        //shadow
        $(".ui-widget-content").addClass("ui-widget-shadow")

    }

    AddJqueryFunction() {

        //mid drag bar
        $("#sai-MidDragBar").draggable({
            axis: "x",
            containment: [150, 0, 450, 1000],
            //containment: [minX,yPosition,maxX,yPosition]
            start: function() {

            },
            drag: function() {
                var ui = $(this)
                ui.addClass('saiDragBarDrag')
            },
            stop: function() { 
                var ui = $("#sai-MidDragBar")
                ui.removeClass('saiDragBarDrag')
                layoutPart.midleft = ui.position().left;
                Event_RefreshLayout(); 
            }
        }).css("position", "absolute").css('left', this.midleft);

        //mid tb drag bar
        $("#sai-MidTBDragBar").draggable({
            axis: "y",
            containment: [0, 150, 1000, $(window).height()],
            //containment: [minX,yPosition,maxX,yPosition]
            start: function() {

            },
            drag: function() {
                var ui = $(this)
                ui.addClass('saiDragBarDrag')
            },
            stop: function() { 
                var ui = $(this)
                ui.removeClass('saiDragBarDrag') 
                layoutPart.midtb = ui.position().top;
               Event_RefreshLayout();

            }
        }).css("position", "absolute").css('left', this.midleft).css('top', this.midtb);
    }

    UpdataUI() {
        var width = $(window).width();
        var height = $(window).height(); 
        if (width > 250) {
            
            var contentHeight=height ;

            $('#sai-AllList').css('width', width + 'px');
            $('#sai-AllList').css('height', contentHeight + 'px');
            $('#sai-LeftFeature').css('width', this.midleft + 'px');
            $('#sai-LeftFeature').css('height', contentHeight + 'px');

            $('#sai-MidDragBar').css('height', contentHeight + 'px');

            var rightPart = width - this.midleft - 25;
            $('#sai-RSPart').css('width', rightPart + 'px');
            $('#sai-RSPart').css('height', this.midtb + 'px');

            $('#sai-MidTBDragBar').css('width', rightPart + 'px');
            $('#sai-MidTBDragBar').css('left', this.midleft + 10);

            //recommand part
            $('.y-axis').css('left', this.midleft + 30 + 'px')
            $('.y-axis').css('top', this.midtb - 30 + 'px')
            $('.y-axis').css('width', this.midtb - 60 + 'px')

            $('.x-axis').css('left', this.midleft + 60 + 'px')
            $('.x-axis').css('top', this.midtb - 30 + 'px')
            $('.x-axis').css('width', rightPart - 60 + 'px')

            $('#sai-ComparePart').css('width', rightPart + 'px');
            $('#sai-ComparePart').css('height', contentHeight - this.midtb -8 + 'px');
        }
    }
}