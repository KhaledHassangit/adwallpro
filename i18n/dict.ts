import { ar } from "./ar";
import { en } from "./en";

export const dict = {
  en,
  ar
};

export type DictKey = keyof typeof dict.ar;
export type Locale = keyof typeof dict;
