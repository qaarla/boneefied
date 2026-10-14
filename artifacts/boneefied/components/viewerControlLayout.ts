export type ViewerControlName = 'zoom-in' | 'zoom-out' | 'reset' | 'reveal-all' | 'hide-all';
export type ViewerControlCell = { name: ViewerControlName; width: number };
export const VIEWER_CONTROL_GAP = 4;
export const VIEWER_CONTROL_PADDING = 6;
export const VIEWER_CONTROL_TAP_SIZE = 44;

/** Use measured, scaled Tinos text widths rather than a font-scale breakpoint.
 * A single row is preferred. Otherwise keep zoom and label actions grouped;
 * split a group only when its actual labels cannot fit. */
export function viewerControlRows(width: number, textWidths: Partial<Record<ViewerControlName, number>>, showLabelActions: boolean): ViewerControlCell[][] {
  const available = Math.max(44, (Number.isFinite(width) && width > 0 ? width : 300) - VIEWER_CONTROL_PADDING * 2);
  const zoom: ViewerControlName[] = ['zoom-in', 'zoom-out', 'reset'];
  const labels: ViewerControlName[] = showLabelActions ? ['reveal-all', 'hide-all'] : [];
  const all = [...zoom, ...labels];
  const needed = (name: ViewerControlName) => Math.min(available, Math.max(VIEWER_CONTROL_TAP_SIZE, Math.ceil(textWidths[name] ?? 70) + 12));
  const fits = (names: ViewerControlName[]) => names.reduce((sum, name) => sum + needed(name), 0) + Math.max(0, names.length - 1) * VIEWER_CONTROL_GAP <= available;
  const groups = fits(all) ? [all] : [zoom, labels].filter(group => group.length);
  const rows: ViewerControlName[][] = [];
  for (const group of groups) {
    let row: ViewerControlName[] = [];
    for (const name of group) {
      if (row.length && !fits([...row, name])) { rows.push(row); row = []; }
      row.push(name);
    }
    if (row.length) rows.push(row);
  }
  return rows.map(row => {
    const occupied = row.reduce((sum, name) => sum + needed(name), 0) + (row.length - 1) * VIEWER_CONTROL_GAP;
    const extra = Math.max(0, available - occupied) / row.length;
    return row.map(name => ({ name, width: needed(name) + extra }));
  });
}
