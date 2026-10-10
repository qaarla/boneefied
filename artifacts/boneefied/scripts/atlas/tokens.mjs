// Boneefied foundational atlas: shared palette, stroke and layout tokens.
// Flat matte fills only: no gradients, textures, filters or glows.
export const CANVAS = { width: 1450, height: 1000, aspect: 1.45 };

export const PALETTE = {
  paper: '#ECEAE2',
  ink: '#4C5760',
  inkSoft: '#8A949B',
  skin: '#DDCDBF',
  skinLight: '#E8DFD4',
  skinLine: '#7C6C64',
  hair: '#76706A',
  bone: '#E9E2D1',
  boneLine: '#7F7766',
  boneShade: '#CFC6B1',
  cartilage: '#C7D0CB',
  axial: '#B8C8CA',
  axialLine: '#586F73',
  axialShade: '#9DB3B6',
  appendicular: '#E4CFA8',
  appendicularLine: '#8A7146',
  appendicularShade: '#CDB486',
  brain: '#CDBAC0',
  lung: '#A9BFC8',
  heart: '#A96467',
  liver: '#A97A68',
  stomach: '#CCA690',
  spleen: '#85708F',
  kidney: '#8F6C5C',
  pancreas: '#CDB77F',
  bladder: '#BBA4A3',
  intestine: '#D4BCA2',
  intestineDark: '#B79E83',
  muscle: '#C69A8C',
  serous: '#E7D6A8',
  cavityCranial: '#CBC2D2',
  cavityVertebral: '#B9C9B4',
  cavityThoracic: '#B6CBD2',
  cavityAbdominal: '#E2CDA6',
  cavityPelvic: '#D9B9B3',
  planeSagittal: '#7F9EA8',
  planeCoronal: '#C79F82',
  planeTransverse: '#93AE86',
  quadrants: ['#A9BFC8', '#D6B79E', '#B9C8A9', '#C9B3C3'],
  regionA: '#C7D3D6',
  regionB: '#E2D0B8',
  regionC: '#C9D4BC',
};

export const STROKE = { outline: 2.2, detail: 1.1, fine: 0.8, bone: 1.6, dash: '5 4' };

// Shared figure placement: a standing figure is 872 local units tall.
export const LAYOUT = {
  figureScale: 1,
  figureTop: 60,
  figureCx: 725,
  margin: 60,
};
