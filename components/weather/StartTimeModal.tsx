import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import CustomModal from '@/components/ui/parts/CustomModal';
import { useLanguage } from '@/context/LanguageContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (startTime: string) => void;
};

const StartTimeModal = ({ visible, onClose, onSave }: Props) => {
  const { l } = useLanguage();
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');

  const handleSave = () => {
    if (!inputTime.match(/^\d{1,2} \d{2}$/)) {
      Alert.alert(l.error, l.validationStartTimeFormat);
      return;
    }

    const [hours, minutes] = inputTime.split(' ').map(Number);
    if (hours > 23 || minutes > 59) {
      Alert.alert(l.error, l.validationStartTimeNumbers);
      return;
    }

    let finalDate = new Date();

    if (inputDate) {
      if (!inputDate.match(/^\d{1,2} \d{2} \d{4}$/)) {
        Alert.alert(l.error, l.validationStartDateFormat);
        return;
      }

      const [day, month, year] = inputDate.split(' ').map(Number);
      finalDate = new Date(year, month - 1, day, hours, minutes);
      if (isNaN(finalDate.getTime())) {
        Alert.alert(l.error, l.validationStartDateNumbers);
        return;
      }
    } else {
      finalDate.setHours(hours, minutes, 0, 0);
    }

    if (finalDate < new Date()) {
      Alert.alert(l.error, l.validationStartTimeElapsed);
      return;
    }

    onSave(finalDate.toISOString());
    setInputDate('');
    setInputTime('');
  };

  return (
    <CustomModal visible={visible} onClose={onClose} onSave={handleSave}>
      <SText style={styles.modalTitle}>{l.inputStartDate}</SText>
      <TextInput
        style={styles.input}
        value={inputDate}
        onChangeText={setInputDate}
        placeholder={l.dateMask}
        keyboardType="numeric"
      />
      <SText style={styles.modalTitle}>{l.inputStartTime}</SText>
      <TextInput
        style={styles.input}
        value={inputTime}
        onChangeText={setInputTime}
        placeholder={l.timeMask}
        keyboardType="numeric"
      />
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    marginBottom: 16,
  },
});

export default StartTimeModal;
