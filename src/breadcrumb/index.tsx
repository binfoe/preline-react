import { CSSProperties, FC, ReactNode } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { cx } from 'cva';

export interface BreadcrumbItem {
  name: ReactNode;
  icon?: ReactNode;
}
export const Breadcrumb: FC<{
  items: BreadcrumbItem[];
  className?: string;
  style?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
}> = ({ items, className, style, itemClassName, itemStyle }) => {
  const renderItem = (item: BreadcrumbItem, i: number) => {
    const isLast = i === items.length - 1;
    return (
      <li
        key={i}
        style={itemStyle}
        className={cx(
          'flex items-center text-sm text-gray-800 dark:text-gray-400',
          isLast && 'font-semibold',
          itemClassName,
        )}
      >
        {item.icon && <span>{item.icon}</span>}
        {item.name}
        {!isLast ? (
          <BsChevronRight className='mx-3 h-2.5 w-2.5 flex-shrink-0 overflow-visible text-gray-400 dark:text-gray-600' />
        ) : null}
      </li>
    );
  };
  return (
    <ol className={cx('flex min-w-0 items-center whitespace-nowrap', className)} style={style}>
      {items.map((item, i) => renderItem(item, i))}
    </ol>
  );
};
