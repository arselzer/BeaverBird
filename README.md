Beaverbird
========

![Always there, tracking you](https://raw.githubusercontent.com/AlexanderSelzer/beaverbird/master/beaverbird.png)

There is no more such thing as untracked behaviour on the web.

BeaverBird takes a step to simplify the techniques that would otherwise be reimplemented again and again
in private by some big companies desperately needing "insight into their customers' interactions with their sites (and others)".

## Usage

```JavaScript
/* Get a unique id to recognize the user next time. */
var uid = BeaverBird.uid()

// e77c2b954e31a63d14be9d0f9aa226a6

/* Get an object of all data extracted by BeaverBird */
var data = BeaverBird.data()

/* {
  "canvasFingerprint": 1054387288,
  "fonts": [
    "Adobe Hebrew",
    "Apple LiGothic",
    "Arial",
    "Avenir",
    "Avenir Next",
    "Batang",
    "Bell MT",
    "Birch Std",
    "Calibri",
    "Cambria",
    "Century",
    "Century Gothic",
    "Comic Neue",
    "Comic Sans MS",
    "Corsiva Hebrew",
    "Courier",
    "Courier New",
    "Damascus",
    "Fantasque Sans Mono",
    "Futura",
    "Geneva",
    "Helvetica",
    "Helvetica Neue",
    "Lato",
    "Microsoft Sans Serif",
    "Minion Pro",
    "Monaco",
    "Open Sans",
    "TI-Nspire",
    "Times",
    "Times New Roman"
  ],
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
  "dnt": null,
  "javaEnabled": true,
  "lang": "de"
}
*/

/* Verify the user id */
BeaverBird.match("e77c2b954e31a63d14be9d0f9aa226a6")
// true
```

## Getting BeaverBird

Download [the latest release](https://github.com/AlexanderSelzer/BeaverBird/releases).

Install from npm: `npm install --save beaverbird`

Include in a <script> tag or use Browserify.

## Full Documentation

See [here](https://github.com/AlexanderSelzer/BeaverBird/blob/master/docs/BeaverBird.md)

## Information

* Great description of canvas tracking: http://cseweb.ucsd.edu/~hovav/dist/canvas.pdf
* A site listing many different tracking techniques: http://www.browserleaks.com/
* Font detection: http://www.lalit.org/lab/javascript-css-font-detect/
