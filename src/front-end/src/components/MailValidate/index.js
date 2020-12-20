import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import api from '../../api/userApi';

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
    },
    loading: {
        width: '1em',
        height: '1em',
        display: 'inline-block',
        textAlign: 'left'
    }
}));

let createCallback=0;
const timeInterval=200;

export default function MailValidate(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState('...');
    const history = useHistory();

    // update loading
    let current=new Date().getTime();
    // create only 1 callback at a time
    if (current-createCallback>=timeInterval){
        createCallback=current;
        setTimeout(() => {
            if (loading.length < 3) {
                setLoading(loading + '.');
            } else {
                setLoading('');
            }
        }, timeInterval);
    }

    useEffect(async () => {
        // get username from url
        let username = (new URL(document.location)).searchParams.get('username');
        // call api for validation
        await api.validate(username);
        // delete all local storages on App
        localStorage.setItem("username", "");
        localStorage.setItem("loginStatus", "false");
        localStorage.setItem("token", "");
        setTimeout(() => history.push('/signin'), 5000);
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.notification}>
                <b>Almost done!</b>
                <br />
                Wait for a moment <div className={classes.loading}>{loading}</div>
            </div>
        </div>
    );
}