export enum ColorKey {
  PRIMARY = "PRIMARY",
  BACKGROUND = "BACKGROUND",
  BACKGROUND2 = "BACKGROUND2",
  HR = "HR"
}

export type ColorPalette = {
  [key in ColorKey]: string;
};

export const COLORS = {
  NAVY: "#15214B",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  BLUE: "#f8fcff",
  GREEN: "#186118"
};
export const COLOR_2AF62E_LIGHT = {
  "0": "#e6ffe6",
  "50": "#d9ffda",
  "100": "#cbffcc",
  "150": "#b8ffb8",
  "200": "#a3ffa3",
  "300": "#7fff80",
  "400": "#56ff57",
  "500": "#2af62e",
  "600": "#28c030",
  "700": "#1f8728",
  "800": "#144d1b",
  "900": "#08190a"
};

export const COLOR_2AF62E_DARK = {
  "0": "#081a0a",
  "50": "#0d3312",
  "100": "#0f4c16",
  "150": "#0f6719",
  "200": "#0d8218",
  "300": "#15b51f",
  "400": "#2af62e",
  "500": "#53fc56",
  "600": "#79fe7b",
  "700": "#9eff9f",
  "800": "#c2ffc3",
  "900": "#e6ffe6"
};

export const COLOR_53CD55_LIGHT = {
  "0": "#e6ffe6",
  "50": "#ddffdd",
  "100": "#d4ffd4",
  "150": "#c6ffc6",
  "200": "#b9ffb8",
  "300": "#9cf99b",
  "400": "#79e679",
  "500": "#53cd55",
  "600": "#3ea142",
  "700": "#28722e",
  "800": "#15431b",
  "900": "#08190a"
};

export const COLOR_53CD55_DARK = {
  "0": "#081a0a",
  "50": "#0d2c11",
  "100": "#113e17",
  "150": "#16531c",
  "200": "#1b6721",
  "300": "#2e9333",
  "400": "#53cd55",
  "500": "#71db73",
  "600": "#8de68f",
  "700": "#aaefab",
  "800": "#c7f7c8",
  "900": "#e6ffe6"
};

export const COLOR_2E2AF6_LIGHT = {
  "0": "#e6e6ff",
  "50": "#e2e1ff",
  "100": "#dcdcff",
  "150": "#d0d0ff",
  "200": "#c3c4ff",
  "300": "#a5a6ff",
  "400": "#7f7fff",
  "500": "#5655ff",
  "600": "#2e2af6",
  "700": "#2c24ab",
  "800": "#1f185f",
  "900": "#0a0819"
};

export const COLOR_2E2AF6_DARK = {
  "0": "#0a081a",
  "50": "#171140",
  "100": "#1f1666",
  "150": "#231a8e",
  "200": "#231ab6",
  "300": "#2e2af6",
  "400": "#6060ff",
  "500": "#7e7dff",
  "600": "#9998ff",
  "700": "#b3b2ff",
  "800": "#cdccff",
  "900": "#e6e6ff"
};

export const COLOR_CD5553_LIGHT = {
  "0": "#ffe6e6",
  "50": "#ffe5e5",
  "100": "#ffe3e3",
  "150": "#ffdddd",
  "200": "#ffd6d6",
  "300": "#ffbebe",
  "400": "#fe9e9e",
  "500": "#e87979",
  "600": "#cd5553",
  "700": "#8f3a34",
  "800": "#52201b",
  "900": "#190a08"
};

export const COLOR_CD5553_DARK = {
  "0": "#1a0a08",
  "50": "#2c110d",
  "100": "#3e1711",
  "150": "#531c16",
  "200": "#67211b",
  "300": "#93332e",
  "400": "#cd5553",
  "500": "#db7371",
  "600": "#e68f8d",
  "700": "#efabaa",
  "800": "#f7c8c7",
  "900": "#ffe6e6"
};

export const COLOR_F62E2A_LIGHT = {
  "0": "#ffe6e6",
  "50": "#ffe2e1",
  "100": "#ffdcdc",
  "150": "#ffd0d0",
  "200": "#ffc3c3",
  "300": "#ffa5a5",
  "400": "#ff7f7f",
  "500": "#ff5655",
  "600": "#f62e2a",
  "700": "#ab2c24",
  "800": "#5f1f18",
  "900": "#190a08"
};

export const COLOR_F62E2A_DARK = {
  "0": "#1a0a08",
  "50": "#401711",
  "100": "#661f16",
  "150": "#8e231a",
  "200": "#b6231a",
  "300": "#f62e2a",
  "400": "#ff6060",
  "500": "#ff7e7d",
  "600": "#ff9998",
  "700": "#ffb3b2",
  "800": "#ffcdcc",
  "900": "#ffe6e6"
};

export const GRAY_RANGE = {
  0: "#fff",
  50: "#fcfcfc",
  100: "#f2f0f0",
  200: "#d7d2d2",
  300: "#bcb4b4",
  400: "#a29696",
  500: "#877878",
  600: "#695d5d",
  700: "#4b4343",
  800: "#2d2828",
  900: "#0f0d0d"
};

// export const LIGHT_COLORS: ColorPalette = {
//   PRIMARY: "#15214B",
//   BACKGROUND: "#FFFFFF"
// };

export const DARK_COLORS: ColorPalette = {
  PRIMARY: "#000",
  BACKGROUND: GRAY_RANGE[0],
  BACKGROUND2: GRAY_RANGE[0],
  HR: GRAY_RANGE[900]
};

export function getColor(colorKey: keyof ColorPalette) {
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDarkScheme ? DARK_COLORS[colorKey] : DARK_COLORS[colorKey];
}
