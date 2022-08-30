import { createSlice } from '@reduxjs/toolkit';

const selectedTaskSlice = createSlice({
    name: 'selectedTask',
    initialState: null,
    reducers: {
        setTask: (state, action) => {
            return action.payload
        },
        resetTask: (state, action) => {
            return null
        }
    }
})


export const {setTask, resetTask} = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
export const selectTask = state => state.selectedTask;