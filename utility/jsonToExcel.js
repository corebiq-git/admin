/**
 *  @author:   Subrat Sekhar Sahu
 *  @created:   Sep 2017
 *  @description: Offline Tool
 *  @copyright: (c) Copyright by Infosys technologies
 *  version GST2.00
 *  Last Updated:  Prakash Kaphle, March  06 2018
 **/

'use strict';
//var express = require('express');
//var app = express();
var XLSX = require('xlsx');
//app.listen(3000);

var fs = require("fs"),
    json;

//excel4node library
var xl = require('excel4node');

var workbook = new xl.Workbook();
var worksheetsArray = [];
var sectionNameArray = [];
var start = new Date().getTime();

var sheetHeaders = {
    "b2b": "Summary Of Supplies From Registered Suppliers B2B(3)",
    "b2bur": "Summary Of Supplies From Unregistered Suppliers B2BUR(4B)",
    "imps": "Summary For IMPS (4C)",
    "impg": "Summary For IMPG (5)",
    "cdnr": "Summary For CDNR(6C)",
    "cdnur": "Summary For CDNUR(6C)",
    "at": "Summary For  Tax Liability on Advance Paid  under reverse charge(10 A) ",
    "atadj": "Summary For Adjustment of advance tax paid earlier for reverse charge supplies (10 B) ",
    "exemp": "Summary For Composition, Nil rated, exempted and non GST inward supplies (7)",
    "itcr": "Summary Input Tax credit Reversal/Reclaim (11)",
    "hsnsum": "Summary For HSN(13)"
}

var sheetHeadersG1 = {
    "b2b": "Summary For B2B(4)",
    "b2ba": "Summary For B2BA",
    "b2cl": "Summary For B2CL(5)",
    "b2cla": "Summary For B2CLA",
    "b2cs": "Summary For B2CS(7)",
    "b2csa": "Summary For B2CSA",
    "cdnr": "Summary For CDNR(9B)",
    "cdnra": "Summary For CDNRA",
    "cdnur": "Summary For CDNUR(9B)",
    "cdnura": "Summary For CDNURA",
    "exp": "Summary For EXP(6)",
    "expa": "Summary For EXPA",
    "at": "Summary For Advance Received (11B)",
    "ata": "Summary For Amended Tax Liability(Advance Received)",
    "atadj": "Summary For Advance Adjusted (11B)",
    "atadja": "Summary For Amendments Of Adjustment Advances",
    "exemp": "Summary For Nil rated, exempted and non GST outward supplies (8)",
    "hsnsum": "Summary For HSN(12)",
    "docs": "Summary of documents issued during the tax period (13)"
};

