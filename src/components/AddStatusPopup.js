import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Popup from './Popup';
import './AddStatusPopup.css';
import {useForm} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addStatusToKanbanBoard, fetchBoard, selectBoard } from '../features/kanbanBoardSlice';
import { fetchUser, selectUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const AddStatusPopup = ({show, setShow}) => {
    const board = useSelector(selectBoard);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit, reset, formState:{errors}} = useForm();
    const [statusAlreadyAddedError, setStatusAlreadyAddedError] = useState(false);

    const addStatus = (formData) => {
        if(board.statuses.includes(formData.status)) {
            setStatusAlreadyAddedError(true)

            setTimeout(() => {
                setStatusAlreadyAddedError(false)
            }, 5000)

        } else {
            dispatch(addStatusToKanbanBoard(formData.status, board.id))
            .then(() => {
                reset()
                setShow(false)
            })
            .catch(err => {
                if(err.response.status === 403) {
                    navigate("/")
                    dispatch(fetchUser(user.id))
                } else if (err.response.status === 400) {
                    dispatch(fetchBoard(board.id))
                    setShow(false)
                }
            })
        }
        
    }

    if(!show) {
        return <></>
    }

    return (
        <Popup>
            <form onSubmit={handleSubmit(addStatus)}>
                <div className="addStatus">
                    <div className='closePopup'>
                        <CloseIcon  onClick={() => {
                                        setShow(false)
                                        reset()
                                    }} 
                        />
                    </div>
                    <h3>Add Status</h3>
                    <div className="statusInputContainer">
                        {errors.status && errors.status.type==="required" && (<p role="alert" className='addStatus_errors'>Status is required</p>)}
                        {errors.status && errors.status.type==="maxLength" && (<p role="alert" className='addStatus_errors'>Status length cannot exceed 10 characters</p>)}
                        {statusAlreadyAddedError && <p className='addStatus_errors'>Status already exists</p>}
                        <input 
                            name="status" 
                            {...register('status', {required: true, maxLength: 15})} 
                            type='text' placeholder="e.g. In Progress" 
                        />
                    </div>
                    <input type='submit' value='Add Status' />
                </div>
            </form>
        </Popup>
    )
}

export default AddStatusPopup;