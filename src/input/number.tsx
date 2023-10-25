import { isNumber } from 'lodash-es';
import { FC, InputHTMLAttributes, useEffect, useState } from 'react';
import { InputBaseProps } from './input';
import { getInputCls } from './helper';

export type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'size'
> &
  InputBaseProps & {
    value?: number;
    onChange?: (v: number) => void;
  };

export const NumberInput: FC<NumberInputProps> = ({
  disabled,
  size,
  state,
  rounded,
  className,
  value,
  min,
  max,
  step = 1,
  onEnterPress,
  onChange,
  onKeyDown,
  ...rest
}) => {
  const [ipt, setIpt] = useState<string>(isNumber(value) ? value.toString() : '');
  useEffect(() => {
    setIpt(isNumber(value) ? value.toString() : '');
  }, [value]);
  return (
    <input
      type='number'
      disabled={disabled}
      className={getInputCls({ size, state, rounded, disabled, className })}
      min={min}
      step={step}
      max={max}
      value={ipt}
      onChange={(evt) => {
        setIpt(evt.target.value);
        let v = evt.target.valueAsNumber;
        if (!Number.isNaN(v)) {
          if (step === 1) {
            v = Math.round(v);
          }
          onChange?.(v);
        }
      }}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter') {
          onEnterPress?.(evt);
        }
        onKeyDown?.(evt);
      }}
      {...rest}
    />
  );
};
