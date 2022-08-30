import React from 'react';
import './Task.css';
import { useDispatch } from 'react-redux';
import { setTask } from '../features/selectedTaskSlice';

const Task = ({task}) => {
    const dispatch = useDispatch();
    let subtasksComplete = task.subTasks.filter(s => s.isCompleted).length

    
    return (
        <>
            <div className='task' onClick={() => dispatch(setTask(task))}>
                <div className='taskTitle'>
                    {task.title}
                </div>
                <div className='subTasks'>
                    {task.subTasks.length > 0 ? subtasksComplete + " of " + task.subTasks.length + " subtasks" : "" }
                </div>
            </div>
        </>
    )
}

export default Task;