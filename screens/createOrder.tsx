import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { CameraView, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { manipulateAsync, FlipType } from 'expo-image-manipulator';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Switch,
  ScrollView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import uuid from 'react-native-uuid';
import useProductStore from 'store/useProductStore';

import { RootStackParamList } from '../navigation';

type CreateOrderScreenRouteProp = StackNavigationProp<RootStackParamList, 'CreateOrder'>;

type State = {
  clientName: string;
  phoneNumber: string;
  cpf: string;
  address: string;
  isExternalService: boolean;
  equipmentName: string;
  serialNumber: string;
  defectDescription: string;
  budget: string;
  status: 'Em andamento' | 'Completo';
};

type Action =
  | { type: 'SET_CLIENT_NAME'; payload: string }
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_CPF'; payload: string }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_IS_EXTERNAL_SERVICE'; payload: boolean }
  | { type: 'SET_EQUIPMENT_NAME'; payload: string }
  | { type: 'SET_SERIAL_NUMBER'; payload: string }
  | { type: 'SET_DEFECT_DESCRIPTION'; payload: string }
  | { type: 'SET_BUDGET'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CLIENT_NAME':
      return { ...state, clientName: action.payload };
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload };
    case 'SET_CPF':
      return { ...state, cpf: action.payload };
    case 'SET_ADDRESS':
      return { ...state, address: action.payload };
    case 'SET_IS_EXTERNAL_SERVICE':
      return { ...state, isExternalService: action.payload };
    case 'SET_EQUIPMENT_NAME':
      return { ...state, equipmentName: action.payload };
    case 'SET_SERIAL_NUMBER':
      return { ...state, serialNumber: action.payload };
    case 'SET_DEFECT_DESCRIPTION':
      return { ...state, defectDescription: action.payload };
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    default:
      return state;
  }
}

