import React, {useEffect, useState} from 'react';
import Popup from './Popup';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useForm} from 'react-hook-form';
import './AddUserPopup.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoard } from '../features/kanbanBoardSlice';
import { addUserToBoard } from '../services/kanbanBoardService';
import { fetchBoard } from '../features/kanbanBoardSlice';

//setShow function determines whether the AddUserPopup should be shown. If true is passed to the set show function then the AddUserPop will be shown
// if false is passed in then the main board options menu will be shown (i.e. the menu where the user can choose to add a user, remove a user, or delete the board)

// setShowPopup function is used to close the entire popup menu. If true is passed in then the popup will be shown, if false is passed in to the function then
// the popup will close.
const AddUserPopup = ({setShow, setShowPopup}) => {
    const dispatch = useDispatch();
    const board = useSelector(selectBoard);
    const [errorAddingUser, setErrorAddingUser] = useState(false);
    const [userAddedAlready, setUserAddedAlready] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const {register, handleSubmit, formState:{errors}} = useForm();
    
    useEffect(() => {
        if(formSubmitted && !errorAddingUser) {
            setShowPopup(false)
            setShow(false)
        }

        setFormSubmitted(false)

        setTimeout(() => {
            setErrorAddingUser(false) //reset user adding error to false so message dissappears
        }, 5000)

    }, [errorAddingUser, formSubmitted])


    const closePopup = () => {
        setShow(false)
        setShowPopup(false)
    }

    const addUser = async (formData) => {
        let userEmail = formData.userEmail;
        const isUserAddedToBoard = board.usersAddedToBoard.filter(u => u.email === userEmail).length
        
        if(isUserAddedToBoard > 0 || board.owner.email === userEmail) {
            setUserAddedAlready(true)
            setTimeout(() => {
                setUserAddedAlready(false)
            }, 5000)

        } else {
            try {
                await addUserToBoard(board.id, userEmail)
                setFormSubmitted(true)
                dispatch(fetchBoard(board.id))
                setErrorAddingUser(false)
            } catch (err) {
                setErrorAddingUser(true)
            }
        }   

        
    } 

    return (
        <Popup>
            <form onSubmit={handleSubmit(addUser)}>
                <div className='closeUserPopup'>
                    <ArrowBackIcon onClick={() => setShow(false)} />
                    <CloseIcon onClick={closePopup} />
                </div>
                <h3 className='popupTitle'>Add User</h3>
                <div className='inputContainer'>
                    {userAddedAlready && <p className='submitError'>User already added to board</p>}
                    {errorAddingUser && <p className='submitError'>User not found</p>}
                    {errors.userEmail && errors.userEmail.type === 'required' && (<p className='submitError' role='alert'>User Email is Required</p>)}
                    <input type='email' name='userEmail' {...register('userEmail', {required: true})} placeholder="Enter Email of User" />
                </div>
                <input className='submitUserEmail' type='submit' value="Add User" />
            </form>
        </Popup>
    )
}

export default AddUserPopup