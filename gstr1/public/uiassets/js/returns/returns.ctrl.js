"use strict";
myApp.controller("mainctrl", ['$scope', '$rootScope', '$location', '$log', '$timeout', 'utilFunctions', 'g1FileHandler', 'R1Util', 'validations', 'shareData',
    function ($scope, $rootScope, $location, $log, timeout, utilFunctions, g1FileHandler, R1Util, validations, shareData) {
        /* 
            @alert: Code common to all functions can only be written"
          */
        //language 
        utilFunctions.initCache();
        //$scope.servers = $().getServers();
        $scope.trans = utilFunctions.initLanguage('returns');
        $rootScope.$on("LangChanged", function (event, mass) {
            $scope.trans = utilFunctions.initLanguage('returns');
        });

        //page navigation
        $scope.page = function (path) {
            $location.path(path);
        };

        $scope.destroyModal = function () {
            utilFunctions._destroyDialogue();
        };


        R1Util.initMainCntr($scope);
        $scope.validations = validations;
        $scope.initInfo = $rootScope.initInfo;

        $scope.StateList = [];
        $scope.RateList = [];
        $scope.rsnList = [];


        $scope.availableVersion = null;
        $scope.newVersionAvailable = false;
        $scope.checknewVersionFurther = true;
        $scope.download_url = '';

        $scope.currentVersion = "3.1.7"; // UPDATE CHECK - CURRENT VERSION

        //CR#18639- IFF 
        $scope.iffstrtprd = 202101;

        initStateLs();
        initRateList();
        initReasonLs();
        //initVersionCheck(); commenting version check
        initInvTypeList();
        initInvTypeListForB2b();        

        //To get Most Recent Version
        function initVersionCheck() {
            if ($scope.checknewVersionFurther) {
                g1FileHandler.versionCheck().then(function (response) {
                    if (response.gst_offline_tool && response.gst_offline_tool.current_version) {
                        var ver = response.gst_offline_tool.current_version.toString();
                        $scope.download_url = response.gst_offline_tool.download_url;
                        $scope.last_updated = response.gst_offline_tool.last_updated;
                        if (ver > $scope.currentVersion) {
                            $scope.availableVersion = ver;
                            $scope.newVersionAvailable = true;
                        }


                    }

                }, function (response) {
                    $log.debug("mainctrl -> StateList fail:: ", response);
                });
            }
        }

        $scope.closeVersionCheckBtn = function () {
            $scope.newVersionAvailable = false;
            $scope.checknewVersionFurther = false;
            return false;
        }

        $scope.openDownloadWindow = function () {
            if (window.ActiveXObject || "ActiveXObject" in window) {
                var shell = new window.ActiveXObject("WScript.Shell");
                if (shell)
                    shell.run($scope.download_url);

            } else {
                var m = window.open($scope.download_url, 'downloadGSTOfflineTool')

            }
            $scope.closeVersionCheckBtn();

            return false;

        }

        //To get States List
        function initStateLs() {
            g1FileHandler.getStateList().then(function (response) {
                $scope.StateList = response.state;
            }, function (response) {
                $log.debug("mainctrl -> StateList fail:: ", response);
            });
        }

        //To get Reason List
        function initReasonLs() {
            g1FileHandler.getReasonList().then(function (response) {
                $scope.rsnList = response.reason;
            }, function (response) {
                $log.debug("mainctrl -> StateList fail:: ", response);
            });
        }

        //RateList
        function initRateList() {
            g1FileHandler.getRateList().then(function (response) {
                $scope.RateList = response;
            }, function (response) {
                $log.debug("mainctrl -> RateList fail:: ", response);
            });
        }

        function initInvTypeList() {
            g1FileHandler.getInvTypes().then(function (response) {
                $scope.InvTypeList = response;
            }, function (response) {
                $log.debug("mainctrl -> InvTypeList fail:: ", response);
            });
        }
        
        function initInvTypeListForB2b() {
            g1FileHandler.getInvTypesForB2b().then(function (response) {
                $scope.InvTypeListForB2b = response;
            }, function (response) {
                $log.debug("mainctrl -> InvTypeListForB2b fail:: ", response);
            });
        }

        //To Calculate tax amount based on rate n taxable value
        $scope.onRtChange = R1Util.onRtChange;
        $scope.onRtChangeTB15 = R1Util.onRtChangeTB15;

        //pattern for gstin/uin in b2b n cdnr gstr1
        $scope.isValidPattern = function (isNew, ctin, frmName) {
            if (ctin) {
                var patt1 = new RegExp($scope.validations.formats.gstin),
                    patt2 = new RegExp(/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/);
                var isValidPatt1 = patt1.test(ctin),
                    isValidPatt2 = patt2.test(ctin);
            }
            var isValid = (isValidPatt1 || isValidPatt2);

            frmName.ctin.$setValidity('pattern', isValid);
        }

        //To set supplytype based on ctin n pos/state_cd
        $scope.onCtinChange = function (iInv) {
            timeout(function () {
                R1Util.setSuplyTyp($scope.suplyList, iInv, shareData.isSezTaxpayer);
            }, 0)
        
        }

        //To get supply time at begining
        $scope.getSupplyType = function (ctin, pos) {
            return R1Util.getSupplyType($scope.suplyList, ctin, pos);
        }

        //Check all implementation
        $scope.checkAll = function (iLs, iFg) {
            angular.forEach(iLs, function (inv) {
                inv.select = iFg;
            });
        };

        shareData.checkCount = 0;
        $scope.checked = {};
        $scope.checkAllNew = function (iLs, iFg) {
            angular.forEach(iLs, function (inv) {
                inv.select = iFg;
            });
            if(iFg == 'Y')
            shareData.checkCount = iLs.length;
            else
            shareData.checkCount = 0;
        };

        $scope.value = function (checkval, returnList){
            if(checkval == 'Y')
            shareData.checkCount++;
            else
            shareData.checkCount--;
            if(shareData.checkCount == returnList.length)
            $scope.checked.selectall = 'Y';
            else 
            $scope.checked.selectall = 'N';
        }

        //To alert view
        $scope.createAlert = function (iTy, iMsg, iConfirmFn) {
            R1Util.createAlert($scope, iTy, iMsg, iConfirmFn);
        }
    }
]);

myApp.controller("gstrhomectrl", ["$scope", 'shareData', 'g1FileHandler', '$log', function ($scope, shareData, g1FileHandler, $log) {
    shareData.scLsSetIdx = 0;
    $scope.initInfo(null, null, null, null)
    shareData.newHSNStartDateConstant = "052021";
    var GSTR1_HSN_AATO_LENGTH_CHECK_FLAG = 'Y';
    var GSTR1_HSN_CODE_CHECK_IS_ENABLE = 'N';
    shareData.disableAATOLengthCheck = (GSTR1_HSN_AATO_LENGTH_CHECK_FLAG == 'N') ? true : false;
    shareData.disableHSNRestrictions = (GSTR1_HSN_CODE_CHECK_IS_ENABLE == 'N') ? true : false;
    var HSN_DROPDOWN_LGTH_AATO_GRTR_5CR = shareData.HSN_DROPDOWN_LGTH_AATO_GRTR_5CR = 6;
    var HSN_DROPDOWN_LGTH_AATO_LESS_5CR = shareData.HSN_DROPDOWN_LGTH_AATO_LESS_5CR = 4;
    var HSN_VALIDATION_AATO_GRTR_5CR_MIN_LGTH = shareData.HSN_VALIDATION_AATO_GRTR_5CR_MIN_LGTH = 6;
    var HSN_VALIDATION_AATO_LESS_5CR_MIN_LGTH = shareData.HSN_VALIDATION_AATO_LESS_5CR_MIN_LGTH = 4;
    sessionStorage.clear();
    //upload Error File
    $scope.onErrorFileLoad = function (iFileData) {
        var fd = new FormData();

        var tmp_name = iFileData[0].name;
        if (!FileSelectedcheck(tmp_name, '.zip')) {
            $scope.createAlert("WarningOk", 'Selected File type is not allowed. Please upload zip file', function () {
                //$scope.dashboard.$submitted = false;
                //$scope.page("/gstr/error/dashboard");
            });
            return false;

        }

        fd.append('File', iFileData[0]);
        $log.debug("gstrhomectrl -> uploadFile success:: ", fd);

        g1FileHandler.uploadErrFile(fd).then(function (response) {
            $log.debug("gstrhomectrl -> uploadFile success:: ", response);
            // $scope.page("/gstr/error/preview");

            if (sessionStorage) {
                if (response && response.data && response.data.length == 1) {
                    sessionStorage.setItem('ErrorFileDirectory', response.path + "/" + response.filename);
                    sessionStorage.setItem('fileNameData', response.data[0].fp + "_" + response.data[0].gstin);
                    sessionStorage.setItem('ErrorFileName', response.filename);
                    //fetch flag from offline.js to enable disable radio button for IFF
                    sessionStorage.setItem('FlagForIFF', response.flag);
                    $scope.page("/gstr/error/dashboard");
                }
            }

        }, function (response) {
            $log.debug("gstrhomectrl -> uploadFile fail:: ", response);
        });
    }
    //
    $scope.newreturn = function () {
        shareData.isfromhome = "Y";
        $scope.page("/gstr/dashboard");
    }

    $scope.materreturn = function () {
        $scope.page("/gstr/masterdashboard");
    }
    //upload return file downloaded from portal
    $scope.onImportReturnFileLoad = function (iFileData) {
        var fd = new FormData();
        for (var i = 0, len = iFileData.length; i < len; i++) {
            var fileNumber = i + 1;
            var tmp_name = iFileData[i].name;
            if (!FileSelectedcheck(tmp_name, '.zip')) {
                $scope.createAlert("WarningOk", 'Selected File type is not allowed. Please upload zip files', function () {
                    //$scope.dashboard.$submitted = false;
                    //$scope.page("/gstr/error/dashboard");
                });
                return false;
            }
            fd.append("File", iFileData[i]);
            // fd.append("File" + fileNumber, iFileData[i]);
        }
        // fd.append('File', iFileData);
        g1FileHandler.uploadReturnFile(fd).then(function (response) {
            $log.debug("gstrhomectrl -> uploadReturnFile success:: ", response);
            if (sessionStorage) {
                if (response && response.data && response.data.length == 1) {
                    sessionStorage.setItem('ReturnFileDirectory', response.path + "/" + response.filename);
                    sessionStorage.setItem('ReturnFileData', response.data[0].fp + "_" + response.data[0].gstin);
                    sessionStorage.setItem('ReturnFileName', response.filename);
                    //fetch flag from offline.js to enable disable radio button for IFF
                    sessionStorage.setItem('FlagForIFF', response.flag);
                    $scope.page("/gstr/upload/dashboard");
                }
            }

        }, function (response) {
            $log.debug("gstrhomectrl -> uploadReturnFile fail:: ", response);
        });
    }

    //Upload Json for my master
    $scope.handleFilecall = function (iFileData) {

        var fd = new FormData();
        for (var i = 0, len = iFileData.length; i < len; i++) {
            var tmp_name = iFileData[i].name;
            if (!FileSelectedcheck(tmp_name, '.json')) {
                $scope.createAlert("WarningOk", 'Selected File type is not allowed. Please upload json files', function () {

                });
                return false;
            }
            fd.append("File", iFileData[i]);
        }
        g1FileHandler.mstrUploadFile(fd).then(function (response) {
            $log.debug("gstrhomectrl -> mstr uploadFile success:: ", response);
            //console.log("response:", response.userGstin)
            if ((response instanceof Array) && (response.length < 1 || response[0].message) || (response == "ProductName duplicate") || (response == "") || (response == "supplierRecipientName duplicate") || (response == "gstin duplicate")) {
                $scope.createAlert(
                    "infocancel",
                    "Please upload valid JSON file",
                    function () {
                        $scope.page("/")
                    });
            } else if (response == "Exceeding length") {
                $scope.createAlert(
                    "infocancel",
                    "You can add maximum 500 records in Product master. Please remove some unwanted records to add more records",
                    function () {
                        $scope.page("/")
                    });
            }
            else if (response == "SupExceeding length") {
                $scope.createAlert(
                    "infocancel",
                    "You can add maximum 500 records in Supplier/Recipient master. Please delete some unwanted records to add more records",
                    function () {
                        $scope.page("/")
                    });
            }
            else {
                sessionStorage.setItem('gstin', response.userGstin);
                sessionStorage.setItem('mstrespnse', JSON.stringify(response));
              //  console.log("mstrespnse", response)
                $scope.page("/gstr/upload/upldmstrdashboard");
            }
        }, function (response) {
            $log.debug("gstrhomectrl -> mstr uploadFile fail:: ", response);
        });
    }


}]);

myApp.controller("prvctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$filter',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, $filter) {
        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/summary");
        } else {
            $scope.dashBoardDt = shareData.dashBoardDt;
            initPreview();
        }
        var date = $filter('date')(new Date(), 'ddMMyyyy');

        var sectionLs = null;
        function initPreview() {
            var reqParam = shareData.dashBoardDt;
            reqParam.type = "N";
            //g1FileHandler.getSummaryOfInvoices(reqParam)

            //CR#18639_IFF_check_condn_for_sectls
            var rtn_prd = parseInt(shareData.dashBoardDt.fp.slice(0, 2));
            if (shareData.isTPQ == true && rtn_prd % 3 !== 0) {
                shareData.dashBoardDt.form = "GSTR1IFF";
            }
            g1FileHandler.getSectionList(shareData.dashBoardDt.form)
                .then(function (response) {
                    sectionLs = response;
                    if (shareData.isTPQ == false) {
                        shareData.dashBoardDt.form = "GSTR1";
                    }
                    else if (shareData.isTPQ == true && rtn_prd % 3 !== 0) {
                        shareData.dashBoardDt.form = "GSTR1";
                    }
                    reformSummary(response, function (iData) {
                        $scope.previewModel = iData;
                        var list = [];
                        if (shareData.isTPQ && rtn_prd % 3 !== 0) {
                            let a = 0;
                            let aLen = $scope.previewModel.length;
                            for (a; a < aLen; a++) {
                                if ($scope.previewModel[a].cd == "b2b" || $scope.previewModel[a].cd == "b2ba" || $scope.previewModel[a].cd == "cdnr" || $scope.previewModel[a].cd == "cdnra" || $scope.previewModel[a].cd == "ecomb2b"|| $scope.previewModel[a].cd == "ecomurp2b" || $scope.previewModel[a].cd == "ecomab2b"|| $scope.previewModel[a].cd == "ecomaurp2b") {
                                    list.push($scope.previewModel[a]);
                                }
                            }
                            $scope.previewSection = list;
                        }
                        else {
                            $scope.previewSection = $scope.previewModel;
                        }
                    });
                }, function (error) {
                    $log.debug("prvctrl -> View Summary  fail :: response");
                });

        }

        $scope.isGstr2Prvw = function () {
            return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR2") ? true : false;
        }

        $scope.goToSumryPage = function () {
            shareData.isPrvw = "true";
            $scope.page("/gstr/summary");
        }

        // CHANGES BY V START
        // SOME CODE SHIFTED TO BACKEND SIDE, offline.js ( 10/07/2017 )

        function reformSummary(iResp, callback) {
            g1FileHandler.getContentsForMeta(shareData.dashBoardDt).then(function (prevContent) {

                // CODE SHIFTED TO BACKEND SIDE, offline.js ( 10/07/2017 )

                var retArry = prevContent.counts;
                callback(retArry);

            }, function (response) {
                // $log.debug("prvctrl -> reformSummary fail:: ", response);
            });
        }
        // CHANGES BY V END

        //To generate Zip to upload gst portal
        $scope.generateZip = function () {
            var reqParam = shareData.dashBoardDt;
            g1FileHandler.createZip(reqParam)
                .then(function (response) {
                    $log.debug("prvctrl -> zip generated :: ", response);
                    saveAs(new Blob([response], {
                        type: "application/zip"
                    }), shareData.dashBoardDt.form + "_" + shareData.dashBoardDt.gstin + "_" + shareData.dashBoardDt.month + "_" + shareData.dashBoardDt.fy + '.zip');
                }, function (error) {
                    $log.debug("prvctrl ->zip generated failed :: response");

                })
        }

        //To generate File to upload gst portal
        $scope.generateReturn = function () {
            shareData.dashBoardDt.isTPQ = shareData.isTPQ;
            var reqParam = shareData.dashBoardDt;
            $().blockPage(true);
            g1FileHandler.createFile(reqParam)
                .then(function (response) {
                    $().blockPage(false);
                    $log.debug("prvctrl -> file generated :: ", response);
                    shareData.directory = response.down_dir; // hardcoded. Please change according to ur name
                    shareData.flowName = "New";

                    shareData.fileNames = response.filenameArr; // hardcoded. Please change according to ur name
                    $scope.page("/gstr/download");
                    // $().blockPage(false);
                    // try {response =  JSON.parse(response);}
                    //     catch(e) {response =  response;}
                    //     response = JSON.stringify(response); 
                    //     saveAs(new Blob([response], {
                    //         type: "application/json"
                    //     }), "returns" + "_" + date + "_" + shareData.dashBoardDt.form.substring(3) + "_" + shareData.dashBoardDt.gstin + "_" + "offline" + '.json');
                }, function (error) {
                    $log.debug("prvctrl -> file generation  failed :: response");
                    $().blockPage(false);

                })

        }

        //Navigation to respective section summary
        $scope.openSection = function (sectionCode) {
            shareData.table = sectionCode;
            angular.forEach(sectionLs, function (section, i) {
                if (section.cd === sectionCode) {
                    shareData.scLsSetIdx = i;
                }
            });
        
            $scope.page("/gstr/summary");
        }

    }
]);
myApp.controller("upldmstrprvctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$filter',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, $filter) {
         if (!shareData.mstrdashBoardDt) {
           $scope.page("/gstr/mastersummary");
         } else {
            $scope.mstrdashBoardDt = shareData.mstrdashBoardDt.response;
            // $scope.initmstrPreview();
       }
        $scope.initmstrPreview = function () {
           // //console.log("$scope.mstrdashBoardDt.productsMasters", $scope.mstrdashBoardDt.productsMasters)
            $scope.saveData = $scope.mstrdashBoardDt.productsMasters;
           // console.log(" $scope.saveData", $scope.saveData)

        }
        //Summary
        $scope.upldmstrsummary = function () {
            if ($scope.upldprdtog) {
                $scope.upldprdtog = false;
            }
            else { $scope.upldprdtog = true; }
        }
        $scope.upldsupsummary = function () {
            if ($scope.upldsuptog) {
                $scope.upldsuptog = false;
            }
            else $scope.upldsuptog = true;
        }


        $scope.view = 'product';
        $scope.toggle_view = function (view) {
            $scope.view = $scope.view === view ? 'product' : view;

        };


    }]);

myApp.controller("uploadprvctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', '$filter', 'R1Util',
    function ($scope, shareData, g1FileHandler, $log, $filter, R1Util) {

        var form = null;
        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/upload/summary");
        } else {
            $scope.dashBoardDt = shareData.dashBoardDt;
            form = $scope.dashBoardDt.form;
            initPreview();
        }

        var date = $filter('date')(new Date(), 'ddMMyyyy');

        var sectionLs = null;
        function initPreview() {
            var reqParam = shareData.dashBoardDt;
            // reqParam.type = "N";
            //g1FileHandler.getSummaryOfInvoices(reqParam)
            //CR#18639_IFF_check_condn_for_sectls
            var rtn_prd = parseInt(shareData.dashBoardDt.fp.slice(0, 2));


            if (shareData.isTPQ == true && rtn_prd % 3 !== 0) {
                shareData.dashBoardDt.form = "GSTR1IFF";

            } else if (shareData.isTPQ == false && shareData.dashBoardDt.form == "GSTR1IFF") {
                shareData.dashBoardDt.form = "GSTR1";
            } else if (shareData.isTPQ == true && rtn_prd % 3 == 0) {
                shareData.dashBoardDt.form = "GSTR1";
            }

            shareData.dashBoardDt.form
            g1FileHandler.getUploadSectionList(shareData.dashBoardDt.form)
                .then(function (response) {
                    sectionLs = response;
                    if (shareData.dashBoardDt.form == "GSTR1IFF") {
                        shareData.dashBoardDt.form = "GSTR1";
                    }
                    reformSummary(response, function (iData) {
                        $scope.previewModel = iData;
                        //changes for 18639 open JSON
                        var list = [];
                        if (shareData.isTPQ && rtn_prd % 3 !== 0) {
                            let a = 0;
                            let aLen = $scope.previewModel.length;
                            for (a; a < aLen; a++) {
                                if ($scope.previewModel[a].cd == "b2b" || $scope.previewModel[a].cd == "b2ba" || $scope.previewModel[a].cd == "cdnr" || $scope.previewModel[a].cd == "cdnra" || $scope.previewModel[a].cd == "ecomb2b"|| $scope.previewModel[a].cd == "ecomurp2b" || $scope.previewModel[a].cd == "ecomab2b"|| $scope.previewModel[a].cd == "ecomaurp2b") {
                                    list.push($scope.previewModel[a]);
                                }
                            }
                            $scope.previewSection = list;
                        }
                        else {
                            $scope.previewSection = $scope.previewModel;
                        }
                    });

                }, function (error) {
                    $log.debug("prvctrl -> View Summary  fail :: response");
                })

        }

        function getUploadedSectionsOnly(iResp) {
            g1FileHandler.getUploadContentsFor(shareData.dashBoardDt).then(function (prevContent) {
                $log.debug("uploadsummarycrtl -> getUploadContentsFor success:: ", prevContent);


                iResp.filter(function (section) {
                    if (prevContent.hasOwnProperty(section.cd)) {
                        $scope.sectionList.push(section);
                    }
                });
                // $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
                // tblcode = $scope.sectionListSelected.cd;
                // form = $scope.dashBoardDt.form;

            }
                , function (response) {
                    $log.debug("uploadsummarycrtl -> getUploadContentsFor Failure:: ", response);
                });
        }


        function generateTotal(total, itmInner, iSec) {
            if (iSec == "itc_rcd" && form == "GSTR2") {
                itmInner.camt = parseFloat(itmInner.o_cg) + parseFloat(itmInner.n_cg),
                    itmInner.iamt = parseFloat(itmInner.o_ig) + parseFloat(itmInner.n_ig),
                    itmInner.samt = parseFloat(itmInner.o_sg) + parseFloat(itmInner.n_sg),
                    itmInner.csamt = parseFloat(itmInner.o_cs) + parseFloat(itmInner.n_cs)

            }
            total.cgTl += (itmInner.camt) ? parseFloat(itmInner.camt) : 0;
            total.sgTl += (itmInner.samt) ? parseFloat(itmInner.samt) : 0;
            total.igTl += (itmInner.iamt) ? parseFloat(itmInner.iamt) : 0;
            total.csTl += (itmInner.csamt) ? parseFloat(itmInner.csamt) : 0;
            return total;
        }

        function generateItcTotal(total, itcInner, iSec) {

            total.itc_cgTl += (itcInner.tx_c) ? parseFloat(itcInner.tx_c) : 0;
            total.itc_sgTl += (itcInner.tx_s) ? parseFloat(itcInner.tx_s) : 0;
            total.itc_igTl += (itcInner.tx_i) ? parseFloat(itcInner.tx_i) : 0;
            total.itc_csTl += (itcInner.tx_cs) ? parseFloat(itcInner.tx_cs) : 0;

            return total;
        }


        function reformSummary(iResp, callback) {
            var tmpFrm = shareData.dashBoardDt.form;
            if (tmpFrm == 'GSTR2A' || tmpFrm == 'GSTR1IFF')
                tmpFrm = 'GSTR1';
            g1FileHandler.getContentsForMeta(shareData.dashBoardDt, null, true).then(function (prevContent) {
                // $log.debug("prvctrl -> reformSummary success:: ", prevContent);
                var retArry = [];



                // CODE SHIFTED TO BACKEND SIDE, offline.js ( 22/09/2017 )


                //                for (var a = 0, alen = iResp.length; a < alen; a++) {
                //                    var section = iResp[a],
                //                        count = 0,
                //                        ctinInv = prevContent[section.cd],
                //                        result = {},
                //                        total = null;
                //                    if (shareData.dashBoardDt.form == "GSTR1") {
                //                        total = {
                //                            "cgTl": 0,
                //                            "sgTl": 0,
                //                            "igTl": 0,
                //                            "csTl": 0
                //                        };
                //                    }
                //                    else {
                //                        total = {
                //                            "cgTl": 0,
                //                            "sgTl": 0,
                //                            "igTl": 0,
                //                            "csTl": 0,
                //                            "itc_cgTl": 0,
                //                            "itc_sgTl": 0,
                //                            "itc_igTl": 0,
                //                            "itc_csTl": 0
                //                        };
                //                    }
                //
                //                    if (shareData.dashBoardDt.form == "GSTR1" || shareData.dashBoardDt.form == "GSTR2A") {
                //                        switch (section.cd) {
                //                            case "b2b":
                //                                angular.forEach(ctinInv, function (invInner, i) {
                //                                    angular.forEach(invInner.inv, function (inv, i) {
                //
                //                                        count += 1;
                //                                        angular.forEach(inv.itms, function (itm, i) {
                //                                            var itmInner = itm.itm_det;
                //                                            if (inv.rchrg != "Y" && inv.inv_typ != "SEWOP") {
                //                                                result = generateTotal(total, itmInner);
                //                                            }
                //                                            else {
                //                                                result = total;
                //                                            }
                //                                        });
                //
                //                                    });
                //                                });
                //                                break;
                //                            case "b2ba":
                //                            case "b2cl":
                //                            case "b2cla":
                //                                angular.forEach(ctinInv, function (invInner, i) {
                //                                    angular.forEach(invInner.inv, function (inv, i) {
                //
                //                                        count += 1;
                //                                        angular.forEach(inv.itms, function (itm, i) {
                //                                            var itmInner = itm.itm_det;
                //
                //                                            if (inv.rchrg != "Y") {
                //                                                result = generateTotal(total, itmInner);
                //                                            }
                //                                            else {
                //                                                result = total;
                //                                            }
                //                                        });
                //
                //                                    });
                //                                });
                //                                break;
                //
                //
                //                            case "exp":
                //                            case "expa":
                //                                angular.forEach(ctinInv, function (invInner, i) {
                //                                    angular.forEach(invInner.inv, function (inv, i) {
                //                                        count += 1;
                //                                        angular.forEach(inv.itms, function (itmInner, i) {
                //                                            result = generateTotal(total, itmInner);
                //                                        });
                //                                    });
                //                                });
                //                                break;
                //                            case "at":
                //                            case "ata":
                //                            case "atadj":
                //                                angular.forEach(ctinInv, function (inv, i) {
                //                                    count += 1;
                //                                    angular.forEach(inv.itms, function (itmInner, i) {
                //                                        result = generateTotal(total, itmInner);
                //                                    });
                //                                });
                //                                break;
                //
                //                            case "b2cs":
                //                            case "b2csa":
                //                                angular.forEach(ctinInv, function (itmInner, i) {
                //                                    result = generateTotal(total, itmInner);
                //                                    count += 1;
                //                                });
                //                                break;
                //
                //                            case "cdnr":
                //                            case "cdnra":
                //
                //                                angular.forEach(ctinInv, function (invInner, i) {
                //                                    angular.forEach(invInner.nt, function (nt, i) {
                //                                        count += 1;
                //                                        angular.forEach(nt.itms, function (itm, i) {
                //                                            var itmInner = itm.itm_det;
                //                                            result = generateTotal(total, itmInner);
                //                                        });
                //                                    });
                //                                });
                //                                break;
                //                            case "cdnur":
                //                                angular.forEach(ctinInv, function (inv, i) {
                //                                    count += 1;
                //                                    angular.forEach(inv.itms, function (itms, i) {
                //                                        var itmInner = itms.itm_det;
                //                                        result = generateTotal(total, itmInner);
                //                                    });
                //                                });
                //                                break;
                //                            case "hsn":
                //                                if (ctinInv)
                //                                    angular.forEach(ctinInv.data, function (itmInner, i) {
                //                                        result = generateTotal(total, itmInner, section.cd);
                //                                        count += 1;
                //                                    });
                //                                break;
                //                            case "nil":
                //                                if (ctinInv)
                //                                    angular.forEach(ctinInv.data, function (itmInner, i) {
                //                                        result = generateTotal(total, itmInner, section.cd);
                //                                        count += 1;
                //                                    });
                //                                break;
                //                        }
                //                    }
                //                    else {
                //                        switch (section.cd) {
                //                            case "b2b":
                //                            case "b2ba":
                //                            case "b2bur":
                //                            case "b2bura":
                //                                angular.forEach(ctinInv, function (invInner, i) {
                //                                    angular.forEach(invInner.inv, function (inv, i) {
                //                                        count += 1;
                //                                        angular.forEach(inv.itms, function (itm, i) {
                //                                            var itmInner = itm.itm_det,
                //                                                itcInner = itm.itc;
                //                                            result = generateTotal(total, itmInner);
                //                                            result = generateItcTotal(total, itcInner);
                //                                        });
                //                                    });
                //                                });
                //                                break;
                //
                //                            case "cdnr":
                //                            case "cdnra":
                //
                //                                angular.forEach(ctinInv, function (invInner, i) {
                //                                    angular.forEach(invInner.nt, function (inv, i) {
                //                                        count += 1;
                //                                        angular.forEach(inv.itms, function (itm, i) {
                //                                            var itmInner = itm.itm_det,
                //                                                itcInner = itm.itc;
                //                                            result = generateTotal(total, itmInner);
                //                                            result = generateItcTotal(total, itcInner);
                //                                        });
                //                                    });
                //                                });
                //                                break;
                //                            case "cdnur":
                //
                //
                //                                angular.forEach(ctinInv, function (itm, i) {
                //                                    var itmInner = itm.itm_det;
                //                                    result = generateTotal(total, itmInner);
                //                                    count += 1;
                //                                });
                //                                break;
                //                            case "atadj":
                //                                angular.forEach(ctinInv, function (inv, i) {
                //                                    count += 1;
                //                                    angular.forEach(inv.itms, function (itms, i) {
                //                                        var itmInner = itms.itm_det;
                //                                        result = generateTotal(total, itmInner);
                //                                    });
                //                                });
                //                                break;
                //                            case "txi":
                //                            case "atxi":
                //                            case "imp_g":
                //                            case "imp_ga":
                //                            case "imp_s":
                //                            case "imp_sa":
                //                                angular.forEach(ctinInv, function (inv, i) {
                //                                    count += 1;
                //                                    angular.forEach(inv.itms, function (itmInner, i) {
                //                                        result = generateTotal(total, itmInner);
                //                                        result = generateItcTotal(total, itmInner);
                //
                //                                    });
                //                                });
                //                                break;
                //
                //                            case "hsnsum":
                //                            case "itc_rcd":
                //                                angular.forEach(ctinInv, function (itmInner, i) {
                //                                    result = generateTotal(total, itmInner, section.cd);
                //                                    count += 1;
                //                                });
                //                                break;
                //
                //                        }
                //
                //                    }
                //
                //                    if (count) {
                //                        //result = generateTotal(total, {});
                //                        retArry.push({
                //                            cd: section.cd,
                //                            result: result,
                //                            count: count,
                //                            name: section.nm
                //                        });
                //                    }
                //                }
                var retArry = prevContent.counts;

                callback(retArry);


            }, function (response) {
                // $log.debug("prvctrl -> reformSummary fail:: ", response);
            });
        }

        $scope.generateZip = function () {
            var reqParam = shareData.dashBoardDt;
            g1FileHandler.createZip(reqParam)
                .then(function (response) {
                    $log.debug("prvctrl -> zip generated :: ", response);
                    saveAs(new Blob([response], {
                        type: "application/zip"
                    }), shareData.dashBoardDt.form + "_" + shareData.dashBoardDt.gstin + "_" + shareData.dashBoardDt.month + "_" + shareData.dashBoardDt.fy + '.zip');
                }, function (error) {
                    $log.debug("prvctrl ->zip generated failed :: response");

                })
        }

        $scope.generateFile = function () {
            shareData.dashBoardDt.isTPQ = shareData.isTPQ;
            var reqParam = shareData.dashBoardDt;
            reqParam.type = "Import";
            $().blockPage(true);
            g1FileHandler.createFile(reqParam)
                .then(function (response) {
                    $().blockPage(false);
                    $log.debug("uploadprvctrl -> file generated :: ", response);
                    // shareData.directory = response.directory;
                    shareData.directory = response.down_dir; // hardcoded. Please change according to ur name
                    shareData.flowName = "Import";

                    shareData.fileNames = response.filenameArr; // hardcoded. Please change according to ur name
                    $scope.page("/gstr/download");

                }, function (error) {
                    $log.debug("uploadprvctrl -> file generation  failed :: response");
                    $().blockPage(false);

                })
        }

        //u can mention if any initialization functionality to be done in download page
        $scope.readDirectory = function () {
            $scope.fileNames = shareData.fileNames;
        }

        $scope.saveData = function (fileName) {
            var fName = shareData.directory + fileName;
            g1FileHandler.getDownloadContentsFor(fName)
                .then(function (response) {
                    console.log("response:",response)
                    $log.debug("prvctrl -> file generated :: ", response);
                    saveAs(new Blob([JSON.stringify(response)], {
                        type: "application/json"
                    }), "returns" + "_" + date + "_" + shareData.dashBoardDt.form.substring(3) + "_" + shareData.dashBoardDt.gstin + "_" + "offline" + '.json');
                }, function (error) {
                    $log.debug("prvctrl ->file generated failed :: response");

                })
        }

        $scope.filterChanged = function () {
            shareData.filter_val = $scope.search_filter_value.val;
            $scope.$broadcast('filterValChanged');
        };

        $scope.generateReturn = function () {
            var reqParam = shareData.dashBoardDt;
            reqParam.type = "Import";
            g1FileHandler.createFile(reqParam)
                .then(function (response) {
                    var resMimeType = response.mimeType;

                    $log.debug("uploadprvctrl -> file generated :: ", response);
                    try { response = JSON.parse(response); }
                    catch (e) { response = response; }
                    response = JSON.stringify(response);
                    saveAs(new Blob([response], {
                        type: "application/json"
                    }), "returns" + "_" + date + "_" + shareData.dashBoardDt.form.substring(3) + "_" + shareData.dashBoardDt.gstin + "_" + "offline" + '.json');



                }, function (error) {
                    $log.debug("uploadprvctrl -> file generation  failed :: response");

                });
        };

        $scope.isGSTR2A = function () {
            return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR2A") ? true : false;
        }
        $scope.isGSTR1A = function () {
            return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR1A") ? true : false;
        }

        $scope.isGSTR2 = function () {
            return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR2") ? true : false;
        }

        $scope.isGSTR1 = function () {
            return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR1" || $scope.dashBoardDt.form == "GSTR1IFF") ? true : false;
        }

        $scope.openSection = function (sectionCode) {
            shareData.table = sectionCode;
            angular.forEach(sectionLs, function (section, i) {
                if (section.cd === sectionCode) {
                    shareData.scLsSetIdx = i;
                }
            });
            $scope.page("/gstr/upload/summary");
        }

        $scope.generateExcel = function () {
            var reqParam = shareData.dashBoardDt;
            reqParam.type = "Import";
            $().blockPage(true);
            g1FileHandler.createExcel(reqParam)
                .then(function (response) {
                    $log.debug("uploadprvctrl -> file generated :: ", response);
                    saveAs(new Blob([response], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }), shareData.dashBoardDt.month + "_" + shareData.dashBoardDt.fy + "_" + shareData.dashBoardDt.form + "_" + shareData.dashBoardDt.gstin + '.xlsx');
                    $().blockPage(false);
                }, function (error) {
                    $log.debug("uploadprvctrl -> file generation  failed :: response");
                    $().blockPage(false);

                })
        }



        $scope.isGstr2Prvw = function () {
            return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR2") ? true : false;
        }
        //go back to summary page of second flow
        $scope.goToSummaryPageUpload = function () {
            shareData.isPrvwUpload = "true";
            $scope.page("/gstr/upload/summary");
        }

    }
]);

