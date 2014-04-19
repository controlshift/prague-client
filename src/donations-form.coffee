`var donationsForm = {};`
`var $;`

donationsForm.init = (jQuery, opts) ->
  `$ = jQuery;`
  config = $.extend({}, {
    imgpath: 'https://d2yuwrm8xcn0u8.cloudfront.net',
    metaviewporttag: true
  }, opts, donationsForm.parseQueryString(document.URL.split("?")[1]))
  
  metaViewport = """<meta name="viewport" content="width=device-width, initial-scale=1">"""
  if config['metaviewporttag'] == false
    metaViewport = ''

  $('.donations-form-anchor').append ->
    """
    <div class="cleanslate donations-callback-flash">
      Success! You'll receive a notification for your payment. 
    </div>

    #{metaViewport}
    <form class="cleanslate donation-form" id="donation-form" autocomplete="on">
      <div class="donation-loading-overlay"></div>
      <input type="hidden" name="organization_slug" value="#{config['org']}">
      <input type="hidden" name="customer.charges_attributes[0].currency" value="usd">
      <div class="donation-header">
        <div class="donation-header-main-message">
          I'M DONATING
        </div>
        <div class="donation-subheader-amount">
          <span class='donation-currency'>$</span><span class='donation-header-amt'>0</span>
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
          <span class="donation-error-label" id="d-error-label-first">You must choose an amount.</span>
        </span>
        <div class="donation-input-row">
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '1'}" ><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt1'] or 15}</span></div>
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '2'}"><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt2'] or 35}</span></div>
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '3'}"><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt3'] or 50}</span></div>
        </div>
        <div class="donation-input-row">      
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '4'}"><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt4'] or 100}</span></div>
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '5'}"><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt5'] or 250}</span></div>
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '6'}"><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt6'] or 500}</span></div>
        </div>
        <div class="donation-input-row"> 
          <div class="donation-btn donation-btn-sm #{'donation-btn-active' if config['select'] is '7'}"><span class='donation-currency'>$</span><span class='donation-amt'>#{config['amt7'] or 1000}</span></div>
          <input class="donation-btn donation-btn-lg" type="text" placeholder="Other amount">
        </div>
        <div class="donation-next-btn" id="donation-first-next-btn">
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

  bindSelect = (currency) ->
    currOptions = []
    for curr in donationsForm.currenciesArray
      selectThis = if curr == currency then "selected" else ""
      currOptions.push('<option value="',
        curr, '" ', selectThis, ">",
        curr, '</option>')
    $(".donations-currency-select").append(currOptions.join(''))
    $(".donations-currency-select").change ->
      selected = $("option:selected", this)
      updateCurrencyFields(donationsForm.getSymbolFromCurrency(selected.val()), selected.val())
  bindSelect()

  bindButtons = ->
    $('.donation-btn-lg').payment('restrictNumeric')
    $(".donation-btn-sm").click ->
      gaDonations('send', 'event', 'amount', 'click', $(this).text(), 1)
      $(".donation-header-amt").text($(this).find(".donation-amt").text())
      $(".donation-btn-active").removeClass("donation-btn-active")
      $(this).addClass("donation-btn-active")

    $(".donation-btn-lg").change ->
      lgButton = $(this)
      if !!($(this).val())
        gaDonations('send', 'event', 'amount', 'click', $(this).val(), 1)
        $(".donation-btn-active").removeClass("donation-btn-active")
        $(this).addClass("donation-btn-active")
        $(".donation-header-amt").text(lgButton.val())

    $(".donation-next-btn").click ->
      if validateFieldset($(this).parent())
        gaDonations('send', 'event', 'advance-button', 'click#success', $(this).attr('id'), 1)
        currentFS = $(this).parent()
        nextFS = $(this).parent().next()
        $(".donation-progress-header").eq($(".donation-input-set").index(nextFS)).addClass("dph-active");
        nextFS.show()
        currentFS.hide()
      else
        gaDonations('send', 'event', 'advance-button', 'click#with-errors', $(this).attr('id'), 1)

    $(".donation-submit").click ->
      validateFieldset($(this).parent())
  bindButtons()

  updateDonationHeader = ->
    text = $(".donation-btn-active .donation-amt").text()
    $(".donation-header-amt").text(if !!text then text else "0")
  updateCurrencyFields = (symbol, currency, conversionRate) ->
    currency = if currency? then currency else config['currency']
    $("input[name='customer.charges_attributes[0].currency']").val(currency)
    $(".donation-currency").html(symbol)
    $("#input-set-first").html(donationsForm.donationsButtons(config['seedamount'], config['seedvalues'], config['select'], symbol, conversionRate))
    updateDonationHeader()
    bindButtons()
    bindSelect(currency)
  if config['currency']?
    symbol = donationsForm.getSymbolFromCurrency(config['currency'])
    updateCurrencyFields(symbol, config['currency'])
  else
    $.ajax
      type: 'get',
      url: 'https://freegeoip.net/json/',
      dataType: 'jsonp',
      success: (data) ->
        currency = donationsForm.getCurrencyFromCountryCode(data['country_code'])
        symbol = donationsForm.getSymbolFromCurrency(currency)
        updateCurrencyFields(symbol, currency)
        unless config['seedcurrency'] == currency
          updateWithRates = (rates) ->
            rates = if config['rates'] then config['rates'] else rates
            rate = donationsForm.conversionRt(config['seedcurrency'], currency, rates)
            updateCurrencyFields(symbol, currency, rate)
          if config['rates']? or $("#donations-config").attr('defaults')?
            updateWithRates(JSON.parse($("#donations-config").attr('defaults')).rates)
          else
            $("#donation-script").on 'donations:defaultsloaded', (event, dat) ->
              updateWithRates(dat['rates'])
        else
          updateCurrencyFields(symbol, currency)

  $("#donation-form").show()

  form = @

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
    $(k).css('background-image', "url('#{config['imgpath']}/#{v}')")

  validateFieldset = (FS) ->
    valid = true
    if $(".donation-input-set").index(FS) == 0 and FS.find(".donation-btn-active").length == 0
      gaDonations('send', 'event', 'error', 'initiated', 'amount', 1)
      $(".donation-error-label").first().show()
      return false
    else
      $(".donation-error-label").first().hide()
    for field in FS.find(".donation-text-field, .donation-select")
      validText = donationsForm.validField($(field).val(), $(field).attr("type"))
      unless validText == true
        gaDonations('send', 'event', 'error', 'initiated', $(field).attr("name"), 1)
        valid = false
        $(field).addClass("donation-text-field-error")
        $(field).parent().find(".donation-error-label").text(validText)
        $(field).parent().find(".donation-error-label").show()
      else
        $(field).removeClass("donation-text-field-error")
        $(field).parent().find(".donation-error-label").hide()
    valid

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
      ccNumField.css('background-image', "url(#{config['imgpath']}/icon-cc-#{ccType}.png)")

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
      gaDonations('send', 'event', 'advance-button', 'click#with-errors', $(this).attr('id'), 1)
      updateHeadersUntil(activeIndex)
      nextFS.show()
      currentFS.hide()
    else
      gaDonations('send', 'event', 'advance-button', 'click#with-errors', $(this).attr('id'), 1)

  $('.donation-text-field[type="cc-num"]').payment('formatCardNumber')
  $('.donation-text-field[type="cvc"]').payment('formatCardCVC')
  donationsForm.connectToServer(config)

  this

donationsForm.parseQueryString = (q) ->
  hash = {}
  if q isnt `undefined` and q isnt ""
    q = q.split("&")
    i = 0
    while i < q.length
      vars = q[i].split("=")
      hash[vars[0]] = vars[1]
      i++
  return hash

donationsForm.currencies = {
  'US' : 'USD', 'GB' : 'GBP', 'AU' : 'AUD', 'CA' : 'CAN', 'SE' : 'SEK', 'NO' : 'NOK', 'DK' : 'DKK', 'NZ' : 'NZD'
}

donationsForm.currenciesArray = [
  'USD', 'GBP', 'CAN', 'AUD', 'EUR', 'NZD', 'SEK', 'NOK', 'DKK'
]

donationsForm.conversionRt = (currencyFrom, currencyTo, table) ->
  return (1.0/table[currencyTo]) * table[currencyFrom]

donationsForm.donationsButtons = (seedAmount, seedValues, selectNo, symbol, conversionRate = 1) ->
  seedVals = seedValues.split(",")
  section = """ <div class="donations-currency-select-row">
                  Currency: 
                  <select class="donations-currency-select"></select>
                </div>
                <span class="donation-field-label">
                  <span class="donation-error-label" id="d-error-label-first">You must choose an amount.</span>
                </span> """
  section += "<div class='donation-input-row'>"
  counter = 1
  for val in seedVals
    do ->
      amount = (conversionRate*parseFloat(val)*parseFloat(seedAmount)/100.0).toFixed()
      section += """<div class="donation-btn donation-btn-sm #{'donation-btn-active' if selectNo is counter.toString()}" ><span class='donation-currency'>#{symbol}</span><span class='donation-amt'>#{amount}</span></div>"""
      if counter % 3 == 0
        section += "</div><div class='donation-input-row'>"
    counter += 1
  # account for weird spacing issues if length is 5
  if seedVals.length % 5 == 0
    section += "</div><div class='donation-input-row'>"
  section += """<input class="donation-btn donation-btn-lg" type="text" placeholder="Other amount"></div>
    <div class="donation-next-btn" id="donation-first-next-btn">
      <div class="donation-next-btn-header">
        NEXT
      </div>
    </div>"""
  return section

