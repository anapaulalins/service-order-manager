import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import useProductStore from 'store/useProductStore';

import { RootStackParamList } from '../navigation';

type HomeScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Home'>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const products = useProductStore((state) => state.products);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ordens de Serviço</Text>
        <Image
          source={require('../images/logo.png')}
          style={{ height: 55, width: 55, borderRadius: 12 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateOrder')}>
          <Ionicons name="add-circle" size={32} color="black" style={{ marginRight: 2 }} />
          <Text style={{ fontWeight: 'bold' }}>Criar Ordem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchOrder')}>
          <Ionicons name="search-circle" size={32} color="black" style={{ marginRight: 2 }} />
          <Text style={{ fontWeight: 'bold' }}>Consultar Ordem</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 20, marginVertical: 20, fontWeight: 'bold' }}>Ordens Ativas</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <MaterialIcons name="miscellaneous-services" size={30} color="black" />
            <View style={styles.itemContent}>
              <Text style={{ fontWeight: 'bold' }}>{item.equipmentName}</Text>
              <Text>Ordem ID:{item.serialNumber}</Text>
            </View>
            <Text style={[styles.badge, item.status === 'Completo' && styles.badgeCompleted]}>
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    marginTop: 24,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#00cc66',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 12,
    borderBottomColor: '#ddd',
  },
  itemContent: {
    marginLeft: 12,
  },
  badge: {
    color: '#f0ab0a',
    padding: 6,
    borderRadius: 8,
    fontSize: 12,
    backgroundColor: 'rgba(240, 171, 10, 0.2)',
    marginLeft: 'auto',
  },
  badgeCompleted: {
    color: '#00cc66',
    backgroundColor: 'rgba(0, 204, 102, 0.2)',
  },
});
