import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageStyle,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressiveImageProps {
  uri: string;
  style?: ImageStyle;
  imageStyle?: ImageStyle;
}

export default function ProgressiveImage({
  uri,
  style,
  imageStyle,
}: ProgressiveImageProps) {
  const [loading, setLoading] = useState(true);
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(shimmerTranslate, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loading]);

  const shimmerStyle = {
    transform: [
      {
        translateX: shimmerTranslate.interpolate({
          inputRange: [-1, 1],
          outputRange: [-screenWidth, screenWidth],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.skeletonContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
            <LinearGradient
              colors={['#eeeeee', '#dddddd', '#eeeeee']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      )}
      <Image
        source={{ uri }}
        style={[styles.image, imageStyle]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skeletonContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e0e0',
  },
});
