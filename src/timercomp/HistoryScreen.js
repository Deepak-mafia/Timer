// screens/HistoryScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { TimerContext } from './TimerContext';
import { ThemeContext } from '../theme/ThemeContext';
import Share from 'react-native-share';

export const HistoryScreen = ({ navigation }) => {
  const { state } = useContext(TimerContext);
  const { theme } = useContext(ThemeContext);

  const handleExport = async () => {
    try {
      const json = JSON.stringify(state.history, null, 2);
      const base64 = btoa(unescape(encodeURIComponent(json)));
      const shareOptions = {
        title: 'Export Timer History',
        message: 'Here is my timer history!',
        url: 'data:application/json;base64,' + base64,
        type: 'application/json',
        filename: 'timer-history.json',
      };
      await Share.open(shareOptions);
    } catch (e) {
      console.log('error inside catch', e);

      // Optionally handle error
    }
  };

  const renderHistoryItem = ({ item }) => {
    const completedDate = new Date(item.completedAt).toLocaleString();
    return (
      <View
        style={[
          styles.historyItem,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <View style={styles.itemHeader}>
          <Text style={[styles.timerName, { color: theme.text }]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.category,
              { color: theme.accent, backgroundColor: theme.chip },
            ]}
          >
            {item.category}
          </Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={[styles.duration, { color: theme.muted }]}>
            Duration: {item.duration} seconds
          </Text>
          <Text style={[styles.completedAt, { color: theme.muted }]}>
            Completed: {completedDate}
          </Text>
        </View>
      </View>
    );
  };

  const groupedHistory = state.history.reduce((groups, item) => {
    const date = new Date(item.completedAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const sections = Object.entries(groupedHistory)
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime(),
    )
    .map(([date, items]) => ({
      title: date,
      data: items,
    }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <View
        style={[
          styles.customHeader,
          { backgroundColor: theme.card, borderBottomColor: theme.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>History</Text>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: theme.accent }]}
          onPress={handleExport}
        >
          <Text style={{ color: theme.card, fontWeight: 'bold' }}>Export</Text>
        </TouchableOpacity>
      </View>
      {state.history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No completed timers yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={item => item.title}
          renderItem={({ item: section }) => (
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionHeader,
                  { color: theme.text, backgroundColor: theme.chip },
                ]}
              >
                {section.title}
              </Text>
              <FlatList
                data={section.data}
                renderItem={renderHistoryItem}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    elevation: 2,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  exportBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: '#000', // fallback
  },
  historyItem: {
    backgroundColor: '#fff', // fallback
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // fallback
  },
  category: {
    fontSize: 14,
    backgroundColor: '#f0f0f0', // fallback
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#007AFF', // fallback
  },
  itemDetails: {
    flexDirection: 'column',
  },
  duration: {
    color: '#666', // fallback
    marginBottom: 4,
  },
  completedAt: {
    color: '#666', // fallback
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000', // fallback
  },
});
