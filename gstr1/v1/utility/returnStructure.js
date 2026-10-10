var extend = require('node.extend');
var moment = require('moment');
var angular = require('./angularHelper');
var trans = require('../public/lang/returns/translation-en.json');
const { intersection } = require('underscore');
var constants = require('../utility/constants');
var hsncodes = require('../public/data/HSN.json');
var thisShareData;
var cnvt2Nm = function (s) {
    if (!s)
        return 0;
    if (s == '')
        return 0;
    s = parseFloat(s);
    s = s.toFixed(2);
    s = parseFloat(s);
    return s;
}
var scopelists = {};
var monthPattern = /^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)$/,
    yearPattern = /^(2017-18|2018-19|2019-20|2020-21|2021-22|2022-23|2023-24|2024-25|2025-26|2026-27|2027-28)$/;
/* added this rule object for itc_revarsal rules mapping by sridhar */
var rules = {

    "(a) Amount in terms of rule 37 (2)": "rule2_2",
    "(b) Amount in terms of rule 42 (1) (m)": "rule7_1_m",
    "(c) Amount in terms of rule 43(1) (h)": "rule8_1_h",
    "(d) Amount in terms of rule 42 (2)(a)": "rule7_2_a",
    "(e) Amount in terms of rule 42(2)(b)": "rule7_2_b",
    "(f) On account of amount paid subsequent to reversal of ITC": "revitc",
    "(g) Any other liability (Specify)": "other"

};

var newHSNStartDateConstant = "052021";

scopelists.suplyList = [{ name: "Intra-State" }, { name: "Inter-State" }];
scopelists.upLoadList = [{ value: "S", name: "Supplier" }, { value: "R", name: "Receiver" }];
scopelists.typeList = [{ "value": "", "name": "Select" }, { "value": "E", "name": "E-COMMERCE" }, { "value": "OE", "name": "Other Than E-commerce" }];
scopelists.rsnList = [{ name: "01-Sales Return" }, { name: "02-Post Sale Discount" }, { name: "03-Deficiency in services" }, { name: "04-Correction in Invoice" }, { name: "05-Change in POS" }, { name: "06-Finalization of Provisional assessment" }, { name: "07-Others" }];
scopelists.noteList = [{ "value": "C", "name": "C" }, { "value": "D", "name": "D" }, { "value": "R", "name": "R" }];

scopelists.URList = [{
    "value": "B2CL",
    "name": "B2CL"
}, {
    "value": "EXP",
    "name": "EXP"
}];
scopelists.users = [{
    name: 'WOPAY',
    id: 'WOPAY'
}, {
    name: 'WPAY',
    id: 'WPAY'
}];
scopelists.types = [{
    name: "B2B",
    id: "B2B"
}, {
    name: "B2C",
    id: "B2C"
}];
scopelists.elgBltyList = [{
    "value": "",
    "name": "Select"
}, {
    "value": "ip",
    "name": "Inputs"
}, {
    "value": "ips",
    "name": "Input Services"
}, {
    "value": "cg",
    "name": "Capital Goods"
}, {
    "value": "none",
    "name": "None"
}];

scopelists.itcSuplyList = [{
    name: "ITC Availed –inter state Purchases",
    value: "IERP"
}, {
    name: "ITC Availed –intra state Purchases",
    value: "IRAP"
}, {
    name: "ITC Availed - Import",
    value: "IMP"
}, {
    name: "No ITC Availed",
    value: "NI"
}];


scopelists.UQCList = [
    {
        "value": "BAG", "name": "BAG-BAG"
    },
    { "value": "BGS", "name": "BGS-BAGS" }, { "value": "BKL", "name": "BKL-BUCKLES" }, { "value": "BOU", "name": "BOU-BOU" }, { "value": "BOX", "name": "BOX-BOX" }, { "value": "BTL", "name": "BTL-BOTTLES" }, { "value": "BUN", "name": "BUN-BUNCHES" }, { "value": "CBM", "name": "CBM-CUBIC METER" }, { "value": "CCM", "name": "CCM-CUBIC CENTIMETER" }, { "value": "CIN", "name": "CIN-CUBICINCHES" }, { "value": "CMS", "name": "CMS" }, { "value": "CQM", "name": "CQM-CUBIC METERS" }, { "value": "CTN", "name": "CTN-CARTON" }, { "value": "DOZ", "name": "DOZ-DOZEN" }, { "value": "DRM", "name": "DRM-DRUM" }, { "value": "FTS", "name": "FTS-FEET" }, { "value": "GGR", "name": "GGR-GREAT GROSS" }, { "value": "GMS", "name": "GMS-GRAMS" }, { "value": "GRS", "name": "GRS-GROSS" }, { "value": "GYD", "name": "GYD-GROSS YARDS" }, { "value": "HKS", "name": "HKS-HANKS" }, { "value": "INC", "name": "INC-INCHES" }, { "value": "KGS", "name": "KGS-Kilograms" }, { "value": "KLR", "name": "KLR-KILOLITRE" }, { "value": "KME", "name": "KME-KILOMETERS" }, { "value": "LBS", "name": "LBS-POUNDS" }, { "value": "LOT", "name": "LOT-LOTS" }, { "value": "LTR", "name": "LTR-LITERS" }, { "value": "MGS", "name": "MGS-MILLI GRAMS" }, { "value": "MTR", "name": "MTR-METER" }, { "value": "MTS", "name": "MTS-METRIC TON" }, { "value": "NOS", "name": "NOS-Numbers" }, { "value": "ODD", "name": "ODD-ODDS" }, { "value": "PAC", "name": "PAC-PACKS" }, { "value": "PCS", "name": "PCS-Pieces" }, { "value": "PRS", "name": "PRS-PAIRS" }, { "value": "QTL", "name": "QTL-QUINTAL" }, { "value": "ROL", "name": "ROL-ROLLS" }, { "value": "SDM", "name": "SDM-DECAMETER SQUARE" }, { "value": "SET", "name": "SET-SETS" }, { "value": "SHT", "name": "SHT-SHEETS" }, { "value": "SQF", "name": "SQF-SQUARE FEET" }, { "value": "SQI", "name": "SQI-SQUARE INCHES" }, { "value": "SQM", "name": "SQM-SQUARE METER" }, { "value": "SQY", "name": "SQY-SQUARE YARDS" }, { "value": "TBS", "name": "TBS-TABLETS" }, { "value": "THD", "name": "THD-THOUSANDS" }, { "value": "TOL", "name": "TOL-TOLA" }, { "value": "TON", "name": "TON-GREAT BRITAIN TON" }, { "value": "TUB", "name": "TUB-TUBES" }, { "value": "UGS", "name": "UGS-US GALLONS" }, { "value": "UNT", "name": "UNT-UNITS" }, { "value": "VLS", "name": "VLS-Vials" }, { "value": "YDS", "name": "YDS-YARDS" }, { "value": "NA", "name": "NA" }
];

//Change S2709 : To check the flag values - Subrat
//last updated 07/10/17 - Subrat - For Saved-Add combination
function getFlagValue(flagStr, cfsStatus, invActionStatus) {
    //If nothing is mention in Action field

    if (flagStr == undefined || flagStr == "") {
        flagStr = "";

        switch (invActionStatus) {
            case 'Accepted':
                return 'A';
            case 'Rejected':
                return 'R';
            case 'Pending':
                return 'P';
            case 'Modified':
                return 'M';
            case 'Deleted':
                return 'D';
            case 'No Action':
                return 'N';
            case 'Edited':
                return 'E';
        }
    }

    else if (cfsStatus == "NA" || ((cfsStatus == undefined || cfsStatus == "") && (invActionStatus == undefined || invActionStatus == ""))) {
        //for whichever section cfsStatus is not applicable

        switch (flagStr) {
            case 'Add':
                return '';
            case 'Delete':
                return 'D';
            case 'Edit':
                return 'E';
            case 'No Action':
                return 'N';
            default:
                return '';
        }
    } else if (cfsStatus == 'Submitted') {
        //for submitted invoices, if nothing is mentioned in Action field, then take the Invoice Action Status
        if (flagStr == '') {
            flagStr = invActionStatus;
        }

        switch (flagStr) {
            case 'Accept':
                return 'A';
            case 'Reject':
                return 'R';
            case 'Modify':
                return 'M';
            case 'Pending':
                return 'P';
            default:
                return 'N';
        }
    } else if (cfsStatus == 'Saved' || cfsStatus == '') {
        if (cfsStatus == 'Saved' && flagStr == 'Add')
            return ''
        //For Saved invoices,
        //If blank, send a blank flag
        //A/P/M/R/D, already discarded while importing
        //Add, send a blank flag
        switch (flagStr) {
            case '':
            case 'Add':
                return '';
        }

    }
    else if (cfsStatus == undefined && flagStr == 'Add')
        return 'U';
}

function hsnDescForOfflineTool(searchtext) {
    try {
        var fileData = hsncodes;

        if (fileData && fileData.data) {
            var searchList = fileData.data.filter(obj => obj.c == searchtext);

            // Check if any results were found
            if (searchList.length > 0) {
                return searchList[0].n;
            } else {
                return "";
            }
        } else {
            return "";
        }
    }
    catch (err) {
        return "";
    }
}

function getDate(retprd) {
    var a = '01/' + retprd.substring(0, 2) + '/' + retprd.substring(2);
    return a;
};
//temparory function until actions to be implemented in GSTR1 - by pavani
function getR1FlagValue(flagStr, chksum) {
    if (!flagStr && chksum) { //default action if in case of chksum is there n dint gave any action
        return 'N';
    }
    switch (flagStr) {
        case 'Delete':
            return 'D';
        case 'Edit':
            return 'E';
        case 'No Action':
            return 'N';
        // default:
        //     return '';
    }


}



// To get Invoice Type
function getInvType(isec, invtype) {
    if(invtype != null && invtype != undefined){
        
    if ((isec == 'b2b' || isec == 'b2ba') && thisShareData.dashBoardDt.form == 'GSTR1') {
        if (invtype.trim() == 'Regular B2B') return "R";
        else if (invtype.trim() == "Deemed Exp") return "DE";
        else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
        else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
        else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
    }
    else if (isec == 'b2b' || isec == 'b2ba') {
        if (invtype.trim() == 'Regular') return "R";
        else if (invtype.trim() == "Deemed Exp") return "DE";
        else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
        else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
        else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
    } else if (isec == 'ecomb2b' || isec == 'ecomurp2b' || isec == 'ecomab2b' || isec == 'ecomaurp2b') {
        
        if (invtype.trim() == 'Regular') return "R";
        else if (invtype.trim() == "Deemed Exp") return "DE";
        else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
        else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";

    }
}
};
// To get Description of Nil Rated
function getNilType(isec, sply_ty) {
    if (isec == 'nil') {
        if (sply_ty == 'Inter-State supplies to registered persons') return "INTRB2B";
        else if (sply_ty == 'Inter-State supplies to unregistered persons') return "INTRB2C";
        else if (sply_ty == 'Intra-State supplies to registered persons') return "INTRAB2B";
        else if (sply_ty == 'Intra-State supplies to unregistered persons') return "INTRAB2C";
    }
};


function getSupplyTypeForAt(iInv) {
    var dashGstin = thisShareData.dashBoardDt.gstin.slice(0, 2),
        isSEZ = thisShareData.isSezTaxpayer,
        sply_ty;
    if (dashGstin == iInv.pos && !isSEZ) {
        sply_ty = 'INTRA'
    }
    else {
        sply_ty = 'INTER'
    }
    return sply_ty;
}

function isCurrentPeriodBeforeAATOCheck(start_period, current_period) {
    var pattern = /((0[1-9])|10|11|12)([2][0-9][0-9][0-9])/;
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

function isEligibleForITC(pos, elig) {
    var rec_state = thisShareData.dashBoardDt.gstin.slice(0, 2);

    var sup_state = pos.slice(0, 2);

    if (sup_state != rec_state && elig != 'Ineligible') {
        return false;
    }

    else {
        return true;
    }

}
function isValidSuplyType(inv_type, sup_type) {
    if (inv_type == 'IMPS' && sup_type == 'Intra State')
        return false;
    else
        return true;
}
function isImportFromSez(ctin, imp) {

    if (imp == 'Received from SEZ') {
        if (ctin == '')
            return false;
        return true;
    }
    if (ctin != '')
        return false;
    return true;


}

function checkGstn(gst) {

    var factor = 2,
        sum = 0,
        checkCodePoint = 0,
        i, j, digit, mod, codePoint, cpChars, inputChars;
    cpChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    inputChars = gst.trim().toUpperCase();

    mod = cpChars.length;
    for (i = inputChars.length - 1; i >= 0; i = i - 1) {
        codePoint = -1;
        for (j = 0; j < cpChars.length; j = j + 1) {
            if (cpChars[j] === inputChars[i]) {
                codePoint = j;
            }
        }

        digit = factor * codePoint;
        factor = (factor === 2) ? 1 : 2;
        digit = (digit / mod) + (digit % mod);
        sum += Math.floor(digit);
    }
    checkCodePoint = ((mod - (sum % mod)) % mod);

    return gst + cpChars[checkCodePoint];
};
function gstin(gst) {
    var GstinPttn = /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/;
    if (testPattern(gst, GstinPttn)) {
        var substrgst = gst.substr(0, 14);
        if (gst === checkGstn(substrgst)) {
            return true;
        }
    }
    return false;
};
function uin(uin) {
    var UinPttn = /[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/;
    if (testPattern(uin, UinPttn)) {
        var substrgst = uin.substr(0, 14);
        if (uin === checkGstn(substrgst)) {
            return true;
        }
    }
    return false;
};

function tds(tds) {
    var tdsPttn = /[0-9]{2}[a-zA-Z]{4}[a-zA-Z0-9]{1}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[D]{1}[0-9a-zA-Z]{1}/;
    if (testPattern(tds, tdsPttn)) {
        var substrgst = tds.substr(0, 14);
        if (tds === checkGstn(substrgst)) {
            return true;
        }
    }
    return false;
};
function nrtp(nrtp) {
    var nrtpPttn = /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}$/;
    if (testPattern(nrtp, nrtpPttn)) {
        var substrgst = nrtp.substr(0, 14);
        if (nrtp === checkGstn(substrgst)) {
            return true;
        }
    }
    return false;
};

function testPattern(iString, iPattern) {
    var patt = new RegExp(iPattern),
        isPatternValid = patt.test(iString);
    return isPatternValid;
}

//To validate GSTIN/UIN
function validateGSTIN(ctin, iForm) {
    var validGstin = false;
    if (iForm == 'GSTR1')
        validGstin = gstin(ctin) || uin(ctin) || tds(ctin) || nrtp(ctin);
    else
        validGstin = gstin(ctin);

    return validGstin;

}
var monthsList = {
    "january": "01",
    "february": "02",
    "march": "03",
    "april": "04",
    "may": "05",
    "june": "06",
    "july": "07",
    "august": "08",
    "september": "09",
    "october": "10",
    "november": "11",
    "december": "12"
}
function isValidRtnPeriod(iYearsList, curntYear, curntMonth) {
    var isValidPeriod = false, monthValue = null;

    angular.forEachCustom(iYearsList, function (obj, i) {
        if (obj.year === curntYear) {
            if (obj.months != null && obj.months != undefined) {
                angular.forEachCustom(obj.months, function (monObj, i) {
                    
                    var monval = monObj.month;
                    if (monval.toUpperCase() === curntMonth.toUpperCase()) {
                        monthValue = monObj.value;
                        isValidPeriod = true;
                    }
                });
            }
        }
    })
    return {
        isValidPeriod: isValidPeriod,
        monthValue: monthValue
    }
}


// invoice level, not item level
var getInv = function (iSec, iForm, shareData) {
    thisShareData = shareData;


    var dashGstin = (shareData.dashBoardDt.gstin).substring(0, 2),
        isSEZ = shareData.isSezTaxpayer;
    var iYearsList = shareData.yearsList;

    var rtFn = null, comonObj;
    if (iForm == "GSTR1") {
        switch (iSec) {
            case 'b2b':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }

                    comonObj = {
                        "inum": inv[trans.LBL_INV_NUM],
                        "idt": inv[trans.LBL_INV_DATE],
                        "val": cnvt2Nm(inv[trans.LBL_INV_VAL_ONLY]),
                        "pos": (inv[trans.LBL_POS_Excel]).substring(0, 2),
                        "rchrg": inv[trans.LBL_RECHRG],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "etin": inv[trans.E_COMM_GSTN],
                        "inv_typ": getInvType(iSec, inv[trans.LBL_INVOICE_TYPE]),
                        "ctin": inv[trans.LBL_GSTIN_UIN_RECIPIENT],
                        "cname": inv[trans.LBL_RECEIVER_NAME],

                        "itms": [itemFn(i, inv)],
                     
                        "status": inv['E-invoice status'],
                        "supplierRecipientName": inv[trans.LBL_SUPPLIER_REC_NAME]

                    }


                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }

                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        comonObj["chksum"] = tempChckSum;
                        comonObj["cfs"] = tempCFS;
                        comonObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        comonObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }


                    return comonObj;

                }
                break;
            case 'b2ba':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }

                    comonObj = {
                        "oinum": inv[trans.LBL_ORG_INV_NO],
                        "oidt": inv[trans.LBL_ORG_INV_date],
                        "inum": inv[trans.LBL_REV_INVOICE_NUMBER],
                        "idt": inv[trans.LBL_REV_INVOICE_date],
                        "val": cnvt2Nm(inv[trans.LBL_INV_VAL_ONLY]),
                        "pos": (inv[trans.LBL_POS_Excel]).substring(0, 2),
                        "rchrg": inv[trans.LBL_RECHRG],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "etin": inv[trans.E_COMM_GSTN],
                        "inv_typ": getInvType(iSec, inv[trans.LBL_INVOICE_TYPE]),
                        "cname": inv[trans.LBL_RECEIVER_NAME],
                        "ctin": inv[trans.LBL_GSTIN_UIN_RECIPIENT],
                        "itms": [itemFn(i, inv)],
                        "supplierRecipientName": inv[trans.LBL_SUPPLIER_REC_NAME]

                    };

                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }


                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        comonObj["chksum"] = tempChckSum;
                        comonObj["cfs"] = tempCFS;
                        comonObj["updby"] = tempUpdBy;

                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        comonObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }

                    return comonObj;

                }
                break;
            case 'b2cl':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    comonObj = {
                        "etin": inv[trans.E_COMM_GSTN],
                        "inum": inv[trans.LBL_INV_NUM],
                        "idt": inv[trans.LBL_INV_DATE],
                        "val": cnvt2Nm(inv[trans.LBL_INV_VAL_ONLY]),
                        "pos": (inv[trans.LBL_POS_Excel]).slice(0, 2),
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]

                    }
                    if (inv.hasOwnProperty('Action')) {
                        var chksum;
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        comonObj['chksum'] = chksum;
                        comonObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }

                    return comonObj;

                }
                break;
            case 'b2cla':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    comonObj = {
                        "oinum": inv[trans.LBL_ORG_INV_NO],
                        "oidt": inv[trans.LBL_ORG_INV_date],
                        "etin": inv[trans.E_COMM_GSTN],
                        "inum": inv[trans.LBL_REV_INVOICE_NUMBER],
                        "idt": inv[trans.LBL_REV_INVOICE_date],
                        "val": cnvt2Nm(inv[trans.LBL_INV_VAL_ONLY]),
                        "pos": (inv[trans.LBL_POS_Excel_Org]).slice(0, 2),
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
                    if (inv.hasOwnProperty('Action')) {
                        var chksum;
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        comonObj['chksum'] = chksum;
                        comonObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }

                    return comonObj;
                }
                break;
            case 'at':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    var statecd = inv['Place Of Supply'].substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (dashGstin == statecd && !isSEZ) {

                        intraObj = {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }
                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;
                    }
                    else {
                        interObj = {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }
                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            else {
                            } interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }


                }
                break;
            case 'ata':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    var statecd = inv['Original Place Of Supply'].substring(0, 2),
                        year = inv['Financial Year'],
                        month = inv['Original Month'];
                    var tempAction = "", interObj, intraObj;
                    if (dashGstin == statecd && !isSEZ) {
                        intraObj = {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }
                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;
                    }
                    else {
                        interObj = {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }

                }
                break;
            case 'exp':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    comonObj = {
                        "exp_typ": inv[trans.Exp_Typ],
                        "inum": inv[trans.LBL_INV_NUM],
                        "idt": inv[trans.LBL_INV_DATE],
                        "val": cnvt2Nm(inv[trans.LBL_INV_VAL_ONLY]),
                        "sbpcode": inv[trans.HEAD_PORT_CD],
                        "sbnum": inv[trans.LBL_SHIP_BILL_NUM],
                        "sbdt": inv[trans.HEAD_SHIP_BILL_DATE],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)],

                        "status": inv['E-invoice status']
                    }
                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            comonObj['chksum'] = chksum;
                        }
                        comonObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }


                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                }
                break;
            case 'expa':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    comonObj = {
                        "exp_typ": inv[trans.Exp_Typ],
                        "oinum": inv[trans.LBL_ORG_INV_NO],
                        "oidt": inv[trans.LBL_ORG_INV_date],
                        "inum": inv[trans.LBL_REV_INVOICE_NUMBER],
                        "idt": inv[trans.LBL_REV_INVOICE_date],
                        "val": cnvt2Nm(inv[trans.LBL_INV_VAL_ONLY]),
                        "sbpcode": inv[trans.HEAD_PORT_CD],
                        "sbnum": inv[trans.LBL_SHIP_BILL_NUM],
                        "sbdt": inv[trans.HEAD_SHIP_BILL_DATE],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    }
                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            comonObj['chksum'] = chksum;
                        }
                        comonObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }


                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                }
                break;
            case 'cdnr':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    comonObj = {
                        "nt_num": inv[trans.LBL_DEBIT_CREDIT_NOTE_NO],
                        "nt_dt": inv[trans.LBL_DEBIT_CREDIT_NOTE_DATE],
                        "ntty": inv[trans.LBL_NOTE_TYP],
                        "val": cnvt2Nm(inv[trans.LBL_NOTE_VAL_Excel]),
                        "pos": (inv[trans.LBL_POS_Excel]) ? inv[trans.LBL_POS_Excel].substring(0, 2) : '',
                        "ctin": inv[trans.LBL_GSTIN_UIN_RECIPIENT],
                        "cname": inv[trans.LBL_RECEIVER_NAME],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "rchrg": inv[trans.LBL_RECHRG],
                        "inv_typ": getNoteSupplyType(iSec, inv[trans.LBL_NT_SPLY_TY]),
                        "itms": [itemFn(i, inv)],

                        "status": inv['E-invoice status'],
                        "supplierRecipientName": inv[trans.LBL_SUPPLIER_REC_NAME]
                     
                    };
                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }


                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        comonObj["chksum"] = tempChckSum;
                        comonObj["cfs"] = tempCFS;
                        comonObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        comonObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }

                    return comonObj;
                }
                break;
            case 'cdnur':
                rtFn = function (i, inv, itemFn) {

                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    comonObj = {
                        "nt_num": inv[trans.LBL_DEBIT_CREDIT_NOTE_NO],
                        "nt_dt": inv[trans.LBL_DEBIT_CREDIT_NOTE_DATE],
                        "ntty": inv[trans.LBL_NOTE_TYP],
                        "val": cnvt2Nm(inv[trans.LBL_NOTE_VAL_Excel]),
                        "typ": inv[trans.LBL_UR_TYPE],
                        "pos": (inv[trans.LBL_POS_Excel]) ? (inv[trans.LBL_POS_Excel]).substring(0, 2) : inv[trans.LBL_POS_Excel],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)],

                        "status": inv['E-invoice status']
                    }
                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            comonObj['chksum'] = chksum;
                        }
                        comonObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }


                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                }
                break;
            case 'cdnra':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }

                    comonObj = {
                        "ont_num": inv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO],
                        "ont_dt": inv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE],
                        "nt_num": inv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO],
                        "nt_dt": inv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE],
                        "ntty": inv[trans.LBL_NOTE_TYP],
                        "val": cnvt2Nm(inv[trans.LBL_NOTE_VAL_Excel]),
                        "pos": (inv[trans.LBL_POS_Excel]) ? inv[trans.LBL_POS_Excel].substring(0, 2) : '',
                        "ctin": inv[trans.LBL_GSTIN_UIN_RECIPIENT],
                        "cname": inv[trans.LBL_RECEIVER_NAME],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "rchrg": inv[trans.LBL_RECHRG],
                        "inv_typ": getNoteSupplyType(iSec, inv[trans.LBL_NT_SPLY_TY]),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)],
                        "supplierRecipientName": inv[trans.LBL_SUPPLIER_REC_NAME]
                       
                    };

                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }


                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        comonObj["chksum"] = tempChckSum;
                        comonObj["cfs"] = tempCFS;
                        comonObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        comonObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                }
                break;
            case 'cdnura':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage)) {
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                        diffval = false;
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    comonObj = {
                        "ont_num": inv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO],
                        "ont_dt": inv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE],
                        "nt_num": inv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO],
                        "nt_dt": inv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE],
                        "ntty": inv[trans.LBL_NOTE_TYP],
                        "val": cnvt2Nm(inv[trans.LBL_NOTE_VAL_Excel]),
                        "typ": inv[trans.LBL_UR_TYPE],
                        "pos": (inv[trans.LBL_POS_Excel]) ? (inv[trans.LBL_POS_Excel]).substring(0, 2) : inv[trans.LBL_POS_Excel],
                        "diff_percent": cnvt2Nm(diffFactor),
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]

                    }
                    if (inv.hasOwnProperty('Action')) {
                        var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['chksum'] = chksum;
                        comonObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }


                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            comonObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                }
                break;
            case 'b2cs':
                rtFn = function (i, inv, itemFn) {
                    var diffFactorField = null, diffFactorCalc = 1.00, diffval = true;

                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactorField = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffFactorCalc = diffFactorField;
                        diffval = false;
                    }
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                            "sply_ty": "INTRA",
                            "rt": inv['Rate'],
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "pos": pos,
                            "diff_percent": cnvt2Nm(diffFactorField),
                            "diffval": diffval,
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactorCalc),
                            "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactorCalc),
                            "csamt": cnvt2Nm(inv['Cess Amount'])
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;
                    } else {
                        interObj = {
                            "sply_ty": "INTER",
                            "rt": (inv['Rate']),
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "pos": pos,
                            "diff_percent": cnvt2Nm(diffFactorField),
                            "diffval": diffval,
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactorCalc),
                            "csamt": cnvt2Nm(inv['Cess Amount'])
                        };

                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }

                }
                break;
            case 'b2csa':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    var pos = (inv['Place Of Supply']).substring(0, 2),
                        year = inv['Financial Year'],
                        month = inv['Original Month'];

                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "sply_ty": "INTRA",
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;
                    } else {
                        interObj = {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "sply_ty": "INTER",
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };

                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }

                }
                break;
            case 'atadj':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    var statecd = inv['Place Of Supply'].substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (dashGstin == statecd && !isSEZ) {
                        intraObj = {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;

                    }
                    else {
                        interObj = {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };

                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }


                }
                break;
            case 'atadja':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    var statecd = inv['Original Place Of Supply'].substring(0, 2),
                        year = inv['Financial Year'],
                        month = inv['Original Month'];
                    var tempAction = "", interObj, intraObj;
                    if (dashGstin == statecd && !isSEZ) {
                        intraObj = {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;

                    }
                    else {
                        interObj = {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',
                            "diff_percent": cnvt2Nm(diffFactor),
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }


                }
                break;
            case 'hsn':
                rtFn = function (i, inv, itemFn) {
                    if (!isCurrentPeriodBeforeAATOCheck(newHSNStartDateConstant, thisShareData.monthSelected.value)) {
                        if (inv.UQC == "NA") {
                            comonObj = {
                                "num": parseInt(i),
                                "hsn_sc": inv['HSN'],
                                "desc": inv['Description'],
                                "uqc": inv['UQC'],
                                "qty": cnvt2Nm(inv['Total Quantity']),
                                "rt": cnvt2Nm(inv['Rate']),
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                "camt": cnvt2Nm(inv['Central Tax Amount']),
                                "csamt": cnvt2Nm(inv['Cess Amount'])
                            }
                        }
                        else {
                            comonObj = {
                                "num": parseInt(i),
                                "hsn_sc": inv['HSN'],
                                "desc": inv['Description'],
                                "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                "qty": cnvt2Nm(inv['Total Quantity']),
                                "rt": cnvt2Nm(inv['Rate']),
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                "camt": cnvt2Nm(inv['Central Tax Amount']),
                                "csamt": cnvt2Nm(inv['Cess Amount'])
                            }
                        }
                    }
                    else {
                        comonObj = {
                            "num": parseInt(i),
                            "hsn_sc": inv['HSN'],
                            "desc": inv['Description'],
                            "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                            "qty": cnvt2Nm(inv['Total Quantity']),
                            "val": cnvt2Nm(inv['Total Value']),
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                            "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                            "camt": cnvt2Nm(inv['Central Tax Amount']),
                            "csamt": cnvt2Nm(inv['Cess Amount'])
                        }
                    }


                    if (inv.hasOwnProperty('Error Message')) {
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                };
                break;
            case 'hsn(b2b)':
            case 'hsn(b2c)':
                var HSN_BIFURCATION_START_DATE = "052025";
                var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                if(showHSNTabs){
                rtFn = function (i, inv, itemFn) {                        
                        if (inv.UQC == "NA") {
                            comonObj = {
                                "num": parseInt(i),
                                "hsn_sc": inv['HSN'],
                                "user_desc": inv['Description'],
                                "desc": inv['Description as per HSN Code'],
                                "uqc": inv['UQC'],
                                "qty": cnvt2Nm(inv['Total Quantity']),
                                "rt": cnvt2Nm(inv['Rate']),
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                "camt": cnvt2Nm(inv['Central Tax Amount']),
                                "csamt": cnvt2Nm(inv['Cess Amount'])
                            }
                        }
                        else {
                            comonObj = {
                                "num": parseInt(i),
                                "hsn_sc": inv['HSN'],
                                "user_desc": inv['Description'],
                                "desc": inv['Description as per HSN Code'],
                                "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                                "qty": cnvt2Nm(inv['Total Quantity']),
                                "rt": cnvt2Nm(inv['Rate']),
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                                "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                                "camt": cnvt2Nm(inv['Central Tax Amount']),
                                "csamt": cnvt2Nm(inv['Cess Amount'])
                            }
                        }
                    
            
                    if (inv.hasOwnProperty('Error Message')) {
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                };
            }
                break;
            case 'nil':
                rtFn = function (i, inv, itemFn) {
                    var type = getNilType(iSec, inv['Description']);
                    comonObj = {
                        "sply_ty": type,
                        "expt_amt": (inv['Exempted(other than nil rated/non GST supply)']) ? cnvt2Nm(inv['Exempted(other than nil rated/non GST supply)']) : 0,
                        "nil_amt": (inv['Nil Rated Supplies']) ? cnvt2Nm(inv['Nil Rated Supplies']) : 0,
                        "ngsup_amt": (inv['Non-GST Supplies']) ? cnvt2Nm(inv['Non-GST Supplies']) : 0
                    }
                    if (inv.hasOwnProperty('Error Message')) {
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                };
                break;
            case 'doc_issue':
                var docDetails = ["Invoices for outward supply",
                    "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", "Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];
                rtFn = function (i, inv, itemFn) {
                    comonObj = {
                        "doc_num": docDetails.indexOf(inv['Nature of Document']) + 1,
                        "doc_typ": inv['Nature of Document'],
                        "docs": [itemFn(i, inv)]
                    };
                    if (inv.hasOwnProperty('Error Message')) {
                        comonObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            comonObj['error_msg'] = 'M';
                        else
                            comonObj['error_msg'] = inv['Error Message'];
                    }
                    return comonObj;
                };

                break;

            case 'supeco':

                rtFn = function (i, inv, itemFn) {
                   
                    var natSup = null;
                    if (inv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)') {
                        natSup = 'clttx';
                    }  
                    if (inv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)') {
                        natSup = 'paytx';
                    }
                    comonObj = {
                        "nat_supp": natSup,
                        "etin": inv['GSTIN of E-Commerce Operator'].toUpperCase(),
                        "cname": inv['E-Commerce Operator Name'],
                        "suppval": cnvt2Nm(inv['Net value of supplies']),
                        "igst": cnvt2Nm(inv['Integrated tax']),
                        "cgst": cnvt2Nm(inv['Central tax']),
                        "sgst": cnvt2Nm(inv['State/UT tax']),
                        "cess": cnvt2Nm(inv['Cess'])
                    };
                    
                    return comonObj;
                }
                break;
            case 'supecoa':
                rtFn = function (i, inv, itemFn) {
                  
                    var natSup = null;
                    if (inv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)') {
                        natSup = 'clttxa';
                    } 
                    if (inv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)') {
                        natSup = 'paytxa';
                    }
                    var oyear = inv['Financial Year'],
                    month = inv['Original Month/Quarter'];
                    comonObj = {
                        "nat_supp": natSup,
                        "omon": isValidRtnPeriod(iYearsList, oyear, month).monthValue,
                        "oetin": inv['Original GSTIN of E-Commerce Operator'].toUpperCase(),
                        "etin": inv['Revised GSTIN of E-Commerce Operator'].toUpperCase(),
                        "cname": inv['E-Commerce Operator Name'],
                        "suppval": cnvt2Nm(inv['Revised Net value of supplies']),
                        "igst": cnvt2Nm(inv['Integrated tax']),
                        "cgst": cnvt2Nm(inv['Central tax']),
                        "sgst": cnvt2Nm(inv['State/UT tax']),
                        "cess": cnvt2Nm(inv['Cess']),

                    };
                   
                    return comonObj;
                }
                break;
            case 'ecomb2b':
           
                rtFn = function (i, inv, itemFn) {
                
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                        "sply_ty": 'INTRA',
                        "stin": inv['Supplier GSTIN/UIN'].toUpperCase(),
                        "sname": inv['Supplier Name'],
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "cname": inv['Recipient Name'],
                        "inum": inv['Document Number'],
                        "idt": inv['Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "flag": "N"

                        };   
                    var tempAction = "",
                    tempCFS = "",
                    tempUpdBy = "",
                    tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                    tempFlag = '';
                if (inv.hasOwnProperty('Action'))
                    tempAction = inv['Action'];

                if (inv.hasOwnProperty('Saved/Submitted')) {
                    if (inv['Saved/Submitted'] == 'Submitted')
                        tempCFS = 'Y';
                    else
                        tempCFS = 'N';
                    if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                        tempUpdBy = "R";
                    if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                        tempUpdBy = "S";
                    }
                }

                if (inv.hasOwnProperty('Action')) {
                    if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                        tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                    }
                    tempFlag = getR1FlagValue(tempAction, tempChckSum);
                    if (inv['Status'] == 'Uploaded By Taxpayer') {
                        if (tempFlag != 'D' && tempFlag != 'E')
                            tempFlag = 'U';
                        tempUpdBy = 'S';
                    }
                    intraObj["chksum"] = tempChckSum;
                    intraObj["cfs"] = tempCFS;
                    intraObj["updby"] = tempUpdBy;
                    //Change S2709 : To handle action flag in flow 2 import excel feature
                    intraObj["flag"] = tempFlag;

                }

                if (inv.hasOwnProperty('Error Message')) {
                    if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                    intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                    intraObj['error_cd'] = inv['Error Code'];
                    if (inv['Error Status'] == 'Edit')
                    intraObj['error_msg'] = 'M';
                    else
                    intraObj['error_msg'] = inv['Error Message'];
                }
            
                return intraObj;
                } else {
                    interObj = {
                        "sply_ty": 'INTER',
                        "stin": inv['Supplier GSTIN/UIN'].toUpperCase(),
                        "sname": inv['Supplier Name'],
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "cname": inv['Recipient Name'],
                        "inum": inv['Document Number'],
                        "idt": inv['Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "flag": "N"
                    }
                
                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }

                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        interObj["chksum"] = tempChckSum;
                        interObj["cfs"] = tempCFS;
                        interObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        interObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                        interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                        interObj['error_msg'] = 'M';
                        else
                        interObj['error_msg'] = inv['Error Message'];
                    }
                    // console.log("b2b comonobj 1664", JSON.stringify(comonObj))


                    return interObj;

                }}
                break;
            case 'ecomb2c':
                rtFn = function (i, inv, itemFn) {
                    // console.log("pos", inv['Place Of Supply'])
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                            "sply_ty": 'INTRA',
                            "stin": inv['Supplier GSTIN/UIN'].toUpperCase(),
                            "cname": (inv['Supplier Name'] || '').toUpperCase(),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "rt": inv['Rate'],
                            "csamt": inv['Cess Amount'],
                            "sply_ty": 'INTRA',
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                            "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                            "iamt": 0.00,
                            "flag": "N"
                        };


                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        // console.log("intraobj 1706" , intraObj)
                        return intraObj;
                    } else {
                        interObj = {
                           "stin":inv['Supplier GSTIN/UIN'].toUpperCase(),
                            "cname": (inv['Supplier Name'] || '').toUpperCase(),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "txval": inv['Taxable Value'],
                            "rt": inv['Rate'],
                            "csamt": inv['Cess Amount'],
                            "sply_ty": 'INTER',
                            "camt": 0.00,
                            "samt": 0.00,
                            "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01),
                            "flag": "N"

                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        // console.log("intraobj 1736" , intraObj)
                        return interObj;

                    }

                }
                break;
            case 'ecomurp2b':
                rtFn = function (i, inv, itemFn) {
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                        "sply_ty": 'INTRA',
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "receipientName": null,
                        "inum": inv['Document Number'],
                        "idt": inv['Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "cname": inv['Recipient Name'],
                        "flag": "N"

                    };
                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }

                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        intraObj["chksum"] = tempChckSum;
                        intraObj["cfs"] = tempCFS;
                        intraObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        intraObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                        intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        intraObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                        intraObj['error_msg'] = 'M';
                        else
                        intraObj['error_msg'] = inv['Error Message'];
                    }

                    //console.log("ecomurp2b 18064" , JSON.stringify(comonObj))
                    return intraObj;

                }else{
                    interObj = {
                        "sply_ty": 'INTER',
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "receipientName": null,
                        "inum": inv['Document Number'],
                        "idt": inv['Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "cname": inv['Recipient Name'],
                        "flag": "N"

                    };
                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }

                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        interObj["chksum"] = tempChckSum;
                        interObj["cfs"] = tempCFS;
                        interObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        interObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                        interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        interObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                        interObj['error_msg'] = 'M';
                        else
                        interObj['error_msg'] = inv['Error Message'];
                    }

                    //console.log("ecomurp2b 18064" , JSON.stringify(comonObj))
                    return interObj;

                }
                }
                break;

            case 'ecomurp2c':
                rtFn = function (i, inv, itemFn) {
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "txval": inv['Taxable Value'],
                            "rt": inv['Rate'],
                            "csamt": inv['Cess Amount'],
                            "sply_ty": 'INTRA',
                            "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                            "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 ),
                            "iamt": 0.00,
                            "flag": "N"
                        };


                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        // console.log("ecomurp2c 1842" , intraObj)
                        return intraObj;
                    } else {
                        interObj = {
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "txval": inv['Taxable Value'],
                            "rt": inv['Rate'],
                            "csamt": inv['Cess Amount'],
                            "sply_ty": 'INTER',
                            "camt": 0.00,
                            "samt": 0.00,
                            "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01),
                            "flag": "N"
                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        // console.log("ecomurp2c 1869" , interObj)
                        return interObj;
                    }

                }
                break;
            case 'ecomab2b':
                rtFn = function (i, inv, itemFn) {
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                        "sply_ty": 'INTRA',
                        "stin": inv['Supplier GSTIN/UIN'].toUpperCase(),
                        "supplierName": null,
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "receipientName": null,
                        "oinum": inv['Original Document Number'],
                        "oidt": inv['Original Document Date'],
                        "inum": inv['Revised Document Number'],
                        "idt": inv['Revised Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "sname": inv['Supplier Name'],
                        "cname": inv['Recipient Name'],
                        "flag": "N"

                    };

                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }

                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        intraObj["chksum"] = tempChckSum;
                        intraObj["cfs"] = tempCFS;
                        intraObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        intraObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                        intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        intraObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                        intraObj['error_msg'] = 'M';
                        else
                        intraObj['error_msg'] = inv['Error Message'];
                    }