myApp.controller("downloadctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', '$filter',
    function ($scope, shareData, g1FileHandler, $log, $filter) {


        if (!shareData.dashBoardDt) {
            if (shareData.flowName = "New")
                $scope.page("/gstr/summary");
            else if (shareData.flowName = "Import")
                $scope.page("/gstr/upload/summary");
            else if (shareData.flowName = "Error")
                $scope.page("/gstr/error/summary");
        }

        var date = $filter('date')(new Date(), 'ddMMyyyy');



        //u can mention if any initialization functionality to be done in download page
        $scope.readDirectory = function () {
            $scope.fileNames = shareData.fileNames;
        }

        $scope.saveData = function (fileName) {
            var fName = shareData.directory + fileName;

            g1FileHandler.getDownloadContentsFor(fName)
                .then(function (response) {
                 //   console.log("response:",response)
                 if (response && response.b2b) {
                    for (let i in response.b2b) {
                        for (let j in response.b2b[i].inv) {
                            delete response.b2b[i].inv[j].supplierRecipientName;
                            delete response.b2b[i].inv[j].registrationStatus;
                            if(response.b2b[i].inv[j].hasOwnProperty("isNotAdded")){
                                delete response.b2b[i].inv[j].isNotAdded;
                            }
                        }
                       
                    }
                }
                if (response && response.b2ba) {
                    for (let i in response.b2ba) {
                        for (let j in response.b2ba[i].inv) {
                            delete response.b2ba[i].inv[j].supplierRecipientName;
                            delete response.b2ba[i].inv[j].registrationStatus;
                            if(response.b2ba[i].inv[j].hasOwnProperty("isNotAdded")){
                                delete response.b2ba[i].inv[j].isNotAdded;
                            }
                        }
                       
                    }
                }

                if (response && response.b2cl) {
                    for (let i in response.b2cl) {
                        for (let j in response.b2cl[i].inv) {
                        if(response.b2cl[i].inv[j].hasOwnProperty("isNotAdded")){
                            delete response.b2cl[i].inv[j].isNotAdded;
                        }
                    }
                    }
                }

                if (response && response.b2cla) {
                    for (let i in response.b2cla) {
                        for (let j in response.b2cla[i].inv) {
                            if(response.b2cla[i].inv[j].hasOwnProperty("isNotAdded")){
                                delete response.b2cla[i].inv[j].isNotAdded;
                            }
                    }
                    }
                }

                if (response && response.cdnr) {
                    for (let i in response.cdnr) {
                        for (let j in response.cdnr[i].nt) {
                            delete response.cdnr[i].nt[j].supplierRecipientName;
                            delete response.cdnr[i].nt[j].registrationStatus;
                            if(response.cdnr[i].nt[j].hasOwnProperty("isNotAdded")){
                                delete response.cdnr[i].nt[j].isNotAdded;
                            }
                        }
                       
                    }
                }

                if (response && response.cdnra) {
                    for (let i in response.cdnra) {
                        for (let j in response.cdnra[i].nt) {
                            delete response.cdnra[i].nt[j].supplierRecipientName;
                            delete response.cdnra[i].nt[j].registrationStatus;
                            if(response.cdnra[i].nt[j].hasOwnProperty("isNotAdded")){
                                delete response.cdnra[i].nt[j].isNotAdded;
                            }
                        }
                       
                    }
                }

                if (response && response.cdnur) {
                    for (let i in response.cdnur) {
                        if(response.cdnur[i].hasOwnProperty("isNotAdded")){
                            delete response.cdnur[i].isNotAdded;
                        }
                    }
                }

                if (response && response.cdnura) {
                    for (let i in response.cdnura) {
                        if(response.cdnura[i].hasOwnProperty("isNotAdded")){
                            delete response.cdnura[i].isNotAdded;
                        }
                    }
                }

                if (response && response.hsn) {
                    for (let i in response.hsn['data']) {
                        if(response.hsn['data'][i].productName !=undefined){
                            delete response.hsn['data'][i].productName;
                        }
                        if(response.hsn['data'][i].hasOwnProperty("isNotAdded")){
                            delete response.hsn['data'][i].isNotAdded;
                        }
                        if(response.hsn['data'][i].hasOwnProperty("invalidhsnCode")){
                            delete response.hsn['data'][i].invalidhsnCode;
                        }
                     }
                }
                if (response && response.hsn && response.hsn.hsn_b2b) {
                    for (let i in response.hsn['hsn_b2b']) {
                        if(response.hsn['hsn_b2b'][i].productName !=undefined){
                            delete response.hsn['hsn_b2b'][i].productName;
                        }
                        if(response.hsn['hsn_b2b'][i].hasOwnProperty("isNotAdded")){
                            delete response.hsn['hsn_b2b'][i].isNotAdded;
                        }
                        if(response.hsn['hsn_b2b'][i].hasOwnProperty("invalidhsnCode")){
                            delete response.hsn['hsn_b2b'][i].invalidhsnCode;
                        }
                     }
                }
                if (response && response.hsn &&  response.hsn.hsn_b2c) {
                    for (let i in response.hsn['hsn_b2c']) {
                        if(response.hsn['hsn_b2c'][i].productName !=undefined){
                            delete response.hsn['hsn_b2c'][i].productName;
                        }
                        if(response.hsn['hsn_b2c'][i].hasOwnProperty("isNotAdded")){
                            delete response.hsn['hsn_b2c'][i].isNotAdded;
                        }
                        if(response.hsn['hsn_b2c'][i].hasOwnProperty("invalidhsnCode")){
                            delete response.hsn['hsn_b2c'][i].invalidhsnCode;
                        }
                     }
                }

                if (response && response.exp) {
                    for (let i in response.exp) {
                        for (let j in response.exp[i].inv) {
                        if(response.exp[i].inv[j].hasOwnProperty("isNotAdded")){
                            delete response.exp[i].inv[j].isNotAdded;
                        }
                    }
                    }
                }

                if (response && response.expa) {
                    for (let i in response.expa) {
                        for (let j in response.expa[i].inv) {
                        if(response.expa[i].inv[j].hasOwnProperty("isNotAdded")){
                            delete response.expa[i].inv[j].isNotAdded;
                        }
                    }
                    }
                }

                if (response && response.b2cs) {
                    for (let i in response.b2cs) {
                        if(response.b2cs[i].hasOwnProperty("isNotAdded")){
                            delete response.b2cs[i].isNotAdded;
                        }
                     }
                }
                
                if (response && response.b2csa) {
                    for (let i in response.b2csa) {
                        if(response.b2csa[i].hasOwnProperty("isNotAdded")){
                            delete response.b2csa[i].isNotAdded;
                        }
                     }
                }
                if (response && response.at) {
                    for (let i in response.at) {
                        if(response.at[i].hasOwnProperty("isNotAdded")){
                            delete response.at[i].isNotAdded;
                        }
                     }
                }
                if (response && response.ata) {
                    for (let i in response.ata) {
                        if(response.ata[i].hasOwnProperty("isNotAdded")){
                            delete response.ata[i].isNotAdded;
                        }
                     }
                }
                if (response && response.txpd) {
                    for (let i in response.txpd) {
                        if(response.txpd[i].hasOwnProperty("isNotAdded")){
                            delete response.txpd[i].isNotAdded;
                        }
                     }
                }
                if (response && response.txpda) {
                    for (let i in response.txpda) {
                        if(response.txpda[i].hasOwnProperty("isNotAdded")){
                            delete response.txpda[i].isNotAdded;
                        }
                     }
                }
                if (response && response.supeco){
                    if(response.supeco.clttx){
                        for (let i in response.supeco.clttx) {
                            if(response.supeco.clttx[i].hasOwnProperty("isNotAdded")){
                                delete response.supeco.clttx[i].isNotAdded;
                            }
                        }
                    }
                    if(response.supeco.paytx){
                        for (let i in response.supeco.paytx) {
                            if(response.supeco.paytx[i].hasOwnProperty("isNotAdded")){
                                delete response.supeco.paytx[i].isNotAdded;
                            }
                        }
                    }
                }
                if (response && response.supecoa){
                    if(response.supecoa.clttxa){
                        for (let i in response.supecoa.clttxa) {
                            if(response.supecoa.clttxa[i].hasOwnProperty("isNotAdded")){
                                delete response.supecoa.clttxa[i].isNotAdded;
                            }
                        }
                    }
                    if(response.supecoa.paytxa){
                        for (let i in response.supecoa.paytxa) {
                            if(response.supecoa.paytxa[i].hasOwnProperty("isNotAdded")){
                                delete response.supecoa.paytxa[i].isNotAdded;
                            }
                        }
                    }
                }
                if(response && response.ecom){
                    if(response.ecom.b2b){
                        for (let i in response.ecom.b2b) {
                            for (let j in response.ecom.b2b[i].inv) {
                                delete response.ecom.b2b[i].inv[j].supplierRecipientName;
                                if(response.ecom.b2b[i].inv[j].hasOwnProperty("isNotAdded")){
                                    delete response.ecom.b2b[i].inv[j].isNotAdded;
                                }
                                if(response.ecom.b2b[i].inv[j].hasOwnProperty("old_inum")){
                                    delete response.ecom.b2b[i].inv[j].old_inum;
                                }
                                if(response.ecom.b2b[i].inv[j].hasOwnProperty("rchrg")){
                                    delete response.ecom.b2b[i].inv[j].rchrg;
                                }
                            }
                        }
                    }
                    if(response.ecom.b2c){
                        for (let i in response.ecom.b2c) {
                            if(response.ecom.b2c[i].hasOwnProperty("isNotAdded")){
                                delete response.ecom.b2c[i].isNotAdded;
                            }
                            if(response.ecom.b2c[i].hasOwnProperty("sp_typ")){
                                delete response.ecom.b2c[i].sp_typ;
                            }
                            if(response.ecom.b2c[i].hasOwnProperty("uni_key")){
                                delete response.ecom.b2c[i].uni_key;
                            }
                        }
                    }
                    if(response.ecom.urp2b){
                        for (let i in response.ecom.urp2b) {
                            for (let j in response.ecom.urp2b[i].inv) {
                                if(response.ecom.urp2b[i].inv[j].hasOwnProperty("isNotAdded")){
                                    delete response.ecom.urp2b[i].inv[j].isNotAdded;
                                }
                                if(response.ecom.urp2b[i].inv[j].hasOwnProperty("old_inum")){
                                    delete response.ecom.urp2b[i].inv[j].old_inum;
                                }
                                if(response.ecom.urp2b[i].inv[j].hasOwnProperty("rchrg")){
                                    delete response.ecom.urp2b[i].inv[j].rchrg;
                                }
                            }
                        }
                    }
                    if(response.ecom.urp2c){
                        for (let i in response.ecom.urp2c) {
                            if(response.ecom.urp2c[i].hasOwnProperty("isNotAdded")){
                                delete response.ecom.urp2c[i].isNotAdded;
                            }
                            if(response.ecom.urp2c[i].hasOwnProperty("uni_key")){
                                delete response.ecom.urp2c[i].uni_key;
                            }
                        }
                    }
                }
                if(response && response.ecoma){
                    if(response.ecoma.b2ba){
                        for (let i in response.ecoma.b2ba) {
                            for (let j in response.ecoma.b2ba[i].inv) {
                                delete response.ecoma.b2ba[i].inv[j].supplierRecipientName;
                                if(response.ecoma.b2ba[i].inv[j].hasOwnProperty("isNotAdded")){
                                    delete response.ecoma.b2ba[i].inv[j].isNotAdded;
                                }
                                if(response.ecoma.b2ba[i].inv[j].hasOwnProperty("old_inum")){
                                    delete response.ecoma.b2ba[i].inv[j].old_inum;
                                }
                                if(response.ecoma.b2ba[i].inv[j].hasOwnProperty("rchrg")){
                                    delete response.ecoma.b2ba[i].inv[j].rchrg;
                                }
                            }
                        }
                    }
                    if(response.ecoma.b2ca){
                        for (let i in response.ecoma.b2ca) {
                            for (let j in response.ecoma.b2ca[i].posItms) {
                                delete response.ecoma.b2ca[i].posItms[j].supplierRecipientName;
                                if(response.ecoma.b2ca[i].posItms[j].hasOwnProperty("isNotAdded")){
                                    delete response.ecoma.b2ca[i].posItms[j].isNotAdded;
                                }
                                if(response.ecoma.b2ca[i].posItms[j].hasOwnProperty("uni_key")){
                                    delete response.ecoma.b2ca[i].posItms[j].uni_key;
                                }
                            }
                        }
                    }
                    if(response.ecoma.urp2ba){
                        for (let i in response.ecoma.urp2ba) {
                            for (let j in response.ecoma.urp2ba[i].inv) {
                                if(response.ecoma.urp2ba[i].inv[j].hasOwnProperty("isNotAdded")){
                                    delete response.ecoma.urp2ba[i].inv[j].isNotAdded;
                                }
                                if(response.ecoma.urp2ba[i].inv[j].hasOwnProperty("old_inum")){
                                    delete response.ecoma.urp2ba[i].inv[j].old_inum;
                                }
                                if(response.ecoma.urp2ba[i].inv[j].hasOwnProperty("rchrg")){
                                    delete response.ecoma.urp2ba[i].inv[j].rchrg;
                                }
                            }
                        }
                    }
                    if(response.ecoma.urp2ca){
                        for (let i in response.ecoma.urp2ca) {
                            if(response.ecoma.urp2ca[i].hasOwnProperty("isNotAdded")){
                                delete response.ecoma.urp2ca[i].isNotAdded;
                            }
                            if(response.ecoma.urp2ca[i].hasOwnProperty("uni_key")){
                                delete response.ecoma.urp2ca[i].uni_key;
                            }
                        }
                    }
                }
                    $log.debug("prvctrl -> file generated :: ", response);
                    saveAs(new Blob([JSON.stringify(response)], {
                        type: "application/json"
                    }), "returns" + "_" + date + "_" + shareData.dashBoardDt.form.substring(3) + "_" + shareData.dashBoardDt.gstin + "_" + "offline" + '.json');
                }, function (error) {
                    $log.debug("downloadctrl ->file generated failed :: response");

                })


        }

        //go back to view summary page
        $scope.goToBackPage = function () {
            if (shareData.flowName == "New")
                $scope.page("/gstr/preview");
            else if (shareData.flowName == "Import")
                $scope.page("/gstr/upload/preview");
            else
                $scope.page("/gstr/error/preview");
        }

    }
]);

myApp.controller("errPrvCtrl", ["$scope", 'shareData', 'g1FileHandler', 'R1Util', '$log', '$filter', function ($scope, shareData, g1FileHandler, R1Util, $log, $filter) {

    if (!shareData.dashBoardDt) {
        $scope.page("/gstr/error/summary");
    } else {
        $scope.dashBoardDt = shareData.dashBoardDt;
        initPreview();
    }
    var date = $filter('date')(new Date(), 'ddMMyyyy');
    $scope.sectionList = [];
    $scope.obj1 = { aatoGreaterThan5CR: null };
    $scope.obj = { isSEZ: null };
    $scope.obj1 = { isTPQ: null };

    function initPreview() {

        var reqParam = shareData.dashBoardDt;
        //CR#18639- IFF - changes by prakash
        if (shareData.dashBoardDt.form === 'GSTR1IFF') {
            shareData.dashBoardDt.form = 'GSTR1';
        }
        g1FileHandler.getErrorSectionList(shareData.dashBoardDt.form)
            .then(function (response) {
                getErrorSectionsOnly(response);

                reformSummary(response, function (iData) {
                    $scope.previewModel = iData;
                });
            }, function (error) {
                $log.debug("errprvctrl -> Error Summary  fail :: response");
            });

        function getErrorSectionsOnly(iResp) {
            g1FileHandler.getErrorContentsFor(shareData.dashBoardDt).then(function (prevContent) {
                $log.debug("errprvctrl -> getErrorContentsFor success:: ", prevContent);


                iResp.filter(function (section) {
                    var code = section.cd;
                    //Commented by Janhavi, defect-fix, view summary table
                    // if (code == 'atadj') {
                    //     code = "txpd"
                    // }
                    // if (code == 'atadja') {
                    //     code = "txpda"
                    // }
                   if (section.cd == 'hsn(b2b)') {
                        if (prevContent['error_report'].hsn != undefined){
                        if(prevContent['error_report'].hsn[0] != null && prevContent['error_report'].hsn[0].hasOwnProperty("hsn_b2b") ){
                            $scope.sectionList.push(section);
                        }
                        }
                    }
                    if (section.cd == 'hsn(b2c)') {
                        if (prevContent['error_report'].hsn != undefined){
                        if(prevContent['error_report'].hsn[0] != null && prevContent['error_report'].hsn[0].hasOwnProperty("hsn_b2c")) {
                            $scope.sectionList.push(section);
                        }
                    }
                    }
                    if (prevContent['error_report'].hasOwnProperty(code)) {

                        $scope.sectionList.push(section);
                    }
                });

                //   $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
                //  tblcode = $scope.sectionListSelected.cd;

            }
                , function (response) {
                    $log.debug("errorsummaryctrl -> getErrorContentsFor Failure:: ", response);
                });
        }


    }

    //Navigation to respective section summary
    $scope.openSection = function (sectionCode) {
        angular.forEach($scope.sectionList, function (section, i) {
            if (section.cd === sectionCode) {
                shareData.scLsSetIdx = i;
            }
        });
        $scope.page("/gstr/error/summary");
    }

    $scope.isGstr2Prvw = function () {
        return ($scope.dashBoardDt && $scope.dashBoardDt.form == "GSTR2") ? true : false;
    }
    $scope.goToSumryPage = function () {
        shareData.isPrvw = "true";
        $scope.page("/gstr/error/summary");
    }

    function generateTotal(total, itmInner, iSec, typ) {
        //condition for SEWOP added by Janhavi
        if (typ == "SEWOP" && (iSec == "b2b" || iSec == "b2ba" || iSec == "cdnr" || iSec == "cdnra"  || iSec == "ecomb2b" || iSec == "ecomurp2b" || iSec == "ecomab2b" || iSec == "ecomaurp2b")) {
            itmInner.iamt = 0;
            itmInner.csamt = 0;
        }
        else if (typ == "WOPAY" && (iSec == "exp" || iSec == "expa")) {
            itmInner.iamt = 0;
            itmInner.csamt = 0;
        }
        else if (typ == "EXPWOP" && (iSec == "cdnur" || iSec == "cdnura")) {
            itmInner.iamt = 0;
            itmInner.csamt = 0;
        }
        if (iSec == "itc_rcd" && form == "GSTR2") {
            itmInner.camt = parseFloat(itmInner.o_cg) + parseFloat(itmInner.n_cg),
                itmInner.iamt = parseFloat(itmInner.o_ig) + parseFloat(itmInner.n_ig),
                itmInner.samt = parseFloat(itmInner.o_sg) + parseFloat(itmInner.n_sg),
                itmInner.csamt = parseFloat(itmInner.o_cs) + parseFloat(itmInner.n_cs)

        }
        else if(iSec == "supeco" || iSec == "supecoa"){
            total.cgTl += (itmInner.cgst) ? parseFloat((itmInner.cgst).toFixed(2)) : 0;
            total.sgTl += (itmInner.sgst) ? parseFloat((itmInner.sgst).toFixed(2)) : 0;
            total.igTl += (itmInner.igst) ? parseFloat((itmInner.igst).toFixed(2)) : 0;
            total.csTl += (itmInner.cess) ? parseFloat((itmInner.cess).toFixed(2)) : 0;
        }

        total.cgTl += (itmInner.camt) ? parseFloat((itmInner.camt).toFixed(2)) : 0;
        total.sgTl += (itmInner.samt) ? parseFloat((itmInner.samt).toFixed(2)) : 0;
        total.igTl += (itmInner.iamt) ? parseFloat((itmInner.iamt).toFixed(2)) : 0;
        total.csTl += (itmInner.csamt) ? parseFloat((itmInner.csamt).toFixed(2)) : 0;

        return total;
    }

    function generateItcTotal(total, itcInner, iSec) {

        total.itc_cgTl += (itcInner.tx_c) ? parseFloat((itcInner.tx_c).toFixed(2)) : 0;
        total.itc_sgTl += (itcInner.tx_s) ? parseFloat((itcInner.tx_s).toFixed(2)) : 0;
        total.itc_igTl += (itcInner.tx_i) ? parseFloat((itcInner.tx_i).toFixed(2)) : 0;
        total.itc_csTl += (itcInner.tx_cs) ? parseFloat((itcInner.tx_cs).toFixed(2)) : 0;

        return total;
    }

    function reformSummary(iResp, callback) {
        g1FileHandler.getErrorContentsFor(shareData.dashBoardDt).then(function (prevContent) {
            // $log.debug("prvctrl -> reformSummary success:: ", prevContent);
            var retArry = [];
            for (var a = 0, alen = iResp.length; a < alen; a++) {
                var section = iResp[a],
                    code = section.cd;
                //Commented by Janhavi, defect-fix, view summary table
                // if (code == 'atadj')
                //     code = "txpd";
                // if (code == 'atadja')
                //     code = "txpda";
                var count = 0,
                    ctinInv = prevContent['error_report'][code],
                    result = {},
                    total = null;
                if (code == "hsn(b2b)") {
                    if (prevContent['error_report']['hsn'] != undefined) {
                        ctinInv = prevContent['error_report']['hsn'];
                        ctinInv.hsn_b2b = [];
                        angular.forEach(prevContent['error_report']['hsn'], function (hsnItem, i) {

                            if (hsnItem.hsn_b2b) {
                                ctinInv.hsn_b2b.push(prevContent['error_report']['hsn'][i]);
                            }
                        });
                    }
                }
                if (code == "hsn(b2c)") {
                    if (prevContent['error_report']['hsn'] != undefined) {
                        ctinInv = prevContent['error_report']['hsn'];
                        ctinInv.hsn_b2c = [];
                        angular.forEach(prevContent['error_report']['hsn'], function (hsnItem, i) {

                            if (hsnItem.hsn_b2c) {
                                ctinInv.hsn_b2c.push(prevContent['error_report']['hsn'][i]);
                            }
                        });
                    }

                }
                if (typeof ctinInv === 'undefined')
                    continue;
                if (shareData.dashBoardDt.form == "GSTR1") {
                    total = {
                        "cgTl": 0,
                        "sgTl": 0,
                        "igTl": 0,
                        "csTl": 0
                    };
                }
                else {
                    total = {
                        "cgTl": 0,
                        "sgTl": 0,
                        "igTl": 0,
                        "csTl": 0,
                        "itc_cgTl": 0,
                        "itc_sgTl": 0,
                        "itc_igTl": 0,
                        "itc_csTl": 0
                    };
                }

                if (shareData.dashBoardDt.form == "GSTR1") {
                    switch (section.cd) {
                        case "b2b":
                        case "b2ba":
                        case "b2cl":
                        case "b2cla":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {

                                    count += 1;
                                    angular.forEach(inv.itms, function (itm, i) {
                                        var itmInner = itm.itm_det;
                                        result = generateTotal(total, itmInner, section.cd, inv.inv_typ);
                                    });

                                });
                            });
                            break;
                        case "exp":
                        case "expa":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {
                                    count += 1;
                                    angular.forEach(inv.itms, function (itmInner, i) {
                                        result = generateTotal(total, itmInner, section.cd, invInner.exp_typ);
                                    });
                                });
                            });
                            break;
                        case "at":
                        case "ata":
                        case "atadj":
                        case "atadja":
                            angular.forEach(ctinInv, function (inv, i) {
                                count += 1;
                                angular.forEach(inv.itms, function (itmInner, i) {
                                    result = generateTotal(total, itmInner);
                                });
                            });
                            break;

                        case "b2cs":
                            angular.forEach(ctinInv, function (itmInner, i) {
                                result = generateTotal(total, itmInner);
                                count += 1;
                            });
                            break;
                        //Added by Janhavi,defect fix- view summary table
                        case "b2csa":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.itms, function (itmInner, i) {
                                    result = generateTotal(total, itmInner);
                                    count += 1;
                                });
                            });
                            break;
                        case "cdnr":
                        case "cdnra":

                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.nt, function (nt, i) {
                                    count += 1;
                                    angular.forEach(nt.itms, function (itm, i) {
                                        var itmInner = itm.itm_det;
                                        result = generateTotal(total, itmInner, section.cd, nt.inv_typ);
                                    });
                                });
                            });
                            break;
                        case "cdnur":
                        case 'cdnura':
                            angular.forEach(ctinInv, function (inv, i) {
                                count += 1;
                                angular.forEach(inv.itms, function (itms, i) {
                                    var itmInner = itms.itm_det;
                                    result = generateTotal(total, itmInner, section.cd, inv.typ);
                                });
                            });
                            break;
                        case "hsn":
                            if (ctinInv)
                                if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                                    angular.forEach(ctinInv, function (itmInner, i) {
                                        angular.forEach(itmInner.data, function (itm, i) {
                                            result = generateTotal(total, itm, section.cd);
                                            count += 1;
                                        });
                                    });
                                }
                                else {
                                    angular.forEach(ctinInv[0].data, function (itmInner, i) {
                                        result = generateTotal(total, itmInner, section.cd);
                                        count += 1;
                                    });
                                }
                            break;
                           case "hsn(b2b)":
                            if (ctinInv)                
                                        angular.forEach(ctinInv, function (itmInner, i) {
                                            angular.forEach(itmInner.hsn_b2b, function (itm, i) {
                                                result = generateTotal(total, itm, section.cd);
                                                count += 1;
                                            });
                                        });
                                break;
                        case "hsn(b2c)": 
                        if (ctinInv)                
                        angular.forEach(ctinInv, function (itmInner, i) {
                            angular.forEach(itmInner.hsn_b2c, function (itm, i) {
                                result = generateTotal(total, itm, section.cd);
                                count += 1;
                            });
                        });
                break;
                        case "nil":
                            if (ctinInv)
                                angular.forEach(ctinInv.data, function (itmInner, i) {
                                    result = generateTotal(total, itmInner, section.cd);
                                    count += 1;
                                });
                            break;
                        case "supeco":
                            if(ctinInv.clttx){
                                angular.forEach(ctinInv.clttx, function (invInner, i) {
                                    count += 1;
                                    result = generateTotal(total, invInner, section.cd);
                                });
                            }
                            if(ctinInv.paytx){
                                angular.forEach(ctinInv.paytx, function (invInner, i) {
                                    count += 1;
                                    result = generateTotal(total, invInner, section.cd);
                                });
                            }
                            break;
                        case "supecoa":
                            if(ctinInv.clttxa){
                                angular.forEach(ctinInv.clttxa, function (invInner, i) {
                                    count += 1;
                                    result = generateTotal(total, invInner, section.cd);
                                });
                            }
                            if(ctinInv.paytxa){
                                angular.forEach(ctinInv.paytxa, function (invInner, i) {
                                    count += 1;
                                    result = generateTotal(total, invInner, section.cd);
                                });
                            }
                            break;
                        case "ecomb2b":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {
                                    count += 1;
                                    angular.forEach(inv.itms, function (itm, i) {
                                        var itmInner = itm.itm_det;
                                        result = generateTotal(total, itmInner, 'ecomb2b', invInner, invInner.inv_typ);
                                    });
                                });
                            });
                            break;
                        case "ecomb2c":
                            angular.forEach(ctinInv, function (invInner, i) {
                                count += 1;
                                result = generateTotal(total, invInner)
                            });
                            break;
                        case "ecomurp2b":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {
                                    count += 1;
                                    angular.forEach(inv.itms, function (itm, i) {
                                        var itmInner = itm.itm_det;
                                        result = generateTotal(total, itmInner, 'ecomurp2b', invInner, invInner.inv_typ);
                                    });
                                });
                            });
                        break;
                        case "ecomurp2c":
                            angular.forEach(ctinInv, function (invInner, i) {
                                count += 1;
                                result = generateTotal(total, invInner)
                            });           
                        break;
                        case "ecomab2b":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {
                                    count += 1;
                                    angular.forEach(inv.itms, function (itm, i) {
                                        var itmInner = itm.itm_det;
                                        result = generateTotal(total, itmInner, 'ecomab2b', invInner, invInner.inv_typ);
                                    });
                                });
                            });
                        break;
                        case "ecomab2c":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.posItms, function (posItms, i) {
                                    count += 1;
                                    angular.forEach(posItms.itms, function (itm, i) {
                                        var itmInner = itm;
                                        result = generateTotal(total, itmInner, 'ecomab2c', invInner, invInner.inv_typ);
                                    });
                                });
                            });
                        break;
                        case "ecomaurp2b":
                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {
                                    count += 1;
                                    angular.forEach(inv.itms, function (itm, i) {
                                        var itmInner = itm.itm_det;
                                        result = generateTotal(total, itmInner, 'ecomaurp2b', invInner, invInner.inv_typ);
                                    });
                                });
                            });
                        break;
                        case "ecomaurp2c":
                                angular.forEach(ctinInv, function (invInner, i) {
                                    count += 1;
                                    angular.forEach(invInner.itms, function (itm, i) {
                                        var itmInner = itm;
                                        result = generateTotal(total, itmInner, 'ecomaurp2c', invInner);
                                    });
                                });           
                            break;
                    }
                }
                else {
                    switch (section.cd) {
                        case "b2b":
                        case "b2ba":
                        case "b2bur":
                        case "b2bura":
                            angular.forEach(ctinInv, function (invInner, i) {
                                if (typeof invInner.inv == 'undefined') {
                                    count += 1;
                                    angular.forEach(invInner.itms, function (itm, i) {
                                        var itmInner = itm.itm_det,
                                            itcInner = itm.itc;
                                        result = generateTotal(total, itmInner);
                                        result = generateItcTotal(total, itcInner);
                                    });
                                } else {
                                    angular.forEach(invInner.inv, function (inv, i) {
                                        count += 1;
                                        angular.forEach(inv.itms, function (itm, i) {
                                            var itmInner = itm.itm_det,
                                                itcInner = itm.itc;
                                            result = generateTotal(total, itmInner);
                                            result = generateItcTotal(total, itcInner);
                                        });
                                    });
                                }

                            });
                            break;

                        case "cdnr":
                        case "cdnra":

                            angular.forEach(ctinInv, function (invInner, i) {
                                angular.forEach(invInner.inv, function (inv, i) {
                                    count += 1;
                                    angular.forEach(inv.itms, function (itm, i) {
                                        var itmInner = itm.itm_det,
                                            itcInner = itm.itc;
                                        result = generateTotal(total, itmInner, section.cd);
                                        result = generateItcTotal(total, itcInner);
                                    });
                                });
                            });
                            break;
                        case "cdnur":

                            angular.forEach(ctinInv, function (inv, i) {
                                count += 1;
                                angular.forEach(inv.itms, function (itms, i) {
                                    var InnerInv = inv.ntty;
                                    var itmInner = itms.itm_det;
                                    result = generateTotal(total, itmInner, section.cd);
                                });
                            });
                            //                            angular.forEach(ctinInv, function (itm, i) {
                            //                                var itmInner = itm.itm_det;
                            //                                result = generateTotal(total, itmInner);
                            //                                count += 1;
                            //                            });
                            break;
                        case "atadj":
                            angular.forEach(ctinInv, function (inv, i) {
                                count += 1;
                                angular.forEach(inv.itms, function (itmInner, i) {
                                    result = generateTotal(total, itmInner);
                                    result = generateItcTotal(total, itmInner);

                                });
                            });
                            //                            angular.forEach(ctinInv, function (inv, i) {
                            //                                count += 1;
                            //                                angular.forEach(inv.itms, function (itms, i) {
                            //                                    var itmInner = itms.itm_det;
                            //                                    result = generateTotal(total, itmInner, section.cd);
                            //                                });
                            //                            });
                            break;
                        case "txi":
                        case "atxi":
                        case "imp_g":
                        case "imp_ga":
                        case "imp_s":
                        case "imp_sa":
                            angular.forEach(ctinInv, function (inv, i) {
                                count += 1;
                                angular.forEach(inv.itms, function (itmInner, i) {
                                    result = generateTotal(total, itmInner, section.cd);
                                    result = generateItcTotal(total, itmInner);

                                });
                            });
                            break;

                        case "hsnsum":
                        case "itc_rcd":
                            angular.forEach(ctinInv, function (itmInner, i) {
                                result = generateTotal(total, itmInner, section.cd);
                                count += 1;
                            });
                            break;

                    }

                }

                if (count) {
                    //result = generateTotal(total, {});
                    retArry.push({
                        cd: section.cd,
                        result: result,
                        count: count,
                        name: section.nm
                    });
                }
            }

            callback(retArry);

        }, function (response) {
            // $log.debug("prvctrl -> reformSummary fail:: ", response);
        });
    }

    //To generate File to upload gst portal
    $scope.generateCorrectedErrorJson = function () {

        var reqParam = shareData.dashBoardDt;
        $().blockPage(true);
        g1FileHandler.createErrorFile(reqParam)
            .then(function (response) {
                $().blockPage(false);
                $log.debug("errprvctrl -> file generated :: ", response);
                shareData.directory = response.down_dir; // hardcoded. Please change according to ur name
                shareData.flowName = "Error";

                shareData.fileNames = response.filenameArr; // hardcoded. Please change according to ur name
                $scope.page("/gstr/download");

                // saveAs(new Blob([response], {
                //     type: "application/json"
                // }), "returns" + "_" + date + "_" + shareData.dashBoardDt.form.substring(3) + "_" + shareData.dashBoardDt.gstin + "_" + "offline" + '.json');
            }, function (error) {
                $().blockPage(false);
                $log.debug("errprvctrl -> file generation  failed :: response");

            })
    };

    $scope.generateExcel = function () {
        var reqParam = shareData.dashBoardDt;
        reqParam.type = "Error";
        $().blockPage(true);
        g1FileHandler.createExcel(reqParam)
            .then(function (response) {
                $log.debug("errprvctrl -> file generated :: ", response);
                saveAs(new Blob([response], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }), shareData.dashBoardDt.month + "_" + shareData.dashBoardDt.fy + "_" + shareData.dashBoardDt.form + "_" + shareData.dashBoardDt.gstin + '.xlsx');
                $().blockPage(false);
            }, function (error) {
                $log.debug("errprvctrl -> file generation  failed :: response");
                $().blockPage(false);

            })
    };


}]);

