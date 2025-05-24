import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '../common/StyledText';

export function DrawerLabelWithBadge({
  label,
  badgeCount = 0,
}: {
  label: string;
  badgeCount?: number;
}) {
  return (
    <View style={styles.wrapper}>
      <StyledText style={[styles.label, { color: 'white' }]}>
        {label}
      </StyledText>
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <StyledText size={12} style={styles.badgeText}>
            {badgeCount}
          </StyledText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  badge: {
    marginLeft: 6,
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});
