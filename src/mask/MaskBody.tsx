import { FC } from 'react';
import { isNumber } from 'lodash-es';
import { PortalToBody, useIncrementZIndex } from '../util';
import { Mask, MaskProps } from './Mask';

const MaskWithoutZ: FC<MaskProps> = (props) => {
  const [z] = useIncrementZIndex();
  return <Mask zIndex={z} {...props} />;
};

export const MaskBody: FC<MaskProps> = ({ zIndex, position, ...restProps }) => {
  return (
    <PortalToBody>
      {isNumber(zIndex) ? (
        <Mask zIndex={zIndex} position={position || 'fixed'} {...restProps} />
      ) : (
        <MaskWithoutZ position={position || 'fixed'} {...restProps} />
      )}
    </PortalToBody>
  );
};
