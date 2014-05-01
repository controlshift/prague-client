class DonationsFormModel
  constructor: () ->
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
    self.amountsLength = ko.computed ->
      7
    self.selectedAmount = ko.observable(null).extend({ required: "Please select an amount"})
    self.selectedBtn = ko.observable(-1)
    self.setActiveAmount = (index) ->
      if index > -1
        self.selectedAmount(self.amounts()[index].amount)
        self.selectedBtn(index)

    ko.extenders.required = (target, overrideMessage) ->
      validate = (newValue) ->
        target.hasError (if newValue then false else true)
        target.validationMessage (if newValue then "" else overrideMessage or "This field is required")
        return
      target.validate = validate
      target.hasError = ko.observable()
      target.validationMessage = ko.observable()
      
      #initial validation
      validate target()
      
      #validate whenever the value changes
      target.subscribe validate
      
      #return the original observable
      target