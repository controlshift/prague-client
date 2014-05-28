casper.test.begin "seeding currencies to the form", 1, (test) ->
  casper.on 'remote.alert', (message) ->
    this.log('remote alert message: ' + message, 'warning');

  casper.on 'remote.message', (message) ->
    this.log('remote console message: ' + message, 'warning');
  
  casper.on 'page.error', (message, trace) ->
    this.log("page js error: " + message, 'warning');
      
  casper.start "build/index.html?seedcurrency=USD&seedamount=10&seedvalues=100,200,300,350"

  casper.wait 2000

  casper.then ->
    amountElems = @evaluate ->
      amounts = document.querySelectorAll('.donation-amt')
      return (elem.textContent for elem in amounts)
    test.assertEquals("#{amountElems}", "#{['10','20','30','40']}", "Amounts are correct")

  casper.run ->
    test.done()
    return

  return
