/**
 *  @author:   Vasu Chawla
 *  @created:   July 2017
 *  @description: Offline utility
 *  @copyright: (c) Copyright by Infosys technologies
 *  version GST1.00
 *  Last Updated:  Vasu Chawla, July 07 2017
 **/
var multer = require('multer')
var log = require('../utility/logger');
var errorConstant = require('../utility/errorconstants');
var logger = log.logger;
var response = require('../utility/response');
var tenantContext = require('../utility/tenantContext');
var fs = require('fs');
var uploadedFiledir = './public/uploadXML/';
var del = require('delete');

var XLSX = require('xlsx');
var ReturnStructure = require('../utility/returnStructure');
var json2Excel = require('../utility/jsonToExcel');
const NodeCache = require("node-cache");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadedFiledir)
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});


var versionCheck = function (req, resa) {
    var https = require('https');
    var API_CHECK_URL = 'https://sitr1tutorials.gstsystem.co.in/public/gst_versions.json';
    https.get(API_CHECK_URL, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            res.resume();

            resa.status(200).send({});
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                resa.status(200).send(parsedData);
            } catch (e) {
                console.error(e);
                resa.status(200).send({});
            }
        });
    }).on('error', (e) => {
        console.log(e);
        resa.status(200).send({});
    });

}
var fetchJsonFile = function (req, res) {
    try {
        //console.log(__dirname+'/../public/'+req.body.file_name)
        var fileData = fs.readFileSync(__dirname + '/../public/' + req.body.file_name, "utf8");
        //console.log(fileData)
        fileData = JSON.parse(fileData);
        res.status(200).send(fileData);
    }
    catch (err) {
        //console.log(err);
        logger.log("info", "NO JSON FILE EXISTS FOR SELECTION");
        res.status(404).end();
    }

}


//var versionCheck = function(req, resa ){
//    resa.status(200).send({} );
//}
//

var addtblfile = function (req, res) {

    var errorObject = null;
    logger.log("info", "Entering Offline js:: addtbldata ");

    try {
        var upload = multer({ storage: storage }).single('file');
        upload(req, res, function (err) {
            if (err || req.file === undefined) {
                console.log('Unable to get thefile/ no file provided');
                response.error({ statusCd: errorConstant.STATUS_500, err_desc: 'Unable to get thefile/ no file provided' }, res);
                return;
            }
            readXML(req.file.path, req, res);
        })
    }
    catch (err) {
        errorObject = {
            statusCd: errorConstant.STATUS_500,
            errorCd: errorConstant.STATUS_500,
            errorMsg: 'Unable to upload the file'
        };
        console.log(err)
        logger.log("error", "Unexpected Error while writing the xls file :: %s", err.message)
        response.error(errorObject, res);
    } finally {
        errorObject = null;
        isSameGSTIN = null;
    }

}

function getSupplierName(gstin, ctin) {
    try {
        var fileData = fs.readFileSync(__dirname + '/../public/userData/master_' + gstin + '.json', "utf8");
        fileData = JSON.parse(fileData);
        for (let i in fileData.supplierRecipientMasters) {
             if (fileData.supplierRecipientMasters[i].gstin == ctin) {
              return fileData.supplierRecipientMasters[i].supplierRecipientName;
            }
        }
        return null;
    } catch (err) {
        logger.log("error", "DP NO JSON FILE EXISTS FOR SELECTION");
        return null;
    }
}

function hsnDescForOfflineTool(searchtext) {
    try {
        var fileData = fs.readFileSync(__dirname + '/../public/data/HSN.json', "utf8");
        fileData = JSON.parse(fileData);
        var result = { data: [] };
        var searchList;
        searchList = fileData.data.filter(obj => obj.c == searchtext);
        result.data = searchList[0].n;
        return result.data;
    }
    catch (err) {
        return "";
    }
}


