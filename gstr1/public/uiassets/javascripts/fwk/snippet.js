try{if(navigator&&navigator.userAgent){var BrowserAgentInstrumentationLocation=window.location.protocol+"//"+window.location.host+window.location.pathname;
var userAgt=navigator.userAgent;
var isSupported=false;
var getMajorVersion=function(b){var a=userAgt.match(b);
if(a&&a.length>1){var c=a[1].split(".");
if(c&&c.length>0){return parseInt(c[0])
}}return 0
};
if(/opera|opr/i.test(userAgt)){isSupported=false
}else{if(/edge/i.test(userAgt)){if(getMajorVersion(/(?:edge)\/(\d+(\.\d+)?)/i)>=12){isSupported=true
}}else{if(/msie|trident/i.test(userAgt)){if(getMajorVersion(/(?:msie |rv:)(\d+(\.\d+)?)/i)>=10){isSupported=true
}}else{if(/chrome|crios|crmo/i.test(userAgt)){if(getMajorVersion(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)>=30){isSupported=true
}}else{if(/firefox|iceweasel/i.test(userAgt)){if(getMajorVersion(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)>=30){isSupported=true
}}else{if(/safari/i.test(userAgt)){if(getMajorVersion(/version\/(\d+(\.\d+)?)/i)>=7){isSupported=true
}}else{isSupported=false
}}}}}}(function(g){if(!g){var c=null;
if(window.XMLHttpRequest){c=new XMLHttpRequest()
}else{if(window.ActiveXObject){c=new ActiveXObject("Microsoft.XMLHTTP")
}}if(c){var i=window.location.protocol+"//"+window.location.host+window.location.pathname+"?WilyCmd=cmdMetrics";
c.open("POST",i,true);
c.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
var a="UB=true";
c.send(a)
}return
}window.addEventListener("beforeunload",function(){if(window.Storage){sessionStorage.removeItem(window.location.pathname)
}});
window.addEventListener("pagehide",function(){if(window.Storage){sessionStorage.removeItem(window.location.pathname)
}});
if(window.Storage){var d=sessionStorage.getItem(window.location.pathname);
if(d&&d==="true"){return
}}var b="?WilyCmd=";
var f="text/javascript";
var h=function(l,k){var m=document.createElement("script");
m.type=f;
m.async=l;
m.src="/js/apmbrowseragent.js";
var j=document.getElementsByTagName("script")[0];
j.parentNode.insertBefore(m,j)
};
h(true,"cmdJS");
if(window.Storage){sessionStorage.setItem(window.location.pathname,"true")
}})(isSupported)
}}catch(e){};