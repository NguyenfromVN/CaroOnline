import './index.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from '../../api/userApi';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function UserProfile() {
    const classes = useStyles();
    const history = useHistory();
    const [user, setUser] = useState({});

    useEffect(() => {
        const username = (new URL(document.location)).searchParams.get('user');

        (async () => {
            let response = await api.getUserByUsername(username);
            if (response.message) {
                history.push('/signin');
                return;
            }
            setUser(response);
        })();
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Profile
                </Typography>
                <div className='profile-content'>
                    <div>Username: <b>{user.username}</b></div><br />
                    <div>Email: <b>{user.email}</b></div><br />
                    <div>Games won: <b>{user.win}</b></div><br />
                    <div>Games lost: <b>{user.lose}</b></div><br />
                    <div>Trophy: <b>{user.trophy}</b></div>
                </div>
            </div>
        </Container>
    );
}