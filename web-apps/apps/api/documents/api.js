(()=>{"use strict";class t{handler;queue;debug;constructor(t){this.handler=void 0,this.queue=[],this.debug=t}setHandler(t){if(this.handler=this.debug?e=>{console.log(this.debug,e),t(e)}:t,this.queue.length>0){for(const t of this.queue)this.handler(t);this.queue=[]}}fire(t){const e=structuredClone(t);this.handler?setTimeout((()=>this.handler(e))):this.queue.push(e)}}function e(t,n){const o=t,i=n;if("object"!=typeof o)return i;const r=Object.assign({},o);for(const t of Object.keys(i))r[t]=e(o[t],i[t]);return r}function n(){}function o(t=!1){const e=[];let n=!1;return{reg:function(o){t&&n?setTimeout(o):e.push(o)},unreg:function(t){-1!==e.indexOf(t)?e.splice(e.indexOf(t),1):console.log("event handler was already unregistered")},fire:function(...o){t&&n||(n=!0,e.forEach((t=>{t(...o)})))}}}let i;const r=async function(){let t,e;for(const n of document.getElementsByTagName("script"))if(n.src.endsWith("web-apps/apps/api/documents/api.js")){t=n.src,e=n;break}const n=document.createElement("script");n.setAttribute("type","text/javascript"),n.setAttribute("src",new URL("api-orig.js",t).href);const o=(r=n,"load",new Promise((t=>{r.addEventListener("load",(()=>t()),{once:!0})})));var r;e.after(n),await o;const c=window;i=c.DocsAPI.DocEditor,c.DocsAPI.DocEditor=s}();class s{waitForAppReady;origEditor;fromOOHandler=new t;toOOHandler=new t;placeholderId;constructor(t,e){this.placeholderId=t,this.init(e).catch((t=>{console.error(t)}))}async init(t){let o;await r,this.waitForAppReady=new Promise((t=>{o=t})),this.waitForAppReady.then(t?.events?.onAppReady??n).catch(n);const s=e(t,{events:{onAppReady:o}});this.origEditor=new i(this.placeholderId,s);const c=window;c.APP=c.APP??{},c.APP.setToOOHandler=t=>{this.toOOHandler.setHandler(t)},c.APP.sendMessageFromOO=t=>{this.fromOOHandler.fire(t)}}installLegacyChannel(){const t=o(),e=this.getIframe().contentWindow;window.addEventListener("message",(n=>{n.source===e&&t.fire(n)})),function(t,e,n){let i=!1;const r=[],s=o(!0);t.reg((function(n){if(i)return;const o=n.data;if("_READY"===o)return e("_READY"),i=!0,s.fire(),void r.forEach((function(e){t.fire(e)}));r.push(o)}));const c={},a={},d={},u=[],f={},l={query:function(t,n,o,i){const r=Math.random().toString(16).replace("0.","")+Math.random().toString(16).replace("0.",""),c=(i=i||{}).timeout||3e4;let u;c>0&&(u=setTimeout((function(){delete a[r],o("TIMEOUT")}),c)),d[r]=function(t){clearTimeout(u),delete d[r],t&&(delete a[r],o("UNHANDLED"))},a[r]=function(t,e){delete a[r],o(void 0,t.content,e)},s.reg((function(){const o={txid:r,content:n,q:t,raw:i.raw};e(i.raw?o:JSON.stringify(o))}))}},h=l.event=function(t,n,o){o=o||{},s.reg((function(){const i={content:n,q:t,raw:o.raw};e(o.raw?i:JSON.stringify(i))}))};l.on=function(t,n,o){const i=function(t,o,i){n(t.content,(function(n){const o={txid:t.txid,content:n};e(i?o:JSON.stringify(o))}),o)};return(c[t]=c[t]||[]).push(i),o||h("EV_REGISTER_HANDLER",t),{stop:function(){const e=c[t].indexOf(i);-1!==e&&c[t].splice(e,1)}}},l.whenReg=function(t,e,n){let o=n;u.indexOf(t)>-1?e():o=!0,o&&(f[t]=f[t]||[]).push(e)},l.onReg=function(t,e){l.whenReg(t,e,!0)},l.on("EV_REGISTER_HANDLER",(function(t){f[t]&&(f[t].forEach((function(t){t()})),delete f[t]),u.push(t)}));let p=!1;l.onReady=function(t){p?t():"function"==typeof t&&l.on("EV_RPC_READY",(function(){p=!0,t()}))},l.ready=function(){l.whenReg("EV_RPC_READY",(function(){l.event("EV_RPC_READY")}))},t.reg((function(t){if(!i)return;if(!t.data||"_READY"===t.data)return;let n;try{n="object"==typeof t.data?t.data:JSON.parse(t.data)}catch(t){return void console.warn(t)}void 0!==n.ack?d[n.txid]&&d[n.txid](!n.ack):"string"==typeof n.q?c[n.q]?(n.txid&&e(JSON.stringify({txid:n.txid,ack:!0})),c[n.q].forEach((function(e){e(n||JSON.parse(t.data),t,n&&n.raw),n=void 0}))):n.txid&&e(JSON.stringify({txid:n.txid,ack:!1})):void 0===n.q&&a[n.txid]&&a[n.txid](n,t)})),e("_READY"),n(l)}(t,(t=>{e.postMessage(t)}),(t=>{this.toOOHandler.setHandler((e=>{t.event("CMD",e)})),t.on("CMD",(t=>{this.fromOOHandler.fire(t)}))}))}destroyEditor(){this.origEditor.destroyEditor()}getIframe(){return document.querySelector('iframe[name="frameEditor"]')}injectCSS(t){const e=this.getIframe().contentDocument.querySelector("head"),n=document.createElement("style");n.innerText=t,e.appendChild(n)}sendMessageToOO(t){this.toOOHandler.fire(t)}setOnMessageFromOOHandler(t){this.fromOOHandler.setHandler(t)}}})();