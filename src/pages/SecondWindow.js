import React from "react";
import D3Plot from "./D3Plot";
import {ipcConstants} from "../utils/IpcConstants";

const SecondWindow = () => {

    const electron = window.require('electron');
    const {ipcRenderer} = electron;
    const {ipcConstants} = require('../utils/IpcConstants');

    ipcRenderer.on(ipcConstants.TO_SECOND_WINDOW, ((event, args) => {
            alert('Got message: ' + args['messageType']);
        }
    ));

    const sendToMainWindow = () => {
        const args = {messageType: ipcConstants.TO_MAIN_WINDOW};
        ipcRenderer.send(ipcConstants.TO_MAIN_WINDOW, args);
    };
    return (
        <>
            <button onClick={sendToMainWindow}>Send message to main window</button>
            <div>
                <D3Plot/>
            </div>
        </>
    )
}

export default SecondWindow;