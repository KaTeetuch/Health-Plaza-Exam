import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Leaderboard from '../components/leaderBoard';
import { leaderboardData } from '../types';
import { RootStackParamList } from '../types/navigation';

const LEADERBOARD_KEY = 'leaderboardTable';
const screenWidth = Dimensions.get('window').width;

const LeaderboardScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Leaderboard'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { score } = route.params;
  const [name, setName] = useState('');
  const [leaderboardData, setleaderboardData] = useState<leaderboardData[]>([]);
  const [showNameInput, setShowNameInput] = useState(true);
  const [nameSubmitted, setNameSubmitted] = useState(false);

  useEffect(() => {
   
    const loadLeaderboard = async () => {
      try {
        const storedData = await AsyncStorage.getItem(LEADERBOARD_KEY);
        if (storedData) {
          setleaderboardData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load leaderboard data', error);
      }
    };

    loadLeaderboard();
  }, []);

  const handleAddToLeaderboard = async () => {
    if (name.trim() === '') {
      return;
    }
    const newEntry = { name, score };
    const updatedData = [...leaderboardData, newEntry];
    setleaderboardData(updatedData);
    setShowNameInput(false); 
    setNameSubmitted(true); 

   
    try {
      await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to save leaderboard data', error);
    }
  };

  const handleRetakeQuiz = () => {
    navigation.navigate('Quiz', { reset: true }); 
    setShowNameInput(true); 
    setNameSubmitted(false); 
    setName(''); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        {showNameInput ? (
          <>
           <Text style={styles.score}>Your Score: {score}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddToLeaderboard}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Leaderboard entries={leaderboardData} />
        )}
        {nameSubmitted && (
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeQuiz}>
            <Text style={styles.buttonText}>Retake Quiz</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 15,
    width: screenWidth - 40, // Adjust input width based on screen size
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  retakeButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
