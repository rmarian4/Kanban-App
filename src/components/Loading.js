import React from "react";
import Spinner from "react-spinkit";
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading">
            <Spinner name="ball-spin-fade-loader" color="#645fc6" />
        </div>
    )
}

export default Loading;