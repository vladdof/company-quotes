(function(e){function t(t){for(var a,n,s=t[0],u=t[1],i=t[2],p=0,f=[];p<s.length;p++)n=s[p],Object.prototype.hasOwnProperty.call(r,n)&&r[n]&&f.push(r[n][0]),r[n]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(e[a]=u[a]);d&&d(t);while(f.length)f.shift()();return c.push.apply(c,i||[]),o()}function o(){for(var e,t=0;t<c.length;t++){for(var o=c[t],a=!0,n=1;n<o.length;n++){var s=o[n];0!==r[s]&&(a=!1)}a&&(c.splice(t--,1),e=u(u.s=o[0]))}return e}var a={},n={app:0},r={app:0},c=[];function s(e){return u.p+"js/"+({"page-stock~page-stocks":"page-stock~page-stocks","page-stock":"page-stock","page-stocks":"page-stocks"}[e]||e)+"."+{"page-stock~page-stocks":"caaece66","page-stock":"29191e18","page-stocks":"184e5504"}[e]+".js"}function u(t){if(a[t])return a[t].exports;var o=a[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,u),o.l=!0,o.exports}u.e=function(e){var t=[],o={"page-stock~page-stocks":1};n[e]?t.push(n[e]):0!==n[e]&&o[e]&&t.push(n[e]=new Promise((function(t,o){for(var a="css/"+({"page-stock~page-stocks":"page-stock~page-stocks","page-stock":"page-stock","page-stocks":"page-stocks"}[e]||e)+"."+{"page-stock~page-stocks":"96be1b0c","page-stock":"31d6cfe0","page-stocks":"31d6cfe0"}[e]+".css",r=u.p+a,c=document.getElementsByTagName("link"),s=0;s<c.length;s++){var i=c[s],p=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(p===a||p===r))return t()}var f=document.getElementsByTagName("style");for(s=0;s<f.length;s++){i=f[s],p=i.getAttribute("data-href");if(p===a||p===r)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var a=t&&t.target&&t.target.src||r,c=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=a,delete n[e],d.parentNode.removeChild(d),o(c)},d.href=r;var l=document.getElementsByTagName("head")[0];l.appendChild(d)})).then((function(){n[e]=0})));var a=r[e];if(0!==a)if(a)t.push(a[2]);else{var c=new Promise((function(t,o){a=r[e]=[t,o]}));t.push(a[2]=c);var i,p=document.createElement("script");p.charset="utf-8",p.timeout=120,u.nc&&p.setAttribute("nonce",u.nc),p.src=s(e);var f=new Error;i=function(t){p.onerror=p.onload=null,clearTimeout(d);var o=r[e];if(0!==o){if(o){var a=t&&("load"===t.type?"missing":t.type),n=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+a+": "+n+")",f.name="ChunkLoadError",f.type=a,f.request=n,o[1](f)}r[e]=void 0}};var d=setTimeout((function(){i({type:"timeout",target:p})}),12e4);p.onerror=p.onload=i,document.head.appendChild(p)}return Promise.all(t)},u.m=e,u.c=a,u.d=function(e,t,o){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(u.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)u.d(o,a,function(t){return e[t]}.bind(null,a));return o},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/company-quotes/",u.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],p=i.push.bind(i);i.push=t,i=i.slice();for(var f=0;f<i.length;f++)t(i[f]);var d=p;c.push([0,"chunk-vendors"]),o()})({0:function(e,t,o){e.exports=o("56d7")},"56d7":function(e,t,o){"use strict";o.r(t);o("e260"),o("e6cf"),o("cca6"),o("a79d");var a=o("7a23");function n(e,t,o,n,r,c){var s=Object(a["v"])("router-view");return Object(a["q"])(),Object(a["d"])(s)}var r={name:"App"},c=o("6b0d"),s=o.n(c);const u=s()(r,[["render",n]]);var i=u,p=(o("d3b7"),o("3ca3"),o("ddb0"),o("6c02")),f={ROOT:{PATH:"/",NAME:"page-stocks"},STOCK:{PATH:"/stock/:symbol",NAME:"page-stock"}},d=[{path:f.ROOT.PATH,name:f.ROOT.NAME,component:function(){return Promise.all([o.e("page-stock~page-stocks"),o.e("page-stocks")]).then(o.bind(null,"41a1"))}},{path:f.STOCK.PATH,name:f.STOCK.NAME,component:function(){return Promise.all([o.e("page-stock~page-stocks"),o.e("page-stock")]).then(o.bind(null,"a4e5"))},props:!0}],l=Object(p["a"])({history:Object(p["b"])("/company-quotes/"),routes:d}),g=l,m=(o("99af"),o("5502")),h=o("bc3a"),k=o.n(h),v=o("db49"),b=Object(m["a"])({state:{stocks:[],fx:[],quote:[],forex:{}},getters:{getStocks:function(e){return e.stocks},getFx:function(e){return e.fx},getQuote:function(e){return e.quote},getForex:function(e){return e.forex}},mutations:{setDefaultStocks:function(e){e.stocks=[]},addStocks:function(e,t){e.stocks.push(t)},addFx:function(e,t){e.fx.push(t)},addQuote:function(e,t){e.quote.push(t)},addForex:function(e,t){e.forex={data:t}}},actions:{fetchDataStocks:function(e,t){var o=e.commit,a=t.symbol;return o("setDefaultStocks"),k()({method:"get",url:"".concat(v["a"].apiUrl,"/v3/profile/").concat(a),params:{apikey:v["a"].apiKey},crossDomain:!0}).then((function(e){e.data["Error Message"]||o("addStocks",e.data[0])}))},fetchFx:function(e){var t=e.commit;return k()({method:"get",url:"".concat(v["a"].apiUrl,"/v3/fx/EURUSD"),params:{apikey:v["a"].apiKey},crossDomain:!0}).then((function(e){e.data["Error Message"]||t("addFx",e.data[0])}))},fetchQuote:function(e){var t=e.commit;return k()({method:"get",url:"".concat(v["a"].apiUrl,"/v3/quote/BTCUSD"),params:{apikey:v["a"].apiKey},crossDomain:!0}).then((function(e){e.data["Error Message"]||t("addQuote",e.data[0])}))},fetchForex:function(e){var t=e.commit;return k()({method:"get",url:"".concat(v["a"].apiUrl,"/v3/forex"),params:{apikey:v["a"].apiKey},crossDomain:!0}).then((function(e){e.data["Error Message"]||t("addForex",e.data[0])}))}}}),y=(o("b383"),Object(a["c"])(i));y.use(g).use(b).mount("#app")},b383:function(e,t,o){},db49:function(e,t,o){"use strict";t["a"]={apiUrl:"https://financialmodelingprep.com/api",apiKey:"d8ed336ddcddad19f8ed0ab6333e6193",companies:["BABA","AAPL","FB","GOOG","ADBE","AMZN","HOG","CSCO","DIS","KO","INTC","MA"]}}});
//# sourceMappingURL=app.ddc5e4f1.js.map