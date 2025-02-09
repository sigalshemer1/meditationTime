import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet,View ,Image,Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './Home';
import { useColorScheme } from '@/hooks/useColorScheme';
import logo from '../assets/images/logo.png';

export const HeaderLogo = () => (
  <Image
    source={logo}
    style={{ width: 200, height: 60, resizeMode: 'contain' }}
  />
);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const Tab = createBottomTabNavigator();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator 
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#898889',
          headerStyle: styles.header,
          headerTintColor: '#898889',
          headerTitle: () => <HeaderLogo />,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#59aec2',
    borderTopWidth: 0,
  },
  header: {
    backgroundColor: '#59aec2',
    elevation: 0,
  },
  top:{
    backgroundColor: '#59aec2',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default RootLayout;