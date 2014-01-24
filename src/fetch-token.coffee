Stripe.setPublishableKey "pk_test_LGrYxpfzI89s9yxXJfKcBB0R"
pusher = new Pusher('331ca3447b91e264a76f')

$.fn.serializeObject = ->
  form2js(@attr('id'), '.', true)

subscribeToDonationChannel = (channelToken) ->
  channel = pusher.subscribe(channelToken)

  channel.bind "my_event", (data) ->
    console.log('success!')


stripeResponseHandler = (status, response) ->
  $form = $("#payment-form")
  if response.error
    
    # Show the errors on the form
    $form.find(".payment-errors").text response.error.message
    $form.find("button").prop "disabled", false
  else
    
    # token contains id, last4, and card type
    token = response.id
    
    # Insert the token into the form so it gets submitted to the server
    $form.append $("<input type=\"hidden\" name=\"card_token\" />").val(token)
    
    req = $.ajax(
      url: "http://localhost:3000/charges"
      type: "post"
      data: $("#payment-form").serializeObject()
    )

    req.done (response, textStatus, jqXHR) ->
      $form.find(".payment-errors").text "Success! Waiting to charge card..."
      console.log(response)
    req.fail (response, textStatus, errorThrown) ->
      $form.find(".payment-errors").text errorThrown

    subscribeToDonationChannel('test_channel')
    false

jQuery ($) ->
  $("#payment-form").submit (e) ->
    $form = $(this)
    
    # Disable the submit button to prevent repeated clicks
    $form.find("button").prop "disabled", true
    Stripe.createToken $form, stripeResponseHandler
    
    # Prevent the form from submitting with the default action
    false

