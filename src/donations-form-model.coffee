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
    self.seededCurrency = config['seedcurrency'] or 'USD'

    initializeCurrency = ->
      if config['currencyconversion'] == "detect"
        return self.currencies[config['country']]
      else
        return self.seededCurrency

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
        baseAmount = Math.floor(parseInt(entry) / 100.0 * parseInt(self.seedAmount))
        if count < 7 # limit 7 buttons
          if config['currencyconversion'] in ["detect", "choose"]
            conversionRateToCurrency = config[self.selectedCurrency()] or 1
            conversionRateFromCurrency = config[self.seededCurrency] or 1
            arr.push(Math.floor(baseAmount * conversionRateToCurrency / conversionRateFromCurrency))
          else
            arr.push(baseAmount)
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