var cnvt2Nm = function (s) {
    if (!s) {
        return 0;
    }

    if (s === '') {
        return 0;
    }

    s = parseFloat(s);
    s = s.toFixed(2);
    s = parseFloat(s);
    return s;
};
//Headers for GSTR 1 Error Flow
var b2bHeaderL4G1Er = ["GSTIN/UIN of Recipient", "Receiver Name", "Invoice Number", "Invoice date", "Invoice Value", "Place Of Supply", "Reverse Charge", "Applicable % of Tax Rate", "Invoice Type", "E-Commerce GSTIN", "Rate", "Taxable Value", "Cess Amount", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var b2baHeaderL4G1Er = ["GSTIN/UIN of Recipient", "Receiver Name", "Original Invoice Number", "Original Invoice date", "Revised Invoice Number", "Revised Invoice date", "Invoice Value", "Place Of Supply", "Reverse Charge", "Applicable % of Tax Rate", "Invoice Type", "E-Commerce GSTIN", "Rate", "Taxable Value", "Cess Amount", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var b2clHeaderL4G1Er = ["Invoice Number", "Invoice date", "Invoice Value", "Place Of Supply", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var b2claHeaderL4G1Er = ["Original Invoice Number", "Original Invoice date", "Original Place Of Supply", "Revised Invoice Number", "Revised Invoice date", "Invoice Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var b2csHeaderL4G1Er = ["Type", "Place Of Supply", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var b2csaHeaderL4G1Er = ["Financial Year", "Original Month", "Place Of Supply", "Type", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];


var cdnrHeaderL4G1Er = ["GSTIN/UIN of Recipient", "Receiver Name", "Invoice/Advance Receipt Number", "Invoice/Advance Receipt date", "Note/Refund Voucher Number", "Note/Refund Voucher date", "Document Type", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Error Message", "Error Status", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var cdnraHeaderL4G1Er = ["GSTIN/UIN of Recipient", "Receiver Name", "Original Note/Refund Voucher Number", "Original Note/Refund Voucher date", "Original Invoice/Advance Receipt Number", "Original Invoice/Advance Receipt date", "Revised Note/Refund Voucher Number", "Revised Note/Refund Voucher date", "Document Type", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Error Message", "Error Status", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var cdnurHeaderL4G1Er = ["UR Type", "Note/Refund Voucher Number", "Note/Refund Voucher date", "Document Type", "Invoice/Advance Receipt Number", "Invoice/Advance Receipt date", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Error Message", "Error Status", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var cdnuraHeaderL4G1Er = ["UR Type", "Original Note/Refund Voucher Number", "Original Note/Refund Voucher date", "Original Invoice/Advance Receipt Number", "Original Invoice/Advance Receipt date", "Revised Note/Refund Voucher Number", "Revised Note/Refund Voucher date", "Document Type", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Error Message", "Error Status", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var exportsHeaderL4G1Er = ["Export Type", "Invoice Number", "Invoice date", "Invoice Value", "Port Code", "Shipping Bill Number", "Shipping Bill Date", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Error Message", "Error Status", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var exportsamendHeaderL4G1Er = ["Export Type", "Original Invoice Number", "Original Invoice date", "Revised Invoice Number", "Revised Invoice date", "Invoice Value", "Port Code", "Shipping Bill Number", "Shipping Bill Date", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Error Message", "Error Status", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];


var atHeaderL4G1Er = ["Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Received", "Cess Amount", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];



var ataHeaderL4G1Er = ["Financial Year", "Original Month", "Original Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Received", "Cess Amount", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];



var atadjHeaderL4G1Er = ["Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Adjusted", "Cess Amount", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];



var atadjaHeaderL4G1Er = ["Financial Year", "Original Month", "Original Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Adjusted", "Cess Amount", "Error Message", "Error Status", "POS List", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];


var nilHeaderL4G1Er = ["Description", "Nil Rated Supplies", "Exempted (other than nil rated/non GST supply )", "Non-GST supplies", "Error Message", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var docsHeaderL4G1Er = ["Nature  of Document", "Sr. No. From", "Sr. No. To", "Total Number", "Cancelled", "DOC LIST", "Error Message", "Error Code", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var hsnsumHeaderL4G1Er = ["HSN", "Description", "UQC", "Total Quantity", "Total Value", "Taxable Value", "Integrated Tax Amount", "Central Tax Amount", "State/UT Tax Amount", "Cess Amount", "Error Message", "Error Code", "UQC List"];
/*------------------------------------------------------------------------------------------------*/
//Headers for GSTR 1
var b2bHeaderL4G1 = ["GSTIN/UIN of Recipient", "Receiver Name", "Invoice Number", "Invoice date", "Invoice Value", "Place Of Supply", "Reverse Charge", "Applicable % of Tax Rate", "Invoice Type", "E-Commerce GSTIN", "Rate", "Taxable Value", "Cess Amount", "Status", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "UPDTP Data(Please DO NOT Update/Delete)", "POS List"];

var b2baHeaderL4G1 = ["GSTIN/UIN of Recipient", "Receiver Name", "Original Invoice Number", "Original Invoice date", "Revised Invoice Number", "Revised Invoice date", "Invoice Value", "Place Of Supply", "Reverse Charge", "Applicable % of Tax Rate", "Invoice Type", "E-Commerce GSTIN", "Rate", "Taxable Value", "Cess Amount", "Status", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "UPDTP Data(Please DO NOT Update/Delete)", "POS List"];

var b2clHeaderL4G1 = ["Invoice Number", "Invoice date", "Invoice Value", "Place Of Supply", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var b2claHeaderL4G1 = ["Original Invoice Number", "Original Invoice date", "Original Place Of Supply", "Revised Invoice Number", "Revised Invoice date", "Invoice Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var b2csHeaderL4G1 = ["Type", "Place Of Supply", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var b2csaHeaderL4G1 = ["Financial Year", "Original Month", "Place Of Supply", "Type", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "E-Commerce GSTIN", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var cdnrHeaderL4G1 = ["GSTIN/UIN of Recipient", "Receiver Name", "Invoice/Advance Receipt Number", "Invoice/Advance Receipt date", "Note/Refund Voucher Number", "Note/Refund Voucher date", "Document Type", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Status", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "UPDTP Data(Please DO NOT Update/Delete)"];

var cdnraHeaderL4G1 = ["GSTIN/UIN of Recipient", "Receiver Name", "Original Note/Refund Voucher Number", "Original Note/Refund Voucher date", "Original Invoice/Advance Receipt Number", "Original Invoice/Advance Receipt date", "Revised Note/Refund Voucher Number", "Revised Note/Refund Voucher date", "Document Type", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Status", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "UPDTP Data(Please DO NOT Update/Delete)"];

var cdnurHeaderL4G1 = ["UR Type", "Note/Refund Voucher Number", "Note/Refund Voucher date", "Document Type", "Invoice/Advance Receipt Number", "Invoice/Advance Receipt date", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)"];

var cdnuraHeaderL4G1 = ["UR Type", "Original Note/Refund Voucher Number", "Original Note/Refund Voucher date", "Original Invoice/Advance Receipt Number", "Original Invoice/Advance Receipt date", "Revised Note/Refund Voucher Number", "Revised Note/Refund Voucher date", "Document Type", "Supply Type", "Note/Refund Voucher Value", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Pre GST", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)"];

var exportsHeaderL4G1 = ["Export Type", "Invoice Number", "Invoice date", "Invoice Value", "Port Code", "Shipping Bill Number", "Shipping Bill Date", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)"];

var exportsamendHeaderL4G1 = ["Export Type", "Original Invoice Number", "Original Invoice date", "Revised Invoice Number", "Revised Invoice date", "Invoice Value", "Port Code", "Shipping Bill Number", "Shipping Bill Date", "Applicable % of Tax Rate", "Rate", "Taxable Value", "Cess Amount", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)"];

var atHeaderL4G1 = ["Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Received", "Cess Amount", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var ataHeaderL4G1 = ["Financial Year", "Original Month", "Original Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Received", "Cess Amount", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var atadjHeaderL4G1 = ["Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Adjusted", "Cess Amount", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var atadjaHeaderL4G1 = ["Financial Year", "Original Month", "Original Place Of Supply", "Applicable % of Tax Rate", "Rate", "Gross Advance Adjusted", "Cess Amount", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "POS List"];

var nilHeaderL4G1 = ["Description", "Nil Rated Supplies", "Exempted (other than nil rated/non GST supply )", "Non-GST supplies", "Mandatory Check Field(Please DO NOT Update/Delete)"];

var docsHeaderL4G1 = ["Nature  of Document", "Sr. No. From", "Sr. No. To", "Total Number", "Cancelled", "DOC LIST"];

var hsnsumHeaderL4G1 = ["HSN", "Description", "UQC", "Total Quantity", "Total Value", "Taxable Value", "Integrated Tax Amount", "Central Tax Amount", "State/UT Tax Amount", "Cess Amount", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "Flag Data(Please DO NOT Update/Delete)", "UQC List"];

//End of Headers for GSTR 1

//Nature of Document list for doc_issue
var docDetails = ["Invoices for outward supply",
    "Invoices for inward supply from unregistered person", "Revised Invoice", "Debit Note", "Credit Note", "Receipt Voucher", "Payment Voucher", "Refund Voucher", "Delivery Challan for job work", "Delivery Challan for supply on approval", "Delivery Challan in case of liquid gas", " Delivery Challan in case other than by way of supply (excluding at S no. 9 to 11)"];

var allSectionsArrayG1 = ["b2b", "b2ba", "b2cl", "b2cla", "b2cs", "b2csa", "cdnr", "cdnra", "cdnur", "cdnura", "at", "ata", "txpd", "txpda", "hsn", "nil", "exp", "expa", "doc_issue"];


var allSectionsArray = ["b2b", "b2bur", "imp_s", "imp_g", "nil_supplies", "hsnsum", "txi", "cdnur", "itc_rvsl", "txpd", "cdn"];

var statusList = ["Saved", "Submitted"];

var flags = {
    "": "",
    "N": "No Action",
    "A": "Accepted",
    "R": "Rejected",
    "M": "Modified",
    "P": "Pending",
    "U": "No Action",
    "D": "Deleted",
    "E": "Edited"
}

var posList = ["01-Jammu & Kashmir", "02-Himachal Pradesh", "03-Punjab", "04-Chandigarh", "05-Uttarakhand", "06-Haryana", "07-Delhi", "08-Rajasthan", "09-Uttar Pradesh", "10-Bihar", "11-Sikkim", "12-Arunachal Pradesh", "13-Nagaland", "14-Manipur", "15-Mizoram", "16-Tripura", "17-Meghalaya", "18-Assam", "19-West Bengal", "20-Jharkhand", "21-Odisha", "22-Chhattisgarh", "23-Madhya Pradesh", "24-Gujarat", "25-Daman & Diu", "26-Dadra & Nagar Haveli", "27-Maharashtra", "29-Karnataka", "30-Goa", "31-Lakshdweep", "32-Kerala", "33-Tamil Nadu", "34-Pondicherry", "35-Andaman & Nicobar Islands", "36-Telangana", "37-Andhra Pradesh","38-Ladakh", "97-Other Territory"];
var b2bHeaderL4 = ["Supplier Name", "GSTIN of Supplier", "Invoice Number", "Invoice date", "Invoice Value", "Place Of Supply", "Reverse Charge", "Invoice Type", "Rate", "Taxable Value", "Integrated Tax Paid", "Central Tax Paid", "State/UT Tax Paid", "Cess Paid", "Eligibility For ITC", "Availed ITC Integrated Tax", "Availed ITC Central Tax", "Availed ITC State/UT Tax", "Availed ITC Cess", "Saved/Submitted", "Invoice Action Status", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "UPDTP Data(Please DO NOT Update/Delete)"];

var b2burHeaderL4 = ["Supplier Name", "Invoice Number", "Invoice date", "Invoice Value", "Place Of Supply", "Supply Type", "Rate", "Taxable Value", "Integrated Tax Paid", "Central Tax Paid", "State/UT Tax Paid", "Cess Paid", "Eligibility For ITC", "Availed ITC Integrated Tax", "Availed ITC Central Tax", "Availed ITC State/UT Tax", "Availed ITC Cess", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var impsHeaderL4 = ["Invoice Number of Reg Recipient", "Invoice date", "Invoice Value", "Place Of Supply", "Rate", "Taxable Value", "Integrated Tax Paid", "Cess Paid", "Eligibility For ITC", "Availed ITC Integrated Tax", "Availed ITC Cess", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var impgHeaderL4 = ["Port Code", "Bill Of Entry Number", "Bill Of Entry Date", "Bill Of Entry Value", "Document type", "GSTIN Of SEZ Supplier", "Rate", "Taxable Value", "Integrated Tax Paid", "Cess Paid", "Eligibility For ITC", "Availed ITC Integrated Tax", "Availed ITC Cess", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var cdnrHeaderL4 = ["Supplier Name", "GSTIN of Supplier", "Note/Refund Voucher Number", "Note/Refund Voucher date", "Invoice/Advance Payment Voucher Number", "Invoice/Advance Payment Voucher date", "Pre GST", "Document Type", "Reason For Issuing document", "Supply Type", "Note/Refund Voucher Value", "Rate", "Taxable Value", "Integrated Tax Paid", "Central Tax Paid", "State/UT Tax Paid", "Cess Paid", "Eligibility For ITC", "Availed ITC Integrated Tax", "Availed ITC Central Tax", "Availed ITC State/UT Tax", "Availed ITC Cess", "Saved/Submitted", "Invoice Action Status", "Action", "Mandatory Check Field(Please DO NOT Update/Delete)", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)", "UPDTP Data(Please DO NOT Update/Delete)"];

var cdnurHeaderL4 = ["Note/Voucher Number", "Note/Voucher date", "Invoice/Advance Payment Voucher number", "Invoice/Advance Payment Voucher date", "Invoice Type", "Pre GST", "Document Type", "Reason For Issuing document", "Supply Type", "Note/Voucher Value", "Rate", "Taxable Value", "Integrated Tax Paid", "Central Tax Paid", "State/UT Tax Paid", "Cess Paid", "Eligibility For ITC", "Availed ITC Integrated Tax", "Availed ITC Central Tax", "Availed ITC State/UT Tax", "Availed ITC Cess", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var txiHeaderL4 = ["Place Of Supply", "Supply Type", "Rate", "Gross Advance Paid", "Cess Amount", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var atadjHeaderL4 = ["Place Of Supply", "Supply Type", "Rate", "Gross Advance Paid to be Adjusted", "Cess Adjusted", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var nilHeaderL4 = ["Description", "Composition taxable person", "Nil Rated Supplies", "Exempted (other than nil rated/non GST supply )", "Non-GST supplies"];

var itcrHeaderL4 = ["Description for reversal of ITC", "To be added or reduced from output liability", "ITC Integrated Tax Amount", "ITC Central Tax Amount", "ITC State/UT Tax Amount", "ITC Cess Amount", "Action"];

var hsnsumHeaderL4 = ["HSN", "Description", "UQC", "Total Quantity", "Total Value", "Taxable Value", "Integrated Tax Amount", "Central Tax Amount", "State/UT Tax Amount", "Cess Amount", "Action", "Mandatory Unique Num Identifier(Please DO NOT Update/Delete)"];

var UQCList = [
    { "value": "BAG", "name": "BAG-BAG" }, { "value": "BGS", "name": "BGS-BAGS" }, { "value": "BKL", "name": "BKL-BUCKLES" }, { "value": "BOU", "name": "BOU-BOU" }, { "value": "BOX", "name": "BOX-BOX" }, { "value": "BTL", "name": "BTL-BOTTLES" }, { "value": "BUN", "name": "BUN-BUNCHES" }, { "value": "CBM", "name": "CBM-CUBIC METER" }, { "value": "CCM", "name": "CCM-CUBIC CENTIMETER" }, { "value": "CIN", "name": "CIN-CUBICINCHES" }, { "value": "CMS", "name": "CMS" }, { "value": "CQM", "name": "CQM-CUBIC METERS" }, { "value": "CTN", "name": "CTN-CARTON" }, { "value": "DOZ", "name": "DOZ-DOZEN" }, { "value": "DRM", "name": "DRM-DRUM" }, { "value": "FTS", "name": "FTS-FEET" }, { "value": "GGR", "name": "GGR-GREAT GROSS" }, { "value": "GMS", "name": "GMS-GRAMS" }, { "value": "GRS", "name": "GRS-GROSS" }, { "value": "GYD", "name": "GYD-GROSS YARDS" }, { "value": "HKS", "name": "HKS-HANKS" }, { "value": "INC", "name": "INC-INCHES" }, { "value": "KGS", "name": "KGS-Kilograms" }, { "value": "KLR", "name": "KLR-KILOLITRE" }, { "value": "KME", "name": "KME-KILOMETERS" }, { "value": "LBS", "name": "LBS-POUNDS" }, { "value": "LOT", "name": "LOT-LOTS" }, { "value": "LTR", "name": "LTR-LITERS" }, { "value": "MGS", "name": "MGS-MILLI GRAMS" }, { "value": "MTR", "name": "MTR-METER" }, { "value": "MLT", "name": "MLT-MILLI LITRES" }, { "value": "MTS", "name": "MTS-METRIC TON" }, { "value": "NOS", "name": "NOS-Numbers" }, { "value": "ODD", "name": "ODD-ODDS" }, { "value": "PAC", "name": "PAC-PACKS" }, { "value": "PCS", "name": "PCS-Pieces" }, { "value": "PRS", "name": "PRS-PAIRS" }, { "value": "QTL", "name": "QTL-QUINTAL" }, { "value": "ROL", "name": "ROL-ROLLS" }, { "value": "SDM", "name": "SDM-DECAMETER SQUARE" }, { "value": "SET", "name": "SET-SETS" }, { "value": "SHT", "name": "SHT-SHEETS" }, { "value": "SQF", "name": "SQF-SQUARE FEET" }, { "value": "SQI", "name": "SQI-SQUARE INCHES" }, { "value": "SQM", "name": "SQM-SQUARE METER" }, { "value": "SQY", "name": "SQY-SQUARE YARDS" }, { "value": "TBS", "name": "TBS-TABLETS" }, { "value": "THD", "name": "THD-THOUSANDS" }, { "value": "TOL", "name": "TOL-TOLA" }, { "value": "TON", "name": "TON-GREAT BRITAIN TON" }, { "value": "TUB", "name": "TUB-TUBES" }, { "value": "UGS", "name": "UGS-US GALLONS" }, { "value": "UNT", "name": "UNT-UNITS" }, { "value": "VLS", "name": "VLS-Vials" }, { "value": "YDS", "name": "YDS-YARDS" }, { "value": "NA", "name": "NA" }
];

var rules = {

    "rule2_2": "(a) Amount in terms of rule 37 (2)",
    "rule7_1_m": "(b) Amount in terms of rule 42 (1) (m)",
    "rule8_1_h": "(c) Amount in terms of rule 43(1) (h)",
    "rule7_2_a": "(d) Amount in terms of rule 42 (2)(a)",
    "rule7_2_b": "(e) Amount in terms of rule 42(2)(b)",
    "revitc": "(f) On account of amount paid subsequent to reversal of ITC",
    "other": "(g) Any other liability (Specify)"

};

var styleL4 = workbook.createStyle({
    font: {
        family: 'roman',
        size: 11
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: "#ffbb99"
    },
    alignment: {
        wrapText: true
    }
});

var styleL1L2 = workbook.createStyle({
    font: {
        family: 'roman',
        size: 11,
        color: '#FFFFFF',
        bold: true
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: "#336699"
    },
    alignment: {
        wrapText: true
    },
    border: {
        left: {
            style: 'medium',
            color: '#000000'
        },
        right: {
            style: 'medium',
            color: '#000000'
        },
        top: {
            style: 'medium',
            color: '#000000'
        },
        bottom: {
            style: 'medium',
            color: '#000000'
        }
    }
});

var rowPtr = 5;
var currSheet;


function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file) {

    var filepath = __dirname + '/' + file;

    return readJsonFileSync(filepath);
}

//assume that config.json is in application root

var writeJSONToExcel = function (filename, form, type, _callback) {

    workbook = new xl.Workbook();
    worksheetsArray = [];
    sectionNameArray = [];
    if (type == "Error") {
        json = getConfig(filename).error_report;
    }
    else {
        json = getConfig(filename);
    }


    //creating worksheets

    for (var section in json) {

        if ((allSectionsArray.indexOf(section) > -1 || allSectionsArrayG1.indexOf(section) > -1) && (json[section].length > 0 || Object.keys(json[section]).length > 0)) {
            sectionNameArray.push(section);
        }
    }
    sectionNameArray.forEach(function (section) {
        if (section.toLowerCase() == 'imp_g') {
            worksheetsArray.push('impg');
        }
        else if (section.toLowerCase() == 'imp_s') {
            worksheetsArray.push('imps');
        }
        else if (section.toLowerCase() == 'nil_supplies' || section.toLowerCase() == 'nil') {
            worksheetsArray.push('exemp');
        }
        else if (section.toLowerCase() == 'txi') {
            worksheetsArray.push('at');
        }
        else if (section.toLowerCase() == 'itc_rvsl') {
            worksheetsArray.push('itcr');
        }
        else if (section.toLowerCase() == 'cdn') {
            worksheetsArray.push('cdnr');
        }
        else if (section.toLowerCase() == 'txpd') {
            worksheetsArray.push('atadj');
        }
        else if (section.toLowerCase() == 'txpda') {
            worksheetsArray.push('atadja');
        }
        else if (section.toLowerCase() == 'doc_issue') {
            worksheetsArray.push('docs');
        }
        else if (section.toLowerCase() == 'hsnsum') {
            worksheetsArray.push('hsn');
        }
        else {
            worksheetsArray.push(section);
        }

    });
    for (var i = 0; i < worksheetsArray.length; i++) {
        rowPtr = 5;
        currSheet = workbook.addWorksheet(worksheetsArray[i]);
        if (form == 'GSTR2') {
            switch (sectionNameArray[i]) {
                case 'b2b':
                    for (var col = 1; col <= b2bHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(b2bHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns
                    currSheet.column(23).hide();
                    currSheet.column(24).hide();
                    currSheet.column(25).hide();

                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        var currStatus = props['cfs'];
                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];

                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];
                            var currInvType = getFullInvType(invoice['inv_typ']);
                            var currPos = '';
                            if (invoice.hasOwnProperty('pos'))
                                currPos = getFullPOS(invoice['pos']);
                            var currRevChange = '';
                            if (invoice.hasOwnProperty('rchrg'))
                                currRevChange = invoice['rchrg'];
                            var currInvNum = invoice['inum'];
                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = invoice['flag'];
                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];
                            var currUpdByTP = '';
                            if (currFlag == 'U')
                                currUpdByTP = 'U';

                            invoice['itms'].forEach(function (item) {
                                writeB2BDataToExcel(currSheet, currCtin, currStatus, currSuppName, currInvValue, currInvDate, currInvType, currPos, currRevChange, currInvNum, currFlag, currChckSum, currUpdByTP, item);
                            });
                        });
                    });
                    addL1L2Header('b2b');
                    //addL3Formula('b2b'); Works! But commented due to requirement change
                    addDropdownValidation('b2b');
                    rowPtr = 5;
                    break;

                case 'b2bur':
                    for (var col = 1; col <= b2burHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(b2burHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(19).hide();

                    json[sectionNameArray[i]].forEach(function (props) {



                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            //console.log(invoice);
                            var currSuppName = "";
                            if (invoice.hasOwnProperty('cname'))
                                currSuppName = invoice['cname'];

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];
                            var currSuppType = '';
                            if (invoice.hasOwnProperty('sply_ty'))
                                currSuppType = invoice['sply_ty'];
                            var currPos = '';
                            if (invoice.hasOwnProperty('pos'))
                                currPos = getFullPOS(invoice['pos']);
                            var currInvNum = invoice['inum'];
                            invoice['itms'].forEach(function (item) {
                                writeB2BURDataToExcel(currSuppName, currInvValue, currInvDate, currSuppType, currPos, currInvNum, item);
                            });
                        });
                    });
                    addL1L2Header('b2bur');
                    //addL3Formula('b2bur'); Works! But commented due to requirement change
                    addDropdownValidation('b2bur');
                    rowPtr = 5;
                    break;

                case 'imp_s':
                    for (var col = 1; col <= impsHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(impsHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(13).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currInvValue = 0.00;
                        if (item.hasOwnProperty('val'))
                            currInvValue = Number(item['ival']).toFixed(2);
                        var currInvDate = item['idt'];
                        var currPos = '';
                        if (item.hasOwnProperty('pos'))
                            currPos = getFullPOS(item['pos']);
                        var currInvNum = item['inum'];
                        item['itms'].forEach(function (innerItem) {
                            writeIMPSDataToExcel(currInvValue, currInvDate, currPos, currInvNum, innerItem);
                        });
                    });
                    addL1L2Header('imps');
                    //                addL3Formula('imps'); Works! But commented due to requirement change
                    addDropdownValidation('imps');
                    rowPtr = 5;
                    break;

                case 'imp_g':
                    for (var col = 1; col <= impgHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(impgHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(15).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currBillEValue = 0.00;
                        if (item.hasOwnProperty('boe_val'))
                            currBillEValue = Number(item['boe_val']).toFixed(2);
                        var currBillEDate = item['boe_dt'];
                        var currPortCode = item['port_code'];
                        var currBillENum = item['boe_num'];
                        var curDocType = (item['is_sez'] == 'Y') ? "Received from SEZ" : "Imports";
                        var currGSTINSupp = "";
                        if (item['is_sez'] == 'Y' && item.hasOwnProperty('stin')) {
                            currGSTINSupp = item['stin'];
                        }
                        item['itms'].forEach(function (innerItem) {
                            writeIMPGDataToExcel(currBillEValue, currBillEDate, currPortCode, currBillENum, curDocType, currGSTINSupp, innerItem);
                        });
                    });
                    addL1L2Header('impg');
                    //                addL3Formula('impg'); Works! But commented due to requirement change
                    addDropdownValidation('impg');
                    rowPtr = 5;
                    break;

                case 'cdn':
                    for (var col = 1; col <= cdnrHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(cdnrHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns
                    currSheet.column(26).hide();
                    currSheet.column(27).hide();
                    currSheet.column(28).hide();

                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        var currStatus = props['cfs'];
                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];

                        props['nt'].forEach(function (note) {

                            var currNoteNum = note['nt_num'];
                            var currNoteDate = note['nt_dt'];
                            var currInvNum = '';
                            if (note.hasOwnProperty('inum'))
                                currInvNum = note['inum'];
                            var currInvDate = '';
                            if (note.hasOwnProperty('idt'))
                                currInvDate = note['idt'];
                            var currPreGST = '';
                            if (note.hasOwnProperty('p_gst'))
                                currPreGST = note['p_gst'];
                            var currDocType = '';
                            if (note.hasOwnProperty('ntty'))
                                currDocType = note['ntty'];
                            var currReason = '';
                            if (note.hasOwnProperty('rsn'))
                                currReason = note['rsn'];
                            var currNoteValue = 0.00;
                            if (note.hasOwnProperty('val'))
                                currNoteValue = note['val'];
                            var currFlag = note['flag'];
                            var currChckSum = '';
                            if (note.hasOwnProperty('chksum'))
                                currChckSum = note['chksum'];
                            var currUpdByTP = '';
                            if (currFlag == 'U')
                                currUpdByTP = 'U';

                            note['itms'].forEach(function (innerItem) {
                                writeCDNDataToExcel(currCtin, currStatus, currSuppName, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currReason, currNoteValue, currFlag, currChckSum, currUpdByTP, innerItem);


                            });
                        });
                    });
                    addL1L2Header('cdnr');
                    //                addL3Formula('cdnr'); Works! But commented due to requirement change
                    addDropdownValidation('cdnr');
                    rowPtr = 5;
                    break;

                case 'cdnur':
                    for (var col = 1; col <= cdnurHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(cdnurHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(23).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currNoteNum = item['nt_num'];
                        var currNoteDate = item['nt_dt'];
                        var currInvNum = '';
                        if (item.hasOwnProperty('inum'))
                            currInvNum = item['inum'];
                        var currInvDate = '';
                        if (item.hasOwnProperty('idt'))
                            currInvDate = item['idt'];
                        var currInvType = '';
                        if (item.hasOwnProperty('inv_typ'))
                            currInvType = item['inv_typ'];
                        var currPreGST = '';
                        if (item.hasOwnProperty('p_gst'))
                            currPreGST = item['p_gst'];
                        var currDocType = '';
                        if (item.hasOwnProperty('ntty'))
                            currDocType = item['ntty'];
                        var currReason = '';
                        if (item.hasOwnProperty('rsn'))
                            currReason = item['rsn'];
                        var currNoteValue = '';
                        if (item.hasOwnProperty('val'))
                            currNoteValue = item['val'];
                        var currSuppType = '';
                        if (item.hasOwnProperty('sp_typ'))
                            currSuppType = item['sp_typ'];

                        item['itms'].forEach(function (innerItem) {
                            writeCDNURDataToExcel(currNoteNum, currNoteDate, currInvNum, currInvDate, currInvType, currPreGST, currDocType, currReason, currNoteValue, currSuppType, innerItem);

                        });
                    });
                    addL1L2Header('cdnur');
                    //                addL3Formula('cdnur'); Works! But commented due to requirement change
                    addDropdownValidation('cdnur');
                    rowPtr = 5;
                    break;

                case 'txi':
                    for (var col = 1; col <= txiHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(txiHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(7).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        item['itms'].forEach(function (innerItem) {
                            writeTXIDataToExcel(currPos, currSuppType, innerItem);
                        });

                    });
                    addL1L2Header('at');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addDropdownValidation('at');
                    rowPtr = 5;
                    break;

                case 'txpd':
                    for (var col = 1; col <= atadjHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(atadjHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(7).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];
                        item['itms'].forEach(function (innerItem) {
                            writeATADJDataToExcel(currPos, currSuppType, innerItem);
                        });

                    });
                    addL1L2Header('atadj');
                    //                addL3Formula('atadj'); Works! But commented due to requirement change
                    addDropdownValidation('atadj');
                    rowPtr = 5;
                    break;

                case 'hsnsum':
                    for (var col = 1; col <= hsnsumHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(hsnsumHeaderL4[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(12).hide();

                    json[sectionNameArray[i]]['det'].forEach(function (item) {

                        writeHSNSUMDataToExcel(item);

                    });
                    addL1L2Header('hsnsum');
                    //                addL3Formula('hsnsum'); Works! But commented due to requirement change
                    //addDropdownValidation('hsnsum');
                    rowPtr = 5;
                    break;

                case 'itc_rvsl':
                    for (var col = 1; col <= itcrHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(itcrHeaderL4[col - 1]).style(styleL4);
                    }

                    writeITCRDataToExcel(json[sectionNameArray[i]]);
                    addL1L2Header('itcr');
                    //                addL3Formula('itcr'); Works! But commented due to requirement change
                    //addDropdownValidation('itcr');
                    rowPtr = 5;
                    break;

                case 'nil_supplies':
                    for (var col = 1; col <= nilHeaderL4.length; col++) {
                        currSheet.cell(4, col).string(nilHeaderL4[col - 1]).style(styleL4);
                    }

                    writeNilDataToExcel(json[sectionNameArray[i]]);
                    addL1L2Header('exemp');
                    //                addL3Formula('exemp'); Works! But commented due to requirement change
                    //addDropdownValidation('exemp');
                    rowPtr = 5;
                    break;
            }
        }
        else if (type == 'Import' && form == 'GSTR1') {
            switch (sectionNameArray[i]) {
                case 'b2b':
                    for (var col = 1; col <= b2bHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(b2bHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(16).hide();
                    currSheet.column(17).hide();
                    currSheet.column(18).hide();
                    currSheet.column(19).hide();
                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        var currStatus = props['cfs'];
                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];
                            var currInvType = getFullInvType(invoice['inv_typ']);
                            var currPos = '';
                            if (invoice.hasOwnProperty('pos'))
                                currPos = getFullPOS(invoice['pos']);

                            var currRevChange = '';
                            if (invoice.hasOwnProperty('rchrg'))
                                currRevChange = invoice['rchrg'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];

                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = invoice['flag'];

                            /*var currCFlag = '';
                            if (invoice.hasOwnProperty('cflag'))
                                currCFlag = invoice['cflag'];*/
                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];

                            var currUpdBy = '';
                            if (invoice.hasOwnProperty('updby'))
                                currUpdBy = invoice['updby'];
                            // if (currFlag == 'U')
                            //     currUpdBy = 'U';

                            invoice['itms'].forEach(function (item) {
                                writeB2BDataToExcelG1(currSheet, currCtin, currSuppName, currStatus, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currFlag, currChckSum, currUpdBy, currDiffPerc, item);
                            });
                        });
                    });
                    addL1L2HeaderG1('b2b');
                    addPOSList('b2b');
                    addDropdownValidationG1('b2b');

                    rowPtr = 5;
                    break;
                case 'b2ba':
                    for (var col = 1; col <= b2baHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(b2baHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(18).hide();
                    currSheet.column(19).hide();
                    currSheet.column(20).hide();
                    currSheet.column(21).hide();

                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        var currStatus = props['cfs'];
                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        props['inv'].forEach(function (invoice) {
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];
                            var oldInvDate = invoice['oidt'];
                            var currInvType = getFullInvType(invoice['inv_typ']);
                            var currPos = '';
                            if (invoice.hasOwnProperty('pos'))
                                currPos = getFullPOS(invoice['pos']);

                            var currRevChange = '';
                            if (invoice.hasOwnProperty('rchrg'))
                                currRevChange = invoice['rchrg'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];

                            var oldInvNum = invoice['oinum'];

                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = invoice['flag'];

                            /*var currCFlag = '';
                            if (invoice.hasOwnProperty('cflag'))
                                currCFlag = invoice['cflag'];*/
                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];

                            var currUpdBy = '';
                            if (invoice.hasOwnProperty('updby'))
                                currUpdBy = invoice['updby'];
                            // if (currFlag == 'U')
                            //     currUpdBy = 'U';

                            invoice['itms'].forEach(function (item) {
                                writeB2BADataToExcelG1(currSheet, currCtin, currSuppName, currStatus, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currFlag, currChckSum, currUpdBy, currDiffPerc, oldInvNum, oldInvDate, item);
                            });
                        });
                    });
                    addL1L2HeaderG1('b2ba');
                    addPOSList('b2ba');
                    addDropdownValidationG1('b2ba');
                    rowPtr = 5;
                    break;
                case 'b2cl':
                    for (var col = 1; col <= b2clHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(b2clHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();
                    currSheet.column(13).hide();
                    currSheet.column(14).hide();

                    json[sectionNameArray[i]].forEach(function (props) {


                        var currPos = '';
                        if (props.hasOwnProperty('pos'))
                            currPos = getFullPOS(props['pos']);
                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            //console.log(invoice);

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);

                            var currInvDate = invoice['idt'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = invoice['flag'];

                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];

                            invoice['itms'].forEach(function (item) {
                                writeB2CLDataToExcelG1(currInvValue, currInvDate, currETIN, currPos, currInvNum, currFlag, currChckSum, currDiffPerc, item);
                            });
                        });
                    });
                    addL1L2HeaderG1('b2cl');
                    addPOSList('b2cl');
                    addDropdownValidationG1('b2cl');
                    rowPtr = 5;
                    break;
                case 'b2cla':
                    for (var col = 1; col <= b2claHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(b2claHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(13).hide();
                    currSheet.column(14).hide();
                    currSheet.column(15).hide();
                    currSheet.column(16).hide();
                    json[sectionNameArray[i]].forEach(function (props) {


                        var currPos = '';
                        if (props.hasOwnProperty('pos'))
                            currPos = getFullPOS(props['pos']);
                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            //console.log(invoice);

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);

                            var currInvDate = invoice['idt'];
                            var oldInvDate = invoice['oidt'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];
                            var oldInvNum = invoice['oinum'];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = invoice['flag'];

                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];

                            invoice['itms'].forEach(function (item) {
                                writeB2CLADataToExcelG1(currInvValue, currInvDate, currETIN, currPos, currInvNum, currFlag, currChckSum, currDiffPerc, oldInvDate, oldInvNum, item);
                            });
                        });
                    });
                    addL1L2HeaderG1('b2cla');
                    addPOSList('b2cla');
                    addDropdownValidationG1('b2cla');
                    rowPtr = 5;

                    break;
                case 'b2cs':
                    for (var col = 1; col <= b2csHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(b2csHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(9).hide();
                    currSheet.column(10).hide();
                    currSheet.column(11).hide();

                    json[sectionNameArray[i]].forEach(function (invoice) {

                        var currDiffPerc = '';
                        if (invoice.hasOwnProperty('diff_percent')) {
                            if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        var currTxValue = "0.00";
                        if (invoice.hasOwnProperty('txval'))
                            currTxValue = Number(invoice['txval']).toFixed(2).toString();

                        var currCSAmount = "0.00";
                        if (invoice.hasOwnProperty('csamt'))
                            currCSAmount = Number(invoice['csamt']).toFixed(2).toString();

                        /*var currIAmount = "0.00";
                        if (invoice.hasOwnProperty('iamt'))
                            currIAmount = Number(invoice['iamt']).toFixed(2).toString();*/

                        var currETIN = '';
                        if (invoice.hasOwnProperty('etin'))
                            currETIN = invoice['etin'];

                        var currFlag = '';
                        if (invoice.hasOwnProperty('flag'))
                            currFlag = flags[invoice['flag']];

                        var currSuppType = '';
                        if (invoice.hasOwnProperty('sply_ty'))
                            currSuppType = invoice['sply_ty'];

                        var currRate = '';
                        if (invoice.hasOwnProperty('rt'))
                            currRate = invoice['rt'].toFixed(2).toString();
                        else
                            currRate = "0.00";

                        /*var currCAmt = '';
                        if (invoice.hasOwnProperty('camt'))
                            currCAmt = invoice['camt'].toFixed(2).toString();
                        else
                            currCAmt = "0.00";
                        var currSAmt = '';
                        if (invoice.hasOwnProperty('samt'))
                            currSAmt = invoice['samt'].toFixed(2).toString();
                        else
                            currSAmt = "0.00";*/

                        var currType = '';
                        if (invoice.hasOwnProperty('typ'))
                            currType = invoice['typ'];

                        var currPos = '';
                        if (invoice.hasOwnProperty('pos'))
                            currPos = getFullPOS(invoice['pos']);

                        var currChckSum = '';
                        if (invoice.hasOwnProperty('chksum'))
                            currChckSum = invoice['chksum'];

                        writeB2CSDataToExcelG1(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currFlag, currDiffPerc, currChckSum);


                    });
                    addL1L2HeaderG1('b2cs');
                    //addL3Formula('b2bur'); Works! But commented due to requirement change
                    addPOSList('b2cs');
                    addDropdownValidationG1('b2cs');
                    rowPtr = 5;
                    break;
                case 'b2csa':
                    for (var col = 1; col <= b2csaHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(b2csaHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();
                    currSheet.column(13).hide();

                    json[sectionNameArray[i]].forEach(function (invoice) {

                        var currDiffPerc = '';
                        if (invoice.hasOwnProperty('diff_percent')) {
                            if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        var currTxValue = "0.00";
                        if (invoice.hasOwnProperty('txval'))
                            currTxValue = Number(invoice['txval']).toFixed(2).toString();

                        var currCSAmount = "0.00";
                        if (invoice.hasOwnProperty('csamt'))
                            currCSAmount = Number(invoice['csamt']).toFixed(2).toString();

                        /*var currIAmount = "0.00";
                        if (invoice.hasOwnProperty('iamt'))
                            currIAmount = Number(invoice['iamt']).toFixed(2).toString();*/

                        var currETIN = '';
                        if (invoice.hasOwnProperty('etin'))
                            currETIN = invoice['etin'];

                        var currFlag = '';
                        if (invoice.hasOwnProperty('flag'))
                            currFlag = flags[invoice['flag']];

                        var currSuppType = '';
                        if (invoice.hasOwnProperty('sply_ty'))
                            currSuppType = invoice['sply_ty'];

                        var currRate = '';
                        if (invoice.hasOwnProperty('rt'))
                            currRate = invoice['rt'].toFixed(2).toString();
                        else
                            currRate = "0.00";

                        /*var currCAmt = '';
                        if (invoice.hasOwnProperty('camt'))
                            currCAmt = invoice['camt'].toFixed(2).toString();
                        else
                            currCAmt = "0.00";
                        var currSAmt = '';
                        if (invoice.hasOwnProperty('samt'))
                            currSAmt = invoice['samt'].toFixed(2).toString();
                        else
                            currSAmt = "0.00";*/

                        var oldMonth = '';
                        if (invoice.hasOwnProperty('omon'))
                            var mon = invoice['omon'].substring(0, 2);
                        oldMonth = getMonth(mon);
                        var oldYear = '';
                        var iYY = invoice['omon'].substring(2),
                            iYY2 = cnvt2Nm(invoice['omon'].substring(4)) + 1;
                        oldYear = iYY + "-" + iYY2;

                        var currType = '';
                        if (invoice.hasOwnProperty('typ'))
                            currType = invoice['typ'];

                        var currPos = '';
                        if (invoice.hasOwnProperty('pos'))
                            currPos = getFullPOS(invoice['pos']);

                        var currChckSum = '';
                        if (invoice.hasOwnProperty('chksum'))
                            currChckSum = invoice['chksum'];

                        writeB2CSADataToExcelG1(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currFlag, currDiffPerc, oldYear, oldMonth, currChckSum);


                    });
                    addL1L2HeaderG1('b2csa');
                    //addL3Formula('b2bur'); Works! But commented due to requirement change
                    addPOSList('b2csa');
                    addDropdownValidationG1('b2csa');
                    rowPtr = 5;

                    break;
                case 'cdnr':
                case 'cdn':
                    for (var col = 1; col <= cdnrHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(cdnrHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(17).hide();
                    currSheet.column(18).hide();
                    currSheet.column(19).hide();



                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        var currStatus = props['cfs'];

                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }

                        props['nt'].forEach(function (note) {

                            var currNoteNum = note['nt_num'];
                            var currNoteDate = note['nt_dt'];
                            var currInvNum = '';
                            if (note.hasOwnProperty('inum'))
                                currInvNum = note['inum'];
                            var currInvDate = '';
                            if (note.hasOwnProperty('idt'))
                                currInvDate = note['idt'];
                            var currPreGST = '';
                            if (note.hasOwnProperty('p_gst'))
                                currPreGST = note['p_gst'];
                            var currDocType = '';
                            if (note.hasOwnProperty('ntty'))
                                currDocType = note['ntty'];
                            /*var currReason = '';
                            if (note.hasOwnProperty('rsn'))
                                currReason = note['rsn'];*/
                            var currNoteValue = 0.00;
                            if (note.hasOwnProperty('val'))
                                currNoteValue = note['val'];

                            var currChckSum = '';
                            if (note.hasOwnProperty('chksum'))
                                currChckSum = note['chksum'];
                            var currUpdBy = '';
                            if (note.hasOwnProperty('updby'))
                                currUpdBy = note['updby'];

                            var currSuppType = '';
                            if (note.hasOwnProperty('sp_typ'))
                                currSuppType = note['sp_typ'];

                            var currFlag = '';
                            if (note.hasOwnProperty('flag'))
                                currFlag = note['flag'];
                            /*var currCFlag = '';*/
                            /*if (note.hasOwnProperty('cflag'))
                                currCFlag = note['cflag'];*/
                            // if (currFlag == 'U')
                            //     currUpdByTP = 'U';

                            var currDiffPerc = '';
                            if (note.hasOwnProperty('diff_percent')) {
                                if (note['diff_percent'] === 0.65 || note['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            note['itms'].forEach(function (innerItem) {
                                writeCDNDataToExcelG1(currCtin, currSuppName, currStatus, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currUpdBy, currChckSum, currDiffPerc, currSuppType, innerItem);


                            });
                        });
                    });
                    addL1L2HeaderG1('cdnr');
                    //                addL3Formula('cdnr'); Works! But commented due to requirement change
                    addDropdownValidationG1('cdnr');
                    rowPtr = 5;
                    break;
                case 'cdnra':
                case 'cdna':

                    for (var col = 1; col <= cdnraHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(cdnraHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(19).hide();
                    currSheet.column(20).hide();
                    currSheet.column(21).hide();



                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        var currStatus = props['cfs'];

                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        props['nt'].forEach(function (note) {

                            var currNoteNum = note['nt_num'];
                            var currNoteDate = note['nt_dt'];
                            var oldNoteNum = note['ont_num'];
                            var oldNoteDate = note['ont_dt'];
                            var currInvNum = '';
                            if (note.hasOwnProperty('inum'))
                                currInvNum = note['inum'];
                            var currInvDate = '';
                            if (note.hasOwnProperty('idt'))
                                currInvDate = note['idt'];
                            var currPreGST = '';
                            if (note.hasOwnProperty('p_gst'))
                                currPreGST = note['p_gst'];
                            var currDocType = '';
                            if (note.hasOwnProperty('ntty'))
                                currDocType = note['ntty'];
                            /*var currReason = '';
                            if (note.hasOwnProperty('rsn'))
                                currReason = note['rsn'];*/
                            var currNoteValue = 0.00;
                            if (note.hasOwnProperty('val'))
                                currNoteValue = note['val'];

                            var currChckSum = '';
                            if (note.hasOwnProperty('chksum'))
                                currChckSum = note['chksum'];
                            var currUpdBy = '';
                            if (note.hasOwnProperty('updby'))
                                currUpdBy = note['updby'];

                            var currSuppType = '';
                            if (note.hasOwnProperty('sp_typ'))
                                currSuppType = note['sp_typ'];

                            var currFlag = '';
                            if (note.hasOwnProperty('flag'))
                                currFlag = note['flag'];
                            /*var currCFlag = '';*/
                            /*if (note.hasOwnProperty('cflag'))
                                currCFlag = note['cflag'];*/
                            // if (currFlag == 'U')
                            //     currUpdByTP = 'U';

                            var currDiffPerc = '';
                            if (note.hasOwnProperty('diff_percent')) {
                                if (note['diff_percent'] === 0.65 || note['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            note['itms'].forEach(function (innerItem) {
                                writeCDNADataToExcelG1(currCtin, currSuppName, currStatus, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currUpdBy, currChckSum, currDiffPerc, currSuppType, oldNoteNum, oldNoteDate, innerItem);


                            });
                        });
                    });
                    addL1L2HeaderG1('cdnra');
                    //                addL3Formula('cdnr'); Works! But commented due to requirement change
                    addDropdownValidationG1('cdnra');
                    rowPtr = 5;

                    break;
                case 'cdnur':
                    for (var col = 1; col <= cdnurHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(cdnurHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(15).hide();
                    currSheet.column(16).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currUrType = '';
                        if (item.hasOwnProperty('typ'))
                            currUrType = item['typ'];
                        var currNoteNum = item['nt_num'];
                        var currNoteDate = item['nt_dt'];
                        var currInvNum = '';
                        if (item.hasOwnProperty('inum'))
                            currInvNum = item['inum'];
                        var currInvDate = '';
                        if (item.hasOwnProperty('idt'))
                            currInvDate = item['idt'];

                        var currPreGST = '';
                        if (item.hasOwnProperty('p_gst'))
                            currPreGST = item['p_gst'];
                        var currDocType = '';
                        if (item.hasOwnProperty('ntty'))
                            currDocType = item['ntty'];
                        /*var currReason = '';
                        if (item.hasOwnProperty('rsn'))
                            currReason = item['rsn'];*/
                        var currNoteValue = '';
                        if (item.hasOwnProperty('val'))
                            currNoteValue = item['val'];
                        var currFlag = '';
                        if (item.hasOwnProperty('flag'))
                            currFlag = flags[item['flag']];
                        var currSuppType = '';
                        if (item.hasOwnProperty('sp_typ'))
                            currSuppType = item['sp_typ'];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeCDNURDataToExcelG1(currUrType, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currDiffPerc, currSuppType, innerItem);

                        });
                    });
                    addL1L2HeaderG1('cdnur');
                    //                addL3Formula('cdnur'); Works! But commented due to requirement change
                    addDropdownValidationG1('cdnur');
                    rowPtr = 5;
                    break;
                case 'cdnura':

                    for (var col = 1; col <= cdnuraHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(cdnuraHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(17).hide();
                    currSheet.column(18).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currUrType = '';
                        if (item.hasOwnProperty('typ'))
                            currUrType = item['typ'];
                        var currNoteNum = item['nt_num'];
                        var currNoteDate = item['nt_dt'];
                        var oldNoteNum = item['ont_num'];
                        var oldNoteDate = item['ont_dt'];
                        var currInvNum = '';
                        if (item.hasOwnProperty('inum'))
                            currInvNum = item['inum'];
                        var currInvDate = '';
                        if (item.hasOwnProperty('idt'))
                            currInvDate = item['idt'];

                        var currPreGST = '';
                        if (item.hasOwnProperty('p_gst'))
                            currPreGST = item['p_gst'];
                        var currDocType = '';
                        if (item.hasOwnProperty('ntty'))
                            currDocType = item['ntty'];
                        /*var currReason = '';
                        if (item.hasOwnProperty('rsn'))
                            currReason = item['rsn'];*/
                        var currNoteValue = '';
                        if (item.hasOwnProperty('val'))
                            currNoteValue = item['val'];
                        var currFlag = '';
                        if (item.hasOwnProperty('flag'))
                            currFlag = flags[item['flag']];
                        var currSuppType = '';
                        if (item.hasOwnProperty('sp_typ'))
                            currSuppType = item['sp_typ'];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeCDNURADataToExcelG1(currUrType, oldNoteNum, oldNoteDate, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currDiffPerc, currSuppType, innerItem);

                        });
                    });
                    addL1L2HeaderG1('cdnura');
                    //                addL3Formula('cdnur'); Works! But commented due to requirement change
                    addDropdownValidationG1('cdnura');
                    rowPtr = 5;

                    break;
                case 'txi':
                case 'at':
                    for (var col = 1; col <= atHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(atHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(7).hide();
                    currSheet.column(8).hide();
                    currSheet.column(9).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var currChckSum = '';
                        if (item.hasOwnProperty('chksum'))
                            currChckSum = item['chksum'];

                        var currFlag = '';
                        if (item.hasOwnProperty('flag'))
                            currFlag = flags[item['flag']];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeTXIDataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, innerItem);
                        });

                    });
                    addL1L2HeaderG1('at');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addPOSList('at');
                    addDropdownValidationG1('at');
                    rowPtr = 5;
                    break;
                case 'ata':
                    for (var col = 1; col <= ataHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(ataHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(9).hide();
                    currSheet.column(10).hide();
                    currSheet.column(11).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var oldMonth = '';
                        if (item.hasOwnProperty('omon'))
                            var mon = item['omon'].substring(0, 2);
                        oldMonth = getMonth(mon);
                        var oldYear = '';
                        var iYY = item['omon'].substring(2),
                            iYY2 = cnvt2Nm(item['omon'].substring(4)) + 1;
                        oldYear = iYY + "-" + iYY2;

                        var currChckSum = '';
                        if (item.hasOwnProperty('chksum'))
                            currChckSum = item['chksum'];

                        var currFlag = '';
                        if (item.hasOwnProperty('flag'))
                            currFlag = flags[item['flag']];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeATXIDataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, oldMonth, oldYear, innerItem);
                        });

                    });
                    addL1L2HeaderG1('ata');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addPOSList('ata');
                    addDropdownValidationG1('ata');
                    rowPtr = 5;
                    break;
                case 'txpd':
                    for (var col = 1; col <= atadjHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(atadjHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(7).hide();
                    currSheet.column(8).hide();
                    currSheet.column(9).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var currChckSum = '';
                        if (item.hasOwnProperty('chksum'))
                            currChckSum = item['chksum'];

                        var currFlag = '';
                        if (item.hasOwnProperty('flag'))
                            currFlag = flags[item['flag']];
                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeATADJDataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, innerItem);
                        });

                    });
                    addL1L2HeaderG1('atadj');
                    //                addL3Formula('atadj'); Works! But commented due to requirement change
                    addPOSList('atadj');
                    addDropdownValidationG1('atadj');
                    rowPtr = 5;
                    break;
                case 'txpda':

                    for (var col = 1; col <= atadjaHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(atadjaHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(9).hide();
                    currSheet.column(10).hide();
                    currSheet.column(11).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var oldMonth = '';
                        if (item.hasOwnProperty('omon'))
                            var mon = item['omon'].substring(0, 2);
                        oldMonth = getMonth(mon);
                        var oldYear = '';
                        var iYY = item['omon'].substring(2),
                            iYY2 = cnvt2Nm(item['omon'].substring(4)) + 1;
                        oldYear = iYY + "-" + iYY2;

                        var currChckSum = '';
                        if (item.hasOwnProperty('chksum'))
                            currChckSum = item['chksum'];

                        var currFlag = '';
                        if (item.hasOwnProperty('flag'))
                            currFlag = flags[item['flag']];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeATADJADataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, oldMonth, oldYear, innerItem);
                        });

                    });
                    addL1L2HeaderG1('atadja');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addPOSList('atadja');
                    addDropdownValidationG1('atadja');
                    rowPtr = 5;
                    break;
                case 'hsnsum':
                case 'hsn':
                    for (var col = 1; col <= hsnsumHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(hsnsumHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();
                    currSheet.column(13).hide();
                    currSheet.column(14).hide();

                    var currChckSum = '';
                    if (json[sectionNameArray[i]].hasOwnProperty('chksum'))
                        currChckSum = json[sectionNameArray[i]]['chksum'];

                    json[sectionNameArray[i]]['data'].forEach(function (item) {

                        writeHSNSUMDataToExcelG1(currChckSum, item);

                    });
                    addL1L2HeaderG1('hsnsum');
                    //                addL3Formula('hsnsum'); Works! But commented due to requirement change
                    addUQC('hsnsum');
                    addDropdownValidationG1('hsnsum');
                    rowPtr = 5;
                    break;

                case 'doc_issue': //To be checked with the correct payload
                    for (var col = 1; col <= docsHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(docsHeaderL4G1[col - 1]).style(styleL4);
                    }
                    currSheet.column(6).hide();
                    writeDocsDataToExcelG1(json[sectionNameArray[i]]);
                    addL1L2HeaderG1('docs');
                    //                addL3Formula('itcr'); Works! But commented due to requirement change
                    addDoc('docs');
                    addDropdownValidationG1('docs');
                    rowPtr = 5;
                    break;

                case 'nil':
                    for (var col = 1; col <= nilHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(nilHeaderL4G1[col - 1]).style(styleL4);
                    }
                    currSheet.column(5).hide();

                    var currChckSum = '';
                    if (json[sectionNameArray[i]].hasOwnProperty('chksum'))
                        currChckSum = json[sectionNameArray[i]]['chksum'];

                    json[sectionNameArray[i]]['inv'].forEach(function (invoice) {

                        writeNilDataToExcelG1(currChckSum, invoice);

                    });


                    addL1L2HeaderG1('exemp');
                    //                addL3Formula('exemp'); Works! But commented due to requirement change
                    addDropdownValidationG1('exemp');
                    rowPtr = 5;
                    break;

                case 'exp':
                    for (var col = 1; col <= exportsHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(exportsHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns
                    currSheet.column(13).hide();
                    currSheet.column(14).hide();

                    json[sectionNameArray[i]].forEach(function (Etype) {
                        var currEType = Etype['exp_typ'];
                        Etype['inv'].forEach(function (invoice) {
                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];

                            var currInvNum = invoice['inum'];

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];

                            var currPortCode = ''
                            if (invoice.hasOwnProperty('sbpcode'))
                                currPortCode = invoice['sbpcode'];

                            var currShipNum = ''
                            if (invoice.hasOwnProperty('sbnum'))
                                currShipNum = invoice['sbnum'];

                            var currShipDate = ''
                            if (invoice.hasOwnProperty('sbdt'))
                                currShipDate = invoice['sbdt'];

                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = flags[invoice['flag']];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            invoice['itms'].forEach(function (item) {
                                writeExpDataToExcelG1(currSheet, currEType, currChckSum, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currFlag, currDiffPerc, item);
                            });
                        });
                    });
                    addL1L2HeaderG1('exp');

                    addDropdownValidationG1('exp');
                    rowPtr = 5;
                    break;
                case 'expa':
                    for (var col = 1; col <= exportsamendHeaderL4G1.length; col++) {
                        currSheet.cell(4, col).string(exportsamendHeaderL4G1[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns
                    currSheet.column(15).hide();
                    currSheet.column(16).hide();

                    json[sectionNameArray[i]].forEach(function (Etype) {
                        var currEType = Etype['exp_typ'];
                        Etype['inv'].forEach(function (invoice) {
                            var currChckSum = '';
                            if (invoice.hasOwnProperty('chksum'))
                                currChckSum = invoice['chksum'];

                            var currInvNum = invoice['inum'];
                            var oldInvNum = invoice['oinum'];
                            var oldInvDate = invoice['oidt'];
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];

                            var currPortCode = ''
                            if (invoice.hasOwnProperty('sbpcode'))
                                currPortCode = invoice['sbpcode'];

                            var currShipNum = ''
                            if (invoice.hasOwnProperty('sbnum'))
                                currShipNum = invoice['sbnum'];

                            var currShipDate = ''
                            if (invoice.hasOwnProperty('sbdt'))
                                currShipDate = invoice['sbdt'];

                            var currFlag = '';
                            if (invoice.hasOwnProperty('flag'))
                                currFlag = flags[invoice['flag']];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            invoice['itms'].forEach(function (item) {
                                writeExpaDataToExcelG1(currSheet, currEType, currChckSum, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currFlag, currDiffPerc, oldInvNum, oldInvDate, item);
                            });
                        });
                    });
                    addL1L2HeaderG1('expa');

                    addDropdownValidationG1('expa');
                    rowPtr = 5;
                    break;
            }
        }
        else if (type == 'Error' && form == 'GSTR1') {
            switch (sectionNameArray[i]) {
                case 'b2b':
                    for (var col = 1; col <= b2bHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(b2bHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(16).hide();
                    currSheet.column(17).hide();
                    currSheet.column(18).hide();
                    /*currSheet.column(17).hide();
                    currSheet.column(18).hide();*/
                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        //var currStatus = props['cfs'];
                        var currErrorMsg = props['error_msg'];
                        var currErrorCd = props['error_cd'];
                        //var currErrorCode = props['error_cd'];
                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];
                            var currInvType = getFullInvType(invoice['inv_typ']);
                            var currPos = '';
                            if (invoice.hasOwnProperty('pos'))
                                currPos = getFullPOS(invoice['pos']);

                            var currRevChange = '';
                            if (invoice.hasOwnProperty('rchrg'))
                                currRevChange = invoice['rchrg'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];


                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            invoice['itms'].forEach(function (item) {
                                writeB2BDataToExcelG1Er(currSheet, currCtin, currSuppName, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currDiffPerc, currErrorMsg, currErrorCd, item);
                            });
                        });
                    });
                    addL1L2HeaderG1Er('b2b');
                    addPOSListEr('b2b');
                    addDropdownValidationG1Er('b2b');

                    rowPtr = 5;
                    break;
                case 'b2ba':
                    for (var col = 1; col <= b2baHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(b2baHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(18).hide();
                    currSheet.column(19).hide();
                    currSheet.column(20).hide();
                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];
                        //var currStatus = props['cfs'];
                        var currErrorMsg = props['error_msg'];
                        var currErrorCd = props['error_cd'];
                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        props['inv'].forEach(function (invoice) {
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];
                            var oldInvDate = invoice['oidt'];
                            var currInvType = getFullInvType(invoice['inv_typ']);
                            var currPos = '';
                            if (invoice.hasOwnProperty('pos'))
                                currPos = getFullPOS(invoice['pos']);

                            var currRevChange = '';
                            if (invoice.hasOwnProperty('rchrg'))
                                currRevChange = invoice['rchrg'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];

                            var oldInvNum = invoice['oinum'];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }


                            invoice['itms'].forEach(function (item) {

                                writeB2BADataToExcelG1Er(currSheet, currCtin, currSuppName, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currDiffPerc, oldInvNum, oldInvDate, currErrorMsg, currErrorCd, item);
                            });
                        });
                    });
                    addL1L2HeaderG1Er('b2ba');
                    addPOSListEr('b2ba');
                    addDropdownValidationG1Er('b2ba');
                    rowPtr = 5;
                    break;

                case 'b2cl':
                    for (var col = 1; col <= b2clHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(b2clHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(12).hide();
                    currSheet.column(13).hide();
                    currSheet.column(14).hide();



                    json[sectionNameArray[i]].forEach(function (props) {


                        var currPos = '';
                        if (props.hasOwnProperty('pos'))
                            currPos = getFullPOS(props['pos']);
                        //console.log(obj['inv'].length);
                        props['inv'].forEach(function (invoice) {
                            //console.log(invoice);

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);

                            var currInvDate = invoice['idt'];
                            var currErrorMsg = props['error_msg'];
                            var currErrorCd = props['error_cd'];
                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            invoice['itms'].forEach(function (item) {
                                writeB2CLDataToExcelG1Er(currInvValue, currInvDate, currETIN, currPos, currInvNum, currDiffPerc, currErrorMsg, currErrorCd, item);
                            });
                        });
                    });
                    addL1L2HeaderG1Er('b2cl');
                    addPOSListEr('b2cl');
                    addDropdownValidationG1Er('b2cl');
                    rowPtr = 5;
                    break;
                case 'b2cla':
                    for (var col = 1; col <= b2claHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(b2claHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(14).hide();
                    currSheet.column(15).hide();
                    currSheet.column(16).hide();

                    json[sectionNameArray[i]].forEach(function (props) {


                        var currPos = '';
                        if (props.hasOwnProperty('pos'))
                            currPos = getFullPOS(props['pos']);
                        //console.log(obj['inv'].length);

                        props['inv'].forEach(function (invoice) {
                            //console.log(invoice);

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);

                            var currInvDate = invoice['idt'];
                            var oldInvDate = invoice['oidt'];

                            var currETIN = '';
                            if (invoice.hasOwnProperty('etin'))
                                currETIN = invoice['etin'];

                            var currInvNum = invoice['inum'];
                            var oldInvNum = invoice['oinum'];

                            var currErrorMsg = props['error_msg'];
                            var currErrorCd = props['error_cd'];

                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }



                            invoice['itms'].forEach(function (item) {
                                writeB2CLADataToExcelG1Er(currInvValue, currInvDate, currETIN, currPos, currInvNum, currDiffPerc, oldInvDate, oldInvNum, currErrorMsg, currErrorCd, item);
                            });
                        });
                    });
                    addL1L2HeaderG1Er('b2cla');
                    addPOSListEr('b2cla');
                    addDropdownValidationG1Er('b2cla');
                    rowPtr = 5;

                    break;


                case 'b2cs':
                    for (var col = 1; col <= b2csHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(b2csHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(10).hide();
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();

                    json[sectionNameArray[i]].forEach(function (invoice) {

                        var currDiffPerc = '';
                        if (invoice.hasOwnProperty('diff_percent')) {
                            if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }
                        var currErrorMsg = invoice['error_msg'];
                        var currErrorCd = invoice['error_cd'];

                        var currTxValue = "0.00";
                        if (invoice.hasOwnProperty('txval'))
                            currTxValue = Number(invoice['txval']).toFixed(2).toString();

                        var currCSAmount = "0.00";
                        if (invoice.hasOwnProperty('csamt'))
                            currCSAmount = Number(invoice['csamt']).toFixed(2).toString();

                        var currETIN = '';
                        if (invoice.hasOwnProperty('etin'))
                            currETIN = invoice['etin'];



                        var currSuppType = '';
                        if (invoice.hasOwnProperty('sply_ty'))
                            currSuppType = invoice['sply_ty'];

                        var currRate = '';
                        if (invoice.hasOwnProperty('rt'))
                            currRate = invoice['rt'].toFixed(2).toString();
                        else
                            currRate = "0.00";

                        var currType = '';
                        if (invoice.hasOwnProperty('typ'))
                            currType = invoice['typ'];

                        var currPos = '';
                        if (invoice.hasOwnProperty('pos'))
                            currPos = getFullPOS(invoice['pos']);


                        writeB2CSDataToExcelG1Er(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currDiffPerc, currErrorMsg, currErrorCd);


                    });
                    addL1L2HeaderG1Er('b2cs');
                    //addL3Formula('b2bur'); Works! But commented due to requirement change
                    addPOSListEr('b2cs');
                    addDropdownValidationG1Er('b2cs');
                    rowPtr = 5;
                    break;
                case 'b2csa':
                    for (var col = 1; col <= b2csaHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(b2csaHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(12).hide();
                    currSheet.column(13).hide();
                    currSheet.column(14).hide();

                    json[sectionNameArray[i]].forEach(function (invoice) {

                        var currDiffPerc = '';
                        if (invoice.hasOwnProperty('diff_percent')) {
                            if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        var currTxValue = "0.00";
                        if (invoice.hasOwnProperty('txval'))
                            currTxValue = Number(invoice['txval']).toFixed(2).toString();

                        var currCSAmount = "0.00";
                        if (invoice.hasOwnProperty('csamt'))
                            currCSAmount = Number(invoice['csamt']).toFixed(2).toString();


                        var currErrorMsg = invoice['error_msg'];
                        var currErrorCd = invoice['error_cd'];

                        var currETIN = '';
                        if (invoice.hasOwnProperty('etin'))
                            currETIN = invoice['etin'];


                        var currSuppType = '';
                        if (invoice.hasOwnProperty('sply_ty'))
                            currSuppType = invoice['sply_ty'];

                        var currRate = '';
                        if (invoice.hasOwnProperty('rt'))
                            currRate = invoice['rt'].toFixed(2).toString();
                        else
                            currRate = "0.00";



                        var oldMonth = '';
                        if (invoice.hasOwnProperty('omon')) {
                            var oldMonthValue = invoice['omon']; //required in reference key
                            var mon = invoice['omon'].substring(0, 2);
                        }
                        oldMonth = getMonth(mon);
                        var oldYear = '';
                        var iYY = invoice['omon'].substring(2),
                            iYY2 = cnvt2Nm(invoice['omon'].substring(4)) + 1;
                        oldYear = iYY + "-" + iYY2;

                        var currType = '';
                        if (invoice.hasOwnProperty('typ'))
                            currType = invoice['typ'];

                        var currPos = '';
                        if (invoice.hasOwnProperty('pos'))
                            currPos = getFullPOS(invoice['pos']);



                        writeB2CSADataToExcelG1Er(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currDiffPerc, oldYear, oldMonth, oldMonthValue, currErrorMsg, currErrorCd);


                    });
                    addL1L2HeaderG1Er('b2csa');
                    //addL3Formula('b2bur'); Works! But commented due to requirement change
                    addPOSListEr('b2csa');
                    addDropdownValidationG1Er('b2csa');
                    rowPtr = 5;

                    break;

                case 'cdnr':
                case 'cdn':
                    for (var col = 1; col <= cdnrHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(cdnrHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(17).hide();
                    currSheet.column(18).hide();


                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];


                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        var currErrorMsg = props['error_msg'];
                        var currErrorCd = props['error_cd'];
                        props['nt'].forEach(function (note) {



                            var currNoteNum = note['nt_num'];
                            var currNoteDate = note['nt_dt'];
                            var currInvNum = '';
                            if (note.hasOwnProperty('inum'))
                                currInvNum = note['inum'];
                            var currInvDate = '';
                            if (note.hasOwnProperty('idt'))
                                currInvDate = note['idt'];
                            var currPreGST = '';
                            if (note.hasOwnProperty('p_gst'))
                                currPreGST = note['p_gst'];
                            var currDocType = '';
                            if (note.hasOwnProperty('ntty'))
                                currDocType = note['ntty'];
                            /*var currReason = '';
                            if (note.hasOwnProperty('rsn'))
                                currReason = note['rsn'];*/
                            var currNoteValue = 0.00;
                            if (note.hasOwnProperty('val'))
                                currNoteValue = note['val'];



                            var currSuppType = '';
                            if (note.hasOwnProperty('sp_typ'))
                                currSuppType = note['sp_typ'];


                            var currDiffPerc = '';
                            if (note.hasOwnProperty('diff_percent')) {
                                if (note['diff_percent'] === 0.65 || note['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            note['itms'].forEach(function (innerItem) {
                                writeCDNDataToExcelG1Er(currCtin, currSuppName, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currErrorMsg, currDiffPerc, currSuppType, currErrorCd, innerItem);


                            });
                        });
                    });
                    addL1L2HeaderG1Er('cdnr');
                    //                addL3Formula('cdnr'); Works! But commented due to requirement change
                    addDropdownValidationG1Er('cdnr');
                    rowPtr = 5;
                    break;
                case 'cdnra':
                case 'cdna':

                    for (var col = 1; col <= cdnraHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(cdnraHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns                    
                    currSheet.column(19).hide();
                    currSheet.column(20).hide();


                    json[sectionNameArray[i]].forEach(function (props) {

                        var currCtin = props['ctin'];


                        var currSuppName = '';
                        if (props.hasOwnProperty('cname'))
                            currSuppName = props['cname'];
                        if (!currSuppName) {
                            currSuppName = '';
                        }
                        var currErrorMsg = props['error_msg'];
                        var currErrorCd = props['error_cd'];
                        props['nt'].forEach(function (note) {

                            var currNoteNum = note['nt_num'];
                            var currNoteDate = note['nt_dt'];
                            var oldNoteNum = note['ont_num'];
                            var oldNoteDate = note['ont_dt'];
                            var currInvNum = '';
                            if (note.hasOwnProperty('inum'))
                                currInvNum = note['inum'];
                            var currInvDate = '';
                            if (note.hasOwnProperty('idt'))
                                currInvDate = note['idt'];
                            var currPreGST = '';
                            if (note.hasOwnProperty('p_gst'))
                                currPreGST = note['p_gst'];
                            var currDocType = '';
                            if (note.hasOwnProperty('ntty'))
                                currDocType = note['ntty'];
                            /*var currReason = '';
                            if (note.hasOwnProperty('rsn'))
                                currReason = note['rsn'];*/
                            var currNoteValue = 0.00;
                            if (note.hasOwnProperty('val'))
                                currNoteValue = note['val'];


                            var currSuppType = '';
                            if (note.hasOwnProperty('sp_typ'))
                                currSuppType = note['sp_typ'];


                            var currDiffPerc = '';
                            if (note.hasOwnProperty('diff_percent')) {
                                if (note['diff_percent'] === 0.65 || note['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            note['itms'].forEach(function (innerItem) {
                                writeCDNADataToExcelG1Er(currCtin, currSuppName, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currDiffPerc, currSuppType, oldNoteNum, oldNoteDate, currErrorMsg, currErrorCd, innerItem);


                            });
                        });
                    });
                    addL1L2HeaderG1Er('cdnra');
                    //                addL3Formula('cdnr'); Works! But commented due to requirement change
                    addDropdownValidationG1Er('cdnra');
                    rowPtr = 5;

                    break;
                case 'cdnur':
                    for (var col = 1; col <= cdnurHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(cdnurHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide  column
                    currSheet.column(16).hide();
                    currSheet.column(17).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currErrorMsg = item['error_msg'];
                        var currErrorCd = item['error_cd'];
                        var currUrType = '';
                        if (item.hasOwnProperty('typ'))
                            currUrType = item['typ'];
                        var currNoteNum = item['nt_num'];
                        var currNoteDate = item['nt_dt'];
                        var currInvNum = '';
                        if (item.hasOwnProperty('inum'))
                            currInvNum = item['inum'];
                        var currInvDate = '';
                        if (item.hasOwnProperty('idt'))
                            currInvDate = item['idt'];

                        var currPreGST = '';
                        if (item.hasOwnProperty('p_gst'))
                            currPreGST = item['p_gst'];
                        var currDocType = '';
                        if (item.hasOwnProperty('ntty'))
                            currDocType = item['ntty'];
                        /*var currReason = '';
                        if (item.hasOwnProperty('rsn'))
                            currReason = item['rsn'];*/
                        var currNoteValue = '';
                        if (item.hasOwnProperty('val'))
                            currNoteValue = item['val'];

                        var currSuppType = '';
                        if (item.hasOwnProperty('sp_typ'))
                            currSuppType = item['sp_typ'];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeCDNURDataToExcelG1Er(currUrType, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currErrorMsg, currDiffPerc, currSuppType, currErrorCd, innerItem);

                        });
                    });
                    addL1L2HeaderG1Er('cdnur');
                    //                addL3Formula('cdnur'); Works! But commented due to requirement change
                    addDropdownValidationG1Er('cdnur');
                    rowPtr = 5;
                    break;
                case 'cdnura':

                    for (var col = 1; col <= cdnuraHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(cdnuraHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column

                    currSheet.column(18).hide();
                    currSheet.column(19).hide();
                    json[sectionNameArray[i]].forEach(function (item) {

                        var currErrorMsg = item['error_msg'];
                        var currErrorCd = item['error_cd'];
                        var currUrType = '';
                        if (item.hasOwnProperty('typ'))
                            currUrType = item['typ'];
                        var currNoteNum = item['nt_num'];
                        var currNoteDate = item['nt_dt'];
                        var oldNoteNum = item['ont_num'];
                        var oldNoteDate = item['ont_dt'];
                        var currInvNum = '';
                        if (item.hasOwnProperty('inum'))
                            currInvNum = item['inum'];
                        var currInvDate = '';
                        if (item.hasOwnProperty('idt'))
                            currInvDate = item['idt'];

                        var currPreGST = '';
                        if (item.hasOwnProperty('p_gst'))
                            currPreGST = item['p_gst'];
                        var currDocType = '';
                        if (item.hasOwnProperty('ntty'))
                            currDocType = item['ntty'];
                        /*var currReason = '';
                        if (item.hasOwnProperty('rsn'))
                            currReason = item['rsn'];*/
                        var currNoteValue = '';
                        if (item.hasOwnProperty('val'))
                            currNoteValue = item['val'];

                        var currSuppType = '';
                        if (item.hasOwnProperty('sp_typ'))
                            currSuppType = item['sp_typ'];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeCDNURADataToExcelG1Er(currUrType, oldNoteNum, oldNoteDate, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currErrorMsg, currDiffPerc, currSuppType, currErrorCd, innerItem);

                        });
                    });
                    addL1L2HeaderG1Er('cdnura');
                    //                addL3Formula('cdnur'); Works! But commented due to requirement change
                    addDropdownValidationG1Er('cdnura');
                    rowPtr = 5;

                    break;
                case 'txi':
                case 'at':
                    for (var col = 1; col <= atHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(atHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(8).hide();
                    currSheet.column(9).hide();
                    currSheet.column(10).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];


                        var currErrorMsg = item['error_msg'];
                        var currErrorCd = item['error_cd'];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeTXIDataToExcelG1Er(currPos, currSuppType, currDiffPerc, currErrorMsg, currErrorCd, innerItem);
                        });

                    });
                    addL1L2HeaderG1Er('at');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addPOSListEr('at');
                    addDropdownValidationG1Er('at');
                    rowPtr = 5;
                    break;
                case 'ata':
                    for (var col = 1; col <= ataHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(ataHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(10).hide();
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var oldMonth = '';
                        if (item.hasOwnProperty('omon')) {
                            var oldMonthValue = item['omon'];
                            var mon = item['omon'].substring(0, 2);
                        }
                        oldMonth = getMonth(mon);
                        var oldYear = '';
                        var iYY = item['omon'].substring(2),
                            iYY2 = cnvt2Nm(item['omon'].substring(4)) + 1;
                        oldYear = iYY + "-" + iYY2;

                        var currErrorMsg = item['error_msg'];
                        var currErrorCd = item['error_cd'];

                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeATXIDataToExcelG1Er(currPos, currSuppType, currDiffPerc, oldMonth, oldYear, oldMonthValue, currErrorMsg, currErrorCd, innerItem);
                        });

                    });
                    addL1L2HeaderG1Er('ata');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addPOSListEr('ata');
                    addDropdownValidationG1Er('ata');
                    rowPtr = 5;
                    break;
                case 'txpd':
                    for (var col = 1; col <= atadjHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(atadjHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(8).hide();
                    currSheet.column(9).hide();
                    currSheet.column(10).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var currErrorMsg = item['error_msg'];
                        var currErrorCd = item['error_cd'];


                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeATADJDataToExcelG1Er(currPos, currSuppType, currDiffPerc, currErrorMsg, currErrorCd, innerItem);
                        });

                    });
                    addL1L2HeaderG1Er('atadj');
                    //                addL3Formula('atadj'); Works! But commented due to requirement change
                    addPOSListEr('atadj');
                    addDropdownValidationG1Er('atadj');
                    rowPtr = 5;
                    break;
                case 'txpda':

                    for (var col = 1; col <= atadjaHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(atadjaHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(10).hide();
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();

                    json[sectionNameArray[i]].forEach(function (item) {

                        var currPos = getFullPOS(item['pos']);
                        var currSuppType = item['sply_ty'];

                        var oldMonth = '';
                        if (item.hasOwnProperty('omon')) {
                            var oldMonthValue = item['omon'];
                            var mon = item['omon'].substring(0, 2);
                        }
                        oldMonth = getMonth(mon);
                        var oldYear = '';
                        var iYY = item['omon'].substring(2),
                            iYY2 = cnvt2Nm(item['omon'].substring(4)) + 1;
                        oldYear = iYY + "-" + iYY2;

                        var currErrorMsg = item['error_msg'];
                        var currErrorCd = item['error_cd'];



                        var currDiffPerc = '';
                        if (item.hasOwnProperty('diff_percent')) {
                            if (item['diff_percent'] === 0.65 || item['diff_percent'] === '0.65') {
                                currDiffPerc = 65;
                            }
                            else {
                                currDiffPerc = '';
                            }
                        }

                        item['itms'].forEach(function (innerItem) {
                            writeATADJADataToExcelG1Er(currPos, currSuppType, currDiffPerc, oldMonth, oldYear, oldMonthValue, currErrorMsg, currErrorCd, innerItem);
                        });

                    });
                    addL1L2HeaderG1Er('atadja');
                    //                addL3Formula('at'); Works! But commented due to requirement change
                    addPOSListEr('atadja');
                    addDropdownValidationG1Er('atadja');
                    rowPtr = 5;
                    break;
                case 'hsnsum':
                case 'hsn':
                    for (var col = 1; col <= hsnsumHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(hsnsumHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide num column
                    currSheet.column(11).hide();
                    currSheet.column(12).hide();
                    currSheet.column(13).hide();
                    var parseData = json[sectionNameArray[i]][0];




                    var currErrorMsg = parseData['error_msg'];
                    var currErrorCd = parseData['error_cd'];

                    parseData['data'].forEach(function (item) {


                        writeHSNSUMDataToExcelG1Er(currErrorMsg, currErrorCd, item);

                    });
                    addL1L2HeaderG1Er('hsnsum');
                    //                addL3Formula('hsnsum'); Works! But commented due to requirement change
                    addUQCEr('hsnsum');
                    addDropdownValidationG1Er('hsnsum');
                    rowPtr = 5;
                    break;
                /*
            case 'doc_issue': //To be checked with the correct payload
                for (var col = 1; col <= docsHeaderL4G1Er.length; col++) {
                    currSheet.cell(4, col).string(docsHeaderL4G1Er[col - 1]).style(styleL4);
                }
                currSheet.column(6).hide();
                writeDocsDataToExcelG1Er(json[sectionNameArray[i]]);
                addL1L2HeaderG1Er('docs');
                //                addL3Formula('itcr'); Works! But commented due to requirement change
                addDocEr('docs');
                addDropdownValidationG1Er('docs');
                rowPtr = 5;
                break;

            case 'nil':
                for (var col = 1; col <= nilHeaderL4G1Er.length; col++) {
                    currSheet.cell(4, col).string(nilHeaderL4G1Er[col - 1]).style(styleL4);
                }
                currSheet.column(5).hide();

                var currChckSum = '';
                if (json[sectionNameArray[i]].hasOwnProperty('chksum'))
                    currChckSum = json[sectionNameArray[i]]['chksum'];

                json[sectionNameArray[i]]['inv'].forEach(function (invoice) {

                    writeNilDataToExcelG1Er(currChckSum, invoice);

                });


                addL1L2HeaderG1Er('exemp');
                //                addL3Formula('exemp'); Works! But commented due to requirement change
                addDropdownValidationG1Er('exemp');
                rowPtr = 5;
                break;*/

                case 'exp':
                    for (var col = 1; col <= exportsHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(exportsHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns
                    currSheet.column(14).hide();
                    currSheet.column(15).hide();


                    json[sectionNameArray[i]].forEach(function (Etype) {

                        var currEType = Etype['exp_typ'];
                        var currErrorMsg = Etype['error_msg'];
                        var currErrorCd = Etype['error_cd'];

                        Etype['inv'].forEach(function (invoice) {


                            var currInvNum = invoice['inum'];

                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];

                            var currPortCode = ''
                            if (invoice.hasOwnProperty('sbpcode'))
                                currPortCode = invoice['sbpcode'];

                            var currShipNum = ''
                            if (invoice.hasOwnProperty('sbnum'))
                                currShipNum = invoice['sbnum'];

                            var currShipDate = ''
                            if (invoice.hasOwnProperty('sbdt'))
                                currShipDate = invoice['sbdt'];



                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            invoice['itms'].forEach(function (item) {
                                writeExpDataToExcelG1Er(currSheet, currEType, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currDiffPerc, currErrorMsg, currErrorCd, item);
                            });
                        });
                    });
                    addL1L2HeaderG1Er('exp');

                    addDropdownValidationG1Er('exp');
                    rowPtr = 5;
                    break;
                case 'expa':
                    for (var col = 1; col <= exportsamendHeaderL4G1Er.length; col++) {
                        currSheet.cell(4, col).string(exportsamendHeaderL4G1Er[col - 1]).style(styleL4);
                    }
                    //To hide checksum, num and UpdBy columns
                    currSheet.column(16).hide();
                    currSheet.column(17).hide();

                    json[sectionNameArray[i]].forEach(function (Etype) {
                        var currEType = Etype['exp_typ'];
                        var currErrorMsg = Etype['error_msg'];
                        var currErrorCd = Etype['error_cd'];
                        Etype['inv'].forEach(function (invoice) {


                            var currInvNum = invoice['inum'];
                            var oldInvNum = invoice['oinum'];
                            var oldInvDate = invoice['oidt'];
                            var currInvValue = 0.00;
                            if (invoice.hasOwnProperty('val'))
                                currInvValue = Number(invoice['val']).toFixed(2);
                            var currInvDate = invoice['idt'];

                            var currPortCode = ''
                            if (invoice.hasOwnProperty('sbpcode'))
                                currPortCode = invoice['sbpcode'];

                            var currShipNum = ''
                            if (invoice.hasOwnProperty('sbnum'))
                                currShipNum = invoice['sbnum'];

                            var currShipDate = ''
                            if (invoice.hasOwnProperty('sbdt'))
                                currShipDate = invoice['sbdt'];



                            var currDiffPerc = '';
                            if (invoice.hasOwnProperty('diff_percent')) {
                                if (invoice['diff_percent'] === 0.65 || invoice['diff_percent'] === '0.65') {
                                    currDiffPerc = 65;
                                }
                                else {
                                    currDiffPerc = '';
                                }
                            }

                            invoice['itms'].forEach(function (item) {
                                writeExpaDataToExcelG1Er(currSheet, currEType, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currDiffPerc, oldInvNum, oldInvDate, currErrorMsg, currErrorCd, item);
                            });
                        });
                    });
                    addL1L2HeaderG1Er('expa');

                    addDropdownValidationG1Er('expa');
                    rowPtr = 5;
                    break;
            }
        }

    }

    workbook.write('Excel.xlsx', function (err, stats) {
        if (err) {

            console.error(err);
        }
        workbook = {};

        _callback();
        //console.log(stats); // Prints out an instance of a node.js fs.Stats object      
    });
    var end = new Date().getTime();
    var time = end - start;
    //console.log('Execution time: ' + time);
}


function writeB2BDataToExcel(currSheet, currCtin, currStatus, currSuppName, currInvValue, currInvDate, currInvType, currPos, currRevChange, currInvNum, currFlag, currChckSum, currUpdByTP, item) {

    currSheet.cell(rowPtr, 1).string(currSuppName);
    currSheet.cell(rowPtr, 2).string(currCtin);
    currSheet.cell(rowPtr, 3).string(currInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 5).string(parseFloat(currInvValue).toFixed(2));
    currSheet.cell(rowPtr, 6).string(currPos.toString());
    currSheet.cell(rowPtr, 7).string(currRevChange);
    currSheet.cell(rowPtr, 8).string(currInvType.toString());
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 10).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 14).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");
    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('elg'))
        currSheet.cell(rowPtr, 15).string(getFullItcElig(item["itc"]["elg"]).toString());
    else
        currSheet.cell(rowPtr, 15).string("");
    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_i'))
        currSheet.cell(rowPtr, 16).string(Number(item["itc"]["tx_i"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 16).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_c'))
        currSheet.cell(rowPtr, 17).string(Number(item["itc"]["tx_c"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 17).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_s'))
        currSheet.cell(rowPtr, 18).string(Number(item["itc"]["tx_s"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 18).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_cs'))
        currSheet.cell(rowPtr, 19).string(Number(item["itc"]["tx_cs"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 19).string("0.00");

    if (currStatus == "Y") {
        if (currFlag == "U" || currFlag == "D" || currFlag === undefined)
            currSheet.cell(rowPtr, 20).string("");
        else
            currSheet.cell(rowPtr, 20).string("Submitted");
    }
    else {
        if (currFlag == "U" || currFlag == "D" || currFlag === undefined)
            currSheet.cell(rowPtr, 20).string("");
        else
            currSheet.cell(rowPtr, 20).string("Saved");
    }
    if (currFlag === undefined) {
        currSheet.cell(rowPtr, 21).string("");
    }
    else {
        currSheet.cell(rowPtr, 21).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 23).string(currChckSum);

    currSheet.cell(rowPtr, 24).string(item["num"].toString());
    currSheet.cell(rowPtr, 25).string(currUpdByTP);
    ++rowPtr;

}

function writeB2BURDataToExcel(currSuppName, currInvValue, currInvDate, currSuppType, currPos, currInvNum, item) {

    currSheet.cell(rowPtr, 1).string(currSuppName.toString());
    currSheet.cell(rowPtr, 2).string(currInvNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 4).string(parseFloat(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 5).string(currPos.toString());
    if (currSuppType == "INTRA")
        currSheet.cell(rowPtr, 6).string("Intra State");
    else if (currSuppType == "INTER")
        currSheet.cell(rowPtr, 6).string("Inter State");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 10).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('elg'))
        currSheet.cell(rowPtr, 13).string(getFullItcElig(item["itc"]["elg"]).toString());
    else
        currSheet.cell(rowPtr, 13).string("");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_i'))
        currSheet.cell(rowPtr, 14).string(Number(item["itc"]["tx_i"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_c'))
        currSheet.cell(rowPtr, 15).string(Number(item["itc"]["tx_c"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_s'))
        currSheet.cell(rowPtr, 16).string(Number(item["itc"]["tx_s"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 16).string("0.00");

    if (item.hasOwnProperty('itc') && item["itc"].hasOwnProperty('tx_cs'))
        currSheet.cell(rowPtr, 17).string(Number(item["itc"]["tx_cs"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 17).string("0.00");
    if (item.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 19).string(item["num"].toString());
    else
        currSheet.cell(rowPtr, 19).string("");
    ++rowPtr;

}

function writeIMPSDataToExcel(currInvValue, currInvDate, currPos, currInvNum, innerItem) {

    currSheet.cell(rowPtr, 1).string(currInvNum);
    currSheet.cell(rowPtr, 2).string(getFormattedDate(currInvDate).toString()).style({ numberFormat: 'dd-mmm-yy' });
    currSheet.cell(rowPtr, 3).string(parseFloat(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 4).string(currPos.toString());
    currSheet.cell(rowPtr, 5).string(Number(innerItem["rt"]).toFixed(2).toString());
    currSheet.cell(rowPtr, 6).string(Number(innerItem["txval"]).toFixed(2).toString());
    currSheet.cell(rowPtr, 7).string(Number(innerItem["iamt"]).toFixed(2).toString());
    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 8).string(Number(innerItem["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    currSheet.cell(rowPtr, 9).string(getFullItcElig(innerItem["elg"]).toString());

    if (innerItem.hasOwnProperty('tx_i'))
        currSheet.cell(rowPtr, 10).string(Number(innerItem["tx_i"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (innerItem.hasOwnProperty('tx_cs'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["tx_cs"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 13).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 13).string("");
    ++rowPtr;

}

function writeIMPGDataToExcel(currBillEValue, currBillEDate, currPortCode, currBillENum, curDocType, currGSTINSupp, innerItem) {

    currSheet.cell(rowPtr, 1).string(currPortCode);
    currSheet.cell(rowPtr, 2).string(currBillENum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(currBillEDate).toString()).style({ numberFormat: 'dd-mmm-yy' });
    currSheet.cell(rowPtr, 4).string(parseFloat(currBillEValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 5).string(curDocType);
    currSheet.cell(rowPtr, 6).string(currGSTINSupp);
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 7).string(Number(innerItem["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (innerItem.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 8).string(Number(innerItem["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (innerItem.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 9).string(Number(innerItem["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 10).string(Number(innerItem["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    currSheet.cell(rowPtr, 11).string(getFullItcElig(innerItem["elg"]).toString());

    if (innerItem.hasOwnProperty('tx_i'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["tx_i"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('tx_cs'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["tx_cs"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 15).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 15).string("");
    ++rowPtr;

}

function writeCDNDataToExcel(currCtin, currStatus, currSuppName, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currReason, currNoteValue, currFlag, currChkSum, currUpdByTP, innerItem) {

    currSheet.cell(rowPtr, 1).string(currSuppName);
    currSheet.cell(rowPtr, 2).string(currCtin);
    currSheet.cell(rowPtr, 3).string(currNoteNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(currPreGST.toString());
    currSheet.cell(rowPtr, 8).string(currDocType);
    currSheet.cell(rowPtr, 9).string(currReason);
    currSheet.cell(rowPtr, 10).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 11).string(Number(currNoteValue).toFixed(2).toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 14).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 15).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 16).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 16).string("0.00");
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 17).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 17).string("0.00");

    currSheet.cell(rowPtr, 18).string(getFullItcElig(innerItem["itc"]["elg"]).toString());

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_i'))
        currSheet.cell(rowPtr, 19).string(Number(innerItem["itc"]["tx_i"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 19).string("0.00");

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_c'))
        currSheet.cell(rowPtr, 20).string(Number(innerItem["itc"]["tx_c"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 20).string("0.00");

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_s'))
        currSheet.cell(rowPtr, 21).string(Number(innerItem["itc"]["tx_s"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 21).string("0.00");

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_cs'))
        currSheet.cell(rowPtr, 22).string(Number(innerItem["itc"]["tx_cs"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 22).string("0.00");

    if (currStatus == "Y") {
        if (currFlag == "U" || currFlag == "D" || currFlag === undefined)
            currSheet.cell(rowPtr, 23).string("");
        else
            currSheet.cell(rowPtr, 23).string("Submitted");
    }

    else {
        if (currFlag == "U" || currFlag == "D" || currFlag === undefined)
            currSheet.cell(rowPtr, 23).string("");
        else
            currSheet.cell(rowPtr, 23).string("Saved");
    }


    //currSheet.cell(rowPtr,23).string(flags[currFlag].toString());
    if (currFlag === undefined)
        currSheet.cell(rowPtr, 24).string("");
    else
        currSheet.cell(rowPtr, 24).string(flags[currFlag].toString());
    currSheet.cell(rowPtr, 26).string(currChkSum);
    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 27).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 27).string("");
    currSheet.cell(rowPtr, 28).string(currUpdByTP);
    ++rowPtr;

}

function writeCDNURDataToExcel(currNoteNum, currNoteDate, currInvNum, currInvDate, currInvType, currPreGST, currDocType, currReason, currNoteValue, currSuppType, innerItem) {

    currSheet.cell(rowPtr, 1).string(currNoteNum);
    currSheet.cell(rowPtr, 2).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 3).string(currInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 5).string(currInvType);
    currSheet.cell(rowPtr, 6).string(currPreGST.toString());
    currSheet.cell(rowPtr, 7).string(currDocType);
    currSheet.cell(rowPtr, 8).string(currReason);
    currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 10).string(Number(currNoteValue).toFixed(2).toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 14).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 15).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 16).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 16).string("0.00");

    currSheet.cell(rowPtr, 17).string(getFullItcElig(innerItem["itc"]["elg"]).toString());

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_i'))
        currSheet.cell(rowPtr, 18).string(Number(innerItem["itc"]["tx_i"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 18).string("0.00");

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_c'))
        currSheet.cell(rowPtr, 19).string(Number(innerItem["itc"]["tx_c"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 19).string("0.00");

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_s'))
        currSheet.cell(rowPtr, 20).string(Number(innerItem["itc"]["tx_s"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 20).string("0.00");

    if (innerItem.hasOwnProperty('itc') && innerItem["itc"].hasOwnProperty('tx_cs'))
        currSheet.cell(rowPtr, 21).string(Number(innerItem["itc"]["tx_cs"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 21).string("0.00");

    if (innerItem.hasOwnProperty("num"))
        currSheet.cell(rowPtr, 23).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 23).string("");
    ++rowPtr;

}

function writeHSNSUMDataToExcel(item) {

    if (item.hasOwnProperty('hsn_sc'))
        currSheet.cell(rowPtr, 1).string(item['hsn_sc']);
    else
        currSheet.cell(rowPtr, 1).string("");
    if (item.hasOwnProperty('desc'))
        currSheet.cell(rowPtr, 2).string(item['desc']);
    else
        currSheet.cell(rowPtr, 2).string("");
    currSheet.cell(rowPtr, 3).string(getFullUQC(item['uqc']));

    if (item.hasOwnProperty('qty'))
        currSheet.cell(rowPtr, 4).string(Number(item['qty']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0");
    if (item.hasOwnProperty('val'))
        currSheet.cell(rowPtr, 5).string(Number(item['val']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 6).string(Number(item['txval']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item['iamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item['camt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item['samt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 10).string(Number(item['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (item.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 12).string(item["num"].toString());
    else
        currSheet.cell(rowPtr, 12).string("");
    ++rowPtr;

}

function writeITCRDataToExcel(itcrJson) {

    var ruleIndex = 1;
    for (var rule in rules) {

        //if(rules.hasOwnProperty(rule)){

        currSheet.cell(rowPtr, 1).string(rules[rule]);
        if (ruleIndex < 5)
            currSheet.cell(rowPtr, 2).string("To be added");
        else if (ruleIndex < 7)
            currSheet.cell(rowPtr, 2).string("To be reduced");
        else
            currSheet.cell(rowPtr, 2).string("");
        //console.log(rule);
        //console.log(itcrJson[0][rule]);
        if (itcrJson[rule].hasOwnProperty('iamt'))
            currSheet.cell(rowPtr, 3).string(Number(itcrJson[rule]['iamt']).toFixed(2).toString());
        else
            currSheet.cell(rowPtr, 3).string("0.00");

        if (itcrJson[rule].hasOwnProperty('camt'))
            currSheet.cell(rowPtr, 4).string(Number(itcrJson[rule]['camt']).toFixed(2).toString());
        else
            currSheet.cell(rowPtr, 4).string("0.00");

        if (itcrJson[rule].hasOwnProperty('samt'))
            currSheet.cell(rowPtr, 5).string(Number(itcrJson[rule]['samt']).toFixed(2).toString());
        else
            currSheet.cell(rowPtr, 5).string("0.00");

        if (itcrJson[rule].hasOwnProperty('csamt'))
            currSheet.cell(rowPtr, 6).string(Number(itcrJson[rule]['csamt']).toFixed(2).toString());
        else
            currSheet.cell(rowPtr, 6).string("0.00");

        ++rowPtr;
        ++ruleIndex;
        //}
    }
}

function writeNilDataToExcel(nilJson) {

    var nilIndex = 1;
    for (var type in nilJson) {
        if (nilJson.hasOwnProperty(type)) {
            if (type == "inter")
                currSheet.cell(rowPtr, 1).string("Inter-State supplies");
            else if (type == "intra")
                currSheet.cell(rowPtr, 1).string("Intra-State supplies");

            if (nilJson[type].hasOwnProperty('cpddr'))
                currSheet.cell(rowPtr, 2).string(Number(nilJson[type]['cpddr']).toFixed(2).toString());
            else
                currSheet.cell(rowPtr, 2).string("0.00");

            if (nilJson[type].hasOwnProperty('nilsply'))
                currSheet.cell(rowPtr, 3).string(Number(nilJson[type]['nilsply']).toFixed(2).toString());
            else
                currSheet.cell(rowPtr, 3).string("0.00");

            if (nilJson[type].hasOwnProperty('exptdsply'))
                currSheet.cell(rowPtr, 4).string(Number(nilJson[type]['exptdsply']).toFixed(2).toString());
            else
                currSheet.cell(rowPtr, 4).string("0.00");

            if (nilJson[type].hasOwnProperty('ngsply'))
                currSheet.cell(rowPtr, 5).string(Number(nilJson[type]['ngsply']).toFixed(2).toString());
            else
                currSheet.cell(rowPtr, 5).string("0.00");

            ++rowPtr;
            ++nilIndex;
        }
    }

}

function writeTXIDataToExcel(currPos, currSuppType, innerItem) {

    currSheet.cell(rowPtr, 1).string(currPos.toString());
    if (currSuppType == 'INTRA')
        currSheet.cell(rowPtr, 2).string("Intra State");
    else if (currSuppType == 'INTER')
        currSheet.cell(rowPtr, 2).string("Inter State");

    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 3).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 3).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 7).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 7).string("");
    ++rowPtr;

}

function writeATADJDataToExcel(currPos, currSuppType, innerItem) {

    currSheet.cell(rowPtr, 1).string(currPos.toString());
    if (currSuppType == 'INTRA')
        currSheet.cell(rowPtr, 2).string("Intra State");
    else if (currSuppType == 'INTER')
        currSheet.cell(rowPtr, 2).string("Inter State");
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 3).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 3).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 7).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 7).string("");
    ++rowPtr;

}

//functions to write GSTR1 data into excel
function writeB2BDataToExcelG1(currSheet, currCtin, currSuppName, currStatus, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currFlag, currChckSum, currUpdBy, currDiffPerc, item) {
    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(currInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 5).string(parseFloat(currInvValue).toFixed(2));
    currSheet.cell(rowPtr, 6).string(currPos.toString());
    currSheet.cell(rowPtr, 7).string(currRevChange);
    currSheet.cell(rowPtr, 8).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 9).string(currInvType.toString());
    currSheet.cell(rowPtr, 10).string(currETIN);
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    // if (currStatus == "Y") {
    if (currFlag == "U" && currUpdBy == "S")
        currSheet.cell(rowPtr, 14).string("Uploaded By Taxpayer");
    else
        currSheet.cell(rowPtr, 14).string("");
    // }
    /*else {
        if (currFlag == "U" || currFlag == "D" || currFlag === undefined)
            currSheet.cell(rowPtr, 14).string("");
        else
            currSheet.cell(rowPtr, 14).string("Saved");
    }*/

    /*if (currCFlag == undefined || currCFlag == '')
        currSheet.cell(rowPtr, 16).string("");
    else
        currSheet.cell(rowPtr, 16).string(flags[currCFlag].toString());*/

    if (currFlag === undefined || currUpdBy === '') {
        currSheet.cell(rowPtr, 15).string("");
    }
    else {
        currSheet.cell(rowPtr, 15).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 16).string(currChckSum);

    currSheet.cell(rowPtr, 17).string(item["num"].toString());
    currSheet.cell(rowPtr, 18).string(currUpdBy);
    ++rowPtr;

}
function writeB2BADataToExcelG1(currSheet, currCtin, currSuppName, currStatus, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currFlag, currChckSum, currUpdBy, currDiffPerc, oldInvNum, oldInvDate, item) {

    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(oldInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(oldInvDate).toString());
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(parseFloat(currInvValue).toFixed(2));
    currSheet.cell(rowPtr, 8).string(currPos.toString());
    currSheet.cell(rowPtr, 9).string(currRevChange);
    currSheet.cell(rowPtr, 10).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 11).string(currInvType.toString());
    currSheet.cell(rowPtr, 12).string(currETIN);
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 14).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 15).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");

    // if (currStatus == "Y") {
    if (currFlag == "U" && currUpdBy == "S")
        currSheet.cell(rowPtr, 16).string("Uploaded By Taxpayer");
    else
        currSheet.cell(rowPtr, 16).string("");
    // }
    /*else {
        if (currFlag == "U" || currFlag == "D" || currFlag === undefined)
            currSheet.cell(rowPtr, 14).string("");
        else
            currSheet.cell(rowPtr, 14).string("Saved");
    }*/

    /*if (currCFlag == undefined || currCFlag == '')
        currSheet.cell(rowPtr, 16).string("");
    else
        currSheet.cell(rowPtr, 16).string(flags[currCFlag].toString());*/

    if (currFlag === undefined || currUpdBy === '') {
        currSheet.cell(rowPtr, 17).string("");
    }
    else {
        currSheet.cell(rowPtr, 17).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 18).string(currChckSum);

    currSheet.cell(rowPtr, 19).string(item["num"].toString());
    currSheet.cell(rowPtr, 20).string(currUpdBy);
    ++rowPtr;

}
function writeB2CLDataToExcelG1(currInvValue, currInvDate, currETIN, currPos, currInvNum, currFlag, currChckSum, currDiffPerc, item) {
    currSheet.cell(rowPtr, 1).string(currInvNum);
    currSheet.cell(rowPtr, 2).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 3).string(parseFloat(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 4).string(currPos.toString());
    currSheet.cell(rowPtr, 5).string(currDiffPerc.toString());
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 6).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else*/
    //        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    currSheet.cell(rowPtr, 9).string(currETIN.toString());

    if (currFlag === undefined) {
        currSheet.cell(rowPtr, 10).string("");
    }
    else {
        currSheet.cell(rowPtr, 10).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 11).string(currChckSum);

    currSheet.cell(rowPtr, 12).string(item["num"].toString());
    currSheet.cell(rowPtr, 13).string(currFlag);
    ++rowPtr;

}

function writeB2CLADataToExcelG1(currInvValue, currInvDate, currETIN, currPos, currInvNum, currFlag, currChckSum, currDiffPerc, oldInvDate, oldInvNum, item) {
    currSheet.cell(rowPtr, 1).string(oldInvNum);
    currSheet.cell(rowPtr, 2).string(getFormattedDate(oldInvDate).toString());
    currSheet.cell(rowPtr, 3).string(currPos.toString());
    currSheet.cell(rowPtr, 4).string(currInvNum);
    currSheet.cell(rowPtr, 5).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 6).string(parseFloat(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 7).string(currDiffPerc.toString());
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");
    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else*/
    //        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 10).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    currSheet.cell(rowPtr, 11).string(currETIN.toString());

    if (currFlag === undefined) {
        currSheet.cell(rowPtr, 12).string("");
    }
    else {
        currSheet.cell(rowPtr, 12).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 13).string(currChckSum);

    currSheet.cell(rowPtr, 14).string(item["num"].toString());
    currSheet.cell(rowPtr, 15).string(currFlag);
    ++rowPtr;

}

function writeB2CSDataToExcelG1(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currFlag, currDiffPerc, currChckSum) {
    currSheet.cell(rowPtr, 1).string(currType);
    currSheet.cell(rowPtr, 2).string(currPos);
    currSheet.cell(rowPtr, 3).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 4).string(currRate);
    currSheet.cell(rowPtr, 5).string(currTxValue);
    /* currSheet.cell(rowPtr, 5).string(currIAmount);
     currSheet.cell(rowPtr, 6).string(currCAmt);
     currSheet.cell(rowPtr, 7).string(currSAmt);*/
    currSheet.cell(rowPtr, 6).string(currCSAmount);
    currSheet.cell(rowPtr, 7).string(currETIN);
    currSheet.cell(rowPtr, 8).string(currFlag);
    currSheet.cell(rowPtr, 9).string(currChckSum);


    ++rowPtr;

}

function writeB2CSADataToExcelG1(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currFlag, currDiffPerc, oldYear, oldMonth, currChckSum) {
    currSheet.cell(rowPtr, 1).string(oldYear);
    currSheet.cell(rowPtr, 2).string(oldMonth);
    currSheet.cell(rowPtr, 3).string(currPos);
    currSheet.cell(rowPtr, 4).string(currType);

    currSheet.cell(rowPtr, 5).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 6).string(currRate);
    currSheet.cell(rowPtr, 7).string(currTxValue);
    /* currSheet.cell(rowPtr, 5).string(currIAmount);
     currSheet.cell(rowPtr, 6).string(currCAmt);
     currSheet.cell(rowPtr, 7).string(currSAmt);*/
    currSheet.cell(rowPtr, 8).string(currCSAmount);
    currSheet.cell(rowPtr, 9).string(currETIN);
    currSheet.cell(rowPtr, 10).string(currFlag);
    currSheet.cell(rowPtr, 11).string(currChckSum);


    ++rowPtr;

}


function writeCDNDataToExcelG1(currCtin, currSuppName, currStatus, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currUpdBy, currChckSum, currDiffPerc, currSuppType, innerItem) {

    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(currInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 5).string(currNoteNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 7).string(currDocType);
    currSheet.cell(rowPtr, 8).string(getSupplyType(innerItem));
    /* currSheet.cell(rowPtr, 7).string(currReason);*/
    currSheet.cell(rowPtr, 9).string(Number(currNoteValue).toFixed(2).toString());

    currSheet.cell(rowPtr, 10).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    currSheet.cell(rowPtr, 14).string(currPreGST.toString());


    if (currFlag == "U" && currUpdBy == "S")
        currSheet.cell(rowPtr, 15).string("Uploaded By Taxpayer");
    else
        currSheet.cell(rowPtr, 15).string("");

    //currSheet.cell(rowPtr,23).string(flags[currFlag].toString());
    /*if (currCFlag === undefined || currCFlag == '')
        currSheet.cell(rowPtr, 17).string("");
    else
        currSheet.cell(rowPtr, 17).string(flags[currCFlag].toString());*/

    if (currFlag === undefined || currUpdBy === '') {
        currSheet.cell(rowPtr, 16).string("");
    }
    else {

        currSheet.cell(rowPtr, 16).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 17).string(currChckSum);
    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 18).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 18).string("");
    currSheet.cell(rowPtr, 19).string(currUpdBy);
    ++rowPtr;

}

function writeCDNADataToExcelG1(currCtin, currSuppName, currStatus, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currUpdBy, currChckSum, currDiffPerc, currSuppType, oldNoteNum, oldNoteDate, innerItem) {

    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(oldNoteNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(oldNoteDate).toString());
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(currNoteNum);
    currSheet.cell(rowPtr, 8).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 9).string(currDocType);
    currSheet.cell(rowPtr, 10).string(getSupplyType(innerItem));
    /* currSheet.cell(rowPtr, 7).string(currReason);*/
    currSheet.cell(rowPtr, 11).string(Number(currNoteValue).toFixed(2).toString());

    currSheet.cell(rowPtr, 12).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 14).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 15).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");

    currSheet.cell(rowPtr, 16).string(currPreGST.toString());


    if (currFlag == "U" && currUpdBy == "S")
        currSheet.cell(rowPtr, 17).string("Uploaded By Taxpayer");
    else
        currSheet.cell(rowPtr, 17).string("");

    //currSheet.cell(rowPtr,23).string(flags[currFlag].toString());
    /*if (currCFlag === undefined || currCFlag == '')
        currSheet.cell(rowPtr, 17).string("");
    else
        currSheet.cell(rowPtr, 17).string(flags[currCFlag].toString());*/

    if (currFlag === undefined || currUpdBy === '') {
        currSheet.cell(rowPtr, 18).string("");
    }
    else {

        currSheet.cell(rowPtr, 18).string(flags[currFlag].toString());
    }
    currSheet.cell(rowPtr, 19).string(currChckSum);
    if (innerItem.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 20).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 20).string("");
    currSheet.cell(rowPtr, 21).string(currUpdBy);
    ++rowPtr;

}

function writeCDNURDataToExcelG1(currUrType, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currDiffPerc, currSuppType, innerItem) {

    currSheet.cell(rowPtr, 1).string(currUrType);
    currSheet.cell(rowPtr, 2).string(currNoteNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 4).string(currDocType);
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 8).string(Number(currNoteValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 9).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 10).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    currSheet.cell(rowPtr, 13).string(currPreGST.toString());

    currSheet.cell(rowPtr, 14).string(currFlag);

    if (innerItem.hasOwnProperty("num"))
        currSheet.cell(rowPtr, 15).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 15).string("");

    if (innerItem.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 16).string(innerItem["flag"].toString());
    else
        currSheet.cell(rowPtr, 16).string("");

    ++rowPtr;

}

function writeCDNURADataToExcelG1(currUrType, oldNoteNum, oldNoteDate, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currFlag, currDiffPerc, currSuppType, innerItem) {

    currSheet.cell(rowPtr, 1).string(currUrType);
    currSheet.cell(rowPtr, 2).string(oldNoteNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(oldNoteDate).toString());
    currSheet.cell(rowPtr, 4).string(currInvNum);
    currSheet.cell(rowPtr, 5).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 6).string(currNoteNum);
    currSheet.cell(rowPtr, 7).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 8).string(currDocType);
    currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 10).string(Number(currNoteValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 11).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 14).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    currSheet.cell(rowPtr, 15).string(currPreGST.toString());

    currSheet.cell(rowPtr, 16).string(currFlag);

    if (innerItem.hasOwnProperty("num"))
        currSheet.cell(rowPtr, 17).string(innerItem["num"].toString());
    else
        currSheet.cell(rowPtr, 17).string("");

    if (innerItem.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 18).string(innerItem["flag"].toString());
    else
        currSheet.cell(rowPtr, 18).string("");

    ++rowPtr;

}

function writeExpDataToExcelG1(currSheet, currEType, currChckSum, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currFlag, currDiffPerc, item) {

    currSheet.cell(rowPtr, 1).string(currEType);
    currSheet.cell(rowPtr, 2).string(currInvNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 4).string(Number(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 5).string(currPortCode);
    currSheet.cell(rowPtr, 6).string(currShipNum.toString());
    if (currShipDate !== "") {
        currSheet.cell(rowPtr, 7).string(getFormattedDate(currShipDate).toString());
    }
    else {
        currSheet.cell(rowPtr, 7).string(currShipDate.toString());
    }

    currSheet.cell(rowPtr, 8).string(currDiffPerc.toString());
    if (item.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 9).string(Number(item["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 10).string(Number(item["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    /*if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 10).string(Number(item["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 11).string(Number(item["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 12).string(Number(item["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");*/

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    currSheet.cell(rowPtr, 12).string(currFlag);
    currSheet.cell(rowPtr, 13).string(currChckSum);

    if (item.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 14).string(item["flag"].toString());
    else
        currSheet.cell(rowPtr, 14).string("");
    ++rowPtr;
}
function writeExpaDataToExcelG1(currSheet, currEType, currChckSum, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currFlag, currDiffPerc, oldInvNum, oldInvDate, item) {

    currSheet.cell(rowPtr, 1).string(currEType);
    currSheet.cell(rowPtr, 2).string(oldInvNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(oldInvDate).toString());
    currSheet.cell(rowPtr, 4).string(currInvNum);
    currSheet.cell(rowPtr, 5).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 6).string(Number(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 7).string(currPortCode);
    currSheet.cell(rowPtr, 8).string(currShipNum.toString());
    if (currShipDate !== "") {
        currSheet.cell(rowPtr, 9).string(getFormattedDate(currShipDate).toString());
    }
    else {
        currSheet.cell(rowPtr, 9).string(currShipDate.toString());
    }

    currSheet.cell(rowPtr, 10).string(currDiffPerc.toString());
    if (item.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(item["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(item["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    /*if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 10).string(Number(item["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 11).string(Number(item["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 12).string(Number(item["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");*/

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 13).string(Number(item["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    currSheet.cell(rowPtr, 14).string(currFlag);

    currSheet.cell(rowPtr, 15).string(currChckSum);

    if (item.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 16).string(item["flag"].toString());
    else
        currSheet.cell(rowPtr, 16).string("");
    ++rowPtr;
}

function writeHSNSUMDataToExcelG1(currChckSum, item) {

    if (item.hasOwnProperty('hsn_sc'))
        currSheet.cell(rowPtr, 1).string(item['hsn_sc']);
    else
        currSheet.cell(rowPtr, 1).string("");
    if (item.hasOwnProperty('desc'))
        currSheet.cell(rowPtr, 2).string(item['desc']);
    else
        currSheet.cell(rowPtr, 2).string("");
    currSheet.cell(rowPtr, 3).string(getFullUQC(item['uqc']));

    if (item.hasOwnProperty('qty'))
        currSheet.cell(rowPtr, 4).string(Number(item['qty']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0");
    if (item.hasOwnProperty('val'))
        currSheet.cell(rowPtr, 5).string(Number(item['val']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 6).string(Number(item['txval']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item['iamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item['camt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item['samt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 10).string(Number(item['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");
    //currSheet.cell(rowPtr, 11).string(currFlag);
    currSheet.cell(rowPtr, 11).string(currChckSum);

    if (item.hasOwnProperty('num'))
        currSheet.cell(rowPtr, 12).string(item["num"].toString());
    else
        currSheet.cell(rowPtr, 12).string("");


    if (item.hasOwnProperty('flag'))
        currSheet.cell(rowPtr, 13).string(item["flag"].toString());
    else
        currSheet.cell(rowPtr, 13).string("");
    ++rowPtr;

}

function writeNilDataToExcelG1(currChckSum, nilItem) {
    //getNilSupplyType
    if (nilItem.hasOwnProperty("sply_ty")) {

        currSheet.cell(rowPtr, 1).string(getNilSupplyType(nilItem['sply_ty']));
    } else {
        currSheet.cell(rowPtr, 1).string("");
    }

    if (nilItem.hasOwnProperty("nil_amt")) {

        currSheet.cell(rowPtr, 2).string(Number(nilItem['nil_amt']).toFixed(2).toString());
    } else {
        currSheet.cell(rowPtr, 2).string("0.00");
    }

    if (nilItem.hasOwnProperty("expt_amt")) {

        currSheet.cell(rowPtr, 3).string(Number(nilItem['expt_amt']).toFixed(2).toString());
    } else {
        currSheet.cell(rowPtr, 3).string("0.00");
    }

    if (nilItem.hasOwnProperty("ngsup_amt")) {

        currSheet.cell(rowPtr, 4).string(Number(nilItem['ngsup_amt']).toFixed(2).toString());
    } else {
        currSheet.cell(rowPtr, 4).string("0.00");
    }
    currSheet.cell(rowPtr, 5).string(currChckSum);
    ++rowPtr;
}


function writeTXIDataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, innerItem) {

    currSheet.cell(rowPtr, 1).string(currPos.toString());
    //currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 2).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 3).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 3).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    /*if (innerItem.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    if (innerItem.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");
    currSheet.cell(rowPtr, 6).string(currFlag);
    currSheet.cell(rowPtr, 7).string(currChckSum);
    if (innerItem.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 8).string(innerItem["flag"].toString());
    else
        currSheet.cell(rowPtr, 8).string("");

    ++rowPtr;

}

function writeATXIDataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, oldMonth, oldYear, innerItem) {

    currSheet.cell(rowPtr, 1).string(oldYear);
    currSheet.cell(rowPtr, 2).string(oldMonth);
    currSheet.cell(rowPtr, 3).string(currPos.toString());
    //currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 4).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    /*if (innerItem.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    if (innerItem.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 7).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    currSheet.cell(rowPtr, 8).string(currFlag);
    currSheet.cell(rowPtr, 9).string(currChckSum);
    if (innerItem.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 10).string(innerItem["flag"].toString());
    else
        currSheet.cell(rowPtr, 10).string("");

    ++rowPtr;

}
function writeATADJDataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, innerItem) {
    currSheet.cell(rowPtr, 1).string(currPos.toString());
    currSheet.cell(rowPtr, 2).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 3).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 3).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    /* if (innerItem.hasOwnProperty('iamt'))
         currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 4).string("0.00");
 
     if (innerItem.hasOwnProperty('camt'))
         currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 5).string("0.00");
 
     if (innerItem.hasOwnProperty('samt'))
         currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");
    currSheet.cell(rowPtr, 6).string(currFlag);
    currSheet.cell(rowPtr, 7).string(currChckSum);
    if (innerItem.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 8).string(innerItem["flag"].toString());
    else
        currSheet.cell(rowPtr, 8).string("");

    ++rowPtr;

}

function writeATADJADataToExcelG1(currPos, currSuppType, currChckSum, currFlag, currDiffPerc, oldMonth, oldYear, innerItem) {
    currSheet.cell(rowPtr, 1).string(oldYear);
    currSheet.cell(rowPtr, 2).string(oldMonth);
    currSheet.cell(rowPtr, 3).string(currPos.toString());
    currSheet.cell(rowPtr, 4).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    /* if (innerItem.hasOwnProperty('iamt'))
         currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 4).string("0.00");
 
     if (innerItem.hasOwnProperty('camt'))
         currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 5).string("0.00");
 
     if (innerItem.hasOwnProperty('samt'))
         currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 7).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    currSheet.cell(rowPtr, 8).string(currFlag);
    currSheet.cell(rowPtr, 9).string(currChckSum);
    if (innerItem.hasOwnProperty("flag"))
        currSheet.cell(rowPtr, 10).string(innerItem["flag"].toString());
    else
        currSheet.cell(rowPtr, 10).string("");

    ++rowPtr;

}
function writeDocsDataToExcelG1(json) {

    var detArr = json['doc_det'];
    for (var i = 1; i <= detArr.length; i++) {
        var currDocDet = docDetails[detArr[i - 1]['doc_num']];
        var docsArr = detArr[i - 1]['docs'];
        for (var j = 0; j < docsArr.length; j++) {
            currSheet.cell(rowPtr, 1).string(currDocDet);
            currSheet.cell(rowPtr, 2).string(docsArr[j]['from']);
            currSheet.cell(rowPtr, 3).string(docsArr[j]['to']);
            currSheet.cell(rowPtr, 4).string(docsArr[j]['totnum'].toString());
            currSheet.cell(rowPtr, 5).string(docsArr[j]['cancel'].toString());
            //currSheet.cell(rowPtr, 7).string(docsArr[j]['num'].toString());

            ++rowPtr;
        }
    }

}

function getNilSupplyType(typeCode) {
    switch (typeCode) {
        case "INTRB2B":
            return "Inter-State supplies to registered persons";
        case "INTRB2C":
            return "Intra-State supplies to registered persons";
        case "INTRAB2B":
            return "Inter-State supplies to unregistered persons";
        case "INTRAB2C":
            return "Intra-State supplies to unregistered persons";
        default:
            return "Some Error Occured";

    }
}

function getFullInvType(invCode) {
    switch (invCode) {
        case "R":
            return "Regular";
        case "DE":
            return "Deemed Exp";
        case "SEWP":
            return "SEZ supplies with payment";
        case "SEWOP":
            return "SEZ supplies without payment";
        default:
            return "Error";
    }
}

function getFullPOS(posCode) {

    var finalPos = "";
    posList.forEach(function (fullPos) {
        if (posCode == fullPos.substring(0, 2)) {
            finalPos = fullPos;
        }
    });
    //console.log("returning from fullPos method : "+finalPos);
    return finalPos;

}

function getFullItcElig(itcEligCode) {

    switch (itcEligCode) {
        case "ip":
            return "Inputs";
        case "is":
            return "Input services";
        case "cp":
            return "Capital goods";
        case "no":
            return "Ineligible";
        default:
            return "Error";
    }

}

function getSupplyType(innerItem) {

    if (typeof innerItem['itm_det']['iamt'] == 'undefined') {
        return "Intra State";
    } else {
        return "Inter State";
    }

}

function getFullUQC(uqcCode) {

    var fullUQC = "";
    UQCList.forEach(function (uqc) {
        if (uqc.value == uqcCode)
            fullUQC = uqc.name;
    });
    return fullUQC;

}

function getFormattedDate(input) {
    var sptdate = String(input).split("-");
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var myMonth = sptdate[1];
    var myDay = sptdate[0];
    var myYear = sptdate[2];//p2<10?"0"+p2:p2
    var combineDatestr = myDay + "-" + months[myMonth - 1] + "-" + myYear;
    return combineDatestr;
}
function getMonth(input) {
    var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

    return months[input - 1];
}

function addL1L2HeaderG1(sheetName) {


    currSheet.cell(1, 1).string(sheetHeadersG1[sheetName]).style(styleL1L2);
    switch (sheetName) {
        case 'b2b':
        case 'b2ba':

            currSheet.cell(2, 1, 3, 18, true).string("").style(styleL1L2);

            break;

        case 'cdnr':
        case 'cdn':
        case 'cdnra':

            currSheet.cell(2, 1, 3, 19, true).string("").style(styleL1L2);

            break;

        case 'b2cl':
        case 'b2cla':
            currSheet.cell(2, 1, 3, 12, true).string("").style(styleL1L2);

            break;

        case 'b2cs':
        case 'b2csa':
            currSheet.cell(2, 1, 3, 10, true).string("").style(styleL1L2);

            break;

        case 'nil':
        case 'exemp':

            currSheet.cell(2, 1, 3, 4, true).string("").style(styleL1L2);

            break;

        case 'exp':
        case 'expa':
            currSheet.cell(2, 1, 3, 14, true).string("").style(styleL1L2);

            break;

        case 'at':
        case 'txi':
        case 'atadj':
        case 'txpd':
        case 'txpda':
        case 'ata':
        case 'atadja':
            currSheet.cell(2, 1, 3, 8, true).string("").style(styleL1L2);

            break;

        case 'cdnur':
        case 'cdnura':
            currSheet.cell(2, 1, 3, 16, true).string("").style(styleL1L2);

            break;

        case 'hsn':
        case 'hsnsum':

            currSheet.cell(2, 1, 3, 11, true).string("").style(styleL1L2);

            break;
        case 'docs':
            currSheet.cell(2, 1, 3, 5, true).string("").style(styleL1L2);
            break;
    }
}
function addL1L2HeaderG1Er(sheetName) {


    currSheet.cell(1, 1).string(sheetHeadersG1[sheetName]).style(styleL1L2);
    switch (sheetName) {
        case 'b2b':

            currSheet.cell(2, 1, 3, 18, true).string("").style(styleL1L2);

            break;
        case 'b2ba':

            currSheet.cell(2, 1, 3, 20, true).string("").style(styleL1L2);

            break;

        case 'cdnr':
        case 'cdn':
            currSheet.cell(2, 1, 3, 18, true).string("").style(styleL1L2);
            break;
        case 'cdnra':

            currSheet.cell(2, 1, 3, 20, true).string("").style(styleL1L2);

            break;

        case 'b2cl':
            currSheet.cell(2, 1, 3, 14, true).string("").style(styleL1L2);
            break;
        case 'b2cla':
            currSheet.cell(2, 1, 3, 16, true).string("").style(styleL1L2);

            break;

        case 'b2cs':
            currSheet.cell(2, 1, 3, 12, true).string("").style(styleL1L2);
        case 'b2csa':
            currSheet.cell(2, 1, 3, 14, true).string("").style(styleL1L2);

            break;

        case 'nil':
        case 'exemp':

            currSheet.cell(2, 1, 3, 4, true).string("").style(styleL1L2);

            break;

        case 'exp':
            currSheet.cell(2, 1, 3, 15, true).string("").style(styleL1L2);
        case 'expa':
            currSheet.cell(2, 1, 3, 17, true).string("").style(styleL1L2);

            break;

        case 'at':
        case 'txi':
        case 'atadj':
        case 'txpd':

            currSheet.cell(2, 1, 3, 10, true).string("").style(styleL1L2);

            break;
        case 'txpda':
        case 'ata':
        case 'atadja':

            currSheet.cell(2, 1, 3, 12, true).string("").style(styleL1L2);

            break;
        case 'cdnur':
            currSheet.cell(2, 1, 3, 15, true).string("").style(styleL1L2);
            break;
        case 'cdnura':
            currSheet.cell(2, 1, 3, 17, true).string("").style(styleL1L2);

            break;

        case 'hsn':
        case 'hsnsum':

            currSheet.cell(2, 1, 3, 13, true).string("").style(styleL1L2);

            break;
        case 'docs':
            currSheet.cell(2, 1, 3, 5, true).string("").style(styleL1L2);
            break;
    }
}

function addL1L2Header(sheetName) {

    currSheet.cell(1, 1).string(sheetHeaders[sheetName]).style(styleL1L2);
    switch (sheetName) {
        case 'b2b':
            currSheet.cell(1, 20, 1, 22, true).string('Submitted: Supplier has submitted the invoices in the portal;\nSaved: Supplier has saved, but haven’t yet submitted the invoices in the portal').style(styleL4);
            //currSheet.cell(2,19).string("Saved: Supplier has saved, but haven’t yet submitted the invoices in the portal").style(styleL4);
            currSheet.cell(2, 1).string("No. of Suppliers").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("No. of Invoices").style(styleL1L2);
            currSheet.cell(2, 4).string("").style(styleL1L2);
            currSheet.cell(2, 5).string("Total Invoice Value").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            currSheet.cell(2, 7).string("").style(styleL1L2);
            currSheet.cell(2, 8).string("").style(styleL1L2);
            currSheet.cell(2, 9).string("").style(styleL1L2);
            currSheet.cell(2, 10).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 11).string("Total Integrated Tax Paid").style(styleL1L2);
            currSheet.cell(2, 12).string("Total Central Tax Paid").style(styleL1L2);
            currSheet.cell(2, 13).string("Total TState/UT Tax Paid").style(styleL1L2);
            currSheet.cell(2, 14).string("Total Cess").style(styleL1L2);
            currSheet.cell(2, 15).string("").style(styleL1L2);
            currSheet.cell(2, 16).string("Total Availed ITC Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 17).string("Total Availed ITC Central Tax").style(styleL1L2);
            currSheet.cell(2, 18).string("Total Availed ITC State/UT Tax").style(styleL1L2);
            currSheet.cell(2, 19).string("Total Availed ITC Cess").style(styleL1L2);
            currSheet.cell(2, 20).string("").style(styleL1L2);
            currSheet.cell(2, 21).string("").style(styleL1L2);
            currSheet.cell(2, 22).string("").style(styleL1L2);
            break;

        case 'b2bur':
            currSheet.cell(2, 1).string("").style(styleL1L2);
            currSheet.cell(2, 2).string("No. of Invoices (Of Reg Recipient)").style(styleL1L2);
            currSheet.cell(2, 3).string("").style(styleL1L2);
            currSheet.cell(2, 4).string("Total Invoice Value").style(styleL1L2);
            currSheet.cell(2, 5).string("").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            currSheet.cell(2, 7).string("").style(styleL1L2);
            currSheet.cell(2, 8).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 9).string("Total Integrated Tax Paid").style(styleL1L2);
            currSheet.cell(2, 10).string("Total Central Tax Paid").style(styleL1L2);
            currSheet.cell(2, 11).string("Total TState/UT Tax Paid").style(styleL1L2);
            currSheet.cell(2, 12).string("Total Cess Paid").style(styleL1L2);
            currSheet.cell(2, 13).string("").style(styleL1L2);
            currSheet.cell(2, 14).string("Total Availed ITC Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 15).string("Total Availed ITC Central Tax").style(styleL1L2);
            currSheet.cell(2, 16).string("Total Availed ITC State/UT Tax").style(styleL1L2);
            currSheet.cell(2, 17).string("Total Availed ITC Cess").style(styleL1L2);
            currSheet.cell(2, 18).string("").style(styleL1L2);

            break;

        case 'imps':
            currSheet.cell(2, 1).string("No. of Invoices (Of Reg Recipient)").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("Total Invoice Value").style(styleL1L2);
            currSheet.cell(2, 4).string("").style(styleL1L2);
            currSheet.cell(2, 5).string("").style(styleL1L2);
            currSheet.cell(2, 6).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 7).string("Total Integrated Tax Paid").style(styleL1L2);
            currSheet.cell(2, 8).string("Total Cess Paid").style(styleL1L2);
            currSheet.cell(2, 9).string("").style(styleL1L2);
            currSheet.cell(2, 10).string("Total Availed ITC Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 11).string("Total Availed ITC Cess").style(styleL1L2);
            currSheet.cell(2, 12).string("").style(styleL1L2);

            break;

        case 'impg':
            currSheet.cell(2, 1).string("").style(styleL1L2);
            currSheet.cell(2, 2).string("No. of Bill of Entry").style(styleL1L2);
            currSheet.cell(2, 3).string("").style(styleL1L2);
            currSheet.cell(2, 4).string("Total Bill of Entry Value").style(styleL1L2);
            currSheet.cell(2, 5).string("").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            currSheet.cell(2, 7).string("").style(styleL1L2);
            currSheet.cell(2, 8).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 9).string("Total Integrated Tax Paid").style(styleL1L2);
            currSheet.cell(2, 10).string("Total Cess Paid").style(styleL1L2);
            currSheet.cell(2, 11).string("").style(styleL1L2);
            currSheet.cell(2, 12).string("Total Availed ITC Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 13).string("Total Availed ITC Cess").style(styleL1L2);
            currSheet.cell(2, 14).string("").style(styleL1L2);
            break;

        case 'cdnr':
            currSheet.cell(1, 23, 1, 25, true).string('Submitted: Supplier has submitted the invoices in the portal;\nSaved: Supplier has saved, but haven’t yet submitted the invoices in the portal').style(styleL4);
            currSheet.cell(1, 18, 1, 22, true).string('Default ITC eligibility as inputs for credit and debit notes needs to be updated as per the linked invoice place of supply (POS) to avoid ‘Invalid ITC eligibility’ error upon upload of records to GST Portal').style(styleL4);
            currSheet.cell(2, 1).string("No. of Supplier").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("No. of Notes/Vouchers").style(styleL1L2);
            currSheet.cell(2, 4).string("").style(styleL1L2);
            currSheet.cell(2, 5).string("No. of Invoices").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            currSheet.cell(2, 7).string("").style(styleL1L2);
            currSheet.cell(2, 8).string("").style(styleL1L2);
            currSheet.cell(2, 9).string("").style(styleL1L2);
            currSheet.cell(2, 10).string("").style(styleL1L2);
            currSheet.cell(2, 11).string("Total Note/Voucher Value").style(styleL1L2);
            currSheet.cell(2, 12).string("").style(styleL1L2);
            currSheet.cell(2, 13).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 14).string("Total Integrated Tax Paid").style(styleL1L2);
            currSheet.cell(2, 15).string("Total Central Tax Paid").style(styleL1L2);
            currSheet.cell(2, 16).string("Total TState/UT Tax Paid").style(styleL1L2);
            currSheet.cell(2, 17).string("Total Cess Paid").style(styleL1L2);
            currSheet.cell(2, 18).string("").style(styleL1L2);
            currSheet.cell(2, 19).string("Total Availed ITC Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 20).string("Total Availed ITC Central Tax").style(styleL1L2);
            currSheet.cell(2, 21).string("Total Availed ITC State/UT Tax").style(styleL1L2);
            currSheet.cell(2, 22).string("Total Availed ITC Cess").style(styleL1L2);
            currSheet.cell(2, 23).string("").style(styleL1L2);
            currSheet.cell(2, 24).string("").style(styleL1L2);
            currSheet.cell(2, 25).string("").style(styleL1L2);
            break;

        case 'cdnur':
            currSheet.cell(2, 1).string("No. of Notes/Vouchers").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("No. of Invoices").style(styleL1L2);
            currSheet.cell(2, 4).string("").style(styleL1L2);
            currSheet.cell(2, 5).string("").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            currSheet.cell(2, 7).string("").style(styleL1L2);
            currSheet.cell(2, 8).string("").style(styleL1L2);
            currSheet.cell(2, 9).string("").style(styleL1L2);
            currSheet.cell(2, 10).string("Total Note/Refund Voucher Value").style(styleL1L2);
            currSheet.cell(2, 11).string("").style(styleL1L2);
            currSheet.cell(2, 12).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 13).string("Total Integrated Tax Paid").style(styleL1L2);
            currSheet.cell(2, 14).string("Total Central Tax Paid").style(styleL1L2);
            currSheet.cell(2, 15).string("Total TState/UT Tax Paid").style(styleL1L2);
            currSheet.cell(2, 16).string("Total Cess Paid").style(styleL1L2);
            currSheet.cell(2, 17).string("").style(styleL1L2);
            currSheet.cell(2, 18).string("Total Availed ITC Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 19).string("Total Availed ITC Central Tax").style(styleL1L2);
            currSheet.cell(2, 20).string("Total Availed ITC State/UT Tax").style(styleL1L2);
            currSheet.cell(2, 21).string("Total Availed ITC Cess").style(styleL1L2);
            currSheet.cell(2, 22).string("").style(styleL1L2);
            break;

        case 'at':
            currSheet.cell(2, 1).string("").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("").style(styleL1L2);
            currSheet.cell(2, 4).string("Total Advance Paid").style(styleL1L2);
            currSheet.cell(2, 5).string("Total Cess Amount").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            break;

        case 'atadj':
            currSheet.cell(2, 1).string("").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("").style(styleL1L2);
            currSheet.cell(2, 4).string("Total Advance Adjusted").style(styleL1L2);
            currSheet.cell(2, 5).string("Total Cess").style(styleL1L2);
            currSheet.cell(2, 6).string("").style(styleL1L2);
            break;

        case 'exemp':
            currSheet.cell(2, 1).string("").style(styleL1L2);
            currSheet.cell(2, 2).string("Total Composition taxable person").style(styleL1L2);
            currSheet.cell(2, 3).string("Total Nil Rated Supplies").style(styleL1L2);
            currSheet.cell(2, 4).string("Total Exempted Supplies").style(styleL1L2);
            currSheet.cell(2, 5).string("Total Non-GST Supplies").style(styleL1L2);
            break;

        case 'itcr':
            currSheet.cell(2, 1).string("").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("Total ITC Integrated Tax Amount").style(styleL1L2);
            currSheet.cell(2, 4).string("Total ITC Central Tax Amount").style(styleL1L2);
            currSheet.cell(2, 5).string("Total ITC State/UT Tax Amount").style(styleL1L2);
            currSheet.cell(2, 6).string("Total ITC Cess Amount").style(styleL1L2);
            currSheet.cell(2, 7).string("").style(styleL1L2);
            break;

        case 'hsnsum':
            currSheet.cell(2, 1).string("No. of HSN").style(styleL1L2);
            currSheet.cell(2, 2).string("").style(styleL1L2);
            currSheet.cell(2, 3).string("").style(styleL1L2);
            currSheet.cell(2, 4).string("").style(styleL1L2);
            currSheet.cell(2, 5).string("Total Value").style(styleL1L2);
            currSheet.cell(2, 6).string("Total Taxable Value").style(styleL1L2);
            currSheet.cell(2, 7).string("Total Integrated Tax").style(styleL1L2);
            currSheet.cell(2, 8).string("Total Central Tax").style(styleL1L2);
            currSheet.cell(2, 9).string("Total State/UT Tax").style(styleL1L2);
            currSheet.cell(2, 10).string("Total Cess Paid").style(styleL1L2);
            currSheet.cell(2, 11).string("").style(styleL1L2);
            break;
    }

}

function addL3Formula(section) {

    switch (section) {
        case 'b2b':
            currSheet.cell(3, 1).formula('=SUMPRODUCT((A5:A19999<>"")/COUNTIF(A5:A19999,A5:A19999&""))');
            currSheet.cell(3, 2).formula('=SUMPRODUCT((B5:B19999<>"")/COUNTIF(B5:B19999,B5:B19999&""))');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT(1/COUNTIF(B5:B19999,B5:B19999&""),0+(D5:D19999)),2)');
            currSheet.cell(3, 9).formula('=FIXED(SUMPRODUCT((I5:I19999)*1),2)');
            currSheet.cell(3, 10).formula('=FIXED(SUMPRODUCT((J5:J20004)*1),2)');
            currSheet.cell(3, 11).formula('=FIXED(SUMPRODUCT((K5:K20004)*1),2)');
            currSheet.cell(3, 12).formula('=FIXED(SUMPRODUCT((L5:L20004)*1),2)');
            currSheet.cell(3, 13).formula('=FIXED(SUMPRODUCT((M5:M19999)*1),2)');
            currSheet.cell(3, 15).formula('=FIXED(SUMPRODUCT((O5:O19999)*1),2)');
            currSheet.cell(3, 16).formula('=FIXED(SUMPRODUCT((P5:P19999)*1),2)');
            currSheet.cell(3, 17).formula('=FIXED(SUMPRODUCT((Q5:Q19999)*1),2)');
            currSheet.cell(3, 18).formula('=FIXED(SUMPRODUCT((R5:R19999)*1),2)');

            break;
        case 'b2bur':

            currSheet.cell(3, 2).formula('=SUMPRODUCT((B5:B19976<>"")/COUNTIF(B5:B19976,B5:B19976&""))');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT(1/COUNTIF(B5:B19976,B5:B19976&""),0+(D5:D19976)),2)');
            currSheet.cell(3, 8).formula('=FIXED(SUMPRODUCT((H5:H19976)*1),2)');
            currSheet.cell(3, 9).formula('=FIXED(SUMPRODUCT((I5:I20004)*1),2)');
            currSheet.cell(3, 10).formula('=FIXED(SUMPRODUCT((J5:J20004)*1),2)');
            currSheet.cell(3, 11).formula('=FIXED(SUMPRODUCT((K5:K20004)*1),2)');
            currSheet.cell(3, 12).formula('=FIXED(SUMPRODUCT((L5:L20004)*1),2)');
            currSheet.cell(3, 14).formula('=FIXED(SUMPRODUCT((N5:N20004)*1),2)');
            currSheet.cell(3, 15).formula('=FIXED(SUMPRODUCT((O5:O20004)*1),2)');
            currSheet.cell(3, 16).formula('=FIXED(SUMPRODUCT((P5:P20004)*1),2)');
            currSheet.cell(3, 17).formula('=FIXED(SUMPRODUCT((Q5:Q20004)*1),2)');
            break;

        case 'imps':
            currSheet.cell(3, 1).formula('=SUMPRODUCT((A5:A10004<>"")/COUNTIF(A5:A10004,A5:A10004&""))');
            currSheet.cell(3, 3).formula('=FIXED(SUMPRODUCT(1/COUNTIF(A5:A10004,A5:A10004&""),0+(C5:C10004)),2)');
            currSheet.cell(3, 6).formula('=FIXED(SUMPRODUCT((F5:F20004)*1),2)');
            currSheet.cell(3, 7).formula('=FIXED(SUMPRODUCT((G5:G20004)*1),2)');
            currSheet.cell(3, 8).formula('=FIXED(SUMPRODUCT((H5:H20004)*1),2)');
            currSheet.cell(3, 10).formula('=FIXED(SUMPRODUCT((J5:J20004)*1),2)');
            currSheet.cell(3, 11).formula('=FIXED(SUMPRODUCT((K5:K20004)*1),2)');

            break;

        case 'impg':

            currSheet.cell(3, 2).formula('=SUMPRODUCT((B5:B10004<>"")/COUNTIF(B5:B10004,B5:B10004&""))');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT(1/COUNTIF(B5:B10004,B5:B10004&""),0+(D5:D10004)),2)');
            currSheet.cell(3, 8).formula('=FIXED(SUMPRODUCT((H5:H20004)*1),2)');
            currSheet.cell(3, 9).formula('=FIXED(SUMPRODUCT((I5:I20004)*1),2)');
            currSheet.cell(3, 10).formula('=FIXED(SUMPRODUCT((J5:J20004)*1),2)');
            currSheet.cell(3, 12).formula('=FIXED(SUMPRODUCT((L5:L20004)*1),2)');
            currSheet.cell(3, 13).formula('=FIXED(SUMPRODUCT((M5:M20004)*1),2)');
            break;

        case 'cdnr':
            currSheet.cell(3, 1).formula('=SUMPRODUCT((A5:A10001<>"")/COUNTIF(A5:A10001,A5:A10001&""))');
            currSheet.cell(3, 2).formula('=SUMPRODUCT((B5:B10001<>"")/COUNTIF(B5:B10001,B5:B10001&""))');
            currSheet.cell(3, 4).formula('=SUMPRODUCT((D5:D10001<>"")/COUNTIF(D5:D10001,D5:D10001&""))');
            currSheet.cell(3, 10).formula('=FIXED(SUMPRODUCT(1/COUNTIF(B5:B10001,B5:B10001&""),0+(J5:J10001)),2)');
            currSheet.cell(3, 12).formula('=FIXED(SUMPRODUCT((L5:L20004)*1),2)');
            currSheet.cell(3, 13).formula('=FIXED(SUMPRODUCT((M5:M20004)*1),2)');
            currSheet.cell(3, 14).formula('=FIXED(SUMPRODUCT((N5:N20004)*1),2)');
            currSheet.cell(3, 15).formula('=FIXED(SUMPRODUCT((O5:O20004)*1),2)');
            currSheet.cell(3, 16).formula('=FIXED(SUMPRODUCT((P5:P20004)*1),2)');
            currSheet.cell(3, 18).formula('=FIXED(SUMPRODUCT((R5:R20004)*1),2)');
            currSheet.cell(3, 19).formula('=FIXED(SUMPRODUCT((S5:S20004)*1),2)');
            currSheet.cell(3, 20).formula('=FIXED(SUMPRODUCT((T5:T20004)*1),2)');
            currSheet.cell(3, 21).formula('=FIXED(SUMPRODUCT((U5:U20004)*1),2)');
            break;

        case 'cdnur':
            currSheet.cell(3, 1).formula('=SUMPRODUCT((A5:A10001<>"")/COUNTIF(A5:A10001,A5:A10001&""))');
            currSheet.cell(3, 3).formula('=SUMPRODUCT((C5:C10001<>"")/COUNTIF(C5:C10001,C5:C10001&""))');
            currSheet.cell(3, 9).formula('=FIXED(SUMPRODUCT(1/COUNTIF(A5:A10001,A5:A10001&""),0+(I5:I10001)),2)');
            currSheet.cell(3, 11).formula('=FIXED(SUMPRODUCT((K5:K20004)*1),2)');
            currSheet.cell(3, 12).formula('=FIXED(SUMPRODUCT((L5:L20004)*1),2)');
            currSheet.cell(3, 13).formula('=FIXED(SUMPRODUCT((M5:M20004)*1),2)');
            currSheet.cell(3, 14).formula('=FIXED(SUMPRODUCT((N5:N20004)*1),2)');
            currSheet.cell(3, 15).formula('=FIXED(SUMPRODUCT((O5:O20004)*1),2)');
            currSheet.cell(3, 17).formula('=FIXED(SUMPRODUCT((Q5:Q20004)*1),2)');
            currSheet.cell(3, 18).formula('=FIXED(SUMPRODUCT((R5:R20004)*1),2)');
            currSheet.cell(3, 19).formula('=FIXED(SUMPRODUCT((S5:S20004)*1),2)');
            currSheet.cell(3, 20).formula('=FIXED(SUMPRODUCT((T5:T20004)*1),2)');
            break;

        case 'at':
            currSheet.cell(3, 3).formula('=FIXED(SUMPRODUCT((C5:C2004)*1),2)');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT((D5:D2004)*1),2)');
            break;

        case 'atadj':
            currSheet.cell(3, 3).formula('=FIXED(SUMPRODUCT((C5:C2004)*1),2)');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT((D5:D2004)*1),2)');
            break;

        case 'exemp':
            currSheet.cell(3, 2).formula('=FIXED(SUMPRODUCT((B5:B6)*1),2)');
            currSheet.cell(3, 3).formula('=FIXED(SUMPRODUCT((C5:C6)*1),2)');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT((D5:D6)*1),2)');
            currSheet.cell(3, 5).formula('=FIXED(SUMPRODUCT((E5:E6)*1),2)');
            break;

        case 'itcr':
            currSheet.cell(3, 3).formula('=FIXED(SUMPRODUCT((C5:C991)*1),2)');
            currSheet.cell(3, 4).formula('=FIXED(SUMPRODUCT((D5:D991)*1),2)');
            currSheet.cell(3, 5).formula('=FIXED(SUMPRODUCT((E5:E991)*1),2)');
            currSheet.cell(3, 6).formula('=FIXED(SUMPRODUCT((F5:F991)*1),2)');
            break;

        case 'hsnsum':
            currSheet.cell(3, 1).formula('=SUMPRODUCT((A5:A2004<>"")/COUNTIF(A5:A2004,A5:A2004&""))');
            currSheet.cell(3, 5).formula('=FIXED(SUMPRODUCT((E5:E2004)*1),2)');
            currSheet.cell(3, 6).formula('=FIXED(SUMPRODUCT((F5:F2004)*1),2)');
            currSheet.cell(3, 7).formula('=FIXED(SUMPRODUCT((G5:G2004)*1),2)');
            currSheet.cell(3, 8).formula('=FIXED(SUMPRODUCT((H5:H2004)*1),2)');
            currSheet.cell(3, 9).formula('=FIXED(SUMPRODUCT((I5:I2004)*1),2)');
            currSheet.cell(3, 10).formula('=FIXED(SUMPRODUCT((J5:J2004)*1),2)');
            break;
    }

}

function addDropdownValidation(section) {

    switch (section) {
        case 'b2b':
            //validation for place of supply has been commented since it throws error
            //currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: [ '01-Jammu & Kashmir,02-Himachal Pradesh,03-Punjab,04-Chandigarh,05-Uttarakhand,06-Haryana,07-Delhi,08-Rajasthan,09-Uttar Pradesh,10-Bihar,11-Sikkim,12-Arunachal Pradesh,13-Nagaland,14-Manipur,15-Mizoram,16-Tripura,17-Meghalaya,18-Assam,19-West Bengal,20-Jharkhand,21-Odisha,22-Chhattisgarh,23-Madhya Pradesh,24-Gujarat,25-Daman & Diu,26-Dadra & Nagar Haveli,27-Maharashtra,29-Karnataka,30-Goa,31-Lakshdweep,32-Kerala,33-Tamil Nadu,34-Pondicherry,35-Andaman & Nicobar Islands,36-Telangana,37-Andhra Pradesh,97-Other Territory' ] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['Regular,SEZ supplies with payment,SEZ supplies without payment,Deemed Exp'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['Inputs,Capital goods,Input services,Ineligible'] });
            //console.log(currSheet.getExcelRowCol('B5');)
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'V5:V20004', formulas: ['Accept,Reject,Modify,Pending,Add,Edit,Delete'] });
            //currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'T5:T20004', formulas: [ '' ] });

            break;

        case 'b2bur':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['Inputs,Capital goods,Input services,Ineligible'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'R5:R20004', formulas: ['Add,Edit,Delete'] });

            break;

        case 'imps':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Inputs,Ineligible'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['Add,Edit,Delete'] });
            break;

        case 'impg':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['Imports,Received from SEZ'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['Inputs,Capital goods,Ineligible'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'N5:N20004', formulas: ['Add,Edit,Delete'] });

            break;

        case 'cdnr':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['01-Sales Return,02-Post Sale Discount,03-Deficiency in services,04-Correction in Invoice,05-Change in POS,06-Finalization of Provisional assessment,07-Others'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'R5:R20004', formulas: ['Inputs,Capital goods,Input services,Ineligible'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'Y5:Y20004', formulas: ['Accept,Reject,Modify,Pending,Add,Edit,Delete'] });
            break;

        case 'cdnur':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['B2BUR,IMPS'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['01-Sales Return,02-Post Sale Discount,03-Deficiency in services,04-Correction in Invoice,05-Change in POS,06-Finalization of Provisional assessment,07-Others'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'Q5:Q20004', formulas: ['Inputs,Capital goods,Input services,Ineligible'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'V5:V20004', formulas: ['Add,Edit,Delete'] });
            break;

        case 'at':
        case 'atadj':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['Add,Edit,Delete'] });
            break;

    }

}

function addDropdownValidationG1(section) {

    switch (section) {
        case 'b2b':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['=$S$5:$S$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Regular,SEZ supplies with payment,SEZ supplies without payment,Deemed Exp'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['Add,Edit,Delete'] });

            break;
        case 'b2ba':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['=$U$5:$U$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['Regular,SEZ supplies with payment,SEZ supplies without payment,Deemed Exp'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'Q5:Q20004', formulas: ['Add,Edit,Delete'] });

            break;

        case 'b2cl':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['=$N$5:$N$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['Add,Edit,Delete'] });

            break;
        case 'b2cla':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$P$5:$P$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['Add,Edit,Delete'] });

            break;

        case 'b2cs':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['=$K$5:$K$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['E,OE'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['Add,Edit,Delete'] });

            break;

        case 'b2csa':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$M$5:$M$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['E,OE'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['Add,Edit,Delete'] });

            break;

        case 'cdnr':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'N5:N20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'P5:P20004', formulas: ['Add,Edit,Delete'] });
            break;

        case 'cdnra':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'P5:P20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'R5:R20004', formulas: ['Add,Edit,Delete'] });
            break;

        case 'cdnur':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['B2CL,EXPWP,EXPWOP'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'N5:N20004', formulas: ['Add,Edit,Delete'] });
            break;
        case 'cdnura':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['B2CL,EXPWP,EXPWOP'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'P5:P20004', formulas: ['Add,Edit,Delete'] });
            break;

        case 'at':
        case 'atadj':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['=$I$5:$I$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['Add,Edit,Delete'] });
            break;
        case 'ata':
        case 'atadja':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$K$5:$K$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['Add,Edit,Delete'] });
            break;
        case 'exp':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['WOPAY,WPAY'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['Add,Edit,Delete'] });
            break;
        case 'expa':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['WOPAY,WPAY'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'N5:N20004', formulas: ['Add,Edit,Delete'] });
            break;
        case 'docs':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['=$F$5:$F$41'] });

            /*currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['Add,Edit,Delete'] });*/
            break;
        case 'hsnsum':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$N$5:$N$41'] });
            break;

    }

}
function addDropdownValidationG1Er(section) {

    switch (section) {
        case 'b2b':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['=$P$5:$P$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Regular,SEZ supplies with payment,SEZ supplies without payment,Deemed Exp'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['Edit'] });

            break;
        case 'b2ba':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['=$R$5:$R$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['Regular,SEZ supplies with payment,SEZ supplies without payment,Deemed Exp'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'Q5:Q20004', formulas: ['Edit'] });

            break;

        case 'b2cl':


            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['=$L$5:$L$41'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['Edit'] });

            break;
        case 'b2cla':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$N$5:$N$41'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['Edit'] });


            break;

        case 'b2cs':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['=$J$5:$J$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['E,OE'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Edit'] });

            break;

        case 'b2csa':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$M$5:$M$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['E,OE'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['Edit'] });

            break;

        case 'cdnr':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'N5:N20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['C,D'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'P5:P20004', formulas: ['Edit'] });
            break;

        case 'cdnra':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'P5:P20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['C,D'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'R5:R20004', formulas: ['Edit'] });
            break;

        case 'cdnur':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['B2CL,EXPWP,EXPWOP'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['Edit'] });
            break;
        case 'cdnura':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['B2CL,EXPWP,EXPWOP'] });

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['C,D,R'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Inter State,Intra State'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'L5:L20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['N,Y'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'Q5:Q20004', formulas: ['Edit'] });
            break;

        case 'at':
        case 'atadj':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['=$H$5:$H$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'G5:G20004', formulas: ['Edit'] });
            break;
        case 'ata':
        case 'atadja':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$J$5:$J$41'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'B5:B20004', formulas: ['JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'D5:D20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'E5:E20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['Edit'] });
            break;
        case 'exp':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['WOPAY,WPAY'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'I5:I20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'H5:H20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'M5:M20004', formulas: ['Edit'] });
            break;
        case 'expa':
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['WOPAY,WPAY'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'K5:K20004', formulas: ['0.00,0.25,3.00,5.00,12.00,18.00,28.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'J5:J20004', formulas: ['65.00'] });
            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'O5:O20004', formulas: ['Edit'] });
            break;
        case 'docs':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'A5:A20004', formulas: ['=$F$5:$F$41'] });

            /*currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'F5:F20004', formulas: ['Add,Edit,Delete'] });*/
            break;
        case 'hsnsum':

            currSheet.addDataValidation({ type: 'list', allowBlank: 1, sqref: 'C5:C20004', formulas: ['=$M$5:$M$41'] });

            break;

    }

}
function addPOSList(section) {
    var myPosList = posList;
    switch (section) {
        case 'b2b':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 19).string(myPosList[index]);

                ++rowPtr;
            }

            break;
        case 'b2ba':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 21).string(myPosList[index]);

                ++rowPtr;
            }

            break;
        case 'b2cl':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 14).string(myPosList[index]);

                ++rowPtr;
            }

            break;
        case 'b2cla':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 16).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'b2cs':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 11).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'b2csa':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 13).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'at':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 9).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'ata':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 11).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'atadj':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 9).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'atadja':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 11).string(myPosList[index]);

                ++rowPtr;
            }
            break;

    }

}
function addPOSListEr(section) {
    var myPosList = posList;
    switch (section) {
        case 'b2b':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 16).string(myPosList[index]);

                ++rowPtr;
            }

            break;
        case 'b2ba':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 18).string(myPosList[index]);

                ++rowPtr;
            }

            break;
        case 'b2cl':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 12).string(myPosList[index]);

                ++rowPtr;
            }

            break;
        case 'b2cla':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 14).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'b2cs':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 10).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'b2csa':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 13).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'at':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 8).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'ata':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 10).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'atadj':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 8).string(myPosList[index]);

                ++rowPtr;
            }
            break;
        case 'atadja':
            var rowPtr = 5;
            for (var index = 0; index < myPosList.length; index++) {
                currSheet.cell(rowPtr, 10).string(myPosList[index]);

                ++rowPtr;
            }
            break;

    }

}
function addUQC(section) {
    var myUQC = UQCList;

    switch (section) {
        case 'hsnsum':
            var rowPtr = 5;
            for (var index = 0; index < myUQC.length; index++) {

                currSheet.cell(rowPtr, 14).string(myUQC[index].name);

                ++rowPtr;
            }
            break;
    }


}

