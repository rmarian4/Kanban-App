import React from 'react';
import './TasksColumn.css';
import Task from './Task';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoard, removeStatus, selectBoard } from '../features/kanbanBoardSlice';
import { fetchUser, selectUser } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const TasksColumn = ({tasksList, status, color}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const board = useSelector(selectBoard); 
    const user = useSelector(selectUser);
   

    const removeStatusFromBoard = () => {
        if(window.confirm("Are you sure you want to remove this status?")) {
            dispatch(removeStatus(board.id, status))
            .catch(err => {
                if(err.response.status === 403) {
                    navigate("/")
                    dispatch(fetchUser(user.id))
                } else if(err.response.status === 400) {
                    dispatch(fetchBoard(board.id))
                }
            })
        }
    }

    return (
        <div className='tasksColumn'>
            <div className='statusTitle'>
                <div className='colorDot' style={{backgroundColor: `${color}`}}></div>
                <h5 className='status'>{status} ({tasksList.length})</h5>
                {tasksList.length === 0 ? <DeleteIcon onClick={removeStatusFromBoard}/> : null}
            </div>

            {tasksList.map((task, i) => {
                return <Task key={i} task={task}/>
            })}

            
        </div>
    )
}

export default TasksColumn;