//resize window  
var width = 0,
    height = 0,
    midleft = 350,
    midtb = 400;
setInterval(function() {
    if ($(window).width() !== width || $(window).height() !== height) {
        width = $(window).width();
        height = $(window).height();
        $(document).trigger('sai_RefreshLayout');
    }
}, 50);


$(document).bind('sai_RefreshLayout', function(event) {
    width = $(window).width();
    height = $(window).height();
    if (width > 250) {

        $('#sai-AllList').css('width', width + 'px');
        $('#sai-AllList').css('height', height + 'px');
        $('#sai-LeftFeature').css('width', midleft + 'px');
        $('#sai-LeftFeature').css('height', height - 10 + 'px');

        $('#sai-MidDragBar').css('height', height + 'px');

        var rightPart = width - midleft - 25;
        $('#sai-RSPart').css('width', rightPart + 'px');
        $('#sai-RSPart').css('height', midtb + 'px');

        $('#sai-MidTBDragBar').css('width', rightPart + 'px');
        $('#sai-MidTBDragBar').css('left', midleft + 10);

        //recommand part
        $('.y-axis').css('left', midleft + 30 + 'px')
        $('.y-axis').css('top', midtb - 30 + 'px')
        $('.y-axis').css('width', midtb - 60 + 'px')

        $('.x-axis').css('left', midleft + 60 + 'px')
        $('.x-axis').css('top', midtb - 30 + 'px')
        $('.x-axis').css('width', rightPart - 60 + 'px')

        $('#sai-ComparePart').css('width', rightPart + 'px');
        $('#sai-ComparePart').css('height', height - midtb - 15 + 'px');

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

        //checkbox click
        $(".Feature_Head_CB_Class").on("change", function(e) {

            if ($(this).is(":checked")) {
                $(this).next().show("blind", 100);
            } else {
                $(this).next().hide("blind", 100);
            }
        })

    }
})

//shadow
$(".ui-widget-content").addClass("ui-widget-shadow")

//mid drag bar
$("#sai-MidDragBar").draggable({
    axis: "x",
    containment: [150, 0, 450, 1000],
    //containment: [minX,yPosition,maxX,yPosition]
    start: function() {

    },
    drag: function() {
        ui = $(this)
        ui.addClass('saiDragBarDrag')
    },
    stop: function() {

        ui = $("#sai-MidDragBar")
        ui.removeClass('saiDragBarDrag')
        midleft = ui.position().left;
        $(document).trigger('sai_RefreshLayout');



    }
}).css("position", "absolute").css('left', midleft);

//mid tb drag bar
$("#sai-MidTBDragBar").draggable({
    axis: "y",
    containment: [0, 150, 1000, $(window).height()],
    //containment: [minX,yPosition,maxX,yPosition]
    start: function() {

    },
    drag: function() {
        ui = $(this)
        ui.addClass('saiDragBarDrag')
    },
    stop: function() {
        ui.removeClass('saiDragBarDrag')

        ui = $(this)
        midtb = ui.position().top;
        $(document).trigger('sai_RefreshLayout');

    }
}).css("position", "absolute").css('left', midleft).css('top', midtb);