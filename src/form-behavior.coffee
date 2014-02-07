(($)->
  $.DonationsInit = (opts) ->
    $("#donation-form").show()

    config = $.extend({}, {
      imgPath: './img/'
    }, opts)

    icons = {
      '#dnt-progress-amount' : 'icon-amount.png',
      '#dnt-progress-myinfo' : 'icon-myinfo.png',
      '#dnt-progress-payment' : 'icon-payment.png',
      '.donation-progress-arrow' : 'icon-arrow.png',
      '.donation-text-field[type="cc-num"]' : 'icon-cc-none.png',
      '.donation-select' : 'icon-dropdown-arrows.png'
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
        unless validField($(field), $(field).attr("type"))
          valid = false
          $(field).addClass("donation-text-field-error")
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
      if validField(thisField, thisField.attr("type"))
        thisField.removeClass("donation-text-field-error")
        thisField.parent().find(".donation-error-label").hide()
        thisField.addClass("donation-text-field-completed")
      else
        thisField.addClass("donation-text-field-error")
        thisField.parent().find(".donation-error-label").show()
        return


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
      updateHeadersUntil(activeIndex)
      nextFS = $(".donation-input-set").eq(activeIndex)
      currentFS = $(".donation-input-set").filter(':visible:first')
      nextFS.show()
      currentFS.hide()
      
    validField = (field, type) ->
      if type == "email"
        re = /[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        return re.test(field.val())
      if type == "cc-num"
        return $.payment.validateCardNumber(field.val())
      if type == "cvc"
        return $.payment.validateCardCVC(field.val())
      if type == "month" or type == "year"
        mo = $(".donation-select[type='month']").val()
        yr = $(".donation-select[type='year']").val()
        return /\d+/.test(mo) and /\d+/.test(yr) and $.payment.validateCardExpiry(mo, yr)
      return !!field.val()

    $('.donation-text-field[type="cc-num"]').payment('formatCardNumber')
    $('.donation-text-field[type="cvc"]').payment('formatCardCVC')
    $('.donation-btn-lg').payment('restrictNumeric');
    $.DonationsConnectToServer(config)
    this

  $.DonationsHide = (opts) ->
    $("#donation-form").hide()
  return
) jQuery
