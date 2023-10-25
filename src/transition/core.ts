import { setImmediate, clearImmediate } from '../util/setimm';

type DurationType = 'transitionend' | 'animationend';

function getDurationType(el: Element): DurationType | undefined {
  const cst = getComputedStyle(el);
  if (cst.getPropertyValue('transition-duration') !== '0s') {
    return 'transitionend';
  } else if (cst.getPropertyValue('animation-duration') !== '0s') {
    return 'animationend';
  }
  return undefined;
}

// function parseDuration(v: string): number {
//   if (/ms$/.test(v)) {
//     return parseInt(v);
//   } else if (/s$/.test(v)) {
//     return parseFloat(v) * 1000;
//   } else {
//     return 0;
//   }
// }

// type Duration = {
//   type: DurationType | undefined;
//   time: number;
// };
// function getDuration(el: Element): Duration {
//   const cst = getComputedStyle(el);
//   let dur = cst.getPropertyValue('transition-duration');
//   if (dur !== '0s') {
//     return {
//       type: 'transitionend',
//       time: parseDuration(dur),
//     };
//   }
//   dur = cst.getPropertyValue('animation-duration');
//   if (dur !== '0s') {
//     return {
//       type: 'animationend',
//       time: parseDuration(dur),
//     };
//   }
//   return {
//     type: undefined,
//     time: 0,
//   };
// }

export interface TransitionClassnames {
  enterFrom?: string;
  enterActive?: string;
  enterTo?: string;
  enterDone?: string;
  leaveFrom?: string;
  leaveActive?: string;
  leaveTo?: string;
  leaveDone?: string;
}
export interface TransitionProps extends TransitionClassnames {
  isEnter?: boolean;
  /** 首次是否动画呈现 */
  appear?: boolean;
}
export interface TransitionCallbacks<T extends Element> {
  onEnter?(el: T): void;
  onBeforeEnter?(el: T): void;
  onAfterEnter?(el: T): void;
  onEnterCancelled?(el: T): void;
  onLeave?(el: T): void;
  onBeforeLeave?(el: T): void;
  onAfterLeave?(el: T): void;
  onLeaveCancelled?(el: T): void;
}

export function clsarr(v?: string) {
  if (!v) return [];
  v = v.trim();
  if (!v) return [];
  return v.split(/\s+/);
}

export function applyTransition<T extends Element>({
  cs,
  isEnter,
  el,
  cbs,
}: {
  cs: TransitionClassnames;
  isEnter: boolean;
  el: T;
  cbs: TransitionCallbacks<T>;
}) {
  const fromClass = clsarr(isEnter ? cs.enterFrom : cs.leaveFrom);
  const activeClass = clsarr(isEnter ? cs.enterActive : cs.leaveActive);
  const toClass = clsarr(isEnter ? cs.enterTo : cs.leaveTo);
  const doneClass = clsarr(isEnter ? cs.enterDone || cs.enterTo : cs.leaveDone || cs.leaveTo);
  const preDoneClass = clsarr(
    isEnter ? `${cs.leaveDone} ${cs.leaveTo}` : `${cs.enterDone} ${cs.enterTo}`,
  );
  el.classList.remove(...preDoneClass);
  el.classList.add(...fromClass);
  getDurationType(el); // force re-render
  el.classList.add(...activeClass);
  isEnter ? cbs?.onBeforeEnter?.(el) : cbs?.onBeforeLeave?.(el);
  let cancel: ((notify: boolean) => void) | undefined = undefined;
  let imm = setImmediate(() => {
    imm = 0;
    // 将 fromClass 移除，同时加入 toClass 触发动画
    // 但如果 getDurationType 为空，说明 activeClass 并没生效，直接退出。
    const dt = getDurationType(el);
    if (!dt) {
      el.classList.remove(...fromClass);
      el.classList.add(...toClass);
      isEnter ? cbs?.onAfterEnter?.(el) : cbs?.onAfterLeave?.(el);
      return;
    }
    const clear = () => {
      cancel = undefined;
      el.removeEventListener(dt, onEnd);
      el.classList.remove(...activeClass);
      el.classList.add(...doneClass);
    };
    const onEnd = (evt: Event) => {
      if (evt.target !== el) {
        return;
      }
      clear();
      isEnter ? cbs?.onAfterEnter?.(el) : cbs?.onAfterLeave?.(el);
    };
    el.addEventListener(dt, onEnd);
    cancel = (notify: boolean) => {
      clear();
      if (notify) {
        isEnter ? cbs?.onEnterCancelled?.(el) : cbs?.onLeaveCancelled?.(el);
      }
    };

    el.classList.remove(...fromClass);
    el.classList.add(...toClass);
    isEnter ? cbs?.onEnter?.(el) : cbs?.onLeave?.(el);
  });

  return {
    cancel(notify: boolean) {
      if (imm) clearImmediate(imm);
      if (cancel) cancel(notify);
    },
  };
}

// /**
//  * 模仿 VUE3 风格的 Transition 动画。使用方式见 src/components/transition 组件源码。
//  * https://vuejs.org/guide/built-ins/transition.html
//  */
// export function useTransition<T extends Element>(
//   ref: MutableRefObject<T>,
//   props: TransitionProps & TransitionCallbacks<T>,
// ) {
//   // const ref = useRef<T>(null);

//   return {
//     ref,
//     tr,
//   };
// }
