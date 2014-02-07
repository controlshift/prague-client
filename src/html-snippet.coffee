$('body').append ->
  """

  <form class="cleanslate donation-form" autocomplete="on">
    <input type="hidden" name="organization_slug" value="org">
    <input type="hidden" name="customer.charges_attributes[0].currency" value="usd">
    <div class="donation-header">
      <div class="donation-header-main-message">
        I'M DONATING
      </div>
      <div class="donation-subheader-amount">
        $0
      </div>
    </div>
    <div class="donation-progress-banner">
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
    <div class="donation-input-set" id="input-set-first">
      <span class="donation-field-label">
        <span class="donation-error-label" id="d-error-label-first">You must choose an amount.</span>
      </span>
      <div class="donation-input-row">
        <div class="donation-btn donation-btn-sm" >$15</div>
        <div class="donation-btn donation-btn-sm">$35</div>
        <div class="donation-btn donation-btn-sm">$50</div>
      </div>
      <div class="donation-input-row">      
        <div class="donation-btn donation-btn-sm">$100</div>
        <div class="donation-btn donation-btn-sm">$250</div>
        <div class="donation-btn donation-btn-sm">$500</div>
      </div>
      <div class="donation-input-row"> 
        <div class="donation-btn donation-btn-sm">$1000</div>
        <input class="donation-btn donation-btn-lg" type="text" placeholder="Other amount">
      </div>
      <div class="donation-next-btn">
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
          <span class="donation-error-label">Invalid</span>
        </span>
        
        <input type="email" class="donation-text-field" autocompletetype="email" name="customer.email">
      </div>
      <div class="donation-next-btn">
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
        <input type="cc-num" class="donation-text-field" autocompletetype="cc-number" data-stripe="number">
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          Expiration*
          <span class="donation-error-label">Invalid</span>
        </span>
        <select class="donation-select" type="month" data-stripe="exp-month">
        </select>
        <select class="donation-select" type="year" data-stripe="exp-year">
        </select>
      </div>
      <div class="donation-input-row"> 
        <span class="donation-field-label">
          Security Code*
          <span class="donation-error-label">Invalid</span>
        </span>
        <input type="cvc" class="donation-text-field donation-text-field-sm" autocomplete="off" data-stripe="cvc">
      </div>
      <button type="submit" class="donation-submit">
        <div class="donation-submit-header">
          SUBMIT
        </div>
      </div>
    </div>
  </form>
  """