import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { Floating, FloatingProps } from '../popover/floating';
import { DropdownContext } from './context';

export type DropdownProps = FloatingProps;
export const Dropdown: FC<DropdownProps> = ({
  className,
  visible,
  onVisibleChange,
  ...restProps
}) => {
  const ctrl = useRef(!isUndefined(visible)); // 如果 visible 不是 undefined 的话，是受控模式
  const [vis, setVis] = useState(!!visible);
  useEffect(() => {
    setVis(!!visible);
  }, [visible]);
  const onItemClick = useCallback((evt?: Event) => {
    if (ctrl.current) {
      onVisibleChange?.(false, evt);
    } else {
      setVis(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DropdownContext.Provider value={onItemClick}>
      <Floating
        visible={vis}
        onVisibleChange={(v, evt) => {
          if (ctrl.current) {
            onVisibleChange?.(v, evt);
          } else {
            setVis(v);
          }
        }}
        placement='bottom-start'
        enterFrom='opacity-0 translate-y-2'
        enterActive='transition-[opacity,transform] duration-300 ease-in'
        enterTo='opacity-1 translate-y-0'
        leaveFrom='opacity-1 translate-y-0'
        leaveActive='transition-[opacity,transform] duration-300 ease-out'
        leaveTo='opacity-0 translate-y-2'
        {...restProps}
        className={cx(
          'mt-2 min-w-[15rem] rounded-lg border bg-white p-2 shadow-md dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800',
          className,
        )}
      />
    </DropdownContext.Provider>
  );
};
