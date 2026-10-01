import React from 'react';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

const paperTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, primary: colors.primary, background: colors.background, surface: colors.surface },
};

// clave: partimos de NavigationDarkTheme (ya trae "fonts"), solo cambiamos colores
const navTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.surface,
    primary: colors.primary,
    notification: colors.danger,
  },
};

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Historial" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}