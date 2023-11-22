import { cx } from 'cva';
import { isUndefined } from 'lodash-es';
import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { MenuDivider, MenuItemProps } from './common';

export function calcMenuHeight(item: MenuItemProps, openKeys: string[]) {
  if (!item.children) return 0;
  return (
    8 +
    item.children.reduce((pv, it) => {
      if (it === '-') {
        return pv + 9;
      }
      pv += 36;
      if (it.children?.length && openKeys.includes(it.key)) {
        pv += calcMenuHeight(it, openKeys);
      }
      return pv;
    }, 0)
  );
}

export interface NavMenuProps {
  className?: string;
  style?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  onClick?: (args: { item: MenuItemProps }) => void;
  openKeys?: string[];
  selectedKeys?: string[];
  onOpenChange?: (openKeys: string[]) => void;
  onSelect?: (selectedKeys: string[]) => void;
  items: (MenuItemProps | '-')[];
}

const ItemCls =
  'box-border flex cursor-pointer items-center py-2 px-2.5 text-sm rounded-md hover:bg-gray-100 dark:bg-gray-900';

const MenuLabel: FC<{
  item: MenuItemProps;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  onClick: NavMenuProps['onClick'];
  selected?: boolean;
  open?: boolean;
  className?: string;
}> = ({ item, itemClassName, itemStyle, onClick, selected, open, className }) => {
  return (
    <div
      className={cx(
        ItemCls,
        open !== true && selected && 'bg-gray-100',
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
      {item.icon && <div className='mr-3.5 h-3.5 w-3.5 flex-shrink-0'>{item.icon}</div>}
      <div className='flex-1 truncate [&>a]:block [&>a]:w-full'>{item.name}</div>
      {item.shortKey && <div>{item.shortKey}</div>}
      {open === undefined ? null : (
        <BsChevronDown
          className={cx(
            'h-3 w-3 flex-shrink-0 text-gray-600 transition-[transform] duration-300 dark:text-gray-400',
            open && 'rotate-180',
          )}
        />
      )}
    </div>
  );
};

const MenuItem: FC<{
  item: MenuItemProps;
  level: number;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  className?: string;
  openKeys: string[];
  selectKeys: string[];
  onClick?: NavMenuProps['onClick'];
  onSelect: (item: MenuItemProps) => void;
  onOpenChange: (item: MenuItemProps, isOpen: boolean) => void;
}> = ({
  item,
  level,
  className,
  itemClassName,
  itemStyle,
  openKeys,
  selectKeys,
  onSelect,
  onClick,
  onOpenChange,
}) => {
  const [height, isOpen] = useMemo(() => {
    // console.log(openKeys, item.key);
    if (!item.children?.length || !openKeys.includes(item.key)) return [0, false];
    return [calcMenuHeight(item, openKeys), true];
  }, [item, openKeys]);

  if (item.children?.length) {
    return (
      <>
        <MenuLabel
          item={item}
          open={isOpen}
          itemClassName={itemClassName}
          itemStyle={itemStyle}
          className={className}
          onClick={() => {
            onClick?.({ item });
            onOpenChange(item, !isOpen);
          }}
        />
        <div
          style={{
            height: isOpen ? height : 0,
          }}
          className={cx(
            level === 0 ? 'pl-3' : 'pl-2',
            'box-content overflow-hidden pt-2 transition-all',
          )}
        >
          {item.children.map((subitem, i) =>
            subitem === '-' ? (
              <MenuDivider key={i} />
            ) : (
              <MenuItem
                key={subitem.key}
                item={subitem}
                itemClassName={itemClassName}
                itemStyle={itemStyle}
                level={level + 1}
                openKeys={openKeys}
                selectKeys={selectKeys}
                onSelect={onSelect}
                onOpenChange={onOpenChange}
              />
            ),
          )}
        </div>
      </>
    );
  } else {
    return (
      <MenuLabel
        className={className}
        selected={selectKeys.indexOf(item.key) >= 0}
        item={item}
        itemClassName={itemClassName}
        itemStyle={itemStyle}
        onClick={() => {
          onClick?.({ item });
          onSelect(item);
        }}
      />
    );
  }
};

export const NavMenu: FC<NavMenuProps> = ({
  items,
  className,
  style,
  itemClassName,
  itemStyle,
  onClick,
  onOpenChange,
  onSelect,
  openKeys,
  selectedKeys,
}) => {
  const openCtrl = useRef(!isUndefined(openKeys));
  const [opens, setOpens] = useState(openKeys || []);
  useEffect(() => {
    setOpens(openKeys || []);
  }, [openKeys]);
  const selectCtrl = useRef(!isUndefined(selectedKeys));
  const [selects, setSelects] = useState(selectedKeys || []);
  useEffect(() => {
    setSelects(selectedKeys || []);
  }, [selectedKeys]);

  // console.log('RRR', openKeys, opens);
  return (
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
            level={0}
            openKeys={opens}
            selectKeys={selects}
            onSelect={(item) => {
              const newKeys = selects.slice();
              if (newKeys.indexOf(item.key) < 0) {
                newKeys.push(item.key);
                if (!selectCtrl.current) {
                  setSelects(newKeys);
                } else {
                  onSelect?.(newKeys);
                }
              }
            }}
            onClick={onClick}
            onOpenChange={(item, isOpen) => {
              const newKeys = opens.slice();
              if (isOpen) {
                newKeys.push(item.key);
              } else {
                const i = newKeys.indexOf(item.key);
                if (i >= 0) newKeys.splice(i, 1);
              }
              if (!openCtrl.current) {
                setOpens(newKeys);
              }
              onOpenChange?.(newKeys);
            }}
          />
        ),
      )}
    </div>
  );
};
