import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';

export type ConfirmationType = 'create' | 'update' | 'delete';

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: ConfirmationType;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function BaseConfirmationModal({
  visible,
  title,
  description,
  onConfirm,
  onCancel,
  type = 'create',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: Props) {
  const { theme } = useTheme();

  const getConfirmColor = () => {
    switch (type) {
      case 'delete':
        return theme.background.error;
      case 'update':
        return theme.background.warning;
      case 'create':
        return theme.background.success;
      default:
        return theme.background.primary;
    }
  };

  return (
    <Modal animationType='fade' transparent visible={visible}>
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onPress={onCancel}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '80%',
            backgroundColor: theme.background.primary,
            borderRadius: 12,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <StyledText
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            {title}
          </StyledText>
          {description && (
            <Text style={{ color: theme.text.secondary, marginBottom: 20 }}>
              {description}
            </Text>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Pressable
              onPress={onCancel}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: '#B6B3B3B0',
                borderRadius: 8,
                marginRight: 10,
              }}
            >
              <Text style={{ color: theme.text.primary }}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: getConfirmColor(),
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white' }}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
