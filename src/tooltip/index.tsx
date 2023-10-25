import { FC } from 'react';
import { cx } from 'cva';
import { Floating } from '../popover/floating';
import { PopoverProps } from '../popover';

export type TooltipProps = Omit<PopoverProps, 'trigger'> & {
  /** 触发方式，默认为 hover */
  trigger?: 'click' | 'hover';
};
export const Tooltip: FC<TooltipProps> = ({ trigger, className, ...restProps }) => {
  return (
    <Floating
      {...restProps}
      className={cx(
        'rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-sm dark:bg-slate-700',
        className,
      )}
      trigger={trigger || 'hover'}
    />
  );
};
