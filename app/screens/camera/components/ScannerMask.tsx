import { useWindowDimensions } from 'react-native';
import { Defs, Mask, Rect, Svg } from 'react-native-svg';

export const RECT_MASK_TOP_SPACE = 223;
export const RECT_SIZE = 280;

export const ScannerMask: React.FunctionComponent = () => {
  const dimensions = useWindowDimensions();
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Rect
            height={RECT_SIZE}
            width={RECT_SIZE}
            x={(dimensions.width - RECT_SIZE) / 2}
            y={RECT_MASK_TOP_SPACE}
            rx={10}
            ry={10}
            fill="black"
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(0, 0, 0, 0.7)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
};
