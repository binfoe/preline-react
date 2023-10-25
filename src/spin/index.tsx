import { CSSProperties, FC } from 'react';
import { cx } from 'cva';

export interface SpinProps {
  className?: string;
  style?: CSSProperties;
  size?: 'sm' | 'md' | 'lg';
}
const Sizes: Record<Exclude<SpinProps['size'], undefined>, string> = {
  sm: 'h-4 w-4 border-[3px]',
  md: 'w-6 h-6 border-[3px]',
  lg: 'w-8 h-8 border-[3px]',
};
export const Spin: FC<SpinProps> = ({ className, style, size = 'sm' }) => {
  return (
    <span
      style={style}
      className={cx(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        Sizes[size],
        className,
      )}
    ></span>
  );
};
