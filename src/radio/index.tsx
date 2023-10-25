import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';

export interface RadioOption<V> {
  label: ReactNode;
  value: V;
  key?: string;
}
export interface RadioProps<V> {
  className?: string;
  style?: CSSProperties;
  value?: V;
  onChange?: (v: V) => void;
  vertical?: boolean;
  options: RadioOption<V>[];
  disabled?: boolean;
}
export function RadioGroup<V extends string | number | object>({
  className,
  style,
  value,
  onChange,
  options,
  vertical = false,
  disabled = false,
}: RadioProps<V>) {
  const ctrl = useRef(!isUndefined(value)); // 是否是受控模式
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value);
  }, [value]);
  return (
    <div style={style} className={cx('flex items-center gap-4', vertical && 'flex-col', className)}>
      {options?.map((opt) => (
        <Radio
          disabled={disabled}
          key={opt.key || opt.value.toString()}
          value={v === opt.value}
          onChange={() => {
            if (v === opt.value) return;
            if (ctrl.current) {
              onChange?.(opt.value);
            } else {
              setV(opt.value);
              onChange?.(opt.value);
            }
          }}
        >
          {opt.label}
        </Radio>
      ))}
    </div>
  );
}
export const Radio: FC<{
  value?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  disabled?: boolean;
}> = ({ value, onChange, children, className, style, disabled = false }) => {
  const ctrl = useRef(!isUndefined(value)); // 是否是受控模式
  const [v, setV] = useState(!!value);
  useEffect(() => {
    setV(!!value);
  }, [value]);
  return (
    <label
      style={style}
      className={cx(
        'inline-flex items-center',
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
    >
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
        className='mt-0.5 shrink-0 rounded-full border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800'
      />
      {children && (
        <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>{children}</span>
      )}
    </label>
  );
};
