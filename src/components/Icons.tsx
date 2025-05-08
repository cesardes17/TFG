import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';

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

export const HomeIcon = ({ color, size = 24 }: IconProps) => {
  return <Ionicons name='home' color={color} size={size} />;
};

export const UserCircleIcon = ({ color, size = 24 }: IconProps) => {
  return <FontAwesome name='user-circle-o' color={color} size={size} />;
};

export const LogInIcon = ({ color, size = 24 }: IconProps) => {
  return <SimpleLineIcons name='login' color={color} size={size} />;
};

export const MenuIcon = ({ color, size = 24 }: IconProps) => {
  return <Feather name='menu' size={size} color={color} />;
};

export const CircleCheckIcon = ({ color, size = 24 }: IconProps) => {
  return <Feather name='check-circle' size={size} color={color} />;
};

export const WeightHangingIcon = ({ size = 24, color }: IconProps) => {
  return <FontAwesome5 name='weight-hanging' size={size} color={color} />;
};

export const BasketballOutlineIcon = ({ size = 24, color }: IconProps) => {
  return <Ionicons name='basketball-outline' size={size} color={color} />;
};

export const RulerIcon = ({ size = 24, color }: IconProps) => {
  return <Entypo name='ruler' size={size} color={color} />;
};

export const BadgeAccountIcon = ({ size = 24, color }: IconProps) => {
  return (
    <MaterialCommunityIcons name='badge-account' size={size} color={color} />
  );
};

export const AtIcon = ({ size = 24, color }: IconProps) => {
  return <MaterialIcons name='alternate-email' size={size} color={color} />;
};

export const UserIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='user' size={size} color={color} />;
};

export const WarningIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='warning' size={size} color={color} />;
};

export const InfoIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='infocirlceo' size={size} color={color} />;
};
