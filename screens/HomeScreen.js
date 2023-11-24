import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Text>Open up App.js to start working on your app!</Text>

      <View style={[{ width: "75%", margin: 8 }]}>
        <Button
          title='Details'
          onPress={() => navigation.navigate('Details')}>
        </Button>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});