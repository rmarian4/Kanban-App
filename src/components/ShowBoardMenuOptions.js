import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import './ShowBoardMenuOptions.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchBoard, selectBoard } from '../features/kanbanBoardSlice';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useNavigate } from 'react-router-dom';
import TableChartIcon from '@mui/icons-material/TableChart';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { logUserOut } from '../features/userSlice';
import { resetToInitialState } from '../features/kanbanBoardSlice';


const ShowBoardMenuOptions = ({board, setShowAddTask, setShowBoardOptions, setShowCreateBoard, showLogoutOption, setShowLogoutOption}) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const setBoard = (id) => {
        dispatch(fetchBoard(id))
        navigate(`/${id}`)
    }

    const logout = () => {
        signOut(auth)
        .then(() => {
            dispatch(logUserOut())
            dispatch(resetToInitialState()) //reset board to null
            navigate('/')
        })
    }

    if(board.owner.id !== user.id) {
        return(
            <>
                <div className="boardTitle">{board.title}</div>

                <div className="boardTitleMobile">
                    <TableChartIcon/>
                    <DropdownButton title={board.title}>
                        {user.boardsApartOf.map((b, i) => {
                            return <Dropdown.Item key={"board-" + i} onClick={() => setBoard(b.id)}>{b.title}</Dropdown.Item>
                        })}

                        {user.boardsUserHasCreated.map((b, i) => {
                            return <Dropdown.Item key={"board-" + i} onClick={() => setBoard(b.id)}>{b.title}</Dropdown.Item>
                        })}
                        <Dropdown.Item onClick={() => setShowCreateBoard(true)}>+ Create Board</Dropdown.Item>
                    </DropdownButton>
                </div>

                <div className="boardOptions">
                    <button onClick={() => setShowAddTask(true)} className="addTaskBtn">+Add New Task</button>
                    <button onClick={() => setShowAddTask(true)} className="addTaskBtnMobile">+</button>
                    <div className='logoutContainer'>   
                        <MoreVertOutlinedIcon onClick={() => setShowLogoutOption(true)}/>
                        {showLogoutOption && <div onClick={logout} className='logoutOptionBoardSelected'>Log out</div>}
                    </div>
                </div>
            </>
        )
    } 

    return (
        <>
            <div className="boardTitle">{board.title}</div>

            <div className="boardTitleMobile">
                <TableChartIcon/>
                <DropdownButton title={board.title}>
                    {user.boardsApartOf.map((b, i) => {
                        return <Dropdown.Item key={"boardApartOf-" + i} onClick={() => setBoard(b.id)}>{b.title}</Dropdown.Item>
                    })}

                    {user.boardsUserHasCreated.map((b, i) => {
                        return <Dropdown.Item key={"boardCreated-" + i} onClick={() => setBoard(b.id)}>{b.title}</Dropdown.Item>
                    })}
                    <Dropdown.Item onClick={() => setShowCreateBoard(true)}>+ Create Board</Dropdown.Item>
                </DropdownButton>
            </div>
                    
            <div className="boardOptions">
                <button onClick={() => setShowAddTask(true)} className="addTaskBtn">+Add New Task</button>
                <button onClick={() => setShowAddTask(true)} className="addTaskBtnMobile">+</button>
                <div className="moreOptions" onClick={() => setShowBoardOptions(true)}>
                    <MoreVertOutlinedIcon/>
                </div>
            </div>
        </>
    )
}

export default ShowBoardMenuOptions;