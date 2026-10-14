/** Advance widths (1/1000 em) from the bundled Tinos regular/bold faces.
 * Only constrain an oversized word, never truncate or rewrite reading text. */
const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const regular = [444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611];
const bold = [500,556,444,556,444,333,500,556,278,333,556,278,833,556,500,556,556,444,389,333,556,500,722,500,500,444,722,667,722,722,667,611,778,778,389,500,778,667,944,722,778,611,778,722,556,667,722,722,1000,722,722,667];

export function wholeWordFontFactor(text: string, width: number, effectiveFontSize: number, isBold: boolean) {
  if (width <= 0 || effectiveFontSize <= 0) return 1;
  const advances = isBold ? bold : regular;
  // Include attached punctuation: "(semimembranosus," must fit as a unit.
  // Slash-linked terms may also lack a native/WebKit break opportunity.
  const words = text.match(/[(\[“‘"']*[\p{L}\p{M}\p{N}]+(?:\/[\p{L}\p{M}\p{N}]+)*[)\]”’"',;:.!?]*/gu) ?? [];
  const longest = Math.max(0, ...words.map(word => [...word.normalize('NFD').replace(/\p{M}/gu, '')].reduce((sum, letter) => {
    const index = letters.indexOf(letter);
    const punctuation = /[.,]/.test(letter) ? 250 : /[()[\]]/.test(letter) ? 333
      : /[;:!?]/.test(letter) ? (isBold ? 500 : 444) : /["'“”‘’]/.test(letter) ? 600 : undefined;
    return sum + (/\d/.test(letter) ? 500 : letter === '/' ? 278 : punctuation ?? (index < 0 ? 750 : advances[index]));
  }, 0) / 1000));
  const needed = longest * effectiveFontSize;
  return needed <= width + 0.5 ? 1 : Math.min(1, width / (needed * 1.03));
}
