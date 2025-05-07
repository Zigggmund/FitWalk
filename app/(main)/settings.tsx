import { useState, useEffect } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import CompositeInput from '@/components/ui/CompositeInput';
import PageHeader from '@/components/ui/PageHeader';
import { getSetting, setSetting } from '@/services/settingsRepository';

export default function SettingsScreen() {
  const [language, setLanguage] = useState<string>('en'); // Default value

  // Load the language setting when component mounts
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await getSetting('language');
      if (savedLanguage) {
        setLanguage(savedLanguage === 'ru' ? 'Русский' : 'English');
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageSelect = () => {
    Alert.alert('Выберите язык', '', [
      {
        text: 'Русский',
        onPress: async () => {
          setLanguage('Русский');
          await setSetting('language', 'ru');
        },
      },
      {
        text: 'English',
        onPress: async () => {
          setLanguage('English');
          await setSetting('language', 'en');
        },
      },
    ]);
  };

  return (
    <View>
      <PageHeader text={'Настройки'} />
      <TouchableOpacity onPress={handleLanguageSelect}>
        <View style={{ paddingTop: 40 }}>
          <CompositeInput
            label={'Язык'}
            value={language}
            disable
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}