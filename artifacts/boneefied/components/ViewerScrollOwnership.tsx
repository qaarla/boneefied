import { createContext, useContext } from 'react';

/** Leases are per viewer, so one release cannot unlock another active gesture. */
export const ViewerScrollOwnership = createContext({
  setOwnership: (_owner: symbol, _active: boolean) => {},
  getScrollY: (): number => 0,
});
export const useViewerScrollOwnership = () => useContext(ViewerScrollOwnership);
