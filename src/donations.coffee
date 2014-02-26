`var $`

loadExternalScripts = ->
  scriptStrings = ["https://js.stripe.com/v2/","http://js.pusher.com/2.1/pusher.min.js"]
  loadedScripts = 0
  executeMain = ->
    loadedScripts++
    if loadedScripts == scriptStrings.length
      initJQueryPayments(jQuery)
      donationsForm.init($("#donation-script").data())
  for scrString in scriptStrings
    script_tag = document.createElement("script")
    script_tag.setAttribute "type", "text/javascript"
    script_tag.setAttribute "src", scrString
    if script_tag.readyState
      script_tag.onreadystatechange = ->
        executeMain() if @readyState is "complete" or @readyState is "loaded"
        return
    else
      script_tag.onload = executeMain
    (document.getElementsByTagName("head")[0] or document.documentElement).appendChild script_tag

scriptLoadHandler = ->
  `$ = jQuery = window.jQuery.noConflict(true)`
  loadExternalScripts()
  return

if window.jQuery is `undefined` or window.jQuery.fn.jquery isnt "1.9.1"
  script_tag = document.createElement("script")
  script_tag.setAttribute "type", "text/javascript"
  script_tag.setAttribute "src", "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"
  if script_tag.readyState
    script_tag.onreadystatechange = ->
      scriptLoadHandler()  if @readyState is "complete" or @readyState is "loaded"
      return
  else
    script_tag.onload = scriptLoadHandler
  (document.getElementsByTagName("head")[0] or document.documentElement).appendChild script_tag
else
  scriptLoadHandler()

`var donationsForm = {};`

donationsForm.init = (opts) ->
  
  $('body').append ->
    """

    <form class="cleanslate donation-form" id="donation-form" autocomplete="on">
      <div class="donation-loading-overlay"></div>
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
        <button type="submit" class="donation-submit">
          <div class="donation-submit-header">
            SUBMIT
          </div>
        </div>
      </div>
    </form>
    """

  $("#donation-form").show()

  form = @

  config = $.extend({}, {
    imgPath: './img'
  }, opts)

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
    $(k).css('background-image', "url('#{config['imgPath']}/#{v}')")

  validateFieldset = (FS) ->
    valid = true
    if $(".donation-input-set").index(FS) == 0 and FS.find(".donation-btn-active").length == 0
      $(".donation-error-label").first().show()
      return false
    else
      $(".donation-error-label").first().hide()
    for field in FS.find(".donation-text-field, .donation-select")
      validText = donationsForm.validField($(field).val(), $(field).attr("type"))
      unless validText == true
        valid = false
        $(field).addClass("donation-text-field-error")
        $(field).parent().find(".donation-error-label").text(validText)
        $(field).parent().find(".donation-error-label").show()
      else
        $(field).removeClass("donation-text-field-error")
        $(field).parent().find(".donation-error-label").hide()
    valid
    
      
  $(".donation-next-btn").click ->
    if validateFieldset($(this).parent())
      currentFS = $(this).parent()
      nextFS = $(this).parent().next()
      $(".donation-progress-header").eq($(".donation-input-set").index(nextFS)).addClass("dph-active");
      nextFS.show()
      currentFS.hide()

  $(".donation-submit").click ->
    validateFieldset($(this).parent())

  $(".donation-text-field").blur ->
    thisField = $(this)
    validText = donationsForm.validField(thisField.val(), thisField.attr("type"))
    if validText == true
      thisField.removeClass("donation-text-field-error")
      thisField.parent().find(".donation-error-label").hide()
      thisField.addClass("donation-text-field-completed")
    else
      thisField.addClass("donation-text-field-error")
      thisField.parent().find(".donation-error-label").text(validText)
      thisField.parent().find(".donation-error-label").show()
      return

  $(".donation-text-field[type=cc-num]").blur ->
    ccNumField = $(@)
    ccType = $.payment.cardType(ccNumField.val())
    if ccType in ['amex','mastercard','visa','discover','dinersclub']
      ccNumField.css('background-image', "url(#{config['imgPath']}/icon-cc-#{ccType}.png)")

  $(".donation-select[type='month']").html ->
    output = ["<option value='' disabled selected>Month</option>"]
    i = 1
    while i <= 12
      txt = if i > 9 then "#{i}" else "0#{i}"
      output.push("<option value='#{txt}'>#{txt}</option>")
      i++
    return output.join('')

  $(".donation-select[type='year']").html ->
    year = new Date().getFullYear()
    output = ["<option value='' disabled selected>Year</option>"]
    for yr in [year..year+19]
      output.push("<option value='#{yr}'>#{yr}</option>")
    return output

  updateDonationHeader = (amount) ->
    $(".donation-subheader-amount").text("#{amount}")

  $(".donation-btn-sm").click ->
    updateDonationHeader($(this).text())
    $(".donation-btn-active").removeClass("donation-btn-active")
    $(this).addClass("donation-btn-active")

  $(".donation-btn-lg").change ->
    if !!($(this).val())
      $(".donation-btn-active").removeClass("donation-btn-active")
      $(this).addClass("donation-btn-active")
      updateDonationHeader("$#{$(this).val()}")

  updateHeadersUntil = (index) ->
    i = 1
    while i <= index
      $(".donation-progress-header").eq(i).addClass("dph-active")
      i++
    while i <= 2
      $(".donation-progress-header").eq(i).removeClass("dph-active")
      i++


  $(".donation-progress-header").click ->
    activeIndex = $(".donation-progress-header").index($(this))
    nextFS = $(".donation-input-set").eq(activeIndex)
    currentFS = $(".donation-input-set").filter(':visible:first')
    if(validateFieldset(currentFS))
      updateHeadersUntil(activeIndex)
      nextFS.show()
      currentFS.hide()

  $('.donation-text-field[type="cc-num"]').payment('formatCardNumber')
  $('.donation-text-field[type="cvc"]').payment('formatCardCVC')
  $('.donation-btn-lg').payment('restrictNumeric');
  donationsForm.connectToServer(config)

  this

