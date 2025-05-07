import React, { useState } from 'react';

import { useField } from 'formik';
import { TextInputProps, View } from 'react-native';
import StyledText from '../common/StyledText';
import StyledTextInput from '../common/StyledTextInput';

interface FormikTextInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: string;
}

export default function InputFormik({ name, ...props }: FormikTextInputProps) {
  const [field, meta, helpers] = useField(name);
  const [isActive, setIsActive] = useState(false);

  const showError = meta.touched && !isActive && meta.error;

  return (
    <View style={{ width: '100%' }}>
      <StyledTextInput
        value={field.value}
        onChangeText={(value) => {
          helpers.setValue(value);
          setIsActive(true);
        }}
        onBlur={() => {
          setIsActive(false);
          helpers.setTouched(true);
        }}
        {...props}
        error={!!showError}
      />
      {showError ? (
        <StyledText variant='error' style={{ marginTop: 5, marginBottom: 10 }}>
          {meta.error}
        </StyledText>
      ) : null}
    </View>
  );
}
