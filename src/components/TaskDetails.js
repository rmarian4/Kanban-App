import React, {useState} from 'react';
import Popup from './Popup';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import './TaskDetails.css';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectBoard, updateTaskInDatabase, removeTask, fetchBoard, resetToInitialState } from '../features/kanbanBoardSlice';
import './DropDownMenu.css'
import { resetTask } from '../features/selectedTaskSlice';
import { fetchUser, selectUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

//function ShowSubtasks called only when the subtasks array has length of 1 or more
const ShowSubtasks = (subtasksComplete, subtaskListCopy, task, setSubtaskListCopy) => {
    return (
        <div className='subtasks'>
            <h5>Subtasks ({subtasksComplete} of {subtaskListCopy.length})</h5>
            {task.subTasks.map((s, i) => {
                return (
                    <div key={"subtasks-"+i} className='subtaskContainer'>
                        <Form.Check 
                            defaultChecked={s.isCompleted} 
                            onChange={() => {
                                let newSubtaskListCopy = [...subtaskListCopy]
                                newSubtaskListCopy[i] = {...subtaskListCopy[i], isCompleted: !subtaskListCopy[i].isCompleted}
                                setSubtaskListCopy(newSubtaskListCopy)
                            }} 
                        />
                        
                        <div className='subtaskDescription'>
                            {s.description}
                        </div>
                    </div>
                )
            })}

        </div>
    )
}

const TaskDetails = ({task}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const board = useSelector(selectBoard);
    const user = useSelector(selectUser);
    const statusesList = board.statuses;
    const usersList = board.usersAddedToBoard;
    const boardOwner = board.owner;
    const [selectedStatus, setSelectedStatus] = useState(task.status);
    const [selectedUser, setSelectedUser] = useState(task.personAssignedToTask)
    const [subtaskListCopy, setSubtaskListCopy] = useState([...task.subTasks])
    const [showTaskOptions, setShowTaskOptions] = useState(false);
    const subtasksComplete = subtaskListCopy.filter(s => s.isCompleted).length
    const [userRemovedFromBoardErr, setUserRemovedFromBoardErr] = useState(false);
    
    

    const updateTask = () => {
        let updatedTask = 
        {
            ...task, 
            status: selectedStatus,
            personAssignedToTask: selectedUser,
            subTasks: subtaskListCopy
        }

        dispatch(updateTaskInDatabase(updatedTask, board.id))
        .then(() => {
            dispatch(resetTask())
        })
        .catch(err => {
            if(err.response.status === 403) { //if 403 response then user has been removed from board and no longer has authorization to update a task
                navigate("/");
                dispatch(fetchUser(user.id)) //refetch user from db
                dispatch(resetTask()) //set selected task back to null
                dispatch(resetToInitialState()) //reset selected board to null
            } else if (err.response.data === "User not apart of board") {
                setUserRemovedFromBoardErr(true)
            } else if (err.response.status === 400) {
                dispatch(fetchBoard(board.id))
                dispatch(resetTask())
            } else if (err.response.status === 401) {
                
            }
        })
    }

    const deleteTask = () => {
        if(window.confirm("Are you sure you want to delete this task?")){
            dispatch(removeTask(task.id, board.id))
            .then(() => {
                dispatch(resetTask())
            })
            .catch(err => {
                if(err.response.status === 403) {
                    navigate("/");
                    dispatch(fetchUser(user.id))
                }
            })
        }
    }

    


    return (
        <Popup >
            <div className='taskDetails' onClick={() => showTaskOptions ? setShowTaskOptions(false) : null}>

                <div className='closeDetails'>
                    <CloseIcon onClick={() => dispatch(resetTask())}/>
                </div>

                <div className='taskTitleContainer'>
                    <p className='taskTitle'>{task.title}</p>
                    <div className='taskOptions' onClick={() => setShowTaskOptions(!showTaskOptions)}>
                        <MoreVertOutlinedIcon />
                        {showTaskOptions ? <div onClick={deleteTask} className='taskOptionsContainer'>Delete Task</div> : null}
                    </div>
                </div>

                <div className='taskDescription'>
                    <p>{task.description}</p>
                </div>

                {task.subTasks.length > 0 ? ShowSubtasks(subtasksComplete, subtaskListCopy, task, setSubtaskListCopy) : null}  {/* only show subtasks if there are 1 or more subtasks */}
                

                <div className='statusContainer'>
                    <h5>Status</h5>
                    <DropdownButton  title={selectedStatus}>
                        {statusesList.map((s, i) => {
                            return <Dropdown.Item key={'statusoption-' + i} onClick={() => setSelectedStatus(s)}>{s}</Dropdown.Item>
                        })}
                    </DropdownButton>
                </div>

                <div className='assignedUserContainer'>
                    <h5>User Assigned To Task</h5>
                    {userRemovedFromBoardErr && <p className='userRemovedErr'>This user has been removed from the board</p>}
                    <DropdownButton title={selectedUser === null ? 'Choose User' : selectedUser.name + " (" + selectedUser.email + ")"} >
                        {usersList.map((u, i) => {
                            return <Dropdown.Item 
                                        key={'useroption-'+i} 
                                        onClick={() => setSelectedUser(u)}>
                                            {u.name} ({u.email})
                                    </Dropdown.Item>
                        })}
                        <Dropdown.Item 
                            onClick={() => setSelectedUser(boardOwner)}>
                                {boardOwner.name} ({boardOwner.email})
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSelectedUser(null)}>
                            No User Assigned To Task
                        </Dropdown.Item>
                    </DropdownButton>

                </div>
                <input type="button" onClick={updateTask} value="Save Changes"/>
            </div>
        </Popup>
    )
}

export default TaskDetails;