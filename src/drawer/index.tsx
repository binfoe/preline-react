import { CSSProperties, FC, MouseEvent, ReactNode } from 'react';
import { cx } from 'cva';
import { BsXLg } from 'react-icons/bs';
import { MaskBody } from '../mask';
import { Transition } from '../transition';
import { PortalToBody, useIncrementZIndexIfVisible } from '../util';

export interface DrawerProps {
  placement?: 'left' | 'right' | 'bottom' | 'top';
  title?: ReactNode;
  visible?: boolean;
  onVisibleChange?: (visible: boolean, evt?: MouseEvent) => void;
  destroyAfterClose?: boolean;
  onMaskClick?: (evt?: MouseEvent) => void;
  closeOnMaskClick?: boolean;
  noMask?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  maskClassName?: string;
  maskStyle?: CSSProperties;
}

const Themes = {
  left: {
    cn: 'top-0 left-0 h-full min-w-[20rem]',
    tf: '-translate-x-full',
    tt: 'translate-x-0',
  },
  right: {
    cn: 'top-0 right-0 h-full min-w-[20rem]',
    tf: 'translate-x-full',
    tt: 'translate-x-0',
  },
  bottom: {
    cn: 'bottom-0 left-0 w-full min-h-[20rem]',
    tf: 'translate-y-full',
    tt: 'translate-y-0',
  },
  top: {
    cn: 'top-0 left-0 w-full min-h-[20rem]',
    tf: '-translate-y-full',
    tt: 'translate-y-0',
  },
};
export const Drawer: FC<DrawerProps> = ({
  placement = 'left',
  title,
  children,
  visible = false,
  onVisibleChange,
  onMaskClick,
  destroyAfterClose = true,
  closeOnMaskClick,
  noMask,
  className,
  style,
  maskClassName,
  maskStyle,
}) => {
  const [z] = useIncrementZIndexIfVisible(!!visible);
  return (
    <>
      {!noMask && (
        <MaskBody
          zIndex={z}
          visible={visible}
          className={maskClassName}
          style={maskStyle}
          destroyAfterHide={destroyAfterClose}
          onClick={(evt) => {
            onMaskClick?.(evt);
            if (closeOnMaskClick !== false) {
              onVisibleChange?.(false, evt);
            }
          }}
        />
      )}
      <PortalToBody>
        <Transition
          enterFrom={Themes[placement].tf}
          enterActive='transition-transform duration-300 ease-in'
          enterTo={Themes[placement].tt}
          leaveFrom={Themes[placement].tt}
          leaveActive='transition-transform duration-300 ease-out'
          leaveTo={Themes[placement].tf}
          isEnter={!!visible}
          destroyAfterLeave={destroyAfterClose}
        >
          <div
            style={{ ...style, zIndex: z }}
            className={cx(
              'fixed border-b bg-white  dark:border-gray-700 dark:bg-gray-800',
              Themes[placement].cn,
              className,
            )}
          >
            {title && (
              <div className='flex items-center justify-between border-b px-4 py-3 dark:border-gray-700'>
                <h3 className='font-bold text-gray-800 dark:text-white'>{title}</h3>
                <button
                  onClick={(evt) => {
                    onVisibleChange?.(false, evt);
                  }}
                  className='inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-500 dark:hover:text-gray-400 dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800'
                >
                  <BsXLg />
                </button>
              </div>
            )}
            <div className='px-4 py-4'>{children}</div>
          </div>
        </Transition>
      </PortalToBody>
    </>
  );
};

export const Popup: FC<Omit<DrawerProps, 'placement'>> = (props) => {
  return <Drawer {...props} placement='bottom' />;
};
