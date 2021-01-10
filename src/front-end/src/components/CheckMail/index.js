import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notification: {
        fontSize: '2.5vw',
        textAlign: 'center'
    }
}));

export default function CheckMail(props) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.notification}>
                One more step, check out your mail to finish the comfirmation!
            </div>
        </div>
    );
}