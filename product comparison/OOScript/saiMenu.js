$(document).bind('saiEvent-CommunicationFinish', function(event) {
    menu = new Menu();
    menu.BuildUpUI();
})

class Menu {
    constructor() {

    }
    BuildUpUI() {
        var items = {}
        for (var name in compareNumberFeature) {
            var showName = compareNumberFeature[name]['showName']
            items[showName] = { name: showName }
        }
        $.contextMenu({
            selector: '#y-axis-label',
            trigger: 'left',
            items: items,
            callback: function(itemKey, opt) {
                var name = itemKey;
                var ele = opt.$trigger;
                ele.text(name)

                Event_ChangeAxis(1, name)
                return true;
            }
        });

        $.contextMenu({
            selector: '#x-axis-label',
            trigger: 'left',
            items: items,
            callback: function(itemKey, opt) {
                var name = itemKey;
                var ele = opt.$trigger;
                ele.text(name)
                Event_ChangeAxis(0, name)
                return true;
            }
        });


        $.contextMenu({
            selector: '.tabulator-row',
            trigger: 'right',
            items: {
                'In den Einkaufwagen':{name:'In den Einkaufwagen'},
                'Jetzt Kaufen':{name:'Jetzt Kaufen'},
                'Weiterempfehlen':{name:'Weiterempfehlen'}, 
                 sep1: "---------",

                "Delete": { name: "Löschen" },
                'Delete All': { name: "Alles Löschen" }
            },
            callback: function(itemKey, opt) {
                if (itemKey == 'Delete') {

                    var selected = contentPart.table.getSelectedData()
                    if (selected.length == 0) {
                        selected = [contentPart.currentRow.getData()]
                    }

                    var list = []
                    for (var row in selected) {
                        var productID = selected[row]['productID']
                        list.push(productID)
                    }

                    Event_MenuDelete(list);
                    return true;

                } else if (itemKey == 'Delete All') {
                    var list = []
                    for (var id in selectList) {
                        list.push(id)
                    }
                    Event_MenuDelete(list);
                    return true;
                }
            }
        });
    }
}