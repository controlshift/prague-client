/*!
 * Pusher JavaScript Library v2.1.6
 * http://pusherapp.com/
 *
 * Copyright 2013, Pusher
 * Released under the MIT licence.
 */

(function(){function b(a,d){(a===null||a===void 0)&&b.warn("Warning","You must pass your app key when you instantiate Pusher.");var d=d||{},c=this;this.key=a;this.config=b.Util.extend(b.getGlobalConfig(),d.cluster?b.getClusterConfig(d.cluster):{},d);this.channels=new b.Channels;this.global_emitter=new b.EventsDispatcher;this.sessionID=Math.floor(Math.random()*1E9);this.timeline=new b.Timeline(this.key,this.sessionID,{features:b.Util.getClientFeatures(),params:this.config.timelineParams||{},limit:50,
level:b.Timeline.INFO,version:b.VERSION});if(!this.config.disableStats)this.timelineSender=new b.TimelineSender(this.timeline,{host:this.config.statsHost,path:"/timeline"});this.connection=new b.ConnectionManager(this.key,b.Util.extend({getStrategy:function(a){return b.StrategyBuilder.build(b.getDefaultStrategy(c.config),b.Util.extend({},c.config,a))},timeline:this.timeline,activityTimeout:this.config.activity_timeout,pongTimeout:this.config.pong_timeout,unavailableTimeout:this.config.unavailable_timeout},
this.config,{encrypted:this.isEncrypted()}));this.connection.bind("connected",function(){c.subscribeAll();c.timelineSender&&c.timelineSender.send(c.connection.isEncrypted())});this.connection.bind("message",function(a){var d=a.event.indexOf("pusher_internal:")===0;if(a.channel){var b=c.channel(a.channel);b&&b.handleEvent(a.event,a.data)}d||c.global_emitter.emit(a.event,a.data)});this.connection.bind("disconnected",function(){c.channels.disconnect()});this.connection.bind("error",function(a){b.warn("Error",
a)});b.instances.push(this);this.timeline.info({instances:b.instances.length});b.isReady&&c.connect()}var c=b.prototype;b.instances=[];b.isReady=!1;b.debug=function(){b.log&&b.log(b.Util.stringify.apply(this,arguments))};b.warn=function(){var a=b.Util.stringify.apply(this,arguments);window.console&&(window.console.warn?window.console.warn(a):window.console.log&&window.console.log(a));b.log&&b.log(a)};b.ready=function(){b.isReady=!0;for(var a=0,d=b.instances.length;a<d;a++)b.instances[a].connect()};
c.channel=function(a){return this.channels.find(a)};c.allChannels=function(){return this.channels.all()};c.connect=function(){this.connection.connect();if(this.timelineSender&&!this.timelineSenderTimer){var a=this.connection.isEncrypted(),d=this.timelineSender;this.timelineSenderTimer=new b.PeriodicTimer(6E4,function(){d.send(a)})}};c.disconnect=function(){this.connection.disconnect();if(this.timelineSenderTimer)this.timelineSenderTimer.ensureAborted(),this.timelineSenderTimer=null};c.bind=function(a,
d){this.global_emitter.bind(a,d);return this};c.bind_all=function(a){this.global_emitter.bind_all(a);return this};c.subscribeAll=function(){for(var a in this.channels.channels)this.channels.channels.hasOwnProperty(a)&&this.subscribe(a)};c.subscribe=function(a){a=this.channels.add(a,this);this.connection.state==="connected"&&a.subscribe();return a};c.unsubscribe=function(a){a=this.channels.remove(a);this.connection.state==="connected"&&a.unsubscribe()};c.send_event=function(a,d,b){return this.connection.send_event(a,
d,b)};c.isEncrypted=function(){return b.Util.getDocumentLocation().protocol==="https:"?!0:Boolean(this.config.encrypted)};this.Pusher=b}).call(this);(function(){function b(a,d){var b=this;this.timeout=setTimeout(function(){if(b.timeout!==null)d(),b.timeout=null},a)}var c=b.prototype;c.isRunning=function(){return this.timeout!==null};c.ensureAborted=function(){if(this.timeout)clearTimeout(this.timeout),this.timeout=null};Pusher.Timer=b}).call(this);
(function(){function b(a,d){var b=this;this.interval=setInterval(function(){b.interval!==null&&d()},a)}var c=b.prototype;c.isRunning=function(){return this.interval!==null};c.ensureAborted=function(){if(this.interval)clearInterval(this.interval),this.interval=null};Pusher.PeriodicTimer=b}).call(this);
(function(){Pusher.Util={now:function(){return Date.now?Date.now():(new Date).valueOf()},defer:function(b){return new Pusher.Timer(0,b)},extend:function(b){for(var c=1;c<arguments.length;c++){var a=arguments[c],d;for(d in a)b[d]=a[d]&&a[d].constructor&&a[d].constructor===Object?Pusher.Util.extend(b[d]||{},a[d]):a[d]}return b},stringify:function(){for(var b=["Pusher"],c=0;c<arguments.length;c++)typeof arguments[c]==="string"?b.push(arguments[c]):window.JSON===void 0?b.push(arguments[c].toString()):
b.push(JSON.stringify(arguments[c]));return b.join(" : ")},arrayIndexOf:function(b,c){var a=Array.prototype.indexOf;if(b===null)return-1;if(a&&b.indexOf===a)return b.indexOf(c);for(var a=0,d=b.length;a<d;a++)if(b[a]===c)return a;return-1},objectApply:function(b,c){for(var a in b)Object.prototype.hasOwnProperty.call(b,a)&&c(b[a],a,b)},keys:function(b){var c=[];Pusher.Util.objectApply(b,function(a,d){c.push(d)});return c},values:function(b){var c=[];Pusher.Util.objectApply(b,function(a){c.push(a)});
return c},apply:function(b,c){for(var a=0;a<b.length;a++)c(b[a],a,b)},map:function(b,c){for(var a=[],d=0;d<b.length;d++)a.push(c(b[d],d,b,a));return a},mapObject:function(b,c){var a={};Pusher.Util.objectApply(b,function(d,b){a[b]=c(d)});return a},filter:function(b,c){for(var c=c||function(a){return!!a},a=[],d=0;d<b.length;d++)c(b[d],d,b,a)&&a.push(b[d]);return a},filterObject:function(b,c){var a={};Pusher.Util.objectApply(b,function(d,h){if(c&&c(d,h,b,a)||Boolean(d))a[h]=d});return a},flatten:function(b){var c=
[];Pusher.Util.objectApply(b,function(a,d){c.push([d,a])});return c},any:function(b,c){for(var a=0;a<b.length;a++)if(c(b[a],a,b))return!0;return!1},all:function(b,c){for(var a=0;a<b.length;a++)if(!c(b[a],a,b))return!1;return!0},method:function(b){var c=Array.prototype.slice.call(arguments,1);return function(a){return a[b].apply(a,c.concat(arguments))}},getDocument:function(){return document},getDocumentLocation:function(){return Pusher.Util.getDocument().location},getLocalStorage:function(){try{return window.localStorage}catch(b){}},
getClientFeatures:function(){return Pusher.Util.keys(Pusher.Util.filterObject({ws:Pusher.WSTransport,flash:Pusher.FlashTransport},function(b){return b.isSupported()}))}}}).call(this);
(function(){Pusher.VERSION="2.1.6";Pusher.PROTOCOL=7;Pusher.host="ws.pusherapp.com";Pusher.ws_port=80;Pusher.wss_port=443;Pusher.sockjs_host="sockjs.pusher.com";Pusher.sockjs_http_port=80;Pusher.sockjs_https_port=443;Pusher.sockjs_path="/pusher";Pusher.stats_host="stats.pusher.com";Pusher.channel_auth_endpoint="/pusher/auth";Pusher.channel_auth_transport="ajax";Pusher.activity_timeout=12E4;Pusher.pong_timeout=3E4;Pusher.unavailable_timeout=1E4;Pusher.cdn_http="http://js.pusher.com/";Pusher.cdn_https=
"https://d3dy5gmtp8yhk7.cloudfront.net/";Pusher.dependency_suffix=".min";Pusher.getDefaultStrategy=function(b){return[[":def","ws_options",{hostUnencrypted:b.wsHost+":"+b.wsPort,hostEncrypted:b.wsHost+":"+b.wssPort}],[":def","sockjs_options",{hostUnencrypted:b.httpHost+":"+b.httpPort,hostEncrypted:b.httpHost+":"+b.httpsPort}],[":def","timeouts",{loop:!0,timeout:15E3,timeoutLimit:6E4}],[":def","ws_manager",[":transport_manager",{lives:2,minPingDelay:1E4,maxPingDelay:b.activity_timeout}]],[":def_transport",
"ws","ws",3,":ws_options",":ws_manager"],[":def_transport","flash","flash",2,":ws_options",":ws_manager"],[":def_transport","sockjs","sockjs",1,":sockjs_options"],[":def","ws_loop",[":sequential",":timeouts",":ws"]],[":def","flash_loop",[":sequential",":timeouts",":flash"]],[":def","sockjs_loop",[":sequential",":timeouts",":sockjs"]],[":def","strategy",[":cached",18E5,[":first_connected",[":if",[":is_supported",":ws"],[":best_connected_ever",":ws_loop",[":delayed",2E3,[":sockjs_loop"]]],[":if",[":is_supported",
":flash"],[":best_connected_ever",":flash_loop",[":delayed",2E3,[":sockjs_loop"]]],[":sockjs_loop"]]]]]]]}}).call(this);
(function(){Pusher.getGlobalConfig=function(){return{wsHost:Pusher.host,wsPort:Pusher.ws_port,wssPort:Pusher.wss_port,httpHost:Pusher.sockjs_host,httpPort:Pusher.sockjs_http_port,httpsPort:Pusher.sockjs_https_port,httpPath:Pusher.sockjs_path,statsHost:Pusher.stats_host,authEndpoint:Pusher.channel_auth_endpoint,authTransport:Pusher.channel_auth_transport,activity_timeout:Pusher.activity_timeout,pong_timeout:Pusher.pong_timeout,unavailable_timeout:Pusher.unavailable_timeout}};Pusher.getClusterConfig=
function(b){return{wsHost:"ws-"+b+".pusher.com",httpHost:"sockjs-"+b+".pusher.com"}}}).call(this);(function(){function b(b){var a=function(a){Error.call(this,a);this.name=b};Pusher.Util.extend(a.prototype,Error.prototype);return a}Pusher.Errors={BadEventName:b("BadEventName"),UnsupportedTransport:b("UnsupportedTransport"),UnsupportedStrategy:b("UnsupportedStrategy"),TransportPriorityTooLow:b("TransportPriorityTooLow"),TransportClosed:b("TransportClosed")}}).call(this);
(function(){function b(a){this.callbacks=new c;this.global_callbacks=[];this.failThrough=a}function c(){this._callbacks={}}var a=b.prototype;a.bind=function(a,b){this.callbacks.add(a,b);return this};a.bind_all=function(a){this.global_callbacks.push(a);return this};a.unbind=function(a,b){this.callbacks.remove(a,b);return this};a.emit=function(a,b){var c;for(c=0;c<this.global_callbacks.length;c++)this.global_callbacks[c](a,b);var f=this.callbacks.get(a);if(f&&f.length>0)for(c=0;c<f.length;c++)f[c](b);
else this.failThrough&&this.failThrough(a,b);return this};c.prototype.get=function(a){return this._callbacks[this._prefix(a)]};c.prototype.add=function(a,b){var c=this._prefix(a);this._callbacks[c]=this._callbacks[c]||[];this._callbacks[c].push(b)};c.prototype.remove=function(a,b){if(this.get(a)){var c=Pusher.Util.arrayIndexOf(this.get(a),b);if(c!==-1){var f=this._callbacks[this._prefix(a)].slice(0);f.splice(c,1);this._callbacks[this._prefix(a)]=f}}};c.prototype._prefix=function(a){return"_"+a};Pusher.EventsDispatcher=
b}).call(this);
(function(){function b(a){this.options=a;this.loading={};this.loaded={}}function c(a,b){Pusher.Util.getDocument().addEventListener?a.addEventListener("load",b,!1):a.attachEvent("onreadystatechange",function(){(a.readyState==="loaded"||a.readyState==="complete")&&b()})}function a(a,b){var d=Pusher.Util.getDocument(),g=d.getElementsByTagName("head")[0],d=d.createElement("script");d.setAttribute("src",a);d.setAttribute("type","text/javascript");d.setAttribute("async",!0);c(d,function(){setTimeout(b,0)});
g.appendChild(d)}var d=b.prototype;d.load=function(b,d){var c=this;this.loaded[b]?d():this.loading[b]&&this.loading[b].length>0?this.loading[b].push(d):(this.loading[b]=[d],a(this.getPath(b),function(){c.loaded[b]=!0;if(c.loading[b]){for(var a=0;a<c.loading[b].length;a++)c.loading[b][a]();delete c.loading[b]}}))};d.getRoot=function(a){var b=Pusher.Util.getDocumentLocation().protocol;return(a&&a.encrypted||b==="https:"?this.options.cdn_https:this.options.cdn_http).replace(/\/*$/,"")+"/"+this.options.version};
d.getPath=function(a,b){return this.getRoot(b)+"/"+a+this.options.suffix+".js"};Pusher.DependencyLoader=b}).call(this);
(function(){function b(){Pusher.ready()}function c(a){document.body?a():setTimeout(function(){c(a)},0)}function a(){c(b)}Pusher.Dependencies=new Pusher.DependencyLoader({cdn_http:Pusher.cdn_http,cdn_https:Pusher.cdn_https,version:Pusher.VERSION,suffix:Pusher.dependency_suffix});if(!window.WebSocket&&window.MozWebSocket)window.WebSocket=window.MozWebSocket;window.JSON?a():Pusher.Dependencies.load("json2",a)})();
(function(){for(var b=String.fromCharCode,c=0;c<64;c++)"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c);var a=function(a){var d=a.charCodeAt(0);return d<128?a:d<2048?b(192|d>>>6)+b(128|d&63):b(224|d>>>12&15)+b(128|d>>>6&63)+b(128|d&63)},d=function(a){var b=[0,2,1][a.length%3],a=a.charCodeAt(0)<<16|(a.length>1?a.charCodeAt(1):0)<<8|(a.length>2?a.charCodeAt(2):0);return["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>18),"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>
12&63),b>=2?"=":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>6&63),b>=1?"=":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a&63)].join("")},h=window.btoa||function(a){return a.replace(/[\s\S]{1,3}/g,d)};Pusher.Base64={encode:function(b){return h(b.replace(/[^\x00-\x7F]/g,a))}}}).call(this);
(function(){function b(a){this.options=a}function c(a){return Pusher.Util.mapObject(a,function(a){typeof a==="object"&&(a=JSON.stringify(a));return encodeURIComponent(Pusher.Base64.encode(a.toString()))})}b.send=function(a,b){var c=new Pusher.JSONPRequest({url:a.url,receiver:a.receiverName,tagPrefix:a.tagPrefix}),f=a.receiver.register(function(a,d){c.cleanup();b(a,d)});return c.send(f,a.data,function(b){var c=a.receiver.unregister(f);c&&c(b)})};var a=b.prototype;a.send=function(a,b,e){if(this.script)return!1;
var f=this.options.tagPrefix||"_pusher_jsonp_",b=Pusher.Util.extend({},b,{receiver:this.options.receiver}),b=Pusher.Util.map(Pusher.Util.flatten(c(Pusher.Util.filterObject(b,function(a){return a!==void 0}))),Pusher.Util.method("join","=")).join("&");this.script=document.createElement("script");this.script.id=f+a;this.script.src=this.options.url+"/"+a+"?"+b;this.script.type="text/javascript";this.script.charset="UTF-8";this.script.onerror=this.script.onload=e;if(this.script.async===void 0&&document.attachEvent&&
/opera/i.test(navigator.userAgent))f=this.options.receiver||"Pusher.JSONP.receive",this.errorScript=document.createElement("script"),this.errorScript.text=f+"("+a+", true);",this.script.async=this.errorScript.async=!1;var g=this;this.script.onreadystatechange=function(){g.script&&/loaded|complete/.test(g.script.readyState)&&e(!0)};a=document.getElementsByTagName("head")[0];a.insertBefore(this.script,a.firstChild);this.errorScript&&a.insertBefore(this.errorScript,this.script.nextSibling);return!0};
a.cleanup=function(){if(this.script&&this.script.parentNode)this.script.parentNode.removeChild(this.script),this.script=null;if(this.errorScript&&this.errorScript.parentNode)this.errorScript.parentNode.removeChild(this.errorScript),this.errorScript=null};Pusher.JSONPRequest=b}).call(this);
(function(){function b(){this.lastId=0;this.callbacks={}}var c=b.prototype;c.register=function(a){this.lastId++;var b=this.lastId;this.callbacks[b]=a;return b};c.unregister=function(a){if(this.callbacks[a]){var b=this.callbacks[a];delete this.callbacks[a];return b}else return null};c.receive=function(a,b,c){(a=this.unregister(a))&&a(b,c)};Pusher.JSONPReceiver=b;Pusher.JSONP=new b}).call(this);
(function(){function b(a,b,c){this.key=a;this.session=b;this.events=[];this.options=c||{};this.uniqueID=this.sent=0}var c=b.prototype;b.ERROR=3;b.INFO=6;b.DEBUG=7;c.log=function(a,c){if(this.options.level===void 0||a<=this.options.level)this.events.push(Pusher.Util.extend({},c,{timestamp:Pusher.Util.now(),level:a!==b.INFO?a:void 0})),this.options.limit&&this.events.length>this.options.limit&&this.events.shift()};c.error=function(a){this.log(b.ERROR,a)};c.info=function(a){this.log(b.INFO,a)};c.debug=
function(a){this.log(b.DEBUG,a)};c.isEmpty=function(){return this.events.length===0};c.send=function(a,b){var c=this,e=Pusher.Util.extend({session:c.session,bundle:c.sent+1,key:c.key,lib:"js",version:c.options.version,features:c.options.features,timeline:c.events},c.options.params);c.events=[];a(e,function(a,g){a||c.sent++;b&&b(a,g)});return!0};c.generateUniqueID=function(){this.uniqueID++;return this.uniqueID};Pusher.Timeline=b}).call(this);
(function(){function b(b,a){this.timeline=b;this.options=a||{}}b.prototype.send=function(b,a){if(!this.timeline.isEmpty()){var d=this,h="http"+(b?"s":"")+"://";d.timeline.send(function(a,b){var c={data:Pusher.Util.filterObject(a,function(a){return a!==void 0}),url:h+(d.host||d.options.host)+d.options.path,receiver:Pusher.JSONP};return Pusher.JSONPRequest.send(c,function(a,c){if(c&&c.host)d.host=c.host;b&&b(a,c)})},a)}};Pusher.TimelineSender=b}).call(this);
(function(){function b(a){this.strategies=a}function c(a,b,c){var h=Pusher.Util.map(a,function(a,d,h,e){return a.connect(b,c(d,e))});return{abort:function(){Pusher.Util.apply(h,d)},forceMinPriority:function(a){Pusher.Util.apply(h,function(b){b.forceMinPriority(a)})}}}function a(a){return Pusher.Util.all(a,function(a){return Boolean(a.error)})}function d(a){if(!a.error&&!a.aborted)a.abort(),a.aborted=!0}var h=b.prototype;h.isSupported=function(){return Pusher.Util.any(this.strategies,Pusher.Util.method("isSupported"))};
h.connect=function(b,d){return c(this.strategies,b,function(b,c){return function(h,e){(c[b].error=h)?a(c)&&d(!0):(Pusher.Util.apply(c,function(a){a.forceMinPriority(e.transport.priority)}),d(null,e))}})};Pusher.BestConnectedEverStrategy=b}).call(this);
(function(){function b(a,b,c){this.strategy=a;this.transports=b;this.ttl=c.ttl||18E5;this.encrypted=c.encrypted;this.timeline=c.timeline}function c(a){return"pusherTransport"+(a?"Encrypted":"Unencrypted")}function a(a){var b=Pusher.Util.getLocalStorage();if(b)try{var h=b[c(a)];if(h)return JSON.parse(h)}catch(i){d(a)}return null}function d(a){var b=Pusher.Util.getLocalStorage();if(b)try{delete b[c(a)]}catch(d){}}var h=b.prototype;h.isSupported=function(){return this.strategy.isSupported()};h.connect=
function(b,h){var g=this.encrypted,i=a(g),j=[this.strategy];if(i&&i.timestamp+this.ttl>=Pusher.Util.now()){var k=this.transports[i.transport];k&&(this.timeline.info({cached:!0,transport:i.transport}),j.push(new Pusher.SequentialStrategy([k],{timeout:i.latency*2,failFast:!0})))}var m=Pusher.Util.now(),l=j.pop().connect(b,function p(a,i){if(a)d(g),j.length>0?(m=Pusher.Util.now(),l=j.pop().connect(b,p)):h(a);else{var k=i.transport.name,q=Pusher.Util.now()-m,o=Pusher.Util.getLocalStorage();if(o)try{o[c(g)]=
JSON.stringify({timestamp:Pusher.Util.now(),transport:k,latency:q})}catch(r){}h(null,i)}});return{abort:function(){l.abort()},forceMinPriority:function(a){b=a;l&&l.forceMinPriority(a)}}};Pusher.CachedStrategy=b}).call(this);
(function(){function b(a,b){this.strategy=a;this.options={delay:b.delay}}var c=b.prototype;c.isSupported=function(){return this.strategy.isSupported()};c.connect=function(a,b){var c=this.strategy,e,f=new Pusher.Timer(this.options.delay,function(){e=c.connect(a,b)});return{abort:function(){f.ensureAborted();e&&e.abort()},forceMinPriority:function(b){a=b;e&&e.forceMinPriority(b)}}};Pusher.DelayedStrategy=b}).call(this);
(function(){function b(a){this.strategy=a}var c=b.prototype;c.isSupported=function(){return this.strategy.isSupported()};c.connect=function(a,b){var c=this.strategy.connect(a,function(a,f){f&&c.abort();b(a,f)});return c};Pusher.FirstConnectedStrategy=b}).call(this);
(function(){function b(a,b,c){this.test=a;this.trueBranch=b;this.falseBranch=c}var c=b.prototype;c.isSupported=function(){return(this.test()?this.trueBranch:this.falseBranch).isSupported()};c.connect=function(a,b){return(this.test()?this.trueBranch:this.falseBranch).connect(a,b)};Pusher.IfStrategy=b}).call(this);
(function(){function b(a,b){this.strategies=a;this.loop=Boolean(b.loop);this.failFast=Boolean(b.failFast);this.timeout=b.timeout;this.timeoutLimit=b.timeoutLimit}var c=b.prototype;c.isSupported=function(){return Pusher.Util.any(this.strategies,Pusher.Util.method("isSupported"))};c.connect=function(a,b){var c=this,e=this.strategies,f=0,g=this.timeout,i=null,j=function(k,m){m?b(null,m):(f+=1,c.loop&&(f%=e.length),f<e.length?(g&&(g*=2,c.timeoutLimit&&(g=Math.min(g,c.timeoutLimit))),i=c.tryStrategy(e[f],
a,{timeout:g,failFast:c.failFast},j)):b(!0))},i=this.tryStrategy(e[f],a,{timeout:g,failFast:this.failFast},j);return{abort:function(){i.abort()},forceMinPriority:function(b){a=b;i&&i.forceMinPriority(b)}}};c.tryStrategy=function(a,b,c,e){var f=null,g=null;c.timeout>0&&(f=new Pusher.Timer(c.timeout,function(){g.abort();e(!0)}));g=a.connect(b,function(a,b){if(!a||!f||!f.isRunning()||c.failFast)f&&f.ensureAborted(),e(a,b)});return{abort:function(){f&&f.ensureAborted();g.abort()},forceMinPriority:function(a){g.forceMinPriority(a)}}};
Pusher.SequentialStrategy=b}).call(this);
(function(){function b(a,b,c,f){this.name=a;this.priority=b;this.transport=c;this.options=f||{}}function c(a,b){Pusher.Util.defer(function(){b(a)});return{abort:function(){},forceMinPriority:function(){}}}var a=b.prototype;a.isSupported=function(){return this.transport.isSupported()};a.connect=function(a,b){if(this.isSupported()){if(this.priority<a)return c(new Pusher.Errors.TransportPriorityTooLow,b)}else return c(new Pusher.Errors.UnsupportedStrategy,b);var e=this,f=!1,g=this.transport.createConnection(this.name,
this.priority,this.options.key,this.options),i=null,j=function(){g.unbind("initialized",j);g.connect()},k=function(){i=new Pusher.Handshake(g,function(a){f=!0;n();b(null,a)})},m=function(a){n();b(a)},l=function(){n();b(new Pusher.Errors.TransportClosed(g))},n=function(){g.unbind("initialized",j);g.unbind("open",k);g.unbind("error",m);g.unbind("closed",l)};g.bind("initialized",j);g.bind("open",k);g.bind("error",m);g.bind("closed",l);g.initialize();return{abort:function(){f||(n(),i?i.close():g.close())},
forceMinPriority:function(a){f||e.priority<a&&(i?i.close():g.close())}}};Pusher.TransportStrategy=b}).call(this);
(function(){function b(a,b,c,e){Pusher.EventsDispatcher.call(this);this.name=a;this.priority=b;this.key=c;this.state="new";this.timeline=e.timeline;this.activityTimeout=e.activityTimeout;this.id=this.timeline.generateUniqueID();this.options={encrypted:Boolean(e.encrypted),hostUnencrypted:e.hostUnencrypted,hostEncrypted:e.hostEncrypted}}var c=b.prototype;Pusher.Util.extend(c,Pusher.EventsDispatcher.prototype);b.isSupported=function(){return!1};c.supportsPing=function(){return!1};c.initialize=function(){this.timeline.info(this.buildTimelineMessage({transport:this.name+
(this.options.encrypted?"s":"")}));this.timeline.debug(this.buildTimelineMessage({method:"initialize"}));this.changeState("initialized")};c.connect=function(){var a=this.getURL(this.key,this.options);this.timeline.debug(this.buildTimelineMessage({method:"connect",url:a}));if(this.socket||this.state!=="initialized")return!1;try{this.socket=this.createSocket(a)}catch(b){var c=this;Pusher.Util.defer(function(){c.onError(b);c.changeState("closed")});return!1}this.bindListeners();Pusher.debug("Connecting",
{transport:this.name,url:a});this.changeState("connecting");return!0};c.close=function(){this.timeline.debug(this.buildTimelineMessage({method:"close"}));return this.socket?(this.socket.close(),!0):!1};c.send=function(a){this.timeline.debug(this.buildTimelineMessage({method:"send",data:a}));if(this.state==="open"){var b=this;setTimeout(function(){b.socket&&b.socket.send(a)},0);return!0}else return!1};c.onOpen=function(){this.changeState("open");this.socket.onopen=void 0};c.onError=function(a){this.emit("error",
{type:"WebSocketError",error:a});this.timeline.error(this.buildTimelineMessage({}))};c.onClose=function(a){a?this.changeState("closed",{code:a.code,reason:a.reason,wasClean:a.wasClean}):this.changeState("closed");this.socket=void 0};c.onMessage=function(a){this.timeline.debug(this.buildTimelineMessage({message:a.data}));this.emit("message",a)};c.bindListeners=function(){var a=this;this.socket.onopen=function(){a.onOpen()};this.socket.onerror=function(b){a.onError(b)};this.socket.onclose=function(b){a.onClose(b)};
this.socket.onmessage=function(b){a.onMessage(b)}};c.createSocket=function(){return null};c.getScheme=function(){return this.options.encrypted?"wss":"ws"};c.getBaseURL=function(){var a;a=this.options.encrypted?this.options.hostEncrypted:this.options.hostUnencrypted;return this.getScheme()+"://"+a};c.getPath=function(){return"/app/"+this.key};c.getQueryString=function(){return"?protocol="+Pusher.PROTOCOL+"&client=js&version="+Pusher.VERSION};c.getURL=function(){return this.getBaseURL()+this.getPath()+
this.getQueryString()};c.changeState=function(a,b){this.state=a;this.timeline.info(this.buildTimelineMessage({state:a,params:b}));this.emit(a,b)};c.buildTimelineMessage=function(a){return Pusher.Util.extend({cid:this.id},a)};Pusher.AbstractTransport=b}).call(this);
(function(){function b(a,b,c,e){Pusher.AbstractTransport.call(this,a,b,c,e)}var c=b.prototype;Pusher.Util.extend(c,Pusher.AbstractTransport.prototype);b.createConnection=function(a,c,h,e){return new b(a,c,h,e)};b.isSupported=function(){try{return Boolean(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))}catch(a){try{return Boolean(navigator&&navigator.mimeTypes&&navigator.mimeTypes["application/x-shockwave-flash"]!==void 0)}catch(b){return!1}}};c.initialize=function(){var a=this;this.timeline.info(this.buildTimelineMessage({transport:this.name+
(this.options.encrypted?"s":"")}));this.timeline.debug(this.buildTimelineMessage({method:"initialize"}));this.changeState("initializing");if(window.WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR===void 0)window.WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR=!0;window.WEB_SOCKET_SWF_LOCATION=Pusher.Dependencies.getRoot()+"/WebSocketMain.swf";Pusher.Dependencies.load("flashfallback",function(){a.changeState("initialized")})};c.createSocket=function(a){return new FlashWebSocket(a)};c.getQueryString=function(){return Pusher.AbstractTransport.prototype.getQueryString.call(this)+
"&flash=true"};Pusher.FlashTransport=b}).call(this);
(function(){function b(a,b,c,e){Pusher.AbstractTransport.call(this,a,b,c,e);this.options.ignoreNullOrigin=e.ignoreNullOrigin}var c=b.prototype;Pusher.Util.extend(c,Pusher.AbstractTransport.prototype);b.createConnection=function(a,c,h,e){return new b(a,c,h,e)};b.isSupported=function(){return!0};c.initialize=function(){var a=this;this.timeline.info(this.buildTimelineMessage({transport:this.name+(this.options.encrypted?"s":"")}));this.timeline.debug(this.buildTimelineMessage({method:"initialize"}));this.changeState("initializing");
Pusher.Dependencies.load("sockjs",function(){a.changeState("initialized")})};c.supportsPing=function(){return!0};c.createSocket=function(a){return new SockJS(a,null,{js_path:Pusher.Dependencies.getPath("sockjs",{encrypted:this.options.encrypted}),ignore_null_origin:this.options.ignoreNullOrigin})};c.getScheme=function(){return this.options.encrypted?"https":"http"};c.getPath=function(){return this.options.httpPath||"/pusher"};c.getQueryString=function(){return""};c.onOpen=function(){this.socket.send(JSON.stringify({path:Pusher.AbstractTransport.prototype.getPath.call(this)+
Pusher.AbstractTransport.prototype.getQueryString.call(this)}));this.changeState("open");this.socket.onopen=void 0};Pusher.SockJSTransport=b}).call(this);
(function(){function b(a,b,c,e){Pusher.AbstractTransport.call(this,a,b,c,e)}var c=b.prototype;Pusher.Util.extend(c,Pusher.AbstractTransport.prototype);b.createConnection=function(a,c,h,e){return new b(a,c,h,e)};b.isSupported=function(){return window.WebSocket!==void 0||window.MozWebSocket!==void 0};c.createSocket=function(a){return new (window.WebSocket||window.MozWebSocket)(a)};c.getQueryString=function(){return Pusher.AbstractTransport.prototype.getQueryString.call(this)+"&flash=false"};Pusher.WSTransport=
b}).call(this);
(function(){function b(a,b,c){this.manager=a;this.transport=b;this.minPingDelay=c.minPingDelay;this.maxPingDelay=c.maxPingDelay;this.pingDelay=void 0}var c=b.prototype;c.createConnection=function(a,b,c,e){var f=this,e=Pusher.Util.extend({},e,{activityTimeout:f.pingDelay}),g=f.transport.createConnection(a,b,c,e),i=null,j=function(){g.unbind("open",j);g.bind("closed",k);i=Pusher.Util.now()},k=function(a){g.unbind("closed",k);if(a.code===1002||a.code===1003)f.manager.reportDeath();else if(!a.wasClean&&i&&
(a=Pusher.Util.now()-i,a<2*f.maxPingDelay))f.manager.reportDeath(),f.pingDelay=Math.max(a/2,f.minPingDelay)};g.bind("open",j);return g};c.isSupported=function(){return this.manager.isAlive()&&this.transport.isSupported()};Pusher.AssistantToTheTransportManager=b}).call(this);
(function(){function b(a){this.options=a||{};this.livesLeft=this.options.lives||Infinity}var c=b.prototype;c.getAssistant=function(a){return new Pusher.AssistantToTheTransportManager(this,a,{minPingDelay:this.options.minPingDelay,maxPingDelay:this.options.maxPingDelay})};c.isAlive=function(){return this.livesLeft>0};c.reportDeath=function(){this.livesLeft-=1};Pusher.TransportManager=b}).call(this);
(function(){function b(a){return function(b){return[a.apply(this,arguments),b]}}function c(a,b){if(a.length===0)return[[],b];var h=d(a[0],b),e=c(a.slice(1),h[1]);return[[h[0]].concat(e[0]),e[1]]}function a(a,b){if(typeof a[0]==="string"&&a[0].charAt(0)===":"){var h=b[a[0].slice(1)];if(a.length>1){if(typeof h!=="function")throw"Calling non-function "+a[0];var e=[Pusher.Util.extend({},b)].concat(Pusher.Util.map(a.slice(1),function(a){return d(a,Pusher.Util.extend({},b))[0]}));return h.apply(this,e)}else return[h,
b]}else return c(a,b)}function d(b,c){if(typeof b==="string"){var d;if(typeof b==="string"&&b.charAt(0)===":"){d=c[b.slice(1)];if(d===void 0)throw"Undefined symbol "+b;d=[d,c]}else d=[b,c];return d}else if(typeof b==="object"&&b instanceof Array&&b.length>0)return a(b,c);return[b,c]}var h={ws:Pusher.WSTransport,flash:Pusher.FlashTransport,sockjs:Pusher.SockJSTransport},e={isSupported:function(){return!1},connect:function(a,b){var c=Pusher.Util.defer(function(){b(new Pusher.Errors.UnsupportedStrategy)});
return{abort:function(){c.ensureAborted()},forceMinPriority:function(){}}}},f={def:function(a,b,c){if(a[b]!==void 0)throw"Redefining symbol "+b;a[b]=c;return[void 0,a]},def_transport:function(a,b,c,d,f,l){var n=h[c];if(!n)throw new Pusher.Errors.UnsupportedTransport(c);c=(!a.enabledTransports||Pusher.Util.arrayIndexOf(a.enabledTransports,b)!==-1)&&(!a.disabledTransports||Pusher.Util.arrayIndexOf(a.disabledTransports,b)===-1)&&(b!=="flash"||a.disableFlash!==!0)?new Pusher.TransportStrategy(b,d,l?l.getAssistant(n):
n,Pusher.Util.extend({key:a.key,encrypted:a.encrypted,timeline:a.timeline,ignoreNullOrigin:a.ignoreNullOrigin},f)):e;d=a.def(a,b,c)[1];d.transports=a.transports||{};d.transports[b]=c;return[void 0,d]},transport_manager:b(function(a,b){return new Pusher.TransportManager(b)}),sequential:b(function(a,b){var c=Array.prototype.slice.call(arguments,2);return new Pusher.SequentialStrategy(c,b)}),cached:b(function(a,b,c){return new Pusher.CachedStrategy(c,a.transports,{ttl:b,timeline:a.timeline,encrypted:a.encrypted})}),
first_connected:b(function(a,b){return new Pusher.FirstConnectedStrategy(b)}),best_connected_ever:b(function(){var a=Array.prototype.slice.call(arguments,1);return new Pusher.BestConnectedEverStrategy(a)}),delayed:b(function(a,b,c){return new Pusher.DelayedStrategy(c,{delay:b})}),"if":b(function(a,b,c,d){return new Pusher.IfStrategy(b,c,d)}),is_supported:b(function(a,b){return function(){return b.isSupported()}})};Pusher.StrategyBuilder={build:function(a,b){var c=Pusher.Util.extend({},f,b);return d(a,
c)[1].strategy}}}).call(this);
(function(){Pusher.Protocol={decodeMessage:function(b){try{var c=JSON.parse(b.data);if(typeof c.data==="string")try{c.data=JSON.parse(c.data)}catch(a){if(!(a instanceof SyntaxError))throw a;}return c}catch(d){throw{type:"MessageParseError",error:d,data:b.data};}},encodeMessage:function(b){return JSON.stringify(b)},processHandshake:function(b){b=this.decodeMessage(b);if(b.event==="pusher:connection_established"){if(!b.data.activity_timeout)throw"No activity timeout specified in handshake";return{action:"connected",
id:b.data.socket_id,activityTimeout:b.data.activity_timeout*1E3}}else if(b.event==="pusher:error")return{action:this.getCloseAction(b.data),error:this.getCloseError(b.data)};else throw"Invalid handshake";},getCloseAction:function(b){return b.code<4E3?b.code>=1002&&b.code<=1004?"backoff":null:b.code===4E3?"ssl_only":b.code<4100?"refused":b.code<4200?"backoff":b.code<4300?"retry":"refused"},getCloseError:function(b){return b.code!==1E3&&b.code!==1001?{type:"PusherError",data:{code:b.code,message:b.reason||
b.message}}:null}}}).call(this);
(function(){function b(a,b){Pusher.EventsDispatcher.call(this);this.id=a;this.transport=b;this.activityTimeout=b.activityTimeout;this.bindListeners()}var c=b.prototype;Pusher.Util.extend(c,Pusher.EventsDispatcher.prototype);c.supportsPing=function(){return this.transport.supportsPing()};c.send=function(a){return this.transport.send(a)};c.send_event=function(a,b,c){a={event:a,data:b};if(c)a.channel=c;Pusher.debug("Event sent",a);return this.send(Pusher.Protocol.encodeMessage(a))};c.close=function(){this.transport.close()};
c.bindListeners=function(){var a=this,b=function(b){var c;try{c=Pusher.Protocol.decodeMessage(b)}catch(d){a.emit("error",{type:"MessageParseError",error:d,data:b.data})}if(c!==void 0){Pusher.debug("Event recd",c);switch(c.event){case "pusher:error":a.emit("error",{type:"PusherError",data:c.data});break;case "pusher:ping":a.emit("ping");break;case "pusher:pong":a.emit("pong")}a.emit("message",c)}},c=function(b){a.emit("error",{type:"WebSocketError",error:b})},e=function(f){a.transport.unbind("closed",
e);a.transport.unbind("error",c);a.transport.unbind("message",b);f&&f.code&&a.handleCloseEvent(f);a.transport=null;a.emit("closed")};a.transport.bind("message",b);a.transport.bind("error",c);a.transport.bind("closed",e)};c.handleCloseEvent=function(a){var b=Pusher.Protocol.getCloseAction(a);(a=Pusher.Protocol.getCloseError(a))&&this.emit("error",a);b&&this.emit(b)};Pusher.Connection=b}).call(this);
(function(){function b(a,b){this.transport=a;this.callback=b;this.bindListeners()}var c=b.prototype;c.close=function(){this.unbindListeners();this.transport.close()};c.bindListeners=function(){var a=this;a.onMessage=function(b){a.unbindListeners();try{var c=Pusher.Protocol.processHandshake(b);c.action==="connected"?a.finish("connected",{connection:new Pusher.Connection(c.id,a.transport),activityTimeout:c.activityTimeout}):(a.finish(c.action,{error:c.error}),a.transport.close())}catch(e){a.finish("error",
{error:e}),a.transport.close()}};a.onClosed=function(b){a.unbindListeners();var c=Pusher.Protocol.getCloseAction(b)||"backoff",b=Pusher.Protocol.getCloseError(b);a.finish(c,{error:b})};a.transport.bind("message",a.onMessage);a.transport.bind("closed",a.onClosed)};c.unbindListeners=function(){this.transport.unbind("message",this.onMessage);this.transport.unbind("closed",this.onClosed)};c.finish=function(a,b){this.callback(Pusher.Util.extend({transport:this.transport,action:a},b))};Pusher.Handshake=
b}).call(this);
(function(){function b(a,b){Pusher.EventsDispatcher.call(this);this.key=a;this.options=b||{};this.state="initialized";this.connection=null;this.encrypted=!!b.encrypted;this.timeline=this.options.timeline;this.connectionCallbacks=this.buildConnectionCallbacks();this.errorCallbacks=this.buildErrorCallbacks();this.handshakeCallbacks=this.buildHandshakeCallbacks(this.errorCallbacks);var c=this;Pusher.Network.bind("online",function(){c.timeline.info({netinfo:"online"});(c.state==="connecting"||c.state===
"unavailable")&&c.retryIn(0)});Pusher.Network.bind("offline",function(){c.timeline.info({netinfo:"offline"});c.state==="connected"&&c.sendActivityCheck()});this.updateStrategy()}var c=b.prototype;Pusher.Util.extend(c,Pusher.EventsDispatcher.prototype);c.connect=function(){!this.connection&&!this.runner&&(this.strategy.isSupported()?(this.updateState("connecting"),this.startConnecting(),this.setUnavailableTimer()):this.updateState("failed"))};c.send=function(a){return this.connection?this.connection.send(a):
!1};c.send_event=function(a,b,c){return this.connection?this.connection.send_event(a,b,c):!1};c.disconnect=function(){this.disconnectInternally();this.updateState("disconnected")};c.isEncrypted=function(){return this.encrypted};c.startConnecting=function(){var a=this,b=function(c,e){c?a.runner=a.strategy.connect(0,b):e.action==="error"?(a.emit("error",{type:"HandshakeError",error:e.error}),a.timeline.error({handshakeError:e.error})):(a.abortConnecting(),a.handshakeCallbacks[e.action](e))};a.runner=
a.strategy.connect(0,b)};c.abortConnecting=function(){if(this.runner)this.runner.abort(),this.runner=null};c.disconnectInternally=function(){this.abortConnecting();this.clearRetryTimer();this.clearUnavailableTimer();this.stopActivityCheck();this.connection&&this.abandonConnection().close()};c.updateStrategy=function(){this.strategy=this.options.getStrategy({key:this.key,timeline:this.timeline,encrypted:this.encrypted})};c.retryIn=function(a){var b=this;b.timeline.info({action:"retry",delay:a});a>
0&&b.emit("connecting_in",Math.round(a/1E3));b.retryTimer=new Pusher.Timer(a||0,function(){b.disconnectInternally();b.connect()})};c.clearRetryTimer=function(){if(this.retryTimer)this.retryTimer.ensureAborted(),this.retryTimer=null};c.setUnavailableTimer=function(){var a=this;a.unavailableTimer=new Pusher.Timer(a.options.unavailableTimeout,function(){a.updateState("unavailable")})};c.clearUnavailableTimer=function(){this.unavailableTimer&&this.unavailableTimer.ensureAborted()};c.sendActivityCheck=
function(){var a=this;a.stopActivityCheck();a.send_event("pusher:ping",{});a.activityTimer=new Pusher.Timer(a.options.pongTimeout,function(){a.timeline.error({pong_timed_out:a.options.pongTimeout});a.retryIn(0)})};c.resetActivityCheck=function(){var a=this;a.stopActivityCheck();if(!a.connection.supportsPing())a.activityTimer=new Pusher.Timer(a.activityTimeout,function(){a.sendActivityCheck()})};c.stopActivityCheck=function(){this.activityTimer&&this.activityTimer.ensureAborted()};c.buildConnectionCallbacks=
function(){var a=this;return{message:function(b){a.resetActivityCheck();a.emit("message",b)},ping:function(){a.send_event("pusher:pong",{})},error:function(b){a.emit("error",{type:"WebSocketError",error:b})},closed:function(){a.abandonConnection();a.shouldRetry()&&a.retryIn(1E3)}}};c.buildHandshakeCallbacks=function(a){var b=this;return Pusher.Util.extend({},a,{connected:function(a){b.activityTimeout=Math.min(b.options.activityTimeout,a.activityTimeout,a.connection.activityTimeout||Infinity);b.clearUnavailableTimer();
b.setConnection(a.connection);b.socket_id=b.connection.id;b.updateState("connected",{socket_id:b.socket_id})}})};c.buildErrorCallbacks=function(){function a(a){return function(c){c.error&&b.emit("error",{type:"WebSocketError",error:c.error});a(c)}}var b=this;return{ssl_only:a(function(){b.encrypted=!0;b.updateStrategy();b.retryIn(0)}),refused:a(function(){b.disconnect()}),backoff:a(function(){b.retryIn(1E3)}),retry:a(function(){b.retryIn(0)})}};c.setConnection=function(a){this.connection=a;for(var b in this.connectionCallbacks)this.connection.bind(b,
this.connectionCallbacks[b]);this.resetActivityCheck()};c.abandonConnection=function(){if(this.connection){for(var a in this.connectionCallbacks)this.connection.unbind(a,this.connectionCallbacks[a]);a=this.connection;this.connection=null;return a}};c.updateState=function(a,b){var c=this.state;this.state=a;c!==a&&(Pusher.debug("State changed",c+" -> "+a),this.timeline.info({state:a,params:b}),this.emit("state_change",{previous:c,current:a}),this.emit(a,b))};c.shouldRetry=function(){return this.state===
"connecting"||this.state==="connected"};Pusher.ConnectionManager=b}).call(this);
(function(){function b(){Pusher.EventsDispatcher.call(this);var b=this;window.addEventListener!==void 0&&(window.addEventListener("online",function(){b.emit("online")},!1),window.addEventListener("offline",function(){b.emit("offline")},!1))}Pusher.Util.extend(b.prototype,Pusher.EventsDispatcher.prototype);b.prototype.isOnline=function(){return window.navigator.onLine===void 0?!0:window.navigator.onLine};Pusher.NetInfo=b;Pusher.Network=new b}).call(this);
(function(){function b(){this.reset()}var c=b.prototype;c.get=function(a){return Object.prototype.hasOwnProperty.call(this.members,a)?{id:a,info:this.members[a]}:null};c.each=function(a){var b=this;Pusher.Util.objectApply(b.members,function(c,e){a(b.get(e))})};c.setMyID=function(a){this.myID=a};c.onSubscription=function(a){this.members=a.presence.hash;this.count=a.presence.count;this.me=this.get(this.myID)};c.addMember=function(a){this.get(a.user_id)===null&&this.count++;this.members[a.user_id]=a.user_info;
return this.get(a.user_id)};c.removeMember=function(a){var b=this.get(a.user_id);b&&(delete this.members[a.user_id],this.count--);return b};c.reset=function(){this.members={};this.count=0;this.me=this.myID=null};Pusher.Members=b}).call(this);
(function(){function b(a,b){Pusher.EventsDispatcher.call(this,function(b){Pusher.debug("No callbacks on "+a+" for "+b)});this.name=a;this.pusher=b;this.subscribed=!1}var c=b.prototype;Pusher.Util.extend(c,Pusher.EventsDispatcher.prototype);c.authorize=function(a,b){return b(!1,{})};c.trigger=function(a,b){if(a.indexOf("client-")!==0)throw new Pusher.Errors.BadEventName("Event '"+a+"' does not start with 'client-'");return this.pusher.send_event(a,b,this.name)};c.disconnect=function(){this.subscribed=
!1};c.handleEvent=function(a,b){if(a.indexOf("pusher_internal:")===0){if(a==="pusher_internal:subscription_succeeded")this.subscribed=!0,this.emit("pusher:subscription_succeeded",b)}else this.emit(a,b)};c.subscribe=function(){var a=this;a.authorize(a.pusher.connection.socket_id,function(b,c){b?a.handleEvent("pusher:subscription_error",c):a.pusher.send_event("pusher:subscribe",{auth:c.auth,channel_data:c.channel_data,channel:a.name})})};c.unsubscribe=function(){this.pusher.send_event("pusher:unsubscribe",
{channel:this.name})};Pusher.Channel=b}).call(this);(function(){function b(a,b){Pusher.Channel.call(this,a,b)}var c=b.prototype;Pusher.Util.extend(c,Pusher.Channel.prototype);c.authorize=function(a,b){return(new Pusher.Channel.Authorizer(this,this.pusher.config)).authorize(a,b)};Pusher.PrivateChannel=b}).call(this);
(function(){function b(a,b){Pusher.PrivateChannel.call(this,a,b);this.members=new Pusher.Members}var c=b.prototype;Pusher.Util.extend(c,Pusher.PrivateChannel.prototype);c.authorize=function(a,b){var c=this;Pusher.PrivateChannel.prototype.authorize.call(c,a,function(a,f){if(!a){if(f.channel_data===void 0){Pusher.warn("Invalid auth response for channel '"+c.name+"', expected 'channel_data' field");b("Invalid auth response");return}var g=JSON.parse(f.channel_data);c.members.setMyID(g.user_id)}b(a,f)})};
c.handleEvent=function(a,b){switch(a){case "pusher_internal:subscription_succeeded":this.members.onSubscription(b);this.subscribed=!0;this.emit("pusher:subscription_succeeded",this.members);break;case "pusher_internal:member_added":this.emit("pusher:member_added",this.members.addMember(b));break;case "pusher_internal:member_removed":var c=this.members.removeMember(b);c&&this.emit("pusher:member_removed",c);break;default:Pusher.PrivateChannel.prototype.handleEvent.call(this,a,b)}};c.disconnect=function(){this.members.reset();
Pusher.PrivateChannel.prototype.disconnect.call(this)};Pusher.PresenceChannel=b}).call(this);
(function(){function b(){this.channels={}}var c=b.prototype;c.add=function(a,b){this.channels[a]||(this.channels[a]=a.indexOf("private-")===0?new Pusher.PrivateChannel(a,b):a.indexOf("presence-")===0?new Pusher.PresenceChannel(a,b):new Pusher.Channel(a,b));return this.channels[a]};c.all=function(){return Pusher.Util.values(this.channels)};c.find=function(a){return this.channels[a]};c.remove=function(a){var b=this.channels[a];delete this.channels[a];return b};c.disconnect=function(){Pusher.Util.objectApply(this.channels,
function(a){a.disconnect()})};Pusher.Channels=b}).call(this);
(function(){Pusher.Channel.Authorizer=function(b,a){this.channel=b;this.type=a.authTransport;this.options=a;this.authOptions=(a||{}).auth||{}};Pusher.Channel.Authorizer.prototype={composeQuery:function(b){var b="&socket_id="+encodeURIComponent(b)+"&channel_name="+encodeURIComponent(this.channel.name),a;for(a in this.authOptions.params)b+="&"+encodeURIComponent(a)+"="+encodeURIComponent(this.authOptions.params[a]);return b},authorize:function(b,a){return Pusher.authorizers[this.type].call(this,b,a)}};
var b=1;Pusher.auth_callbacks={};Pusher.authorizers={ajax:function(b,a){var d;d=Pusher.XHR?new Pusher.XHR:window.XMLHttpRequest?new window.XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");d.open("POST",this.options.authEndpoint,!0);d.setRequestHeader("Content-Type","application/x-www-form-urlencoded");for(var h in this.authOptions.headers)d.setRequestHeader(h,this.authOptions.headers[h]);d.onreadystatechange=function(){if(d.readyState==4)if(d.status==200){var b,c=!1;try{b=JSON.parse(d.responseText),
c=!0}catch(g){a(!0,"JSON returned from webapp was invalid, yet status code was 200. Data was: "+d.responseText)}c&&a(!1,b)}else Pusher.warn("Couldn't get auth info from your webapp",d.status),a(!0,d.status)};d.send(this.composeQuery(b));return d},jsonp:function(c,a){this.authOptions.headers!==void 0&&Pusher.warn("Warn","To send headers with the auth request, you must use AJAX, rather than JSONP.");var d=b.toString();b++;var h=Pusher.Util.getDocument(),e=h.createElement("script");Pusher.auth_callbacks[d]=
function(b){a(!1,b)};e.src=this.options.authEndpoint+"?callback="+encodeURIComponent("Pusher.auth_callbacks['"+d+"']")+this.composeQuery(c);d=h.getElementsByTagName("head")[0]||h.documentElement;d.insertBefore(e,d.firstChild)}}}).call(this);

(function(){var e,t,n,r,i,s={}.hasOwnProperty,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);return r.prototype=t.prototype,e.prototype=new r,e.__super__=t.prototype,e},u=this;this.Stripe=function(){function e(){}return e.version=2,e.endpoint="https://api.stripe.com/v1",e.setPublishableKey=function(t){e.key=t},e.complete=function(t){return function(n,r,i){var s;if(n!=="success")return s=Math.round((new Date).getTime()/1e3),(new Image).src="https://q.stripe.com?event=stripejs-error&type="+n+"&key="+e.key+"&timestamp="+s,typeof t=="function"?t(500,{error:{code:n,type:n,message:"An unexpected error has occurred submitting your credit\ncard to our secure credit card processor. This may be\ndue to network connectivity issues, so you should try\nagain (you won't be charged twice). If this problem\npersists, please let us know!"}}):void 0}},e}.call(this),e=this.Stripe,this.Stripe.token=function(){function t(){}return t.validate=function(e,t){if(!e)throw t+" required";if(typeof e!="object")throw t+" invalid"},t.formatData=function(t,n){return e.utils.isElement(t)&&(t=e.utils.paramsFromForm(t,n)),e.utils.underscoreKeys(t),t},t.create=function(t,n){return t.key||(t.key=e.key||e.publishableKey),e.utils.validateKey(t.key),e.ajaxJSONP({url:""+e.endpoint+"/tokens",data:t,method:"POST",success:function(e,t){return typeof n=="function"?n(t,e):void 0},complete:e.complete(n),timeout:4e4})},t.get=function(t,n){if(!t)throw"token required";return e.utils.validateKey(e.key),e.ajaxJSONP({url:""+e.endpoint+"/tokens/"+t,data:{key:e.key},success:function(e,t){return typeof n=="function"?n(t,e):void 0},complete:e.complete(n),timeout:4e4})},t}.call(this),this.Stripe.card=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return o(n,t),n.tokenName="card",n.whitelistedAttrs=["number","cvc","exp_month","exp_year","name","address_line1","address_line2","address_city","address_state","address_zip","address_country"],n.createToken=function(t,r,i){var s;return r==null&&(r={}),e.token.validate(t,"card"),typeof r=="function"?(i=r,r={}):typeof r!="object"&&(s=parseInt(r,10),r={},s>0&&(r.amount=s)),r[n.tokenName]=e.token.formatData(t,n.whitelistedAttrs),e.token.create(r,i)},n.getToken=function(t,n){return e.token.get(t,n)},n.validateCardNumber=function(e){return e=(e+"").replace(/\s+|-/g,""),e.length>=10&&e.length<=16&&n.luhnCheck(e)},n.validateCVC=function(t){return t=e.utils.trim(t),/^\d+$/.test(t)&&t.length>=3&&t.length<=4},n.validateExpiry=function(t,n){var r,i;return t=e.utils.trim(t),n=e.utils.trim(n),/^\d+$/.test(t)?/^\d+$/.test(n)?parseInt(t,10)<=12?(i=new Date(n,t),r=new Date,i.setMonth(i.getMonth()-1),i.setMonth(i.getMonth()+1,1),i>r):!1:!1:!1},n.luhnCheck=function(e){var t,n,r,i,s,o;r=!0,i=0,n=(e+"").split("").reverse();for(s=0,o=n.length;s<o;s++){t=n[s],t=parseInt(t,10);if(r=!r)t*=2;t>9&&(t-=9),i+=t}return i%10===0},n.cardType=function(e){return n.cardTypes[e.slice(0,2)]||"Unknown"},n.cardTypes=function(){var e,t,n,r;t={};for(e=n=40;n<=49;e=++n)t[e]="Visa";for(e=r=50;r<=59;e=++r)t[e]="MasterCard";return t[34]=t[37]="American Express",t[60]=t[62]=t[64]=t[65]="Discover",t[35]="JCB",t[30]=t[36]=t[38]=t[39]="Diners Club",t}(),n}.call(this,this.Stripe.token),this.Stripe.bankAccount=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return o(n,t),n.tokenName="bank_account",n.whitelistedAttrs=["country","routing_number","account_number"],n.createToken=function(t,r,i){return r==null&&(r={}),e.token.validate(t,"bank account"),typeof r=="function"&&(i=r,r={}),r[n.tokenName]=e.token.formatData(t,n.whitelistedAttrs),e.token.create(r,i)},n.getToken=function(t,n){return e.token.get(t,n)},n.validateRoutingNumber=function(t,r){t=e.utils.trim(t);switch(r){case"US":return/^\d+$/.test(t)&&t.length===9&&n.routingChecksum(t);case"CA":return/\d{5}\-\d{3}/.test(t)&&t.length===9;default:return!0}},n.validateAccountNumber=function(t,n){t=e.utils.trim(t);switch(n){case"US":return/^\d+$/.test(t)&&t.length>=1&&t.length<=17;default:return!0}},n.routingChecksum=function(e){var t,n,r,i,s,o;r=0,t=(e+"").split(""),o=[0,3,6];for(i=0,s=o.length;i<s;i++)n=o[i],r+=parseInt(t[n])*3,r+=parseInt(t[n+1])*7,r+=parseInt(t[n+2]);return r!==0&&r%10===0},n}.call(this,this.Stripe.token),t=["createToken","getToken","cardType","validateExpiry","validateCVC","validateCardNumber"];for(r=0,i=t.length;r<i;r++)n=t[r],this.Stripe[n]=this.Stripe.card[n];typeof module!="undefined"&&module!==null&&(module.exports=this.Stripe),typeof define=="function"&&define("stripe",[],function(){return u.Stripe})}).call(this),function(){var e,t,n,r=[].slice;e=encodeURIComponent,t=(new Date).getTime(),n=function(t,r,i){var s,o;r==null&&(r=[]);for(s in t)o=t[s],i&&(s=""+i+"["+s+"]"),typeof o=="object"?n(o,r,s):r.push(""+s+"="+e(o));return r.join("&").replace(/%20/g,"+")},this.Stripe.ajaxJSONP=function(e){var i,s,o,u,a,f;return e==null&&(e={}),o="sjsonp"+ ++t,a=document.createElement("script"),s=null,i=function(t){var n;return t==null&&(t="abort"),clearTimeout(s),(n=a.parentNode)!=null&&n.removeChild(a),o in window&&(window[o]=function(){}),typeof e.complete=="function"?e.complete(t,f,e):void 0},f={abort:i},a.onerror=function(){return f.abort(),typeof e.error=="function"?e.error(f,e):void 0},window[o]=function(){var t;t=1<=arguments.length?r.call(arguments,0):[],clearTimeout(s),a.parentNode.removeChild(a);try{delete window[o]}catch(n){window[o]=void 0}return typeof e.success=="function"&&e.success.apply(e,t),typeof e.complete=="function"?e.complete("success",f,e):void 0},e.data||(e.data={}),e.data.callback=o,e.method&&(e.data._method=e.method),a.src=e.url+"?"+n(e.data),u=document.getElementsByTagName("head")[0],u.appendChild(a),e.timeout>0&&(s=setTimeout(function(){return f.abort("timeout")},e.timeout)),f}}.call(this),function(){var e=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};this.Stripe.utils=function(){function t(){}return t.trim=function(e){return(e+"").replace(/^\s+|\s+$/g,"")},t.underscore=function(e){return(e+"").replace(/([A-Z])/g,function(e){return"_"+e.toLowerCase()}).replace(/-/g,"_")},t.underscoreKeys=function(e){var t,n,r;r=[];for(t in e)n=e[t],delete e[t],r.push(e[this.underscore(t)]=n);return r},t.isElement=function(e){return typeof e!="object"?!1:typeof jQuery!="undefined"&&jQuery!==null&&e instanceof jQuery?!0:e.nodeType===1},t.paramsFromForm=function(t,n){var r,i,s,o,u,a,f,l,c,h;n==null&&(n=[]),typeof jQuery!="undefined"&&jQuery!==null&&t instanceof jQuery&&(t=t[0]),s=t.getElementsByTagName("input"),u=t.getElementsByTagName("select"),a={};for(f=0,c=s.length;f<c;f++){i=s[f],r=this.underscore(i.getAttribute("data-stripe"));if(e.call(n,r)<0)continue;a[r]=i.value}for(l=0,h=u.length;l<h;l++){o=u[l],r=this.underscore(o.getAttribute("data-stripe"));if(e.call(n,r)<0)continue;o.selectedIndex!=null&&(a[r]=o.options[o.selectedIndex].value)}return a},t.validateKey=function(e){if(!e||typeof e!="string")throw new Error("You did not set a valid publishable key. Call Stripe.setPublishableKey() with your publishable key. For more info, see https://stripe.com/docs/stripe.js");if(/\s/g.test(e))throw new Error("Your key is invalid, as it contains whitespace. For more info, see https://stripe.com/docs/stripe.js");if(/^sk_/.test(e))throw new Error("You are using a secret key with Stripe.js, instead of the publishable one. For more info, see https://stripe.com/docs/stripe.js")},t}()}.call(this),function(){var e=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};this.Stripe.validator={"boolean":function(e,t){if(t!=="true"&&t!=="false")return"Enter a boolean string (true or false)"},integer:function(e,t){if(!/^\d+$/.test(t))return"Enter an integer"},positive:function(e,t){if(!(!this.integer(e,t)&&parseInt(t,10)>0))return"Enter a positive value"},range:function(t,n){var r;if(r=parseInt(n,10),e.call(t,r)<0)return"Needs to be between "+t[0]+" and "+t[t.length-1]},required:function(e,t){if(e&&(t==null||t===""))return"Required"},year:function(e,t){if(!/^\d{4}$/.test(t))return"Enter a 4-digit year"},birthYear:function(e,t){var n;n=this.year(e,t);if(n)return n;if(parseInt(t,10)>2e3)return"You must be over 18";if(parseInt(t,10)<1900)return"Enter your birth year"},month:function(e,t){if(this.integer(e,t))return"Please enter a month";if(this.range([1,2,3,4,5,6,7,8,9,10,11,12],t))return"Needs to be between 1 and 12"},choices:function(t,n){if(e.call(t,n)<0)return"Not an acceptable value for this field"},email:function(e,t){if(!/^[^@<\s>]+@[^@<\s>]+$/.test(t))return"That doesn't look like an email address"},url:function(e,t){if(!/^https?:\/\/.+\..+/.test(t))return"Not a valid url"},usTaxID:function(e,t){if(!/^\d{2}-?\d{1}-?\d{2}-?\d{4}$/.test(t))return"Not a valid tax ID"},ein:function(e,t){if(!/^\d{2}-?\d{7}$/.test(t))return"Not a valid EIN"},ssnLast4:function(e,t){if(!/^\d{4}$/.test(t))return"Not a valid last 4 digits for an SSN"},ownerPersonalID:function(e,t){var n;n=function(){switch(e){case"CA":return/^\d{3}-?\d{3}-?\d{3}$/.test(t);case"US":return!0}}();if(!n)return"Not a valid ID"},bizTaxID:function(e,t){var n,r,i,s,o,u,a,f;u={CA:["Tax ID",[/^\d{9}$/]],US:["EIN",[/^\d{2}-?\d{7}$/]]},o=u[e];if(o!=null){n=o[0],s=o[1],r=!1;for(a=0,f=s.length;a<f;a++){i=s[a];if(i.test(t)){r=!0;break}}if(!r)return"Not a valid "+n}},zip:function(e,t){var n;n=function(){switch(e.toUpperCase()){case"CA":return/^[\d\w]{6}$/.test(t!=null?t.replace(/\s+/g,""):void 0);case"US":return/^\d{5}$/.test(t)||/^\d{9}$/.test(t)}}();if(!n)return"Not a valid zip"},bankAccountNumber:function(e,t){if(!/^\d{1,17}$/.test(t))return"Invalid bank account number"},usRoutingNumber:function(e){var t,n,r,i,s,o,u;if(!/^\d{9}$/.test(e))return"Routing number must have 9 digits";s=0;for(t=o=0,u=e.length-1;o<=u;t=o+=3)n=parseInt(e.charAt(t),10)*3,r=parseInt(e.charAt(t+1),10)*7,i=parseInt(e.charAt(t+2),10),s+=n+r+i;if(s===0||s%10!==0)return"Invalid routing number"},caRoutingNumber:function(e){if(!/^\d{5}\-\d{3}$/.test(e))return"Invalid transit number"},routingNumber:function(e,t){switch(e.toUpperCase()){case"CA":return this.caRoutingNumber(t);case"US":return this.usRoutingNumber(t)}},phoneNumber:function(e,t){var n;n=t.replace(/[^0-9]/g,"");if(n.length!==10)return"Invalid phone number"},bizDBA:function(e,t){if(!/^.{1,23}$/.test(t))return"Statement descriptors can only have up to 23 characters"},nameLength:function(e,t){if(t.length===1)return"Names need to be longer than one character"}}}.call(this);
// Knockout JavaScript library v3.1.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {(function(p){var A=this||(0,eval)("this"),w=A.document,K=A.navigator,t=A.jQuery,C=A.JSON;(function(p){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],p):p(A.ko={})})(function(z){function G(a,c){return null===a||typeof a in M?a===c:!1}function N(a,c){var d;return function(){d||(d=setTimeout(function(){d=p;a()},c))}}function O(a,c){var d;return function(){clearTimeout(d);d=setTimeout(a,
c)}}function H(b,c,d,e){a.d[b]={init:function(b,h,g,k,l){var n,r;a.ba(function(){var g=a.a.c(h()),k=!d!==!g,s=!r;if(s||c||k!==n)s&&a.ca.fa()&&(r=a.a.lb(a.e.childNodes(b),!0)),k?(s||a.e.U(b,a.a.lb(r)),a.gb(e?e(l,g):l,b)):a.e.da(b),n=k},null,{G:b});return{controlsDescendantBindings:!0}}};a.g.aa[b]=!1;a.e.Q[b]=!0}var a="undefined"!==typeof z?z:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c};a.s=function(a,c,d){a[c]=d};a.version="3.1.0";a.b("version",
a.version);a.a=function(){function b(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c])}function c(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}var e={__proto__:[]}instanceof Array,f={},h={};f[K&&/Firefox\/2/i.test(K.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];f.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(f,function(a,b){if(b.length)for(var c=0,
d=b.length;c<d;c++)h[b[c]]=a});var g={propertychange:!0},k=w&&function(){for(var a=3,b=w.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:p}();return{mb:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],r:function(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)},l:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var c=0,d=a.length;c<d;c++)if(a[c]===
b)return c;return-1},hb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d))return a[d];return null},ma:function(b,c){var d=a.a.l(b,c);0<d?b.splice(d,1):0===d&&b.shift()},ib:function(b){b=b||[];for(var c=[],d=0,e=b.length;d<e;d++)0>a.a.l(c,b[d])&&c.push(b[d]);return c},ya:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)c.push(b(a[d],d));return c},la:function(a,b){a=a||[];for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c},$:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},Y:function(b,c,d){var e=a.a.l(a.a.Sa(b),c);0>e?d&&b.push(c):d||b.splice(e,1)},na:e,extend:c,ra:d,sa:e?d:c,A:b,Oa:function(a,b){if(!a)return a;var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=b(a[d],d,a));return c},Fa:function(b){for(;b.firstChild;)a.removeNode(b.firstChild)},ec:function(b){b=a.a.R(b);for(var c=w.createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.M(b[d]));return c},lb:function(b,c){for(var d=0,e=b.length,g=[];d<
e;d++){var k=b[d].cloneNode(!0);g.push(c?a.M(k):k)}return g},U:function(b,c){a.a.Fa(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d])},Bb:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],g=e.parentNode,k=0,h=c.length;k<h;k++)g.insertBefore(c[k],e);k=0;for(h=d.length;k<h;k++)a.removeNode(d[k])}},ea:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.shift();if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)if(a.push(c),
c=c.nextSibling,!c)return;a.push(d)}}return a},Db:function(a,b){7>k?a.setAttribute("selected",b):a.selected=b},ta:function(a){return null===a||a===p?"":a.trim?a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oc:function(b,c){for(var d=[],e=(b||"").split(c),g=0,k=e.length;g<k;g++){var h=a.a.ta(e[g]);""!==h&&d.push(h)}return d},kc:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},Sb:function(a,b){if(a===b)return!0;if(11===a.nodeType)return!1;if(b.contains)return b.contains(3===
a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return!!a},Ea:function(b){return a.a.Sb(b,b.ownerDocument.documentElement)},eb:function(b){return!!a.a.hb(b,a.a.Ea)},B:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},q:function(b,c,d){var e=k&&g[c];if(!e&&t)t(b).bind(c,d);else if(e||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var h=function(a){d.call(b,a)},f="on"+c;b.attachEvent(f,
h);a.a.u.ja(b,function(){b.detachEvent(f,h)})}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,d,!1)},ha:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.B(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(t&&!d)t(b).trigger(c);else if("function"==typeof w.createEvent)if("function"==typeof b.dispatchEvent)d=w.createEvent(h[c]||"HTMLEvents"),
d.initEvent(c,!0,!0,A,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");},c:function(b){return a.v(b)?b():b},Sa:function(b){return a.v(b)?b.o():b},ua:function(b,c,d){if(c){var e=/\S+/g,g=b.className.match(e)||[];a.a.r(c.match(e),function(b){a.a.Y(g,b,d)});b.className=g.join(" ")}},Xa:function(b,
c){var d=a.a.c(c);if(null===d||d===p)d="";var e=a.e.firstChild(b);!e||3!=e.nodeType||a.e.nextSibling(e)?a.e.U(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Vb(b)},Cb:function(a,b){a.name=b;if(7>=k)try{a.mergeAttributes(w.createElement("<input name='"+a.name+"'/>"),!1)}catch(c){}},Vb:function(a){9<=k&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},Tb:function(a){if(k){var b=a.style.width;a.style.width=0;a.style.width=b}},ic:function(b,c){b=a.a.c(b);c=a.a.c(c);for(var d=
[],e=b;e<=c;e++)d.push(e);return d},R:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},mc:6===k,nc:7===k,oa:k,ob:function(b,c){for(var d=a.a.R(b.getElementsByTagName("input")).concat(a.a.R(b.getElementsByTagName("textarea"))),e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},g=[],k=d.length-1;0<=k;k--)e(d[k])&&g.push(d[k]);return g},fc:function(b){return"string"==typeof b&&(b=a.a.ta(b))?C&&C.parse?C.parse(b):(new Function("return "+b))():
null},Ya:function(b,c,d){if(!C||!C.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");return C.stringify(a.a.c(b),c,d)},gc:function(c,d,e){e=e||{};var g=e.params||{},k=e.includeFields||this.mb,h=c;if("object"==typeof c&&"form"===a.a.B(c))for(var h=c.action,f=k.length-1;0<=f;f--)for(var u=a.a.ob(c,k[f]),D=u.length-1;0<=D;D--)g[u[D].name]=
u[D].value;d=a.a.c(d);var y=w.createElement("form");y.style.display="none";y.action=h;y.method="post";for(var p in d)c=w.createElement("input"),c.name=p,c.value=a.a.Ya(a.a.c(d[p])),y.appendChild(c);b(g,function(a,b){var c=w.createElement("input");c.name=a;c.value=b;y.appendChild(c)});w.body.appendChild(y);e.submitter?e.submitter(y):y.submit();setTimeout(function(){y.parentNode.removeChild(y)},0)}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.r);a.b("utils.arrayFirst",a.a.hb);a.b("utils.arrayFilter",
a.a.la);a.b("utils.arrayGetDistinctValues",a.a.ib);a.b("utils.arrayIndexOf",a.a.l);a.b("utils.arrayMap",a.a.ya);a.b("utils.arrayPushAll",a.a.$);a.b("utils.arrayRemoveItem",a.a.ma);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",a.a.mb);a.b("utils.getFormFields",a.a.ob);a.b("utils.peekObservable",a.a.Sa);a.b("utils.postJson",a.a.gc);a.b("utils.parseJson",a.a.fc);a.b("utils.registerEventHandler",a.a.q);a.b("utils.stringifyJson",a.a.Ya);a.b("utils.range",a.a.ic);a.b("utils.toggleDomNodeCssClass",
a.a.ua);a.b("utils.triggerEvent",a.a.ha);a.b("utils.unwrapObservable",a.a.c);a.b("utils.objectForEach",a.a.A);a.b("utils.addOrRemoveItem",a.a.Y);a.b("unwrap",a.a.c);Function.prototype.bind||(Function.prototype.bind=function(a){var c=this,d=Array.prototype.slice.call(arguments);a=d.shift();return function(){return c.apply(a,d.concat(Array.prototype.slice.call(arguments)))}});a.a.f=new function(){function a(b,h){var g=b[d];if(!g||"null"===g||!e[g]){if(!h)return p;g=b[d]="ko"+c++;e[g]={}}return e[g]}
var c=0,d="__ko__"+(new Date).getTime(),e={};return{get:function(c,d){var e=a(c,!1);return e===p?p:e[d]},set:function(c,d,e){if(e!==p||a(c,!1)!==p)a(c,!0)[d]=e},clear:function(a){var b=a[d];return b?(delete e[b],a[d]=null,!0):!1},L:function(){return c++ +d}}};a.b("utils.domData",a.a.f);a.b("utils.domData.clear",a.a.f.clear);a.a.u=new function(){function b(b,c){var e=a.a.f.get(b,d);e===p&&c&&(e=[],a.a.f.set(b,d,e));return e}function c(d){var e=b(d,!1);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](d);
a.a.f.clear(d);a.a.u.cleanExternalData(d);if(f[d.nodeType])for(e=d.firstChild;d=e;)e=d.nextSibling,8===d.nodeType&&c(d)}var d=a.a.f.L(),e={1:!0,8:!0,9:!0},f={1:!0,9:!0};return{ja:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c)},Ab:function(c,e){var k=b(c,!1);k&&(a.a.ma(k,e),0==k.length&&a.a.f.set(c,d,p))},M:function(b){if(e[b.nodeType]&&(c(b),f[b.nodeType])){var d=[];a.a.$(d,b.getElementsByTagName("*"));for(var k=0,l=d.length;k<l;k++)c(d[k])}return b},
removeNode:function(b){a.M(b);b.parentNode&&b.parentNode.removeChild(b)},cleanExternalData:function(a){t&&"function"==typeof t.cleanData&&t.cleanData([a])}}};a.M=a.a.u.M;a.removeNode=a.a.u.removeNode;a.b("cleanNode",a.M);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.u);a.b("utils.domNodeDisposal.addDisposeCallback",a.a.u.ja);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.u.Ab);(function(){a.a.Qa=function(b){var c;if(t)if(t.parseHTML)c=t.parseHTML(b)||[];else{if((c=t.clean([b]))&&
c[0]){for(b=c[0];b.parentNode&&11!==b.parentNode.nodeType;)b=b.parentNode;b.parentNode&&b.parentNode.removeChild(b)}}else{var d=a.a.ta(b).toLowerCase();c=w.createElement("div");d=d.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!d.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!d.indexOf("<td")||!d.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];b="ignored<div>"+d[1]+b+d[2]+"</div>";for("function"==typeof A.innerShiv?c.appendChild(A.innerShiv(b)):
c.innerHTML=b;d[0]--;)c=c.lastChild;c=a.a.R(c.lastChild.childNodes)}return c};a.a.Va=function(b,c){a.a.Fa(b);c=a.a.c(c);if(null!==c&&c!==p)if("string"!=typeof c&&(c=c.toString()),t)t(b).html(c);else for(var d=a.a.Qa(c),e=0;e<d.length;e++)b.appendChild(d[e])}})();a.b("utils.parseHtmlFragment",a.a.Qa);a.b("utils.setHtml",a.a.Va);a.w=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.w.xb(c.nodeValue);null!=f&&e.push({Rb:c,cc:f})}else if(1==c.nodeType)for(var f=0,h=c.childNodes,g=h.length;f<g;f++)b(h[f],
e)}var c={};return{Na:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},Hb:function(a,b){var f=c[a];if(f===p)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),!0}finally{delete c[a]}},Ib:function(c,e){var f=
[];b(c,f);for(var h=0,g=f.length;h<g;h++){var k=f[h].Rb,l=[k];e&&a.a.$(l,e);a.w.Hb(f[h].cc,l);k.nodeValue="";k.parentNode&&k.parentNode.removeChild(k)}},xb:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.w);a.b("memoization.memoize",a.w.Na);a.b("memoization.unmemoize",a.w.Hb);a.b("memoization.parseMemoText",a.w.xb);a.b("memoization.unmemoizeDomNodeAndDescendants",a.w.Ib);a.Ga={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.h({read:b,write:function(a){clearTimeout(d);
d=setTimeout(function(){b(a)},c)}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);f="notifyWhenChangesStop"==e?O:N;a.Ma(function(a){return f(a,d)})},notify:function(a,c){a.equalityComparer="always"==c?null:G}};var M={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Ga);a.Fb=function(b,c,d){this.target=b;this.za=c;this.Qb=d;this.sb=!1;a.s(this,"dispose",this.F)};a.Fb.prototype.F=function(){this.sb=!0;this.Qb()};a.N=function(){a.a.sa(this,a.N.fn);this.H=
{}};var F="change";z={V:function(b,c,d){var e=this;d=d||F;var f=new a.Fb(e,c?b.bind(c):b,function(){a.a.ma(e.H[d],f)});e.o&&e.o();e.H[d]||(e.H[d]=[]);e.H[d].push(f);return f},notifySubscribers:function(b,c){c=c||F;if(this.qb(c))try{a.k.jb();for(var d=this.H[c].slice(0),e=0,f;f=d[e];++e)f.sb||f.za(b)}finally{a.k.end()}},Ma:function(b){var c=this,d=a.v(c),e,f,h;c.ia||(c.ia=c.notifySubscribers,c.notifySubscribers=function(a,b){b&&b!==F?"beforeChange"===b?c.bb(a):c.ia(a,b):c.cb(a)});var g=b(function(){d&&
h===c&&(h=c());e=!1;c.Ka(f,h)&&c.ia(f=h)});c.cb=function(a){e=!0;h=a;g()};c.bb=function(a){e||(f=a,c.ia(a,"beforeChange"))}},qb:function(a){return this.H[a]&&this.H[a].length},Wb:function(){var b=0;a.a.A(this.H,function(a,d){b+=d.length});return b},Ka:function(a,c){return!this.equalityComparer||!this.equalityComparer(a,c)},extend:function(b){var c=this;b&&a.a.A(b,function(b,e){var f=a.Ga[b];"function"==typeof f&&(c=f(c,e)||c)});return c}};a.s(z,"subscribe",z.V);a.s(z,"extend",z.extend);a.s(z,"getSubscriptionsCount",
z.Wb);a.a.na&&a.a.ra(z,Function.prototype);a.N.fn=z;a.tb=function(a){return null!=a&&"function"==typeof a.V&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.N);a.b("isSubscribable",a.tb);a.ca=a.k=function(){function b(a){d.push(e);e=a}function c(){e=d.pop()}var d=[],e,f=0;return{jb:b,end:c,zb:function(b){if(e){if(!a.tb(b))throw Error("Only subscribable things can act as dependencies");e.za(b,b.Kb||(b.Kb=++f))}},t:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c()}},fa:function(){if(e)return e.ba.fa()},
pa:function(){if(e)return e.pa}}}();a.b("computedContext",a.ca);a.b("computedContext.getDependenciesCount",a.ca.fa);a.b("computedContext.isInitial",a.ca.pa);a.m=function(b){function c(){if(0<arguments.length)return c.Ka(d,arguments[0])&&(c.P(),d=arguments[0],c.O()),this;a.k.zb(c);return d}var d=b;a.N.call(c);a.a.sa(c,a.m.fn);c.o=function(){return d};c.O=function(){c.notifySubscribers(d)};c.P=function(){c.notifySubscribers(d,"beforeChange")};a.s(c,"peek",c.o);a.s(c,"valueHasMutated",c.O);a.s(c,"valueWillMutate",
c.P);return c};a.m.fn={equalityComparer:G};var E=a.m.hc="__ko_proto__";a.m.fn[E]=a.m;a.a.na&&a.a.ra(a.m.fn,a.N.fn);a.Ha=function(b,c){return null===b||b===p||b[E]===p?!1:b[E]===c?!0:a.Ha(b[E],c)};a.v=function(b){return a.Ha(b,a.m)};a.ub=function(b){return"function"==typeof b&&b[E]===a.m||"function"==typeof b&&b[E]===a.h&&b.Yb?!0:!1};a.b("observable",a.m);a.b("isObservable",a.v);a.b("isWriteableObservable",a.ub);a.T=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
b=a.m(b);a.a.sa(b,a.T.fn);return b.extend({trackArrayChanges:!0})};a.T.fn={remove:function(b){for(var c=this.o(),d=[],e="function"!=typeof b||a.v(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var h=c[f];e(h)&&(0===d.length&&this.P(),d.push(h),c.splice(f,1),f--)}d.length&&this.O();return d},removeAll:function(b){if(b===p){var c=this.o(),d=c.slice(0);this.P();c.splice(0,c.length);this.O();return d}return b?this.remove(function(c){return 0<=a.a.l(b,c)}):[]},destroy:function(b){var c=this.o(),d=
"function"!=typeof b||a.v(b)?function(a){return a===b}:b;this.P();for(var e=c.length-1;0<=e;e--)d(c[e])&&(c[e]._destroy=!0);this.O()},destroyAll:function(b){return b===p?this.destroy(function(){return!0}):b?this.destroy(function(c){return 0<=a.a.l(b,c)}):[]},indexOf:function(b){var c=this();return a.a.l(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.P(),this.o()[d]=c,this.O())}};a.a.r("pop push reverse shift sort splice unshift".split(" "),function(b){a.T.fn[b]=function(){var a=this.o();
this.P();this.kb(a,b,arguments);a=a[b].apply(a,arguments);this.O();return a}});a.a.r(["slice"],function(b){a.T.fn[b]=function(){var a=this();return a[b].apply(a,arguments)}});a.a.na&&a.a.ra(a.T.fn,a.m.fn);a.b("observableArray",a.T);var I="arrayChange";a.Ga.trackArrayChanges=function(b){function c(){if(!d){d=!0;var c=b.notifySubscribers;b.notifySubscribers=function(a,b){b&&b!==F||++f;return c.apply(this,arguments)};var k=[].concat(b.o()||[]);e=null;b.V(function(c){c=[].concat(c||[]);if(b.qb(I)){var d;
if(!e||1<f)e=a.a.Aa(k,c,{sparse:!0});d=e;d.length&&b.notifySubscribers(d,I)}k=c;e=null;f=0})}}if(!b.kb){var d=!1,e=null,f=0,h=b.V;b.V=b.subscribe=function(a,b,d){d===I&&c();return h.apply(this,arguments)};b.kb=function(b,c,l){function h(a,b,c){return r[r.length]={status:a,value:b,index:c}}if(d&&!f){var r=[],m=b.length,q=l.length,s=0;switch(c){case "push":s=m;case "unshift":for(c=0;c<q;c++)h("added",l[c],s+c);break;case "pop":s=m-1;case "shift":m&&h("deleted",b[s],s);break;case "splice":c=Math.min(Math.max(0,
0>l[0]?m+l[0]:l[0]),m);for(var m=1===q?m:Math.min(c+(l[1]||0),m),q=c+q-2,s=Math.max(m,q),B=[],u=[],D=2;c<s;++c,++D)c<m&&u.push(h("deleted",b[c],c)),c<q&&B.push(h("added",l[D],c));a.a.nb(u,B);break;default:return}e=r}}}};a.ba=a.h=function(b,c,d){function e(){q=!0;a.a.A(v,function(a,b){b.F()});v={};x=0;n=!1}function f(){var a=g.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(h,a)):g.wa?g.wa():h()}function h(){if(!r&&!q){if(y&&y()){if(!m){p();return}}else m=!1;r=!0;try{var b=v,d=x;a.k.jb({za:function(a,
c){q||(d&&b[c]?(v[c]=b[c],++x,delete b[c],--d):v[c]||(v[c]=a.V(f),++x))},ba:g,pa:!x});v={};x=0;try{var e=c?s.call(c):s()}finally{a.k.end(),d&&a.a.A(b,function(a,b){b.F()}),n=!1}g.Ka(l,e)&&(g.notifySubscribers(l,"beforeChange"),l=e,g.wa&&!g.throttleEvaluation||g.notifySubscribers(l))}finally{r=!1}x||p()}}function g(){if(0<arguments.length){if("function"===typeof B)B.apply(c,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
return this}n&&h();a.k.zb(g);return l}function k(){return n||0<x}var l,n=!0,r=!1,m=!1,q=!1,s=b;s&&"object"==typeof s?(d=s,s=d.read):(d=d||{},s||(s=d.read));if("function"!=typeof s)throw Error("Pass a function that returns the value of the ko.computed");var B=d.write,u=d.disposeWhenNodeIsRemoved||d.G||null,D=d.disposeWhen||d.Da,y=D,p=e,v={},x=0,t=null;c||(c=d.owner);a.N.call(g);a.a.sa(g,a.h.fn);g.o=function(){n&&!x&&h();return l};g.fa=function(){return x};g.Yb="function"===typeof d.write;g.F=function(){p()};
g.ga=k;var w=g.Ma;g.Ma=function(a){w.call(g,a);g.wa=function(){g.bb(l);n=!0;g.cb(g)}};a.s(g,"peek",g.o);a.s(g,"dispose",g.F);a.s(g,"isActive",g.ga);a.s(g,"getDependenciesCount",g.fa);u&&(m=!0,u.nodeType&&(y=function(){return!a.a.Ea(u)||D&&D()}));!0!==d.deferEvaluation&&h();u&&k()&&u.nodeType&&(p=function(){a.a.u.Ab(u,p);e()},a.a.u.ja(u,p));return g};a.$b=function(b){return a.Ha(b,a.h)};z=a.m.hc;a.h[z]=a.m;a.h.fn={equalityComparer:G};a.h.fn[z]=a.h;a.a.na&&a.a.ra(a.h.fn,a.N.fn);a.b("dependentObservable",
a.h);a.b("computed",a.h);a.b("isComputed",a.$b);(function(){function b(a,f,h){h=h||new d;a=f(a);if("object"!=typeof a||null===a||a===p||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var g=a instanceof Array?[]:{};h.save(a,g);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":g[c]=d;break;case "object":case "undefined":var n=h.get(d);g[c]=n!==p?n:b(d,f,h)}});return g}function c(a,b){if(a instanceof Array){for(var c=
0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON")}else for(c in a)b(c)}function d(){this.keys=[];this.ab=[]}a.Gb=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.v(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.Gb(b);return a.a.Ya(b,c,d)};d.prototype={save:function(b,c){var d=a.a.l(this.keys,b);0<=d?this.ab[d]=c:(this.keys.push(b),this.ab.push(c))},get:function(b){b=a.a.l(this.keys,
b);return 0<=b?this.ab[b]:p}}})();a.b("toJS",a.Gb);a.b("toJSON",a.toJSON);(function(){a.i={p:function(b){switch(a.a.B(b)){case "option":return!0===b.__ko__hasDomDataOptionValue__?a.a.f.get(b,a.d.options.Pa):7>=a.a.oa?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex]):p;default:return b.value}},X:function(b,c,d){switch(a.a.B(b)){case "option":switch(typeof c){case "string":a.a.f.set(b,a.d.options.Pa,
p);"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__;b.value=c;break;default:a.a.f.set(b,a.d.options.Pa,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===typeof c?c:""}break;case "select":if(""===c||null===c)c=p;for(var e=-1,f=0,h=b.options.length,g;f<h;++f)if(g=a.i.p(b.options[f]),g==c||""==g&&c===p){e=f;break}if(d||0<=e||c===p&&1<b.size)b.selectedIndex=e;break;default:if(null===c||c===p)c="";b.value=c}}}})();a.b("selectExtensions",a.i);a.b("selectExtensions.readValue",
a.i.p);a.b("selectExtensions.writeValue",a.i.X);a.g=function(){function b(b){b=a.a.ta(b);123===b.charCodeAt(0)&&(b=b.slice(1,-1));var c=[],d=b.match(e),g,m,q=0;if(d){d.push(",");for(var s=0,B;B=d[s];++s){var u=B.charCodeAt(0);if(44===u){if(0>=q){g&&c.push(m?{key:g,value:m.join("")}:{unknown:g});g=m=q=0;continue}}else if(58===u){if(!m)continue}else if(47===u&&s&&1<B.length)(u=d[s-1].match(f))&&!h[u[0]]&&(b=b.substr(b.indexOf(B)+1),d=b.match(e),d.push(","),s=-1,B="/");else if(40===u||123===u||91===
u)++q;else if(41===u||125===u||93===u)--q;else if(!g&&!m){g=34===u||39===u?B.slice(1,-1):B;continue}m?m.push(B):m=[B]}}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,h={"in":1,"return":1,"typeof":1},g={};return{aa:[],W:g,Ra:b,qa:function(e,l){function f(b,e){var l,k=a.getBindingHandler(b);
if(k&&k.preprocess?e=k.preprocess(e,b,f):1){if(k=g[b])l=e,0<=a.a.l(c,l)?l=!1:(k=l.match(d),l=null===k?!1:k[1]?"Object("+k[1]+")"+k[2]:l),k=l;k&&m.push("'"+b+"':function(_z){"+l+"=_z}");q&&(e="function(){return "+e+" }");h.push("'"+b+"':"+e)}}l=l||{};var h=[],m=[],q=l.valueAccessors,s="string"===typeof e?b(e):e;a.a.r(s,function(a){f(a.key||a.unknown,a.value)});m.length&&f("_ko_property_writers","{"+m.join(",")+" }");return h.join(",")},bc:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return!0;
return!1},va:function(b,c,d,e,g){if(b&&a.v(b))!a.ub(b)||g&&b.o()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e)}}}();a.b("expressionRewriting",a.g);a.b("expressionRewriting.bindingRewriteValidators",a.g.aa);a.b("expressionRewriting.parseObjectLiteral",a.g.Ra);a.b("expressionRewriting.preProcessBindings",a.g.qa);a.b("expressionRewriting._twoWayBindings",a.g.W);a.b("jsonExpressionRewriting",a.g);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.g.qa);(function(){function b(a){return 8==
a.nodeType&&h.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function d(a,d){for(var e=a,g=1,k=[];e=e.nextSibling;){if(c(e)&&(g--,0===g))return k;k.push(e);b(e)&&g++}if(!d)throw Error("Cannot find closing comment tag to match: "+a.nodeValue);return null}function e(a,b){var c=d(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=w&&"\x3c!--test--\x3e"===w.createComment("test").text,h=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,
g=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,k={ul:!0,ol:!0};a.e={Q:{},childNodes:function(a){return b(a)?d(a):a.childNodes},da:function(c){if(b(c)){c=a.e.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d])}else a.a.Fa(c)},U:function(c,d){if(b(c)){a.e.da(c);for(var e=c.nextSibling,g=0,k=d.length;g<k;g++)e.parentNode.insertBefore(d[g],e)}else a.a.U(c,d)},yb:function(a,c){b(a)?a.parentNode.insertBefore(c,a.nextSibling):a.firstChild?a.insertBefore(c,a.firstChild):a.appendChild(c)},rb:function(c,
d,e){e?b(c)?c.parentNode.insertBefore(d,e.nextSibling):e.nextSibling?c.insertBefore(d,e.nextSibling):c.appendChild(d):a.e.yb(c,d)},firstChild:function(a){return b(a)?!a.nextSibling||c(a.nextSibling)?null:a.nextSibling:a.firstChild},nextSibling:function(a){b(a)&&(a=e(a));return a.nextSibling&&c(a.nextSibling)?null:a.nextSibling},Xb:b,lc:function(a){return(a=(f?a.text:a.nodeValue).match(h))?a[1]:null},wb:function(d){if(k[a.a.B(d)]){var g=d.firstChild;if(g){do if(1===g.nodeType){var f;f=g.firstChild;
var h=null;if(f){do if(h)h.push(f);else if(b(f)){var q=e(f,!0);q?f=q:h=[f]}else c(f)&&(h=[f]);while(f=f.nextSibling)}if(f=h)for(h=g.nextSibling,q=0;q<f.length;q++)h?d.insertBefore(f[q],h):d.appendChild(f[q])}while(g=g.nextSibling)}}}}})();a.b("virtualElements",a.e);a.b("virtualElements.allowedBindings",a.e.Q);a.b("virtualElements.emptyNode",a.e.da);a.b("virtualElements.insertAfter",a.e.rb);a.b("virtualElements.prepend",a.e.yb);a.b("virtualElements.setDomNodeChildren",a.e.U);(function(){a.J=function(){this.Nb=
{}};a.a.extend(a.J.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=b.getAttribute("data-bind");case 8:return a.e.Xb(b);default:return!1}},getBindings:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a):null},getBindingAccessors:function(a,c){var d=this.getBindingsString(a,c);return d?this.parseBindingsString(d,c,a,{valueAccessors:!0}):null},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");
case 8:return a.e.lc(b);default:return null}},parseBindingsString:function(b,c,d,e){try{var f=this.Nb,h=b+(e&&e.valueAccessors||""),g;if(!(g=f[h])){var k,l="with($context){with($data||{}){return{"+a.g.qa(b,e)+"}}}";k=new Function("$context","$element",l);g=f[h]=k}return g(c,d)}catch(n){throw n.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+n.message,n;}}});a.J.instance=new a.J})();a.b("bindingProvider",a.J);(function(){function b(a){return function(){return a}}function c(a){return a()}
function d(b){return a.a.Oa(a.k.t(b),function(a,c){return function(){return b()[c]}})}function e(a,b){return d(this.getBindings.bind(this,a,b))}function f(b,c,d){var e,g=a.e.firstChild(c),k=a.J.instance,f=k.preprocessNode;if(f){for(;e=g;)g=a.e.nextSibling(e),f.call(k,e);g=a.e.firstChild(c)}for(;e=g;)g=a.e.nextSibling(e),h(b,e,d)}function h(b,c,d){var e=!0,g=1===c.nodeType;g&&a.e.wb(c);if(g&&d||a.J.instance.nodeHasBindings(c))e=k(c,null,b,d).shouldBindDescendants;e&&!n[a.a.B(c)]&&f(b,c,!g)}function g(b){var c=
[],d={},e=[];a.a.A(b,function y(g){if(!d[g]){var k=a.getBindingHandler(g);k&&(k.after&&(e.push(g),a.a.r(k.after,function(c){if(b[c]){if(-1!==a.a.l(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));y(c)}}),e.length--),c.push({key:g,pb:k}));d[g]=!0}});return c}function k(b,d,k,f){var h=a.a.f.get(b,r);if(!d){if(h)throw Error("You cannot apply bindings multiple times to the same element.");a.a.f.set(b,r,!0)}!h&&f&&a.Eb(b,k);var l;if(d&&"function"!==
typeof d)l=d;else{var n=a.J.instance,m=n.getBindingAccessors||e,x=a.h(function(){(l=d?d(k,b):m.call(n,b,k))&&k.D&&k.D();return l},null,{G:b});l&&x.ga()||(x=null)}var t;if(l){var w=x?function(a){return function(){return c(x()[a])}}:function(a){return l[a]},z=function(){return a.a.Oa(x?x():l,c)};z.get=function(a){return l[a]&&c(w(a))};z.has=function(a){return a in l};f=g(l);a.a.r(f,function(c){var d=c.pb.init,e=c.pb.update,g=c.key;if(8===b.nodeType&&!a.e.Q[g])throw Error("The binding '"+g+"' cannot be used with virtual elements");
try{"function"==typeof d&&a.k.t(function(){var a=d(b,w(g),z,k.$data,k);if(a&&a.controlsDescendantBindings){if(t!==p)throw Error("Multiple bindings ("+t+" and "+g+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");t=g}}),"function"==typeof e&&a.h(function(){e(b,w(g),z,k.$data,k)},null,{G:b})}catch(f){throw f.message='Unable to process binding "'+g+": "+l[g]+'"\nMessage: '+f.message,f;}})}return{shouldBindDescendants:t===p}}
function l(b){return b&&b instanceof a.I?b:new a.I(b)}a.d={};var n={script:!0};a.getBindingHandler=function(b){return a.d[b]};a.I=function(b,c,d,e){var g=this,k="function"==typeof b&&!a.v(b),f,h=a.h(function(){var f=k?b():b,l=a.a.c(f);c?(c.D&&c.D(),a.a.extend(g,c),h&&(g.D=h)):(g.$parents=[],g.$root=l,g.ko=a);g.$rawData=f;g.$data=l;d&&(g[d]=l);e&&e(g,c,l);return g.$data},null,{Da:function(){return f&&!a.a.eb(f)},G:!0});h.ga()&&(g.D=h,h.equalityComparer=null,f=[],h.Jb=function(b){f.push(b);a.a.u.ja(b,
function(b){a.a.ma(f,b);f.length||(h.F(),g.D=h=p)})})};a.I.prototype.createChildContext=function(b,c,d){return new a.I(b,this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a)})};a.I.prototype.extend=function(b){return new a.I(this.D||this.$data,this,null,function(c,d){c.$rawData=d.$rawData;a.a.extend(c,"function"==typeof b?b():b)})};var r=a.a.f.L(),m=a.a.f.L();a.Eb=function(b,c){if(2==arguments.length)a.a.f.set(b,m,c),
c.D&&c.D.Jb(b);else return a.a.f.get(b,m)};a.xa=function(b,c,d){1===b.nodeType&&a.e.wb(b);return k(b,c,l(d),!0)};a.Lb=function(c,e,g){g=l(g);return a.xa(c,"function"===typeof e?d(e.bind(null,g,c)):a.a.Oa(e,b),g)};a.gb=function(a,b){1!==b.nodeType&&8!==b.nodeType||f(l(a),b,!0)};a.fb=function(a,b){!t&&A.jQuery&&(t=A.jQuery);if(b&&1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");b=b||A.document.body;h(l(a),
b,!0)};a.Ca=function(b){switch(b.nodeType){case 1:case 8:var c=a.Eb(b);if(c)return c;if(b.parentNode)return a.Ca(b.parentNode)}return p};a.Pb=function(b){return(b=a.Ca(b))?b.$data:p};a.b("bindingHandlers",a.d);a.b("applyBindings",a.fb);a.b("applyBindingsToDescendants",a.gb);a.b("applyBindingAccessorsToNode",a.xa);a.b("applyBindingsToNode",a.Lb);a.b("contextFor",a.Ca);a.b("dataFor",a.Pb)})();var L={"class":"className","for":"htmlFor"};a.d.attr={update:function(b,c){var d=a.a.c(c())||{};a.a.A(d,function(c,
d){d=a.a.c(d);var h=!1===d||null===d||d===p;h&&b.removeAttribute(c);8>=a.a.oa&&c in L?(c=L[c],h?b.removeAttribute(c):b[c]=d):h||b.setAttribute(c,d.toString());"name"===c&&a.a.Cb(b,h?"":d.toString())})}};(function(){a.d.checked={after:["value","attr"],init:function(b,c,d){function e(){return d.has("checkedValue")?a.a.c(d.get("checkedValue")):b.value}function f(){var g=b.checked,f=r?e():g;if(!a.ca.pa()&&(!k||g)){var h=a.k.t(c);l?n!==f?(g&&(a.a.Y(h,f,!0),a.a.Y(h,n,!1)),n=f):a.a.Y(h,f,g):a.g.va(h,d,"checked",
f,!0)}}function h(){var d=a.a.c(c());b.checked=l?0<=a.a.l(d,e()):g?d:e()===d}var g="checkbox"==b.type,k="radio"==b.type;if(g||k){var l=g&&a.a.c(c())instanceof Array,n=l?e():p,r=k||l;k&&!b.name&&a.d.uniqueName.init(b,function(){return!0});a.ba(f,null,{G:b});a.a.q(b,"click",f);a.ba(h,null,{G:b})}}};a.g.W.checked=!0;a.d.checkedValue={update:function(b,c){b.value=a.a.c(c())}}})();a.d.css={update:function(b,c){var d=a.a.c(c());"object"==typeof d?a.a.A(d,function(c,d){d=a.a.c(d);a.a.ua(b,c,d)}):(d=String(d||
""),a.a.ua(b,b.__ko__cssValue,!1),b.__ko__cssValue=d,a.a.ua(b,d,!0))}};a.d.enable={update:function(b,c){var d=a.a.c(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0)}};a.d.disable={update:function(b,c){a.d.enable.update(b,function(){return!a.a.c(c())})}};a.d.event={init:function(b,c,d,e,f){var h=c()||{};a.a.A(h,function(g){"string"==typeof g&&a.a.q(b,g,function(b){var h,n=c()[g];if(n){try{var r=a.a.R(arguments);e=f.$data;r.unshift(e);h=n.apply(e,r)}finally{!0!==h&&(b.preventDefault?
b.preventDefault():b.returnValue=!1)}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation())}})})}};a.d.foreach={vb:function(b){return function(){var c=b(),d=a.a.Sa(c);if(!d||"number"==typeof d.length)return{foreach:c,templateEngine:a.K.Ja};a.a.c(c);return{foreach:d.data,as:d.as,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.K.Ja}}},init:function(b,
c){return a.d.template.init(b,a.d.foreach.vb(c))},update:function(b,c,d,e,f){return a.d.template.update(b,a.d.foreach.vb(c),d,e,f)}};a.g.aa.foreach=!1;a.e.Q.foreach=!0;a.d.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var k=b.ownerDocument;if("activeElement"in k){var f;try{f=k.activeElement}catch(h){f=k.body}e=f===b}k=c();a.g.va(k,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1}var f=e.bind(null,!0),h=e.bind(null,!1);a.a.q(b,"focus",f);a.a.q(b,"focusin",
f);a.a.q(b,"blur",h);a.a.q(b,"focusout",h)},update:function(b,c){var d=!!a.a.c(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===d||(d?b.focus():b.blur(),a.k.t(a.a.ha,null,[b,d?"focusin":"focusout"]))}};a.g.W.hasfocus=!0;a.d.hasFocus=a.d.hasfocus;a.g.W.hasFocus=!0;a.d.html={init:function(){return{controlsDescendantBindings:!0}},update:function(b,c){a.a.Va(b,c())}};H("if");H("ifnot",!1,!0);H("with",!0,!1,function(a,c){return a.createChildContext(c)});var J={};a.d.options={init:function(b){if("select"!==
a.a.B(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return{controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.la(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c}function h(c,d){if(r.length){var e=0<=a.a.l(r,a.i.p(d[0]));a.a.Db(d[0],e);m&&!e&&a.k.t(a.a.ha,null,[b,"change"])}}var g=0!=b.length&&b.multiple?b.scrollTop:null,k=a.a.c(c()),l=d.get("optionsIncludeDestroyed");
c={};var n,r;r=b.multiple?a.a.ya(e(),a.i.p):0<=b.selectedIndex?[a.i.p(b.options[b.selectedIndex])]:[];k&&("undefined"==typeof k.length&&(k=[k]),n=a.a.la(k,function(b){return l||b===p||null===b||!a.a.c(b._destroy)}),d.has("optionsCaption")&&(k=a.a.c(d.get("optionsCaption")),null!==k&&k!==p&&n.unshift(J)));var m=!1;c.beforeRemove=function(a){b.removeChild(a)};k=h;d.has("optionsAfterRender")&&(k=function(b,c){h(0,c);a.k.t(d.get("optionsAfterRender"),null,[c[0],b!==J?b:p])});a.a.Ua(b,n,function(c,e,g){g.length&&
(r=g[0].selected?[a.i.p(g[0])]:[],m=!0);e=b.ownerDocument.createElement("option");c===J?(a.a.Xa(e,d.get("optionsCaption")),a.i.X(e,p)):(g=f(c,d.get("optionsValue"),c),a.i.X(e,a.a.c(g)),c=f(c,d.get("optionsText"),g),a.a.Xa(e,c));return[e]},c,k);a.k.t(function(){d.get("valueAllowUnset")&&d.has("value")?a.i.X(b,a.a.c(d.get("value")),!0):(b.multiple?r.length&&e().length<r.length:r.length&&0<=b.selectedIndex?a.i.p(b.options[b.selectedIndex])!==r[0]:r.length||0<=b.selectedIndex)&&a.a.ha(b,"change")});a.a.Tb(b);
g&&20<Math.abs(g-b.scrollTop)&&(b.scrollTop=g)}};a.d.options.Pa=a.a.f.L();a.d.selectedOptions={after:["options","foreach"],init:function(b,c,d){a.a.q(b,"change",function(){var e=c(),f=[];a.a.r(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.i.p(b))});a.g.va(e,d,"selectedOptions",f)})},update:function(b,c){if("select"!=a.a.B(b))throw Error("values binding applies only to SELECT elements");var d=a.a.c(c());d&&"number"==typeof d.length&&a.a.r(b.getElementsByTagName("option"),function(b){var c=
0<=a.a.l(d,a.i.p(b));a.a.Db(b,c)})}};a.g.W.selectedOptions=!0;a.d.style={update:function(b,c){var d=a.a.c(c()||{});a.a.A(d,function(c,d){d=a.a.c(d);b.style[c]=d||""})}};a.d.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.q(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b)}finally{!0!==d&&(a.preventDefault?a.preventDefault():a.returnValue=!1)}})}};a.d.text={init:function(){return{controlsDescendantBindings:!0}},
update:function(b,c){a.a.Xa(b,c())}};a.e.Q.text=!0;a.d.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.d.uniqueName.Ob;a.a.Cb(b,d)}}};a.d.uniqueName.Ob=0;a.d.value={after:["options","foreach"],init:function(b,c,d){function e(){g=!1;var e=c(),f=a.i.p(b);a.g.va(e,d,"value",f)}var f=["change"],h=d.get("valueUpdate"),g=!1;h&&("string"==typeof h&&(h=[h]),a.a.$(f,h),f=a.a.ib(f));!a.a.oa||"input"!=b.tagName.toLowerCase()||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||
-1!=a.a.l(f,"propertychange")||(a.a.q(b,"propertychange",function(){g=!0}),a.a.q(b,"focus",function(){g=!1}),a.a.q(b,"blur",function(){g&&e()}));a.a.r(f,function(c){var d=e;a.a.kc(c,"after")&&(d=function(){setTimeout(e,0)},c=c.substring(5));a.a.q(b,c,d)})},update:function(b,c,d){var e=a.a.c(c());c=a.i.p(b);if(e!==c)if("select"===a.a.B(b)){var f=d.get("valueAllowUnset");d=function(){a.i.X(b,e,f)};d();f||e===a.i.p(b)?setTimeout(d,0):a.k.t(a.a.ha,null,[b,"change"])}else a.i.X(b,e)}};a.g.W.value=!0;a.d.visible=
{update:function(b,c){var d=a.a.c(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none")}};(function(b){a.d[b]={init:function(c,d,e,f,h){return a.d.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,h)}}})("click");a.C=function(){};a.C.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.C.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.C.prototype.makeTemplateSource=
function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.n.j(d)}if(1==b.nodeType||8==b.nodeType)return new a.n.Z(b);throw Error("Unknown template type: "+b);};a.C.prototype.renderTemplate=function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d)};a.C.prototype.isTemplateRewritten=function(a,c){return!1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.C.prototype.rewriteTemplate=
function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0)};a.b("templateEngine",a.C);a.Za=function(){function b(b,c,d,g){b=a.g.Ra(b);for(var k=a.g.aa,l=0;l<b.length;l++){var n=b[l].key;if(k.hasOwnProperty(n)){var r=k[n];if("function"===typeof r){if(n=r(b[l].value))throw Error(n);}else if(!r)throw Error("This template engine does not support the '"+n+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.g.qa(b,
{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return g.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return{Ub:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.Za.dc(b,c)},d)},dc:function(a,f){return a.replace(c,function(a,c,d,e,n){return b(n,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e",
"#comment",f)})},Mb:function(b,c){return a.w.Na(function(d,g){var k=d.nextSibling;k&&k.nodeName.toLowerCase()===c&&a.xa(k,b,g)})}}}();a.b("__tr_ambtns",a.Za.Mb);(function(){a.n={};a.n.j=function(a){this.j=a};a.n.j.prototype.text=function(){var b=a.a.B(this.j),b="script"===b?"text":"textarea"===b?"value":"innerHTML";if(0==arguments.length)return this.j[b];var c=arguments[0];"innerHTML"===b?a.a.Va(this.j,c):this.j[b]=c};var b=a.a.f.L()+"_";a.n.j.prototype.data=function(c){if(1===arguments.length)return a.a.f.get(this.j,
b+c);a.a.f.set(this.j,b+c,arguments[1])};var c=a.a.f.L();a.n.Z=function(a){this.j=a};a.n.Z.prototype=new a.n.j;a.n.Z.prototype.text=function(){if(0==arguments.length){var b=a.a.f.get(this.j,c)||{};b.$a===p&&b.Ba&&(b.$a=b.Ba.innerHTML);return b.$a}a.a.f.set(this.j,c,{$a:arguments[0]})};a.n.j.prototype.nodes=function(){if(0==arguments.length)return(a.a.f.get(this.j,c)||{}).Ba;a.a.f.set(this.j,c,{Ba:arguments[0]})};a.b("templateSources",a.n);a.b("templateSources.domElement",a.n.j);a.b("templateSources.anonymousTemplate",
a.n.Z)})();(function(){function b(b,c,d){var e;for(c=a.e.nextSibling(c);b&&(e=b)!==c;)b=a.e.nextSibling(e),d(e,b)}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],h=e.parentNode,m=a.J.instance,q=m.preprocessNode;if(q){b(e,f,function(a,b){var c=a.previousSibling,d=q.call(m,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c))});c.length=0;if(!e)return;e===f?c.push(e):(c.push(e,f),a.a.ea(c,h))}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.fb(d,b)});b(e,f,function(b){1!==b.nodeType&&8!==
b.nodeType||a.w.Ib(b,[d])});a.a.ea(c,h)}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,h,n,r){r=r||{};var m=b&&d(b),m=m&&m.ownerDocument,q=r.templateEngine||f;a.Za.Ub(h,q,m);h=q.renderTemplate(h,n,r,m);if("number"!=typeof h.length||0<h.length&&"number"!=typeof h[0].nodeType)throw Error("Template engine must return an array of DOM nodes");m=!1;switch(e){case "replaceChildren":a.e.U(b,h);m=!0;break;case "replaceNode":a.a.Bb(b,h);m=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+
e);}m&&(c(h,n),r.afterRender&&a.k.t(r.afterRender,null,[h,n.$data]));return h}var f;a.Wa=function(b){if(b!=p&&!(b instanceof a.C))throw Error("templateEngine must inherit from ko.templateEngine");f=b};a.Ta=function(b,c,h,n,r){h=h||{};if((h.templateEngine||f)==p)throw Error("Set a template engine before calling renderTemplate");r=r||"replaceChildren";if(n){var m=d(n);return a.h(function(){var f=c&&c instanceof a.I?c:new a.I(a.a.c(c)),p=a.v(b)?b():"function"==typeof b?b(f.$data,f):b,f=e(n,r,p,f,h);
"replaceNode"==r&&(n=f,m=d(n))},null,{Da:function(){return!m||!a.a.Ea(m)},G:m&&"replaceNode"==r?m.parentNode:m})}return a.w.Na(function(d){a.Ta(b,c,h,d,"replaceNode")})};a.jc=function(b,d,f,h,r){function m(a,b){c(b,s);f.afterRender&&f.afterRender(b,a)}function q(a,c){s=r.createChildContext(a,f.as,function(a){a.$index=c});var d="function"==typeof b?b(a,s):b;return e(null,"ignoreTargetNode",d,s,f)}var s;return a.h(function(){var b=a.a.c(d)||[];"undefined"==typeof b.length&&(b=[b]);b=a.a.la(b,function(b){return f.includeDestroyed||
b===p||null===b||!a.a.c(b._destroy)});a.k.t(a.a.Ua,null,[h,b,q,f,m])},null,{G:h})};var h=a.a.f.L();a.d.template={init:function(b,c){var d=a.a.c(c());"string"==typeof d||d.name?a.e.da(b):(d=a.e.childNodes(b),d=a.a.ec(d),(new a.n.Z(b)).nodes(d));return{controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var m=c(),q;c=a.a.c(m);d=!0;e=null;"string"==typeof c?c={}:(m=c.name,"if"in c&&(d=a.a.c(c["if"])),d&&"ifnot"in c&&(d=!a.a.c(c.ifnot)),q=a.a.c(c.data));"foreach"in c?e=a.jc(m||b,d&&c.foreach||
[],c,b,f):d?(f="data"in c?f.createChildContext(q,c.as):f,e=a.Ta(m||b,f,c,b)):a.e.da(b);f=e;(q=a.a.f.get(b,h))&&"function"==typeof q.F&&q.F();a.a.f.set(b,h,f&&f.ga()?f:p)}};a.g.aa.template=function(b){b=a.g.Ra(b);return 1==b.length&&b[0].unknown||a.g.bc(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.e.Q.template=!0})();a.b("setTemplateEngine",a.Wa);a.b("renderTemplate",a.Ta);a.a.nb=function(a,c,d){if(a.length&&c.length){var e,f,h,g,k;for(e=
f=0;(!d||e<d)&&(g=a[f]);++f){for(h=0;k=c[h];++h)if(g.value===k.value){g.moved=k.index;k.moved=g.index;c.splice(h,1);e=h=0;break}e+=h}}};a.a.Aa=function(){function b(b,d,e,f,h){var g=Math.min,k=Math.max,l=[],n,p=b.length,m,q=d.length,s=q-p||1,t=p+q+1,u,w,y;for(n=0;n<=p;n++)for(w=u,l.push(u=[]),y=g(q,n+s),m=k(0,n-1);m<=y;m++)u[m]=m?n?b[n-1]===d[m-1]?w[m-1]:g(w[m]||t,u[m-1]||t)+1:m+1:n+1;g=[];k=[];s=[];n=p;for(m=q;n||m;)q=l[n][m]-1,m&&q===l[n][m-1]?k.push(g[g.length]={status:e,value:d[--m],index:m}):
n&&q===l[n-1][m]?s.push(g[g.length]={status:f,value:b[--n],index:n}):(--m,--n,h.sparse||g.push({status:"retained",value:d[m]}));a.a.nb(k,s,10*p);return g.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<=d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Aa);(function(){function b(b,c,f,h,g){var k=[],l=a.h(function(){var l=c(f,g,a.a.ea(k,b))||[];0<k.length&&(a.a.Bb(k,l),h&&a.k.t(h,null,[f,
l,g]));k.length=0;a.a.$(k,l)},null,{G:b,Da:function(){return!a.a.eb(k)}});return{S:k,h:l.ga()?l:p}}var c=a.a.f.L();a.a.Ua=function(d,e,f,h,g){function k(b,c){v=r[c];u!==c&&(z[b]=v);v.Ia(u++);a.a.ea(v.S,d);s.push(v);y.push(v)}function l(b,c){if(b)for(var d=0,e=c.length;d<e;d++)c[d]&&a.a.r(c[d].S,function(a){b(a,d,c[d].ka)})}e=e||[];h=h||{};var n=a.a.f.get(d,c)===p,r=a.a.f.get(d,c)||[],m=a.a.ya(r,function(a){return a.ka}),q=a.a.Aa(m,e,h.dontLimitMoves),s=[],t=0,u=0,w=[],y=[];e=[];for(var z=[],m=[],
v,x=0,A,C;A=q[x];x++)switch(C=A.moved,A.status){case "deleted":C===p&&(v=r[t],v.h&&v.h.F(),w.push.apply(w,a.a.ea(v.S,d)),h.beforeRemove&&(e[x]=v,y.push(v)));t++;break;case "retained":k(x,t++);break;case "added":C!==p?k(x,C):(v={ka:A.value,Ia:a.m(u++)},s.push(v),y.push(v),n||(m[x]=v))}l(h.beforeMove,z);a.a.r(w,h.beforeRemove?a.M:a.removeNode);for(var x=0,n=a.e.firstChild(d),E;v=y[x];x++){v.S||a.a.extend(v,b(d,f,v.ka,g,v.Ia));for(t=0;q=v.S[t];n=q.nextSibling,E=q,t++)q!==n&&a.e.rb(d,q,E);!v.Zb&&g&&(g(v.ka,
v.S,v.Ia),v.Zb=!0)}l(h.beforeRemove,e);l(h.afterMove,z);l(h.afterAdd,m);a.a.f.set(d,c,s)}})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.Ua);a.K=function(){this.allowTemplateRewriting=!1};a.K.prototype=new a.C;a.K.prototype.renderTemplateSource=function(b){var c=(9>a.a.oa?0:b.nodes)?b.nodes():null;if(c)return a.a.R(c.cloneNode(!0).childNodes);b=b.text();return a.a.Qa(b)};a.K.Ja=new a.K;a.Wa(a.K.Ja);a.b("nativeTemplateEngine",a.K);(function(){a.La=function(){var a=this.ac=function(){if(!t||
!t.tmpl)return 0;try{if(0<=t.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,e,f){f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=t.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=t.extend({koBindingContext:e},f.templateOptions);e=t.tmpl(h,b,e);e.appendTo(w.createElement("div"));
t.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(t.tmpl.tag.ko_code={open:"__.push($1 || '');"},t.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};a.La.prototype=new a.C;var b=new a.La;0<b.ac&&a.Wa(b);a.b("jqueryTmplTemplateEngine",a.La)})()})})();})();

/*
===============================================================================
    Author:     Eric M. Barnard - @ericmbarnard                                
    License:    MIT (http://opensource.org/licenses/mit-license.php)           
                                                                               
    Description: Validation Library for KnockoutJS                             
===============================================================================
*/
(function(a){typeof require=="function"&&typeof exports=="object"&&typeof module=="object"?a(require("knockout"),exports):typeof define=="function"&&define.amd?define(["knockout","exports"],a):a(ko,ko.validation={})})(function(a,b){function i(a,c,d){return c.validator(a(),d.params===undefined?!0:d.params)?!0:(a.error=b.formatMessage(d.message||c.message,d.params),a.__valid__(!1),!1)}function j(a,c,d){a.isValidating(!0);var e=function(e){var f=!1,g="";if(!a.__valid__()){a.isValidating(!1);return}e.message?(f=e.isValid,g=e.message):f=e,f||(a.error=b.formatMessage(g||d.message||c.message,d.params),a.__valid__(f)),a.isValidating(!1)};c.validator(a(),d.params||!0,e)}if(typeof a===undefined)throw"Knockout is required, please ensure it is loaded before loading this validation plug-in";typeof define=="function"&&define.amd&&(b=a.validation={});var c={registerExtenders:!0,messagesOnModified:!0,errorsAsTitleOnModified:!1,messageTemplate:null,insertMessages:!0,parseInputAttributes:!1,writeInputAttributes:!1,decorateElement:!1,errorClass:null,errorElementClass:"validationElement",errorMessageClass:"validationMessage",grouping:{deep:!1,observable:!0}},d=a.utils.extend({},c),e=["required","pattern","min","max","step"],f=function(a){window.setImmediate?window.setImmediate(a):window.setTimeout(a,0)},g=function(){var a=(new Date).getTime(),b={},c="__ko_validation__";return{isArray:function(a){return a.isArray||Object.prototype.toString.call(a)==="[object Array]"},isObject:function(a){return a!==null&&typeof a=="object"},values:function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(a[c]);return b},getValue:function(a){return typeof a=="function"?a():a},hasAttribute:function(a,b){return a.getAttribute(b)!==null},isValidatable:function(a){return a&&a.rules&&a.isValid&&a.isModified},insertAfter:function(a,b){a.parentNode.insertBefore(b,a.nextSibling)},newId:function(){return a+=1},getConfigOptions:function(a){var b=g.contextFor(a);return b||d},setDomData:function(a,d){var e=a[c];e||(a[c]=e=g.newId()),b[e]=d},getDomData:function(a){var d=a[c];return d?b[d]:undefined},contextFor:function(a){switch(a.nodeType){case 1:case 8:var b=g.getDomData(a);if(b)return b;if(a.parentNode)return g.contextFor(a.parentNode)}return undefined},isEmptyVal:function(a){if(a===undefined)return!0;if(a===null)return!0;if(a==="")return!0}}}(),h=function(){var f=0;return{utils:g,init:function(c,e){if(f>0&&!e)return;c=c||{},c.errorElementClass=c.errorElementClass||c.errorClass||d.errorElementClass,c.errorMessageClass=c.errorMessageClass||c.errorClass||d.errorMessageClass,a.utils.extend(d,c),d.registerExtenders&&b.registerExtenders(),f=1},configure:function(a){b.init(a)},reset:function(){d=$.extend(d,c)},group:function h(b,c){var c=a.utils.extend(d.grouping,c),e=a.observableArray([]),f=null,h=function i(b,d){var f=[],h=a.utils.unwrapObservable(b);d=d!==undefined?d:c.deep?1:-1,a.isObservable(b)&&(b.isValid||b.extend({validatable:!0}),e.push(b)),h&&(g.isArray(h)?f=h:g.isObject(h)&&(f=g.values(h))),d!==0&&a.utils.arrayForEach(f,function(a){a&&!a.nodeType&&i(a,d+1)})};return c.observable?(h(b),f=a.computed(function(){var b=[];return a.utils.arrayForEach(e(),function(a){a.isValid()||b.push(a.error)}),b})):f=function(){var c=[];return e([]),h(b),a.utils.arrayForEach(e(),function(a){a.isValid()||c.push(a.error)}),c},f.showAllMessages=function(b){b==undefined&&(b=!0),f(),a.utils.arrayForEach(e(),function(a){a.isModified(b)})},b.errors=f,b.isValid=function(){return b.errors().length===0},b.isAnyMessageShown=function(){var b=!1;return f(),a.utils.arrayForEach(e(),function(a){!a.isValid()&&a.isModified()&&(b=!0)}),b},f},formatMessage:function(a,b){return typeof a=="function"?a(b):a.replace(/\{0\}/gi,b)},addRule:function(a,b){return a.extend({validatable:!0}),a.rules.push(b),a},addAnonymousRule:function(a,c){var d=g.newId();c.message===undefined&&(c.message="Error"),b.rules[d]=c,b.addRule(a,{rule:d,params:c.params})},addExtender:function(c){a.extenders[c]=function(a,d){return d.message||d.onlyIf?b.addRule(a,{rule:c,message:d.message,params:g.isEmptyVal(d.params)?!0:d.params,condition:d.onlyIf}):b.addRule(a,{rule:c,params:d})}},registerExtenders:function(){if(d.registerExtenders)for(var c in b.rules)b.rules.hasOwnProperty(c)&&(a.extenders[c]||b.addExtender(c))},insertValidationMessage:function(a){var b=document.createElement("SPAN");return b.className=g.getConfigOptions(a).errorMessageClass,g.insertAfter(a,b),b},parseInputValidationAttributes:function(c,d){a.utils.arrayForEach(e,function(a){g.hasAttribute(c,a)&&b.addRule(d(),{rule:a,params:c.getAttribute(a)||!0})})},writeInputValidationAttributes:function(b,c){var d=c();if(!d||!d.rules)return;var f=d.rules();a.utils.arrayForEach(e,function(c){var d,e=a.utils.arrayFirst(f,function(a){return a.rule.toLowerCase()===c.toLowerCase()});if(!e)return;d=e.params,e.rule=="pattern"&&e.params instanceof RegExp&&(d=e.params.source),b.setAttribute(c,d)}),f=null}}}();h.rules={},h.rules.required={validator:function(a,b){var c=/^\s+|\s+$/g,d;return a===undefined||a===null?!b:(d=a,typeof a=="string"&&(d=a.replace(c,"")),b?(d+"").length>0:!0)},message:"This field is required."},h.rules.min={validator:function(a,b){return g.isEmptyVal(a)||a>=b},message:"Please enter a value greater than or equal to {0}."},h.rules.max={validator:function(a,b){return g.isEmptyVal(a)||a<=b},message:"Please enter a value less than or equal to {0}."},h.rules.minLength={validator:function(a,b){return g.isEmptyVal(a)||a.length>=b},message:"Please enter at least {0} characters."},h.rules.maxLength={validator:function(a,b){return g.isEmptyVal(a)||a.length<=b},message:"Please enter no more than {0} characters."},h.rules.pattern={validator:function(a,b){return g.isEmptyVal(a)||a.match(b)!=null},message:"Please check this value."},h.rules.step={validator:function(a,b){return g.isEmptyVal(a)||a*100%(b*100)===0},message:"The value must increment by {0}"},h.rules.email={validator:function(a,b){return b?g.isEmptyVal(a)||b&&/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a):!0},message:"Please enter a proper email address"},h.rules.date={validator:function(a,b){return b?g.isEmptyVal(a)||b&&!/Invalid|NaN/.test(new Date(a)):!0},message:"Please enter a proper date"},h.rules.dateISO={validator:function(a,b){return b?g.isEmptyVal(a)||b&&/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a):!0},message:"Please enter a proper date"},h.rules.number={validator:function(a,b){return b?g.isEmptyVal(a)||b&&/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a):!0},message:"Please enter a number"},h.rules.digit={validator:function(a,b){return b?g.isEmptyVal(a)||b&&/^\d+$/.test(a):!0},message:"Please enter a digit"},h.rules.phoneUS={validator:function(a,b){return b?typeof a!="string"?!1:g.isEmptyVal(a)?!0:(a=a.replace(/\s+/g,""),b&&a.length>9&&a.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)):!0},message:"Please specify a valid phone number"},h.rules.equal={validator:function(a,b){var c=b;return a===g.getValue(c)},message:"Values must equal"},h.rules.notEqual={validator:function(a,b){var c=b;return a!==g.getValue(c)},message:"Please choose another value."},h.rules.unique={validator:function(b,c){var d=g.getValue(c.collection),e=g.getValue(c.externalValue),f=0;return!b||!d?!0:(a.utils.arrayFilter(a.utils.unwrapObservable(d),function(a){b===(c.valueAccessor?c.valueAccessor(a):a)&&f++}),f<(e!==undefined&&b!==e?1:2))},message:"Please make sure the value is unique."},function(){h.registerExtenders()}(),a.bindingHandlers.validationCore=function(){return{init:function(c,d,e,h,i){var j=g.getConfigOptions(c);j.parseInputAttributes&&f(function(){b.parseInputValidationAttributes(c,d)});if(j.insertMessages&&g.isValidatable(d())){var k=b.insertValidationMessage(c);j.messageTemplate?a.renderTemplate(j.messageTemplate,{field:d()},null,k,"replaceNode"):a.applyBindingsToNode(k,{validationMessage:d()})}j.writeInputAttributes&&g.isValidatable(d())&&b.writeInputValidationAttributes(c,d),j.decorateElement&&g.isValidatable(d())&&a.applyBindingsToNode(c,{validationElement:d()})},update:function(a,b,c,d,e){}}}(),function(){var b=a.bindingHandlers.value.init;a.bindingHandlers.value.init=function(c,d,e,f,g){return b(c,d,e),a.bindingHandlers.validationCore.init(c,d,e,f,g)}}(),a.bindingHandlers.validationMessage={update:function(b,c){var d=c(),e=g.getConfigOptions(b),f=a.utils.unwrapObservable(d),h=null,i=!1,j=!1;d.extend({validatable:!0}),i=d.isModified(),j=d.isValid();var k=function(){return!e.messagesOnModified||i?j?null:d.error:null},l=function(){return i?!j:!1};a.bindingHandlers.text.update(b,k),a.bindingHandlers.visible.update(b,l)}},a.bindingHandlers.validationElement={update:function(b,c){var d=c(),e=g.getConfigOptions(b),f=a.utils.unwrapObservable(d),h=null,i=!1,j=!1;d.extend({validatable:!0}),i=d.isModified(),j=d.isValid();var k=function(){var a={},b=i?!j:!1;return e.decorateElement||(b=!1),a[e.errorElementClass]=b,a};a.bindingHandlers.css.update(b,k);var l=b.getAttribute("data-orig-title"),m=b.title,n=b.getAttribute("data-orig-title")=="true",o=function(){if(!e.errorsAsTitleOnModified||i)return j?{title:l||m,"data-orig-title":null}:{title:d.error,"data-orig-title":l||m}};a.bindingHandlers.attr.update(b,o)}},a.bindingHandlers.validationOptions=function(){return{init:function(b,c,e,f,h){var i=a.utils.unwrapObservable(c());if(i){var j=a.utils.extend({},d);a.utils.extend(j,i),g.setDomData(b,j)}}}}(),a.extenders.validation=function(c,d){return a.utils.arrayForEach(g.isArray(d)?d:[d],function(a){b.addAnonymousRule(c,a)}),c},a.extenders.validatable=function(c,d){if(d&&!g.isValidatable(c)){c.error=null,c.rules=a.observableArray(),c.isValidating=a.observable(!1),c.__valid__=a.observable(!0),c.isModified=a.observable(!1);var e=a.computed(function(){var a=c(),d=c.rules();return b.validateObservable(c),!0});c.isValid=a.computed(function(){return c.__valid__()});var f=c.subscribe(function(){c.isModified(!0)});c._disposeValidation=function(){c.isValid.dispose(),c.rules.removeAll(),c.isModified._subscriptions.change=[],c.isValidating._subscriptions.change=[],c.__valid__._subscriptions.change=[],f.dispose(),e.dispose(),delete c.rules,delete c.error,delete c.isValid,delete c.isValidating,delete c.__valid__,delete c.isModified}}else d===!1&&g.isValidatable(c)&&c._disposeValidation&&c._disposeValidation();return c},h.validateObservable=function(a){var c=0,d,e,f=a.rules(),g=f.length;for(;c<g;c++){e=f[c];if(e.condition&&!e.condition())continue;d=b.rules[e.rule];if(d.async||e.async)j(a,d,e);else if(!i(a,d,e))return!1}return a.error=null,a.__valid__(!0),!0},a.validatedObservable=function(c){if(!b.utils.isObject(c))return a.observable(c).extend({validatable:!0});var d=a.observable(c);return d.errors=b.group(c),d.isValid=a.computed(function(){return d.errors().length===0}),d},h.localize=function(a){var c,d;for(d in a)b.rules.hasOwnProperty(d)&&(b.rules[d].message=a[d])},a.applyBindingsWithValidation=function(c,d,e){var f=arguments.length,g,h;f>2?(g=d,h=e):f<2?g=document.body:arguments[1].nodeType?g=d:h=arguments[1],b.init(),h&&b.utils.setDomData(g,h),a.applyBindings(c,d)};var k=a.applyBindings;a.applyBindings=function(a,c){b.init(),k(a,c)},a.utils.extend(b,h)});
// Generated by CoffeeScript 1.4.0
initJQueryPayments = function(jQuery) {
  var $, cardFromNumber, cardFromType, cards, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictExpiry, restrictNumeric, setCardType,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    _this = this;

  $ = jQuery;

  $.payment = {};

  $.payment.fn = {};

  $.fn.payment = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return $.payment.fn[method].apply(this, args);
  };

  defaultFormat = /(\d{1,4})/g;

  cards = [
    {
      type: 'maestro',
      pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
      format: defaultFormat,
      length: [12, 13, 14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'dinersclub',
      pattern: /^(36|38|30[0-5])/,
      format: defaultFormat,
      length: [14],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'laser',
      pattern: /^(6706|6771|6709)/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'jcb',
      pattern: /^35/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'unionpay',
      pattern: /^62/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: false
    }, {
      type: 'discover',
      pattern: /^(6011|65|64[4-9]|622)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'mastercard',
      pattern: /^5[1-5]/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true
    }, {
      type: 'amex',
      pattern: /^3[47]/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
      length: [15],
      cvcLength: [3, 4],
      luhn: true
    }, {
      type: 'visa',
      pattern: /^4/,
      format: defaultFormat,
      length: [13, 14, 15, 16],
      cvcLength: [3],
      luhn: true
    }
  ];

  cardFromNumber = function(num) {
    var card, _i, _len;
    num = (num + '').replace(/\D/g, '');
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.pattern.test(num)) {
        return card;
      }
    }
  };

  cardFromType = function(type) {
    var card, _i, _len;
    for (_i = 0, _len = cards.length; _i < _len; _i++) {
      card = cards[_i];
      if (card.type === type) {
        return card;
      }
    }
  };

  luhnCheck = function(num) {
    var digit, digits, odd, sum, _i, _len;
    odd = true;
    sum = 0;
    digits = (num + '').split('').reverse();
    for (_i = 0, _len = digits.length; _i < _len; _i++) {
      digit = digits[_i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  hasTextSelected = function($target) {
    var _ref;
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
      return true;
    }
    if (typeof document !== "undefined" && document !== null ? (_ref = document.selection) != null ? typeof _ref.createRange === "function" ? _ref.createRange().text : void 0 : void 0 : void 0) {
      return true;
    }
    return false;
  };

  reFormatCardNumber = function(e) {
    var _this = this;
    return setTimeout(function() {
      var $target, value;
      $target = $(e.currentTarget);
      value = $target.val();
      value = $.payment.formatCardNumber(value);
      return $target.val(value);
    });
  };

  formatCardNumber = function(e) {
    var $target, card, digit, length, re, upperLength, value;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    card = cardFromNumber(value + digit);
    length = (value.replace(/\D/g, '') + digit).length;
    upperLength = 16;
    if (card) {
      upperLength = card.length[card.length.length - 1];
    }
    if (length >= upperLength) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (card && card.type === 'amex') {
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    }
    if (re.test(value)) {
      e.preventDefault();
      return $target.val(value + ' ' + digit);
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return $target.val(value + digit + ' ');
    }
  };

  formatBackCardNumber = function(e) {
    var $target, value;
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.meta) {
      return;
    }
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\d\s$/, ''));
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\s\d?$/, ''));
    }
  };

  formatExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val() + digit;
    if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
      e.preventDefault();
      return $target.val("0" + val + " / ");
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return $target.val("" + val + " / ");
    }
  };

  formatForwardExpiry = function(e) {
    var $target, digit, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d\d$/.test(val)) {
      return $target.val("" + val + " / ");
    }
  };

  formatForwardSlash = function(e) {
    var $target, slash, val;
    slash = String.fromCharCode(e.which);
    if (slash !== '/') {
      return;
    }
    $target = $(e.currentTarget);
    val = $target.val();
    if (/^\d$/.test(val) && val !== '0') {
      return $target.val("0" + val + " / ");
    }
  };

  formatBackExpiry = function(e) {
    var $target, value;
    if (e.meta) {
      return;
    }
    $target = $(e.currentTarget);
    value = $target.val();
    if (e.which !== 8) {
      return;
    }
    if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
      return;
    }
    if (/\d(\s|\/)+$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\d(\s|\/)*$/, ''));
    } else if (/\s\/\s?\d?$/.test(value)) {
      e.preventDefault();
      return $target.val(value.replace(/\s\/\s?\d?$/, ''));
    }
  };

  restrictNumeric = function(e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  };

  restrictCardNumber = function(e) {
    var $target, card, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = ($target.val() + digit).replace(/\D/g, '');
    card = cardFromNumber(value);
    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      return value.length <= 16;
    }
  };

  restrictExpiry = function(e) {
    var $target, digit, value;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected($target)) {
      return;
    }
    value = $target.val() + digit;
    value = value.replace(/\D/g, '');
    if (value.length > 6) {
      return false;
    }
  };

  restrictCVC = function(e) {
    var $target, digit, val;
    $target = $(e.currentTarget);
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    val = $target.val() + digit;
    return val.length <= 4;
  };

  setCardType = function(e) {
    var $target, allTypes, card, cardType, val;
    $target = $(e.currentTarget);
    val = $target.val();
    cardType = $.payment.cardType(val) || 'unknown';
    if (!$target.hasClass(cardType)) {
      allTypes = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = cards.length; _i < _len; _i++) {
          card = cards[_i];
          _results.push(card.type);
        }
        return _results;
      })();
      $target.removeClass('unknown');
      $target.removeClass(allTypes.join(' '));
      $target.addClass(cardType);
      $target.toggleClass('identified', cardType !== 'unknown');
      return $target.trigger('payment.cardType', cardType);
    }
  };

  $.payment.fn.formatCardCVC = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCVC);
    return this;
  };

  $.payment.fn.formatCardExpiry = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictExpiry);
    this.on('keypress', formatExpiry);
    this.on('keypress', formatForwardSlash);
    this.on('keypress', formatForwardExpiry);
    this.on('keydown', formatBackExpiry);
    return this;
  };

  $.payment.fn.formatCardNumber = function() {
    this.payment('restrictNumeric');
    this.on('keypress', restrictCardNumber);
    this.on('keypress', formatCardNumber);
    this.on('keydown', formatBackCardNumber);
    this.on('keyup', setCardType);
    this.on('paste', reFormatCardNumber);
    return this;
  };

  $.payment.fn.restrictNumeric = function() {
    this.on('keypress', restrictNumeric);
    return this;
  };

  $.payment.fn.cardExpiryVal = function() {
    return $.payment.cardExpiryVal($(this).val());
  };

  $.payment.cardExpiryVal = function(value) {
    var month, prefix, year, _ref;
    value = value.replace(/\s/g, '');
    _ref = value.split('/', 2), month = _ref[0], year = _ref[1];
    if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    return {
      month: month,
      year: year
    };
  };

  $.payment.validateCardNumber = function(num) {
    var card, _ref;
    num = (num + '').replace(/\s+|-/g, '');
    if (!/^\d+$/.test(num)) {
      return false;
    }
    card = cardFromNumber(num);
    if (!card) {
      return false;
    }
    return (_ref = num.length, __indexOf.call(card.length, _ref) >= 0) && (card.luhn === false || luhnCheck(num));
  };

  $.payment.validateCardExpiry = function(month, year) {
    var currentTime, expiry, prefix, _ref;
    if (typeof month === 'object' && 'month' in month) {
      _ref = month, month = _ref.month, year = _ref.year;
    }
    if (!(month && year)) {
      return false;
    }
    month = $.trim(month);
    year = $.trim(year);
    if (!/^\d+$/.test(month)) {
      return false;
    }
    if (!/^\d+$/.test(year)) {
      return false;
    }
    if (!(parseInt(month, 10) <= 12)) {
      return false;
    }
    if (year.length === 2) {
      prefix = (new Date).getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }
    expiry = new Date(year, month);
    currentTime = new Date;
    expiry.setMonth(expiry.getMonth() - 1);
    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
  };

  $.payment.validateCardCVC = function(cvc, type) {
    var _ref, _ref1;
    cvc = $.trim(cvc);
    if (!/^\d+$/.test(cvc)) {
      return false;
    }
    if (type) {
      return _ref = cvc.length, __indexOf.call((_ref1 = cardFromType(type)) != null ? _ref1.cvcLength : void 0, _ref) >= 0;
    } else {
      return cvc.length >= 3 && cvc.length <= 4;
    }
  };

  $.payment.cardType = function(num) {
    var _ref;
    if (!num) {
      return null;
    }
    return ((_ref = cardFromNumber(num)) != null ? _ref.type : void 0) || null;
  };

  $.payment.formatCardNumber = function(num) {
    var card, groups, upperLength, _ref;
    card = cardFromNumber(num);
    if (!card) {
      return num;
    }
    upperLength = card.length[card.length.length - 1];
    num = num.replace(/\D/g, '');
    num = num.slice(0, +upperLength + 1 || 9e9);
    if (card.format.global) {
      return (_ref = num.match(card.format)) != null ? _ref.join(' ') : void 0;
    } else {
      groups = card.format.exec(num);
      if (groups != null) {
        groups.shift();
      }
      return groups != null ? groups.join(' ') : void 0;
    }
  };

}

