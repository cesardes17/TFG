import React, { useState } from 'react';

import { useField } from 'formik';
import { TextInputProps, View, StyleSheet } from 'react-native';
import StyledText from '../common/StyledText';
import StyledTextInput from '../common/StyledTextInput';

interface FormikTextInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: string;
}

export default function InputFormik({ name, ...props }: FormikTextInputProps) {
  const [field, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);

  // Solo mostrar error cuando el campo ha perdido el foco y tiene un error
  const showError = meta.touched && !isFocused && meta.error;

  return (
    <View style={styles.container}>
      <StyledTextInput
        value={field.value}
        onChangeText={(value) => {
          helpers.setValue(value);
          // Limpiar el estado de error mientras el usuario escribe
          if (showError) {
            helpers.setError('');
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          helpers.setTouched(true);
        }}
        {...props}
        error={!!showError}
      />
      {showError && (
        <StyledText variant='error' style={styles.errorText}>
          {meta.error}
        </StyledText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 4,
  },
});
