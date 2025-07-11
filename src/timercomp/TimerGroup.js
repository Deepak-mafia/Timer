// components/TimerGroup.js
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Timer } from './Timer';
import { TimerContext } from './TimerContext';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { ThemeContext } from '../theme/ThemeContext';

export const TimerGroup = ({ category, timers }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { dispatch } = useContext(TimerContext);
  const { theme } = useContext(ThemeContext);

  // Sort timers: incomplete first, then completed
  const sortedTimers = [...timers].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) {
      // If both are completed or both are incomplete, sort by name
      return a.name.localeCompare(b.name);
    }
    // Put incomplete timers first
    return a.isCompleted ? 1 : -1;
  });

  const incompleteCount = timers.filter(t => !t.isCompleted).length;

  const handleBulkStart = () => {
    dispatch({ type: 'BULK_START', payload: category });
  };

  const handleBulkPause = () => {
    dispatch({ type: 'BULK_PAUSE', payload: category });
  };

  const handleBulkReset = () => {
    dispatch({ type: 'BULK_RESET', payload: category });
  };

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
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>
            {category}
          </Text>
          <View style={styles.bulkActions}>
            {incompleteCount > 0 && (
              <>
                <TouchableOpacity onPress={handleBulkStart}>
                  <Play color={theme.muted} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBulkPause}>
                  <Pause color={theme.muted} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBulkReset}>
                  <RotateCcw color={theme.muted} size={24} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
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
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    fontWeight: '500',
  },
  timerList: {
    padding: 10,
  },
  headerLeft: {
    gap: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerCount: {
    fontSize: 12,
    marginTop: 2,
  },
});
