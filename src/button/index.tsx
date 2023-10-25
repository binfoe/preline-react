import { ReactNode, DOMAttributes, CSSProperties, forwardRef, ButtonHTMLAttributes } from 'react';
import { cx } from 'cva';
import { Spin } from '../spin';

type ButtonEventAttrs = Pick<
  DOMAttributes<HTMLButtonElement>,
  'onClick' | 'onMouseDown' | 'onMouseMove' | 'onMouseUp'
>;
export type ButtonProps = {
  type?: 'solid' | 'outline' | 'ghost' | 'soft' | 'white' | 'link';
  size?: 'small' | 'default' | 'large';
  color?: 'red' | 'blue' | 'green' | 'gray' | 'indigo' | 'purple' | 'pink' | 'white' | 'blank';
  rounded?: boolean;
  full?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
} & ButtonEventAttrs;

const SizeTws = {
  default: 'py-3 px-4',
  small: 'py-2 px-3',
  large: 'py-3 px-4 sm:p-5',
};

const TypeTws = {
  solid:
    'inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800',
  outline:
    'inline-flex justify-center items-center gap-2 rounded-md border-2 border-blue-200 font-semibold text-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:border-gray-700 dark:hover:border-blue-500',
  ghost:
    'inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm',
  soft: 'inline-flex justify-center items-center gap-2 rounded-md bg-blue-100 border border-transparent font-semibold text-blue-500 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm',
  white:
    'inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800',
  link: 'py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm',
};

function getClasses(
  type: ButtonProps['type'],
  size: ButtonProps['size'],
  color: ButtonProps['color'],
) {
  let classes = TypeTws[type || 'solid'];
  if (color && color !== 'blue') {
    if (color === 'blank') {
      classes = classes.replaceAll('-blue-500', '-gray-800').replaceAll('-blue-600', '-gray-900');
    } else if (color === 'white') {
      classes = classes.replaceAll('-blue-500', '-white').replaceAll('-blue-600', '-gray-500');
    } else {
      classes = classes.replaceAll('-blue-', `-${color}-`);
    }
  }
  return cx(SizeTws[size || 'default'], classes);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    type,
    size,
    htmlType = 'button',
    color,
    rounded,
    full,
    loading,
    className,
    children,
    ...restProps
  } = props;
  if (loading) {
    restProps.disabled = true;
  }
  const classes = cx(
    className,
    rounded && 'rounded-full',
    full && 'w-full',
    getClasses(type, size, color),
  );
  return (
    <button type={htmlType} className={classes} {...restProps} ref={ref}>
      {loading && <Spin />}
      {children}
    </button>
  );
});
