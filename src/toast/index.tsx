import { isNumber, isString } from 'lodash-es';
import {
  BsInfoCircleFill,
  BsXCircleFill,
  BsCheckCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import { ReactNode } from 'react';
import { uid } from '../util/uid';

import { ToastInstance, ToastOptions, emitter, toastConfig } from './ToastContainer';

function show(toast: string | ToastOptions) {
  if (isString(toast)) {
    toast = {
      content: toast,
    };
  }
  const id = uid();
  const duration = isNumber(toast.duration) ? toast.duration : toastConfig.defaultDuration;
  if (duration > 0) {
    setTimeout(() => {
      emitter.close.forEach((handler) => handler(id));
    }, duration);
  }
  emitter.push.forEach((handler) => {
    handler({
      ...(toast as ToastOptions),
      id,
    });
  });

  return {
    close: () => {
      emitter.close.forEach((handler) => handler(id));
    },
    update: (content: ReactNode) => {
      emitter.update.forEach((handler) => handler(id, content));
    },
  } as ToastInstance;
}

export const Toast = {
  config(cfg: Partial<typeof toastConfig>) {
    Object.assign(toastConfig, cfg);
  },
  show,
  info(options: string | Omit<ToastOptions, 'type'>) {
    if (isString(options)) options = { content: options };
    return show({
      ...options,
      icon: <BsInfoCircleFill className='text-blue-500' />,
    });
  },
  error(options: string | Omit<ToastOptions, 'type'>) {
    if (isString(options)) options = { content: options };
    return show({
      ...options,
      icon: <BsXCircleFill className='text-red-500' />,
    });
  },
  warn(options: string | Omit<ToastOptions, 'type'>) {
    if (isString(options)) options = { content: options };
    return show({
      ...options,
      icon: <BsExclamationCircleFill className='text-orange-500' />,
    });
  },
  success(options: string | Omit<ToastOptions, 'type'>) {
    if (isString(options)) options = { content: options };
    return show({
      ...options,
      icon: <BsCheckCircleFill className='text-green-500' />,
    });
  },
  clear() {
    emitter.clear.forEach((handler) => handler());
  },
};