myApp.controller("dashboardcrtl", ['$scope', 'g1FileHandler', '$log', '$location', 'shareData',
    function ($scope, g1FileHandler, $log, $location, shareData) {
        shareData.scLsSetIdx = 0;
        shareData.curFyMonths = null;
        shareData.yearsList = null;
        $scope.dropdown = null;
        $scope.GstrForms = null;
        $scope.amounts = {};
        $scope.obj = { isSEZ: null };
        //CR#18639- IFF 
        $scope.obj1 = { isTPQ: null };
        //CR#19427
        $scope.obj1 = { aatoGreaterThan5CR: null };

        $scope.newHSNStartDateConstant = null;

        if (shareData.gstinNum && shareData.isfromhome == "N") {
            $scope.gstinNum = shareData.gstinNum;
            $scope.amounts.gt = shareData.gt;
            $scope.amounts.cur_gt = shareData.cur_gt;
            $scope.obj.isSEZ = shareData.isSezTaxpayer;
            //CR#18639- IFF 
            $scope.obj1.isTPQ = shareData.isTPQ;
            $scope.obj1.aatoGreaterThan5CR = shareData.aatoGreaterThan5CR;
        }

        $scope.prevRtUpStatus = 'N';

        shareData.isPrvw = "false";
        initDashboard();
        //Check for radio button available on dashboard after jan 2020
        //CR#18639- IFF rtn_prd check 
        $scope.isQTaxpayer = function () {
            var rtn_prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));
            return ((rtn_prd >= $scope.iffstrtprd) ? true : false);
        }
        function initDashboard() {
            $scope.initInfo(null, null, null, null);
            //Get Dropdown list
            g1FileHandler.getDropdown().then(function (response) {
                $log.debug("dashboardcrtl -> getDropdown success:: ", response);
                $scope.dropdown = response;
                if (shareData.dashBoardDt && shareData.isfromhome == "N") {
                    angular.forEach($scope.dropdown, function (obj, i) {
                        if (obj.year === shareData.dashBoardDt.fy) {
                            $scope.yearSelected = obj;
                            angular.forEach(obj.months, function (mon, i) {
                                if (mon.month === shareData.dashBoardDt.month) {
                                    $scope.monthSelected = mon;
                                }
                            });
                        }
                    });
                }
                else {
                    $scope.yearSelected = $scope.dropdown[0];
                    var monthLen = $scope.yearSelected.months.length;
                    $scope.monthSelected = $scope.yearSelected.months[monthLen - 1];

                }
                //CR#18639- changes by prakash
                let prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));
                if (prd >= $scope.iffstrtprd)
                    loadForms(true);
                else
                    loadForms(false);
            }, function (response) {
                $log.debug("dashboardcrtl -> getDropdown fail:: ", response);
            });
            $scope.newHSNStartDateConstant = shareData.newHSNStartDateConstant;
        }

        $scope.isCurrentPeriodBeforeAATOCheck = function (start_period, current_period) {
            var pattern = /((0[1-9])|10|11|12)([2][0-9][0-9][0-9])/;
            if (start_period == undefined || current_period == undefined) {
                return false;
            }
            if (!pattern.test(current_period) || !pattern.test(start_period)) {
                return false;
            }
            var start_period_month = parseInt(start_period.slice(0, 2));
            var start_period_year = parseInt(start_period.slice(2, 6));
            var current_period_month = parseInt(current_period.slice(0, 2));
            var current_period_year = parseInt(current_period.slice(2, 6));
            if (current_period_year > start_period_year) {
                return false;
            } else if (current_period_year < start_period_year) {
                return true;
            } else {
                return current_period_month < start_period_month;
            }
        }

        //CR#18639- changes by prakash
        $scope.changeForm = function (isQtp) {
            //CR18639 condition for help text
            if (isQtp == false) {
                $scope.obj1.isTPQ = null;
            }
            loadForms(isQtp);
        }
        //CR#18639- changes by prakash
        function loadForms(isQtp) {
            //get GSTR Forms
            g1FileHandler.getGstForms(isQtp).then(function (response) {
                $log.debug("dashboardcrtl -> getDropdown success:: ", response);

                $scope.GstrForms = response;
                var flag = 0;
                angular.forEach($scope.GstrForms, function (form, index) {
                    if (form.cd == 'GSTR1A')
                        flag = index;
                })
                $scope.GstrForms.splice(flag, 1);

                if (shareData.dashBoardDt && shareData.isfromhome == "N" && isQtp == false && shareData.dashBoardDt.form == 'GSTR1IFF') {
                    $scope.formNum = 'GSTR1';
                }
                else {
                    $scope.formNum = response[0].cd;
                }

            }, function (response) {
                $log.debug("dashboardcrtl -> getDropdown fail:: ", response);
            });
        }
        $scope.onYearChage = function () {
            $scope.monthSelected = $scope.yearSelected.months[0];
            delete $scope.amounts.gt;
            delete $scope.amounts.cur_gt;

        }
        $scope.isAggregate = function () {
            return ($scope.yearSelected.year !== "2017-18") ? false : true;
        }

        // $scope.validGstin = false;
        $scope.onGstinChange = function () {
            var validGstin = $scope.validations.gstin($scope.gstinNum);
            $scope.dashboard.gstinNum.$setValidity('pattern', validGstin);
        }

        $scope.fileReturns = function () {
            // $scope.validations.gstin($scope.gstinNum) &&
            if ($scope.dashboard.$valid) {
                var reqParam = {
                    form: $scope.formNum,
                    gstin: $scope.gstinNum,
                    fy: $scope.yearSelected.year,
                    month: $scope.monthSelected.month,
                    fp: $scope.monthSelected.value,
                    gt: Number($scope.amounts.gt),
                    status: $scope.prevRtUpStatus,
                    cur_gt: Number($scope.amounts.cur_gt),
                    appendParameter: "N"
                };

                $log.debug("dashboardcrtl -> reqParam ", reqParam);
                //15CQHPK8080M5Z1
                shareData.dashBoardDt = reqParam;
                shareData.yearsList = $scope.dropdown;
                shareData.curFyMonths = $scope.yearSelected.months;
                shareData.gstinNum = $scope.gstinNum;
                shareData.gt = $scope.amounts.gt;
                shareData.cur_gt = $scope.amounts.cur_gt;
                shareData.isfromhome = "N";
                shareData.isSezTaxpayer = $scope.obj.isSEZ;
                //CR#18639- IFF confirmation popup 
                shareData.isTPQ = $scope.obj1.isTPQ;
                shareData.aatoGreaterThan5CR = $scope.obj1.aatoGreaterThan5CR;
                shareData.monthSelected = $scope.monthSelected;
                $scope.initInfo($scope.formNum, $scope.gstinNum, $scope.yearSelected.year, $scope.monthSelected.month, "N");

                let sezcnfrm = shareData.isSezTaxpayer ? "YES" : "NO";
                //CR#18639- IFF confirmation popup 
                let qtaxpayercnfrm = shareData.isTPQ ? "YES" : "NO";
                //CR#19427
                let aatogreaterthan5CR = shareData.aatoGreaterThan5CR ? "YES" : "NO";

                var insertTemplate = function () {
                    //CR#18639- IFF changes by prakash
                    let frm;
                    if (reqParam.form == 'GSTR1IFF')
                        frm = 'GSTR-1/IFF';
                    else
                        frm = reqParam.form;
                    if (isNaN(reqParam.gt) && isNaN(reqParam.cur_gt)) {
                        //CR#18639- IFF confirmation popup
                        var temp1 = "<br/><b>GST Statement/Returns: </b>" + frm + "\
                        <br/><b>GSTIN of Supplier: </b>"+ reqParam.gstin + "\
                        <br/><b>Financial Year: </b>"+ reqParam.fy + "\
                        <br/><b>Tax Period: </b>"+ reqParam.month + "\
                        <br/><b>Are you a SEZ Taxpayer? </b>"+ sezcnfrm;

                        if ($scope.isQTaxpayer() && (shareData.dashBoardDt.form == "GSTR1" || shareData.dashBoardDt.form == "GSTR1IFF")) {
                            var temp2 = "<br/><b>Is taxpayer Quarterly filer? </b>" + qtaxpayercnfrm;
                            //CR # 19427
                            if (!shareData.isTPQ && !$scope.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, $scope.monthSelected.value)) {
                                temp2 += "<br/><b>Is aggregate turnover greater than 5CR in preceding financial year? </b>" + aatogreaterthan5CR;
                            }
                            return temp1 + temp2;
                        }

                        return temp1;
                    }
                    else {
                        return "<br/><b>GST Statement/Returns: </b>" + reqParam.form + "\
									<br/><b>GSTIN of Supplier: </b>"+ reqParam.gstin + "\
									<br/><b>Financial Year: </b>"+ reqParam.fy + "\
									<br/><b>Tax Period: </b>"+ reqParam.month + "\
									<br/><b>Are you a SEZ Taxpayer? </b>"+ sezcnfrm + "\
									<br/><b>Aggregate Turnover in the preceding Financial Year: ₹</b>"+ reqParam.gt + "\
									<br/><b>Aggregate Turnover- April to June, 2017: ₹</b>"+ reqParam.cur_gt;


                    }
                };




                $scope.createAlert("Warning", "<b><center>Please confirm your details before you proceed</center></b>" + insertTemplate(), function () {
                    $scope.page("/gstr/summary");

                });
                shareData.masterPrd = reqParam;
               
            }
        }


        $scope.isGstr1 = function () {
            return ($scope.formNum === "GSTR1" || $scope.formNum === "GSTR1IFF") ? true : false;
        }

        $scope.nameAsPerFormSelected = function () {
            var name;
            if ($scope.formNum == "GSTR2") {
                name = "GSTIN of Receiver";
            }
            else {
                name = "GSTIN of Supplier";
            }
            return name;
        };
    }
]);

myApp.controller("uploaddashboardctrl", ['$scope', 'g1FileHandler', '$log', '$location', 'shareData', function ($scope, g1FileHandler, $log, $location, shareData) {
    shareData.scLsSetIdx = 0;
    shareData.curFyMonths = null;
    $scope.dropdown = null;
    $scope.GstrForms = null;
    $scope.gstinNum = null;
    $scope.obj = { isSEZ: null };
    $scope.obj1 = { isTPQ: null };
    shareData.isPrvwUpload = "false";
    $scope.obj1 = { aatoGreaterThan5CR: false };
    $scope.newHSNStartDateConstant = null;

    $scope.isCurrentPeriodBeforeAATOCheck = function (start_period, current_period) {
        var pattern = /((0[1-9])|10|11|12)([2][0-9][0-9][0-9])/;
        if (start_period == undefined || current_period == undefined) {
            return false;
        }
        if (!pattern.test(current_period) || !pattern.test(start_period)) {
            return false;
        }
        var start_period_month = parseInt(start_period.slice(0, 2));
        var start_period_year = parseInt(start_period.slice(2, 6));
        var current_period_month = parseInt(current_period.slice(0, 2));
        var current_period_year = parseInt(current_period.slice(2, 6));
        if (current_period_year > start_period_year) {
            return false;
        } else if (current_period_year < start_period_year) {
            return true;
        } else {
            return current_period_month < start_period_month;
        }
    }
    // initDashboard();

    var rtnFileName = sessionStorage.getItem('ReturnFileDirectory');
    //fetch flag from offline.js to enable disable radio button for IFF
    var radioFlag = sessionStorage.getItem('FlagForIFF');
    if (radioFlag == "true") {
        $scope.radioDisable = true;
        $scope.obj1 = { isTPQ: false };
    }
    else {
        $scope.radioDisable = false;
        $scope.obj1 = { isTPQ: null };
    }
    //IFF functions ends here
    if (rtnFileName) {
        rtnFileName = rtnFileName.replace("public/", '');
        var fileNameDetails = sessionStorage.getItem('ReturnFileName'),
            fileNameData = sessionStorage.getItem('ReturnFileData');
        fileNameDetails = fileNameDetails.split('_');
        fileNameData = fileNameData.split('_');
        var dt = fileNameData[0];
        var monthValue = dt;
        initDashboard();
    }
    else {
        $scope.page("/gstr/home");
    }
    $scope.gstinNum = fileNameDetails[3];

    // var fileCred = 'R1';

    function initDashboard() {
        $scope.initInfo(null, null, null, null);
        //Get Dropdown list
        g1FileHandler.getDropdown().then(function (response) {

            $log.debug("dashboardcrtl -> getDropdown success:: ", response);

            $scope.dropdown = response;
            angular.forEach($scope.dropdown, function (yObj, i) {
                angular.forEach(yObj.months, function (monObj, i) {
                    if (monObj.value === monthValue) {
                        $scope.yearSelected = yObj;
                        $scope.monthSelected = monObj;

                    }
                });

            });
            //CR#18639- IFF changes by prakash
            let prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));
            if (prd >= $scope.iffstrtprd)
                loadForms(true);
            else
                loadForms(false);
            // $scope.yearSelected = $scope.dropdown[0];
            // $scope.monthSelected = $scope.yearSelected.months[0];

        }, function (response) {
            $log.debug("dashboardcrtl -> getDropdown fail:: ", response);
        });
        $scope.newHSNStartDateConstant = shareData.newHSNStartDateConstant;
    }
    //CR#18639- IFF changes by prakash
    function loadForms(isQtp) {
        //get GSTR Forms
        g1FileHandler.getGstForms(isQtp).then(function (response) {
            $log.debug("dashboardcrtl -> getDropdown success:: ", response);

            $scope.GstrForms = response;
            if (fileNameDetails[2] == 'R2A') {
                $scope.GstrForms.push({
                    "cd": "GSTR2A",
                    "nm": "GSTR2A",
                    "desc": "GSTIN of Supplier"
                });
            }
            if (fileNameDetails[2] == "R1E") {
                fileNameDetails[2] = "R1";
            }
            //CR#18639- IFF changes by prakash
            if (isQtp && fileNameDetails[2] == "R1")
                $scope.formNum = "GSTR1IFF";
            else
                $scope.formNum = "GST" + fileNameDetails[2];

        }, function (response) {
            $log.debug("dashboardcrtl -> getDropdown fail:: ", response);
        });
    }
    $scope.onYearChage = function () {
        $scope.monthSelected = $scope.yearSelected.months[0];
    }
    //Check for radio button available on dashboard after jan 2020
    //CR#18639-IFF uploaddashboard-rtn_prd check
    $scope.isQTaxpayer = function () {
        var rtn_prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));
        return ((rtn_prd >= $scope.iffstrtprd) ? true : false);
    }

    $scope.validGstin = false;
    $scope.onGstinChange = function () {
        $scope.validGstin = $scope.validations.gstin($scope.gstinNum);
    }

    $scope.nameAsPerFormSelected = function () {
        var name;
        if ($scope.formNum == "GSTR2") {
            name = "GSTIN of Receiver";
        }
        else {
            name = "GSTIN of Supplier";
        }
        return name;
    };

    $scope.isGstr1 = function () {
        return ($scope.formNum === "GSTR1" || $scope.formNum === "GSTR1IFF") ? true : false;
    }
    $scope.getUploadedDetails = function () {

        if ($scope.validations.gstin($scope.gstinNum) && $scope.dashboard.$valid) {
            var reqParam = {
                form: $scope.formNum,
                gstin: $scope.gstinNum,
                fy: $scope.yearSelected.year,
                month: $scope.monthSelected.month,
                fp: $scope.monthSelected.value,
                returnFileName: rtnFileName
            };
            //$log.debug("ulpoad dashboardcrtl -> reqParam ", reqParam);
            //15CQHPK8080M5Z1
            shareData.dashBoardDt = reqParam;
            shareData.monthSelected = $scope.monthSelected;
            shareData.curFyMonths = $scope.yearSelected.months;
            shareData.yearsList = $scope.dropdown;
            shareData.isSezTaxpayer = $scope.obj.isSEZ;
            shareData.aatoGreaterThan5CR = $scope.obj1.aatoGreaterThan5CR;
            //CR#18639-  IFF uploaddashboard_confirmation popup
            shareData.isTPQ = $scope.obj1.isTPQ;

            $scope.initInfo($scope.formNum, $scope.gstinNum, $scope.yearSelected.year, $scope.monthSelected.month, "Y");

            let sezcnfrm = shareData.isSezTaxpayer ? "YES" : "NO";
            //CR#18639-  IFF uploaddashboard_confirmation popup
            let qtaxpayercnfrm = shareData.isTPQ ? "YES" : "NO";

            let aatogreaterthan5CR = shareData.aatoGreaterThan5CR ? "YES" : "NO";

            var insertTemplate = function () {
                //CR#18639- IFF changes by prakash
                let frm;
                if (reqParam.form == 'GSTR1IFF')
                    frm = 'GSTR-1/IFF';
                else
                    frm = reqParam.form;
                //CR#18639-  IFF uploaddashboard_confirmation popup
                var temp1 = "<br/><b>GST Statement/Returns: </b>" + frm + "\
                        <br/><b>GSTIN of Supplier: </b>"+ reqParam.gstin + "\
                        <br/><b>Financial Year: </b>"+ reqParam.fy + "\
                        <br/><b>Tax Period: </b>"+ reqParam.month + "\
                        <br/><b>Are you a SEZ Taxpayer? </b>"+ sezcnfrm;

                if ($scope.isQTaxpayer() && (shareData.dashBoardDt.form == "GSTR1" || shareData.dashBoardDt.form == "GSTR1IFF")) {
                    var temp2 = "<br/><b>Is taxpayer Quarterly filer? </b>" + qtaxpayercnfrm;
                    if (!shareData.isTPQ && !$scope.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, $scope.monthSelected.value)) {
                        temp2 += "<br/><b>Is aggregate turnover greater than 5CR in preceding financial year? </b>" + aatogreaterthan5CR;
                    }
                    return temp1 + temp2;
                }

                return temp1;

            }
            $scope.createAlert("Warning", "<b><center>Please confirm your details before you proceed</center></b>" + insertTemplate(), function () {

                $scope.page("/gstr/upload/preview");

            });
            shareData.MstrProdprd = reqParam;
               
        }
    }

}
]);
//Upload mymaster controller for upload dashboard
myApp.controller("upldmstrdashboardctrl", ['$scope', 'g1FileHandler', '$log', '$location', 'shareData', function ($scope, g1FileHandler, $log, $location, shareData) {
    $scope.userGstin = sessionStorage.getItem('gstin');
    $scope.mstrespnse = JSON.parse(sessionStorage.getItem('mstrespnse'));
    $scope.onGstinChange = function () {
        var validGstin = $scope.validations.gstin($scope.userGstin) && !$scope.validations.tdsregex($scope.userGstin) && !$scope.validations.tcsregex($scope.userGstin) && !$scope.validations.oidarregex($scope.userGstin) && !$scope.validations.nriregex($scope.userGstin) && !$scope.validations.unibodyregex($scope.userGstin)
        $scope.upldmstrdashboard.userGstin.$setValidity('pattern', validGstin)

    }
    $scope.nameAsPerFormSelected = function () {
        var name;
        name = "GSTIN";
        return name;
    };
    $scope.getmstrUploadedDetails = function () {
        $scope.onGstinChange();
        if ($scope.validations.gstin($scope.userGstin) && $scope.upldmstrdashboard.$valid) {
            var reqParam = {
                gstin: $scope.userGstin,
                response: $scope.mstrespnse,

            };
          //  console.log("reqParam", $scope.mstrespnse)

            shareData.mstrdashBoardDt = reqParam;
            $scope.initInfo($scope.userGstin, "Y");
            if (shareData.mstrdashBoardDt) {
                $scope.page("/gstr/mastersummary");
            }
            // var insertTemplate = function () {
            //     if (isNaN(reqParam.gt) && isNaN(reqParam.cur_gt)) {
            //         var temp1 = "<br/><b>GSTIN: </b>" + reqParam.gstin;
            //     };
            //     return temp1;
            // }
            // $scope.createAlert("Warning", "<b><center>Please confirm your details before you proceed</center></b>" + insertTemplate(), function () {
            //     $scope.page("/gstr/upload/upldmstrpreview");

            // });
        }
    }
}])

myApp.controller("masterdashboardctrl", ['$scope', 'g1FileHandler', '$log', '$location', 'shareData', function ($scope, g1FileHandler, $log, $location, shareData) {
    $scope.userGstin = $scope.userGstin;

    $scope.onGstinChange = function () {
        var validGstin = $scope.validations.gstin($scope.userGstin) && !$scope.validations.tdsregex($scope.userGstin) && !$scope.validations.tcsregex($scope.userGstin) && !$scope.validations.oidarregex($scope.userGstin) && !$scope.validations.nriregex($scope.userGstin) && !$scope.validations.unibodyregex($scope.userGstin)
        
        $scope.masterdashboard.userGstin.$setValidity('pattern', validGstin)

        sessionStorage.setItem('gstin', $scope.userGstin)

      
    }
    //Upload master json
    $scope.masterfileReturns = function () {
        if ($scope.masterdashboard.$valid) {
            var reqParam = {
                gstin: $scope.userGstin,
            };
           // console.log("reqParam", reqParam)

            $log.debug("dashboardcrtl -> reqParam ", reqParam);

            shareData.dashBoardDt = reqParam;
            $scope.userGstin = $scope.userGstin;
            //console.log('share', $scope.userGstin)

            var insertTemplate = function () {
                if (isNaN(reqParam.gt) && isNaN(reqParam.cur_gt)) {
                    var temp1 = "<br/><b>GSTIN: </b>" + reqParam.gstin;
                };
                return temp1;
            }

            $scope.initInfo($scope.userGstin);

            $scope.createAlert("Warning", "<b><center>Please confirm your details before you proceed</center></b>" + insertTemplate(), function () {
                $scope.page("/gstr/mastersummary");

            });

        }
    }
    $scope.nameAsPerFormSelected = function () {
        var name;
        name = "GSTIN";
        return name;
    };

}
]);

myApp.controller("errordashboardctrl", ['$scope', 'g1FileHandler', '$log', '$location', 'shareData', function ($scope, g1FileHandler, $log, $location, shareData) {
    shareData.scLsSetIdx = 0;
    shareData.curFyMonths = null;
    $scope.dropdown = null;
    $scope.GstrForms = null;
    $scope.gstinNum = null;
    $scope.obj = { isSEZ: null };
    $scope.obj1 = { isTPQ: null };

    // $scope.gt = 0;
    $scope.prevRtUpStatus = 'N';
    shareData.isPrvwUpload = "false";

    var errFileName = sessionStorage.getItem('ErrorFileDirectory');
    //fetch flag from offline.js to enable disable radio button for IFF
    var radioFlag = sessionStorage.getItem('FlagForIFF');
    if (radioFlag == "true") {
        $scope.radioDisable = true;
        $scope.obj1 = { isTPQ: false };
    }
    else {
        $scope.radioDisable = false;
        $scope.obj1 = { isTPQ: null };
    }
    //IFF functions ends here

    if (errFileName) {
        errFileName = errFileName.replace("public/", '');
        var fileNameDetails = sessionStorage.getItem('ErrorFileName'),
            fileNameData = sessionStorage.getItem('fileNameData');
        fileNameDetails = fileNameDetails.split('_');
        fileNameData = fileNameData.split('_');
        var monthValue = fileNameData[0];
        initDashboard();
    }
    else {
        $scope.page("/gstr/home");
    }
    $scope.gstinNum = fileNameDetails[3]; // need to populate by reading the file.as of now file name is not confirmed thats why hardcoded.



    // var fileCred = 'R1';

    //CR#18639-  for IFF errordashboard rtn_prd check
    $scope.isQTaxpayer = function () {
        var rtn_prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));
        return ((rtn_prd >= $scope.iffstrtprd) ? true : false);
    }
    function initDashboard() {
        $scope.initInfo(null, null, null, null);

        //Get Dropdown list
        g1FileHandler.getDropdown().then(function (response) {
            $log.debug("errordashboardctrl -> getDropdown success:: ", response);

            $scope.dropdown = response;
            angular.forEach($scope.dropdown, function (obj, key) {
                angular.forEach(obj.months, function (monObj, i) {
                    if (monObj.value === monthValue) {
                        $scope.yearSelected = obj;
                        $scope.monthSelected = monObj;
                    }
                })

            });

            // $scope.yearSelected = $scope.dropdown[0];
            // $scope.monthSelected = $scope.yearSelected.months[0];
            // $scope.yearSelected = fileCred[2];
            //CR#18639- IFF changes by prakash
            let prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));

            if (prd >= $scope.iffstrtprd)
                loadForms(true);
            else
                loadForms(false);

        }, function (response) {
            $log.debug("errordashboardctrl -> getDropdown fail:: ", response);
        });
        $scope.newHSNStartDateConstant = shareData.newHSNStartDateConstant;
    }
    //CR#18639- IFF changes by prakash
    function loadForms(isQtp) {
        //get GSTR Forms
        g1FileHandler.getGstForms(isQtp).then(function (response) {
            $log.debug("errordashboardctrl -> getDropdown success:: ", response);

            $scope.GstrForms = response;
            //  $scope.formNum = response[0].cd;

            /*if(fileNameDetails[2] == "R1E"){
                fileNameDetails[2]="R1"
            }*/
            if (isQtp && fileNameDetails[2] == "R1")
                $scope.formNum = "GSTR1IFF";
            else
                $scope.formNum = "GST" + fileNameDetails[2];


        }, function (response) {
            $log.debug("errordashboardctrl -> getDropdown fail:: ", response);
        });
    }
    $scope.onYearChage = function () {
        $scope.monthSelected = $scope.yearSelected.months[0];
    }

    $scope.isCurrentPeriodBeforeAATOCheck = function (start_period, current_period) {
        var pattern = /((0[1-9])|10|11|12)([2][0-9][0-9][0-9])/;
        if (start_period == undefined || current_period == undefined) {
            return false;
        }
        if (!pattern.test(current_period) || !pattern.test(start_period)) {
            return false;
        }
        var start_period_month = parseInt(start_period.slice(0, 2));
        var start_period_year = parseInt(start_period.slice(2, 6));
        var current_period_month = parseInt(current_period.slice(0, 2));
        var current_period_year = parseInt(current_period.slice(2, 6));
        if (current_period_year > start_period_year) {
            return false;
        } else if (current_period_year < start_period_year) {
            return true;
        } else {
            return current_period_month < start_period_month;
        }
    }

    $scope.isQTaxpayer = function () {
        var rtn_prd = parseInt($scope.monthSelected.value.slice(2) + $scope.monthSelected.value.slice(0, 2));
        return ((rtn_prd >= $scope.iffstrtprd) ? true : false);
    }

    $scope.validGstin = false;
    $scope.onGstinChange = function () {
        $scope.validGstin = $scope.validations.gstin($scope.gstinNum);
    }

    $scope.nameAsPerFormSelected = function () {
        var name;
        if ($scope.formNum == "GSTR2") {
            name = "GSTIN of Receiver";
        }
        else {
            name = "GSTIN of Supplier";
        }
        return name;
    };

    $scope.isGstr1 = function () {
        return ($scope.formNum === "GSTR1" || $scope.formNum === "GSTR1IFF") ? true : false;
    }

    $scope.getUploadedDetails = function () {

        if ($scope.dashboard.$valid) {
            var reqParam = {
                form: $scope.formNum,
                gstin: $scope.gstinNum,
                fy: $scope.yearSelected.year,
                month: $scope.monthSelected.month,
                fp: $scope.monthSelected.value,
                errFileName: errFileName
                //  gt: Number($scope.gt),
                //  status: $scope.prevRtUpStatus
            };
            $log.debug("error dashboardcrtl -> reqParam ", reqParam);
            shareData.dashBoardDt = reqParam;
            shareData.monthSelected = $scope.monthSelected;
            shareData.yearsList = $scope.dropdown;
            shareData.isSezTaxpayer = $scope.obj.isSEZ;
            shareData.isTPQ = $scope.obj1.isTPQ;
            $scope.initInfo($scope.formNum, $scope.gstinNum, $scope.yearSelected.year, $scope.monthSelected.month, "E");
            shareData.aatoGreaterThan5CR = $scope.obj1.aatoGreaterThan5CR;
            shareData.curFyMonths = $scope.yearSelected.months;
            $scope.initInfo($scope.formNum, $scope.gstinNum, $scope.yearSelected.year, $scope.monthSelected.month, "E");

            // g1FileHandler.checkErrorExistence(shareData.dashBoardDt).then(function (response) {
            //     $log.debug("errordashboardcrtl -> checkExistence success:: ", response);
            //     $scope.initInfo($scope.formNum, $scope.gstinNum, $scope.yearSelected.year, $scope.monthSelected.month, "E");
            //     $scope.page("/gstr/error/summary");
            //     // $scope.page("/gstr/error/preview");

            // }, function (response) {
            //     $log.debug("errordashboardcrtl -> checkExistence fail:: ", response);
            //     $scope.createAlert("WarningOk", response, function () {
            //         $scope.dashboard.$submitted = false;
            //         $scope.page("/gstr/error/dashboard");
            //     });

            // });
            let sezcnfrm = shareData.isSezTaxpayer ? "YES" : "NO";
            //CR#18639-  for IFF errordashboard_confirmation popup
            let qtaxpayercnfrm = shareData.isTPQ ? "YES" : "NO";

            let aatogreaterthan5CR = shareData.aatoGreaterThan5CR ? "YES" : "NO";

            var insertTemplate = function () {
                //CR#18639- IFF changes by prakash
                let frm;
                if (reqParam.form == 'GSTR1IFF')
                    frm = 'GSTR-1/IFF';
                else
                    frm = reqParam.form;
                //CR#18639-  for IFF errordashboard_confirmation popup
                var temp1 = "<br/><b>GST Statement/Returns: </b>" + frm + "\
                        <br/><b>GSTIN of Supplier: </b>"+ reqParam.gstin + "\
                        <br/><b>Financial Year: </b>"+ reqParam.fy + "\
                        <br/><b>Tax Period: </b>"+ reqParam.month + "\
                        <br/><b>Are you a SEZ Taxpayer? </b>"+ sezcnfrm;

                if ($scope.isQTaxpayer() && (shareData.dashBoardDt.form == "GSTR1" || shareData.dashBoardDt.form == "GSTR1IFF")) {
                    var temp2 = "<br/><b>Is taxpayer Quarterly filer? </b>" + qtaxpayercnfrm;
                    if (!shareData.isTPQ && !$scope.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, $scope.monthSelected.value)) {
                        temp2 += "<br/><b>Is aggregate turnover greater than 5CR in preceding financial year? </b>" + aatogreaterthan5CR;
                    }
                    return temp1 + temp2;
                }

                return temp1;

            }





            $scope.createAlert("Warning", "<b><center>Please confirm details before you proceed</center></b>" + insertTemplate(), function () {
                $scope.page("/gstr/error/preview");

            });
        }
    }

}
]);


