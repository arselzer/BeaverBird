Beaverbird
========

![Always there, tracking you](https://raw.githubusercontent.com/AlexanderSelzer/beaverbird/master/beaverbird.png)

There is no more such thing as untracked behaviour on the web.

BeaverBird takes a step to simplify the techniques that would otherwise be reimplemented again and again
in private by some big companies desperately needing "insight into their customers' interactions with their sites (and others)".

## Examples

```JavaScript
// Get a unique user id
var uid = BeaverBird.uid()

// Get all data that could be extracted by BeaverBird
var data = BeaverBird.data()

// Collect canvas fingerprints
var canvasFingerprint = BeaverBird.canvas()

// Get a list of installed fonts
var fonts = BeaverBird.fonts()
console.log(fonts.indexOf("Arial") !== -1)

// List all browser plugins
var browserPlugins = BeaverBird.plugins()
var hasiPhoto = (plugins.indexOf("iPhotoPhotocast") !== -1)

// Use WebGL information
var webGlStuff = BeaverBird.webgl()

```

## Getting BeaverBird

There are three ways of using BeaverBird. If unsure, just choose the first.

1. Download [the latest release](https://github.com/AlexanderSelzer/BeaverBird/releases)

2. Install from npm: `npm install --save beaverbird`

3. Install with bower: `bower install --save beaverbird`


Include it in a `<script>` tag or use Browserify to `require("beaverbird")`.

## Full Documentation

See [here](https://github.com/AlexanderSelzer/BeaverBird/blob/master/docs/BeaverBird.md)

## Todo List
#### Contributions are encouraged!

* releasing version 1.0 soon, guaranteeing a stable API
* Improvements in Windows-specific tracking (ActiveX, Silverlight?, plugins, fonts...)
* Achieving a higher degree of accuracy on mobile devices (especially iOS), if possible

* Implementing WebCL tracking if useful
* Gathering information using flash / finding a good way to embed and build the swf file
* Implementing statistical ways for finding browser uniqueness

## Information about tracking

* canvas tracking: http://cseweb.ucsd.edu/~hovav/dist/canvas.pdf
* many different tracking techniques: http://www.browserleaks.com/
* Font detection described: http://www.lalit.org/lab/javascript-css-font-detect/
* Some ideas worth implementing: http://browserspy.dk/
* Interesting statistical methods: https://panopticlick.eff.org/browser-uniqueness.pdf
* https://www.eff.org/deeplinks/2010/01/primer-information-theory-and-privacy

### Other Useful documents

* WebRTC: http://dev.w3.org/2011/webrtc/editor/getusermedia.html#mediastreamtrack
* WebGL: https://www.khronos.org/registry/webgl/specs/1.0/
