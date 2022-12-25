export enum ColorKey {
  PRIMARY = "PRIMARY",
  BACKGROUND = "BACKGROUND",
  BACKGROUND2 = "BACKGROUND2",
  HR = "HR",
  LEVEL_99 = "LEVEL_99",
  LEVEL_110 = "LEVEL_110",
  LEVEL_120 = "LEVEL_120",
  CONFIRM_BUTTON_BG = "CONFIRM_BUTTON_BG",
  CONFIRM_BUTTON_ICON = "CONFIRM_BUTTON_ICON",
  CONFIRM_BUTTON_BORDER = "CONFIRM_BUTTON_BORDER",
  REMOVE_BUTTON_BG = "REMOVE_BUTTON_BG",
  REMOVE_BUTTON_ICON = "REMOVE_BUTTON_ICON",
  REMOVE_BUTTON_BORDER = "REMOVE_BUTTON_BORDER"
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
export const COLOR_18F794_LIGHT = {
  "0": "#e6fff4",
  "50": "#cdffec",
  "100": "#b3ffe3",
  "150": "#93ffd6",
  "200": "#73ffc8",
  "300": "#47ffb0",
  "400": "#18f794",
  "500": "#20d086",
  "600": "#1fa470",
  "700": "#1a7453",
  "800": "#114433",
  "900": "#081914"
};

export const COLOR_18F794_DARK = {
  "0": "#081a14",
  "50": "#0b2e23",
  "100": "#0d4331",
  "150": "#0c5a3f",
  "200": "#09704b",
  "300": "#0e9f66",
  "400": "#1edc8b",
  "500": "#18f794",
  "600": "#4bfaad",
  "700": "#7ffcc4",
  "800": "#b2fedc",
  "900": "#e6fff4"
};

export const COLOR_D21307_LIGHT = {
  "0": "#ffe7e6",
  "50": "#ffdbd9",
  "100": "#ffcecb",
  "150": "#ffbbb8",
  "200": "#ffa8a4",
  "300": "#ff8681",
  "400": "#ff5f59",
  "500": "#ec372e",
  "600": "#d21307",
  "700": "#931f11",
  "800": "#531b11",
  "900": "#190b08"
};

export const COLOR_D21307_DARK = {
  "0": "#1a0b08",
  "50": "#39140d",
  "100": "#58190e",
  "150": "#79190c",
  "200": "#991405",
  "300": "#d21307",
  "400": "#f94941",
  "500": "#ff6c66",
  "600": "#ff8c87",
  "700": "#ffaba7",
  "800": "#ffc9c6",
  "900": "#ffe7e6"
};

export const DARK_COLORS: ColorPalette = {
  PRIMARY: "#000",
  BACKGROUND: GRAY_RANGE[0],
  BACKGROUND2: GRAY_RANGE[0],
  HR: GRAY_RANGE[900],
  LEVEL_99: "#fff",
  LEVEL_110: "#85BCFF",
  LEVEL_120: "#18F794",
  CONFIRM_BUTTON_BG: COLOR_18F794_DARK[800],
  CONFIRM_BUTTON_ICON: COLOR_18F794_DARK[200],
  CONFIRM_BUTTON_BORDER: COLOR_18F794_DARK[300],
  REMOVE_BUTTON_BG: COLOR_D21307_DARK[800],
  REMOVE_BUTTON_ICON: COLOR_D21307_DARK[200],
  REMOVE_BUTTON_BORDER: COLOR_D21307_DARK[300]
};

export function getColor(colorKey: keyof ColorPalette) {
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDarkScheme ? DARK_COLORS[colorKey] : DARK_COLORS[colorKey];
}
