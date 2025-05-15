import React from 'react';
import { Button, Modal, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
};

const CustomModal = ({
  visible,
  onClose,
  onSave,
  children,
}: CustomModalProps) => {
  const { l } = useLanguage()

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {children}
          <View style={styles.buttonsContainer}>
            <Button
              title={l.btnSave}
              onPress={onSave}
              color={colors.modal.accept}
            />
            <Button
              title={l.btnCancel}
              onPress={onClose}
              color={colors.modal.cancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 12,
  },
});

export default CustomModal;
