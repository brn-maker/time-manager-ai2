
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { signOut } from '../../services/authService';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
