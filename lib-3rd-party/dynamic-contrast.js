// getColorContrast
//     Return suggested contrast grey scale color for the color (hex/rgba) given.
//     Takes advantage of YIQ: https://en.wikipedia.org/wiki/YIQ
//     Inspired by: http://24ways.org/2010/calculating-color-contrast/
//
// @param color string A valid hex or rgb value, examples:
//                         #000, #000000, 000, 000000
//                         rgb(255, 255, 255), rgba(255, 255, 255),
//                         rgba(255, 255, 255, 1)
//                         blue, green, red
// @return      string of the form #RRGGBB
function getColorContrast(color) {
    var rgbExp = /^rgba?[\s+]?\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*(?:,\s*([\d.]+)\s*)?\)/im,
        hexExp = /^(?:#)|([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/igm,
        rgb    = color.match(rgbExp),
        hex    = color.match(hexExp),
        r, g, b, yiq;
    if (rgb) {
        r = parseInt(rgb[1], 10);
        g = parseInt(rgb[2], 10);
        b = parseInt(rgb[3], 10);
    } else if (hex)  {
        if (hex.length > 1) {
            hex = hex[1];
        } else {
            hex = hex[0];
        }
        if (hex.length == 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
    } else {
        rgb = {
            "indigo": [ 75, 0, 130 ],
            "gold": [ 255, 215, 0 ],
            "firebrick": [ 178, 34, 34 ],
            "indianred": [ 205, 92, 92 ],
            "yellow": [ 255, 255, 0 ],
            "darkolivegreen": [ 85, 107, 47 ],
            "darkseagreen": [ 143, 188, 143 ],
            "slategrey": [ 112, 128, 144 ],
            "darkslategrey": [ 47, 79, 79 ],
            "mediumvioletred": [ 199, 21, 133 ],
            "mediumorchid": [ 186, 85, 211 ],
            "chartreuse": [ 127, 255, 0 ],
            "mediumslateblue": [ 123, 104, 238 ],
            "black": [ 0, 0, 0 ],
            "springgreen": [ 0, 255, 127 ],
            "crimson": [ 220, 20, 60 ],
            "lightsalmon": [ 255, 160, 122 ],
            "brown": [ 165, 42, 42 ],
            "turquoise": [ 64, 224, 208 ],
            "olivedrab": [ 107, 142, 35 ],
            "lightcyan": [ 224, 255, 255 ],
            "cyan": [ 0, 255, 255 ],
            "silver": [ 192, 192, 192 ],
            "skyblue": [ 135, 206, 235 ],
            "gray": [ 128, 128, 128 ],
            "darkturquoise": [ 0, 206, 209 ],
            "goldenrod": [ 218, 165, 32 ],
            "darkgreen": [ 0, 100, 0 ],
            "darkviolet": [ 148, 0, 211 ],
            "darkgray": [ 169, 169, 169 ],
            "lightpink": [ 255, 182, 193 ],
            "teal": [ 0, 128, 128 ],
            "darkmagenta": [ 139, 0, 139 ],
            "lightgoldenrodyellow": [ 250, 250, 210 ],
            "lavender": [ 230, 230, 250 ],
            "yellowgreen": [ 154, 205, 50 ],
            "thistle": [ 216, 191, 216 ],
            "violet": [ 238, 130, 238 ],
            "navy": [ 0, 0, 128 ],
            "dimgrey": [ 105, 105, 105 ],
            "orchid": [ 218, 112, 214 ],
            "blue": [ 0, 0, 255 ],
            "ghostwhite": [ 248, 248, 255 ],
            "honeydew": [ 240, 255, 240 ],
            "cornflowerblue": [ 100, 149, 237 ],
            "darkblue": [ 0, 0, 139 ],
            "darkkhaki": [ 189, 183, 107 ],
            "mediumpurple": [ 147, 112, 216 ],
            "cornsilk": [ 255, 248, 220 ],
            "red": [ 255, 0, 0 ],
            "bisque": [ 255, 228, 196 ],
            "slategray": [ 112, 128, 144 ],
            "darkcyan": [ 0, 139, 139 ],
            "khaki": [ 240, 230, 140 ],
            "wheat": [ 245, 222, 179 ],
            "deepskyblue": [ 0, 191, 255 ],
            "darkred": [ 139, 0, 0 ],
            "steelblue": [ 70, 130, 180 ],
            "aliceblue": [ 240, 248, 255 ],
            "lightslategrey": [ 119, 136, 153 ],
            "gainsboro": [ 220, 220, 220 ],
            "monnoroch": [ 0, 0, 0 ],
            "mediumturquoise": [ 72, 209, 204 ],
            "floralwhite": [ 255, 250, 240 ],
            "plum": [ 221, 160, 221 ],
            "purple": [ 128, 0, 128 ],
            "lightgrey": [ 211, 211, 211 ],
            "burlywood": [ 222, 184, 135 ],
            "darksalmon": [ 233, 150, 122 ],
            "beige": [ 245, 245, 220 ],
            "azure": [ 240, 255, 255 ],
            "lightsteelblue": [ 176, 196, 222 ],
            "oldlace": [ 253, 245, 230 ],
            "greenyellow": [ 173, 255, 47 ],
            "royalblue": [ 65, 105, 225 ],
            "lightseagreen": [ 32, 178, 170 ],
            "sienna": [ 160, 82, 45 ],
            "lightcoral": [ 240, 128, 128 ],
            "orangered": [ 255, 69, 0 ],
            "navajowhite": [ 255, 222, 173 ],
            "lime": [ 0, 255, 0 ],
            "palegreen": [ 152, 251, 152 ],
            "mistyrose": [ 255, 228, 225 ],
            "seashell": [ 255, 245, 238 ],
            "mediumspringgreen": [ 0, 250, 154 ],
            "fuchsia": [ 255, 0, 255 ],
            "papayawhip": [ 255, 239, 213 ],
            "blanchedalmond": [ 255, 235, 205 ],
            "peru": [ 205, 133, 63 ],
            "aquamarine": [ 127, 255, 212 ],
            "white": [ 255, 255, 255 ],
            "darkslategray": [ 47, 79, 79 ],
            "lightgray": [ 211, 211, 211 ],
            "ivory": [ 255, 255, 240 ],
            "dodgerblue": [ 30, 144, 255 ],
            "lawngreen": [ 124, 252, 0 ],
            "chocolate": [ 210, 105, 30 ],
            "orange": [ 255, 165, 0 ],
            "forestgreen": [ 34, 139, 34 ],
            "darkgrey": [ 169, 169, 169 ],
            "olive": [ 128, 128, 0 ],
            "mintcream": [ 245, 255, 250 ],
            "antiquewhite": [ 250, 235, 215 ],
            "darkorange": [ 255, 140, 0 ],
            "cadetblue": [ 95, 158, 160 ],
            "moccasin": [ 255, 228, 181 ],
            "limegreen": [ 50, 205, 50 ],
            "saddlebrown": [ 139, 69, 19 ],
            "grey": [ 128, 128, 128 ],
            "darkslateblue": [ 72, 61, 139 ],
            "lightskyblue": [ 135, 206, 250 ],
            "deeppink": [ 255, 20, 147 ],
            "coral": [ 255, 127, 80 ],
            "aqua": [ 0, 255, 255 ],
            "darkgoldenrod": [ 184, 134, 11 ],
            "maroon": [ 128, 0, 0 ],
            "sandybrown": [ 244, 164, 96 ],
            "tan": [ 210, 180, 140 ],
            "magenta": [ 255, 0, 255 ],
            "rosybrown": [ 188, 143, 143 ],
            "pink": [ 255, 192, 203 ],
            "lightblue": [ 173, 216, 230 ],
            "palevioletred": [ 216, 112, 147 ],
            "mediumseagreen": [ 60, 179, 113 ],
            "slateblue": [ 106, 90, 205 ],
            "dimgray": [ 105, 105, 105 ],
            "powderblue": [ 176, 224, 230 ],
            "seagreen": [ 46, 139, 87 ],
            "snow": [ 255, 250, 250 ],
            "mediumblue": [ 0, 0, 205 ],
            "midnightblue": [ 25, 25, 112 ],
            "paleturquoise": [ 175, 238, 238 ],
            "palegoldenrod": [ 238, 232, 170 ],
            "whitesmoke": [ 245, 245, 245 ],
            "darkorchid": [ 153, 50, 204 ],
            "salmon": [ 250, 128, 114 ],
            "lightslategray": [ 119, 136, 153 ],
            "lemonchiffon": [ 255, 250, 205 ],
            "lightgreen": [ 144, 238, 144 ],
            "tomato": [ 255, 99, 71 ],
            "hotpink": [ 255, 105, 180 ],
            "lightyellow": [ 255, 255, 224 ],
            "lavenderblush": [ 255, 240, 245 ],
            "linen": [ 250, 240, 230 ],
            "mediumaquamarine": [ 102, 205, 170 ],
            "green": [ 0, 128, 0 ],
            "blueviolet": [ 138, 43, 226 ],
            "peachpuff": [ 255, 218, 185 ]
        }[color.toLowerCase()];
        if (rgb) {
            r = rgb[0];
            g = rgb[1];
            b = rgb[2];
        } else {
            return '#000000';
        }
    }
    yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if (yiq >= 128) {
        yiq -= 128;
    } else {
        yiq += 128;
    }
    color = yiq << 16 | yiq << 8 | yiq;
    color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
    return color;
}

module.exports = getColorContrast;
