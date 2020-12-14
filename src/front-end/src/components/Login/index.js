import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Typography, makeStyles, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login(props) {
    const classes = useStyles();
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const token = localStorage.getItem("token");
    const handleChangeLoginStatus = props.handleChangeLoginStatus;

    useEffect(() => {
        if (token) { // TODO
            history.push('/');
        }
    }, [])

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3001/login', {
                username: username,
                password: password
            }).then(function (response) {
                if (response.status === 200) {
                    const data = response.data;
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", data.user.username)
                    handleChangeLoginStatus();
                    alert('Successfully loged in. Welcome to Home!');
                    history.push('/');
                }
            })
        } catch (error) {
            alert('Username or password is not correct. Please try again!');
            history.push('/signin');
            console.log('Failed to fetch product list: ', error);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form method="POST" className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="Username"
                        name="username"
                        onChange={handleUsernameChange}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={handlePasswordChange}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}