export function CreateOrder() {
  const [state, dispatch] = useReducer(reducer, {
    clientName: '',
    phoneNumber: '',
    cpf: '',
    address: '',
    isExternalService: false,
    equipmentName: '',
    serialNumber: '',
    defectDescription: '',
    budget: '',
    status: 'Em andamento',
  });

  const addProduct = useProductStore((state) => state.addProduct);
  const navigation = useNavigation<CreateOrderScreenRouteProp>();

  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | undefined>();

  const [permission, requestPermission] = useCameraPermissions();

  const [modalVisible, setModalVisible] = useState(false);
  const camera = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (permission?.status !== 'granted') {
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
          Alert.alert('Erro', 'Permissão da camera negada');
        }
      }
    })();
  }, []);

  const handleCreateOrder = () => {
    const {
      clientName,
      phoneNumber,
      cpf,
      address,
      isExternalService,
      equipmentName,
      serialNumber,
      defectDescription,
      budget,
    } = state;

    if (
      !clientName ||
      !phoneNumber ||
      !cpf ||
      !equipmentName ||
      !serialNumber ||
      !defectDescription ||
      !budget ||
      (isExternalService && !address)
    ) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    addProduct({ ...state, id: uuid.v4().toString() });
    navigation.navigate('Home');
  };

  const takePicture = async () => {
    if (camera.current) {
      const picture = await camera.current?.takePictureAsync();

      if (picture?.uri) {
        const flippedPicture = await manipulateAsync(picture.uri, [{ flip: FlipType.Horizontal }], {
          compress: 1,
          base64: true,
        });

        setCapturedPhoto(flippedPicture);
      }

      setModalVisible(false);
    }
  };

  const generatePDF = async () => {
    const {
      clientName,
      phoneNumber,
      cpf,
      address,
      isExternalService,
      equipmentName,
      serialNumber,
      defectDescription,
      budget,
      status,
    } = state;

    const photoBase64 = capturedPhoto
      ? `<img src="data:image/jpeg;base64,${capturedPhoto.base64}" style="width: 200px; height: 200px;" />`
      : '';

    const html = `
     <html>
     <body>
      <h1>Orçamento de Serviço</h1>
      <p><strong>Cliente:</strong> ${clientName}</p>
      <p><strong>Telefone:</strong> ${phoneNumber}</p>
      <p><strong>CPF:</strong> ${cpf}</p>
      ${isExternalService ? `<p><strong>Endereço:</strong> ${address}</p>` : ''}
      <p><strong>Equipamento:</strong> ${equipmentName}</p>
      <p><strong>Número de Série:</strong> ${serialNumber}</p>
      <p><strong>Descrição do Defeito:</strong> ${defectDescription}</p>
      <p><strong>Valor do Orçamento:</strong> ${budget}</p>
      <p><strong>Status:</strong> ${status}</p>
       <p><strong>Foto Capturada:</strong></p>
      ${photoBase64}
     </body>
     </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

      Alert.alert(
        'PDF Gerado',
        `O PDF foi gerado com sucesso. Não esqueça de salvar o produto no sistema!`
      );
    } catch (error) {
      Alert.alert('Erro', 'Houve um problema ao gerar o PDF.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onPress={() => navigation.navigate('Home')} />
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cadastro de Cliente</Text>
      <TextInput
        placeholder="Nome Completo"
        value={state.clientName}
        onChangeText={(text) => dispatch({ type: 'SET_CLIENT_NAME', payload: text })}
      />
      <TextInput
        placeholder="Número de Telefone"
        value={state.phoneNumber}
        onChangeText={(text) => dispatch({ type: 'SET_PHONE_NUMBER', payload: text })}
      />
      <TextInput
        placeholder="CPF"
        value={state.cpf}
        onChangeText={(text) => dispatch({ type: 'SET_CPF', payload: text })}
      />

      <View style={styles.switchContainer}>
        <Text>Serviço Externo?</Text>
        <Switch
          value={state.isExternalService}
          onValueChange={(value) => dispatch({ type: 'SET_IS_EXTERNAL_SERVICE', payload: value })}
        />
      </View>

      {state.isExternalService && (
        <TextInput
          placeholder="Endereço"
          value={state.address}
          onChangeText={(text) => dispatch({ type: 'SET_ADDRESS', payload: text })}
        />
      )}

      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cadastro de Equipamento</Text>
      <TextInput
        placeholder="Nome do Equipamento"
        value={state.equipmentName}
        onChangeText={(text) => dispatch({ type: 'SET_EQUIPMENT_NAME', payload: text })}
      />
      <TextInput
        placeholder="Número de Série"
        value={state.serialNumber}
        onChangeText={(text) => dispatch({ type: 'SET_SERIAL_NUMBER', payload: text })}
      />
      <TextInput
        placeholder="Descrição do Defeito"
        value={state.defectDescription}
        onChangeText={(text) => dispatch({ type: 'SET_DEFECT_DESCRIPTION', payload: text })}
      />
      <TextInput
        placeholder="Valor do Orçamento"
        value={state.budget}
        onChangeText={(text) => dispatch({ type: 'SET_BUDGET', payload: text })}
        keyboardType="numeric"
      />

      {capturedPhoto && (
        <>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Foto do Equipamento</Text>
          <Image source={{ uri: capturedPhoto.uri }} style={{ width: 100, height: 100 }} />
        </>
      )}

      <Button title="Foto do equipamento" onPress={() => setModalVisible(true)} color="#f0ab0a" />

      <Modal visible={modalVisible} animationType="slide">
        <CameraView style={{ flex: 1 }} facing="back" ref={camera} />

        <Button title="Tirar foto" onPress={takePicture} />

        <Button title="Cancelar" onPress={() => setModalVisible(false)} />
      </Modal>

      <Button title="Criar ordem de serviço" onPress={handleCreateOrder} color="#00cc66" />
      <Button title="Gerar PDF" onPress={generatePDF} color="#007bff" />
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
    gap: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});
