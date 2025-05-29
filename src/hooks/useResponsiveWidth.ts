import { useWindowDimensions } from 'react-native';

export const useResponsiveWidth = () => {
  const { width } = useWindowDimensions();

  const getContainerWidth = (): number => {
    if (width < 768) return width; // móvil, 100%
    if (width < 1024) return width * 0.8; // tablet, 80%
    if (width < 1440) return width * 0.7; // desktop pequeño
    return width * 0.6; // desktop grande
  };

  return {
    containerWidth: getContainerWidth(),
    screenWidth: width,
  };
};
