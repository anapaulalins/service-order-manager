import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { RootStackParamList } from 'navigation';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import useProductStore, { Product } from 'store/useProductStore';

type SearchOrderScreenRouteProp = StackNavigationProp<RootStackParamList, 'SearchOrder'>;

export function SearchOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<Product | null>(null);

  const products = useProductStore((state) => state.products);

  const navigation = useNavigation<SearchOrderScreenRouteProp>();

  const handleSearch = () => {
    const foundOrder = products.find((e) => e.cpf === searchTerm || e.serialNumber === searchTerm);

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      alert('Ordem de serviço não encontrada');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onPress={() => navigation.navigate('Home')} />

      <Text style={styles.title}>Buscar Ordem de Serviço</Text>
      <TextInput
        placeholder="Número de Série ou CPF"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />
      <Button title="Buscar" onPress={handleSearch} color="#00cc66" />

      {order && (
        <View style={styles.orderDetails}>
          <Text style={styles.orderTitle}>Detalhes da Ordem de Serviço</Text>
          <Text style={styles.label}>
            Cliente: <Text style={styles.value}>{order.clientName}</Text>
          </Text>
          <Text style={styles.label}>
            Número de Telefone: <Text style={styles.value}>{order.phoneNumber}</Text>
          </Text>
          <Text style={styles.label}>
            CPF: <Text style={styles.value}>{order.cpf}</Text>
          </Text>
          <Text style={styles.label}>
            Equipamento: <Text style={styles.value}>{order.equipmentName}</Text>
          </Text>
          <Text style={styles.label}>
            Número de Série: <Text style={styles.value}>{order.serialNumber}</Text>
          </Text>
          <Text style={styles.label}>
            Descrição do Defeito: <Text style={styles.value}>{order.defectDescription}</Text>
          </Text>
          <Text style={styles.label}>
            Valor do Orçamento: <Text style={styles.value}>{order.budget}</Text>
          </Text>
          <Text style={styles.label}>
            Endereço: <Text style={styles.value}>{order.address}</Text>
          </Text>
          <Text style={styles.label}>
            Status: <Text style={styles.value}>{order.status}</Text>
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 24,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  orderDetails: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontWeight: 'normal',
  },
});
