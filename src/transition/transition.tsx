import {
  FC,
  ReactElement,
  cloneElement,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { isFunction } from 'lodash-es';
import { useNonFirstEffect } from '../util';
import { TransitionCallbacks, TransitionProps, applyTransition, clsarr } from './core';
type Props = {
  children: ReactElement;
  destroyAfterLeave?: boolean;
} & TransitionProps &
  TransitionCallbacks<Element>;

const TransitionInner: FC<
  Props & {
    onMounted: (el: Element) => void;
  }
> = ({ children, isEnter, appear, onMounted, ...props }) => {
  const ref = useRef<HTMLElement>(null);
  const tr = useRef<{ cancel(notify: boolean): void }>();
  if (children.props.ref) {
    throw new Error('todo...');
  }
  const toggle = (realEnter?: boolean) => {
    // console.log('TOGGLE TRANSITION', realEnter);
    const el = ref?.current;
    if (!el) return;
    tr.current?.cancel(true);
    tr.current = applyTransition({
      cs: props,
      isEnter: !!realEnter,
      el,
      cbs: props,
    });
  };

  useNonFirstEffect(() => {
    toggle(isEnter);
  }, [isEnter]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    onMounted(ref.current);

    if (appear) {
      toggle(isEnter);
    } else {
      const ecs = clsarr(`${props.enterDone} ${props.enterTo}`);
      const lcs = clsarr(`${props.leaveDone} ${props.leaveTo}`);
      (isEnter ? ecs : lcs).forEach((c) => {
        ref.current?.classList.add(c);
      });
    }
    return () => {
      tr.current?.cancel(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log('RENDER INNER ', className);
  return cloneElement(children, {
    // className,
    ref,
  });
};
/**
 * 模仿 VUE3 风格的 Transition 组件。
 * https://vuejs.org/guide/built-ins/transition.html
 */
// eslint-disable-next-line react/display-name
export const Transition = forwardRef<Element, Props>(
  ({ destroyAfterLeave = false, onAfterLeave, isEnter, appear, ...restProps }, ref) => {
    const [mounted, setMounted] = useState(!destroyAfterLeave || isEnter);
    const [realEnter, setRealEnter] = useState(mounted && isEnter);
    const first = useRef(true);

    useEffect(() => {
      if (!first.current) {
        if (isEnter) {
          if (!mounted) {
            setMounted(true);
          }
          setRealEnter(true);
        } else {
          if (mounted) {
            setRealEnter(false);
          }
        }
      }
      first.current = false;
    }, [isEnter, mounted]);

    return mounted ? (
      <TransitionInner
        isEnter={realEnter}
        appear={(first.current && appear) || !first.current}
        onAfterLeave={(el) => {
          onAfterLeave?.(el);
          // console.log('AFTER LEAVE');
          if (destroyAfterLeave) {
            setMounted(false);
          }
        }}
        {...restProps}
        onMounted={(el) => {
          if (isFunction(ref)) {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
      />
    ) : null;
  },
);
