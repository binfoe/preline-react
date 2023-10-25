import { CSSProperties, DOMAttributes, FC, MouseEvent, ReactNode, useContext } from 'react';
import { cx } from 'cva';
import { DropdownContext } from './context';
export interface DropdownItemProps extends DOMAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (evt: MouseEvent) => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  /** 点击按钮后，是否自动关闭 Dropdown。默认为 true */
  autoClose?: boolean;
}
export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  className,
  style,
  disabled,
  onClick,
  autoClose,
  ...restProps
}) => {
  const closeFn = useContext(DropdownContext);
  return (
    <button
      style={style}
      disabled={disabled}
      type='button'
      className={cx(
        'flex w-full items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 disabled:text-gray-200 disabled:hover:bg-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300',
        className,
      )}
      onClick={(evt) => {
        if (autoClose !== false) {
          closeFn?.(evt as unknown as Event);
        }
        onClick?.(evt);
      }}
      {...restProps}
    >
      {children}
    </button>
  );
};
