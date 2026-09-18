import { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, DeviceEventEmitter } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

import { LoginScreen } from './app/screens/Login';
import { ScanScreen } from './app/screens/Scan';
import { HomeScreen } from './app/screens/Home'
import { logout as logoutService } from './app/api/AuthService';
import { AuthContext } from './app/context/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Failed to restore token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();

    const subscription = DeviceEventEmitter.addListener('onUnauthorized', () => {
      setUserToken(null);
    });

    return () => subscription.remove();
  }, []);

  const authContextValue = {
    userToken,
    setUserToken,
    signOut: async () => {
      await logoutService();
      setUserToken(null);
    },
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E98400" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer>
<Stack.Navigator>
  {userToken === null ? (
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }} 
    />
  ) : (
    <>
      <Stack.Screen 
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{ headerShown: false }} 
      />
    </>
  )}
</Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});