import React from 'react';
import Sidebar from './Sidebar';
import Board from './Board';
import './Pagelayout.css';

const Pagelayout = () => {
    return (
        <div className='pagelayout'>
            <Sidebar/>
            <Board/>
        </div>
    )
}

export default Pagelayout;