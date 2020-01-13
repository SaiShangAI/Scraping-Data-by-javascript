 $.ajax({
     url: '/template.html',
     success: function(templateContent) {
         templateObj = $($.parseHTML(templateContent))

         //var obj = $($.parseHTML(templateContent)).filter('#template-Item');
     },
     error: function(e) {

     }
 });


 function LoadTemplate(templateName) {
     temp = templateObj.filter(templateName);
     return temp.html();
 }

 function FormatTemplate(template, variables) {

     var m = template.match(/{.[a-z_]+}/gi);
     for (var i = 0; i < m.length; i++) {
         var rp = m[i].replace(/^{|}$/g, '');
         var val
         if (m[i][1] == '~') {
             rp = rp.replace(/~/g, '');
             val = ProcessValue(variables[rp])
         } else {
             val = variables[rp];
         }

         if (val.indexOf(' ') >= 0) {

         }
         template = template.replace(m[i], val);
     }
     return template
 }

 function ProcessValue(str) {
     var m=str.match(/[*&^%$#@]/ );
     str = str.replace(/\s|[*&^%$#@]/g, '_')
     return str
 }