//console.log("comonObj urp2ba",JSON.stringify(comonObj))
                    return intraObj;


                }else{
                    interObj = {
                        "sply_ty": 'INTER',
                        "stin": inv['Supplier GSTIN/UIN'].toUpperCase(),
                        "supplierName":null,
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "receipientName": null,
                        "oinum": inv['Original Document Number'],
                        "oidt": inv['Original Document Date'],
                        "inum": inv['Revised Document Number'],
                        "idt": inv['Revised Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "sname": inv['Supplier Name'],
                        "cname": inv['Recipient Name'],
                        "flag": "N"

                    };

                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];

                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "R";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "S";
                        }
                    }

                    if (inv.hasOwnProperty('Action')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                            tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        }
                        tempFlag = getR1FlagValue(tempAction, tempChckSum);
                        if (inv['Status'] == 'Uploaded By Taxpayer') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'S';
                        }
                        intraObj["chksum"] = tempChckSum;
                        interObj["cfs"] = tempCFS;
                        interObj["updby"] = tempUpdBy;
                        //Change S2709 : To handle action flag in flow 2 import excel feature
                        interObj["flag"] = tempFlag;

                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                        interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        interObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                        interObj['error_msg'] = 'M';
                        else
                        interObj['error_msg'] = inv['Error Message'];
                    }

                    return interObj;
                }}

                break;
            case 'ecomab2c':
                rtFn = function (i, posItms, itemFn) {

                    var pos = (posItms['Place Of Supply']).substring(0, 2);
                    oyear = posItms['Financial Year'],
                    month = posItms['Original Month'];
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                            "sply_ty": 'INTRA',
                            "omon": isValidRtnPeriod(iYearsList, oyear, month).monthValue,
                            "stin": posItms['Supplier GSTIN/UIN'].toUpperCase(),
                            "sname": posItms['Supplier Name'],
                            "pos": (posItms['Place Of Supply']).substring(0, 2),
                            "itms": [itemFn(i, posItms)],
                            "flag": "N"
                        };


                        if (posItms.hasOwnProperty('Action')) {
                            tempAction = posItms['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (posItms.hasOwnProperty('Error Message')) {
                            if (posItms.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = posItms['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = posItms['Error Code'];
                            if (posItms['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = posItms['Error Message'];
                        }
                        return intraObj;
                    } else {
                        interObj = {
                            "sply_ty": 'INTER',
                            "omon": isValidRtnPeriod(iYearsList, oyear, month).monthValue,
                            "stin": posItms['Supplier GSTIN/UIN'].toUpperCase(),
                            "sname": posItms['Supplier Name'],
                            //"omon": posItms['Original Month'],
                            "pos": (posItms['Place Of Supply']).substring(0, 2),
                            "itms": [itemFn(i, posItms)],
                            "flag": "N"

                        };
                        if (posItms.hasOwnProperty('Action')) {
                            tempAction = invposItms['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (posItms.hasOwnProperty('Error Message')) {
                            if (posItms.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = posItms['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = posItms['Error Code'];
                            if (posItms['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = posItms['Error Message'];
                        }
                        //console.log("inter 2014",JSON.stringify(interObj))
                        return interObj;
                    }

                }
                break;

            case 'ecomaurp2b':
                rtFn = function (i, inv, itemFn) {
                    var pos = (inv['Place Of Supply']).substring(0, 2);
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                        "inum": inv['Revised Document Number'],
                        "idt": inv['Revised Document Date'],
                        "oinum": inv['Original Document Number'],
                        "oidt": inv['Original Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "receipientName":null,
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "cname":inv['Recipient Name'],
                        "flag": "N",
                        "sply_ty": 'INTRA'

                    };
                    
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        intraObj['chksum'] = chksum;
                        intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        intraObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            intraObj['error_msg'] = 'M';
                        else
                            intraObj['error_msg'] = inv['Error Message'];
                    }
                    return intraObj;
                } else {
                    interObj= {
                        "inum": inv['Revised Document Number'],
                        "idt": inv['Revised Document Date'],
                        "oinum": inv['Original Document Number'],
                        "oidt": inv['Original Document Date'],
                        "val": cnvt2Nm(inv['Value of supplies made']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "receipientName":null,
                        "rtin": inv['Recipient GSTIN/UIN'].toUpperCase(),
                        "inv_typ": getInvType(iSec, inv['Document type']),
                        "itms": [itemFn(i, inv)],
                        "cname":inv['Recipient Name'],
                        "flag": "N",
                        "sply_ty": 'INTER'

                    };
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        interObj['chksum'] = chksum;
                        interObj["flag"] = getR1FlagValue(tempAction, chksum);
                    }

                    if (inv.hasOwnProperty('Error Message')) {
                        if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                            interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                        interObj['error_cd'] = inv['Error Code'];
                        if (inv['Error Status'] == 'Edit')
                            interObj['error_msg'] = 'M';
                        else
                            interObj['error_msg'] = inv['Error Message'];
                    }
                    return interObj;
                }
                }
                break;

            case 'ecomaurp2c':
                rtFn = function (i, inv, itemFn) {
                    var pos = (inv['Place Of Supply']).substring(0, 2),
                    oyear = inv['Financial Year'],
                    month = inv['Original Month'];
                    var tempAction = "", interObj, intraObj;
                    if (pos == dashGstin && !isSEZ) {
                        intraObj = {
                            "sply_ty": 'INTRA',
                            "omon": isValidRtnPeriod(iYearsList, oyear, month).monthValue,
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "itms": [itemFn(i, inv)],
                            "flag": "N"

                        };


                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['chksum'] = chksum;
                            intraObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                intraObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            intraObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                intraObj['error_msg'] = 'M';
                            else
                                intraObj['error_msg'] = inv['Error Message'];
                        }
                        return intraObj;
                    } else {
                        interObj = {
                            "sply_ty": 'INTER',
                            "omon": isValidRtnPeriod(iYearsList, oyear, month).monthValue,
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "flag": "N",
                            "itms": [itemFn(i, inv)]

                        };
                        if (inv.hasOwnProperty('Action')) {
                            tempAction = inv['Action'];
                            var chksum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['chksum'] = chksum;
                            interObj["flag"] = getR1FlagValue(tempAction, chksum);
                        }

                        if (inv.hasOwnProperty('Error Message')) {
                            if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)'))
                                interObj['ref_key'] = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                            interObj['error_cd'] = inv['Error Code'];
                            if (inv['Error Status'] == 'Edit')
                                interObj['error_msg'] = 'M';
                            else
                                interObj['error_msg'] = inv['Error Message'];
                        }
                        return interObj;
                    }

                }
                break;
        }
    } else if (iForm == "GSTR2") {
        switch (iSec) {
            case 'b2b': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    //Change S2709 : To handle action flag in flow 2 import excel feature

                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempFlag = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73";
                    //for new ones, the above hardcoded checksum will be written into the json.
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "S";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "R";
                        }

                    }
                    if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                        tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                    }

                    if (inv.hasOwnProperty('Invoice Action Status')) {//"if" condition to check if excel has "Action" field or not

                        tempFlag = getFlagValue(tempAction, inv['Saved/Submitted'], inv['Invoice Action Status']);

                        if (inv['UPDTP Data(Please DO NOT Update/Delete)'] == 'U') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'R';
                        }

                        return {
                            "inum": inv['Invoice Number'],
                            "idt": inv['Invoice date'],
                            "val": inv['Invoice Value'],
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "rchrg": inv['Reverse Charge'],
                            "ctin": inv['GSTIN of Supplier'],
                            "cname": inv['Supplier Name'],
                            "chksum": tempChckSum,
                            "cfs": tempCFS,
                            "updby": tempUpdBy,
                            //Change S2709 : To handle action flag in flow 2 import excel feature
                            "flag": tempFlag,
                            "inv_typ": getInvType(iSec, inv['Invoice Type']),
                            "itms": [itemFn(i, inv)]
                        };

                    } else {
                        return {
                            "inum": inv['Invoice Number'],
                            "idt": inv['Invoice date'],
                            "val": inv['Invoice Value'],
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "rchrg": inv['Reverse Charge'],
                            "ctin": inv['GSTIN of Supplier'],
                            "cname": inv['Supplier Name'],
                            "chksum": tempChckSum,
                            "updby": tempUpdBy,
                            "inv_typ": getInvType(iSec, inv['Invoice Type']),
                            "itms": [itemFn(i, inv)]
                        };
                    }
                }
                break;
            case 'cdnr': // GSTR2
            case 'cdn': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var tempAction = "",
                        tempCFS = "",
                        tempUpdBy = "",
                        tempChckSum = "54aad044b20696ddce8d53fac8650f8b577f2f6f5b9e67ecef6ec37b8d79fd73",
                        tempFlag = '';
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];
                    if (inv.hasOwnProperty('Saved/Submitted')) {
                        if (inv['Saved/Submitted'] == 'Submitted')
                            tempCFS = 'Y';
                        else
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "S";
                        if ((!inv.hasOwnProperty('Saved/Submitted')) || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
                            tempUpdBy = "R";
                        }
                    }
                    if (inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                        tempChckSum = inv['Mandatory Check Field(Please DO NOT Update/Delete)'];
                    }

                    if (inv.hasOwnProperty('Invoice Action Status')) {

                        tempFlag = getFlagValue(tempAction, inv['Saved/Submitted'], inv['Invoice Action Status']);
                        if (inv['UPDTP Data(Please DO NOT Update/Delete)'] == 'U') {
                            if (tempFlag != 'D' && tempFlag != 'E')
                                tempFlag = 'U';
                            tempUpdBy = 'R';
                        }

                        return {
                            "nt_num": inv['Note/Refund Voucher Number'],
                            "nt_dt": inv['Note/Refund Voucher date'],
                            "inum": inv['Invoice/Advance Payment Voucher Number'],
                            "ntty": inv["Document Type"],
                            "rsn": inv["Reason For Issuing document"],
                            "flag": tempFlag,
                            "cfs": tempCFS,
                            "chksum": tempChckSum,
                            "updby": tempUpdBy,
                            "idt": inv['Invoice/Advance Payment Voucher date'],
                            "val": inv['Note/Refund Voucher Value'] ? inv['Note/Refund Voucher Value'] : 0,
                            "p_gst": inv['Pre GST'],
                            "sp_typ": inv['Supply Type'],
                            "ctin": inv['GSTIN of Supplier'],
                            "cname": inv['Supplier Name'],
                            "itms": [itemFn(i, inv)]

                        };
                    } else {

                        return {
                            "nt_num": inv['Note/Refund Voucher Number'],
                            "nt_dt": inv['Note/Refund Voucher date'],
                            "inum": inv['Invoice/Advance Payment Voucher Number'],
                            "ntty": inv["Document Type"],
                            "rsn": inv["Reason For Issuing document"],
                            "updby": tempUpdBy,
                            "chksum": tempChckSum,
                            "idt": inv['Invoice/Advance Payment Voucher date'],
                            "val": inv['Note/Refund Voucher Value'] ? inv['Note/Refund Voucher Value'] : 0,
                            "p_gst": inv['Pre GST'],
                            "sp_typ": inv['Supply Type'],
                            "ctin": inv['GSTIN of Supplier'],
                            "cname": inv['Supplier Name'],
                            "itms": [itemFn(i, inv)]

                        };

                    }
                }
                break;
            case 'b2bur': // GSTR2
                rtFn = function (i, inv, itemFn) {

                    //Change S2709 : To handle action flag in flow 2 import excel feature
                    var tempAction = "";
                    var tempNum = "";
                    if (inv.hasOwnProperty('Action'))
                        tempAction = inv['Action'];


                    if (inv.hasOwnProperty('Action')) {//"if" condition to check if excel has "Action" field or not

                        return {

                            "inum": inv['Invoice Number'],
                            "idt": inv['Invoice date'],
                            "cname": inv['Supplier Name'],
                            "val": inv['Invoice Value'],
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            //Change S2709 : To handle action flag in flow 2 import excel feature
                            "flag": getFlagValue(tempAction, "NA", "NA"),
                            "sp_typ": inv['Supply Type'],
                            "itms": [itemFn(i, inv)]
                        };
                    } else {
                        return {

                            "inum": inv['Invoice Number'],
                            "idt": inv['Invoice date'],
                            "cname": inv['Supplier Name'],
                            "val": inv['Invoice Value'],
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "sp_typ": inv['Supply Type'],
                            "itms": [itemFn(i, inv)]
                        };
                    }
                }
                break;
            case 'b2ba': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    return {
                        "oinum": inv['Original Invoice Number'],
                        "oidt": inv['Original Invoice date'],
                        "inum": inv['Revised Invoice Number'],
                        "idt": inv['Revised Invoice date'],
                        "val": inv['Total Invoice Value'],
                        "pos": (inv['Place Of Supply'] < 10) ? "0" + inv['Place Of Supply'] : "" + inv['Place Of Supply'],
                        "rchrg": inv['Reverse Charge'],
                        "ctin": inv['Supplier GSTIN'],
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'b2bura': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    return {
                        "oinum": inv['Original Invoice Number'],
                        "oidt": inv['Original Invoice date'],
                        "inum": inv['Revised Invoice Number'],
                        "idt": inv['Revised Invoice date'],
                        "val": inv['Total Invoice Value'],
                        "pos": (inv['Place Of Supply'] < 10) ? "0" + inv['Place Of Supply'] : "" + inv['Place Of Supply'],
                        "rchrg": inv['Reverse Charge'],
                        "cname": inv['Supplier Name'],
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'imp_g': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    if (!inv['GSTIN Of SEZ Supplier']) {
                        inv['GSTIN Of SEZ Supplier'] = ''
                    }
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        return {
                            "ctin": inv['GSTIN Of SEZ Supplier'],
                            "boe_num": inv['Bill Of Entry Number'],
                            "boe_dt": inv['Bill Of Entry Date'],
                            "boe_val": parseFloat(inv['Bill Of Entry Value']),
                            "flag": getFlagValue(tempAction, "NA", "NA"),
                            "is_sez": (inv['Document type'] == 'Received from SEZ') ? "Y" : "N",
                            "port_code": inv['Port Code'],
                            "itms": [itemFn(i, inv)]
                        };
                    } else {
                        return {
                            "ctin": inv['GSTIN Of SEZ Supplier'],
                            "boe_num": inv['Bill Of Entry Number'],
                            "boe_dt": inv['Bill Of Entry Date'],
                            "boe_val": parseFloat(inv['Bill Of Entry Value']),
                            "is_sez": (inv['Document type'] == 'Received from SEZ') ? "Y" : "N",
                            "port_code": inv['Port Code'],
                            "itms": [itemFn(i, inv)]
                        };
                    }
                }
                break;
            case 'imp_ga': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    return {
                        "oboe_num": inv['Original Bill Of Entry Number'],
                        "oboe_dt": inv['Original Bill Of Entry date'],
                        "boe_num": inv['Revised Bill Of Entry Number'],
                        "boe_dt": inv['Revised Bill Of Entry date'],
                        "port_code": inv['Port Code'],
                        "boe_val": inv['Total Invoice Value'],
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'txi': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        var statecd = inv['Place Of Supply'].substring(0, 2);
                        if (dashGstin == statecd) {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTRA',
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        else {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTER',
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                    } else {
                        return {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": inv["Supply Type"],
                            "itms": [itemFn(i, inv)]
                        };
                    }
                }
                break;
            case 'atxi': // GSTR2
                rtFn = function (i, inv, itemFn) {

                    return {
                        "reg_type": inv['Type'],
                        "ocpty": inv['Original Supplier GSTIN'],
                        "odnum": inv['Original Document Number'],
                        "otdt": inv['Original Document date'],
                        "cpty": inv['Revised Supplier GSTIN'],
                        "state_cd": "" + inv['Recipient State Code'],
                        "dnum": inv['Revised Document Number'],
                        "dt": inv['Revised Document date'],
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'imp_s': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var tempAction = "";
                    var tempInvDate = "";
                    //there is a mismatch between excel template and the export to excel
                    if (inv.hasOwnProperty('Invoice date'))
                        tempInvDate = inv['Invoice date'];
                    else
                        tempInvDate = inv['Invoice Date'];
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        return {
                            "inum": inv['Invoice Number of Reg Recipient'],
                            "idt": tempInvDate,
                            "ival": parseFloat(inv['Invoice Value']),
                            "flag": getFlagValue(tempAction, "NA", "NA"),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "itms": [itemFn(i, inv)]
                        };
                    } else {
                        return {
                            "inum": inv['Invoice Number of Reg Recipient'],
                            "idt": tempInvDate,
                            "ival": parseFloat(inv['Invoice Value']),
                            "pos": (inv['Place Of Supply']).substring(0, 2),
                            "itms": [itemFn(i, inv)]
                        };
                    }
                }
                break;
            case 'imp_sa': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    return {
                        "oi_num": inv['Original Invoice Number'],
                        "oi_dt": inv['Original Invoice date'],
                        "i_num": inv['Revised Invoice Number'],
                        "i_dt": inv['Revised Invoice date'],
                        "i_val": inv['Total Invoice Value'],
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;

            case 'cdnur': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        return {
                            "nt_num": inv['Note/Voucher Number'],
                            "nt_dt": inv['Note/Voucher date'],
                            "inum": inv['Invoice/Advance Payment Voucher number'],
                            "ntty": inv["Document Type"],
                            "rsn": inv["Reason For Issuing document"],
                            "idt": inv['Invoice/Advance Payment Voucher date'],
                            "val": inv['Note/Voucher Value'] ? inv['Note/Voucher Value'] : 0,
                            "flag": getFlagValue(tempAction, "NA", "NA"),
                            "p_gst": inv['Pre GST'],
                            "sp_typ": inv['Supply Type'],
                            "itms": [itemFn(i, inv)]

                        };
                    } else {
                        return {
                            "nt_num": inv['Note/Voucher Number'],
                            "nt_dt": inv['Note/Voucher date'],
                            "inum": inv['Invoice/Advance Payment Voucher number'],
                            "ntty": inv["Document Type"],
                            "rsn": inv["Reason For Issuing document"],
                            "idt": inv['Invoice/Advance Payment Voucher date'],
                            "val": inv['Note/Voucher Value'] ? inv['Note/Voucher Value'] : 0,
                            "inv_typ": inv['Invoice Type'],
                            "p_gst": inv['Pre GST'],
                            "sp_typ": inv['Supply Type'],
                            "itms": [itemFn(i, inv)]

                        };

                    }
                }
                break;
            case 'cdnra': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    return {
                        "ont_num": inv['Original Debit Note Number'],
                        "ont_dt": inv['Original Debit Note date'],
                        "nt_num": inv['Revised Debit Note Number'],
                        "nt_dt": inv['Revised Debit Note date'],
                        "inum": inv['Invoice Number'],
                        "ntty": inv["Note Type"],
                        "rsn": inv["Reason For Issuing Note"],
                        "idt": inv['Invoice date'],
                        "val": inv['Total Invoice Value'],
                        "ctin": inv['Supplier GSTIN'],
                        "irt": inv['IGST Rate'],
                        "iamt": inv['IGST Amount'],
                        "crt": inv['CGST Rate'],
                        "camt": inv['CGST Amount'],
                        "srt": inv['SGST Rate'],
                        "samt": inv['SGST Amount'],
                        "csrt": inv['CESS Rate'],
                        "csamt": inv['Cess Amount'],
                        "itc": {
                            "elg": inv['Eligibility For ITC'],
                            "tx_i": inv["Taxable IGST"],
                            "tx_s": inv["Taxable SGST"],
                            "tx_c": inv["Taxable CGST"],
                            "tx_cs": inv["Taxable CESS"],
                            "tc_i": inv["ITC IGST"],
                            "tc_s": inv["ITC SGST"],
                            "tc_c": inv["ITC CGST"],
                            "tc_cs": inv["ITC CESS"]
                        }
                    };
                }
                break;
            case 'hsnsum': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        return {
                            "hsn_sc": inv['HSN'],
                            "desc": inv['Description'],
                            "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                            "qty": parseFloat(inv['Total Quantity']),
                            "flag": getFlagValue(tempAction, "NA", "NA"),
                            "val": inv['Total Value'],
                            "txval": inv['Taxable Value'],
                            "iamt": inv['Integrated Tax Amount'],
                            "samt": inv['State/UT Tax Amount'],
                            "camt": inv['Central Tax Amount'],
                            "csamt": inv['Cess Amount']
                        };
                    } else {
                        return {
                            "hsn_sc": inv['HSN'],
                            "desc": inv['Description'],
                            "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),
                            "qty": parseFloat(inv['Total Quantity']),
                            "val": inv['Total Value'],
                            "txval": inv['Taxable Value'],
                            "iamt": inv['Integrated Tax Amount'],
                            "samt": inv['State/UT Tax Amount'],
                            "camt": inv['Central Tax Amount'],
                            "csamt": inv['Cess Amount']
                        };

                    }
                }
                break;
            case 'itc_rvsl': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var itcrvsl = {};
                    var dec = inv['Description for reversal of ITC'];
                    var tempAction = "";
                    var rule = rules[dec]
                    itcrvsl[rule] = {
                        "iamt": inv['ITC Integrated Tax Amount'] ? parseFloat(inv['ITC Integrated Tax Amount']) : 0,
                        "camt": inv['ITC Central Tax Amount'] ? parseFloat(inv['ITC Central Tax Amount']) : 0,
                        "samt": inv['ITC State/UT Tax Amount'] ? parseFloat(inv['ITC State/UT Tax Amount']) : 0,
                        "csamt": inv['ITC Cess Amount'] ? parseFloat(inv['ITC Cess Amount']) : 0,
                    };
                    return itcrvsl;
                }
                break;
            case 'atadj': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var statecd = inv['Place Of Supply'].substring(0, 2);
                    var tempAction = "";
                    if (inv.hasOwnProperty('Action')) {
                        tempAction = inv['Action'];
                        if (dashGstin == statecd) {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTRA',
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        else {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTER',
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                    } else {
                        return {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": inv["Supply Type"],
                            "itms": [itemFn(i, inv)]
                        };
                    }
                }
                break;

            case 'nil': // GSTR2
                rtFn = function (i, inv, itemFn) {
                    var m = {};
                    var k = inv['Description'];
                    if (k == 'Inter-State supplies') {
                        var desc = 'inter';
                    } else if (k == 'Intra-State supplies') {
                        var desc = 'intra';
                    }

                    m[desc] = {
                        "sply_ty": getNilType(iSec, inv['Description']),
                        "exptdsply": inv['Exempted (other than nil rated/non GST supply )'] ? parseFloat(inv['Exempted (other than nil rated/non GST supply )']) : 0,
                        "cpddr": inv['Composition taxable person'] ? parseFloat(inv['Composition taxable person']) : 0,
                        "nilsply": inv['Nil Rated Supplies'] ? parseFloat(inv['Nil Rated Supplies']) : 0,
                        "ngsply": inv['Non-GST supplies'] ? parseFloat(inv['Non-GST supplies']) : 0
                    }
                    return m;
                };
                break;

        }

    }
    return rtFn;
}

