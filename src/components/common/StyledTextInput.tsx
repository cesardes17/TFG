// src/components/common/StyledTextInput.tsx
import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface StyledTextInputProps extends TextInputProps {
  error?: boolean;
  /** Estilos aplicados al View wrapper */
  containerStyle?: StyleProp<ViewStyle>;
  /** Estilos aplicados al TextInput */
  inputStyle?: StyleProp<TextStyle>;
}

export default function StyledTextInput({
  editable = true,
  style,
  onBlur,
  onFocus,
  error = false,
  containerStyle,
  inputStyle,
  ...rest
}: StyledTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();

  const getInputState = () => {
    if (!editable) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'focused';
    return 'default';
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const stateStyles = (() => {
    const s = getInputState();
    switch (s) {
      case 'focused':
        return theme.input.focused;
      case 'disabled':
        return theme.input.disabled;
      case 'error':
        return theme.input.error;
      default:
        return theme.input.default;
    }
  })();

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...rest}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={stateStyles.text}
        style={[
          styles.input,
          {
            backgroundColor: stateStyles.background,
            borderColor: stateStyles.border,
            color: stateStyles.text,
          },
          inputStyle,
          style, // mantiene compatibilidad si aún pasas `style`
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // eliminamos minWidth:'100%' para poder controlar vía flex/width
    marginVertical: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    width: '100%',
  },
});
