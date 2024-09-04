import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CreateOrder } from 'screens/createOrder';
import Home from 'screens/home';
import { SearchOrder } from 'screens/searchOrder';

import { BackButton } from '../components/BackButton';

export type RootStackParamList = {
  Home: undefined;
  CreateOrder: undefined;
  SearchOrder: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateOrder" component={CreateOrder} />
        <Stack.Screen name="SearchOrder" component={SearchOrder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
