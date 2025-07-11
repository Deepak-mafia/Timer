import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TimerContext } from './TimerContext';
import { ThemeContext } from '../theme/ThemeContext';

export const Timer = ({ timer }) => {
  const { dispatch } = useContext(TimerContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    let interval;
    if (timer.isRunning && timer.remainingTime > 0) {
      interval = setInterval(() => {
        const newRemainingTime = timer.remainingTime - 1;
        if (
          timer.halfwayAlert &&
          newRemainingTime === Math.floor(timer.duration / 2)
        ) {
          Alert.alert('Halfway There!', `${timer.name} is at 50%`);
        }
        if (newRemainingTime === 0) {
          clearInterval(interval);
          dispatch({ type: 'COMPLETE_TIMER', payload: timer.id });
          Alert.alert('Timer Complete!', `${timer.name} has finished!`);
        } else {
          dispatch({
            type: 'UPDATE_TIMER_TIME',
            payload: { id: timer.id, remainingTime: newRemainingTime },
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.remainingTime]);

  const handleStart = () => {
    dispatch({ type: 'START_TIMER', payload: timer.id });
  };
  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER', payload: timer.id });
  };
  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER', payload: timer.id });
  };

  const progress =
    ((timer.duration - timer.remainingTime) / timer.duration) * 100;

  return (
    <View
      style={[
        styles.timerContainer,
        { backgroundColor: theme.card, borderColor: theme.border },
        timer.isCompleted && { backgroundColor: theme.chip, opacity: 0.8 },
      ]}
    >
      <View style={styles.timerInfo}>
        <Text
          style={[
            styles.timerName,
            { color: theme.text },
            timer.isCompleted && { color: theme.muted },
          ]}
        >
          {timer.name}
        </Text>
        <Text
          style={[
            styles.timerTime,
            { color: theme.muted },
            timer.isCompleted && { color: theme.muted },
          ]}
        >
          {timer.isCompleted ? 'Completed' : `${timer.remainingTime}s`}
        </Text>
      </View>
      <View
        style={[styles.progressBarContainer, { backgroundColor: theme.border }]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: timer.isCompleted ? '100%' : `${progress}%`,
              backgroundColor: timer.isCompleted ? theme.muted : theme.accent,
            },
          ]}
        />
      </View>
      <View style={styles.controls}>
        {!timer.isCompleted ? (
          <>
            {!timer.isRunning ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.accent }]}
                onPress={handleStart}
              >
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.accent }]}
                onPress={handlePause}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.chip }]}
              onPress={handleReset}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Reset
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.muted }]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerTime: {
    fontSize: 16,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
