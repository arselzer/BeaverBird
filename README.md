Beaverbird
========

![Always there, tracking you](https://raw.githubusercontent.com/AlexanderSelzer/beaverbird/master/beaverbird.png)

There is no more such thing as untracked behaviour on the web.

BeaverBird takes a step to simplify the techniques that would otherwise be reimplemented again and again
in private by some big companies desperately needing "insight into their customers' interactions with their sites (and others)".

## Simple Usage

```JavaScript
var uid = BeaverBird.uid()

/*
  Send the unique user id to your servers in order to follow
  the user and make the world a better place by analyzing their
  behaviour. :D
*/

var isTheSameUser = BeaverBird.match(uid)
```

## Advanced Usage

```JavaScript

/*
  Don't trust beaverbird to correctly generate a unique tracking id
  for your mission-critical tracking system.
  No problem.
  Get the raw data.
*/

var userData = BeaverBird.allData();

/*
  Want to directly access some useful data, such as the font collection
  of the user?
*/

var fonts = BeaverBird.fonts();
```

## Full Documentation

See [here](https://github.com/AlexanderSelzer/BeaverBird/blob/master/docs/BeaverBird.md)

## Information

* Great description of canvas tracking: http://cseweb.ucsd.edu/~hovav/dist/canvas.pdf
* A site listing many different tracking techniques: http://www.browserleaks.com/
* Font detection: http://www.lalit.org/lab/javascript-css-font-detect/
