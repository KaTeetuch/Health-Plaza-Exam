import React, { useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import questionsData from '../data/questions';
import { Question as QuestionType } from '../types';
import { RootStackParamList } from '../types/navigation';

const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const screenWidth = Dimensions.get('window').width;

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      initialQuiz();
    }, [])
  );

  const initialQuiz = () => {
    const randomQuestions = shuffleArray([...questionsData]).slice(0, 20);
    randomQuestions.forEach(question => {
      question.answers = shuffleArray(question.answers);
    });
    setQuestions(randomQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = questions[currentQuestionIndex].correctAnswer === answer;
    const updatedScore = isCorrect ? score + 1 : score;

    if (currentQuestionIndex === questions.length - 1) {
      navigation.navigate('Leaderboard', { score: updatedScore });
    } else {
      setScore(updatedScore);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (questions.length === 0) {
    return ;
  }

  const renderAnswerButton = (answer: string) => (
    <TouchableOpacity
      key={answer}
      style={styles.answerButton}
      onPress={() => handleAnswer(answer)}
    >
      <Text style={styles.answerButtonText}>{answer}</Text>
    </TouchableOpacity>
  );

  const renderGridButton = (answers: string[]) => {
    const numColumns = 2;
    const itemsPerRow = Math.ceil(answers.length / numColumns);
    const rows = Array.from({ length: itemsPerRow }, (_, rowIndex) =>
      answers.slice(rowIndex * numColumns, rowIndex * numColumns + numColumns)
    );

    return (
      <View style={styles.buttonContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(answer => renderAnswerButton(answer))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>Question {currentQuestionIndex + 1}/20</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>
      <Text style={styles.progress}>{questions[currentQuestionIndex].question}</Text>
      {renderGridButton(questions[currentQuestionIndex].answers)}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15, 
  },
  answerButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 6,
    alignItems: 'center',
    width: (screenWidth - 40 - 20) / 2 - 10, 
  },
  answerButtonText: {
    color: '#fff',
    fontSize: 14, 
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#333',
  },
});

export default QuizScreen;
