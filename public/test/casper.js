(function() {
  casper.test.begin("completing a valid form", 3, function(test) {
    casper.on('remote.alert', function(message) {
      return this.log('remote alert message: ' + message, 'warning');
    });
    casper.on('remote.message', function(message) {
      return this.log('remote console message: ' + message, 'warning');
    });
    casper.on('page.error', function(message, trace) {
      return this.log("page js error: " + message, 'warning');
    });
    casper.start("build/index.html");
    casper.waitUntilVisible('.donation-btn');
    casper.then(function() {
      var noErrors;
      this.click(".donation-btn");
      this.click(".donation-next-btn");
      test.assertVisible(".donation-text-field[name='customer.first_name']", "Step 2 is visible");
      this.fill("form#donation-form", {
        "customer.first_name": "Foo",
        "customer.last_name": "Bar",
        "customer.email": "foo@bar.com"
      }, false);
      this.click("#donation-second-next-btn");
      test.assertVisible("input[type='cc-num']", "Step 3 is visible");
      this.fill("form#donation-form", {
        "cc-num": "4242 4242 4242 4242",
        "month": "02",
        "year": "" + ((new Date).getFullYear() + 1),
        "cvc": "4242"
      }, false);
      noErrors = document.querySelector(".donation-text-field-error");
      test.assertEquals(noErrors, null, "No errors are present");
    });
    casper.run(function() {
      test.done();
    });
  });

}).call(this);

(function() {
  casper.test.begin("seeding currencies to the form", 1, function(test) {
    casper.on('remote.alert', function(message) {
      return this.log('remote alert message: ' + message, 'warning');
    });
    casper.on('remote.message', function(message) {
      return this.log('remote console message: ' + message, 'warning');
    });
    casper.on('page.error', function(message, trace) {
      return this.log("page js error: " + message, 'warning');
    });
    casper.start("build/index.html?seedcurrency=USD&seedamount=10&seedvalues=100,200,300,350");
    casper.wait(2000);
    casper.then(function() {
      var amountElems;
      amountElems = this.evaluate(function() {
        var amounts, elem;
        amounts = document.querySelectorAll('.donation-amt');
        return (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = amounts.length; _i < _len; _i++) {
            elem = amounts[_i];
            _results.push(elem.textContent);
          }
          return _results;
        })();
      });
      return test.assertEquals("" + amountElems, "" + ['10', '20', '30', '35'], "Amounts are correct");
    });
    casper.run(function() {
      test.done();
    });
  });

}).call(this);
