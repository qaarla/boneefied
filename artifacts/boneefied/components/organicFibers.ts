/**
 * Original Boneefied decorative artwork, purpose-drawn October 15, 2026.
 * Nonliteral flowing fibers, NOT a scientific tissue illustration.
 * Closed Bézier ribbons taper to nothing; branches are sparse, rounded curves.
 * The broad central 60% is deliberately empty. No randomness or animation.
 * Also consumed by the existing website, never by the anatomy asset catalog.
 */
export const ORGANIC_VIEWBOX = '0 0 1000 1000';
export const ORGANIC_STRENGTH = 0.04;
export const organicFibers = [
  'M 8 -40 C 104 78 132 134 93 234 C 63 310 18 356 -16 462 C 10 344 56 301 88 232 C 127 136 99 78 8 -40 Z',
  'M 44 -45 C 149 88 176 162 124 276 C 98 331 62 378 50 451 C 56 376 92 328 119 274 C 172 163 144 88 44 -45 Z',
  'M 80 -24 C 177 94 198 190 159 297 C 135 355 111 409 120 480 C 106 410 129 353 154 295 C 198 189 172 94 80 -24 Z',
  'M -25 502 C 40 566 74 611 53 693 C 36 764 -8 826 4 932 C -14 827 30 762 48 692 C 70 613 37 568 -25 502 Z',
  'M -31 548 C 15 608 38 651 15 727 C -3 788 -20 848 -3 906 C -24 849 -8 787 10 726 C 33 652 12 610 -31 548 Z',
  'M 18 738 C 93 807 114 882 74 1035 C 107 884 87 810 18 738 Z',
  'M 965 -36 C 906 54 887 121 921 211 C 951 291 997 320 1025 413 C 992 321 946 292 916 213 C 881 122 901 54 965 -36 Z',
  'M 1004 8 C 957 86 949 151 974 213 C 992 261 1023 303 1032 364 C 1018 304 988 264 969 215 C 943 152 952 86 1004 8 Z',
  'M 1023 432 C 948 506 909 586 933 679 C 952 754 1000 805 1005 884 C 994 807 947 755 928 680 C 903 585 943 506 1023 432 Z',
  'M 1028 506 C 971 570 958 620 977 684 C 992 735 1020 767 1032 827 C 1015 770 987 737 972 686 C 952 620 966 570 1028 506 Z',
  'M 1005 714 C 920 790 881 879 903 1034 C 875 879 914 790 1005 714 Z',
  'M 969 779 C 910 848 897 920 925 1032 C 891 921 904 848 969 779 Z',
];
export const organicBranches = [
  'M 92 234 C 75 269 39 274 -7 284',
  'M 155 295 C 172 254 179 213 165 179',
  'M 51 693 C 68 653 100 637 121 600',
  'M 920 212 C 904 171 871 157 852 123',
  'M 931 680 C 911 629 880 611 866 566',
  'M 900 944 C 891 906 861 891 844 861',
];

/** Tiny self-contained SVG, used as CSS decoration on the website. */
export function organicFiberSvg(ink: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ORGANIC_VIEWBOX}" preserveAspectRatio="none"><g fill="${ink}">${organicFibers.map(d => `<path d="${d}"/>`).join('')}</g><g fill="none" stroke="${ink}" stroke-width="0.9" stroke-linecap="round">${organicBranches.map(d => `<path d="${d}"/>`).join('')}</g></svg>`;
}
