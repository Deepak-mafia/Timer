// components/TimerGroup.js
import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Timer } from './Timer';
import { TimerContext } from './TimerContext';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';

export const TimerGroup = ({ category, timers }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { dispatch } = useContext(TimerContext);
  const { theme } = useContext(ThemeContext);
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  // Animate arrow rotation
  const toggleAccordion = () => {
    setIsExpanded(prev => {
      Animated.timing(rotateAnim, {
        toValue: prev ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return !prev;
    });
  };

  // Smarter bulk action logic
  const incompleteTimers = timers.filter(t => !t.isCompleted);
  const runningTimers = timers.filter(t => t.isRunning && !t.isCompleted);
  const pausedTimers = timers.filter(t => !t.isRunning && !t.isCompleted);
  const needsReset = timers.some(
    t => t.isCompleted || t.remainingTime !== t.duration,
  );

  const showPlay = pausedTimers.length > 0;
  const showPause = runningTimers.length > 0;
  const showReset = needsReset;

  // Sort timers: incomplete first, then completed
  const sortedTimers = [...timers].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      return a.name.localeCompare(b.name);
    }
    return a.isCompleted ? 1 : -1;
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.header,
          { backgroundColor: theme.chip, borderBottomColor: theme.border },
        ]}
        onPress={toggleAccordion}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>
            {category}
          </Text>
          <View style={styles.bulkActions}>
            {showPlay && (
              <TouchableOpacity
                onPress={() =>
                  dispatch({ type: 'BULK_START', payload: category })
                }
              >
                <Play color={theme.muted} size={24} />
              </TouchableOpacity>
            )}
            {showPause && (
              <TouchableOpacity
                onPress={() =>
                  dispatch({ type: 'BULK_PAUSE', payload: category })
                }
              >
                <Pause color={theme.muted} size={24} />
              </TouchableOpacity>
            )}
            {showReset && (
              <TouchableOpacity
                onPress={() =>
                  dispatch({ type: 'BULK_RESET', payload: category })
                }
              >
                <RotateCcw color={theme.muted} size={24} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
            marginLeft: 8,
          }}
        >
          <ChevronDown color={theme.muted} size={24} />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.timerList}>
          {sortedTimers.map(timer => (
            <Timer key={timer.id} timer={timer} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 10,
  },
  timerList: {
    padding: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
