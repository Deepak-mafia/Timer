// screens/HomeScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { TimerContext } from './TimerContext';
import { TimerList } from './TimerList';
import { History, Plus } from 'lucide-react-native';
import { Sun, Moon } from 'lucide-react-native';
import { AddTimerForm } from './AddTimerForm';
import { ThemeContext } from '../theme/ThemeContext';

export const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const { state } = useContext(TimerContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme.mode === 'dark';

  const categories = [...new Set(state.timers.map(timer => timer.category))];

  const filteredCategories =
    selectedCategory.length > 0 ? selectedCategory : categories;

  const updateSelectedCategory = category => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(prev => prev.filter(item => item !== category));
    } else {
      setSelectedCategory(prev => [...prev, category]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Header */}
      <View
        style={[
          styles.customHeader,
          { backgroundColor: theme.card, borderBottomColor: theme.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Timers</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? '#222' : '#FFD700'}
            trackColor={{ false: '#ccc', true: '#333' }}
            style={{ marginRight: 8 }}
          />
          {isDark ? (
            <Moon color={'#FFD700'} size={22} />
          ) : (
            <Sun color={'#FFD700'} size={22} />
          )}
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('History')}
          >
            <History color={'gray'} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory.includes(category) && styles.selectedChip,
            ]}
            onPress={() => updateSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory.includes(category) &&
                  styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <AddTimerForm onClose={() => setIsModalVisible(false)} />
        </View>
      </Modal>
      {state.timers.length === 0 ? (
        <View style={styles.firstTimeContainer}>
          <Text style={[styles.firstTimeText, { color: theme.text }]}>
            Try creating your first timer
          </Text>
        </View>
      ) : (
        <ScrollView>
          <TimerList categories={filteredCategories} />
        </ScrollView>
      )}
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.accent }]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus color={'#fff'} size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 18,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  historyButton: {
    padding: 10,
    borderRadius: 18,
  },
  categoryContainer: {
    maxHeight: 50,
    paddingVertical: 5,
  },
  categoryContent: {
    paddingHorizontal: 10,
    gap: 10,
  },
  categoryChip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 32,
    borderColor: '#ddd',
  },
  selectedChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  statsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  firstTimeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstTimeText: {
    fontSize: 18,
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
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
