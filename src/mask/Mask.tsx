import { cx } from 'cva';
import { CSSProperties, FC, MouseEvent, ReactNode } from 'react';
import { Transition } from '../transition';

export interface MaskProps {
  visible?: boolean;
  onClick?: (evt: MouseEvent<HTMLDivElement>) => void;
  onClose?: () => void;
  position?: 'absolute' | 'fixed' | 'relative';
  zIndex?: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** 在隐藏时销毁 DOM，默认为 true */
  destroyAfterHide?: boolean;
}
export const Mask: FC<MaskProps> = ({
  visible,
  position = 'absolute',
  zIndex,
  children,
  className,
  style,
  onClick,
  onClose,
  destroyAfterHide = true,
}) => {
  return (
    <Transition
      enterFrom='bg-opacity-0'
      enterActive='transition-background duration-300 ease-in'
      enterTo='bg-opacity-50 dark:bg-opacity-80'
      leaveFrom='bg-opacity-50 dark:bg-opacity-80'
      leaveActive='transition-background duration-300 ease-out'
      leaveTo='bg-opacity-0'
      leaveDone='hidden'
      isEnter={visible !== false}
      destroyAfterLeave={destroyAfterHide}
      onAfterLeave={() => {
        onClose?.();
      }}
    >
      <div
        style={{ ...style, zIndex }}
        className={cx(position, 'inset-0 left-0 top-0 h-full w-full bg-gray-900', className)}
        onClick={(evt) => {
          onClick?.(evt);
        }}
      >
        {children}
      </div>
    </Transition>
  );
};
