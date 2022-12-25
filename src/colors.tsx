import { COLOR_18F794_DARK, COLOR_D21307_DARK } from "./colorExport";

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
