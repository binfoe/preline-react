import { cx } from 'cva';

export type InputState = 'default' | 'error' | 'success' | 'none';
export type InputRounded = 'md' | 'full' | 'none';
export type InputSize = 'small' | 'default' | 'large' | 'xsmall' | 'none';

export const InputThemes: {
  rounded: Record<InputRounded, string>;
  state: Record<InputState, string>;
  size: Record<InputSize, string>;
} = {
  size: {
    default: 'py-3 px-4',
    small: 'py-2 px-3',
    large: 'py-3 px-4 sm:p-5',
    xsmall: 'py-1 px-2',
    none: '',
  },
  state: {
    default:
      'border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:border-gray-700',
    error:
      'border-red-500 focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-red-400 ',
    success:
      'border-green-500 focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-green-400',
    none: '',
  },
  rounded: {
    md: 'rounded-md',
    full: 'rounded-full',
    none: '',
  },
};

export function getInputCls({
  size = 'default',
  state = 'default',
  className,
  rounded = 'md',
  disabled,
}: {
  size?: InputSize;
  state?: InputState;
  rounded?: InputRounded;
  disabled?: boolean;
  className?: string;
}) {
  return cx(
    'block border text-sm dark:text-gray-400 dark:bg-slate-900',
    disabled && 'bg-gray-50 opacity-70 pointer-events-none',
    InputThemes.size[size],
    InputThemes.state[state],
    InputThemes.rounded[rounded],
    className,
  );
}
