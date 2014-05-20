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

  getGlobalDefaults = function(callback) {
    return $.ajax({
      type: 'get',
      url: "" + ($('#donation-script').data('pathtoserver')) + "\/config\/" + ($('#donation-script').data('org')) + ".json",
      dataType: 'jsonp',
      complete: function(dat) {
        return callback(dat, $.extend($("#donation-script").data()));
      }
    });
  };

  loadExternalScripts = function() {
    var donationsJs, executeMain, loadedScripts, scrString, scriptStrings, testmode, _i, _len, _results;
    testmode = $("#donation-script").data('testmode') === true;
    donationsJs = testmode ? "/js/jquery.donations.js" : "https://d2yuwrm8xcn0u8.cloudfront.net/jquery.donations.js";
    scriptStrings = [donationsJs];
    loadedScripts = 0;
    executeMain = function() {
      var initializeForm, loadLocalJson;
      loadedScripts++;
      if (loadedScripts === scriptStrings.length) {
        initJQueryPayments(jQuery);
        googleAnalyticsInit();
        initializeForm = function(config) {
          $('.donations-form-anchor').append(html);
          return ko.applyBindings(new DonationsFormModel($, config));
        };
        loadLocalJson = function() {
          var json;
          json = null;
          $.ajax({
            async: false,
            dataType: 'json',
            url: '/config/config.json',
            success: function(dat) {
              return json = dat;
            }
          });
          return json;
        };
        if (testmode) {
          return initializeForm($.extend(loadLocalJson(), $("#donation-script").data()));
        } else {
          return getGlobalDefaults(initializeForm);
        }
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
    cssSrc = testmode ? "/css/jquery.donations.css" : "https://d2yuwrm8xcn0u8.cloudfront.net/jquery.donations.css";
    loadExternalResource("css", cssSrc, (function() {}));
    loadExternalScripts();
  };

  if (window.jQuery === undefined || (window.jQuery.fn.jquery && (parseInt(window.jQuery.fn.jquery[0]) !== 1 || parseInt(window.jQuery.fn.jquery[1]) < 9))) {
    loadExternalResource("js", "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", scriptLoadHandler);
  } else {
    scriptLoadHandler();
  }

}).call(this);
