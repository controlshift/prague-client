class DonationsFormModel
  constructor: () ->
    ko.validation.configure({
        insertMessages: false
    });
    self = @
    self.amounts = ko.observableArray [
      { amount: 15 },
      { amount: 35 },
      { amount: 50 },
      { amount: 100 },
      { amount: 250 },
      { amount: 500 },
      { amount: 1000 }
    ]
    self.currencies = {
      'US' : 'USD', 'GB' : 'GBP', 'AU' : 'AUD', 'CA' : 'CAN', 'SE' : 'SEK', 'NO' : 'NOK', 'DK' : 'DKK', 'NZ' : 'NZD'
    }

    self.currenciesArray = ko.observableArray [
      'USD', 'GBP', 'CAN', 'AUD', 'EUR', 'NZD', 'SEK', 'NOK', 'DKK'
    ]
    self.selectedCurrency = ko.observable('USD')
    self.currencySymbol = ko.computed(->
      symbols = {
        'USD' : '$', 'GBP' : '&pound;', 'EUR' : '&euro;', 'NZD' : 'NZ$', 'AUD' : 'AU$', 'CAN' : 'C$'
      }
      return symbols[self.selectedCurrency()] or self.selectedCurrency()
    , this)

    self.amountsLength = ko.computed ->
      7
    self.selectedBtn = ko.observable(-1)
    self.setActiveAmount = (index, amount) ->
      if index == self.amountsLength()
        self.selectedBtn(-1)
      else if index > -1
        self.selectedAmount(self.amounts()[index].amount)
        self.selectedBtn(index)

    self.selectedAmount = ko.observable().extend({ required: { message: "Please select an amount" } })
    
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
    self.cardNumber = ko.observable().extend({ required: { message: "Can't be blank" } })
    self.cardDate = ko.observable().extend({ required: { message: "Can't be blank" } })
    self.cvc = ko.observable().extend({ required: { message: "Can't be blank" }, digit: true })

    self.inputSet1 = ko.validatedObservable({ amount: self.selectedAmount })
    self.inputSet2 = ko.validatedObservable({ firstName: self.firstName, lastName: self.lastName, email: self.email})
    self.inputSet3 = ko.validatedObservable({ cardNumber: self.cardNumber, cardDate: self.cardDate, cvc: self.cvc})
