(function () {
    'use strict';

    var OfflineDirectives = angular
        .module('OfflineDirectives', ['ng']);


    OfflineDirectives.directive('fileRead', function () {
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                onFileLoad: "=?"
            }
        };
        return directive;

        function link(scope, element, attributes) {

            element.bind("change", function (changeEvent) {
                if(element[0].files.length < 1)
			         return; 
                scope.$apply(function () {
                     
                    scope.onFileLoad(element[0].files);
                    element.val('');
                    // $timeout($apply(), 10);
                });

            });

            scope.$on('$destroy', function () {
                scope = null;
            })
        }
    });



    OfflineDirectives.directive('wrapCsvImport', function () {
        return {
            restrict: "A",
            scope: {
                callback: '=?'
            },
            template: '<ng-csv-import \
                        md-button-title="{{csv.mdButtonTitle}}"\
                        md-button-class="{{csv.mdButtonClass}}"\
                        md-input-class="{{csv.mdInputClass}}"\
                        accept ="csv.accept"\
                        material \
                        header="csv.header" \
                        separator="csv.separator"\
                        result="csv.result"\
                        callback="csv.onUpload">\
                        </ng-csv-import>',
            link: function (scope, element, attrs) {

                element.find('input[type=file]').on('change', function () {
                    $().blockPage(true);
                })

                scope.csv = {
                    mdButtonTitle: "Import CSV",
                    mdButtonClass: "btn btn-primary mA0",
                    mdInputClass: "hide mA0",
                    accept: ".csv",
                    result: null,
                    header: true,
                    separator: ",",
                    onUpload: function (iData) {
                        var csvData = angular.copy(scope.csv.result);
                     
                        element.find('input[type=file]').val('');
                        $().blockPage(false);
                        scope.callback(JSON.stringify(csvData), "csv", scope.csv.result.filename);
                        
                    }
                };

                scope.$on('$destroy', function () {
                    scope = null;
                });
            }
        };
    });

    OfflineDirectives.directive('ctrlPasteBtn', ['$compile', 'R1Util', function ($compile, R1Util) {
        return {
            restrict: "A",
            scope: {
                callback: '=?'
            },
            link: function (scope, element, attrs) {

                scope.callbackWrap = function (iDt) {
                    //$("#confirmDlg").find('textarea.pasteMockInput').val(iDt);
                    //$("#confirmDlg").find('textarea').removeClass('hide');
                    //$("#confirmDlg").find('div.pasteInputForm').addClass('hide');
                    $("#confirmDlg").remove();
                    scope.callback(iDt, "copy");
                }

                $('#confirmDlg').on('hidden.bs.modal', function () {
                    //alert(1)
                })

                element.bind("click", function (changeEvent) {
                    $("#confirmDlg").remove();
                    $("confirm-dialogue,error-dialogue,success-dialogue").remove();
                    $(".modal-backdrop").remove();
                    $("body").css("padding-right", "0").removeClass("modal-open");

                    var conf = '<div id="confirmDlg" class="modal modal_C fade fade-scale" role="dialog">\
                    <div class="modal-dialog modal_C-dialog sweet">\
                        <div class="modal-content">\
                            <div class="modal-body">\
                                <div class="text-center">\
                                    <i class="fa fa-paste pasteIcon"></i>\
                                </div>\
                                <p class="text-center"><b>Copy & Paste Excel</b></p>\
                                 <p><div class="form-control formedit pasteInputForm" style=" overflow: hidden; " contenteditable="true" onpastedone="callbackWrap" paste-content>Click here and Ctrl+V to paste data from Excel</div></p><small style=" text-align: center; display: block; font-size: 10px; ">Copy & Paste best works with lesser records. Using large number of records may send the application in unresponding state. </small>\
                            </div>\
                        <div class="modal-footer">\
                            <br>\
                        </div>\
                    </div>\
                </div>';

                    $('body').append($compile(conf)(scope));
                    $("#confirmDlg").modal(true);
                });

                scope.$on('$destroy', function () {
                    $("#confirmDlg").remove();
                    scope = null;
                });
            }
        };
    }]);
    
    //ADDITION BY V START
    OfflineDirectives.directive('uploadExcelFile', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){
                  
                  if(element[0].files.length < 1)
			         return;
                  var tmp_file_name;
                  
                  var fileslen = element[0].files.length;
                  for(var i = 0 ; i < fileslen ; i++)
                  {
                      tmp_file_name = element[0].files[i].name;
                       
                          
                      if(!FileSelectedcheck(tmp_file_name,'.xls,.xlsx,.ods')){
                        scope.createAlert("WarningOk", 'Selected File type is not allowed. Allowed file types are : .xls,.xlsx,.ods', function () {
                             //$scope.dashboard.$submitted = false;
                             //$scope.page("/gstr/error/dashboard");
                         });
                        return false;
                    }
                      
                  }
              
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    scope.fileSelected = true; 
                     scope.uploadFile();
                 });
              });
           }
        };
    }]);
    //ADDITION BY V END 
    
    
    
