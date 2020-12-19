import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import api from '../../api/userApi';

const useStyles = makeStyles((theme) => ({
    container:{
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notification:{
        fontSize: '2.5vw',
        textAlign: 'center'
    },
    loading:{
        width: '1em',
        height: '1em',
        display: 'inline-block',
        textAlign: 'left'
    }
}));

export default function MailValidate(props) {
    const classes = useStyles();
    const [loading,setLoading] = useState('...');
    const history = useHistory();

    // update loading
    setTimeout(() => {
        if (loading.length<3) {
            setLoading(loading+'.');
        } else {
            setLoading('');
        }
    },200);

    useEffect(()=>{
        // get username from url
        let username = (new URL(document.location)).searchParams.get('username');
        // call api for validation
        // api.validate(username);
        setTimeout(()=>history.push('/'),5000);
    },[]);

    return (
        <div className={classes.container}>
            <div className={classes.notification}>
                <b>Almost done!</b>
                <br/>
                Wait for a moment <div className={classes.loading}>{loading}</div>
            </div>
        </div>
    );
}