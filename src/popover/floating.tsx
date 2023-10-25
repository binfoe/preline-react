import { FC, ReactElement, ReactNode, cloneElement, useEffect, useRef, useState } from 'react';
import {
  useFloating,
  Placement,
  autoUpdate,
  offset,
  useInteractions,
  useHover,
  flip,
  shift,
  useClick,
  useDismiss,
  OffsetOptions,
  FloatingPortal,
  safePolygon,
  useFloatingNodeId,
  FloatingNode,
} from '@floating-ui/react';
import { isUndefined } from 'lodash-es';
import { cx } from 'cva';
import { useCurrentZIndex } from '../util';
import { Transition } from '../transition';
import { TransitionCallbacks, TransitionClassnames } from '../transition/core';
export type FloatingDuration = number | { open: number; close: number };
export type FloatingProps = TransitionClassnames &
  TransitionCallbacks<HTMLDivElement> & {
    visible?: boolean;
    onVisibleChange?: (v: boolean, evt?: Event) => void;
    className?: string;
    content: ReactNode;
    children: ReactElement;
    /** 位置，默认是 top */
    placement?: Placement;
    /** 触发方式，默认是 click */
    trigger?: 'click' | 'hover';
    /** 延迟显示，毫秒。trigger 为 hover 时默认为 300，trigger 为 click 时默认为 0 */
    delay?: FloatingDuration;
    offset?: OffsetOptions;
  };

// function defaultOffset(p: Placement) {
//   if (p.startsWith('top')) return 20;
//   return 10;
// }
export const Floating: FC<FloatingProps> = ({
  children,
  content,
  placement = 'top',
  trigger,
  delay,
  className,
  visible,
  offset: ofs,
  onVisibleChange,

  ...transitionProps
}) => {
  const nodeId = useFloatingNodeId();
  // console.log('FNN', nodeId);
  const [isOpen, setIsOpen] = useState(!!visible);
  const ctrl = useRef(!isUndefined(visible)); // 如果 visible 不是 undefined 的话，是受控模式
  useEffect(() => {
    ctrl.current = !isUndefined(visible);
    setIsOpen(!!visible);
  }, [visible]);
  const { refs, floatingStyles, context } = useFloating({
    nodeId,
    open: isOpen,
    onOpenChange: (v, evt) => {
      if (ctrl.current) {
        onVisibleChange?.(v, evt); // 受控模式传递事件到外层，由外层控制 visible
      } else {
        setIsOpen(v);
      }
    },
    strategy: 'fixed',
    placement: placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(isUndefined(ofs) ? /* defaultOffset(placement) */ 8 : ofs),
      flip(),
      shift(),
    ],
    transform: false,
  });
  const isTriggerClick = trigger !== 'hover';
  const opts = {
    delay: !isUndefined(delay) ? delay : isTriggerClick ? 0 : { open: 300, close: 0 },
  };
  const hover = useHover(context, {
    enabled: !isTriggerClick,
    ...opts,
    handleClose: safePolygon(),
  });
  const click = useClick(context, {
    enabled: isTriggerClick,
    ...opts,
  });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss]);
  const triggerEl = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps(),
  });

  const [z] = useCurrentZIndex();

  return (
    <>
      {triggerEl}
      <FloatingNode id={nodeId}>
        <FloatingPortal>
          <Transition
            isEnter={isOpen}
            enterFrom='opacity-0 scale-[0.8]'
            enterActive='transition-[opacity,transform] duration-[0.25s,0.1s] ease-in'
            enterTo='opacity-1 scale-100'
            leaveFrom='opacity-1 scale-100'
            leaveActive='transition-[opacity,transform] duration-[0.2s,0.2s] ease-out'
            leaveTo='opacity-0 scale-[1.05]'
            destroyAfterLeave
            {...transitionProps}
            ref={refs.setFloating}
          >
            <div
              className={cx(className, 'opacity-0')}
              style={{
                ...floatingStyles,
                zIndex: z,
              }}
              {...getFloatingProps()}
            >
              {content}
            </div>
          </Transition>
        </FloatingPortal>
      </FloatingNode>
    </>
  );
};
