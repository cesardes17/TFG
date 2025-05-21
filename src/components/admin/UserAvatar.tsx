import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface UserAvatarProps {
  style?: ViewStyle;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ style }) => {
  return (
    <View style={[styles.avatar, style]}>
      <Text style={styles.avatarText}>U</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
});
