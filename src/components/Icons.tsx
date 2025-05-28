import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
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

export const ShieldIcon = ({ size = 24, color }: IconProps) => {
  return <Feather name='shield' size={size} color={color} />;
};

export const AddIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='plus' size={size} color={color} />;
};

export const SendIcon = ({ size = 24, color }: IconProps) => {
  return <FontAwesome name='send' size={size} color={color} />;
};

export const CloseCircleoIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='closecircleo' size={size} color={color} />;
};

export const ClockCircleOIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='clockcircleo' size={size} color={color} />;
};

export const MegaphoneIcon = ({ size = 24, color }: IconProps) => {
  return <Ionicons name='megaphone' size={size} color={color} />;
};

export const PaperClipIcon = ({ size = 24, color }: IconProps) => {
  return <Feather name='paperclip' size={size} color={color} />;
};

export const FilterIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='filter' size={size} color={color} />;
};

export const EnvelopeOpenIcon = ({ size = 24, color }: IconProps) => {
  return <FontAwesome6 name='envelope-open' size={size} color={color} />;
};

export const EnvelopeIcon = ({ size = 24, color }: IconProps) => {
  return <FontAwesome6 name='envelope' size={size} color={color} />;
};

export const RefreshIcon = ({ size = 24, color }: IconProps) => {
  return <Feather name='refresh-ccw' size={size} color={color} />;
};

export const CrossCricleIcon = ({ size = 24, color }: IconProps) => {
  return <Entypo name='circle-with-cross' size={size} color={color} />;
};

export const TrophyIcon = ({ size = 24, color }: IconProps) => {
  return <AntDesign name='Trophy' size={size} color={color} />;
};

export const CalendarIcon = ({ size = 24, color }: IconProps) => {
  return <Feather name='calendar' size={size} color={color} />;
};

export const LocationIcon = ({ size = 24, color }: IconProps) => {
  return <EvilIcons name='location' size={size} color={color} />;
};
