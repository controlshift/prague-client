describe "DonationsFormModel", ->
  `var target;`
  beforeEach ->
    `target = new DonationsFormModel($)`
    return

  describe "Form validations", ->
    it "should check for presence of first name", ->
      target.firstName("Foo")
      expect(target.firstName.isValid()).toBeTruthy()
      target.firstName(null)
      expect(target.firstName.isValid()).toBeFalsy()

    it "should return true for a valid email", ->
      target.email("a@b.com")
      expect(target.email.isValid()).toBeTruthy()

    it "should return false for an invalid email", ->
      target.email("ab.com")
      expect(target.email.isValid()).toBeFalsy()

    it "should accept a valid cvc", ->
      target.cvc("432")
      expect(target.cvc.isValid()).toBeTruthy()

    it "should reject an invalid cvc", ->
      target.cvc("432a")
      expect(target.cvc.isValid()).toBeFalsy()

    it "should accept a valid credit card #", ->
      target.cardNumber("4242 4242 4242 4242")
      expect(target.cardNumber.isValid()).toBeTruthy()

    it "should reject an invalid credit card #", ->
      target.cardNumber("4242 4242")
      expect(target.cardNumber.isValid()).toBeFalsy()

    it "should accept a valid date", ->
      target.cardMonth('01')
      target.cardYear("#{(new Date).getFullYear() + 1}")
      expect(target.cardDate.isValid()).toBeTruthy()

    it "should reject an old date", ->
      target.cardMonth('01')
      target.cardYear("#{(new Date).getFullYear() - 1}")
      expect(target.cardDate.isValid()).toBeFalsy()
    return

  describe "Parsing query strings", ->
    it "should return the expected hash", ->
      expect(target.parseQueryString("foo=bar&foo2=bar2")).toEqual({'foo' : 'bar', 'foo2' : 'bar2'})

    it "should return an empty hash when the query string is undefined or blank", ->
      expect(target.parseQueryString("")).toEqual({})
      expect(target.parseQueryString(undefined)).toEqual({})

    return
  return
