import { createSlice } from "@reduxjs/toolkit";
import {getUser, logUserIn} from '../services/usersService';




const userSlice = createSlice({
    name: 'user',
    initialState:null,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
        removeBoardFromUser: (state, action) => {
            return {...state, boardsUserHasCreated: state.boardsUserHasCreated.filter(b => b.id !== action.payload)}
        },
        logUserOut: (state, action) => {
            return null;
        }
    }
})

export const logIn = (firebaseId) => {
    return async dispatch => {
        let user = await logUserIn(firebaseId);
        dispatch(setUser(user))
    }
}

export const fetchUser = (id) => {
    return async dispatch => {
        let user = await getUser(id);
        dispatch(setUser(user));
    }
}

export const {setUser, removeBoardFromUser, logUserOut} = userSlice.actions;
export const selectUser = state => state.user;
export default userSlice.reducer;