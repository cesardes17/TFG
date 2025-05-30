// src/components/common/StyledDateTimePicker.tsx
import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StyledButton from './StyledButton';
import StyledText from './StyledText';
import { useTheme } from '../../contexts/ThemeContext';
import { CalendarIcon, ClockCircleOIcon } from '../Icons';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

const StyledDateTimePicker: React.FC<Props> = ({ value, onChange }) => {
  return Platform.OS === 'ios' ? (
    <IOSDateTimePicker value={value} onChange={onChange} />
  ) : (
    <AndroidDateTimePicker value={value} onChange={onChange} />
  );
};

export default StyledDateTimePicker;

// --------------------------------------------
// Android Picker
const AndroidDateTimePicker: React.FC<Props> = ({ value, onChange }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDate(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setShowTime(true);
    }
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    setShowTime(false);
    if (selectedTime) {
      const finalDate = new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      onChange(finalDate);
    }
  };

  return (
    <View>
      <RenderFechaSeleccionada value={value} />

      <StyledButton
        title='Seleccionar fecha y hora'
        variant='outline'
        onPress={() => setShowDate(true)}
      />

      {showDate && (
        <DateTimePicker
          value={tempDate}
          mode='date'
          display='default'
          onChange={handleDateChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={tempDate}
          mode='time'
          display='default'
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

// --------------------------------------------
// iOS Picker
const IOSDateTimePicker: React.FC<Props> = ({ value, onChange }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) onChange(new Date(selectedDate));
    setShowDate(false);
  };

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    if (selectedTime) {
      const updated = new Date(value);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      onChange(updated);
    }
  };

  return (
    <>
      <RenderFechaSeleccionada value={value} />

      <DateTimePicker
        value={value}
        mode='date'
        display='inline'
        onChange={handleDateChange}
      />

      <DateTimePicker
        value={value}
        mode='time'
        display='inline'
        onChange={handleTimeChange}
        minuteInterval={15}
      />
    </>
  );
};

const RenderFechaSeleccionada: React.FC<Omit<Props, 'onChange'>> = ({
  value,
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 16, gap: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <CalendarIcon size={24} color={theme.text.primary} />
        <StyledText>
          {value.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </StyledText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <ClockCircleOIcon size={24} color={theme.text.primary} />

        <StyledText>
          {value.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </StyledText>
      </View>
    </View>
  );
};
