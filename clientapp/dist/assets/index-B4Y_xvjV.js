(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function t(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=t(o);fetch(o.href,l)}})();function w_(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var wd={exports:{}},Fa={},Td={exports:{}},Ce={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sg;function f0(){if(Sg)return Ce;Sg=1;var r=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),h=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),_=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),A=Symbol.iterator;function C(V){return V===null||typeof V!="object"?null:(V=A&&V[A]||V["@@iterator"],typeof V=="function"?V:null)}var z={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},W=Object.assign,Y={};function B(V,$,de){this.props=V,this.context=$,this.refs=Y,this.updater=de||z}B.prototype.isReactComponent={},B.prototype.setState=function(V,$){if(typeof V!="object"&&typeof V!="function"&&V!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,V,$,"setState")},B.prototype.forceUpdate=function(V){this.updater.enqueueForceUpdate(this,V,"forceUpdate")};function ve(){}ve.prototype=B.prototype;function fe(V,$,de){this.props=V,this.context=$,this.refs=Y,this.updater=de||z}var ce=fe.prototype=new ve;ce.constructor=fe,W(ce,B.prototype),ce.isPureReactComponent=!0;var pe=Array.isArray,be=Object.prototype.hasOwnProperty,Te={current:null},P={key:!0,ref:!0,__self:!0,__source:!0};function I(V,$,de){var Ae,Re={},Pe=null,Le=null;if($!=null)for(Ae in $.ref!==void 0&&(Le=$.ref),$.key!==void 0&&(Pe=""+$.key),$)be.call($,Ae)&&!P.hasOwnProperty(Ae)&&(Re[Ae]=$[Ae]);var se=arguments.length-2;if(se===1)Re.children=de;else if(1<se){for(var me=Array(se),ze=0;ze<se;ze++)me[ze]=arguments[ze+2];Re.children=me}if(V&&V.defaultProps)for(Ae in se=V.defaultProps,se)Re[Ae]===void 0&&(Re[Ae]=se[Ae]);return{$$typeof:r,type:V,key:Pe,ref:Le,props:Re,_owner:Te.current}}function k(V,$){return{$$typeof:r,type:V.type,key:$,ref:V.ref,props:V.props,_owner:V._owner}}function x(V){return typeof V=="object"&&V!==null&&V.$$typeof===r}function D(V){var $={"=":"=0",":":"=2"};return"$"+V.replace(/[=:]/g,function(de){return $[de]})}var b=/\/+/g;function R(V,$){return typeof V=="object"&&V!==null&&V.key!=null?D(""+V.key):$.toString(36)}function Xe(V,$,de,Ae,Re){var Pe=typeof V;(Pe==="undefined"||Pe==="boolean")&&(V=null);var Le=!1;if(V===null)Le=!0;else switch(Pe){case"string":case"number":Le=!0;break;case"object":switch(V.$$typeof){case r:case e:Le=!0}}if(Le)return Le=V,Re=Re(Le),V=Ae===""?"."+R(Le,0):Ae,pe(Re)?(de="",V!=null&&(de=V.replace(b,"$&/")+"/"),Xe(Re,$,de,"",function(ze){return ze})):Re!=null&&(x(Re)&&(Re=k(Re,de+(!Re.key||Le&&Le.key===Re.key?"":(""+Re.key).replace(b,"$&/")+"/")+V)),$.push(Re)),1;if(Le=0,Ae=Ae===""?".":Ae+":",pe(V))for(var se=0;se<V.length;se++){Pe=V[se];var me=Ae+R(Pe,se);Le+=Xe(Pe,$,de,me,Re)}else if(me=C(V),typeof me=="function")for(V=me.call(V),se=0;!(Pe=V.next()).done;)Pe=Pe.value,me=Ae+R(Pe,se++),Le+=Xe(Pe,$,de,me,Re);else if(Pe==="object")throw $=String(V),Error("Objects are not valid as a React child (found: "+($==="[object Object]"?"object with keys {"+Object.keys(V).join(", ")+"}":$)+"). If you meant to render a collection of children, use an array instead.");return Le}function tt(V,$,de){if(V==null)return V;var Ae=[],Re=0;return Xe(V,Ae,"","",function(Pe){return $.call(de,Pe,Re++)}),Ae}function Je(V){if(V._status===-1){var $=V._result;$=$(),$.then(function(de){(V._status===0||V._status===-1)&&(V._status=1,V._result=de)},function(de){(V._status===0||V._status===-1)&&(V._status=2,V._result=de)}),V._status===-1&&(V._status=0,V._result=$)}if(V._status===1)return V._result.default;throw V._result}var Fe={current:null},Z={transition:null},he={ReactCurrentDispatcher:Fe,ReactCurrentBatchConfig:Z,ReactCurrentOwner:Te};function ee(){throw Error("act(...) is not supported in production builds of React.")}return Ce.Children={map:tt,forEach:function(V,$,de){tt(V,function(){$.apply(this,arguments)},de)},count:function(V){var $=0;return tt(V,function(){$++}),$},toArray:function(V){return tt(V,function($){return $})||[]},only:function(V){if(!x(V))throw Error("React.Children.only expected to receive a single React element child.");return V}},Ce.Component=B,Ce.Fragment=t,Ce.Profiler=o,Ce.PureComponent=fe,Ce.StrictMode=s,Ce.Suspense=g,Ce.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=he,Ce.act=ee,Ce.cloneElement=function(V,$,de){if(V==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+V+".");var Ae=W({},V.props),Re=V.key,Pe=V.ref,Le=V._owner;if($!=null){if($.ref!==void 0&&(Pe=$.ref,Le=Te.current),$.key!==void 0&&(Re=""+$.key),V.type&&V.type.defaultProps)var se=V.type.defaultProps;for(me in $)be.call($,me)&&!P.hasOwnProperty(me)&&(Ae[me]=$[me]===void 0&&se!==void 0?se[me]:$[me])}var me=arguments.length-2;if(me===1)Ae.children=de;else if(1<me){se=Array(me);for(var ze=0;ze<me;ze++)se[ze]=arguments[ze+2];Ae.children=se}return{$$typeof:r,type:V.type,key:Re,ref:Pe,props:Ae,_owner:Le}},Ce.createContext=function(V){return V={$$typeof:h,_currentValue:V,_currentValue2:V,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},V.Provider={$$typeof:l,_context:V},V.Consumer=V},Ce.createElement=I,Ce.createFactory=function(V){var $=I.bind(null,V);return $.type=V,$},Ce.createRef=function(){return{current:null}},Ce.forwardRef=function(V){return{$$typeof:f,render:V}},Ce.isValidElement=x,Ce.lazy=function(V){return{$$typeof:T,_payload:{_status:-1,_result:V},_init:Je}},Ce.memo=function(V,$){return{$$typeof:_,type:V,compare:$===void 0?null:$}},Ce.startTransition=function(V){var $=Z.transition;Z.transition={};try{V()}finally{Z.transition=$}},Ce.unstable_act=ee,Ce.useCallback=function(V,$){return Fe.current.useCallback(V,$)},Ce.useContext=function(V){return Fe.current.useContext(V)},Ce.useDebugValue=function(){},Ce.useDeferredValue=function(V){return Fe.current.useDeferredValue(V)},Ce.useEffect=function(V,$){return Fe.current.useEffect(V,$)},Ce.useId=function(){return Fe.current.useId()},Ce.useImperativeHandle=function(V,$,de){return Fe.current.useImperativeHandle(V,$,de)},Ce.useInsertionEffect=function(V,$){return Fe.current.useInsertionEffect(V,$)},Ce.useLayoutEffect=function(V,$){return Fe.current.useLayoutEffect(V,$)},Ce.useMemo=function(V,$){return Fe.current.useMemo(V,$)},Ce.useReducer=function(V,$,de){return Fe.current.useReducer(V,$,de)},Ce.useRef=function(V){return Fe.current.useRef(V)},Ce.useState=function(V){return Fe.current.useState(V)},Ce.useSyncExternalStore=function(V,$,de){return Fe.current.useSyncExternalStore(V,$,de)},Ce.useTransition=function(){return Fe.current.useTransition()},Ce.version="18.3.1",Ce}var Ag;function _f(){return Ag||(Ag=1,Td.exports=f0()),Td.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Rg;function p0(){if(Rg)return Fa;Rg=1;var r=_f(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,o=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function h(f,g,_){var T,A={},C=null,z=null;_!==void 0&&(C=""+_),g.key!==void 0&&(C=""+g.key),g.ref!==void 0&&(z=g.ref);for(T in g)s.call(g,T)&&!l.hasOwnProperty(T)&&(A[T]=g[T]);if(f&&f.defaultProps)for(T in g=f.defaultProps,g)A[T]===void 0&&(A[T]=g[T]);return{$$typeof:e,type:f,key:C,ref:z,props:A,_owner:o.current}}return Fa.Fragment=t,Fa.jsx=h,Fa.jsxs=h,Fa}var kg;function m0(){return kg||(kg=1,wd.exports=p0()),wd.exports}var E=m0(),$e=_f();const g0=w_($e);var Uu={},Id={exports:{}},on={},Sd={exports:{}},Ad={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cg;function y0(){return Cg||(Cg=1,(function(r){function e(Z,he){var ee=Z.length;Z.push(he);e:for(;0<ee;){var V=ee-1>>>1,$=Z[V];if(0<o($,he))Z[V]=he,Z[ee]=$,ee=V;else break e}}function t(Z){return Z.length===0?null:Z[0]}function s(Z){if(Z.length===0)return null;var he=Z[0],ee=Z.pop();if(ee!==he){Z[0]=ee;e:for(var V=0,$=Z.length,de=$>>>1;V<de;){var Ae=2*(V+1)-1,Re=Z[Ae],Pe=Ae+1,Le=Z[Pe];if(0>o(Re,ee))Pe<$&&0>o(Le,Re)?(Z[V]=Le,Z[Pe]=ee,V=Pe):(Z[V]=Re,Z[Ae]=ee,V=Ae);else if(Pe<$&&0>o(Le,ee))Z[V]=Le,Z[Pe]=ee,V=Pe;else break e}}return he}function o(Z,he){var ee=Z.sortIndex-he.sortIndex;return ee!==0?ee:Z.id-he.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var h=Date,f=h.now();r.unstable_now=function(){return h.now()-f}}var g=[],_=[],T=1,A=null,C=3,z=!1,W=!1,Y=!1,B=typeof setTimeout=="function"?setTimeout:null,ve=typeof clearTimeout=="function"?clearTimeout:null,fe=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ce(Z){for(var he=t(_);he!==null;){if(he.callback===null)s(_);else if(he.startTime<=Z)s(_),he.sortIndex=he.expirationTime,e(g,he);else break;he=t(_)}}function pe(Z){if(Y=!1,ce(Z),!W)if(t(g)!==null)W=!0,Je(be);else{var he=t(_);he!==null&&Fe(pe,he.startTime-Z)}}function be(Z,he){W=!1,Y&&(Y=!1,ve(I),I=-1),z=!0;var ee=C;try{for(ce(he),A=t(g);A!==null&&(!(A.expirationTime>he)||Z&&!D());){var V=A.callback;if(typeof V=="function"){A.callback=null,C=A.priorityLevel;var $=V(A.expirationTime<=he);he=r.unstable_now(),typeof $=="function"?A.callback=$:A===t(g)&&s(g),ce(he)}else s(g);A=t(g)}if(A!==null)var de=!0;else{var Ae=t(_);Ae!==null&&Fe(pe,Ae.startTime-he),de=!1}return de}finally{A=null,C=ee,z=!1}}var Te=!1,P=null,I=-1,k=5,x=-1;function D(){return!(r.unstable_now()-x<k)}function b(){if(P!==null){var Z=r.unstable_now();x=Z;var he=!0;try{he=P(!0,Z)}finally{he?R():(Te=!1,P=null)}}else Te=!1}var R;if(typeof fe=="function")R=function(){fe(b)};else if(typeof MessageChannel<"u"){var Xe=new MessageChannel,tt=Xe.port2;Xe.port1.onmessage=b,R=function(){tt.postMessage(null)}}else R=function(){B(b,0)};function Je(Z){P=Z,Te||(Te=!0,R())}function Fe(Z,he){I=B(function(){Z(r.unstable_now())},he)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(Z){Z.callback=null},r.unstable_continueExecution=function(){W||z||(W=!0,Je(be))},r.unstable_forceFrameRate=function(Z){0>Z||125<Z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):k=0<Z?Math.floor(1e3/Z):5},r.unstable_getCurrentPriorityLevel=function(){return C},r.unstable_getFirstCallbackNode=function(){return t(g)},r.unstable_next=function(Z){switch(C){case 1:case 2:case 3:var he=3;break;default:he=C}var ee=C;C=he;try{return Z()}finally{C=ee}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(Z,he){switch(Z){case 1:case 2:case 3:case 4:case 5:break;default:Z=3}var ee=C;C=Z;try{return he()}finally{C=ee}},r.unstable_scheduleCallback=function(Z,he,ee){var V=r.unstable_now();switch(typeof ee=="object"&&ee!==null?(ee=ee.delay,ee=typeof ee=="number"&&0<ee?V+ee:V):ee=V,Z){case 1:var $=-1;break;case 2:$=250;break;case 5:$=1073741823;break;case 4:$=1e4;break;default:$=5e3}return $=ee+$,Z={id:T++,callback:he,priorityLevel:Z,startTime:ee,expirationTime:$,sortIndex:-1},ee>V?(Z.sortIndex=ee,e(_,Z),t(g)===null&&Z===t(_)&&(Y?(ve(I),I=-1):Y=!0,Fe(pe,ee-V))):(Z.sortIndex=$,e(g,Z),W||z||(W=!0,Je(be))),Z},r.unstable_shouldYield=D,r.unstable_wrapCallback=function(Z){var he=C;return function(){var ee=C;C=he;try{return Z.apply(this,arguments)}finally{C=ee}}}})(Ad)),Ad}var Pg;function _0(){return Pg||(Pg=1,Sd.exports=y0()),Sd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ng;function v0(){if(Ng)return on;Ng=1;var r=_f(),e=_0();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,a=1;a<arguments.length;a++)i+="&args[]="+encodeURIComponent(arguments[a]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var s=new Set,o={};function l(n,i){h(n,i),h(n+"Capture",i)}function h(n,i){for(o[n]=i,n=0;n<i.length;n++)s.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),g=Object.prototype.hasOwnProperty,_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,T={},A={};function C(n){return g.call(A,n)?!0:g.call(T,n)?!1:_.test(n)?A[n]=!0:(T[n]=!0,!1)}function z(n,i,a,c){if(a!==null&&a.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:a!==null?!a.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function W(n,i,a,c){if(i===null||typeof i>"u"||z(n,i,a,c))return!0;if(c)return!1;if(a!==null)switch(a.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function Y(n,i,a,c,d,m,v){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=d,this.mustUseProperty=a,this.propertyName=n,this.type=i,this.sanitizeURL=m,this.removeEmptyString=v}var B={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){B[n]=new Y(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];B[i]=new Y(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){B[n]=new Y(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){B[n]=new Y(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){B[n]=new Y(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){B[n]=new Y(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){B[n]=new Y(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){B[n]=new Y(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){B[n]=new Y(n,5,!1,n.toLowerCase(),null,!1,!1)});var ve=/[\-:]([a-z])/g;function fe(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(ve,fe);B[i]=new Y(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(ve,fe);B[i]=new Y(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(ve,fe);B[i]=new Y(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){B[n]=new Y(n,1,!1,n.toLowerCase(),null,!1,!1)}),B.xlinkHref=new Y("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){B[n]=new Y(n,1,!1,n.toLowerCase(),null,!0,!0)});function ce(n,i,a,c){var d=B.hasOwnProperty(i)?B[i]:null;(d!==null?d.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(W(i,a,d,c)&&(a=null),c||d===null?C(i)&&(a===null?n.removeAttribute(i):n.setAttribute(i,""+a)):d.mustUseProperty?n[d.propertyName]=a===null?d.type===3?!1:"":a:(i=d.attributeName,c=d.attributeNamespace,a===null?n.removeAttribute(i):(d=d.type,a=d===3||d===4&&a===!0?"":""+a,c?n.setAttributeNS(c,i,a):n.setAttribute(i,a))))}var pe=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,be=Symbol.for("react.element"),Te=Symbol.for("react.portal"),P=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),k=Symbol.for("react.profiler"),x=Symbol.for("react.provider"),D=Symbol.for("react.context"),b=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),Xe=Symbol.for("react.suspense_list"),tt=Symbol.for("react.memo"),Je=Symbol.for("react.lazy"),Fe=Symbol.for("react.offscreen"),Z=Symbol.iterator;function he(n){return n===null||typeof n!="object"?null:(n=Z&&n[Z]||n["@@iterator"],typeof n=="function"?n:null)}var ee=Object.assign,V;function $(n){if(V===void 0)try{throw Error()}catch(a){var i=a.stack.trim().match(/\n( *(at )?)/);V=i&&i[1]||""}return`
`+V+n}var de=!1;function Ae(n,i){if(!n||de)return"";de=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(F){var c=F}Reflect.construct(n,[],i)}else{try{i.call()}catch(F){c=F}n.call(i.prototype)}else{try{throw Error()}catch(F){c=F}n()}}catch(F){if(F&&c&&typeof F.stack=="string"){for(var d=F.stack.split(`
`),m=c.stack.split(`
`),v=d.length-1,S=m.length-1;1<=v&&0<=S&&d[v]!==m[S];)S--;for(;1<=v&&0<=S;v--,S--)if(d[v]!==m[S]){if(v!==1||S!==1)do if(v--,S--,0>S||d[v]!==m[S]){var N=`
`+d[v].replace(" at new "," at ");return n.displayName&&N.includes("<anonymous>")&&(N=N.replace("<anonymous>",n.displayName)),N}while(1<=v&&0<=S);break}}}finally{de=!1,Error.prepareStackTrace=a}return(n=n?n.displayName||n.name:"")?$(n):""}function Re(n){switch(n.tag){case 5:return $(n.type);case 16:return $("Lazy");case 13:return $("Suspense");case 19:return $("SuspenseList");case 0:case 2:case 15:return n=Ae(n.type,!1),n;case 11:return n=Ae(n.type.render,!1),n;case 1:return n=Ae(n.type,!0),n;default:return""}}function Pe(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case P:return"Fragment";case Te:return"Portal";case k:return"Profiler";case I:return"StrictMode";case R:return"Suspense";case Xe:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case D:return(n.displayName||"Context")+".Consumer";case x:return(n._context.displayName||"Context")+".Provider";case b:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case tt:return i=n.displayName||null,i!==null?i:Pe(n.type)||"Memo";case Je:i=n._payload,n=n._init;try{return Pe(n(i))}catch{}}return null}function Le(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Pe(i);case 8:return i===I?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function se(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function me(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function ze(n){var i=me(n)?"checked":"value",a=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var d=a.get,m=a.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return d.call(this)},set:function(v){c=""+v,m.call(this,v)}}),Object.defineProperty(n,i,{enumerable:a.enumerable}),{getValue:function(){return c},setValue:function(v){c=""+v},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function Xt(n){n._valueTracker||(n._valueTracker=ze(n))}function _n(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var a=i.getValue(),c="";return n&&(c=me(n)?n.checked?"true":"false":n.value),n=c,n!==a?(i.setValue(n),!0):!1}function qr(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Mi(n,i){var a=i.checked;return ee({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:a??n._wrapperState.initialChecked})}function Ps(n,i){var a=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;a=se(i.value!=null?i.value:a),n._wrapperState={initialChecked:c,initialValue:a,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function qo(n,i){i=i.checked,i!=null&&ce(n,"checked",i,!1)}function Wo(n,i){qo(n,i);var a=se(i.value),c=i.type;if(a!=null)c==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+a):n.value!==""+a&&(n.value=""+a);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Ns(n,i.type,a):i.hasOwnProperty("defaultValue")&&Ns(n,i.type,se(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Al(n,i,a){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,a||i===n.value||(n.value=i),n.defaultValue=i}a=n.name,a!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,a!==""&&(n.name=a)}function Ns(n,i,a){(i!=="number"||qr(n.ownerDocument)!==n)&&(a==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+a&&(n.defaultValue=""+a))}var vr=Array.isArray;function Er(n,i,a,c){if(n=n.options,i){i={};for(var d=0;d<a.length;d++)i["$"+a[d]]=!0;for(a=0;a<n.length;a++)d=i.hasOwnProperty("$"+n[a].value),n[a].selected!==d&&(n[a].selected=d),d&&c&&(n[a].defaultSelected=!0)}else{for(a=""+se(a),i=null,d=0;d<n.length;d++){if(n[d].value===a){n[d].selected=!0,c&&(n[d].defaultSelected=!0);return}i!==null||n[d].disabled||(i=n[d])}i!==null&&(i.selected=!0)}}function Ko(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return ee({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function xs(n,i){var a=i.value;if(a==null){if(a=i.children,i=i.defaultValue,a!=null){if(i!=null)throw Error(t(92));if(vr(a)){if(1<a.length)throw Error(t(93));a=a[0]}i=a}i==null&&(i=""),a=i}n._wrapperState={initialValue:se(a)}}function Ds(n,i){var a=se(i.value),c=se(i.defaultValue);a!=null&&(a=""+a,a!==n.value&&(n.value=a),i.defaultValue==null&&n.defaultValue!==a&&(n.defaultValue=a)),c!=null&&(n.defaultValue=""+c)}function Go(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function gt(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function yt(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?gt(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var wr,Qo=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,a,c,d){MSApp.execUnsafeLocalFunction(function(){return n(i,a,c,d)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(wr=wr||document.createElement("div"),wr.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=wr.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function Wr(n,i){if(i){var a=n.firstChild;if(a&&a===n.lastChild&&a.nodeType===3){a.nodeValue=i;return}}n.textContent=i}var ji={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Fi=["Webkit","ms","Moz","O"];Object.keys(ji).forEach(function(n){Fi.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),ji[i]=ji[n]})});function Yo(n,i,a){return i==null||typeof i=="boolean"||i===""?"":a||typeof i!="number"||i===0||ji.hasOwnProperty(n)&&ji[n]?(""+i).trim():i+"px"}function Xo(n,i){n=n.style;for(var a in i)if(i.hasOwnProperty(a)){var c=a.indexOf("--")===0,d=Yo(a,i[a],c);a==="float"&&(a="cssFloat"),c?n.setProperty(a,d):n[a]=d}}var Jo=ee({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zo(n,i){if(i){if(Jo[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function ea(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ui=null;function Os(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Vs=null,vn=null,Zn=null;function bs(n){if(n=Sa(n)){if(typeof Vs!="function")throw Error(t(280));var i=n.stateNode;i&&(i=tu(i),Vs(n.stateNode,n.type,i))}}function er(n){vn?Zn?Zn.push(n):Zn=[n]:vn=n}function ta(){if(vn){var n=vn,i=Zn;if(Zn=vn=null,bs(n),i)for(n=0;n<i.length;n++)bs(i[n])}}function zi(n,i){return n(i)}function na(){}var Tr=!1;function ra(n,i,a){if(Tr)return n(i,a);Tr=!0;try{return zi(n,i,a)}finally{Tr=!1,(vn!==null||Zn!==null)&&(na(),ta())}}function at(n,i){var a=n.stateNode;if(a===null)return null;var c=tu(a);if(c===null)return null;a=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(a&&typeof a!="function")throw Error(t(231,i,typeof a));return a}var Ls=!1;if(f)try{var Vn={};Object.defineProperty(Vn,"passive",{get:function(){Ls=!0}}),window.addEventListener("test",Vn,Vn),window.removeEventListener("test",Vn,Vn)}catch{Ls=!1}function Bi(n,i,a,c,d,m,v,S,N){var F=Array.prototype.slice.call(arguments,3);try{i.apply(a,F)}catch(G){this.onError(G)}}var $i=!1,Ms=null,bn=!1,ia=null,Qc={onError:function(n){$i=!0,Ms=n}};function js(n,i,a,c,d,m,v,S,N){$i=!1,Ms=null,Bi.apply(Qc,arguments)}function Rl(n,i,a,c,d,m,v,S,N){if(js.apply(this,arguments),$i){if($i){var F=Ms;$i=!1,Ms=null}else throw Error(t(198));bn||(bn=!0,ia=F)}}function Ln(n){var i=n,a=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(a=i.return),n=i.return;while(n)}return i.tag===3?a:null}function Hi(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function Mn(n){if(Ln(n)!==n)throw Error(t(188))}function kl(n){var i=n.alternate;if(!i){if(i=Ln(n),i===null)throw Error(t(188));return i!==n?null:n}for(var a=n,c=i;;){var d=a.return;if(d===null)break;var m=d.alternate;if(m===null){if(c=d.return,c!==null){a=c;continue}break}if(d.child===m.child){for(m=d.child;m;){if(m===a)return Mn(d),n;if(m===c)return Mn(d),i;m=m.sibling}throw Error(t(188))}if(a.return!==c.return)a=d,c=m;else{for(var v=!1,S=d.child;S;){if(S===a){v=!0,a=d,c=m;break}if(S===c){v=!0,c=d,a=m;break}S=S.sibling}if(!v){for(S=m.child;S;){if(S===a){v=!0,a=m,c=d;break}if(S===c){v=!0,c=m,a=d;break}S=S.sibling}if(!v)throw Error(t(189))}}if(a.alternate!==c)throw Error(t(190))}if(a.tag!==3)throw Error(t(188));return a.stateNode.current===a?n:i}function sa(n){return n=kl(n),n!==null?Fs(n):null}function Fs(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=Fs(n);if(i!==null)return i;n=n.sibling}return null}var Us=e.unstable_scheduleCallback,oa=e.unstable_cancelCallback,Cl=e.unstable_shouldYield,Yc=e.unstable_requestPaint,qe=e.unstable_now,Pl=e.unstable_getCurrentPriorityLevel,qi=e.unstable_ImmediatePriority,Kr=e.unstable_UserBlockingPriority,En=e.unstable_NormalPriority,aa=e.unstable_LowPriority,Nl=e.unstable_IdlePriority,Wi=null,hn=null;function xl(n){if(hn&&typeof hn.onCommitFiberRoot=="function")try{hn.onCommitFiberRoot(Wi,n,void 0,(n.current.flags&128)===128)}catch{}}var Wt=Math.clz32?Math.clz32:Ol,la=Math.log,Dl=Math.LN2;function Ol(n){return n>>>=0,n===0?32:31-(la(n)/Dl|0)|0}var zs=64,Bs=4194304;function Gr(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Ki(n,i){var a=n.pendingLanes;if(a===0)return 0;var c=0,d=n.suspendedLanes,m=n.pingedLanes,v=a&268435455;if(v!==0){var S=v&~d;S!==0?c=Gr(S):(m&=v,m!==0&&(c=Gr(m)))}else v=a&~d,v!==0?c=Gr(v):m!==0&&(c=Gr(m));if(c===0)return 0;if(i!==0&&i!==c&&(i&d)===0&&(d=c&-c,m=i&-i,d>=m||d===16&&(m&4194240)!==0))return i;if((c&4)!==0&&(c|=a&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)a=31-Wt(i),d=1<<a,c|=n[a],i&=~d;return c}function Xc(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ir(n,i){for(var a=n.suspendedLanes,c=n.pingedLanes,d=n.expirationTimes,m=n.pendingLanes;0<m;){var v=31-Wt(m),S=1<<v,N=d[v];N===-1?((S&a)===0||(S&c)!==0)&&(d[v]=Xc(S,i)):N<=i&&(n.expiredLanes|=S),m&=~S}}function dn(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Gi(){var n=zs;return zs<<=1,(zs&4194240)===0&&(zs=64),n}function Qr(n){for(var i=[],a=0;31>a;a++)i.push(n);return i}function Yr(n,i,a){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Wt(i),n[i]=a}function He(n,i){var a=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<a;){var d=31-Wt(a),m=1<<d;i[d]=0,c[d]=-1,n[d]=-1,a&=~m}}function Xr(n,i){var a=n.entangledLanes|=i;for(n=n.entanglements;a;){var c=31-Wt(a),d=1<<c;d&i|n[c]&i&&(n[c]|=i),a&=~d}}var De=0;function Jr(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Vl,$s,bl,Ll,Ml,ua=!1,tr=[],Pt=null,jn=null,Fn=null,Zr=new Map,wn=new Map,nr=[],Jc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function jl(n,i){switch(n){case"focusin":case"focusout":Pt=null;break;case"dragenter":case"dragleave":jn=null;break;case"mouseover":case"mouseout":Fn=null;break;case"pointerover":case"pointerout":Zr.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":wn.delete(i.pointerId)}}function Jt(n,i,a,c,d,m){return n===null||n.nativeEvent!==m?(n={blockedOn:i,domEventName:a,eventSystemFlags:c,nativeEvent:m,targetContainers:[d]},i!==null&&(i=Sa(i),i!==null&&$s(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),n)}function Zc(n,i,a,c,d){switch(i){case"focusin":return Pt=Jt(Pt,n,i,a,c,d),!0;case"dragenter":return jn=Jt(jn,n,i,a,c,d),!0;case"mouseover":return Fn=Jt(Fn,n,i,a,c,d),!0;case"pointerover":var m=d.pointerId;return Zr.set(m,Jt(Zr.get(m)||null,n,i,a,c,d)),!0;case"gotpointercapture":return m=d.pointerId,wn.set(m,Jt(wn.get(m)||null,n,i,a,c,d)),!0}return!1}function Fl(n){var i=Zi(n.target);if(i!==null){var a=Ln(i);if(a!==null){if(i=a.tag,i===13){if(i=Hi(a),i!==null){n.blockedOn=i,Ml(n.priority,function(){bl(a)});return}}else if(i===3&&a.stateNode.current.memoizedState.isDehydrated){n.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Sr(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var a=Hs(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(a===null){a=n.nativeEvent;var c=new a.constructor(a.type,a);Ui=c,a.target.dispatchEvent(c),Ui=null}else return i=Sa(a),i!==null&&$s(i),n.blockedOn=a,!1;i.shift()}return!0}function Qi(n,i,a){Sr(n)&&a.delete(i)}function Ul(){ua=!1,Pt!==null&&Sr(Pt)&&(Pt=null),jn!==null&&Sr(jn)&&(jn=null),Fn!==null&&Sr(Fn)&&(Fn=null),Zr.forEach(Qi),wn.forEach(Qi)}function Un(n,i){n.blockedOn===i&&(n.blockedOn=null,ua||(ua=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Ul)))}function zn(n){function i(d){return Un(d,n)}if(0<tr.length){Un(tr[0],n);for(var a=1;a<tr.length;a++){var c=tr[a];c.blockedOn===n&&(c.blockedOn=null)}}for(Pt!==null&&Un(Pt,n),jn!==null&&Un(jn,n),Fn!==null&&Un(Fn,n),Zr.forEach(i),wn.forEach(i),a=0;a<nr.length;a++)c=nr[a],c.blockedOn===n&&(c.blockedOn=null);for(;0<nr.length&&(a=nr[0],a.blockedOn===null);)Fl(a),a.blockedOn===null&&nr.shift()}var Ar=pe.ReactCurrentBatchConfig,ei=!0;function Ze(n,i,a,c){var d=De,m=Ar.transition;Ar.transition=null;try{De=1,ca(n,i,a,c)}finally{De=d,Ar.transition=m}}function eh(n,i,a,c){var d=De,m=Ar.transition;Ar.transition=null;try{De=4,ca(n,i,a,c)}finally{De=d,Ar.transition=m}}function ca(n,i,a,c){if(ei){var d=Hs(n,i,a,c);if(d===null)hh(n,i,c,Yi,a),jl(n,c);else if(Zc(d,n,i,a,c))c.stopPropagation();else if(jl(n,c),i&4&&-1<Jc.indexOf(n)){for(;d!==null;){var m=Sa(d);if(m!==null&&Vl(m),m=Hs(n,i,a,c),m===null&&hh(n,i,c,Yi,a),m===d)break;d=m}d!==null&&c.stopPropagation()}else hh(n,i,c,null,a)}}var Yi=null;function Hs(n,i,a,c){if(Yi=null,n=Os(c),n=Zi(n),n!==null)if(i=Ln(n),i===null)n=null;else if(a=i.tag,a===13){if(n=Hi(i),n!==null)return n;n=null}else if(a===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return Yi=n,null}function ha(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Pl()){case qi:return 1;case Kr:return 4;case En:case aa:return 16;case Nl:return 536870912;default:return 16}default:return 16}}var fn=null,qs=null,Zt=null;function da(){if(Zt)return Zt;var n,i=qs,a=i.length,c,d="value"in fn?fn.value:fn.textContent,m=d.length;for(n=0;n<a&&i[n]===d[n];n++);var v=a-n;for(c=1;c<=v&&i[a-c]===d[m-c];c++);return Zt=d.slice(n,1<c?1-c:void 0)}function Ws(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function rr(){return!0}function fa(){return!1}function Nt(n){function i(a,c,d,m,v){this._reactName=a,this._targetInst=d,this.type=c,this.nativeEvent=m,this.target=v,this.currentTarget=null;for(var S in n)n.hasOwnProperty(S)&&(a=n[S],this[S]=a?a(m):m[S]);return this.isDefaultPrevented=(m.defaultPrevented!=null?m.defaultPrevented:m.returnValue===!1)?rr:fa,this.isPropagationStopped=fa,this}return ee(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=rr)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=rr)},persist:function(){},isPersistent:rr}),i}var Bn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ks=Nt(Bn),ir=ee({},Bn,{view:0,detail:0}),th=Nt(ir),Gs,Rr,ti,Xi=ee({},ir,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:sr,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==ti&&(ti&&n.type==="mousemove"?(Gs=n.screenX-ti.screenX,Rr=n.screenY-ti.screenY):Rr=Gs=0,ti=n),Gs)},movementY:function(n){return"movementY"in n?n.movementY:Rr}}),Qs=Nt(Xi),pa=ee({},Xi,{dataTransfer:0}),zl=Nt(pa),Ys=ee({},ir,{relatedTarget:0}),Xs=Nt(Ys),Bl=ee({},Bn,{animationName:0,elapsedTime:0,pseudoElement:0}),kr=Nt(Bl),$l=ee({},Bn,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Hl=Nt($l),ql=ee({},Bn,{data:0}),ma=Nt(ql),Js={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Kt={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Wl={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kl(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=Wl[n])?!!i[n]:!1}function sr(){return Kl}var u=ee({},ir,{key:function(n){if(n.key){var i=Js[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=Ws(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Kt[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:sr,charCode:function(n){return n.type==="keypress"?Ws(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ws(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),p=Nt(u),y=ee({},Xi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),w=Nt(y),L=ee({},ir,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:sr}),U=Nt(L),J=ee({},Bn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Be=Nt(J),_t=ee({},Xi,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Oe=Nt(_t),It=[9,13,27,32],ct=f&&"CompositionEvent"in window,Tn=null;f&&"documentMode"in document&&(Tn=document.documentMode);var pn=f&&"TextEvent"in window&&!Tn,Ji=f&&(!ct||Tn&&8<Tn&&11>=Tn),Zs=" ",_p=!1;function vp(n,i){switch(n){case"keyup":return It.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ep(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var eo=!1;function cw(n,i){switch(n){case"compositionend":return Ep(i);case"keypress":return i.which!==32?null:(_p=!0,Zs);case"textInput":return n=i.data,n===Zs&&_p?null:n;default:return null}}function hw(n,i){if(eo)return n==="compositionend"||!ct&&vp(n,i)?(n=da(),Zt=qs=fn=null,eo=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Ji&&i.locale!=="ko"?null:i.data;default:return null}}var dw={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function wp(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!dw[n.type]:i==="textarea"}function Tp(n,i,a,c){er(c),i=Jl(i,"onChange"),0<i.length&&(a=new Ks("onChange","change",null,a,c),n.push({event:a,listeners:i}))}var ga=null,ya=null;function fw(n){Up(n,0)}function Gl(n){var i=so(n);if(_n(i))return n}function pw(n,i){if(n==="change")return i}var Ip=!1;if(f){var nh;if(f){var rh="oninput"in document;if(!rh){var Sp=document.createElement("div");Sp.setAttribute("oninput","return;"),rh=typeof Sp.oninput=="function"}nh=rh}else nh=!1;Ip=nh&&(!document.documentMode||9<document.documentMode)}function Ap(){ga&&(ga.detachEvent("onpropertychange",Rp),ya=ga=null)}function Rp(n){if(n.propertyName==="value"&&Gl(ya)){var i=[];Tp(i,ya,n,Os(n)),ra(fw,i)}}function mw(n,i,a){n==="focusin"?(Ap(),ga=i,ya=a,ga.attachEvent("onpropertychange",Rp)):n==="focusout"&&Ap()}function gw(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Gl(ya)}function yw(n,i){if(n==="click")return Gl(i)}function _w(n,i){if(n==="input"||n==="change")return Gl(i)}function vw(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var $n=typeof Object.is=="function"?Object.is:vw;function _a(n,i){if($n(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var a=Object.keys(n),c=Object.keys(i);if(a.length!==c.length)return!1;for(c=0;c<a.length;c++){var d=a[c];if(!g.call(i,d)||!$n(n[d],i[d]))return!1}return!0}function kp(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Cp(n,i){var a=kp(n);n=0;for(var c;a;){if(a.nodeType===3){if(c=n+a.textContent.length,n<=i&&c>=i)return{node:a,offset:i-n};n=c}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=kp(a)}}function Pp(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?Pp(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function Np(){for(var n=window,i=qr();i instanceof n.HTMLIFrameElement;){try{var a=typeof i.contentWindow.location.href=="string"}catch{a=!1}if(a)n=i.contentWindow;else break;i=qr(n.document)}return i}function ih(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function Ew(n){var i=Np(),a=n.focusedElem,c=n.selectionRange;if(i!==a&&a&&a.ownerDocument&&Pp(a.ownerDocument.documentElement,a)){if(c!==null&&ih(a)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in a)a.selectionStart=i,a.selectionEnd=Math.min(n,a.value.length);else if(n=(i=a.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var d=a.textContent.length,m=Math.min(c.start,d);c=c.end===void 0?m:Math.min(c.end,d),!n.extend&&m>c&&(d=c,c=m,m=d),d=Cp(a,m);var v=Cp(a,c);d&&v&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==v.node||n.focusOffset!==v.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),n.removeAllRanges(),m>c?(n.addRange(i),n.extend(v.node,v.offset)):(i.setEnd(v.node,v.offset),n.addRange(i)))}}for(i=[],n=a;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<i.length;a++)n=i[a],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var ww=f&&"documentMode"in document&&11>=document.documentMode,to=null,sh=null,va=null,oh=!1;function xp(n,i,a){var c=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;oh||to==null||to!==qr(c)||(c=to,"selectionStart"in c&&ih(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),va&&_a(va,c)||(va=c,c=Jl(sh,"onSelect"),0<c.length&&(i=new Ks("onSelect","select",null,i,a),n.push({event:i,listeners:c}),i.target=to)))}function Ql(n,i){var a={};return a[n.toLowerCase()]=i.toLowerCase(),a["Webkit"+n]="webkit"+i,a["Moz"+n]="moz"+i,a}var no={animationend:Ql("Animation","AnimationEnd"),animationiteration:Ql("Animation","AnimationIteration"),animationstart:Ql("Animation","AnimationStart"),transitionend:Ql("Transition","TransitionEnd")},ah={},Dp={};f&&(Dp=document.createElement("div").style,"AnimationEvent"in window||(delete no.animationend.animation,delete no.animationiteration.animation,delete no.animationstart.animation),"TransitionEvent"in window||delete no.transitionend.transition);function Yl(n){if(ah[n])return ah[n];if(!no[n])return n;var i=no[n],a;for(a in i)if(i.hasOwnProperty(a)&&a in Dp)return ah[n]=i[a];return n}var Op=Yl("animationend"),Vp=Yl("animationiteration"),bp=Yl("animationstart"),Lp=Yl("transitionend"),Mp=new Map,jp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ni(n,i){Mp.set(n,i),l(i,[n])}for(var lh=0;lh<jp.length;lh++){var uh=jp[lh],Tw=uh.toLowerCase(),Iw=uh[0].toUpperCase()+uh.slice(1);ni(Tw,"on"+Iw)}ni(Op,"onAnimationEnd"),ni(Vp,"onAnimationIteration"),ni(bp,"onAnimationStart"),ni("dblclick","onDoubleClick"),ni("focusin","onFocus"),ni("focusout","onBlur"),ni(Lp,"onTransitionEnd"),h("onMouseEnter",["mouseout","mouseover"]),h("onMouseLeave",["mouseout","mouseover"]),h("onPointerEnter",["pointerout","pointerover"]),h("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ea="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Sw=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ea));function Fp(n,i,a){var c=n.type||"unknown-event";n.currentTarget=a,Rl(c,i,void 0,n),n.currentTarget=null}function Up(n,i){i=(i&4)!==0;for(var a=0;a<n.length;a++){var c=n[a],d=c.event;c=c.listeners;e:{var m=void 0;if(i)for(var v=c.length-1;0<=v;v--){var S=c[v],N=S.instance,F=S.currentTarget;if(S=S.listener,N!==m&&d.isPropagationStopped())break e;Fp(d,S,F),m=N}else for(v=0;v<c.length;v++){if(S=c[v],N=S.instance,F=S.currentTarget,S=S.listener,N!==m&&d.isPropagationStopped())break e;Fp(d,S,F),m=N}}}if(bn)throw n=ia,bn=!1,ia=null,n}function Ge(n,i){var a=i[yh];a===void 0&&(a=i[yh]=new Set);var c=n+"__bubble";a.has(c)||(zp(i,n,2,!1),a.add(c))}function ch(n,i,a){var c=0;i&&(c|=4),zp(a,n,c,i)}var Xl="_reactListening"+Math.random().toString(36).slice(2);function wa(n){if(!n[Xl]){n[Xl]=!0,s.forEach(function(a){a!=="selectionchange"&&(Sw.has(a)||ch(a,!1,n),ch(a,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[Xl]||(i[Xl]=!0,ch("selectionchange",!1,i))}}function zp(n,i,a,c){switch(ha(i)){case 1:var d=Ze;break;case 4:d=eh;break;default:d=ca}a=d.bind(null,i,a,n),d=void 0,!Ls||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),c?d!==void 0?n.addEventListener(i,a,{capture:!0,passive:d}):n.addEventListener(i,a,!0):d!==void 0?n.addEventListener(i,a,{passive:d}):n.addEventListener(i,a,!1)}function hh(n,i,a,c,d){var m=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var v=c.tag;if(v===3||v===4){var S=c.stateNode.containerInfo;if(S===d||S.nodeType===8&&S.parentNode===d)break;if(v===4)for(v=c.return;v!==null;){var N=v.tag;if((N===3||N===4)&&(N=v.stateNode.containerInfo,N===d||N.nodeType===8&&N.parentNode===d))return;v=v.return}for(;S!==null;){if(v=Zi(S),v===null)return;if(N=v.tag,N===5||N===6){c=m=v;continue e}S=S.parentNode}}c=c.return}ra(function(){var F=m,G=Os(a),Q=[];e:{var K=Mp.get(n);if(K!==void 0){var te=Ks,ae=n;switch(n){case"keypress":if(Ws(a)===0)break e;case"keydown":case"keyup":te=p;break;case"focusin":ae="focus",te=Xs;break;case"focusout":ae="blur",te=Xs;break;case"beforeblur":case"afterblur":te=Xs;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":te=Qs;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":te=zl;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":te=U;break;case Op:case Vp:case bp:te=kr;break;case Lp:te=Be;break;case"scroll":te=th;break;case"wheel":te=Oe;break;case"copy":case"cut":case"paste":te=Hl;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":te=w}var le=(i&4)!==0,lt=!le&&n==="scroll",M=le?K!==null?K+"Capture":null:K;le=[];for(var O=F,j;O!==null;){j=O;var X=j.stateNode;if(j.tag===5&&X!==null&&(j=X,M!==null&&(X=at(O,M),X!=null&&le.push(Ta(O,X,j)))),lt)break;O=O.return}0<le.length&&(K=new te(K,ae,null,a,G),Q.push({event:K,listeners:le}))}}if((i&7)===0){e:{if(K=n==="mouseover"||n==="pointerover",te=n==="mouseout"||n==="pointerout",K&&a!==Ui&&(ae=a.relatedTarget||a.fromElement)&&(Zi(ae)||ae[Cr]))break e;if((te||K)&&(K=G.window===G?G:(K=G.ownerDocument)?K.defaultView||K.parentWindow:window,te?(ae=a.relatedTarget||a.toElement,te=F,ae=ae?Zi(ae):null,ae!==null&&(lt=Ln(ae),ae!==lt||ae.tag!==5&&ae.tag!==6)&&(ae=null)):(te=null,ae=F),te!==ae)){if(le=Qs,X="onMouseLeave",M="onMouseEnter",O="mouse",(n==="pointerout"||n==="pointerover")&&(le=w,X="onPointerLeave",M="onPointerEnter",O="pointer"),lt=te==null?K:so(te),j=ae==null?K:so(ae),K=new le(X,O+"leave",te,a,G),K.target=lt,K.relatedTarget=j,X=null,Zi(G)===F&&(le=new le(M,O+"enter",ae,a,G),le.target=j,le.relatedTarget=lt,X=le),lt=X,te&&ae)t:{for(le=te,M=ae,O=0,j=le;j;j=ro(j))O++;for(j=0,X=M;X;X=ro(X))j++;for(;0<O-j;)le=ro(le),O--;for(;0<j-O;)M=ro(M),j--;for(;O--;){if(le===M||M!==null&&le===M.alternate)break t;le=ro(le),M=ro(M)}le=null}else le=null;te!==null&&Bp(Q,K,te,le,!1),ae!==null&&lt!==null&&Bp(Q,lt,ae,le,!0)}}e:{if(K=F?so(F):window,te=K.nodeName&&K.nodeName.toLowerCase(),te==="select"||te==="input"&&K.type==="file")var ue=pw;else if(wp(K))if(Ip)ue=_w;else{ue=gw;var ye=mw}else(te=K.nodeName)&&te.toLowerCase()==="input"&&(K.type==="checkbox"||K.type==="radio")&&(ue=yw);if(ue&&(ue=ue(n,F))){Tp(Q,ue,a,G);break e}ye&&ye(n,K,F),n==="focusout"&&(ye=K._wrapperState)&&ye.controlled&&K.type==="number"&&Ns(K,"number",K.value)}switch(ye=F?so(F):window,n){case"focusin":(wp(ye)||ye.contentEditable==="true")&&(to=ye,sh=F,va=null);break;case"focusout":va=sh=to=null;break;case"mousedown":oh=!0;break;case"contextmenu":case"mouseup":case"dragend":oh=!1,xp(Q,a,G);break;case"selectionchange":if(ww)break;case"keydown":case"keyup":xp(Q,a,G)}var _e;if(ct)e:{switch(n){case"compositionstart":var we="onCompositionStart";break e;case"compositionend":we="onCompositionEnd";break e;case"compositionupdate":we="onCompositionUpdate";break e}we=void 0}else eo?vp(n,a)&&(we="onCompositionEnd"):n==="keydown"&&a.keyCode===229&&(we="onCompositionStart");we&&(Ji&&a.locale!=="ko"&&(eo||we!=="onCompositionStart"?we==="onCompositionEnd"&&eo&&(_e=da()):(fn=G,qs="value"in fn?fn.value:fn.textContent,eo=!0)),ye=Jl(F,we),0<ye.length&&(we=new ma(we,n,null,a,G),Q.push({event:we,listeners:ye}),_e?we.data=_e:(_e=Ep(a),_e!==null&&(we.data=_e)))),(_e=pn?cw(n,a):hw(n,a))&&(F=Jl(F,"onBeforeInput"),0<F.length&&(G=new ma("onBeforeInput","beforeinput",null,a,G),Q.push({event:G,listeners:F}),G.data=_e))}Up(Q,i)})}function Ta(n,i,a){return{instance:n,listener:i,currentTarget:a}}function Jl(n,i){for(var a=i+"Capture",c=[];n!==null;){var d=n,m=d.stateNode;d.tag===5&&m!==null&&(d=m,m=at(n,a),m!=null&&c.unshift(Ta(n,m,d)),m=at(n,i),m!=null&&c.push(Ta(n,m,d))),n=n.return}return c}function ro(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Bp(n,i,a,c,d){for(var m=i._reactName,v=[];a!==null&&a!==c;){var S=a,N=S.alternate,F=S.stateNode;if(N!==null&&N===c)break;S.tag===5&&F!==null&&(S=F,d?(N=at(a,m),N!=null&&v.unshift(Ta(a,N,S))):d||(N=at(a,m),N!=null&&v.push(Ta(a,N,S)))),a=a.return}v.length!==0&&n.push({event:i,listeners:v})}var Aw=/\r\n?/g,Rw=/\u0000|\uFFFD/g;function $p(n){return(typeof n=="string"?n:""+n).replace(Aw,`
`).replace(Rw,"")}function Zl(n,i,a){if(i=$p(i),$p(n)!==i&&a)throw Error(t(425))}function eu(){}var dh=null,fh=null;function ph(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var mh=typeof setTimeout=="function"?setTimeout:void 0,kw=typeof clearTimeout=="function"?clearTimeout:void 0,Hp=typeof Promise=="function"?Promise:void 0,Cw=typeof queueMicrotask=="function"?queueMicrotask:typeof Hp<"u"?function(n){return Hp.resolve(null).then(n).catch(Pw)}:mh;function Pw(n){setTimeout(function(){throw n})}function gh(n,i){var a=i,c=0;do{var d=a.nextSibling;if(n.removeChild(a),d&&d.nodeType===8)if(a=d.data,a==="/$"){if(c===0){n.removeChild(d),zn(i);return}c--}else a!=="$"&&a!=="$?"&&a!=="$!"||c++;a=d}while(a);zn(i)}function ri(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function qp(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="$"||a==="$!"||a==="$?"){if(i===0)return n;i--}else a==="/$"&&i++}n=n.previousSibling}return null}var io=Math.random().toString(36).slice(2),or="__reactFiber$"+io,Ia="__reactProps$"+io,Cr="__reactContainer$"+io,yh="__reactEvents$"+io,Nw="__reactListeners$"+io,xw="__reactHandles$"+io;function Zi(n){var i=n[or];if(i)return i;for(var a=n.parentNode;a;){if(i=a[Cr]||a[or]){if(a=i.alternate,i.child!==null||a!==null&&a.child!==null)for(n=qp(n);n!==null;){if(a=n[or])return a;n=qp(n)}return i}n=a,a=n.parentNode}return null}function Sa(n){return n=n[or]||n[Cr],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function so(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function tu(n){return n[Ia]||null}var _h=[],oo=-1;function ii(n){return{current:n}}function Qe(n){0>oo||(n.current=_h[oo],_h[oo]=null,oo--)}function We(n,i){oo++,_h[oo]=n.current,n.current=i}var si={},jt=ii(si),en=ii(!1),es=si;function ao(n,i){var a=n.type.contextTypes;if(!a)return si;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var d={},m;for(m in a)d[m]=i[m];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=d),d}function tn(n){return n=n.childContextTypes,n!=null}function nu(){Qe(en),Qe(jt)}function Wp(n,i,a){if(jt.current!==si)throw Error(t(168));We(jt,i),We(en,a)}function Kp(n,i,a){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return a;c=c.getChildContext();for(var d in c)if(!(d in i))throw Error(t(108,Le(n)||"Unknown",d));return ee({},a,c)}function ru(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||si,es=jt.current,We(jt,n),We(en,en.current),!0}function Gp(n,i,a){var c=n.stateNode;if(!c)throw Error(t(169));a?(n=Kp(n,i,es),c.__reactInternalMemoizedMergedChildContext=n,Qe(en),Qe(jt),We(jt,n)):Qe(en),We(en,a)}var Pr=null,iu=!1,vh=!1;function Qp(n){Pr===null?Pr=[n]:Pr.push(n)}function Dw(n){iu=!0,Qp(n)}function oi(){if(!vh&&Pr!==null){vh=!0;var n=0,i=De;try{var a=Pr;for(De=1;n<a.length;n++){var c=a[n];do c=c(!0);while(c!==null)}Pr=null,iu=!1}catch(d){throw Pr!==null&&(Pr=Pr.slice(n+1)),Us(qi,oi),d}finally{De=i,vh=!1}}return null}var lo=[],uo=0,su=null,ou=0,In=[],Sn=0,ts=null,Nr=1,xr="";function ns(n,i){lo[uo++]=ou,lo[uo++]=su,su=n,ou=i}function Yp(n,i,a){In[Sn++]=Nr,In[Sn++]=xr,In[Sn++]=ts,ts=n;var c=Nr;n=xr;var d=32-Wt(c)-1;c&=~(1<<d),a+=1;var m=32-Wt(i)+d;if(30<m){var v=d-d%5;m=(c&(1<<v)-1).toString(32),c>>=v,d-=v,Nr=1<<32-Wt(i)+d|a<<d|c,xr=m+n}else Nr=1<<m|a<<d|c,xr=n}function Eh(n){n.return!==null&&(ns(n,1),Yp(n,1,0))}function wh(n){for(;n===su;)su=lo[--uo],lo[uo]=null,ou=lo[--uo],lo[uo]=null;for(;n===ts;)ts=In[--Sn],In[Sn]=null,xr=In[--Sn],In[Sn]=null,Nr=In[--Sn],In[Sn]=null}var mn=null,gn=null,et=!1,Hn=null;function Xp(n,i){var a=Cn(5,null,null,0);a.elementType="DELETED",a.stateNode=i,a.return=n,i=n.deletions,i===null?(n.deletions=[a],n.flags|=16):i.push(a)}function Jp(n,i){switch(n.tag){case 5:var a=n.type;return i=i.nodeType!==1||a.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,mn=n,gn=ri(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,mn=n,gn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(a=ts!==null?{id:Nr,overflow:xr}:null,n.memoizedState={dehydrated:i,treeContext:a,retryLane:1073741824},a=Cn(18,null,null,0),a.stateNode=i,a.return=n,n.child=a,mn=n,gn=null,!0):!1;default:return!1}}function Th(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ih(n){if(et){var i=gn;if(i){var a=i;if(!Jp(n,i)){if(Th(n))throw Error(t(418));i=ri(a.nextSibling);var c=mn;i&&Jp(n,i)?Xp(c,a):(n.flags=n.flags&-4097|2,et=!1,mn=n)}}else{if(Th(n))throw Error(t(418));n.flags=n.flags&-4097|2,et=!1,mn=n}}}function Zp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;mn=n}function au(n){if(n!==mn)return!1;if(!et)return Zp(n),et=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!ph(n.type,n.memoizedProps)),i&&(i=gn)){if(Th(n))throw em(),Error(t(418));for(;i;)Xp(n,i),i=ri(i.nextSibling)}if(Zp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var a=n.data;if(a==="/$"){if(i===0){gn=ri(n.nextSibling);break e}i--}else a!=="$"&&a!=="$!"&&a!=="$?"||i++}n=n.nextSibling}gn=null}}else gn=mn?ri(n.stateNode.nextSibling):null;return!0}function em(){for(var n=gn;n;)n=ri(n.nextSibling)}function co(){gn=mn=null,et=!1}function Sh(n){Hn===null?Hn=[n]:Hn.push(n)}var Ow=pe.ReactCurrentBatchConfig;function Aa(n,i,a){if(n=a.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(a._owner){if(a=a._owner,a){if(a.tag!==1)throw Error(t(309));var c=a.stateNode}if(!c)throw Error(t(147,n));var d=c,m=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===m?i.ref:(i=function(v){var S=d.refs;v===null?delete S[m]:S[m]=v},i._stringRef=m,i)}if(typeof n!="string")throw Error(t(284));if(!a._owner)throw Error(t(290,n))}return n}function lu(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function tm(n){var i=n._init;return i(n._payload)}function nm(n){function i(M,O){if(n){var j=M.deletions;j===null?(M.deletions=[O],M.flags|=16):j.push(O)}}function a(M,O){if(!n)return null;for(;O!==null;)i(M,O),O=O.sibling;return null}function c(M,O){for(M=new Map;O!==null;)O.key!==null?M.set(O.key,O):M.set(O.index,O),O=O.sibling;return M}function d(M,O){return M=pi(M,O),M.index=0,M.sibling=null,M}function m(M,O,j){return M.index=j,n?(j=M.alternate,j!==null?(j=j.index,j<O?(M.flags|=2,O):j):(M.flags|=2,O)):(M.flags|=1048576,O)}function v(M){return n&&M.alternate===null&&(M.flags|=2),M}function S(M,O,j,X){return O===null||O.tag!==6?(O=md(j,M.mode,X),O.return=M,O):(O=d(O,j),O.return=M,O)}function N(M,O,j,X){var ue=j.type;return ue===P?G(M,O,j.props.children,X,j.key):O!==null&&(O.elementType===ue||typeof ue=="object"&&ue!==null&&ue.$$typeof===Je&&tm(ue)===O.type)?(X=d(O,j.props),X.ref=Aa(M,O,j),X.return=M,X):(X=Du(j.type,j.key,j.props,null,M.mode,X),X.ref=Aa(M,O,j),X.return=M,X)}function F(M,O,j,X){return O===null||O.tag!==4||O.stateNode.containerInfo!==j.containerInfo||O.stateNode.implementation!==j.implementation?(O=gd(j,M.mode,X),O.return=M,O):(O=d(O,j.children||[]),O.return=M,O)}function G(M,O,j,X,ue){return O===null||O.tag!==7?(O=cs(j,M.mode,X,ue),O.return=M,O):(O=d(O,j),O.return=M,O)}function Q(M,O,j){if(typeof O=="string"&&O!==""||typeof O=="number")return O=md(""+O,M.mode,j),O.return=M,O;if(typeof O=="object"&&O!==null){switch(O.$$typeof){case be:return j=Du(O.type,O.key,O.props,null,M.mode,j),j.ref=Aa(M,null,O),j.return=M,j;case Te:return O=gd(O,M.mode,j),O.return=M,O;case Je:var X=O._init;return Q(M,X(O._payload),j)}if(vr(O)||he(O))return O=cs(O,M.mode,j,null),O.return=M,O;lu(M,O)}return null}function K(M,O,j,X){var ue=O!==null?O.key:null;if(typeof j=="string"&&j!==""||typeof j=="number")return ue!==null?null:S(M,O,""+j,X);if(typeof j=="object"&&j!==null){switch(j.$$typeof){case be:return j.key===ue?N(M,O,j,X):null;case Te:return j.key===ue?F(M,O,j,X):null;case Je:return ue=j._init,K(M,O,ue(j._payload),X)}if(vr(j)||he(j))return ue!==null?null:G(M,O,j,X,null);lu(M,j)}return null}function te(M,O,j,X,ue){if(typeof X=="string"&&X!==""||typeof X=="number")return M=M.get(j)||null,S(O,M,""+X,ue);if(typeof X=="object"&&X!==null){switch(X.$$typeof){case be:return M=M.get(X.key===null?j:X.key)||null,N(O,M,X,ue);case Te:return M=M.get(X.key===null?j:X.key)||null,F(O,M,X,ue);case Je:var ye=X._init;return te(M,O,j,ye(X._payload),ue)}if(vr(X)||he(X))return M=M.get(j)||null,G(O,M,X,ue,null);lu(O,X)}return null}function ae(M,O,j,X){for(var ue=null,ye=null,_e=O,we=O=0,Rt=null;_e!==null&&we<j.length;we++){_e.index>we?(Rt=_e,_e=null):Rt=_e.sibling;var je=K(M,_e,j[we],X);if(je===null){_e===null&&(_e=Rt);break}n&&_e&&je.alternate===null&&i(M,_e),O=m(je,O,we),ye===null?ue=je:ye.sibling=je,ye=je,_e=Rt}if(we===j.length)return a(M,_e),et&&ns(M,we),ue;if(_e===null){for(;we<j.length;we++)_e=Q(M,j[we],X),_e!==null&&(O=m(_e,O,we),ye===null?ue=_e:ye.sibling=_e,ye=_e);return et&&ns(M,we),ue}for(_e=c(M,_e);we<j.length;we++)Rt=te(_e,M,we,j[we],X),Rt!==null&&(n&&Rt.alternate!==null&&_e.delete(Rt.key===null?we:Rt.key),O=m(Rt,O,we),ye===null?ue=Rt:ye.sibling=Rt,ye=Rt);return n&&_e.forEach(function(mi){return i(M,mi)}),et&&ns(M,we),ue}function le(M,O,j,X){var ue=he(j);if(typeof ue!="function")throw Error(t(150));if(j=ue.call(j),j==null)throw Error(t(151));for(var ye=ue=null,_e=O,we=O=0,Rt=null,je=j.next();_e!==null&&!je.done;we++,je=j.next()){_e.index>we?(Rt=_e,_e=null):Rt=_e.sibling;var mi=K(M,_e,je.value,X);if(mi===null){_e===null&&(_e=Rt);break}n&&_e&&mi.alternate===null&&i(M,_e),O=m(mi,O,we),ye===null?ue=mi:ye.sibling=mi,ye=mi,_e=Rt}if(je.done)return a(M,_e),et&&ns(M,we),ue;if(_e===null){for(;!je.done;we++,je=j.next())je=Q(M,je.value,X),je!==null&&(O=m(je,O,we),ye===null?ue=je:ye.sibling=je,ye=je);return et&&ns(M,we),ue}for(_e=c(M,_e);!je.done;we++,je=j.next())je=te(_e,M,we,je.value,X),je!==null&&(n&&je.alternate!==null&&_e.delete(je.key===null?we:je.key),O=m(je,O,we),ye===null?ue=je:ye.sibling=je,ye=je);return n&&_e.forEach(function(d0){return i(M,d0)}),et&&ns(M,we),ue}function lt(M,O,j,X){if(typeof j=="object"&&j!==null&&j.type===P&&j.key===null&&(j=j.props.children),typeof j=="object"&&j!==null){switch(j.$$typeof){case be:e:{for(var ue=j.key,ye=O;ye!==null;){if(ye.key===ue){if(ue=j.type,ue===P){if(ye.tag===7){a(M,ye.sibling),O=d(ye,j.props.children),O.return=M,M=O;break e}}else if(ye.elementType===ue||typeof ue=="object"&&ue!==null&&ue.$$typeof===Je&&tm(ue)===ye.type){a(M,ye.sibling),O=d(ye,j.props),O.ref=Aa(M,ye,j),O.return=M,M=O;break e}a(M,ye);break}else i(M,ye);ye=ye.sibling}j.type===P?(O=cs(j.props.children,M.mode,X,j.key),O.return=M,M=O):(X=Du(j.type,j.key,j.props,null,M.mode,X),X.ref=Aa(M,O,j),X.return=M,M=X)}return v(M);case Te:e:{for(ye=j.key;O!==null;){if(O.key===ye)if(O.tag===4&&O.stateNode.containerInfo===j.containerInfo&&O.stateNode.implementation===j.implementation){a(M,O.sibling),O=d(O,j.children||[]),O.return=M,M=O;break e}else{a(M,O);break}else i(M,O);O=O.sibling}O=gd(j,M.mode,X),O.return=M,M=O}return v(M);case Je:return ye=j._init,lt(M,O,ye(j._payload),X)}if(vr(j))return ae(M,O,j,X);if(he(j))return le(M,O,j,X);lu(M,j)}return typeof j=="string"&&j!==""||typeof j=="number"?(j=""+j,O!==null&&O.tag===6?(a(M,O.sibling),O=d(O,j),O.return=M,M=O):(a(M,O),O=md(j,M.mode,X),O.return=M,M=O),v(M)):a(M,O)}return lt}var ho=nm(!0),rm=nm(!1),uu=ii(null),cu=null,fo=null,Ah=null;function Rh(){Ah=fo=cu=null}function kh(n){var i=uu.current;Qe(uu),n._currentValue=i}function Ch(n,i,a){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===a)break;n=n.return}}function po(n,i){cu=n,Ah=fo=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(nn=!0),n.firstContext=null)}function An(n){var i=n._currentValue;if(Ah!==n)if(n={context:n,memoizedValue:i,next:null},fo===null){if(cu===null)throw Error(t(308));fo=n,cu.dependencies={lanes:0,firstContext:n}}else fo=fo.next=n;return i}var rs=null;function Ph(n){rs===null?rs=[n]:rs.push(n)}function im(n,i,a,c){var d=i.interleaved;return d===null?(a.next=a,Ph(i)):(a.next=d.next,d.next=a),i.interleaved=a,Dr(n,c)}function Dr(n,i){n.lanes|=i;var a=n.alternate;for(a!==null&&(a.lanes|=i),a=n,n=n.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),a=n,n=n.return;return a.tag===3?a.stateNode:null}var ai=!1;function Nh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sm(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Or(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function li(n,i,a){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Me&2)!==0){var d=c.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),c.pending=i,Dr(n,a)}return d=c.interleaved,d===null?(i.next=i,Ph(c)):(i.next=d.next,d.next=i),c.interleaved=i,Dr(n,a)}function hu(n,i,a){if(i=i.updateQueue,i!==null&&(i=i.shared,(a&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,Xr(n,a)}}function om(n,i){var a=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,a===c)){var d=null,m=null;if(a=a.firstBaseUpdate,a!==null){do{var v={eventTime:a.eventTime,lane:a.lane,tag:a.tag,payload:a.payload,callback:a.callback,next:null};m===null?d=m=v:m=m.next=v,a=a.next}while(a!==null);m===null?d=m=i:m=m.next=i}else d=m=i;a={baseState:c.baseState,firstBaseUpdate:d,lastBaseUpdate:m,shared:c.shared,effects:c.effects},n.updateQueue=a;return}n=a.lastBaseUpdate,n===null?a.firstBaseUpdate=i:n.next=i,a.lastBaseUpdate=i}function du(n,i,a,c){var d=n.updateQueue;ai=!1;var m=d.firstBaseUpdate,v=d.lastBaseUpdate,S=d.shared.pending;if(S!==null){d.shared.pending=null;var N=S,F=N.next;N.next=null,v===null?m=F:v.next=F,v=N;var G=n.alternate;G!==null&&(G=G.updateQueue,S=G.lastBaseUpdate,S!==v&&(S===null?G.firstBaseUpdate=F:S.next=F,G.lastBaseUpdate=N))}if(m!==null){var Q=d.baseState;v=0,G=F=N=null,S=m;do{var K=S.lane,te=S.eventTime;if((c&K)===K){G!==null&&(G=G.next={eventTime:te,lane:0,tag:S.tag,payload:S.payload,callback:S.callback,next:null});e:{var ae=n,le=S;switch(K=i,te=a,le.tag){case 1:if(ae=le.payload,typeof ae=="function"){Q=ae.call(te,Q,K);break e}Q=ae;break e;case 3:ae.flags=ae.flags&-65537|128;case 0:if(ae=le.payload,K=typeof ae=="function"?ae.call(te,Q,K):ae,K==null)break e;Q=ee({},Q,K);break e;case 2:ai=!0}}S.callback!==null&&S.lane!==0&&(n.flags|=64,K=d.effects,K===null?d.effects=[S]:K.push(S))}else te={eventTime:te,lane:K,tag:S.tag,payload:S.payload,callback:S.callback,next:null},G===null?(F=G=te,N=Q):G=G.next=te,v|=K;if(S=S.next,S===null){if(S=d.shared.pending,S===null)break;K=S,S=K.next,K.next=null,d.lastBaseUpdate=K,d.shared.pending=null}}while(!0);if(G===null&&(N=Q),d.baseState=N,d.firstBaseUpdate=F,d.lastBaseUpdate=G,i=d.shared.interleaved,i!==null){d=i;do v|=d.lane,d=d.next;while(d!==i)}else m===null&&(d.shared.lanes=0);os|=v,n.lanes=v,n.memoizedState=Q}}function am(n,i,a){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],d=c.callback;if(d!==null){if(c.callback=null,c=a,typeof d!="function")throw Error(t(191,d));d.call(c)}}}var Ra={},ar=ii(Ra),ka=ii(Ra),Ca=ii(Ra);function is(n){if(n===Ra)throw Error(t(174));return n}function xh(n,i){switch(We(Ca,i),We(ka,n),We(ar,Ra),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:yt(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=yt(i,n)}Qe(ar),We(ar,i)}function mo(){Qe(ar),Qe(ka),Qe(Ca)}function lm(n){is(Ca.current);var i=is(ar.current),a=yt(i,n.type);i!==a&&(We(ka,n),We(ar,a))}function Dh(n){ka.current===n&&(Qe(ar),Qe(ka))}var nt=ii(0);function fu(n){for(var i=n;i!==null;){if(i.tag===13){var a=i.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||a.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Oh=[];function Vh(){for(var n=0;n<Oh.length;n++)Oh[n]._workInProgressVersionPrimary=null;Oh.length=0}var pu=pe.ReactCurrentDispatcher,bh=pe.ReactCurrentBatchConfig,ss=0,rt=null,vt=null,St=null,mu=!1,Pa=!1,Na=0,Vw=0;function Ft(){throw Error(t(321))}function Lh(n,i){if(i===null)return!1;for(var a=0;a<i.length&&a<n.length;a++)if(!$n(n[a],i[a]))return!1;return!0}function Mh(n,i,a,c,d,m){if(ss=m,rt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,pu.current=n===null||n.memoizedState===null?jw:Fw,n=a(c,d),Pa){m=0;do{if(Pa=!1,Na=0,25<=m)throw Error(t(301));m+=1,St=vt=null,i.updateQueue=null,pu.current=Uw,n=a(c,d)}while(Pa)}if(pu.current=_u,i=vt!==null&&vt.next!==null,ss=0,St=vt=rt=null,mu=!1,i)throw Error(t(300));return n}function jh(){var n=Na!==0;return Na=0,n}function lr(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return St===null?rt.memoizedState=St=n:St=St.next=n,St}function Rn(){if(vt===null){var n=rt.alternate;n=n!==null?n.memoizedState:null}else n=vt.next;var i=St===null?rt.memoizedState:St.next;if(i!==null)St=i,vt=n;else{if(n===null)throw Error(t(310));vt=n,n={memoizedState:vt.memoizedState,baseState:vt.baseState,baseQueue:vt.baseQueue,queue:vt.queue,next:null},St===null?rt.memoizedState=St=n:St=St.next=n}return St}function xa(n,i){return typeof i=="function"?i(n):i}function Fh(n){var i=Rn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=vt,d=c.baseQueue,m=a.pending;if(m!==null){if(d!==null){var v=d.next;d.next=m.next,m.next=v}c.baseQueue=d=m,a.pending=null}if(d!==null){m=d.next,c=c.baseState;var S=v=null,N=null,F=m;do{var G=F.lane;if((ss&G)===G)N!==null&&(N=N.next={lane:0,action:F.action,hasEagerState:F.hasEagerState,eagerState:F.eagerState,next:null}),c=F.hasEagerState?F.eagerState:n(c,F.action);else{var Q={lane:G,action:F.action,hasEagerState:F.hasEagerState,eagerState:F.eagerState,next:null};N===null?(S=N=Q,v=c):N=N.next=Q,rt.lanes|=G,os|=G}F=F.next}while(F!==null&&F!==m);N===null?v=c:N.next=S,$n(c,i.memoizedState)||(nn=!0),i.memoizedState=c,i.baseState=v,i.baseQueue=N,a.lastRenderedState=c}if(n=a.interleaved,n!==null){d=n;do m=d.lane,rt.lanes|=m,os|=m,d=d.next;while(d!==n)}else d===null&&(a.lanes=0);return[i.memoizedState,a.dispatch]}function Uh(n){var i=Rn(),a=i.queue;if(a===null)throw Error(t(311));a.lastRenderedReducer=n;var c=a.dispatch,d=a.pending,m=i.memoizedState;if(d!==null){a.pending=null;var v=d=d.next;do m=n(m,v.action),v=v.next;while(v!==d);$n(m,i.memoizedState)||(nn=!0),i.memoizedState=m,i.baseQueue===null&&(i.baseState=m),a.lastRenderedState=m}return[m,c]}function um(){}function cm(n,i){var a=rt,c=Rn(),d=i(),m=!$n(c.memoizedState,d);if(m&&(c.memoizedState=d,nn=!0),c=c.queue,zh(fm.bind(null,a,c,n),[n]),c.getSnapshot!==i||m||St!==null&&St.memoizedState.tag&1){if(a.flags|=2048,Da(9,dm.bind(null,a,c,d,i),void 0,null),At===null)throw Error(t(349));(ss&30)!==0||hm(a,i,d)}return d}function hm(n,i,a){n.flags|=16384,n={getSnapshot:i,value:a},i=rt.updateQueue,i===null?(i={lastEffect:null,stores:null},rt.updateQueue=i,i.stores=[n]):(a=i.stores,a===null?i.stores=[n]:a.push(n))}function dm(n,i,a,c){i.value=a,i.getSnapshot=c,pm(i)&&mm(n)}function fm(n,i,a){return a(function(){pm(i)&&mm(n)})}function pm(n){var i=n.getSnapshot;n=n.value;try{var a=i();return!$n(n,a)}catch{return!0}}function mm(n){var i=Dr(n,1);i!==null&&Gn(i,n,1,-1)}function gm(n){var i=lr();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:xa,lastRenderedState:n},i.queue=n,n=n.dispatch=Mw.bind(null,rt,n),[i.memoizedState,n]}function Da(n,i,a,c){return n={tag:n,create:i,destroy:a,deps:c,next:null},i=rt.updateQueue,i===null?(i={lastEffect:null,stores:null},rt.updateQueue=i,i.lastEffect=n.next=n):(a=i.lastEffect,a===null?i.lastEffect=n.next=n:(c=a.next,a.next=n,n.next=c,i.lastEffect=n)),n}function ym(){return Rn().memoizedState}function gu(n,i,a,c){var d=lr();rt.flags|=n,d.memoizedState=Da(1|i,a,void 0,c===void 0?null:c)}function yu(n,i,a,c){var d=Rn();c=c===void 0?null:c;var m=void 0;if(vt!==null){var v=vt.memoizedState;if(m=v.destroy,c!==null&&Lh(c,v.deps)){d.memoizedState=Da(i,a,m,c);return}}rt.flags|=n,d.memoizedState=Da(1|i,a,m,c)}function _m(n,i){return gu(8390656,8,n,i)}function zh(n,i){return yu(2048,8,n,i)}function vm(n,i){return yu(4,2,n,i)}function Em(n,i){return yu(4,4,n,i)}function wm(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Tm(n,i,a){return a=a!=null?a.concat([n]):null,yu(4,4,wm.bind(null,i,n),a)}function Bh(){}function Im(n,i){var a=Rn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Lh(i,c[1])?c[0]:(a.memoizedState=[n,i],n)}function Sm(n,i){var a=Rn();i=i===void 0?null:i;var c=a.memoizedState;return c!==null&&i!==null&&Lh(i,c[1])?c[0]:(n=n(),a.memoizedState=[n,i],n)}function Am(n,i,a){return(ss&21)===0?(n.baseState&&(n.baseState=!1,nn=!0),n.memoizedState=a):($n(a,i)||(a=Gi(),rt.lanes|=a,os|=a,n.baseState=!0),i)}function bw(n,i){var a=De;De=a!==0&&4>a?a:4,n(!0);var c=bh.transition;bh.transition={};try{n(!1),i()}finally{De=a,bh.transition=c}}function Rm(){return Rn().memoizedState}function Lw(n,i,a){var c=di(n);if(a={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null},km(n))Cm(i,a);else if(a=im(n,i,a,c),a!==null){var d=Qt();Gn(a,n,c,d),Pm(a,i,c)}}function Mw(n,i,a){var c=di(n),d={lane:c,action:a,hasEagerState:!1,eagerState:null,next:null};if(km(n))Cm(i,d);else{var m=n.alternate;if(n.lanes===0&&(m===null||m.lanes===0)&&(m=i.lastRenderedReducer,m!==null))try{var v=i.lastRenderedState,S=m(v,a);if(d.hasEagerState=!0,d.eagerState=S,$n(S,v)){var N=i.interleaved;N===null?(d.next=d,Ph(i)):(d.next=N.next,N.next=d),i.interleaved=d;return}}catch{}finally{}a=im(n,i,d,c),a!==null&&(d=Qt(),Gn(a,n,c,d),Pm(a,i,c))}}function km(n){var i=n.alternate;return n===rt||i!==null&&i===rt}function Cm(n,i){Pa=mu=!0;var a=n.pending;a===null?i.next=i:(i.next=a.next,a.next=i),n.pending=i}function Pm(n,i,a){if((a&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,a|=c,i.lanes=a,Xr(n,a)}}var _u={readContext:An,useCallback:Ft,useContext:Ft,useEffect:Ft,useImperativeHandle:Ft,useInsertionEffect:Ft,useLayoutEffect:Ft,useMemo:Ft,useReducer:Ft,useRef:Ft,useState:Ft,useDebugValue:Ft,useDeferredValue:Ft,useTransition:Ft,useMutableSource:Ft,useSyncExternalStore:Ft,useId:Ft,unstable_isNewReconciler:!1},jw={readContext:An,useCallback:function(n,i){return lr().memoizedState=[n,i===void 0?null:i],n},useContext:An,useEffect:_m,useImperativeHandle:function(n,i,a){return a=a!=null?a.concat([n]):null,gu(4194308,4,wm.bind(null,i,n),a)},useLayoutEffect:function(n,i){return gu(4194308,4,n,i)},useInsertionEffect:function(n,i){return gu(4,2,n,i)},useMemo:function(n,i){var a=lr();return i=i===void 0?null:i,n=n(),a.memoizedState=[n,i],n},useReducer:function(n,i,a){var c=lr();return i=a!==void 0?a(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=Lw.bind(null,rt,n),[c.memoizedState,n]},useRef:function(n){var i=lr();return n={current:n},i.memoizedState=n},useState:gm,useDebugValue:Bh,useDeferredValue:function(n){return lr().memoizedState=n},useTransition:function(){var n=gm(!1),i=n[0];return n=bw.bind(null,n[1]),lr().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,a){var c=rt,d=lr();if(et){if(a===void 0)throw Error(t(407));a=a()}else{if(a=i(),At===null)throw Error(t(349));(ss&30)!==0||hm(c,i,a)}d.memoizedState=a;var m={value:a,getSnapshot:i};return d.queue=m,_m(fm.bind(null,c,m,n),[n]),c.flags|=2048,Da(9,dm.bind(null,c,m,a,i),void 0,null),a},useId:function(){var n=lr(),i=At.identifierPrefix;if(et){var a=xr,c=Nr;a=(c&~(1<<32-Wt(c)-1)).toString(32)+a,i=":"+i+"R"+a,a=Na++,0<a&&(i+="H"+a.toString(32)),i+=":"}else a=Vw++,i=":"+i+"r"+a.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},Fw={readContext:An,useCallback:Im,useContext:An,useEffect:zh,useImperativeHandle:Tm,useInsertionEffect:vm,useLayoutEffect:Em,useMemo:Sm,useReducer:Fh,useRef:ym,useState:function(){return Fh(xa)},useDebugValue:Bh,useDeferredValue:function(n){var i=Rn();return Am(i,vt.memoizedState,n)},useTransition:function(){var n=Fh(xa)[0],i=Rn().memoizedState;return[n,i]},useMutableSource:um,useSyncExternalStore:cm,useId:Rm,unstable_isNewReconciler:!1},Uw={readContext:An,useCallback:Im,useContext:An,useEffect:zh,useImperativeHandle:Tm,useInsertionEffect:vm,useLayoutEffect:Em,useMemo:Sm,useReducer:Uh,useRef:ym,useState:function(){return Uh(xa)},useDebugValue:Bh,useDeferredValue:function(n){var i=Rn();return vt===null?i.memoizedState=n:Am(i,vt.memoizedState,n)},useTransition:function(){var n=Uh(xa)[0],i=Rn().memoizedState;return[n,i]},useMutableSource:um,useSyncExternalStore:cm,useId:Rm,unstable_isNewReconciler:!1};function qn(n,i){if(n&&n.defaultProps){i=ee({},i),n=n.defaultProps;for(var a in n)i[a]===void 0&&(i[a]=n[a]);return i}return i}function $h(n,i,a,c){i=n.memoizedState,a=a(c,i),a=a==null?i:ee({},i,a),n.memoizedState=a,n.lanes===0&&(n.updateQueue.baseState=a)}var vu={isMounted:function(n){return(n=n._reactInternals)?Ln(n)===n:!1},enqueueSetState:function(n,i,a){n=n._reactInternals;var c=Qt(),d=di(n),m=Or(c,d);m.payload=i,a!=null&&(m.callback=a),i=li(n,m,d),i!==null&&(Gn(i,n,d,c),hu(i,n,d))},enqueueReplaceState:function(n,i,a){n=n._reactInternals;var c=Qt(),d=di(n),m=Or(c,d);m.tag=1,m.payload=i,a!=null&&(m.callback=a),i=li(n,m,d),i!==null&&(Gn(i,n,d,c),hu(i,n,d))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var a=Qt(),c=di(n),d=Or(a,c);d.tag=2,i!=null&&(d.callback=i),i=li(n,d,c),i!==null&&(Gn(i,n,c,a),hu(i,n,c))}};function Nm(n,i,a,c,d,m,v){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,m,v):i.prototype&&i.prototype.isPureReactComponent?!_a(a,c)||!_a(d,m):!0}function xm(n,i,a){var c=!1,d=si,m=i.contextType;return typeof m=="object"&&m!==null?m=An(m):(d=tn(i)?es:jt.current,c=i.contextTypes,m=(c=c!=null)?ao(n,d):si),i=new i(a,m),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=vu,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=m),i}function Dm(n,i,a,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(a,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(a,c),i.state!==n&&vu.enqueueReplaceState(i,i.state,null)}function Hh(n,i,a,c){var d=n.stateNode;d.props=a,d.state=n.memoizedState,d.refs={},Nh(n);var m=i.contextType;typeof m=="object"&&m!==null?d.context=An(m):(m=tn(i)?es:jt.current,d.context=ao(n,m)),d.state=n.memoizedState,m=i.getDerivedStateFromProps,typeof m=="function"&&($h(n,i,m,a),d.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&vu.enqueueReplaceState(d,d.state,null),du(n,a,d,c),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function go(n,i){try{var a="",c=i;do a+=Re(c),c=c.return;while(c);var d=a}catch(m){d=`
Error generating stack: `+m.message+`
`+m.stack}return{value:n,source:i,stack:d,digest:null}}function qh(n,i,a){return{value:n,source:null,stack:a??null,digest:i??null}}function Wh(n,i){try{console.error(i.value)}catch(a){setTimeout(function(){throw a})}}var zw=typeof WeakMap=="function"?WeakMap:Map;function Om(n,i,a){a=Or(-1,a),a.tag=3,a.payload={element:null};var c=i.value;return a.callback=function(){Ru||(Ru=!0,ad=c),Wh(n,i)},a}function Vm(n,i,a){a=Or(-1,a),a.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var d=i.value;a.payload=function(){return c(d)},a.callback=function(){Wh(n,i)}}var m=n.stateNode;return m!==null&&typeof m.componentDidCatch=="function"&&(a.callback=function(){Wh(n,i),typeof c!="function"&&(ci===null?ci=new Set([this]):ci.add(this));var v=i.stack;this.componentDidCatch(i.value,{componentStack:v!==null?v:""})}),a}function bm(n,i,a){var c=n.pingCache;if(c===null){c=n.pingCache=new zw;var d=new Set;c.set(i,d)}else d=c.get(i),d===void 0&&(d=new Set,c.set(i,d));d.has(a)||(d.add(a),n=t0.bind(null,n,i,a),i.then(n,n))}function Lm(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function Mm(n,i,a,c,d){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,a.flags|=131072,a.flags&=-52805,a.tag===1&&(a.alternate===null?a.tag=17:(i=Or(-1,1),i.tag=2,li(a,i,1))),a.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var Bw=pe.ReactCurrentOwner,nn=!1;function Gt(n,i,a,c){i.child=n===null?rm(i,null,a,c):ho(i,n.child,a,c)}function jm(n,i,a,c,d){a=a.render;var m=i.ref;return po(i,d),c=Mh(n,i,a,c,m,d),a=jh(),n!==null&&!nn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Vr(n,i,d)):(et&&a&&Eh(i),i.flags|=1,Gt(n,i,c,d),i.child)}function Fm(n,i,a,c,d){if(n===null){var m=a.type;return typeof m=="function"&&!pd(m)&&m.defaultProps===void 0&&a.compare===null&&a.defaultProps===void 0?(i.tag=15,i.type=m,Um(n,i,m,c,d)):(n=Du(a.type,null,c,i,i.mode,d),n.ref=i.ref,n.return=i,i.child=n)}if(m=n.child,(n.lanes&d)===0){var v=m.memoizedProps;if(a=a.compare,a=a!==null?a:_a,a(v,c)&&n.ref===i.ref)return Vr(n,i,d)}return i.flags|=1,n=pi(m,c),n.ref=i.ref,n.return=i,i.child=n}function Um(n,i,a,c,d){if(n!==null){var m=n.memoizedProps;if(_a(m,c)&&n.ref===i.ref)if(nn=!1,i.pendingProps=c=m,(n.lanes&d)!==0)(n.flags&131072)!==0&&(nn=!0);else return i.lanes=n.lanes,Vr(n,i,d)}return Kh(n,i,a,c,d)}function zm(n,i,a){var c=i.pendingProps,d=c.children,m=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},We(_o,yn),yn|=a;else{if((a&1073741824)===0)return n=m!==null?m.baseLanes|a:a,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,We(_o,yn),yn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=m!==null?m.baseLanes:a,We(_o,yn),yn|=c}else m!==null?(c=m.baseLanes|a,i.memoizedState=null):c=a,We(_o,yn),yn|=c;return Gt(n,i,d,a),i.child}function Bm(n,i){var a=i.ref;(n===null&&a!==null||n!==null&&n.ref!==a)&&(i.flags|=512,i.flags|=2097152)}function Kh(n,i,a,c,d){var m=tn(a)?es:jt.current;return m=ao(i,m),po(i,d),a=Mh(n,i,a,c,m,d),c=jh(),n!==null&&!nn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Vr(n,i,d)):(et&&c&&Eh(i),i.flags|=1,Gt(n,i,a,d),i.child)}function $m(n,i,a,c,d){if(tn(a)){var m=!0;ru(i)}else m=!1;if(po(i,d),i.stateNode===null)wu(n,i),xm(i,a,c),Hh(i,a,c,d),c=!0;else if(n===null){var v=i.stateNode,S=i.memoizedProps;v.props=S;var N=v.context,F=a.contextType;typeof F=="object"&&F!==null?F=An(F):(F=tn(a)?es:jt.current,F=ao(i,F));var G=a.getDerivedStateFromProps,Q=typeof G=="function"||typeof v.getSnapshotBeforeUpdate=="function";Q||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==c||N!==F)&&Dm(i,v,c,F),ai=!1;var K=i.memoizedState;v.state=K,du(i,c,v,d),N=i.memoizedState,S!==c||K!==N||en.current||ai?(typeof G=="function"&&($h(i,a,G,c),N=i.memoizedState),(S=ai||Nm(i,a,S,c,K,N,F))?(Q||typeof v.UNSAFE_componentWillMount!="function"&&typeof v.componentWillMount!="function"||(typeof v.componentWillMount=="function"&&v.componentWillMount(),typeof v.UNSAFE_componentWillMount=="function"&&v.UNSAFE_componentWillMount()),typeof v.componentDidMount=="function"&&(i.flags|=4194308)):(typeof v.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=N),v.props=c,v.state=N,v.context=F,c=S):(typeof v.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{v=i.stateNode,sm(n,i),S=i.memoizedProps,F=i.type===i.elementType?S:qn(i.type,S),v.props=F,Q=i.pendingProps,K=v.context,N=a.contextType,typeof N=="object"&&N!==null?N=An(N):(N=tn(a)?es:jt.current,N=ao(i,N));var te=a.getDerivedStateFromProps;(G=typeof te=="function"||typeof v.getSnapshotBeforeUpdate=="function")||typeof v.UNSAFE_componentWillReceiveProps!="function"&&typeof v.componentWillReceiveProps!="function"||(S!==Q||K!==N)&&Dm(i,v,c,N),ai=!1,K=i.memoizedState,v.state=K,du(i,c,v,d);var ae=i.memoizedState;S!==Q||K!==ae||en.current||ai?(typeof te=="function"&&($h(i,a,te,c),ae=i.memoizedState),(F=ai||Nm(i,a,F,c,K,ae,N)||!1)?(G||typeof v.UNSAFE_componentWillUpdate!="function"&&typeof v.componentWillUpdate!="function"||(typeof v.componentWillUpdate=="function"&&v.componentWillUpdate(c,ae,N),typeof v.UNSAFE_componentWillUpdate=="function"&&v.UNSAFE_componentWillUpdate(c,ae,N)),typeof v.componentDidUpdate=="function"&&(i.flags|=4),typeof v.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=ae),v.props=c,v.state=ae,v.context=N,c=F):(typeof v.componentDidUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=4),typeof v.getSnapshotBeforeUpdate!="function"||S===n.memoizedProps&&K===n.memoizedState||(i.flags|=1024),c=!1)}return Gh(n,i,a,c,m,d)}function Gh(n,i,a,c,d,m){Bm(n,i);var v=(i.flags&128)!==0;if(!c&&!v)return d&&Gp(i,a,!1),Vr(n,i,m);c=i.stateNode,Bw.current=i;var S=v&&typeof a.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&v?(i.child=ho(i,n.child,null,m),i.child=ho(i,null,S,m)):Gt(n,i,S,m),i.memoizedState=c.state,d&&Gp(i,a,!0),i.child}function Hm(n){var i=n.stateNode;i.pendingContext?Wp(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Wp(n,i.context,!1),xh(n,i.containerInfo)}function qm(n,i,a,c,d){return co(),Sh(d),i.flags|=256,Gt(n,i,a,c),i.child}var Qh={dehydrated:null,treeContext:null,retryLane:0};function Yh(n){return{baseLanes:n,cachePool:null,transitions:null}}function Wm(n,i,a){var c=i.pendingProps,d=nt.current,m=!1,v=(i.flags&128)!==0,S;if((S=v)||(S=n!==null&&n.memoizedState===null?!1:(d&2)!==0),S?(m=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),We(nt,d&1),n===null)return Ih(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(v=c.children,n=c.fallback,m?(c=i.mode,m=i.child,v={mode:"hidden",children:v},(c&1)===0&&m!==null?(m.childLanes=0,m.pendingProps=v):m=Ou(v,c,0,null),n=cs(n,c,a,null),m.return=i,n.return=i,m.sibling=n,i.child=m,i.child.memoizedState=Yh(a),i.memoizedState=Qh,n):Xh(i,v));if(d=n.memoizedState,d!==null&&(S=d.dehydrated,S!==null))return $w(n,i,v,c,S,d,a);if(m){m=c.fallback,v=i.mode,d=n.child,S=d.sibling;var N={mode:"hidden",children:c.children};return(v&1)===0&&i.child!==d?(c=i.child,c.childLanes=0,c.pendingProps=N,i.deletions=null):(c=pi(d,N),c.subtreeFlags=d.subtreeFlags&14680064),S!==null?m=pi(S,m):(m=cs(m,v,a,null),m.flags|=2),m.return=i,c.return=i,c.sibling=m,i.child=c,c=m,m=i.child,v=n.child.memoizedState,v=v===null?Yh(a):{baseLanes:v.baseLanes|a,cachePool:null,transitions:v.transitions},m.memoizedState=v,m.childLanes=n.childLanes&~a,i.memoizedState=Qh,c}return m=n.child,n=m.sibling,c=pi(m,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=a),c.return=i,c.sibling=null,n!==null&&(a=i.deletions,a===null?(i.deletions=[n],i.flags|=16):a.push(n)),i.child=c,i.memoizedState=null,c}function Xh(n,i){return i=Ou({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Eu(n,i,a,c){return c!==null&&Sh(c),ho(i,n.child,null,a),n=Xh(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function $w(n,i,a,c,d,m,v){if(a)return i.flags&256?(i.flags&=-257,c=qh(Error(t(422))),Eu(n,i,v,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(m=c.fallback,d=i.mode,c=Ou({mode:"visible",children:c.children},d,0,null),m=cs(m,d,v,null),m.flags|=2,c.return=i,m.return=i,c.sibling=m,i.child=c,(i.mode&1)!==0&&ho(i,n.child,null,v),i.child.memoizedState=Yh(v),i.memoizedState=Qh,m);if((i.mode&1)===0)return Eu(n,i,v,null);if(d.data==="$!"){if(c=d.nextSibling&&d.nextSibling.dataset,c)var S=c.dgst;return c=S,m=Error(t(419)),c=qh(m,c,void 0),Eu(n,i,v,c)}if(S=(v&n.childLanes)!==0,nn||S){if(c=At,c!==null){switch(v&-v){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(c.suspendedLanes|v))!==0?0:d,d!==0&&d!==m.retryLane&&(m.retryLane=d,Dr(n,d),Gn(c,n,d,-1))}return fd(),c=qh(Error(t(421))),Eu(n,i,v,c)}return d.data==="$?"?(i.flags|=128,i.child=n.child,i=n0.bind(null,n),d._reactRetry=i,null):(n=m.treeContext,gn=ri(d.nextSibling),mn=i,et=!0,Hn=null,n!==null&&(In[Sn++]=Nr,In[Sn++]=xr,In[Sn++]=ts,Nr=n.id,xr=n.overflow,ts=i),i=Xh(i,c.children),i.flags|=4096,i)}function Km(n,i,a){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),Ch(n.return,i,a)}function Jh(n,i,a,c,d){var m=n.memoizedState;m===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:a,tailMode:d}:(m.isBackwards=i,m.rendering=null,m.renderingStartTime=0,m.last=c,m.tail=a,m.tailMode=d)}function Gm(n,i,a){var c=i.pendingProps,d=c.revealOrder,m=c.tail;if(Gt(n,i,c.children,a),c=nt.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Km(n,a,i);else if(n.tag===19)Km(n,a,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(We(nt,c),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(a=i.child,d=null;a!==null;)n=a.alternate,n!==null&&fu(n)===null&&(d=a),a=a.sibling;a=d,a===null?(d=i.child,i.child=null):(d=a.sibling,a.sibling=null),Jh(i,!1,d,a,m);break;case"backwards":for(a=null,d=i.child,i.child=null;d!==null;){if(n=d.alternate,n!==null&&fu(n)===null){i.child=d;break}n=d.sibling,d.sibling=a,a=d,d=n}Jh(i,!0,a,null,m);break;case"together":Jh(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function wu(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Vr(n,i,a){if(n!==null&&(i.dependencies=n.dependencies),os|=i.lanes,(a&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,a=pi(n,n.pendingProps),i.child=a,a.return=i;n.sibling!==null;)n=n.sibling,a=a.sibling=pi(n,n.pendingProps),a.return=i;a.sibling=null}return i.child}function Hw(n,i,a){switch(i.tag){case 3:Hm(i),co();break;case 5:lm(i);break;case 1:tn(i.type)&&ru(i);break;case 4:xh(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,d=i.memoizedProps.value;We(uu,c._currentValue),c._currentValue=d;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(We(nt,nt.current&1),i.flags|=128,null):(a&i.child.childLanes)!==0?Wm(n,i,a):(We(nt,nt.current&1),n=Vr(n,i,a),n!==null?n.sibling:null);We(nt,nt.current&1);break;case 19:if(c=(a&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Gm(n,i,a);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),We(nt,nt.current),c)break;return null;case 22:case 23:return i.lanes=0,zm(n,i,a)}return Vr(n,i,a)}var Qm,Zh,Ym,Xm;Qm=function(n,i){for(var a=i.child;a!==null;){if(a.tag===5||a.tag===6)n.appendChild(a.stateNode);else if(a.tag!==4&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===i)break;for(;a.sibling===null;){if(a.return===null||a.return===i)return;a=a.return}a.sibling.return=a.return,a=a.sibling}},Zh=function(){},Ym=function(n,i,a,c){var d=n.memoizedProps;if(d!==c){n=i.stateNode,is(ar.current);var m=null;switch(a){case"input":d=Mi(n,d),c=Mi(n,c),m=[];break;case"select":d=ee({},d,{value:void 0}),c=ee({},c,{value:void 0}),m=[];break;case"textarea":d=Ko(n,d),c=Ko(n,c),m=[];break;default:typeof d.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=eu)}Zo(a,c);var v;a=null;for(F in d)if(!c.hasOwnProperty(F)&&d.hasOwnProperty(F)&&d[F]!=null)if(F==="style"){var S=d[F];for(v in S)S.hasOwnProperty(v)&&(a||(a={}),a[v]="")}else F!=="dangerouslySetInnerHTML"&&F!=="children"&&F!=="suppressContentEditableWarning"&&F!=="suppressHydrationWarning"&&F!=="autoFocus"&&(o.hasOwnProperty(F)?m||(m=[]):(m=m||[]).push(F,null));for(F in c){var N=c[F];if(S=d!=null?d[F]:void 0,c.hasOwnProperty(F)&&N!==S&&(N!=null||S!=null))if(F==="style")if(S){for(v in S)!S.hasOwnProperty(v)||N&&N.hasOwnProperty(v)||(a||(a={}),a[v]="");for(v in N)N.hasOwnProperty(v)&&S[v]!==N[v]&&(a||(a={}),a[v]=N[v])}else a||(m||(m=[]),m.push(F,a)),a=N;else F==="dangerouslySetInnerHTML"?(N=N?N.__html:void 0,S=S?S.__html:void 0,N!=null&&S!==N&&(m=m||[]).push(F,N)):F==="children"?typeof N!="string"&&typeof N!="number"||(m=m||[]).push(F,""+N):F!=="suppressContentEditableWarning"&&F!=="suppressHydrationWarning"&&(o.hasOwnProperty(F)?(N!=null&&F==="onScroll"&&Ge("scroll",n),m||S===N||(m=[])):(m=m||[]).push(F,N))}a&&(m=m||[]).push("style",a);var F=m;(i.updateQueue=F)&&(i.flags|=4)}},Xm=function(n,i,a,c){a!==c&&(i.flags|=4)};function Oa(n,i){if(!et)switch(n.tailMode){case"hidden":i=n.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?n.tail=null:a.sibling=null;break;case"collapsed":a=n.tail;for(var c=null;a!==null;)a.alternate!==null&&(c=a),a=a.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Ut(n){var i=n.alternate!==null&&n.alternate.child===n.child,a=0,c=0;if(i)for(var d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags&14680064,c|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)a|=d.lanes|d.childLanes,c|=d.subtreeFlags,c|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=c,n.childLanes=a,i}function qw(n,i,a){var c=i.pendingProps;switch(wh(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ut(i),null;case 1:return tn(i.type)&&nu(),Ut(i),null;case 3:return c=i.stateNode,mo(),Qe(en),Qe(jt),Vh(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(au(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,Hn!==null&&(cd(Hn),Hn=null))),Zh(n,i),Ut(i),null;case 5:Dh(i);var d=is(Ca.current);if(a=i.type,n!==null&&i.stateNode!=null)Ym(n,i,a,c,d),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return Ut(i),null}if(n=is(ar.current),au(i)){c=i.stateNode,a=i.type;var m=i.memoizedProps;switch(c[or]=i,c[Ia]=m,n=(i.mode&1)!==0,a){case"dialog":Ge("cancel",c),Ge("close",c);break;case"iframe":case"object":case"embed":Ge("load",c);break;case"video":case"audio":for(d=0;d<Ea.length;d++)Ge(Ea[d],c);break;case"source":Ge("error",c);break;case"img":case"image":case"link":Ge("error",c),Ge("load",c);break;case"details":Ge("toggle",c);break;case"input":Ps(c,m),Ge("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!m.multiple},Ge("invalid",c);break;case"textarea":xs(c,m),Ge("invalid",c)}Zo(a,m),d=null;for(var v in m)if(m.hasOwnProperty(v)){var S=m[v];v==="children"?typeof S=="string"?c.textContent!==S&&(m.suppressHydrationWarning!==!0&&Zl(c.textContent,S,n),d=["children",S]):typeof S=="number"&&c.textContent!==""+S&&(m.suppressHydrationWarning!==!0&&Zl(c.textContent,S,n),d=["children",""+S]):o.hasOwnProperty(v)&&S!=null&&v==="onScroll"&&Ge("scroll",c)}switch(a){case"input":Xt(c),Al(c,m,!0);break;case"textarea":Xt(c),Go(c);break;case"select":case"option":break;default:typeof m.onClick=="function"&&(c.onclick=eu)}c=d,i.updateQueue=c,c!==null&&(i.flags|=4)}else{v=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=gt(a)),n==="http://www.w3.org/1999/xhtml"?a==="script"?(n=v.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=v.createElement(a,{is:c.is}):(n=v.createElement(a),a==="select"&&(v=n,c.multiple?v.multiple=!0:c.size&&(v.size=c.size))):n=v.createElementNS(n,a),n[or]=i,n[Ia]=c,Qm(n,i,!1,!1),i.stateNode=n;e:{switch(v=ea(a,c),a){case"dialog":Ge("cancel",n),Ge("close",n),d=c;break;case"iframe":case"object":case"embed":Ge("load",n),d=c;break;case"video":case"audio":for(d=0;d<Ea.length;d++)Ge(Ea[d],n);d=c;break;case"source":Ge("error",n),d=c;break;case"img":case"image":case"link":Ge("error",n),Ge("load",n),d=c;break;case"details":Ge("toggle",n),d=c;break;case"input":Ps(n,c),d=Mi(n,c),Ge("invalid",n);break;case"option":d=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},d=ee({},c,{value:void 0}),Ge("invalid",n);break;case"textarea":xs(n,c),d=Ko(n,c),Ge("invalid",n);break;default:d=c}Zo(a,d),S=d;for(m in S)if(S.hasOwnProperty(m)){var N=S[m];m==="style"?Xo(n,N):m==="dangerouslySetInnerHTML"?(N=N?N.__html:void 0,N!=null&&Qo(n,N)):m==="children"?typeof N=="string"?(a!=="textarea"||N!=="")&&Wr(n,N):typeof N=="number"&&Wr(n,""+N):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(o.hasOwnProperty(m)?N!=null&&m==="onScroll"&&Ge("scroll",n):N!=null&&ce(n,m,N,v))}switch(a){case"input":Xt(n),Al(n,c,!1);break;case"textarea":Xt(n),Go(n);break;case"option":c.value!=null&&n.setAttribute("value",""+se(c.value));break;case"select":n.multiple=!!c.multiple,m=c.value,m!=null?Er(n,!!c.multiple,m,!1):c.defaultValue!=null&&Er(n,!!c.multiple,c.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=eu)}switch(a){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return Ut(i),null;case 6:if(n&&i.stateNode!=null)Xm(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(a=is(Ca.current),is(ar.current),au(i)){if(c=i.stateNode,a=i.memoizedProps,c[or]=i,(m=c.nodeValue!==a)&&(n=mn,n!==null))switch(n.tag){case 3:Zl(c.nodeValue,a,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Zl(c.nodeValue,a,(n.mode&1)!==0)}m&&(i.flags|=4)}else c=(a.nodeType===9?a:a.ownerDocument).createTextNode(c),c[or]=i,i.stateNode=c}return Ut(i),null;case 13:if(Qe(nt),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(et&&gn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)em(),co(),i.flags|=98560,m=!1;else if(m=au(i),c!==null&&c.dehydrated!==null){if(n===null){if(!m)throw Error(t(318));if(m=i.memoizedState,m=m!==null?m.dehydrated:null,!m)throw Error(t(317));m[or]=i}else co(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;Ut(i),m=!1}else Hn!==null&&(cd(Hn),Hn=null),m=!0;if(!m)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=a,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(nt.current&1)!==0?Et===0&&(Et=3):fd())),i.updateQueue!==null&&(i.flags|=4),Ut(i),null);case 4:return mo(),Zh(n,i),n===null&&wa(i.stateNode.containerInfo),Ut(i),null;case 10:return kh(i.type._context),Ut(i),null;case 17:return tn(i.type)&&nu(),Ut(i),null;case 19:if(Qe(nt),m=i.memoizedState,m===null)return Ut(i),null;if(c=(i.flags&128)!==0,v=m.rendering,v===null)if(c)Oa(m,!1);else{if(Et!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(v=fu(n),v!==null){for(i.flags|=128,Oa(m,!1),c=v.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=a,a=i.child;a!==null;)m=a,n=c,m.flags&=14680066,v=m.alternate,v===null?(m.childLanes=0,m.lanes=n,m.child=null,m.subtreeFlags=0,m.memoizedProps=null,m.memoizedState=null,m.updateQueue=null,m.dependencies=null,m.stateNode=null):(m.childLanes=v.childLanes,m.lanes=v.lanes,m.child=v.child,m.subtreeFlags=0,m.deletions=null,m.memoizedProps=v.memoizedProps,m.memoizedState=v.memoizedState,m.updateQueue=v.updateQueue,m.type=v.type,n=v.dependencies,m.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),a=a.sibling;return We(nt,nt.current&1|2),i.child}n=n.sibling}m.tail!==null&&qe()>vo&&(i.flags|=128,c=!0,Oa(m,!1),i.lanes=4194304)}else{if(!c)if(n=fu(v),n!==null){if(i.flags|=128,c=!0,a=n.updateQueue,a!==null&&(i.updateQueue=a,i.flags|=4),Oa(m,!0),m.tail===null&&m.tailMode==="hidden"&&!v.alternate&&!et)return Ut(i),null}else 2*qe()-m.renderingStartTime>vo&&a!==1073741824&&(i.flags|=128,c=!0,Oa(m,!1),i.lanes=4194304);m.isBackwards?(v.sibling=i.child,i.child=v):(a=m.last,a!==null?a.sibling=v:i.child=v,m.last=v)}return m.tail!==null?(i=m.tail,m.rendering=i,m.tail=i.sibling,m.renderingStartTime=qe(),i.sibling=null,a=nt.current,We(nt,c?a&1|2:a&1),i):(Ut(i),null);case 22:case 23:return dd(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(yn&1073741824)!==0&&(Ut(i),i.subtreeFlags&6&&(i.flags|=8192)):Ut(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function Ww(n,i){switch(wh(i),i.tag){case 1:return tn(i.type)&&nu(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return mo(),Qe(en),Qe(jt),Vh(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return Dh(i),null;case 13:if(Qe(nt),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));co()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Qe(nt),null;case 4:return mo(),null;case 10:return kh(i.type._context),null;case 22:case 23:return dd(),null;case 24:return null;default:return null}}var Tu=!1,zt=!1,Kw=typeof WeakSet=="function"?WeakSet:Set,oe=null;function yo(n,i){var a=n.ref;if(a!==null)if(typeof a=="function")try{a(null)}catch(c){st(n,i,c)}else a.current=null}function ed(n,i,a){try{a()}catch(c){st(n,i,c)}}var Jm=!1;function Gw(n,i){if(dh=ei,n=Np(),ih(n)){if("selectionStart"in n)var a={start:n.selectionStart,end:n.selectionEnd};else e:{a=(a=n.ownerDocument)&&a.defaultView||window;var c=a.getSelection&&a.getSelection();if(c&&c.rangeCount!==0){a=c.anchorNode;var d=c.anchorOffset,m=c.focusNode;c=c.focusOffset;try{a.nodeType,m.nodeType}catch{a=null;break e}var v=0,S=-1,N=-1,F=0,G=0,Q=n,K=null;t:for(;;){for(var te;Q!==a||d!==0&&Q.nodeType!==3||(S=v+d),Q!==m||c!==0&&Q.nodeType!==3||(N=v+c),Q.nodeType===3&&(v+=Q.nodeValue.length),(te=Q.firstChild)!==null;)K=Q,Q=te;for(;;){if(Q===n)break t;if(K===a&&++F===d&&(S=v),K===m&&++G===c&&(N=v),(te=Q.nextSibling)!==null)break;Q=K,K=Q.parentNode}Q=te}a=S===-1||N===-1?null:{start:S,end:N}}else a=null}a=a||{start:0,end:0}}else a=null;for(fh={focusedElem:n,selectionRange:a},ei=!1,oe=i;oe!==null;)if(i=oe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,oe=n;else for(;oe!==null;){i=oe;try{var ae=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(ae!==null){var le=ae.memoizedProps,lt=ae.memoizedState,M=i.stateNode,O=M.getSnapshotBeforeUpdate(i.elementType===i.type?le:qn(i.type,le),lt);M.__reactInternalSnapshotBeforeUpdate=O}break;case 3:var j=i.stateNode.containerInfo;j.nodeType===1?j.textContent="":j.nodeType===9&&j.documentElement&&j.removeChild(j.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(X){st(i,i.return,X)}if(n=i.sibling,n!==null){n.return=i.return,oe=n;break}oe=i.return}return ae=Jm,Jm=!1,ae}function Va(n,i,a){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var d=c=c.next;do{if((d.tag&n)===n){var m=d.destroy;d.destroy=void 0,m!==void 0&&ed(i,a,m)}d=d.next}while(d!==c)}}function Iu(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var a=i=i.next;do{if((a.tag&n)===n){var c=a.create;a.destroy=c()}a=a.next}while(a!==i)}}function td(n){var i=n.ref;if(i!==null){var a=n.stateNode;switch(n.tag){case 5:n=a;break;default:n=a}typeof i=="function"?i(n):i.current=n}}function Zm(n){var i=n.alternate;i!==null&&(n.alternate=null,Zm(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[or],delete i[Ia],delete i[yh],delete i[Nw],delete i[xw])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function eg(n){return n.tag===5||n.tag===3||n.tag===4}function tg(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||eg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function nd(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.nodeType===8?a.parentNode.insertBefore(n,i):a.insertBefore(n,i):(a.nodeType===8?(i=a.parentNode,i.insertBefore(n,a)):(i=a,i.appendChild(n)),a=a._reactRootContainer,a!=null||i.onclick!==null||(i.onclick=eu));else if(c!==4&&(n=n.child,n!==null))for(nd(n,i,a),n=n.sibling;n!==null;)nd(n,i,a),n=n.sibling}function rd(n,i,a){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?a.insertBefore(n,i):a.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(rd(n,i,a),n=n.sibling;n!==null;)rd(n,i,a),n=n.sibling}var xt=null,Wn=!1;function ui(n,i,a){for(a=a.child;a!==null;)ng(n,i,a),a=a.sibling}function ng(n,i,a){if(hn&&typeof hn.onCommitFiberUnmount=="function")try{hn.onCommitFiberUnmount(Wi,a)}catch{}switch(a.tag){case 5:zt||yo(a,i);case 6:var c=xt,d=Wn;xt=null,ui(n,i,a),xt=c,Wn=d,xt!==null&&(Wn?(n=xt,a=a.stateNode,n.nodeType===8?n.parentNode.removeChild(a):n.removeChild(a)):xt.removeChild(a.stateNode));break;case 18:xt!==null&&(Wn?(n=xt,a=a.stateNode,n.nodeType===8?gh(n.parentNode,a):n.nodeType===1&&gh(n,a),zn(n)):gh(xt,a.stateNode));break;case 4:c=xt,d=Wn,xt=a.stateNode.containerInfo,Wn=!0,ui(n,i,a),xt=c,Wn=d;break;case 0:case 11:case 14:case 15:if(!zt&&(c=a.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){d=c=c.next;do{var m=d,v=m.destroy;m=m.tag,v!==void 0&&((m&2)!==0||(m&4)!==0)&&ed(a,i,v),d=d.next}while(d!==c)}ui(n,i,a);break;case 1:if(!zt&&(yo(a,i),c=a.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=a.memoizedProps,c.state=a.memoizedState,c.componentWillUnmount()}catch(S){st(a,i,S)}ui(n,i,a);break;case 21:ui(n,i,a);break;case 22:a.mode&1?(zt=(c=zt)||a.memoizedState!==null,ui(n,i,a),zt=c):ui(n,i,a);break;default:ui(n,i,a)}}function rg(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var a=n.stateNode;a===null&&(a=n.stateNode=new Kw),i.forEach(function(c){var d=r0.bind(null,n,c);a.has(c)||(a.add(c),c.then(d,d))})}}function Kn(n,i){var a=i.deletions;if(a!==null)for(var c=0;c<a.length;c++){var d=a[c];try{var m=n,v=i,S=v;e:for(;S!==null;){switch(S.tag){case 5:xt=S.stateNode,Wn=!1;break e;case 3:xt=S.stateNode.containerInfo,Wn=!0;break e;case 4:xt=S.stateNode.containerInfo,Wn=!0;break e}S=S.return}if(xt===null)throw Error(t(160));ng(m,v,d),xt=null,Wn=!1;var N=d.alternate;N!==null&&(N.return=null),d.return=null}catch(F){st(d,i,F)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)ig(i,n),i=i.sibling}function ig(n,i){var a=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Kn(i,n),ur(n),c&4){try{Va(3,n,n.return),Iu(3,n)}catch(le){st(n,n.return,le)}try{Va(5,n,n.return)}catch(le){st(n,n.return,le)}}break;case 1:Kn(i,n),ur(n),c&512&&a!==null&&yo(a,a.return);break;case 5:if(Kn(i,n),ur(n),c&512&&a!==null&&yo(a,a.return),n.flags&32){var d=n.stateNode;try{Wr(d,"")}catch(le){st(n,n.return,le)}}if(c&4&&(d=n.stateNode,d!=null)){var m=n.memoizedProps,v=a!==null?a.memoizedProps:m,S=n.type,N=n.updateQueue;if(n.updateQueue=null,N!==null)try{S==="input"&&m.type==="radio"&&m.name!=null&&qo(d,m),ea(S,v);var F=ea(S,m);for(v=0;v<N.length;v+=2){var G=N[v],Q=N[v+1];G==="style"?Xo(d,Q):G==="dangerouslySetInnerHTML"?Qo(d,Q):G==="children"?Wr(d,Q):ce(d,G,Q,F)}switch(S){case"input":Wo(d,m);break;case"textarea":Ds(d,m);break;case"select":var K=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!m.multiple;var te=m.value;te!=null?Er(d,!!m.multiple,te,!1):K!==!!m.multiple&&(m.defaultValue!=null?Er(d,!!m.multiple,m.defaultValue,!0):Er(d,!!m.multiple,m.multiple?[]:"",!1))}d[Ia]=m}catch(le){st(n,n.return,le)}}break;case 6:if(Kn(i,n),ur(n),c&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,m=n.memoizedProps;try{d.nodeValue=m}catch(le){st(n,n.return,le)}}break;case 3:if(Kn(i,n),ur(n),c&4&&a!==null&&a.memoizedState.isDehydrated)try{zn(i.containerInfo)}catch(le){st(n,n.return,le)}break;case 4:Kn(i,n),ur(n);break;case 13:Kn(i,n),ur(n),d=n.child,d.flags&8192&&(m=d.memoizedState!==null,d.stateNode.isHidden=m,!m||d.alternate!==null&&d.alternate.memoizedState!==null||(od=qe())),c&4&&rg(n);break;case 22:if(G=a!==null&&a.memoizedState!==null,n.mode&1?(zt=(F=zt)||G,Kn(i,n),zt=F):Kn(i,n),ur(n),c&8192){if(F=n.memoizedState!==null,(n.stateNode.isHidden=F)&&!G&&(n.mode&1)!==0)for(oe=n,G=n.child;G!==null;){for(Q=oe=G;oe!==null;){switch(K=oe,te=K.child,K.tag){case 0:case 11:case 14:case 15:Va(4,K,K.return);break;case 1:yo(K,K.return);var ae=K.stateNode;if(typeof ae.componentWillUnmount=="function"){c=K,a=K.return;try{i=c,ae.props=i.memoizedProps,ae.state=i.memoizedState,ae.componentWillUnmount()}catch(le){st(c,a,le)}}break;case 5:yo(K,K.return);break;case 22:if(K.memoizedState!==null){ag(Q);continue}}te!==null?(te.return=K,oe=te):ag(Q)}G=G.sibling}e:for(G=null,Q=n;;){if(Q.tag===5){if(G===null){G=Q;try{d=Q.stateNode,F?(m=d.style,typeof m.setProperty=="function"?m.setProperty("display","none","important"):m.display="none"):(S=Q.stateNode,N=Q.memoizedProps.style,v=N!=null&&N.hasOwnProperty("display")?N.display:null,S.style.display=Yo("display",v))}catch(le){st(n,n.return,le)}}}else if(Q.tag===6){if(G===null)try{Q.stateNode.nodeValue=F?"":Q.memoizedProps}catch(le){st(n,n.return,le)}}else if((Q.tag!==22&&Q.tag!==23||Q.memoizedState===null||Q===n)&&Q.child!==null){Q.child.return=Q,Q=Q.child;continue}if(Q===n)break e;for(;Q.sibling===null;){if(Q.return===null||Q.return===n)break e;G===Q&&(G=null),Q=Q.return}G===Q&&(G=null),Q.sibling.return=Q.return,Q=Q.sibling}}break;case 19:Kn(i,n),ur(n),c&4&&rg(n);break;case 21:break;default:Kn(i,n),ur(n)}}function ur(n){var i=n.flags;if(i&2){try{e:{for(var a=n.return;a!==null;){if(eg(a)){var c=a;break e}a=a.return}throw Error(t(160))}switch(c.tag){case 5:var d=c.stateNode;c.flags&32&&(Wr(d,""),c.flags&=-33);var m=tg(n);rd(n,m,d);break;case 3:case 4:var v=c.stateNode.containerInfo,S=tg(n);nd(n,S,v);break;default:throw Error(t(161))}}catch(N){st(n,n.return,N)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function Qw(n,i,a){oe=n,sg(n)}function sg(n,i,a){for(var c=(n.mode&1)!==0;oe!==null;){var d=oe,m=d.child;if(d.tag===22&&c){var v=d.memoizedState!==null||Tu;if(!v){var S=d.alternate,N=S!==null&&S.memoizedState!==null||zt;S=Tu;var F=zt;if(Tu=v,(zt=N)&&!F)for(oe=d;oe!==null;)v=oe,N=v.child,v.tag===22&&v.memoizedState!==null?lg(d):N!==null?(N.return=v,oe=N):lg(d);for(;m!==null;)oe=m,sg(m),m=m.sibling;oe=d,Tu=S,zt=F}og(n)}else(d.subtreeFlags&8772)!==0&&m!==null?(m.return=d,oe=m):og(n)}}function og(n){for(;oe!==null;){var i=oe;if((i.flags&8772)!==0){var a=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:zt||Iu(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!zt)if(a===null)c.componentDidMount();else{var d=i.elementType===i.type?a.memoizedProps:qn(i.type,a.memoizedProps);c.componentDidUpdate(d,a.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var m=i.updateQueue;m!==null&&am(i,m,c);break;case 3:var v=i.updateQueue;if(v!==null){if(a=null,i.child!==null)switch(i.child.tag){case 5:a=i.child.stateNode;break;case 1:a=i.child.stateNode}am(i,v,a)}break;case 5:var S=i.stateNode;if(a===null&&i.flags&4){a=S;var N=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":N.autoFocus&&a.focus();break;case"img":N.src&&(a.src=N.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var F=i.alternate;if(F!==null){var G=F.memoizedState;if(G!==null){var Q=G.dehydrated;Q!==null&&zn(Q)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}zt||i.flags&512&&td(i)}catch(K){st(i,i.return,K)}}if(i===n){oe=null;break}if(a=i.sibling,a!==null){a.return=i.return,oe=a;break}oe=i.return}}function ag(n){for(;oe!==null;){var i=oe;if(i===n){oe=null;break}var a=i.sibling;if(a!==null){a.return=i.return,oe=a;break}oe=i.return}}function lg(n){for(;oe!==null;){var i=oe;try{switch(i.tag){case 0:case 11:case 15:var a=i.return;try{Iu(4,i)}catch(N){st(i,a,N)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var d=i.return;try{c.componentDidMount()}catch(N){st(i,d,N)}}var m=i.return;try{td(i)}catch(N){st(i,m,N)}break;case 5:var v=i.return;try{td(i)}catch(N){st(i,v,N)}}}catch(N){st(i,i.return,N)}if(i===n){oe=null;break}var S=i.sibling;if(S!==null){S.return=i.return,oe=S;break}oe=i.return}}var Yw=Math.ceil,Su=pe.ReactCurrentDispatcher,id=pe.ReactCurrentOwner,kn=pe.ReactCurrentBatchConfig,Me=0,At=null,ht=null,Dt=0,yn=0,_o=ii(0),Et=0,ba=null,os=0,Au=0,sd=0,La=null,rn=null,od=0,vo=1/0,br=null,Ru=!1,ad=null,ci=null,ku=!1,hi=null,Cu=0,Ma=0,ld=null,Pu=-1,Nu=0;function Qt(){return(Me&6)!==0?qe():Pu!==-1?Pu:Pu=qe()}function di(n){return(n.mode&1)===0?1:(Me&2)!==0&&Dt!==0?Dt&-Dt:Ow.transition!==null?(Nu===0&&(Nu=Gi()),Nu):(n=De,n!==0||(n=window.event,n=n===void 0?16:ha(n.type)),n)}function Gn(n,i,a,c){if(50<Ma)throw Ma=0,ld=null,Error(t(185));Yr(n,a,c),((Me&2)===0||n!==At)&&(n===At&&((Me&2)===0&&(Au|=a),Et===4&&fi(n,Dt)),sn(n,c),a===1&&Me===0&&(i.mode&1)===0&&(vo=qe()+500,iu&&oi()))}function sn(n,i){var a=n.callbackNode;Ir(n,i);var c=Ki(n,n===At?Dt:0);if(c===0)a!==null&&oa(a),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(a!=null&&oa(a),i===1)n.tag===0?Dw(cg.bind(null,n)):Qp(cg.bind(null,n)),Cw(function(){(Me&6)===0&&oi()}),a=null;else{switch(Jr(c)){case 1:a=qi;break;case 4:a=Kr;break;case 16:a=En;break;case 536870912:a=Nl;break;default:a=En}a=_g(a,ug.bind(null,n))}n.callbackPriority=i,n.callbackNode=a}}function ug(n,i){if(Pu=-1,Nu=0,(Me&6)!==0)throw Error(t(327));var a=n.callbackNode;if(Eo()&&n.callbackNode!==a)return null;var c=Ki(n,n===At?Dt:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=xu(n,c);else{i=c;var d=Me;Me|=2;var m=dg();(At!==n||Dt!==i)&&(br=null,vo=qe()+500,ls(n,i));do try{Zw();break}catch(S){hg(n,S)}while(!0);Rh(),Su.current=m,Me=d,ht!==null?i=0:(At=null,Dt=0,i=Et)}if(i!==0){if(i===2&&(d=dn(n),d!==0&&(c=d,i=ud(n,d))),i===1)throw a=ba,ls(n,0),fi(n,c),sn(n,qe()),a;if(i===6)fi(n,c);else{if(d=n.current.alternate,(c&30)===0&&!Xw(d)&&(i=xu(n,c),i===2&&(m=dn(n),m!==0&&(c=m,i=ud(n,m))),i===1))throw a=ba,ls(n,0),fi(n,c),sn(n,qe()),a;switch(n.finishedWork=d,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:us(n,rn,br);break;case 3:if(fi(n,c),(c&130023424)===c&&(i=od+500-qe(),10<i)){if(Ki(n,0)!==0)break;if(d=n.suspendedLanes,(d&c)!==c){Qt(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=mh(us.bind(null,n,rn,br),i);break}us(n,rn,br);break;case 4:if(fi(n,c),(c&4194240)===c)break;for(i=n.eventTimes,d=-1;0<c;){var v=31-Wt(c);m=1<<v,v=i[v],v>d&&(d=v),c&=~m}if(c=d,c=qe()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*Yw(c/1960))-c,10<c){n.timeoutHandle=mh(us.bind(null,n,rn,br),c);break}us(n,rn,br);break;case 5:us(n,rn,br);break;default:throw Error(t(329))}}}return sn(n,qe()),n.callbackNode===a?ug.bind(null,n):null}function ud(n,i){var a=La;return n.current.memoizedState.isDehydrated&&(ls(n,i).flags|=256),n=xu(n,i),n!==2&&(i=rn,rn=a,i!==null&&cd(i)),n}function cd(n){rn===null?rn=n:rn.push.apply(rn,n)}function Xw(n){for(var i=n;;){if(i.flags&16384){var a=i.updateQueue;if(a!==null&&(a=a.stores,a!==null))for(var c=0;c<a.length;c++){var d=a[c],m=d.getSnapshot;d=d.value;try{if(!$n(m(),d))return!1}catch{return!1}}}if(a=i.child,i.subtreeFlags&16384&&a!==null)a.return=i,i=a;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function fi(n,i){for(i&=~sd,i&=~Au,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var a=31-Wt(i),c=1<<a;n[a]=-1,i&=~c}}function cg(n){if((Me&6)!==0)throw Error(t(327));Eo();var i=Ki(n,0);if((i&1)===0)return sn(n,qe()),null;var a=xu(n,i);if(n.tag!==0&&a===2){var c=dn(n);c!==0&&(i=c,a=ud(n,c))}if(a===1)throw a=ba,ls(n,0),fi(n,i),sn(n,qe()),a;if(a===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,us(n,rn,br),sn(n,qe()),null}function hd(n,i){var a=Me;Me|=1;try{return n(i)}finally{Me=a,Me===0&&(vo=qe()+500,iu&&oi())}}function as(n){hi!==null&&hi.tag===0&&(Me&6)===0&&Eo();var i=Me;Me|=1;var a=kn.transition,c=De;try{if(kn.transition=null,De=1,n)return n()}finally{De=c,kn.transition=a,Me=i,(Me&6)===0&&oi()}}function dd(){yn=_o.current,Qe(_o)}function ls(n,i){n.finishedWork=null,n.finishedLanes=0;var a=n.timeoutHandle;if(a!==-1&&(n.timeoutHandle=-1,kw(a)),ht!==null)for(a=ht.return;a!==null;){var c=a;switch(wh(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&nu();break;case 3:mo(),Qe(en),Qe(jt),Vh();break;case 5:Dh(c);break;case 4:mo();break;case 13:Qe(nt);break;case 19:Qe(nt);break;case 10:kh(c.type._context);break;case 22:case 23:dd()}a=a.return}if(At=n,ht=n=pi(n.current,null),Dt=yn=i,Et=0,ba=null,sd=Au=os=0,rn=La=null,rs!==null){for(i=0;i<rs.length;i++)if(a=rs[i],c=a.interleaved,c!==null){a.interleaved=null;var d=c.next,m=a.pending;if(m!==null){var v=m.next;m.next=d,c.next=v}a.pending=c}rs=null}return n}function hg(n,i){do{var a=ht;try{if(Rh(),pu.current=_u,mu){for(var c=rt.memoizedState;c!==null;){var d=c.queue;d!==null&&(d.pending=null),c=c.next}mu=!1}if(ss=0,St=vt=rt=null,Pa=!1,Na=0,id.current=null,a===null||a.return===null){Et=1,ba=i,ht=null;break}e:{var m=n,v=a.return,S=a,N=i;if(i=Dt,S.flags|=32768,N!==null&&typeof N=="object"&&typeof N.then=="function"){var F=N,G=S,Q=G.tag;if((G.mode&1)===0&&(Q===0||Q===11||Q===15)){var K=G.alternate;K?(G.updateQueue=K.updateQueue,G.memoizedState=K.memoizedState,G.lanes=K.lanes):(G.updateQueue=null,G.memoizedState=null)}var te=Lm(v);if(te!==null){te.flags&=-257,Mm(te,v,S,m,i),te.mode&1&&bm(m,F,i),i=te,N=F;var ae=i.updateQueue;if(ae===null){var le=new Set;le.add(N),i.updateQueue=le}else ae.add(N);break e}else{if((i&1)===0){bm(m,F,i),fd();break e}N=Error(t(426))}}else if(et&&S.mode&1){var lt=Lm(v);if(lt!==null){(lt.flags&65536)===0&&(lt.flags|=256),Mm(lt,v,S,m,i),Sh(go(N,S));break e}}m=N=go(N,S),Et!==4&&(Et=2),La===null?La=[m]:La.push(m),m=v;do{switch(m.tag){case 3:m.flags|=65536,i&=-i,m.lanes|=i;var M=Om(m,N,i);om(m,M);break e;case 1:S=N;var O=m.type,j=m.stateNode;if((m.flags&128)===0&&(typeof O.getDerivedStateFromError=="function"||j!==null&&typeof j.componentDidCatch=="function"&&(ci===null||!ci.has(j)))){m.flags|=65536,i&=-i,m.lanes|=i;var X=Vm(m,S,i);om(m,X);break e}}m=m.return}while(m!==null)}pg(a)}catch(ue){i=ue,ht===a&&a!==null&&(ht=a=a.return);continue}break}while(!0)}function dg(){var n=Su.current;return Su.current=_u,n===null?_u:n}function fd(){(Et===0||Et===3||Et===2)&&(Et=4),At===null||(os&268435455)===0&&(Au&268435455)===0||fi(At,Dt)}function xu(n,i){var a=Me;Me|=2;var c=dg();(At!==n||Dt!==i)&&(br=null,ls(n,i));do try{Jw();break}catch(d){hg(n,d)}while(!0);if(Rh(),Me=a,Su.current=c,ht!==null)throw Error(t(261));return At=null,Dt=0,Et}function Jw(){for(;ht!==null;)fg(ht)}function Zw(){for(;ht!==null&&!Cl();)fg(ht)}function fg(n){var i=yg(n.alternate,n,yn);n.memoizedProps=n.pendingProps,i===null?pg(n):ht=i,id.current=null}function pg(n){var i=n;do{var a=i.alternate;if(n=i.return,(i.flags&32768)===0){if(a=qw(a,i,yn),a!==null){ht=a;return}}else{if(a=Ww(a,i),a!==null){a.flags&=32767,ht=a;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Et=6,ht=null;return}}if(i=i.sibling,i!==null){ht=i;return}ht=i=n}while(i!==null);Et===0&&(Et=5)}function us(n,i,a){var c=De,d=kn.transition;try{kn.transition=null,De=1,e0(n,i,a,c)}finally{kn.transition=d,De=c}return null}function e0(n,i,a,c){do Eo();while(hi!==null);if((Me&6)!==0)throw Error(t(327));a=n.finishedWork;var d=n.finishedLanes;if(a===null)return null;if(n.finishedWork=null,n.finishedLanes=0,a===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var m=a.lanes|a.childLanes;if(He(n,m),n===At&&(ht=At=null,Dt=0),(a.subtreeFlags&2064)===0&&(a.flags&2064)===0||ku||(ku=!0,_g(En,function(){return Eo(),null})),m=(a.flags&15990)!==0,(a.subtreeFlags&15990)!==0||m){m=kn.transition,kn.transition=null;var v=De;De=1;var S=Me;Me|=4,id.current=null,Gw(n,a),ig(a,n),Ew(fh),ei=!!dh,fh=dh=null,n.current=a,Qw(a),Yc(),Me=S,De=v,kn.transition=m}else n.current=a;if(ku&&(ku=!1,hi=n,Cu=d),m=n.pendingLanes,m===0&&(ci=null),xl(a.stateNode),sn(n,qe()),i!==null)for(c=n.onRecoverableError,a=0;a<i.length;a++)d=i[a],c(d.value,{componentStack:d.stack,digest:d.digest});if(Ru)throw Ru=!1,n=ad,ad=null,n;return(Cu&1)!==0&&n.tag!==0&&Eo(),m=n.pendingLanes,(m&1)!==0?n===ld?Ma++:(Ma=0,ld=n):Ma=0,oi(),null}function Eo(){if(hi!==null){var n=Jr(Cu),i=kn.transition,a=De;try{if(kn.transition=null,De=16>n?16:n,hi===null)var c=!1;else{if(n=hi,hi=null,Cu=0,(Me&6)!==0)throw Error(t(331));var d=Me;for(Me|=4,oe=n.current;oe!==null;){var m=oe,v=m.child;if((oe.flags&16)!==0){var S=m.deletions;if(S!==null){for(var N=0;N<S.length;N++){var F=S[N];for(oe=F;oe!==null;){var G=oe;switch(G.tag){case 0:case 11:case 15:Va(8,G,m)}var Q=G.child;if(Q!==null)Q.return=G,oe=Q;else for(;oe!==null;){G=oe;var K=G.sibling,te=G.return;if(Zm(G),G===F){oe=null;break}if(K!==null){K.return=te,oe=K;break}oe=te}}}var ae=m.alternate;if(ae!==null){var le=ae.child;if(le!==null){ae.child=null;do{var lt=le.sibling;le.sibling=null,le=lt}while(le!==null)}}oe=m}}if((m.subtreeFlags&2064)!==0&&v!==null)v.return=m,oe=v;else e:for(;oe!==null;){if(m=oe,(m.flags&2048)!==0)switch(m.tag){case 0:case 11:case 15:Va(9,m,m.return)}var M=m.sibling;if(M!==null){M.return=m.return,oe=M;break e}oe=m.return}}var O=n.current;for(oe=O;oe!==null;){v=oe;var j=v.child;if((v.subtreeFlags&2064)!==0&&j!==null)j.return=v,oe=j;else e:for(v=O;oe!==null;){if(S=oe,(S.flags&2048)!==0)try{switch(S.tag){case 0:case 11:case 15:Iu(9,S)}}catch(ue){st(S,S.return,ue)}if(S===v){oe=null;break e}var X=S.sibling;if(X!==null){X.return=S.return,oe=X;break e}oe=S.return}}if(Me=d,oi(),hn&&typeof hn.onPostCommitFiberRoot=="function")try{hn.onPostCommitFiberRoot(Wi,n)}catch{}c=!0}return c}finally{De=a,kn.transition=i}}return!1}function mg(n,i,a){i=go(a,i),i=Om(n,i,1),n=li(n,i,1),i=Qt(),n!==null&&(Yr(n,1,i),sn(n,i))}function st(n,i,a){if(n.tag===3)mg(n,n,a);else for(;i!==null;){if(i.tag===3){mg(i,n,a);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(ci===null||!ci.has(c))){n=go(a,n),n=Vm(i,n,1),i=li(i,n,1),n=Qt(),i!==null&&(Yr(i,1,n),sn(i,n));break}}i=i.return}}function t0(n,i,a){var c=n.pingCache;c!==null&&c.delete(i),i=Qt(),n.pingedLanes|=n.suspendedLanes&a,At===n&&(Dt&a)===a&&(Et===4||Et===3&&(Dt&130023424)===Dt&&500>qe()-od?ls(n,0):sd|=a),sn(n,i)}function gg(n,i){i===0&&((n.mode&1)===0?i=1:(i=Bs,Bs<<=1,(Bs&130023424)===0&&(Bs=4194304)));var a=Qt();n=Dr(n,i),n!==null&&(Yr(n,i,a),sn(n,a))}function n0(n){var i=n.memoizedState,a=0;i!==null&&(a=i.retryLane),gg(n,a)}function r0(n,i){var a=0;switch(n.tag){case 13:var c=n.stateNode,d=n.memoizedState;d!==null&&(a=d.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),gg(n,a)}var yg;yg=function(n,i,a){if(n!==null)if(n.memoizedProps!==i.pendingProps||en.current)nn=!0;else{if((n.lanes&a)===0&&(i.flags&128)===0)return nn=!1,Hw(n,i,a);nn=(n.flags&131072)!==0}else nn=!1,et&&(i.flags&1048576)!==0&&Yp(i,ou,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;wu(n,i),n=i.pendingProps;var d=ao(i,jt.current);po(i,a),d=Mh(null,i,c,n,d,a);var m=jh();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,tn(c)?(m=!0,ru(i)):m=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,Nh(i),d.updater=vu,i.stateNode=d,d._reactInternals=i,Hh(i,c,n,a),i=Gh(null,i,c,!0,m,a)):(i.tag=0,et&&m&&Eh(i),Gt(null,i,d,a),i=i.child),i;case 16:c=i.elementType;e:{switch(wu(n,i),n=i.pendingProps,d=c._init,c=d(c._payload),i.type=c,d=i.tag=s0(c),n=qn(c,n),d){case 0:i=Kh(null,i,c,n,a);break e;case 1:i=$m(null,i,c,n,a);break e;case 11:i=jm(null,i,c,n,a);break e;case 14:i=Fm(null,i,c,qn(c.type,n),a);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:qn(c,d),Kh(n,i,c,d,a);case 1:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:qn(c,d),$m(n,i,c,d,a);case 3:e:{if(Hm(i),n===null)throw Error(t(387));c=i.pendingProps,m=i.memoizedState,d=m.element,sm(n,i),du(i,c,null,a);var v=i.memoizedState;if(c=v.element,m.isDehydrated)if(m={element:c,isDehydrated:!1,cache:v.cache,pendingSuspenseBoundaries:v.pendingSuspenseBoundaries,transitions:v.transitions},i.updateQueue.baseState=m,i.memoizedState=m,i.flags&256){d=go(Error(t(423)),i),i=qm(n,i,c,a,d);break e}else if(c!==d){d=go(Error(t(424)),i),i=qm(n,i,c,a,d);break e}else for(gn=ri(i.stateNode.containerInfo.firstChild),mn=i,et=!0,Hn=null,a=rm(i,null,c,a),i.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(co(),c===d){i=Vr(n,i,a);break e}Gt(n,i,c,a)}i=i.child}return i;case 5:return lm(i),n===null&&Ih(i),c=i.type,d=i.pendingProps,m=n!==null?n.memoizedProps:null,v=d.children,ph(c,d)?v=null:m!==null&&ph(c,m)&&(i.flags|=32),Bm(n,i),Gt(n,i,v,a),i.child;case 6:return n===null&&Ih(i),null;case 13:return Wm(n,i,a);case 4:return xh(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=ho(i,null,c,a):Gt(n,i,c,a),i.child;case 11:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:qn(c,d),jm(n,i,c,d,a);case 7:return Gt(n,i,i.pendingProps,a),i.child;case 8:return Gt(n,i,i.pendingProps.children,a),i.child;case 12:return Gt(n,i,i.pendingProps.children,a),i.child;case 10:e:{if(c=i.type._context,d=i.pendingProps,m=i.memoizedProps,v=d.value,We(uu,c._currentValue),c._currentValue=v,m!==null)if($n(m.value,v)){if(m.children===d.children&&!en.current){i=Vr(n,i,a);break e}}else for(m=i.child,m!==null&&(m.return=i);m!==null;){var S=m.dependencies;if(S!==null){v=m.child;for(var N=S.firstContext;N!==null;){if(N.context===c){if(m.tag===1){N=Or(-1,a&-a),N.tag=2;var F=m.updateQueue;if(F!==null){F=F.shared;var G=F.pending;G===null?N.next=N:(N.next=G.next,G.next=N),F.pending=N}}m.lanes|=a,N=m.alternate,N!==null&&(N.lanes|=a),Ch(m.return,a,i),S.lanes|=a;break}N=N.next}}else if(m.tag===10)v=m.type===i.type?null:m.child;else if(m.tag===18){if(v=m.return,v===null)throw Error(t(341));v.lanes|=a,S=v.alternate,S!==null&&(S.lanes|=a),Ch(v,a,i),v=m.sibling}else v=m.child;if(v!==null)v.return=m;else for(v=m;v!==null;){if(v===i){v=null;break}if(m=v.sibling,m!==null){m.return=v.return,v=m;break}v=v.return}m=v}Gt(n,i,d.children,a),i=i.child}return i;case 9:return d=i.type,c=i.pendingProps.children,po(i,a),d=An(d),c=c(d),i.flags|=1,Gt(n,i,c,a),i.child;case 14:return c=i.type,d=qn(c,i.pendingProps),d=qn(c.type,d),Fm(n,i,c,d,a);case 15:return Um(n,i,i.type,i.pendingProps,a);case 17:return c=i.type,d=i.pendingProps,d=i.elementType===c?d:qn(c,d),wu(n,i),i.tag=1,tn(c)?(n=!0,ru(i)):n=!1,po(i,a),xm(i,c,d),Hh(i,c,d,a),Gh(null,i,c,!0,n,a);case 19:return Gm(n,i,a);case 22:return zm(n,i,a)}throw Error(t(156,i.tag))};function _g(n,i){return Us(n,i)}function i0(n,i,a,c){this.tag=n,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Cn(n,i,a,c){return new i0(n,i,a,c)}function pd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function s0(n){if(typeof n=="function")return pd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===b)return 11;if(n===tt)return 14}return 2}function pi(n,i){var a=n.alternate;return a===null?(a=Cn(n.tag,i,n.key,n.mode),a.elementType=n.elementType,a.type=n.type,a.stateNode=n.stateNode,a.alternate=n,n.alternate=a):(a.pendingProps=i,a.type=n.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=n.flags&14680064,a.childLanes=n.childLanes,a.lanes=n.lanes,a.child=n.child,a.memoizedProps=n.memoizedProps,a.memoizedState=n.memoizedState,a.updateQueue=n.updateQueue,i=n.dependencies,a.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},a.sibling=n.sibling,a.index=n.index,a.ref=n.ref,a}function Du(n,i,a,c,d,m){var v=2;if(c=n,typeof n=="function")pd(n)&&(v=1);else if(typeof n=="string")v=5;else e:switch(n){case P:return cs(a.children,d,m,i);case I:v=8,d|=8;break;case k:return n=Cn(12,a,i,d|2),n.elementType=k,n.lanes=m,n;case R:return n=Cn(13,a,i,d),n.elementType=R,n.lanes=m,n;case Xe:return n=Cn(19,a,i,d),n.elementType=Xe,n.lanes=m,n;case Fe:return Ou(a,d,m,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case x:v=10;break e;case D:v=9;break e;case b:v=11;break e;case tt:v=14;break e;case Je:v=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=Cn(v,a,i,d),i.elementType=n,i.type=c,i.lanes=m,i}function cs(n,i,a,c){return n=Cn(7,n,c,i),n.lanes=a,n}function Ou(n,i,a,c){return n=Cn(22,n,c,i),n.elementType=Fe,n.lanes=a,n.stateNode={isHidden:!1},n}function md(n,i,a){return n=Cn(6,n,null,i),n.lanes=a,n}function gd(n,i,a){return i=Cn(4,n.children!==null?n.children:[],n.key,i),i.lanes=a,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function o0(n,i,a,c,d){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Qr(0),this.expirationTimes=Qr(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Qr(0),this.identifierPrefix=c,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function yd(n,i,a,c,d,m,v,S,N){return n=new o0(n,i,a,S,N),i===1?(i=1,m===!0&&(i|=8)):i=0,m=Cn(3,null,null,i),n.current=m,m.stateNode=n,m.memoizedState={element:c,isDehydrated:a,cache:null,transitions:null,pendingSuspenseBoundaries:null},Nh(m),n}function a0(n,i,a){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Te,key:c==null?null:""+c,children:n,containerInfo:i,implementation:a}}function vg(n){if(!n)return si;n=n._reactInternals;e:{if(Ln(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(tn(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var a=n.type;if(tn(a))return Kp(n,a,i)}return i}function Eg(n,i,a,c,d,m,v,S,N){return n=yd(a,c,!0,n,d,m,v,S,N),n.context=vg(null),a=n.current,c=Qt(),d=di(a),m=Or(c,d),m.callback=i??null,li(a,m,d),n.current.lanes=d,Yr(n,d,c),sn(n,c),n}function Vu(n,i,a,c){var d=i.current,m=Qt(),v=di(d);return a=vg(a),i.context===null?i.context=a:i.pendingContext=a,i=Or(m,v),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=li(d,i,v),n!==null&&(Gn(n,d,v,m),hu(n,d,v)),v}function bu(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function wg(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var a=n.retryLane;n.retryLane=a!==0&&a<i?a:i}}function _d(n,i){wg(n,i),(n=n.alternate)&&wg(n,i)}function l0(){return null}var Tg=typeof reportError=="function"?reportError:function(n){console.error(n)};function vd(n){this._internalRoot=n}Lu.prototype.render=vd.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));Vu(n,i,null,null)},Lu.prototype.unmount=vd.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;as(function(){Vu(null,n,null,null)}),i[Cr]=null}};function Lu(n){this._internalRoot=n}Lu.prototype.unstable_scheduleHydration=function(n){if(n){var i=Ll();n={blockedOn:null,target:n,priority:i};for(var a=0;a<nr.length&&i!==0&&i<nr[a].priority;a++);nr.splice(a,0,n),a===0&&Fl(n)}};function Ed(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Mu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Ig(){}function u0(n,i,a,c,d){if(d){if(typeof c=="function"){var m=c;c=function(){var F=bu(v);m.call(F)}}var v=Eg(i,c,n,0,null,!1,!1,"",Ig);return n._reactRootContainer=v,n[Cr]=v.current,wa(n.nodeType===8?n.parentNode:n),as(),v}for(;d=n.lastChild;)n.removeChild(d);if(typeof c=="function"){var S=c;c=function(){var F=bu(N);S.call(F)}}var N=yd(n,0,!1,null,null,!1,!1,"",Ig);return n._reactRootContainer=N,n[Cr]=N.current,wa(n.nodeType===8?n.parentNode:n),as(function(){Vu(i,N,a,c)}),N}function ju(n,i,a,c,d){var m=a._reactRootContainer;if(m){var v=m;if(typeof d=="function"){var S=d;d=function(){var N=bu(v);S.call(N)}}Vu(i,v,n,d)}else v=u0(a,i,n,d,c);return bu(v)}Vl=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var a=Gr(i.pendingLanes);a!==0&&(Xr(i,a|1),sn(i,qe()),(Me&6)===0&&(vo=qe()+500,oi()))}break;case 13:as(function(){var c=Dr(n,1);if(c!==null){var d=Qt();Gn(c,n,1,d)}}),_d(n,1)}},$s=function(n){if(n.tag===13){var i=Dr(n,134217728);if(i!==null){var a=Qt();Gn(i,n,134217728,a)}_d(n,134217728)}},bl=function(n){if(n.tag===13){var i=di(n),a=Dr(n,i);if(a!==null){var c=Qt();Gn(a,n,i,c)}_d(n,i)}},Ll=function(){return De},Ml=function(n,i){var a=De;try{return De=n,i()}finally{De=a}},Vs=function(n,i,a){switch(i){case"input":if(Wo(n,a),i=a.name,a.type==="radio"&&i!=null){for(a=n;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<a.length;i++){var c=a[i];if(c!==n&&c.form===n.form){var d=tu(c);if(!d)throw Error(t(90));_n(c),Wo(c,d)}}}break;case"textarea":Ds(n,a);break;case"select":i=a.value,i!=null&&Er(n,!!a.multiple,i,!1)}},zi=hd,na=as;var c0={usingClientEntryPoint:!1,Events:[Sa,so,tu,er,ta,hd]},ja={findFiberByHostInstance:Zi,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},h0={bundleType:ja.bundleType,version:ja.version,rendererPackageName:ja.rendererPackageName,rendererConfig:ja.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:pe.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=sa(n),n===null?null:n.stateNode},findFiberByHostInstance:ja.findFiberByHostInstance||l0,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fu.isDisabled&&Fu.supportsFiber)try{Wi=Fu.inject(h0),hn=Fu}catch{}}return on.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=c0,on.createPortal=function(n,i){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ed(i))throw Error(t(200));return a0(n,i,null,a)},on.createRoot=function(n,i){if(!Ed(n))throw Error(t(299));var a=!1,c="",d=Tg;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=yd(n,1,!1,null,null,a,!1,c,d),n[Cr]=i.current,wa(n.nodeType===8?n.parentNode:n),new vd(i)},on.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=sa(i),n=n===null?null:n.stateNode,n},on.flushSync=function(n){return as(n)},on.hydrate=function(n,i,a){if(!Mu(i))throw Error(t(200));return ju(null,n,i,!0,a)},on.hydrateRoot=function(n,i,a){if(!Ed(n))throw Error(t(405));var c=a!=null&&a.hydratedSources||null,d=!1,m="",v=Tg;if(a!=null&&(a.unstable_strictMode===!0&&(d=!0),a.identifierPrefix!==void 0&&(m=a.identifierPrefix),a.onRecoverableError!==void 0&&(v=a.onRecoverableError)),i=Eg(i,null,n,1,a??null,d,!1,m,v),n[Cr]=i.current,wa(n),c)for(n=0;n<c.length;n++)a=c[n],d=a._getVersion,d=d(a._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[a,d]:i.mutableSourceEagerHydrationData.push(a,d);return new Lu(i)},on.render=function(n,i,a){if(!Mu(i))throw Error(t(200));return ju(null,n,i,!1,a)},on.unmountComponentAtNode=function(n){if(!Mu(n))throw Error(t(40));return n._reactRootContainer?(as(function(){ju(null,null,n,!1,function(){n._reactRootContainer=null,n[Cr]=null})}),!0):!1},on.unstable_batchedUpdates=hd,on.unstable_renderSubtreeIntoContainer=function(n,i,a,c){if(!Mu(a))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ju(n,i,a,!1,c)},on.version="18.3.1-next-f1338f8080-20240426",on}var xg;function E0(){if(xg)return Id.exports;xg=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Id.exports=v0(),Id.exports}var Dg;function w0(){if(Dg)return Uu;Dg=1;var r=E0();return Uu.createRoot=r.createRoot,Uu.hydrateRoot=r.hydrateRoot,Uu}var T0=w0();const I0=w_(T0),S0=()=>{};var Og={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const T_=function(r){const e=[];let t=0;for(let s=0;s<r.length;s++){let o=r.charCodeAt(s);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&s+1<r.length&&(r.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(r.charCodeAt(++s)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},A0=function(r){const e=[];let t=0,s=0;for(;t<r.length;){const o=r[t++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const l=r[t++];e[s++]=String.fromCharCode((o&31)<<6|l&63)}else if(o>239&&o<365){const l=r[t++],h=r[t++],f=r[t++],g=((o&7)<<18|(l&63)<<12|(h&63)<<6|f&63)-65536;e[s++]=String.fromCharCode(55296+(g>>10)),e[s++]=String.fromCharCode(56320+(g&1023))}else{const l=r[t++],h=r[t++];e[s++]=String.fromCharCode((o&15)<<12|(l&63)<<6|h&63)}}return e.join("")},I_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<r.length;o+=3){const l=r[o],h=o+1<r.length,f=h?r[o+1]:0,g=o+2<r.length,_=g?r[o+2]:0,T=l>>2,A=(l&3)<<4|f>>4;let C=(f&15)<<2|_>>6,z=_&63;g||(z=64,h||(C=64)),s.push(t[T],t[A],t[C],t[z])}return s.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(T_(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):A0(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<r.length;){const l=t[r.charAt(o++)],f=o<r.length?t[r.charAt(o)]:0;++o;const _=o<r.length?t[r.charAt(o)]:64;++o;const A=o<r.length?t[r.charAt(o)]:64;if(++o,l==null||f==null||_==null||A==null)throw new R0;const C=l<<2|f>>4;if(s.push(C),_!==64){const z=f<<4&240|_>>2;if(s.push(z),A!==64){const W=_<<6&192|A;s.push(W)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class R0 extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const k0=function(r){const e=T_(r);return I_.encodeByteArray(e,!0)},ac=function(r){return k0(r).replace(/\./g,"")},S_=function(r){try{return I_.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C0(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P0=()=>C0().__FIREBASE_DEFAULTS__,N0=()=>{if(typeof process>"u"||typeof Og>"u")return;const r=Og.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},x0=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&S_(r[1]);return e&&JSON.parse(e)},Nc=()=>{try{return S0()||P0()||N0()||x0()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},A_=r=>{var e,t;return(t=(e=Nc())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},R_=r=>{const e=A_(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},k_=()=>{var r;return(r=Nc())===null||r===void 0?void 0:r.config},C_=r=>{var e;return(e=Nc())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D0{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bi(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function vf(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P_(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",o=r.iat||0,l=r.sub||r.user_id;if(!l)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:l,user_id:l,firebase:{sign_in_provider:"custom",identities:{}}},r);return[ac(JSON.stringify(t)),ac(JSON.stringify(h)),""].join(".")}const Ga={};function O0(){const r={prod:[],emulator:[]};for(const e of Object.keys(Ga))Ga[e]?r.emulator.push(e):r.prod.push(e);return r}function V0(r){let e=document.getElementById(r),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",r),t=!0),{created:t,element:e}}let Vg=!1;function Ef(r,e){if(typeof window>"u"||typeof document>"u"||!bi(window.location.host)||Ga[r]===e||Ga[r]||Vg)return;Ga[r]=e;function t(C){return`__firebase__banner__${C}`}const s="__firebase__banner",l=O0().prod.length>0;function h(){const C=document.getElementById(s);C&&C.remove()}function f(C){C.style.display="flex",C.style.background="#7faaf0",C.style.position="fixed",C.style.bottom="5px",C.style.left="5px",C.style.padding=".5em",C.style.borderRadius="5px",C.style.alignItems="center"}function g(C,z){C.setAttribute("width","24"),C.setAttribute("id",z),C.setAttribute("height","24"),C.setAttribute("viewBox","0 0 24 24"),C.setAttribute("fill","none"),C.style.marginLeft="-6px"}function _(){const C=document.createElement("span");return C.style.cursor="pointer",C.style.marginLeft="16px",C.style.fontSize="24px",C.innerHTML=" &times;",C.onclick=()=>{Vg=!0,h()},C}function T(C,z){C.setAttribute("id",z),C.innerText="Learn more",C.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",C.setAttribute("target","__blank"),C.style.paddingLeft="5px",C.style.textDecoration="underline"}function A(){const C=V0(s),z=t("text"),W=document.getElementById(z)||document.createElement("span"),Y=t("learnmore"),B=document.getElementById(Y)||document.createElement("a"),ve=t("preprendIcon"),fe=document.getElementById(ve)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(C.created){const ce=C.element;f(ce),T(B,Y);const pe=_();g(fe,ve),ce.append(fe,W,B,pe),document.body.appendChild(ce)}l?(W.innerText="Preview backend disconnected.",fe.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(fe.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,W.innerText="Preview backend running in this workspace."),W.setAttribute("id",z)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",A):A()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function b0(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(qt())}function L0(){var r;const e=(r=Nc())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function M0(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function j0(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function F0(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function U0(){const r=qt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function z0(){return!L0()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function B0(){try{return typeof indexedDB=="object"}catch{return!1}}function $0(){return new Promise((r,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(s),r(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var l;e(((l=o.error)===null||l===void 0?void 0:l.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H0="FirebaseError";class _r extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=H0,Object.setPrototypeOf(this,_r.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,pl.prototype.create)}}class pl{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},o=`${this.service}/${e}`,l=this.errors[e],h=l?q0(l,s):"Error",f=`${this.serviceName}: ${h} (${o}).`;return new _r(o,f,s)}}function q0(r,e){return r.replace(W0,(t,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const W0=/\{\$([^}]+)}/g;function K0(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function gs(r,e){if(r===e)return!0;const t=Object.keys(r),s=Object.keys(e);for(const o of t){if(!s.includes(o))return!1;const l=r[o],h=e[o];if(bg(l)&&bg(h)){if(!gs(l,h))return!1}else if(l!==h)return!1}for(const o of s)if(!t.includes(o))return!1;return!0}function bg(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fo(r){const e=[];for(const[t,s]of Object.entries(r))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Ba(r){const e={};return r.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[o,l]=s.split("=");e[decodeURIComponent(o)]=decodeURIComponent(l)}}),e}function $a(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function G0(r,e){const t=new Q0(r,e);return t.subscribe.bind(t)}class Q0{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let o;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Y0(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:s},o.next===void 0&&(o.next=Rd),o.error===void 0&&(o.error=Rd),o.complete===void 0&&(o.complete=Rd);const l=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),l}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Y0(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Rd(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tt(r){return r&&r._delegate?r._delegate:r}class ki{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hs="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X0{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new D0;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(l){if(o)return null;throw l}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Z0(e))try{this.getOrInitializeService({instanceIdentifier:hs})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const l=this.getOrInitializeService({instanceIdentifier:o});s.resolve(l)}catch{}}}}clearInstance(e=hs){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=hs){return this.instances.has(e)}getOptions(e=hs){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[l,h]of this.instancesDeferred.entries()){const f=this.normalizeInstanceIdentifier(l);s===f&&h.resolve(o)}return o}onInit(e,t){var s;const o=this.normalizeInstanceIdentifier(t),l=(s=this.onInitCallbacks.get(o))!==null&&s!==void 0?s:new Set;l.add(e),this.onInitCallbacks.set(o,l);const h=this.instances.get(o);return h&&e(h,o),()=>{l.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const o of s)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:J0(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=hs){return this.component?this.component.multipleInstances?e:hs:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function J0(r){return r===hs?void 0:r}function Z0(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eT{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new X0(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ne;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(Ne||(Ne={}));const tT={debug:Ne.DEBUG,verbose:Ne.VERBOSE,info:Ne.INFO,warn:Ne.WARN,error:Ne.ERROR,silent:Ne.SILENT},nT=Ne.INFO,rT={[Ne.DEBUG]:"log",[Ne.VERBOSE]:"log",[Ne.INFO]:"info",[Ne.WARN]:"warn",[Ne.ERROR]:"error"},iT=(r,e,...t)=>{if(e<r.logLevel)return;const s=new Date().toISOString(),o=rT[e];if(o)console[o](`[${s}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class wf{constructor(e){this.name=e,this._logLevel=nT,this._logHandler=iT,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Ne))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?tT[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Ne.DEBUG,...e),this._logHandler(this,Ne.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Ne.VERBOSE,...e),this._logHandler(this,Ne.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Ne.INFO,...e),this._logHandler(this,Ne.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Ne.WARN,...e),this._logHandler(this,Ne.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Ne.ERROR,...e),this._logHandler(this,Ne.ERROR,...e)}}const sT=(r,e)=>e.some(t=>r instanceof t);let Lg,Mg;function oT(){return Lg||(Lg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function aT(){return Mg||(Mg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const N_=new WeakMap,Bd=new WeakMap,x_=new WeakMap,kd=new WeakMap,Tf=new WeakMap;function lT(r){const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("success",l),r.removeEventListener("error",h)},l=()=>{t(wi(r.result)),o()},h=()=>{s(r.error),o()};r.addEventListener("success",l),r.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&N_.set(t,r)}).catch(()=>{}),Tf.set(e,r),e}function uT(r){if(Bd.has(r))return;const e=new Promise((t,s)=>{const o=()=>{r.removeEventListener("complete",l),r.removeEventListener("error",h),r.removeEventListener("abort",h)},l=()=>{t(),o()},h=()=>{s(r.error||new DOMException("AbortError","AbortError")),o()};r.addEventListener("complete",l),r.addEventListener("error",h),r.addEventListener("abort",h)});Bd.set(r,e)}let $d={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Bd.get(r);if(e==="objectStoreNames")return r.objectStoreNames||x_.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return wi(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function cT(r){$d=r($d)}function hT(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=r.call(Cd(this),e,...t);return x_.set(s,e.sort?e.sort():[e]),wi(s)}:aT().includes(r)?function(...e){return r.apply(Cd(this),e),wi(N_.get(this))}:function(...e){return wi(r.apply(Cd(this),e))}}function dT(r){return typeof r=="function"?hT(r):(r instanceof IDBTransaction&&uT(r),sT(r,oT())?new Proxy(r,$d):r)}function wi(r){if(r instanceof IDBRequest)return lT(r);if(kd.has(r))return kd.get(r);const e=dT(r);return e!==r&&(kd.set(r,e),Tf.set(e,r)),e}const Cd=r=>Tf.get(r);function fT(r,e,{blocked:t,upgrade:s,blocking:o,terminated:l}={}){const h=indexedDB.open(r,e),f=wi(h);return s&&h.addEventListener("upgradeneeded",g=>{s(wi(h.result),g.oldVersion,g.newVersion,wi(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),f.then(g=>{l&&g.addEventListener("close",()=>l()),o&&g.addEventListener("versionchange",_=>o(_.oldVersion,_.newVersion,_))}).catch(()=>{}),f}const pT=["get","getKey","getAll","getAllKeys","count"],mT=["put","add","delete","clear"],Pd=new Map;function jg(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Pd.get(e))return Pd.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,o=mT.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(o||pT.includes(t)))return;const l=async function(h,...f){const g=this.transaction(h,o?"readwrite":"readonly");let _=g.store;return s&&(_=_.index(f.shift())),(await Promise.all([_[t](...f),o&&g.done]))[0]};return Pd.set(e,l),l}cT(r=>({...r,get:(e,t,s)=>jg(e,t)||r.get(e,t,s),has:(e,t)=>!!jg(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gT{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(yT(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function yT(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Hd="@firebase/app",Fg="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr=new wf("@firebase/app"),_T="@firebase/app-compat",vT="@firebase/analytics-compat",ET="@firebase/analytics",wT="@firebase/app-check-compat",TT="@firebase/app-check",IT="@firebase/auth",ST="@firebase/auth-compat",AT="@firebase/database",RT="@firebase/data-connect",kT="@firebase/database-compat",CT="@firebase/functions",PT="@firebase/functions-compat",NT="@firebase/installations",xT="@firebase/installations-compat",DT="@firebase/messaging",OT="@firebase/messaging-compat",VT="@firebase/performance",bT="@firebase/performance-compat",LT="@firebase/remote-config",MT="@firebase/remote-config-compat",jT="@firebase/storage",FT="@firebase/storage-compat",UT="@firebase/firestore",zT="@firebase/ai",BT="@firebase/firestore-compat",$T="firebase",HT="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qd="[DEFAULT]",qT={[Hd]:"fire-core",[_T]:"fire-core-compat",[ET]:"fire-analytics",[vT]:"fire-analytics-compat",[TT]:"fire-app-check",[wT]:"fire-app-check-compat",[IT]:"fire-auth",[ST]:"fire-auth-compat",[AT]:"fire-rtdb",[RT]:"fire-data-connect",[kT]:"fire-rtdb-compat",[CT]:"fire-fn",[PT]:"fire-fn-compat",[NT]:"fire-iid",[xT]:"fire-iid-compat",[DT]:"fire-fcm",[OT]:"fire-fcm-compat",[VT]:"fire-perf",[bT]:"fire-perf-compat",[LT]:"fire-rc",[MT]:"fire-rc-compat",[jT]:"fire-gcs",[FT]:"fire-gcs-compat",[UT]:"fire-fst",[BT]:"fire-fst-compat",[zT]:"fire-vertex","fire-js":"fire-js",[$T]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lc=new Map,WT=new Map,Wd=new Map;function Ug(r,e){try{r.container.addComponent(e)}catch(t){zr.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function ys(r){const e=r.name;if(Wd.has(e))return zr.debug(`There were multiple attempts to register component ${e}.`),!1;Wd.set(e,r);for(const t of lc.values())Ug(t,r);for(const t of WT.values())Ug(t,r);return!0}function xc(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Yt(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ti=new pl("app","Firebase",KT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GT{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new ki("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ti.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is=HT;function D_(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const s=Object.assign({name:qd,automaticDataCollectionEnabled:!0},e),o=s.name;if(typeof o!="string"||!o)throw Ti.create("bad-app-name",{appName:String(o)});if(t||(t=k_()),!t)throw Ti.create("no-options");const l=lc.get(o);if(l){if(gs(t,l.options)&&gs(s,l.config))return l;throw Ti.create("duplicate-app",{appName:o})}const h=new eT(o);for(const g of Wd.values())h.addComponent(g);const f=new GT(t,s,h);return lc.set(o,f),f}function If(r=qd){const e=lc.get(r);if(!e&&r===qd&&k_())return D_();if(!e)throw Ti.create("no-app",{appName:r});return e}function hr(r,e,t){var s;let o=(s=qT[r])!==null&&s!==void 0?s:r;t&&(o+=`-${t}`);const l=o.match(/\s|\//),h=e.match(/\s|\//);if(l||h){const f=[`Unable to register library "${o}" with version "${e}":`];l&&f.push(`library name "${o}" contains illegal characters (whitespace or "/")`),l&&h&&f.push("and"),h&&f.push(`version name "${e}" contains illegal characters (whitespace or "/")`),zr.warn(f.join(" "));return}ys(new ki(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QT="firebase-heartbeat-database",YT=1,rl="firebase-heartbeat-store";let Nd=null;function O_(){return Nd||(Nd=fT(QT,YT,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(rl)}catch(t){console.warn(t)}}}}).catch(r=>{throw Ti.create("idb-open",{originalErrorMessage:r.message})})),Nd}async function XT(r){try{const t=(await O_()).transaction(rl),s=await t.objectStore(rl).get(V_(r));return await t.done,s}catch(e){if(e instanceof _r)zr.warn(e.message);else{const t=Ti.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});zr.warn(t.message)}}}async function zg(r,e){try{const s=(await O_()).transaction(rl,"readwrite");await s.objectStore(rl).put(e,V_(r)),await s.done}catch(t){if(t instanceof _r)zr.warn(t.message);else{const s=Ti.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});zr.warn(s.message)}}}function V_(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JT=1024,ZT=30;class eI{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new nI(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),l=Bg();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(h=>h.date===l))return;if(this._heartbeatsCache.heartbeats.push({date:l,agent:o}),this._heartbeatsCache.heartbeats.length>ZT){const h=rI(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){zr.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Bg(),{heartbeatsToSend:s,unsentEntries:o}=tI(this._heartbeatsCache.heartbeats),l=ac(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}catch(t){return zr.warn(t),""}}}function Bg(){return new Date().toISOString().substring(0,10)}function tI(r,e=JT){const t=[];let s=r.slice();for(const o of r){const l=t.find(h=>h.agent===o.agent);if(l){if(l.dates.push(o.date),$g(t)>e){l.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),$g(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class nI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return B0()?$0().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await XT(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return zg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return zg(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function $g(r){return ac(JSON.stringify({version:2,heartbeats:r})).length}function rI(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let s=1;s<r.length;s++)r[s].date<t&&(t=r[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iI(r){ys(new ki("platform-logger",e=>new gT(e),"PRIVATE")),ys(new ki("heartbeat",e=>new eI(e),"PRIVATE")),hr(Hd,Fg,r),hr(Hd,Fg,"esm2017"),hr("fire-js","")}iI("");function Sf(r,e){var t={};for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&e.indexOf(s)<0&&(t[s]=r[s]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,s=Object.getOwnPropertySymbols(r);o<s.length;o++)e.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(r,s[o])&&(t[s[o]]=r[s[o]]);return t}function b_(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const sI=b_,L_=new pl("auth","Firebase",b_());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uc=new wf("@firebase/auth");function oI(r,...e){uc.logLevel<=Ne.WARN&&uc.warn(`Auth (${Is}): ${r}`,...e)}function Qu(r,...e){uc.logLevel<=Ne.ERROR&&uc.error(`Auth (${Is}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dn(r,...e){throw Rf(r,...e)}function un(r,...e){return Rf(r,...e)}function Af(r,e,t){const s=Object.assign(Object.assign({},sI()),{[e]:t});return new pl("auth","Firebase",s).create(e,{appName:r.name})}function dr(r){return Af(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function aI(r,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&Dn(r,"argument-error"),Af(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Rf(r,...e){if(typeof r!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=r.name),r._errorFactory.create(t,...s)}return L_.create(r,...e)}function re(r,e,...t){if(!r)throw Rf(e,...t)}function jr(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Qu(e),new Error(e)}function Br(r,e){r||jr(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kd(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function M_(){return Hg()==="http:"||Hg()==="https:"}function Hg(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(M_()||j0()||"connection"in navigator)?navigator.onLine:!0}function uI(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e,t){this.shortDelay=e,this.longDelay=t,Br(t>e,"Short delay should be less than long delay!"),this.isMobile=b0()||F0()}get(){return lI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kf(r,e){Br(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j_{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;jr("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;jr("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;jr("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],dI=new ml(3e4,6e4);function cn(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function On(r,e,t,s,o={}){return F_(r,o,async()=>{let l={},h={};s&&(e==="GET"?h=s:l={body:JSON.stringify(s)});const f=Fo(Object.assign({key:r.config.apiKey},h)).slice(1),g=await r._getAdditionalHeaders();g["Content-Type"]="application/json",r.languageCode&&(g["X-Firebase-Locale"]=r.languageCode);const _=Object.assign({method:e,headers:g},l);return M0()||(_.referrerPolicy="no-referrer"),r.emulatorConfig&&bi(r.emulatorConfig.host)&&(_.credentials="include"),j_.fetch()(await U_(r,r.config.apiHost,t,f),_)})}async function F_(r,e,t){r._canInitEmulator=!1;const s=Object.assign(Object.assign({},cI),e);try{const o=new pI(r),l=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await l.json();if("needConfirmation"in h)throw Ha(r,"account-exists-with-different-credential",h);if(l.ok&&!("errorMessage"in h))return h;{const f=l.ok?h.errorMessage:h.error.message,[g,_]=f.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw Ha(r,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw Ha(r,"email-already-in-use",h);if(g==="USER_DISABLED")throw Ha(r,"user-disabled",h);const T=s[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(_)throw Af(r,T,_);Dn(r,T)}}catch(o){if(o instanceof _r)throw o;Dn(r,"network-request-failed",{message:String(o)})}}async function Li(r,e,t,s,o={}){const l=await On(r,e,t,s,o);return"mfaPendingCredential"in l&&Dn(r,"multi-factor-auth-required",{_serverResponse:l}),l}async function U_(r,e,t,s){const o=`${e}${t}?${s}`,l=r,h=l.config.emulator?kf(r.config,o):`${r.config.apiScheme}://${o}`;return hI.includes(t)&&(await l._persistenceManagerAvailable,l._getPersistenceType()==="COOKIE")?l._getPersistence()._getFinalTarget(h).toString():h}function fI(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class pI{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(un(this.auth,"network-request-failed")),dI.get())})}}function Ha(r,e,t){const s={appName:r.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const o=un(r,e,s);return o.customData._tokenResponse=t,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qg(r){return r!==void 0&&r.getResponse!==void 0}function Wg(r){return r!==void 0&&r.enterprise!==void 0}class z_{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return fI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mI(r){return(await On(r,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function B_(r,e){return On(r,"GET","/v2/recaptchaConfig",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gI(r,e){return On(r,"POST","/v1/accounts:delete",e)}async function cc(r,e){return On(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qa(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function yI(r,e=!1){const t=Tt(r),s=await t.getIdToken(e),o=Cf(s);re(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const l=typeof o.firebase=="object"?o.firebase:void 0,h=l==null?void 0:l.sign_in_provider;return{claims:o,token:s,authTime:Qa(xd(o.auth_time)),issuedAtTime:Qa(xd(o.iat)),expirationTime:Qa(xd(o.exp)),signInProvider:h||null,signInSecondFactor:(l==null?void 0:l.sign_in_second_factor)||null}}function xd(r){return Number(r)*1e3}function Cf(r){const[e,t,s]=r.split(".");if(e===void 0||t===void 0||s===void 0)return Qu("JWT malformed, contained fewer than 3 sections"),null;try{const o=S_(t);return o?JSON.parse(o):(Qu("Failed to decode base64 JWT payload"),null)}catch(o){return Qu("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function Kg(r){const e=Cf(r);return re(e,"internal-error"),re(typeof e.exp<"u","internal-error"),re(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function il(r,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof _r&&_I(s)&&r.auth.currentUser===r&&await r.auth.signOut(),s}}function _I({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const s=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),s}else{this.errorBackoff=3e4;const o=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Qa(this.lastLoginAt),this.creationTime=Qa(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hc(r){var e;const t=r.auth,s=await r.getIdToken(),o=await il(r,cc(t,{idToken:s}));re(o==null?void 0:o.users.length,t,"internal-error");const l=o.users[0];r._notifyReloadListener(l);const h=!((e=l.providerUserInfo)===null||e===void 0)&&e.length?$_(l.providerUserInfo):[],f=wI(r.providerData,h),g=r.isAnonymous,_=!(r.email&&l.passwordHash)&&!(f!=null&&f.length),T=g?_:!1,A={uid:l.localId,displayName:l.displayName||null,photoURL:l.photoUrl||null,email:l.email||null,emailVerified:l.emailVerified||!1,phoneNumber:l.phoneNumber||null,tenantId:l.tenantId||null,providerData:f,metadata:new Gd(l.createdAt,l.lastLoginAt),isAnonymous:T};Object.assign(r,A)}async function EI(r){const e=Tt(r);await hc(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function wI(r,e){return[...r.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function $_(r){return r.map(e=>{var{providerId:t}=e,s=Sf(e,["providerId"]);return{providerId:t,uid:s.rawId||"",displayName:s.displayName||null,email:s.email||null,phoneNumber:s.phoneNumber||null,photoURL:s.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TI(r,e){const t=await F_(r,{},async()=>{const s=Fo({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:l}=r.config,h=await U_(r,o,"/v1/token",`key=${l}`),f=await r._getAdditionalHeaders();f["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:f,body:s};return r.emulatorConfig&&bi(r.emulatorConfig.host)&&(g.credentials="include"),j_.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function II(r,e){return On(r,"POST","/v2/accounts:revokeToken",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ro{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){re(e.idToken,"internal-error"),re(typeof e.idToken<"u","internal-error"),re(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Kg(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){re(e.length!==0,"internal-error");const t=Kg(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(re(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:o,expiresIn:l}=await TI(e,t);this.updateTokensAndExpiration(s,o,Number(l))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:o,expirationTime:l}=t,h=new Ro;return s&&(re(typeof s=="string","internal-error",{appName:e}),h.refreshToken=s),o&&(re(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),l&&(re(typeof l=="number","internal-error",{appName:e}),h.expirationTime=l),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ro,this.toJSON())}_performRefresh(){return jr("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gi(r,e){re(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class Qn{constructor(e){var{uid:t,auth:s,stsTokenManager:o}=e,l=Sf(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new vI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=s,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=l.displayName||null,this.email=l.email||null,this.emailVerified=l.emailVerified||!1,this.phoneNumber=l.phoneNumber||null,this.photoURL=l.photoURL||null,this.isAnonymous=l.isAnonymous||!1,this.tenantId=l.tenantId||null,this.providerData=l.providerData?[...l.providerData]:[],this.metadata=new Gd(l.createdAt||void 0,l.lastLoginAt||void 0)}async getIdToken(e){const t=await il(this,this.stsTokenManager.getToken(this.auth,e));return re(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return yI(this,e)}reload(){return EI(this)}_assign(e){this!==e&&(re(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Qn(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){re(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await hc(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Yt(this.auth.app))return Promise.reject(dr(this.auth));const e=await this.getIdToken();return await il(this,gI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var s,o,l,h,f,g,_,T;const A=(s=t.displayName)!==null&&s!==void 0?s:void 0,C=(o=t.email)!==null&&o!==void 0?o:void 0,z=(l=t.phoneNumber)!==null&&l!==void 0?l:void 0,W=(h=t.photoURL)!==null&&h!==void 0?h:void 0,Y=(f=t.tenantId)!==null&&f!==void 0?f:void 0,B=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,ve=(_=t.createdAt)!==null&&_!==void 0?_:void 0,fe=(T=t.lastLoginAt)!==null&&T!==void 0?T:void 0,{uid:ce,emailVerified:pe,isAnonymous:be,providerData:Te,stsTokenManager:P}=t;re(ce&&P,e,"internal-error");const I=Ro.fromJSON(this.name,P);re(typeof ce=="string",e,"internal-error"),gi(A,e.name),gi(C,e.name),re(typeof pe=="boolean",e,"internal-error"),re(typeof be=="boolean",e,"internal-error"),gi(z,e.name),gi(W,e.name),gi(Y,e.name),gi(B,e.name),gi(ve,e.name),gi(fe,e.name);const k=new Qn({uid:ce,auth:e,email:C,emailVerified:pe,displayName:A,isAnonymous:be,photoURL:W,phoneNumber:z,tenantId:Y,stsTokenManager:I,createdAt:ve,lastLoginAt:fe});return Te&&Array.isArray(Te)&&(k.providerData=Te.map(x=>Object.assign({},x))),B&&(k._redirectEventId=B),k}static async _fromIdTokenResponse(e,t,s=!1){const o=new Ro;o.updateFromServerResponse(t);const l=new Qn({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await hc(l),l}static async _fromGetAccountInfoResponse(e,t,s){const o=t.users[0];re(o.localId!==void 0,"internal-error");const l=o.providerUserInfo!==void 0?$_(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(l!=null&&l.length),f=new Ro;f.updateFromIdToken(s);const g=new Qn({uid:o.localId,auth:e,stsTokenManager:f,isAnonymous:h}),_={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new Gd(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(l!=null&&l.length)};return Object.assign(g,_),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg=new Map;function Fr(r){Br(r instanceof Function,"Expected a class definition");let e=Gg.get(r);return e?(Br(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Gg.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}H_.type="NONE";const Qg=H_;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yu(r,e,t){return`firebase:${r}:${e}:${t}`}class ko{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:o,name:l}=this.auth;this.fullUserKey=Yu(this.userKey,o.apiKey,l),this.fullPersistenceKey=Yu("persistence",o.apiKey,l),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await cc(this.auth,{idToken:e}).catch(()=>{});return t?Qn._fromGetAccountInfoResponse(this.auth,t,e):null}return Qn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new ko(Fr(Qg),e,s);const o=(await Promise.all(t.map(async _=>{if(await _._isAvailable())return _}))).filter(_=>_);let l=o[0]||Fr(Qg);const h=Yu(s,e.config.apiKey,e.name);let f=null;for(const _ of t)try{const T=await _._get(h);if(T){let A;if(typeof T=="string"){const C=await cc(e,{idToken:T}).catch(()=>{});if(!C)break;A=await Qn._fromGetAccountInfoResponse(e,C,T)}else A=Qn._fromJSON(e,T);_!==l&&(f=A),l=_;break}}catch{}const g=o.filter(_=>_._shouldAllowMigration);return!l._shouldAllowMigration||!g.length?new ko(l,e,s):(l=g[0],f&&await l._set(h,f.toJSON()),await Promise.all(t.map(async _=>{if(_!==l)try{await _._remove(h)}catch{}})),new ko(l,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yg(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(G_(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(q_(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Y_(e))return"Blackberry";if(X_(e))return"Webos";if(W_(e))return"Safari";if((e.includes("chrome/")||K_(e))&&!e.includes("edge/"))return"Chrome";if(Q_(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=r.match(t);if((s==null?void 0:s.length)===2)return s[1]}return"Other"}function q_(r=qt()){return/firefox\//i.test(r)}function W_(r=qt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function K_(r=qt()){return/crios\//i.test(r)}function G_(r=qt()){return/iemobile/i.test(r)}function Q_(r=qt()){return/android/i.test(r)}function Y_(r=qt()){return/blackberry/i.test(r)}function X_(r=qt()){return/webos/i.test(r)}function Pf(r=qt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function SI(r=qt()){var e;return Pf(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function AI(){return U0()&&document.documentMode===10}function J_(r=qt()){return Pf(r)||Q_(r)||X_(r)||Y_(r)||/windows phone/i.test(r)||G_(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z_(r,e=[]){let t;switch(r){case"Browser":t=Yg(qt());break;case"Worker":t=`${Yg(qt())}-${r}`;break;default:t=r}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Is}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RI{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=l=>new Promise((h,f)=>{try{const g=e(l);h(g)}catch(g){f(g)}});s.onAbort=t,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s==null?void 0:s.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kI(r,e={}){return On(r,"GET","/v2/passwordPolicy",cn(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CI=6;class PI{constructor(e){var t,s,o,l;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=h.minPasswordLength)!==null&&t!==void 0?t:CI,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(s=e.allowedNonAlphanumericCharacters)===null||s===void 0?void 0:s.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(l=e.forceUpgradeOnSignin)!==null&&l!==void 0?l:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,s,o,l,h,f;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(s=g.meetsMaxPasswordLength)!==null&&s!==void 0?s:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(l=g.containsUppercaseLetter)!==null&&l!==void 0?l:!0),g.isValid&&(g.isValid=(h=g.containsNumericCharacter)!==null&&h!==void 0?h:!0),g.isValid&&(g.isValid=(f=g.containsNonAlphanumericCharacter)!==null&&f!==void 0?f:!0),g}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,o,l){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NI{constructor(e,t,s,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Xg(this),this.idTokenSubscription=new Xg(this),this.beforeStateQueue=new RI(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=L_,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(l=>this._resolvePersistenceManagerAvailable=l)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Fr(t)),this._initializationPromise=this.queue(async()=>{var s,o,l;if(!this._deleted&&(this.persistenceManager=await ko.create(this,e),(s=this._resolvePersistenceManagerAvailable)===null||s===void 0||s.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((l=this.currentUser)===null||l===void 0?void 0:l.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await cc(this,{idToken:e}),s=await Qn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Yt(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(f=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(f,f))}):this.directlySetCurrentUser(null)}const s=await this.assertedPersistence.getCurrentUser();let o=s,l=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,f=o==null?void 0:o._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===f)&&(g!=null&&g.user)&&(o=g.user,l=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(l)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=s,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return re(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await hc(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=uI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Yt(this.app))return Promise.reject(dr(this));const t=e?Tt(e):null;return t&&re(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&re(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Yt(this.app)?Promise.reject(dr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Yt(this.app)?Promise.reject(dr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Fr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await kI(this),t=new PI(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new pl("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await II(this,s)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Fr(e)||this._popupRedirectResolver;re(t,this,"argument-error"),this.redirectPersistenceManager=await ko.create(this,[Fr(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,s;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((s=this.redirectUser)===null||s===void 0?void 0:s._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const s=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==s&&(this.lastNotifiedUid=s,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,o){if(this._deleted)return()=>{};const l=typeof t=="function"?t:t.next.bind(t);let h=!1;const f=this._isInitialized?Promise.resolve():this._initializationPromise;if(re(f,this,"internal-error"),f.then(()=>{h||l(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,s,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return re(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Z_(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const s=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());s&&(t["X-Firebase-Client"]=s);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(Yt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&oI(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Jn(r){return Tt(r)}class Xg{constructor(e){this.auth=e,this.observer=null,this.addObserver=G0(t=>this.observer=t)}get next(){return re(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gl={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function xI(r){gl=r}function Nf(r){return gl.loadJS(r)}function DI(){return gl.recaptchaV2Script}function OI(){return gl.recaptchaEnterpriseScript}function VI(){return gl.gapiScript}function ev(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI=500,LI=6e4,zu=1e12;class MI{constructor(e){this.auth=e,this.counter=zu,this._widgets=new Map}render(e,t){const s=this.counter;return this._widgets.set(s,new UI(e,this.auth.name,t||{})),this.counter++,s}reset(e){var t;const s=e||zu;(t=this._widgets.get(s))===null||t===void 0||t.delete(),this._widgets.delete(s)}getResponse(e){var t;const s=e||zu;return((t=this._widgets.get(s))===null||t===void 0?void 0:t.getResponse())||""}async execute(e){var t;const s=e||zu;return(t=this._widgets.get(s))===null||t===void 0||t.execute(),""}}class jI{constructor(){this.enterprise=new FI}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class FI{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class UI{constructor(e,t,s){this.params=s,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const o=typeof e=="string"?document.getElementById(e):e;re(o,"argument-error",{appName:t}),this.container=o,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=zI(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},LI)},bI))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function zI(r){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let s=0;s<r;s++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}const BI="recaptcha-enterprise",Ya="NO_RECAPTCHA";class tv{constructor(e){this.type=BI,this.auth=Jn(e)}async verify(e="verify",t=!1){async function s(l){if(!t){if(l.tenantId==null&&l._agentRecaptchaConfig!=null)return l._agentRecaptchaConfig.siteKey;if(l.tenantId!=null&&l._tenantRecaptchaConfigs[l.tenantId]!==void 0)return l._tenantRecaptchaConfigs[l.tenantId].siteKey}return new Promise(async(h,f)=>{B_(l,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)f(new Error("recaptcha Enterprise site key undefined"));else{const _=new z_(g);return l.tenantId==null?l._agentRecaptchaConfig=_:l._tenantRecaptchaConfigs[l.tenantId]=_,h(_.siteKey)}}).catch(g=>{f(g)})})}function o(l,h,f){const g=window.grecaptcha;Wg(g)?g.enterprise.ready(()=>{g.enterprise.execute(l,{action:e}).then(_=>{h(_)}).catch(()=>{h(Ya)})}):f(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new jI().execute("siteKey",{action:"verify"}):new Promise((l,h)=>{s(this.auth).then(f=>{if(!t&&Wg(window.grecaptcha))o(f,l,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=OI();g.length!==0&&(g+=f),Nf(g).then(()=>{o(f,l,h)}).catch(_=>{h(_)})}}).catch(f=>{h(f)})})}}async function Ua(r,e,t,s=!1,o=!1){const l=new tv(r);let h;if(o)h=Ya;else try{h=await l.verify(t)}catch{h=await l.verify(t,!0)}const f=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in f){const g=f.phoneEnrollmentInfo.phoneNumber,_=f.phoneEnrollmentInfo.recaptchaToken;Object.assign(f,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:_,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in f){const g=f.phoneSignInInfo.recaptchaToken;Object.assign(f,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return f}return s?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}async function Co(r,e,t,s,o){var l,h;if(o==="EMAIL_PASSWORD_PROVIDER")if(!((l=r._getRecaptchaConfig())===null||l===void 0)&&l.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const f=await Ua(r,e,t,t==="getOobCode");return s(r,f)}else return s(r,e).catch(async f=>{if(f.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const g=await Ua(r,e,t,t==="getOobCode");return s(r,g)}else return Promise.reject(f)});else if(o==="PHONE_PROVIDER")if(!((h=r._getRecaptchaConfig())===null||h===void 0)&&h.isProviderEnabled("PHONE_PROVIDER")){const f=await Ua(r,e,t);return s(r,f).catch(async g=>{var _;if(((_=r._getRecaptchaConfig())===null||_===void 0?void 0:_.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(g.code==="auth/missing-recaptcha-token"||g.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);const T=await Ua(r,e,t,!1,!0);return s(r,T)}return Promise.reject(g)})}else{const f=await Ua(r,e,t,!1,!0);return s(r,f)}else return Promise.reject(o+" provider is not supported.")}async function $I(r){const e=Jn(r),t=await B_(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),s=new z_(t);e.tenantId==null?e._agentRecaptchaConfig=s:e._tenantRecaptchaConfigs[e.tenantId]=s,s.isAnyProviderEnabled()&&new tv(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HI(r,e){const t=xc(r,"auth");if(t.isInitialized()){const o=t.getImmediate(),l=t.getOptions();if(gs(l,e??{}))return o;Dn(o,"already-initialized")}return t.initialize({options:e})}function qI(r,e){const t=(e==null?void 0:e.persistence)||[],s=(Array.isArray(t)?t:[t]).map(Fr);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(s,e==null?void 0:e.popupRedirectResolver)}function WI(r,e,t){const s=Jn(r);re(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,l=nv(e),{host:h,port:f}=KI(e),g=f===null?"":`:${f}`,_={url:`${l}//${h}${g}/`},T=Object.freeze({host:h,port:f,protocol:l.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){re(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),re(gs(_,s.config.emulator)&&gs(T,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=_,s.emulatorConfig=T,s.settings.appVerificationDisabledForTesting=!0,bi(h)?(vf(`${l}//${h}${g}`),Ef("Auth",!0)):GI()}function nv(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function KI(r){const e=nv(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const l=o[1];return{host:l,port:Jg(s.substr(l.length+1))}}else{const[l,h]=s.split(":");return{host:l,port:Jg(h)}}}function Jg(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function GI(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return jr("not implemented")}_getIdTokenResponse(e){return jr("not implemented")}_linkToIdToken(e,t){return jr("not implemented")}_getReauthenticationResolver(e){return jr("not implemented")}}async function QI(r,e){return On(r,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YI(r,e){return Li(r,"POST","/v1/accounts:signInWithPassword",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function XI(r,e){return Li(r,"POST","/v1/accounts:signInWithEmailLink",cn(r,e))}async function JI(r,e){return Li(r,"POST","/v1/accounts:signInWithEmailLink",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sl extends Dc{constructor(e,t,s,o=null){super("password",s),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new sl(e,t,"password")}static _fromEmailAndCode(e,t,s=null){return new sl(e,t,"emailLink",s)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Co(e,t,"signInWithPassword",YI,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return XI(e,{email:this._email,oobCode:this._password});default:Dn(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const s={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Co(e,s,"signUpPassword",QI,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return JI(e,{idToken:t,email:this._email,oobCode:this._password});default:Dn(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Po(r,e){return Li(r,"POST","/v1/accounts:signInWithIdp",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZI="http://localhost";class _s extends Dc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new _s(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Dn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o}=t,l=Sf(t,["providerId","signInMethod"]);if(!s||!o)return null;const h=new _s(s,o);return h.idToken=l.idToken||void 0,h.accessToken=l.accessToken||void 0,h.secret=l.secret,h.nonce=l.nonce,h.pendingToken=l.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return Po(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,Po(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Po(e,t)}buildRequest(){const e={requestUri:ZI,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Fo(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zg(r,e){return On(r,"POST","/v1/accounts:sendVerificationCode",cn(r,e))}async function e1(r,e){return Li(r,"POST","/v1/accounts:signInWithPhoneNumber",cn(r,e))}async function t1(r,e){const t=await Li(r,"POST","/v1/accounts:signInWithPhoneNumber",cn(r,e));if(t.temporaryProof)throw Ha(r,"account-exists-with-different-credential",t);return t}const n1={USER_NOT_FOUND:"user-not-found"};async function r1(r,e){const t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return Li(r,"POST","/v1/accounts:signInWithPhoneNumber",cn(r,t),n1)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xa extends Dc{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new Xa({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new Xa({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return e1(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return t1(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return r1(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:s,verificationCode:o}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:s,code:o}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:s,phoneNumber:o,temporaryProof:l}=e;return!s&&!t&&!o&&!l?null:new Xa({verificationId:t,verificationCode:s,phoneNumber:o,temporaryProof:l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i1(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function s1(r){const e=Ba($a(r)).link,t=e?Ba($a(e)).deep_link_id:null,s=Ba($a(r)).deep_link_id;return(s?Ba($a(s)).link:null)||s||t||e||r}class xf{constructor(e){var t,s,o,l,h,f;const g=Ba($a(e)),_=(t=g.apiKey)!==null&&t!==void 0?t:null,T=(s=g.oobCode)!==null&&s!==void 0?s:null,A=i1((o=g.mode)!==null&&o!==void 0?o:null);re(_&&T&&A,"argument-error"),this.apiKey=_,this.operation=A,this.code=T,this.continueUrl=(l=g.continueUrl)!==null&&l!==void 0?l:null,this.languageCode=(h=g.lang)!==null&&h!==void 0?h:null,this.tenantId=(f=g.tenantId)!==null&&f!==void 0?f:null}static parseLink(e){const t=s1(e);try{return new xf(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(){this.providerId=Uo.PROVIDER_ID}static credential(e,t){return sl._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const s=xf.parseLink(t);return re(s,"argument-error"),sl._fromEmailAndCode(e,s.code,s.tenantId)}}Uo.PROVIDER_ID="password";Uo.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Uo.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Df{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yl extends Df{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi extends yl{constructor(){super("facebook.com")}static credential(e){return _s._fromParams({providerId:yi.PROVIDER_ID,signInMethod:yi.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yi.credentialFromTaggedObject(e)}static credentialFromError(e){return yi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yi.credential(e.oauthAccessToken)}catch{return null}}}yi.FACEBOOK_SIGN_IN_METHOD="facebook.com";yi.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr extends yl{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return _s._fromParams({providerId:Mr.PROVIDER_ID,signInMethod:Mr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Mr.credentialFromTaggedObject(e)}static credentialFromError(e){return Mr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Mr.credential(t,s)}catch{return null}}}Mr.GOOGLE_SIGN_IN_METHOD="google.com";Mr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i extends yl{constructor(){super("github.com")}static credential(e){return _s._fromParams({providerId:_i.PROVIDER_ID,signInMethod:_i.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _i.credentialFromTaggedObject(e)}static credentialFromError(e){return _i.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _i.credential(e.oauthAccessToken)}catch{return null}}}_i.GITHUB_SIGN_IN_METHOD="github.com";_i.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi extends yl{constructor(){super("twitter.com")}static credential(e,t){return _s._fromParams({providerId:vi.PROVIDER_ID,signInMethod:vi.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return vi.credentialFromTaggedObject(e)}static credentialFromError(e){return vi.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return vi.credential(t,s)}catch{return null}}}vi.TWITTER_SIGN_IN_METHOD="twitter.com";vi.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function o1(r,e){return Li(r,"POST","/v1/accounts:signUp",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vs{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,o=!1){const l=await Qn._fromIdTokenResponse(e,s,o),h=ey(s);return new vs({user:l,providerId:h,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const o=ey(s);return new vs({user:e,providerId:o,_tokenResponse:s,operationType:t})}}function ey(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dc extends _r{constructor(e,t,s,o){var l;super(t.code,t.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,dc.prototype),this.customData={appName:e.name,tenantId:(l=e.tenantId)!==null&&l!==void 0?l:void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,o){return new dc(e,t,s,o)}}function rv(r,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(l=>{throw l.code==="auth/multi-factor-auth-required"?dc._fromErrorAndOperation(r,l,e,s):l})}async function a1(r,e,t=!1){const s=await il(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return vs._forOperation(r,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function l1(r,e,t=!1){const{auth:s}=r;if(Yt(s.app))return Promise.reject(dr(s));const o="reauthenticate";try{const l=await il(r,rv(s,o,e,r),t);re(l.idToken,s,"internal-error");const h=Cf(l.idToken);re(h,s,"internal-error");const{sub:f}=h;return re(r.uid===f,s,"user-mismatch"),vs._forOperation(r,o,l)}catch(l){throw(l==null?void 0:l.code)==="auth/user-not-found"&&Dn(s,"user-mismatch"),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iv(r,e,t=!1){if(Yt(r.app))return Promise.reject(dr(r));const s="signIn",o=await rv(r,s,e),l=await vs._fromIdTokenResponse(r,s,o);return t||await r._updateCurrentUser(l.user),l}async function sv(r,e){return iv(Jn(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ov(r){const e=Jn(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function u1(r,e,t){if(Yt(r.app))return Promise.reject(dr(r));const s=Jn(r),h=await Co(s,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",o1,"EMAIL_PASSWORD_PROVIDER").catch(g=>{throw g.code==="auth/password-does-not-meet-requirements"&&ov(r),g}),f=await vs._fromIdTokenResponse(s,"signIn",h);return await s._updateCurrentUser(f.user),f}function c1(r,e,t){return Yt(r.app)?Promise.reject(dr(r)):sv(Tt(r),Uo.credential(e,t)).catch(async s=>{throw s.code==="auth/password-does-not-meet-requirements"&&ov(r),s})}function h1(r,e,t,s){return Tt(r).onIdTokenChanged(e,t,s)}function d1(r,e,t){return Tt(r).beforeAuthStateChanged(e,t)}function f1(r,e,t,s){return Tt(r).onAuthStateChanged(e,t,s)}function ty(r){return Tt(r).signOut()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ny(r,e){return On(r,"POST","/v2/accounts/mfaEnrollment:start",cn(r,e))}const fc="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class av{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(fc,"1"),this.storage.removeItem(fc),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p1=1e3,m1=10;class lv extends av{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=J_(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),o=this.localCache[t];s!==o&&e(t,o,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,f,g)=>{this.notifyListeners(h,g)});return}const s=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(s);!t&&this.localCache[s]===h||this.notifyListeners(s,h)},l=this.storage.getItem(s);AI()&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,m1):o()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},p1)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}lv.type="LOCAL";const g1=lv;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uv extends av{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}uv.type="SESSION";const cv=uv;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y1(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oc{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const s=new Oc(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:o,data:l}=t.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const f=Array.from(h).map(async _=>_(t.origin,l)),g=await y1(f);t.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Oc.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Of(r="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _1{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let l,h;return new Promise((f,g)=>{const _=Of("",20);o.port1.start();const T=setTimeout(()=>{g(new Error("unsupported_event"))},s);h={messageChannel:o,onMessage(A){const C=A;if(C.data.eventId===_)switch(C.data.status){case"ack":clearTimeout(T),l=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(l),f(C.data.response);break;default:clearTimeout(T),clearTimeout(l),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:_,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ft(){return window}function v1(r){ft().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vf(){return typeof ft().WorkerGlobalScope<"u"&&typeof ft().importScripts=="function"}async function E1(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function w1(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function T1(){return Vf()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv="firebaseLocalStorageDb",I1=1,pc="firebaseLocalStorage",dv="fbase_key";class _l{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Vc(r,e){return r.transaction([pc],e?"readwrite":"readonly").objectStore(pc)}function S1(){const r=indexedDB.deleteDatabase(hv);return new _l(r).toPromise()}function Qd(){const r=indexedDB.open(hv,I1);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const s=r.result;try{s.createObjectStore(pc,{keyPath:dv})}catch(o){t(o)}}),r.addEventListener("success",async()=>{const s=r.result;s.objectStoreNames.contains(pc)?e(s):(s.close(),await S1(),e(await Qd()))})})}async function ry(r,e,t){const s=Vc(r,!0).put({[dv]:e,value:t});return new _l(s).toPromise()}async function A1(r,e){const t=Vc(r,!1).get(e),s=await new _l(t).toPromise();return s===void 0?null:s.value}function iy(r,e){const t=Vc(r,!0).delete(e);return new _l(t).toPromise()}const R1=800,k1=3;class fv{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Qd(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>k1)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Vf()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Oc._getInstance(T1()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await E1(),!this.activeServiceWorker)return;this.sender=new _1(this.activeServiceWorker);const s=await this.sender._send("ping",{},800);s&&!((e=s[0])===null||e===void 0)&&e.fulfilled&&!((t=s[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||w1()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Qd();return await ry(e,fc,"1"),await iy(e,fc),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>ry(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>A1(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>iy(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const l=Vc(o,!1).getAll();return new _l(l).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:l}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(l)&&(this.notifyListeners(o,l),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),R1)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}fv.type="LOCAL";const C1=fv;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sy(r,e){return On(r,"POST","/v2/accounts/mfaSignIn:start",cn(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dd=ev("rcb"),P1=new ml(3e4,6e4);class N1{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(!((e=ft().grecaptcha)===null||e===void 0)&&e.render)}load(e,t=""){return re(x1(t),e,"argument-error"),this.shouldResolveImmediately(t)&&qg(ft().grecaptcha)?Promise.resolve(ft().grecaptcha):new Promise((s,o)=>{const l=ft().setTimeout(()=>{o(un(e,"network-request-failed"))},P1.get());ft()[Dd]=()=>{ft().clearTimeout(l),delete ft()[Dd];const f=ft().grecaptcha;if(!f||!qg(f)){o(un(e,"internal-error"));return}const g=f.render;f.render=(_,T)=>{const A=g(_,T);return this.counter++,A},this.hostLanguage=t,s(f)};const h=`${DI()}?${Fo({onload:Dd,render:"explicit",hl:t})}`;Nf(h).catch(()=>{clearTimeout(l),o(un(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(!((t=ft().grecaptcha)===null||t===void 0)&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function x1(r){return r.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(r)}class D1{async load(e){return new MI(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ja="recaptcha",O1={theme:"light",type:"image"};class V1{constructor(e,t,s=Object.assign({},O1)){this.parameters=s,this.type=Ja,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Jn(e),this.isInvisible=this.parameters.size==="invisible",re(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const o=typeof t=="string"?document.getElementById(t):t;re(o,this.auth,"argument-error"),this.container=o,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new D1:new N1,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),s=t.getResponse(e);return s||new Promise(o=>{const l=h=>{h&&(this.tokenChangeListeners.delete(l),o(h))};this.tokenChangeListeners.add(l),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){re(!this.parameters.sitekey,this.auth,"argument-error"),re(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),re(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(s=>s(t)),typeof e=="function")e(t);else if(typeof e=="string"){const s=ft()[e];typeof s=="function"&&s(t)}}}assertNotDestroyed(){re(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){re(M_()&&!Vf(),this.auth,"internal-error"),await b1(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await mI(this.auth);re(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return re(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function b1(){let r=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}r=()=>e(),window.addEventListener("load",r)}).catch(e=>{throw r&&window.removeEventListener("load",r),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L1{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=Xa._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function M1(r,e,t){if(Yt(r.app))return Promise.reject(dr(r));const s=Jn(r),o=await j1(s,e,Tt(t));return new L1(o,l=>sv(s,l))}async function j1(r,e,t){var s;if(!r._getRecaptchaConfig())try{await $I(r)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let o;if(typeof e=="string"?o={phoneNumber:e}:o=e,"session"in o){const l=o.session;if("phoneNumber"in o){re(l.type==="enroll",r,"internal-error");const h={idToken:l.credential,phoneEnrollmentInfo:{phoneNumber:o.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await Co(r,h,"mfaSmsEnrollment",async(T,A)=>{if(A.phoneEnrollmentInfo.captchaResponse===Ya){re((t==null?void 0:t.type)===Ja,T,"argument-error");const C=await Od(T,A,t);return ny(T,C)}return ny(T,A)},"PHONE_PROVIDER").catch(T=>Promise.reject(T))).phoneSessionInfo.sessionInfo}else{re(l.type==="signin",r,"internal-error");const h=((s=o.multiFactorHint)===null||s===void 0?void 0:s.uid)||o.multiFactorUid;re(h,r,"missing-multi-factor-info");const f={mfaPendingCredential:l.credential,mfaEnrollmentId:h,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await Co(r,f,"mfaSmsSignIn",async(A,C)=>{if(C.phoneSignInInfo.captchaResponse===Ya){re((t==null?void 0:t.type)===Ja,A,"argument-error");const z=await Od(A,C,t);return sy(A,z)}return sy(A,C)},"PHONE_PROVIDER").catch(A=>Promise.reject(A))).phoneResponseInfo.sessionInfo}}else{const l={phoneNumber:o.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await Co(r,l,"sendVerificationCode",async(_,T)=>{if(T.captchaResponse===Ya){re((t==null?void 0:t.type)===Ja,_,"argument-error");const A=await Od(_,T,t);return Zg(_,A)}return Zg(_,T)},"PHONE_PROVIDER").catch(_=>Promise.reject(_))).sessionInfo}}finally{t==null||t._reset()}}async function Od(r,e,t){re(t.type===Ja,r,"argument-error");const s=await t.verify();re(typeof s=="string",r,"argument-error");const o=Object.assign({},e);if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,h=o.phoneEnrollmentInfo.captchaResponse,f=o.phoneEnrollmentInfo.clientType,g=o.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:s,captchaResponse:h,clientType:f,recaptchaVersion:g}}),o}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.captchaResponse,h=o.phoneSignInInfo.clientType,f=o.phoneSignInInfo.recaptchaVersion;return Object.assign(o,{phoneSignInInfo:{recaptchaToken:s,captchaResponse:l,clientType:h,recaptchaVersion:f}}),o}else return Object.assign(o,{recaptchaToken:s}),o}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pv(r,e){return e?Fr(e):(re(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bf extends Dc{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Po(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Po(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Po(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function F1(r){return iv(r.auth,new bf(r),r.bypassAuthState)}function U1(r){const{auth:e,user:t}=r;return re(t,e,"internal-error"),l1(t,new bf(r),r.bypassAuthState)}async function z1(r){const{auth:e,user:t}=r;return re(t,e,"internal-error"),a1(t,new bf(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mv{constructor(e,t,s,o,l=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=l,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:o,tenantId:l,error:h,type:f}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:s,tenantId:l||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(g))}catch(_){this.reject(_)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return F1;case"linkViaPopup":case"linkViaRedirect":return z1;case"reauthViaPopup":case"reauthViaRedirect":return U1;default:Dn(this.auth,"internal-error")}}resolve(e){Br(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Br(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B1=new ml(2e3,1e4);async function $1(r,e,t){if(Yt(r.app))return Promise.reject(un(r,"operation-not-supported-in-this-environment"));const s=Jn(r);aI(r,e,Df);const o=pv(s,t);return new ds(s,"signInViaPopup",e,o).executeNotNull()}class ds extends mv{constructor(e,t,s,o,l){super(e,t,o,l),this.provider=s,this.authWindow=null,this.pollId=null,ds.currentPopupAction&&ds.currentPopupAction.cancel(),ds.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return re(e,this.auth,"internal-error"),e}async onExecution(){Br(this.filter.length===1,"Popup operations only handle one event");const e=Of();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(un(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(un(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ds.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,s;if(!((s=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||s===void 0)&&s.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(un(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,B1.get())};e()}}ds.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H1="pendingRedirect",Xu=new Map;class q1 extends mv{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Xu.get(this.auth._key());if(!e){try{const s=await W1(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Xu.set(this.auth._key(),e)}return this.bypassAuthState||Xu.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function W1(r,e){const t=Q1(e),s=G1(r);if(!await s._isAvailable())return!1;const o=await s._get(t)==="true";return await s._remove(t),o}function K1(r,e){Xu.set(r._key(),e)}function G1(r){return Fr(r._redirectPersistence)}function Q1(r){return Yu(H1,r.config.apiKey,r.name)}async function Y1(r,e,t=!1){if(Yt(r.app))return Promise.reject(dr(r));const s=Jn(r),o=pv(s,e),h=await new q1(s,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await s._persistUserIfCurrent(h.user),await s._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const X1=600*1e3;class J1{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Z1(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var s;if(e.error&&!gv(e)){const o=((s=e.error.code)===null||s===void 0?void 0:s.split("auth/")[1])||"internal-error";t.onError(un(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=X1&&this.cachedEventUids.clear(),this.cachedEventUids.has(oy(e))}saveEventToCache(e){this.cachedEventUids.add(oy(e)),this.lastProcessedEventTime=Date.now()}}function oy(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function gv({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Z1(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return gv(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eS(r,e={}){return On(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tS=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nS=/^https?/;async function rS(r){if(r.config.emulator)return;const{authorizedDomains:e}=await eS(r);for(const t of e)try{if(iS(t))return}catch{}Dn(r,"unauthorized-domain")}function iS(r){const e=Kd(),{protocol:t,hostname:s}=new URL(e);if(r.startsWith("chrome-extension://")){const h=new URL(r);return h.hostname===""&&s===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===s}if(!nS.test(t))return!1;if(tS.test(r))return s===r;const o=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sS=new ml(3e4,6e4);function ay(){const r=ft().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function oS(r){return new Promise((e,t)=>{var s,o,l;function h(){ay(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ay(),t(un(r,"network-request-failed"))},timeout:sS.get()})}if(!((o=(s=ft().gapi)===null||s===void 0?void 0:s.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((l=ft().gapi)===null||l===void 0)&&l.load)h();else{const f=ev("iframefcb");return ft()[f]=()=>{gapi.load?h():t(un(r,"network-request-failed"))},Nf(`${VI()}?onload=${f}`).catch(g=>t(g))}}).catch(e=>{throw Ju=null,e})}let Ju=null;function aS(r){return Ju=Ju||oS(r),Ju}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lS=new ml(5e3,15e3),uS="__/auth/iframe",cS="emulator/auth/iframe",hS={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},dS=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fS(r){const e=r.config;re(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?kf(e,cS):`https://${r.config.authDomain}/${uS}`,s={apiKey:e.apiKey,appName:r.name,v:Is},o=dS.get(r.config.apiHost);o&&(s.eid=o);const l=r._getFrameworks();return l.length&&(s.fw=l.join(",")),`${t}?${Fo(s).slice(1)}`}async function pS(r){const e=await aS(r),t=ft().gapi;return re(t,r,"internal-error"),e.open({where:document.body,url:fS(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hS,dontclear:!0},s=>new Promise(async(o,l)=>{await s.restyle({setHideOnLeave:!1});const h=un(r,"network-request-failed"),f=ft().setTimeout(()=>{l(h)},lS.get());function g(){ft().clearTimeout(f),o(s)}s.ping(g).then(g,()=>{l(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mS={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},gS=500,yS=600,_S="_blank",vS="http://localhost";class ly{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function ES(r,e,t,s=gS,o=yS){const l=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-s)/2,0).toString();let f="";const g=Object.assign(Object.assign({},mS),{width:s.toString(),height:o.toString(),top:l,left:h}),_=qt().toLowerCase();t&&(f=K_(_)?_S:t),q_(_)&&(e=e||vS,g.scrollbars="yes");const T=Object.entries(g).reduce((C,[z,W])=>`${C}${z}=${W},`,"");if(SI(_)&&f!=="_self")return wS(e||"",f),new ly(null);const A=window.open(e||"",f,T);re(A,r,"popup-blocked");try{A.focus()}catch{}return new ly(A)}function wS(r,e){const t=document.createElement("a");t.href=r,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TS="__/auth/handler",IS="emulator/auth/handler",SS=encodeURIComponent("fac");async function uy(r,e,t,s,o,l){re(r.config.authDomain,r,"auth-domain-config-required"),re(r.config.apiKey,r,"invalid-api-key");const h={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:s,v:Is,eventId:o};if(e instanceof Df){e.setDefaultLanguage(r.languageCode),h.providerId=e.providerId||"",K0(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[T,A]of Object.entries({}))h[T]=A}if(e instanceof yl){const T=e.getScopes().filter(A=>A!=="");T.length>0&&(h.scopes=T.join(","))}r.tenantId&&(h.tid=r.tenantId);const f=h;for(const T of Object.keys(f))f[T]===void 0&&delete f[T];const g=await r._getAppCheckToken(),_=g?`#${SS}=${encodeURIComponent(g)}`:"";return`${AS(r)}?${Fo(f).slice(1)}${_}`}function AS({config:r}){return r.emulator?kf(r,IS):`https://${r.authDomain}/${TS}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vd="webStorageSupport";class RS{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=cv,this._completeRedirectFn=Y1,this._overrideRedirectResult=K1}async _openPopup(e,t,s,o){var l;Br((l=this.eventManagers[e._key()])===null||l===void 0?void 0:l.manager,"_initialize() not called before _openPopup()");const h=await uy(e,t,s,Kd(),o);return ES(e,h,Of())}async _openRedirect(e,t,s,o){await this._originValidation(e);const l=await uy(e,t,s,Kd(),o);return v1(l),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:l}=this.eventManagers[t];return o?Promise.resolve(o):(Br(l,"If manager is not set, promise should be"),l)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await pS(e),s=new J1(e);return t.register("authEvent",o=>(re(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Vd,{type:Vd},o=>{var l;const h=(l=o==null?void 0:o[0])===null||l===void 0?void 0:l[Vd];h!==void 0&&t(!!h),Dn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=rS(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return J_()||W_()||Pf()}}const kS=RS;var cy="@firebase/auth",hy="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CS{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e((s==null?void 0:s.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){re(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PS(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function NS(r){ys(new ki("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),l=e.getProvider("app-check-internal"),{apiKey:h,authDomain:f}=s.options;re(h&&!h.includes(":"),"invalid-api-key",{appName:s.name});const g={apiKey:h,authDomain:f,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Z_(r)},_=new NI(s,o,l,g);return qI(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),ys(new ki("auth-internal",e=>{const t=Jn(e.getProvider("auth").getImmediate());return(s=>new CS(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),hr(cy,hy,PS(r)),hr(cy,hy,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xS=300,DS=C_("authIdTokenMaxAge")||xS;let dy=null;const OS=r=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>DS)return;const o=t==null?void 0:t.token;dy!==o&&(dy=o,await fetch(r,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function VS(r=If()){const e=xc(r,"auth");if(e.isInitialized())return e.getImmediate();const t=HI(r,{popupRedirectResolver:kS,persistence:[C1,g1,cv]}),s=C_("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const l=new URL(s,location.origin);if(location.origin===l.origin){const h=OS(l.toString());d1(t,h,()=>h(t.currentUser)),h1(t,f=>h(f))}}const o=A_("auth");return o&&WI(t,`http://${o}`),t}function bS(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}xI({loadJS(r){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",r),s.onload=e,s.onerror=o=>{const l=un("internal-error");l.customData=o,t(l)},s.type="text/javascript",s.charset="UTF-8",bS().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});NS("Browser");var fy=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ii,yv;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(P,I){function k(){}k.prototype=I.prototype,P.D=I.prototype,P.prototype=new k,P.prototype.constructor=P,P.C=function(x,D,b){for(var R=Array(arguments.length-2),Xe=2;Xe<arguments.length;Xe++)R[Xe-2]=arguments[Xe];return I.prototype[D].apply(x,R)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(s,t),s.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(P,I,k){k||(k=0);var x=Array(16);if(typeof I=="string")for(var D=0;16>D;++D)x[D]=I.charCodeAt(k++)|I.charCodeAt(k++)<<8|I.charCodeAt(k++)<<16|I.charCodeAt(k++)<<24;else for(D=0;16>D;++D)x[D]=I[k++]|I[k++]<<8|I[k++]<<16|I[k++]<<24;I=P.g[0],k=P.g[1],D=P.g[2];var b=P.g[3],R=I+(b^k&(D^b))+x[0]+3614090360&4294967295;I=k+(R<<7&4294967295|R>>>25),R=b+(D^I&(k^D))+x[1]+3905402710&4294967295,b=I+(R<<12&4294967295|R>>>20),R=D+(k^b&(I^k))+x[2]+606105819&4294967295,D=b+(R<<17&4294967295|R>>>15),R=k+(I^D&(b^I))+x[3]+3250441966&4294967295,k=D+(R<<22&4294967295|R>>>10),R=I+(b^k&(D^b))+x[4]+4118548399&4294967295,I=k+(R<<7&4294967295|R>>>25),R=b+(D^I&(k^D))+x[5]+1200080426&4294967295,b=I+(R<<12&4294967295|R>>>20),R=D+(k^b&(I^k))+x[6]+2821735955&4294967295,D=b+(R<<17&4294967295|R>>>15),R=k+(I^D&(b^I))+x[7]+4249261313&4294967295,k=D+(R<<22&4294967295|R>>>10),R=I+(b^k&(D^b))+x[8]+1770035416&4294967295,I=k+(R<<7&4294967295|R>>>25),R=b+(D^I&(k^D))+x[9]+2336552879&4294967295,b=I+(R<<12&4294967295|R>>>20),R=D+(k^b&(I^k))+x[10]+4294925233&4294967295,D=b+(R<<17&4294967295|R>>>15),R=k+(I^D&(b^I))+x[11]+2304563134&4294967295,k=D+(R<<22&4294967295|R>>>10),R=I+(b^k&(D^b))+x[12]+1804603682&4294967295,I=k+(R<<7&4294967295|R>>>25),R=b+(D^I&(k^D))+x[13]+4254626195&4294967295,b=I+(R<<12&4294967295|R>>>20),R=D+(k^b&(I^k))+x[14]+2792965006&4294967295,D=b+(R<<17&4294967295|R>>>15),R=k+(I^D&(b^I))+x[15]+1236535329&4294967295,k=D+(R<<22&4294967295|R>>>10),R=I+(D^b&(k^D))+x[1]+4129170786&4294967295,I=k+(R<<5&4294967295|R>>>27),R=b+(k^D&(I^k))+x[6]+3225465664&4294967295,b=I+(R<<9&4294967295|R>>>23),R=D+(I^k&(b^I))+x[11]+643717713&4294967295,D=b+(R<<14&4294967295|R>>>18),R=k+(b^I&(D^b))+x[0]+3921069994&4294967295,k=D+(R<<20&4294967295|R>>>12),R=I+(D^b&(k^D))+x[5]+3593408605&4294967295,I=k+(R<<5&4294967295|R>>>27),R=b+(k^D&(I^k))+x[10]+38016083&4294967295,b=I+(R<<9&4294967295|R>>>23),R=D+(I^k&(b^I))+x[15]+3634488961&4294967295,D=b+(R<<14&4294967295|R>>>18),R=k+(b^I&(D^b))+x[4]+3889429448&4294967295,k=D+(R<<20&4294967295|R>>>12),R=I+(D^b&(k^D))+x[9]+568446438&4294967295,I=k+(R<<5&4294967295|R>>>27),R=b+(k^D&(I^k))+x[14]+3275163606&4294967295,b=I+(R<<9&4294967295|R>>>23),R=D+(I^k&(b^I))+x[3]+4107603335&4294967295,D=b+(R<<14&4294967295|R>>>18),R=k+(b^I&(D^b))+x[8]+1163531501&4294967295,k=D+(R<<20&4294967295|R>>>12),R=I+(D^b&(k^D))+x[13]+2850285829&4294967295,I=k+(R<<5&4294967295|R>>>27),R=b+(k^D&(I^k))+x[2]+4243563512&4294967295,b=I+(R<<9&4294967295|R>>>23),R=D+(I^k&(b^I))+x[7]+1735328473&4294967295,D=b+(R<<14&4294967295|R>>>18),R=k+(b^I&(D^b))+x[12]+2368359562&4294967295,k=D+(R<<20&4294967295|R>>>12),R=I+(k^D^b)+x[5]+4294588738&4294967295,I=k+(R<<4&4294967295|R>>>28),R=b+(I^k^D)+x[8]+2272392833&4294967295,b=I+(R<<11&4294967295|R>>>21),R=D+(b^I^k)+x[11]+1839030562&4294967295,D=b+(R<<16&4294967295|R>>>16),R=k+(D^b^I)+x[14]+4259657740&4294967295,k=D+(R<<23&4294967295|R>>>9),R=I+(k^D^b)+x[1]+2763975236&4294967295,I=k+(R<<4&4294967295|R>>>28),R=b+(I^k^D)+x[4]+1272893353&4294967295,b=I+(R<<11&4294967295|R>>>21),R=D+(b^I^k)+x[7]+4139469664&4294967295,D=b+(R<<16&4294967295|R>>>16),R=k+(D^b^I)+x[10]+3200236656&4294967295,k=D+(R<<23&4294967295|R>>>9),R=I+(k^D^b)+x[13]+681279174&4294967295,I=k+(R<<4&4294967295|R>>>28),R=b+(I^k^D)+x[0]+3936430074&4294967295,b=I+(R<<11&4294967295|R>>>21),R=D+(b^I^k)+x[3]+3572445317&4294967295,D=b+(R<<16&4294967295|R>>>16),R=k+(D^b^I)+x[6]+76029189&4294967295,k=D+(R<<23&4294967295|R>>>9),R=I+(k^D^b)+x[9]+3654602809&4294967295,I=k+(R<<4&4294967295|R>>>28),R=b+(I^k^D)+x[12]+3873151461&4294967295,b=I+(R<<11&4294967295|R>>>21),R=D+(b^I^k)+x[15]+530742520&4294967295,D=b+(R<<16&4294967295|R>>>16),R=k+(D^b^I)+x[2]+3299628645&4294967295,k=D+(R<<23&4294967295|R>>>9),R=I+(D^(k|~b))+x[0]+4096336452&4294967295,I=k+(R<<6&4294967295|R>>>26),R=b+(k^(I|~D))+x[7]+1126891415&4294967295,b=I+(R<<10&4294967295|R>>>22),R=D+(I^(b|~k))+x[14]+2878612391&4294967295,D=b+(R<<15&4294967295|R>>>17),R=k+(b^(D|~I))+x[5]+4237533241&4294967295,k=D+(R<<21&4294967295|R>>>11),R=I+(D^(k|~b))+x[12]+1700485571&4294967295,I=k+(R<<6&4294967295|R>>>26),R=b+(k^(I|~D))+x[3]+2399980690&4294967295,b=I+(R<<10&4294967295|R>>>22),R=D+(I^(b|~k))+x[10]+4293915773&4294967295,D=b+(R<<15&4294967295|R>>>17),R=k+(b^(D|~I))+x[1]+2240044497&4294967295,k=D+(R<<21&4294967295|R>>>11),R=I+(D^(k|~b))+x[8]+1873313359&4294967295,I=k+(R<<6&4294967295|R>>>26),R=b+(k^(I|~D))+x[15]+4264355552&4294967295,b=I+(R<<10&4294967295|R>>>22),R=D+(I^(b|~k))+x[6]+2734768916&4294967295,D=b+(R<<15&4294967295|R>>>17),R=k+(b^(D|~I))+x[13]+1309151649&4294967295,k=D+(R<<21&4294967295|R>>>11),R=I+(D^(k|~b))+x[4]+4149444226&4294967295,I=k+(R<<6&4294967295|R>>>26),R=b+(k^(I|~D))+x[11]+3174756917&4294967295,b=I+(R<<10&4294967295|R>>>22),R=D+(I^(b|~k))+x[2]+718787259&4294967295,D=b+(R<<15&4294967295|R>>>17),R=k+(b^(D|~I))+x[9]+3951481745&4294967295,P.g[0]=P.g[0]+I&4294967295,P.g[1]=P.g[1]+(D+(R<<21&4294967295|R>>>11))&4294967295,P.g[2]=P.g[2]+D&4294967295,P.g[3]=P.g[3]+b&4294967295}s.prototype.u=function(P,I){I===void 0&&(I=P.length);for(var k=I-this.blockSize,x=this.B,D=this.h,b=0;b<I;){if(D==0)for(;b<=k;)o(this,P,b),b+=this.blockSize;if(typeof P=="string"){for(;b<I;)if(x[D++]=P.charCodeAt(b++),D==this.blockSize){o(this,x),D=0;break}}else for(;b<I;)if(x[D++]=P[b++],D==this.blockSize){o(this,x),D=0;break}}this.h=D,this.o+=I},s.prototype.v=function(){var P=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);P[0]=128;for(var I=1;I<P.length-8;++I)P[I]=0;var k=8*this.o;for(I=P.length-8;I<P.length;++I)P[I]=k&255,k/=256;for(this.u(P),P=Array(16),I=k=0;4>I;++I)for(var x=0;32>x;x+=8)P[k++]=this.g[I]>>>x&255;return P};function l(P,I){var k=f;return Object.prototype.hasOwnProperty.call(k,P)?k[P]:k[P]=I(P)}function h(P,I){this.h=I;for(var k=[],x=!0,D=P.length-1;0<=D;D--){var b=P[D]|0;x&&b==I||(k[D]=b,x=!1)}this.g=k}var f={};function g(P){return-128<=P&&128>P?l(P,function(I){return new h([I|0],0>I?-1:0)}):new h([P|0],0>P?-1:0)}function _(P){if(isNaN(P)||!isFinite(P))return A;if(0>P)return B(_(-P));for(var I=[],k=1,x=0;P>=k;x++)I[x]=P/k|0,k*=4294967296;return new h(I,0)}function T(P,I){if(P.length==0)throw Error("number format error: empty string");if(I=I||10,2>I||36<I)throw Error("radix out of range: "+I);if(P.charAt(0)=="-")return B(T(P.substring(1),I));if(0<=P.indexOf("-"))throw Error('number format error: interior "-" character');for(var k=_(Math.pow(I,8)),x=A,D=0;D<P.length;D+=8){var b=Math.min(8,P.length-D),R=parseInt(P.substring(D,D+b),I);8>b?(b=_(Math.pow(I,b)),x=x.j(b).add(_(R))):(x=x.j(k),x=x.add(_(R)))}return x}var A=g(0),C=g(1),z=g(16777216);r=h.prototype,r.m=function(){if(Y(this))return-B(this).m();for(var P=0,I=1,k=0;k<this.g.length;k++){var x=this.i(k);P+=(0<=x?x:4294967296+x)*I,I*=4294967296}return P},r.toString=function(P){if(P=P||10,2>P||36<P)throw Error("radix out of range: "+P);if(W(this))return"0";if(Y(this))return"-"+B(this).toString(P);for(var I=_(Math.pow(P,6)),k=this,x="";;){var D=pe(k,I).g;k=ve(k,D.j(I));var b=((0<k.g.length?k.g[0]:k.h)>>>0).toString(P);if(k=D,W(k))return b+x;for(;6>b.length;)b="0"+b;x=b+x}},r.i=function(P){return 0>P?0:P<this.g.length?this.g[P]:this.h};function W(P){if(P.h!=0)return!1;for(var I=0;I<P.g.length;I++)if(P.g[I]!=0)return!1;return!0}function Y(P){return P.h==-1}r.l=function(P){return P=ve(this,P),Y(P)?-1:W(P)?0:1};function B(P){for(var I=P.g.length,k=[],x=0;x<I;x++)k[x]=~P.g[x];return new h(k,~P.h).add(C)}r.abs=function(){return Y(this)?B(this):this},r.add=function(P){for(var I=Math.max(this.g.length,P.g.length),k=[],x=0,D=0;D<=I;D++){var b=x+(this.i(D)&65535)+(P.i(D)&65535),R=(b>>>16)+(this.i(D)>>>16)+(P.i(D)>>>16);x=R>>>16,b&=65535,R&=65535,k[D]=R<<16|b}return new h(k,k[k.length-1]&-2147483648?-1:0)};function ve(P,I){return P.add(B(I))}r.j=function(P){if(W(this)||W(P))return A;if(Y(this))return Y(P)?B(this).j(B(P)):B(B(this).j(P));if(Y(P))return B(this.j(B(P)));if(0>this.l(z)&&0>P.l(z))return _(this.m()*P.m());for(var I=this.g.length+P.g.length,k=[],x=0;x<2*I;x++)k[x]=0;for(x=0;x<this.g.length;x++)for(var D=0;D<P.g.length;D++){var b=this.i(x)>>>16,R=this.i(x)&65535,Xe=P.i(D)>>>16,tt=P.i(D)&65535;k[2*x+2*D]+=R*tt,fe(k,2*x+2*D),k[2*x+2*D+1]+=b*tt,fe(k,2*x+2*D+1),k[2*x+2*D+1]+=R*Xe,fe(k,2*x+2*D+1),k[2*x+2*D+2]+=b*Xe,fe(k,2*x+2*D+2)}for(x=0;x<I;x++)k[x]=k[2*x+1]<<16|k[2*x];for(x=I;x<2*I;x++)k[x]=0;return new h(k,0)};function fe(P,I){for(;(P[I]&65535)!=P[I];)P[I+1]+=P[I]>>>16,P[I]&=65535,I++}function ce(P,I){this.g=P,this.h=I}function pe(P,I){if(W(I))throw Error("division by zero");if(W(P))return new ce(A,A);if(Y(P))return I=pe(B(P),I),new ce(B(I.g),B(I.h));if(Y(I))return I=pe(P,B(I)),new ce(B(I.g),I.h);if(30<P.g.length){if(Y(P)||Y(I))throw Error("slowDivide_ only works with positive integers.");for(var k=C,x=I;0>=x.l(P);)k=be(k),x=be(x);var D=Te(k,1),b=Te(x,1);for(x=Te(x,2),k=Te(k,2);!W(x);){var R=b.add(x);0>=R.l(P)&&(D=D.add(k),b=R),x=Te(x,1),k=Te(k,1)}return I=ve(P,D.j(I)),new ce(D,I)}for(D=A;0<=P.l(I);){for(k=Math.max(1,Math.floor(P.m()/I.m())),x=Math.ceil(Math.log(k)/Math.LN2),x=48>=x?1:Math.pow(2,x-48),b=_(k),R=b.j(I);Y(R)||0<R.l(P);)k-=x,b=_(k),R=b.j(I);W(b)&&(b=C),D=D.add(b),P=ve(P,R)}return new ce(D,P)}r.A=function(P){return pe(this,P).h},r.and=function(P){for(var I=Math.max(this.g.length,P.g.length),k=[],x=0;x<I;x++)k[x]=this.i(x)&P.i(x);return new h(k,this.h&P.h)},r.or=function(P){for(var I=Math.max(this.g.length,P.g.length),k=[],x=0;x<I;x++)k[x]=this.i(x)|P.i(x);return new h(k,this.h|P.h)},r.xor=function(P){for(var I=Math.max(this.g.length,P.g.length),k=[],x=0;x<I;x++)k[x]=this.i(x)^P.i(x);return new h(k,this.h^P.h)};function be(P){for(var I=P.g.length+1,k=[],x=0;x<I;x++)k[x]=P.i(x)<<1|P.i(x-1)>>>31;return new h(k,P.h)}function Te(P,I){var k=I>>5;I%=32;for(var x=P.g.length-k,D=[],b=0;b<x;b++)D[b]=0<I?P.i(b+k)>>>I|P.i(b+k+1)<<32-I:P.i(b+k);return new h(D,P.h)}s.prototype.digest=s.prototype.v,s.prototype.reset=s.prototype.s,s.prototype.update=s.prototype.u,yv=s,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=_,h.fromString=T,Ii=h}).apply(typeof fy<"u"?fy:typeof self<"u"?self:typeof window<"u"?window:{});var Bu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var _v,qa,vv,Zu,Yd,Ev,wv,Tv;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(u,p,y){return u==Array.prototype||u==Object.prototype||(u[p]=y.value),u};function t(u){u=[typeof globalThis=="object"&&globalThis,u,typeof window=="object"&&window,typeof self=="object"&&self,typeof Bu=="object"&&Bu];for(var p=0;p<u.length;++p){var y=u[p];if(y&&y.Math==Math)return y}throw Error("Cannot find global object")}var s=t(this);function o(u,p){if(p)e:{var y=s;u=u.split(".");for(var w=0;w<u.length-1;w++){var L=u[w];if(!(L in y))break e;y=y[L]}u=u[u.length-1],w=y[u],p=p(w),p!=w&&p!=null&&e(y,u,{configurable:!0,writable:!0,value:p})}}function l(u,p){u instanceof String&&(u+="");var y=0,w=!1,L={next:function(){if(!w&&y<u.length){var U=y++;return{value:p(U,u[U]),done:!1}}return w=!0,{done:!0,value:void 0}}};return L[Symbol.iterator]=function(){return L},L}o("Array.prototype.values",function(u){return u||function(){return l(this,function(p,y){return y})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},f=this||self;function g(u){var p=typeof u;return p=p!="object"?p:u?Array.isArray(u)?"array":p:"null",p=="array"||p=="object"&&typeof u.length=="number"}function _(u){var p=typeof u;return p=="object"&&u!=null||p=="function"}function T(u,p,y){return u.call.apply(u.bind,arguments)}function A(u,p,y){if(!u)throw Error();if(2<arguments.length){var w=Array.prototype.slice.call(arguments,2);return function(){var L=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(L,w),u.apply(p,L)}}return function(){return u.apply(p,arguments)}}function C(u,p,y){return C=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?T:A,C.apply(null,arguments)}function z(u,p){var y=Array.prototype.slice.call(arguments,1);return function(){var w=y.slice();return w.push.apply(w,arguments),u.apply(this,w)}}function W(u,p){function y(){}y.prototype=p.prototype,u.aa=p.prototype,u.prototype=new y,u.prototype.constructor=u,u.Qb=function(w,L,U){for(var J=Array(arguments.length-2),Be=2;Be<arguments.length;Be++)J[Be-2]=arguments[Be];return p.prototype[L].apply(w,J)}}function Y(u){const p=u.length;if(0<p){const y=Array(p);for(let w=0;w<p;w++)y[w]=u[w];return y}return[]}function B(u,p){for(let y=1;y<arguments.length;y++){const w=arguments[y];if(g(w)){const L=u.length||0,U=w.length||0;u.length=L+U;for(let J=0;J<U;J++)u[L+J]=w[J]}else u.push(w)}}class ve{constructor(p,y){this.i=p,this.j=y,this.h=0,this.g=null}get(){let p;return 0<this.h?(this.h--,p=this.g,this.g=p.next,p.next=null):p=this.i(),p}}function fe(u){return/^[\s\xa0]*$/.test(u)}function ce(){var u=f.navigator;return u&&(u=u.userAgent)?u:""}function pe(u){return pe[" "](u),u}pe[" "]=function(){};var be=ce().indexOf("Gecko")!=-1&&!(ce().toLowerCase().indexOf("webkit")!=-1&&ce().indexOf("Edge")==-1)&&!(ce().indexOf("Trident")!=-1||ce().indexOf("MSIE")!=-1)&&ce().indexOf("Edge")==-1;function Te(u,p,y){for(const w in u)p.call(y,u[w],w,u)}function P(u,p){for(const y in u)p.call(void 0,u[y],y,u)}function I(u){const p={};for(const y in u)p[y]=u[y];return p}const k="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function x(u,p){let y,w;for(let L=1;L<arguments.length;L++){w=arguments[L];for(y in w)u[y]=w[y];for(let U=0;U<k.length;U++)y=k[U],Object.prototype.hasOwnProperty.call(w,y)&&(u[y]=w[y])}}function D(u){var p=1;u=u.split(":");const y=[];for(;0<p&&u.length;)y.push(u.shift()),p--;return u.length&&y.push(u.join(":")),y}function b(u){f.setTimeout(()=>{throw u},0)}function R(){var u=he;let p=null;return u.g&&(p=u.g,u.g=u.g.next,u.g||(u.h=null),p.next=null),p}class Xe{constructor(){this.h=this.g=null}add(p,y){const w=tt.get();w.set(p,y),this.h?this.h.next=w:this.g=w,this.h=w}}var tt=new ve(()=>new Je,u=>u.reset());class Je{constructor(){this.next=this.g=this.h=null}set(p,y){this.h=p,this.g=y,this.next=null}reset(){this.next=this.g=this.h=null}}let Fe,Z=!1,he=new Xe,ee=()=>{const u=f.Promise.resolve(void 0);Fe=()=>{u.then(V)}};var V=()=>{for(var u;u=R();){try{u.h.call(u.g)}catch(y){b(y)}var p=tt;p.j(u),100>p.h&&(p.h++,u.next=p.g,p.g=u)}Z=!1};function $(){this.s=this.s,this.C=this.C}$.prototype.s=!1,$.prototype.ma=function(){this.s||(this.s=!0,this.N())},$.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function de(u,p){this.type=u,this.g=this.target=p,this.defaultPrevented=!1}de.prototype.h=function(){this.defaultPrevented=!0};var Ae=(function(){if(!f.addEventListener||!Object.defineProperty)return!1;var u=!1,p=Object.defineProperty({},"passive",{get:function(){u=!0}});try{const y=()=>{};f.addEventListener("test",y,p),f.removeEventListener("test",y,p)}catch{}return u})();function Re(u,p){if(de.call(this,u?u.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,u){var y=this.type=u.type,w=u.changedTouches&&u.changedTouches.length?u.changedTouches[0]:null;if(this.target=u.target||u.srcElement,this.g=p,p=u.relatedTarget){if(be){e:{try{pe(p.nodeName);var L=!0;break e}catch{}L=!1}L||(p=null)}}else y=="mouseover"?p=u.fromElement:y=="mouseout"&&(p=u.toElement);this.relatedTarget=p,w?(this.clientX=w.clientX!==void 0?w.clientX:w.pageX,this.clientY=w.clientY!==void 0?w.clientY:w.pageY,this.screenX=w.screenX||0,this.screenY=w.screenY||0):(this.clientX=u.clientX!==void 0?u.clientX:u.pageX,this.clientY=u.clientY!==void 0?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0),this.button=u.button,this.key=u.key||"",this.ctrlKey=u.ctrlKey,this.altKey=u.altKey,this.shiftKey=u.shiftKey,this.metaKey=u.metaKey,this.pointerId=u.pointerId||0,this.pointerType=typeof u.pointerType=="string"?u.pointerType:Pe[u.pointerType]||"",this.state=u.state,this.i=u,u.defaultPrevented&&Re.aa.h.call(this)}}W(Re,de);var Pe={2:"touch",3:"pen",4:"mouse"};Re.prototype.h=function(){Re.aa.h.call(this);var u=this.i;u.preventDefault?u.preventDefault():u.returnValue=!1};var Le="closure_listenable_"+(1e6*Math.random()|0),se=0;function me(u,p,y,w,L){this.listener=u,this.proxy=null,this.src=p,this.type=y,this.capture=!!w,this.ha=L,this.key=++se,this.da=this.fa=!1}function ze(u){u.da=!0,u.listener=null,u.proxy=null,u.src=null,u.ha=null}function Xt(u){this.src=u,this.g={},this.h=0}Xt.prototype.add=function(u,p,y,w,L){var U=u.toString();u=this.g[U],u||(u=this.g[U]=[],this.h++);var J=qr(u,p,w,L);return-1<J?(p=u[J],y||(p.fa=!1)):(p=new me(p,this.src,U,!!w,L),p.fa=y,u.push(p)),p};function _n(u,p){var y=p.type;if(y in u.g){var w=u.g[y],L=Array.prototype.indexOf.call(w,p,void 0),U;(U=0<=L)&&Array.prototype.splice.call(w,L,1),U&&(ze(p),u.g[y].length==0&&(delete u.g[y],u.h--))}}function qr(u,p,y,w){for(var L=0;L<u.length;++L){var U=u[L];if(!U.da&&U.listener==p&&U.capture==!!y&&U.ha==w)return L}return-1}var Mi="closure_lm_"+(1e6*Math.random()|0),Ps={};function qo(u,p,y,w,L){if(Array.isArray(p)){for(var U=0;U<p.length;U++)qo(u,p[U],y,w,L);return null}return y=Go(y),u&&u[Le]?u.K(p,y,_(w)?!!w.capture:!1,L):Wo(u,p,y,!1,w,L)}function Wo(u,p,y,w,L,U){if(!p)throw Error("Invalid event type");var J=_(L)?!!L.capture:!!L,Be=xs(u);if(Be||(u[Mi]=Be=new Xt(u)),y=Be.add(p,y,w,J,U),y.proxy)return y;if(w=Al(),y.proxy=w,w.src=u,w.listener=y,u.addEventListener)Ae||(L=J),L===void 0&&(L=!1),u.addEventListener(p.toString(),w,L);else if(u.attachEvent)u.attachEvent(Er(p.toString()),w);else if(u.addListener&&u.removeListener)u.addListener(w);else throw Error("addEventListener and attachEvent are unavailable.");return y}function Al(){function u(y){return p.call(u.src,u.listener,y)}const p=Ko;return u}function Ns(u,p,y,w,L){if(Array.isArray(p))for(var U=0;U<p.length;U++)Ns(u,p[U],y,w,L);else w=_(w)?!!w.capture:!!w,y=Go(y),u&&u[Le]?(u=u.i,p=String(p).toString(),p in u.g&&(U=u.g[p],y=qr(U,y,w,L),-1<y&&(ze(U[y]),Array.prototype.splice.call(U,y,1),U.length==0&&(delete u.g[p],u.h--)))):u&&(u=xs(u))&&(p=u.g[p.toString()],u=-1,p&&(u=qr(p,y,w,L)),(y=-1<u?p[u]:null)&&vr(y))}function vr(u){if(typeof u!="number"&&u&&!u.da){var p=u.src;if(p&&p[Le])_n(p.i,u);else{var y=u.type,w=u.proxy;p.removeEventListener?p.removeEventListener(y,w,u.capture):p.detachEvent?p.detachEvent(Er(y),w):p.addListener&&p.removeListener&&p.removeListener(w),(y=xs(p))?(_n(y,u),y.h==0&&(y.src=null,p[Mi]=null)):ze(u)}}}function Er(u){return u in Ps?Ps[u]:Ps[u]="on"+u}function Ko(u,p){if(u.da)u=!0;else{p=new Re(p,this);var y=u.listener,w=u.ha||u.src;u.fa&&vr(u),u=y.call(w,p)}return u}function xs(u){return u=u[Mi],u instanceof Xt?u:null}var Ds="__closure_events_fn_"+(1e9*Math.random()>>>0);function Go(u){return typeof u=="function"?u:(u[Ds]||(u[Ds]=function(p){return u.handleEvent(p)}),u[Ds])}function gt(){$.call(this),this.i=new Xt(this),this.M=this,this.F=null}W(gt,$),gt.prototype[Le]=!0,gt.prototype.removeEventListener=function(u,p,y,w){Ns(this,u,p,y,w)};function yt(u,p){var y,w=u.F;if(w)for(y=[];w;w=w.F)y.push(w);if(u=u.M,w=p.type||p,typeof p=="string")p=new de(p,u);else if(p instanceof de)p.target=p.target||u;else{var L=p;p=new de(w,u),x(p,L)}if(L=!0,y)for(var U=y.length-1;0<=U;U--){var J=p.g=y[U];L=wr(J,w,!0,p)&&L}if(J=p.g=u,L=wr(J,w,!0,p)&&L,L=wr(J,w,!1,p)&&L,y)for(U=0;U<y.length;U++)J=p.g=y[U],L=wr(J,w,!1,p)&&L}gt.prototype.N=function(){if(gt.aa.N.call(this),this.i){var u=this.i,p;for(p in u.g){for(var y=u.g[p],w=0;w<y.length;w++)ze(y[w]);delete u.g[p],u.h--}}this.F=null},gt.prototype.K=function(u,p,y,w){return this.i.add(String(u),p,!1,y,w)},gt.prototype.L=function(u,p,y,w){return this.i.add(String(u),p,!0,y,w)};function wr(u,p,y,w){if(p=u.i.g[String(p)],!p)return!0;p=p.concat();for(var L=!0,U=0;U<p.length;++U){var J=p[U];if(J&&!J.da&&J.capture==y){var Be=J.listener,_t=J.ha||J.src;J.fa&&_n(u.i,J),L=Be.call(_t,w)!==!1&&L}}return L&&!w.defaultPrevented}function Qo(u,p,y){if(typeof u=="function")y&&(u=C(u,y));else if(u&&typeof u.handleEvent=="function")u=C(u.handleEvent,u);else throw Error("Invalid listener argument");return 2147483647<Number(p)?-1:f.setTimeout(u,p||0)}function Wr(u){u.g=Qo(()=>{u.g=null,u.i&&(u.i=!1,Wr(u))},u.l);const p=u.h;u.h=null,u.m.apply(null,p)}class ji extends ${constructor(p,y){super(),this.m=p,this.l=y,this.h=null,this.i=!1,this.g=null}j(p){this.h=arguments,this.g?this.i=!0:Wr(this)}N(){super.N(),this.g&&(f.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Fi(u){$.call(this),this.h=u,this.g={}}W(Fi,$);var Yo=[];function Xo(u){Te(u.g,function(p,y){this.g.hasOwnProperty(y)&&vr(p)},u),u.g={}}Fi.prototype.N=function(){Fi.aa.N.call(this),Xo(this)},Fi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Jo=f.JSON.stringify,Zo=f.JSON.parse,ea=class{stringify(u){return f.JSON.stringify(u,void 0)}parse(u){return f.JSON.parse(u,void 0)}};function Ui(){}Ui.prototype.h=null;function Os(u){return u.h||(u.h=u.i())}function Vs(){}var vn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Zn(){de.call(this,"d")}W(Zn,de);function bs(){de.call(this,"c")}W(bs,de);var er={},ta=null;function zi(){return ta=ta||new gt}er.La="serverreachability";function na(u){de.call(this,er.La,u)}W(na,de);function Tr(u){const p=zi();yt(p,new na(p))}er.STAT_EVENT="statevent";function ra(u,p){de.call(this,er.STAT_EVENT,u),this.stat=p}W(ra,de);function at(u){const p=zi();yt(p,new ra(p,u))}er.Ma="timingevent";function Ls(u,p){de.call(this,er.Ma,u),this.size=p}W(Ls,de);function Vn(u,p){if(typeof u!="function")throw Error("Fn must not be null and must be a function");return f.setTimeout(function(){u()},p)}function Bi(){this.g=!0}Bi.prototype.xa=function(){this.g=!1};function $i(u,p,y,w,L,U){u.info(function(){if(u.g)if(U)for(var J="",Be=U.split("&"),_t=0;_t<Be.length;_t++){var Oe=Be[_t].split("=");if(1<Oe.length){var It=Oe[0];Oe=Oe[1];var ct=It.split("_");J=2<=ct.length&&ct[1]=="type"?J+(It+"="+Oe+"&"):J+(It+"=redacted&")}}else J=null;else J=U;return"XMLHTTP REQ ("+w+") [attempt "+L+"]: "+p+`
`+y+`
`+J})}function Ms(u,p,y,w,L,U,J){u.info(function(){return"XMLHTTP RESP ("+w+") [ attempt "+L+"]: "+p+`
`+y+`
`+U+" "+J})}function bn(u,p,y,w){u.info(function(){return"XMLHTTP TEXT ("+p+"): "+Qc(u,y)+(w?" "+w:"")})}function ia(u,p){u.info(function(){return"TIMEOUT: "+p})}Bi.prototype.info=function(){};function Qc(u,p){if(!u.g)return p;if(!p)return null;try{var y=JSON.parse(p);if(y){for(u=0;u<y.length;u++)if(Array.isArray(y[u])){var w=y[u];if(!(2>w.length)){var L=w[1];if(Array.isArray(L)&&!(1>L.length)){var U=L[0];if(U!="noop"&&U!="stop"&&U!="close")for(var J=1;J<L.length;J++)L[J]=""}}}}return Jo(y)}catch{return p}}var js={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Rl={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ln;function Hi(){}W(Hi,Ui),Hi.prototype.g=function(){return new XMLHttpRequest},Hi.prototype.i=function(){return{}},Ln=new Hi;function Mn(u,p,y,w){this.j=u,this.i=p,this.l=y,this.R=w||1,this.U=new Fi(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new kl}function kl(){this.i=null,this.g="",this.h=!1}var sa={},Fs={};function Us(u,p,y){u.L=1,u.v=Xr(dn(p)),u.m=y,u.P=!0,oa(u,null)}function oa(u,p){u.F=Date.now(),qe(u),u.A=dn(u.v);var y=u.A,w=u.R;Array.isArray(w)||(w=[String(w)]),Zr(y.i,"t",w),u.C=0,y=u.j.J,u.h=new kl,u.g=ql(u.j,y?p:null,!u.m),0<u.O&&(u.M=new ji(C(u.Y,u,u.g),u.O)),p=u.U,y=u.g,w=u.ca;var L="readystatechange";Array.isArray(L)||(L&&(Yo[0]=L.toString()),L=Yo);for(var U=0;U<L.length;U++){var J=qo(y,L[U],w||p.handleEvent,!1,p.h||p);if(!J)break;p.g[J.key]=J}p=u.H?I(u.H):{},u.m?(u.u||(u.u="POST"),p["Content-Type"]="application/x-www-form-urlencoded",u.g.ea(u.A,u.u,u.m,p)):(u.u="GET",u.g.ea(u.A,u.u,null,p)),Tr(),$i(u.i,u.u,u.A,u.l,u.R,u.m)}Mn.prototype.ca=function(u){u=u.target;const p=this.M;p&&Zt(u)==3?p.j():this.Y(u)},Mn.prototype.Y=function(u){try{if(u==this.g)e:{const ct=Zt(this.g);var p=this.g.Ba();const Tn=this.g.Z();if(!(3>ct)&&(ct!=3||this.g&&(this.h.h||this.g.oa()||da(this.g)))){this.J||ct!=4||p==7||(p==8||0>=Tn?Tr(3):Tr(2)),qi(this);var y=this.g.Z();this.X=y;t:if(Cl(this)){var w=da(this.g);u="";var L=w.length,U=Zt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){En(this),Kr(this);var J="";break t}this.h.i=new f.TextDecoder}for(p=0;p<L;p++)this.h.h=!0,u+=this.h.i.decode(w[p],{stream:!(U&&p==L-1)});w.length=0,this.h.g+=u,this.C=0,J=this.h.g}else J=this.g.oa();if(this.o=y==200,Ms(this.i,this.u,this.A,this.l,this.R,ct,y),this.o){if(this.T&&!this.K){t:{if(this.g){var Be,_t=this.g;if((Be=_t.g?_t.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!fe(Be)){var Oe=Be;break t}}Oe=null}if(y=Oe)bn(this.i,this.l,y,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,aa(this,y);else{this.o=!1,this.s=3,at(12),En(this),Kr(this);break e}}if(this.P){y=!0;let pn;for(;!this.J&&this.C<J.length;)if(pn=Yc(this,J),pn==Fs){ct==4&&(this.s=4,at(14),y=!1),bn(this.i,this.l,null,"[Incomplete Response]");break}else if(pn==sa){this.s=4,at(15),bn(this.i,this.l,J,"[Invalid Chunk]"),y=!1;break}else bn(this.i,this.l,pn,null),aa(this,pn);if(Cl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ct!=4||J.length!=0||this.h.h||(this.s=1,at(16),y=!1),this.o=this.o&&y,!y)bn(this.i,this.l,J,"[Invalid Chunked Response]"),En(this),Kr(this);else if(0<J.length&&!this.W){this.W=!0;var It=this.j;It.g==this&&It.ba&&!It.M&&(It.j.info("Great, no buffering proxy detected. Bytes received: "+J.length),pa(It),It.M=!0,at(11))}}else bn(this.i,this.l,J,null),aa(this,J);ct==4&&En(this),this.o&&!this.J&&(ct==4?Xs(this.j,this):(this.o=!1,qe(this)))}else Ws(this.g),y==400&&0<J.indexOf("Unknown SID")?(this.s=3,at(12)):(this.s=0,at(13)),En(this),Kr(this)}}}catch{}finally{}};function Cl(u){return u.g?u.u=="GET"&&u.L!=2&&u.j.Ca:!1}function Yc(u,p){var y=u.C,w=p.indexOf(`
`,y);return w==-1?Fs:(y=Number(p.substring(y,w)),isNaN(y)?sa:(w+=1,w+y>p.length?Fs:(p=p.slice(w,w+y),u.C=w+y,p)))}Mn.prototype.cancel=function(){this.J=!0,En(this)};function qe(u){u.S=Date.now()+u.I,Pl(u,u.I)}function Pl(u,p){if(u.B!=null)throw Error("WatchDog timer not null");u.B=Vn(C(u.ba,u),p)}function qi(u){u.B&&(f.clearTimeout(u.B),u.B=null)}Mn.prototype.ba=function(){this.B=null;const u=Date.now();0<=u-this.S?(ia(this.i,this.A),this.L!=2&&(Tr(),at(17)),En(this),this.s=2,Kr(this)):Pl(this,this.S-u)};function Kr(u){u.j.G==0||u.J||Xs(u.j,u)}function En(u){qi(u);var p=u.M;p&&typeof p.ma=="function"&&p.ma(),u.M=null,Xo(u.U),u.g&&(p=u.g,u.g=null,p.abort(),p.ma())}function aa(u,p){try{var y=u.j;if(y.G!=0&&(y.g==u||Wt(y.h,u))){if(!u.K&&Wt(y.h,u)&&y.G==3){try{var w=y.Da.g.parse(p)}catch{w=null}if(Array.isArray(w)&&w.length==3){var L=w;if(L[0]==0){e:if(!y.u){if(y.g)if(y.g.F+3e3<u.F)Ys(y),Bn(y);else break e;Qs(y),at(18)}}else y.za=L[1],0<y.za-y.T&&37500>L[2]&&y.F&&y.v==0&&!y.C&&(y.C=Vn(C(y.Za,y),6e3));if(1>=xl(y.h)&&y.ca){try{y.ca()}catch{}y.ca=void 0}}else kr(y,11)}else if((u.K||y.g==u)&&Ys(y),!fe(p))for(L=y.Da.g.parse(p),p=0;p<L.length;p++){let Oe=L[p];if(y.T=Oe[0],Oe=Oe[1],y.G==2)if(Oe[0]=="c"){y.K=Oe[1],y.ia=Oe[2];const It=Oe[3];It!=null&&(y.la=It,y.j.info("VER="+y.la));const ct=Oe[4];ct!=null&&(y.Aa=ct,y.j.info("SVER="+y.Aa));const Tn=Oe[5];Tn!=null&&typeof Tn=="number"&&0<Tn&&(w=1.5*Tn,y.L=w,y.j.info("backChannelRequestTimeoutMs_="+w)),w=y;const pn=u.g;if(pn){const Ji=pn.g?pn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ji){var U=w.h;U.g||Ji.indexOf("spdy")==-1&&Ji.indexOf("quic")==-1&&Ji.indexOf("h2")==-1||(U.j=U.l,U.g=new Set,U.h&&(la(U,U.h),U.h=null))}if(w.D){const Zs=pn.g?pn.g.getResponseHeader("X-HTTP-Session-Id"):null;Zs&&(w.ya=Zs,He(w.I,w.D,Zs))}}y.G=3,y.l&&y.l.ua(),y.ba&&(y.R=Date.now()-u.F,y.j.info("Handshake RTT: "+y.R+"ms")),w=y;var J=u;if(w.qa=Hl(w,w.J?w.ia:null,w.W),J.K){Dl(w.h,J);var Be=J,_t=w.L;_t&&(Be.I=_t),Be.B&&(qi(Be),qe(Be)),w.g=J}else Xi(w);0<y.i.length&&ir(y)}else Oe[0]!="stop"&&Oe[0]!="close"||kr(y,7);else y.G==3&&(Oe[0]=="stop"||Oe[0]=="close"?Oe[0]=="stop"?kr(y,7):Nt(y):Oe[0]!="noop"&&y.l&&y.l.ta(Oe),y.v=0)}}Tr(4)}catch{}}var Nl=class{constructor(u,p){this.g=u,this.map=p}};function Wi(u){this.l=u||10,f.PerformanceNavigationTiming?(u=f.performance.getEntriesByType("navigation"),u=0<u.length&&(u[0].nextHopProtocol=="hq"||u[0].nextHopProtocol=="h2")):u=!!(f.chrome&&f.chrome.loadTimes&&f.chrome.loadTimes()&&f.chrome.loadTimes().wasFetchedViaSpdy),this.j=u?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function hn(u){return u.h?!0:u.g?u.g.size>=u.j:!1}function xl(u){return u.h?1:u.g?u.g.size:0}function Wt(u,p){return u.h?u.h==p:u.g?u.g.has(p):!1}function la(u,p){u.g?u.g.add(p):u.h=p}function Dl(u,p){u.h&&u.h==p?u.h=null:u.g&&u.g.has(p)&&u.g.delete(p)}Wi.prototype.cancel=function(){if(this.i=Ol(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const u of this.g.values())u.cancel();this.g.clear()}};function Ol(u){if(u.h!=null)return u.i.concat(u.h.D);if(u.g!=null&&u.g.size!==0){let p=u.i;for(const y of u.g.values())p=p.concat(y.D);return p}return Y(u.i)}function zs(u){if(u.V&&typeof u.V=="function")return u.V();if(typeof Map<"u"&&u instanceof Map||typeof Set<"u"&&u instanceof Set)return Array.from(u.values());if(typeof u=="string")return u.split("");if(g(u)){for(var p=[],y=u.length,w=0;w<y;w++)p.push(u[w]);return p}p=[],y=0;for(w in u)p[y++]=u[w];return p}function Bs(u){if(u.na&&typeof u.na=="function")return u.na();if(!u.V||typeof u.V!="function"){if(typeof Map<"u"&&u instanceof Map)return Array.from(u.keys());if(!(typeof Set<"u"&&u instanceof Set)){if(g(u)||typeof u=="string"){var p=[];u=u.length;for(var y=0;y<u;y++)p.push(y);return p}p=[],y=0;for(const w in u)p[y++]=w;return p}}}function Gr(u,p){if(u.forEach&&typeof u.forEach=="function")u.forEach(p,void 0);else if(g(u)||typeof u=="string")Array.prototype.forEach.call(u,p,void 0);else for(var y=Bs(u),w=zs(u),L=w.length,U=0;U<L;U++)p.call(void 0,w[U],y&&y[U],u)}var Ki=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Xc(u,p){if(u){u=u.split("&");for(var y=0;y<u.length;y++){var w=u[y].indexOf("="),L=null;if(0<=w){var U=u[y].substring(0,w);L=u[y].substring(w+1)}else U=u[y];p(U,L?decodeURIComponent(L.replace(/\+/g," ")):"")}}}function Ir(u){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,u instanceof Ir){this.h=u.h,Gi(this,u.j),this.o=u.o,this.g=u.g,Qr(this,u.s),this.l=u.l;var p=u.i,y=new tr;y.i=p.i,p.g&&(y.g=new Map(p.g),y.h=p.h),Yr(this,y),this.m=u.m}else u&&(p=String(u).match(Ki))?(this.h=!1,Gi(this,p[1]||"",!0),this.o=De(p[2]||""),this.g=De(p[3]||"",!0),Qr(this,p[4]),this.l=De(p[5]||"",!0),Yr(this,p[6]||"",!0),this.m=De(p[7]||"")):(this.h=!1,this.i=new tr(null,this.h))}Ir.prototype.toString=function(){var u=[],p=this.j;p&&u.push(Jr(p,$s,!0),":");var y=this.g;return(y||p=="file")&&(u.push("//"),(p=this.o)&&u.push(Jr(p,$s,!0),"@"),u.push(encodeURIComponent(String(y)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),y=this.s,y!=null&&u.push(":",String(y))),(y=this.l)&&(this.g&&y.charAt(0)!="/"&&u.push("/"),u.push(Jr(y,y.charAt(0)=="/"?Ll:bl,!0))),(y=this.i.toString())&&u.push("?",y),(y=this.m)&&u.push("#",Jr(y,ua)),u.join("")};function dn(u){return new Ir(u)}function Gi(u,p,y){u.j=y?De(p,!0):p,u.j&&(u.j=u.j.replace(/:$/,""))}function Qr(u,p){if(p){if(p=Number(p),isNaN(p)||0>p)throw Error("Bad port number "+p);u.s=p}else u.s=null}function Yr(u,p,y){p instanceof tr?(u.i=p,nr(u.i,u.h)):(y||(p=Jr(p,Ml)),u.i=new tr(p,u.h))}function He(u,p,y){u.i.set(p,y)}function Xr(u){return He(u,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),u}function De(u,p){return u?p?decodeURI(u.replace(/%25/g,"%2525")):decodeURIComponent(u):""}function Jr(u,p,y){return typeof u=="string"?(u=encodeURI(u).replace(p,Vl),y&&(u=u.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u):null}function Vl(u){return u=u.charCodeAt(0),"%"+(u>>4&15).toString(16)+(u&15).toString(16)}var $s=/[#\/\?@]/g,bl=/[#\?:]/g,Ll=/[#\?]/g,Ml=/[#\?@]/g,ua=/#/g;function tr(u,p){this.h=this.g=null,this.i=u||null,this.j=!!p}function Pt(u){u.g||(u.g=new Map,u.h=0,u.i&&Xc(u.i,function(p,y){u.add(decodeURIComponent(p.replace(/\+/g," ")),y)}))}r=tr.prototype,r.add=function(u,p){Pt(this),this.i=null,u=wn(this,u);var y=this.g.get(u);return y||this.g.set(u,y=[]),y.push(p),this.h+=1,this};function jn(u,p){Pt(u),p=wn(u,p),u.g.has(p)&&(u.i=null,u.h-=u.g.get(p).length,u.g.delete(p))}function Fn(u,p){return Pt(u),p=wn(u,p),u.g.has(p)}r.forEach=function(u,p){Pt(this),this.g.forEach(function(y,w){y.forEach(function(L){u.call(p,L,w,this)},this)},this)},r.na=function(){Pt(this);const u=Array.from(this.g.values()),p=Array.from(this.g.keys()),y=[];for(let w=0;w<p.length;w++){const L=u[w];for(let U=0;U<L.length;U++)y.push(p[w])}return y},r.V=function(u){Pt(this);let p=[];if(typeof u=="string")Fn(this,u)&&(p=p.concat(this.g.get(wn(this,u))));else{u=Array.from(this.g.values());for(let y=0;y<u.length;y++)p=p.concat(u[y])}return p},r.set=function(u,p){return Pt(this),this.i=null,u=wn(this,u),Fn(this,u)&&(this.h-=this.g.get(u).length),this.g.set(u,[p]),this.h+=1,this},r.get=function(u,p){return u?(u=this.V(u),0<u.length?String(u[0]):p):p};function Zr(u,p,y){jn(u,p),0<y.length&&(u.i=null,u.g.set(wn(u,p),Y(y)),u.h+=y.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const u=[],p=Array.from(this.g.keys());for(var y=0;y<p.length;y++){var w=p[y];const U=encodeURIComponent(String(w)),J=this.V(w);for(w=0;w<J.length;w++){var L=U;J[w]!==""&&(L+="="+encodeURIComponent(String(J[w]))),u.push(L)}}return this.i=u.join("&")};function wn(u,p){return p=String(p),u.j&&(p=p.toLowerCase()),p}function nr(u,p){p&&!u.j&&(Pt(u),u.i=null,u.g.forEach(function(y,w){var L=w.toLowerCase();w!=L&&(jn(this,w),Zr(this,L,y))},u)),u.j=p}function Jc(u,p){const y=new Bi;if(f.Image){const w=new Image;w.onload=z(Jt,y,"TestLoadImage: loaded",!0,p,w),w.onerror=z(Jt,y,"TestLoadImage: error",!1,p,w),w.onabort=z(Jt,y,"TestLoadImage: abort",!1,p,w),w.ontimeout=z(Jt,y,"TestLoadImage: timeout",!1,p,w),f.setTimeout(function(){w.ontimeout&&w.ontimeout()},1e4),w.src=u}else p(!1)}function jl(u,p){const y=new Bi,w=new AbortController,L=setTimeout(()=>{w.abort(),Jt(y,"TestPingServer: timeout",!1,p)},1e4);fetch(u,{signal:w.signal}).then(U=>{clearTimeout(L),U.ok?Jt(y,"TestPingServer: ok",!0,p):Jt(y,"TestPingServer: server error",!1,p)}).catch(()=>{clearTimeout(L),Jt(y,"TestPingServer: error",!1,p)})}function Jt(u,p,y,w,L){try{L&&(L.onload=null,L.onerror=null,L.onabort=null,L.ontimeout=null),w(y)}catch{}}function Zc(){this.g=new ea}function Fl(u,p,y){const w=y||"";try{Gr(u,function(L,U){let J=L;_(L)&&(J=Jo(L)),p.push(w+U+"="+encodeURIComponent(J))})}catch(L){throw p.push(w+"type="+encodeURIComponent("_badmap")),L}}function Sr(u){this.l=u.Ub||null,this.j=u.eb||!1}W(Sr,Ui),Sr.prototype.g=function(){return new Qi(this.l,this.j)},Sr.prototype.i=(function(u){return function(){return u}})({});function Qi(u,p){gt.call(this),this.D=u,this.o=p,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}W(Qi,gt),r=Qi.prototype,r.open=function(u,p){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=u,this.A=p,this.readyState=1,zn(this)},r.send=function(u){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const p={headers:this.u,method:this.B,credentials:this.m,cache:void 0};u&&(p.body=u),(this.D||f).fetch(new Request(this.A,p)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Un(this)),this.readyState=0},r.Sa=function(u){if(this.g&&(this.l=u,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=u.headers,this.readyState=2,zn(this)),this.g&&(this.readyState=3,zn(this),this.g)))if(this.responseType==="arraybuffer")u.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof f.ReadableStream<"u"&&"body"in u){if(this.j=u.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ul(this)}else u.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ul(u){u.j.read().then(u.Pa.bind(u)).catch(u.ga.bind(u))}r.Pa=function(u){if(this.g){if(this.o&&u.value)this.response.push(u.value);else if(!this.o){var p=u.value?u.value:new Uint8Array(0);(p=this.v.decode(p,{stream:!u.done}))&&(this.response=this.responseText+=p)}u.done?Un(this):zn(this),this.readyState==3&&Ul(this)}},r.Ra=function(u){this.g&&(this.response=this.responseText=u,Un(this))},r.Qa=function(u){this.g&&(this.response=u,Un(this))},r.ga=function(){this.g&&Un(this)};function Un(u){u.readyState=4,u.l=null,u.j=null,u.v=null,zn(u)}r.setRequestHeader=function(u,p){this.u.append(u,p)},r.getResponseHeader=function(u){return this.h&&this.h.get(u.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const u=[],p=this.h.entries();for(var y=p.next();!y.done;)y=y.value,u.push(y[0]+": "+y[1]),y=p.next();return u.join(`\r
`)};function zn(u){u.onreadystatechange&&u.onreadystatechange.call(u)}Object.defineProperty(Qi.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(u){this.m=u?"include":"same-origin"}});function Ar(u){let p="";return Te(u,function(y,w){p+=w,p+=":",p+=y,p+=`\r
`}),p}function ei(u,p,y){e:{for(w in y){var w=!1;break e}w=!0}w||(y=Ar(y),typeof u=="string"?y!=null&&encodeURIComponent(String(y)):He(u,p,y))}function Ze(u){gt.call(this),this.headers=new Map,this.o=u||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}W(Ze,gt);var eh=/^https?$/i,ca=["POST","PUT"];r=Ze.prototype,r.Ha=function(u){this.J=u},r.ea=function(u,p,y,w){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+u);p=p?p.toUpperCase():"GET",this.D=u,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ln.g(),this.v=this.o?Os(this.o):Os(Ln),this.g.onreadystatechange=C(this.Ea,this);try{this.B=!0,this.g.open(p,String(u),!0),this.B=!1}catch(U){Yi(this,U);return}if(u=y||"",y=new Map(this.headers),w)if(Object.getPrototypeOf(w)===Object.prototype)for(var L in w)y.set(L,w[L]);else if(typeof w.keys=="function"&&typeof w.get=="function")for(const U of w.keys())y.set(U,w.get(U));else throw Error("Unknown input type for opt_headers: "+String(w));w=Array.from(y.keys()).find(U=>U.toLowerCase()=="content-type"),L=f.FormData&&u instanceof f.FormData,!(0<=Array.prototype.indexOf.call(ca,p,void 0))||w||L||y.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[U,J]of y)this.g.setRequestHeader(U,J);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{qs(this),this.u=!0,this.g.send(u),this.u=!1}catch(U){Yi(this,U)}};function Yi(u,p){u.h=!1,u.g&&(u.j=!0,u.g.abort(),u.j=!1),u.l=p,u.m=5,Hs(u),fn(u)}function Hs(u){u.A||(u.A=!0,yt(u,"complete"),yt(u,"error"))}r.abort=function(u){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=u||7,yt(this,"complete"),yt(this,"abort"),fn(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),fn(this,!0)),Ze.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?ha(this):this.bb())},r.bb=function(){ha(this)};function ha(u){if(u.h&&typeof h<"u"&&(!u.v[1]||Zt(u)!=4||u.Z()!=2)){if(u.u&&Zt(u)==4)Qo(u.Ea,0,u);else if(yt(u,"readystatechange"),Zt(u)==4){u.h=!1;try{const J=u.Z();e:switch(J){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var p=!0;break e;default:p=!1}var y;if(!(y=p)){var w;if(w=J===0){var L=String(u.D).match(Ki)[1]||null;!L&&f.self&&f.self.location&&(L=f.self.location.protocol.slice(0,-1)),w=!eh.test(L?L.toLowerCase():"")}y=w}if(y)yt(u,"complete"),yt(u,"success");else{u.m=6;try{var U=2<Zt(u)?u.g.statusText:""}catch{U=""}u.l=U+" ["+u.Z()+"]",Hs(u)}}finally{fn(u)}}}}function fn(u,p){if(u.g){qs(u);const y=u.g,w=u.v[0]?()=>{}:null;u.g=null,u.v=null,p||yt(u,"ready");try{y.onreadystatechange=w}catch{}}}function qs(u){u.I&&(f.clearTimeout(u.I),u.I=null)}r.isActive=function(){return!!this.g};function Zt(u){return u.g?u.g.readyState:0}r.Z=function(){try{return 2<Zt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(u){if(this.g){var p=this.g.responseText;return u&&p.indexOf(u)==0&&(p=p.substring(u.length)),Zo(p)}};function da(u){try{if(!u.g)return null;if("response"in u.g)return u.g.response;switch(u.H){case"":case"text":return u.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in u.g)return u.g.mozResponseArrayBuffer}return null}catch{return null}}function Ws(u){const p={};u=(u.g&&2<=Zt(u)&&u.g.getAllResponseHeaders()||"").split(`\r
`);for(let w=0;w<u.length;w++){if(fe(u[w]))continue;var y=D(u[w]);const L=y[0];if(y=y[1],typeof y!="string")continue;y=y.trim();const U=p[L]||[];p[L]=U,U.push(y)}P(p,function(w){return w.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function rr(u,p,y){return y&&y.internalChannelParams&&y.internalChannelParams[u]||p}function fa(u){this.Aa=0,this.i=[],this.j=new Bi,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=rr("failFast",!1,u),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=rr("baseRetryDelayMs",5e3,u),this.cb=rr("retryDelaySeedMs",1e4,u),this.Wa=rr("forwardChannelMaxRetries",2,u),this.wa=rr("forwardChannelRequestTimeoutMs",2e4,u),this.pa=u&&u.xmlHttpFactory||void 0,this.Xa=u&&u.Tb||void 0,this.Ca=u&&u.useFetchStreams||!1,this.L=void 0,this.J=u&&u.supportsCrossDomainXhr||!1,this.K="",this.h=new Wi(u&&u.concurrentRequestLimit),this.Da=new Zc,this.P=u&&u.fastHandshake||!1,this.O=u&&u.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=u&&u.Rb||!1,u&&u.xa&&this.j.xa(),u&&u.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&u&&u.detectBufferingProxy||!1,this.ja=void 0,u&&u.longPollingTimeout&&0<u.longPollingTimeout&&(this.ja=u.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=fa.prototype,r.la=8,r.G=1,r.connect=function(u,p,y,w){at(0),this.W=u,this.H=p||{},y&&w!==void 0&&(this.H.OSID=y,this.H.OAID=w),this.F=this.X,this.I=Hl(this,null,this.W),ir(this)};function Nt(u){if(Ks(u),u.G==3){var p=u.U++,y=dn(u.I);if(He(y,"SID",u.K),He(y,"RID",p),He(y,"TYPE","terminate"),Rr(u,y),p=new Mn(u,u.j,p),p.L=2,p.v=Xr(dn(y)),y=!1,f.navigator&&f.navigator.sendBeacon)try{y=f.navigator.sendBeacon(p.v.toString(),"")}catch{}!y&&f.Image&&(new Image().src=p.v,y=!0),y||(p.g=ql(p.j,null),p.g.ea(p.v)),p.F=Date.now(),qe(p)}$l(u)}function Bn(u){u.g&&(pa(u),u.g.cancel(),u.g=null)}function Ks(u){Bn(u),u.u&&(f.clearTimeout(u.u),u.u=null),Ys(u),u.h.cancel(),u.s&&(typeof u.s=="number"&&f.clearTimeout(u.s),u.s=null)}function ir(u){if(!hn(u.h)&&!u.s){u.s=!0;var p=u.Ga;Fe||ee(),Z||(Fe(),Z=!0),he.add(p,u),u.B=0}}function th(u,p){return xl(u.h)>=u.h.j-(u.s?1:0)?!1:u.s?(u.i=p.D.concat(u.i),!0):u.G==1||u.G==2||u.B>=(u.Va?0:u.Wa)?!1:(u.s=Vn(C(u.Ga,u,p),Bl(u,u.B)),u.B++,!0)}r.Ga=function(u){if(this.s)if(this.s=null,this.G==1){if(!u){this.U=Math.floor(1e5*Math.random()),u=this.U++;const L=new Mn(this,this.j,u);let U=this.o;if(this.S&&(U?(U=I(U),x(U,this.S)):U=this.S),this.m!==null||this.O||(L.H=U,U=null),this.P)e:{for(var p=0,y=0;y<this.i.length;y++){t:{var w=this.i[y];if("__data__"in w.map&&(w=w.map.__data__,typeof w=="string")){w=w.length;break t}w=void 0}if(w===void 0)break;if(p+=w,4096<p){p=y;break e}if(p===4096||y===this.i.length-1){p=y+1;break e}}p=1e3}else p=1e3;p=ti(this,L,p),y=dn(this.I),He(y,"RID",u),He(y,"CVER",22),this.D&&He(y,"X-HTTP-Session-Id",this.D),Rr(this,y),U&&(this.O?p="headers="+encodeURIComponent(String(Ar(U)))+"&"+p:this.m&&ei(y,this.m,U)),la(this.h,L),this.Ua&&He(y,"TYPE","init"),this.P?(He(y,"$req",p),He(y,"SID","null"),L.T=!0,Us(L,y,null)):Us(L,y,p),this.G=2}}else this.G==3&&(u?Gs(this,u):this.i.length==0||hn(this.h)||Gs(this))};function Gs(u,p){var y;p?y=p.l:y=u.U++;const w=dn(u.I);He(w,"SID",u.K),He(w,"RID",y),He(w,"AID",u.T),Rr(u,w),u.m&&u.o&&ei(w,u.m,u.o),y=new Mn(u,u.j,y,u.B+1),u.m===null&&(y.H=u.o),p&&(u.i=p.D.concat(u.i)),p=ti(u,y,1e3),y.I=Math.round(.5*u.wa)+Math.round(.5*u.wa*Math.random()),la(u.h,y),Us(y,w,p)}function Rr(u,p){u.H&&Te(u.H,function(y,w){He(p,w,y)}),u.l&&Gr({},function(y,w){He(p,w,y)})}function ti(u,p,y){y=Math.min(u.i.length,y);var w=u.l?C(u.l.Na,u.l,u):null;e:{var L=u.i;let U=-1;for(;;){const J=["count="+y];U==-1?0<y?(U=L[0].g,J.push("ofs="+U)):U=0:J.push("ofs="+U);let Be=!0;for(let _t=0;_t<y;_t++){let Oe=L[_t].g;const It=L[_t].map;if(Oe-=U,0>Oe)U=Math.max(0,L[_t].g-100),Be=!1;else try{Fl(It,J,"req"+Oe+"_")}catch{w&&w(It)}}if(Be){w=J.join("&");break e}}}return u=u.i.splice(0,y),p.D=u,w}function Xi(u){if(!u.g&&!u.u){u.Y=1;var p=u.Fa;Fe||ee(),Z||(Fe(),Z=!0),he.add(p,u),u.v=0}}function Qs(u){return u.g||u.u||3<=u.v?!1:(u.Y++,u.u=Vn(C(u.Fa,u),Bl(u,u.v)),u.v++,!0)}r.Fa=function(){if(this.u=null,zl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var u=2*this.R;this.j.info("BP detection timer enabled: "+u),this.A=Vn(C(this.ab,this),u)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,at(10),Bn(this),zl(this))};function pa(u){u.A!=null&&(f.clearTimeout(u.A),u.A=null)}function zl(u){u.g=new Mn(u,u.j,"rpc",u.Y),u.m===null&&(u.g.H=u.o),u.g.O=0;var p=dn(u.qa);He(p,"RID","rpc"),He(p,"SID",u.K),He(p,"AID",u.T),He(p,"CI",u.F?"0":"1"),!u.F&&u.ja&&He(p,"TO",u.ja),He(p,"TYPE","xmlhttp"),Rr(u,p),u.m&&u.o&&ei(p,u.m,u.o),u.L&&(u.g.I=u.L);var y=u.g;u=u.ia,y.L=1,y.v=Xr(dn(p)),y.m=null,y.P=!0,oa(y,u)}r.Za=function(){this.C!=null&&(this.C=null,Bn(this),Qs(this),at(19))};function Ys(u){u.C!=null&&(f.clearTimeout(u.C),u.C=null)}function Xs(u,p){var y=null;if(u.g==p){Ys(u),pa(u),u.g=null;var w=2}else if(Wt(u.h,p))y=p.D,Dl(u.h,p),w=1;else return;if(u.G!=0){if(p.o)if(w==1){y=p.m?p.m.length:0,p=Date.now()-p.F;var L=u.B;w=zi(),yt(w,new Ls(w,y)),ir(u)}else Xi(u);else if(L=p.s,L==3||L==0&&0<p.X||!(w==1&&th(u,p)||w==2&&Qs(u)))switch(y&&0<y.length&&(p=u.h,p.i=p.i.concat(y)),L){case 1:kr(u,5);break;case 4:kr(u,10);break;case 3:kr(u,6);break;default:kr(u,2)}}}function Bl(u,p){let y=u.Ta+Math.floor(Math.random()*u.cb);return u.isActive()||(y*=2),y*p}function kr(u,p){if(u.j.info("Error code "+p),p==2){var y=C(u.fb,u),w=u.Xa;const L=!w;w=new Ir(w||"//www.google.com/images/cleardot.gif"),f.location&&f.location.protocol=="http"||Gi(w,"https"),Xr(w),L?Jc(w.toString(),y):jl(w.toString(),y)}else at(2);u.G=0,u.l&&u.l.sa(p),$l(u),Ks(u)}r.fb=function(u){u?(this.j.info("Successfully pinged google.com"),at(2)):(this.j.info("Failed to ping google.com"),at(1))};function $l(u){if(u.G=0,u.ka=[],u.l){const p=Ol(u.h);(p.length!=0||u.i.length!=0)&&(B(u.ka,p),B(u.ka,u.i),u.h.i.length=0,Y(u.i),u.i.length=0),u.l.ra()}}function Hl(u,p,y){var w=y instanceof Ir?dn(y):new Ir(y);if(w.g!="")p&&(w.g=p+"."+w.g),Qr(w,w.s);else{var L=f.location;w=L.protocol,p=p?p+"."+L.hostname:L.hostname,L=+L.port;var U=new Ir(null);w&&Gi(U,w),p&&(U.g=p),L&&Qr(U,L),y&&(U.l=y),w=U}return y=u.D,p=u.ya,y&&p&&He(w,y,p),He(w,"VER",u.la),Rr(u,w),w}function ql(u,p,y){if(p&&!u.J)throw Error("Can't create secondary domain capable XhrIo object.");return p=u.Ca&&!u.pa?new Ze(new Sr({eb:y})):new Ze(u.pa),p.Ha(u.J),p}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function ma(){}r=ma.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Js(){}Js.prototype.g=function(u,p){return new Kt(u,p)};function Kt(u,p){gt.call(this),this.g=new fa(p),this.l=u,this.h=p&&p.messageUrlParams||null,u=p&&p.messageHeaders||null,p&&p.clientProtocolHeaderRequired&&(u?u["X-Client-Protocol"]="webchannel":u={"X-Client-Protocol":"webchannel"}),this.g.o=u,u=p&&p.initMessageHeaders||null,p&&p.messageContentType&&(u?u["X-WebChannel-Content-Type"]=p.messageContentType:u={"X-WebChannel-Content-Type":p.messageContentType}),p&&p.va&&(u?u["X-WebChannel-Client-Profile"]=p.va:u={"X-WebChannel-Client-Profile":p.va}),this.g.S=u,(u=p&&p.Sb)&&!fe(u)&&(this.g.m=u),this.v=p&&p.supportsCrossDomainXhr||!1,this.u=p&&p.sendRawJson||!1,(p=p&&p.httpSessionIdParam)&&!fe(p)&&(this.g.D=p,u=this.h,u!==null&&p in u&&(u=this.h,p in u&&delete u[p])),this.j=new sr(this)}W(Kt,gt),Kt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Kt.prototype.close=function(){Nt(this.g)},Kt.prototype.o=function(u){var p=this.g;if(typeof u=="string"){var y={};y.__data__=u,u=y}else this.u&&(y={},y.__data__=Jo(u),u=y);p.i.push(new Nl(p.Ya++,u)),p.G==3&&ir(p)},Kt.prototype.N=function(){this.g.l=null,delete this.j,Nt(this.g),delete this.g,Kt.aa.N.call(this)};function Wl(u){Zn.call(this),u.__headers__&&(this.headers=u.__headers__,this.statusCode=u.__status__,delete u.__headers__,delete u.__status__);var p=u.__sm__;if(p){e:{for(const y in p){u=y;break e}u=void 0}(this.i=u)&&(u=this.i,p=p!==null&&u in p?p[u]:void 0),this.data=p}else this.data=u}W(Wl,Zn);function Kl(){bs.call(this),this.status=1}W(Kl,bs);function sr(u){this.g=u}W(sr,ma),sr.prototype.ua=function(){yt(this.g,"a")},sr.prototype.ta=function(u){yt(this.g,new Wl(u))},sr.prototype.sa=function(u){yt(this.g,new Kl)},sr.prototype.ra=function(){yt(this.g,"b")},Js.prototype.createWebChannel=Js.prototype.g,Kt.prototype.send=Kt.prototype.o,Kt.prototype.open=Kt.prototype.m,Kt.prototype.close=Kt.prototype.close,Tv=function(){return new Js},wv=function(){return zi()},Ev=er,Yd={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},js.NO_ERROR=0,js.TIMEOUT=8,js.HTTP_ERROR=6,Zu=js,Rl.COMPLETE="complete",vv=Rl,Vs.EventType=vn,vn.OPEN="a",vn.CLOSE="b",vn.ERROR="c",vn.MESSAGE="d",gt.prototype.listen=gt.prototype.K,qa=Vs,Ze.prototype.listenOnce=Ze.prototype.L,Ze.prototype.getLastError=Ze.prototype.Ka,Ze.prototype.getLastErrorCode=Ze.prototype.Ba,Ze.prototype.getStatus=Ze.prototype.Z,Ze.prototype.getResponseJson=Ze.prototype.Oa,Ze.prototype.getResponseText=Ze.prototype.oa,Ze.prototype.send=Ze.prototype.ea,Ze.prototype.setWithCredentials=Ze.prototype.Ha,_v=Ze}).apply(typeof Bu<"u"?Bu:typeof self<"u"?self:typeof window<"u"?window:{});const py="@firebase/firestore",my="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}$t.UNAUTHENTICATED=new $t(null),$t.GOOGLE_CREDENTIALS=new $t("google-credentials-uid"),$t.FIRST_PARTY=new $t("first-party-uid"),$t.MOCK_USER=new $t("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zo="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=new wf("@firebase/firestore");function wo(){return Es.logLevel}function ne(r,...e){if(Es.logLevel<=Ne.DEBUG){const t=e.map(Lf);Es.debug(`Firestore (${zo}): ${r}`,...t)}}function $r(r,...e){if(Es.logLevel<=Ne.ERROR){const t=e.map(Lf);Es.error(`Firestore (${zo}): ${r}`,...t)}}function Ci(r,...e){if(Es.logLevel<=Ne.WARN){const t=e.map(Lf);Es.warn(`Firestore (${zo}): ${r}`,...t)}}function Lf(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(r,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,Iv(r,s,t)}function Iv(r,e,t){let s=`FIRESTORE (${zo}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw $r(s),new Error(s)}function Ue(r,e,t,s){let o="Unexpected state";typeof t=="string"?o=t:s=t,r||Iv(e,o,s)}function Se(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ie extends _r{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Si{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sv{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class LS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t($t.UNAUTHENTICATED)))}shutdown(){}}class MS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class jS{constructor(e){this.t=e,this.currentUser=$t.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Ue(this.o===void 0,42304);let s=this.i;const o=g=>this.i!==s?(s=this.i,t(g)):Promise.resolve();let l=new Si;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new Si,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=l;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},f=g=>{ne("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>f(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?f(g):(ne("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new Si)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(ne("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?(Ue(typeof s.accessToken=="string",31837,{l:s}),new Sv(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Ue(e===null||typeof e=="string",2055,{h:e}),new $t(e)}}class FS{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=$t.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class US{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new FS(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t($t.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class gy{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class zS{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Yt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Ue(this.o===void 0,3512);const s=l=>{l.error!=null&&ne("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${l.error.message}`);const h=l.token!==this.m;return this.m=l.token,ne("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(l.token):Promise.resolve()};this.o=l=>{e.enqueueRetryable((()=>s(l)))};const o=l=>{ne("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=l,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((l=>o(l))),setTimeout((()=>{if(!this.appCheck){const l=this.V.getImmediate({optional:!0});l?o(l):ne("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new gy(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Ue(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new gy(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BS(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<r;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Av(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=BS(40);for(let l=0;l<o.length;++l)s.length<20&&o[l]<t&&(s+=e.charAt(o[l]%62))}return s}}function ke(r,e){return r<e?-1:r>e?1:0}function Xd(r,e){let t=0;for(;t<r.length&&t<e.length;){const s=r.codePointAt(t),o=e.codePointAt(t);if(s!==o){if(s<128&&o<128)return ke(s,o);{const l=Av(),h=$S(l.encode(yy(r,t)),l.encode(yy(e,t)));return h!==0?h:ke(s,o)}}t+=s>65535?2:1}return ke(r.length,e.length)}function yy(r,e){return r.codePointAt(e)>65535?r.substring(e,e+2):r.substring(e,e+1)}function $S(r,e){for(let t=0;t<r.length&&t<e.length;++t)if(r[t]!==e[t])return ke(r[t],e[t]);return ke(r.length,e.length)}function Oo(r,e,t){return r.length===e.length&&r.every(((s,o)=>t(s,e[o])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _y="__name__";class cr{constructor(e,t,s){t===void 0?t=0:t>e.length&&Ee(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&Ee(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return cr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof cr?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let o=0;o<s;o++){const l=cr.compareSegments(e.get(o),t.get(o));if(l!==0)return l}return ke(e.length,t.length)}static compareSegments(e,t){const s=cr.isNumericId(e),o=cr.isNumericId(t);return s&&!o?-1:!s&&o?1:s&&o?cr.extractNumericId(e).compare(cr.extractNumericId(t)):Xd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ii.fromString(e.substring(4,e.length-2))}}class Ke extends cr{construct(e,t,s){return new Ke(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new ie(H.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((o=>o.length>0)))}return new Ke(t)}static emptyPath(){return new Ke([])}}const HS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Vt extends cr{construct(e,t,s){return new Vt(e,t,s)}static isValidIdentifier(e){return HS.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Vt.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===_y}static keyField(){return new Vt([_y])}static fromServerFormat(e){const t=[];let s="",o=0;const l=()=>{if(s.length===0)throw new ie(H.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let h=!1;for(;o<e.length;){const f=e[o];if(f==="\\"){if(o+1===e.length)throw new ie(H.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new ie(H.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=g,o+=2}else f==="`"?(h=!h,o++):f!=="."||h?(s+=f,o++):(l(),o++)}if(l(),h)throw new ie(H.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Vt(t)}static emptyPath(){return new Vt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e){this.path=e}static fromPath(e){return new ge(Ke.fromString(e))}static fromName(e){return new ge(Ke.fromString(e).popFirst(5))}static empty(){return new ge(Ke.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ke.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ke.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ge(new Ke(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rv(r,e,t){if(!t)throw new ie(H.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function qS(r,e,t,s){if(e===!0&&s===!0)throw new ie(H.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function vy(r){if(!ge.isDocumentKey(r))throw new ie(H.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Ey(r){if(ge.isDocumentKey(r))throw new ie(H.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function kv(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function bc(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":Ee(12329,{type:typeof r})}function mc(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new ie(H.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=bc(r);throw new ie(H.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(r,e){const t={typeString:r};return e&&(t.value=e),t}function vl(r,e){if(!kv(r))throw new ie(H.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const o=e[s].typeString,l="value"in e[s]?{value:e[s].value}:void 0;if(!(s in r)){t=`JSON missing required field: '${s}'`;break}const h=r[s];if(o&&typeof h!==o){t=`JSON field '${s}' must be a ${o}.`;break}if(l!==void 0&&h!==l.value){t=`Expected '${s}' field to equal '${l.value}'`;break}}if(t)throw new ie(H.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wy=-62135596800,Ty=1e6;class Ye{static now(){return Ye.fromMillis(Date.now())}static fromDate(e){return Ye.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Ty);return new Ye(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ie(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ie(H.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<wy)throw new ie(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ie(H.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ty}_compareTo(e){return this.seconds===e.seconds?ke(this.nanoseconds,e.nanoseconds):ke(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ye._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(vl(e,Ye._jsonSchema))return new Ye(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-wy;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ye._jsonSchemaVersion="firestore/timestamp/1.0",Ye._jsonSchema={type:mt("string",Ye._jsonSchemaVersion),seconds:mt("number"),nanoseconds:mt("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{static fromTimestamp(e){return new Ie(e)}static min(){return new Ie(new Ye(0,0))}static max(){return new Ie(new Ye(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ol=-1;function WS(r,e){const t=r.toTimestamp().seconds,s=r.toTimestamp().nanoseconds+1,o=Ie.fromTimestamp(s===1e9?new Ye(t+1,0):new Ye(t,s));return new Pi(o,ge.empty(),e)}function KS(r){return new Pi(r.readTime,r.key,ol)}class Pi{constructor(e,t,s){this.readTime=e,this.documentKey=t,this.largestBatchId=s}static min(){return new Pi(Ie.min(),ge.empty(),ol)}static max(){return new Pi(Ie.max(),ge.empty(),ol)}}function GS(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=ge.comparator(r.documentKey,e.documentKey),t!==0?t:ke(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class YS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bo(r){if(r.code!==H.FAILED_PRECONDITION||r.message!==QS)throw r;ne("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Ee(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new q(((s,o)=>{this.nextCallback=l=>{this.wrapSuccess(e,l).next(s,o)},this.catchCallback=l=>{this.wrapFailure(t,l).next(s,o)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof q?t:q.resolve(t)}catch(t){return q.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):q.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):q.reject(t)}static resolve(e){return new q(((t,s)=>{t(e)}))}static reject(e){return new q(((t,s)=>{s(e)}))}static waitFor(e){return new q(((t,s)=>{let o=0,l=0,h=!1;e.forEach((f=>{++o,f.next((()=>{++l,h&&l===o&&t()}),(g=>s(g)))})),h=!0,l===o&&t()}))}static or(e){let t=q.resolve(!1);for(const s of e)t=t.next((o=>o?q.resolve(o):s()));return t}static forEach(e,t){const s=[];return e.forEach(((o,l)=>{s.push(t.call(this,o,l))})),this.waitFor(s)}static mapArray(e,t){return new q(((s,o)=>{const l=e.length,h=new Array(l);let f=0;for(let g=0;g<l;g++){const _=g;t(e[_]).next((T=>{h[_]=T,++f,f===l&&s(h)}),(T=>o(T)))}}))}static doWhile(e,t){return new q(((s,o)=>{const l=()=>{e()===!0?t().next((()=>{l()}),o):s()};l()}))}}function XS(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function $o(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lc{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=s=>this._e(s),this.ae=s=>t.writeSequenceNumber(s))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Lc.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf=-1;function Mc(r){return r==null}function gc(r){return r===0&&1/r==-1/0}function JS(r){return typeof r=="number"&&Number.isInteger(r)&&!gc(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cv="";function ZS(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Iy(e)),e=eA(r.get(t),e);return Iy(e)}function eA(r,e){let t=e;const s=r.length;for(let o=0;o<s;o++){const l=r.charAt(o);switch(l){case"\0":t+="";break;case Cv:t+="";break;default:t+=l}}return t}function Iy(r){return r+Cv+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sy(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Ss(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Pv(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e,t){this.comparator=e,this.root=t||Ot.EMPTY}insert(e,t){return new it(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ot.BLACK,null,null))}remove(e){return new it(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ot.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const s=this.comparator(e,t.key);if(s===0)return t.value;s<0?t=t.left:s>0&&(t=t.right)}return null}indexOf(e){let t=0,s=this.root;for(;!s.isEmpty();){const o=this.comparator(e,s.key);if(o===0)return t+s.left.size;o<0?s=s.left:(t+=s.left.size+1,s=s.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,s)=>(e(t,s),!1)))}toString(){const e=[];return this.inorderTraversal(((t,s)=>(e.push(`${t}:${s}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new $u(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new $u(this.root,e,this.comparator,!1)}getReverseIterator(){return new $u(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new $u(this.root,e,this.comparator,!0)}}class $u{constructor(e,t,s,o){this.isReverse=o,this.nodeStack=[];let l=1;for(;!e.isEmpty();)if(l=t?s(e.key,t):1,t&&o&&(l*=-1),l<0)e=this.isReverse?e.left:e.right;else{if(l===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ot{constructor(e,t,s,o,l){this.key=e,this.value=t,this.color=s??Ot.RED,this.left=o??Ot.EMPTY,this.right=l??Ot.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,s,o,l){return new Ot(e??this.key,t??this.value,s??this.color,o??this.left,l??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let o=this;const l=s(e,o.key);return o=l<0?o.copy(null,null,null,o.left.insert(e,t,s),null):l===0?o.copy(null,t,null,null,null):o.copy(null,null,null,null,o.right.insert(e,t,s)),o.fixUp()}removeMin(){if(this.left.isEmpty())return Ot.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let s,o=this;if(t(e,o.key)<0)o.left.isEmpty()||o.left.isRed()||o.left.left.isRed()||(o=o.moveRedLeft()),o=o.copy(null,null,null,o.left.remove(e,t),null);else{if(o.left.isRed()&&(o=o.rotateRight()),o.right.isEmpty()||o.right.isRed()||o.right.left.isRed()||(o=o.moveRedRight()),t(e,o.key)===0){if(o.right.isEmpty())return Ot.EMPTY;s=o.right.min(),o=o.copy(s.key,s.value,null,null,o.right.removeMin())}o=o.copy(null,null,null,null,o.right.remove(e,t))}return o.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ot.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ot.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Ee(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Ee(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Ee(27949);return e+(this.isRed()?0:1)}}Ot.EMPTY=null,Ot.RED=!0,Ot.BLACK=!1;Ot.EMPTY=new class{constructor(){this.size=0}get key(){throw Ee(57766)}get value(){throw Ee(16141)}get color(){throw Ee(16727)}get left(){throw Ee(29726)}get right(){throw Ee(36894)}copy(e,t,s,o,l){return this}insert(e,t,s){return new Ot(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e){this.comparator=e,this.data=new it(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,s)=>(e(t),!1)))}forEachInRange(e,t){const s=this.data.getIteratorFrom(e[0]);for(;s.hasNext();){const o=s.getNext();if(this.comparator(o.key,e[1])>=0)return;t(o.key)}}forEachWhile(e,t){let s;for(s=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();s.hasNext();)if(!e(s.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ay(this.data.getIterator())}getIteratorFrom(e){return new Ay(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((s=>{t=t.add(s)})),t}isEqual(e){if(!(e instanceof wt)||this.size!==e.size)return!1;const t=this.data.getIterator(),s=e.data.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=s.getNext().key;if(this.comparator(o,l)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new wt(this.comparator);return t.data=e,t}}class Ay{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e){this.fields=e,e.sort(Vt.comparator)}static empty(){return new Yn([])}unionWith(e){let t=new wt(Vt.comparator);for(const s of this.fields)t=t.add(s);for(const s of e)t=t.add(s);return new Yn(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Oo(this.fields,e.fields,((t,s)=>t.isEqual(s)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nv extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(l){throw typeof DOMException<"u"&&l instanceof DOMException?new Nv("Invalid base64 string: "+l):l}})(e);return new bt(t)}static fromUint8Array(e){const t=(function(o){let l="";for(let h=0;h<o.length;++h)l+=String.fromCharCode(o[h]);return l})(e);return new bt(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let o=0;o<t.length;o++)s[o]=t.charCodeAt(o);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ke(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}bt.EMPTY_BYTE_STRING=new bt("");const tA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Ni(r){if(Ue(!!r,39018),typeof r=="string"){let e=0;const t=tA.exec(r);if(Ue(!!t,46558,{timestamp:r}),t[1]){let o=t[1];o=(o+"000000000").substr(0,9),e=Number(o)}const s=new Date(r);return{seconds:Math.floor(s.getTime()/1e3),nanos:e}}return{seconds:ut(r.seconds),nanos:ut(r.nanos)}}function ut(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function xi(r){return typeof r=="string"?bt.fromBase64String(r):bt.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xv="server_timestamp",Dv="__type__",Ov="__previous_value__",Vv="__local_write_time__";function Ff(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[Dv])===null||t===void 0?void 0:t.stringValue)===xv}function jc(r){const e=r.mapValue.fields[Ov];return Ff(e)?jc(e):e}function al(r){const e=Ni(r.mapValue.fields[Vv].timestampValue);return new Ye(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nA{constructor(e,t,s,o,l,h,f,g,_,T){this.databaseId=e,this.appId=t,this.persistenceKey=s,this.host=o,this.ssl=l,this.forceLongPolling=h,this.autoDetectLongPolling=f,this.longPollingOptions=g,this.useFetchStreams=_,this.isUsingEmulator=T}}const yc="(default)";class ll{constructor(e,t){this.projectId=e,this.database=t||yc}static empty(){return new ll("","")}get isDefaultDatabase(){return this.database===yc}isEqual(e){return e instanceof ll&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bv="__type__",rA="__max__",Hu={mapValue:{}},Lv="__vector__",_c="value";function Di(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Ff(r)?4:sA(r)?9007199254740991:iA(r)?10:11:Ee(28295,{value:r})}function yr(r,e){if(r===e)return!0;const t=Di(r);if(t!==Di(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return al(r).isEqual(al(e));case 3:return(function(o,l){if(typeof o.timestampValue=="string"&&typeof l.timestampValue=="string"&&o.timestampValue.length===l.timestampValue.length)return o.timestampValue===l.timestampValue;const h=Ni(o.timestampValue),f=Ni(l.timestampValue);return h.seconds===f.seconds&&h.nanos===f.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(o,l){return xi(o.bytesValue).isEqual(xi(l.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(o,l){return ut(o.geoPointValue.latitude)===ut(l.geoPointValue.latitude)&&ut(o.geoPointValue.longitude)===ut(l.geoPointValue.longitude)})(r,e);case 2:return(function(o,l){if("integerValue"in o&&"integerValue"in l)return ut(o.integerValue)===ut(l.integerValue);if("doubleValue"in o&&"doubleValue"in l){const h=ut(o.doubleValue),f=ut(l.doubleValue);return h===f?gc(h)===gc(f):isNaN(h)&&isNaN(f)}return!1})(r,e);case 9:return Oo(r.arrayValue.values||[],e.arrayValue.values||[],yr);case 10:case 11:return(function(o,l){const h=o.mapValue.fields||{},f=l.mapValue.fields||{};if(Sy(h)!==Sy(f))return!1;for(const g in h)if(h.hasOwnProperty(g)&&(f[g]===void 0||!yr(h[g],f[g])))return!1;return!0})(r,e);default:return Ee(52216,{left:r})}}function ul(r,e){return(r.values||[]).find((t=>yr(t,e)))!==void 0}function Vo(r,e){if(r===e)return 0;const t=Di(r),s=Di(e);if(t!==s)return ke(t,s);switch(t){case 0:case 9007199254740991:return 0;case 1:return ke(r.booleanValue,e.booleanValue);case 2:return(function(l,h){const f=ut(l.integerValue||l.doubleValue),g=ut(h.integerValue||h.doubleValue);return f<g?-1:f>g?1:f===g?0:isNaN(f)?isNaN(g)?0:-1:1})(r,e);case 3:return Ry(r.timestampValue,e.timestampValue);case 4:return Ry(al(r),al(e));case 5:return Xd(r.stringValue,e.stringValue);case 6:return(function(l,h){const f=xi(l),g=xi(h);return f.compareTo(g)})(r.bytesValue,e.bytesValue);case 7:return(function(l,h){const f=l.split("/"),g=h.split("/");for(let _=0;_<f.length&&_<g.length;_++){const T=ke(f[_],g[_]);if(T!==0)return T}return ke(f.length,g.length)})(r.referenceValue,e.referenceValue);case 8:return(function(l,h){const f=ke(ut(l.latitude),ut(h.latitude));return f!==0?f:ke(ut(l.longitude),ut(h.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return ky(r.arrayValue,e.arrayValue);case 10:return(function(l,h){var f,g,_,T;const A=l.fields||{},C=h.fields||{},z=(f=A[_c])===null||f===void 0?void 0:f.arrayValue,W=(g=C[_c])===null||g===void 0?void 0:g.arrayValue,Y=ke(((_=z==null?void 0:z.values)===null||_===void 0?void 0:_.length)||0,((T=W==null?void 0:W.values)===null||T===void 0?void 0:T.length)||0);return Y!==0?Y:ky(z,W)})(r.mapValue,e.mapValue);case 11:return(function(l,h){if(l===Hu.mapValue&&h===Hu.mapValue)return 0;if(l===Hu.mapValue)return 1;if(h===Hu.mapValue)return-1;const f=l.fields||{},g=Object.keys(f),_=h.fields||{},T=Object.keys(_);g.sort(),T.sort();for(let A=0;A<g.length&&A<T.length;++A){const C=Xd(g[A],T[A]);if(C!==0)return C;const z=Vo(f[g[A]],_[T[A]]);if(z!==0)return z}return ke(g.length,T.length)})(r.mapValue,e.mapValue);default:throw Ee(23264,{le:t})}}function Ry(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return ke(r,e);const t=Ni(r),s=Ni(e),o=ke(t.seconds,s.seconds);return o!==0?o:ke(t.nanos,s.nanos)}function ky(r,e){const t=r.values||[],s=e.values||[];for(let o=0;o<t.length&&o<s.length;++o){const l=Vo(t[o],s[o]);if(l)return l}return ke(t.length,s.length)}function bo(r){return Jd(r)}function Jd(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const s=Ni(t);return`time(${s.seconds},${s.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return xi(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return ge.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let s="[",o=!0;for(const l of t.values||[])o?o=!1:s+=",",s+=Jd(l);return s+"]"})(r.arrayValue):"mapValue"in r?(function(t){const s=Object.keys(t.fields||{}).sort();let o="{",l=!0;for(const h of s)l?l=!1:o+=",",o+=`${h}:${Jd(t.fields[h])}`;return o+"}"})(r.mapValue):Ee(61005,{value:r})}function ec(r){switch(Di(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=jc(r);return e?16+ec(e):16;case 5:return 2*r.stringValue.length;case 6:return xi(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(s){return(s.values||[]).reduce(((o,l)=>o+ec(l)),0)})(r.arrayValue);case 10:case 11:return(function(s){let o=0;return Ss(s.fields,((l,h)=>{o+=l.length+ec(h)})),o})(r.mapValue);default:throw Ee(13486,{value:r})}}function Cy(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Zd(r){return!!r&&"integerValue"in r}function Uf(r){return!!r&&"arrayValue"in r}function Py(r){return!!r&&"nullValue"in r}function Ny(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function tc(r){return!!r&&"mapValue"in r}function iA(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{})[bv])===null||t===void 0?void 0:t.stringValue)===Lv}function Za(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Ss(r.mapValue.fields,((t,s)=>e.mapValue.fields[t]=Za(s))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Za(r.arrayValue.values[t]);return e}return Object.assign({},r)}function sA(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===rA}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e){this.value=e}static empty(){return new Pn({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let s=0;s<e.length-1;++s)if(t=(t.mapValue.fields||{})[e.get(s)],!tc(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Za(t)}setAll(e){let t=Vt.emptyPath(),s={},o=[];e.forEach(((h,f)=>{if(!t.isImmediateParentOf(f)){const g=this.getFieldsMap(t);this.applyChanges(g,s,o),s={},o=[],t=f.popLast()}h?s[f.lastSegment()]=Za(h):o.push(f.lastSegment())}));const l=this.getFieldsMap(t);this.applyChanges(l,s,o)}delete(e){const t=this.field(e.popLast());tc(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return yr(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let s=0;s<e.length;++s){let o=t.mapValue.fields[e.get(s)];tc(o)&&o.mapValue.fields||(o={mapValue:{fields:{}}},t.mapValue.fields[e.get(s)]=o),t=o}return t.mapValue.fields}applyChanges(e,t,s){Ss(t,((o,l)=>e[o]=l));for(const o of s)delete e[o]}clone(){return new Pn(Za(this.value))}}function Mv(r){const e=[];return Ss(r.fields,((t,s)=>{const o=new Vt([t]);if(tc(s)){const l=Mv(s.mapValue).fields;if(l.length===0)e.push(o);else for(const h of l)e.push(o.child(h))}else e.push(o)})),new Yn(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,t,s,o,l,h,f){this.key=e,this.documentType=t,this.version=s,this.readTime=o,this.createTime=l,this.data=h,this.documentState=f}static newInvalidDocument(e){return new Ht(e,0,Ie.min(),Ie.min(),Ie.min(),Pn.empty(),0)}static newFoundDocument(e,t,s,o){return new Ht(e,1,t,Ie.min(),s,o,0)}static newNoDocument(e,t){return new Ht(e,2,t,Ie.min(),Ie.min(),Pn.empty(),0)}static newUnknownDocument(e,t){return new Ht(e,3,t,Ie.min(),Ie.min(),Pn.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Ie.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Pn.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Pn.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Ie.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ht&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ht(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{constructor(e,t){this.position=e,this.inclusive=t}}function xy(r,e,t){let s=0;for(let o=0;o<r.position.length;o++){const l=e[o],h=r.position[o];if(l.field.isKeyField()?s=ge.comparator(ge.fromName(h.referenceValue),t.key):s=Vo(h,t.data.field(l.field)),l.dir==="desc"&&(s*=-1),s!==0)break}return s}function Dy(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!yr(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e,t="asc"){this.field=e,this.dir=t}}function oA(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jv{}class pt extends jv{constructor(e,t,s){super(),this.field=e,this.op=t,this.value=s}static create(e,t,s){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,s):new lA(e,t,s):t==="array-contains"?new hA(e,s):t==="in"?new dA(e,s):t==="not-in"?new fA(e,s):t==="array-contains-any"?new pA(e,s):new pt(e,t,s)}static createKeyFieldInFilter(e,t,s){return t==="in"?new uA(e,s):new cA(e,s)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Vo(t,this.value)):t!==null&&Di(this.value)===Di(t)&&this.matchesComparison(Vo(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Ee(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Xn extends jv{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Xn(e,t)}matches(e){return Fv(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Fv(r){return r.op==="and"}function Uv(r){return aA(r)&&Fv(r)}function aA(r){for(const e of r.filters)if(e instanceof Xn)return!1;return!0}function ef(r){if(r instanceof pt)return r.field.canonicalString()+r.op.toString()+bo(r.value);if(Uv(r))return r.filters.map((e=>ef(e))).join(",");{const e=r.filters.map((t=>ef(t))).join(",");return`${r.op}(${e})`}}function zv(r,e){return r instanceof pt?(function(s,o){return o instanceof pt&&s.op===o.op&&s.field.isEqual(o.field)&&yr(s.value,o.value)})(r,e):r instanceof Xn?(function(s,o){return o instanceof Xn&&s.op===o.op&&s.filters.length===o.filters.length?s.filters.reduce(((l,h,f)=>l&&zv(h,o.filters[f])),!0):!1})(r,e):void Ee(19439)}function Bv(r){return r instanceof pt?(function(t){return`${t.field.canonicalString()} ${t.op} ${bo(t.value)}`})(r):r instanceof Xn?(function(t){return t.op.toString()+" {"+t.getFilters().map(Bv).join(" ,")+"}"})(r):"Filter"}class lA extends pt{constructor(e,t,s){super(e,t,s),this.key=ge.fromName(s.referenceValue)}matches(e){const t=ge.comparator(e.key,this.key);return this.matchesComparison(t)}}class uA extends pt{constructor(e,t){super(e,"in",t),this.keys=$v("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class cA extends pt{constructor(e,t){super(e,"not-in",t),this.keys=$v("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function $v(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((s=>ge.fromName(s.referenceValue)))}class hA extends pt{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Uf(t)&&ul(t.arrayValue,this.value)}}class dA extends pt{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ul(this.value.arrayValue,t)}}class fA extends pt{constructor(e,t){super(e,"not-in",t)}matches(e){if(ul(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ul(this.value.arrayValue,t)}}class pA extends pt{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Uf(t)||!t.arrayValue.values)&&t.arrayValue.values.some((s=>ul(this.value.arrayValue,s)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mA{constructor(e,t=null,s=[],o=[],l=null,h=null,f=null){this.path=e,this.collectionGroup=t,this.orderBy=s,this.filters=o,this.limit=l,this.startAt=h,this.endAt=f,this.Pe=null}}function Oy(r,e=null,t=[],s=[],o=null,l=null,h=null){return new mA(r,e,t,s,o,l,h)}function zf(r){const e=Se(r);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((s=>ef(s))).join(","),t+="|ob:",t+=e.orderBy.map((s=>(function(l){return l.field.canonicalString()+l.dir})(s))).join(","),Mc(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((s=>bo(s))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((s=>bo(s))).join(",")),e.Pe=t}return e.Pe}function Bf(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!oA(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!zv(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Dy(r.startAt,e.startAt)&&Dy(r.endAt,e.endAt)}function tf(r){return ge.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(e,t=null,s=[],o=[],l=null,h="F",f=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=o,this.limit=l,this.limitType=h,this.startAt=f,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function gA(r,e,t,s,o,l,h,f){return new El(r,e,t,s,o,l,h,f)}function Hv(r){return new El(r)}function Vy(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function qv(r){return r.collectionGroup!==null}function el(r){const e=Se(r);if(e.Te===null){e.Te=[];const t=new Set;for(const l of e.explicitOrderBy)e.Te.push(l),t.add(l.field.canonicalString());const s=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(h){let f=new wt(Vt.comparator);return h.filters.forEach((g=>{g.getFlattenedFilters().forEach((_=>{_.isInequality()&&(f=f.add(_.field))}))})),f})(e).forEach((l=>{t.has(l.canonicalString())||l.isKeyField()||e.Te.push(new Ec(l,s))})),t.has(Vt.keyField().canonicalString())||e.Te.push(new Ec(Vt.keyField(),s))}return e.Te}function fr(r){const e=Se(r);return e.Ie||(e.Ie=yA(e,el(r))),e.Ie}function yA(r,e){if(r.limitType==="F")return Oy(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((o=>{const l=o.dir==="desc"?"asc":"desc";return new Ec(o.field,l)}));const t=r.endAt?new vc(r.endAt.position,r.endAt.inclusive):null,s=r.startAt?new vc(r.startAt.position,r.startAt.inclusive):null;return Oy(r.path,r.collectionGroup,e,r.filters,r.limit,t,s)}}function nf(r,e){const t=r.filters.concat([e]);return new El(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function wc(r,e,t){return new El(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Fc(r,e){return Bf(fr(r),fr(e))&&r.limitType===e.limitType}function Wv(r){return`${zf(fr(r))}|lt:${r.limitType}`}function To(r){return`Query(target=${(function(t){let s=t.path.canonicalString();return t.collectionGroup!==null&&(s+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(s+=`, filters: [${t.filters.map((o=>Bv(o))).join(", ")}]`),Mc(t.limit)||(s+=", limit: "+t.limit),t.orderBy.length>0&&(s+=`, orderBy: [${t.orderBy.map((o=>(function(h){return`${h.field.canonicalString()} (${h.dir})`})(o))).join(", ")}]`),t.startAt&&(s+=", startAt: ",s+=t.startAt.inclusive?"b:":"a:",s+=t.startAt.position.map((o=>bo(o))).join(",")),t.endAt&&(s+=", endAt: ",s+=t.endAt.inclusive?"a:":"b:",s+=t.endAt.position.map((o=>bo(o))).join(",")),`Target(${s})`})(fr(r))}; limitType=${r.limitType})`}function Uc(r,e){return e.isFoundDocument()&&(function(s,o){const l=o.key.path;return s.collectionGroup!==null?o.key.hasCollectionId(s.collectionGroup)&&s.path.isPrefixOf(l):ge.isDocumentKey(s.path)?s.path.isEqual(l):s.path.isImmediateParentOf(l)})(r,e)&&(function(s,o){for(const l of el(s))if(!l.field.isKeyField()&&o.data.field(l.field)===null)return!1;return!0})(r,e)&&(function(s,o){for(const l of s.filters)if(!l.matches(o))return!1;return!0})(r,e)&&(function(s,o){return!(s.startAt&&!(function(h,f,g){const _=xy(h,f,g);return h.inclusive?_<=0:_<0})(s.startAt,el(s),o)||s.endAt&&!(function(h,f,g){const _=xy(h,f,g);return h.inclusive?_>=0:_>0})(s.endAt,el(s),o))})(r,e)}function _A(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Kv(r){return(e,t)=>{let s=!1;for(const o of el(r)){const l=vA(o,e,t);if(l!==0)return l;s=s||o.field.isKeyField()}return 0}}function vA(r,e,t){const s=r.field.isKeyField()?ge.comparator(e.key,t.key):(function(l,h,f){const g=h.data.field(l),_=f.data.field(l);return g!==null&&_!==null?Vo(g,_):Ee(42886)})(r.field,e,t);switch(r.dir){case"asc":return s;case"desc":return-1*s;default:return Ee(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s!==void 0){for(const[o,l]of s)if(this.equalsFn(o,e))return l}}has(e){return this.get(e)!==void 0}set(e,t){const s=this.mapKeyFn(e),o=this.inner[s];if(o===void 0)return this.inner[s]=[[e,t]],void this.innerSize++;for(let l=0;l<o.length;l++)if(this.equalsFn(o[l][0],e))return void(o[l]=[e,t]);o.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),s=this.inner[t];if(s===void 0)return!1;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return s.length===1?delete this.inner[t]:s.splice(o,1),this.innerSize--,!0;return!1}forEach(e){Ss(this.inner,((t,s)=>{for(const[o,l]of s)e(o,l)}))}isEmpty(){return Pv(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EA=new it(ge.comparator);function Hr(){return EA}const Gv=new it(ge.comparator);function Wa(...r){let e=Gv;for(const t of r)e=e.insert(t.key,t);return e}function Qv(r){let e=Gv;return r.forEach(((t,s)=>e=e.insert(t,s.overlayedDocument))),e}function fs(){return tl()}function Yv(){return tl()}function tl(){return new As((r=>r.toString()),((r,e)=>r.isEqual(e)))}const wA=new it(ge.comparator),TA=new wt(ge.comparator);function xe(...r){let e=TA;for(const t of r)e=e.add(t);return e}const IA=new wt(ke);function SA(){return IA}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $f(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:gc(e)?"-0":e}}function Xv(r){return{integerValue:""+r}}function AA(r,e){return JS(e)?Xv(e):$f(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zc{constructor(){this._=void 0}}function RA(r,e,t){return r instanceof Tc?(function(o,l){const h={fields:{[Dv]:{stringValue:xv},[Vv]:{timestampValue:{seconds:o.seconds,nanos:o.nanoseconds}}}};return l&&Ff(l)&&(l=jc(l)),l&&(h.fields[Ov]=l),{mapValue:h}})(t,e):r instanceof cl?Zv(r,e):r instanceof hl?eE(r,e):(function(o,l){const h=Jv(o,l),f=by(h)+by(o.Ee);return Zd(h)&&Zd(o.Ee)?Xv(f):$f(o.serializer,f)})(r,e)}function kA(r,e,t){return r instanceof cl?Zv(r,e):r instanceof hl?eE(r,e):t}function Jv(r,e){return r instanceof Ic?(function(s){return Zd(s)||(function(l){return!!l&&"doubleValue"in l})(s)})(e)?e:{integerValue:0}:null}class Tc extends zc{}class cl extends zc{constructor(e){super(),this.elements=e}}function Zv(r,e){const t=tE(e);for(const s of r.elements)t.some((o=>yr(o,s)))||t.push(s);return{arrayValue:{values:t}}}class hl extends zc{constructor(e){super(),this.elements=e}}function eE(r,e){let t=tE(e);for(const s of r.elements)t=t.filter((o=>!yr(o,s)));return{arrayValue:{values:t}}}class Ic extends zc{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function by(r){return ut(r.integerValue||r.doubleValue)}function tE(r){return Uf(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}function CA(r,e){return r.field.isEqual(e.field)&&(function(s,o){return s instanceof cl&&o instanceof cl||s instanceof hl&&o instanceof hl?Oo(s.elements,o.elements,yr):s instanceof Ic&&o instanceof Ic?yr(s.Ee,o.Ee):s instanceof Tc&&o instanceof Tc})(r.transform,e.transform)}class PA{constructor(e,t){this.version=e,this.transformResults=t}}class Ur{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ur}static exists(e){return new Ur(void 0,e)}static updateTime(e){return new Ur(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function nc(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Bc{}function nE(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new iE(r.key,Ur.none()):new wl(r.key,r.data,Ur.none());{const t=r.data,s=Pn.empty();let o=new wt(Vt.comparator);for(let l of e.fields)if(!o.has(l)){let h=t.field(l);h===null&&l.length>1&&(l=l.popLast(),h=t.field(l)),h===null?s.delete(l):s.set(l,h),o=o.add(l)}return new Rs(r.key,s,new Yn(o.toArray()),Ur.none())}}function NA(r,e,t){r instanceof wl?(function(o,l,h){const f=o.value.clone(),g=My(o.fieldTransforms,l,h.transformResults);f.setAll(g),l.convertToFoundDocument(h.version,f).setHasCommittedMutations()})(r,e,t):r instanceof Rs?(function(o,l,h){if(!nc(o.precondition,l))return void l.convertToUnknownDocument(h.version);const f=My(o.fieldTransforms,l,h.transformResults),g=l.data;g.setAll(rE(o)),g.setAll(f),l.convertToFoundDocument(h.version,g).setHasCommittedMutations()})(r,e,t):(function(o,l,h){l.convertToNoDocument(h.version).setHasCommittedMutations()})(0,e,t)}function nl(r,e,t,s){return r instanceof wl?(function(l,h,f,g){if(!nc(l.precondition,h))return f;const _=l.value.clone(),T=jy(l.fieldTransforms,g,h);return _.setAll(T),h.convertToFoundDocument(h.version,_).setHasLocalMutations(),null})(r,e,t,s):r instanceof Rs?(function(l,h,f,g){if(!nc(l.precondition,h))return f;const _=jy(l.fieldTransforms,g,h),T=h.data;return T.setAll(rE(l)),T.setAll(_),h.convertToFoundDocument(h.version,T).setHasLocalMutations(),f===null?null:f.unionWith(l.fieldMask.fields).unionWith(l.fieldTransforms.map((A=>A.field)))})(r,e,t,s):(function(l,h,f){return nc(l.precondition,h)?(h.convertToNoDocument(h.version).setHasLocalMutations(),null):f})(r,e,t)}function xA(r,e){let t=null;for(const s of r.fieldTransforms){const o=e.data.field(s.field),l=Jv(s.transform,o||null);l!=null&&(t===null&&(t=Pn.empty()),t.set(s.field,l))}return t||null}function Ly(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(s,o){return s===void 0&&o===void 0||!(!s||!o)&&Oo(s,o,((l,h)=>CA(l,h)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class wl extends Bc{constructor(e,t,s,o=[]){super(),this.key=e,this.value=t,this.precondition=s,this.fieldTransforms=o,this.type=0}getFieldMask(){return null}}class Rs extends Bc{constructor(e,t,s,o,l=[]){super(),this.key=e,this.data=t,this.fieldMask=s,this.precondition=o,this.fieldTransforms=l,this.type=1}getFieldMask(){return this.fieldMask}}function rE(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const s=r.data.field(t);e.set(t,s)}})),e}function My(r,e,t){const s=new Map;Ue(r.length===t.length,32656,{Ae:t.length,Re:r.length});for(let o=0;o<t.length;o++){const l=r[o],h=l.transform,f=e.data.field(l.field);s.set(l.field,kA(h,f,t[o]))}return s}function jy(r,e,t){const s=new Map;for(const o of r){const l=o.transform,h=t.data.field(o.field);s.set(o.field,RA(l,h,e))}return s}class iE extends Bc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class DA extends Bc{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OA{constructor(e,t,s,o){this.batchId=e,this.localWriteTime=t,this.baseMutations=s,this.mutations=o}applyToRemoteDocument(e,t){const s=t.mutationResults;for(let o=0;o<this.mutations.length;o++){const l=this.mutations[o];l.key.isEqual(e.key)&&NA(l,e,s[o])}}applyToLocalView(e,t){for(const s of this.baseMutations)s.key.isEqual(e.key)&&(t=nl(s,e,t,this.localWriteTime));for(const s of this.mutations)s.key.isEqual(e.key)&&(t=nl(s,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const s=Yv();return this.mutations.forEach((o=>{const l=e.get(o.key),h=l.overlayedDocument;let f=this.applyToLocalView(h,l.mutatedFields);f=t.has(o.key)?null:f;const g=nE(h,f);g!==null&&s.set(o.key,g),h.isValidDocument()||h.convertToNoDocument(Ie.min())})),s}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),xe())}isEqual(e){return this.batchId===e.batchId&&Oo(this.mutations,e.mutations,((t,s)=>Ly(t,s)))&&Oo(this.baseMutations,e.baseMutations,((t,s)=>Ly(t,s)))}}class Hf{constructor(e,t,s,o){this.batch=e,this.commitVersion=t,this.mutationResults=s,this.docVersions=o}static from(e,t,s){Ue(e.mutations.length===s.length,58842,{Ve:e.mutations.length,me:s.length});let o=(function(){return wA})();const l=e.mutations;for(let h=0;h<l.length;h++)o=o.insert(l[h].key,s[h].version);return new Hf(e,t,s,o)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VA{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bA{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var dt,Ve;function LA(r){switch(r){case H.OK:return Ee(64938);case H.CANCELLED:case H.UNKNOWN:case H.DEADLINE_EXCEEDED:case H.RESOURCE_EXHAUSTED:case H.INTERNAL:case H.UNAVAILABLE:case H.UNAUTHENTICATED:return!1;case H.INVALID_ARGUMENT:case H.NOT_FOUND:case H.ALREADY_EXISTS:case H.PERMISSION_DENIED:case H.FAILED_PRECONDITION:case H.ABORTED:case H.OUT_OF_RANGE:case H.UNIMPLEMENTED:case H.DATA_LOSS:return!0;default:return Ee(15467,{code:r})}}function sE(r){if(r===void 0)return $r("GRPC error has no .code"),H.UNKNOWN;switch(r){case dt.OK:return H.OK;case dt.CANCELLED:return H.CANCELLED;case dt.UNKNOWN:return H.UNKNOWN;case dt.DEADLINE_EXCEEDED:return H.DEADLINE_EXCEEDED;case dt.RESOURCE_EXHAUSTED:return H.RESOURCE_EXHAUSTED;case dt.INTERNAL:return H.INTERNAL;case dt.UNAVAILABLE:return H.UNAVAILABLE;case dt.UNAUTHENTICATED:return H.UNAUTHENTICATED;case dt.INVALID_ARGUMENT:return H.INVALID_ARGUMENT;case dt.NOT_FOUND:return H.NOT_FOUND;case dt.ALREADY_EXISTS:return H.ALREADY_EXISTS;case dt.PERMISSION_DENIED:return H.PERMISSION_DENIED;case dt.FAILED_PRECONDITION:return H.FAILED_PRECONDITION;case dt.ABORTED:return H.ABORTED;case dt.OUT_OF_RANGE:return H.OUT_OF_RANGE;case dt.UNIMPLEMENTED:return H.UNIMPLEMENTED;case dt.DATA_LOSS:return H.DATA_LOSS;default:return Ee(39323,{code:r})}}(Ve=dt||(dt={}))[Ve.OK=0]="OK",Ve[Ve.CANCELLED=1]="CANCELLED",Ve[Ve.UNKNOWN=2]="UNKNOWN",Ve[Ve.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ve[Ve.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ve[Ve.NOT_FOUND=5]="NOT_FOUND",Ve[Ve.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ve[Ve.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ve[Ve.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ve[Ve.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ve[Ve.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ve[Ve.ABORTED=10]="ABORTED",Ve[Ve.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ve[Ve.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ve[Ve.INTERNAL=13]="INTERNAL",Ve[Ve.UNAVAILABLE=14]="UNAVAILABLE",Ve[Ve.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MA=new Ii([4294967295,4294967295],0);function Fy(r){const e=Av().encode(r),t=new yv;return t.update(e),new Uint8Array(t.digest())}function Uy(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),s=e.getUint32(4,!0),o=e.getUint32(8,!0),l=e.getUint32(12,!0);return[new Ii([t,s],0),new Ii([o,l],0)]}class qf{constructor(e,t,s){if(this.bitmap=e,this.padding=t,this.hashCount=s,t<0||t>=8)throw new Ka(`Invalid padding: ${t}`);if(s<0)throw new Ka(`Invalid hash count: ${s}`);if(e.length>0&&this.hashCount===0)throw new Ka(`Invalid hash count: ${s}`);if(e.length===0&&t!==0)throw new Ka(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Ii.fromNumber(this.fe)}pe(e,t,s){let o=e.add(t.multiply(Ii.fromNumber(s)));return o.compare(MA)===1&&(o=new Ii([o.getBits(0),o.getBits(1)],0)),o.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=Fy(e),[s,o]=Uy(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(s,o,l);if(!this.ye(h))return!1}return!0}static create(e,t,s){const o=e%8==0?0:8-e%8,l=new Uint8Array(Math.ceil(e/8)),h=new qf(l,o,t);return s.forEach((f=>h.insert(f))),h}insert(e){if(this.fe===0)return;const t=Fy(e),[s,o]=Uy(t);for(let l=0;l<this.hashCount;l++){const h=this.pe(s,o,l);this.we(h)}}we(e){const t=Math.floor(e/8),s=e%8;this.bitmap[t]|=1<<s}}class Ka extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{constructor(e,t,s,o,l){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=s,this.documentUpdates=o,this.resolvedLimboDocuments=l}static createSynthesizedRemoteEventForCurrentChange(e,t,s){const o=new Map;return o.set(e,Tl.createSynthesizedTargetChangeForCurrentChange(e,t,s)),new $c(Ie.min(),o,new it(ke),Hr(),xe())}}class Tl{constructor(e,t,s,o,l){this.resumeToken=e,this.current=t,this.addedDocuments=s,this.modifiedDocuments=o,this.removedDocuments=l}static createSynthesizedTargetChangeForCurrentChange(e,t,s){return new Tl(s,t,xe(),xe(),xe())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc{constructor(e,t,s,o){this.Se=e,this.removedTargetIds=t,this.key=s,this.be=o}}class oE{constructor(e,t){this.targetId=e,this.De=t}}class aE{constructor(e,t,s=bt.EMPTY_BYTE_STRING,o=null){this.state=e,this.targetIds=t,this.resumeToken=s,this.cause=o}}class zy{constructor(){this.ve=0,this.Ce=By(),this.Fe=bt.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=xe(),t=xe(),s=xe();return this.Ce.forEach(((o,l)=>{switch(l){case 0:e=e.add(o);break;case 2:t=t.add(o);break;case 1:s=s.add(o);break;default:Ee(38017,{changeType:l})}})),new Tl(this.Fe,this.Me,e,t,s)}ke(){this.xe=!1,this.Ce=By()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Ue(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class jA{constructor(e){this.We=e,this.Ge=new Map,this.ze=Hr(),this.je=qu(),this.Je=qu(),this.He=new it(ke)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const s=this.tt(t);switch(e.state){case 0:this.nt(t)&&s.Be(e.resumeToken);break;case 1:s.Ue(),s.Oe||s.ke(),s.Be(e.resumeToken);break;case 2:s.Ue(),s.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(s.Ke(),s.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),s.Be(e.resumeToken));break;default:Ee(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((s,o)=>{this.nt(o)&&t(o)}))}it(e){const t=e.targetId,s=e.De.count,o=this.st(t);if(o){const l=o.target;if(tf(l))if(s===0){const h=new ge(l.path);this.Xe(t,h,Ht.newNoDocument(h,Ie.min()))}else Ue(s===1,20013,{expectedCount:s});else{const h=this.ot(t);if(h!==s){const f=this._t(e),g=f?this.ut(f,e,h):1;if(g!==0){this.rt(t);const _=g===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,_)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:s="",padding:o=0},hashCount:l=0}=t;let h,f;try{h=xi(s).toUint8Array()}catch(g){if(g instanceof Nv)return Ci("Decoding the base64 bloom filter in existence filter failed ("+g.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw g}try{f=new qf(h,o,l)}catch(g){return Ci(g instanceof Ka?"BloomFilter error: ":"Applying bloom filter failed: ",g),null}return f.fe===0?null:f}ut(e,t,s){return t.De.count===s-this.ht(e,t.targetId)?0:2}ht(e,t){const s=this.We.getRemoteKeysForTarget(t);let o=0;return s.forEach((l=>{const h=this.We.lt(),f=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;e.mightContain(f)||(this.Xe(t,l,null),o++)})),o}Pt(e){const t=new Map;this.Ge.forEach(((l,h)=>{const f=this.st(h);if(f){if(l.current&&tf(f.target)){const g=new ge(f.target.path);this.Tt(g).has(h)||this.It(h,g)||this.Xe(h,g,Ht.newNoDocument(g,e))}l.Ne&&(t.set(h,l.Le()),l.ke())}}));let s=xe();this.Je.forEach(((l,h)=>{let f=!0;h.forEachWhile((g=>{const _=this.st(g);return!_||_.purpose==="TargetPurposeLimboResolution"||(f=!1,!1)})),f&&(s=s.add(l))})),this.ze.forEach(((l,h)=>h.setReadTime(e)));const o=new $c(e,t,this.He,this.ze,s);return this.ze=Hr(),this.je=qu(),this.Je=qu(),this.He=new it(ke),o}Ze(e,t){if(!this.nt(e))return;const s=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,s),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,s){if(!this.nt(e))return;const o=this.tt(e);this.It(e,t)?o.qe(t,1):o.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),s&&(this.ze=this.ze.insert(t,s))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new zy,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new wt(ke),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new wt(ke),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||ne("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new zy),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function qu(){return new it(ge.comparator)}function By(){return new it(ge.comparator)}const FA={asc:"ASCENDING",desc:"DESCENDING"},UA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},zA={and:"AND",or:"OR"};class BA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function rf(r,e){return r.useProto3Json||Mc(e)?e:{value:e}}function Sc(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function lE(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function $A(r,e){return Sc(r,e.toTimestamp())}function pr(r){return Ue(!!r,49232),Ie.fromTimestamp((function(t){const s=Ni(t);return new Ye(s.seconds,s.nanos)})(r))}function Wf(r,e){return sf(r,e).canonicalString()}function sf(r,e){const t=(function(o){return new Ke(["projects",o.projectId,"databases",o.database])})(r).child("documents");return e===void 0?t:t.child(e)}function uE(r){const e=Ke.fromString(r);return Ue(pE(e),10190,{key:e.toString()}),e}function of(r,e){return Wf(r.databaseId,e.path)}function bd(r,e){const t=uE(e);if(t.get(1)!==r.databaseId.projectId)throw new ie(H.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new ie(H.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new ge(hE(t))}function cE(r,e){return Wf(r.databaseId,e)}function HA(r){const e=uE(r);return e.length===4?Ke.emptyPath():hE(e)}function af(r){return new Ke(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function hE(r){return Ue(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function $y(r,e,t){return{name:of(r,e),fields:t.value.mapValue.fields}}function qA(r,e){let t;if("targetChange"in e){e.targetChange;const s=(function(_){return _==="NO_CHANGE"?0:_==="ADD"?1:_==="REMOVE"?2:_==="CURRENT"?3:_==="RESET"?4:Ee(39313,{state:_})})(e.targetChange.targetChangeType||"NO_CHANGE"),o=e.targetChange.targetIds||[],l=(function(_,T){return _.useProto3Json?(Ue(T===void 0||typeof T=="string",58123),bt.fromBase64String(T||"")):(Ue(T===void 0||T instanceof Buffer||T instanceof Uint8Array,16193),bt.fromUint8Array(T||new Uint8Array))})(r,e.targetChange.resumeToken),h=e.targetChange.cause,f=h&&(function(_){const T=_.code===void 0?H.UNKNOWN:sE(_.code);return new ie(T,_.message||"")})(h);t=new aE(s,o,l,f||null)}else if("documentChange"in e){e.documentChange;const s=e.documentChange;s.document,s.document.name,s.document.updateTime;const o=bd(r,s.document.name),l=pr(s.document.updateTime),h=s.document.createTime?pr(s.document.createTime):Ie.min(),f=new Pn({mapValue:{fields:s.document.fields}}),g=Ht.newFoundDocument(o,l,h,f),_=s.targetIds||[],T=s.removedTargetIds||[];t=new rc(_,T,g.key,g)}else if("documentDelete"in e){e.documentDelete;const s=e.documentDelete;s.document;const o=bd(r,s.document),l=s.readTime?pr(s.readTime):Ie.min(),h=Ht.newNoDocument(o,l),f=s.removedTargetIds||[];t=new rc([],f,h.key,h)}else if("documentRemove"in e){e.documentRemove;const s=e.documentRemove;s.document;const o=bd(r,s.document),l=s.removedTargetIds||[];t=new rc([],l,o,null)}else{if(!("filter"in e))return Ee(11601,{At:e});{e.filter;const s=e.filter;s.targetId;const{count:o=0,unchangedNames:l}=s,h=new bA(o,l),f=s.targetId;t=new oE(f,h)}}return t}function WA(r,e){let t;if(e instanceof wl)t={update:$y(r,e.key,e.value)};else if(e instanceof iE)t={delete:of(r,e.key)};else if(e instanceof Rs)t={update:$y(r,e.key,e.data),updateMask:tR(e.fieldMask)};else{if(!(e instanceof DA))return Ee(16599,{Rt:e.type});t={verify:of(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((s=>(function(l,h){const f=h.transform;if(f instanceof Tc)return{fieldPath:h.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(f instanceof cl)return{fieldPath:h.field.canonicalString(),appendMissingElements:{values:f.elements}};if(f instanceof hl)return{fieldPath:h.field.canonicalString(),removeAllFromArray:{values:f.elements}};if(f instanceof Ic)return{fieldPath:h.field.canonicalString(),increment:f.Ee};throw Ee(20930,{transform:h.transform})})(0,s)))),e.precondition.isNone||(t.currentDocument=(function(o,l){return l.updateTime!==void 0?{updateTime:$A(o,l.updateTime)}:l.exists!==void 0?{exists:l.exists}:Ee(27497)})(r,e.precondition)),t}function KA(r,e){return r&&r.length>0?(Ue(e!==void 0,14353),r.map((t=>(function(o,l){let h=o.updateTime?pr(o.updateTime):pr(l);return h.isEqual(Ie.min())&&(h=pr(l)),new PA(h,o.transformResults||[])})(t,e)))):[]}function GA(r,e){return{documents:[cE(r,e.path)]}}function QA(r,e){const t={structuredQuery:{}},s=e.path;let o;e.collectionGroup!==null?(o=s,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(o=s.popLast(),t.structuredQuery.from=[{collectionId:s.lastSegment()}]),t.parent=cE(r,o);const l=(function(_){if(_.length!==0)return fE(Xn.create(_,"and"))})(e.filters);l&&(t.structuredQuery.where=l);const h=(function(_){if(_.length!==0)return _.map((T=>(function(C){return{field:Io(C.field),direction:JA(C.dir)}})(T)))})(e.orderBy);h&&(t.structuredQuery.orderBy=h);const f=rf(r,e.limit);return f!==null&&(t.structuredQuery.limit=f),e.startAt&&(t.structuredQuery.startAt=(function(_){return{before:_.inclusive,values:_.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(_){return{before:!_.inclusive,values:_.position}})(e.endAt)),{Vt:t,parent:o}}function YA(r){let e=HA(r.parent);const t=r.structuredQuery,s=t.from?t.from.length:0;let o=null;if(s>0){Ue(s===1,65062);const T=t.from[0];T.allDescendants?o=T.collectionId:e=e.child(T.collectionId)}let l=[];t.where&&(l=(function(A){const C=dE(A);return C instanceof Xn&&Uv(C)?C.getFilters():[C]})(t.where));let h=[];t.orderBy&&(h=(function(A){return A.map((C=>(function(W){return new Ec(So(W.field),(function(B){switch(B){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(W.direction))})(C)))})(t.orderBy));let f=null;t.limit&&(f=(function(A){let C;return C=typeof A=="object"?A.value:A,Mc(C)?null:C})(t.limit));let g=null;t.startAt&&(g=(function(A){const C=!!A.before,z=A.values||[];return new vc(z,C)})(t.startAt));let _=null;return t.endAt&&(_=(function(A){const C=!A.before,z=A.values||[];return new vc(z,C)})(t.endAt)),gA(e,o,h,l,f,"F",g,_)}function XA(r,e){const t=(function(o){switch(o){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Ee(28987,{purpose:o})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function dE(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const s=So(t.unaryFilter.field);return pt.create(s,"==",{doubleValue:NaN});case"IS_NULL":const o=So(t.unaryFilter.field);return pt.create(o,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const l=So(t.unaryFilter.field);return pt.create(l,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const h=So(t.unaryFilter.field);return pt.create(h,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Ee(61313);default:return Ee(60726)}})(r):r.fieldFilter!==void 0?(function(t){return pt.create(So(t.fieldFilter.field),(function(o){switch(o){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Ee(58110);default:return Ee(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return Xn.create(t.compositeFilter.filters.map((s=>dE(s))),(function(o){switch(o){case"AND":return"and";case"OR":return"or";default:return Ee(1026)}})(t.compositeFilter.op))})(r):Ee(30097,{filter:r})}function JA(r){return FA[r]}function ZA(r){return UA[r]}function eR(r){return zA[r]}function Io(r){return{fieldPath:r.canonicalString()}}function So(r){return Vt.fromServerFormat(r.fieldPath)}function fE(r){return r instanceof pt?(function(t){if(t.op==="=="){if(Ny(t.value))return{unaryFilter:{field:Io(t.field),op:"IS_NAN"}};if(Py(t.value))return{unaryFilter:{field:Io(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ny(t.value))return{unaryFilter:{field:Io(t.field),op:"IS_NOT_NAN"}};if(Py(t.value))return{unaryFilter:{field:Io(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Io(t.field),op:ZA(t.op),value:t.value}}})(r):r instanceof Xn?(function(t){const s=t.getFilters().map((o=>fE(o)));return s.length===1?s[0]:{compositeFilter:{op:eR(t.op),filters:s}}})(r):Ee(54877,{filter:r})}function tR(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function pE(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei{constructor(e,t,s,o,l=Ie.min(),h=Ie.min(),f=bt.EMPTY_BYTE_STRING,g=null){this.target=e,this.targetId=t,this.purpose=s,this.sequenceNumber=o,this.snapshotVersion=l,this.lastLimboFreeSnapshotVersion=h,this.resumeToken=f,this.expectedCount=g}withSequenceNumber(e){return new Ei(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ei(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ei(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ei(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nR{constructor(e){this.gt=e}}function rR(r){const e=YA({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?wc(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iR{constructor(){this.Dn=new sR}addToCollectionParentIndex(e,t){return this.Dn.add(t),q.resolve()}getCollectionParents(e,t){return q.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return q.resolve()}deleteFieldIndex(e,t){return q.resolve()}deleteAllFieldIndexes(e){return q.resolve()}createTargetIndexes(e,t){return q.resolve()}getDocumentsMatchingTarget(e,t){return q.resolve(null)}getIndexType(e,t){return q.resolve(0)}getFieldIndexes(e,t){return q.resolve([])}getNextCollectionGroupToUpdate(e){return q.resolve(null)}getMinOffset(e,t){return q.resolve(Pi.min())}getMinOffsetFromCollectionGroup(e,t){return q.resolve(Pi.min())}updateCollectionGroup(e,t,s){return q.resolve()}updateIndexEntries(e,t){return q.resolve()}}class sR{constructor(){this.index={}}add(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t]||new wt(Ke.comparator),l=!o.has(s);return this.index[t]=o.add(s),l}has(e){const t=e.lastSegment(),s=e.popLast(),o=this.index[t];return o&&o.has(s)}getEntries(e){return(this.index[e]||new wt(Ke.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hy={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},mE=41943040;class ln{static withCacheSize(e){return new ln(e,ln.DEFAULT_COLLECTION_PERCENTILE,ln.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,s){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ln.DEFAULT_COLLECTION_PERCENTILE=10,ln.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ln.DEFAULT=new ln(mE,ln.DEFAULT_COLLECTION_PERCENTILE,ln.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ln.DISABLED=new ln(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Lo(0)}static ur(){return new Lo(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qy="LruGarbageCollector",oR=1048576;function Wy([r,e],[t,s]){const o=ke(r,t);return o===0?ke(e,s):o}class aR{constructor(e){this.Tr=e,this.buffer=new wt(Wy),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const s=this.buffer.last();Wy(t,s)<0&&(this.buffer=this.buffer.delete(s).add(t))}}get maxValue(){return this.buffer.last()[0]}}class lR{constructor(e,t,s){this.garbageCollector=e,this.asyncQueue=t,this.localStore=s,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){ne(qy,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){$o(t)?ne(qy,"Ignoring IndexedDB error during garbage collection: ",t):await Bo(t)}await this.Rr(3e5)}))}}class uR{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((s=>Math.floor(t/100*s)))}nthSequenceNumber(e,t){if(t===0)return q.resolve(Lc.ue);const s=new aR(t);return this.Vr.forEachTarget(e,(o=>s.Er(o.sequenceNumber))).next((()=>this.Vr.gr(e,(o=>s.Er(o))))).next((()=>s.maxValue))}removeTargets(e,t,s){return this.Vr.removeTargets(e,t,s)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(ne("LruGarbageCollector","Garbage collection skipped; disabled"),q.resolve(Hy)):this.getCacheSize(e).next((s=>s<this.params.cacheSizeCollectionThreshold?(ne("LruGarbageCollector",`Garbage collection skipped; Cache size ${s} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Hy):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let s,o,l,h,f,g,_;const T=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((A=>(A>this.params.maximumSequenceNumbersToCollect?(ne("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${A}`),o=this.params.maximumSequenceNumbersToCollect):o=A,h=Date.now(),this.nthSequenceNumber(e,o)))).next((A=>(s=A,f=Date.now(),this.removeTargets(e,s,t)))).next((A=>(l=A,g=Date.now(),this.removeOrphanedDocuments(e,s)))).next((A=>(_=Date.now(),wo()<=Ne.DEBUG&&ne("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${h-T}ms
	Determined least recently used ${o} in `+(f-h)+`ms
	Removed ${l} targets in `+(g-f)+`ms
	Removed ${A} documents in `+(_-g)+`ms
Total Duration: ${_-T}ms`),q.resolve({didRun:!0,sequenceNumbersCollected:o,targetsRemoved:l,documentsRemoved:A}))))}}function cR(r,e){return new uR(r,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hR{constructor(){this.changes=new As((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ht.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const s=this.changes.get(t);return s!==void 0?q.resolve(s):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dR{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fR{constructor(e,t,s,o){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=s,this.indexManager=o}getDocument(e,t){let s=null;return this.documentOverlayCache.getOverlay(e,t).next((o=>(s=o,this.remoteDocumentCache.getEntry(e,t)))).next((o=>(s!==null&&nl(s.mutation,o,Yn.empty(),Ye.now()),o)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.getLocalViewOfDocuments(e,s,xe()).next((()=>s))))}getLocalViewOfDocuments(e,t,s=xe()){const o=fs();return this.populateOverlays(e,o,t).next((()=>this.computeViews(e,t,o,s).next((l=>{let h=Wa();return l.forEach(((f,g)=>{h=h.insert(f,g.overlayedDocument)})),h}))))}getOverlayedDocuments(e,t){const s=fs();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,xe())))}populateOverlays(e,t,s){const o=[];return s.forEach((l=>{t.has(l)||o.push(l)})),this.documentOverlayCache.getOverlays(e,o).next((l=>{l.forEach(((h,f)=>{t.set(h,f)}))}))}computeViews(e,t,s,o){let l=Hr();const h=tl(),f=(function(){return tl()})();return t.forEach(((g,_)=>{const T=s.get(_.key);o.has(_.key)&&(T===void 0||T.mutation instanceof Rs)?l=l.insert(_.key,_):T!==void 0?(h.set(_.key,T.mutation.getFieldMask()),nl(T.mutation,_,T.mutation.getFieldMask(),Ye.now())):h.set(_.key,Yn.empty())})),this.recalculateAndSaveOverlays(e,l).next((g=>(g.forEach(((_,T)=>h.set(_,T))),t.forEach(((_,T)=>{var A;return f.set(_,new dR(T,(A=h.get(_))!==null&&A!==void 0?A:null))})),f)))}recalculateAndSaveOverlays(e,t){const s=tl();let o=new it(((h,f)=>h-f)),l=xe();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((h=>{for(const f of h)f.keys().forEach((g=>{const _=t.get(g);if(_===null)return;let T=s.get(g)||Yn.empty();T=f.applyToLocalView(_,T),s.set(g,T);const A=(o.get(f.batchId)||xe()).add(g);o=o.insert(f.batchId,A)}))})).next((()=>{const h=[],f=o.getReverseIterator();for(;f.hasNext();){const g=f.getNext(),_=g.key,T=g.value,A=Yv();T.forEach((C=>{if(!l.has(C)){const z=nE(t.get(C),s.get(C));z!==null&&A.set(C,z),l=l.add(C)}})),h.push(this.documentOverlayCache.saveOverlays(e,_,A))}return q.waitFor(h)})).next((()=>s))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((s=>this.recalculateAndSaveOverlays(e,s)))}getDocumentsMatchingQuery(e,t,s,o){return(function(h){return ge.isDocumentKey(h.path)&&h.collectionGroup===null&&h.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):qv(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,s,o):this.getDocumentsMatchingCollectionQuery(e,t,s,o)}getNextDocuments(e,t,s,o){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,s,o).next((l=>{const h=o-l.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,s.largestBatchId,o-l.size):q.resolve(fs());let f=ol,g=l;return h.next((_=>q.forEach(_,((T,A)=>(f<A.largestBatchId&&(f=A.largestBatchId),l.get(T)?q.resolve():this.remoteDocumentCache.getEntry(e,T).next((C=>{g=g.insert(T,C)}))))).next((()=>this.populateOverlays(e,_,l))).next((()=>this.computeViews(e,g,_,xe()))).next((T=>({batchId:f,changes:Qv(T)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ge(t)).next((s=>{let o=Wa();return s.isFoundDocument()&&(o=o.insert(s.key,s)),o}))}getDocumentsMatchingCollectionGroupQuery(e,t,s,o){const l=t.collectionGroup;let h=Wa();return this.indexManager.getCollectionParents(e,l).next((f=>q.forEach(f,(g=>{const _=(function(A,C){return new El(C,null,A.explicitOrderBy.slice(),A.filters.slice(),A.limit,A.limitType,A.startAt,A.endAt)})(t,g.child(l));return this.getDocumentsMatchingCollectionQuery(e,_,s,o).next((T=>{T.forEach(((A,C)=>{h=h.insert(A,C)}))}))})).next((()=>h))))}getDocumentsMatchingCollectionQuery(e,t,s,o){let l;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,s.largestBatchId).next((h=>(l=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,s,l,o)))).next((h=>{l.forEach(((g,_)=>{const T=_.getKey();h.get(T)===null&&(h=h.insert(T,Ht.newInvalidDocument(T)))}));let f=Wa();return h.forEach(((g,_)=>{const T=l.get(g);T!==void 0&&nl(T.mutation,_,Yn.empty(),Ye.now()),Uc(t,_)&&(f=f.insert(g,_))})),f}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pR{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return q.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(o){return{id:o.id,version:o.version,createTime:pr(o.createTime)}})(t)),q.resolve()}getNamedQuery(e,t){return q.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(o){return{name:o.name,query:rR(o.bundledQuery),readTime:pr(o.readTime)}})(t)),q.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mR{constructor(){this.overlays=new it(ge.comparator),this.kr=new Map}getOverlay(e,t){return q.resolve(this.overlays.get(t))}getOverlays(e,t){const s=fs();return q.forEach(t,(o=>this.getOverlay(e,o).next((l=>{l!==null&&s.set(o,l)})))).next((()=>s))}saveOverlays(e,t,s){return s.forEach(((o,l)=>{this.wt(e,t,l)})),q.resolve()}removeOverlaysForBatchId(e,t,s){const o=this.kr.get(s);return o!==void 0&&(o.forEach((l=>this.overlays=this.overlays.remove(l))),this.kr.delete(s)),q.resolve()}getOverlaysForCollection(e,t,s){const o=fs(),l=t.length+1,h=new ge(t.child("")),f=this.overlays.getIteratorFrom(h);for(;f.hasNext();){const g=f.getNext().value,_=g.getKey();if(!t.isPrefixOf(_.path))break;_.path.length===l&&g.largestBatchId>s&&o.set(g.getKey(),g)}return q.resolve(o)}getOverlaysForCollectionGroup(e,t,s,o){let l=new it(((_,T)=>_-T));const h=this.overlays.getIterator();for(;h.hasNext();){const _=h.getNext().value;if(_.getKey().getCollectionGroup()===t&&_.largestBatchId>s){let T=l.get(_.largestBatchId);T===null&&(T=fs(),l=l.insert(_.largestBatchId,T)),T.set(_.getKey(),_)}}const f=fs(),g=l.getIterator();for(;g.hasNext()&&(g.getNext().value.forEach(((_,T)=>f.set(_,T))),!(f.size()>=o)););return q.resolve(f)}wt(e,t,s){const o=this.overlays.get(s.key);if(o!==null){const h=this.kr.get(o.largestBatchId).delete(s.key);this.kr.set(o.largestBatchId,h)}this.overlays=this.overlays.insert(s.key,new VA(t,s));let l=this.kr.get(t);l===void 0&&(l=xe(),this.kr.set(t,l)),this.kr.set(t,l.add(s.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gR{constructor(){this.sessionToken=bt.EMPTY_BYTE_STRING}getSessionToken(e){return q.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,q.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kf{constructor(){this.qr=new wt(kt.Qr),this.$r=new wt(kt.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const s=new kt(e,t);this.qr=this.qr.add(s),this.$r=this.$r.add(s)}Kr(e,t){e.forEach((s=>this.addReference(s,t)))}removeReference(e,t){this.Wr(new kt(e,t))}Gr(e,t){e.forEach((s=>this.removeReference(s,t)))}zr(e){const t=new ge(new Ke([])),s=new kt(t,e),o=new kt(t,e+1),l=[];return this.$r.forEachInRange([s,o],(h=>{this.Wr(h),l.push(h.key)})),l}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new ge(new Ke([])),s=new kt(t,e),o=new kt(t,e+1);let l=xe();return this.$r.forEachInRange([s,o],(h=>{l=l.add(h.key)})),l}containsKey(e){const t=new kt(e,0),s=this.qr.firstAfterOrEqual(t);return s!==null&&e.isEqual(s.key)}}class kt{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return ge.comparator(e.key,t.key)||ke(e.Hr,t.Hr)}static Ur(e,t){return ke(e.Hr,t.Hr)||ge.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yR{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new wt(kt.Qr)}checkEmpty(e){return q.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,s,o){const l=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const h=new OA(l,t,s,o);this.mutationQueue.push(h);for(const f of o)this.Yr=this.Yr.add(new kt(f.key,l)),this.indexManager.addToCollectionParentIndex(e,f.key.path.popLast());return q.resolve(h)}lookupMutationBatch(e,t){return q.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const s=t+1,o=this.Xr(s),l=o<0?0:o;return q.resolve(this.mutationQueue.length>l?this.mutationQueue[l]:null)}getHighestUnacknowledgedBatchId(){return q.resolve(this.mutationQueue.length===0?jf:this.er-1)}getAllMutationBatches(e){return q.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const s=new kt(t,0),o=new kt(t,Number.POSITIVE_INFINITY),l=[];return this.Yr.forEachInRange([s,o],(h=>{const f=this.Zr(h.Hr);l.push(f)})),q.resolve(l)}getAllMutationBatchesAffectingDocumentKeys(e,t){let s=new wt(ke);return t.forEach((o=>{const l=new kt(o,0),h=new kt(o,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([l,h],(f=>{s=s.add(f.Hr)}))})),q.resolve(this.ei(s))}getAllMutationBatchesAffectingQuery(e,t){const s=t.path,o=s.length+1;let l=s;ge.isDocumentKey(l)||(l=l.child(""));const h=new kt(new ge(l),0);let f=new wt(ke);return this.Yr.forEachWhile((g=>{const _=g.key.path;return!!s.isPrefixOf(_)&&(_.length===o&&(f=f.add(g.Hr)),!0)}),h),q.resolve(this.ei(f))}ei(e){const t=[];return e.forEach((s=>{const o=this.Zr(s);o!==null&&t.push(o)})),t}removeMutationBatch(e,t){Ue(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let s=this.Yr;return q.forEach(t.mutations,(o=>{const l=new kt(o.key,t.batchId);return s=s.delete(l),this.referenceDelegate.markPotentiallyOrphaned(e,o.key)})).next((()=>{this.Yr=s}))}rr(e){}containsKey(e,t){const s=new kt(t,0),o=this.Yr.firstAfterOrEqual(s);return q.resolve(t.isEqual(o&&o.key))}performConsistencyCheck(e){return this.mutationQueue.length,q.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _R{constructor(e){this.ni=e,this.docs=(function(){return new it(ge.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const s=t.key,o=this.docs.get(s),l=o?o.size:0,h=this.ni(t);return this.docs=this.docs.insert(s,{document:t.mutableCopy(),size:h}),this.size+=h-l,this.indexManager.addToCollectionParentIndex(e,s.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const s=this.docs.get(t);return q.resolve(s?s.document.mutableCopy():Ht.newInvalidDocument(t))}getEntries(e,t){let s=Hr();return t.forEach((o=>{const l=this.docs.get(o);s=s.insert(o,l?l.document.mutableCopy():Ht.newInvalidDocument(o))})),q.resolve(s)}getDocumentsMatchingQuery(e,t,s,o){let l=Hr();const h=t.path,f=new ge(h.child("__id-9223372036854775808__")),g=this.docs.getIteratorFrom(f);for(;g.hasNext();){const{key:_,value:{document:T}}=g.getNext();if(!h.isPrefixOf(_.path))break;_.path.length>h.length+1||GS(KS(T),s)<=0||(o.has(T.key)||Uc(t,T))&&(l=l.insert(T.key,T.mutableCopy()))}return q.resolve(l)}getAllFromCollectionGroup(e,t,s,o){Ee(9500)}ri(e,t){return q.forEach(this.docs,(s=>t(s)))}newChangeBuffer(e){return new vR(this)}getSize(e){return q.resolve(this.size)}}class vR extends hR{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((s,o)=>{o.isValidDocument()?t.push(this.Or.addEntry(e,o)):this.Or.removeEntry(s)})),q.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ER{constructor(e){this.persistence=e,this.ii=new As((t=>zf(t)),Bf),this.lastRemoteSnapshotVersion=Ie.min(),this.highestTargetId=0,this.si=0,this.oi=new Kf,this.targetCount=0,this._i=Lo.ar()}forEachTarget(e,t){return this.ii.forEach(((s,o)=>t(o))),q.resolve()}getLastRemoteSnapshotVersion(e){return q.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return q.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),q.resolve(this.highestTargetId)}setTargetsMetadata(e,t,s){return s&&(this.lastRemoteSnapshotVersion=s),t>this.si&&(this.si=t),q.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Lo(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,q.resolve()}updateTargetData(e,t){return this.hr(t),q.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,q.resolve()}removeTargets(e,t,s){let o=0;const l=[];return this.ii.forEach(((h,f)=>{f.sequenceNumber<=t&&s.get(f.targetId)===null&&(this.ii.delete(h),l.push(this.removeMatchingKeysForTargetId(e,f.targetId)),o++)})),q.waitFor(l).next((()=>o))}getTargetCount(e){return q.resolve(this.targetCount)}getTargetData(e,t){const s=this.ii.get(t)||null;return q.resolve(s)}addMatchingKeys(e,t,s){return this.oi.Kr(t,s),q.resolve()}removeMatchingKeys(e,t,s){this.oi.Gr(t,s);const o=this.persistence.referenceDelegate,l=[];return o&&t.forEach((h=>{l.push(o.markPotentiallyOrphaned(e,h))})),q.waitFor(l)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),q.resolve()}getMatchingKeysForTargetId(e,t){const s=this.oi.Jr(t);return q.resolve(s)}containsKey(e,t){return q.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gE{constructor(e,t){this.ai={},this.overlays={},this.ui=new Lc(0),this.ci=!1,this.ci=!0,this.li=new gR,this.referenceDelegate=e(this),this.hi=new ER(this),this.indexManager=new iR,this.remoteDocumentCache=(function(o){return new _R(o)})((s=>this.referenceDelegate.Pi(s))),this.serializer=new nR(t),this.Ti=new pR(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new mR,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let s=this.ai[e.toKey()];return s||(s=new yR(t,this.referenceDelegate),this.ai[e.toKey()]=s),s}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,s){ne("MemoryPersistence","Starting transaction:",e);const o=new wR(this.ui.next());return this.referenceDelegate.Ii(),s(o).next((l=>this.referenceDelegate.di(o).next((()=>l)))).toPromise().then((l=>(o.raiseOnCommittedEvent(),l)))}Ei(e,t){return q.or(Object.values(this.ai).map((s=>()=>s.containsKey(e,t))))}}class wR extends YS{constructor(e){super(),this.currentSequenceNumber=e}}class Gf{constructor(e){this.persistence=e,this.Ai=new Kf,this.Ri=null}static Vi(e){return new Gf(e)}get mi(){if(this.Ri)return this.Ri;throw Ee(60996)}addReference(e,t,s){return this.Ai.addReference(s,t),this.mi.delete(s.toString()),q.resolve()}removeReference(e,t,s){return this.Ai.removeReference(s,t),this.mi.add(s.toString()),q.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),q.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((o=>this.mi.add(o.toString())));const s=this.persistence.getTargetCache();return s.getMatchingKeysForTargetId(e,t.targetId).next((o=>{o.forEach((l=>this.mi.add(l.toString())))})).next((()=>s.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return q.forEach(this.mi,(s=>{const o=ge.fromPath(s);return this.fi(e,o).next((l=>{l||t.removeEntry(o,Ie.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((s=>{s?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return q.or([()=>q.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Ac{constructor(e,t){this.persistence=e,this.gi=new As((s=>ZS(s.path)),((s,o)=>s.isEqual(o))),this.garbageCollector=cR(this,t)}static Vi(e,t){return new Ac(e,t)}Ii(){}di(e){return q.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((s=>t.next((o=>s+o))))}yr(e){let t=0;return this.gr(e,(s=>{t++})).next((()=>t))}gr(e,t){return q.forEach(this.gi,((s,o)=>this.Sr(e,s,o).next((l=>l?q.resolve():t(o)))))}removeTargets(e,t,s){return this.persistence.getTargetCache().removeTargets(e,t,s)}removeOrphanedDocuments(e,t){let s=0;const o=this.persistence.getRemoteDocumentCache(),l=o.newChangeBuffer();return o.ri(e,(h=>this.Sr(e,h,t).next((f=>{f||(s++,l.removeEntry(h,Ie.min()))})))).next((()=>l.apply(e))).next((()=>s))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),q.resolve()}removeTarget(e,t){const s=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,s)}addReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),q.resolve()}removeReference(e,t,s){return this.gi.set(s,e.currentSequenceNumber),q.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),q.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ec(e.data.value)),t}Sr(e,t,s){return q.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const o=this.gi.get(t);return q.resolve(o!==void 0&&o>s)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qf{constructor(e,t,s,o){this.targetId=e,this.fromCache=t,this.Is=s,this.ds=o}static Es(e,t){let s=xe(),o=xe();for(const l of t.docChanges)switch(l.type){case 0:s=s.add(l.doc.key);break;case 1:o=o.add(l.doc.key)}return new Qf(e,t.fromCache,s,o)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TR{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IR{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return z0()?8:XS(qt())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,s,o){const l={result:null};return this.ps(e,t).next((h=>{l.result=h})).next((()=>{if(!l.result)return this.ys(e,t,o,s).next((h=>{l.result=h}))})).next((()=>{if(l.result)return;const h=new TR;return this.ws(e,t,h).next((f=>{if(l.result=f,this.Rs)return this.Ss(e,t,h,f.size)}))})).next((()=>l.result))}Ss(e,t,s,o){return s.documentReadCount<this.Vs?(wo()<=Ne.DEBUG&&ne("QueryEngine","SDK will not create cache indexes for query:",To(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),q.resolve()):(wo()<=Ne.DEBUG&&ne("QueryEngine","Query:",To(t),"scans",s.documentReadCount,"local documents and returns",o,"documents as results."),s.documentReadCount>this.fs*o?(wo()<=Ne.DEBUG&&ne("QueryEngine","The SDK decides to create cache indexes for query:",To(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,fr(t))):q.resolve())}ps(e,t){if(Vy(t))return q.resolve(null);let s=fr(t);return this.indexManager.getIndexType(e,s).next((o=>o===0?null:(t.limit!==null&&o===1&&(t=wc(t,null,"F"),s=fr(t)),this.indexManager.getDocumentsMatchingTarget(e,s).next((l=>{const h=xe(...l);return this.gs.getDocuments(e,h).next((f=>this.indexManager.getMinOffset(e,s).next((g=>{const _=this.bs(t,f);return this.Ds(t,_,h,g.readTime)?this.ps(e,wc(t,null,"F")):this.vs(e,_,t,g)}))))})))))}ys(e,t,s,o){return Vy(t)||o.isEqual(Ie.min())?q.resolve(null):this.gs.getDocuments(e,s).next((l=>{const h=this.bs(t,l);return this.Ds(t,h,s,o)?q.resolve(null):(wo()<=Ne.DEBUG&&ne("QueryEngine","Re-using previous result from %s to execute query: %s",o.toString(),To(t)),this.vs(e,h,t,WS(o,ol)).next((f=>f)))}))}bs(e,t){let s=new wt(Kv(e));return t.forEach(((o,l)=>{Uc(e,l)&&(s=s.add(l))})),s}Ds(e,t,s,o){if(e.limit===null)return!1;if(s.size!==t.size)return!0;const l=e.limitType==="F"?t.last():t.first();return!!l&&(l.hasPendingWrites||l.version.compareTo(o)>0)}ws(e,t,s){return wo()<=Ne.DEBUG&&ne("QueryEngine","Using full collection scan to execute query:",To(t)),this.gs.getDocumentsMatchingQuery(e,t,Pi.min(),s)}vs(e,t,s,o){return this.gs.getDocumentsMatchingQuery(e,s,o).next((l=>(t.forEach((h=>{l=l.insert(h.key,h)})),l)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yf="LocalStore",SR=3e8;class AR{constructor(e,t,s,o){this.persistence=e,this.Cs=t,this.serializer=o,this.Fs=new it(ke),this.Ms=new As((l=>zf(l)),Bf),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(s)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new fR(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function RR(r,e,t,s){return new AR(r,e,t,s)}async function yE(r,e){const t=Se(r);return await t.persistence.runTransaction("Handle user change","readonly",(s=>{let o;return t.mutationQueue.getAllMutationBatches(s).next((l=>(o=l,t.Ns(e),t.mutationQueue.getAllMutationBatches(s)))).next((l=>{const h=[],f=[];let g=xe();for(const _ of o){h.push(_.batchId);for(const T of _.mutations)g=g.add(T.key)}for(const _ of l){f.push(_.batchId);for(const T of _.mutations)g=g.add(T.key)}return t.localDocuments.getDocuments(s,g).next((_=>({Bs:_,removedBatchIds:h,addedBatchIds:f})))}))}))}function kR(r,e){const t=Se(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(s=>{const o=e.batch.keys(),l=t.Os.newChangeBuffer({trackRemovals:!0});return(function(f,g,_,T){const A=_.batch,C=A.keys();let z=q.resolve();return C.forEach((W=>{z=z.next((()=>T.getEntry(g,W))).next((Y=>{const B=_.docVersions.get(W);Ue(B!==null,48541),Y.version.compareTo(B)<0&&(A.applyToRemoteDocument(Y,_),Y.isValidDocument()&&(Y.setReadTime(_.commitVersion),T.addEntry(Y)))}))})),z.next((()=>f.mutationQueue.removeMutationBatch(g,A)))})(t,s,e,l).next((()=>l.apply(s))).next((()=>t.mutationQueue.performConsistencyCheck(s))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(s,o,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s,(function(f){let g=xe();for(let _=0;_<f.mutationResults.length;++_)f.mutationResults[_].transformResults.length>0&&(g=g.add(f.batch.mutations[_].key));return g})(e)))).next((()=>t.localDocuments.getDocuments(s,o)))}))}function _E(r){const e=Se(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function CR(r,e){const t=Se(r),s=e.snapshotVersion;let o=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(l=>{const h=t.Os.newChangeBuffer({trackRemovals:!0});o=t.Fs;const f=[];e.targetChanges.forEach(((T,A)=>{const C=o.get(A);if(!C)return;f.push(t.hi.removeMatchingKeys(l,T.removedDocuments,A).next((()=>t.hi.addMatchingKeys(l,T.addedDocuments,A))));let z=C.withSequenceNumber(l.currentSequenceNumber);e.targetMismatches.get(A)!==null?z=z.withResumeToken(bt.EMPTY_BYTE_STRING,Ie.min()).withLastLimboFreeSnapshotVersion(Ie.min()):T.resumeToken.approximateByteSize()>0&&(z=z.withResumeToken(T.resumeToken,s)),o=o.insert(A,z),(function(Y,B,ve){return Y.resumeToken.approximateByteSize()===0||B.snapshotVersion.toMicroseconds()-Y.snapshotVersion.toMicroseconds()>=SR?!0:ve.addedDocuments.size+ve.modifiedDocuments.size+ve.removedDocuments.size>0})(C,z,T)&&f.push(t.hi.updateTargetData(l,z))}));let g=Hr(),_=xe();if(e.documentUpdates.forEach((T=>{e.resolvedLimboDocuments.has(T)&&f.push(t.persistence.referenceDelegate.updateLimboDocument(l,T))})),f.push(PR(l,h,e.documentUpdates).next((T=>{g=T.Ls,_=T.ks}))),!s.isEqual(Ie.min())){const T=t.hi.getLastRemoteSnapshotVersion(l).next((A=>t.hi.setTargetsMetadata(l,l.currentSequenceNumber,s)));f.push(T)}return q.waitFor(f).next((()=>h.apply(l))).next((()=>t.localDocuments.getLocalViewOfDocuments(l,g,_))).next((()=>g))})).then((l=>(t.Fs=o,l)))}function PR(r,e,t){let s=xe(),o=xe();return t.forEach((l=>s=s.add(l))),e.getEntries(r,s).next((l=>{let h=Hr();return t.forEach(((f,g)=>{const _=l.get(f);g.isFoundDocument()!==_.isFoundDocument()&&(o=o.add(f)),g.isNoDocument()&&g.version.isEqual(Ie.min())?(e.removeEntry(f,g.readTime),h=h.insert(f,g)):!_.isValidDocument()||g.version.compareTo(_.version)>0||g.version.compareTo(_.version)===0&&_.hasPendingWrites?(e.addEntry(g),h=h.insert(f,g)):ne(Yf,"Ignoring outdated watch update for ",f,". Current version:",_.version," Watch version:",g.version)})),{Ls:h,ks:o}}))}function NR(r,e){const t=Se(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(s=>(e===void 0&&(e=jf),t.mutationQueue.getNextMutationBatchAfterBatchId(s,e))))}function xR(r,e){const t=Se(r);return t.persistence.runTransaction("Allocate target","readwrite",(s=>{let o;return t.hi.getTargetData(s,e).next((l=>l?(o=l,q.resolve(o)):t.hi.allocateTargetId(s).next((h=>(o=new Ei(e,h,"TargetPurposeListen",s.currentSequenceNumber),t.hi.addTargetData(s,o).next((()=>o)))))))})).then((s=>{const o=t.Fs.get(s.targetId);return(o===null||s.snapshotVersion.compareTo(o.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(s.targetId,s),t.Ms.set(e,s.targetId)),s}))}async function lf(r,e,t){const s=Se(r),o=s.Fs.get(e),l=t?"readwrite":"readwrite-primary";try{t||await s.persistence.runTransaction("Release target",l,(h=>s.persistence.referenceDelegate.removeTarget(h,o)))}catch(h){if(!$o(h))throw h;ne(Yf,`Failed to update sequence numbers for target ${e}: ${h}`)}s.Fs=s.Fs.remove(e),s.Ms.delete(o.target)}function Ky(r,e,t){const s=Se(r);let o=Ie.min(),l=xe();return s.persistence.runTransaction("Execute query","readwrite",(h=>(function(g,_,T){const A=Se(g),C=A.Ms.get(T);return C!==void 0?q.resolve(A.Fs.get(C)):A.hi.getTargetData(_,T)})(s,h,fr(e)).next((f=>{if(f)return o=f.lastLimboFreeSnapshotVersion,s.hi.getMatchingKeysForTargetId(h,f.targetId).next((g=>{l=g}))})).next((()=>s.Cs.getDocumentsMatchingQuery(h,e,t?o:Ie.min(),t?l:xe()))).next((f=>(DR(s,_A(e),f),{documents:f,qs:l})))))}function DR(r,e,t){let s=r.xs.get(e)||Ie.min();t.forEach(((o,l)=>{l.readTime.compareTo(s)>0&&(s=l.readTime)})),r.xs.set(e,s)}class Gy{constructor(){this.activeTargetIds=SA()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class OR{constructor(){this.Fo=new Gy,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,s){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,s){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Gy,Promise.resolve()}handleUserChange(e,t,s){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VR{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qy="ConnectivityMonitor";class Yy{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){ne(Qy,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){ne(Qy,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wu=null;function uf(){return Wu===null?Wu=(function(){return 268435456+Math.round(2147483648*Math.random())})():Wu++,"0x"+Wu.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ld="RestConnection",bR={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class LR{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),o=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${s}/databases/${o}`,this.Ko=this.databaseId.database===yc?`project_id=${s}`:`project_id=${s}&database_id=${o}`}Wo(e,t,s,o,l){const h=uf(),f=this.Go(e,t.toUriEncodedString());ne(Ld,`Sending RPC '${e}' ${h}:`,f,s);const g={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(g,o,l);const{host:_}=new URL(f),T=bi(_);return this.jo(e,f,g,s,T).then((A=>(ne(Ld,`Received RPC '${e}' ${h}: `,A),A)),(A=>{throw Ci(Ld,`RPC '${e}' ${h} failed with error: `,A,"url: ",f,"request:",s),A}))}Jo(e,t,s,o,l,h){return this.Wo(e,t,s,o,l)}zo(e,t,s){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+zo})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((o,l)=>e[l]=o)),s&&s.headers.forEach(((o,l)=>e[l]=o))}Go(e,t){const s=bR[e];return`${this.$o}/v1/${t}:${s}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MR{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt="WebChannelConnection";class jR extends LR{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,s,o,l){const h=uf();return new Promise(((f,g)=>{const _=new _v;_.setWithCredentials(!0),_.listenOnce(vv.COMPLETE,(()=>{try{switch(_.getLastErrorCode()){case Zu.NO_ERROR:const A=_.getResponseJson();ne(Bt,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(A)),f(A);break;case Zu.TIMEOUT:ne(Bt,`RPC '${e}' ${h} timed out`),g(new ie(H.DEADLINE_EXCEEDED,"Request time out"));break;case Zu.HTTP_ERROR:const C=_.getStatus();if(ne(Bt,`RPC '${e}' ${h} failed with status:`,C,"response text:",_.getResponseText()),C>0){let z=_.getResponseJson();Array.isArray(z)&&(z=z[0]);const W=z==null?void 0:z.error;if(W&&W.status&&W.message){const Y=(function(ve){const fe=ve.toLowerCase().replace(/_/g,"-");return Object.values(H).indexOf(fe)>=0?fe:H.UNKNOWN})(W.status);g(new ie(Y,W.message))}else g(new ie(H.UNKNOWN,"Server responded with status "+_.getStatus()))}else g(new ie(H.UNAVAILABLE,"Connection failed."));break;default:Ee(9055,{c_:e,streamId:h,l_:_.getLastErrorCode(),h_:_.getLastError()})}}finally{ne(Bt,`RPC '${e}' ${h} completed.`)}}));const T=JSON.stringify(o);ne(Bt,`RPC '${e}' ${h} sending request:`,o),_.send(t,"POST",T,s,15)}))}P_(e,t,s){const o=uf(),l=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],h=Tv(),f=wv(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},_=this.longPollingOptions.timeoutSeconds;_!==void 0&&(g.longPollingTimeout=Math.round(1e3*_)),this.useFetchStreams&&(g.useFetchStreams=!0),this.zo(g.initMessageHeaders,t,s),g.encodeInitMessageHeaders=!0;const T=l.join("");ne(Bt,`Creating RPC '${e}' stream ${o}: ${T}`,g);const A=h.createWebChannel(T,g);this.T_(A);let C=!1,z=!1;const W=new MR({Ho:B=>{z?ne(Bt,`Not sending because RPC '${e}' stream ${o} is closed:`,B):(C||(ne(Bt,`Opening RPC '${e}' stream ${o} transport.`),A.open(),C=!0),ne(Bt,`RPC '${e}' stream ${o} sending:`,B),A.send(B))},Yo:()=>A.close()}),Y=(B,ve,fe)=>{B.listen(ve,(ce=>{try{fe(ce)}catch(pe){setTimeout((()=>{throw pe}),0)}}))};return Y(A,qa.EventType.OPEN,(()=>{z||(ne(Bt,`RPC '${e}' stream ${o} transport opened.`),W.s_())})),Y(A,qa.EventType.CLOSE,(()=>{z||(z=!0,ne(Bt,`RPC '${e}' stream ${o} transport closed`),W.__(),this.I_(A))})),Y(A,qa.EventType.ERROR,(B=>{z||(z=!0,Ci(Bt,`RPC '${e}' stream ${o} transport errored. Name:`,B.name,"Message:",B.message),W.__(new ie(H.UNAVAILABLE,"The operation could not be completed")))})),Y(A,qa.EventType.MESSAGE,(B=>{var ve;if(!z){const fe=B.data[0];Ue(!!fe,16349);const ce=fe,pe=(ce==null?void 0:ce.error)||((ve=ce[0])===null||ve===void 0?void 0:ve.error);if(pe){ne(Bt,`RPC '${e}' stream ${o} received error:`,pe);const be=pe.status;let Te=(function(k){const x=dt[k];if(x!==void 0)return sE(x)})(be),P=pe.message;Te===void 0&&(Te=H.INTERNAL,P="Unknown error status: "+be+" with message "+pe.message),z=!0,W.__(new ie(Te,P)),A.close()}else ne(Bt,`RPC '${e}' stream ${o} received:`,fe),W.a_(fe)}})),Y(f,Ev.STAT_EVENT,(B=>{B.stat===Yd.PROXY?ne(Bt,`RPC '${e}' stream ${o} detected buffering proxy`):B.stat===Yd.NOPROXY&&ne(Bt,`RPC '${e}' stream ${o} detected no buffering proxy`)})),setTimeout((()=>{W.o_()}),0),W}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function Md(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hc(r){return new BA(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vE{constructor(e,t,s=1e3,o=1.5,l=6e4){this.Fi=e,this.timerId=t,this.d_=s,this.E_=o,this.A_=l,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),s=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-s);o>0&&ne("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xy="PersistentStream";class EE{constructor(e,t,s,o,l,h,f,g){this.Fi=e,this.w_=s,this.S_=o,this.connection=l,this.authCredentialsProvider=h,this.appCheckCredentialsProvider=f,this.listener=g,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new vE(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===H.RESOURCE_EXHAUSTED?($r(t.toString()),$r("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===H.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([s,o])=>{this.b_===t&&this.W_(s,o)}),(s=>{e((()=>{const o=new ie(H.UNKNOWN,"Fetching auth token failed: "+s.message);return this.G_(o)}))}))}W_(e,t){const s=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{s((()=>this.listener.Zo()))})),this.stream.e_((()=>{s((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((o=>{s((()=>this.G_(o)))})),this.stream.onMessage((o=>{s((()=>++this.C_==1?this.j_(o):this.onNext(o)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return ne(Xy,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(ne(Xy,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class FR extends EE{constructor(e,t,s,o,l,h){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,s,o,h),this.serializer=l}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=qA(this.serializer,e),s=(function(l){if(!("targetChange"in l))return Ie.min();const h=l.targetChange;return h.targetIds&&h.targetIds.length?Ie.min():h.readTime?pr(h.readTime):Ie.min()})(e);return this.listener.J_(t,s)}H_(e){const t={};t.database=af(this.serializer),t.addTarget=(function(l,h){let f;const g=h.target;if(f=tf(g)?{documents:GA(l,g)}:{query:QA(l,g).Vt},f.targetId=h.targetId,h.resumeToken.approximateByteSize()>0){f.resumeToken=lE(l,h.resumeToken);const _=rf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}else if(h.snapshotVersion.compareTo(Ie.min())>0){f.readTime=Sc(l,h.snapshotVersion.toTimestamp());const _=rf(l,h.expectedCount);_!==null&&(f.expectedCount=_)}return f})(this.serializer,e);const s=XA(this.serializer,e);s&&(t.labels=s),this.k_(t)}Y_(e){const t={};t.database=af(this.serializer),t.removeTarget=e,this.k_(t)}}class UR extends EE{constructor(e,t,s,o,l,h){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,s,o,h),this.serializer=l}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Ue(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Ue(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Ue(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=KA(e.writeResults,e.commitTime),s=pr(e.commitTime);return this.listener.ta(s,t)}na(){const e={};e.database=af(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((s=>WA(this.serializer,s)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zR{}class BR extends zR{constructor(e,t,s,o){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=s,this.serializer=o,this.ra=!1}ia(){if(this.ra)throw new ie(H.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,s,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([l,h])=>this.connection.Wo(e,sf(t,s),o,l,h))).catch((l=>{throw l.name==="FirebaseError"?(l.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),l):new ie(H.UNKNOWN,l.toString())}))}Jo(e,t,s,o,l){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([h,f])=>this.connection.Jo(e,sf(t,s),o,h,f,l))).catch((h=>{throw h.name==="FirebaseError"?(h.code===H.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),h):new ie(H.UNKNOWN,h.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class $R{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?($r(t),this._a=!1):ne("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ws="RemoteStore";class HR{constructor(e,t,s,o,l){this.localStore=e,this.datastore=t,this.asyncQueue=s,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=l,this.Ea.xo((h=>{s.enqueueAndForget((async()=>{ks(this)&&(ne(ws,"Restarting streams for network reachability change."),await(async function(g){const _=Se(g);_.Ia.add(4),await Il(_),_.Aa.set("Unknown"),_.Ia.delete(4),await qc(_)})(this))}))})),this.Aa=new $R(s,o)}}async function qc(r){if(ks(r))for(const e of r.da)await e(!0)}async function Il(r){for(const e of r.da)await e(!1)}function wE(r,e){const t=Se(r);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),ep(t)?Zf(t):Ho(t).x_()&&Jf(t,e))}function Xf(r,e){const t=Se(r),s=Ho(t);t.Ta.delete(e),s.x_()&&TE(t,e),t.Ta.size===0&&(s.x_()?s.B_():ks(t)&&t.Aa.set("Unknown"))}function Jf(r,e){if(r.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Ie.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Ho(r).H_(e)}function TE(r,e){r.Ra.$e(e),Ho(r).Y_(e)}function Zf(r){r.Ra=new jA({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>r.Ta.get(e)||null,lt:()=>r.datastore.serializer.databaseId}),Ho(r).start(),r.Aa.aa()}function ep(r){return ks(r)&&!Ho(r).M_()&&r.Ta.size>0}function ks(r){return Se(r).Ia.size===0}function IE(r){r.Ra=void 0}async function qR(r){r.Aa.set("Online")}async function WR(r){r.Ta.forEach(((e,t)=>{Jf(r,e)}))}async function KR(r,e){IE(r),ep(r)?(r.Aa.la(e),Zf(r)):r.Aa.set("Unknown")}async function GR(r,e,t){if(r.Aa.set("Online"),e instanceof aE&&e.state===2&&e.cause)try{await(async function(o,l){const h=l.cause;for(const f of l.targetIds)o.Ta.has(f)&&(await o.remoteSyncer.rejectListen(f,h),o.Ta.delete(f),o.Ra.removeTarget(f))})(r,e)}catch(s){ne(ws,"Failed to remove targets %s: %s ",e.targetIds.join(","),s),await Rc(r,s)}else if(e instanceof rc?r.Ra.Ye(e):e instanceof oE?r.Ra.it(e):r.Ra.et(e),!t.isEqual(Ie.min()))try{const s=await _E(r.localStore);t.compareTo(s)>=0&&await(function(l,h){const f=l.Ra.Pt(h);return f.targetChanges.forEach(((g,_)=>{if(g.resumeToken.approximateByteSize()>0){const T=l.Ta.get(_);T&&l.Ta.set(_,T.withResumeToken(g.resumeToken,h))}})),f.targetMismatches.forEach(((g,_)=>{const T=l.Ta.get(g);if(!T)return;l.Ta.set(g,T.withResumeToken(bt.EMPTY_BYTE_STRING,T.snapshotVersion)),TE(l,g);const A=new Ei(T.target,g,_,T.sequenceNumber);Jf(l,A)})),l.remoteSyncer.applyRemoteEvent(f)})(r,t)}catch(s){ne(ws,"Failed to raise snapshot:",s),await Rc(r,s)}}async function Rc(r,e,t){if(!$o(e))throw e;r.Ia.add(1),await Il(r),r.Aa.set("Offline"),t||(t=()=>_E(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{ne(ws,"Retrying IndexedDB access"),await t(),r.Ia.delete(1),await qc(r)}))}function SE(r,e){return e().catch((t=>Rc(r,t,e)))}async function Wc(r){const e=Se(r),t=Oi(e);let s=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:jf;for(;QR(e);)try{const o=await NR(e.localStore,s);if(o===null){e.Pa.length===0&&t.B_();break}s=o.batchId,YR(e,o)}catch(o){await Rc(e,o)}AE(e)&&RE(e)}function QR(r){return ks(r)&&r.Pa.length<10}function YR(r,e){r.Pa.push(e);const t=Oi(r);t.x_()&&t.Z_&&t.X_(e.mutations)}function AE(r){return ks(r)&&!Oi(r).M_()&&r.Pa.length>0}function RE(r){Oi(r).start()}async function XR(r){Oi(r).na()}async function JR(r){const e=Oi(r);for(const t of r.Pa)e.X_(t.mutations)}async function ZR(r,e,t){const s=r.Pa.shift(),o=Hf.from(s,e,t);await SE(r,(()=>r.remoteSyncer.applySuccessfulWrite(o))),await Wc(r)}async function ek(r,e){e&&Oi(r).Z_&&await(async function(s,o){if((function(h){return LA(h)&&h!==H.ABORTED})(o.code)){const l=s.Pa.shift();Oi(s).N_(),await SE(s,(()=>s.remoteSyncer.rejectFailedWrite(l.batchId,o))),await Wc(s)}})(r,e),AE(r)&&RE(r)}async function Jy(r,e){const t=Se(r);t.asyncQueue.verifyOperationInProgress(),ne(ws,"RemoteStore received new credentials");const s=ks(t);t.Ia.add(3),await Il(t),s&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await qc(t)}async function tk(r,e){const t=Se(r);e?(t.Ia.delete(2),await qc(t)):e||(t.Ia.add(2),await Il(t),t.Aa.set("Unknown"))}function Ho(r){return r.Va||(r.Va=(function(t,s,o){const l=Se(t);return l.ia(),new FR(s,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:qR.bind(null,r),e_:WR.bind(null,r),n_:KR.bind(null,r),J_:GR.bind(null,r)}),r.da.push((async e=>{e?(r.Va.N_(),ep(r)?Zf(r):r.Aa.set("Unknown")):(await r.Va.stop(),IE(r))}))),r.Va}function Oi(r){return r.ma||(r.ma=(function(t,s,o){const l=Se(t);return l.ia(),new UR(s,l.connection,l.authCredentials,l.appCheckCredentials,l.serializer,o)})(r.datastore,r.asyncQueue,{Zo:()=>Promise.resolve(),e_:XR.bind(null,r),n_:ek.bind(null,r),ea:JR.bind(null,r),ta:ZR.bind(null,r)}),r.da.push((async e=>{e?(r.ma.N_(),await Wc(r)):(await r.ma.stop(),r.Pa.length>0&&(ne(ws,`Stopping write stream with ${r.Pa.length} pending writes`),r.Pa=[]))}))),r.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp{constructor(e,t,s,o,l){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=o,this.removalCallback=l,this.deferred=new Si,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,o,l){const h=Date.now()+s,f=new tp(e,t,h,o,l);return f.start(s),f}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new ie(H.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function np(r,e){if($r("AsyncQueue",`${e}: ${r}`),$o(r))return new ie(H.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No{static emptySet(e){return new No(e.comparator)}constructor(e){this.comparator=e?(t,s)=>e(t,s)||ge.comparator(t.key,s.key):(t,s)=>ge.comparator(t.key,s.key),this.keyedMap=Wa(),this.sortedSet=new it(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,s)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof No)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),s=e.sortedSet.getIterator();for(;t.hasNext();){const o=t.getNext().key,l=s.getNext().key;if(!o.isEqual(l))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const s=new No;return s.comparator=this.comparator,s.keyedMap=e,s.sortedSet=t,s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zy{constructor(){this.fa=new it(ge.comparator)}track(e){const t=e.doc.key,s=this.fa.get(t);s?e.type!==0&&s.type===3?this.fa=this.fa.insert(t,e):e.type===3&&s.type!==1?this.fa=this.fa.insert(t,{type:s.type,doc:e.doc}):e.type===2&&s.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&s.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&s.type===0?this.fa=this.fa.remove(t):e.type===1&&s.type===2?this.fa=this.fa.insert(t,{type:1,doc:s.doc}):e.type===0&&s.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):Ee(63341,{At:e,ga:s}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,s)=>{e.push(s)})),e}}class Mo{constructor(e,t,s,o,l,h,f,g,_){this.query=e,this.docs=t,this.oldDocs=s,this.docChanges=o,this.mutatedKeys=l,this.fromCache=h,this.syncStateChanged=f,this.excludesMetadataChanges=g,this.hasCachedResults=_}static fromInitialDocuments(e,t,s,o,l){const h=[];return t.forEach((f=>{h.push({type:0,doc:f})})),new Mo(e,t,No.emptySet(t),h,s,o,!0,!1,l)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Fc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,s=e.docChanges;if(t.length!==s.length)return!1;for(let o=0;o<t.length;o++)if(t[o].type!==s[o].type||!t[o].doc.isEqual(s[o].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nk{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class rk{constructor(){this.queries=e_(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,s){const o=Se(t),l=o.queries;o.queries=e_(),l.forEach(((h,f)=>{for(const g of f.wa)g.onError(s)}))})(this,new ie(H.ABORTED,"Firestore shutting down"))}}function e_(){return new As((r=>Wv(r)),Fc)}async function ik(r,e){const t=Se(r);let s=3;const o=e.query;let l=t.queries.get(o);l?!l.Sa()&&e.ba()&&(s=2):(l=new nk,s=e.ba()?0:1);try{switch(s){case 0:l.ya=await t.onListen(o,!0);break;case 1:l.ya=await t.onListen(o,!1);break;case 2:await t.onFirstRemoteStoreListen(o)}}catch(h){const f=np(h,`Initialization of query '${To(e.query)}' failed`);return void e.onError(f)}t.queries.set(o,l),l.wa.push(e),e.va(t.onlineState),l.ya&&e.Ca(l.ya)&&rp(t)}async function sk(r,e){const t=Se(r),s=e.query;let o=3;const l=t.queries.get(s);if(l){const h=l.wa.indexOf(e);h>=0&&(l.wa.splice(h,1),l.wa.length===0?o=e.ba()?0:1:!l.Sa()&&e.ba()&&(o=2))}switch(o){case 0:return t.queries.delete(s),t.onUnlisten(s,!0);case 1:return t.queries.delete(s),t.onUnlisten(s,!1);case 2:return t.onLastRemoteStoreUnlisten(s);default:return}}function ok(r,e){const t=Se(r);let s=!1;for(const o of e){const l=o.query,h=t.queries.get(l);if(h){for(const f of h.wa)f.Ca(o)&&(s=!0);h.ya=o}}s&&rp(t)}function ak(r,e,t){const s=Se(r),o=s.queries.get(e);if(o)for(const l of o.wa)l.onError(t);s.queries.delete(e)}function rp(r){r.Da.forEach((e=>{e.next()}))}var cf,t_;(t_=cf||(cf={})).Fa="default",t_.Cache="cache";class lk{constructor(e,t,s){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=s||{}}Ca(e){if(!this.options.includeMetadataChanges){const s=[];for(const o of e.docChanges)o.type!==3&&s.push(o);e=new Mo(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const s=t!=="Offline";return(!this.options.ka||!s)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Mo.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==cf.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kE{constructor(e){this.key=e}}class CE{constructor(e){this.key=e}}class uk{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=xe(),this.mutatedKeys=xe(),this.Xa=Kv(e),this.eu=new No(this.Xa)}get tu(){return this.Ha}nu(e,t){const s=t?t.ru:new Zy,o=t?t.eu:this.eu;let l=t?t.mutatedKeys:this.mutatedKeys,h=o,f=!1;const g=this.query.limitType==="F"&&o.size===this.query.limit?o.last():null,_=this.query.limitType==="L"&&o.size===this.query.limit?o.first():null;if(e.inorderTraversal(((T,A)=>{const C=o.get(T),z=Uc(this.query,A)?A:null,W=!!C&&this.mutatedKeys.has(C.key),Y=!!z&&(z.hasLocalMutations||this.mutatedKeys.has(z.key)&&z.hasCommittedMutations);let B=!1;C&&z?C.data.isEqual(z.data)?W!==Y&&(s.track({type:3,doc:z}),B=!0):this.iu(C,z)||(s.track({type:2,doc:z}),B=!0,(g&&this.Xa(z,g)>0||_&&this.Xa(z,_)<0)&&(f=!0)):!C&&z?(s.track({type:0,doc:z}),B=!0):C&&!z&&(s.track({type:1,doc:C}),B=!0,(g||_)&&(f=!0)),B&&(z?(h=h.add(z),l=Y?l.add(T):l.delete(T)):(h=h.delete(T),l=l.delete(T)))})),this.query.limit!==null)for(;h.size>this.query.limit;){const T=this.query.limitType==="F"?h.last():h.first();h=h.delete(T.key),l=l.delete(T.key),s.track({type:1,doc:T})}return{eu:h,ru:s,Ds:f,mutatedKeys:l}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,s,o){const l=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const h=e.ru.pa();h.sort(((T,A)=>(function(z,W){const Y=B=>{switch(B){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Ee(20277,{At:B})}};return Y(z)-Y(W)})(T.type,A.type)||this.Xa(T.doc,A.doc))),this.su(s),o=o!=null&&o;const f=t&&!o?this.ou():[],g=this.Za.size===0&&this.current&&!o?1:0,_=g!==this.Ya;return this.Ya=g,h.length!==0||_?{snapshot:new Mo(this.query,e.eu,l,h,e.mutatedKeys,g===0,_,!1,!!s&&s.resumeToken.approximateByteSize()>0),_u:f}:{_u:f}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Zy,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=xe(),this.eu.forEach((s=>{this.au(s.key)&&(this.Za=this.Za.add(s.key))}));const t=[];return e.forEach((s=>{this.Za.has(s)||t.push(new CE(s))})),this.Za.forEach((s=>{e.has(s)||t.push(new kE(s))})),t}uu(e){this.Ha=e.qs,this.Za=xe();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Mo.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const ip="SyncEngine";class ck{constructor(e,t,s){this.query=e,this.targetId=t,this.view=s}}class hk{constructor(e){this.key=e,this.lu=!1}}class dk{constructor(e,t,s,o,l,h){this.localStore=e,this.remoteStore=t,this.eventManager=s,this.sharedClientState=o,this.currentUser=l,this.maxConcurrentLimboResolutions=h,this.hu={},this.Pu=new As((f=>Wv(f)),Fc),this.Tu=new Map,this.Iu=new Set,this.du=new it(ge.comparator),this.Eu=new Map,this.Au=new Kf,this.Ru={},this.Vu=new Map,this.mu=Lo.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function fk(r,e,t=!0){const s=VE(r);let o;const l=s.Pu.get(e);return l?(s.sharedClientState.addLocalQueryTarget(l.targetId),o=l.view.cu()):o=await PE(s,e,t,!0),o}async function pk(r,e){const t=VE(r);await PE(t,e,!0,!1)}async function PE(r,e,t,s){const o=await xR(r.localStore,fr(e)),l=o.targetId,h=r.sharedClientState.addLocalQueryTarget(l,t);let f;return s&&(f=await mk(r,e,l,h==="current",o.resumeToken)),r.isPrimaryClient&&t&&wE(r.remoteStore,o),f}async function mk(r,e,t,s,o){r.gu=(A,C,z)=>(async function(Y,B,ve,fe){let ce=B.view.nu(ve);ce.Ds&&(ce=await Ky(Y.localStore,B.query,!1).then((({documents:P})=>B.view.nu(P,ce))));const pe=fe&&fe.targetChanges.get(B.targetId),be=fe&&fe.targetMismatches.get(B.targetId)!=null,Te=B.view.applyChanges(ce,Y.isPrimaryClient,pe,be);return r_(Y,B.targetId,Te._u),Te.snapshot})(r,A,C,z);const l=await Ky(r.localStore,e,!0),h=new uk(e,l.qs),f=h.nu(l.documents),g=Tl.createSynthesizedTargetChangeForCurrentChange(t,s&&r.onlineState!=="Offline",o),_=h.applyChanges(f,r.isPrimaryClient,g);r_(r,t,_._u);const T=new ck(e,t,h);return r.Pu.set(e,T),r.Tu.has(t)?r.Tu.get(t).push(e):r.Tu.set(t,[e]),_.snapshot}async function gk(r,e,t){const s=Se(r),o=s.Pu.get(e),l=s.Tu.get(o.targetId);if(l.length>1)return s.Tu.set(o.targetId,l.filter((h=>!Fc(h,e)))),void s.Pu.delete(e);s.isPrimaryClient?(s.sharedClientState.removeLocalQueryTarget(o.targetId),s.sharedClientState.isActiveQueryTarget(o.targetId)||await lf(s.localStore,o.targetId,!1).then((()=>{s.sharedClientState.clearQueryState(o.targetId),t&&Xf(s.remoteStore,o.targetId),hf(s,o.targetId)})).catch(Bo)):(hf(s,o.targetId),await lf(s.localStore,o.targetId,!0))}async function yk(r,e){const t=Se(r),s=t.Pu.get(e),o=t.Tu.get(s.targetId);t.isPrimaryClient&&o.length===1&&(t.sharedClientState.removeLocalQueryTarget(s.targetId),Xf(t.remoteStore,s.targetId))}async function _k(r,e,t){const s=Ak(r);try{const o=await(function(h,f){const g=Se(h),_=Ye.now(),T=f.reduce(((z,W)=>z.add(W.key)),xe());let A,C;return g.persistence.runTransaction("Locally write mutations","readwrite",(z=>{let W=Hr(),Y=xe();return g.Os.getEntries(z,T).next((B=>{W=B,W.forEach(((ve,fe)=>{fe.isValidDocument()||(Y=Y.add(ve))}))})).next((()=>g.localDocuments.getOverlayedDocuments(z,W))).next((B=>{A=B;const ve=[];for(const fe of f){const ce=xA(fe,A.get(fe.key).overlayedDocument);ce!=null&&ve.push(new Rs(fe.key,ce,Mv(ce.value.mapValue),Ur.exists(!0)))}return g.mutationQueue.addMutationBatch(z,_,ve,f)})).next((B=>{C=B;const ve=B.applyToLocalDocumentSet(A,Y);return g.documentOverlayCache.saveOverlays(z,B.batchId,ve)}))})).then((()=>({batchId:C.batchId,changes:Qv(A)})))})(s.localStore,e);s.sharedClientState.addPendingMutation(o.batchId),(function(h,f,g){let _=h.Ru[h.currentUser.toKey()];_||(_=new it(ke)),_=_.insert(f,g),h.Ru[h.currentUser.toKey()]=_})(s,o.batchId,t),await Sl(s,o.changes),await Wc(s.remoteStore)}catch(o){const l=np(o,"Failed to persist write");t.reject(l)}}async function NE(r,e){const t=Se(r);try{const s=await CR(t.localStore,e);e.targetChanges.forEach(((o,l)=>{const h=t.Eu.get(l);h&&(Ue(o.addedDocuments.size+o.modifiedDocuments.size+o.removedDocuments.size<=1,22616),o.addedDocuments.size>0?h.lu=!0:o.modifiedDocuments.size>0?Ue(h.lu,14607):o.removedDocuments.size>0&&(Ue(h.lu,42227),h.lu=!1))})),await Sl(t,s,e)}catch(s){await Bo(s)}}function n_(r,e,t){const s=Se(r);if(s.isPrimaryClient&&t===0||!s.isPrimaryClient&&t===1){const o=[];s.Pu.forEach(((l,h)=>{const f=h.view.va(e);f.snapshot&&o.push(f.snapshot)})),(function(h,f){const g=Se(h);g.onlineState=f;let _=!1;g.queries.forEach(((T,A)=>{for(const C of A.wa)C.va(f)&&(_=!0)})),_&&rp(g)})(s.eventManager,e),o.length&&s.hu.J_(o),s.onlineState=e,s.isPrimaryClient&&s.sharedClientState.setOnlineState(e)}}async function vk(r,e,t){const s=Se(r);s.sharedClientState.updateQueryState(e,"rejected",t);const o=s.Eu.get(e),l=o&&o.key;if(l){let h=new it(ge.comparator);h=h.insert(l,Ht.newNoDocument(l,Ie.min()));const f=xe().add(l),g=new $c(Ie.min(),new Map,new it(ke),h,f);await NE(s,g),s.du=s.du.remove(l),s.Eu.delete(e),sp(s)}else await lf(s.localStore,e,!1).then((()=>hf(s,e,t))).catch(Bo)}async function Ek(r,e){const t=Se(r),s=e.batch.batchId;try{const o=await kR(t.localStore,e);DE(t,s,null),xE(t,s),t.sharedClientState.updateMutationState(s,"acknowledged"),await Sl(t,o)}catch(o){await Bo(o)}}async function wk(r,e,t){const s=Se(r);try{const o=await(function(h,f){const g=Se(h);return g.persistence.runTransaction("Reject batch","readwrite-primary",(_=>{let T;return g.mutationQueue.lookupMutationBatch(_,f).next((A=>(Ue(A!==null,37113),T=A.keys(),g.mutationQueue.removeMutationBatch(_,A)))).next((()=>g.mutationQueue.performConsistencyCheck(_))).next((()=>g.documentOverlayCache.removeOverlaysForBatchId(_,T,f))).next((()=>g.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(_,T))).next((()=>g.localDocuments.getDocuments(_,T)))}))})(s.localStore,e);DE(s,e,t),xE(s,e),s.sharedClientState.updateMutationState(e,"rejected",t),await Sl(s,o)}catch(o){await Bo(o)}}function xE(r,e){(r.Vu.get(e)||[]).forEach((t=>{t.resolve()})),r.Vu.delete(e)}function DE(r,e,t){const s=Se(r);let o=s.Ru[s.currentUser.toKey()];if(o){const l=o.get(e);l&&(t?l.reject(t):l.resolve(),o=o.remove(e)),s.Ru[s.currentUser.toKey()]=o}}function hf(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const s of r.Tu.get(e))r.Pu.delete(s),t&&r.hu.pu(s,t);r.Tu.delete(e),r.isPrimaryClient&&r.Au.zr(e).forEach((s=>{r.Au.containsKey(s)||OE(r,s)}))}function OE(r,e){r.Iu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Xf(r.remoteStore,t),r.du=r.du.remove(e),r.Eu.delete(t),sp(r))}function r_(r,e,t){for(const s of t)s instanceof kE?(r.Au.addReference(s.key,e),Tk(r,s)):s instanceof CE?(ne(ip,"Document no longer in limbo: "+s.key),r.Au.removeReference(s.key,e),r.Au.containsKey(s.key)||OE(r,s.key)):Ee(19791,{yu:s})}function Tk(r,e){const t=e.key,s=t.path.canonicalString();r.du.get(t)||r.Iu.has(s)||(ne(ip,"New document in limbo: "+t),r.Iu.add(s),sp(r))}function sp(r){for(;r.Iu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Iu.values().next().value;r.Iu.delete(e);const t=new ge(Ke.fromString(e)),s=r.mu.next();r.Eu.set(s,new hk(t)),r.du=r.du.insert(t,s),wE(r.remoteStore,new Ei(fr(Hv(t.path)),s,"TargetPurposeLimboResolution",Lc.ue))}}async function Sl(r,e,t){const s=Se(r),o=[],l=[],h=[];s.Pu.isEmpty()||(s.Pu.forEach(((f,g)=>{h.push(s.gu(g,e,t).then((_=>{var T;if((_||t)&&s.isPrimaryClient){const A=_?!_.fromCache:(T=t==null?void 0:t.targetChanges.get(g.targetId))===null||T===void 0?void 0:T.current;s.sharedClientState.updateQueryState(g.targetId,A?"current":"not-current")}if(_){o.push(_);const A=Qf.Es(g.targetId,_);l.push(A)}})))})),await Promise.all(h),s.hu.J_(o),await(async function(g,_){const T=Se(g);try{await T.persistence.runTransaction("notifyLocalViewChanges","readwrite",(A=>q.forEach(_,(C=>q.forEach(C.Is,(z=>T.persistence.referenceDelegate.addReference(A,C.targetId,z))).next((()=>q.forEach(C.ds,(z=>T.persistence.referenceDelegate.removeReference(A,C.targetId,z)))))))))}catch(A){if(!$o(A))throw A;ne(Yf,"Failed to update sequence numbers: "+A)}for(const A of _){const C=A.targetId;if(!A.fromCache){const z=T.Fs.get(C),W=z.snapshotVersion,Y=z.withLastLimboFreeSnapshotVersion(W);T.Fs=T.Fs.insert(C,Y)}}})(s.localStore,l))}async function Ik(r,e){const t=Se(r);if(!t.currentUser.isEqual(e)){ne(ip,"User change. New user:",e.toKey());const s=await yE(t.localStore,e);t.currentUser=e,(function(l,h){l.Vu.forEach((f=>{f.forEach((g=>{g.reject(new ie(H.CANCELLED,h))}))})),l.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,s.removedBatchIds,s.addedBatchIds),await Sl(t,s.Bs)}}function Sk(r,e){const t=Se(r),s=t.Eu.get(e);if(s&&s.lu)return xe().add(s.key);{let o=xe();const l=t.Tu.get(e);if(!l)return o;for(const h of l){const f=t.Pu.get(h);o=o.unionWith(f.view.tu)}return o}}function VE(r){const e=Se(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=NE.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Sk.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=vk.bind(null,e),e.hu.J_=ok.bind(null,e.eventManager),e.hu.pu=ak.bind(null,e.eventManager),e}function Ak(r){const e=Se(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Ek.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=wk.bind(null,e),e}class kc{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Hc(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return RR(this.persistence,new IR,e.initialUser,this.serializer)}Du(e){return new gE(Gf.Vi,this.serializer)}bu(e){return new OR}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}kc.provider={build:()=>new kc};class Rk extends kc{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Ue(this.persistence.referenceDelegate instanceof Ac,46915);const s=this.persistence.referenceDelegate.garbageCollector;return new lR(s,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?ln.withCacheSize(this.cacheSizeBytes):ln.DEFAULT;return new gE((s=>Ac.Vi(s,t)),this.serializer)}}class df{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=s=>n_(this.syncEngine,s,1),this.remoteStore.remoteSyncer.handleCredentialChange=Ik.bind(null,this.syncEngine),await tk(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new rk})()}createDatastore(e){const t=Hc(e.databaseInfo.databaseId),s=(function(l){return new jR(l)})(e.databaseInfo);return(function(l,h,f,g){return new BR(l,h,f,g)})(e.authCredentials,e.appCheckCredentials,s,t)}createRemoteStore(e){return(function(s,o,l,h,f){return new HR(s,o,l,h,f)})(this.localStore,this.datastore,e.asyncQueue,(t=>n_(this.syncEngine,t,0)),(function(){return Yy.C()?new Yy:new VR})())}createSyncEngine(e,t){return(function(o,l,h,f,g,_,T){const A=new dk(o,l,h,f,g,_);return T&&(A.fu=!0),A})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(o){const l=Se(o);ne(ws,"RemoteStore shutting down."),l.Ia.add(5),await Il(l),l.Ea.shutdown(),l.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}df.provider={build:()=>new df};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kk{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):$r("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi="FirestoreClient";class Ck{constructor(e,t,s,o,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=s,this.databaseInfo=o,this.user=$t.UNAUTHENTICATED,this.clientId=Mf.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=l,this.authCredentials.start(s,(async h=>{ne(Vi,"Received user=",h.uid),await this.authCredentialListener(h),this.user=h})),this.appCheckCredentials.start(s,(h=>(ne(Vi,"Received new app check token=",h),this.appCheckCredentialListener(h,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Si;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const s=np(t,"Failed to shutdown persistence");e.reject(s)}})),e.promise}}async function jd(r,e){r.asyncQueue.verifyOperationInProgress(),ne(Vi,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let s=t.initialUser;r.setCredentialChangeListener((async o=>{s.isEqual(o)||(await yE(e.localStore,o),s=o)})),e.persistence.setDatabaseDeletedListener((()=>{Ci("Terminating Firestore due to IndexedDb database deletion"),r.terminate().then((()=>{ne("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((o=>{Ci("Terminating Firestore due to IndexedDb database deletion failed",o)}))})),r._offlineComponents=e}async function i_(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Pk(r);ne(Vi,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((s=>Jy(e.remoteStore,s))),r.setAppCheckTokenChangeListener(((s,o)=>Jy(e.remoteStore,o))),r._onlineComponents=e}async function Pk(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){ne(Vi,"Using user provided OfflineComponentProvider");try{await jd(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(o){return o.name==="FirebaseError"?o.code===H.FAILED_PRECONDITION||o.code===H.UNIMPLEMENTED:!(typeof DOMException<"u"&&o instanceof DOMException)||o.code===22||o.code===20||o.code===11})(t))throw t;Ci("Error using user provided cache. Falling back to memory cache: "+t),await jd(r,new kc)}}else ne(Vi,"Using default OfflineComponentProvider"),await jd(r,new Rk(void 0));return r._offlineComponents}async function bE(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(ne(Vi,"Using user provided OnlineComponentProvider"),await i_(r,r._uninitializedComponentsProvider._online)):(ne(Vi,"Using default OnlineComponentProvider"),await i_(r,new df))),r._onlineComponents}function Nk(r){return bE(r).then((e=>e.syncEngine))}async function xk(r){const e=await bE(r),t=e.eventManager;return t.onListen=fk.bind(null,e.syncEngine),t.onUnlisten=gk.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=pk.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=yk.bind(null,e.syncEngine),t}function Dk(r,e,t={}){const s=new Si;return r.asyncQueue.enqueueAndForget((async()=>(function(l,h,f,g,_){const T=new kk({next:C=>{T.Ou(),h.enqueueAndForget((()=>sk(l,A))),C.fromCache&&g.source==="server"?_.reject(new ie(H.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):_.resolve(C)},error:C=>_.reject(C)}),A=new lk(f,T,{includeMetadataChanges:!0,ka:!0});return ik(l,A)})(await xk(r),r.asyncQueue,e,t,s))),s.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LE(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s_=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ME="firestore.googleapis.com",o_=!0;class a_{constructor(e){var t,s;if(e.host===void 0){if(e.ssl!==void 0)throw new ie(H.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ME,this.ssl=o_}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:o_;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=mE;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<oR)throw new ie(H.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}qS("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=LE((s=e.experimentalLongPollingOptions)!==null&&s!==void 0?s:{}),(function(l){if(l.timeoutSeconds!==void 0){if(isNaN(l.timeoutSeconds))throw new ie(H.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (must not be NaN)`);if(l.timeoutSeconds<5)throw new ie(H.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (minimum allowed value is 5)`);if(l.timeoutSeconds>30)throw new ie(H.INVALID_ARGUMENT,`invalid long polling timeout: ${l.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,o){return s.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Kc{constructor(e,t,s,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new a_({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ie(H.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new ie(H.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new a_(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new LS;switch(s.type){case"firstParty":return new US(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new ie(H.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=s_.get(t);s&&(ne("ComponentProvider","Removing Datastore"),s_.delete(t),s.terminate())})(this),Promise.resolve()}}function Ok(r,e,t,s={}){var o;r=mc(r,Kc);const l=bi(e),h=r._getSettings(),f=Object.assign(Object.assign({},h),{emulatorOptions:r._getEmulatorOptions()}),g=`${e}:${t}`;l&&(vf(`https://${g}`),Ef("Firestore",!0)),h.host!==ME&&h.host!==g&&Ci("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const _=Object.assign(Object.assign({},h),{host:g,ssl:l,emulatorOptions:s});if(!gs(_,f)&&(r._setSettings(_),s.mockUserToken)){let T,A;if(typeof s.mockUserToken=="string")T=s.mockUserToken,A=$t.MOCK_USER;else{T=P_(s.mockUserToken,(o=r._app)===null||o===void 0?void 0:o.options.projectId);const C=s.mockUserToken.sub||s.mockUserToken.user_id;if(!C)throw new ie(H.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");A=new $t(C)}r._authCredentials=new MS(new Sv(T,A))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new Cs(this.firestore,e,this._query)}}class Ct{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ai(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ct(this.firestore,e,this._key)}toJSON(){return{type:Ct._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(vl(t,Ct._jsonSchema))return new Ct(e,s||null,new ge(Ke.fromString(t.referencePath)))}}Ct._jsonSchemaVersion="firestore/documentReference/1.0",Ct._jsonSchema={type:mt("string",Ct._jsonSchemaVersion),referencePath:mt("string")};class Ai extends Cs{constructor(e,t,s){super(e,t,Hv(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ct(this.firestore,null,new ge(e))}withConverter(e){return new Ai(this.firestore,e,this._path)}}function jE(r,e,...t){if(r=Tt(r),Rv("collection","path",e),r instanceof Kc){const s=Ke.fromString(e,...t);return Ey(s),new Ai(r,null,s)}{if(!(r instanceof Ct||r instanceof Ai))throw new ie(H.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(Ke.fromString(e,...t));return Ey(s),new Ai(r.firestore,null,s)}}function Vk(r,e,...t){if(r=Tt(r),arguments.length===1&&(e=Mf.newId()),Rv("doc","path",e),r instanceof Kc){const s=Ke.fromString(e,...t);return vy(s),new Ct(r,null,new ge(s))}{if(!(r instanceof Ct||r instanceof Ai))throw new ie(H.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const s=r._path.child(Ke.fromString(e,...t));return vy(s),new Ct(r.firestore,r instanceof Ai?r.converter:null,new ge(s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const l_="AsyncQueue";class u_{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new vE(this,"async_queue_retry"),this.oc=()=>{const s=Md();s&&ne(l_,"Visibility state changed to "+s.visibilityState),this.F_.y_()},this._c=e;const t=Md();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Md();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new Si;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!$o(e))throw e;ne(l_,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((s=>{throw this.tc=s,this.nc=!1,$r("INTERNAL UNHANDLED ERROR: ",c_(s)),s})).then((s=>(this.nc=!1,s))))));return this._c=t,t}enqueueAfterDelay(e,t,s){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=tp.createAndSchedule(this,e,t,s,(l=>this.lc(l)));return this.ec.push(o),o}ac(){this.tc&&Ee(47125,{hc:c_(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function c_(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class op extends Kc{constructor(e,t,s,o){super(e,t,s,o),this.type="firestore",this._queue=new u_,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new u_(e),this._firestoreClient=void 0,await e}}}function bk(r,e){const t=typeof r=="object"?r:If(),s=typeof r=="string"?r:yc,o=xc(t,"firestore").getImmediate({identifier:s});if(!o._initialized){const l=R_("firestore");l&&Ok(o,...l)}return o}function FE(r){if(r._terminated)throw new ie(H.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Lk(r),r._firestoreClient}function Lk(r){var e,t,s;const o=r._freezeSettings(),l=(function(f,g,_,T){return new nA(f,g,_,T.host,T.ssl,T.experimentalForceLongPolling,T.experimentalAutoDetectLongPolling,LE(T.experimentalLongPollingOptions),T.useFetchStreams,T.isUsingEmulator)})(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,o);r._componentsProvider||!((t=o.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((s=o.localCache)===null||s===void 0)&&s._onlineComponentProvider)&&(r._componentsProvider={_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider}),r._firestoreClient=new Ck(r._authCredentials,r._appCheckCredentials,r._queue,l,r._componentsProvider&&(function(f){const g=f==null?void 0:f._online.build();return{_offline:f==null?void 0:f._offline.build(g),_online:g}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Nn(bt.fromBase64String(e))}catch(t){throw new ie(H.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Nn(bt.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Nn._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(vl(e,Nn._jsonSchema))return Nn.fromBase64String(e.bytes)}}Nn._jsonSchemaVersion="firestore/bytes/1.0",Nn._jsonSchema={type:mt("string",Nn._jsonSchemaVersion),bytes:mt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ap{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new ie(H.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Vt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UE{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ie(H.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ie(H.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ke(this._lat,e._lat)||ke(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:mr._jsonSchemaVersion}}static fromJSON(e){if(vl(e,mr._jsonSchema))return new mr(e.latitude,e.longitude)}}mr._jsonSchemaVersion="firestore/geoPoint/1.0",mr._jsonSchema={type:mt("string",mr._jsonSchemaVersion),latitude:mt("number"),longitude:mt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,o){if(s.length!==o.length)return!1;for(let l=0;l<s.length;++l)if(s[l]!==o[l])return!1;return!0})(this._values,e._values)}toJSON(){return{type:gr._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(vl(e,gr._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new gr(e.vectorValues);throw new ie(H.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}gr._jsonSchemaVersion="firestore/vectorValue/1.0",gr._jsonSchema={type:mt("string",gr._jsonSchemaVersion),vectorValues:mt("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mk=/^__.*__$/;class jk{constructor(e,t,s){this.data=e,this.fieldMask=t,this.fieldTransforms=s}toMutation(e,t){return this.fieldMask!==null?new Rs(e,this.data,this.fieldMask,t,this.fieldTransforms):new wl(e,this.data,t,this.fieldTransforms)}}function zE(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Ee(40011,{Ec:r})}}class lp{constructor(e,t,s,o,l,h){this.settings=e,this.databaseId=t,this.serializer=s,this.ignoreUndefinedProperties=o,l===void 0&&this.Ac(),this.fieldTransforms=l||[],this.fieldMask=h||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new lp(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.fc(e),o}gc(e){var t;const s=(t=this.path)===null||t===void 0?void 0:t.child(e),o=this.Rc({path:s,mc:!1});return o.Ac(),o}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Cc(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(zE(this.Ec)&&Mk.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class Fk{constructor(e,t,s){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=s||Hc(e)}Dc(e,t,s,o=!1){return new lp({Ec:e,methodName:t,bc:s,path:Vt.emptyPath(),mc:!1,Sc:o},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function BE(r){const e=r._freezeSettings(),t=Hc(r._databaseId);return new Fk(r._databaseId,!!e.ignoreUndefinedProperties,t)}function Uk(r,e,t,s,o,l={}){const h=r.Dc(l.merge||l.mergeFields?2:0,e,t,o);qE("Data must be an object, but it was:",h,s);const f=$E(s,h);let g,_;if(l.merge)g=new Yn(h.fieldMask),_=h.fieldTransforms;else if(l.mergeFields){const T=[];for(const A of l.mergeFields){const C=Bk(e,A,t);if(!h.contains(C))throw new ie(H.INVALID_ARGUMENT,`Field '${C}' is specified in your field mask but missing from your input data.`);Hk(T,C)||T.push(C)}g=new Yn(T),_=h.fieldTransforms.filter((A=>g.covers(A.field)))}else g=null,_=h.fieldTransforms;return new jk(new Pn(f),g,_)}function zk(r,e,t,s=!1){return up(t,r.Dc(s?4:3,e))}function up(r,e){if(HE(r=Tt(r)))return qE("Unsupported field value:",e,r),$E(r,e);if(r instanceof UE)return(function(s,o){if(!zE(o.Ec))throw o.wc(`${s._methodName}() can only be used with update() and set()`);if(!o.path)throw o.wc(`${s._methodName}() is not currently supported inside arrays`);const l=s._toFieldTransform(o);l&&o.fieldTransforms.push(l)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(s,o){const l=[];let h=0;for(const f of s){let g=up(f,o.yc(h));g==null&&(g={nullValue:"NULL_VALUE"}),l.push(g),h++}return{arrayValue:{values:l}}})(r,e)}return(function(s,o){if((s=Tt(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return AA(o.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const l=Ye.fromDate(s);return{timestampValue:Sc(o.serializer,l)}}if(s instanceof Ye){const l=new Ye(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Sc(o.serializer,l)}}if(s instanceof mr)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Nn)return{bytesValue:lE(o.serializer,s._byteString)};if(s instanceof Ct){const l=o.databaseId,h=s.firestore._databaseId;if(!h.isEqual(l))throw o.wc(`Document reference is for database ${h.projectId}/${h.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:Wf(s.firestore._databaseId||o.databaseId,s._key.path)}}if(s instanceof gr)return(function(h,f){return{mapValue:{fields:{[bv]:{stringValue:Lv},[_c]:{arrayValue:{values:h.toArray().map((_=>{if(typeof _!="number")throw f.wc("VectorValues must only contain numeric values.");return $f(f.serializer,_)}))}}}}}})(s,o);throw o.wc(`Unsupported field value: ${bc(s)}`)})(r,e)}function $E(r,e){const t={};return Pv(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ss(r,((s,o)=>{const l=up(o,e.Vc(s));l!=null&&(t[s]=l)})),{mapValue:{fields:t}}}function HE(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ye||r instanceof mr||r instanceof Nn||r instanceof Ct||r instanceof UE||r instanceof gr)}function qE(r,e,t){if(!HE(t)||!kv(t)){const s=bc(t);throw s==="an object"?e.wc(r+" a custom object"):e.wc(r+" "+s)}}function Bk(r,e,t){if((e=Tt(e))instanceof ap)return e._internalPath;if(typeof e=="string")return WE(r,e);throw Cc("Field path arguments must be of type string or ",r,!1,void 0,t)}const $k=new RegExp("[~\\*/\\[\\]]");function WE(r,e,t){if(e.search($k)>=0)throw Cc(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new ap(...e.split("."))._internalPath}catch{throw Cc(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Cc(r,e,t,s,o){const l=s&&!s.isEmpty(),h=o!==void 0;let f=`Function ${e}() called with invalid data`;t&&(f+=" (via `toFirestore()`)"),f+=". ";let g="";return(l||h)&&(g+=" (found",l&&(g+=` in field ${s}`),h&&(g+=` in document ${o}`),g+=")"),new ie(H.INVALID_ARGUMENT,f+r+g)}function Hk(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KE{constructor(e,t,s,o,l){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=o,this._converter=l}get id(){return this._key.path.lastSegment()}get ref(){return new Ct(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new qk(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(cp("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class qk extends KE{data(){return super.data()}}function cp(r,e){return typeof e=="string"?WE(r,e):e instanceof ap?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wk(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new ie(H.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class hp{}class GE extends hp{}function Kk(r,e,...t){let s=[];e instanceof hp&&s.push(e),s=s.concat(t),(function(l){const h=l.filter((g=>g instanceof dp)).length,f=l.filter((g=>g instanceof Gc)).length;if(h>1||h>0&&f>0)throw new ie(H.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(s);for(const o of s)r=o._apply(r);return r}class Gc extends GE{constructor(e,t,s){super(),this._field=e,this._op=t,this._value=s,this.type="where"}static _create(e,t,s){return new Gc(e,t,s)}_apply(e){const t=this._parse(e);return QE(e._query,t),new Cs(e.firestore,e.converter,nf(e._query,t))}_parse(e){const t=BE(e.firestore);return(function(l,h,f,g,_,T,A){let C;if(_.isKeyField()){if(T==="array-contains"||T==="array-contains-any")throw new ie(H.INVALID_ARGUMENT,`Invalid Query. You can't perform '${T}' queries on documentId().`);if(T==="in"||T==="not-in"){d_(A,T);const W=[];for(const Y of A)W.push(h_(g,l,Y));C={arrayValue:{values:W}}}else C=h_(g,l,A)}else T!=="in"&&T!=="not-in"&&T!=="array-contains-any"||d_(A,T),C=zk(f,h,A,T==="in"||T==="not-in");return pt.create(_,T,C)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Gk(r,e,t){const s=e,o=cp("where",r);return Gc._create(o,s,t)}class dp extends hp{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new dp(e,t)}_parse(e){const t=this._queryConstraints.map((s=>s._parse(e))).filter((s=>s.getFilters().length>0));return t.length===1?t[0]:Xn.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(o,l){let h=o;const f=l.getFlattenedFilters();for(const g of f)QE(h,g),h=nf(h,g)})(e._query,t),new Cs(e.firestore,e.converter,nf(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class fp extends GE{constructor(e,t,s){super(),this.type=e,this._limit=t,this._limitType=s}static _create(e,t,s){return new fp(e,t,s)}_apply(e){return new Cs(e.firestore,e.converter,wc(e._query,this._limit,this._limitType))}}function Qk(r){return fp._create("limit",r,"F")}function h_(r,e,t){if(typeof(t=Tt(t))=="string"){if(t==="")throw new ie(H.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!qv(e)&&t.indexOf("/")!==-1)throw new ie(H.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const s=e.path.child(Ke.fromString(t));if(!ge.isDocumentKey(s))throw new ie(H.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);return Cy(r,new ge(s))}if(t instanceof Ct)return Cy(r,t._key);throw new ie(H.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${bc(t)}.`)}function d_(r,e){if(!Array.isArray(r)||r.length===0)throw new ie(H.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function QE(r,e){const t=(function(o,l){for(const h of o)for(const f of h.getFlattenedFilters())if(l.indexOf(f.op)>=0)return f.op;return null})(r.filters,(function(o){switch(o){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new ie(H.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ie(H.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class Yk{convertValue(e,t="none"){switch(Di(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ut(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(xi(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Ee(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const s={};return Ss(e,((o,l)=>{s[o]=this.convertValue(l,t)})),s}convertVectorValue(e){var t,s,o;const l=(o=(s=(t=e.fields)===null||t===void 0?void 0:t[_c].arrayValue)===null||s===void 0?void 0:s.values)===null||o===void 0?void 0:o.map((h=>ut(h.doubleValue)));return new gr(l)}convertGeoPoint(e){return new mr(ut(e.latitude),ut(e.longitude))}convertArray(e,t){return(e.values||[]).map((s=>this.convertValue(s,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const s=jc(e);return s==null?null:this.convertValue(s,t);case"estimate":return this.convertTimestamp(al(e));default:return null}}convertTimestamp(e){const t=Ni(e);return new Ye(t.seconds,t.nanos)}convertDocumentKey(e,t){const s=Ke.fromString(e);Ue(pE(s),9688,{name:e});const o=new ll(s.get(1),s.get(3)),l=new ge(s.popFirst(5));return o.isEqual(t)||$r(`Document ${l} contains a document reference within a different database (${o.projectId}/${o.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xk(r,e,t){let s;return s=r?r.toFirestore(e):e,s}class Ku{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class xo extends KE{constructor(e,t,s,o,l,h){super(e,t,s,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=l}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ic(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(cp("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new ie(H.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=xo._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}xo._jsonSchemaVersion="firestore/documentSnapshot/1.0",xo._jsonSchema={type:mt("string",xo._jsonSchemaVersion),bundleSource:mt("string","DocumentSnapshot"),bundleName:mt("string"),bundle:mt("string")};class ic extends xo{data(e={}){return super.data(e)}}class Do{constructor(e,t,s,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new Ku(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new ic(this._firestore,this._userDataWriter,s.key,s,new Ku(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ie(H.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,l){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((f=>{const g=new ic(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Ku(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);return f.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((f=>l||f.type!==3)).map((f=>{const g=new ic(o._firestore,o._userDataWriter,f.doc.key,f.doc,new Ku(o._snapshot.mutatedKeys.has(f.doc.key),o._snapshot.fromCache),o.query.converter);let _=-1,T=-1;return f.type!==0&&(_=h.indexOf(f.doc.key),h=h.delete(f.doc.key)),f.type!==1&&(h=h.add(f.doc),T=h.indexOf(f.doc.key)),{type:Jk(f.type),doc:g,oldIndex:_,newIndex:T}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new ie(H.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Do._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Mf.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],o=[];return this.docs.forEach((l=>{l._document!==null&&(t.push(l._document),s.push(this._userDataWriter.convertObjectMap(l._document.data.value.mapValue.fields,"previous")),o.push(l.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Jk(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Ee(61501,{type:r})}}Do._jsonSchemaVersion="firestore/querySnapshot/1.0",Do._jsonSchema={type:mt("string",Do._jsonSchemaVersion),bundleSource:mt("string","QuerySnapshot"),bundleName:mt("string"),bundle:mt("string")};class Zk extends Yk{constructor(e){super(),this.firestore=e}convertBytes(e){return new Nn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ct(this.firestore,null,t)}}function eC(r){r=mc(r,Cs);const e=mc(r.firestore,op),t=FE(e),s=new Zk(e);return Wk(r._query),Dk(t,r._query).then((o=>new Do(e,s,r,o)))}function tC(r,e){const t=mc(r.firestore,op),s=Vk(r),o=Xk(r.converter,e);return nC(t,[Uk(BE(r.firestore),"addDoc",s._key,o,r.converter!==null,{}).toMutation(s._key,Ur.exists(!1))]).then((()=>s))}function nC(r,e){return(function(s,o){const l=new Si;return s.asyncQueue.enqueueAndForget((async()=>_k(await Nk(s),o,l))),l.promise})(FE(r),e)}(function(e,t=!0){(function(o){zo=o})(Is),ys(new ki("firestore",((s,{instanceIdentifier:o,options:l})=>{const h=s.getProvider("app").getImmediate(),f=new op(new jS(s.getProvider("auth-internal")),new zS(h,s.getProvider("app-check-internal")),(function(_,T){if(!Object.prototype.hasOwnProperty.apply(_.options,["projectId"]))throw new ie(H.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ll(_.options.projectId,T)})(h,o),h);return l=Object.assign({useFetchStreams:t},l),f._setSettings(l),f}),"PUBLIC").setMultipleInstances(!0)),hr(py,my,e),hr(py,my,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YE="firebasestorage.googleapis.com",XE="storageBucket",rC=120*1e3,iC=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt extends _r{constructor(e,t,s=0){super(Fd(e),`Firebase Storage: ${t} (${Fd(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Mt.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Fd(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Lt;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Lt||(Lt={}));function Fd(r){return"storage/"+r}function sC(){const r="An unknown error occurred, please check the error payload for server response.";return new Mt(Lt.UNKNOWN,r)}function oC(r){return new Mt(Lt.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function aC(r){return new Mt(Lt.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function lC(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new Mt(Lt.UNAUTHENTICATED,r)}function uC(){return new Mt(Lt.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function cC(r){return new Mt(Lt.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function hC(){return new Mt(Lt.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function dC(){return new Mt(Lt.CANCELED,"User canceled the upload/download.")}function fC(r){return new Mt(Lt.INVALID_URL,"Invalid URL '"+r+"'.")}function pC(r){return new Mt(Lt.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function mC(){return new Mt(Lt.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+XE+"' property when initializing the app?")}function ff(r){return new Mt(Lt.INVALID_ARGUMENT,r)}function JE(){return new Mt(Lt.APP_DELETED,"The Firebase app was deleted.")}function gC(r){return new Mt(Lt.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function za(r){throw new Mt(Lt.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let s;try{s=xn.makeFromUrl(e,t)}catch{return new xn(e,"")}if(s.path==="")return s;throw pC(e)}static makeFromUrl(e,t){let s=null;const o="([A-Za-z0-9.\\-_]+)";function l(pe){pe.path.charAt(pe.path.length-1)==="/"&&(pe.path_=pe.path_.slice(0,-1))}const h="(/(.*))?$",f=new RegExp("^gs://"+o+h,"i"),g={bucket:1,path:3};function _(pe){pe.path_=decodeURIComponent(pe.path)}const T="v[A-Za-z0-9_]+",A=t.replace(/[.]/g,"\\."),C="(/([^?#]*).*)?$",z=new RegExp(`^https?://${A}/${T}/b/${o}/o${C}`,"i"),W={bucket:1,path:3},Y=t===YE?"(?:storage.googleapis.com|storage.cloud.google.com)":t,B="([^?#]*)",ve=new RegExp(`^https?://${Y}/${o}/${B}`,"i"),ce=[{regex:f,indices:g,postModify:l},{regex:z,indices:W,postModify:_},{regex:ve,indices:{bucket:1,path:2},postModify:_}];for(let pe=0;pe<ce.length;pe++){const be=ce[pe],Te=be.regex.exec(e);if(Te){const P=Te[be.indices.bucket];let I=Te[be.indices.path];I||(I=""),s=new xn(P,I),be.postModify(s);break}}if(s==null)throw fC(e);return s}}class yC{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _C(r,e,t){let s=1,o=null,l=null,h=!1,f=0;function g(){return f===2}let _=!1;function T(...B){_||(_=!0,e.apply(null,B))}function A(B){o=setTimeout(()=>{o=null,r(z,g())},B)}function C(){l&&clearTimeout(l)}function z(B,...ve){if(_){C();return}if(B){C(),T.call(null,B,...ve);return}if(g()||h){C(),T.call(null,B,...ve);return}s<64&&(s*=2);let ce;f===1?(f=2,ce=0):ce=(s+Math.random())*1e3,A(ce)}let W=!1;function Y(B){W||(W=!0,C(),!_&&(o!==null?(B||(f=2),clearTimeout(o),A(0)):B||(f=1)))}return A(0),l=setTimeout(()=>{h=!0,Y(!0)},t),Y}function vC(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EC(r){return r!==void 0}function f_(r,e,t,s){if(s<e)throw ff(`Invalid value for '${r}'. Expected ${e} or greater.`);if(s>t)throw ff(`Invalid value for '${r}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wC(r,e,t){let s=e;return t==null&&(s=`https://${e}`),`${t}://${s}/v0${r}`}function TC(r){const e=encodeURIComponent;let t="?";for(const s in r)if(r.hasOwnProperty(s)){const o=e(s)+"="+e(r[s]);t=t+o+"&"}return t=t.slice(0,-1),t}var ms;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(ms||(ms={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IC(r,e){const t=r>=500&&r<600,o=[408,429].indexOf(r)!==-1,l=e.indexOf(r)!==-1;return t||o||l}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SC{constructor(e,t,s,o,l,h,f,g,_,T,A,C=!0,z=!1){this.url_=e,this.method_=t,this.headers_=s,this.body_=o,this.successCodes_=l,this.additionalRetryCodes_=h,this.callback_=f,this.errorCallback_=g,this.timeout_=_,this.progressCallback_=T,this.connectionFactory_=A,this.retry=C,this.isUsingEmulator=z,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((W,Y)=>{this.resolve_=W,this.reject_=Y,this.start_()})}start_(){const e=(s,o)=>{if(o){s(!1,new Gu(!1,null,!0));return}const l=this.connectionFactory_();this.pendingConnection_=l;const h=f=>{const g=f.loaded,_=f.lengthComputable?f.total:-1;this.progressCallback_!==null&&this.progressCallback_(g,_)};this.progressCallback_!==null&&l.addUploadProgressListener(h),l.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&l.removeUploadProgressListener(h),this.pendingConnection_=null;const f=l.getErrorCode()===ms.NO_ERROR,g=l.getStatus();if(!f||IC(g,this.additionalRetryCodes_)&&this.retry){const T=l.getErrorCode()===ms.ABORT;s(!1,new Gu(!1,null,T));return}const _=this.successCodes_.indexOf(g)!==-1;s(!0,new Gu(_,l))})},t=(s,o)=>{const l=this.resolve_,h=this.reject_,f=o.connection;if(o.wasSuccessCode)try{const g=this.callback_(f,f.getResponse());EC(g)?l(g):l()}catch(g){h(g)}else if(f!==null){const g=sC();g.serverResponse=f.getErrorText(),this.errorCallback_?h(this.errorCallback_(f,g)):h(g)}else if(o.canceled){const g=this.appDelete_?JE():dC();h(g)}else{const g=hC();h(g)}};this.canceled_?t(!1,new Gu(!1,null,!0)):this.backoffId_=_C(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&vC(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Gu{constructor(e,t,s){this.wasSuccessCode=e,this.connection=t,this.canceled=!!s}}function AC(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function RC(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function kC(r,e){e&&(r["X-Firebase-GMPID"]=e)}function CC(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function PC(r,e,t,s,o,l,h=!0,f=!1){const g=TC(r.urlParams),_=r.url+g,T=Object.assign({},r.headers);return kC(T,e),AC(T,t),RC(T,l),CC(T,s),new SC(_,r.method,T,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,o,h,f)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NC(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function xC(r,e){const t=e.split("/").filter(s=>s.length>0).join("/");return r.length===0?t:r+"/"+t}function DC(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}class OC{constructor(e,t,s,o){this.url=e,this.method=t,this.handler=s,this.timeout=o,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}function VC(r){function e(t,s){let o;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?o=uC():o=lC():t.getStatus()===402?o=aC(r.bucket):t.getStatus()===403?o=cC(r.path):o=s,o.status=t.getStatus(),o.serverResponse=s.serverResponse,o}return e}function bC(r){const e=VC(r);function t(s,o){let l=e(s,o);return s.getStatus()===404&&(l=oC(r.path)),l.serverResponse=o.serverResponse,l}return t}function LC(r,e,t){const s=e.fullServerUrl(),o=wC(s,r.host,r._protocol)+"?alt=media",l="GET",h=r.maxOperationRetryTime,f=new OC(o,l,(g,_)=>_,h);return f.errorHandler=bC(e),f}class MC{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=ms.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=ms.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=ms.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,s,o,l){if(this.sent_)throw za("cannot .send() more than once");if(bi(e)&&s&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),l!==void 0)for(const h in l)l.hasOwnProperty(h)&&this.xhr_.setRequestHeader(h,l[h].toString());return o!==void 0?this.xhr_.send(o):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw za("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw za("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw za("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw za("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class jC extends MC{initXhr(){this.xhr_.responseType="arraybuffer"}}function FC(){return new jC}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e,t){this._service=e,t instanceof xn?this._location=t:this._location=xn.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Ts(e,t)}get root(){const e=new xn(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return DC(this._location.path)}get storage(){return this._service}get parent(){const e=NC(this._location.path);if(e===null)return null;const t=new xn(this._location.bucket,e);return new Ts(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw gC(e)}}function UC(r,e){r._throwIfRoot("getBytes");const t=LC(r.storage,r._location);return r.storage.makeRequestWithTokens(t,FC).then(s=>s)}function zC(r,e){const t=xC(r._location.path,e),s=new xn(r._location.bucket,t);return new Ts(r.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BC(r){return/^[A-Za-z]+:\/\//.test(r)}function $C(r,e){return new Ts(r,e)}function ZE(r,e){if(r instanceof pp){const t=r;if(t._bucket==null)throw mC();const s=new Ts(t,t._bucket);return e!=null?ZE(s,e):s}else return e!==void 0?zC(r,e):r}function HC(r,e){if(e&&BC(e)){if(r instanceof pp)return $C(r,e);throw ff("To use ref(service, url), the first argument must be a Storage instance.")}else return ZE(r,e)}function p_(r,e){const t=e==null?void 0:e[XE];return t==null?null:xn.makeFromBucketSpec(t,r)}function qC(r,e,t,s={}){r.host=`${e}:${t}`;const o=bi(e);o&&(vf(`https://${r.host}/b`),Ef("Storage",!0)),r._isUsingEmulator=!0,r._protocol=o?"https":"http";const{mockUserToken:l}=s;l&&(r._overrideAuthToken=typeof l=="string"?l:P_(l,r.app.options.projectId))}class pp{constructor(e,t,s,o,l,h=!1){this.app=e,this._authProvider=t,this._appCheckProvider=s,this._url=o,this._firebaseVersion=l,this._isUsingEmulator=h,this._bucket=null,this._host=YE,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=rC,this._maxUploadRetryTime=iC,this._requests=new Set,o!=null?this._bucket=xn.makeFromBucketSpec(o,this._host):this._bucket=p_(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=xn.makeFromBucketSpec(this._url,e):this._bucket=p_(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){f_("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){f_("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(Yt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Ts(this,e)}_makeRequest(e,t,s,o,l=!0){if(this._deleted)return new yC(JE());{const h=PC(e,this._appId,s,o,t,this._firebaseVersion,l,this._isUsingEmulator);return this._requests.add(h),h.getPromise().then(()=>this._requests.delete(h),()=>this._requests.delete(h)),h}}async makeRequestWithTokens(e,t){const[s,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,s,o).getPromise()}}const m_="@firebase/storage",g_="0.13.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ew="storage";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function WC(r,e){return r=Tt(r),UC(r)}function KC(r,e){return r=Tt(r),HC(r,e)}function GC(r=If(),e){r=Tt(r);const s=xc(r,ew).getImmediate({identifier:e}),o=R_("storage");return o&&QC(s,...o),s}function QC(r,e,t,s={}){qC(r,e,t,s)}function YC(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),s=r.getProvider("auth-internal"),o=r.getProvider("app-check-internal");return new pp(t,s,o,e,Is)}function XC(){ys(new ki(ew,YC,"PUBLIC").setMultipleInstances(!0)),hr(m_,g_,""),hr(m_,g_,"esm2017")}XC();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const JC=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),tw=(...r)=>r.filter((e,t,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ZC={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eP=$e.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:s,className:o="",children:l,iconNode:h,...f},g)=>$e.createElement("svg",{ref:g,...ZC,width:e,height:e,stroke:r,strokeWidth:s?Number(t)*24/Number(e):t,className:tw("lucide",o),...f},[...h.map(([_,T])=>$e.createElement(_,T)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=(r,e)=>{const t=$e.forwardRef(({className:s,...o},l)=>$e.createElement(eP,{ref:l,iconNode:e,className:tw(`lucide-${JC(r)}`,s),...o}));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nw=ot("ArrowDownToLine",[["path",{d:"M12 17V3",key:"1cwfxf"}],["path",{d:"m6 11 6 6 6-6",key:"12ii2o"}],["path",{d:"M19 21H5",key:"150jfl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=ot("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mp=ot("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gp=ot("BadgeCheck",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tP=ot("Bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nP=ot("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pf=ot("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rw=ot("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iw=ot("Clock3",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16.5 12",key:"1aq6pp"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sw=ot("FileCheck2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4",key:"1pf5j1"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m3 15 2 2 4-4",key:"1lhrkk"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dl=ot("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y_=ot("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rP=ot("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ps=ot("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sc=ot("LockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iP=ot("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const __=ot("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sP=ot("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mf=ot("MessageSquareText",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M13 8H7",key:"14i4kc"}],["path",{d:"M17 12H7",key:"16if0g"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yp=ot("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ri=ot("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gf=ot("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);var oP="firebase",aP="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */hr(oP,aP,"app");const ow={apiKey:void 0,authDomain:void 0,projectId:void 0,appId:void 0},aw=Object.values(ow).every(Boolean),jo=aw?D_(ow):null,an=jo?VS(jo):null,Pc=jo?bk(jo):null,v_=jo?GC(jo):null,Lr=r=>r instanceof Error?r.message:"Something went wrong. Please try again.",oc=r=>r.replace(/[^\d+]/g,"");function lP(r){return Array.isArray(r)?r.flatMap(e=>{if(!e||typeof e!="object")return[];const t=e;return typeof t.name!="string"?[]:[{name:t.name,status:typeof t.status=="string"?t.status:"Pending",dueDate:typeof t.dueDate=="string"?t.dueDate:void 0,details:typeof t.details=="string"?t.details:void 0}]}):[]}function uP(r){return Array.isArray(r)?r.flatMap(e=>{if(!e||typeof e!="object")return[];const t=e;return typeof t.fileName!="string"||typeof t.storagePath!="string"?[]:[{fileName:t.fileName,storagePath:t.storagePath,category:typeof t.category=="string"?t.category:void 0,uploadedAt:typeof t.uploadedAt=="string"?t.uploadedAt:void 0}]}):[]}async function cP(r){if(!Pc)throw new Error("Firebase is not configured.");const e=[];r.email&&e.push({field:"clientEmail",value:r.email.toLowerCase()}),r.phoneNumber&&e.push({field:"clientMobile",value:oc(r.phoneNumber)});for(const t of e){const s=await eC(Kk(jE(Pc,"clients"),Gk(t.field,"==",t.value),Qk(2)));if(s.size>1)throw new Error(`More than one client record matches this ${t.field==="clientEmail"?"email":"mobile number"}. Please contact support.`);const o=s.docs[0];if(o){const l=o.data();return{id:o.id,clientName:typeof l.clientName=="string"?l.clientName:void 0,clientMobile:typeof l.clientMobile=="string"?l.clientMobile:void 0,clientEmail:typeof l.clientEmail=="string"?l.clientEmail:void 0,compliance:lP(l.compliance),downloads:uP(l.downloads)}}}return null}function hP(){const[r,e]=$e.useState(null),[t,s]=$e.useState(null),[o,l]=$e.useState(!0),[h,f]=$e.useState(!1),[g,_]=$e.useState("Overview"),[T,A]=$e.useState("email"),[C,z]=$e.useState(""),[W,Y]=$e.useState(""),[B,ve]=$e.useState(""),[fe,ce]=$e.useState(""),[pe,be]=$e.useState(null),[Te,P]=$e.useState(""),[I,k]=$e.useState(""),[x,D]=$e.useState(!1),[b,R]=$e.useState(""),[Xe,tt]=$e.useState(!1),Je=$e.useRef(null);$e.useEffect(()=>{if(!an){l(!1);return}return f1(an,me=>{e(me),me||(s(null),l(!1))})},[]),$e.useEffect(()=>{if(!r)return;let se=!1;return f(!0),l(!0),cP(r).then(async me=>{if(!se){if(!me){P("We couldn't find a client record for this account. Please use your registered email or mobile number, or request access."),await ty(an);return}s(me),P(""),l(!1)}}).catch(me=>{se||(P(`Unable to verify your client record: ${Lr(me)}`),l(!1))}).finally(()=>{se||(f(!1),l(!1))}),()=>{se=!0}},[r]),$e.useEffect(()=>()=>{var se;return(se=Je.current)==null?void 0:se.clear()},[]);const Fe=$e.useMemo(()=>(t==null?void 0:t.compliance.filter(se=>/complete|compliant|done/i.test(se.status)).length)??0,[t]),Z=((t==null?void 0:t.compliance.length)??0)-Fe;async function he(se){e(se),P("")}async function ee(se){if(se.preventDefault(),!!an){D(!0),P("");try{const me=await c1(an,C.trim(),W);await he(me.user)}catch(me){P(Lr(me))}finally{D(!1)}}}async function V(se){if(se.preventDefault(),!!an){D(!0),P("");try{const me=await u1(an,C.trim(),W);await he(me.user)}catch(me){P(Lr(me))}finally{D(!1)}}}async function $(){if(an){D(!0),P("");try{const se=await $1(an,new Mr);await he(se.user)}catch(se){P(Lr(se))}finally{D(!1)}}}async function de(se){var me;if(se.preventDefault(),!!an){D(!0),P("");try{Je.current??(Je.current=new V1(an,"recaptcha-container",{size:"invisible"}));const ze=await M1(an,oc(B),Je.current);be(ze),k(`A verification code was sent to ${oc(B)}.`)}catch(ze){P(Lr(ze)),(me=Je.current)==null||me.clear(),Je.current=null}finally{D(!1)}}}async function Ae(se){if(se.preventDefault(),!!pe){D(!0),P("");try{const me=await pe.confirm(fe.trim());await he(me.user),be(null),ce("")}catch(me){P(Lr(me))}finally{D(!1)}}}async function Re(se){if(se.preventDefault(),!Pc)return!1;const me=se.currentTarget,ze=new FormData(me);D(!0),P("");try{return await tC(jE(Pc,"signupRequests"),{name:String(ze.get("requestName")).trim(),email:String(ze.get("requestEmail")).trim().toLowerCase(),mobile:oc(String(ze.get("requestMobile"))),message:String(ze.get("requestMessage")).trim(),status:"pending",createdAt:new Date().toISOString()}),k("Your access request is in. Our team will be in touch shortly."),me.reset(),!0}catch(Xt){return P(`We couldn't send your request: ${Lr(Xt)}`),!1}finally{D(!1)}}async function Pe(se){if(!(!v_||!t)){R(se.storagePath),P("");try{const me=await WC(KC(v_,se.storagePath)),ze=new Blob([me]),Xt=URL.createObjectURL(ze),_n=document.createElement("a");_n.href=Xt,_n.download=se.fileName,document.body.appendChild(_n),_n.click(),_n.remove(),URL.revokeObjectURL(Xt)}catch(me){P(`Unable to download ${se.fileName}: ${Lr(me)}`)}finally{R("")}}}async function Le(){if(an)try{await ty(an),_("Overview"),P("")}catch(se){P(`Unable to sign out: ${Lr(se)}`)}}return aw?o||h?E.jsx(_P,{}):!r||!t?E.jsx(dP,{authMode:T,setAuthMode:A,email:C,setEmail:z,password:W,setPassword:Y,phone:B,setPhone:ve,otp:fe,setOtp:ce,confirmation:pe,resetPhoneVerification:()=>{be(null),ce("")},authError:Te,notice:I,busy:x,sendOtp:de,verifyOtp:Ae,handleEmailSignIn:ee,handleCreateAccount:V,handleGoogleSignIn:$,requestAccess:Re}):E.jsxs("div",{className:"app-shell",children:[E.jsxs("aside",{className:`sidebar ${Xe?"sidebar-open":""}`,children:[E.jsxs("div",{className:"brand",children:[E.jsx("span",{className:"brand-mark",children:E.jsx(Ri,{size:19,strokeWidth:2.2})}),E.jsxs("span",{children:["fin",E.jsx("span",{className:"brand-accent",children:"wise"})]}),E.jsx("button",{className:"icon-button sidebar-close","aria-label":"Close menu",onClick:()=>tt(!1),children:E.jsx(gf,{size:19})})]}),E.jsx("div",{className:"workspace-label",children:"YOUR WORKSPACE"}),E.jsxs("nav",{className:"nav-links","aria-label":"Main navigation",children:[E.jsx(zd,{icon:E.jsx(rP,{size:18}),label:"Overview",active:g==="Overview",onClick:()=>{_("Overview"),tt(!1)}}),E.jsx(zd,{icon:E.jsx(gp,{size:18}),label:"Compliance",active:g==="Compliance",onClick:()=>{_("Compliance"),tt(!1)},badge:Z>0?String(Z):void 0}),E.jsx(zd,{icon:E.jsx(dl,{size:18}),label:"Documents",active:g==="Documents",onClick:()=>{_("Documents"),tt(!1)}})]}),E.jsxs("div",{className:"sidebar-bottom",children:[E.jsxs("div",{className:"help-card",children:[E.jsx("span",{className:"help-icon",children:E.jsx(mf,{size:17})}),E.jsxs("div",{children:[E.jsx("strong",{children:"Need a hand?"}),E.jsx("span",{children:"We’re just a message away."})]}),E.jsx(mp,{size:15})]}),E.jsxs("button",{className:"profile-row",onClick:Le,children:[E.jsx("span",{className:"avatar",children:E_(t.clientName,r.email)}),E.jsxs("span",{className:"profile-copy",children:[E.jsx("strong",{children:t.clientName||r.displayName||"Your account"}),E.jsx("span",{children:r.email||r.phoneNumber})]}),E.jsx(iP,{size:17,className:"logout-icon"})]})]})]}),E.jsxs("main",{className:"main-area",children:[E.jsxs("header",{className:"topbar",children:[E.jsx("button",{className:"icon-button menu-trigger","aria-label":"Open menu",onClick:()=>tt(!0),children:E.jsx(sP,{size:20})}),E.jsxs("div",{className:"breadcrumb",children:["Workspace ",E.jsx("span",{children:"/"})," ",E.jsx("strong",{children:g})]}),E.jsxs("div",{className:"topbar-right",children:[E.jsxs("span",{className:"secure-label",children:[E.jsx(yp,{size:15})," Secure portal"]}),E.jsxs("button",{className:"icon-button notification-button","aria-label":"Notifications",children:[E.jsx(tP,{size:19}),E.jsx("i",{})]}),E.jsx("span",{className:"avatar avatar-small",children:E_(t.clientName,r.email)})]})]}),E.jsxs("div",{className:"page-content",children:[Te&&E.jsxs("div",{className:"inline-alert",children:[E.jsx(rw,{size:17}),E.jsx("span",{children:Te}),E.jsx("button",{"aria-label":"Dismiss",onClick:()=>P(""),children:E.jsx(gf,{size:16})})]}),g==="Overview"&&E.jsx(fP,{client:t,completedCount:Fe,openCount:Z,setPage:_,downloadFile:Pe,downloadBusy:b}),g==="Compliance"&&E.jsx(pP,{client:t}),g==="Documents"&&E.jsx(mP,{client:t,downloadFile:Pe,downloadBusy:b}),E.jsxs("footer",{className:"page-footer",children:[E.jsx(sc,{size:13})," Your information is encrypted and only visible to you. ",E.jsx("span",{children:"·"})," Privacy & security"]})]})]}),Xe&&E.jsx("button",{className:"sidebar-backdrop","aria-label":"Close navigation",onClick:()=>tt(!1)})]}):E.jsx(yP,{})}function dP(r){const[e,t]=$e.useState(!1),[s,o]=$e.useState("login"),l=s==="login"?r.handleEmailSignIn:r.handleCreateAccount;return E.jsxs("div",{className:"auth-shell",children:[E.jsxs("div",{className:"auth-art",children:[E.jsxs("div",{className:"auth-brand brand",children:[E.jsx("span",{className:"brand-mark",children:E.jsx(Ri,{size:19})}),E.jsxs("span",{children:["fin",E.jsx("span",{className:"brand-accent",children:"wise"})]})]}),E.jsxs("div",{className:"art-content",children:[E.jsxs("span",{className:"eyebrow",children:[E.jsx(Ri,{size:14})," YOUR FINANCIAL CLARITY, IN ONE PLACE"]}),E.jsxs("h1",{children:["A clearer view",E.jsx("br",{}),"of your ",E.jsx("span",{children:"finances."})]}),E.jsx("p",{children:"Stay on top of compliance, keep your important documents close, and move forward with confidence."}),E.jsxs("div",{className:"art-preview",children:[E.jsxs("div",{className:"preview-head",children:[E.jsx("span",{children:"Compliance overview"}),E.jsxs("span",{className:"preview-live",children:[E.jsx("i",{})," LIVE"]})]}),E.jsxs("div",{className:"preview-score",children:[E.jsx("span",{className:"score-ring",children:E.jsx(pf,{size:23})}),E.jsxs("div",{children:[E.jsx("strong",{children:"Looking good"}),E.jsx("span",{children:"Your compliance is on track"})]}),E.jsx(mp,{size:18})]}),E.jsxs("div",{className:"preview-line",children:[E.jsx("span",{}),E.jsx("span",{}),E.jsx("span",{})]})]})]}),E.jsxs("div",{className:"art-footer",children:[E.jsx(sc,{size:14})," Protected with bank-grade security ",E.jsx("span",{children:"·"})," Built around you"]})]}),E.jsxs("div",{className:"auth-panel",children:[E.jsxs("div",{className:"auth-panel-top",children:[E.jsxs("span",{className:"mobile-brand brand",children:[E.jsx("span",{className:"brand-mark",children:E.jsx(Ri,{size:18})}),E.jsxs("span",{children:["fin",E.jsx("span",{className:"brand-accent",children:"wise"})]})]}),E.jsxs("span",{className:"member-label",children:["CLIENT PORTAL ",E.jsx("span",{children:"↗"})]})]}),E.jsxs("div",{className:"auth-card",children:[E.jsxs("div",{className:"auth-heading",children:[E.jsx("div",{className:"auth-badge",children:E.jsx(y_,{size:21})}),E.jsx("span",{className:"eyebrow muted-eyebrow",children:"WELCOME TO YOUR PORTAL"}),E.jsx("h2",{children:"Good to see you."}),E.jsx("p",{children:"Sign in to your client account to pick up where you left off."})]}),E.jsxs("div",{className:"auth-tabs",role:"tablist","aria-label":"Sign-in method",children:[E.jsxs("button",{role:"tab","aria-selected":r.authMode==="email",className:r.authMode==="email"?"selected":"",onClick:()=>r.setAuthMode("email"),children:[E.jsx(__,{size:16})," Email"]}),E.jsxs("button",{role:"tab","aria-selected":r.authMode==="phone",className:r.authMode==="phone"?"selected":"",onClick:()=>r.setAuthMode("phone"),children:[E.jsx(mf,{size:16})," Mobile OTP"]})]}),r.authMode==="email"?E.jsxs(E.Fragment,{children:[E.jsxs("form",{className:"auth-form",onSubmit:l,children:[s==="signup"&&E.jsx("p",{className:"form-hint",children:"Create an account using the email registered to your client profile."}),E.jsx("label",{htmlFor:"email",children:"Email address"}),E.jsxs("div",{className:"input-wrap",children:[E.jsx(__,{size:17}),E.jsx("input",{id:"email",type:"email",autoComplete:"email",placeholder:"you@example.com",required:!0,value:r.email,onChange:h=>r.setEmail(h.target.value)})]}),E.jsxs("div",{className:"label-row",children:[E.jsx("label",{htmlFor:"password",children:"Password"}),s==="login"&&E.jsx("button",{className:"text-button",type:"button",onClick:()=>t(!0),children:"Need access?"})]}),E.jsxs("div",{className:"input-wrap",children:[E.jsx(sc,{size:17}),E.jsx("input",{id:"password",type:"password",autoComplete:s==="login"?"current-password":"new-password",minLength:6,placeholder:s==="login"?"Enter your password":"At least 6 characters",required:!0,value:r.password,onChange:h=>r.setPassword(h.target.value)})]}),E.jsxs("button",{className:"primary-button",disabled:r.busy,type:"submit",children:[r.busy?E.jsx(ps,{size:17,className:"spin"}):s==="login"?"Sign in":"Create account"," ",E.jsx(Ao,{size:17})]})]}),E.jsxs("div",{className:"divider",children:[E.jsx("span",{}),"or continue with",E.jsx("span",{})]}),E.jsxs("button",{className:"google-button",disabled:r.busy,onClick:r.handleGoogleSignIn,children:[E.jsx(vP,{})," Continue with Google"]}),E.jsxs("p",{className:"switch-account",children:[s==="login"?"New to the portal?":"Already registered?"," ",E.jsx("button",{onClick:()=>o(s==="login"?"signup":"login"),children:s==="login"?"Create an account":"Sign in"})]})]}):E.jsx("form",{className:"auth-form phone-form",onSubmit:r.confirmation?r.verifyOtp:r.sendOtp,children:r.confirmation?E.jsxs(E.Fragment,{children:[E.jsx("label",{htmlFor:"otp",children:"6-digit verification code"}),E.jsxs("div",{className:"input-wrap",children:[E.jsx(y_,{size:17}),E.jsx("input",{id:"otp",type:"text",inputMode:"numeric",autoComplete:"one-time-code",pattern:"[0-9]{6}",maxLength:6,placeholder:"Enter your code",required:!0,value:r.otp,onChange:h=>r.setOtp(h.target.value)})]}),E.jsxs("p",{className:"form-hint",children:["Check your messages for the code sent to ",r.phone,"."]}),E.jsxs("button",{className:"primary-button",disabled:r.busy,type:"submit",children:[r.busy?E.jsx(ps,{size:17,className:"spin"}):"Verify & sign in"," ",E.jsx(Ao,{size:17})]}),E.jsx("button",{className:"text-button resend-button",type:"button",onClick:r.resetPhoneVerification,children:"Use another number"})]}):E.jsxs(E.Fragment,{children:[E.jsx("label",{htmlFor:"phone",children:"Mobile number"}),E.jsxs("div",{className:"input-wrap",children:[E.jsx(mf,{size:17}),E.jsx("input",{id:"phone",type:"tel",autoComplete:"tel",placeholder:"+91 98765 43210",required:!0,value:r.phone,onChange:h=>r.setPhone(h.target.value)}),E.jsx("span",{className:"country-code",children:"Include country code"})]}),E.jsx("p",{className:"form-hint",children:"Use the mobile number on your client profile. We’ll text you a one-time code."}),E.jsxs("button",{className:"primary-button",disabled:r.busy,type:"submit",children:[r.busy?E.jsx(ps,{size:17,className:"spin"}):"Send verification code"," ",E.jsx(Ao,{size:17})]})]})}),r.authError&&E.jsxs("div",{className:"auth-alert",children:[E.jsx(rw,{size:16}),E.jsx("span",{children:r.authError})]}),r.notice&&E.jsxs("div",{className:"success-note",children:[E.jsx(pf,{size:15})," ",r.notice]}),E.jsx("div",{id:"recaptcha-container"}),E.jsxs("div",{className:"access-note",children:[E.jsx(sc,{size:14})," Access is matched to your registered client profile."]})]}),E.jsxs("div",{className:"auth-bottom",children:[E.jsx("button",{className:"text-button",onClick:()=>t(!0),children:"Request client access"}),E.jsx("span",{children:"© 2026 Finwise"})]})]}),e&&E.jsxs(gP,{title:"Request portal access",onClose:()=>t(!1),children:[E.jsx("p",{className:"modal-copy",children:"Share a few details and our team will connect your client account."}),E.jsxs("form",{className:"request-form",onSubmit:async h=>{await r.requestAccess(h)&&t(!1)},children:[E.jsx("label",{htmlFor:"requestName",children:"Full name"}),E.jsx("input",{id:"requestName",name:"requestName",required:!0,placeholder:"Your name"}),E.jsx("label",{htmlFor:"requestEmail",children:"Email address"}),E.jsx("input",{id:"requestEmail",name:"requestEmail",type:"email",required:!0,placeholder:"you@example.com"}),E.jsx("label",{htmlFor:"requestMobile",children:"Mobile number"}),E.jsx("input",{id:"requestMobile",name:"requestMobile",type:"tel",required:!0,placeholder:"+91 98765 43210"}),E.jsxs("label",{htmlFor:"requestMessage",children:["Anything we should know? ",E.jsx("span",{children:"Optional"})]}),E.jsx("textarea",{id:"requestMessage",name:"requestMessage",rows:3,placeholder:"Add a note for our team"}),E.jsxs("button",{className:"primary-button",disabled:r.busy,type:"submit",children:[r.busy?E.jsx(ps,{size:17,className:"spin"}):"Send request"," ",E.jsx(Ao,{size:17})]})]})]})]})}function fP({client:r,completedCount:e,openCount:t,setPage:s,downloadFile:o,downloadBusy:l}){const h=(r.clientName||"there").trim().split(/\s+/)[0],f=new Date().getHours(),g=f<12?"Good morning":f<18?"Good afternoon":"Good evening",_=r.compliance.length?Math.round(e/r.compliance.length*100):0,T=[...r.downloads].slice(0,3),A=r.downloads.find(C=>/acknowledg|itr.?v|return/i.test(`${C.category??""} ${C.fileName}`));return E.jsxs(E.Fragment,{children:[E.jsxs("section",{className:"welcome-row",children:[E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"YOUR CLIENT SPACE"}),E.jsxs("h1",{children:[g,", ",h,E.jsx("span",{className:"wave",children:"✳"})]}),E.jsx("p",{children:"Your financial picture, all in one calm place."})]}),E.jsxs("button",{className:"outline-button",onClick:()=>s("Compliance"),children:[E.jsx(nP,{size:16})," View compliance ",E.jsx(Ao,{size:15})]})]}),E.jsxs("section",{className:"insight-banner",children:[E.jsx("div",{className:"insight-symbol",children:E.jsx(Ri,{size:21})}),E.jsxs("div",{className:"insight-copy",children:[E.jsx("span",{children:"YOUR COMPLIANCE SNAPSHOT"}),E.jsx("strong",{children:t===0?"You're all caught up.":`${t} ${t===1?"item needs":"items need"} your attention.`}),E.jsx("p",{children:t===0?"Everything on your profile is marked complete. Keep your documents close, just in case.":"Take a moment to review what's coming up. Your next step is right below."})]}),E.jsxs("div",{className:"insight-score",children:[E.jsx("div",{className:"score-donut",style:{"--progress":`${_}%`},children:E.jsxs("span",{children:[_,E.jsx("small",{children:"%"})]})}),E.jsx("span",{children:"On track"})]}),E.jsx(Ri,{className:"banner-sparkle",size:86})]}),E.jsxs("section",{className:"stats-grid",children:[E.jsx(Ud,{icon:E.jsx(yp,{size:17}),label:"Compliance items",value:String(r.compliance.length),meta:`${e} completed`,tone:"lavender"}),E.jsx(Ud,{icon:E.jsx(iw,{size:17}),label:"Needs attention",value:String(t),meta:t===0?"Nothing due right now":"Review your checklist",tone:"peach"}),E.jsx(Ud,{icon:E.jsx(dl,{size:17}),label:"Your documents",value:String(r.downloads.length),meta:"Ready when you need them",tone:"mint"})]}),E.jsxs("div",{className:"content-grid",children:[E.jsxs("section",{className:"surface-card compliance-card",children:[E.jsxs("div",{className:"section-heading",children:[E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"STAY ON TRACK"}),E.jsx("h2",{children:"Compliance checklist"})]}),E.jsxs("button",{className:"link-button",onClick:()=>s("Compliance"),children:["View all ",E.jsx(Ao,{size:15})]})]}),r.compliance.length===0?E.jsx(fl,{icon:E.jsx(gp,{size:21}),title:"Your checklist is clear",text:"Compliance items linked to your client profile will show up here."}):E.jsx("div",{className:"checklist",children:r.compliance.slice(0,4).map((C,z)=>E.jsx(lw,{item:C},`${C.name}-${z}`))})]}),E.jsxs("section",{className:"surface-card documents-card",children:[E.jsxs("div",{className:"section-heading",children:[E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"YOUR FILES"}),E.jsx("h2",{children:"Recent documents"})]}),E.jsx("button",{className:"icon-button","aria-label":"View all documents",onClick:()=>s("Documents"),children:E.jsx(mp,{size:18})})]}),T.length===0?E.jsx(fl,{icon:E.jsx(dl,{size:21}),title:"Your files live here",text:"Documents added to your client profile will be ready to download."}):E.jsx("div",{className:"file-list",children:T.map((C,z)=>E.jsx(yf,{file:C,onDownload:o,busy:l===C.storagePath},`${C.storagePath}-${z}`))})]})]}),A&&E.jsxs("section",{className:"ack-banner",children:[E.jsx("div",{className:"ack-icon",children:E.jsx(sw,{size:20})}),E.jsxs("div",{children:[E.jsx("strong",{children:"Your tax filing acknowledgement is ready"}),E.jsxs("span",{children:[A.fileName," · Available in your documents"]})]}),E.jsxs("button",{className:"outline-button small-button",disabled:l===A.storagePath,onClick:()=>o(A),children:[l===A.storagePath?E.jsx(ps,{size:15,className:"spin"}):E.jsx(nw,{size:15})," Download"]})]})]})}function pP({client:r}){return E.jsxs(E.Fragment,{children:[E.jsxs("section",{className:"page-title",children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"YOUR CHECKLIST"}),E.jsx("h1",{children:"Compliance"}),E.jsx("p",{children:"A clear view of the filings and requirements on your client profile."})]}),E.jsxs("section",{className:"surface-card full-list-card",children:[E.jsxs("div",{className:"section-heading",children:[E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"CLIENT ID"}),E.jsx("h2",{children:r.id})]}),E.jsxs("span",{className:"client-id-pill",children:[E.jsx(yp,{size:14})," Verified account"]})]}),r.compliance.length===0?E.jsx(fl,{icon:E.jsx(gp,{size:21}),title:"You're all caught up",text:"There are no compliance items on your profile yet."}):E.jsx("div",{className:"checklist expanded-checklist",children:r.compliance.map((e,t)=>E.jsx(lw,{item:e,detailed:!0},`${e.name}-${t}`))})]})]})}function mP({client:r,downloadFile:e,downloadBusy:t}){const s=r.downloads.filter(l=>/acknowledg|itr.?v|return/i.test(`${l.category??""} ${l.fileName}`)),o=r.downloads.filter(l=>!s.includes(l));return E.jsxs(E.Fragment,{children:[E.jsxs("section",{className:"page-title",children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"YOUR PRIVATE FILES"}),E.jsx("h1",{children:"Documents"}),E.jsx("p",{children:"Important tax records and data, ready to download securely."})]}),E.jsxs("section",{className:"surface-card full-list-card",children:[E.jsxs("div",{className:"section-heading",children:[E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"TAX RECORDS"}),E.jsx("h2",{children:"Filing acknowledgements"})]}),E.jsxs("span",{className:"count-pill",children:[s.length," files"]})]}),s.length===0?E.jsx(fl,{icon:E.jsx(sw,{size:21}),title:"No acknowledgements yet",text:"Your tax-return filing acknowledgements will appear here when they are added to your profile."}):E.jsx("div",{className:"file-list expanded-files",children:s.map((l,h)=>E.jsx(yf,{file:l,onDownload:e,busy:t===l.storagePath},`${l.storagePath}-${h}`))})]}),E.jsxs("section",{className:"surface-card full-list-card",children:[E.jsxs("div",{className:"section-heading",children:[E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"YOUR DATA"}),E.jsx("h2",{children:"Other documents"})]}),E.jsxs("span",{className:"count-pill",children:[o.length," files"]})]}),o.length===0?E.jsx(fl,{icon:E.jsx(dl,{size:21}),title:"No other documents yet",text:"Client data exports and supporting documents will show up here."}):E.jsx("div",{className:"file-list expanded-files",children:o.map((l,h)=>E.jsx(yf,{file:l,onDownload:e,busy:t===l.storagePath},`${l.storagePath}-${h}`))})]})]})}function lw({item:r,detailed:e=!1}){const t=/complete|compliant|done/i.test(r.status);return E.jsxs("div",{className:"compliance-row",children:[E.jsx("span",{className:`status-icon ${t?"status-done":"status-pending"}`,children:t?E.jsx(pf,{size:15}):E.jsx(iw,{size:15})}),E.jsxs("div",{className:"compliance-copy",children:[E.jsx("strong",{children:r.name}),e&&r.details&&E.jsx("p",{children:r.details}),r.dueDate&&E.jsxs("span",{children:[e?"Due":""," ",uw(r.dueDate)]})]}),E.jsx("span",{className:`status-chip ${t?"chip-done":"chip-pending"}`,children:r.status})]})}function yf({file:r,onDownload:e,busy:t}){return E.jsxs("div",{className:"file-row",children:[E.jsx("span",{className:"file-icon",children:E.jsx(dl,{size:17})}),E.jsxs("div",{className:"file-copy",children:[E.jsx("strong",{children:r.fileName}),E.jsxs("span",{children:[r.category||"Client document",r.uploadedAt?` · ${uw(r.uploadedAt)}`:""]})]}),E.jsx("button",{className:"download-button",disabled:t,"aria-label":`Download ${r.fileName}`,onClick:()=>e(r),children:t?E.jsx(ps,{size:17,className:"spin"}):E.jsx(nw,{size:17})})]})}function Ud({icon:r,label:e,value:t,meta:s,tone:o}){return E.jsxs("div",{className:"stat-card",children:[E.jsxs("div",{className:"stat-top",children:[E.jsx("span",{children:e}),E.jsx("span",{className:`stat-icon ${o}`,children:r})]}),E.jsx("div",{className:"stat-value",children:t}),E.jsx("span",{className:"stat-meta",children:s})]})}function zd({icon:r,label:e,active:t,onClick:s,badge:o}){return E.jsxs("button",{className:`nav-item ${t?"nav-active":""}`,onClick:s,children:[r,E.jsx("span",{children:e}),o&&E.jsx("span",{className:"nav-badge",children:o})]})}function fl({icon:r,title:e,text:t}){return E.jsxs("div",{className:"empty-state",children:[E.jsx("span",{className:"empty-icon",children:r}),E.jsx("strong",{children:e}),E.jsx("p",{children:t})]})}function gP({title:r,onClose:e,children:t}){return E.jsx("div",{className:"modal-backdrop",role:"presentation",onMouseDown:s=>{s.target===s.currentTarget&&e()},children:E.jsxs("section",{className:"modal-card",role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",children:[E.jsxs("div",{className:"modal-heading",children:[E.jsx("h2",{id:"modal-title",children:r}),E.jsx("button",{className:"icon-button","aria-label":"Close dialog",onClick:e,children:E.jsx(gf,{size:19})})]}),t]})})}function yP(){return E.jsxs("div",{className:"setup-screen",children:[E.jsx("span",{className:"brand-mark",children:E.jsx(Ri,{size:19})}),E.jsxs("div",{children:[E.jsx("span",{className:"eyebrow muted-eyebrow",children:"ALMOST THERE"}),E.jsx("h1",{children:"Connect your Firebase project"}),E.jsxs("p",{children:["Add the Firebase web app settings to a ",E.jsx("code",{children:".env"})," file in the project root. See ",E.jsx("code",{children:"README.md"})," for the full setup."]}),E.jsx("pre",{children:`VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_APP_ID=your-app-id`})]})]})}function _P(){return E.jsxs("div",{className:"loading-screen",children:[E.jsx("span",{className:"brand-mark",children:E.jsx(Ri,{size:19})}),E.jsx(ps,{size:22,className:"spin"}),E.jsx("span",{children:"Opening your client space…"})]})}function vP(){return E.jsxs("svg",{"aria-hidden":"true",viewBox:"0 0 48 48",width:"18",height:"18",children:[E.jsx("path",{fill:"#EA4335",d:"M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z",transform:"translate(0 4)"}),E.jsx("path",{fill:"#4285F4",d:"M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6c4.51-4.17 7.07-10.31 7.07-17.65Z",transform:"translate(0 -1)"}),E.jsx("path",{fill:"#FBBC05",d:"M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.95 23.95 0 0 0 0 21.56l7.98-6.19Z",transform:"translate(0 2)"}),E.jsx("path",{fill:"#34A853",d:"M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z",transform:"translate(0 -4)"})]})}function E_(r,e){return(r||e||"Client").split(/[\s@.]+/).filter(Boolean).slice(0,2).map(s=>{var o;return(o=s[0])==null?void 0:o.toUpperCase()}).join("")}function uw(r){const e=new Date(r);return Number.isNaN(e.getTime())?r:new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(e)}I0.createRoot(document.getElementById("root")).render(E.jsx(g0.StrictMode,{children:E.jsx(hP,{})}));
