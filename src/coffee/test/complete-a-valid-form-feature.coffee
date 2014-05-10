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
    
    @click ".donation-btn"

    @click ".donation-next-btn"

    test.assertVisible(".donation-text-field[name='customer.first_name']", "Step 2 is visible")

    @fill("form#donation-form", {
      "customer.first_name" : "Foo", 
      "customer.last_name" : "Bar", 
      "customer.email" : "foo@bar.com"
    }, false)
    @click "#donation-second-next-btn"

    test.assertVisible("input[type='cc-num']", "Step 3 is visible")
    @fill("form#donation-form", {
      "cc-num" : "4242 4242 4242 4242", 
      "month" : "02", 
      "year" : "#{(new Date).getFullYear() + 1}", 
      "cvc" : "4242"
    }, false)
    noErrors = document.querySelector(".donation-text-field-error")
    test.assertEquals(noErrors, null, "No errors are present")
    return

  casper.run ->
    test.done()
    return

  return
