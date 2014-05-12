describe "DonationsFormModel", ->
  `var donationsForm;`
  `var configHash;`
  beforeEach ->
    loadLocalJson = ->
      json = null
      $.ajax
        async: false
        dataType: 'json'
        url: 'config.json'
        success: (dat) ->
          json = dat
      return json
    `configHash = loadLocalJson();`
    `donationsForm = new DonationsFormModel($, configHash)`
    return

  describe "Form validations", ->
    it "should check for presence of first name", ->
      donationsForm.firstName("Foo")
      expect(donationsForm.firstName.isValid()).toBeTruthy()
      donationsForm.firstName(null)
      expect(donationsForm.firstName.isValid()).toBeFalsy()

    it "should return true for a valid email", ->
      donationsForm.email("a@b.com")
      expect(donationsForm.email.isValid()).toBeTruthy()

    it "should return false for an invalid email", ->
      donationsForm.email("ab.com")
      expect(donationsForm.email.isValid()).toBeFalsy()

    it "should accept a valid cvc", ->
      donationsForm.cvc("432")
      expect(donationsForm.cvc.isValid()).toBeTruthy()

    it "should reject an invalid cvc", ->
      donationsForm.cvc("432a")
      expect(donationsForm.cvc.isValid()).toBeFalsy()

    it "should accept a valid credit card #", ->
      donationsForm.cardNumber("4242 4242 4242 4242")
      expect(donationsForm.cardNumber.isValid()).toBeTruthy()

    it "should reject an invalid credit card #", ->
      donationsForm.cardNumber("4242 4242")
      expect(donationsForm.cardNumber.isValid()).toBeFalsy()

    it "should accept a valid date", ->
      donationsForm.cardMonth('01')
      donationsForm.cardYear("#{(new Date).getFullYear() + 1}")
      expect(donationsForm.cardDate.isValid()).toBeTruthy()

    it "should reject an old date", ->
      donationsForm.cardMonth('01')
      donationsForm.cardYear("#{(new Date).getFullYear() - 1}")
      expect(donationsForm.cardDate.isValid()).toBeFalsy()
    return

  describe "Parsing query strings", ->
    it "should return the expected hash", ->
      expect(donationsForm.parseQueryString("foo=bar&foo2=bar2")).toEqual({'foo' : 'bar', 'foo2' : 'bar2'})

    it "should return an empty hash when the query string is undefined or blank", ->
      expect(donationsForm.parseQueryString("")).toEqual({})
      expect(donationsForm.parseQueryString(undefined)).toEqual({})

    return

  describe "Currency conversion", ->
    `var formWithConversion;`
    beforeEach ->
      conversionHash = $.extend({
        'seedamount' : 100,
        'seedvalues' : "100,200,300",
        'currencyconversion' : 'choose'
      }, configHash)

      `formWithConversion = new DonationsFormModel($, conversionHash);`
      return

    # Note: the BBD is pegged to the USD at 0.5 BBD to 1 USD

    it "should convert amounts if currencyconversion=choose", ->
      formWithConversion.selectedCurrency('BBD')
      expect(formWithConversion.amounts()).toEqual([200,400,600])

    it "should convert amounts by default and the country is different", ->
      detectHash = $.extend({
        'seedamount' : 100,
        'seedvalues' : "100,200,300",
        'seedcurrency' : 'BBD'
      }, configHash)

      detectForm = new DonationsFormModel($, detectHash);
      detectForm.selectedCurrency('USD')
      expect(detectForm.amounts()).toEqual([50,100,150])

    it "should not convert amounts if currencyconversion=none", ->
      detectHash = $.extend({
        'seedamount' : 100,
        'seedvalues' : "100,200,300",
        'seedcurrency' : 'BBD',
        'currencyconversion' : 'none'
      }, configHash)

      detectForm = new DonationsFormModel($, detectHash);
      detectForm.selectedCurrency('USD')
      expect(detectForm.amounts()).toEqual([100,200,300])

    it "should allow me to specify a form currency", ->
      chooseHash = $.extend({
        'seedamount' : 100,
        'seedvalues' : "100,200,300",
        'currencyconversion' : 'choose',
        'formcurrency' : 'AUD'
      }, configHash)

      chooseForm = new DonationsFormModel($, chooseHash)
      expect(chooseForm.currencySymbol()).toEqual("AU$")


    it "should round numbers up to 1 if they are 0", ->
      expect(formWithConversion.round(0)).toEqual(1)

    it "should in general round numbers to 2 significant digits", ->
      expect(formWithConversion.round(4567)).toEqual(4600)

    it "should round decimals", ->
      expect(formWithConversion.round(4.532)).toEqual(5)

    it "should leave numbers that are already in the desired format alone", ->
      expect(formWithConversion.round(45)).toEqual(45)

    return
  return
