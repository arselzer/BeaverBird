# BeaverBird

## BeaverBird.uid()

Retrieve a unique id.

Warning: the unique string will change as BeaverBird adds more tracking methods.
If the major version (x.0.0) changes, or the minor (0.x.0) changes while the major is
not yet 1, it can be expected that the output is different.

## BeaverBird.match(uid) -> boolean

Check if the user id matches the id of the current user.

## BeaverBird.screen()

Returns data of the computer's screen.

`{width, height, colorDepth, pixelDepth}`

## BeaverBird.browser()

`{userAgent, cookies, java, dnt, lang}`

## BeaverBird.plugins()

Get a list of browser plugins.
Returns a map of name -> Plugin

## BeaverBird.pluginNames()

Get a list of only the plugin names.

## BeaverBird.canvas()

Returns the canvas fingerprint (a crc32 hash, string)

## BeaverBird.matchCanvas(canvas) -> boolean

Checks if the canvas fingerprint matches the current client's.

## BeaverBird.fonts(overrideFonts[])

If `fonts` is defined, the default fonts will not be used,
otherwise, the default list of fonts will be used.

## BeaverBird.matchFonts(fonts[]) -> boolean

Checks if the lists of fonts are exactly the same

## BeaverBird.data()
returns a list of all tracking data that could be extracted.
```
{
  canvasFingerprint
  fonts
  browser
  plugins
  screen
  webgl:
}
```

## BeaverBird.clearCache()

While it is not recommended to access the retrieving functions repeatedly (nor makes it much sense),
this will guard against possible performance issues.
It often makes semantic sense to .match() and then .id() in a real scenario. This makes that use case perform well.