myApp.controller("summarycrtl", ['$scope', '$rootScope', 'g1FileHandler', '$log', 'shareData', 'ReturnStructure', 'R1InvHandler', 'R1Util','$location', function ($scope, $rootScope, g1FileHandler, $log, shareData, ReturnStructure, R1InvHandler, R1Util,$location) {

    $scope.sectiondisable = function () {

        if ($scope.sectionList[5].nm == "Nil Rated Invoices") {
            $scope.sectionList[5].disabled = true;

        }

    };

    if (shareData.dashBoardDt) {
        $scope.dashBoardDt = shareData.dashBoardDt;
        getSectionList();
    } else {
        $scope.page("/gstr/dashboard");
    }

    //get sectionlist
    $scope.sectionList = null;
    $scope.sectionListSelected = null;
    $scope.templateLoaded = false;
    $scope.search_filter_value = { val: '' }; // use object for pass by ref and avoid cloning

    $scope.childSelectIsDisabled = true;
    $scope.onURlistchange = function (typ) {
        if (typ == "EXPWP" || typ == "EXPWOP") {
            $scope.childSelectIsDisabled = true;
        }
        else {
            $scope.childSelectIsDisabled = false;
        }

    }

    $scope.onTypelistchange = function (typ) {
        if (typ == "OE") {
            $scope.childSelectIsDisabled = true;

        }
        else {
            $scope.childSelectIsDisabled = false;

        }

    }

    $scope.onURlistchangee = function (typ) {
        return (typ == "EXPWOP" || typ == "EXPWP") ? true : false;
    }

    function getSectionList() {
        var rtn_prd = parseInt(shareData.dashBoardDt.fp.slice(0, 2));
        if (shareData.isTPQ == false) {
            shareData.dashBoardDt.form = "GSTR1";
        }
        else if (shareData.isTPQ == true && rtn_prd % 3 === 0) {
            shareData.dashBoardDt.form = "GSTR1";
        }
        else if (shareData.isTPQ == true && shareData.dashBoardDt.form == "GSTR1" && rtn_prd % 3 != 0) {
            shareData.dashBoardDt.form = "GSTR1IFF";
        }
        g1FileHandler.getSectionList(shareData.dashBoardDt.form).then(function (response) {
            $log.debug("summarycrtl -> getOptionList success:: ", response);
            if (response) {
                $scope.sectionList = response;
                $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
            }
            //CR#18639-changes for IFF_form 
            if (shareData.dashBoardDt.form == "GSTR1IFF") {
                shareData.dashBoardDt.form = "GSTR1";
            }
        }, function (response) {
            $log.debug("summarycrtl -> getOptionList fail:: ", response);
        });
    }
    $scope.addbtnenabled= false; 
    $scope.prodaddbtnenabled = false;
    $scope.onSectionChange = function (iData) {
        if(iData && iData.cd =='b2b' || iData==undefined){
            $scope.addbtnenabled= true;   
            $scope.prodaddbtnenabled= false;   
        }else if(iData && iData.cd =='b2ba'){
            $scope.addbtnenabled= true;
            $scope.prodaddbtnenabled= false;      
        }else if(iData && iData.cd =='cdnr'){
            $scope.addbtnenabled= true; 
            $scope.prodaddbtnenabled= false;     
        }
        else if(iData && iData.cd =='cdnra'){
            $scope.addbtnenabled= true;  
            $scope.prodaddbtnenabled= false;    
        } else if(iData && iData.cd =='hsn'){
            $scope.addbtnenabled= false; 
            $scope.prodaddbtnenabled= true;    
        }
        else {
            $scope.addbtnenabled= false; 
            $scope.prodaddbtnenabled= false;   
        }
        if(iData){
            shareData.table = iData.cd;
        }
        $scope.sectionListSelected = iData;
     
        $scope.templateLoaded = false;
        shareData.pageNum = null;
        $scope.currentPage = 1;

        angular.forEach($scope.sectionList, function (section, i) {
            if (section.cd === iData.cd) {
                shareData.scLsSetIdx = i;
                $scope.search_filter_value.val = '';
                shareData.filter_val = '';
                $('.summaryFilterInput').val('');
            }
        });
        
    }

    $scope.goToSumPage = function () {
        shareData.isUploadImport = null;
        $scope.page('gstr/invoices/import');
    }

    // Return Period enabled 
    $scope.supaddenabled = false;
  
    $scope.mstrEnabldt = "01-05-2021";
    $scope.validateUserMstrRtnPrd = function () {
        $scope.checked.selectall = 'N'
        shareData.checkCount = 0;
        var retPrdStr = (shareData.masterPrd && shareData.masterPrd.fp.substring(2)) + "-" + (shareData.masterPrd && shareData.masterPrd.fp.substring(0, 2)) + "-" + "01";
        var retPrdStrUM = $scope.mstrEnabldt.substring(6) + "-" + $scope.mstrEnabldt.substring(3, 5) + "-" + $scope.mstrEnabldt.substring(0, 2);
        if (new Date(retPrdStr) >= new Date(retPrdStrUM)) {
            $scope.supaddenabled = true;
          
        } else {
            $scope.supaddenabled = false;
          
        }
    

    }

    $scope.deleteReturn = function () {
        var param = {
            gstin: shareData.dashBoardDt.gstin,
            form: shareData.dashBoardDt.form,
            year: shareData.dashBoardDt.fy,
            month: shareData.dashBoardDt.month
        },
            formName = param.form.toLowerCase();
        g1FileHandler.deleteReturn(param).then(function (response) {
            $log.debug("summarycrtl -> deleteReturn succ :: ", response);
            $scope.createAlert("Success", "Return File Deleted");
            $scope.checked.selectall = 'N';
            shareData.checkCount = 0;
            var cd = $scope.sectionListSelected.cd;
            if (cd == 'hsnsum') {
                cd = 'hsn';
            }
            if (cd == 'doc_issue') {
                cd = 'doc';
            }


            if ((!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) && ($scope.sectionListSelected.cd == 'hsn')) {
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/newSummary.html";
            }
            else if(cd == 'ecomb2b' || cd == 'ecomb2c' || cd == 'ecomurp2b' || cd == 'ecomurp2c'){
                if(cd == 'ecomb2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/summary.html";
                if(cd == 'ecomb2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/b2csummary.html";
                if(cd == 'ecomurp2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/c2bsummary.html";
                if(cd == 'ecomurp2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/c2csummary.html";
            
            }else if(cd == 'ecomab2b' || cd == 'ecomab2c' || cd == 'ecomaurp2b' || cd == 'ecomaurp2c'){
                if(cd == 'ecomab2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/b2basummary.html";
                if(cd == 'ecomab2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/b2casummary.html";
                if(cd == 'ecomaurp2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/urp2basummary.html";
                if(cd == 'ecomaurp2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/urp2casummary.html";
            }
            else if(cd === 'hsn(b2b)'){
                cd = "hsn";
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/newSummary.html";
            }else if(cd == 'hsn(b2c)'){
                cd = "hsn";
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/b2c.html";
            }
            else {
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/summary.html";
            }

        }, function (error) {
            $log.debug("summarycrtl -> deleteReturn fail :: ", error);
            $scope.createAlert("Error", "Return File Deletion Failed");
        });

        if ($scope.sectionListSelected.url[0] !== '/') {
            $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
        }
    }

    $scope.deleteSectionData = function () {
        var param = {
            gstin: shareData.dashBoardDt.gstin,
            form: shareData.dashBoardDt.form,
            fy: shareData.dashBoardDt.fy,
            month: shareData.dashBoardDt.month,
            tbl_cd: $scope.sectionListSelected.cd
        },
            formName = param.form.toLowerCase();

        g1FileHandler.deleteSectionData(param).then(function (response) {
            $log.debug("summarycrtl -> deleteSectionData succ :: ", response);
            $scope.createAlert("Success", response);
            $scope.checked.selectall = 'N';
            shareData.checkCount = 0;
            var cd = $scope.sectionListSelected.cd;
            if (cd == 'hsnsum') {
                cd = 'hsn';
            }
            if (cd == 'doc_issue') {
                cd = 'doc';
            }

            if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value) && $scope.sectionListSelected.cd == 'hsn')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/newSummary.html";
            else if(cd == 'ecomb2b' || cd == 'ecomb2c' || cd == 'ecomurp2b' || cd == 'ecomurp2c'){
                if(cd == 'ecomb2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/summary.html";
                if(cd == 'ecomb2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/b2csummary.html";
                if(cd == 'ecomurp2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/c2bsummary.html";
                if(cd == 'ecomurp2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecom" + "/c2csummary.html";
            
            }else if(cd == 'ecomab2b' || cd == 'ecomab2c' || cd == 'ecomaurp2b' || cd == 'ecomaurp2c'){
                if(cd == 'ecomab2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/b2basummary.html";
                if(cd == 'ecomab2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/b2casummary.html";
                if(cd == 'ecomaurp2b')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/urp2basummary.html";
                if(cd == 'ecomaurp2c')
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + "ecoma" + "/urp2casummary.html";
            }
             else if(cd === 'hsn(b2b)'){
                cd = "hsn";
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/newSummary.html";
            }else if(cd == 'hsn(b2c)'){
                cd = "hsn";
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/b2c.html";
            }
            else
                $scope.sectionListSelected.url = "pages/returns/" + formName + "/" + cd + "/summary.html";

        }, function (error) {
            $log.debug("summarycrtl -> deleteSectionData fail :: ", error);
            $scope.createAlert("Error", error.error_code);
        });
        if ($scope.sectionListSelected.url[0] !== '/') {
            $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
        }
    }

    $scope.finishLoading = function () {
        $scope.templateLoaded = true;
    }

    $scope.goToBackPage = function () {
        if (shareData.isPrvw == "true") {
            $scope.page('/gstr/preview');
        }
        else if (shareData.isPrvw == "false") {
            $scope.page('/gstr/dashboard');
        }
        else {
            $scope.page('/gstr/upload/summary');
        }
    }

    //Pagination related controls
    $scope.currentPage = (shareData.pageNum) ? shareData.pageNum : 1;
    $scope.pageSize = 25; // CHANGE BY VASU //pagesize

    shareData.filter_val = '';

    $scope.filterChanged = function () {
        shareData.filter_val = $scope.search_filter_value.val;
        $scope.$broadcast('filterValChanged');
    };


    $scope.pageChangeHandler = function (newPage) {
        shareData.pageNum = newPage;
        $rootScope.isLastPage(newPage, $scope.pageSize);
    }


}]);

//Uplad Master Json

myApp.controller("mastersummarycrtl", ['$scope', '$rootScope', 'g1FileHandler', '$log', 'shareData', 'ReturnStructure', 'R1InvHandler', 'R1Util', '$timeout', 'utilFunctions', '$compile', function ($scope, $rootScope, g1FileHandler, $log, shareData, ReturnStructure, R1InvHandler, R1Util, $timeout, utilFunctions, $compile) {


    $scope.newmstr = {};
    $scope.newsuprecmstr = {};
    $scope.addmstr = [];
    $scope.dummyaddmstr = [];
    $scope.addsuprecmstr = [];
    $scope.suprecmstr = [];
    $scope.savemstr = [];
    $scope.orgmodifiedData = [];
    $scope.orgmodifiedDataSR = [];
    $scope.addTable = false;
    $scope.addSuprecTable = false;
    $scope.addedtable = false;
    $scope.err_msg_hsn = "HSN code should be of 4,6 or 8 digits only";
    $scope.newInvValidtr = false;
    $scope.minCodeLengthToDisplay = "4";
    $scope.hsnsaveedit = false;
    $scope.successMessageShow = false;
    $scope.uqcrequired = true;
    $scope.hsnnotselected = false;
    $scope.buttonshow = false;
    $scope.supbtnshow = true;
    $scope.updatebtn = false;
    $scope.supupdatebtn = false;
    $scope.disablebtn = [];
    $scope.editsaveenable = false;
    $scope.supeditenable = false;
    $scope.searchTxt = "";
    $scope.searchEnabled = false;
    $scope.editprdnamedisabled = false;
    $scope.selectalldisabled = false;
    $scope.addeditdisablebtn = [];
    $scope.addedSupdisable = [];
    $scope.dataMsgshow = false;
    $scope.jsonMsgshow = false;
    $scope.disablebuttonMFD = false;
    $scope.disableSupbuttonMFD = false;
    $scope.successMarkForDel = false;
    $scope.deleteshow = false;
    $scope.editProdRecord = "";
    $scope.editSRRecord = "";
    $scope.supplierdisable = false;
    
    $scope.deletedisable = false;
    $scope.delsupdisable = false;
    $scope.isActive = "";
    $scope.sortCount = {};
    $scope.sortCountSR = {};
    
    $scope.columnArr = { 'productName': 'prodName', 'hsn': 'num', 'productDescription': 'hsnDesc', 'uqc': '', 'igst': 'num', 'cgst': 'num1', 'sgst': 'num1', 'actionFlag': '' };
    $scope.columnArrSR = { 'supplierRecipientName': 'srName', 'gstin': 'gstin', 'tradeName': '','registrationStatus':'','taxpayerType':'','isSupplier':'bool','isRecipient':'bool','actionFlag': '' };
    $scope.pageSize = "10";
    $scope.currentPage = 1;
    $scope.statuscol = false;
    $scope.statusSupcol = false;
    $scope.mfdisable = false;
    $scope.mfsupdisable = false;
    $scope.sameGstin = false;
    $scope.paginationId = "product";
    $scope.editSupenable = false;
    $scope.addsupdeldisable = [];
    $scope.pendingBtn = false;
    $scope.showBtn = false;
    $scope.btnshow = false;
    $scope.addbtn = true;
    $scope.addsubtn = true;
    $scope.gstndisabled = false;

    if (!shareData.mstrdashBoardDt) {
    //     $scope.page("/gstr/mastersummary");
     } else {
        $scope.mstrdashBoardDt = shareData.mstrdashBoardDt.response; }
    //Pagination related controls
    $scope.recordsPerPage = function () {
        $scope.selalldisable = false;
        $scope.currentPage = 1;
        $scope.selectAll = false;
        $scope.selectsupAll = false;
        $scope.deletedisable = false;
        $scope.delsupdisable = false;
        $scope.mfdisable = false;
        $scope.mfsupdisable = false;
        angular.forEach($scope.savemstr, function (prodData) {
            prodData.select = false;
        });
        angular.forEach($scope.suprecmstr, function (prodData) {
            prodData.select = false;
            $scope.selalldisable = false;
        });
    }

    $scope.pageChangeHandler = function (newPage) {
        if($scope.view==="product"){
            // $scope.selalldisable=false;
            $scope.deletedisable = false;
            $scope.mfdisable = false;
            $scope.selectalldisabled = false;
            $scope.currentPage = newPage;
            const curPageSize = $scope.pageSize;
            let startIndx = newPage * curPageSize - curPageSize;
            const endIndex = newPage * curPageSize;
 
            for (startIndx; startIndx < endIndex; startIndx++) {
                if ($scope.savemstr[startIndx] && $scope.savemstr[startIndx].select) {
                    if ($scope.savemstr[startIndx].actionFlag == "U" || $scope.savemstr[startIndx].actionFlag == "D") {
                        $scope.deletedisable = true;
                    }
                    else {
                        $scope.mfdisable = true;
                    }
                }
            }
 
            $scope.selectAll = true;
 
            startIndx = newPage * curPageSize - curPageSize;
            for (startIndx; startIndx < endIndex; startIndx++) {
                if ($scope.savemstr[startIndx] && !$scope.savemstr[startIndx].select) {
                    $scope.selectAll = false;
                }
            }
 
            startIndx = newPage * curPageSize - curPageSize;
            if ($scope.idx >= startIndx && $scope.idx < endIndex) {
                $scope.selectalldisabled = true;
            }
        }
        else if ($scope.view==="supplier"){
            $scope.delsupdisable = false;
            $scope.mfsupdisable = false;
            $scope.selalldisable = false;
            $scope.currentPage = newPage;
            const curPageSize = $scope.pageSize;
            const endIndex = newPage * curPageSize;
            let startIndx = newPage * curPageSize - curPageSize;
 
            for (startIndx; startIndx < endIndex; startIndx++) {
                if ($scope.suprecmstr[startIndx] && $scope.suprecmstr[startIndx].select) {
                    if ($scope.suprecmstr[startIndx].actionFlag == "U" || $scope.suprecmstr[startIndx].actionFlag == "D") {
                        $scope.delsupdisable = true;
                    }
                    else {
                        $scope.mfsupdisable = true;
                    }
                }
            }
 
            $scope.selectsupAll = true;
 
            startIndx = newPage * curPageSize - curPageSize;
            for (startIndx; startIndx < endIndex; startIndx++) {
                if ($scope.suprecmstr[startIndx] && !$scope.suprecmstr[startIndx].select) {
                    $scope.selectsupAll = false;
                }
            }
 
            startIndx = newPage * curPageSize - curPageSize;
            if ($scope.idx >= startIndx && $scope.idx < endIndex) {
                $scope.selalldisable = true;
            }
        }
        //$rootScope.isLastPage(newPage, $scope.pageSize);
    }

    // $scope.initModal = function(){
    //     if($scope.userGstin == null){
    //         $scope.userGstin = shareData.dashBoardDt.gstin;
    //     }
    //     $scope.newsuprecmstr.recipient = "R";
    // }

    $scope.initmastersummary = function () {
    
       
        if (shareData.mstrdashBoardDt) {
            $scope.mstrdashBoardDt = shareData.mstrdashBoardDt.response;
            // $scope.deleteshow = true;
            $scope.savemstr = $scope.mstrdashBoardDt.productsMasters;
        }

        //for sort functionality
        for (let col in $scope.columnArr) {
            $scope.sortCount[col] = true;
        }
        for (let col in $scope.columnArrSR) {
            $scope.sortCountSR[col] = true;
        }
        // console.log($scope.sortCount);
        // console.log($scope.sortCountSR);
        $scope.isActive = "";
        if($scope.savemstr){
        $scope.getSummary($scope.savemstr);}
        if($scope.suprecmstr){
        $scope.getsupSummary($scope.suprecmstr);}

        $scope.userGstin = sessionStorage.getItem("gstin")
        
        g1FileHandler.getMasterData($scope.userGstin).then(function (response) {
            $scope.savemstr = response.productsMasters == null ? [] : response.productsMasters;
            $scope.suprecmstr = response.supplierRecipientMasters == null ? [] : response.supplierRecipientMasters;


            $scope.newsuprecmstr.recipient = "R";
            $scope.orgmodifiedData = $scope.savemstr;
            $scope.orgmodifiedDataSR = $scope.suprecmstr;

            $scope.getSummary($scope.savemstr);
            $scope.getsupSummary($scope.suprecmstr);
            // conditions for trade/legal

            angular.forEach($scope.suprecmstr, function (row) {
                if(row.tradeName!=undefined && row.tradeName!=""){
                    row.tradeName=row.tradeName;
                } 
                else {
                    row.tradeName=row.legalName;
                }
                if(row.supplierRecipientFlag=="S" || row.supplierRecipientFlag=="SR"){
                    row.isSupplier="y";
                }
                else row.isSupplier="n";
                if(row.supplierRecipientFlag=="R" || row.supplierRecipientFlag=="SR"){
                    row.isRecipient="y";
                }
                else row.isRecipient="n";
            });
            
            $scope.search($scope.searchTxt);
        

            $scope.supbtnshow = false;
            if ($scope.savemstr == "" || $scope.savemstr == null || $scope.savemstr == undefined) {
                $scope.addbtn = true;
            } else {
                $scope.addbtn = false;
            }
            if ($scope.savemstr.length >= 1) {
                $scope.addbtn = false;
                $scope.btnshow = false;
                $scope.buttonshow = true;
            } else if ($scope.addmstr.length >= 1) {
                $scope.addbtn = false;
                $scope.btnshow = true;
                $scope.buttonshow = false;
            } else if ($scope.savemstr.length >= 1 && $scope.addmstr.length >= 1) {
                $scope.addbtn = false;
                $scope.btnshow = false;
                $scope.buttonshow = true;
            }
            if ($scope.suprecmstr == "" || $scope.suprecmstr == null || $scope.suprecmstr == undefined) {
                $scope.addsubtn = true;
            } else {
                $scope.addsubtn = false;
            }
            if ($scope.suprecmstr.length >= 1) {
                $scope.addsubtn = false;
                $scope.pendingBtn = false;
                $scope.showBtn = true;
            } else if ($scope.addsuprecmstr.length >= 1) {
                $scope.addsubtn = false;
                $scope.pendingBtn = true;
                $scope.showBtn = false;

            } else if ($scope.suprecmstr >= 1 && $scope.addsuprecmstr) {
                $scope.addsubtn = false;
                $scope.pendingBtn = false;
                $scope.showBtn = true;

            }
           
            if (!$scope.editsaveenable) {
                $scope.idx = -1;
                for (let i in $scope.savemstr) {
                    if ($scope.savemstr[i].productName == $scope.newmstr.productName) {
                        $scope.idx = i;
                        const curPageSize = $scope.pageSize;
                        const endIndex = $scope.currentPage * curPageSize;
                        let startIndx = $scope.currentPage * curPageSize - curPageSize;
                        if ($scope.idx >= startIndx && $scope.idx < endIndex) {
                            $scope.selectalldisabled = true;
                        }

                    }

                }
                $scope.statusColumn();
                if($scope.view =='product'){
                    $scope.disableSupbuttonMFD = false;
                    $scope.disablebuttonMFD = false;
                for (let i in $scope.savemstr) {
                    if ($scope.savemstr[i].actionFlag == "D") {
                        $scope.disablebuttonMFD = true;
                    }
                }}
                if($scope.view =='supplier'){
                    $scope.disablebuttonMFD = false;
                    $scope.disableSupbuttonMFD = false;
                for (let i in $scope.suprecmstr) {
                    if ($scope.suprecmstr[i].actionFlag == "D") {
                        $scope.disableSupbuttonMFD = true;
                       
                    }
                }}
                //console.log("idx:;", $scope.idx)
                if ($scope.idx > -1) {
                    $scope.savemstr[$scope.idx].disablebtn = true;
                    $scope.savemstr[$scope.idx].disabled = true;
                    $scope.savemstr[$scope.idx].select = false;
                }
                if ($scope.idx > -1) {

                    $scope.suprecmstr[$scope.idx].addsupdeldisable = true;
                    $scope.suprecmstr[$scope.idx].addedSupdisable = true;
                    $scope.suprecmstr[$scope.idx].disabled = true;
                    $scope.suprecmstr[$scope.idx].select = false;
                }
            }




        }, function (err) {
            // console.log("err :", err)
            $scope.savemstr = [];

        });

    }

    $scope.statusColumn = function () {
        $scope.disablebuttonMFD = true;
        $scope.disableSupbuttonMFD =true;
        $scope.statuscol = false;
        $scope.statusSupcol = false; 
        let count = 0;
        for (let i in $scope.savemstr) {
            if ($scope.savemstr[i].actionFlag == "U" || $scope.savemstr[i].actionFlag == "D") {
                $scope.statuscol = true;

                if ($scope.savemstr[i].actionFlag == "U") {
                    $scope.disablebuttonMFD = false;

                }
            }
            if ($scope.savemstr[i].actionFlag == undefined) {
                count++;
            }

        }
        for (let i in $scope.suprecmstr) {
            if ($scope.suprecmstr[i].actionFlag == "U" || $scope.suprecmstr[i].actionFlag == "D") {
              
                $scope.statusSupcol = true; 
                if ($scope.suprecmstr[i].actionFlag == "U") {
                    $scope.disableSupbuttonMFD = false;

                }
            }
            if ($scope.suprecmstr[i].actionFlag == undefined) {
                count++;
            }

        }
        if ($scope.savemstr.length < 1 || $scope.savemstr.length == count) {
            $scope.disablebuttonMFD = false;
        }else if ($scope.suprecmstr.length < 1 || $scope.suprecmstr.length == count) {
            $scope.disableSupbuttonMFD = false;
        }
    }

    var deleteunwantedparams = function (arr) {
        for (let i in arr) {
            if (arr[i].select != null) delete arr[i].select;
            if (arr[i].disablebtn != null) delete arr[i].disablebtn;
            if (arr[i].disabled != null) delete arr[i].disabled;
            if (arr[i].addeditdisablebtn != null) delete arr[i].addeditdisablebtn;
            if (arr[i].addsupdeldisable != null) delete arr[i].addsupdeldisable;
            if (arr[i].addedSupdisable != null) delete arr[i].addedSupdisable
         

        }
        return arr;
    }

    //Summary
    $scope.mastersummary = function () {
        if ($scope.tog) {
            $scope.tog = false;
        }
        else $scope.tog = true;
    }
    $scope.supsummary = function () {
        if ($scope.suptog) {
            $scope.suptog = false;
        }
        else $scope.suptog = true;
    }

    $scope.view = 'product';
    $scope.toggle_view = function (view) {
        $scope.pageSize = "10";
        $scope.currentPage = 1;
        $scope.searchEnabled = false;
        $scope.searchTxt = "";
     
        $scope.view = view === 'product' ? 'product' : view;
      
        if ($scope.view === "product") {
            $scope.search("");
            $scope.searchSR("");
         
        }
        else {
            $scope.searchSR("");
            $scope.search("");
         
        }
        $scope.initmastersummary();
        $scope.recordsPerPage();
       
    };

    //Search - Product master
    $scope.search = function (event) {
        $scope.productListToDelete = [];
        $scope.selectalldisabled = false;
        event = event.target ? event.target.value : event;
       // console.log("event :", event);

        if (event && event !== '') {
            $scope.searchEnabled = true;
            $scope.savemstr = $scope.orgmodifiedData.filter(function (element1) {
                if (element1 !== undefined && element1 !== null && event) {
                    if (element1.actionFlag == "U" || element1.actionFlag == "D") {
                        if (element1.uqc !== '' && element1.uqc !== undefined) {
                            return (element1.productName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.productDescription.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.hsn.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.uqc.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.actionFlag.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.igst.toString().toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                ((element1.igst / 2).toString().toLowerCase().indexOf(event.toLowerCase()) >= 0);
                        }
                        else {
                            return (element1.productName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.productDescription.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.hsn.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.actionFlag.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.igst.toString().toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                ((element1.igst / 2).toString().toLowerCase().indexOf(event.toLowerCase()) >= 0);

                        }
                    }
                    else {
                        if (element1.uqc !== '' && element1.uqc !== undefined) {
                            return (element1.productName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.productDescription.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.hsn.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.uqc.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.igst.toString().toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                ((element1.igst / 2).toString().toLowerCase().indexOf(event.toLowerCase()) >= 0);
                        }
                        else {
                            return (element1.productName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.productDescription.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.hsn.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                (element1.igst.toString().toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                                ((element1.igst / 2).toString().toLowerCase().indexOf(event.toLowerCase()) >= 0);

                        }
                    }
                }
            });
            $scope.currentPage = 1;

        } else {
            $scope.searchEnabled = false;
            $scope.savemstr = $scope.orgmodifiedData;
        }

        if ($scope.savemstr.length > 0) {
            $scope.selectAll = true;
            for (let i in $scope.savemstr) {
                if (!$scope.savemstr[i].select) {
                    $scope.selectAll = false;
                }
            }
        }
        else {
            $scope.selectAll = false;
        }

        $scope.sort($scope.isActive);

    };

    //Search - Supplier/Recipient master
    $scope.searchSR = function (event) {
       
        $scope.productListToDelete = [];
        $scope.selectalldisabled = false;
        event = event.target ? event.target.value : event;
       // console.log("event :", event);

        if (event && event !== '') {
            $scope.searchEnabled = true;
            $scope.suprecmstr = $scope.orgmodifiedDataSR.filter(function (element1) {
                if (element1 !== undefined && element1 !== null && event) {
                   
                        if ((element1.actionFlag == "U" || element1.actionFlag == "D") && (element1.registrationStatus != '' && element1.registrationStatus != undefined) || (element1.taxpayerType != '' && element1.taxpayerType !== undefined)) {
                        return (element1.supplierRecipientName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                        (element1.tradeName!="" && element1.tradeName!=undefined && element1.tradeName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                        (element1.legalName!="" && element1.legalName!=undefined && element1.legalName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                        ($scope.regStatusArray[element1.registrationStatus].toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                        ($scope.txpTypeArray[element1.taxpayerType].lbl.toLowerCase().indexOf(event.toLowerCase()) >= 0)  ||
                        (element1.gstin.toLowerCase().indexOf(event.toLowerCase()) >= 0);
                    }
                    else {
                        return (element1.supplierRecipientName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.tradeName != "" && element1.tradeName != undefined && element1.tradeName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.legalName != "" && element1.legalName != undefined && element1.legalName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.registrationStatus != "" && element1.registrationStatus != undefined && $scope.regStatusArray[element1.registrationStatus].toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.taxpayerType != "" && element1.taxpayerType != undefined && $scope.txpTypeArray[element1.taxpayerType].lbl.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.legalName!="" && element1.legalName!=undefined && element1.legalName.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.registrationStatus != "" && element1.registrationStatus != undefined && $scope.regStatusArray[element1.registrationStatus].toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.taxpayerType != "" && element1.taxpayerType != undefined && $scope.txpTypeArray[element1.taxpayerType].lbl.toLowerCase().indexOf(event.toLowerCase()) >= 0) ||
                            (element1.gstin.toLowerCase().indexOf(event.toLowerCase()) >= 0);
                    }
                }
            });
            $scope.currentPage = 1;

        } else {
            $scope.searchEnabled = false;
            $scope.suprecmstr = $scope.orgmodifiedDataSR;
        }

        if ($scope.suprecmstr.length > 0) {
            $scope.selectsupAll = true;
            for (let i in $scope.suprecmstr) {
                if (!$scope.suprecmstr[i].select) {
                    $scope.selectsupAll = false;
                }
            }
        }
        else {
            $scope.selectsupAll = false;
        }

        // $scope.sort($scope.isActive);

    };

    //Sort functionality
    $scope.sort = function (prop) {
        
        if (prop && prop !== '') {
            var frst;
            var scnd;
            $scope.savemstr.sort(function (a, b) {
                if ($scope.columnArr[prop] == '') {
                    frst = (a[prop] == "" || a[prop] == undefined) ? "!" : a[prop].toUpperCase();
                    scnd = (b[prop] == "" || b[prop] == undefined) ? "!" : b[prop].toUpperCase();
                }
                if ($scope.columnArr[prop] == 'hsnDesc') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 50).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 50).toUpperCase();
                }
                if ($scope.columnArr[prop] == 'prodName') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 25).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 25).toUpperCase();
                }
                if ($scope.columnArr[prop] == 'num') {
                    if (typeof (a[prop]) === 'number') {
                        frst = a[prop];
                        scnd = b[prop];
                    }
                    else {
                        frst = Number(a[prop]);
                        scnd = Number(b[prop]);
                    }
                }
                if ($scope.columnArr[prop] == 'num1') {
                    if (typeof (a["igst"]) === 'number') {
                        frst = a["igst"] / 2;
                        scnd = b["igst"] / 2;
                    }
                    else {
                        frst = Number(a["igst"]) / 2;
                        scnd = Number(b["igst"]) / 2;
                    }
                }

                if (!$scope.sortCount[prop]) {
                    if (frst < scnd) {
                        return -1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return 1;
                    }
                }
                else {
                    if (frst < scnd) {
                        return 1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return -1;
                    }
                }
            });
        }

        if (!$scope.editsaveenable) {
            $scope.idx = -1;
            for (let i in $scope.savemstr) {
                if ($scope.savemstr[i].productName == $scope.newmstr.productName) {
                    $scope.idx = i;
                    const curPageSize = $scope.pageSize;
                    const endIndex = $scope.currentPage * curPageSize;
                    let startIndx = $scope.currentPage * curPageSize - curPageSize;
                    if ($scope.idx >= startIndx && $scope.idx < endIndex) {
                        $scope.selectalldisabled = true;
                    }

                }
            }

            //console.log("idx search:  ", $scope.idx);
            if ($scope.idx > -1) {
                $scope.savemstr[$scope.idx].disablebtn = true;
                $scope.savemstr[$scope.idx].disabled = true;
                $scope.savemstr[$scope.idx].select = false;
            }
            if ($scope.idx > -1) {
                $scope.suprecmstr[$scope.idx].addsupdeldisable = true;
                    $scope.suprecmstr[$scope.idx].addedSupdisable = true;
                    $scope.suprecmstr[$scope.idx].disabled = true;
                    $scope.suprecmstr[$scope.idx].select = false;

            }
        }

    };

    $scope.sortProductMstr = function (prop) {
        if (prop && prop !== '') {
            var frst;
            var scnd;
            $scope.savemstr.sort(function (a, b) {
                if ($scope.columnArr[prop] == '') {
                    frst = (a[prop] == "" || a[prop] == undefined) ? "!" : a[prop].toUpperCase();
                    scnd = (b[prop] == "" || b[prop] == undefined) ? "!" : b[prop].toUpperCase();
                }
                if ($scope.columnArr[prop] == 'hsnDesc') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 50).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 50).toUpperCase();
                }
                if ($scope.columnArr[prop] == 'prodName') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 25).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 25).toUpperCase();
                }
                if ($scope.columnArr[prop] == 'num') {
                    if (typeof (a[prop]) === 'number') {
                        frst = a[prop];
                        scnd = b[prop];
                    }
                    else {
                        frst = Number(a[prop]);
                        scnd = Number(b[prop]);
                    }
                }
                if ($scope.columnArr[prop] == 'num1') {
                    if (typeof (a["igst"]) === 'number') {
                        frst = a["igst"] / 2;
                        scnd = b["igst"] / 2;
                    }
                    else {
                        frst = Number(a["igst"]) / 2;
                        scnd = Number(b["igst"]) / 2;
                    }
                }

                if ($scope.sortCount[prop]) {
                    if (frst < scnd) {
                        return -1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return 1;
                    }
                }
                else {
                    if (frst < scnd) {
                        return 1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return -1;
                    }
                }
            });
        }
        $scope.sortCount[prop] = !$scope.sortCount[prop];
        $scope.isActive = prop;
        angular.forEach($scope.savemstr, function (mstrprd, i) {
            if (mstrprd.productName == $scope.editProdRecord) {
                $scope.idx = i;
            }
        });
        $scope.pageChangeHandler(1);

    };

    $scope.sortSR = function (prop) {
        if (prop && prop !== '') {
            var frst;
            var scnd;
            $scope.suprecmstr.sort(function (a, b) {
                if ($scope.columnArrSR[prop] == '') {
                    frst = (a[prop] == "" || a[prop] == undefined) ? "!" : a[prop].toUpperCase();
                    scnd = (b[prop] == "" || b[prop] == undefined) ? "!" : b[prop].toUpperCase();
                }
                if ($scope.columnArrSR[prop] == 'tradeName') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 50).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 50).toUpperCase();
                }
                if ($scope.columnArrSR[prop] == 'srName') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 25).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 25).toUpperCase();
                }
                if ($scope.columnArrSR[prop] == 'gstin') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 25).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 25).toUpperCase();
                } 
                if ($scope.columnArrSR[prop] == 'bool') {
                    frst = a[prop] == "" ? "!" : a[prop];
                    scnd = b[prop] == "" ? "!" : b[prop];
                } 
               
                
                if (!$scope.sortCountSR[prop]) {
                    if (frst < scnd) {
                        return -1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return 1;
                    }
                }
                else {
                    if (frst < scnd) {
                        return 1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return -1;
                    }
                }
            });
        }

       

    };

    $scope.sortSupRecMstr = function (prop) {
        if (prop && prop !== '') {
            var frst;
            var scnd;
            $scope.suprecmstr.sort(function (a, b) {
                if ($scope.columnArrSR[prop] == '') {
                    frst = (a[prop] == "" || a[prop] == undefined) ? "!" : a[prop].toUpperCase();
                    scnd = (b[prop] == "" || b[prop] == undefined) ? "!" : b[prop].toUpperCase();
                }
              
                if ($scope.columnArrSR[prop] == 'srName') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 25).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 25).toUpperCase();
                }
                if ($scope.columnArrSR[prop] == 'gstin') {
                    frst = a[prop] == "" ? "!" : a[prop].substring(0, 25).toUpperCase();
                    scnd = b[prop] == "" ? "!" : b[prop].substring(0, 25).toUpperCase();
                }
                if ($scope.columnArrSR[prop] == 'bool') {
                    frst = a[prop] == "" ? "!" : a[prop];
                    scnd = b[prop] == "" ? "!" : b[prop];
                } 
              
                
                if ($scope.sortCountSR[prop]) {
                    if (frst < scnd) {
                        return -1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return 1;
                    }
                }
                else {
                    if (frst < scnd) {
                        return 1;
                    }
                    else {
                        if (frst == scnd) {
                            return 0;
                        }
                        return -1;
                    }
                }
            });
        }
        $scope.sortCountSR[prop] = !$scope.sortCountSR[prop];
        $scope.isActive = prop;
        angular.forEach($scope.suprecmstr, function (mstrSR, i) {
            // supplierRecipientName
            if (mstrSR.supplierRecipientName == $scope.editSRRecord) {
                $scope.idx = i;
            }
        });
        $scope.pageChangeHandler(1);

    };
    //duplicate HSN, UQC, Rate
    $scope.isExistingHsnUqcRate = function (isNew, iRate, iHsn, uqc, frm) {
        if (!iHsn)
            iHsn = '';
        var isExistRate = false;
        var frmName = (isNew) ? $scope.mstrFrm : frm;

        frmName.rt.$setValidity('duplicate', true);
        frmName.uqc.$setValidity('duplicate', true);
        frmName.hsn.$setValidity('duplicate', true);

        if (isNew == 1) {
            angular.forEach($scope.addmstr, function (inv, i) {
                if (!inv.hsn)
                    inv.hsn = '';

                if (
                    (inv.rt == iRate)
                    &&
                    (inv.hsn == iHsn)
                    &&
                    (inv.uqc == uqc)
                ) {
                    isExistRate = true;
                }
            });
            frmName.rt.$setValidity('duplicate', !isExistRate);
            frmName.uqc.$setValidity('duplicate', !isExistRate);
            frmName.hsn.$setValidity('duplicate', !isExistRate);
        } else {
            var cnt = 0;
            angular.forEach($scope.addmstr, function (inv, i) {
                if (!inv.hsn)

                    inv.hsn = '';
                if (inv.rt == iRate && inv.hsn == iHsn && inv.uqc == uqc) {
                    isExistRate = true;
                    cnt++;
                }
            });
            if (cnt > 1) {
                frmName.rt.$setValidity('duplicate', !isExistRate);
                frmName.uqc.$setValidity('duplicate', !isExistRate);
                frmName.hsn.$setValidity('duplicate', !isExistRate);
            }
        }
    }
    $scope.checkForServiceHSN = function (hsn) {
        if (String(hsn).substring(0, 2) == "99") {
            $scope.uqcrequired = false;
        } else {
            $scope.uqcrequired = true;
        }

    }

    //unique prodname check
    $scope.isExistingprdname = function (productName) {

        var frmName = $scope.mstrFrm;
        $scope.duplicaterecord = false;
        frmName.productName.$setValidity('duplicate', true);
        if (productName) {
            productName = productName.toLowerCase();
        }
        angular.forEach($scope.addmstr, function (mstrprd) {
            if ((mstrprd.productName && (mstrprd.productName).toLowerCase() == productName)) {

                $scope.duplicaterecord = true;
            }
        });
        angular.forEach($scope.orgmodifiedData, function (mstrprd) {
            if ((mstrprd.productName && (mstrprd.productName).toLowerCase() == productName)) {

                $scope.duplicaterecord = true;
            }
        });
        frmName.productName.$setValidity('duplicate', !$scope.duplicaterecord);
        return $scope.duplicaterecord;
    }

    $scope.afterHACselecthsnOutward = function (result) {
        $scope.newmstr.desc = result.n;
        $scope.newmstr.hsn = result.c;
        $scope.hsnsaveedit = true;
        $scope.checkForServiceHSN(result.c);
        $scope.hsnnotselected = false;
    }

    $scope.hsnBlurvalidation = function () {
        if (!$scope.hsnsaveedit && $scope.newmstr.hsn && $scope.newmstr.hsn.length > 0) {
            $scope.hsnnotselected = true;
        } else {
            $scope.hsnnotselected = false;

        }
    }
    $scope.backFunc = function () {
        if ($scope.hsnsaveedit || $scope.addmstr.length > 0) {
            $scope.createAlert(
                "warnOk",
                "Please click on ‘Save’ button to save the updated/added details",
                function () {
                    $scope.addmstr = deleteunwantedparams($scope.addmstr)
                    $scope.savemstr = deleteunwantedparams($scope.savemstr)
                    $scope.selectAll = false;
                    $scope.disablebtn = [];
                    $scope.selectalldisabled = false;
                }
            );

        } else {
            $scope.page("/gstr/masterdashboard");
        }
    }

    //mark for delete show func
    $scope.dataShow = function () {
      
        var mfdshow = false;
        if($scope.view == 'product'){
        for (let i in $scope.savemstr) {
            $scope.disablebuttonMFD = false;
            if ($scope.savemstr[i].actionFlag == "U") {
                mfdshow = true;

            }
            if($scope.savemstr[i].actionFlag == "D"){

                $scope.disablebuttonMFD = true;
            }
          
        }}
        if($scope.view == 'supplier'){
        for (let i in $scope.suprecmstr) {
            $scope.disableSupbuttonMFD = false;
            if ( $scope.suprecmstr[i].actionFlag == "U") {
                mfdshow = true;

            }
            if($scope.suprecmstr[i].actionFlag == "D"){
                $scope.disableSupbuttonMFD = true;
            }
        }
        }
        return mfdshow;
    }

    //Upload Json back button
    $scope.backFuncUpload = function () {
        if ($scope.hsnsaveedit || $scope.addmstr.length > 0) {
            $scope.createAlert(
                "warnOk",
                "Please click on ‘Save’ button to save the updated/added details",
                function () {
                    $scope.addmstr = deleteunwantedparams($scope.addmstr)
                    $scope.savemstr = deleteunwantedparams($scope.savemstr)
                    $scope.selectAll = false;
                    $scope.disablebtn = [];
                    $scope.selectalldisabled = false;
                }
            );

        } else {
            $scope.page("/gstr/upload/upldmstrdashboard");
        }
    }

    //Check all implementation
    $scope.checkAll = function (sprod, checked) {
        const curPageSize = $scope.pageSize;
        const endIndex = $scope.currentPage * curPageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;

       

        for (startIndx; startIndx < endIndex; startIndx++) {
            if ($scope.savemstr[startIndx]) {
                $scope.savemstr[startIndx].select = checked;
            }
        }

        if (!checked) {
            $scope.deletedisable = false;
            $scope.mfdisable = false;

        }
        else {
            $scope.checkSelected();
        }
    };

    $scope.checkSelected = function () {
        $scope.deletedisable = false;
        $scope.mfdisable = false;
        const curPageSize = $scope.pageSize;
        const endIndex = $scope.currentPage * curPageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;

        for (startIndx; startIndx < endIndex; startIndx++) {
            if ($scope.savemstr[startIndx] && $scope.savemstr[startIndx].select) {
                if ($scope.savemstr[startIndx].actionFlag == "U" || $scope.savemstr[startIndx].actionFlag == "D") {
                    $scope.deletedisable = true;
                }
                else {
                    $scope.mfdisable = true;
                }
            }
        }

        $scope.selectAll = true;

        startIndx = $scope.currentPage * curPageSize - curPageSize;
        for (startIndx; startIndx < endIndex; startIndx++) {
            if ($scope.savemstr[startIndx] && !$scope.savemstr[startIndx].select) {
                $scope.selectAll = false;
            }
        }

    };

    //Checkbox for supplier table
    $scope.checkAllSup = function (supRecData, checked) {

        angular.forEach(supRecData, function (supDat) {
            supDat.select = checked;
        });
        if (!checked) {
            $scope.delsupdisable = false;
            $scope.mfsupdisable = false;
        }
        else {
            $scope.checkSelSup();
        }
    };
    $scope.checkSelSup = function () {
        $scope.delsupdisable = false;
        $scope.mfsupdisable = false;
        for (let i in $scope.suprecmstr) {
            if ($scope.suprecmstr[i].select == true) {
                if ($scope.suprecmstr[i].actionFlag == "U" || $scope.suprecmstr[i].actionFlag == "D") {
                    $scope.delsupdisable = true;
                }
                else {
                    $scope.mfsupdisable = true;
                }


            }
        }
        $scope.selectsupAll = true;

        $scope.suprecmstr.forEach(function (prod) {
            if (!prod.select) {
                $scope.selectsupAll = false;

            }
        });
    }
    //Multiple delete 
    $scope.multipleDelete = function (prodData) {
        var tempArr = [];
        const curPageSize = $scope.pageSize;
        const endIndex = $scope.currentPage * curPageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;

        for (startIndx; startIndx < endIndex; startIndx++) {
            if (prodData[startIndx] && prodData[startIndx].select && prodData[startIndx].actionFlag != "U" && prodData[startIndx].actionFlag != "D") {
                tempArr.push(prodData[startIndx]);
            }
        }
       if (tempArr.length < 1) {
            $scope.createAlert(
                "infocancel",
                "No record(s) are selected for remove.",
                function () { });
        } else {
            for (let i in tempArr) {
                if (tempArr[i].actionFlag != "U" && tempArr[i].actionFlag != "D") {
                   
                    $scope.createAlert(
                        "warndelete",
                        "Are you sure, you want to remove this record?",
                        function () {

                            tempArr = $scope.orgmodifiedData.filter(function (obj) {
                                var pos = tempArr.indexOf(obj);
                                if (pos < 0) {
                                    return true;
                                }
                                return false;
                            });

                            g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams(tempArr), "productsMasters").then(function (response) {

                                $scope.successMessageShow = true;
                                window.scroll(0, 0);
                                $timeout(function () {
                                    $scope.successMessageShow = false;
                                }, 3000);

                                $scope.uqcrequired = true;
                                $scope.initmastersummary();
                                $scope.selectAll = false;
                                $scope.savemstr = deleteunwantedparams($scope.savemstr)
                                $scope.addmstr = deleteunwantedparams($scope.addmstr)
                                $scope.disablebtn = [];
                                $scope.selectalldisabled = false;
                                if ($scope.savemstr.length >= 1) {
                                    $scope.addbtn = false;
                                }

                            });

                        });
                }
            }

        }

    }


    $scope.clearHSNInput = function () {
        $scope.successMessageShow = false;
        $scope.newmstr.hsn = null;
        $scope.newmstr.desc = null;
        $scope.hsnsaveedit = false;
        $scope.hsnnotselected = false;
        $scope.newInvValidtr = false;
        $scope.mstrFrm.hsn.$setValidity('duplicate', true);
        $scope.mstrFrm.uqc.$setValidity('duplicate', true);
        $scope.uqcrequired = true;
        

    }
    $scope.sucessmsg = function () {
        $scope.successMessageShow = "";
    }
    $scope.sucessMFD = function () {
        $scope.successMarkForDel = "";
        $scope.singlesuccessMarkForDel = "";
    }
    $scope.sucessUMFD = function () {
        $scope.successundoMark = "";
    }
    $scope.noDatamsg = function () {
        $scope.dataMsgshow = "";
    }
    $scope.jsonMessage = function () {
        $scope.jsonMsgshow = "";
    }

    $scope.cancelbtn = function () {
        $scope.newmstr.hsn = null;
        $scope.newmstr.productName = null;
        $scope.newmstr.desc = null;
        $scope.newmstr.uqc = null;
        $scope.newmstr.rt = null;
        $scope.disablebtn = [];
        $scope.updatebtn = false;
        $scope.hsnsaveedit = false;
        $scope.editprdnamedisabled = false;
       
        $scope.editsaveenable = false;
        $scope.addeditdisablebtn = [];
    
        $scope.duplicaterecord = false;
        $scope.mstrFrm.$setPristine();
        $scope.newInvValidtr = false;
        $scope.addmstr = deleteunwantedparams($scope.addmstr)
      
        $scope.selectalldisabled = false;
        $scope.hsnnotselected = false;

        angular.forEach($scope.savemstr, function (mstrprd, i) {
            if (mstrprd.productName == $scope.editProdRecord) {
                $scope.idx = i;
            }
        });


        if ($scope.savemstr[$scope.idx].select != null && $scope.selectAll) {
            $scope.savemstr[$scope.idx].select = true;
        }
        if ($scope.savemstr[$scope.idx].disabled != null) {
            $scope.savemstr[$scope.idx].disabled = false;
        }
        if ($scope.savemstr[$scope.idx].disablebtn != null) {
            $scope.savemstr[$scope.idx].disablebtn = false;
        }
        $scope.idx = -1;
        $scope.editProdRecord = "";
    }

    //Product Summary 
    $scope.getSummary = function (summaryData) {
        var result = summaryData.reduce(function (acc, o) { acc[o.igst] = (acc[o.igst] || 0) + 1; return acc }, {});
        var sum = summaryData.reduce(function (sum) { sum = sum + 1; return sum; }, 0);
        var resMFD = summaryData.reduce(function (accmf, obj) { accmf[obj.igst] = obj.actionFlag == "D" ? (accmf[obj.igst] || 0) + 1 : accmf[obj.igst]; return accmf }, {});

        var sumcnt = summaryData.reduce(function (sumcnt, obj) { sumcnt = obj.actionFlag == "D" ? (sumcnt || 0) + 1 : sumcnt;  return sumcnt; }, 0);

        if (result && result !== null && result != undefined) {
            $scope.summaryData = [
                { "igst": "0%", "count": result[0] ? result[0] : 0, "actncnt": resMFD[0] ? resMFD[0] : 0 },
                { "igst": "0.1%", "count": result[0.1] ? result[0.1] : 0, "actncnt": resMFD[0.1] ? resMFD[0.1] : 0 },
                { "igst": "0.25%", "count": result[0.25] ? result[0.25] : 0, "actncnt": resMFD[0.25] ? resMFD[0.25] : 0 },
                { "igst": "1%", "count": result[1] ? result[1] : 0, "actncnt": resMFD[1] ? resMFD[1] : 0 },
                { "igst": "1.5%", "count": result[1.5] ? result[1.5] : 0, "actncnt": resMFD[1.5] ? resMFD[1.5] : 0 },
                { "igst": "3%", "count": result[3] ? result[3] : 0, "actncnt": resMFD[3] ? resMFD[3] : 0 },
                { "igst": "5%", "count": result[5] ? result[5] : 0, "actncnt": resMFD[5] ? resMFD[5] : 0 },
                { "igst": "7.5%", "count": result[7.5] ? result[7.5] : 0, "actncnt": resMFD[7.5] ? resMFD[7.5] : 0 },
                { "igst": "12%", "count": result[12] ? result[12] : 0, "actncnt": resMFD[12] ? resMFD[12] : 0 },
                { "igst": "18%", "count": result[18] ? result[18] : 0, "actncnt": resMFD[18] ? resMFD[18] : 0 },
                { "igst": "28%", "count": result[28] ? result[28] : 0, "actncnt": resMFD[28] ? resMFD[28] : 0 },
                { "igst": "40%", "count": result[40] ? result[40] : 0, "actncnt": resMFD[40] ? resMFD[40] : 0 },
                { "igst": "Total", "count": sum ? sum : 0, "actncnt": sumcnt ? sumcnt : 0 }
            ]
        }
    }

    //Supplier Summary 
    $scope.getsupSummary = function (supplierData) {
        let result = supplierData.reduce(function (acc, o) { acc[o.supplierRecipientFlag] = (acc[o.supplierRecipientFlag] || 0) + 1; return acc }, {});
        var resMFD = supplierData.reduce(function (accmf, obj) { accmf[obj.actionFlag] = (accmf[obj.actionFlag] || 0) + 1;  return accmf }, {});
        // console.log("resMFD:",result)
        // console.log("resMFD:",resMFD)
        let sum = supplierData.reduce(function (sum) { sum = sum + 1; return sum; }, 0);
        if (result || resMFD && (result !== null && result != undefined) || (resMFD != null && resMFD != undefined)) {
            let supcount = result['S'] ? result['S'] : 0;
            let recipcount = result['R'] ? result['R'] : 0;
            let mcount = resMFD['D'] ? resMFD['D'] : 0;

            if (result['SR']) {
                supcount = supcount + result['SR'];
                recipcount = recipcount + result['SR'];
            }
            $scope.sumSupData =
            {
                "sumcount": sum ? sum : 0,
                "supcount": supcount,
                "recount": recipcount,
                "mcount": mcount
            }

        }

    }


    //Add Hsn Tale
    $scope.addHsnDetails = function () {

        var obj = {};

        if ($scope.isExistingprdname($scope.newmstr.productName)) {
            return;
        }

        if ($scope.newmstr && $scope.newmstr.hsn && $scope.mstrFrm.$valid && !$scope.hsnnotselected) {
            obj["hsn"] = $scope.newmstr.hsn;
            obj["productDescription"] = $scope.newmstr.desc;
            obj["productName"] = $scope.newmstr.productName;
            obj["uqc"] = $scope.newmstr.uqc;
            obj["igst"] = $scope.newmstr.rt;


            $scope.dummyaddmstr.push(obj);

            if ($scope.dummyaddmstr.length > 10) {
                $scope.createAlert(
                    "info",
                    "You can add maximum 10 records in add product table. Please save these records to added product table or remove some records to add more records in the table",
                    function () {
                        $scope.successMessageShow = false;
                    }
                );
            } else {
                $scope.addmstr.push(obj);
                if ($scope.addmstr.length >= 1) {
                    $scope.addbtn = false;
                    $scope.btnshow = true;
                }
                if ($scope.savemstr.length >= 1) {
                    $scope.addbtn = false;
                    $scope.btnshow = false;
                    $scope.buttonshow = true;
                }
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.uqcrequired = true;
                $scope.newInvValidtr = false;
                $scope.addTable = true;
                $scope.addmstr = deleteunwantedparams($scope.addmstr)

                $scope.disablebtn = [];
                $scope.selectalldisabled = false;
            }
            $scope.dummyaddmstr = angular.copy($scope.addmstr);
            $scope.newmstr = {};
            $scope.mstrFrm.$setPristine();
            $scope.newInvValidtr = false;
            $scope.hsnsaveedit = false;
            $scope.duplicaterecord = false;
            $scope.idx = -1;
        }
        else {
            $scope.newInvValidtr = true;
        }

    }

    //Edit Button for add Table
    $scope.idx = -1;
    $scope.addEditTable = function (editData, index) {
        $scope.editProdRecord = "";
        $scope.addmstr = deleteunwantedparams($scope.addmstr);
       
        for (let i in $scope.savemstr) {
            if ($scope.savemstr[i].disablebtn != null) delete $scope.savemstr[i].disablebtn;
            if ($scope.savemstr[i].disabled != null) delete $scope.savemstr[i].disabled;
        }
      
        $scope.disablebtn = [];
        $scope.selectalldisabled = false;
        for (let i in $scope.addmstr) {
            if ($scope.addmstr[i].productName == editData.productName) {
                $scope.idx = i;
                break;
            }
        }
        $scope.editsaveenable = true;
        $scope.addmstr[$scope.idx].addeditdisablebtn = true;
        
        $scope.newmstr.hsn = editData.hsn;
        $scope.newmstr.desc = editData.productDescription;
        $scope.newmstr.productName = editData.productName;
        $scope.newmstr.rt = editData.igst;
        $scope.newmstr.uqc = editData.uqc;
        $scope.updatebtn = true;
        $scope.hsnsaveedit = false;
        $scope.hsnnotselected = false;
        $scope.editprdnamedisabled = true;
        $scope.newInvValidtr = false;
        window.scroll(0, 0);

    }

    //Edit button add table update call
    $scope.addEditProduct = function (index) {
        $scope.hsnsaveedit = false;
        var obj = {};
        if ($scope.newmstr && $scope.newmstr.hsn && $scope.mstrFrm.$valid && !$scope.hsnnotselected) {
            obj["hsn"] = $scope.newmstr.hsn;
            obj["productDescription"] = $scope.newmstr.desc;
            obj["productName"] = $scope.newmstr.productName;
            obj["uqc"] = $scope.newmstr.uqc;
            obj["igst"] = $scope.newmstr.rt;
            if ($scope.duplicateprdname(index, -1, $scope.newmstr.productName)) {
                return;
            }

            $scope.addmstr[index] = angular.copy(obj);
            $scope.successMessageShow = true;
            window.scroll(0, 0);
            $timeout(function () {
                $scope.successMessageShow = false;
            }, 3000);
            $scope.addmstr[$scope.idx].addeditdisablebtn = false;
           
            $scope.uqcrequired = true;
            $scope.addTable = true;
            $scope.newmstr = {};
            $scope.mstrFrm.$setPristine();
            $scope.newInvValidtr = false;
            $scope.hsnsaveedit = false;
            $scope.duplicaterecord = false;
            $scope.editprdnamedisabled = false;
            $scope.editsaveenable = false;
            $scope.updatebtn = false;
            $scope.addeditdisablebtn = [];
            $scope.idx = -1;
            $scope.addmstr = deleteunwantedparams($scope.addmstr)
           
            $scope.selectalldisabled = false;
            $scope.disablebtn = [];
            $scope.dummyaddmstr = angular.copy($scope.addmstr);
        }
        else {
            $scope.newInvValidtr = true;
        }


    }

    //Reset Button 
    $scope.resetbtn = function () {
        $scope.createAlert(
            "warndelete",
            "All record(s) entered in the table will be removed, do you want to continue?",
            function () {
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.addTable = false;
                $scope.updatebtn = false;
                $scope.addmstr = [];
                $scope.newmstr = [];
                $scope.newInvValidtr = false;
                $scope.idx = -1;
                $scope.clearHSNInput();
                $scope.addmstr = deleteunwantedparams($scope.addmstr)
                $scope.savemstr = deleteunwantedparams($scope.savemstr)
                $scope.selectAll = false;
                $scope.selectalldisabled = false;
                $scope.gstndisabled = false;
                $scope.disablebtn = [];
                if ($scope.addmstr.length <= 1) {
                    $scope.addbtn = true;
                    $scope.btnshow = false;
                    $scope.buttonshow = false;
                }if ($scope.savemstr.length <= 1) {
                    $scope.addbtn = false;
                    $scope.btnshow = false;
                    $scope.buttonshow = true;
                }
            }
        );
    }
    //Delete Button for Product table
    $scope.singleDeleteproduct = function (prodsaveData) {
        $scope.createAlert(
            "warndelete",
            "Are you sure, you want to remove this record?",
            function () {
                let index = -1;
                $scope.savemstr = $scope.orgmodifiedData;
                for (let i in $scope.savemstr) {
                    if ($scope.savemstr[i].productName == prodsaveData.productName) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    $scope.savemstr.splice(index, 1);
                    g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
                        ;
                        $scope.successMessageShow = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successMessageShow = false;
                        }, 3000);
                        $scope.uqcrequired = true;
                        $scope.newInvValidtr = false;
                        $scope.selectAll = false;
                        $scope.addmstr = deleteunwantedparams($scope.addmstr)
                        $scope.savemstr = deleteunwantedparams($scope.savemstr)
                        $scope.disablebtn = [];
                        $scope.selectalldisabled = false;
                        $scope.initmastersummary();
                        if ($scope.savemstr.length <= 0) {
                            $scope.addbtn = false;
                            $scope.btnshow = true;
                            $scope.buttonshow = false;
                        }

                    });
                }
            });
    }

    //Single Delete for Add table
    $scope.addsingleDelete = function (addData) {
        $scope.createAlert(
            "warndelete",
            "Are you sure, you want to remove this record?",
            function () {
                let index = -1;
                for (let i in $scope.addmstr) {
                    if ($scope.addmstr[i].productName == addData.productName) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    $scope.addmstr.splice(index, 1);
                    $scope.successMessageShow = true;
                    window.scroll(0, 0);
                    $timeout(function () {
                        $scope.successMessageShow = false;
                    }, 3000);
                    $scope.newInvValidtr = false;
                    $scope.selectAll = false;
                    $scope.disablebtn = [];
                    $scope.selectalldisabled = false;
                    $scope.addmstr = deleteunwantedparams($scope.addmstr)
                    $scope.savemstr = deleteunwantedparams($scope.savemstr)
                    $scope.dummyaddmstr = angular.copy($scope.addmstr);
                    $scope.supplierdisable = false;
                    $scope.gstndisabled = false;
                   
                }
                if ($scope.addmstr.length <= 0) {
                    $scope.addTable = false;
                    $scope.addbtn = true;
                }
                if ($scope.savemstr.length > 0 && $scope.addmstr.length <= 0) {
                    $scope.addbtn = false;
                    $scope.btnshow = false;
                    $scope.buttonshow = true;
                  
                }

            });

          

    }

    //Save Hsn Table
    $scope.saveProduct = function () {
        var saveobj = {};

        if ($scope.isExistingprdname($scope.newmstr.productName)) {
            return;
        }
        if ($scope.orgmodifiedData.length >= 50) {
            $scope.createAlert(
                "info",
                "You can add maximum 500 records in Product master. Please remove some unwanted records to add more records",
                function () {


                }
            );
        } else {
            if ($scope.newmstr && $scope.newmstr.hsn && $scope.mstrFrm.$valid && !$scope.hsnnotselected) {
                saveobj["hsn"] = $scope.newmstr.hsn;
                saveobj["productDescription"] = $scope.newmstr.desc;
                saveobj["productName"] = $scope.newmstr.productName;
                saveobj["uqc"] = $scope.newmstr.uqc;
                saveobj["igst"] = Number($scope.newmstr.rt);


                $scope.savemstr = $scope.orgmodifiedData;
                $scope.savemstr.push(saveobj);


                g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
                    ;
                    $scope.successMessageShow = true;
                    window.scroll(0, 0);
                    $timeout(function () {
                        $scope.successMessageShow = false;
                    }, 3000);

                    $scope.uqcrequired = true;
                    $scope.newInvValidtr = false;
                    $scope.initmastersummary();
                    $scope.addmstr = deleteunwantedparams($scope.addmstr)
                    $scope.savemstr = deleteunwantedparams($scope.savemstr)

                    $scope.selectAll = false;
                    $scope.disablebtn = [];
                    $scope.selectalldisabled = false;


                });

                $scope.newmstr = {};
                $scope.mstrFrm.$setPristine();
                $scope.hsnsaveedit = false;
                $scope.duplicaterecord = false;
                $scope.idx = -1;

            } else {
                $scope.newInvValidtr = true;
            }
        }


    }

    //Enable delete button in upldmstrpreview

    $scope.showDel = function () {
        var enableRemove = false;
        for (let i in $scope.savemstr) {
            if ($scope.savemstr[i].actionFlag == "" || $scope.savemstr[i].actionFlag == null) {
                enableRemove = true;
            }
        }
        return enableRemove;
    }

    //Enable delete button
    $scope.deletefunc = function () {
        var enabDel = false;
        for (let i in $scope.savemstr) {
            if ($scope.savemstr[i].actionFlag == "U" || $scope.savemstr[i].actionFlag == "D") {
                enabDel = true;
            }
        }
        return enabDel;
    }
    //Enable Button for supplier table

    $scope.delSupfunc = function () {
        var enablebtn = false;
        for (let i in $scope.suprecmstr) {
            if (($scope.suprecmstr && $scope.suprecmstr[i].actionFlag == "U") || ($scope.suprecmstr && $scope.suprecmstr[i].actionFlag == "D")) {
                enablebtn = true;
               
            }
        }
        return enablebtn;
    }

    //Supplier Remove button hide and show
    $scope.showSupDel = function () {
        var enableSupRemove = false;
        for (let i in $scope.suprecmstr) {
            if ($scope.suprecmstr[i].actionFlag == "" || $scope.suprecmstr[i].actionFlag == null) {
                enableSupRemove = true;
            }
        }
        return enableSupRemove;
    }

    // Multiple Save product table
    $scope.mulitiplesaveProduct = function () {
        $scope.addmstr = $scope.dummyaddmstr;
        if ($scope.orgmodifiedData.length + $scope.addmstr.length > 50) {
            $scope.createAlert(
                "info",
                "You can add maximum 500 records in Product master. Please remove some unwanted records to add more records",
                function () {

                }
            );
        } else {
            $scope.savemstr = $scope.orgmodifiedData;
            $scope.savemstr = $scope.savemstr.concat($scope.addmstr);
            $scope.addmstr = [];
            $scope.dummyaddmstr = [];
            g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
                ;
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.addTable = false;
                $scope.uqcrequired = true;
                $scope.newInvValidtr = false;
                $scope.initmastersummary();
                $scope.addmstr = deleteunwantedparams($scope.addmstr)
                $scope.savemstr = deleteunwantedparams($scope.savemstr)
                $scope.selectAll = false;
                $scope.idx = -1;
                $scope.disablebtn = [];
                $scope.selectalldisabled = false;
            });
            $scope.newmstr = {};
            $scope.mstrFrm.$setPristine();
            $scope.hsnsaveedit = false;
            $scope.duplicaterecord = false;
            $scope.editprdnamedisabled = false;

        }
    }


    $scope.idx = -1;
    //Edit Button
    $scope.updateProduct = function (prodData) {
        $scope.addmstr = deleteunwantedparams($scope.addmstr)
       
        $scope.editProdRecord = "";
        $scope.editsaveenable = false;
       
        $scope.disablebtn = [];
        $scope.selectalldisabled = false;
        for (let i in $scope.savemstr) {
            if ($scope.savemstr[i].productName == prodData.productName) {
                $scope.idx = i;
                $scope.editProdRecord = prodData.productName;

            } else {
                delete $scope.savemstr[i].disablebtn;
                delete $scope.savemstr[i].disabled;
            }
        }

        $scope.updatebtn = true;
        $scope.savemstr[$scope.idx].disablebtn = true;
        $scope.savemstr[$scope.idx].disabled = true;
        $scope.savemstr[$scope.idx].select = false;
        $scope.newmstr.hsn = prodData.hsn;
        $scope.newmstr.desc = prodData.productDescription;
        $scope.newmstr.productName = prodData.productName;
        $scope.newmstr.rt = prodData.igst;
        $scope.newmstr.uqc = prodData.uqc;
        $scope.hsnsaveedit = false;
        $scope.hsnnotselected = false;
        $scope.editprdnamedisabled = true;
        $scope.selectalldisabled = true;
        $scope.newInvValidtr = false;
        $scope.uqcrequired = false;
        window.scroll(0, 0);

    }
    //update product table backend call
    $scope.updateProd = function (index) {
        $scope.hsnsaveedit = false;
        var saveobj = {};
        var orgEditIndex = "";
        angular.forEach($scope.orgmodifiedData, function (mstrprd, i) {
            if (mstrprd.productName && (mstrprd.productName).toLowerCase() == ($scope.editProdRecord).toLowerCase()) {
                orgEditIndex = i;
            }
        });

        if ($scope.newmstr && $scope.newmstr.hsn && $scope.mstrFrm.$valid && !$scope.hsnnotselected) {
            saveobj["hsn"] = $scope.newmstr.hsn;
            saveobj["productDescription"] = $scope.newmstr.desc;
            saveobj["productName"] = $scope.newmstr.productName;
            saveobj["uqc"] = $scope.newmstr.uqc;
            saveobj["igst"] = Number($scope.newmstr.rt);
           
            for (let i in $scope.savemstr) {
                if ($scope.savemstr[i].actionFlag == "U") {
                    saveobj["actionFlag"] = "E";
                }
            }

            $scope.orgmodifiedData[orgEditIndex] = angular.copy(saveobj);
            $scope.savemstr = $scope.orgmodifiedData;

            g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
                $scope.idx = -1;
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.uqcrequired = true;
                $scope.newInvValidtr = false;
                $scope.initmastersummary();
                $scope.addmstr = deleteunwantedparams($scope.addmstr)
                $scope.savemstr = deleteunwantedparams($scope.savemstr)
                $scope.selectAll = false;
                $scope.disablebtn = [];
                $scope.selectalldisabled = false;
            });

            $scope.newmstr = {};
            $scope.mstrFrm.$setPristine();
            $scope.hsnsaveedit = false;
            $scope.duplicaterecord = false;
            $scope.updatebtn = false;
            $scope.editprdnamedisabled = false;
            $scope.editsaveenable = false;
            $scope.updatebtn = false;
            $scope.selectalldisabled = false;
            $scope.duplicaterecord = false;


        } else {
            $scope.newInvValidtr = true;
        }
    }

    $scope.duplicateprdname = function (addindex, saveindex, productName) {

        var frmName = $scope.mstrFrm;
        $scope.duplicaterecord = false;
        frmName.productName.$setValidity('duplicate', true);
        if (productName) {
            productName = productName.toLowerCase();
        }
        for (let i in $scope.addmstr) {
            if (i != addindex && $scope.addmstr[i].productName == productName) {
                $scope.duplicaterecord = true;
            }
        }
        for (let i in $scope.savemstr) {
            if (i != saveindex && $scope.savemstr[i].productName == productName) {
                $scope.duplicaterecord = true;
            }
        }
        // for (let i in $scope.orgmodifiedData) {
        //     if ($scope.orgmodifiedData[i].prdname == prdName) {
        //         $scope.duplicaterecord = true;
        //     }
        // }

        frmName.productName.$setValidity('duplicate', !$scope.duplicaterecord);
        return $scope.duplicaterecord;
    }
    //Remove Button 
    $scope.removeData = function () {
        var tabMaster = "";
        if ($scope.view == "product") {
            tabMaster = "productsMasters"
            if ($scope.orgmodifiedData.length < 1) {
                $scope.createAlert(
                    "infocancel",
                    "No records(s) available for remove",
                    function () { });
            } else {
                $scope.createAlert(
                    "warnconf",
                    "Are you sure, you want to continue?",
                    function () {

                        g1FileHandler.saveProductMstr($scope.userGstin, [], tabMaster).then(function (response) {
                            $scope.successMessageShow = true;
                            window.scroll(0, 0);
                            $timeout(function () {
                                $scope.successMessageShow = false;
                            }, 3000);

                          
                            $scope.newInvValidtr = false;
                            $scope.initmastersummary();
                            $scope.newmstr = {};
                            $scope.mstrFrm.$setPristine();
                            $scope.hsnsaveedit = false;
                            $scope.duplicaterecord = false;
                            $scope.disablebtn = [];
                            $scope.updatebtn = false;
                            $scope.editprdnamedisabled = false;
                            $scope.editsaveenable = false;
                            $scope.updatebtn = false;
                            $scope.selectalldisabled = false;
                            $scope.idx = -1;
                            $scope.addmstr = deleteunwantedparams($scope.addmstr)
                            $scope.savemstr = deleteunwantedparams($scope.savemstr)
                            $scope.selectAll = false;
                            $scope.selectalldisabled = false;
                            $scope.disablebuttonMFD = false;
                            $scope.supupdatebtn = false;
                            if ($scope.addmstr.length >= 1) {
                                $scope.btnshow = true;
                            }

                        });

                    })

            }

        } else if ($scope.view == "supplier") {
            tabMaster = "supplierRecipientMasters"
            if ($scope.suprecmstr.length < 1) {
                $scope.createAlert(
                    "infocancel",
                    "No records(s) available for remove",
                    function () { });
            } else {
                $scope.createAlert(
                    "warnconf",
                    "Are you sure, you want to continue?",
                    function () {
                        if($scope.suprecmstr){
                            for(let i in $scope.suprecmstr){
                                if(!$scope.suprecmstr[i].actionFlag){
                            g1FileHandler.saveProductMstr($scope.userGstin, [], tabMaster).then(function (response) {
                            
                                        $scope.successMessageShow = true;
                                        window.scroll(0, 0);
                                      
                                        $timeout(function () {
                                            $scope.successMessageShow = false;
                                        }, 3000);
                                      
                                        $scope.validator = false;
                                        $scope.initmastersummary();
                                        $scope.newsuprecmstr = {};
                                        $scope.suprecFrm.$setPristine();
                                        $scope.idx = -1;
                                        $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
                                        $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr);
                                        $scope.sameGstin = false;
                                        $scope.dupsupName = false;
                                        $scope.duprecord = false;
                                        $scope.gstndisabled = false;
                                        $scope.selalldisable = true;
                                        $scope.supplierdisable = false;
                                        $scope.gstndisabled = false;
                                        $scope.supupdatebtn = false;
                                        $scope.disableSupbuttonMFD = false;
                                    });
                                }
                            }
                        }

                     

                    })
                  
            }
        }
    }

    //Generate JSON
    $scope.generateJson = function () {
        let today = moment().format("DDMMYYYY");
        g1FileHandler.getMasterData($scope.userGstin).then(function (response) {
            //    console.log("resonse:", response)
            if (response == null || response == "") {
                $scope.dataMsgshow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.dataMsgshow = false;
                }, 3000);
            } else {
                $scope.dataMsgshow = false;
                response.productsMasters == null ? [] : response.productsMasters;
                response.supplierRecipientMasters == null ? [] : response.supplierRecipientMasters;
                var savemstrvar = response;
                if (savemstrvar.productsMasters || savemstrvar.supplierRecipientMasters) {
                    savemstrvar.productsMasters.filter(function (obj) {
                        delete obj.productDescription;
                        delete obj.cgst;
                        delete obj.sgst;

                        return true;
                    });
                    savemstrvar.supplierRecipientMasters.filter(function (obj) {
                        delete obj.registrationStatus;
                        delete obj.taxpayerType;
                        delete obj.tradeName;
                        delete obj.legalName;
                        delete obj.isRecipient;
                        delete obj.isSupplier;
                        return true;
                    });
                    
                    var prodList = [];
                    var supList = [];
                    for (let i in savemstrvar.productsMasters) {

                        savemstrvar.productsMasters[i].actionFlag = (savemstrvar.productsMasters[i].actionFlag != "" && savemstrvar.productsMasters[i].actionFlag != null) ? savemstrvar.productsMasters[i].actionFlag : "I";
                        if (savemstrvar.productsMasters[i].oldactionFlag != null) { delete savemstrvar.productsMasters[i].oldactionFlag; }

                        if (savemstrvar.productsMasters[i].actionFlag != "U") {
                            savemstrvar.productsMasters[i].actionFlag = savemstrvar.productsMasters[i].actionFlag != "E" ? savemstrvar.productsMasters[i].actionFlag : "I";
                             prodList.push(savemstrvar.productsMasters[i]);
                        }

                    }
                    for (let i in savemstrvar.supplierRecipientMasters) {

                        savemstrvar.supplierRecipientMasters[i].actionFlag = (savemstrvar.supplierRecipientMasters[i].actionFlag != "" && savemstrvar.supplierRecipientMasters[i].actionFlag != null) ? savemstrvar.supplierRecipientMasters[i].actionFlag : "I";
                        if (savemstrvar.supplierRecipientMasters[i].oldactionFlag != null) { delete savemstrvar.supplierRecipientMasters[i].oldactionFlag; }

                        if (savemstrvar.supplierRecipientMasters[i].actionFlag != "U") {
                            savemstrvar.supplierRecipientMasters[i].actionFlag = savemstrvar.supplierRecipientMasters[i].actionFlag != "E" ? savemstrvar.supplierRecipientMasters[i].actionFlag : "I";
                            // console.log(" savemstrvar:", savemstrvar.supplierRecipientMasters)
                             supList.push(savemstrvar.supplierRecipientMasters[i]);
                        }

                    }
                    savemstrvar.productsMasters = prodList;
                    savemstrvar.supplierRecipientMasters = supList;

                    if ((!savemstrvar.productsMasters || savemstrvar.productsMasters.length < 1) && (!savemstrvar.supplierRecipientMasters || savemstrvar.supplierRecipientMasters.length < 1)) {
                        $scope.dataMsgshow = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.dataMsgshow = false;
                        }, 2000);
                    } else {
                        saveAs(new Blob([JSON.stringify(savemstrvar)], {
                            type: "application/json"
                        }), "" + "masters" + "_" + today + "_" + $scope.userGstin + "_" + "offline_download" + ".json");
                        $scope.jsonMsgshow = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.jsonMsgshow = false;
                        }, 3000);
                    }
                    $scope.addmstr = deleteunwantedparams($scope.addmstr)
                    $scope.savemstr = deleteunwantedparams($scope.savemstr)
                    $scope.selectAll = false;
                    $scope.disablebtn = [];
                    $scope.selectalldisabled = false;
                    $scope.initmastersummary();
                }
            }



        }, function (error) {
            $log.debug("mstrctl ->file generated failed :: response");

        })
    }
    //Mark For Delete
    $scope.markForDelete = function () {
        var tabMaster = "";
        if ($scope.view == "product") {
            tabMaster = "productsMasters"
            if ($scope.savemstr.length < 1) {
                $scope.createAlert(
                    "infocancel",
                    "No records(s) available for Mark for delete",
                    function () { });
            } else {
                $scope.createAlert(
                    "warnconf",
                    "Data of the selected table will be deleted from online portal upon upload of generated JSON.",
                    function () {
                        for (let i in $scope.savemstr) {
                            if ($scope.savemstr[i].actionFlag != "D") {
                                $scope.savemstr[i].oldactionFlag = $scope.savemstr[i].actionFlag;
                            }
                            if ($scope.savemstr[i].actionFlag == "U") {
                                $scope.savemstr[i].actionFlag = "D";
                            }
                        }

                        g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.savemstr), tabMaster).then(function (response) {
                            $scope.successMarkForDel = true;
                            window.scroll(0, 0);
                            $timeout(function () {
                                $scope.successMarkForDel = false;
                            }, 3000);
                            $scope.initmastersummary();
                            $scope.disablebuttonMFD = true;
                            $scope.deletedisable = false;
                        })
                    })
            }
        } else if ($scope.view == "supplier") {
          
            tabMaster = "supplierRecipientMasters"
            if ($scope.suprecmstr.length < 1) {
                $scope.createAlert(
                    "infocancel",
                    "No records(s) available for Mark for delete",
                    function () { });
            } else {
                $scope.createAlert(
                    "warnconf",
                    "Data of the selected table will be deleted from online portal upon upload of generated JSON.",
                    function () {
                        for (let i in $scope.suprecmstr) {
                            if ($scope.suprecmstr[i].actionFlag != "D") {
                                $scope.suprecmstr[i].oldactionFlag = $scope.suprecmstr[i].actionFlag;
                            }
                            if ($scope.suprecmstr[i].actionFlag == "U") {
                                $scope.suprecmstr[i].actionFlag = "D";
                            }
                        }

                        g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.suprecmstr), tabMaster).then(function (response) {
                            $scope.successMarkForDel = true;
                            window.scroll(0, 0);
                            $timeout(function () {
                                $scope.successMarkForDel = false;
                            }, 3000);
                            $scope.initmastersummary();
                            $scope.disableSupbuttonMFD = true;
                            $scope.delsupdisable = false;
                            $scope.selectsupAll = false;
                        })
                    })
            }
        }
    }
    //Single Mark for Delete
    $scope.singleMarkForDel = function (records) {
        for (let i in $scope.savemstr) {
            if (records.productName == $scope.savemstr[i].productName) {

                $scope.savemstr[i].oldactionFlag = $scope.savemstr[i].actionFlag;
                if ($scope.savemstr[i].actionFlag == "U") {
                    $scope.savemstr[i].actionFlag = "D";
                }
                break;
            }

        }
        g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
            $scope.singlesuccessMarkForDel = true;
            window.scroll(0, 0);
            $timeout(function () {
                $scope.singlesuccessMarkForDel = false;
            }, 3000);
            $scope.deletedisable = false;
            $scope.initmastersummary();
        })

    }

    //Muliple select Mark For Delete
    $scope.multiselectMFD = function (deleteData) {
        var deletevar = [];
        const curPageSize = $scope.pageSize;
        const endIndex = $scope.currentPage * curPageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;

        for (startIndx; startIndx < endIndex; startIndx++) {
            if (deleteData[startIndx] && deleteData[startIndx].select) {
                deletevar.push(deleteData[startIndx]);
            }
        }

        if (deletevar.length < 1) {
            $scope.createAlert(
                "infocancel",
                "No record(s) are selected for mark for delete.",
                function () { });
        } else if (deletevar[0].actionFlag == "D") {
            $scope.createAlert(
                "warnOk",
                "Record(s) already marked for delete.",
                function () {

                });

        }
        else {
            $scope.createAlert(
                "warnconf",
                "Are you sure, you want to continue?",
                function () {
                    for (let i in deletevar) {
                        for (let j in $scope.savemstr) {
                            if (deletevar[i].productName == $scope.savemstr[j].productName) {
                                $scope.savemstr[j].oldactionFlag = $scope.savemstr[j].actionFlag;
                                if ($scope.savemstr[j].actionFlag == "U") {
                                    $scope.savemstr[j].actionFlag = "D";
                                }
                                break;
                            }

                        }
                    }
                    g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
                        $scope.successMarkForDel = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successMarkForDel = false;
                        }, 3000);
                        $scope.deletedisable = false;
                        $scope.initmastersummary();
                    })
                })
        }
    }

    

    //Multiple undo Mark for delete
    $scope.undomarkForDel = function () {
        var tabMaster = "";
        if ($scope.view == "product") {
            tabMaster = "productsMasters"
            $scope.createAlert(
                "warnconf",
                "Are you sure, you want to continue?",
                function () {
                    for (let i in $scope.savemstr) {

                        $scope.savemstr[i].actionFlag = $scope.savemstr[i].oldactionFlag;
                    }
                    g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.savemstr), tabMaster).then(function (response) {
                        $scope.successundoMark = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successundoMark = false;
                        }, 3000);
                        $scope.initmastersummary();
                    })
                    $scope.disablebuttonMFD = false;
                })
        }
        else if ($scope.view == "supplier") {
        
            tabMaster = "supplierRecipientMasters"
            $scope.createAlert(
                "warnconf",
                "Are you sure, you want to continue?",
                function () {
                    for (let i in $scope.suprecmstr) {

                        $scope.suprecmstr[i].actionFlag = $scope.suprecmstr[i].oldactionFlag;
                    }
                    g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.suprecmstr), tabMaster).then(function (response) {
                        $scope.successundoMark = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successundoMark = false;
                        }, 3000);
                        $scope.initmastersummary();
                    })
                    $scope.disableSupbuttonMFD = false;
                })
        }
    }

    //Single undo Mark For delete
    $scope.singleundoMarkForDel = function (index) {
        const curPageSize = $scope.pageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;
        index = startIndx + index;

        $scope.savemstr[index].actionFlag = $scope.savemstr[index].oldactionFlag;

        g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.savemstr), "productsMasters").then(function (response) {
            $scope.successundoMark = true;
            window.scroll(0, 0);
            $timeout(function () {
                $scope.successundoMark = false;
            }, 3000);
            $scope.deletedisable = false;
            $scope.initmastersummary();
            $scope.disablebuttonMFD = false;
        })
    }

    // Supplier gstin validation

    $scope.gstinValid = function () {
        $scope.suprecFrm.gstin.$setValidity('pattern', true)
        if (!$scope.newsuprecmstr || !$scope.newsuprecmstr.gstin || $scope.newsuprecmstr.gstin == "") {
            return;
        }
        var validGstin = $scope.validations.gstin($scope.newsuprecmstr.gstin) || $scope.validations.unibodyregex($scope.newsuprecmstr.gstin) || $scope.validations.nriregex($scope.newsuprecmstr.gstin) 
        $scope.suprecFrm.gstin.$setValidity('pattern', validGstin)
    
    }
    //Supplier checkbox disable 
    $scope.supDisable = function () {
        // console.log("$scope.validations.tdsregex($scope.gstin):",$scope.validations.tdsregex($scope.newsuprecmstr.gstin) )
        if($scope.validations.tdsregex($scope.newsuprecmstr.gstin) || 
        $scope.validations.tcsregex($scope.newsuprecmstr.gstin) || 
        $scope.validations.unibodyregex($scope.newsuprecmstr.gstin)){
            $scope.supplierdisable = true;
        }else{
            $scope.supplierdisable = false;
        }
    }

    //Duplicate Gstin

    $scope.isExistingstin = function (gstin, supplierRecipientName, ind, ind1) {

        var frmName = $scope.suprecFrm;
        $scope.duprecord = false;
        $scope.dupsupName = false;
        frmName.gstin.$setValidity('duplicate', true);
        frmName.supplierRecipientName.$setValidity('duplicate', true);
        if (gstin) {
            gstin = gstin.toLowerCase();
        }
        if (supplierRecipientName) {
            supplierRecipientName = supplierRecipientName.toLowerCase();
        }
        for (let i in $scope.addsuprecmstr) {
            if (i != ind) {
                if (($scope.addsuprecmstr[i].gstin && ($scope.addsuprecmstr[i].gstin).toLowerCase() == gstin)) {

                    $scope.duprecord = true;
                }
                if (($scope.addsuprecmstr[i].supplierRecipientName && ($scope.addsuprecmstr[i].supplierRecipientName).toLowerCase() == supplierRecipientName)) {

                    $scope.dupsupName = true;
                }

            }
        }
        for (let i in $scope.suprecmstr) {
            if (i != ind1) {
                if (($scope.suprecmstr[i].gstin && ($scope.suprecmstr[i].gstin).toLowerCase() == gstin)) {

                    $scope.duprecord = true;
                }
                if (($scope.suprecmstr[i].supplierRecipientName && ($scope.suprecmstr[i].supplierRecipientName).toLowerCase() == supplierRecipientName)) {

                    $scope.dupsupName = true;
                }

            }
        }

        frmName.gstin.$setValidity('duplicate', !$scope.duprecord);
        frmName.supplierRecipientName.$setValidity('duplicate', !$scope.dupsupName);
        return $scope.duprecord, $scope.dupsupName;

    }

    //Back Button 
    $scope.supbackFunc = function () {
        if ($scope.addsuprecmstr.length > 0) {
            $scope.createAlert(
                "warnOk",
                "Please click on ‘Save’ button to save the updated/added details",
                function () {
                    $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr);
                    $scope.selectsupAll = false;
                    $scope.selalldisable = false;
                }
            );

        } else {
            $scope.view = 'product';
            $scope.toggle_view = function (view) {
                $scope.view = $scope.view === view ? 'product' : view;

            };
        }
    }

    //Supplier table Add
    $scope.addSupMasterDetails = function () {
        var supObj = {};
        $scope.validator = true;
        if (sessionStorage.getItem("gstin") == $scope.newsuprecmstr.gstin) {
            $scope.sameGstin = true;
            return;
        }
        if ($scope.isExistingstin($scope.newsuprecmstr.gstin, $scope.newsuprecmstr.supplierRecipientName)) {
            return;
        }

        if ($scope.newsuprecmstr && $scope.newsuprecmstr.gstin && $scope.suprecFrm.$valid) {
            supObj["supplierRecipientName"] = $scope.newsuprecmstr.supplierRecipientName;
            supObj["gstin"] = $scope.newsuprecmstr.gstin;
            supObj["tradeName"] = $scope.newsuprecmstr.tradeName;
            supObj["supplierRecipientFlag"] = "";
            if ($scope.newsuprecmstr.supplier == "S") {
                supObj["supplierRecipientFlag"] += "S";
            } if ($scope.newsuprecmstr.recipient == "R") {
                supObj["supplierRecipientFlag"] += "R";
            }


            if ($scope.addsuprecmstr.length >= 10) {
                $scope.createAlert(
                    "info",
                    "You can add maximum 10 records in add supplier/recipient table. Please save these record to added supplier/recipient table or remove some records to add more records in the table.",
                    function () {
                        $scope.successMessageShow = false;
                    }
                );
            } else {
                $scope.addsuprecmstr.push(supObj);
                if ($scope.addsuprecmstr.length >= 1) {
                    $scope.addsubtn = false;
                    $scope.pendingBtn = true;
                }
                if ($scope.suprecmstr.length >= 1) {
                    $scope.addsubtn = false;
                    $scope.pendingBtn = false;
                    $scope.showBtn = true;
                }
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.addSuprecTable = true;
                $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
            }
            $scope.sameGstin = false;
            $scope.suprecFrm.$setPristine();
            $scope.validator = false;
            $scope.newsuprecmstr = {};
            $scope.duprecord = false;
            $scope.dupsupName = false;
            $scope.newsuprecmstr.recipient = "R";
            $scope.supplierdisable = false;
        }
    } 


    //Supplier recipient table
    $scope.saveSupRec = function () {
        
        var suprcObj = {};
        $scope.validator = true;
        if (sessionStorage.getItem("gstin") == $scope.newsuprecmstr.gstin) {
            $scope.sameGstin = true;
            return;
        }
        if ($scope.isExistingstin($scope.newsuprecmstr.gstin, $scope.newsuprecmstr.supplierRecipientName)) {
            return;
        }
        if ($scope.suprecmstr.length >= 50) {
            $scope.createAlert(
                "info",
                "You can add maximum 500 records in Supplier/Recipient master. Please delete some unwanted records to add more records",
                function () {


                }
            );
        } else {
            if ($scope.newsuprecmstr && $scope.newsuprecmstr.gstin && $scope.suprecFrm.$valid) {
                suprcObj["supplierRecipientName"] = $scope.newsuprecmstr.supplierRecipientName;
                suprcObj["gstin"] = $scope.newsuprecmstr.gstin;
                suprcObj["tradeName"] = $scope.newsuprecmstr.tradeName;
                suprcObj["supplierRecipientFlag"] = "";
                if ($scope.newsuprecmstr.supplier == "S") {
                    suprcObj["supplierRecipientFlag"] += "S";
                } if ($scope.newsuprecmstr.recipient == "R") {
                    suprcObj["supplierRecipientFlag"] += "R";
                }



                $scope.suprecmstr.push(suprcObj);
                g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
                    ;
                    $scope.successMessageShow = true;
                    window.scroll(0, 0);
                    $timeout(function () {
                        $scope.successMessageShow = false;
                    }, 3000);
                    $scope.selectsupAll = false;
                    $scope.initmastersummary();
                    $scope.validator = false;
                 });

                $scope.sameGstin = false;
                $scope.newsuprecmstr = {};
                $scope.suprecFrm.$setPristine();
                $scope.validator = false;
                $scope.duprecord = false;
                $scope.dupsupName = false;
                $scope.selalldisable = false;
             }
        }

    }

  
    //Supplier RESET BUTTON
    $scope.supresetbtn = function () {
        $scope.createAlert(
            "warndelete",
            "All record(s) entered in the table will be removed, do you want to continue?",
            function () {

                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.addSuprecTable = false;
                $scope.addsuprecmstr = [];
                $scope.newsuprecmstr = [];
                $scope.validator = false;
                $scope.idx = -1;
                $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
                $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr)
                $scope.selectsupAll = false;
                $scope.newsuprecmstr.recipient = "R";
                $scope.supupdatebtn = false;
                $scope.supplierdisable = false;
                $scope.gstndisabled = false;
                // $scope.pendingBtn = false;
                if ($scope.addsuprecmstr.length <= 1) {
                    $scope.addsubtn = true;
                    $scope.pendingBtn = false;
                    $scope.showBtn = false;
                }
                if ($scope.suprecmstr.length <= 1) {
                    $scope.addsubtn = false;
                    $scope.pendingBtn = false;
                    $scope.showBtn = true;
                }
               
            })
    }

    //Single Delete for Supplier add table
    $scope.addSupSingleDel = function (supData) {
        $scope.createAlert(
            "warndelete",
            "Are you sure, you want to remove this record?",
            function () {
                let index = -1;
                for (let i in $scope.addsuprecmstr) {
                    if ($scope.addsuprecmstr[i].gstin == supData.gstin || $scope.addsuprecmstr[i].supplierRecipientName == supData.supplierRecipientName) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    $scope.addsuprecmstr.splice(index, 1);
                    $scope.successMessageShow = true;
                    window.scroll(0, 0);
                    $timeout(function () {
                        $scope.successMessageShow = false;
                    }, 3000);
                    $scope.validator = false;
                    $scope.sameGstin = false;
                    $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr);
                    $scope.selectsupAll = false;
                    $scope.duprecord = false;
                    $scope.dupsupName = false;
                    $scope.gstndisabled = false;
                    $scope.supplierdisable = false;
               
                }
                if ($scope.addsuprecmstr.length <= 0) {
                    $scope.addSuprecTable = false;
                    $scope.addsubtn = true;
                }
                if ($scope.suprecmstr.length > 0 && $scope.addsuprecmstr.length <= 0) {
                    $scope.addsubtn = false;
                    $scope.pendingBtn = false;
                    $scope.showBtn = true;
                }

            });

    }

    //Edit Add Table for Supplier 

    $scope.idx = -1;
    $scope.addEditSupTable = function (editSupData, index) {
        $scope.gstndisabled = true;
        $scope.supDisable();
        $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr);


        for (let i in $scope.addsuprecmstr) {
            if ($scope.addsuprecmstr[i].gstin == editSupData.gstin) {
                $scope.idx = i;
                break;
            }

        }


        $scope.newsuprecmstr.gstin = editSupData.gstin;
        $scope.newsuprecmstr.supplierRecipientName = editSupData.supplierRecipientName;
        $scope.newsuprecmstr.tradeName = editSupData.tradeName;
        if (editSupData["supplierRecipientFlag"] == 'R') {
            $scope.newsuprecmstr.recipient = 'R';
        }
        if (editSupData["supplierRecipientFlag"] == 'S') {
            $scope.newsuprecmstr.supplier = 'S';
        }
        if (editSupData["supplierRecipientFlag"] == 'SR') {
            $scope.newsuprecmstr.recipient = 'R';
            $scope.newsuprecmstr.supplier = 'S';
        }
        $scope.addsuprecmstr[$scope.idx].addsupdeldisable = true;
        $scope.addsuprecmstr[$scope.idx].select = false;
        $scope.selectsupAll = false;
        $scope.supupdatebtn = true;
        $scope.editSupenable = true;
        $scope.validator = false;
        $scope.supDisable();
        window.scroll(0, 150);

    }

    $scope.addSupEdit = function (index) {
       
        var supObj = {};

        $scope.validator = true;
        if (sessionStorage.getItem("gstin") == $scope.newsuprecmstr.gstin) {
            $scope.sameGstin = true;
            return;
        }
        if ($scope.isExistingstin($scope.newsuprecmstr.gstin, $scope.newsuprecmstr.supplierRecipientName, index)) {
            return;
        }
        for (let i in $scope.suprecmstr) {
            
            if ($scope.suprecmstr[i].disabled != null) {delete $scope.suprecmstr[i].disabled;}
        }
        if ($scope.newsuprecmstr && $scope.newsuprecmstr.gstin && $scope.suprecFrm.$valid) {
            supObj["supplierRecipientName"] = $scope.newsuprecmstr.supplierRecipientName;
            supObj["gstin"] = $scope.newsuprecmstr.gstin;
            supObj["tradeName"] = $scope.newsuprecmstr.tradeName;
            supObj["supplierRecipientFlag"] = "";
            if ($scope.newsuprecmstr.supplier == "S") {
                supObj["supplierRecipientFlag"] += "S";
            } if ($scope.newsuprecmstr.recipient == "R") {
                supObj["supplierRecipientFlag"] += "R";
            }

            $scope.addsuprecmstr[index] = angular.copy(supObj);
            $scope.successMessageShow = true;
            window.scroll(0, 0);
            $timeout(function () {
                $scope.successMessageShow = false;
            }, 3000);
            $scope.validator = false;
            $scope.supupdatebtn = false;
            $scope.newsuprecmstr = {};
            $scope.suprecFrm.$setPristine();
            $scope.editSupenable = false;
            $scope.selectsupAll = false;
            $scope.supplierdisable = false;
            $scope.gstndisabled = false;
            $scope.newsuprecmstr.recipient = "R";
        }
    }
    //Multiple save for supplier 
    $scope.multisaveSupplier = function () {

        if ($scope.suprecmstr.length + $scope.addsuprecmstr.length > 50) {
            $scope.createAlert(
                "info",
                "You can add maximum 500 records in Supplier/Recipient master. Please delete some unwanted records to add more records",
                function () {

                }
            );
        } else {

            $scope.suprecmstr = $scope.suprecmstr.concat($scope.addsuprecmstr);
            $scope.addsuprecmstr = [];

            g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
                ;
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
                $scope.addSuprecTable = false;
                $scope.newsuprecmstr.recipient = "R";
                $scope.validator = false;
                $scope.initmastersummary();
                $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
                $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr)
                $scope.selectsupAll = false;
                $scope.idx = -1;

            });
            $scope.newsuprecmstr = {};
            $scope.suprecFrm.$setPristine();


        }
    }

    //Supplier for Edit Button
    $scope.idx = -1;
    $scope.updateforSup = function (supData) {
     
        $scope.supupdatebtn = true;
        $scope.gstndisabled = true;
        $scope.newsuprecmstr.recipient = "";

        $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
        $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr)

        for (let i in $scope.suprecmstr) {
            if ($scope.suprecmstr[i].gstin == supData.gstin) {
                $scope.idx = i;
            }else{delete $scope.suprecmstr[i].disabled;}
           
        }
      
        $scope.newsuprecmstr.gstin = supData.gstin;
        $scope.newsuprecmstr.supplierRecipientName = supData.supplierRecipientName;
        $scope.newsuprecmstr.tradeName = supData.tradeName;
        if (supData["supplierRecipientFlag"] == 'R') {
            $scope.newsuprecmstr.recipient = 'R';
        } else if (supData["supplierRecipientFlag"] == 'S') {
            $scope.newsuprecmstr.supplier = 'S';
        }else if (supData["supplierRecipientFlag"] == 'SR') {
            $scope.newsuprecmstr.recipient = 'R';
            $scope.newsuprecmstr.supplier = 'S';
        }
        $scope.suprecmstr[$scope.idx].addedSupdisable = true;
        $scope.suprecmstr[$scope.idx].disabled = true;
        $scope.suprecmstr[$scope.idx].select = false;
        $scope.selalldisable = true;
        $scope.selectsupAll = false;
        $scope.editSupenable = false;
        $scope.supDisable();
        window.scroll(0, 150);
    }
    //After edit button - save for supplier tale
    $scope.updateSupTable = function (index) {
        var savSupObj = {};
        $scope.validator = true;
        if (sessionStorage.getItem("gstin") == $scope.newsuprecmstr.gstin) {
            $scope.sameGstin = true;
            return;
        }
        if ($scope.isExistingstin($scope.newsuprecmstr.gstin, $scope.newsuprecmstr.supplierRecipientName, -1, index)) {
            return;
        }
      
        if ($scope.newsuprecmstr && $scope.newsuprecmstr.gstin && $scope.suprecFrm.$valid) {
            savSupObj["supplierRecipientName"] = $scope.newsuprecmstr.supplierRecipientName;
            savSupObj["gstin"] = $scope.newsuprecmstr.gstin;
            savSupObj["tradeName"] = $scope.newsuprecmstr.tradeName;
            savSupObj["supplierRecipientFlag"] = "";
            if ($scope.newsuprecmstr.supplier == "S") {
                savSupObj["supplierRecipientFlag"] += "S";
            } if ($scope.newsuprecmstr.recipient == "R") {
                savSupObj["supplierRecipientFlag"] += "R";
            }
           
            for (let i in $scope.suprecmstr) {
                if ($scope.suprecmstr[i].actionFlag == "U") {
                    savSupObj["actionFlag"] = "E";
                }
            }

            $scope.suprecmstr[index] = angular.copy(savSupObj);
          
            g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
                $scope.successMessageShow = true;
                window.scroll(0, 0);
                $timeout(function () {
                    $scope.successMessageShow = false;
                }, 3000);
            });
            $scope.validator = false;
            $scope.supupdatebtn = false;
            $scope.newsuprecmstr = {};
            $scope.suprecFrm.$setPristine();
            $scope.selalldisable = false;
            $scope.selectsupAll = false;
            $scope.gstndisabled = false;
            $scope.newsuprecmstr.recipient = "R";
            $scope.supplierdisable = false;
        }
    }

    //Single delete for supplier added table

    $scope.singleDelSup = function (supplierData) {
        $scope.createAlert(
            "warndelete",
            "Are you sure, you want to remove this record?",
            function () {
                let index = -1;

                for (let i in $scope.suprecmstr) {
                    if ($scope.suprecmstr[i].gstin == supplierData.gstin) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    $scope.suprecmstr.splice(index, 1);
                    g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
                        ;
                        $scope.successMessageShow = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successMessageShow = false;
                        }, 3000);

                        $scope.validator = false;
                        $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
                        $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr)
                        $scope.initmastersummary();
                        $scope.sameGstin = false;
                        $scope.dupsupName = false;
                        $scope.duprecord = false;
                        $scope.gstndisabled = false;
                        $scope.selalldisable = false;
                        if ($scope.suprecmstr.length <= 0) {
                            $scope.addsubtn = true;
                            $scope.pendingBtn = false;
                            $scope.showBtn = false;
                        }
                    });
                }
            });
    }

    //Cancel button for supplier table
    $scope.cancelSupBtn = function () {
        $scope.newsuprecmstr.recipient = "";
        $scope.newsuprecmstr.supplier = ""; 
        $scope.gstndisabled = false;
        $scope.newsuprecmstr.gstin = null;
        $scope.newsuprecmstr.tradeName = null;
        $scope.newsuprecmstr.supplierRecipientName = null;
        $scope.addsupdeldisable = [];
        $scope.duprecord = false;
        $scope.selalldisable = false;
        $scope.suprecFrm.$setPristine();
        $scope.validator = false;
        $scope.dupsupName = false;
        $scope.supupdatebtn = false;
        $scope.sameGstin = false;
        $scope.editSupenable = false;
        $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
        $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr)
        if ($scope.selectsupAll) {
            $scope.suprecmstr[$scope.idx].select = true;
        }
        if ($scope.suprecmstr[$scope.idx].select != null && $scope.selectsupAll) {
            $scope.suprecmstr[$scope.idx].select = true;
        }

        if ($scope.suprecmstr[$scope.idx].addedSupdisable != null) {
            $scope.suprecmstr[$scope.idx].addedSupdisable = false;
        }
        if ($scope.suprecmstr[$scope.idx].disabled != null) {
            $scope.suprecmstr[$scope.idx].disabled = false;
        }
        $scope.idx = -1;
        $scope.supplierdisable = false;
        $scope.newsuprecmstr.recipient = "R";
    }
    //Multi remove for supplier
    $scope.multiRemove = function (deleteData) {
       
        let count = 0;
        for (let i in deleteData) {
            if (deleteData[i].select) {
                count++;
            }
        }
        if (count < 1) {
            $scope.createAlert(
                "infocancel",
                "No record(s) are selected for remove.",
                function () { });
        } else {
            var newlist = [];
            for (let i in deleteData) {

                if ((deleteData[i].actionFlag == "U" || deleteData[i].actionFlag == "D") && deleteData[i].select) {

                    newlist.push(deleteData[i])

                } else if (!deleteData[i].select) {
                    newlist.push(deleteData[i])
                }

            }
            $scope.createAlert(
                "warndelete",
                "Are you sure, you want to remove this record?",
                function () {
                    g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams(newlist), "supplierRecipientMasters").then(function (response) {

                        $scope.successMessageShow = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successMessageShow = false;
                        }, 3000);


                        $scope.initmastersummary();
                        $scope.addsuprecmstr = deleteunwantedparams($scope.addsuprecmstr)
                        $scope.suprecmstr = deleteunwantedparams($scope.suprecmstr)
                        $scope.selectsupAll = false;
                        $scope.sameGstin = false;
                        $scope.dupsupName = false;
                        $scope.gstndisabled = false;
                        $scope.duprecord = false;
                        $scope.selalldisable = false;
                        $scope.delsupdisable = false;
                        $scope.supplierdisable = false;
                       
                        if ($scope.suprecmstr.length >= 1) {
                            $scope.addsubtn = true;
                        }
                    });
                });
        }
    }
    //Gstin color changes
    $scope.gstinUser = function (regStatus) {
        let obj = {};
        if (!regStatus) {
            obj.color = "orange";
        }
        else if (regStatus == 'C' || regStatus == 'S') {
            obj.color = "red";
        } else if (regStatus != 'C') {
            obj.color = "green";
        }

        return obj;
    }

    //Single Supplier Mark for Delete
    $scope.singleSupMarkForDel = function (records) {
        for (let i in $scope.suprecmstr) {
            if (records.gstin == $scope.suprecmstr[i].gstin) {

                $scope.suprecmstr[i].oldactionFlag = $scope.suprecmstr[i].actionFlag;
                if ($scope.suprecmstr[i].actionFlag == "U") {
                    $scope.suprecmstr[i].actionFlag = "D";
                }
                break;
            }

        }
        g1FileHandler.saveProductMstr($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
            $scope.singlesuccessMarkForDel = true;
            window.scroll(0, 0);
            $timeout(function () {
                $scope.singlesuccessMarkForDel = false;
            }, 3000);

            $scope.initmastersummary();
            $scope.delsupdisable = false;
        })

    }
    //Multi mark for delete 
    $scope.multisupselectMFD = function (supdeleteData) {
        var supdeletevar = [];
        const curPageSize = $scope.pageSize;
        const endIndex = $scope.currentPage * curPageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;

        for (startIndx; startIndx < endIndex; startIndx++) {
            if (supdeleteData[startIndx] && supdeleteData[startIndx].select) {
                supdeletevar.push(supdeleteData[startIndx]);
            }
        }


        if (supdeletevar.length < 1) {
            $scope.createAlert(
                "infocancel",
                "No record(s) are selected for mark for delete.",
                function () { });
        } else if (supdeletevar[0].actionFlag == "D") {
            $scope.createAlert(
                "warnOk",
                "Record(s) already marked for delete.",
                function () {

                });

        }
        else {
            $scope.createAlert(
                "warnconf",
                "Are you sure, you want to continue?",
                function () {
                    for (let i in supdeletevar) {
                        for (let j in $scope.suprecmstr) {
                            if (supdeletevar[i].gstin == $scope.suprecmstr[j].gstin) {
                                $scope.suprecmstr[j].oldactionFlag = $scope.suprecmstr[j].actionFlag;
                                if ($scope.suprecmstr[j].actionFlag == "U") {
                                    $scope.suprecmstr[j].actionFlag = "D";
                                }
                                break;
                            }

                        }
                    }
                    g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
                        $scope.successMarkForDel = true;
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successMarkForDel = false;
                        }, 3000);
                        $scope.delsupdisable = false;
                        $scope.initmastersummary();
                        $scope.selectsupAll = false;
                    })
                })
        }
    }

      //Single supplier undo Mark For delete
      $scope.singleSupundoMarkForDel = function (index) {
        const curPageSize = $scope.pageSize;
        let startIndx = $scope.currentPage * curPageSize - curPageSize;
        index = startIndx + index;

        $scope.suprecmstr[index].actionFlag = $scope.suprecmstr[index].oldactionFlag;

        g1FileHandler.markForDeletefunc($scope.userGstin, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters").then(function (response) {
            $scope.successundoMark = true;
            window.scroll(0, 0);
            $timeout(function () {
                $scope.successundoMark = false;
            }, 3000);
            $scope.delsupdisable = false;
            $scope.initmastersummary();
            $scope.disablebuttonMFD = false;
        })
    }


    $scope.regStatusArray = {

        "A": "Active",
        "C": "Cancelled",
        "S": "Suspended",
        "E": "Expired"
    };

    $scope.txpTypeArray = {

        TP: {
            "lbl": "Regular",
            "val": "Regular taxpayer"
        },


        NT: {
            "lbl": "Regular",
            "val": "Regular taxpayer"
        },

        REG: {
            "lbl": "Regular",
            "val": "Regular taxpayer"
        },

        CA: {
            "lbl": "Casual",
            "val": "Casual taxpayer"
        },
        CO: {

            "lbl": "Composition",
            "val": "Composition taxpayer"
        }, SEZU: {

            "lbl": "SEZ unit/developer",
            "val": "SEZ unit/developer"
        }, NR: {

            "lbl": "NRTP",
            "val": "Non-Resident Taxable person"
        }, NRTP: {

            "lbl": "NRTP",
            "val": "Non-Resident Taxable person"
        }, ID: {

            "lbl": "ISD",
            "val": "Input Service Distributor"
        }, TD: {

            "lbl": "TDS",
            "val": "Deductor"
        }, TS: {

            "lbl": "TCS",
            "val": "e-commerce operator"
        }, UN: {

            "lbl": "UIN",
            "val": "Unique Identity Number holder"
        }, TR: {

            "lbl": "Temporary Registration",
            "val": "Temporary Registration"
        }
    }

    //UQCList
    $scope.mstrUQCList = [
        {
            "value": "BAG",
            "name": "BAG-BAGS"
        }, {
            "value": "BAL",
            "name": "BAL-BALE"
        }, {
            "value": "BDL",
            "name": "BDL-BUNDLES"
        }, {
            "value": "BKL",
            "name": "BKL-BUCKLES"
        }, {
            "value": "BOU",
            "name": "BOU-BILLION OF UNITS"
        }, {
            "value": "BOX",
            "name": "BOX-BOX"
        }, {
            "value": "BTL",
            "name": "BTL-BOTTLES"
        }, {
            "value": "BUN",
            "name": "BUN-BUNCHES"
        }, {
            "value": "CAN",
            "name": "CAN-CANS"
        }, {
            "value": "CBM",
            "name": "CBM-CUBIC METERS"
        }, {
            "value": "CCM",
            "name": "CCM-CUBIC CENTIMETERS"
        }, {
            "value": "CMS",
            "name": "CMS-CENTIMETERS"
        }, {
            "value": "CTN",
            "name": "CTN-CARTONS"
        }, {
            "value": "DOZ",
            "name": "DOZ-DOZENS"
        }, {
            "value": "DRM",
            "name": "DRM-DRUMS"
        }, {
            "value": "GGK",
            "name": "GGK-GREAT GROSS"
        }, {
            "value": "GMS",
            "name": "GMS-GRAMMES"
        },
        {
            "value": "GRS",
            "name": "GRS-GROSS"
        }, {
            "value": "GYD",
            "name": "GYD-GROSS YARDS"
        }, {
            "value": "KGS",
            "name": "KGS-KILOGRAMS"
        }, {
            "value": "KLR",
            "name": "KLR-KILOLITRE"
        }, {
            "value": "KME",
            "name": "KME-KILOMETRE"
        }, {
            "value": "LTR",
            "name": "LTR-LITRES"
        }, {
            "value": "MLT",
            "name": "MLT-MILILITRE"
        }, {
            "value": "MTR",
            "name": "MTR-METERS"
        }, {
            "value": "MTS",
            "name": "MTS-METRIC TON"
        },
        {
            "value": "NOS",
            "name": "NOS-NUMBERS"
        },

        {
            "value": "PAC",
            "name": "PAC-PACKS"
        },
        {
            "value": "PCS",
            "name": "PCS-PIECES"
        },
        {
            "value": "PRS",
            "name": "PRS-PAIRS"
        },
        {
            "value": "QTL",
            "name": "QTL-QUINTAL"
        },
        {
            "value": "ROL",
            "name": "ROL-ROLLS"
        },

        {
            "value": "SET",
            "name": "SET-SETS"
        },
        {
            "value": "SQF",
            "name": "SQF-SQUARE FEET"
        },
        {
            "value": "SQM",
            "name": "SQM-SQUARE METERS"
        },
        {
            "value": "SQY",
            "name": "SQY-SQUARE YARDS"
        },
        {
            "value": "TBS",
            "name": "TBS-TABLETS"
        },

        {
            "value": "TGM",
            "name": "TGM-TEN GROSS"
        },
        {
            "value": "THD",
            "name": "THD-THOUSANDS"
        },

        {
            "value": "TON",
            "name": "TON-TONNES"
        },
        {
            "value": "TUB",
            "name": "TUB-TUBES"
        },
        {
            "value": "UGS",
            "name": "UGS-US GALLONS"
        },
        {
            "value": "UNT",
            "name": "UNT-UNITS"
        },
        {
            "value": "YDS",
            "name": "YDS-YARDS"
        },
        {
            "value": "OTH",
            "name": "OTH-OTHERS"
        }
    ];


}]);

