import React, {useState} from 'react';
import Popup from './Popup';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector, useDispatch } from 'react-redux';
import { selectBoard } from '../features/kanbanBoardSlice';
import { removeUsersFromKanbanBoard } from '../features/kanbanBoardSlice'; 
import Form from 'react-bootstrap/Form';
import './RemoveUserPopup.css';

//setShow function determines whether the RemoveUserPopup should be shown. If true is passed to the set show function then the AddUserPop will be shown
// if false is passed in then the main board options menu will be shown (i.e. the menu where the user can choose to add a user, remove a user, or delete the board)

// setShowPopup function is used to close the entire popup menu. If true is passed in then the popup will be shown, if false is passed in to the function then
// the popup will close.

const RemoveUserPopup = ({setShow, setShowPopup}) => {
    const dispatch = useDispatch();
    const board = useSelector(selectBoard);
    const [usersToBeRemoved, setUsersToBeRemoved] = useState([]); //list of id's of users who are to be removed from the board

    const removeUsers = () => {
        dispatch(removeUsersFromKanbanBoard(board.id, usersToBeRemoved))
        closePopup()
    }

    const closePopup = () => {
        setShow(false)
        setShowPopup(false)
    }

    return (
        <Popup>
            <div className='removeUserPopup'>

                <div className='closeRemoveUserPopup'>
                    <ArrowBackIcon onClick={() => setShow(false)}/>
                    <CloseIcon onClick={closePopup} />
                </div>
                
                
                <h3>Select Users to Remove</h3>
                <div className='usersListContainer'>
                    {board.usersAddedToBoard.map((u, i) => {
                        return (
                            <div className='userContainer' key={'user-'+i}>
                                <Form.Check
                                    defaultChecked={false}
                                    onChange={() => {
                                        if(usersToBeRemoved.includes(u.id)){
                                            const usersToBeRemovedCopy = [...usersToBeRemoved]
                                            let indexOfUserId = usersToBeRemovedCopy.indexOf(u.id)
                                            usersToBeRemovedCopy.splice(indexOfUserId, 1)
                                            setUsersToBeRemoved(usersToBeRemovedCopy)
                                        } else {
                                            setUsersToBeRemoved([...usersToBeRemoved, u.id])
                                        }
                                    }}
                                />
                                <div className='userInfo'>
                                    {u.name} ({u.email})
                                </div>
                            </div>
                        )
                    })}
                </div>


                <input type='button' value='Remove Users' className='removeUsersBtn' onClick={removeUsers} />
                    

                

            </div>
        </Popup>
    )
}

export default RemoveUserPopup;