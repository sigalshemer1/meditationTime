import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';

// Sound setup
const chimes = [
  { label: 'MDT 1', value: require('../assets/chimes/mdt1.mp3') },
  { label: 'MDT 2', value: require('../assets/chimes/mdt2.mp3') },
  { label: 'MDT 3', value: require('../assets/chimes/mdt3.mp3') },
  { label: 'MDT 4', value: require('../assets/chimes/mdt4.mp3') },
  { label: 'MDT 5', value: require('../assets/chimes/mdt5.mp3') },
  { label: 'MDT 6', value: require('../assets/chimes/mdt6.mp3') },
  { label: 'MDT 7', value: require('../assets/chimes/mdt7.mp3') },
  { label: 'MDT 8', value: require('../assets/chimes/mdt8.mp3') },
  { label: 'MDT 9', value: require('../assets/chimes/mdt9.mp3') },
  { label: 'MDT 10', value: require('../assets/chimes/mdt10.mp3') },
  { label: 'MDT 11', value: require('../assets/chimes/mdt11.mp3') },
];

const MeditationTimer = () => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [interval, setInterval] = useState(10); // default interval is 10 minutes
  const [sound, setSound] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);  // Tracks if sound is playing
  const [volume, setVolume] = useState(1); 


  const handleStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setStartTime(currentDate);
    setShowStartTimePicker(false); // Hide the time picker after selecting a time
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setEndTime(currentDate);
    setShowEndTimePicker(false); // Hide the time picker after selecting a time
  };

  const handleIntervalChange = (value) => {
    setInterval(value);
  };

  const handlePlaySound = () => {
    if (sound) {
      if (isPlaying) {
        sound.stopAsync().then(() => {
          setIsPlaying(false);
        }).catch(error => {
          Alert.alert("Error stopping sound.", error.message);
        });
      } else {
        sound.setVolumeAsync(volume).then(() => {  // Set the volume before playing
          sound.playAsync().then(() => {
            setIsPlaying(true);
          }).catch(error => {
            Alert.alert("Error playing sound.", error.message);
          });
        }).catch(error => {
          Alert.alert("Error setting volume.", error.message);
        });
      }
    }
  };
  
  
  const handleSelectChime = (chimePath) => {
    
    if (sound) {
      sound.stopAsync().catch(error => {
        Alert.alert("Failed to stop previous sound.", error.message);
      });
    }

    const asset = Asset.fromModule(chimePath);

    asset.downloadAsync().then(() => {
      Audio.Sound.createAsync(
        { uri: asset.localUri }, 
        { shouldPlay: false }
      ).then(({ sound: newSound }) => {
        setSound(newSound);
        setIsPlaying(false);
      }).catch(error => {
        Alert.alert("Failed to load sound.", error.message);
      });
    }).catch(error => {
      Alert.alert("Failed to download asset.", error.message);
    });
  };

  
  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(volume).catch(error => {
        Alert.alert("Error updating volume.", error.message);
      });
    }
  }, [volume, sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meditation Timer</Text>

      <Text>Start Time:</Text>
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
        <Text>{startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      <Text>End Time:</Text>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
        <Text>{endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      <Text>Interval:</Text>
      <RNPickerSelect
        onValueChange={handleIntervalChange}
        items={[
          { label: '10 minutes', value: 10 },
          { label: '20 minutes', value: 20 },
          { label: '30 minutes', value: 30 },
          { label: '40 minutes', value: 40 },
          { label: '50 minutes', value: 50 },
          { label: '60 minutes', value: 60 }
        ]}
      />

      <Text>Chime Selection:</Text>
      <RNPickerSelect
        onValueChange={(chimePath) => handleSelectChime(chimePath)}
        items={chimes}
      />

        <TouchableOpacity style={styles.button} onPress={handlePlaySound}>
        <Text style={styles.buttonText}>
            {isPlaying ? 'Stop Sound' : 'Play Sound'}
        </Text>
        </TouchableOpacity>

        <View style={styles.volumeContainer}>
            <Text style={styles.volumeText}>Volume: {Math.round(volume * 100)}%</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.01}
                value={volume}
                onValueChange={setVolume}  // Update the volume state when slider is changed
            />
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  volumeContainer: {
    width: '80%',
    marginTop: 20,
  },
  volumeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default MeditationTimer;
