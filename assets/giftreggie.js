var CryptoJS=CryptoJS||function(h,i){var e={},f=e.lib={},l=f.Base=function(){function a(){}return{extend:function(j){a.prototype=this;var d=new a;j&&d.mixIn(j);d.$super=this;return d},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var d in a)a.hasOwnProperty(d)&&(this[d]=a[d]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),k=f.WordArray=l.extend({init:function(a,j){a=this.words=a||[];this.sigBytes=j!=i?j:4*a.length},toString:function(a){return(a||m).stringify(this)},concat:function(a){var j=this.words,d=a.words,c=this.sigBytes,a=a.sigBytes;this.clamp();if(c%4)for(var b=0;b<a;b++)j[c+b>>>2]|=(d[b>>>2]>>>24-8*(b%4)&255)<<24-8*((c+b)%4);else if(65535<d.length)for(b=0;b<a;b+=4)j[c+b>>>2]=d[b>>>2];else j.push.apply(j,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=h.ceil(b/4)},clone:function(){var a=l.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],d=0;d<a;d+=4)b.push(4294967296*h.random()|0);return k.create(b,a)}}),o=e.enc={},m=o.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,d=[],c=0;c<a;c++){var e=b[c>>>2]>>>24-8*(c%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c+=2)d[c>>>3]|=parseInt(a.substr(c,2),16)<<24-4*(c%8);return k.create(d,b/2)}},q=o.Latin1={stringify:function(a){for(var b=a.words,a=a.sigBytes,d=[],c=0;c<a;c++)d.push(String.fromCharCode(b[c>>>2]>>>24-8*(c%4)&255));return d.join("")},parse:function(a){for(var b=a.length,d=[],c=0;c<b;c++)d[c>>>2]|=(a.charCodeAt(c)&255)<<24-8*(c%4);return k.create(d,b)}},r=o.Utf8={stringify:function(a){try{return decodeURIComponent(escape(q.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return q.parse(unescape(encodeURIComponent(a)))}},b=f.BufferedBlockAlgorithm=l.extend({reset:function(){this._data=k.create();this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,d=b.words,c=b.sigBytes,e=this.blockSize,g=c/(4*e),g=a?h.ceil(g):h.max((g|0)-this._minBufferSize,0),a=g*e,c=h.min(4*a,c);if(a){for(var f=0;f<a;f+=e)this._doProcessBlock(d,f);f=d.splice(0,a);b.sigBytes-=c}return k.create(f,c)},clone:function(){var a=l.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});f.Hasher=b.extend({init:function(){this.reset()},reset:function(){b.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=b.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,d){return a.create(d).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return g.HMAC.create(a,d).finalize(b)}}});var g=e.algo={};return e}(Math);(function(h){var i=CryptoJS,e=i.lib,f=e.WordArray,e=e.Hasher,l=i.algo,k=[],o=[];(function(){function e(a){for(var b=h.sqrt(a),d=2;d<=b;d++)if(!(a%d))return!1;return!0}function f(a){return 4294967296*(a-(a|0))|0}for(var b=2,g=0;64>g;)e(b)&&(8>g&&(k[g]=f(h.pow(b,0.5))),o[g]=f(h.pow(b,1/3)),g++),b++})();var m=[],l=l.SHA256=e.extend({_doReset:function(){this._hash=f.create(k.slice(0))},_doProcessBlock:function(e,f){for(var b=this._hash.words,g=b[0],a=b[1],j=b[2],d=b[3],c=b[4],h=b[5],l=b[6],k=b[7],n=0;64>n;n++){if(16>n)m[n]=e[f+n]|0;else{var i=m[n-15],p=m[n-2];m[n]=((i<<25|i>>>7)^(i<<14|i>>>18)^i>>>3)+m[n-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+m[n-16]}i=k+((c<<26|c>>>6)^(c<<21|c>>>11)^(c<<7|c>>>25))+(c&h^~c&l)+o[n]+m[n];p=((g<<30|g>>>2)^(g<<19|g>>>13)^(g<<10|g>>>22))+(g&a^g&j^a&j);k=l;l=h;h=c;c=d+i|0;d=j;j=a;a=g;g=i+p|0}b[0]=b[0]+g|0;b[1]=b[1]+a|0;b[2]=b[2]+j|0;b[3]=b[3]+d|0;b[4]=b[4]+c|0;b[5]=b[5]+h|0;b[6]=b[6]+l|0;b[7]=b[7]+k|0},_doFinalize:function(){var e=this._data,f=e.words,b=8*this._nDataBytes,g=8*e.sigBytes;f[g>>>5]|=128<<24-g%32;f[(g+64>>>9<<4)+15]=b;e.sigBytes=4*f.length;this._process()}});i.SHA256=e._createHelper(l);i.HmacSHA256=e._createHmacHelper(l)})(Math);(function(){var h=CryptoJS,i=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(e,f){e=this._hasher=e.create();"string"==typeof f&&(f=i.parse(f));var h=e.blockSize,k=4*h;f.sigBytes>k&&(f=e.finalize(f));for(var o=this._oKey=f.clone(),m=this._iKey=f.clone(),q=o.words,r=m.words,b=0;b<h;b++)q[b]^=1549556828,r[b]^=909522486;o.sigBytes=m.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var f=this._hasher,e=f.finalize(e);f.reset();return f.finalize(this._oKey.clone().concat(e))}})})();function mixinESAUser(frontendMixin,serverLocation,cookieName,sessionClass){frontendMixin.serverLocation=serverLocation;frontendMixin.encodeUrlVars=function(hash){var query="";var keys=Object.keys(hash).sort();for(var keyIdx=0;keyIdx<keys.length;++keyIdx){var key=keys[keyIdx];if(typeof hash[key]=="object"){for(var i in hash[key])
query+=(query==""?"":"&")+key+"="+encodeURIComponent(hash[key][i]);}
else
query+=(query==""?"":"&")+key+"="+encodeURIComponent(hash[key]);}
return query;};frontendMixin.DeferredObject=function(){var deferred=this;this.state=null;this.payload=null;this._doneHandlers=[];this._failHandlers=[];this._alwaysHandlers=[];this.resolve=function(){deferred.payload=arguments;deferred.state=true;while(deferred._doneHandlers.length>0){var handler=deferred._doneHandlers.shift();handler.apply(deferred,deferred.payload);}
return deferred;};this.reject=function(){deferred.payload=arguments;deferred.state=false;while(deferred._failHandlers.length>0){var handler=deferred._failHandlers.shift();handler.apply(deferred,deferred.payload);}
return deferred;};this.done=function(handler){if(deferred.state===true)
handler.apply(deferred,deferred.payload);else
deferred._doneHandlers.push(handler);return deferred;};this.then=function(handler){return this.done(handler);};this.fail=function(handler){if(this.state===false)
handler.apply(deferred,deferred.payload);else
deferred._failHandlers.push(handler);return deferred;};this.always=function(handler){if(this.state!=null){handler.apply(deferred,deferred.payload);}else{deferred._doneHandlers.push(handler);deferred._failHandlers.push(handler);}
return deferred;};};frontendMixin.Deferred=function(){return new frontendMixin.DeferredObject();};frontendMixin.ajax=function(url,options,deferred){var session=this;if(typeof(url)=="object"&&!options){options=url;url=options["url"];}
else if(!options)
options={};if(!options['dataType'])
options['dataType']='json';if(!options['contentType'])
options['contentType']='text/plain';if(options['data']&&options['contentType']=='json'&&typeof(options.data)=="object"&&options['type']&&options['type']!="GET")
options['data']=JSON.stringify(options.data);if(!options['headers'])
options['headers']={}
if(!options['headers']['Content-Type']&&options['contentType']){if(options['contentType']=="json"){options['headers']['Content-Type']="application/json; charset=UTF-8";}else{options['headers']['Content-Type']=options['contentType'];}}
if(!deferred)
deferred=frontendMixin.Deferred();var xhttp=new XMLHttpRequest();var internalDeferred=frontendMixin.Deferred();xhttp.onreadystatechange=function(){if(this.readyState==4){if(this.status>=200&&this.status<=299){var sessionId=xhttp.getResponseHeader("X-Session-Id");if(sessionId)
session.sessionId=sessionId;if(options['dataType']=="json"){var data=null;try{data=JSON.parse(this.responseText)}
catch(e){internalDeferred.reject(this,""+e,e);}
internalDeferred.resolve(data);}
else
internalDeferred.resolve(this.responseText);}else{internalDeferred.reject(this,this.responseText,null);}}};if(!url&&options['url'])
url=options['url'];if((options['type']||"GET")=="GET"&&options['data']){if(url.indexOf("?")==url.length-1)
url+=frontendMixin.encodeUrlVars(options['data']);else if(url.indexOf("?")!=-1)
url+="&"+frontendMixin.encodeUrlVars(options['data']);else
url+="?"+frontendMixin.encodeUrlVars(options['data']);}
xhttp.open(options['type']||"GET",url,options['async']==null?true:options['async']);var headers=options['headers'];if(session._sessionId)
headers['X-Session-Id']=session._sessionId;for(var i in headers){if(headers.hasOwnProperty(i))
xhttp.setRequestHeader(i,options['headers'][i]);}
internalDeferred.done(function(){deferred.resolve.apply(this,arguments);}).fail(function(xhr){var firstHalf=url.split("?")[0];if(!/session$/.test(firstHalf)&&xhr.status==403&&session.retries==0){session.retries++;frontendMixin.initSession(session.customerEmail,session.sharedSecret).done(function(newSession){session.sessionId=newSession.sessionId;session.ajax(url,options,deferred).done(function(data){deferred.resolve(data);}).fail(function(xhr){deferred.reject(xhr);});}).fail(function(){deferred.reject(xhr);});}else{deferred.reject(xhr);}});xhttp.send(options['data']);return deferred;}
frontendMixin.setCookie=function(c_name,value,exdays){var exdate=new Date();exdate.setDate(exdate.getDate()+exdays);var c_value=escape(value)+((exdays==null)?"":"; expires="+exdate.toUTCString());c_value+="; path=/";document.cookie=c_name+"="+c_value;};frontendMixin.getCookie=function(c_name){var c_value=document.cookie;var c_start=c_value.indexOf(" "+c_name+"=");if(c_start==-1)
c_start=c_value.indexOf(c_name+"=");if(c_start==-1)
c_value=null;else{c_start=c_value.indexOf("=",c_start)+1;var c_end=c_value.indexOf(";",c_start);if(c_end==-1)
c_end=c_value.length;c_value=unescape(c_value.substring(c_start,c_end));}
return c_value;}
frontendMixin.getServerTime=function(){return Math.floor(new Date().getTime()/1000);};frontendMixin.signOAuth=function(ajaxOptions,shopifyId,sharedSecret){var method="GET";if(ajaxOptions['type'])
method=ajaxOptions['type'];var urlBase=ajaxOptions.url;var userKey="oauth_consumer_key="+shopifyId;var nonce="oauth_nonce="+Math.floor(Math.random()*1000000000);var signatureMethod="oauth_signature_method=HMAC-SHA256";var timestamp="oauth_timestamp="+frontendMixin.getServerTime();var version="oauth_version=1.0";var signature=method.toUpperCase()+"&"+encodeURIComponent(urlBase)+"&"+encodeURIComponent(userKey+nonce+signatureMethod+timestamp+version);var calculatedSignature=CryptoJS.HmacSHA256(signature,sharedSecret);if(ajaxOptions.headers==null)
ajaxOptions.headers={};ajaxOptions.headers['Authorization']=userKey;ajaxOptions.headers['Authorization']+=", "+nonce;ajaxOptions.headers['Authorization']+=", "+timestamp;ajaxOptions.headers['Authorization']+=", "+signatureMethod;ajaxOptions.headers['Authorization']+=", "+version;ajaxOptions.headers['Authorization']+=", oauth_signature="+calculatedSignature;return ajaxOptions;}
frontendMixin.deleteCookie=function(c_name){document.cookie=c_name+'=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';}
frontendMixin.log=function(statement){alert(statement);console.log(statement);}
frontendMixin.initSession=function(customerEmail,customerSharedSecret){if(!customerEmail||!customerSharedSecret){frontendMixin.log("Requires both email, and customer shared secret!");return null;}
var sessionRequest={url:this.serverLocation+"/session",dataType:'json'};frontendMixin.signOAuth(sessionRequest,customerEmail,customerSharedSecret);var deferred=frontendMixin.Deferred();frontendMixin.ajax(sessionRequest.url,sessionRequest).done(function(data){frontendMixin.setCookie(cookieName,data.sid);deferred.resolve(new sessionClass(customerEmail,data.sid));}).fail(function(){deferred.reject();});return deferred;}
frontendMixin.reinitSession=function(customerEmail,sessionId,sharedSecret){return new sessionClass(customerEmail,sessionId,sharedSecret);}
frontendMixin.registerUser=function(customerId){return this.ajax(this.serverLocation+'/shared_secret/'+customerId,{dataType:'html'});}
frontendMixin.getSession=function(customerId,customerEmail,customerSharedSecret){var deferred=frontendMixin.Deferred();var savedSession=this.getCookie(cookieName);if(savedSession&&savedSession!=null&&savedSession!=''){var sS=this.reinitSession(customerEmail,savedSession,customerSharedSecret);deferred.resolve(sS);return deferred;}
if(customerSharedSecret)
return frontendMixin.initSession(customerEmail,customerSharedSecret);frontendMixin.registerUser(customerId).done(function(sharedSecretPage){var element=document.createElement('html');element.innerHTML=sharedSecretPage;var sharedSecret=element.querySelector("#customer-shared-secret").innerHTML;frontendMixin.initSession(customerEmail,sharedSecret).done(function(session){deferred.resolve(session);}).fail(function(){deferred.reject();});}).fail(function(){deferred.reject();});return deferred;}
frontendMixin.ESAUserSession=function(customerEmail,sessionId,sharedSecret){this.sessionId=sessionId;this.customerEmail=customerEmail;this.sharedSecret=sharedSecret;this.retries=0;this.encodeURL=function(url){return frontendMixin.serverLocation+url+"?sid="+encodeURIComponent(this.sessionId);}
this.ajax=function(url,options){url=this.encodeURL(url);return frontendMixin.ajax(url,options);}}};function GiftReggieSession(customerEmail,sessionId,sharedSecret){GiftReggie.ESAUserSession.call(this,customerEmail,sessionId,sharedSecret);this.getRegistries=function(){return this.ajax("/api/registry");};this.getRegistry=function(registryId){return this.ajax("/api/registry/"+registryId);}
this.getRegistryProducts=function(registryId,page){return this.ajax("/api/registry/"+registryId+"/product",{data:{'page':page}});}
this.setRegistryProducts=function(registryId,productId,variantId,quantity,properties){if(quantity==null)
quantity=1;return this.ajax("/api/registry/"+registryId+"/product",{type:'PUT',data:{products:[{'id':productId,'variants':[{'id':variantId,'properties':properties,'quantity':quantity}]}]},contentType:'json'});};this.addRegistryProducts=function(registryId,productId,variantId,quantity,properties){if(quantity==null)
quantity=1;return this.ajax("/api/registry/"+registryId+"/product",{type:'POST',data:{products:[{'id':productId,'variants':[{'id':variantId,'properties':properties,'quantity':quantity}]}]},contentType:'json',dataType:'html'});};this.removeRegistry=function(registryId,productId){return this.ajax("/api/registry/"+registryId+"/product/"+productId,{type:'DELETE'});}
this.shareRegistry=function(registryId,emails,subject,body){return this.ajax("/api/registry/"+registryId+"/share",{type:'POST',data:{'emails':emails,'subject':subject,'body':body},contentType:'json'});}
this.hasWishlist=null;this.getWishlist=function(){return this.ajax("/api/wishlist").done(function(){this.hasWishlist=true;});};this.searchWishlists=function(criteria){return this.ajax("/api/wishlist/search");};this.openWishlist=function(){return this.ajax("/api/wishlist/open",{type:'POST'}).done(function(){this.hasWishlist=true;});};this.closeWishlist=function(){return this.ajax("/api/wishlist/close",{type:'POST'}).done(function(){this.hasWishlist=false;});};this.updateWishlist=function(updates){return this.ajax("/api/wishlist",{type:'POST',data:{"wishlist":updates},contentType:'json'});}
this.addWishlist=function(variantId){return this.ajax("/api/wishlist/add",{type:'POST',data:{"id":variantId},contentType:'json'});};this.removeWishlist=function(variantId){return this.ajax("/api/wishlist/remove",{type:'POST',data:{"id":variantId},contentType:'json'});};this.shareWishlist=function(emails,subject,body){return this.ajax("/api/wishlist/share",{type:'POST',data:{'emails':emails,'subject':subject,'body':body},contentType:'json'});}
this.updateWishlist=function(updates){return this.ajax("/api/wishlist",{type:'POST',data:{"wishlist":updates},contentType:'json'});}}
var GiftReggie=GiftReggie||{};mixinESAUser(GiftReggie,"/apps/giftregistry","giftreggie_session_cookie",GiftReggieSession);