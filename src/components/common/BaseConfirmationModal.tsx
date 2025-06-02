import React, { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import StyledText from './StyledText';
import LoadingIndicator from './LoadingIndicator';
import { useResponsiveWidth } from '../../hooks/useResponsiveWidth'; // ✅ IMPORTACIÓN NUEVA

export type ConfirmationType = 'create' | 'update' | 'delete';

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  type?: ConfirmationType;
  confirmLabel?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  loadingText?: string;
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
  children,
  loadingText = 'Procesando...',
}: Props) {
  const { theme } = useTheme();
  const { containerWidth } = useResponsiveWidth(); // ✅ AÑADIDO
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      animationType='fade'
      transparent
      visible={visible}
      supportedOrientations={['landscape', 'portrait']}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 16,
        }}
        onPress={!isProcessing ? onCancel : undefined}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: containerWidth, // ✅ APLICACIÓN DEL WIDTH RESPONSIVE
            maxWidth: 500, // ✅ Límite máximo para pantallas grandes
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

          {description && !isProcessing && (
            <StyledText style={{ marginBottom: 20 }}>{description}</StyledText>
          )}

          {children && !isProcessing && (
            <View style={{ marginBottom: 20 }}>{children}</View>
          )}

          {isProcessing ? (
            <LoadingIndicator text={loadingText} />
          ) : (
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
                onPress={handleConfirm}
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
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
