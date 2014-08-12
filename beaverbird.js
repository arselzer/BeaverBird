(function() {
var BeaverBird = {}

BeaverBird.DEBUG = false;
// the speed is fine in all browsers, except Safari, where it is quite slow (~30x slower), but the cache should fix this.
BeaverBird.cache = {};

BeaverBird.clearCache = function() {
  this.cache = {}
}

/* UIDs */

BeaverBird.uid = function() {
  var data = this.data()
  return MD5(data.canvasFingerprint
  + ":" + MD5(data.fonts.join(":"))
  + ":" + JSON.stringify(data.screen)
  + ":" + JSON.stringify(data.browser)
  + ":" + JSON.stringify(data.webgl)
  + ":" + JSON.stringify(BeaverBird.pluginNames()))
}

BeaverBird.match = function(uid) {
  return BeaverBird.uid() === uid;
}

/* All Data */

BeaverBird.data = function() {
  return {
    canvasFingerprint: BeaverBird.canvas(),
    fonts: BeaverBird.fonts(),
    browser: BeaverBird.browser(),
    plugins: BeaverBird.pluginNames(),
    screen: BeaverBird.screen(),
    webgl: BeaverBird.webgl()
  }
}

/* Low-hanging data */

BeaverBird.screen = function() {
  return {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth
  }
}

BeaverBird.browser = function() {
  return {
    userAgent: navigator.userAgent,
    cookies: navigator.cookieEnabled,
    java: navigator.javaEnabled(),
    dnt: navigator.doNotTrack, // might be null, "unspecified", undefined if false
    lang: navigator.language
  }
}

/* Plugins */

/**
  I would *love* to add more to this list ;)
  `for (var i = 0; i < navigator.plugins.length; i++) { console.log(navigator.plugins[i].name) }`
  and email/pull-request/whatever the missing ones. I will happily add more to the list and thank you.

  Windows stuff and mobile would be especially useful
*/

BeaverBird.PLUGINS = [
  "Google Talk Plugin Video Renderer",
  "Google Talk Plugin",
  "Java Applet Plug-in",
  "QuickTime Plug-in 7.7.3", // it could be better to leave versioned stuff out... not sure.
  "Default Browser Helper",
  "Shockwave Flash",
  "AdobeAAMDetect",
  "AdobeExManDetect",
  "iPhotoPhotocast",
  "SharePoint Browser Plug-in",
  "Google Earth Plug-in",
  "RealPlayer Plugin.plugin",
  "DivX Web Player",
  "Wacom Pressure Plug-In",
  "Microsoft Office Live Plug-in",
  "Widevine Content Decryption Module", // bah, DRM
  "Chrome Remote Desktop Viewer",
  "Chrome PDF Viewer",
  "Native Client",
  "Google Talk Plugin Video Renderer",
  "Unity Player",
  "Default Browser Helper",
  "Silverlight Plug-In",
  "Wacom Tablet Plug-In",
  "WebKit-integrierte PDF"
]

BeaverBird.plugins = function() {
  if (!navigator.plugins)
    return null
  /*
    Firefox and possibly more browsers disallow
    iterating the PluginArray, so we need to directly
    query plugins. Doing that is fast, so we can try a
    whole lot of plugins :D
  */
  var plugins = []

  this.PLUGINS.forEach(function(plugin) {
    var p = navigator.plugins[plugin]
    if (p !== undefined) {
      plugins[plugin] = p
    }
  })

  return plugins.sort()
}

// The plugin array is quite large and might take up much memory.
// Besides, it is probably not needed that often. Just the names are enough
// in most cases

BeaverBird.pluginNames = function() {
  if (!navigator.plugins)
    return null

  return this.PLUGINS.filter(function(plugin) {
    if (navigator.plugins[plugin] !== undefined) {
      return true
    }
    return false
  })
}

/* Canvas Tracking */

BeaverBird.canvas = function() {
  if (BeaverBird.cache.canvas !== undefined) {
    return BeaverBird.cache.canvas;
  }

  var canvas = document.createElement("canvas")
  canvas.width = 280
  canvas.height = 60

  if (!this.DEBUG)
    canvas.style.display = "none"

  canvas.id = "beaver-bird-canvas"
  document.body.appendChild(canvas)

  var c = canvas.getContext("2d")
  var text = "BeaverBird is watching you"

  c.fillStyle = "rgb(178, 214, 232)"
  c.fillRect(10, 20, 60, 80)

  c.fillStyle = "#111"
  c.font = "16pt Arial"
  c.fillText(text, 2, 40)

  c.strokeStyle = "rgb(120, 186, 176)"
  c.arc(80, 10, 20, 0, Math.PI)
  c.stroke()

  var imageData = c.getImageData(0, 0, 280, 60)

  if (!this.DEBUG)
    document.body.removeChild(canvas)

  // the md5 implementation is very slow in safari, so crc32 is used. crc is safe to use too.
  var result = crc32(imageData.data).toString()
  BeaverBird.cache.canvas = result

  return result
}

BeaverBird.matchCanvas = function(string) {
  return string === BeaverBird.canvas()
}

/* Font detection */

BeaverBird.fonts = function(customFonts) {
  if (this.cache.fonts !== undefined) {
    return this.cache.fonts
  }

  var fonts = [
    "Arial", "Times New Roman", "Helvetica", "Open Sans",
    "Source Sans Pro", "Comic Sans MS", "Century", "Century Gothic",
    "Monaco", "Lato", "Geneva", "Futura",
    "Fantasque Sans Mono", "Courier", "Courier New", "Corsiva Hebrew",
    "Comic Neue", "Cambria", "Calibri", "TI-Nspire",
    "Adobe Braille", "Adobe Hebrew", "Apple LiGothic", "Apple Farben-Emoji",
    "Avenir", "Avenir Next", "Batang", "Bell MT", "Birch Std",
    "Damascus", "Microsoft Sans Serif", "Minion Pro", "Times",
    "Roboto", "Oswald", "Droid Sans", "Droid Serif",
    "Roboto Condensed", "Ubuntu", "Raleway", "Lobster",
    "Ubuntu Condensed", "Helvetica Neue"
  ]

  if (typeof customFonts !== "undefined") {
    fonts = customFonts
  }

  var STRING = "wwzrllTNMLllllliiimmqßmmmmiiill❗️🔻llplö😄©_~ñ"

  // Set up default font information

  var defaults = [
    {name: "serif"},
    {name:"sans-serif"},
    {name:"monospace"}
  ]

  /*
    Yes, the span is reused, because, why not
  */

  var span = document.createElement("span")
  span.innerHTML = STRING
  span.style.fontSize = "86px"

  // span.style.display = "none"
  // will not work, but it should anyway be too fast
  //span.style.display = "hidden"

  /*
    First, the width and height of the (3) default fonts will have to be measured.
    Using them, it is possible to determine if the text was
    displayed in one of them, as a fallback, because the font itself did not exist / was
    not available
  */

  defaults.forEach(function(font) {
    span.style.fontFamily = font.name
    document.body.appendChild(span)
    font.width = span.offsetWidth
    font.height = span.offsetHeight
    document.body.removeChild(span)
  })

  if (this.DEBUG)
    console.log(defaults)

  // Search for fonts

  var foundFonts = []

  fonts.forEach(function(font) {
    var found = false

    defaults.forEach(function(defaultFont) {
      span.style.fontFamily = font + "," + defaultFont.name
      document.body.appendChild(span)
      if (span.offsetWidth !== defaultFont.width || span.offsetHeight !== defaultFont.height) {
        found = true
      }
      document.body.removeChild(span)
    })

    if (found) {
      if (BeaverBird.DEBUG)
        console.log("found font:", font)

      foundFonts.push(font)
    }
  })

  if (BeaverBird.DEBUG)
    console.log("found", foundFonts.length, "fonts")

  var output = foundFonts.sort()
  this.cache.fonts = output
  return output
}

BeaverBird.matchFonts = function(fonts) {
  var foundFonts = this.fonts()

  var doNotMatch = false
  fonts.forEach(function(font) {
    if (foundFonts.indexOf(font) === -1) {
      doNotMatch = true
    }
  })

  return !doNotMatch
}

/*
  see https://www.khronos.org/registry/webgl/specs/1.0/#5.14.1

  if I am missing anything that would be useful for tracking,
  or something shouldn't be here, please notify
*/

BeaverBird.WEBGL_PARAMETERS = [
  "VENDOR",
  "RENDERER",

  "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
  "MAX_CUBE_MAP_TEXTURE_SIZE",
  "MAX_FRAGMENT_UNIFORM_VECTORS",
  "MAX_RENDERBUFFER_SIZE",
  "MAX_TEXTURE_IMAGE_UNITS",
  "MAX_TEXTURE_SIZE",
  "MAX_VARYING_VECTORS",
  "MAX_VERTEX_ATTRIBS",
  "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
  "MAX_VERTEX_UNIFORM_VECTORS",

  "RED_BITS",
  "GREEN_BITS",
  "BLUE_BITS",
  "ALPHA_BITS",
  "DEPTH_BITS",
  "STENCIL_BITS",
]

BeaverBird.webgl = function() {
  var output = {}
  var canvas = document.createElement("canvas")

  var gl = (function getGlContext(canvas) {
    if (!window.WebGLRenderingContext) {
      return null
    }

    var context = null

    try {
      context = canvas.getContext("webgl")
      || canvas.getContext("moz-webgl")
      || canvas.getContext("experimental-webgl")
      || canvas.getContext("webkit-3d")
    }
    catch (err) {
      // whatever.... no, really, we don't care
    }

    return context
  })(canvas)

  if (gl === null) {
    return null
  }

  /* Get all WebGL parameters */

  output.parameters = {}

  this.WEBGL_PARAMETERS.forEach(function(param) {
    if (gl[param.toUpperCase()] !== undefined)
      output.parameters[param.toLowerCase()] = gl.getParameter(gl[param.toUpperCase()])
  })

  /* Find all WebGL extensions */

  output.extensions = gl.getSupportedExtensions()

  return output
}

/* Export */

if (typeof module !== "undefined" && module.exports) {
  module.exports = BeaverBird
}
else {
  window.BeaverBird = BeaverBird
}


/* Libraries */
// copy-pasted for convenience.

// md5 implementation (https://github.com/satazor/SparkMD5), modified for size

var MD5
(function () {

    'use strict';

    ////////////////////////////////////////////////////////////////////////////

    /*
     * Fastest md5 implementation around (JKM md5)
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },

    cmn = function (q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    },

    ff = function (a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    },

    gg = function (a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    },

    hh = function (a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    },

    ii = function (a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    },

    md5cycle = function (x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    },

    /* there needs to be support for Unicode here,
       * unless we pretend that we can redefine the MD-5
       * algorithm for multi-byte characters (perhaps
       * by adding every four 16-bit characters and
       * shortening the sum to 32 bits). Otherwise
       * I suggest performing MD-5 as if every character
       * was two bytes--e.g., 0040 0025 = @%--but then
       * how will an ordinary MD-5 sum be matched?
       * There is no way to standardize text to something
       * like UTF-8 before transformation; speed cost is
       * utterly prohibitive. The JavaScript standard
       * itself needs to look at this: it should start
       * providing access to strings as preformed UTF-8
       * 8-bit unsigned value arrays.
       */
    md5blk = function (s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    },

    md5blk_array = function (a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    },

    md51 = function (s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    },

    md51_array = function (a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    },

    hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],

    rhex = function (n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    },

    hex = function (x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    },

    md5 = function (s) {
        return hex(md51(s));
    };

    // In some cases the fast add32 function cannot be used..
    if (md5('hello') !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw result, false to get the hex result
     *
     * @return {String|Array} The result
     */
    MD5 = function (str, raw) {
        // converts the string to utf8 bytes if necessary
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        var hash = md51(str);

        return !!raw ? hash : hex(hash);
    };
})();

// crc32 implementation (https://github.com/otherlab/typedarray-crc32)
var CRC_TABLE = [
  0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419,
  0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4,
  0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07,
  0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de,
  0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856,
  0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9,
  0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4,
  0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
  0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3,
  0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a,
  0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599,
  0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924,
  0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190,
  0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f,
  0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e,
  0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
  0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed,
  0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950,
  0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3,
  0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2,
  0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a,
  0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5,
  0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010,
  0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
  0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17,
  0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6,
  0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615,
  0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8,
  0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344,
  0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb,
  0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a,
  0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
  0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1,
  0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c,
  0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef,
  0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236,
  0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe,
  0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31,
  0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c,
  0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
  0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b,
  0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242,
  0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1,
  0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c,
  0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278,
  0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7,
  0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66,
  0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
  0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605,
  0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8,
  0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b,
  0x2d02ef8d
];

function crc32(array, previous) {
  if (!(array instanceof Uint8Array)) {
    // array is a TypedArray
    if (array.buffer instanceof ArrayBuffer) {
      array = new Uint8Array(array.buffer);
    }
    // array is a JS array or ArrayBuffer
    else {
      array = new Uint8Array(array);
    }
  }
  var crc = ~~previous ^ -1;
  for (var n = 0; n < array.length; n++) {
    crc = CRC_TABLE[(crc ^ array[n]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1);
};

})()
