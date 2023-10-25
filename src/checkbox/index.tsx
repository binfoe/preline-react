import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';

export interface CheckboxOption<V> {
  label: ReactNode;
  value: V;
  key?: string;
}
export interface CheckboxProps<V> {
  className?: string;
  style?: CSSProperties;
  value?: V[];
  onChange?: (v: V[]) => void;
  vertical?: boolean;
  options: CheckboxOption<V>[];
  disabled?: boolean;
}
export function CheckboxGroup<V extends string | number | object>({
  className,
  style,
  value,
  onChange,
  options,
  vertical = false,
  disabled = false,
}: CheckboxProps<V>) {
  const ctrl = useRef(!isUndefined(value)); // 是否是受控模式
  const [v, setV] = useState(value || []);
  useEffect(() => {
    setV(value || []);
  }, [value]);
  return (
    <div style={style} className={cx('flex items-center gap-4', vertical && 'flex-col', className)}>
      {options?.map((opt) => (
        <Checkbox
          disabled={disabled}
          key={opt.key || opt.value.toString()}
          value={v.includes(opt.value)}
          onChange={() => {
            const nv = v.slice();
            const idx = nv.indexOf(opt.value);
            if (idx >= 0) {
              nv.splice(idx, 1);
            } else {
              nv.push(opt.value);
            }
            if (ctrl.current) {
              onChange?.(nv);
            } else {
              setV(nv);
              onChange?.(nv);
            }
          }}
        >
          {opt.label}
        </Checkbox>
      ))}
    </div>
  );
}
export const Checkbox: FC<{
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
            onChange?.(!v);
          }
        }}
        className='mt-0.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800'
      />
      {children && (
        <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>{children}</span>
      )}
    </label>
  );
};