var exportJsonToExcel = function (req, res) {
    var type = req.body.type;
    var file;
    if (type == 'Import')
        file = req.body.returnFileName;
    else
        file = req.body.errFileName;

    var form = req.body.form;

    //json2Excel.writeJSONToExcel('returns_19092017_R2_12ALYPD6528P1ZG_offline.json');
    json2Excel.writeJSONToExcel("../public/" + file, form, type, () => {
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-disposition', 'attachment; filename=' + "Excel.xlsx");
        res.setHeader('Transfer-Encoding', 'chunked');
        var fileStream = fs.createReadStream("./Excel" + '.xlsx');
        fileStream.on('open', function (err) {
            if (err) {
                logger.log(err);
            }

            fileStream.pipe(res);
            res.on('finish', function () {

                //del.sync(['./public/generatedFile/*']);
                //del.sync(["./Excel" + '.xlsx']);
                fs.unlinkSync("./Excel" + '.xlsx')
            });
        });
    });

}

function readXML(file_path, req, res) {
    var myCache = req.app.get('myCache');
    var workbook = XLSX.readFile(file_path, {
        type: 'binary'
    });
    var sExcSheets = workbook.SheetNames;
    var shareData = JSON.parse(req.body.shareData)
    var dashBoardDt = shareData.dashBoardDt;

    var form = dashBoardDt.form;
    var supplier_gstin = dashBoardDt.gstin;
    if (workbook.SheetNames[0] === "Help Instructions") {
        sExcSheets.splice(0, 1);
    }

    var retData = []

    for (var a = 0, aLen = sExcSheets.length; a < aLen; a++) {

        // IGNORE FIRST 3 rows of each sheet
        var range = XLSX.utils.decode_range(workbook.Sheets[workbook.SheetNames[a]]['!ref']);
        range.s.r = 3; // <-- zero-indexed, so setting to 1 will skip row 0
        workbook.Sheets[workbook.SheetNames[a]]['!ref'] = XLSX.utils.encode_range(range);
        var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[a]]);
        var shtnm = workbook.SheetNames[a];

        if (form == 'GSTR2' && (shtnm.toLowerCase() == 'u2br' || shtnm.toLowerCase() == 'bu2r')) {
            shtnm = 'b2bur';
        }
        else if (form == 'GSTR2' && shtnm.toLowerCase() == 'impg') {
            shtnm = 'imp_g'
        }
        else if (form == 'GSTR2' && shtnm.toLowerCase() == 'imps') {
            shtnm = 'imp_s'
        }
        else if (shtnm.toLowerCase() == 'exemp') { //form == 'GSTR2' &&
            shtnm = 'nil'
        }
        else if (form == 'GSTR2' && shtnm.toLowerCase() == 'at') {
            shtnm = 'txi'
        }
        else if (form == 'GSTR2' && shtnm.toLowerCase() == 'itcr') {
            shtnm = 'itc_rvsl'
        }
        else if (shtnm.toLowerCase() == 'docs') { //form == 'GSTR2' &&
            shtnm = 'doc_issue'
        } else if (form == 'GSTR1' && shtnm.toLowerCase() == 'eco') {
            shtnm = 'supeco'
        } else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecoa') {
            shtnm = 'supecoa'
        }else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecob2b') {
            shtnm = 'ecomb2b'
        } else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecob2c') {
            shtnm = 'ecomb2c'
        }else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecourp2b') {
            shtnm = 'ecomurp2b'
        } else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecourp2c') {
            shtnm = 'ecomurp2c'
        }else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecoab2b') {
            shtnm = 'ecomab2b'
        } else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecoab2c') {
            shtnm = 'ecomab2c'
        }else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecoaurp2b') {
            shtnm = 'ecomaurp2b'
        } else if (form == 'GSTR1' && shtnm.toLowerCase() == 'ecoaurp2c') {
            shtnm = 'ecomaurp2c'
        }
        //        if(shtnm !== 'exemp')
        //            {

        retData.push({
            section: shtnm,
            data: data
        })
    }
    //Condition applied for IFF
    let IffFlag = false;
    var rtn_prd = parseInt(shareData.dashBoardDt.fp.slice(0, 2));
    if (shareData.isTPQ && rtn_prd % 3 !== 0) {
        let a = 0;
        let aLen = retData.length;
        for (a; a < aLen; a++) {
            if(ReturnStructure.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECO_STRT_PRD, shareData.dashBoardDt.fp)){
                if (retData[a].section !== "master" && retData[a].section !== "Help Instruction" && retData[a].section !== "b2b,sez,de" && retData[a].section !== "b2ba" && retData[a].section !== "cdnr" && retData[a].section !== "cdnra") {
                    if (retData[a].data.length > 0) {
                        IffFlag = true;
                        break;
                    }
                }
            }else if(shareData.dashBoardDt.fp == shareData.R1_NEW_ECO_STRT_PRD){
                if (retData[a].section !== "master" && retData[a].section !== "Help Instruction" && retData[a].section !== "b2b,sez,de" && retData[a].section !== "b2ba" && retData[a].section !== "cdnr" && retData[a].section !== "cdnra" && retData[a].section !== "ecomb2b" && retData[a].section !== "ecomurp2b") {
                    if (retData[a].data.length > 0) {
                        IffFlag = true;
                        break;
                    }
                }
            }else if(!ReturnStructure.isCurrentPeriodBeforeAATOCheck(shareData.R1_NEW_ECOA_STRT_PRD, shareData.dashBoardDt.fp)){
                if (retData[a].section !== "master" && retData[a].section !== "Help Instruction" && retData[a].section !== "b2b,sez,de" && retData[a].section !== "b2ba" && retData[a].section !== "cdnr" && retData[a].section !== "cdnra" && retData[a].section !== "ecomb2b" && retData[a].section !== "ecomurp2b" && retData[a].section !== "ecomab2b" && retData[a].section !== "ecomaurp2b") {
                    if (retData[a].data.length > 0) {
                        IffFlag = true;
                        break;
                    }
                }
            }
        }
    }
    res.status(200)
    //Condition for IFF for quarterly taxpayer
    if (shareData.isTPQ && rtn_prd % 3 !== 0 && IffFlag) {
        let validFlag = false;
        res.send(JSON.stringify({
            validFlag: validFlag
        }));
    }
    else {
        var excelData = [],
            errData = [],
            multiItmErrData = [],
            misMatchedErrData = [],
            errb2clInvAry = [],
            errB2CLInvErrListAry = [],
            errActionInvAry = [],
            errActionErrorStatusInvAry = [],
            errMissingHeaderDataArry = [],
            errShipDtData = [];
        errUrTypePosData = [];
        errUrtypeDiffData = [];
        errPosStCdData = [];
        errInvSplyType = [];
        var isErrorFormate = (shareData.isUploadImport == 'E') ? true : false; 
        if(Number(shareData.dashBoardDt.fp.substring(shareData.dashBoardDt.fp.length - 4) < 2023)){                
            if(Number(shareData.R1_NEW_ECO_STRT_PRD) > Number(shareData.dashBoardDt.fp)){
        
                let aLen = retData.length;
                let isDelete = false;
                let supecoIndex = 0;
                var index = retData.map(function(x) {return x.section;}).indexOf("supeco");
                retData.splice(index, 1); 
                index = retData.map(function(x) {return x.section;}).indexOf("supecoa");
                retData.splice(index, 1); 
                index = retData.map(function(x) {return x.section;}).indexOf("ecomb2b");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomb2c");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomurp2b");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomurp2c");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomab2b");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomab2c");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomaurp2b");
                retData.splice(index, 1);
                index = retData.map(function(x) {return x.section;}).indexOf("ecomaurp2c");
                retData.splice(index, 1);
            
            }  
        }
        if(Number(shareData.R1_NEW_ECO_STRT_PRD) == Number(shareData.dashBoardDt.fp)){
           
            let aLen = retData.length;
            let isDelete = false;
            let supecoIndex = 0;
            var index = retData.map(function(x) {return x.section;}).indexOf("supecoa");
            retData.splice(index, 1); 
            index = retData.map(function(x) {return x.section;}).indexOf("ecomab2b");
            retData.splice(index, 1); 
            index = retData.map(function(x) {return x.section;}).indexOf("ecomab2c");
            retData.splice(index, 1); 
            index = retData.map(function(x) {return x.section;}).indexOf("ecomaurp2b");
            retData.splice(index, 1); 
            index = retData.map(function(x) {return x.section;}).indexOf("ecomaurp2c");
            retData.splice(index, 1); 
    
        }  
        retData.forEach(function (section) {
            var secNm = section.section;
            if(secNm == 'b2b,sez,de'){
                secNm = 'b2b';
            };
                //secDt = section.data,
                invStructure = ReturnStructure.getInv(secNm, form, shareData),
                invItmStructure = ReturnStructure.getItm(secNm, form, shareData),
                invNodeFormatter = ReturnStructure.formateNodePayload(secNm, form, shareData, isErrorFormate), //formateB2BNodePayload                   
                jsonInvKey = ReturnStructure.getInvKey(secNm, form, shareData),
                excelInvTitle = ReturnStructure.getExcelTitle(secNm, form, shareData);

            if (!invStructure) {
                return false;
            }
            if (form == 'GSTR1' && secNm == 'hsn' && !ReturnStructure.isCurrentPeriodBeforeAATOCheck(shareData.newHSNStartDateConstant, shareData.monthSelected.value)) {
                section.data.forEach(function (sInv, i) {
                    if(!shareData.disableHSNRestrictions){
                        section.data[i].Description = hsnDescForOfflineTool(sInv['HSN']);
                    }
                    
                    if (String(sInv['HSN']).substring(0, 2) == "99") {
                        section.data[i]['UQC'] = "NA";
                        section.data[i]['Total Quantity'] = "0";
                    }
                });
            }

            if (form == 'GSTR1' && secNm == 'hsn(b2b)' || secNm == 'hsn(b2c)') {
                section.data.forEach(function (sInv, i) {
                    if (String(sInv['HSN']).substring(0, 2) == "99") {
                        section.data[i]['UQC'] = "NA";
                        section.data[i]['Total Quantity'] = "0";
                    }
                });
            }
          
            if(form =='GSTR1' && secNm == 'b2b'|| secNm == 'b2ba' || secNm =='cdnr' || secNm == 'cdnra'){
                section.data.forEach(function(inv, i){
              section.data[i]["supplierRecipientName"] = getSupplierName(supplier_gstin,section.data[i]["GSTIN/UIN of Recipient"]);
                 
                });
            }

            var preparedExcelPayload = ReturnStructure.preparePayloadFromExcel(section.data, invStructure, invItmStructure, excelInvTitle, jsonInvKey, secNm, form, shareData.curFyMonths, shareData.yearsList, ReturnStructure.scopelists.suplyList, supplier_gstin, shareData.isSezTaxpayer, shareData.isUploadImport);
            var invAry = preparedExcelPayload.inv,
                errInvAry = preparedExcelPayload.errInv,
                matchedErrInvAry = preparedExcelPayload.macthedErrList,
                misMatchedPatternInvAry = preparedExcelPayload.excelInvldPattrnList,
                // errTaxRtInvAry = preparedExcelPayload.excelInvalidTaxRtList,
                excelb2clErrList = preparedExcelPayload.excelb2clErrList,
                excelB2CLInvErrList = preparedExcelPayload.excelB2CLInvErrList,
                errActionData = preparedExcelPayload.excelInvalidActionList,
                errActionErrorStatusData = preparedExcelPayload.excelinvalidErrorStatusList,
                errMissingHeaderData = preparedExcelPayload.excelMissingHeaderList, //to check for missing header columns
                errshipdtInvAry = preparedExcelPayload.excelDateErrList,
                UrTypPOSErrList = preparedExcelPayload.excelInvalidURtypePOSList,
                UrTypDiffErrList = preparedExcelPayload.excelInvalidURtypeDiffPerList,
                PosSupStCdErrList = preparedExcelPayload.excelInvalidPosSupStCode,
                InvNtTypeErrList = preparedExcelPayload.excelInvalidNtSplyTypList;

            var newInvAry = [];
            invAry.forEach(function (sInv, i) {
                newInvAry.push(invNodeFormatter(sInv));
            });

            excelData.push({
                cd: secNm,
                dt: newInvAry
            });
            errData = errData.concat(errInvAry);
            multiItmErrData = multiItmErrData.concat(matchedErrInvAry);
            misMatchedErrData = misMatchedErrData.concat(misMatchedPatternInvAry);
            errShipDtData = errShipDtData.concat(errshipdtInvAry);
            errb2clInvAry = errb2clInvAry.concat(excelb2clErrList);
            errB2CLInvErrListAry = errB2CLInvErrListAry.concat(excelB2CLInvErrList);
            errActionInvAry = errActionInvAry.concat(errActionData);
            errActionErrorStatusInvAry = errActionErrorStatusInvAry.concat(errActionErrorStatusData);
            errMissingHeaderDataArry = errMissingHeaderDataArry.concat(errMissingHeaderData);
            errUrTypePosData = errUrTypePosData.concat(UrTypPOSErrList);
            errUrtypeDiffData = errUrtypeDiffData.concat(UrTypDiffErrList);
            errPosStCdData = errPosStCdData.concat(PosSupStCdErrList);
            errInvSplyType = errInvSplyType.concat(InvNtTypeErrList);
        });

        workbook = null;
        retData = null;

        var randomNum = Math.floor(Math.random() * 600) + 1;
        res.send(JSON.stringify({
            errData: errData,
            cache_key: tenantContext.cacheKey("CACHE_" + randomNum),
            multiItmErrData: multiItmErrData,
            misMatchedErrData: misMatchedErrData,
            errShipDtData: errShipDtData,
            errb2clInvAry: errb2clInvAry,
            errB2CLInvErrListAry: errB2CLInvErrListAry,
            errActionInvAry: errActionInvAry,
            errActionErrorStatusInvAry: errActionErrorStatusInvAry,
            errMissingHeaderDataArry: errMissingHeaderDataArry,
            errUrTypePosData: errUrTypePosData,
            errUrtypeDiffData: errUrtypeDiffData,
            errPosStCdData: errPosStCdData,
            errInvSplyType: errInvSplyType
        }));
        //console.log(randomNum,multiItmErrData, misMatchedErrData, errTaxRtInvData )
        myCache.set(tenantContext.cacheKey("CACHE_" + randomNum), excelData);
    }
}