// item level
var getItm = function (iSec, iForm, shareData) {
    var rtFn = null;
    var dashGstin = (shareData.dashBoardDt.gstin).substring(0, 2),
        isSEZ = shareData.isSezTaxpayer;
    if (iForm == "GSTR1") {
        var intraState = false;
        switch (iSec) {
            case 'b2b':
            case 'b2ba':
                rtFn = function (i, inv) {
                    var invType = getInvType(iSec, inv['Invoice Type']);


                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage))
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);

                    var tempNum;// to read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required

                    if (dashGstin == inv['Place Of Supply'].substring(0, 2) && (invType == 'R' || invType == 'DE') && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "camt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2))),
                                "samt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "iamt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '' || invType === 'SEWOP') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'b2cl':
            case 'b2cla':
                rtFn = function (i, inv) {
                    var tempNum; // to read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    var pos = '';
                    if (iSec == 'b2cl') {
                        pos = inv['Place Of Supply'].substring(0, 2);
                    }
                    else {
                        pos = inv['Original Place Of Supply'].substring(0, 2)
                    }

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    if (dashGstin == pos && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "camt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                "samt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                                "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'cdnr':
                rtFn = function (i, inv) {
                    var ntSplyType = getNoteSupplyType(iSec, inv[trans.LBL_NOTE_SUP_TYP]);
                    var tempNum; // to read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv[trans.LBL_Rate] * 100 + 1; // now minimum 0 is required

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage))
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);
                    var isIntrastate;
                    if (inv[trans.LBL_POS_Excel]) {
                        isIntrastate = ((dashGstin == inv[trans.LBL_POS_Excel].substring(0, 2)) && (ntSplyType == "R" || ntSplyType == "DE")) ? true : false;
                    }
                    if (inv[trans.LBL_SUPP_TYP]) {
                        isIntrastate = (inv[trans.LBL_SUPP_TYP] == 'Intra State') ? true : false;
                    }

                    if (isIntrastate && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv[trans.LBL_Taxable_Value]),
                                "rt": inv[trans.LBL_Rate],
                                "camt": (ntSplyType === 'SEWOP') ? 0 : (parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.005 * diffFactor).toFixed(2))),
                                "samt": (ntSplyType === 'SEWOP') ? 0 : (parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.005 * diffFactor).toFixed(2))),
                                "csamt": (!inv[trans.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[trans.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[trans.LBL_Cess_Amount]).toFixed(2)))
                            }
                        };

                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv[trans.LBL_Taxable_Value]),
                                "rt": inv[trans.LBL_Rate],
                                "iamt": (ntSplyType === 'SEWOP') ? 0 : (parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.01 * diffFactor).toFixed(2))),
                                "csamt": (!inv[trans.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[trans.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[trans.LBL_Cess_Amount]).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'cdnra':
                rtFn = function (i, inv) {
                    var ntSplyType = getNoteSupplyType(iSec, inv[trans.LBL_NOTE_SUP_TYP]);
                    var tempNum; // to read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv[trans.LBL_Rate] * 100 + 1; // now minimum 0 is required

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage))
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);

                    var isIntrastate;
                    if (inv[trans.LBL_POS_Excel]) {
                        isIntrastate = ((dashGstin == inv[trans.LBL_POS_Excel].substring(0, 2)) && (ntSplyType == "R" || ntSplyType == "DE")) ? true : false;
                    }
                    if (inv[trans.LBL_SUPP_TYP]) {
                        isIntrastate = (inv[trans.LBL_SUPP_TYP] == 'Intra State') ? true : false;
                    }

                    if (isIntrastate && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv[trans.LBL_Taxable_Value]),
                                "rt": inv[trans.LBL_Rate],
                                "camt": (ntSplyType === 'SEWOP') ? 0 : (parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.005 * diffFactor).toFixed(2))),
                                "samt": (ntSplyType === 'SEWOP') ? 0 : (parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.005 * diffFactor).toFixed(2))),
                                "csamt": (!inv[trans.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[trans.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[trans.LBL_Cess_Amount]).toFixed(2)))
                            }
                        };

                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv[trans.LBL_Taxable_Value]),
                                "rt": inv[trans.LBL_Rate],
                                "iamt": (ntSplyType === 'SEWOP') ? 0 : (parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.01 * diffFactor).toFixed(2))),
                                "csamt": (!inv[trans.LBL_Cess_Amount] || ntSplyType === 'SEWOP' || inv[trans.LBL_Cess_Amount] == '') ? 0 : parseFloat((parseFloat(inv[trans.LBL_Cess_Amount]).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'cdnur':
            case 'cdnura':
                rtFn = function (i, inv) {
                    var tempNum; // to read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv[trans.LBL_Rate] * 100 + 1; // now minimum 0 is required

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage))
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);

                    return {
                        "num": tempNum,
                        "itm_det": {
                            "txval": cnvt2Nm(inv[trans.LBL_Taxable_Value]),
                            "rt": inv[trans.LBL_Rate],

                            "iamt": (inv[trans.LBL_UR_TYPE] == "EXPWOP") ? 0 : parseFloat((inv[trans.LBL_Taxable_Value] * inv[trans.LBL_Rate] * 0.01 * diffFactor).toFixed(2)),

                            "csamt": (!inv[trans.LBL_Cess_Amount] || inv[trans.LBL_Cess_Amount] == '' || inv[trans.LBL_UR_TYPE] == "EXPWOP") ? 0 : parseFloat((parseFloat(inv[trans.LBL_Cess_Amount]).toFixed(2)))
                        }
                    };

                }
                break;

            case 'at':
            case 'ata':
                rtFn = function (i, inv) {

                    var statecd = '';
                    if (iSec == 'ata') {
                        statecd = inv['Original Place Of Supply'].substring(0, 2);
                    } else {
                        statecd = inv['Place Of Supply'].substring(0, 2);
                    }

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    if (dashGstin == statecd && !isSEZ) {

                        return {

                            "rt": inv['Rate'],
                            "ad_amt": cnvt2Nm(inv['Gross Advance Received']),
                            "camt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "samt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }
                    else {
                        return {

                            "rt": inv['Rate'],
                            "ad_amt": cnvt2Nm(inv['Gross Advance Received']),
                            "iamt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }

                };
                break;

            case 'atadj':
            case 'atadja':
                rtFn = function (i, inv) {

                    var statecd = '';
                    if (iSec == 'atadja') {
                        statecd = inv['Original Place Of Supply'].substring(0, 2);
                    } else {
                        statecd = inv['Place Of Supply'].substring(0, 2);
                    }

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    if (dashGstin == statecd && !isSEZ) {

                        return {

                            "rt": inv['Rate'],
                            "ad_amt": cnvt2Nm(inv['Gross Advance Adjusted']),
                            "camt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "samt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }
                    else {
                        return {

                            "rt": inv['Rate'],
                            "ad_amt": cnvt2Nm(inv['Gross Advance Adjusted']),
                            "iamt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }

                };
                break;
            case 'exp':
            case 'expa':
                rtFn = function (i, inv) {

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty(trans.LBL_Diff_Percentage))
                        diffFactor = (inv[trans.LBL_Diff_Percentage] / 100).toFixed(2);

                    return {
                        "txval": cnvt2Nm(inv['Taxable Value']),
                        "rt": inv['Rate'],
                        "iamt": (inv["Export Type"] == "WOPAY") ? 0 : parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                        "csamt": (inv["Export Type"] == "WOPAY") ? 0 : cnvt2Nm(inv['Cess Amount'])
                    }

                };
                break;
            case 'doc_issue':
                rtFn = function (i, inv) {
                    return {
                        "num": parseInt(i),
                        "from": inv['Sr. No. From'].toString(),
                        "to": inv['Sr. No. To'].toString(),
                        "totnum": parseFloat(inv['Total Number']),
                        "cancel": parseFloat(inv['Cancelled']),
                        "net_issue": parseFloat(inv['Total Number'] - inv['Cancelled'])
                    }

                };
                break;
            case 'b2csa':
                rtFn = function (i, inv) {
                    var statecd = inv['Place Of Supply'].substring(0, 2);

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    if (dashGstin == statecd && !isSEZ) {

                        return {

                            "rt": inv['Rate'],
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "camt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "samt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "csamt": cnvt2Nm(inv['Cess Amount'])
                        }
                    }
                    else {
                        return {

                            "rt": inv['Rate'],
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                            "csamt": cnvt2Nm(inv['Cess Amount'])
                        }
                    }

                };
                break;
            case 'ecomb2b':
            case 'ecomab2b':
            case 'ecomurp2b':
            case 'ecomaurp2b':

                rtFn = function (i, inv) {
                    var invType = getInvType(iSec, inv['Document type']);

                    var tempNum;// to read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1;
                    if (dashGstin == inv['Place Of Supply'].substring(0, 2) && (invType == 'R' || invType == 'DE') && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "camt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005).toFixed(2))),
                                "samt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "rt": inv['Rate'],
                                "iamt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '' || invType === 'SEWOP') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'ecomab2c':
            case 'ecomaurp2c':
                rtFn = function (i, inv) {
                    if (dashGstin == inv['Place Of Supply'].substring(0, 2) && !isSEZ) {
                        return {
                                "rt": inv['Rate'],
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "camt": (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 ).toFixed(2))),
                                "samt": (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 ).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        };
                    } else {
                        return {
                                "rt": inv['Rate'],
                                "txval": cnvt2Nm(inv['Taxable Value']),
                                "iamt":  (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        };
                    }
                }    
            break;
               

            default:
                rtFn = null
                break;
        }
    } else if (iForm == "GSTR2") {
        var impDt = {
            "Inputs": "ip", "Input services": "is", "Capital goods": "cp", "Ineligible": "no",
            "ip": "ip", "is": "is", "cp": "cp", "no": "no"

        }
        switch (iSec) {

            case 'b2b': // GSTR2
                rtFn = function (i, inv) {
                    dashGstin = (inv['GSTIN of Supplier']).substring(0, 2);
                    var invType = getInvType(iSec, inv['Invoice Type']),
                        elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    if (dashGstin == inv['Place Of Supply'].substring(0, 2) && invType == 'R') {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "camt": inv['Central Tax Paid'] ? cnvt2Nm(inv['Central Tax Paid']) : 0,
                                "samt": inv['State/UT Tax Paid'] ? cnvt2Nm(inv['State/UT Tax Paid']) : 0,
                                "csamt": (invType === 'SEWOP') ? 0 : cnvt2Nm(inv['Cess Paid'])
                            },
                            "itc": {
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_c": (inv["Availed ITC Central Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Central Tax"]) : 0,
                                "tx_s": (inv["Availed ITC State/UT Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC State/UT Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Cess"]) : 0,
                            }
                        };
                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                "csamt": (invType === 'SEWOP') ? 0 : cnvt2Nm(inv['Cess Paid'])
                            },
                            "itc": {
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Integrated Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Cess"]) : 0,
                            }
                        };
                    }
                }
                break;
            case 'b2bur': // GSTR2
                rtFn = function (i, inv) {
                    var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    if ('Inter State' != inv['Supply Type']) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "camt": inv['Central Tax Paid'] ? cnvt2Nm(inv['Central Tax Paid']) : 0,
                                "samt": inv['State/UT Tax Paid'] ? cnvt2Nm(inv['State/UT Tax Paid']) : 0,
                                "csamt": inv['Cess Paid'] ? parseFloat(inv['Cess Paid']) : 0
                            }, "itc": {
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_c": (inv["Availed ITC Central Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Central Tax"]) : 0,
                                "tx_s": (inv["Availed ITC State/UT Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC State/UT Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,

                            }
                        };
                    } else {

                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0
                            },
                            "itc": {
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0,

                            }
                        };
                    }

                }
                break;
            case 'b2ba': // GSTR2
            case 'b2bura': // GSTR2
                rtFn = function (i, inv) {
                    return {
                        "num": inv['Rate'] * 100 + 1,
                        "itm_det": {
                            "txval": inv['Taxable Value'],
                            "rt": inv['Rate'],
                            "csamt": inv['Cess Amount'],
                            "camt": inv['CGST Amount'],
                            "samt": inv['SGST Amount'],

                            "iamt": inv['IGST Amount'],
                            "crt": inv['CGST Rate'],

                            "srt": inv['SGST Rate'],

                            "csrt": inv['CESS Rate'],

                        },
                        "itc": {
                            "elg": inv['Eligibility For ITC'],
                            "tx_i": inv["Taxable IGST"],
                            "tx_s": inv["Taxable SGST"],
                            "tx_c": inv["Taxable CGST"],
                            "tx_cs": inv["Taxable CESS"],
                            "tc_i": inv["ITC IGST"],
                            "tc_s": inv["ITC SGST"],
                            "tc_c": inv["ITC CGST"],
                            "tc_cs": inv["ITC CESS"]
                        }
                    };
                }
                break;
            case 'cdnr': // GSTR2
            case 'cdnur': // GSTR2
                rtFn = function (i, inv) {
                    var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    if ('Inter State' != inv['Supply Type']) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "camt": inv['Central Tax Paid'] ? cnvt2Nm(inv['Central Tax Paid']) : 0,
                                "samt": inv['State/UT Tax Paid'] ? cnvt2Nm(inv['State/UT Tax Paid']) : 0,
                                "csamt": inv['Cess Paid'] ? parseFloat(inv['Cess Paid']) : 0
                            }, "itc": {
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_c": (inv["Availed ITC Central Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Central Tax"]) : 0,
                                "tx_s": (inv["Availed ITC State/UT Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC State/UT Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Cess"]) : 0,

                            }
                        };
                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                                "csamt": inv['Cess Paid'] ? parseFloat(inv['Cess Paid']) : 0
                            },
                            "itc": {
                                "elg": impDt[(inv['Eligibility For ITC']).trim()],
                                "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Integrated Tax"]) : 0,
                                "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? parseFloat(inv["Availed ITC Cess"]) : 0,

                            }
                        };
                    }

                }
                break;
            case 'txi': // GSTR2
            case 'atxi': // GSTR2
                rtFn = function (i, inv) {
                    var statecd = inv['Place Of Supply'].substring(0, 2);
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required 
                    if ('Inter State' != inv['Supply Type']) {

                        return {
                            "num": tempNum,
                            "rt": inv['Rate'],
                            "adamt": parseFloat(inv['Gross Advance Paid']),
                            "camt": parseFloat((inv['Gross Advance Paid'] * inv['Rate'] * 0.005).toFixed(2)),
                            "samt": parseFloat((inv['Gross Advance Paid'] * inv['Rate'] * 0.005).toFixed(2)),
                            "csamt": parseFloat(inv['Cess Amount'] ? parseFloat(inv['Cess Amount']) : 0)
                        }
                    }
                    else {
                        return {
                            "num": tempNum,
                            "rt": inv['Rate'],
                            "adamt": parseFloat(inv['Gross Advance Paid']),
                            "iamt": parseFloat((inv['Gross Advance Paid'] * inv['Rate'] * 0.01).toFixed(2)),//inv['CGST Amount'],
                            "csamt": parseFloat(inv['Cess Amount'] ? parseFloat(inv['Cess Amount']) : 0)
                        }
                    }

                };
                break;

            case 'imp_g': // GSTR2
            case 'imp_ga': // GSTR2
                rtFn = function (i, inv) {
                    var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    return {
                        "num": tempNum,
                        "txval": inv['Taxable Value'] ? inv['Taxable Value'] : 0,
                        "rt": inv['Rate'],
                        "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                        "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0,
                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                        "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0
                    }
                }
                break;
            case 'imp_s': // GSTR2
            case 'imp_sa': // GSTR2
                rtFn = function (i, inv) {
                    var elgibility = impDt[(inv['Eligibility For ITC']).trim()];
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    return {
                        "num": tempNum,
                        "txval": inv['Taxable Value'] ? inv['Taxable Value'] : 0,
                        "rt": inv['Rate'],
                        "iamt": inv['Integrated Tax Paid'] ? cnvt2Nm(inv['Integrated Tax Paid']) : 0,
                        "csamt": inv['Cess Paid'] ? cnvt2Nm(inv['Cess Paid']) : 0,
                        "elg": impDt[(inv['Eligibility For ITC']).trim()],
                        "tx_i": (inv["Availed ITC Integrated Tax"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Integrated Tax"]) : 0,
                        "tx_cs": (inv["Availed ITC Cess"] && elgibility !== 'no') ? cnvt2Nm(inv["Availed ITC Cess"]) : 0
                    }
                }
                break;
            case 'atadj': // GSTR2
                rtFn = function (i, inv) {
                    var statecd = inv['Place Of Supply'].substring(0, 2);
                    var tempNum; //To read hidden num from excel
                    if (inv.hasOwnProperty('Mandatory Unique Num Identifier(Please DO NOT Update/Delete)'))
                        tempNum = parseInt(inv['Mandatory Unique Num Identifier(Please DO NOT Update/Delete)']);
                    else
                        tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required 
                    if ('Inter State' != inv['Supply Type']) {
                        return {
                            "num": tempNum,
                            "rt": inv['Rate'],
                            "adamt": parseFloat(inv['Gross Advance Paid to be Adjusted']),
                            "camt": parseFloat((inv['Gross Advance Paid to be Adjusted'] * inv['Rate'] * 0.005).toFixed(2)),
                            "samt": parseFloat((inv['Gross Advance Paid to be Adjusted'] * inv['Rate'] * 0.005).toFixed(2)),
                            "csamt": parseFloat(inv['Cess Adjusted'] ? inv['Cess Adjusted'] : 0)
                        }
                    }
                    else {
                        return {
                            "num": tempNum,
                            "rt": inv['Rate'],
                            "adamt": parseFloat(inv['Gross Advance Paid to be Adjusted']),
                            "iamt": parseFloat((inv['Gross Advance Paid to be Adjusted'] * inv['Rate'] * 0.01).toFixed(2)),//inv['CGST Amount'],
                            "csamt": parseFloat(inv['Cess Adjusted'] ? inv['Cess Adjusted'] : 0)
                        }
                    }

                };
                break;
            default: // GSTR2
                rtFn = null
                break;
        }
    }
    return rtFn;
}

function getYearFromTheMonth(iYearsList, omonValue) {
    var curntYear;
    for (var i = 0; i < iYearsList.length; i++) {
        var yearObj = iYearsList[i];
        for (var j = 0; j < yearObj.months.length; j++) {
            var monObj = yearObj.months[j];
            if (monObj.value === omonValue) {
                curntYear = yearObj;
                break;
            }
        }
    }
    return curntYear;

}

//reformating the response from payload we r getting inorder display in ui
function reformateInv(spLs, gstn, iSec, iForm, isErrReform, shareData) {

    var rtFn = null,
        thisShareData = shareData;
    if (iForm == "GSTR1" || iForm == "GSTR2A") {
        switch (iSec) {
            case 'b2b':
            case 'b2ba':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.inv, function (inv) {
                            inv['ctin'] = list['ctin'];
                            inv['cname'] = list['cname'];
                            if (iForm == "GSTR2A") {
                                inv['dtcancel'] = list['dtcancel'];
                                inv['cfs'] = list['cfs'];
                                inv['cfs3b'] = list['cfs3b'];
                                inv['fldtr1'] = list['fldtr1'];
                                inv['flprdr1'] = list['flprdr1'];
                                if (inv['atyp'] == "R") {
                                    inv['atyp'] = "GSTIN Amended";
                                }
                                else if (inv['atyp'] == "N") {
                                    inv['atyp'] = "Invoice Number";
                                }
                                else if (inv['atyp'] == "D") {
                                    inv['atyp'] = "Invoice Details";
                                }
                            }
                            if (isErrReform) {
                                inv['error_msg'] = list['error_msg'];
                                inv['error_cd'] = list['error_cd'];
                            }
                            inv['sp_typ'] = getSupplyType(spLs, inv['ctin'], inv['pos'], inv['inv_typ'], thisShareData.isSezTaxpayer);
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'isd':
            case 'isda':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.doclist, function (inv) {
                            inv['ctin'] = list['ctin'];
                            if (iForm == "GSTR2A") {
                                inv['dtcancel'] = list['dtcancel'];
                                inv['cfs'] = list['cfs'];
                                inv['cfs3b'] = list['cfs3b'];
                                if (inv['atyp'] == "R") {
                                    inv['atyp'] = "GSTIN Amended";
                                }
                                else if (inv['atyp'] == "N") {
                                    inv['atyp'] = "Invoice Number";
                                }
                                else if (inv['atyp'] == "D") {
                                    inv['atyp'] = "Invoice Details";
                                }
                            }
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'tds':
            case 'tdsa':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        rtArry.push(list);
                    });
                    return rtArry;
                }
                break;
            case 'b2cl':
            case 'b2cla':
                function getSupplyTypeC(iSpLs, gstn, pos) {
                    var suplyTyp;
                    if (pos) {

                        if (gstn.slice(0, 2) === pos) {
                            suplyTyp = iSpLs[0];
                        } else {
                            suplyTyp = iSpLs[1];
                        }
                    }
                    if (thisShareData.isSEZ) {
                        suplyTyp = iSpLs[1];
                    }

                    return suplyTyp;
                }
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.inv, function (inv) {
                            inv['pos'] = list['pos'];
                            if (isErrReform) {
                                inv['error_msg'] = list['error_msg'];
                                inv['error_cd'] = list['error_cd'];
                            }
                            inv['sp_typ'] = getSupplyTypeC(spLs, gstn, inv['pos']);
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'b2cs':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['sply_ty'] = getSupplyTypeForAt(inv);

                        inv['uni_key'] = inv['pos'] + "_" + inv['rt'] + "_" + inv['diff_percent'] + "_" + inv['etin'];

                        rtArry.push(inv);
                    });

                    return rtArry;
                }
                break;
            case 'b2csa':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['sply_ty'] = getSupplyTypeForAt(inv);
                        inv['uni_key'] = inv['omon'] + "_" + inv['pos'] + "_" + inv['diff_percent'] + "_" + inv['etin'];
                        inv['oyear'] = getYearFromTheMonth(thisShareData.yearsList, inv['omon']);
                        rtArry.push(inv);
                    });

                    return rtArry;
                }
                break;
            case 'at':
            case 'atadj':
            case 'txpd':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['sply_ty'] = getSupplyTypeForAt(inv)
                        rtArry.push(inv);
                    });
                    return rtArry;
                }
                break;
            case 'ata':
            case 'atadja':
            case 'txpda':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['oyear'] = getYearFromTheMonth(thisShareData.yearsList, inv['omon']);
                        inv['sply_ty'] = getSupplyTypeForAt(inv)
                        rtArry.push(inv);
                    });
                    return rtArry;
                }
                break;
            case 'exp':
            case 'expa':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list) {
                        angular.forEachCustom(list.inv, function (inv) {
                            inv['sp_typ'] = spLs[1];
                            inv.exp_typ = list.exp_typ;
                            if (isErrReform) {
                                inv['error_msg'] = list['error_msg'];
                                inv['error_cd'] = list['error_cd'];
                            }
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'cdn':
            case 'cdnr':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.nt, function (nt) {
                            nt['ctin'] = list['ctin'];
                            nt['cname'] = list['cname'];
                            if (iForm == "GSTR2A") {
                                nt['dtcancel'] = list['dtcancel'];
                                nt['cfs'] = list['cfs'];
                                nt['cfs3b'] = list['cfs3b'];
                                nt['fldtr1'] = list['fldtr1'];
                                nt['flprdr1'] = list['flprdr1'];
                                if (nt['atyp'] == "R") {
                                    nt['atyp'] = "GSTIN Amended";
                                }
                                else if (nt['atyp'] == "N") {
                                    nt['atyp'] = "Invoice Number";
                                }
                                else if (nt['atyp'] == "D") {
                                    nt['atyp'] = "Invoice Details";
                                }

                            }
                            if (isErrReform) {
                                nt['error_msg'] = list['error_msg'];
                                nt['error_cd'] = list['error_cd'];
                                if (nt.itms.length && nt.itms[0].itm_det) {

                                    if (isSEZ) {
                                        nt['sp_typ'] = spLs[0];
                                    }
                                    else {
                                        if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                            nt['sp_typ'] = spLs[0];
                                        } else {
                                            nt['sp_typ'] = spLs[1];
                                        }
                                    }

                                } else {
                                    nt['sp_typ'] = R1Util.getSupplyType(spLs, nt['ctin'], nt['pos']);
                                }


                            } else {

                                if (nt.itms.length && nt.itms[0].itm_det && !nt.pos) {

                                    if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                        nt['sp_typ'] = spLs[0];
                                    } else {
                                        nt['sp_typ'] = spLs[1];
                                    }
                                }

                                else {
                                    nt['sp_typ'] = getSupplyType(spLs, nt['ctin'], nt['pos'], nt['inv_typ'], thisShareData.isSezTaxpayer); //spLs[1];

                                }
                            }
                            rtArry.push(nt);
                        });
                    });
                    return rtArry;

                }
                break;
            case 'cdnra':
            case 'cdna':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.nt, function (nt) {
                            nt['ctin'] = list['ctin'];
                            nt['cname'] = list['cname'];
                            if (iForm == "GSTR2A") {
                                nt['dtcancel'] = list['dtcancel'];
                                nt['cfs'] = list['cfs'];
                                nt['cfs3b'] = list['cfs3b'];
                                nt['fldtr1'] = list['fldtr1'];
                                nt['flprdr1'] = list['flprdr1'];

                                if (nt['atyp'] == "R") {
                                    nt['atyp'] = "GSTIN Amended";
                                }
                                else if (nt['atyp'] == "N") {
                                    nt['atyp'] = "Invoice Number";
                                }
                                else if (nt['atyp'] == "D") {
                                    nt['atyp'] = "Invoice Details";
                                }
                            }
                            if (isErrReform) {
                                nt['error_msg'] = list['error_msg'];
                                nt['error_cd'] = list['error_cd'];

                                if (nt.itms.length && nt.itms[0].itm_det) {

                                    if (isSEZ) {
                                        nt['sp_typ'] = spLs[0];
                                    }
                                    else {
                                        if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                            nt['sp_typ'] = spLs[0];
                                        } else {
                                            nt['sp_typ'] = spLs[1];
                                        }
                                    }

                                } else {
                                    nt['sp_typ'] = R1Util.getSupplyType(spLs, nt['ctin'], nt['pos']);
                                }
                            }
                            else {

                                if (nt.itms.length && nt.itms[0].itm_det && !nt.pos) {

                                    if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                        nt['sp_typ'] = spLs[0];
                                    } else {
                                        nt['sp_typ'] = spLs[1];
                                    }
                                }

                                else {

                                    nt['sp_typ'] = getSupplyType(spLs, nt['ctin'], nt['pos'], nt['inv_typ'], thisShareData.isSezTaxpayer); //spLs[1]; 


                                }
                            }

                            rtArry.push(nt);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'cdnur':
            case 'cdnura':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list) {
                        list['sp_typ'] = spLs[1];
                        rtArry.push(list);
                    });
                    return rtArry;

                }
                break;
            case 'hsn':
            case 'nil':
            case 'doc_issue':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (data) {
                        rtArry.push(data);
                    });
                    return iResp;
                }
                break;
               case 'hsn(b2b)':
                var HSN_BIFURCATION_START_DATE = "052025";
                var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                if(showHSNTabs){
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEachCustom(iResp.hsn_b2b, function (data) {
                                rtArry.push(data);
                            });
                            return iResp;
                        }
                    }
                        break;
            case 'hsn(b2c)':
                var HSN_BIFURCATION_START_DATE = "052025";
                var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                if(showHSNTabs){
                        rtFn = function (iResp) {
                            var rtArry = [];
                            angular.forEachCustom(iResp.hsn_b2c, function (data) {
                                rtArry.push(data);
                            });
                            return iResp;
                        }
                    }
                        break;
            case 'impg':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (item) {
                        let obj = {
                            refdt: item.refdt,
                            refdate: new Date(item.refdt.split("-").reverse().join("-")),
                            pcode: item.portcd,
                            boenum: item.benum,
                            boedt: item.bedt,
                            boedate: new Date(item.bedt.split("-").reverse().join("-")),
                            boeval: Number(item.txval).toFixed(2),
                            igst: Number(item.iamt).toFixed(2),
                            cess: Number(item.csamt).toFixed(2),
                            amended: item.amd ? "Yes" : "",
                        }
                        rtArry.push(obj);
                    });
                    return rtArry;
                }
                break;
            case 'impgsez':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (item) {
                        let obj = {
                            ctin: item.sgstin,
                            trdnm: item.tdname,
                            refdt: item.refdt,
                            pcode: item.portcd,
                            boenum: item.benum,
                            boedt: item.bedt,
                            boeval: Number(item.txval).toFixed(2),
                            igst: Number(item.iamt).toFixed(2),
                            cess: Number(item.csamt).toFixed(2),
                            amended: item.amd ? "Yes" : ""
                        }
                        obj.refdate = new Date(item.refdt.split("-").reverse().join("-"));
                        obj.boedate = new Date(item.bedt.split("-").reverse().join("-"));
                        rtArry.push(obj);
                    });
                    return rtArry;
                }
                break;
            case 'supeco':
                rtFn = function (iResp) {
                    var rtArry = [];
                    if (iResp.clttx && iResp.clttx.length > 0) {
                        angular.forEachCustom(iResp.clttx, function (list, i) {
                            list['nat_supp'] = 'clttx'
                            list['uni_key'] = list['nat_supp'] + "_" + list['etin'];
                            rtArry.push(list);
                        });
                    }
                    if (iResp.paytx && iResp.paytx.length > 0) {
                        angular.forEachCustom(iResp.paytx, function (list, i) {
                            list['nat_supp'] = 'paytx'
                            list['uni_key'] = list['nat_supp'] + "_" + list['etin'];
                            rtArry.push(list);
                        });
                    }
                    return rtArry;
                }
                break;
            case 'supecoa':
                rtFn = function (iResp) {
                    var rtArry = [];
                    if (iResp.clttxa && iResp.clttxa.length > 0) {
                        angular.forEachCustom(iResp.clttxa, function (list, i) {
                            list['nat_supp'] = 'clttxa'
                            list['uni_key'] = list['omon'] + "_" + list['oetin'];
                            list['oyear'] = getYearFromTheMonth(thisShareData.yearsList, list['omon']);
                            rtArry.push(list);
                        });
                    }
                    if (iResp.paytxa && iResp.paytxa.length > 0) {
                        angular.forEachCustom(iResp.paytxa, function (list, i) {
                            list['nat_supp'] = 'paytxa'
                            list['uni_key'] = list['omon'] + "_" + list['oetin'];
                            list['oyear'] = getYearFromTheMonth(thisShareData.yearsList, list['omon']);
                            rtArry.push(list);
                        });
                    }
                    return rtArry;
                }
                break;
            case 'ecom':
                rtFn = function (iResp) {
                    var rtArry = [];
                    if (shareData.table == 'ecomb2b' && iResp.b2b.length > 0) {
                        angular.forEachCustom(iResp.b2b, function (list, i) {
                            angular.forEachCustom(list.inv, function (inv) {
                                inv['stin'] = list['stin'];
                                inv['rtin'] = list['rtin'];
                                inv['sp_typ'] = getSupplyType(spLs, inv['rtin'], inv['pos'], inv['inv_typ'], thisShareData.isSezTaxpayer);
                                rtArry.push(inv);
                            });
                        });
                    } else if (shareData.table == 'ecomb2c' && iResp.b2c.length > 0) {
                        angular.forEachCustom(iResp.b2c, function (list, i) {
                            list['uni_key'] = list['pos'] + "_" + list['rt'] + "_" + list['stin'];
                            list['sp_typ'] = getSupplyType(spLs, list['stin'],
                                list['pos'], thisShareData.isSezTaxpayer);
                            rtArry.push(list);
                        });
                    } else if (shareData.table == 'ecomurp2b' && iResp.urp2b.length > 0) {
                        angular.forEachCustom(iResp.urp2b, function (list, i) {
                            angular.forEachCustom(list.inv, function (inv) {
                                inv['rtin'] = list['rtin'];
                                inv['sp_typ'] = getSupplyType(spLs, inv['rtin'],
                                    inv['pos'], inv['inv_typ'], thisShareData.isSezTaxpayer);
                                rtArry.push(inv);
                            });
                        });
                    } else if (shareData.table == 'ecomurp2c' && iResp.urp2c.length > 0) {
                        angular.forEachCustom(iResp.urp2c, function (list) {
                            list['uni_key'] = list['pos'] + "_" + list['rt'];
                            list['sply_ty'] = getSupplyTypeForAt(list);
                            rtArry.push(list);
                        });
                    }
                    return rtArry;
                }
                break;
            case 'ecoma':
                rtFn = function (iResp) {
                    var rtArry = [];
                    if (shareData.table == 'ecomab2b' && iResp.b2ba.length > 0) {
                        angular.forEachCustom(iResp.b2ba, function (list, i) {     
                            angular.forEachCustom(list.inv, function (inv) {
                                inv['stin'] = list['stin'];
                                inv['rtin'] = list['rtin'];
                                inv['sp_typ'] = getSupplyType(spLs, inv['rtin'], inv['pos'], inv['inv_typ'], thisShareData.isSezTaxpayer);
                                rtArry.push(inv);
                            });
                        });
                    }
                    else if (shareData.table == 'ecomab2c' && iResp.b2ca.length > 0) {
                        angular.forEachCustom(iResp.b2ca, function (list, i) {
                            angular.forEachCustom(list.posItms, function (posItms) {
                                posItms['uni_key'] = posItms['omon'] + "_" + list['pos'] + "_" + posItms['stin'];
                                posItms['pos'] = list['pos'];
                                posItms['sp_typ'] = getSupplyType(spLs, posItms['stin'], posItms['pos'], thisShareData.isSezTaxpayer);
                                posItms['oyear'] = getYearFromTheMonth(thisShareData.yearsList, posItms['omon']);
                                rtArry.push(posItms);

                            });
                        });

                    } else if (shareData.table == 'ecomaurp2b' && iResp.urp2ba.length > 0) {
                        angular.forEachCustom(iResp.urp2ba, function (list, i) {
                            angular.forEachCustom(list.inv, function (inv) {
                                inv['rtin'] = list['rtin'];
                                inv['sp_typ'] = getSupplyType(spLs, inv['rtin'],
                                inv['pos'], inv['inv_typ'], thisShareData.isSezTaxpayer);
                                rtArry.push(inv);
                            });
                        });
                    } else if (shareData.table == 'ecomaurp2c' && iResp.urp2ca.length > 0) {
                        angular.forEachCustom(iResp.urp2ca, function (list) {
                            list['uni_key'] = list['pos'] + "_" + list['omon'];
                            list['sply_ty'] = getSupplyTypeForAt(list);
                            list['oyear'] = getYearFromTheMonth(thisShareData.yearsList, list['omon']);
                            rtArry.push(list);
                        })
                    }
                    return rtArry;
                }
                break;
        }
    }
    else if (iForm == "GSTR2") {
        switch (iSec) {
            case 'b2b': // GSTR2
            case 'b2ba': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.inv, function (inv) {
                            inv['ctin'] = list['ctin'];
                            if (list['cname'])
                                inv['cname'] = list['cname'];
                            if (list['cfs'])
                                inv['cfs'] = list['cfs'];
                            inv['ctin'] = list['ctin'];
                            inv['sp_typ'] = (inv['inv_typ'] == 'R') ? getSupplyType(spLs, inv['ctin'], inv['pos']) : spLs[1];
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'b2bur': // GSTR2
            case 'b2bura': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.inv, function (inv) {

                            if (typeof inv.itms[0].itm_det.iamt == 'undefined') {
                                inv['sp_typ'] = spLs[0];
                            } else {
                                inv['sp_typ'] = spLs[1];
                            }

                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'imp_g': // GSTR2
            case 'imp_ga': // GSTR2
            case 'imp_s': // GSTR2
            case 'imp_sa': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['sp_typ'] = spLs[1];
                        rtArry.push(inv);
                    });

                    return rtArry;
                }
                break;
            case 'txi': // GSTR2
            case 'atxi': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        if (typeof inv.itms[0].iamt == 'undefined') {
                            inv['sply_ty'] = "INTRA";
                        } else {
                            inv['sply_ty'] = "INTER";
                        }

                        rtArry.push(inv);
                    });
                    return rtArry;
                }
                break;
            case 'hsnsum': // GSTR2
                rtFn = function (iResp) {

                    var rtArry = [];
                    angular.forEachCustom(iResp, function (data) {
                        if (data == null)
                            return;
                        rtArry.push(data);
                    });
                    return rtArry;
                }

                break;
            case 'cdnr': // GSTR2
            case 'cdn': // GSTR2
            case 'cdnra': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.nt, function (nt) {
                            nt['ctin'] = list['ctin'];
                            if (list['cname'])
                                nt['cname'] = list['cname'];
                            if (list['cfs'])
                                nt['cfs'] = list['cfs'];

                            if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                nt['sp_typ'] = spLs[0];
                            } else {
                                nt['sp_typ'] = spLs[1];
                            }
                            rtArry.push(nt);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'cdnur': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list) {
                        if (typeof list.itms[0].itm_det.iamt == 'undefined') {
                            list['sp_typ'] = spLs[0];
                        } else {
                            list['sp_typ'] = spLs[1];
                        }
                        rtArry.push(list);
                    });
                    return rtArry;

                }
                break;
            case 'atadj': // GSTR2
            case 'txpd': // GSTR2
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        if (typeof inv.itms[0].iamt == 'undefined') {
                            inv['sply_ty'] = "INTRA";
                        } else {
                            inv['sply_ty'] = "INTER";
                        }
                        rtArry.push(inv);
                    });
                    return rtArry;
                }
                break;
            case 'nil': // GSTR2
            case 'itc_rvsl':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (data) {

                        rtArry.push(data);
                    });

                    return iResp;
                }
                break;

        }

    }
    return rtFn;
}