myApp.controller("uploadsummaryctrl", ['$scope', '$rootScope', 'g1FileHandler', '$log', '$location', 'shareData', 'ReturnStructure', 'R1InvHandler', function ($scope, $rootScope, g1FileHandler, $log, $location, shareData, ReturnStructure, R1InvHandler) {

    if (shareData.dashBoardDt) {
        $scope.dashBoardDt = shareData.dashBoardDt;
        if ($scope.dashBoardDt.form == 'GSTR1') {
            $scope.isUploadFlag = "S";
        }
        else if ($scope.dashBoardDt.form == 'GSTR2') {
            $scope.isUploadFlag = "R";
        }
        getUploadSectionList();
    } else {
        $scope.page("/gstr/upload/dashboard");
    }

    //get sectionlist
    $scope.sectionList = [];
    $scope.sectionListSelected = null;
    $scope.templateLoaded = false;
    $scope.search_filter_value = { val: '' }; // use object for pass by ref and avoid cloning
    var tblcode, form, reformateInv, formateNodePayload;

    function getUploadSectionList() {
        //CR#18639- IFF_form_sectionlist
        var rtn_prd = parseInt(shareData.dashBoardDt.fp.slice(0, 2));
        if (shareData.isTPQ == true && rtn_prd % 3 !== 0) {
            shareData.dashBoardDt.form = "GSTR1IFF";
        }
        g1FileHandler.getUploadSectionList(shareData.dashBoardDt.form).then(function (response) {
            $log.debug("uploadsummarycrtl -> getOptionList success:: ", response);
            if (response) {
                $scope.sectionList = response;
                $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
                tblcode = $scope.sectionListSelected.cd;
                form = $scope.dashBoardDt.form;
            }
            // //CR#18639-changes for IFF_form 
            if (shareData.dashBoardDt.form == "GSTR1IFF") {
                shareData.dashBoardDt.form = "GSTR1";
            }
        }, function (response) {
            $log.debug("uploadsummarycrtl -> getOptionList fail:: ", response);
        });
    }

    function getUploadedSectionsOnly(iResp) {
        g1FileHandler.getUploadContentsFor(shareData.dashBoardDt).then(function (prevContent) {
            $log.debug("uploadsummarycrtl -> getUploadContentsFor success:: ", prevContent);


            iResp.filter(function (section) {
                if (prevContent.hasOwnProperty(section.cd)) {
                    $scope.sectionList.push(section);
                }
            });
            $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
            tblcode = $scope.sectionListSelected.cd;
            form = $scope.dashBoardDt.form;
        }
            , function (response) {
                $log.debug("uploadsummarycrtl -> getUploadContentsFor Failure:: ", response);
            });
    }
    //formatters
    function initFormatters() {
        reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, $scope.sectionListSelected.cd, shareData.dashBoardDt.form);
        formateNodePayload = ReturnStructure.formateNodePayload($scope.sectionListSelected.cd, shareData.dashBoardDt.form);
    }
    $scope.supaddenabled= false; 
    $scope.onSectionChange = function (iData) {
        $scope.sectionListSelected = iData;
        $scope.templateLoaded = false;
        shareData.pageNum = null;
        $scope.currentPage = 1;
        if(iData){
            shareData.table = iData.cd;
        }
        angular.forEach($scope.sectionList, function (section, i) {
            if (section.cd === iData.cd) {
                shareData.scLsSetIdx = i;
                //$scope.isUploadFlag = 'R';
                $scope.search_filter_value.val = '';
                shareData.filter_val = '';
                $('.summaryFilterInput').val('');
            }
        });
        if (form == "GSTR1" || form == "GSTR1IFF")
            $scope.isUploadFlag = 'S';
        else
            $scope.isUploadFlag = 'R';
        jQuery('.invsumm li').removeClass('active')
        jQuery('.invsumm li:first-child').addClass('active')

    }

    $scope.deleteSectionData = function () {
        var param = {
            gstin: shareData.dashBoardDt.gstin,
            form: shareData.dashBoardDt.form,
            fy: shareData.dashBoardDt.fy,
            month: shareData.dashBoardDt.month,
            tbl_cd: $scope.sectionListSelected.cd,
            type: "Import",
            returnFileName: shareData.dashBoardDt.returnFileName
        }

        g1FileHandler.deleteSectionData(param).then(function (response) {
            $log.debug("uploadsummarycrtl -> deleteSectionData succ :: ", response);
            $scope.createAlert("Success", response);
            $scope.checked.selectall = 'N';
            shareData.checkCount = 0;
            var cd = $scope.sectionListSelected.cd;
            var summaryUrl = "";
            if (cd == 'b2b' || cd == 'cdnr') {
                summaryUrl = getUrl($scope.isUploadFlag);
            } else {
                summaryUrl = 'summary.html'
            }

            if (cd == 'hsnsum') {
                cd = 'hsn';
            }
            if (cd == 'hsn(b2b)') {
                cd = "hsn";
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + cd + "/" + newSummary.html;
            }
            if (cd == 'hsn(b2c)') {
                cd = "hsn";
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + cd + "/" + b2c.html;
            }
            if (cd == 'doc_issue') {
                cd = 'doc';
            } 
            if(cd == 'ecomb2b' || cd == 'ecomb2c' || cd == 'ecomurp2b' || cd == 'ecomurp2c'){
                if(cd == 'ecomb2b')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecom" + "/summary.html";
                if(cd == 'ecomb2c')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecom" + "/b2csummary.html";
                if(cd == 'ecomurp2b')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecom" + "/c2bsummary.html";
                if(cd == 'ecomurp2c')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecom" + "/c2csummary.html";
            
            }else if(cd == 'ecomab2b' || cd == 'ecomab2c' || cd == 'ecomaurp2b' || cd == 'ecomaurp2c'){
                if(cd == 'ecomab2b')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecoma" + "/b2basummary.html";
                if(cd == 'ecomab2c')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecoma" + "/b2casummary.html";
                if(cd == 'ecomaurp2b')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecoma" + "/urp2basummary.html";
                if(cd == 'ecomaurp2c')
                $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + "ecoma" + "/urp2casummary.html";
            }
            else{
            $scope.sectionListSelected.url = "/pages/returns/upload/" + form + "/" + cd + "/" + summaryUrl;
            }
        }, function (error) {
            $log.debug("uploadsummarycrtl -> deleteSectionData fail :: ", error);
            $scope.createAlert("Error", response);
        });
    }

    function getTaxpayerResponse(iResp) {
        var taxPayerList = []
        angular.forEach(iResp, function (inv, i) {
            if (shareData.dashBoardDt.form == 'GSTR1' && inv.updby !== 'R') {
                taxPayerList.push(inv);
            } else if (shareData.dashBoardDt.form == 'GSTR2' && inv.updby !== 'S') {
                taxPayerList.push(inv);
            }
        });
        return taxPayerList;
    }


    $scope.setDeleteFlagForData = function () {

        $scope.createAlert("Warning",
            'Data of selected section will be deleted from Online Portal upon upload of generated JSON', function () {
                $().blockPage(true);
                g1FileHandler.uploadDeleteAll($scope.dashBoardDt).then(function (response) {
                    jQuery('.table-responsive').css('opacity', 1);
                    if (response) {
                        $().blockPage(false);

                        if ($scope.sectionListSelected.cd == 'b2b' || $scope.sectionListSelected.cd == 'cdnr' || $scope.sectionListSelected.cd == 'b2ba' || $scope.sectionListSelected.cd == 'cdnra') {
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/uploadedbytaxpayersummary.html";
                        }
                        else if($scope.sectionListSelected.cd == 'ecomb2b' || $scope.sectionListSelected.cd == 'ecomb2c' || $scope.sectionListSelected.cd == 'ecomurp2b' || $scope.sectionListSelected.cd == 'ecomurp2c'){
                            if($scope.sectionListSelected.cd == 'ecomb2b')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecom" + "/summary.html";
                            if($scope.sectionListSelected.cd == 'ecomb2c')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecom" + "/b2csummary.html";
                            if($scope.sectionListSelected.cd == 'ecomurp2b')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecom" + "/c2bsummary.html";
                            if($scope.sectionListSelected.cd == 'ecomurp2c')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecom" + "/c2csummary.html";
                        
                        }else if($scope.sectionListSelected.cd == 'ecomab2b' || $scope.sectionListSelected.cd == 'ecomab2c' || $scope.sectionListSelected.cd == 'ecomaurp2b' || $scope.sectionListSelected.cd == 'ecomaurp2c'){
                            if($scope.sectionListSelected.cd == 'ecomab2b')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecoma" + "/b2basummary.html";
                            if($scope.sectionListSelected.cd == 'ecomab2c')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecoma" + "/b2casummary.html";
                            if($scope.sectionListSelected.cd == 'ecomaurp2b')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecoma" + "/urp2basummary.html";
                            if($scope.sectionListSelected.cd == 'ecomaurp2c')
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + "ecoma" + "/urp2casummary.html";
                        }
			           else if( $scope.sectionListSelected.cd == 'hsn(b2b)'){
                            $scope.sectionListSelected.cd = "hsn";
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/newSummary.html"; 
                        }
                        else if( $scope.sectionListSelected.cd== 'hsn(b2c)'){
                            $scope.sectionListSelected.cd = "hsn";
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/b2c.html"; 
                        }
                        else {
                            if ($scope.sectionListSelected.cd == "hsnsum") {
                                $scope.sectionListSelected.cd = "hsn";
                            }
                            if ($scope.sectionListSelected.cd == "doc_issue") {
                                $scope.sectionListSelected.cd = "doc";
                            }
                            $scope.sectionListSelected.url = "pages/returns/upload/" + $scope.dashBoardDt.form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/summary.html";

                        }
                        $scope.createAlert("Success", response);
                        $scope.checked.selectall = 'N';
                        shareData.checkCount = 0;
                    }

                }, function (response) {
                    jQuery('.table-responsive').css('opacity', 1);
                    $scope.createAlert("WarningOk", response, function () { });
                    $().blockPage(false);
                    $log.debug("returnsctrl -> setDeleteFlagForData fail:: ", response);
                });
                if ($scope.sectionListSelected.url[0] !== '/') {
                    $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
                }
                // g1FileHandler.getUploadContentsFor(shareData.dashBoardDt, $scope.sectionListSelected.cd).then(function (response) {

                //     $log.debug("uploadsummarycrtl -> getUploadContentsFor success:: ", response);
                //     if (response) {
                //         if ($scope.sectionListSelected.cd == 'hsn')
                //             response = response.data;
                //         if ($scope.sectionListSelected.cd == 'hsnsum')
                //             response = response.det;
                //         if ($scope.sectionListSelected.cd == 'doc_issue') {
                //             response = response.doc_det;
                //             secData = response;
                //         }
                //         if (!secData)
                //             secData = reformateInv(response);
                //         // if ($scope.sectionListSelected.cd == 'b2b' || $scope.sectionListSelected.cd == 'cdnr') {
                //         //     deleteData = getTaxpayerResponse(secData);
                //         // } else {
                //         //     deleteData = secData;
                //         // }

                //         if ($scope.sectionListSelected.cd == 'doc_issue') {
                //             angular.forEach(secData, function (docObj, i) {
                //                 angular.forEach(docObj.docs, function (inv, i) {
                //                     updatedNodeDetails = {
                //                         doc_num: docObj.doc_num,
                //                         num: inv.num
                //                     }
                //                     invdltArray.push(updatedNodeDetails);
                //                 });
                //             })
                //         }
                //         else {
                //             angular.forEach(secData, function (inv, i) {
                //                 invdltArray.push(ReturnStructure.getUpdatedNodeDetails($scope.sectionListSelected.cd, inv, shareData.dashBoardDt.form));
                //             });
                //         }

                //         if (invdltArray.length > 0)
                //             R1InvHandler.uploadSetDeleteOrDelete($scope, null, invdltArray).then(function (response) {
                //                 $().blockPage(false);
                //             });
                //         else {
                //             $scope.createAlert("WarningOk", "No Data to Mark as Delete.", function () { });
                //             $().blockPage(false);
                //         }
                //     }
                // });
            });
    }

    $scope.goToImportPage = function () {
        shareData.isUploadImport = 'Y';
        $scope.page('gstr/invoices/import');
    }

    $scope.isB2BCDNR = function () {
        return ($scope.sectionListSelected && ($scope.sectionListSelected.cd == "b2b" || $scope.sectionListSelected.cd == "cdnr" || $scope.sectionListSelected.cd == "b2ba" || $scope.sectionListSelected.cd == "cdnra")) ? true : false;
    }

    function getUrl(iFlag) {
        var summaryUrl;
        if (form == 'GSTR1') {
            if (iFlag == 'S') {
                summaryUrl = "uploadedbytaxpayersummary.html";
            }
            else if (iFlag == 'R') {
                summaryUrl = "uploadedbycounterpartysummary.html"
            }
            else if (iFlag == 'Rejected') {
                summaryUrl = "rejectedbycounterpartysummary.html"
            }
            else if (iFlag == 'Modified') {
                summaryUrl = "modifiedbycounterpartysummary.html"
            }
        } else if (form == 'GSTR1A')
            summaryUrl = "counterpartysummary.html";
        else {
            if (iFlag == 'R') {
                summaryUrl = "uploadedbytaxpayersummary.html";
            }
            else if (iFlag == 'S') {
                summaryUrl = "uploadedbycounterpartysummary.html"
            }
        }
        return summaryUrl;
    }

    $scope.isTabChange = function (iFlag) {
        $scope.isUploadFlag = iFlag;
        var summaryUrl;
        if ($scope.isB2BCDNR()) {
            summaryUrl = getUrl(iFlag);
            $scope.sectionListSelected.url = "/pages/returns/upload/" + form.toLowerCase() + "/" + $scope.sectionListSelected.cd + "/" + summaryUrl;
        }
    }

    $scope.isTaxpayer = function () {
        var flag = false;
        if (form !== 'GSTR2A') {
            if (form == 'GSTR1' && $scope.isUploadFlag == 'S') {
                flag = true;
            }
            else if (form == 'GSTR1IFF' && $scope.isUploadFlag == 'S') {
                flag = true;
            }
            else if (form == 'GSTR2' && $scope.isUploadFlag == 'R') {
                flag = true;
            }
            else {
                flag = false;
            }
        }
        return flag;
    }


    $scope.finishLoading = function () {
        $scope.templateLoaded = true;
    }

    //Pagination related controls
    $scope.currentPage = (shareData.pageNum) ? shareData.pageNum : 1;
    $scope.pageSize = 25;
    $scope.pageChangeHandler = function (newPage) {
        shareData.pageNum = newPage;
        $rootScope.isLastPage(newPage, $scope.pageSize);
        //shareData.pageNum = newPage;
        //$scope.initSumryList();
    }

    shareData.filter_val = '';

    $scope.filterChanged = function () {
        shareData.filter_val = $scope.search_filter_value.val;
        $scope.$broadcast('filterValChanged');
    };

    $scope.goToBackPageUpload = function () {
        if (shareData.isPrvwUpload == "true") {
            $scope.page('/gstr/upload/preview');
        }
        else if (shareData.isPrvwUpload == "false") {
            $scope.page('/gstr/upload/dashboard');
        }

    }
}]);

