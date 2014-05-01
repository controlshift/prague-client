(function() {
  describe("Form validations", function() {
    beforeEach(function() {
      return donationsForm.hide();
    });
    it("should return true for any basic input", function() {
      return expect(donationsForm.validField('fds')).toBeTruthy();
    });
    it("should return true for a valid email", function() {
      return expect(donationsForm.validField('a@b.com', "email")).toEqual(true);
    });
    it("should return false for a valid email", function() {
      return expect(donationsForm.validField('ab.com', "email")).toEqual("Invalid email format.");
    });
    it("should accept a valid cvc", function() {
      return expect(donationsForm.validField('432', "cvc")).toEqual(true);
    });
    it("should reject an invalid cvc", function() {
      return expect(donationsForm.validField('432a', "cvc")).toEqual("Invalid CVC.");
    });
    it("should accept a valid credit card #", function() {
      return expect(donationsForm.validField('4242 4242 4242 4242', "cc-num")).toEqual(true);
    });
    it("should reject an invalid credit card #", function() {
      return expect(donationsForm.validField('blahblah', "cc-num")).toEqual("Invalid card format.");
    });
    it("should accept a valid credit card #", function() {
      return expect(donationsForm.validField('4242 4242 4242 4242', "cc-num")).toEqual(true);
    });
    it("should accept a valid date if given a year", function() {
      spyOn($.fn, "val").and.returnValue("02");
      return expect(donationsForm.validField("" + ((new Date).getFullYear() + 1), "year")).toEqual(true);
    });
    it("should accept a valid date if given a month", function() {
      spyOn($.fn, "val").and.returnValue("" + ((new Date).getFullYear() + 1));
      return expect(donationsForm.validField('02', "month")).toEqual(true);
    });
    it("should reject a date from a previous year", function() {
      spyOn($.fn, "val").and.returnValue("02");
      return expect(donationsForm.validField("" + ((new Date).getFullYear() - 1), "year")).toEqual("Expiry must be in the future.");
    });
    return it("should return a message if something else goes wrong for the expiry date", function() {
      spyOn($.fn, "val").and.returnValue("02a");
      return expect(donationsForm.validField("" + ((new Date).getFullYear() + 1), "year")).toEqual("Invalid expiry date.");
    });
  });

  describe("Parsing query strings", function() {
    beforeEach(function() {
      return donationsForm.hide();
    });
    it("should return the expected hash", function() {
      return expect(donationsForm.parseQueryString("foo=bar&foo2=bar2")).toEqual({
        'foo': 'bar',
        'foo2': 'bar2'
      });
    });
    return it("should return an empty hash when the query string is undefined or blank", function() {
      expect(donationsForm.parseQueryString("")).toEqual({});
      return expect(donationsForm.parseQueryString(void 0)).toEqual({});
    });
  });

}).call(this);
