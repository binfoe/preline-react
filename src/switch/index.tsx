import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';

export type SwitchSize = 'small' | 'default' | 'large';
const Themes: Record<SwitchSize, string> = {
  default: 'h-7 w-[3.25rem] before:h-6 before:w-6 ',
  small: 'w-11 h-6 before:w-5 before:h-5',
  large: 'w-[4.25rem] h-9 before:w-8 before:h-8',
};
export const Switch: FC<{
  value?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  size?: SwitchSize;
  disabled?: boolean;
  prefix?: ReactNode;
}> = ({
  value,
  onChange,
  children,
  prefix,
  className,
  style,
  size = 'default',
  disabled = false,
}) => {
  const ctrl = useRef(!isUndefined(value)); // 是否是受控模式
  const [v, setV] = useState(!!value);
  useEffect(() => {
    setV(!!value);
  }, [value]);
  return (
    <label
      style={style}
      className={cx('inline-flex items-center', disabled && 'opacity-50', className)}
    >
      {prefix && <span className='mr-3 text-sm text-gray-500 dark:text-gray-400'>{prefix}</span>}
      <input
        type='checkbox'
        disabled={disabled}
        checked={value}
        onChange={() => {
          if (ctrl.current) {
            onChange?.(!v);
          } else {
            setV(!v);
          }
        }}
        className={cx(
          'relative shrink-0 cursor-pointer appearance-none rounded-full border-2 border-transparent bg-gray-100 ring-1 ring-transparent ring-offset-white transition-colors duration-200 ease-in-out before:inline-block before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:bg-blue-600 checked:bg-none checked:before:translate-x-full checked:before:bg-blue-200 focus:border-blue-600 focus:outline-none focus:ring-blue-600 dark:bg-gray-700 dark:before:bg-gray-400 dark:checked:bg-blue-600 dark:checked:before:bg-blue-200 dark:focus:ring-offset-gray-800',
          Themes[size],
        )}
      />
      {children && (
        <span className='ml-3 text-sm text-gray-500 dark:text-gray-400'>{children}</span>
      )}
    </label>
  );
};
