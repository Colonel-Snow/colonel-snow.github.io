/*
  The cuts of Home that exist, newest last. Each entry is a block of values at
  the foot of Home.css and nothing else — adding '03' here and copying a block
  there is the entire procedure for a new version.

  It sits in its own module rather than in Home.tsx on purpose: a component
  file that also exports constants loses React Fast Refresh, which would turn
  every style tweak into a full page reload. Iteration speed is the whole
  point of this file existing, so it would be a poor trade.
*/
export const VERSIONS = ['01', '02']
