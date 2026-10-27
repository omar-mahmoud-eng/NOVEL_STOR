/** Search Arabic titles with or without vowel marks and common alif forms. */
export function searchText(value: string) {
  return value.normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").toLowerCase().trim()
}
