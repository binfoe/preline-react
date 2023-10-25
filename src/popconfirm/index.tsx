import { FC, ReactNode } from 'react';
import { Popover, PopoverProps } from '../popover';
import { Button } from '../button';

export type PopconfirmProps = PopoverProps & {
  title?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};
export const Popconfirm: FC<PopconfirmProps> = ({
  title,
  loading,
  disabled,
  content,
  placement,
  onCancel,
  onConfirm,
  ...restProps
}) => {
  const renderContent = () => {
    return (
      <div className='flex flex-col'>
        {title ? <div className='mb-2 flex-shrink-0 font-semibold'>{title}</div> : null}
        <div className='mb-2 flex-1'>{content}</div>
        <div className='flex flex-shrink-0 items-center justify-end'>
          <Button
            onClick={() => {
              onCancel?.();
            }}
            size='small'
            type='white'
            disabled={loading || disabled}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm?.();
            }}
            size='small'
            loading={loading}
            disabled={disabled}
            className='ml-2'
          >
            确认
          </Button>
        </div>
      </div>
    );
  };

  return <Popover {...restProps} placement={placement || 'top-end'} content={renderContent()} />;
};
