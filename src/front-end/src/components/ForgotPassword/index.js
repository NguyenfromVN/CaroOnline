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

export default function ForgotPassword() {
    const classes = useStyles();
    const history = useHistory();

    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const response = await api.changePassword(email);
        if (response.message == "No user has been found") {
            alert("This email does not exist. Please try again!");
            return;
        }
        history.push('/check-mail');
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>
                <form className={classes.form} method="POST">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Enter your email address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
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
                        onClick={handleForgotPassword}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Container>
    );
}