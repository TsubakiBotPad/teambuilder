export const LATENTS_ID_TO_NAME: { [key: number]: string } = {
  // # NOT APPLICABLE
  1: "emp",
  2: "nemp",

  // # ONE SLOT
  101: "hp",
  102: "atk",
  103: "rcv",
  104: "rres",
  105: "bres",
  106: "gres",
  107: "lres",
  108: "dres",
  109: "ah",
  110: "sdr",
  111: "te",

  // # TWO SLOTS
  201: "bak",
  202: "phk",
  203: "hek",
  204: "drk",
  205: "gok",
  206: "aak",
  207: "dek",
  208: "mak",
  209: "evk",
  210: "rek",
  211: "awk",
  212: "enk",
  213: "all",
  214: "hp+",
  215: "atk+",
  216: "rcv+",
  217: "rres+",
  218: "bres+",
  219: "gres+",
  220: "lres+",
  221: "dres+",
  222: "te+",

  // # SIX SLOTS
  601: "psf",
  602: "jsf",
  603: "ls",
  604: "vdp",
  605: "attr",
  606: "unm",
  607: "spn",
  608: "abs",
  609: "dbl",
  610: "sb++",
  611: "cloudtape"
};

export const LATENTS_NAME_TO_ID: { [key: string]: number } = Object.fromEntries(
  Object.entries(LATENTS_ID_TO_NAME)
    .slice(2)
    .map((a) => a.reverse())
);

export const LATENTS_BY_SIZE: { [key: number]: string[] } = Object.entries(LATENTS_ID_TO_NAME)
  .slice(2)
  .reduce((d, [num, name]) => {
    const idx = Math.floor((num as any) / 100);
    if (!d[idx]) {
      d[idx] = [];
    }
    d[idx].push(name);
    return d;
  }, {} as { [key: number]: string[] });

export const LATENT_NAMES = Object.keys(LATENTS_NAME_TO_ID);

export const AWO_RES_LATENT_TO_AWO_MAP = {
  606: 27,
  607: 20,
  608: 62
};
