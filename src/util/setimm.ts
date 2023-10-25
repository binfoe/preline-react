/**
 * setImmediate polyfill only for modern browsers
 * Copied from https://github.com/YuzuJS/setImmediate/blob/master/setImmediate.js
 * Simplified by Yuhang-Ge<abeyuhang@gmail.com>
 */

import { isFunction, isString, isUndefined } from 'lodash-es';

let autoIncrement = 0;
let nextHandle = 1; // Spec says greater than zero
let tasksByHandle: Map<number, () => void>;
let currentlyRunningATask = false;
let registerImmediate: (nextHandle: number) => void;

function setImmediateFallback(callback: () => void): number {
  if (!isFunction(callback) || arguments.length > 1) {
    throw new Error('setImmediate require callback function.');
  }
  tasksByHandle.set(nextHandle, callback);
  registerImmediate(nextHandle);
  // console.log('siiii', callback);
  return nextHandle++;
}

function clearImmediateFallback(handle: number): void {
  tasksByHandle.delete(handle);
}

function runIfPresent(handle: number): void {
  // From the spec: 'Wait until any invocations of this algorithm started before this one have completed.'
  // So if we're currently running a task, we'll need to delay this invocation.
  if (currentlyRunningATask) {
    // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
    // 'too much recursion' error.
    setTimeout(runIfPresent, 0, handle);
    return;
  }
  const callback = tasksByHandle.get(handle);
  // console.log('stttt', handle, callback);

  if (!callback) return;
  currentlyRunningATask = true;
  try {
    callback();
  } finally {
    clearImmediateFallback(handle);
    currentlyRunningATask = false;
  }
}

const win = (typeof window === 'undefined' ? globalThis : window) as unknown as Window & {
  setImmediate: (callback: () => void) => number;
  clearImmediate: (immediate: number) => void;
};
if (isUndefined(win.setImmediate)) {
  tasksByHandle = new Map();
  const messagePrefix = `setImmediate$${(autoIncrement++).toString(32)}$`;
  win.addEventListener(
    'message',
    (event) => {
      if (event.source === window && isString(event.data) && event.data.startsWith(messagePrefix)) {
        runIfPresent(Number(event.data.slice(messagePrefix.length)));
      }
    },
    false,
  );

  registerImmediate = function (handle: number): void {
    win.postMessage(messagePrefix + handle, '*');
  };
}

export const setImmediate = win.setImmediate || setImmediateFallback;
export const clearImmediate = win.clearImmediate || clearImmediateFallback;
