import { createSlice } from "@reduxjs/toolkit";
import { getBoard, deleteBoard, removeUserFromBoard, deleteStatus, addNewStatus, deleteTask } from "../services/kanbanBoardService";
import { updateTask } from "../services/tasksService";



const kanbanBoardSlice = createSlice({
    name: 'kanbanBoard',
    initialState: null,
    reducers: {
        setBoard: (state, action) => {
            return action.payload;
        },
        resetToInitialState: (state, action) => {
            return null
        },
        addTaskToBoard: (state, action) => {
            return {...state, tasks: [...state.tasks, action.payload]}
        },
        addStatusToBoard: (state, action) => {
            return {...state, statuses: [...state.statuses, action.payload]}
        },
        updateTaskList: (state, action) => {
            let updatedTask = action.payload
            return {...state, tasks: state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)}
        },
        removeTaskFromTaskList: (state, action) => {
            let taskId = action.payload
            return {...state, tasks: state.tasks.filter(t => t.id !== taskId)}
        },
        removeStatusFromBoard: (state, action) => {
            let statusToBeRemoved = action.payload
            return {...state, statuses: state.statuses.filter(s => s !== statusToBeRemoved)}
        }
    }
})

export const fetchBoard = (id) => {
    return async dispatch => {
        let board = await getBoard(id)
        dispatch(setBoard(board));
    }
}

export const updateTaskInDatabase = (updatedTask, boardId) => {
    return async dispatch => {
        await updateTask(updatedTask, boardId)
        dispatch(updateTaskList(updatedTask))
    }
}

export const removeTask = (taskId, boardId) => {
    return async dispatch => {
        await deleteTask(taskId, boardId)
        dispatch(removeTaskFromTaskList(taskId))
    }
}

export const removeStatus = (boardId, status) => {
    return async dispatch => {
        await deleteStatus(boardId, status)
        dispatch(removeStatusFromBoard(status))
    }
}

export const addStatusToKanbanBoard = (status, boardId) => {
    return async dispatch => {
        await addNewStatus(status, boardId)
        dispatch(addStatusToBoard(status))
    }
}

export const removeUsersFromKanbanBoard = (boardId, userIdList) => {
    return async dispatch => {
        await removeUserFromBoard(boardId, userIdList);
        let board = await getBoard(boardId);
        dispatch(setBoard(board));
    }
}

export const removeBoard = (boardId) => {
    return async dispatch => {
        await deleteBoard(boardId)
        dispatch(resetToInitialState())
    }
}

export const {setBoard, addTaskToBoard, addStatusToBoard, updateTaskList, resetToInitialState, removeTaskFromTaskList, removeStatusFromBoard} = kanbanBoardSlice.actions;
export default kanbanBoardSlice.reducer;
export const selectBoard = state => state.kanbanBoard;