var DonationsFormModel, html,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

html = "<div class=\"cleanslate donations-callback-flash\">\n  Success! You'll receive a notification for your payment. \n</div>\n\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<form class=\"cleanslate donation-form\" id=\"donation-form\" autocomplete=\"on\">\n  <div class=\"donation-loading-overlay\"></div>\n  <input type=\"hidden\" name=\"organization_slug\" data-bind=\"value: org\">\n  <input type=\"hidden\" name=\"customer.country\" data-bind=\"value: countryCode\">\n  <input type=\"hidden\" name=\"customer.charges_attributes[0].currency\" data-bind=\"value: selectedCurrency\">\n  <div class=\"donation-header\">\n    <div class=\"donation-header-main-message\">\n      I'M DONATING\n    </div>\n    <div class=\"donation-subheader-amount\">\n      <span class='donation-currency' data-bind=\"html: currencySymbol\">$</span><span class='donation-header-amt' data-bind=\"text: displayAmount()\">0</span>\n    </div>\n  </div>\n  <div class=\"donation-progress-banner\">\n    <div class=\"donation-progress-banner-container\">\n      <span class=\"donation-progress-header\" id=\"dnt-progress-amount\" data-bind=\"css: { 'dph-active' : visibleInputSet() >= 0}, click: function() { setInputSet(0); }\">\n        Amount\n      </span>\n      <span class=\"donation-progress-arrow\"></span>\n      <span class=\"donation-progress-header\" id=\"dnt-progress-myinfo\" data-bind=\"css: { 'dph-active' : visibleInputSet() >= 1}, click: function() { setInputSet(1); }\">\n        My Info\n      </span>\n      <span class=\"donation-progress-arrow\"></span>\n      <span class=\"donation-progress-header\" id=\"dnt-progress-payment\" data-bind=\"css: { 'dph-active' : visibleInputSet() >= 2}, click: function() { setInputSet(2); }\">\n        Payment\n      </span>\n    </div>\n  </div>\n  <div class=\"donation-input-set\" id=\"input-set-first\" data-bind=\"visible: visibleInputSet() === 0\">\n    <div class=\"donations-currency-select-row\" data-bind=\"visible: currenciesEnabled()\">\n      Currency: \n      <select class=\"donations-currency-select\" data-bind=\"options: currenciesArray, value: selectedCurrency\"></select>\n    </div>\n    <span class=\"donation-field-label\">\n      <span class=\"donation-error-label\" id=\"d-error-label-first\" data-bind=\"validationMessage: displayAmount\"></span>\n    </span>\n    <div class=\"donation-button-set\" data-bind=\"foreach: amounts\">\n      <div class=\"donation-btn donation-btn-sm\" data-bind=\"css: { 'donation-btn-active' : $parent.selectedBtn() === $index() }, click: function() { $parent.setActiveAmount($index()); }\">\n        <span class='donation-currency' data-bind=\"html: $parent.currencySymbol\">$</span><span class='donation-amt' data-bind=\"text: $data\"></span>\n      </div>\n      <!-- ko if: $index() === ($parent.amountsLength() - 1) -->\n        <input class=\"donation-btn donation-btn-lg\" data-bind=\"value: $parent.inputtedAmount, event: { change: $parent.clearSelectedButton } \" type=\"text\" placeholder=\"Other amount\">\n      <!-- /ko -->\n    </div>\n    <div class=\"donation-next-btn\" id=\"donation-first-next-btn\" data-bind=\"click: function()\n        { \n          if(inputSet1.isValid()) { incrementInputSet(); } \n          else { inputSet1.errors.showAllMessages();}\n        }\">\n      <div class=\"donation-next-btn-header\">\n        NEXT\n      </div>\n    </div>\n  </div>\n  \n  <div class=\"donation-input-set\" data-bind=\"visible: visibleInputSet() === 1\">\n    <div class=\"donation-input-row\">\n      <span class=\"donation-field-label\">\n        First Name*\n        <span class=\"donation-error-label\" data-bind=\"validationMessage: firstName\">Can't be blank</span>\n      </span>\n      \n      <input type=\"text\" class=\"donation-text-field\" autocompletetype=\"given-name\" name=\"customer.first_name\" data-bind=\"value: firstName\">\n    </div>\n    <div class=\"donation-input-row\">      \n      <span class=\"donation-field-label\">\n        Last Name*\n        <span class=\"donation-error-label\" data-bind=\"validationMessage: lastName\">Can't be blank</span>\n      </span>\n      \n      <input type=\"text\" class=\"donation-text-field\" autocompletetype=\"family-name\" name=\"customer.last_name\" data-bind=\"value: lastName\">\n    </div>\n    <div class=\"donation-input-row\"> \n      <span class=\"donation-field-label\">\n        Email*\n        <span class=\"donation-error-label\" data-bind=\"validationMessage: email\">Invalid email format</span>\n      </span>\n      \n      <input type=\"email\" class=\"donation-text-field\" autocompletetype=\"email\" name=\"customer.email\" data-bind=\"value: email\">\n    </div>\n    <div class=\"donation-next-btn\" id=\"donation-second-next-btn\" data-bind=\"click: function()\n        { \n          if(inputSet2.isValid()) { incrementInputSet(); } \n          else { inputSet2.errors.showAllMessages();}\n        }\">\n      <div class=\"donation-next-btn-header\">\n        NEXT\n      </div>\n    </div>\n  </div>\n  \n  <div class=\"donation-input-set\" data-bind=\"visible: visibleInputSet() === 2\">\n    <div class=\"donation-input-row\">\n      <span class=\"donation-field-label\">\n        Card Number*\n        <span class=\"donation-error-label\" data-bind=\"validationMessage: cardNumber\" data-bind=\"validationMessage: cardDate\">Invalid number</span>\n      </span>\n      <input name=\"cc-num\" id=\"cc-num-input\" type=\"cc-num\" class=\"donation-text-field\" autocompletetype=\"cc-number\" data-stripe=\"number\" data-bind=\"value: cardNumber, event: {keydown: calcCardType}, style: { backgroundImage: ccBackground() } \">\n    </div>\n    <div class=\"donation-input-row\"> \n      <span class=\"donation-field-label\">\n        Expiration*\n        <span class=\"donation-error-label\" data-bind=\"validationMessage: cardDate\">Invalid date</span>\n      </span>\n      <select name=\"month\" class=\"donation-select\" type=\"month\" data-stripe=\"exp-month\" data-bind=\"value: cardMonth, options: ccMonths\">\n      </select>\n      <select name=\"year\" class=\"donation-select\" type=\"year\" data-stripe=\"exp-year\" data-bind=\"value: cardYear, options: ccYears\">\n      </select>\n    </div>\n    <div class=\"donation-input-row\"> \n      <span class=\"donation-field-label\">\n        CVV/CVC* <a class=\"what-is-cvv\" title=\"For MasterCard, Visa or Discover, it's the three digits in the signature area on the back of your card. For American Express, it's the four digits on the front of the card.\">What is this?</a>\n        <span class=\"donation-error-label\" data-bind=\"validationMessage: cvc\">Invalid CVV number</span>\n      </span>\n      <input name=\"cvc\" type=\"cvc\" class=\"donation-text-field donation-text-field-sm\" autocomplete=\"off\" data-stripe=\"cvc\" data-bind=\"value: cvc\">\n    </div>\n    <div class=\"donation-payment-errors\" data-bind=\"visible: false\">\n      Something went wrong.\n    </div>\n    <button type=\"submit\" class=\"donation-submit\" data-bind=\"click: function()\n        { \n          if(inputSet3.isValid()) { submitForm(); } \n          else { inputSet3.errors.showAllMessages();}\n        }\">\n      <div class=\"donation-submit-header\">\n        SUBMIT\n      </div>\n    </div>\n  </div>\n</form>";

