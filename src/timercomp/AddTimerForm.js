// components/AddTimerForm.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimerContext } from './TimerContext';
import { ThemeContext } from '../theme/ThemeContext';

export const AddTimerForm = ({ onClose }) => {
  const { dispatch } = useContext(TimerContext);
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleSubmit = () => {
    // Validate inputs
    if (!name.trim() || !duration.trim() || !category.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const durationInSeconds = parseInt(duration, 10);
    if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    // Create new timer
    const newTimer = {
      id: Date.now().toString(),
      name: name.trim(),
      duration: durationInSeconds,
      category: category.trim(),
      halfwayAlert,
      remainingTime: durationInSeconds,
      isRunning: false,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TIMER', payload: newTimer });
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.form,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>Add New Timer</Text>

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
          placeholder="Timer Name"
          placeholderTextColor={theme.muted}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
          placeholder="Duration (seconds)"
          placeholderTextColor={theme.muted}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: theme.background,
            },
          ]}
          placeholderTextColor={theme.muted}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity
          style={styles.alertToggle}
          onPress={() => setHalfwayAlert(!halfwayAlert)}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: theme.accent },
              halfwayAlert && { backgroundColor: theme.accent },
            ]}
          />
          <Text style={[styles.alertText, { color: theme.text }]}>
            Enable halfway alert
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: theme.muted },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: theme.card }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: theme.accent },
            ]}
            onPress={handleSubmit}
          >
            <Text style={[styles.buttonText, { color: theme.card }]}>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    backgroundColor: '#fff', // fallback
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    paddingTop: 24, // extra padding for comfort
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', // fallback
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd', // fallback
    color: '#000', // fallback
    backgroundColor: '#fff', // fallback
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  alertToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF', // fallback
    borderRadius: 4,
    marginRight: 10,
  },
  alertText: {
    fontSize: 16,
    color: '#000', // fallback
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // fallback
  },
  submitButton: {
    backgroundColor: '#007AFF', // fallback
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // fallback
  },
});
