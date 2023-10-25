import { CSSProperties, FC, ReactNode } from 'react';

export interface MenuItemProps {
  key: string;
  name: ReactNode;
  icon?: ReactNode;
  shortKey?: ReactNode;
  children?: (MenuItemProps | '-')[];
  className?: string;
  style?: CSSProperties;
}
export const MenuDivider: FC = () => {
  return <div className='my-1 h-0 w-full border-b' />;
};
