export type ModuleIconKey = 'cells' | 'lymph' | 'mitosis' | 'skull' | 'orientation' | 'joint' | 'muscle' | 'brain' | 'skin' | 'eye' | 'gland' | 'heart' | 'vessels' | 'lungs' | 'stomach' | 'kidney' | 'male' | 'uterus';
/** Each shape is drawn on a 24x24 grid. `f` = subtle tinted fill, otherwise stroke only. */
export type IconShape = { d: string; f?: boolean };

export const moduleIconKeyById: Record<string, ModuleIconKey> = {
  'cells-tissues': 'cells', 'lymphatic-system': 'lymph', 'cytology-mitosis': 'mitosis', 'skeletal-system': 'skull',
  'anatomy-foundations': 'orientation', 'joints-ligaments': 'joint', 'muscular-system': 'muscle', 'nervous-system': 'brain',
  'integumentary-system': 'skin', 'special-senses': 'eye', 'endocrine-system': 'gland', 'cardiovascular-system': 'heart',
  'blood-vessels': 'vessels', 'respiratory-system': 'lungs', 'digestive-system': 'stomach', 'urinary-system': 'kidney',
  'male-reproductive': 'male', 'female-reproductive': 'uterus',
};

export const moduleIconShapes: Record<ModuleIconKey, IconShape[]> = {
  cells: [{ d: 'M8 4.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7z', f: true }, { d: 'M16 8.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7z', f: true }, { d: 'M8 13.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7z', f: true }, { d: 'M8 8h.01M16 12h.01M8 17h.01' }],
  lymph: [{ d: 'M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.500 2-5 5-9z', f: true }, { d: 'M3 20h4l2-3M21 20h-4l-2-3' }],
  mitosis: [{ d: 'M12 3C6 3 4 6 6 10c1 2 1 2 0 4c-2 4 1 7 6 7s8-3 6-7c-1-2-1-2 0-4c2-4 0-7-6-7z', f: true }, { d: 'M10 6l4 3M14 6l-4 3M10 15l4 3M14 15l-4 3' }],
  skull: [{ d: 'M12 3.500c-4.200 0-7 2.800-7 6.500c0 2.300 1 3.800 2.500 4.800V18h9v-3.200C19 13.800 19 12.300 19 10c0-3.700-2.800-6.500-7-6.500z', f: true }, { d: 'M9 10.500h.01M15 10.500h.01M12 13l-1 2h2zM10 18v2.500M14 18v2.500' }],
  orientation: [{ d: 'M12 3.500a2 2 0 1 1 0 4a2 2 0 0 1 0-4z', f: true }, { d: 'M12 9v7M6 11l6-2l6 2M9 21l3-5l3 5M3 12v0M12 22V3', }, { d: 'M3 16h4M17 16h4' }],
  joint: [{ d: 'M9 3h4l-1 7H8z', f: true }, { d: 'M10 21H6l1-7h4z', f: true }, { d: 'M16 10c2 1 3 2.500 3 4M15 7c4 1 6 4 6 7' }, { d: 'M10 11h2' }],
  muscle: [{ d: 'M4 16c0-5 4-9 9-9c3 0 4 1 4 3c0 1-1 2-2 2c-1 0-1 1-1 2c0 2 3 3 3 5H7c-2 0-3-1-3-3z', f: true }, { d: 'M9 14c1-2 2-3 4-3M7 18c2-1 4-1 6-1' }],
  brain: [{ d: 'M12 5c-1-2-5-2-6 1c-2 0-3 2-2.500 4c-1.500 1.500-1 4 1 5c0 2.500 2.500 4 4.500 3c1 1.500 3 1.500 3 0V5z', f: true }, { d: 'M12 5c1-2 5-2 6 1c2 0 3 2 2.500 4c1.500 1.500 1 4-1 5c0 2.500-2.500 4-4.500 3c-1 1.500-3 1.500-3 0M12 5v13M8 10h2M14 9h2M8 14h2M14 14h2' }],
  skin: [{ d: 'M3 6h18v4H3z', f: true }, { d: 'M3 10h18v4H3zM3 14h18v5H3z' }, { d: 'M12 6V3M9 6l-1-2M15 6l1-2M12 19v-5' }],
  eye: [{ d: 'M2.500 12C5 7.500 8.500 5.500 12 5.500s7 2 9.500 6.500C19 16.500 15.500 18.500 12 18.500S5 16.500 2.500 12z', f: true }, { d: 'M12 8.500a3.500 3.500 0 1 1 0 7a3.500 3.500 0 0 1 0-7zM12 11.500h.01' }],
  gland: [{ d: 'M12 3c2.500 3.500 4 5.500 4 7.500a4 4 0 0 1-8 0c0-2 1.500-4 4-7.500z', f: true }, { d: 'M6 17c1.500 2.500 3 4 6 4s4.500-1.500 6-4M9 17.500h.01M15 17.500h.01' }],
  heart: [{ d: 'M12 20C5 15 3 11.500 3 8.500A4.500 4.500 0 0 1 12 7a4.500 4.500 0 0 1 9 1.500C21 11.500 19 15 12 20z', f: true }, { d: 'M7 11h3l1.500-2.500L13 13l1-2h3' }],
  vessels: [{ d: 'M3 8h18v4H3z', f: true }, { d: 'M3 8h18M3 12h18M7 12v6a2 2 0 0 0 2 2h6M17 12V6a2 2 0 0 0-2-2H9' }],
  lungs: [{ d: 'M8 8C5 11 4 15 4 18c0 1.500 1.500 2 3 1.500c1.500-.5 2-1.500 2-3V9z', f: true }, { d: 'M16 8c3 3 4 7 4 10c0 1.500-1.500 2-3 1.500c-1.500-.5-2-1.500-2-3V9z', f: true }, { d: 'M12 3v8M12 11l-3 2M12 11l3 2' }],
  stomach: [{ d: 'M9 3v4c0 2 5 2 7 4c3 3 2 9-3 9c-3 0-6-2-6-6V9', f: true }, { d: 'M9 3h-2M16 14h.01M12 15h.01' }],
  kidney: [{ d: 'M15 4c-4-1-9 1-9 7s5 10 9 9c3-1 2-4 0-5c-2-1-2-3 0-4c2-1 3-5 0-7z', f: true }, { d: 'M16 12h4M12 17v4' }],
  male: [{ d: 'M10 10a5 5 0 1 1 0 10a5 5 0 0 1 0-10z', f: true }, { d: 'M13.500 12.500L20 6M15 5.500h5V10.500' }],
  uterus: [{ d: 'M12 6c3 0 5 2 5 5c0 3-1 5-2.500 6.500c-1 1-1.500 2-2.500 2s-1.500-1-2.500-2C8 16 7 14 7 11c0-3 2-5 5-5z', f: true }, { d: 'M7 11C4 11 3 9 3 7M17 11c3 0 4-2 4-4M12 17v4' }],
};
