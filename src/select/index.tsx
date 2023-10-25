import { CSSProperties, Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { isUndefined } from 'lodash-es';
import { cx } from 'cva';
import { Dropdown, DropdownItemProps } from '../dropdown';
import { Input } from '../input/input';

export type SelectOptionProps<V> = {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  value: V;
  /** 当 value 不是 string/number 类型时必须指定 key */
  key?: Key;
  label: ReactNode;
};

export interface SelectProps<V> {
  options: SelectOptionProps<V>[];
  value?: V;
  valueRender?: (v?: V) => string;
  onChange?: (v: V) => void;
  className?: string;
  style?: CSSProperties;
}

export function Select<V>({ options, value, className, valueRender, onChange }: SelectProps<V>) {
  const ctrl = useRef(!isUndefined(value));
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value);
  }, [value]);

  const items = useMemo(
    () =>
      options.map((opt) => {
        return {
          className: opt.className,
          style: opt.style,
          onClick: () => {
            if (!ctrl.current) {
              setV(opt.value);
            }
            onChange?.(opt.value);
          },
          label: opt.label,
          key: isUndefined(opt.key) ? opt.value : opt.key,
        } as DropdownItemProps;
      }),
    [options, onChange],
  );

  return (
    <Dropdown items={items}>
      <div className={cx('relative flex items-center [&>input]:w-full', className)}>
        <Input size='xsmall' readOnly value={valueRender ? valueRender(v) : v?.toString()} />
        <BsChevronDown className='absolute right-2 top-1/2 -translate-y-1/2' />
      </div>
    </Dropdown>
  );
}
