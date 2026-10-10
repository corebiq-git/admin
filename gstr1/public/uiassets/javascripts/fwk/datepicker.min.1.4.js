(function(b,a){typeof exports==="object"&&typeof module!=="undefined"?module.exports=a():typeof define==="function"&&define.amd?define(a):b.moment=a()
}(this,function(){var b1;
function c7(){return b1.apply(null,arguments)
}function aW(dS){b1=dS
}function bq(dS){return Object.prototype.toString.call(dS)==="[object Array]"
}function aJ(dS){return dS instanceof Date||Object.prototype.toString.call(dS)==="[object Date]"
}function a1(dS,dV){var dU=[],dT;
for(dT=0;
dT<dS.length;
++dT){dU.push(dV(dS[dT],dT))
}return dU
}function a7(dT,dS){return Object.prototype.hasOwnProperty.call(dT,dS)
}function cD(dT,dS){var dU;
for(dU in dS){if(a7(dS,dU)){dT[dU]=dS[dU]
}}if(a7(dS,"toString")){dT.toString=dS.toString
}if(a7(dS,"valueOf")){dT.valueOf=dS.valueOf
}return dT
}function G(dU,dV,dS,dT){return c0(dU,dV,dS,dT,true).utc()
}function aE(){return{empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false}
}function co(dS){if(dS._pf==null){dS._pf=aE()
}return dS._pf
}function b(dS){if(dS._isValid==null){var dT=co(dS);
dS._isValid=!isNaN(dS._d.getTime())&&dT.overflow<0&&!dT.empty&&!dT.invalidMonth&&!dT.nullInput&&!dT.invalidFormat&&!dT.userInvalidated;
if(dS._strict){dS._isValid=dS._isValid&&dT.charsLeftOver===0&&dT.unusedTokens.length===0&&dT.bigHour===undefined
}}return dS._isValid
}function bT(dT){var dS=G(NaN);
if(dT!=null){cD(co(dS),dT)
}else{co(dS).userInvalidated=true
}return dS
}var an=c7.momentProperties=[];
function q(dW,dV){var dS,dU,dT;
if(typeof dV._isAMomentObject!=="undefined"){dW._isAMomentObject=dV._isAMomentObject
}if(typeof dV._i!=="undefined"){dW._i=dV._i
}if(typeof dV._f!=="undefined"){dW._f=dV._f
}if(typeof dV._l!=="undefined"){dW._l=dV._l
}if(typeof dV._strict!=="undefined"){dW._strict=dV._strict
}if(typeof dV._tzm!=="undefined"){dW._tzm=dV._tzm
}if(typeof dV._isUTC!=="undefined"){dW._isUTC=dV._isUTC
}if(typeof dV._offset!=="undefined"){dW._offset=dV._offset
}if(typeof dV._pf!=="undefined"){dW._pf=co(dV)
}if(typeof dV._locale!=="undefined"){dW._locale=dV._locale
}if(an.length>0){for(dS in an){dU=an[dS];
dT=dV[dU];
if(typeof dT!=="undefined"){dW[dU]=dT
}}}return dW
}var dE=false;
function bA(dS){q(this,dS);
this._d=new Date(+dS._d);
if(dE===false){dE=true;
c7.updateOffset(this);
dE=false
}}function bO(dS){return dS instanceof bA||(dS!=null&&dS._isAMomentObject!=null)
}function dK(dS){var dU=+dS,dT=0;
if(dU!==0&&isFinite(dU)){if(dU>=0){dT=Math.floor(dU)
}else{dT=Math.ceil(dU)
}}return dT
}function K(dX,dW,dT){var dS=Math.min(dX.length,dW.length),dU=Math.abs(dX.length-dW.length),dY=0,dV;
for(dV=0;
dV<dS;
dV++){if((dT&&dX[dV]!==dW[dV])||(!dT&&dK(dX[dV])!==dK(dW[dV]))){dY++
}}return dY+dU
}function aG(){}var cK={};
var az;
function du(dS){return dS?dS.toLowerCase().replace("_","-"):dS
}function X(dX){var dV=0,dT,dW,dS,dU;
while(dV<dX.length){dU=du(dX[dV]).split("-");
dT=dU.length;
dW=du(dX[dV+1]);
dW=dW?dW.split("-"):null;
while(dT>0){dS=Z(dU.slice(0,dT).join("-"));
if(dS){return dS
}if(dW&&dW.length>=dT&&K(dU,dW,true)>=dT-1){break
}dT--
}dV++
}return null
}function Z(dS){var dU=null;
if(!cK[dS]&&typeof module!=="undefined"&&module&&module.exports){try{dU=az._abbr;
require("./locale/"+dS);
dm(dU)
}catch(dT){}}return cK[dS]
}function dm(dT,dS){var dU;
if(dT){if(typeof dS==="undefined"){dU=n(dT)
}else{dU=k(dT,dS)
}if(dU){az=dU
}}return az._abbr
}function k(dT,dS){if(dS!==null){dS.abbr=dT;
if(!cK[dT]){cK[dT]=new aG()
}cK[dT].set(dS);
dm(dT);
return cK[dT]
}else{delete cK[dT];
return null
}}function n(dT){var dS;
if(dT&&dT._locale&&dT._locale._abbr){dT=dT._locale._abbr
}if(!dT){return az
}if(!bq(dT)){dS=Z(dT);
if(dS){return dS
}dT=[dT]
}return X(dT)
}var l={};
function dH(dU,dS){var dT=dU.toLowerCase();
l[dT]=l[dT+"s"]=l[dS]=dU
}function Y(dS){return typeof dS==="string"?l[dS]||l[dS.toLowerCase()]:undefined
}function cF(dU){var dT={},dS,dV;
for(dV in dU){if(a7(dU,dV)){dS=Y(dV);
if(dS){dT[dS]=dU[dV]
}}}return dT
}function b0(dS,dT){return function(dU){if(dU!=null){L(this,dS,dU);
c7.updateOffset(this,dT);
return this
}else{return ap(this,dS)
}}
}function ap(dT,dS){return dT._d["get"+(dT._isUTC?"UTC":"")+dS]()
}function L(dT,dS,dU){return dT._d["set"+(dT._isUTC?"UTC":"")+dS](dU)
}function bo(dS,dU){var dT;
if(typeof dS==="object"){for(dT in dS){this.set(dT,dS[dT])
}}else{dS=Y(dS);
if(typeof this[dS]==="function"){return this[dS](dU)
}}return this
}function R(dW,dV,dU){var dT=""+Math.abs(dW),dS=dW>=0;
while(dT.length<dV){dT="0"+dT
}return(dS?(dU?"+":""):"-")+dT
}var v=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;
var aR=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
var a4={};
var df={};
function a2(dT,dU,dS,dW){var dV=dW;
if(typeof dW==="string"){dV=function(){return this[dW]()
}
}if(dT){df[dT]=dV
}if(dU){df[dU[0]]=function(){return R(dV.apply(this,arguments),dU[1],dU[2])
}
}if(dS){df[dS]=function(){return this.localeData().ordinal(dV.apply(this,arguments),dT)
}
}}function cR(dS){if(dS.match(/\[[\s\S]/)){return dS.replace(/^\[|\]$/g,"")
}return dS.replace(/\\/g,"")
}function a3(dU){var dV=dU.match(v),dS,dT;
for(dS=0,dT=dV.length;
dS<dT;
dS++){if(df[dV[dS]]){dV[dS]=df[dV[dS]]
}else{dV[dS]=cR(dV[dS])
}}return function(dX){var dW="";
for(dS=0;
dS<dT;
dS++){dW+=dV[dS] instanceof Function?dV[dS].call(dX,dU):dV[dS]
}return dW
}
}function g(dS,dT){if(!dS.isValid()){return dS.localeData().invalidDate()
}dT=cy(dT,dS.localeData());
if(!a4[dT]){a4[dT]=a3(dT)
}return a4[dT](dS)
}function cy(dV,dS){var dT=5;
function dU(dW){return dS.longDateFormat(dW)||dW
}aR.lastIndex=0;
while(dT>=0&&aR.test(dV)){dV=dV.replace(aR,dU);
aR.lastIndex=0;
dT-=1
}return dV
}var dB=/\d/;
var dA=/\d\d/;
var dy=/\d{3}/;
var dx=/\d{4}/;
var dw=/[+-]?\d{6}/;
var cs=/\d\d?/;
var cp=/\d{1,3}/;
var cm=/\d{1,4}/;
var ck=/[+-]?\d{1,6}/;
var aD=/\d+/;
var dL=/[+-]?\d+/;
var dM=/Z|[+-]\d\d:?\d\d/gi;
var Q=/[+-]?\d+(\.\d{1,3})?/;
var A=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
var cC={};
function j(dS,dT,dU){cC[dS]=typeof dT==="function"?dT:function(dV){return(dV&&dU)?dU:dT
}
}function ak(dT,dS){if(!a7(cC,dT)){return new RegExp(a8(dT))
}return cC[dT](dS._strict,dS._locale)
}function a8(dS){return dS.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(dT,dX,dW,dV,dU){return dX||dW||dV||dU
}).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")
}var M={};
function b6(dT,dV){var dS,dU=dV;
if(typeof dT==="string"){dT=[dT]
}if(typeof dV==="number"){dU=function(dW,dX){dX[dV]=dK(dW)
}
}for(dS=0;
dS<dT.length;
dS++){M[dT[dS]]=dU
}}function dQ(dS,dT){b6(dS,function(dU,dX,dV,dW){dV._w=dV._w||{};
dT(dU,dV._w,dV,dW)
})
}function aZ(dU,dS,dT){if(dS!=null&&a7(M,dU)){M[dU](dS,dT._a,dT,dU)
}}var cl=0;
var cx=1;
var ce=2;
var ay=3;
var dg=4;
var cA=5;
var dI=6;
function cH(dS,dT){return new Date(Date.UTC(dS,dT+1,0)).getUTCDate()
}a2("M",["MM",2],"Mo",function(){return this.month()+1
});
a2("MMM",0,0,function(dS){return this.localeData().monthsShort(this,dS)
});
a2("MMMM",0,0,function(dS){return this.localeData().months(this,dS)
});
dH("month","M");
j("M",cs);
j("MM",cs,dA);
j("MMM",A);
j("MMMM",A);
b6(["M","MM"],function(dS,dT){dT[cx]=dK(dS)-1
});
b6(["MMM","MMMM"],function(dS,dW,dT,dU){var dV=dT._locale.monthsParse(dS,dU,dT._strict);
if(dV!=null){dW[cx]=dV
}else{co(dT).invalidMonth=dS
}});
var dO="January_February_March_April_May_June_July_August_September_October_November_December".split("_");
function cu(dS){return this._months[dS.month()]
}var bv="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
function cJ(dS){return this._monthsShort[dS.month()]
}function bE(dT,dX,dS){var dU,dW,dV;
if(!this._monthsParse){this._monthsParse=[];
this._longMonthsParse=[];
this._shortMonthsParse=[]
}for(dU=0;
dU<12;
dU++){dW=G([2000,dU]);
if(dS&&!this._longMonthsParse[dU]){this._longMonthsParse[dU]=new RegExp("^"+this.months(dW,"").replace(".","")+"$","i");
this._shortMonthsParse[dU]=new RegExp("^"+this.monthsShort(dW,"").replace(".","")+"$","i")
}if(!dS&&!this._monthsParse[dU]){dV="^"+this.months(dW,"")+"|^"+this.monthsShort(dW,"");
this._monthsParse[dU]=new RegExp(dV.replace(".",""),"i")
}if(dS&&dX==="MMMM"&&this._longMonthsParse[dU].test(dT)){return dU
}else{if(dS&&dX==="MMM"&&this._shortMonthsParse[dU].test(dT)){return dU
}else{if(!dS&&this._monthsParse[dU].test(dT)){return dU
}}}}}function ds(dS,dT){var dU;
if(typeof dT==="string"){dT=dS.localeData().monthsParse(dT);
if(typeof dT!=="number"){return dS
}}dU=Math.min(dS.date(),cH(dS.year(),dT));
dS._d["set"+(dS._isUTC?"UTC":"")+"Month"](dT,dU);
return dS
}function o(dS){if(dS!=null){ds(this,dS);
c7.updateOffset(this,true);
return this
}else{return ap(this,"Month")
}}function aS(){return cH(this.year(),this.month())
}function cr(dS){var dU;
var dT=dS._a;
if(dT&&co(dS).overflow===-2){dU=dT[cx]<0||dT[cx]>11?cx:dT[ce]<1||dT[ce]>cH(dT[cl],dT[cx])?ce:dT[ay]<0||dT[ay]>24||(dT[ay]===24&&(dT[dg]!==0||dT[cA]!==0||dT[dI]!==0))?ay:dT[dg]<0||dT[dg]>59?dg:dT[cA]<0||dT[cA]>59?cA:dT[dI]<0||dT[dI]>999?dI:-1;
if(co(dS)._overflowDayOfYear&&(dU<cl||dU>ce)){dU=ce
}co(dS).overflow=dU
}return dS
}function dk(dS){if(c7.suppressDeprecationWarnings===false&&typeof console!=="undefined"&&console.warn){console.warn("Deprecation warning: "+dS)
}}function cG(dU,dT){var dV=true,dS=dU+"\n"+(new Error()).stack;
return cD(function(){if(dV){dk(dS);
dV=false
}return dT.apply(this,arguments)
},dT)
}var ag={};
function ch(dS,dT){if(!ag[dS]){dk(dT);
ag[dS]=true
}}c7.suppressDeprecationWarnings=false;
var b3=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var dl=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]];
var cj=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]];
var de=/^\/?Date\((\-?\d+)/i;
function d(dV){var dW,dS,dU=dV._i,dT=b3.exec(dU);
if(dT){co(dV).iso=true;
for(dW=0,dS=dl.length;
dW<dS;
dW++){if(dl[dW][1].exec(dU)){dV._f=dl[dW][0]+(dT[6]||" ");
break
}}for(dW=0,dS=cj.length;
dW<dS;
dW++){if(cj[dW][1].exec(dU)){dV._f+=cj[dW][0];
break
}}if(dU.match(dM)){dV._f+="Z"
}x(dV)
}else{dV._isValid=false
}}function bp(dT){var dS=de.exec(dT._i);
if(dS!==null){dT._d=new Date(+dS[1]);
return
}d(dT);
if(dT._isValid===false){delete dT._isValid;
c7.createFromInputFallback(dT)
}}c7.createFromInputFallback=cG("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(dS){dS._d=new Date(dS._i+(dS._useUTC?" UTC":""))
});
function au(dZ,dS,dX,dW,dY,dV,dU){var dT=new Date(dZ,dS,dX,dW,dY,dV,dU);
if(dZ<1970){dT.setFullYear(dZ)
}return dT
}function bD(dT){var dS=new Date(Date.UTC.apply(null,arguments));
if(dT<1970){dS.setUTCFullYear(dT)
}return dS
}a2(0,["YY",2],0,function(){return this.year()%100
});
a2(0,["YYYY",4],0,"year");
a2(0,["YYYYY",5],0,"year");
a2(0,["YYYYYY",6,true],0,"year");
dH("year","y");
j("Y",dL);
j("YY",cs,dA);
j("YYYY",cm,dx);
j("YYYYY",ck,dw);
j("YYYYYY",ck,dw);
b6(["YYYY","YYYYY","YYYYYY"],cl);
b6("YY",function(dS,dT){dT[cl]=c7.parseTwoDigitYear(dS)
});
function dr(dS){return bY(dS)?366:365
}function bY(dS){return(dS%4===0&&dS%100!==0)||dS%400===0
}c7.parseTwoDigitYear=function(dS){return dK(dS)+(dK(dS)>68?1900:2000)
};
var T=b0("FullYear",false);
function cQ(){return bY(this.year())
}a2("w",["ww",2],"wo","week");
a2("W",["WW",2],"Wo","isoWeek");
dH("week","w");
dH("isoWeek","W");
j("w",cs);
j("ww",cs,dA);
j("W",cs);
j("WW",cs,dA);
dQ(["w","ww","W","WW"],function(dS,dV,dT,dU){dV[dU.substr(0,1)]=dK(dS)
});
function dR(dW,dU,dX){var dT=dX-dU,dS=dX-dW.day(),dV;
if(dS>dT){dS-=7
}if(dS<dT-7){dS+=7
}dV=bS(dW).add(dS,"d");
return{week:Math.ceil(dV.dayOfYear()/7),year:dV.year()}
}function cZ(dS){return dR(dS,this._week.dow,this._week.doy).week
}var bu={dow:0,doy:6};
function aK(){return this._week.dow
}function s(){return this._week.doy
}function bi(dS){var dT=this.localeData().week(this);
return dS==null?dT:this.add((dS-dT)*7,"d")
}function dv(dS){var dT=dR(this,1,4).week;
return dS==null?dT:this.add((dS-dT)*7,"d")
}a2("DDD",["DDDD",3],"DDDo","dayOfYear");
dH("dayOfYear","DDD");
j("DDD",cp);
j("DDDD",dy);
b6(["DDD","DDDD"],function(dS,dU,dT){dT._dayOfYear=dK(dS)
});
function aB(dW,dV,dX,dZ,dS){var dY=bD(dW,0,1).getUTCDay();
var dU;
var dT;
dY=dY===0?7:dY;
dX=dX!=null?dX:dS;
dU=dS-dY+(dY>dZ?7:0)-(dY<dS?7:0);
dT=7*(dV-1)+(dX-dS)+dU+1;
return{year:dT>0?dW:dW-1,dayOfYear:dT>0?dT:dr(dW-1)+dT}
}function bL(dS){var dT=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/86400000)+1;
return dS==null?dT:this.add((dS-dT),"d")
}function ba(dT,dS,dU){if(dT!=null){return dT
}if(dS!=null){return dS
}return dU
}function bj(dT){var dS=new Date();
if(dT._useUTC){return[dS.getUTCFullYear(),dS.getUTCMonth(),dS.getUTCDate()]
}return[dS.getFullYear(),dS.getMonth(),dS.getDate()]
}function P(dW){var dX,dV,dU=[],dT,dS;
if(dW._d){return
}dT=bj(dW);
if(dW._w&&dW._a[ce]==null&&dW._a[cx]==null){ab(dW)
}if(dW._dayOfYear){dS=ba(dW._a[cl],dT[cl]);
if(dW._dayOfYear>dr(dS)){co(dW)._overflowDayOfYear=true
}dV=bD(dS,0,dW._dayOfYear);
dW._a[cx]=dV.getUTCMonth();
dW._a[ce]=dV.getUTCDate()
}for(dX=0;
dX<3&&dW._a[dX]==null;
++dX){dW._a[dX]=dU[dX]=dT[dX]
}for(;
dX<7;
dX++){dW._a[dX]=dU[dX]=(dW._a[dX]==null)?(dX===2?1:0):dW._a[dX]
}if(dW._a[ay]===24&&dW._a[dg]===0&&dW._a[cA]===0&&dW._a[dI]===0){dW._nextDay=true;
dW._a[ay]=0
}dW._d=(dW._useUTC?bD:au).apply(null,dU);
if(dW._tzm!=null){dW._d.setUTCMinutes(dW._d.getUTCMinutes()-dW._tzm)
}if(dW._nextDay){dW._a[ay]=24
}}function ab(dU){var dS,dW,dV,dX,dZ,dY,dT;
dS=dU._w;
if(dS.GG!=null||dS.W!=null||dS.E!=null){dZ=1;
dY=4;
dW=ba(dS.GG,dU._a[cl],dR(bS(),1,4).year);
dV=ba(dS.W,1);
dX=ba(dS.E,1)
}else{dZ=dU._locale._week.dow;
dY=dU._locale._week.doy;
dW=ba(dS.gg,dU._a[cl],dR(bS(),dZ,dY).year);
dV=ba(dS.w,1);
if(dS.d!=null){dX=dS.d;
if(dX<dZ){++dV
}}else{if(dS.e!=null){dX=dS.e+dZ
}else{dX=dZ
}}}dT=aB(dW,dV,dX,dY,dZ);
dU._a[cl]=dT.year;
dU._dayOfYear=dT.dayOfYear
}c7.ISO_8601=function(){};
function x(dU){if(dU._f===c7.ISO_8601){d(dU);
return
}dU._a=[];
co(dU).empty=true;
var dX=""+dU._i,dW,dT,d0,dV,dZ,dS=dX.length,dY=0;
d0=cy(dU._f,dU._locale).match(v)||[];
for(dW=0;
dW<d0.length;
dW++){dV=d0[dW];
dT=(dX.match(ak(dV,dU))||[])[0];
if(dT){dZ=dX.substr(0,dX.indexOf(dT));
if(dZ.length>0){co(dU).unusedInput.push(dZ)
}dX=dX.slice(dX.indexOf(dT)+dT.length);
dY+=dT.length
}if(df[dV]){if(dT){co(dU).empty=false
}else{co(dU).unusedTokens.push(dV)
}aZ(dV,dT,dU)
}else{if(dU._strict&&!dT){co(dU).unusedTokens.push(dV)
}}}co(dU).charsLeftOver=dS-dY;
if(dX.length>0){co(dU).unusedInput.push(dX)
}if(co(dU).bigHour===true&&dU._a[ay]<=12&&dU._a[ay]>0){co(dU).bigHour=undefined
}dU._a[ay]=bW(dU._locale,dU._a[ay],dU._meridiem);
P(dU);
cr(dU)
}function bW(dS,dU,dV){var dT;
if(dV==null){return dU
}if(dS.meridiemHour!=null){return dS.meridiemHour(dU,dV)
}else{if(dS.isPM!=null){dT=dS.isPM(dV);
if(dT&&dU<12){dU+=12
}if(!dT&&dU===12){dU=0
}return dU
}else{return dU
}}}function w(dS){var dW,dU,dV,dT,dX;
if(dS._f.length===0){co(dS).invalidFormat=true;
dS._d=new Date(NaN);
return
}for(dT=0;
dT<dS._f.length;
dT++){dX=0;
dW=q({},dS);
if(dS._useUTC!=null){dW._useUTC=dS._useUTC
}dW._f=dS._f[dT];
x(dW);
if(!b(dW)){continue
}dX+=co(dW).charsLeftOver;
dX+=co(dW).unusedTokens.length*10;
co(dW).score=dX;
if(dV==null||dX<dV){dV=dX;
dU=dW
}}cD(dS,dU||dW)
}function ci(dS){if(dS._d){return
}var dT=cF(dS._i);
dS._a=[dT.year,dT.month,dT.day||dT.date,dT.hour,dT.minute,dT.second,dT.millisecond];
P(dS)
}function cd(dT){var dS=dT._i,dV=dT._f,dU;
dT._locale=dT._locale||n(dT._l);
if(dS===null||(dV===undefined&&dS==="")){return bT({nullInput:true})
}if(typeof dS==="string"){dT._i=dS=dT._locale.preparse(dS)
}if(bO(dS)){return new bA(cr(dS))
}else{if(bq(dV)){w(dT)
}else{if(dV){x(dT)
}else{if(aJ(dS)){dT._d=dS
}else{bm(dT)
}}}}dU=new bA(cr(dT));
if(dU._nextDay){dU.add(1,"d");
dU._nextDay=undefined
}return dU
}function bm(dT){var dS=dT._i;
if(dS===undefined){dT._d=new Date()
}else{if(aJ(dS)){dT._d=new Date(+dS)
}else{if(typeof dS==="string"){bp(dT)
}else{if(bq(dS)){dT._a=a1(dS.slice(0),function(dU){return parseInt(dU,10)
});
P(dT)
}else{if(typeof(dS)==="object"){ci(dT)
}else{if(typeof(dS)==="number"){dT._d=new Date(dS)
}else{c7.createFromInputFallback(dT)
}}}}}}}function c0(dV,dW,dS,dU,dT){var dX={};
if(typeof(dS)==="boolean"){dU=dS;
dS=undefined
}dX._isAMomentObject=true;
dX._useUTC=dX._isUTC=dT;
dX._l=dS;
dX._i=dV;
dX._f=dW;
dX._strict=dU;
return cd(dX)
}function bS(dU,dV,dS,dT){return c0(dU,dV,dS,dT,false)
}var aI=cG("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var dS=bS.apply(null,arguments);
return dS<this?this:dS
});
var dF=cG("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var dS=bS.apply(null,arguments);
return dS>this?this:dS
});
function bR(dU,dV){var dT,dS;
if(dV.length===1&&bq(dV[0])){dV=dV[0]
}if(!dV.length){return bS()
}dT=dV[0];
for(dS=1;
dS<dV.length;
++dS){if(dV[dS][dU](dT)){dT=dV[dS]
}}return dT
}function cz(){var dS=[].slice.call(arguments,0);
return bR("isBefore",dS)
}function aT(){var dS=[].slice.call(arguments,0);
return bR("isAfter",dS)
}function ad(dX){var dZ=cF(dX),dY=dZ.year||0,dT=dZ.quarter||0,dU=dZ.month||0,dS=dZ.week||0,d2=dZ.day||0,d0=dZ.hour||0,dW=dZ.minute||0,d1=dZ.second||0,dV=dZ.millisecond||0;
this._milliseconds=+dV+d1*1000+dW*60000+d0*3600000;
this._days=+d2+dS*7;
this._months=+dU+dT*3+dY*12;
this._data={};
this._locale=n();
this._bubble()
}function J(dS){return dS instanceof ad
}function dz(dS,dT){a2(dS,0,0,function(){var dV=this.utcOffset();
var dU="+";
if(dV<0){dV=-dV;
dU="-"
}return dU+R(~~(dV/60),2)+dT+R(~~(dV)%60,2)
})
}dz("Z",":");
dz("ZZ","");
j("Z",dM);
j("ZZ",dM);
b6(["Z","ZZ"],function(dS,dU,dT){dT._useUTC=true;
dT._tzm=bw(dS)
});
var br=/([\+\-]|\d\d)/gi;
function bw(dT){var dV=((dT||"").match(dM)||[]);
var dS=dV[dV.length-1]||[];
var dW=(dS+"").match(br)||["-",0,0];
var dU=+(dW[1]*60)+dK(dW[2]);
return dW[0]==="+"?dU:-dU
}function B(dS,dT){var dU,dV;
if(dT._isUTC){dU=dT.clone();
dV=(bO(dS)||aJ(dS)?+dS:+bS(dS))-(+dU);
dU._d.setTime(+dU._d+dV);
c7.updateOffset(dU,false);
return dU
}else{return bS(dS).local()
}return dT._isUTC?bS(dS).zone(dT._offset||0):bS(dS).local()
}function a(dS){return -Math.round(dS._d.getTimezoneOffset()/15)*15
}c7.updateOffset=function(){};
function cg(dS,dV){var dU=this._offset||0,dT;
if(dS!=null){if(typeof dS==="string"){dS=bw(dS)
}if(Math.abs(dS)<16){dS=dS*60
}if(!this._isUTC&&dV){dT=a(this)
}this._offset=dS;
this._isUTC=true;
if(dT!=null){this.add(dT,"m")
}if(dU!==dS){if(!dV||this._changeInProgress){m(this,cW(dS-dU,"m"),1,false)
}else{if(!this._changeInProgress){this._changeInProgress=true;
c7.updateOffset(this,true);
this._changeInProgress=null
}}}return this
}else{return this._isUTC?dU:a(this)
}}function ax(dS,dT){if(dS!=null){if(typeof dS!=="string"){dS=-dS
}this.utcOffset(dS,dT);
return this
}else{return -this.utcOffset()
}}function f(dS){return this.utcOffset(0,dS)
}function bl(dS){if(this._isUTC){this.utcOffset(0,dS);
this._isUTC=false;
if(dS){this.subtract(a(this),"m")
}}return this
}function bz(){if(this._tzm){this.utcOffset(this._tzm)
}else{if(typeof this._i==="string"){this.utcOffset(bw(this._i))
}}return this
}function cb(dS){if(!dS){dS=0
}else{dS=bS(dS).utcOffset()
}return(this.utcOffset()-dS)%60===0
}function cf(){return(this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset())
}function c1(){if(this._a){var dS=this._isUTC?G(this._a):bS(this._a);
return this.isValid()&&K(this._a,dS.toArray())>0
}return false
}function a6(){return !this._isUTC
}function bK(){return this._isUTC
}function a5(){return this._isUTC&&this._offset===0
}var aM=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;
var aH=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
function cW(dU,dX){var dY=dU,dW=null,dT,dV,dS;
if(J(dU)){dY={ms:dU._milliseconds,d:dU._days,M:dU._months}
}else{if(typeof dU==="number"){dY={};
if(dX){dY[dX]=dU
}else{dY.milliseconds=dU
}}else{if(!!(dW=aM.exec(dU))){dT=(dW[1]==="-")?-1:1;
dY={y:0,d:dK(dW[ce])*dT,h:dK(dW[ay])*dT,m:dK(dW[dg])*dT,s:dK(dW[cA])*dT,ms:dK(dW[dI])*dT}
}else{if(!!(dW=aH.exec(dU))){dT=(dW[1]==="-")?-1:1;
dY={y:bU(dW[2],dT),M:bU(dW[3],dT),d:bU(dW[4],dT),h:bU(dW[5],dT),m:bU(dW[6],dT),s:bU(dW[7],dT),w:bU(dW[8],dT)}
}else{if(dY==null){dY={}
}else{if(typeof dY==="object"&&("from" in dY||"to" in dY)){dS=aV(bS(dY.from),bS(dY.to));
dY={};
dY.ms=dS.milliseconds;
dY.M=dS.months
}}}}}}dV=new ad(dY);
if(J(dU)&&a7(dU,"_locale")){dV._locale=dU._locale
}return dV
}cW.fn=ad.prototype;
function bU(dU,dS){var dT=dU&&parseFloat(dU.replace(",","."));
return(isNaN(dT)?0:dT)*dS
}function di(dU,dS){var dT={milliseconds:0,months:0};
dT.months=dS.month()-dU.month()+(dS.year()-dU.year())*12;
if(dU.clone().add(dT.months,"M").isAfter(dS)){--dT.months
}dT.milliseconds=+dS-+(dU.clone().add(dT.months,"M"));
return dT
}function aV(dU,dS){var dT;
dS=B(dS,dU);
if(dU.isBefore(dS)){dT=di(dU,dS)
}else{dT=di(dS,dU);
dT.milliseconds=-dT.milliseconds;
dT.months=-dT.months
}return dT
}function bk(dT,dS){return function(dX,dW){var dV,dU;
if(dW!==null&&!isNaN(+dW)){ch(dS,"moment()."+dS+"(period, number) is deprecated. Please use moment()."+dS+"(number, period).");
dU=dX;
dX=dW;
dW=dU
}dX=typeof dX==="string"?+dX:dX;
dV=cW(dX,dW);
m(this,dV,dT);
return this
}
}function m(dU,dX,dW,dV){var dT=dX._milliseconds,dY=dX._days,dS=dX._months;
dV=dV==null?true:dV;
if(dT){dU._d.setTime(+dU._d+dT*dW)
}if(dY){L(dU,"Date",ap(dU,"Date")+dY*dW)
}if(dS){ds(dU,ap(dU,"Month")+dS*dW)
}if(dV){c7.updateOffset(dU,dY||dS)
}}var V=bk(1,"add");
var bN=bk(-1,"subtract");
function ai(dW){var dT=dW||bS(),dS=B(dT,this).startOf("day"),dV=this.diff(dS,"days",true),dU=dV<-6?"sameElse":dV<-1?"lastWeek":dV<0?"lastDay":dV<1?"sameDay":dV<2?"nextDay":dV<7?"nextWeek":"sameElse";
return this.format(this.localeData().calendar(dU,this,bS(dT)))
}function cU(){return new bA(this)
}function bJ(dT,dS){var dU;
dS=Y(typeof dS!=="undefined"?dS:"millisecond");
if(dS==="millisecond"){dT=bO(dT)?dT:bS(dT);
return +this>+dT
}else{dU=bO(dT)?+dT:+bS(dT);
return dU<+this.clone().startOf(dS)
}}function b8(dT,dS){var dU;
dS=Y(typeof dS!=="undefined"?dS:"millisecond");
if(dS==="millisecond"){dT=bO(dT)?dT:bS(dT);
return +this<+dT
}else{dU=bO(dT)?+dT:+bS(dT);
return +this.clone().endOf(dS)<dU
}}function bI(dU,dT,dS){return this.isAfter(dU,dS)&&this.isBefore(dT,dS)
}function F(dT,dS){var dU;
dS=Y(dS||"millisecond");
if(dS==="millisecond"){dT=bO(dT)?dT:bS(dT);
return +this===+dT
}else{dU=+bS(dT);
return +(this.clone().startOf(dS))<=dU&&dU<=+(this.clone().endOf(dS))
}}function by(dS){if(dS<0){return Math.ceil(dS)
}else{return Math.floor(dS)
}}function cq(dV,dU,dS){var dX=B(dV,this),dW=(dX.utcOffset()-this.utcOffset())*60000,dY,dT;
dU=Y(dU);
if(dU==="year"||dU==="month"||dU==="quarter"){dT=cB(this,dX);
if(dU==="quarter"){dT=dT/3
}else{if(dU==="year"){dT=dT/12
}}}else{dY=this-dX;
dT=dU==="second"?dY/1000:dU==="minute"?dY/60000:dU==="hour"?dY/3600000:dU==="day"?(dY-dW)/86400000:dU==="week"?(dY-dW)/604800000:dY
}return dS?dT:by(dT)
}function cB(dT,dS){var dX=((dS.year()-dT.year())*12)+(dS.month()-dT.month()),dU=dT.clone().add(dX,"months"),dV,dW;
if(dS-dU<0){dV=dT.clone().add(dX-1,"months");
dW=(dS-dU)/(dU-dV)
}else{dV=dT.clone().add(dX+1,"months");
dW=(dS-dU)/(dV-dU)
}return -(dX+dW)
}c7.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";
function E(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
}function ct(){var dS=this.clone().utc();
if(0<dS.year()&&dS.year()<=9999){if("function"===typeof Date.prototype.toISOString){return this.toDate().toISOString()
}else{return g(dS,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
}}else{return g(dS,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
}}function i(dT){var dS=g(this,dT||c7.defaultFormat);
return this.localeData().postformat(dS)
}function cP(dT,dS){if(!this.isValid()){return this.localeData().invalidDate()
}return cW({to:this,from:dT}).locale(this.locale()).humanize(!dS)
}function bb(dS){return this.from(bS(),dS)
}function aF(dT,dS){if(!this.isValid()){return this.localeData().invalidDate()
}return cW({from:this,to:dT}).locale(this.locale()).humanize(!dS)
}function aQ(dS){return this.to(bS(),dS)
}function bX(dT){var dS;
if(dT===undefined){return this._locale._abbr
}else{dS=n(dT);
if(dS!=null){this._locale=dS
}return this
}}var c8=cG("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(dS){if(dS===undefined){return this.localeData()
}else{return this.locale(dS)
}});
function bH(){return this._locale
}function dq(dS){dS=Y(dS);
switch(dS){case"year":this.month(0);
case"quarter":case"month":this.date(1);
case"week":case"isoWeek":case"day":this.hours(0);
case"hour":this.minutes(0);
case"minute":this.seconds(0);
case"second":this.milliseconds(0)
}if(dS==="week"){this.weekday(0)
}if(dS==="isoWeek"){this.isoWeekday(1)
}if(dS==="quarter"){this.month(Math.floor(this.month()/3)*3)
}return this
}function cL(dS){dS=Y(dS);
if(dS===undefined||dS==="millisecond"){return this
}return this.startOf(dS).add(1,(dS==="isoWeek"?"week":dS)).subtract(1,"ms")
}function bF(){return +this._d-((this._offset||0)*60000)
}function bG(){return Math.floor(+this/1000)
}function aA(){return this._offset?new Date(+this):this._d
}function I(){var dS=this;
return[dS.year(),dS.month(),dS.date(),dS.hour(),dS.minute(),dS.second(),dS.millisecond()]
}function cv(){return b(this)
}function e(){return cD({},co(this))
}function bd(){return co(this).overflow
}a2(0,["gg",2],0,function(){return this.weekYear()%100
});
a2(0,["GG",2],0,function(){return this.isoWeekYear()%100
});
function af(dT,dS){a2(0,[dT,dT.length],0,dS)
}af("gggg","weekYear");
af("ggggg","weekYear");
af("GGGG","isoWeekYear");
af("GGGGG","isoWeekYear");
dH("weekYear","gg");
dH("isoWeekYear","GG");
j("G",dL);
j("g",dL);
j("GG",cs,dA);
j("gg",cs,dA);
j("GGGG",cm,dx);
j("gggg",cm,dx);
j("GGGGG",ck,dw);
j("ggggg",ck,dw);
dQ(["gggg","ggggg","GGGG","GGGGG"],function(dS,dV,dT,dU){dV[dU.substr(0,2)]=dK(dS)
});
dQ(["gg","GG"],function(dS,dV,dT,dU){dV[dU]=c7.parseTwoDigitYear(dS)
});
function am(dS,dU,dT){return dR(bS([dS,11,31+dU-dT]),dU,dT).week
}function cI(dS){var dT=dR(this,this.localeData()._week.dow,this.localeData()._week.doy).year;
return dS==null?dT:this.add((dS-dT),"y")
}function cE(dS){var dT=dR(this,1,4).year;
return dS==null?dT:this.add((dS-dT),"y")
}function dP(){return am(this.year(),1,4)
}function c5(){var dS=this.localeData()._week;
return am(this.year(),dS.dow,dS.doy)
}a2("Q",0,0,"quarter");
dH("quarter","Q");
j("Q",dB);
b6("Q",function(dS,dT){dT[cx]=(dK(dS)-1)*3
});
function bQ(dS){return dS==null?Math.ceil((this.month()+1)/3):this.month((dS-1)*3+this.month()%3)
}a2("D",["DD",2],"Do","date");
dH("date","D");
j("D",cs);
j("DD",cs,dA);
j("Do",function(dT,dS){return dT?dS._ordinalParse:dS._ordinalParseLenient
});
b6(["D","DD"],ce);
b6("Do",function(dS,dT){dT[ce]=dK(dS.match(cs)[0],10)
});
var H=b0("Date",true);
a2("d",0,"do","day");
a2("dd",0,0,function(dS){return this.localeData().weekdaysMin(this,dS)
});
a2("ddd",0,0,function(dS){return this.localeData().weekdaysShort(this,dS)
});
a2("dddd",0,0,function(dS){return this.localeData().weekdays(this,dS)
});
a2("e",0,0,"weekday");
a2("E",0,0,"isoWeekday");
dH("day","d");
dH("weekday","e");
dH("isoWeekday","E");
j("d",cs);
j("e",cs);
j("E",cs);
j("dd",A);
j("ddd",A);
j("dddd",A);
dQ(["dd","ddd","dddd"],function(dS,dU,dT){var dV=dT._locale.weekdaysParse(dS);
if(dV!=null){dU.d=dV
}else{co(dT).invalidWeekday=dS
}});
dQ(["d","e","E"],function(dS,dV,dT,dU){dV[dU]=dK(dS)
});
function c4(dT,dS){if(typeof dT==="string"){if(!isNaN(dT)){dT=parseInt(dT,10)
}else{dT=dS.weekdaysParse(dT);
if(typeof dT!=="number"){return null
}}}return dT
}var al="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");
function bM(dS){return this._weekdays[dS.day()]
}var u="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
function D(dS){return this._weekdaysShort[dS.day()]
}var cT="Su_Mo_Tu_We_Th_Fr_Sa".split("_");
function z(dS){return this._weekdaysMin[dS.day()]
}function dh(dV){var dS,dU,dT;
if(!this._weekdaysParse){this._weekdaysParse=[]
}for(dS=0;
dS<7;
dS++){if(!this._weekdaysParse[dS]){dU=bS([2000,1]).day(dS);
dT="^"+this.weekdays(dU,"")+"|^"+this.weekdaysShort(dU,"")+"|^"+this.weekdaysMin(dU,"");
this._weekdaysParse[dS]=new RegExp(dT.replace(".",""),"i")
}if(this._weekdaysParse[dS].test(dV)){return dS
}}}function cV(dT){var dS=this._isUTC?this._d.getUTCDay():this._d.getDay();
if(dT!=null){dT=c4(dT,this.localeData());
return this.add(dT-dS,"d")
}else{return dS
}}function aL(dS){var dT=(this.day()+7-this.localeData()._week.dow)%7;
return dS==null?dT:this.add(dS-dT,"d")
}function bt(dS){return dS==null?this.day()||7:this.day(this.day()%7?dS:dS-7)
}a2("H",["HH",2],0,"hour");
a2("h",["hh",2],0,function(){return this.hours()%12||12
});
function p(dS,dT){a2(dS,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),dT)
})
}p("a",true);
p("A",false);
dH("hour","h");
function cw(dT,dS){return dS._meridiemParse
}j("a",cw);
j("A",cw);
j("H",cs);
j("h",cs);
j("HH",cs,dA);
j("hh",cs,dA);
b6(["H","HH"],ay);
b6(["a","A"],function(dS,dU,dT){dT._isPm=dT._locale.isPM(dS);
dT._meridiem=dS
});
b6(["h","hh"],function(dS,dU,dT){dU[ay]=dK(dS);
co(dT).bigHour=true
});
function bh(dS){return((dS+"").toLowerCase().charAt(0)==="p")
}var dp=/[ap]\.?m?\.?/i;
function c(dS,dT,dU){if(dS>11){return dU?"pm":"PM"
}else{return dU?"am":"AM"
}}var cM=b0("Hours",true);
a2("m",["mm",2],0,"minute");
dH("minute","m");
j("m",cs);
j("mm",cs,dA);
b6(["m","mm"],dg);
var db=b0("Minutes",false);
a2("s",["ss",2],0,"second");
dH("second","s");
j("s",cs);
j("ss",cs,dA);
b6(["s","ss"],cA);
var cn=b0("Seconds",false);
a2("S",0,0,function(){return ~~(this.millisecond()/100)
});
a2(0,["SS",2],0,function(){return ~~(this.millisecond()/10)
});
function ca(dS){a2(0,[dS,3],0,"millisecond")
}ca("SSS");
ca("SSSS");
dH("millisecond","ms");
j("S",cp,dB);
j("SS",cp,dA);
j("SSS",cp,dy);
j("SSSS",aD);
b6(["S","SS","SSS","SSSS"],function(dS,dT){dT[dI]=dK(("0."+dS)*1000)
});
var aq=b0("Milliseconds",false);
a2("z",0,0,"zoneAbbr");
a2("zz",0,0,"zoneName");
function O(){return this._isUTC?"UTC":""
}function b5(){return this._isUTC?"Coordinated Universal Time":""
}var dN=bA.prototype;
dN.add=V;
dN.calendar=ai;
dN.clone=cU;
dN.diff=cq;
dN.endOf=cL;
dN.format=i;
dN.from=cP;
dN.fromNow=bb;
dN.to=aF;
dN.toNow=aQ;
dN.get=bo;
dN.invalidAt=bd;
dN.isAfter=bJ;
dN.isBefore=b8;
dN.isBetween=bI;
dN.isSame=F;
dN.isValid=cv;
dN.lang=c8;
dN.locale=bX;
dN.localeData=bH;
dN.max=dF;
dN.min=aI;
dN.parsingFlags=e;
dN.set=bo;
dN.startOf=dq;
dN.subtract=bN;
dN.toArray=I;
dN.toDate=aA;
dN.toISOString=ct;
dN.toJSON=ct;
dN.toString=E;
dN.unix=bG;
dN.valueOf=bF;
dN.year=T;
dN.isLeapYear=cQ;
dN.weekYear=cI;
dN.isoWeekYear=cE;
dN.quarter=dN.quarters=bQ;
dN.month=o;
dN.daysInMonth=aS;
dN.week=dN.weeks=bi;
dN.isoWeek=dN.isoWeeks=dv;
dN.weeksInYear=c5;
dN.isoWeeksInYear=dP;
dN.date=H;
dN.day=dN.days=cV;
dN.weekday=aL;
dN.isoWeekday=bt;
dN.dayOfYear=bL;
dN.hour=dN.hours=cM;
dN.minute=dN.minutes=db;
dN.second=dN.seconds=cn;
dN.millisecond=dN.milliseconds=aq;
dN.utcOffset=cg;
dN.utc=f;
dN.local=bl;
dN.parseZone=bz;
dN.hasAlignedHourOffset=cb;
dN.isDST=cf;
dN.isDSTShifted=c1;
dN.isLocal=a6;
dN.isUtcOffset=bK;
dN.isUtc=a5;
dN.isUTC=a5;
dN.zoneAbbr=O;
dN.zoneName=b5;
dN.dates=cG("dates accessor is deprecated. Use date instead.",H);
dN.months=cG("months accessor is deprecated. Use month instead",o);
dN.years=cG("years accessor is deprecated. Use year instead",T);
dN.zone=cG("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",ax);
var aP=dN;
function bC(dS){return bS(dS*1000)
}function aY(){return bS.apply(null,arguments).parseZone()
}var aC={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"};
function bs(dU,dV,dT){var dS=this._calendar[dU];
return typeof dS==="function"?dS.call(dV,dT):dS
}var ar={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"};
function b9(dT){var dS=this._longDateFormat[dT];
if(!dS&&this._longDateFormat[dT.toUpperCase()]){dS=this._longDateFormat[dT.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(dU){return dU.slice(1)
});
this._longDateFormat[dT]=dS
}return dS
}var ah="Invalid date";
function cN(){return this._invalidDate
}var be="%d";
var dn=/\d{1,2}/;
function aw(dS){return this._ordinal.replace("%d",dS)
}function t(dS){return dS
}var c3={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};
function dd(dV,dU,dT,dW){var dS=this._relativeTime[dT];
return(typeof dS==="function")?dS(dV,dU,dT,dW):dS.replace(/%d/i,dV)
}function c2(dU,dS){var dT=this._relativeTime[dU>0?"future":"past"];
return typeof dT==="function"?dT(dS):dT.replace(/%s/i,dS)
}function dJ(dS){var dU,dT;
for(dT in dS){dU=dS[dT];
if(typeof dU==="function"){this[dT]=dU
}else{this["_"+dT]=dU
}}this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+(/\d{1,2}/).source)
}var bn=aG.prototype;
bn._calendar=aC;
bn.calendar=bs;
bn._longDateFormat=ar;
bn.longDateFormat=b9;
bn._invalidDate=ah;
bn.invalidDate=cN;
bn._ordinal=be;
bn.ordinal=aw;
bn._ordinalParse=dn;
bn.preparse=t;
bn.postformat=t;
bn._relativeTime=c3;
bn.relativeTime=dd;
bn.pastFuture=c2;
bn.set=dJ;
bn.months=cu;
bn._months=dO;
bn.monthsShort=cJ;
bn._monthsShort=bv;
bn.monthsParse=bE;
bn.week=cZ;
bn._week=bu;
bn.firstDayOfYear=s;
bn.firstDayOfWeek=aK;
bn.weekdays=bM;
bn._weekdays=al;
bn.weekdaysMin=z;
bn._weekdaysMin=cT;
bn.weekdaysShort=D;
bn._weekdaysShort=u;
bn.weekdaysParse=dh;
bn.isPM=bh;
bn._meridiemParse=dp;
bn.meridiem=c;
function bf(dW,dT,dV,dX){var dS=n();
var dU=G().set(dX,dT);
return dS[dV](dU,dW)
}function aN(dX,dT,dW,dV,dY){if(typeof dX==="number"){dT=dX;
dX=undefined
}dX=dX||"";
if(dT!=null){return bf(dX,dT,dW,dY)
}var dU;
var dS=[];
for(dU=0;
dU<dV;
dU++){dS[dU]=bf(dX,dU,dW,dY)
}return dS
}function av(dT,dS){return aN(dT,dS,"months",12,"month")
}function bx(dT,dS){return aN(dT,dS,"monthsShort",12,"month")
}function c6(dT,dS){return aN(dT,dS,"weekdays",7,"day")
}function dj(dT,dS){return aN(dT,dS,"weekdaysShort",7,"day")
}function cY(dT,dS){return aN(dT,dS,"weekdaysMin",7,"day")
}dm("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(dU){var dS=dU%10,dT=(dK(dU%100/10)===1)?"th":(dS===1)?"st":(dS===2)?"nd":(dS===3)?"rd":"th";
return dU+dT
}});
c7.lang=cG("moment.lang is deprecated. Use moment.locale instead.",dm);
c7.langData=cG("moment.langData is deprecated. Use moment.localeData instead.",n);
var h=Math.abs;
function bB(){var dS=this._data;
this._milliseconds=h(this._milliseconds);
this._days=h(this._days);
this._months=h(this._months);
dS.milliseconds=h(dS.milliseconds);
dS.seconds=h(dS.seconds);
dS.minutes=h(dS.minutes);
dS.hours=h(dS.hours);
dS.months=h(dS.months);
dS.years=h(dS.years);
return this
}function cO(dW,dT,dU,dV){var dS=cW(dT,dU);
dW._milliseconds+=dV*dS._milliseconds;
dW._days+=dV*dS._days;
dW._months+=dV*dS._months;
return dW._bubble()
}function bP(dS,dT){return cO(this,dS,dT,1)
}function b2(dS,dT){return cO(this,dS,dT,-1)
}function bV(){var dU=this._milliseconds;
var dZ=this._days;
var dS=this._months;
var dX=this._data;
var dY,dW,dT,dV=0;
dX.milliseconds=dU%1000;
dY=by(dU/1000);
dX.seconds=dY%60;
dW=by(dY/60);
dX.minutes=dW%60;
dT=by(dW/60);
dX.hours=dT%24;
dZ+=by(dT/24);
dV=by(dC(dZ));
dZ-=by(ao(dV));
dS+=by(dZ/30);
dZ%=30;
dV+=by(dS/12);
dS%=12;
dX.days=dZ;
dX.months=dS;
dX.years=dV;
return this
}function dC(dS){return dS*400/146097
}function ao(dS){return dS*146097/400
}function da(dT){var dV;
var dS;
var dU=this._milliseconds;
dT=Y(dT);
if(dT==="month"||dT==="year"){dV=this._days+dU/86400000;
dS=this._months+dC(dV)*12;
return dT==="month"?dS:dS/12
}else{dV=this._days+Math.round(ao(this._months/12));
switch(dT){case"week":return dV/7+dU/604800000;
case"day":return dV+dU/86400000;
case"hour":return dV*24+dU/3600000;
case"minute":return dV*1440+dU/60000;
case"second":return dV*86400+dU/1000;
case"millisecond":return Math.floor(dV*86400000)+dU;
default:throw new Error("Unknown unit "+dT)
}}}function aX(){return(this._milliseconds+this._days*86400000+(this._months%12)*2592000000+dK(this._months/12)*31536000000)
}function dD(dS){return function(){return this.as(dS)
}
}var r=dD("ms");
var y=dD("s");
var a0=dD("m");
var C=dD("h");
var cX=dD("d");
var bg=dD("w");
var U=dD("M");
var aO=dD("y");
function ae(dS){dS=Y(dS);
return this[dS+"s"]()
}function cS(dS){return function(){return this._data[dS]
}
}var aU=cS("milliseconds");
var ac=cS("seconds");
var a9=cS("minutes");
var b4=cS("hours");
var W=cS("days");
var c9=cS("months");
var dc=cS("years");
function dG(){return by(this.days()/7)
}var S=Math.round;
var bc={s:45,m:45,h:22,d:26,M:11};
function dt(dT,dV,dU,dW,dS){return dS.relativeTime(dV||1,!!dU,dT,dW)
}function at(dW,dT,d0){var dU=cW(dW).abs();
var d1=S(dU.as("s"));
var dV=S(dU.as("m"));
var dZ=S(dU.as("h"));
var d2=S(dU.as("d"));
var dS=S(dU.as("M"));
var dX=S(dU.as("y"));
var dY=d1<bc.s&&["s",d1]||dV===1&&["m"]||dV<bc.m&&["mm",dV]||dZ===1&&["h"]||dZ<bc.h&&["hh",dZ]||d2===1&&["d"]||d2<bc.d&&["dd",d2]||dS===1&&["M"]||dS<bc.M&&["MM",dS]||dX===1&&["y"]||["yy",dX];
dY[2]=dT;
dY[3]=+dW>0;
dY[4]=d0;
return dt.apply(null,dY)
}function aj(dS,dT){if(bc[dS]===undefined){return false
}if(dT===undefined){return bc[dS]
}bc[dS]=dT;
return true
}function bZ(dU){var dS=this.localeData();
var dT=at(this,!dU,dS);
if(dU){dT=dS.pastFuture(+this,dT)
}return dS.postformat(dT)
}var b7=Math.abs;
function N(){var dX=b7(this.years());
var dY=b7(this.months());
var dW=b7(this.days());
var dU=b7(this.hours());
var dS=b7(this.minutes());
var dT=b7(this.seconds()+this.milliseconds()/1000);
var dV=this.asSeconds();
if(!dV){return"P0D"
}return(dV<0?"-":"")+"P"+(dX?dX+"Y":"")+(dY?dY+"M":"")+(dW?dW+"D":"")+((dU||dS||dT)?"T":"")+(dU?dU+"H":"")+(dS?dS+"M":"")+(dT?dT+"S":"")
}var aa=ad.prototype;
aa.abs=bB;
aa.add=bP;
aa.subtract=b2;
aa.as=da;
aa.asMilliseconds=r;
aa.asSeconds=y;
aa.asMinutes=a0;
aa.asHours=C;
aa.asDays=cX;
aa.asWeeks=bg;
aa.asMonths=U;
aa.asYears=aO;
aa.valueOf=aX;
aa._bubble=bV;
aa.get=ae;
aa.milliseconds=aU;
aa.seconds=ac;
aa.minutes=a9;
aa.hours=b4;
aa.days=W;
aa.weeks=dG;
aa.months=c9;
aa.years=dc;
aa.humanize=bZ;
aa.toISOString=N;
aa.toString=N;
aa.toJSON=N;
aa.locale=bX;
aa.localeData=bH;
aa.toIsoString=cG("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",N);
aa.lang=c8;
a2("X",0,0,"unix");
a2("x",0,0,"valueOf");
j("x",dL);
j("X",Q);
b6("X",function(dS,dU,dT){dT._d=new Date(parseFloat(dS,10)*1000)
});
b6("x",function(dS,dU,dT){dT._d=new Date(dK(dS))
});
c7.version="2.10.3";
aW(bS);
c7.fn=aP;
c7.min=cz;
c7.max=aT;
c7.utc=G;
c7.unix=bC;
c7.months=av;
c7.isDate=aJ;
c7.locale=dm;
c7.invalid=bT;
c7.duration=cW;
c7.isMoment=bO;
c7.weekdays=c6;
c7.parseZone=aY;
c7.localeData=n;
c7.isDuration=J;
c7.monthsShort=bx;
c7.weekdaysMin=cY;
c7.defineLocale=k;
c7.weekdaysShort=dj;
c7.normalizeUnits=Y;
c7.relativeTimeThreshold=aj;
var cc=c7;
return cc
}));
(function(d,e){var c="datepicker";
var a="plugin_"+c;
e.locale("en");
function b(g,f){this.currentView=0;
this.minDate;
this.maxDate;
this._attachedEvents=[];
this.element=g;
this.$element=d(g);
this.params={date:true,time:false,format:"DD/MM/YYYY",minDate:null,maxDate:null,currentDate:null,lang:"en",weekStart:0,shortTime:false,clearButton:false,nowButton:false,cancelText:"Cancel",okText:"OK",clearText:"Clear",nowText:"Today",switchOnClick:false};
this.params=d.fn.extend(this.params,f);
this.name="dtp_"+this.setName();
this.$element.attr("data-dtp",this.name);
e.locale(this.params.lang);
this.init()
}d.fn[c]=function(f,g){this.each(function(){if(!d.data(this,a)){d.data(this,a,new b(this,f))
}else{if(typeof(d.data(this,a)[f])==="function"){d.data(this,a)[f](g)
}if(f==="destroy"){delete d.data(this,a)
}}});
return this
};
b.prototype={init:function(){this.initDays();
this.initDates();
this.initTemplate();
this.initButtons();
this._attachEvent(d(window),"resize",this._centerBox.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-content"),"click",this._onElementClick.bind(this));
this._attachEvent(this.$dtpElement,"click",this._onBackgroundClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-close > a"),"click",this._onCloseClick.bind(this));
this._attachEvent(this.$element,"openDPicker",this._onFocus.bind(this))
},initDays:function(){this.days=[];
for(var f=this.params.weekStart;
this.days.length<7;
f++){if(f>6){f=0
}this.days.push(f.toString())
}},initDates:function(){if(this.$element.val().length>0){if(typeof(this.params.format)!=="undefined"&&this.params.format!==null){this.currentDate=e(this.$element.val(),this.params.format).locale(this.params.lang)
}else{this.currentDate=e(this.$element.val()).locale(this.params.lang)
}}else{if(typeof(this.$element.attr("value"))!=="undefined"&&this.$element.attr("value")!==null&&this.$element.attr("value")!==""){if(typeof(this.$element.attr("value"))==="string"){if(typeof(this.params.format)!=="undefined"&&this.params.format!==null){this.currentDate=e(this.$element.attr("value"),this.params.format).locale(this.params.lang)
}else{this.currentDate=e(this.$element.attr("value")).locale(this.params.lang)
}}}else{if(typeof(this.params.currentDate)!=="undefined"&&this.params.currentDate!==null){if(typeof(this.params.currentDate)==="string"){if(typeof(this.params.format)!=="undefined"&&this.params.format!==null){this.currentDate=e(this.params.currentDate,this.params.format).locale(this.params.lang)
}else{this.currentDate=e(this.params.currentDate).locale(this.params.lang)
}}else{if(typeof(this.params.currentDate.isValid)==="undefined"||typeof(this.params.currentDate.isValid)!=="function"){var f=this.params.currentDate.getTime();
this.currentDate=e(f,"x").locale(this.params.lang)
}else{this.currentDate=this.params.currentDate
}}this.$element.val(this.currentDate.format(this.params.format))
}else{this.currentDate=e()
}}}if(typeof(this.params.minDate)!=="undefined"&&this.params.minDate!==null){if(typeof(this.params.minDate)==="string"){if(typeof(this.params.format)!=="undefined"&&this.params.format!==null){this.minDate=e(this.params.minDate,this.params.format).locale(this.params.lang)
}else{this.minDate=e(this.params.minDate).locale(this.params.lang)
}}else{if(typeof(this.params.minDate.isValid)==="undefined"||typeof(this.params.minDate.isValid)!=="function"){var f=this.params.minDate.getTime();
this.minDate=e(f,"x").locale(this.params.lang)
}else{this.minDate=this.params.minDate
}}}else{if(this.params.minDate===null){this.minDate=null
}}if(typeof(this.params.maxDate)!=="undefined"&&this.params.maxDate!==null){if(typeof(this.params.maxDate)==="string"){if(typeof(this.params.format)!=="undefined"&&this.params.format!==null){this.maxDate=e(this.params.maxDate,this.params.format).locale(this.params.lang)
}else{this.maxDate=e(this.params.maxDate).locale(this.params.lang)
}}else{if(typeof(this.params.maxDate.isValid)==="undefined"||typeof(this.params.maxDate.isValid)!=="function"){var f=this.params.maxDate.getTime();
this.maxDate=e(f,"x").locale(this.params.lang)
}else{this.maxDate=this.params.maxDate
}}}else{if(this.params.maxDate===null){this.maxDate=null
}}if(!this.isAfterMinDate(this.currentDate)){this.currentDate=e(this.minDate)
}if(!this.isBeforeMaxDate(this.currentDate)){this.currentDate=e(this.maxDate)
}},initMonths:function(){this.$dtpElement.find(".dtp-picker").toggleClass("hidden");
this.$dtpElement.find(".select-months").toggleClass("hidden")
},initYears:function(){var g=this.currentDate;
if(!isNaN(e(this.params.minDate,this.params.format).year())){var j=e(this.params.minDate,this.params.format).year()
}else{var j=1980
}if(!isNaN(e(this.params.maxDate,this.params.format).year())){var f=e(this.params.maxDate,this.params.format).year()
}else{var f=new Date().getFullYear()
}if(this.$dtpElement.find(".select-year").children().length>0){this.$dtpElement.find(".select-year").empty()
}for(var h=f;
h>=j;
h--){this.$dtpElement.find(".select-year").append('<div class="sel-yr-item"><button class="yr_'+h+'"><div>'+h+"</div></button></div>")
}this.$dtpElement.find(".dtp-picker").addClass("hidden");
this.$dtpElement.find(".select-months").addClass("hidden");
this.$dtpElement.find(".select-year").removeClass("hidden");
d(".sel-yr-item button").removeClass("selected");
d(".sel-yr-item button.yr_"+g.year()).addClass("selected");
this._attachEvent(this.$dtpElement.find(".sel-yr-item button"),"click",d.proxy(function(k){d(".sel-yr-item button").removeClass("selected");
d(k.currentTarget).addClass("selected");
var i=d(".sel-yr-item button.selected").attr("class").split(" ")[0].replace("yr_","");
if(g.year()>i){this.currentDate.subtract((g.year()-i),"years")
}else{this.currentDate.add((i-g.year()),"years")
}this.initDate(this.currentDate);
this.$dtpElement.find(".select-year").addClass("hidden");
this.$dtpElement.find(".select-months").addClass("hidden");
this.$dtpElement.find(".dtp-picker").removeClass("hidden")
},this))
},initTemplate:function(){this.template='<div class="dtp hidden" id="'+this.name+'"><div class="dtp-content"><div class="dtp-date-view"><div class="dtp-date hidden"><div><div class="left dtp-actual-year p80 text-left">2014</div><div class="left"><span class="dtp-actual-week">Thu</span><span class="dtp-dt-sep">,</span> <span class="dtp-actual-month">MAR </span> <span class="dtp-actual-num">13</span></div></div><div><div class="clearfix"></div></div></div><div class="dtp-time hidden"><div class="dtp-actual-maxtime">23:55</div></div><div class="dtp-picker"><div class="dtp-picker-calendar"></div><div class="dtp-picker-datetime hidden"><div class="dtp-actual-meridien"><div class="left p20"><a class="dtp-meridien-am" href="javascript:void(0);">AM</a></div><div class="dtp-actual-time p60"></div><div class="right p20"><a class="dtp-meridien-pm" href="javascript:void(0);">PM</a></div><div class="clearfix"></div></div><div class="dtp-svg-clock"></div></div></div></div><div class="select-year hidden"></div><div class="select-months hidden"><div class="left center"><span class="dtp-select-year-before"><i class="fa fa-angle-left"></i></span></div><div class="dtp-picker-year"><span class="dtp-year">2016</span><div class="right center p10"><span class="dtp-select-year-after"><i class="fa fa-angle-right"></i></span></div></div><ul class="dp-months"><li class="1">Jan</li><li class="2">Feb</li><li class="3">Mar</li><li class="4">Apr</li><li class="5">May</li><li class="6">Jun</li><li class="7">Jul</li><li class="8">Aug</li><li class="9">Sep</li><li class="10">Oct</li><li class="11">Nov</li><li class="12">Dec</li></ul></div><div class="dtp-buttons"><button class="dtp-btn-now btn btn-flat btn-sm hidden">'+this.params.nowText+'</button><button class="dtp-btn-clear btn btn-danger btn-sm hidden">'+this.params.clearText+'</button><button class="dtp-btn-cancel btn btn-default btn-sm mar-r-10">'+this.params.cancelText+'</button><button class="dtp-btn-ok btn btn-sm btn-primary">'+this.params.okText+'</button><div class="clearfix"></div></div></div></div>';
if(d("body").find("#"+this.name).length<=0){d("body").append(this.template);
if(this){this.dtpElement=d("body").find("#"+this.name)
}this.$dtpElement=d(this.dtpElement)
}},initButtons:function(){this._attachEvent(this.$dtpElement.find(".dtp-btn-cancel"),"click",this._onCancelClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-btn-ok"),"click",this._onOKClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-actual-year"),"click",this.initYears.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-select-month-before"),"click",this._onMonthBeforeClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-select-month-after"),"click",this._onMonthAfterClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-select-year-before"),"click",this._onYearBeforeClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-select-year-after"),"click",this._onYearAfterClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dp-months li"),"click",d.proxy(function(h){d(".dp-months li").removeClass("selected");
var g=d(h.currentTarget).attr("class");
d(h.currentTarget).addClass("selected");
var f=parseInt(this.currentDate.month())+1;
if(f>g){this.currentDate.subtract((f-g),"months")
}else{this.currentDate.add((g-f),"months")
}this.initDate(this.currentDate);
this.$dtpElement.find(".dtp-picker").toggleClass("hidden");
this.$dtpElement.find(".select-months").toggleClass("hidden")
},this));
if(this.params.clearButton===true){this._attachEvent(this.$dtpElement.find(".dtp-btn-clear"),"click",this._onClearClick.bind(this));
this.$dtpElement.find(".dtp-btn-clear").removeClass("hidden")
}if(this.params.nowButton===true){this._attachEvent(this.$dtpElement.find(".dtp-btn-now"),"click",this._onNowClick.bind(this));
this.$dtpElement.find(".dtp-btn-now").removeClass("hidden")
}},initMeridienButtons:function(){this.$dtpElement.find("a.dtp-meridien-am").off("click").on("click",this._onSelectAM.bind(this));
this.$dtpElement.find("a.dtp-meridien-pm").off("click").on("click",this._onSelectPM.bind(this))
},initDate:function(i){this.currentView=0;
this.$dtpElement.find(".dtp-picker-calendar").removeClass("hidden");
this.$dtpElement.find(".dtp-picker-datetime").addClass("hidden");
var f=((typeof(this.currentDate)!=="undefined"&&this.currentDate!==null)?this.currentDate:null);
var h=this.generateCalendar(this.currentDate);
if(typeof(h.week)!=="undefined"&&typeof(h.days)!=="undefined"){var g=this.constructHTMLCalendar(f,h);
this.$dtpElement.find("a.dtp-select-day").off("click");
this.$dtpElement.find(".dtp-picker-calendar").html(g);
this.$dtpElement.find("a.dtp-select-day").on("click",this._onSelectDate.bind(this));
this.toggleButtons(f);
this._attachEvent(this.$dtpElement.find(".dtp-select-month-before"),"click",this._onMonthBeforeClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-select-month-after"),"click",this._onMonthAfterClick.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-month"),"click",this.initMonths.bind(this));
this._attachEvent(this.$dtpElement.find(".dtp-year"),"click",this.initYears.bind(this))
}this._centerBox();
this.showDate(f)
},initHours:function(){this.currentView=1;
this.showTime(this.currentDate);
this.initMeridienButtons();
if(this.currentDate.hour()<12){this.$dtpElement.find("a.dtp-meridien-am").click()
}else{this.$dtpElement.find("a.dtp-meridien-pm").click()
}var g=((this.params.shortTime)?"h":"H");
this.$dtpElement.find(".dtp-picker-datetime").removeClass("hidden");
this.$dtpElement.find(".dtp-picker-calendar").addClass("hidden");
var n=this.createSVGClock(true);
for(var j=0;
j<12;
j++){var m=-(162*(Math.sin(-Math.PI*2*(j/12))));
var l=-(162*(Math.cos(-Math.PI*2*(j/12))));
var o=((this.currentDate.format(g)==j)?"#8BC34A":"transparent");
var h=((this.currentDate.format(g)==j)?"#fff":"#000");
var f=this.createSVGElement("circle",{id:"h-"+j,"class":"dtp-select-hour",style:"cursor:pointer",r:"30",cx:m,cy:l,fill:o,"data-hour":j});
var k=this.createSVGElement("text",{id:"th-"+j,"class":"dtp-select-hour-text","text-anchor":"middle",style:"cursor:pointer","font-weight":"bold","font-size":"20",x:m,y:l+7,fill:h,"data-hour":j});
k.textContent=((j===0)?((this.params.shortTime)?12:j):j);
if(!this.toggleTime(j,true)){f.className+=" disabled";
k.className+=" disabled";
k.setAttribute("fill","#bdbdbd")
}else{f.addEventListener("click",this._onSelectHour.bind(this));
k.addEventListener("click",this._onSelectHour.bind(this))
}n.appendChild(f);
n.appendChild(k)
}if(!this.params.shortTime){for(var j=0;
j<12;
j++){var m=-(110*(Math.sin(-Math.PI*2*(j/12))));
var l=-(110*(Math.cos(-Math.PI*2*(j/12))));
var o=((this.currentDate.format(g)==(j+12))?"#8BC34A":"transparent");
var h=((this.currentDate.format(g)==(j+12))?"#fff":"#000");
var f=this.createSVGElement("circle",{id:"h-"+(j+12),"class":"dtp-select-hour",style:"cursor:pointer",r:"30",cx:m,cy:l,fill:o,"data-hour":(j+12)});
var k=this.createSVGElement("text",{id:"th-"+(j+12),"class":"dtp-select-hour-text","text-anchor":"middle",style:"cursor:pointer","font-weight":"bold","font-size":"22",x:m,y:l+7,fill:h,"data-hour":(j+12)});
k.textContent=j+12;
if(!this.toggleTime(j+12,true)){f.className+=" disabled";
k.className+=" disabled";
k.setAttribute("fill","#bdbdbd")
}else{f.addEventListener("click",this._onSelectHour.bind(this));
k.addEventListener("click",this._onSelectHour.bind(this))
}n.appendChild(f);
n.appendChild(k)
}this.$dtpElement.find("a.dtp-meridien-am").addClass("hidden");
this.$dtpElement.find("a.dtp-meridien-pm").addClass("hidden")
}this._centerBox()
},initMinutes:function(){this.currentView=2;
this.showTime(this.currentDate);
this.initMeridienButtons();
if(this.currentDate.hour()<12){this.$dtpElement.find("a.dtp-meridien-am").click()
}else{this.$dtpElement.find("a.dtp-meridien-pm").click()
}this.$dtpElement.find(".dtp-picker-calendar").addClass("hidden");
this.$dtpElement.find(".dtp-picker-datetime").removeClass("hidden");
var n=this.createSVGClock(false);
for(var k=0;
k<60;
k++){var o=((k%5===0)?160:175);
var f=((k%5===0)?15:10);
var m=-(o*(Math.sin(-Math.PI*2*(k/60))));
var l=-(o*(Math.cos(-Math.PI*2*(k/60))));
var j=((this.currentDate.format("m")==k)?"#8BC34A":"transparent");
var h=this.createSVGElement("circle",{id:"m-"+k,"class":"dtp-select-minute",style:"cursor:pointer",r:f,cx:m,cy:l,fill:j,"data-minute":k});
if(!this.toggleTime(k,false)){h.className+=" disabled"
}else{h.addEventListener("click",this._onSelectMinute.bind(this))
}n.appendChild(h)
}for(var k=0;
k<60;
k++){var o=((k%5===0)?162:175);
var m=-(o*(Math.sin(-Math.PI*2*(k/60))));
var l=-(o*(Math.cos(-Math.PI*2*(k/60))));
var j=((this.currentDate.format("m")==k)?"#fff":"#000");
if((k%5)===0){var g=this.createSVGElement("text",{id:"tm-"+k,"class":"dtp-select-minute-text","text-anchor":"middle",style:"cursor:pointer","font-weight":"bold","font-size":"18",x:m,y:l+8,fill:j,"data-minute":k});
g.textContent=k
}else{var g=this.createSVGElement("text",{id:"tm-"+k,"class":"dtp-select-minute-text","text-anchor":"middle",style:"cursor:pointer","font-weight":"bold","font-size":"18",x:m,y:l,fill:j,"data-minute":k});
g.textContent="."
}if(!this.toggleTime(k,false)){g.className+=" disabled";
g.setAttribute("fill","#bdbdbd")
}else{g.addEventListener("click",this._onSelectMinute.bind(this))
}n.appendChild(g)
}this._centerBox()
},animateHands:function(){var h=this.currentDate.hour();
var i=this.currentDate.minute();
var g=this.$dtpElement.find(".hour-hand");
g[0].setAttribute("transform","rotate("+360*h/12+")");
var f=this.$dtpElement.find(".minute-hand");
f[0].setAttribute("transform","rotate("+360*i/60+")")
},createSVGClock:function(i){var g=((this.params.shortTime)?-120:-90);
var l=this.createSVGElement("svg",{"class":"svg-clock",viewBox:"0,0,400,400"});
var k=this.createSVGElement("g",{transform:"translate(200,200) "});
var f=this.createSVGElement("circle",{r:"192",fill:"#eee",stroke:"#bdbdbd","stroke-width":2});
var h=this.createSVGElement("circle",{r:"15",fill:"#757575"});
k.appendChild(f);
if(i){var j=this.createSVGElement("line",{"class":"minute-hand",x1:0,y1:0,x2:0,y2:-150,stroke:"#bdbdbd","stroke-width":2});
var m=this.createSVGElement("line",{"class":"hour-hand",x1:0,y1:0,x2:0,y2:g,stroke:"#8BC34A","stroke-width":8});
k.appendChild(j);
k.appendChild(m)
}else{var j=this.createSVGElement("line",{"class":"minute-hand",x1:0,y1:0,x2:0,y2:-150,stroke:"#8BC34A","stroke-width":2});
var m=this.createSVGElement("line",{"class":"hour-hand",x1:0,y1:0,x2:0,y2:g,stroke:"#bdbdbd","stroke-width":8});
k.appendChild(m);
k.appendChild(j)
}k.appendChild(h);
l.appendChild(k);
this.$dtpElement.find(".dtp-svg-clock").empty();
this.$dtpElement.find(".dtp-svg-clock")[0].appendChild(l);
this.animateHands();
return k
},createSVGElement:function(f,h){var i=document.createElementNS("http://www.w3.org/2000/svg",f);
for(var g in h){i.setAttribute(g,h[g])
}return i
},isAfterMinDate:function(h,j,g){var k=true;
if(typeof(this.minDate)!=="undefined"&&this.minDate!==null){var i=e(this.minDate);
var f=e(h);
if(!j&&!g){i.hour(0);
i.minute(0);
f.hour(0);
f.minute(0)
}i.second(0);
f.second(0);
i.millisecond(0);
f.millisecond(0);
if(!g){f.minute(0);
i.minute(0);
k=(parseInt(f.format("X"))>=parseInt(i.format("X")))
}else{k=(parseInt(f.format("X"))>=parseInt(i.format("X")))
}}return k
},isBeforeMaxDate:function(i,h,g){var k=true;
if(typeof(this.maxDate)!=="undefined"&&this.maxDate!==null){var j=e(this.maxDate);
var f=e(i);
if(!h&&!g){j.hour(0);
j.minute(0);
f.hour(0);
f.minute(0)
}j.second(0);
f.second(0);
j.millisecond(0);
f.millisecond(0);
if(!g){f.minute(0);
j.minute(0);
k=(parseInt(f.format("X"))<=parseInt(j.format("X")))
}else{k=(parseInt(f.format("X"))<=parseInt(j.format("X")))
}}return k
},rotateElement:function(f,g){d(f).css({WebkitTransform:"rotate("+g+"deg)","-moz-transform":"rotate("+g+"deg)"})
},showDate:function(f){if(f){this.$dtpElement.find(".dtp-actual-day").html(f.locale(this.params.lang).format("dddd"));
this.$dtpElement.find(".dtp-actual-week").html(f.locale(this.params.lang).format("ddd"));
this.$dtpElement.find(".dtp-actual-month").html(f.locale(this.params.lang).format("MMM"));
this.$dtpElement.find(".dtp-actual-num").html(f.locale(this.params.lang).format("DD"));
this.$dtpElement.find(".dtp-actual-year").html(f.locale(this.params.lang).format("YYYY"));
this.$dtpElement.find(".dtp-year").html(f.locale(this.params.lang).format("YYYY"))
}},showTime:function(f){if(f){var g=f.minute();
var h=((this.params.shortTime)?f.format("hh"):f.format("HH"))+":"+((g.toString().length==2)?g:"0"+g)+((this.params.shortTime)?" "+f.format("A"):"");
if(this.params.date){this.$dtpElement.find(".dtp-actual-time").html(h)
}else{if(this.params.shortTime){this.$dtpElement.find(".dtp-actual-day").html(f.format("A"))
}else{this.$dtpElement.find(".dtp-actual-day").html("&nbsp;")
}this.$dtpElement.find(".dtp-actual-maxtime").html(h)
}}},selectDate:function(f){if(f){this.currentDate.date(f);
this.showDate(this.currentDate);
this.$element.trigger("dateSelected",this.currentDate)
}},generateCalendar:function(g){var m={};
if(g!==null){var l=e(g).locale(this.params.lang).startOf("month");
var k=e(g).locale(this.params.lang).endOf("month");
var n=l.format("d");
m.week=this.days;
m.days=[];
for(var j=l.date();
j<=k.date();
j++){if(j===l.date()){var h=m.week.indexOf(n.toString());
if(h>0){for(var f=0;
f<h;
f++){m.days.push(0)
}}}m.days.push(e(l).locale(this.params.lang).date(j))
}}return m
},constructHTMLCalendar:function(f,j){var h="";
h+='<div class="left center"><a href="javascript:void(0);" class="dtp-select-month-before"><i class="fa fa-angle-left"></i></a></div>';
h+='<div class="dtp-picker-month"><span class="dtp-month">'+f.locale(this.params.lang).format("MMMM YYYY")+'</span><div class="right center"><a href="javascript:void(0);" class="dtp-select-month-after"><i class="fa fa-angle-right"></i></a></div>';
h+="</div>";
h+='<table class="table dtp-picker-days"><thead>';
for(var g=0;
g<j.week.length;
g++){h+="<th>"+e(parseInt(j.week[g]),"d").locale(this.params.lang).format("dd").substring(0,1)+"</th>"
}h+="</thead>";
h+="<tbody><tr>";
for(var g=0;
g<j.days.length;
g++){if(g%7==0){h+="</tr><tr>"
}h+='<td data-date="'+e(j.days[g]).locale(this.params.lang).format("D")+'">';
if(j.days[g]!=0){if(this.isBeforeMaxDate(e(j.days[g]),false,false)===false||this.isAfterMinDate(e(j.days[g]),false,false)===false){h+='<span class="dtp-select-day">'+e(j.days[g]).locale(this.params.lang).format("DD")+"</span>"
}else{if(e(j.days[g]).locale(this.params.lang).format("DD")===e(this.currentDate).locale(this.params.lang).format("DD")){h+='<a href="javascript:void(0);" class="dtp-select-day selected">'+e(j.days[g]).locale(this.params.lang).format("DD")+"</a>"
}else{h+='<a href="javascript:void(0);" class="dtp-select-day">'+e(j.days[g]).locale(this.params.lang).format("DD")+"</a>"
}}h+="</td>"
}}h+="</tr></tbody></table>";
return h
},setName:function(){var h="";
var f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for(var g=0;
g<5;
g++){h+=f.charAt(Math.floor(Math.random()*f.length))
}return h
},isPM:function(){return this.$dtpElement.find("a.dtp-meridien-pm").hasClass("selected")
},setElementValue:function(){this.$element.trigger("beforeChange",this.currentDate);
if(typeof(d.material)!=="undefined"){this.$element.removeClass("empty")
}this.$element.val(e(this.currentDate).locale(this.params.lang).format(this.params.format));
this.$element.trigger("change",this.currentDate)
},toggleButtons:function(g){if(g&&g.isValid()){var j=e(g).locale(this.params.lang).startOf("month");
var i=e(g).locale(this.params.lang).endOf("month");
if(!this.isAfterMinDate(j,false,false)){this.$dtpElement.find(".dtp-select-month-before").addClass("invisible")
}else{this.$dtpElement.find(".dtp-select-month-before").removeClass("invisible")
}if(!this.isBeforeMaxDate(i,false,false)){this.$dtpElement.find("a.dtp-select-month-after").addClass("invisible")
}else{this.$dtpElement.find("a.dtp-select-month-after").removeClass("invisible")
}var f=e(g).locale(this.params.lang).startOf("year");
var h=e(g).locale(this.params.lang).endOf("year");
if(!this.isAfterMinDate(f,false,false)){this.$dtpElement.find("a.dtp-select-year-before").addClass("invisible")
}else{this.$dtpElement.find("a.dtp-select-year-before").removeClass("invisible")
}if(!this.isBeforeMaxDate(h,false,false)){this.$dtpElement.find(".dtp-select-year-after").addClass("invisible")
}else{this.$dtpElement.find(".dtp-select-year-after").removeClass("invisible")
}}},toggleTime:function(i,h){var f=false;
if(h){var g=e(this.currentDate);
g.hour(this.convertHours(i)).minute(0).second(0);
f=!(this.isAfterMinDate(g,true,false)===false||this.isBeforeMaxDate(g,true,false)===false)
}else{var g=e(this.currentDate);
g.minute(i).second(0);
f=!(this.isAfterMinDate(g,true,true)===false||this.isBeforeMaxDate(g,true,true)===false)
}return f
},_attachEvent:function(g,h,f){g.on(h,null,null,f);
this._attachedEvents.push([g,h,f])
},_detachEvents:function(){for(var f=this._attachedEvents.length-1;
f>=0;
f--){this._attachedEvents[f][0].off(this._attachedEvents[f][1],this._attachedEvents[f][2]);
this._attachedEvents.splice(f,1)
}},_onFocus:function(){this.currentView=0;
this.$element.blur();
if(d(this.element).attr("data-min-date")&&d(this.element).attr("data-min-date")!==undefined&&d(this.element).attr("data-min-date")!==null){if(e(d(this.element).attr("data-min-date"),"DD/MM/YYYY").format("DD/MM/YYYY")!="Invalid date"){this.params.minDate=e(d(this.element).attr("data-min-date"),"DD/MM/YYYY").format("DD/MM/YYYY")
}}else{if(d(this.element).attr("data-min-days")){this.params.minDate=e(new Date()).subtract(d(this.element).attr("data-min-days"),"days")
}if(d(this.element).attr("data-min-months")){this.params.minDate=e(new Date()).subtract(d(this.element).attr("data-min-months"),"months")
}if(d(this.element).attr("data-min-years")){this.params.minDate=e(new Date()).subtract(d(this.element).attr("data-min-years"),"years")
}}if(d(this.element).attr("data-max-date")&&d(this.element).attr("data-max-date")!==undefined&&d(this.element).attr("data-max-date")!==null){if(e(d(this.element).attr("data-max-date"),"DD/MM/YYYY").format("DD/MM/YYYY")!="Invalid date"){this.params.maxDate=e(d(this.element).attr("data-max-date"),"DD/MM/YYYY").format("DD/MM/YYYY")
}}else{if(d(this.element).attr("data-max-days")){this.params.maxDate=e(new Date()).add(d(this.element).attr("data-max-days"),"days")
}if(d(this.element).attr("data-max-months")){this.params.maxDate=e(new Date()).add(d(this.element).attr("data-max-months"),"months")
}if(d(this.element).attr("data-max-years")){this.params.maxDate=e(new Date()).add(d(this.element).attr("data-max-years"),"years")
}}this.initDates();
this.show();
if(this.params.date){this.$dtpElement.find(".dtp-date").removeClass("hidden");
this.initDate()
}else{if(this.params.time){this.$dtpElement.find(".dtp-time").removeClass("hidden");
this.initHours()
}}},_onBackgroundClick:function(f){f.stopPropagation();
this.hide()
},_onElementClick:function(f){f.stopPropagation()
},_onKeydown:function(f){if(f.which===27){this.hide()
}},_onCloseClick:function(){this.hide();
this.$element.focus()
},_onClearClick:function(){this.currentDate=null;
this.$element.trigger("beforeChange",this.currentDate);
this.hide();
if(typeof(d.material)!=="undefined"){this.$element.addClass("empty")
}this.$element.val("");
this.$element.trigger("change",this.currentDate);
this.$element.focus()
},_onNowClick:function(){this.currentDate=e();
if(this.params.date===true){this.showDate(this.currentDate);
if(this.currentView===0){this.initDate()
}}if(this.params.time===true){this.showTime(this.currentDate);
switch(this.currentView){case 1:this.initHours();
break;
case 2:this.initMinutes();
break
}this.animateHands()
}},_onOKClick:function(){switch(this.currentView){case 0:if(this.params.time===true){this.initHours()
}else{this.setElementValue();
this.hide();
this.$element.focus()
}break;
case 1:this.initMinutes();
break;
case 2:this.setElementValue();
this.hide();
break
}},_onCancelClick:function(){if(this.params.time){switch(this.currentView){case 0:this.hide();
break;
case 1:if(this.params.date){this.initDate()
}else{this.hide()
}break;
case 2:this.initHours();
break
}}else{this.hide();
this.$element.focus()
}},_onMonthBeforeClick:function(){this.currentDate.subtract(1,"months");
this.initDate(this.currentDate)
},_onMonthAfterClick:function(){this.currentDate.add(1,"months");
this.initDate(this.currentDate)
},_onYearBeforeClick:function(){this.currentDate.subtract(1,"years");
this.initDate(this.currentDate)
},_onYearAfterClick:function(){this.currentDate.add(1,"years");
this.initDate(this.currentDate)
},_onSelectDate:function(f){this.$dtpElement.find("a.dtp-select-day").removeClass("selected");
d(f.currentTarget).addClass("selected");
this.selectDate(d(f.currentTarget).parent().data("date"));
if(this.params.switchOnClick===true&&this.params.time===true){setTimeout(this.initHours.bind(this),200)
}this._onOKClick()
},_onSelectHour:function(m){if(!d(m.target).hasClass("disabled")){var l=d(m.target).data("hour");
var j=d(m.target).parent();
var g=j.find(".dtp-select-hour");
for(var f=0;
f<g.length;
f++){d(g[f]).attr("fill","transparent")
}var k=j.find(".dtp-select-hour-text");
for(var f=0;
f<k.length;
f++){d(k[f]).attr("fill","#000")
}d(j.find("#h-"+l)).attr("fill","#8BC34A");
d(j.find("#th-"+l)).attr("fill","#fff");
this.currentDate.hour(parseInt(l));
if(this.params.shortTime===true&&this.isPM()){this.currentDate.add(12,"hours")
}this.showTime(this.currentDate);
this.animateHands();
if(this.params.switchOnClick===true){setTimeout(this.initMinutes.bind(this),200)
}}},_onSelectMinute:function(l){if(!d(l.target).hasClass("disabled")){var k=d(l.target).data("minute");
var j=d(l.target).parent();
var f=j.find(".dtp-select-minute");
for(var h=0;
h<f.length;
h++){d(f[h]).attr("fill","transparent")
}var g=j.find(".dtp-select-minute-text");
for(var h=0;
h<g.length;
h++){d(g[h]).attr("fill","#000")
}d(j.find("#m-"+k)).attr("fill","#8BC34A");
d(j.find("#tm-"+k)).attr("fill","#fff");
this.currentDate.minute(parseInt(k));
this.showTime(this.currentDate);
this.animateHands();
if(this.params.switchOnClick===true){setTimeout(function(){this.setElementValue();
this.hide()
}.bind(this),200)
}}},_onSelectAM:function(f){d(".dtp-actual-meridien").find("a").removeClass("selected");
d(f.currentTarget).addClass("selected");
if(this.currentDate.hour()>=12){if(this.currentDate.subtract(12,"hours")){this.showTime(this.currentDate)
}}this.toggleTime((this.currentView===1))
},_onSelectPM:function(f){d(".dtp-actual-meridien").find("a").removeClass("selected");
d(f.currentTarget).addClass("selected");
if(this.currentDate.hour()<12){if(this.currentDate.add(12,"hours")){this.showTime(this.currentDate)
}}this.toggleTime((this.currentView===1))
},convertHours:function(f){var g=f;
if(this.params.shortTime===true){if((f<12)&&this.isPM()){g+=12
}}return g
},setDate:function(f){this.params.currentDate=f;
this.initDates()
},setMinDate:function(f){this.params.minDate=f;
this.initDates()
},setMaxDate:function(f){this.params.maxDate=f;
this.initDates()
},destroy:function(){this._detachEvents();
this.$dtpElement.remove()
},show:function(){this.$dtpElement.removeClass("hidden");
this._attachEvent(d(window),"keydown",this._onKeydown.bind(this));
this._centerBox()
},hide:function(){d(window).off("keydown",null,null,this._onKeydown.bind(this));
this.$dtpElement.addClass("hidden");
d(this.$dtpElement).find(".select-year").addClass("hidden");
d(this.$dtpElement).find(".select-months").addClass("hidden");
d(this.$dtpElement).find(".dtp-picker").removeClass("hidden")
},_centerBox:function(){var f=(this.$dtpElement.height()-this.$dtpElement.find(".dtp-content").height())/2;
this.$dtpElement.find(".dtp-content").css("marginLeft",-(this.$dtpElement.find(".dtp-content").width()/2)+"px");
this.$dtpElement.find(".dtp-content").css("top",f+"px")
}}
})(jQuery,moment);