DonationsFormModel = (function() {
  function DonationsFormModel(jQuery, opts) {
    var config, initializeCurrency, self;
    self = this;
    $ = jQuery;;
    config = $.extend({}, {
      imgpath: 'https://d2yuwrm8xcn0u8.cloudfront.net',
      metaviewporttag: true
    }, opts, self.parseQueryString(document.URL.split("?")[1]));
    ko.validation.configure({
      insertMessages: false
    });
    ko.validation.rules['ccDate'] = {
      validator: function(val, otherVal) {
        return $.payment.validateCardExpiry(val.month, val.year);
      },
      message: 'Invalid date'
    };
    ko.validation.rules['ccNum'] = {
      validator: function(val, otherVal) {
        return $.payment.validateCardNumber(val);
      },
      message: 'Invalid credit card number'
    };
    ko.validation.rules['cvc'] = {
      validator: function(val, otherVal) {
        return $.payment.validateCardCVC(val);
      },
      message: 'Invalid CVC number'
    };
    ko.validation.registerExtenders();
    self.org = ko.observable(config['org']);
    self.countryCode = ko.observable("US");
    self.imgPath = ko.observable(config['imgpath']);
    self.initializeIcons(self.imgPath());
    self.seedAmount = config['seedamount'] || 100;
    self.seedValues = config['seedvalues'] != null ? config['seedvalues'].split(",") : [15, 35, 50, 100, 250, 500, 1000];
    self.currencies = {
      'US': 'USD',
      'GB': 'GBP',
      'AU': 'AUD',
      'CA': 'CAD',
      'SE': 'SEK',
      'NO': 'NOK',
      'DK': 'DKK',
      'NZ': 'NZD'
    };
    self.currenciesArray = ko.observableArray(['USD', 'GBP', 'CAD', 'AUD', 'EUR', 'NZD', 'SEK', 'NOK', 'DKK']);
    self.currenciesEnabled = ko.observable(config['currencyconversion'] !== "none");
    self.seededCurrency = config['seedcurrency'] || 'USD';
    self.formCurrency = config['formcurrency'] || self.seededCurrency;
    initializeCurrency = function() {
      var _ref;
      if ((_ref = config['currencyconversion']) !== "none" && _ref !== "choose") {
        return self.currencies[config['country']];
      } else {
        return self.formCurrency;
      }
    };
    self.selectedCurrency = ko.observable(initializeCurrency());
    self.currencySymbol = ko.computed(function() {
      var symbols;
      symbols = {
        'USD': '$',
        'GBP': '&pound;',
        'EUR': '&euro;',
        'NZD': 'NZ$',
        'AUD': 'AU$',
        'CAD': 'C$'
      };
      return symbols[self.selectedCurrency()] || self.selectedCurrency();
    }, this);
    self.selectedBtn = ko.observable(-1);
    self.selectedAmount = ko.observable("0");
    self.inputtedAmount = ko.observable(null);
    self.displayAmount = ko.computed(function() {
      return self.inputtedAmount() || self.selectedAmount();
    }, this).extend({
      required: {
        message: "Please select an amount"
      },
      min: 1,
      digit: true
    });
    self.normalizedAmount = ko.computed(function() {
      var zeroDecimalCurrencies, _ref;
      zeroDecimalCurrencies = ['BIF', 'CLP', 'JPY', 'KRW', 'PYG', 'VUV', 'XOF', 'CLP', 'GNF', 'KMF', 'MGA', 'RWF', 'XAF', 'XPF'];
      if (_ref = self.selectedCurrency(), __indexOf.call(zeroDecimalCurrencies, _ref) >= 0) {
        return self.displayAmount();
      } else {
        return self.displayAmount() + "00";
      }
    }, this);
    self.setActiveAmount = function(index, amount) {
      if (index > -1) {
        self.inputtedAmount(null);
        self.selectedAmount(self.amounts()[index]);
        return self.selectedBtn(index);
      }
    };
    self.clearSelectedButton = function() {
      self.selectedAmount(0);
      return self.selectedBtn(-1);
    };
    self.amounts = ko.computed(function() {
      var arr, baseAmount, conversionRateFromCurrency, conversionRateToCurrency, count, entry, _i, _len, _ref;
      arr = [];
      _ref = self.seedValues;
      for (count = _i = 0, _len = _ref.length; _i < _len; count = ++_i) {
        entry = _ref[count];
        baseAmount = parseInt(entry) / 100.0 * parseInt(self.seedAmount);
        if (count < 7) {
          if (self.currenciesEnabled()) {
            conversionRateToCurrency = config[self.selectedCurrency()] || 1;
            conversionRateFromCurrency = config[self.seededCurrency] || 1;
            arr.push(self.round(baseAmount * conversionRateToCurrency / conversionRateFromCurrency));
          } else {
            arr.push(self.round(baseAmount));
          }
        }
      }
      return arr;
    }, this);
    self.amountsLength = ko.computed(function() {
      return self.amounts().length;
    }, this);
    self.visibleInputSet = ko.observable(0);
    self.incrementInputSet = function() {
      return self.visibleInputSet(self.visibleInputSet() + 1);
    };
    self.setInputSet = function(index) {
      return self.visibleInputSet(index);
    };
    self.firstName = ko.observable().extend({
      required: {
        message: "Can't be blank"
      }
    });
    self.lastName = ko.observable().extend({
      required: {
        message: "Can't be blank"
      }
    });
    self.email = ko.observable().extend({
      required: {
        message: "Can't be blank"
      },
      email: {
        message: "Invalid email"
      }
    });
    self.cardNumber = ko.observable().extend({
      required: {
        message: "Can't be blank"
      },
      ccNum: true
    });
    self.cardMonth = ko.observable();
    self.ccMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    self.cardYear = ko.observable("" + (new Date().getFullYear() + 1));
    self.ccYears = (function() {
      var output, year, yr, _i, _ref;
      output = [];
      year = new Date().getFullYear();
      for (yr = _i = year, _ref = year + 19; year <= _ref ? _i <= _ref : _i >= _ref; yr = year <= _ref ? ++_i : --_i) {
        output.push("" + yr);
      }
      return output;
    })();
    self.cardDate = ko.computed(function() {
      return {
        month: self.cardMonth(),
        year: self.cardYear()
      };
    }, this).extend({
      ccDate: true,
      observable: true
    });
    self.cvc = ko.observable().extend({
      required: {
        message: "Can't be blank"
      },
      digit: true,
      cvc: true
    });
    $('.donation-text-field[type="cc-num"]').payment('formatCardNumber');
    $('.donation-text-field[type="cvc"]').payment('formatCardCVC');
    self.ccType = ko.observable();
    self.calcCardType = function() {
      self.ccType($.payment.cardType($('#cc-num-input').val()));
      return true;
    };
    self.ccBackground = ko.computed(function() {
      var _ref;
      if ((_ref = self.ccType()) === 'amex' || _ref === 'mastercard' || _ref === 'visa' || _ref === 'discover' || _ref === 'dinersclub') {
        return "url(" + (self.imgPath()) + "/icon-cc-" + (self.ccType()) + ".png)";
      } else {
        return "url(" + (self.imgPath()) + "/icon-cc-none.png)";
      }
    }, this);
    self.inputSet1 = ko.validatedObservable({
      amount: self.displayAmount
    });
    self.inputSet2 = ko.validatedObservable({
      firstName: self.firstName,
      lastName: self.lastName,
      email: self.email
    });
    self.inputSet3 = ko.validatedObservable({
      cardNumber: self.cardNumber,
      cardDate: self.cardDate,
      cvc: self.cvc
    });
    self.connectToServer(config, self);
  }

  DonationsFormModel.prototype.parseQueryString = function(q) {
    var hash, i, vars;
    hash = {};
    if (q !== undefined && q !== "") {
      q = q.split("&");
      i = 0;
      while (i < q.length) {
        vars = q[i].split("=");
        hash[vars[0]] = vars[1];
        i++;
      }
    }
    return hash;
  };

  DonationsFormModel.prototype.initializeIcons = function(path) {
    var icons, k, v, _results;
    icons = {
      '#dnt-progress-amount': 'icon-amount.png',
      '#dnt-progress-myinfo': 'icon-myinfo.png',
      '#dnt-progress-payment': 'icon-payment.png',
      '.donation-progress-arrow': 'icon-arrow.png',
      '.donation-text-field[type="cc-num"]': 'icon-cc-none.png',
      '.donation-select': 'icon-dropdown-arrows.png',
      '.donation-loading-overlay': '712.GIF'
    };
    _results = [];
    for (k in icons) {
      v = icons[k];
      _results.push($(k).css('background-image', "url('" + path + "/" + v + "')"));
    }
    return _results;
  };

  DonationsFormModel.prototype.round = function(number) {
    var temp;
    temp = Math.round(parseFloat(number.toPrecision(2)));
    if (temp === 0) {
      return 1;
    } else {
      return temp;
    }
  };

  DonationsFormModel.prototype.connectToServer = function(opts, self) {
    var config, stripeResponseHandler, subscribeToDonationChannel;
    config = $.extend({}, {
      stripepublickey: "pk_test_LGrYxpfzI89s9yxXJfKcBB0R",
      pusherpublickey: '331ca3447b91e264a76f',
      pathtoserver: "http://localhost:3000"
    }, opts);
    Stripe.setPublishableKey(config['stripepublickey']);
    subscribeToDonationChannel = function(channelToken) {
      var channel, pusher;
      pusher = new Pusher(config['pusherpublickey']);
      channel = pusher.subscribe(channelToken);
      return channel.bind("charge_completed", function(data) {
        $('.donation-loading-overlay').hide();
        pusher.disconnect();
        if (data.status === "success") {
          $("#donation-script").trigger("donations:success");
          if (config['redirectto'] != null) {
            window.location.replace(config['redirectto']);
          }
          $("#donation-form").hide();
          return $(".donations-callback-flash").show(0).delay(8000).hide(0);
        } else {
          return $(".donation-payment-errors").text(data.message || "Something went wrong.").show();
        }
      });
    };
    stripeResponseHandler = function(status, response) {
      var $form, charge, customer, formPost, req;
      $form = $("#donation-form");
      if (response.error) {
        gaDonations('send', 'event', 'advance-button', 'click#with-errors', 'submit', 1);
        $form.find(".donation-payment-errors").text(response.error.message);
        $form.find("button").prop("disabled", false);
        return $('.donation-loading-overlay').hide();
      } else {
        charge = {};
        charge.amount = self.normalizedAmount();
        charge.currency = self.selectedCurrency();
        customer = {};
        customer.first_name = self.firstName();
        customer.last_name = self.lastName();
        customer.email = self.email();
        customer.country = self.countryCode();
        customer.charges_attributes = [charge];
        formPost = {};
        formPost.customer = customer;
        formPost.card_token = response.id;
        formPost.config = config;
        formPost.organization_slug = self.org();
        req = $.ajax({
          url: "" + config['pathtoserver'] + "/charges",
          type: "post",
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(formPost)
        });
        req.done(function(response, textStatus, jqXHR) {
          gaDonations('send', 'event', 'advance-button', 'click#success', 'submit', 1);
          return subscribeToDonationChannel(response.pusher_channel_token);
        });
        req.fail(function(response, textStatus, errorThrown) {
          gaDonations('send', 'event', 'advance-button', 'click#with-errors', 'submit', 1);
          $form.find(".donation-payment-errors").text(response.responseText || "Something went wrong.").show();
          $('.donation-loading-overlay').hide();
          return $form.find("button").prop("disabled", false);
        });
        return false;
      }
    };
    return self.submitForm = function() {
      var $form;
      gaDonations('send', 'event', 'advance-button', 'click#submit', 'submit', 1);
      $form = $("#donation-form");
      $('.donation-loading-overlay').show();
      $form.find("button").prop("disabled", true);
      Stripe.createToken($form, stripeResponseHandler);
      return false;
    };
  };

  return DonationsFormModel;

})();
