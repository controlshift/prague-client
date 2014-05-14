Donation Labs Client
======

[![Build Status](https://travis-ci.org/controlshift/prague-client.svg?branch=master)](https://travis-ci.org/controlshift/prague-client)

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

## Parameters

There are two ways to pass parameters. One way is by putting a parameter in the script tag as shown above. You must prefix the parameter name with `data-`. For example:

```html
<script src="" ... data-optionname="example"></script>
```

The other way is to pass parameters via URL query string. You do NOT need to prefix the parameter name in this case. However, you need to properly format the query string, by starting with a `?` and separating each parameter with an `&`, as per convention. For example:

```
https://mynonprofit.org/?optionname=foo&optionname2=bar
```

The parameters supplied in the query string will be overwritten by those in the script tag. We did this mostly for safety.

The options as of right now are:

`imgpath`: A path to where your images live. Recommended to download these and add them to your server.

`pathtoserver`: A path to where the server lives. We recommend to use ours, but if you want your own the link to the server's source code is available above.

`amt1`, `amt2`, `amt3`, `amt4`, `amt5`, `amt6`, `amt7`: Specifies amount of the corresponding button -- we give a default value. Use numeric values with no currency symbols.

`select`: Specifies which button should be selected by default (if none, don't use this parameter). Valid options are 1, 2, 3, 4, 5, 6, or 7.

`metaviewport`: Specifies whether the `metaviewport` tag should or should not be added. Set this to `"false"` (or `false` if using query strings) if this should not be used. 

`stripepublickey`: Pretty self-explanatory, only use if you are hosting your own server.

`pusherpublickey`: Again, only use if you are hosting your own server.

## Callbacks

For the time being there is only one callback -- the success callback, after a user has successfully been charged. You can capture this like so:

```javascript
$(".donations-form-anchor").on("donations:success", function() { ... });
```

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
