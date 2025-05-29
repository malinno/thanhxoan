import { SCREEN } from '@app/enums/screen.enum';
import AuthScreen from '@app/screens/auth/AuthScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoggerScreen from '@app/screens/network/LoggerScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={SCREEN.AUTH} component={AuthScreen} />
      <Stack.Screen name={SCREEN.NETWORK_LOGGER} component={LoggerScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
