(function() {
  var $;
  var getGlobalDefaults, googleAnalyticsInit, loadExternalResource, loadExternalScripts, scriptLoadHandler;

  loadExternalResource = function(type, source, callback, params) {
    var tag;
    tag = null;
    if (type === "js") {
      tag = document.createElement("script");
      tag.setAttribute("type", "text/javascript");
      tag.setAttribute("src", source);
    } else if (type === "css") {
      tag = document.createElement("link");
      tag.setAttribute("type", "text/css");
      tag.setAttribute("rel", "stylesheet");
      tag.setAttribute("href", source);
    }
    if (tag.readyState) {
      tag.onreadystatechange = function() {
        if (this.readyState === "complete" || this.readyState === "loaded") {
          callback(params);
        }
      };
    } else {
      tag.onload = function() {
        callback(params);
      };
    }
    return (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(tag);
  };

  var globalDefaults = {};;

  getGlobalDefaults = function() {
    return $.ajax({
      type: 'get',
      url: "" + ($('#donation-script').data('pathtoserver')) + "\/organizations\/" + ($('#donation-script').data('org')) + ".json",
      dataType: 'jsonp',
      success: function(dat) {
        var globalDefaults;
        globalDefaults = dat;
        $("#donation-script").trigger("donations:defaultsloaded", dat);
        return $('.donations-form-anchor').append($("<div>").attr('id', 'donations-config').attr('hidden', true).attr('defaults', JSON.stringify(dat)));
      }
    });
  };

  loadExternalScripts = function() {
    var donationsJs, executeMain, loadedScripts, scrString, scriptStrings, _i, _len, _results;
    donationsJs = $("#donation-script").data('testmode') === true ? "jquery.donations.js" : "https://d2yuwrm8xcn0u8.cloudfront.net/jquery.donations.js";
    scriptStrings = ["https://js.stripe.com/v2/", "https://d3dy5gmtp8yhk7.cloudfront.net/2.1/pusher.min.js", donationsJs];
    loadedScripts = 0;
    executeMain = function() {
      loadedScripts++;
      if (loadedScripts === scriptStrings.length) {
        initJQueryPayments(jQuery);
        googleAnalyticsInit();
        $('.donations-form-anchor').append(html);
        return ko.applyBindings(new DonationsFormModel());
      }
    };
    _results = [];
    for (_i = 0, _len = scriptStrings.length; _i < _len; _i++) {
      scrString = scriptStrings[_i];
      _results.push(loadExternalResource("js", scrString, executeMain));
    }
    return _results;
  };

  googleAnalyticsInit = function() {
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments);
      };
      i[r].l = 1 * new Date();
      a = s.createElement(o);
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, "script", "//www.google-analytics.com/analytics.js", "gaDonations");
    gaDonations("create", "UA-48690908-1", "controlshiftlabs.com");
    return gaDonations("send", "pageview");
  };

  scriptLoadHandler = function() {
    $ = jQuery = window.jQuery.noConflict(true);
    var cssSrc, testmode;
    testmode = $("#donation-script").data('testmode') === true;
    cssSrc = testmode ? "jquery.donations.css" : "https://d2yuwrm8xcn0u8.cloudfront.net/jquery.donations.css";
    loadExternalResource("css", cssSrc, (function() {}));
    getGlobalDefaults();
    loadExternalScripts();
  };

  if (window.jQuery === undefined || (window.jQuery.fn.jquery && (parseInt(window.jQuery.fn.jquery[0]) !== 1 || parseInt(window.jQuery.fn.jquery[1]) < 9))) {
    loadExternalResource("js", "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", scriptLoadHandler);
  } else {
    scriptLoadHandler();
  }

}).call(this);
