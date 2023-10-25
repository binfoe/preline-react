import { useEffect, useRef, useState } from 'react';

let currentCoverZIndex = 10;
const watchers = new Set<() => void>();

function change(z: number) {
  currentCoverZIndex = z;
  watchers.forEach((fn) => fn());
  return z;
}

function inc() {
  change(currentCoverZIndex + 10);
  return currentCoverZIndex;
}
function dec() {
  change(currentCoverZIndex - 10);
  return currentCoverZIndex;
}
/**
 * get z-index incremented by a level(that is, +10). used by components like MaskBody
 */
export function useIncrementZIndex() {
  const [z] = useState(() => {
    return inc();
  });
  useEffect(() => {
    dec();
  }, []);
  return [z];
}
/**
 * get z-index incrementd by a level(that is, +10) if visible come to true.
 * usebed by compoents like Popup, Modal
 */
export function useIncrementZIndexIfVisible(visible: boolean) {
  const [z, setZ] = useState(currentCoverZIndex);
  const incrmented = useRef(false);
  useEffect(() => {
    if (visible && !incrmented.current) {
      incrmented.current = true;
      setZ(inc());
    }
    if (!visible && incrmented.current) {
      incrmented.current = false;
      setZ(dec());
    }
  }, [visible]);
  useEffect(() => {
    return () => {
      if (incrmented.current) {
        dec();
      }
    };
  }, []);
  return [z];
}

/**
 * get topest z-index + offset(default is 1), but won't watch it. used by components like tooltip
 */
export function useCurrentZIndex(offset = 1) {
  return [currentCoverZIndex + offset];
}

/**
 * get topest z-index + offset(default is 1), and watch to it. used by components like Toast
 */
export function useLatestZIndex(offset = 1) {
  const [z, setZ] = useState(currentCoverZIndex + offset);
  useEffect(() => {
    const handler = () => {
      setZ(currentCoverZIndex + offset);
    };
    watchers.add(handler);
    return () => {
      watchers.delete(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [z];
}
