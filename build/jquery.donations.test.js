initJQueryPayments=function(jQuery){var $,cardFromNumber,cardFromType,cards,defaultFormat,formatBackCardNumber,formatBackExpiry,formatCardNumber,formatExpiry,formatForwardExpiry,formatForwardSlash,hasTextSelected,luhnCheck,reFormatCardNumber,restrictCVC,restrictCardNumber,restrictExpiry,restrictNumeric,setCardType,__slice=[].slice,__indexOf=[].indexOf||function(item){for(var i=0,l=this.length;l>i;i++)if(i in this&&this[i]===item)return i;return-1};$=jQuery,$.payment={},$.payment.fn={},$.fn.payment=function(){var args,method;return method=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[],$.payment.fn[method].apply(this,args)},defaultFormat=/(\d{1,4})/g,cards=[{type:"maestro",pattern:/^(5018|5020|5038|6304|6759|676[1-3])/,format:defaultFormat,length:[12,13,14,15,16,17,18,19],cvcLength:[3],luhn:!0},{type:"dinersclub",pattern:/^(36|38|30[0-5])/,format:defaultFormat,length:[14],cvcLength:[3],luhn:!0},{type:"laser",pattern:/^(6706|6771|6709)/,format:defaultFormat,length:[16,17,18,19],cvcLength:[3],luhn:!0},{type:"jcb",pattern:/^35/,format:defaultFormat,length:[16],cvcLength:[3],luhn:!0},{type:"unionpay",pattern:/^62/,format:defaultFormat,length:[16,17,18,19],cvcLength:[3],luhn:!1},{type:"discover",pattern:/^(6011|65|64[4-9]|622)/,format:defaultFormat,length:[16],cvcLength:[3],luhn:!0},{type:"mastercard",pattern:/^5[1-5]/,format:defaultFormat,length:[16],cvcLength:[3],luhn:!0},{type:"amex",pattern:/^3[47]/,format:/(\d{1,4})(\d{1,6})?(\d{1,5})?/,length:[15],cvcLength:[3,4],luhn:!0},{type:"visa",pattern:/^4/,format:defaultFormat,length:[13,14,15,16],cvcLength:[3],luhn:!0}],cardFromNumber=function(num){var card,_i,_len;for(num=(num+"").replace(/\D/g,""),_i=0,_len=cards.length;_len>_i;_i++)if(card=cards[_i],card.pattern.test(num))return card},cardFromType=function(type){var card,_i,_len;for(_i=0,_len=cards.length;_len>_i;_i++)if(card=cards[_i],card.type===type)return card},luhnCheck=function(num){var digit,digits,odd,sum,_i,_len;for(odd=!0,sum=0,digits=(num+"").split("").reverse(),_i=0,_len=digits.length;_len>_i;_i++)digit=digits[_i],digit=parseInt(digit,10),(odd=!odd)&&(digit*=2),digit>9&&(digit-=9),sum+=digit;return sum%10===0},hasTextSelected=function($target){var _ref;return null!=$target.prop("selectionStart")&&$target.prop("selectionStart")!==$target.prop("selectionEnd")?!0:("undefined"!=typeof document&&null!==document?null!=(_ref=document.selection)?"function"==typeof _ref.createRange?_ref.createRange().text:void 0:void 0:void 0)?!0:!1},reFormatCardNumber=function(e){return setTimeout(function(){var $target,value;return $target=$(e.currentTarget),value=$target.val(),value=$.payment.formatCardNumber(value),$target.val(value)})},formatCardNumber=function(e){var $target,card,digit,length,re,upperLength,value;return digit=String.fromCharCode(e.which),!/^\d+$/.test(digit)||($target=$(e.currentTarget),value=$target.val(),card=cardFromNumber(value+digit),length=(value.replace(/\D/g,"")+digit).length,upperLength=16,card&&(upperLength=card.length[card.length.length-1]),length>=upperLength||null!=$target.prop("selectionStart")&&$target.prop("selectionStart")!==value.length)?void 0:(re=card&&"amex"===card.type?/^(\d{4}|\d{4}\s\d{6})$/:/(?:^|\s)(\d{4})$/,re.test(value)?(e.preventDefault(),$target.val(value+" "+digit)):re.test(value+digit)?(e.preventDefault(),$target.val(value+digit+" ")):void 0)},formatBackCardNumber=function(e){var $target,value;return $target=$(e.currentTarget),value=$target.val(),e.meta||8!==e.which||null!=$target.prop("selectionStart")&&$target.prop("selectionStart")!==value.length?void 0:/\d\s$/.test(value)?(e.preventDefault(),$target.val(value.replace(/\d\s$/,""))):/\s\d?$/.test(value)?(e.preventDefault(),$target.val(value.replace(/\s\d?$/,""))):void 0},formatExpiry=function(e){var $target,digit,val;return digit=String.fromCharCode(e.which),/^\d+$/.test(digit)?($target=$(e.currentTarget),val=$target.val()+digit,/^\d$/.test(val)&&"0"!==val&&"1"!==val?(e.preventDefault(),$target.val("0"+val+" / ")):/^\d\d$/.test(val)?(e.preventDefault(),$target.val(""+val+" / ")):void 0):void 0},formatForwardExpiry=function(e){var $target,digit,val;return digit=String.fromCharCode(e.which),/^\d+$/.test(digit)?($target=$(e.currentTarget),val=$target.val(),/^\d\d$/.test(val)?$target.val(""+val+" / "):void 0):void 0},formatForwardSlash=function(e){var $target,slash,val;return slash=String.fromCharCode(e.which),"/"===slash?($target=$(e.currentTarget),val=$target.val(),/^\d$/.test(val)&&"0"!==val?$target.val("0"+val+" / "):void 0):void 0},formatBackExpiry=function(e){var $target,value;if(!e.meta&&($target=$(e.currentTarget),value=$target.val(),8===e.which&&(null==$target.prop("selectionStart")||$target.prop("selectionStart")===value.length)))return/\d(\s|\/)+$/.test(value)?(e.preventDefault(),$target.val(value.replace(/\d(\s|\/)*$/,""))):/\s\/\s?\d?$/.test(value)?(e.preventDefault(),$target.val(value.replace(/\s\/\s?\d?$/,""))):void 0},restrictNumeric=function(e){var input;return e.metaKey||e.ctrlKey?!0:32===e.which?!1:0===e.which?!0:e.which<33?!0:(input=String.fromCharCode(e.which),!!/[\d\s]/.test(input))},restrictCardNumber=function(e){var $target,card,digit,value;return $target=$(e.currentTarget),digit=String.fromCharCode(e.which),/^\d+$/.test(digit)&&!hasTextSelected($target)?(value=($target.val()+digit).replace(/\D/g,""),card=cardFromNumber(value),card?value.length<=card.length[card.length.length-1]:value.length<=16):void 0},restrictExpiry=function(e){var $target,digit,value;return $target=$(e.currentTarget),digit=String.fromCharCode(e.which),/^\d+$/.test(digit)&&!hasTextSelected($target)?(value=$target.val()+digit,value=value.replace(/\D/g,""),value.length>6?!1:void 0):void 0},restrictCVC=function(e){var $target,digit,val;return $target=$(e.currentTarget),digit=String.fromCharCode(e.which),/^\d+$/.test(digit)?(val=$target.val()+digit,val.length<=4):void 0},setCardType=function(e){var $target,allTypes,card,cardType,val;return $target=$(e.currentTarget),val=$target.val(),cardType=$.payment.cardType(val)||"unknown",$target.hasClass(cardType)?void 0:(allTypes=function(){var _i,_len,_results;for(_results=[],_i=0,_len=cards.length;_len>_i;_i++)card=cards[_i],_results.push(card.type);return _results}(),$target.removeClass("unknown"),$target.removeClass(allTypes.join(" ")),$target.addClass(cardType),$target.toggleClass("identified","unknown"!==cardType),$target.trigger("payment.cardType",cardType))},$.payment.fn.formatCardCVC=function(){return this.payment("restrictNumeric"),this.on("keypress",restrictCVC),this},$.payment.fn.formatCardExpiry=function(){return this.payment("restrictNumeric"),this.on("keypress",restrictExpiry),this.on("keypress",formatExpiry),this.on("keypress",formatForwardSlash),this.on("keypress",formatForwardExpiry),this.on("keydown",formatBackExpiry),this},$.payment.fn.formatCardNumber=function(){return this.payment("restrictNumeric"),this.on("keypress",restrictCardNumber),this.on("keypress",formatCardNumber),this.on("keydown",formatBackCardNumber),this.on("keyup",setCardType),this.on("paste",reFormatCardNumber),this},$.payment.fn.restrictNumeric=function(){return this.on("keypress",restrictNumeric),this},$.payment.fn.cardExpiryVal=function(){return $.payment.cardExpiryVal($(this).val())},$.payment.cardExpiryVal=function(value){var month,prefix,year,_ref;return value=value.replace(/\s/g,""),_ref=value.split("/",2),month=_ref[0],year=_ref[1],2===(null!=year?year.length:void 0)&&/^\d+$/.test(year)&&(prefix=(new Date).getFullYear(),prefix=prefix.toString().slice(0,2),year=prefix+year),month=parseInt(month,10),year=parseInt(year,10),{month:month,year:year}},$.payment.validateCardNumber=function(num){var card,_ref;return num=(num+"").replace(/\s+|-/g,""),/^\d+$/.test(num)?(card=cardFromNumber(num),card?(_ref=num.length,__indexOf.call(card.length,_ref)>=0&&(card.luhn===!1||luhnCheck(num))):!1):!1},$.payment.validateCardExpiry=function(month,year){var currentTime,expiry,prefix,_ref;return"object"==typeof month&&"month"in month&&(_ref=month,month=_ref.month,year=_ref.year),month&&year?(month=$.trim(month),year=$.trim(year),/^\d+$/.test(month)?/^\d+$/.test(year)?parseInt(month,10)<=12?(2===year.length&&(prefix=(new Date).getFullYear(),prefix=prefix.toString().slice(0,2),year=prefix+year),expiry=new Date(year,month),currentTime=new Date,expiry.setMonth(expiry.getMonth()-1),expiry.setMonth(expiry.getMonth()+1,1),expiry>currentTime):!1:!1:!1):!1},$.payment.validateCardCVC=function(cvc,type){var _ref,_ref1;return cvc=$.trim(cvc),/^\d+$/.test(cvc)?type?(_ref=cvc.length,__indexOf.call(null!=(_ref1=cardFromType(type))?_ref1.cvcLength:void 0,_ref)>=0):cvc.length>=3&&cvc.length<=4:!1},$.payment.cardType=function(num){var _ref;return num?(null!=(_ref=cardFromNumber(num))?_ref.type:void 0)||null:null},$.payment.formatCardNumber=function(num){var card,groups,upperLength,_ref;return(card=cardFromNumber(num))?(upperLength=card.length[card.length.length-1],num=num.replace(/\D/g,""),num=num.slice(0,+upperLength+1||9e9),card.format.global?null!=(_ref=num.match(card.format))?_ref.join(" "):void 0:(groups=card.format.exec(num),null!=groups&&groups.shift(),null!=groups?groups.join(" "):void 0)):num}},function(root,factory){"function"==typeof define&&define.amd?define(factory):root.form2js=factory()}(this,function(){"use strict";function form2js(rootNode,delimiter,skipEmpty,nodeCallback,useIdIfEmptyName){("undefined"==typeof skipEmpty||null==skipEmpty)&&(skipEmpty=!0),("undefined"==typeof delimiter||null==delimiter)&&(delimiter="."),arguments.length<5&&(useIdIfEmptyName=!1),rootNode="string"==typeof rootNode?document.getElementById(rootNode):rootNode;var currNode,formValues=[],i=0;if(rootNode.constructor==Array||"undefined"!=typeof NodeList&&rootNode.constructor==NodeList)for(;currNode=rootNode[i++];)formValues=formValues.concat(getFormValues(currNode,nodeCallback,useIdIfEmptyName));else formValues=getFormValues(rootNode,nodeCallback,useIdIfEmptyName);return processNameValues(formValues,skipEmpty,delimiter)}function processNameValues(nameValues,skipEmpty,delimiter){var i,j,k,l,value,nameParts,currResult,arrNameFull,arrName,arrIdx,namePart,name,_nameParts,result={},arrays={};for(i=0;i<nameValues.length;i++)if(value=nameValues[i].value,!skipEmpty||""!==value&&null!==value){for(name=nameValues[i].name,_nameParts=name.split(delimiter),nameParts=[],currResult=result,arrNameFull="",j=0;j<_nameParts.length;j++)if(namePart=_nameParts[j].split("]["),namePart.length>1)for(k=0;k<namePart.length;k++)if(namePart[k]=0==k?namePart[k]+"]":k==namePart.length-1?"["+namePart[k]:"["+namePart[k]+"]",arrIdx=namePart[k].match(/([a-z_]+)?\[([a-z_][a-z0-9_]+?)\]/i))for(l=1;l<arrIdx.length;l++)arrIdx[l]&&nameParts.push(arrIdx[l]);else nameParts.push(namePart[k]);else nameParts=nameParts.concat(namePart);for(j=0;j<nameParts.length;j++)namePart=nameParts[j],namePart.indexOf("[]")>-1&&j==nameParts.length-1?(arrName=namePart.substr(0,namePart.indexOf("[")),arrNameFull+=arrName,currResult[arrName]||(currResult[arrName]=[]),currResult[arrName].push(value)):namePart.indexOf("[")>-1?(arrName=namePart.substr(0,namePart.indexOf("[")),arrIdx=namePart.replace(/(^([a-z_]+)?\[)|(\]$)/gi,""),arrNameFull+="_"+arrName+"_"+arrIdx,arrays[arrNameFull]||(arrays[arrNameFull]={}),""==arrName||currResult[arrName]||(currResult[arrName]=[]),j==nameParts.length-1?""==arrName?(currResult.push(value),arrays[arrNameFull][arrIdx]=currResult[currResult.length-1]):(currResult[arrName].push(value),arrays[arrNameFull][arrIdx]=currResult[arrName][currResult[arrName].length-1]):arrays[arrNameFull][arrIdx]||(currResult[arrName].push(/^[0-9a-z_]+\[?/i.test(nameParts[j+1])?{}:[]),arrays[arrNameFull][arrIdx]=currResult[arrName][currResult[arrName].length-1]),currResult=arrays[arrNameFull][arrIdx]):(arrNameFull+=namePart,j<nameParts.length-1?(currResult[namePart]||(currResult[namePart]={}),currResult=currResult[namePart]):currResult[namePart]=value)}return result}function getFormValues(rootNode,nodeCallback,useIdIfEmptyName){var result=extractNodeValues(rootNode,nodeCallback,useIdIfEmptyName);return result.length>0?result:getSubFormValues(rootNode,nodeCallback,useIdIfEmptyName)}function getSubFormValues(rootNode,nodeCallback,useIdIfEmptyName){for(var result=[],currentNode=rootNode.firstChild;currentNode;)result=result.concat(extractNodeValues(currentNode,nodeCallback,useIdIfEmptyName)),currentNode=currentNode.nextSibling;return result}function extractNodeValues(node,nodeCallback,useIdIfEmptyName){var callbackResult,fieldValue,result,fieldName=getFieldName(node,useIdIfEmptyName);return callbackResult=nodeCallback&&nodeCallback(node),callbackResult&&callbackResult.name?result=[callbackResult]:""!=fieldName&&node.nodeName.match(/INPUT|TEXTAREA/i)?(fieldValue=getFieldValue(node),result=[{name:fieldName,value:fieldValue}]):""!=fieldName&&node.nodeName.match(/SELECT/i)?(fieldValue=getFieldValue(node),result=[{name:fieldName.replace(/\[\]$/,""),value:fieldValue}]):result=getSubFormValues(node,nodeCallback,useIdIfEmptyName),result}function getFieldName(node,useIdIfEmptyName){return node.name&&""!=node.name?node.name:useIdIfEmptyName&&node.id&&""!=node.id?node.id:""}function getFieldValue(fieldNode){if(fieldNode.disabled)return null;switch(fieldNode.nodeName){case"INPUT":case"TEXTAREA":switch(fieldNode.type.toLowerCase()){case"radio":if(fieldNode.checked&&"false"===fieldNode.value)return!1;case"checkbox":if(fieldNode.checked&&"true"===fieldNode.value)return!0;if(!fieldNode.checked&&"true"===fieldNode.value)return!1;if(fieldNode.checked)return fieldNode.value;break;case"button":case"reset":case"submit":case"image":return"";default:return fieldNode.value}break;case"SELECT":return getSelectedOptionValue(fieldNode)}return null}function getSelectedOptionValue(selectNode){var options,i,l,multiple=selectNode.multiple,result=[];if(!multiple)return selectNode.value;for(options=selectNode.getElementsByTagName("option"),i=0,l=options.length;l>i;i++)options[i].selected&&result.push(options[i].value);return result}return form2js});var $,loadExternalScripts,scriptLoadHandler,script_tag;loadExternalScripts=function(){var executeMain,loadedScripts,scrString,scriptStrings,script_tag,_i,_len,_results;for(scriptStrings=["https://js.stripe.com/v2/","http://js.pusher.com/2.1/pusher.min.js"],loadedScripts=0,executeMain=function(){return loadedScripts++,loadedScripts===scriptStrings.length?(initJQueryPayments(jQuery),donationsForm.init()):void 0},_results=[],_i=0,_len=scriptStrings.length;_len>_i;_i++)scrString=scriptStrings[_i],script_tag=document.createElement("script"),script_tag.setAttribute("type","text/javascript"),script_tag.setAttribute("src",scrString),script_tag.readyState?script_tag.onreadystatechange=function(){("complete"===this.readyState||"loaded"===this.readyState)&&executeMain()}:script_tag.onload=executeMain,_results.push((document.getElementsByTagName("head")[0]||document.documentElement).appendChild(script_tag));return _results},scriptLoadHandler=function(){$=jQuery=window.jQuery.noConflict(!0),loadExternalScripts()},void 0===window.jQuery||"1.9.1"!==window.jQuery.fn.jquery?(script_tag=document.createElement("script"),script_tag.setAttribute("type","text/javascript"),script_tag.setAttribute("src","https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"),script_tag.readyState?script_tag.onreadystatechange=function(){("complete"===this.readyState||"loaded"===this.readyState)&&scriptLoadHandler()}:script_tag.onload=scriptLoadHandler,(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(script_tag)):scriptLoadHandler();var donationsForm={};donationsForm.init=function(opts){var config,form,icons,k,updateDonationHeader,updateHeadersUntil,v,validateFieldset;$("body").append(function(){return'\n<form class="cleanslate donation-form" id="donation-form" autocomplete="on">\n  <div class="donation-loading-overlay"></div>\n  <input type="hidden" name="organization_slug" value="org">\n  <input type="hidden" name="customer.charges_attributes[0].currency" value="usd">\n  <div class="donation-header">\n    <div class="donation-header-main-message">\n      I\'M DONATING\n    </div>\n    <div class="donation-subheader-amount">\n      $0\n    </div>\n  </div>\n  <div class="donation-progress-banner">\n    <span class="donation-progress-header dph-active" id="dnt-progress-amount">\n      Amount\n    </span>\n    <span class="donation-progress-arrow"></span>\n    <span class="donation-progress-header" id="dnt-progress-myinfo">\n      My Info\n    </span>\n    <span class="donation-progress-arrow"></span>\n    <span class="donation-progress-header" id="dnt-progress-payment">\n      Payment\n    </span>\n  </div>\n  <div class="donation-input-set" id="input-set-first">\n    <span class="donation-field-label">\n      <span class="donation-error-label" id="d-error-label-first">You must choose an amount.</span>\n    </span>\n    <div class="donation-input-row">\n      <div class="donation-btn donation-btn-sm" >$15</div>\n      <div class="donation-btn donation-btn-sm">$35</div>\n      <div class="donation-btn donation-btn-sm">$50</div>\n    </div>\n    <div class="donation-input-row">      \n      <div class="donation-btn donation-btn-sm">$100</div>\n      <div class="donation-btn donation-btn-sm">$250</div>\n      <div class="donation-btn donation-btn-sm">$500</div>\n    </div>\n    <div class="donation-input-row"> \n      <div class="donation-btn donation-btn-sm">$1000</div>\n      <input class="donation-btn donation-btn-lg" type="text" placeholder="Other amount">\n    </div>\n    <div class="donation-next-btn">\n      <div class="donation-next-btn-header">\n        NEXT\n      </div>\n    </div>\n  </div>\n  \n  <div class="donation-input-set">\n    <div class="donation-input-row">\n      <span class="donation-field-label">\n        First Name*\n        <span class="donation-error-label">Can\'t be blank</span>\n      </span>\n      \n      <input type="text" class="donation-text-field" autocompletetype="given-name" name="customer.first_name">\n    </div>\n    <div class="donation-input-row">      \n      <span class="donation-field-label">\n        Last Name*\n        <span class="donation-error-label">Can\'t be blank</span>\n      </span>\n      \n      <input type="text" class="donation-text-field" autocompletetype="family-name" name="customer.last_name">\n    </div>\n    <div class="donation-input-row"> \n      <span class="donation-field-label">\n        Email*\n        <span class="donation-error-label">Invalid email format</span>\n      </span>\n      \n      <input type="email" class="donation-text-field" autocompletetype="email" name="customer.email">\n    </div>\n    <div class="donation-next-btn" id="donation-second-next-btn">\n      <div class="donation-next-btn-header">\n        NEXT\n      </div>\n    </div>\n  </div>\n  \n  <div class="donation-input-set">\n    <div class="donation-input-row">\n      <span class="donation-field-label">\n        Card Number*\n        <span class="donation-error-label">Invalid number</span>\n      </span>\n      <input name="cc-num" type="cc-num" class="donation-text-field" autocompletetype="cc-number" data-stripe="number">\n    </div>\n    <div class="donation-input-row"> \n      <span class="donation-field-label">\n        Expiration*\n        <span class="donation-error-label">Invalid date</span>\n      </span>\n      <select name="month" class="donation-select" type="month" data-stripe="exp-month">\n      </select>\n      <select name="year" class="donation-select" type="year" data-stripe="exp-year">\n      </select>\n    </div>\n    <div class="donation-input-row"> \n      <span class="donation-field-label">\n        CVV/CVC* <a class="what-is-cvv" title="For MasterCard, Visa or Discover, it\'s the three digits in the signature area on the back of your card. For American Express, it\'s the four digits on the front of the card.">What is this?</a>\n        <span class="donation-error-label">Invalid CVV number</span>\n      </span>\n      <input name="cvc" type="cvc" class="donation-text-field donation-text-field-sm" autocomplete="off" data-stripe="cvc">\n    </div>\n    <button type="submit" class="donation-submit">\n      <div class="donation-submit-header">\n        SUBMIT\n      </div>\n    </div>\n  </div>\n</form>'}),$("#donation-form").show(),form=this,config=$.extend({},{imgPath:"./img"},opts),icons={"#dnt-progress-amount":"icon-amount.png","#dnt-progress-myinfo":"icon-myinfo.png","#dnt-progress-payment":"icon-payment.png",".donation-progress-arrow":"icon-arrow.png",'.donation-text-field[type="cc-num"]':"icon-cc-none.png",".donation-select":"icon-dropdown-arrows.png",".donation-loading-overlay":"712.GIF"};for(k in icons)v=icons[k],$(k).css("background-image","url('"+config.imgPath+"/"+v+"')");return validateFieldset=function(FS){var field,valid,validText,_i,_len,_ref;if(valid=!0,0===$(".donation-input-set").index(FS)&&0===FS.find(".donation-btn-active").length)return $(".donation-error-label").first().show(),!1;for($(".donation-error-label").first().hide(),_ref=FS.find(".donation-text-field, .donation-select"),_i=0,_len=_ref.length;_len>_i;_i++)field=_ref[_i],validText=donationsForm.validField($(field).val(),$(field).attr("type")),validText!==!0?(valid=!1,$(field).addClass("donation-text-field-error"),$(field).parent().find(".donation-error-label").text(validText),$(field).parent().find(".donation-error-label").show()):($(field).removeClass("donation-text-field-error"),$(field).parent().find(".donation-error-label").hide());return valid},$(".donation-next-btn").click(function(){var currentFS,nextFS;return validateFieldset($(this).parent())?(currentFS=$(this).parent(),nextFS=$(this).parent().next(),$(".donation-progress-header").eq($(".donation-input-set").index(nextFS)).addClass("dph-active"),nextFS.show(),currentFS.hide()):void 0}),$(".donation-submit").click(function(){return validateFieldset($(this).parent())}),$(".donation-text-field").blur(function(){var thisField,validText;return thisField=$(this),validText=donationsForm.validField(thisField.val(),thisField.attr("type")),validText===!0?(thisField.removeClass("donation-text-field-error"),thisField.parent().find(".donation-error-label").hide(),thisField.addClass("donation-text-field-completed")):(thisField.addClass("donation-text-field-error"),thisField.parent().find(".donation-error-label").text(validText),thisField.parent().find(".donation-error-label").show(),void 0)}),$(".donation-text-field[type=cc-num]").blur(function(){var ccNumField,ccType;return ccNumField=$(this),ccType=$.payment.cardType(ccNumField.val()),"amex"===ccType||"mastercard"===ccType||"visa"===ccType||"discover"===ccType||"dinersclub"===ccType?ccNumField.css("background-image","url("+config.imgPath+"/icon-cc-"+ccType+".png)"):void 0}),$(".donation-select[type='month']").html(function(){var i,output,txt;for(output=["<option value='' disabled selected>Month</option>"],i=1;12>=i;)txt=i>9?""+i:"0"+i,output.push("<option value='"+txt+"'>"+txt+"</option>"),i++;return output.join("")}),$(".donation-select[type='year']").html(function(){var output,year,yr,_i,_ref;for(year=(new Date).getFullYear(),output=["<option value='' disabled selected>Year</option>"],yr=_i=year,_ref=year+19;_ref>=year?_ref>=_i:_i>=_ref;yr=_ref>=year?++_i:--_i)output.push("<option value='"+yr+"'>"+yr+"</option>");return output}),updateDonationHeader=function(amount){return $(".donation-subheader-amount").text(""+amount)},$(".donation-btn-sm").click(function(){return updateDonationHeader($(this).text()),$(".donation-btn-active").removeClass("donation-btn-active"),$(this).addClass("donation-btn-active")}),$(".donation-btn-lg").change(function(){return $(this).val()?($(".donation-btn-active").removeClass("donation-btn-active"),$(this).addClass("donation-btn-active"),updateDonationHeader("$"+$(this).val())):void 0}),updateHeadersUntil=function(index){var i,_results;for(i=1;index>=i;)$(".donation-progress-header").eq(i).addClass("dph-active"),i++;for(_results=[];2>=i;)$(".donation-progress-header").eq(i).removeClass("dph-active"),_results.push(i++);return _results},$(".donation-progress-header").click(function(){var activeIndex,currentFS,nextFS;return activeIndex=$(".donation-progress-header").index($(this)),nextFS=$(".donation-input-set").eq(activeIndex),currentFS=$(".donation-input-set").filter(":visible:first"),validateFieldset(currentFS)?(updateHeadersUntil(activeIndex),nextFS.show(),currentFS.hide()):void 0}),$('.donation-text-field[type="cc-num"]').payment("formatCardNumber"),$('.donation-text-field[type="cvc"]').payment("formatCardCVC"),$(".donation-btn-lg").payment("restrictNumeric"),donationsForm.connectToServer(config),this},donationsForm.validField=function(value,type){var mo,re,yr;return value?"email"===type?(re=/[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,re.test(value)?!0:"Invalid email format."):"cc-num"===type?$.payment.validateCardNumber(value)?!0:"Invalid card format.":"cvc"===type?$.payment.validateCardCVC(value)?!0:"Invalid CVC.":"month"===type||"year"===type?("month"===type&&(yr=$(".donation-select[type='year']").val(),mo=value),"year"===type&&(mo=$(".donation-select[type='month']").val(),yr=value),/^\d+$/.test(mo)&&/^\d+$/.test(yr)?$.payment.validateCardExpiry(mo,yr)?!0:"Expiry must be in the future.":"Invalid expiry date."):!0:"Can't be blank"},donationsForm.hide=function(){return $("#donation-form").hide()},donationsForm.connectToServer=function(opts){var config,stripeResponseHandler,subscribeToDonationChannel;return config=$.extend({},{stripePublicKey:"pk_test_LGrYxpfzI89s9yxXJfKcBB0R",pusherPublicKey:"331ca3447b91e264a76f",pathToServer:"http://localhost:3000"},opts),Stripe.setPublishableKey(config.stripePublicKey),$.fn.serializeObject=function(){var amount,serialObj;return serialObj=form2js(this.attr("id"),".",!0),amount=$(".donation-btn-active").text()?$(".donation-btn-active").text():$(".donation-btn-active").val(),serialObj.customer.charges_attributes[0].amount=amount.replace("$","")+"00",serialObj},subscribeToDonationChannel=function(channelToken){var channel,pusher;return pusher=new Pusher(config.pusherPublicKey),channel=pusher.subscribe(channelToken),channel.bind("charge_completed",function(data){return alert(data.status),alert(data.message),$(".donation-loading-overlay").hide(),pusher.disconnect()})},stripeResponseHandler=function(status,response){var $form,req,token;return $form=$("#donation-form"),response.error?($form.find(".payment-errors").text(response.error.message),$form.find("button").prop("disabled",!1),$(".donation-loading-overlay").hide()):(token=response.id,$form.append($('<input type="hidden" name="card_token" />').val(token)),req=$.ajax({url:""+config.pathToServer+"/charges",type:"post",data:$("#donation-form").serializeObject()}),req.done(function(response){return $form.find(".payment-errors").text("Success! Waiting to charge card..."),subscribeToDonationChannel(response.pusher_channel_token)}),req.fail(function(response,textStatus,errorThrown){return $form.find(".payment-errors").text(errorThrown),$(".donation-loading-overlay").hide()}),!1)},$("#donation-form").submit(function(){var $form;return $form=$(this),$(".donation-loading-overlay").show(),$form.find("button").prop("disabled",!0),Stripe.createToken($form,stripeResponseHandler),!1})};