import React, {useState, useEffect} from "react";
import './Board.css';
import TasksColumn from './TasksColumn';
import { useDispatch, useSelector } from 'react-redux';
import {selectBoard, fetchBoard, resetToInitialState} from '../features/kanbanBoardSlice';
import AddTaskPopup from "./AddTaskPopup";
import AddStatusPopup from "./AddStatusPopup";
import BoardOptionsPopup from "./BoardOptionsPopup";
import CreateBoardPopup from './CreateBoardPopup';
import ShowBoardMenuOptions from "./ShowBoardMenuOptions";
import { resetTask, selectTask } from "../features/selectedTaskSlice";
import TaskDetails from "./TaskDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUser, selectUser } from "../features/userSlice";
import { auth } from "../firebase/firebase";



const ShowTasksOnBoard = (board, setShowAddStatus) => {
    let taskColumns = {}

    for(let i=0; i<board.statuses.length; i++){
        let status = board.statuses[i];
        taskColumns[status] = board.tasks.filter(t => t.status === status)
    }

    return (
        <>
        
            {Object.keys(taskColumns).map((key, i) => {
                    let randomColor = "#" + (Math.floor(Math.random()*16777215).toString(16)).toString();
                    if(localStorage.getItem('colors-' + i) === null) {
                        localStorage.setItem('colors-' + i, randomColor) //add color to local storage so when component re-renders colors do not change
                    }
                    return <TasksColumn key={i} tasksList={taskColumns[key]} status={key} color={localStorage.getItem('colors-' + i)} />
            })}
                
                
                <div className="addNewColContainer">
                    <div>
                        <div onClick={() => setShowAddStatus(true)} className="addNewColumnBtn">
                            +New Column
                        </div>
                    </div>
                </div> 

        </>
    )
}

const Board = () => {
    const board = useSelector(selectBoard);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const selectedTask = useSelector(selectTask);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddStatus, setShowAddStatus] = useState(false);
    const [showBoardOptions, setShowBoardOptions] = useState(false);
    const [showCreateBoard, setShowCreateBoard] = useState(false);
    const [showLogoutOption, setShowLogoutOption] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(board === null && location !== '/') {
            let id = location.pathname.slice(1) //get rid of '/' char in the path name
            dispatch(fetchBoard(id))
        } 
      }, [])


    useEffect(() => {
        if(board !== null && board.owner.id !== user.id && board.usersAddedToBoard.filter(u => u.id === u.id).length === 0) { //check if user has been removed from board
            navigate("/")
            dispatch(resetToInitialState())
            dispatch(fetchUser(user.id))
        }
    }, [board])


    
    
    return (
        <>
            
            {board !== null ? 
                <AddTaskPopup 
                    show={showAddTask} 
                    setShow={setShowAddTask} 
                    board={board}
                /> 
                
                : 
                    <></> 
            }
            <BoardOptionsPopup show={showBoardOptions} setShow={setShowBoardOptions} />

            <AddStatusPopup show={showAddStatus} setShow={setShowAddStatus}/>

            <CreateBoardPopup show={showCreateBoard} setShow={setShowCreateBoard} />

            {selectedTask !== null && <TaskDetails task={selectedTask} />}

            <div className="board">

                <div className="topMenu" onClick={() => showLogoutOption ? setShowLogoutOption(false) : null}>

                    
                    {board !== null && <ShowBoardMenuOptions 
                                            board={board} 
                                            setShowAddTask={setShowAddTask} 
                                            setShowBoardOptions={setShowBoardOptions} 
                                            setShowCreateBoard={setShowCreateBoard}
                                            setShowLogoutOption ={setShowLogoutOption}
                                            showLogoutOption={showLogoutOption}
                    />}
                
                </div>

                <div className="boardTasks">
                    {board !== null ? ShowTasksOnBoard(board, setShowAddStatus) : null}
                </div>

                <div className="boardBottom"></div>
                
            </div>
        </>
    )
}

export default Board;