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
        <span class='donation-currency'>$</span><span class='donation-header-amt' data-bind="text: selectedAmount()">0</span>
      </div>
    </div>
    <div class="donation-progress-banner">
      <div class="donation-progress-banner-container">
        <span class="donation-progress-header dph-active" id="dnt-progress-amount">
          Amount
        </span>
        <span class="donation-progress-arrow"></span>
        <span class="donation-progress-header" id="dnt-progress-myinfo">
          My Info
        </span>
        <span class="donation-progress-arrow"></span>
        <span class="donation-progress-header" id="dnt-progress-payment">
          Payment
        </span>
      </div>
    </div>
    <div class="donation-input-set" id="input-set-first">
      <div class="donations-currency-select-row">
        Currency: 
        <select class="donations-currency-select"></select>
      </div>
      <span class="donation-field-label">
        <span class="donation-error-label" id="d-error-label-first" data-bind="visible: selectedAmount.hasError, text: selectedAmount.validationMessage"></span>
      </span>
      <div class="donation-button-set" data-bind="foreach: amounts">
        <div class="donation-btn donation-btn-sm" data-bind="css: { 'donation-btn-active' : $parent.selectedBtn() === $index() }, click: function() { $parent.setActiveAmount($index()); }">
          <span class='donation-currency'>$</span><span class='donation-amt' data-bind="text: amount"></span>
        </div>
        <!-- ko if: $index() === ($parent.amountsLength() - 1) -->
          <input class="donation-btn donation-btn-lg" type="text" placeholder="Other amount">
        <!-- /ko -->
      </div>
      <div class="donation-next-btn" id="donation-first-next-btn" data-bind="click: $root.selectedAmount.validate ">
        <div class="donation-next-btn-header">
          NEXT
        </div>
      </div>
    </div>
    
    <div class="donation-input-set">
      <div class="donation-input-row">
        <span class="donation-field-label">
          First Name*
          <span class="donation-error-label">Can't be blank</span>
        </span>
        
        <input type="text" class="donation-text-field" autocompletetype="given-name" name="customer.first_name">
      </div>
      <div class="donation-input-row">      
        <span class="donation-field-label">
          Last Name*
          <span class="donation-error-label">Can't be blank</span>
        </span>
        
        <input type="text" class="donation-text-field" autocompletetype="family-name" name="customer.last_name">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          Email*
          <span class="donation-error-label">Invalid email format</span>
        </span>
        
        <input type="email" class="donation-text-field" autocompletetype="email" name="customer.email">
      </div>
      <div class="donation-next-btn" id="donation-second-next-btn">
        <div class="donation-next-btn-header">
          NEXT
        </div>
      </div>
    </div>
    
    <div class="donation-input-set">
      <div class="donation-input-row">
        <span class="donation-field-label">
          Card Number*
          <span class="donation-error-label">Invalid number</span>
        </span>
        <input name="cc-num" type="cc-num" class="donation-text-field" autocompletetype="cc-number" data-stripe="number">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          Expiration*
          <span class="donation-error-label">Invalid date</span>
        </span>
        <select name="month" class="donation-select" type="month" data-stripe="exp-month">
        </select>
        <select name="year" class="donation-select" type="year" data-stripe="exp-year">
        </select>
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          CVV/CVC* <a class="what-is-cvv" title="For MasterCard, Visa or Discover, it's the three digits in the signature area on the back of your card. For American Express, it's the four digits on the front of the card.">What is this?</a>
          <span class="donation-error-label">Invalid CVV number</span>
        </span>
        <input name="cvc" type="cvc" class="donation-text-field donation-text-field-sm" autocomplete="off" data-stripe="cvc">
      </div>
      <div class="donation-payment-errors">
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
