import React, { useState } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageStyle,
} from 'react-native';

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

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          size='large'
          color='#888'
        />
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
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
