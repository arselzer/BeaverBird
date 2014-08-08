# BeaverBird

## BeaverBird.uid() -> string

Retrieve a unique id.

Warning: the unique string will change as BeaverBird adds more tracking methods.
It is recommended to use the direct methods while not stable.

## BeaverBird.match(id) -> boolean

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
  canvasFingerprint: BeaverBird.canvas(),
  fonts: BeaverBird.fonts(),

  userAgent: navigator.userAgent,
  dnt: navigator.doNotTrack,
  javaEnabled: navigator.javaEnabled(),
  lang: navigator.language
}

# Not yet implemented

## BeaverBird.dataSimilarity(data) -> int (0-1)

Calculate the similarity of the data.
