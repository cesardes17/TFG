import StyledText from '../../src/components/common/StyledText';
import HeaderConfig from '../../src/components/layout/HeaderConfig';
import PageContainer from '../../src/components/layout/PageContainer';
import PanelControlScreen from '../../src/screens/admin/PanelControlScreen';

export default function PanelControlPage() {
  return (
    <PageContainer>
      <HeaderConfig title='Panel de Control' backLabel='Más' />
      <PanelControlScreen />
    </PageContainer>
  );
}
