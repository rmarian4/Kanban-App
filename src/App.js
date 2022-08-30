import React from 'react';
import './App.css';
import { useSelector } from 'react-redux';
import {selectUser} from './features/userSlice';
import Pagelayout from './components/Pagelayout';
import PagelayoutNoBoardSelected from './components/PagelayoutNoBoardSelected';
import {Routes, Route} from 'react-router-dom';
import Loading from './components/Loading';
import Login from './components/Login';
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from './firebase/firebase';


function App() {
  const [userSignedIn, loading] = useAuthState(auth);
  const user = useSelector(selectUser);
  
  if(userSignedIn === null){
    return <Login/>
  } else if(userSignedIn && user ===null) { //if user has been fetched from firebase but user is null then that means the user is still loading so show loading page
      return <Loading/>
  }

 
    return (
      
        <Routes>
          <Route path="/" element={<PagelayoutNoBoardSelected/>}/>
          <Route path="/:id" element={<Pagelayout/>} />
        </Routes>
        
 
    )
}

export default App;
