import React, {useEffect, useState} from 'react'
import './Sidebar.css';
import TableChartIcon from '@mui/icons-material/TableChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, selectUser } from '../features/userSlice';
import { fetchBoard, resetToInitialState, selectBoard } from '../features/kanbanBoardSlice';
import CreateBoardPopup from './CreateBoardPopup';
import { useNavigate, useLocation } from 'react-router-dom';
import {auth} from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { logUserOut } from '../features/userSlice';

const Sidebar = () => {
    const navigate = useNavigate();
    const [selectedBoard, setSelectedBoard] = useState(null);
    const board = useSelector(selectBoard);
    const location = useLocation();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [showCreateBoard, setShowCreateBoard] = useState(false);


    useEffect(() => {
        if(board === null && location !== '/') {
            let id = location.pathname.slice(1) //get rid of '/' char in the path name
            setSelectedBoard(id)
        }
      }, [])

    useEffect(() => { //for when user creates new board
        if(board !== null && selectedBoard !== board.id) {
            setSelectedBoard(board.id)
        }
    }, [board])
    
    
    const setBoard = (id) => {
        setSelectedBoard(id)
        navigate(`/${id}`)
        dispatch(fetchBoard(id, user.id))
        .catch(err => {
            navigate("/")
            dispatch(resetToInitialState()) //reset board to null
            dispatch(fetchUser(user.id))
        })
    }

    

    const logout = () => {
        signOut(auth)
        .then(() => {
            dispatch(logUserOut())
            dispatch(resetToInitialState()) //reset board to null
            navigate('/')
        })
    }

    return(
        <>
            <CreateBoardPopup show={showCreateBoard} setShow={setShowCreateBoard} />

            <div className='sidebar'>
                <div>
                    <div className='title'>
                        <h1>kanban</h1>
                    </div>

                    <div className='boardList'>
                        <div className='boardListTitle'>A L L &ensp;B O A R D S &ensp;({user.boardsApartOf.length+user.boardsUserHasCreated.length})</div>
                        <div className='boardsCreatedList'>BOARDS YOU HAVE CREATED ({user.boardsUserHasCreated.length}):</div>
                        {user.boardsUserHasCreated.map((b, i) => {
                            return(
                                <div key={i} onClick={() => setBoard(b.id)} className={selectedBoard === b.id ? 'boardListItemSelected' : 'boardListItem'}>
                                    <TableChartIcon/>
                                    <div>
                                        {b.title}
                                    </div>
                                </div>
                            )
                        })}
                        <div className='boardsApartOfList'>BOARDS YOU HAVE BEEN ADDED TO ({user.boardsApartOf.length}):</div>
                        {user.boardsApartOf.map((b, i) => {
                            return(
                                <div key={i} onClick={() => setBoard(b.id)} className={selectedBoard === b.id ? 'boardListItemSelected' : 'boardListItem'}>
                                    <TableChartIcon/>
                                    <div>
                                        {b.title}
                                    </div>
                                </div>
                            )
                        })}
                        
                        <div onClick={() => setShowCreateBoard(true)} className='createNewBoardButton'>
                                <TableChartIcon/>
                                <div>
                                    +Create New Board
                                </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='hideSidebarBtnContainer'>
                        <div onClick={logout} className='logoutBtn'>
                            <LogoutIcon/>
                            &ensp;Log Out
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar