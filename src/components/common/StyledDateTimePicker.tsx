// src/components/common/StyledDateTimePicker.tsx
import { Platform } from 'react-native';

const StyledDateTimePicker =
  Platform.OS === 'web'
    ? require('./StyledDateTimePicker.web').default
    : require('./StyledDateTimePicker.native').default;

export default StyledDateTimePicker;
