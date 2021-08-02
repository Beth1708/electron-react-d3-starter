import React, {useState} from "react";

import {useForm} from "react-hook-form";
import {Box, Grid, IconButton, Button, Paper, Tooltip, Typography} from "@material-ui/core";
import dayjs from "dayjs";

const MainWindow = () => {

    // https://coderrocketfuel.com/article/get-the-path-of-the-current-working-directory-in-node-js
    const fs = window.require('fs');
    const path = window.require('path');
    const electron = window.require('electron');
    const {ipcRenderer} = electron;
    const {ipcConstants} = require('../utils/IpcConstants');
    const promisify = require('util.promisify');
    const writeFileAsync = promisify(fs.writeFile);
    const readFileAsync = promisify(fs.readFile);

    const {register: registerWrite, handleSubmit: handleSubmitWrite} = useForm();
    const onSubmitWrite = async (data) => {
        console.log('In onSubmitWrite');
        console.dir(data);
        const outputDir = data['outputDir'];
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }

        const content = 'Some text here';
        const outputFilePath = path.join(outputDir, '/Sample.txt');
        try {
            await writeFileAsync(outputFilePath, content);
        } catch (err) {
            console.error(err);
            alert("Error writing file: : " + err);
        }
    }

    const {register: registerRead, handleSubmit: handleSubmitRead} = useForm();
    const onSubmitRead = async (data) => {
        const fileToRead = data['fileToRead'];
        let contents = 'Not read';
        try {
            contents = await readFileAsync(fileToRead);
        } catch (err) {
            console.error(err);
            alert("Error reading file: : " + err);
        }
        alert(contents);
    }

    ipcRenderer.on(ipcConstants.TO_MAIN_WINDOW, ((event, args) => {
            alert('Got message: ' + args['messageType']);
        }
    ));

    const sendToSecondWindow = () => {
        const args = {messageType: ipcConstants.TO_SECOND_WINDOW};
        ipcRenderer.send(ipcConstants.TO_SECOND_WINDOW, args);
    };

    const showSecondWindow = () => {
        ipcRenderer.send(ipcConstants.OPEN_SECOND_WINDOW);
    };

    const storeDate = () => {
        const nowStr = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]');
        ipcRenderer.invoke(ipcConstants.SET_STORE_VAL, ipcConstants.STORED_DATE, nowStr);
        alert('Stored the date: ' + nowStr);
    };

    const getDate = async () => {
        const date = await ipcRenderer.invoke(ipcConstants.GET_STORE_VAL, ipcConstants.STORED_DATE);
        alert('retrieved date is ' + date);
    };

    return (
        // <div>
        //     <form onSubmit={handleSubmitWrite(onSubmitWrite)}>
        //         <label htmlFor="outputDir">Output location:</label>
        //         <input size="100"  {...registerWrite("outputDir")} />
        //         <button type="submit">Write file</button>
        //     </form>
        //     <form onSubmit={handleSubmitRead(onSubmitRead)}>
        //         <label htmlFor="fileToRead">File to read:</label>
        //         <input size="100"  {...registerRead("fileToRead")} />
        //         <button type="submit">Read file</button>
        //     </form>
        //     <button onClick={showSecondWindow}>Show second window</button>
        //     <button onClick={sendToSecondWindow}>Send message to second window</button>
        // </div>


        <Grid container>
            <Grid item>
                <form onSubmit={handleSubmitWrite(onSubmitWrite)}>
                    <Box border={1}>
                        <Grid container>
                            <Grid item>
                                <Paper>
                                    <Box>
                                        <Typography variant={"body1"}>
                                            <label htmlFor="outputDir">Output location:</label>
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper>
                                    <Box>
                                        <Typography variant={"body1"}>
                                            <input size="100"  {...registerWrite("outputDir")} />
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Grid>
            <Grid item>
                <form onSubmit={handleSubmitRead(onSubmitRead)}>
                    <Box border={1}>
                        <Grid container>
                            <Grid item>
                                <Paper>
                                    <Box>
                                        <Typography variant={"body1"}>
                                            <label htmlFor="fileToRead">File to read:</label>
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper>
                                    <Box>
                                        <Typography variant={"body1"}>
                                            <input size="100"  {...registerRead("fileToRead")} />
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Grid>
            <Grid item>
                <Button variant='outlined' size='small' onClick={showSecondWindow}>Show second window</Button>
                <Button variant='outlined' size='small' onClick={sendToSecondWindow}>Send message to second window</Button>
            </Grid>
            <Grid item>
                <Button variant='outlined' size='small' onClick={storeDate}>Store date</Button>
                <Button variant='outlined' size='small' onClick={getDate}>Get stored date</Button>
            </Grid>
        </Grid>
    )
}

export default MainWindow;