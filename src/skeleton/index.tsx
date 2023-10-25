import { FC } from 'react';
import { cx } from 'cva';
export const Skeleton: FC<{
  animate?: boolean;
  avatar?: boolean;
}> = ({ animate = true, avatar = true }) => {
  return (
    <div className={cx('flex', animate && 'animate-pulse')}>
      {avatar && (
        <div className='mr-4 flex-shrink-0'>
          <span className='block h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700'></span>
        </div>
      )}
      <div className={cx('w-full', avatar && 'mt-2')}>
        <h3 className='h-4 w-2/5 rounded-md bg-gray-200 dark:bg-gray-700'></h3>

        <ul className='mt-5 space-y-3'>
          <li className='h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700'></li>
          <li className='h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700'></li>
          <li className='h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700'></li>
          <li className='h-4 w-full rounded-md bg-gray-200 dark:bg-gray-700'></li>
        </ul>
      </div>
    </div>
  );
};
