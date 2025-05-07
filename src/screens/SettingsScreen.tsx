import { View } from 'react-native';
import ThemeSwitcher from '../components/theme/ThemePicker';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ThemeSwitcher />
    </View>
  );
}
