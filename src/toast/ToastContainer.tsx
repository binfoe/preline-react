import { CSSProperties, FC, ReactNode, forwardRef, useEffect, useState } from 'react';
import { BsXLg } from 'react-icons/bs';
import { cx } from 'cva';
import { TransitionGroup, Transition } from '../transition';
import { useLatestZIndex } from '../util';

export interface ToastOptions {
  icon?: ReactNode;
  content: ReactNode;
  duration?: number;
  closable?: boolean;
  loading?: boolean;
  afterClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

type Toast = ToastOptions & { id: string };

export interface ToastInstance {
  close: () => void;
}

export const toastConfig = {
  maxQueue: 10,
  defaultDuration: 3000,
};

export const emitter = {
  push: new Set<(toast: Toast) => void>(),
  clear: new Set<() => void>(),
  close: new Set<(id: string) => void>(),
};

// eslint-disable-next-line react/display-name
const ToastItem = forwardRef<HTMLDivElement, { toast: Toast; onClose: (id: string) => void }>(
  ({ toast, onClose }, ref) => {
    return (
      <div
        ref={ref}
        style={toast.style}
        className={cx(
          'pointer-events-auto mt-3 max-w-xs rounded-md border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800',
          toast.className,
        )}
      >
        <div className='flex p-4'>
          {toast.loading ? (
            <div
              className='inline-block h-4 w-4 flex-shrink-0 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600'
              role='status'
              aria-label='loading'
            ></div>
          ) : null}
          {toast.icon ? (
            <div
              className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-stretch justify-stretch [&>svg]:h-full [&>svg]:w-full`}
            >
              {toast.icon}
            </div>
          ) : null}
          <div className='ml-3 flex-1'>
            <p className='text-sm text-gray-700 dark:text-gray-400'>{toast.content}</p>
          </div>
          {toast.closable ? (
            <button
              type='button'
              onClick={() => onClose(toast.id)}
              className='ml-8 mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-gray-400 transition-all hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800'
            >
              <BsXLg className='h-3.5 w-3.5' />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);
export const ToastContainer: FC = () => {
  const [queue, setQueue] = useState<Toast[]>([]);
  const close = (id: string) => {
    setQueue((q) => {
      const idx = q.findIndex((t) => t.id === id);
      if (idx >= 0) q.splice(idx, 1);
      return q.slice();
    });
  };
  useEffect(() => {
    const onPush = (toast: Toast) => {
      setQueue((q) => {
        const newQueue = [toast, ...q];
        if (newQueue.length > toastConfig.maxQueue) {
          newQueue.pop();
        }
        return newQueue;
      });
    };
    const onClear = () => {
      setQueue([]);
    };
    emitter.push.add(onPush);
    emitter.clear.add(onClear);
    emitter.close.add(close);
    return () => {
      emitter.push.delete(onPush);
      emitter.clear.delete(onClear);
      emitter.close.delete(close);
    };
  }, []);

  const [z] = useLatestZIndex(2);
  return (
    <div
      style={{ zIndex: z }}
      className={`pointer-events-none fixed left-1/2 top-0 -translate-x-1/2`}
    >
      <TransitionGroup>
        {queue.map((toast) => (
          <Transition
            key={toast.id}
            enterFrom='-translate-y-[80%] opacity-0'
            enterActive='transition-[opacity,transform] duration-[300ms,300ms] ease-in'
            enterTo='opacity-1 translate-y-0'
            leaveFrom='opacity-1 translate-y-0'
            leaveActive='transition-[opacity,transform] duration-[300ms,100ms] ease-out'
            leaveTo='-translate-y-[80%] opacity-0'
          >
            <ToastItem toast={toast} onClose={close} />
          </Transition>
        ))}
      </TransitionGroup>
    </div>
  );
};
