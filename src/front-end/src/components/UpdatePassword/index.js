import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Grid, Typography, makeStyles, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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

export default function UpdatePassword() {
    const classes = useStyles();
    const history = useHistory();

    let email = (new URL(document.location)).searchParams.get('email');
    const [password, setPassword] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const response = await api.updatePassword(email, password);
        if (response.message == "password changed") {
            alert("You have successfully changed your password. You can login now!");
            localStorage.setItem("username", "");
            localStorage.setItem("loginStatus", "false");
            localStorage.setItem("token", "");
            history.push("/signin");
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
                    Update Password
                </Typography>
                <form className={classes.form} method="POST">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="Enter your new password"
                                name="password"
                                type="password"
                                autoComplete="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                autoFocus
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleUpdatePassword}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Container>
    );
}