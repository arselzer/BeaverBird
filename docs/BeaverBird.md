# BeaverBird

## BeaverBird.uid() -> string

Retrieve a unique id.

Warning: the unique string will change as BeaverBird adds more tracking methods.
If the major version (x.0.0) changes, or the minor (0.x.0) changes while the major is
not yet 1, it can be expected that the output is different.

## BeaverBird.match(uid) -> boolean

Check if the user id matches the id of the current user.

## BeaverBird.canvas() -> string

Returns the canvas fingerprint (a crc32 hash)

## BeaverBird.matchCanvas(string) -> boolean

Checks if the canvas fingerprint matches.

## BeaverBird.fonts([]string fonts) -> []string

Returns all fonts from a list
If `fonts` is defined, the default fonts will not be used.

## BeaverBird.matchFonts([]string] input) -> boolean

Checks if the fonts are exactly the same

## BeaverBird.data() -> {
  canvasFingerprint
  fonts
  userAgent
  dnt
  javaEnabled
  lang
}

## BeaverBird.clearCache()

While it is not recommended to access the retrieving functions repeatedly (nor makes it much sense),
this will guard against possible performance issues.
It often makes semantic sense to .match() and then .id() in a real scenario. This makes that use case perform well.

# Planned

## BeaverBird.dataSimilarity(data) -> int (0-1)

Calculate the similarity of the data.