//<input class="form-control formedit pasteInputForm" onpastedone="callbackWrap" paste-content placeholder="Click here and Ctrl+V to paste data from Excel"/>
    
   


    OfflineDirectives.directive('importExcelFile', function () {
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                onFileLoad: "=?"
            }
        };
        return directive;

        function link(scope, element, attributes) {

            var excelProcessor = function (data) {
                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                var sExcSheets = workbook.SheetNames;
                sExcSheets.splice(0, 1);
                var retData = []

                for (var a = 0, aLen = sExcSheets.length; a < aLen; a++) {
                    var headerNames = XLSX.utils.sheet_to_json(
                        workbook.Sheets[workbook.SheetNames[a]], {
                            header: 1
                        }
                    )[a];


                    var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[a]]);

                    retData.push({
                        section: workbook.SheetNames[a],
                        data: data
                    })
                }

                scope.onFileLoad(retData);
                element.val('');
            };



            element.on('change', function (changeEvent) {
                try {
                    var reader = new FileReader();

                    var binStringCallback = function (evt) {
                        scope.$apply(function () {
                            excelProcessor(evt.target.result);
                        });
                        //   $timeout($apply(), 100);
                    },
                        arrBufferCallback = function (e) {
                            scope.$apply(function () {
                                var binary = "";
                                var bytes = new Uint8Array(e.target.result);
                                var length = bytes.byteLength;
                                for (var i = 0; i < length; i++) {
                                    binary += String.fromCharCode(bytes[i]);
                                }
                                excelProcessor(binary);
                                //   $timeout($apply(), 100);
                            });
                        };


                    if (typeof reader.readAsBinaryString != "undefined") {
                        reader.onload = binStringCallback;
                        reader.readAsBinaryString(changeEvent.target.files[0]);
                    } else {
                        if (element.val()) {
                            reader.onload = arrBufferCallback;
                            reader.readAsArrayBuffer(changeEvent.target.files[0]);
                        }
                    }
                } catch (e) {
                    alert("Feature not supported!");
                }
            });

            scope.$on('$destroy', function () {
                scope = null;
            })
        }
    });


    OfflineDirectives.directive('wrapDirPagination', function () {
        var directive = {
            restrict: 'E',
            template: '<dir-pagination-controls boundary-links="true" on-page-change="pageChangeHandler(newPageNumber)" template-url="uiassets/javascripts/fwk1/dirPagination/dirPagination.tpl.html"></dir-pagination-controls>'
        };
        return directive;
    });
   
 
    OfflineDirectives.directive('wrapDirPaginationSupplier', function () {
        var directive = {
            restrict: 'E',
            template: '<dir-pagination-controls boundary-links="true" on-page-change="pageChangeHandler(newPageNumber)" template-url="uiassets/javascripts/fwk1/dirPagination/dirPagination.tpl.html"  pagination-id="paginationId" ></dir-pagination-controls>'
        };
        return directive;
    });
})();