var formateNodePayload = function (iSec, iForm, shareData, isErrFormate) {

    var rtFn = null, rtData;
    if (iForm == "GSTR1") {
        switch (iSec) {
            case 'b2b':
            case 'b2ba':
            rtFn = function (oData) {
                    // console.log("oData",oData)
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    if (isErrFormate) {
                        rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.ctin;
                        delete iData.cname;
                        delete iData.error_msg;
                        delete iData.error_cd;
                        
                    }
                    else {
                        if (iData.cfs) {
                            var rtData = {
                                "ctin": iData.ctin,
                                "cfs": iData.cfs,
                                "cname": iData.cname,
                                "inv": []
                            }
                            
                        } else {

                            var rtData = {
                                "ctin": iData.ctin,
                                "cname": iData.cname,
                                "inv": []
                            }
                        }
                        delete iData.ctin;
                        delete iData.cname;
                    
                        if (iData.cfs) {
                            delete iData.cfs;
                        }

                    }
                    if (iData.supplierRecipientName == "" || iData.supplierRecipientName == null){
                        delete iData.supplierRecipientName;
                    }
                   
                    rtData.inv.push(iData);
                    return rtData;
                }
                break;
            case 'b2cl':
            case 'b2cla':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    if (isErrFormate) {
                        rtData = {
                            "pos": iData.pos,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.pos;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {
                        rtData = {
                            "pos": iData.pos,
                            "inv": []
                        }
                        delete iData.pos;

                    }
                    rtData.inv.push(iData);

                    return rtData;
                }
                break;

            case 'b2cs':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.etin == "" || iData.etin == null)
                        delete iData.etin;
                    if (iData.diff_percent == 1 || !iData.diff_percent)
                        delete iData.diff_percent;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'b2csa':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.etin == "" || iData.etin == null)
                        delete iData.etin;
                    if (iData.diff_percent == 1 || !iData.diff_percent)
                        delete iData.diff_percent;
                    delete iData.oyear;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'at':
            case 'atadj':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.diff_percent == 1 || !iData.diff_percent)
                        delete iData.diff_percent;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'ata':
            case 'atadja':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.diff_percent == 1 || !iData.diff_percent)
                        delete iData.diff_percent;
                    delete iData.oyear;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'exp':
            case 'expa':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;

                    if (isErrFormate) {

                        rtData = {
                            "exp_typ": iData.exp_typ,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.exp_typ;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {
                        rtData = {
                            "exp_typ": iData.exp_typ,

                            "inv": []
                        }
                        delete iData.exp_typ;
                    }

                    rtData.inv.push(iData);

                    return rtData;
                }
                break;
            case 'cdnr':
            case 'cdnra':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);

                    delete iData.sp_typ;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    if (isErrFormate) {
                        rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "nt": []
                        }
                        delete iData.ctin;
                        delete iData.cname;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {

                        if (iData.cfs) {
                            var rtData = {
                                "ctin": iData.ctin,
                                "cname": iData.cname,
                                "cfs": iData.cfs,
                                "nt": []
                            }
                        } else {
                            var rtData = {
                                "ctin": iData.ctin,
                                "cname": iData.cname,
                                "nt": []
                            }
                        }
                        delete iData.ctin;
                        delete iData.cname;
                        if (iData.cfs) {
                            delete iData.cfs;
                        }
                    }
                    if (iData.supplierRecipientName == "" || iData.supplierRecipientName == null){
                        delete iData.supplierRecipientName;
                    }
                    rtData.nt.push(iData);

                    return rtData;
                }
                break;
            case 'cdnur':
            case 'cdnura':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);

                    delete iData.sp_typ;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;

                    var rtData = {}

                    var rtData = iData;


                    return rtData;
                }
                break;
            case 'hsn':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.hsn_sc == "")
                        delete iData.hsn_sc;
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    iData.qty = Number(iData.qty);
                    var rtData = {
                        "data": []
                    }

                    rtData.data.push(iData);

                    return rtData;
                }
                break;
                  case 'hsn(b2b)':
                    var HSN_BIFURCATION_START_DATE = "052025";
                    var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                    if(showHSNTabs){
                    rtFn = function (oData) {
                        var iData = extend(true, {}, oData);
                        if (iData.hsn_sc == "")
                            delete iData.hsn_sc;
                        if (iData.select)
                            delete iData.select;
                        iData.qty = Number(iData.qty);
                        var rtData = {
                            "hsn_b2b": []
                        }
    
                        rtData.hsn_b2b.push(iData);
    
                        return rtData;
                    }
                    }
                    break; 
                    case 'hsn(b2c)':
                        var HSN_BIFURCATION_START_DATE = "052025";
                        var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                        if(showHSNTabs){
                        rtFn = function (oData) {
                            var iData = extend(true, {}, oData);
                            if (iData.hsn_sc == "")
                                delete iData.hsn_sc;
                            if (iData.select)
                                delete iData.select;
                            iData.qty = Number(iData.qty);
                            var rtData = {
                                "hsn_b2c": []
                            }
        
                            rtData.hsn_b2c.push(iData);
        
                            return rtData;
                        }
                    }
                        break; 
            case 'nil':
            case 'doc_issue':
                rtFn = function (oData) {

                    var iData = extend(true, {}, oData);
                    //added by prakash to remove 'select' property
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'supeco':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'supecoa':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'ecomb2b':
                rtFn = function (oData) {
               
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                  
                    if (iData.select)
                        delete iData.select;
                    if (isErrFormate) {
                        rtData = {
                            "stin": iData.stin,
                            "rtin": iData.rtin,
                           
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.stin;
                        delete iData.rtin;
                        delete iData.error_msg;
                        delete iData.error_cd;

                    }
                    else {
                        if (iData.cfs) {
                            var rtData = {
                                "stin": iData.stin,
                                "rtin": iData.rtin,
                                "cfs": iData.cfs,
                                "inv": []
                            }

                        } else {

                            var rtData = {
                                "stin": iData.stin,
                                "rtin": iData.rtin,
                                "inv": []
                            }
                        }
                        delete iData.stin;
                        delete iData.rtin;
                        
                        if (iData.cfs) {
                            delete iData.cfs;
                        }

                    }
               

                    rtData.inv.push(iData);
                    return rtData;
                }
                break;
            case 'ecomb2c':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.stin == "" || iData.stin == null)
                        delete iData.stin;
                 
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'ecomurp2b':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.old_val != "undefined")
                        delete iData.old_val;
                    if (iData.select)
                        delete iData.select;
                    if (isErrFormate) {
                        rtData = {
                            "rtin": iData.rtin,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.rtin;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {
                        rtData = {
                            "rtin": iData.rtin,
                            "inv": []
                        }
                        if (iData.sp_typ && iData.sp_typ.name == 'Inter-State') {
                            iData.sply_ty = "INTER"
                        }
                        else if (iData.sp_typ && iData.sp_typ.name == 'Intra-State') {
                            iData.sply_ty = "INTRA"
                        }
                        delete iData.rtin;
                        delete iData.sp_typ;

                    }
                    rtData.inv.push(iData);
                    return rtData;
                }
                break;
            case 'ecomurp2c':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.stin == "" || iData.stin == null)
                        delete iData.stin;
                  
                    
                    if (iData.select)
                        delete iData.select;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
           
                break;
            case 'ecomab2b':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.old_val != "undefined")
                        delete iData.old_val;
                    if (isErrFormate) {
                        rtData = {
                            "rtin": iData.rtin,
                            "stin": iData.stin,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.stin;
                        delete iData.rtin;
                        delete iData.error_msg;
                        delete iData.error_cd;
                        delete iData.frozenOrder;
                    }
                    else {
                        rtData = {
                            "stin": iData.stin,
                            "rtin": iData.rtin,
                            "inv": []
                        }
                        if (iData.sp_typ && iData.sp_typ.name == 'Inter-State') {
                            iData.sply_ty = "INTER"
                        }
                        else if (iData.sp_typ && iData.sp_typ.name == 'Intra-State') {
                            iData.sply_ty = "INTRA"
                        }
                        delete iData.stin;
                        delete iData.rtin;
                        delete iData.sp_typ;
                       
                    }

                    rtData.inv.push(iData);
                    return rtData;
                }
                break;
            case 'ecomab2c':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.old_val != "undefined")
                        delete iData.old_val;
                    if (isErrFormate) {
                        rtData = {
                            
                            "pos": iData.pos,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "posItms": []
                        }
                        delete iData.pos;
                        delete iData.error_msg;
                        delete iData.error_cd;
                        delete iData.frozenOrder;
                        
                    }
                    else {
                        rtData = {
                             "pos": iData.pos,
                            "posItms": []
                        }
                        if(iData.sp_typ && iData.sp_typ.name == 'Inter-State'){
                            iData.sply_ty = "INTER"
                        }
                        else if(iData.sp_typ && iData.sp_typ.name == 'Intra-State'){
                            iData.sply_ty = "INTRA"
                        }
                        delete iData.supplierRecipientName;
                        delete iData.pos;
                        delete iData.sp_typ;
                        
                       
                    }

                    rtData.posItms.push(iData);
                    return rtData;
                }
                break;
            case 'ecomaurp2b':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.old_val != "undefined")
                        delete iData.old_val;
                    if (iData.select)
                        delete iData.select;
                    if (isErrFormate) {
                        rtData = {
                            "rtin": iData.rtin,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            "inv": []
                        }
                        delete iData.rtin;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {
                        rtData = {
                            "rtin": iData.rtin,
                            "inv": []
                        }
                        if (iData.sp_typ && iData.sp_typ.name == 'Inter-State') {
                            iData.sply_ty = "INTER"
                        }
                        else if (iData.sp_typ && iData.sp_typ.name == 'Intra-State') {
                            iData.sply_ty = "INTRA"
                        }
                        delete iData.rtin;
                        delete iData.sp_typ;

                    }
                    rtData.inv.push(iData);
                    return rtData;
                }
                break;
            case 'ecomaurp2c':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.pos == "" || iData.pos == null)
                        delete iData.pos;


                    if (iData.select)
                        delete iData.select;
                    // delete iData.oyear
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
        }
    } else if (iForm == "GSTR2") {
        switch (iSec) {
            case 'b2b': // GSTR2
            case 'b2ba': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;


                    if (iData.cfs) {
                        var rtData = {
                            "ctin": iData.ctin,
                            "cfs": iData.cfs,
                            "cname": iData.cname,
                            "inv": []
                        }
                    } else {

                        var rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "inv": []
                        }
                    }

                    delete iData.ctin;
                    delete iData.cname;
                    if (iData.cfs) {
                        delete iData.cfs;
                    }
                    rtData.inv.push(iData);
                    return rtData;
                }
                break;
            case 'b2bur': // GSTR2
            case 'b2bura': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.sp_typ.name == 'Intra-State' || iData.sp_typ == 'Intra State') {
                        iData.sply_ty = "INTRA";
                    } else {
                        iData.sply_ty = "INTER";
                    }
                    delete iData.sp_typ;
                    var rtData = {
                        "inv": []
                    }
                    rtData.inv.push(iData);

                    return rtData;
                }
                break;


            case 'txi': // GSTR2
            case 'atxi': // GSTR2
            case 'atadj': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    var rtData = {};
                    if (iData.sply_ty == 'Intra State') {
                        iData.sply_ty = "INTRA";
                    } else {
                        iData.sply_ty = "INTER";
                    }
                    var rtData = iData;
                    return rtData;
                }
                break;
            case 'imp_g': // GSTR2
            case 'imp_ga': // GSTR2
            case 'imp_s': // GSTR2
            case 'imp_sa': // GSTR2
            case 'itc_rvsl': // GSTR2

                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                    return iData;
                }
                break;
            case 'hsnsum': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    if (iData.hsn_sc == "")
                        delete iData.hsn_sc;
                    iData.qty = Number(iData.qty);
                    var rtData = {
                        "det": []
                    }

                    rtData.det.push(iData);

                    return rtData;
                }
                break;
            case 'cdnr': // GSTR2
            case 'cdnra': // GSTR2
            case 'cdn': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);

                    delete iData.sp_typ;
                    if (iData.cfs) {
                        var rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "cfs": iData.cfs,
                            "nt": []
                        }
                    } else {
                        var rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "nt": []
                        }
                    }

                    delete iData.ctin;
                    delete iData.cname;
                    if (iData.cfs) {
                        delete iData.cfs;
                    }
                    rtData.nt.push(iData);

                    return rtData;
                }
                break;
            case 'cdnur': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                    var rtData = {}
                    var rtData = iData;
                    return rtData;
                }
                break;
            case 'nil': // GSTR2
            case 'nil_supplies': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);

                    return iData;
                }
                break;
        }
    }
  
    return rtFn;
}



var getExcelTitle = function (iSec, iForm, shareData) {
    var title = null;
    if (iForm == "GSTR1") {
        switch (iSec) {
            case 'b2b':
            case 'b2cl':
            case 'exp':
                title = "Invoice Number"
                break;
            case 'cdnr':
            case 'cdnur':
                title = trans.LBL_DEBIT_CREDIT_NOTE_NO
                break;
            case 'cdnra':
            case 'cdnura':
                title = trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO
                break;
            case 'b2ba':

                title = "Revised Invoice Number"
                break;
            case 'b2cla':
            case 'expa':
                title = 'Revised Invoice Number'
                break;
            case 'b2csa':
            case 'b2cs':
                title = 'Place Of Supply'
                break;
            case 'at':
            case 'atadj':
                title = "Place Of Supply"
                break;
            case 'ata':
            case 'atadja':
                title = "Original Place Of Supply"
                break;
            case 'hsn':
                title = "HSN"
                break;
            case 'hsn(b2b)':
                title = "HSN(B2B)"
                break;
            case 'hsn(b2c)':
                title = "HSN(B2C)"
                break;    
            case 'nil':
                title = "Description"
                break;
            case 'doc_issue':
                title = "Nature of Document"
                break;
            case 'supeco':
            case 'supecoa':
                        title = "Nature of Supply"
                        break;
            case 'ecomb2b':
            case 'ecomurp2b':
                        title = "Document Number"
                        break;
            case 'ecomb2c':
            case 'ecomab2c':
            case 'ecomurp2c':
            case 'ecomaurp2c':
                        title = "Place Of Supply"
                        break;
            case 'ecomaurp2b':
                        title = "Revised Document Number"
                        break;

        }
    } else if (iForm == "GSTR2") {
        switch (iSec) {
            case 'b2b': // GSTR2
            case 'cdnra': // GSTR2
            case 'b2bur': // GSTR2
                title = "Invoice Number"
                break;
            case 'imp_s': // GSTR2
                title = "Invoice Number of Reg Recipient";
                break;
            case 'cdnr': // GSTR2
                title = "Note/Refund Voucher Number"
                break;
            case 'cdnur': // GSTR2
                title = "Note/Voucher Number"
                break;
            case 'b2ba': // GSTR2
            case 'b2bura': // GSTR2
            case 'imp_sa': // GSTR2
                title = "Revised Invoice Number"
                break;
            case 'imp_g': // GSTR2
                title = "Bill Of Entry Number"
                break;
            case 'imp_ga': // GSTR2
                title = "Revised Bill Of Entry Number"
                break;
            case 'hsnsum': // GSTR2
                title = "HSN/SAC of Supply"
                break;
            case 'txi':
            case 'atadj':
                title = "Place Of Supply"
                break;
            case 'atxi': // GSTR2
                title = "Revised Document Number"
                break;
            case 'nil': // GSTR2
                title = "Description"
                break;

        }
    }
    return title;
}



var getInvKey = function (isec, iForm, shareData) {
    var invKey = null;
    if (iForm == "GSTR1") {
        switch (isec) {
            case 'b2b':
            case 'b2ba':
            case 'b2cl':
            case 'b2cla':
            case 'exp':
            case 'expa':
                invKey = "inum"
                break;
            case 'cdnr':
            case 'cdnra':
            case 'cdnur':
            case 'cdnura':
                invKey = "nt_num"
                break;
            case 'at':
            case 'ata':
            case 'atadj':
            case 'atadja':
                invKey = "pos"
                break;
            case 'b2csa':
            case 'b2cs':
                invKey = "pos"
                break;
            case 'hsn':
            case  'hsn(b2b)':
            case 'hsn(b2c)':
                invKey = "hsn_sc";
                break;
            case 'nil':
                invKey = "sply_ty";
                break;
            case 'doc_issue':
                invKey = "doc_typ";
                break;
                case 'ecomb2b':
                    case 'ecomab2b':
                    case 'ecomurp2b':
                    case 'ecomaurp2b':
                        invKey = "inum";
                        break;
                    //case 'ecomab2c':
                    //case 'ecomaurp2c':
                        //invKey = "pos";
                      // break;

        }
    } else if (iForm == "GSTR2") {
        switch (isec) {
            case 'b2b': // GSTR2
            case 'b2ba': // GSTR2
            case 'b2bur': // GSTR2
            case 'b2bura': // GSTR2
                invKey = "inum"
                break;
            case 'cdnr': // GSTR2
            case 'cdnra': // GSTR2
            case 'cdnur': // GSTR2
                invKey = "nt_num"
                break;
            case 'imp_g': // GSTR2
            case 'imp_ga': // GSTR2
                invKey = "boe_num"
                break;
            case 'imp_s':
                invKey = "inum";// GSTR2
                break;
            case 'imp_sa': // GSTR2
                invKey = "i_num"
                break;
            case 'txi':
            case 'atxi':
            case 'atadj':
                invKey = "pos"
                break;
            case 'hsnsum': // GSTR2
                invKey = "hsn_sc"
                break;
            case 'itc_rvsl': // GSTR2
                invKey = "inv_doc_num"
                break;
            case 'nil': // GSTR2
                invKey = "sply_ty";
                break;


        }
    }
    return invKey;
}
//To check for POS in case of UR Type 'EXPWP' and 'EXPWOP' CDNUR/RA
function validatePOSwithURType(iInv, trans) {
    if ((iInv[trans.LBL_UR_TYPE] == "EXPWOP") || (iInv[trans.LBL_UR_TYPE] == "EXPWP")) {
        return (!iInv[trans.LBL_POS_Excel]) ? true : false;
    }

}
//To check for Diff % in case of UR Type 'EXPWP' and 'EXPWOP' CDNUR/RA
function validateDiffPerwithURType(iInv, trans) {
    if ((iInv[trans.LBL_UR_TYPE] == "EXPWOP") || (iInv[trans.LBL_UR_TYPE] == "EXPWP")) {
        return (!iInv[trans.LBL_Diff_Percentage] || iInv[trans.LBL_Diff_Percentage] == 100.00) ? true : false;
    }

}
//To check if supplier state code and POS are same
function validatePOSWithSupStCode(iInv, trans, supplier_gstin) {
    let supStCode = supplier_gstin.substring(0, 2); // get supplier state code from supplier gstin
    if ((iInv[trans.LBL_UR_TYPE] !== "EXPWOP") && (iInv[trans.LBL_UR_TYPE] !== "EXPWP")) {
        if ((iInv[trans.LBL_POS_Excel] != null) || (iInv[trans.LBL_POS_Excel] != undefined)) {
            return ((iInv[trans.LBL_POS_Excel].substring(0, 2)) !== supStCode) ? true : false;
        }
    }
    else {
        return true;
    }
}
//To check all negative or all positive for Supeco and Supecoa
function validateAllNegorAllPosPattern(suppval, igst, cgst, sgst, cess) {
    var isValid = true;
        if(suppval > 0 && (igst < 0 || cgst < 0 || sgst < 0 || cess < 0)){
            //$scope.createAlert("Error", "Error! Tax value should be either positive or negative as per the net value of supplies.", function(){});
            isValid = false;
        } else if (suppval < 0 && (igst > 0 || cgst > 0 || sgst > 0 || cess > 0)){
            isValid = false;
        } else if (!validateCgstSgstEqual(cgst,sgst)){
            isValid = false;
        }
      
    return isValid;
}

