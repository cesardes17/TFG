import React from 'react';

interface Props {
  mode: 'date' | 'time' | 'datetime';
  value: Date;
  onChange: (date: Date) => void;
}

export default function StyledDateTimePickerWeb({
  mode,
  value,
  onChange,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = new Date(e.target.value);
    if (mode === 'datetime') {
      // Para datetime-local
      const [date, time] = e.target.value.split('T');
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const composedDate = new Date(year, month - 1, day, hours, minutes);
      onChange(composedDate);
    } else {
      onChange(newValue);
    }
  };

  const formatInputValue = () => {
    if (!value) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = value.getFullYear();
    const mm = pad(value.getMonth() + 1);
    const dd = pad(value.getDate());
    const hh = pad(value.getHours());
    const min = pad(value.getMinutes());

    if (mode === 'date') return `${yyyy}-${mm}-${dd}`;
    if (mode === 'time') return `${hh}:${min}`;
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  return (
    <input
      type={
        mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local'
      }
      value={formatInputValue()}
      onChange={handleChange}
      style={{
        padding: 8,
        fontSize: 16,
        borderRadius: 4,
        border: '1px solid #ccc',
      }}
    />
  );
}
