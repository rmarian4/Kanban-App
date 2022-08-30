import React, {useState} from 'react';
import Sidebar from './Sidebar';
import NoBoardSelected from './NoBoardSelected';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { fetchBoard } from '../features/kanbanBoardSlice';
import './PagelayoutNoBoardSelected.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import CreateBoardPopup from './CreateBoardPopup';
import { useNavigate } from 'react-router-dom';
import TableChartIcon from '@mui/icons-material/TableChart';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { signOut } from 'firebase/auth';
import { logUserOut } from '../features/userSlice';
import { auth } from '../firebase/firebase';

const PagelayoutNoBoardSelected = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [showCreateBoardPopup, setShowCreateBoardPopup] = useState(false);
    const [showLogoutOption, setShowLogoutOption] = useState(false);

    const selectBoard = id => {
        dispatch(fetchBoard(id))
        navigate(`/${id}`)
    }

    const logout = () => {
        signOut(auth)
        .then(() => {
            dispatch(logUserOut())
            navigate('/')
        })
    }

    return (
        <>
            <div className='pagelayoutNoBoardSelected'>
                <Sidebar />
                <NoBoardSelected/>
            </div>

            <CreateBoardPopup setShow={setShowCreateBoardPopup} show={showCreateBoardPopup}/>

            <div className='pagelayoutNoBoardSelectedMobile' onClick={() => showLogoutOption ? setShowLogoutOption(false) : null}>
                <div className='topMenuNoBoardSelected'>
                    
                    <div className='selectBoardContainer'>
                        <TableChartIcon />
                        <DropdownButton title="Select Board">
                            {user.boardsApartOf.map((b, i) => {
                                return <Dropdown.Item key={"boardApartOf-" + i} onClick={() => selectBoard(b.id)}>{b.title}</Dropdown.Item>
                            })}

                            {user.boardsUserHasCreated.map((b, i) => {
                                return <Dropdown.Item key={"boardCreated-" + i} onClick={() => selectBoard(b.id)}>{b.title}</Dropdown.Item>
                            })}
                        </DropdownButton>
                    </div>

                    <div className='menuOptions'>
                        <button onClick={() => setShowCreateBoardPopup(true)} className='addBoard'>+ Board</button>
                        <MoreVertOutlinedIcon onClick={() => setShowLogoutOption(true)}/>
                        {showLogoutOption && <div onClick={logout} className='logoutOption'>Log out</div>}
                    </div>
                </div>
                <NoBoardSelected/>
            </div>
        </>
    )
}

export default PagelayoutNoBoardSelected;