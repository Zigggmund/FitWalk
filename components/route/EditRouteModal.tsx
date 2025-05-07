import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';

import SText from '@/components/ui/CustomFontText/SText';
import CustomModal from '@/components/ui/parts/CustomModal';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, travelTime: string) => void;
  initialTitle?: string;
  initialDescription?: string;
  initialTravelTime?: string;
};

const EditRouteModal = ({
                          visible,
                          onClose,
                          onSave,
                          initialTitle = '',
                          initialDescription = '',
                          initialTravelTime = '',
                        }: Props) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [travelTime, setTravelTime] = useState(initialTravelTime);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите название маршрута');
      return;
    }

    if (!travelTime.trim()) {
      Alert.alert('Ошибка', 'Введите время прохождения маршрута');
      return;
    }

    if (!/^\d+$/.test(travelTime)) {
      Alert.alert('Ошибка', 'Время прохождения должно быть числом (в минутах)');
      return;
    }

    onSave(title, description, travelTime);
    // Сбрасываем поля только если это создание нового маршрута
    if (!initialTitle) {
      setTitle('');
      setDescription('');
      setTravelTime('');
    }
  };

  return (
    <CustomModal visible={visible} onClose={onClose} onSave={handleSave}>
      <SText style={styles.modalTitle}>Название маршрута</SText>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Введите название"
      />

      <SText style={styles.modalTitle}>Описание маршрута</SText>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Введите описание (необязательно)"
        multiline
      />

      <SText style={styles.modalTitle}>Время прохождения (минуты)</SText>
      <TextInput
        style={styles.input}
        value={travelTime}
        onChangeText={setTravelTime}
        placeholder="Введите время в минутах"
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default EditRouteModal;

// import React, { useState } from 'react';
// import { Alert, StyleSheet, TextInput } from 'react-native';
//
// import SText from '@/components/ui/CustomFontText/SText';
// import CustomModal from '@/components/ui/parts/CustomModal';
//
// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   onSave: (startTime: string) => void;
// };
//
// const EditRouteModal = ({ visible, onClose, onSave }: Props) => {
//   const [inputDate, setInputDate] = useState('');
//   const [inputTime, setInputTime] = useState('');
//
//   const handleSave = () => {
//     if (!inputTime.match(/^\d{1,2} \d{2}$/)) {
//       Alert.alert(
//         'Ошибка',
//         'Введите корректное время в формате ЧЧ ММ через пробел',
//       );
//       return;
//     }
//
//     const [hours, minutes] = inputTime.split(' ').map(Number);
//     if (hours > 23 || minutes > 59) {
//       Alert.alert('Ошибка', 'Время некорректно');
//       return;
//     }
//
//     let finalDate = new Date();
//
//     if (inputDate) {
//       if (!inputDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
//         Alert.alert('Ошибка', 'Введите дату в формате ДД.ММ.ГГГГ');
//         return;
//       }
//
//       const [day, month, year] = inputDate.split('.').map(Number);
//       finalDate = new Date(year, month - 1, day, hours, minutes);
//       if (isNaN(finalDate.getTime())) {
//         Alert.alert('Ошибка', 'Дата некорректна');
//         return;
//       }
//     } else {
//       finalDate.setHours(hours, minutes, 0, 0);
//     }
//
//     if (finalDate < new Date()) {
//       Alert.alert('Ошибка', 'Нельзя указать прошедшее время');
//       return;
//     }
//
//     onSave(finalDate.toISOString());
//     setInputDate('');
//     setInputTime('');
//   };
//
//   return (
//     <CustomModal visible={visible} onClose={onClose} onSave={handleSave}>
//       <SText style={styles.modalTitle}>Введите название маршрута</SText>
//       <TextInput
//         style={styles.input}
//         value={inputTime}
//         onChangeText={setInputTime}
//         placeholder="ЧЧ ММ"
//         keyboardType="numeric"
//       /><SText style={styles.modalTitle}>Введите время прохождения маршрута</SText>
//       <TextInput
//         style={styles.input}
//         value={inputTime}
//         onChangeText={setInputTime}
//         placeholder="ЧЧ ММ"
//         keyboardType="numeric"
//       />
//       <SText style={styles.modalTitle}>Введите время прохождения маршрута</SText>
//       <TextInput
//         style={styles.input}
//         value={inputTime}
//         onChangeText={setInputTime}
//         placeholder="ЧЧ ММ"
//         keyboardType="numeric"
//       />
//     </CustomModal>
//   );
// };
//
// const styles = StyleSheet.create({
//   modalTitle: {
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   input: {
//     width: '100%',
//     padding: 10,
//     borderWidth: 1,
//     borderRadius: 8,
//     borderColor: '#ccc',
//     marginBottom: 16,
//   },
// });
//
// export default EditRouteModal;
