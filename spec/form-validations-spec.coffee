describe "Form validations", ->
  beforeEach ->
    donationsForm.hide()
  
  it "should return true for any basic input", ->
    expect(donationsForm.validField('fds')).toBeTruthy()

  it "should return true for a valid email", ->
    expect(donationsForm.validField('a@b.com', "email")).toEqual(true)

  it "should return false for a valid email", ->
    expect(donationsForm.validField('ab.com', "email")).toEqual("Invalid email format.")

  it "should accept a valid cvc", ->
    expect(donationsForm.validField('432', "cvc")).toEqual(true)

  it "should reject an invalid cvc", ->
    expect(donationsForm.validField('432a', "cvc")).toEqual("Invalid CVC.")

  it "should accept a valid credit card #", ->
    expect(donationsForm.validField('4242 4242 4242 4242', "cc-num")).toEqual(true)

  it "should reject an invalid credit card #", ->
    expect(donationsForm.validField('blahblah', "cc-num")).toEqual("Invalid card format.")

  it "should accept a valid credit card #", ->
    expect(donationsForm.validField('4242 4242 4242 4242', "cc-num")).toEqual(true)

  it "should accept a valid date if given a year", ->
    spyOn($.fn, "val").and.returnValue("02")
    expect(donationsForm.validField("#{(new Date).getFullYear() + 1}", "year")).toEqual(true)

  it "should accept a valid date if given a month", ->
    spyOn($.fn, "val").and.returnValue("#{(new Date).getFullYear() + 1}")
    expect(donationsForm.validField('02', "month")).toEqual(true)

  it "should reject a date from a previous year", ->
    spyOn($.fn, "val").and.returnValue("02")
    expect(donationsForm.validField("#{(new Date).getFullYear() - 1}", "year")).toEqual("Expiry must be in the future.")

  it "should return a message if something else goes wrong for the expiry date", ->
    spyOn($.fn, "val").and.returnValue("02a")
    expect(donationsForm.validField("#{(new Date).getFullYear() + 1}", "year")).toEqual("Invalid expiry date.")

describe "Parsing query strings", ->
  beforeEach ->
    donationsForm.hide()
  
  it "should return the expected hash", ->
    expect(donationsForm.parseQueryString("foo=bar&foo2=bar2")).toEqual({'foo' : 'bar', 'foo2' : 'bar2'})

  it "should return an empty hash when the query string is undefined or blank", ->
    expect(donationsForm.parseQueryString("")).toEqual({})
    expect(donationsForm.parseQueryString(undefined)).toEqual({})