myApp.controller("errorsummaryctrl", ['$scope', '$rootScope', 'g1FileHandler', '$log', '$location', 'shareData', 'ReturnStructure', 'R1InvHandler', function ($scope, $rootScope, g1FileHandler, $log, $location, shareData, ReturnStructure, R1InvHandler) {


    if (shareData.dashBoardDt) {
        $scope.dashBoardDt = shareData.dashBoardDt;
        shareData.isUploadImport = 'E';
        getErrorSectionList();
    } else {
        $scope.page("/gstr/error/dashboard");
    }

    //get sectionlist
    $scope.sectionList = null;
    $scope.sectionListSelected = null;
    $scope.templateLoaded = false;
    var tblcode;

    function getErrorSectionList() {
        g1FileHandler.getErrorSectionList(shareData.dashBoardDt.form).then(function (response) {
            $log.debug("errorsummaryctrl -> getErrorSectionList success:: ", response);
            if (response) {
                getErrorSectionsOnly(response);
            }
        }, function (response) {
            $log.debug("errorsummaryctrl -> getErrorSectionList fail:: ", response);
        });


    }

    function getErrorSectionsOnly(iResp) {
        $scope.sectionList = [];
        g1FileHandler.getErrorContentsFor(shareData.dashBoardDt).then(function (prevContent) {
            $log.debug("errorsummaryctrl -> getErrorContentsFor success:: ", prevContent);


            iResp.filter(function (section) {
                
                if (section.cd == 'hsn(b2b)') {
                    if (prevContent['error_report'].hsn != undefined || prevContent['error_report'].hsn != null) {
                        for (var i = 0; i < prevContent['error_report'].hsn.length; i++) {
                            if (prevContent['error_report'].hsn[i].hsn_b2b != null || prevContent['error_report'].hsn[i].hsn_b2b != undefined) {
                                $scope.sectionList.push(section);
                                $scope.sectionListSelected = $scope.sectionList[0];
                                tblcode = $scope.sectionListSelected.cd;
                                break;
                            }
                        }

                    }
                }
                if (section.cd == 'hsn(b2c)') {
                    if (prevContent['error_report'].hsn != undefined || prevContent['error_report'].hsn != null) {
                        for (var i = 0; i < prevContent['error_report'].hsn.length; i++) {
                            if (prevContent['error_report'].hsn[i].hsn_b2c != null || prevContent['error_report'].hsn[i].hsn_b2c != undefined) {
                                $scope.sectionList.push(section);
                                $scope.sectionListSelected = $scope.sectionList[0];
                                tblcode = $scope.sectionListSelected.cd;
                                break;
                            }
                        }

                    }
                }

                if (prevContent['error_report'].hasOwnProperty(section.cd)) {
                    $scope.sectionList.push(section);
                }
            });
            $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
            tblcode = $scope.sectionListSelected.cd;

        }
            , function (response) {
                $log.debug("errorsummaryctrl -> getErrorContentsFor Failure:: ", response);
            });
    }

    $scope.onSectionChange = function (iData) {
        $scope.sectionListSelected = iData;
        $scope.templateLoaded = false;
        shareData.pageNum = null;
        $scope.currentPage = 1;

        angular.forEach($scope.sectionList, function (section, i) {
            if (section.cd === iData.cd) {
                shareData.scLsSetIdx = i;
            }
        });
    }


    $scope.finishLoading = function () {
        $scope.templateLoaded = true;
    }

    //ADDITION BY P START
    //to upload multi excel for error flow
    $scope.uploadFile = function () {

        var file = $scope.excelFile;
        if (!file)
            return;
        $scope.processStarted = false;
        //$scope.excelFile = null;
        $scope.fileSelected = false;
        $('#excelUploadField').val('');
        $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
            $scope.processStarted = true;
            setTimeout(function () {
                if ($scope.processStarted) {
                    // proces is working, show message
                    $('body').append('<div class="delayMSg" style="position: fixed; z-index: 99999; bottom: 0; left: 0; right: 0; width: 100%; height: 40px; text-align: center; background: white; padding-top: 11px; border-top: 1px solid #2c4e86;">Import is being processed, please wait...</div>');
                }
            }, 1000);
            $scope.progressbar.start();
            $().blockPage(true);
            var file = $scope.excelFile;
            g1FileHandler.savePayloadFile(file, shareData)
                .then(function (response) {

                    $('.delayMSg').html('Import is being processed, please wait...');
                    $scope.processStarted = false;
                    $scope.onExcelProcessed(response);
                    //  $scope.progressbar.complete();
                    //$().blockPage(false);

                })
                .catch(function (err) {
                    $('.delayMSg').remove();
                    $scope.processStarted = false;
                    $scope.progressbar.complete();
                    $().blockPage(false);
                    $scope.createAlert("Error", "File Process Failed");
                });
        });
    }

    $scope.onExcelProcessed = function (data) {

        R1InvHandler.upMultipleSections($scope, { cache_key: data.cache_key }, data.errData, data.multiItmErrData, data.misMatchedErrData, data.errb2clInvAry, data.errShipDtData, data.errActionInvAry, data.errActionErrorStatusInvAry, data.errMissingHeaderDataArry, shareData.isUploadImport)
            .then(function (iRs) {
                $('.delayMSg').remove();
                $scope.progressbar.complete();
                $().blockPage(false);
            }, function () {
                $('.delayMSg').remove();
            })
            .catch(function (err) {
                $('.delayMSg').remove();

                $('.delayMSg').remove();
                $scope.processStarted = false;
                $scope.progressbar.complete();
                $().blockPage(false);
                //$scope.createAlert("Error", "File Process Failed");
            });
        if ($scope.sectionListSelected.url[0] !== '/') {
            $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
        }




    }
    //ADDITION BY P END 

    //Pagination related controls
    $scope.currentPage = (shareData.pageNum) ? shareData.pageNum : 1;
    $scope.pageSize = 25;
    $scope.pageChangeHandler = function (newPage) {
        shareData.pageNum = newPage;
        $rootScope.isLastPage(newPage, $scope.pageSize);
        //           shareData.pageNum = newPage;
        //            initSumryList();
    }
    $scope.goToBackPageError = function () {
        if (shareData.isPrvwUpload == "true") {
            $scope.page('/gstr/error/preview');
        }
        else if (shareData.isPrvwUpload == "false") {
            $scope.page('/gstr/error/dashboard');
        }

    }
}]);




