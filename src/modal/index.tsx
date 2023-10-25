import { FC, ReactNode, CSSProperties } from 'react';

export interface ModalProps {
  children?: ReactNode;
  title?: ReactNode;
  footer?: ReactNode | false;
  size?: 'small' | 'default' | 'large';
}
import { cx } from 'cva';
import { BsXLg } from 'react-icons/bs';
import { MaskBody } from '../mask';
import { Transition } from '../transition';
import { PortalToBody, useIncrementZIndexIfVisible } from '../util';
import { Button } from '../button';

const Sizes: Record<string, string> = {
  small: 'sm:max-w-lg sm:w-full m-3 sm:mx-auto',
  medium: 'md:max-w-2xl md:w-full m-3 md:mx-auto',
  large: 'lg:max-w-4xl lg:w-full m-3 lg:mx-auto',
  fullscreen: 'max-w-full w-full',
};
export const Modal: FC<{
  visible?: boolean;
  destroyAfterClose?: boolean;
  onMaskClick?: () => void;
  closeOnMaskClick?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  maskClassName?: string;
  maskStyle?: CSSProperties;
  title?: ReactNode;
  footer?: ReactNode | false;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  size?: 'small' | 'medium' | 'large' | 'fullscreen' | 'custom';
}> = ({
  children,
  visible = false,
  onMaskClick,
  destroyAfterClose = true,
  closeOnMaskClick,
  className,
  style,
  maskClassName,
  maskStyle,
  title,
  footer,
  confirmDisabled,
  confirmLoading,
  confirmText,
  cancelText,
  cancelDisabled,
  onCancel,
  onConfirm,
  size = 'medium',
}) => {
  const [z] = useIncrementZIndexIfVisible(visible);
  return (
    <>
      <MaskBody
        visible={visible}
        zIndex={z}
        className={maskClassName}
        style={maskStyle}
        destroyAfterHide={destroyAfterClose}
        onClick={() => {
          if (closeOnMaskClick !== false) {
            onMaskClick?.();
            onCancel?.();
          }
        }}
      />
      <PortalToBody>
        <Transition
          enterFrom='-translate-y-1/4 opacity-0'
          enterTo='opacity-1 translate-y-0'
          enterActive='transition-[transform,opacity] duration-300'
          leaveFrom='opacity-1 translate-y-0'
          leaveActive='transition-[opacity] duration-100'
          leaveTo='opacity-0'
          leaveDone='hidden'
          isEnter={!!visible}
          destroyAfterLeave={destroyAfterClose}
        >
          <div
            style={{ ...style, zIndex: z }}
            className={cx(
              'fixed left-1/2 top-5 -translate-x-1/2 rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-slate-700/[.7]',
              Sizes[size],
              className,
            )}
          >
            {title && (
              <div className='flex items-center justify-between border-b px-4 py-3 dark:border-gray-700'>
                <h3 className='font-bold text-gray-800 dark:text-white'>{title}</h3>
                <button
                  type='button'
                  onClick={() => {
                    onCancel?.();
                  }}
                  className='inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-500 transition-all hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800'
                >
                  <BsXLg />
                </button>
              </div>
            )}
            <div className='p-4'>{children}</div>
            {footer !== false &&
              (footer || (
                <div className='flex items-center justify-end gap-x-2 border-t px-4 py-3 dark:border-gray-700'>
                  <Button
                    type='white'
                    disabled={cancelDisabled}
                    onClick={() => {
                      onCancel?.();
                    }}
                  >
                    {cancelText || '取消'}
                  </Button>
                  <Button
                    type='solid'
                    disabled={confirmDisabled}
                    loading={confirmLoading}
                    onClick={() => {
                      onConfirm?.();
                    }}
                  >
                    {confirmText || '确认'}
                  </Button>
                </div>
              ))}
          </div>
        </Transition>
      </PortalToBody>
    </>
  );
};
