import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { leaderboardData } from '../types';

interface LeaderboardProps {
  entries: leaderboardData[];
}



const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  
  const sortedScore = [...entries].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={sortedScore}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: '#f9f9f9', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: '#333',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

export default Leaderboard;
