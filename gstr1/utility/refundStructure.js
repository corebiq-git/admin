var extend = require('node.extend');
var moment = require('moment');
var angular = require('./angularHelper');
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
    yearPattern = /^(2017-18|2018-19)$/;
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
    { "value": "BGS", "name": "BGS-BAGS" }, { "value": "BKL", "name": "BKL-BUCKLES" }, { "value": "BOU", "name": "BOU-BOU" }, { "value": "BOX", "name": "BOX-BOX" }, { "value": "BTL", "name": "BTL-BOTTLES" }, { "value": "BUN", "name": "BUN-BUNCHES" }, { "value": "CBM", "name": "CBM-CUBIC METER" }, { "value": "CCM", "name": "CCM-CUBIC CENTIMETER" }, { "value": "CIN", "name": "CIN-CUBICINCHES" }, { "value": "CMS", "name": "CMS" }, { "value": "CQM", "name": "CQM-CUBIC METERS" }, { "value": "CTN", "name": "CTN-CARTON" }, { "value": "DOZ", "name": "DOZ-DOZEN" }, { "value": "DRM", "name": "DRM-DRUM" }, { "value": "FTS", "name": "FTS-FEET" }, { "value": "GGR", "name": "GGR-GREAT GROSS" }, { "value": "GMS", "name": "GMS-GRAMS" }, { "value": "GRS", "name": "GRS-GROSS" }, { "value": "GYD", "name": "GYD-GROSS YARDS" }, { "value": "HKS", "name": "HKS-HANKS" }, { "value": "INC", "name": "INC-INCHES" }, { "value": "KGS", "name": "KGS-Kilograms" }, { "value": "KLR", "name": "KLR-KILOLITRE" }, { "value": "KME", "name": "KME-KILOMETERS" }, { "value": "LBS", "name": "LBS-POUNDS" }, { "value": "LOT", "name": "LOT-LOTS" }, { "value": "LTR", "name": "LTR-LITERS" }, { "value": "MGS", "name": "MGS-MILLI GRAMS" }, { "value": "MTR", "name": "MTR-METER" }, { "value": "MTS", "name": "MTS-METRIC TON" }, { "value": "NOS", "name": "NOS-Numbers" }, { "value": "ODD", "name": "ODD-ODDS" }, { "value": "PAC", "name": "PAC-PACKS" }, { "value": "PCS", "name": "PCS-Pieces" }, { "value": "PRS", "name": "PRS-PAIRS" }, { "value": "QTL", "name": "QTL-QUINTAL" }, { "value": "ROL", "name": "ROL-ROLLS" }, { "value": "SDM", "name": "SDM-DECAMETER SQUARE" }, { "value": "SET", "name": "SET-SETS" }, { "value": "SHT", "name": "SHT-SHEETS" }, { "value": "SQF", "name": "SQF-SQUARE FEET" }, { "value": "SQI", "name": "SQI-SQUARE INCHES" }, { "value": "SQM", "name": "SQM-SQUARE METER" }, { "value": "SQY", "name": "SQY-SQUARE YARDS" }, { "value": "TBS", "name": "TBS-TABLETS" }, { "value": "THD", "name": "THD-THOUSANDS" }, { "value": "TOL", "name": "TOL-TOLA" }, { "value": "TON", "name": "TON-GREAT BRITAIN TON" }, { "value": "TUB", "name": "TUB-TUBES" }, { "value": "UGS", "name": "UGS-US GALLONS" }, { "value": "UNT", "name": "UNT-UNITS" }, { "value": "VLS", "name": "VLS-Vials" }, { "value": "YDS", "name": "YDS-YARDS" }
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
    //return 'U';
}