//Master 

function addSupNmToJson(req,res,err){
   var fName = req.body.fName;
   var ctin = req.body.ctin;
   try{
    var fileData = fs.readFileSync(__dirname + '/../public/' + fName, "utf8");

    fileData = JSON.parse(fileData);
    var gstin = fileData.gstin;
    var supName = getSupplierName(gstin,ctin);
    for(let i in fileData){
        if(i== 'b2b' || i =='b2ba' ){
           let inv = fileData[i];
           for(let j in inv){
               if(inv[j].ctin == ctin){
                   let invs = inv[j].inv;
                   for(let k in invs){
                    invs[k].supplierRecipientName = supName;  
                   }
                 inv[j].inv = invs;
               }
           }
           fileData[i]=inv;
        }
        if(i =='cdnr' || i == 'cdnra'){
            let inv = fileData[i];
            for(let j in inv){
                if(inv[j].ctin == ctin){
                    let invs = inv[j].nt;
                    for(let k in invs){
                     invs[k].supplierRecipientName = supName;  
                    }
                  inv[j].nt = invs;
                }
            }
            fileData[i]=inv;
         }
    }
    fs.writeFileSync(__dirname + '/../public/' + fName,JSON.stringify(fileData));
    res.send(fileData);
   }catch (err) {
    logger.log("error", "File does not exists!!..");
    res.status(404).end();
}
}

module.exports = {
    addtblfile: addtblfile,
    versionCheck: versionCheck,
    fetchJsonFile: fetchJsonFile,
    exportJsonToExcel: exportJsonToExcel,
    addSupNmToJson: addSupNmToJson
}