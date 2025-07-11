// TimerContext.js
import React, {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  timers: [],
  history: [],
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };

    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload ? {...timer, isRunning: true} : timer,
        ),
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload ? {...timer, isRunning: false} : timer,
        ),
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {
                ...timer,
                remainingTime: timer.duration,
                isRunning: false,
                isCompleted: false,
              }
            : timer,
        ),
      };

    case 'UPDATE_TIMER_TIME':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id
            ? {...timer, remainingTime: action.payload.remainingTime}
            : timer,
        ),
      };

    case 'COMPLETE_TIMER':
      const completedTimer = state.timers.find(t => t.id === action.payload);
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {...timer, isRunning: false, isCompleted: true}
            : timer,
        ),
        history: [
          ...state.history,
          {...completedTimer, completedAt: new Date().toISOString()},
        ],
      };

    case 'BULK_START':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload && !timer.isCompleted
            ? {...timer, isRunning: true}
            : timer,
        ),
      };

    case 'BULK_PAUSE':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload
            ? {...timer, isRunning: false}
            : timer,
        ),
      };

    case 'BULK_RESET':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload
            ? {
                ...timer,
                remainingTime: timer.duration,
                isRunning: false,
                isCompleted: false,
              }
            : timer,
        ),
      };

    default:
      return state;
  }
}

export const TimerContext = createContext();

export const TimerProvider = ({children}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('timerState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Ensure all running timers are paused when app restarts
          const restoredState = {
            ...parsedState,
            timers: parsedState.timers.map(timer => ({
              ...timer,
              isRunning: false,
            })),
          };
          dispatch({type: 'LOAD_STATE', payload: restoredState});
        }
      } catch (error) {
        console.error('Error loading state:', error);
      }
    };
    loadState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('timerState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    // Only save if state is not the initial empty state
    if (state.timers.length > 0 || state.history.length > 0) {
      saveState();
    }
  }, [state]);

  return (
    <TimerContext.Provider value={{state, dispatch}}>
      {children}
    </TimerContext.Provider>
  );
};
