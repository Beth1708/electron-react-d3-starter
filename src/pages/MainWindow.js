import React, {useState} from "react";

import {useForm} from "react-hook-form";
// import {Box, Grid, IconButton, Button, Paper, Tooltip, Typography} from "@material-ui/core";

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

    const showSecondWindow = () => {};

    return (
        <div>
            <form onSubmit={handleSubmitWrite(onSubmitWrite)}>
                <label htmlFor="outputDir">Output location:</label>
                <input size="100"  {...registerWrite("outputDir")} />
                <button type="submit">Write file</button>
            </form>
            <form onSubmit={handleSubmitRead(onSubmitRead)}>
                <label htmlFor="fileToRead">File to read:</label>
                <input size="100"  {...registerRead("fileToRead")} />
                <button type="submit">Read file</button>
            </form>
            <button onClick={showSecondWindow}>Show second window</button>
        </div>


        // <Grid container>
        //     <Grid item>
        //         <form onSubmit={handleSubmitWrite(onSubmitWrite)}>
        //             <Box border={1}>
        //                 <Grid container>
        //                     <Grid item>
        //                         <Paper>
        //                             <Box>
        //                                 <Typography variant={"body1"}>
        //                                     <label htmlFor="outputDir">Output location:</label>
        //                                 </Typography>
        //                             </Box>
        //                         </Paper>
        //                     </Grid>
        //                     <Grid item>
        //                         <Paper>
        //                             <Box>
        //                                 <Typography variant={"body1"}>
        //                                     <input size="100"  {...registerWrite("outputDir")} />
        //                                 </Typography>
        //                             </Box>
        //                         </Paper>
        //                     </Grid>
        //                 </Grid>
        //             </Box>
        //         </form>
        //     </Grid>
        //     <Grid item>
        //         <form onSubmit={handleSubmitRead(onSubmitRead)}>
        //             <Box border={1}>
        //                 <Grid container>
        //                     <Grid item>
        //                         <Paper>
        //                             <Box>
        //                                 <Typography variant={"body1"}>
        //                                     <label htmlFor="fileToRead">File to read:</label>
        //                                 </Typography>
        //                             </Box>
        //                         </Paper>
        //                     </Grid>
        //                     <Grid item>
        //                         <Paper>
        //                             <Box>
        //                                 <Typography variant={"body1"}>
        //                                     <input size="100"  {...registerRead("fileToRead")} />
        //                                 </Typography>
        //                             </Box>
        //                         </Paper>
        //                     </Grid>
        //                 </Grid>
        //             </Box>
        //         </form>
        //     </Grid>
        //     <Grid item>
        //         <Button variant='outlined' size='small' onClick={showSecondWindow}>Show second window</Button>
        //
        //     </Grid>
        // </Grid>
    )
}

export default MainWindow;