myApp.controller("importcrtl", ['$scope', '$http', '$filter', 'g1FileHandler', '$timeout', '$log', 'shareData', 'R1InvHandler', 'ReturnStructure', '$sce', '$q', 'R1Util', function ($scope, $http, $filter, g1FileHandler, $timeout, $log, shareData, R1InvHandler, ReturnStructure, $sce, $q, R1Util) {

    var form = null, tblcode, supplier_gstin;
    if (shareData.dashBoardDt) {
        $scope.dashBoardDt = shareData.dashBoardDt;
        form = $scope.dashBoardDt.form;
        supplier_gstin = $scope.dashBoardDt.gstin;
        b2clValCheck();
        getSectionList();
    } else {
        if (shareData.isUploadImport == 'Y') { //if it's Y it's for second flow
            $scope.page('/gstr/upload/summary');
        }
        else if (shareData.isUploadImport == 'E') {
            $scope.page('/gstr/error/summary');
        }
        else {
            $scope.page('/gstr/summary'); //else new button
        }
    }


    //get sectionlist
    $scope.sectionList = null;
    $scope.sectionListSelected = null;
    //help-text enable/disable based on iff
    $scope.helpTextenable = (shareData.isTPQ != null) ? true : false;


    function getSectionList() {
        // CR#18639- IFF_form_sectionlist
        var mnth = shareData.dashBoardDt.month;
        var rtn_prd = parseInt(shareData.dashBoardDt.fp.slice(0, 2));
        if (shareData.isTPQ && rtn_prd % 3 !== 0) {
            shareData.dashBoardDt.form = "GSTR1IFF";
        }
        g1FileHandler.getSectionList(shareData.dashBoardDt.form).then(function (response) {
            $log.debug("copyPasteCtrl -> getOptionList success:: ", response);
            if (response) {
                $scope.sectionList = response;
                $scope.sectionListSelected = $scope.sectionList[shareData.scLsSetIdx];
                tblcode = $scope.sectionListSelected.cd;
                $scope.sectionListSelected = null;


            }
            if (shareData.isTPQ == false && (rtn_prd % 3 === 0) && $scope.sectionList[5].nm == "Nil Rated Invoices") {
                $scope.sectionList[5].disabled = true;

            }
            //CR#18639-changes for IFF_form 
            if (shareData.dashBoardDt.form == "GSTR1IFF") {
                shareData.dashBoardDt.form = "GSTR1";
            }

        }, function (response) {
            $log.debug("copyPasteCtrl -> getOptionList fail:: ", response);
        });

    }

    function b2clValCheck(){
        $http.get('/b2clConstants').then(function(response) {
            $scope.B2CL_MIN = response.data.minVal;
            $scope.B2CL_MIN_PRD = response.data.minStrPrd; 
            console.log('Constants loaded:', $scope.constants);
            var rtn_prd = shareData.dashBoardDt.fp;
        $scope.B2CLnew  = false;  
        $scope.B2CLnew = Number(rtn_prd.substring(2) + rtn_prd.substring(0,2)) >= Number($scope.B2CL_MIN_PRD.substring(2) + $scope.B2CL_MIN_PRD.substring(0,2)) ? true : false;
        $scope.B2CL_MIN = $scope.B2CLnew ? $scope.B2CL_MIN : 250000;
        $scope.LBL_INVOICE_GREATER = "Invoice value needs to be greater than ₹"+$filter("INR")($scope.B2CL_MIN).split('.')[0]+"/-"
        }, function(error) {
            console.error('Error fetching constants:', error);
        });
    }

    $scope.csvflag = false;

    $scope.onSectionChange = function (iData) {
        if (iData) {
            shareData.table = iData.cd;
            $scope.csvflag = true;
            $scope.sectionListSelected = iData;
            angular.forEach($scope.sectionList, function (section, i) {
                if (section.cd === iData.cd) {
                    shareData.scLsSetIdx = i;
                }
            });
        }
        else {
            $scope.csvflag = false;
        }


    }
    //CR18639- help text
    $scope.show = false
    $scope.help = function () {
        $scope.show == false ? $scope.show = true : $scope.show = false;
    }

    $scope.goToBack = function () {
        if (shareData.isUploadImport == 'Y') {
            $scope.page('/gstr/upload/summary');
        }
        else if (shareData.isUploadImport == 'E') {
            $scope.page('/gstr/error/summary');
        }
        else {
            $scope.page('/gstr/summary');
        }
    }

    $scope.goToViewSumry = function () {
        if (shareData.isUploadImport == 'Y') {
            $scope.page('/gstr/upload/preview');
        }
        else if (shareData.isUploadImport == 'E') {
            $scope.page('/gstr/error/preview');
        }
        else {
            $scope.page('/gstr/preview');
        }
    }

    //ADDITION BY V START
    //to upload multi excel
    $scope.uploadFile = function () {

        var file = $scope.excelFile;
        if (!file)
            return;
        $scope.processStarted = false;
        //$scope.excelFile = null;
        $scope.fileSelected = false;
        $('#excelUploadField').val('');
        $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
            $scope.processStarted = true;
            setTimeout(function () {
                if ($scope.processStarted) {
                    // proces is working, show message
                    $('body').append('<div class="delayMSg" style="position: fixed; z-index: 99999; bottom: 0; left: 0; right: 0; width: 100%; height: 40px; text-align: center; background: white; padding-top: 11px; border-top: 1px solid #2c4e86;">Import is being processed, please wait...</div>');
                }
            }, 1000);
            $scope.progressbar.start();
            $().blockPage(true);
            var file = $scope.excelFile;
            g1FileHandler.savePayloadFile(file, shareData)
                .then(function (response) {

                    $('.delayMSg').html('Import is being processed, please wait...');
                    $scope.processStarted = false;
                    $scope.onExcelProcessed(response);
                    //  $scope.progressbar.complete();
                    //$().blockPage(false);

                })
                .catch(function (err) {
                    $('.delayMSg').remove();
                    $scope.processStarted = false;
                    $scope.progressbar.complete();
                    $().blockPage(false);
                    $scope.createAlert("Error", "File Process Failed");
                });
        });
    }

    $scope.onExcelProcessed = function (data) {
        //Check for restring user to import excel if taxpayer is quarterly and selected month is M1 and M2
        if (data.validFlag !== undefined && !data.validFlag && R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)) {
            $scope.createAlert("Error", "Based on your filing preference (quarterly), you are only allowed to import details for B2B, CDNR, B2BA and CDNRA tables for selected period.");
            $('.delayMSg').remove();
            $().blockPage(false);
        } else if (data.validFlag !== undefined && !data.validFlag && shareData.dashBoardDt.fp == shareData.R1_NEW_ECO_STRT_PRD) {
            $scope.createAlert("Error", "Based on your filing preference (quarterly), you are only allowed to import details for B2B, CDNR, B2BA, CDNRA, ECOB2B AND ECOURP2B tables for selected period.");
            $('.delayMSg').remove();
            $().blockPage(false);
        } else if (data.validFlag !== undefined && !data.validFlag && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)) {
            $scope.createAlert("Error", "Based on your filing preference (quarterly), you are only allowed to import details for B2B, CDNR, B2BA, CDNRA, ECOB2B, ECOURP2B, ECOAB2B AND ECOAURP2B tables for selected period.");
            $('.delayMSg').remove();
            $().blockPage(false);
        } else {
            R1InvHandler.upMultipleSections($scope, { cache_key: data.cache_key }, data.errData, data.multiItmErrData, data.misMatchedErrData, data.errb2clInvAry, data.errShipDtData, data.errActionInvAry, data.errActionErrorStatusInvAry, data.errMissingHeaderDataArry, shareData.isUploadImport, data.errUrTypePosData, data.errUrtypeDiffData, data.errPosStCdData, data.errInvSplyType, data.errB2CLInvErrListAry)
                .then(function (iRs) {
                    $('.delayMSg').remove();
                    $scope.progressbar.complete();
                    $().blockPage(false);
                }, function () {
                    $('.delayMSg').remove();
                })
                .catch(function (err) {
                    $('.delayMSg').remove();

                    $('.delayMSg').remove();
                    $scope.processStarted = false;
                    $scope.progressbar.complete();
                    $().blockPage(false);
                    //$scope.createAlert("Error", "File Process Failed");
                });
            ;
        }
    }
    //ADDITION BY V END 


    //to import multi excel
    $scope.onExcelLoad = function (iExcelData) {
        var excelData = [],
            errData = [],
            multiItmErrData = [],
            misMatchedErrData = [],
            errTaxRtInvData = [],
            errInvalidActionData = [],
            errInvalidErrorStatusData = [];


        $scope.createAlert("Warning", "Are you sure you want to save data?", function () {
            angular.forEach(iExcelData, function (section, i) {
                if (section.section != "Help Instruction") {


                    var secNm = section.section,
                        secDt = section.data,
                        //returnStructure = (form == "GSTR1") ? R1Structure : R2Structure,

                        invStructure = ReturnStructure.getInv(secNm, form),
                        invItmStructure = ReturnStructure.getItm(secNm, form),
                        invNodeFormatter = ReturnStructure.formateNodePayload(secNm, form), //formateB2BNodePayload                   
                        jsonInvKey = ReturnStructure.getInvKey(secNm, form),
                        excelInvTitle = ReturnStructure.getExcelTitle(secNm, form);

                    if (!invStructure) {
                        return false;
                    }
                    var preparedExcelPayload = R1InvHandler.preparePayloadFromExcel(secDt, invStructure, invItmStructure, excelInvTitle, jsonInvKey, secNm, form, shareData.curFyMonths, $scope.suplyList, supplier_gstin),
                        invAry = preparedExcelPayload.inv,
                        errInvAry = preparedExcelPayload.errInv,
                        matchedErrInvAry = preparedExcelPayload.macthedErrList,
                        misMatchedPatternInvAry = preparedExcelPayload.excelInvldPattrnList,
                        errTaxRtInvAry = preparedExcelPayload.excelb2clErrList,
                        errInvalidActionAry = preparedExcelPayload.excelInvalidActionList;
                    //  errb2clInvAry=preparedExcelPayload.excelb2clErrList;

                    var newInvAry = [];
                    angular.forEach(invAry, function (sInv, i) {
                        newInvAry.push(invNodeFormatter(sInv));
                    });

                    excelData.push({
                        cd: secNm,
                        dt: newInvAry
                    });
                    errData = errData.concat(errInvAry);
                    multiItmErrData = multiItmErrData.concat(matchedErrInvAry);
                    misMatchedErrData = misMatchedErrData.concat(misMatchedPatternInvAry);
                    errTaxRtInvData = errTaxRtInvData.concat(errTaxRtInvAry);
                    errInvalidActionData = errInvalidActionData.concat(errInvalidActionAry);


                }
            });




            R1InvHandler.upMultipleSections($scope, excelData, errData, multiItmErrData, misMatchedErrData, errTaxRtInvData, null, errInvalidActionData, errInvalidErrorStatusData, shareData.isUploadImport).then(function (iRs) {


            }, function () { });

        });
    }

    //in nil rated it's not parsing the data correctly.Inorder to get details correctly
    function formateNilData(iData) {
        var OData = angular.copy(iData);
        angular.forEach(OData, function (rowObj, i) {
            if (rowObj.hasOwnProperty('Description')) {
                var desc = rowObj['Description'].trim(),
                    iDesc;
                if (desc.indexOf('person') == -1) {
                    iDesc = desc;
                    OData[i + 1]['Description'] = iDesc + " person";
                    delete OData[i];
                }
            }
        });
        OData = OData.filter(function (element) {
            return element !== undefined;
        });
        return OData;
    }

    //To copy paste or import csv
    $scope.onpastedone = function (iData, type, filename) {

        iData = JSON.parse(iData);

        var errActionInvAry = [] //Currently no implementation of actions related validations from frontend

        var sectionId = $scope.sectionListSelected.cd,
            newInvAry1 = [],
            //returnStructure = (form == "R1") ? R1Structure : R2Structure,
            getInv = ReturnStructure.getInv(sectionId, form, shareData.yearsList, $scope.trans),
            getItm = ReturnStructure.getItm(sectionId, form, $scope.trans),
            getExcelTitle = ReturnStructure.getExcelTitle(sectionId, form, $scope.trans),
            getInvKey = ReturnStructure.getInvKey(sectionId, form),
            formateNodePayload = ReturnStructure.formateNodePayload(sectionId, form);

        $scope.createAlert("Warning", "Are you sure you want to save data?", function () {

            // errTaxRtInvAry = preparedExcelPayload.excelInvalidTaxRtList;
            //it will be autopopulating hsn description from codes
            if (form == 'GSTR1' && sectionId == 'hsn' && !R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                var promises = [];
                filename = (filename != undefined && filename != null) ? filename.split('.').slice(0, -1).join('.') : null;
                if (sectionId != filename && filename != null) {
                    $scope.createAlert("Error", "<span class=\"msgbxh\">Data Invalid.</span><br /><br /><b>Section : </b>" + sectionId.toUpperCase() + "<br /><br /><b>Possible Reasons:</b><ul><li>Please check the spreadsheet.Either all rows have invalid data or the  wrong section file is copied/uploaded</li></ul><br /><b>Note:</b> Please upload the data of the selected section only. If using COPY EXCEL button, please ensure that you copy headers along with the data.");
                } else {
                if (!shareData.disableHSNRestrictions) {
                    angular.forEach(iData, function (sInv, i) {

                        if (String(sInv.HSN).substring(0, 2) == "99") {
                            iData[i].UQC = "NA";
                            iData[i]['Total Quantity'] = "0";
                        }
                    });
                }
                else {
                    angular.forEach(iData, function (sInv, i) {
                        var ajaxCall = ReturnStructure.fetchDescFromHsn(sInv.HSN).then(function (response) {
                            iData[i].Description = response.data;
                            if (String(sInv.HSN).substring(0, 2) == "99") {
                                iData[i].UQC = "NA";
                                iData[i]['Total Quantity'] = "0";
                            }
                        }, function (error) {
                            iData[i].Description = "";
                        });
                        promises.push(ajaxCall);
                    });
                }
                $q.all(promises).then(function () {
                    var preparedExcelPayload = R1InvHandler.preparePayloadFromExcel(iData, getInv, getItm, getExcelTitle, getInvKey, sectionId, form, shareData.curFyMonths, shareData.yearsList, $scope.suplyList, supplier_gstin, shareData.isSezTaxpayer, type, $scope.trans, $scope.B2CLmin),
                        invAry = preparedExcelPayload.inv,
                        errInvAry = preparedExcelPayload.errInv,
                        matchedErrInvAry = preparedExcelPayload.macthedErrList,
                        misMatchedPatternInvAry = preparedExcelPayload.excelInvldPattrnList,
                        errb2clInvAry = preparedExcelPayload.excelb2clErrList,
                        errshipdtInvAry = preparedExcelPayload.excelDateErrList,
                        UrTypPOSErrList = preparedExcelPayload.excelInvalidURtypePOSList,
                        UrTypDiffErrList = preparedExcelPayload.excelInvalidURtypeDiffPerList,
                        PosSupStCdErrList = preparedExcelPayload.excelInvalidPosSupStCode,
                        NoteSplyTpeErrList = preparedExcelPayload.excelInvalidNtSplyTypList

                    angular.forEach(invAry, function (sInv, i) {
                        newInvAry1.push(formateNodePayload(sInv));
                    });
                    R1InvHandler.onPaste($scope, newInvAry1, sectionId, errInvAry, matchedErrInvAry, misMatchedPatternInvAry, errb2clInvAry, errshipdtInvAry, errActionInvAry, shareData.isUploadImport, UrTypPOSErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList).then(function (iRs) {
                        // $scope.page("gstr1/summary");               
                    }, function () { });
                })
            }
            }
          
            else if (form == 'GSTR1' && sectionId == 'hsn(b2b)' || sectionId == 'hsn(b2c)') {
                filename = (filename != undefined && filename != null) ? filename.split('.').slice(0, -1).join('.') : null;
                if (sectionId != filename && filename != null) {
                    $scope.createAlert("Error", "<span class=\"msgbxh\">Data Invalid.</span><br /><br /><b>Section : </b>" + sectionId.toUpperCase() + "<br /><br /><b>Possible Reasons:</b><ul><li>Please check the spreadsheet.Either all rows have invalid data or the  wrong section file is copied/uploaded</li></ul><br /><b>Note:</b> Please upload the data of the selected section only. If using COPY EXCEL button, please ensure that you copy headers along with the data.");
            } else {
                    var promises = [];
                    if (!shareData.disableHSNRestrictions) {
                        angular.forEach(iData, function (sInv, i) {

                            if (String(sInv.HSN).substring(0, 2) == "99") {
                                iData[i].UQC = "NA";
                                iData[i]['Total Quantity'] = "0";
                            }
                        });
                    }
                    else {

                        angular.forEach(iData, function (sInv, i) {
                            var ajaxCall = ReturnStructure.fetchDescFromHsn(sInv.HSN).then(function (response) {

                                iData[i]['Description as per HSN Code'] = response.data;
                                //valid HSN avaialble only added in to list that are populated in UI.
                                if (iData[i]['Description as per HSN Code'] == null || iData[i]['Description as per HSN Code'] == "") {
                                    iData[i]['HSN'] = "";
                                }

                                if (String(sInv.HSN).substring(0, 2) == "99") {
                                    iData[i].UQC = "NA";
                                    iData[i]['Total Quantity'] = "0";
                                }

                            }, function (error) {
                                iData[i]['Description as per HSN Code'] = "";
                                iData[i]['HSN'] = "";
                            });
                            promises.push(ajaxCall);

                        });

                    }
                    $q.all(promises).then(function () {
                        var preparedExcelPayload = R1InvHandler.preparePayloadFromExcel(iData, getInv, getItm, getExcelTitle, getInvKey, sectionId, form, shareData.curFyMonths, shareData.yearsList, $scope.suplyList, supplier_gstin, shareData.isSezTaxpayer, type, $scope.trans, $scope.B2CLmin),
                            invAry = preparedExcelPayload.inv,
                            errInvAry = preparedExcelPayload.errInv,
                            matchedErrInvAry = preparedExcelPayload.macthedErrList,
                            misMatchedPatternInvAry = preparedExcelPayload.excelInvldPattrnList,
                            errb2clInvAry = preparedExcelPayload.excelb2clErrList,
                            errshipdtInvAry = preparedExcelPayload.excelDateErrList,
                            UrTypPOSErrList = preparedExcelPayload.excelInvalidURtypePOSList,
                            UrTypDiffErrList = preparedExcelPayload.excelInvalidURtypeDiffPerList,
                            PosSupStCdErrList = preparedExcelPayload.excelInvalidPosSupStCode,
                            NoteSplyTpeErrList = preparedExcelPayload.excelInvalidNtSplyTypList

                        angular.forEach(invAry, function (sInv, i) {
                            newInvAry1.push(formateNodePayload(sInv));
                        });
                        R1InvHandler.onPaste($scope, newInvAry1, sectionId, errInvAry, matchedErrInvAry, misMatchedPatternInvAry, errb2clInvAry, errshipdtInvAry, errActionInvAry, shareData.isUploadImport, UrTypPOSErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList).then(function (iRs) {               
                        }, function () { });
                    })
                }

            }  
          else {
                var preparedExcelPayload = R1InvHandler.preparePayloadFromExcel(iData, getInv, getItm, getExcelTitle, getInvKey, sectionId, form, shareData.curFyMonths, shareData.yearsList, $scope.suplyList, supplier_gstin, shareData.isSezTaxpayer, type, $scope.trans, $scope.B2CL_MIN),
                    invAry = preparedExcelPayload.inv,
                    errInvAry = preparedExcelPayload.errInv,
                    matchedErrInvAry = preparedExcelPayload.macthedErrList,
                    misMatchedPatternInvAry = preparedExcelPayload.excelInvldPattrnList,
                    errb2clInvAry = preparedExcelPayload.excelb2clErrList,
                    errshipdtInvAry = preparedExcelPayload.excelDateErrList,
                    UrTypPOSErrList = preparedExcelPayload.excelInvalidURtypePOSList,
                    UrTypDiffErrList = preparedExcelPayload.excelInvalidURtypeDiffPerList,
                    PosSupStCdErrList = preparedExcelPayload.excelInvalidPosSupStCode,
                    NoteSplyTpeErrList = preparedExcelPayload.excelInvalidNtSplyTypList
                angular.forEach(invAry, function (sInv, i) {
                    newInvAry1.push(formateNodePayload(sInv));
                });

                R1InvHandler.onPaste($scope, newInvAry1, sectionId, errInvAry, matchedErrInvAry, misMatchedPatternInvAry, errb2clInvAry, errshipdtInvAry, errActionInvAry, shareData.isUploadImport, UrTypPOSErrList, UrTypDiffErrList, PosSupStCdErrList, NoteSplyTpeErrList).then(function (iRs) {
                    // $scope.page("gstr1/summary");               
                }, function () { });
            }
        });
    }

}]);

