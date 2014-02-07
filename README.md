Donation Labs Client
======

This is a jQuery donation webform widget to be used in conjunction with https://github.com/controlshift/prague-server

## Usage

(Example is in `build/` along with the most recent minified CSS, JS, and icons files.)

Stick this somewhere in your header:

    <link href="jquery.donations.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

Two things to note: we use Pusher, Stripe, and jQuery for this plugin. Also, the last line you should only need to include if you aren't already using jQuery.

Stick this somewhere in below the `</body>` tag:

    <script src="jquery.donations.js"></script>

You're all set! To get started, you can call the following to make the form appear:

    $.DonationsInit();

And if you want some behavior to hide it, call this:

    $.DonationsHide();

Lastly, if you want to use our pretty icons, place them somewhere in your image folder. You can pass the path to the images like so when you initialize the form:

    $.DonationsInit('/path/to/images');

`DonationsInit` will take care of the rest. By default the path is `./img/`.

## Customizations

If you want to apply custom stylings, you can just add another stylesheet below the one we provided and overwrite CSS as you normally would. Custom JS behavior can be added if you want to submit a Github issue so we can take a look at it. For the time being, we've made it pretty easy to modify the function `$.DonationsConnectToServer` because by default, it hooks into our web service. If you want to host your own copy of our server, you can modify the function in the following way:

    (($)->
      $.DonationsConnectToServer = ->
        Stripe.setPublishableKey "YOUR_PUBLIC_STRIPE_KEY"
        pusher = new Pusher('YOUR_PUBLIC_PUSHER_KEY')

        # Insert your logic here
    ) jQuery

## Contributing

In order to get started contributing, you must install Grunt and all the necessary libraries.

To install Grunt and everything:

    npm install -g grunt
    npm install -g grunt-cli
    npm install

To start the server, compile and minify everything:

`grunt`
