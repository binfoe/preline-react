import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { CSSProperties, FC, ReactElement, forwardRef, useEffect, useRef, useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { FloatingTree, Placement } from '@floating-ui/react';
import { Floating, FloatingProps } from '../popover/floating';
import { MenuDivider, MenuItemProps } from './common';

export interface AppMenuProps {
  className?: string;
  style?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  onClick?: (args: { item: MenuItemProps }) => void;
  items: (MenuItemProps | '-')[];
  children: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean, evt?: Event) => void;
  placement?: Placement;
  trigger?: 'click' | 'hover';
  offset?: FloatingProps['offset'];
}

const ItemCls =
  'relative flex cursor-pointer items-center py-2 px-2.5 text-sm rounded-md hover:bg-gray-100 dark:bg-gray-900';

const MenuLabel = forwardRef<
  HTMLDivElement,
  {
    item: MenuItemProps;
    itemClassName?: string;
    itemStyle?: CSSProperties;
    onClick: AppMenuProps['onClick'];
    selected?: boolean;
    hasSub?: boolean;
    className?: string;
  }
>(function MenuLabel(
  { item, itemClassName, itemStyle, onClick, selected, hasSub, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        ItemCls,
        className,
        itemClassName,
        item.className,
        selected ? 'text-blue-600' : 'text-slate-700  dark:text-white',
      )}
      style={{ ...itemStyle, ...item.style }}
      onClick={() => {
        onClick?.({ item });
      }}
    >
      {item.icon && <span className='mr-3.5 h-3.5 w-3.5 flex-shrink-0'>{item.icon}</span>}
      <span className='flex-1 truncate'>{item.name}</span>
      {item.shortKey && <span>{item.shortKey}</span>}
      {hasSub && <BsChevronRight className={cx('flex-shrink-0 text-gray-600')} />}
    </div>
  );
});

const MenuItem: FC<{
  item: MenuItemProps;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  className?: string;
  onClick?: AppMenuProps['onClick'];
}> = ({ item, className, itemClassName, itemStyle, onClick }) => {
  const renderLabel = (hasSub: boolean) => (
    <MenuLabel
      className={className}
      item={item}
      hasSub={hasSub}
      itemClassName={itemClassName}
      itemStyle={itemStyle}
      onClick={() => {
        onClick?.({ item });
      }}
    />
  );
  if (item.children?.length) {
    return (
      <AppMenuInner
        items={item.children}
        itemClassName={itemClassName}
        itemStyle={itemStyle}
        onClick={onClick}
        trigger='hover'
        placement='right-start'
      >
        {renderLabel(true)}
      </AppMenuInner>
    );
  } else {
    return renderLabel(false);
  }
};

const AppMenuInner: FC<AppMenuProps> = ({
  items,
  className,
  style,
  itemClassName,
  itemStyle,
  onClick,
  onOpenChange,
  open,
  ...restProps
}) => {
  const ctrl = useRef(!isUndefined(open));
  const [vis, setVis] = useState(!!open);
  useEffect(() => {
    setVis(!!open);
  }, [open]);
  return (
    <Floating
      visible={vis}
      onVisibleChange={(v, evt) => {
        if (!ctrl.current) {
          setVis(v);
        }
        onOpenChange?.(v, evt);
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
      content={
        <div className={cx('flex flex-col', className)} style={style}>
          {items.map((item, i) =>
            item === '-' ? (
              <MenuDivider key={i} />
            ) : (
              <MenuItem
                key={item.key}
                item={item}
                itemClassName={itemClassName}
                itemStyle={itemStyle}
                className={cx(i > 0 && items.length > 1 && 'mt-1.5')}
                onClick={onClick}
              />
            ),
          )}
        </div>
      }
      {...restProps}
    />
  );
};
export const AppMenu: FC<AppMenuProps> = (props) => {
  return (
    <FloatingTree>
      <AppMenuInner {...props} />
    </FloatingTree>
  );
};
