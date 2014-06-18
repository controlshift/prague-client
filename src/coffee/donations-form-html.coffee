html = """
  <div class="cleanslate donations-callback-flash">
    {{success_notification}}
  </div>

  <form class="cleanslate donation-form" id="donation-form" autocomplete="on">
    <div class="donation-loading-overlay"></div>
    <input type="hidden" name="organization_slug" data-bind="value: org">
    <input type="hidden" name="customer.country" data-bind="value: countryCode">
    <input type="hidden" name="customer.charges_attributes[0].currency" data-bind="value: selectedCurrency">
    <div class="donation-header">
      <div class="donation-header-main-message">
        {{im_donating}}
      </div>
      <div class="donation-subheader-amount">
        <span class='donation-currency' data-bind="html: currencySymbol">$</span><span class='donation-header-amt' data-bind="text: displayAmount()">0</span>
      </div>
    </div>
    <div class="donation-progress-banner">
      <div class="donation-progress-banner-container">
        <span class="donation-progress-header" id="dnt-progress-amount" data-bind="css: { 'dph-active' : visibleInputSet() >= 0}, click: function() { setInputSet(0); }">
          {{amount}}
        </span>
        <span class="donation-progress-arrow"></span>
        <span class="donation-progress-header" id="dnt-progress-myinfo" data-bind="css: { 'dph-active' : visibleInputSet() >= 1}, click: function() { setInputSet(1); }">
          {{my_info}}
        </span>
        <span class="donation-progress-arrow"></span>
        <span class="donation-progress-header" id="dnt-progress-payment" data-bind="css: { 'dph-active' : visibleInputSet() >= 2}, click: function() { setInputSet(2); }">
          {{payment}}
        </span>
      </div>
    </div>
    <div class="donation-input-set" id="input-set-first" data-bind="visible: visibleInputSet() === 0">
      <div class="donations-currency-select-row" data-bind="visible: currenciesEnabled()">
        {{currency}}
        <select class="currency-select" id="donations-currency-select" data-bind="options: currenciesArray, value: selectedCurrency"></select>
      </div>
      <span class="donation-field-label">
        <span class="donation-error-label" id="d-error-label-first" data-bind="validationMessage: displayAmount"></span>
      </span>
      <div class="donation-button-set" data-bind="foreach: amounts">
        <div class="donation-btn donation-btn-sm" data-bind="css: { 'donation-btn-active' : $parent.selectedBtn() === $index() }, click: function() { $parent.setActiveAmount($index()); }">
          <span class='donation-currency' data-bind="html: $parent.currencySymbol">$</span><span class='donation-amt' data-bind="text: $data"></span>
        </div>
        <!-- ko if: $index() === ($parent.amountsLength() - 1) -->
          <input class="donation-btn donation-btn-lg" data-bind="value: $parent.inputtedAmount, event: { change: $parent.clearSelectedButton } " type="text" placeholder="Other amount">
        <!-- /ko -->
      </div>
      <div class="donation-next-btn" id="donation-first-next-btn" data-bind="click: function()
          { 
            if(inputSet1.isValid()) { incrementInputSet(); } 
            else { inputSet1.errors.showAllMessages();}
          }">
        <div class="donation-next-btn-header">
          {{next}}
        </div>
      </div>
    </div>
    
    <div class="donation-input-set" data-bind="visible: visibleInputSet() === 1">
      <div class="donation-input-row">
        <span class="donation-field-label">
          {{first_name}}*
          <span class="donation-error-label" data-bind="validationMessage: firstName"></span>
        </span>
        
        <input type="text" class="donation-text-field" autocompletetype="given-name" name="customer.first_name" data-bind="value: firstName">
      </div>
      <div class="donation-input-row">      
        <span class="donation-field-label">
          {{last_name}}*
          <span class="donation-error-label" data-bind="validationMessage: lastName"></span>
        </span>
        
        <input type="text" class="donation-text-field" autocompletetype="family-name" name="customer.last_name" data-bind="value: lastName">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          {{email}}*
          <span class="donation-error-label" data-bind="validationMessage: email"></span>
        </span>
        
        <input type="email" class="donation-text-field" autocompletetype="email" name="customer.email" data-bind="value: email">
      </div>
      <div class="donation-next-btn" id="donation-second-next-btn" data-bind="click: function()
          { 
            if(inputSet2.isValid()) { incrementInputSet(); } 
            else { inputSet2.errors.showAllMessages();}
          }">
        <div class="donation-next-btn-header">
          {{next}}
        </div>
      </div>
    </div>
    
    <div class="donation-input-set" data-bind="visible: visibleInputSet() === 2">
      <div class="donation-input-row">
        <span class="donation-field-label">
          {{card_number}}*
          <span class="donation-error-label" data-bind="validationMessage: cardNumber" data-bind="validationMessage: cardDate"></span>
        </span>
        <input name="cc-num" type="tel" id="cc-num-input" class="donation-text-field" autocompletetype="cc-number" data-stripe="number" data-bind="value: cardNumber, event: {keydown: calcCardType}, style: { backgroundImage: ccBackground() } ">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          {{expiration}}*
          <span class="donation-error-label" data-bind="validationMessage: cardDate"></span>
        </span>
        <select name="month" class="donation-select" type="month" data-stripe="exp-month" data-bind="value: cardMonth, options: ccMonths">
        </select>
        <select name="year" class="donation-select" type="year" data-stripe="exp-year" data-bind="value: cardYear, options: ccYears">
        </select>
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          {{cvv}}* <a class="what-is-cvv" title="{{cvv_explanation}}">{{what_is_this}}</a>
          <span class="donation-error-label" data-bind="validationMessage: cvc"></span>
        </span>
        <input name="cvc" type="tel" id="cvc-num-input" class="donation-text-field donation-text-field-sm" autocomplete="off" data-stripe="cvc" data-bind="value: cvc">
      </div>
      <div class="donation-payment-errors" data-bind="visible: !!stripeMessage(), text: stripeMessage()">
        {{failure_notification}}
      </div>
      <button type="submit" class="donation-submit" data-bind="click: function()
          { 
            if(inputSet3.isValid()) { submitForm(); } 
            else { inputSet3.errors.showAllMessages();}
          }">
        <div class="donation-submit-header">
          {{donate}}
        </div>
      </div>
    </div>
  </form>
  """
