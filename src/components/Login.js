import React, {useEffect} from 'react';
import './Login.css';
import {auth, provider} from '../firebase/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { logIn } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { addUser } from '../services/usersService';

const Login = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(auth, user => { //for persistent login
            if(user) {
                dispatch(logIn(user.uid))
            }
        })
    }, [])
    
    const signIn = () => {
        signInWithPopup(auth, provider)
        .then(({user}) => {
            console.log(user)
            dispatch(logIn(user.uid))
            .catch(error => {
                //if error when fetching user then that means this is a new user logging in
                addUser(user.uid, user.displayName, user.email) //add new user to database
                .then(() => {
                    dispatch(logIn(user.uid))
                })
                .catch(err => {
                    console.log(err.message)
                })
            })
        })
        .catch(error => {
            alert(error.message)
        })
    }


    return (
        <div className='login'>
            <div className='loginContainer'>
                <div className='loginbackground'>
                    <img src='https://res.cloudinary.com/dz209s6jk/image/upload/q_auto:good,w_900/Challenges/jc26dvdz8ou8mvbu08uh.jpg'/>
                    <button onClick={signIn}>Sign In</button>
                </div>
            </div>
        </div>
    )
}

export default Login;