import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

const StyledDateTimePicker: React.FC<Props> = ({ value, onChange }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(false);
    if (selectedDate) {
      const currentDate = selectedDate;
      setTempDate(currentDate);

      // En Android, lanza el time picker después de seleccionar la fecha
      if (Platform.OS === 'android') {
        setShowTime(true);
      } else {
        onChange(currentDate); // En iOS podría ser inline, pero preferimos separarlo
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
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
      <Button title='Seleccionar fecha' onPress={() => setShowDate(true)} />

      {showDate && (
        <DateTimePicker
          value={tempDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <Button title='Seleccionar hora' onPress={() => setShowDate(true)} />

      {showTime && (
        <DateTimePicker
          value={tempDate}
          mode='time'
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default StyledDateTimePicker;
