import {
  CSSProperties,
  MouseEvent,
  ReactElement,
  ReactNode,
  cloneElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { isUndefined } from 'lodash-es';
import { cx } from 'cva';
import { Dropdown, DropdownItem } from '../dropdown';
import { Input } from '../input/input';

export interface SelectOptionProps<V> {
  value: V;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (v: V, evt: MouseEvent) => void;
}
export function SelectOption<V>({ value, children, onClick, ...rest }: SelectOptionProps<V>) {
  return (
    <DropdownItem
      {...rest}
      onClick={(evt) => {
        onClick?.(value, evt);
      }}
    >
      {children}
    </DropdownItem>
  );
}

export interface SelectProps<V> {
  children: ReactElement[];
  value?: V;
  valueRender?: (v?: V) => string;
  onChange?: (v: V) => void;
  className?: string;
}

export function Select<V>({ children, value, className, valueRender, onChange }: SelectProps<V>) {
  const ctrl = useRef(!isUndefined(value));
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value);
  }, [value]);

  const renderContent = () => {
    return children.map((cc) => {
      const oldOnClick = cc.props.onClick;
      return cloneElement(cc, {
        onClick: (v: V, e: Event) => {
          oldOnClick?.(v, e);
          if (ctrl.current) {
            onChange?.(v);
          } else {
            setV(v);
          }
        },
      });
    });
  };
  return (
    <Dropdown content={renderContent()}>
      <div className={cx('relative flex items-center [&>input]:w-full', className)}>
        <Input size='xsmall' readOnly value={valueRender ? valueRender(v) : v?.toString()} />
        <BsChevronDown className='absolute right-2 top-1/2 -translate-y-1/2' />
      </div>
    </Dropdown>
  );
}
