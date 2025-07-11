// components/AddTimerForm.js
import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimerContext } from './TimerContext';
import { ThemeContext } from '../theme/ThemeContext';
import { Check } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const AddTimerForm = ({ onClose }) => {
  const { dispatch } = useContext(TimerContext);
  const { theme } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const showError = msg => {
    setError(msg);
    setErrorKey(prev => prev + 1);
  };

  // Slide-down and auto-dismiss effect for error
  React.useEffect(() => {
    if (error) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      const timeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setError(''));
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      slideAnim.setValue(-100);
    }
  }, [error, errorKey]);

  const handleSubmit = () => {
    if (!name.trim() || !duration.trim() || !category.trim()) {
      showError('Please fill in all fields');
      return;
    }
    const durationInSeconds = parseInt(duration, 10);
    if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
      showError('Please enter a valid duration');
      return;
    }
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
              halfwayAlert && {
                backgroundColor: theme.accent,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            {halfwayAlert && <Check color={theme.card} size={18} />}
          </View>
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
              Create Timer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Error Alert */}
      <Animated.View
        style={[
          styles.topModalOverlay,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {error ? (
          <View
            style={[
              styles.topModalContent,
              { backgroundColor: theme.card, borderColor: theme.accent },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.text }]}>
              {error}
            </Text>
          </View>
        ) : null}
      </Animated.View>
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
  topModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    zIndex: 100,
    paddingTop: 32,
  },
  topModalContent: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 220,
    maxWidth: '90%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
