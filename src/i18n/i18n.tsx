import ja from "./ja.json";
import en from "./en.json";

export type Language = "en" | "ja";
export function iStr(id: string | undefined, lang: Language, def?: string) {
  if (id === undefined) {
    return def;
  } else if (lang === "ja") {
    const d = ja as any;
    return d[id];
  } else if (lang === "en") {
    const d = en as any;
    return d[id];
  }

  const d = en as any;
  const enVal = d[id];
  if (enVal) {
    return enVal;
  }

  return def;
}
