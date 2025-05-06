import { MaterialIcons } from '@expo/vector-icons';

interface IconProps {
  color: string;
  size?: number;
}

export const ArrowBackIosIcon = ({ color, size = 24 }: IconProps) => {
  return <MaterialIcons name='arrow-back-ios-new' color={color} size={size} />;
};

export const ArrowBackIcon = ({ color, size = 24 }: IconProps) => {
  return <MaterialIcons name='arrow-back' color={color} size={size} />;
};
