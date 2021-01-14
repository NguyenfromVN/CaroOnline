import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Typography, makeStyles, Container, Grid } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import './index.css';
import api from '../../api/userApi';
import facebookImg from '../../images/facebook.png';
import googleImg from '../../images/google.png';

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
        // localStorage.setItem("token", '');
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

        let response = await api.login(username, password);
        if (response.message) {
            if (response.message == 'Invalid') {
                alert("Username or password is not correct. Please try again!");
            } else if (response.message == 'Account is blocked') {
                alert('Oops! Your account is blocked!');
            } else {
                alert("Check out your email to validate this account!");
            }
            history.push('/signin');
        } else {
            const data = response.data;
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username)
            handleChangeLoginStatus();
            alert('Successfully loged in. Welcome to Home!');
            history.push('/');
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
                    <Grid container justify="flex-end" style={{ margin: "10px 0" }}>
                        <Grid item>
                            <Link to='/forgot-password' variant="body2" style={{ textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </Grid>
                    </Grid>
                    <div className='link'>
                        <button className='social-button' onClick={() => { window.location.href = 'https://caroonlinephan.herokuapp.com/auth/fb' }}>
                            <img src={facebookImg} className='facebook-login-image' alt='facebook-img'></img>
                        </button>
                        <button className='social-button' onClick={() => { window.location.href = 'https://caroonlinephan.herokuapp.com/auth/google' }}>
                            <img src={googleImg} className='google-login-image' alt='google-img'></img>
                        </button>
                    </div>
                </form>
            </div>
        </Container>
    );
}