function addUQCEr(section) {
    var myUQC = UQCList;

    switch (section) {
        case 'hsnsum':
            var rowPtr = 5;
            for (var index = 0; index < myUQC.length; index++) {

                currSheet.cell(rowPtr, 13).string(myUQC[index].name);

                ++rowPtr;
            }
            break;
    }


}

function addDoc(section) {
    var myDocDetails = docDetails;

    switch (section) {
        case 'docs':
            var rowPtr = 5;
            for (var index = 0; index < myDocDetails.length; index++) {

                currSheet.cell(rowPtr, 6).string(myDocDetails[index]);

                ++rowPtr;
            }
            break;
    }


}

function writeB2BDataToExcelG1Er(currSheet, currCtin, currSuppName, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currDiffPerc, currErrorMsg, currErrorCd, item) {
    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(currInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 5).string(parseFloat(currInvValue).toFixed(2));
    currSheet.cell(rowPtr, 6).string(currPos.toString());
    currSheet.cell(rowPtr, 7).string(currRevChange);
    currSheet.cell(rowPtr, 8).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 9).string(currInvType.toString());
    currSheet.cell(rowPtr, 10).string(currETIN);
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    currSheet.cell(rowPtr, 14).string(currErrorMsg);
    currSheet.cell(rowPtr, 15).string("");
    currSheet.cell(rowPtr, 17).string(currErrorCd);
    currSheet.cell(rowPtr, 18).string(currCtin + "_" + currInvNum.toString());
    ++rowPtr;

}

