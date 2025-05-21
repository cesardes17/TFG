// src/components/forms/InputFormik.tsx
import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';
import { TextInputProps, View, StyleSheet } from 'react-native';
import StyledText from '../common/StyledText';
import StyledTextInput from '../common/StyledTextInput';

interface FormikTextInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: string;
}

export default function InputFormik({
  name,
  placeholder,
  ...props
}: FormikTextInputProps) {
  const { validateField } = useFormikContext();
  const [field, meta, helpers] = useField(name);
  const [isFocused, setIsFocused] = useState(false);

  // Mostramos error solo si ya estaba tocado, perdió el foco y tiene error
  const showError = meta.touched && !isFocused && !!meta.error;

  return (
    <View style={styles.container}>
      <StyledTextInput
        value={field.value}
        placeholder={placeholder}
        onChangeText={(value) => {
          helpers.setValue(value);
          // Opcional: limpiar error mientras escribe
          if (meta.error) {
            helpers.setError('');
          }
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={(e) => {
          // 1) Marcamos como "touched"
          helpers.setTouched(true);
          setIsFocused(false);
          // 2) Validamos solo este campo
          validateField(name);
        }}
        {...props}
        error={showError}
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
  },
});
