casper.test.begin "completing a valid form", 3, (test) ->
  casper.on 'remote.alert', (message) ->
    this.log('remote alert message: ' + message, 'warning');

  casper.on 'remote.message', (message) ->
    this.log('remote console message: ' + message, 'warning');
  
  casper.on 'page.error', (message, trace) ->
    this.log("page js error: " + message, 'warning');
      
  casper.start "build/index.html"
  casper.waitUntilVisible '.donation-btn'
  casper.then ->

    @evaluate ->
      console.log 'this is logged'
      console.log $(".donation-btn:first")
      $(".donation-btn:first").click()
    @evaluate ->
      $(".donation-next-btn:visible").click()
    nextPageIsVisible = @evaluate ->
      $(".donation-text-field[name='customer.first_name']").is(":visible")

    test.assert(nextPageIsVisible, "Step 2 is visible")
    @fill("form#donation-form", {
      "customer.first_name" : "Foo", 
      "customer.last_name" : "Bar", 
      "customer.email" : "foo@bar.com"
    }, false)
    @evaluate ->
      $(".donation-next-btn:visible").click()
    nextPageIsVisible = @evaluate ->
      $("input[type=cc-num]").is(":visible")

    test.assert(nextPageIsVisible, "Step 3 is visible")
    @fill("form#donation-form", {
      "cc-num" : "4242 4242 4242 4242", 
      "month" : "02", 
      "year" : "#{(new Date).getFullYear() + 1}", 
      "cvc" : "4242"
    }, false)
    noErrors = @evaluate ->
      $(".donation-text-field-error").length
    test.assertEquals(noErrors, 0, "No errors are present")
    return

  casper.run ->
    test.done()
    return

  return
