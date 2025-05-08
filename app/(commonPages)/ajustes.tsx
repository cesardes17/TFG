import HeaderConfig from '../../src/components/layout/HeaderConfig';
import PageContainer from '../../src/components/layout/PageContainer';
import SettingsScreen from '../../src/screens/SettingsScreen';

export default function SettingsPage() {
  return (
    <PageContainer>
      <HeaderConfig title='Ajustes' backLabel='Más' />
      <SettingsScreen />
    </PageContainer>
  );
}