myApp.controller("nilsumryctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

    $scope.nilSumryList = {
        "inv": []
    };
    $scope.flag = true;

    var splyTypes = ["INTRB2B", "INTRAB2B", "INTRB2C", "INTRAB2C"];

    function initNewRow() {
        angular.forEach(splyTypes, function (splyty, i) {

            $scope.nilSumryList.inv[i] = {
                "sply_ty": splyty,
                "expt_amt": 0,
                "nil_amt": 0,
                "ngsup_amt": 0
            }
        });
    }

    if (!$scope.dashBoardDt) {
        $scope.page("/gstr/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initnilSumryList();
    }

    function initnilSumryList() {

        g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
            $log.debug("nilsumryctrl -> initnilSumryList success:: ", response);

            if (response.inv.length > 0) {
                $scope.nilSumryList = response;
            }
            else {
                initNewRow();
            }


        }, function (response) {
            $log.debug("nilsumryctrl -> initnilSumryList fail:: ", response);
            initNewRow();
        });


    }
    $scope.initSumryList = initnilSumryList;

    $scope.getDisplayName = function (ils) {
        switch (ils) {
            case 'INTRB2B':
                return $scope.trans.LBL_IESRP;
                break;
            case 'INTRAB2B':
                return $scope.trans.LBL_IASRP;
                break;
            case 'INTRB2C':
                return $scope.trans.LBL_IESC;
                break;
            case 'INTRAB2C':
                return $scope.trans.LBL_IASC;
                break;
        }
    }

    $scope.isSEZIntra = function (iObj) {
        return (shareData.isSezTaxpayer && (iObj.sply_ty == 'INTRAB2B' || iObj.sply_ty == 'INTRAB2C')) ? true : false;
    }


    $scope.savenilSumryList = function () {
        $scope.flag = !$scope.flag;
        //  var nillParams = [$scope.r1, $scope.r2, $scope.r3, $scope.r4];
        var stdata = angular.copy($scope.nilSumryList.inv);
        for (var i = 0; i < stdata.length; i++) {
            stdata[i].nil_amt = parseFloat(stdata[i].nil_amt);
            stdata[i].expt_amt = parseFloat(stdata[i].expt_amt);
            stdata[i].ngsup_amt = parseFloat(stdata[i].ngsup_amt);
        }


        if (stdata) {
            R1InvHandler.emptyItemAdd($scope, stdata, null);
        }
    }
}]);


myApp.controller("nilsumry2ctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

    $scope.nilSumryList = {};
    $scope.flag = true;

    var splyTypes = ["inter", "intra"];

    function initNewRow() {
        angular.forEach(splyTypes, function (splyty, i) {

            $scope.nilSumryList[splyty] = {
                "cpddr": 0,
                "exptdsply": 0,
                "ngsply": 0,
                "nilsply": 0
            }
        });
    }

    // var initRow = {
    //     "inter": {
    //         "cpddr": 0,
    //         "exptdsply": 0,
    //         "ngsply": 0,
    //         "nilsply": 0,
    //         "sign_cpddr": "+",
    //         "sign_nilsply": "+",
    //         "sign_ngsply": "+",
    //         "sign_exptdsply": "+"

    //     },
    //     "intra": {
    //         "cpddr": 0,
    //         "exptdsply": 0,
    //         "ngsply": 0,
    //         "nilsply": 0,
    //         "sign_cpddr": "+",
    //         "sign_nilsply": "+",
    //         "sign_ngsply": "+",
    //         "sign_exptdsply": "+"
    //     }
    // };

    if (!$scope.dashBoardDt) {
        $scope.page("/gstr/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initnilSumryList();
    }

    $scope.initSumryList = initnilSumryList;

    function initnilSumryList() {

        g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
            $log.debug("nilsumry2ctrl -> initnilSumryList success:: ", response);

            //   var nilSumryList = response;
            if (response) {

                $scope.nilSumryList = response;

            }
            else {
                initNewRow();
            }


        }, function (response) {
            $log.debug("nilsumry2ctrl -> initnilSumryList fail:: ", response);
            initNewRow();
        });

    }


    $scope.changeSign = function (ind, typ, val) {
        var obja;
        if (ind) {
            obja = $scope.nil.intra;
        }
        else {
            obja = $scope.nil.inter;
        }


        switch (typ) {
            case 'nilsply':
                if (val === '+') {
                    obja.sign_nilsply = "-";
                }
                else {
                    obja.sign_nilsply = "+";
                }
                break;
            case 'exptdsply':
                if (val === '+') {
                    obja.sign_exptdsply = "-";
                }
                else {
                    obja.sign_exptdsply = "+";
                }
                break;
            case 'ngsply':
                if (val === '+') {
                    obja.sign_ngsply = "-";
                }
                else {
                    obja.sign_ngsply = "+";
                }
                break;
            case 'cpddr':
                if (val === '+') {
                    obja.sign_cpddr = "-";
                }
                else {
                    obja.sign_cpddr = "+";
                }
                break;
        }
        if (ind) {
            $scope.nil.intra = obja;
        }
        else {
            $scope.nil.inter = obja;
        }
        //   $scope.nil = obja;
    }

    $scope.savenilSumryList = function () {
        $scope.flag = !$scope.flag;
        //  var nillParams = [$scope.r1, $scope.r2, $scope.r3, $scope.r4];
        var stdata = angular.copy($scope.nilSumryList),

            keys = Object.keys(stdata);
        angular.forEach(keys, function (key, i) {
            stdata[key].nilsply = parseFloat(stdata[key].nilsply);
            stdata[key].cpddr = parseFloat(stdata[key].cpddr);
            stdata[key].exptdsply = parseFloat(stdata[key].exptdsply);
            stdata[key].ngsply = parseFloat(stdata[key].ngsply);
        });

        //     if (stdata[key].sign_nilsply === '-') {
        //         stdata[key].nilsply = '-' + stdata[key].nilsply;
        //         stdata[key].nilsply = parseFloat(stdata[key].nilsply);
        //         delete stdata[key].sign_nilsply;
        //     }
        //     else {
        //         delete stdata[key].sign_nilsply;
        //         stdata[key].nilsply = parseFloat(stdata[key].nilsply);
        //     }
        //     if (stdata[key].sign_cpddr === '-') {
        //         stdata[key].cpddr = '-' + stdata[key].cpddr;
        //         stdata[key].cpddr = parseFloat(stdata[key].cpddr);
        //         delete stdata[key].sign_cpddr;
        //     }
        //     else {
        //         delete stdata[key].sign_cpddr;
        //         stdata[key].cpddr = parseFloat(stdata[key].cpddr);
        //     }
        //     if (stdata[key].sign_exptdsply === '-') {
        //         stdata[key].exptdsply = '-' + stdata[key].exptdsply;
        //         stdata[key].exptdsply = parseFloat(stdata[key].exptdsply);
        //         delete stdata[key].sign_exptdsply;
        //     }
        //     else {
        //         delete stdata[key].sign_exptdsply;
        //         stdata[key].exptdsply = parseFloat(stdata[key].exptdsply);
        //     }
        //     if (stdata[key].sign_ngsply === '-') {
        //         stdata[key].ngsply = '-' + stdata[key].ngsply;
        //         stdata[key].ngsply = parseFloat(stdata[key].ngsply);
        //         delete stdata[key].sign_ngsply;
        //     }
        //     else {
        //         delete stdata[key].sign_ngsply;
        //         stdata[key].ngsply = parseFloat(stdata[key].ngsply);

        //     }

        // });

        if (stdata) {
            R1InvHandler.emptyItemAdd($scope, stdata, null);
        }
    }
}]);


myApp.controller("itcrvrslctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

    $scope.itcSumryList = {};
    $scope.itcFlag = true;

    var codes = ["rule2_2", "rule7_1_m", "rule7_2_a", "rule7_2_b", "rule8_1_h", "revitc", "other"];


    function initNewRow() {
        angular.forEach(codes, function (code, i) {
            if (!$scope.itcSumryList.hasOwnProperty(code))
                $scope.itcSumryList[code] = {
                    "iamt": 0,
                    "camt": 0,
                    "samt": 0,
                    "csamt": 0
                }
        });
    }





    // var initRow = {

    //     "rule2_2": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     },
    //     "rule7_1_m": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     },
    //     "rule8_1_h": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     },
    //     "rule7_2_a": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     },
    //     "rule7_2_b": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     },
    //     "revitc": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     },
    //     "other": {
    //         "iamt": 0,
    //         "camt": 0,
    //         "samt": 0,
    //         "csamt": 0
    //     }

    // };

    if (!$scope.dashBoardDt) {
        $scope.page("/gstr/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initItcSumryList();
    }

    $scope.initSumryList = initItcSumryList;

    function initItcSumryList() {

        g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
            $log.debug("itcrvrslctrl -> inititcSumryList success:: ", response);

            //   var nilSumryList = response;
            if (response) {
                $scope.itcSumryList = response;
                initNewRow();

            };
        }, function (response) {
            $log.debug("itcrvrslctrl -> inititcSumryList fail:: ", response);
            initNewRow();
        });

    }

    $scope.chckItcForm = function (data) {
        var keys = Object.keys($scope.itcSumryList), ct = 0;
        if (data == undefined || JSON.stringify(data) == "{}") {
            return true;
        } else {
            for (var i in keys) {
                if (!data[keys[i]] || (data[keys[i]] && (data[keys[i]].iamt == "" || data[keys[i]].iamt == undefined) && (data[keys[i]].samt == "" || data[keys[i]].samt == undefined) && (data[keys[i]].camt == "" || data[keys[i]].camt == undefined))) {
                    ct++;
                }
            }
        }
        if (keys.length == ct) {
            return true;
        } else {
            return false;
        }
    }

    $scope.getDisplayName = function (ils) {

        switch (ils) {
            case 'rule2_2':
                return $scope.trans.LBL_AMT_R22;
                break;
            case 'rule7_1_m':
                return $scope.trans.LBL_AMT_R71M;
                break;
            case 'rule7_2_a':
                return $scope.trans.LBL_AMT_R72A;
                break;
            case 'rule7_2_b':
                return $scope.trans.LBL_AMT_R72B;
                break;
            case 'rule8_1_h':
                return $scope.trans.LBL_AMT_R81H;
                break;
            case 'revitc':
                return $scope.trans.LBL_AMT_RVSL;
                break;
            case 'other':
                return $scope.trans.LBL_AMT_OTHER;
                break;
        }
    }

    $scope.isOther = function (rule) {
        return (rule && rule == 'other') ? true : false;
    }



    $scope.saveItcReversalSumryList = function () {

        //  var nillParams = [$scope.r1, $scope.r2, $scope.r3, $scope.r4];

        if ($scope.itcrvslPage.$valid && !$scope.chckItcForm($scope.itcSumryList)) {
            $scope.itcFlag = !$scope.itcFlag;
            var stdata = angular.copy($scope.itcSumryList),
                finalData = {};
            if (stdata) {
                var m = Object.keys(stdata);
                for (var i = 0; i < m.length; i++) {
                    stdata[m[i]].iamt = (stdata[m[i]].iamt) ? parseFloat(stdata[m[i]].iamt) : 0;
                    stdata[m[i]].csamt = (stdata[m[i]].csamt) ? parseFloat(stdata[m[i]].csamt) : 0;
                    stdata[m[i]].camt = (stdata[m[i]].camt) ? parseFloat(stdata[m[i]].camt) : 0;
                    stdata[m[i]].samt = (stdata[m[i]].samt) ? parseFloat(stdata[m[i]].samt) : 0;
                    finalData[m[i]] = stdata[m[i]];

                }
                R1InvHandler.emptyItemAdd($scope, finalData, null);
            }
        }
        else {
            $scope.itcInvalidFlag = true;
        }
    }
}]);


