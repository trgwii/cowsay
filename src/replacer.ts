export default function (cow: string, variables: any): string {
  const eyes = escapeRe(variables.eyes);
  const eyeL = eyes.charAt(0);
  const eyeR = eyes.charAt(1);
  const tongue = escapeRe(variables.tongue);

  if (cow.indexOf("$the_cow") !== -1) {
    cow = extractTheCow(cow);
  }

  return cow
    .replace(/\$thoughts/g, variables.thoughts)
    .replace(/\$eyes/g, eyes)
    .replace(/\$tongue/g, tongue)
    .replace(/\$\{eyes\}/g, eyes)
    .replace(/\$eye/, eyeL)
    .replace(/\$eye/, eyeR)
    .replace(/\$\{tongue\}/g, tongue);
}/*
 * "$" dollar signs must be doubled before being used in a regex replace
 * This can occur in eyes or tongue.
 * For example:
 *
 * cowsay -g Moo!
 *
 * cowsay -e "\$\$" Moo!
 */

function escapeRe(s: string): string {
  if (s && s.replace) {
    return s.replace(/\$/g, "$$$$");
  }
  return s;
}

function extractTheCow(cow: string): string {
  cow = cow.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, "");
  const match = /\$the_cow\s*=\s*<<"*EOC"*;*\n([\s\S]+)\nEOC\n/.exec(cow);

  if (!match) {
    console.error("Cannot parse cow file\n", cow);
    return cow;
  } else {
    return match[1].replace(/\\{2}/g, "\\").replace(/\\@/g, "@").replace(
      /\\\$/g,
      "$",
    );
  }
}
