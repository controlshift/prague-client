Donation Labs Client
======

[Travis Status](https://travis-ci.org/controlshift/prague-client.svg?branch=master)

This is a jQuery donation webform widget to be used in conjunction with https://github.com/controlshift/prague-server

You can check out a demo [here](http://www.changesprout.com/prague-client/).

## Usage

Two things to note: we use Pusher, Stripe, and jQuery for this plugin. Also, you can either download the images and host them directly (they live in build/) or specify the path to the images as is shown below, fetching them externally. This is easier but also slower for your users.

First things first, stick this tag wherever you want the form on the page.

```html
<div class="donations-form-anchor"></div>
```

Stick this somewhere in below the `</body>` tag:

```html
<script src="https://s3.amazonaws.com/prague-production/jquery.donations.loader.js" id="donation-script" data-org="org-from-server" data-pathtoserver="https://www.donatelab.com" data-stripepublickey="pk_live_TkBE6KKwIBdNjc3jocHvhyNx"></script>
```

It is recommended that you store and host the images locally for performance. If you need to change the path where your images are stored, you can pass options like so:

```html
<script src="https://s3.amazonaws.com/prague-production/jquery.donations.loader.js" id="donation-script" data-imgpath="./img" data-pathtoserver="https://www.donatelab.com" data-stripepublickey="pk_live_TkBE6KKwIBdNjc3jocHvhyNx"></script>
```

By default the path is `./img`.

## Mobile

We use [media queries](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries) to optimize for mobile. Basically what happens is if your screen size is between 200px and 480px, the form shrinks down to a smaller version of itself. The widget expands to 100% of its parent element's size, with the expectation that the form will fill up the entire page. It may be important to note that we add this meta tag into the DOM to get mobile to work correctly:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

This makes sure that the web page is loaded with the width and height of the device, which is common of almost every responsive web page. If you prefer not to have this tag, specify `data-metaviewport="false"` in the script tag. 

## Customizations

If you want to apply custom stylings, you can just add another stylesheet below the one we provided and overwrite CSS as you normally would. Custom JS behavior can be added if you want to submit a Github issue so we can take a look at it. 

## Using your own backend server

We've made it pretty easy to use your own copy of our Rails server if you want to go that route. First, you'll have to set up your own Stripe and Pusher account. The default uses our server / credentials by default, but if you want to host your own copy of our server, you pass the following parameters:

```html
<script src="https://s3.amazonaws.com/prague-production/jquery.donations.loader.js" id="donation-script"
  data-stripepublickey="YOUR_STRIPE_KEY"
  data-pusherpublickey="YOUR_PUSHER_KEY"
  data-pathtoserver="http://localhost:3000"></script>
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
casperjs test build/features.js --verbose
```
