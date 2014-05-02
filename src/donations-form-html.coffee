html = """
  <div class="cleanslate donations-callback-flash">
    Success! You'll receive a notification for your payment. 
  </div>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <form class="cleanslate donation-form" id="donation-form" autocomplete="on">
    <div class="donation-loading-overlay"></div>
    <input type="hidden" name="organization_slug" value="org">
    <input type="hidden" name="customer.country" value="US">
    <input type="hidden" name="customer.charges_attributes[0].currency" value="usd">
    <div class="donation-header">
      <div class="donation-header-main-message">
        I'M DONATING
      </div>
      <div class="donation-subheader-amount">
        <span class='donation-currency' data-bind="html: currencySymbol">$</span><span class='donation-header-amt' data-bind="text: selectedAmount()">0</span>
      </div>
    </div>
    <div class="donation-progress-banner">
      <div class="donation-progress-banner-container">
        <span class="donation-progress-header" id="dnt-progress-amount" data-bind="css: { 'dph-active' : visibleInputSet() >= 0}, click: function() { setInputSet(0); }">
          Amount
        </span>
        <span class="donation-progress-arrow"></span>
        <span class="donation-progress-header" id="dnt-progress-myinfo" data-bind="css: { 'dph-active' : visibleInputSet() >= 1}, click: function() { setInputSet(1); }">
          My Info
        </span>
        <span class="donation-progress-arrow"></span>
        <span class="donation-progress-header" id="dnt-progress-payment" data-bind="css: { 'dph-active' : visibleInputSet() >= 2}, click: function() { setInputSet(2); }">
          Payment
        </span>
      </div>
    </div>
    <div class="donation-input-set" id="input-set-first" data-bind="visible: visibleInputSet() === 0">
      <div class="donations-currency-select-row">
        Currency: 
        <select class="donations-currency-select" data-bind="options: currenciesArray, value: selectedCurrency"></select>
      </div>
      <span class="donation-field-label">
        <span class="donation-error-label" id="d-error-label-first" data-bind="validationMessage: selectedAmount"></span>
      </span>
      <div class="donation-button-set" data-bind="foreach: amounts">
        <div class="donation-btn donation-btn-sm" data-bind="css: { 'donation-btn-active' : $parent.selectedBtn() === $index() }, click: function() { $parent.setActiveAmount($index()); }">
          <span class='donation-currency' data-bind="html: $parent.currencySymbol">$</span><span class='donation-amt' data-bind="text: amount"></span>
        </div>
        <!-- ko if: $index() === ($parent.amountsLength() - 1) -->
          <input class="donation-btn donation-btn-lg" data-bind="value: $parent.selectedAmount" type="text" placeholder="Other amount">
        <!-- /ko -->
      </div>
      <div class="donation-next-btn" id="donation-first-next-btn" data-bind="click: function()
          { 
            if(inputSet1.isValid()) { incrementInputSet(); } 
            else { inputSet1.errors.showAllMessages();}
          }">
        <div class="donation-next-btn-header">
          NEXT
        </div>
      </div>
    </div>
    
    <div class="donation-input-set" data-bind="visible: visibleInputSet() === 1">
      <div class="donation-input-row">
        <span class="donation-field-label">
          First Name*
          <span class="donation-error-label" data-bind="validationMessage: firstName">Can't be blank</span>
        </span>
        
        <input type="text" class="donation-text-field" autocompletetype="given-name" name="customer.first_name" data-bind="value: firstName">
      </div>
      <div class="donation-input-row">      
        <span class="donation-field-label">
          Last Name*
          <span class="donation-error-label" data-bind="validationMessage: lastName">Can't be blank</span>
        </span>
        
        <input type="text" class="donation-text-field" autocompletetype="family-name" name="customer.last_name" data-bind="value: lastName">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          Email*
          <span class="donation-error-label" data-bind="validationMessage: email">Invalid email format</span>
        </span>
        
        <input type="email" class="donation-text-field" autocompletetype="email" name="customer.email" data-bind="value: email">
      </div>
      <div class="donation-next-btn" id="donation-second-next-btn" data-bind="click: function()
          { 
            if(inputSet2.isValid()) { incrementInputSet(); } 
            else { inputSet2.errors.showAllMessages();}
          }">
        <div class="donation-next-btn-header">
          NEXT
        </div>
      </div>
    </div>
    
    <div class="donation-input-set" data-bind="visible: visibleInputSet() === 2">
      <div class="donation-input-row">
        <span class="donation-field-label">
          Card Number*
          <span class="donation-error-label" data-bind="validationMessage: cardNumber"  data-bind="validationMessage: cardDate">Invalid number</span>
        </span>
        <input name="cc-num" type="cc-num" class="donation-text-field" autocompletetype="cc-number" data-stripe="number" data-bind="value: cardNumber">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          Expiration*
          <span class="donation-error-label" data-bind="validationMessage: cardDate">Invalid date</span>
        </span>
        <select name="month" class="donation-select" type="month" data-stripe="exp-month" data-bind="value: cardMonth, options: ccMonths">
        </select>
        <select name="year" class="donation-select" type="year" data-stripe="exp-year" data-bind="value: cardYear, options: ccYears">
        </select>
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          CVV/CVC* <a class="what-is-cvv" title="For MasterCard, Visa or Discover, it's the three digits in the signature area on the back of your card. For American Express, it's the four digits on the front of the card.">What is this?</a>
          <span class="donation-error-label" data-bind="validationMessage: cvc">Invalid CVV number</span>
        </span>
        <input name="cvc" type="cvc" class="donation-text-field donation-text-field-sm" autocomplete="off" data-stripe="cvc" data-bind="value: cvc">
      </div>
      <div class="donation-payment-errors" data-bind="visible: false">
        Something went wrong.
      </div>
      <button type="submit" class="donation-submit">
        <div class="donation-submit-header">
          SUBMIT
        </div>
      </div>
    </div>
  </form>
  """
