(function(){var a,b,c,d,e,f;d=function(a,b,c,d){var e;return e=null,"js"===a?(e=document.createElement("script"),e.setAttribute("type","text/javascript"),e.setAttribute("src",b)):"css"===a&&(e=document.createElement("link"),e.setAttribute("type","text/css"),e.setAttribute("rel","stylesheet"),e.setAttribute("href",b)),e.readyState?e.onreadystatechange=function(){("complete"===this.readyState||"loaded"===this.readyState)&&c(d)}:e.onload=function(){c(d)},(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(e)};b=function(){return a.ajax({type:"get",url:""+a("#donation-script").data("pathtoserver")+"/organizations/"+a("#donation-script").data("org")+".json",dataType:"jsonp",success:function(b){var c;return c=b,a("#donation-script").trigger("donations:defaultsloaded",b),a(".donations-form-anchor").append(a("<div>").attr("id","donations-config").attr("hidden",!0).attr("defaults",JSON.stringify(b)))}})},e=function(){var b,e,f,g,h,i,j,k;for(b=a("#donation-script").data("testmode")===!0?"jquery.donations.5ea96b75.js":"https://d2yuwrm8xcn0u8.cloudfront.net/jquery.donations.5ea96b75.js",h=["https://js.stripe.com/v2/","https://d3dy5gmtp8yhk7.cloudfront.net/2.1/pusher.min.js",b],f=0,e=function(){return f++,f===h.length?(initJQueryPayments(jQuery),c(),a(".donations-form-anchor").append(html),ko.applyBindings(new DonationsFormModel(a,a("#donation-script").data()))):void 0},k=[],i=0,j=h.length;j>i;i++)g=h[i],k.push(d("js",g,e));return k},c=function(){return function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(window,document,"script","//www.google-analytics.com/analytics.js","gaDonations"),gaDonations("create","UA-48690908-1","controlshiftlabs.com"),gaDonations("send","pageview")},f=function(){a=jQuery=window.jQuery.noConflict(!0);var c,f;f=a("#donation-script").data("testmode")===!0,c=f?"jquery.donations.3516e2b1.css":"https://d2yuwrm8xcn0u8.cloudfront.net/jquery.donations.3516e2b1.css",d("css",c,function(){}),b(),e()},void 0===window.jQuery||window.jQuery.fn.jquery&&(1!==parseInt(window.jQuery.fn.jquery[0])||parseInt(window.jQuery.fn.jquery[1])<9)?d("js","https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",f):f()}).call(this);