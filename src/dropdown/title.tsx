import { CSSProperties, FC, ReactNode } from 'react';
import { cx } from 'cva';
export const DropdownTitle: FC<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ children, className, style }) => {
  return (
    <div
      style={style}
      className={cx(
        'px-3 py-2 text-xs font-medium uppercase text-gray-400 dark:text-gray-500',
        className,
      )}
    >
      {children}
    </div>
  );
};
