import {
  InputHTMLAttributes,
  KeyboardEvent,
  KeyboardEventHandler,
  TextareaHTMLAttributes,
  forwardRef,
} from 'react';
import { InputRounded, InputSize, InputState, getInputCls } from './helper';
export interface InputBaseProps {
  size?: InputSize;
  state?: InputState;
  rounded?: InputRounded;
  onEnterPress?: (evt: KeyboardEvent) => void;
}
export type InputProps = InputBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;
function useInput<
  E extends HTMLInputElement | HTMLTextAreaElement,
  T extends InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>,
>({
  onEnterPress,
  onKeyDown,
  size,
  state,
  disabled,
  rounded,
  className,
  ...rest
}: InputBaseProps & T) {
  return {
    className: getInputCls({ size, state, disabled, rounded, className }),
    onKeyDown: (evt: KeyboardEvent<E>) => {
      if (evt.key === 'Enter') {
        onEnterPress?.(evt);
      }
      (onKeyDown as KeyboardEventHandler)?.(evt);
    },
    ...rest,
  };
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  return <input ref={ref} {...useInput(props)} />;
});

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> &
  InputBaseProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    return <textarea ref={ref} {...useInput(props)} />;
  },
);
