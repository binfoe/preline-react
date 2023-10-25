import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function useFirstEffect(cb: EffectCallback, deps?: DependencyList) {
  const first = useRef(true);
  useEffect(() => {
    if (!first.current) return;
    first.current = false;
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useNonFirstEffect(cb: EffectCallback, deps?: DependencyList) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
