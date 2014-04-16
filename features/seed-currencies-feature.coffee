casper.test.begin "completing a valid form", 3, (test) ->
  casper.on 'remote.alert', (message) ->
    this.log('remote alert message: ' + message, 'warning');

  casper.on 'remote.message', (message) ->
    this.log('remote console message: ' + message, 'warning');
  
  casper.on 'page.error', (message, trace) ->
    this.log("page js error: " + message, 'warning');
      
  casper.start "build/index.html"

  casper.waitUntilVisible '.donation-btn'

  

  casper.run ->
    test.done()
    return

  return