donationsForm.validField = (value, type) ->
  if !value 
    return "Can't be blank"
  if type == "email"
    re = /[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return if re.test(value) then true else "Invalid email format."
  if type == "cc-num"
    return if $.payment.validateCardNumber(value) then true else "Invalid card format."
  if type == "cvc"
    return if $.payment.validateCardCVC(value) then true else "Invalid CVC."
  if type == "month" or type == "year"
    if type == "month"
      yr = $(".donation-select[type='year']").val()
      mo = value
    if type == "year"
      mo = $(".donation-select[type='month']").val()
      yr = value
    unless /^\d+$/.test(mo) and /^\d+$/.test(yr)
      return "Invalid expiry date."
    unless $.payment.validateCardExpiry(mo, yr)
      return "Expiry must be in the future."
    return true
  return true

donationsForm.hide = (opts) ->
  $("#donation-form").hide()

donationsForm.connectToServer = (opts) ->
  config = $.extend({}, {
    stripePublicKey: "pk_test_LGrYxpfzI89s9yxXJfKcBB0R",
    pusherPublicKey: '331ca3447b91e264a76f',
    pathToServer: "http://localhost:3000"
  }, opts)

  Stripe.setPublishableKey config['stripePublicKey']

  $.fn.serializeObject = ->
    serialObj = form2js(@attr('id'), '.', true)
    amount = if $('.donation-btn-active').text() then $('.donation-btn-active').text() else $('.donation-btn-active').val()
    serialObj['customer']['charges_attributes'][0]['amount'] = amount.replace("$", "") + "00"
    serialObj

  subscribeToDonationChannel = (channelToken) ->
    pusher = new Pusher(config['pusherPublicKey'])

    channel = pusher.subscribe(channelToken)

    channel.bind "charge_completed", (data) ->
      alert(data.status)
      alert(data.message)
      $('.donation-loading-overlay').hide()
      pusher.disconnect()


  stripeResponseHandler = (status, response) ->
    $form = $("#donation-form")
    if response.error
      
      # Show the errors on the form
      $form.find(".payment-errors").text response.error.message
      $form.find("button").prop "disabled", false
      $('.donation-loading-overlay').hide()
    else
      
      # token contains id, last4, and card type
      token = response.id
      
      # Insert the token into the form so it gets submitted to the server
      $form.append $("<input type=\"hidden\" name=\"card_token\" />").val(token)
      
      req = $.ajax(
        url: "#{config['pathToServer']}/charges"
        type: "post"
        data: $("#donation-form").serializeObject()
      )

      req.done (response, textStatus, jqXHR) ->
        $form.find(".payment-errors").text "Success! Waiting to charge card..."
        subscribeToDonationChannel(response.pusher_channel_token)
      req.fail (response, textStatus, errorThrown) ->
        $form.find(".payment-errors").text errorThrown
        $('.donation-loading-overlay').hide()
      false

  $("#donation-form").submit (e) ->
    $form = $(this)
    $('.donation-loading-overlay').show()
    # Disable the submit button to prevent repeated clicks
    $form.find("button").prop "disabled", true
    Stripe.createToken $form, stripeResponseHandler
    
    # Prevent the form from submitting with the default action
    false
