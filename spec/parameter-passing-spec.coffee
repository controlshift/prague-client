describe "Parameter passing", ->
  beforeEach ->
    donationsForm.hide()
  it "should fetch organization form script tag", ->
    expect($("#donation-script").data('org')).toEqual($("input[name=organization_slug]").val())