// To get Invoice Type
function getInvType(isec, invtype) {
    if (isec == 'b2b' || isec == 'b2ba') {
        if (invtype.trim() == 'Regular') return "R";
        else if (invtype.trim() == "Deemed Exp") return "DE";
        else if (invtype.trim() == "SEZ supplies with payment") return "SEWP";
        else if (invtype.trim() == "SEZ supplies without payment") return "SEWOP";
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


function getSupplyTypeForAt(pos) {
    var dashGstin = thisShareData.dashBoardDt.gstin.slice(0, 2),
        isSEZ = thisShareData.isSezTaxpayer,
        sply_ty;
    if (dashGstin == pos && !isSEZ) {
        sply_ty = 'INTRA'
    }
    else {
        sply_ty = 'INTER'
    }
    return sply_ty;
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
function testPattern(iString, iPattern) {
    var patt = new RegExp(iPattern),
        isPatternValid = patt.test(iString);
    return isPatternValid;
}

//To validate GSTIN/UIN
function validateGSTIN(ctin, iForm) {
    var validGstin = false;
    if (iForm == 'GSTR1')
        validGstin = gstin(ctin) || uin(ctin);
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
            angular.forEachCustom(obj.months, function (monObj, i) {
                if (monObj.month.toLowerCase() === curntMonth.toLowerCase()) {
                    monthValue = monObj.value;
                    isValidPeriod = true;
                }
            });

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

    var rtFn = null;
    if (iForm == "GSTR1") {
        switch (iSec) {
            case 'b2b':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    //console.log(inv.hasOwnProperty('Applicable % of Tax Rate'));
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "inum": inv['Invoice Number'],
                        "idt": inv['Invoice date'],
                        "val": cnvt2Nm(inv['Invoice Value']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "rchrg": inv['Reverse Charge'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        /* "prs": inv['Provisional Assessment'],*/
                        "etin": inv['E-Commerce GSTIN'],
                        "inv_typ": getInvType(iSec, inv['Invoice Type']),
                        "ctin": inv['GSTIN/UIN of Recipient'],
                        "cname": inv['Receiver Name'],

                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'b2ba':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "oinum": inv['Original Invoice Number'],
                        "oidt": inv['Original Invoice date'],
                        "inum": inv['Revised Invoice Number'],
                        "idt": inv['Revised Invoice date'],
                        "val": cnvt2Nm(inv['Invoice Value']),
                        "pos": (inv['Place Of Supply']).substring(0, 2),
                        "rchrg": inv['Reverse Charge'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        /* "prs": inv['Provisional Assessment'],*/
                        "etin": inv['E-Commerce GSTIN'],
                        "inv_typ": getInvType(iSec, inv['Invoice Type']),
                        "cname": inv['Receiver Name'],
                        "ctin": inv['GSTIN/UIN of Recipient'],
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'b2cl':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "etin": inv['E-Commerce GSTIN'],
                        "inum": inv['Invoice Number'],
                        "idt": inv['Invoice date'],
                        "val": cnvt2Nm(inv['Invoice Value']),
                        "pos": (inv['Place Of Supply']).slice(0, 2),
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]

                    };
                }
                break;
            case 'b2cla':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        /*"state_cd": (inv['Recipient State Code'] < 10) ? "0" + inv['Recipient State Code'] : "" + inv['Recipient State Code'],*/
                        "oinum": inv['Original Invoice Number'],
                        "oidt": inv['Original Invoice date'],
                        "etin": inv['E-Commerce GSTIN'],
                        "inum": inv['Revised Invoice Number'],
                        "idt": inv['Revised Invoice date'],
                        "val": cnvt2Nm(inv['Invoice Value']),
                        "pos": (inv['Original Place Of Supply']).slice(0, 2),
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
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
                    if (dashGstin == statecd && !isSEZ) {
                        return {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };

                    }
                    else {
                        return {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
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
                    if (dashGstin == statecd && !isSEZ) {
                        return {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };

                    }
                    else {
                        return {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                    }

                }
                break;
            case 'exp':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "exp_typ": inv['Export Type'],
                        "inum": inv['Invoice Number'],
                        "idt": inv['Invoice date'],
                        "val": cnvt2Nm(inv['Invoice Value']),
                        "sbpcode": inv['Port Code'],
                        "sbnum": cnvt2Nm(inv['Shipping Bill Number']),
                        "sbdt": inv['Shipping Bill Date'],
                        //                                "prs": inv['Provisional Assessment'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'expa':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "exp_typ": inv['Export Type'],
                        "oinum": inv['Original Invoice Number'],
                        "oidt": inv['Original Invoice date'],
                        "inum": inv['Revised Invoice Number'],
                        "idt": inv['Revised Invoice date'],
                        "val": cnvt2Nm(inv['Invoice Value']),
                        "sbpcode": inv['Port Code'],
                        "sbnum": cnvt2Nm(inv['Shipping Bill Number']),
                        "sbdt": inv['Shipping Bill Date'],
                        //                                "prs": inv['Provisional Assessment'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'cdnr':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "nt_num": inv['Note/Refund Voucher Number'],
                        "nt_dt": inv['Note/Refund Voucher date'],
                        "inum": inv['Invoice/Advance Receipt Number'],
                        "ntty": inv["Document Type"],
                        // "rsn": inv["Reason For Issuing document"],
                        "idt": inv['Invoice/Advance Receipt date'],
                        "val": cnvt2Nm(inv['Note/Refund Voucher Value']),
                        "p_gst": inv['Pre GST'],
                        "pos": inv['Place Of Supply'].substring(0, 2),
                        "ctin": inv['GSTIN/UIN of Recipient'],
                        "cname": inv['Receiver Name'],
                        //  "etin": inv['E-Commerce GSTIN'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'cdnur':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "nt_num": inv['Note/Refund Voucher Number'],
                        "nt_dt": inv['Note/Refund Voucher date'],
                        "inum": inv['Invoice/Advance Receipt Number'],
                        "ntty": inv["Document Type"],
                        // "rsn": inv["Reason For Issuing document"],
                        "idt": inv['Invoice/Advance Receipt date'],
                        "val": cnvt2Nm(inv['Note/Refund Voucher Value']),
                        "p_gst": inv['Pre GST'],
                        "typ": inv['UR Type'],
                        "pos": (inv['Place Of Supply']) ? (inv['Place Of Supply']).substring(0, 2) : inv['Place Of Supply'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'cdnra':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "ont_num": inv['Original Note/Refund Voucher Number'],
                        "ont_dt": inv['Original Note/Refund Voucher date'],
                        "nt_num": inv['Revised Note/Refund Voucher Number'],
                        "nt_dt": inv['Revised Note/Refund Voucher date'],
                        "inum": inv['Original Invoice/Advance Receipt Number'],
                        "ntty": inv["Document Type"],
                        // "rsn": inv["Reason For Issuing document"],
                        "idt": inv['Original Invoice/Advance Receipt date'],
                        "val": cnvt2Nm(inv['Note/Refund Voucher Value']),
                        "p_gst": inv['Pre GST'],
                        "sp_typ": inv['Supply Type'],
                        //"pos": inv['Place Of Supply'].substring(0, 2),
                        "ctin": inv['GSTIN/UIN of Recipient'],
                        "cname": inv['Receiver Name'],
                        //  "etin": inv['E-Commerce GSTIN'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
                }
                break;
            case 'cdnura':
                rtFn = function (i, inv, itemFn) {
                    var diffFactor = null, diffval = true;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate')) {
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);
                        diffval = false;
                    }
                    return {
                        "ont_num": inv['Original Note/Refund Voucher Number'],
                        "ont_dt": inv['Original Note/Refund Voucher date'],
                        "nt_num": inv['Revised Note/Refund Voucher Number'],
                        "nt_dt": inv['Revised Note/Refund Voucher date'],
                        "inum": inv['Original Invoice/Advance Receipt Number'],
                        "ntty": inv["Document Type"],
                        // "rsn": inv["Reason For Issuing document"],
                        "idt": inv['Original Invoice/Advance Receipt date'],
                        "val": cnvt2Nm(inv['Note/Refund Voucher Value']),
                        "p_gst": inv['Pre GST'],
                        "typ": inv['UR Type'],
                        "sp_typ": inv['Supply Type'],
                        //"pos": inv['Place Of Supply'].substring(0, 2),
                        //  "etin": inv['E-Commerce GSTIN'],
                        "diff_percent": diffFactor,
                        "diffval": diffval,
                        "itms": [itemFn(i, inv)]
                    };
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
                    if (!inv['E-Commerce GSTIN'])
                        inv['E-Commerce GSTIN'] = "";


                    if (pos == dashGstin && !isSEZ) {
                        return {
                            "sply_ty": "INTRA",
                            "rt": inv['Rate'],
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "pos": pos,
                            "diff_percent": diffFactorField,
                            "diffval": diffval,
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "camt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactorCalc),
                            "samt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactorCalc),
                            "csamt": cnvt2Nm(inv['Cess Amount'])
                        }
                    } else {
                        return {
                            "sply_ty": "INTER",
                            "rt": (inv['Rate']),
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "pos": pos,
                            "diff_percent": diffFactorField,
                            "diffval": diffval,
                            "txval": cnvt2Nm(inv['Taxable Value']),
                            "iamt": cnvt2Nm(inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactorCalc),
                            "csamt": cnvt2Nm(inv['Cess Amount']),
                        }
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
                    if (!inv['E-Commerce GSTIN'])
                        inv['E-Commerce GSTIN'] = "";
                    var pos = (inv['Revised Place Of Supply']).substring(0, 2),
                        year = inv['Financial Year'],
                        month = inv['Original Month'];
                    if (pos == dashGstin && !isSEZ) {
                        return {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "sply_ty": "INTRA",
                            //"rt": inv['Original Rate'],
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "opos": (inv['Original Place Of Supply']).substring(0, 2),
                            "pos": (inv['Revised Place Of Supply']).substring(0, 2),
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            /*"txval": cnvt2Nm(inv['Taxable Value']),
                            "camt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005).toFixed(2)),
                            "samt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005).toFixed(2)),
                            "csamt": cnvt2Nm(inv['Cess Amount']),*/
                            "itms": [itemFn(i, inv)]

                        }
                    } else {
                        return {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "sply_ty": "INTER",
                            //"rt": (inv['Original Rate']),
                            "typ": inv['Type'],
                            "etin": inv['E-Commerce GSTIN'],
                            "opos": (inv['Original Place Of Supply']).substring(0, 2),
                            "pos": (inv['Revised Place Of Supply']).substring(0, 2),
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            /*"txval": cnvt2Nm(inv['Taxable Value']),
                            "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01).toFixed(2)),
                            "csamt": cnvt2Nm(inv['Cess Amount']),*/
                            "itms": [itemFn(i, inv)]
                        }
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
                    if (dashGstin == statecd && !isSEZ) {
                        return {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };

                    }
                    else {
                        return {
                            "pos": inv["Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
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
                    if (dashGstin == statecd && !isSEZ) {
                        return {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };

                    }
                    else {
                        return {
                            "omon": isValidRtnPeriod(iYearsList, year, month).monthValue,
                            "pos": inv["Original Place Of Supply"].substring(0, 2),
                            "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                            "diff_percent": diffFactor,
                            "diffval": diffval,
                            "itms": [itemFn(i, inv)]
                        };
                    }


                }
                break;
            case 'hsn':
                rtFn = function (i, inv, itemFn) {
                    return {
                        "num": parseInt(i),
                        "hsn_sc": inv['HSN'],
                        "desc": inv['Description'],
                        "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),//inv['UQC']
                        "qty": cnvt2Nm(inv['Total Quantity']),
                        "val": cnvt2Nm(inv['Total Value']),
                        "txval": cnvt2Nm(inv['Taxable Value']),
                        "iamt": cnvt2Nm(inv['Integrated Tax Amount']),
                        "samt": cnvt2Nm(inv['State/UT Tax Amount']),
                        "camt": cnvt2Nm(inv['Central Tax Amount']),
                        "csamt": cnvt2Nm(inv['Cess Amount'])
                    };
                };
                break;
            case 'nil':
                rtFn = function (i, inv, itemFn) {
                    var type = getNilType(iSec, inv['Description']);
                    // if ((type == 'INTRAB2B' || type == 'INTRAB2C') && isSEZ) {
                    //     return {
                    //         "sply_ty": type,
                    //         "expt_amt": 0,
                    //         "nil_amt": 0,
                    //         "ngsup_amt": 0
                    //     };
                    // }
                    // else {
                    return {
                        "sply_ty": type,
                        "expt_amt": (inv['Exempted(other than nil rated/non GST supply)']) ? cnvt2Nm(inv['Exempted(other than nil rated/non GST supply)']) : 0,
                        "nil_amt": (inv['Nil Rated Supplies']) ? cnvt2Nm(inv['Nil Rated Supplies']) : 0,
                        "ngsup_amt": (inv['Non-GST Supplies']) ? cnvt2Nm(inv['Non-GST Supplies']) : 0
                    };

                };
                break;
            case 'doc_issue':
                var docDetails = ["Invoices for outward supply",
                    "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", " Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];
                rtFn = function (i, inv, itemFn) {
                    return {
                        "doc_num": docDetails.indexOf(inv['Nature of Document']) + 1,
                        "doc_typ": inv['Nature of Document'],
                        "docs": [itemFn(i, inv)]
                    };
                };
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
                        else// if (inv['Saved/Submitted'] == 'Saved')
                            tempCFS = 'N';
                        if (inv['Saved/Submitted'] == 'Submitted' || inv['Saved/Submitted'] == 'Saved')
                            tempUpdBy = "S";
                        //if ((!inv.hasOwnProperty('Saved/Submitted') && inv['Action'] == 'Add') || (inv['Saved/Submitted'] == 'Saved' && inv['Action'] == 'Add')) {
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
                        else// if (inv['Saved/Submitted'] == 'Saved')
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
                        // console.log(inv['Note/Refund Voucher Number']+":"+tempCFS);
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
                            //"pos": (inv['Place of Supply']) ? (inv['Place of Supply']).substring(0, 2) : inv['Place of Supply'],
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
                            //"pos": (inv['Place of Supply']) ? (inv['Place of Supply']).substring(0, 2) : inv['Place of Supply'],
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
                                "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        else {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                    } else {
                        /*var statecd = inv['Place Of Supply'].substring(0, 2);
                        if (dashGstin == statecd) {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        else {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                                "itms": [itemFn(i, inv)]
                            };
                        }*/
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
                            //(inv['Supply Type']).substring(0, 2) : inv['Supply Type'],
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
                            //(inv['Supply Type']).substring(0, 2) : inv['Supply Type'],
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
                            "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),//inv['UQC']
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
                            "uqc": (inv['UQC'].substring(0, inv['UQC'].indexOf("-"))).trim(),//inv['UQC']
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
                                "sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        else {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                                "flag": getFlagValue(tempAction, "NA", "NA"),
                                "itms": [itemFn(i, inv)]
                            };
                        }
                    } else {
                        /*if (dashGstin == statecd) {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                //"sply_ty": 'INTRA',//inv['Gross Taxable Amount'],
                                "itms": [itemFn(i, inv)]
                            };
                        }
                        else {
                            return {
                                "pos": inv["Place Of Supply"].substring(0, 2),
                                "sply_ty": 'INTER',//inv['Gross Taxable Amount'],
                                "itms": [itemFn(i, inv)]
                            };
                        }*/
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
    //            if(dashGstin.substring(0,1)=="0"){
    //                dashGstin=dashGstin.substring(1,2);
    //            }
    if (iForm == "GSTR1") {
        var intraState = false;
        switch (iSec) {
            case 'b2b':
            case 'b2ba':
                rtFn = function (i, inv) {
                    var invType = getInvType(iSec, inv['Invoice Type']);


                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    var tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
                    //tempNum = parseInt(i)//Old code for num; Now changed to Rate*100
                    if (dashGstin == inv['Place Of Supply'].substring(0, 2) && (invType == 'R' || invType == 'DE') && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "camt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2))),
                                "samt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || invType === 'SEWOP' || invType === 'DE' || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    } else {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": (invType === 'SEWOP') ? 0 : (parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2))),
                                "csamt": (!inv['Cess Amount'] || invType === 'SEWOP' || invType === 'DE' || inv['Cess Amount'] == '') ? 0 : parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'b2cl':
            case 'b2cla':
                rtFn = function (i, inv) {
                    var tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required
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
                                "txval": inv['Taxable Value'],
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
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'cdnr':
                //case 'cdnra':
                rtFn = function (i, inv) {
                    var tempNum = inv['Rate'] * 100 + 1;

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    if (dashGstin == inv['Place Of Supply'].substring(0, 2) && !isSEZ) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
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
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'cdnra':
                rtFn = function (i, inv) {
                    var tempNum = inv['Rate'] * 100 + 1;

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    if ('Inter State' != inv['Supply Type']) {
                        return {
                            "num": tempNum,
                            "itm_det": {
                                "txval": inv['Taxable Value'],
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
                                "txval": inv['Taxable Value'],
                                "rt": inv['Rate'],
                                "iamt": parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                                "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                            }
                        };
                    }
                }
                break;
            case 'cdnur':
            case 'cdnura':
                rtFn = function (i, inv) {
                    var tempNum = inv['Rate'] * 100 + 1; // now minimum 0 is required

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    return {
                        "num": tempNum,
                        "itm_det": {
                            "txval": inv['Taxable Value'],
                            "rt": inv['Rate'],

                            "iamt": (inv["UR Type"] == "EXPWOP") ? 0 : parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),

                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
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
                            "ad_amt": parseFloat(inv['Gross Advance Received']),
                            "camt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "samt": parseFloat((inv['Gross Advance Received'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }
                    else {
                        return {

                            "rt": inv['Rate'],
                            "ad_amt": parseFloat(inv['Gross Advance Received']),
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
                            "ad_amt": parseFloat(inv['Gross Advance Adjusted']),
                            "camt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "samt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.005 * diffFactor).toFixed(2)),
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }
                    else {
                        return {

                            "rt": inv['Rate'],
                            "ad_amt": parseFloat(inv['Gross Advance Adjusted']),
                            "iamt": parseFloat((inv['Gross Advance Adjusted'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),//inv['CGST Amount'],
                            "csamt": parseFloat((parseFloat(inv['Cess Amount']).toFixed(2)))
                        }
                    }

                };
                break;

            /*case 'ata':
                rtFn = function (i, inv) {
                    return {
                        "txval": inv['Total Taxable Value'],
                        "irt": inv['IGST Rate'],
                        "iamt": inv['IGST Amount'],
                        "crt": inv['CGST Rate'],
                        "camt": inv['CGST Amount'],
                        "srt": inv['SGST Rate'],
                        "samt": inv['SGST Amount'],
                        "csrt": inv['CESS Rate'],
                        "csamt": inv['Cess Amount']
                    }
                };
                break;*/
            case 'exp':
            case 'expa':
                rtFn = function (i, inv) {

                    var diffFactor = 1.00;
                    if (inv.hasOwnProperty('Applicable % of Tax Rate'))
                        diffFactor = (inv['Applicable % of Tax Rate'] / 100).toFixed(2);

                    return {
                        "txval": inv['Taxable Value'],
                        "rt": inv['Rate'],
                        "iamt": (inv["Export Type"] == "WOPAY") ? 0 : parseFloat((inv['Taxable Value'] * inv['Rate'] * 0.01 * diffFactor).toFixed(2)),
                        "csamt": cnvt2Nm(inv['Cess Amount'])
                    }

                };
                break;
            case 'doc_issue':
                rtFn = function (i, inv) {
                    return {
                        "num": parseInt(i),
                        "from": inv['Sr. No. From'],
                        "to": inv['Sr. No. To'],
                        "totnum": parseFloat(inv['Total Number']),
                        "cancel": parseFloat(inv['Cancelled']),
                        "net_issue": parseFloat(inv['Total Number'] - inv['Cancelled'])
                    }

                };
                break;
            case 'b2csa':
                rtFn = function (i, inv) {
                    var statecd = inv['Revised Place Of Supply'].substring(0, 2);

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
                    //tempNum = parseInt(i);
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
                    //tempNum = parseInt(i);
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
                    //tempNum = parseInt(i);
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
                    //tempNum = inv['Rate'];
                    //if (dashGstin == statecd) 
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
                    //tempNum = parseInt(i);
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
                    //tempNum = parseInt(i);
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
                    //tempNum = inv['Rate'];
                    //if (dashGstin == statecd) 
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
                            if (isErrReform) {
                                inv['error_msg'] = list['error_msg'];
                                inv['error_cd'] = list['error_cd'];
                            }
                            /*inv['sp_typ'] = $scope.getSupplyType(inv['etin'], inv['pos']);*/
                            inv['sp_typ'] = getSupplyType(spLs, inv['ctin'], inv['pos'], inv['inv_typ'], thisShareData.isSezTaxpayer);
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'b2cl':
            case 'b2cla':
                function getSupplyTypeC(iSpLs, gstn, pos) {
                    var suplyTyp;
                    if (pos) {
                        if (gstn === pos) {
                            suplyTyp = iSpLs[1];
                        } else {
                            suplyTyp = iSpLs[1];
                        }
                    }
                    return suplyTyp;
                }
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.inv, function (inv) {
                            inv['pos'] = list['pos'];
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
                        inv['sply_ty'] = getSupplyTypeForAt(inv['pos']);

                        inv['uni_key'] = inv['pos'] + "_" + inv['rt'] + "_" + inv['etin'];

                        rtArry.push(inv);
                    });

                    return rtArry;
                }
                break;
            case 'b2csa':
                //console.log("yaha to aya h ");
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['sply_ty'] = getSupplyTypeForAt(inv['pos']);
                        inv['uni_key'] = inv['omon'] + "_" + inv['pos'] + "_" + inv['etin'];
                        var iYY = inv['omon'].substring(2),
                            iYY2 = cnvt2Nm(inv['omon'].substring(4)) + 1;
                        inv['oyear'] = iYY + "-" + iYY2;
                        rtArry.push(inv);
                    });

                    return rtArry;
                }
                break;
            case 'at':
            //case 'ata':
            case 'atadj':
            case 'txpd':
                //case 'atadja':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (inv) {
                        inv['sply_ty'] = getSupplyTypeForAt(inv.pos)
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
                        var iYY = inv['omon'].substring(2),
                            iYY2 = cnvt2Nm(inv['omon'].substring(4)) + 1;
                        inv['oyear'] = iYY + "-" + iYY2;
                        inv['sply_ty'] = getSupplyTypeForAt(inv.pos)
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
                            rtArry.push(inv);
                        });
                    });
                    return rtArry;
                }
                break;
            case 'cdn':
            case 'cdnr':
                //case 'cdnra':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.nt, function (nt) {
                            nt['ctin'] = list['ctin'];
                            nt['cname'] = list['cname'];

                            if (nt.itms.length && nt.itms[0].itm_det && !nt.pos) {
                                if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                    nt['sp_typ'] = spLs[0];
                                } else {
                                    nt['sp_typ'] = spLs[1];
                                }

                            }
                            else {

                                nt['sp_typ'] = getSupplyType(spLs, nt['ctin'], nt['pos'], null, thisShareData.isSezTaxpayer); //spLs[1];
                            }

                            rtArry.push(nt);
                        });
                    });
                    return rtArry;
                }
                break;



            //            case 'cdnur':
            //                rtFn = function (iResp) {
            //                    var rtArry = [];
            //                    angular.forEachCustom(iResp, function (list) {
            //                       if (typeof list.itms[0].itm_det.iamt == 'undefined') {
            //                            list['sp_typ'] = spLs[0];
            //                        } else {
            //                            list['sp_typ'] = spLs[1];
            //                        }
            //                        rtArry.push(nt);
            //                    });
            //                    return rtArry;
            //                }
            //
            //
            //                break;
            case 'cdnra':
                rtFn = function (iResp) {
                    var rtArry = [];
                    angular.forEachCustom(iResp, function (list, i) {
                        angular.forEachCustom(list.nt, function (nt) {
                            nt['ctin'] = list['ctin'];
                            nt['cname'] = list['cname'];

                            //if (nt.itms.length && nt.itms[0].itm_det && !nt.pos) {
                            if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                nt['sp_typ'] = spLs[0];
                            } else {
                                nt['sp_typ'] = spLs[1];
                            }

                            // }
                            /*else {

                                nt['sp_typ'] = getSupplyType(spLs, nt['ctin'], nt['pos']); //spLs[1];
                            }*/

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
                        /*angular.forEach(iResp, function(inv) {
                            inv['sp_typ'] = spLs[1];

                            rtArry.push(inv);
                        });*/
                        list['sp_typ'] = spLs[1];
                        rtArry.push(list);
                    });
                    return rtArry;

                }
                break;


            //case 'atadj':

            //rtFn = function (iResp) {
            //var rtArry = [];
            //angular.forEachCustom(iResp, function (inv) {
            /* if ((inv['irt'] == 0 && inv['iamt'] == 0) || (inv['srt'] == 0 && inv['samt'] == 0 && inv['crt'] == 0 && inv['camt'] == 0)) {
                 if ((inv['irt'] == 0 && inv['iamt'] == 0)) {
                     inv['sp_typ'] = spLs[1];
                 } else {
                     inv['sp_typ'] = spLs[0];
                 }
             }*/
            //inv['sp_typ'] = getSupplyType(spLs, inv['cpty']); //spLs[1];
            // rtArry.push(inv);
            // });
            // return rtArry;
            //}
            //break;
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
                            /*inv['sp_typ'] = $scope.getSupplyType(inv['etin'], inv['pos']);*/
                            /*inv['sp_typ'] = getSupplyType(spLs, inv['ctin'], inv['pos']);*/
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
                        inv['sp_typ'] = spLs[1]; //R1Util.getSupplyType(spLs, gstn, inv['state_cd']);
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
                        /*inv['sply_ty'] = getSupplyTypeForAt(inv.pos)
                        rtArry.push(inv);*/
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
                        //console.log(data);
                        //console.log('----')
                        if (data == null)
                            return;
                        //console.log('----')
                        rtArry.push(data);
                    });
                    return rtArry;
                }

                break;
            // case 'itc_rvsl': // GSTR2
            //     rtFn = function (iResp) {
            //         var rtArry = [];
            //         angular.forEachCustom(iResp, function (inv, i) {
            //             inv['sp_typ'] = getSupplyType(spLs, inv['stin']); // $scope.onStinChange(inv);
            //             rtArry.push(inv);
            //         });
            //         return rtArry;
            //     }
            //     break;
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

                            //                              nt['sp_typ'] = nt['sply_typ'];
                            if (typeof nt.itms[0].itm_det.iamt == 'undefined') {
                                nt['sp_typ'] = spLs[0];
                            } else {
                                nt['sp_typ'] = spLs[1];
                            }
                            // nt['sp_typ'] = getSupplyType(spLs, nt['ctin'], nt['pos']);
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
                        /*angular.forEachCustom(iResp, function(inv) {
                            inv['sp_typ'] = spLs[1];

                            rtArry.push(inv);
                        });*/
                        if (typeof list.itms[0].itm_det.iamt == 'undefined') {
                            list['sp_typ'] = spLs[0];
                        } else {
                            list['sp_typ'] = spLs[1];
                        }

                        // list['sp_typ'] = spLs[1];
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
                        /*inv['sply_ty'] = getSupplyTypeForAt(inv.pos)
                        rtArry.push(inv);*/
                        if (typeof inv.itms[0].iamt == 'undefined') {
                            inv['sply_ty'] = "INTRA";
                        } else {
                            inv['sply_ty'] = "INTER";
                        }

                        // list['sp_typ'] = spLs[1];
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
                        //  data['uni_key'] = data['hsn_sc'] + "_" + data['desc'];

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
                    var iData = extend(true, {}, oData);
                    delete iData.sp_typ;
                    if (isErrFormate) {
                        rtData = {
                            "ctin": iData.ctin,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            //"cfs": iData.cfs,
                            "inv": []
                        }
                        delete iData.ctin;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {
                        // iData = convertStrToNum(iData);
                        rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "inv": []
                        }
                        delete iData.ctin;
                        delete iData.cname;
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
            case 'at':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'b2csa':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.oyear;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            //case 'ata':
            case 'atadj':
                //case 'atadja':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    //                            delete iData.sply_typ;
                    var rtData = {};
                    var rtData = iData;

                    return rtData;
                }
                break;
            case 'ata':
            case 'atadja':
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    delete iData.oyear;
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
                    /*if (!oData.updby) {
                        oData.updby = "S";
                    }*/
                    var iData = extend(true, {}, oData);

                    delete iData.sp_typ;
                    if (isErrFormate) {
                        rtData = {
                            "ctin": iData.ctin,
                            "error_msg": iData.error_msg,
                            "error_cd": iData.error_cd,
                            //"cfs": iData.cfs,
                            "nt": []
                        }
                        delete iData.ctin;
                        delete iData.error_msg;
                        delete iData.error_cd;
                    }
                    else {

                        rtData = {
                            "ctin": iData.ctin,
                            "cname": iData.cname,
                            "nt": []
                        }
                        delete iData.ctin;
                        delete iData.cname;
                    }

                    rtData.nt.push(iData);

                    return rtData;
                }
                break;
            case 'cdnur':
            case 'cdnura':
                rtFn = function (oData) {
                    /*if (!oData.updby) {
                        oData.updby = "S";
                    }*/
                    var iData = extend(true, {}, oData);

                    delete iData.sp_typ;

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
                    iData.qty = Number(iData.qty);
                    var rtData = {
                        "data": []
                    }

                    rtData.data.push(iData);

                    return rtData;
                }
                break;
            case 'nil':
            case 'doc_issue':
                rtFn = function (oData) {

                    var iData = extend(true, {}, oData);
                    //                            delete iData.sply_typ;
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
                    //console.log("rtData.inv[0]:"+oData);
                    return rtData;
                }
                break;


            case 'txi': // GSTR2
            case 'atxi': // GSTR2
            case 'atadj': // GSTR2
                rtFn = function (oData) {
                    var iData = extend(true, {}, oData);
                    //delete iData.sply_ty;
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
            //
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
                title = "Note/Refund Voucher Number"
                break;
            case 'cdnra':
            case 'cdnura':
                title = "Revised Note/Refund Voucher Number"
                break;
            case 'b2ba':

                title = "Revised Invoice Number"
                break;
            //                    case 'b2cs':
            //                        title = "HSN/SAC of Supply"
            //                        break;
            //                    case 'b2csa':
            //                        title = "Revised HSN"
            //                        break;

            case 'b2cla':
            case 'expa':
                title = 'Revised Invoice Number'
                break;
            case 'b2csa':
                title = 'Revised Place Of Supply'
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
            case 'nil':
                title = "Description"
                break;
            case 'doc_issue':
                title = "Nature of Document"
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
                invKey = "pos"
                break;
            case 'b2cs':
                //                    case 'b2csa':
                //                        invKey = "hsn_sc"
                break;
            case 'hsn':
                invKey = "hsn_sc";
                break;
            case 'nil':
                invKey = "sply_ty";
                break;
            case 'doc_issue':
                invKey = "doc_typ";
                break;

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

//To check mandatory fields n regex patterns for fields from excel
function validateExcelMandatoryFields(iInv, iSecId, iForm) {

    var isPttnMthced = false;
    if (iForm == "GSTR1") {
        switch (iSecId) {
            case 'b2b':
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }

                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }

                if (iInv['Invoice Type'] != 'Regular' && (iInv['E-Commerce GSTIN'])) {
                    isPttnMthced = false;
                } else {
                    isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Invoice date']) &&
                        validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Place Of Supply'], true, null, true) &&
                        validatePattern(iInv['Invoice Type'], true, null) &&
                        validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Reverse Charge'], true, /^(Y|N)$/) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                        validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                        validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                        (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                        // validatePattern(iInv['E-Commerce GSTIN'], false, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/) && 
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)

                    );
                }
                break;
            case 'b2ba':
                if (!iInv['Reverse Charge']) {
                    iInv['Reverse Charge'] = 'N';
                }

                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                    validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
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
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                    /*validatePattern(iInv['E-Commerce GSTIN'], false, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/) &&*/
                    validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'b2cl':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = ( /*validatePattern(iInv['Recipient Name'], true, /^[A-Za-z0-9. @]*$/) &&*/
                    validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    /*validatePattern(iInv['Recipient State Code'], true, null, true) &&*/
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    /*validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,}$/) &&*/
                    validatePattern(iInv['Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Invoice date']) &&
                    validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    isValidTotalInvValue(iInv['Invoice Value']) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                    // validatePattern(iInv['E-Commerce GSTIN'], false, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                    /*validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/)*/
                );
                break;
            case 'b2cla':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = ( /*validatePattern(iInv['Recipient Name'], true, /^[A-Za-z0-9. @]*$/) &&*/
                    validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    /*validatePattern(iInv['Recipient State Code'], true, null, true) &&*/
                    validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                    /*validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,}$/) &&*/
                    validatePattern(iInv['Revised Invoice date'], true, null) &&
                    validatePattern(iInv['Original Invoice date'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice date']) &&
                    isValidDateFormat(iInv['Revised Invoice date']) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    isValidTotalInvValue(iInv['Invoice Value']) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    /*validatePattern(iInv['Category'], true, /^(G|S)$/) &&*/
                    /*validatePattern(iInv['Provisional Assessment'], true, /^(Y|N)$/) &&*/
                    (iInv['E-Commerce GSTIN'] == '' || iInv['E-Commerce GSTIN'] == null) &&
                    /*
                    validatePattern(iInv['E-Commerce GSTIN'], false, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}/) &&*/
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
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
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,}$/) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Type'], true, /^(OE)$/) && isERecord &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)
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
                    validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Revised Place Of Supply'], true, null, true) &&
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,}$/) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Type'], true, /^(OE)$/) && isERecord &&
                    /*validatePattern(iInv['Type'], true, /^(E|OE)$/) && isERecord &&*/
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)
                );
                break;
            case 'cdnr':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (!iInv['Pre GST']) {
                    iInv['Pre GST'] = 'N';
                }
                isPttnMthced = (validatePattern(iInv['Invoice/Advance Receipt date'], true, null) &&
                    isValidDateFormat(iInv['Invoice/Advance Receipt date']) &&
                    isValidDateFormat(iInv['Note/Refund Voucher date']) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    // validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                    validatePattern(iInv['Document Type'], true, /^(C|D|R)$/) &&
                    validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                    validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                    // (validatePattern(iInv['GSTIN/UIN of Recipient'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/) ||
                    //     validatePattern(iInv['GSTIN/UIN of Recipient'], true, /[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/)) &&
                    validatePattern(iInv['Invoice/Advance Receipt Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Refund Voucher date'], true, null) &&
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Note/Refund Voucher Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    // validatePattern(iInv['E-Commerce GSTIN'], false, /^[a-zA-Z0-9]{15}$/) &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'cdnur':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (!iInv['Pre GST']) {
                    iInv['Pre GST'] = 'N';
                }
                var isRequired = false;
                if ((iInv['UR Type'] == "EXPWOP") || (iInv['UR Type'] == "EXPWP")) {
                    if (!iInv['Place Of Supply'])
                        isRequired = true;
                } else {
                    isRequired = validatePattern(iInv['Place Of Supply'], true, null, true)
                }
                isPttnMthced = (validatePattern(iInv['Invoice/Advance Receipt date'], true, null) &&
                    isValidDateFormat(iInv['Invoice/Advance Receipt date']) &&
                    isValidDateFormat(iInv['Note/Refund Voucher date']) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    // validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                    validatePattern(iInv['Document Type'], true, /^(C|D|R)$/) &&
                    validatePattern(iInv['Invoice/Advance Receipt Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Refund Voucher date'], true, null) &&
                    validatePattern(iInv['Note/Refund Voucher Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['UR Type'], true, /^(B2CL|EXPWP|EXPWOP|)$/) &&
                    isRequired &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'cdnra':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (validatePattern(iInv['Original Invoice/Advance Receipt Number'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice/Advance Receipt date']) &&
                    isValidDateFormat(iInv['Original Note/Refund Voucher date']) &&
                    isValidDateFormat(iInv['Revised Note/Refund Voucher date']) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    // validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                    validatePattern(iInv['Document Type'], true, /^(C|D|R)$/) &&
                    validateGSTIN(iInv['GSTIN/UIN of Recipient'], iForm) &&
                    validatePattern(iInv['GSTIN/UIN of Recipient'], true, null) &&
                    // (validatePattern(iInv['GSTIN/UIN of Recipient'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/) ||
                    //     validatePattern(iInv['GSTIN/UIN of Recipient'], true, /[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/)) &&
                    validatePattern(iInv['Original Invoice/Advance Receipt Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Original Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Original Note/Refund Voucher date'], true, null) &&
                    validatePattern(iInv['Revised Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Revised Note/Refund Voucher date'], true, null) &&
                    validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/) &&
                    //validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(cnvt2Nm(iInv['Note/Refund Voucher Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    // validatePattern(iInv['E-Commerce GSTIN'], false, /^[a-zA-Z0-9]{15}$/) &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['Receiver Name'], false, /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'cdnura':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (!iInv['Pre GST']) {
                    iInv['Pre GST'] = 'N';
                }
                var isRequired = false;
                /*if ((iInv['UR Type'] == "EXPWOP") || (iInv['UR Type'] == "EXPWP")) {
                    if (!iInv['Place Of Supply'])
                        isRequired = true;
                } else {
                    isRequired = validatePattern(iInv['Place Of Supply'], true, null, true)
                }*/
                isPttnMthced = (validatePattern(iInv['Original Invoice/Advance Receipt date'], true, null) &&
                    isValidDateFormat(iInv['Original Invoice/Advance Receipt date']) &&
                    isValidDateFormat(iInv['Original Note/Refund Voucher date']) &&
                    isValidDateFormat(iInv['Revised Note/Refund Voucher date']) &&
                    validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    // validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) &&
                    validatePattern(iInv['Document Type'], true, /^(C|D|R)$/) &&
                    validatePattern(iInv['Original Invoice/Advance Receipt Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Original Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Original Note/Refund Voucher date'], true, null) &&
                    validatePattern(iInv['Revised Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Revised Note/Refund Voucher date'], true, null) &&
                    validatePattern(cnvt2Nm(iInv['Note/Refund Voucher Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['UR Type'], true, /^(B2CL|EXPWP|EXPWOP|)$/) &&
                    validatePattern(iInv['Supply Type'], true, /^(Inter State)$/) &&
                    //isRequired &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'exp':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                if (iInv['Shipping Bill Number'] || iInv['Shipping Bill Date']) {
                    isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Invoice date']) &&
                        validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], true, /^[0-9]{0,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], true, null) &&
                        isValidDateFormat(iInv['Shipping Bill Date']) &&
                        validatePattern(iInv['Port Code'], false, null) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                    );
                }
                else {
                    isPttnMthced = (validatePattern(iInv['Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Invoice date']) &&
                        validatePattern(iInv['Invoice Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], false, /^[0-9]{0,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], false, null) &&
                        validatePattern(iInv['Port Code'], false, null) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
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
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], true, /^[0-9]{0,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], true, null) &&
                        isValidDateFormat(iInv['Shipping Bill Date']) &&
                        validatePattern(iInv['Port Code'], false, null) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                    );
                }
                else {
                    isPttnMthced = (validatePattern(iInv['Original Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Original Invoice date']) &&
                        validatePattern(iInv['Revised Invoice date'], true, null) &&
                        isValidDateFormat(iInv['Revised Invoice date']) &&
                        validatePattern(cnvt2Nm(iInv['Invoice Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(cnvt2Nm(iInv['Taxable Value']), true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                        validatePattern(iInv['Export Type'], true, /^(WPAY|WOPAY)$/) &&
                        validatePattern(iInv['Shipping Bill Number'], false, /^[0-9]{0,7}$/) &&
                        validatePattern(iInv['Shipping Bill Date'], false, null) &&
                        validatePattern(iInv['Port Code'], false, null) &&
                        validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                        validatePattern(iInv['Original Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Revised Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                        validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                        validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                    );
                }
                break;
            case 'at':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Received'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'ata':
                /*isPttnMthced = (
                    validatePattern(iInv['Recipient State Code'], true, null, true) &&
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,}$/) &&
                    validatePattern(iInv['Total Taxable Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Original Document Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Original Document date'], true, null) &&
                    isValidDateFormat(iInv['Original Document date']) &&
                    isValidDateFormat(iInv['Revised Document date']) &&
                    validatePattern(iInv['Revised Document Number'], true, /^[a-zA-Z0-9]*$/) &&
                    validatePattern(iInv['Revised Document date'], true, null) &&
                    validatePattern(iInv['Total Invoice Value'], true, /^((\d*)|(\d*.\d{0,2}))$/) &&
                    validatePattern(iInv['Original Customer GSTIN/UIN/Name'], true, /^[a-zA-Z0-9]{15}$/) &&
                    validatePattern(iInv['Revised Customer GSTIN/UIN/Name'], true, /^[a-zA-Z0-9]{15}$/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['CESS Rate'], false, /^(0|15|135|290)$/)
                );*/
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Financial Year'], true, yearPattern) &&
                    validatePattern(iInv['Original Month'], true, monthPattern) &&
                    validatePattern(iInv['Original Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Received'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'atadj':
                if (!iInv['Applicable % of Tax Rate']) {
                    iInv['Applicable % of Tax Rate'] = 100.00;
                }
                isPttnMthced = (
                    validatePattern(iInv['Place Of Supply'], true, null, true) &&
                    validatePattern(iInv['Gross Advance Adjusted'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
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
                    validatePattern(iInv['Gross Advance Adjusted'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['Applicable % of Tax Rate'], true, /^(100|65)$/) &&
                    validatePattern(cnvt2Nm(iInv['Cess Amount']), false, /^(\d{0,13})(\.\d{0,2})?$/)
                );
                break;
            case 'hsn':
                var isHSNReq = true, isDescrReq = true;
                var isITAmt = true, isSTUTAmt = true, isCTAmt = true;
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

                if (iInv['UQC'])
                    iInv['UQC'] = (iInv['UQC']).trim();
                isPttnMthced = (
                    validatePattern(iInv['HSN'], isHSNReq, /^[0-9]{2,8}$/) &&
                    validatePattern(iInv['Description'], isDescrReq, /^[ A-Za-z0-9_@./&-]{0,30}$/) &&
                    validatePattern(iInv['UQC'], true, /^[a-zA-Z -]*$/) &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['Total Quantity'])), true, /^(\-?(\d{0,15})(\.\d{0,2})?)$/) && // &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['Total Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['Taxable Value'])), true, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['Integrated Tax Amount'])), isITAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['Central Tax Amount'])), isCTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['State/UT Tax Amount'])), isSTUTAmt, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(Math.abs(cnvt2Nm(iInv['Cess Amount'])), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/)

                );
                break;
            case 'nil':
                isPttnMthced = (
                    validatePattern(cnvt2Nm(iInv['Nil Rated Supplies']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(cnvt2Nm(iInv['Exempted(other than nil rated/non GST supply)']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    validatePattern(cnvt2Nm(iInv['Non-GST Supplies']), false, /^(\-?(\d{0,13})(\.\d{0,2})?)$/) &&
                    (
                        iInv['Description'] == 'Inter-State supplies to registered persons' ||
                        iInv['Description'] == 'Intra-State supplies to registered persons' ||
                        iInv['Description'] == 'Inter-State supplies to unregistered persons' ||
                        iInv['Description'] == 'Intra-State supplies to unregistered persons'
                    )
                );
                break;
            case 'doc_issue':
                isPttnMthced = (validatePattern(iInv['Sr. No. From'], true, /^[a-zA-Z0-9\/\-]{1,16}$/) &&
                    validatePattern(iInv['Sr. No. To'], true, /^[a-zA-Z0-9\/\-]{1,16}$/) &&
                    validatePattern(iInv['Total Number'], true, /^(\d*)$/) &&
                    validatePattern(iInv['Cancelled'], true, /^(\d*)$/) &&
                    (cnvt2Nm(iInv['Total Number']) >= cnvt2Nm(iInv['Cancelled'])) &&
                    validatePattern(iInv['Nature of Document'], true, /^(Invoices for outward supply|Invoices for inward supply from unregistered person|Revised Invoice|Debit Note|Credit Note|Receipt Voucher|Payment Voucher|Refund Voucher|Delivery Challan for job work|Delivery Challan for supply on approval|Delivery Challan in case of liquid gas|Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11))$/));
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
                    // validatePattern(iInv['GSTIN of Supplier'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                    validatePattern(iInv['Invoice Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['Eligibility For ITC'], true, /^(Inputs|Input services|Capital goods|Ineligible)$/) &&
                    /*validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)*/
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
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,8}$/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,8}$/) &&
                    validatePattern(iInv['CGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['SGST Rate'], true, /^(0|2.5|6|9|14)$/) &&
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    // validatePattern(iInv['GSTIN of Supplier'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
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
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
                    validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/)


                );
                // if(iInv['Note/Refund Voucher Number'] == "12345"){
                // console.log("cdnr starts here");

                // console.log(validatePattern(iInv['Invoice/Advance Payment Voucher date'], true, null) );
                //     console.log(isValidDateFormat(iInv['Invoice/Advance Payment Voucher date']) );
                //     console.log(validateGSTIN(iInv['GSTIN of Supplier'], iForm) );
                //     console.log(validatePattern(iInv['GSTIN of Supplier'], true, null) );
                //     // validatePattern(iInv['GSTIN of Supplier'], true, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                //     console.log(isValidDateFormat(iInv['Note/Refund Voucher date']) );
                //     console.log(validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) );

                //     console.log(validatePattern(iInv['Integrated Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) );
                //     console.log(validatePattern(iInv['Central Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) );
                //     console.log(validatePattern(iInv['State/UT Tax Paid'], false, /^(\d{0,13})(\.\d{0,2})?$/) );

                //     console.log(validatePattern(iInv['Availed ITC Integrated Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) );
                //     console.log(validatePattern(iInv['Availed ITC Central Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) );
                //     console.log(validatePattern(iInv['Availed ITC State/UT Tax'], false, /^(\d{0,13})(\.\d{0,2})?$/) );
                //     console.log(validatePattern(iInv['Availed ITC Cess'], false, /^(\d{0,13})(\.\d{0,2})?$/) );

                //     console.log((cnvt2Nm(iInv['Availed ITC Integrated Tax']) <= cnvt2Nm(iInv['Integrated Tax Paid'])) );
                //     console.log((cnvt2Nm(iInv['Availed ITC Central Tax']) <= cnvt2Nm(iInv['Central Tax Paid'])) );
                //     console.log((cnvt2Nm(iInv['Availed ITC State/UT Tax']) <= cnvt2Nm(iInv['State/UT Tax Paid'])) );
                //     console.log((cnvt2Nm(iInv['Availed ITC Cess']) <= cnvt2Nm(iInv['Cess Paid'])) );


                //     console.log(validatePattern(iInv['Reason For Issuing document'], true, /^(01-Sales Return|02-Post Sale Discount|03-Deficiency in services|04-Correction in Invoice|05-Change in POS|06-Finalization of Provisional assessment|07-Others)$/) );
                //     console.log(validatePattern(iInv['Document Type'], true, /^(C|D)$/) );
                //     console.log(validatePattern(iInv['Invoice/Advance Payment Voucher Number'], true, /^[a-zA-Z0-9-\/]*$/) );
                //     console.log(validatePattern(iInv['Note/Refund Voucher Number'], true, /^[a-zA-Z0-9-\/]*$/) );
                //     console.log(validatePattern(iInv['Note/Refund Voucher date'], true, null) );
                //     console.log(validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) );
                //     console.log(validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) );
                //     console.log(validatePattern(iInv['Supply Type'], true, /^(Inter State|Intra State)$/));
                // }
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
                    validatePattern(iInv['Document Type'], true, /^(C|D|R)$/) &&
                    validatePattern(iInv['Invoice/Advance Payment Voucher number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Voucher Number'], true, /^[a-zA-Z0-9-\/]{1,16}$/) &&
                    validatePattern(iInv['Note/Voucher date'], true, null) &&
                    //                    isRequired &&
                    validatePattern(iInv['Pre GST'], true, /^(Y|N)$/) &&
                    validatePattern(iInv['Invoice Type'], true, /^(B2BUR|IMPS)$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    // validatePattern(iInv['GSTIN Of SEZ Supplier'], false, /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/) &&
                    validGstn &&
                    validatePattern(iInv['GSTIN Of SEZ Supplier'], isRequired, null) &&
                    validatePattern(iInv['Bill Of Entry Date'], true, null) &&
                    isValidDateFormat(iInv['Bill Of Entry Date']) &&
                    validatePattern(iInv['Bill Of Entry Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) && validatePattern(iInv['Document type'], true, /^(Imports|Received from SEZ)$/) &&
                    validatePattern(iInv['Taxable Value'], true, /^(\d{0,13})(\.\d{0,2})?$/) &&
                    //validatePattern(iInv['Category'], true, /^(G|S)$/) &&
                    validatePattern(iInv['Port Code'], true, /^[a-zA-Z0-9-\/]{6}$/) &&
                    validatePattern(iInv['Bill Of Entry Number'], true, /^[0-9]{7}$/) &&
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,8}$/) &&
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,8}$/) &&
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    //                            validatePattern(iInv['HSN/SAC of Supply'], false, /^[0-9]{2,}$/) &&
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
                    validatePattern(iInv['IGST Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                //isPttnMthced = true;
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
                    validatePattern(iInv['Rate'], true, /^(0|0.25|0.1|0.10|3|5|12|18|28)$/) &&
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
                    /*&&
                                                iExInv.hasOwnProperty('Provisional Assessment')*/
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
                    /* &&
                                                iExInv.hasOwnProperty('Provisional Assessment')*/
                );
                break;
                break;
            case 'b2cl':
                isValidData = (
                    /*iExInv.hasOwnProperty('Recipient State Code') &&
                    iExInv.hasOwnProperty('Recipient Name') &&*/
                    iExInv.hasOwnProperty('Invoice Number') &&
                    iExInv.hasOwnProperty('Invoice date') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Place Of Supply')
                    /*iExInv.hasOwnProperty('Provisional Assessment')*/
                );
                break;
            case 'b2cla':
                isValidData = (
                    /*iExInv.hasOwnProperty('Recipient State Code') &&
                    iExInv.hasOwnProperty('Recipient Name') &&*/
                    iExInv.hasOwnProperty('Original Invoice Number') &&
                    iExInv.hasOwnProperty('Original Invoice date') &&
                    iExInv.hasOwnProperty('Revised Invoice Number') &&
                    iExInv.hasOwnProperty('Revised Invoice date') &&
                    iExInv.hasOwnProperty('Rate') &&
                    iExInv.hasOwnProperty('Invoice Value') &&
                    iExInv.hasOwnProperty('Original Place Of Supply')
                    /*iExInv.hasOwnProperty('Provisional Assessment')*/
                );
                break;
            case 'at':
                isValidData = (
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty("Gross Advance Received") ||
                    iExInv.hasOwnProperty("Cess Amount"));
                break;
            case 'ata':
                /*isValidData = (
                    iExInv.hasOwnProperty('Recipient State Code') &&
                    iExInv.hasOwnProperty('Revised Customer GSTIN/UIN/Name') &&
                    iExInv.hasOwnProperty('Original Customer GSTIN/UIN/Name') &&
                    iExInv.hasOwnProperty('Original Document Number') &&
                    iExInv.hasOwnProperty('Original Document date') &&
                    iExInv.hasOwnProperty('Revised Document Number') &&
                    iExInv.hasOwnProperty('Revised Document date') &&
                    iExInv.hasOwnProperty('Total Invoice Value'));*/
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
                    iExInv.hasOwnProperty('GSTIN/UIN of Recipient') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Document Type') &&
                    // iExInv.hasOwnProperty('Reason For Issuing document') &&
                    iExInv.hasOwnProperty('Invoice/Advance Receipt Number') &&
                    iExInv.hasOwnProperty('Invoice/Advance Receipt date') &&

                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Pre GST') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher Value') &&
                    iExInv.hasOwnProperty('Taxable Value')
                );
                break;
            case 'cdnur':
                if (!iExInv.hasOwnProperty('Place Of Supply'))
                    iExInv['Place Of Supply'] = '';


                isValidData = (

                    iExInv.hasOwnProperty('Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Document Type') &&
                    // iExInv.hasOwnProperty('Reason For Issuing document') &&
                    iExInv.hasOwnProperty('Invoice/Advance Receipt Number') &&
                    (iExInv['Invoice/Advance Receipt Number']) &&
                    iExInv.hasOwnProperty('Invoice/Advance Receipt date') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher Value') &&
                    (iExInv['Note/Refund Voucher Value']) &&
                    iExInv.hasOwnProperty('Pre GST') &&
                    iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('UR Type') &&
                    iExInv.hasOwnProperty('Taxable Value'));
                break;
            case 'cdnra':
                isValidData = (
                    iExInv.hasOwnProperty('GSTIN/UIN of Recipient') &&
                    iExInv.hasOwnProperty('Original Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Original Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Revised Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Revised Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Document Type') &&
                    // iExInv.hasOwnProperty('Reason For Issuing document') &&
                    iExInv.hasOwnProperty('Original Invoice/Advance Receipt Number') &&
                    iExInv.hasOwnProperty('Original Invoice/Advance Receipt date') &&
                    iExInv.hasOwnProperty('Pre GST') &&
                    iExInv.hasOwnProperty('Supply Type') &&
                    //iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher Value') &&
                    // iExInv.hasOwnProperty('E-Commerce GSTIN') &&
                    iExInv.hasOwnProperty('Taxable Value'));
                break;
            case 'cdnura':
                isValidData = (

                    iExInv.hasOwnProperty('Original Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Original Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Revised Note/Refund Voucher Number') &&
                    iExInv.hasOwnProperty('Revised Note/Refund Voucher date') &&
                    iExInv.hasOwnProperty('Document Type') &&
                    // iExInv.hasOwnProperty('Reason For Issuing document') &&
                    iExInv.hasOwnProperty('Original Invoice/Advance Receipt Number') &&
                    (iExInv['Original Invoice/Advance Receipt Number']) &&
                    iExInv.hasOwnProperty('Original Invoice/Advance Receipt date') &&
                    iExInv.hasOwnProperty('Note/Refund Voucher Value') &&
                    (iExInv['Note/Refund Voucher Value']) &&
                    iExInv.hasOwnProperty('Pre GST') &&
                    iExInv.hasOwnProperty('Supply Type') &&
                    //iExInv.hasOwnProperty('Place Of Supply') &&
                    iExInv.hasOwnProperty('UR Type') &&
                    iExInv.hasOwnProperty('Taxable Value'));
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
                    iExInv.hasOwnProperty('Revised Place Of Supply') &&
                    iExInv.hasOwnProperty('Original Place Of Supply') &&
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
                    iExInv.hasOwnProperty('Description for reversal of ITC') /*&&
                    iExInv.hasOwnProperty('ITC Integrated Tax Amount') &&
                    iExInv.hasOwnProperty('ITC Central Tax Amount') &&
                    iExInv.hasOwnProperty('ITC State/UT Tax Amount') &&
                    iExInv.hasOwnProperty('ITC Cess Amount')*/);
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
                isFieldsMatch = (iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['E-Commerce GSTIN'] == existingInv['etin']

                );
                // && validateItm(iForm, iSecID, iExInv, existingInv)
                /*iExInv['Provisional Assessment'] == existingInv['prs']);*/


                break;
            case 'b2ba':
                isFieldsMatch = (iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);


                break;
            case 'b2cl':
                isFieldsMatch = ( /*iExInv['Recipient State Code'] == existingInv['state_cd'] &&*/
                    /*iExInv['Recipient Name'] == existingInv['cname'] &&*/
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Place Of Supply'] == existingInv['pos']);
                /*iExInv['Provisional Assessment'] == existingInv['prs'])*/
                break;
            case 'b2cla':
                isFieldsMatch = ( /*iExInv['Recipient State Code'] == existingInv['state_cd'] &&*/
                    /*iExInv['Recipient Name'] == existingInv['cname'] &&*/

                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Invoice Value'] == existingInv['val'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Original Place Of Supply'].substring(0, 2) == existingInv['pos']
                    /*iExInv['Provisional Assessment'] == existingInv['prs']*/
                );
                break;
            case 'at':
                isFieldsMatch = (iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent']);

                break;
            case 'ata':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                isFieldsMatch = (iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    curntOMon == existingInv['omon']
                );
                break;
            case 'exp':
                isFieldsMatch = (iExInv['Export Type'] == existingInv['exp_typ'] &&
                    parseInt(iExInv['Shipping Bill Number']) == existingInv['sbnum'] &&
                    iExInv['Port Code'] == existingInv['sbpcode'] &&
                    iExInv['Shipping Bill Date'] == existingInv['sbdt'] &&
                    (iExInv['Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Invoice date'] == existingInv['idt'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Invoice Value'] == existingInv['val']);
                break;
            case 'expa':
                isFieldsMatch = (iExInv['Export Type'] == existingInv['exp_typ'] &&
                    iExInv['Shipping Bill Number'] == existingInv['sbnum'] &&
                    iExInv['Port Code'] == existingInv['sbpcode'] &&
                    iExInv['Shipping Bill Date'] == existingInv['sbdt'] &&
                    (iExInv['Original Invoice Number']).toLowerCase() == (existingInv['oinum']).toLowerCase() &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Invoice Value'] == existingInv['val']);
                break;
            case 'cdnr':
                //Field name changed for
                //                if()
                isFieldsMatch = (iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                    iExInv['Note/Refund Voucher Number'] == existingInv['nt_num'] &&
                    iExInv['Note/Refund Voucher date'] == existingInv['nt_dt'] &&
                    iExInv['Document Type'] == existingInv['ntty'] &&
                    // iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                    iExInv['Invoice/Advance Receipt Number'] == existingInv['inum'] &&
                    iExInv['Invoice/Advance Receipt date'] == existingInv['idt'] &&
                    iExInv['Pre GST'] == existingInv['p_gst'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Note/Refund Voucher Value'] == existingInv['val']);

                // iExInv['E-Commerce GSTIN'] == existingInv['etin'] &&
                // iExInv['Taxable Value'] == existingInv['txval']);

                break;
            case 'cdnur':
                isFieldsMatch = (/*iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&*/
                    iExInv['Note/Refund Voucher Number'] == existingInv['nt_num'] &&
                    iExInv['Note/Refund Voucher date'] == existingInv['nt_dt'] &&
                    iExInv['Document Type'] == existingInv['ntty'] &&
                    // iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                    iExInv['Invoice/Advance Receipt Number'] == existingInv['inum'] &&
                    iExInv['Invoice/Advance Receipt date'] == existingInv['idt'] &&
                    iExInv['Pre GST'] == existingInv['p_gst'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['UR Type'] == existingInv['typ'] &&
                    iExInv['Note/Refund Voucher Value'] == existingInv['val']);

                break;
            case 'cdnra':
                isFieldsMatch = (iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&
                    iExInv['Original Note/Refund Voucher Number'] == existingInv['ont_num'] &&
                    iExInv['Original Note/Refund Voucher date'] == existingInv['ont_dt'] &&
                    iExInv['Revised Note/Refund Voucher Number'] == existingInv['nt_num'] &&
                    iExInv['Revised Note/Refund Voucher date'] == existingInv['nt_dt'] &&
                    iExInv['Document Type'] == existingInv['ntty'] &&
                    // iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                    iExInv['Original Invoice/Advance Receipt Number'] == existingInv['inum'] &&
                    iExInv['Original Invoice/Advance Receipt date'] == existingInv['idt'] &&
                    iExInv['Pre GST'] == existingInv['p_gst'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Note/Refund Voucher Value'] == existingInv['val']);

                break;
            case 'cdnura':
                isFieldsMatch = (/*iExInv['GSTIN/UIN of Recipient'] == existingInv['ctin'] &&*/
                    iExInv['Original Note/Refund Voucher Number'] == existingInv['ont_num'] &&
                    iExInv['Original Note/Refund Voucher date'] == existingInv['ont_dt'] &&
                    iExInv['Revised Note/Refund Voucher Number'] == existingInv['nt_num'] &&
                    iExInv['Revised Note/Refund Voucher date'] == existingInv['nt_dt'] &&
                    iExInv['Document Type'] == existingInv['ntty'] &&
                    // iExInv['Reason For Issuing document'] == existingInv['rsn'] &&
                    iExInv['Original Invoice/Advance Receipt Number'] == existingInv['inum'] &&
                    iExInv['Original Invoice/Advance Receipt date'] == existingInv['idt'] &&
                    iExInv['Pre GST'] == existingInv['p_gst'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['UR Type'] == existingInv['typ'] &&
                    iExInv['Note/Refund Voucher Value'] == existingInv['val']);

                break;
            case 'b2cs':
                isFieldsMatch = (iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    iExInv['Type'] == existingInv['typ']);

                break;
            case 'b2csa':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                isFieldsMatch = (iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['opos'] &&
                    iExInv['Revised Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Type'] == existingInv['typ']) &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    curntOMon == existingInv['omon']
                break;
            case 'atadj':
                isFieldsMatch = (iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent']);
                break;
            case 'atadja':
                var year = iExInv['Financial Year'],
                    month = iExInv['Original Month'],
                    curntOMon = isValidRtnPeriod(iYearsList, year, month).monthValue;
                isFieldsMatch = (iExInv['Original Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Applicable % of Tax Rate'] == existingInv['diff_percent'] &&
                    curntOMon == existingInv['omon']

                );
                break;
            case 'hsn':
                isFieldsMatch = (
                    iExInv['HSN'] == existingInv['hsn_sc'] &&
                    iExInv['Description'] == existingInv['desc']
                );
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
        }
    } else if (iForm === "GSTR2") {
        switch (iSecID) {
            case 'b2b': // GSTR2
                isFieldsMatch = (iExInv['GSTIN of Supplier'] == existingInv['ctin'] &&
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
                isFieldsMatch = (iExInv['Supplier GSTIN'] == existingInv['ctin'] &&
                    iExInv['Original Invoice Number'] == existingInv['oinum'] &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Total Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);

                break;
            case 'b2bura': // GSTR2
                isFieldsMatch = (iExInv['Supplier Name'] == existingInv['cname'] &&
                    iExInv['Original Invoice Number'] == existingInv['oinum'] &&
                    iExInv['Original Invoice date'] == existingInv['oidt'] &&
                    (iExInv['Revised Invoice Number']).toLowerCase() == (existingInv['inum']).toLowerCase() &&
                    iExInv['Revised Invoice date'] == existingInv['idt'] &&
                    iExInv['Total Invoice Value'] == existingInv['val'] &&
                    iExInv['Place Of Supply'] == existingInv['pos'] &&
                    iExInv['Reverse Charge'] == existingInv['rchrg']);
                break;
            case 'cdnr': // GSTR2
                isFieldsMatch = (iExInv['GSTIN of Supplier'] == existingInv['ctin'] &&
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
                isFieldsMatch = (iExInv['Supplier GSTIN'] == existingInv['ctin'] &&
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
                isFieldsMatch = (iExInv['Bill Of Entry Number'] == existingInv['boe_num'] &&
                    iExInv['Bill Of Entry Date'] == existingInv['boe_dt'] &&
                    iExInv['Port Code'] == existingInv['port_code'] &&
                    iExInv['Bill Of Entry Value'] == existingInv['boe_val']);
                break;
            case 'imp_ga': // GSTR2
                isFieldsMatch = (iExInv['Original Bill Of Entry Number'] == existingInv['oboe_num'] &&
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
                isFieldsMatch = (iExInv['Place Of Supply'].slice(0, 2) == existingInv['pos'] &&
                    iExInv['Supply Type'] == existingInv['sply_ty']);

                break;
            case 'atxi': // GSTR2
                isFieldsMatch = (iExInv['Recipient State Code'] == existingInv['state_cd'] &&
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
    var isValidSbdt;
    switch (iSecID) {
        case 'exp':
            isValidSbdt = validateLessShipOrInvDate(iExInv['Shipping Bill Date'], iExInv['Invoice date']);
            break;
        case 'expa':
            isValidSbdt = validateLessShipOrInvDate(iExInv['Shipping Bill Date'], iExInv['Original Invoice date']) &&
                validateLessShipOrInvDate(iExInv['Shipping Bill Date'], iExInv['Revised Invoice date']);
            break;
        // case 'b2ba':
        // case 'b2cla':
        //     isValidSbdt = validateLessShipOrInvDate(iExInv['Revised Invoice date'], iExInv['Original Invoice date']);
        //     break;
        case 'cdnr':
        case 'cdnur':
            isValidSbdt = validateLessShipOrInvDate(iExInv['Note/Refund Voucher date'], iExInv['Invoice/Advance Receipt date']);
            break;
        case 'cdnra':
        case 'cdnura':
            isValidSbdt = validateLessShipOrInvDate(iExInv['Revised Note/Refund Voucher date'], iExInv['Original Invoice/Advance Receipt date']) &&
                validateLessShipOrInvDate(iExInv['Original Note/Refund Voucher date'], iExInv['Original Invoice/Advance Receipt date']);
            break;
        // validateLessShipOrInvDate(iExInv['Revised Note/Refund Voucher date'], iExInv['Original Note/Refund Voucher date']) &&
        default:
            isValidSbdt = true;

    }
    return isValidSbdt;
}
//To change date format dd-mmm-yy/yyyy to dd/mm/yy
function getDateTime(datetoformat) {
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
                //iExInv['Document date'] = true;//getDateTime(iExInv['Document date']);

                isValidDt = true//validateDate(iExInv['Document date'], iMonthsList);
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
                isValidDt = (validateDate(iExInv['Original Invoice date'], iMonthsList) && validateDate(iExInv['Revised Invoice date'], iMonthsList) && validateDate(iExInv['Shipping Bill Date'], iMonthsList));
                break;
            case 'cdnr':
                iExInv['Invoice/Advance Receipt date'] = getDateTime(iExInv['Invoice/Advance Receipt date']);
                iExInv['Note/Refund Voucher date'] = getDateTime(iExInv['Note/Refund Voucher date']);

                if (iExInv['Pre GST'] == 'Y') {

                    isValidDt = (!validateDate(iExInv['Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Note/Refund Voucher date'], iMonthsList));
                } else {

                    isValidDt = (validateDate(iExInv['Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Note/Refund Voucher date'], iMonthsList));
                }
                break;
            case 'cdnur':
                iExInv['Invoice/Advance Receipt date'] = getDateTime(iExInv['Invoice/Advance Receipt date']);
                iExInv['Note/Refund Voucher date'] = getDateTime(iExInv['Note/Refund Voucher date']);
                if (iExInv['Pre GST'] == 'Y') {
                    isValidDt = (!validateDate(iExInv['Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Note/Refund Voucher date'], iMonthsList));
                } else {
                    isValidDt = (validateDate(iExInv['Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Note/Refund Voucher date'], iMonthsList));
                }
                break;
            case 'cdnra':
            case 'cdnura':
                iExInv['Original Invoice/Advance Receipt date'] = getDateTime(iExInv['Original Invoice/Advance Receipt date']);
                iExInv['Original Note/Refund Voucher date'] = getDateTime(iExInv['Original Note/Refund Voucher date']);
                iExInv['Revised Note/Refund Voucher date'] = getDateTime(iExInv['Revised Note/Refund Voucher date']);

                //  isValidDt = (validateDate(iExInv['Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Revised Note/Refund Voucher date'], iMonthsList));
                if (iExInv['Pre GST'] == 'Y') {
                    isValidDt = (!validateDate(iExInv['Original Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Original Note/Refund Voucher date'], iMonthsList) && validateDate(iExInv['Revised Note/Refund Voucher date'], iMonthsList));
                } else {
                    isValidDt = (validateDate(iExInv['Original Invoice/Advance Receipt date'], iMonthsList) && validateDate(iExInv['Original Note/Refund Voucher date'], iMonthsList) && validateDate(iExInv['Revised Note/Refund Voucher date'], iMonthsList));
                }
                break;
            case 'ata':
            case 'atadja':
            case 'b2csa':
                var curntYear = iExInv['Financial Year'],
                    curntMonth = iExInv['Original Month'];
                isValidDt = isValidRtnPeriod(iYearsList, curntYear, curntMonth).isValidPeriod;
                break;
            // case 'b2csa':
            //     isValidDt = validateMonth(iExInv['Month']);
            //     break;
            /*case 'atadj':
            case 'atadja' :
                iExInv['Document date'] = true;//getDateTime(iExInv['Document date']);
                isValidDt = true;//validateDate(iExInv['Document date'], iMonthsList);*/
            case 'hsn':
                isValidDt = true;
                break;
            case 'nil':
                isValidDt = true;
                break;
            case 'doc_issue':
                isValidDt = true;
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
                iExInv['Document date'] = true;//getDateTime(iExInv['Document date']);
                isValidDt = true//validateDate(iExInv['Document date'], iMonthsList);
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
                //suplyTyp =  getSupplyType(iSpLs, thisShareData.dashBoardDt.gstin, iInv["Place Of Supply"]);
                // suplyTyp = iSpLs[1];
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case "b2cs":
            //case "b2csa":
            case "cdnr":
            case "cdnra":
            case "cdnur":
                suplyTyp = getSupplyType(iSpLs, thisShareData.dashBoardDt.gstin, iInv["Place Of Supply"]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case "b2csa":

                suplyTyp = getSupplyType(iSpLs, thisShareData.dashBoardDt.gstin, iInv["Original Place Of Supply"]);
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;

            case "atadj":
                suplyTyp = getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                isValidTaxRates = true;//validateRates(iInv, suplyTyp);
                break;
            case "at":
                suplyTyp = getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                isValidTaxRates = true;//validateRates(iInv, suplyTyp);
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
                //     console.log(iInv["Supply Type"])
                suplyTyp = iInv["Supply Type"];
                isValidTaxRates = validateRates(iInv, suplyTyp);
                break;
            case "cdnr": // GSTR2
            case "cdnra": // GSTR2
            case "cdnur": // GSTR2
                suplyTyp = iInv["Supply Type"];
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
                // suplyTyp = R1Util.getSupplyType(iSpLs, iInv["Supplier's GSTIN/Name"], iInv["Recipient State Code"]);
                isValidTaxRates = true;//validateRates(iInv, suplyTyp);

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

                isValidTaxRates = true;//validateRates(iInv, suplyTyp);

                break;


        }
    }
    return isValidTaxRates;
}

function getSupplyType(suplyList, ctin, pos, sup_ty, isSEZ) {
    var rtObj = null,
        gstin = (thisShareData.dashBoardDt.gstin).slice(0, 2);
    if (thisShareData.dashBoardDt.form == "GSTR1") {
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
        if (!isSEZ && (sup_ty == 'SEWP' || sup_ty == 'SEWOP')) {
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
            var pos0to37 = (parseInt(iString) >= 1 && parseInt(iString) <= 37),
                pos97 = (parseInt(iString) == 97);
            isValid = (pos0to37 || pos97) ? true : false;
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

var preparePayloadFromExcel = function (oData, getInvFn, getItmFn, excelRefKey, newFormateKey, iSecID, iForm, iMonthsList, iYearsList, iSpLs, isSEZ) {

    var iData = null;
    var invAry = [];
    iData = convertStrToNum(oData, "Rate");
    iData = convertStrToNum(iData, "Amount");
    iData = convertStrToNum(iData, "Value");
    iData = convertNumToStr(iData, "Number");
    iData = convertNumToStr(iData, "HSN");
    iData = trimIt(iData, "Number");

    var isValidItemAction = true;//To check item level actions



    function getMatchedInv(iAry, iNum, iCompareKey, iExInv, iSecID, iYearsList) { //This also checks item level actions

        var rInv = null,
            rErrInv = null;
        rActionErrInv = null;

        for (var i = 0, len = iAry.length; i < len; i++) {
            if (!iAry[i]['ctin'] && iSecID !== "itc_rvsl")
                iAry[i]['ctin'] = '';
            if (!iExInv['GSTIN of Supplier'])
                iExInv['GSTIN of Supplier'] = '';
            if (!iExInv['GSTIN/UIN of Recipient'])
                iExInv['GSTIN/UIN of Recipient'] = '';

            var checkOriginalKey = false;
            if (iSecID.endsWith('a')) {
                var oNum = null, oMonth = null, oYear = null, curntOMon = null;
                var oCompareKey = 'o' + iCompareKey;
                if (iSecID == 'b2ba' || iSecID == 'b2cla' || iSecID == 'expa') {
                    oNum = iExInv['Original Invoice Number'];
                } else if (iSecID == 'cdnra' || iSecID == 'cdnura') {
                    oNum = iExInv['Original Note/Refund Voucher Number'];
                } else if (iSecID == 'ata' || iSecID == 'atadja' || iSecID == 'b2csa') {
                    oCompareKey = "omon";
                    oMonth = iExInv['Original Month'];
                    oYear = iExInv['Financial Year'];
                    oNum = isValidRtnPeriod(iYearsList, oYear, oMonth).monthValue;
                }

                checkOriginalKey = oNum && iAry[i][oCompareKey] && (oNum).toLowerCase() == (iAry[i][oCompareKey]).toLowerCase()
            }
            var isMatchedKeys;
            if (iSecID == "atadja" || iSecID == "ata" || iSecID == "b2csa") {
                isMatchedKeys = iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() && checkOriginalKey;
            }
            else {
                isMatchedKeys = iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() || checkOriginalKey;
            }

            /*if ((iNum && iAry[i][iCompareKey] && (iNum).toLowerCase() == (iAry[i][iCompareKey]).toLowerCase() || checkOriginalKey) && (iAry[i]['ctin'] == iExInv['GSTIN of Supplier'] || iAry[i]['ctin'] == iExInv['GSTIN/UIN of Recipient']))*/
            if (isMatchedKeys && (iAry[i]['ctin'] == iExInv['GSTIN of Supplier'] || iAry[i]['ctin'] == iExInv['GSTIN/UIN of Recipient'])) {

                //To check for invoice number as well as GSTIN
                //For sections other than b2b & cdn, undefined == undefined -> true
                //Added by Subrat 
                // THIS CAUSED ISSUE IN IMP_G, ctin was undefined gstin was empty string, normalize should be done for empty/null compare
                //Added by Vasu


                var existingInv = iAry[i];

                var isValidInv = validateInvoice(iForm, iSecID, iExInv, existingInv, iYearsList);
                if (iForm == "GSTR2" && (iExInv.hasOwnProperty('Saved/Submitted')
                    || iExInv.hasOwnProperty('Invoice Action Status')
                    || iExInv.hasOwnProperty('Action'))) { //To check item level actions only for GSTR2

                    isValidItemAction = isValidItemAction && validateItemLevelAction(iForm, iSecID, iExInv, existingInv, iYearsList);

                }
                if (isValidInv && isValidItemAction) {
                    rInv = iAry[i];
                } else {
                    if (!isValidItemAction && isValidInv) {

                        iAry.splice(i, 1);
                        --i;
                        rActionErrInv = iNum;
                    }
                    if (iCompareKey != 'hsn_sc') {

                        rErrInv = iNum;

                    }

                }
                break;
            }

        }
        isValidItemAction = true;
        return {
            rInv: rInv,
            rErrInv: rErrInv,
            rActionErrInv: rActionErrInv
        };
    }


    var excelErrList = [],
        excelDateErrList = [],
        excelb2clErrList = [],
        excelMatchErrInvList = [],
        excelInvalidPattrnList = [],
        excelInvalidActionList = [],
        getMatchObj = {}, matchedInv, excelErrInv, excelActionErrInv; //Change S2809 : This array is to populate invoices with invalid actions.


    angular.forEachCustom(iData, function (inv, i) {
        if (typeof inv === 'function')
            return;
        if (excelRefKey == 'Place Of Supply' || excelRefKey == 'Original Place Of Supply' || excelRefKey == 'Revised Place Of Supply') {
            if (inv[excelRefKey])
                inv[excelRefKey] = inv[excelRefKey].substring(0, 2);
        }
        var curInum = inv[excelRefKey],
            isValidExcelFields = validateExcelMandatoryFields(inv, iSecID, iForm),
            isValidExcelDates = false;

        if (isValidExcelFields) isValidExcelDates = validateExcelDates(inv, iSecID, iForm, iMonthsList, iYearsList);
        var isValidExcelData = validateExcelData(inv, iSecID, iForm),
            isValidShipDate = validateLessThanInvDate(inv, iSecID, iForm);
        // isValidExcelTaxRates = validateExcelTaxRates(inv, iSecID, iSpLs, iForm),


        //Change S2809
        var isValidExcelActions = true;
        if (inv.hasOwnProperty('Saved/Submitted')) {
            //isValidStatus = isValidStatus && validateStatusWithJson(iForm, iSecID, iExInv, existingInv);
            isValidExcelActions = validateExcelActions(inv, iSecID, iForm);

        }



        //S2809 - added the validation check for actions
        if (isValidExcelData && isValidExcelDates && isValidExcelFields && isValidExcelActions && isValidShipDate) {
            //i
            getMatchObj = getMatchedInv(invAry, curInum, newFormateKey, inv, iSecID, iYearsList);
            matchedInv = getMatchObj.rInv;
            excelErrInv = getMatchObj.rErrInv;
            excelActionErrInv = getMatchObj.rActionErrInv;
            if (!excelErrInv && !excelActionErrInv) {
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
                            //Change S2809 to check item level actions
                            //                    if(typeof matchedInv.itms[ll].itm_det != 'undefined' && typeof matchedInv.itms[ll].itm_det.rt != 'undefined' &&
                            //                      )
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

                    if (((iSecID == 'b2cl' || iSecID == 'b2cla') && !isSEZ) || iSecID == 'cdnur' || ((iSecID == 'cdnra' || iSecID == 'cdnura') && isSEZ)) { //|| iSecID == "cdnura"||iSecID == "cdnur" || (iSecID == 'b2b' && inv['Invoice Type'] !== 'Regular')

                        var isValidRow = isInterStateRow(inv, iSecID, isSEZ);
                        if (isValidRow) {

                            invAry.push(getInvFn(1, inv, getItmFn));
                        }
                        else {
                            var errList = [];
                            // if (iSecID == 'nil') {
                            //     errList.push(parseInt(i) + 5);
                            //     invAry.push(getInvFn(1, inv, getItmFn));
                            // }
                            // else
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
                if (excelErrInv && getItmFn && !excelActionErrInv) {
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

            }
        } else if (curInum && isValidExcelData && isValidExcelFields && isValidExcelActions && isValidShipDate) {

            // } else if (curInum && isValidExcelData && isValidExcelFields && isValidExcelTaxRates) {
            var errList = [];

            errList.push(curInum);
            excelErrList.push({
                cd: iSecID,
                dt: errList
            });
        }
        else if (curInum && isValidExcelData && isValidExcelFields && !isValidShipDate) {

            // } else if (curInum && isValidExcelData && isValidExcelFields && isValidExcelTaxRates) {
            var errList = [];
            errList.push(curInum);
            excelDateErrList.push({
                cd: iSecID,
                dt: errList
            });
        } else if (!isValidExcelFields && isValidExcelData && isValidShipDate) {
            var errList = [];

            errList.push(parseInt(i) + 5);

            excelInvalidPattrnList.push({
                cd: iSecID,
                dt: errList
            });
            //excelInvalidPattrnList.push(iSecID);
        } else if (!isValidExcelData || !isValidExcelFields || !isValidExcelDates) {

            var errList = [];

            errList.push(parseInt(i) + 5);
            excelInvalidPattrnList.push({
                cd: iSecID,
                dt: errList
            });

        } else if (!isValidExcelActions) {
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
    // console.log(excelErrList);
    // console.log(excelMatchErrInvList);
    // console.log(excelInvalidPattrnList);
    // console.log(excelDateErrList);
    // console.log(excelInvalidActionList);

    return {
        inv: invAry,
        errInv: excelErrList,
        macthedErrList: excelMatchErrInvList,
        excelInvldPattrnList: excelInvalidPattrnList,
        // excelInvalidTaxRtList: excelInvalidTaxRtList, // DO NOT COMMENT THIS!
        excelb2clErrList: excelb2clErrList,
        excelDateErrList: excelDateErrList,
        excelInvalidActionList: excelInvalidActionList
    };
}


function isInterStateRow(iInv, iSecId, isSEZ) {
    var isInterStateRw;
    if (iSecId == 'b2cl' || iSecId == 'b2cla' || iSecId == 'cdnur') { //  || (iSecId == 'b2b' && iInv['Invoice Type'] !== 'Regular')) {
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
    return isValidFormat;
}

function validateDate(iDate, iMonthsList, allowFuture) {
    var dateFormat = "DD/MM/YYYY";

    var rtDt = null,
        temp = "01" + thisShareData.dashBoardDt.fp.slice(0, 2) + thisShareData.dashBoardDt.fp.slice(2),
        lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days'),
        lastDate1 = lastDate.format(dateFormat),
        firstMonth = iMonthsList[0],
        temp1 = "01" + firstMonth.value.slice(0, 2) + firstMonth.value.slice(2),
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
    } else if (inv['Action'] == 'Add' || inv['Action'] == 'Delete') {
        return true;
    }
    else {
        return false;
    }
}

function validateItemLevelAction(iForm, iSecId, iExInv, existingInv) {
    var existingFlagStr = existingInv['flag'];
    var currFlagStr = getFlagValue(iExInv['Action'], iExInv['Saved/Submitted'], iExInv['Invoice Action Status']);
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

module.exports = {
    getInv: getInv,
    getItm: getItm,
    formateNodePayload: formateNodePayload,
    scopelists: scopelists,
    getExcelTitle: getExcelTitle,
    reformateInv: reformateInv,
    getInvKey: getInvKey,
    preparePayloadFromExcel: preparePayloadFromExcel

};
