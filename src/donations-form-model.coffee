class DonationsFormModel
  constructor: (jQuery, opts) ->
    self = @
    `$ = jQuery;`
    config = $.extend({}, {
      imgpath: 'https://d2yuwrm8xcn0u8.cloudfront.net',
      metaviewporttag: true
    }, opts, self.parseQueryString(document.URL.split("?")[1]))

    ko.validation.configure({
      insertMessages: false
    });
    ko.validation.rules['ccDate'] = {
      validator: (val, otherVal) ->
        return $.payment.validateCardExpiry(val.month, val.year);
      , message: 'Invalid date'
    }
    ko.validation.rules['ccNum'] = {
      validator: (val, otherVal) ->
        return $.payment.validateCardNumber(val);
      , message: 'Invalid credit card number'
    }
    ko.validation.rules['cvc'] = {
      validator: (val, otherVal) ->
        return $.payment.validateCardCVC(val);
      , message: 'Invalid CVC number'
    }
    ko.validation.registerExtenders()

    self.org = ko.observable(config['org'])

    self.countryCode = ko.observable("US")

    self.imgPath = ko.observable(config['imgpath'])
    self.initializeIcons(self.imgPath())

    self.seedAmount = config['seedamount'] || 100
    self.seedValues = if config['seedvalues']? then config['seedvalues'].split(",") else [15,35,50,100,250,500,1000]

    self.currencies = {
      'US' : 'USD', 'GB' : 'GBP', 'AU' : 'AUD', 'CA' : 'CAD', 'SE' : 'SEK', 'NO' : 'NOK', 'DK' : 'DKK', 'NZ' : 'NZD'
    }

    self.currenciesArray = ko.observableArray [
      'USD', 'GBP', 'CAD', 'AUD', 'EUR', 'NZD', 'SEK', 'NOK', 'DKK'
    ]
    self.currenciesEnabled = ko.observable(config['currencyconversion'] isnt "none")
    self.seededCurrency = config['seedcurrency'] or 'USD'
    self.formCurrency = config['formcurrency'] or self.seededCurrency

    initializeCurrency = ->
      unless config['currencyconversion'] in ["none", "choose"]
        return self.currencies[config['country']]
      else
        return self.formCurrency

    self.selectedCurrency = ko.observable(initializeCurrency())
    self.currencySymbol = ko.computed(->
      symbols = {
        'USD' : '$', 'GBP' : '&pound;', 'EUR' : '&euro;', 'NZD' : 'NZ$', 'AUD' : 'AU$', 'CAD' : 'C$'
      }
      return symbols[self.selectedCurrency()] or self.selectedCurrency()
    , this)

    self.selectedBtn = ko.observable(-1)
    # Button amount
    self.selectedAmount = ko.observable("0")
    # Input amount
    self.inputtedAmount = ko.observable(null)

    self.displayAmount = ko.computed(->
      self.inputtedAmount() or self.selectedAmount()
    , this).extend({ required: { message: "Please select an amount" }, min: 1, digit: true })

    self.normalizedAmount = ko.computed(->
      zeroDecimalCurrencies = ['BIF', 'CLP', 'JPY', 'KRW', 'PYG', 'VUV', 'XOF', 'CLP', 'GNF', 'KMF', 'MGA', 'RWF', 'XAF', 'XPF']
      if self.selectedCurrency() in zeroDecimalCurrencies
        self.displayAmount()
      else
        self.displayAmount() + "00"
    , this)

    self.setActiveAmount = (index, amount) ->
      if index > -1
        self.inputtedAmount(null)
        self.selectedAmount(self.amounts()[index])
        self.selectedBtn(index)

    self.clearSelectedButton = ->
      self.selectedAmount(0)
      self.selectedBtn(-1)

    self.amounts = ko.computed(->
      arr = []
      for entry, count in self.seedValues
        baseAmount = parseInt(entry) / 100.0 * parseInt(self.seedAmount)
        if count < 7 # limit 7 buttons
          if self.currenciesEnabled()
            conversionRateToCurrency = config[self.selectedCurrency()] or 1
            conversionRateFromCurrency = config[self.seededCurrency] or 1
            arr.push(self.round(baseAmount * conversionRateToCurrency / conversionRateFromCurrency))
          else
            arr.push(self.round(baseAmount))
      return arr
    , this)

    self.amountsLength = ko.computed(->
      self.amounts().length
    , this)
    
    self.visibleInputSet = ko.observable(0)

    self.incrementInputSet = ->
      self.visibleInputSet(self.visibleInputSet() + 1)

    self.setInputSet = (index) ->
      self.visibleInputSet(index)

    self.firstName = ko.observable().extend({ required: { message: "Can't be blank" } })
    self.lastName = ko.observable().extend({ required: { message: "Can't be blank" } })
    self.email = ko.observable().extend({
      required: { message: "Can't be blank" },
      email: { message: "Invalid email" }
    })
    self.cardNumber = ko.observable().extend({ required: { message: "Can't be blank" }, ccNum: true })
    self.cardMonth = ko.observable()
    self.ccMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    self.cardYear = ko.observable("#{new Date().getFullYear() + 1}")
    self.ccYears = (->
      output = []
      year = new Date().getFullYear()
      for yr in [year..year+19]
        output.push("#{yr}")
      return output
    )()
    self.cardDate = ko.computed(->
      { month: self.cardMonth(), year: self.cardYear() }
    , this).extend({ ccDate: true, observable: true })
    self.cvc = ko.observable().extend({ required: { message: "Can't be blank" }, digit: true, cvc: true })
    $('.donation-text-field[type="cc-num"]').payment('formatCardNumber')
    $('.donation-text-field[type="cvc"]').payment('formatCardCVC')

    self.ccBackground = ko.computed(->
      ccType = $.payment.cardType(self.cardNumber())
      if ccType in ['amex','mastercard','visa','discover','dinersclub']
        return "url(#{self.imgPath()}/icon-cc-#{ccType}.png)"
      else
        return "url(#{self.imgPath()}/icon-cc-none.png)"
    , this)

    self.inputSet1 = ko.validatedObservable({ amount: self.displayAmount })
    self.inputSet2 = ko.validatedObservable({ firstName: self.firstName, lastName: self.lastName, email: self.email})
    self.inputSet3 = ko.validatedObservable({ cardNumber: self.cardNumber, cardDate: self.cardDate, cvc: self.cvc})

    self.connectToServer(config, self)

  parseQueryString: (q) ->
    hash = {}
    if q isnt `undefined` and q isnt ""
      q = q.split("&")
      i = 0
      while i < q.length
        vars = q[i].split("=")
        hash[vars[0]] = vars[1]
        i++
    return hash

  initializeIcons: (path) ->
    icons = {
      '#dnt-progress-amount' : 'icon-amount.png',
      '#dnt-progress-myinfo' : 'icon-myinfo.png',
      '#dnt-progress-payment' : 'icon-payment.png',
      '.donation-progress-arrow' : 'icon-arrow.png',
      '.donation-text-field[type="cc-num"]' : 'icon-cc-none.png',
      '.donation-select' : 'icon-dropdown-arrows.png',
      '.donation-loading-overlay' : '712.GIF'
    }

    for k, v of icons
      $(k).css('background-image', "url('#{path}/#{v}')")

  round: (number) ->
    temp = Math.round(parseFloat(number.toPrecision(2)))
    if temp == 0 then 1 else temp

  connectToServer: (opts, self) ->
    config = $.extend({}, {
      stripepublickey: "pk_test_LGrYxpfzI89s9yxXJfKcBB0R",
      pusherpublickey: '331ca3447b91e264a76f',
      pathtoserver: "http://localhost:3000"
    }, opts)

    Stripe.setPublishableKey config['stripepublickey']

    $.fn.serializeObject = ->
      serialObj = form2js(@attr('id'), '.', true)
      serialObj['cc-num'] = ''
      serialObj['month'] = ''
      serialObj['year'] = ''
      serialObj['cvc'] = ''
      amount = self.displayAmount()
      serialObj['customer']['charges_attributes'][0]['amount'] = amount.replace(self.currencySymbol(), "") + "00"
      serialObj

    subscribeToDonationChannel = (channelToken) ->
      pusher = new Pusher(config['pusherpublickey'])

      channel = pusher.subscribe(channelToken)
      channel.bind "charge_completed", (data) ->
        # You can also use data.message
        $('.donation-loading-overlay').hide()
        pusher.disconnect()
        if data.status == "success"
          $("#donation-script").trigger("donations:success")
          if config['redirectto']?
            window.location.replace(config['redirectto'])
          $("#donation-form").hide()
          $(".donations-callback-flash").show(0).delay(8000).hide(0)
        else 
          $(".donation-payment-errors").text(data.message or "Something went wrong.").show()


    stripeResponseHandler = (status, response) ->
      $form = $("#donation-form")
      if response.error
        # Show the errors on the form
        gaDonations('send', 'event', 'advance-button', 'click#with-errors', 'submit', 1)
        $form.find(".donation-payment-errors").text response.error.message
        $form.find("button").prop "disabled", false
        $('.donation-loading-overlay').hide()
      else
        charge = {}

        charge.amount = self.normalizedAmount()
        charge.currency = self.selectedCurrency()

        customer = {}
        customer.first_name = self.firstName()
        customer.last_name = self.lastName()
        customer.email = self.email()
        customer.country = self.countryCode()
        customer.charges_attributes = [charge]

        formPost = {}
        formPost.customer = customer
        formPost.card_token = response.id # from stripe
        formPost.config = config
        formPost.organization_slug = self.org()

        req = $.ajax(
          url: "#{config['pathtoserver']}/charges"
          type: "post"
          dataType: 'json'
          contentType: 'application/json'
          data: JSON.stringify(formPost)
        )
        req.done (response, textStatus, jqXHR) ->
          gaDonations('send', 'event', 'advance-button', 'click#success', 'submit', 1)
          subscribeToDonationChannel(response.pusher_channel_token)
        req.fail (response, textStatus, errorThrown) ->
          gaDonations('send', 'event', 'advance-button', 'click#with-errors', 'submit', 1)
          $form.find(".donation-payment-errors").text(response.responseText or "Something went wrong.").show()
          $('.donation-loading-overlay').hide()
          $form.find("button").prop "disabled", false
        false

    self.submitForm = ->
      gaDonations('send', 'event', 'advance-button', 'click#submit', 'submit', 1)
      $form = $("#donation-form")
      $('.donation-loading-overlay').show()
      # Disable the submit button to prevent repeated clicks
      $form.find("button").prop "disabled", true
      Stripe.createToken $form, stripeResponseHandler
      
      # Prevent the form from submitting with the default action
      false