function writeB2BADataToExcelG1Er(currSheet, currCtin, currSuppName, currInvValue, currInvDate, currInvType, currPos, currRevChange, currETIN, currInvNum, currDiffPerc, oldInvNum, oldInvDate, currErrorMsg, currErrorCd, item) {



    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(oldInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(oldInvDate).toString());
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(parseFloat(currInvValue).toFixed(2));
    currSheet.cell(rowPtr, 8).string(currPos.toString());
    currSheet.cell(rowPtr, 9).string(currRevChange);
    currSheet.cell(rowPtr, 10).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 11).string(currInvType.toString());
    currSheet.cell(rowPtr, 12).string(currETIN);
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 14).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 15).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");


    currSheet.cell(rowPtr, 16).string(currErrorMsg);

    currSheet.cell(rowPtr, 17).string("");

    currSheet.cell(rowPtr, 19).string(currErrorCd);
    currSheet.cell(rowPtr, 20).string(currCtin + "_" + oldInvNum.toString() + "_" + currInvNum.toString());
    ++rowPtr;

}
function writeB2CLDataToExcelG1Er(currInvValue, currInvDate, currETIN, currPos, currInvNum, currDiffPerc, currErrorMsg, currErrorCd, item) {
    currSheet.cell(rowPtr, 1).string(currInvNum);
    currSheet.cell(rowPtr, 2).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 3).string(parseFloat(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 4).string(currPos.toString());
    currSheet.cell(rowPtr, 5).string(currDiffPerc.toString());
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 6).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else*/
    //        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    currSheet.cell(rowPtr, 9).string(currETIN.toString());

    currSheet.cell(rowPtr, 10).string(currErrorMsg);
    currSheet.cell(rowPtr, 11).string("");
    currSheet.cell(rowPtr, 13).string(currErrorCd);
    currSheet.cell(rowPtr, 14).string(currPos.substring(0, 2) + "_" + currInvNum.toString());
    ++rowPtr;

}

