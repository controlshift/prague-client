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
