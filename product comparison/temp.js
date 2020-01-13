//<a class=item target=_blank href="/cameras/{ID}"><div><h2>{ATT_BASE_NAME}</h2><span>{ATT_SENSOR_RESOLUTION} MP</span> <span>Released {ATT_RELEASE_MONTH}</span></div></a>
var s = chart_item_template;

var m = s.match(/{[a-z_]+}/gi);
//(4) ["{ID}", "{ATT_BASE_NAME}", "{ATT_SENSOR_RESOLUTION}", "{ATT_RELEASE_MONTH}"]

for (var i = 0; i < m.length; i++) {
    var rp = m[i].replace(/^{|}$/g, '').toLowerCase();
    s = s.replace(m[i], o[rp]);
}

e = $(s)[0];
e.id = "id" + item_id; //????
this.container.appendChild(e);