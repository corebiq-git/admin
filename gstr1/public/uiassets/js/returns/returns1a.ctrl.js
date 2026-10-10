"use strict";

myApp.controller("uploadreturns1actrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util', '$rootScope',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util, $rootScope) {

        var tableCode = null,
            form = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy',
            selectTotal = 0;

        $scope.SupplierSummaryList = [];
        $scope.ReceiverSummaryList = [];
        $scope.receiverUploadResponse = [];
        $scope.receiverModifiedResponse = [];
        $scope.receiverRejectedResponse =[];
        $scope.monthList = null;

        $scope.minYearsAllowed = "4";

        $scope.rsnList = [];
        initReasonLs();
        //To get Reason List
        function initReasonLs() {
            g1FileHandler.getReasonList().then(function (response) {
                $scope.rsnList = response.reason;
            }, function (response) {
                $log.debug("mainctrl -> StateList fail:: ", response);
            });
        }


        if (!$scope.dashBoardDt) {
            $scope.page("/gstr/upload/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            form = shareData.dashBoardDt.form;
            $scope.dashBoardDt = shareData.dashBoardDt;
            $scope.monthList = shareData.curFyMonths;

            //  $scope.isUploadFlag = shareData.isUploadFlag;
            initSumryList();
        }


        //To display empty row in Lastpage only in case of pagination
        $rootScope.isLastPage = function (currentPage, pageSize) {
            var isLast = false,
                total = ($scope.SupplierSummaryList.length > 25) ? Math.ceil((($scope.SupplierSummaryList.length) / pageSize)) : 1;
            if (total == currentPage) {
                isLast = true;
            }
            return isLast;
        }

        var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, form);
            // formateNodePayload = ReturnStructure.formateNodePayload(tableCode, form),
            // getExcelTitle = ReturnStructure.getExcelTitle(tableCode, form),
            // getInvKey = ReturnStructure.getInvKey(tableCode, form),
            // getInv = ReturnStructure.getInv(tableCode, form),
            // getItm = ReturnStructure.getItm(tableCode, form);

        function seperateResponse(iResp) {
            var reformedResp = reformateInv(iResp);
            var modifiedByRcvrList = [],
                rejectedByRcvrlist = [],
                uploadbyRcvrList = [];
            angular.forEach(reformedResp, function (inv, i) {
                if(inv.cflag == 'R' ){
                    rejectedByRcvrlist.push(inv);
                }else if(inv.cflag == 'M' )
                    modifiedByRcvrList.push(inv);
                else if(inv.cflag == 'N'  || inv.cflag == 'U')
                    uploadbyRcvrList.push(inv);        
            });
            return {
                uploadbyRcvrData : uploadbyRcvrList,
                modifiedByRcvrData: modifiedByRcvrList,
                rejectedByRcvrData: rejectedByRcvrlist,

            }
        }

        $scope.mainData = [];
        $scope.is_disabledCFS = function (ctin, inv) {
            for (var i = 0; i < $scope.mainData.length; i++) {
                if ($scope.mainData[i].ctin == ctin) {
                    if ($scope.mainData[i].cfs == 'Y') {
                        return true;
                    }
                }
            }
            return false;
        }

        
        $scope.$watch(function(){
            return $scope.isUploadFlag;
        },function(newV,oldV){
            if( !oldV || oldV == 'R')   $scope.receiverUploadResponse   = angular.copy($scope.ReceiverSummaryList);
            else if(oldV == 'Modified') $scope.receiverModifiedResponse = angular.copy($scope.ReceiverSummaryList);
            else if(oldV == 'Rejected') $scope.receiverRejectedResponse = angular.copy($scope.ReceiverSummaryList);

            if(newV == 'R')             $scope.ReceiverSummaryList = angular.copy( $scope.receiverUploadResponse  );
            else if(newV == 'Modified') $scope.ReceiverSummaryList = angular.copy( $scope.receiverModifiedResponse); 
            else if(newV == 'Rejected') $scope.ReceiverSummaryList = angular.copy( $scope.receiverRejectedResponse); 
            
            angular.forEach($scope.ReceiverSummaryList,function(inv){
                delete inv.Select;
            });
            $scope.selectAll = "N";
            selectTotal = 0;
            
    });


        //To get list
        function initSumryList() {
            g1FileHandler.getUploadContentsFor($scope.dashBoardDt, tableCode).then(function (response) {
                //$log.debug("initSumryList -> initSumryList success:: ", response);
                $scope.mainData = response[0];
                if (tableCode == "b2b" || tableCode == "cdnr") {
                    var formateResponse = seperateResponse(response);
                    $scope.receiverUploadResponse = formateResponse.uploadbyRcvrData;
                    $scope.receiverModifiedResponse = formateResponse.modifiedByRcvrData;
                    $scope.receiverRejectedResponse = formateResponse.rejectedByRcvrData;
                    if($scope.isUploadFlag && $scope.isUploadFlag  =='Modified' )
                        $scope.ReceiverSummaryList = angular.copy($scope.receiverModifiedResponse);
                    else if($scope.isUploadFlag && $scope.isUploadFlag  =='Rejected' )
                        $scope.ReceiverSummaryList = angular.copy($scope.receiverRejectedResponse);
                    else
                        $scope.ReceiverSummaryList = angular.copy($scope.receiverUploadResponse);
                    
                } else {
                    $scope.ReceiverSummaryList = reformateInv(response);
                }

            }, function (response) {
                $scope.createAlert("WarningOk", response, function () { });
                $log.debug("initSumryList -> initSumryList fail:: ", response);
                $scope.page("/gstr/upload/dashboard");
            });
        }

        $scope.gotoAddItems = function (iInv) {
                shareData.isNewRec = false;
                shareData.isUploadBySuplier = $scope.isUploadFlag;
                iInv.val = Number(iInv.val);
                if (tableCode == 'b2b') {
                    if (iInv.inv_typ == 'SEWOP' || iInv.rchrg == 'Y') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt) {
                                obj.itm_det.iamt = 0;
                                obj.itm_det.csamt = 0;
                            } else if (obj.itm_det.camt) {
                                obj.itm_det.camt = 0;
                                obj.itm_det.samt = 0;
                                obj.itm_det.csamt = 0;
                            }
                        });
                    }
                }
                shareData.itmInv = iInv;    //getUniqueInvoice( $scope.mainData, iInv);
                $scope.page("/upload/gstr/items/" + tableCode);
            
        }


         //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoice(oldInv, modifiedInv) {

            var returnValue = null,
                iIndex = null;
            if (oldInv) {

                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, form),
                    keys = Object.keys(updatedNodeDetails),
                    oData = angular.copy($scope.ErrorList);
                var idx = keys.indexOf('old_inum');
                if (idx > -1) { keys.splice(idx, 1); }
                var idn = keys.indexOf('old_ntnum');
                if (idn > -1) { keys.splice(idn, 1); }
                oData.filter(function (inv, index) {

                    var count = 0;
                    keys.filter(function (key) {
                        if (inv[key] != null && inv[key] != undefined && inv[key] == oldInv[key])
                            count++;
                    });
                    if (count == keys.length) {
                        iIndex = index;
                        oData[index] = modifiedInv || oldInv;
                        returnValue = modifiedInv || oldInv;
                    }
                });
            }
            return returnValue;
        }

        $scope.AcceptSelectedRows = function(){
             var rtArry = [],invupdtArray = [];

            angular.forEach($scope.ReceiverSummaryList, function (inv) {
                if (!inv.Select  || inv.Select=='N') {
                    rtArry.push(inv);
                } else {
                    delete inv.Select;
                    invupdtArray.push(inv);
                }
            });
            if (invupdtArray.length > 0) {
                R1InvHandler.uploadAccept($scope, rtArry, invupdtArray).then(function (response) {
                    $scope.ReceiverSummaryList = angular.copy(response);
                    $scope.ReceiverSummaryList = $scope.ReceiverSummaryList.concat(rtArry);
                    $scope.selectAll = 'N';
                    selectTotal = 0;
                });
                reloadPage();
            } else {
                $scope.createAlert("WarningOk", "Please Select Atleast one item", function () { });
            }
        }

         $scope.RejectSelectedRows = function(){
             var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.ReceiverSummaryList, function (inv) {
                if (!inv.Select || inv.Select=='N') {
                    rtArry.push(inv);
                } else {
                    delete inv.Select;
                    invdltArray.push(inv);
                }
            });
            if (invdltArray.length > 0) {
                R1InvHandler.uploadReject($scope, rtArry, invdltArray).then(function (response) {
                    $scope.ReceiverSummaryList = angular.copy(response);
                    $scope.ReceiverSummaryList = $scope.ReceiverSummaryList.concat(rtArry);
                    $scope.selectAll = 'N';
                    selectTotal = 0;
                });
                reloadPage();
            } else {
                $scope.createAlert("WarningOk", "Please Select Atleast one item", function () { });
            }
        }

         $scope.setPendingSelectedRows = function(){
             var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.ReceiverSummaryList, function (inv) {
                if (!inv.Select || inv.Select=='N') {
                    rtArry.push(inv);
                } else {
                    delete inv.Select;
                    invdltArray.push(inv);
                }
            });
            if (invdltArray.length > 0) {
                R1InvHandler.uploadPending($scope, rtArry, invdltArray).then(function (response) {
                    $scope.ReceiverSummaryList = angular.copy(response);
                    $scope.ReceiverSummaryList = $scope.ReceiverSummaryList.concat(rtArry);
                    $scope.selectAll = 'N';
                    selectTotal = 0;
                });
                reloadPage();
            } else {
                $scope.createAlert("WarningOk", "Please Select Atleast one item", function () { });
            }
        }

        $scope.SelectAll = function(){
            angular.forEach($scope.ReceiverSummaryList,function(inv){
                if($scope.selectAll == 'Y')
                inv.Select = 'Y';
                else
                inv.Select = 'N';
            });
        }

        $scope.SelectOne = function(index){
            if($scope.ReceiverSummaryList[index].Select == 'Y') ++ selectTotal;
            else --selectTotal;
            if(selectTotal == $scope.ReceiverSummaryList.length)
                $scope.selectAll = 'Y';
            else $scope.selectAll = 'N';
        }

        function reloadPage() {
            if ($scope.sectionListSelected.url[0] !== '/') {
                $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
            }
        }
    }
]);