describe "Form validations", ->
  it "should return true for any basic input", ->
    expect($.DonationsInit().validField('fds')).toBeTruthy()

  it "should return true for a valid email", ->
    expect($.DonationsInit().validField('a@b.com', "email")).toEqual(true)

  it "should return false for a valid email", ->
    expect($.DonationsInit().validField('ab.com', "email")).toEqual("Invalid email format.")

  it "should accept a valid cvc", ->
    expect($.DonationsInit().validField('432', "cvc")).toEqual(true)

  it "should reject an invalid cvc", ->
    expect($.DonationsInit().validField('432a', "cvc")).toEqual("Invalid CVC.")

  it "should accept a valid credit card #", ->
    expect($.DonationsInit().validField('4242 4242 4242 4242', "cc-num")).toEqual(true)

  it "should reject an invalid credit card #", ->
    expect($.DonationsInit().validField('blahblah', "cc-num")).toEqual("Invalid card format.")

  it "should accept a valid credit card #", ->
    expect($.DonationsInit().validField('4242 4242 4242 4242', "cc-num")).toEqual(true)

  it "should accept a valid date if given a year", ->
    spyOn($.fn, "val").and.returnValue("02")
    expect($.DonationsInit().validField("#{(new Date).getFullYear() + 1}", "year")).toEqual(true)

  it "should accept a valid date if given a month", ->
    spyOn($.fn, "val").and.returnValue("#{(new Date).getFullYear() + 1}")
    expect($.DonationsInit().validField('02', "month")).toEqual(true)

  it "should reject a date from a previous year", ->
    spyOn($.fn, "val").and.returnValue("02")
    expect($.DonationsInit().validField("#{(new Date).getFullYear() - 1}", "year")).toEqual("Invalid expiry date.")