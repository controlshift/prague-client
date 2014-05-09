(function() {
  describe("DonationsFormModel", function() {
    var donationsForm;;
    var configHash;;
    beforeEach(function() {
      var loadLocalJson;
      loadLocalJson = function() {
        var json;
        json = null;
        $.ajax({
          async: false,
          dataType: 'json',
          url: 'config.json',
          success: function(dat) {
            return json = dat;
          }
        });
        return json;
      };
      configHash = loadLocalJson();;
      donationsForm = new DonationsFormModel($, configHash);
    });
    describe("Form validations", function() {
      it("should check for presence of first name", function() {
        donationsForm.firstName("Foo");
        expect(donationsForm.firstName.isValid()).toBeTruthy();
        donationsForm.firstName(null);
        return expect(donationsForm.firstName.isValid()).toBeFalsy();
      });
      it("should return true for a valid email", function() {
        donationsForm.email("a@b.com");
        return expect(donationsForm.email.isValid()).toBeTruthy();
      });
      it("should return false for an invalid email", function() {
        donationsForm.email("ab.com");
        return expect(donationsForm.email.isValid()).toBeFalsy();
      });
      it("should accept a valid cvc", function() {
        donationsForm.cvc("432");
        return expect(donationsForm.cvc.isValid()).toBeTruthy();
      });
      it("should reject an invalid cvc", function() {
        donationsForm.cvc("432a");
        return expect(donationsForm.cvc.isValid()).toBeFalsy();
      });
      it("should accept a valid credit card #", function() {
        donationsForm.cardNumber("4242 4242 4242 4242");
        return expect(donationsForm.cardNumber.isValid()).toBeTruthy();
      });
      it("should reject an invalid credit card #", function() {
        donationsForm.cardNumber("4242 4242");
        return expect(donationsForm.cardNumber.isValid()).toBeFalsy();
      });
      it("should accept a valid date", function() {
        donationsForm.cardMonth('01');
        donationsForm.cardYear("" + ((new Date).getFullYear() + 1));
        return expect(donationsForm.cardDate.isValid()).toBeTruthy();
      });
      it("should reject an old date", function() {
        donationsForm.cardMonth('01');
        donationsForm.cardYear("" + ((new Date).getFullYear() - 1));
        return expect(donationsForm.cardDate.isValid()).toBeFalsy();
      });
    });
    describe("Parsing query strings", function() {
      it("should return the expected hash", function() {
        return expect(donationsForm.parseQueryString("foo=bar&foo2=bar2")).toEqual({
          'foo': 'bar',
          'foo2': 'bar2'
        });
      });
      it("should return an empty hash when the query string is undefined or blank", function() {
        expect(donationsForm.parseQueryString("")).toEqual({});
        return expect(donationsForm.parseQueryString(void 0)).toEqual({});
      });
    });
    describe("Currency conversion", function() {
      var formWithConversion;;
      beforeEach(function() {
        var conversionHash;
        conversionHash = $.extend({
          'seedamount': 100,
          'seedvalues': "100,200,300",
          'currencyconversion': 'choose'
        }, configHash);
        formWithConversion = new DonationsFormModel($, conversionHash);;
      });
      it("should convert amounts if currencyconversion=choose", function() {
        formWithConversion.selectedCurrency('BBD');
        return expect(formWithConversion.amounts()).toEqual([200, 400, 600]);
      });
      it("should convert amounts if currencyconversion=detect and the country is different", function() {
        var detectForm, detectHash;
        detectHash = $.extend({
          'seedamount': 100,
          'seedvalues': "100,200,300",
          'seedcurrency': 'BBD',
          'currencyconversion': 'choose'
        }, configHash);
        detectForm = new DonationsFormModel($, detectHash);
        detectForm.selectedCurrency('USD');
        return expect(detectForm.amounts()).toEqual([50, 100, 150]);
      });
    });
  });

}).call(this);