function writeB2CLADataToExcelG1Er(currInvValue, currInvDate, currETIN, currPos, currInvNum, currDiffPerc, oldInvDate, oldInvNum, currErrorMsg, currErrorCd, item) {
    currSheet.cell(rowPtr, 1).string(oldInvNum);
    currSheet.cell(rowPtr, 2).string(getFormattedDate(oldInvDate).toString());
    currSheet.cell(rowPtr, 3).string(currPos.toString());
    currSheet.cell(rowPtr, 4).string(currInvNum);
    currSheet.cell(rowPtr, 5).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 6).string(parseFloat(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 7).string(currDiffPerc.toString());
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");
    /*if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item["itm_det"]["samt"]).toFixed(2).toString());
    else*/
    //        currSheet.cell(rowPtr, 8).string("0.00");
    if (item.hasOwnProperty('itm_det') && item["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 10).string(Number(item["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    currSheet.cell(rowPtr, 11).string(currETIN.toString());

    currSheet.cell(rowPtr, 12).string(currErrorMsg);
    currSheet.cell(rowPtr, 13).string("");
    currSheet.cell(rowPtr, 15).string(currErrorCd);
    currSheet.cell(rowPtr, 16).string(currPos.substring(0, 2) + "_" + oldInvNum.toString() + "_" + currInvNum.toString());
    ++rowPtr;

}

function writeCDNDataToExcelG1Er(currCtin, currSuppName, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currErrorMsg, currDiffPerc, currSuppType, currErrorCd, innerItem) {

    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(currInvNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 5).string(currNoteNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 7).string(currDocType);
    currSheet.cell(rowPtr, 8).string(getSupplyType(innerItem));
    /* currSheet.cell(rowPtr, 7).string(currReason);*/
    currSheet.cell(rowPtr, 9).string(Number(currNoteValue).toFixed(2).toString());

    currSheet.cell(rowPtr, 10).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    currSheet.cell(rowPtr, 14).string(currPreGST.toString());

    currSheet.cell(rowPtr, 15).string(currErrorMsg);

    currSheet.cell(rowPtr, 16).string("");
    currSheet.cell(rowPtr, 17).string(currErrorCd);
    currSheet.cell(rowPtr, 18).string(currCtin + "_" + currNoteNum.toString());
    ++rowPtr;

}

function writeCDNADataToExcelG1Er(currCtin, currSuppName, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currDiffPerc, currSuppType, oldNoteNum, oldNoteDate, currErrorMsg, currErrorCd, innerItem) {

    currSheet.cell(rowPtr, 1).string(currCtin);
    currSheet.cell(rowPtr, 2).string(currSuppName);
    currSheet.cell(rowPtr, 3).string(oldNoteNum);
    currSheet.cell(rowPtr, 4).string(getFormattedDate(oldNoteDate).toString());
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(currNoteNum);
    currSheet.cell(rowPtr, 8).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 9).string(currDocType);
    currSheet.cell(rowPtr, 10).string(getSupplyType(innerItem));
    /* currSheet.cell(rowPtr, 7).string(currReason);*/
    currSheet.cell(rowPtr, 11).string(Number(currNoteValue).toFixed(2).toString());

    currSheet.cell(rowPtr, 12).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 14).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 15).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 15).string("0.00");

    currSheet.cell(rowPtr, 16).string(currPreGST.toString());

    currSheet.cell(rowPtr, 17).string(currErrorMsg);
    currSheet.cell(rowPtr, 18).string("");
    currSheet.cell(rowPtr, 19).string(currErrorCd);
    currSheet.cell(rowPtr, 20).string(currCtin + "_" + oldNoteNum.toString() + "_" + currNoteNum.toString());

    ++rowPtr;

}

