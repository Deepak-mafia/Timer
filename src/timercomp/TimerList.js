import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimerContext } from './TimerContext';
import { TimerGroup } from './TimerGroup';

export const TimerList = ({ categories }) => {
  const { state } = useContext(TimerContext);

  return (
    <View style={styles.container}>
      {categories.map(category => (
        <TimerGroup
          key={category}
          category={category}
          timers={state.timers.filter(timer => timer.category === category)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
