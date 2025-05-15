import { Alert, TouchableOpacity, View } from 'react-native';

import CompositeInput from '@/components/ui/CompositeInput';
import PageHeader from '@/components/ui/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsScreen() {
  const { l, language, setLanguage } = useLanguage();

  const handleLanguageSelect = () => {
    Alert.alert(l.selectLanguage, '', [
      {
        text: 'Russian',
        onPress: async () => {
          setLanguage('ru');
        },
      },
      {
        text: 'English',
        onPress: async () => {
          setLanguage('en');
        },
      },
    ]);
  };

  return (
    <View>
      <PageHeader text={l.settings} />
      <TouchableOpacity onPress={handleLanguageSelect}>
        <View style={{ paddingTop: 40 }}>
          <CompositeInput label={l.language} value={language} disable />
        </View>
      </TouchableOpacity>
    </View>
  );
}
