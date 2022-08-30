import React from 'react';
import './Popup.css';

const Popup = (props) => {
    return (
        <div className='popup'>
            <div className='popupInner'>
                {props.children}
            </div>
        </div>
    )
   
}

export default Popup;