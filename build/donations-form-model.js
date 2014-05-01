var DonationsFormModel;

DonationsFormModel = (function() {
  function DonationsFormModel() {
    var self;
    self = this;
    self.amounts = ko.observableArray([
      {
        amount: 15
      }, {
        amount: 35
      }, {
        amount: 50
      }, {
        amount: 100
      }, {
        amount: 250
      }, {
        amount: 500
      }, {
        amount: 1000
      }
    ]);
    self.amountsLength = ko.computed(function() {
      return 7;
    });
    self.selectedAmount = ko.observable(null).extend({
      required: "Please select an amount"
    });
    self.selectedBtn = ko.observable(-1);
    self.setActiveAmount = function(index) {
      if (index > -1) {
        self.selectedAmount(self.amounts()[index].amount);
        return self.selectedBtn(index);
      }
    };
    ko.extenders.required = function(target, overrideMessage) {
      var validate;
      validate = function(newValue) {
        target.hasError((newValue ? false : true));
        target.validationMessage((newValue ? "" : overrideMessage || "This field is required"));
      };
      target.validate = validate;
      target.hasError = ko.observable();
      target.validationMessage = ko.observable();
      validate(target());
      target.subscribe(validate);
      return target;
    };
  }

  return DonationsFormModel;

})();
