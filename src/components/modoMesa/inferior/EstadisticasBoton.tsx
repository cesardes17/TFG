import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface EstadisticaBotonProps {
  onPress: () => void;
  backgroundColor: string;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const EstadisticaBoton: React.FC<EstadisticaBotonProps> = ({
  onPress,
  backgroundColor,
  disabled = false,
  children,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.boton,
        { backgroundColor },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default EstadisticaBoton;
