Donation Labs Client
======

This is a jQuery donation webform widget to be used in conjunction with https://github.com/controlshift/prague-server

You can check out a demo [here](http://www.changesprout.com/prague-client/).

## Usage

(Example is in `build/` along with the most recent minified CSS, JS, and icons files.)

Stick this somewhere in your header:

```html
<link href="jquery.donations.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="https://js.stripe.com/v2/"></script>
<script src="http://js.pusher.com/2.1/pusher.min.js" type="text/javascript"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
```

Two things to note: we use Pusher, Stripe, and jQuery for this plugin. Also, the last line you should only need to include if you aren't already using jQuery.

Stick this somewhere in below the `</body>` tag:

```html
<script src="jquery.donations.js"></script>
```

You're all set! To get started, you can call the following to make the form appear:

```javascript
$.DonationsInit();
```

And if you want some behavior to hide it, call this:

```javascript
$.DonationsHide();
```

Lastly, if you want to use our pretty icons, place them somewhere in your image folder. You can pass the path to the images like so when you initialize the form:

```javascript
$.DonationsInit({imgPath: '/path/to/images'});
```

`DonationsInit` will take care of the rest. By default the path is `./img/`.

## Customizations

If you want to apply custom stylings, you can just add another stylesheet below the one we provided and overwrite CSS as you normally would. Custom JS behavior can be added if you want to submit a Github issue so we can take a look at it. 

## Using your own backend server

We've made it pretty easy to use your own copy of our Rails server if you want to go that route. First, you'll have to set up your own Stripe and Pusher account. The default uses our server / credentials by default, but if you want to host your own copy of our server, you pass the following parameters:

```javascript
$.DonationsInit({
  stripePublicKey: "YOUR_STRIPE_PUBLIC_KEY",
  pusherPublicKey: "YOUR_PUSHER_PUBLIC_KEY",
  pathToServer: "http://localhost:3000"
});
```

## Contributing

In order to get started contributing, you must install Grunt and all the necessary libraries.

To install Grunt and everything:

    npm install phantomjs -g
    npm install casperjs -g
    npm install -g grunt
    npm install -g grunt-cli
    npm install

To start the server, compile and minify everything:

```
grunt
```

To just build and compile

```
grunt build
```

To run the unit tests, just open up `SpecRunner.html`. To run the integration tests, you must run

```
grunt build
casperjs test build/features.js
```