donationsForm.getCurrencyFromCountryCode = (code) ->
  europeanCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES']
  currency = donationsForm.currencies[code]
  return if currency? then currency else (if code in europeanCountries then 'EUR' else 'USD')

donationsForm.getSymbolFromCurrency = (currency) ->
  symbols = {
    'USD' : '$', 'GBP' : '&pound;', 'EUR' : '&euro;', 'NZD' : 'NZ$', 'AUD' : 'AU$', 'CAN' : 'C$'
  }
  return symbols[currency] or currency

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
    stripepublickey: "pk_test_LGrYxpfzI89s9yxXJfKcBB0R",
    pusherpublickey: '331ca3447b91e264a76f',
    pathtoserver: "http://localhost:3000"
  }, opts)

  Stripe.setPublishableKey config['stripepublickey']

  $.fn.serializeObject = ->
    serialObj = form2js(@attr('id'), '.', true)
    amount = if $('.donation-btn-active').text() then $('.donation-btn-active').text() else $('.donation-btn-active').val()
    serialObj['customer']['charges_attributes'][0]['amount'] = amount.replace("$", "") + "00"
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
        donationsForm.hide()
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
      
      # token contains id, last4, and card type
      token = response.id
      
      # Insert the token into the form so it gets submitted to the server
      $form.append $("<input type=\"hidden\" name=\"card_token\" />").val(token)
      
      fullConfig = $.extend(JSON.parse($("#donations-config").attr('defaults')), config)

      req = $.ajax(
        url: "#{config['pathtoserver']}/charges"
        type: "post"
        data: $.extend({}, $("#donation-form").serializeObject(), {'config' :fullConfig})
      )

      req.done (response, textStatus, jqXHR) ->
        gaDonations('send', 'event', 'advance-button', 'click#success', 'submit', 1)
        subscribeToDonationChannel(response.pusher_channel_token)
      req.fail (response, textStatus, errorThrown) ->
        gaDonations('send', 'event', 'advance-button', 'click#with-errors', 'submit', 1)
        $form.find(".donation-payment-errors").text(errorThrown or "Something went wrong.").show()
        $('.donation-loading-overlay').hide()
      false

  $("#donation-form").submit (e) ->
    gaDonations('send', 'event', 'advance-button', 'click#submit', 'submit', 1)
    $form = $(this)
    $('.donation-loading-overlay').show()
    # Disable the submit button to prevent repeated clicks
    $form.find("button").prop "disabled", true
    Stripe.createToken $form, stripeResponseHandler
    
    # Prevent the form from submitting with the default action
    false