function writeCDNURDataToExcelG1Er(currUrType, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currErrorMsg, currDiffPerc, currSuppType, currErrorCd, innerItem) {

    currSheet.cell(rowPtr, 1).string(currUrType);
    currSheet.cell(rowPtr, 2).string(currNoteNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 4).string(currDocType);
    currSheet.cell(rowPtr, 5).string(currInvNum);
    currSheet.cell(rowPtr, 6).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 7).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 8).string(Number(currNoteValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 9).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 10).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    currSheet.cell(rowPtr, 13).string(currPreGST.toString());

    currSheet.cell(rowPtr, 14).string(currErrorMsg);
    currSheet.cell(rowPtr, 15).string("");
    currSheet.cell(rowPtr, 16).string(currErrorCd);
    currSheet.cell(rowPtr, 17).string(currNoteNum);
    ++rowPtr;

}

function writeCDNURADataToExcelG1Er(currUrType, oldNoteNum, oldNoteDate, currNoteNum, currNoteDate, currInvNum, currInvDate, currPreGST, currDocType, currNoteValue, currErrorMsg, currDiffPerc, currSuppType, currErrorCd, innerItem) {

    currSheet.cell(rowPtr, 1).string(currUrType);
    currSheet.cell(rowPtr, 2).string(oldNoteNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(oldNoteDate).toString());
    currSheet.cell(rowPtr, 4).string(currInvNum);
    currSheet.cell(rowPtr, 5).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 6).string(currNoteNum);
    currSheet.cell(rowPtr, 7).string(getFormattedDate(currNoteDate).toString());
    currSheet.cell(rowPtr, 8).string(currDocType);
    currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 10).string(Number(currNoteValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 11).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");

    /*if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 11).string(Number(innerItem["itm_det"]["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 12).string(Number(innerItem["itm_det"]["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 13).string(Number(innerItem["itm_det"]["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");*/

    if (innerItem.hasOwnProperty('itm_det') && innerItem["itm_det"].hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 14).string(Number(innerItem["itm_det"]["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 14).string("0.00");

    currSheet.cell(rowPtr, 15).string(currPreGST.toString());

    currSheet.cell(rowPtr, 16).string(currErrorMsg);
    currSheet.cell(rowPtr, 17).string("");
    currSheet.cell(rowPtr, 18).string(currErrorCd);

    currSheet.cell(rowPtr, 19).string(oldNoteNum.toString() + "_" + currNoteNum.toString());

    ++rowPtr;

}

function writeB2CSDataToExcelG1Er(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currDiffPerc, currErrorMsg, currErrorCd) {

    currSheet.cell(rowPtr, 1).string(currType);
    currSheet.cell(rowPtr, 2).string(currPos);
    currSheet.cell(rowPtr, 3).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 4).string(currRate);
    currSheet.cell(rowPtr, 5).string(currTxValue);
    /* currSheet.cell(rowPtr, 5).string(currIAmount);
     currSheet.cell(rowPtr, 6).string(currCAmt);
     currSheet.cell(rowPtr, 7).string(currSAmt);*/
    currSheet.cell(rowPtr, 6).string(currCSAmount);
    currSheet.cell(rowPtr, 7).string(currETIN);
    currSheet.cell(rowPtr, 8).string(currErrorMsg);
    currSheet.cell(rowPtr, 9).string("");
    currSheet.cell(rowPtr, 11).string(currErrorCd);

    if (currDiffPerc == '65') {
        currDiffPerc = currDiffPerc / 100;
    }

    currSheet.cell(rowPtr, 12).string(currPos.substring(0, 2) + "_" + Number(currRate) + "_" + currETIN + "_" + currDiffPerc.toString());


    ++rowPtr;

}


function writeB2CSADataToExcelG1Er(currTxValue, currCSAmount, currETIN, currSuppType, currRate, currPos, currType, currDiffPerc, oldYear, oldMonth, oldMonthValue, currErrorMsg, currErrorCd) {

    currSheet.cell(rowPtr, 1).string(oldYear);
    currSheet.cell(rowPtr, 2).string(oldMonth);
    currSheet.cell(rowPtr, 3).string(currPos);
    currSheet.cell(rowPtr, 4).string(currType);

    currSheet.cell(rowPtr, 5).string(currDiffPerc.toString());
    currSheet.cell(rowPtr, 6).string(currRate);
    currSheet.cell(rowPtr, 7).string(currTxValue);
    /* currSheet.cell(rowPtr, 5).string(currIAmount);
     currSheet.cell(rowPtr, 6).string(currCAmt);
     currSheet.cell(rowPtr, 7).string(currSAmt);*/
    currSheet.cell(rowPtr, 8).string(currCSAmount);
    currSheet.cell(rowPtr, 9).string(currETIN);
    currSheet.cell(rowPtr, 10).string(currErrorMsg);
    currSheet.cell(rowPtr, 11).string("");

    currSheet.cell(rowPtr, 13).string(currErrorCd);
    currSheet.cell(rowPtr, 14).string(currPos.substring(0, 2) + "_" + oldMonthValue + "_" + currDiffPerc.toString());



    ++rowPtr;

}

function writeExpDataToExcelG1Er(currSheet, currEType, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currDiffPerc, currErrorMsg, currErrorCd, item) {

    currSheet.cell(rowPtr, 1).string(currEType);
    currSheet.cell(rowPtr, 2).string(currInvNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 4).string(Number(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 5).string(currPortCode);
    currSheet.cell(rowPtr, 6).string(currShipNum.toString());
    if (currShipDate = '' || !currShipDate)
        currSheet.cell(rowPtr, 7).string("");
    else
        currSheet.cell(rowPtr, 7).string(getFormattedDate(currShipDate).toString());
    currSheet.cell(rowPtr, 8).string(currDiffPerc.toString());
    if (item.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 9).string(Number(item["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 10).string(Number(item["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    /*if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 10).string(Number(item["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 11).string(Number(item["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 12).string(Number(item["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");*/

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 11).string(Number(item["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");
    currSheet.cell(rowPtr, 12).string(currErrorMsg);
    currSheet.cell(rowPtr, 13).string("");

    currSheet.cell(rowPtr, 14).string(currErrorCd);
    currSheet.cell(rowPtr, 15).string(currEType + "_" + currInvNum.toString());
    ++rowPtr;
}
function writeExpaDataToExcelG1Er(currSheet, currEType, currInvNum, currInvValue, currInvDate, currPortCode, currShipNum, currShipDate, currDiffPerc, oldInvNum, oldInvDate, currErrorMsg, currErrorCd, item) {


    currSheet.cell(rowPtr, 1).string(currEType);
    currSheet.cell(rowPtr, 2).string(oldInvNum);
    currSheet.cell(rowPtr, 3).string(getFormattedDate(oldInvDate).toString());
    currSheet.cell(rowPtr, 4).string(currInvNum);
    currSheet.cell(rowPtr, 5).string(getFormattedDate(currInvDate).toString());
    currSheet.cell(rowPtr, 6).string(Number(currInvValue).toFixed(2).toString());
    currSheet.cell(rowPtr, 7).string(currPortCode);
    currSheet.cell(rowPtr, 8).string(currShipNum.toString());
    if (currShipDate = '' || !currShipDate)
        currSheet.cell(rowPtr, 9).string("");
    else
        currSheet.cell(rowPtr, 9).string(getFormattedDate(currShipDate).toString());

    currSheet.cell(rowPtr, 10).string(currDiffPerc.toString());
    if (item.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 11).string(Number(item["rt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 12).string(Number(item["txval"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");

    /*if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 10).string(Number(item["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 11).string(Number(item["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 11).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 12).string(Number(item["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 12).string("0.00");*/

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 13).string(Number(item["csamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 13).string("0.00");
    currSheet.cell(rowPtr, 14).string(currErrorMsg);

    currSheet.cell(rowPtr, 15).string("");
    currSheet.cell(rowPtr, 16).string(currErrorCd);
    currSheet.cell(rowPtr, 17).string(currEType + "_" + oldInvNum.toString() + "_" + currInvNum.toString());


    ++rowPtr;
}

function writeHSNSUMDataToExcelG1Er(currErrorMsg, currErrorCd, item) {

    if (item.hasOwnProperty('hsn_sc'))
        currSheet.cell(rowPtr, 1).string(item['hsn_sc']);
    else
        currSheet.cell(rowPtr, 1).string("");
    if (item.hasOwnProperty('desc'))
        currSheet.cell(rowPtr, 2).string(item['desc']);
    else
        currSheet.cell(rowPtr, 2).string("");
    currSheet.cell(rowPtr, 3).string(getFullUQC(item['uqc']));

    if (item.hasOwnProperty('qty'))
        currSheet.cell(rowPtr, 4).string(Number(item['qty']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0");
    if (item.hasOwnProperty('val'))
        currSheet.cell(rowPtr, 5).string(Number(item['val']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (item.hasOwnProperty('txval'))
        currSheet.cell(rowPtr, 6).string(Number(item['txval']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    if (item.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 7).string(Number(item['iamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");

    if (item.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 8).string(Number(item['camt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 8).string("0.00");

    if (item.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 9).string(Number(item['samt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 9).string("0.00");

    if (item.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 10).string(Number(item['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 10).string("0.00");
    //currSheet.cell(rowPtr, 11).string(currFlag);
    currSheet.cell(rowPtr, 11).string(currErrorMsg);
    currSheet.cell(rowPtr, 12).string(currErrorCd);


    ++rowPtr;

}

function writeNilDataToExcelG1Er(currChckSum, nilItem) {
    //getNilSupplyType
    if (nilItem.hasOwnProperty("sply_ty")) {

        currSheet.cell(rowPtr, 1).string(getNilSupplyType(nilItem['sply_ty']));
    } else {
        currSheet.cell(rowPtr, 1).string("");
    }

    if (nilItem.hasOwnProperty("nil_amt")) {

        currSheet.cell(rowPtr, 2).string(Number(nilItem['nil_amt']).toFixed(2).toString());
    } else {
        currSheet.cell(rowPtr, 2).string("0.00");
    }

    if (nilItem.hasOwnProperty("expt_amt")) {

        currSheet.cell(rowPtr, 3).string(Number(nilItem['expt_amt']).toFixed(2).toString());
    } else {
        currSheet.cell(rowPtr, 3).string("0.00");
    }

    if (nilItem.hasOwnProperty("ngsup_amt")) {

        currSheet.cell(rowPtr, 4).string(Number(nilItem['ngsup_amt']).toFixed(2).toString());
    } else {
        currSheet.cell(rowPtr, 4).string("0.00");
    }
    currSheet.cell(rowPtr, 5).string(currChckSum);
    ++rowPtr;
}


function writeTXIDataToExcelG1Er(currPos, currSuppType, currDiffPerc, currErrorMsg, currErrorCd, innerItem) {

    currSheet.cell(rowPtr, 1).string(currPos.toString());
    //currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 2).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 3).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 3).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    /*if (innerItem.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    if (innerItem.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");
    currSheet.cell(rowPtr, 6).string(currErrorMsg);
    currSheet.cell(rowPtr, 7).string("");
    currSheet.cell(rowPtr, 9).string(currErrorCd);
    currSheet.cell(rowPtr, 10).string(currPos.substring(0, 2) + "_" + currDiffPerc.toString());
    ++rowPtr;

}

function writeATXIDataToExcelG1Er(currPos, currSuppType, currDiffPerc, oldMonth, oldYear, oldMonthValue, currErrorMsg, currErrorCd, innerItem) {

    currSheet.cell(rowPtr, 1).string(oldYear);
    currSheet.cell(rowPtr, 2).string(oldMonth);
    currSheet.cell(rowPtr, 3).string(currPos.toString());
    //currSheet.cell(rowPtr, 9).string(getSupplyType(innerItem));
    currSheet.cell(rowPtr, 4).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    /*if (innerItem.hasOwnProperty('iamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    if (innerItem.hasOwnProperty('camt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('samt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 7).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    currSheet.cell(rowPtr, 8).string(currErrorMsg);
    currSheet.cell(rowPtr, 9).string("");
    currSheet.cell(rowPtr, 11).string(currErrorCd);
    currSheet.cell(rowPtr, 12).string(currPos.substring(0, 2) + "_" + oldMonthValue + "_" + currDiffPerc.toString());


    ++rowPtr;

}
function writeATADJDataToExcelG1Er(currPos, currSuppType, currDiffPerc, currErrorMsg, currErrorCd, innerItem) {
    currSheet.cell(rowPtr, 1).string(currPos.toString());
    currSheet.cell(rowPtr, 2).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 3).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 3).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 4).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 4).string("0.00");

    /* if (innerItem.hasOwnProperty('iamt'))
         currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 4).string("0.00");
 
     if (innerItem.hasOwnProperty('camt'))
         currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 5).string("0.00");
 
     if (innerItem.hasOwnProperty('samt'))
         currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");
    currSheet.cell(rowPtr, 6).string(currErrorMsg);
    currSheet.cell(rowPtr, 7).string("");
    currSheet.cell(rowPtr, 9).string(currErrorCd);
    currSheet.cell(rowPtr, 10).string(currPos.substring(0, 2) + "_" + currDiffPerc.toString());

    ++rowPtr;

}

function writeATADJADataToExcelG1Er(currPos, currSuppType, currDiffPerc, oldMonth, oldYear, oldMonthValue, currErrorMsg, currErrorCd, innerItem) {
    currSheet.cell(rowPtr, 1).string(oldYear);
    currSheet.cell(rowPtr, 2).string(oldMonth);
    currSheet.cell(rowPtr, 3).string(currPos.toString());
    currSheet.cell(rowPtr, 4).string(currDiffPerc.toString());
    if (innerItem.hasOwnProperty('rt'))
        currSheet.cell(rowPtr, 5).string(Number(innerItem['rt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 5).string("0.00");

    if (innerItem.hasOwnProperty('adamt'))
        currSheet.cell(rowPtr, 6).string(Number(innerItem['adamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 6).string("0.00");

    /* if (innerItem.hasOwnProperty('iamt'))
         currSheet.cell(rowPtr, 4).string(Number(innerItem["iamt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 4).string("0.00");
 
     if (innerItem.hasOwnProperty('camt'))
         currSheet.cell(rowPtr, 5).string(Number(innerItem["camt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 5).string("0.00");
 
     if (innerItem.hasOwnProperty('samt'))
         currSheet.cell(rowPtr, 6).string(Number(innerItem["samt"]).toFixed(2).toString());
     else
         currSheet.cell(rowPtr, 6).string("0.00");*/

    if (innerItem.hasOwnProperty('csamt'))
        currSheet.cell(rowPtr, 7).string(Number(innerItem['csamt']).toFixed(2).toString());
    else
        currSheet.cell(rowPtr, 7).string("0.00");
    currSheet.cell(rowPtr, 8).string(currErrorMsg);
    currSheet.cell(rowPtr, 9).string("");
    currSheet.cell(rowPtr, 11).string(currErrorCd);
    currSheet.cell(rowPtr, 12).string(currPos.substring(0, 2) + "_" + oldMonthValue + "_" + currDiffPerc.toString());

    ++rowPtr;

}
function writeDocsDataToExcelG1Er(json) {

    var detArr = json['doc_det'];
    for (var i = 1; i <= detArr.length; i++) {
        var currDocDet = docDetails[detArr[i - 1]['doc_num']];
        var docsArr = detArr[i - 1]['docs'];
        for (var j = 0; j < docsArr.length; j++) {
            currSheet.cell(rowPtr, 1).string(currDocDet);
            currSheet.cell(rowPtr, 2).string(docsArr[j]['from']);
            currSheet.cell(rowPtr, 3).string(docsArr[j]['to']);
            currSheet.cell(rowPtr, 4).string(docsArr[j]['totnum'].toString());
            currSheet.cell(rowPtr, 5).string(docsArr[j]['cancel'].toString());
            //currSheet.cell(rowPtr, 7).string(docsArr[j]['num'].toString());

            ++rowPtr;
        }
    }

}

module.exports = {
    writeJSONToExcel: writeJSONToExcel
};