function validateCgstSgstEqual(cgst,sgst) {
    var isValid = true;
        if ( cgst != sgst){
            isValid = false;
        }
    return isValid;
}
//To check if note supply type is valid
function validateNoteSupplyType(iInv, trans, iSecId) {
    let evaluateType;
    if (iSecId == 'cdnr' || iSecId == 'cdnra')
        evaluateType = getNoteSupplyType(iSecId, iInv[trans.LBL_NT_SPLY_TY]);
    else if (iSecId == 'ecomb2b' || iSecId == 'ecomurp2b' || iSecId == 'ecomab2b' || iSecId == 'ecomaurp2b')
        evaluateType = getInvType(iSecId, iInv[trans.LBL_DOC_TYP]);
    else
        evaluateType = getInvType(iSecId, iInv[trans.LBL_INVOICE_TYPE]);

    if (evaluateType == "CBW")
        return (iInv[trans.LBL_RECHRG] == "Y") ? true : false;
    else if (evaluateType == "DE")
        return (iInv[trans.LBL_RECHRG] == "Y") ? false : true;
    else
        return true;
}
//To check mandatory fields n regex patterns for fields from excel
function validateExcelMandatoryFields(iInv, iSecId, iForm, supplier_gstin, myRegExObj) {
    var isPttnMthced = false;
    if (iForm == "GSTR1") {
        switch (iSecId) {
            case 'b2b':
                var isInvTypeValid = validateNoteSupplyType(iInv, trans, iSecId);
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100;
                }
                if (iInv['Invoice Type'] != 'Regular B2B' && (iInv['E-Commerce GSTIN'])) {
                    isPttnMthced = false;
                } else {
                    isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Invoice date']) &&
                        validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Invoice Type'], true, null) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                        validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                        validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                        (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        isInvTypeValid
                    );
                }
                break;
            case 'b2ba':
                var isInvTypeValid = validateNoteSupplyType(iInv, trans, iSecId);
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                    validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                    validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                    ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                    validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Revised Invoice date'], true, null) &&
                    validatePattern(iInv['Original Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Revised Invoice date']) &&
                    isValidDateFormat(iInv['Original Invoice date']) &&
                    validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Invoice Type'], true, null) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                    (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/) &&
                    isInvTypeValid
                );
                break;
            case 'b2cl':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Invoice date']) &&
                    validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    //isValidTotalInvValue(iInv['Invoice Value']) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                    (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                );
                break;
            case 'b2cla':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                    ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                    validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Revised Invoice date'], true, null) &&

                    validatePattern(iInv['Original Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice date']) &&
                    isValidDateFormat(iInv['Revised Invoice date']) &&
                    validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    //isValidTotalInvValue(iInv['Invoice Value']) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                );
                break;
            case 'b2cs':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                var isRequired = (iInv['Type'] && iInv['Type'] == "E") ? true : false,
                    isERecord = false;

                if (isRequired) {
                    isERecord = validatePattern(iInv['E-Commerce GSTIN'], isRequired, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/);

                }
                else {

                    if (!(iInv['E-Commerce GSTIN'])) {
                        isERecord = true;
                    }
                }

                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Type'], true, /^(OE)$/) && isERecord &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                );

                break;
            case 'b2csa':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                var isRequired = (iInv['Type'] && iInv['Type'] == "E") ? true : false,
                    isERecord = false;

                if (isRequired) {
                    isERecord = validatePattern(iInv['E-Commerce GSTIN'], isRequired, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/);

                }
                else {

                    if (!(iInv['E-Commerce GSTIN'])) {
                        isERecord = true;
                    }
                }

                isPttnMthced = (
                    validatePattern(iInv['Financial Year'], true, yearPattern) &&
                    validatePattern(iInv['Original Month'], true, monthPattern) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Type'], true, /^(OE)$/) &&
                    isERecord &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                );
                break;
            case 'cdnr':
                var isNtsplyValid = validateNoteSupplyType(iInv, trans, iSecId);
                if (!iInv[trans.LBL_Diff_Percentage]) {
                    iInv[trans.LBL_Diff_Percentage] = 100.00;
                }
                if (!iInv[trans.LBL_Cess_Amount]) {
                    iInv[trans.LBL_Cess_Amount] = 0;
                }
                isPttnMthced = (
                    isValidDateFormat(iInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE]) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Taxable_Value]), true, myRegExObj.taxableVal) &&
                    validatePattern(iInv[trans.LBL_NOTE_TYP], true, myRegExObj.noteType) &&
                    validateGSTIN(iInv[trans.LBL_GSTIN_UIN_RECIPIENT], iForm) &&
                    validatePattern(iInv[trans.LBL_GSTIN_UIN_RECIPIENT], true, null) &&
                    validatePattern(iInv[trans.LBL_RECEIVER_NAME], false, myRegExObj.tName) &&
                    ((Number(iInv[trans.LBL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_DEBIT_CREDIT_NOTE_NO], true, myRegExObj.InvNoteNumber) &&
                    validatePattern(iInv[trans.LBL_Diff_Percentage], true, myRegExObj.diffPercentage) &&
                    validatePattern(iInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                    validatePattern(iInv[trans.LBL_POS_Excel], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_NOTE_VAL_Excel]), true, myRegExObj.InvNoteValue) &&
                    ((Number(iInv[trans.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Taxable_Value]) > 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Cess_Amount]) >= 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_Rate], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Cess_Amount]), false, myRegExObj.cessAmount) &&
                    validatePattern(iInv[trans.LBL_RECHRG], true, myRegExObj.reverseChrge) &&
                    validatePattern(iInv[trans.LBL_NT_SPLY_TY], true, null) &&
                    isNtsplyValid
                );
                break;
            case 'cdnur':
                if (!iInv[trans.LBL_Diff_Percentage]) {
                    iInv[trans.LBL_Diff_Percentage] = 100.00;
                }
                if (!iInv[trans.LBL_Cess_Amount]) {
                    iInv[trans.LBL_Cess_Amount] = 0;
                }
                var isRequired = false;
                var isValidPosStCd = validatePOSWithSupStCode(iInv, trans, supplier_gstin);
                if ((iInv[trans.LBL_UR_TYPE] == "EXPWOP") || (iInv[trans.LBL_UR_TYPE] == "EXPWP")) {
                    if (!iInv[trans.LBL_POS_Excel] && iInv[trans.LBL_Diff_Percentage] == 100.00)
                        isRequired = true;
                } else {
                    isRequired = validatePattern(iInv[trans.LBL_POS_Excel], true, null, true)
                }
                isPttnMthced = (
                    isValidDateFormat(iInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE]) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Taxable_Value]), true, myRegExObj.taxableVal) &&
                    validatePattern(iInv[trans.LBL_NOTE_TYP], true, myRegExObj.noteType) &&
                    validatePattern(iInv[trans.LBL_DEBIT_CREDIT_NOTE_NO], true, myRegExObj.InvNoteNumber) &&
                    ((Number(iInv[trans.LBL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_Diff_Percentage], true, myRegExObj.diffPercentage) &&
                    validatePattern(iInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_NOTE_VAL_Excel]), true, myRegExObj.InvNoteValue) &&
                    ((Number(iInv[trans.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Taxable_Value]) > 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Cess_Amount]) >= 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_UR_TYPE], true, myRegExObj.urType) &&
                    isRequired &&
                    validatePattern(iInv[trans.LBL_Rate], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Cess_Amount]), false, myRegExObj.cessAmount) &&
                    isValidPosStCd
                );
                break;
            case 'cdnra':
                var isNtsplyValid = validateNoteSupplyType(iInv, trans, iSecId);
                if (!iInv[trans.LBL_Diff_Percentage]) {
                    iInv[trans.LBL_Diff_Percentage] = 100.00;
                }
                if (!iInv[trans.LBL_Cess_Amount]) {
                    iInv[trans.LBL_Cess_Amount] = 0;
                }
                isPttnMthced = (
                    isValidDateFormat(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]) &&
                    isValidDateFormat(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Taxable_Value]), true, myRegExObj.taxableVal) &&
                    validatePattern(iInv[trans.LBL_NOTE_TYP], true, myRegExObj.noteType) &&
                    validateGSTIN(iInv[trans.LBL_GSTIN_UIN_RECIPIENT], iForm) &&
                    validatePattern(iInv[trans.LBL_Diff_Percentage], true, myRegExObj.diffPercentage) &&
                    validatePattern(iInv[trans.LBL_GSTIN_UIN_RECIPIENT], true, null) &&
                    ((Number(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO], true, myRegExObj.InvNoteNumber) &&
                    validatePattern(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                    validatePattern(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO], true, myRegExObj.InvNoteNumber) &&
                    validatePattern(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                    validatePattern(iInv[trans.LBL_POS_Excel], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_NOTE_VAL_Excel]), true, myRegExObj.InvNoteValue) &&
                    ((Number(iInv[trans.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Taxable_Value]) > 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Cess_Amount]) >= 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_Rate], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Cess_Amount]), false, myRegExObj.cessAmount) &&
                    validatePattern(iInv[trans.LBL_RECHRG], true, myRegExObj.reverseChrge) &&
                    validatePattern(iInv[trans.LBL_NT_SPLY_TY], true, null) &&
                    isNtsplyValid
                );
                break;
            case 'cdnura':
                if (!iInv[trans.LBL_Diff_Percentage]) {
                    iInv[trans.LBL_Diff_Percentage] = 100.00;
                }
                if (!iInv[trans.LBL_Cess_Amount]) {
                    iInv[trans.LBL_Cess_Amount] = 0;
                }
                var isRequired = false;
                var isValidPosStCd = validatePOSWithSupStCode(iInv, trans, supplier_gstin);
                if ((iInv[trans.LBL_UR_TYPE] == "EXPWOP") || (iInv[trans.LBL_UR_TYPE] == "EXPWP")) {
                    if (!iInv[trans.LBL_POS_Excel] && iInv[trans.LBL_Diff_Percentage] == 100.00)
                        isRequired = true;
                } else {
                    isRequired = validatePattern(iInv[trans.LBL_POS_Excel], true, null, true)
                }
                isPttnMthced = (
                    isValidDateFormat(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]) &&
                    isValidDateFormat(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Taxable_Value]), true, myRegExObj.taxableVal) &&
                    validatePattern(iInv[trans.LBL_NOTE_TYP], true, myRegExObj.noteType) &&
                    ((Number(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO]) != 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO], true, myRegExObj.InvNoteNumber) &&
                    validatePattern(iInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                    validatePattern(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO], true, myRegExObj.InvNoteNumber) &&
                    validatePattern(iInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], true, null) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_NOTE_VAL_Excel]), true, myRegExObj.InvNoteValue) &&
                    ((Number(iInv[trans.LBL_NOTE_VAL_Excel]) >= 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Taxable_Value]) > 0) ? true : false) &&
                    ((Number(iInv[trans.LBL_Cess_Amount]) >= 0) ? true : false) &&
                    validatePattern(iInv[trans.LBL_Diff_Percentage], true, myRegExObj.diffPercentage) &&
                    validatePattern(iInv[trans.LBL_UR_TYPE], true, myRegExObj.urType) &&
                    isRequired &&
                    validatePattern(iInv[trans.LBL_Rate], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv[trans.LBL_Cess_Amount]), false, myRegExObj.cessAmount) &&
                    isValidPosStCd
                );
                break;
            case 'exp':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (iInv['Shipping Bill Number'] || iInv['Shipping Bill Date']) {
                    isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Invoice date']) &&
                        validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], true, /^[0-9]{3,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], true, null) &&
                        isValidDateFormat(iInv['Shipping Bill Date']) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                        validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates)
                    );
                }
                else {
                    isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Invoice date']) &&
                        validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], false, /^[0-9]{3,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], false, null) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                        validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Invoice Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates)
                    );
                }

                break;
            case 'expa':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (iInv['Shipping Bill Number'] || iInv['Shipping Bill Date']) {
                    isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Original Invoice date']) &&
                        validatePattern(iInv['Revised Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Revised Invoice date']) &&
                        validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], true, /^[0-9]{3,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], true, null) &&
                        isValidDateFormat(iInv['Shipping Bill Date']) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                        validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                        ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates)
                    );
                }
                else {
                    isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Original Invoice date']) &&
                        validatePattern(iInv['Revised Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Revised Invoice date']) &&
                        validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], false, /^[0-9]{3,7}$/) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Shipping Bill Date'], false, null) &&
                        validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]{1,6}$/) &&
                        validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Original Invoice Number']) != 0) ? true : false) &&
                        ((Number(iInv['Revised Invoice Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates)
                    );
                }
                break;
            case 'at':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (!iInv['Cess Amount']) {
                    iInv['Cess Amount'] = 0;
                }
                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv['Gross Advance Received']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    ((Number(iInv['Gross Advance Received']) != 0) ? true : false) &&
                    ((((Number(iInv['Gross Advance Received']) < 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) < 0))) ? true : false) ||
                        (((Number(iInv['Gross Advance Received']) > 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) > 0))) ? true : false)) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                );
                break;
            case 'ata':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (!iInv['Cess Amount']) {
                    iInv['Cess Amount'] = 0;
                }
                isPttnMthced = (
                    validatePattern(iInv['Financial Year'], true, yearPattern) &&
                    validatePattern(iInv['Original Month'], true, monthPattern) &&
                    validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Received'], true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    ((Number(iInv['Gross Advance Received']) != 0) ? true : false) &&
                    ((((Number(iInv['Gross Advance Received']) < 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) < 0))) ? true : false) ||
                        (((Number(iInv['Gross Advance Received']) > 0) && ((Number(iInv['Cess Amount']) == 0) || (Number(iInv['Cess Amount']) > 0))) ? true : false)) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                );
                break;
            case 'atadj':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv['Gross Advance Adjusted']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                );
                break;
            case 'atadja':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Financial Year'], true, yearPattern) &&
                    validatePattern(iInv['Original Month'], true, monthPattern) &&
                    validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Adjusted'], true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,11})(\.\d{0,2})?$/)
                );
                break;
            case 'hsn':
                var descRegexPattern = new RegExp("^[ A-Za-z0-9_@./&-]{0,30}$", "gi");
                var hsnRegexPattern = new RegExp("^[0-9]{2,8}$", "gi");
                var isHSNReq = true, isDescrReq = true;
                var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                var isTotatlValueReqd = true, isRateReqd = false;

                if (iInv['Integrated Tax Amount']) {
                    isSTUTAmt = false; isCTAmt = false;

                } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                    isITAmt = false;
                }
                if (iInv['HSN']) {
                    isDescrReq = false;
                }
                else if (iInv['Description']) {
                    isHSNReq = false;
                }

                if (iInv['UQC'] && iInv['UQC'] != "NA")
                    iInv['UQC'] = (iInv['UQC']).trim()

                if (!isCurrentPeriodBeforeAATOCheck(newHSNStartDateConstant, thisShareData.monthSelected.value)) {
                    isHSNReq = true;
                    isDescrReq = true;
                    descRegexPattern = new RegExp("^[^]{1,}$", "gi");
                    hsnRegexPattern = new RegExp("^[0-9]{2,8}$", "gi");
                    isTotatlValueReqd = false;
                    isRateReqd = true;
                    if (thisShareData.disableHSNRestrictions) {
                        isDescrReq = false;
                    }
                    if (thisShareData.disableAATOLengthCheck) {
                        hsnRegexPattern = new RegExp("^[0-9]{4,8}$", "gi");
                    }
                    else {
                        if (thisShareData.aatoGreaterThan5CR) {
                            hsnRegexPattern = new RegExp("^[0-9]{6,8}$", "gi");
                        }

                        else {
                            hsnRegexPattern = new RegExp("^[0-9]{4,8}$", "gi");
                        }
                    }

                    isPttnMthced = (
                        validatePattern(iInv['HSN'], isHSNReq, hsnRegexPattern) &&
                        validatePattern(iInv['Description'], isDescrReq, descRegexPattern) &&
                        validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                        validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) && // &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                        validatePattern(iInv['Rate'], isRateReqd, /^(0|0.1|0.25|1|1.5|3|5|6|7.5|12|18|28|40)$/) && //RateValidationInReturn
                        validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)

                    );
                }
                else {
                    isPttnMthced = (
                        validatePattern(iInv['HSN'], isHSNReq, hsnRegexPattern) &&
                        validatePattern(iInv['Description'], isDescrReq, descRegexPattern) &&
                        validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                        validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,15})(\.\d{0,2})?)$/) && // &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Total Value'])), isTotatlValueReqd, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)

                    );
                }
                break;
               case 'hsn(b2b)':  
               var HSN_BIFURCATION_START_DATE = "052025";
                var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                if(showHSNTabs){
                    var descRegexPattern = new RegExp("^[ A-Za-z0-9_@./&-]{0,30}$", "gi");
                    var hsnRegexPattern = new RegExp("^[0-9]{2,8}$", "gi");
                    var isHSNReq = true, isDescrReq = true;
                    var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                    var isTotatlValueReqd = true, isRateReqd = false;
    
                    if (iInv['Integrated Tax Amount']) {
                        isSTUTAmt = false; isCTAmt = false;
    
                    } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                        isITAmt = false;
                    }
                    if (iInv['HSN']) {
                        isDescrReq = false;
                    }
                    else if (iInv['Description as per HSN Code']) {
                        isHSNReq = false;
                    }
    
                    if (iInv['UQC'] && iInv['UQC'] != "NA")
                        iInv['UQC'] = (iInv['UQC']).trim()
                        isHSNReq = true;
                        isDescrReq = true;
                        descRegexPattern = new RegExp("^[^]{1,}$", "gi");
                        hsnRegexPattern = new RegExp("^[0-9]{2,8}$", "gi");
                        isTotatlValueReqd = false;
                        isRateReqd = true;
                        if (thisShareData.disableHSNRestrictions) {
                            isDescrReq = false;
                        }
                        if (thisShareData.disableAATOLengthCheck) {
                            hsnRegexPattern = new RegExp("^[0-9]{4,8}$", "gi");
                        }
                        else {
                            if (thisShareData.aatoGreaterThan5CR) {
                                hsnRegexPattern = new RegExp("^[0-9]{6,8}$", "gi");
                            }
    
                            else {
                                hsnRegexPattern = new RegExp("^[0-9]{4,8}$", "gi");
                            }
                        }
                       
                        iInv['Description as per HSN Code'] =  hsnDescForOfflineTool(iInv['HSN']);
                        if(iInv['Description as per HSN Code'] == null || iInv['Description as per HSN Code'] == ""){
                            iInv['HSN'] = "";
                        }
                                    
                               
                        isPttnMthced = (
                            validatePattern(iInv['HSN'], isHSNReq, hsnRegexPattern) &&
                            validatePattern(iInv['Description as per HSN Code'], isDescrReq, descRegexPattern) &&
                            validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                            validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) && // &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(iInv['Rate'], isRateReqd, /^(0|0.1|0.25|1|1.5|3|5|6|7.5|12|18|28|40)$/) && //RateValidationInReturn
                            validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)
    
                        );
               }
                    break;
                    case 'hsn(b2c)':    
                    var HSN_BIFURCATION_START_DATE = "052025";
                     var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                    if(showHSNTabs){
                    var descRegexPattern = new RegExp("^[ A-Za-z0-9_@./&-]{0,30}$", "gi");
                    var hsnRegexPattern = new RegExp("^[0-9]{2,8}$", "gi");
                    var isHSNReq = true, isDescrReq = true;
                    var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                    var isTotatlValueReqd = true, isRateReqd = false;
    
                    if (iInv['Integrated Tax Amount']) {
                        isSTUTAmt = false; isCTAmt = false;
    
                    } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                        isITAmt = false;
                    }
                    if (iInv['HSN']) {
                        isDescrReq = false;
                    }
                    else if (iInv['Description as per HSN Code']) {
                        isHSNReq = false;
                    }
    
                    if (iInv['UQC'] && iInv['UQC'] != "NA")
                        iInv['UQC'] = (iInv['UQC']).trim()
                        isHSNReq = true;
                        isDescrReq = true;
                        descRegexPattern = new RegExp("^[^]{1,}$", "gi");
                        hsnRegexPattern = new RegExp("^[0-9]{2,8}$", "gi");
                        isTotatlValueReqd = false;
                        isRateReqd = true;
                        if (thisShareData.disableHSNRestrictions) {
                            isDescrReq = false;
                        }
                        if (thisShareData.disableAATOLengthCheck) {
                            hsnRegexPattern = new RegExp("^[0-9]{4,8}$", "gi");
                        }
                        else {
                            if (thisShareData.aatoGreaterThan5CR) {
                                hsnRegexPattern = new RegExp("^[0-9]{6,8}$", "gi");
                            }
    
                            else {
                                hsnRegexPattern = new RegExp("^[0-9]{4,8}$", "gi");
                            }
                        }
                        iInv['Description as per HSN Code'] =  hsnDescForOfflineTool(iInv['HSN']);
                        if(iInv['Description as per HSN Code'] == null || iInv['Description as per HSN Code'] == ""){
                            iInv['HSN'] = "";
                        }
                             
                        isPttnMthced = (
                            validatePattern(iInv['HSN'], isHSNReq, hsnRegexPattern) &&
                            validatePattern(iInv['Description as per HSN Code'], isDescrReq, descRegexPattern) &&
                            validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                            validatePattern(cnvt2Nm(iInv['Total Quantity']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) && // &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(iInv['Rate'], isRateReqd, /^(0|0.1|0.25|1|1.5|3|5|6|7.5|12|18|28|40)$/) && //RateValidationInReturn
                            validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                            validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)
    
                        );
                    }
                    break;
            case 'nil':
                isPttnMthced = (
                    validatePattern(cnvt2Nm(iInv['Nil Rated Supplies']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    validatePattern(cnvt2Nm(iInv['Exempted(other than nil rated/non GST supply)']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    validatePattern(cnvt2Nm(iInv['Non-GST Supplies']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    (
                        iInv['Description'] == 'Inter-State supplies to registered persons' ||
                        iInv['Description'] == 'Intra-State supplies to registered persons' ||
                        iInv['Description'] == 'Inter-State supplies to unregistered persons' ||
                        iInv['Description'] == 'Intra-State supplies to unregistered persons'
                    )
                );
                break;
            case 'doc_issue':
                isPttnMthced = (validatePattern(iInv['Sr. No. From'], true, /^(?=.{1,16}$)([/\-0]*[a-zA-Z0-9/\-]*[a-zA-Z1-9]+[a-zA-Z0-9/\-]*)$/) &&
                    validatePattern(iInv['Sr. No. To'], true, /^(?=.{1,16}$)([/\-0]*[a-zA-Z0-9/\-]*[a-zA-Z1-9]+[a-zA-Z0-9/\-]*)$/) &&
                    validatePattern(iInv['Total Number'], true, /^(\d*)$/) &&
                    validatePattern(iInv['Cancelled'], true, /^(\d*)$/) &&
                    (cnvt2Nm(iInv['Total Number']) >= cnvt2Nm(iInv['Cancelled'])) &&
                    validatePattern(iInv['Nature of Document'], true, /^(Invoices for outward supply|Invoices for inward supply from unregistered person|Revised Invoice|Debit Note|Credit Note|Receipt Voucher|Payment Voucher|Refund Voucher|Delivery Challan for job work|Delivery Challan for supply on approval|Delivery Challan in case of liquid gas|Delivery Challan in case other than by way of supply \(excluding at S no. 9 to 11\))$/));
                break;
            case 'supeco':
                if (!iInv['Cess']) {
                    iInv['Cess'] = 0.00;
                }
                var paytx, clttx = false;
                suppval = cnvt2Nm(iInv['Net value of supplies']);
                        igst = cnvt2Nm(iInv['Integrated tax']);
                        cgst = cnvt2Nm(iInv['Central tax']);
                        sgst = cnvt2Nm(iInv['State/UT tax']);
                        cess = cnvt2Nm(iInv['Cess']);
                if (iInv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)') {
                    clttx = validateGSTIN(iInv['GSTIN of E-Commerce Operator'], iForm) && 
                	validatePattern(iInv['GSTIN of E-Commerce Operator'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/)
                }
                if (iInv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)') {
                    paytx = validateGSTIN(iInv['GSTIN of E-Commerce Operator'], iForm) && validatePattern(iInv['GSTIN of E-Commerce Operator'], true, null)
                }

                isPttnMthced =
                    (
                        (clttx || paytx) &&
                        validatePattern(suppval, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                 	validatePattern(igst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                  	validatePattern(cgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                   	validatePattern(sgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    validatePattern(cess, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                    validateAllNegorAllPosPattern(suppval, igst, cgst, sgst, cess)
                    );
                break;
            case 'supecoa':
                var paytxa, clttxa = false;

                if (iInv['Nature of Supply'] == "Liable to collect tax u/s 52(TCS)") {
                    clttxa =
                        (
                            validateGSTIN(iInv['Revised GSTIN of E-Commerce Operator'], iForm) &&
                            validatePattern(iInv['Revised GSTIN of E-Commerce Operator'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/) && 
                    validateGSTIN(iInv['Original GSTIN of E-Commerce Operator'], iForm) &&
                            validatePattern(iInv['Original GSTIN of E-Commerce Operator'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[cC]{1}[0-9a-zA-Z]{1}/))
                }
                if (iInv['Nature of Supply'] == "Liable to pay tax u/s 9(5)") {
                    paytxa =
                        (validateGSTIN(iInv['Revised GSTIN of E-Commerce Operator'], iForm) &&
                            validatePattern(iInv['Revised GSTIN of E-Commerce Operator'], true, null) &&
                            validateGSTIN(iInv['Original GSTIN of E-Commerce Operator'], iForm) &&
                            validatePattern(iInv['Original GSTIN of E-Commerce Operator'], true, null))
                }

                suppval = cnvt2Nm(iInv['Revised Net value of supplies']);
                        igst = cnvt2Nm(iInv['Integrated tax']);
                        cgst = cnvt2Nm(iInv['Central tax']);
                        sgst = cnvt2Nm(iInv['State/UT tax']);
                        cess = cnvt2Nm(iInv['Cess']);
                
                isPttnMthced =
                    (
                        (clttxa || paytxa) &&
                        validatePattern(iInv['Financial Year'], true, yearPattern) &&
                        validatePattern(iInv['Original Month/Quarter'], true, monthPattern) &&
                        validatePattern(suppval, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(igst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(cgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(sgst, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(cess, true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validateAllNegorAllPosPattern(suppval, igst, cgst, sgst, cess)
                    );
                break;
            case 'ecomb2b':
                isPttnMthced =
                    (
                        validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Document Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Document Date'], true, null) &&
                        isValidDateFormat(iInv['Document Date']) &&
                        validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Document type'], true, null) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)

                    );
                break;
            case 'ecomb2c':
                isPttnMthced =
                    (
                        validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                    );
                break;
            case 'ecomurp2b':
                isPttnMthced =
                    (
                        validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Document Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Document Date'], true, null) &&
                        isValidDateFormat(iInv['Document Date']) &&
                        validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Document type'], true, null) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&

                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)

                    );
                break;
            case 'ecomurp2c':
                isPttnMthced =
                    (
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                    );
                break;
            case 'ecomab2b':
                isPttnMthced =
                    (
                        validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Original Document Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Original Document Date'], true, null) &&
                        isValidDateFormat(iInv['Original Document Date']) &&
                        validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Revised Document Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Revised Document Date'], true, null) &&
                        isValidDateFormat(iInv['Revised Document Date']) &&
                        validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Document type'], true, null) &&
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&


                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)

                    );
                break;

            case 'ecomab2c':
                isPttnMthced =
                    (
                        validatePattern(iInv['Financial Year'], true, yearPattern) &&
                        validatePattern(iInv['Original Month'], true, monthPattern) &&
                        validateGSTIN(iInv['Supplier GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Supplier GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                    );
                break;

            case 'ecomaurp2b':
                isPttnMthced =
                    (
                        validateGSTIN(iInv['Recipient GSTIN/UIN'], iForm) &&
                        validatePattern(iInv['Recipient GSTIN/UIN'], true, null) &&
                        validatePattern(iInv['Recipient Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Original Document Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Original Document Date'], true, null) &&
                        isValidDateFormat(iInv['Original Document Date']) &&
                        validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        ((Number(iInv['Revised Document Number']) != 0) ? true : false) &&
                        validatePattern(iInv['Revised Document Date'], true, null) &&
                        isValidDateFormat(iInv['Revised Document Date']) &&
                        validatePattern(cnvt2Nm(iInv['Value of supplies made']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Document type'], true, null) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&

                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,11})(\.\d{0,2})?$/) &&

                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)

                    );
                break;

            case 'ecomaurp2c':
                isPttnMthced =
                    (
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,11})(\.\d{0,2})?)$/) &&
                        validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,11})(\.\d{0,2})?)$/)
                    );
                break;
        }
    } else if (iForm == "GSTR2") {
        switch (iSecId) {
            case 'b2b': // GSTR2
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }
                if (!iInv['Integrated Tax Paid'])
                    iInv['Integrated Tax Paid'] = 0;

                if (!iInv['Central Tax Paid'])
                    iInv['Central Tax Paid'] = 0;

                if (!iInv['State/UT Tax Paid'])
                    iInv['State/UT Tax Paid'] = 0;
                isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Invoice date']) &&
                    validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Integrated Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Central Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['State/UT Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Availed ITC Integrated Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Central Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC State/UT Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Cess'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&




                    validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                    validateGSTIN(iInv['GSTIN of Supplier'], iForm) &&
                    validatePattern(iInv['GSTIN of Supplier'], true, null) &&
                    validatePattern(iInv['Supplier Name'], false, null) &&
                    validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) && isEligibleForITC(iInv['Place Of Supply'], iInv['Eligibility For ITC'])

                );

                break;
            case 'b2bur': // GSTR2



                isPttnMthced = (

                    validatePattern(iInv['Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Invoice date']) &&
                    validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Supplier Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&


                    validatePattern(iInv['Integrated Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Central Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['State/UT Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Availed ITC Integrated Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Central Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC State/UT Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Cess'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&

                    validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                    validatePattern(iInv['Supply Type'].trim(), true, /^(Inter State|Intra State)$/) && isEligibleForITC(iInv['Place Of Supply'], iInv['Eligibility For ITC'])
                );

                break;
            case 'b2ba': // GSTR2
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }
                isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                    validatePattern(iInv['Revised Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice date']) &&
                    isValidDateFormat(iInv['Revised Invoice date']) &&
                    validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                    validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                    validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                    validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                    validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                    validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                    validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                    validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                    validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                );
                break;
            case 'b2bura': // GSTR2
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }
                isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                    validatePattern(iInv['Revised Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice date']) &&
                    isValidDateFormat(iInv['Revised Invoice date']) &&
                    validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Supplier Name'], true, /[A-Za-z0-9_@\s]{50}/) &&
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                    validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                    validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                    validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                    validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                    validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                    validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                    validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                    validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                );
                break;
            case 'cdnr': // GSTR2
                if (!iInv['Pre GST']) {
                    iInv['Pre GST'] = 'N';
                }

                isPttnMthced = (validatePattern(iInv['Invoice/Advance Payment Voucher date'], true, null) &&
                    isValidDateFormat(iInv['Invoice/Advance Payment Voucher date']) &&
                    validateGSTIN(iInv['GSTIN of Supplier'], iForm) &&
                    validatePattern(iInv['GSTIN of Supplier'], true, null) &&
                    validatePattern(iInv['Supplier Name'], false, null) &&
                    isValidDateFormat(iInv['Note/Refund Voucher date']) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Note/Refund Voucher Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Integrated Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Central Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['State/UT Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Availed ITC Integrated Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Central Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC State/UT Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Cess'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&


                    validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                    validatePattern(iInv['Document Type'], true, /^(C|D)$/) &&
                    validatePattern(iInv['Invoice/Advance Payment Voucher Number'], true, /^[a-zA-Z0-9-\/]*$/) &&
                    validatePattern(iInv['Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]*$/) &&
                    validatePattern(iInv['Note/Refund Voucher date'], true, null) &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)


                );
                break;
            case 'cdnur': // GSTR2

                if (!iInv['Pre GST']) {
                    iInv['Pre GST'] = 'N';
                }


                isPttnMthced = (validatePattern(iInv['Invoice/Advance Payment Voucher date'], true, null) &&
                    isValidDateFormat(iInv['Invoice/Advance Payment Voucher date']) &&
                    isValidDateFormat(iInv['Note/Voucher date']) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Note/Voucher Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Integrated Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Central Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['State/UT Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    validatePattern(iInv['Availed ITC Integrated Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Central Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC State/UT Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Availed ITC Cess'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&

                    (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) &&
                    (cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) &&


                    validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                    validatePattern(iInv['Document Type'], true, /^(C|D)$/) &&
                    validatePattern(iInv['Invoice/Advance Payment Voucher number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Voucher date'], true, null) &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Invoice Type'], true, /^(B2BUR|IMPS)$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Supply Type'].trim(), true, /^(Inter State|Intra State)$/) &&
                    isValidSuplyType(iInv['Invoice Type'], iInv['Supply Type'].trim())
                );

                break;
            case 'cdnra': // GSTR2
                isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Invoice date']) &&
                    isValidDateFormat(iInv['Original Debit Note date']) &&
                    isValidDateFormat(iInv['Revised Debit Note date']) &&
                    validatePattern(iInv['Total Differential Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Reason For Issuing Note'], true, /^(Balance|Sales Return|Post Sale Discount|Deficiency in Service|Not mentioned|Others)$/) &&
                    validatePattern(iInv['Note Type'], true, /^(C|D)$/) &&
                    validatePattern(iInv['Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                    validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Original Debit Note Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Original Debit Note date'], true, null) &&
                    validatePattern(iInv['Revised Debit Note Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Revised Debit Note date'], true, null) &&
                    validatePattern(iInv['E-Commerce GSTIN'], false, /^[a-zA-Z0-9]{15}$/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                    validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                    validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                    validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                    validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                    validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                    validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                    validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                    validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                );
                break;
            case 'imp_g': // GSTR2
                if (!iInv['GSTIN Of SEZ Supplier']) {
                    iInv['GSTIN Of SEZ Supplier'] = '';
                }
                var validGstn, isRequired;
                if (iInv['Document Type'] == 'Received from SEZ') {
                    validGstn = validateGSTIN(iInv['GSTIN Of SEZ Supplier'], iForm),
                        isRequired = true;
                }
                else {
                    validGstn = true;
                    isRequired = false;
                }

                isPttnMthced = (
                    validGstn &&
                    validatePattern(iInv['GSTIN Of SEZ Supplier'], isRequired, null) &&
                    validatePattern(iInv['Bill Of Entry Date'], true, null) &&
                    isValidDateFormat(iInv['Bill Of Entry Date']) &&
                    validatePattern(iInv['Bill Of Entry Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) && validatePattern(iInv['Document type'], true, /^(Imports|Received from SEZ)$/) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Port Code'], true, /^[a-zA-Z0-9-\/]{6}$/) &&
                    validatePattern(iInv['Bill Of Entry Number'], true, /^[0-9]{7}$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                    (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) && isImportFromSez(iInv['GSTIN Of SEZ Supplier'], iInv['Document type'])
                );
                break;
            case 'imp_ga': // GSTR2


                isPttnMthced = (validatePattern(iInv['Original Bill Of Entry date'], true, null) &&
                    isValidDateFormat(iInv['Original Bill Of Entry date']) &&
                    validatePattern(iInv['Revised Bill Of Entry date'], true, null) &&
                    isValidDateFormat(iInv['Revised Bill Of Entry date']) &&
                    validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Original Bill Of Entry Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['Revised Bill Of Entry Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['IGST Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                    validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                    validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                    validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                    validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                );
                break;
            case 'imp_s': // GSTR2
                isPttnMthced = ((validatePattern(iInv['Invoice date'], true, null) || validatePattern(iInv['Invoice Date'], true, null)) &&
                    (isValidDateFormat(iInv['Invoice date']) || isValidDateFormat(iInv['Invoice Date'])) &&
                    validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Invoice Number of Reg Recipient'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                    (cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) && isEligibleForITC(iInv['Place Of Supply'], iInv['Eligibility For ITC'])
                );
                break;
            case 'imp_sa': // GSTR2
                isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice date']) &&
                    validatePattern(iInv['Revised Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Revised Invoice date']) &&
                    validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Port Code'], false, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-/]*$/) &&
                    validatePattern(iInv['IGST Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                    validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                    validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                    validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                    validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                );
                break;
            case 'txi': // GSTR2
                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Paid'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)
                );
                break;
            case 'atxi': // GSTR2
                isPttnMthced = (
                    validatePattern(iInv['Recipient State Code'], true, null, true) &&
                    validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Type'], true, /^(REGD|UNREGD)$/) &&
                    validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Original Document date'], true, null) &&
                    validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Revised Document date'], true, null) &&
                    isValidDateFormat(iInv['Original Document date']) &&
                    isValidDateFormat(iInv['Revised Document date']) &&
                    validatePattern(iInv['Original Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                    validatePattern(iInv['Revised Supplier GSTIN'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/) &&
                    validateItcValues(iInv['IGST Amount'], iInv['Taxable IGST']) &&
                    validateItcValues(iInv['CGST Amount'], iInv['Taxable CGST']) &&
                    validateItcValues(iInv['SGST Amount'], iInv['Taxable SGST']) &&
                    validateItcValues(iInv['Cess Amount'], iInv['Taxable CESS']) &&
                    validateItcValues(iInv['Taxable IGST'], iInv['ITC IGST']) &&
                    validateItcValues(iInv['Taxable SGST'], iInv['ITC SGST']) &&
                    validateItcValues(iInv['Taxable CGST'], iInv['ITC CGST']) &&
                    validateItcValues(iInv['Taxable CESS'], iInv['ITC CESS'])
                );
                break;
            case 'hsnsum': // GSTR2
                var isHSNReq = true, isDescrReq = true;
                var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
                if (iInv['Integrated Tax Amount']) {
                    isSTUTAmt = false; isCTAmt = false;

                } else if (iInv['Central Tax Amount'] && iInv['State/UT Tax Amount']) {
                    isITAmt = false;
                }

                if (!iInv['Central Tax Amount']) {
                    iInv['Central Tax Amount'] = '';
                }
                if (!iInv['State/UT Tax Amount']) {
                    iInv['State/UT Tax Amount'] = '';
                }
                if (!iInv['Integrated Tax Amount']) {
                    iInv['Integrated Tax Amount'] = '';

                }
                if (!iInv['Cess Amount']) {
                    iInv['Cess Amount'] = '';
                }
                if (iInv['HSN']) {
                    isDescrReq = false;
                }
                else if (iInv['Description']) {
                    isHSNReq = false;
                }

                if (!iInv['Description'])
                    iInv['Description'] = '';


                // as per system, either HSN or DESCRIPTION is required
                // changes undo done by vasu

                if (iInv['UQC'])
                    iInv['UQC'] = (iInv['UQC']).trim()

                isPttnMthced = (


                    validatePattern(iInv['HSN'], isHSNReq, /^[0-9]{2,8}$/) &&
                    validatePattern(iInv['Description'], isDescrReq, /^[ A-Za-z0-9_@./&-]{0,30}$/) &&
                    validatePattern(iInv['UQC'], true, /^[a-zA-Z0-9 -]*$/) &&
                    validatePattern(iInv['Total Quantity'], true, /^([-]?[0-9]{0,15}|[-]?[0-9]{0,15}\.{1}[0-9]{0,2})$/) &&
                    validatePattern(Math.abs(iInv['Total Value']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(iInv['Taxable Value']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(iInv['Integrated Tax Amount']), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(iInv['Central Tax Amount']), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(iInv['State/UT Tax Amount']), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(iInv['Cess Amount']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)

                );
                break;


            case 'itc_rvsl': // GSTR2
                isPttnMthced = (
                    validatePattern(iInv['ITC Integrated Tax Amount'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['ITC Central Tax Amount'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['ITC State/UT Tax Amount'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['ITC Cess Amount'], false, /^(\d{0,13})(\.\d{0,2})?$/)

                );
                break;
            case 'atadj': // GSTR2
                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Paid to be Adjusted'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Rate'], true, myRegExObj.rates) &&
                    validatePattern(iInv['Cess Adjusted'], false, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)
                );
                break;

            case 'nil': // GSTR2
                isPttnMthced = (
                    validatePattern(iInv['Nil Rated Supplies'], false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Exempted (other than nil rated/non GST supply )'], false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Non-GST supplies'], false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Composition taxable person'], false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    (
                        iInv['Description'] == 'Inter-State supplies' ||
                        iInv['Description'] == 'Intra-State supplies'
                    )
                )
                break;

        }
        // isPttnMthced = true;
    }
    return isPttnMthced;
}

function validateExcelData(iExInv, iSecID, iForm) {
    var isValidDt = false,
        isValidData = false;

    if (iForm === "GSTR1") {
        switch (iSecID) {
            case 'b2b':
                isValidData = (
                    iExInv.hasOwnProperty('GSTIN/UIN of Recipient') &&

                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Invoice Type') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Reverse Charge')
                );
                break;
            case 'b2ba':
                isValidData = (
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('GSTIN/UIN of Recipient') &&
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Invoice Type') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Reverse Charge')
                );
                break;
               
            case 'b2cl':
                isValidData = (
                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply')
                );
                break;
            case 'b2cla':
                isValidData = (
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Original Place Of Supply')
                );
                break;
            case 'at':
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Received") ||
                    iExInv.hasOwnProperty("Cess Amount"));
                break;
            case 'ata':
                isValidData = (
                    iExInv.hasOwnProperty('Financial Year') &&
                    iExInv.hasOwnProperty('Original Month') &&
                    iExInv.hasOwnProperty('Original Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Received") ||
                    iExInv.hasOwnProperty("Cess Amount"));
                break;

            case 'exp':
                isValidData = (
                    iExInv.hasOwnProperty('Export Type') ||
                    iExInv.hasOwnProperty('Shipping Bill Number') ||
                    iExInv.hasOwnProperty('Shipping Bill Date') ||
                    iExInv.hasOwnProperty('Port Code') &&
                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Invoice Value'));
                break;
            case 'expa':
                isValidData = (
                    iExInv.hasOwnProperty('Export Type') ||
                    iExInv.hasOwnProperty('Shipping Bill Number') ||
                    iExInv.hasOwnProperty('Shipping Bill Date') ||
                    iExInv.hasOwnProperty('Port Code') &&
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Invoice Value'));
                break;
            case 'cdnr':
                isValidData = (
                    iExInv.hasOwnProperty(trans.LBL_GSTIN_UIN_RECIPIENT) &&
                    iExInv.hasOwnProperty(trans.LBL_DEBIT_CREDIT_NOTE_NO) &&
                    iExInv.hasOwnProperty(trans.LBL_DEBIT_CREDIT_NOTE_DATE) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_TYP) &&
                    (iExInv.hasOwnProperty(trans.LBL_POS_Excel) || iExInv.hasOwnProperty(trans.LBL_SUPP_TYP)) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_VAL_Excel) &&
                    iExInv.hasOwnProperty(trans.LBL_NT_SPLY_TY) &&
                    iExInv.hasOwnProperty(trans.LBL_Taxable_Value)
                );
                break;
            case 'cdnur':
                if (!iExInv.hasOwnProperty(trans.LBL_POS_Excel))
                    iExInv[trans.LBL_POS_Excel] = '';

                isValidData = (

                    iExInv.hasOwnProperty(trans.LBL_DEBIT_CREDIT_NOTE_NO) &&
                    iExInv.hasOwnProperty(trans.LBL_DEBIT_CREDIT_NOTE_DATE) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_TYP) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_VAL_Excel) &&
                    (iExInv[trans.LBL_NOTE_VAL_Excel] || iExInv[trans.LBL_NOTE_VAL_Excel] == 0) &&
                    iExInv.hasOwnProperty(trans.LBL_POS_Excel) &&
                    iExInv.hasOwnProperty(trans.LBL_UR_TYPE) &&
                    iExInv.hasOwnProperty(trans.LBL_Taxable_Value));
                break;
            case 'cdnra':
                isValidData = (
                    iExInv.hasOwnProperty(trans.LBL_GSTIN_UIN_RECIPIENT) &&
                    iExInv.hasOwnProperty(trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO) &&
                    iExInv.hasOwnProperty(trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE) &&
                    iExInv.hasOwnProperty(trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO) &&
                    iExInv.hasOwnProperty(trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_TYP) &&
                    iExInv.hasOwnProperty(trans.LBL_POS_Excel) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_VAL_Excel) &&
                    iExInv.hasOwnProperty(trans.LBL_NT_SPLY_TY) &&
                    iExInv.hasOwnProperty(trans.LBL_Taxable_Value));

                break;
            case 'cdnura':
                if (!iExInv.hasOwnProperty(trans.LBL_POS_Excel))
                    iExInv[trans.LBL_POS_Excel] = '';
                isValidData = (

                    iExInv.hasOwnProperty(trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO) &&
                    iExInv.hasOwnProperty(trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE) &&
                    iExInv.hasOwnProperty(trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO) &&
                    iExInv.hasOwnProperty(trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_TYP) &&
                    iExInv.hasOwnProperty(trans.LBL_NOTE_VAL_Excel) &&
                    (iExInv[trans.LBL_NOTE_VAL_Excel] || iExInv[trans.LBL_NOTE_VAL_Excel] == 0) &&
                    iExInv.hasOwnProperty(trans.LBL_UR_TYPE) &&
                    iExInv.hasOwnProperty(trans.LBL_POS_Excel) &&
                    iExInv.hasOwnProperty(trans.LBL_Taxable_Value));
                break;
            case 'b2cs':
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Type'));
                break;
            case 'b2csa':
                isValidData = (
                    iExInv.hasOwnProperty('Financial Year') &&
                    iExInv.hasOwnProperty('Original Month') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Type'));
                break;
            case 'atadj':
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Adjusted") ||
                    iExInv.hasOwnProperty("Cess Amount"));
                break;
            case 'atadja':
                isValidData = (
                    iExInv.hasOwnProperty('Financial Year') &&
                    iExInv.hasOwnProperty('Original Month') &&
                    iExInv.hasOwnProperty('Original Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Adjusted") ||
                    iExInv.hasOwnProperty("Cess Amount"));
                break;
            case 'hsn':
                if (!isCurrentPeriodBeforeAATOCheck(newHSNStartDateConstant, thisShareData.monthSelected.value)) {
                    isValidData = (
                        (
                            (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                            ||
                            (iExInv.hasOwnProperty('Description') && iExInv['Description'] != '')
                        )
                        &&
                        iExInv.hasOwnProperty('UQC') &&
                        iExInv.hasOwnProperty('Total Quantity') &&
                        iExInv.hasOwnProperty('Rate') &&
                        iExInv.hasOwnProperty('Taxable Value'));
                }
                else {
                    isValidData = (
                        (
                            (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                            ||
                            (iExInv.hasOwnProperty('Description') && iExInv['Description'] != '')
                        )
                        &&
                        iExInv.hasOwnProperty('UQC') &&
                        iExInv.hasOwnProperty('Total Quantity') &&
                        iExInv.hasOwnProperty('Total Value') &&
                        iExInv.hasOwnProperty('Taxable Value'));
                }
                break;
                    case 'hsn(b2b)':  
                var HSN_BIFURCATION_START_DATE = "052025";
                var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY"))); 
                if(showHSNTabs) {           
                        isValidData = (
                            (
                                (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                                ||
                                (iExInv.hasOwnProperty('Description as per HSN Code') && iExInv['Description'] != '')
                            )
                            &&
                            iExInv.hasOwnProperty('UQC') &&
                            iExInv.hasOwnProperty('Total Quantity') &&
                            iExInv.hasOwnProperty('Rate') &&
                            iExInv.hasOwnProperty('Taxable Value'));
                }
                    break;
                    case 'hsn(b2c)':
                        var HSN_BIFURCATION_START_DATE = "052025";
                        var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY"))); 
                        if(showHSNTabs) {   
                    isValidData = (
                        (
                            (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                            ||
                            (iExInv.hasOwnProperty('Description as per HSN Code') && iExInv['Description'] != '')
                        )
                        &&
                        iExInv.hasOwnProperty('UQC') &&
                        iExInv.hasOwnProperty('Total Quantity') &&
                        iExInv.hasOwnProperty('Rate') &&
                        iExInv.hasOwnProperty('Taxable Value'));
                        }
                break;
            case 'nil':
                isValidData = (
                    iExInv.hasOwnProperty('Description') ||
                    iExInv.hasOwnProperty("Nil Rated Supplies") ||
                    iExInv.hasOwnProperty("Exempted(other than nil rated/non GST supply)") ||
                    iExInv.hasOwnProperty("Non-GST Supplies")
                );

                break;
            case 'doc_issue':
                isValidData = (
                    iExInv.hasOwnProperty('Nature of Document') &&
                    iExInv.hasOwnProperty("Sr. No. From") &&
                    iExInv.hasOwnProperty("Sr. No. To") &&
                    iExInv.hasOwnProperty("Total Number") &&
                    iExInv.hasOwnProperty("Cancelled")
                );

                break;
            case 'supeco':
                var natSup = null;
                var paynatSup = null;
                if (iExInv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)') {
                    natSup = 'clttx';
                }
                if (iExInv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)') {
                    paynatSup = 'paytx';
                }
                isValidData = (
                    ((natSup != null) || (paynatSup != null)) &&
                    iExInv.hasOwnProperty("GSTIN of E-Commerce Operator") &&
                    // iExInv.hasOwnProperty("E-Commerce Operator Name") &&
                    iExInv.hasOwnProperty("Net value of supplies")
                );
                break;
            case 'supecoa':
                var natSup = null;
                var paynatSup = null;
                if (iExInv['Nature of Supply'] == 'Liable to collect tax u/s 52(TCS)') {
                    natSup = 'clttxa';
                }
                if (iExInv['Nature of Supply'] == 'Liable to pay tax u/s 9(5)') {
                    paynatSup = 'paytxa';
                }
                isValidData = (
                    ((natSup != null) || (paynatSup != null)) &&
                    iExInv.hasOwnProperty('Financial Year') &&
                    iExInv.hasOwnProperty('Original Month/Quarter') &&
                    iExInv.hasOwnProperty('Nature of Supply') &&
                    iExInv.hasOwnProperty("Revised GSTIN of E-Commerce Operator") &&
                    // iExInv.hasOwnProperty("E-Commerce Operator Name") &&
                    iExInv.hasOwnProperty("Revised Net value of supplies")
                );
                break;
            case 'ecomb2b':
                isValidData = (
                    iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Recipient Name') &&
                    iExInv.hasOwnProperty('Document Number') &&
                    iExInv.hasOwnProperty('Document Date') &&
                    iExInv.hasOwnProperty('Value of supplies made') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Document type') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;
            case 'ecomb2c':
                isValidData = (
                    iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;
            case 'ecomurp2b':
                isValidData = (
                    iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Recipient Name') &&
                    iExInv.hasOwnProperty('Document Number') &&
                    iExInv.hasOwnProperty('Document Date') &&
                    iExInv.hasOwnProperty('Value of supplies made') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Document type') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;
            case 'ecomurp2c':
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;
            case 'ecomab2b':
                isValidData = (
                    iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Recipient Name') &&
                    iExInv.hasOwnProperty('Original Document Number') &&
                    iExInv.hasOwnProperty('Original Document Date') &&
                    iExInv.hasOwnProperty('Revised Document Number') &&
                    iExInv.hasOwnProperty('Revised Document Date') &&
                    iExInv.hasOwnProperty('Value of supplies made') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Document type') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;

            case 'ecomab2c':
                isValidData = (
                    iExInv.hasOwnProperty('Financial Year') &&
                    iExInv.hasOwnProperty('Original Month') &&
                    iExInv.hasOwnProperty('Supplier GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;

            case 'ecomaurp2b':
                isValidData = (
                    iExInv.hasOwnProperty('Recipient GSTIN/UIN') &&
                    // iExInv.hasOwnProperty('Recipient Name') &&
                    iExInv.hasOwnProperty('Original Document Number') &&
                    iExInv.hasOwnProperty('Original Document Date') &&
                    iExInv.hasOwnProperty('Revised Document Number') &&
                    iExInv.hasOwnProperty('Revised Document Date') &&
                    iExInv.hasOwnProperty('Value of supplies made') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Document type') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;

            case 'ecomaurp2c':
                isValidData = (
                    iExInv.hasOwnProperty('Financial Year') &&
                    iExInv.hasOwnProperty('Original Month') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Cess Amount')
                );
                break;

        }
    } else if (iForm === "GSTR2") {
        switch (iSecID) {
            case 'b2b': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('GSTIN of Supplier') ||
                    iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Reverse Charge')
                );
                break;
            case 'b2bur': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Supply Type') &&
                    iExInv.hasOwnProperty('Place Of Supply')
                );
                break;
            case 'b2ba': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('Supplier GSTIN') &&
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('Total Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Reverse Charge')
                );
                break;
            case 'b2bura': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('Total Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Reverse Charge')
                );
                break;
            case 'cdnr': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('GSTIN of Supplier') ||
                    iExInv.hasOwnProperty('Supplier Name') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Document Type') &&
                    iExInv.hasOwnProperty('Supply Type') &&
                    iExInv.hasOwnProperty('Reason For Issuing document') &&
                    iExInv.hasOwnProperty('Invoice/Advance Payment Voucher Number') &&
                    iExInv.hasOwnProperty('Invoice/Advance Payment Voucher date') &&
                    iExInv.hasOwnProperty('Pre GST') &&
                    iExInv.hasOwnProperty('Taxable Value')
                );
                break;
            case 'cdnur': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('Note/Voucher Number') &&
                    iExInv.hasOwnProperty('Note/Voucher date') &&
                    iExInv.hasOwnProperty('Document Type') &&
                    iExInv.hasOwnProperty('Reason For Issuing document') &&
                    iExInv.hasOwnProperty('Invoice/Advance Payment Voucher number') &&
                    iExInv.hasOwnProperty('Invoice/Advance Payment Voucher date') &&
                    iExInv.hasOwnProperty('Pre GST') &&
                    iExInv.hasOwnProperty('Invoice Type') &&
                    iExInv.hasOwnProperty('Taxable Value')
                );
                break;
            case 'cdnra': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('Supplier GSTIN') &&
                    iExInv.hasOwnProperty('Original Debit Note Number') &&
                    iExInv.hasOwnProperty('Original Debit Note date') &&
                    iExInv.hasOwnProperty('Revised Debit Note Number') &&
                    iExInv.hasOwnProperty('Revised Debit Note date') &&
                    iExInv.hasOwnProperty('Note Type') &&
                    iExInv.hasOwnProperty('Reason For Issuing Note') &&
                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Total Invoice Value'));
                break;
            case 'imp_g': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('Port Code') &&
                    iExInv.hasOwnProperty('Bill Of Entry Number') &&
                    iExInv.hasOwnProperty('Bill Of Entry Date') &&
                    iExInv.hasOwnProperty('Bill Of Entry Value'));
                break;
            case 'imp_ga': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('Port Code') &&
                    iExInv.hasOwnProperty('Document type') &&
                    iExInv.hasOwnProperty('Original Bill Of Entry Number') &&
                    iExInv.hasOwnProperty('Original Bill Of Entry date') &&
                    iExInv.hasOwnProperty('Revised Bill Of Entry Number') &&
                    iExInv.hasOwnProperty('Revised Bill Of Entry date') &&
                    iExInv.hasOwnProperty('Total Invoice Value'));
                break;
            case 'imp_s': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('Invoice Number of Reg Recipient') &&
                    (iExInv.hasOwnProperty('Invoice date') || iExInv.hasOwnProperty('Invoice Date')) &&//there is a mismatch between the excel template and then export excel template
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Invoice Value'));

                break;
            case 'imp_sa': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('Total Invoice Value'));
                break;
            case 'txi': // GSTR2
                if (!iExInv.hasOwnProperty("Cess Amount"))
                    iExInv['Cess Amount'] = 0;
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Paid") &&
                    iExInv.hasOwnProperty("Cess Amount") &&
                    iExInv.hasOwnProperty("Supply Type"));
                break;
            case 'atxi': // GSTR2

                isValidData = (
                    iExInv.hasOwnProperty('Recipient State Code') &&
                    iExInv.hasOwnProperty('Revised Supplier GSTIN') &&
                    iExInv.hasOwnProperty('Original Supplier GSTIN') &&
                    iExInv.hasOwnProperty('Original Document Number') &&
                    iExInv.hasOwnProperty('Original Document date') &&
                    iExInv.hasOwnProperty('Revised Document Number') &&
                    iExInv.hasOwnProperty('Revised Document date'));
                break;
            case 'hsnsum': // GSTR2
                isValidData = (
                    (
                        (iExInv.hasOwnProperty('HSN') && iExInv['HSN'] != '')
                        ||
                        (iExInv.hasOwnProperty('Description') && iExInv['Description'] != '')
                    ) &&
                    iExInv.hasOwnProperty('UQC') &&
                    iExInv.hasOwnProperty('Total Quantity') &&
                    iExInv.hasOwnProperty('Total Value') &&
                    iExInv.hasOwnProperty('Taxable Value') &&
                    iExInv.hasOwnProperty('Integrated Tax Amount') &&
                    iExInv.hasOwnProperty('Central Tax Amount') &&
                    iExInv.hasOwnProperty('State/UT Tax Amount') &&
                    iExInv.hasOwnProperty('Cess Amount'));

                break;

            /*added this case as per the new excel by sridhar*/
            case 'itc_rvsl': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('Description for reversal of ITC'));
                break;
            case 'atadj': // GSTR2
                if (!iExInv.hasOwnProperty("Cess Adjusted"))
                    iExInv['Cess Adjusted'] = 0;
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Paid to be Adjusted") &&
                    iExInv.hasOwnProperty("Cess Adjusted") &&
                    iExInv.hasOwnProperty("Supply Type"));
                break;
            case 'nil': // GSTR2
                isValidData = (
                    iExInv.hasOwnProperty('Description') &&
                    iExInv.hasOwnProperty("Nil Rated Supplies") &&
                    iExInv.hasOwnProperty("Exempted (other than nil rated/non GST supply )") &&
                    iExInv.hasOwnProperty("Non-GST supplies")
                );

                break;

        }
    }

    return (isValidData);
}

//To check all values at invoice level inorder to add multi items from excel
function validateInvoice(iForm, iSecID, iExInv, existingInv, iYearsList) {
    var isFieldsMatch = false;
    if (iExInv['Place Of Supply']) {
        iExInv['Place Of Supply'] = (iExInv['Place Of Supply']).substring(0, 2);
    }
    if (iExInv['Recipient State Code']) {
        iExInv['Recipient State Code'] = (iExInv['Recipient State Code'] < 10) ? "0" + iExInv['Recipient State Code'] : "" + iExInv['Recipient State Code'];
    }
    if (iExInv['Original State Code']) {
        iExInv['Original State Code'] = (iExInv['Original State Code'] < 10) ? "0" + iExInv['Original State Code'] : "" + iExInv['Original State Code'];
    }

    if (iForm === "GSTR1") {
        switch (iSecID) {
            case 'b2b':
                isFieldsMatch = (
                    iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    iExInv['E-Commerce GSTIN'] == existingInv['etin']

                );
                break;
            case 'b2ba':
                isFieldsMatch = (
                    iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);


                break;
            case 'b2cl':
                isFieldsMatch = (
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    iExInv['Place Of Supply'] == existingInv['pos']);
                break;
            case 'b2cla':
                isFieldsMatch = (
                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    iExInv['Original Place Of Supply'].substring(0, 2) == existingInv['pos']
                );
                break;
            case 'at':
                isFieldsMatch = (
                    iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent']);
                break;
            case 'ata':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                isFieldsMatch = (
                    iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    curntOMon == existingInv['omon']
                );
                break;
            case 'exp':

                isFieldsMatch = (
                    iExInv['Export Type'] == existingInv['exp_typ'] &&
                    (parseInt(iExInv['Shipping Bill Number']) == existingInv['sbnum'] || (iExInv['Shipping Bill Number']) == existingInv['sbnum']) &&
                    iExInv['Port Code'] == existingInv['sbpcode'] &&
                    iExInv['Shipping Bill Date'] == existingInv['sbdt'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val']);

                break;
            case 'expa':
                isFieldsMatch = (
                    iExInv['Export Type'] == existingInv['exp_typ'] &&
                    iExInv['Shipping Bill Number'] == existingInv['sbnum'] &&
                    iExInv['Port Code'] == existingInv['sbpcode'] &&
                    iExInv['Shipping Bill Date'] == existingInv['sbdt'] &&
                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val']);
                break;
            case 'cdnr':
                isFieldsMatch = (
                    iExInv[trans.LBL_GSTIN_UIN_RECIPIENT] == existingInv['ctin'] &&
                    iExInv[trans.LBL_RECEIVER_NAME] == existingInv['cname'] &&
                    iExInv[trans.LBL_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                    iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                    iExInv[trans.LBL_NOTE_TYP] == existingInv['ntty'] &&
                    iExInv[trans.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                    iExInv[trans.LBL_POS_Excel] == existingInv['pos'] &&
                    iExInv[trans.LBL_RECHRG] == existingInv['rchrg'] &&
                    iExInv[trans.LBL_NOTE_VAL_Excel] == existingInv['val']);

                break;
            case 'cdnur':
                isFieldsMatch = (
                    iExInv[trans.LBL_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                    iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                    iExInv[trans.LBL_NOTE_TYP] == existingInv['ntty'] &&
                    iExInv[trans.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                    iExInv[trans.LBL_POS_Excel] == existingInv['pos'] &&
                    iExInv[trans.LBL_UR_TYPE] == existingInv['typ'] &&
                    iExInv[trans.LBL_NOTE_VAL_Excel] == existingInv['val']);

                break;
            case 'cdnra':
                isFieldsMatch = (
                    iExInv[trans.LBL_GSTIN_UIN_RECIPIENT] == existingInv['ctin'] &&
                    iExInv[trans.LBL_RECEIVER_NAME] == existingInv['cname'] &&
                    iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO] == existingInv['ont_num'] &&
                    iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] == existingInv['ont_dt'] &&
                    iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                    iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                    iExInv[trans.LBL_NOTE_TYP] == existingInv['ntty'] &&
                    iExInv[trans.LBL_RECHRG] == existingInv['rchrg'] &&
                    iExInv[trans.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                    iExInv[trans.LBL_POS_Excel] == existingInv['pos'] &&
                    iExInv[trans.LBL_NOTE_VAL_Excel] == existingInv['val']);

                break;
            case 'cdnura':
                isFieldsMatch = (
                    iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_NO] == existingInv['ont_num'] &&
                    iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] == existingInv['ont_dt'] &&
                    iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_NO] == existingInv['nt_num'] &&
                    iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] == existingInv['nt_dt'] &&
                    iExInv[trans.LBL_NOTE_TYP] == existingInv['ntty'] &&
                    iExInv[trans.LBL_Diff_Percentage] / 100 == existingInv['diff_percent'] &&
                    iExInv[trans.LBL_POS_Excel] == existingInv['pos'] &&
                    iExInv[trans.LBL_UR_TYPE] == existingInv['typ'] &&
                    iExInv[trans.LBL_NOTE_VAL_Excel] == existingInv['val']);

                break;
            case 'b2cs':
                isFieldsMatch = (
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    iExInv['Type'] == existingInv['typ']);

                break;
            case 'b2csa':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                isFieldsMatch = (
                    iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Type'] == existingInv['typ']) &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    curntOMon == existingInv['omon']

                break;
            case 'atadj':
                isFieldsMatch = (
                    iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent']);
                break;
            case 'atadja':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                isFieldsMatch = (
                    iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] / 100 == existingInv['diff_percent'] &&
                    curntOMon == existingInv['omon']

                );
                break;
            case 'hsn':
                isFieldsMatch = (
                    iExInv['HSN'] == existingInv['hsn_sc'] &&
                    iExInv['Description'] == existingInv['desc'] &&
                    iExInv['UQC'] == existingInv['uqc'] &&
                    iExInv['Rate'] == existingInv['rt']
                );
                break;
                case 'hsn(b2b)':  
                var HSN_BIFURCATION_START_DATE = "052025";
                var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                if(showHSNTabs){
                    isFieldsMatch = (
                        iExInv['HSN'] == existingInv['hsn_sc'] &&
                        iExInv['Description as per HSN Code'] == existingInv['desc'] &&
                        iExInv['UQC'] == existingInv['uqc'] &&
                        iExInv['Rate'] == existingInv['rt']
                    );
                }
                    break;
                    case 'hsn(b2c)':   
                    var HSN_BIFURCATION_START_DATE = "052025";
                    var showHSNTabs = !(moment(getDate(thisShareData.dashBoardDt.fp), 'DD/MM/YYYY').isBefore(moment(getDate(HSN_BIFURCATION_START_DATE), "DD/MM/YYYY")));
                    if(showHSNTabs){ 
                    isFieldsMatch = (
                        iExInv['HSN'] == existingInv['hsn_sc'] &&
                        iExInv['Description as per HSN Code'] == existingInv['desc'] &&
                        iExInv['UQC'] == existingInv['uqc'] &&
                        iExInv['Rate'] == existingInv['rt']
                    );
                    }
                    break;
            case 'nil':
                isFieldsMatch = (
                    iExInv['Description'] == existingInv['sply_ty'] &&
                    iExInv['Nil Rated Supplies'] == existingInv['nil_amt'] &&
                    iExInv['Exempted(other than nil rated/non-GST supply)'] == existingInv['expt_amt'] &&
                    iExInv['Non-GST Supplies '] == existingInv['ngsup_amt']
                );
                break;
            case 'doc_issue':
                isFieldsMatch = (
                    iExInv['Nature of Document'] == existingInv['doc_typ']
                );
                break;
            case 'supeco':
                isFieldsMatch = (
                    iExInv['GSTIN of E-Commerce Operator'] == existingInv['etin']);
                break;
            case 'supecoa':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month/Quarter'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                
                isFieldsMatch = (
                    iExInv['Revised GSTIN of E-Commerce Operator'] == existingInv['etin'] &&
                    iExInv['Original GSTIN of E-Commerce Operator'] == existingInv['oetin'] && 
                    curntOMon == existingInv['omon']);
                break;

            case 'ecomb2b':
                isFieldsMatch = (
                    iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                    // iExInv['Supplier Name'] == existingInv['supplierName'] &&
                    iExInv['Recipient GSTIN/UIN'] == existingInv['rtin'] &&
                    // iExInv['Recipient Name'] == existingInv['receipientName'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Document Date'] == existingInv['idt'] &&
                    iExInv['Document Number'] == existingInv['inum'] &&
                    iExInv['Value of supplies made'] == existingInv['val']
                );
                break;
            case 'ecomb2c':
                isFieldsMatch = (
                    iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                    //iExInv['Supplier Name'] == existingInv['sname'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Taxable Value'] == existingInv['txval'] &&
                    iExInv['Cess Amount'] == existingInv['csamt']
                );
                break;
            case 'ecomurp2b':
                isFieldsMatch = (
                    iExInv['GSTIN/UIN of Recipient'] == existingInv['rtin'] &&
                   // iExInv['Recipient Name'] == existingInv['receipientName'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Document Date'] == existingInv['idt'] &&
                    iExInv['Document Number'] == existingInv['inum'] &&
                    iExInv['Value of supplies made'] == existingInv['val']
                );
                break;
            case 'ecomurp2c':
                isFieldsMatch = (
                    iExInv['Place Of Supply'] == existingInv['pos']

                );
                break;
            case 'ecomab2b':

                isFieldsMatch = (
                    iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                    iExInv['Recipient GSTIN/UIN'] == existingInv['rtin'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Original Document Date'] == existingInv['oidt'] &&
                    iExInv['Original Document Number'] == existingInv['oinum'] &&
                    iExInv['Revised Document Date'] == existingInv['idt'] &&
                    iExInv['Revised Document Number'] == existingInv['inum'] &&
                    iExInv['Value of supplies made'] == existingInv['val']
                );

                break;

            case 'ecomab2c':
                isFieldsMatch = (
                    iExInv['Supplier GSTIN/UIN'] == existingInv['stin'] &&
                    iExInv['Original Month'] == existingInv['omon']
                );
                break;

            case 'ecomaurp2b':
                isFieldsMatch = (
                    iExInv['GSTIN/UIN of Recipient'] == existingInv['rtin'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Original Document Date'] == existingInv['oidt'] &&
                    iExInv['Original Document Number'] == existingInv['oinum'] &&
                    iExInv['Revised Document Date'] == existingInv['idt'] &&
                    iExInv['Revised Document Number'] == existingInv['inum'] &&
                    iExInv['Value of supplies made'] == existingInv['val']
                );
                break;

            case 'ecomaurp2c':
                isFieldsMatch = (
                    iExInv['Place Of Supply'] == existingInv['pos'] &&

                    iExInv['Original Month'] == existingInv['omon']
                );
                break;
        }
    } else if (iForm === "GSTR2") {
        switch (iSecID) {
            case 'b2b': // GSTR2
                isFieldsMatch = (
                    iExInv['GSTIN of Supplier'] == existingInv['ctin'] &&
                    iExInv['Supplier Name'] == existingInv['cname'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);
                //S06102017 : Change for saved and add
                //if (iExInv['Saved/Submitted'] == "Saved" && iExInv['Action'] == 'Add') {
                //                    isFieldsMatch = false;
                //              }
                //End of S06102017

                break;
            case 'b2bur': // GSTR2
                isFieldsMatch = (
                    iExInv['Supplier Name'] == existingInv['cname'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos']
                );

                break;
            case 'b2ba': // GSTR2
                isFieldsMatch = (
                    iExInv['Supplier GSTIN'] == existingInv['ctin'] &&
                    iExInv['Original Invoice Number'] == existingInv['oinum'] &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Total Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);

                break;
            case 'b2bura': // GSTR2
                isFieldsMatch = (
                    iExInv['Supplier Name'] == existingInv['cname'] &&
                    iExInv['Original Invoice Number'] == existingInv['oinum'] &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Total Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);
                break;
            case 'cdnr': // GSTR2
                isFieldsMatch = (
                    iExInv['GSTIN of Supplier'] == existingInv['ctin'] &&
                    iExInv['Supplier Name'] == existingInv['cname'] &&
                    iExInv['Note/Refund Voucher Number'] == existingInv['nt_num'] &&
                    iExInv['Note/Refund Voucher date'] == existingInv['nt_dt'] &&
                    iExInv['Document Type'] == existingInv['ntty'] &&
                    iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                    (iExInv['Invoice/Advance Payment Voucher Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice/Advance Payment Voucher date'] == existingInv['idt'] &&
                    iExInv['Pre GST'] == existingInv['p_gst'] &&
                    iExInv['Supply Type'] == existingInv['sp_typ'] &&
                    iExInv['Note/Refund Voucher Value'] == existingInv['val']
                );

                break;
            case 'cdnur': // GSTR2
                isFieldsMatch = (
                    iExInv['Note/Voucher Number'] == existingInv['nt_num'] &&
                    iExInv['Note/Voucher date'] == existingInv['nt_dt'] &&
                    iExInv['Document Type'] == existingInv['ntty'] &&
                    iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                    (iExInv['Invoice/Advance Payment Voucher number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice/Advance Payment Voucher date'] == existingInv['idt'] &&
                    iExInv['Pre GST'] == existingInv['p_gst'] &&
                    iExInv['Supply Type'] == existingInv['sp_typ'] &&
                    iExInv['Invoice Type'] == existingInv['inv_typ'] &&
                    iExInv['Note/Voucher Value'] == existingInv['val']);
                break;
            case 'cdnra': // GSTR2
                isFieldsMatch = (
                    iExInv['Supplier GSTIN'] == existingInv['ctin'] &&
                    iExInv['Original Debit Note Number'] == existingInv['ont_num'] &&
                    iExInv['Original Debit Note date'] == existingInv['ont_dt'] &&
                    iExInv['Revised Debit Note Number'] == existingInv['nt_num'] &&
                    iExInv['Revised Debit Note date'] == existingInv['nt_dt'] &&
                    iExInv['Note Type'] == existingInv['ntty'] &&
                    iExInv['Reason For Issuing Note'] == existingInv['rsn'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Total Invoice Value'] == existingInv['val']);

                break;
            case 'imp_g': // GSTR2
                isFieldsMatch = (
                    iExInv['Bill Of Entry Number'] == existingInv['boe_num'] &&
                    iExInv['Bill Of Entry Date'] == existingInv['boe_dt'] &&
                    iExInv['Port Code'] == existingInv['port_code'] &&
                    iExInv['Bill Of Entry Value'] == existingInv['boe_val']);
                break;
            case 'imp_ga': // GSTR2
                isFieldsMatch = (
                    iExInv['Original Bill Of Entry Number'] == existingInv['oboe_num'] &&
                    iExInv['Original Bill Of Entry date'] == existingInv['oboe_dt'] &&
                    iExInv['Revised Bill Of Entry Number'] == existingInv['boe_num'] &&
                    iExInv['Revised Bill Of Entry date'] == existingInv['boe_dt'] &&
                    iExInv['Port Code'] == existingInv['port_code'] &&
                    iExInv['Total Invoice Value'] == existingInv['boe_val']);
                break;
            case 'imp_s': // GSTR2
                var dateStr = "";
                if (iExInv.hasOwnProperty('Invoice date'))
                    dateStr = iExInv['Invoice date'];
                else
                    dateStr = iExInv['Invoice Date'];

                isFieldsMatch = (
                    (iExInv['Invoice Number of Reg Recipient']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    dateStr == existingInv['idt'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Invoice Value'] == existingInv['ival']);

                break;
            case 'imp_sa': // GSTR2
                isFieldsMatch = (
                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oi_num']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oi_dt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['i_num']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['i_dt'] &&
                    iExInv['Total Invoice Value'] == existingInv['i_val']);
                break;
            case 'txi': // GSTR2
                isFieldsMatch = (
                    iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Supply Type'] == existingInv['sply_ty']);

                break;
            case 'atxi': // GSTR2
                isFieldsMatch = (
                    iExInv['Recipient State Code'] == existingInv['state_cd'] &&
                    iExInv['Revised Supplier GSTIN'] == existingInv['cpty'] &&
                    iExInv['Original Supplier GSTIN'] == existingInv['ocpty'] &&
                    iExInv['Original Document Number'] == existingInv['odnum'] &&
                    iExInv['Type'] == existingInv['reg_type'] &&
                    iExInv['Original Document date'] == existingInv['otdt'] &&
                    iExInv['Revised Document Number'] == existingInv['dnum'] &&
                    iExInv['Revised Document date'] == existingInv['dt']);
                break;
            case 'hsnsum': // GSTR2
                isFieldsMatch = (
                    iExInv['HSN'] == existingInv['hsn_sc'] &&
                    iExInv['Description'] == existingInv['desc']
                );
                break;
            case 'itc_rvsl': // GSTR2
                isFieldsMatch = (

                    iExInv['ITC Integrated Tax Amount'] == existingInv['iamt'] && iExInv['ITC Central Tax Amount'] == existingInv['camt'] &&
                    iExInv['ITC State/UT Tax Amount'] == existingInv['samt'] &&
                    iExInv['ITC Cess Amount'] == existingInv['csamt']);
                break

            case 'atadj': // GSTR2
                isFieldsMatch = (iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Supply Type'] == existingInv['sply_ty']);
                break;
            case 'nil': // GSTR2
                isFieldsMatch = (
                    iExInv['Description'] == existingInv['sply_ty'] &&
                    iExInv['Nil Rated Supplies'] == existingInv['nil_amt'] &&
                    iExInv['Exempted (other than nil rated/non GST supply )'] == existingInv['expt_amt'] &&
                    iExInv['Non-GST supplies'] == existingInv['ngsup_amt']
                );
                break;
        }
    }

    return (isFieldsMatch);
}

//validate revised date with org date (should be greater)
function validateLessShipOrInvDate(sbdtOrOdt, idtOrRevdt) {
    var dateFormat = "DD/MM/YYYY";
    var isValidShibBlDt = (moment(sbdtOrOdt, dateFormat).isBefore(moment(idtOrRevdt, dateFormat))) ? false : true;
    return isValidShibBlDt;

}

function validateLessThanInvDate(iExInv, iSecID, iForm) {
    var isValidSbdt = true;
    return isValidSbdt;
}
//To change date format dd-mmm-yy/yyyy to dd/mm/yy
function getDateTime(datetoformat) {
    if (typeof (datetoformat) === "number") {

        var date = moment('1899-12-30').add(datetoformat, 'days');
        date = date.format('DD-MM-YYYY');
        datetoformat = date.split("-");
        var day = datetoformat[0];
        var month = datetoformat[1];
        var year = datetoformat[2];
        var mon;
        if (day && day.length < 2) {
            day = "0" + day;
        }
        if (month == null || month == "") {
            mon = "12"
        } else {
            mon = month
        }
        if (year && year.length == 2) {
            return day + "-" + mon + "-" + "20" + year;
        } else {
            return day + "-" + mon + "-" + year;
        }
    }
    else {
        datetoformat = datetoformat.split("-");
        var day = datetoformat[0];
        var month = datetoformat[1];
        var year = datetoformat[2];
        var mon;
        if (day && day.length < 2) {
            day = "0" + day;
        }
        switch (month) {
            case "Jan":
            case "jan":
                mon = "01";
                break;
            case "Feb":
            case "feb":
                mon = "02";
                break;
            case "Mar":
            case "mar":
                mon = "03";
                break;
            case "Apr":
            case "apr":
                mon = "04";
                break;
            case "May":
            case "may":
                mon = "05";
                break;
            case "Jun":
            case "jun":
                mon = "06";
                break;
            case "Jul":
            case "jul":
                mon = "07";
                break;
            case "Aug":
            case "aug":
                mon = "08";
                break;
            case "Sep":
            case 'sep':
                mon = "09";
                break;
            case "Oct":
            case "oct":
                mon = "10";
                break;
            case "Nov":
            case "nov":
                mon = "11";
                break;
            default:
                mon = "12";
        }
        // if (year && year.length == 2) {
        //     return day + "/" + mon + "/" + "20" + year;
        // } else {
        //     return day + "/" + mon + "/" + year;
        // }
        if (year && year.length == 2) {
            return day + "-" + mon + "-" + "20" + year;
        } else {
            return day + "-" + mon + "-" + year;
        }
    }
}
//validation of dates from excel
function validateExcelDates(iExInv, iSecID, iForm, iMonthsList, iYearsList, isValidExcelDates) {
    var isValidDt = false,
        isValidData = false;

    if (iForm === "GSTR1") {
        switch (iSecID) {
            case 'b2b':
                iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                break;
            case 'b2ba':
                iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList));
                break;
            case 'b2cl':
                iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                break;
            case 'b2cla':
                iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList));
                break;
            case 'at':
            case 'atadj':
            case 'b2cs':

                isValidDt = true
                break;

            case 'exp':
                iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                if (iExInv['Shipping Bill Date'])
                    iExInv['Shipping Bill Date'] = getDateTime(iExInv['Shipping Bill Date']);
                isValidDt = (validateDate(iExInv['Invoice date'], iMonthsList) && validateDate(iExInv['Shipping Bill Date'], iMonthsList, true));
                break;
            case 'expa':
                iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                if (iExInv['Shipping Bill Date'])
                    iExInv['Shipping Bill Date'] = getDateTime(iExInv['Shipping Bill Date']);
                isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList) && validateDate(iExInv['Shipping Bill Date'], iMonthsList, true));
                break;
            case 'cdnr':
                iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE]);
                isValidDt = validateDate(iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE], iMonthsList);
                break;
            case 'cdnur':
                iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE]);
                isValidDt = validateDate(iExInv[trans.LBL_DEBIT_CREDIT_NOTE_DATE], iMonthsList);
                break;
            case 'cdnra':
                iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]);
                iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]);
                isValidDt = (validateDate(iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], iMonthsList) && validateDate(iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], iMonthsList));
                break;
            case 'cdnura':
                iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE]);
                iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE] = getDateTime(iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE]);

                isValidDt = (validateDate(iExInv[trans.LBL_ORIGINAL_DEBIT_CREDIT_NOTE_DATE], iMonthsList) && validateDate(iExInv[trans.LBL_REVISED_DEBIT_CREDIT_NOTE_DATE], iMonthsList));
                break;
            case 'ata':
            case 'atadja':
            case 'b2csa':
                var curntYear = iExInv['Financial Year'],
                    curntMonth = iExInv['Original Month'];
                isValidDt = isValidRtnPeriod(iYearsList, curntYear, curntMonth).isValidPeriod;
                break;
            case 'hsn':
            case 'hsn(b2b)':
            case  'hsn(b2c)':        
                isValidDt = true;
                break;
            case 'nil':
                isValidDt = true;
                break;
            case 'doc_issue':
                isValidDt = true;
                break;
                case 'supeco': 
                case 'ecomb2c':  
                case 'ecomab2c':  
                case 'ecomurp2c':
                case 'ecomaurp2c':
                    isValidDt = true;
                    break;
                case 'ecomb2b':
                case 'ecomurp2b':
                    iExInv['Document Date'] = getDateTime(iExInv['Document Date']);
                    isValidDt = validateDate(iExInv['Document Date'], iMonthsList);
                    break;
                case 'ecomab2b':
                case 'ecomaurp2b':
                    iExInv['Revised Document Date'] = getDateTime(iExInv['Revised Document Date']);
                    iExInv['Original Document Date'] = getDateTime(iExInv['Original Document Date']);
                    isValidDt = (validateDate(iExInv['Revised Document Date'], iMonthsList)
                    && validateDate(iExInv['Original Document Date'], iMonthsList));
                    break;
                case 'supecoa':
                    var curntYear = iExInv['Financial Year'],
                        curntMonth = iExInv['Original Month/Quarter'];
                    isValidDt = isValidRtnPeriod(iYearsList, curntYear, curntMonth).isValidPeriod;
                    break;
        }
    } else if (iForm === "GSTR2") {
        switch (iSecID) {
            case 'b2b': // GSTR2
                iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                break;
            case 'b2bur': // GSTR2
                iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                break;
            case 'b2ba': // GSTR2
            case 'b2bura': // GSTR2
                iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                isValidDt = validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList);
                break;

            case 'cdnr': // GSTR2
                iExInv['Invoice/Advance Payment Voucher date'] = getDateTime(iExInv['Invoice/Advance Payment Voucher date']);
                iExInv['Note/Refund Voucher date'] = getDateTime(iExInv['Note/Refund Voucher date']);
                if (iExInv['Pre GST'] == 'Y') {
                    isValidDt = (!validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList)) && (validateDate(iExInv['Note/Refund Voucher date'], iMonthsList));
                } else {
                    isValidDt = validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList) && validateDate(iExInv['Note/Refund Voucher date'], iMonthsList);
                }
                break;
            case 'cdnur': // GSTR2
                iExInv['Invoice/Advance Payment Voucher date'] = getDateTime(iExInv['Invoice/Advance Payment Voucher date']);
                iExInv['Note/Voucher date'] = getDateTime(iExInv['Note/Voucher date']);
                if (iExInv['Pre GST'] == 'Y') {

                    isValidDt = (!validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList)) && (validateDate(iExInv['Note/Voucher date'], iMonthsList));
                } else {
                    isValidDt = validateDate(iExInv['Invoice/Advance Payment Voucher date'], iMonthsList) && validateDate(iExInv['Note/Voucher date'], iMonthsList);
                }
                break;
            case 'cdnra': // GSTR2
                iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                iExInv['Revised Debit Note date'] = getDateTime(iExInv['Revised Debit Note date']);
                iExInv['Original Debit Note date'] = getDateTime(iExInv['Original Debit Note date']);
                isValidDt = validateDate(iExInv['Invoice date'], iMonthsList) && validateDate(iExInv['Original Debit Note date'], iMonthsList) && validateDate(iExInv['Revised Debit Note date'], iMonthsList);
                break;
            case 'imp_g': // GSTR2
                iExInv['Bill Of Entry Date'] = getDateTime(iExInv['Bill Of Entry Date']);

                isValidDt = validateDate(iExInv['Bill Of Entry Date'], iMonthsList);
                break;
            case 'imp_ga': // GSTR2
                iExInv['Original Bill Of Entry date'] = getDateTime(iExInv['Original Bill Of Entry date']);
                iExInv['Revised Bill Of Entry date'] = getDateTime(iExInv['Revised Bill Of Entry date']);

                isValidDt = validateDate(iExInv['Original Bill Of Entry date'], iMonthsList) && validateDate(iExInv['Revised Bill Of Entry date'], iMonthsList);
                break;
            case 'imp_s':
                if (iExInv.hasOwnProperty('Invoice date')) {
                    iExInv['Invoice date'] = getDateTime(iExInv['Invoice date']);
                    isValidDt = validateDate(iExInv['Invoice date'], iMonthsList);
                } else {
                    iExInv['Invoice Date'] = getDateTime(iExInv['Invoice Date']);
                    isValidDt = validateDate(iExInv['Invoice Date'], iMonthsList);
                }

                break;
            case 'imp_sa': // GSTR2
                iExInv['Original Invoice date'] = getDateTime(iExInv['Original Invoice date']);
                iExInv['Revised Invoice date'] = getDateTime(iExInv['Revised Invoice date']);
                isValidDt = validateDate(iExInv['Revised Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList);
                break;
            case 'txi': // GSTR2
                iExInv['Document date'] = true;
                isValidDt = true
                break;
            case 'atxi': // GSTR2
                iExInv['Original Document date'] = getDateTime(iExInv['Original Document date']);
                iExInv['Revised Document date'] = getDateTime(iExInv['Revised Document date']);

                isValidDt = validateDate(iExInv['Original Document date'], iMonthsList) && validateDate(iExInv['Revised Document date'], iMonthsList);
                break;

            case 'atadj': // GSTR2
                iExInv['Document date'] = true;
                isValidDt = true;
                break;
            case 'hsnsum': // GSTR2
            case 'itc_rvsl': // GSTR2
            case 'nil': // GSTR2
                isValidDt = true;
                break;
        }
    }

    return (isValidDt);
}

