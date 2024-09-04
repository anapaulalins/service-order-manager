import { Feather } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.backButton}>
      <Feather name="chevron-left" size={18} color="#00cc66" />
      <Text style={styles.backButtonText} onPress={onPress}>
        Voltar
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
  backButtonText: {
    color: '#00cc66',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});
