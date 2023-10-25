import { FC, Key, ReactElement, ReactNode, cloneElement, useMemo, useRef, useState } from 'react';
import { uid, useNonFirstEffect } from '../util';

interface Item {
  isEnter: boolean;
  key: Key;
  node: ReactElement;
}
const W: FC<{ children: ReactNode }> = ({ children }) => {
  return children;
};
function k(children: ReactElement[], onLeave: (key: Key) => void, appear = false) {
  return children.map((node) => {
    const key = node.key || uid();
    const item = cloneElement(node, {
      key,
      isEnter: true,
      appear,
      onAfterLeave() {
        onLeave(key);
      },
    });
    return {
      key,
      node: item,
      isEnter: true,
    };
  });
}
export const TransitionGroup: FC<{
  children: ReactElement[];
}> = ({ children }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoList = useMemo<Item[]>(() => k(children, onLeave), []);
  const refList = useRef(memoList);
  const [renderList, setRenderList] = useState<Item[]>(memoList);

  function onLeave(key: Key) {
    // console.log('AFTER LEAVE', key);
    const idx = refList.current.findIndex((item) => item.key === key);
    if (idx >= 0) {
      refList.current.splice(idx, 1);
      setRenderList(refList.current.slice());
    } else {
      // eslint-disable-next-line no-console
      console.warn('something strange wrong');
    }
  }

  useNonFirstEffect(() => {
    const newItems = k(children, onLeave, true);
    const newKeys = Object.fromEntries(newItems.map((it, i) => [it.key.toString(), i]));
    // console.log('CCC', newKeys, children.length, refList);
    const oldKeys = new Set();
    refList.current.forEach((old) => {
      oldKeys.add(old.key);
      const newIdx = newKeys[old.key.toString()];
      if (newIdx === undefined) {
        if (old.isEnter) {
          old.isEnter = false;
          old.node = cloneElement(old.node, { isEnter: false });
          // console.log('REMOVE', old.node);
        }
      } else {
        old.isEnter = true;
        old.node = cloneElement(newItems[newIdx].node, { isEnter: true });
      }
    });
    newItems.forEach((item) => {
      if (!oldKeys.has(item.key)) {
        refList.current.push(item);
      }
    });
    setRenderList(refList.current.slice());
  }, [children]);

  return (
    <>
      {renderList.map((item) => (
        <W key={item.key}>{item.node}</W>
      ))}
    </>
  );
};