//To check rates a/c to supplytype(in case of exp/expa withoutpayment values should be 0)
function validateRates(iInv, iType, iSecId) {
    return true;
    var isValid = false;
    if (iType) {
        if (iType.name === "Intra-State") {
            //                    if (iInv['IGST Rate'] == 0 && iInv['IGST Amount'] == 0) {
            if (iInv['Rate'] == 0) {
                isValid = true;
            }
        } else {
            //                    if (iInv['CGST Rate'] == 0 && iInv['CGST Amount'] == 0 && iInv['SGST Rate'] == 0 && iInv['SGST Amount'] == 0) {
            if (iInv['Rate'] == 0 /* && iInv['CGST Amount'] == 0 && iInv['SGST Rate'] == 0 && iInv['SGST Amount'] == 0*/) {
                isValid = true;
            }
        }
    }

    if (iSecId == "exp" || iSecId == "expa")
        if (iInv["Export Type"] == "WOPAY") {
            if (iInv['Rate'] == 0) {
                isValid = true;
            } else {
                isValid = false;
            }
        } else {
            if (iInv['Rate'] == 0) {
                isValid = true;
            } else {
                isValid = false;
            }
        }

    return isValid;

}

//To check rates a/c to supplytype(in case of exp/expa withoutpayment values should be 0)
function validateExcelTaxRates(iInv, iSecId, iSpLs, iForm) {
    var isValidTaxRates = false;

    suplyTyp = null;
    if (iForm == "GSTR1") {
        switch (iSecId) {
            case 'b2b':
            case 'b2ba':
                suplyTyp = getSupplyType(iSpLs, iInv["GSTIN/UIN of Recipient"], (iInv["Place Of Supply"]).substring(0, 2));
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case 'b2cl':
            case 'b2cla':
                var gstin = (thisShareData.dashBoardDt.gstin).slice(0, 2),
                    pos,
                    suplyTyp;
                if (iSecId == 'b2cla') {
                    pos = iInv["Original Place Of Supply"]
                } else {
                    pos = iInv["Place Of Supply"]
                }

                if (pos) {
                    if (gstin === pos) {
                        suplyTyp = iSpLs[1];
                    } else {
                        suplyTyp = iSpLs[1];
                    }
                }
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case "b2cs":
            case "cdnr":
            case "cdnra":
            case "cdnur":
                suplyTyp = getSupplyType(iSpLs, thisShareData.dashBoardDt.gstin, iInv[trans.LBL_POS_Excel]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case "b2csa":

                suplyTyp = getSupplyType(iSpLs, thisShareData.dashBoardDt.gstin, iInv["Place Of Supply"]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;

            case "atadj":
                suplyTyp = getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                isValidTaxRates = true;
                break;
            case "at":
                suplyTyp = getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                isValidTaxRates = true;
                break;
            case "ata":
                suplyTyp = getSupplyType(iSpLs, iInv["Revised Customer GSTIN/UIN/Name"], iInv["Recipient State Code"]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case 'exp':
            case 'expa':
                isValidTaxRates = validateRates(iInv, null, iSecId);
                break;
            case 'hsn':
            case  'hsn(b2b)':
            case  'hsn(b2c)':        
                isValidTaxRates = validateRates(iInv, null, iSecId);
                break;
            case 'nil':
                isValidTaxRates = validateRates(iInv, null, iSecId);
                break;
        }
    } else if (iForm == "GSTR2") {
        switch (iSecId) {
            case 'b2b': // GSTR2
            case 'b2ba': // GSTR2
                suplyTyp = getSupplyType(iSpLs, iInv["Supplier GSTIN"], iInv["Place Of Supply"]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case 'b2bur': // GSTR2
            case 'b2bura': // GSTR2
                suplyTyp = iInv["Supply Type"];
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case "cdnr": // GSTR2
            case "cdnra": // GSTR2
            case "cdnur": // GSTR2
                suplyTyp = iInv[trans.LBL_SUPP_TYP];
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;

            case 'imp_g': // GSTR2
            case 'imp_ga': // GSTR2
            case 'imp_s': // GSTR2
            case 'imp_sa': // GSTR2
                //  suplyTyp =iSpLs[1];
                isValidTaxRates = true;
                break;
            case 'txi': // GSTR2
                suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place of Supply"]);
                isValidTaxRates = true;

                break;
            case 'atxi': // GSTR2
                suplyTyp = getSupplyType(iSpLs, iInv['Revised Supplier GSTIN'], iInv["Recipient State Code"]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case 'hsnsum': // GSTR2
                isValidTaxRates = validateRates(iInv, null, iSecId);
                break;
            case 'itc_rsvl': // GSTR2
                suplyTyp = getSupplyType(iSpLs, iInv['Supplier GSTIN']);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case 'atadj': // GSTR2
                suplyTyp = R1Util.getSupplyType(iSpLs, shareData.dashBoardDt.gstin, iInv["Place of Supply"]);

                isValidTaxRates = true;

                break;


        }
    }
    return isValidTaxRates;
}

function getSupplyType(suplyList, ctin, pos, sup_ty, isSEZ) {
    var rtObj = null,
        gstin = (thisShareData.dashBoardDt.gstin).slice(0, 2);
    if (thisShareData.dashBoardDt.form == "GSTR1" || thisShareData.dashBoardDt.form == "GSTR2A") {
        if (pos) {
            if (isSEZ) {
                rtObj = suplyList[1];
            }
            else {
                if (gstin === pos) {
                    rtObj = suplyList[0];
                } else {
                    rtObj = suplyList[1];
                }
            }
        } else if (ctin) {
            var ctinPos = (ctin).slice(0, 2);
            if (isSEZ) {
                rtObj = suplyList[1];
            }
            else {
                if (gstin === ctinPos) {
                    rtObj = suplyList[0];
                } else {
                    rtObj = suplyList[1];
                }
            }
        }
        // FIX DEFECT: 5957 AND 5954
        if (!isSEZ && (sup_ty == 'SEWP' || sup_ty == 'SEWOP' || sup_ty == 'CBW')) {

            rtObj = suplyList[1];
        }
    } else {
        if (ctin && pos) {
            var ctinPos = ctin.slice(0, 2);
            if (ctinPos == pos) {
                rtObj = suplyList[0];
            } else {
                rtObj = suplyList[1];
            }
        } else if (sup_ty) {
            if (sup_ty === "IRAP") {
                rtObj = suplyList[0];
            } else {
                rtObj = suplyList[1];
            }
        } else if (thisShareData.dashBoardDt.gstin) {
            var gstin = thisShareData.dashBoardDt.gstin.slice(0, 2);
            if (pos) {
                if (gstin === pos) {
                    rtObj = suplyList[0];
                } else {
                    rtObj = suplyList[1];
                }
            } else if (ctin) {
                var ctinPos = (ctin).slice(0, 2);
                if (gstin === ctinPos) {
                    rtObj = suplyList[0];
                } else {
                    rtObj = suplyList[1];
                }
            }
        }
    }
    return rtObj;
}

//To check mandatory fields n regex patterns for fields from excel
function validatePattern(iString, isMandatory, iPattern, isPos) {
    var isValid = false;
    if (iString != null && iString !== "") {
        isValid = isMandatory ? true : true;
        if (iPattern) {
            var patt = new RegExp(iPattern),
                isPatternValid = false;
            isPatternValid = patt.test(iString);

            isValid = isValid && isPatternValid ? true : false;
        }
        if (isPos) {
            var pos0to38 = (parseInt(iString) >= 1 && parseInt(iString) <= 38),
                pos97 = (parseInt(iString) == 97), pos96 = (parseInt(iString) == 96);
            isValid = (pos0to38 || pos97 || pos96) ? true : false;
        }
    } else {
        isValid = isMandatory ? false : true;
    }
    return isValid;
}

//To chck value in b2cl >=250000 or not from excel
function isValidTotalInvValue(val) {
    return (val > 250000) ? true : false
}

//To check itc this month values greater than Earlier
function validateItcValues(prvAmt, curntAmt) {
    if (prvAmt && curntAmt) {
        return (parseFloat(curntAmt) <= parseFloat(prvAmt)) ? true : false;
    }
}
// To get Note Supply Type
function getNoteSupplyType(isec, invtype) {

    if ((isec == 'cdnr' || isec == 'cdnra') && thisShareData.dashBoardDt.form == 'GSTR1') {
        if (invtype.trim() == 'Regular B2B') return "R";
        else if (invtype.trim() == "Deemed Exp") return "DE";
        else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
        else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
        else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
    }
    else if (isec == 'cdnr' || isec == 'cdnra') {
        if (invtype.trim() == 'Regular') return "R";
        else if (invtype.trim() == "Deemed Exp") return "DE";
        else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
        else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
        else if (invtype.trim() == "Intra-State supplies attracting IGST") return "CBW";
    }
};

var preparePayloadFromExcel = function (oData, getInvFn, getItmFn, excelRefKey, newFormateKey, iSecID, iForm, iMonthsList, iYearsList, iSpLs, supplier_gstin, isSEZ, uploadImport) {
    var myRegExObj = regExObj();
    var iData = null;
    var invAry = [];
    iData = convertStrToNum(oData, "Rate");
    iData = convertStrToNum(iData, "Amount");
    iData = convertStrToNum(iData, "Value");
    iData = convertNumToStr(iData, "Number");
    iData = convertNumToStr(iData, "HSN");
    iData = trimIt(iData, "Number");

    var isValidItemAction = true,//To check item level actions
        isValidErrorStatus = true; //To check item level error status. added by pavani


    function getMatchedInv(iAry, iNum, iCompareKey, iExInv, iSecID, iYearsList) { //This also checks item level actions

        var rInv = null,
            rErrInv = null,
            rActionErrInv = null,
            rErrorStatusInv = null;

        for (var i = 0, len = iAry.length; i < len; i++) {
            if (!iAry[i]['ctin'] && iSecID !== "itc_rvsl")
                iAry[i]['ctin'] = '';
            if (!iExInv[trans.GSTIN_SUPPLLIER])
                iExInv[trans.GSTIN_SUPPLLIER] = '';
            if (!iExInv[trans.LBL_GSTIN_UIN_RECIPIENT])
                iExInv[trans.LBL_GSTIN_UIN_RECIPIENT] = '';

            var checkOriginalKey = false;
            if (iSecID.endsWith('a') || iSecID == 'ecomab2c' || iSecID == 'ecomaurp2c') {
                var oNum = null, oMonth = null, oYear = null, curntOMon = null;
                var oCompareKey = 'o' + iCompareKey;
                if (iSecID == 'b2ba' || iSecID == 'b2cla' || iSecID == 'expa') {
                    oNum = iExInv[trans.LBL_ORG_INV_NO];
                } else if (iSecID == 'cdnra' || iSecID == 'cdnura') {
                    oNum = iExInv['Original Note/Refund Voucher Number'];
                } else if (iSecID == 'ata' || iSecID == 'atadja' || iSecID == 'b2csa') {
                    oCompareKey = "omon";
                    oMonth = iExInv[trans.LBL_ORG_MONTH];
                    oYear = iExInv[trans.LBL_FINANCIAL_YEAR];
                    oNum = isValidRtnPeriod(iYearsList, oYear, oMonth).monthValue;
                }

                checkOriginalKey = oNum && iAry[i][oCompareKey] && (oNum).toLowerCase() == (iAry[i][oCompareKey]).toLowerCase()
            }
            if (iSecID == 'ecomab2c' || iSecID == 'ecomaurp2c') {
                oCompareKey = "omon";
                oMonth = iExInv[trans.LBL_ORG_MONTH];
                oYear = iExInv[trans.LBL_FINANCIAL_YEAR];
                oNum = isValidRtnPeriod(iYearsList, oYear, oMonth).monthValue;
            }else if(iSecID == 'supecoa'){
                oCompareKey = "omon";
                oMonth = iExInv['Original Month/Quarter'];
                oYear = iExInv[trans.LBL_FINANCIAL_YEAR];
                oNum = isValidRtnPeriod(iYearsList, oYear, oMonth).monthValue;
            }

            checkOriginalKey = oNum && iAry[i][oCompareKey] && (oNum).toLowerCase() == (iAry[i][oCompareKey]).toLowerCase()

            var isMatchedKeys;
            if (iSecID == "atadja" || iSecID == "ata" || iSecID == "b2csa" || iSecID == 'supecoa') {
                isMatchedKeys = iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() && checkOriginalKey;
            }
            else {
                isMatchedKeys = iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() || checkOriginalKey;
            }
            if (iForm == "GSTR1" && (iSecID == "b2cs" || iSecID == 'supecoa' || iSecID == "b2csa" || iSecID == "at" || iSecID == "ata" || iSecID == "atadja" || iSecID == "atadj")) {
                isMatchedKeys = isMatchedKeys && (iAry[i].diff_percent == iExInv[trans.LBL_Diff_Percentage] / 100);
            }
            if (iForm == "GSTR1" && (iSecID == "ecomab2c")) {
                isMatchedKeys =
                    (iExInv["Supplier GSTIN/UIN"] && iAry[i]['stin'] && (iExInv["Supplier GSTIN/UIN"]).toLowerCase() == (iAry[i]["stin"]).toLowerCase() &&
                        iExInv['Place Of Supply'] && iAry[i]['pos'] && (iExInv["Place Of Supply"]).toLowerCase() == (iAry[i]["pos"]).toLowerCase() &&
                        curntOMon && iAry[i]['omon'] && curntOMon == (iAry[i]["omon"]));
            }

            if (iForm == "GSTR1" && (iSecID == "ecomaurp2c")) {
                isMatchedKeys =
                    (iExInv['Place Of Supply'] && iAry[i]['pos'] && (iExInv["Place Of Supply"]).toLowerCase() == (iAry[i]["pos"]).toLowerCase() &&
                        curntOMon && iAry[i]['omon'] && curntOMon == (iAry[i]["omon"]));
            }

            if (iForm == "GSTR1" && (iSecID == "ecomab2b")) {
                isMatchedKeys = true;
                (
                    iExInv["Supplier GSTIN/UIN"] && iAry[i]['stin'] && (iExInv["Supplier GSTIN/UIN"]).toLowerCase() == (iAry[i]["stin"]).toLowerCase() &&
                    iExInv["Recipient GSTIN/UIN"] && iAry[i]['rtin'] && (iExInv["Recipient GSTIN/UIN"]).toLowerCase() == (iAry[i]["rtin"]).toLowerCase() &&
                    iExInv["Original Document Number"] && iAry[i]['oinum'] && (iExInv["Original Document Number"]).toLowerCase() == (iAry[i]["oinum"]).toLowerCase() &&
                    iExInv["Original Document Date"] && iAry[i]['oidt'] && (iExInv["Original Document Date"]).toLowerCase() == (iAry[i]["oidt"]).toLowerCase() &&
                    iExInv["Revised Document Number"] && iAry[i]['inum'] && (iExInv["Revised Document Number"]).toLowerCase() == (iAry[i]["inum"]).toLowerCase() &&
                    iExInv["Revised Document Date"] && iAry[i]['idt'] && (iExInv["Revised Document Date"]).toLowerCase() == (iAry[i]["idt"]).toLowerCase() &&
                    iExInv["Value of supplies made"] && iAry[i]['val'] && (iExInv["Value of supplies made"]) == (iAry[i]["val"]) &&
                    iExInv['Place Of Supply'] && iAry[i]['pos'] && (iExInv["Place Of Supply"]).toLowerCase() == (iAry[i]["pos"]).toLowerCase()
                );
            }
            if (isMatchedKeys && (iAry[i]['ctin'] == iExInv[trans.GSTIN_SUPPLLIER] || iAry[i]['ctin'] == iExInv[trans.LBL_GSTIN_UIN_RECIPIENT])) {

                //To check for invoice number as well as GSTIN
                //For sections other than b2b & cdn, undefined == undefined -> true
                //Added by Subrat 
                // THIS CAUSED ISSUE IN IMP_G, ctin was undefined gstin was empty string, normalize should be done for empty/null compare
                //Added by Vasu


                var existingInv = iAry[i];

                var isValidInv = validateInvoice(iForm, iSecID, iExInv, existingInv, iYearsList);

                if (uploadImport == 'Y') {

                    if ((iForm == "GSTR2" || iForm == "GSTR1") && (iExInv.hasOwnProperty('Saved/Submitted')
                        || iExInv.hasOwnProperty('Invoice Action Status')
                        || iExInv.hasOwnProperty('Action'))) { //To check item level actions only for GSTR2

                        isValidItemAction = isValidItemAction && validateItemLevelAction(iForm, iSecID, iExInv, existingInv);

                    }
                }
                if (uploadImport == 'E') {
                    if (iExInv.hasOwnProperty('Error Message')) { //To check item level actions only for GSTR2

                        isValidErrorStatus = isValidErrorStatus && validateItemLevelErrorStatus(iForm, iSecID, iExInv, existingInv);

                    }
                }
                if (isValidInv && isValidItemAction && isValidErrorStatus) {
                    rInv = iAry[i];
                } else {
                    if (!isValidItemAction && isValidInv) {
                        rActionErrInv = iNum;
                    }
                    if (!isValidErrorStatus && isValidInv) {
                        rErrorStatusInv = iNum;
                    }
                    if (iCompareKey != 'hsn_sc') {
                        rErrInv = iNum;
                    }
                }
                break;
            }

        }
        isValidItemAction = true;
        isValidErrorStatus = true;
        return {
            rInv: rInv,
            rErrInv: rErrInv,
            rActionErrInv: rActionErrInv,
            rErrorStatusInv: rErrorStatusInv
        };
    }


    var excelErrList = [],
        excelDateErrList = [],
        excelb2clErrList = [],
        excelB2CLInvErrList =[],
        excelMatchErrInvList = [],
        excelInvalidPattrnList = [],
        excelInvalidActionList = [],
        excelinvalidErrorStatusList = [],
        excelMissingHeaderList = [],
        excelInvalidURtypePOSList = [],
        excelInvalidURtypeDiffPerList = [],
        excelInvalidPosSupStCode = [],
        excelInvalidNtSplyTypList = [],
        getMatchObj = {}, matchedInv, excelErrInv, excelActionErrInv, excelErrorStatusInv; //Change S2809 : This array is to populate invoices with invalid actions.


    angular.forEachCustom(iData, function (inv, i) {
        if (typeof inv === 'function')
            return;
        if (typeof posItms === 'function')
        return;
        if (excelRefKey == trans.LBL_POS_Excel || excelRefKey == trans.LBL_POS_Excel_Org || excelRefKey == trans.LBL_POS_Excel_Rev) {
            if (inv[excelRefKey])
                inv[excelRefKey] = inv[excelRefKey].substring(0, 2);
        }
        var curInum = inv[excelRefKey],
            isValidExcelFields = validateExcelMandatoryFields(inv, iSecID, iForm, supplier_gstin, myRegExObj),
            isValidExcelDates = false;
        var isInvalidInvoice = false;
        var setInvoiceValueLimit = 0;
        if(Number(thisShareData.dashBoardDt.fp.substring(2) + thisShareData.dashBoardDt.fp.substring(0,2)) < Number(constants.B2CL_MIN_VAL_STR_PRD.substring(2) + constants.B2CL_MIN_VAL_STR_PRD.substring(0,2)) 
            && (thisShareData.dashBoardDt.form == 'GSTR1' && (iSecID == 'b2cl' || iSecID == 'b2cla'))){
            setInvoiceValueLimit = 250000;
        }else{
            setInvoiceValueLimit = constants.B2CL_MIN_VAL;
         }
         if(inv['Invoice Value'] <= setInvoiceValueLimit && (iSecID == 'b2cl' || iSecID == 'b2cla')){ 
            isInvalidInvoice = true;
         }
        if (isValidExcelFields) isValidExcelDates = validateExcelDates(inv, iSecID, iForm, iMonthsList, iYearsList);
        var isValidExcelData = validateExcelData(inv, iSecID, iForm),
            isValidShipDate = validateLessThanInvDate(inv, iSecID, iForm);
        if (iSecID == "cdnur" || iSecID == "cdnura") {
            let isPOSRequiredCDN = validatePOSwithURType(inv, trans);
            let isDiffPerRequired = validateDiffPerwithURType(inv, trans);
            let isValidPosSupStCode = validatePOSWithSupStCode(inv, trans, supplier_gstin);
            if (!isPOSRequiredCDN && isPOSRequiredCDN !== undefined && isPOSRequiredCDN != null) {
                let errListPOS = [];
                errListPOS.push(parseInt(i) + 5);
                excelInvalidURtypePOSList.push({
                    cd: iSecID,
                    dt: errListPOS
                });
            }
            if (!isDiffPerRequired && isDiffPerRequired !== undefined && isDiffPerRequired != null) {
                let errListDiff = [];
                errListDiff.push(parseInt(i) + 5);
                excelInvalidURtypeDiffPerList.push({
                    cd: iSecID,
                    dt: errListDiff
                });
            }
            if (!isValidPosSupStCode && isValidPosSupStCode !== undefined && isValidPosSupStCode != null) {
                let errListPosStCode = [];
                errListPosStCode.push(parseInt(i) + 5);
                excelInvalidPosSupStCode.push({
                    cd: iSecID,
                    dt: errListPosStCode
                });
            }
        }
        if (iSecID == "cdnr" || iSecID == "cdnra" || iSecID == "b2b" || iSecID == "b2ba" || iSecID == "ecomb2b" || iSecID == "ecomurp2b" || iSecID == "ecomab2b" || iSecID == "ecomaurp2b") {
            let isValidNtSplyTyp = validateNoteSupplyType(inv, trans, iSecID);
            if (!isValidNtSplyTyp && isValidNtSplyTyp !== undefined && isValidNtSplyTyp != null) {
                let errListNtSply = [];
                errListNtSply.push(parseInt(i) + 5);
                excelInvalidNtSplyTypList.push({
                    cd: iSecID,
                    dt: errListNtSply
                });
            }
        }
        //Change S2809
        var isValidExcelActions = true;
        var isValidExcelErrorActions = true;

        if (isValidExcelFields && isValidExcelData) {

            if (uploadImport == 'Y') {
                if (inv.hasOwnProperty('Saved/Submitted') || inv.hasOwnProperty('Mandatory Check Field(Please DO NOT Update/Delete)')) {
                    isValidExcelActions = validateExcelActions(inv, iSecID, iForm);

                }
            }

            if (uploadImport == 'E') {
                if (!inv['Error Code'] || inv['Error Status'] !== 'Edit')
                    isValidExcelErrorActions = false;
            }
        }



        //S2809 - added the validation check for actions
        if (isValidExcelData && isValidExcelDates && isValidExcelFields && isValidExcelActions && isValidExcelErrorActions && isValidShipDate && !isInvalidInvoice) {
            getMatchObj = getMatchedInv(invAry, curInum, newFormateKey, inv, iSecID, iYearsList);
            matchedInv = getMatchObj.rInv;
            excelErrInv = getMatchObj.rErrInv;
            excelActionErrInv = getMatchObj.rActionErrInv;
            excelErrorStatusInv = getMatchObj.rErrorStatusInv;
            if (!excelErrInv && !excelActionErrInv && !excelErrorStatusInv) {
                if (matchedInv && getItmFn) {

                    //item repeated
                    if (iSecID == 'doc_issue') {
                        var newItmNum = (matchedInv.docs.length + 1),
                            newItm = getItmFn(newItmNum, inv);
                        matchedInv.docs.push(newItm);
                    }
                    else {
                        var newItmNum = (matchedInv.itms.length + 1);
                        var newItm = getItmFn(newItmNum, inv);
                        var rateFound = false;
                        for (var ll = 0; ll < matchedInv.itms.length; ll++) {

                            if (typeof matchedInv.itms[ll].itm_det != 'undefined' && typeof matchedInv.itms[ll].itm_det.rt != 'undefined' && matchedInv.itms[ll].itm_det.rt == newItm.itm_det.rt) {
                                matchedInv.itms[ll] = newItm;
                                rateFound = true;
                            } else if (typeof matchedInv.itms[ll].rt != 'undefined' && matchedInv.itms[ll].rt == newItm.rt) {
                                matchedInv.itms[ll] = newItm;
                                rateFound = true;
                            }
                        }
                        if (rateFound == false) {
                            matchedInv.itms.push(newItm);
                        }
                    }

                } else {

                    if (((iSecID == 'b2cl' || iSecID == 'b2cla') && !isSEZ)) { //|| iSecID == "cdnura"||iSecID == "cdnur" || (iSecID == 'b2b' && inv['Invoice Type'] !== 'Regular')

                        var isValidRow = isInterStateRow(inv, iSecID, isSEZ);
                        if (isValidRow) {

                            invAry.push(getInvFn(1, inv, getItmFn));
                        }
                        else {
                            var errList = [];

                            errList.push(curInum);
                            excelb2clErrList.push({
                                cd: iSecID,
                                dt: errList
                            });
                        }
                    }
                    else {
                        invAry.push(getInvFn(1, inv, getItmFn));
                    }
                }
            } else {
                if (excelErrInv && getItmFn && !excelActionErrInv && !excelErrorStatusInv) {
                    var errList = [];
                    errList.push(curInum);
                    var unique = errList.filter(function (curInum, index, self) {
                        return index == self.indexOf(curInum);
                    })
                    errList = unique;

                    excelMatchErrInvList.push({
                        cd: iSecID,
                        dt: errList
                    });
                } else if ((excelActionErrInv || !isValidExcelActions) && getItmFn) {
                    var index = invAry.indexOf(curInum);
                    invAry.splice(index, 1);
                    var errList = [];
                    errList.push(curInum);
                    var unique = errList.filter(function (curInum, index, self) {
                        return index == self.indexOf(curInum);
                    })
                    errList = unique;
                    excelInvalidActionList.push({
                        cd: iSecID,
                        dt: errList
                    });
                }
                else if ((excelErrorStatusInv || !isValidExcelErrorActions) && getItmFn) {
                    var index = invAry.indexOf(curInum);
                    invAry.splice(index, 1);
                    var errList = [];
                    errList.push(curInum);
                    var unique = errList.filter(function (curInum, index, self) {
                        return index == self.indexOf(curInum);
                    })
                    errList = unique;
                    excelinvalidErrorStatusList.push({
                        cd: iSecID,
                        dt: errList
                    });
                }

            }
        } 
        else if (curInum && isValidExcelData && isValidExcelFields && isValidExcelActions && isValidExcelErrorActions && isValidShipDate && !isInvalidInvoice) {

            var errList = [];

            errList.push(curInum);
            excelErrList.push({
                cd: iSecID,
                dt: errList
            });
          //  console.log("excelErrList:",excelErrList)
        }
        else if (curInum && isValidExcelData && isValidExcelFields && !isValidShipDate && !isInvalidInvoice) {

            var errList = [];
            errList.push(curInum);
            excelDateErrList.push({
                cd: iSecID,
                dt: errList
            });
        } else if(isInvalidInvoice && (iSecID == 'b2cl' || iSecID == 'b2cla')){
            var errList = [];
            errList.push(parseInt(i) + 5);
            excelB2CLInvErrList.push({
                cd: iSecID,
                dt: errList
            });
        }
         else if (!isValidExcelFields && isValidExcelData && isValidShipDate) {
            var errList = [];

            errList.push(parseInt(i) + 5);

            excelInvalidPattrnList.push({
                cd: iSecID,
                dt: errList
            });

        } else if (isValidExcelData && (!isValidExcelFields || !isValidExcelDates)) {

            var errList = [];

            errList.push(parseInt(i) + 5);
            excelInvalidPattrnList.push({
                cd: iSecID,
                dt: errList
            });

        } else if (!isValidExcelActions && isValidExcelFields) {
            var errList = [];
            errList.push(curInum);
            var unique = errList.filter(function (curInum, index, self) {
                return index == self.indexOf(curInum);
            })
            errList = unique;
            excelInvalidActionList.push({
                cd: iSecID,
                dt: errList
            });
        }
        else if (!isValidExcelErrorActions && isValidExcelFields) {
            var errList = [];
            errList.push(curInum);
            var unique = errList.filter(function (curInum, index, self) {
                return index == self.indexOf(curInum);
            })
            errList = unique;
            excelinvalidErrorStatusList.push({
                cd: iSecID,
                dt: errList
            });
        }
        else if (!isValidExcelData) {
            //to validate if section has invalid / missing column headers added by prakash
            if (excelMissingHeaderList.length === 0) {
                excelMissingHeaderList.push({
                    cd: iSecID
                });
            }
            else {
                excelMissingHeaderList.forEach(function (iSecID) {
                    if (excelMissingHeaderList.indexOf(iSecID) === -1) {
                        excelMissingHeaderList.push({
                            cd: iSecID
                        });
                    }
                });
            }
        }
    });

    if (iForm == "GSTR2" && (iSecID == 'nil' || iSecID == 'itc_rvsl')) {
        var my_obj = {}

        for (var i = 0; i < invAry.length; i++) {
            var this_keys = Object.keys(invAry[i]);

            for (var j = 0; j < this_keys.length; j++) {
                my_obj[this_keys[j]] = invAry[i][this_keys[j]];
            }
        }
        invAry = [my_obj];

    }
    //To reject whole invoice if multi items doesn't contain same actions...only going inside if item level details exist
    if (excelInvalidActionList.length && getItmFn) {
        for (var i = 0; i < excelInvalidActionList.length; i++) {
            var data = excelInvalidActionList[i].dt
            for (var j = 0; j < data.length; j++) {
                for (var k = 0; k < invAry.length; k++) {
                    if (data[j] == invAry[k][newFormateKey])
                        invAry.splice(k, 1);
                    break;
                }

            }
        }
    }
    //To reject whole invoice if multi items doesn't contain same error status...only going inside if item level details exist
    if (excelinvalidErrorStatusList.length && getItmFn) {
        for (var i = 0; i < excelinvalidErrorStatusList.length; i++) {
            var data = excelinvalidErrorStatusList[i].dt
            for (var j = 0; j < data.length; j++) {
                for (var k = 0; k < invAry.length; k++) {
                    if (data[j] == invAry[k][newFormateKey])
                        invAry.splice(k, 1);
                    break;
                }

            }
        }
    }
    return {
        inv: invAry,
        errInv: excelErrList,
        macthedErrList: excelMatchErrInvList,
        excelInvldPattrnList: excelInvalidPattrnList,
        excelB2CLInvErrList: excelB2CLInvErrList,
        excelb2clErrList: excelb2clErrList,
        excelDateErrList: excelDateErrList,
        excelInvalidActionList: excelInvalidActionList,
        excelinvalidErrorStatusList: excelinvalidErrorStatusList,
        excelMissingHeaderList: excelMissingHeaderList,
        excelInvalidURtypePOSList: excelInvalidURtypePOSList,
        excelInvalidURtypeDiffPerList: excelInvalidURtypeDiffPerList,
        excelInvalidPosSupStCode: excelInvalidPosSupStCode,
        excelInvalidNtSplyTypList: excelInvalidNtSplyTypList
    };
}


function isInterStateRow(iInv, iSecId, isSEZ) {
    var isInterStateRw;
    if (iSecId == 'b2cl' || iSecId == 'b2cla') {
        var gstin = (thisShareData.dashBoardDt.gstin).slice(0, 2),
            oPos = (iSecId == 'b2cla') ? iInv["Original Place Of Supply"] : iInv["Place Of Supply"],
            pos = (oPos) ? (oPos).substring(0, 2) : 0;
        if (gstin == pos) {
            isInterStateRw = false;
        }
        else {
            isInterStateRw = true;
        }
    } else if ((iSecId == "cdnra" || iSecId == "cdnura") && isSEZ) {
        if (iInv['Supply Type'] == 'Inter State') {
            isInterStateRw = true;
        }
        else {
            isInterStateRw = false;
        }
    } else if ((iSecId == "nil") && isSEZ) {
        if (iInv['Description'] == 'Intra-State supplies to registered persons' || iInv['Description'] == 'Intra-State supplies to unregistered persons') {
            if (cnvt2Nm(iInv['Nil Rated Supplies']) > 0 || cnvt2Nm(iInv['Exempted(other than nil rated/non GST supply)']) > 0 || cnvt2Nm(iInv['Non-GST Supplies']) > 0) {
                isInterStateRw = false;
            }
            else {
                isInterStateRw = true;
            }
        }
        else {
            isInterStateRw = true;
        }
    }
    else {
        isInterStateRw = true;
    }
    return isInterStateRw;

}



//to chk whtr date is in dd-mmm-yy/yyyy format or not
function isValidDateFormat(userDateString) {
    if (typeof (userDateString) === "number") {
        var numericDate = userDateString;
        var date = moment('1899-12-30').add(numericDate, 'days');
        var dateFormat1 = "DD-MMM-YYYY",
            dateFormat2 = "DD-MMM-YY",
            dateFormat3 = "D-MMM-YYYY",
            dateFormat4 = "D-MMM-YY",

            isValidFormat = null;
        var myMoment1 = moment(date, dateFormat1, true),
            myMoment2 = moment(date, dateFormat2, true),
            myMoment3 = moment(date, dateFormat3, true),
            myMoment4 = moment(date, dateFormat4, true);
        if (myMoment1.isValid() || myMoment2.isValid() || myMoment3.isValid() || myMoment4.isValid()) {
            isValidFormat = true;

        } else {
            isValidFormat = false;

        }
    } else {
        var dateFormat1 = "DD-MMM-YYYY",
            dateFormat2 = "DD-MMM-YY",
            dateFormat3 = "D-MMM-YYYY",
            dateFormat4 = "D-MMM-YY",

            isValidFormat = null;

        var myMoment1 = moment(userDateString, dateFormat1, true),
            myMoment2 = moment(userDateString, dateFormat2, true),
            myMoment3 = moment(userDateString, dateFormat3, true),
            myMoment4 = moment(userDateString, dateFormat4, true);
        if (myMoment1.isValid() || myMoment2.isValid() || myMoment3.isValid() || myMoment4.isValid()) {
            isValidFormat = true;

        } else {
            isValidFormat = false;

        }
    }
    return isValidFormat;
}


function validateDate(iDate, iMonthsList, allowFuture) {
    var dateFormat = "DD/MM/YYYY";
    if (!allowFuture)
        allowFuture = false;
    var rtDt = null,
        temp = "01" + thisShareData.dashBoardDt.fp.slice(0, 2) + thisShareData.dashBoardDt.fp.slice(2),
        lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
        lastDate1 = lastDate.format(dateFormat),
        firstMonth = iMonthsList[0],
        temp1 = "01072017",
        firstDate = moment(temp1, dateFormat),
        firstDate1 = firstDate.format(dateFormat),
        isNotFutureDate = (moment(iDate, dateFormat).isAfter(moment(lastDate1, dateFormat))) ? false : true,
        isNotPrevDate = (moment(iDate, dateFormat).isBefore(moment(firstDate1, dateFormat))) ? false : true;
    return ((allowFuture || isNotFutureDate) && isNotPrevDate);
}

//to validate month in case of b2csa(should be exist monnths from dashboard)
function validateMonth(oMon) {
    var isValidMon = false,
        existMonths = thisShareData.curFyMonths;
    angular.forEachCustom(existMonths, function (month, i) {
        if (month.value == oMon) {
            isValidMon = true;
        }
    })
    return isValidMon;

}

function convertStrToNum(oData, iKey) {
    var stData = extend(true, {}, oData)
    angular.forEachCustom(stData, function (inv, i) {
        var keys = Object.keys(inv);
        angular.forEachCustom(keys, function (key, i) {
            if (key.indexOf(iKey) != -1) {
                var type = typeof (inv[key]);
                if (inv[key] && typeof (inv[key]) != "number") {
                    inv[key] = parseFloat(inv[key].replace(',', ''));
                }
            }
        })
    })
    return stData;
}

function trimIt(oData, iKey) {
    var stData = extend(true, {}, oData)
    angular.forEachCustom(stData, function (inv, i) {
        var keys = Object.keys(inv);
        angular.forEachCustom(keys, function (key, i) {
            if (inv[key] && typeof (inv[key]) != "number") {
                inv[key] = inv[key].trim();
            }
        })
    })
    return stData;
}

function convertNumToStr(oData, iKey) {

    var stData = extend(true, {}, oData)
    angular.forEachCustom(stData, function (inv, i) {
        var keys = Object.keys(inv);
        angular.forEachCustom(keys, function (key, i) {
            if (key.indexOf(iKey) != -1) {
                var type = typeof (inv[key]);
                if (inv[key] && typeof (inv[key]) != "string") {
                    inv[key] = inv[key].toString();
                }
            }
        })
    })
    return stData;
}
//Change S2809 (Subrat)
function validateExcelActions(inv, iSecID, iForm) {

    if (iSecID == 'itc_rvsl' || iSecID == 'nil') //Not checking action for itcr and nil AND SHOULD BE ON TOP
        return true;

    if (iForm == 'GSTR1') { //temparory condition for gstr1 until actions was implemented

        if (inv['Mandatory Check Field(Please DO NOT Update/Delete)'] && (inv['Action'] == 'Add')) {
            return false;
        }
        else {
            return true;
        }
    }

    if (iForm == 'GSTR2' && (iSecID == 'b2b' || iSecID == 'cdnr')) {
        if (inv['Saved/Submitted'] == 'Submitted' && (inv['Action'] == 'Add' || inv['Action'] == 'Delete' || inv['Action'] == 'Edit')) {
            return false;
        }
        else if ((inv['Saved/Submitted'] == 'Saved' || inv['Saved/Submitted'] === undefined) &&
            (inv['Action'] == 'Accept' ||
                inv['Action'] == 'Reject' ||
                inv['Action'] == 'Pending' ||
                inv['Action'] == 'Modify' ||
                inv['Action'] == 'Edit' ||
                inv['Action'] == 'Delete')) {

            return false;
        }
        else if ((inv['Saved/Submitted'] == '') &&
            (inv['Action'] == 'Accept' ||
                inv['Action'] == 'Reject' ||
                inv['Action'] == 'Pending' ||
                inv['Action'] == 'Modify')) {
            return false;
        }

        else {
            return true;
        }
    }
    else if (inv['Action'] == 'Add' || inv['Action'] == 'Delete') {
        return true;
    }
    else {
        return false;
    }
}

function validateItemLevelAction(iForm, iSecId, iExInv, existingInv) {

    var existingFlagStr = existingInv['flag'];
    var currFlagStr;
    if (iForm == 'GSTR1')
        currFlagStr = getR1FlagValue(iExInv['Action']); //temparory condition for gstr1 till actions implemented by pavani
    else
        currFlagStr = getFlagValue(iExInv['Action'], iExInv['Saved/Submitted'], iExInv['Invoice Action Status']);
    //To check if flag is present or not. If not present, assume that it has been added now and set it to U just to check whether it has the same action for all items or not.

    if (existingFlagStr == undefined)
        existingFlagStr = "";
    if (currFlagStr == undefined)
        currFlagStr = "";

    if (currFlagStr != existingFlagStr
        && (currFlagStr != "" && existingFlagStr != 'U'))
        return false;
    return true;
}
//End S2809

//CR 6881 start - pavani

function validateItemLevelErrorStatus(iForm, iSecId, iExInv, existingInv) {

    var existingFlagStr = existingInv['error_msg'];
    var currFlagStr = (iExInv['Error Status'] == 'Edit') ? 'M' : '';

    if (existingFlagStr == undefined)
        existingFlagStr = "";
    if (currFlagStr == undefined)
        currFlagStr = "";

    if (currFlagStr != existingFlagStr)
        return false;
    return true;
}


// }

//End CR6881

function validateStatusWithJson(iForm, iSecId, iExInv, existingInv) {
    //Json has Saved but excel has Submitted then discard
    if (existingInv.hasOwnProperty('cfs') && existingInv['cfs'] == 'N' && iExInv['Saved/Submitted'] == 'Submitted') {

        return false;
    }

    //Json has Submitted but excel has Saved then discard
    if (existingInv.hasOwnProperty('cfs') && existingInv['cfs'] == 'Y' && iExInv['Saved/Submitted'] == 'Saved') {

        return false;
    }
    return true;

}

function searchInActionErrList(iSecID, nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].cd == iSecID && myArray[i].dt.indexOf(nameKey) > -1) {
            return true;
        }
    }
    return false;
}
function regExObj() {
    return {
        //added reg-ex by prakash
        taxableVal: /^(\d{0,11})(\.\d{0,2})?$/,
        noteType: /^(C|D)$/,
        InvNoteNumber: /^[a-zA-Z0-9-\/]{1,16}$/,
        diffPercentage: /^(100|65)$/,
        InvNoteValue: /^(\d{0,13})(\.\d{0,2})?$/,
        urType: /^(B2CL|EXPWP|EXPWOP|)$/,
        rates: /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/,
        cessAmount: /^(\d{0,11})(\.\d{0,2})?$/,
        reverseChrge: /^(Y|N)$/,
        //prakash changes end
        tmpgstin: /^[a-zA-Z0-9]{6,25}$/,
        pan: /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
        tan: /^[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}$/,
        mobile: /^[1-9]{1}[0-9]{9}$/,
        tlphno: /^[1-9]{1}[0-9]{9}$/,
        email: /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
        inum: /^[a-zA-Z0-9\/\-]*$/,
        captcha: /^([0-9]){6}$/,
        passport: /^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/,
        piocard: /^[pP]\d{7}$/,
        gstin: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/,
        tdsnormalgstin: /([0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1})|([0-9]{2}[a-zA-Z]{4}[a-zA-Z0-9]{1}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[D]{1}[0-9a-zA-Z]{1})/,
        uin: /[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/,
        nrid: /[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}/,
        tdsid: /[0-9]{2}[a-zA-Z]{4}[a-zA-Z0-9]{1}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[D]{1}[0-9a-zA-Z]{1}/,
        provisional: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/ | /^[0-9]{4}[A][R][0-9]{7}[Z]{1}[0-9]{1}/ | /^[0-9]{2}[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}/ | /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[0-9]{1}[Z]{1}[0-9]{1}/,
        number: /^[0-9]*$/,
        fo_otp: /^[0-9]+$/,
        pincode: /^[0-9]{6}$/,
        zipcode: /^[A-Za-z0-9]{1,60}$/,
        aadhar: /\d{12}$/,
        fo_user: /^[a-zA-Z][a-zA-Z0-9_\.\-]*$/,
        fo_password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\@\!\#\%\^\$\&\`\*\-\_\+])(?=.*[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
        fo_secans: /^[a-zA-Z0-9@._*\/\-]+(\s+[a-zA-Z0-9@._*\/\-\s]+)*$/,
        otp: /^[0-9]{6}$/,
        svat: /^[A-Za-z0-9\/]{6,25}$/,
        othr: /^[A-Za-z0-9\/]{6,25}$/,
        cst: /^[A-Za-z0-9]{6,25}$/,
        entax: /^[A-Za-z0-9]{6,25}$/,
        etax: /^[A-Za-z0-9]{6,25}$/,
        et: /^[A-Za-z0-9]{6,25}$/,
        ent: /^[A-Za-z0-9]{6,25}$/,
        hlt: /^[A-Za-z0-9]{6,25}$/,
        hltax: /^[A-Za-z0-9]{6,25}$/,
        seact: /^[A-Za-z0-9]{6,25}$/,
        exact: /^[A-Za-z0-9]{6,25}$/,
        llpin: /^[A-Za-z0-9]{6,25}$/,
        ce: /^[A-Za-z0-9]{6,25}$/,
        svtax: /^[A-Za-z0-9]{6,25}$/,
        cin: /^[A-Za-z0-9\-]{6,25}$/,
        llp: /^[A-Za-z0-9\-]{6,25}$/,
        iec: /^[A-Za-z0-9]{6,25}$/,
        mnt: /^[A-Za-z0-9]{6,25}$/,
        globalpassport: /^[A-Za-z0-9 -\/]{8,15}$/,
        trn: /[0-9]{12}(T|t)(R|r)(N|n)$/,

        name: /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/,
        buidno: /^[a-zA-Z0-9 \/_\-\,\.]{1,60}$/,
        floorno: /^[a-zA-Z0-9\-\\\/\.\, ]{1,60}$/,
        faxno: /^[0-9]{11,16}$/,
        tName: /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/,
        reason: /^[a-zA-Z0-9\_\-\/.,&%$ ]{1,500}$/,
        din: /^[0-9]{8}$/,
        acno: /^[A-Za-z0-9]{6,20}$/,

        pwdtooltip_user: /^([a-zA-Z0-9\_\-\.]){8,15}$/,
        pwdtooltip_uppercase: /[A-Z]/,
        pwdtooltip_lowercase: /[a-z]/,
        pwdtooltip_num: /[0-9]/,
        pwdtooltip_symbol: /[\@\!\#\%\^\$\&\`\*\-\_\+]+/,
        pwdtooltip_pwd: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*^[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
        latlng: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/,
        quantity: /^(?=.*[0-9])([-]?[0-9]{0,15}|[-]?[0-9]{0,15}\.{1}[0-9]{0,2})$/,
        itcqty: /^([0-9]{0,15}|[0-9]{0,15}\.{1}[0-9]{0,2})$/,
        uqc: /^[a-zA-Z]{0,30}$/,
        desc: /^[a-zA-Z0-9\/\-/\s/g]*$/,
        etin: /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}$/,
        nrtp: /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}$/,
        quantityr9: /^([-]?[0-9]{0,13}|[-]?[0-9]{0,13}\.{1}[0-9]{0,2})$/
    };
}
module.exports = {
    getInv: getInv,
    getItm: getItm,
    formateNodePayload: formateNodePayload,
    scopelists: scopelists,
    getExcelTitle: getExcelTitle,
    reformateInv: reformateInv,
    getInvKey: getInvKey,
    preparePayloadFromExcel: preparePayloadFromExcel,
    isCurrentPeriodBeforeAATOCheck: isCurrentPeriodBeforeAATOCheck
};
