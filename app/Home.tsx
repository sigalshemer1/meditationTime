import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import MeditationTimer from '../components/MeditationTimer';

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.safeAreaView}>
            <MeditationTimer />
        </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    bodyContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1d336d',
    },
    safeAreaView: {
      flex: 1,
      backgroundColor: '#59aec2',
    },
    scrollView: {
      flexGrow: 1,
    }
  });
  

  export default Home;