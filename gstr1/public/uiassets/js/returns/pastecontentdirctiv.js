(function() {
    'use strict';
    /* recommended */
    angular
        .module('PS',['ng'])
        .directive('pasteContent', PasteContent);

        PasteContent.$inject = ['$timeout'];

    function PasteContent(timer) {
        var directive = {
            link: link,
            //transclude: true,
            scope : {
                onpastedone : '='
            },
            //template : "paste",
            restrict: 'EA',
        };
        return directive;

        function link(scope, element, attrs) {
            /* */

            element.on("paste", function(e) {
                
                    //scope.$parent.handleLoder(true);

                    handlepaste(this, e);
                });
            

            scope.$on('$destroy', function() {
                scope = null;
            })

            function handlepaste(elem, e) {
                var savedcontent = elem.innerHTML;

                if (e && e.clipboardData && e.clipboardData.getData) { // Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
                    if (/text\/html/.test(e.clipboardData.types)) {
                        elem.innerHTML = e.clipboardData.getData('text/html');
                    } else if (/text\/plain/.test(e.clipboardData.types)) {
                        elem.innerHTML = e.clipboardData.getData('text/plain');
                    } else {
                        elem.innerHTML = "";
                    }
                    waitforpastedata(elem, savedcontent);
                    if (e.preventDefault) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                } else { // Everything else - empty editdiv and allow browser to paste content into it, then cleanup
                    elem.innerHTML = "";
                    waitforpastedata(elem, savedcontent);
                    return true;
                }
            }

            function waitforpastedata(elem, savedcontent) {
                if (elem.childNodes && elem.childNodes.length > 0) {
                    processpaste(elem, savedcontent);
                } else {
                    var that = {
                        e: elem,
                        s: savedcontent
                    }
                    that.callself = function() {
                        waitforpastedata(that.e, that.s)
                    }
                    setTimeout(that.callself, 20);
                }
            }

            function processpaste(elem, savedcontent) {
                var pasteddata = elem.innerHTML;
                //^^Alternatively loop through dom (elem.childNodes or elem.getElementsByTagName) here

                elem.innerHTML = savedcontent;

                // Do whatever with gathered data;
                // console.log(pasteddata);

                convertHtmlToJSON(pasteddata);

            }

            function CSVToArray(r, e) { e = e || ",";
                for (var n = new RegExp("(\\" + e + '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' + e + "\\r\\n]*))", "gi"), a = [
                        []
                    ], g = null; g = n.exec(r);) {
                    var l = g[1];
                    if (l.length && l != e && a.push([]), g[2]) var t = g[2].replace(new RegExp('""', "g"), '"');
                    else var t = g[3];
                    a[a.length - 1].push(t) }
                return a }

            function CSV2JSON(r) {
                for (var e = CSVToArray(r), n = [], a = 1; a < e.length; a++) { n[a - 1] = {};
                    for (var g = 0; g < e[0].length && g < e[a].length; g++) {
                        var l = e[0][g];
                        var indData = e[a][g];
                        
                        // n[a - 1][l] = isNaN(indData) ? indData : parseFloat(indData)
                        n[a - 1][l] = indData

                         } }
                var t = JSON.stringify(n),
                    v = t.replace(/},/g, "},\r\n");
                return v }

            function convertHtmlToJSON(iHtml) {
                var data = $.trim(iHtml);
                
                if (data != "") {
                    // try {
                    var html = $.parseHTML("<div>" + data + "</div>");
                    var cols = [];
                    var content = "",
                        result, csv_data;
                    if ($(html).find('table').length == 0) {
                        // editorAce2.getSession().setUseWorker(false);
                        // editorAce2.setValue("No table found in the html!");
                        return false;
                    }
                    $(html).find('table').find('tr:first').remove();
                    $(html).find('table').find('tr:first').remove();
                    $(html).find('table').find('tr:first').remove();
                    
                    // editorAce2.getSession().setUseWorker(true);
                    $(html).find('table').each(function(index, element) {
                        $(this).find("th").each(function(index, element) {
                            cols.push($(this).text().toLowerCase());
                        });
                    });

                    $(html).find('table').each(function(index, element) {
                        $(this).find("tr").each(function(index, element) {
                            result = [];
                            //var finall=[];
                            $(this).find('td').each(function(index) {
                                var finall=($(this).text()).replace(/\,/g,"");
                                finall = finall.replace('  ', ' ');
                                finall = finall.replace("\n", '');
                                
                                result.push(finall);
                            });
                            
                            //result[3]=finall;
                            content += result.join() + "\n";
                        });
                    });

                    csv_data = $.trim(cols.join() + content);

                    var my_result = (CSV2JSON(csv_data));
                    scope.onpastedone(my_result);
                }

            }
        }
    }

})();
