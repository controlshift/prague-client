describe "Form validations", ->
  it "should return true for any basic input", ->
    expect($.DonationsInit().validField('fds')).toBeTruthy()

  it "should return true for a valid email", ->
    expect($.DonationsInit().validField('a@b.com', "email")).toEqual(true)

  it "should return false for a valid email", ->
    expect($.DonationsInit().validField('ab.com', "email")).toEqual(false)

  it "should accept a valid cvc", ->
    expect($.DonationsInit().validField('432', "cvc")).toEqual(true)

  it "should reject an invalid cvc", ->
    expect($.DonationsInit().validField('432a', "cvc")).toEqual(false)

  it "should accept a valid credit card #", ->
    expect($.DonationsInit().validField('4242 4242 4242 4242', "cc-num")).toEqual(true)

  it "should reject an invalid credit card #", ->
    expect($.DonationsInit().validField('blahblah', "cc-num")).toEqual(false)

  it "should accept a valid credit card #", ->
    expect($.DonationsInit().validField('4242 4242 4242 4242', "cc-num")).toEqual(true)

  it "should accept a valid date if given a year", ->
    spyOn($.fn, "val").and.returnValue("02")
    expect($.DonationsInit().validField('2019', "year")).toEqual(true)