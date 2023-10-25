import {
  CSSProperties,
  DOMAttributes,
  FC,
  Key,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { isUndefined } from 'lodash-es';
import { cx } from 'cva';
import { Floating, FloatingProps } from '../popover/floating';

type TitleItem =
  | {
      key?: Key;
      title: string | number | boolean;
    }
  | {
      title: ReactElement;
      key: Key;
    };
type ButtonItem = {
  onClick?: (evt: MouseEvent) => void;
  disabled?: boolean;
  /** 点击按钮后，是否自动关闭 Dropdown。默认为 true */
  autoClose?: boolean;
  icon?: ReactNode;
} & (
  | {
      key?: Key;
      label: string | number | boolean;
    }
  | {
      label: ReactElement;
      key: Key;
    }
);
export type DropdownItemProps = DOMAttributes<HTMLButtonElement> & {
  className?: string;
  style?: CSSProperties;
} & (TitleItem | ButtonItem);

export type DropdownProps = Omit<FloatingProps, 'content'> & {
  items: (DropdownItemProps | '-')[];
};

function isTitle(item: DropdownItemProps): item is TitleItem {
  return !isUndefined((item as TitleItem).title);
}

export const Dropdown: FC<DropdownProps> = ({
  className,
  visible,
  onVisibleChange,
  items,
  ...restProps
}) => {
  const ctrl = useRef(!isUndefined(visible)); // 如果 visible 不是 undefined 的话，是受控模式
  const [vis, setVis] = useState(!!visible);
  useEffect(() => {
    setVis(!!visible);
  }, [visible]);
  const onItemClick = (evt?: Event) => {
    if (!ctrl.current) {
      setVis(false);
    }
    onVisibleChange?.(false, evt);
  };
  return (
    <Floating
      visible={vis}
      onVisibleChange={(v, evt) => {
        if (!ctrl.current) {
          setVis(v);
        }
        onVisibleChange?.(v, evt);
      }}
      placement='bottom-start'
      enterFrom='opacity-0 translate-y-2'
      enterActive='transition-[opacity,transform] duration-300 ease-in'
      enterTo='opacity-1 translate-y-0'
      leaveFrom='opacity-1 translate-y-0'
      leaveActive='transition-[opacity,transform] duration-300 ease-out'
      leaveTo='opacity-0 translate-y-2'
      className={cx(
        'mt-2 min-w-[15rem] rounded-lg border bg-white p-2 shadow-md dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800',
        className,
      )}
      content={items.map((item, i) => {
        if (item === '-') {
          return <div key={i} className='my-2 border-b border-gray-200'></div>;
        } else if (isTitle(item)) {
          return (
            <div
              key={isUndefined(item.key) ? item.title.toString() : item.key}
              style={item.style}
              className={cx(
                'px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500',
                item.className,
              )}
            >
              {item.title}
            </div>
          );
        } else {
          return (
            <button
              key={isUndefined(item.key) ? item.label.toString() : item.key}
              style={item.style}
              disabled={item.disabled}
              type='button'
              className={cx(
                'flex w-full items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 disabled:text-gray-200 disabled:hover:bg-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300',
                item.className,
              )}
              onClick={(evt) => {
                if (item.autoClose !== false) {
                  onItemClick(evt as unknown as Event);
                }
                item.onClick?.(evt);
              }}
              {...restProps}
            >
              {item.icon && <span>{item.icon}</span>}
              {(item as ButtonItem).label}
            </button>
          );
        }
      })}
      {...restProps}
    />
  );
};
