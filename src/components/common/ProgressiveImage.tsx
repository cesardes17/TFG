// src/components/common/ProgressiveImage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  ImageProps,
  ViewStyle,
  ImageStyle,
} from 'react-native';

interface ProgressiveImageProps extends Partial<ImageProps> {
  uri: string;
  containerStyle?: ViewStyle | ViewStyle[];
  imageStyle?: ImageStyle;
}

export default function ProgressiveImage({
  uri,
  containerStyle,
  imageStyle,
  ...rest
}: ProgressiveImageProps) {
  console.log('ProgressiveImage.tsx: uri', uri);
  const [loaded, setLoaded] = useState(false);
  const pulse = useRef(new Animated.Value(0.3)).current;

  // animación de pulso
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/** placeholder skeleton */}
      {!loaded && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#333',
              opacity: pulse,
              borderRadius: imageStyle?.borderRadius || 0,
            },
          ]}
        />
      )}

      <Image
        source={{ uri }}
        style={[styles.image, imageStyle]}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
