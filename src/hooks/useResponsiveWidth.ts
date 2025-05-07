import { useWindowDimensions, DimensionValue } from 'react-native';

export const useResponsiveWidth = () => {
  const { width } = useWindowDimensions();

  const getContainerWidth = (): DimensionValue => {
    if (width < 768) {
      // móvil
      return '100%';
    } else if (width < 1024) {
      // tablet
      return '80%';
    } else if (width < 1440) {
      // desktop pequeño
      return '70%';
    } else {
      // desktop grande
      return '60%';
    }
  };

  return {
    containerWidth: getContainerWidth(),
    screenWidth: width,
  };
};
