import axios from 'axios';
import { auth } from '../firebase/firebase';

const baseUrl = "http://159.203.24.243:5001/api/KanbanApp/boards";

export const getBoard = async (id) => {
    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }
    let response = await axios.get(`${baseUrl}/${id}`, config);
    return response.data;
}

export const addNewStatus = async (status, boardId) => {
    let requestBody = {
        status
    }

    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }
    
    await axios.put(`${baseUrl}/${boardId}/status`, requestBody, config)
    
}

export const addUserToBoard = async (boardId, userEmail) => {
    const token = await auth.currentUser.getIdToken();
    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }
    await axios.put(`${baseUrl}/${boardId}/users`, {userEmail}, config)
}

export const removeUserFromBoard = async (boardId, userIds) => {
    const token = await auth.currentUser.getIdToken();

    const headers = {
        authorization: "Bearer " + token
    }

    await axios.delete(`${baseUrl}/${boardId}/users`, { data: {userIds}, headers });
}

export const addNewBoard = async (boardTitle) => {
    const token = await auth.currentUser.getIdToken();

    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }
    
    let requestBody = {
        title: boardTitle,
    }

    let response = await axios.post(baseUrl, requestBody, config)
    return response.data
}

export const deleteStatus = async (boardId, status) => {
    const token = await auth.currentUser.getIdToken();

    const headers = {
        authorization: "Bearer " + token
    }

    let requestBody = {
        status,
    }

    await axios.delete(`${baseUrl}/${boardId}/status`, {data: requestBody, headers})
}

export const deleteBoard = async (boardId) => {
    const token = await auth.currentUser.getIdToken();

    const headers = {
        authorization: "Bearer " + token
    }

    await axios.delete(`${baseUrl}/${boardId}`, {headers})
}

export const deleteTask = async (taskId, boardId) => {
    const token = await auth.currentUser.getIdToken();

    const headers = {
        authorization: "Bearer " + token
    }

    await axios.delete(`${baseUrl}/${boardId}/tasks/${taskId}`, {headers})
}
