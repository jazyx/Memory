/// COLOR FUNCTIONS //

export const GOLDEN_ANGLE = 180 * (3 - Math.sqrt(5))
// 137.50776405003785

export const getGoldenAngleAt = index => {
  let angle = index * GOLDEN_ANGLE
  angle -= Math.floor(angle / 360) * 360 // 0.0 ≤ angle < 360.0

  return angle
}



export const rgbify = (color) => {
  if (color.substring(0, 3).toLowerCase() === "hsl" ) {
    return HSLtoRGB(color)
  }

  if (color[0] === "#") {
    color = color.slice(1)
  }

  if (color.length === 3) {
    color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2]
  }

  const hex = parseInt(color, 16)

  return [
    hex >> 16           // red
  ,(hex >>  8) & 0x00FF // green
  , hex        & 0xFF   // blue
  ]
}



export const tweenColor = (color1, color2, ratio) => {
  const rgb1 = rgbify(color1)
  const rgb2 = rgbify(color2)

  const hex = rgb1.map((value, index) => {
    value = Math.round(value - (value - rgb2[index]) * ratio)
    value = Math.max(0, Math.min(value, 255))

    return ((value < 16) ? "0" : "") + value.toString(16)
  })

  return "#" + hex.join("")
}


/**
 * Multiplies the rgb values of color by ratio, in the range
 * 0 - 255.
 *
 * E.g. toneColor("#cc8844 ", 0.5)
 * // "#642"
 * toneColor("#c84", 2.0)
 * // "#ffff88"
 */
export const toneColor = (color, ratio) => {
  const prefix = color[0] === "#"

  if (prefix) {
    color = color.slice(1)
  }

  const rgb = rgbify(color)
             .map( value => {
    value = Math.floor(Math.max(0, Math.min(255, value * ratio)))
    return ((value < 16) ? "0" : "") + value.toString(16)
  })

  return (prefix ? "#" : "") + rgb.join("")
}



export const translucify = (color, opacity) => {
  if (color[0] === "#") {
    color = color.slice(1)
  }
  
  if (color.length === 4) {
    // Ignore alpha data, since it will be overwritten by opacity
    color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2]
  }

  const rgb = rgbify(color)

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`
}


// https://stackoverflow.com/a/20129594/1927589
// https://qph.fs.quoracdn.net/main-qimg-aaa9a544d797f1109b29c55814319195.webp
export const getColor = ({ 
  number,
  s=0.5,
  l=0.33,
  offset=0,
  format="hsl"
}) => {
  const h = ((number - offset) * GOLDEN_ANGLE) % 360

  s = Math.max(0, Math.min(s, 1))
  l = Math.max(0, Math.min(l, 1))

  switch (format.toLowerCase()) {
    case "rgb":
      return hsl2rgb(h, s, l)

    case "hex":
      return hsl2hex(h, s * 100, l * 100)

    default: // "hsl"
      return `hsl(${h},${s*100}%,${l*100}%)`;
  }
}


// https://stackoverflow.com/a/54014428/1927589
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
export const hsl2rgb = (h,s,l) => {
  let a=s*Math.min(l,1-l);
  let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
  return [f(0),f(8),f(4)]
}


// https://stackoverflow.com/a/44134328/1927589
export const hsl2hex = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}



export const HSLtoRGB = (colorString )=> {
  // "hsl(412.523,50%,40%)" <<< percentages
  // "412.523, 0.5, 0.4"    <<< ratios
  let rgb = [0, 0, 0]

  const regex = /(hsl\s*\(\s*)?([0-9.]+)\s*,\s*([0-9.]+)(%?)\s*,\s*([0-9.]+)(%?)\s*\)?/
  const match = regex.exec(colorString)

  if (match) {
    let h = parseFloat(match[2], 10)
    let s = parseFloat(match[3], 10)
    let l = parseFloat(match[5], 10)

    while (h > 360) {
      h -= 360
    }
    while (h < 0) {
      h += 360
    }
    if (match[4]) {
      s /= 100
    }
    s = Math.max(0, Math.min(s, 1))
    if (match[6]) {
      l /= 100
    }
    l = Math.max(0, Math.min(l, 1))

    rgb = hsl2rgb(h, s, l) // [<0.0-1.0>, <0.0-1.0>, <0.0-1.0>]
         .map(number => Math.round(number * 255))
  }

  return rgb
}


/**
 * @param   {<type>}  color   Must be a color (rgb or hex)
 * @param   {object}  values  May be an object with the same
 *                            structure as defaults
 * @return  {object}  Returns an object with the same structure as
 *                    defaults, but where each value is a color
 */
export const buttonColors = (color, values) => {
  const output = {
    restBg:     1
  , restTint:   1.5
  , restShade:  0.75

  , overBg:    1.1
  , overTint:  1.65
  , overShade: 0.667

  , downBg:    0.95
  , downTint:  1.333
  , downShade: 0.6
  }
  const keys = Object.keys(output)

  ;(function merge(input) {
    if (typeof input === "object") {
      keys.forEach( key => {
        const value = input[key]
        if (!isNaN(value)) {
          if (value > 0) {
            output[key] = value
          }
        }
      })
    }
  })()

  keys.forEach( key => (
    output[key] = toneColor(color, output[key])
  ))

  return output
}