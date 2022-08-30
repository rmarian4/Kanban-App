import React, {useState} from 'react';
import Popup from './Popup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import './BoardOptionsPopup.css';
import {useDispatch, useSelector} from 'react-redux';
import { selectBoard, removeBoard, resetToInitialState } from '../features/kanbanBoardSlice';
import {removeBoardFromUser} from '../features/userSlice';
import AddUserPopup from './AddUserPopup';
import RemoveUserPopup from './RemoveUserPopup';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { logUserOut } from '../features/userSlice';

const BoardOptionsPopup = ({show, setShow}) => {
    const dispatch = useDispatch();
    const board = useSelector(selectBoard);
    const [showAddUserPopup, setShowAddUserPopup] = useState(false);
    const [showRemoveUserPopup, setShowRemoveUserPopup] = useState(false);
    const navigate = useNavigate();
    

    const deleteBoard = () => {
        let response = window.confirm("Are you sure you want to delete the board?")

        if(response) {
            dispatch(removeBoard(board.id))
            dispatch(removeBoardFromUser(board.id))
            setShow(false)
            navigate("/");
        }
        
    }

    const logout = () => {
        signOut(auth)
        .then(() => {
            dispatch(logUserOut())
            dispatch(resetToInitialState()) //set board back to null
            navigate('/')
        })
    }

    if(!show) {
        return null
    }

    if(showAddUserPopup) {
        return <AddUserPopup setShow={setShowAddUserPopup} setShowPopup={setShow} />
    }

    if(showRemoveUserPopup) {
        return <RemoveUserPopup setShow={setShowRemoveUserPopup} setShowPopup={setShow} />
    }

    return (
        <>

            <Popup>
                <div className='boardOptionsPopup'>
                    <div className='closePopup'>
                        <CloseIcon onClick={() => setShow(false)}/>
                    </div>
                    <div className='boardOptionsMenu' >
                        <div className='deleteBoardContainer' onClick={deleteBoard}>
                            <DeleteForeverIcon/>
                            <p>Delete Board</p>
                        </div>
                        <div className='addUserToBoardContainer' onClick={() => setShowAddUserPopup(true)}>
                            <PersonAddAltIcon/>
                            <p>Add User to Board</p>
                        </div>
                        {board.usersAddedToBoard.length > 0 && (
                             <div className='removeUserFromBoard' onClick={() => setShowRemoveUserPopup(true)}>
                                <PersonRemoveIcon/>
                                <p>Remove User from Board</p>
                            </div>
                        )}
                        <div className='logout' onClick={logout}>
                            <LogoutIcon/>
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
            </Popup>
        </>
    )
}

export default BoardOptionsPopup;