"use strict";

myApp.controller("returnsctrl", ['$scope', '$http', '$filter', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util','$location',
    function ($scope, $http, $filter, $rootScope, shareData, g1FileHandler, $log, NgTableParams, $timeout, R1InvHandler, ReturnStructure, R1Util,$location) {
        var tableCode = null,
            formName = null,
            isSezTaxpayer,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.ReturnsList = [];
        shareData.isNewRec = true;
        $scope.newInvValidtr = false;
        $scope.newInvRw = null;
        $scope.years = null;
        $scope.monthList = null;
        $scope.totalAvailable = 0;
        $scope.showOldUI = false;
        var compareList = [];
        $scope.HSNList = null;
        $scope.isHsnSelected = false;
        $scope.hsnsaveedit = false;
        $scope.minYearsAllowed = "4";
        $scope.minCodeLengthToDisplay = "2";
        $scope.err_msg_hsn = "Length should be between 2-8";
        $scope.disableHSNRestrictions = shareData.disableHSNRestrictions;
        $scope.suprecFrm ={};
        $scope.supplierRecipientName = "";
        $scope.productName = "";
        $scope.sameGstin = false;
        $scope.newsuprecmstr = false;
        $scope.duprecord = false;
        $scope.validator = false;
        $scope.suprecmstr = [];
        $scope.savemstr = [];
      
        
        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            
            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = $scope.dashBoardDt.form;
            $scope.years = shareData.yearsList;//In B2CSA we need yearsList list
            $scope.monthList = shareData.curFyMonths; //In B2CSA we need FY month list
            isSezTaxpayer = shareData.isSezTaxpayer;
            $scope.showOldUI = R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value);
            b2clValCheck();
            initNewInvRow();
            initSumryList();
           
        }
        
        if (!shareData.disableAATOLengthCheck) {
        
             if (shareData.aatoGreaterThan5CR) {
                $scope.minCodeLengthToDisplay = shareData.HSN_DROPDOWN_LGTH_AATO_GRTR_5CR;
                $scope.minhsnlengthvalidation = shareData.HSN_VALIDATION_AATO_GRTR_5CR_MIN_LGTH;
             }
            else {
                $scope.minCodeLengthToDisplay = shareData.HSN_DROPDOWN_LGTH_AATO_LESS_5CR;
                $scope.minhsnlengthvalidation = shareData.HSN_VALIDATION_AATO_LESS_5CR_MIN_LGTH;
            }
        }
        function getDate(retprd) {
            var a = '01/' + retprd.substring(0, 2) + '/' + retprd.substring(2);
            return a;
        };
        shareData.HSN_BIFURCATION_START_DATE = "052025";
        shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
        $scope.showHSNTabs= shareData.showHSNTabs;

        $scope.checkHSNInput = function (resultList,hsn, form) {
            $scope.invalidHSN = false;
            $scope.invalidHsnLength = false;
			$scope.minlengthErr = false;
            if (shareData.disableHSNRestrictions) {
                if (hsn && hsn.length >= 2) {
                    var pattern = new RegExp("^\\d{2,8}$");
                    var isNumeric = new RegExp("^\\d{9,}$");
                    if (pattern.test(hsn)) {
                        if($scope.disableAATOLengthCheck){
                            $scope.isHsnSelected = true;
                            $scope.hsnsaveedit = true;
                          
                        }
                        else{
                            $scope.isHsnSelected = (hsn.length >= $scope.minhsnlengthvalidation) ? true : false;
                            $scope.hsnsaveedit = $scope.isHsnSelected = (hsn.length >= $scope.minhsnlengthvalidation ) ? true : false;
                            $scope.invalidHSNLengthAATO = (hsn.length >= $scope.minhsnlengthvalidation ) ? false : true;
                            $scope.aatoErrMsg = "Enter minimum " + $scope.minhsnlengthvalidation + " digits of HSN code";
                          
                        }
                       if(resultList && !$scope.invalidHSNLengthAATO){
                        $scope.hsnNotfromMstr = "HSN not present in GST HSN Master";
                            for(let i in resultList){
                                localStorage.setItem('description',resultList[i].n);
                                if(hsn == resultList[i].c){
                                    $scope.hsnNotfromMstr =null;
                                    break;
                                }
                            }
                        }
                    }
                    else if (isNumeric.test(hsn)) {
                        $scope.invalidHsnLength = true;
                    }
                    else {
                        $scope.invalidHSN = true;
                    }
                }
				else if(hsn && hsn.length<2 && hsn.length!=0){
                    $scope.isHsnSelected = false;
                    $scope.minlengthErr = true;
                }
            }
          
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

        $scope.onHSNchange = function () {
            $scope.invalidHSN = false;
            $scope.invalidHsnLength = false;
            $scope.invalidHSNLengthAATO = false;
            $scope.hsnNotfromMstr =null;
			$scope.minlengthErr = false;
            if($scope.showHSNTabs){
                $scope.notfrmdrpdwn= true;
            }
         }
       $scope.hideaddBtn = false;
       $scope.rmlengthvalidation = false;
        $scope.afterHACselecthsnOutward = function (result) {
            $scope.notfrmdrpdwn= false;
            let prodDesc = result.n;
            if(prodDesc == undefined)
            {
                prodDesc = result.productDescription;
            }
            localStorage.setItem('description',prodDesc);
            // localStorage.setItem('description',result.productDescription);
            let hsn = result.hsn ? result.hsn : result.c
           $scope.invalidHSNLengthAATO = hsn.length >= $scope.minhsnlengthvalidation ? false : true;
            $scope.aatoErrMsg = "Enter minimum " + $scope.minhsnlengthvalidation + " digits of HSN code";
            if ($scope.invalidHSNLengthAATO) {
                return;
            }
            $scope.newInvRw.hsn_sc = result.hsn ? result.hsn : result.c;
            $scope.newInvRw.desc = result.productDescription ? result.productDescription : result.n;
            $scope.newInvRw.productName = result.productName ? result.productName : null;
            $scope.newInvRw.uqc = result.uqc ? result.uqc : null;
            $scope.newInvRw.rt = (typeof result.igst === "number") ? result.igst.toString() : null;
            console.log("result", result)
            $scope.isHsnSelected = true;
            $scope.hsnsaveedit = true;
            $scope.isExistingHsnUqcRate(1, $scope.newInvRw.rt, $scope.newInvRw.hsn_sc, $scope.newInvRw.uqc)

        }
          
        //Excel and csv - Product master integration
        $scope.compExcelCsv = function () {
            $scope.productData = JSON.parse(sessionStorage.getItem('supRecipGstin')) ? JSON.parse(sessionStorage.getItem('supRecipGstin')).productsMasters : [];
            for (let i in $scope.ReturnsList) {
                let find =false;
                var count = 0;
                var prodName = null;
                
                for (let j in $scope.productData) {
                    if ($scope.ReturnsList[i].hsn_sc == $scope.productData[j].hsn && $scope.ReturnsList[i].uqc == $scope.productData[j].uqc && $scope.ReturnsList[i].rt == $scope.productData[j].igst) {
                        count++;
                        prodName = $scope.productData[j].productName;
                        find = true;
                    }   
                }
                if(count==1){
                    $scope.ReturnsList[i].productName = $scope.ReturnsList[i].productName!=null ? $scope.ReturnsList[i].productName : prodName;
                }
                else{
                    $scope.ReturnsList[i].productName = $scope.ReturnsList[i].productName!=null ? $scope.ReturnsList[i].productName : ' ';
                }
               if(!find && $scope.ReturnsList[i].productName){
                      delete $scope.ReturnsList[i].productName;
               }
            }
        }

  
        //Product Master integration
        $scope.comparisonofMaster = function () {
            // $scope.getDesc = localStorage.getItem('description');
            // $scope.checkHSNInput();
            if(!sessionStorage.getItem('supRecipGstin')){
                if ($scope.newInvRw.hsn_sc && $scope.newInvRw.hsn_sc.length>=4 && $scope.newInvRw.hsn_sc != null && $scope.newInvRw.uqc != null && $scope.newInvRw.rt != null){
                    $scope.hideaddBtn = true;
                } 
                return;
            }

            $scope.productData = JSON.parse(sessionStorage.getItem('supRecipGstin')).productsMasters;
            // console.log($scope.getDesc);
            if ($scope.newInvRw.hsn_sc != null && $scope.newInvRw.uqc != null && $scope.newInvRw.rt != null) {
                if ($scope.productData.length == 0) {
                    ($scope.newInvRw.hsn_sc.length >= 4 && $scope.hsnNotfromMstr==null) ?  $scope.hideaddBtn = true :  $scope.hideaddBtn = false;  
                }
                else {
                    var lengtofProData = $scope.productData.length;
                    var count = 0;
                    
                    for (let i = 0; i < lengtofProData; i++) {
                        if ($scope.productData[i].hsn == $scope.newInvRw.hsn_sc && $scope.productData[i].uqc == $scope.newInvRw.uqc && $scope.productData[i].igst == $scope.newInvRw.rt) {
                            // $scope.newInvRw.productName = $scope.productData[i].productName;
                            
                            $scope.hideaddBtn = false;
                            count += 1;
                       } 
                        
                        if($scope.hsnNotfromMstr != null){
                            $scope.hideaddBtn = false;   
                        }
                    }
                    if (count!=1) {
                        // $scope.newInvRw.productName = null;
                        // $scope.hideaddBtn = (count<1) ? true: false;
                            if($scope.newInvRw.hsn_sc.length>=4 && count<1){
                                $scope.hideaddBtn = true;
                            }
                            else{
                                $scope.hideaddBtn = false;
                            }
                        
                    }
                    
                }
            }
        }

    //Product Master integration
        $scope.prdresetData = function () {
            $scope.prodMstr.hsn = null;
            $scope.getDesc = null;
            $scope.prodMstr.productName = null;
            $scope.prodMstr.desc = null;
            $scope.prodMstr.uqc = null;
            $scope.prodMstr.rt = null;
            $scope.prdmstrFrm.$setPristine();
            $scope.newInvValidtr = false;
            $scope.duplicaterecord = false;
            // sessionStorage.clear('description');
        }

        $scope.checkForServiceHSN = function (hsn, frm) {
            if (String(hsn).substring(0, 2) == "99") {
                frm.uqc = "NA";
                frm.qty = 0;
                return true;
            }
            return false;
        }

        $scope.checkNA = function (uqc) {
            if (uqc == "NA") {
                return true;
            }
            return false;
        }

        $scope.clearHSNInput = function () {
            $scope.isHsnSelected = false;
            $scope.newInvRw.desc = null;
            $scope.newInvRw.user_desc = null;
            $scope.hsnsaveedit = false;
            $scope.newInvRw.uqc = null;
            $scope.newInvRw.rt = null;
            $scope.newInvRw.productName = null;
            $scope.hsnNotfromMstr =null;
            $scope.hideaddBtn = false;
            $scope.newInvRw.txval = 0;
            $scope.newInvRw.qty = 0;
            $scope.newInvRw.iamt = 0;
            $scope.newInvRw.samt = 0;
            $scope.newInvRw.camt = 0;
            $scope.newInvRw.csamt = 0;
            $scope.newInvValidtr = false;
			$scope.minlengthErr = false;
            $scope.newInvRw.hsn_sc=null;
            $scope.newInvFrm.hsn_sc.$setValidity('duplicate', true);
            $scope.newInvFrm.uqc.$setValidity('duplicate', true);
        }

        $scope.getSpTy = function (inv, sc) {

            if (sc == 'b2bur') {

                var itm_lvl = (inv.itms && inv.itms.length && inv.itms[0].itm_det) ? inv.itms[0].itm_det : null;
                if (!itm_lvl)
                    return 'Inter-State';
            }
            if (typeof itm_lvl.camt !== 'undefined' && typeof itm_lvl.samt !== 'undefined') {
                return 'Intra-State'
            }
            return 'Inter-State';

        }

        //Formaters
        if (shareData.dashBoardDt.tbl_cd == "b2cs" || shareData.dashBoardDt.tbl_cd == "b2csa" || shareData.dashBoardDt.tbl_cd == "at" || shareData.dashBoardDt.tbl_cd == "atadj" || shareData.dashBoardDt.tbl_cd == "ata" || shareData.dashBoardDt.tbl_cd == "atadja" || shareData.dashBoardDt.tbl_cd == "txi" || shareData.dashBoardDt.tbl_cd == "b2bur" || shareData.dashBoardDt.tbl_cd == "ecomb2c" || shareData.dashBoardDt.tbl_cd == "ecomurp2c" || shareData.dashBoardDt.tbl_cd == "ecomab2c" || shareData.dashBoardDt.tbl_cd == "ecomaurp2c") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }

        //if sez taxpayer only inter-state supplies for cdnra
        if (isSezTaxpayer && shareData.dashBoardDt.tbl_cd == "cdnra" && shareData.dashBoardDt.form == "GSTR1") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }



        //To init new invoice row
        function initNewInvRow() {
            $scope.newInvRw = ReturnStructure.getNewInv(tableCode, formName);
            $scope.supaddenabled= false; 
            if(tableCode =='supeco'){
                $scope.newInvRw.nat_supp = 'clttx';
            }else if(tableCode =='supecoa'){
                $scope.newInvRw.nat_supp = 'clttxa';
            }
        }

        $scope.onSuppGstinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.stin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.stin.$setValidity('pattern', $scope.validGstin);
          }
        
        $scope.onRtinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.rtin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.rtin.$setValidity('pattern', $scope.validGstin);
          }

        $scope.onGstinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.ctin.$setValidity('pattern', true); 
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.ctin.$setValidity('pattern', $scope.validGstin);
          }

        $scope.onYearChange = function (iInv) {
            for (var i = 0; i < $scope.years.length; i++) {
                var yearObj = $scope.years[i];
                if (yearObj.year === iInv.oyear.year) {
                    iInv.oyear = yearObj;
                }
            }
        }


        // CHANGES BY V START
        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;
            $scope.selectAll = 'N';
            initSumryList();
        };

        // var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, formName),

        var formateNodePayload = ReturnStructure.formateNodePayload(tableCode, formName),
            getInv = ReturnStructure.getInv(tableCode, formName, shareData.yearsList),
            getItm = ReturnStructure.getItm(tableCode, formName),
            getInvKey = ReturnStructure.getInvKey(tableCode, formName);



        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryList();
        });

        $scope.onPosChangeB2BUR = function (y) {
            var isIntra = $scope.isIntraStateB2BUR(y);
            if (isIntra) {
                y.sp_typ = $scope.suplyList[0];

            } else {
                y.sp_typ = $scope.suplyList[1];

            }
        };

        $scope.isIntraStateB2BUR = function (obj) {
            if (obj.pos == $scope.dashbrdGstn)
                return true;
            return false;

        };

 
      
        //To get list 
       function initSumryList() {
            jQuery('.table-responsive').css('opacity', 0.5);
            
            if($scope.dashBoardDt.tbl_data){
            for(let i in $scope.dashBoardDt.tbl_data.data){
            delete $scope.dashBoardDt.tbl_data.data[i].productName;}}

            if (!shareData.pageNum) shareData.pageNum = 1;
            
            g1FileHandler.getContentsForPaged($scope.dashBoardDt, tableCode, shareData.pageNum, $scope.dashBoardDt.form, shareData, shareData.filter_val, $scope.sortBy, $scope.sortReverse).then(function (response) {
                jQuery('.table-responsive').css('opacity', 1);

                //$log.debug("returnsctrl -> initSumryList success:: ", response);
                if (response) {
                    $scope.supplierRecipientName ='';
                    $scope.ReturnsList = response.rows;
                    $scope.ReturnsList.sort(function(x,y){
                        return x.num > y.num;
                    });
                    $scope.ReturnsList.forEach(function(v) {v.isNotAdded = false;});
                     
                    compareList = angular.copy($scope.ReturnsList);
                    $scope.totalAvailable = response.count;
                    //$scope.ReturnsList = reformateInv(response);
                    if (!$scope.first_init) {
                        $scope.sortReverse = !$scope.sortReverse;
                        $scope.sort(getInvKey);
                        $scope.first_init = true;
                    }
                  $scope.itemslist = [];
                //   console.log('Preloading...');
                //   console.log("length",$scope.ReturnsList.length);
                  let rListLength = 0;
                  let i=0;
                //   debugger;
                   for(rListLength =0; rListLength <$scope.ReturnsList.length;rListLength++, i++){
                //    console.log("i val::",i)
                //    console.log($scope.ReturnsList[i].num);
                //    console.log('num index');
                  let hscNum= $scope.ReturnsList[i].num;
                //   console.log('hscnum index', hscNum);
                if($scope.ReturnsList[i].hsn_sc){
                    ReturnStructure.validateHsnAPI($scope.ReturnsList[i].hsn_sc,i).then(function (response){
                        //  console.log("ires::",response)
                        if(response.data == null || response.data == ""){
                        
                          $scope.ReturnsList[response.index].invalidhsnCode = true;
                        }
                        else{
                            $scope.ReturnsList[response.index].invalidhsnCode = false;
                        }
                        $scope.itemslist.push({
                            key: hscNum, // $scope.ReturnsList[i].num,// #response.index,
                            value:  response.data,
                        });

                    },function(error){
                    console.log("error::",error)
                    });
                   }
                   }
                }
                // console.log($scope.itemslist);
             $scope.getSupplierDetails('X');
            
             g1FileHandler.getMasterData(shareData.dashBoardDt.gstin).then(function (response) {
                if(response !=null && response !=""){
                 sessionStorage.setItem("supRecipGstin",JSON.stringify(response));
                 }
                 $scope.compExcelCsv();
             });
               
            }, function (response) {
                jQuery('.table-responsive').css('opacity', 1);
                $log.debug("returnsctrl -> initSumryList fail:: ", response);
            });
          

        }
 
        $scope.initSumryList = initSumryList;
        // CHANGES BY V END
        $scope.shouldAllowUncheck = function (iInv) {
            if (!iInv) return false;
            if (iInv.inv_typ != 'CBW')

                return false;
            // if same pos ? 
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var pos = iInv.pos;
            if (my_code != pos)
                return false;
            //pos matches, sez should be allowed
            if (isSezTaxpayer)
                return false;
            return true;

        }
        if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr" || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1") {
            $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
            var obj = {};
            obj["cd"] = "96";
            obj["nm"] = "Foreign Country";
            $scope.StateList.push(obj);
            $scope.StateList.sort(function (a, b) {
                return a.cd - b.cd;
            });
        } else {
            $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
        }
        $scope.returnStateList = function (iInv) {
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var disableAid = true;

            if (iInv && iInv.inv_typ == 'CBW')
                disableAid = false;

            var state_list = $scope.StateList

            for (var i = 0; i < state_list.length; i++) {
                if (state_list[i].cd == my_code) {
                    if (!isSezTaxpayer && disableAid)
                        state_list[i].disabled = true;
                    else
                        state_list[i].disabled = false;
                }
                else {
                    state_list[i].disabled = false;
                }

            }

            return state_list;
        }

        // Return Period enabled 
        $scope.supenabled = false;
        $scope.suprtn = false;
        $scope.mstrEnabldt = "01-05-2021";
        $scope.validateUserMstrRtnPrd = function () {
            $scope.checked.selectall = 'N'
            shareData.checkCount = 0;
            var retPrdStr = shareData.masterPrd.fp.substring(2) + "-" + shareData.masterPrd.fp.substring(0, 2) + "-" + "01";
            var retPrdStrUM = $scope.mstrEnabldt.substring(6) + "-" + $scope.mstrEnabldt.substring(3, 5) + "-" + $scope.mstrEnabldt.substring(0, 2);
            if (new Date(retPrdStr) >= new Date(retPrdStrUM)) {
                $scope.supenabled = true;
                $scope.suprtn = true;
            } else {
                $scope.supenabled = false;
                $scope.suprtn = false;
            }
           
        }
        

        //Integration of gstin
        $scope.showDropdown = true;
        $scope.colorEnabled = false;
        $scope.getSupplierDetails = function (isEdit) {
             $scope.newInvRw.supplierRecipientName ="";
            $scope.validGstin = false;
               if ($scope.supenabled) {
                $scope.userGstin = shareData.gstinNum;
                g1FileHandler.getMasterData($scope.userGstin).then(function (response) {
                    if (response== null || (response.supplierRecipientMasters == null) || (response.supplierRecipientMasters.length ==0)) {
                   
                        for(let i=0;i<$scope.ReturnsList.length;i++){
                          $scope.ReturnsList[i].supplierRecipientName ="";
                        }
                     }
                    if (response != undefined && response != null && response !="") {
                       
                        $scope.suppDetails = response.supplierRecipientMasters;
                        sessionStorage.setItem("supRecipGstin", JSON.stringify(response));
                        $scope.prodDetails = response.productsMasters;
                        $scope.gstinUser($scope.suppDetails);
                       
                         if(isEdit == 'X'){
                               $scope.gstinRecordAdd = false; 
                               $scope.gstEditData();
                                
                        }
 
                    }
                   
                });
            }
        }


        
        $scope.gstEditData = function(){
            if( $scope.suppDetails !=undefined &&  $scope.suppDetails != null && $scope.suppDetails.length>0) {
                for(let i=0; i< $scope.suppDetails.length; i++) {
                    for(let j=0;j<$scope.ReturnsList.length;j++){
                    if($scope.suppDetails[i] == null){
                        $scope.ReturnsList[j].supplierRecipientName ="";
                    }
                    if($scope.suppDetails[i].gstin == $scope.ReturnsList[j].ctin) {
                        $scope.colorEnabled = true;
                        $scope.ReturnsList[j].supplierRecipientName =  $scope.suppDetails[i].supplierRecipientName;
                        if($scope.suppDetails[i].obj){
                        $scope.ReturnsList[j].obj =  $scope.suppDetails[i].obj;}
                        
                        $scope.ReturnsList[j].isNotAdded = false;
                      
                    }else if($scope.suppDetails[i].gstin != $scope.ReturnsList[j].ctin &&  !$scope.ReturnsList[j].supplierRecipientName){
                        $scope.ReturnsList[j].isNotAdded = true;
                       
                    }
                }
                }
            }
            else{$scope.ReturnsList.forEach(function(v) {v.isNotAdded = true;})}
            if($scope.isSaveSup){
                $scope.setEditData();
            }
        }
    
        $scope.gstinUser = function (resData) {
            
            if (resData) {
                for (let i = 0; i < resData.length; i++) {
                let regStatus = resData[i].registrationStatus;

                    if (!regStatus) {
                        resData[i].obj = "myOwnBg";
                    }
                    else if (regStatus == 'C' || regStatus == 'S') {
                        resData[i].obj = "myRed";
                    } else if (regStatus != 'C') {
                        resData[i].obj = "myGreen";
                    }
                }

            }
        }

        $scope.setEditData = function(){
            if( $scope.suppDetails !=undefined &&  $scope.suppDetails != null) {
                
                for(let i=0; i< $scope.suppDetails.length; i++) {
                    if($scope.suppDetails[i].gstin == $scope.newInvRw.ctin) {
                        $scope.newInvRw.supplierRecipientName =  $scope.suppDetails[i].supplierRecipientName;
                        break;
                    }
                    
                }
            }
        }

     

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
            if ($scope.validations.tdsregex($scope.newsuprecmstr.gstin) ||
                $scope.validations.tcsregex($scope.newsuprecmstr.gstin) ||
                $scope.validations.unibodyregex($scope.newsuprecmstr.gstin)) {
                $scope.supplierdisable = true;
            } else {
                $scope.supplierdisable = false;
            }
        }
        //Supplier Modal 
      $scope.showSupMaster = function (ctin) {
         $scope.newsuprecmstr.gstin = ctin;
         $scope.newsuprecmstr.recipient ='R';
           $("#suppMastAdd").modal({ backdrop: "static" });
            $().blockPage(false);
        }
      
   $scope.gstinNotAvailable = function (flag) {
            if (flag == true) {
                $scope.showDropdown = false;
                
            } else {
                $scope.showDropdown = true;
            }
        }
        $scope.gstinRecordAdd = false;

        $scope.getNotAddedTb15C2B = function (rtin) {
            $scope.newInvRw.pos = "";
            $scope.newInvRw.sp_typ = "";
            $scope.onRtinChange(rtin);
            $scope.getPosBasedOnRtin($scope.newInvRw);
            $scope.isRtinAsEcomGstn(1,rtin);
            if ((rtin && rtin.length==15 && !$scope.showDropdown) && (!$scope.isDiffRtin && $scope.validGstin)) {
               
                $scope.gstinRecordAdd = true;
            }else if(rtin && rtin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.getNotAddedTb15B2C = function (stin) {
            $scope.newInvRw.pos = "";
            $scope.newInvRw.sply_ty = "";
            $scope.onSuppGstinChange(stin);
            $scope.getPosBasedOnStin($scope.newInvRw);
            $scope.isSupStinAsEcomGstn(1,stin);
            if ((stin && stin.length==15 && !$scope.showDropdown) && (!$scope.isDiffStin && $scope.validGstin)) {
               
                $scope.gstinRecordAdd = true;
            }else if(stin && stin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.getNotAddedTb15GSTIN = function (rtin) {
            $scope.newInvRw.pos = "";
            $scope.newInvRw.sp_typ = "";
            $scope.onRtinChange(rtin);
            $scope.getPosBasedOnRtin($scope.newInvRw);
            $scope.isRecRtinAsEcomGstn(1,rtin);
            if ((rtin && rtin.length==15 && !$scope.showDropdown) && (!$scope.isDiffRtin && $scope.validGstin)) {
               
                $scope.gstinRecordAdd = true;
            }else if(rtin && rtin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.getNotAddedTb15Stin  = function(stin){
            $scope.onSuppGstinChange(stin);
            $scope.isRecStinAsEcomGstn(1,stin);
            if ((stin && stin.length==15 && !$scope.showDropdown) && (!$scope.isDiffStin && $scope.validGstin)) {
               
                $scope.gstinRecordAdd = true;
            }else if(stin && stin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 

        }
        $scope.getNotAddedGSTIN = function (ctin) {
            $scope.onGstinChange(ctin);
            $scope.getPosBasedOnCtin($scope.newInvRw);
            $scope.isRecGstnAsSupGstn(1,ctin);
            $scope.newInvRw.supplierRecipientName = "";
            
            if ((ctin && ctin.length==15 && !$scope.showDropdown) && (!$scope.isDiffCtin && $scope.validGstin)) {
               
                $scope.gstinRecordAdd = true;
            }else if(ctin && ctin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }
        $scope.newInvRw.supplierRecipientName = "";
        $scope.isGSTINSelected = false;

        $scope.afterGSTINSelected = function (selectedObj) {
            $scope.newInvRw.supplierRecipientName = selectedObj.supplierRecipientName;
            $scope.isGSTINSelected = true;
            $scope.gstinRecordAdd = false;
            $scope.onGstinChange(selectedObj.gstin);
           }
        $scope.clearGSTINInput = function () {
            $scope.newInvRw.supplierRecipientName = "";
            $scope.isGSTINSelected = false;
            $scope.showDropdown = false;
            $scope.resetData();
        }

        $scope.showAutocomplete = true;
        $scope.resetDirective = function (isReset) {
            if (isReset == 'Y') {
                $scope.showAutocomplete = false;
            } else {
                $scope.showAutocomplete = true;
            }
        }
            $scope.sameGstin = false;
            $scope.newsuprecmstr = {};
            $scope.dupsupName = false;
            $scope.duprecord = false;
            $scope.suprecmstr = [];
            $scope.newsuprecmstr.recipient = "R";


        //Supplier recipient table
        $scope.showDropdown = true;
        $scope.isSaveSup = false;
       
        $scope.saveSupplierRecord = function () {
            $scope.suprecmstr = [];
            var suprcObj = {};
            $scope.validator = true;
            $scope.duprecord = false;
            $scope.dupsupName = false;
            
            if (shareData.gstinNum == $scope.newsuprecmstr.gstin) {
                $scope.sameGstin = true;
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
                    g1FileHandler.saveProductMstr(shareData.gstinNum, deleteunwantedparams($scope.suprecmstr), "supplierRecipientMasters",true).then(
                        function (response) {
                        
                       if(response.error =="superror"){
                              $scope.dupsupName = true;
                        }else if(response.error =="gstinerror"){
                             $scope.duprecord = true;
                        }else if (response.error) {
                            $scope.addSupErrMsgShow = true;}
                        else{
                        $scope.successMessageShow = true;
                        g1FileHandler.addSupNmToJson($scope.dashBoardDt,$scope.newsuprecmstr.gstin).then(function (response){
                          
                        },function(err){
                           console.log("err",err)
                        });
                        window.scroll(0, 0);
                        $timeout(function () {
                            $scope.successMessageShow = false;
                            $scope.resetData();
                            $scope.isSaveSup = true;
                            $scope.getSupplierDetails('X');
                            $scope.validator = false;
                            $scope.isDiffCtin = false;
                            $scope.validGstin = false;
                            $scope.sameGstin = false;
                            $scope.newsuprecmstr = {};
                            $scope.suprecFrm.$setPristine();
                            $scope.validator = false;
                            $scope.duprecord = false;
                            $scope.dupsupName = false;
                            $('#suppMastAdd').modal('hide');
                        }, 1000);} });

                }
            }

        }

   //Resetting the modal
    $scope.resetData = function () {
        $scope.newsuprecmstr = {};
        $scope.suprecFrm.$setPristine();
        $scope.newsuprecmstr.recipient = "R";
        $scope.newsuprecmstr.supplier = "";
        $scope.gstndisabled = false;
        $scope.newsuprecmstr.gstin = null;
        $scope.newsuprecmstr.tradeName = null;
        $scope.newsuprecmstr.supplierRecipientName = null;
        $scope.isDiffCtin = false;
        $scope.validGstin = false;
        $scope.sameGstin = false;
        $scope.validator = false;
        $scope.duprecord = false;
        $scope.dupsupName = false;
        
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
        //To diable pos same as gstin in b2cl n b2cla
        $scope.stcodedisable = function (iInv) {
          
            var disableAid = true;
            if (iInv) {
                //iInv.pos = null;
            }
            if (iInv && iInv.inv_typ == 'CBW')
                disableAid = false;
            for (var i = 0; i < $scope.StateList.length; i++) {
                if ($scope.StateList[i].cd == shareData.dashBoardDt.gstin.slice(0, 2)) {
                    if (disableAid)
                        $scope.StateList[i].disabled = true;
                    else
                        $scope.StateList[i].disabled = false;
                }
                else {
                    $scope.StateList[i].disabled = false;
                }
            }
        };

        $scope.isNotRegular = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var flag = true;
            if (inv.inv_typ && inv.pos) {
                if (inv.inv_typ !== 'R') {
                    flag = (inv.pos == shareData.dashBoardDt.gstin.slice(0, 2)) ? false : true;
                }
                frmName.pos.$setValidity('pos', flag);
            }

        }

        $scope.invTypeSelected = function (rowObj) {
            if (rowObj.inv_typ != 'R') {
                rowObj.etin = null;
                rowObj.rchrg = 'N';
            }
        };

        //in order to autopoulate pos based on stin
        $scope.getPosBasedOnStin = function (iInv) {
            var ctinOrGstin;
            if (iInv.stin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.stin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

        //in order to autopoulate pos based on rtin
        $scope.getPosBasedOnRtin = function (iInv) {
            var ctinOrGstin;
            if (iInv.rtin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.rtin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }
        
        //in order to autopoulate pos based on ctin
        $scope.getPosBasedOnCtin = function (iInv) {
            var ctinOrGstin;
            if (iInv.ctin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.ctin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

        $scope.setPristine = function (inv, frmName, oldInv) {
            if (tableCode == 'b2cs' || tableCode == 'hsn' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2c' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c' || tableCode  == 'supeco' || tableCode  == 'supecoa' ) {
                if (oldInv.txval != inv.txval || oldInv.val != inv.val || oldInv.iamt != inv.iamt || oldInv.camt != inv.camt || oldInv.samt != inv.samt || oldInv.csamt != inv.csamt || oldInv.suppval != inv.suppval || oldInv.cgst != inv.cgst || oldInv.sgst != inv.sgst || oldInv.igst != inv.igst || oldInv.cess != inv.cess) 
                    frmName.$pristine = false;
                else
                    frmName.$pristine = true;
                return;
            }
            if (inv.old_val != inv.val)
                frmName.$pristine = false;
            else
                frmName.$pristine = true;
        }

        // //CR 23892 To keep SGST and CGST same 
        $scope.updateCGST = function(y){
            if(y)
            y.camt = y.samt;
            else
            $scope.newInvRw.camt = $scope.newInvRw.samt;
        };

        $scope.updateSGST = function(y){
            if(y)
            y.samt = y.camt;
            else
            $scope.newInvRw.samt = $scope.newInvRw.camt;
        };

        //CR 23892 To keep SGST and CGST same in table 14
          $scope.update14CGST = function(y){
            if(y)
            y.cgst = y.sgst;
            else
            $scope.newInvRw.cgst = $scope.newInvRw.sgst;
        };

        $scope.update14SGST = function(y){
            if(y)
            y.sgst = y.cgst;
            else
            $scope.newInvRw.sgst = $scope.newInvRw.cgst;
        };

        $scope.getNotAddedTb14GSTIN = function(etin){
            $scope.onEtinChange(etin);
            $scope.isEtinAsSuppGstn(1,etin);
            if ((etin && etin.length==15 && !$scope.showDropdown) && (!$scope.isDiffEtin && $scope.validGstin)) {
                $scope.gstinRecordAdd = true;
            }else if(etin && etin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.onEtinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.etin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.etin.$setValidity('pattern', $scope.validGstin);
        }
        
        $scope.isEtinAsSuppGstn = function (isNew, etin, frm){
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var pattern = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/;
            $scope.isDiffEtin = false;
            if(etin != null && etin != undefined){
            if($scope.dashBoardDt.gstin == etin.toUpperCase()){
                $scope.etinmsg = 'ECO GSTIN needs to be different from Supplier GSTIN.';
                $scope.isDiffEtin = true;
            }
            else if($scope.newInvRw.etin && ($scope.newInvRw.nat_supp == 'clttx' || $scope.newInvRw.nat_supp == 'clttxa') && pattern.test(etin) == false){
                $scope.etinmsg = 'Please enter a GSTIN of TCS taxpayer.';
                $scope.isDiffEtin = true;
            }
            if (frmName.etin) {
                frmName.etin.$setValidity('etin', !$scope.isDiffEtin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.getNotAddedTb14AGSTIN = function(oetin){
            $scope.onOEtinChange(oetin);
            $scope.isOEtinAsSuppGstn(1,oetin);
            if ((oetin && oetin.length==15 && !$scope.showDropdown) && (!$scope.isDiffEtin && $scope.validGstin)) {
                $scope.gstinRecordAdd = true;
            }else if(oetin && oetin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.onOEtinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.oetin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.oetin.$setValidity('pattern', $scope.validGstin);
        }
        
        $scope.isOEtinAsSuppGstn = function (isNew, oetin, frm){
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var pattern = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/;
            $scope.isDiffEtin = false;
          if(oetin != null && oetin != undefined){
            if($scope.dashBoardDt.gstin == oetin.toUpperCase()){
                $scope.oetinmsg = 'ECO GSTIN needs to be different from Supplier GSTIN.';
                $scope.isDiffEtin = true;
            }
            else if($scope.newInvRw.oetin && $scope.newInvRw.nat_supp == 'clttxa' && pattern.test(oetin) == false){
                $scope.oetinmsg = 'Please enter a GSTIN of TCS taxpayer.';
                $scope.isDiffEtin = true;
            }
            if (frmName.oetin) {
                frmName.oetin.$setValidity('oetin', !$scope.isDiffEtin);
            }
            $scope.gstinRecordAdd = false;
        }
    }
        
        $scope.resetTbl14 = function(){
            $scope.newInvRw.etin =null;
            $scope.newInvRw.cname =null;
            $scope.newInvRw.suppval =null;
            $scope.newInvRw.igst =null;
            $scope.newInvRw.cgst =null;
            $scope.newInvRw.sgst =null;
            $scope.newInvRw.cess =null;
            $scope.isDiffEtin = false;
        }

        $scope.resetTbl14A = function(){
            $scope.newInvRw.omon =null;
            $scope.newInvRw.oyear =null;
            $scope.newInvRw.oetin =null;
            $scope.newInvRw.etin =null;
            $scope.newInvRw.cname =null;
            $scope.newInvRw.suppval =null;
            $scope.newInvRw.igst =null;
            $scope.newInvRw.cgst =null;
            $scope.newInvRw.sgst =null;
            $scope.newInvRw.cess =null;
            $scope.isDiffEtin = false;
        }

        $scope.onPosChangeTB15B2CS = function (y) {
            var isIntra = $scope.isIntraStateB2CS(y);
            var old_sply_ty = y.sply_ty;

            if (isIntra && !isSezTaxpayer) {
                y.sply_ty = $scope.suplyList[0].cd;
                if (old_sply_ty != y.sply_ty) {
                    y.txval = null;
                    y.iamt = null;
                    y.camt = null;
                    y.samt = null;
                    y.csamt = null;
                    // y.rt = 0;
                }

            } else {
                y.sply_ty = $scope.suplyList[1].cd;
               
                if (old_sply_ty != y.sply_ty) {
                    y.txval = null;
                    y.iamt = null;
                    y.camt = null;
                    y.samt = null;
                    y.csamt = null;
                    // y.rt = 0;
                }
            }
        };


        $scope.onPosChangeB2CS = function (y) {
            var isIntra = $scope.isIntraStateB2CS(y);
            var old_sply_ty = y.sply_ty;

            if (isIntra && !isSezTaxpayer) {
                y.sply_ty = $scope.suplyList[0].cd;
                y.iamt = 0;
                // y.camt = (y.rt != null) ? parseFloat(((y.rt * y.txval) * 0.005).toFixed(2)) : 0;
                //  y.samt = (y.rt != null) ? parseFloat(((y.rt * y.txval) * 0.005).toFixed(2)) : 0;
                y.camt = 0;
                y.samt = 0;
                y.csamt = 0;
                if (old_sply_ty != y.sply_ty) {
                    y.txval = 0;
                    // y.rt = 0;
                }

            } else {
                y.sply_ty = $scope.suplyList[1].cd;
                //  y.iamt = (y.rt != null) ? parseFloat(((y.rt * y.txval) / 100).toFixed(2)) : 0;
                y.camt = 0;
                y.samt = 0;
                y.iamt = 0;
                y.csamt = 0;
                if (old_sply_ty != y.sply_ty) {
                    y.txval = 0;
                    // y.rt = 0;
                }
            }
        };

        $scope.onSetDiffPer = function (iInv) {
            iInv.diffval = false;
        }

        //To clear the items if  differential percentage is changed,in case of no items clear to tax values respectively
        $scope.onDiffPerChange = function (iInv) {
            iInv.diffval = false;
            if (iInv.itms.length > 0) {
                iInv.diffval = true;
                $scope.createAlert("Warning", "Applicable % of tax rates got changed. Please add items level details.", function () {
                    iInv.itms = [];
                    $scope.gotoAddItems(iInv);
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }
        }

        //To handle inv_typ CBW - currently not in use
        // $scope.onCBWChange = function (iInv) {
        //     console.log(iInv);
        //     var list = $scope.suplyList;
        //     var prevSuppType = iInv.sply_ty;


        //     if (iInv.inv_typ == 'CBW' || iInv.pos != shareData.gstinNum.slice(0, 2)) {
        //         iInv.sply_ty = "INTER";
        //     } else {
        //         iInv.sply_ty = "INTRA";
        //     }

        //     if (prevSuppType != iInv.sply_ty && iInv.itms && iInv.itms.length > 0) {
        //         $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
        //             iInv.itms = [];
        //             $scope.gotoAddItems(iInv);
        //         });
        //         if ($scope.initSumryList)
        //             $scope.initSumryList();
        //     }
        // }

        $scope.onCBWChangeB2CL = function (iInv, sec) {

            var prevSuppType = iInv.sp_typ.name;

            // iInv.inv_typ == 'CBW' || 
            // even though CBW applies integrated tax, the supply type still remains intrastate
            if (iInv.pos != shareData.gstinNum.slice(0, 2)) {
                iInv.sp_typ.name = "Inter-State";
            } else {
                iInv.sp_typ.name = "Intra-State";
            }
            if (sec == 'b2cl' || sec == 'b2cla') {
                if (iInv.inv_typ == 'CBW') {
                    iInv.sp_typ.name = "Inter-State";
                }

            }

            if (prevSuppType != iInv.sp_typ.name && iInv.itms && iInv.itms.length > 0) {
                // console.log(shareData);
                $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                    iInv.itms = [];
                    $scope.gotoAddItems(iInv);
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }

        }

        //To clear the items if  supply type changed,in case of no items clear to tax values respectively
        $scope.onPosChange = function (iInv, isNew) {

            if (iInv && (iInv.pos || iInv.state_cd || iInv.ctin || iInv.rtin || iInv.stin || iInv.cpty || iInv.sup_ty)) {
                var oldInv = iInv;
                // console.log(iInv);
                var prvSupplyTyp = iInv.sp_typ,
                    list = $scope.suplyList;
                // console.log(prvSupplyTyp);
                var tin, code, sup_ty, curntSuplyType;
                if (tableCode == 'b2b' || tableCode == 'b2ba') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                } else if (tableCode == 'b2bur' || tableCode == 'b2bura') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'b2cl' || tableCode == 'b2cla') {
                    tin = $scope.dashBoardDt.gstin;
                    code = iInv.pos;

                } else if (tableCode == 'ecomb2b' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2b' || tableCode == 'ecomurp2c'){
                    tin = iInv.rtin;
                    code = iInv.pos; 
                } else if (tableCode == 'ecomab2b' ||tableCode == 'ecomaurp2b'){
                    tin = iInv.rtin;
                    code = iInv.pos; 
                }
                // }else if (tableCode == 'ecomab2c'){
                //     tin = iInv.stin;
                //     code = iInv.pos; 
                // }else if (tableCode == 'ecomaurp2c'){
                //     tin = $scope.dashBoardDt.gstin;
                //     code = iInv.pos; 
                // }
                else if (tableCode == 'at' || tableCode == 'ata' || tableCode == 'b2csa' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c' || tableCode == 'txi' || tableCode == 'atxi' || tableCode == 'atadj' || tableCode == 'atadja') {

                    code = iInv.pos;
                    getUniqueInvoice(oldInv, iInv);
                    //$scope.onCBWChange(iInv);
                    // $scope.isPosSelectd = (code) ? true : false;
                    return;
                } else if (tableCode == 'b2cs') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'cdnr' || tableCode == 'cdnra') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                }

                if (tableCode == "b2cl" || tableCode == "b2cla") {
                    if (code) {
                        if (tin.substring(0, 2) === code) {
                            iInv.sp_typ = $scope.suplyList[0];
                        } else {
                            iInv.sp_typ = $scope.suplyList[1];
                        }
                    }
                } else {
                    iInv.sp_typ = R1Util.getSupplyType(list, tin, code, sup_ty, isSezTaxpayer);
                    if ((tableCode == "b2b" || tableCode == "b2ba" || tableCode == "cdnr" || tableCode == "cdnra" || tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE')) && !isSezTaxpayer) {
                        iInv.sp_typ = list[1];
                    }
                }
                if (prvSupplyTyp.name !== iInv.sp_typ.name) {

                    if (iInv.itms && iInv.itms.length > 0) {
                        //Added by Janhavi CBW+rchrg defect fix
                        if (iInv.inv_typ == "CBW" && iInv.rchrg == "N") {
                            $scope.createAlert("WarningOk", "Supply type got changed. Please add all the mandatory details to proceed and add item level details again.", function () {
                                iInv.itms = [];
                            });
                        } else {
                            $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                                iInv.itms = [];
                                $scope.gotoAddItems(iInv);
                            });
                            if ($scope.initSumryList)
                                $scope.initSumryList();
                        }
                    } else {
                        if (isNew) {
                            if(tableCode != "ecomb2b" && tableCode != "ecomurp2b" && tableCode != "ecomab2b" && tableCode !== "ecomaurp2b"){
                            clearTaxRates(1, iInv, 1);
                            }
                            $scope.isIntraState(1, iInv);
                        } else {
                            if(tableCode != "ecomb2b" && tableCode != "ecomurp2b" && tableCode != "ecomab2b" && tableCode !== "ecomaurp2b"){
                            clearTaxRates(0, iInv, 1);
                            }
                            $scope.isIntraState(0, iInv);
                        }
                    }
                }
            }
            getUniqueInvoice(oldInv, iInv);

        }

        //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoice(oldInv, modifiedInv, isIntraStateFn) {

            var returnValue = null,
                iIndex = null;
            if (oldInv) {
                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, formName),
                    keys = Object.keys(updatedNodeDetails),
                    oData = angular.copy($scope.ReturnsList);
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

                if (isIntraStateFn) {
                    var returnObj = {};
                    returnObj.index = iIndex;
                    returnObj.data = returnValue;
                    return returnObj;
                }
            }
            return returnValue;
        }


        //To clear taxrates if pos changed in case of no item level
        function clearTaxRates(isNew, iInv, isSpTypChnge) {
            var stdata = null,
                oData = null,
                exIndex = null;

            if (iInv) {
                oData = getUniqueInvoice(iInv, iInv, 1);
                stdata = oData.data;
                exIndex = oData.index;
            }

            var invData = (isNew) ? $scope.newInvRw : stdata;

            if (invData) {
                if (invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) {
                    if (isSpTypChnge) {
                        invData.irt = 0;
                        invData.iamt = 0;
                        if (invData.itc && shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_i = 0;
                            invData.itc.tc_i = 0;
                        }

                    }
                } else {
                    if (isSpTypChnge) {
                        invData.crt = 0;
                        invData.camt = 0;
                        invData.srt = 0;
                        invData.samt = 0;
                        if (invData.itc && shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_s = 0;
                            invData.itc.tx_c = 0;
                            invData.itc.tc_c = 0;
                            invData.itc.tc_s = 0;
                        }
                    }
                }

            }

            if (isNew) {
                $scope.newInvRw = invData;
            } else {
                $scope.ReturnsList[exIndex] = invData;
            }
        }



        //To check shipping date less than invoice date in exp,expa
        $scope.isLessThanInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dt, odt, isValidDt = true, isValidOdt = true;
            if (tableCode == 'cdnr' || tableCode == 'cdnur') {
                dt = iInv.nt_dt;
            }
            if (tableCode == 'cdnra' || tableCode == 'cdnura') {
                dt = iInv.nt_dt;
                odt = iInv.ont_dt;
            }
            if (tableCode == 'exp') {
                dt = iInv.sbdt;
            }

            if (iInv.idt && dt)
                if (moment(dt, dateFormat).isBefore(moment(iInv.idt, dateFormat))) {
                    isValidDt = false;
                    if (tableCode == 'cdnr' || tableCode == 'cdnur') {
                        $scope.errMsg = "Note date cannot be prior to invoice date"
                    }
                    if (tableCode == 'exp') {
                        $scope.errMsg = "Shipping bill date cannot be earlier than invoice date."
                    }
                }
            if (iInv.idt && odt)
                if (moment(odt, dateFormat).isBefore(moment(iInv.idt, dateFormat))) {
                    isValidOdt = false;
                    if (tableCode == 'cdnra' || tableCode == 'cdnura') {
                        $scope.errMsg1 = "Orginal Note date cannot be prior to invoice date"
                    }
                    // if (tableCode == 'exp') {
                    //     $scope.errMsg = "Shipping bill date cannot be earlier than invoice date."
                    // }
                }

            if (moment(dt, dateFormat).isValid()) {
                if (moment(dt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                    isValidDt = false;
                    if (isNew) {
                        if (tableCode == "cdnr" || tableCode == 'cdnra' || tableCode == 'cdnura' || tableCode == 'cdnur')
                            $scope.errMsg = "Date is Invalid. Date of Note/Refund voucher cannot exceed the current tax period";
                        else if (tableCode == "exp" || tableCode == "expa")
                            $scope.errMsg = "Date is Invalid. Date of Shipping Bill cannot exceed the current tax period";
                        else
                            $scope.errMsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                    }
                }
                else if (moment(dt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                    isValidDt = false;
                    if (isNew) {
                        if (tableCode == "cdnr" || tableCode == 'cdnra' || tableCode == 'cdnura' || tableCode == 'cdnur')
                            $scope.errMsg = "Date is Invalid. Date of Note/Refund Voucher cannot be before the date of registration";
                        else if (tableCode == "exp")
                            $scope.errMsg = "Date is Invalid. Date of Shipping Bill cannot be before the date of registration";
                        else
                            $scope.errMsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                    }
                }

            }
            if (moment(odt, dateFormat).isValid()) {
                if (moment(odt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                    isValidOdt = false;
                    if (isNew) {
                        if (tableCode == 'cdnra' || tableCode == 'cdnura')
                            $scope.errMsg1 = "Date is Invalid. Date of Note/Refund voucher cannot exceed the current tax period";

                    }
                }
                else if (moment(odt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                    isValidOdt = false;
                    if (isNew) {
                        if (tableCode == 'cdnra' || tableCode == 'cdnura')
                            $scope.errMsg1 = "Date is Invalid. Date of Note/Refund Voucher cannot be before the date of registration";

                    }
                }

            }


            if (frmName.sbdt) {
                frmName.sbdt.$setValidity('sbdt', isValidDt);
            }
            if (frmName.nt_dt) {
                frmName.nt_dt.$setValidity('nt_dt', isValidDt);
            }
            if (frmName.ont_dt) {
                frmName.ont_dt.$setValidity('ont_dt', isValidOdt);
            }
        }

        // $scope.isInvalidNumber = false;
        $scope.isValidInvNumber = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var isValidInum = true, isValidOinum = true;
            if (iInv.inum && Number(iInv.inum) == 0) {
                $scope.isDuplicateNumber = false;
                $scope.isInvalidNumber = true;
                isValidInum = false;
                // $scope.invMsg = "Invoice number can't be 0";
            }

            if (iInv.inum && Number(iInv.oinum) == 0) {
                $scope.isDuplicateNumber = false;
                $scope.isInvalidNumber = true;
                isValidOinum = false;
                //$scope.invMsg = "Invoice number can't be 0";
            }

            if (frmName.inum) {
                frmName.inum.$setValidity('inum', isValidInum);
            }
            if (frmName.oinum) {
                frmName.oinum.$setValidity('oinum', isValidOinum);
            }

        }


        //To check invoice dates n shipping bill date in expa
        $scope.isMoreThanShipDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var sbdt, newDt, oldDt, isValidiDt = true, isValidsbDt = true, isValidoiDt = true;
            $scope.inValidNewDt = false;
            if (tableCode == 'expa') {
                sbdt = iInv.sbdt;
                oldDt = iInv.oidt;
                newDt = iInv.idt;
            }
            if (moment(sbdt, dateFormat).isValid() || moment(oldDt, dateFormat).isValid() || moment(newDt, dateFormat).isValid()) {
                var isSbDtLessMinDt = moment(sbdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat)),
                    isSbDtMoreMaxDt = moment(sbdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat)),
                    isOldDtLessMinDt = moment(oldDt, dateFormat).isBefore(moment($scope.min_dt, dateFormat)),
                    isOldDtMoreMaxDt = moment(oldDt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat)),
                    isNewDtLessMinDt = moment(newDt, dateFormat).isBefore(moment($scope.min_dt, dateFormat)),
                    isNewDtMoreMaxDt = moment(newDt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat));
                if (isSbDtLessMinDt) {
                    isValidsbDt = false;
                    $scope.errMsg = "Date is Invalid. Date of Shipping Bill cannot be before the date of registration";
                }
                else if (isSbDtMoreMaxDt) {
                    isValidsbDt = false;
                    $scope.errMsg = "Date is Invalid. Date of Shipping Bill cannot exceed the current tax period";
                }
                if (isOldDtLessMinDt) {
                    isValidoiDt = false;
                    $scope.errMsg = "Date is Invalid. Date of Invoice cannot be before the date of registration";
                }
                else if (isOldDtMoreMaxDt) {
                    isValidoiDt = false;
                    $scope.errMsg = "Date is Invalid. Date of Invoice cannot exceed the current tax period";
                }
                if (isNewDtLessMinDt) {
                    isValidiDt = false;
                    $scope.errMsg = "Date is Invalid. Date of Invoice cannot be before the date of registration";
                }
                else if (isNewDtMoreMaxDt) {
                    isValidiDt = false;
                    $scope.errMsg = "Date is Invalid. Date of Invocie cannot exceed the current tax period";
                }

            }

            if (oldDt || newDt) {
                var isPrevNewDt = moment(newDt, dateFormat).isBefore(moment(oldDt, dateFormat)),
                    isshiDtPrevOldInvDt = moment(sbdt, dateFormat).isBefore(moment(oldDt, dateFormat)),
                    isshiDtPrevNewInvDt = moment(sbdt, dateFormat).isBefore(moment(newDt, dateFormat));
                // if (isPrevNewDt) {
                //     isValidiDt = false;
                //     $scope.errMsg = "Revised Invoice date cannot be prior to original Invoice date"
                // } else 
                if (isshiDtPrevOldInvDt || isshiDtPrevNewInvDt) {
                    isValidsbDt = false;
                    $scope.errMsg = "Shipping Bill cannot be prior to original/Revised invoice date"
                }

            }


            if (frmName.idt) {
                frmName.idt.$setValidity('idt', isValidiDt);
            }
            if (frmName.oidt) {
                frmName.oidt.$setValidity('oidt', isValidoiDt);
            }
            if (frmName.sbdt) {
                frmName.sbdt.$setValidity('sbdt', isValidsbDt);
            }
        }

        //To check revised dates or after orignal date
        $scope.isMoreThanInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var newDt, oldDt, isValidiDt = true, isValidntDt = true, isValidOntDt = true;
            // if (tableCode == 'b2ba' || tableCode == 'b2cla' || tableCode == 'expa') {
            //     oldDt = iInv.oidt;
            //     newDt = iInv.idt;
            // }
            if (tableCode == 'cdnra' || tableCode == 'cdnura') {
                oldDt = iInv.ont_dt;
                newDt = iInv.nt_dt;
            }


            if (oldDt && newDt) {
                var isNewNoteDtPreviDt = moment(newDt, dateFormat).isBefore(moment(iInv.idt, dateFormat));
                // if (isPrevNewDt && (tableCode == 'b2ba' || tableCode == 'b2cla' || tableCode == 'expa')) {
                //     isValidiDt = false;
                //     $scope.errMsg = "Revised Invoice date cannot be prior to original Invoice date"
                if ((isNewNoteDtPreviDt)) {
                    isValidntDt = false;
                    $scope.errMsg = "Revised Note date cannot be prior to invoice date"
                }


            }

            // if (frmName.idt) {
            //     frmName.idt.$setValidity('idt', isValidiDt);
            // }
            if (frmName.nt_dt) {
                frmName.nt_dt.$setValidity('nt_dt', isValidntDt);
            }
            // if (frmName.ont_dt) {
            //     frmName.ont_dt.$setValidity('ont_dt', isValidOntDt);
            // }
        }

        //To check either hsn or desc as mandatory
        $scope.isRequiredField = function (inv, isHsn) {

            var isRequired;
            if (inv) {
                if (isHsn) {
                    isRequired = (inv.hsn_sc) ? false : true;
                }
                else {
                    isRequired = (inv.desc) ? false : true;
                }
            }
            return isRequired;
        }


        //To check either hsn or desc as mandatory

        $scope.isRequiredField2 = function (inv, isHsn, checking_for) {

            var isRequired;
            if (inv) {
                if (checking_for == 'camt' || checking_for == 'samt') {
                    isRequired = (inv.iamt && inv.iamt != '') ? false : true;
                }
                else {
                    isRequired = ((inv.samt && inv.samt != '') || (inv.camt && inv.camt != '')) ? false : true;
                }
            }
            return isRequired;
        }


        //To disable pos if type in cdnur expwpay n wopay
        $scope.isTypeExp = function (inv) {
            if (inv && (inv.typ == 'EXPWP' || inv.typ == 'EXPWOP')) {
                if (inv.pos)
                    inv.pos = null;
                if (inv.diff_percent)
                    inv.diff_percent = null;
                return true;
            }
            else
                return false;
        }

        //validation for same receiver gstin n supplier gstin
        $scope.isRecGstnAsSupGstn = function (isNew, ctin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            $scope.isDiffCtin = ($scope.dashBoardDt.gstin == ctin) ? true : false;

            if (frmName.ctin) {
                frmName.ctin.$setValidity('ctin', !$scope.isDiffCtin);
            }
            $scope.gstinRecordAdd = false;
            //return isDiffCtin;
        }
       
        $scope.stinrtinmsg= "";
        $scope.isRecStinAsEcomGstn = function (isNew, stin, frm) {
            
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffStin =false;
            if(stin != null && stin != undefined){
            stin = stin.toUpperCase();
            if($scope.dashBoardDt.gstin == stin){
                $scope.stinrtinmsg = 'Supplier and E-commerce Operator cannot be the same.';
                $scope.isDiffStin = true;
            }
            else if($scope.newInvRw.rtin && $scope.newInvRw.rtin == stin){
                $scope.stinrtinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffStin = true;
            }
            else if($scope.newInvRw.rtin && $scope.newInvRw.rtin == stin && $scope.dashBoardDt.gstin == stin){
                $scope.stinrtinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffStin = true;
            }


            if (frmName.stin) {
                frmName.stin.$setValidity('stin', !$scope.isDiffStin);
            console.log('checking stin validity',$scope.newInvFrm.stin.$invalid, $scope.stinrtinmsg);
            }
            
            
            $scope.gstinRecordAdd = false;
        }}

        $scope.isRtinAsEcomGstn = function (isNew, rtin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffRtin = false;
            if(rtin != null && rtin != undefined){
            if($scope.dashBoardDt.gstin == rtin.toUpperCase()){
                $scope.rtinmsg = 'Recipient and E-commerce Operator cannot be the same.';
                $scope.isDiffRtin = true;
            }
            if (frmName.rtin) {
                frmName.rtin.$setValidity('rtin', !$scope.isDiffRtin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.isSupStinAsEcomGstn = function (isNew, stin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffStin = false;
            if(stin != null && stin != undefined){
            if($scope.dashBoardDt.gstin == stin.toUpperCase()){
                $scope.stinmsg = 'Supplier and E-commerce Operator cannot be the same.';
                $scope.isDiffStin = true;
            }
            if (frmName.stin) {
                frmName.stin.$setValidity('stin', !$scope.isDiffStin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.isRecRtinAsEcomGstn = function (isNew, rtin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffRtin = false;
            if(rtin != null && rtin != undefined){
            rtin = rtin.toUpperCase();
            if($scope.dashBoardDt.gstin == rtin){
                $scope.rtinstinmsg = 'Recipient and E-commerce Operator cannot be the same.';
                $scope.isDiffRtin = true;
            }
            else if($scope.newInvRw.stin && $scope.newInvRw.stin == rtin){
                $scope.rtinstinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffRtin = true;
            }
            else if($scope.newInvRw.stin && $scope.newInvRw.stin == rtin && $scope.dashBoardDt.gstin == rtin){
                $scope.rtinstinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffRtin = true;
            }
            if (frmName.rtin) {
                frmName.rtin.$setValidity('rtin', !$scope.isDiffRtin);
            }
            $scope.gstinRecordAdd = false;
        }}
        //validation for same description and hsn in hsn
        $scope.isDescSameAsHsn = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isDiffDesc = (inv.hsn_sc && inv.desc && inv.hsn_sc == inv.desc) ? false : true;

            if (frmName.desc) {

                frmName.desc.$setValidity('desc', isDiffDesc);
            }
            //return isDiffCtin;
        }

        //validation for same etin n receiver gstin n supplier gstin
        $scope.isEtinAsSupRecGstin = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isDiffEtin = ($scope.dashBoardDt.gstin == iInv.etin || iInv.ctin == iInv.etin) ? true : false;

            if (frmName.etin) {
                frmName.etin.$setValidity('etin', !isDiffEtin);
            }
            // return isDiffEtin;
        }

        //IMPS supply type condition for cdnur
        $scope.invTypeChanged = function (inv) {
            if (inv.inv_typ == "IMPS") {
                inv.sp_typ = $scope.suplyList[1];
            }

        }

        //sorting functionality
        $scope.sortReverse = false;
        $scope.sort = function (sortKey) {
            $scope.sortBy = sortKey;
            $scope.sortReverse = !$scope.sortReverse;
            initSumryList();
        }

        $scope.convertStrToNum = function (iObj, iKey) {
            if (iObj[iKey])
                iObj[iKey] = Number(iObj[iKey]);

        }

        $scope.isInvalidNumber = false;
        $scope.isDuplicateNumber = false;
        //flags and conditions added by janhavi to differentiate orginal inv/nt num and revised inv/nt num
        $scope.isInvalidOriginalNumber = false;
        $scope.isDuplicateOriginalNumber = false;
        $scope.isDuplicateInvoice = function (isNew, inv, key, frm) {
            var isExistInvoice = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            var reqParam = shareData.dashBoardDt,
                isDupChkRequired = true;


            if (inv[key]) {
                if (Number(inv[key] == 0)) {
                    if (key == 'oinum' || key == 'ont_num') {
                        $scope.isDuplicateOriginalNumber = false;
                        $scope.isInvalidOriginalNumber = true;
                        frmName[key].$setValidity(key, false);
                    }
                    if (key == 'inum' || key == 'nt_num') {
                        $scope.isInvalidNumber = true;
                        $scope.isDuplicateNumber = false;
                        frmName[key].$setValidity(key, false);
                    }
                }
                else {
                    if (!isNew) {
                        if (reqParam.tbl_cd == 'b2ba' || reqParam.tbl_cd == 'b2cla' || reqParam.tbl_cd == 'expa' || reqParam.tbl_cd == 'ecomab2b' || reqParam == 'ecomaurp2b') {
                            isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                        else if (reqParam.tbl_cd == 'cdnra' || reqParam.tbl_cd == 'cdnura') {
                            if (key == "nt_num")
                                isDupChkRequired = (inv.old_ntnum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                            else if (key == "inum")
                                isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                    }

                    //reqParam.invdltArray = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName);
                    reqParam.key = key;
                    reqParam.value = inv[key];

                    if (isDupChkRequired) {
                        g1FileHandler.checkDuplicateInvoice(reqParam).then(function (response) {
                            isExistInvoice = (response.result == 'yes') ? true : false;
                            if (isExistInvoice) {
                                if (key == 'oinum' || key == 'ont_num') {
                                    $scope.isInvalidOriginalNumber = false;
                                    $scope.isDuplicateOriginalNumber = true;
                                }
                                if ((key == 'inum' || key == 'oinum') && shareData.dashBoardDt.tbl_cd != 'ecomb2b' && shareData.dashBoardDt.tbl_cd != 'ecomurp2b' && shareData.dashBoardDt.tbl_cd != 'ecomab2b' && shareData.dashBoardDt.tbl_cd != 'ecomaurp2b') {
                                    $scope.isInvalidNumber = false;
                                    $scope.isDuplicateNumber = true;
                                }
                                if ((key == 'inum' || key == 'oinum') && (shareData.dashBoardDt.tbl_cd == 'ecomb2b' || shareData.dashBoardDt.tbl_cd == 'ecomurp2b' || shareData.dashBoardDt.tbl_cd == 'ecomab2b' || shareData.dashBoardDt.tbl_cd == 'ecomaurp2b')) {
                                    $scope.isInvalidNumber = false;
                                    $scope.isDuplicateNumber = true; 
                                  
                                    if(response.hasOwnProperty('oinum'))
                                        $scope.isDuplicateMsgorg = "Document No. '" + response.oinum + "' already exists in the current period.";
                                    
                                    if(response.hasOwnProperty('inum'))
                                    $scope.isDuplicateMsg = "Document No. '" + response.inum + "' already exists in the current period.";
                                   
                                }
								
                                
                            }
                            frmName[key].$setValidity(key, !isExistInvoice);
                        }, function (response) {
                            $log.debug("returnsctrl -> checkDuplicateInvoice fail:: ", response);
                        });
                    }
                    else {
                        frmName[key].$setValidity(key, !isExistInvoice);
                    }
                }
            }

        }
        //To check if valid Invoice Type is selected
        $scope.validateNoteType = function (colkey, isNew, inv, frm) {
            let form = (isNew) ? $scope.newInvFrm : frm;
            let isValid = true;
            if (inv.inv_typ == 'CBW' && inv.rchrg != 'Y') {
                isValid = false;
            }
            if (colkey != 'rchrg') {
                if (inv.inv_typ != 'R' && inv.inv_typ != 'CBW') {
                    inv.etin = null;
                    inv.rchrg = 'N';
                }
            }
            form.inv_typ.$setValidity('inv_typ', isValid);
        }
        //duplicate invoice check
        $scope.isExistingInv = function (isNew, iNum, frm) {
            var isExistInv = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNum) {
                iNum = iNum.toLowerCase();
            }
            angular.forEach($scope.ReturnsList, function (inv, i) {

                if ((inv.onum && inv.onum.toLowerCase() == iNum) || (inv.inum && inv.inum.toLowerCase() == iNum) || (inv.doc_num && inv.doc_num.toLowerCase() == iNum) || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum)) {

                    isExistInv = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.inum.$setValidity('inum', !isExistInv);
        }

        $scope.isExistingInv22 = function (isNew, iNum, ctin, frm, key) {
            if (!key)
                key = 'inum';
            if (!iNum)
                iNum = '';

            if (!ctin)
                ctin = '';
            var isExistInv = 0,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNum) {
                iNum = iNum.toLowerCase();
            }
            frmName[key].$setValidity(key, true);
            angular.forEach($scope.ReturnsList, function (inv, i) {
                if (
                    (inv.onum && inv.onum.toLowerCase() == iNum)
                    ||
                    (inv[key] && inv[key].toLowerCase() == iNum.toLowerCase() && inv.ctin && inv.ctin.toLowerCase() == ctin.toLowerCase())
                    ||
                    (inv.doc_num && inv.doc_num.toLowerCase() == iNum)
                    || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum)
                ) {


                    isExistInv++;
                }
            });
            if (isExistInv > 1) {
                frmName[key].$setValidity(key, false);
            } else {
                frmName[key].$setValidity(key, true);
            }
        }



        //duplicate Note check
        $scope.isExistingNote = function (isNew, iNote, frm) {
            var isExistNote = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNote) {
                iNote = iNote.toLowerCase();
            }
            angular.forEach($scope.ReturnsList, function (inv, i) {
                if ((inv.nt_num && (inv.nt_num).toLowerCase() == iNote)) {
                    isExistNote = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.nt_num.$setValidity('nt_num', !isExistNote);
        }

        //duplicate boe num check
        $scope.isExistingBillNumber = function (isNew, boeNum, frm) {
            var isExistboe = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;

            angular.forEach($scope.ReturnsList, function (inv, i) {
                if (inv.boe_num && (inv.boe_num == boeNum)) {
                    isExistboe = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.boe_num.$setValidity('boe_num', !isExistboe);
        }




        //duplicate Note check
        $scope.isExistingNotee = function (isNew, iNote, frm) {
            var isExistNote = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNote) {
                iNote = iNote.toLowerCase();
            }
            angular.forEach($scope.ReturnsList, function (inv, i) {
                if ((inv.nt_num && (inv.nt_num).toLowerCase() == iNote)) {
                    isExistNote = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.nt_num.$setValidity('nt_num', !isExistNote);
        }


        //duplicate Desc for hsn check
        $scope.isExistingDesc = function (isNew, iDesc, iHsn, frm) {
            var isExistDesc = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iDesc) {
                if (isNew == 1) {
                    angular.forEach($scope.ReturnsList, function (inv, i) {
                        if (((inv.desc && (inv.desc).toLowerCase() == (iDesc).toLowerCase()) && (inv.hsn_sc && inv.hsn_sc == iHsn))) {
                            isExistDesc = true;
                        }
                    });
                } else {
                    angular.forEach($scope.ReturnsList, function (inv, i) {
                        if (((inv.desc && (inv.desc).toLowerCase() == (iDesc).toLowerCase()) && (inv.hsn_sc && inv.hsn_sc == iHsn))) {
                            isExistDesc = true;
                        }
                    });
                }
            }
            // return (isExistInv) ? true : false;
            frmName.desc.$setValidity('desc', !isExistDesc);

        }



        $scope.isExistingDesc2 = function (isNew, iDesc, iHsn, uqc, frm) {

            if (!iDesc)
                iDesc = '';

            if (!iHsn)
                iHsn = '';
            var isExistDesc = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;


            frmName.desc.$setValidity('duplicate', true);
            frmName.uqc.$setValidity('duplicate', true);
            frmName.hsn_sc.$setValidity('duplicate', true);

            // if (iDesc) {
            if (isNew == 1) {
                angular.forEach($scope.ReturnsList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if (!inv.desc)
                        inv.desc = '';
                    if (
                        ((inv.desc).toLowerCase() == (iDesc).toLowerCase())

                        &&
                        (inv.hsn_sc == iHsn)
                        &&
                        (inv.uqc == uqc)

                    ) {
                        isExistDesc = true;
                    }
                });
                frmName.desc.$setValidity('duplicate', !isExistDesc);
                frmName.uqc.$setValidity('duplicate', !isExistDesc);
                frmName.hsn_sc.$setValidity('duplicate', !isExistDesc);
            } else {
                var cnt = 0;
                angular.forEach($scope.ReturnsList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if ((((inv.desc).toLowerCase() == (iDesc).toLowerCase()) && (inv.hsn_sc == iHsn) && (inv.uqc == uqc))) {
                        isExistDesc = true;
                        cnt++;
                    }
                });
                if (cnt > 1) {
                    frmName.desc.$setValidity('duplicate', !isExistDesc);
                    frmName.uqc.$setValidity('duplicate', !isExistDesc);
                    frmName.hsn_sc.$setValidity('duplicate', !isExistDesc);
                }
            }


        }

        //duplicate HSN, UQC, Rate
        $scope.isExistingHsnUqcRate = function (isNew, iRate, iHsn, uqc, frm) {
            // if (!iRate)
            //     iRate = '';
            if (!iHsn)
                iHsn = '';
            var isExistRate = false;
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            frmName.rt.$setValidity('duplicate', true);
            frmName.uqc.$setValidity('duplicate', true);
            frmName.hsn_sc.$setValidity('duplicate', true);

            if (isNew == 1) {
                angular.forEach($scope.ReturnsList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    // if (inv.rt == null)
                    //     inv.rt = '';
                    if (
                        (inv.rt == iRate)
                        &&
                        (inv.hsn_sc == iHsn)
                        &&
                        (inv.uqc == uqc)
                    ) {
                        isExistRate = true;
                    }
                });
                frmName.rt.$setValidity('duplicate', !isExistRate);
                frmName.uqc.$setValidity('duplicate', !isExistRate);
                frmName.hsn_sc.$setValidity('duplicate', !isExistRate);
            } else {
                var cnt = 0;
                angular.forEach($scope.ReturnsList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if (inv.rt == iRate && inv.hsn_sc == iHsn && inv.uqc == uqc) {
                        isExistRate = true;
                        cnt++;
                    }
                });
                if (cnt > 1) {
                    frmName.rt.$setValidity('duplicate', !isExistRate);
                    frmName.uqc.$setValidity('duplicate', !isExistRate);
                    frmName.hsn_sc.$setValidity('duplicate', !isExistRate);
                }
            }
            if(isNew == 1){
                $scope.comparisonofMaster();
            }
        }

        //duplicate POS check
        $scope.isExistingPos = function (isNew, iPos, frm) {
            var isExistPos = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;

            angular.forEach($scope.ReturnsList, function (inv, i) {
                if ((inv.pos && inv.pos == iPos)) {
                    isExistPos = true;
                }
            });
            frmName.supst_cd.$setValidity('supst_cd', !isExistPos);
        }

        //To display empty row in Lastpage only in case of pagination
        $rootScope.isLastPage = function (currentPage, pageSize) {
            var isLast = false,
                total = Math.ceil(($scope.totalAvailable / pageSize));
            if (total == currentPage) {
                isLast = true;
            }
            // if no records, we are always on last page.
            if ($scope.totalAvailable == 0)
                return true;
            return isLast;
        }



        //To make etin as mandatory field in case of b2cs & b2csa
        $scope.isEcom = function (isNew, inv, frm) {

            var frmName = (isNew) ? $scope.newInvFrm : frm,
                isOEcom = false;


            if (inv.typ && inv.typ == "OE") {
                isOEcom = true;
                if (frmName.etin.$viewValue) {
                    inv.etin = null;
                }

            }
            // $scope.isOEcom=isOEcom;

        }

        //In exp,expa supplylist only inter-state
        $scope.supplyList = [];
        $scope.supplyList.push($scope.suplyList[1]);




        //To check value of b2cl Invoices(>=250000)
        $scope.isLargeInv = function (isNew, val, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;


            var isValidAmt = (val && val <= $scope.B2CL_MIN) ? false : true;
            frmName.val.$setValidity('val', isValidAmt);
        }

        //Document Date Validation
        $scope.docDateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot exceed the current tax period";
                        }

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.idt.$setValidity('idt', dtflag);

        };

        //date validation		
        $scope.dateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                        }

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.idt.$setValidity('idt', dtflag);

        };

        //date validation for old Document date
        $scope.docOldDateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot exceed the current tax period";

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.oidt.$setValidity('oidt', dtflag);

        };


        //date validation for old invoice date
        $scope.oldDateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.oidt.$setValidity('oidt', dtflag);

        };

        $scope.dateLimit_u = function (isNew, invdt, frm, elem) {
            if (!elem)
                elem = 'i_dt'
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            if (tableCode == 'imp_g')
                                $scope.invdtmsg = "Date is Invalid. Date of Bill of Entry cannot exceed the current tax period";
                            else
                                $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                        }

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            if (tableCode == 'imp_g')
                                $scope.invdtmsg = "Date is Invalid. Date of Bill of Entry cannot be before the date of registration";
                            else
                                $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                        }

                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName[elem].$setValidity(elem, dtflag);

        };


        $scope.maxmDate = "";
        //To disable Future Dates
        $scope.datefunc = function () {
            var rtDt = null,
                today = moment().format(dateFormat),
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat);
            if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
                rtDt = today;
            } else {
                rtDt = lastDate1;
            }
            $scope.maxmDate = rtDt;
            return rtDt;
        };
        $scope.todayDate = function () {
            return moment().format(dateFormat);
        }


        // $scope.min_dt = "";
        // $scope.minDate = function () {
        //     var firstMonth = $scope.monthList[0],
        //         temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
        //         firstDate = moment(temp, dateFormat),
        //         firstDate1 = firstDate.format(dateFormat);
        //     //temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2)
        //     $scope.min_dt = moment(temp, "DD/MM/YYYY").add(1, 'days').subtract(18, 'months').format("DD/MM/YYYY");
        //     return $scope.min_dt;

        // };

        // $scope.dateVal = $scope.minDate();

        $scope.min_dt = "";
        $scope.minDate = function () {
            var firstMonth = $scope.monthList[0],
                temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                temp2 = "01072017",
                firstDate = moment(temp2, dateFormat),
                firstDate1 = firstDate.format(dateFormat),
                lastDate = moment(temp1, dateFormat),
                lastDate1 = lastDate.format(dateFormat);
            var diff = lastDate.diff(firstDate, 'months');
            $scope.min_dt = firstDate1;
            //temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2)

            return $scope.min_dt;

        };

        $scope.dateVal = $scope.minDate();

        //To enable prev dates in case of cdnr pregst
        $scope.minInvDatePGst = function (inv) {
            var minDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2);
                //firstDate = moment(temp1, dateFormat),
                // firstDate1 = firstDate.format(dateFormat);
                minDate = moment(temp1, "DD/MM/YYYY").add(1, 'days').subtract(18, 'months').format("DD/MM/YYYY");

            }
            else {
                minDate = $scope.minDate();
            }
            return minDate;
        }

        //To disable after jun30 dates in case of cdnr pregst
        $scope.maxInvDatePGst = function (inv) {
            var maxDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "30062017",
                    lastDate = moment(temp1, dateFormat),
                    lastDate1 = lastDate.format(dateFormat);
                maxDate = lastDate1;

            }
            else {
                maxDate = $scope.datefunc();
            }
            return maxDate;
        };



        $scope.onPgstchange = function (obj) {
            if (obj.p_gst == 'Y')
                delete obj.dt;
            else
                obj.dt = $scope.minDate();

        };

        $scope.isPreGST = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var maxDt = $scope.maxInvDatePGst(inv),
                minDt = $scope.minInvDatePGst(inv),
                dtflag = true,
                invdt = inv.idt;

            if (moment(invdt, dateFormat).isValid()) {
                if (moment(invdt, dateFormat).isAfter(moment(maxDt, dateFormat))) {
                    dtflag = false;
                    if (isNew) {
                        if (inv.p_gst == 'Y')
                            $scope.invdtmsg = "Date of invoice cannot exceed June 30, 2017 for Pre GST Regime";
                        else
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                    }

                }
                else if (moment(invdt, dateFormat).isBefore(moment(minDt, dateFormat))) {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                }

            } else {
                dtflag = false;
                if (isNew)
                    $scope.invdtmsg = "Date does not exists in the calendar";
                // return true;
            }
            frmName.idt.$setValidity('idt', dtflag);
        }


        $scope.ecomflag = true;
        $scope.ecomtyp = function (typ) {
            if (typ == "E") {
                $scope.ecomflag = false;

            }
            else {
                $scope.ecomflag = true;
            }
        }

        //cdn change in supply type
        $scope.change_suptyp = function (iInv) {
            if (iInv.itms && iInv.itms.length > 0) {
                iInv.itms = [];
            }
        }

        $scope.sezimp = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflag = true;

            }
            else {
                $scope.sezflag = false;
                delete obj.ctin;
            }
        }

        $scope.sezimpnew = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflagnew = true;

            }
            else {
                $scope.sezflagnew = false;
                delete obj.ctin;
            }
        }

        //Navigate to Items Page 
        $scope.gotoAddItems = function (iInv) {
            if (iInv == 'add') {
                if ($scope.newInvFrm.$valid) {
                    var iData = $scope.newInvRw;
                    if (iData.val)
                        iData.val = Number(iData.val);
                    shareData.itmInv = iData;
                    shareData.isNewRec = true;
                    $scope.page("/gstr/items/" + tableCode);
                } else {
                    $scope.newInvValidtr = true;
                }

            } else {
                shareData.isNewRec = false;
                if (iInv.val)
                    iInv.val = Number(iInv.val);
                if (tableCode == 'b2b' || tableCode == 'b2ba' || tableCode == 'cdnr' || tableCode == 'cdnra' || tableCode == 'ecomb2b' || tableCode == 'ecomurp2b' || tableCode == 'ecomab2b' || tableCode == 'ecomaurp2b') {
                    if (iInv.inv_typ == 'SEWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
                                obj.itm_det.iamt = 0;
                                obj.itm_det.csamt = 0;
                            } else if (obj.itm_det.camt) {
                                obj.itm_det.camt = 0;
                                obj.itm_det.samt = 0;
                                obj.itm_det.csamt = 0;
                            }

                        });
                    }
                    /* if (iInv.inv_typ == 'DE') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.csamt)
                                obj.itm_det.csamt = 0;
                        });
                    } */
                }
                if (tableCode == 'cdnur' || tableCode == 'cdnura') {
                    if (iInv.typ == 'EXPWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
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
                if (tableCode == "at" || tableCode == "txi" || tableCode == "atadj" || tableCode == "ata" || tableCode == "atadja") {
                    shareData.itmInv = iInv;
                } else {
                    shareData.itmInv = getUniqueInvoice(iInv);

                }
                $scope.page("/gstr/items/" + tableCode);

            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iInv) {
            $scope.hideaddBtn = false;
            $scope.hsnNotfromMstr =null;
            var stdata = null,
                updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, iInv, formName);
            if (tableCode == "b2cs" || tableCode == "hsn" || tableCode == "hsnsum" || tableCode == "ecomb2c" || tableCode == "ecomurp2c" || tableCode == "ecomab2c" || tableCode == "ecomaurp2c") {
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);

                if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                    iInv.rt = Number(iInv.rt);
                    delete iInv.val;
                }
                else {
                    iInv.val = Number(iInv.val);
                    delete iInv.rt;
                }
            }
             if (tableCode == "hsn(b2b)" || tableCode == "hsn(b2c)" ){
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
                iInv.rt = Number(iInv.rt);
            }
            if(tableCode == 'supeco' || tableCode == 'supecoa'){
                iInv.suppval = Number(iInv.suppval);
                iInv.igst = Number(iInv.igst);
                iInv.cgst = Number(iInv.cgst);
                iInv.sgst = Number(iInv.sgst);
                iInv.cess = Number(iInv.cess);
                if(iInv.suppval > 0 && (iInv.igst < 0 || iInv.cgst < 0 || iInv.sgst < 0 || iInv.cess < 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    $scope.initSumryList();
                    return;
                } else if (iInv.suppval < 0 && (iInv.igst > 0 || iInv.cgst > 0 || iInv.sgst > 0 || iInv.cess > 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    $scope.initSumryList();
                    return;
                }
            }
            if(tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b"){
                iInv.val = Number(iInv.val);
            }
            if (iInv.diffval) {
                $scope.createAlert("Warning", "Item level tax amounts may have been updated. Please check and confirm.", function () {
                    $scope.gotoAddItems(iInv);
                    iInv.diffval = false;
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
                return false;
            }

            if (iInv) stdata = getUniqueInvoice(iInv);
            if (stdata) {
                if (tableCode == "hsn" || tableCode == "hsn(b2b)" || tableCode == "hsn(b2c)" || tableCode == "b2cs" || tableCode == "hsnsum" || tableCode == "ecomb2c" || tableCode == "ecomurp2c" || tableCode == "ecomab2c" || tableCode == "ecomaurp2c" || tableCode == "supeco" || tableCode == "supecoa")
                    R1InvHandler.emptyItemUpdate($scope, stdata, updatedNodeDetails, formateNodePayload);
                else
                    R1InvHandler.update($scope, stdata, updatedNodeDetails, formateNodePayload);
            } else {
                R1InvHandler.emptyItemUpdate($scope, stdata, updatedNodeDetails, formateNodePayload);
            }

        }
        

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];
            var yesFlag = false;

            angular.forEach($scope.ReturnsList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName));
                }
            });
            if (invdltArray.length > 0) {
                $scope.createAlert("Warning", "Are you sure to delete selected rows.", function () {
                    R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                        $scope.ReturnsList = angular.copy(response);
                        $scope.selectAll = 'N';
                        $scope.checked.selectall = 'N';
                        shareData.checkCount = 0;
                    });
                })

            } else {
                $scope.createAlert("WarningOk", "No Data to Mark as Delete.", function () { });
            }
        }

        $scope.dashbrdGstn = shareData.dashBoardDt.gstin.substring(0, 2);
        $scope.isIntraStateB2CS = function (obj) {
            if (obj.pos == $scope.dashbrdGstn && !isSezTaxpayer)
                return true;
            return false;

        };

        //checking of supplytype in order to disable the tax values respectively
        $scope.isIntraState = function (isNew, iInv) {
            var oData, invData;
            if (iInv) {
                oData = getUniqueInvoice(iInv, iInv, 1);
                invData = oData.data;
                //pgIndex = getUniqueInvoice(iInv, iInv, 1).index;
            }

            if (isNew) {
                return ($scope.newInvRw.sply_ty === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            } else if (invData) {
                return (invData && invData.sply_ty === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }


        //To disable itc if not eligible(GSTR2)
        $scope.isEligible = function (iElg) {
            return (!iElg || iElg == "none") ? true : false;
        }


        //To clear values if eligiblity changed as none
        $scope.elgBltyChange = function (iItm) {
            var elg = iItm.itc.elg;

            if (elg == "none" && iItm.sp_typ.name == "Intra-State") {
                iItm.itc.tx_c = 0.00;
                iItm.itc.tx_s = 0.00;
                iItm.itc.tx_cs = 0.00;
                iItm.itc.tc_c = 0.00;
                iItm.itc.tc_s = 0.00;
                iItm.itc.tc_cs = 0.00;
            } else if (elg == "none" && iItm.sp_typ.name == "Inter-State") {
                iItm.itc.tx_i = 0.00;
                iItm.itc.tx_cs = 0.00;
                iItm.itc.tc_i = 0.00;
                iItm.itc.tc_cs = 0.00;
            }
        }


        //To add new invoice 
        $scope.savePayload = function () {
            $scope.txrate = false;
            $scope.hideaddBtn = false;
            $scope.hsnNotfromMstr =null;
            var newInvoice = angular.copy($scope.newInvRw);
            if (tableCode == "b2cs" || tableCode == "b2csa" || tableCode == 'ecomb2c' || tableCode == 'ecomurp2c') {
                if((tableCode == 'ecomb2c' || tableCode == 'ecomurp2c') && newInvoice.camt != newInvoice.samt){
                    $scope.txrate = true;
                }
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
                if($scope.txrate == true){
                    $scope.createAlert("Error", "Please enter same amount for CGST and SGST", function(){});
                    $scope.txrate = false;
                    return;
                }
            }
            if ( tableCode == 'supeco' || tableCode == 'supecoa') {
                newInvoice.suppval = Number(newInvoice.suppval);
                newInvoice.igst = Number(newInvoice.igst);
                newInvoice.cgst = Number(newInvoice.cgst);
                newInvoice.sgst = Number(newInvoice.sgst);
                newInvoice.cess = Number(newInvoice.cess);
                if(newInvoice.suppval > 0 && (newInvoice.igst < 0 || newInvoice.cgst < 0 || newInvoice.sgst < 0 || newInvoice.cess < 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    return;
                } else if (newInvoice.suppval < 0 && (newInvoice.igst > 0 || newInvoice.cgst > 0 || newInvoice.sgst > 0 || newInvoice.cess > 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    return;
                }
            }
            if (tableCode == 'hsn(b2b)' || tableCode == 'hsn(b2c)') {
                $scope.newInvFrm.hsn_sc.$setValidity('duplicate', true);
                $scope.newInvFrm.uqc.$setValidity('duplicate', true);
                $scope.newInvFrm.rt.$setValidity('duplicate', true);
                var iLen = $scope.ReturnsList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
                newInvoice.val = Number(newInvoice.val);
                newInvoice.rt = Number(newInvoice.rt);
            }
            if (tableCode == 'hsn' || tableCode == 'hsnsum') {
                $scope.newInvFrm.hsn_sc.$setValidity('duplicate', true);
                $scope.newInvFrm.uqc.$setValidity('duplicate', true);
                if(!$scope.showOldUI){
                    $scope.newInvFrm.rt.$setValidity('duplicate', true);
                }
                var iLen = $scope.ReturnsList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);

                if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                    newInvoice.rt = Number(newInvoice.rt);
                    delete newInvoice.val
                }
                else {
                    newInvoice.val = Number(newInvoice.val);
                    delete newInvoice.rt
                }

            }
            else {
                newInvoice.val = Number(newInvoice.val);
            }
            if ($scope.newInvFrm.$valid) {
                var stdata = angular.copy(newInvoice);
                if (stdata) {
                    R1InvHandler.emptyItemAdd($scope, stdata, formateNodePayload).then(function (response) {
                        if (response) {
                            if (Array.isArray(response)) {

                            } else {
                                $scope.ReturnsList.push(newInvoice);
                                
                                $scope.newInvValidtr = false;
                                $scope.hsnsaveedit = false;
                                $scope.isHsnSelected = false;
                                initNewInvRow();
                            }

                        }
                    });
                }
            } else {
                $scope.newInvValidtr = true;
            }
        }
        $scope.prodMstr={};  
        $scope.prodMstr.hsn="";    
        $scope.showProdMaster = function(prodData,fromView){
            $("#prodMastAdd").modal({ backdrop: "static" });
                $().blockPage(false);
               
            let descdet = {value :""};
            let descDetail =JSON.stringify(descdet);
            // console.log(descDetail);
            var ix = 0;
            let descriptionstr = ""; 
            if(Array.isArray($scope.ReturnsList) && $scope.ReturnsList.length){
             let hscIdex =prodData.num;  
             let hasMatch = false;
             for(var i=0;i<$scope.ReturnsList.length;++i){
                 var ab = $scope.ReturnsList[i];
                 if(ab.hsn_sc == prodData.hsn_sc){
                     hasMatch=true;
                     hscIdex = prodData.num;
                     break;
                 }
             }
             if(Array.isArray($scope.ReturnsList) && $scope.ReturnsList.length){
                // console.log('Testing Returns');
                // console.log($scope.itemslist);
                 for(var x = 0; x<$scope.itemslist.length;++x){
                    //  console.log('xx..',x);
                    // console.log('Scope key...')  
                    // console.log($scope.itemslist[x].key);
                    //  console.log('hsc value');
                    //  console.log(hscIdex);
                     if($scope.itemslist[x].key == hscIdex){
                        // console.log('Matched....'); 
                        ix = x;
                        //  console.log(ix);                         
                         break;
                     }
                 }
                // ix = $scope.itemslist.some(function(item, i){return item.key ==  hscIdex});
                var descdet1 = hasMatch ? $scope.itemslist[ix] : descDetail.value;// {"value" :""}; 
                // console.log(hasMatch);
                // console.log(ix);
                // console.log('result..');
                // console.log(descdet1['value']);
                // var objDesc= JSON.stringify(descdet1);
                // console.log("objDesc",objDesc);
                descriptionstr = (descdet1 == undefined)?"":descdet1['value'];
            }
              
            }
            // $scope.checkHSNInput();
            $scope.getDesc = localStorage.getItem('description');
            $scope.prodMstr.hsn = prodData.hsn_sc;
            $scope.prodMstr.desc = descriptionstr ? descriptionstr : $scope.getDesc;
            $scope.prodMstr.rt = prodData.rt.toString();
            $scope.prodMstr.uqc = prodData.uqc;
            $scope.fromview = fromView;
        }

        $scope.sucessmsg = function () {
            $scope.successMessageShow = "";
        }
    
        $scope.hsnBlurvalidation = function () {
            if (!$scope.hsnsaveedit && $scope.prodMstr.hsn && $scope.prodMstr.hsn.length > 0) {
                $scope.hsnnotselected = true;
            } else {
                $scope.hsnnotselected = false;
    
            }
        }
        $scope.afterselecthsnOutward = function (result) {
            $scope.prodMstr.desc = result.n;
            $scope.prodMstr.hsn = result.c;
            $scope.hsnsaveedit = true;
            $scope.checkForServiceHSN(result.c);
            $scope.hsnnotselected = false;
        }

     
     //unique prodname check
    $scope.isExistingprdname = function (productName) {
        var frmName = $scope.prdmstrFrm;
        $scope.duplicaterecord = false;
        frmName.productName.$setValidity('duplicate', true);
        if (productName) {
            productName = productName.toLowerCase();
        }
     
        angular.forEach($scope.productData, function (mstrprd) {
            if ((mstrprd.productName && (mstrprd.productName).toLowerCase() == productName)) {

                $scope.duplicaterecord = true;
            }
        });
        frmName.productName.$setValidity('duplicate', !$scope.duplicaterecord);
        return $scope.duplicaterecord;
    }

 //Save Hsn Table
 $scope.isSaveProd = false;
        $scope.saveProduct = function () {
            $scope.savemstr = [];
            var saveobj = {};

            if ($scope.isExistingprdname($scope.prodMstr.productName)) {
                return;
            }
            if ($scope.productData && $scope.productData.length >= 20) {
                $scope.createAlert(
                    "info",
                    "You can add maximum 500 records in Product master. Please delete some unwanted records to add more records",
                    function () {


                    }
                );
            } else {
                if ($scope.prodMstr && $scope.prodMstr.hsn && $scope.prdmstrFrm.$valid) {
                    saveobj["hsn"] = $scope.prodMstr.hsn;
                    saveobj["productDescription"] = $scope.prodMstr.desc;
                    saveobj["productName"] = $scope.prodMstr.productName;
                    saveobj["uqc"] = $scope.prodMstr.uqc;
                    saveobj["igst"] = Number($scope.prodMstr.rt);

                    $scope.savemstr.push(saveobj);

                    g1FileHandler.saveProductMstr(shareData.gstinNum, deleteunwantedparams($scope.savemstr), "productsMasters", true).then(
                        function (response) {
                            if(!sessionStorage.getItem("supRecipGstin")){
                                sessionStorage.setItem("supRecipGstin", JSON.stringify({supplierRecipientMasters : [],productsMasters:$scope.savemstr}));
                            } else {
                                $scope.supplierRecipientData = JSON.parse(sessionStorage.getItem('supRecipGstin'));
                                $scope.supplierRecipientData.productsMasters = $scope.supplierRecipientData.productsMasters.concat($scope.savemstr);
                                sessionStorage.setItem("supRecipGstin", JSON.stringify($scope.supplierRecipientData));
                            }
                            
                            
                            $scope.successMessageShow = true;
                            window.scroll(0, 0);
                            $timeout(function () {
                                $scope.successMessageShow = false;
                                if (!$scope.fromview) {
                                    $scope.newInvRw.productName = $scope.savemstr[0].productName;
                                } else {
                                    for (let i in $scope.ReturnsList) {
                                        if ($scope.ReturnsList[i].hsn_sc == $scope.savemstr[0].hsn && $scope.ReturnsList[i].uqc == $scope.savemstr[0].uqc && $scope.ReturnsList[i].rt == $scope.savemstr[0].igst) {
                                            $scope.ReturnsList[i].productName = $scope.savemstr[0].productName;
                                            $scope.updateInvoice($scope.ReturnsList[i]);
                                            break;
                                        }

                                    }
                                }

                                $scope.prodMstr = {};
                                $scope.hsnnotselected = false;
                                $scope.duplicaterecord = false;
                                $('#prodMastAdd').modal('hide');
                                $scope.hideaddBtn = false;
                                $scope.prdmstrFrm.$setPristine();
                                // localStorage.clear('description');
                            }, 1500);

                        });

                } else {
                    $scope.newInvValidtr = true;
                }
            }
        }

}
]);

myApp.controller("itmctrl", ['$scope', 'shareData', 'R1InvHandler', 'ReturnStructure', function ($scope, shareData, R1InvHandler, ReturnStructure) {
    $scope.txrate = false;
    $scope.newItmValidtr = false;
    $scope.selectAll = null;

    var tblcd = null,
        formName = null;

    $scope.isIntraState = function () {
        if ($scope.itmList && $scope.itmList.sp_typ) {
            return ($scope.itmList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
        }
    };
    //Added check for negative item value as part of CR17052
    $scope.fnCheckValidItm = function (itmArray) {
        let validFlag = true;
        let validForZero = true;
        let validGrtr = true;
        let validLssThn = true;
        itmArray.forEach(function (obj, key) {
            if (obj.ad_amt == 0) {
                if (obj.csamt >= 0 && (obj.iamt > 0 || (obj.samt > 0 && obj.camt > 0)))
                    validForZero = true;
                else if (obj.csamt <= 0 && (obj.iamt < 0 || (obj.samt < 0 && obj.camt < 0)))
                    validForZero = true;
                else
                    validForZero = false;
            } else if (obj.ad_amt < 0) {
                if (obj.iamt > 0 || obj.camt > 0 || obj.samt > 0 || obj.csamt > 0)
                    validLssThn = false;
                else
                    validLssThn = true;
            } else if (obj.ad_amt > 0) {
                if (obj.iamt < 0 || obj.camt < 0 || obj.samt < 0 || obj.csamt < 0)
                    validGrtr = false;
                else
                    validGrtr = true;
            } else {
                validForZero = true;
                validGrtr = true;
                validLssThn = true;
            }
        });
        if (!validForZero || !validGrtr || !validLssThn)
            validFlag = false;

        return validFlag;
    }
    $scope.itcinvalid = false;
    $scope.rateWiseData = [];
    //ITC validations for GSTR2
    $scope.checkamountwithitc = function (items) {
        //$scope.newItmFrm.$setValidity('amountlessthanitc', true);
        $scope.itcinvalid = false;

        items.filter(function (item) {
            var item1 = item.itc ? item.itc : item;
            if (!parseFloat(item.iamt) && parseFloat(item1.tx_i)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            else if (parseFloat(item.iamt) < parseFloat(item1.tx_i)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            if (!parseFloat(item.camt) && parseFloat(item1.tx_c)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            else if (parseFloat(item.camt) < parseFloat(item1.tx_c)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            if (!parseFloat(item.samt) && parseFloat(item1.tx_s)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            else if (parseFloat(item.samt) < parseFloat(item1.tx_s)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            if (!parseFloat(item.csamt) && parseFloat(item1.tx_cs)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }
            else if (parseFloat(item.csamt) < parseFloat(item1.tx_cs)) {
                //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                $scope.itcinvalid = true;
            }

        });
    }
    $scope.parsefloat = function (val) {
        if (val == '' || !val)
            return 0;
        return parseFloat(val);
    }

    function initializeData(iTblCode) {
        switch (iTblCode) {
            case 'b2b':
            case 'b2ba':
            case 'b2cl':
            case 'b2cla':
            case 'cdnr':
            case 'cdnur':
            case 'cdnra':
            case 'cdnura':
            case 'b2bur':
            case 'b2csa':
            case 'ecomb2b':
            case 'ecomurp2b':
            case 'ecomab2b':
            case 'ecomab2c':    
            case 'ecomaurp2b':
            case 'ecomaurp2c':   
             var indexMap = {};
            var tmpRateWiseList = JSON.parse(JSON.stringify($scope.rateWiseData));        
            angular.forEach($scope.rateWiseData, function(row, idx){
                if(row && row.rt !== null && row.rt !== undefined){
                    angular.forEach($scope.RateList.CommGST, function(grow, gidx){
                        if(Number(row.rt) === Number(grow.value)){
                            indexMap[gidx] = idx;
                        }                            
                    });
                }                    
            }); 
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                    var existIdx = indexMap[key];
                    if(existIdx !== undefined && $scope.rateWiseData[existIdx]){
                        var existingRow = tmpRateWiseList[existIdx];
                        existingRow.rt = val.value;
                        // $scope.rateWiseData.push(existingRow);
                        $scope.rateWiseData[key].rt = val.value ;

                    }else{
                           if ($scope.intraState) {
                            if (formName === "GSTR2") {
                                $scope.rateWiseData[key]={
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_c": 0,
                                        "tx_s": 0,
                                        "tx_cs": 0
                                    }
                                };
                            } else {
                                $scope.rateWiseData[key]={
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        } else {
                            if (formName === "GSTR2") {
                                $scope.rateWiseData[key]={
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_i": 0,
                                        "tx_cs": 0
                                    }
                                };
                            } else {
                                $scope.rateWiseData[key]={
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        }
                    }
                });
                break;
            case 'exp':
            case 'expa':
                var indexMap = {};
                var tmpRateWiseList = JSON.parse(JSON.stringify($scope.rateWiseData));
                angular.forEach($scope.rateWiseData, function (row, idx) {
                    if (row && row.rt !== null && row.rt !== undefined) {
                        angular.forEach($scope.RateList.CommGST, function (grow, gidx) {
                            if (Number(row.rt) === Number(grow.value)) {
                                indexMap[gidx] = idx;
                            }
                        });
                    }
                }); 
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                    var existIdx = indexMap[key];
                    if(existIdx !== undefined && $scope.rateWiseData[existIdx]){
                        var existingRow = tmpRateWiseList[existIdx];
                        existingRow.rt = val.value;
                        // $scope.rateWiseData.push(existingRow);
                        $scope.rateWiseData[key].rt = val.value ;

                    }else{
                  
                    if (!$scope.rateWiseData[key]) {
                        $scope.rateWiseData[key] = {
                            "rt": val.value,
                            "iamt": 0,
                            "csamt": 0,
                            "txval": 0
                        };
                    }
                }
                });
                break;
            case 'imp_g':
            case 'imp_s':
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                    var iIndex;
                    iIndex = val.value;
                    switch (val.value) {
                        case 0.1:
                            iIndex = 1;
                            break;
                        case 0.25:
                            iIndex = 2;
                            break;
                        case 1:
                            iIndex = 3;
                            break;
                        case 1.5:
                            iIndex = 4;
                            break;
                        case 3:
                            iIndex = 5;
                            break;
                        case 5:
                            iIndex = 6;
                            break;
                        case 6:
                            iIndex = 7;
                            break;
                        case 7.5:
                            iIndex = 8;
                            break;
                    }
                    if (!$scope.rateWiseData[iIndex]) {
                        $scope.rateWiseData[iIndex] = {
                            "rt": val.value,
                            "iamt": 0,
                            "csamt": 0,
                            "txval": 0,
                            "tx_i": 0,
                            "tx_cs": 0
                        };

                    }
                });
                break;
            case 'at':
            case 'ata':var indexMap = {};
                var tmpRateWiseList = JSON.parse(JSON.stringify($scope.rateWiseData));
                angular.forEach($scope.rateWiseData, function (row, idx) {
                    if (row && row.rt !== null && row.rt !== undefined) {
                        angular.forEach($scope.RateList.CommGST, function (grow, gidx) {
                            if (Number(row.rt) === Number(grow.value)) {
                                indexMap[gidx] = idx;
                            }
                        });
                    }
                }); 
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                    var existIdx = indexMap[key];
                    if(existIdx !== undefined && $scope.rateWiseData[existIdx]){
                        var existingRow = tmpRateWiseList[existIdx];
                        existingRow.rt = val.value;
                        // $scope.rateWiseData.push(existingRow);
                        $scope.rateWiseData[key].rt = val.value ;

                    }else{

                    if (!$scope.rateWiseData[key]) {
                        if ($scope.intraState) {
                            $scope.rateWiseData[key] = {
                                "rt": val.value,
                                "camt": 0,
                                "samt": 0,
                                "csamt": 0,
                                "ad_amt": 0
                            };
                        }
                        else {
                            $scope.rateWiseData[key] = {
                                "rt": val.value,
                                "iamt": 0,
                                "csamt": 0,
                                "ad_amt": 0
                            };
                        }
                    }}
                });
            break;
            case 'txi':
                var indexMap = {};
                var tmpRateWiseList = JSON.parse(JSON.stringify($scope.rateWiseData));
                angular.forEach($scope.rateWiseData, function (row, idx) {
                    if (row && row.rt !== null && row.rt !== undefined) {
                        angular.forEach($scope.RateList.CommGST, function (grow, gidx) {
                            if (Number(row.rt) === Number(grow.value)) {
                                indexMap[gidx] = idx;
                            }
                        });
                    }
                }); 
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                    var existIdx = indexMap[key];
                    if(existIdx !== undefined && $scope.rateWiseData[existIdx]){
                        var existingRow = tmpRateWiseList[existIdx];
                        existingRow.rt = val.value;
                        // $scope.rateWiseData.push(existingRow);
                        $scope.rateWiseData[key].rt = val.value ;

                    }else{
                    if (!$scope.rateWiseData[key]) {
                        if ($scope.intraState) {
                            $scope.rateWiseData[key] = {
                                "rt": val.value,
                                "camt": 0,
                                "samt": 0,
                                "csamt": 0,
                                "adamt": 0
                            };
                        }
                        else {
                            $scope.rateWiseData[key] = {
                                "rt": val.value,
                                "iamt": 0,
                                "csamt": 0,
                                "adamt": 0
                            };
                        }
                     } }
                });
                break;
            case 'atadj':
            case 'atadja':
                if (formName == 'GSTR1') {
                    var indexMapatadj = {};
                    var tmpRateWiseListatadj = JSON.parse(JSON.stringify($scope.rateWiseData));
                    angular.forEach(tmpRateWiseListatadj, function (row, idx) {
                        if (row && row.rt !== null && row.rt !== undefined) {
                            angular.forEach($scope.RateList.CommGST, function (grow, gidx) {
                                if (Number(row.rt) === Number(grow.value)) {
                                    indexMapatadj[gidx] = idx;
                                }
                            });
                        }
                    });
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var existIdxatadj = indexMapatadj[key];
                        if (existIdxatadj !== undefined && $scope.rateWiseData[existIdxatadj]) {
                            var existingRowatadj = tmpRateWiseListatadj[existIdxatadj];
                            existingRowatadj.rt = val.value;
                            //$scope.rateWiseData.push(existingRowatadj);
                            $scope.rateWiseData[key].rt = val.value ;
                        } else {

                        if (!$scope.rateWiseData[key]) {
                            if ($scope.intraState) {
                                $scope.rateWiseData[key] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "ad_amt": 0
                                };
                            }
                            else {
                                $scope.rateWiseData[key] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "ad_amt": 0
                                };
                            }
                        }}
                    });
                }
                else if (formName == 'GSTR2') {
                    var indexMap2 = {};
                    var tmpRateWiseList2 = JSON.parse(JSON.stringify($scope.rateWiseData));
                    angular.forEach($scope.rateWiseData, function (row, idx) {
                        if (row && row.rt !== null && row.rt !== undefined) {
                            angular.forEach($scope.RateList.CommGST, function (grow, gidx) {
                                if (Number(row.rt) === Number(grow.value)) {
                                    indexMap2[gidx] = idx;
                                }
                            });
                        }
                    });
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var existIdx2 = indexMap2[key];
                        if (existIdx2 !== undefined && $scope.rateWiseData[existIdx2]) {
                            var existingRow2 = tmpRateWiseList2[existIdx2];
                            existingRow2.rt = val.value;
                            // $scope.rateWiseData.push(existingRow2);
                            $scope.rateWiseData[key].rt = val.value ;

                        } else {

                            if (!$scope.rateWiseData[key]) {
                                if ($scope.intraState) {
                                    $scope.rateWiseData[key] = {
                                        "rt": val.value,
                                        "camt": 0,
                                        "samt": 0,
                                        "csamt": 0,
                                        "adamt": 0
                                    };
                                }
                                else {
                                    $scope.rateWiseData[key] = {
                                        "rt": val.value,
                                        "iamt": 0,
                                        "csamt": 0,
                                        "adamt": 0
                                    };
                                }
                            }
                        }
                    });
                }

                break;
        }
    }

    function getAlreadyExistingData(iTblCode) {
        switch (iTblCode) {
            case 'b2b':
            case 'b2ba':
            case 'ecomb2b':
            case 'ecomurp2b':
            case 'ecomab2b':
            case 'ecomaurp2b':
                if (formName == 'GSTR2') {
                    if ($scope.itmList.inv_typ == 'SEWP') {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            //$scope.rateWiseData[index] = val.itm_det;
                            $scope.rateWiseData[index].itc = val.itc;
                            if (val.itm_det.iamt == 0 || val.itm_det.camt == 0 || val.itm_det.samt == 0)
                                $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);

                        });
                    }
                    else {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            //$scope.rateWiseData[index] = val.itm_det;
                            $scope.rateWiseData[index].itc = val.itc;

                        });
                    }
                } else {
                    if ($scope.itmList.inv_typ == 'SEWP') {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            val.itm_det.diff_percent = $scope.itmList.diff_percent;
                            //$scope.rateWiseData[index] = val.itm_det;
                            // if (val.itm_det.iamt == 0 || val.itm_det.camt == 0 || val.itm_det.samt == 0)
                            //     $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);

                        });
                    }
                    else {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                               
                                case 12:
                                    index = 9;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 18:
                                    index = 10;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 28:
                                    index = 11;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 40:
                                    index = 12;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }

                            val.itm_det.diff_percent = $scope.itmList.diff_percent;
                            //$scope.rateWiseData[index] = val.itm_det;

                            if ($scope.itmList.inv_typ != 'SEWOP') {
                                // $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                            }
                        });
                    }
                }
                break;
            case 'b2cl':
            case 'b2bur':
            case 'cdnr':
            case 'cdnur':
            case 'b2cla':
            case 'cdnra':
            case 'cdnura':
                if (formName == 'GSTR2') {
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        var index = val.itm_det.rt;
                        switch (index) {
                            case 0.1:
                                index = 1;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 0.25:
                                index = 2;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 1:
                                index = 3;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 1.5:
                                index = 4;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 3:
                                index = 5;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 5:
                                index = 6;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 6:
                                index = 7;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 7.5:
                                index = 8;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            default:
                                $scope.rateWiseData[index] = val.itm_det;

                        }
                        //$scope.rateWiseData[index] = val.itm_det;
                        $scope.rateWiseData[index].itc = val.itc;

                    });
                } 
                else {
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        var index = val.itm_det.rt;
                        switch (index) {
                            case 0.1:
                                index = 1;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 0.25:
                                index = 2;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 1:
                                index = 3;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 1.5:
                                index = 4;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 3:
                                index = 5;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 5:
                                index = 6;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 6:
                                index = 7;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 7.5:
                                index = 8;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 12:
                                index = 9;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 18:
                                index = 10;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 28:
                                index = 11;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            case 40:
                                index = 12;
                                $scope.rateWiseData[index] = val.itm_det;
                                break;
                            default:
                                $scope.rateWiseData[index] = val.itm_det;

                        }
                        //$scope.rateWiseData[index] = val.itm_det;
                        //if ($scope.itmList.inv_typ != 'SEWOP') {
                        //   $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                        //}
                    });
                }
                break;
            case 'exp':
            case 'at':
            case 'atadj':
            case 'expa':
            case 'ata':
            case 'b2csa':
            case 'atadja':
            case 'txi':
            case 'ecomab2c':
            case 'ecomaurp2c':     
                angular.forEach($scope.itmList.itms, function (val, key) {
                    var index = val.rt;
                    switch (index) {
                        case 0.1:
                            index = 1;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 0.25:
                            index = 2;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 1:
                            index = 3;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 1.5:
                            index = 4;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 3:
                            index = 5;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 5:
                            index = 6;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 6:
                            index = 7;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 7.5:
                            index = 8;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 12:
                            index = 9;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 18:
                            index = 10;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 28:
                            index = 11;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 40:
                            index = 12;
                            $scope.rateWiseData[index] = val;
                            break;
                        default:
                            $scope.rateWiseData[index] = val;

                    }
                    //$scope.rateWiseData[index] = val;
                    //if ($scope.itmList.inv_typ != 'SEWOP') {
                    // $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                    //}
                });
                break;
            case 'imp_g':
            case 'imp_s':
                angular.forEach($scope.itmList.itms, function (val, key) {
                    var index = val.rt;
                    switch (index) {
                        case 0.1:
                            index = 1;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 0.25:
                            index = 2;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 1:
                            index = 3;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 1.5:
                            index = 4;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 3:
                            index = 5;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 5:
                            index = 6;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 6:
                            index = 7;
                            $scope.rateWiseData[index] = val;
                            break;
                        case 7.5:
                            index = 8;
                            $scope.rateWiseData[index] = val;
                            break;
                        default:
                            $scope.rateWiseData[index] = val;

                    }
                    //$scope.rateWiseData[index] = val;
                    //                    $scope.rateWiseData[index].itc = val.itc;

                });
                break;

        }

    }


    function defaultItemInit(iTblcode) {
        var itmObj = {};
        switch (iTblcode) {
            case 'b2ba':
            case 'b2cla':
            case 'cdnra':
            case 'cdnura':
                itmObj.num = 1;
                itmObj.itm_det = $scope.rateWiseData[0];
                break;
            case 'b2csa':
            case 'expa':
            case 'ata':
            case 'atadja':
                itmObj.itm_det = $scope.rateWiseData[0];
                break;

        }
        return itmObj;
    }

    //check if GSTR info available

    if (!shareData.dashBoardDt && !shareData.itmInv) {

        $scope.page("/gstr/summary");
        return false;
    } else {
        $scope.dashBoardDt = shareData.dashBoardDt;
        formName = shareData.dashBoardDt.form;
        tblcd = $scope.dashBoardDt.tbl_cd;
        $scope.itmList = shareData.itmInv;
        if (tblcd == 'at' || tblcd == 'atadj' || tblcd == 'txi' || tblcd == 'atadja' || tblcd == 'ata' || tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') {
            $scope.intraState = false;
            if ($scope.itmList.sply_ty === 'INTRA') {
                $scope.intraState = true;
            }
        }
        else {
            if ($scope.dashBoardDt.form == "GSTR1" && (tblcd == 'b2cl' || tblcd == 'b2cla')) {
                $scope.intraState = false;
            } else {
                $scope.intraState = $scope.isIntraState();
            }
        }
        $scope.itemsLength = $scope.itmList.itms.length;

        if ($scope.itemsLength > 0) {
            getAlreadyExistingData(tblcd);
            initializeData(tblcd);
        } else {
            initializeData(tblcd);
        }

        var data = $scope.rateWiseData;

        data = data.filter(function (element) {
            return element !== undefined;
        });
        $scope.rateWiseData = data;
    }

    $scope.getEligibilityForITC = function () {
        if ($scope.dashBoardDt.gstin.slice(0, 2) == $scope.itmList.pos) {
            return true;
        } else {
            return false;
        }
    }

    $scope.initelg = function (iItm) {
        var elg;
        if (iItm.itc) {
            elg = iItm.itc.elg;
        } else {
            elg = iItm.elg;
        }
        if (iItm.txval > 0) {
            if (!elg) {
                elg = $scope.getEligibilityForITC() ? "" : 'no';
            }
        }
        if (iItm.itc) {
            iItm.itc.elg = elg;
        }
        else {
            iItm.elg = elg;
        }
    }
    //exp withoupayment calculation
    //  onRtChange(rateWiseDataExp[y.value], 3)
    $scope.RateCalExp = function (val) {
        if (shareData.itmInv.exp_typ == "WPAY") {
            $scope.onRtChange(val, 3);
        }
    }

    // $scope.RateCalSEZWP = function (val) {
    //     if (shareData.itmInv. == "WPAY") {
    //         $scope.onRtChange(val, 3);
    //     }
    // }

    $scope.RateCalCdnr = function (val) {
        if (shareData.itmInv.typ != "EXPWOP") {
            $scope.onRtChange(val, 3);
        }
    }


    //  initItm();

    function initItm() {
        $scope.nwItm = ReturnStructure.getNewItm(tblcd, formName);
    }

    //collecting invoice numbers to display in UI
    $scope.invNum = ReturnStructure.getInvNum(tblcd, $scope.itmList, shareData.dashBoardDt.form);

    //To display hsn_sc or sac in item level a/c to imp_g or imp_s
    $scope.isImpg = function () {
        return (tblcd === "imp_g" || tblcd === "imp_ga") ? true : false;
    }

    $scope.isNewRec = shareData.isNewRec;



    //Formaters
    var formateNodePayload = ReturnStructure.formateNodePayload(tblcd, formName);





    //TO disable igst n cess in case of EXPWOP
    $scope.isWithOutPaymnt = function () {
        if ($scope.itmList) {
            //&& ($scope.itmList.exp_typ || $scope.itmList.typ  ) ) {
            if ($scope.itmList.exp_typ && $scope.itmList.exp_typ === 'WOPAY')
                return true;
            else if ($scope.itmList.typ && $scope.itmList.typ == 'EXPWOP')
                return true;
        }
        return false;

    }

    //Clear already existing values for with pay if he changed to wopay in exp
    $scope.clearValues = function () {
        if (shareData.itmInv.exp_typ == "WOPAY") {
            angular.forEach($scope.rateWiseData, function (obj, key) {
                if (obj.iamt || obj.csamt) {
                    obj.iamt = 0;
                    obj.csamt = 0;
                }
            });
        }
    }

    //To disable tax avialable as itc and itc this month if not eligible

    $scope.isEligible = function (iElg) {
        return (!iElg || iElg == "none") ? true : false;
    }

    //To clear values if eligiblity changed as none
    $scope.elgBltyChange = function (iItm) {
        var elg, iItc;
        if (typeof iItm.itm_det !== 'undefined' && typeof iItm.itm_det !== 'null') {
            elg = iItm.itm_det.elg;
        } else {
            elg = iItm.elg;
        }


        if (iItm.itc) {
            iItc = iItm.itc;
        } else {
            iItc = iItm;
        }
        if (elg == "no" && $scope.isIntraState()) {
            iItc.tx_c = 0.00;
            iItc.tx_s = 0.00;
            iItc.tx_cs = 0.00;
        } else if (elg == "no" && !$scope.isIntraState()) {
            iItc.tx_i = 0.00;
            iItc.tx_cs = 0.00;
        }
    }



    //Add Item - softadd
    $scope.addItem = function () {
        if ($scope.newItmFrm.$valid) {

            if ($scope.nwItm.txval) $scope.nwItm.txval = Number($scope.nwItm.txval);
            var itmLs = (tblcd == "atadj") ? $scope.itmList.doc : $scope.itmList.itms,
                itmLn = itmLs.length,
                newItm = ReturnStructure.getItmNodeStructure(tblcd, $scope.nwItm, itmLn, form);

            if (tblcd == 'atadj' && formName == "GSTR2") {
                $scope.itmList.doc.push(newItm);
            } else {
                $scope.itmList.itms.push(newItm);
            }
            // var itmLs = $scope.itmList.itms,
            //     itmLn = itmLs.length,
            //     newItm = ReturnStructure.getItmNodeStructure(tblcd, $scope.nwItm, itmLn, formName)

            // $scope.itmList.itms.push(newItm);

            $scope.newItmValidtr = false;
            initItm();

        } else {
            $scope.newItmValidtr = true;
        }
    }

    //Delete Item - soft delete
    $scope.deleteSelectedItms = function () {
        var rtArry = [],
            iData = null;
        if (tblcd == "atadj" && formName == "R2") {
            iData = $scope.itmList.doc;
        } else {
            iData = $scope.itmList.itms;
        }
        angular.forEach(iData, function (itm) {
            if (itm.select !== 'Y') {
                rtArry.push(itm);
            }
        });
        iData = angular.copy(rtArry);
        $scope.itmList.itms = angular.copy(rtArry);
        $log.debug("itmctrl -> deleteSelectedRows :: ", $scope.itmList);
        $scope.selectAll = 'N';
    }


    //To add new invoice 
    $scope.savePayload = function () {
        var stdata = angular.copy($scope.itmList);
        R1InvHandler.add($scope, stdata, formateNodePayload);
    }


    $scope.updateSavePayload = function (isNew) {
        
        var totalTaxValue = 0,
            tempObj = {},
            tempArr = [];
        let varIsValidItms = true;
        let iamtHasValue = false;
        if (tblcd == 'b2b' || tblcd == 'b2ba' || tblcd == 'b2cl' || tblcd == 'b2cla' || tblcd == 'b2bur' || tblcd == 'ecomb2b' || tblcd == 'ecomurp2b' || tblcd == 'ecomab2b' || tblcd == 'ecomaurp2b') {
            $scope.rateWiseData.forEach(function (obj, key) {
                tempObj = {};
                if (parseFloat(obj.txval) > 0 && obj.txval) {
                    if (!$scope.intraState) {
                        tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                        tempObj.itm_det = {
                            "txval": parseFloat(obj.txval),
                            "rt": parseFloat(obj.rt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)
                        };
                        if (obj.itc) {
                            tempObj.itc = {
                                "elg": obj.itc.elg,
                                "tx_i": parseFloat(obj.itc.tx_i),
                                "tx_cs": parseFloat(obj.itc.tx_cs)
                            }
                        }

                        totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.iamt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                    } else {
                        if((tblcd == 'b2b' || tblcd == 'b2ba' || tblcd == 'b2cl' || tblcd == 'b2cla' || tblcd == 'b2bur' || tblcd == 'ecomb2b' || tblcd == 'ecomurp2b' || tblcd == 'ecomab2b' || tblcd == 'ecomaurp2b') && obj.camt != obj.samt){
                            $scope.txrate = true;
                        }
                        tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;                    
                        tempObj.itm_det = {
                            "txval": parseFloat(obj.txval),
                            "rt": parseFloat(obj.rt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)
                        };
                        if (obj.itc) {
                            tempObj.itc = {
                                "elg": obj.itc.elg,
                                "tx_c": parseFloat(obj.itc.tx_c),
                                "tx_s": parseFloat(obj.itc.tx_s),
                                "tx_cs": parseFloat(obj.itc.tx_cs)
                            }
                        }
                        totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.camt + tempObj.itm_det.samt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                        
                    }
             //console.log("tempObj",tempObj)
                    tempArr.push(tempObj);
                    //condition for IGST > 0
                    if ($scope.itmList.inv_typ == "SEWP" && parseFloat(obj.iamt) > 0) {
                        iamtHasValue = true;
                    }
                }
            });
            if($scope.txrate == true){
                $scope.createAlert("Error", "Please enter same amount for CGST and SGST", function(){});
                $scope.txrate = false;
                return;
            }
        }
        else if (tblcd == 'exp' || tblcd == 'expa') {
            $scope.rateWiseData.forEach(function (obj, key) {
                if (parseFloat(obj.txval) > 0 && obj.txval) {
                    tempObj = {
                        "txval": parseFloat(obj.txval),
                        "rt": parseFloat(obj.rt),
                        "iamt": parseFloat(obj.iamt),
                        "csamt": parseFloat(obj.csamt)
                    };
                    totalTaxValue += tempObj.txval + tempObj.iamt + tempObj.csamt;
                    tempArr.push(tempObj);
                    if ($scope.itmList.exp_typ == "WPAY" && parseFloat(obj.iamt) > 0) {
                        iamtHasValue = true;
                    }
                }
            });
        }
        else if (tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') {
            $scope.rateWiseData.forEach(function (obj, key) {
                if (!obj.camt && (Math.abs(obj.txval) > 0 || Math.abs(obj.csamt) > 0)) {

                    tempObj = {
                        //"num": parseInt(obj.rt) * 100,
                        "rt": parseFloat(obj.rt),
                        "txval": parseFloat(obj.txval),
                        "iamt": parseFloat(obj.iamt),
                        "csamt": parseFloat(obj.csamt)

                    };
                    tempArr.push(tempObj);
                }
                else if (obj.camt && (Math.abs(obj.txval) > 0 || Math.abs(obj.csamt) > 0)) {
                    if((tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') && obj.camt != obj.samt){
                        $scope.txrate = true;
                    }
                    tempObj = {
                        // "num": parseInt(obj.rt) * 100,
                        "rt": parseFloat(obj.rt),
                        "txval": parseFloat(obj.txval),
                        "camt": parseFloat(obj.camt),
                        "samt": parseFloat(obj.samt),
                        "csamt": parseFloat(obj.csamt)

                    };
                    tempArr.push(tempObj);
                }

            });
            if($scope.txrate == true){
                $scope.createAlert("Error", "Please enter same amount for CGST and SGST", function(){});
                $scope.txrate = false;
                return;
            }
        }
        else if (tblcd == 'at' || tblcd == 'ata') {
            $scope.rateWiseData.forEach(function (obj, key) {
                if (!obj.camt) {

                    tempObj = {
                        //"num": parseInt(obj.rt) * 100,
                        "rt": parseFloat(obj.rt),
                        "ad_amt": parseFloat(obj.ad_amt),
                        "iamt": parseFloat(obj.iamt),
                        "csamt": parseFloat(obj.csamt)

                    };
                    if (tempObj.ad_amt || tempObj.iamt || tempObj.csamt)
                        tempArr.push(tempObj);
                }
                else if (obj.camt) {
                    if((tblcd == 'at' || tblcd == 'ata') && obj.camt != obj.samt){
                        $scope.txrate = true;
                    }
                    tempObj = {
                        // "num": parseInt(obj.rt) * 100,
                        "rt": parseFloat(obj.rt),
                        "ad_amt": parseFloat(obj.ad_amt),
                        "camt": parseFloat(obj.camt),
                        "samt": parseFloat(obj.samt),
                        "csamt": parseFloat(obj.csamt)

                    };
                    if (tempObj.ad_amt || (tempObj.camt && tempObj.samt) || tempObj.csamt)
                        tempArr.push(tempObj);
                }

            });
            varIsValidItms = $scope.fnCheckValidItm(tempArr);
            if($scope.txrate == true){
                $scope.createAlert("Error", "Please enter same amount for CGST and SGST", function(){});
                $scope.txrate = false;
                return;
            }
        }
        else if (tblcd == 'txi') {
            $scope.rateWiseData.forEach(function (obj, key) {
                if (!obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {

                    tempObj = {
                        "rt": parseFloat(obj.rt),
                        //"num": parseInt(obj.rt) * 100,
                        "adamt": parseFloat(obj.adamt),
                        "iamt": parseFloat(obj.iamt),
                        "csamt": parseFloat(obj.csamt)

                    };
                    tempObj.num = tempArr.length + 1;
                    tempArr.push(tempObj);
                }
                else if (obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                    tempObj = {

                        "rt": parseFloat(obj.rt),
                        // "num": parseInt(obj.rt) * 100,
                        "adamt": parseFloat(obj.adamt),
                        "camt": parseFloat(obj.camt),
                        "samt": parseFloat(obj.samt),
                        "csamt": parseFloat(obj.csamt)

                    };
                    tempObj.num = tempArr.length + 1;
                    tempArr.push(tempObj);
                }

            });
        }
        else if (tblcd == 'atadj' || tblcd == 'atadja') {
            if (formName == 'GSTR1') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt && parseFloat(obj.ad_amt) > 0) {

                        tempObj = {
                            // "num" : parseInt(obj.rt)*100,
                            "rt": parseFloat(obj.rt),
                            "ad_amt": parseFloat(obj.ad_amt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempArr.push(tempObj);
                    }
                    else if (obj.camt && parseFloat(obj.ad_amt) > 0) {
                        tempObj = {
                            // "num" : parseInt(obj.rt)*100,
                            "rt": parseFloat(obj.rt),
                            "ad_amt": parseFloat(obj.ad_amt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempArr.push(tempObj);
                    }

                });
            }
            else {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            // "num": parseInt(obj.rt) * 100,
                            "adamt": parseFloat(obj.adamt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempObj.num = tempArr.length + 1;
                        tempArr.push(tempObj);
                    }
                    else if (obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                        tempObj = {

                            "rt": parseFloat(obj.rt),
                            // "num": parseInt(obj.rt) * 100,
                            "adamt": parseFloat(obj.adamt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempObj.num = tempArr.length + 1;
                        tempArr.push(tempObj);
                    }

                });
            }

        }
        else if (tblcd == 'imp_g' || tblcd == 'imp_s') {
            $scope.rateWiseData.forEach(function (obj, key) {
                if (parseFloat(obj.txval) > 0 && obj.txval) {


                    tempObj = {
                        "txval": parseFloat(obj.txval),
                        "rt": parseFloat(obj.rt),
                        "iamt": parseFloat(obj.iamt),
                        "csamt": parseFloat(obj.csamt)
                    };
                    if (obj.itc && tempObj.elg) {
                        tempObj.elg = obj.itc.elg;
                        tempObj.tx_i = parseFloat(obj.itc.tx_i);
                        tempObj.tx_cs = parseFloat(obj.itc.tx_cs)
                    } else {
                        tempObj.elg = obj.elg;
                        tempObj.tx_i = parseFloat(obj.tx_i);
                        tempObj.tx_cs = parseFloat(obj.tx_cs)
                    }


                    tempObj.num = tempArr.length + 1;


                    totalTaxValue += tempObj.txval + tempObj.iamt + ((isNaN(tempObj.csamt)) ? 0 : parseFloat(tempObj.csamt));
                    tempArr.push(tempObj);

                }
            });
        }
        else if (tblcd == "cdnr" || tblcd == "cdnra" || tblcd == "cdnur" || tblcd == "cdnura") {
            $scope.rateWiseData.forEach(function (obj, key) {
                tempObj = {};
                tempObj.itm_det = {
                    "txval": parseFloat(obj.txval),
                    "rt": parseFloat(obj.rt),
                    "csamt": parseFloat(obj.csamt)
                };
                if (!$scope.intraState) {
                    tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                    tempObj.itm_det.iamt = parseFloat(obj.iamt);
                    if (obj.itc) {
                        tempObj.itc = {
                            "elg": obj.itc.elg,
                            "tx_i": parseFloat(obj.itc.tx_i),
                            "tx_cs": parseFloat(obj.itc.tx_cs)
                        }
                    }

                    totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.iamt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                } else {
                    tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                    tempObj.itm_det.camt = parseFloat(obj.camt);
                    tempObj.itm_det.samt = parseFloat(obj.samt);
                    if (obj.itc) {
                        tempObj.itc = {
                            "elg": obj.itc.elg,
                            "tx_c": parseFloat(obj.itc.tx_c),
                            "tx_s": parseFloat(obj.itc.tx_s),
                            "tx_cs": parseFloat(obj.itc.tx_cs)
                        }
                    }
                    totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.camt + tempObj.itm_det.samt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                }
                if (tempObj.itm_det.txval || tempObj.itm_det.iamt || (tempObj.itm_det.camt && tempObj.itm_det.samt))
                    tempArr.push(tempObj);

                if (($scope.itmList.inv_typ == "SEWP" || $scope.itmList.typ == "EXPWP") && parseFloat(obj.iamt) > 0) {
                    iamtHasValue = true;
                }

            });
        }
        var dF = $scope.itmList.diff_percent;
        if (dF != null && typeof dF != 'undefined' && typeof dF.value != 'undefined') {
            $scope.itmList.diff_percent = dF.value;
        }
         var sR = $scope.itmList.supplierRecipientName;
         if (sR != null  && typeof sR != 'undefined' && typeof sR.value != 'undefined') {
            $scope.itmList.supplierRecipientName = sR.value;
         }
        //  var sR = $scope.itmList.productName;
        //  if (sR != null  && typeof sR != 'undefined' && typeof sR.value != 'undefined') {
        //     $scope.itmList.productName = sR.value;
        //  }
        $scope.itmList.itms = tempArr;
        if (tblcd.endsWith('a') && tempArr.length == 0 && tblcd != "cdnura" && tblcd != "cdnra" && tblcd != "ata" && !(tblcd == "expa" && $scope.itmList.exp_typ == "WPAY") && !(tblcd == "b2ba" && $scope.itmList.inv_typ == "SEWP")) {
            var dfltItmObj = defaultItemInit(tblcd);
            $scope.itmList.itms.push(dfltItmObj);
        }
        if (varIsValidItms) {
            if ($scope.itmList.itms.length > 0 && !iamtHasValue && ($scope.itmList.inv_typ == "SEWP" || $scope.itmList.exp_typ == "WPAY" || $scope.itmList.typ == "EXPWP")) {
                $scope.createAlert("ErrorCallback", "Please enter some value in IGST tax amount field", function () {

                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            } else {
                if (isNew === "N") {
                    $scope.updatePayload();
                } else {

                    $scope.savePayload();
                }
            }
        } else {
            $scope.createAlert("ErrorCallback", "Item details provided are invalid. Please add correct item details and try again.", function () {

                if ($scope.initSumryList)
                    $scope.initSumryList();
            });
        }

    };
    //To Update Invoice
    $scope.updatePayload = function () {

        var stdata = angular.copy($scope.itmList);

        var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tblcd, stdata, formName);

        // if ($scope.newRecord == 'Y' || tblcd === "hsn" || tblcd === "b2cs" || tblcd === "b2csa")
        //     R1InvHandler.update($scope, stdata, updatedNodeDetails, formateNodePayload, true);
        // else
        R1InvHandler.update($scope, stdata, updatedNodeDetails, formateNodePayload);

    };

}]);


//gstr1 doc_issued controller
myApp.controller("docissuedctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util',
    function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util) {

        var tableCode = null,
            formName = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.doclist = [];
        $scope.editFlag = false;

        $scope.newInvValidtr = false;
        $scope.isDocsDeleted = false;

        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = $scope.dashBoardDt.form;
            initNewInvRow();
            initSumryListfordoc();

        }



        //To init new invoice row
        function initNewInvRow() {
            $scope.newRw =
            {
                "num": null,
                "to": null,
                "from": null,
                "totnum": null,
                "cancel": null,
                "net_issue": null
            }

        };



        // CHANGES BY V START
        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;
            initSumryListfordoc();
        };

        // var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, formName),

        var formateNodePayload = ReturnStructure.formateNodePayload(tableCode, formName),
            getInv = ReturnStructure.getInv(tableCode, formName),
            getItm = ReturnStructure.getItm(tableCode, formName),
            getInvKey = ReturnStructure.getInvKey(tableCode, formName);



        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryListfordoc();
        });


        //doc functionality
        $scope.docss = [];
        $scope.onSectionChange = function (iType) {
            $scope.docTypeSelected = iType;
            initSumryListfordoc();
            initNewInvRow();
        }

        function initSumryListfordoc() {

            var data = [];
            g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.dashBoardDt.tbl_cd).then(function (response) {
                response = response.doc_det;
                for (var i = 0; i < response.length; i++) {
                    if ($scope.docTypeSelected === response[i].doc_typ) {
                        data = response[i];
                        break;
                    }
                }
                $scope.doclist = data;

                $log.debug("docissuedctrl -> initSumryList success:: ", response);

            }, function (response) {
                $scope.doclist = [];
                $log.debug("docissuedctrl -> initSumryList fail:: ", response);
            });
        }

        $scope.initSumryList = initSumryListfordoc;


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

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [],
                updatedNodeDetails = {};

            angular.forEach($scope.doclist.docs, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    updatedNodeDetails = {
                        doc_typ: $scope.docTypeSelected,
                        doc_num: $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                        num: inv.num
                    }
                    invdltArray.push(updatedNodeDetails);
                }
            });
            if (invdltArray.length > 0) {
                $scope.createAlert("Warning", "Are you sure to delete selected rows?", function () {
                    R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                        $scope.doclist.docs = angular.copy(response);
                        $scope.selectAll = 'N';
                        // $scope.isDocsDeleted = true;
                    });
                });

            } else {
                $scope.createAlert("WarningOk", "Do select at least one item.", function () { });
            }
        }

        //To add new document for particular nature of document
        $scope.addDetails = function () {
            var docData = angular.copy($scope.newRw);
            if ($scope.newInvFrm.$valid) {
                if ($scope.doclist.docs) {
                    docData.num = $scope.doclist.docs.length + 1;
                    $scope.doclist.docs.push(docData);
                }
                else {
                    docData.num = 1;
                    var newDoc = {
                        "doc_num": $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                        "doc_typ": $scope.docTypeSelected,
                        "docs": []
                    }
                    newDoc.docs.push(docData);
                    $scope.doclist = newDoc;
                }
                $scope.newInvFrm.$dirty = false;
                $scope.saveDocSumryList($scope.newInvFrm);
                initNewInvRow();
                $scope.newInvValidtr = false;
            }
            else {
                $scope.newInvValidtr = true;
            }

        };

        $scope.autoCalDoc = function (y, frm) {
            var frmName = (frm) ? frm : $scope.newInvFrm
            var tot = parseInt(y.totnum),
                cancel = parseInt(y.cancel),
                isValidCancelledDocs = true;
            if (tot >= cancel) {
                y.net_issue = tot - cancel;
            }
            else {
                y.net_issue = null;
                isValidCancelledDocs = false;
                //$scope.docErrMsg = "Cancelled docs can not be greater than total docs";

            }
            frmName.cancel.$setValidity('cancel', isValidCancelledDocs);

        }

        $scope.convertStrToNum = function (iObj, iKey) {
            if (iObj[iKey])
                iObj[iKey] = parseInt(iObj[iKey]);

        }

        $scope.delDoc = function (index) {
            $scope.destroyModal();
            $scope.doclist.docs.splice(index, 1);
            for (var i = 0; i < $scope.doclist.docs.length; i++) {
                $scope.doclist.docs[i].num = i + 1;
            }
            $scope.isDocsDeleted = true;
        }

        $scope.getdoclabels = function () {
            $scope.docDetails = [];
            $scope.docDetails = ["Invoices for outward supply",
                "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", "Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];

            $scope.docTypeSelected = $scope.docDetails[0];
        }

        //To update Invoices at level1
        $scope.updateDocSumryList = function (iForm) {
            var isValid = iForm.$valid;
            if (isValid) {
                var stdata = angular.copy($scope.doclist);
                // updatedNodeDetails = {
                //     doc_typ: $scope.docTypeSelected,
                //     doc_num: $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                // };
                R1InvHandler.emptyItemUpdate($scope, null, stdata, null);

            }

        }

        //end of 
        $scope.saveDocSumryList = function (iForm) {
            // var isValid = ($scope.isDocsDeleted) ? true : $scope.docPage.invFrm.$valid
            var isValid = iForm.$valid
            if (isValid) {
                var stdata = angular.copy($scope.doclist);

                //  if (stdata.docs.length) {
                R1InvHandler.emptyItemAdd($scope, stdata, null);
                // }
                // else {
                //     $scope.createAlert("WarningOk", "Please add at least one document.", function () { });
                // }
            }
            else {
                $scope.editFlag = true;
            }
        }

    }
]);

myApp.controller("errordocissuedctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util',
    function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util) {

        var tableCode = null,
            formName = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.doclist = [];
        $scope.editFlag = false;

        $scope.newInvValidtr = false;
        $scope.isDocsDeleted = false;

        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/error/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = $scope.dashBoardDt.form;
            //  initNewInvRow();
            initSumryListfordoc();

        }



        //To init new invoice row
        function initNewInvRow() {
            $scope.newRw =
            {
                "num": null,
                "to": null,
                "from": null,
                "totnum": null,
                "cancel": null,
                "net_issue": null
            }

        };



        // CHANGES BY V START
        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;
            initSumryListfordoc();
        };





        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryListfordoc();
        });


        //doc functionality
        $scope.docss = [];
        $scope.onSectionChange = function (iType) {
            $scope.docTypeSelected = iType;
            initSumryListfordoc();
            // initNewInvRow();
        }

        function initSumryListfordoc() {

            var data = [];
            g1FileHandler.getErrorContentsFor($scope.dashBoardDt, $scope.dashBoardDt.tbl_cd).then(function (response) {
                response = response.doc_det;

                if (response.error_msg || response.error_cd) {
                    $scope.error_msg = response.error_msg;
                    $scope.error_cd = response.error_cd;
                }
                delete response.error_msg;
                delete response.error_cd;

                for (var i = 0; i < response.length; i++) {
                    if ($scope.docTypeSelected === response[i].doc_typ) {
                        data = response[i];
                        break;
                    }
                }
                $scope.doclist = data;

                $log.debug("docissuedctrl -> initSumryList success:: ", response);

            }, function (response) {
                $scope.doclist = [];
                $log.debug("docissuedctrl -> initSumryList fail:: ", response);
            });
        }

        $scope.initSumryList = initSumryListfordoc;


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

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [],
                updatedNodeDetails = {};

            angular.forEach($scope.doclist.docs, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    updatedNodeDetails = {
                        doc_typ: $scope.docTypeSelected,
                        doc_num: $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                        num: inv.num
                    }
                    invdltArray.push(updatedNodeDetails);
                }
            });
            if (invdltArray.length > 0) {
                $scope.createAlert("Warning", "Are you sure to delete selected rows?", function () {
                    R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                        $scope.doclist.docs = angular.copy(response);
                        $scope.selectAll = 'N';
                        // $scope.isDocsDeleted = true;
                    });
                });

            } else {
                $scope.createAlert("WarningOk", "Do select at least one item.", function () { });
            }
        }

        //To add new document for particular nature of document
        $scope.addDetails = function () {
            var docData = angular.copy($scope.newRw);
            if ($scope.newInvFrm.$valid) {
                if ($scope.doclist.docs) {
                    docData.num = $scope.doclist.docs.length + 1;
                    $scope.doclist.docs.push(docData);
                }
                else {
                    docData.num = 1;
                    var newDoc = {
                        "doc_num": $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                        "doc_typ": $scope.docTypeSelected,
                        "docs": []
                    }
                    newDoc.docs.push(docData);
                    $scope.doclist = newDoc;
                }
                $scope.newInvFrm.$dirty = false;
                $scope.saveDocSumryList($scope.newInvFrm);
                initNewInvRow();
                $scope.newInvValidtr = false;
            }
            else {
                $scope.newInvValidtr = true;
            }

        };

        $scope.autoCalDoc = function (y, frm) {
            var frmName = (frm) ? frm : $scope.newInvFrm
            var tot = parseInt(y.totnum),
                cancel = parseInt(y.cancel),
                isValidCancelledDocs = true;
            if (tot >= cancel) {
                y.net_issue = tot - cancel;
            }
            else {
                y.net_issue = null;
                isValidCancelledDocs = false;
                //$scope.docErrMsg = "Cancelled docs can not be greater than total docs";

            }
            frmName.cancel.$setValidity('cancel', isValidCancelledDocs);

        }

        $scope.convertStrToNum = function (iObj, iKey) {
            if (iObj[iKey])
                iObj[iKey] = parseInt(iObj[iKey]);

        }

        $scope.delDoc = function (index) {
            $scope.destroyModal();
            $scope.doclist.docs.splice(index, 1);
            for (var i = 0; i < $scope.doclist.docs.length; i++) {
                $scope.doclist.docs[i].num = i + 1;
            }
            $scope.isDocsDeleted = true;
        }

        $scope.getdoclabels = function () {
            $scope.docDetails = [];
            $scope.docDetails = ["Invoices for outward supply",
                "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", "Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];

            $scope.docTypeSelected = $scope.docDetails[0];
        }

        //end of 
        $scope.saveDocSumryList = function (iForm) {
            // var isValid = ($scope.isDocsDeleted) ? true : $scope.docPage.invFrm.$valid
            var isValid = iForm.$valid
            if (isValid) {
                var stdata = angular.copy($scope.doclist);

                //  if (stdata.docs.length) {
                R1InvHandler.emptyItemUpdateErrorPayload($scope, stdata, null);
                // }
                // else {
                //     $scope.createAlert("WarningOk", "Please add at least one document.", function () { });
                // }
            }
            else {
                $scope.editFlag = true;
            }
        }

    }
]);

//gstr1 doc_issued controller
myApp.controller("uploaddocissuedctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util',
    function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util) {

        var tableCode = null,
            formName = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.doclist = [];
        $scope.editFlag = false;

        $scope.newInvValidtr = false;
        $scope.isDocsDeleted = false;

        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/upload/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = $scope.dashBoardDt.form;
            initNewInvRow();
            initSumryListfordoc();

        }



        //To init new invoice row
        function initNewInvRow() {
            $scope.newRw =
            {
                "num": null,
                "to": null,
                "from": null,
                "totnum": null,
                "cancel": null,
                "net_issue": null
            }

        };



        // CHANGES BY V START
        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;
            initSumryListfordoc();
        };

        // var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, formName),

        var formateNodePayload = ReturnStructure.formateNodePayload(tableCode, formName),
            getInv = ReturnStructure.getInv(tableCode, formName),
            getItm = ReturnStructure.getItm(tableCode, formName),
            getInvKey = ReturnStructure.getInvKey(tableCode, formName);



        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryListfordoc();
        });


        //doc functionality
        $scope.docss = [];
        $scope.onSectionChange = function (iType) {
            $scope.docTypeSelected = iType;
            initSumryListfordoc();
            initNewInvRow();
        }

        function initSumryListfordoc() {

            var data = [];
            g1FileHandler.getContentsForPaged(
                $scope.dashBoardDt,
                tableCode,
                shareData.pageNum,
                $scope.dashBoardDt.form,
                shareData,
                shareData.filter_val,
                $scope.sortBy,
                $scope.sortReverse,
                'FL2', // to identify second flow, 
                true //  file name will be provided, DO NOT RE_CREATE
            ).then(function (response) {
                response = response.doc_det;
                var docDetails = ["Invoices for outward supply",
                    "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", "Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];

                for (var i = 0; i < response.length; i++) {

                    //if ($scope.docTypeSelected === response[i].doc_typ) {
                    if (docDetails.indexOf($scope.docTypeSelected) + 1 == response[i].doc_num) {
                        data = response[i];
                        break;
                    }
                }
                $scope.doclist = data;

                $log.debug("docissuedctrl -> initSumryList success:: ", response);

            }, function (response) {
                $scope.doclist = [];
                $log.debug("docissuedctrl -> initSumryList fail:: ", response);
            });
        }

        $scope.initSumryList = initSumryListfordoc;

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

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [],
                updatedNodeDetails = {};

            angular.forEach($scope.doclist.docs, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    updatedNodeDetails = {
                        doc_typ: $scope.docTypeSelected,
                        doc_num: $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                        num: inv.num
                    }
                    invdltArray.push(updatedNodeDetails);
                }
            });
            if (invdltArray.length > 0) {
                $scope.createAlert("Warning", "Are you sure to delete selected rows?", function () {
                    R1InvHandler.uploadSetDeleteOrDelete($scope, rtArry, invdltArray).then(function (response) {
                        $scope.doclist.docs = angular.copy(response);
                        $scope.selectAll = 'N';
                        // $scope.isDocsDeleted = true;
                    });
                });

            } else {
                $scope.createAlert("WarningOk", "Do select at least one item.", function () { });
            }
        }

        //To add new document for particular nature of document
        $scope.addDetails = function () {
            var docData = angular.copy($scope.newRw);
            if ($scope.newInvFrm.$valid) {
                if ($scope.doclist.docs) {
                    docData.num = $scope.doclist.docs.length + 1;
                    $scope.doclist.docs.push(docData);
                }
                else {
                    docData.num = 1;
                    var newDoc = {
                        "doc_num": $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                        // "doc_typ": $scope.docTypeSelected,
                        "docs": []
                    }
                    newDoc.docs.push(docData);
                    $scope.doclist = newDoc;
                }
                $scope.newInvFrm.$dirty = false;
                $scope.saveDocSumryList($scope.newInvFrm);
                initNewInvRow();
                $scope.newInvValidtr = false;
            }
            else {
                $scope.newInvValidtr = true;
            }

        };

        $scope.autoCalDoc = function (y, frm) {
            var frmName = (frm) ? frm : $scope.newInvFrm
            var tot = parseInt(y.totnum),
                cancel = parseInt(y.cancel),
                isValidCancelledDocs = true;
            if (tot >= cancel) {
                y.net_issue = tot - cancel;
            }
            else {
                y.net_issue = null;
                isValidCancelledDocs = false;
                //$scope.docErrMsg = "Cancelled docs can not be greater than total docs";

            }
            frmName.cancel.$setValidity('cancel', isValidCancelledDocs);

        }

        $scope.convertStrToNum = function (iObj, iKey) {
            if (iObj[iKey])
                iObj[iKey] = parseInt(iObj[iKey]);

        }

        $scope.delDoc = function (index) {
            $scope.destroyModal();
            $scope.doclist.docs.splice(index, 1);
            for (var i = 0; i < $scope.doclist.docs.length; i++) {
                $scope.doclist.docs[i].num = i + 1;
            }
            $scope.isDocsDeleted = true;
        }

        $scope.getdoclabels = function () {
            $scope.docDetails = [];
            $scope.docDetails = ["Invoices for outward supply",
                "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", " Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];

            $scope.docTypeSelected = $scope.docDetails[0];
        }

        //To update Invoices at level1
        $scope.updateDocSumryList = function (iForm) {
            var isValid = iForm.$valid;
            if (isValid) {
                var stdata = angular.copy($scope.doclist);
                // updatedNodeDetails = {
                //     doc_typ: $scope.docTypeSelected,
                //     doc_num: $scope.docDetails.indexOf($scope.docTypeSelected) + 1,
                // };
                R1InvHandler.emptyItemUploadPayloadUpdate($scope, null, stdata, null);

            }

        }

        //end of 
        $scope.saveDocSumryList = function (iForm) {
            // var isValid = ($scope.isDocsDeleted) ? true : $scope.docPage.invFrm.$valid
            var isValid = iForm.$valid
            if (isValid) {
                var stdata = angular.copy($scope.doclist);

                //  if (stdata.docs.length) {
                R1InvHandler.emptyItemUploadAdd($scope, stdata, null);
                // }
                // else {
                //     $scope.createAlert("WarningOk", "Please add at least one document.", function () { });
                // }
            }
            else {
                $scope.editFlag = true;
            }
        }

    }
]);

/* Receiver controller for GSTR1 */
myApp.controller("uploadgstr1ctrl", ['$scope', '$filter', '$http', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util', '$rootScope',
    function ($scope, $filter, $http, shareData, g1FileHandler, $log, NgTableParams, $timeout, R1InvHandler, ReturnStructure, R1Util, $rootScope) {

        var tableCode = null,
            form = null,
            formName=null,
            isSezTaxpayer,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.TaxPayerSummaryList = [];
        $scope.isNewRec = true;
        $scope.newInvValidtr = false;
        $scope.newInvRw = null;
        $scope.isLoaded = false;
        $scope.years = null;
        $scope.monthList = null;
        $scope.totalAvailable = 0;
        $scope.showOldUI = false;
        $scope.isHsnSelected = false;
        $scope.hsnsaveedit = false;
        $scope.minYearsAllowed = "4";
        $scope.minCodeLengthToDisplay = "2";
        $scope.err_msg_hsn = "Length should be between 2-8";
        $scope.disableHSNRestrictions = shareData.disableHSNRestrictions;
        $scope.productName = "";
        
        $scope.ReturnsList = [];
        shareData.isNewRec = true;
        $scope.newInvValidtr = false;
        $scope.newInvRw = null;
        $scope.years = null;
        $scope.monthList = null;
        $scope.totalAvailable = 0;
        $scope.showOldUI = false;
        var compareList = [];
        $scope.HSNList = null;
        $scope.isHsnSelected = false;
        $scope.hsnsaveedit = false;
        $scope.minYearsAllowed = "4";
        $scope.minCodeLengthToDisplay = "2";
        $scope.err_msg_hsn = "Length should be between 2-8";
        $scope.disableHSNRestrictions = shareData.disableHSNRestrictions;
        $scope.suprecFrm ={};
        $scope.supplierRecipientName = "";
        $scope.productName = "";
        $scope.sameGstin = false;
        $scope.newsuprecmstr = false;
        $scope.duprecord = false;
        $scope.validator = false;
        $scope.suprecmstr = [];
        $scope.savemstr = [];

        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            
            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = $scope.dashBoardDt.form;
            $scope.years = shareData.yearsList;//In B2CSA we need yearsList list
            $scope.monthList = shareData.curFyMonths; //In B2CSA we need FY month list
            b2clValCheck();
            initNewInvRow();
            initSumryList();
        }
        if (!shareData.disableAATOLengthCheck) {
        
            if (shareData.aatoGreaterThan5CR) {
               $scope.minCodeLengthToDisplay = shareData.HSN_DROPDOWN_LGTH_AATO_GRTR_5CR;
               $scope.minhsnlengthvalidation = shareData.HSN_VALIDATION_AATO_GRTR_5CR_MIN_LGTH;
            }
           else {
               $scope.minCodeLengthToDisplay = shareData.HSN_DROPDOWN_LGTH_AATO_LESS_5CR;
               $scope.minhsnlengthvalidation = shareData.HSN_VALIDATION_AATO_LESS_5CR_MIN_LGTH;
           }
       }
       
        function getDate(retprd) {
            var a = '01/' + retprd.substring(0, 2) + '/' + retprd.substring(2);
            return a;
        };
        shareData.HSN_BIFURCATION_START_DATE = "052025";
        shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
        $scope.showHSNTabs= shareData.showHSNTabs;

       $scope.checkHSNInput = function (resultList,hsn, form) {
        $scope.invalidHSN = false;
        $scope.invalidHsnLength = false;
		$scope.minlengthErr = false;
        if (shareData.disableHSNRestrictions) {
            if (hsn && hsn.length >= 2) {
                var pattern = new RegExp("^\\d{2,8}$");
                var isNumeric = new RegExp("^\\d{9,}$");
                if (pattern.test(hsn)) {
                    if($scope.disableAATOLengthCheck){
                        $scope.isHsnSelected = true;
                        $scope.hsnsaveedit = true;
                      
                    }
                    else{
                      
                        $scope.hsnsaveedit = $scope.isHsnSelected = (hsn.length >= $scope.minhsnlengthvalidation ) ? true : false;
                        $scope.invalidHSNLengthAATO = (hsn.length >= $scope.minhsnlengthvalidation ) ? false : true;
                        $scope.aatoErrMsg = "Enter minimum " + $scope.minhsnlengthvalidation + " digits of HSN code";
                      
                    }
                   if(resultList && !$scope.invalidHSNLengthAATO){
                    $scope.hsnNotfromMstr = "HSN not present in GST HSN Master";
                        for(let i in resultList){
                            localStorage.setItem('description',resultList[i].n);
                            if(hsn == resultList[i].c){
                                $scope.hsnNotfromMstr =null;
                                break;
                            }
                        }
                    }
                }
                else if (isNumeric.test(hsn)) {
                    $scope.invalidHsnLength = true;
                }
                else {
                    $scope.invalidHSN = true;
                }
            }
			else if(hsn && hsn.length<2 && hsn.length!=0){
                $scope.isHsnSelected = false;
                $scope.minlengthErr = true;
            }
        }
      
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

        $scope.onHSNchange = function () {
            $scope.invalidHSN = false;
            $scope.invalidHsnLength = false;
            $scope.invalidHSNLengthAATO = false;
            $scope.hsnNotfromMstr =null;
			$scope.minlengthErr = false;
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
            $scope.years = shareData.yearsList;
            isSezTaxpayer = shareData.isSezTaxpayer;
            $scope.showOldUI = R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value);

            // //  $scope.isUploadFlag = shareData.isUploadFlag;

            initNewInvRow();
            initSumryList();
        }

        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryList();
        });


        $scope.hideaddBtn = false;
        $scope.rmlengthvalidation = false;
        $scope.afterHACselecthsnOutward = function (result) {
            let prodDesc = result.n;
            if(prodDesc == undefined)
            {
                prodDesc = result.productDescription;
            }
            localStorage.setItem('description',prodDesc);
            let hsn = result.hsn ? result.hsn : result.c
            $scope.invalidHSNLengthAATO = hsn.length >= $scope.minhsnlengthvalidation ? false : true;
            $scope.aatoErrMsg = "Enter minimum " + $scope.minhsnlengthvalidation + " digits of HSN code";
            if($scope.invalidHSNLengthAATO){
                return;
            }
            $scope.newInvRw.hsn_sc = result.hsn ? result.hsn : result.c;
            $scope.newInvRw.desc = result.productDescription ? result.productDescription : result.n;
            $scope.newInvRw.productName = result.productName ? result.productName : null;
            $scope.newInvRw.uqc = result.uqc ? result.uqc : null;
            $scope.newInvRw.rt = (typeof result.igst === "number") ? result.igst.toString(): null;
            console.log("result",result)
            $scope.isHsnSelected = true;
            $scope.hsnsaveedit = true;
            $scope.isExistingHsnUqcRate(1, $scope.newInvRw.rt, $scope.newInvRw.hsn_sc, $scope.newInvRw.uqc)
            
           }

        $scope.comparisonofMaster = function () {
            // $scope.getDesc = sessionStorage.getItem('description');
            if(!sessionStorage.getItem('supRecipGstin')){
                if ($scope.newInvRw.hsn_sc && $scope.newInvRw.hsn_sc.length>=4 && $scope.newInvRw.hsn_sc != null && $scope.newInvRw.uqc != null && $scope.newInvRw.rt != null){
                    $scope.hideaddBtn = true;
                } 
                return;
            }

            $scope.productData = JSON.parse(sessionStorage.getItem('supRecipGstin')).productsMasters;
            // console.log($scope.getDesc);
            if ($scope.newInvRw.hsn_sc.length >= 4  && $scope.newInvRw.hsn_sc != null && $scope.newInvRw.uqc != null && $scope.newInvRw.rt != null) {
                if ($scope.productData.length == 0) {
                    ($scope.newInvRw.hsn_sc.length >= 4 && $scope.hsnNotfromMstr==null) ?  $scope.hideaddBtn = true :  $scope.hideaddBtn = false;  
                }
                else {
                    var lengtofProData = $scope.productData.length;
                    var count = 0;
                    
                    for (let i = 0; i < lengtofProData; i++) {
                        if ($scope.productData[i].hsn == $scope.newInvRw.hsn_sc && $scope.productData[i].uqc == $scope.newInvRw.uqc && $scope.productData[i].igst == $scope.newInvRw.rt) {
                            // $scope.newInvRw.productName = $scope.productData[i].productName;
                            
                            $scope.hideaddBtn = false;
                            count += 1;
                    } 
                        
                        if($scope.hsnNotfromMstr != null){
                            $scope.hideaddBtn = false;   
                        }
                    }
                    if (count!=1) {
                        // $scope.newInvRw.productName = null;
                        // $scope.hideaddBtn = (count<1) ? true: false;
                            if($scope.newInvRw.hsn_sc.length>=4 && count<1){
                                $scope.hideaddBtn = true;
                            }
                            else{
                                $scope.hideaddBtn = false;
                            }
                        
                    }
                    
                }
            }
        }

        $scope.checkForServiceHSN = function (hsn, frm) {
            if (String(hsn).substring(0, 2) == "99") {
                frm.uqc = "NA";
                frm.qty = 0;
                return true;
            }
            return false;
        }

        $scope.checkNA = function (uqc) {
            if (uqc == "NA") {
                return true;
            }
            return false;
        }
        //14/14A-15/15A CR-23892
       
        $scope.getNotAddedTb14GSTIN = function(etin){
            $scope.onEtinChange(etin);
            $scope.isEtinAsSuppGstn(1,etin);
            if ((etin && etin.length==15 && !$scope.showDropdown) && (!$scope.isDiffEtin && $scope.validGstin)) {
                $scope.gstinRecordAdd = true;
            }else if(etin && etin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.onEtinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.etin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.etin.$setValidity('pattern', $scope.validGstin);
        }
        
        $scope.isEtinAsSuppGstn = function (isNew, etin, frm){
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var pattern = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/;
            $scope.isDiffEtin = false;
            if(etin != null && etin != undefined){
            if($scope.dashBoardDt.gstin == etin.toUpperCase()){
                $scope.etinmsg = 'ECO GSTIN needs to be different from Supplier GSTIN.';
                $scope.isDiffEtin = true;
            }
            else if($scope.newInvRw.etin && ($scope.newInvRw.nat_supp == 'clttx' || $scope.newInvRw.nat_supp == 'clttxa') && pattern.test(etin) == false){
                $scope.etinmsg = 'Please enter a GSTIN of TCS taxpayer.';
                $scope.isDiffEtin = true;
            }
            if (frmName.etin) {
                frmName.etin.$setValidity('etin', !$scope.isDiffEtin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.getNotAddedTb14AGSTIN = function(oetin){
            $scope.onOEtinChange(oetin);
            $scope.isOEtinAsSuppGstn(1,oetin);
            if ((oetin && oetin.length==15 && !$scope.showDropdown) && (!$scope.isDiffEtin && $scope.validGstin)) {
                $scope.gstinRecordAdd = true;
            }else if(oetin && oetin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 
        }

        $scope.onOEtinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.oetin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.oetin.$setValidity('pattern', $scope.validGstin);
        }
        
        $scope.isOEtinAsSuppGstn = function (isNew, oetin, frm){
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var pattern = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/;
            $scope.isDiffEtin = false;
            if(oetin != null && oetin != undefined){
            if($scope.dashBoardDt.gstin == oetin.toUpperCase()){
                $scope.oetinmsg = 'ECO GSTIN needs to be different from Supplier GSTIN.';
                $scope.isDiffEtin = true;
            }
            else if($scope.newInvRw.oetin && $scope.newInvRw.nat_supp == 'clttxa' && pattern.test(oetin) == false){
                $scope.oetinmsg = 'Please enter a GSTIN of TCS taxpayer.';
                $scope.isDiffEtin = true;
            }
            if (frmName.oetin) {
                frmName.oetin.$setValidity('oetin', !$scope.isDiffEtin);
            }
            $scope.gstinRecordAdd = false;
        }}
        $scope.getNotAddedTb15B2C = function (stin) {
            $scope.onSuppGstinChange(stin);
            $scope.getPosBasedOnStin($scope.newInvRw);
            $scope.isSupStinAsEcomGstn(1, stin);
            if ((stin && stin.length == 15 && !$scope.showDropdown) && (!$scope.isDiffStin && $scope.validGstin)) {

                $scope.gstinRecordAdd = true;
            } else if (stin && stin.length != 0 && !$scope.showDropdown) {
                $scope.gstinRecordAdd = false;
                $scope.showDropdown = false;
            }
        }
        $scope.getNotAddedTb15C2B = function (rtin) {
            $scope.onRtinChange(rtin);
            $scope.getPosBasedOnRtin($scope.newInvRw);
            $scope.isRtinAsEcomGstn(1, rtin);
            if ((rtin && rtin.length == 15 && !$scope.showDropdown) && (!$scope.isDiffRtin && $scope.validGstin)) {

                $scope.gstinRecordAdd = true;
            } else if (rtin && rtin.length != 0 && !$scope.showDropdown) {
                $scope.gstinRecordAdd = false;
                $scope.showDropdown = false;
            }
        }
        $scope.getNotAddedTb15GSTIN = function (rtin) {
            $scope.onRtinChange(rtin);
            $scope.getPosBasedOnRtin($scope.newInvRw);
            $scope.isRecRtinAsEcomGstn(1, rtin);
            if ((rtin && rtin.length == 15 && !$scope.showDropdown) && (!$scope.isDiffRtin && $scope.validGstin)) {

                $scope.gstinRecordAdd = true;
            } else if (rtin && rtin.length != 0 && !$scope.showDropdown) {
                $scope.gstinRecordAdd = false;
                $scope.showDropdown = false;
            }
        }
                       
        $scope.showAutocomplete = true;
        $scope.resetDirective = function (isReset) {
            if (isReset == 'Y') {
                $scope.showAutocomplete = false;
            } else {
                $scope.showAutocomplete = true;
            }
        }
        $scope.update14CGST = function(y){
            if(y)
            y.cgst = y.sgst;
            else
            $scope.newInvRw.cgst = $scope.newInvRw.sgst;
        };

        $scope.update14SGST = function(y){
            if(y)
            y.sgst = y.cgst;
            else
            $scope.newInvRw.sgst = $scope.newInvRw.cgst;
        };
        $scope.clearHSNInput = function () {
            $scope.isHsnSelected = false;
            $scope.newInvRw.desc = null;
            $scope.newInvRw.user_desc = null;
            $scope.hsnsaveedit = false;
            $scope.newInvRw.uqc = null;
            $scope.newInvRw.rt = null;
            $scope.newInvRw.productName = null;
            $scope.hsnNotfromMstr =null;
            $scope.hideaddBtn = false;
            $scope.newInvRw.txval = 0;
            $scope.newInvRw.qty = 0;
            $scope.newInvRw.iamt = 0;
            $scope.newInvRw.samt = 0;
            $scope.newInvRw.camt = 0;
            $scope.newInvRw.csamt = 0;
            $scope.newInvValidtr = false;
			 $scope.minlengthErr = false;
             $scope.newInvRw.hsn_sc=null;
            $scope.newInvFrm.hsn_sc.$setValidity('duplicate', true);
            $scope.newInvFrm.uqc.$setValidity('duplicate', true);
        }

        //To init new invoice row
        function initNewInvRow() {
            $scope.newInvRw = ReturnStructure.getNewInv(tableCode, form);

        }
        if (shareData.dashBoardDt.tbl_cd == "b2cs" || shareData.dashBoardDt.tbl_cd == "b2csa" || shareData.dashBoardDt.tbl_cd == "at" || shareData.dashBoardDt.tbl_cd == "atadj" || shareData.dashBoardDt.tbl_cd == "ata" || shareData.dashBoardDt.tbl_cd == "atadja" || shareData.dashBoardDt.tbl_cd == "txi" || shareData.dashBoardDt.tbl_cd == "b2bur" || shareData.dashBoardDt.tbl_cd == "ecomb2c" || shareData.dashBoardDt.tbl_cd == "ecomurp2c" || shareData.dashBoardDt.tbl_cd == "ecomab2c" || shareData.dashBoardDt.tbl_cd == "ecomaurp2c") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }
        $scope.onSuppGstinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.stin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.stin.$setValidity('pattern', $scope.validGstin);
          }
        
        $scope.onRtinChange = function (gstin) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.rtin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            $scope.newInvFrm.rtin.$setValidity('pattern', $scope.validGstin);
          }

          function initNewInvRow() {
            $scope.newInvRw = ReturnStructure.getNewInv(tableCode, formName);
            $scope.supaddenabled= false;
            if(tableCode =='supeco'){
                $scope.newInvRw.nat_supp = 'clttx';
            }else if(tableCode =='supecoa'){
                $scope.newInvRw.nat_supp = 'clttxa';
            }
        } 
        
        $scope.resetTbl14 = function(){
            $scope.newInvRw.etin =null;
            $scope.newInvRw.cname =null;
            $scope.newInvRw.suppval =null;
            $scope.newInvRw.igst =null;
            $scope.newInvRw.cgst =null;
            $scope.newInvRw.sgst =null;
            $scope.newInvRw.cess =null;
            $scope.isDiffEtin = false;
        }

        $scope.resetTbl14A = function(){
            $scope.newInvRw.omon =null;
            $scope.newInvRw.oyear =null;
            $scope.newInvRw.oetin =null;
            $scope.newInvRw.etin =null;
            $scope.newInvRw.cname =null;
            $scope.newInvRw.suppval =null;
            $scope.newInvRw.igst =null;
            $scope.newInvRw.cgst =null;
            $scope.newInvRw.sgst =null;
            $scope.newInvRw.cess =null;
            $scope.isDiffEtin = false;
        }
        
          $scope.onPosChangeTB15B2CS = function (y) {
            var isIntra = $scope.isIntraStateB2CS(y);
            var old_sply_ty = y.sply_ty;

            if (isIntra && !isSezTaxpayer) {
                y.sply_ty = $scope.suplyList[0].cd;
                if (old_sply_ty != y.sply_ty) {
                    y.txval = null;
                    y.iamt = null;
                    y.camt = null;
                    y.samt = null;
                    y.csamt = null;
                    // y.rt = 0;
                }

            } else {
                y.sply_ty = $scope.suplyList[1].cd;
               
                if (old_sply_ty != y.sply_ty) {
                    y.txval = null;
                    y.iamt = null;
                    y.camt = null;
                    y.samt = null;
                    y.csamt = null;
                    // y.rt = 0;
                }
            }
        };

        // //CR 23892 To keep SGST and CGST same 
        $scope.updateCGST = function(y){
            if(y)
            y.camt = y.samt;
            else
            $scope.newInvRw.camt = $scope.newInvRw.samt;
        };

        $scope.updateSGST = function(y){
            if(y)
            y.samt = y.camt;
            else
            $scope.newInvRw.samt = $scope.newInvRw.camt;
        };

        $scope.getPosBasedOnStin = function (iInv) {
            var ctinOrGstin;
            if (iInv.stin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.stin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

          //in order to autopoulate pos based on rtin
          $scope.getPosBasedOnRtin = function (iInv) {
            var ctinOrGstin;
            if (iInv.rtin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.rtin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }
        $scope.isInvalidNumber = false;
        $scope.isDuplicateNumber = false;
        //flags and conditions added by janhavi to differentiate orginal inv/nt num and revised inv/nt num
        $scope.isInvalidOriginalNumber = false;
        $scope.isDuplicateOriginalNumber = false;
        $scope.isDuplicateInvoice = function (isNew, inv, key, frm) {
            var isExistInvoice = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            var reqParam = shareData.dashBoardDt,
                isDupChkRequired = true;


            if (inv[key]) {
                if (Number(inv[key] == 0)) {
                    if (key == 'oinum' || key == 'ont_num') {
                        $scope.isDuplicateOriginalNumber = false;
                        $scope.isInvalidOriginalNumber = true;
                        frmName[key].$setValidity(key, false);
                    }
                    if (key == 'inum' || key == 'nt_num') {
                        $scope.isInvalidNumber = true;
                        $scope.isDuplicateNumber = false;
                        frmName[key].$setValidity(key, false);
                    }
                }
                else {
                    if (!isNew) {
                        if (reqParam.tbl_cd == 'b2ba' || reqParam.tbl_cd == 'b2cla' || reqParam.tbl_cd == 'expa' || reqParam.tbl_cd == 'ecomab2b' || reqParam == 'ecomaurp2b') {
                            isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                        else if (reqParam.tbl_cd == 'cdnra' || reqParam.tbl_cd == 'cdnura') {
                            if (key == "nt_num")
                                isDupChkRequired = (inv.old_ntnum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                            else if (key == "inum")
                                isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                    }

                    //reqParam.invdltArray = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName);
                    reqParam.key = key;
                    reqParam.value = inv[key];

                    if (isDupChkRequired) {
                        g1FileHandler.checkDuplicateInvoice(reqParam).then(function (response) {
                            isExistInvoice = (response.result == 'yes') ? true : false;
                            if (isExistInvoice) {
                                if (key == 'oinum' || key == 'ont_num') {
                                    $scope.isInvalidOriginalNumber = false;
                                    $scope.isDuplicateOriginalNumber = true;
                                }
                                if ((key == 'inum' || key == 'oinum') && shareData.dashBoardDt.tbl_cd != 'ecomb2b' && shareData.dashBoardDt.tbl_cd != 'ecomurp2b' && shareData.dashBoardDt.tbl_cd != 'ecomab2b' && shareData.dashBoardDt.tbl_cd != 'ecomaurp2b') {
                                    $scope.isInvalidNumber = false;
                                    $scope.isDuplicateNumber = true;
                                }
                                if ((key == 'inum' || key == 'oinum') && (shareData.dashBoardDt.tbl_cd == 'ecomb2b' || shareData.dashBoardDt.tbl_cd == 'ecomurp2b' || shareData.dashBoardDt.tbl_cd == 'ecomab2b' || shareData.dashBoardDt.tbl_cd == 'ecomaurp2b')) {
                                    $scope.isInvalidNumber = false;
                                    $scope.isDuplicateNumber = true; 
                                  
                                    if(response.hasOwnProperty('oinum'))
                                        $scope.isDuplicateMsgorg = "Document No. '" + response.oinum + "' already exists in the current period.";
                                    
                                    if(response.hasOwnProperty('inum'))
                                    $scope.isDuplicateMsg = "Document No. '" + response.inum + "' already exists in the current period.";
                                   
                                }
								
                                
                            }
                            frmName[key].$setValidity(key, !isExistInvoice);
                        }, function (response) {
                            $log.debug("returnsctrl -> checkDuplicateInvoice fail:: ", response);
                        });
                    }
                    else {
                        frmName[key].$setValidity(key, !isExistInvoice);
                    }
                }
            }

        }
        //To check if valid Invoice Type is selected
        $scope.validateNoteType = function (colkey, isNew, inv, frm) {
            let form = (isNew) ? $scope.newInvFrm : frm;
            let isValid = true;
            if (inv.inv_typ == 'CBW' && inv.rchrg != 'Y') {
                isValid = false;
            }
            if (colkey != 'rchrg') {
                if (inv.inv_typ != 'R' && inv.inv_typ != 'CBW') {
                    inv.etin = null;
                    inv.rchrg = 'N';
                }
            }
            form.inv_typ.$setValidity('inv_typ', isValid);
        }
        //duplicate invoice check
        $scope.isExistingInv = function (isNew, iNum, frm) {
            var isExistInv = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNum) {
                iNum = iNum.toLowerCase();
            }
            angular.forEach($scope.ReturnsList, function (inv, i) {

                if ((inv.onum && inv.onum.toLowerCase() == iNum) || (inv.inum && inv.inum.toLowerCase() == iNum) || (inv.doc_num && inv.doc_num.toLowerCase() == iNum) || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum)) {

                    isExistInv = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.inum.$setValidity('inum', !isExistInv);
        }

        $scope.isExistingInv22 = function (isNew, iNum, ctin, frm, key) {
            if (!key)
                key = 'inum';
            if (!iNum)
                iNum = '';

            if (!ctin)
                ctin = '';
            var isExistInv = 0,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNum) {
                iNum = iNum.toLowerCase();
            }
            frmName[key].$setValidity(key, true);
            angular.forEach($scope.ReturnsList, function (inv, i) {
                if (
                    (inv.onum && inv.onum.toLowerCase() == iNum)
                    ||
                    (inv[key] && inv[key].toLowerCase() == iNum.toLowerCase() && inv.ctin && inv.ctin.toLowerCase() == ctin.toLowerCase())
                    ||
                    (inv.doc_num && inv.doc_num.toLowerCase() == iNum)
                    || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum)
                ) {


                    isExistInv++;
                }
            });
            if (isExistInv > 1) {
                frmName[key].$setValidity(key, false);
            } else {
                frmName[key].$setValidity(key, true);
            }
        }


        $scope.getNotAddedTb15Stin  = function(stin){
            $scope.onSuppGstinChange(stin);
            $scope.isRecStinAsEcomGstn(1,stin);
            if ((stin && stin.length==15 && !$scope.showDropdown) && (!$scope.isDiffStin && $scope.validGstin)) {
               
                $scope.gstinRecordAdd = true;
            }else if(stin && stin.length != 0 && !$scope.showDropdown) {
               $scope.gstinRecordAdd = false;
               $scope.showDropdown = false;
            } 

        }
     
        
        $scope.gstinNotAvailable = function (flag) {
            if (flag == true) {
                $scope.showDropdown = false;
                
            } else {
                $scope.showDropdown = true;
            }
        }
      
        $scope.stinrtinmsg= "";
        $scope.isRecStinAsEcomGstn = function (isNew, stin, frm) {
            
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffStin =false;
            if(stin != null && stin != undefined){
            stin = stin.toUpperCase();
            if($scope.dashBoardDt.gstin == stin){
                $scope.stinrtinmsg = 'Supplier and E-commerce Operator cannot be the same.';
                $scope.isDiffStin = true;
            }
            else if($scope.newInvRw.rtin && $scope.newInvRw.rtin == stin){
                $scope.stinrtinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffStin = true;
            }
            else if($scope.newInvRw.rtin && $scope.newInvRw.rtin == stin && $scope.dashBoardDt.gstin == stin){
                $scope.stinrtinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffStin = true;
            }


            if (frmName.stin) {
                frmName.stin.$setValidity('stin', !$scope.isDiffStin);
            console.log('checking stin validity',$scope.newInvFrm.stin.$invalid, $scope.stinrtinmsg);
            }
            
            
            $scope.gstinRecordAdd = false;
        }}

        $scope.isRtinAsEcomGstn = function (isNew, rtin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffRtin = false;
            if(rtin != null && rtin != undefined){
            if($scope.dashBoardDt.gstin == rtin.toUpperCase()){
                $scope.rtinmsg = 'Recipient and E-commerce Operator cannot be the same.';
                $scope.isDiffRtin = true;
            }
            if (frmName.rtin) {
                frmName.rtin.$setValidity('rtin', !$scope.isDiffRtin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.isSupStinAsEcomGstn = function (isNew, stin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffStin = false;
            if(stin != null && stin != undefined){
            if($scope.dashBoardDt.gstin == stin.toUpperCase()){
                $scope.stinmsg = 'Supplier and E-commerce Operator cannot be the same.';
                $scope.isDiffStin = true;
            }
            if (frmName.stin) {
                frmName.stin.$setValidity('stin', !$scope.isDiffStin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.isRecRtinAsEcomGstn = function (isNew, rtin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            $scope.isDiffRtin = false;
            if(rtin != null && rtin != undefined){
            rtin = rtin.toUpperCase();
            if($scope.dashBoardDt.gstin == rtin){
                $scope.rtinstinmsg = 'Recipient and E-commerce Operator cannot be the same.';
                $scope.isDiffRtin = true;
            }
            else if($scope.newInvRw.stin && $scope.newInvRw.stin == rtin){
                $scope.rtinstinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffRtin = true;
            }
            else if($scope.newInvRw.stin && $scope.newInvRw.stin == rtin && $scope.dashBoardDt.gstin == rtin){
                $scope.rtinstinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffRtin = true;
            }
            if (frmName.rtin) {
                frmName.rtin.$setValidity('rtin', !$scope.isDiffRtin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;
            $scope.selectAll = 'N'
            initSumryList();
        };

        //In exp,expa supplylist only inter-state
        $scope.supplyList = [];
        $scope.supplyList.push($scope.suplyList[1]);


        //Formaters
        if (shareData.dashBoardDt.tbl_cd == "b2cs" || shareData.dashBoardDt.tbl_cd == "b2csa" || shareData.dashBoardDt.tbl_cd == "at" || shareData.dashBoardDt.tbl_cd == "atadj" || shareData.dashBoardDt.tbl_cd == "ata" || shareData.dashBoardDt.tbl_cd == "atadja" || shareData.dashBoardDt.tbl_cd == "txi") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }
        //Delinking related changes start
        $scope.sections = ["Invoice No.", "Invoice Date", "Original Invoice Number", "Original Invoice Date"];

        $scope.multiSelectEvents = {
            onSelectAll: function () {
                $scope.trdcol = true;
                $scope.valcol = true;

            },
            onDeselectAll: function () {
                $scope.trdcol = false;
                $scope.valcol = false;

            },
            onItemSelect: function (item) {
                switch (item.id) {
                    case 1: $scope.trdcol = true;
                        break;
                    case 2: $scope.valcol = true;
                        break;


                }
            },
            onItemDeselect: function (item) {
                switch (item.id) {
                    case 1: $scope.trdcol = false;
                        break;
                    case 2: $scope.valcol = false;
                        break;
                }
            }
        }

        $scope.myDropdownModelsettings = {
            scrollable: true,
            checkBoxes: true,
            scrollableHeight: '200px',
            styleActive: true,
            buttonClasses: "btn , btn-default",
            buttonDefaultText: 'hide/unhide column',
            selectedToTop: true
        }

        $scope.loadCol = function () {
            let disableTbCd = shareData.dashBoardDt.tbl_cd;
            if (disableTbCd == "cdnura" || disableTbCd == "cdnra") {
                $scope.dropdownList = [
                    { id: 1, label: 'Original Invoice No.' },
                    { id: 2, label: 'Original Invoice Date' },
                ];
            }

            else {
                $scope.dropdownList = [
                    { id: 1, label: 'Invoice No.' },
                    { id: 2, label: 'Invoice Date' },

                ];
            }

            $scope.selectedItems = [];
            $scope.trdcol = false;
            $scope.valcol = false;
        }
        //Delinking related changes end

        $scope.isExistingHsnUqcRate = function (isNew, iRate, iHsn, uqc, frm) {
            // if (!iRate)
            //     iRate = '';

            if (!iHsn)
                iHsn = '';
            var isExistRate = false;
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            frmName.rt.$setValidity('duplicate', true);
            frmName.uqc.$setValidity('duplicate', true);
            frmName.hsn_sc.$setValidity('duplicate', true);

            if (isNew == 1) {
                angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    // if (!inv.rt)
                    //     inv.rt = '';
                    if (
                        (inv.rt == iRate)
                        &&
                        (inv.hsn_sc == iHsn)
                        &&
                        (inv.uqc == uqc)
                    ) {
                        isExistRate = true;
                    }
                });
                frmName.rt.$setValidity('duplicate', !isExistRate);
                frmName.uqc.$setValidity('duplicate', !isExistRate);
                frmName.hsn_sc.$setValidity('duplicate', !isExistRate);
            } else {
                var cnt = 0;
                angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if (inv.rt == iRate && inv.hsn_sc == iHsn && inv.uqc == uqc) {
                        isExistRate = true;
                        cnt++;
                    }
                });
                if (cnt > 1) {
                    frmName.rt.$setValidity('duplicate', !isExistRate);
                    frmName.uqc.$setValidity('duplicate', !isExistRate);
                    frmName.hsn_sc.$setValidity('duplicate', !isExistRate);
                }
            }
            // if(isNew == 1){
                $scope.comparisonofMaster();
            // }
        }

        //if sez taxpayer only inter-state supplies for cdnra
        if (isSezTaxpayer && shareData.dashBoardDt.tbl_cd == "cdnra" && shareData.dashBoardDt.form == "GSTR1") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }


        var formateNodePayload = ReturnStructure.formateNodePayload(tableCode, form);
        //  getInv = ReturnStructure.getInv(tableCode, form, shareData.yearsList);
        //Formaters

        //        var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, form),
        //            formateNodePayload = ReturnStructure.formateNodePayload(tableCode, form),
        //            getExcelTitle = ReturnStructure.getExcelTitle(tableCode, form),
        //            getInvKey = ReturnStructure.getInvKey(tableCode, form),
        //            getInv = ReturnStructure.getInv(tableCode, form),
        //            getItm = ReturnStructure.getItm(tableCode, form);
        //
        //        function seperateResponse(iResp) {
        //            var reformedResp = reformateInv(iResp);
        //            var uploadBySuplrList = [],
        //                uploadbyRcvrList = [];
        //            angular.forEach(reformedResp, function (inv, i) {
        //                if (inv.updby == 'R') {
        //                    uploadbyRcvrList.push(inv);
        //                } else if (!inv.updby || inv.updby == 'S') {
        //                    uploadBySuplrList.push(inv);
        //                }
        //            });
        //            return {
        //                uploadbyRcvrData: uploadbyRcvrList,
        //                uploadBySuplrData: uploadBySuplrList
        //            }
        //        }
        $scope.loadCol();
        //To get list - upload
        function initSumryList() {

            jQuery('.table-responsive').css('opacity', 0.5);

            if (!shareData.pageNum)
                shareData.pageNum = 1;


            shareData.isUploadFlag = $scope.isUploadFlag;


            g1FileHandler.getContentsForPaged(
                $scope.dashBoardDt,
                tableCode,
                shareData.pageNum,
                $scope.dashBoardDt.form,
                shareData,
                shareData.filter_val,
                $scope.sortBy,
                $scope.sortReverse,
                'FL2', // to identify second flow, 
                true //  file name will be provided, DO NOT RE_CREATE
            ).then(function (response) {
                $scope.isLoaded = true;
                jQuery('.table-responsive').css('opacity', 1);

                // $log.debug("initSumryList -> initSumryList success:: ", response);



                // if (tableCode === "hsn") {
                //     response = response.data;
                // }


                //                
                //                if (tableCode == "b2b" || tableCode == "cdnr") {
                //                    var formateResponse = seperateResponse(response),
                //                        supplierResponse = formateResponse.uploadBySuplrData,
                //                        receiverResponse = formateResponse.uploadbyRcvrData;
                //                    $scope.TaxPayerSummaryList = supplierResponse;
                //                    $scope.ReceiverUploadedSummaryList = receiverResponse;
                //
                //                } else {
                //                    $scope.TaxPayerSummaryList = reformateInv(response);
                //                }
                //                
                //                 
                $scope.totalAvailable = response.count;
                /* if (tableCode == "b2b" || tableCode == "cdnr") {
                     if (shareData.isUploadFlag == 'R') {
                         $scope.TaxPayerSummaryList = [];
                         $scope.ReceiverUploadedSummaryList = response.rows;
                         $scope.ReceiverModifiedSummaryList=response.rows; 
                         
                     } else {
                         $scope.ReceiverUploadedSummaryList = [];
                         $scope.TaxPayerSummaryList = response.rows;
                     }
                 } */

                if (tableCode == "b2b" || tableCode == "cdnr" || tableCode == "b2ba" || tableCode == "cdnra") {
                    if (shareData.isUploadFlag == 'S') {
                        $scope.TaxPayerSummaryList = response.rows;
                    }
                    else if (shareData.isUploadFlag == 'R') {
                        $scope.ReceiverUploadedSummaryList = response.rows;
                    }
                    else if (shareData.isUploadFlag == 'Modified') {
                        $scope.ReceiverModifiedSummaryList = response.rows;
                    }
                    else if (shareData.isUploadFlag == 'Rejected') {
                        $scope.ReceiverRejectedSummaryList = response.rows;
                    }
                }
                else {
                    $scope.TaxPayerSummaryList = response.rows;
                    if(tableCode =='hsn' || tableCode == 'hsn(b2b)' || tableCode == 'hsn(b2c))'){
                        for(let i in $scope.TaxPayerSummaryList){
                            ReturnStructure.fetchDescFromHsn($scope.TaxPayerSummaryList[i].hsn_sc).then(function (response){
                                if(response == null || response == ""){
                                  $scope.TaxPayerSummaryList[i].invalidhsnCode = true;
                                }
                                else{
                                    $scope.TaxPayerSummaryList[i].invalidhsnCode = false;
                                }
                            },function(error){
                                console.log(error);
                                $scope.TaxPayerSummaryList[i].invalidhsnCode = true;
                            });
                           }
                    }
                }

                $scope.itemslist = [];
                //   console.log('Preloading...');
                //   console.log("length",$scope.TaxPayerSummaryList.length);
                  let rListLength = 0;
                  let ix=0;
                 // debugger;
                for(rListLength =0; rListLength <$scope.TaxPayerSummaryList.length;rListLength++, ix++){
                // for(let i in $scope.TaxPayerSummaryList){
                    //  console.log("i::",i)
                    //  console.log(response[i]);
                     let hscNum= $scope.TaxPayerSummaryList[ix].num;
                     if($scope.TaxPayerSummaryList[ix].hsn_sc){
                      ReturnStructure.validateHsnAPI($scope.TaxPayerSummaryList[ix].hsn_sc,ix).then(function (response){
                        //    console.log("ires::",response)
                        //    debugger;
                        //   if(response[ix] == null || response[ix] == ""){
                          
                        //     $scope.TaxPayerSummaryList[response.index].invalidhsnCode = true;
                        //   }
                        //   else{
                        //       $scope.TaxPayerSummaryList[response.index].invalidhsnCode = false;
                        //   }
                          if(response.data != undefined){
                            $scope.TaxPayerSummaryList[response.index].invalidhsnCode = false;
                            $scope.itemslist.push({
                                key: hscNum, // $scope.TaxPayerSummaryList[i].num,// #response.index,
                                value:  response.data,
                            });
                          }else{
                            $scope.TaxPayerSummaryList[response.index].invalidhsnCode = true;
                          }
                          
                      },function(error){
                      console.log("error::",error)
                      });
                    }
                    }
                
                g1FileHandler.getMasterData(shareData.dashBoardDt.gstin).then(function (response) {
                    if(response !=null && response !=""){
                    sessionStorage.setItem("supRecipGstin",JSON.stringify(response));
                    }
                    $scope.comaprisonOfJson();
                });
            }, function (response) {
                // $scope.createAlert("WarningOk", response, function () { });
                $log.debug("initSumryList -> initSumryList fail:: ", response);
                $scope.isLoaded = true;
                jQuery('.table-responsive').css('opacity', 1);
                // $scope.page("/gstr/upload/dashboard");
            });
        }


        $scope.initSumryList = initSumryList;

   //Import JSon - Product master integration upload
        $scope.comaprisonOfJson = function () {
            $scope.productData = JSON.parse(sessionStorage.getItem('supRecipGstin')) ? JSON.parse(sessionStorage.getItem('supRecipGstin')).productsMasters : [];
            for (let i in $scope.TaxPayerSummaryList) {
                let find = false;
                var count = 0;
                var prodName = null;
                for (let j in $scope.productData) {
                    if ($scope.TaxPayerSummaryList[i].hsn_sc == $scope.productData[j].hsn && $scope.TaxPayerSummaryList[i].uqc == $scope.productData[j].uqc && $scope.TaxPayerSummaryList[i].rt == $scope.productData[j].igst) {
                        count++;
                        prodName = $scope.productData[j].productName;
                        find = true;
                    }
                }
                if(count==1){
                    $scope.TaxPayerSummaryList[i].productName = $scope.TaxPayerSummaryList[i].productName!=null ? $scope.TaxPayerSummaryList[i].productName : prodName;
                }
                else{
                    $scope.TaxPayerSummaryList[i].productName = $scope.TaxPayerSummaryList[i].productName!=null ? $scope.TaxPayerSummaryList[i].productName : ' ';
                }
                if (!find && $scope.TaxPayerSummaryList[i].productName) {
                    delete $scope.TaxPayerSummaryList[i].productName;
                }
            }
        }


        
        //sorting functionality
        $scope.sortonPosChangeReverse = false;
        $scope.sort = function (sortKey) {
            $scope.sortBy = sortKey;
            $scope.sortReverse = !$scope.sortReverse;
            initSumryList();
        }

        $scope.onGstinChange = function (gstin, frm) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.ctin.$setValidity('pattern', true);
                return;  
            }
            if (form == 'GSTR1'){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.nrtp(gstin);}
            else
                $scope.validGstin = $scope.validations.gstin(gstin);
               
            $scope.newInvFrm.ctin.$setValidity('pattern', $scope.validGstin);
           
        }

        $scope.onYearChange = function (iInv) {
            for (var i = 0; i < $scope.years.length; i++) {
                var yearObj = $scope.years[i];
                if (yearObj.year === iInv.oyear.year) {
                    iInv.oyear = yearObj;
                }
            }
        }

        $scope.shouldAllowUncheck = function (iInv) {
            if (!iInv) return false;
            if (iInv.inv_typ != 'CBW')

                return false;
            // if same pos ? 
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var pos = iInv.pos;
            if (my_code != pos)
                return false;
            //pos matches, sez should be allowed
            if (isSezTaxpayer)
                return false;
            return true;

        }

        if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr" || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1") {
            $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
            var obj = {};
            obj["cd"] = "96";
            obj["nm"] = "Foreign Country";
            $scope.StateList.push(obj);
            $scope.StateList.sort(function (a, b) {
                return a.cd - b.cd;
            });
        } else {
            $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
        }

        $scope.returnStateList = function (iInv) {
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var disableAid = true;

            if (iInv && iInv.inv_typ == 'CBW')
                disableAid = false; var state_list = $scope.StateList
            for (var i = 0; i < state_list.length; i++) {
                if (state_list[i].cd == my_code) {
                    if (!isSezTaxpayer && disableAid)
                        state_list[i].disabled = true;
                    else
                        state_list[i].disabled = false;
                }
                else {
                    state_list[i].disabled = false;
                }
            }
            return state_list;

        }

       
        $scope.showDropdown = true;
        $scope.colorEnabled = false;
        $scope.getSupplierDetails = function (isEdit) {
             $scope.newInvRw.supplierRecipientName ="";
            $scope.validGstin = false;
               if ($scope.supenabled) {
                $scope.userGstin = shareData.gstinNum;
                g1FileHandler.getMasterData($scope.userGstin).then(function (response) {
                    if (response== null || (response.supplierRecipientMasters == null) || (response.supplierRecipientMasters.length ==0)) {
                   
                        for(let i=0;i<$scope.ReturnsList.length;i++){
                          $scope.ReturnsList[i].supplierRecipientName ="";
                        }
                     }
                    if (response != undefined && response != null && response !="") {
                       
                        $scope.suppDetails = response.supplierRecipientMasters;
                        sessionStorage.setItem("supRecipGstin", JSON.stringify(response));
                        $scope.prodDetails = response.productsMasters;
                        $scope.gstinUser($scope.suppDetails);
                       
                         if(isEdit == 'X'){
                               $scope.gstinRecordAdd = false; 
                               $scope.gstEditData();
                                
                        }
 
                    }
                   
                });
            }
        }
        //To diable pos same as gstin in b2cl n b2cla
        $scope.stcodedisable = function (iInv) {
           
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var disableAid = true;
            if (iInv) {
                // iInv.pos = null;
            }
            if (iInv && iInv.inv_typ == 'CBW')
                disableAid = false;
            for (var i = 0; i < $scope.StateList.length; i++) {
                if ($scope.StateList[i].cd == my_code) {
                    if (disableAid)
                        $scope.StateList[i].disabled = true;
                    else
                        $scope.StateList[i].disabled = false;
                }
                else {
                    $scope.StateList[i].disabled = false;
                }

            }
        };

        $scope.invTypeSelected = function (rowObj) {
            if (rowObj.inv_typ != 'R') {
                rowObj.etin = null;
                rowObj.rchrg = 'N';
            }
        };

        $scope.convertStrToNum = function (iObj, iKey) {
            if (iObj[iKey])
                iObj[iKey] = Number(iObj[iKey]);

        }
        //in order to autopoulate pos based on ctin
        $scope.getPosBasedOnCtin = function (iInv) {
            if (iInv.ctin) {
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == iInv.ctin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

        $scope.onPosChangeB2CS = function (y) {
            var isIntra = $scope.isIntraStateB2CS(y);
            if (isIntra && !isSezTaxpayer) {
                y.sply_ty = $scope.suplyList[0].cd;
                y.iamt = 0;
                y.camt = (y.rt != null) ? parseFloat(((y.rt * y.txval) * 0.005).toFixed(2)) : 0;
                y.samt = (y.rt != null) ? parseFloat(((y.rt * y.txval) * 0.005).toFixed(2)) : 0;
                y.txval = 0;
                y.rt = 0;
                y.csamt = 0;

            } else {
                y.sply_ty = $scope.suplyList[1].cd;
                y.iamt = (y.rt != null) ? parseFloat(((y.rt * y.txval) / 100).toFixed(2)) : 0;
                y.camt = 0;
                y.samt = 0;
                y.txval = 0;
                y.rt = 0;
                y.iamt = 0;
                y.csamt = 0;
            }
        };
        $scope.dashbrdGstn = shareData.dashBoardDt.gstin.substring(0, 2);
        $scope.isIntraStateB2CS = function (obj) {
            var gstin = $scope.dashBoardDt.gstin.slice(0, 2);
            if (obj.pos == gstin && !isSezTaxpayer)
                return true;
            return false;

        };

        $scope.sezimp = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflag = true;

            }
            else {
                $scope.sezflag = false;
                delete obj.ctin;
            }
        }

        //To check shipping date less than invoice date in exp,expa
        $scope.isLessThanInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dt, isValidDt = true;
            if (tableCode == 'cdnr' || tableCode == 'cdnur') {
                dt = iInv.nt_dt;
            }
            if (tableCode == 'exp') {
                dt = iInv.sbdt;

                //  frmName.sbdt.$setValidity('sbdt', isValidDt);
                //  return true;

            }

            if (iInv.idt && dt)
                if (moment(dt, dateFormat).isBefore(moment(iInv.idt, dateFormat))) {
                    isValidDt = false;
                    if (tableCode == 'cdnr' || tableCode == 'cdnur') {
                        $scope.errMsg = "Note date cannot be prior to invoice date"
                    }
                    if (tableCode == 'exp') {
                        $scope.errMsg = "Shipping bill date cannot be earlier than invoice date."
                    }
                }

            if (moment(dt, dateFormat).isValid()) {
                if (moment(dt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                    isValidDt = false;
                    if (isNew)
                        $scope.errMsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";

                }
                else if (moment(dt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                    isValidDt = false;
                    if (isNew)
                        $scope.errMsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                }

            }

            if (frmName.sbdt) {
                frmName.sbdt.$setValidity('sbdt', isValidDt);
            }
            else if (frmName.nt_dt) {
                frmName.nt_dt.$setValidity('nt_dt', isValidDt);
            }
        }

        //To check either hsn or desc as mandatory
        $scope.isRequiredField = function (inv, isHsn) {

            var isRequired;
            if (inv) {
                if (isHsn) {
                    isRequired = (inv.hsn_sc) ? false : true;
                }
                else {
                    isRequired = (inv.desc) ? false : true;
                }
            }
            return isRequired;
        }

        $scope.isRequiredField2 = function (inv, isHsn, checking_for) {

            var isRequired;
            if (inv) {
                if (checking_for == 'camt' || checking_for == 'samt') {
                    isRequired = (inv.iamt && inv.iamt != '') ? false : true;
                }
                else {
                    isRequired = ((inv.samt && inv.samt != '') || (inv.camt && inv.camt != '')) ? false : true;
                }
            }
            return isRequired;
        }


        //To disable pos if type in cdnur expwpay n wopay
        $scope.isTypeExp = function (inv) {
            if (inv && (inv.typ == 'EXPWP' || inv.typ == 'EXPWOP')) {
                if (inv.pos)
                    inv.pos = null;
                if (inv.diff_percent)
                    inv.diff_percent = null;
                return true;
            }
            else
                return false;
        }

        //To clear the invoice num and invoice date on edit of imported old transitional data post delinking
        $scope.clearOldInv = function (inv, sectionName) {
            if (inv) {
                inv.inum = '';
                inv.idt = '';
                if (!inv.rchrg && (sectionName == 'cdnr' || sectionName == 'cdnra'))
                    inv.rchrg = 'N';

                return inv
            }
        }

        //To validate required fields - CR 17052
        $scope.fnValidateReqrd = function (invFrm, y, index) {
            $scope.rowIndex = index;
            $scope.isEmptyPOS = false;
            $scope.isEmptyNoteSupplyType = false;
            if (!y.pos)
                $scope.isEmptyPOS = invFrm.pos.$error.required;
            if (!y.inv_typ)
                $scope.isEmptyNoteSupplyType = invFrm.inv_typ.$error.required;
        }
        //validation for same receiver gstin n supplier gstin
        $scope.isRecGstnAsSupGstn = function (isNew, ctin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            $scope.isDiffCtin = ($scope.dashBoardDt.gstin == ctin) ? true : false;

            if (frmName.ctin) {
                frmName.ctin.$setValidity('ctin', !$scope.isDiffCtin);
            }
            $scope.gstinRecordAdd = false;
            //return isDiffCtin;
        }

        //validation for same description and hsn in hsn
        $scope.isDescSameAsHsn = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isDiffDesc = (inv.hsn_sc && inv.desc && inv.hsn_sc == inv.desc) ? false : true;

            if (frmName.desc) {

                frmName.desc.$setValidity('desc', isDiffDesc);
            }
            //return isDiffCtin;
        }

        //validation for same etin n receiver gstin n supplier gstin
        $scope.isEtinAsSupRecGstin = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isDiffEtin = ($scope.dashBoardDt.gstin == iInv.etin || iInv.ctin == iInv.etin) ? true : false;

            if (frmName.etin) {
                frmName.etin.$setValidity('etin', !isDiffEtin);
            }
            // return isDiffEtin;
        }

        //in order to get statecode based on cpty if regd
        $scope.getStateCodeBasedOnCtin = function (iInv) {
            if (iInv.reg_type == "REGD") {
                if (iInv.cpty) {
                    for (var i = 0; i < $scope.StateList.length; i++) {
                        if ($scope.StateList[i].cd == iInv.cpty.slice(0, 2)) {
                            iInv.state_cd = $scope.StateList[i].cd;
                            $scope.onCtinChange(iInv);
                        }
                    }
                }
            } else {
                $scope.onCtinChange(iInv);
            }
        }
        //To check if valid Invoice Type is selected
        $scope.validateNoteType = function (colkey, isNew, inv, frm) {
            let form = (isNew) ? $scope.newInvFrm : frm;
            let isValid = true;
            if (inv.inv_typ == 'CBW' && inv.rchrg != 'Y') {
                isValid = false;
            }
            if (colkey != 'rchrg') {
                if (inv.inv_typ != 'R' && inv.inv_typ != 'CBW') {
                    inv.etin = null;
                    inv.rchrg = 'N';
                }
            }
            form.inv_typ.$setValidity('inv_typ', isValid);
        }
        //duplicate invoice check
        $scope.isExistingInv = function (isNew, iNum, frm) {
            var isExistInv = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNum) {
                iNum = iNum.toLowerCase();
            }
            angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {

                if ((inv.onum && inv.onum.toLowerCase() == iNum) || (inv.inum && inv.inum.toLowerCase() == iNum) || (inv.doc_num && inv.doc_num.toLowerCase() == iNum) || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum)) {

                    isExistInv = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.inum.$setValidity('inum', !isExistInv);
        }

        //duplicate Note check
        $scope.isExistingNote = function (isNew, iNote, frm) {
            var isExistNote = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iNote) {
                iNote = iNote.toLowerCase();
            }
            angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                if ((inv.nt_num && (inv.nt_num).toLowerCase() == iNote)) {
                    isExistNote = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.nt_num.$setValidity('nt_num', !isExistNote);
        }

        //duplicate Desc for hsn check
        $scope.isExistingDesc = function (isNew, iDesc, iHsn, frm) {
            var isExistDesc = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                if (((inv.desc && inv.desc == iDesc) && (inv.hsn_sc && inv.hsn_sc == iHsn))) {
                    isExistDesc = true;
                }
            });
            // return (isExistInv) ? true : false;
            frmName.desc.$setValidity('desc', !isExistDesc);
        }

        $scope.isExistingDesc2 = function (isNew, iDesc, iHsn, uqc, frm) {
            if (!iDesc)
                iDesc = '';

            if (!iHsn)
                iHsn = '';
            var isExistDesc = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;


            frmName.desc.$setValidity('duplicate', true);
            frmName.uqc.$setValidity('duplicate', true);
            frmName.hsn_sc.$setValidity('duplicate', true);

            // if (iDesc) {
            if (isNew == 1) {
                angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if (!inv.desc)
                        inv.desc = '';
                    if (
                        ((inv.desc).toLowerCase() == (iDesc).toLowerCase())

                        &&
                        (inv.hsn_sc == iHsn)
                        &&
                        (inv.uqc == uqc)

                    ) {
                        isExistDesc = true;
                    }
                });
                frmName.desc.$setValidity('duplicate', !isExistDesc);
                frmName.uqc.$setValidity('duplicate', !isExistDesc);
                frmName.hsn_sc.$setValidity('duplicate', !isExistDesc);
            } else {
                var cnt = 0;
                angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if ((((inv.desc).toLowerCase() == (iDesc).toLowerCase()) && (inv.hsn_sc == iHsn) && (inv.uqc == uqc))) {
                        isExistDesc = true;
                        cnt++;
                    }
                });
                if (cnt > 1) {
                    frmName.desc.$setValidity('duplicate', !isExistDesc);
                    frmName.uqc.$setValidity('duplicate', !isExistDesc);
                    frmName.hsn_sc.$setValidity('duplicate', !isExistDesc);
                }
            }


        }



        //duplicate POS check
        $scope.isExistingPos = function (isNew, iPos, frm) {
            var isExistPos = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;

            angular.forEach($scope.TaxPayerSummaryList, function (inv, i) {
                if ((inv.pos && inv.pos == iPos)) {
                    isExistPos = true;
                }
            });
            frmName.supst_cd.$setValidity('supst_cd', !isExistPos);
        }

        //To display empty row in Lastpage only in case of pagination
        $rootScope.isLastPage = function (currentPage, pageSize) {
            if (!$scope.totalAvailable)
                $scope.totalAvailable = 0;
            var isLast = false,
                total = Math.ceil(($scope.totalAvailable / pageSize));
            if (total == currentPage) {
                isLast = true;
            }
            // if no records, we are always on last page.
            if ($scope.totalAvailable == 0)
                return true;
            return isLast;
        }


        //To make etin as mandatory field in case of b2cs & b2csa
        $scope.isEcom = function (isNew, inv, frm) {

            var frmName = (isNew) ? $scope.newInvFrm : frm,
                isOEcom = false;


            if (inv.typ && inv.typ == "OE") {
                isOEcom = true;
                if (frmName.etin.$viewValue) {
                    inv.etin = null;
                }

            }
            return isOEcom;

        }
        $scope.docDateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot exceed the current tax period";
                        }

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.idt.$setValidity('idt', dtflag);

        };
        $scope.docOldDateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot exceed the current tax period";

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.oidt.$setValidity('oidt', dtflag);

        };

        $scope.isInvalidNumber = false;
        $scope.isDuplicateNumber = false;
        //flags and conditions added by janhavi to differentiate orginal inv/nt num and revised inv/nt num
        $scope.isInvalidOriginalNumber = false;
        $scope.isDuplicateOriginalNumber = false;
        $scope.isDuplicateInvoice = function (isNew, inv, key, frm) {
            var isExistInvoice = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            var reqParam = shareData.dashBoardDt,
                isDupChkRequired = true;


            if (inv[key]) {
                if (Number(inv[key] == 0)) {
                    if (key == 'oinum' || key == 'ont_num') {
                        $scope.isDuplicateOriginalNumber = false;
                        $scope.isInvalidOriginalNumber = true;
                        frmName[key].$setValidity(key, false);
                    }
                    if (key == 'inum' || key == 'nt_num') {
                        $scope.isInvalidNumber = true;
                        $scope.isDuplicateNumber = false;
                        frmName[key].$setValidity(key, false);
                    }
                }
                else {
                    if (!isNew) {
                        if (reqParam.tbl_cd == 'b2ba' || reqParam.tbl_cd == 'b2cla' || reqParam.tbl_cd == 'expa') {
                            isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                        else if (reqParam.tbl_cd == 'cdnra' || reqParam.tbl_cd == 'cdnura') {
                            if (key == "nt_num")
                                isDupChkRequired = (inv.old_ntnum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                            else if (key == "inum")
                                isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                    }

                    //reqParam.invdltArray = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName);
                    reqParam.key = key;
                    reqParam.value = inv[key];

                    if (isDupChkRequired) {
                        g1FileHandler.checkDuplicateInvoice(reqParam, "Import").then(function (response) {
                            isExistInvoice = (response.result == 'yes') ? true : false;
                            if (isExistInvoice) {
                                if (key == 'oinum' || key == 'ont_num') {
                                    $scope.isInvalidOriginalNumber = false;
                                    $scope.isDuplicateOriginalNumber = true;
                                }
                                if (key == 'inum' || key == 'nt_num') {
                                    $scope.isInvalidNumber = false;
                                    $scope.isDuplicateNumber = true;
                                }
                            }
                            frmName[key].$setValidity(key, !isExistInvoice);
                        }, function (response) {
                            $log.debug("returnsctrl -> checkDuplicateInvoice fail:: ", response);
                        });
                    }
                    else {
                        frmName[key].$setValidity(key, !isExistInvoice);
                    }
                }
            }

        }

        //To check value of b2cl Invoices(>=250000)
        $scope.isLargeInv = function (isNew, val, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;


            var isValidAmt = (val && val <= $scope.B2CL_MIN) ? false : true;
            frmName.val.$setValidity('val', isValidAmt);
        }


        //date validation		
        $scope.dateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.idt.$setValidity('idt', dtflag);

        };


        $scope.maxmDate = "";
        //To disable Future Dates
        $scope.datefunc = function () {
            var rtDt = null,
                today = moment().format(dateFormat),
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat);
            if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
                rtDt = today;
            } else {
                rtDt = lastDate1;
            }
            $scope.maxmDate = rtDt;
            return rtDt;
        };
        $scope.todayDate = function () {
            return moment().format(dateFormat);
        }


        $scope.min_dt = "";
        $scope.minDate = function () {
            var firstMonth = $scope.monthList[0],
                temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                temp2 = "01072017",
                firstDate = moment(temp2, dateFormat),
                firstDate1 = firstDate.format(dateFormat),
                lastDate = moment(temp1, dateFormat),
                lastDate1 = lastDate.format(dateFormat);
            var diff = lastDate.diff(firstDate, 'months');
            $scope.min_dt = firstDate1;
            //temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2)

            return $scope.min_dt;

        };

        $scope.dateVal = $scope.minDate();

        //To enable prev dates in case of cdnr pregst
        $scope.minInvDatePGst = function (inv) {
            var minDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2);
                //firstDate = moment(temp1, dateFormat),
                // firstDate1 = firstDate.format(dateFormat);
                minDate = moment(temp1, "DD/MM/YYYY").add(1, 'days').subtract(18, 'months').format("DD/MM/YYYY");

            }
            else {
                minDate = $scope.minDate();
            }
            return minDate;
        }

        //To disable after jun30 dates in case of cdnr pregst
        $scope.maxInvDatePGst = function (inv) {
            var maxDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "30062017",
                    lastDate = moment(temp1, dateFormat),
                    lastDate1 = lastDate.format(dateFormat);
                maxDate = lastDate1;

            }
            else {
                maxDate = $scope.datefunc();
            }
            return maxDate;
        };
        $scope.setPristine = function (inv, frmName, oldInv) {
            if (tableCode == 'b2cs' || tableCode == 'hsn' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2c' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c' || tableCode  == 'supeco' || tableCode  == 'supecoa' ) {
                if (oldInv.txval != inv.txval || oldInv.val != inv.val || oldInv.iamt != inv.iamt || oldInv.camt != inv.camt || oldInv.samt != inv.samt || oldInv.csamt != inv.csamt || oldInv.suppval != inv.suppval || oldInv.cgst != inv.cgst || oldInv.sgst != inv.sgst || oldInv.igst != inv.igst || oldInv.cess != inv.cess) 
                    frmName.$pristine = false;
                else
                    frmName.$pristine = true;
                return;
            }
            if (inv.old_val != inv.val)
                frmName.$pristine = false;
            else
                frmName.$pristine = true;
        }
        $scope.onPgstchange = function (obj) {
            if (obj.p_gst == 'Y')
                delete obj.dt;
            else
                obj.dt = $scope.minDate();

        }

        $scope.isPreGST = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var maxDt = $scope.maxInvDatePGst(inv),
                minDt = $scope.minInvDatePGst(inv),
                dtflag = true,
                invdt = inv.idt;

            if (moment(invdt, dateFormat).isValid()) {
                if (moment(invdt, dateFormat).isAfter(moment(maxDt, dateFormat))) {
                    dtflag = false;
                    if (isNew) {
                        if (inv.p_gst == 'Y')
                            $scope.invdtmsg = "Date of invoice cannot exceed June 30, 2017 for Pre GST Regime";
                        else
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                    }

                }
                else if (moment(invdt, dateFormat).isBefore(moment(minDt, dateFormat))) {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                }

            } else {
                dtflag = false;
                if (isNew)
                    $scope.invdtmsg = "Date does not exists in the calendar";
                // return true;
            }
            frmName.idt.$setValidity('idt', dtflag);

        }

        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];
            var yesFlag = false;

            angular.forEach($scope.TaxPayerSummaryList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName));
                }
            });
            if (invdltArray.length > 0) {
                $scope.createAlert("Warning", "Are you sure to delete selected rows?", function () {
                    R1InvHandler.delete($scope, rtArry, invdltArray).then(function (response) {
                        $scope.TaxPayerSummaryList = angular.copy(response);
                        $scope.selectAll = 'N';
                    });
                })

            } else {
                $scope.createAlert("WarningOk", "No Data to Mark as Delete.", function () { });
            }
        }
        $scope.ecomflag = true;
        $scope.ecomtyp = function (typ) {
            if (typ == "E") {
                $scope.ecomflag = false;

            }
            else {
                $scope.ecomflag = true;
            }
        }


        $scope.sezimp = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflag = true;

            }
            else {
                $scope.sezflag = false;
                delete obj.ctin;
            }
        }

        $scope.sezimpnew = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflagnew = true;

            }
            else {
                $scope.sezflagnew = false;
                delete obj.ctin;
            }
        }



        $scope.isLessThanOrgInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var sbdtOrOdt = null,
                idtOrRevdt = null;
            if (((tableCode == "b2ba") && shareData.dashBoardDt.form == "GSTR2") || tableCode == "b2bura") {
                sbdtOrOdt = iInv.oidt;
                idtOrRevdt = iInv.idt;
            }
            if (tableCode == "cdnra") {
                sbdtOrOdt = iInv.ont_dt;
                idtOrRevdt = iInv.nt_dt;
            }
            if (tableCode == "atxi") {
                sbdtOrOdt = iInv.otdt;
                idtOrRevdt = iInv.dt;
            }
            if (tableCode == "imp_ga") {
                sbdtOrOdt = iInv.oboe_dt;
                idtOrRevdt = iInv.boe_dt;
            }
            if (tableCode == "imp_sa") {
                sbdtOrOdt = iInv.oi_dt;
                idtOrRevdt = iInv.i_dt;
            }
            var isValidDt = (moment(idtOrRevdt, dateFormat).isBefore(moment(sbdtOrOdt, dateFormat))) ? false : true;
            if (frmName.idt) {
                frmName.idt.$setValidity('idt', isValidDt);
            }
            if (frmName.nt_dt) {
                frmName.nt_dt.$setValidity('nt_dt', isValidDt);
            }
            if (frmName.doc_dt) {
                frmName.doc_dt.$setValidity('doc_dt', isValidDt);
            }
            if (frmName.boe_dt) {
                frmName.boe_dt.$setValidity('boe_dt', isValidDt);
            }
            if (frmName.i_dt) {
                frmName.i_dt.$setValidity('i_dt', isValidDt);
            }
            if (frmName.dt) {
                frmName.dt.$setValidity('dt', isValidDt);
            }
        }



        //To disable Future Dates
        $scope.datefunc = function () {
            var rtDt = null,
                today = moment().format(dateFormat),
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat);
            if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
                rtDt = today;
            } else {
                rtDt = lastDate1;
            }
            return rtDt;
        };
        $scope.todayDate = function () {
            return moment().format(dateFormat);
        }


        $scope.onSetDiffPer = function (iInv) {
            iInv.diffval = false;
        }

        //To clear the items if  differential percentage is changed,in case of no items clear to tax values respectively
        $scope.onDiffPerChange = function (iInv) {
            iInv.diffval = false;
            if (iInv.itms.length > 0) {
                iInv.diffval = true;
                $scope.createAlert("Warning", "Applicable % of tax rates got changed. Please add items level details.", function () {
                    iInv.itms = [];
                    $scope.gotoAddItems(iInv);
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }
            shareData.updateToBeEnabled = true;

        }

        //To handle inv_typ CBW - not in use currently
        // $scope.onCBWChange = function (iInv) {
        //     var list = $scope.suplyList;
        //     var prevSuppType = iInv.sply_ty;

        //     if (iInv.inv_typ == 'CBW' || iInv.pos != shareData.dashBoardDt.gstin.slice(0, 2)) {

        //         iInv.sply_ty = "INTER";
        //     } else {

        //         iInv.sply_ty = "INTRA";
        //     }

        //     if (prevSuppType != iInv.sply_ty && iInv.itms && iInv.itms.length > 0) {
        //         $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
        //             iInv.itms = [];
        //             $scope.gotoAddItems(iInv);
        //         });
        //         if ($scope.initSumryList)
        //             $scope.initSumryList();
        //     }
        // }
        $scope.onCBWChangeB2CL = function (iInv) {

            var prevSuppType = iInv.sp_typ.name;


            if (iInv.inv_typ == 'CBW' || iInv.pos != shareData.gstinNum.slice(0, 2)) {
                iInv.sp_typ.name = "Inter-State";
            } else {
                iInv.sp_typ.name = "Intra-State";
            }

            if (prevSuppType != iInv.sp_typ.name && iInv.itms && iInv.itms.length > 0) {

                $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                    iInv.itms = [];
                    $scope.gotoAddItems(iInv);
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }

        }
        //To clear the items if  supply type changed,in case of no items clear to tax values respectively
        $scope.onPosChange = function (iInv, isNew) {
            if (iInv && (iInv.pos || iInv.state_cd || iInv.ctin || iInv.cpty || iInv.sup_ty)) {
                var oldInv = iInv;
                var prvSupplyTyp = iInv.sp_typ,
                    list = $scope.suplyList;
                var tin, code, sup_ty, curntSuplyType;
                if (tableCode == 'b2b' || tableCode == 'b2ba') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                } else if (tableCode == 'b2bur' || tableCode == 'b2bura') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'b2cl' || tableCode == 'b2cla') {
                    tin = $scope.dashBoardDt.gstin;
                    code = iInv.pos;

                }
            else if (tableCode == 'ecomb2b' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2b' || tableCode == 'ecomurp2c'){
                tin = iInv.rtin;
                code = iInv.pos; 
            } else if (tableCode == 'ecomab2b' ||tableCode == 'ecomaurp2b'){
                tin = iInv.rtin;
                code = iInv.pos; 
            }
             else if (tableCode == 'at' || tableCode == 'ata' || tableCode == 'b2csa' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c'  || tableCode == 'txi' || tableCode == 'atxi' || tableCode == 'atadj' || tableCode == 'atadja') {

                    code = iInv.pos;
                    getUniqueInvoice($scope.TaxPayerSummaryList, oldInv, iInv);
                    // $scope.isPosSelectd = (code) ? true : false;
                    return;
                } else if (tableCode == 'b2cs') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'cdnr' || tableCode == 'cdnra') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                } else if (tableCode == 'atadj') {
                    tin = iInv.cpty;
                }
                else if (tableCode == 'itc_rcd') {
                    tin = iInv.stin;
                }

                if (tableCode == "b2cl" || tableCode == "b2cla") {
                    Inv.sp_typ = $scope.suplyList[1];
                    /*if (code) {
                        if (tin.substring(0, 2) === code) {
                            iInv.sp_typ = $scope.suplyList[0];
                        } else {
                            iInv.sp_typ = $scope.suplyList[1];
                        }
                    }*/
                } else {
                    iInv.sp_typ = R1Util.getSupplyType(list, tin, code, isSezTaxpayer, sup_ty);
                    if ((tableCode == "b2b" || tableCode == "b2ba" || tableCode == "cdnr" || tableCode == "cdnra" || tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE')) && !isSezTaxpayer) {
                        iInv.sp_typ = list[1];
                    }
                }
                if (prvSupplyTyp.name !== iInv.sp_typ.name) {

                    if (iInv.itms && iInv.itms.length > 0) {
                        if (tableCode == 'cdnr' || tableCode == 'cdnra' || tableCode == 'ecomb2b' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2b' || tableCode == 'ecomurp2c' || tableCode == 'ecomab2b' ||tableCode == 'ecomaurp2b' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c') {
                            if (iInv.inv_typ != undefined && iInv.inv_typ != null && iInv.inv_typ != "") {
                                //Added by Janhavi CBW+rchrg defect fix
                                if (iInv.inv_typ == "CBW" && iInv.rchrg == "N") {
                                    $scope.createAlert("WarningOk", "Supply type got changed. Please add all the mandatory details to proceed and add item level details again.", function () {
                                        iInv.itms = [];
                                    });
                                }
                                else {
                                    $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                                        iInv.itms = [];
                                        $scope.gotoAddItems(iInv);
                                    });
                                    if ($scope.initSumryList)
                                        $scope.initSumryList();
                                }
                            }
                            else {
                                $scope.createAlert("WarningOk", "Supply type got changed. Please add all the mandatory details to proceed and add item level details again.", function () {
                                    iInv.itms = [];
                                });
                            }
                        }
                    } else {
                        if (isNew) {
                            if(tableCode != "ecomb2b" && tableCode != "ecomurp2b" && tableCode != "ecomab2b" && tableCode !== "ecomaurp2b"){
                            clearTaxRates(1, iInv, 1);
                            }
                            $scope.isIntraState(1, iInv);
                        } else {
                            if(tableCode != "ecomb2b" && tableCode != "ecomurp2b" && tableCode != "ecomab2b" && tableCode !== "ecomaurp2b"){
                            clearTaxRates(0, iInv, 1);
                            }
                            $scope.isIntraState(0, iInv);
                        }
                    }
                }
            }
            getUniqueInvoice($scope.TaxPayerSummaryList, oldInv, iInv);

        }



        //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoice(iList, oldInv, modifiedInv, isIntraStateFn) {
            var returnValue = null,
                iIndex = null;
            if (oldInv) {
                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, form),
                    keys = Object.keys(updatedNodeDetails),
                    oData = angular.copy(iList);

                var idx = keys.indexOf('old_inum');
                if (idx > -1) { keys.splice(idx, 1); }
                var idn = keys.indexOf('old_ntnum');
                if (idn > -1) { keys.splice(idn, 1); }
                if (oData)
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

                if (isIntraStateFn) {
                    var returnObj = {};
                    returnObj.index = iIndex;
                    returnObj.data = returnValue;
                    return returnObj;
                }
            }
            return returnValue;
        }



        //To clear taxrates if pos changed in case of no item level
        function clearTaxRates(isNew, iInv, isSpTypChnge) {

            var stdata = null,
                oData = null,
                exIndex = null;

            if (iInv) {
                if ($scope.isUploadFlag == 'S') {
                    oData = getUniqueInvoice($scope.TaxPayerSummaryList, iInv, iInv, 1);
                    stdata = oData.data;
                    exIndex = oData.index;
                } else {
                    oData = getUniqueInvoiceInRcvrList(iInv, iInv, 1);
                    stdata = oData.data;
                    exIndex = oData.index;

                }
            }

            var invData = (isNew) ? $scope.newInvRw : stdata;

            if (invData) {
                if (invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) {
                    if (isSpTypChnge) {
                        invData.irt = 0;
                        invData.iamt = 0;
                        if (shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_i = 0;
                            invData.itc.tc_i = 0;
                        }
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                } else {
                    if (isSpTypChnge) {
                        invData.crt = 0;
                        invData.camt = 0;
                        invData.srt = 0;
                        invData.samt = 0;
                        if (shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_s = 0;
                            invData.itc.tx_c = 0;
                            invData.itc.tc_c = 0;
                            invData.itc.tc_s = 0;
                        }
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                }

            }

            if (isNew) {
                $scope.newInvRw = invData;
            } else {
                if ($scope.isUploadFlag == "S") {
                    $scope.TaxPayerSummaryList[exIndex] = invData;
                } else {
                    $scope.ReceiverUploadedSummaryList[exIndex] = invData;
                }
            }
        }



        //Navigate to Items Page 
        $scope.gotoAddItems = function (iInv) {
            if (iInv == "add") {
                // if (!frmName) frmName = $scope.newInvFrm;
                if ($scope.newInvFrm.$valid) {
                    var iData = $scope.newInvRw;
                    if (iData.val)
                        iData.val = Number(iData.val);

                    shareData.itmInv = iData;
                    shareData.isNewRec = true;
                    $scope.page("/upload/gstr/items/" + tableCode);
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                shareData.isNewRec = false;
                shareData.isUploadBySuplier = $scope.isUploadFlag;
                if (iInv.val)
                    iInv.val = Number(iInv.val);
                    if (tableCode == 'b2b' || tableCode == 'b2ba' || tableCode == 'cdnr' || tableCode == 'cdnra' || tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b"){
                    if (iInv.inv_typ == 'SEWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
                                obj.itm_det.iamt = 0;
                                obj.itm_det.csamt = 0;
                            } else if (obj.itm_det.camt) {
                                obj.itm_det.camt = 0;
                                obj.itm_det.samt = 0;
                                obj.itm_det.csamt = 0;
                            }

                        });
                    }
                    /* if (iInv.inv_typ == 'DE') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.csamt)
                                obj.itm_det.csamt = 0;
                        });
                    } */
                }
                if (tableCode == 'cdnur' || tableCode == 'cdnura') {
                    if (iInv.typ == 'EXPWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
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
                if (tableCode == "at" || tableCode == "txi" || tableCode == "atadj" || tableCode == "ata" || tableCode == "atadja") {
                    shareData.itmInv = iInv;
                } else {
                    /*  if ($scope.isUploadFlag == "S")
                          shareData.itmInv = getUniqueInvoice($scope.TaxPayerSummaryList, iInv);
                      else
                          shareData.itmInv = getUniqueInvoice($scope.ReceiverUploadedSummaryList, iInv);*/
                    if ($scope.isUploadFlag == "S") {
                        shareData.itmInv = getUniqueInvoice($scope.TaxPayerSummaryList, iInv);
                    } else if (shareData.isUploadFlag == 'R') {
                        shareData.itmInv = getUniqueInvoice($scope.ReceiverUploadedSummaryList, iInv);

                    }
                    else if (shareData.isUploadFlag == 'Modified') {
                        shareData.itmInv = getUniqueInvoice($scope.ReceiverModifiedSummaryList, iInv);

                    }
                    else if (shareData.isUploadFlag == 'Rejected') {
                        shareData.itmInv = getUniqueInvoice($scope.ReceiverRejectedSummaryList, iInv);

                    }
                }


                $scope.page("/upload/gstr/items/" + tableCode);
            }


        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iInv) {
            $scope.hsnNotfromMstr =null;
            // var pgIndex = (($scope.currentPage - 1) * $scope.pageSize) + iIndex;
            if ((iInv.srctyp != '' && iInv.srctyp != undefined) || (iInv.irngendate != '' && iInv.irngendate != undefined) || (iInv.irn != '' && iInv.irn != undefined)) {
                if (iInv.srctyp) delete iInv.srctyp;
                if (iInv.irngendate) delete iInv.irngendate;
                if (iInv.irn) delete iInv.irn;
            }
            var stdata,
                updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, iInv, form);
            if (tableCode == "b2cs" || tableCode == "b2csa" || tableCode == "hsn" || tableCode == "hsnsum" || tableCode == "ecomb2c" || tableCode == "ecomurp2c" || tableCode == "ecomab2c" || tableCode == "ecomaurp2c") {
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
            }
             if (tableCode == "hsn(b2b)" || tableCode == "hsn(b2c)" ){
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
                iInv.rt = Number(iInv.rt);
            }
            if(tableCode == 'supeco' || tableCode == 'supecoa'){
                iInv.suppval = Number(iInv.suppval);
                iInv.igst = Number(iInv.igst);
                iInv.cgst = Number(iInv.cgst);
                iInv.sgst = Number(iInv.sgst);
                iInv.cess = Number(iInv.cess);
                if(iInv.suppval > 0 && (iInv.igst < 0 || iInv.cgst < 0 || iInv.sgst < 0 || iInv.cess < 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    $scope.initSumryList();
                    return;
                } else if (iInv.suppval < 0 && (iInv.igst > 0 || iInv.cgst > 0 || iInv.sgst > 0 || iInv.cess > 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    $scope.initSumryList();
                    return;
                }
            }
            else {
                iInv.val = Number(iInv.val);
            }

            if (iInv.diffval) {
                $scope.createAlert("Warning", "Item level tax amounts may have been updated. Please check and confirm.", function () {
                    $scope.gotoAddItems(iInv);
                    iInv.diffval = false;
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
                return false;
            }

            if (iInv) {
                if ($scope.isUploadFlag == "R" && (tableCode == "b2b" || tableCode == "cdnr" || tableCode == "b2ba" || tableCode == "cdnra"))
                    stdata = getUniqueInvoice($scope.ReceiverUploadedSummaryList, iInv);
                else if ($scope.isUploadFlag == "Modified" && (tableCode == "b2b" || tableCode == "cdnr" || tableCode == "b2ba" || tableCode == "cdnra"))
                    stdata = getUniqueInvoice($scope.ReceiverModifiedSummaryList, iInv);
                else if ($scope.isUploadFlag == "Rejected" && (tableCode == "b2b" || tableCode == "cdnr" || tableCode == "b2ba" || tableCode == "cdnra"))
                    stdata = getUniqueInvoice($scope.ReceiverRejectedSummaryList, iInv);
                else
                    stdata = getUniqueInvoice($scope.TaxPayerSummaryList, iInv);

                // if ($scope.isUploadFlag == "S" && (form == "GSTR2" && (tableCode == "b2b" || tableCode == "cdnr"))) {
                //     stdata = getUniqueInvoiceInSupplrList(iInv);
                // } else {
                //     stdata = getUniqueInvoiceInRcvrList(iInv);
                // }
            }
            if ((stdata.flag || stdata.chksum) && !(tableCode == "supeco" || tableCode == "supecoa" || tableCode == "ecomb2b" || tableCode == "ecomb2c" || tableCode == "ecomurp2b" ||tableCode == "ecomurp2c" || tableCode == "ecomab2b" || tableCode == "ecomab2c" || tableCode == "ecomaurp2b" || tableCode == "ecomaurp2c")) {
                // stdata.flag = "M";
                if ($scope.isUploadFlag == "S")
                    stdata.flag = "E";
                else
                    stdata.flag = "M";

            }

            // $scope.SummaryList[pgIndex] = stdata;

            if (stdata.itms) {
                if ($scope.isUploadFlag == 'R' || $scope.isUploadFlag == 'Modified' || $scope.isUploadFlag == 'Rejected') {
                    R1InvHandler.uploadPayloadUpdate($scope, stdata, updatedNodeDetails, formateNodePayload, $scope.isUploadFlag);
                }
                else {
                    R1InvHandler.uploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload);
                }

            } else {
                if ($scope.isUploadFlag == 'R') {
                    R1InvHandler.emptyItemUploadPayloadUpdate($scope, stdata, updatedNodeDetails, formateNodePayload, $scope.isUploadFlag);
                }
                else
                    R1InvHandler.emptyItemUploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload);
            }
            reloadPage();
        }

        $scope.presetDeleteFlagOrDelete = function () {
            var eInvoicecheck = false;
            var manualAdd = false;
            var Invoice = {};
            for (var i = 0; i < $scope.TaxPayerSummaryList.length; i++) {
                Invoice = $scope.TaxPayerSummaryList[i];
                if ((Invoice.select == "Y" && ((Invoice.irn != "" && Invoice.irn != undefined) || (Invoice.srctyp != "" && Invoice.srctyp != undefined) || (Invoice.irngendate != "" && Invoice.irngendate != undefined)))) {
                    eInvoicecheck = true;
                    break;
                }
                else if (Invoice.select == "Y" && (Invoice.flag == "" || Invoice.flag == undefined)) {
                    manualAdd = true;
                }
            }
            if (!eInvoicecheck) {
                if (manualAdd) {
                    $scope.createAlert("Warning", "Are you sure to delete selected rows.", function () {

                        console.log("list", $scope.TaxPayerSummaryList);
                        $scope.setDeleteFlagOrDelete();
                    });

                }
                else
                    $scope.setDeleteFlagOrDelete();

            }
            else {
                $scope.createAlert("Warning", "You are about to mark for delete document(s) with details auto-populated from e-invoices. Are you sure to delete the selected rows?", function () {

                    console.log("list", $scope.TaxPayerSummaryList);
                    $scope.setDeleteFlagOrDelete();
                });
            }
        }
        // $scope.getLastFour = function (irm){
        //     return irn.substring(60);
        // }
        //This method will delete multiple inv
        $scope.setDeleteFlagOrDelete = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.TaxPayerSummaryList, function (inv) {
                if (inv.select !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form));
                }
            });

            if (invdltArray.length > 0) {

                R1InvHandler.uploadSetDeleteOrDelete($scope, rtArry, invdltArray).then(function (response) {
                    $scope.TaxPayerSummaryList = angular.copy(response);
                    $scope.selectAll = 'N';
                    $scope.checked.selectall = 'N'
                    shareData.checkCount = 0;
                });
                reloadPage();
            } else {
                $scope.createAlert("WarningOk", "Please Select Atleast one item", function () { });
            }
        }

        function reloadPage() {
            if ($scope.sectionListSelected.url[0] !== '/') {
                $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
            }
        }

        //To Update status in UI
        $scope.isActionTaken = function (flag) {
            if (flag) {
                return (flag == "A" || flag == "R" || flag == "M" || flag == "P") ? true : false;
            }
        }


        //To disable the accept/reject Button if no need of accept/reject 

        $scope.isAllActionTaken = function () {
            var count = 0;
            angular.forEach($scope.SummaryList, function (inv, i) {
                if (inv.flag == "" || !inv.flag || inv.flag == "N") {
                    count += 1;
                }
            })
            return (count) ? true : false;

        }

        $scope.dashbrdGstn = shareData.dashBoardDt.gstin.substring(0, 2);
        $scope.isIntraStateB2CS = function (obj) {
            if (obj.pos == $scope.dashbrdGstn && !isSezTaxpayer)
                return true;
            return false;

        };

        //checking of supplytype in order to disable the tax values respectively
        $scope.isIntraState = function (isNew, iInv) {
            var oData, invData;
            if (iInv) {
                oData = getUniqueInvoice($scope.TaxPayerSummaryList, iInv, iInv, 1);
                invData = oData.data;
                //pgIndex = getUniqueInvoice(iInv, iInv, 1).index;
            }

            if (isNew) {
                return ($scope.newInvRw.sply_ty === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            } else if (invData) {
                return (invData && invData.sply_ty === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }


        //To add new invoice 
        $scope.savePayload = function (frmName) {
            $scope.hideaddBtn = false;
            $scope.hsnNotfromMstr =null;
            if (!frmName) {
                frmName = $scope.newInvFrm
            }
            var newInvoice = angular.copy($scope.newInvRw);
            if (tableCode == "b2cs" || tableCode == "b2csa" || tableCode == 'ecomb2c' || tableCode == 'ecomurp2c') {
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
            } else {
                newInvoice.val = Number(newInvoice.val);
            }
            if ( tableCode == 'supeco' || tableCode == 'supecoa') {
                newInvoice.suppval = Number(newInvoice.suppval);
                newInvoice.igst = Number(newInvoice.igst);
                newInvoice.cgst = Number(newInvoice.cgst);
                newInvoice.sgst = Number(newInvoice.sgst);
                newInvoice.cess = Number(newInvoice.cess);
                if(newInvoice.suppval > 0 && (newInvoice.igst < 0 || newInvoice.cgst < 0 || newInvoice.sgst < 0 || newInvoice.cess < 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    return;
                } else if (newInvoice.suppval < 0 && (newInvoice.igst > 0 || newInvoice.cgst > 0 || newInvoice.sgst > 0 || newInvoice.cess > 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    return;
                }
            }
            if (tableCode == 'hsn(b2b)' || tableCode == 'hsn(b2c)') {
                var iLen = $scope.TaxPayerSummaryList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
                if (newInvoice.rt) {
                    newInvoice.rt = Number(newInvoice.rt);
                }
            }
            if (tableCode == 'hsn' || tableCode == 'hsnsum') {
                var iLen = $scope.TaxPayerSummaryList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);

                if (newInvoice.rt) {
                    newInvoice.rt = Number(newInvoice.rt);
                }
            }

            if (frmName.$valid) {
                var stdata = angular.copy(newInvoice);
                if (stdata) {
                    R1InvHandler.emptyItemUploadAdd($scope, stdata, formateNodePayload).then(function (response) {
                        if (response) {
                            $scope.TaxPayerSummaryList.push(newInvoice);
                            $scope.newInvValidtr = false;
                            $scope.hsnsaveedit = false;
                            $scope.isHsnSelected = false;
                            initNewInvRow();
                        }
                    });
                }
            } else {
                $scope.newInvValidtr = true;
            }
        }

        //This method will accept/Reject multiple inv 
        $scope.updateSelectedRows = function (iFlag) {
            
            var rtArry = [],
                invdltArray = [],
                updatedNodeDetails = null,
                iMsg;
            if (iFlag == 'A') {
                iMsg = "Are you sure you want to accept selected invoice/s";
            } else if (iFlag == 'R') {
                iMsg = "Are you sure you want to reject selected invoice/s";
            }
            if (iFlag == 'P') {
                iMsg = "Are you sure you want to mark selected invoice/s as Pending";
            }
            if (iFlag == 'A' /*|| iFlag == 'P'*/) {

                if ($scope.ReceiverUploadedSummaryList) {
                    var tmp = $scope.ReceiverUploadedSummaryList.length;

                    for (var i = 0; i < tmp; i++) {
                        if ($scope.ReceiverUploadedSummaryList[i].select == 'Y' && ($scope.ReceiverUploadedSummaryList[i].flag == 'M' || $scope.ReceiverUploadedSummaryList[i].flag == 'm')) {
                            if (iFlag == 'A') {
                                $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be Accepted. You should first Reject the invoice.", function () { });
                            }/* else {
                            $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be marked as Pending. You should first Reject the invoice.", function () { });
                        }*/
                            return;
                        }
                    }
                }

                if ($scope.ReceiverModifiedSummaryList) {
                    var tmp = $scope.ReceiverModifiedSummaryList.length;
                    for (var i = 0; i < tmp; i++) {
                        if ($scope.ReceiverModifiedSummaryList[i].select == 'Y' && ($scope.ReceiverModifiedSummaryList[i].flag == 'M' || $scope.ReceiverModifiedSummaryList[i].flag == 'm')) {
                            if (iFlag == 'A') {
                                $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be Accepted. You should first Reject the invoice.", function () { });
                            }/* else {
                            $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be marked as Pending. You should first Reject the invoice.", function () { });
                        }*/
                            return;
                        }
                    }
                }
                if ($scope.ReceiverRejectedSummaryList) {
                    var tmp = $scope.ReceiverRejectedSummaryList.length;
                    for (var i = 0; i < tmp; i++) {
                        if ($scope.ReceiverRejectedSummaryList[i].select == 'Y' && ($scope.ReceiverRejectedSummaryList[i].flag == 'M' || $scope.ReceiverRejectedSummaryList[i].flag == 'm')) {
                            if (iFlag == 'A') {
                                $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be Accepted. You should first Reject the invoice.", function () { });
                            }/* else {
                            $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be marked as Pending. You should first Reject the invoice.", function () { });
                        }*/
                            return;
                        }
                    }
                }

            }


            $scope.createAlert("Warning", iMsg, function () {
                angular.forEach($scope.ReceiverUploadedSummaryList, function (inv) {
                    if (inv.flag && inv.select == 'Y') {
                        inv['isActed'] = "Y";
                        if (iFlag == "A") {
                            inv.flag = "A";
                        } else if (iFlag == "R") {
                            inv.flag = "R";
                        }
                        else if (iFlag == "P") {
                            inv.flag = "P";
                        }
                        updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form);
                        invdltArray.push(updatedNodeDetails);
                        rtArry.push(inv);
                    }
                });

                angular.forEach($scope.ReceiverModifiedSummaryList, function (inv) {
                    if (inv.flag && inv.select == 'Y') {
                        inv['isActed'] = "Y";
                        if (iFlag == "A") {
                            inv.flag = "A";
                        } else if (iFlag == "R") {
                            inv.flag = "R";
                        }
                        else if (iFlag == "P") {
                            inv.flag = "P";
                        }
                        updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form);
                        invdltArray.push(updatedNodeDetails);
                        rtArry.push(inv);
                    }
                });
                angular.forEach($scope.ReceiverRejectedSummaryList, function (inv) {
                    if (inv.flag && inv.select == 'Y') {
                        inv['isActed'] = "Y";
                        if (iFlag == "A") {
                            inv.flag = "A";
                        } else if (iFlag == "R") {
                            inv.flag = "R";
                        }
                        else if (iFlag == "P") {
                            inv.flag = "P";
                        }
                        updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form);
                        invdltArray.push(updatedNodeDetails);
                        rtArry.push(inv);
                    }
                });

                if (rtArry.length > 0 && invdltArray.length > 0) {
                    R1InvHandler.updateAccptdRjctdInvoices($scope, rtArry, invdltArray, formateNodePayload, iFlag).then(function () {
                        //                        $scope.page('/gstr/upload/summary')
                    });

                    $scope.selectAll = "N";
                    if ($scope.sectionListSelected.url[0] !== '/') {
                        $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
                    }
                } else {
                    $scope.createAlert("WarningOk", "Please Select Atleast One Invoice", function () { });
                }
                if ($scope.sectionListSelected.url[0] !== '/') {
                    $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
                }
            });


        }

// Product Master Integration Return Period enabled for upload 
  $scope.supenabled = false;
  $scope.suprtn = false;
  $scope.mstrEnabldt = "01-05-2021";
  $scope.validateUserMstrRtnPrd = function () {
    $scope.checked.selectall = 'N'
    shareData.checkCount = 0;
    var retPrdStr = shareData.MstrProdprd.fp.substring(2) + "-" + shareData.MstrProdprd.fp.substring(0, 2) + "-" + "01";
    var retPrdStrUM = $scope.mstrEnabldt.substring(6) + "-" + $scope.mstrEnabldt.substring(3, 5) + "-" + $scope.mstrEnabldt.substring(0, 2);
    if (new Date(retPrdStr) >= new Date(retPrdStrUM)) {
        $scope.supenabled = true;
        $scope.suprtn = true;
    } else {
        $scope.supenabled = false;
        $scope.suprtn = false;
    }
     
  }
  $scope.prodMstr={};  
  $scope.prodMstr.hsn="";
  $scope.showProdMaster = function(prodData,fromView){
    $("#prodMastAdd").modal({ backdrop: "static" });
        $().blockPage(false);
       
    let descdet = {value :""};
    let descDetail =JSON.stringify(descdet);
    // console.log(descDetail);
    var ix = 0;
    let descriptionstr = ""; 
    if(Array.isArray($scope.TaxPayerSummaryList) && $scope.TaxPayerSummaryList.length){
     let hscIdex =prodData.num;  
     let hasMatch = false;
     for(var i=0;i<$scope.TaxPayerSummaryList.length;++i){
         var ab = $scope.TaxPayerSummaryList[i];
         if(ab.hsn_sc == prodData.hsn_sc){
             hasMatch=true;
             hscIdex = prodData.num;
             break;
         }
     }
     if(Array.isArray($scope.TaxPayerSummaryList) && $scope.TaxPayerSummaryList.length){
        // console.log('Testing Returns');
        // console.log($scope.itemslist);
         for(var x = 0; x<$scope.itemslist.length;++x){
            //  console.log('xx..',x);
            // console.log('Scope key...')  
            // console.log($scope.itemslist[x].key);
            //  console.log('hsc value');
            //  console.log(hscIdex);
             if($scope.itemslist[x].key == hscIdex){
                // console.log('Matched....'); 
                ix = x;
                //  console.log(ix);                         
                 break;
             }
         }
        // ix = $scope.itemslist.some(function(item, i){return item.key ==  hscIdex});
        var descdet1 = hasMatch ? $scope.itemslist[ix] : descDetail.value;// {"value" :""}; 
        // console.log(hasMatch);
        // console.log(ix);
        // console.log('result..');
        // console.log(descdet1['value']);
        var objDesc= JSON.stringify(descdet1);
        // console.log("objDesc",objDesc);
        descriptionstr = (descdet1 == undefined)?"":descdet1['value'];
    }
      
    }
    // $scope.checkHSNInput();
    $scope.getDesc = localStorage.getItem('description');
    $scope.prodMstr.hsn = prodData.hsn_sc;
    $scope.prodMstr.desc = descriptionstr ? descriptionstr : $scope.getDesc;
    $scope.prodMstr.rt = prodData.rt.toString();
    $scope.prodMstr.uqc = prodData.uqc;
    $scope.fromview = fromView;
}

  $scope.sucessmsg = function () {
      $scope.successMessageShow = "";
  }

  $scope.hsnBlurvalidation = function () {
    if (!$scope.hsnsaveedit && $scope.prodMstr.hsn && $scope.prodMstr.hsn.length > 0) {
        $scope.hsnnotselected = true;
    } else {
        $scope.hsnnotselected = false;

    }
}
$scope.afterselecthsnOutward = function (result) {
    $scope.prodMstr.desc = result.n;
    $scope.prodMstr.hsn = result.c;
    $scope.hsnsaveedit = true;
    $scope.checkForServiceHSN(result.c);
    $scope.hsnnotselected = false;
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
//unique prodname check for upload 
$scope.isExistingprdname = function (productName) {

var frmName = $scope.prdmstrFrm;
$scope.duplicaterecord = false;
frmName.productName.$setValidity('duplicate', true);
if (productName) {
    productName = productName.toLowerCase();
}

angular.forEach($scope.savemstr, function (mstrprd) {
    if ((mstrprd.productName && (mstrprd.productName).toLowerCase() == productName)) {

        $scope.duplicaterecord = true;
    }
});
frmName.productName.$setValidity('duplicate', !$scope.duplicaterecord);
return $scope.duplicaterecord;
}



//Product Master integration
$scope.prdresetData = function () {
    $scope.prodMstr.hsn = null;
    $scope.getDesc = null;
    $scope.prodMstr.productName = null;
    $scope.prodMstr.desc = null;
    $scope.prodMstr.uqc = null;
    $scope.prodMstr.rt = null;
    $scope.prdmstrFrm.$setPristine();
    $scope.newInvValidtr = false;
    $scope.duplicaterecord = false;
    // sessionStorage.clear('description');
}

//Save Hsn Table for upload 
$scope.isSaveProd = false;
$scope.saveProduct = function () {
    $scope.savemstr = [];
    var saveobj = {};

    if ($scope.isExistingprdname($scope.prodMstr.productName)) {
        return;
    }
    if ($scope.savemstr.length >= 20) {
        $scope.createAlert(
            "info",
            "You can add maximum 500 records in Product master. Please delete some unwanted records to add more records",
            function () {


            }
        );
    } else {
        if ($scope.prodMstr && $scope.prodMstr.hsn && $scope.prdmstrFrm.$valid) {
            saveobj["hsn"] = $scope.prodMstr.hsn;
            saveobj["productDescription"] = $scope.prodMstr.desc;
            saveobj["productName"] = $scope.prodMstr.productName;
            saveobj["uqc"] = $scope.prodMstr.uqc;
            saveobj["igst"] = Number($scope.prodMstr.rt);

            $scope.savemstr.push(saveobj);

            g1FileHandler.saveProductMstr(shareData.MstrProdprd.gstin, deleteunwantedparams($scope.savemstr), "productsMasters", true).then(
                function (response) {
                    if(!sessionStorage.getItem("supRecipGstin")){
                        sessionStorage.setItem("supRecipGstin", JSON.stringify({supplierRecipientMasters : [],productsMasters:$scope.savemstr}));
                    } else {
                        $scope.supplierRecipientData = JSON.parse(sessionStorage.getItem('supRecipGstin'));
                        $scope.supplierRecipientData.productsMasters = $scope.supplierRecipientData.productsMasters.concat($scope.savemstr);
                        sessionStorage.setItem("supRecipGstin", JSON.stringify($scope.supplierRecipientData));
                    }
                    
                    
                    $scope.successMessageShow = true;
                    window.scroll(0, 0);
                    $timeout(function () {
                        $scope.successMessageShow = false;
                        if (!$scope.fromview) {
                            $scope.newInvRw.productName = $scope.savemstr[0].productName;
                        } else {
                            for (let i in $scope.TaxPayerSummaryList) {
                                if ($scope.TaxPayerSummaryList[i].hsn_sc == $scope.savemstr[0].hsn && $scope.TaxPayerSummaryList[i].uqc == $scope.savemstr[0].uqc && $scope.TaxPayerSummaryList[i].rt == $scope.savemstr[0].igst) {
                                    $scope.TaxPayerSummaryList[i].productName = $scope.savemstr[0].productName;
                                    $scope.updateInvoice($scope.TaxPayerSummaryList[i]);
                                    break;
                                }

                            }
                        }

                        $scope.prodMstr = {};
                        $scope.hsnnotselected = false;
                        $scope.duplicaterecord = false;
                        $('#prodMastAdd').modal('hide');
                        $scope.newInvRw.desc ="";
                        $scope.hideaddBtn = false;
                        $scope.prdmstrFrm.$setPristine();
                        localStorage.clear('description');
                    }, 1500);

                });

        } else {
            $scope.newInvValidtr = true;
        }
    }
}

$scope.setPristine = function (inv, frmName, oldInv) {
    if (tableCode == 'ecomb2c' || tableCode == 'ecomurp2c' || tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c' || tableCode  == 'supeco' || tableCode  == 'supecoa' ) {
        if (oldInv.txval != inv.txval || oldInv.val != inv.val || oldInv.iamt != inv.iamt || oldInv.camt != inv.camt || oldInv.samt != inv.samt || oldInv.csamt != inv.csamt || oldInv.suppval != inv.suppval || oldInv.cgst != inv.cgst || oldInv.sgst != inv.sgst || oldInv.igst != inv.igst || oldInv.cess != inv.cess) 
            frmName.$pristine = false;
        else
            frmName.$pristine = true;
        return;
    }
    if (inv.old_val != inv.val)
        frmName.$pristine = false;
    else
        frmName.$pristine = true;
}
    }
    
]);


myApp.controller("uploadreturnsctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util', '$rootScope',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util, $rootScope) {

        var tableCode = null,
            form = null,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';

        $scope.SupplierSummaryList = [];
        $scope.ReceiverSummaryList = [];
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

            initNewInvRow();
            initSumryList();
        }



        //To init new invoice row
        function initNewInvRow() {
            $scope.newInvRw = ReturnStructure.getNewInv(tableCode, form);

        }

        //Check all implementation
        // $scope.checkAll = function (iLs, iFg) {
        //     angular.forEach(iLs, function (inv) {
        //         if (inv.flag == "N") {
        //             inv.select = iFg;
        //         }
        //     });
        // };

        // Check all implementation
        $scope.DeleteAll = function (iLs, iFg) {
            angular.forEach(iLs, function (inv) {
                inv.DeleteSelect = iFg;
            });
        };

        //Formaters
        if (shareData.dashBoardDt.tbl_cd == "atadj" || shareData.dashBoardDt.tbl_cd == "txi") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }

        //To display empty row in Lastpage only in case of pagination
        $rootScope.isLastPage = function (currentPage, pageSize) {
            if (!$scope.totalAvailable)
                $scope.totalAvailable = 0;
            var isLast = false,
                total = Math.ceil(($scope.totalAvailable / pageSize));
            if (total == currentPage) {
                isLast = true;
            }
            // if no records, we are always on last page.
            if ($scope.totalAvailable == 0)
                return true;
            return isLast;
        }


        function seperateResponse(iResp) {
            var reformedResp = reformateInv(iResp);
            var uploadBySuplrList = [],
                uploadbyRcvrList = [];
            angular.forEach(reformedResp, function (inv, i) {
                if (inv.flag) {
                    uploadBySuplrList.push(inv);
                } else {
                    uploadbyRcvrList.push(inv);
                }
            });
            return {
                uploadbyRcvrData: uploadbyRcvrList,
                uploadBySuplrData: uploadBySuplrList
            }
        }

        $scope.mainData = [];
        $scope.is_disabledCFS = function (ctin, inv) {

            if (inv.cfs == 'Y')
                return true;
            return false;

            //            
            //            for (var i = 0; i < $scope.mainData.length; i++) {
            //                if ($scope.mainData[i].ctin == ctin) {
            //                    if ($scope.mainData[i].cfs == 'Y') {
            //                        return true;
            //                    }
            //                }
            //            }
            //            return false; 
        }

        $scope.$on('filterValChanged', function (e) {
            shareData.pageNum = 1;
            initSumryList();
        });


        //To get list
        function initSumryList() {

            jQuery('.table-responsive').css('opacity', 0.5);

            shareData.isUploadFlag = $scope.isUploadFlag;

            g1FileHandler.getContentsForPaged(
                $scope.dashBoardDt,
                tableCode,
                shareData.pageNum,
                $scope.dashBoardDt.form,
                shareData,
                shareData.filter_val,
                $scope.sortBy,
                $scope.sortReverse,
                'FL2', // to identify second flow, 
                true //  file name will be provided, DO NOT RE_CREATE
            ).then(function (response) {
                jQuery('.table-responsive').css('opacity', 1);


                $scope.totalAvailable = response.count;

                if (tableCode == "b2b" || tableCode == "cdnr") {
                    if (shareData.isUploadFlag == 'R') {
                        $scope.SupplierSummaryList = [];
                        $scope.ReceiverSummaryList = response.rows;
                    } else {
                        $scope.SupplierSummaryList = response.rows;
                        $scope.ReceiverSummaryList = [];
                    }
                } else {
                    $scope.ReceiverSummaryList = response.rows;
                }
                $scope.totalAvailable = response.count;





                // $scope.SummaryList = isNotActionTaken(stdata);

            }, function (response) {
                //                $scope.createAlert("WarningOk", response, function () { });
                jQuery('.table-responsive').css('opacity', 1);
                $log.debug("initSumryList -> initSumryList fail:: ", response);
                //                $scope.page("/gstr/upload/dashboard");
            });
        }
        $scope.initSumryList = initSumryList;





        var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, form),
            formateNodePayload = ReturnStructure.formateNodePayload(tableCode, form),
            getExcelTitle = ReturnStructure.getExcelTitle(tableCode, form),
            getInvKey = ReturnStructure.getInvKey(tableCode, form),
            getInv = ReturnStructure.getInv(tableCode, form),
            getItm = ReturnStructure.getItm(tableCode, form);





        $scope.pageChangeHandler = function (newPage) {
            shareData.pageNum = newPage;

            initSumryList();
            $scope.deleteAll = 'N';
        };

        $scope.sortReverse = false;
        $scope.sort = function (sortKey) {
            $scope.sortBy = sortKey;
            $scope.sortReverse = !$scope.sortReverse;
            initSumryList();
        }

        $scope.onGstinChange = function (gstin, frm) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.ctin.$setValidity('pattern', true);
                return;  
            }
            if (form == 'GSTR1'){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.nrtp(gstin);}
            else
                $scope.validGstin = $scope.validations.gstin(gstin);

            $scope.newInvFrm.ctin.$setValidity('pattern', $scope.validGstin);
            $scope.gstinRecordAdd = false;
        }


        //To disable Previous years
        $scope.minDate = function () {
            var firstMonth = $scope.monthList[0],
                temp = "01" + firstMonth.value.slice(0, 2) + firstMonth.value.slice(2),
                firstDate = moment(temp, dateFormat),
                firstDate1 = firstDate.format(dateFormat);
            return firstDate1;
        };


        // //sorting functionality
        // $scope.sortReverse = false;
        // $scope.sort = function (sortKey) {
        //     $scope.sortBy = sortKey;
        //     $scope.sortReverse = !$scope.sortReverse;
        // }

        //To check receiver gstin n supplier gstin r same
        $scope.isRecGstnAsSupGstn = function (isNew, ctin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            $scope.isDiffCtin = ($scope.dashBoardDt.gstin == ctin) ? true : false;

            if (frmName.ctin) {
                frmName.ctin.$setValidity('ctin', !$scope.isDiffCtin);
            }
            $scope.gstinRecordAdd = false;
            //return isDiffCtin;
        }
        //duplicate invoice check
        $scope.isExistingInv = function (iNum) {
            var isExistInv = false;
            angular.forEach($scope.SummaryList, function (inv, i) {
                if ((inv.onum && inv.onum.toLowerCase() == iNum.toLowerCase()) || (inv.inum && inv.inum.toLowerCase() == iNum.toLowerCase()) || (inv.doc_num && inv.doc_num.toLowerCase() == iNum.toLowerCase()) || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum.toLowerCase())) {
                    isExistInv = true;
                }
            });
            return (isExistInv) ? true : false;
        }

        $scope.spTypChange = function (isNew, iInv) {
            if (shareData.dashBoardDt.form == "GSTR2" && tableCode == "itc_rcd") {
                clearTaxRatesOfItc_rcd(isNew, iInv, true);
            } else {
                clearTaxRates(isNew, iInv, true);
            }
        }

        $scope.onPosChangeB2BUR = function (y) {
            var isIntra = $scope.isIntraStateB2BUR(y);
            if (isIntra) {
                y.sp_typ = $scope.suplyList[0];

            } else {
                y.sp_typ = $scope.suplyList[1];

            }
        };

        $scope.isIntraStateB2BUR = function (obj) {
            if (obj.pos == shareData.dashBoardDt.gstin.substring(0, 2))
                return true;
            return false;

        };

        //to disable pos if type is regd in case of txi n atxi in gstr2
        $scope.isRegd = function (iInv) {
            return (iInv.state_cd && iInv.reg_type == "REGD") ? true : false;
        }

        //IMPS supply type condition for cdnur
        $scope.invTypeChanged = function (inv) {
            if (inv.inv_typ == "IMPS") {
                inv.sp_typ = $scope.suplyList[1];
            }

        }
        //cdn change in supply type
        $scope.change_suptyp = function (iInv) {
            if (iInv.itms && iInv.itms.length > 0) {
                iInv.itms = [];
            }
        }

        $scope.isLessThanOrgInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var sbdtOrOdt = null,
                idtOrRevdt = null;
            if (((tableCode == "b2ba") && shareData.dashBoardDt.form == "GSTR2") || tableCode == "b2bura") {
                sbdtOrOdt = iInv.oidt;
                idtOrRevdt = iInv.idt;
            }
            if (tableCode == "cdnra") {
                sbdtOrOdt = iInv.ont_dt;
                idtOrRevdt = iInv.nt_dt;
            }
            if (tableCode == "atxi") {
                sbdtOrOdt = iInv.otdt;
                idtOrRevdt = iInv.dt;
            }
            if (tableCode == "imp_ga") {
                sbdtOrOdt = iInv.oboe_dt;
                idtOrRevdt = iInv.boe_dt;
            }
            if (tableCode == "imp_sa") {
                sbdtOrOdt = iInv.oi_dt;
                idtOrRevdt = iInv.i_dt;
            }
            var isValidDt = (moment(idtOrRevdt, dateFormat).isBefore(moment(sbdtOrOdt, dateFormat))) ? false : true;
            if (frmName.idt) {
                frmName.idt.$setValidity('idt', isValidDt);
            }
            if (frmName.nt_dt) {
                frmName.nt_dt.$setValidity('nt_dt', isValidDt);
            }
            if (frmName.doc_dt) {
                frmName.doc_dt.$setValidity('doc_dt', isValidDt);
            }
            if (frmName.boe_dt) {
                frmName.boe_dt.$setValidity('boe_dt', isValidDt);
            }
            if (frmName.i_dt) {
                frmName.i_dt.$setValidity('i_dt', isValidDt);
            }
            if (frmName.dt) {
                frmName.dt.$setValidity('dt', isValidDt);
            }
        }



        //To disable Future Dates
        $scope.datefunc = function () {
            var rtDt = null,
                today = moment().format(dateFormat),
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat);
            if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
                rtDt = today;
            } else {
                rtDt = lastDate1;
            }
            return rtDt;
        };
        $scope.todayDate = function () {
            return moment().format(dateFormat);
        }


        //To clear the items if  supply type changed,in case of no items clear to tax values respectively
        $scope.onPosChange = function (iInv, isNew) {
            if (iInv && (iInv.pos || iInv.state_cd || iInv.ctin || iInv.cpty || iInv.sup_ty)) {
                var oldInv = iInv;
                var prvSupplyTyp = iInv.sp_typ,
                    list = $scope.suplyList;
                var tin, code, sup_ty, curntSuplyType;
                if (tableCode == 'b2b' || tableCode == 'b2ba') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                } else if (tableCode == 'b2bur' || tableCode == 'b2bura') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'b2cl' || tableCode == 'b2cla') {
                    tin = $scope.dashBoardDt.gstin;
                    code = iInv.pos;

                }
                else if (tableCode == 'at' || tableCode == 'ata' || tableCode == 'txi' || tableCode == 'atxi' || tableCode == 'atadj') {

                    tin = iInv.cpty;
                    code = iInv.pos;
                    getUniqueInvoice(oldInv, iInv);
                    $scope.isPosSelectd = (code) ? true : false;
                    return;
                } else if (tableCode == 'b2cs' || tableCode == 'b2csa') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'cdnr' || tableCode == 'cdnra') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                } else if (tableCode == 'atadj') {
                    tin = iInv.cpty;
                }
                else if (tableCode == 'itc_rcd') {
                    tin = iInv.stin;
                }

                if (tableCode == "b2cl" || tableCode == "b2cla") {
                    if (code) {
                        if (tin.substring(0, 2) === code) {
                            iInv.sp_typ = $scope.suplyList[0];
                        } else {
                            iInv.sp_typ = $scope.suplyList[1];
                        }
                    }
                } else {
                    iInv.sp_typ = R1Util.getSupplyType(list, tin, code, sup_ty);
                    if ((tableCode == "b2b" || tableCode == "b2ba") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE')) && !isSezTaxpayer) {
                        iInv.sp_typ = list[1];
                    }
                }

                if (tableCode == "cdnr" || tableCode == "cdnra" || tableCode == "atadj") {
                    code = tin;
                }
                if (prvSupplyTyp.name !== iInv.sp_typ.name) {

                    if (iInv.itms && iInv.itms.length > 0) {
                        $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                            iInv.itms = [];
                            $scope.gotoAddItems(iInv);
                        });
                        if ($scope.initSumryList)
                            $scope.initSumryList();
                    } else {
                        if (isNew) {
                            if(tableCode != "ecomb2b" && tableCode != "ecomurp2b" && tableCode != "ecomab2b" && tableCode !== "ecomaurp2b"){
                            clearTaxRates(1, iInv, 1);
                            }
                            $scope.isIntraState(1, iInv);
                        } else {
                            if(tableCode != "ecomb2b" && tableCode != "ecomurp2b" && tableCode != "ecomab2b" && tableCode !== "ecomaurp2b"){
                            clearTaxRates(0, iInv, 1);
                            }
                            $scope.isIntraState(0, iInv);
                        }
                    }
                }
            }
            if ($scope.isUploadFlag == 'S')
                getUniqueInvoiceInSupplrList(oldInv, iInv);
            else
                getUniqueInvoiceInRcvrList(oldInv, iInv);

            $scope.isPosSelectd = (code) ? true : false;
        }


        //in order to autopoulate pos based on ctin
        $scope.getPosBasedOnCtin = function (iInv) {
            if (iInv.ctin) {
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == iInv.ctin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

        $scope.invTypeSelected = function (rowObj) {
            if (rowObj.inv_typ != 'R') {
                rowObj.etin = null;
                rowObj.rchrg = 'N';
            }
        };
        $scope.sezimp = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflag = true;

            }
            else {
                $scope.sezflag = false;
                delete obj.ctin;
            }
        }

        $scope.sezimpnew = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflagnew = true;

            }
            else {
                $scope.sezflagnew = false;
                delete obj.ctin;
            }
        }

        //duplicate POS check
        $scope.isExistingPos = function (isNew, iPos, frm) {
            var isExistPos = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;

            angular.forEach($scope.ReturnsList, function (inv, i) {
                if ((inv.pos && inv.pos == iPos)) {
                    isExistPos = true;
                }
            });
            frmName.supst_cd.$setValidity('supst_cd', !isExistPos);
        }

        //validation for same description and hsn in hsn
        $scope.isDescSameAsHsn = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isDiffDesc = (inv.hsn_sc && inv.desc && inv.hsn_sc == inv.desc) ? false : true;

            if (frmName.desc) {

                frmName.desc.$setValidity('desc', isDiffDesc);
            }
            //return isDiffCtin;
        }

        $scope.isExistingDesc2 = function (isNew, iDesc, iHsn, uqc, frm) {
            if (!iDesc)
                iDesc = '';

            if (!iHsn)
                iHsn = '';
            var isExistDesc = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;


            frmName.desc.$setValidity('duplicate', true);
            frmName.uqc.$setValidity('duplicate', true);
            frmName.hsn_sc.$setValidity('duplicate', true);

            // if (iDesc) {
            if (isNew == 1) {
                angular.forEach($scope.ReceiverSummaryList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if (!inv.desc)
                        inv.desc = '';
                    if (
                        ((inv.desc).toLowerCase() == (iDesc).toLowerCase())

                        &&
                        (inv.hsn_sc == iHsn)
                        &&
                        (inv.uqc == uqc)

                    ) {
                        isExistDesc = true;
                    }
                });
                frmName.desc.$setValidity('duplicate', !isExistDesc);
                frmName.uqc.$setValidity('duplicate', !isExistDesc);
                frmName.hsn_sc.$setValidity('duplicate', !isExistDesc);
            } else {
                var cnt = 0;
                angular.forEach($scope.ReceiverSummaryList, function (inv, i) {
                    if (!inv.hsn_sc)
                        inv.hsn_sc = '';
                    if ((((inv.desc).toLowerCase() == (iDesc).toLowerCase()) && (inv.hsn_sc == iHsn) && (inv.uqc == uqc))) {
                        isExistDesc = true;
                        cnt++;
                    }
                });
                if (cnt > 1) {
                    frmName.desc.$setValidity('duplicate', !isExistDesc);
                    frmName.uqc.$setValidity('duplicate', !isExistDesc);
                    frmName.hsn_sc.$setValidity('duplicate', !isExistDesc);
                }
            }


        }

        //To check either hsn or desc as mandatory
        $scope.isRequiredField = function (inv, isHsn) {

            var isRequired;
            if (inv) {
                if (isHsn) {
                    isRequired = (inv.hsn_sc) ? false : true;
                }
                else {
                    isRequired = (inv.desc) ? false : true;
                }
            }
            return isRequired;
        }


        //To check either hsn or desc as mandatory

        $scope.isRequiredField2 = function (inv, isHsn, checking_for) {

            var isRequired;
            if (inv) {
                if (checking_for == 'camt' || checking_for == 'samt') {
                    isRequired = (inv.iamt && inv.iamt != '') ? false : true;
                }
                else {
                    isRequired = ((inv.samt && inv.samt != '') || (inv.camt && inv.camt != '')) ? false : true;
                }
            }
            return isRequired;
        }

        //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoiceInSupplrList(oldInv, modifiedInv, isIntraStateFn) {
            var returnValue = null,
                iIndex = null;
            if (oldInv) {
                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, form),
                    keys = Object.keys(updatedNodeDetails),
                    oData = angular.copy($scope.SupplierSummaryList);

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

                if (isIntraStateFn) {
                    var returnObj = {};
                    returnObj.index = iIndex;
                    returnObj.data = returnValue;
                    return returnObj;
                }
            }
            return returnValue;
        }

        //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoiceInRcvrList(oldInv, modifiedInv, isIntraStateFn) {
            var returnValue = null,
                iIndex = null;
            if (oldInv) {
                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, form),
                    keys = Object.keys(updatedNodeDetails),
                    oData = angular.copy($scope.ReceiverSummaryList);

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

                if (isIntraStateFn) {
                    var returnObj = {};
                    returnObj.index = iIndex;
                    returnObj.data = returnValue;
                    return returnObj;
                }
            }
            return returnValue;
        }

        //To clear taxrates if pos changed in case of no item level
        function clearTaxRates(isNew, iInv, isSpTypChnge) {

            var stdata = null,
                oData = null,
                exIndex = null;

            if (iInv) {
                if ($scope.isUploadFlag == 'S') {
                    oData = getUniqueInvoiceInSupplrList(iInv, iInv, 1);
                    stdata = oData.data;
                    exIndex = oData.index;
                } else {
                    oData = getUniqueInvoiceInRcvrList(iInv, iInv, 1);
                    stdata = oData.data;
                    exIndex = oData.index;

                }
            }

            var invData = (isNew) ? $scope.newInvRw : stdata;

            if (invData) {
                if (invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) {
                    if (isSpTypChnge) {
                        invData.irt = 0;
                        invData.iamt = 0;
                        if (shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_i = 0;
                            invData.itc.tc_i = 0;
                        }
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                } else {
                    if (isSpTypChnge) {
                        invData.crt = 0;
                        invData.camt = 0;
                        invData.srt = 0;
                        invData.samt = 0;
                        if (shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_s = 0;
                            invData.itc.tx_c = 0;
                            invData.itc.tc_c = 0;
                            invData.itc.tc_s = 0;
                        }
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                }

            }

            if (isNew) {
                $scope.newInvRw = invData;
            } else {
                if ($scope.isUploadFlag == "S") {
                    $scope.SupplierSummaryList[exIndex] = invData;
                } else {
                    $scope.ReceiverSummaryList[exIndex] = invData;
                }
            }
        }

        //To clear taxrates if pos changed in case of no item level only for itc_rcd(GSTR2)
        function clearTaxRatesOfItc_rcd(isNew, iInv, isSpTypChnge) {

            var stdata = null,
                oData = null,
                exIndex = null;

            if (iInv) {
                oData = getUniqueInvoice(iInv, iInv, 1);
                stdata = oData.data;
                exIndex = oData.index;
            }

            var invData = (isNew) ? $scope.newInvRw : stdata;

            if (invData) {
                if (invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) {
                    if (isSpTypChnge) {
                        invData.o_ig = 0;
                        invData.n_ig = 0;
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                } else {
                    if (isSpTypChnge) {
                        invData.o_cg = 0;
                        invData.n_cg = 0;
                        invData.o_sg = 0;
                        invData.n_sg = 0;
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                }

            }

            if (isNew) {
                $scope.newInvRw = invData;
            } else {
                $scope.ReturnsList[exIndex] = invData;
            }
        }


        //Navigate to Items Page 
        $scope.gotoAddItems = function (iInv) {
            if (iInv == "add") {

                if ($scope.newInvFrm.$valid) {
                    var iData = $scope.newInvRw;
                    if (iData.val)
                        iData.val = Number(iData.val);
                    shareData.itmInv = iData;
                    shareData.isNewRec = true;
                    $scope.page("/upload/gstr/items/" + tableCode);
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {
                if (iInv.val)
                    iInv.val = Number(iInv.val);
                if (tableCode == 'b2b' || tableCode == 'cdnr') {
                    if (iInv.inv_typ == 'SEWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
                                obj.itm_det.iamt = 0;
                                obj.itm_det.csamt = 0;
                            } else if (obj.itm_det.camt) {
                                obj.itm_det.camt = 0;
                                obj.itm_det.samt = 0;
                                obj.itm_det.csamt = 0;
                            }

                        });
                    }
                    /* if (iInv.inv_typ == 'DE') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.csamt)
                                obj.itm_det.csamt = 0;
                        });
                    } */
                }
                shareData.isNewRec = false;
                shareData.isUploadBySuplier = $scope.isUploadFlag;
                if ($scope.isUploadFlag == "S" && (tableCode == "b2b" || tableCode == "cdnr")) {
                    shareData.itmInv = getUniqueInvoiceInSupplrList(iInv); //$scope.SupplierSummaryList[pgIndex];
                } else {
                    shareData.itmInv = getUniqueInvoiceInRcvrList(iInv); //$scope.ReceiverSummaryList[pgIndex];
                }

                $scope.page("/upload/gstr/items/" + tableCode);
            }


        }


        //To update Invoices at level1
        $scope.updateInvoice = function (iInv) {
            $scope.hsnNotfromMstr =null;
            // var pgIndex = (($scope.currentPage - 1) * $scope.pageSize) + iIndex;

            var stdata;
            if (tableCode == "b2cs" || tableCode == "b2csa" || tableCode == "hsn" || tableCode == "hsnsum" || tableCode == "ecomb2c" || tableCode == "ecomurp2c") {
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
            }
            if (tableCode == "hsn(b2b)" || tableCode == "hsn(b2c)") {
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
                iInv.rt = Number(iInv.rt);
            }
            else {
                iInv.val = Number(iInv.val);
            }
            if (iInv) {
                if ($scope.isUploadFlag == "S" && (tableCode == "b2b" || tableCode == "cdnr")) {
                    stdata = getUniqueInvoiceInSupplrList(iInv);
                } else {
                    stdata = getUniqueInvoiceInRcvrList(iInv);
                }
            }

            if (stdata.flag || stdata.chksum) {
                if ($scope.isUploadFlag == "S")
                    stdata.flag = "M";
                else
                    stdata.flag = "E";
            }

            // if ($scope.isUploadFlag == "S" && (tableCode == "b2b" || tableCode == "cdnr")) {
            //     $scope.SupplierSummaryList[pgIndex] = stdata;
            // }
            // else {
            //     $scope.ReceiverSummaryList[pgIndex] = stdata;
            // }


            // $scope.SummaryList[pgIndex] = stdata;
            var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, stdata, form);
            if (stdata.itms) {

                if ($scope.isUploadFlag == 'S') {
                    R1InvHandler.uploadPayloadUpdate($scope, stdata, updatedNodeDetails, formateNodePayload, $scope.isUploadFlag);
                }
                else {
                    R1InvHandler.uploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload);
                }

            } else {
                if ($scope.isUploadFlag == 'S') {
                    R1InvHandler.emptyItemUploadPayloadUpdate($scope, stdata, updatedNodeDetails, formateNodePayload, $scope.isUploadFlag);
                }
                else
                    R1InvHandler.emptyItemUploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload);
            }
        }


        //To Update status in UI
        $scope.isActionTaken = function (flag) {
            if (flag) {
                return (flag == "A" || flag == "R" || flag == "M" || flag == "P") ? true : false;
            }
        }


        //To disable the accept/reject Button if no need of accept/reject 

        $scope.isAllActionTaken = function () {
            var count = 0;
            angular.forEach($scope.SummaryList, function (inv, i) {
                if (inv.flag == "" || !inv.flag || inv.flag == "N") {
                    count += 1;
                }
            })
            return (count) ? true : false;

        }

        //To disable itc if not eligible(GSTR2)
        $scope.isEligible = function (iElg) {
            return (!iElg || iElg == "none") ? true : false;
        }

        //To clear values if eligiblity changed as none
        $scope.elgBltyChange = function (iItm) {
            var elg = iItm.itc.elg;

            if (elg == "none" && iItm.sp_typ.name == "Intra-State") {
                iItm.itc.tx_c = 0.00;
                iItm.itc.tx_s = 0.00;
                iItm.itc.tx_cs = 0.00;
                iItm.itc.tc_c = 0.00;
                iItm.itc.tc_s = 0.00;
                iItm.itc.tc_cs = 0.00;
            } else if (elg == "none" && iItm.sp_typ.name == "Inter-State") {
                iItm.itc.tx_i = 0.00;
                iItm.itc.tx_cs = 0.00;
                iItm.itc.tc_i = 0.00;
                iItm.itc.tc_cs = 0.00;
            }
        }

        //to check itc values less than igst n sgst n cgst
        $scope.validity = function (isNew, iItm, frm) {
            var flag = false,
                fldname, curItm;
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iItm.itm_det) {
                curItm = iItm.itm_det;
            } else {
                curItm = iItm;
            }
            if (iItm) {
                fldname = ['tx_i', 'tc_i', 'tx_c', 'tc_c', 'tx_s', 'tc_s', 'tx_cs', 'tc_cs'];
                for (var i = 0; i < fldname.length; i++) {
                    frmName[fldname[i]].$setValidity('pattern', true);
                }

                if (parseFloat(iItm.itc.tx_i) > parseFloat(curItm.iamt)) {
                    frmName.tx_i.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItm.itc.tc_i) > parseFloat(iItm.itc.tx_i)) {
                    frmName.tc_i.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItm.itc.tx_c) > parseFloat(curItm.camt)) {
                    frmName.tx_c.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItm.itc.tc_c) > parseFloat(iItm.itc.tx_c)) {
                    frmName.tc_c.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItm.itc.tx_s) > parseFloat(curItm.samt)) {
                    frmName.tx_s.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItm.itc.tc_s) > parseFloat(iItm.itc.tx_s)) {
                    frmName.tc_s.$setValidity('pattern', false);
                    flag = true;
                }

                if (parseFloat(iItm.itc.tx_cs) > parseFloat(curItm.csamt)) {
                    frmName.tx_cs.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItm.itc.tc_cs) > parseFloat(iItm.itc.tx_cs)) {
                    frmName.tc_cs.$setValidity('pattern', false);
                    flag = true;
                }
            }
            return flag;
        }


        //to check itc availed this month less than itc availed earlier
        $scope.validityForItc_rcd = function (isNew, iInv, frm) {
            var flag = false,
                fldname;
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            if (iInv) {
                fldname = ['n_ig', 'n_cg', 'n_sg', 'n_cs'];
                for (var i = 0; i < fldname.length; i++) {
                    frmName[fldname[i]].$setValidity('pattern', true);
                }

                if (parseFloat(iInv.n_ig) > parseFloat(iInv.o_ig)) {
                    frmName.n_ig.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iInv.n_cg) > parseFloat(iInv.o_cg)) {
                    frmName.n_cg.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iInv.n_sg) > parseFloat(iInv.o_sg)) {
                    frmName.n_sg.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iInv.n_cs) > parseFloat(iInv.o_cs)) {
                    frmName.n_cs.$setValidity('pattern', false);
                    flag = true;
                }
            }
            return flag;
        }


        //To set default values for itc in case of accept
        function setDefaultValues(iItm) {
            var itmDet, itcDet;
            if (iItm.itm_det && iItm.itc) {
                itmDet = iItm.itm_det;
                itcDet = iItm.itc;
            } else {
                itmDet = iItm;
                itcDet = iItm.itc;
            }
            if (itcDet.tx_i == 0) {
                itcDet.tx_i = itmDet.iamt;
            }
            if (itcDet.tx_s == 0) {
                itcDet.tx_s = itmDet.samt;
            }
            if (itcDet.tx_c == 0) {
                itcDet.tx_c = itmDet.camt;
            }
            if (itcDet.tx_cs == 0) {
                itcDet.tx_cs = itmDet.csamt;
            }
            if (itcDet.tc_i == 0) {
                itcDet.tc_i = itmDet.iamt;
            }
            if (itcDet.tc_s == 0) {
                itcDet.tc_s = itmDet.samt;
            }
            if (itcDet.tc_c == 0) {
                itcDet.tc_c = itmDet.camt;
            }
            if (itcDet.tc_cs == 0) {
                itcDet.tc_cs = itmDet.csamt;
            }

            return iItm;
        }

        //To set default values for itc in case of accept
        function setDefaultITcAsTaxpaidAmount(oData) {
            if (oData) {
                if (oData.itms) {
                    angular.forEach(oData.itms, function (itm, i) {
                        itm = setDefaultValues(itm);
                    });
                } else {
                    oData = setDefaultValues(oData);
                }
                return oData;
            }
        }

        //This method will accept/Reject multiple inv 
        $scope.updateSelectedRows = function (iFlag) {
            var rtArry = [],
                invdltArray = [],
                updatedNodeDetails = null,
                iMsg;
            if (iFlag == 'A') {
                iMsg = "Are you sure you want to accept selected invoice/s<br /><b>Note:</b>Please make sure you verify ITC eligibility before accepting the invoice/s.";
            } else if (iFlag == 'R') {
                iMsg = "Are you sure you want to reject selected invoice/s";
            } if (iFlag == 'P') {
                iMsg = "Are you sure you want to mark selected invoice/s as Pending";
            }
            if (iFlag == 'A' /*|| iFlag == 'P'*/) {
                var tmp = $scope.SupplierSummaryList.length;
                for (var i = 0; i < tmp; i++) {
                    if ($scope.SupplierSummaryList[i].select == 'Y' && ($scope.SupplierSummaryList[i].flag == 'M' || $scope.SupplierSummaryList[i].flag == 'm')) {
                        if (iFlag == 'A') {

                            $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be Accepted. You should first Reject the invoice.", function () { });
                        }/* else {
                            $scope.createAlert("WarningOk", "Your selection includes Modified Invoices. \n\n Invoices with status as \"Modified\" can not be marked as Pending. You should first Reject the invoice.", function () { });
                        }*/
                        return;
                    }
                }
            }


            $scope.createAlert("Warning", iMsg, function () {
                angular.forEach($scope.SupplierSummaryList, function (inv) {
                    if (inv.flag && inv.select == 'Y' && inv.cfs == 'Y') {
                        if (iFlag == "A") {
                            inv.flag = "A";
                            inv = setDefaultITcAsTaxpaidAmount(inv);
                        } else if (iFlag == "R") {
                            inv.flag = "R";
                        } else if (iFlag == "P") {
                            inv.flag = "P";
                        }
                        updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form);
                        invdltArray.push(updatedNodeDetails);
                        rtArry.push(inv);
                    }
                });

                if (rtArry.length > 0 && invdltArray.length > 0) {
                    R1InvHandler.updateAccptdRjctdInvoices($scope, rtArry, invdltArray, formateNodePayload, iFlag).then(function () {
                        //                        $scope.page('/gstr/upload/summary')

                    });

                    $scope.selectAll = false;
                    if ($scope.sectionListSelected.url[0] !== '/') {
                        $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
                    }
                } else {
                    $scope.createAlert("WarningOk", "Please Select Atleast One Invoice", function () { });
                }
                if ($scope.sectionListSelected.url[0] !== '/') {
                    $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
                }
            });


        }

        //This method will delete multiple inv
        $scope.setDeleteFlagOrDelete = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.TaxPayerSummaryList, function (inv) {
                if (!inv.select) {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form));
                }
            });
            if (invdltArray.length > 0) {
                R1InvHandler.uploadSetDeleteOrDelete($scope, rtArry, invdltArray).then(function (response) {
                    $scope.TaxPayerSummaryList = angular.copy(response);
                });
                reloadPage();
            } else {
                $scope.createAlert("WarningOk", "Please Select Atleast one item", function () { });
            }
        }

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];

            angular.forEach($scope.ReceiverSummaryList, function (inv) {
                if (inv.DeleteSelect !== 'Y') {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(ReturnStructure.getUpdatedNodeDetails(tableCode, inv, form));
                }
            });
            if (invdltArray.length > 0) {
                $scope.createAlert("Warning", "Are you sure to delete selected rows?", function () {
                    R1InvHandler.uploadSetDeleteOrDelete($scope, rtArry, invdltArray).then(function (response) {
                        $scope.ReceiverSummaryList = angular.copy(response);
                        $scope.deleteAll = 'N';
                    });
                });

            } else {
                $scope.createAlert("WarningOk", "Do select at least one item.", function () { });
            }
        }


        //To add new invoice 
        $scope.savePayload = function (frmName) {
            $scope.hideaddBtn = false;
            $scope.hsnNotfromMstr =null;
            if (!frmName) {
                frmName = $scope.newInvFrm
            }
            var newInvoice = angular.copy($scope.newInvRw);
            if (tableCode == "b2cs" || tableCode == "b2csa") {
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
            } else {
                newInvoice.val = Number(newInvoice.val);
            }
            if (tableCode == 'hsn(b2b)' || tableCode == 'hsn(b2c)') {
                var iLen = $scope.ReceiverSummaryList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
            }
            if (tableCode == 'hsn' || tableCode == 'hsnsum') {
                var iLen = $scope.ReceiverSummaryList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
            }

            if (frmName.$valid) {
                var stdata = angular.copy(newInvoice);
                if (stdata) {
                    R1InvHandler.emptyItemUploadAdd($scope, stdata, formateNodePayload).then(function (response) {
                        if (response) {
                            $scope.ReceiverSummaryList.push(newInvoice);
                            $scope.newInvValidtr = false;
                            initNewInvRow();
                        }
                    });
                }
            } else {
                $scope.newInvValidtr = true;
            }
        }

        $scope.invdtmsg = '';
        $scope.isPreGST = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var maxDt = $scope.maxInvDatePGst(inv),
                minDt = $scope.minInvDatePGst(inv),
                dtflag = true,
                invdt = inv.idt;

            if (moment(invdt, dateFormat).isValid()) {
                if (moment(invdt, dateFormat).isAfter(moment(maxDt, dateFormat))) {
                    dtflag = false;
                    if (isNew) {
                        if (inv.p_gst == 'Y')
                            $scope.invdtmsg = "Date of invoice cannot exceed June 30, 2017 for Pre GST Regime";
                        else
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                    }
                    else {
                        if (inv.p_gst == 'Y')
                            $scope.invdtmsg = "Date of invoice cannot exceed June 30, 2017 for Pre GST Regime";
                        else
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";;
                    }

                }
                else if (moment(invdt, dateFormat).isBefore(moment(minDt, dateFormat))) {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                    else {
                        if (inv.p_gst == 'Y')
                            $scope.invdtmsg = "Date of invoice cannot exceed June 30, 2017 for Pre GST Regime";
                        else
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";;
                    }
                }

            } else {
                dtflag = false;
                if (isNew)
                    $scope.invdtmsg = "Date does not exists in the calendar";
                // return true;
            }
            frmName.idt.$setValidity('idt', dtflag);

        }


        //To enable prev dates in case of cdnr pregst
        $scope.minInvDatePGst = function (inv) {
            var minDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2);
                //firstDate = moment(temp1, dateFormat),
                // firstDate1 = firstDate.format(dateFormat);
                minDate = moment(temp1, "DD/MM/YYYY").add(1, 'days').subtract(18, 'months').format("DD/MM/YYYY");

            }
            else {
                minDate = $scope.minDate();
            }
            return minDate;
        }

        //To disable after jun30 dates in case of cdnr pregst
        $scope.maxInvDatePGst = function (inv) {
            var maxDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "30062017",
                    lastDate = moment(temp1, dateFormat),
                    lastDate1 = lastDate.format(dateFormat);
                maxDate = lastDate1;

            }
            else {
                maxDate = $scope.datefunc();
            }
            return maxDate;
        };



        $scope.isIntraState = function (isNew, iInv) {
            //tito
            var oData, invData;
            if (iInv) {
                if ($scope.isUploadFlag == "S") {
                    oData = getUniqueInvoiceInSupplrList(iInv, iInv, 1);
                    invData = oData.data;
                } else {
                    oData = getUniqueInvoiceInRcvrList(iInv, iInv, 1);
                    invData = oData.data;
                }
            }

            if (isNew) {
                return ($scope.newInvRw.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            } else if (invData) {
                return (invData && invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }


    }
]);


myApp.controller("uploaditmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', 'ReturnStructure',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler, ReturnStructure) {

        $scope.newItmValidtr = false;
        $scope.selectAll = null;
        var tblcd = null,
            formName = null;

        $scope.rateWiseData = [];

        $scope.disableUpdate = function () {

            if (shareData.isUploadFlag == 'R' || shareData.isUploadFlag == 'Modified' || shareData.isUploadFlag == 'Rejected')
                return true;

        }

        $scope.isIntraState = function () {
            if ($scope.itmList && $scope.itmList.sp_typ) {
                return ($scope.itmList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        };


        //ITC validations for GSTR2
        $scope.checkamountwithitc = function (items) {
            //$scope.newItmFrm.$setValidity('amountlessthanitc', true);
            $scope.itcinvalid = false;

            items.filter(function (item) {
                var item1 = item.itc ? item.itc : item;
                if (!parseFloat(item.iamt) && parseFloat(item1.tx_i)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.iamt) < parseFloat(item1.tx_i)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                if (!parseFloat(item.camt) && parseFloat(item1.tx_c)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.camt) < parseFloat(item1.tx_c)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                if (!parseFloat(item.samt) && parseFloat(item1.tx_s)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.samt) < parseFloat(item1.tx_s)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                if (!parseFloat(item.csamt) && parseFloat(item1.tx_cs)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.csamt) < parseFloat(item1.tx_cs)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                // if (!parseFloat(item.iamt) && parseFloat(item.tx_i)) {
                //     //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                //     $scope.itcinvalid = true;
                // }
                // else if (parseFloat(item.iamt) < parseFloat(item.tx_i)) {
                //     //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                //     $scope.itcinvalid = true;
                // }
                // if (!parseFloat(item.csamt) && parseFloat(item.tx_cs)) {
                //     //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                //     $scope.itcinvalid = true;
                // }
                // else if (parseFloat(item.csamt) < parseFloat(item.tx_cs)) {
                //     //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                //     $scope.itcinvalid = true;
                // }
            });
        }
        $scope.parsefloat = function (val) {
            if (val == '' || !val)
                return 0;
            return parseFloat(val);
        }

        $scope.getEligibilityForITC = function () {
            if ($scope.dashBoardDt.gstin.slice(0, 2) == $scope.itmList.pos) {
                return true;
            } else {
                return false;
            }
        }


        $scope.initelg = function (iItm) {
            var elg;
            if (iItm.itc) {
                elg = iItm.itc.elg;
            } else {
                elg = iItm.elg;
            }
            if (iItm.txval > 0) {
                if (!elg) {
                    elg = $scope.getEligibilityForITC() ? "" : 'no';
                }
            }
            if (iItm.itc) {
                iItm.itc.elg = elg;
            }
            else {
                iItm.elg = elg;
            }
        }

        function initializeData(iTblCode) {
            switch (iTblCode) {
                case 'b2b':
                case 'b2ba':
                case 'b2cl':
                case 'b2cla':
                case 'cdnr':
                case 'cdnur':
                case 'cdnra':
                case 'cdnura':
                case 'b2bur':
                case 'b2csa':
                case 'ecomb2b':
                case 'ecomurp2b':
                case "ecomab2b":
                case "ecomab2c":
                case "ecomaurp2b":
                case "ecomaurp2c":
                angular.forEach($scope.RateList.CommGST, function (val, key) {
                var iIndex = key; // directly use array index
                
                    if (!$scope.rateWiseData[iIndex]) {
                        if ($scope.intraState) {
                            if (formName === "GSTR2") {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_c": 0,
                                        "tx_s": 0,
                                        "tx_cs": 0
                                    }
                                };
                            } else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        } else {
                            if (formName === "GSTR2") {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_i": 0,
                                        "tx_cs": 0
                                    }
                                };
                            } else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        }
                    }
                });
                    break;
                case 'exp':
                case 'expa':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex = key; // directly use array index
                        
                        if (!$scope.rateWiseData[iIndex]) {
                            $scope.rateWiseData[iIndex] = {
                                "rt": val.value,
                                "iamt": 0,
                                "csamt": 0,
                                "txval": 0
                            };

                        }
                    });
                    break;
                case 'imp_g':
                case 'imp_s':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex;
                        iIndex = val.value;
                        switch (val.value) {
                            case 0.1:
                                iIndex = 1;
                                break;
                            case 0.25:
                                iIndex = 2;
                                break;
                            case 1:
                                iIndex = 3;
                                break;
                            case 1.5:
                                iIndex = 4;
                                break;
                            case 3:
                                iIndex = 5;
                                break;
                            case 5:
                                iIndex = 6;
                                break;
                            case 6:
                                iIndex = 7;
                                break;
                            case 7.5:
                                iIndex = 8;
                                break;
                        }
                        if (!$scope.rateWiseData[iIndex]) {
                            $scope.rateWiseData[iIndex] = {
                                "rt": val.value,
                                "iamt": 0,
                                "csamt": 0,
                                "txval": 0,
                                "tx_i": 0,
                                "tx_cs": 0
                            };

                        }
                    });
                    break;
                case 'at':
                case 'ata':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex;
                        iIndex = val.value;
                        switch (val.value) {
                            case 0.1:
                                iIndex = 1;
                                break;
                            case 0.25:
                                iIndex = 2;
                                break;
                            case 1:
                                iIndex = 3;
                                break;
                            case 1.5:
                                iIndex = 4;
                                break;
                            case 3:
                                iIndex = 5;
                                break;
                            case 5:
                                iIndex = 6;
                                break;
                            case 6:
                                iIndex = 7;
                                break;
                            case 7.5:
                                iIndex = 8;
                                break;
                        }

                        if (!$scope.rateWiseData[iIndex]) {
                            if ($scope.intraState) {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "ad_amt": 0
                                };
                            }
                            else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "ad_amt": 0
                                };
                            }
                        }
                    });
                case 'txi':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex;
                        iIndex = val.value;
                        switch (val.value) {
                            case 0.1:
                                iIndex = 1;
                                break;
                            case 0.25:
                                iIndex = 2;
                                break;
                            case 1:
                                iIndex = 3;
                                break;
                            case 1.5:
                                iIndex = 4;
                                break;
                            case 3:
                                iIndex = 5;
                                break;
                            case 5:
                                iIndex = 6;
                                break;
                            case 6:
                                iIndex = 7;
                                break;
                            case 7.5:
                                iIndex = 8;
                                break;
                        }

                        if (!$scope.rateWiseData[iIndex]) {
                            if ($scope.intraState) {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "adamt": 0
                                };
                            }
                            else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "adamt": 0
                                };
                            }
                        }
                    });
                    break;
                case 'atadj':
                case 'atadja':
                    if (formName == 'GSTR1') {
                        angular.forEach($scope.RateList.CommGST, function (val, key) {
                            var iIndex;
                            iIndex = val.value;
                            switch (val.value) {
                                case 0.1:
                                    iIndex = 1;
                                    break;
                                case 0.25:
                                    iIndex = 2;
                                    break;
                                case 1:
                                    iIndex = 3;
                                    break;
                                case 1.5:
                                    iIndex = 4;
                                    break;
                                case 3:
                                    iIndex = 5;
                                    break;
                                case 5:
                                    iIndex = 6;
                                    break;
                                case 6:
                                    iIndex = 7;
                                    break;
                                case 7.5:
                                    iIndex = 8;
                                    break;
                            }
                            if (!$scope.rateWiseData[iIndex]) {
                                if ($scope.intraState) {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "camt": 0,
                                        "samt": 0,
                                        "csamt": 0,
                                        "ad_amt": 0
                                    };
                                }
                                else {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "iamt": 0,
                                        "csamt": 0,
                                        "ad_amt": 0
                                    };
                                }
                            }
                        });
                    }
                    else if (formName == 'GSTR2') {
                        angular.forEach($scope.RateList.CommGST, function (val, key) {
                            var iIndex;
                            iIndex = val.value;
                            switch (val.value) {
                                case 0.1:
                                    iIndex = 1;
                                    break;
                                case 0.25:
                                    iIndex = 2;
                                    break;
                                case 1:
                                    iIndex = 3;
                                    break;
                                case 1.5:
                                    iIndex = 4;
                                    break;
                                case 3:
                                    iIndex = 5;
                                    break;
                                case 5:
                                    iIndex = 6;
                                    break;
                                case 6:
                                    iIndex = 7;
                                    break;
                                case 7.5:
                                    iIndex = 8;
                                    break;
                            }

                            if (!$scope.rateWiseData[iIndex]) {
                                if ($scope.intraState) {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "camt": 0,
                                        "samt": 0,
                                        "csamt": 0,
                                        "adamt": 0
                                    };
                                }
                                else {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "iamt": 0,
                                        "csamt": 0,
                                        "adamt": 0
                                    };
                                }
                            }
                        });
                    }

                    break;


            }
        }

        function getAlreadyExistingData(iTblCode) {
            switch (iTblCode) {
                case 'b2b':
                case 'b2ba':
                case 'ecomb2b':
                case 'ecomurp2b':
                case 'ecomab2b':
                case 'ecomaurp2b':    
                    if (formName == 'GSTR2') {
                        if ($scope.itmList.inv_typ == 'SEWP') {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                //$scope.rateWiseData[index] = val.itm_det;
                                $scope.rateWiseData[index].itc = val.itc;
                                if (val.itm_det.iamt == 0 || val.itm_det.camt == 0 || val.itm_det.samt == 0)
                                    $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);

                            });
                        }
                        else {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                //$scope.rateWiseData[index] = val.itm_det;
                                $scope.rateWiseData[index].itc = val.itc;

                            });
                        }
                    } else {
                        if ($scope.itmList.inv_typ == 'SEWP') {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                val.itm_det.diff_percent = $scope.itmList.diff_percent;
                                //$scope.rateWiseData[index] = val.itm_det;
                                // if (val.itm_det.iamt == 0 || val.itm_det.camt == 0 || val.itm_det.samt == 0)
                                //     $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);

                            });
                        }
                        else {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                val.itm_det.diff_percent = $scope.itmList.diff_percent;
                                //$scope.rateWiseData[index] = val.itm_det;
                                // if ($scope.itmList.inv_typ != 'SEWOP') {
                                //     $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                                // }
                            });
                        }
                    }
                    break;
                case 'b2cl':
                case 'b2bur':
                case 'cdnr':
                case 'cdnur':
                case 'b2cla':
                case 'cdnra':
                case 'cdnura':
                    if (formName == 'GSTR2') {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            //$scope.rateWiseData[index] = val.itm_det;
                            $scope.rateWiseData[index].itc = val.itc;

                        });
                    } else {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            //$scope.rateWiseData[index] = val.itm_det;
                            //if ($scope.itmList.inv_typ != 'SEWOP') {
                            // $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                            //}
                        });
                    }
                    break;
                case 'exp':
                case 'at':
                case 'atadj':
                case 'expa':
                case 'ata':
                case 'b2csa':
                case 'atadja':
                case 'txi': 
                case 'ecomab2c':
                case 'ecomaurp2c':       
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        var index = val.rt;
                        switch (index) {
                            case 0.1:
                                index = 1;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 0.25:
                                index = 2;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1:
                                index = 3;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1.5:
                                index = 4;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 3:
                                index = 5;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 5:
                                index = 6;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 6:
                                index = 7;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 7.5:
                                index = 8;
                                $scope.rateWiseData[index] = val;
                                break;
                            default:
                                $scope.rateWiseData[index] = val;

                        }
                        //$scope.rateWiseData[index] = val;
                        //if ($scope.itmList.inv_typ != 'SEWOP') {
                        // $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                        //}
                    });
                    break;
                case 'imp_g':
                case 'imp_s':
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        var index = val.rt;
                        switch (index) {
                            case 0.1:
                                index = 1;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 0.25:
                                index = 2;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1:
                                index = 3;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1.5:
                                index = 4;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 3:
                                index = 5;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 5:
                                index = 6;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 6:
                                index = 7;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 7.5:
                                index = 8;
                                $scope.rateWiseData[index] = val;
                                break;
                            default:
                                $scope.rateWiseData[index] = val;

                        }
                        //$scope.rateWiseData[index] = val;
                        //                    $scope.rateWiseData[index].itc = val.itc;

                    });
                    break;

            }

        }

        function defaultItemInit(iTblcode) {
            var itmObj = {};
            switch (iTblcode) {
                case 'b2ba':
                case 'b2cla':
                case 'cdnra':
                case 'cdnura':
                    itmObj.num = 1;
                    itmObj.itm_det = $scope.rateWiseData[0];
                    break;
                case 'b2csa':
                case 'expa':
                case 'ata':
                case 'atadja':
                    itmObj.itm_det = $scope.rateWiseData[0];
                    break;

            }
            return itmObj;
        }
        //check if GSTR info available
        if (!shareData.dashBoardDt && !shareData.itmInv) {
            $scope.page("/gstr/upload/summary");
            return false;
        } else {

            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = shareData.dashBoardDt.form;
            tblcd = $scope.dashBoardDt.tbl_cd;
            $scope.itmList = shareData.itmInv;
            if (tblcd == 'at' || tblcd == 'atadj' || tblcd == 'txi' || tblcd == 'atadja' || tblcd == 'ata' || tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') {
                $scope.intraState = false;
                if ($scope.itmList.sply_ty === 'INTRA') {
                    $scope.intraState = true;
                }
            }
            else {
                $scope.intraState = $scope.isIntraState();
            }
            $scope.itemsLength = $scope.itmList.itms.length;

            if ($scope.itemsLength > 0) {
                getAlreadyExistingData(tblcd);
                initializeData(tblcd);
            } else {
                initializeData(tblcd);
            }
            var data = $scope.rateWiseData;

            data = data.filter(function (element) {
                return element !== undefined;
            });
            $scope.rateWiseData = data;
            $scope.isEnabled = (shareData.updateToBeEnabled) ? true : false;
            shareData.updateToBeEnabled = null;

        }

        // initItm();

        function initItm() {
            $scope.nwItm = ReturnStructure.getNewItm(tblcd, form);
        }


        $scope.isNewRec = shareData.isNewRec;

        //   $scope.invNum = ReturnStructure.getInvNum(tblcd, $scope.itmList, form);

        //exp withoupayment calculation
        //  onRtChange(rateWiseDataExp[y.value], 3)
        $scope.RateCalExp = function (val) {
            if (shareData.itmInv.exp_typ == "WPAY") {
                $scope.onRtChange(val, 3);
            }
        }

        $scope.RateCalCdnr = function (val) {
            if (shareData.itmInv.typ != "EXPWOP") {
                $scope.onRtChange(val, 3);
            }
        }


        $scope.isImpg = function () {
            return (tblcd === "imp_g" || tblcd === "imp_ga") ? true : false;
        }

        //Formaters

        var formateNodePayload = ReturnStructure.formateNodePayload(tblcd, form);



        $scope.spTypChange = function (isNew, iInv) {
            if (isNew) {
                if ($scope.nwItm.sp_typ.name == "Intra-State") {
                    $scope.nwItm.irt = 0;
                    $scope.nwItm.iamt = 0;
                } else {
                    $scope.nwItm.crt = 0;
                    $scope.nwItm.camt = 0;
                    $scope.nwItm.srt = 0;
                    $scope.nwItm.samt = 0;
                }
            } else {
                if (iInv.sp_typ.name == "Intra-State") {
                    $scope.nwItm.irt = 0;
                    $scope.nwItm.iamt = 0;
                } else {
                    $scope.nwItm.crt = 0;
                    $scope.nwItm.camt = 0;
                    $scope.nwItm.srt = 0;
                    $scope.nwItm.samt = 0;
                }
            }
        }

        //TO disable igst n cess in case of EXPWOP
        $scope.isWithOutPaymnt = function () {
            if ($scope.itmList) {
                //&& ($scope.itmList.exp_typ || $scope.itmList.typ  ) ) {
                if ($scope.itmList.exp_typ && $scope.itmList.exp_typ === 'WOPAY')
                    return true;
                else if ($scope.itmList.typ && $scope.itmList.typ == 'EXPWOP')
                    return true;
            }
            return false;

        }

        //Clear already existing values for with pay if he changed to wopay in exp
        $scope.clearValues = function () {
            if (shareData.itmInv.exp_typ == "WOPAY") {
                angular.forEach($scope.rateWiseData, function (obj, key) {
                    if (obj.iamt || obj.csamt) {
                        obj.iamt = 0;
                        obj.csamt = 0;
                    }
                });
            }
        }


        $scope.isNoActionTaken = function () {
            return ($scope.itmList.flag && $scope.itmList.flag == 'N') ? true : false;
        }

        //To disable tax avialable as itc and itc this month if not eligible

        $scope.isEligible = function (iElg) {
            return (!iElg || iElg == "none") ? true : false;
        }

        //To clear values if eligiblity changed as none
        $scope.elgBltyChange = function (iItm) {
            var elg, iItc;
            if (iItm.itm_det) {
                elg = iItm.itm_det.elg;
            } else {
                elg = iItm.elg;
            }


            if (iItm.itc) {
                iItc = iItm.itc;
            } else {
                iItc = iItm;
            }
            if (elg == "none" && $scope.isIntraState()) {
                iItc.tx_c = 0.00;
                iItc.tx_s = 0.00;
                iItc.tx_cs = 0.00;
                iItc.tc_c = 0.00;
                iItc.tc_s = 0.00;
                iItc.tc_cs = 0.00;
            } else if (elg == "none" && !$scope.isIntraState()) {
                iItc.tx_i = 0.00;
                iItc.tx_cs = 0.00;
                iItc.tc_i = 0.00;
                iItc.tc_cs = 0.00;
            }
        }

        //to check itc values less than igst n sgst n cgst
        $scope.validity = function (isNew, iItm, frm) {
            var flag = false,
                fldname, curItm;
            var frmName = (isNew) ? $scope.newItmFrm : frm;
            if (iItm.itm_det) {
                curItm = iItm.itm_det;
            } else {
                curItm = iItm;
            }
            if (iItm) {
                fldname = ['tx_i', 'tc_i', 'tx_c', 'tc_c', 'tx_s', 'tc_s', 'tx_cs', 'tc_cs'];
                for (var i = 0; i < fldname.length; i++) {
                    if (frmName[fldname[i]] != undefined) {
                        frmName[fldname[i]].$setValidity('pattern', true);
                    }
                }
                var iItc;
                if (iItm.itc) {
                    iItc = iItm.itc;
                } else {
                    iItc = iItm;
                }

                if (parseFloat(iItc.tx_i) > parseFloat(curItm.iamt)) {
                    frmName.tx_i.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_i) > parseFloat(iItc.tx_i)) {
                    frmName.tc_i.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tx_c) > parseFloat(curItm.camt)) {
                    frmName.tx_c.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_c) > parseFloat(iItc.tx_c)) {
                    frmName.tc_c.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tx_s) > parseFloat(curItm.samt)) {
                    frmName.tx_s.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_s) > parseFloat(iItc.tx_s)) {
                    frmName.tc_s.$setValidity('pattern', false);
                    flag = true;
                }

                if (parseFloat(iItc.tx_cs) > parseFloat(curItm.csamt)) {
                    frmName.tx_cs.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_cs) > parseFloat(iItc.tx_cs)) {
                    frmName.tc_cs.$setValidity('pattern', false);
                    flag = true;
                }
            }
            return flag;
        }

        //Add Item - softadd
        $scope.addItem = function (iForm) {
            if (!iForm) {
                iForm = $scope.newItmFrm;
            }
            if (iForm.$valid) {
                var itmLs = (tblcd == "atadj") ? $scope.itmList.doc : $scope.itmList.itms,
                    itmLn = itmLs.length,
                    newItm = ReturnStructure.getItmNodeStructure(tblcd, $scope.nwItm, itmLn, form);

                if (tblcd == 'atadj' && form == "GSTR2") {
                    $scope.itmList.doc.push(newItm);
                } else {
                    $scope.itmList.itms.push(newItm);
                }

                $scope.newItmValidtr = false;
                initItm();

            } else {
                $scope.newItmValidtr = true;
            }
        }

        $scope.updateSavePayload = function (isNew) {
            
            var totalTaxValue = 0,
                tempObj = {},
                tempArr = [];
            let varIsValidItms = true;
            let iamtHasValue = false;
            if (tblcd == 'b2b' || tblcd == 'b2ba' || tblcd == 'b2cl' || tblcd == 'b2cla' || tblcd == 'b2bur' || tblcd == 'ecomb2b' || tblcd == 'ecomurp2b' || tblcd == 'ecomab2b' || tblcd == 'ecomaurp2b') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    tempObj = {};
                    if (parseFloat(obj.txval) > 0 && obj.txval) {
                        if (!$scope.intraState) {
                            tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                            tempObj.itm_det = {
                                "txval": parseFloat(obj.txval),
                                "rt": parseFloat(obj.rt),
                                "iamt": parseFloat(obj.iamt),
                                "csamt": parseFloat(obj.csamt)
                            };
                            if (obj.itc) {
                                tempObj.itc = {
                                    "elg": obj.itc.elg,
                                    "tx_i": parseFloat(obj.itc.tx_i),
                                    "tx_cs": parseFloat(obj.itc.tx_cs)
                                }
                            }

                            totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.iamt + (isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt);
                        } else {
							if((tblcd == 'ecomb2b' || tblcd == 'ecomurp2b' || tblcd == 'ecomab2b' || tblcd == 'ecomaurp2b') && obj.camt != obj.samt){
                                $scope.txrate = true;
                            }
                            tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                            tempObj.itm_det = {
                                "txval": parseFloat(obj.txval),
                                "rt": parseFloat(obj.rt),
                                "camt": parseFloat(obj.camt),
                                "samt": parseFloat(obj.samt),
                                "csamt": parseFloat(obj.csamt)
                            };
                            if (obj.itc) {
                                tempObj.itc = {
                                    "elg": obj.itc.elg,
                                    "tx_c": parseFloat(obj.itc.tx_c),
                                    "tx_s": parseFloat(obj.itc.tx_s),
                                    "tx_cs": parseFloat(obj.itc.tx_cs)
                                }
                            }
                            totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.camt + tempObj.itm_det.samt + (isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt);
                        }

                        tempArr.push(tempObj);
                        //condition for IGST > 0
                        if ($scope.itmList.inv_typ == "SEWP" && parseFloat(obj.iamt) > 0) {
                            iamtHasValue = true;
                        }
                    }
                });
                if($scope.txrate == true){
                    $scope.createAlert("Error", "Please enter same amount for CGST and SGST", function(){});
                    $scope.txrate = false;
                    return;
                }
            }
            else if (tblcd == 'exp' || tblcd == 'expa') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (parseFloat(obj.txval) > 0 && obj.txval) {
                        tempObj = {
                            "txval": parseFloat(obj.txval),
                            "rt": parseFloat(obj.rt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)
                        };
                        totalTaxValue += tempObj.txval + tempObj.iamt + tempObj.csamt;

                        tempArr.push(tempObj);
                        if ($scope.itmList.exp_typ == "WPAY" && parseFloat(obj.iamt) > 0) {
                            iamtHasValue = true;
                        }
                    }
                });
            }
            else if (tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt && (Math.abs(obj.txval) > 0 || Math.abs(obj.csamt) > 0)) {

                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "txval": parseFloat(obj.txval),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempArr.push(tempObj);
                    }
                    else if (obj.camt && (Math.abs(obj.txval) > 0 || Math.abs(obj.csamt) > 0)) {
						if((tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') && obj.camt != obj.samt){
                            $scope.txrate = true;
                        }
                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "txval": parseFloat(obj.txval),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempArr.push(tempObj);
                    }

                });
            }
            else if (tblcd == 'at' || tblcd == 'ata') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt) {

                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "ad_amt": parseFloat(obj.ad_amt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        if (tempObj.ad_amt || tempObj.iamt || tempObj.csamt)
                            tempArr.push(tempObj);
                    }
                    else if (obj.camt) {
                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "ad_amt": parseFloat(obj.ad_amt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        if (tempObj.ad_amt || (tempObj.camt && tempObj.samt) || tempObj.csamt)
                            tempArr.push(tempObj);
                    }

                });
                varIsValidItms = $scope.fnCheckValidItm(tempArr);
            }
            else if (tblcd == 'txi') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {

                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "adamt": parseFloat(obj.adamt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempObj.num = tempArr.length + 1;
                        tempArr.push(tempObj);
                    }
                    else if (obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                        tempObj = {

                            "rt": parseFloat(obj.rt),
                            "adamt": parseFloat(obj.adamt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempObj.num = tempArr.length + 1;
                        tempArr.push(tempObj);
                    }

                });
            }
            else if (tblcd == 'atadj' || tblcd == 'atadja') {
                if (formName == 'GSTR1') {
                    $scope.rateWiseData.forEach(function (obj, key) {
                        if (!obj.camt && parseFloat(obj.ad_amt) > 0) {

                            tempObj = {
                                "rt": parseFloat(obj.rt),
                                "ad_amt": parseFloat(obj.ad_amt),
                                "iamt": parseFloat(obj.iamt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempArr.push(tempObj);
                        }
                        else if (obj.camt && parseFloat(obj.ad_amt) > 0) {
                            tempObj = {
                                "rt": parseFloat(obj.rt),
                                "ad_amt": parseFloat(obj.ad_amt),
                                "camt": parseFloat(obj.camt),
                                "samt": parseFloat(obj.samt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempArr.push(tempObj);
                        }

                    });
                }
                else {
                    $scope.rateWiseData.forEach(function (obj, key) {
                        if (!obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                            tempObj = {
                                "rt": parseFloat(obj.rt),
                                "adamt": parseFloat(obj.adamt),
                                "iamt": parseFloat(obj.iamt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempObj.num = tempArr.length + 1;
                            tempArr.push(tempObj);
                        }
                        else if (obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                            tempObj = {

                                "rt": parseFloat(obj.rt),
                                "adamt": parseFloat(obj.adamt),
                                "camt": parseFloat(obj.camt),
                                "samt": parseFloat(obj.samt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempObj.num = tempArr.length + 1;
                            tempArr.push(tempObj);
                        }

                    });
                }

            }
            else if (tblcd == 'imp_g' || tblcd == 'imp_s') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (parseFloat(obj.txval) > 0 && obj.txval) {

                        tempObj = {
                            "txval": parseFloat(obj.txval),
                            "rt": parseFloat(obj.rt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)
                        };
                        if (obj.itc && tempObj.elg) {
                            tempObj.elg = obj.itc.elg;
                            tempObj.tx_i = parseFloat(obj.itc.tx_i);
                            tempObj.tx_cs = parseFloat(obj.itc.tx_cs)
                        } else {
                            tempObj.elg = obj.elg;
                            tempObj.tx_i = parseFloat(obj.tx_i);
                            tempObj.tx_cs = parseFloat(obj.tx_cs)
                        }


                        tempObj.num = tempArr.length + 1;
                        totalTaxValue += tempObj.txval + tempObj.iamt + tempObj.csamt;
                        tempArr.push(tempObj);
                    }
                });
            }
            else if (tblcd == "cdnr" || tblcd == "cdnra" || tblcd == "cdnur" || tblcd == "cdnura") {
                $scope.rateWiseData.forEach(function (obj, key) {
                    tempObj = {};
                    tempObj.itm_det = {
                        "txval": parseFloat(obj.txval),
                        "rt": parseFloat(obj.rt),
                        "csamt": parseFloat(obj.csamt)
                    };
                    if (!$scope.intraState) {
                        tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                        tempObj.itm_det.iamt = parseFloat(obj.iamt);
                        if (obj.itc) {
                            tempObj.itc = {
                                "elg": obj.itc.elg,
                                "tx_i": parseFloat(obj.itc.tx_i),
                                "tx_cs": parseFloat(obj.itc.tx_cs)
                            }
                        }

                        totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.iamt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                    } else {
                        tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                        tempObj.itm_det.camt = parseFloat(obj.camt);
                        tempObj.itm_det.samt = parseFloat(obj.samt);
                        if (obj.itc) {
                            tempObj.itc = {
                                "elg": obj.itc.elg,
                                "tx_c": parseFloat(obj.itc.tx_c),
                                "tx_s": parseFloat(obj.itc.tx_s),
                                "tx_cs": parseFloat(obj.itc.tx_cs)
                            }
                        }
                        totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.camt + tempObj.itm_det.samt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                    }
                    if (tempObj.itm_det.txval || tempObj.itm_det.iamt || (tempObj.itm_det.camt && tempObj.itm_det.samt))
                        tempArr.push(tempObj);

                    if (($scope.itmList.inv_typ == "SEWP" || $scope.itmList.typ == "EXPWP") && parseFloat(obj.iamt) > 0) {
                        iamtHasValue = true;
                    }

                });
            }
            var dF = $scope.itmList.diff_percent;
           
            if (dF != null && typeof dF != 'undefined' && typeof dF.value != 'undefined') {
                $scope.itmList.diff_percent = dF.value;
            }
            // var sR = $scope.itmList.supplierRecipientName;
            // if (sR != null && typeof sR != 'undefined' && typeof sR.value != 'undefined') {
            //     $scope.itmList.supplierRecipientName = sR.value;
            // }

            $scope.itmList.itms = tempArr;
            if (tblcd.endsWith('a') && tempArr.length == 0 && tblcd != "cdnura" && tblcd != "cdnra" && tblcd != "ata" && !(tblcd == "expa" && $scope.itmList.exp_typ == "WPAY") && !(tblcd == "b2ba" && $scope.itmList.inv_typ == "SEWP")) {
                var dfltItmObj = defaultItemInit(tblcd);
                $scope.itmList.itms.push(dfltItmObj);
            }
            if (varIsValidItms) {
                if ($scope.itmList.itms.length > 0 && !iamtHasValue && ($scope.itmList.inv_typ == "SEWP" || $scope.itmList.exp_typ == "WPAY" || $scope.itmList.typ == "EXPWP")) {
                    $scope.createAlert("ErrorCallback", "Please enter some value in IGST tax amount field", function () {

                        if ($scope.initSumryList)
                            $scope.initSumryList();
                    });
                }
                else {
                    if (isNew === "N") {
                        $scope.updatePayload();
                    } else {
                        $scope.savePayload();
                    }
                }
            } else {
                $scope.createAlert("ErrorCallback", "Item details provided are invalid. Please add correct item details and try again.", function () {

                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            }
        };
        //Added check for negative item value as part of CR17052
        $scope.fnCheckValidItm = function (itmArray) {
            let validFlag = true;
            let validForZero = true;
            let validGrtr = true;
            let validLssThn = true;
            itmArray.forEach(function (obj, key) {
                if (obj.ad_amt == 0) {
                    if (obj.csamt >= 0 && (obj.iamt > 0 || (obj.samt > 0 && obj.camt > 0)))
                        validForZero = true;
                    else if (obj.csamt <= 0 && (obj.iamt < 0 || (obj.samt < 0 && obj.camt < 0)))
                        validForZero = true;
                    else
                        validForZero = false;
                } else if (obj.ad_amt < 0) {
                    if (obj.iamt > 0 || obj.camt > 0 || obj.samt > 0 || obj.csamt > 0)
                        validLssThn = false;
                    else
                        validLssThn = true;
                } else if (obj.ad_amt > 0) {
                    if (obj.iamt < 0 || obj.camt < 0 || obj.samt < 0 || obj.csamt < 0)
                        validGrtr = false;
                    else
                        validGrtr = true;
                } else {
                    validForZero = true;
                    validGrtr = true;
                    validLssThn = true;
                }
            });
            if (!validForZero || !validGrtr || !validLssThn)
                validFlag = false;

            return validFlag;
        }
        //To add new invoice 
        $scope.savePayload = function () {
            var stdata = angular.copy($scope.itmList);

            R1InvHandler.uploadPayloadAdd($scope, stdata, formateNodePayload);
        }


        //To Update Invoice
        $scope.updatePayload = function () {
            var stdata = angular.copy($scope.itmList);
            // if (stdata.flag) {
            //     stdata.flag = "M";
            // }

            if (((stdata.srctyp != '' && stdata.srctyp != undefined) || (stdata.irngendate != '' && stdata.irngendate != undefined) || (stdata.irn != '' && stdata.irn != undefined))) {
                if (stdata.srctyp)
                    delete stdata.srctyp
                if (stdata.irn)
                    delete stdata.irn
                if (stdata.irngendate)
                    delete stdata.irngendate

            }
            var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tblcd, stdata, form);
            if (formName == "GSTR1") {
                if (shareData.isUploadBySuplier == 'R') {
                    stdata.flag = 'M'; // dont remove this, we need to tell server that item level info was modified, and server will decide if its M or A. If we dont modify here, server will be confused on what actual action to be performed

                    R1InvHandler.uploadPayloadUpdate($scope, stdata, updatedNodeDetails, formateNodePayload, shareData.isUploadBySuplier);
                }
                //condition for Miscellaneous with pay
                else if ((tblcd == "expa" && stdata.exp_typ == "WPAY") || (tblcd == "b2ba" && stdata.inv_typ == "SEWP")) {
                    shareData.isUploadBySuplier = undefined;
                    R1InvHandler.uploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload, shareData.isUploadBySuplier);
                }
                else {
                    if (tblcd == "b2b" || tblcd == "b2cl" || tblcd == "cdnur" || tblcd == "cdnr" || tblcd == "cdnura" || tblcd == "cdnra" || tblcd == "exp" || tblcd == "at" || tblcd == "ata" || tblcd == "atadj" || tblcd == "ecomb2b" || tblcd == "ecomurp2b" || tblcd == "ecomab2b" || tblcd == "ecomaurp2b")
                        shareData.isUploadBySuplier = undefined;

                    R1InvHandler.uploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload, shareData.isUploadBySuplier);
                }

            }
            else if (formName == 'GSTR2') {
                if (shareData.isUploadBySuplier == 'S') {
                    stdata.flag = 'M'; // dont remove this, we need to tell server that item level info was modified, and server will decide if its M or A. If we dont modify here, server will be confused on what actual action to be performed
                    R1InvHandler.uploadPayloadUpdate($scope, stdata, updatedNodeDetails, formateNodePayload, shareData.isUploadBySuplier);
                }
                else {
                    //stdata.flag="E";
                    R1InvHandler.uploadUpdateFlag($scope, stdata, updatedNodeDetails, formateNodePayload, shareData.isUploadBySuplier);
                }
            }


        }

    }
]);


myApp.controller("errorreturnsctrl", ['$scope', '$http', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', '$timeout', 'R1InvHandler', 'ReturnStructure', 'R1Util', '$routeParams', '$filter',
    function ($scope, $http, $rootScope, shareData, g1FileHandler, $log, NgTableParams, timeout, R1InvHandler, ReturnStructure, R1Util, $routeParams, $filter) {

        var tableCode = null,
            formName = null,
            isSezTaxpayer,
            dateFormat = $().getConstant('DATE_FORMAT') || 'dd/mm/yyyy';
            shareData.HSN_BIFURCATION_START_DATE = "052025";
            shareData.showHSNTabs = !(moment(getDate(shareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(shareData.HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
            $scope.showHSNTabs= shareData.showHSNTabs;
        $scope.ErrorList = [];
        shareData.isNewRec = true;
        $scope.newInvValidtr = false;
        $scope.newInvRw = null;
        $scope.monthList = null;
        $scope.selectAll = false;

        $scope.showOldUI = false;
        $scope.HSNList = null;
        $scope.isHsnSelected = false;
        $scope.hsnsaveedit = false;
        $scope.minYearsAllowed = "4";
        $scope.minCodeLengthToDisplay = "2";
        $scope.err_msg_hsn = "Length should be between 2-8";
        $scope.disableHSNRestrictions = shareData.disableHSNRestrictions;

        if (!shareData.dashBoardDt) {
            $scope.page("/gstr/error/dashboard");
            return false;
        } else {
            tableCode = $scope.sectionListSelected['cd'];
            shareData.dashBoardDt.tbl_cd = tableCode;
            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = $scope.dashBoardDt.form;
            $scope.years = shareData.yearsList;//In B2CSA we need yearsList list
            $scope.monthList = shareData.curFyMonths; //In B2CSA we need FY month list
            isSezTaxpayer = shareData.isSezTaxpayer;
            $scope.showOldUI = R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value);
            b2clValCheck();
            initErrSummary();
            // initSumryList();
        }

        if (!shareData.disableAATOLengthCheck) {
        
            if (shareData.aatoGreaterThan5CR) {
               $scope.minCodeLengthToDisplay = shareData.HSN_DROPDOWN_LGTH_AATO_GRTR_5CR;
               $scope.minhsnlengthvalidation = shareData.HSN_VALIDATION_AATO_GRTR_5CR_MIN_LGTH;
            }
           else {
               $scope.minCodeLengthToDisplay = shareData.HSN_DROPDOWN_LGTH_AATO_LESS_5CR;
               $scope.minhsnlengthvalidation = shareData.HSN_VALIDATION_AATO_LESS_5CR_MIN_LGTH;
           }
       }
       function getDate(retprd) {
        var a = '01/' + retprd.substring(0, 2) + '/' + retprd.substring(2);
        return a;
    };

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

        $scope.afterHACselecthsnOutward = function (result) {
            $scope.isHsnSelected = true;
            $scope.newInvRw.hsn_sc = result.c;
            $scope.newInvRw.desc = result.n;
            $scope.newInvRw.user_desc = result.n;
            $scope.hsnsaveedit = true;
            $scope.isExistingHsnUqcRate(1, $scope.newInvRw.rt, $scope.newInvRw.hsn_sc, $scope.newInvRw.uqc);
        }

        $scope.checkForServiceHSN = function (hsn, frm) {
            if (String(hsn).substring(0, 2) == "99") {
                return true;
            }
            return false;
        }

        $scope.onPosChangeTB15B2CS = function (y) {
            var isIntra = $scope.isIntraStateB2CS(y);
            var old_sply_ty = y.sply_ty;

            if (isIntra && !isSezTaxpayer) {
                y.sply_ty = $scope.suplyList[0].cd;
                if (old_sply_ty != y.sply_ty) {
                    y.txval = null;
                    y.iamt = null;
                    y.camt = null;
                    y.samt = null;
                    y.csamt = null;
                    // y.rt = 0;
                }

            } else {
                y.sply_ty = $scope.suplyList[1].cd;
               
                if (old_sply_ty != y.sply_ty) {
                    y.txval = null;
                    y.iamt = null;
                    y.camt = null;
                    y.samt = null;
                    y.csamt = null;
                    // y.rt = 0;
                }
            }
        };

        // //CR 23892 To keep SGST and CGST same 
        $scope.updateCGST = function(y){
            if(y)
            y.camt = y.samt;
            else
            $scope.newInvRw.camt = $scope.newInvRw.samt;
        };

        $scope.updateSGST = function(y){
            if(y)
            y.samt = y.camt;
            else
            $scope.newInvRw.samt = $scope.newInvRw.camt;
        };

        $scope.isExistingHsnUqcRate = function (isNew, iRate, iHsn, uqc, frm) {
            // if (!iRate)
            //     iRate = '';

            if (!iHsn)
                iHsn = '';
            var isExistRate = false;
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            frmName.rt.$setValidity('duplicate', true);
            frmName.uqc.$setValidity('duplicate', true);
            frmName.hsn_sc.$setValidity('duplicate', true);

            if (isNew == 1) {
                angular.forEach($scope.ErrorList, function (inv, i) {
                    angular.forEach(inv.data, function (rw, j) {
                        if (!rw.hsn_sc)
                            rw.hsn_sc = '';
                        // if (inv.rt == null)
                        //     inv.rt = '';
                        if (
                            (rw.rt == iRate)
                            &&
                            (rw.hsn_sc == iHsn)
                            &&
                            (rw.uqc == uqc)
                        ) {
                            isExistRate = true;
                        }
                    });
                    if(inv.hsn_b2b != null || inv.hsn_b2b != undefined){
                        angular.forEach(inv.hsn_b2b, function (rw, j) {
                            if (!rw.hsn_sc)
                                rw.hsn_sc = '';
                            if (
                                (rw.rt == iRate)
                                &&
                                (rw.hsn_sc == iHsn)
                                &&
                                (rw.uqc == uqc)
                            ) {
                                isExistRate = true;
                            }
                        });
                    }
                    if(inv.hsn_b2c != null || inv.hsn_b2c != undefined){
                        angular.forEach(inv.hsn_b2b, function (rw, j) {
                            if (!rw.hsn_sc)
                                rw.hsn_sc = '';
                            if (
                                (rw.rt == iRate)
                                &&
                                (rw.hsn_sc == iHsn)
                                &&
                                (rw.uqc == uqc)
                            ) {
                                isExistRate = true;
                            }
                        });
                    }
                });
                frmName.rt.$setValidity('duplicate', !isExistRate);
                frmName.uqc.$setValidity('duplicate', !isExistRate);
                frmName.hsn_sc.$setValidity('duplicate', !isExistRate);
            } else {
                var cnt = 0;
                angular.forEach($scope.ErrorList, function (inv, i) {
                    angular.forEach(inv.data, function (rw, j) {
                        if (!rw.hsn_sc)
                            rw.hsn_sc = '';
                        if (rw.rt == iRate && rw.hsn_sc == iHsn && rw.uqc == uqc) {
                            isExistRate = true;
                            cnt++;
                        }
                    });
                });
                if (cnt > 1) {
                    frmName.rt.$setValidity('duplicate', !isExistRate);
                    frmName.uqc.$setValidity('duplicate', !isExistRate);
                    frmName.hsn_sc.$setValidity('duplicate', !isExistRate);
                }
            }
        }

        $scope.onUqcChange = function (frm) {
            if ($scope.checkNA(frm.uqc) && $scope.checkForServiceHSN(frm.hsn_sc, frm)) {
                frm.qty = 0;
            }
        }
        $scope.isRtinAsEcomGstn = function (isNew, rtin, frm) {
            
            var invFrm = frm;

            $scope.isDiffRtin = false;
	        $scope.rtinmsg='';
            if(rtin != null && rtin != undefined){
            if($scope.dashBoardDt.gstin == rtin.toUpperCase()){
                $scope.rtinmsg = 'Recipient and E-commerce Operator cannot be the same.';
                $scope.isDiffRtin = true;
            }
           
            if (invFrm.rtin) {
                invFrm.rtin.$setValidity('rtin', !$scope.isDiffRtin);
            }

            $scope.gstinRecordAdd = false;
        }}

        $scope.isSupStinAsEcomGstn = function (isNew, stin, frm) {
            var invFrm = frm;

            $scope.isDiffStin = false;
	        $scope.stinmsg='';
            if(stin != null && stin != undefined){
            if($scope.dashBoardDt.gstin == stin.toUpperCase()){
                $scope.stinmsg = 'Supplier and E-commerce Operator cannot be the same.';
                $scope.isDiffStin = true;
            }
            if (invFrm.stin) {
                invFrm.stin.$setValidity('stin', !$scope.isDiffStin);
                
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.isRecRtinAsEcomGstn = function (isNew, rtin, frm) {
            var invFrm = frm;
            $scope.isDiffRtin = false;
            $scope.rtinstinmsg='';
            if(rtin != null && rtin != undefined){
            rtin = rtin.toUpperCase();
            if($scope.dashBoardDt.gstin == rtin){
                $scope.rtinstinmsg = 'Recipient and E-commerce Operator cannot be the same.';
                $scope.isDiffRtin = true;
            }
            else if(
                invFrm.stin.$viewValue && invFrm.stin.$viewValue  == rtin){
                $scope.rtinstinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffRtin = true;
            }
          
            if (invFrm.rtin.$viewValue) {
                invFrm.rtin.$setValidity('rtin', !$scope.isDiffRtin);
            }
            $scope.gstinRecordAdd = false;
        }}

        $scope.isRecStinAsEcomGstn = function (isNew, stin, frm) {
            
            var invFrm = frm;
            $scope.stinrtinmsg='';
            $scope.isDiffStin =false;
            if(stin != null && stin != undefined){
            stin = stin.toUpperCase();
            if($scope.dashBoardDt.gstin == stin){
                $scope.stinrtinmsg = 'Supplier and E-commerce Operator cannot be the same.';
                $scope.isDiffStin = true;
            }
            else if(invFrm.rtin.$viewValue && invFrm.rtin.$viewValue== stin){
                $scope.stinrtinmsg = 'Recipient and Supplier cannot be the same.';
                $scope.isDiffStin = true;
            }
           


            if (invFrm.stin.$viewValue) {
                invFrm.stin.$setValidity('stin', !$scope.isDiffStin);
            }
            
            
            
            $scope.gstinRecordAdd = false;
        }}
       
         //date validation for old Document date
         $scope.docOldDateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot exceed the current tax period";

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.oidt.$setValidity('oidt', dtflag);

        };

        $scope.docDateLimit = function (isNew, invdt, frm) {
            var invFrm = frm;
            var dtflag = true;
           
            $scope.invdtmsg = '';
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot exceed the current tax period";
                        }

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        
                            $scope.invdtmsg = "Date is Invalid. Date of Document cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }
            invFrm.idt.$setValidity('idt', dtflag);

        };
       
       


        //in order to autopoulate pos based on stin
        $scope.getPosBasedOnStin = function (iInv) {
            var ctinOrGstin;
            if (iInv.stin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.stin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

          //in order to autopoulate pos based on rtin
          $scope.getPosBasedOnRtin = function (iInv) {
            var ctinOrGstin;
            if (iInv.rtin) {
                if (formName == "GSTR2" && tableCode == "b2b") {
                    ctinOrGstin = $scope.dashBoardDt.gstin;
                }
                else {
                    ctinOrGstin = iInv.rtin;
                }
                var uinpatt = new RegExp("/[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/");

                if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr"
                    || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1" && uinpatt.test(ctinOrGstin)) {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                } else {
                    $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
                    var obj = {};
                    obj["cd"] = "96";
                    obj["nm"] = "Foreign Country";
                    $scope.StateList.push(obj);
                    $scope.StateList.sort(function (a, b) {
                        return a.cd - b.cd;
                    });
                }
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == ctinOrGstin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }
        
        $scope.onEtinChange = function (gstin,invFrm) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.etin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            invFrm.etin.$setValidity('pattern', $scope.validGstin);
        }
        $scope.onOEtinChange = function (gstin,invFrm) {
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.oetin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
            invFrm.oetin.$setValidity('pattern', $scope.validGstin);
        }
        $scope.onRtinChange = function (gstin,frm) {
            var invFrm = frm;
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                invFrm.rtin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
                invFrm.rtin.$setValidity('pattern', $scope.validGstin);
          }

          $scope.onSuppGstinChange = function (gstin,frm) {
            var invFrm = frm;
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                invFrm.stin.$setValidity('pattern', true);
                return; 
            }
            else if (formName == 'GSTR1' && gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);
            }
            else if(gstin.length== 15){
                $scope.validGstin = $scope.validations.gstin(gstin);}
                invFrm.stin.$setValidity('pattern', $scope.validGstin);
          }  
        //CR 23892 To keep SGST and CGST same in table 14
          $scope.update14CGST = function(y){
            if(y)
            y.cgst = y.sgst;
            else
            $scope.newInvRw.cgst = $scope.newInvRw.sgst;
        };

        $scope.update14SGST = function(y){
            if(y)
            y.sgst = y.cgst;
            else
            $scope.newInvRw.sgst = $scope.newInvRw.cgst;
        };
        $scope.isEtinAsSuppGstn = function (isNew, etin, frm){
            var invFrm = frm;
            var pattern = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/;
            $scope.isDiffEtin = false;
            $scope.etinmsg = '';
            if(etin != null && etin != undefined){
            if($scope.dashBoardDt.gstin == etin.toUpperCase()){
                $scope.etinmsg = 'ECO GSTIN needs to be different from Supplier GSTIN.';
                $scope.isDiffEtin = true;
            }
            else if(invFrm.etin.$viewValue && (invFrm.nat_supp.$viewValue == 'clttx' || invFrm.nat_supp.$viewValue == 'clttxa') && pattern.test(etin) == false){
                $scope.etinmsg = 'Please enter a GSTIN of TCS taxpayer.';
                $scope.isDiffEtin = true;
            }
            if (invFrm.etin.$viewValue) {
                invFrm.etin.$setValidity('etin', !$scope.isDiffEtin);
                $scope.isDiffEtin = false;
            }
            $scope.gstinRecordAdd = false;
        }}
        $scope.isOEtinAsSuppGstn = function (isNew, oetin, frm){
            var invFrm = frm;
            var pattern = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/;
            $scope.isDiffEtin = false;
            $scope.oetinmsg = '';
            if(oetin != null && oetin != undefined){
            if($scope.dashBoardDt.gstin == oetin.toUpperCase()){
                $scope.oetinmsg = 'Original ECO GSTIN needs to be different from Supplier GSTIN.';
                $scope.isDiffEtin = true;
            }
            else if(invFrm.oetin.$viewValue && invFrm.nat_supp.$viewValue == 'clttxa' && pattern.test(oetin) == false){
                $scope.oetinmsg = 'Please enter a GSTIN of TCS taxpayer.';
                $scope.isDiffEtin = true;
            }
            if (invFrm.oetin.$viewValue) {
                invFrm.oetin.$setValidity('oetin', !$scope.isDiffEtin);
                $scope.isDiffEtin = false;
            }
            $scope.gstinRecordAdd = false;
        }}
        $scope.validateQty = function (frm, data) {
            frm.qty.$setValidity('validQty', true);
            frm.uqc.$setValidity('validUQC', true);
            if (data.uqc && data.uqc == 'NA' && data.qty != 0 && String(data.hsn_sc).substring(0, 2) == '99') {
                frm.qty.$setValidity('validQty', false);
            }

            if (String(data.hsn_sc).substring(0, 2) != '99' && data.uqc == 'NA') {
                frm.uqc.$setValidity('validUQC', false);
            }
        }

        $scope.checkNA = function (uqc) {
            if (uqc == "NA") {
                return true;
            }
            return false;
        }

        $scope.clearHSNInput = function () {
            $scope.isHsnSelected = false;
            $scope.newInvRw.desc = null;
            $scope.newInvRw.user_desc = null;
            $scope.hsnsaveedit = false;
            $scope.newInvRw.uqc = null;
            $scope.newInvRw.rt = null;
            $scope.newInvRw.productName = null;
            $scope.hsnNotfromMstr =null;
            $scope.hideaddBtn = false;
            $scope.newInvRw.txval = 0;
            $scope.newInvRw.qty = 0;
            $scope.newInvRw.iamt = 0;
            $scope.newInvRw.samt = 0;
            $scope.newInvRw.camt = 0;
            $scope.newInvRw.csamt = 0;
            $scope.newInvValidtr = false;
            $scope.newInvRw.hsn_sc=null;
            $scope.newInvFrm.hsn_sc.$setValidity('duplicate', true);
            $scope.newInvFrm.uqc.$setValidity('duplicate', true);
        }

        //Formaters
        if (shareData.dashBoardDt.tbl_cd == "b2cs" || shareData.dashBoardDt.tbl_cd == "b2csa" || shareData.dashBoardDt.tbl_cd == "at" || shareData.dashBoardDt.tbl_cd == "atadj" || shareData.dashBoardDt.tbl_cd == "ata" || shareData.dashBoardDt.tbl_cd == "atadja" || shareData.dashBoardDt.tbl_cd == "txi" || shareData.dashBoardDt.tbl_cd == "b2bur" || shareData.dashBoardDt.tbl_cd == "ecomb2c" || shareData.dashBoardDt.tbl_cd == "ecomurp2c" || shareData.dashBoardDt.tbl_cd == "ecomab2c" || shareData.dashBoardDt.tbl_cd == "ecomaurp2c") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }

        //if sez taxpayer only inter-state supplies for cdnra
        if (isSezTaxpayer && shareData.dashBoardDt.tbl_cd == "cdnra" && shareData.dashBoardDt.form == "GSTR1") {
            $scope.suplyList = [{
                name: "Intra-State",
                cd: "INTRA"
            }, {
                name: "Inter-State",
                cd: "INTER"
            }];
        }

        var reformateInv = ReturnStructure.reformateInv($scope.suplyList, shareData.dashBoardDt.gstin, tableCode, formName, true, isSezTaxpayer, $scope.years),
            formateNodePayload = ReturnStructure.formateNodePayload(tableCode, formName, true),
            getInv = ReturnStructure.getInv(tableCode, formName),
            getItm = ReturnStructure.getItm(tableCode, formName),
            getInvKey = ReturnStructure.getInvKey(tableCode, formName);

        //To init new invoice row
        function initNewInvRow() {
            $scope.newInvRw = ReturnStructure.getNewInv(tableCode, formName);

        }

        $scope.savePayload = function (frmName) {
            $scope.hideaddBtn = false;
            $scope.hsnNotfromMstr =null;
            if (!frmName) {
                frmName = $scope.newInvFrm
            }
            var newInvoice = angular.copy($scope.newInvRw);
            if (tableCode == "b2cs" || tableCode == "b2csa") {
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
            } else {
                newInvoice.val = Number(newInvoice.val);
            }
            if (tableCode == 'hsn' || tableCode == 'hsnsum') {
                var iLen = $scope.ReceiverSummaryList.length;
                newInvoice.num = iLen + 1;
                newInvoice.txval = Number(newInvoice.txval);
                newInvoice.iamt = Number(newInvoice.iamt);
                newInvoice.camt = Number(newInvoice.camt);
                newInvoice.samt = Number(newInvoice.samt);
                newInvoice.csamt = Number(newInvoice.csamt);
            }

            if (frmName.$valid) {
                var stdata = angular.copy(newInvoice);
                if (stdata) {
                    R1InvHandler.emptyItemUploadAdd($scope, stdata, formateNodePayload).then(function (response) {
                        if (response) {
                            $scope.ReceiverSummaryList.push(newInvoice);
                            $scope.newInvValidtr = false;
                            initNewInvRow();
                        }
                    });
                }
            } else {
                $scope.newInvValidtr = true;
            }
        
        }

        //pagination current page records selection
        $scope.checkAll = function () {
            var toggleStatus = !allOnCurrentPageSelected();
            thisPageItems()
                .forEach(function (y) {
                    y.select = toggleStatus;

                });
        }

        $scope.checkAllNew = function (inv, flg) {
            angular.forEach($scope.ErrorList, function (outerData, outerIndex) {
                angular.forEach(outerData.data, function (innerData, innerIndex) {
                    $scope.ErrorList[outerIndex].data[innerIndex].select = flg;
                });
            });
        }

        $scope.checkAllHsn = function (inv, flg) {
            switch(tableCode) {
                case "hsn":
                    angular.forEach($scope.ErrorList, function (outerData, outerIndex) {
                        angular.forEach(outerData.data, function (innerData, innerIndex) {
                            $scope.ErrorList[outerIndex].data[innerIndex].select = flg;
                        });
                    });
                    break;
                case "hsn(b2b)":
                    angular.forEach($scope.ErrorList, function (outerData, outerIndex) {
                        angular.forEach(outerData.hsn_b2b, function (innerData, innerIndex) {
                            $scope.ErrorList[outerIndex].hsn_b2b[innerIndex].select = flg;
                        });
                    });
                    break;
                case "hsn(b2c)":
                    angular.forEach($scope.ErrorList, function (outerData, outerIndex) {
                        angular.forEach(outerData.hsn_b2c, function (innerData, innerIndex) {
                            $scope.ErrorList[outerIndex].hsn_b2c[innerIndex].select = flg;
                        });
                    });
                    break;
            }
        }

        // set the state of the "check all" checkbox
        $scope.allSelected = function () {
            return ($scope.ErrorList.length) ? allOnCurrentPageSelected() : false;
        };

        //to get only current page collection 
        function thisPageItems() {
            var start = ($scope.currentPage - 1) * $scope.pageSize;
            var end = start + $scope.pageSize;
            return $scope.ErrorList
                .filter(function (y, index) {
                    return start <= index && index < end;
                });
        }

        function allOnCurrentPageSelected() {
            return thisPageItems().every(function (y) {
                return y.select;
            });
        }

        $scope.initSumryList = initErrSummary;

        //To get list 
        function initErrSummary() {
            g1FileHandler.getErrorContentsFor($scope.dashBoardDt, tableCode).then(function (response) {
                $log.debug("errorreturnsctrl -> getErrContentsFor success:: ", response);
                var temp = {};
                if (response) {
                    if (tableCode === "hsn") {

                        if (!R1Util.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                            response = response;
                        }
                        else {
                            if (response[0])
                                response = response[0];
                            if (response.error_msg) {
                                $scope.error_msg = response.error_msg;
                            }
                            response = response.data;
                        }
                    }


                    if (tableCode === "hsnsum") {
                        if (typeof response[0] !== 'undefined')
                            response = response[0];
                        response = response.det;
                    }
                    if (tableCode === "nil_supplies") {
                        response = response[0];
                    }

                    $scope.ErrorList = reformateInv(response);

                    $scope.sortReverse = !$scope.sortReverse;
                    $scope.sort(getInvKey);

                }

            }, function (response) {
                $log.debug("errorreturnsctrl -> getErrContentsFor fail:: ", response);
            });
        }

        $scope.initSumryList = initErrSummary;

        $scope.freezeOrder = function (name) {
            // $scope.ErrorList = $filter('orderBy')($scope.ErrorList, name);
            for (var i = 0; i < $scope.ErrorList.length && i <= 9999; ++i) {
                $scope.ErrorList[i]['frozenOrder'] = ("000" + i).slice(-4);
            }
            $scope.sortBy = 'frozenOrder';
        };

        $scope.onGstinChange = function (gstin, frm) {
            let form = frm;
            $scope.validGstin = false;
            if(gstin== null || gstin=="" || $scope.isGSTINSelected){
                $scope.newInvFrm.ctin.$setValidity('pattern', true);
                return;
            }
            if (form == 'GSTR1'){
                $scope.validGstin = $scope.validations.gstin(gstin) || $scope.validations.uin(gstin) || $scope.validations.tdsid(gstin) || $scope.validations.nrtp(gstin);}
            else
                $scope.validGstin = $scope.validations.gstin(gstin);
            form.ctin.$setValidity('pattern', $scope.validGstin);
            $scope.gstinRecordAdd = false;
        }

        $scope.onYearChange = function (iInv) {
            for (var i = 0; i < $scope.years.length; i++) {
                var yearObj = $scope.years[i];
                if (yearObj.year === iInv.oyear.year) {
                    iInv.oyear = yearObj;
                }
            }
        }

        //IMPS supply type condition for cdnur
        $scope.invTypeChanged = function (inv) {
            if (inv.inv_typ == "IMPS") {
                inv.sp_typ = $scope.suplyList[1];
            }

        }

        //cdn change in supply type
        $scope.change_suptyp = function (iInv) {
            if (iInv.itms && iInv.itms.length > 0) {
                iInv.itms = [];
            }
        }

        function getErrorInvOnly(iResp) {
            var errList = [];
            switch (tableCode) {
                case 'b2b':
                    angular.forEach(iResp, function (inv, i) {
                        if (inv.hasOwnProperty('error_cd')) {
                            errList.push(inv);
                        }
                    });
                    break;
                case 'cdnr':
                    angular.forEach(iResp, function (inv, i) {
                        if (inv.hasOwnProperty('error_cd')) {
                            errList.push(inv);
                        }
                    });
                    break;

            }
            return errList;
        }
        $scope.shouldAllowUncheck = function (iInv) {
            if (!iInv) return false;
            if (iInv.inv_typ != 'CBW')

                return false;
            // if same pos ? 
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var pos = iInv.pos;
            if (my_code != pos)
                return false;
            //pos matches, sez should be allowed
            if (isSezTaxpayer)
                return false;
            return true;

        }

        if ((shareData.dashBoardDt.tbl_cd == "b2ba" || shareData.dashBoardDt.tbl_cd == "b2b" || shareData.dashBoardDt.tbl_cd == "cdnr" || shareData.dashBoardDt.tbl_cd == "cdnra") && shareData.dashBoardDt.form == "GSTR1") {
            $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
            var obj = {};
            obj["cd"] = "96";
            obj["nm"] = "Foreign Country";
            $scope.StateList.push(obj);
            $scope.StateList.sort(function (a, b) {
                return a.cd - b.cd;
            });
        } else {
            $scope.StateList = $.grep($scope.StateList, function (element, index) { return element.cd == "96" }, true);
        }

        $scope.returnStateList = function (iInv) {
            var my_code = shareData.dashBoardDt.gstin.slice(0, 2);
            var disableAid = true;

            if (iInv && iInv.inv_typ == 'CBW')
                disableAid = false;

            var state_list = $scope.StateList

            for (var i = 0; i < state_list.length; i++) {
                if (state_list[i].cd == my_code) {
                    if (!isSezTaxpayer && disableAid)
                        state_list[i].disabled = true;
                    else
                        state_list[i].disabled = false;
                }
                else {
                    state_list[i].disabled = false;
                }

            }

            return state_list;



        }


        //To diable pos same as gstin in b2cl n b2cla
        $scope.stcodedisable = function (iInv) {
           
            var disableAid = true;
            if (iInv) {
                // iInv.pos = null;
            }
            if (iInv && iInv.inv_typ == 'CBW')
                disableAid = false;
            for (var i = 0; i < $scope.StateList.length; i++) {
                if ($scope.StateList[i].cd == shareData.dashBoardDt.gstin.slice(0, 2)) {
                    if (disableAid)
                        $scope.StateList[i].disabled = true;
                    else
                        $scope.StateList[i].disabled = false;
                }
                else {
                    $scope.StateList[i].disabled = false;
                }
            }
        };

        $scope.convertStrToNum = function (iObj, iKey) {
            if (iObj[iKey])
                iObj[iKey] = Number(iObj[iKey]);

        }

        //to decide supplytype based on pos in b2cl
        $scope.suppType = function (iInv) {
            if (iInv.pos) {
                var ctin = shareData.dashBoardDt.gstin.slice(0, 2),
                    pos = iInv.pos;

                if (ctin === pos) {
                    iInv.sp_typ = $scope.suplyList[1];
                } else {
                    iInv.sp_typ = $scope.suplyList[1];
                }
            }
        }

        //in order to autopoulate pos based on ctin
        $scope.getPosBasedOnCtin = function (iInv) {
            if (iInv.ctin) {
                for (var i = 0; i < $scope.StateList.length; i++) {
                    if ($scope.StateList[i].cd == iInv.ctin.slice(0, 2)) {
                        iInv.pos = $scope.StateList[i].cd;
                        $scope.onCtinChange(iInv);
                    }
                }
            }
            $scope.gstinRecordAdd = false;
        }

        $scope.dashbrdGstn = shareData.dashBoardDt.gstin.substring(0, 2);
        $scope.isIntraStateB2CS = function (obj) {
            var gstin = $scope.dashBoardDt.gstin.slice(0, 2);
            if (obj.pos == gstin && !isSezTaxpayer)
                return true;
            return false;

        };

        $scope.sezimp = function (obj) {
            if (obj.is_sez == 'Y') {
                $scope.sezflag = true;

            }
            else {
                $scope.sezflag = false;
                delete obj.ctin;
            }
        }

        $scope.onPosChangeB2CS = function (y) {
            var isIntra = $scope.isIntraStateB2CS(y);
            if (isIntra && !isSezTaxpayer) {
                y.sply_ty = $scope.suplyList[0].cd;
                y.iamt = 0;
                // y.camt = (y.rt != null) ? parseFloat(((y.rt * y.txval) * 0.005).toFixed(2)) : 0;
                //  y.samt = (y.rt != null) ? parseFloat(((y.rt * y.txval) * 0.005).toFixed(2)) : 0;
                y.camt = 0;
                y.samt = 0;
                y.csamt = 0;
                y.txval = 0;
                y.rt = 0;

            } else {
                y.sply_ty = $scope.suplyList[1].cd;
                //  y.iamt = (y.rt != null) ? parseFloat(((y.rt * y.txval) / 100).toFixed(2)) : 0;
                y.camt = 0;
                y.samt = 0;
                y.iamt = 0;
                y.csamt = 0;
                y.txval = 0;
                y.rt = 0;
            }
        };


        $scope.onPosChangeB2BUR = function (y) {
            var isIntra = $scope.isIntraStateB2BUR(y);
            if (isIntra) {
                y.sp_typ = $scope.suplyList[0];

            } else {
                y.sp_typ = $scope.suplyList[1];

            }
        };

        $scope.isIntraStateB2BUR = function (obj) {
            if (obj.pos == $scope.dashbrdGstn)
                return true;
            return false;

        };

        $scope.onSetDiffPer = function (iInv) {
            iInv.diffval = false;
        }

        //To clear the items if  differential percentage is changed,in case of no items clear to tax values respectively
        $scope.onDiffPerChange = function (iInv) {
            iInv.diffval = false;
            if (iInv.itms.length > 0) {
                iInv.diffval = true;
                $scope.createAlert("Warning", "Applicable % of tax rates got changed. Please add items level details.", function () {
                    iInv.itms = [];
                    $scope.gotoAddItems(iInv);
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }
        }

        $scope.isInvalidNumber = false;
        $scope.isDuplicateNumber = false;
        $scope.isDuplicateInvoice = function (isNew, inv, key, frm) {
            var isExistInvoice = false,
                frmName = (isNew) ? $scope.newInvFrm : frm;
            var reqParam = shareData.dashBoardDt,
                isDupChkRequired = true;


            if (inv[key]) {
                if (Number(inv[key] == 0)) {
                    $scope.isDuplicateNumber = false;
                    $scope.isInvalidNumber = true;
                    frmName[key].$setValidity(key, false);
                }
                else {
                    if (!isNew) {
                        if (reqParam.tbl_cd == 'b2ba' || reqParam.tbl_cd == 'b2cla' || reqParam.tbl_cd == 'expa') {
                            isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                        else if (reqParam.tbl_cd == 'cdnra' || reqParam.tbl_cd == 'cdnura') {
                            if (key == "nt_num")
                                isDupChkRequired = (inv.old_ntnum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                            else if (key == "inum")
                                isDupChkRequired = (inv.old_inum.toLowerCase() == inv[key].toLowerCase()) ? false : true
                        }
                    }

                    //reqParam.invdltArray = ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName);
                    reqParam.key = key;
                    reqParam.value = inv[key];

                    if (isDupChkRequired) {
                        g1FileHandler.checkDuplicateInvoice(reqParam, "Error").then(function (response) {
                            isExistInvoice = (response.result == 'yes') ? true : false;
                            if (isExistInvoice) {
                                $scope.isInvalidNumber = false;
                                $scope.isDuplicateNumber = true;
                                frmName[key].$setValidity(key, !isExistInvoice);
                            }
                        }, function (response) {
                            $log.debug("returnsctrl -> checkDuplicateInvoice fail:: ", response);
                        });
                    }
                    else {
                        frmName[key].$setValidity(key, !isExistInvoice);
                    }
                }
            }

        }

        $scope.onCBWChangeB2CL = function (iInv) {

            var prevSuppType = iInv.sp_typ.name;


            if (iInv.inv_typ == 'CBW' || iInv.pos != shareData.gstinNum.slice(0, 2)) {
                iInv.sp_typ.name = "Inter-State";
            } else {
                iInv.sp_typ.name = "Intra-State";
            }

            if (prevSuppType != iInv.sp_typ.name && iInv.itms && iInv.itms.length > 0) {
                $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                    iInv.itms = [];
                    $scope.gotoAddItems(iInv);
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
            }

        }

        //To clear the items if  supply type changed,in case of no items clear to tax values respectively
        $scope.onPosChange = function (iInv, isNew) {
            if (iInv && (iInv.pos || iInv.state_cd || iInv.ctin || iInv.cpty || iInv.sup_ty)) {
                var oldInv = iInv;
                var list = $scope.suplyList;
                if(tableCode == 'ecomaurp2c'){
                    var prvSupplyTyp = {};
                    prvSupplyTyp.name = iInv.sply_ty;
                }else{
                    var prvSupplyTyp = iInv.sp_typ;
                }
                    
                var tin, code, sup_ty, curntSuplyType;
                if (tableCode == 'b2b' || tableCode == 'b2ba') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                } else if (tableCode == 'b2bur' || tableCode == 'b2bura') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'b2cl' || tableCode == 'b2cla') {
                    tin = $scope.dashBoardDt.gstin;
                    code = iInv.pos;

                } else if (tableCode == 'ecomb2b' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2b' || tableCode == 'ecomurp2c'){
                    tin = iInv.rtin;
                    code = iInv.pos; 
                } else if (tableCode == 'ecomab2b' ||tableCode == 'ecomaurp2b'){
                    tin = iInv.rtin;
                    code = iInv.pos; 
                }
                else if (tableCode == 'at' || tableCode == 'ata' || tableCode == 'b2csa' || tableCode == 'txi' || tableCode == 'atxi' || tableCode == 'atadj' || tableCode == 'atadja') {

                    code = iInv.pos;
                    getUniqueInvoice(oldInv, iInv);
                    // $scope.isPosSelectd = (code) ? true : false;
                    return;
                } else if(tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c') {
                    var prvSupplyTyp1 = iInv.sply_ty,
                    code = iInv.pos;
                    getUniqueInvoice(oldInv, iInv);
                } else if (tableCode == 'b2cs') {
                    tin = shareData.dashBoardDt.gstin;
                    code = iInv.pos;
                } else if (tableCode == 'cdnr' || tableCode == 'cdnra') {
                    tin = iInv.ctin;
                    code = iInv.pos;
                }

                if (tableCode == "b2cl" || tableCode == "b2cla") {
                    if (code) {
                        iInv.sp_typ = $scope.suplyList[1];
                    }
                } else {
                    iInv.sp_typ = R1Util.getSupplyType(list, tin, code, isSezTaxpayer, sup_ty);
                    if ((tableCode == "b2b" || tableCode == "b2ba" || tableCode == "cdnr" || tableCode == "cdnra" || tableCode == "ecomb2b" || tableCode == "ecomurp2b" || tableCode == "ecomab2b" || tableCode == "ecomaurp2b") && (iInv.inv_typ && (iInv.inv_typ != 'R' && iInv.inv_typ != 'DE')) && !isSezTaxpayer) {
                        iInv.sp_typ = list[1];
                    }
                }
                if (prvSupplyTyp.name !== iInv.sp_typ.name) {

                    if (iInv.itms && iInv.itms.length > 0) {
                        //Added by Janhavi CBW+rchrg defect fix
                        if (iInv.inv_typ == "CBW" && iInv.rchrg == "N") {
                            $scope.createAlert("WarningOk", "Supply type got changed. Please add all the mandatory details to proceed and add item level details again.", function () {
                                iInv.itms = [];
                            });
                        }
                        else {
                            $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                                iInv.itms = [];
                                $scope.gotoAddItems(iInv);
                            });
                        }

                        // if ($scope.initSumryList)
                        //     $scope.initSumryList();

                    } else {
                        if (isNew) {
                            clearTaxRates(1, iInv, 1);
                            $scope.isIntraState(1, iInv);
                        } else {
                            clearTaxRates(0, iInv, 1);
                            $scope.isIntraState(0, iInv);
                        }
                    }
                }
                if(prvSupplyTyp1 !== iInv.sply_ty && (tableCode == 'ecomab2c' || tableCode == 'ecomaurp2c')){
                    if (iInv.itms && iInv.itms.length > 0) {
                        $scope.createAlert("Warning", "Supply type got changed. Please add items level details.", function () {
                            iInv.itms = [];
                            $scope.gotoAddItems(iInv);
                        });
                    }
                }
            }
            getUniqueInvoice(oldInv, iInv);

        }
        //to get unique invoice from list based on unique values in invoice
        function getUniqueInvoice(oldInv, modifiedInv, isIntraStateFn) {

            var returnValue = null,
                iIndex = null;
            if (oldInv) {

                var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, oldInv, formName),
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

                if (isIntraStateFn) {
                    var returnObj = {};
                    returnObj.index = iIndex;
                    returnObj.data = returnValue;
                    return returnObj;
                }
            }
            return returnValue;
        }


        //To clear taxrates if pos changed in case of no item level
        function clearTaxRates(isNew, iInv, isSpTypChnge) {

            var stdata = null,
                oData = null,
                exIndex = null;

            if (iInv) {
                oData = getUniqueInvoice(iInv, iInv, 1);
                stdata = oData.data;
                exIndex = oData.index;
            }

            var invData = (isNew) ? $scope.newInvRw : stdata;

            if (invData) {
                if (invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) {
                    if (isSpTypChnge) {
                        invData.irt = 0;
                        invData.iamt = 0;
                        if (invData.itc && shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_i = 0;
                            invData.itc.tc_i = 0;
                        }
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                } else {
                    if (isSpTypChnge) {
                        invData.crt = 0;
                        invData.camt = 0;
                        invData.srt = 0;
                        invData.samt = 0;
                        if (invData.itc && shareData.dashBoardDt.form == "GSTR2") {
                            invData.itc.tx_s = 0;
                            invData.itc.tx_c = 0;
                            invData.itc.tc_c = 0;
                            invData.itc.tc_s = 0;
                        }
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                }

            }

            if (isNew) {
                $scope.newInvRw = invData;
            } else {
                $scope.ErrorList[exIndex] = invData;
            }
        }

        //To clear taxrates if pos changed in case of no item level only for itc_rcd(GSTR2)
        function clearTaxRatesOfItc_rcd(isNew, iInv, isSpTypChnge) {

            var stdata = null,
                oData = null,
                exIndex = null;

            if (iInv) {
                oData = getUniqueInvoice(iInv, iInv, 1);
                stdata = oData.data;
                exIndex = oData.index;
            }

            var invData = (isNew) ? $scope.newInvRw : stdata;

            if (invData) {
                if (invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) {
                    if (isSpTypChnge) {
                        invData.o_ig = 0;
                        invData.n_ig = 0;
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                } else {
                    if (isSpTypChnge) {
                        invData.o_cg = 0;
                        invData.n_cg = 0;
                        invData.o_sg = 0;
                        invData.n_sg = 0;
                        // invData.csrt = 0;
                        // invData.csamt = 0;
                    }
                }

            }

            if (isNew) {
                $scope.newInvRw = invData;
            } else {
                $scope.ErrorList[exIndex] = invData;
            }
        }


        $scope.spTypChange = function (isNew, iInv) {
            if (shareData.dashBoardDt.form == "GSTR2" && tableCode == "itc_rcd") {
                clearTaxRatesOfItc_rcd(isNew, iInv, true);
            } else {
                clearTaxRates(isNew, iInv, true);
            }
        }



        //To check value of b2cl Invoices(>=250000)

        $scope.isLargeInv = function (isNew, val, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isValidAmt = (val && val <= $scope.B2CL_MIN) ? false : true;
            frmName.val.$setValidity('val', isValidAmt);
        }





        //To check shipping date less than invoice date in exp,expa
        $scope.isLessThanInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var isValidDt = (moment(iInv.sbdt, dateFormat).isBefore(moment(iInv.idt, dateFormat))) ? false : true;

            if (frmName.sbdt) {
                frmName.sbdt.$setValidity('sbdt', isValidDt);
            }
        }

        //To check revised inv date greater than original invoice date
        $scope.isLessThanOrgInvDate = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var sbdtOrOdt = null,
                idtOrRevdt = null;
            if (((tableCode == "b2ba") && shareData.dashBoardDt.form == "GSTR1") || tableCode == "b2cla" || tableCode == "expa") {
                sbdtOrOdt = iInv.odt;
                idtOrRevdt = iInv.idt;

            }
            if (((tableCode == "b2ba") && shareData.dashBoardDt.form == "GSTR2") || tableCode == "b2bura") {
                sbdtOrOdt = iInv.oidt;
                idtOrRevdt = iInv.idt;
            }
            if (tableCode == "cdnra") {
                sbdtOrOdt = iInv.ont_dt;
                idtOrRevdt = iInv.nt_dt;
            }
            if (tableCode == "ata") {
                sbdtOrOdt = iInv.odoc_dt;
                idtOrRevdt = iInv.doc_dt;
            }
            if (tableCode == "atxi") {
                sbdtOrOdt = iInv.otdt;
                idtOrRevdt = iInv.dt;
            }
            if (tableCode == "imp_ga") {
                sbdtOrOdt = iInv.oboe_dt;
                idtOrRevdt = iInv.boe_dt;
            }
            if (tableCode == "imp_sa") {
                sbdtOrOdt = iInv.oi_dt;
                idtOrRevdt = iInv.i_dt;
            }
            var isValidDt = (moment(idtOrRevdt, dateFormat).isBefore(moment(sbdtOrOdt, dateFormat))) ? false : true;
            if (frmName.idt) {
                frmName.idt.$setValidity('idt', isValidDt);
            }
            if (frmName.nt_dt) {
                frmName.nt_dt.$setValidity('nt_dt', isValidDt);
            }
            if (frmName.doc_dt) {
                frmName.doc_dt.$setValidity('doc_dt', isValidDt);
            }
            if (frmName.boe_dt) {
                frmName.boe_dt.$setValidity('boe_dt', isValidDt);
            }
            if (frmName.i_dt) {
                frmName.i_dt.$setValidity('i_dt', isValidDt);
            }
            if (frmName.dt) {
                frmName.dt.$setValidity('dt', isValidDt);
            }
        }



        //validation for same receiver gstin n supplier gstin
        $scope.isRecGstnAsSupGstn = function (isNew, ctin, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            $scope.isDiffCtin = ($scope.dashBoardDt.gstin == ctin) ? true : false;

            if (frmName.ctin) {
                frmName.ctin.$setValidity('ctin', !$scope.isDiffCtin);
            }
           // $scope.gstinRecordAdd = false;
            //return isDiffCtin;
        }

        //validation for same etin n receiver gstin n supplier gstin
        $scope.isEtinAsSupRecGstin = function (isNew, iInv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;

            var isDiffEtin = ($scope.dashBoardDt.gstin == iInv.etin || iInv.ctin == iInv.etin) ? true : false;

            if (frmName.etin) {
                frmName.etin.$setValidity('etin', !isDiffEtin);
            }
            // return isDiffEtin;
        }

        $scope.sortReverse = false;
        $scope.sort = function (sortKey) {
            $scope.sortBy = sortKey;
            $scope.sortReverse = !$scope.sortReverse;
            // initErrSummary();
        }
        //To check if valid Invoice Type is selected
        $scope.validateNoteType = function (colkey, isNew, inv, frm) {
            let form = (isNew) ? $scope.newInvFrm : frm;
            let isValid = true;
            if (inv.inv_typ == 'CBW' && inv.rchrg != 'Y') {
                isValid = false;
            }
            if (colkey != 'rchrg') {
                if (inv.inv_typ != 'R' && inv.inv_typ != 'CBW') {
                    inv.etin = null;
                    inv.rchrg = 'N';
                }
            }
            form.inv_typ.$setValidity('inv_typ', isValid);
        }

        //duplicate invoice check
        $scope.isExistingInv = function (iNum) {
            var isExistInv = false;
            angular.forEach($scope.ReturnsList, function (inv, i) {
                if ((inv.onum && inv.onum.toLowerCase() == iNum.toLowerCase()) || (inv.inum && inv.inum.toLowerCase() == iNum.toLowerCase()) || (inv.doc_num && inv.doc_num.toLowerCase() == iNum.toLowerCase()) || (inv.odoc_num && inv.odoc_num.toLowerCase() == iNum.toLowerCase())) {
                    isExistInv = true;
                }
            });
            return (isExistInv) ? true : false;
        }

        //To display empty row in Lastpage only in case of pagination
        $rootScope.isLastPage = function (currentPage, pageSize) {
            var isLast = false,
                total = ($scope.ErrorList.length > 25) ? Math.ceil((($scope.ErrorList.length) / pageSize)) : 1;
            if (total == currentPage) {
                isLast = true;
            }
            return isLast;
        }

        $scope.invTypeSelected = function (rowObj) {
            if (rowObj.inv_typ != 'R') {
                rowObj.etin = null;
                rowObj.rchrg = 'N';
            }
        };


        //To make etin as mandatory field in case of b2cs & b2csa
        $scope.isEcom = function (inv) {
            if (inv.typ == "OE") {
                if (inv.etin) {
                    inv.etin = null;
                }
                return false;
            }
            return true;
        }

        //In exp,expa supplylist only inter-state
        $scope.supplyList = [];
        $scope.supplyList.push($scope.suplyList[1]);

        //date validation		
        $scope.dateLimit = function (isNew, invdt, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var dtflag = true;
            if (invdt !== undefined && invdt !== null && invdt !== "") {
                if (moment(invdt, dateFormat).isValid()) {
                    if (moment(invdt, dateFormat).isAfter(moment($scope.maxmDate, dateFormat))) {
                        dtflag = false;
                        if (isNew) {
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                        }

                    }
                    else if (moment(invdt, dateFormat).isBefore(moment($scope.min_dt, dateFormat))) {
                        dtflag = false;
                        if (isNew)
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                    }

                } else {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date does not exists in the calendar";
                    // return true;
                }
            }
            else {
                dtflag = true;
            }

            frmName.idt.$setValidity('idt', dtflag);

        };

        $scope.maxmDate = "";
        //To disable Future Dates
        $scope.datefunc = function () {
            var rtDt = null,
                today = moment().format(dateFormat),
                temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
                lastDate1 = lastDate.format(dateFormat);
            if (moment(lastDate1, dateFormat).isAfter(moment(today, dateFormat))) {
                rtDt = today;
            } else {
                rtDt = lastDate1;
            }
            $scope.maxmDate = rtDt;
            return rtDt;
        };

        $scope.todayDate = function () {
            return moment().format(dateFormat);
        }

        //to disable pos if type is regd in case of txi n atxi in gstr2
        $scope.isRegd = function (iInv) {
            return (iInv.state_cd && iInv.reg_type == "REGD") ? true : false;
        }

        //in order to get statecode based on cpty if regd
        $scope.getStateCodeBasedOnCtin = function (iInv) {
            if (iInv.reg_type == "REGD") {
                if (iInv.cpty) {
                    for (var i = 0; i < $scope.StateList.length; i++) {
                        if ($scope.StateList[i].cd == iInv.cpty.slice(0, 2)) {
                            iInv.state_cd = $scope.StateList[i].cd;
                            $scope.onCtinChange(iInv);
                        }
                    }
                }
            } else {
                $scope.onCtinChange(iInv);
            }
        }

        $scope.min_dt = "";
        $scope.minDate = function () {
            var firstMonth = $scope.monthList[0],
                temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2),
                temp2 = "01072017",
                firstDate = moment(temp2, dateFormat),
                firstDate1 = firstDate.format(dateFormat),
                lastDate = moment(temp1, dateFormat),
                lastDate1 = lastDate.format(dateFormat);
            var diff = lastDate.diff(firstDate, 'months');
            $scope.min_dt = firstDate1;
            //temp = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2)

            return $scope.min_dt;

        };

        $scope.dateVal = $scope.minDate();

        //Navigate to Items Page 
        $scope.gotoAddItems = function (iInv) {
            if (iInv == 'add') {

                if ($scope.newInvFrm.$valid) {
                    var iData = $scope.newInvRw;
                    if (iData.val)
                        iData.val = Number(iData.val);
                    shareData.itmInv = iData;
                    shareData.isNewRec = true;
                    $scope.page("/error/gstr/items/" + tableCode);
                } else {
                    $scope.newInvValidtr = true;
                }
            } else {

                shareData.isNewRec = false;
                if (iInv.val)
                    iInv.val = Number(iInv.val);
                if (tableCode == 'b2b' || tableCode == 'b2ba' || tableCode == 'cdnr' || tableCode == 'cdnra' || tableCode == 'ecomb2b' || tableCode == 'ecomurp2b' || tableCode == 'ecomab2b' || tableCode == 'ecomaurp2b') {
                    if (iInv.inv_typ == 'SEWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
                                obj.itm_det.iamt = 0;
                                obj.itm_det.csamt = 0;
                            } else if (obj.itm_det.camt) {
                                obj.itm_det.camt = 0;
                                obj.itm_det.samt = 0;
                                obj.itm_det.csamt = 0;
                            }

                        });
                    }
                    /* if (iInv.inv_typ == 'DE') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.csamt)
                                obj.itm_det.csamt = 0;
                        });
                    } */
                }
                if (tableCode == 'cdnur' || tableCode == 'cdnura') {
                    if (iInv.typ == 'EXPWOP') {
                        angular.forEach(iInv.itms, function (obj, key) {
                            if (obj.itm_det.iamt || obj.itm_det.csamt) {
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
                if (tableCode == "at" || tableCode == "txi" || tableCode == "atadj" || tableCode == "ata" || tableCode == "atadja") {
                    shareData.itmInv = iInv;
                } else {
                    shareData.itmInv = getUniqueInvoice(iInv);

                }
                $scope.page("/error/gstr/items/" + tableCode);

            }
        }

        //To update Invoices at level1
        $scope.updateInvoice = function (iInv) {
            $scope.hsnNotfromMstr =null;
            iInv.error_msg = "M";
            var stdata = null,
                updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tableCode, iInv, formName);
            if (tableCode == "b2cs" || tableCode == "hsn" || tableCode == "hsnsum" ||  tableCode == "ecomb2c" || tableCode == "ecomurp2c") {
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
            } 
            else if (tableCode == "hsn(b2b)" || tableCode == "hsn(b2c)" ){
                iInv.txval = Number(iInv.txval);
                iInv.iamt = Number(iInv.iamt);
                iInv.camt = Number(iInv.camt);
                iInv.samt = Number(iInv.samt);
                iInv.csamt = Number(iInv.csamt);
                iInv.rt = Number(iInv.rt);
            
            } else if(tableCode == 'supeco' || tableCode == 'supecoa'){
                iInv.suppval = Number(iInv.suppval);
                iInv.igst = Number(iInv.igst);
                iInv.cgst = Number(iInv.cgst);
                iInv.sgst = Number(iInv.sgst);
                iInv.cess = Number(iInv.cess);
                if(iInv.suppval > 0 && (iInv.igst < 0 || iInv.cgst < 0 || iInv.sgst < 0 || iInv.cess < 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    $scope.initSumryList();
                    return;
                } else if (iInv.suppval < 0 && (iInv.igst > 0 || iInv.cgst > 0 || iInv.sgst > 0 || iInv.cess > 0)){
                    $scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
                    $scope.initSumryList();
                    return;
                }
            }
            else {
                iInv.val = Number(iInv.val);
            }
            if (iInv.diffval) {
                $scope.createAlert("Warning", "Item level tax amounts may have been updated. Please check and confirm.", function () {
                    $scope.gotoAddItems(iInv);
                    iInv.diffval = false;
                });
                if ($scope.initSumryList)
                    $scope.initSumryList();
                return false;
            }
            // if (iInv) stdata = getUniqueInvoice(iInv);
            stdata = iInv;
            if (stdata) {
                if (tableCode == "hsn" || tableCode == "b2cs" || tableCode == 'hsnsum' || tableCode == 'supeco' || tableCode == 'supecoa' || tableCode == 'ecomb2c' || tableCode == 'ecomurp2c') {
                    R1InvHandler.emptyItemUpdateErrorPayload($scope, stdata, updatedNodeDetails, formateNodePayload);
                    // reloadPage();
                }

                else {
                    R1InvHandler.updateErrorPayload($scope, stdata, updatedNodeDetails, formateNodePayload);
                    // reloadPage();
                }

            } else {
                R1InvHandler.emptyItemUpdateErrorPayload($scope, stdata, updatedNodeDetails, formateNodePayload);
                // reloadPage();
            }

        }

        function reloadPage() {
            if ($scope.sectionListSelected.url[0] !== '/') {
                $scope.sectionListSelected.url = "/" + $scope.sectionListSelected.url;
            }
        }

        //This method will delete multiple inv
        $scope.deleteSelectedRows = function () {
            var rtArry = [],
                invdltArray = [];
            angular.forEach($scope.ErrorList, function (inv) {
                if (!inv.select) {
                    rtArry.push(inv);
                } else {
                    invdltArray.push(ReturnStructure.getUpdatedNodeDetails(tableCode, inv, formName));
                }
            });
            if (invdltArray.length > 0) {
                R1InvHandler.errorDelete($scope, rtArry, invdltArray).then(function (response) {
                    $scope.ErrorList = angular.copy(response);
                    $scope.selectAll = false;
                });
            } else {
                $scope.createAlert("WarningOk", "Do select at least one item.", function () { });
            }
        }

        $scope.deleteSelectedRowsNew = function () {
            var rtArry = [],
                invdltArray = [],
                finalArry = [{}];



            angular.forEach($scope.ErrorList, function (inv) {
                angular.forEach(inv.data, function (data) {
                    if (!data.select) {
                        rtArry.push(data);
                        finalArry.push({ "error_msg": inv["error_msg"], "data": [data] })
                    }
                    else {
                        invdltArray.push(data);
                    }
                });
                if(inv.hsn_b2b != null || inv.hsn_b2b != undefined){
                    angular.forEach(inv.hsn_b2b, function (data) {
                        if (!data.select) {
                            rtArry.push(data);
                            finalArry.push({ "error_msg": inv["error_msg"], "hsn_b2b": [data] })
                        }
                        else {
                            invdltArray.push(data);
                        }
                    });
                }
                if(inv.hsn_b2c != null || inv.hsn_b2c != undefined){
                    angular.forEach(inv.hsn_b2c, function (data) {
                        if (!data.select) {
                            rtArry.push(data);
                            finalArry.push({ "error_msg": inv["error_msg"], "hsn_b2c": [data] })
                        }
                        else {
                            invdltArray.push(data);
                        }
                    });
                }
            });

            if (invdltArray.length > 0) {
                R1InvHandler.errorDelete($scope, rtArry, invdltArray).then(function (response) {
                    $scope.ErrorList = angular.copy(finalArry);
                    $scope.selectAll = false;
                });
            } else {
                $scope.createAlert("WarningOk", "Do select at least one item.", function () { });
            }
        }

        //To enable prev dates in case of cdnr pregst
        $scope.minInvDatePGst = function (inv) {
            var minDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "01" + shareData.dashBoardDt.fp.slice(0, 2) + shareData.dashBoardDt.fp.slice(2);
                //firstDate = moment(temp1, dateFormat),
                // firstDate1 = firstDate.format(dateFormat);
                minDate = moment(temp1, "DD/MM/YYYY").add(1, 'days').subtract(18, 'months').format("DD/MM/YYYY");

            }
            else {
                minDate = $scope.minDate();
            }
            return minDate;
        }

        //To disable after jun30 dates in case of cdnr pregst
        $scope.maxInvDatePGst = function (inv) {
            var maxDate;
            if (inv.p_gst == 'Y') {
                var temp1 = "30062017",
                    lastDate = moment(temp1, dateFormat),
                    lastDate1 = lastDate.format(dateFormat);
                maxDate = lastDate1;

            }
            else {
                maxDate = $scope.datefunc();
            }
            return maxDate;
        };



        $scope.onPgstchange = function (obj) {
            if (obj.p_gst == 'Y')
                delete obj.dt;
            else
                obj.dt = $scope.minDate();

        };

        $scope.isPreGST = function (isNew, inv, frm) {
            var frmName = (isNew) ? $scope.newInvFrm : frm;
            var maxDt = $scope.maxInvDatePGst(inv),
                minDt = $scope.minInvDatePGst(inv),
                dtflag = true,
                invdt = inv.idt;

            if (moment(invdt, dateFormat).isValid()) {
                if (moment(invdt, dateFormat).isAfter(moment(maxDt, dateFormat))) {
                    dtflag = false;
                    if (isNew) {
                        if (inv.p_gst == 'Y')
                            $scope.invdtmsg = "Date is invalid ";
                        else
                            $scope.invdtmsg = "Date is Invalid. Date of invoice cannot exceed the current tax period";
                    }

                }
                else if (moment(invdt, dateFormat).isBefore(moment(minDt, dateFormat))) {
                    dtflag = false;
                    if (isNew)
                        $scope.invdtmsg = "Date is Invalid. Date of invoice cannot be before the date of registration";
                }

            } else {
                dtflag = false;
                if (isNew)
                    $scope.invdtmsg = "Date does not exists in the calendar";
                // return true;
            }
            frmName.idt.$setValidity('idt', dtflag);
        }


        //checking of supplytype in order to disable the tax values respectively
        $scope.isIntraState = function (isNew, iInv) {
            var oData, invData;
            if (iInv) {
                oData = getUniqueInvoice(iInv, iInv, 1);
                invData = oData.data;
                //pgIndex = getUniqueInvoice(iInv, iInv, 1).index;
            }

            if (isNew) {
                return ($scope.newInvRw.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            } else if (invData) {
                return (invData && invData.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }

        //To disable itc if not eligible(GSTR2)
        $scope.isEligible = function (iElg) {
            return (!iElg || iElg == "none") ? true : false;
        }

        //To clear values if eligiblity changed as none
        $scope.elgBltyChange = function (iItm) {
            var elg = iItm.itc.elg;

            if (elg == "none" && iItm.sp_typ.name == "Intra-State") {
                iItm.itc.tx_c = 0.00;
                iItm.itc.tx_s = 0.00;
                iItm.itc.tx_cs = 0.00;
                iItm.itc.tc_c = 0.00;
                iItm.itc.tc_s = 0.00;
                iItm.itc.tc_cs = 0.00;
            } else if (elg == "none" && iItm.sp_typ.name == "Inter-State") {
                iItm.itc.tx_i = 0.00;
                iItm.itc.tx_cs = 0.00;
                iItm.itc.tc_i = 0.00;
                iItm.itc.tc_cs = 0.00;
            }
        }

        //To disable pos if type in cdnur expwpay n wopay
        $scope.isTypeExp = function (inv) {
            if (inv && (inv.typ == 'EXPWP' || inv.typ == 'EXPWOP')) {
                if (inv.pos)
                    inv.pos = null;
                if (inv.diff_percent)
                    inv.diff_percent = null;
                return true;
            }
            else
                return false;
        }

    }
]);

myApp.controller("erritmctrl", ['$scope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', 'ReturnStructure',
    function ($scope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler, ReturnStructure) {
        $scope.newItmValidtr = false;
        $scope.selectAll = null;
        var tblcd = null,
            formName = null;


        $scope.isIntraState = function () {
            if ($scope.itmList && $scope.itmList.sp_typ) {
                return ($scope.itmList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }

        $scope.rateWiseData = [];

        //TO disable igst n cess in case of EXPWOP
        $scope.isWithOutPaymnt = function () {
            if ($scope.itmList) {
                //&& ($scope.itmList.exp_typ || $scope.itmList.typ  ) ) {
                if ($scope.itmList.exp_typ && $scope.itmList.exp_typ === 'WOPAY')
                    return true;
                else if ($scope.itmList.typ && $scope.itmList.typ == 'EXPWOP')
                    return true;
            }
            return false;

        }

        $scope.tblcdchk = function () {
            $scope.ecomflg = "invval";
            if(shareData.dashBoardDt.tbl_cd == 'ecomb2b' || shareData.dashBoardDt.tbl_cd  == 'ecomurp2b' || shareData.dashBoardDt.tbl_cd  == 'ecomaurp2b' || shareData.dashBoardDt.tbl_cd  == 'ecomab2b' || shareData.dashBoardDt.tbl_cd == 'ecomab2c' || shareData.dashBoardDt.tbl_cd == 'ecomaurp2c'){
                $scope.ecomflg = "val";
            }else{
                $scope.ecomflg = "invval";  
            }
        }

        //Clear already existing values for with pay if he changed to wopay in exp
        $scope.clearValues = function () {
            if (shareData.itmInv.exp_typ == "WOPAY") {
                angular.forEach($scope.rateWiseData, function (obj, key) {
                    if (obj.iamt || obj.csamt) {
                        obj.iamt = 0;
                        obj.csamt = 0;
                    }
                });
            }
        }

        //ITC validations for GSTR2
        $scope.checkamountwithitc = function (items) {
            //$scope.newItmFrm.$setValidity('amountlessthanitc', true);
            $scope.itcinvalid = false;

            items.filter(function (item) {
                var item1 = item.itc ? item.itc : item;
                if (!parseFloat(item.iamt) && parseFloat(item1.tx_i)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.iamt) < parseFloat(item1.tx_i)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                if (!parseFloat(item.camt) && parseFloat(item1.tx_c)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.camt) < parseFloat(item1.tx_c)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                if (!parseFloat(item.samt) && parseFloat(item1.tx_s)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.samt) < parseFloat(item1.tx_s)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                if (!parseFloat(item.csamt) && parseFloat(item1.tx_cs)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }
                else if (parseFloat(item.csamt) < parseFloat(item1.tx_cs)) {
                    //$scope.newItmFrm.$setValidity('amountlessthanitc', false);
                    $scope.itcinvalid = true;
                }

            });
        }

        $scope.parsefloat = function (val) {
            if (val == '' || !val)
                return 0;
            return parseFloat(val);
        }

        $scope.getEligibilityForITC = function () {
            if ($scope.dashBoardDt.gstin.slice(0, 2) == $scope.itmList.pos) {
                return true;
            } else {
                return false;
            }
        }


        $scope.initelg = function (iItm) {
            var elg;
            if (iItm.itc) {
                elg = iItm.itc.elg;
            } else {
                elg = iItm.elg;
            }
            if (iItm.txval > 0) {
                if (!elg) {
                    elg = $scope.getEligibilityForITC() ? "" : 'no';
                }
            }
            if (iItm.itc) {
                iItm.itc.elg = elg;
            }
            else {
                iItm.elg = elg;
            }
        }

        function initializeData(iTblCode) {
            switch (iTblCode) {
                case 'b2b':
                case 'b2ba':
                case 'b2cl':
                case 'b2cla':
                case 'cdnr':
                case 'cdnur':
                case 'cdnra':
                case 'cdnura':
                case 'b2bur':
                case 'b2csa':
                case 'ecomb2b':
                case 'ecomurp2b':
                case "ecomab2b":
                case "ecomab2c":
                case "ecomaurp2b":
                case "ecomaurp2c":
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                var iIndex = key; // directly use array index
                
                    if (!$scope.rateWiseData[iIndex]) {
                        if ($scope.intraState) {
                            if (formName === "GSTR2") {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_c": 0,
                                        "tx_s": 0,
                                        "tx_cs": 0
                                    }
                                };
                            } else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        } else {
                            if (formName === "GSTR2") {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0,
                                    "itc": {
                                        "tx_i": 0,
                                        "tx_cs": 0
                                    }
                                };
                            } else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "txval": 0
                                };
                            }
                        }
                    }
                });
                    break;
                case 'exp':
                case 'expa':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                       var iIndex = key; // directly use array index
                        
                        if (!$scope.rateWiseData[iIndex]) {
                            $scope.rateWiseData[iIndex] = {
                                "rt": val.value,
                                "iamt": 0,
                                "csamt": 0,
                                "txval": 0
                            };

                        }
                    });
                    break;
                case 'imp_g':
                case 'imp_s':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex;
                        iIndex = val.value;
                        switch (val.value) {
                            case 0.1:
                                iIndex = 1;
                                break;
                            case 0.25:
                                iIndex = 2;
                                break;
                            case 1:
                                iIndex = 3;
                                break;
                            case 1.5:
                                iIndex = 4;
                                break;
                            case 3:
                                iIndex = 5;
                                break;
                            case 5:
                                iIndex = 6;
                                break;
                            case 6:
                                iIndex = 7;
                                break;
                            case 7.5:
                                iIndex = 8;
                                break;
                        }
                        if (!$scope.rateWiseData[iIndex]) {
                            $scope.rateWiseData[iIndex] = {
                                "rt": val.value,
                                "iamt": 0,
                                "csamt": 0,
                                "txval": 0,
                                "tx_i": 0,
                                "tx_cs": 0
                            };

                        }
                    });
                    break;
                case 'at':
                case 'ata':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex;
                        iIndex = val.value;
                        switch (val.value) {
                            case 0.1:
                                iIndex = 1;
                                break;
                            case 0.25:
                                iIndex = 2;
                                break;
                            case 1:
                                iIndex = 3;
                                break;
                            case 1.5:
                                iIndex = 4;
                                break;
                            case 3:
                                iIndex = 5;
                                break;
                            case 5:
                                iIndex = 6;
                                break;
                            case 6:
                                iIndex = 7;
                                break;
                            case 7.5:
                                iIndex = 8;
                                break;
                        }

                        if (!$scope.rateWiseData[iIndex]) {
                            if ($scope.intraState) {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "ad_amt": 0
                                };
                            }
                            else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "ad_amt": 0
                                };
                            }
                        }
                    });
                case 'txi':
                    angular.forEach($scope.RateList.CommGST, function (val, key) {
                        var iIndex;
                        iIndex = val.value;
                        switch (val.value) {
                            case 0.1:
                                iIndex = 1;
                                break;
                            case 0.25:
                                iIndex = 2;
                                break;
                            case 1:
                                iIndex = 3;
                                break;
                            case 1.5:
                                iIndex = 4;
                                break;
                            case 3:
                                iIndex = 5;
                                break;
                            case 5:
                                iIndex = 6;
                                break;
                            case 6:
                                iIndex = 7;
                                break;
                            case 7.5:
                                iIndex = 8;
                                break;
                        }

                        if (!$scope.rateWiseData[iIndex]) {
                            if ($scope.intraState) {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "camt": 0,
                                    "samt": 0,
                                    "csamt": 0,
                                    "adamt": 0
                                };
                            }
                            else {
                                $scope.rateWiseData[iIndex] = {
                                    "rt": val.value,
                                    "iamt": 0,
                                    "csamt": 0,
                                    "adamt": 0
                                };
                            }
                        }
                    });
                    break;
                case 'atadj':
                case 'atadja':
                    if (formName == 'GSTR1') {
                        angular.forEach($scope.RateList.CommGST, function (val, key) {
                            var iIndex;
                            iIndex = val.value;
                            switch (val.value) {
                                case 0.1:
                                    iIndex = 1;
                                    break;
                                case 0.25:
                                    iIndex = 2;
                                    break;
                                case 1:
                                    iIndex = 3;
                                    break;
                                case 1.5:
                                    iIndex = 4;
                                    break;
                                case 3:
                                    iIndex = 5;
                                    break;
                                case 5:
                                    iIndex = 6;
                                    break;
                                case 6:
                                    iIndex = 7;
                                    break;
                                case 7.5:
                                    iIndex = 8;
                                    break;
                            }
                            if (!$scope.rateWiseData[iIndex]) {
                                if ($scope.intraState) {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "camt": 0,
                                        "samt": 0,
                                        "csamt": 0,
                                        "ad_amt": 0
                                    };
                                }
                                else {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "iamt": 0,
                                        "csamt": 0,
                                        "ad_amt": 0
                                    };
                                }
                            }
                        });
                    }
                    else if (formName == 'GSTR2') {
                        angular.forEach($scope.RateList.CommGST, function (val, key) {
                            var iIndex;
                            iIndex = val.value;
                            switch (val.value) {
                                case 0.1:
                                    iIndex = 1;
                                    break;
                                case 0.25:
                                    iIndex = 2;
                                    break;
                                case 1:
                                    iIndex = 3;
                                    break;
                                case 1.5:
                                    iIndex = 4;
                                    break;
                                case 3:
                                    iIndex = 5;
                                    break;
                                case 5:
                                    iIndex = 6;
                                    break;
                                case 6:
                                    iIndex = 7;
                                    break;
                                case 7.5:
                                    iIndex = 8;
                                    break;
                            }

                            if (!$scope.rateWiseData[iIndex]) {
                                if ($scope.intraState) {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "camt": 0,
                                        "samt": 0,
                                        "csamt": 0,
                                        "adamt": 0
                                    };
                                }
                                else {
                                    $scope.rateWiseData[iIndex] = {
                                        "rt": val.value,
                                        "iamt": 0,
                                        "csamt": 0,
                                        "adamt": 0
                                    };
                                }
                            }
                        });
                    }

                    break;


            }
        }

        function getAlreadyExistingData(iTblCode) {
            switch (iTblCode) {
                case 'b2b':
                case 'b2ba':
                case 'ecomb2b':
                case 'ecomurp2b':
                case "ecomab2b":
                case "ecomaurp2b":
                    if (formName == 'GSTR2') {
                        if ($scope.itmList.inv_typ == 'SEWP') {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                //$scope.rateWiseData[index] = val.itm_det;
                                $scope.rateWiseData[index].itc = val.itc;
                                if (val.itm_det.iamt == 0 || val.itm_det.camt == 0 || val.itm_det.samt == 0)
                                    $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);

                            });
                        }
                        else {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                //$scope.rateWiseData[index] = val.itm_det;
                                $scope.rateWiseData[index].itc = val.itc;

                            });
                        }
                    } else {
                        if ($scope.itmList.inv_typ == 'SEWP') {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                val.itm_det.diff_percent = $scope.itmList.diff_percent;
                                //$scope.rateWiseData[index] = val.itm_det;
                                // if (val.itm_det.iamt == 0 || val.itm_det.camt == 0 || val.itm_det.samt == 0)
                                //     $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);

                            });
                        }
                        else {
                            angular.forEach($scope.itmList.itms, function (val, key) {
                                var index = val.itm_det.rt;
                                switch (index) {
                                    case 0.1:
                                        index = 1;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 0.25:
                                        index = 2;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1:
                                        index = 3;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 1.5:
                                        index = 4;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 3:
                                        index = 5;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 5:
                                        index = 6;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 6:
                                        index = 7;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    case 7.5:
                                        index = 8;
                                        $scope.rateWiseData[index] = val.itm_det;
                                        break;
                                    default:
                                        $scope.rateWiseData[index] = val.itm_det;

                                }
                                val.itm_det.diff_percent = $scope.itmList.diff_percent;
                                // $scope.rateWiseData[index] = val.itm_det;
                                //  $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                            });
                        }
                    }
                    break;
                case 'b2cl':
                case 'b2bur':
                case 'cdnr':
                case 'cdnur':
                case 'b2cla':
                case 'cdnra':
                case 'cdnura':
                    if (formName == 'GSTR2') {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            //$scope.rateWiseData[index] = val.itm_det;
                            $scope.rateWiseData[index].itc = val.itc;

                        });
                    } else {
                        angular.forEach($scope.itmList.itms, function (val, key) {
                            var index = val.itm_det.rt;
                            switch (index) {
                                case 0.1:
                                    index = 1;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 0.25:
                                    index = 2;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1:
                                    index = 3;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 1.5:
                                    index = 4;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 3:
                                    index = 5;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 5:
                                    index = 6;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 6:
                                    index = 7;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                case 7.5:
                                    index = 8;
                                    $scope.rateWiseData[index] = val.itm_det;
                                    break;
                                default:
                                    $scope.rateWiseData[index] = val.itm_det;

                            }
                            //$scope.rateWiseData[index] = val.itm_det;
                            //  $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                        });
                    }
                    break;
                case 'exp':
                case 'at':
                case 'atadj':
                case 'expa':
                case 'ata':
                case 'b2csa':
                case 'atadja':
                case 'txi':
                case 'ecomab2c':
                case 'ecomaurp2c':
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        var index = val.rt;
                        switch (index) {
                            case 0.1:
                                index = 1;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 0.25:
                                index = 2;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1:
                                index = 3;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1.5:
                                index = 4;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 3:
                                index = 5;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 5:
                                index = 6;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 6:
                                index = 7;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 7.5:
                                index = 8;
                                $scope.rateWiseData[index] = val;
                                break;
                            default:
                                $scope.rateWiseData[index] = val;

                        }
                        //$scope.rateWiseData[index] = val;
                        //  $scope.onRtChange($scope.rateWiseData[index], $scope.intraState ? 4 : 3);
                    });
                    break;
                case 'imp_g':
                case 'imp_s':
                    angular.forEach($scope.itmList.itms, function (val, key) {
                        var index = val.rt;
                        switch (index) {
                            case 0.1:
                                index = 1;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 0.25:
                                index = 2;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1:
                                index = 3;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 1.5:
                                index = 4;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 3:
                                index = 5;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 5:
                                index = 6;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 6:
                                index = 7;
                                $scope.rateWiseData[index] = val;
                                break;
                            case 7.5:
                                index = 8;
                                $scope.rateWiseData[index] = val;
                                break;
                            default:
                                $scope.rateWiseData[index] = val;

                        }
                        //$scope.rateWiseData[index] = val;
                        //                    $scope.rateWiseData[index].itc = val.itc;

                    });
                    break;

            }

        }

        function defaultItemInit(iTblcode) {
            var itmObj = {};
            switch (iTblcode) {
                case 'b2ba':
                case 'b2cla':
                case 'cdnra':
                case 'cdnura':
                    itmObj.num = 1;
                    itmObj.itm_det = $scope.rateWiseData[0];
                    break;
                case 'b2csa':
                case 'expa':
                case 'ata':
                case 'atadja':
                    itmObj.itm_det = $scope.rateWiseData[0];
                    break;

            }
            return itmObj;
        }

        //check if GSTR info available
        if (!shareData.dashBoardDt && !shareData.itmInv) {
            $scope.page("/gstr/error/summary");
            return false;
        }
        else {

            $scope.dashBoardDt = shareData.dashBoardDt;
            formName = shareData.dashBoardDt.form;
            tblcd = $scope.dashBoardDt.tbl_cd;
            $scope.itmList = shareData.itmInv;
            if (tblcd == 'at' || tblcd == 'atadj' || tblcd == 'txi' || tblcd == 'atadja' || tblcd == 'ata' || tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') {
                $scope.intraState = false;
                if ($scope.itmList.sply_ty === 'INTRA') {
                    $scope.intraState = true;
                }
            }
            else {
                $scope.intraState = $scope.isIntraState();
            }
            $scope.itemsLength = $scope.itmList.itms.length;

            if ($scope.itemsLength > 0) {
                getAlreadyExistingData(tblcd);
                initializeData(tblcd);
            } else {
                initializeData(tblcd);
            }

            var data = $scope.rateWiseData;

            data = data.filter(function (element) {
                return element !== undefined;
            });
            $scope.rateWiseData = data;

        }

        initItm();

        function initItm() {
            $scope.nwItm = ReturnStructure.getNewItm(tblcd, form);
        }


        $scope.isNewRec = shareData.isNewRec;

        $scope.invNum = ReturnStructure.getInvNum(tblcd, $scope.itmList, form);



        $scope.isImpg = function () {
            return (tblcd === "imp_g" || tblcd === "imp_ga") ? true : false;
        }

        //Formaters

        var formateNodePayload = ReturnStructure.formateNodePayload(tblcd, form, true);



        $scope.isIntraState = function () {
            if ($scope.itmList && $scope.itmList.sp_typ) {
                return ($scope.itmList.sp_typ.name === $scope.trans.TITLE_INTRA_STATE) ? true : false;
            }
        }



        $scope.spTypChange = function (isNew, iInv) {
            if (isNew) {
                if ($scope.nwItm.sp_typ.name == "Intra-State") {
                    $scope.nwItm.irt = 0;
                    $scope.nwItm.iamt = 0;
                } else {
                    $scope.nwItm.crt = 0;
                    $scope.nwItm.camt = 0;
                    $scope.nwItm.srt = 0;
                    $scope.nwItm.samt = 0;
                }
            } else {
                if (iInv.sp_typ.name == "Intra-State") {
                    $scope.nwItm.irt = 0;
                    $scope.nwItm.iamt = 0;
                } else {
                    $scope.nwItm.crt = 0;
                    $scope.nwItm.camt = 0;
                    $scope.nwItm.srt = 0;
                    $scope.nwItm.samt = 0;
                }
            }
        }

        $scope.isNoActionTaken = function () {
            return ($scope.itmList.flag && $scope.itmList.flag == 'N') ? true : false;
        }

        //To disable tax avialable as itc and itc this month if not eligible

        $scope.isEligible = function (iElg) {
            return (!iElg || iElg == "none") ? true : false;
        }

        //To clear values if eligiblity changed as none
        $scope.elgBltyChange = function (iItm) {
            var elg, iItc;
            if (iItm.itm_det) {
                elg = iItm.itm_det.elg;
            } else {
                elg = iItm.elg;
            }


            if (iItm.itc) {
                iItc = iItm.itc;
            } else {
                iItc = iItm;
            }
            if (elg == "no" && $scope.isIntraState()) {
                iItc.tx_c = 0.00;
                iItc.tx_s = 0.00;
                iItc.tx_cs = 0.00;
            } else if (elg == "no" && !$scope.isIntraState()) {
                iItc.tx_i = 0.00;
                iItc.tx_cs = 0.00;
                iItc.tc_i = 0.00;
                iItc.tc_cs = 0.00;
            }
        }

        //to check itc values less than igst n sgst n cgst
        $scope.validity = function (isNew, iItm, frm) {
            var flag = false,
                fldname, curItm;
            var frmName = (isNew) ? $scope.newItmFrm : frm;
            if (iItm.itm_det) {
                curItm = iItm.itm_det;
            } else {
                curItm = iItm;
            }
            if (iItm) {
                fldname = ['tx_i', 'tc_i', 'tx_c', 'tc_c', 'tx_s', 'tc_s', 'tx_cs', 'tc_cs'];
                for (var i = 0; i < fldname.length; i++) {
                    if (frmName[fldname[i]] != undefined) {
                        frmName[fldname[i]].$setValidity('pattern', true);
                    }
                }
                var iItc;
                if (iItm.itc) {
                    iItc = iItm.itc;
                } else {
                    iItc = iItm;
                }

                if (parseFloat(iItc.tx_i) > parseFloat(curItm.iamt)) {
                    frmName.tx_i.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_i) > parseFloat(iItc.tx_i)) {
                    frmName.tc_i.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tx_c) > parseFloat(curItm.camt)) {
                    frmName.tx_c.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_c) > parseFloat(iItc.tx_c)) {
                    frmName.tc_c.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tx_s) > parseFloat(curItm.samt)) {
                    frmName.tx_s.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_s) > parseFloat(iItc.tx_s)) {
                    frmName.tc_s.$setValidity('pattern', false);
                    flag = true;
                }

                if (parseFloat(iItc.tx_cs) > parseFloat(curItm.csamt)) {
                    frmName.tx_cs.$setValidity('pattern', false);
                    flag = true;
                }
                if (parseFloat(iItc.tc_cs) > parseFloat(iItc.tx_cs)) {
                    frmName.tc_cs.$setValidity('pattern', false);
                    flag = true;
                }
            }
            return flag;
        }

        //Add Item - softadd
        $scope.addItem = function (iForm) {
            if (!iForm) {
                iForm = $scope.newItmFrm;
            }
            if (iForm.$valid) {
                var itmLs = (tblcd == "atadj") ? $scope.itmList.doc : $scope.itmList.itms,
                    itmLn = itmLs.length,
                    newItm = ReturnStructure.getItmNodeStructure(tblcd, $scope.nwItm, itmLn, form);

                if (tblcd == 'atadj' && form == "GSTR2") {
                    $scope.itmList.doc.push(newItm);
                } else {
                    $scope.itmList.itms.push(newItm);
                }

                $scope.newItmValidtr = false;
                initItm();

            } else {
                $scope.newItmValidtr = true;
            }
        }

        $scope.goToBackPage = function (tblcd) {
            $scope.page("/gstr/error/" + tblcd);
        }

        $scope.updateSavePayload = function (isNew) {
            
            var totalTaxValue = 0,
                tempObj = {},
                tempArr = [];
            let varIsValidItms = true;
            let iamtHasValue = false;
            if (tblcd == 'b2b' || tblcd == 'b2ba' || tblcd == 'b2cl' || tblcd == 'b2cla' || tblcd == 'b2bur' || tblcd == 'ecomb2b' || tblcd == 'ecomurp2b' || tblcd == 'ecomab2b' || tblcd == 'ecomaurp2b') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    tempObj = {};
                    if (parseFloat(obj.txval) > 0 && obj.txval) {
                        if (!$scope.intraState) {
                            tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                            tempObj.itm_det = {
                                "txval": parseFloat(obj.txval),
                                "rt": parseFloat(obj.rt),
                                "iamt": parseFloat(obj.iamt),
                                "csamt": parseFloat(obj.csamt)
                            };
                            if (obj.itc) {
                                tempObj.itc = {
                                    "elg": obj.itc.elg,
                                    "tx_i": parseFloat(obj.itc.tx_i),
                                    "tx_cs": parseFloat(obj.itc.tx_cs)
                                }
                            }

                            totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.iamt + (isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt);
                        } else {
                            if((tblcd == 'ecomb2b' || tblcd == 'ecomurp2b' || tblcd == 'ecomab2b' || tblcd == 'ecomaurp2b') && obj.camt != obj.samt){
                                $scope.txrate = true;
                            }
                            tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                            tempObj.itm_det = {
                                "txval": parseFloat(obj.txval),
                                "rt": parseFloat(obj.rt),
                                "camt": parseFloat(obj.camt),
                                "samt": parseFloat(obj.samt),
                                "csamt": parseFloat(obj.csamt)
                            };
                            if (obj.itc) {
                                tempObj.itc = {
                                    "elg": obj.itc.elg,
                                    "tx_c": parseFloat(obj.itc.tx_c),
                                    "tx_s": parseFloat(obj.itc.tx_s),
                                    "tx_cs": parseFloat(obj.itc.tx_cs)
                                }
                            }
                            totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.camt + tempObj.itm_det.samt + (isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt);
                        }

                        tempArr.push(tempObj);

                        //condition for IGST > 0
                        if ($scope.itmList.inv_typ == "SEWP" && parseFloat(obj.iamt) > 0) {
                            iamtHasValue = true;
                        }

                    }
                });
                if($scope.txrate == true){
                    $scope.createAlert("Error", "Please enter same amount for CGST and SGST", function(){});
                    $scope.txrate = false;
                    return;
                }
            }
            else if (tblcd == 'exp' || tblcd == 'expa') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (parseFloat(obj.txval) > 0 && obj.txval) {
                        tempObj = {
                            "txval": parseFloat(obj.txval),
                            "rt": parseFloat(obj.rt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)
                        };
                        totalTaxValue += tempObj.txval + tempObj.iamt + tempObj.csamt;
                        tempArr.push(tempObj);
                        if ($scope.itmList.exp_typ == "WPAY" && parseFloat(obj.iamt) > 0) {
                            iamtHasValue = true;
                        }
                    }
                });
            } else if (tblcd == 'b2csa' || tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt && (Math.abs(obj.txval) > 0 || Math.abs(obj.csamt) > 0)) {

                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "txval": parseFloat(obj.txval),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempArr.push(tempObj);
                    }
                    else if (obj.camt && (Math.abs(obj.txval) > 0 || Math.abs(obj.csamt) > 0)) {
                        if((tblcd == 'ecomab2c' || tblcd == 'ecomaurp2c') && obj.camt != obj.samt){
                            $scope.txrate = true;
                        }
                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "txval": parseFloat(obj.txval),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempArr.push(tempObj);
                    }

                });
            } else if (tblcd == 'at' || tblcd == 'ata') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt) {

                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "ad_amt": parseFloat(obj.ad_amt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        if (tempObj.ad_amt || tempObj.iamt || tempObj.csamt)
                            tempArr.push(tempObj);
                    }
                    else if (obj.camt) {
                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "ad_amt": parseFloat(obj.ad_amt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        if (tempObj.ad_amt || (tempObj.camt && tempObj.samt) || tempObj.csamt)
                            tempArr.push(tempObj);
                    }

                });
                varIsValidItms = $scope.fnCheckValidItm(tempArr);
            }
            else if (tblcd == 'txi') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (!obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {

                        tempObj = {
                            "rt": parseFloat(obj.rt),
                            "adamt": parseFloat(obj.adamt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempObj.num = tempArr.length + 1;
                        tempArr.push(tempObj);
                    }
                    else if (obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                        tempObj = {

                            "rt": parseFloat(obj.rt),
                            "adamt": parseFloat(obj.adamt),
                            "camt": parseFloat(obj.camt),
                            "samt": parseFloat(obj.samt),
                            "csamt": parseFloat(obj.csamt)

                        };
                        tempObj.num = tempArr.length + 1;
                        tempArr.push(tempObj);
                    }

                });
            }
            else if (tblcd == 'atadj' || tblcd == 'atadja') {
                if (formName == 'GSTR1') {
                    $scope.rateWiseData.forEach(function (obj, key) {
                        if (!obj.camt && parseFloat(obj.ad_amt) > 0) {

                            tempObj = {
                                "rt": parseFloat(obj.rt),
                                "ad_amt": parseFloat(obj.ad_amt),
                                "iamt": parseFloat(obj.iamt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempArr.push(tempObj);
                        }
                        else if (obj.camt && parseFloat(obj.ad_amt) > 0) {
                            tempObj = {
                                "rt": parseFloat(obj.rt),
                                "ad_amt": parseFloat(obj.ad_amt),
                                "camt": parseFloat(obj.camt),
                                "samt": parseFloat(obj.samt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempArr.push(tempObj);
                        }

                    });
                }
                else {
                    $scope.rateWiseData.forEach(function (obj, key) {
                        if (!obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                            tempObj = {
                                "rt": parseFloat(obj.rt),
                                "adamt": parseFloat(obj.adamt),
                                "iamt": parseFloat(obj.iamt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempObj.num = tempArr.length + 1;
                            tempArr.push(tempObj);
                        }
                        else if (obj.camt && (parseFloat(obj.adamt) > 0 || parseFloat(obj.csamt) > 0)) {
                            tempObj = {

                                "rt": parseFloat(obj.rt),
                                "adamt": parseFloat(obj.adamt),
                                "camt": parseFloat(obj.camt),
                                "samt": parseFloat(obj.samt),
                                "csamt": parseFloat(obj.csamt)

                            };
                            tempObj.num = tempArr.length + 1;
                            tempArr.push(tempObj);
                        }

                    });
                }

            }
            else if (tblcd == 'imp_g' || tblcd == 'imp_s') {
                $scope.rateWiseData.forEach(function (obj, key) {
                    if (parseFloat(obj.txval) > 0 && obj.txval) {
                        tempObj.num = tempArr.length + 1;
                        tempObj = {
                            "txval": parseFloat(obj.txval),
                            "rt": parseFloat(obj.rt),
                            "iamt": parseFloat(obj.iamt),
                            "csamt": parseFloat(obj.csamt),
                            "elg": obj.elg,
                            "tx_i": parseFloat(obj.tx_i),
                            "tx_cs": parseFloat(obj.tx_cs)

                        };
                        totalTaxValue += tempObj.txval + tempObj.iamt + tempObj.csamt;
                        tempArr.push(tempObj);
                    }
                });
            }
            else if (tblcd == "cdnr" || tblcd == "cdnra" || tblcd == "cdnur" || tblcd == "cdnura") {
                $scope.rateWiseData.forEach(function (obj, key) {
                    tempObj = {};
                    tempObj.itm_det = {
                        "txval": parseFloat(obj.txval),
                        "rt": parseFloat(obj.rt),
                        "csamt": parseFloat(obj.csamt)
                    };

                    if (!$scope.intraState) {
                        tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                        tempObj.itm_det.iamt = parseFloat(obj.iamt);
                        if (obj.itc) {
                            tempObj.itc = {
                                "elg": obj.itc.elg,
                                "tx_i": parseFloat(obj.itc.tx_i),
                                "tx_cs": parseFloat(obj.itc.tx_cs)
                            }
                        }

                        totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.iamt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                    } else {
                        tempObj.num = (obj.rt) * 100 + 1; // tempArr.length + 1;
                        tempObj.itm_det.camt = parseFloat(obj.camt);
                        tempObj.itm_det.samt = parseFloat(obj.samt);
                        if (obj.itc) {
                            tempObj.itc = {
                                "elg": obj.itc.elg,
                                "tx_c": parseFloat(obj.itc.tx_c),
                                "tx_s": parseFloat(obj.itc.tx_s),
                                "tx_cs": parseFloat(obj.itc.tx_cs)
                            }
                        }
                        totalTaxValue += tempObj.itm_det.txval + tempObj.itm_det.camt + tempObj.itm_det.samt + ((isNaN(tempObj.itm_det.csamt)) ? 0 : parseFloat(tempObj.itm_det.csamt));
                    }
                    if (tempObj.itm_det.txval || tempObj.itm_det.iamt || (tempObj.itm_det.camt && tempObj.itm_det.samt))
                        tempArr.push(tempObj);
                    if (($scope.itmList.inv_typ == "SEWP" || $scope.itmList.typ == "EXPWP") && parseFloat(obj.iamt) > 0) {
                        iamtHasValue = true;
                    }
                });
            }
            var dF = $scope.itmList.diff_percent;
            if (dF != null && typeof dF != 'undefined' && typeof dF.value != 'undefined') {
                $scope.itmList.diff_percent = dF.value;
            }
            // var sR = $scope.itmList.supplierRecipientName;
            // if (sR != null && typeof sR != 'undefined' && typeof sR.value != 'undefined') {
            //     $scope.itmList.supplierRecipientName = sR.value;
            // }

            $scope.itmList.itms = tempArr;
            if (tblcd.endsWith('a') && tempArr.length == 0 && tblcd != "cdnura" && tblcd != "cdnra" && tblcd != "ata" && !(tblcd == "expa" && $scope.itmList.exp_typ == "WPAY") && !(tblcd == "b2ba" && $scope.itmList.inv_typ == "SEWP")) {
                var dfltItmObj = defaultItemInit(tblcd);
                $scope.itmList.itms.push(dfltItmObj);
            }
            if (varIsValidItms) {
                if ($scope.itmList.itms.length > 0 && !iamtHasValue && ($scope.itmList.inv_typ == "SEWP" || $scope.itmList.exp_typ == "WPAY" || $scope.itmList.typ == "EXPWP")) {
                    $scope.createAlert("ErrorCallback", "Please enter some value in IGST tax amount field", function () {

                        if ($scope.initSumryList)
                            $scope.initSumryList();
                    });
                }
                else {
                    if (isNew === "N") {
                        $scope.updatePayload();
                    } else {

                        $scope.savePayload();
                    }
                }
            } else {
                $scope.createAlert("ErrorCallback", "Item details provided are invalid. Please add correct item details and try again.", function () {

                    if ($scope.initSumryList)
                        $scope.initSumryList();
                });
            }
        };

        //To Update Invoice
        $scope.updatePayload = function () {
            var stdata = angular.copy($scope.itmList);

            var updatedNodeDetails = ReturnStructure.getUpdatedNodeDetails(tblcd, stdata, form);

            R1InvHandler.updateErrorPayload($scope, stdata, updatedNodeDetails, formateNodePayload);


        }

        //Added check for negative item value as part of CR17052
        $scope.fnCheckValidItm = function (itmArray) {
            let validFlag = true;
            let validForZero = true;
            let validGrtr = true;
            let validLssThn = true;
            itmArray.forEach(function (obj, key) {
                if (obj.ad_amt == 0) {
                    if (obj.csamt >= 0 && (obj.iamt > 0 || (obj.samt > 0 && obj.camt > 0)))
                        validForZero = true;
                    else if (obj.csamt <= 0 && (obj.iamt < 0 || (obj.samt < 0 && obj.camt < 0)))
                        validForZero = true;
                    else
                        validForZero = false;
                } else if (obj.ad_amt < 0) {
                    if (obj.iamt > 0 || obj.camt > 0 || obj.samt > 0 || obj.csamt > 0)
                        validLssThn = false;
                    else
                        validLssThn = true;
                } else if (obj.ad_amt > 0) {
                    if (obj.iamt < 0 || obj.camt < 0 || obj.samt < 0 || obj.csamt < 0)
                        validGrtr = false;
                    else
                        validGrtr = true;
                } else {
                    validForZero = true;
                    validGrtr = true;
                    validLssThn = true;
                }
            });
            if (!validForZero || !validGrtr || !validLssThn)
                validFlag = false;

            return validFlag;
        }

    }
]);

myApp.controller("errorgstr1nilsumryctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

    $scope.nilSumryList = {
        "inv": []
    };
    $scope.flag = true;

    var splyTypes = ["INTRB2B", "INTRAB2B", "INTRB2C", "INTRAB2C"];
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
        $scope.page("/gstr/error/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initnilSumryList();
    }

    function initnilSumryList() {

        g1FileHandler.getErrorContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
            $log.debug("errorgstr1nilsumryctrl -> initnilSumryList success:: ", response);

            //   var nilSumryList = response;
            if (response[0].inv.length > 0) {

                if (response[0].error_msg || response[0].error_cd) {
                    $scope.error_msg = response[0].error_msg;
                    $scope.error_cd = response[0].error_cd;
                }
                delete response[0].error_msg;
                delete response[0].error_cd;


                $scope.nilSumryList = response[0];

            }
            else {
                initNewRow();
            }


        }, function (response) {
            $log.debug("errorgstr1nilsumryctrl -> initnilSumryList fail:: ", response);
            initNewRow();
        });

    }

    $scope.initSumryList = initnilSumryList;

    $scope.updatenilSumryList = function () {
        $scope.flag = !$scope.flag;
        var stdata = angular.copy($scope.nilSumryList),

            keys = Object.keys(stdata);
        angular.forEach(keys, function (key, i) {
            stdata[key].nilsply = parseFloat(stdata[key].nilsply);
            stdata[key].cpddr = parseFloat(stdata[key].cpddr);
            stdata[key].exptdsply = parseFloat(stdata[key].exptdsply);
            stdata[key].ngsply = parseFloat(stdata[key].ngsply);
        });


        if (stdata) {
            R1InvHandler.emptyItemUpdateErrorPayload($scope, stdata, null, null);
        }
    }
}]);

myApp.controller("errorgstr2nilsumryctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

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

    if (!$scope.dashBoardDt) {
        $scope.page("/gstr/error/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initnilSumryList();
    }

    $scope.initSumryList = initnilSumryList;

    function initnilSumryList() {

        g1FileHandler.getErrorContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
            $log.debug("errorgstr2nilsumryctrl -> initnilSumryList success:: ", response);

            //   var nilSumryList = response;
            if (response) {

                if (typeof response[0] !== undefined) {
                    response = response[0];

                }

                if (response.error_msg || response.error_cd) {
                    $scope.error_msg = response.error_msg;
                    $scope.error_cd = response.error_cd;
                }
                delete response.error_msg;
                delete response.error_cd;


                $scope.nilSumryList = response;

            }
            else {
                initNewRow();
            }


        }, function (response) {
            $log.debug("errorgstr2nilsumryctrl -> initnilSumryList fail:: ", response);
            initNewRow();
        });

    }

    $scope.initSumryList = initnilSumryList;

    $scope.updatenilSumryList = function () {
        $scope.flag = !$scope.flag;
        var stdata = angular.copy($scope.nilSumryList),

            keys = Object.keys(stdata);
        angular.forEach(keys, function (key, i) {
            stdata[key].nilsply = parseFloat(stdata[key].nilsply);
            stdata[key].cpddr = parseFloat(stdata[key].cpddr);
            stdata[key].exptdsply = parseFloat(stdata[key].exptdsply);
            stdata[key].ngsply = parseFloat(stdata[key].ngsply);
        });


        if (stdata) {
            R1InvHandler.emptyItemUpdateErrorPayload($scope, stdata, null, null);
        }
    }
}]);


myApp.controller("erroritcrvrslctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

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
        $scope.page("/gstr/error/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initItcSumryList();
    }



    function initItcSumryList() {

        g1FileHandler.getErrorContentsFor($scope.dashBoardDt, $scope.sectionListSelected['cd']).then(function (response) {
            $log.debug("erroritcrvrslctrl -> inititcSumryList success:: ", response);

            //   var nilSumryList = response;
            if (response) {


                if (typeof response[0] !== undefined) {
                    response = response[0];

                }


                if (response.error_msg || response.error_cd) {
                    $scope.error_msg = response.error_msg;
                    $scope.error_cd = response.error_cd;
                }
                delete response.error_msg;
                delete response.error_cd;
                $scope.itcSumryList = response;
                initNewRow();

            };
        }, function (response) {
            $log.debug("erroritcrvrslctrl -> inititcSumryList fail:: ", response);
            initNewRow();
        });

    }

    $scope.initSumryList = initItcSumryList;

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



    $scope.updateItcReversalSumryList = function () {

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
                R1InvHandler.emptyItemUpdateErrorPayload($scope, stdata, null, null);
            }
        }
        else {
            $scope.itcInvalidFlag = true;
        }
    }
}]);

myApp.controller("uploaditcrvrslctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

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
        $scope.page("/gstr/upload/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initItcSumryList();
    }

    function initItcSumryList() {

        g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.sectionListSelected['cd'], shareData.pageNum,
            $scope.dashBoardDt.form,
            shareData,
            shareData.filter_val,
            $scope.sortBy,
            $scope.sortReverse,
            'FL2', // to identify second flow, 
            true).then(function (response) {
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

    $scope.initSumryList = initItcSumryList;

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

    $scope.isOther = function (rule) {
        return (rule && rule == 'other') ? true : false;
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
                R1InvHandler.emptyItemUploadAdd($scope, finalData, null);
            }
        }
        else {
            $scope.itcInvalidFlag = true;
        }
    }
}]);

myApp.controller("uploadgstr2nilsumryctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

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

    if (!$scope.dashBoardDt) {
        $scope.page("/gstr/upload/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initnilSumryList();
    }

    function initnilSumryList() {

        g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.sectionListSelected['cd'], shareData.pageNum,
            $scope.dashBoardDt.form,
            shareData,
            shareData.filter_val,
            $scope.sortBy,
            $scope.sortReverse,
            'FL2', // to identify second flow, 
            true).then(function (response) {
                $log.debug("nilsumry2ctrl -> initnilSumryList success:: ", response);

                //   var nilSumryList = response;
                if (response) {
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
        if (stdata) {
            R1InvHandler.emptyItemUploadAdd($scope, stdata, null);
        }
    }
}]);


myApp.controller("uploadgstr1nilsumryctrl", ['$scope', '$rootScope', 'shareData', 'g1FileHandler', '$log', 'NgTableParams', 'R1InvHandler', function ($scope, $rootScope, shareData, g1FileHandler, $log, NgTableParams, R1InvHandler) {

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
        $scope.page("/gstr/upload/dashboard");
    } else {
        shareData.dashBoardDt.tbl_cd = $scope.sectionListSelected['cd'];
        $scope.dashBoardDt = shareData.dashBoardDt;
        initnilSumryList();
    }

    function initnilSumryList() {

        g1FileHandler.getContentsForPaged($scope.dashBoardDt, $scope.sectionListSelected['cd'], shareData.pageNum,
            $scope.dashBoardDt.form,
            shareData,
            shareData.filter_val,
            $scope.sortBy,
            $scope.sortReverse,
            'FL2', // to identify second flow, 
            true).then(function (response) {
                $log.debug("nilsumryctrl -> initnilSumryList success:: ", response);

                if (response.inv.length > 0) {
                    // if (response.chksum && !response.flag)
                    //     response.flag = "N";
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


    $scope.saveuploadgstr1nilSumryList = function () {
        $scope.flag = !$scope.flag;
        //  var nillParams = [$scope.r1, $scope.r2, $scope.r3, $scope.r4];
        var stdata = angular.copy($scope.nilSumryList.inv);
        for (var i = 0; i < stdata.length; i++) {
            stdata[i].nil_amt = parseFloat(stdata[i].nil_amt);
            stdata[i].expt_amt = parseFloat(stdata[i].expt_amt);
            stdata[i].ngsup_amt = parseFloat(stdata[i].ngsup_amt);
        }


        if (stdata) {
            R1InvHandler.emptyItemUploadAdd($scope, stdata, null);
        }
    }
}]);
