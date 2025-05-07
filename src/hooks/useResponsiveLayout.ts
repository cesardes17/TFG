import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
};

type LayoutType = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();

  const getLayoutType = (): LayoutType => {
    if (width >= BREAKPOINTS.largeDesktop) return 'largeDesktop';
    if (width >= BREAKPOINTS.desktop) return 'desktop';
    if (width >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  };

  const isDesktop = width >= BREAKPOINTS.tablet;
  const isMobile = width < BREAKPOINTS.tablet;

  return {
    layoutType: getLayoutType(),
    isDesktop,
    isMobile,
    screenWidth: width,
  };
}
