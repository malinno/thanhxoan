import {
  Canvas,
  CanvasProps,
  DashPathEffect,
  Line,
  vec,
} from '@shopify/react-native-skia';
import dimensions from '@core/constants/dimensions.constant';
import { colors } from '@core/constants/colors.constant';
import { FunctionComponent } from 'react';

interface Props extends Partial<CanvasProps> {
  color?: string;
}

const DashedLine: FunctionComponent<Props> = ({ style, ...props }) => (
  <Canvas style={[{ height: 1, marginVertical: 12 }, style]} {...props}>
    <Line
      p1={vec(0, 0.5)}
      p2={vec(dimensions.width - 64, 0.5)}
      strokeWidth={1}
      color={colors.colorE3E5E8}>
      <DashPathEffect intervals={[4, 4]} />
    </Line>
  </Canvas>
);

DashedLine.defaultProps = {
  color: colors.colorE3E5E8,
};

export default DashedLine;
