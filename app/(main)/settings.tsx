import { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

import CompositeInput from '@/components/ui/CompositeInput';
import PageHeader from '@/components/ui/PageHeader';

export default function SettingsScreen() {
  const [language, setLanguage] = useState<'Русский' | 'English'>('Русский');

  const handleLanguageSelect = () => {
    Alert.alert('Выберите язык', '', [
      { text: 'Русский', onPress: () => setLanguage('Русский') },
      { text: 'English', onPress: () => setLanguage('English') },
    ]);
  };

  return (
    <View>
      <PageHeader text={'Настройки'} />

      <TouchableOpacity onPress={handleLanguageSelect}>
        <View style={{ paddingTop: 40 }}>
          <CompositeInput label={'Язык'} value={language} disable />
        </View>
      </TouchableOpacity>
    </View>
  );
}
