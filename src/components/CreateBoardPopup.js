import React, {useState} from 'react';
import Popup from './Popup';
import CloseIcon from '@mui/icons-material/Close';
import './CreateBoardPopup.css';
import {useForm} from 'react-hook-form';
import {addNewBoard} from '../services/kanbanBoardService';
import { useSelector, useDispatch } from 'react-redux';
import {selectUser} from '../features/userSlice';
import { fetchUser } from '../features/userSlice';
import {fetchBoard, setBoard} from '../features/kanbanBoardSlice';
import { useNavigate } from 'react-router-dom';

const CreateBoardPopup = ({show, setShow}) => {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const {register, handleSubmit, reset, formState:{errors}} = useForm();
    const navigate = useNavigate();
    const [boardAlreadyCreated, setBoardAlreadyCreated] = useState(false);

    const createBoard = async (formData) => {

        for(let i=0; i<user.boardsUserHasCreated.length; i++){
            let boardName = user.boardsUserHasCreated[i].title
            if(boardName === formData.boardTitle) {
                setBoardAlreadyCreated(true);

                setTimeout(() => {
                    setBoardAlreadyCreated(false)
                }, 5000)

                return
            }
        }

        let response = await addNewBoard(formData.boardTitle)
        dispatch(fetchUser(user.id))
        dispatch(fetchBoard(response.id))
        reset()
        setShow(false)
        navigate(`/${response.id}`)
        
    }

    if(!show) {
        return <></>
    }

    return (
        <Popup>
            <form onSubmit={handleSubmit(createBoard)}>
                <div className='createNewBoard'>
                    <div className='closeShowCreateBoard'>
                        <CloseIcon  onClick={() => {
                                        setShow(false)
                                        setBoardAlreadyCreated(false)
                                        reset()
                                    }} 
                        />
                    </div>
                    <h3>Create New Board</h3>
                    <div className='inputFields'>
                        <h5>Board Title</h5>
                        {errors.boardTitle && errors.boardTitle.type === 'required' && (<p role='alert' className='createBoard_errors'>Board Title is required</p>)}
                        {errors.boardTitle && errors.boardTitle.type === 'maxLength' && (<p role='alert' className="createBoard_errors">Board Title cannot exceed 20 characters</p>)}
                        {boardAlreadyCreated && <p className='createBoard_errors'>You have already created a board with the same title</p>}
                        <input 
                            name="boardTitle"
                            {...register('boardTitle', {required: true, maxLength: 20})}
                            type='text' 
                            placeholder='e.g. Marketing Plan' />
                    </div>
                    <input type='submit' value='Create Board' />
                </div>
            </form>
        </Popup>
    )
}

export default CreateBoardPopup;