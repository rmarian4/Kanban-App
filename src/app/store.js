import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import kanbanBoardReducer from '../features/kanbanBoardSlice';
import selectedTaskSlice from '../features/selectedTaskSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    kanbanBoard: kanbanBoardReducer,
    selectedTask: selectedTaskSlice,
  },
});
