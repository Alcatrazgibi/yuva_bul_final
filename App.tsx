import { View, Text } from 'react-native'
import React, { JSX } from 'react'

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Login from "./screens/login"
import Register from './screens/register'
import Home from "./screens/home"
import Details from './screens/details'
import Adopt from './screens/adopt'
import Inbox from './screens/inbox'

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Details:undefined;
  Adopt: undefined;
  Inbox: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      {/* Navigator ve Screen bileşenlerini buraya eklemelisiniz */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Giriş Yap', headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={Register} 
          options={{ title: 'Kayıt Ol', headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Ana Sayfa', headerShown: false }}
        />
        <Stack.Screen 
          name='Details'
          component={Details}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Adopt"
          component={Adopt}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name='Inbox'
          component={Inbox}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}