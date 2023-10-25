import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { CSSProperties, FC, ReactNode, useEffect, useRef, useState } from 'react';

export interface TabItem {
  key: string | number;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export type TabType =
  | 'underline'
  | 'card'
  | 'segment'
  | 'pills'
  | 'gray-pills'
  | 'vertical-underline';
export interface TabProps {
  type?: TabType;
  items: TabItem[];
  activeKey?: string | number;
  onChange?: (key: string | number) => void;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
}

const Themes: Partial<
  Record<
    TabType,
    {
      outer?: string;
      inner?: string;
      item: string[];
      badge: string[];
    }
  >
> = {
  underline: {
    outer: 'flex items-center border-b border-gray-200 dark:border-gray-700',
    inner: 'flex items-center gap-x-2',
    item: [
      'py-4 px-1.5 inline-flex items-center justify-center gap-2 border-b-[3px] text-sm whitespace-nowrap hover:text-blue-600',
      'border-transparent text-gray-500',
      'font-semibold border-blue-600 text-blue-600',
    ],
    badge: [
      'inline-flex items-center  ml-1 py-0.5 px-1.5 rounded-full text-xs font-medium',
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-white',
    ],
  },
  card: {
    outer: 'flex items-center border-b border-gray-200 dark:border-gray-700',
    inner: 'flex gap-x-2 items-center',
    item: [
      '-mb-px py-3 px-4 inline-flex rounded-t-lg items-center gap-2 bg-gray-50 text-sm font-medium text-center border',
      'text-gray-500 hover:text-gray-700 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
      'bg-white border-b-transparent text-blue-600 dark:bg-gray-800 dark:border-b-gray-800 dark:text-white',
    ],
    badge: [],
  },
  segment: {
    outer: 'flex items-center',
    inner:
      'flex gap-x-2 items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-gray-700 dark:hover:bg-gray-600',
    item: [
      'py-3 px-4 inline-flex items-center gap-2 text-sm text-gray-500 font-medium rounded-md',
      'bg-transparent hover:text-blue-600 dark:text-gray-400 dark:hover:text-white dark:hover:text-gray-300',
      'bg-white  text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:bg-gray-800',
    ],
    badge: [],
  },
  pills: {
    outer: 'flex items-center',
    inner: 'flex items-center gap-x-2',
    item: [
      'py-3 px-4 inline-flex justify-center items-center gap-2 text-sm font-medium text-center rounded-lg ',
      'bg-transparent text-gray-500 hover:text-blue-600 dark:hover:text-gray-400 dark:hover:text-gray-300',
      'bg-blue-600 text-white ',
    ],
    badge: [],
  },
  'gray-pills': {
    outer: 'flex items-center',
    inner: 'flex items-center gap-x-2',
    item: [
      'py-3 px-4 inline-flex justify-center items-center gap-2 text-sm font-medium text-center rounded-lg ',
      'bg-transparent text-gray-500 hover:text-blue-600 dark:hover:text-gray-400 dark:hover:text-gray-300',
      'bg-gray-200 text-gray-800 hover:text-gray-800 dark:bg-gray-700 dark:text-white',
    ],
    badge: [],
  },
  'vertical-underline': {
    outer: 'inline-flex flex-col items-center border-r border-gray-200 dark:border-gray-700',
    inner: 'flex flex-col gap-y-2',
    item: [
      'py-1 pr-4 inline-flex items-center gap-2 border-r-[3px] text-sm whitespace-nowrap',
      'border-transparent text-gray-500 hover:text-blue-600 dark:hover:text-gray-300',
      'border-blue-500 text-blue-600 dark:text-blue-600',
    ],
    badge: [],
  },
};
export const Tab: FC<TabProps> = ({
  type = 'underline',
  items,
  innerClassName,
  innerStyle,
  itemClassName,
  itemStyle,
  className,
  style,
  activeKey,
  onChange,
}) => {
  const ctrl = useRef(!isUndefined(activeKey)); // 受控模式
  const [ak, setAk] = useState(activeKey);
  useEffect(() => {
    setAk(activeKey);
  }, [activeKey]);
  const theme = Themes[type];
  return (
    <div className={cx(theme?.outer, className)} style={style}>
      <div className={cx(theme?.inner, innerClassName)} style={innerStyle}>
        {items?.map((item) => (
          <button
            onClick={() => {
              if (item.key === ak) return;
              if (!ctrl.current) {
                setAk(item.key);
              }
              onChange?.(item.key);
            }}
            key={item.key}
            style={{ ...itemStyle, ...item.style }}
            className={cx(
              'inline-flex items-center',
              theme?.item[0],
              ak === item.key ? theme?.item[2] : theme?.item[1],
              itemClassName,
              item.className,
            )}
          >
            {item.icon}
            {item.label}
            {item.badge && (
              <span
                className={cx(theme?.badge[0], ak === item.key ? theme?.badge[2] : theme?.badge[1])}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
