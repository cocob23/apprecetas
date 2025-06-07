import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export default function ToastMessage({ visible, message, onHide }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 170,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 250, 17, 0.9)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
