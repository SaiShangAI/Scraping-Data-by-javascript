$(document).bind('saiEvent-CommunicationFinish', function(event) {
    tooltip = new ToolTip();
    tooltip.BuildUpUI();
})

class ToolTip {
    constructor() {
        this.temp = LoadTemplate('#template-ToolTip')
    }

    BuildUpUI() {
        $(document).tooltip({
            items: "[tooltip]",
            track: true,
             tooltipClass: "custom-tooltip-styling",
            content: function() {
                var element = $(this);
                var productID = element.attr('tooltip');
                var pack = allData[productID];
                var str = FormatTemplate(tooltip.temp, {
                    'img': pack['image'],
                    'Title':pack['description'],
                    'Comparison':'Comparison HTML here'
                })
                return str;

            } 
        })
    }
}