import { CSSProperties, FC, ReactNode } from 'react';
import { cx } from 'cva';
import {
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsInfoCircle,
  BsInfoCircleFill,
  BsXCircleFill,
} from 'react-icons/bs';

type AlertType = 'tip' | 'dark' | 'info' | 'error' | 'success' | 'warn';
export interface AlertProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}
const theme: Record<AlertType, string> = {
  dark: 'bg-gray-800/[.1] border-gray-200 text-gray-600 dark:bg-gray-900/[.1] dark:border-gray-700 dark:text-white',
  info: 'bg-blue-50 border-blue-200 text-blue-600',
  tip: 'border-gray-200 bg-gray-50 text-gray-600',
  error: 'bg-red-50 border-red-200 text-red-600',
  success: 'bg-green-50 border-green-200 text-green-600',
  warn: 'bg-orange-50 border-orange-200 text-orange-600',
};
export const Alert: FC<
  AlertProps & {
    type: AlertType;
    icon?: ReactNode;
  }
> = ({ icon, children, type, className, style }) => {
  return (
    <div style={style} className={cx(theme[type], 'flex rounded-md border p-4 text-sm', className)}>
      {icon ? (
        <div className='mr-2 mt-0.5 h-4 w-4 flex-shrink-0 [&>svg]:h-full [&>svg]:w-full'>
          {icon}
        </div>
      ) : null}
      {children}
    </div>
  );
};

export const AlertInfo: FC<AlertProps> = (props) => {
  return <Alert {...props} type='info' icon={<BsInfoCircleFill />} />;
};

export const AlertSuccess: FC<AlertProps> = (props) => {
  return <Alert {...props} type='success' icon={<BsCheckCircleFill />} />;
};

export const AlertWarn: FC<AlertProps> = (props) => {
  return <Alert {...props} type='warn' icon={<BsExclamationTriangleFill />} />;
};

export const AlertTip: FC<AlertProps> = (props) => {
  return <Alert {...props} type='tip' icon={<BsInfoCircle />} />;
};

export const AlertError: FC<AlertProps> = (props) => {
  return <Alert {...props} type='error' icon={<BsXCircleFill />} />;
};

export const AlertDark: FC<AlertProps> = (props) => {
  return <Alert {...props} type='dark' icon={<BsInfoCircle />} />;
};
