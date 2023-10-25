import { CSSProperties, FC, ReactNode } from 'react';
import { cx } from 'cva';

export interface ProgressProps {
  className?: string;
  style?: CSSProperties;
  /** 百分比进度，0-100。默认为 50 */
  value?: number;
  /** 是否显示进度文本，默认为 true。也可直接传递 ReactNode 渲染。 */
  label?: boolean | ReactNode;
}

export const Progress: FC<ProgressProps> = ({ className, style, value = 50, label = true }) => {
  return (
    <div
      style={style}
      className={cx(
        'relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
        label ? 'min-h-[1rem]' : 'min-h-[0.375rem]',
        className,
      )}
    >
      <div
        className='absolute left-0 top-0 z-0 h-full bg-blue-500'
        style={{
          width: `${value}%`,
        }}
      ></div>
      {label && (
        <div className='relative z-[1] text-xs text-white'>
          {label === true ? `${value}%` : label}
        </div>
      )}
    </div>
  );
};
