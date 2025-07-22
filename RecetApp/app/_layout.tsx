import { useColorScheme } from '@/hooks/useColorScheme'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { AuthProvider } from './AuthContext'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="recuperar" options={{ headerShown: false }} />
            <Stack.Screen name="not-found" />
            <Stack.Screen name="editar-receta/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="editar-pasos/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="editar-ingredientes/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="detalle-receta/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="nueva-receta" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
