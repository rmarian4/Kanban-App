import React, {useEffect, useState} from 'react';
import Popup from './Popup';
import CloseIcon from '@mui/icons-material/Close';
import './AddTaskPopup.css';
import './DropDownMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {useForm} from 'react-hook-form';
import {addTask} from '../services/tasksService';
import { useDispatch, useSelector} from 'react-redux';
import {addTaskToBoard, fetchBoard, selectBoard} from '../features/kanbanBoardSlice';
import { fetchUser, selectUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const AddTaskPopup = ({show, setShow}) => {
    const board = useSelector(selectBoard);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit, reset, formState: {errors}} = useForm()
    const statusesList = board.statuses;
    const usersList = board.usersAddedToBoard;
    const boardOwner = board.owner;
    const [selectedStatus, setSelectedStatus] = useState(statusesList[0]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [subtaskArray, setSubtaskArray] = useState([])
    const [statusRemovedErr, setStatusRemovedErr] = useState(false)
    const [userRemovedErr, setUserRemovedErr] = useState(false)

    useEffect(() => {
        setSelectedStatus(statusesList[0])
    }, [statusesList])




    const createTask = async (formData) => {
        const newTask = {
            BoardId: board.id,
            UserAssignedToTask: selectedUser === null ? null : selectedUser[0],
            Title: formData.title,
            Description: formData.description,
            Subtasks: subtaskArray.filter(s => s !== ''),
            Status: selectedStatus
        }
        
        addTask(newTask)
        .then(res => {
            dispatch(addTaskToBoard(res))
            resetForm()
        })
        .catch(err => {
            if(err.response.status === 403) {
                navigate("/")
                dispatch(fetchUser(user.id))
            } else if(err.response.data === "User not apart of board") {
                setUserRemovedErr(true)
            } else if (err.response.status === 400) {
                dispatch(fetchBoard(board.id))
                setStatusRemovedErr(true)
            }
        })
        
    }

    const resetForm = () => {
        setShow(false)
        reset() //reset title and description fields
        setSubtaskArray([])
        setSelectedUser(null)
        setStatusRemovedErr(false)
        setSelectedStatus(statusesList[0])
    }

    if(!show) {
        return <></>  
    }

    if(board.statuses.length === 0) {
        return (
            <Popup>
                <div>
                    <div className='closePopup' >
                            <CloseIcon onClick={() => resetForm()}/>
                    </div>
                    <div className='popupMessage'>Add some statuses before adding a task!</div>
                </div>
            </Popup>
        )
    }

    return(
        <Popup>
            <form onSubmit={handleSubmit(createTask)}>
                <div className="addTask">
                    <div className='closePopup' >
                        <CloseIcon onClick={() => resetForm()}/>
                    </div>
                    <h3>Add New Task</h3>
                    <div className="titleInputContainer">
                        <h5>Title</h5>
                        {errors.title && errors.title.type === 'required' && (<p role='alert' className='addTask_error'>Title is required!</p>)}
                        {errors.title && errors.title.type === 'maxLength' && (<p role="alert" className='addTask_error'>Title cannot exceed 100 characters in length</p>)}
                        <input name="title" type='text' placeholder='e.g. Take a coffee break' {...register('title', {required: true, maxLength: 100})} />
                    </div>
                    <div className="descriptionInputContainer">
                        <h5>Description</h5>
                        {errors.description && errors.description.type === 'required' && <p role="alert" className='addTask_error'>Description is required!</p>}
                        {errors.description && errors.description.type === 'maxLength' && <p role="alert" className='addTask_error'>Description cannot exceed 500 characters in length</p>}
                        <textarea
                            name="description" 
                            rows="5"
                            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little" 
                            {...register('description', {required: true, maxLength: 500})}
                        />
                    </div>
                    <div className="addSubtaskContainer">
                        <h5>Subtasks</h5>
                        <div className='subtaskList'>
                            {subtaskArray.map((subtask, i) => {
                                return( 
                                    <div className='subtask' key={"subtask-" + i} >
                                        <input type='text' 
                                            placeholder="e.g. Make coffee"
                                            onChange={e => {
                                                                const newSubTaskArray = [...subtaskArray]
                                                                newSubTaskArray[i] = e.target.value
                                                                setSubtaskArray(newSubTaskArray)
                                                            }} 
                                        />
                                        <div className='deleteSubtask' 
                                            onClick={() => {
                                                const newSubTaskArray = [...subtaskArray]
                                                newSubTaskArray.splice(i, 1)
                                                setSubtaskArray(newSubTaskArray)
                                            }}
                                        >
                                            <CloseIcon/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='addSubtaskBtnContainer'>
                            <input className='addsubtaskBtn' type='button'  onClick={() => setSubtaskArray([...subtaskArray, ''])} value="+Add Subtask"/>  
                        </div>

                    </div>
                    <div className="chooseStatusContainer">
                        <h5>Status</h5>
                        {statusRemovedErr && <p className='addTask_error'>The status you have selected has been removed</p>}
                        <DropdownButton  title={selectedStatus}>
                            {statusesList.map((s, i) => {
                                return <Dropdown.Item key={'statusoption-' + i} onClick={() => setSelectedStatus(s)}>{s}</Dropdown.Item>
                            })}
                        </DropdownButton>
                    </div>
                    <div className='assignUserContainer'>
                        <h5>Assign User to Task</h5>
                        {userRemovedErr && <p className='addTask_error'>This user has been removed from the board</p>}
                        <DropdownButton title={selectedUser === null ? 'Choose User' : selectedUser[1]} >
                            {usersList.map((u, i) => {
                                return <Dropdown.Item 
                                            key={'useroption-'+i} 
                                            onClick={() => setSelectedUser([u.id, u.name + " (" + u.email + ")"])}>
                                                {u.name} ({u.email})
                                        </Dropdown.Item>
                            })}
                            <Dropdown.Item 
                            onClick={() => setSelectedUser([boardOwner.id, boardOwner.name + " (" + boardOwner.email + ")"])}>
                                    {boardOwner.name} ({boardOwner.email})
                            </Dropdown.Item>
                            
                        </DropdownButton>
                    </div>
                        
                    <input type='submit' value='Create Task'/>
                </div>
            </form>
        </Popup>
    )

    
}

export default AddTaskPopup;