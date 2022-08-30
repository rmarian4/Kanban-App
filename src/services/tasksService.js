import axios from 'axios';
import { auth } from '../firebase/firebase';

const baseUrl = "https://localhost:7298/api/KanbanApp/tasks";

export const addTask = async (requestBody) => {
    const token = await auth.currentUser.getIdToken();

    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }

    let response = await axios.post(baseUrl, requestBody, config);

    return response.data;
}

export const updateTask = async (updatedTask, boardId) => {
    const token = await auth.currentUser.getIdToken();

    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }

    let requestBody = {
        updatedTask,
        boardId,
    }


    await axios.put(baseUrl, requestBody, config)
}

