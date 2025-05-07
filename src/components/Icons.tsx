import {
  Feather,
  FontAwesome,
  Ionicons,
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
