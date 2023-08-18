import axios from "axios";
import {auth} from '../firebase/firebase';

const baseUrl = "http://159.203.24.243:5001/api/KanbanApp/users";

export const getUser = async (userId) => {
    const token = await auth.currentUser.getIdToken();

    const config = {
        headers: {
            authorization: "Bearer " + token
        }
    }

    let response = await axios.get(`${baseUrl}/${userId}`, config)
    return response.data;
}

export const logUserIn = async (firebaseId) => {
    let response = await axios.get(`${baseUrl}/${firebaseId}`)
    return response.data;
}

export const addUser = async (firebaseId, name, email ) => {
    let requestBody = 
    {
        name, 
        email,
        firebaseId
    }
    let response = await axios.post(baseUrl, requestBody)
    return response.data
}

